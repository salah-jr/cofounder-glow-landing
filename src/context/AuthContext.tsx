import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, authHelpers, Profile } from "@/lib/supabase";
import { User, Session, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔄 Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        setIsLoading(false);
      } else if (session) {
        console.log('✅ Initial session found:', { userId: session.user.id, email: session.user.email });
        setSession(session);
        setUser(session.user);
        
        // Fetch user profile
        const userProfile = await authHelpers.getCurrentProfile();
        console.log('👤 User profile loaded:', userProfile);
        setProfile(userProfile);
        
        // Create session record
        await authHelpers.createSession({
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
        
        // Set loading to false immediately after processing
        setIsLoading(false);
      } else {
        console.log('🚫 No initial session found');
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { event, hasSession: !!session, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const userProfile = await authHelpers.getCurrentProfile();
          console.log('👤 Profile updated on auth change:', userProfile);
          setProfile(userProfile);
          
          // Create session record for new logins
          if (event === 'SIGNED_IN') {
            console.log('📝 Creating session record for new login');
            await authHelpers.createSession({
              login_time: new Date().toISOString(),
              user_agent: navigator.userAgent
            });
          }
          
          // Set loading to false immediately after processing
          setIsLoading(false);
        } else {
          console.log('🚪 User signed out, clearing profile');
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Cleanup expired sessions periodically
    const cleanupInterval = setInterval(() => {
      authHelpers.cleanupExpiredSessions();
    }, 60000 * 60); // Every hour

    return () => {
      subscription.unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, []);

  // Debug logging for auth state changes
  useEffect(() => {
    console.log('🔍 Auth state updated:', {
      isLoading,
      isAuthenticated: !!user,
      hasUser: !!user,
      hasProfile: !!profile,
      hasSession: !!session,
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    });
  }, [isLoading, user, profile, session]);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Login successful');
      // Session and user will be set by the auth state change listener
    } catch (error) {
      console.error("❌ Login failed:", error);
      setIsLoading(false); // Set loading to false on error
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Attempting registration for:', email);
      setIsLoading(true);
      
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        throw error;
      }

      // If user was created successfully and we have a session
      if (data.user && data.session) {
        console.log('✅ Registration successful, creating profile');
        // Create the profile record manually to ensure it exists
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('❌ Error creating profile:', profileError);
          // If profile creation fails, we should clean up the auth user
          await supabase.auth.signOut();
          throw new Error('Failed to create user profile. Please try again.');
        }
      }

      // Note: User will need to confirm email if email confirmation is enabled
      if (data.user && !data.session) {
        // Email confirmation required
        setIsLoading(false);
        throw new Error("Please check your email and click the confirmation link to complete registration.");
      }

      console.log('✅ Registration completed successfully');
      // Session and user will be set by the auth state change listener
    } catch (error) {
      console.error("❌ Registration failed:", error);
      setIsLoading(false); // Set loading to false on error
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Attempting logout');
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      console.log('✅ Logout successful');
      // Clear local state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await authHelpers.updateProfile(updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}