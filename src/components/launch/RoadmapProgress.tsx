
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

// Define phases for the launch roadmap
const phases = [{
  id: "idea",
  title: "Idea Refinement"
}, {
  id: "validation",
  title: "Validation"
}, {
  id: "planning",
  title: "Planning"
}, {
  id: "prototype",
  title: "Prototype"
}, {
  id: "development",
  title: "Development"
}, {
  id: "launch",
  title: "Launch"
}, {
  id: "growth",
  title: "Growth"
}];

// Define props for the component
interface RoadmapProgressProps {
  currentPhase?: string;
  completedPhases?: string[];
}

export default function RoadmapProgress({
  currentPhase = "idea",
  completedPhases = []
}: RoadmapProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate progress percentage
  const progress = Math.max((phases.findIndex(p => p.id === currentPhase) + 1) / phases.length * 100, completedPhases.length / phases.length * 100);
  
  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>Launch Path</span>
          <span className="text-xs text-white/70 px-2 py-0.5 rounded-full bg-white/10">
            Phase {phases.findIndex(p => p.id === currentPhase) + 1}/{phases.length}
          </span>
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {/* Modern slim progress bar - always visible */}
      <div className="mb-2">
        <Progress 
          value={progress} 
          className="h-1.5 bg-white/10"
          indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]"
        />
      </div>
      
      {/* Expanded phase dots - only visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="relative" 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full flex justify-between items-center pt-2 pb-6">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isActive = phase.id === currentPhase;
                const progressPerPhase = 100 / phases.length;
                const phaseProgress = progress >= ((index + 1) * progressPerPhase) ? 100 : 0;
                
                return (
                  <div key={phase.id} className="flex flex-col items-center">
                    <motion.div 
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center z-10",
                        isActive ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-lg shadow-[#9b87f5]/20" : "",
                        isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" : !isActive ? "bg-white/10" : "",
                      )}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: isActive ? 1 : 0.8,
                        background: phaseProgress === 100 ? "linear-gradient(to right, #9b87f5, #1EAEDB)" : (isActive ? "linear-gradient(to right, #9b87f5, #1EAEDB)" : "rgba(255, 255, 255, 0.1)")
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {isCompleted ? 
                        <Check className="w-3 h-3 text-white" /> : 
                        <span className="text-[10px] text-white">{index + 1}</span>
                      }
                    </motion.div>
                    <span className={cn(
                      "text-[10px] mt-2 whitespace-nowrap",
                      isActive ? "text-white font-medium" : "text-white/60"
                    )}>
                      {phase.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
