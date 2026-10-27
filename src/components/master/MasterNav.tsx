"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface MasterNavProps {
  onNavigate: (id: string) => void;
  activeId: string;
}

export const MasterNav: React.FC<MasterNavProps> = ({ onNavigate, activeId }) => {
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

  const links = [
    { id: "monument-hero", label: "INDEX" },
    { id: "monument-statement", label: "STATEMENT" },
    { id: "monument-exhibition", label: "WORK" },
    { id: "monument-matrix", label: "BLUEPRINT" },
    { id: "monument-terminal", label: "CONTACT" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between bg-white/75 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      {/* Brand Monogram */}
      <div
        onClick={() => onNavigate("monument-hero")}
        className="flex items-center gap-3 cursor-pointer group"
        data-cursor="pointer"
        data-cursor-text="INDEX"
      >
        <span className="font-sans font-black text-xs text-[#0F172A] tracking-widest uppercase group-hover:text-[#10B981] transition-colors">
          SR · SOHAM ROYCHOUDHURY
        </span>
      </div>

      {/* Nav Links */}
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
      <div className="flex items-center gap-4">
        {/* Kolkata Time */}
        <div className="hidden sm:flex items-center gap-2 font-sans font-black text-[11px] text-slate-600 bg-white/60 border border-slate-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>KOLKATA {time || "IST"}</span>
        </div>

        {/* Connect Button */}
        <button
          onClick={() => onNavigate("monument-terminal")}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F172A] text-white font-sans font-black text-xs uppercase tracking-wider hover:bg-[#10B981] transition-all duration-300 shadow-xs cursor-pointer"
          data-cursor="pointer"
          data-cursor-text="CONNECT"
        >
          <span>Connect</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};
