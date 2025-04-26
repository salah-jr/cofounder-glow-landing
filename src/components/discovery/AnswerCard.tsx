
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface AnswerCardProps {
  answer: string;
  index: number;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, index }) => {
  return (
    <motion.div
      className="relative glass px-4 py-2 rounded-xl flex items-center justify-between gap-3"
      style={{
        background: "linear-gradient(145deg, rgba(27, 32, 50, 0.3), rgba(114, 82, 198, 0.05))",
        boxShadow: "0 8px 32px rgba(155, 135, 245, 0.1)",
        border: "1px solid rgba(155, 135, 245, 0.1)"
      }}
      initial={{ opacity: 0, scale: 0.8, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.15 }}
    >
      <span className="text-white/90 text-sm font-medium hover:text-white transition-colors">{answer}</span>
      
      <motion.div 
        className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] rounded-full p-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
      >
        <motion.div
          animate={{ 
            boxShadow: ["0px 0px 0px rgba(155, 135, 245, 0.7)", "0px 0px 8px rgba(155, 135, 245, 0.7)", "0px 0px 0px rgba(155, 135, 245, 0.7)"] 
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnswerCard;
