
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the question and answer types
export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface AnswerCard {
  questionId: number;
  selectedAnswer: string;
}

// Sample questions for the discovery phase
const discoveryQuestions: Question[] = [
  {
    id: 1,
    text: "What problem is your startup solving?",
    options: ["Daily inconvenience", "Business inefficiency", "Social issue", "Entertainment need", "Health challenge"]
  },
  {
    id: 2,
    text: "Who is your primary target audience?",
    options: ["Young professionals", "Small businesses", "Enterprise companies", "Students", "Parents"]
  },
  {
    id: 3,
    text: "What is your preferred revenue model?",
    options: ["Subscription", "One-time purchase", "Freemium", "Marketplace fee", "Advertising"]
  },
  {
    id: 4,
    text: "What's your startup's top priority right now?",
    options: ["Product development", "Customer acquisition", "Fundraising", "Team building", "Market research"]
  },
  {
    id: 5,
    text: "What's your timeline for launching?",
    options: ["1-3 months", "4-6 months", "7-12 months", "Already launched", "Not sure yet"]
  }
];

type DiscoveryContextType = {
  currentQuestionIndex: number;
  answers: AnswerCard[];
  questions: Question[];
  isComplete: boolean;
  selectAnswer: (answer: string) => void;
  resetDiscovery: () => void;
};

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerCard[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const selectAnswer = (answer: string) => {
    const currentQuestion = discoveryQuestions[currentQuestionIndex];
    
    // Add this answer to our list
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selectedAnswer: answer
    }]);
    
    if (currentQuestionIndex < discoveryQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Discovery process is complete
      setIsComplete(true);
    }
  };
  
  const resetDiscovery = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsComplete(false);
  };

  return (
    <DiscoveryContext.Provider value={{
      currentQuestionIndex,
      answers,
      questions: discoveryQuestions,
      isComplete,
      selectAnswer,
      resetDiscovery
    }}>
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
};
