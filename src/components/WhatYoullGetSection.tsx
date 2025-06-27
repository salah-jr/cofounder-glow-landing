import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, HelpCircle, Blocks, Layers, Rocket, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

const deliverables = [
  {
    icon: Lightbulb,
    title: "Start With Your Idea",
    description: "Drop your raw idea in one sentence."
  },
  {
    icon: HelpCircle,
    title: "Answer Smart Questions",
    description: "5 beginner-friendly prompts that sharpen your thinking."
  },
  {
    icon: Blocks,
    title: "Get Your Building Blocks",
    description: "Instantly receive a name, value prop, revenue stream & audience."
  },
  {
    icon: Layers,
    title: "Build in 5 Startup Phases",
    description: "Go step-by-step through shaping, validating & planning."
  },
  {
    icon: Rocket,
    title: "Launch With Confidence",
    description: "Leave with real startup assets, ready to test or pitch."
  },
  {
    icon: RefreshCw,
    title: "Learn & Iterate",
    description: "Now that you're live, take control, tweak and optimize based on real-world traction."
  }
];

const WhatYoullGetSection = () => {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/8 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-rose-500/8 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.7, 0.4, 0.7],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title with Animated Text */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 1
          }}
        >
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-medium text-white/60 mb-4 tracking-wide uppercase">
              Build Step by Step. Leave With Real Results.
            </h2>
            <AnimatedText
              text="The Assets Every Founder Needs, Built by You."
              textClassName="text-[2.5rem] md:text-[2.5rem] lg:text-[2.5rem] font-bold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent leading-tight"
              underlineClassName="text-rose-400"
              underlinePath="M 0,10 Q 150,0 300,10 Q 450,20 600,10"
              underlineHoverPath="M 0,10 Q 150,20 300,10 Q 450,0 600,10"
              underlineDuration={2}
            />
          </div>
          <p className="text-xl md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mt-8">
            Co-founder guides you through a simple, 5-phase startup journey — and helps you produce real business tools you can use to launch, test, or pitch.
          </p>
        </motion.div>

        {/* Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {deliverables.map((deliverable, index) => {
            const IconComponent = deliverable.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
              >
                <Card className="group h-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.04] hover:border-white/20">
                  <CardContent className="p-6 lg:p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-rose-500/10 border border-white/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500">
                        <IconComponent className="w-7 h-7 lg:w-8 lg:h-8 text-white/90 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg lg:text-xl font-bold mb-4 text-white group-hover:text-white transition-colors leading-tight">
                      {deliverable.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 leading-relaxed flex-grow group-hover:text-white/85 transition-colors text-sm lg:text-base">
                      {deliverable.description}
                    </p>

                    {/* Bottom accent with gradient */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            delay: 0.8,
            ease: [0.25, 0.4, 0.25, 1]
          }}
        >
          <p className="text-white/60 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Every asset is built collaboratively with you, ensuring they reflect your vision and are ready for real-world use.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatYoullGetSection;