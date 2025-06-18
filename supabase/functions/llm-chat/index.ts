import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory?: ChatMessage[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { message, conversationHistory = [] }: RequestBody = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Build conversation context
    let systemPrompt = `You are an experienced startup co-founder and business advisor. Your role is to help entrepreneurs refine their startup ideas through thoughtful questions and insights. 

Key guidelines:
- Ask probing questions to help clarify the problem, target market, and solution
- Provide constructive feedback and suggestions
- Help identify potential challenges and opportunities
- Keep responses conversational and encouraging
- Focus on practical business advice
- Be concise but thorough in your responses

The user is working on a startup idea and needs your guidance.`

    // Prepare messages for the AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    // For now, we'll provide a mock response since we don't have access to external AI APIs
    // In a real implementation, you would call an AI service like OpenAI, Anthropic, etc.
    const mockResponses = [
      "That's an interesting problem to tackle! Can you tell me more about who specifically faces this challenge? Understanding your target audience will help us validate if this is a widespread issue worth solving.",
      
      "Great insight! Now I'm curious about the current solutions people use for this problem. What are they doing now, and why isn't it working well for them?",
      
      "I can see the potential here. Have you had a chance to talk to potential customers about this problem? Their feedback could reveal important details about how urgent this issue really is for them.",
      
      "This sounds promising! What would make your solution different or better than what's already available? Think about your unique value proposition.",
      
      "Excellent direction! How do you envision people discovering and starting to use your solution? Understanding the customer journey will be crucial for your go-to-market strategy.",
      
      "That's a solid foundation. What do you think would be the biggest challenge in building and scaling this solution? It's good to anticipate potential roadblocks early.",
      
      "I like where this is heading! Have you thought about how you might validate this idea with minimal investment? Sometimes a simple landing page or prototype can provide valuable insights.",
      
      "Interesting approach! What metrics would tell you that your solution is actually solving the problem effectively? Defining success early will help guide your development.",
      
      "Good thinking! Who do you see as your main competitors, and what can you learn from their successes and failures?",
      
      "That makes sense! What would need to be true about the market for your startup to succeed? Understanding these assumptions will help you focus your validation efforts."
    ]

    // Select a response based on conversation length or randomize
    const responseIndex = Math.min(conversationHistory.length, mockResponses.length - 1)
    const aiResponse = mockResponses[responseIndex] || mockResponses[Math.floor(Math.random() * mockResponses.length)]

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in llm-chat function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})