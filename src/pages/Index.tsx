import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import Footer from "@/components/Footer";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Full-page hero background with new theme */}
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
      
      {/* Hero Content Section - Smaller and more compact */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center mb-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500/80" />
            <span className="text-xs text-white/60 tracking-wide">
              AI Co-Founder
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              Your startup, from idea to launch,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              in hours.
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-white/70 mb-4 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
            Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool.
          </p>
        </div>
        
        <div className="w-full max-w-2xl">
          <GlassmorphismCard 
            intensity="medium" 
            glow={true}
            className="p-3 sm:p-4"
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