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
  const [isFocused, setIsFocused] = useState(false);
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
      <div className="w-full relative group">
        {/* Modern textarea container with theme colors */}
        <div className={`
          relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
          ${isFocused 
            ? 'bg-white/[0.08] border-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_8px_32px_rgba(99,102,241,0.15)]' 
            : 'bg-white/[0.04] border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)]'
          }
          border backdrop-blur-xl
          hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(99,102,241,0.08)]
        `}>
          {/* Subtle inner glow effect with theme colors */}
          <div className={`
            absolute inset-0 rounded-2xl transition-opacity duration-500
            ${isFocused 
              ? 'bg-gradient-to-r from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] opacity-100' 
              : 'opacity-0'
            }
          `} />
          
          {/* Enhanced textarea */}
          <textarea
            className={`
              relative z-10 w-full h-20 px-6 py-5 bg-transparent text-white/95 
              placeholder:text-white/40 resize-none outline-none
              transition-all duration-300 ease-out
              text-base leading-relaxed
              ${isFocused ? 'placeholder:text-white/50' : ''}
            `}
            placeholder={placeholder || "My idea is to..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {/* Bottom action bar */}
          <div className={`
            relative z-10 flex items-center justify-between px-6 pb-4 pt-2
            border-t transition-all duration-300
            ${isFocused 
              ? 'border-white/10' 
              : 'border-white/5'
            }
          `}>
            {/* Hidden file attachment - keeping code but hiding visually */}
            <div className="hidden">
              <FileAttachment 
                files={files}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
              />
            </div>
            
            {/* Left side - file count if any */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              {files.length > 0 && (
                <span className="px-2 py-1 bg-white/5 rounded-full border border-white/10">
                  {files.length} attachment{files.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Right side - Enhanced CTA button with theme colors */}
            <Button 
              className={`
                relative overflow-hidden group/btn
                bg-gradient-to-r from-indigo-500 to-rose-500 
                hover:from-indigo-600 hover:to-rose-600
                text-white font-medium px-6 py-2.5 rounded-xl
                shadow-[0_4px_16px_rgba(99,102,241,0.3)]
                hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)]
                transition-all duration-300 ease-out
                hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${prompt.trim() ? 'animate-pulse-subtle' : ''}
              `}
              onClick={handleSubmit}
              disabled={!prompt.trim()}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              
              <div className="relative flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Shape My Idea</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSection;