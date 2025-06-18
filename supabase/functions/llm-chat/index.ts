import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequest {
  message: string
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const { message, conversationHistory = [] }: ChatRequest = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate AI response based on the message
    // This is a simple rule-based response system since we don't have access to external AI APIs
    const aiResponse = generateCofounderResponse(message, conversationHistory)

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
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateCofounderResponse(message: string, conversationHistory: Array<{role: string, content: string}>): string {
  const lowerMessage = message.toLowerCase()
  
  // Analyze the message and provide contextual responses
  if (lowerMessage.includes('problem') || lowerMessage.includes('solve')) {
    return "That's a great start! Understanding the problem is crucial. Can you tell me more about who specifically faces this problem? What's their current solution, and why isn't it working well for them?"
  }
  
  if (lowerMessage.includes('target') || lowerMessage.includes('audience') || lowerMessage.includes('customer')) {
    return "Excellent! Knowing your target audience is key. How do you currently reach these customers? What channels do they use, and where do they spend their time? Understanding their behavior will help us craft a better go-to-market strategy."
  }
  
  if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('monetize')) {
    return "Revenue model is critical for sustainability. Have you considered different pricing strategies? Will you use subscription, one-time payment, freemium, or usage-based pricing? What would your customers be willing to pay for this solution?"
  }
  
  if (lowerMessage.includes('competition') || lowerMessage.includes('competitor')) {
    return "Understanding the competitive landscape is smart. What makes your approach different? Is it better technology, user experience, pricing, or serving an underserved segment? Your unique value proposition will be key to standing out."
  }
  
  if (lowerMessage.includes('mvp') || lowerMessage.includes('minimum viable product') || lowerMessage.includes('prototype')) {
    return "Building an MVP is a great approach! What's the core feature that solves the main problem? Start with the simplest version that provides value. What can you build in 2-4 weeks to test your hypothesis with real users?"
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('cofounder') || lowerMessage.includes('hire')) {
    return "Team building is crucial for scaling. What skills are you missing that are critical for your success? Consider whether you need technical expertise, business development, or domain knowledge. Look for complementary skills rather than duplicating what you already have."
  }
  
  if (lowerMessage.includes('funding') || lowerMessage.includes('investment') || lowerMessage.includes('capital')) {
    return "Funding can accelerate growth, but timing matters. Do you have early traction or validation? Bootstrap as long as possible to maintain control and prove the concept. When you do raise, make sure you're raising for growth, not just to keep the lights on."
  }
  
  if (lowerMessage.includes('marketing') || lowerMessage.includes('growth') || lowerMessage.includes('users')) {
    return "Growth strategy should align with where your customers are. Are they on social media, professional networks, or do they prefer direct outreach? Start with one channel, master it, then expand. What's your plan for the first 100 customers?"
  }
  
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('development')) {
    return "Technology should serve your business goals, not the other way around. Choose tools and frameworks that let you move fast and iterate quickly. What's the simplest tech solution that can deliver your core value proposition?"
  }
  
  if (lowerMessage.includes('validation') || lowerMessage.includes('test') || lowerMessage.includes('feedback')) {
    return "Validation is everything! Have you talked to potential customers about this problem? Their feedback will be more valuable than any assumption. How can you test your solution with real users before building the full product?"
  }
  
  // Default responses based on conversation length
  const conversationLength = conversationHistory.length
  
  if (conversationLength < 2) {
    return "I'd love to learn more about your idea! What specific problem are you trying to solve, and who experiences this problem most acutely? Understanding the pain point is the foundation of any successful startup."
  }
  
  if (conversationLength < 5) {
    return "That's interesting! Let's dig deeper. How big is this market opportunity? Have you identified your ideal customer profile? The more specific you can be about who you're serving, the better we can tailor your solution."
  }
  
  // Generic encouraging responses
  const genericResponses = [
    "That's a thoughtful approach! What's the next step you're considering to move this forward?",
    "I can see you've put thought into this. What's the biggest challenge you're facing right now?",
    "Interesting perspective! How do you plan to validate this assumption with potential customers?",
    "That makes sense. What resources or support do you think you'll need to execute on this?",
    "Good thinking! What metrics will you use to measure success in the early stages?",
    "I like where this is going. What's your timeline for getting the first version in front of users?",
    "That's a solid foundation. What's the one thing that, if you got it right, would make the biggest difference?",
    "You're on the right track. What feedback have you gotten from others about this idea?",
    "That's worth exploring further. What would success look like for you in the first 6 months?",
    "Great insight! What's the most important thing you need to figure out next?"
  ]
  
  return genericResponses[Math.floor(Math.random() * genericResponses.length)]
}