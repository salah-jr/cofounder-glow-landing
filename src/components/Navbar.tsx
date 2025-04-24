
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Logo size="small" />
            <h2 className="text-xl md:text-2xl text-white/80 ml-4">
              Your AI Co-Founder for Startup Success
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/pricing" className="text-white/80 hover:text-white transition-colors">
              Pricing
            </Link>
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
            <Link
              to="/login"
              className="text-white/80 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
