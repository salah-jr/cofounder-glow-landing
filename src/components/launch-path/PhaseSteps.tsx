
import React from "react";
import { CheckCircle, Clock, CircleDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface PhaseStepsProps {
  phaseIndex: number;
  activeStep: number;
  onStepChange: (stepIndex: number) => void;
}

export const PhaseSteps = ({ phaseIndex, activeStep, onStepChange }: PhaseStepsProps) => {
  // Define steps for each phase
  const phaseSteps = [
    // Phase 0: Idea Refinement
    [
      { name: "Define Core Problem", status: "complete" },
      { name: "Outline Value Proposition", status: "active" },
      { name: "Create Ideal Customer Card", status: "pending" },
      { name: "Draft Initial Business Model", status: "pending" }
    ],
    // Phase 1: Validation
    [
      { name: "Create Customer Interview Script", status: "pending" },
      { name: "Build Concept Mockups", status: "pending" },
      { name: "Conduct Feedback Sessions", status: "pending" },
      { name: "Analyze Market Competition", status: "pending" }
    ],
    // Phase 2: Planning
    [
      { name: "Set Milestone Timeline", status: "pending" },
      { name: "Define Success Metrics", status: "pending" },
      { name: "Outline Resource Requirements", status: "pending" },
      { name: "Create Financial Projections", status: "pending" }
    ],
    // Phase 3: MVP Development
    [
      { name: "Draft Feature Priority List", status: "pending" },
      { name: "Design User Interface", status: "pending" },
      { name: "Build Core Functionality", status: "pending" },
      { name: "Setup Analytics & Feedback", status: "pending" }
    ],
    // Phase 4: Go-to-Market
    [
      { name: "Create Messaging Framework", status: "pending" },
      { name: "Build Landing Page", status: "pending" },
      { name: "Setup Acquisition Channels", status: "pending" },
      { name: "Prepare Launch Announcement", status: "pending" }
    ]
  ];

  // Get the steps for the current phase
  const currentPhaseSteps = phaseSteps[phaseIndex] || [];

  // Update step status based on activeStep
  const updatedSteps = currentPhaseSteps.map((step, index) => {
    if (index < activeStep) return { ...step, status: "complete" };
    if (index === activeStep) return { ...step, status: "active" };
    return { ...step, status: "pending" };
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "active":
        return <CircleDot className="w-5 h-5 text-[#9b87f5]" />;
      default:
        return <Clock className="w-5 h-5 text-white/40" />;
    }
  };

  const getPhaseTitle = () => {
    const phaseTitles = [
      "Idea Refinement",
      "Validation",
      "Planning",
      "MVP Development",
      "Go-to-Market"
    ];
    return phaseTitles[phaseIndex] || "Current Phase";
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden h-[calc(100vh-240px)] shadow-[0_8px_32px_rgba(155,135,245,0.1)]">
      <div className="p-4 border-b border-white/10 bg-white/5">
        <h3 className="text-white font-semibold">
          {getPhaseTitle()} Steps
        </h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-56px)]">
        <div className="p-4">
          {updatedSteps.map((step, index) => (
            <Card 
              key={index}
              className={`mb-3 transition-all duration-300 cursor-pointer hover:ring-1 hover:ring-[#9b87f5]/50 hover:scale-[1.01] ${
                step.status === "active" ? "bg-white/10 border-[#9b87f5]/30" : "bg-white/5 border-white/10"
              }`}
              onClick={() => onStepChange(index)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(step.status)}
                  <span className={`ml-3 ${step.status === "pending" ? "text-white/60" : "text-white"}`}>
                    {step.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Separator className="my-2 bg-white/10" />
          
          <p className="text-white/40 text-xs mt-3">
            Complete these steps in order to advance to the next phase of your startup journey.
          </p>
        </div>
      </ScrollArea>
    </div>
  );
};
