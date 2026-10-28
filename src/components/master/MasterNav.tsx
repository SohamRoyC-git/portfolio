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
      start: nextSection ? "top 82%" : "bottom 250px",
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
      // 1. Morph to Compact Floating Glass Dock
      gsap.to(nav, {
        maxWidth: isMobile ? "calc(100% - 24px)" : "860px",
        marginTop: isMobile ? "10px" : "16px",
        paddingTop: isMobile ? "8px" : "10px",
        paddingBottom: isMobile ? "8px" : "10px",
        paddingLeft: isMobile ? "16px" : "24px",
        paddingRight: isMobile ? "16px" : "24px",
        borderRadius: "9999px",
        backgroundColor: "rgba(255, 255, 255, 0.86)",
        borderColor: "rgba(15, 23, 42, 0.08)",
        boxShadow:
          "0 16px 38px -6px rgba(15, 23, 42, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.85)",
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
        telemetryRef.current.style.display = "flex";
        gsap.to(telemetryRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          delay: 0.1,
          ease: "power2.out",
        });
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
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center w-full pointer-events-none select-none transition-none">
        <div
          ref={navRef}
          className={`w-full flex items-center justify-between pointer-events-auto border transition-colors duration-400 ${
            isScrolled
              ? "bg-white/85 border-slate-200/80"
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
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
            data-cursor="pointer"
            data-cursor-text="INDEX"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span
              className={`font-sans font-black text-xs tracking-[0.2em] uppercase transition-colors duration-300 truncate ${
                isScrolled
                  ? "text-[#0F172A] group-hover:text-[#10B981]"
                  : "text-white group-hover:text-emerald-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              }`}
            >
              {isScrolled ? "SR · SOHAM" : "SR // SOHAM ROYCHOUDHURY"}
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
                    isScrolled
                      ? isActive
                        ? "text-[#10B981] font-black"
                        : "text-slate-600 hover:text-[#0F172A]"
                      : isActive
                      ? "text-[#10B981] font-black drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                      : "text-white/85 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  }`}
                  data-cursor="pointer"
                  data-cursor-text="GOTO"
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? "bg-[#10B981]" : "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Stack: Live Telemetry (hero only) + Action Button + Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Live IST Telemetry Capsule (Only when stretched in Hero) */}
            <div
              ref={telemetryRef}
              className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-white shadow-sm backdrop-blur-md text-[10px] font-sans font-bold uppercase tracking-wider"
            >
              <Compass size={12} className="text-[#10B981]" />
              <span>KOLKATA {time || "00:00:00"} IST</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] ml-1" />
              <span className="text-emerald-300">OPEN</span>
            </div>

            {/* Connect Action Button */}
            <button
              onClick={() => onNavigate("monument-terminal")}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-sans font-black text-[11px] uppercase tracking-wider cursor-pointer transition-all duration-300 shadow-md active:scale-95 ${
                isScrolled
                  ? "bg-[#0F172A] text-white hover:bg-[#10B981]"
                  : "bg-white text-[#0F172A] hover:bg-[#10B981] hover:text-white"
              }`}
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-[#0F172A] hover:bg-slate-100"
                  : "text-white hover:bg-white/15 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAFAF9]/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 font-sans font-black text-xs text-[#0F172A] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>NAVIGATION</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-200 text-[#0F172A]"
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
                    isActive ? "text-[#10B981]" : "text-[#0F172A]"
                  }`}
                >
                  <span className="font-sans font-black text-xs text-slate-400">
                    0{idx}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between font-sans text-xs text-slate-600">
            <span className="font-black">KOLKATA {time || "00:00:00"} IST</span>
            <span className="text-[#10B981] font-black">OPEN FOR WORK</span>
          </div>
        </div>
      )}
    </>
  );
};
