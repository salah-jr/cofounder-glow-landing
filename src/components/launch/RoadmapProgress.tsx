
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animate the progress based on completed phases
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
      
      {/* Progress track - only visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="relative" 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress line */}
            <div className="absolute top-3 left-0 w-full h-0.5 bg-white/5 rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            {/* Phase dots */}
            <div className="w-full flex justify-between items-center pt-1 pb-8">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isActive = phase.id === currentPhase;
                
                return (
                  <div key={phase.id} className="flex flex-col items-center">
                    <motion.div 
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center z-10",
                        isActive ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-lg shadow-[#9b87f5]/20" : "",
                        isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" : !isActive ? "bg-white/10" : ""
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
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
