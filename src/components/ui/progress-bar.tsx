
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProgressBarProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  showLabels?: boolean;
  className?: string;
  height?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ProgressBar = ({
  steps,
  currentStep,
  labels,
  showLabels = false,
  className,
  height = 4,
  collapsed = false,
  onToggleCollapse
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
    <AnimatePresence>
      {!collapsed && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("relative py-3", className)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Progress container */}
          <div className="relative w-full">
            {/* Background track */}
            <div 
              className="w-full bg-white/10 rounded-full overflow-hidden shadow-inner"
              style={{ height: `${height}px` }}
            >
              {/* Animated fill */}
              <motion.div 
                className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
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
                
                return (
                  <motion.div 
                    key={index}
                    className={cn(
                      "rounded-full flex items-center justify-center border transform transition-all duration-300",
                      isCompleted ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] border-transparent" : 
                      isCurrent ? "bg-white border-[#9b87f5]" : 
                      "bg-white/20 border-white/10"
                    )}
                    style={{ 
                      width: isCurrent ? '10px' : '8px', 
                      height: isCurrent ? '10px' : '8px'
                    }}
                    animate={isCurrent ? {
                      scale: [1, 1.15, 1],
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
            {showLabels && labels && isHovering && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 left-0 w-full flex justify-between mt-1"
              >
                {labels.map((label, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "text-xs transform -translate-x-1/2",
                      index + 1 === currentStep ? "text-white font-medium" : "text-white/60"
                    )}
                    style={{ left: `${(index / (steps - 1)) * 100}%` }}
                  >
                    {label}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Collapse toggle button */}
          {onToggleCollapse && (
            <motion.button
              onClick={onToggleCollapse}
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 p-1 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {collapsed ? 
                <ChevronDown className="w-3 h-3 text-white/70" /> : 
                <ChevronUp className="w-3 h-3 text-white/70" />
              }
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
