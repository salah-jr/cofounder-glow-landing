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

// OpenAI API call function with proper error handling
async function callOpenAI(messages: ChatMessage[], openaiApiKey: string) {
  console.log('Making OpenAI API request with', messages.length, 'messages')
  
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 300,
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

    // Prepare messages for OpenAI - send user message directly as requested
    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message.trim() }
    ]

    console.log('Prepared messages for OpenAI:', messages.length)

    // Call OpenAI API
    let openaiData
    try {
      openaiData = await callOpenAI(messages, openaiApiKey)
    } catch (openaiError) {
      console.error('OpenAI API call failed:', openaiError)
      
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