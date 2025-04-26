import React, { useState, useEffect } from "react";
import { useDiscovery } from "@/context/DiscoveryContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Results: React.FC = () => {
  const { answers, questions } = useDiscovery();
  const navigate = useNavigate();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const valueProposition = generateValueProposition(answers, questions);
  const targetAudience = generateTargetAudience(answers, questions);
  const revenueStream = generateRevenueStream(answers, questions);
  const startupName = generateStartupName(answers, questions);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
          Your Startup Discovery
        </h1>
        <p className="text-xl text-white/70">
          Here's what we've learned about your idea
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard 
          title="Value Proposition" 
          content={valueProposition} 
          delay={0.2} 
        />
        <ResultCard 
          title="Target Audience" 
          content={targetAudience} 
          delay={0.4} 
        />
        <ResultCard 
          title="Revenue Model" 
          content={revenueStream} 
          delay={0.6} 
        />
        <ResultCard 
          title="Startup Name Idea" 
          content={startupName} 
          delay={0.8} 
        />
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isAnimationComplete ? 1 : 0, y: isAnimationComplete ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
          size="lg"
        >
          Return Home <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

const ResultCard: React.FC<{title: string; content: string; delay: number}> = ({
  title,
  content,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1A1F2C]/80 to-[#1A1F2C]/30 pb-3">
          <CardTitle className="text-lg font-medium bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-white/80">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function generateValueProposition(answers: any[], questions: any[]): string {
  const problemType = answers.find(a => a.questionId === 1)?.selectedAnswer || "problem";
  
  const valueProps = {
    "Daily inconvenience": "Simplifying everyday tasks to save time and reduce stress",
    "Business inefficiency": "Optimizing business processes to increase productivity and reduce costs",
    "Social issue": "Creating meaningful connections and positive social impact",
    "Entertainment need": "Delivering engaging experiences that captivate and inspire",
    "Health challenge": "Improving wellbeing through innovative health solutions"
  };
  
  return valueProps[problemType as keyof typeof valueProps] || 
    "Delivering innovative solutions to transform how people interact with technology";
}

function generateTargetAudience(answers: any[], questions: any[]): string {
  const audience = answers.find(a => a.questionId === 2)?.selectedAnswer || "professionals";
  
  const audienceMap = {
    "Young professionals": "Career-focused individuals seeking efficiency and growth",
    "Small businesses": "Independent ventures looking to scale and optimize operations",
    "Enterprise companies": "Large organizations requiring enterprise-grade solutions",
    "Students": "Education-focused users seeking knowledge and skill development",
    "Parents": "Family-oriented customers prioritizing care and convenience"
  };
  
  return audienceMap[audience as keyof typeof audienceMap] || 
    "Technology-savvy users looking for innovative solutions";
}

function generateRevenueStream(answers: any[], questions: any[]): string {
  const model = answers.find(a => a.questionId === 3)?.selectedAnswer || "Subscription";
  
  const modelMap = {
    "Subscription": "Recurring revenue through tiered subscription plans",
    "One-time purchase": "Direct sales with potential for premium upgrades",
    "Freemium": "Free core offering with premium features for paying users",
    "Marketplace fee": "Transaction fees from facilitating exchanges between users",
    "Advertising": "Revenue generated through targeted advertising opportunities"
  };
  
  return modelMap[model as keyof typeof modelMap] || 
    "Multi-channel approach combining direct and indirect revenue streams";
}

function generateStartupName(answers: any[], questions: any[]): string {
  const problem = answers.find(a => a.questionId === 1)?.selectedAnswer || "";
  const audience = answers.find(a => a.questionId === 2)?.selectedAnswer || "";
  
  const nameOptions = {
    "Daily inconvenience": ["EaseFlow", "SimpliDay", "RoutineGo", "DailyZen"],
    "Business inefficiency": ["OptiCore", "FlowSync", "ProdMatrix", "EfficiWare"],
    "Social issue": ["ImpactHub", "CommUnity", "SocialSphere", "ConnectForward"],
    "Entertainment need": ["JoyWave", "PlayPulse", "FunFusion", "VibeVerse"],
    "Health challenge": ["VitalSync", "WellNova", "HealthPulse", "MindBody"]
  };
  
  const names = nameOptions[problem as keyof typeof nameOptions] || 
    ["NexGen", "InnoVision", "FusionTech", "PulseWare"];
  
  return names[Math.floor(Math.random() * names.length)];
}

export default Results;
