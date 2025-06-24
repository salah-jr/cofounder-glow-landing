import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import ModernAIBackground from "@/components/ModernAIBackground";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import FloatingParticles from "@/components/FloatingParticles";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Modern AI Background */}
      <ModernAIBackground />
      
      {/* Floating particles overlay */}
      <FloatingParticles 
        count={15} 
        speed={0.8} 
        size={3} 
        color="rgba(30, 174, 219, 0.4)"
        className="z-0"
      />
      
      <Navbar />
      
      <div className="relative z-10">
        {/* Hero Section with Enhanced Glassmorphism */}
        <div className="flex flex-col items-center justify-center px-4 pt-24 pb-32">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mt-8 mb-4 md:text-5xl text-white drop-shadow-lg">
              Your startup, from idea to launch, in hours.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              Co-founder is your AI business partner. From idea → to pitch deck → to MVP. All in one tool.
            </p>
          </div>
          
          <div className="w-full max-w-3xl">
            <GlassmorphismCard 
              intensity="medium" 
              glow={true}
              className="p-6"
            >
              <PromptSection />
            </GlassmorphismCard>
          </div>
        </div>

        {/* Enhanced Services Section */}
        <div className="relative" id="services">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
          <FloatingParticles 
            count={8} 
            speed={1.2} 
            size={2} 
            color="rgba(155, 135, 245, 0.3)"
            className="z-0"
          />
          <ServicesSection />
        </div>
      </div>
      
      <div id="about" className="relative z-10">
        <AboutSection />
      </div>
      
      <div id="pricing" className="relative z-10">
        <PricingSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;