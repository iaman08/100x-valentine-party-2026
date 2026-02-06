import { ChevronDown, Sparkles, Heart } from "lucide-react";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import TextScramble from "./TextScramble";
import MagneticButton from "./MagneticButton";
import MorphingBlob from "./MorphingBlob";
import RegistrationModal from "./RegistrationModal";
import heroBg from "@/assets/hero-bg.jpg";
import schoolLogo from "@/assets/100xschool-logo.jpg";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 100xSchool Logo - Top Right */}
        <div className="absolute top-6 right-6 z-20 animate-reveal-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-300">
            <img
              src={schoolLogo}
              alt="100xSchool"
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
            <span className="font-bold text-white text-base md:text-lg tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">100xSchool</span>
          </div>
        </div>

        {/* Morphing background blobs */}
        <MorphingBlob />

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-12" style={{ perspective: "1000px" }}>
          <div className="animate-reveal-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <span className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-soft mb-6">
              <Sparkles className="w-4 h-4 text-pink-hot animate-pulse" />
              <span className="text-sm font-semibold text-foreground">You're invited! 💌</span>
            </span>
          </div>

          <div className="animate-reveal-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-tight overflow-hidden">
              <TextScramble text="Valentine's Day" delay={600} />
              <br />
              <span className="text-gradient-love inline-block">
                <TextScramble text="Ball Party! 💕" delay={1000} />
              </span>
            </h1>
          </div>

          <div className="animate-reveal-up" style={{ animationDelay: "0.6s", opacity: 0 }}>
            <p className="text-lg md:text-xl text-white font-medium mb-8 max-w-xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Get ready for the most fun, wholesome, and love-filled night of the year! 🎉
            </p>
          </div>

          <div className="animate-reveal-up mb-10" style={{ animationDelay: "0.8s", opacity: 0 }}>
            <div className="inline-flex items-center gap-2 bg-pink-light/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 hover-jelly relative overflow-hidden group">
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg">📍</span>
              <span className="font-display text-lg md:text-xl text-pink-hot">
                Feb 12th, 2026 • 4:00 PM
              </span>
            </div>
            <CountdownTimer />
          </div>

          <div className="animate-elastic-in flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "1.2s", opacity: 0 }}>
            <div className="relative">
              {/* Pulse ring effect behind button */}
              <div className="absolute pointer-events-none inset-0 rounded-full bg-pink-hot/30 animate-pulse-ring" />
              <MagneticButton className="" variant="love" size="xl" onClick={() => setIsModalOpen(true)}>
                🎟️ Get Your Ticket!
              </MagneticButton>
            </div>
            <MagneticButton variant="cute" size="xl" onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}>
              See Details ✨
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <Heart className="w-5 h-5 text-pink-hot animate-pulse" />
          <ChevronDown className="w-8 h-8 text-pink-hot animate-bounce" />
        </div>
      </section>
    </>
  );
};

export default HeroSection;