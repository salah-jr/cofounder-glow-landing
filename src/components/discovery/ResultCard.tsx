
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ResultCardProps {
  title: string;
  content: string;
  delay: number;
  mainCard?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, delay, mainCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardContent, setCardContent] = useState(content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        className="bg-white/5 border-0 backdrop-blur-xl shadow-[0_8px_32px_rgba(155,135,245,0.1)]"
      >
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#9b87f5] font-medium">{title}</h3>
            <button 
              onClick={isEditing ? handleSave : handleEdit}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {isEditing ? (
            <Textarea
              value={cardContent}
              onChange={(e) => setCardContent(e.target.value)}
              className="bg-white/10 border-white/20 text-white text-xl font-medium resize-none min-h-[100px]"
              autoFocus
            />
          ) : (
            <p className="text-white text-xl font-medium">{cardContent}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
