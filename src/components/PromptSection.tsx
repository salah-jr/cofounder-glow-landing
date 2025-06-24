import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimatedPlaceholder } from "@/hooks/useAnimatedPlaceholder";
import { useNavigate } from "react-router-dom";
import FileAttachment, { FileItem } from "./FileAttachment";
import { v4 as uuidv4 } from "uuid";

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
      <div className="w-full glass p-4 rounded-xl animate-fade-in">
        <div className="flex flex-col bg-black/20 rounded-lg overflow-hidden">
          <textarea
            className="flex-1 bg-transparent h-16 py-4 px-4 text-white placeholder-white/50 focus:outline-none resize-none transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-white/5 focus:bg-white/5 focus:shadow-xl focus:shadow-white/10 border-0"
            placeholder={placeholder || "My idea is to..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center justify-between gap-2 border-t border-white/10 p-3">
            {/* Hidden file attachment - keeping code but hiding visually */}
            <div className="hidden">
              <FileAttachment 
                files={files}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
              />
            </div>
            
            {/* Left side - file count if any */}
            <div className="flex items-center gap-2 text-xs text-white/60">
              {files.length > 0 && (
                <span>{files.length} attachment{files.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            
            {/* Right side - CTA button */}
            <Button 
              className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity ml-auto"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4 mr-2" />
              Shape My Idea
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSection;