
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimatedPlaceholder } from "@/hooks/useAnimatedPlaceholder";
import { useNavigate } from "react-router-dom";
import FileAttachment, { FileItem } from "./FileAttachment";
import { v4 as uuidv4 } from "uuid";

const examples = [
  { text: "Create a SaaS business plan", icon: "↑" },
  { text: "Validate my startup idea", icon: "↑" },
  { text: "Research market opportunities", icon: "↑" },
  { text: "Build an investor pitch deck", icon: "→" },
];

const PromptSection = () => {
  const placeholder = useAnimatedPlaceholder();
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
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

  const handleAddFiles = (newFiles: File[]) => {
    const newFileItems = newFiles.map(file => {
      const item: FileItem = {
        id: uuidv4(),
        file,
        preview: null
      };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles(prev => 
            prev.map(f => 
              f.id === item.id 
                ? { ...f, preview: reader.result as string } 
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }
      
      return item;
    });
    
    setFiles(prev => [...prev, ...newFileItems]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="w-full glass p-3 rounded-xl animate-fade-in">
        <div className="flex flex-col bg-black/20 rounded-lg">
          <textarea
            className="flex-1 bg-transparent h-14 py-4 px-4 text-white placeholder-white/50 focus:outline-none resize-none"
            placeholder={placeholder || "Describe your startup idea or business challenge..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="px-4 pb-2">
            <FileAttachment 
              files={files}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>
          
          <div className="flex items-center justify-between gap-2 border-t border-white/10 p-2 mt-1">
            <div className="flex items-center gap-2 text-xs text-white/60">
              {files.length > 0 && (
                <span>{files.length} attachment{files.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            
            <Button 
              className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
              onClick={handleSubmit}
            >
              <Send className="h-5 w-5 mr-2" />
              Start Building
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
