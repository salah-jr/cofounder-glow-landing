
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Edit, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CanvasItem {
  id: string;
  type: "persona" | "graph" | "note";
  title: string;
  content: string;
  created: Date;
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
      created: new Date()
    },
    {
      id: "2",
      type: "graph",
      title: "Market Opportunity",
      content: "75% of startups fail due to lack of product-market fit. Your solution addresses this critical gap.",
      created: new Date()
    },
    {
      id: "3", 
      type: "note",
      title: "Key Insight",
      content: "Focus on the problem validation phase before building any features to save time and resources.",
      created: new Date()
    }
  ]);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    // This would open an editor in a real implementation
    console.log("Editing item:", id);
  };

  const handleDownload = (id: string) => {
    // This would trigger a download in a real implementation
    console.log("Downloading item:", id);
  };

  const getIconForType = (type: CanvasItem["type"]) => {
    switch (type) {
      case "persona":
        return <FileImage className="w-5 h-5 text-[#9b87f5]" />;
      case "graph":
        return <FileImage className="w-5 h-5 text-[#1EAEDB]" />;
      case "note":
        return <FileImage className="w-5 h-5 text-white" />;
      default:
        return <FileImage className="w-5 h-5" />;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <h3 className="text-xl font-semibold mb-4">Canvas Outputs</h3>
      <p className="text-sm text-white/60 mb-4">
        Outputs from your co-founder chat will appear here. Edit or download them as needed.
      </p>
      
      <ScrollArea className="flex-1">
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-4 pr-4">
            {canvasItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300 border-white/10",
                  hoveredCard === item.id ? "glass shadow-lg shadow-[#9b87f5]/20" : "bg-white/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIconForType(item.type)}
                        <h4 className="font-medium text-white">{item.title}</h4>
                      </div>
                      {hoveredCard === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1"
                        >
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => handleEdit(item.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => handleDownload(item.id)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm text-white/70">{item.content}</p>
                    <div className="mt-2 text-xs text-white/50 flex justify-between items-center">
                      <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                      <span>{item.created.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
