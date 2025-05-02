
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit, Trash2, Download, WandSparkles, 
  FileText, Plus, MoreHorizontal, User, Link,
  Lightbulb, FileChartLine, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CanvasItemType = "persona" | "graph" | "insight" | "note" | "strategy";

interface CanvasItem {
  id: string;
  type: CanvasItemType;
  title: string;
  content: string;
  created: Date;
  category?: string;
  isEditing?: boolean;
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
      category: "Research",
      isEditing: false
    },
    {
      id: "2",
      type: "graph",
      title: "Market Opportunity",
      content: "75% of startups fail due to lack of product-market fit. Your solution addresses this critical gap.",
      created: new Date(),
      category: "Analysis",
      isEditing: false
    },
    {
      id: "3", 
      type: "insight",
      title: "Key Insight",
      content: "Focus on the problem validation phase before building any features to save time and resources.",
      created: new Date(),
      category: "Strategy",
      isEditing: false
    },
    {
      id: "4",
      type: "note",
      title: "Follow-up Action",
      content: "Schedule interviews with 5-10 potential users to validate our core value proposition hypothesis.",
      created: new Date(),
      category: "Tasks",
      isEditing: false
    },
    {
      id: "5",
      type: "strategy",
      title: "Go-to-Market Approach",
      content: "Target small startups first with free tier, then expand to medium businesses with premium features.",
      created: new Date(),
      category: "Planning",
      isEditing: false
    }
  ]);

  const [newItemAdded, setNewItemAdded] = useState<boolean>(false);
  const [currentEditItem, setCurrentEditItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ title: string; content: string }>({
    title: "",
    content: ""
  });
  const [hoverItemId, setHoverItemId] = useState<string | null>(null);
  
  // Demo function to add new item
  const demoAddNewItem = () => {
    const newItem: CanvasItem = {
      id: (canvasItems.length + 1).toString(),
      type: "insight",
      title: "New Market Insight",
      content: "Early adopters are more likely to provide detailed feedback if given exclusive access to new features.",
      created: new Date(),
      category: "Research",
      isEditing: false
    };
    
    setCanvasItems(prev => [newItem, ...prev]);
    setNewItemAdded(true);
    
    setTimeout(() => {
      setNewItemAdded(false);
    }, 2000);
  };

  const handleEditToggle = (id: string) => {
    const itemToEdit = canvasItems.find(item => item.id === id);
    if (!itemToEdit) return;

    setEditValues({
      title: itemToEdit.title,
      content: itemToEdit.content
    });
    
    setCurrentEditItem(id);
    
    setCanvasItems(prev => 
      prev.map(item => ({
        ...item,
        isEditing: item.id === id
      }))
    );
  };

  const handleSaveEdit = (id: string) => {
    setCanvasItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, title: editValues.title, content: editValues.content, isEditing: false } 
          : item
      )
    );
    
    setCurrentEditItem(null);
  };

  const handleDelete = (id: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== id));
  };

  const getIconForType = (type: CanvasItem["type"]) => {
    switch (type) {
      case "persona":
        return <User className="w-4 h-4 text-slate-400" />;
      case "graph":
        return <FileChartLine className="w-4 h-4 text-slate-400" />;
      case "insight":
        return <Lightbulb className="w-4 h-4 text-slate-400" />;
      case "note":
        return <FileText className="w-4 h-4 text-slate-400" />;
      case "strategy":
        return <FileChartLine className="w-4 h-4 text-slate-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Document header - sticky */}
      <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-opacity-95 bg-black/30 backdrop-blur-md py-2">
        <div>
          <h2 className="text-xl font-semibold text-white/90">Canvas Document</h2>
          <p className="text-sm text-white/60">
            Business insights and startup assets
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
          onClick={demoAddNewItem}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      {/* Document body - scrollable area */}
      <ScrollArea className="h-full pr-4">
        <div className="space-y-8 pb-8">
          <AnimatePresence>
            {canvasItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: newItemAdded && item.id === canvasItems[0].id ? [1, 1.02, 1] : 1 
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/10 pb-8"
                onMouseEnter={() => setHoverItemId(item.id)}
                onMouseLeave={() => setHoverItemId(null)}
              >
                <div className="relative">
                  {/* Type indicator and metadata - subtle at top */}
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    {getIconForType(item.type)}
                    <span className="uppercase tracking-wide">
                      {item.type}
                    </span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <span>{item.category}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{item.created.toLocaleDateString()}</span>
                  </div>
                  
                  {/* Title - larger, bolder */}
                  {item.isEditing ? (
                    <Input 
                      value={editValues.title}
                      onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-semibold mb-3 bg-white/5 border-white/20 text-white focus-visible:ring-white/20"
                      placeholder="Enter title..."
                    />
                  ) : (
                    <h3 className="text-lg font-semibold mb-3 text-white/90">{item.title}</h3>
                  )}
                  
                  {/* Content - regular paragraph */}
                  {item.isEditing ? (
                    <Textarea
                      value={editValues.content}
                      onChange={(e) => setEditValues(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-24 text-base leading-relaxed bg-white/5 border-white/20 text-white focus-visible:ring-white/20"
                      placeholder="Enter content..."
                    />
                  ) : (
                    <p className="text-base leading-relaxed text-white/80">{item.content}</p>
                  )}
                  
                  {/* Action buttons - only visible on hover or when editing */}
                  <AnimatePresence>
                    {(hoverItemId === item.id || item.isEditing) && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 right-0 flex items-center gap-1"
                      >
                        {item.isEditing ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSaveEdit(item.id)}
                            className="text-xs h-7 px-2 bg-white/10 hover:bg-white/20 text-white"
                          >
                            Save
                          </Button>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                  onClick={() => handleEditToggle(item.id)}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                >
                                  <WandSparkles className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>AI Rewrite</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {/* Empty state */}
            {canvasItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <FileText className="w-7 h-7 text-white/40" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No items yet</h3>
                <p className="text-white/60 mb-4">Start a conversation with your co-founder to generate insights</p>
                <Button 
                  onClick={demoAddNewItem} 
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sample Item
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      {/* Notification for new items - animated floating notification */}
      <AnimatePresence>
        {newItemAdded && (
          <motion.div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
              <span className="text-sm text-white">New item added ✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
