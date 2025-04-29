
import { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Logo size="small" />
        
        <div className="hidden md:flex items-center gap-8">
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
          <a
            href="/login"
            className="text-white/80 hover:text-white transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
