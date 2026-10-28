"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Compass, Zap, Cpu, Layers, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MonumentalHeroProps {
  onExplore: () => void;
  onConnect?: () => void;
}

export const MonumentalHero: React.FC<MonumentalHeroProps> = memo(({ onExplore, onConnect }) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);

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

  // GSAP Smooth Scroll Parallax & Organic Dissolve into Movement 01
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !videoWrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax-shift and dissolve the living video background seamlessly into Movement 01
      gsap.to(videoWrapperRef.current, {
        y: 90,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleConnectClick = () => {
    if (onConnect) {
      onConnect();
    } else {
      const el = document.getElementById("monument-terminal");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="monument-hero"
      ref={sectionRef}
      className="relative min-h-[105svh] flex flex-col justify-between pt-24 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 z-10 select-none overflow-visible"
    >
      {/* 1. Living Cyber-Pastoral Terrace Video with Feathered Progressive Alpha Bleed */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 -bottom-20 sm:-bottom-28 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 66%, rgba(0,0,0,0.35) 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 66%, rgba(0,0,0,0.35) 84%, transparent 100%)",
        }}
      >
        {/* Seamlessly Looping Video Rendered with Native Physics */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-bottom"
        >
          <source src="/assets/hero_ghibli_loop.mp4" type="video/mp4" />
          <source src="/assets/kling_20261028_VIDEO_Gentle_mor_4625_0.mp4" type="video/mp4" />
        </video>

        {/* Ambient Top Sky Overlay for High-Contrast Heading & Telemetry Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none z-10" />

        {/* Deep Multi-Stop Bleed Gradient Dissolving the Video into #FAFAF9 */}
        <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/95 via-[#FAFAF9]/45 to-transparent pointer-events-none z-10" />
      </div>

      {/* Embedded High-Performance GPU Keyframe Styles */}
      <style jsx global>{`
        @keyframes tagHoverFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>

      {/* Top Telemetry Header Bar */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-sans font-black text-[11px] sm:text-xs text-[#0F172A] tracking-widest uppercase drop-shadow-xs">
            PORTFOLIO // 2026 EDITION
          </span>
        </div>

        {/* Live Kolkata Clock & Availability Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-xs backdrop-blur-md">
            <Compass size={12} className="text-[#10B981]" />
            <span className="font-sans font-black text-[11px] text-[#0F172A] uppercase tracking-wider">
              KOLKATA {timeStr || "01:00:00"} IST
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#059669] font-sans font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>OPEN FOR ROLES</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Asymmetric Content Grid (The Cofounder Composition) */}
      <div className="relative z-20 my-auto w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 sm:py-10">
        {/* Left Column: Bold Typography & Action Controls (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Institutional Origin Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-xs backdrop-blur-md mb-4 sm:mb-5 hover:border-[#10B981]/50 transition-colors w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
            <span className="font-sans font-black text-[10px] sm:text-xs text-[#0F172A] tracking-wider uppercase truncate">
              Netaji Subhash Engineering College (2024–2028) · Kolkata, India
            </span>
          </div>

          {/* Monumental Headline with Crisp Readability */}
          <h1 className="font-sans font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.4rem] text-[#0F172A] uppercase tracking-tighter leading-[0.92] mb-4 sm:mb-5 drop-shadow-sm">
            SOHAM <br />
            <span className="bg-gradient-to-r from-[#0F172A] via-slate-800 to-slate-700 bg-clip-text text-transparent">
              ROYCHOUDHURY
            </span>
          </h1>

          {/* Editorial Subtitle in Apple Garamond Light Italic */}
          <p className="font-serif italic font-light text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-normal leading-relaxed max-w-2xl mb-6 sm:mb-8 drop-shadow-xs">
            Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
          </p>

          {/* Dual Action Buttons (The Cofounder Pill Triggers) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={onExplore}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#0F172A] text-white hover:bg-[#10B981] transition-all duration-300 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-98"
            >
              <span>Explore Selected Work</span>
              <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={handleConnectClick}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/90 hover:bg-white text-[#0F172A] hover:border-[#10B981]/50 border border-slate-200/90 transition-all duration-300 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-md backdrop-blur-md active:scale-98"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={14} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive Engineering Capsules (Clean Vector Icons, Zero Emojis) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
              <Zap size={12} className="text-[#10B981] shrink-0" />
              <span>278-Key Instant Translation</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
              <Cpu size={12} className="text-[#10B981] shrink-0" />
              <span>Real-Time Tensor Pipelines</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 backdrop-blur-md font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider shadow-xs">
              <Layers size={12} className="text-[#10B981] shrink-0" />
              <span>60 FPS WebGL Spatial Canvas</span>
            </div>
          </div>
        </div>

        {/* Right Column: Spatial Sphere Focal Stage & Floating Status Tags (5 Cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
          {/* Floating Acrylic Status Tags */}
          <div className="w-full flex flex-col items-end gap-3 z-20 pointer-events-auto">
            {/* Tag 1: Active Availability */}
            <div
              className="px-4 py-2 rounded-2xl bg-white/90 border border-white/95 shadow-md backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-102 hover:border-[#10B981]/50"
              style={{ animation: "tagHoverFloat 5s ease-in-out infinite" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <div className="text-left font-sans">
                <div className="text-[10px] font-black uppercase text-slate-400 leading-none mb-0.5">
                  STATUS
                </div>
                <div className="text-xs font-black text-[#0F172A]">
                  Open for Frontend &amp; AI/ML Roles
                </div>
              </div>
            </div>

            {/* Tag 2: Institutional Origin */}
            <div
              className="px-4 py-2 rounded-2xl bg-white/90 border border-white/95 shadow-md backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-102 hover:border-[#10B981]/50"
              style={{ animation: "tagHoverFloat 6s ease-in-out infinite 1.2s" }}
            >
              <Sparkles size={13} className="text-[#10B981]" />
              <div className="text-left font-sans">
                <div className="text-[10px] font-black uppercase text-slate-400 leading-none mb-0.5">
                  ACADEMIC
                </div>
                <div className="text-xs font-black text-[#0F172A]">
                  NSEC Kolkata (2024–2028)
                </div>
              </div>
            </div>

            {/* Tag 3: Interactive Sphere Prompt */}
            <div
              className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-lg backdrop-blur-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-102 hover:border-[#10B981]/60"
              style={{ animation: "tagHoverFloat 5.5s ease-in-out infinite 2.5s" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-left font-sans">
                <div className="text-[10px] font-black uppercase text-emerald-400 leading-none mb-0.5">
                  ORBITAL CORE
                </div>
                <div className="text-xs font-black text-white">
                  Double-click Sphere to Orbit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Studio Coordinates Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-slate-300/60">
        <div className="font-sans font-black text-[11px] text-slate-600 uppercase tracking-widest hidden sm:flex items-center gap-2">
          <span>LAT 22.5726° N</span>
          <span>·</span>
          <span>LON 88.3639° E</span>
        </div>

        <div className="font-sans font-black text-[11px] text-slate-600 uppercase tracking-widest mx-auto sm:mx-0">
          CYBER-PASTORAL TERRACE // 2026
        </div>

        <div className="font-sans font-black text-[11px] text-slate-600 uppercase tracking-widest hidden sm:flex items-center gap-2">
          <span>STUDIO GHIBLI x CYBERPUNK</span>
        </div>
      </div>
    </section>
  );
});

MonumentalHero.displayName = "MonumentalHero";
