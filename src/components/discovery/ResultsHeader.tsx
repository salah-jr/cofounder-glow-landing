
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const ResultsHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.div
        className="inline-block p-3 rounded-full bg-[#9b87f5]/10 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Star className="w-6 h-6 text-[#9b87f5]" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
        Discovery Results
      </h1>
      <p className="text-white/60">
        Here's what we've learned about your startup vision
      </p>
    </div>
  );
};

export default ResultsHeader;
