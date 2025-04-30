
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const LaunchPath: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Launch Path</h1>
          <p className="text-center text-white/70 max-w-xl mx-auto">
            This is where you'll build and launch your startup idea with guided steps.
            We're currently preparing this area for you.
          </p>
          
          <div className="mt-12 grid place-items-center">
            <div className="bg-white/5 p-8 rounded-xl border border-white/10 max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-white/70">
                The Launch Path feature is being developed and will be available soon.
                Check back later for updates on how to build and launch your startup idea.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LaunchPath;
