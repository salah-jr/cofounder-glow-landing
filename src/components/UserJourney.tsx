
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    title: "Ideation",
    description: "Share your startup vision and let AI guide your journey"
  },
  {
    title: "Analysis",
    description: "Get detailed market insights and competitive analysis"
  },
  {
    title: "Strategy",
    description: "Develop a clear roadmap and business strategy"
  },
  {
    title: "Validation",
    description: "Test assumptions and validate your market fit"
  },
  {
    title: "Planning",
    description: "Create detailed execution plans and milestones"
  },
  {
    title: "Launch",
    description: "Transform your idea into a successful startup"
  }
];

const UserJourney = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animation variants for containers
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for each step
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Animation variants for hover effect
  const hoverVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0 0 0 rgba(155, 135, 245, 0)" 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 0 20px rgba(155, 135, 245, 0.3)" 
    }
  };

  // Animation variants for the connecting arrows
  const arrowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // Animation variants for the step number badge
  const badgeVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: 10 }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent"
        >
          Your Journey to Success
        </motion.h2>
        
        <motion.div 
          className="relative flex flex-col md:flex-row items-center justify-between gap-8 mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                variants={stepVariants}
                transition={{ duration: 0.6 }}
                className="relative flex-1 glass p-6 rounded-xl"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={hoveredIndex === index ? "hover" : "initial"}
                initial="initial"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full w-6 h-6 flex items-center justify-center text-sm text-white"
                  variants={badgeVariants}
                  animate={hoveredIndex === index ? "hover" : "initial"}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>

                <motion.div
                  variants={hoverVariants}
                  animate={hoveredIndex === index ? "hover" : "initial"}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <motion.h3 
                    className="text-xl font-semibold mb-2 mt-2 text-white"
                    animate={hoveredIndex === index ? { scale: 1.05, color: '#9b87f5' } : { scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-white/80 text-sm"
                    animate={hoveredIndex === index ? { opacity: 1 } : { opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </motion.div>
              
              {index < steps.length - 1 && (
                <motion.div 
                  variants={arrowVariants}
                  className="hidden md:block flex-shrink-0"
                  animate={{ 
                    x: [0, 5, 0], 
                    opacity: hoveredIndex === index || hoveredIndex === index + 1 ? 1 : 0.6 
                  }}
                  transition={{ 
                    x: { repeat: Infinity, duration: 1.5 },
                    opacity: { duration: 0.3 }
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-[#9b87f5]" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div 
          className="w-full h-1 mt-16 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          style={{ 
            background: "linear-gradient(90deg, rgba(155,135,245,1) 0%, rgba(30,174,219,1) 100%)",
            transformOrigin: "left"
          }}
        />
      </div>
    </section>
  );
};

export default UserJourney;
