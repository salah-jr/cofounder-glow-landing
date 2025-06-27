import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  hover?: boolean;
  glow?: boolean;
  colorfulShadow?: boolean;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className,
  intensity = 'medium',
  hover = true,
  glow = false,
  colorfulShadow = false
}) => {
  const intensityStyles = {
    light: 'bg-white/5 border-white/10 backdrop-blur-sm',
    medium: 'bg-white/10 border-white/20 backdrop-blur-md',
    strong: 'bg-white/15 border-white/30 backdrop-blur-lg'
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-xl border transition-all duration-300',
        intensityStyles[intensity],
        hover && !colorfulShadow && 'hover:bg-white/15 hover:border-white/30 hover:shadow-lg hover:shadow-white/10',
        hover && colorfulShadow && 'hover:shadow-lg',
        glow && 'shadow-lg shadow-indigo-500/20',
        className
      )}
      whileHover={hover && colorfulShadow ? { 
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(244, 63, 94, 0.1)'
      } : hover ? { 
        scale: 1.02,
        boxShadow: glow 
          ? '0 20px 40px rgba(99, 102, 241, 0.3)' 
          : '0 20px 40px rgba(255, 255, 255, 0.1)'
      } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphismCard;