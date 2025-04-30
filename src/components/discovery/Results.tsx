
import React, { useState, useEffect } from "react";
import { useDiscovery } from "@/context/DiscoveryContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundShapes from "./BackgroundShapes";
import ResultsHeader from "./ResultsHeader";
import ResultCard from "./ResultCard";
import {
  generateValueProposition,
  generateTargetAudience,
  generateRevenueStream,
  generateStartupName,
} from "@/utils/resultGenerators";

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
      <BackgroundShapes />

      <motion.div
        className="max-w-3xl w-full mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResultsHeader />

        <div className="space-y-6">
          <ResultCard
            title="Startup Name Idea"
            content={startupName}
            delay={0.2}
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
            Launch my idea <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-white/40 mt-4 text-sm">
            You can refine these insights as you continue building your startup
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Results;
