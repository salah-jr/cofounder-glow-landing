
import React from "react";
import { Question as QuestionType } from "@/context/DiscoveryContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuestionProps {
  question: QuestionType;
  onSelectAnswer: (answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onSelectAnswer }) => {
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
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
              className="w-full py-6 text-lg border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Question;
