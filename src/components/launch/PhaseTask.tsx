
import { Circle, Check, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ReactNode } from "react";

export type TaskStatus = "pending" | "in-progress" | "complete";

interface PhaseTaskProps {
  id: string;
  title: string;
  status: TaskStatus;
  tooltip?: string;
  onClick?: () => void;
}

export default function PhaseTask({ id, title, status, tooltip, onClick }: PhaseTaskProps) {
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
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.01,
        background: "linear-gradient(135deg, rgba(155, 135, 245, 0.05), rgba(30, 174, 219, 0.05))"
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-2 py-3 cursor-pointer transition-all border-b border-white/10",
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
            <StatusIcon />
          </div>
          <span className="text-sm text-white">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {tooltip && (
            <Popover>
              <PopoverTrigger asChild>
                <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                  <Lightbulb size={14} />
                </span>
              </PopoverTrigger>
              <PopoverContent className="glass p-3 backdrop-blur-md bg-black/40 border-white/10 text-white">
                <p className="text-xs">{tooltip}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </motion.div>
  );
}
