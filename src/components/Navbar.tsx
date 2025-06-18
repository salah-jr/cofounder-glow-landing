import { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, User, LogOut } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, profile, logout, isLoading } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHomePage) return;
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <div className="hidden md:flex items-center gap-8">
            {isHomePage && (
              // Only show these navigation items on the home page
              <>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </>
            )}
            
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {isLoading ? (
              <div className="w-9 h-9 bg-white/10 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9 bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white">
                    <AvatarFallback className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass border-white/10 bg-[#1A1F2C]/90">
                  <DropdownMenuItem className="cursor-pointer text-white flex-col items-start">
                    <div className="font-medium">{profile?.full_name || user?.email}</div>
                    <div className="text-xs text-white/60">{user?.email}</div>
                  </DropdownMenuItem>
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
                {isHomePage && (
                  // Home page mobile navigation
                  <>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="text-white/80 hover:text-white transition-colors text-lg"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => scrollToSection("about")}
                      className="text-white/80 hover:text-white transition-colors text-lg"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => scrollToSection("pricing")}
                      className="text-white/80 hover:text-white transition-colors text-lg"
                    >
                      Pricing
                    </button>
                  </>
                )}
                <div className="flex items-center gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
                {isLoading ? (
                  <div className="w-full h-10 bg-white/10 rounded-lg animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="text-white/80 text-sm">
                      {profile?.full_name || user?.email}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
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