
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Smile, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "cofounder";
  quickReplies?: string[];
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
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
      
      const cofounderMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "cofounder",
        quickReplies: ["Still researching", "Already validated", "Need guidance", "Let me explain"]
      };
      
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

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center pb-4 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/5 to-[#1EAEDB]/5 backdrop-blur-sm -z-10"></div>
        <Avatar className="h-10 w-10 mr-3 bg-gradient-to-br from-[#9b87f5] to-[#1EAEDB] shadow-lg shadow-[#9b87f5]/20">
          <AvatarFallback><Smile className="text-white" size={18} /></AvatarFallback>
          <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=250&h=250&fit=crop" alt="Co-founder" />
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-white">Co-founder</h3>
          <p className="text-sm text-white/60">Your startup companion</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex mb-6",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "cofounder" && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-shrink-0 mr-3"
                  >
                    <Avatar className="h-8 w-8 mt-1 bg-gradient-to-br from-[#9b87f5] to-[#1EAEDB] ring-2 ring-[#9b87f5]/20">
                      <AvatarFallback><Smile className="text-white" size={14} /></AvatarFallback>
                      <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=250&h=250&fit=crop" alt="Co-founder" />
                    </Avatar>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn("max-w-[75%]")}
                >
                  <div className={cn(
                    "p-3 rounded-lg shadow-lg",
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white" 
                      : "glass backdrop-blur-md border border-white/10 text-white"
                  )}>
                    <p>{message.text}</p>
                  </div>
                  
                  {message.quickReplies && (
                    <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, staggerChildren: 0.1 }}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {message.quickReplies.map((reply, index) => (
                        <motion.div
                          key={reply}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {reply}
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
                
                {message.sender === "user" && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-shrink-0 ml-3"
                  >
                    <Avatar className="h-8 w-8 mt-1 bg-gradient-to-br from-[#1EAEDB] to-[#9b87f5] ring-2 ring-[#1EAEDB]/20">
                      <AvatarFallback><UserRound className="text-white" size={14} /></AvatarFallback>
                      <AvatarImage src="https://images.unsplash.com/photo-1501286353178-1ec881214838?w=250&h=250&fit=crop" alt="User" />
                    </Avatar>
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center ml-12 text-white/60 text-sm"
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="ml-2">Co-founder is typing...</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <Separator className="bg-white/10" />
      
      <div className="pt-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#9b87f5] transition-all shadow-inner"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white p-2 rounded-md hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#9b87f5]/20"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
