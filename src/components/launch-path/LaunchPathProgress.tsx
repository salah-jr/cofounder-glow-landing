
import React from "react";
import { Check, CircleDot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface LaunchPathProgressProps {
  activePhase: number;
  onPhaseChange: (phaseIndex: number) => void;
}

export const LaunchPathProgress = ({ activePhase, onPhaseChange }: LaunchPathProgressProps) => {
  const phases = [
    { name: "Idea Refinement", description: "Refine your initial idea and identify your key value proposition" },
    { name: "Validation", description: "Test your idea assumptions with potential customers and gather feedback" },
    { name: "Planning", description: "Create a strategic plan for development and market entry" },
    { name: "MVP Development", description: "Build your minimum viable product with essential features" },
    { name: "Go-to-Market", description: "Prepare and execute your initial marketing and launch strategy" }
  ];

  const progressPercentage = ((activePhase + 1) / phases.length) * 100;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_8px_32px_rgba(155,135,245,0.1)]">
      <h2 className="text-white text-xl font-semibold mb-6">The Launch Path</h2>
      
      <div className="relative mb-8">
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-white/10" 
          indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" 
        />
      </div>
      
      <div className="flex justify-between items-center">
        {phases.map((phase, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger>
              <button 
                className={`flex flex-col items-center transition-all duration-300 group relative`}
                onClick={() => onPhaseChange(index)}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                    ${index < activePhase 
                      ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white" 
                      : index === activePhase 
                        ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] ring-4 ring-[#9b87f5]/30 text-white animate-pulse-subtle"
                        : "bg-white/10 text-white/50"
                    }`}
                >
                  {index < activePhase ? (
                    <Check className="w-5 h-5" />
                  ) : index === activePhase ? (
                    <CircleDot className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`text-xs font-medium transition-all
                    ${index <= activePhase ? "text-white" : "text-white/50"}`}
                >
                  {phase.name}
                </span>
                {index < phases.length - 1 && (
                  <div className={`absolute left-[calc(100%_-_10px)] top-5 h-[2px] w-[calc(100%_+_10px)] 
                    ${index < activePhase ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" : "bg-white/10"}`} 
                  />
                )}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="bg-[#272B38]/90 backdrop-blur-xl border-white/10 text-white w-56">
              <p className="text-sm">{phase.description}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};
