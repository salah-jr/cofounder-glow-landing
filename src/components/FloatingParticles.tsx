import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  speed?: number;
  size?: number;
  color?: string;
  className?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  speed = 1,
  size = 4,
  color = 'rgba(155, 135, 245, 0.6)',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    animationDuration: 10 + Math.random() * 20,
    delay: Math.random() * 10,
    size: size + Math.random() * size,
    opacity: 0.3 + Math.random() * 0.7
  }));

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: particle.opacity,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px ${color}`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.animationDuration * speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;