"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowUpRight, Menu, X, Compass } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MasterNavProps {
  onNavigate: (id: string) => void;
  activeId: string;
}

export const MasterNav: React.FC<MasterNavProps> = ({ onNavigate, activeId }) => {
  const [time, setTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== "undefined") {
      const nextSection = document.getElementById("monument-statement");
      if (nextSection) {
        const rect = nextSection.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.82;
      }
      return window.scrollY > window.innerHeight * 0.7;
    }
    return false;
  });

  const navRef = useRef<HTMLDivElement | null>(null);
  const telemetryRef = useRef<HTMLDivElement | null>(null);

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

  // GSAP ScrollTrigger: Stays edge-to-edge transparent through the entire Hero,
  // and morphs into the compact glass dock ONLY when the next section is entering the screen
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const nextSection = document.getElementById("monument-statement");

    const trigger = ScrollTrigger.create({
      trigger: nextSection || "#monument-hero",
      start: nextSection ? "top 80%" : "bottom 250px",
      end: 99999,
      onToggle: (self) => {
        setIsScrolled(self.isActive);
      },
    });

    return () => trigger.kill();
  }, []);

  // GSAP UI Morph Animation: Full-width cinematic header <--> Compact floating glass dock
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !navRef.current) return;

    const nav = navRef.current;
    const isMobile = window.innerWidth < 768;

    if (isScrolled) {
      // 1. Morph to Compact Floating Glass Dock (Frosted Obsidian CAD Pill)
      gsap.to(nav, {
        maxWidth: isMobile ? "calc(100% - 24px)" : "1020px",
        marginTop: isMobile ? "10px" : "16px",
        paddingTop: isMobile ? "8px" : "10px",
        paddingBottom: isMobile ? "8px" : "10px",
        paddingLeft: isMobile ? "16px" : "28px",
        paddingRight: isMobile ? "16px" : "28px",
        borderRadius: "9999px",
        backgroundColor: "rgba(10, 12, 16, 0.85)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
        backdropFilter: "blur(20px)",
        duration: 0.48,
        ease: "power3.out",
      });

      if (telemetryRef.current) {
        gsap.to(telemetryRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            if (telemetryRef.current) telemetryRef.current.style.display = "none";
          },
        });
      }
    } else {
      // 2. Morph to Edge-to-Edge Fully Transparent Cinematic Bar
      if (telemetryRef.current) {
        if (window.innerWidth >= 1280) {
          telemetryRef.current.style.display = "flex";
          gsap.to(telemetryRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            delay: 0.1,
            ease: "power2.out",
          });
        } else {
          telemetryRef.current.style.display = "none";
        }
      }

      gsap.to(nav, {
        maxWidth: "100%",
        marginTop: "0px",
        paddingTop: isMobile ? "16px" : "26px",
        paddingBottom: isMobile ? "16px" : "26px",
        paddingLeft: isMobile ? "20px" : "clamp(1.5rem, 5vw, 5rem)",
        paddingRight: isMobile ? "20px" : "clamp(1.5rem, 5vw, 5rem)",
        borderRadius: "0px",
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderColor: "rgba(255, 255, 255, 0)",
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        backdropFilter: "blur(0px)",
        duration: 0.48,
        ease: "power3.out",
      });
    }
  }, [isScrolled]);

  const links = [
    { id: "monument-hero", label: "INDEX" },
    { id: "monument-statement", label: "STATEMENT" },
    { id: "monument-creed", label: "CREED" },
    { id: "monument-exhibition", label: "WORK" },
    { id: "monument-matrix", label: "BLUEPRINT" },
    { id: "monument-terminal", label: "CONTACT" },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex justify-center w-full pointer-events-none select-none"
      >
        <div
          ref={navRef}
          className={`w-full flex items-center justify-between gap-4 sm:gap-6 pointer-events-auto border ${
            isScrolled
              ? "bg-[#0A0C10]/85 border-white/12 backdrop-blur-xl"
              : "bg-transparent border-transparent"
          }`}
          style={{
            maxWidth: "100%",
            paddingTop: "26px",
            paddingBottom: "26px",
            paddingLeft: "clamp(1.5rem, 5vw, 5rem)",
            paddingRight: "clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          {/* Brand Monogram & Name */}
          <div
            onClick={() => onNavigate("monument-hero")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
            data-cursor="pointer"
            data-cursor-text="INDEX"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8C38] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8C38]" />
            </span>
            <span
              className={`font-sans font-black text-[10px] xs:text-[11px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase shrink-0 whitespace-nowrap transition-colors duration-200 ${
                isScrolled
                  ? "text-white group-hover:text-[#FF8C38]"
                  : "text-white group-hover:text-amber-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              }`}
            >
              SR // SOHAM ROYCHOUDHURY
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 sm:gap-9 font-sans font-bold text-xs tracking-[0.16em] uppercase">
            {links.map((link) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative cursor-pointer py-1 transition-all duration-300 ${
                    isActive
                      ? "text-[#FF7A00] font-black"
                      : "text-slate-300/80 hover:text-white"
                  }`}
                  data-cursor="pointer"
                  data-cursor-text="GOTO"
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.6)]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Stack: Live Telemetry (hero only) + Action Button + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Live IST Telemetry Capsule (Only when stretched in Hero) */}
            <div
              ref={telemetryRef}
              className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-white shadow-sm backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider"
            >
              <Compass size={12} className="text-[#FF7A00]" />
              <span>KOLKATA {time || "00:00:00"} IST</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] ml-1" />
              <span className="text-emerald-300">OPEN</span>
            </div>

            {/* Connect Action Button */}
            <button
              onClick={() => onNavigate("monument-terminal")}
              className={`inline-flex items-center gap-1.5 px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-sans font-black text-[10px] xs:text-[11px] uppercase tracking-wider cursor-pointer transition-all duration-300 shadow-md active:scale-95 shrink-0 ${
                isScrolled
                  ? "bg-white text-[#0A0C10] hover:bg-[#FF7A00] hover:text-white"
                  : "bg-white text-[#0F172A] hover:bg-[#FF7A00] hover:text-white"
              }`}
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Understated Smoky Fluid Dark) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0C0C0E]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-sans font-black text-xs text-white tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>NAVIGATION</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto py-8">
            {links.map((link, idx) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left font-sans font-black text-2xl uppercase tracking-tight flex items-baseline gap-4 ${
                    isActive ? "text-[#10B981]" : "text-white hover:text-emerald-300"
                  }`}
                >
                  <span className="font-sans font-black text-xs text-slate-500">
                    0{idx}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between font-sans text-xs text-slate-400">
            <span className="font-black text-slate-300">KOLKATA {time || "00:00:00"} IST</span>
            <span className="text-[#10B981] font-black">OPEN FOR WORK</span>
          </div>
        </div>
      )}
    </>
  );
};
