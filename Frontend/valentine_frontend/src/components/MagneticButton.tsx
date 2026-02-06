 import { useRef, ReactNode } from "react";
 import { Button } from "@/components/ui/button";
 
 interface MagneticButtonProps {
   children: ReactNode;
   variant?: "default" | "love" | "cute" | "outline";
   size?: "default" | "sm" | "lg" | "xl";
   onClick?: () => void;
   className?: string;
 }
 
 const MagneticButton = ({
   children,
   variant = "love",
   size = "xl",
   onClick,
   className = "",
 }: MagneticButtonProps) => {
   const buttonRef = useRef<HTMLButtonElement>(null);
 
   const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
     if (!buttonRef.current) return;
     const rect = buttonRef.current.getBoundingClientRect();
     const x = e.clientX - rect.left - rect.width / 2;
     const y = e.clientY - rect.top - rect.height / 2;
     buttonRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
   };
 
   const handleMouseLeave = () => {
     if (!buttonRef.current) return;
     buttonRef.current.style.transform = "translate(0, 0) scale(1)";
   };
 
   return (
     <Button
       ref={buttonRef}
       variant={variant}
       size={size}
       onClick={onClick}
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
       className={`transition-transform duration-200 ease-out ${className}`}
     >
       {children}
     </Button>
   );
 };
 
 export default MagneticButton;