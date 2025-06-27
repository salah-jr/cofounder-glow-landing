import { motion } from "framer-motion";
import PhaseTask, { TaskStatus } from "./PhaseTask";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  icon?: string;
  tooltip?: string;
}

interface Phase {
  id: string;
  label: string;
}

interface PhaseSidebarProps {
  allPhases: Record<string, Task[]>;
  mainPhases: Phase[];
  currentPhase: string;
  currentStepId: string;
  completedPhases: string[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onStepClick?: (stepId: string) => void;
  onResetChat?: () => void;
  onCompletePhase: () => void;
  onPhaseClick: (phaseId: string) => void;
  canCompletePhase: boolean;
}

export default function PhaseSidebar({ 
  allPhases,
  mainPhases,
  currentPhase,
  currentStepId,
  completedPhases,
  onTaskStatusChange, 
  onStepClick,
  onResetChat,
  onCompletePhase,
  onPhaseClick,
  canCompletePhase
}: PhaseSidebarProps) {
  
  const [expandedPhase, setExpandedPhase] = useState<string>(currentPhase);

  // Get phase status
  const getPhaseStatus = (phaseId: string) => {
    if (completedPhases.includes(phaseId)) {
      return "complete";
    }
    
    const tasks = allPhases[phaseId] || [];
    const completedTasks = tasks.filter(task => task.status === "complete").length;
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
    
    if (completedTasks === tasks.length && tasks.length > 0) {
      return "complete";
    } else if (inProgressTasks > 0 || phaseId === currentPhase) {
      return "in-progress";
    } else {
      return "pending";
    }
  };

  // Get phase icon
  const getPhaseIcon = (phaseId: string) => {
    const status = getPhaseStatus(phaseId);
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Circle className="w-5 h-5 text-white/40" />;
    }
  };

  // Handle phase toggle
  const handlePhaseToggle = (phaseId: string) => {
    const isCompleted = completedPhases.includes(phaseId);
    const isCurrentPhase = phaseId === currentPhase;
    
    // Allow clicking on current phase or completed phases
    if (isCurrentPhase || isCompleted) {
      // If clicking on a different phase, navigate to it
      if (phaseId !== currentPhase) {
        onPhaseClick(phaseId);
      }
      
      // Toggle expansion
      setExpandedPhase(expandedPhase === phaseId ? "" : phaseId);
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
            <span className="text-primary cosmic-gradient bg-clip-text text-transparent">🚀</span> 
            <span className="truncate">Startup Journey</span>
          </h3>
        </div>
        
        <p className="text-xs lg:text-sm text-white/60">Navigate through each phase step by step</p>
      </motion.div>
      
      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-2 pr-2 lg:pr-4"
        >
          {mainPhases.map((phase, phaseIndex) => {
            const phaseStatus = getPhaseStatus(phase.id);
            const tasks = allPhases[phase.id] || [];
            const isCurrentPhase = phase.id === currentPhase;
            const isCompleted = completedPhases.includes(phase.id);
            const isExpanded = expandedPhase === phase.id;
            const isClickable = isCurrentPhase || isCompleted; // Current or completed phases are clickable
            
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: phaseIndex * 0.1 }}
                className="border border-white/10 rounded-lg overflow-hidden"
              >
                {/* Phase Header */}
                <div 
                  className={cn(
                    "flex items-center gap-3 py-3 px-3 transition-all duration-200",
                    isCurrentPhase && "bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/10",
                    isCompleted && !isCurrentPhase && "bg-gradient-to-r from-green-500/5 to-green-400/5",
                    isClickable && "cursor-pointer hover:bg-white/5",
                    !isClickable && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => isClickable && handlePhaseToggle(phase.id)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    phaseStatus === "complete" ? "bg-green-400/20" : 
                    phaseStatus === "in-progress" ? "bg-blue-400/20" : 
                    "bg-white/10"
                  )}>
                    {getPhaseIcon(phase.id)}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrentPhase ? "text-white" : 
                      isCompleted ? "text-green-200" : 
                      "text-white/70"
                    )}>
                      {phase.label}
                    </h4>
                    <p className="text-xs text-white/50">
                      {tasks.filter(t => t.status === "complete").length}/{tasks.length} completed
                    </p>
                  </div>
                  
                  {isClickable && (
                    <ChevronDown className={cn(
                      "h-4 w-4 text-white/50 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  )}
                </div>
                
                {/* Phase Content */}
                {(isCurrentPhase || isCompleted) && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-white/10"
                  >
                    {/* Remove the margin wrapper and let steps take full width */}
                    <div className="w-full">
                      {tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: taskIndex * 0.05 }}
                          className="w-full"
                        >
                          <PhaseTask
                            id={task.id}
                            title={task.title}
                            status={task.status}
                            tooltip={task.tooltip}
                            isActive={task.id === currentStepId}
                            onStepClick={onStepClick}
                            onResetChat={onResetChat}
                            isClickable={false} // Make steps non-clickable
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </ScrollArea>

      {/* Complete Phase Button */}
      {canCompletePhase && (
        <motion.div 
          className="mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onCompletePhase}
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-all duration-300 text-white font-medium"
          >
            Complete Phase
          </Button>
        </motion.div>
      )}
    </div>
  );
}