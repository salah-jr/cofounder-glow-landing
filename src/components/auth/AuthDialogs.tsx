import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type AuthDialogType = "login" | "register" | "forgotPassword";

export default function AuthDialogs() {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<AuthDialogType>("login");
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handleSwitchDialog = (type: AuthDialogType) => {
    setActiveDialog(type);
    // If switching from login to register, close login and open register
    if (type === "register" && loginDialogOpen) {
      setLoginDialogOpen(false);
      setRegisterDialogOpen(true);
    }
    // If switching from register to login, close register and open login
    if (type === "login" && registerDialogOpen) {
      setRegisterDialogOpen(false);
      setLoginDialogOpen(true);
    }
  };

  const closeDialogs = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(false);
  };

  const handleFormSubmit = async (type: "login" | "register" | "resetPassword", email?: string, password?: string, name?: string) => {
    try {
      if (type === "login" && email && password) {
        await login(email, password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        closeDialogs();
      } else if (type === "register" && name && email && password) {
        await register(name, email, password);
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });
        closeDialogs();
      } else if (type === "resetPassword") {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for instructions to reset your password.",
        });
        closeDialogs();
      }
    } catch (error: any) {
      let errorMessage = error?.message || "An unexpected error occurred";
      
      // Handle specific email confirmation error
      if (error?.message === "Email not confirmed") {
        errorMessage = "Your email address has not been confirmed. Please check your inbox for a confirmation link.";
      }
      
      toast({
        title: `${type === "login" ? "Login" : type === "register" ? "Registration" : "Password Reset"} Failed`,
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogTrigger asChild className="hidden md:block">
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => {
              setActiveDialog("login");
              setLoginDialogOpen(true);
            }}
          >
            Login
          </button>
        </DialogTrigger>
        <DialogContent className="glass border border-white/10 w-[90%] max-w-md rounded-lg p-0 overflow-hidden animate-fade-in">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {activeDialog === "login" ? "Login" : activeDialog === "register" ? "Register" : "Forgot Password"}
            </DialogTitle>
          </DialogHeader>
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
              onSubmit={(name, email, password) => handleFormSubmit("register", email, password, name)}
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
      
      {/* Register Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogTrigger asChild className="hidden md:block">
          <button
            className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => {
              setActiveDialog("register");
              setRegisterDialogOpen(true);
            }}
          >
            Register
          </button>
        </DialogTrigger>
        <DialogContent className="glass border border-white/10 w-[90%] max-w-md rounded-lg p-0 overflow-hidden animate-fade-in">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {activeDialog === "login" ? "Login" : activeDialog === "register" ? "Register" : "Forgot Password"}
            </DialogTitle>
          </DialogHeader>
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
              onSubmit={(name, email, password) => handleFormSubmit("register", email, password, name)}
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
    </>
  );
}