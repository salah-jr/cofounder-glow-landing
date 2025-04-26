
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import Question from "@/components/discovery/Question";
import AnswerCard from "@/components/discovery/AnswerCard";
import Results from "@/components/discovery/Results";

const Discovery = () => {
  const { currentQuestionIndex, answers, questions, isComplete, selectAnswer } = useDiscovery();
  const [showResults, setShowResults] = useState(false);
  const [mergeAnimation, setMergeAnimation] = useState(false);

  // Trigger results animation after all questions are answered
  useEffect(() => {
    if (isComplete && !showResults) {
      setMergeAnimation(true);
      setTimeout(() => {
        setShowResults(true);
      }, 2000); // Show results after the merge animation plays
    }
  }, [isComplete, showResults]);

  if (showResults) {
    return <Results />;
  }

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      {/* Answer cards at the top */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        <AnimatePresence>
          {answers.map((answer, index) => (
            <motion.div 
              key={answer.questionId}
              layout
              animate={mergeAnimation ? { 
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 200,
                scale: mergeAnimation ? 0 : 1,
                opacity: mergeAnimation ? 0 : 1
              } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 30, delay: index * 0.1 }}
            >
              <AnswerCard 
                answer={answer.selectedAnswer} 
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Central merge animation when all questions are answered */}
      {mergeAnimation && (
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" 
               style={{ filter: "blur(15px)" }} 
          />
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
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Discovery;
