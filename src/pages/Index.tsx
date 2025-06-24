import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import Footer from "@/components/Footer";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      
      <div className="relative z-10">
        {/* New Hero Section with Geometric Shapes */}
        <HeroGeometric
          badge="AI Co-Founder"
          title1="Your startup, from idea to launch,"
          title2="in hours."
          subtitle="Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool."
        >
          <GlassmorphismCard 
            intensity="medium" 
            glow={true}
            className="p-6"
          >
            <PromptSection />
          </GlassmorphismCard>
        </HeroGeometric>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;