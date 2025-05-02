
import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CanvasOutputProps {
  className?: string;
}

export default function CanvasOutput({ className }: CanvasOutputProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Document header - sticky with just the download button */}
      <div className="flex items-center justify-end mb-6 sticky top-0 z-10 bg-opacity-95 bg-black/30 backdrop-blur-md py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
      
      {/* Document body - scrollable area with simple content */}
      <ScrollArea className="h-full pr-4">
        <div className="space-y-6 pb-8 text-white/80">
          <div>
            <h4 className="text-base font-medium mb-2 text-white/70">Key points:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Problem definition and validation</li>
              <li>Target audience analysis</li>
              <li>Competitive landscape</li>
              <li>Value proposition</li>
              <li>Business model development</li>
            </ul>
            
            <p className="italic text-white/60 text-sm">
              Start a conversation with your co-founder AI to generate insights and build your canvas.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
