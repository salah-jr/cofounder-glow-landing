
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, User, File, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
}

interface CofounderChatProps {
  className?: string;
  onReset?: () => void; // Optional callback when chat is reset
}

// Define ref methods that can be accessed from parent component
export interface CofounderChatRef {
  resetChat: () => void;
}

const CofounderChat = forwardRef<CofounderChatRef, CofounderChatProps>(({ className, onReset }, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your Co-founder AI assistant. I'm here to help you refine your startup idea. What's the core problem your product solves?",
      sender: "cofounder"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<"neutral" | "thinking" | "excited">("neutral");
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Cleanup typing timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Function to reset the chat
  const resetChat = () => {
    console.log("resetChat function called in CofounderChat");
    
    // Clear any existing typing timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Reset to initial state
    setMessages([{
      id: Date.now().toString(),
      text: "Let's talk about your idea! What's the core problem your product aims to solve?",
      sender: "cofounder"
    }]);
    setInput("");
    setIsTyping(false);
    setCurrentMood("neutral");
    setAttachedFiles([]);
    
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
  
  // Make the resetChat function accessible via a ref
  useEffect(() => {
    // Expose resetChat method to parent component
    if (window) {
      (window as any).resetCofounderChat = resetChat;
    }
    
    return () => {
      // Clean up
      if (window && (window as any).resetCofounderChat) {
        delete (window as any).resetCofounderChat;
      }
    };
  }, []);
  
  const handleSendMessage = () => {
    if (input.trim() === "" && attachedFiles.length === 0) return;
    
    // Add user message with send animation
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachedFiles([]); // Clear attachments after sending
    setIsTyping(true);
    setCurrentMood("thinking");
    
    // Clear any existing timeout to prevent race conditions
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Simulate AI response after a delay
    typingTimeoutRef.current = window.setTimeout(() => {
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
        isInsight
      };
      
      setCurrentMood(isInsight ? "excited" : "neutral");
      setMessages(prev => [...prev, cofounderMessage]);
      setIsTyping(false); // Explicitly set typing to false when message is added
      typingTimeoutRef.current = null; // Reset timeout ref
    }, 1500);
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
          <h3 className="text-lg font-semibold text-white">Co-founder</h3>
          <div className={cn(
            "ml-2 h-3 w-3 rounded-full",
            currentMood === "thinking" 
              ? "bg-[#FEF7CD]" 
              : currentMood === "excited" 
                ? "bg-[#F2FCE2]" 
                : "bg-gradient-to-br from-[#1EAEDB] to-[#9b87f5]"
          )} />
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetChat}
          className="text-xs text-white/50 hover:text-white"
        >
          Reset Chat
        </Button>
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
                  </span>
                </div>
                
                <div className={cn(
                  "max-w-3xl",
                  message.sender === "user" ? "ml-auto" : ""
                )}>
                  <div className={cn(
                    "py-2 px-1",
                    "text-white" // Always white text for all messages
                  )}>
                    {message.text && <p>{message.text}</p>}
                    {renderMessageFiles(message.files)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator - only visible when isTyping is true */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  key="typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-2 py-4"
                >
                  <div className="flex items-center gap-1">
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
            </AnimatePresence>
            
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
            placeholder="Ask your co-founder anything..."
            className="w-full px-4 py-3 min-h-[48px] max-h-24 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#9b87f5] resize-none transition-all duration-200 focus:border-[#9b87f5]/60 scrollbar-hide"
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
                className="h-8 w-8 rounded-full hover:bg-white/10"
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
              disabled={!input.trim() && attachedFiles.length === 0}
              className={cn(
                "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white p-2 rounded-md transition-all duration-300",
                (!input.trim() && attachedFiles.length === 0) ? "opacity-50" : "hover:opacity-90"
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
