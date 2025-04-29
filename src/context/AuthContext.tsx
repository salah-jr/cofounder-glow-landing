
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // In a real app, these functions would interact with your authentication service
  const login = async (email: string, password: string) => {
    try {
      // This is a mock implementation
      // Would normally make an API call to authenticate
      console.log("Login attempt with:", email);
      setUser({
        id: "user-1",
        name: "Demo User",
        email
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // This is a mock implementation
      // Would normally make an API call to register
      console.log("Register attempt with:", { name, email });
      setUser({
        id: "user-1",
        name,
        email
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      // This is a mock implementation
      // Would normally make an API call to trigger password reset
      console.log("Password reset requested for:", email);
    } catch (error) {
      console.error("Password reset request failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword
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
