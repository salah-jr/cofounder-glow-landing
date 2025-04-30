import React, { useState, useEffect, useRef } from "react";
import { SendIcon, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: 'cofounder' | 'user';
  content: string;
  timestamp: number;
}

interface CofounderChatProps {
  phaseIndex: number;
  stepIndex: number;
  onOutputGenerated: (output: any) => void;
}

export const CofounderChat = ({ phaseIndex, stepIndex, onOutputGenerated }: CofounderChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Generate a new conversation when the phase or step changes
  useEffect(() => {
    const initialMessage = getInitialMessage(phaseIndex, stepIndex);
    
    setMessages([{
      id: `system-${Date.now()}`,
      sender: 'cofounder',
      content: initialMessage,
      timestamp: Date.now()
    }]);
    
    // Optional: Add suggested quick replies based on the current step
    setIsTyping(false);
  }, [phaseIndex, stepIndex]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const getInitialMessage = (phaseIndex: number, stepIndex: number) => {
    const initialMessages = [
      // Phase 0: Idea Refinement
      [
        "Let's define the core problem your startup will solve. What pain point have you identified?",
        "Now that we understand the problem, let's craft your value proposition. What unique solution do you offer?",
        "Let's create a profile of your ideal customer. Who will benefit most from your solution?",
        "Time to sketch your initial business model. How will your solution generate revenue?"
      ],
      // Phase 1: Validation
      [
        "Let's create a script for customer interviews. What key questions do you need answers to?",
        "Let's design concept mockups to visualize your solution. What are the key features to highlight?",
        "Time to gather feedback. How will you approach potential customers for insights?",
        "Let's analyze your competition. Who are the key players in your market?"
      ],
      // Other phases...
      ["Default question for Phase 2"],
      ["Default question for Phase 3"],
      ["Default question for Phase 4"]
    ];

    return initialMessages[phaseIndex]?.[stepIndex] || 
      "Let's work on the next step of your startup journey. What questions do you have?";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(userMessage.content, phaseIndex, stepIndex);
      
      setMessages(prev => [...prev, {
        id: `cofounder-${Date.now()}`,
        sender: 'cofounder',
        content: response,
        timestamp: Date.now()
      }]);
      
      setIsTyping(false);
      
      // Generate output for the canvas
      if (stepIndex === 2 && phaseIndex === 0) {
        // For the "Create Ideal Customer Card" step
        onOutputGenerated({
          type: 'customerCard',
          title: 'Ideal Customer Profile',
          content: {
            name: 'Alex Thompson',
            age: '28-45',
            role: 'Product Manager',
            painPoints: ['Time management', 'Team coordination', 'Resource allocation'],
            goals: ['Improve efficiency', 'Reduce costs', 'Accelerate delivery']
          },
          timestamp: Date.now()
        });
      }
    }, 1000);
  };

  const generateResponse = (userInput: string, phase: number, step: number): string => {
    // Very simple response generation - in a real app, this would be more sophisticated
    if (userInput.length < 10) {
      return "Could you elaborate a bit more on that? The more details you provide, the better I can help you refine your startup idea.";
    }
    
    // Phase-specific responses
    if (phase === 0) {
      if (step === 0) {
        return "That's a great problem to tackle! Now, let's think about who experiences this problem most acutely. Can you describe the people or organizations that struggle with this issue?";
      }
      if (step === 1) {
        return "Your value proposition is taking shape nicely! Now, let's consider how we can communicate this value effectively. What are the 3 key benefits that customers will experience?";
      }
      if (step === 2) {
        return "That's a good start on your ideal customer profile. I've created a draft card in the canvas area. Would you like to refine any aspects of this profile?";
      }
    }
    
    return "Thanks for sharing that insight! This is definitely going to help us refine your startup concept. What other aspects would you like to explore?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-240px)] shadow-[0_8px_32px_rgba(155,135,245,0.1)]">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <Avatar className="h-8 w-8 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]">
          <AvatarFallback>CF</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-white font-medium">Co-founder AI</h3>
          <p className="text-white/50 text-xs">Your startup journey companion</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white' 
                  : 'bg-white/10 text-white'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl p-3 text-white max-w-[80%]">
                <div className="flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse animation-delay-200">●</span>
                  <span className="animate-pulse animation-delay-400">●</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white resize-none focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
            placeholder="Type your message..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white"
            onClick={handleSendMessage}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button 
            variant="outline" 
            className="text-xs py-1 px-3 h-auto bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setInputValue("Tell me more about this step")}
          >
            Tell me more
          </Button>
          <Button 
            variant="outline" 
            className="text-xs py-1 px-3 h-auto bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setInputValue("What examples can you show me?")}
          >
            See examples
          </Button>
          <Button 
            variant="outline" 
            className="text-xs py-1 px-3 h-auto bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setInputValue("I need help with this step")}
          >
            Get help
          </Button>
        </div>
      </div>
    </div>
  );
};
