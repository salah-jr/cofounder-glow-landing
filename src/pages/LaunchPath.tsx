import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SimpleProgressBar from "@/components/launch/SimpleProgressBar";
import PhaseSidebar from "@/components/launch/PhaseSidebar";
import CofounderChat, { CofounderChatRef } from "@/components/launch/CofounderChat";
import CanvasOutput from "@/components/launch/CanvasOutput";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { TaskStatus } from "@/components/launch/PhaseTask";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the main phases
const mainPhases = [
  { id: "shape", label: "Shape Your Idea" },
  { id: "validate", label: "Validate the Idea and the Market" },
  { id: "build", label: "Build the Business" },
  { id: "mvp", label: "Plan the MVP" },
  { id: "pitch", label: "Pitch Your Idea" }
];

// Enhanced tasks data with the new structure
const phaseTasks = {
  "shape": [
    {
      id: "shape-1",
      title: "Define the Problem & Target User",
      status: "in-progress" as TaskStatus,
      tooltip: "Clearly identify the problem you're solving and who experiences it"
    },
    {
      id: "shape-2",
      title: "Craft Your Idea One-Liner",
      status: "pending" as TaskStatus,
      tooltip: "Create a concise, compelling description of your startup idea"
    },
    {
      id: "shape-3",
      title: "Spot the Market Gap",
      status: "pending" as TaskStatus,
      tooltip: "Identify what's missing in the current market that your idea addresses"
    },
    {
      id: "shape-4",
      title: "Capture Key Assumptions",
      status: "pending" as TaskStatus,
      tooltip: "Document the critical assumptions your business model depends on"
    }
  ],
  "validate": [
    {
      id: "validate-1",
      title: "Research the Market",
      status: "pending" as TaskStatus,
      tooltip: "Gather data about your target market size, trends, and dynamics"
    },
    {
      id: "validate-2",
      title: "Design the Interview",
      status: "pending" as TaskStatus,
      tooltip: "Create structured questions to validate your assumptions with real users"
    },
    {
      id: "validate-3",
      title: "Practice the Interview",
      status: "pending" as TaskStatus,
      tooltip: "Rehearse your interview approach to ensure effective user conversations"
    },
    {
      id: "validate-4",
      title: "Talk to Real Users",
      status: "pending" as TaskStatus,
      tooltip: "Conduct actual interviews with potential customers"
    },
    {
      id: "validate-5",
      title: "Learn and Compare",
      status: "pending" as TaskStatus,
      tooltip: "Analyze feedback and compare findings against your initial assumptions"
    }
  ],
  "build": [
    {
      id: "build-1",
      title: "Define Value & Market Positioning",
      status: "pending" as TaskStatus,
      tooltip: "Establish how your product creates value and positions in the market"
    },
    {
      id: "build-2",
      title: "Identify Risks and Mitigations",
      status: "pending" as TaskStatus,
      tooltip: "Recognize potential business risks and develop strategies to address them"
    },
    {
      id: "build-3",
      title: "Outline Revenue Model & Pricing",
      status: "pending" as TaskStatus,
      tooltip: "Define how your business will generate revenue and price your offering"
    },
    {
      id: "build-4",
      title: "Estimate Costs & Required Resources",
      status: "pending" as TaskStatus,
      tooltip: "Calculate the resources and capital needed to build and operate your business"
    },
    {
      id: "build-5",
      title: "Assemble the Business Case",
      status: "pending" as TaskStatus,
      tooltip: "Compile all elements into a comprehensive business justification"
    }
  ],
  "mvp": [
    {
      id: "mvp-1",
      title: "Map the User Flow",
      status: "pending" as TaskStatus,
      tooltip: "Design the step-by-step journey users will take through your product"
    },
    {
      id: "mvp-2",
      title: "Prioritize the Features",
      status: "pending" as TaskStatus,
      tooltip: "Identify which features are essential for your minimum viable product"
    },
    {
      id: "mvp-3",
      title: "Design & Build Prompts",
      status: "pending" as TaskStatus,
      tooltip: "Create the user interface elements and interaction prompts"
    },
    {
      id: "mvp-4",
      title: "Plan a Usability Test",
      status: "pending" as TaskStatus,
      tooltip: "Design tests to evaluate how users interact with your MVP"
    },
    {
      id: "mvp-5",
      title: "Run User Validation",
      status: "pending" as TaskStatus,
      tooltip: "Execute testing with real users to validate your MVP approach"
    }
  ],
  "pitch": [
    {
      id: "pitch-1",
      title: "Tell the Startup Story",
      status: "pending" as TaskStatus,
      tooltip: "Craft a compelling narrative about your startup's mission and vision"
    },
    {
      id: "pitch-2",
      title: "Create Your Launch Signal",
      status: "pending" as TaskStatus,
      tooltip: "Develop key messages and materials for your market launch"
    },
    {
      id: "pitch-3",
      title: "Plan Your Next Moves",
      status: "pending" as TaskStatus,
      tooltip: "Define immediate next steps and milestones after launch"
    },
    {
      id: "pitch-4",
      title: "Build Your Pitch Deck",
      status: "pending" as TaskStatus,
      tooltip: "Create a professional presentation for investors and stakeholders"
    }
  ]
};

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("shape");
  const [currentStepId, setCurrentStepId] = useState("shape-1");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

  // State for the collapsible left panel
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Reference to the chat component for resetting
  const chatRef = useRef<CofounderChatRef>(null);

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Set the current step when a task is clicked
    setCurrentStepId(taskId);
    
    // Extract phase from taskId (e.g., "shape-1" -> "shape")
    const phaseId = taskId.split('-')[0];
    if (phaseId !== currentPhase) {
      setCurrentPhase(phaseId);
    }
  };

  // Handle step click
  const handleStepClick = (stepId: string) => {
    console.log(`Step ${stepId} clicked`);
    setCurrentStepId(stepId);
    
    // Extract phase from stepId
    const phaseId = stepId.split('-')[0];
    if (phaseId !== currentPhase) {
      setCurrentPhase(phaseId);
    }
  };

  // Toggle left panel collapse
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  // Reset chat function
  const handleResetChat = () => {
    console.log("handleResetChat called in LaunchPath");
    if (chatRef.current) {
      console.log("Calling resetChat method via ref");
      chatRef.current.resetChat();
    } else {
      console.error("chatRef is null - cannot reset chat");
    }
  };

  // Get phase display name
  const getPhaseDisplayName = (phaseId: string) => {
    const phase = mainPhases.find(p => p.id === phaseId);
    return phase ? phase.label : phaseId;
  };

  // Get current phase number (1-based)
  const getCurrentPhaseNumber = () => {
    return mainPhases.findIndex(p => p.id === currentPhase) + 1;
  };

  // Get current step number within the phase (1-based)
  const getCurrentStepNumber = () => {
    const stepNumber = currentStepId.split('-')[1];
    return parseInt(stepNumber, 10);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      <div className="w-full px-6">
        <Navbar />
      </div>
      
      {/* Simple Progress Bar */}
      <div className="w-full px-6 py-6">
        <SimpleProgressBar 
          currentPhase={currentPhase}
          completedPhases={completedPhases}
        />
      </div>
      
      {/* Main content area */}
      <div className="w-full px-6 pb-6 flex-grow overflow-hidden">
        <motion.div 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.5,
            delay: 0.2
          }} 
          className="h-full"
        >
          {/* Main layout container */}
          <div className="flex h-full rounded-xl animate-fade-in">
            {/* First Panel - Left Sidebar with Phase Tasks */}
            <div className="relative h-full">
              {/* Perfectly centered circular collapse button on right border */}
              <button 
                onClick={toggleLeftPanel} 
                className={cn(
                  "absolute z-10 top-1/2 -right-3 -translate-y-1/2",
                  "w-6 h-6 flex items-center justify-center",
                  "bg-white/10 backdrop-blur-md",
                  "border border-white/20",
                  "rounded-full shadow-md",
                  "transition-all duration-300 ease-in-out",
                  "hover:bg-white/15 hover:border-white/30",
                  "focus:outline-none focus:ring-2 focus:ring-white/20"
                )} 
                aria-label="Toggle sidebar"
              >
                <ChevronLeft className={cn(
                  "w-4 h-4 text-white/70",
                  "transition-transform duration-300 ease-in-out",
                  isLeftPanelCollapsed && "rotate-180"
                )} />
              </button>

              <div className={cn(
                "h-full overflow-hidden transition-all duration-300 ease-in-out",
                isLeftPanelCollapsed ? "w-0 opacity-0" : "w-[20vw] opacity-100"
              )}>
                <Card className="glass h-full rounded-xl overflow-hidden">
                  <CardContent className="p-4 h-full">
                    <PhaseSidebar 
                      phase={getPhaseDisplayName(currentPhase)} 
                      tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} 
                      currentStepId={currentStepId}
                      onTaskStatusChange={handleTaskStatusChange}
                      onStepClick={handleStepClick}
                      onResetChat={handleResetChat} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Right side panels container */}
            <div className={cn(
              "flex-grow ml-4 transition-all duration-300",
              isLeftPanelCollapsed ? "ml-8" : ""
            )}>
              {/* Right side panels with resizable functionality */}
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Panel for Chat component */}
                <ResizablePanel defaultSize={50} minSize={30} maxSize={70} className="transition-all duration-500 ease-in-out">
                  <Card className="glass h-full rounded-xl overflow-hidden">
                    <CardContent className="p-4 h-full overflow-hidden">
                      <CofounderChat 
                        ref={chatRef} 
                        currentPhaseId={currentPhase}
                        currentStepId={currentStepId}
                        phaseNumber={getCurrentPhaseNumber()}
                        stepNumber={getCurrentStepNumber()}
                      />
                    </CardContent>
                  </Card>
                </ResizablePanel>
                
                {/* Enhanced resize handle between chat and canvas with better responsiveness */}
                <ResizableHandle withHandle className="bg-transparent transition-all duration-200">
                  <div className="flex h-6 w-1.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 group-hover:scale-105">
                    <ChevronLeft className="h-3 w-3 text-white/60 transition-opacity" />
                    <ChevronRight className="h-3 w-3 -ml-3 text-white/60 transition-opacity" />
                  </div>
                </ResizableHandle>
                
                {/* Panel for Canvas Output */}
                <ResizablePanel defaultSize={50} minSize={30} maxSize={70} className="transition-all duration-500 ease-in-out">
                  <Card className="glass h-full rounded-xl overflow-hidden">
                    <CardContent className="p-4 h-full overflow-hidden">
                      <CanvasOutput />
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background gradient circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LaunchPath;