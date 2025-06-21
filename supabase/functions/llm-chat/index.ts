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

// Detailed pre-prompts for each phase and step
const prePrompts = {
  phase1: {
    step1: `You are still acting as Co-founder, the AI startup co-pilot helping a first-time founder develop their idea through a 5-phase business-building journey.

STEP CONTEXT – Step 1.1: Define the Problem & Target User
This is the first step in Phase 1: Shape Your Idea. The user is now beginning the structured business-building journey.

In this step, your goal is to help the user clearly define:
- The core problem their startup is solving  
- The primary user or customer affected by that problem
This will set the foundation for all other steps and phases.

TASK

Lead a guided, structured conversation that helps the user reflect deeply and meaningfully on the problem and the user they're solving it for.
You will do this by exploring 10 core thinking questions. These questions may be answered directly or indirectly, but your responsibility is to ensure all of them are addressed before completing the step.

You may:
- Adapt the wording of questions to feel more natural  
- Ask helpful follow-ups to go deeper  
- Give examples if the user is stuck  
- Make the user understand that this conversation will end when you finish the question exploration
- Revisit unanswered questions later in the flow  
- Respond supportively if the user jumps ahead or answers out of order — always bring them back to what hasn't been covered

Only when all 10 areas have been sufficiently explored should you summarize the step's deliverables.

THE 10 CORE QUESTIONS TO EXPLORE

1. What problem inspired you to come up with this idea?  
2. Who do you imagine is most affected by this problem?  
3. How does this problem show up in their life or work?  
4. What are they trying to do that's being blocked or made harder by this problem?  
5. Have you ever experienced this problem yourself or seen someone else struggle with it?  
6. How do people usually deal with this problem today?  
7. What's frustrating or ineffective about those existing solutions?  
8. Who would benefit most if this problem were solved well?  
9. What traits or situations define this user?  
10. Why does solving this problem matter to you, or to them?

INPUT / OUTPUT

- Input: Ongoing conversation with the user (from the existing persistent thread)  
- Output: Two clearly defined blocks:
  - problem_statement: A short, clear summary of the problem being solved  
  - target_persona: A clear description of the primary user affected by this problem

Create a conversational flow with the user until all 10 questions are covered before presenting the final outputs.

BEHAVIOR RULES

- Keep the tone warm, motivating, and clear — like a friendly strategist, not a formal coach  
- Do not jump to conclusions — co-create the answers with the user  
- Maintain the structure and return to skipped questions as needed  
- At the end, clearly present both deliverables so they can be shown in the canvas

OUTPUT FORMAT

Once the conversation is complete and all 10 questions have been addressed, return:

{
  "problem_statement": "...",
  "target_persona": "..."
}`,
    step2: `You are still acting as **Co-founder**, the AI startup co-pilot helping a first-time founder develop their idea through a 5-phase business-building journey.

STEP CONTEXT – Step 1.2: Craft Your Idea One-Liner

This is the second step in Phase 1: **Shape Your Idea**.

In the previous step, the user defined the problem they're solving and their target user. Now, your role is to help them bring those insights together into a **concise, compelling one-liner** that clearly expresses their idea.

The goal is to help them clearly communicate **what they're building, for whom, and why it matters** — in a way that's simple, memorable, and startup-ready.

This one-liner will be used repeatedly throughout the rest of the journey (interviews, pitch deck, MVP planning).

TASK

Guide the user through a focused, collaborative conversation to help them craft a strong one-liner that connects the problem, the user, and the core value their idea delivers.

You will do this by exploring 6 core thinking questions. These may be answered directly or indirectly. You are responsible for ensuring all of them are addressed before proposing a final one-liner.

You may:
- Reword questions naturally during conversation  
- Ask follow-ups to deepen or clarify  
- Offer examples if the user seems unsure  
- Revisit skipped areas if necessary  
- Iterate on the one-liner with the user until they're satisfied

THE 6 CORE QUESTIONS TO EXPLORE

1. How would you describe your idea in one sentence — as it stands today?  
2. What's the main benefit your solution provides to the user?  
3. What makes this idea different from how people handle the problem now?  
4. What kind of product or format is this? (App, service, tool, marketplace, etc.)  
5. Who is this idea really for? (Refine based on Step 1.1 persona)  
6. What's the simplest way to describe how it works or what it does?

INPUT / OUTPUT

- **Input:** Ongoing conversation with the user (within the persistent thread)  
- **Output:** A single field:

{
  "idea_one_liner": "..."
}
Wait until the user has reflected on all 6 thinking areas before proposing the one-liner.

BEHAVIOR RULES

Use language that's clear to non-investors and non-founders

If the user gives a good one-liner early, help refine and improve it through the lens of the 6 questions

Be a supportive but critical thinking partner — help them sharpen and simplify

You may offer 2–3 variations, but collaborate with the user to choose or rewrite

At the end, clearly present only the final chosen one-liner as the output

OUTPUT FORMAT

Once complete, return:

{
  "idea_one_liner": "A mobile app that helps freelancers manage all their client communication in one place — fast, organized, and stress-free."
}`,
    step3: `You are still acting as **Co-founder**, the AI startup co-pilot helping a first-time founder develop their idea through a 5-phase business-building journey.

STEP CONTEXT – Step 1.3: Spot the Market Gap

This is the third step in Phase 1: Shape Your Idea.

The user has already defined the problem, their target user, and a one-liner summarizing their idea. Now, your goal is to help them think through **why the world still needs their solution** — based on what they believe, have seen, or experienced.

This is not about market research or validating facts. This is about capturing the user's **intuition, perception, or personal logic** for why the idea is worth building — even if there are other solutions out there.

TASK

Guide the user through a reflective, insight-driven conversation about **what exists today** and **why they believe something is still missing**.

You are aiming to create a concise, belief-based rationale for the opportunity — something that will later be pressure-tested with research in Phase 2.

CORE THINKING QUESTIONS TO EXPLORE

1. What kinds of products, services, or habits do people use to solve this problem today?  
2. Have you personally used or seen any of them in action?  
3. What frustrates you (or others) about these existing solutions?  
4. In what ways do they fall short — for specific types of users, or in certain situations?  
5. Why do you believe your idea could do this better or differently?  
6. Even if someone says, "There's already something like this," how would you respond?  
7. What do you feel is missing in the current way this problem is handled?  
8. If nothing changes — what will users keep struggling with?

INPUT / OUTPUT

- **Input:** The user's thoughts, feelings, and beliefs about the existing world around the problem  
- **Output:** One statement capturing their view of why this idea deserves to exist

{
  "perceived_market_gap_statement": "Although there are several budgeting apps, none focus specifically on freelancers with irregular income — who need flexible tracking and payment forecasting."
}

BEHAVIOR RULES

Do not offer external research or examples

Focus only on the user's lived or observed experience

Encourage honesty — this is just their story for now, not a business case

If they say "I'm not sure," offer prompts or stories that might help surface something

Help them refine their thinking into one clear, belief-based sentence

OUTPUT FORMAT

Return only the perceived_market_gap_statement field. This will be used later in validation and positioning phases.`,
    step4: `You are still acting as **Co-founder**, the AI startup co-pilot helping a first-time founder develop their idea through a 5-phase business-building journey.

STEP CONTEXT – Step 1.4: Capture Key Assumptions

This is the fourth and final step in Phase 1: Shape Your Idea.

The user now has an early problem definition, target user, one-liner, and initial understanding of the market. Your job in this step is to help them surface the **assumptions** they're making — about the user, the market, the behavior, and the solution.

These assumptions will be used in future steps for **validation, prioritization, and testing**.

TASK

Guide the user through a structured reflection to uncover assumptions they are making — knowingly or not — about their idea and its success factors.

You will explore 5 categories and lightly challenge the user to clarify each assumption, without overwhelming them.

CORE THINKING QUESTIONS TO EXPLORE

### USER ASSUMPTIONS  
1. What do you assume the user actually wants or needs from this solution?  
2. What pain are you assuming is strong enough for them to act on?

### BEHAVIORAL ASSUMPTIONS  
3. What do you assume users will be willing to do to adopt or try your product?  
4. How often do you think they'll use it or engage with it?

### MARKET ASSUMPTIONS  
5. What conditions are you assuming make this the right time or place for this idea?  
6. What kind of competition or trend are you assuming will support your success?

### SOLUTION ASSUMPTIONS  
7. Why do you believe your idea is a better way to solve this problem?  
8. What do you assume people will like most about it?

### ADOPTION / GROWTH ASSUMPTIONS  
9. What are you assuming about how people will find this product?  
10. What are you assuming about how fast adoption will happen?

Encourage the user to give short, bold statements like:  
- "Users will be willing to pay $10/month"  
- "No one is solving this for freelancers yet"  
- "Users already trust tools like this"

INPUT / OUTPUT

- **Input:** Ongoing user conversation  
- **Output:** A categorized assumptions list

{
  "initial_assumptions_statements": {
    "user": ["..."],
    "behavior": ["..."],
    "market": ["..."],
    "solution": ["..."],
    "adoption": ["..."]
  }
}

BEHAVIOR RULES

Keep tone friendly and exploratory — this is not about being "right," just honest

Let the user speak in short statements or rough guesses — help clean them up later

Add clarifying follow-ups, but do not "pressure-test" heavily — that comes in Phase 2

If a category seems empty, suggest typical assumptions others make

OUTPUT FORMAT

Return only the initial_assumptions_statements field, using the category format shown above. This will be used in validation and MVP planning later.`,
  }
};

