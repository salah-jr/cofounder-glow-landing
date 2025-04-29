
import { Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "small" | "large";
  iconOnly?: boolean;
  animated?: boolean;
}

const Logo = ({ size = "small", iconOnly = false, animated = false }: LogoProps) => {
  const textSize = size === "small" ? "text-2xl" : "text-4xl";
  const iconSize = size === "small" ? 18 : 24;

  const animationClasses = animated
    ? "animate-pulse transition-all duration-3000"
    : "transition-all duration-300";

  return (
    <div className={cn("flex items-center justify-center gap-1.5", animated && "group")}>
      {!iconOnly && (
        <div className="flex items-center relative">
          <span className="relative">
            <span className={`${textSize} font-bold text-white tracking-tighter`}>co</span>
            <div 
              className={cn(
                "absolute -right-1.5 -top-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#1EAEDB] to-[#9b87f5]", 
                animated ? "animate-pulse blur-[2px]" : "blur-[1px]"
              )} 
            />
          </span>
          <div className="flex items-center">
            <Puzzle 
              size={iconSize} 
              className={cn(
                "text-[#9b87f5] translate-y-0.5 mx-0.5",
                animated && "animate-spin-slow"
              )} 
            />
            <span className={`${textSize} font-bold bg-gradient-to-tr from-[#9b87f5] via-[#5a9be6] to-[#1EAEDB] bg-clip-text text-transparent`}>
              founder
            </span>
          </div>
        </div>
      )}
      
      {iconOnly && (
        <Puzzle 
          size={iconSize} 
          className={cn(
            "text-[#9b87f5]",
            animated && "animate-spin-slow"
          )} 
        />
      )}
    </div>
  );
};

export default Logo;
