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

// Enhanced system prompt for the AI co-founder assistant
const SYSTEM_PROMPT = `You are an AI co-founder assistant helping entrepreneurs build and launch their startups. Your role is to provide strategic business advice, practical guidance, and actionable insights to help turn ideas into successful businesses.

Your expertise covers:
- Business strategy and planning
- Market research and validation
- Product development and MVP creation
- Customer discovery and user research
- Revenue models and pricing strategies
- Fundraising and investor relations
- Team building and hiring
- Marketing and growth strategies
- Financial planning and budgeting
- Legal and operational considerations
- Competitive analysis
- Go-to-market strategies

Communication style:
- Be encouraging and supportive while being realistic
- Ask clarifying questions to better understand their specific situation
- Provide actionable, step-by-step guidance
- Use examples and case studies when relevant
- Keep responses conversational and easy to understand
- Focus on practical next steps they can take immediately
- Be concise but thorough (2-3 paragraphs typically)

Remember: You're not just answering questions - you're actively helping them build a successful startup. Think like an experienced entrepreneur who wants to see them succeed.`;

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

// OpenAI API call function with proper error handling
async function callOpenAI(messages: ChatMessage[], openaiApiKey: string) {
  console.log('Making OpenAI API request with', messages.length, 'messages')
  
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 500,
    temperature: 0.7,
    stream: false,
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  console.log('OpenAI API response status:', response.status)

  if (!response.ok) {
    let errorMessage = `OpenAI API error: ${response.status}`
    
    try {
      const errorData = await response.json()
      console.log('OpenAI error response:', errorData)
      
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError)
      errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
    }
    
    console.error('OpenAI API error:', errorMessage)
    
    const error = new Error(errorMessage) as any
    error.status = response.status
    throw error
  }

  const responseData = await response.json()
  console.log('OpenAI API response received successfully')
  
  return responseData
}

Deno.serve(async (req) => {
  console.log('=== Edge function called ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get and validate authorization header
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Authorization header required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse request body
    let requestBody
    try {
      const bodyText = await req.text()
      console.log('Raw request body:', bodyText)
      requestBody = JSON.parse(bodyText)
      console.log('Parsed request body:', requestBody)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const { message, conversationHistory = [] }: ChatRequest = requestBody

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid message provided:', message)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Valid message is required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Initialize Supabase client for user verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    console.log('User verification result:', { user: !!user, error: authError?.message })
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User authentication failed'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    console.log('User authenticated successfully:', user.id)

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log('OpenAI API key found, length:', openaiApiKey.length)

    // Prepare messages for OpenAI with system prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message.trim() }
    ]

    console.log('Prepared messages for OpenAI:', messages.length)

    // Call OpenAI API with retry logic
    let openaiData
    try {
      console.log('Calling OpenAI with retry logic...')
      openaiData = await retryWithBackoff(
        () => callOpenAI(messages, openaiApiKey),
        5, // Max 5 retries
        1000 // Start with 1 second delay
      )
    } catch (openaiError) {
      console.error('OpenAI API call failed after retries:', openaiError)
      
      // Handle specific OpenAI errors
      let errorMessage = 'Failed to get AI response'
      let statusCode = 500
      
      if ((openaiError as any).status === 429) {
        errorMessage = 'RATE_LIMIT_EXCEEDED'
        statusCode = 429
      } else if ((openaiError as any).status === 401) {
        errorMessage = 'OpenAI API authentication failed'
        statusCode = 401
      } else if ((openaiError as any).status >= 500) {
        errorMessage = 'OpenAI service temporarily unavailable'
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

    const aiResponse = openaiData.choices?.[0]?.message?.content

    if (!aiResponse) {
      console.error('No response content from OpenAI:', openaiData)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No response from OpenAI'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log('OpenAI request successful, response length:', aiResponse.length)

    // Return successful response
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
    console.error('Unexpected error in edge function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})