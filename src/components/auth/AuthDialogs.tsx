
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type AuthDialogType = "login" | "register" | "forgotPassword";

export default function AuthDialogs() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<AuthDialogType>("login");
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSwitchDialog = (type: AuthDialogType) => {
    setActiveDialog(type);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = async (type: "login" | "register" | "resetPassword", email?: string, password?: string) => {
    if (type === "login" && email && password) {
      try {
        await login(email, password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } catch (error) {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
        return;
      }
    } else {
      toast({
        title: type === "resetPassword" ? "Password Reset Email Sent" : `${type === "login" ? "Login" : "Registration"} Successful`,
        description: type === "resetPassword" 
          ? "Check your email for instructions to reset your password."
          : type === "login" 
            ? "Welcome back!" 
            : "Your account has been created.",
      });
    }
    closeDialog();
  };
  
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="hidden md:block">
          <button className="text-white/80 hover:text-white transition-colors">
            Login
          </button>
        </DialogTrigger>
        <DialogContent className="glass border border-white/10 w-[90%] max-w-md rounded-lg p-0 overflow-hidden animate-fade-in">
          {activeDialog === "login" && (
            <LoginForm
              onRegisterClick={() => handleSwitchDialog("register")}
              onForgotPasswordClick={() => handleSwitchDialog("forgotPassword")}
              onSubmit={(email, password) => handleFormSubmit("login", email, password)}
            />
          )}
          {activeDialog === "register" && (
            <RegisterForm
              onLoginClick={() => handleSwitchDialog("login")}
              onSubmit={() => handleFormSubmit("register")}
            />
          )}
          {activeDialog === "forgotPassword" && (
            <ForgotPasswordForm
              onBackToLoginClick={() => handleSwitchDialog("login")}
              onSubmit={() => handleFormSubmit("resetPassword")}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild className="hidden md:block">
          <a
            className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Register
          </a>
        </DialogTrigger>
      </Dialog>
    </>
  );
}
