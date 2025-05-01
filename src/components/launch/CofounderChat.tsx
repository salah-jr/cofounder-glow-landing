
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lightbulb, MessageSquare, ThumbsUp, SparklesIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAnimatedPlaceholder } from "@/hooks/useAnimatedPlaceholder";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "cofounder";
  quickReplies?: string[];
  isInsight?: boolean;
}

interface CofounderChatProps {
  className?: string;
}

export default function CofounderChat({ className }: CofounderChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your Co-founder AI assistant. I'm here to help you refine your startup idea. What's the core problem your product solves?",
      sender: "cofounder",
      quickReplies: ["Customer pain point", "Market gap", "Efficiency problem", "Cost issue"]
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<"neutral" | "thinking" | "excited">("neutral");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animatedPlaceholder = useAnimatedPlaceholder();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message with send animation
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setCurrentMood("thinking");
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const responseMessages = [
        "That's interesting! How have you validated this problem with potential customers?",
        "Tell me more about your target audience for this solution.",
        "What makes your approach unique compared to existing solutions?",
        "How do you envision monetizing this solution?",
        "What resources do you need to bring this idea to life?"
      ];
      
      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
      const isInsight = Math.random() > 0.7; // 30% chance to be an insight
      
      const cofounderMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "cofounder",
        quickReplies: ["Still researching", "Already validated", "Need guidance", "Let me explain"],
        isInsight
      };
      
      setCurrentMood(isInsight ? "excited" : "neutral");
      setMessages(prev => [...prev, cofounderMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleQuickReply = (reply: string) => {
    setInput(reply);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const addToCanvas = (messageId: string) => {
    console.log(`Adding message ${messageId} to canvas`);
    // Future implementation: Add message to canvas
  };

  const handleReaction = (messageId: string, reaction: string) => {
    console.log(`Reaction ${reaction} on message ${messageId}`);
    // Future implementation: Save reaction
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center pb-4 border-b border-white/10">
        <div className="relative">
          <Avatar className="h-10 w-10 mr-3 bg-gradient-to-br from-indigo-500 to-purple-600">
            <AvatarFallback>C</AvatarFallback>
            <AvatarImage src="/images/cofounder-avatar.svg" alt="Co-founder" />
          </Avatar>
          {currentMood === "thinking" && (
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
          {currentMood === "excited" && (
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Co-founder</h3>
            <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 text-xs py-0">AI</Badge>
          </div>
          <p className="text-sm text-white/60">Your startup companion</p>
        </div>
      </div>
      
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
                  "flex mb-6",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "cofounder" && (
                  <Avatar className="h-8 w-8 mt-1 mr-2 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600">
                    <AvatarFallback>C</AvatarFallback>
                    <AvatarImage src="/images/cofounder-avatar.svg" alt="Co-founder" />
                  </Avatar>
                )}
                
                <div className="max-w-[75%]">
                  <motion.div 
                    className={cn(
                      "p-3 rounded-lg",
                      message.sender === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none" 
                        : message.isInsight 
                          ? "glass border border-amber-500/20 text-white rounded-bl-none shadow-[0_0_15px_rgba(251,191,36,0.15)]" 
                          : "glass text-white rounded-bl-none"
                    )}
                    animate={message.isInsight ? { boxShadow: ["0 0 15px rgba(251,191,36,0.1)", "0 0 20px rgba(251,191,36,0.2)", "0 0 15px rgba(251,191,36,0.1)"] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <p>{message.text}</p>
                  </motion.div>

                  {/* Message actions - only show for AI messages */}
                  {message.sender === "cofounder" && (
                    <div className="flex gap-1 mt-1 justify-start">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/10"
                              onClick={() => handleReaction(message.id, "thumbsup")}
                            >
                              <ThumbsUp size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Like this insight</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/10"
                              onClick={() => addToCanvas(message.id)}
                            >
                              <SparklesIcon size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add to Canvas</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  
                  {message.quickReplies && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.quickReplies.map((reply) => (
                        <Button 
                          key={reply}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="bg-white/5 hover:bg-white/10 hover:border-[#9b87f5]/60 transition-all duration-200 border border-white/10 text-white/80 hover:text-white hover:scale-105"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 mt-1 ml-2 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
                    <AvatarFallback>U</AvatarFallback>
                    <AvatarImage src="/images/user-avatar.svg" alt="User" />
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {/* Typing indicator - only visible when isTyping is true */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center ml-10"
              >
                <div className="glass p-2 px-4 rounded-full flex items-center gap-1">
                  <div className="flex space-x-1 items-center">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-white/60" 
                      animate={{ y: ["0px", "-5px", "0px"] }} 
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-white/60" 
                      animate={{ y: ["0px", "-5px", "0px"] }} 
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-white/60" 
                      animate={{ y: ["0px", "-5px", "0px"] }} 
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-white/60">Co-founder is thinking...</span>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <Separator className="bg-white/10 my-4" />
      
      <div className="pt-0">
        {/* Command suggestions */}
        <div className="flex flex-wrap gap-2 mb-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white/5 border border-white/10 text-white/70"
                  onClick={() => setInput("/validate ")}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  /validate
                </Button>
              </TooltipTrigger>
              <TooltipContent>Validate your business idea</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-white/5 border border-white/10 text-white/70"
                  onClick={() => setInput("/insight ")}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  /insight
                </Button>
              </TooltipTrigger>
              <TooltipContent>Get market insights</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      
        <div className="relative">
          <motion.input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={animatedPlaceholder || "Ask your co-founder anything..."}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#9b87f5] transition-all duration-200 focus:border-[#9b87f5]/60"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(155, 135, 245, 0.2)" }}
            onClick={() => inputRef.current?.focus()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white p-2 rounded-md transition-all duration-300",
              !input.trim() ? "opacity-50" : "hover:opacity-90 hover:shadow-[0_0_15px_rgba(155,135,245,0.3)]"
            )}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
