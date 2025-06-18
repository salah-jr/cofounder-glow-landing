import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  message: string
  conversationHistory?: ChatMessage[]
}

// Enhanced retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`Final attempt failed after ${maxRetries} retries:`, lastError.message)
        throw lastError
      }
      
      // Check if it's a rate limit error (429) or server error (5xx)
      const errorStatus = (error as any).status
      if (errorStatus === 429 || (errorStatus >= 500 && errorStatus < 600)) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`API error ${errorStatus}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // For other errors (4xx except 429), throw immediately
        throw error
      }
    }
  }
  
  throw lastError!
}

// OpenAI API call function with better error handling
async function callOpenAI(messages: ChatMessage[], openaiApiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      stream: false,
    }),
  })

  if (!response.ok) {
    let errorMessage = `OpenAI API error: ${response.status}`
    
    try {
      const errorData = await response.json()
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch {
      // If we can't parse the error response, use the status text
      errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
    }
    
    console.error('OpenAI API error:', errorMessage)
    
    // Create a custom error that includes the status code
    const error = new Error(errorMessage) as any
    error.status = response.status
    throw error
  }

  return response.json()
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse the request body
    const { message, conversationHistory = [] }: ChatRequest = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Get the OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    console.log('OpenAI API key found, proceeding with request...')

    // Minimal system prompt - let user messages drive the conversation
    const systemPrompt = `You are a helpful AI assistant. Respond naturally and helpfully to the user's messages.`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    console.log(`Making OpenAI request with ${messages.length} messages...`)

    // Make request to OpenAI with enhanced retry mechanism
    const openaiData = await retryWithBackoff(
      () => callOpenAI(messages, openaiApiKey),
      5, // Max 5 retries
      1000 // Start with 1 second delay
    )

    const aiResponse = openaiData.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    console.log('OpenAI request successful')

    // Return the AI response
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse.trim(),
        usage: openaiData.usage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in llm-chat function:', error)
    
    // Provide more specific error messages
    let errorMessage = error.message || 'An unexpected error occurred'
    let statusCode = 500
    
    if ((error as any).status === 429) {
      errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.'
      statusCode = 429
    } else if ((error as any).status === 401) {
      errorMessage = 'OpenAI API authentication failed. Please check the API key configuration.'
      statusCode = 401
    } else if ((error as any).status >= 500) {
      errorMessage = 'OpenAI service is temporarily unavailable. Please try again later.'
      statusCode = 503
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    )
  }
})