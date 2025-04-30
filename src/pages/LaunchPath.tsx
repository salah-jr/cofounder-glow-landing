
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
  return <div className="h-screen overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#000000e6] text-white">
      <Navbar />
      
      {/* Added a separate container for the progress bar with more spacing */}
      <div className="w-full px-4 pt-24 pb-4">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="space-y-6">
          {/* Top horizontal bar - Roadmap Progress */}
          <div className="glass p-4 rounded-xl border border-white/10 animate-fade-in px-[15px] py-[7px]">
            <RoadmapProgress currentPhase={currentPhase} completedPhases={completedPhases} />
          </div>
        </motion.div>
      </div>
      
      {/* Main content area - now separated from the progress bar */}
      <div className="w-full px-4 pb-8 h-[calc(100vh-190px)] overflow-hidden">
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="h-full">
          {/* 4-compartment layout using ResizablePanel */}
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl animate-fade-in">
            {/* First Panel - Left Sidebar with Phase Tasks - Now with fixed size */}
            <ResizablePanel defaultSize={20} minSize={20} maxSize={20} className="glass rounded-l-xl">
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full overflow-hidden">
                  <PhaseSidebar phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []} onTaskStatusChange={handleTaskStatusChange} />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            {/* Hidden resize handle between 1st and 2nd panel */}
            <ResizableHandle hidden={true} />
            
            {/* Second Panel - Chat with Co-founder */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-none overflow-hidden">
                <CardContent className="p-4 h-full overflow-hidden">
                  <CofounderChat />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            {/* Visible resize handle between 2nd and 3rd panel */}
            <ResizableHandle withHandle />
            
            {/* Third Panel - Canvas Output Area */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-r-xl overflow-hidden">
                <CardContent className="p-4 h-full overflow-hidden">
                  <CanvasOutput />
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </motion.div>
      </div>

      {/* Background gradient circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9b87f5]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EAEDB]/20 rounded-full blur-3xl" />
      </div>
    </div>;
};
export default LaunchPath;
