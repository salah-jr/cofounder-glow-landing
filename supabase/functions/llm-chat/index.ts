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
  maxRetries: number = 3,
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
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000 // Add jitter
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

// OpenAI API call function with proper authentication
async function callOpenAI(messages: ChatMessage[], openaiApiKey: string) {
  console.log('Making OpenAI API request...')
  
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 150, // Reduced to minimize rate limit issues
    temperature: 0.7,
    stream: false,
  }

  console.log('Request payload:', JSON.stringify(requestBody, null, 2))

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Supabase-Edge-Function/1.0',
    },
    body: JSON.stringify(requestBody),
  })

  console.log('OpenAI API response status:', response.status)

  if (!response.ok) {
    let errorMessage = `OpenAI API error: ${response.status}`
    let errorDetails = ''
    
    try {
      const errorData = await response.json()
      console.log('OpenAI error response:', errorData)
      
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
        errorDetails = errorData.error.type || ''
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError)
      errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
    }
    
    console.error('OpenAI API error:', errorMessage, errorDetails)
    
    // Create a custom error that includes the status code
    const error = new Error(errorMessage) as any
    error.status = response.status
    error.type = errorDetails
    throw error
  }

  const responseData = await response.json()
  console.log('OpenAI API response received successfully')
  
  return responseData
}

Deno.serve(async (req) => {
  console.log('Edge function called:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    console.log('Authorization header present')

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
      console.error('Authentication failed:', authError?.message)
      throw new Error('Unauthorized')
    }

    console.log('User authenticated:', user.id)

    // Parse the request body
    const requestBody = await req.json()
    console.log('Request body received:', requestBody)
    
    const { message, conversationHistory = [] }: ChatRequest = requestBody

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Valid message is required')
    }

    // Get the OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    console.log('OpenAI API key found, key length:', openaiApiKey.length)

    // Prepare the conversation for OpenAI - send user message directly
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message.trim() }
    ]

    console.log(`Prepared ${messages.length} messages for OpenAI`)

    // Make request to OpenAI with retry mechanism
    const openaiData = await retryWithBackoff(
      () => callOpenAI(messages, openaiApiKey),
      3, // Max 3 retries
      2000 // Start with 2 second delay
    )

    const aiResponse = openaiData.choices?.[0]?.message?.content

    if (!aiResponse) {
      console.error('No response content from OpenAI:', openaiData)
      throw new Error('No response from OpenAI')
    }

    console.log('OpenAI request successful, response length:', aiResponse.length)

    // Return the AI response
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse.trim(),
        usage: openaiData.usage || {}
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
    } else if (error.message === 'Unauthorized') {
      errorMessage = 'User authentication required'
      statusCode = 401
    } else if (error.message.includes('Valid message is required')) {
      errorMessage = 'Please provide a valid message'
      statusCode = 400
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    )
  }
})