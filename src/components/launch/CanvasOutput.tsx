
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit, Trash2, Save, Image, Lightbulb, FileChartLine, 
  FileText, Plus, MoreHorizontal, User, Link 
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
        return <User className="w-5 h-5 text-violet-500" />;
      case "graph":
        return <FileChartLine className="w-5 h-5 text-sky-500" />;
      case "insight":
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case "note":
        return <FileText className="w-5 h-5 text-neutral-700" />;
      case "strategy":
        return <FileChartLine className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getBadgeColorForType = (type: CanvasItem["type"]) => {
    switch (type) {
      case "persona":
        return "bg-violet-100 text-violet-700 border-violet-200";
      case "graph":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "insight":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "note":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
      case "strategy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/80">
          Canvas outputs are stored and can be edited
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-white/70 hover:text-white"
            onClick={demoAddNewItem}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
      
      {/* Document-style canvas with light background */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-lg relative">
        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-xl -z-10" />
        
        <ScrollArea className="h-full bg-white/[0.98] rounded-xl shadow-inner">
          <div className="p-6 md:p-8 min-h-full">
            <AnimatePresence>
              {/* Canvas title */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-neutral-800">Canvas Document</h2>
                <p className="text-neutral-500 text-sm">Your co-founder insights and business assets</p>
              </div>
              
              {/* Canvas items */}
              {canvasItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: newItemAdded && item.id === canvasItems[0].id ? [1, 1.02, 1] : 1 
                  }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "mb-6 pb-6 border-b border-neutral-200 group",
                    item.isEditing ? "bg-neutral-50 p-4 rounded-lg -mx-4" : ""
                  )}
                >
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-100">
                          {getIconForType(item.type)}
                        </div>
                        
                        {item.isEditing ? (
                          <Input 
                            value={editValues.title}
                            onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                            className="font-medium text-neutral-800 border-neutral-300 focus-visible:ring-neutral-400"
                            placeholder="Enter title..."
                          />
                        ) : (
                          <h3 className="font-medium text-neutral-800">{item.title}</h3>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.isEditing ? (
                          <Button 
                            variant="default" 
                            size="sm"
                            className="h-8 bg-neutral-800 hover:bg-neutral-700 text-white"
                            onClick={() => handleSaveEdit(item.id)}
                          >
                            <Save className="h-3.5 w-3.5 mr-1" />
                            Save
                          </Button>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 rounded-full bg-neutral-100 hover:bg-neutral-200"
                                  onClick={() => handleEditToggle(item.id)}
                                >
                                  <Edit className="h-3.5 w-3.5 text-neutral-700" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 rounded-full bg-neutral-100 hover:bg-neutral-200"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5 text-neutral-700" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={cn(
                        "px-1.5 py-0.5 text-xs border",
                        getBadgeColorForType(item.type)
                      )}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                      
                      {item.category && (
                        <Badge variant="outline" className="px-1.5 py-0.5 text-xs border-neutral-200 text-neutral-600">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    
                    {item.isEditing ? (
                      <Textarea
                        value={editValues.content}
                        onChange={(e) => setEditValues(prev => ({ ...prev, content: e.target.value }))}
                        className="min-h-24 text-neutral-700 border-neutral-300 focus-visible:ring-neutral-400"
                        placeholder="Enter content..."
                      />
                    ) : (
                      <p className="text-neutral-700 whitespace-pre-wrap">{item.content}</p>
                    )}
                    
                    <div className="mt-3 text-xs text-neutral-400 flex justify-end items-center">
                      <span>Last updated: {item.created.toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Empty state */}
            {canvasItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">No items yet</h3>
                <p className="text-neutral-500 mb-4">Start a conversation with your co-founder to generate insights</p>
                <Button 
                  onClick={demoAddNewItem} 
                  variant="outline"
                  className="bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sample Item
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
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
                <span className="px-3 py-1 bg-neutral-800 rounded-full text-white text-xs font-medium shadow-lg">
                  New item added! ✨
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
