import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface GenerateQuestionsRequest {
  user_idea: string
}

interface Question {
  question: string
  options: string[]
}

interface GenerateQuestionsResponse {
  questions: Question[]
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

    const { user_idea }: GenerateQuestionsRequest = await req.json()

    if (!user_idea || user_idea.trim().length === 0) {
      throw new Error("User idea is required")
    }

    // Construct the prompt for Gemini
    const prompt = `You are Co-founder, an AI startup co-pilot built to help first-time, non-business-expert founders turn ideas into real, testable, pitchable startups. You are the user's persistent co-creator across a structured, step-by-step journey.

You will remain in a single, continuous conversation thread across this journey, building on the user's inputs, preserving context, and co-creating structured startup deliverables in each phase.

Your role is not to act like a chatbot or assistant. Instead, think of yourself as:
- A strategic co-founder sitting beside the user at a whiteboard  
- A structured, supportive guide who helps them think clearly  
- A patient builder who co-creates startup assets and logic alongside the user  
- An experienced startup mind who adapts to the user's level — especially if they have no prior business experience

---

** Context & Objective**  
This is the first step in the user's journey. They've submitted a short business idea (1–2 sentences) through a single input field.

**At this stage:**  
- The experience is **non-conversational**  
- Your job is to generate **structured content** for a static UI screen  

---

**Your Task**  
Generate 5 beginner-friendly multiple-choice questions that help clarify and expand the user's idea.

**Each question should be short, simple, and non-technical.**

---

**Input / Output**

- **Input:**
  - \`user_idea\` – A short description of the user's idea (1–2 sentences)

- **Output Rules:**  
  1. Maintain non-conversational format (no greetings or commentary)  
  2. Each question must:
     - Be answerable in <10 seconds  
     - Progress from broad → specific  
     - Include 3 substantive options + "I'm not sure"  
  3. Tone: "Friendly professor" (clear but approachable)  

---

**Question Framework:**  
1. Business Type – (e.g., Product / Service / Marketplace)  
2. Core User – (Demographic or psychographic target)  
3. Primary Benefit – (e.g., Time-saving, cost-saving)  
4. Key Differentiation – (What makes it unique?)  
5. Problem Urgency – (How badly is this needed?)

---

**Output Format:**
\`\`\`json
{
  "questions": [
    {
      "question": "Which best describes your business type?",
      "options": ["Physical product", "Digital service", "Online marketplace", "I'm not sure"]
    }
  ]
}
\`\`\`

User Idea: ${user_idea}`

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
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      }),
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      console.error("Gemini API error:", errorData)
      throw new Error("Failed to generate questions")
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from AI")
    }

    // Parse the JSON response from AI
    let parsedResponse: GenerateQuestionsResponse
    try {
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse
      parsedResponse = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse)
      throw new Error("Failed to parse AI response")
    }

    // Validate the response structure
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions) || parsedResponse.questions.length !== 5) {
      throw new Error("Invalid questions format from AI")
    }

    // Validate each question
    for (const question of parsedResponse.questions) {
      if (!question.question || !question.options || !Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error("Invalid question structure from AI")
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        questions: parsedResponse.questions
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error: any) {
    console.error("Error in generate-questions function:", error)
    
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