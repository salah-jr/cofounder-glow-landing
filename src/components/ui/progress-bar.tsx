import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Signal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface ProgressBarProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  showLabels?: boolean;
  className?: string;
  height?: number;
}
export const ProgressBar = ({
  steps,
  currentStep,
  labels,
  showLabels = true,
  className,
  height = 4
}: ProgressBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate progress percentage
  const progressPercentage = (currentStep - 1) / (steps - 1) * 100;

  // Auto-hide progressbar on small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth > 640);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  if (!isVisible) return null;
  return <TooltipProvider>
      <div className={cn("relative py-2", className)}>
        {/* Modern floating indicator with wave animation */}
        <motion.div className="mb-4 text-center" initial={{
        y: -5,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.4
      }}>
          <button onClick={() => setIsExpanded(!isExpanded)} className="group inline-flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white font-medium mx-auto px-4 py-1.5 cursor-pointer transition-all duration-300 hover:bg-black/30 hover:border-white/20">
            <Signal className={cn("h-3.5 w-3.5 text-[#9b87f5] transition-transform duration-500", isExpanded ? "animate-pulse" : "animate-none")} />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent text-sm">
              Phase {currentStep}: {labels?.[currentStep - 1]}
            </span>
            <motion.div animate={{
            rotate: isExpanded ? 180 : 0
          }} transition={{
            duration: 0.3
          }} className="ml-1">
              <ChevronDown size={12} className="text-white/70" />
            </motion.div>
          </button>
        </motion.div>
        
        {/* Progress visualization - only visible when expanded */}
        <AnimatePresence>
          {isExpanded && <motion.div className="relative w-full mb-6" initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}>
              <div className="relative mt-8">
                {/* Modern progress track */}
                <div className="w-full bg-gradient-to-r from-white/5 to-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 shadow-inner" style={{
              height: `${height}px`
            }}>
                  {/* Animated progress fill with glow effect */}
                  <motion.div className="h-full relative rounded-full overflow-hidden" style={{
                width: `${progressPercentage}%`
              }} initial={{
                width: 0
              }} animate={{
                width: `${progressPercentage}%`
              }} transition={{
                duration: 0.8,
                ease: "easeOut"
              }}>
                    {/* Main gradient fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5] via-[#33C3F0] to-[#1EAEDB] rounded-full" />
                    
                    {/* Animated shine effect */}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" initial={{
                  x: '-100%'
                }} animate={{
                  x: '200%'
                }} transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }} />
                  </motion.div>
                </div>
                
                {/* Interactive step indicators positioned ON the track - updated positioning */}
                <div className="absolute top-0 left-0 w-full flex justify-between" style={{
              transform: 'translateY(-50%)'
            }}>
                  {Array.from({
                length: steps
              }).map((_, index) => {
                const isCompleted = index < currentStep - 1;
                const isCurrent = index === currentStep - 1;
                const isUpcoming = index > currentStep - 1;
                const stepPosition = `${index / (steps - 1) * 100}%`;
                return <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{
                      scale: 1.1
                    }} transition={{
                      duration: 0.2
                    }} style={{
                      position: 'absolute',
                      left: stepPosition,
                      transform: 'translateX(-50%)'
                    }} className="flex flex-col items-center cursor-pointer">
                            <motion.div className={cn("rounded-full flex items-center justify-center shadow-lg z-10", isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] border border-white/30" : isCurrent ? "bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] border border-white/30" : "bg-white/10 backdrop-blur-sm border border-white/20")} style={{
                        width: isCurrent ? '20px' : isCompleted ? '16px' : '12px',
                        height: isCurrent ? '20px' : isCompleted ? '16px' : '12px'
                      }} animate={isCurrent ? {
                        boxShadow: ['0 0 3px rgba(155,135,245,0.3)', '0 0 8px rgba(155,135,245,0.6)', '0 0 3px rgba(155,135,245,0.3)']
                      } : {}} transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}>
                              {isCompleted && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>}
                              
                              {isCurrent && <motion.div className="w-2 h-2 bg-white rounded-full" animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }} transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }} />}
                              
                              {isUpcoming && <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />}
                            </motion.div>
                            
                            {/* Step labels positioned under indicators - improved spacing */}
                            {showLabels && labels && <motion.div className="absolute top-7 text-center" initial={{
                        opacity: 0,
                        y: -5
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        delay: index * 0.1
                      }}>
                                <span className={cn("text-xs whitespace-nowrap px-2 py-0.5 rounded-md", isCurrent ? "bg-white/5 text-white font-medium" : isCompleted ? "text-white/80" : "text-white/40")}>
                                  {labels[index]}
                                </span>
                              </motion.div>}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-black/80 backdrop-blur-xl border-white/10 text-white">
                          <p>{labels?.[index]}</p>
                          <p className="text-xs text-white/70">
                            {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                          </p>
                        </TooltipContent>
                      </Tooltip>;
              })}
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </TooltipProvider>;
};