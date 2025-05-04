
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  showLabels = false,
  className,
  height = 6
}: ProgressBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps - 1)) * 100;
  
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative py-6", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Current step indicator */}
      <div className="mb-2 text-center">
        <span className="text-xs inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white font-medium">
          Step {currentStep} of {steps}: {labels?.[currentStep - 1]}
        </span>
      </div>
      
      {/* Progress container */}
      <div className="relative w-full">
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
        
        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
          {Array.from({ length: steps }).map((_, index) => {
            const isCompleted = index < currentStep - 1;
            const isCurrent = index === currentStep - 1;
            const isUpcoming = index > currentStep - 1;
            
            return (
              <motion.div 
                key={index}
                className={cn(
                  "rounded-full flex items-center justify-center border transform transition-all duration-300",
                  isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] border-transparent" : 
                  isCurrent ? "bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] border-white/20 glow" : 
                  "bg-white/20 border-white/10"
                )}
                style={{ 
                  width: isCurrent ? '12px' : '8px', 
                  height: isCurrent ? '12px' : '8px'
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
              />
            );
          })}
        </div>
        
        {/* Optional step labels */}
        {showLabels && labels && (isHovering || true) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-6 left-0 w-full flex justify-between mt-2"
          >
            {labels.map((label, index) => (
              <div 
                key={index}
                className={cn(
                  "text-xs transform -translate-x-1/2",
                  index + 1 === currentStep ? "text-white font-medium" : 
                  index + 1 < currentStep ? "text-white/80" : "text-white/50"
                )}
                style={{ 
                  left: `${(index / (steps - 1)) * 100}%`,
                  fontSize: index + 1 === currentStep ? '0.75rem' : '0.7rem'
                }}
              >
                {label}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
