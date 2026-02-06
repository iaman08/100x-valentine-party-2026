 const MorphingBlob = () => {
   return (
     <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
       {/* Large morphing blob */}
       <div
         className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] opacity-30 animate-morph-slow"
         style={{
           background: "radial-gradient(circle, hsl(340 82% 52% / 0.4) 0%, hsl(15 90% 65% / 0.2) 50%, transparent 70%)",
           filter: "blur(60px)",
         }}
       />
       
       {/* Secondary blob */}
       <div
         className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] opacity-25 animate-morph-slow-reverse"
         style={{
           background: "radial-gradient(circle, hsl(270 60% 80% / 0.4) 0%, hsl(340 80% 85% / 0.2) 50%, transparent 70%)",
           filter: "blur(50px)",
           animationDelay: "-5s",
         }}
       />
       
       {/* Small accent blob */}
       <div
         className="absolute top-1/3 left-1/4 w-[300px] h-[300px] opacity-20 animate-float-diagonal"
         style={{
           background: "radial-gradient(circle, hsl(25 100% 90% / 0.5) 0%, transparent 60%)",
           filter: "blur(40px)",
         }}
       />
     </div>
   );
 };
 
 export default MorphingBlob;