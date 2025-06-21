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
  currentPhaseId?: string
  currentStepId?: string
  phaseNumber?: number
  stepNumber?: number
}

// Define the phase structure that matches the frontend
const mainPhases = [
  { id: "shape", label: "Shape Your Idea" },
  { id: "validate", label: "Validate the Idea and the Market" },
  { id: "build", label: "Build the Business" },
  { id: "mvp", label: "Plan the MVP" },
  { id: "pitch", label: "Pitch Your Idea" }
];

const phaseTasks = {
  "shape": [
    { id: "shape-1", title: "Define the Problem & Target User" },
    { id: "shape-2", title: "Craft Your Idea One-Liner" },
    { id: "shape-3", title: "Spot the Market Gap" },
    { id: "shape-4", title: "Capture Key Assumptions" }
  ],
  "validate": [
    { id: "validate-1", title: "Research the Market" },
    { id: "validate-2", title: "Design the Interview" },
    { id: "validate-3", title: "Practice the Interview" },
    { id: "validate-4", title: "Talk to Real Users" },
    { id: "validate-5", title: "Learn and Compare" }
  ],
  "build": [
    { id: "build-1", title: "Define Value & Market Positioning" },
    { id: "build-2", title: "Identify Risks and Mitigations" },
    { id: "build-3", title: "Outline Revenue Model & Pricing" },
    { id: "build-4", title: "Estimate Costs & Required Resources" },
    { id: "build-5", title: "Assemble the Business Case" }
  ],
  "mvp": [
    { id: "mvp-1", title: "Map the User Flow" },
    { id: "mvp-2", title: "Prioritize the Features" },
    { id: "mvp-3", title: "Design & Build Prompts" },
    { id: "mvp-4", title: "Plan a Usability Test" },
    { id: "mvp-5", title: "Run User Validation" }
  ],
  "pitch": [
    { id: "pitch-1", title: "Tell the Startup Story" },
    { id: "pitch-2", title: "Create Your Launch Signal" },
    { id: "pitch-3", title: "Plan Your Next Moves" },
    { id: "pitch-4", title: "Build Your Pitch Deck" }
  ]
};

function getSystemPrompt(currentPhaseId?: string, currentStepId?: string, phaseNumber?: number, stepNumber?: number): string {
  // Base system prompt
  const basePrompt = `You are Co-founder, an AI startup co-pilot built to help first-time, non-business-expert founders turn ideas into real, testable, pitchable startups. You are the user's persistent co-creator across a structured, step-by-step journey.

You will guide the user through a full startup creation process that unfolds in five clearly defined phases:

1. Shape Your Idea  
2. Validate the Idea and the Market  
3. Build the Business  
4. Plan the MVP  
5. Pitch Your Idea  

You will remain in a single, continuous conversation thread across this journey, building on the user's inputs, preserving context, and co-creating structured startup deliverables in each phase.

Your role is not to act like a chatbot or assistant. Instead, think of yourself as:
- A strategic co-founder sitting beside the user at a whiteboard  
- A structured, supportive guide who helps them think clearly  
- A patient builder who co-creates startup assets and logic alongside the user  
- An experienced startup mind who adapts to the user's level — especially if they have no prior business experience`;

  // If no phase/step context is provided, use the default Step 0A prompt
  if (!currentPhaseId || !currentStepId || !phaseNumber || !stepNumber) {
    return `${basePrompt}
---

Step 0A – Context & Objective
This is the first step in the user's journey. They've submitted a short business idea (1–2 sentences) through a single input field.

At this stage:

The experience is non-conversational

Your job is to generate structured content for a static UI screen

Your Task
Generate 5 beginner-friendly multiple-choice questions that help clarify and expand the user's idea.

Each question should be short, simple, and non-technical`;
  }

  // Get current phase and step information
  const currentPhase = mainPhases.find(p => p.id === currentPhaseId);
  const currentTasks = phaseTasks[currentPhaseId as keyof typeof phaseTasks] || [];
  const currentTask = currentTasks.find(t => t.id === currentStepId);

  // Add phase and step specific context
  const phaseStepPrompt = `
---

CURRENT CONTEXT:
You are currently helping the user with:
- Phase ${phaseNumber}: ${currentPhase?.label || currentPhaseId}
- Step ${stepNumber}: ${currentTask?.title || currentStepId}

EXPECTED BEHAVIOR:
1. You must know that you are currently operating within Phase ${phaseNumber}, Step ${stepNumber}.
2. Focus your guidance specifically on helping the user complete this step.
3. Do NOT move ahead to the next step or phase unless the current step has been clearly completed.
4. Tailor your responses to be relevant to this specific phase and step.

MESSAGE METADATA:
You must always include this metadata in your internal processing:
{
  "phase": ${phaseNumber},
  "step": ${stepNumber}
}

Your responses should be contextual to the current step and help the user make progress on: "${currentTask?.title || 'the current task'}".`;

  return basePrompt + phaseStepPrompt;
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
    const { 
      message, 
      conversationHistory = [], 
      currentPhaseId, 
      currentStepId, 
      phaseNumber, 
      stepNumber 
    }: ChatRequest = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    console.log('Making OpenAI request...')
    console.log('Current context:', { currentPhaseId, currentStepId, phaseNumber, stepNumber })

    // Get the appropriate system prompt based on current context
    const systemPrompt = getSystemPrompt(currentPhaseId, currentStepId, phaseNumber, stepNumber)

    // Prepare messages for OpenAI with system prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    // Make request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
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
        errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`
      }
      
      console.error('OpenAI API error:', errorMessage)
      throw new Error(errorMessage)
    }

    const openaiData = await response.json()
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
        usage: openaiData.usage,
        context: {
          phase: phaseNumber,
          step: stepNumber,
          phaseId: currentPhaseId,
          stepId: currentStepId
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in llm-chat function:', error)
    
    // Provide specific error messages
    let errorMessage = error.message || 'An unexpected error occurred'
    let statusCode = 500
    
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      errorMessage = 'OpenAI API rate limit exceeded. Please try again in a moment.'
      statusCode = 429
    } else if (error.message?.includes('401') || error.message?.includes('authentication')) {
      errorMessage = 'OpenAI API authentication failed. Please check the API key configuration.'
      statusCode = 401
    } else if (error.message?.includes('Unauthorized')) {
      errorMessage = 'User authentication failed'
      statusCode = 401
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