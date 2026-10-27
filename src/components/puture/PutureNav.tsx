"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface PutureNavProps {
  activeChapter: string;
  onNavigate: (id: string) => void;
}

export const PutureNav: React.FC<PutureNavProps> = ({ activeChapter, onNavigate }) => {
  const [time, setTime] = useState("");

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

  const navLinks = [
    { id: "chapter-hero", label: "Welcome" },
    { id: "chapter-about", label: "About" },
    { id: "chapter-work", label: "Work" },
    { id: "chapter-showcase", label: "Showcase" },
    { id: "chapter-process", label: "Process" },
    { id: "chapter-contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between bg-[#0A0B0E]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      {/* Brand Monogram */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigate("chapter-hero")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center font-mono font-bold text-white text-sm shadow-[0_0_16px_rgba(249,115,22,0.5)] group-hover:scale-105 transition-transform">
          SR
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-sm text-white tracking-tight group-hover:text-[#F97316] transition-colors">
            SOHAM ROYCHOUDHURY
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            CSE (AI & ML) • NSEC KOLKATA
          </span>
        </div>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = activeChapter === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3.5 py-1 text-xs font-sans font-medium rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#F97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Telemetry & CTA */}
      <div className="flex items-center gap-4">
        {/* Kolkata IST Clock */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>KOLKATA {time || "IST"}</span>
        </div>

        {/* Start a conversation CTA */}
        <button
          onClick={() => onNavigate("chapter-contact")}
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#0A0B0E] font-sans text-xs font-semibold hover:bg-[#F97316] hover:text-white transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.1)] cursor-pointer"
        >
          <span>Get in Touch</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};
