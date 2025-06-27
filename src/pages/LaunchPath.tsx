import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PhaseSidebar from "@/components/launch/PhaseSidebar";
import CofounderChat, { CofounderChatRef } from "@/components/launch/CofounderChat";
import CanvasOutput from "@/components/launch/CanvasOutput";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { TaskStatus } from "@/components/launch/PhaseTask";
import { ChevronLeft, ChevronRight, Menu, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { useAuth } from "@/context/AuthContext";

// Define the main phases
const mainPhases = [
  { id: "shape", label: "Shape Your Idea" },
  { id: "validate", label: "Validate the Idea and the Market" },
  { id: "build", label: "Build the Business" },
  { id: "mvp", label: "Plan the MVP" },
  { id: "pitch", label: "Pitch Your Idea" }
];

// Enhanced tasks data with the new structure
const initialPhaseTasks = {
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
      tooltip: "Calculate resources and capital needed to build and operate your business"
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
      tooltip: "Create user interface elements and interaction prompts"
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
      tooltip: "Develop key messages and materials for market launch"
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

interface ProjectData {
  id: string
  idea: string
  created_at: string
  questions: Array<{
    question_text: string
    options: string[]
    selected_answer: string
  }>
  suggestions: Array<{
    name: string
    value: string
  }>
}

const LaunchPath: React.FC = () => {
  // State for managing the roadmap progress
  const [currentPhase, setCurrentPhase] = useState("shape");
  const [currentStepId, setCurrentStepId] = useState("shape-1");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [allPhases, setAllPhases] = useState(initialPhaseTasks);

  // State for the collapsible left panel (desktop only)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  
  // State for mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // State for mobile tab switching
  const [activeTab, setActiveTab] = useState("chat");

  // Reference to the chat component for resetting
  const chatRef = useRef<CofounderChatRef>(null);

  // Responsive breakpoint detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Get location state for project ID
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle project ID from navigation state and load project data
  useEffect(() => {
    const state = location.state as { projectId?: string } | null;
    if (state?.projectId) {
      setProjectId(state.projectId);
      console.log('Received project ID:', state.projectId);
      loadProjectData(state.projectId);
    }
  }, [location.state]);

  // Load project data from Supabase
  const loadProjectData = async (projectId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/load-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProjectData(data.project);
          console.log('Project data loaded:', data.project);
        }
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  // Handle complete phase
  const handleCompletePhase = () => {
    const currentPhaseIndex = mainPhases.findIndex(p => p.id === currentPhase);
    
    if (currentPhaseIndex < mainPhases.length - 1) {
      // Mark all tasks in current phase as complete
      setAllPhases(prev => {
        const updated = { ...prev };
        updated[currentPhase as keyof typeof updated] = updated[currentPhase as keyof typeof updated].map(task => ({
          ...task,
          status: "complete" as TaskStatus
        }));
        return updated;
      });

      // Move to next phase
      const nextPhase = mainPhases[currentPhaseIndex + 1];
      setCurrentPhase(nextPhase.id);
      setCurrentStepId(`${nextPhase.id}-1`);
      
      // Mark first task of new phase as in-progress
      setAllPhases(prev => {
        const updated = { ...prev };
        const nextPhaseTasks = updated[nextPhase.id as keyof typeof updated];
        if (nextPhaseTasks && nextPhaseTasks.length > 0) {
          updated[nextPhase.id as keyof typeof updated] = nextPhaseTasks.map((task, index) => ({
            ...task,
            status: index === 0 ? "in-progress" as TaskStatus : task.status
          }));
        }
        return updated;
      });

      // Add completed phase to list
      setCompletedPhases(prev => [...prev, currentPhase]);
      
      // Reset chat for new phase
      handleResetChat();
    }
  };

  // Handle phase click (for navigation to completed phases)
  const handlePhaseClick = (phaseId: string) => {
    console.log(`Phase ${phaseId} clicked`);
    
    // Update current phase
    setCurrentPhase(phaseId);
    
    // Set current step to the first step of the new phase
    const firstStepId = `${phaseId}-1`;
    setCurrentStepId(firstStepId);
    
    // Reset chat when switching phases
    handleResetChat();
    
    // Close mobile sidebar after selection
    setIsMobileSidebarOpen(false);
  };

  // Handle task status change (now just for visual feedback, not navigation)
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus} - no navigation allowed`);
    // Update task status in state for visual feedback only
    setAllPhases(prev => {
      const updated = { ...prev };
      const phaseId = taskId.split('-')[0];
      const phaseTasks = updated[phaseId as keyof typeof updated];
      if (phaseTasks) {
        updated[phaseId as keyof typeof updated] = phaseTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      }
      return updated;
    });
  };

  // Handle step click (removed navigation functionality)
  const handleStepClick = (stepId: string) => {
    console.log(`Step ${stepId} clicked - no navigation allowed`);
    // Close mobile sidebar after selection
    setIsMobileSidebarOpen(false);
  };

  // Toggle left panel collapse (desktop only)
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

  // Check if current phase can be completed
  const canCompletePhase = () => {
    const currentPhaseIndex = mainPhases.findIndex(p => p.id === currentPhase);
    return currentPhaseIndex < mainPhases.length - 1;
  };

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[350px] bg-[#030303]/95 backdrop-blur-xl border-white/10 p-0"
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">
              Startup Phases
            </h2>
            <p className="text-sm text-white/60">Phase {getCurrentPhaseNumber()} of {mainPhases.length}</p>
            {projectId && (
              <p className="text-xs text-white/40 mt-1">Project: {projectId.substring(0, 8)}...</p>
            )}
          </div>
          <div className="flex-1 p-4">
            <PhaseSidebar 
              allPhases={allPhases}
              mainPhases={mainPhases}
              currentPhase={currentPhase}
              currentStepId={currentStepId}
              completedPhases={completedPhases}
              onTaskStatusChange={handleTaskStatusChange}
              onStepClick={handleStepClick}
              onResetChat={handleResetChat}
              onCompletePhase={handleCompletePhase}
              onPhaseClick={handlePhaseClick}
              canCompletePhase={canCompletePhase()}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="flex h-full rounded-xl animate-fade-in">
      {/* Left Sidebar with Phase Tasks */}
      <div className="relative h-full">
        {/* Collapse button */}
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
          isLeftPanelCollapsed ? "w-0 opacity-0" : "w-[280px] lg:w-[320px] xl:w-[350px] opacity-100"
        )}>
          <Card className="glass h-full rounded-xl overflow-hidden">
            <CardContent className="p-4 h-full">
              <PhaseSidebar 
                allPhases={allPhases}
                mainPhases={mainPhases}
                currentPhase={currentPhase}
                currentStepId={currentStepId}
                completedPhases={completedPhases}
                onTaskStatusChange={handleTaskStatusChange}
                onStepClick={handleStepClick}
                onResetChat={handleResetChat}
                onCompletePhase={handleCompletePhase}
                onPhaseClick={handlePhaseClick}
                canCompletePhase={canCompletePhase()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side panels container */}
      <div className={cn(
        "flex-grow transition-all duration-300",
        isLeftPanelCollapsed ? "ml-8" : "ml-4"
      )}>
        {/* Resizable panels for desktop with faster resize */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat Panel */}
          <ResizablePanel 
            defaultSize={isTablet ? 60 : 50} 
            minSize={30} 
            maxSize={70} 
            className="transition-all duration-200 ease-in-out"
          >
            <Card className="glass h-full rounded-xl overflow-hidden">
              <CardContent className="p-4 h-full overflow-hidden">
                <CofounderChat 
                  ref={chatRef} 
                  currentPhaseId={currentPhase}
                  currentStepId={currentStepId}
                  phaseNumber={getCurrentPhaseNumber()}
                  stepNumber={getCurrentStepNumber()}
                  projectData={projectData}
                />
              </CardContent>
            </Card>
          </ResizablePanel>
          
          {/* Resize Handle - faster and no hover effects */}
          <ResizableHandle withHandle className="bg-transparent">
            <div className="flex h-6 w-1.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <ChevronLeft className="h-3 w-3 text-white/60" />
              <ChevronRight className="h-3 w-3 -ml-3 text-white/60" />
            </div>
          </ResizableHandle>
          
          {/* Canvas Panel */}
          <ResizablePanel 
            defaultSize={isTablet ? 40 : 50} 
            minSize={30} 
            maxSize={70} 
            className="transition-all duration-200 ease-in-out"
          >
            <Card className="glass h-full rounded-xl overflow-hidden">
              <CardContent className="p-4 h-full overflow-hidden">
                <CanvasOutput 
                  currentPhase={currentPhase}
                  projectData={projectData}
                />
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );

  // Mobile Layout with Tabs
  const MobileLayout = () => (
    <div className="h-full flex flex-col">
      <MobileSidebar />
      
      {/* Mobile Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-lg mx-4 mb-4">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="canvas" 
            className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Canvas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="flex-1 px-4 pb-4">
          <TabsContent value="chat" className="h-full m-0">
            <Card className="glass h-full rounded-xl overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full overflow-hidden">
                <CofounderChat 
                  ref={chatRef} 
                  currentPhaseId={currentPhase}
                  currentStepId={currentStepId}
                  phaseNumber={getCurrentPhaseNumber()}
                  stepNumber={getCurrentStepNumber()}
                  projectData={projectData}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="canvas" className="h-full m-0">
            <Card className="glass h-full rounded-xl overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full overflow-hidden">
                <CanvasOutput 
                  currentPhase={currentPhase}
                  projectData={projectData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden text-white relative">
      {/* Full-page background matching home page */}
      <div className="fixed inset-0 -z-10">
        <HeroGeometric
          badge=""
          title1=""
          title2=""
          subtitle=""
          fullPage={true}
          backgroundOnly={true}
        />
      </div>
      
      {/* Navbar - responsive padding */}
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <Navbar />
      </div>
      
      {/* Main content area - responsive padding */}
      <div className="w-full px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 flex-grow overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="h-full"
        >
          {/* Conditional Layout based on screen size */}
          {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </motion.div>
      </div>
    </div>
  );
};

export default LaunchPath;