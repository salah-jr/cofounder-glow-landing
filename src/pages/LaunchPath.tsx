
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { LaunchPathProgress } from "@/components/launch-path/LaunchPathProgress";
import { PhaseSteps } from "@/components/launch-path/PhaseSteps";
import { CofounderChat } from "@/components/launch-path/CofounderChat";
import { CanvasOutput } from "@/components/launch-path/CanvasOutput";

const LaunchPath = () => {
  const { isAuthenticated } = useAuth();
  const [activePhase, setActivePhase] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [outputs, setOutputs] = useState<any[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handlePhaseChange = (phaseIndex: number) => {
    setActivePhase(phaseIndex);
    setActiveStep(0);
  };

  const handleStepChange = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleOutputUpdate = (newOutput: any) => {
    setOutputs([...outputs, newOutput]);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Top Progress Bar */}
        <LaunchPathProgress 
          activePhase={activePhase} 
          onPhaseChange={handlePhaseChange} 
        />
        
        {/* Main Content Area - 3 Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Left Panel - Phase Steps */}
          <div className="lg:col-span-3">
            <PhaseSteps 
              phaseIndex={activePhase} 
              activeStep={activeStep}
              onStepChange={handleStepChange}
            />
          </div>
          
          {/* Middle Panel - Cofounder Chat */}
          <div className="lg:col-span-5">
            <CofounderChat 
              phaseIndex={activePhase} 
              stepIndex={activeStep}
              onOutputGenerated={handleOutputUpdate}
            />
          </div>
          
          {/* Right Panel - Canvas Output */}
          <div className="lg:col-span-4">
            <CanvasOutput outputs={outputs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPath;
