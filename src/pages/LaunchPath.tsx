
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

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("idea");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  
  // State for the collapsible left panel
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  
  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Implement actual status change logic here
  };
  
  // Toggle left panel collapse
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      <div className="w-full px-6">
        <Navbar />
      </div>
      
      {/* Progress bar section */}
      <div className="w-full px-6 pt-6 pb-4 flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="my-4"
        >
          {/* Top horizontal bar - Roadmap Progress */}
          <div className="glass p-4 rounded-xl border border-white/10 animate-fade-in">
            <RoadmapProgress currentPhase={currentPhase} completedPhases={completedPhases} />
          </div>
        </motion.div>
      </div>
      
      {/* Main content area */}
      <div className="w-full px-6 pb-6 flex-grow overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full"
        >
          {/* Main layout container */}
          <div className="flex h-full rounded-xl animate-fade-in">
            {/* First Panel - Left Sidebar with Phase Tasks */}
            <div className={cn(
              "h-full transition-all duration-300 ease-in-out relative shrink-0",
              isLeftPanelCollapsed ? "w-0" : "w-1/5"
            )}>
              <Card className={cn(
                "glass h-full rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
                isLeftPanelCollapsed ? "opacity-0" : "opacity-100"
              )}>
                <CardContent className="p-4 h-full">
                  <PhaseSidebar 
                    phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} 
                    tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} 
                    onTaskStatusChange={handleTaskStatusChange}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Modernized toggle button for left panel - now fixed to the left edge */}
            <div 
              className={cn(
                "absolute left-6 top-1/2 z-20 -translate-y-1/2",
                "w-8 h-8 flex items-center justify-center",
                "bg-white/5 backdrop-blur-md",
                "rounded-full border border-white/20",
                "cursor-pointer transition-all duration-300 hover:bg-white/10",
                "shadow-sm"
              )}
              onClick={toggleLeftPanel}
              style={{
                transform: `translateY(-50%)`,
                left: isLeftPanelCollapsed ? '16px' : 'calc(20% + 6px)',
                transition: 'left 0.3s ease-in-out',
              }}
            >
              <ChevronLeft 
                className={cn(
                  "h-5 w-5 text-white/70 transition-transform duration-300",
                  isLeftPanelCollapsed && "rotate-180"
                )} 
              />
            </div>
            
            {/* Right side panels container - consistent gap with left panel */}
            <div className={cn(
              "flex-grow ml-4 transition-all duration-300",
              isLeftPanelCollapsed ? "ml-8" : ""
            )}>
              {/* Right side panels with resizable functionality */}
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Panel for Chat component */}
                <ResizablePanel 
                  defaultSize={50}
                  minSize={35}
                  maxSize={65}
                  className="transition-all duration-300 ease-in-out"
                >
                  <Card className="glass h-full rounded-xl overflow-hidden">
                    <CardContent className="p-4 h-full overflow-hidden">
                      <CofounderChat />
                    </CardContent>
                  </Card>
                </ResizablePanel>
                
                {/* Enhanced resize handle between chat and canvas - less responsive to mouse movement */}
                <ResizableHandle withHandle className="bg-transparent transition-all duration-200 hover:bg-white/10">
                  <div className="flex h-6 w-1.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 group-hover:scale-105">
                    <ChevronLeft className="h-3 w-3 text-white/60 transition-opacity" />
                    <ChevronRight className="h-3 w-3 -ml-3 text-white/60 transition-opacity" />
                  </div>
                </ResizableHandle>
                
                {/* Panel for Canvas Output */}
                <ResizablePanel 
                  defaultSize={50}
                  minSize={35}
                  maxSize={65}
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
