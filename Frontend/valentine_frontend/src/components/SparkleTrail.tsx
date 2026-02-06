 import { useEffect, useState } from "react";
 
 interface Sparkle {
   id: number;
   x: number;
   y: number;
   size: number;
   color: string;
 }
 
 const SparkleTrail = () => {
   const [sparkles, setSparkles] = useState<Sparkle[]>([]);
 
   useEffect(() => {
     const colors = [
       "hsl(340, 82%, 52%)",
       "hsl(15, 90%, 65%)",
       "hsl(270, 60%, 80%)",
       "hsl(25, 100%, 90%)",
     ];
 
     let sparkleId = 0;
 
     const handleMouseMove = (e: MouseEvent) => {
       if (Math.random() > 0.3) return; // Throttle sparkle creation
 
       const newSparkle: Sparkle = {
         id: sparkleId++,
         x: e.clientX + (Math.random() - 0.5) * 20,
         y: e.clientY + (Math.random() - 0.5) * 20,
         size: 4 + Math.random() * 8,
         color: colors[Math.floor(Math.random() * colors.length)],
       };
 
       setSparkles((prev) => [...prev.slice(-15), newSparkle]);
     };
 
     window.addEventListener("mousemove", handleMouseMove);
     return () => window.removeEventListener("mousemove", handleMouseMove);
   }, []);
 
   useEffect(() => {
     if (sparkles.length === 0) return;
 
     const timer = setTimeout(() => {
       setSparkles((prev) => prev.slice(1));
     }, 400);
 
     return () => clearTimeout(timer);
   }, [sparkles]);
 
   return (
     <div className="fixed inset-0 pointer-events-none z-50">
       {sparkles.map((sparkle) => (
         <div
           key={sparkle.id}
           className="absolute animate-sparkle-fade"
           style={{
             left: sparkle.x,
             top: sparkle.y,
             width: sparkle.size,
             height: sparkle.size,
           }}
         >
           <svg viewBox="0 0 24 24" fill={sparkle.color}>
             <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
           </svg>
         </div>
       ))}
     </div>
   );
 };
 
 export default SparkleTrail;