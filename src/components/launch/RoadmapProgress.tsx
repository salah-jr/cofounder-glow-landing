
import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define phases for the launch roadmap with tooltips
const phases = [{
  id: "idea",
  title: "Idea Refinement",
  tooltip: "Transform your concept into a clear value proposition"
}, {
  id: "validation",
  title: "Validation",
  tooltip: "Validate demand before investing in build"
}, {
  id: "planning",
  title: "Planning",
  tooltip: "Map out your execution strategy and timeline"
}, {
  id: "prototype",
  title: "Prototype",
  tooltip: "Create a minimum viable product to test with users"
}, {
  id: "development",
  title: "Development",
  tooltip: "Build a scalable version of your solution"
}, {
  id: "launch",
  title: "Launch",
  tooltip: "Release your product and acquire first users"
}, {
  id: "growth",
  title: "Growth",
  tooltip: "Scale your customer base and optimize operations"
}];

// Define props for the component
interface RoadmapProgressProps {
  currentPhase?: string;
  completedPhases?: string[];
  autoHideComplete?: boolean;
}

export default function RoadmapProgress({
  currentPhase = "idea",
  completedPhases = [],
  autoHideComplete = false
}: RoadmapProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);

  // Calculate progress percentage
  const progress = Math.max(
    (phases.findIndex(p => p.id === currentPhase) + 1) / phases.length * 100, 
    completedPhases.length / phases.length * 100
  );

  // Animate progress on mount or when progress changes
  useEffect(() => {
    setProgressWidth(0);
    const timer = setTimeout(() => {
      setProgressWidth(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Auto-hide when progress is complete
  const shouldHide = autoHideComplete && progress >= 100;

  return (
    <TooltipProvider>
      <Collapsible 
        open={isExpanded && !shouldHide} 
        onOpenChange={setIsExpanded}
        className="w-full relative"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-gradient text-base font-medium">Launch Path</h2>
            <span className="text-xs text-white/70 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
              {Math.round(progress)}% Complete • Phase {phases.findIndex(p => p.id === currentPhase) + 1}/{phases.length}
            </span>
          </div>
          <CollapsibleTrigger asChild>
            <button 
              className="text-white/50 hover:text-white/80 p-1.5 rounded-full transition-all duration-300
                        bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
              aria-label={isExpanded ? "Collapse roadmap" : "Expand roadmap"}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </CollapsibleTrigger>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-1"
            >
              {/* Modern compact progress bar container */}
              <div className="relative h-[8px] group w-full">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/5 to-[#1EAEDB]/5 rounded-full blur-sm"></div>
                
                {/* Background track */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/5 rounded-full overflow-hidden">
                  {/* Animated progress bar with easing */}
                  <div 
                    className="h-full bg-gradient-to-r from-[#9b87f5] via-[#6569db] to-[#1EAEDB] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 w-full h-full animate-shimmer" 
                         style={{
                           backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                           backgroundSize: '200% 100%'
                         }}
                    />
                  </div>
                </div>
                
                {/* Phase markers with tooltips */}
                <div className="absolute inset-0 flex justify-between px-0.5 items-center">
                  {phases.map((phase, index) => {
                    const isCompleted = completedPhases.includes(phase.id) || phases.findIndex(p => p.id === currentPhase) > index;
                    const isActive = phase.id === currentPhase;
                    const position = (index / (phases.length - 1)) * 100;
                    
                    return (
                      <Tooltip key={phase.id}>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "absolute w-1.5 h-1.5 -mt-[1px] rounded-full transition-all duration-300",
                              isActive ? "bg-white scale-110 shadow-glow z-10" : 
                              isCompleted ? "bg-white/80" : "bg-white/20"
                            )}
                            style={{ left: `${position}%` }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-black/80 backdrop-blur-md border-white/10 text-white text-xs">
                          {phase.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded details (collapsible) */}
        <CollapsibleContent>
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full flex justify-between items-center relative">
              {phases.map((phase, index) => {
                const isCompleted = completedPhases.includes(phase.id);
                const isActive = phase.id === currentPhase;
                const isHovered = hoveredPhase === phase.id;
                
                return (
                  <div 
                    key={phase.id}
                    className="flex flex-col items-center relative cursor-pointer"
                    onMouseEnter={() => setHoveredPhase(phase.id)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    {/* Connector line */}
                    {index > 0 && (
                      <div 
                        className={cn(
                          "absolute top-[14px] h-0.5 -left-1/2 w-full transition-colors duration-500",
                          isCompleted && index <= phases.findIndex(p => p.id === currentPhase) 
                            ? "bg-gradient-to-r from-[#9b87f5]/80 to-[#1EAEDB]/80" 
                            : "bg-white/10"
                        )}
                      />
                    )}
                    
                    {/* Phase indicator circle */}
                    <div 
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                        isActive 
                          ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-[0_0_15px_rgba(155,135,245,0.5)]" 
                          : isCompleted 
                            ? "bg-gradient-to-r from-[#9b87f5]/90 to-[#1EAEDB]/90" 
                            : "bg-white/10 backdrop-blur-sm border border-white/10",
                        (isHovered || isActive) && "scale-110"
                      )}
                    >
                      {isCompleted ? 
                        <Check className="w-3 h-3 text-white" /> : 
                        <span className="text-[10px] text-white">{index + 1}</span>
                      }
                    </div>
                    
                    {/* Phase title */}
                    <span 
                      className={cn(
                        "text-[10px] mt-2 whitespace-nowrap transition-all duration-300", 
                        isActive ? "text-white font-medium" : "text-white/60",
                        (isHovered || isActive) && "text-white"
                      )}
                    >
                      {phase.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
