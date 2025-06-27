import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

interface Suggestion {
  name: string
  value: string
}

interface SaveProjectRequest {
  user_id: string
  idea: string
  questions: Question[]
  suggestions: Suggestion[]
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

    const { user_id, idea, questions, suggestions }: SaveProjectRequest = await req.json()

    // Validate input
    if (!user_id || !idea || !questions || !suggestions) {
      throw new Error("Missing required fields")
    }

    if (user_id !== user.id) {
      throw new Error("User ID mismatch")
    }

    // Start a transaction by creating the project first
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .insert({
        user_id: user_id,
        idea: idea
      })
      .select()
      .single()

    if (projectError) {
      console.error("Error creating project:", projectError)
      throw new Error("Failed to create project")
    }

    const projectId = project.id

    // Insert questions data
    const questionsData = questions.map(q => ({
      project_id: projectId,
      question_text: q.question,
      options: q.options,
      selected_answer: q.selected_answer
    }))

    const { error: questionsError } = await supabaseClient
      .from('project_questions_data')
      .insert(questionsData)

    if (questionsError) {
      console.error("Error inserting questions:", questionsError)
      // Try to clean up the project if questions failed
      await supabaseClient.from('projects').delete().eq('id', projectId)
      throw new Error("Failed to save questions data")
    }

    // Insert suggestions
    const suggestionsData = suggestions.map(s => ({
      project_id: projectId,
      name: s.name,
      value: s.value
    }))

    const { error: suggestionsError } = await supabaseClient
      .from('suggestions')
      .insert(suggestionsData)

    if (suggestionsError) {
      console.error("Error inserting suggestions:", suggestionsError)
      // Try to clean up if suggestions failed
      await supabaseClient.from('project_questions_data').delete().eq('project_id', projectId)
      await supabaseClient.from('projects').delete().eq('id', projectId)
      throw new Error("Failed to save suggestions")
    }

    return new Response(
      JSON.stringify({
        success: true,
        project_id: projectId,
        message: "Project saved successfully"
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error: any) {
    console.error("Error in save-project function:", error)
    
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