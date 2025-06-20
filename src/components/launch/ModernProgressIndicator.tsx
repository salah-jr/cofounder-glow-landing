import React from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ModernProgressIndicatorProps {
  currentPhase: string;
  completedPhases: string[];
  className?: string;
}

const phases = [
  { id: "idea", label: "Idea" },
  { id: "validation", label: "Validation" },
  { id: "planning", label: "Planning" },
  { id: "prototype", label: "Prototype" },
  { id: "development", label: "Development" },
  { id: "launch", label: "Launch" },
  { id: "growth", label: "Growth" }
];

export default function ModernProgressIndicator({ 
  currentPhase, 
  completedPhases, 
  className 
}: ModernProgressIndicatorProps) {
  const getStepStatus = (phaseId: string): "completed" | "current" | "upcoming" => {
    if (completedPhases.includes(phaseId)) return "completed";
    if (phaseId === currentPhase) return "current";
    return "upcoming";
  };

  const currentStepIndex = phases.findIndex(phase => phase.id === currentPhase);
  const progressPercentage = ((currentStepIndex + 1) / phases.length) * 100;

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header with current phase info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {phases.find(p => p.id === currentPhase)?.label} Phase
          </h2>
          <p className="text-sm text-white/60">
            Step {currentStepIndex + 1} of {phases.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-xs text-white/60">Complete</div>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative">
        {/* Background track */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          {/* Animated progress fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center -translate-y-1/2">
          {phases.map((phase, index) => {
            const status = getStepStatus(phase.id);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            
            return (
              <motion.div
                key={phase.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step circle */}
                <motion.div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted && "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] border-transparent",
                    isCurrent && "bg-white border-[#9b87f5] shadow-lg",
                    !isCompleted && !isCurrent && "bg-white/10 border-white/30"
                  )}
                  whileHover={{ scale: 1.1 }}
                  animate={isCurrent ? {
                    boxShadow: [
                      "0 0 0 0 rgba(155, 135, 245, 0.4)",
                      "0 0 0 8px rgba(155, 135, 245, 0)",
                      "0 0 0 0 rgba(155, 135, 245, 0.4)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : isCurrent ? (
                    <Circle className="w-2 h-2 fill-[#9b87f5]" />
                  ) : (
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                  )}
                </motion.div>

                {/* Step label */}
                <motion.span
                  className={cn(
                    "text-xs mt-2 font-medium transition-colors duration-300",
                    isCurrent && "text-white",
                    isCompleted && "text-white/80",
                    !isCompleted && !isCurrent && "text-white/50"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {phase.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}