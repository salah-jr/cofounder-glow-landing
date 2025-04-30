
import React from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Dashboard</h1>
          <div className="bg-white/5 backdrop-blur-xl border-0 rounded-lg shadow-[0_8px_32px_rgba(155,135,245,0.1)] p-6">
            <p className="text-white text-xl">Welcome to your startup dashboard!</p>
            <p className="text-white/70 mt-4">
              This is where you'll be able to continue developing your startup idea,
              set goals, track progress, and access helpful resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
