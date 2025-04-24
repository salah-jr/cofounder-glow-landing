
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "small" | "large";
}

const Logo = ({ size = "small" }: LogoProps) => {
  const textSize = size === "small" ? "text-2xl" : "text-4xl";
  const iconSize = size === "small" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in">
      <span className={`${textSize} font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent`}>
        Cofounder
      </span>
      <Sparkles className={`${iconSize} text-[#9b87f5]`} />
    </div>
  );
};

export default Logo;
