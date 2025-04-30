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
  "idea": [
    { id: "task1", title: "Define your value proposition", status: "in-progress" as TaskStatus },
    { id: "task2", title: "Identify target audience", status: "pending" as TaskStatus },
    { id: "task3", title: "Research competitors", status: "pending" as TaskStatus },
    { id: "task4", title: "Outline key features", status: "pending" as TaskStatus },
    { id: "task5", title: "Create product vision", status: "pending" as TaskStatus },
  ],
  "validation": [
    { id: "task6", title: "Create validation hypothesis", status: "pending" as TaskStatus },
    { id: "task7", title: "Design customer interviews", status: "pending" as TaskStatus },
    { id: "task8", title: "Analyze market demand", status: "pending" as TaskStatus },
    { id: "task9", title: "Gather initial feedback", status: "pending" as TaskStatus },
  ],
  // Other phases would have their own tasks
};

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("idea");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  
  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // This is just a placeholder for future functionality
    console.log(`Task ${taskId} status changed to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Top horizontal bar - Roadmap Progress */}
          <div className="glass p-6 rounded-xl border border-white/10 animate-fade-in">
            <RoadmapProgress 
              currentPhase={currentPhase} 
              completedPhases={completedPhases} 
            />
          </div>
          
          {/* 4-compartment layout using ResizablePanel */}
          <ResizablePanelGroup 
            direction="horizontal" 
            className="min-h-[500px] rounded-xl animate-fade-in"
          >
            {/* First Panel - Left Sidebar with Phase Tasks */}
            <ResizablePanel defaultSize={20} className="glass rounded-l-xl">
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full">
                  <PhaseSidebar 
                    phase={currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} 
                    tasks={phaseTasks[currentPhase as keyof typeof phaseTasks] || []}
                    onTaskStatusChange={handleTaskStatusChange}
                  />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Second Panel - Chat with Co-founder */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full">
                  <CofounderChat />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Third Panel - Canvas Output Area */}
            <ResizablePanel defaultSize={40}>
              <Card className="glass h-full border-0 rounded-r-xl">
                <CardContent className="p-4 h-full">
                  <CanvasOutput />
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </motion.div>
      </div>
    </div>
  );
};

export default LaunchPath;
