import { LightbulbIcon, SearchCheck, Users, FileCode, Rocket, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Idea Refinement Phase",
    goal: "Clarify what the startup is about and who it's for.",
    icon: LightbulbIcon,
  },
  {
    title: "Idea Validation Phase",
    goal: "Test whether people care about the problem and solution.",
    icon: SearchCheck,
  },
  {
    title: "Market & Positioning Phase",
    goal: "Understand the market, segment users, and define the startup's positioning.",
    icon: Users,
  },
  {
    title: "MVP Planning Phase",
    goal: "Define what to build first to test the idea technically.",
    icon: FileCode,
  },
  {
    title: "Launch & Feedback Phase",
    goal: "Get the MVP in front of real people and learn from it.",
    icon: Rocket,
  },
  {
    title: "Investor & Pitch Phase",
    goal: "Tell the story and pitch clearly.",
    icon: Briefcase,
  },
];

const ServicesSection = () => {
  return (
    <section className="min-h-fit py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="glass border-none hover:scale-105 transition-transform duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] p-3 rounded-lg">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{service.goal}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
