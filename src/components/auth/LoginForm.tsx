import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onRegisterClick: () => void;
  onSuccess: () => void;
}

export default function LoginForm({
  onRegisterClick,
  onSuccess
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      console.log("Login successful");
      onSuccess();
    } catch (error: any) {
      let errorMessage = "An error occurred during sign in.";
      
      if (error?.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account before signing in.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-white/70">Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/90">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input 
              id="email" 
              placeholder="name@example.com" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white/90">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-white/70">Don't have an account?</span>{" "}
        <button 
          type="button" 
          onClick={onRegisterClick} 
          className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}