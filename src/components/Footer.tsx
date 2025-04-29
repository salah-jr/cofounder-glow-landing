
import { Mail, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-transparent to-[#151821] pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Logo size="small" />
            <p className="text-white/60 mt-4">
              Your AI Co-Founder for strategic business growth. Turning ideas into startups in seconds.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#services" className="hover:text-white/90 transition-colors">Business Plans</a></li>
              <li><a href="#services" className="hover:text-white/90 transition-colors">Market Research</a></li>
              <li><a href="#services" className="hover:text-white/90 transition-colors">Pitch Decks</a></li>
              <li><a href="#pricing" className="hover:text-white/90 transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-white/90 transition-colors">Startup Guide</a></li>
              <li><a href="#" className="hover:text-white/90 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white/90 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white/90 transition-colors">Case Studies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9b87f5]" />
                <a href="mailto:support@cofounder.ai" className="hover:text-white/90 transition-colors">support@cofounder.ai</a>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9b87f5]" />
                <a href="#" className="hover:text-white/90 transition-colors">Join Community</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9b87f5]" />
                <a href="#" className="hover:text-white/90 transition-colors">Live Chat</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Cofounder AI. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">Terms</Link>
            <Link to="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">Privacy</Link>
            <Link to="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
