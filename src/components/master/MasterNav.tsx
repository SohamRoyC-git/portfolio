"use client";

import React, { useState, useEffect, useRef } from "react";
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
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const MasterNav: React.FC<MasterNavProps> = ({ onNavigate, activeId }) => {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Track scroll state for subtle glass reinforcement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Top Floating Action Bar (Forge Automotive Architecture) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center w-full pointer-events-none select-none transition-all duration-300">
        <div
          ref={navRef}
          className={`w-full flex items-center justify-between gap-4 pointer-events-auto transition-all duration-300 ${
            isScrolled
              ? "py-3 sm:py-4 px-4 sm:px-10 md:px-14 bg-black/60 backdrop-blur-xl border-b border-white/10"
              : "py-4 sm:py-6 px-4 sm:px-10 md:px-14 bg-transparent border-b border-transparent"
          }`}
        >
          {/* TOP LEFT: LinkedIn & CV PDF Action Links (SR Text Removed) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/soham-roychoudhury-a3537a364/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-black/40 hover:bg-[#FF8C38] hover:border-[#FF8C38] text-white/90 hover:text-white transition-all shadow-sm backdrop-blur-md group cursor-pointer"
            >
              <LinkedinIcon size={14} className="group-hover:scale-110 transition-transform" />
            </a>

            {/* Curriculum Vitae (PDF) */}
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Soham Roychoudhury CV (PDF)"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-black/40 hover:bg-[#FF8C38] hover:border-[#FF8C38] text-white/90 hover:text-white transition-all shadow-sm backdrop-blur-md group cursor-pointer"
            >
              <Mail size={14} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* TOP RIGHT: Connect Action + Forge-Style NAVIGATE Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Connect Action Button */}
            <button
              onClick={() => onNavigate("monument-terminal")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-[#0A0C10] border border-white/20 hover:border-white transition-all shadow-sm backdrop-blur-md cursor-pointer"
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </button>

            {/* Forge-Style NAVIGATE Button with 3 Horizontal Lines */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/40 hover:bg-black/70 text-white transition-all shadow-sm backdrop-blur-md group cursor-pointer"
            >
              <span className="font-sans font-black text-[10px] sm:text-[11px] tracking-[0.24em] uppercase">
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
      {/* FORGE AUTOMOTIVE LUXURY NAVIGATION OVERLAY                                */}
      {/* Full-screen architectural navigation menu with section indexes and clock  */}
      {/* ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0709]/96 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 md:p-16 animate-in fade-in duration-200">
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-6">
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
          </div>

          {/* Nav Links Stack (Monumental Forge Style) */}
          <div className="max-w-4xl mx-auto w-full my-auto py-8 sm:py-12 flex flex-col gap-4 sm:gap-6">
            {links.map((link) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="group flex flex-col sm:flex-row sm:items-baseline justify-between text-left py-2 border-b border-white/5 hover:border-[#FF8C38]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs sm:text-sm text-[#FF8C38]/70 group-hover:text-[#FF8C38]">
                      {link.num}
                    </span>
                    <span
                      className={`font-sans font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight transition-colors ${
                        isActive
                          ? "text-[#FF8C38]"
                          : "text-white group-hover:text-[#EAD7C0]"
                      }`}
                    >
                      {link.label}
                    </span>
                  </div>

                  <span className="font-sans text-[11px] sm:text-xs text-white/40 group-hover:text-white/80 transition-colors mt-1 sm:mt-0 font-medium tracking-wide">
                    {link.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Telemetry Bar (Live Clock, Status, Coordinates & PDF CV) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 sm:pt-6 font-mono text-[10px] sm:text-xs text-white/60">
            {/* Live Clock & Coordinates Telemetry */}
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      )}
    </>
  );
};
