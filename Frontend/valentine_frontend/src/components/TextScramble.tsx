 import { useEffect, useState, useRef } from "react";
 
 interface TextScrambleProps {
   text: string;
   className?: string;
   delay?: number;
 }
 
 const TextScramble = ({ text, className = "", delay = 0 }: TextScrambleProps) => {
   const [displayText, setDisplayText] = useState("");
   const [isAnimating, setIsAnimating] = useState(false);
   const chars = "!<>-_\\/[]{}—=+*^?#________";
 
   useEffect(() => {
     const timeout = setTimeout(() => {
       setIsAnimating(true);
     }, delay);
 
     return () => clearTimeout(timeout);
   }, [delay]);
 
   useEffect(() => {
     if (!isAnimating) return;
 
     let iteration = 0;
     const maxIterations = text.length;
 
     const interval = setInterval(() => {
       setDisplayText(
         text
           .split("")
           .map((char, index) => {
             if (index < iteration) {
               return char;
             }
             if (char === " ") return " ";
             return chars[Math.floor(Math.random() * chars.length)];
           })
           .join("")
       );
 
       iteration += 1 / 3;
 
       if (iteration >= maxIterations) {
         clearInterval(interval);
         setDisplayText(text);
       }
     }, 30);
 
     return () => clearInterval(interval);
   }, [isAnimating, text]);
 
   return (
     <span className={className}>
       {displayText || text.replace(/./g, " ")}
     </span>
   );
 };
 
 export default TextScramble;