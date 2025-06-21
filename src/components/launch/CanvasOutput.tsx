import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CanvasOutputProps {
  className?: string;
}

export default function CanvasOutput({
  className
}: CanvasOutputProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Document header - responsive padding */}
      <div className="flex items-center justify-end mb-4 lg:mb-6 sticky top-0 z-10 bg-opacity-95 backdrop-blur-md py-2 bg-none px-1 lg:px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 lg:h-8 px-2 lg:px-3 text-xs lg:text-sm text-white/70 hover:text-white hover:bg-white/10"
        >
          <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
      
      {/* Document body - responsive content */}
      <ScrollArea className="h-full pr-2 lg:pr-4">
        <div className="space-y-4 lg:space-y-6 pb-6 lg:pb-8 text-white/80">
          <div>
            <h4 className="text-sm lg:text-base font-medium mb-2 lg:mb-3 text-white/70">Key points:</h4>
            <ul className="list-disc pl-4 lg:pl-6 space-y-1 lg:space-y-2 mb-4 lg:mb-6">
              <li className="text-xs lg:text-sm">Problem definition and validation</li>
              <li className="text-xs lg:text-sm">Target audience analysis</li>
              <li className="text-xs lg:text-sm">Competitive landscape</li>
              <li className="text-xs lg:text-sm">Value proposition</li>
              <li className="text-xs lg:text-sm">Business model development</li>
            </ul>
            
            <p className="italic text-white/60 text-xs lg:text-sm">
              Start a conversation with your co-founder AI to generate insights and build your canvas.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}