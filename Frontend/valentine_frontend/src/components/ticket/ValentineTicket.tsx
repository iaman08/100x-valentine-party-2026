'use client'; // <--- MUST HAVE THIS

import React from 'react';
import { motion } from 'framer-motion';

// ... interface code ...

// --- Types ---
interface TicketProps {
  date?: string;
  time?: string;
  location?: string;
  ticketId?: string;
  studentName?: string;
  referralCode?: string;
}

const ValentineTicket: React.FC<TicketProps> = ({
  date = "FEB 12, 2026",
  time = "4:00 PM - MIDNIGHT",
  location = "100xSchool, MAIN CAMPUS",
  ticketId = "VAL-26-XOYO-99",
  studentName = "Admit One Scholar",
  referralCode
}) => {
  // ... const heartClipPath ...

  return (
    // Update font classes to match Next.js variables
    <div className="flex flex-col items-center justify-center p-6 font-[var(--font-montserrat)] antialiased text-rose-100 selection:bg-pink-500/30">

      <motion.div
        // ... animation props ...
        className="mb-10 text-center space-y-2"
      >
        {/* ... header icons ... */}

        {/* Update Title Font */}
        <div className="min-h-screen  flex flex-col items-center justify-center p-6 font-['Montserrat'] antialiased text-rose-100 selection:bg-pink-500/30">

          {/* Header Labeling */}
          <div className="mb-10 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-pink-300">
              <HeartIconOutline size={14} />
              <span className="text-[11px] tracking-[0.3em] uppercase font-medium">100xPlayhouse Team</span>
              <HeartIconOutline size={14} />
            </div>
            <h1 className="text-3xl font-['Playfair_Display'] font-bold tracking-wider uppercase text-rose-200 italic">
              your <span className="text-pink-500">PASS TO THE</span> NIGHT
            </h1>
          </div>

          {/* TICKET MAIN CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden group w-full max-w-[900px] h-[400px] flex drop-shadow-[0_10px_40px_rgba(236,72,153,0.2)]"
          >

            {/* --- LEFT SECTION (Main Body) --- */}
            <div className="relative flex-[2.5] bg-gradient-to-br from-[#2c0a12] to-[#1f070c] border-y border-l border-pink-900/50 rounded-l-[2rem] p-10 overflow-hidden flex flex-col justify-between">

              {/* Subtle Romantic Pattern Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgNC41QzguNSAzIDYuNSAzIDUgNC41QzMuNSA2IDMuNSA4IDUgOS41TDEwIDE0LjVMMTUgOS41QzE2LjUgOCAxNi41IDYgMTUgNC41QzEzLjUgMyAxMS41IDMgMTAgNC41WiIgZmlsbD0iI2ZmYjZYzIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')] bg-repeat z-0" />

              {/* Corner Flourishes */}
              <div className="absolute top-0 left-0 text-pink-800/40 z-0 m-4"><CornerFlourish /></div>
              <div className="absolute bottom-0 left-0 text-pink-800/40 z-0 m-4 rotate-[-90deg]"><CornerFlourish /></div>

              {/* Top Metadata Line */}
              <div className="flex justify-between items-center z-20 border-b border-rose-900/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-pink-600 flex items-center justify-center shadow-[0_0_10px_#ec4899]">
                    <HeartIconSolid size={12} color="white" />
                  </div>
                  <span className="text-xs font-medium text-rose-300 tracking-wider uppercase">{studentName}</span>
                </div>
                <span className="text-[11px] font-mono text-pink-400/80 tracking-widest">{ticketId}</span>
              </div>

              {/* Main Title Section */}
              <div className="z-20 py-4">
                <motion.h2
                  className="text-pink-500 font-['Playfair_Display'] italic font-black text-6xl tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  Valentine
                </motion.h2>
                <h1 className="text-rose-100 font-['Playfair_Display'] font-bold text-5xl uppercase tracking-[0.1em] leading-none mt-2 opacity-95">
                  Ball Party
                </h1>
              </div>

              {/* Details & Footer Badge */}
              <div className="flex justify-between items-end z-20">
                {/* Event Details */}
                <div className="space-y-2 text-sm  tracking-wider text-rose-200/80 font-bold">
                  <div className="flex items-center gap-3">
                    <HeartBullet /> <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartBullet /> <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartBullet /> <span>{location}</span>
                  </div>
                </div>

                {/* "VIP AMOUR" Badge */}
                <div className="flex flex-col items-start justify-center gap-1 bg-pink-950/40 border border-pink-800/60 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-[10px] text-pink-400 uppercase tracking-widest">Ticket Type</span>
                  <div className="text-pink-500 text-lg font-['Playfair_Display'] font-bold italic flex items-center gap-2">
                    CONFIRMED <HeartIconSolid size={14} />
                  </div>
                </div>
              </div>

              {/* Referral Code Section - Only shown for campus students */}
              {referralCode && (
                <div className="z-20 mt-3 pt-3 border-t border-rose-900/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-pink-400 uppercase tracking-widest">Your Referral Code</span>
                    <span className="text-pink-300 font-mono text-sm font-bold tracking-widest bg-pink-950/50 px-3 py-1 rounded-md border border-pink-800/50">
                      {referralCode}
                    </span>
                  </div>
                  <p className="text-[9px] text-rose-400/70 mt-1">Share with friends - up to 5 uses!</p>
                </div>
              )}
            </div>

            {/* --- PERFORATION SEPARATOR --- */}
            <div className="relative w-[2px] bg-pink-900/40 flex flex-col items-center justify-between py-2 z-30">
              {/* Top notch */}
              <div className="absolute -top-3 w-6 h-6 bg-pink-700 rounded-full border-b border-pink-900/50" />
              {/* Dotted Line */}
              <div className="h-full w-full border-r-2 border-dashed border-pink-300/60" />
              {/* Bottom notch */}
              <div className="absolute -bottom-3 w-6 h-6 bg-pink-700 rounded-full border-t border-pink-900/50" />
            </div>

            {/* --- RIGHT SECTION (Stub & Heart QR) --- */}
            <div className="relative flex-1 bg-gradient-to-br from-[#25080f] to-[#1a050a] border-y border-r border-pink-900/50 rounded-r-[2rem] p-6 flex flex-col items-center justify-between overflow-hidden">

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 text-pink-800/40 z-0 m-4 rotate-90"><CornerFlourish /></div>

              {/* Top Deco */}
              <div className="w-full flex justify-center gap-3 text-pink-600 z-10 opacity-60">
                <HeartIconOutline size={16} />
                <HeartIconOutline size={16} />
                <HeartIconOutline size={16} />
              </div>

              {/* Center Section: The Heart QR */}
              <div className="flex flex-col items-center justify-center gap-4 w-full z-20 my-4">

                {/* THE QR CODE */}
                <div className="relative drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                  {/* Glowing border container */}
                  <div className="p-1.5 bg-gradient-to-tr from-pink-600 to-rose-400 rounded-xl">
                    {/* White background for QR contrast */}
                    <div className="bg-white w-28 h-28 flex items-center justify-center rounded-lg overflow-hidden">
                      {/* The QR Code Image */}
                      <img
                        src="src/assets/qr-code.jpeg"
                        alt="QR Code"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Heartbeat Graphic */}
                <div className="w-full h-12 flex justify-center text-pink-500 opacity-60 mt-2">
                  <HeartbeatSVG />
                </div>
              </div>

              {/* Bottom Legal Text */}
              <div className="text-center z-10">
                <p className="text-[9px] leading-tight text-rose-300/70 uppercase font-extrabold px-2">
                  Present current student ID + this pass at entry. Formal attire required. Non-transferable. Have a lovely night.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <p className="mt-8 text-[10px] text-pink-300 font-medium tracking-[0.2em] uppercase">
            Crafted With Love by 100xSchool 🌷
          </p>
        </div>


      </motion.div>

      {/* ... Rest of the component logic is identical to previous version ... */}
      {/* Just ensure anywhere you had font-['Playfair_Display'] you use font-[var(--font-playfair)] */}

    </div>
  );
};

// --- DESIGNER ASSETS (SVGs) ---

// A small solid heart for bullet points
const HeartBullet = () => (
  <span className="text-pink-500 inline-block transform scale-75">
    <HeartIconSolid size={12} />
  </span>
);

const HeartIconSolid = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HeartIconOutline = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const HeartbeatSVG = () => (
  <svg viewBox="0 0 100 30" className="w-full h-full stroke-current fill-none">
    <path d="M0 15 H 35 L 40 5 L 45 25 L 50 15 L 55 18 L 60 15 H 100" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="47.5" cy="15" r="2" fill="currentColor" className="animate-ping opacity-75" />
  </svg>
);

// A subtle corner decoration
const CornerFlourish = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0 0 C 20 0, 40 20, 40 40" strokeDasharray="2 2" />
    <path d="M5 0 C 22 0, 40 18, 40 35" opacity="0.5" />
    <circle cx="0" cy="0" r="2" fill="currentColor" />
  </svg>
)

export default ValentineTicket;
