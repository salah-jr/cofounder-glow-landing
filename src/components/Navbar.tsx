import { useState, useEffect } from "react";
import { User, LogOut, Settings, FolderOpen } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Avatar icon options
const avatarIcons = [
  "🚀", "⭐", "💡", "🎯", "🔥", "⚡", "🌟", "💎", 
  "🎨", "🎪", "🎭", "🎨", "🌈", "🦄", "🎲", "🎯",
  "🔮", "💫", "🌙", "☀️", "🌊", "🍀", "🌸", "🦋"
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

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (profile?.full_name) {
      const nameParts = profile.full_name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`;
      }
      return nameParts[0][0];
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  // Generate random avatar icon based on user ID
  const getAvatarIcon = () => {
    if (!user?.id) return "👤";
    
    // Use user ID to consistently pick the same icon
    const hash = user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return avatarIcons[Math.abs(hash) % avatarIcons.length];
  };

  // Generate random avatar colors based on user ID
  const getAvatarGradient = () => {
    if (!user?.id) return "from-[#9b87f5] to-[#1EAEDB]";
    
    const gradients = [
      "from-[#9b87f5] to-[#1EAEDB]",
      "from-[#f093fb] to-[#f5576c]",
      "from-[#4facfe] to-[#00f2fe]",
      "from-[#43e97b] to-[#38f9d7]",
      "from-[#fa709a] to-[#fee140]",
      "from-[#a8edea] to-[#fed6e3]",
      "from-[#ff9a9e] to-[#fecfef]",
      "from-[#667eea] to-[#764ba2]",
    ];
    
    // Use user ID to consistently pick the same gradient
    const hash = user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass py-2" : "py-4"
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
                  <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-white/40 transition-all duration-200 hover:scale-105">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                    <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient()} text-white text-lg font-medium shadow-lg`}>
                      {getAvatarIcon()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass border-white/10 bg-[#1A1F2C]/90">
                  <DropdownMenuItem className="cursor-pointer text-white flex-col items-start">
                    <div className="font-medium">{profile?.full_name || user?.email}</div>
                    <div className="text-xs text-white/60">{user?.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer text-white">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>My Projects</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer text-white" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
            <SheetContent side="right" className="glass border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                {isLoading ? (
                  <div className="w-full h-10 bg-white/10 rounded-lg animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                      <Avatar className="h-8 w-8 ring-2 ring-white/20">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                        <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient()} text-white text-sm font-medium`}>
                          {getAvatarIcon()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{profile?.full_name || user?.email}</div>
                        <div className="text-xs text-white/60">{user?.email}</div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg text-left">
                      <FolderOpen className="w-5 h-5" />
                      My Projects
                    </button>
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg text-left">
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <>
                    <a href="/login" className="text-white/80 hover:text-white transition-colors text-lg">
                      Login
                    </a>
                    <a
                      href="/register"
                      className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
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