
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLoginClick: () => void;
  onSubmit: () => void;
}

export default function ForgotPasswordForm({ onBackToLoginClick, onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        <p className="text-sm text-white/70">Enter your email and we'll send you a reset link</p>
      </div>

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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
        >
          Send reset link
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={onBackToLoginClick}
          className="text-[#9b87f5] hover:text-[#1EAEDB] transition-colors font-medium"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
