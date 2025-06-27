
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  return <TooltipProvider>
      <div className="w-full relative">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-gradient">Launch Path</span>
            <span className="text-xs text-white/70 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
              Phase {phases.findIndex(p => p.id === currentPhase) + 1}/{phases.length}
            </span>
          </h2>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white/70 hover:text-white p-1 rounded-full transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {/* Progress bar removed */}
        
        {/* Expanded phase visualization - only visible when expanded */}
        <AnimatePresence>
          {isExpanded && <motion.div className="relative mt-8" initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} transition={{
          duration: 0.3
        }}>
              <div className="w-full flex justify-between items-center pb-6">
                {phases.map((phase, index) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isActive = phase.id === currentPhase;
              const isHovered = hoveredPhase === phase.id;
              return <HoverCard key={phase.id} openDelay={200} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <motion.div className="flex flex-col items-center relative cursor-pointer" initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    delay: index * 0.05
                  }} onHoverStart={() => setHoveredPhase(phase.id)} onHoverEnd={() => setHoveredPhase(null)}>
                          {/* Phase connector line */}
                          {index > 0 && <div style={{
                      left: "-95%"
                    }} className="" />}
                          
                          {/* Animated glow effect for active phase */}
                          {isActive && <motion.div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] blur-xl -z-10" initial={{
                      opacity: 0,
                      scale: 0.8
                    }} animate={{
                      opacity: 0.4,
                      scale: 1.2
                    }} transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }} />}
                          
                          {/* Phase indicator circle */}
                          <motion.div className={cn("w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all duration-300", isActive ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] shadow-[0_0_15px_rgba(155,135,245,0.5)]" : isCompleted ? "bg-gradient-to-r from-[#9b87f5]/90 to-[#1EAEDB]/90" : "bg-white/10 backdrop-blur-sm border border-white/10", (isHovered || isActive) && "scale-110")} whileHover={{
                      scale: 1.1
                    }} animate={isActive ? {
                      boxShadow: ["0 0 10px rgba(155,135,245,0.3)", "0 0 20px rgba(155,135,245,0.6)", "0 0 10px rgba(155,135,245,0.3)"]
                    } : {}} transition={{
                      duration: 2,
                      repeat: Infinity
                    }}>
                            {isCompleted ? <Check className="w-3 h-3 text-white" /> : <span className="text-[10px] text-white">{index + 1}</span>}
                          </motion.div>
                          
                          {/* Phase title */}
                          <span className={cn("text-[10px] mt-2 whitespace-nowrap transition-all duration-300", isActive ? "text-white font-medium" : "text-white/60", (isHovered || isActive) && "text-white scale-105")}>
                            {phase.title}
                          </span>
                        </motion.div>
                      </HoverCardTrigger>
                      <HoverCardContent className="glass p-3 backdrop-blur-md bg-black/40 border-white/10 text-white">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-medium text-sm">{phase.title}</h4>
                          <p className="text-xs text-white/80">{phase.tooltip}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>;
            })}
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </TooltipProvider>;
}
