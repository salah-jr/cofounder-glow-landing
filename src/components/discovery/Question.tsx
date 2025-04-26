
import React from "react";
import { Question as QuestionType } from "@/context/DiscoveryContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface QuestionProps {
  question: QuestionType;
  onSelectAnswer: (answer: string) => void;
  progress: number;
}

const Question: React.FC<QuestionProps> = ({ question, onSelectAnswer, progress }) => {
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-white/5" />
        <p className="text-white/60 text-sm mt-2">Question {Math.ceil(progress / 20)} of 5</p>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {question.text}
      </h2>
      
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Button
              onClick={() => onSelectAnswer(option)}
              variant="outline"
              className="w-full py-6 text-lg border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-[#9b87f5]/20 hover:to-[#1EAEDB]/20 hover:border-[#9b87f5]/30 backdrop-blur-sm transition-all duration-300 ease-out"
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Background decorative elements */}
      <motion.div
        className="absolute -z-10 w-[600px] h-[600px] bg-[#9b87f5]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  );
};

export default Question;
