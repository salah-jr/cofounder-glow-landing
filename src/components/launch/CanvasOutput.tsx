
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit, Trash2, Image, Lightbulb, FileChartLine, FileText, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CanvasItemType = "persona" | "graph" | "insight" | "note" | "strategy";

interface CanvasItem {
  id: string;
  type: CanvasItemType;
  title: string;
  content: string;
  created: Date;
  category?: string;
}

interface CanvasOutputProps {
  className?: string;
}

export default function CanvasOutput({ className }: CanvasOutputProps) {
  // Sample canvas items - in a real app, these would come from context/state management
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    {
      id: "1",
      type: "persona",
      title: "Primary User Persona",
      content: "25-34 years old startup founders looking for technical guidance and validation.",
      created: new Date(),
      category: "Research"
    },
    {
      id: "2",
      type: "graph",
      title: "Market Opportunity",
      content: "75% of startups fail due to lack of product-market fit. Your solution addresses this critical gap.",
      created: new Date(),
      category: "Analysis"
    },
    {
      id: "3", 
      type: "insight",
      title: "Key Insight",
      content: "Focus on the problem validation phase before building any features to save time and resources.",
      created: new Date(),
      category: "Strategy"
    },
    {
      id: "4",
      type: "note",
      title: "Follow-up Action",
      content: "Schedule interviews with 5-10 potential users to validate our core value proposition hypothesis.",
      created: new Date(),
      category: "Tasks"
    },
    {
      id: "5",
      type: "strategy",
      title: "Go-to-Market Approach",
      content: "Target small startups first with free tier, then expand to medium businesses with premium features.",
      created: new Date(),
      category: "Planning"
    }
  ]);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [newItemAdded, setNewItemAdded] = useState<boolean>(false);
  
  // Mock function to demonstrate new item animation
  const demoAddNewItem = () => {
    const newItem: CanvasItem = {
      id: (canvasItems.length + 1).toString(),
      type: "insight",
      title: "New Market Insight",
      content: "Early adopters are more likely to provide detailed feedback if given exclusive access to new features.",
      created: new Date(),
      category: "Research"
    };
    
    setCanvasItems(prev => [newItem, ...prev]);
    setNewItemAdded(true);
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setNewItemAdded(false);
    }, 2000);
  };

  const handleEdit = (id: string) => {
    // This would open an editor in a real implementation
    console.log("Editing item:", id);
  };

  const handleDelete = (id: string) => {
    // Remove the item from the array
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDownload = (id: string) => {
    // This would trigger a download in a real implementation
    console.log("Downloading item:", id);
  };

  const getIconForType = (type: CanvasItem["type"]) => {
    switch (type) {
      case "persona":
        return <Image className="w-5 h-5 text-violet-400" />;
      case "graph":
        return <FileChartLine className="w-5 h-5 text-cyan-400" />;
      case "insight":
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case "note":
        return <FileText className="w-5 h-5 text-white" />;
      case "strategy":
        return <FileChartLine className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getBadgeColorForType = (type: CanvasItem["type"]) => {
    switch (type) {
      case "persona":
        return "bg-violet-500/20 text-violet-300 border-violet-400/30";
      case "graph":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-400/30";
      case "insight":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "note":
        return "bg-white/10 text-white/70 border-white/20";
      case "strategy":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  // Group items by category for board view
  const groupedItems = canvasItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CanvasItem[]>);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/60">
          Outputs from your co-founder chat will appear here
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-white/70 hover:text-white"
            onClick={demoAddNewItem}
          >
            Demo New Item
          </Button>
          <div className="flex items-center bg-white/5 rounded-md p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-7 w-7 p-0 rounded-sm",
                viewMode === "list" ? "bg-white/10" : ""
              )}
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">List View</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-7 w-7 p-0 rounded-sm",
                viewMode === "board" ? "bg-white/10" : ""
              )}
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Board View</span>
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <ScrollArea className="flex-1 pr-4">
          <AnimatePresence>
            {canvasItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: newItemAdded && index === 0 ? [1, 1.05, 1] : 1 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className="w-full"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                drag // Enable drag functionality
                dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                dragElastic={0.1}
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300 border-white/10 mb-3",
                  hoveredCard === item.id ? 
                    "glass shadow-lg transform-gpu translate-y-[-2px] scale-[1.01] shadow-[0_0_15px_rgba(155,135,245,0.2)]" : 
                    "bg-white/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HoverCard openDelay={300} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                              hoveredCard === item.id && "animate-pulse-subtle"
                            )}>
                              {getIconForType(item.type)}
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="glass p-2 backdrop-blur-md bg-black/60 border-white/10 w-48">
                            <p className="text-xs text-white/80">
                              {item.type === "persona" && "User persona representing your target audience"}
                              {item.type === "graph" && "Visual data representation of market trends"}
                              {item.type === "insight" && "Key business insight from analysis"}
                              {item.type === "note" && "General note or comment"}
                              {item.type === "strategy" && "Strategic planning document"}
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                        <div>
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn(
                              "px-1.5 py-0 text-[10px] border",
                              getBadgeColorForType(item.type)
                            )}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                            {item.category && (
                              <Badge variant="ghost" className="px-1.5 py-0 text-[10px]">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {hoveredCard === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1"
                        >
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 rounded-full bg-white/5 hover:bg-white/10"
                                onClick={() => handleEdit(item.id)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="glass backdrop-blur-md bg-black/40 border-white/10">
                              <p className="text-xs">Edit</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 rounded-full bg-white/5 hover:bg-white/10"
                                onClick={() => handleDownload(item.id)}
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="glass backdrop-blur-md bg-black/40 border-white/10">
                              <p className="text-xs">Download</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 rounded-full bg-white/5 hover:bg-red-500/20"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="glass backdrop-blur-md bg-black/40 border-white/10">
                              <p className="text-xs">Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/70">{item.content}</p>
                    
                    <div className="mt-2 text-xs text-white/40 flex justify-end items-center">
                      <span>{item.created.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      ) : (
        // Board View (Kanban-style)
        <ScrollArea className="flex-1 pr-2">
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="min-w-[280px] bg-white/5 rounded-lg p-3">
                <div className="mb-3 sticky top-0 bg-white/5 backdrop-blur-sm z-10 rounded-md px-3 py-2">
                  <h3 className="font-medium text-white/90 text-sm">{category}</h3>
                  <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          y: newItemAdded && index === 0 && category === items[0].category ? [20, 0] : 0
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="w-full"
                        drag
                        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <Card className={cn(
                          "overflow-hidden transition-all duration-300 border-white/10",
                          hoveredCard === item.id ? 
                            "glass shadow-lg shadow-[0_0_12px_rgba(155,135,245,0.15)] transform-gpu translate-y-[-2px]" : 
                            "bg-white/5"
                        )}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center",
                                )}>
                                  {getIconForType(item.type)}
                                </div>
                                <h4 className="font-medium text-sm text-white">{item.title}</h4>
                              </div>
                              
                              <Badge className={cn(
                                "px-1.5 py-0 text-[10px] border",
                                getBadgeColorForType(item.type)
                              )}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-white/70 line-clamp-2">{item.content}</p>
                            
                            {hoveredCard === item.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end mt-2 gap-1"
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 rounded-full bg-white/5"
                                  onClick={() => handleEdit(item.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 rounded-full bg-white/5"
                                  onClick={() => handleDownload(item.id)}
                                >
                                  <Download className="h-3 w-3" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 rounded-full bg-white/5 hover:bg-red-500/20"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Sparkle effect for new items */}
      <AnimatePresence>
        {newItemAdded && (
          <motion.div 
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
              <motion.div 
                className="flex items-center justify-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: -30, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <span className="px-3 py-1 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full text-white text-xs font-medium">
                  New item added to canvas! ✨
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
