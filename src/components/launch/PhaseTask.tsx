
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
  onClick?: () => void;
  onResetChat?: () => void;
}

export default function PhaseTask({ 
  id, 
  title, 
  status, 
  tooltip, 
  onClick,
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
  
  // Determine if this task is idea-related
  const isIdeaTask = title.toLowerCase().includes("idea") || 
                     id.toLowerCase().includes("idea") || 
                     title.toLowerCase().includes("value proposition") ||
                     title.toLowerCase().includes("validation hypothesis") ||
                     id === "task1" || // First task in the idea phase
                     id === "task6";   // First task in the validation phase
  
  // Determine if this task is active (in-progress)
  const isActive = status === "in-progress";
  
  const handleClick = () => {
    console.log(`Clicked on task: ${title}, isIdeaTask: ${isIdeaTask}, isActive: ${isActive}`);
    
    // If the task is active (in-progress), don't do anything
    if (isActive) {
      console.log("Task is active, ignoring click");
      return;
    }
    
    // Call the onClick handler first
    if (onClick) onClick();
    
    // If this is an idea-related task, reset chat
    if (isIdeaTask && onResetChat) {
      console.log("Resetting chat from PhaseTask...");
      onResetChat();
    }
  };
  
  return (
    <motion.div
      whileHover={{ 
        scale: isActive ? 1 : 1.01,
        background: isActive ? undefined : "linear-gradient(135deg, rgba(155, 135, 245, 0.05), rgba(30, 174, 219, 0.05))"
      }}
      whileTap={{ scale: isActive ? 1 : 0.98 }}
      className={cn(
        "px-2 py-3 transition-all border-b border-white/10",
        status === "complete" ? "border-l-green-400 border-l-2" : "",
        status === "in-progress" ? "border-l-blue-400 border-l-2" : "",
        isActive ? 
          "bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/10 cursor-default" : 
          "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            status === "complete" ? "bg-green-400/20" : 
            status === "in-progress" ? "bg-blue-400/20" : 
            "bg-white/10"
          )}>
            <StatusIcon />
          </div>
          <span className={cn(
            "text-sm",
            isActive ? "text-white font-medium" : "text-white"
          )}>{title}</span>
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
