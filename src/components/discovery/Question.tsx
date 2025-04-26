
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
      className="w-full max-w-3xl mx-auto relative z-10 p-8 glass rounded-2xl shadow-[0_8px_32px_rgba(155,135,245,0.15)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {question.text}
      </h2>
      
      <div className="flex flex-col gap-3 max-w-2xl mx-auto">
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
              className="w-full py-6 text-lg border-white/10 bg-[#1A1F2C]/80 hover:bg-[rgba(155,135,245,0.2)] hover:border-[#9b87f5]/30 backdrop-blur-sm transition-all duration-300 ease-out"
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Progress bar moved below answers */}
      <div className="mt-8">
        <Progress value={progress} className="h-1 bg-white/5" indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" />
        <p className="text-white/60 text-sm mt-2">Question {Math.ceil(progress / 20)} of 5</p>
      </div>
    </motion.div>
  );
};

export default Question;
