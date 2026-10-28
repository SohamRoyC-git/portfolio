"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X, Compass } from "lucide-react";

interface MasterNavProps {
  onNavigate: (id: string) => void;
  activeId: string;
}

export const MasterNav: React.FC<MasterNavProps> = ({ onNavigate, activeId }) => {
  const [time, setTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Transparent at top, frosted glass on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-500">
        <div
          className={`max-w-6xl mx-auto w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center justify-between pointer-events-auto transition-all duration-500 ${
            isScrolled
              ? "bg-white/85 border border-slate-200/80 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl"
              : "bg-white/15 border border-white/25 shadow-none backdrop-blur-xs hover:bg-white/25"
          }`}
        >
          {/* Brand Monogram */}
          <div
            onClick={() => onNavigate("monument-hero")}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
            data-cursor="pointer"
            data-cursor-text="INDEX"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
            <span className="font-sans font-black text-[11px] sm:text-xs text-[#0F172A] tracking-wider sm:tracking-widest uppercase group-hover:text-[#10B981] transition-colors truncate">
              SR · SOHAM ROYCHOUDHURY
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-sans font-black text-xs tracking-wider text-slate-600 uppercase">
            {links.map((link) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`transition-colors cursor-pointer hover:text-[#0F172A] ${
                    isActive ? "text-[#10B981] underline underline-offset-4" : ""
                  }`}
                  data-cursor="pointer"
                  data-cursor-text="GOTO"
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("monument-terminal")}
              className="hidden md:inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0F172A] text-white hover:bg-[#10B981] transition-all duration-300 font-sans font-black text-[11px] uppercase tracking-wider cursor-pointer shadow-xs active:scale-95"
            >
              <span>CONNECT</span>
              <ArrowUpRight size={12} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 text-[#0F172A] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 font-sans font-black text-xs text-[#0F172A] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>NAVIGATION</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100"
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

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between font-sans text-xs text-slate-500">
            <span className="font-black">KOLKATA {time || "00:00:00"}</span>
            <span className="text-[#10B981] font-black">OPEN FOR WORK</span>
          </div>
        </div>
      )}
    </>
  );
};
