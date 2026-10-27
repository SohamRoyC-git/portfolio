"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowDown, Compass } from "lucide-react";

interface MonumentalHeroProps {
  onExplore: () => void;
}

export const MonumentalHero: React.FC<MonumentalHeroProps> = ({ onExplore }) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (-y / rect.height) * 9,
      y: (x / rect.width) * 9,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="monument-hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-8 md:px-12 z-10 overflow-hidden select-none"
    >
      {/* Top Architectural Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-sans font-black text-[11px] sm:text-xs text-slate-500 tracking-widest uppercase">
            PORTFOLIO // 2026 EDITION
          </span>
        </div>

        {/* Live Kolkata Clock & Availability */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200/80 backdrop-blur-md">
            <Compass size={12} className="text-[#10B981]" />
            <span className="font-sans font-black text-[11px] text-[#0F172A] uppercase tracking-wider">
              KOLKATA {timeStr || "01:00:00"} IST
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#059669] font-sans font-black text-[10px] sm:text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>OPEN FOR ROLES</span>
          </div>
        </div>
      </div>

      {/* Main Monumental Centerpiece */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-full py-6 sm:py-8">
        {/* Education & Institutional Origin Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md mb-4 sm:mb-6 hover:border-[#10B981]/50 transition-colors max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
          <span className="font-sans font-black text-[10px] sm:text-xs text-[#0F172A] tracking-wider uppercase truncate">
            Netaji Subhash Engineering College (2024-2028) · Kolkata, India
          </span>
        </div>

        {/* Monumental Central Name with 3D Mouse Parallax */}
        <div
          className="transition-transform duration-300 ease-out will-change-transform w-full"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <h1 className="font-sans font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] text-[#0F172A] uppercase tracking-tighter leading-[0.88] mb-4 sm:mb-6 drop-shadow-xs break-words">
            SOHAM <br />
            <span className="bg-gradient-to-r from-[#0F172A] via-slate-800 to-slate-600 bg-clip-text text-transparent">
              ROYCHOUDHURY
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle in Apple Garamond Light Italic */}
        <p className="font-serif italic font-light text-lg sm:text-2xl md:text-3xl text-slate-700 tracking-normal leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
        </p>

        {/* Interactive Engineering Capsules */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto px-2">
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/70 border border-slate-200/80 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
            ⚡ 278-Key Instant Translation
          </div>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/70 border border-slate-200/80 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
            🧠 Real-Time Tensor Pipelines
          </div>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/70 border border-slate-200/80 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
            🌐 60 FPS WebGL Spatial Canvas
          </div>
        </div>
      </div>

      {/* Bottom Bar: Action Button & Studio Coordinates */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center sm:justify-between pt-4 sm:pt-6 border-t border-slate-200/80">
        <div className="font-sans font-black text-[11px] text-slate-400 uppercase tracking-widest hidden md:flex items-center gap-2">
          <span>LAT 22.5726° N</span>
          <span>·</span>
          <span>LON 88.3639° E</span>
        </div>

        {/* Explore Button */}
        <button
          onClick={onExplore}
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#0F172A] text-white hover:bg-[#10B981] transition-all duration-300 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
        >
          <span>Explore Selected Work</span>
          <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
        </button>

        <div className="font-sans font-black text-[11px] text-slate-400 uppercase tracking-widest hidden sm:block">
          SCROLL TO ORBIT // 360°
        </div>
      </div>
    </section>
  );
};
