"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Code2, Cpu, Globe2, Sparkles, Terminal, Layers } from "lucide-react";
import Image from "next/image";

interface PutureHeroOrbitProps {
  onExplore: () => void;
}

const ORBIT_ITEMS = [
  { icon: Cpu, label: "AI & Machine Learning", sub: "CSE @ NSEC Kolkata", color: "#F97316" },
  { icon: Code2, label: "React 19 & Next.js 16", sub: "Turbopack • App Router", color: "#38BDF8" },
  { icon: Globe2, label: "Cross-Border Operations", sub: "Latvia Cricket & IZIEAT", color: "#A855F7" },
  { icon: Layers, label: "Creative Motion & GSAP", sub: "Physics • 3D Discs", color: "#FBBF24" },
  { icon: Terminal, label: "Full-Stack Architecture", sub: "TypeScript • Node • Python", color: "#34D399" },
];

export const PutureHeroOrbit: React.FC<PutureHeroOrbitProps> = ({ onExplore }) => {
  const [rotation, setRotation] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let animId: number;
    let angle = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 20;
      const y = ((e.clientY / innerHeight) - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setRotation(scrollY * 0.04);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const drift = () => {
      angle += 0.002;
      setRotation((prev) => prev + 0.002);
      animId = requestAnimationFrame(drift);
    };
    animId = requestAnimationFrame(drift);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="chapter-hero"
      className="relative min-h-[96vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden z-10"
      suppressHydrationWarning
    >
      {/* Chapter Index Badge - Swiss Minimalist Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
          00 / WELCOME
        </span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-[11px] text-[#F97316] font-medium tracking-wide">
          SYSTEMS & DIGITAL OPERATIONS
        </span>
      </div>

      {/* Main Center Stage with 3D Orbital Perspective */}
      <div 
        className="relative w-full max-w-5xl flex flex-col items-center text-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        }}
      >
        {/* Authentic 3D Persona Holographic Avatar */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-3 rounded-2xl bg-[#F97316]/15 blur-xl group-hover:blur-2xl transition-all opacity-70" />
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-white/20 bg-[#12141A] shadow-2xl">
            <Image
              src="/assets/soham_avatar_transparent.png"
              alt="Soham Roychoudhury"
              width={128}
              height={128}
              priority
              className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {/* Orbital indicator pill */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#0A0B0E] border border-white/10 font-mono text-[9px] text-slate-300 whitespace-nowrap shadow-sm">
            AI/ML • NSEC 2028
          </div>
        </div>

        {/* Big Swiss-Style Display Typography */}
        <h1 className="font-sans font-bold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[1.02] mb-6">
          Soham <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Roychoudhury
          </span>
        </h1>

        <p className="font-sans text-lg sm:text-xl text-slate-400 font-normal max-w-2xl leading-relaxed mb-10">
          Undergraduate in Computer Science & Engineering (AI & ML). Building high-performance frontend architectures, cross-border digital operations, and intelligent systems.
        </p>

        {/* Orbiting Technology Badges around the Hero (Refined Minimalist Cards) */}
        <div className="relative w-full h-36 max-w-3xl hidden md:flex items-center justify-center mb-8" suppressHydrationWarning>
          {mounted &&
            ORBIT_ITEMS.map((item, idx) => {
              const total = ORBIT_ITEMS.length;
              const itemAngle = (idx / total) * Math.PI * 2 + rotation;
              const radiusX = 310;
              const radiusY = 55;

              const x = Math.round(Math.cos(itemAngle) * radiusX);
              const y = Math.round(Math.sin(itemAngle) * radiusY);
              const scale = Number((0.85 + ((Math.sin(itemAngle) + 1) / 2) * 0.25).toFixed(2));
              const opacity = Number((0.5 + ((Math.sin(itemAngle) + 1) / 2) * 0.5).toFixed(2));
              const zIndex = Math.round((Math.sin(itemAngle) + 1) * 10);

              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="absolute flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#12141A]/95 border border-white/[0.08] backdrop-blur-md shadow-lg transition-all hover:border-[#F97316] hover:scale-105 cursor-pointer"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                    opacity,
                    zIndex,
                  }}
                  suppressHydrationWarning
                >
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="text-left">
                    <div className="font-sans text-xs font-semibold text-white tracking-tight">
                      {item.label}
                    </div>
                    <div className="font-mono text-[9px] text-slate-400">
                      {item.sub}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* CTA Buttons - Minimal & High Contrast */}
        <div className="flex items-center gap-4">
          <button
            onClick={onExplore}
            className="group px-7 py-3.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-sans text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <span>Explore Experience</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Puture Scroll Prompt */}
      <div 
        onClick={onExplore}
        className="absolute bottom-6 flex flex-col items-center gap-2 font-mono text-[10px] text-slate-500 hover:text-white cursor-pointer transition-colors"
      >
        <span className="tracking-widest uppercase">SCROLL TO ADVANCE</span>
        <div className="w-4 h-7 rounded-full border border-white/20 flex justify-center pt-1">
          <div className="w-1 h-1.5 rounded-full bg-[#F97316] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
