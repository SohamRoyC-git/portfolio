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
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 md:px-12 py-3.5 sm:py-5 flex items-center justify-between bg-white/85 backdrop-blur-xl border-b border-black/[0.06] transition-all">
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
        <nav className="hidden lg:flex items-center gap-8 font-sans font-black text-xs tracking-wider text-slate-500 uppercase">
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

        {/* Right Status & Action */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Kolkata Time */}
          <div className="hidden md:flex items-center gap-2 font-sans font-black text-[11px] text-slate-600 bg-white/70 border border-slate-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>KOLKATA {time || "IST"}</span>
          </div>

          {/* Connect Button */}
          <button
            onClick={() => onNavigate("monument-terminal")}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0F172A] text-white font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider hover:bg-[#10B981] transition-all duration-300 shadow-xs cursor-pointer"
            data-cursor="pointer"
            data-cursor-text="CONNECT"
          >
            <span>Connect</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-white/95 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex flex-col gap-4">
            <div className="font-sans font-black text-[10px] text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">
              PORTFOLIO SECTIONS
            </div>
            {links.map((link, idx) => {
              const isActive = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left py-2 font-sans font-black text-xl tracking-tight uppercase flex items-center justify-between transition-colors ${
                    isActive ? "text-[#10B981] pl-2 border-l-2 border-[#10B981]" : "text-[#0F172A] hover:text-[#10B981]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-400 font-normal">0{idx}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans font-black uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Compass size={14} className="text-[#10B981]" />
                <span>KOLKATA TIME</span>
              </div>
              <span className="text-[#0F172A]">{time || "IST"}</span>
            </div>
            <button
              onClick={() => handleLinkClick("monument-terminal")}
              className="w-full py-3 rounded-xl bg-[#10B981] text-white font-sans font-black text-xs uppercase tracking-wider text-center shadow-md active:scale-98 transition-transform cursor-pointer"
            >
              Get In Touch &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
};
