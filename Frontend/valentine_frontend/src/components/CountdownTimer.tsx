import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const targetDate = new Date("2026-02-12T16:00:00");

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days, emoji: "📅" },
    { label: "Hours", value: timeLeft.hours, emoji: "⏰" },
    { label: "Mins", value: timeLeft.minutes, emoji: "⚡" },
    { label: "Secs", value: timeLeft.seconds, emoji: "💗" },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      {timeBlocks.map((block, index) => (
        <div
          key={block.label}
          className="flex flex-col items-center"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border-2 border-pink-soft backdrop-blur-sm flex items-center justify-center shadow-cute group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl md:text-3xl font-display text-pink-hot font-bold">
                {String(block.value).padStart(2, "0")}
              </span>
            </div>
            <span className="absolute -top-2 -right-2 text-lg">{block.emoji}</span>
          </div>
          <span className="mt-2 text-xs md:text-sm text-muted-foreground font-body font-semibold">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;