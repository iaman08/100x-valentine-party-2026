 import { useRef, useCallback } from "react";
 
 export const useMagneticEffect = (strength: number = 0.3) => {
   const ref = useRef<HTMLElement>(null);
 
   const handleMouseMove = useCallback(
     (e: React.MouseEvent<HTMLElement>) => {
       if (!ref.current) return;
       const { left, top, width, height } = ref.current.getBoundingClientRect();
       const x = e.clientX - left - width / 2;
       const y = e.clientY - top - height / 2;
       ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
     },
     [strength]
   );
 
   const handleMouseLeave = useCallback(() => {
     if (!ref.current) return;
     ref.current.style.transform = "translate(0, 0) scale(1)";
   }, []);
 
   return { ref, handleMouseMove, handleMouseLeave };
 };