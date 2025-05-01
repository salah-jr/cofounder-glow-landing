
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
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
      <div className="flex items-center pb-4 border-b border-white/10">
        <Avatar className="h-10 w-10 mr-3 bg-gradient-to-br from-indigo-500 to-purple-600">
          <AvatarFallback>C</AvatarFallback>
          <AvatarImage src="/images/cofounder-avatar.svg" alt="Co-founder" />
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
                  <Avatar className="h-8 w-8 mt-1 mr-2 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600">
                    <AvatarFallback>C</AvatarFallback>
                    <AvatarImage src="/images/cofounder-avatar.svg" alt="Co-founder" />
                  </Avatar>
                )}
                
                <div className="max-w-[75%]">
                  <div className={cn(
                    "p-3 rounded-lg",
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                      : "glass text-white"
                  )}>
                    <p>{message.text}</p>
                  </div>
                  
                  {message.quickReplies && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.quickReplies.map((reply) => (
                        <Button 
                          key={reply}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white"
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
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-white/60 text-sm ml-10"
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
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white p-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
