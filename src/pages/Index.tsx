
import React from "react";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import PricingSection from "@/components/PricingSection";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Navbar />
      <div className="relative min-h-screen">
        {/* Hero Section with Integrated Services */}
        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center px-4 pt-24 pb-32">
            <div className="text-center mb-8">
              <Logo size="large" />
              <h1 className="text-4xl font-bold mt-8 mb-4 md:text-5xl">
                Idea to startup in seconds.
              </h1>
              <p className="text-xl md:text-2xl text-white/80">
                Your AI Co-Founder for Strategic Business Growth
              </p>
            </div>
            
            <div className="w-full max-w-3xl">
              <PromptSection />
            </div>
          </div>

          {/* Integrated Services Section with Gradient Overlay */}
          <div className="relative" id="services">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
            <ServicesSection />
          </div>
        </div>

        {/* Background gradient circles */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
        </div>
      </div>
      
      <div id="about">
        <AboutSection />
      </div>
      
      <div id="pricing">
        <PricingSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
