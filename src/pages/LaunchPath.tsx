
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RoadmapProgress from "@/components/launch/RoadmapProgress";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("idea");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

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
            {/* First Panel */}
            <ResizablePanel defaultSize={25} className="glass rounded-l-xl">
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full">
                  <h3 className="text-xl font-semibold mb-4">Resources</h3>
                  <div className="text-white/70">
                    <p className="mb-2">Access tools and guides to help you in your current phase.</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                      <li>Startup validation checklist</li>
                      <li>Market research templates</li>
                      <li>Business model canvas</li>
                      <li>User persona builder</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Second Panel */}
            <ResizablePanel defaultSize={50}>
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full">
                  <h3 className="text-xl font-semibold mb-4">Workspace</h3>
                  <div className="bg-white/5 p-6 rounded-lg h-[calc(100%-3rem)] border border-white/10">
                    <p className="text-white/70">
                      This is your main workspace where you'll document your progress and 
                      complete tasks for each phase of your startup journey.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Third Panel */}
            <ResizablePanel defaultSize={25} className="glass rounded-r-xl">
              <Card className="glass h-full border-0 rounded-none">
                <CardContent className="p-4 h-full">
                  <h3 className="text-xl font-semibold mb-4">Tasks</h3>
                  <div className="text-white/70">
                    <p className="mb-4">Complete these tasks to progress to the next phase:</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-2"></div>
                        <span>Define your value proposition</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-2"></div>
                        <span>Identify target audience</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-2"></div>
                        <span>Research competitors</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-2"></div>
                        <span>Outline key features</span>
                      </div>
                    </div>
                  </div>
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
