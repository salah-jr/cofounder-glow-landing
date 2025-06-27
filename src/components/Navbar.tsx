import { useState, useEffect } from "react";
import { User, LogOut, Plus, FolderOpen, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  user_id: string;
  idea: string;
  created_at: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { isAuthenticated, user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging for navbar state
  useEffect(() => {
    console.log('🔍 Navbar render state:', {
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      userEmail: user?.email,
      userId: user?.id,
      loadingProjects,
      projectsCount: userProjects.length,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user, profile, loadingProjects, userProjects]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load user projects when authenticated - with detailed logging
  useEffect(() => {
    const loadUserProjects = async () => {
      console.log('📊 loadUserProjects called with state:', {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id,
        currentLoadingState: loadingProjects,
        currentProjectsCount: userProjects.length
      });

      if (isAuthenticated && user) {
        console.log('✅ Starting to load projects for user:', user.id);
        setLoadingProjects(true);
        
        try {
          console.log('🔄 Making Supabase query for projects...');
          const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          console.log('📥 Supabase response:', {
            hasError: !!error,
            error: error?.message,
            projectsCount: projects?.length || 0,
            projects: projects?.map(p => ({ id: p.id, idea: p.idea.substring(0, 50) + '...' }))
          });

          if (error) {
            console.error('❌ Error loading projects:', error);
            setUserProjects([]);
          } else {
            console.log('✅ Successfully loaded projects:', projects?.length || 0);
            setUserProjects(projects || []);
          }
        } catch (error) {
          console.error('💥 Exception loading projects:', error);
          setUserProjects([]);
        } finally {
          console.log('🏁 Setting loadingProjects to false');
          setLoadingProjects(false);
        }
      } else {
        console.log('🚫 Not loading projects - user not authenticated or missing:', {
          isAuthenticated,
          hasUser: !!user
        });
        setUserProjects([]);
        setLoadingProjects(false);
      }
    };

    console.log('🎯 useEffect triggered for loading projects');
    loadUserProjects();
  }, [isAuthenticated, user]);

  // Additional logging for state changes
  useEffect(() => {
    console.log('📈 Projects state changed:', {
      loadingProjects,
      projectsCount: userProjects.length,
      projects: userProjects.map(p => ({ 
        id: p.id.substring(0, 8), 
        idea: p.idea.substring(0, 30) + '...',
        created: p.created_at 
      }))
    });
  }, [loadingProjects, userProjects]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserProjects([]);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreateProject = () => {
    navigate('/');
    // Scroll to the prompt section if we're already on the home page
    if (location.pathname === '/') {
      setTimeout(() => {
        const promptSection = document.querySelector('[data-prompt-section]');
        if (promptSection) {
          promptSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleProjectClick = (project: Project) => {
    console.log('🎯 Project clicked:', { id: project.id, idea: project.idea.substring(0, 50) });
    navigate("/launch-path", { state: { projectId: project.id } });
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleRegisterClick = () => {
    setRegisterDialogOpen(true);
  };

  const handleSwitchToRegister = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterDialogOpen(false);
    setLoginDialogOpen(true);
  };

  const closeDialogs = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(false);
  };

  // Robot avatar with pink background
  const RobotAvatar = () => (
    <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-indigo-400/60 transition-all duration-200 hover:scale-105 cursor-pointer">
      <AvatarFallback className="bg-pink-500 text-white text-lg font-medium shadow-lg border-0">
        🤖
      </AvatarFallback>
    </Avatar>
  );

  // Always render auth section without loading state
  const renderAuthSection = () => {
    console.log('🎨 Rendering auth section with state:', { 
      isAuthenticated,
      loadingProjects,
      projectsCount: userProjects.length 
    });
    
    if (isAuthenticated) {
      console.log('👤 Showing authenticated user dropdown');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <RobotAvatar />
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
            
            {/* Create New Project */}
            <DropdownMenuItem 
              className="cursor-pointer text-white hover:bg-indigo-500/20 focus:bg-indigo-500/20 px-3 py-2" 
              onClick={handleCreateProject}
            >
              <Plus className="mr-3 h-4 w-4 text-indigo-400" />
              <span>Create New Project</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            {/* Projects Section */}
            <DropdownMenuLabel className="text-white/70 px-3 py-2 text-xs uppercase tracking-wider">
              My Projects
            </DropdownMenuLabel>
            
            {loadingProjects ? (
              <DropdownMenuItem className="text-white/60 px-3 py-2">
                Loading projects...
              </DropdownMenuItem>
            ) : userProjects.length > 0 ? (
              <div className="max-h-40 overflow-y-auto">
                {userProjects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10 px-3 py-2"
                    onClick={() => handleProjectClick(project)}
                  >
                    <FolderOpen className="mr-3 h-4 w-4 text-blue-400" />
                    <div className="flex flex-col items-start">
                      <span className="truncate max-w-[180px]">
                        {project.idea.length > 30 ? `${project.idea.substring(0, 30)}...` : project.idea}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <DropdownMenuItem className="text-white/60 px-3 py-2">
                No projects yet
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            {/* Sign Out */}
            <DropdownMenuItem 
              className="cursor-pointer text-white hover:bg-red-500/20 focus:bg-red-500/20 px-3 py-2" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4 text-red-400" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    console.log('🔐 Showing unauthenticated buttons');
    return (
      <div className="flex items-center gap-4">
        <button 
          className="text-white/80 hover:text-white transition-colors"
          onClick={handleLoginClick}
        >
          Sign In
        </button>
        <button
          className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          onClick={handleRegisterClick}
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#030303]/80 backdrop-blur-sm py-2" 
            : "py-4"
        }`}
      >
        <div className="px-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="small" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {renderAuthSection()}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" className="p-0 h-auto">
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[350px] bg-[#1A1F2C]/95 backdrop-blur-xl border-white/10"
            >
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile auth UI */}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 text-white/80 text-sm border-b border-white/10 pb-4">
                      <RobotAvatar />
                      <div>
                        <div className="font-medium">{profile?.full_name || user?.email}</div>
                        <div className="text-xs text-white/60">{user?.email}</div>
                      </div>
                    </div>
                    
                    {/* Create New Project */}
                    <button 
                      onClick={handleCreateProject}
                      className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      <Plus className="w-5 h-5" />
                      Create New Project
                    </button>
                    
                    {/* Projects List */}
                    <div className="space-y-2">
                      <h3 className="text-white/70 text-sm font-medium">My Projects</h3>
                      {loadingProjects ? (
                        <div className="text-white/60 text-sm">Loading projects...</div>
                      ) : userProjects.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {userProjects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectClick(project)}
                              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-blue-400" />
                                <div>
                                  <div className="text-white text-sm truncate">
                                    {project.idea.length > 25 ? `${project.idea.substring(0, 25)}...` : project.idea}
                                  </div>
                                  <div className="text-white/50 text-xs">
                                    {new Date(project.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white/60 text-sm">No projects yet</div>
                      )}
                    </div>
                    
                    {/* Sign Out */}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white px-4 py-2 rounded-lg transition-colors text-center mt-4"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button 
                      className="text-white/80 hover:text-white transition-colors text-lg text-left"
                      onClick={handleLoginClick}
                    >
                      Sign In
                    </button>
                    <button
                      className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                      onClick={handleRegisterClick}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      {/* Adding space after the navbar */}
      <div className="h-[80px]"></div>
      
      {/* Auth Dialogs */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="glass border border-white/10 w-[90%] max-w-md rounded-lg p-0 overflow-hidden animate-fade-in">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In</DialogTitle>
          </DialogHeader>
          <LoginForm
            onRegisterClick={handleSwitchToRegister}
            onSuccess={closeDialogs}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="glass border border-white/10 w-[90%] max-w-md rounded-lg p-0 overflow-hidden animate-fade-in">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign Up</DialogTitle>
          </DialogHeader>
          <RegisterForm
            onLoginClick={handleSwitchToLogin}
            onSuccess={closeDialogs}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;