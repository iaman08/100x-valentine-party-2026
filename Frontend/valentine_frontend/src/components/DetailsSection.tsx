import { Calendar, Clock, MapPin, Music, Cake, Camera, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TiltCard from "./TiltCard";

const details = [
  {
    icon: Calendar,
    emoji: "💝",
    title: "When",
    description: "February 12th, 2026",
    subtitle: "Valentine's Day!",
  },
  {
    icon: Clock,
    emoji: "🕖",
    title: "Time",
    description: "4:00 PM - Midnight",
    subtitle: "Doors open at 6:30 PM",
  },
  {
    icon: MapPin,
    emoji: "📍",
    title: "Where",
    description: "100xSchool",
    subtitle: "Main Campus",
  },
  {
    icon: Users,
    emoji: "👗",
    title: "Dress Code",
    description: "Semi-Formal",
    subtitle: "Pink & red encouraged!",
  },
];

const highlights = [
  { icon: Music, text: "Live DJ & Dancing", emoji: "🎵" },
  { icon: Cake, text: "Desserts & Treats", emoji: "🍰" },
  { icon: Camera, text: "Photo Booth", emoji: "📸" },
];

const StaggeredItem = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  );
};

const DetailsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  return (
    <section id="details" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <span className="text-3xl mb-4 block animate-bounce-soft">✨</span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3 hover-jelly inline-block">
            What's in Store for You
          </h2>
          <p className="text-muted-foreground font-body text-lg">An unforgettable night of fun, friends & love!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {details.map((detail, index) => (
            <StaggeredItem key={detail.title} index={index}>
              <TiltCard className="h-full">
                <div className="group relative p-6 rounded-2xl bg-card border border-pink-soft hover:border-pink-hot transition-all duration-300 hover:shadow-cute h-full">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-light flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <span className="text-2xl">{detail.emoji}</span>
                      </div>
                      <h3 className="font-display text-lg text-pink-hot">{detail.title}</h3>
                    </div>

                    <p className="font-display text-xl text-foreground mb-1">{detail.description}</p>
                    <p className="text-muted-foreground text-sm font-body">{detail.subtitle}</p>
                  </div>
                </div>
              </TiltCard>
            </StaggeredItem>
          ))}
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap justify-center gap-4">
          {highlights.map((item, index) => (
            <StaggeredItem key={item.text} index={index + details.length}>
              <div className="inline-flex items-center gap-2 bg-card px-5 py-3 rounded-full border border-pink-soft hover:border-pink-hot hover:scale-105 transition-all duration-300 cursor-default hover-jelly">
                <span className="text-xl">{item.emoji}</span>
                <span className="font-semibold text-foreground">{item.text}</span>
              </div>
            </StaggeredItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
