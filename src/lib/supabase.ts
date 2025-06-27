import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_data: Record<string, any>
  created_at: string
  expires_at: string
}

// Auth helper functions
export const authHelpers = {
  // Get current user profile
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  // Update user profile
  async updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  },

  // Get user projects
  async getUserProjects(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user projects:', error)
      return []
    }

    return data || []
  },

  // Create user session record
  async createSession(sessionData: Record<string, any> = {}): Promise<UserSession | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_data: sessionData
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return null
    }

    return data
  },

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    const { error } = await supabase.rpc('cleanup_expired_sessions')
    if (error) {
      console.error('Error cleaning up sessions:', error)
    }
  }
}