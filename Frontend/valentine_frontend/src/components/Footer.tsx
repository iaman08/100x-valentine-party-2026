import { Heart, Instagram, Mail } from "lucide-react";
import schoolLogo from "@/assets/100xschool-logo.jpg";

const Footer = () => {
  return (
    <footer className="relative py-12 px-4 bg-card/80 border-t border-pink-soft/30">
      {/* Gradient fade from section above */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent to-card/80 pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src={schoolLogo}
            alt="100xSchool"
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-2xl">💕</span>
        </div>

        <p className="font-display text-foreground text-xl mb-2">
          Valentine's Ball Party 2026
        </p>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Feb 12th • 100xSchool • 4 PM
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="w-10 h-10 rounded-full bg-card border border-pink-soft flex items-center justify-center hover:bg-pink-hot hover:text-primary-foreground hover:border-pink-hot transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-card border border-pink-soft flex items-center justify-center hover:bg-pink-hot hover:text-primary-foreground hover:border-pink-hot transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <p className="text-muted-foreground/70 text-xs font-body">
          Made with <Heart className="w-3 h-3 inline text-pink-hot fill-pink-hot mx-1" /> by 100xSchool
        </p>
      </div>
    </footer>
  );
};

export default Footer;