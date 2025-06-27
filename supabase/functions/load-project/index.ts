import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface LoadProjectRequest {
  project_id: string
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

    const { project_id }: LoadProjectRequest = await req.json()

    if (!project_id) {
      throw new Error("Project ID is required")
    }

    // Load project data
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id) // Ensure user owns the project
      .single()

    if (projectError || !project) {
      throw new Error("Project not found or access denied")
    }

    // Load project questions
    const { data: questions, error: questionsError } = await supabaseClient
      .from('project_questions_data')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true })

    if (questionsError) {
      console.error("Error loading questions:", questionsError)
      throw new Error("Failed to load project questions")
    }

    // Load project suggestions
    const { data: suggestions, error: suggestionsError } = await supabaseClient
      .from('suggestions')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true })

    if (suggestionsError) {
      console.error("Error loading suggestions:", suggestionsError)
      throw new Error("Failed to load project suggestions")
    }

    // Format the response
    const projectData: ProjectData = {
      id: project.id,
      idea: project.idea,
      created_at: project.created_at,
      questions: questions?.map(q => ({
        question_text: q.question_text,
        options: q.options,
        selected_answer: q.selected_answer
      })) || [],
      suggestions: suggestions?.map(s => ({
        name: s.name,
        value: s.value
      })) || []
    }

    return new Response(
      JSON.stringify({
        success: true,
        project: projectData
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error: any) {
    console.error("Error in load-project function:", error)
    
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