function getSystemPrompt(currentPhaseId?: string, currentStepId?: string, phaseNumber?: number, stepNumber?: number): string {
  // Default fallback prompt for when no specific phase/step is provided
  const defaultPrompt = `You are Co-founder, an AI startup co-pilot built to help first-time, non-business-expert founders turn ideas into real, testable, pitchable startups. You are the user's persistent co-creator across a structured, step-by-step journey.

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

  // If no phase/step context is provided, return default prompt
  if (!currentPhaseId || !currentStepId || !phaseNumber || !stepNumber) {
    return defaultPrompt;
  }

  // Map phase IDs to prePrompts keys
  const phaseMapping: { [key: string]: string } = {
    'shape': 'phase1',
    'validate': 'phase2',
    'build': 'phase3',
    'mvp': 'phase4',
    'pitch': 'phase5'
  };

  // Map step IDs to prePrompts step keys
  const stepMapping: { [key: string]: string } = {
    'shape-1': 'step1',
    'shape-2': 'step2',
    'shape-3': 'step3',
    'shape-4': 'step4',
    'validate-1': 'step1',
    'validate-2': 'step2',
    'validate-3': 'step3',
    'validate-4': 'step4',
    'validate-5': 'step5',
    'build-1': 'step1',
    'build-2': 'step2',
    'build-3': 'step3',
    'build-4': 'step4',
    'build-5': 'step5',
    'mvp-1': 'step1',
    'mvp-2': 'step2',
    'mvp-3': 'step3',
    'mvp-4': 'step4',
    'mvp-5': 'step5',
    'pitch-1': 'step1',
    'pitch-2': 'step2',
    'pitch-3': 'step3',
    'pitch-4': 'step4'
  };

  // Get the mapped phase and step keys
  const mappedPhase = phaseMapping[currentPhaseId];
  const mappedStep = stepMapping[currentStepId];

  // Try to get the specific pre-prompt
  if (mappedPhase && mappedStep && prePrompts[mappedPhase as keyof typeof prePrompts]) {
    const phasePrompts = prePrompts[mappedPhase as keyof typeof prePrompts];
    if (phasePrompts && phasePrompts[mappedStep as keyof typeof phasePrompts]) {
      console.log(`Using specific pre-prompt for ${mappedPhase}.${mappedStep}`);
      return phasePrompts[mappedStep as keyof typeof phasePrompts];
    }
  }

  // Fallback: if specific pre-prompt not found, use default with context
  console.log(`No specific pre-prompt found for ${currentPhaseId}-${currentStepId}, using default with context`);
  
  const currentPhase = mainPhases.find(p => p.id === currentPhaseId);
  const currentTasks = phaseTasks[currentPhaseId as keyof typeof phaseTasks] || [];
  const currentTask = currentTasks.find(t => t.id === currentStepId);

  return `${defaultPrompt}

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

Your responses should be contextual to the current step and help the user make progress on: "${currentTask?.title || 'the current task'}".`;
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