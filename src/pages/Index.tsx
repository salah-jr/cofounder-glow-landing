
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import PromptSection from "@/components/PromptSection";

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
        
        {/* About Us Section */}
        <section id="about" className="min-h-screen w-full flex items-center justify-center py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent mb-8">
              About Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-white/80">
                  We're dedicated to empowering entrepreneurs with AI-driven insights
                  and guidance, making the journey of building a startup more
                  accessible and successful than ever before.
                </p>
              </div>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Why Choose Us</h3>
                <p className="text-white/80">
                  Our AI co-founder combines years of startup experience with
                  cutting-edge technology to provide personalized advice and
                  strategic direction for your business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="min-h-screen w-full flex items-center justify-center py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent mb-8">
              Pricing Plans
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
                <div className="text-3xl font-bold text-white mb-4">$0</div>
                <ul className="text-white/80 space-y-2 mb-6">
                  <li>• Basic AI assistance</li>
                  <li>• 5 conversations/month</li>
                  <li>• Community access</li>
                </ul>
                <button className="w-full py-2 px-4 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
                  Get Started
                </button>
              </div>
              <div className="glass p-6 rounded-xl relative border border-[#9b87f5]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] px-4 py-1 rounded-full text-sm">
                  Popular
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                <div className="text-3xl font-bold text-white mb-4">$29</div>
                <ul className="text-white/80 space-y-2 mb-6">
                  <li>• Advanced AI insights</li>
                  <li>• Unlimited conversations</li>
                  <li>• Priority support</li>
                  <li>• Custom training</li>
                </ul>
                <button className="w-full py-2 px-4 rounded bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white hover:opacity-90 transition-opacity">
                  Start Pro
                </button>
              </div>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-white mb-4">Custom</div>
                <ul className="text-white/80 space-y-2 mb-6">
                  <li>• Custom AI solutions</li>
                  <li>• Dedicated support</li>
                  <li>• Team collaboration</li>
                  <li>• API access</li>
                </ul>
                <button className="w-full py-2 px-4 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Background gradient circles */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
        </div>
      </div>
    </>
  );
};

export default Index;
