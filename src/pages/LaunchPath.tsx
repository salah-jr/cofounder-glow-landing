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

// Sample tasks data
const phaseTasks = {
  "idea": [{
    id: "task1",
    title: "Define your value proposition",
    status: "in-progress" as TaskStatus
  }, {
    id: "task2",
    title: "Identify target audience",
    status: "pending" as TaskStatus
  }, {
    id: "task3",
    title: "Research competitors",
    status: "pending" as TaskStatus
  }, {
    id: "task4",
    title: "Outline key features",
    status: "pending" as TaskStatus
  }, {
    id: "task5",
    title: "Create product vision",
    status: "pending" as TaskStatus
  }],
  "validation": [{
    id: "task6",
    title: "Create validation hypothesis",
    status: "pending" as TaskStatus
  }, {
    id: "task7",
    title: "Design customer interviews",
    status: "pending" as TaskStatus
  }, {
    id: "task8",
    title: "Analyze market demand",
    status: "pending" as TaskStatus
  }, {
    id: "task9",
    title: "Gather initial feedback",
    status: "pending" as TaskStatus
  }]
  // Other phases would have their own tasks
};

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("idea");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // Implement actual status change logic here
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      {/* Fixed navbar at top */}
      <Navbar />
      
      {/* Progress bar section with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-4 pt-10 pb-6 flex-shrink-0 z-10"
      >
        <div className="glass rounded-xl border border-white/10 shadow-lg shadow-[#9b87f5]/5 backdrop-blur-lg p-4">
          <RoadmapProgress currentPhase={currentPhase} completedPhases={completedPhases} />
        </div>
      </motion.div>
      
      {/* Main content area with modern styling */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full px-4 pb-8 flex-grow overflow-hidden"
      >
        <div className="h-full">
          {/* 3-compartment layout using ResizablePanel */}
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full rounded-xl animate-fade-in"
          >
            {/* First Panel - Left Sidebar with Phase Tasks */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={30} 
              className="glass rounded-l-xl overflow-hidden border-r border-white/5 shadow-lg shadow-[#9b87f5]/10"
            >
              <Card className="glass h-full border-0 rounded-none overflow-hidden backdrop-blur-lg">
                <CardContent className="p-4 h-full overflow-hidden">
                  <PhaseSidebar 
                    phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} 
                    tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} 
                    onTaskStatusChange={handleTaskStatusChange} 
                  />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            {/* Resizable handle with custom styling */}
            <ResizableHandle 
              withHandle 
              className="bg-white/5 hover:bg-white/10 transition-colors" 
            />
            
            {/* Second Panel - Chat with Co-founder */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-none overflow-hidden backdrop-blur-lg">
                <CardContent className="p-4 h-full overflow-hidden">
                  <CofounderChat />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            {/* Visible resize handle between 2nd and 3rd panel */}
            <ResizableHandle 
              withHandle 
              className="bg-white/5 hover:bg-white/10 transition-colors"
            />
            
            {/* Third Panel - Canvas Output Area */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-r-xl overflow-hidden backdrop-blur-lg shadow-lg shadow-[#9b87f5]/10">
                <CardContent className="p-4 h-full overflow-hidden">
                  <CanvasOutput />
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </motion.div>

      {/* Enhanced background gradient circles with animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 10, 0],
            y: [0, 15, 0],
          }} 
          transition={{ 
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, -15, 0],
            y: [0, -10, 0],
          }} 
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1]
          }} 
          transition={{ 
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-[#9b87f5]/10 rounded-full blur-3xl" 
        />
      </div>
    </div>
  );
};

export default LaunchPath;
