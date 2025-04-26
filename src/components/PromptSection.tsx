
import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimatedPlaceholder } from "@/hooks/useAnimatedPlaceholder";
import { useNavigate } from "react-router-dom";

const examples = [
  { text: "Weather dashboard", icon: "↑" },
  { text: "Recharts dashboard", icon: "↑" },
  { text: "E-commerce product page", icon: "↑" },
  { text: "Crypto portfolio tracker", icon: "→" },
];

const PromptSection = () => {
  const placeholder = useAnimatedPlaceholder();
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate("/discovery");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="w-full glass p-3 rounded-xl animate-fade-in">
        <div className="flex items-center bg-black/20 rounded-lg px-4">
          <textarea
            className="flex-1 bg-transparent h-14 py-4 text-white placeholder-white/50 focus:outline-none resize-none"
            placeholder={placeholder || "Create something amazing..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-4">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSubmit}
              className="text-white/50 hover:text-white hover:bg-white/10"
            >
              <Send className="h-5 w-5" />
            </Button>
            <Button className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity flex items-center gap-2 ml-2">
              Public
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-sm flex items-center gap-2"
            onClick={() => setPrompt(example.text)}
          >
            {example.text}
            <span className="text-xs opacity-60">{example.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSection;
