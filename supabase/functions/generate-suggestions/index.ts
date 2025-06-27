import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface Question {
  question: string
  options: string[]
  selected_answer: string
}

interface GenerateSuggestionsRequest {
  user_idea: string
  questions: Question[]
}

interface Suggestions {
  startup_name: string
  value_proposition: string
  target_audience: string
  revenue_stream: string
}

interface GenerateSuggestionsResponse {
  suggestions: Suggestions
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

    const { user_idea, questions }: GenerateSuggestionsRequest = await req.json()

    if (!user_idea || user_idea.trim().length === 0) {
      throw new Error("User idea is required")
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error("Questions and answers are required")
    }

    // Format questions and answers for the prompt
    const questionsAndAnswers = questions.map((q, index) => 
      `${index + 1}. ${q.question}\n   Answer: ${q.selected_answer}`
    ).join('\n\n')

    // Construct the prompt for Gemini
    const prompt = `You are Co-founder, an AI startup co-pilot. Based on the user's idea and their answers to discovery questions, generate structured startup suggestions.

**User's Original Idea:**
${user_idea}

**Discovery Questions & Answers:**
${questionsAndAnswers}

**Your Task:**
Generate 4 specific startup building blocks based on this information:

1. **Startup Name Idea** - A catchy, memorable name that reflects the business
2. **Value Proposition** - A clear statement of the unique value this startup provides
3. **Target Audience** - A specific description of the primary customer segment
4. **Revenue Stream** - How this business will generate money

**Output Rules:**
- Be specific and actionable
- Keep each suggestion concise (1-2 sentences max)
- Make suggestions realistic and achievable
- Base suggestions directly on the user's answers

**Output Format:**
\`\`\`json
{
  "suggestions": {
    "startup_name": "Example Name",
    "value_proposition": "Clear value statement here",
    "target_audience": "Specific audience description",
    "revenue_stream": "How money is made"
  }
}
\`\`\``

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
          maxOutputTokens: 1000,
        }
      }),
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      console.error("Gemini API error:", errorData)
      throw new Error("Failed to generate suggestions")
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from AI")
    }

    // Parse the JSON response from AI
    let parsedResponse: GenerateSuggestionsResponse
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
    if (!parsedResponse.suggestions) {
      throw new Error("Invalid suggestions format from AI")
    }

    const { suggestions } = parsedResponse
    const requiredFields = ['startup_name', 'value_proposition', 'target_audience', 'revenue_stream']
    
    for (const field of requiredFields) {
      if (!suggestions[field as keyof Suggestions]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: suggestions
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error: any) {
    console.error("Error in generate-suggestions function:", error)
    
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