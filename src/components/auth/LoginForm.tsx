
import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";

interface LoginFormProps {
  onRegister: () => void;
}

const emailPlaceholders = [
  "Enter your email",
  "name@company.com",
  "hello@startup.dev",
];

const LoginForm = ({ onRegister }: LoginFormProps) => {
  const [emailPlaceholder, setEmailPlaceholder] = useState(emailPlaceholders[0]);
  const form = useForm();

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailPlaceholder(
        emailPlaceholders[
          Math.floor(Math.random() * emailPlaceholders.length)
        ]
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-white/60 mt-2">Sign in to your account</p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                    <Input
                      placeholder={emailPlaceholder}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 transition-all duration-300"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
          >
            Sign In
          </Button>
        </form>
      </Form>

      <p className="text-center mt-4 text-white/60">
        Don't have an account?{" "}
        <button
          onClick={onRegister}
          className="text-[#9b87f5] hover:text-[#1EAEDB] transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
