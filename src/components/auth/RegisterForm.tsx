import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, Linkedin, Mail as Google } from "lucide-react";

interface RegisterFormProps {
  onLoginClick: () => void;
  onSubmit: (name: string, email: string, password: string) => void;
}

export default function RegisterForm({ onLoginClick, onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Create an account</h2>
        <p className="text-sm text-white/70">Enter your information to create an account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-white/90">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
        </div>

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
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <p className="text-xs text-white/50">Password must be at least 8 characters</p>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
        >
          Create account
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 absolute w-full"></div>
          <span className="bg-[#1A1F2C] px-2 text-xs text-white/50 relative z-10">OR CONTINUE WITH</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            <Google className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>
        </div>
      </form>

      <div className="text-center text-sm">
        <span className="text-white/70">Already have an account?</span>{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-[#9b87f5] hover:text-[#1EAEDB] transition-colors font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}