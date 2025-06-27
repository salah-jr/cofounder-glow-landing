import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ProjectData {
  id: string
  idea: string
  created_at: string
  questions: Array<{
    question_text: string
    options: string[]
    selected_answer: string
  }>
  suggestions: Array<{
    name: string
    value: string
  }>
}

interface LLMChatRequest {
  message: string
  conversationHistory: ChatMessage[]
  currentPhaseId: string
  currentStepId: string
  phaseNumber: number
  stepNumber: number
  projectData?: ProjectData | null
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed")
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error("Authorization header is required")
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
      throw new Error("Authentication required")
    }

    const { message, conversationHistory, currentPhaseId, currentStepId, phaseNumber, stepNumber, projectData }: LLMChatRequest = await req.json()

    if (!message || message.trim().length === 0) {
      throw new Error("Message is required")
    }

    // Build context about the current phase and step
    const phaseContext = getPhaseContext(currentPhaseId, currentStepId, phaseNumber, stepNumber)

    // Build project context if available
    let projectContext = ""
    if (projectData) {
      const suggestions = projectData.suggestions.reduce((acc, s) => {
        acc[s.name] = s.value
        return acc
      }, {} as Record<string, string>)

      projectContext = `

**Project Context:**
- Original Idea: "${projectData.idea}"
- Startup Name: ${suggestions.startup_name || 'Not defined'}
- Value Proposition: ${suggestions.value_proposition || 'Not defined'}
- Target Audience: ${suggestions.target_audience || 'Not defined'}
- Revenue Stream: ${suggestions.revenue_stream || 'Not defined'}
- Previous Discovery Questions: ${projectData.questions.length} questions answered`
    }

    // Construct the conversation for Gemini
    const systemPrompt = `You are Co-founder, an AI startup co-pilot built to help first-time, non-business-expert founders turn ideas into real, testable, pitchable startups.

**Current Context:**
- Phase: ${phaseContext.phaseName} (${phaseNumber}/5)
- Step: ${phaseContext.stepName} (${stepNumber})
- Focus: ${phaseContext.description}${projectContext}

**Your Role:**
- Act as a strategic co-founder sitting beside the user
- Provide structured, supportive guidance
- Help them think clearly about their startup
- Adapt to their experience level (assume beginner-friendly approach)
- Be conversational but focused on actionable insights
- Reference their existing project context when relevant

**Guidelines:**
- Keep responses concise and actionable
- Ask clarifying questions when helpful
- Provide specific, practical advice
- Reference the current phase/step context
- Help them build real startup assets and logic
- When relevant, reference their existing project details
- ALWAYS format your responses using markdown for better readability
- Use markdown features like headers, lists, bold text, and code blocks when appropriate
- For important points, use bullet points or numbered lists
- For definitions or key concepts, use bold text or blockquotes
- Break up long responses with appropriate headers and sections

**Current Step Objective:**
${phaseContext.objective}`

    // Prepare the conversation history for Gemini
    const conversationParts = []
    
    // Add system context as the first message
    conversationParts.push({
      text: systemPrompt
    })

    // Add conversation history
    for (const msg of conversationHistory) {
      conversationParts.push({
        text: `${msg.role === 'user' ? 'User' : 'Co-founder'}: ${msg.content}`
      })
    }

    // Add the current user message
    conversationParts.push({
      text: `User: ${message}`
    })

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set")
    }

    // Make request to Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: conversationParts
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      console.error("Gemini API error:", errorData)
      throw new Error("Failed to generate response")
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from AI")
    }

    // Clean up the response (remove any "Co-founder:" prefix if present)
    const cleanedResponse = aiResponse.replace(/^Co-founder:\s*/i, '').trim()

    return new Response(
      JSON.stringify({
        success: true,
        response: cleanedResponse
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error: any) {
    console.error("Error in llm-chat function:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})

function getPhaseContext(phaseId: string, stepId: string, phaseNumber: number, stepNumber: number) {
  const phases = {
    'shape': {
      name: 'Shape Your Idea',
      description: 'Define and refine your startup concept',
      steps: {
        'shape-1': {
          name: 'Define the Problem & Target User',
          objective: 'Help the user clearly identify the problem they\'re solving and who experiences it'
        },
        'shape-2': {
          name: 'Craft Your Idea One-Liner',
          objective: 'Create a concise, compelling description of the startup idea'
        },
        'shape-3': {
          name: 'Spot the Market Gap',
          objective: 'Identify what\'s missing in the current market that this idea addresses'
        },
        'shape-4': {
          name: 'Capture Key Assumptions',
          objective: 'Document the critical assumptions the business model depends on'
        }
      }
    },
    'validate': {
      name: 'Validate the Idea and the Market',
      description: 'Test your assumptions with real market research',
      steps: {
        'validate-1': {
          name: 'Research the Market',
          objective: 'Gather data about target market size, trends, and dynamics'
        },
        'validate-2': {
          name: 'Design the Interview',
          objective: 'Create structured questions to validate assumptions with real users'
        },
        'validate-3': {
          name: 'Practice the Interview',
          objective: 'Rehearse interview approach for effective user conversations'
        },
        'validate-4': {
          name: 'Talk to Real Users',
          objective: 'Conduct actual interviews with potential customers'
        },
        'validate-5': {
          name: 'Learn and Compare',
          objective: 'Analyze feedback and compare findings against initial assumptions'
        }
      }
    },
    'build': {
      name: 'Build the Business',
      description: 'Develop your business model and strategy',
      steps: {
        'build-1': {
          name: 'Define Value & Market Positioning',
          objective: 'Establish how the product creates value and positions in the market'
        },
        'build-2': {
          name: 'Identify Risks and Mitigations',
          objective: 'Recognize potential business risks and develop strategies to address them'
        },
        'build-3': {
          name: 'Outline Revenue Model & Pricing',
          objective: 'Define how the business will generate revenue and price the offering'
        },
        'build-4': {
          name: 'Estimate Costs & Required Resources',
          objective: 'Calculate resources and capital needed to build and operate the business'
        },
        'build-5': {
          name: 'Assemble the Business Case',
          objective: 'Compile all elements into a comprehensive business justification'
        }
      }
    },
    'mvp': {
      name: 'Plan the MVP',
      description: 'Design your minimum viable product',
      steps: {
        'mvp-1': {
          name: 'Map the User Flow',
          objective: 'Design the step-by-step journey users will take through the product'
        },
        'mvp-2': {
          name: 'Prioritize the Features',
          objective: 'Identify which features are essential for the minimum viable product'
        },
        'mvp-3': {
          name: 'Design & Build Prompts',
          objective: 'Create user interface elements and interaction prompts'
        },
        'mvp-4': {
          name: 'Plan a Usability Test',
          objective: 'Design tests to evaluate how users interact with the MVP'
        },
        'mvp-5': {
          name: 'Run User Validation',
          objective: 'Execute testing with real users to validate the MVP approach'
        }
      }
    },
    'pitch': {
      name: 'Pitch Your Idea',
      description: 'Prepare to present and launch your startup',
      steps: {
        'pitch-1': {
          name: 'Tell the Startup Story',
          objective: 'Craft a compelling narrative about the startup\'s mission and vision'
        },
        'pitch-2': {
          name: 'Create Your Launch Signal',
          objective: 'Develop key messages and materials for market launch'
        },
        'pitch-3': {
          name: 'Plan Your Next Moves',
          objective: 'Define immediate next steps and milestones after launch'
        },
        'pitch-4': {
          name: 'Build Your Pitch Deck',
          objective: 'Create a professional presentation for investors and stakeholders'
        }
      }
    }
  }

  const phase = phases[phaseId as keyof typeof phases]
  const step = phase?.steps[stepId as keyof typeof phase.steps]

  return {
    phaseName: phase?.name || 'Unknown Phase',
    stepName: step?.name || 'Unknown Step',
    description: phase?.description || 'Working on your startup',
    objective: step?.objective || 'Continue building your startup'
  }
}