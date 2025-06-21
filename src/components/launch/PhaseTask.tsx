import { Circle, Check, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export type TaskStatus = "pending" | "in-progress" | "complete";

interface PhaseTaskProps {
  id: string;
  title: string;
  status: TaskStatus;
  tooltip?: string;
  isActive?: boolean;
  onClick?: () => void;
  onStepClick?: (stepId: string) => void;
  onResetChat?: () => void;
}

export default function PhaseTask({ 
  id, 
  title, 
  status, 
  tooltip, 
  isActive = false,
  onClick,
  onStepClick,
  onResetChat 
}: PhaseTaskProps) {
  // Status icon based on task status
  const StatusIcon = () => {
    switch (status) {
      case "complete":
        return <Check size={16} className="text-green-400" />;
      case "in-progress":
        return <Clock size={16} className="text-blue-400 animate-pulse-subtle" />;
      default:
        return <Circle size={16} className="text-white/40" />;
    }
  };
  
  const handleClick = () => {
    // Call the onClick handler first
    if (onClick) onClick();
    
    // Check if this task is related to an idea (first step of any phase)
    const isFirstStep = id.endsWith('-1');
    
    console.log(`Clicked on task: ${title}, isFirstStep: ${isFirstStep}`);
    
    // If this is a first step of any phase, reset chat
    if (isFirstStep && onResetChat) {
      console.log("Resetting chat from PhaseTask...");
      onResetChat();
    }
  };
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.01,
        background: isActive 
          ? "linear-gradient(135deg, rgba(155, 135, 245, 0.15), rgba(30, 174, 219, 0.15))"
          : "linear-gradient(135deg, rgba(155, 135, 245, 0.05), rgba(30, 174, 219, 0.05))"
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-2 py-3 cursor-pointer transition-all border-b border-white/10",
        status === "complete" ? "border-l-green-400 border-l-2" : "",
        status === "in-progress" ? "border-l-blue-400 border-l-2" : "",
        isActive && "bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/10 border-l-[#9b87f5] border-l-2"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            status === "complete" ? "bg-green-400/20" : 
            status === "in-progress" ? "bg-blue-400/20" : 
            isActive ? "bg-[#9b87f5]/20" :
            "bg-white/10"
          )}>
            <StatusIcon />
          </div>
          <span className={cn(
            "text-sm transition-colors",
            isActive ? "text-white font-medium" : "text-white"
          )}>
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {tooltip && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                  <Lightbulb size={14} />
                </button>
              </DialogTrigger>
              <DialogContent className="glass backdrop-blur-md bg-black/80 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">{title}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-white/80 mt-2">{tooltip}</p>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </motion.div>
  );
}