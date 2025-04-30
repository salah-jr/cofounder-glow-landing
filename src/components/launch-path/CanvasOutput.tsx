
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface CanvasOutputProps {
  outputs: any[];
}

export const CanvasOutput = ({ outputs }: CanvasOutputProps) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Show a welcome message if no outputs yet
  if (outputs.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center h-[calc(100vh-240px)] shadow-[0_8px_32px_rgba(155,135,245,0.1)]">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <rect width="18" height="10" x="3" y="11" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Canvas Output</h3>
        <p className="text-white/70 text-center">
          As you work through the steps with your AI Co-founder, your outputs will appear here. 
        </p>
        <p className="text-white/50 text-center text-sm mt-4">
          Complete steps to generate customer profiles, business models, and more.
        </p>
      </div>
    );
  }

  // Render actual outputs
  const renderOutputCard = (output: any, index: number) => {
    if (output.type === 'customerCard') {
      return (
        <Card key={index} className="bg-white/10 border-white/20 text-white mb-4 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-[#9b87f5]/20 to-[#1EAEDB]/20 border-b border-white/10">
            <CardTitle className="text-lg">{output.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-white/60 block mb-1">Name</label>
                <div className="bg-white/5 p-2 rounded border border-white/10">{output.content.name}</div>
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Age Range</label>
                <div className="bg-white/5 p-2 rounded border border-white/10">{output.content.age}</div>
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1">Role</label>
                <div className="bg-white/5 p-2 rounded border border-white/10">{output.content.role}</div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-white/60 block mb-1">Pain Points</label>
                <div className="bg-white/5 p-2 rounded border border-white/10 flex flex-wrap gap-1">
                  {output.content.painPoints.map((point: string, i: number) => (
                    <span key={i} className="bg-white/10 text-xs px-2 py-1 rounded">{point}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-white/60 block mb-1">Goals</label>
                <div className="bg-white/5 p-2 rounded border border-white/10 flex flex-wrap gap-1">
                  {output.content.goals.map((goal: string, i: number) => (
                    <span key={i} className="bg-white/10 text-xs px-2 py-1 rounded">{goal}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/10 pt-3 flex justify-between">
            <Button variant="outline" className="bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs h-8">
              Edit
            </Button>
            <Button className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white text-xs h-8">
              Download
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    // Default card for other output types
    return (
      <Card key={index} className="bg-white/10 border-white/20 text-white mb-4 animate-fade-in">
        <CardHeader>
          <CardTitle>Output {index + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-white/70 whitespace-pre-wrap">
            {JSON.stringify(output, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-240px)] shadow-[0_8px_32px_rgba(155,135,245,0.1)]">
      <div className="p-4 border-b border-white/10 bg-white/5">
        <h3 className="text-white font-semibold">
          Canvas Output
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {outputs.map((output, index) => renderOutputCard(output, index))}
      </ScrollArea>
      
      {outputs.length > 1 && (
        <div className="p-4 border-t border-white/10">
          <Pagination>
            <PaginationContent>
              {outputs.map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={activeTab === index}
                    onClick={() => setActiveTab(index)}
                    className={activeTab === index ? "bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]" : ""}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
