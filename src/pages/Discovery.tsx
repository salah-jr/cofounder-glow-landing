import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnswerCard from "@/components/discovery/AnswerCard";
import { useAuth } from "@/context/AuthContext";
import { LoaderIcon } from "lucide-react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

interface Question {
  question: string;
  options: string[];
}

interface QuestionWithAnswer extends Question {
  selected_answer: string;
}

interface Suggestions {
  startup_name: string;
  value_proposition: string;
  target_audience: string;
  revenue_stream: string;
}

interface Suggestion {
  name: string;
  value: string;
}

type DiscoveryStep = 'answering_questions' | 'loading_suggestions' | 'editing_suggestions' | 'error';

const Discovery = () => {
  const [userIdea, setUserIdea] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<DiscoveryStep>('answering_questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionWithAnswer[]>([]);
  const [editableSuggestions, setEditableSuggestions] = useState<Suggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { user, session } = useAuth();

  // Get user idea and questions from sessionStorage on mount
  useEffect(() => {
    const storedIdea = sessionStorage.getItem('userIdea');
    const storedQuestions = sessionStorage.getItem('generatedQuestions');
    
    if (!storedIdea) {
      // No idea found, redirect to home
      navigate('/');
      return;
    }
    
    setUserIdea(storedIdea);
    
    if (storedQuestions) {
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        setQuestions(parsedQuestions);
        setCurrentStep('answering_questions');
        // Clear the stored questions
        sessionStorage.removeItem('generatedQuestions');
      } catch (error) {
        console.error('Error parsing stored questions:', error);
        generateQuestions(storedIdea);
      }
    } else {
      generateQuestions(storedIdea);
    }
  }, [navigate]);

  const generateQuestions = async (idea: string) => {
    try {
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_idea: idea }),
      });

      let data;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Invalid response format from server');
        }
      } else {
        // Try to get error message from response
        let errorMessage = 'Failed to generate questions';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setQuestions(data.questions);
      setCurrentStep('answering_questions');
      setCurrentQuestionIndex(0);
    } catch (error: any) {
      console.error('Error generating questions:', error);
      setError("We're currently experiencing high demand. Please try again shortly.");
      setCurrentStep('error');
    }
  };

  const handleAnswerQuestion = (answer: string, questionIndex: number) => {
    // Prevent multiple submissions for the same question
    if (selectedAnswers.has(questionIndex)) {
      return;
    }

    setSelectedAnswers(prev => new Set([...prev, questionIndex]));

    const currentQuestion = questions[currentQuestionIndex];
    const questionWithAnswer: QuestionWithAnswer = {
      ...currentQuestion,
      selected_answer: answer
    };

    const newAnswers = [...answers, questionWithAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, generate suggestions
      generateSuggestions(newAnswers);
    }
  };

  const generateSuggestions = async (questionsWithAnswers: QuestionWithAnswer[]) => {
    try {
      setCurrentStep('loading_suggestions');
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_idea: userIdea,
          questions: questionsWithAnswers
        }),
      });

      let data;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Invalid response format from server');
        }
      } else {
        // Try to get error message from response
        let errorMessage = 'Failed to generate suggestions';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      setEditableSuggestions(data.suggestions);
      setCurrentStep('editing_suggestions');
    } catch (error: any) {
      console.error('Error generating suggestions:', error);
      setError("We're currently experiencing high demand. Please try again shortly.");
      setCurrentStep('error');
    }
  };

  const handleSuggestionChange = (field: keyof Suggestions, value: string) => {
    if (editableSuggestions) {
      setEditableSuggestions({
        ...editableSuggestions,
        [field]: value
      });
    }
  };

  const saveProject = async () => {
    if (!user || !editableSuggestions) {
      console.log("Login required to save project");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const suggestionsArray: Suggestion[] = [
        { name: 'startup_name', value: editableSuggestions.startup_name },
        { name: 'value_proposition', value: editableSuggestions.value_proposition },
        { name: 'target_audience', value: editableSuggestions.target_audience },
        { name: 'revenue_stream', value: editableSuggestions.revenue_stream },
      ];

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          idea: userIdea,
          questions: answers,
          suggestions: suggestionsArray
        }),
      });

      let data;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Invalid response format from server');
        }
      } else {
        // Try to get error message from response
        let errorMessage = 'Failed to save project';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to save project');
      }

      console.log("Project saved successfully!");

      // Clear sessionStorage
      sessionStorage.removeItem('userIdea');

      // Navigate to launch path with the new project
      navigate("/launch-path", { state: { projectId: data.project_id } });
    } catch (error: any) {
      console.error('Error saving project:', error);
      setError("Failed to save project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetFlow = () => {
    sessionStorage.removeItem('userIdea');
    sessionStorage.removeItem('generatedQuestions');
    navigate('/');
  };

  // Calculate progress percentage
  const progress = currentStep === 'answering_questions' ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const renderContent = () => {
    switch (currentStep) {
      case 'answering_questions':
        if (questions.length === 0) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
                <p className="text-white/80">Generating personalized questions...</p>
              </div>
            </div>
          );
        }

        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="min-h-screen flex flex-col">
            {/* Fixed container for the entire question flow */}
            <div className="flex-1 flex flex-col justify-center px-4">
              {/* Selected answers section - positioned above question with increased margin */}
              {answers.length > 0 && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3
                    className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent"
                  >
                    Business Building Blocks
                  </motion.h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <AnimatePresence>
                      {answers.map((answer, index) => (
                        <motion.div 
                          key={index}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 24, 
                            delay: index * 0.1 
                          }}
                        >
                          <AnswerCard 
                            answer={answer.selected_answer} 
                            index={index}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Question section - positioned directly below answers with minimal spacing */}
              <motion.div
                key={currentQuestionIndex}
                className="w-full max-w-3xl mx-auto relative z-10 p-6 md:p-8 glass rounded-2xl shadow-[0_8px_16px_rgba(155,135,245,0.1)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{
                  // Maintain consistent position regardless of answers
                  minHeight: '400px'
                }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {currentQuestion.question}
                </h2>
                
                <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <button
                        onClick={() => handleAnswerQuestion(option, currentQuestionIndex)}
                        disabled={selectedAnswers.has(currentQuestionIndex)}
                        className="w-full py-4 md:py-6 text-base md:text-lg border-white/10 bg-[#1A1F2C]/80 hover:text-white hover:bg-[rgba(155,135,245,0.2)] hover:border-[#9b87f5]/30 backdrop-blur-sm transition-all duration-300 ease-out rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {option}
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'loading_suggestions':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
              <p className="text-white/80">Creating your startup building blocks...</p>
            </div>
          </div>
        );

      case 'editing_suggestions':
        return (
          <div className="min-h-screen flex items-center justify-center pb-24">
            <motion.div
              className="w-full max-w-4xl mx-auto relative z-10 p-8 glass rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
                  Your Startup Building Blocks
                </h2>
                <p className="text-white/70">
                  Review and edit these suggestions before saving
                </p>
              </div>

              {editableSuggestions && (
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#9b87f5]">
                      Startup Name
                    </label>
                    <input
                      type="text"
                      value={editableSuggestions.startup_name}
                      onChange={(e) => handleSuggestionChange('startup_name', e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-medium focus:outline-none focus:border-[#9b87f5]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#9b87f5]">
                      Value Proposition
                    </label>
                    <textarea
                      value={editableSuggestions.value_proposition}
                      onChange={(e) => handleSuggestionChange('value_proposition', e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-medium resize-none focus:outline-none focus:border-[#9b87f5]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#9b87f5]">
                      Target Audience
                    </label>
                    <textarea
                      value={editableSuggestions.target_audience}
                      onChange={(e) => handleSuggestionChange('target_audience', e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-medium resize-none focus:outline-none focus:border-[#9b87f5]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#9b87f5]">
                      Revenue Stream
                    </label>
                    <textarea
                      value={editableSuggestions.revenue_stream}
                      onChange={(e) => handleSuggestionChange('revenue_stream', e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-medium resize-none focus:outline-none focus:border-[#9b87f5]/50"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetFlow}
                  disabled={isSaving}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Over
                </button>
                <button
                  onClick={saveProject}
                  disabled={!user || isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <LoaderIcon className="w-4 h-4 animate-spin" />}
                  {user ? (isSaving ? 'Saving...' : 'Save & Continue') : 'Login to Save'}
                </button>
              </div>
            </motion.div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onClick={resetFlow}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full-page background matching home page */}
      <div className="fixed inset-0 -z-10">
        <HeroGeometric
          badge=""
          title1=""
          title2=""
          subtitle=""
          fullPage={true}
          backgroundOnly={true}
        />
      </div>
      
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      {renderContent()}
    </div>
  );
};

export default Discovery;