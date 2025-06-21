import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ModernProgressIndicatorProps {
  currentPhase: string;
  completedPhases: string[];
  onPhaseClick?: (phaseId: string) => void;
  className?: string;
}

const phases = [
  { id: "shape", label: "Shape Your Idea" },
  { id: "validate", label: "Validate the Idea and the Market" },
  { id: "build", label: "Build the Business" },
  { id: "mvp", label: "Plan the MVP" },
  { id: "pitch", label: "Pitch Your Idea" }
];

export default function ModernProgressIndicator({ 
  currentPhase, 
  completedPhases, 
  onPhaseClick,
  className 
}: ModernProgressIndicatorProps) {
  const getStepStatus = (phaseId: string): "completed" | "current" | "upcoming" => {
    if (completedPhases.includes(phaseId)) return "completed";
    if (phaseId === currentPhase) return "current";
    return "upcoming";
  };

  const currentStepIndex = phases.findIndex(phase => phase.id === currentPhase);
  const progressPercentage = ((currentStepIndex + 1) / phases.length) * 100;

  const handlePhaseClick = (phaseId: string) => {
    if (onPhaseClick) {
      onPhaseClick(phaseId);
    }
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header with current phase info */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {phases.find(p => p.id === currentPhase)?.label}
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Phase {currentStepIndex + 1} of {phases.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-xs text-white/60">Complete</div>
        </div>
      </div>

      {/* Modern Panel Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          {phases.map((phase, index) => {
            const status = getStepStatus(phase.id);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isClickable = true; // All phases are clickable for navigation
            
            return (
              <React.Fragment key={phase.id}>
                {/* Phase Panel */}
                <motion.div
                  className={cn(
                    "relative flex-1 min-w-0 cursor-pointer group",
                    "transition-all duration-300 ease-out",
                    isClickable && "hover:scale-[1.02]"
                  )}
                  onClick={() => handlePhaseClick(phase.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Panel Background */}
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-xl border transition-all duration-300",
                      "backdrop-blur-sm",
                      isCurrent && [
                        "bg-gradient-to-r from-[#9b87f5]/20 to-[#1EAEDB]/20",
                        "border-[#9b87f5]/40",
                        "shadow-lg shadow-[#9b87f5]/20"
                      ],
                      isCompleted && [
                        "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
                        "border-green-500/30",
                        "shadow-md shadow-green-500/10"
                      ],
                      !isCompleted && !isCurrent && [
                        "bg-white/5",
                        "border-white/10",
                        "hover:bg-white/10 hover:border-white/20"
                      ]
                    )}
                  >
                    {/* Animated background glow for current phase */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/10"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Panel Content */}
                    <div className="relative p-4 flex items-center gap-3">
                      {/* Phase Number/Status Icon */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full",
                          "transition-all duration-300",
                          isCurrent && "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white shadow-lg",
                          isCompleted && "bg-green-500 text-white",
                          !isCompleted && !isCurrent && "bg-white/10 text-white/70"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>

                      {/* Phase Label */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "font-medium text-sm transition-colors duration-300 truncate",
                            isCurrent && "text-white",
                            isCompleted && "text-green-100",
                            !isCompleted && !isCurrent && "text-white/70 group-hover:text-white/90"
                          )}
                        >
                          {phase.label}
                        </h3>
                        <p
                          className={cn(
                            "text-xs mt-1 transition-colors duration-300",
                            isCurrent && "text-white/80",
                            isCompleted && "text-green-200/80",
                            !isCompleted && !isCurrent && "text-white/50"
                          )}
                        >
                          {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                        </p>
                      </div>

                      {/* Hover indicator */}
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          "opacity-0 group-hover:opacity-60 transform translate-x-1 group-hover:translate-x-0",
                          isCurrent && "text-white",
                          isCompleted && "text-green-200",
                          !isCompleted && !isCurrent && "text-white/50"
                        )}
                      />
                    </div>

                    {/* Active phase indicator line */}
                    {isCurrent && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Connector Arrow (except for last item) */}
                {index < phases.length - 1 && (
                  <div className="flex items-center justify-center w-6 h-6 relative z-10">
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-colors duration-300",
                        isCompleted && "text-green-400",
                        isCurrent && "text-[#9b87f5]",
                        !isCompleted && !isCurrent && "text-white/30"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Overall Progress Track (subtle background indicator) */}
        <div className="absolute -bottom-6 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}