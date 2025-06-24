import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "small" | "large";
  iconOnly?: boolean;
}

const Logo = ({ size = "small", iconOnly = false }: LogoProps) => {
  const textSize = size === "small" ? "text-2xl" : "text-4xl";
  const iconSize = size === "small" ? "w-5 h-5" : "w-7 h-7";

  return (
    <div className="flex items-center justify-center gap-3 animate-fade-in">
      {!iconOnly && (
        <div className="flex items-center relative">
          <span className={`${textSize} font-bold bg-gradient-to-r from-[#9b87f5] via-[#7c3aed] to-[#1EAEDB] bg-clip-text text-transparent tracking-tight`}>
            Cofounder
          </span>
          <div className="relative ml-1">
            <Sparkles className={`${iconSize} text-[#9b87f5] drop-shadow-lg`} />
            <div className="absolute inset-0 bg-[#9b87f5] rounded-full blur-sm opacity-30 animate-pulse" />
          </div>
        </div>
      )}
      {iconOnly && (
        <div className="relative">
          <Sparkles className={`${iconSize} text-[#9b87f5] drop-shadow-lg`} />
          <div className="absolute inset-0 bg-[#9b87f5] rounded-full blur-sm opacity-30 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default Logo;