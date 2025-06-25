import { useState, useEffect } from "react";
import { User, LogOut, Settings, FolderOpen, Plus } from "lucide-react";
import Logo from "./Logo";
import AuthDialogs from "./auth/AuthDialogs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Cartoon animal icons with solid backgrounds
const animalAvatars = [
  { emoji: "🐶", bg: "bg-blue-500" },
  { emoji: "🐱", bg: "bg-purple-500" },
  { emoji: "🐼", bg: "bg-green-500" },
  { emoji: "🦊", bg: "bg-orange-500" },
  { emoji: "🐨", bg: "bg-gray-500" },
  { emoji: "🐸", bg: "bg-emerald-500" },
  { emoji: "🐧", bg: "bg-cyan-500" },
  { emoji: "🦁", bg: "bg-yellow-500" },
  { emoji: "🐯", bg: "bg-red-500" },
  { emoji: "🐰", bg: "bg-pink-500" },
  { emoji: "🐻", bg: "bg-amber-500" },
  { emoji: "🐺", bg: "bg-slate-500" },
];

// Mock projects data - in a real app this would come from your backend
const mockProjects = [
  { id: 1, name: "E-commerce Platform", lastModified: "2 days ago" },
  { id: 2, name: "SaaS Dashboard", lastModified: "1 week ago" },
  { id: 3, name: "Mobile App Concept", lastModified: "2 weeks ago" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, profile, logout, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate consistent animal avatar based on user ID
  const getAnimalAvatar = () => {
    if (!user?.id) return animalAvatars[0];
    
    // Use user ID to consistently pick the same avatar
    const hash = user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return animalAvatars[Math.abs(hash) % animalAvatars.length];
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateProject = () => {
    // Navigate to discovery flow for new project
    window.location.href = "/discovery";
  };

  const animalAvatar = getAnimalAvatar();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#030303]/80 backdrop-blur-sm border-b border-white/10 py-2" 
            : "py-4"
        }`}
      >
        <div className="px-4 flex items-center justify-between">
          <Logo size="small" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-indigo-400/60 transition-all duration-200 hover:scale-105 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                    <AvatarFallback className={`${animalAvatar.bg} text-white text-lg font-medium shadow-lg border-0`}>
                      {animalAvatar.emoji}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 bg-[#1A1F2C]/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20"
                  align="end"
                  sideOffset={8}
                >
                  {/* User Info */}
                  <DropdownMenuLabel className="text-white flex flex-col items-start px-3 py-3">
                    <div className="font-medium truncate max-w-full">{profile?.full_name || user?.email}</div>
                    <div className="text-xs text-white/60 truncate max-w-full">{user?.email}</div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {/* Projects Section */}
                  <DropdownMenuLabel className="text-white/80 text-xs font-medium px-3 py-2">
                    Recent Projects
                  </DropdownMenuLabel>
                  
                  {mockProjects.map((project) => (
                    <DropdownMenuItem 
                      key={project.id}
                      className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10 px-3 py-2"
                    >
                      <FolderOpen className="mr-3 h-4 w-4 text-indigo-400" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{project.name}</span>
                        <span className="text-xs text-white/60">{project.lastModified}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {/* Actions */}
                  <DropdownMenuItem 
                    className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10 px-3 py-2"
                    onClick={handleCreateProject}
                  >
                    <Plus className="mr-3 h-4 w-4 text-green-400" />
                    <span>Create New Project</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10 px-3 py-2">
                    <Settings className="mr-3 h-4 w-4 text-blue-400" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-white hover:bg-red-500/20 focus:bg-red-500/20 px-3 py-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-400" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialogs />
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" className="p-0 h-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1A1F2C]/95 backdrop-blur-xl border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                {isLoading ? (
                  <div className="w-full h-10 bg-white/10 rounded-lg animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 text-white/80 text-sm border-b border-white/10 pb-4">
                      <Avatar className="h-10 w-10 ring-2 ring-white/20">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                        <AvatarFallback className={`${animalAvatar.bg} text-white text-lg font-medium border-0`}>
                          {animalAvatar.emoji}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{profile?.full_name || user?.email}</div>
                        <div className="text-xs text-white/60">{user?.email}</div>
                      </div>
                    </div>
                    
                    {/* Projects */}
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-3">Recent Projects</h3>
                      {mockProjects.map((project) => (
                        <button 
                          key={project.id}
                          className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm text-left w-full py-2"
                        >
                          <FolderOpen className="w-4 h-4 text-indigo-400" />
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-white/60">{project.lastModified}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <button 
                      onClick={handleCreateProject}
                      className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-lg text-left"
                    >
                      <Plus className="w-5 h-5 text-green-400" />
                      Create New Project
                    </button>
                    <button className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-lg text-left">
                      <Settings className="w-5 h-5 text-blue-400" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <a href="/login" className="text-white/80 hover:text-white transition-colors text-lg">
                      Login
                    </a>
                    <a
                      href="/register"
                      className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      Register
                    </a>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      {/* Adding space after the navbar - now 30px total */}
      <div className="h-[30px]"></div>
    </>
  );
};

export default Navbar;