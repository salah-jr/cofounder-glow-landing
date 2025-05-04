
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RoadmapProgress from "@/components/launch/RoadmapProgress";
import PhaseSidebar from "@/components/launch/PhaseSidebar";
import CofounderChat from "@/components/launch/CofounderChat";
import CanvasOutput from "@/components/launch/CanvasOutput";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { TaskStatus } from "@/components/launch/PhaseTask";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";

// Enhanced tasks data with icons and tooltips
const phaseTasks = {
  "idea": [{
    id: "task1",
    title: "Define value proposition",
    status: "in-progress" as TaskStatus,
    icon: "bulb",
    tooltip: "Clearly articulate the unique value your product offers to customers"
  }, {
    id: "task2",
    title: "Identify target audience",
    status: "pending" as TaskStatus,
    icon: "target",
    tooltip: "Define your ideal customer segments and their key characteristics"
  }, {
    id: "task3",
    title: "Research competitors",
    status: "pending" as TaskStatus,
    tooltip: "Analyze what existing solutions are in the market and their strengths/weaknesses"
  }, {
    id: "task4",
    title: "Outline key features",
    status: "pending" as TaskStatus,
    tooltip: "List the essential capabilities your product needs to deliver value"
  }, {
    id: "task5",
    title: "Create product vision",
    status: "pending" as TaskStatus,
    tooltip: "Define where your product is headed in the long term"
  }],
  "validation": [{
    id: "task6",
    title: "Create validation hypothesis",
    status: "pending" as TaskStatus,
    tooltip: "Form testable assumptions about your business model"
  }, {
    id: "task7",
    title: "Design customer interviews",
    status: "pending" as TaskStatus,
    tooltip: "Prepare questions that validate your value proposition"
  }, {
    id: "task8",
    title: "Analyze market demand",
    status: "pending" as TaskStatus,
    tooltip: "Research and quantify the potential market size"
  }, {
    id: "task9",
    title: "Gather initial feedback",
    status: "pending" as TaskStatus,
    tooltip: "Collect and organize early user insights"
  }]
  // Other phases would have their own tasks
};

// Define progress steps
const progressSteps = ["Idea", "Validation", "Planning", "Prototype", "Development", "Launch", "Growth"];

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("idea");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  
  // State for the collapsible left panel
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  
  // State for progress bar collapse
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  
  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Implement actual status change logic here
  };
  
  // Toggle left panel collapse
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  // Get current step number for progress bar
  const getCurrentStepIndex = () => {
    return progressSteps.findIndex(step => step.toLowerCase() === currentPhase) + 1;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      <div className="w-full px-6">
        <Navbar />
      </div>
      
      {/* New Progress Bar */}
      <ProgressBar 
        steps={progressSteps.length} 
        currentStep={getCurrentStepIndex()}
        labels={progressSteps}
        showLabels={true}
        collapsed={isProgressCollapsed}
        onToggleCollapse={() => setIsProgressCollapsed(!isProgressCollapsed)}
        className="mt-2"
      />
      
      {/* Main content area */}
      <div className="w-full px-6 py-6 flex-grow overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                  "focus:outline-none focus:ring-2 focus:ring-white/20",
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
                      phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} 
                      tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} 
                      onTaskStatusChange={handleTaskStatusChange}
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
                <ResizablePanel 
                  defaultSize={50}
                  minSize={30}
                  maxSize={70}
                  className="transition-all duration-300 ease-in-out"
                >
                  <Card className="glass h-full rounded-xl overflow-hidden">
                    <CardContent className="p-4 h-full overflow-hidden">
                      <CofounderChat />
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
                <ResizablePanel 
                  defaultSize={50}
                  minSize={30}
                  maxSize={70}
                  className="transition-all duration-300 ease-in-out"
                >
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
}

export default LaunchPath;
