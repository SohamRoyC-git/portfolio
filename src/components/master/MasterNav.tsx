"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Mail, Compass, ExternalLink } from "lucide-react";

interface MasterNavProps {
  onNavigate: (id: string) => void;
  activeId: string;
}

const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" r="2" />
  </svg>
);

export const MasterNav: React.FC<MasterNavProps> = ({ onNavigate, activeId }) => {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Live Kolkata IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const links = [
    { id: "monument-hero", num: "01", label: "INDEX", sub: "Terrace Perspective & Master Identity" },
    { id: "monument-statement", num: "02", label: "STATEMENT", sub: "Kinetic Intention & Digital Philosophy" },
    { id: "monument-creed", num: "03", label: "CREED", sub: "Education & Professional Foundations" },
    { id: "monument-exhibition", num: "04", label: "COMMISSIONS", sub: "Selected Engineering Showcase" },
    { id: "monument-matrix", num: "05", label: "BLUEPRINT", sub: "Technical Architecture & Live Code" },
    { id: "monument-terminal", num: "06", label: "CONTACT", sub: "Initiation & Direct Transmission" },
  ];

  const handleLinkClick = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* 
        Top Floating Action Bar (Pure Transparent, No Black Bar)
        Clean white icons and crisp white text floating directly over artwork
      */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center w-full pointer-events-none select-none">
        <div
          ref={navRef}
          className="w-full flex items-center justify-between gap-4 pointer-events-auto py-5 sm:py-7 px-5 sm:px-10 md:px-14 bg-transparent border-none"
        >
          {/* TOP LEFT: Pure Transparent White Icons (LinkedIn + CV PDF) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/soham-roychoudhury-a3537a364/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 bg-white/5 hover:bg-white/20 text-white transition-all backdrop-blur-sm group cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <LinkedinIcon size={14} className="text-white group-hover:scale-110 transition-transform" />
            </a>

            {/* Curriculum Vitae (PDF) */}
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Soham Roychoudhury CV (PDF)"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 bg-white/5 hover:bg-white/20 text-white transition-all backdrop-blur-sm group cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <Mail size={14} className="text-white group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* TOP RIGHT: Pure Transparent Connect Action + Forge-Style NAVIGATE */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Connect Action Button */}
            <button
              onClick={() => onNavigate("monument-terminal")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-white border border-white/30 bg-white/5 hover:bg-white hover:text-[#0A0C10] transition-all backdrop-blur-sm cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </button>

            {/* Forge-Style NAVIGATE Button with 3 Horizontal Lines */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/5 hover:bg-white/20 text-white transition-all backdrop-blur-sm group cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <span className="font-sans font-black text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-white">
                NAVIGATE
              </span>
              <div className="flex flex-col justify-center gap-[3.5px] w-4 h-3">
                <span className="w-full h-[1.5px] bg-white group-hover:bg-[#FF8C38] transition-colors rounded-full" />
                <span className="w-full h-[1.5px] bg-white group-hover:bg-[#FF8C38] transition-colors rounded-full" />
                <span className="w-full h-[1.5px] bg-white group-hover:bg-[#FF8C38] transition-colors rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FORGE AUTOMOTIVE LUXURY NAVIGATION OVERLAY WITH CINEMATIC FRAMER MOTION   */}
      {/* Curtain reveal, kinetic staggered links, and real-time IST telemetry      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#09070A]/98 backdrop-blur-3xl flex flex-col justify-between p-5 xs:p-6 sm:p-12 md:p-16 select-none overflow-y-auto overscroll-contain"
          >
            {/* Top Bar inside Overlay */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8C38] animate-pulse" />
                <span className="font-sans font-black text-xs sm:text-sm text-white tracking-[0.24em] uppercase">
                  PORTFOLIO DIRECTORY
                </span>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white hover:border-[#FF8C38] hover:text-[#FF8C38] text-xs font-mono tracking-wider transition-colors cursor-pointer"
              >
                <span>CLOSE</span>
                <X size={15} />
              </button>
            </motion.div>

            {/* Nav Links Stack (Monumental Forge Style with Staggered Kinetic Typography) */}
            <div className="max-w-4xl mx-auto w-full my-auto py-6 sm:py-12 flex flex-col gap-2.5 sm:gap-5">
              {links.map((link, idx) => {
                const isActive = activeId === link.id;
                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    transition={{
                      delay: 0.12 + idx * 0.05,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => handleLinkClick(link.id)}
                    className="group flex flex-col sm:flex-row sm:items-baseline justify-between text-left py-2 border-b border-white/5 hover:border-[#FF8C38]/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-baseline gap-3 sm:gap-6">
                      <span className="font-mono text-xs sm:text-sm text-[#FF8C38]/70 group-hover:text-[#FF8C38] group-hover:translate-x-1 transition-transform">
                        {link.num}
                      </span>
                      <span
                        className={`font-sans font-black text-xl xs:text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight transition-colors ${
                          isActive
                            ? "text-[#FF8C38]"
                            : "text-white group-hover:text-[#EAD7C0]"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>

                    <span className="font-sans text-[10px] sm:text-xs text-white/40 group-hover:text-white/80 transition-colors mt-0.5 sm:mt-0 font-medium tracking-wide">
                      {link.sub}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Telemetry Bar (Live Clock, Status, Coordinates & PDF CV) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-white/10 pt-4 sm:pt-6 font-mono text-[10px] sm:text-xs text-white/60"
            >
              {/* Live Clock & Coordinates Telemetry */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Compass size={13} className="text-[#FF8C38]" />
                <span className="text-white font-bold tracking-wider">
                  KOLKATA {time || "00:00:00"} IST
                </span>
                <span className="hidden md:inline text-white/30">•</span>
                <span className="hidden md:inline text-white/50">22.5726° N · 88.3639° E</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] ml-1" />
                <span className="text-emerald-400 font-bold uppercase tracking-wider">AVAILABLE</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/80 hover:text-[#FF8C38] transition-colors"
                >
                  <span>CURRICULUM VITAE (PDF)</span>
                  <ExternalLink size={11} />
                </a>
                <span className="text-white/20">|</span>
                <a
                  href="https://www.linkedin.com/in/soham-roychoudhury-a3537a364/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/80 hover:text-[#FF8C38] transition-colors"
                >
                  <span>LINKEDIN</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
