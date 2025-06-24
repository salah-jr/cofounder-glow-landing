import { Mail, MessageSquare } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm pt-16 pb-8 px-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo and Description */}
          <div className="max-w-2xl">
            <Logo size="small" />
            <p className="text-white/80 mt-6 text-lg leading-relaxed">
              Co-founder is your AI startup co-pilot — built to guide you 
              from idea to MVP and beyond. Launch smarter, not alone.
            </p>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Mail className="w-5 h-5 text-[#9b87f5]" />
              <a href="mailto:support@cofounder.ai" className="hover:text-white transition-colors">
                support@cofounder.ai
              </a>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
              <a href="#" className="hover:text-white transition-colors">
                Live Chat
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 mt-12 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Cofounder AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;