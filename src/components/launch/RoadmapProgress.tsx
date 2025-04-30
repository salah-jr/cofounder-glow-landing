
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Define phases for the launch roadmap
const phases = [
  { id: "idea", title: "Idea Refinement" },
  { id: "validation", title: "Validation" },
  { id: "planning", title: "Planning" },
  { id: "prototype", title: "Prototype" },
  { id: "development", title: "Development" },
  { id: "launch", title: "Launch" },
  { id: "growth", title: "Growth" }
];

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
  const progress = Math.max(
    ((phases.findIndex(p => p.id === currentPhase) + 1) / phases.length) * 100,
    (completedPhases.length / phases.length) * 100
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-white">The Launch Path</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">
            Phase {phases.findIndex(p => p.id === currentPhase) + 1} of {phases.length}
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      
      {/* Progress track - only visible when expanded */}
      {isExpanded && (
        <motion.div 
          className="relative h-32" 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 128, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress line */}
          <div className="absolute top-1/3 left-0 w-full h-1 bg-white/10 rounded-full transform -translate-y-1/2">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          {/* Phase bubbles */}
          <div className="absolute top-0 left-0 w-full flex justify-between items-center">
            {phases.map((phase, index) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isActive = phase.id === currentPhase;
              
              return (
                <div key={phase.id} className="flex flex-col items-center">
                  <motion.div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10",
                      isActive ? "glass border-2 border-white animate-pulse-subtle" : "",
                      isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" :
                      !isActive ? "bg-white/10" : ""
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs text-white">{index + 1}</span>
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-8 whitespace-nowrap", // Increased margin here for more space below numbers
                    isActive ? "text-white" : "text-white/70"
                  )}>
                    {phase.title}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
