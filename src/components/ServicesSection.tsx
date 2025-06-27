import { LightbulbIcon, SearchCheck, Users, FileText, Presentation, BriefcaseIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassmorphismCard from "@/components/GlassmorphismCard";

const services = [
  {
    title: "Business Idea Refinement",
    goal: "Define your startup vision, mission and unique value proposition.",
    icon: LightbulbIcon,
  },
  {
    title: "Market Validation",
    goal: "Verify your business idea with data-driven market research and competitor analysis.",
    icon: SearchCheck,
  },
  {
    title: "Target Audience Analysis",
    goal: "Define your ideal customer profiles and market segmentation strategy.",
    icon: Users,
  },
  {
    title: "Business Plan Creation",
    goal: "Develop comprehensive business plans with financial projections and growth strategies.",
    icon: FileText,
  },
  {
    title: "Pitch Deck Development",
    goal: "Create compelling investor presentations that highlight your startup's potential.",
    icon: Presentation,
  },
  {
    title: "Funding Strategy",
    goal: "Explore funding options from bootstrapping to venture capital and develop the right approach.",
    icon: BriefcaseIcon,
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 px-4 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <GlassmorphismCard 
              key={index} 
              intensity="medium"
              hover={true}
              className="group transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{service.goal}</p>
              </CardContent>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;