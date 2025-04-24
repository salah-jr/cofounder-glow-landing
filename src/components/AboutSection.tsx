import { Users, Star, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="min-h-fit py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          About Us
        </h2>
        <div className="mb-12 text-center">
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We are dedicated to transforming innovative ideas into successful startups. Our comprehensive approach combines 
            expert guidance, proven methodologies, and cutting-edge tools to help entrepreneurs navigate their journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass border-none hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] p-3 rounded-lg mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
