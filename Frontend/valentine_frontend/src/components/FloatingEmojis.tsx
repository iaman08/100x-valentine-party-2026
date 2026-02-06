import { Heart } from "lucide-react";

const FloatingEmojis = () => {
  const heartStyles = [
    { color: "text-pink-hot", fill: "fill-pink-hot" },
    { color: "text-pink-soft", fill: "fill-pink-soft" },
    { color: "text-coral", fill: "fill-coral" },
    { color: "text-red-heart", fill: "fill-red-heart" },
    { color: "text-lavender", fill: "fill-lavender" },
    { color: "text-pink-hot", fill: "fill-pink-soft" },
  ];

  const elements = Array.from({ length: 35 }, (_, i) => {
    const style = heartStyles[i % heartStyles.length];
    return {
      id: i,
      color: `${style.color} ${style.fill}`,
      left: Math.random() * 100,
      delay: Math.random() * 25,
      duration: 12 + Math.random() * 15,
      size: 12 + Math.random() * 24,
      opacity: 0.2 + Math.random() * 0.4,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <Heart
          key={element.id}
          className={`absolute ${element.color}`}
          style={{
            left: `${element.left}%`,
            bottom: "-50px",
            width: element.size,
            height: element.size,
            opacity: element.opacity,
            animation: `float-up ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingEmojis;
