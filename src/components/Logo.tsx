
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "small" | "large";
  iconOnly?: boolean;
}

const Logo = ({ size = "small", iconOnly = false }: LogoProps) => {
  const textSize = size === "small" ? "text-2xl" : "text-4xl";
  const iconSize = size === "small" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in">
      {!iconOnly && (
        <div className="flex items-center relative">
          <span className={`${textSize} font-bold bg-gradient-to-r from-[#9b87f5] via-[#8a9bf5] to-[#1EAEDB] bg-clip-text text-transparent`}>
            Cofounder
            <span className="relative z-10">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1EAEDB] rounded-full blur-[2px]" />
              <Sparkles className={`absolute -top-2 -right-2 ${iconSize} text-[#9b87f5]`} />
            </span>
          </span>
        </div>
      )}
      {iconOnly && <Sparkles className={`${iconSize} text-[#9b87f5]`} />}
    </div>
  );
};

export default Logo;
