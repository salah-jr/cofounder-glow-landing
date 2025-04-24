
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in">
      <span className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
        Cofounder
      </span>
      <Sparkles className="w-6 h-6 text-[#9b87f5]" />
    </div>
  );
};

export default Logo;
