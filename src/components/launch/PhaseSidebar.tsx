
import { motion } from "framer-motion";
import PhaseTask, { TaskStatus } from "./PhaseTask";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  icon?: string;
  tooltip?: string;
}

interface PhaseSidebarProps {
  phase: string;
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export default function PhaseSidebar({ phase, tasks, onTaskStatusChange }: PhaseSidebarProps) {
  const handleTaskClick = (taskId: string) => {
    // You could add additional functionality here in the future
    if (onTaskStatusChange) {
      // Example: Toggle between pending and in-progress
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        let newStatus: TaskStatus = "pending";
        if (task.status === "pending") newStatus = "in-progress";
        else if (task.status === "in-progress") newStatus = "complete";
        else if (task.status === "complete") newStatus = "pending";
        
        onTaskStatusChange(taskId, newStatus);
      }
    }
  };
  
  // Calculate completed tasks
  const completedTasks = tasks.filter(task => task.status === "complete").length;
  const progressPercentage = (completedTasks / tasks.length) * 100;
  
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        <motion.div 
          className="mb-4 space-y-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gradient flex items-center gap-2">
              <span className="text-primary cosmic-gradient bg-clip-text text-transparent">🧠</span> {phase} Phase Tasks
            </h3>
            <Badge className="bg-gradient-to-r from-[#9b87f5]/80 to-[#1EAEDB]/80 text-white border-none">
              {completedTasks}/{tasks.length}
            </Badge>
          </div>
          
          <p className="text-sm text-white/60">Complete these tasks to move forward</p>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/5 rounded-full blur-md"></div>
            <Progress value={progressPercentage} className="h-2 bg-white/5 backdrop-blur-md border border-white/10" indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-[0_0_15px_rgba(155,135,245,0.5)] transition-all duration-1000 ease-in-out" />
            
            {/* Animated glow effect that follows progress */}
            <motion.div className="absolute top-0 h-2 rounded-full blur-md bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] opacity-50" style={{
              width: `${Math.min(progressPercentage + 5, 100)}%`,
              filter: 'blur(8px)'
            }} animate={{
              opacity: [0.3, 0.5, 0.3]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }} />
          </div>
        </motion.div>
        
        <ScrollArea className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-3 pr-4"
          >
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PhaseTask
                  id={task.id}
                  title={task.title}
                  status={task.status}
                  icon={task.icon}
                  tooltip={task.tooltip}
                  onClick={() => handleTaskClick(task.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
