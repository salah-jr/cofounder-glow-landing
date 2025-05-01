
import { Check, Clock, Circle, Target, Bulb, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export type TaskStatus = "pending" | "in-progress" | "complete";

interface PhaseTaskProps {
  id: string;
  title: string;
  status: TaskStatus;
  icon?: string;
  tooltip?: string;
  onClick?: () => void;
}

export default function PhaseTask({ id, title, status, icon, tooltip, onClick }: PhaseTaskProps) {
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
  
  // Task icon based on title or provided icon prop
  const TaskIcon = (): ReactNode => {
    if (icon === "target") {
      return <Target size={16} className="text-white/70" />;
    } else if (icon === "bulb") {
      return <Bulb size={16} className="text-white/70" />;
    }
    
    // Default icons based on task title keywords
    if (title.toLowerCase().includes("target") || title.toLowerCase().includes("audience")) {
      return <Target size={16} className="text-white/70" />;
    } else if (title.toLowerCase().includes("proposition") || title.toLowerCase().includes("idea")) {
      return <Bulb size={16} className="text-white/70" />;
    }
    
    // Fallback
    return <Circle size={16} className="text-white/70" />;
  };
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 0 15px rgba(155, 135, 245, 0.2)",
        background: "linear-gradient(135deg, rgba(155, 135, 245, 0.1), rgba(30, 174, 219, 0.1))"
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass p-4 rounded-lg mb-2 cursor-pointer transition-all border border-white/5",
        "bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg",
        status === "complete" ? "border-l-green-400 border-l-2" : "",
        status === "in-progress" ? "border-l-blue-400 border-l-2" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
            status === "complete" ? "bg-green-400/20" : 
            status === "in-progress" ? "bg-blue-400/20" : 
            "bg-white/10"
          )}>
            <TaskIcon />
          </div>
          <span className="text-sm text-white">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {tooltip && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span className="text-white/40 hover:text-white/70 transition-colors">
                  <HelpCircle size={14} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="glass p-3 backdrop-blur-md bg-black/40 border-white/10 text-white">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <StatusIcon />
        </div>
      </div>
      
      {/* Progress indicator that animates on status change */}
      <motion.div 
        className={cn(
          "h-0.5 w-full mt-2 rounded-full overflow-hidden",
          status === "pending" ? "bg-white/5" : 
          status === "in-progress" ? "bg-white/10" : 
          "bg-gradient-to-r from-green-400/50 to-green-400"
        )}
        initial={{ width: "0%" }}
        animate={{ 
          width: status === "complete" ? "100%" : 
                status === "in-progress" ? "50%" : "0%" 
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
