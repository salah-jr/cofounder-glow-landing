
import React, { useState, useEffect } from "react";
import { useDiscovery } from "@/context/DiscoveryContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#1A1F2C]">
      {/* Background shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#9b87f5]/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#1EAEDB]/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="max-w-3xl w-full mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.div
            className="inline-block p-3 rounded-full bg-[#9b87f5]/10 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Star className="w-6 h-6 text-[#9b87f5]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
            Discovery Results
          </h1>
          <p className="text-white/60">
            Here's what we've learned about your startup vision
          </p>
        </div>

        <div className="space-y-6">
          <ResultCard
            title="Startup Name Idea"
            content={startupName}
            delay={0.2}
            mainCard
          />
          <ResultCard
            title="Value Proposition"
            content={valueProposition}
            delay={0.3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard
              title="Target Audience"
              content={targetAudience}
              delay={0.4}
            />
            <ResultCard
              title="Revenue Stream"
              content={revenueStream}
              delay={0.5}
            />
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity px-8 py-6 text-lg"
          >
            Explore Your Startup Vision <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-white/40 mt-4 text-sm">
            You can refine these insights as you continue building your startup
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ResultCard: React.FC<{
  title: string;
  content: string;
  delay: number;
  mainCard?: boolean;
}> = ({ title, content, delay, mainCard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        className={cn(
          "border-0 backdrop-blur-xl",
          mainCard
            ? "bg-gradient-to-r from-[#9b87f5]/10 to-[#1EAEDB]/10"
            : "bg-white/5"
        )}
      >
        <CardContent className="p-6">
          <h3 className="text-[#9b87f5] mb-2 font-medium">{title}</h3>
          <p className="text-white text-xl font-medium">{content}</p>
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
