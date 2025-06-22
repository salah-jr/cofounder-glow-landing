import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

const ModernAIBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const controls = useAnimation();

  // Particle colors for the neural network effect
  const particleColors = [
    'rgba(155, 135, 245, 0.8)', // Purple
    'rgba(30, 174, 219, 0.8)',  // Blue
    'rgba(99, 102, 241, 0.8)',  // Indigo
    'rgba(168, 85, 247, 0.8)',  // Violet
  ];

  // Initialize particles
  const initializeParticles = (width: number, height: number) => {
    const particleCount = Math.min(50, Math.floor((width * height) / 15000));
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }

    setParticles(newParticles);
  };

  // Calculate connections between nearby particles
  const calculateConnections = (particles: Particle[]) => {
    const newConnections: Connection[] = [];
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          newConnections.push({
            x1: particles[i].x,
            y1: particles[i].y,
            x2: particles[j].x,
            y2: particles[j].y,
            opacity
          });
        }
      }
    }

    setConnections(newConnections);
  };

  // Animation loop
  const animate = () => {
    setParticles(prevParticles => {
      const updatedParticles = prevParticles.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;

        // Bounce off edges
        if (newX <= 0 || newX >= dimensions.width) {
          particle.speedX *= -1;
          newX = Math.max(0, Math.min(dimensions.width, newX));
        }
        if (newY <= 0 || newY >= dimensions.height) {
          particle.speedY *= -1;
          newY = Math.max(0, Math.min(dimensions.height, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY
        };
      });

      calculateConnections(updatedParticles);
      return updatedParticles;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      
      initializeParticles(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Start animation
  useEffect(() => {
    if (particles.length > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, dimensions]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw connections
    connections.forEach(connection => {
      ctx.beginPath();
      ctx.moveTo(connection.x1, connection.y1);
      ctx.lineTo(connection.x2, connection.y2);
      ctx.strokeStyle = `rgba(155, 135, 245, ${connection.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [particles, connections, dimensions]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(155, 135, 245, 0.4) 0%, rgba(155, 135, 245, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(30, 174, 219, 0.4) 0%, rgba(30, 174, 219, 0.1) 40%, transparent 70%)',
          filter: 'blur(40px)'
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
          filter: 'blur(30px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Neural network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(155, 135, 245, 0.3)" strokeWidth="1"/>
            </pattern>
            <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="rgba(30, 174, 219, 0.4)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Pulsing light effects */}
      <motion.div
        className="absolute top-10 left-10 w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(155, 135, 245, 0.8) 0%, transparent 70%)',
          filter: 'blur(2px)'
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-3 h-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(30, 174, 219, 0.8) 0%, transparent 70%)',
          filter: 'blur(2px)'
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)',
          filter: 'blur(1px)'
        }}
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Subtle wave animation */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(155, 135, 245, 0.1) 50%, transparent 70%)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glassmorphism overlay for better text readability */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
        }}
      />
    </div>
  );
};

export default ModernAIBackground;