
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";

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
}

export default function RoadmapProgress({
  currentPhase = "idea",
  completedPhases = []
}: RoadmapProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  // Calculate progress percentage
  const progress = Math.max(
    (phases.findIndex(p => p.id === currentPhase) + 1) / phases.length * 100, 
    completedPhases.length / phases.length * 100
  );

  return (
    <TooltipProvider>
      <Collapsible 
        open={isExpanded} 
        onOpenChange={setIsExpanded}
        className="w-full relative"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-gradient">Launch Path</span>
            <span className="text-xs text-white/70 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
              Phase {phases.findIndex(p => p.id === currentPhase) + 1}/{phases.length}
            </span>
          </h2>
          <CollapsibleTrigger asChild>
            <button className="text-white/70 hover:text-white p-1 rounded-full transition-colors">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </CollapsibleTrigger>
        </div>
        
        {/* Modern compact progress bar with shimmer effect */}
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/5 rounded-full blur-md"></div>
          
          {/* Main progress bar */}
          <Progress 
            value={progress} 
            className="h-2.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-full" 
            indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-[0_0_10px_rgba(155,135,245,0.3)] transition-all duration-700 ease-out"
          />
          
          {/* Shimmer animation overlay */}
          <motion.div 
            className="absolute top-0 h-full w-full rounded-full overflow-hidden pointer-events-none"
            style={{ maskImage: 'linear-gradient(to right, transparent, transparent)' }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['0%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
          
          {/* Phase markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {phases.map((phase, index) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isActive = phase.id === currentPhase;
              const position = (index / (phases.length - 1)) * 100;
              
              return (
                <Tooltip key={phase.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "absolute w-1.5 h-1.5 rounded-full -mt-[3px] transition-all duration-300",
                        isActive ? "bg-white scale-125" : 
                        isCompleted ? "bg-white/80" : "bg-white/30"
                      )}
                      style={{ left: `${position}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="glass p-2 text-xs">
                    {phase.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

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
                          "absolute top-[14px] h-0.5 -left-1/2 w-full",
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
