
import { useState } from "react";
import { motion } from "framer-motion";
import PhaseTask, { TaskStatus } from "./PhaseTask";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

interface PhaseSidebarProps {
  phase: string;
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export default function PhaseSidebar({ phase, tasks, onTaskStatusChange }: PhaseSidebarProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    // You could add additional functionality here in the future
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{phase} Phase Tasks</h3>
        <p className="text-sm text-white/60">Complete these tasks to move to the next phase</p>
      </div>
      
      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-2 pr-4"
        >
          {tasks.map((task) => (
            <PhaseTask
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              onClick={() => handleTaskClick(task.id)}
            />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
