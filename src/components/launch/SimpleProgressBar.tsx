import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SimpleProgressBarProps {
  currentPhase: string;
  completedPhases: string[];
  className?: string;
}

const phases = [
  { id: "shape", label: "Shape Your Idea" },
  { id: "validate", label: "Validate the Idea and the Market" },
  { id: "build", label: "Build the Business" },
  { id: "mvp", label: "Plan the MVP" },
  { id: "pitch", label: "Pitch Your Idea" }
];

export default function SimpleProgressBar({ 
  currentPhase, 
  completedPhases, 
  className 
}: SimpleProgressBarProps) {
  const currentStepIndex = phases.findIndex(phase => phase.id === currentPhase);
  const progressPercentage = ((currentStepIndex + 1) / phases.length) * 100;
  
  const currentPhaseLabel = phases.find(p => p.id === currentPhase)?.label || "Shape Your Idea";

  return (
    <div className={cn("w-full", className)}>
      {/* Phase title and step counter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {currentPhaseLabel}
        </h2>
        <div className="text-sm text-white/60">
          {currentStepIndex + 1} / {phases.length}
        </div>
      </div>

      {/* Simple progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Phase labels */}
      <div className="flex justify-between mt-3">
        {phases.map((phase, index) => {
          const isCompleted = completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhase;
          
          return (
            <div
              key={phase.id}
              className={cn(
                "text-xs transition-colors duration-300",
                isCurrent && "text-white font-medium",
                isCompleted && "text-white/70",
                !isCompleted && !isCurrent && "text-white/40"
              )}
              style={{ width: `${100 / phases.length}%` }}
            >
              <div className="text-center">
                {phase.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}