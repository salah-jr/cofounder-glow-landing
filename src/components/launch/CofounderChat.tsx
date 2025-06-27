import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, File, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Markdown from "@/components/ui/markdown";

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "cofounder";
  isInsight?: boolean;
  files?: FileAttachment[];
  timestamp: Date;
  isError?: boolean;
}

interface ProjectData {
  id: string
  idea: string
  created_at: string
  questions: Array<{
    question_text: string
    options: string[]
    selected_answer: string
  }>
  suggestions: Array<{
    name: string
    value: string
  }>
}

interface CofounderChatProps {
  className?: string;
  currentPhaseId?: string;
  currentStepId?: string;
  phaseNumber?: number;
  stepNumber?: number;
  projectData?: ProjectData | null;
  onReset?: () => void;
}

export interface CofounderChatRef {
  resetChat: () => void;
}

// Typing indicator component
const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="mb-6 px-2"
    >
      <div className="py-2">
        <span className="text-sm font-medium text-purple-400">
          Co-founder
        </span>
      </div>
      
      <div className="max-w-3xl">
        <div className="py-2 px-1 text-white/90">
          <div className="flex items-center gap-2">
            <span className="text-white/80">Thinking</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1.5 h-1.5 bg-white/60 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CofounderChat = forwardRef<CofounderChatRef, CofounderChatProps>(({ 
  className, 
  currentPhaseId: propCurrentPhaseId = "shape",
  currentStepId: propCurrentStepId = "shape-1",
  phaseNumber: propPhaseNumber = 1,
  stepNumber: propStepNumber = 1,
  projectData = null,
  onReset 
}, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { session } = useAuth();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTypingIndicator]);

  // Check if error is related to OpenAI quota - improved detection
  const isOpenAIQuotaError = (errorMessage: string): boolean => {
    const lowerMessage = errorMessage.toLowerCase();
    return lowerMessage.includes('quota') || 
           lowerMessage.includes('billing') ||
           lowerMessage.includes('exceeded your current quota') ||
           lowerMessage.includes('insufficient_quota') ||
           lowerMessage.includes('rate_limit_exceeded') ||
           lowerMessage.includes('quota_exceeded');
  };

  // Get fallback responses based on phase and step
  const getFallbackResponse = (phaseId: string, stepId: string, isInitial: boolean = false): string => {
    const fallbackResponses = {
      'shape': {
        'shape-1': {
          initial: "Welcome to the Shape phase! I'm here to help you define and refine your startup idea. Let's start by exploring what problem you're trying to solve and who your target customers might be. What's the core challenge or pain point that sparked your business idea?",
          response: "I'd love to help you think through this step of shaping your idea. Could you tell me more about the specific aspect you're working on? For example, are you focusing on your target market, value proposition, or business model?"
        },
        'shape-2': {
          initial: "Great! Now let's dive deeper into understanding your target market. Who are the people that would benefit most from your solution? Let's explore their demographics, behaviors, and specific needs.",
          response: "Understanding your target market is crucial. Can you share more details about who you think would be most interested in your solution?"
        }
      },
      'build': {
        'build-1': {
          initial: "Welcome to the Build phase! Now it's time to start creating your minimum viable product (MVP). Let's focus on the core features that will validate your concept with real users.",
          response: "Building your MVP is an exciting step! What specific aspect of development would you like to discuss?"
        }
      },
      'launch': {
        'launch-1': {
          initial: "Welcome to the Launch phase! You're ready to introduce your product to the world. Let's create a strategic launch plan that maximizes your chances of success.",
          response: "Launching is both exciting and challenging! What part of your launch strategy would you like to focus on?"
        }
      }
    };

    const phaseResponses = fallbackResponses[phaseId as keyof typeof fallbackResponses];
    if (phaseResponses) {
      const stepResponses = phaseResponses[stepId as keyof typeof phaseResponses];
      if (stepResponses) {
        return isInitial ? stepResponses.initial : stepResponses.response;
      }
    }

    // Generic fallback
    return isInitial 
      ? "I'm here to help guide you through this step of your startup journey. What would you like to work on today?"
      : "I'm here to help! Could you tell me more about what you'd like to focus on in this step?";
  };

  // Function to call the LLM Edge Function
  const callLLMFunction = async (userMessage: string, conversationHistory: Message[], phaseId: string, stepId: string, pNum: number, sNum: number) => {
    try {
      if (!session) {
        throw new Error("Authentication required");
      }

      console.log('Calling LLM function with message:', userMessage);
      console.log('Current phase:', phaseId, 'Current step:', stepId);

      // Prepare conversation history for the LLM
      const llmHistory = conversationHistory
        .filter(msg => msg.sender !== "cofounder" || !msg.isInsight) // Exclude insight messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }));

      const requestPayload = {
        message: userMessage,
        conversationHistory: llmHistory,
        currentPhaseId: phaseId,
        currentStepId: stepId,
        phaseNumber: pNum,
        stepNumber: sNum,
        projectData: projectData // Include project data for context
      };

      console.log('Request payload:', requestPayload);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/llm-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('Error response data:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`Service temporarily unavailable (${response.status})`);
        }
        
        // Check for quota error in the response
        const errorMessage = errorData.error || `Service temporarily unavailable (${response.status})`;
        if (isOpenAIQuotaError(errorMessage)) {
          throw new Error("QUOTA_EXCEEDED: " + errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response data:', data);
      
      if (!data.success) {
        const errorMessage = data.error || 'Service temporarily unavailable';
        if (isOpenAIQuotaError(errorMessage)) {
          throw new Error("QUOTA_EXCEEDED: " + errorMessage);
        }
        throw new Error(errorMessage);
      }

      return data.response;
    } catch (error: any) {
      console.error('Error calling LLM function:', error);
      
      // Re-throw with proper quota detection
      if (error.message.startsWith("QUOTA_EXCEEDED:") || isOpenAIQuotaError(error.message)) {
        throw new Error("QUOTA_EXCEEDED: " + error.message.replace("QUOTA_EXCEEDED: ", ""));
      }
      
      throw error;
    }
  };

  // Function to fetch initial AI message for a step
  const fetchInitialAIMessage = async (phaseId: string, stepId: string, pNum: number, sNum: number, currentSession: any) => {
    setError(null);
    setIsQuotaExceeded(false);

    try {
      if (!currentSession) {
        // Set a simple welcome message without authentication requirement
        const welcomeMessage = projectData 
          ? `Welcome back! I see you're working on "${projectData.idea}". ${getFallbackResponse(phaseId, stepId, true)}`
          : getFallbackResponse(phaseId, stepId, true);
          
        setMessages([{
          id: Date.now().toString(),
          text: welcomeMessage,
          sender: "cofounder",
          timestamp: new Date()
        }]);
        return;
      }

      // Show typing indicator
      setShowTypingIndicator(true);

      // Call LLM with initial step prompt
      const initialMessage = projectData 
        ? `This is a returning user working on their project: "${projectData.idea}". Please provide an introductory message for this step and any relevant questions to help them continue their work. Format your response in markdown.`
        : "Please provide an introductory message for this step and any relevant questions to help the user get started. Format your response in markdown.";
        
      const aiResponse = await callLLMFunction(initialMessage, [], phaseId, stepId, pNum, sNum);
      
      // Hide typing indicator
      setShowTypingIndicator(false);
      
      const cofounderMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: "cofounder",
        timestamp: new Date()
      };
      
      setMessages([cofounderMessage]);
      
    } catch (error: any) {
      console.error('Error fetching initial AI message:', error);
      
      // Hide typing indicator
      setShowTypingIndicator(false);
      
      // Check if it's a quota error
      if (error.message.startsWith("QUOTA_EXCEEDED:") || isOpenAIQuotaError(error.message)) {
        setIsQuotaExceeded(true);
        const quotaMessage = `I'm currently experiencing high demand due to API limitations. Don't worry though - I can still help guide you through this step! ${getFallbackResponse(phaseId, stepId, true)}`;
        
        const fallbackMessageObj: Message = {
          id: Date.now().toString(),
          text: quotaMessage,
          sender: "cofounder",
          timestamp: new Date(),
          isError: true
        };
        
        setMessages([fallbackMessageObj]);
      } else {
        // Show user-friendly message for other errors
        const fallbackMessage = `I'm currently experiencing some technical difficulties, but I'm still here to help! ${getFallbackResponse(phaseId, stepId, true)}`;
        
        const fallbackMessageObj: Message = {
          id: Date.now().toString(),
          text: fallbackMessage,
          sender: "cofounder",
          timestamp: new Date()
        };
        
        setMessages([fallbackMessageObj]);
      }
    }
  };
  
  // Update initial message when phase/step changes and fetch initial AI message
  useEffect(() => {
    console.log('Phase/step changed, fetching initial AI message...');
    fetchInitialAIMessage(propCurrentPhaseId, propCurrentStepId, propPhaseNumber, propStepNumber, session);
  }, [propCurrentPhaseId, propCurrentStepId, propPhaseNumber, propStepNumber, session, projectData]);
  
  // Function to reset the chat
  const resetChat = () => {
    console.log("resetChat function called in CofounderChat");
    
    // Clear all states immediately
    setInput("");
    setAttachedFiles([]);
    setError(null);
    setIsProcessing(false);
    setIsQuotaExceeded(false);
    setShowTypingIndicator(false);
    
    // Fetch fresh initial message from LLM
    fetchInitialAIMessage(propCurrentPhaseId, propCurrentStepId, propPhaseNumber, propStepNumber, session);
    
    // Call the onReset callback if provided
    if (onReset) onReset();
    
    // Force scroll to bottom after reset
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    resetChat
  }));

  const handleSendMessage = async () => {
    if (input.trim() === "" && attachedFiles.length === 0) return;
    if (isProcessing) return; // Prevent sending while processing
    
    // Clear any previous errors
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      timestamp: new Date()
    };
    
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachedFiles([]);
    
    // Set processing state and show typing indicator
    setIsProcessing(true);
    setShowTypingIndicator(true);
    
    try {
      // Call the LLM Edge Function with current props
      const aiResponse = await callLLMFunction(
        currentInput, 
        messages, 
        propCurrentPhaseId, 
        propCurrentStepId, 
        propPhaseNumber, 
        propStepNumber
      );
      
      // Hide typing indicator
      setShowTypingIndicator(false);
      
      const cofounderMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "cofounder",
        isInsight: Math.random() > 0.8, // 20% chance to be an insight
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, cofounderMessage]);
      
      // Reset quota exceeded state on successful response
      if (isQuotaExceeded) {
        setIsQuotaExceeded(false);
      }
      
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      // Hide typing indicator
      setShowTypingIndicator(false);
      
      let fallbackMessage: string;
      let isErrorMessage = false;
      
      // Check if it's a quota error
      if (error.message.startsWith("QUOTA_EXCEEDED:") || isOpenAIQuotaError(error.message)) {
        setIsQuotaExceeded(true);
        fallbackMessage = `I'm currently experiencing high demand due to API limitations, but I can still help guide you! ${getFallbackResponse(propCurrentPhaseId, propCurrentStepId, false)} Feel free to share your thoughts and I'll do my best to provide guidance based on this step's objectives.`;
        isErrorMessage = true;
      } else {
        // Show user-friendly message for other errors
        fallbackMessage = `I'm experiencing some technical difficulties right now, but I'm still here to help! ${getFallbackResponse(propCurrentPhaseId, propCurrentStepId, false)}`;
      }
      
      const fallbackMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackMessage,
        sender: "cofounder",
        timestamp: new Date(),
        isError: isErrorMessage
      };
      
      setMessages(prev => [...prev, fallbackMessageObj]);
    } finally {
      // Always clear processing state
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow shift+enter for new line without sending
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: FileAttachment[] = Array.from(files).map(file => {
        const id = Math.random().toString(36).substring(2, 9);
        const fileObj: FileAttachment = {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setAttachedFiles(prev => 
              prev.map(f => f.id === id ? { ...f, preview: reader.result as string } : f)
            );
          };
          reader.readAsDataURL(file);
        }
        
        return fileObj;
      });
      
      setAttachedFiles(prev => [...prev, ...newFiles]);
      
      // Clear the input to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Render file attachments
  const renderFileAttachments = () => {
    if (attachedFiles.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 px-4 mb-3 max-h-32 overflow-y-auto scrollbar-hide">
        {attachedFiles.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center bg-white/10 backdrop-blur-sm rounded-md pr-2 overflow-hidden group"
          >
            {file.preview ? (
              <div className="h-10 w-10 relative mr-2">
                <AspectRatio ratio={1/1} className="bg-muted">
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="object-cover h-full w-full" 
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="h-10 w-10 bg-white/5 flex items-center justify-center mr-2">
                <File className="h-5 w-5 text-white/70" />
              </div>
            )}
            <div className="mr-2">
              <p className="text-xs font-medium text-white/90 truncate max-w-[100px]">{file.name}</p>
              <p className="text-[10px] text-white/60">{formatFileSize(file.size)}</p>
            </div>
            <Button
              variant="ghost" 
              size="icon"
              className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => removeAttachment(file.id)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Render attached files in a message
  const renderMessageFiles = (messageFiles?: FileAttachment[]) => {
    if (!messageFiles || messageFiles.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {messageFiles.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center bg-white/5 rounded-md overflow-hidden max-w-[200px]"
          >
            {file.preview ? (
              <div className="h-16 w-16 relative">
                <AspectRatio ratio={1/1} className="bg-muted">
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="object-cover h-full w-full" 
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="h-10 w-10 bg-white/5 flex items-center justify-center">
                <File className="h-5 w-5 text-white/70" />
              </div>
            )}
            <div className="p-2">
              <p className="text-xs font-medium text-white/90 truncate max-w-[120px]">{file.name}</p>
              <p className="text-[10px] text-white/60">{formatFileSize(file.size)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/images/cofounder-avatar.svg" alt="Co-founder" />
            <AvatarFallback className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]">CF</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-white">Co-founder</h3>
            <span className="text-xs text-white/60">Phase {propPhaseNumber}, Step {propStepNumber}</span>
          </div>
          <div className="ml-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#1EAEDB] to-[#9b87f5]" />
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetChat}
          className="text-xs text-white/50 hover:text-white"
          disabled={isProcessing}
        >
          Reset Chat
        </Button>
      </div>

      {/* Quota exceeded warning */}
      {isQuotaExceeded && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-amber-200 text-sm">
            <p className="font-medium">AI Assistant Limited</p>
            <p className="text-xs text-amber-300/80 mt-1">
              I'm experiencing high demand right now, but I can still provide guidance based on this step's framework and best practices.
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                className={cn(
                  "mb-6 px-2",
                  message.sender === "user" ? "text-right" : "text-left"
                )}
              >
                <div className="py-2">
                  <span className={cn(
                    "text-sm font-medium",
                    message.sender === "user" ? "text-blue-400" : "text-purple-400"
                  )}>
                    {message.sender === "user" ? "You" : "Co-founder"}
                    {message.isError && (
                      <span className="ml-2 text-xs text-amber-400">(Limited Mode)</span>
                    )}
                  </span>
                </div>
                
                <div className={cn(
                  "max-w-3xl",
                  message.sender === "user" ? "ml-auto" : ""
                )}>
                  <div className={cn(
                    "py-2 px-1",
                    "text-white",
                    message.isError && "text-white/90"
                  )}>
                    {message.text && message.sender === "user" ? (
                      <p>{message.text}</p>
                    ) : message.text ? (
                      <Markdown content={message.text} />
                    ) : null}
                    {renderMessageFiles(message.files)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {showTypingIndicator && (
              <TypingIndicator />
            )}
            
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <Separator className="bg-white/10 my-4" />
      
      {/* Show attached files */}
      {renderFileAttachments()}
      
      <div className="pt-0">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isQuotaExceeded ? "I can still help guide you through this step..." : "Ask your co-founder anything..."}
            disabled={isProcessing}
            className="w-full px-4 py-3 min-h-[48px] max-h-24 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#9b87f5] resize-none transition-all duration-200 focus:border-[#9b87f5]/60 scrollbar-hide disabled:opacity-50"
            style={{ 
              overflowY: "auto", 
              msOverflowStyle: "none", 
              scrollbarWidth: "none"
            }}
          />
          <style>
            {`
              textarea::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <div className="flex items-center">
              {attachedFiles.length > 0 && (
                <span className="mr-2 text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                  {attachedFiles.length}
                </span>
              )}
              <Button
                onClick={handleFileAttachment}
                variant="ghost"
                size="icon"
                disabled={isProcessing}
                className="h-8 w-8 rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <Paperclip size={18} className="text-white/70" />
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={(!input.trim() && attachedFiles.length === 0) || isProcessing}
              className={cn(
                "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white p-2 rounded-md transition-all duration-300",
                ((!input.trim() && attachedFiles.length === 0) || isProcessing) ? "opacity-50" : "hover:opacity-90"
              )}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Display name for better debugging
CofounderChat.displayName = "CofounderChat";

export default CofounderChat;