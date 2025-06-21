import { motion } from "framer-motion";
import PhaseTask, { TaskStatus } from "./PhaseTask";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  currentStepId: string;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onStepClick?: (stepId: string) => void;
  onResetChat?: () => void;
}

export default function PhaseSidebar({ 
  phase, 
  tasks, 
  currentStepId,
  onTaskStatusChange, 
  onStepClick,
  onResetChat 
}: PhaseSidebarProps) {
  const handleTaskClick = (taskId: string) => {
    // Call the step click handler
    if (onStepClick) {
      onStepClick(taskId);
    }
    
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
  
  return (
    <div className="h-full flex flex-col">
      <motion.div 
        className="mb-3 lg:mb-4 space-y-2 lg:space-y-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-semibold text-gradient flex items-center gap-2">
            <span className="text-primary cosmic-gradient bg-clip-text text-transparent">🧠</span> 
            <span className="truncate">{phase}</span>
          </h3>
        </div>
        
        <p className="text-xs lg:text-sm text-white/60">Complete these steps to move forward</p>
      </motion.div>
      
      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-0 pr-2 lg:pr-4"
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
                tooltip={task.tooltip}
                isActive={task.id === currentStepId}
                onClick={() => handleTaskClick(task.id)}
                onStepClick={onStepClick}
                onResetChat={onResetChat}
              />
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}