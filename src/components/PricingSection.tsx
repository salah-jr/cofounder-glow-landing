import { CircleIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GlassmorphismCard from "@/components/GlassmorphismCard";

const plans = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for early-stage startups",
    features: [
      "Basic idea validation",
      "Market research tools",
      "Email support",
      "Basic analytics"
    ],
    icon: CircleIcon
  },
  {
    name: "Pro",
    price: "$299",
    description: "For serious entrepreneurs",
    features: [
      "Advanced idea validation",
      "Comprehensive market analysis",
      "Priority support",
      "Full analytics suite"
    ],
    icon: DollarSignIcon
  }
];

const PricingSection = () => {
  return (
    <section className="min-h-screen py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <GlassmorphismCard 
              key={index} 
              intensity="medium"
              hover={true}
              glow={index === 1} // Highlight the Pro plan
              className="group"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{plan.price}</div>
                <p className="text-white/80">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-white/80">
                      <span className="w-2 h-2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </CardContent>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;