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

// Enhanced tasks data with icons and tooltips - updated for new phases
const phaseTasks = {
  "shape": [
    {
      id: "task1",
      title: "Define value proposition",
      status: "in-progress" as TaskStatus,
      icon: "bulb",
      tooltip: "Clearly articulate the unique value your product offers to customers"
    },
    {
      id: "task2",
      title: "Identify target audience",
      status: "pending" as TaskStatus,
      icon: "target",
      tooltip: "Define your ideal customer segments and their key characteristics"
    },
    {
      id: "task3",
      title: "Research competitors",
      status: "pending" as TaskStatus,
      tooltip: "Analyze what existing solutions are in the market and their strengths/weaknesses"
    },
    {
      id: "task4",
      title: "Outline key features",
      status: "pending" as TaskStatus,
      tooltip: "List the essential capabilities your product needs to deliver value"
    },
    {
      id: "task5",
      title: "Create product vision",
      status: "pending" as TaskStatus,
      tooltip: "Define where your product is headed in the long term"
    }
  ],
  "validate": [
    {
      id: "task6",
      title: "Create validation hypothesis",
      status: "pending" as TaskStatus,
      tooltip: "Form testable assumptions about your business model"
    },
    {
      id: "task7",
      title: "Design customer interviews",
      status: "pending" as TaskStatus,
      tooltip: "Prepare questions that validate your value proposition"
    },
    {
      id: "task8",
      title: "Analyze market demand",
      status: "pending" as TaskStatus,
      tooltip: "Research and quantify the potential market size"
    },
    {
      id: "task9",
      title: "Gather initial feedback",
      status: "pending" as TaskStatus,
      tooltip: "Collect and organize early user insights"
    }
  ],
  "build": [
    {
      id: "task10",
      title: "Define business model",
      status: "pending" as TaskStatus,
      tooltip: "Establish how your business will create, deliver, and capture value"
    },
    {
      id: "task11",
      title: "Create financial projections",
      status: "pending" as TaskStatus,
      tooltip: "Develop realistic revenue and cost forecasts"
    },
    {
      id: "task12",
      title: "Plan go-to-market strategy",
      status: "pending" as TaskStatus,
      tooltip: "Define how you'll reach and acquire customers"
    }
  ],
  "mvp": [
    {
      id: "task13",
      title: "Define MVP features",
      status: "pending" as TaskStatus,
      tooltip: "Identify the minimum set of features needed to test your hypothesis"
    },
    {
      id: "task14",
      title: "Create development timeline",
      status: "pending" as TaskStatus,
      tooltip: "Plan the development phases and milestones"
    },
    {
      id: "task15",
      title: "Design user experience",
      status: "pending" as TaskStatus,
      tooltip: "Create wireframes and user flow for your MVP"
    }
  ],
  "pitch": [
    {
      id: "task16",
      title: "Create pitch deck",
      status: "pending" as TaskStatus,
      tooltip: "Develop a compelling presentation for investors or stakeholders"
    },
    {
      id: "task17",
      title: "Practice pitch delivery",
      status: "pending" as TaskStatus,
      tooltip: "Rehearse and refine your presentation skills"
    },
    {
      id: "task18",
      title: "Prepare for Q&A",
      status: "pending" as TaskStatus,
      tooltip: "Anticipate questions and prepare thoughtful responses"
    }
  ]
};

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress - updated to use new phases
  const [currentPhase, setCurrentPhase] = useState("shape");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

  // State for the collapsible left panel
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Reference to the chat component for resetting - updated type
  const chatRef = useRef<CofounderChatRef>(null);

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Implement actual status change logic here
  };

  // Toggle left panel collapse
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  // Reset chat function - enhanced with console log for debugging
  const handleResetChat = () => {
    console.log("handleResetChat called in LaunchPath");
    // Use the chatRef directly
    if (chatRef.current) {
      console.log("Calling resetChat method via ref");
      chatRef.current.resetChat();
    } else {
      console.error("chatRef is null - cannot reset chat");
    }
  };

  // Get phase display name
  const getPhaseDisplayName = (phaseId: string) => {
    const phaseNames = {
      "shape": "Shape Your Idea",
      "validate": "Validate the Idea and the Market",
      "build": "Build the Business",
      "mvp": "Plan the MVP",
      "pitch": "Pitch Your Idea"
    };
    return phaseNames[phaseId as keyof typeof phaseNames] || phaseId;
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
                      onTaskStatusChange={handleTaskStatusChange} 
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
                      <CofounderChat ref={chatRef} />
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