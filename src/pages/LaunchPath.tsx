
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
import { ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Implement actual status change logic here
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      <div className="w-full px-6">
        <Navbar />
      </div>
      
      {/* Progress bar section with fixed height that won't cause layout shifts when collapsed */}
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
      
      {/* Main content area - now using flex-grow to fill remaining space */}
      <div className="w-full px-6 pb-6 flex-grow overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full"
        >
          {/* 4-compartment layout using ResizablePanel */}
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl animate-fade-in">
            {/* First Panel - Left Sidebar with Phase Tasks - Now with collapsible functionality */}
            <div className="flex h-full">
              <Collapsible 
                open={isLeftPanelOpen} 
                onOpenChange={setIsLeftPanelOpen}
                className="h-full flex"
              >
                <CollapsibleContent className="h-full flex-shrink-0 w-[20%] min-w-[200px]">
                  <Card className="glass h-full border-0 rounded-l-xl">
                    <CardContent className="p-4 h-full overflow-hidden">
                      <PhaseSidebar 
                        phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} 
                        tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} 
                        onTaskStatusChange={handleTaskStatusChange}
                      />
                    </CardContent>
                  </Card>
                </CollapsibleContent>
                
                {/* Updated simple Notion-like collapse button */}
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-full px-0 py-0 flex items-center justify-center rounded-none transition-colors bg-transparent hover:bg-white/5 ${!isLeftPanelOpen ? 'rounded-l-xl' : ''}`}
                  >
                    <div className="w-5 h-10 flex items-center justify-center">
                      <ChevronLeft className={`w-4 h-4 text-white/60 transition-transform ${isLeftPanelOpen ? '' : 'rotate-180'}`} />
                    </div>
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
              
              {/* Second Panel - Chat with Co-founder */}
              <ResizablePanel defaultSize={isLeftPanelOpen ? 40 : 50} className="h-full">
                <Card className={`glass h-full border-0 ${!isLeftPanelOpen ? 'rounded-l-xl' : 'rounded-none'} overflow-hidden`}>
                  <CardContent className="p-4 h-full overflow-hidden">
                    <CofounderChat />
                  </CardContent>
                </Card>
              </ResizablePanel>
              
              {/* Enhanced resize handle between 2nd and 3rd panel */}
              <ResizableHandle withHandle className="bg-transparent transition-all duration-200 hover:bg-white/10 hover:scale-y-105">
                <div className="flex h-6 w-1.5 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] group-hover:scale-110">
                  <ChevronLeft className="h-3 w-3 text-white/60 transition-opacity" />
                  <ChevronRight className="h-3 w-3 -ml-3 text-white/60 transition-opacity" />
                </div>
              </ResizableHandle>
              
              {/* Third Panel - Canvas Output Area */}
              <ResizablePanel defaultSize={isLeftPanelOpen ? 40 : 50}>
                <Card className="glass h-full border-0 rounded-r-xl overflow-hidden">
                  <CardContent className="p-4 h-full overflow-hidden">
                    <div className="flex items-center pb-4 border-b border-white/10">
                      <ScrollText className="w-5 h-5 mr-2 text-white/70" />
                      <h3 className="text-lg font-semibold text-white">Canvas Output</h3>
                    </div>
                    <CanvasOutput />
                  </CardContent>
                </Card>
              </ResizablePanel>
            </div>
          </ResizablePanelGroup>
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
