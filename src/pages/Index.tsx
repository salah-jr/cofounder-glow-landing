import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import Footer from "@/components/Footer";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Full-page hero background that extends to cover entire page */}
      <HeroGeometric
        badge="AI Co-Founder"
        title1="Your startup, from idea to launch,"
        title2="in hours."
        subtitle="Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool."
        fullPage={true}
      >
        {/* Navbar positioned over the hero */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        
        {/* Main content area */}
        <div className="relative z-10 pt-24">
          <GlassmorphismCard 
            intensity="medium" 
            glow={true}
            className="p-6"
          >
            <PromptSection />
          </GlassmorphismCard>
        </div>
        
        {/* Footer positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <Footer />
        </div>
      </HeroGeometric>
    </div>
  );
};

export default Index;