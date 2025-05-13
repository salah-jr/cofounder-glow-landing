
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import Question from "@/components/discovery/Question";
import AnswerCard from "@/components/discovery/AnswerCard";
import Results from "@/components/discovery/Results";
import Navbar from "@/components/Navbar";

const Discovery = () => {
  const { currentQuestionIndex, answers, questions, isComplete, selectAnswer } = useDiscovery();
  const [showResults, setShowResults] = useState(false);
  const [mergeAnimation, setMergeAnimation] = useState(false);

  // Calculate progress percentage
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Trigger results animation after all questions are answered
  useEffect(() => {
    if (isComplete && !showResults) {
      setMergeAnimation(true);
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    }
  }, [isComplete, showResults]);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <Results />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 relative overflow-hidden bg-[#1A1F2C]">
      <Navbar />
      
      {/* Background shapes */}
      <motion.div
        className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-[#9b87f5]/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-[#1EAEDB]/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Answer cards section with smoother animations */}
      {answers.length > 0 && (
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3
            className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent"
          >
            Business Building Blocks
          </motion.h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {answers.map((answer, index) => (
                <motion.div 
                  key={answer.questionId}
                  layout
                  animate={mergeAnimation ? { 
                    scale: 0,
                    opacity: 0,
                  } : {}}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1 
                  }}
                >
                  <AnswerCard 
                    answer={answer.selectedAnswer} 
                    index={index}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Current question */}
      {!isComplete && (
        <div className="flex-1 flex items-center justify-center pb-24">
          <AnimatePresence mode="wait">
            <Question
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              onSelectAnswer={selectAnswer}
              progress={progress}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Discovery;
