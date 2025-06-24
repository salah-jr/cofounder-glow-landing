import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import Footer from "@/components/Footer";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Full-page hero background */}
      <div className="fixed inset-0 -z-10">
        <HeroGeometric
          badge="AI Co-Founder"
          title1=""
          title2=""
          subtitle=""
          fullPage={true}
          backgroundOnly={true}
        />
      </div>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Content Section - Optimized for viewport */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <div className="h-2 w-2 rounded-full bg-[#9b87f5]/80" />
            <span className="text-sm text-white/60 tracking-wide">
              AI Co-Founder
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              Your startup, from idea to launch,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#3b82f6] to-[#1EAEDB]">
              in hours.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
            Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool.
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          <GlassmorphismCard 
            intensity="medium" 
            glow={true}
            className="p-4 sm:p-6"
          >
            <PromptSection />
          </GlassmorphismCard>
        </div>
      </section>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;