
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import ServicesSection from "@/components/ServicesSection";

const Index = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="text-center mb-16">
          <Logo size="large" />
          <h2 className="mt-6 text-xl md:text-2xl text-white/80 animate-fade-in">
            Your AI Co-Founder for Startup Success
          </h2>
        </div>
        
        <div className="w-full max-w-3xl">
          <PromptSection />
        </div>

        {/* Background gradient circles */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
        </div>
      </div>
      
      <ServicesSection />
    </>
  );
};

export default Index;
