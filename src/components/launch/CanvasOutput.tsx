import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CanvasOutputProps {
  className?: string;
  currentPhase?: string;
  projectData?: {
    id: string;
    idea: string;
    suggestions: Array<{
      name: string;
      value: string;
    }>;
  } | null;
}

export default function CanvasOutput({
  className,
  currentPhase = "shape",
  projectData
}: CanvasOutputProps) {
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Get phase display name
  const getPhaseDisplayName = (phaseId: string) => {
    const phases = {
      'shape': 'Shape Your Idea',
      'validate': 'Validate the Idea and the Market',
      'build': 'Build the Business',
      'mvp': 'Plan the MVP',
      'pitch': 'Pitch Your Idea'
    };
    return phases[phaseId as keyof typeof phases] || 'Unknown Phase';
  };

  // Get suggestions as object
  const getSuggestions = () => {
    if (!projectData?.suggestions) return {};
    
    return projectData.suggestions.reduce((acc, suggestion) => {
      acc[suggestion.name] = suggestion.value;
      return acc;
    }, {} as Record<string, string>);
  };

  // Generate and download PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const suggestions = getSuggestions();
      const currentPhaseTitle = getPhaseDisplayName(currentPhase);
      
      // Set up document styling
      doc.setFont('helvetica');
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(99, 102, 241); // Indigo color
      doc.text('Cofounder AI - Startup Canvas', 20, 25);
      
      // Current phase
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Current Phase: ${currentPhaseTitle}`, 20, 40);
      
      // Project info
      if (projectData) {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`Project ID: ${projectData.id}`, 20, 50);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 58);
        
        // Original idea
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Original Idea:', 20, 75);
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const ideaLines = doc.splitTextToSize(projectData.idea, 170);
        doc.text(ideaLines, 20, 85);
        
        let yPosition = 85 + (ideaLines.length * 6) + 15;
        
        // Startup building blocks
        if (Object.keys(suggestions).length > 0) {
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text('Startup Building Blocks', 20, yPosition);
          yPosition += 15;
          
          // Startup Name
          if (suggestions.startup_name) {
            doc.setFontSize(14);
            doc.setTextColor(99, 102, 241);
            doc.text('Startup Name:', 20, yPosition);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(suggestions.startup_name, 20, yPosition + 8);
            yPosition += 20;
          }
          
          // Value Proposition
          if (suggestions.value_proposition) {
            doc.setFontSize(14);
            doc.setTextColor(99, 102, 241);
            doc.text('Value Proposition:', 20, yPosition);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const valueLines = doc.splitTextToSize(suggestions.value_proposition, 170);
            doc.text(valueLines, 20, yPosition + 8);
            yPosition += 8 + (valueLines.length * 6) + 10;
          }
          
          // Target Audience
          if (suggestions.target_audience) {
            doc.setFontSize(14);
            doc.setTextColor(99, 102, 241);
            doc.text('Target Audience:', 20, yPosition);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const audienceLines = doc.splitTextToSize(suggestions.target_audience, 170);
            doc.text(audienceLines, 20, yPosition + 8);
            yPosition += 8 + (audienceLines.length * 6) + 10;
          }
          
          // Revenue Stream
          if (suggestions.revenue_stream) {
            doc.setFontSize(14);
            doc.setTextColor(99, 102, 241);
            doc.text('Revenue Stream:', 20, yPosition);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const revenueLines = doc.splitTextToSize(suggestions.revenue_stream, 170);
            doc.text(revenueLines, 20, yPosition + 8);
            yPosition += 8 + (revenueLines.length * 6) + 10;
          }
        }
        
        // Add new page if needed for phase information
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 25;
        }
        
        // Current phase information
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`${currentPhaseTitle} - Key Focus Areas`, 20, yPosition);
        yPosition += 15;
        
        // Phase-specific content
        const phaseContent = getPhaseContent(currentPhase);
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        phaseContent.forEach((item, index) => {
          doc.text(`${index + 1}. ${item}`, 25, yPosition);
          yPosition += 8;
        });
        
      } else {
        // No project data available
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text('No project data available. Start by creating your startup idea!', 20, 75);
      }
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('Generated by Cofounder AI - Your startup co-pilot', 20, 280);
      doc.text('Visit us at cofounder.ai', 20, 288);
      
      // Generate filename
      const filename = projectData 
        ? `cofounder-${currentPhase}-${projectData.id.substring(0, 8)}.pdf`
        : `cofounder-${currentPhase}-canvas.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Get phase-specific content
  const getPhaseContent = (phaseId: string) => {
    const phaseContents = {
      'shape': [
        'Define the problem and target user clearly',
        'Craft a compelling one-liner for your idea',
        'Identify the market gap your solution addresses',
        'Document key assumptions about your business model'
      ],
      'validate': [
        'Research your target market thoroughly',
        'Design effective user interview questions',
        'Practice your interview approach',
        'Conduct interviews with real potential users',
        'Analyze feedback and compare with assumptions'
      ],
      'build': [
        'Define your value proposition and market positioning',
        'Identify potential risks and mitigation strategies',
        'Outline your revenue model and pricing strategy',
        'Estimate costs and required resources',
        'Assemble a comprehensive business case'
      ],
      'mvp': [
        'Map out the complete user journey',
        'Prioritize essential features for your MVP',
        'Design user interface and interaction prompts',
        'Plan comprehensive usability testing',
        'Execute user validation with real feedback'
      ],
      'pitch': [
        'Craft your compelling startup story',
        'Create strong launch messaging and materials',
        'Plan your next strategic moves',
        'Build a professional investor pitch deck'
      ]
    };
    
    return phaseContents[phaseId as keyof typeof phaseContents] || [];
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Document header - redesigned with rounded corners and better styling */}
      <div className="flex items-center justify-between mb-4 lg:mb-6 sticky top-0 z-10 bg-gradient-to-r from-[#1A1F2C]/90 to-[#1A1F2C]/80 backdrop-blur-md py-3 px-4 rounded-lg border border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]"></div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            {getPhaseDisplayName(currentPhase)} Canvas
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="h-8 px-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md border border-white/10 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </span>
        </Button>
      </div>
      
      {/* Document body - responsive content */}
      <ScrollArea className="h-full pr-2 lg:pr-4">
        <div className="space-y-4 lg:space-y-6 pb-6 lg:pb-8 text-white/80">
          {projectData ? (
            <>
              {/* Project Overview */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm lg:text-base font-medium mb-2 lg:mb-3 text-white/90">Project Overview:</h4>
                <p className="text-xs lg:text-sm text-white/70 mb-3">{projectData.idea}</p>
                <div className="text-xs text-white/50">
                  Project ID: {projectData.id.substring(0, 8)}...
                </div>
              </div>

              {/* Building Blocks */}
              {projectData.suggestions.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm lg:text-base font-medium mb-3 text-white/90">Startup Building Blocks:</h4>
                  <div className="space-y-3">
                    {projectData.suggestions.map((suggestion, index) => (
                      <div key={index} className="border-l-2 border-indigo-400 pl-3">
                        <div className="text-xs font-medium text-indigo-300 capitalize">
                          {suggestion.name.replace('_', ' ')}
                        </div>
                        <div className="text-xs lg:text-sm text-white/80 mt-1">
                          {suggestion.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Phase Focus */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm lg:text-base font-medium mb-3 text-white/90">
                  {getPhaseDisplayName(currentPhase)} - Key Focus Areas:
                </h4>
                <ul className="space-y-2">
                  {getPhaseContent(currentPhase).map((item, index) => (
                    <li key={index} className="text-xs lg:text-sm text-white/70 flex items-start">
                      <span className="text-indigo-400 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm lg:text-base font-medium mb-2 lg:mb-3 text-white/70">Getting Started:</h4>
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
          )}
        </div>
      </ScrollArea>
    </div>
  );
}