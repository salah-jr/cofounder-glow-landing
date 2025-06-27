import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

interface NeuralNetworkPatternProps {
  nodeCount?: number;
  connectionDistance?: number;
  animationSpeed?: number;
  opacity?: number;
  className?: string;
}

const NeuralNetworkPattern: React.FC<NeuralNetworkPatternProps> = ({
  nodeCount = 30,
  connectionDistance = 150,
  animationSpeed = 0.5,
  opacity = 0.4,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize nodes
  const initializeNodes = (width: number, height: number) => {
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        connections: []
      });
    }
    
    nodesRef.current = nodes;
  };

  // Calculate connections between nodes
  const updateConnections = () => {
    const nodes = nodesRef.current;
    
    nodes.forEach((node, i) => {
      node.connections = [];
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            node.connections.push(j);
          }
        }
      });
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dimensions;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update node positions
    nodesRef.current.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off edges
      if (node.x <= 0 || node.x >= width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y <= 0 || node.y >= height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }
    });
    
    // Update connections
    updateConnections();
    
    // Draw connections
    ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    
    nodesRef.current.forEach((node, i) => {
      node.connections.forEach(connectionIndex => {
        const connectedNode = nodesRef.current[connectionIndex];
        const dx = node.x - connectedNode.x;
        const dy = node.y - connectedNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const connectionOpacity = (1 - distance / connectionDistance) * opacity * 0.5;
        
        ctx.strokeStyle = `rgba(155, 135, 245, ${connectionOpacity})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connectedNode.x, connectedNode.y);
        ctx.stroke();
      });
    });
    
    // Draw nodes
    nodesRef.current.forEach(node => {
      const nodeOpacity = opacity * 0.8;
      
      // Node glow
      ctx.shadowColor = `rgba(155, 135, 245, ${nodeOpacity})`;
      ctx.shadowBlur = 10;
      
      // Node core
      ctx.fillStyle = `rgba(155, 135, 245, ${nodeOpacity})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Node pulse effect
      ctx.fillStyle = `rgba(30, 174, 219, ${nodeOpacity * 0.3})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4 + Math.sin(Date.now() * 0.005 + node.x * 0.01) * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      canvas.width = width;
      canvas.height = height;
      
      setDimensions({ width, height });
      initializeNodes(width, height);
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
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default NeuralNetworkPattern;