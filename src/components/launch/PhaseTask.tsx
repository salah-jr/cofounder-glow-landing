
import { Check, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type TaskStatus = "pending" | "in-progress" | "complete";

interface PhaseTaskProps {
  id: string;
  title: string;
  status: TaskStatus;
  onClick?: () => void;
}

export default function PhaseTask({ id, title, status, onClick }: PhaseTaskProps) {
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
      whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass p-3 rounded-lg mb-2 cursor-pointer transition-all border border-white/5",
        status === "complete" ? "border-l-green-400 border-l-2" : "",
        status === "in-progress" ? "border-l-blue-400 border-l-2" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white">{title}</span>
        <StatusIcon />
      </div>
    </motion.div>
  );
}
