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

// Retry function with exponential backoff
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
        throw lastError
      }
      
      // Check if it's a rate limit error (429) - Fixed the condition
      if ((error as any).status === 429) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // For non-rate-limit errors, throw immediately
        throw error
      }
    }
  }
  
  throw lastError!
}

// OpenAI API call function
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
      max_tokens: 500,
      temperature: 0.7,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('OpenAI API error:', errorData)
    
    // Create a custom error that includes the status code
    const error = new Error(`OpenAI API error: ${response.status}`) as any
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

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Prepare the conversation for OpenAI
    const systemPrompt = `You are an AI co-founder assistant helping entrepreneurs build their startups. You provide strategic business advice, help with planning, market research, product development, and general startup guidance. Be helpful, insightful, and encouraging while providing practical advice.

Key areas you help with:
- Business strategy and planning
- Market research and validation
- Product development guidance
- Fundraising advice
- Team building
- Marketing and growth strategies
- Financial planning
- Legal and operational considerations

Keep responses conversational, actionable, and tailored to startup needs. Ask clarifying questions when needed to provide better guidance.`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    // Make request to OpenAI with retry mechanism
    const openaiData = await retryWithBackoff(
      () => callOpenAI(messages, openaiApiKey),
      3, // Max 3 retries
      2000 // Start with 2 second delay
    )

    const aiResponse = openaiData.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    // Return the AI response
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        usage: openaiData.usage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in llm-chat function:', error)
    
    // Provide more specific error messages for rate limiting
    let errorMessage = error.message || 'An unexpected error occurred'
    if ((error as any).status === 429) {
      errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.'
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: (error as any).status === 429 ? 429 : 500,
      }
    )
  }
})

// Import statements need to be at the top, but keeping them here for clarity
import { createClient } from 'npm:@supabase/supabase-js@2'