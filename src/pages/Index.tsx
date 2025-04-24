
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";
import UserJourney from "@/components/UserJourney";

const Index = () => {
  return (
    <>
      <Navbar />
      
      {/* Prompt Section - Full Viewport */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="w-full max-w-3xl">
          <PromptSection />
        </div>
      </section>
      
      {/* User Journey Section - Full Viewport */}
      <section className="min-h-screen">
        <UserJourney />
      </section>
      
      {/* Background gradient circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
      </div>
    </>
  );
};

export default Index;
