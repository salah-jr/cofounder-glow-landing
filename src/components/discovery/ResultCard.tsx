
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  content: string;
  delay: number;
  mainCard?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, delay, mainCard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        className={cn(
          "border-0 backdrop-blur-xl shadow-[0_8px_32px_rgba(155,135,245,0.15)]",
          mainCard
            ? "bg-[rgba(155,135,245,0.1)]"
            : "bg-white/5"
        )}
      >
        <CardContent className="p-6">
          <h3 className="text-[#9b87f5] mb-2 font-medium">{title}</h3>
          <p className="text-white text-xl font-medium">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
