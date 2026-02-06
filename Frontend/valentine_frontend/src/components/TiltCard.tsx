 import { useRef, useState, ReactNode } from "react";
 
 interface TiltCardProps {
   children: ReactNode;
   className?: string;
   glareEnabled?: boolean;
 }
 
 const TiltCard = ({ children, className = "", glareEnabled = true }: TiltCardProps) => {
   const cardRef = useRef<HTMLDivElement>(null);
   const [transform, setTransform] = useState("perspective(1000px) rotateX(0) rotateY(0)");
   const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
 
   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
     if (!cardRef.current) return;
     
     const rect = cardRef.current.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     const centerX = rect.width / 2;
     const centerY = rect.height / 2;
     
     const rotateX = (y - centerY) / 10;
     const rotateY = (centerX - x) / 10;
     
     setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
     setGlarePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
   };
 
   const handleMouseLeave = () => {
     setTransform("perspective(1000px) rotateX(0) rotateY(0) scale(1)");
     setGlarePosition({ x: 50, y: 50 });
   };
 
   return (
     <div
       ref={cardRef}
       className={`relative transition-transform duration-200 ease-out ${className}`}
       style={{ transform, transformStyle: "preserve-3d" }}
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
     >
       {children}
       {glareEnabled && (
         <div
           className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
           style={{
             background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
           }}
         />
       )}
     </div>
   );
 };
 
 export default TiltCard;