import { Users, Star, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import FloatingParticles from "@/components/FloatingParticles";

const features = [
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Our team of experienced founders and mentors guide you through each stage of your startup journey."
  },
  {
    icon: Star,
    title: "Proven Framework",
    description: "Follow our battle-tested startup framework that has helped launch successful ventures."
  },
  {
    icon: Award,
    title: "Continuous Support",
    description: "Get ongoing support and feedback to refine and improve your startup idea."
  }
];

const AboutSection = () => {
  return (
    <section className="min-h-fit py-24 px-4 relative">
      {/* Background particles */}
      <FloatingParticles 
        count={12} 
        speed={0.6} 
        size={2} 
        color="rgba(99, 102, 241, 0.4)"
        className="z-0"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          About Us
        </h2>
        <div className="mb-12 text-center">
          <GlassmorphismCard intensity="light" className="max-w-3xl mx-auto p-6">
            <p className="text-lg text-white/90">
              We are dedicated to transforming innovative ideas into successful startups. Our comprehensive approach combines 
              expert guidance, proven methodologies, and cutting-edge tools to help entrepreneurs navigate their journey.
            </p>
          </GlassmorphismCard>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassmorphismCard 
              key={index} 
              intensity="medium"
              hover={true}
              glow={true}
              className="group"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </CardContent>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;