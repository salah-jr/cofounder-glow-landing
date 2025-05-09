
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
  height = 6
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
  
  return (
    <div className={cn("relative py-2", className)}>
      {/* Current step indicator - always visible */}
      <motion.div 
        className="mb-2 text-center cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-sm inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white font-medium w-full">
          Step {currentStep} of {steps}: {labels?.[currentStep - 1]}
          <ChevronDown 
            size={16} 
            className={cn(
              "inline ml-2 transition-transform duration-300",
              isExpanded && "transform rotate-180"
            )}
          />
        </span>
      </motion.div>
      
      {/* Progress bar - only visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="relative w-full my-4 mb-8" // Added mb-8 for extra space below when expanded
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background track */}
            <div 
              className="w-full bg-white/10 rounded-full overflow-hidden shadow-inner" 
              style={{ height: `${height}px` }}
            >
              {/* Animated fill */}
              <motion.div 
                className="h-full bg-gradient-to-r from-[#9b87f5] via-[#33C3F0] to-[#1EAEDB] rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            {/* Step indicators - properly centered over the bar */}
            <div className="absolute top-0 left-0 w-full flex justify-between my-[4px]">
              {Array.from({length: steps}).map((_, index) => {
                const isCompleted = index < currentStep - 1;
                const isCurrent = index === currentStep - 1;
                const isUpcoming = index > currentStep - 1;
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center relative" 
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    <motion.div 
                      className={cn("rounded-full flex items-center justify-center border transform transition-all duration-300", 
                        isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] border-transparent" : 
                        isCurrent ? "bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] border-white/20 glow" : 
                        "bg-white/20 border-white/10"
                      )} 
                      style={{
                        width: isCurrent ? '24px' : '20px',
                        height: isCurrent ? '24px' : '20px',
                        zIndex: 10,
                        opacity: 1
                      }} 
                      animate={isCurrent ? {
                        scale: [1, 1.2, 1],
                        boxShadow: ['0 0 5px rgba(155,135,245,0.3)', '0 0 10px rgba(155,135,245,0.6)', '0 0 5px rgba(155,135,245,0.3)'],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      } : {}}
                    >
                      {isCompleted && (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </motion.div>
                    
                    {/* Step labels positioned directly under the indicators */}
                    {showLabels && labels && (
                      <div className="absolute top-6 text-center min-w-max">
                        <span 
                          className={cn(
                            "text-xs transform -translate-x-1/2 whitespace-nowrap", 
                            index + 1 === currentStep ? "text-white font-medium" : 
                            index + 1 < currentStep ? "text-white/80" : "text-white/50"
                          )} 
                          style={{
                            fontSize: index + 1 === currentStep ? '0.75rem' : '0.7rem',
                            left: '50%'
                          }}
                        >
                          {labels[index]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
