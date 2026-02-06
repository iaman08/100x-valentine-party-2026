import { Heart, Sparkles } from "lucide-react";
interface TicketConfirmationProps {
  name: string;
  email: string;
  bringing: string;
}
const TicketConfirmation = ({
  name,
  email,
  bringing
}: TicketConfirmationProps) => {
  const getBringingText = (value: string) => {
    switch (value) {
      case "solo":
        return "Solo ✨";
      case "date":
        return "With Date 💑";
      case "friends":
        return "With Friends 👯";
      case "squad":
        return "Squad 🎊";
      default:
        return value;
    }
  };
  return <div className="w-full max-w-4xl mx-auto animate-ticket-slide-in">
      {/* Main ticket container - dark burgundy with pink border */}
      <div className="relative bg-[#1a0a14] border-2 border-pink-hot rounded-lg overflow-hidden shadow-[0_0_40px_hsl(340_82%_52%/0.3)]">
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-pink-hot" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-pink-hot" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-pink-hot" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-pink-hot" />

        {/* Inner content wrapper */}
        <div className="p-6 md:p-8">
          {/* Header with 100xSchool branding */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-hot" />
              <span className="font-display text-pink-hot text-sm tracking-[0.3em] uppercase">100xSchool presents</span>
              <Sparkles className="w-4 h-4 text-pink-hot" />
            </div>
          </div>

          {/* Main layout: Content + Divider + Stub */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
            
            {/* Left: Main content */}
            <div className="flex-1 lg:pr-8">
              {/* Title */}
              <div className="mb-8">
                <h2 className="font-display text-pink-hot italic text-2xl md:text-3xl mb-1">Valentine's</h2>
                <h1 className="font-display text-white text-5xl md:text-7xl font-bold tracking-tight">BALL</h1>
                <div className="text-pink-soft text-sm mt-2">2026</div>
              </div>

              {/* Event details with heart markers */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-hot fill-pink-hot flex-shrink-0" />
                  <span className="text-pink-soft text-sm">Date //</span>
                  <span className="text-white font-semibold">February 12th, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-hot fill-pink-hot flex-shrink-0" />
                  <span className="text-pink-soft text-sm">Time //</span>
                  <span className="text-white font-semibold">4:00 PM - Midnight</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-hot fill-pink-hot flex-shrink-0" />
                  <span className="text-pink-soft text-sm">Location //</span>
                  <span className="text-white font-semibold">100xSchool Campus</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-hot fill-pink-hot flex-shrink-0" />
                  <span className="text-pink-soft text-sm">Dress Code //</span>
                  <span className="text-white font-semibold">Semi-Formal 💃</span>
                </div>
              </div>

              {/* Bottom highlights strip */}
              <div className="border border-pink-hot/50 rounded-lg p-3 bg-pink-hot/5">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-pink-soft">
                  <span className="flex items-center gap-1">🎵 Live DJ</span>
                  <span className="text-pink-hot">•</span>
                  <span className="flex items-center gap-1">💝 Romance</span>
                  <span className="text-pink-hot">•</span>
                  <span className="flex items-center gap-1">📸 Photos</span>
                  <span className="text-pink-hot">•</span>
                  <span className="flex items-center gap-1">🍰 Desserts</span>
                </div>
              </div>
            </div>

            {/* Vertical divider with hearts - desktop only */}
            <div className="hidden lg:flex flex-col items-center justify-center px-4 gap-2">
              {[...Array(8)].map((_, i) => <div key={i} className={`${i % 2 === 0 ? 'text-pink-hot' : 'text-pink-soft/50'}`}>
                  {i % 2 === 0 ? <Heart className="w-3 h-3 fill-current" /> : <div className="w-1 h-4 bg-pink-hot/30 rounded-full" />}
                </div>)}
            </div>

            {/* Horizontal divider - mobile only */}
            <div className="flex lg:hidden items-center justify-center gap-2 py-4">
              {[...Array(12)].map((_, i) => <div key={i} className={`${i % 2 === 0 ? 'text-pink-hot' : 'text-pink-soft/50'}`}>
                  {i % 2 === 0 ? <Heart className="w-2 h-2 fill-current" /> : <div className="w-3 h-0.5 bg-pink-hot/30 rounded-full" />}
                </div>)}
            </div>

            {/* Right: Stub section */}
            
          </div>
        </div>

        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-ticket-shimmer pointer-events-none opacity-30" />
      </div>

      {/* Email confirmation - outside ticket */}
      <div className="text-center mt-6 text-muted-foreground font-body">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-pink-soft">
          💌 Confirmation sent to <span className="text-pink-hot font-semibold">{email}</span>
        </span>
      </div>
    </div>;
};
export default TicketConfirmation;