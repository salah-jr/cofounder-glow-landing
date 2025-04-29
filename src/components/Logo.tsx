
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
        <div className="flex items-baseline">
          <span className={`${textSize} font-bold bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent font-sans tracking-tight`}>
            co
          </span>
          <span className={`${textSize} font-normal text-white`}>
            founder
          </span>
        </div>
      )}
      <Sparkles className={`${iconSize} text-[#9b87f5]`} />
    </div>
  );
};

export default Logo;
