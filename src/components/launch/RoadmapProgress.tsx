
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
      <div className="flex justify-center items-center mb-3 relative">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
        >
          The Launch Path
        </motion.h2>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)} 
          className="absolute right-0 text-white/70 hover:text-white p-1 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.button>
        
        <div className="absolute left-0 flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/70 bg-white/10 px-2 py-1 rounded-full"
          >
            Phase {phases.findIndex(p => p.id === currentPhase) + 1} of {phases.length}
          </motion.span>
        </div>
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
            {/* Progress line with animation */}
            <div className="absolute top-5 left-0 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Phase bubbles */}
            <div className="w-full flex justify-between items-center pb-8 pt-1">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isActive = phase.id === currentPhase;
                
                return (
                  <motion.div 
                    key={phase.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center z-10",
                        isActive ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-lg shadow-[#9b87f5]/30" : "",
                        isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" : !isActive ? "bg-white/10" : ""
                      )}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 15px 2px rgba(155, 135, 245, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          transition={{ type: "spring" }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <span className="text-xs text-white">{index + 1}</span>
                      )}
                    </motion.div>
                    <motion.span 
                      className={cn(
                        "text-xs mt-10 whitespace-nowrap",
                        isActive ? "text-white font-medium" : "text-white/70"
                      )}
                      animate={isActive ? { 
                        scale: [1, 1.05, 1],
                        transition: { repeat: Infinity, duration: 2 }
                      } : {}}
                    >
                      {phase.title}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
