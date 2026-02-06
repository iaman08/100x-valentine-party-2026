import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heart, Sparkles } from "lucide-react";
import ConfettiBurst from "./ConfettiBurst";
import TicketConfirmation from "./TicketConfirmation";

const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    bringing: "solo",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowConfetti(true);
    toast.success("You're on the list! 🎉", {
      description: "An invitation has been sent to your email with all the details!",
    });
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-fun opacity-30" />
        <ConfettiBurst trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="relative z-10">
          <TicketConfirmation 
            name={formData.name} 
            email={formData.email} 
            bringing={formData.bringing} 
          />
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-fun opacity-30" />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="text-center mb-10">
          <span className="text-4xl mb-4 block">🎟️</span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Get Your <span className="text-gradient-love">Free Ticket!</span>
          </h2>
          <p className="text-muted-foreground font-body">
            Spots are limited — save yours now!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8 rounded-3xl bg-card border-2 border-pink-soft shadow-cute"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-semibold">
              Your Name ✏️
            </Label>
            <Input
              id="name"
              required
              placeholder="What should we call you?"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-pink-light/30 border-pink-soft text-foreground placeholder:text-muted-foreground focus:border-pink-hot focus:ring-pink-hot rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-semibold">
              Student Email 📧
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-pink-light/30 border-pink-soft text-foreground placeholder:text-muted-foreground focus:border-pink-hot focus:ring-pink-hot rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bringing" className="text-foreground font-semibold">
              Coming with? 💕
            </Label>
            <select
              id="bringing"
              value={formData.bringing}
              onChange={(e) => setFormData({ ...formData, bringing: e.target.value })}
              className="w-full h-12 rounded-xl bg-pink-light/30 border border-pink-soft text-foreground px-4 font-body focus:border-pink-hot focus:ring-1 focus:ring-pink-hot focus:outline-none"
            >
              <option value="solo">Flying solo ✨</option>
              <option value="date">Bringing my date 💑</option>
              <option value="friends">With my besties 👯</option>
              <option value="squad">The whole squad 🎊</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="love"
            size="lg"
            className="w-full h-14 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Saving your spot...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Count Me In! 🎉
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Free entry • Open to all 100xSchool students • Snacks included 🍪
          </p>
        </form>
      </div>
    </section>
  );
};

export default RSVPSection;