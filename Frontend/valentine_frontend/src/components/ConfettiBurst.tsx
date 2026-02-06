import { useEffect, useRef } from "react";

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
}

const ConfettiBurst = ({ trigger, onComplete }: ConfettiBurstProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#ec4899", // pink-hot
      "#f9a8d4", // pink-soft
      "#fb923c", // coral
      "#fef3c7", // peach
      "#c4b5fd", // lavender
      "#86efac", // mint
      "#ef4444", // red-heart
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      shape: "circle" | "square" | "heart";
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const particleCount = 150;

    // Create particles from center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 8 + Math.random() * 12;
      
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape: ["circle", "square", "heart"][Math.floor(Math.random() * 3)] as Particle["shape"],
        alpha: 1,
        decay: 0.008 + Math.random() * 0.008,
      });
    }

    const drawHeart = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size / 4);
      ctx.bezierCurveTo(size / 2, -size, size, -size / 4, 0, size / 2);
      ctx.bezierCurveTo(-size, -size / 4, -size / 2, -size, 0, -size / 4);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        activeParticles++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.99; // air resistance
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        } else if (p.shape === "heart") {
          drawHeart(p.x, p.y, p.size / 2, p.rotation);
        }
      });

      ctx.globalAlpha = 1;

      if (activeParticles > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default ConfettiBurst;
