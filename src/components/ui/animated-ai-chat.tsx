import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface Question {
    question: string;
    options: string[];
}

interface QuestionWithAnswer extends Question {
    selected_answer: string;
}

interface Suggestion {
    name: string;
    value: string;
}

interface Suggestions {
    startup_name: string;
    value_proposition: string;
    target_audience: string;
    revenue_stream: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [placeholderText, setPlaceholderText] = useState("");
    const [isTypingPlaceholder, setIsTypingPlaceholder] = useState(true);
    
    // Discovery flow states
    const [currentStep, setCurrentStep] = useState<'input' | 'questions' | 'suggestions' | 'editing' | 'saving'>('input');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuestionWithAnswer[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
    const [editableSuggestions, setEditableSuggestions] = useState<Suggestions | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 120,
        maxHeight: 120,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const navigate = useNavigate();
    const { user, session } = useAuth();
    const { toast } = useToast();

    const businessIdeas = [
        "launch a logistics delivery SaaS",
        "build an expense tracker for startups",
        "launch a smart grocery assistant",
        "offer a career coaching portal",
        "launch an event planning SaaS",
        "build AI-personalized meal subscriptions",
        "start last-mile delivery for small businesses",
        "launch a furniture rental platform"
    ];

    useEffect(() => {
        let currentIdeaIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        const baseText = "My idea is to ";

        const typeText = () => {
            const currentIdea = businessIdeas[currentIdeaIndex];
            
            if (!isDeleting) {
                if (currentCharIndex <= currentIdea.length) {
                    setPlaceholderText(baseText + currentIdea.substring(0, currentCharIndex));
                    currentCharIndex++;
                    setTimeout(typeText, 50);
                } else {
                    setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, 1000);
                }
            } else {
                if (currentCharIndex > 0) {
                    setPlaceholderText(baseText + currentIdea.substring(0, currentCharIndex - 1));
                    currentCharIndex--;
                    setTimeout(typeText, 30);
                } else {
                    isDeleting = false;
                    currentIdeaIndex = (currentIdeaIndex + 1) % businessIdeas.length;
                    setTimeout(typeText, 100);
                }
            }
        };

        typeText();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const generateQuestions = async (userIdea: string) => {
        try {
            setIsTyping(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ user_idea: userIdea }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate questions');
            }

            setQuestions(data.questions);
            setCurrentStep('questions');
            setCurrentQuestionIndex(0);
        } catch (error: any) {
            console.error('Error generating questions:', error);
            setError("We're currently experiencing high demand. Please try again shortly.");
        } finally {
            setIsTyping(false);
        }
    };

    const generateSuggestions = async () => {
        try {
            setIsTyping(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    user_idea: value,
                    questions: answers
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate suggestions');
            }

            setSuggestions(data.suggestions);
            setEditableSuggestions(data.suggestions);
            setCurrentStep('suggestions');
        } catch (error: any) {
            console.error('Error generating suggestions:', error);
            setError("We're currently experiencing high demand. Please try again shortly.");
        } finally {
            setIsTyping(false);
        }
    };

    const saveProject = async () => {
        if (!user || !editableSuggestions) return;

        try {
            setCurrentStep('saving');
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
                    idea: value,
                    questions: answers,
                    suggestions: suggestionsArray
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to save project');
            }

            toast({
                title: "Project Saved!",
                description: "Your startup idea has been saved successfully.",
            });

            // Navigate to launch path with the new project
            navigate("/launch-path");
        } catch (error: any) {
            console.error('Error saving project:', error);
            setError("Failed to save project. Please try again.");
            setCurrentStep('editing');
        }
    };

    const handleSendMessage = async () => {
        if (currentStep === 'input' && value.trim()) {
            await generateQuestions(value.trim());
        }
    };

    const handleAnswerQuestion = (answer: string) => {
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
            generateSuggestions();
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

    const resetFlow = () => {
        setValue("");
        setCurrentStep('input');
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setSuggestions(null);
        setEditableSuggestions(null);
        setError(null);
    };

    // Render different steps
    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center p-6">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={resetFlow}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        switch (currentStep) {
            case 'input':
                return (
                    <div className="p-4 space-y-6 w-full">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            placeholder={placeholderText}
                            containerClassName="w-full"
                            className={cn(
                                "w-full px-4 py-3",
                                "resize-none overflow-y-auto",
                                "bg-transparent",
                                "border-none",
                                "text-white/90 text-sm",
                                "focus:outline-none",
                                "placeholder:text-white/40",
                                "min-h-[120px]"
                            )}
                            showRing={false}
                        />

                        <div className="flex items-center justify-end">
                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!value.trim() || isTyping}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    "flex items-center gap-2",
                                    "bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-500/20",
                                    (!value.trim() || isTyping) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isTyping ? (
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <SendIcon className="w-4 h-4" />
                                )}
                                <span>Shape My Idea</span>
                            </motion.button>
                        </div>
                    </div>
                );

            case 'questions':
                const currentQuestion = questions[currentQuestionIndex];
                const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

                return (
                    <div className="p-6 space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </h3>
                            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <h4 className="text-xl font-medium text-white mb-6">
                                {currentQuestion.question}
                            </h4>
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerQuestion(option)}
                                        className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 text-white"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'suggestions':
            case 'editing':
                return (
                    <div className="p-6 space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Your Startup Building Blocks
                            </h3>
                            <p className="text-white/70 text-sm">
                                Review and edit these suggestions before saving
                            </p>
                        </div>

                        {editableSuggestions && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Startup Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editableSuggestions.startup_name}
                                        onChange={(e) => handleSuggestionChange('startup_name', e.target.value)}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Value Proposition
                                    </label>
                                    <textarea
                                        value={editableSuggestions.value_proposition}
                                        onChange={(e) => handleSuggestionChange('value_proposition', e.target.value)}
                                        rows={3}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Target Audience
                                    </label>
                                    <textarea
                                        value={editableSuggestions.target_audience}
                                        onChange={(e) => handleSuggestionChange('target_audience', e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Revenue Stream
                                    </label>
                                    <textarea
                                        value={editableSuggestions.revenue_stream}
                                        onChange={(e) => handleSuggestionChange('revenue_stream', e.target.value)}
                                        rows={2}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={resetFlow}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white transition-all duration-200"
                            >
                                Start Over
                            </button>
                            <button
                                onClick={() => {
                                    if (user) {
                                        saveProject();
                                    } else {
                                        toast({
                                            title: "Login Required",
                                            description: "Please log in to save your project.",
                                            variant: "destructive"
                                        });
                                    }
                                }}
                                disabled={!user}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {user ? 'Save & Continue' : 'Login to Save'}
                            </button>
                        </div>
                    </div>
                );

            case 'saving':
                return (
                    <div className="p-6 text-center">
                        <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
                        <p className="text-white/80">Saving your project...</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-transparent text-white relative overflow-hidden">
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div 
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div 
                        className="relative backdrop-blur-xl bg-[#101010] rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {renderContent()}
                    </motion.div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isTyping && (
                    <motion.div 
                        className="fixed bottom-8 mx-auto transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-4 py-2 shadow-lg border border-white/[0.05]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
                                <span className="text-xs font-medium text-white/90 mb-0.5">AI</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <span>Thinking</span>
                                <TypingDots />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}

export default AnimatedAIChat;