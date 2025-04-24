
import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";

interface RegisterFormProps {
  onLogin: () => void;
}

const namePlaceholders = [
  "Enter your name",
  "John Doe",
  "Jane Smith",
];

const RegisterForm = ({ onLogin }: RegisterFormProps) => {
  const [namePlaceholder, setNamePlaceholder] = useState(namePlaceholders[0]);
  const form = useForm();

  useEffect(() => {
    const interval = setInterval(() => {
      setNamePlaceholder(
        namePlaceholders[
          Math.floor(Math.random() * namePlaceholders.length)
        ]
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-white/60 mt-2">Join us today</p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                    <Input
                      placeholder={namePlaceholder}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                    <Input
                      placeholder="Enter your email"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                      placeholder="Create a password"
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
            Sign Up
          </Button>
        </form>
      </Form>

      <p className="text-center mt-4 text-white/60">
        Already have an account?{" "}
        <button
          onClick={onLogin}
          className="text-[#9b87f5] hover:text-[#1EAEDB] transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
