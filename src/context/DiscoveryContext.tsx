import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the question and answer types
export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface Answer {
  questionId: number;
  selectedAnswer: string;
}

export interface Suggestion {
  name: string;
  value: string;
}

type DiscoveryContextType = {
  currentQuestionIndex: number;
  answers: Answer[];
  questions: Question[];
  suggestions: Suggestion[];
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  userIdea: string;
  setUserIdea: (idea: string) => void;
  setQuestions: (questions: Question[]) => void;
  selectAnswer: (questionId: number, answer: string) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  resetDiscovery: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIdea, setUserIdea] = useState("");

  const selectAnswer = (questionId: number, answer: string) => {
    // Check if answer already exists for this question
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = { questionId, selectedAnswer: answer };
      setAnswers(updatedAnswers);
    } else {
      // Add new answer
      setAnswers(prev => [...prev, { questionId, selectedAnswer: answer }]);
    }
    
    // Move to next question if not already at the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered
      setIsComplete(true);
    }
  };
  
  const resetDiscovery = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuestions([]);
    setSuggestions([]);
    setIsComplete(false);
    setIsLoading(false);
    setError(null);
    setUserIdea("");
  };

  return (
    <DiscoveryContext.Provider value={{
      currentQuestionIndex,
      answers,
      questions,
      suggestions,
      isComplete,
      isLoading,
      error,
      userIdea,
      setUserIdea,
      setQuestions,
      selectAnswer,
      setSuggestions,
      resetDiscovery,
      setIsLoading,
      setError
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