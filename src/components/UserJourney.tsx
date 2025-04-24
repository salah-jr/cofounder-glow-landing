
import React from 'react';
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
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
          Your Journey to Success
        </h2>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 mt-10">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex-1 glass p-6 rounded-xl"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full w-6 h-6 flex items-center justify-center text-sm text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-2 text-white">
                  {step.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {step.description}
                </p>
              </motion.div>
              
              {index < steps.length - 1 && (
                <ChevronRight className="hidden md:block w-6 h-6 text-[#9b87f5] flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserJourney;
