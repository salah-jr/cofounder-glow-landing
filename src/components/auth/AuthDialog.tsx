
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

const AuthDialog = ({ isOpen, onClose, defaultView = "login" }: AuthDialogProps) => {
  const [view, setView] = useState<"login" | "register">(defaultView);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#1A1F2C] to-black/90 border-white/10">
        {view === "login" ? (
          <LoginForm onRegister={() => setView("register")} />
        ) : (
          <RegisterForm onLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
