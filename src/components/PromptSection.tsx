
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromptSection = () => {
  return (
    <div className="w-full max-w-3xl mx-auto glass p-6 rounded-xl animate-fade-in">
      <textarea
        className="w-full h-32 bg-black/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] resize-none"
        placeholder="Describe your startup idea..."
      />
      <div className="flex justify-end mt-4">
        <Button className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </div>
    </div>
  );
};

export default PromptSection;
