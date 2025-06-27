import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { SendIcon, LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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

export function IdeaInputForm() {
    const [value, setValue] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 120,
        maxHeight: 120,
    });
    const navigate = useNavigate();
    const { session } = useAuth();

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
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ user_idea: userIdea }),
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

            // Store questions in sessionStorage and navigate
            sessionStorage.setItem('generatedQuestions', JSON.stringify(data.questions));
            navigate('/discovery');
        } catch (error: any) {
            console.error('Error generating questions:', error);
            // Still navigate to discovery page, it will handle the error
            navigate('/discovery');
        }
    };

    const handleSendMessage = async () => {
        if (value.trim() && !isSubmitting) {
            setIsSubmitting(true);
            // Store the idea in sessionStorage
            sessionStorage.setItem('userIdea', value.trim());
            // Generate questions and navigate
            await generateQuestions(value.trim());
            setIsSubmitting(false);
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
                        className="relative backdrop-blur-xl bg-[#101010] rounded-2xl border border-white/[0.06] shadow-xl"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="p-4">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholderText}
                                disabled={isSubmitting}
                                className={cn(
                                    "w-full px-4 py-3",
                                    "resize-none overflow-y-auto",
                                    "bg-transparent",
                                    "border-none",
                                    "text-white/90 text-sm",
                                    "focus:outline-none",
                                    "placeholder:text-white/40",
                                    "min-h-[120px]",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                                style={{
                                    overflow: "auto",
                                }}
                            />
                        </div>

                        <div className="p-4 border-t border-white/[0.05] flex items-center justify-end gap-4">
                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!value.trim() || isSubmitting}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    "flex items-center gap-2",
                                    "bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-500/20",
                                    (!value.trim() || isSubmitting) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? (
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <SendIcon className="w-4 h-4" />
                                )}
                                <span>{isSubmitting ? "Shaping..." : "Shape My Idea"}</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default IdeaInputForm;