"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Compass, Sparkles } from "lucide-react";

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
  // Stays fully visible through the initial scroll, dissolving only when exiting
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !videoWrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(videoWrapperRef.current, {
        y: 60,
        opacity: 0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "45% top", // Video stays completely visible for longer
          end: "bottom top",
          scrub: 0.6,
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
      className="relative min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-8 md:px-12 z-10 select-none overflow-visible"
    >
      {/* 1. Living Pixel-Art Environment Video with Feathered Progressive Alpha Bleed at the Very Bottom */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 -bottom-10 sm:-bottom-14 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
        }}
      >
        {/* Seamlessly Looping Pixel Art Environment Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-bottom"
        >
          <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
          <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
        </video>

        {/* Subtle Ambient Sky Vignette on Right for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/40 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none z-10" />

        {/* Soft, Lowered Multi-Stop Bleed Gradient at the Very Bottom Edge */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/85 to-transparent pointer-events-none z-10" />
      </div>

      {/* Top Telemetry Header Bar */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-xs backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] tracking-wider uppercase">
            PORTFOLIO // 2026
          </span>
        </div>

        {/* Live Kolkata Clock & Availability Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-xs backdrop-blur-md">
            <Compass size={12} className="text-[#10B981]" />
            <span className="font-sans font-black text-[10px] sm:text-[11px] text-[#0F172A] uppercase tracking-wider">
              KOLKATA {timeStr || "00:00:00"} IST
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#059669] font-sans font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>OPEN FOR ROLES</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side open for living pixel-art scene; Right side hosts cinematic text */}
      <div className="relative z-20 my-auto w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 sm:py-10">
        {/* Left Column (Open & Uncluttered so the pixel art animation shines through) */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 pointer-events-none" />

        {/* Right Column: Sleek, Decluttered, Cinematic Typography */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left bg-white/45 lg:bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/85 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
          {/* Subtle Institutional Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans font-black uppercase tracking-wider text-[#059669] mb-3">
            <Sparkles size={13} className="text-[#10B981]" />
            <span>Netaji Subhash Engineering College (2024–2028)</span>
          </div>

          {/* Cinematic Headline (Clean, elegant, film title typography) */}
          <h1 className="font-sans font-black text-2xl xs:text-3xl sm:text-4xl lg:text-[2.65rem] text-[#0F172A] uppercase tracking-[0.05em] leading-[1.08] mb-3 drop-shadow-xs">
            SOHAM <br />
            <span className="bg-gradient-to-r from-[#0F172A] via-slate-800 to-[#10B981] bg-clip-text text-transparent">
              ROYCHOUDHURY
            </span>
          </h1>

          {/* Editorial Subtitle in Elegant Light Italic Serif */}
          <p className="font-serif italic font-normal text-base sm:text-lg text-slate-800 leading-relaxed mb-6">
            Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
          </p>

          {/* Dual Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExplore}
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0F172A] text-white hover:bg-[#10B981] transition-all duration-300 font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-98"
            >
              <span>Explore Work</span>
              <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={handleConnectClick}
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/90 hover:bg-white text-[#0F172A] border border-slate-200/90 transition-all duration-300 font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer shadow-xs backdrop-blur-md active:scale-98"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={13} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates Bar (Clean & Subtle) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-3 border-t border-slate-300/40 text-[10px] sm:text-[11px] font-sans font-black text-slate-600 uppercase tracking-widest">
        <span>KOLKATA // LAT 22.5726° N · LON 88.3639° E</span>
        <span className="hidden sm:inline">CYBER-PASTORAL TERRACE</span>
      </div>
    </section>
  );
});

MonumentalHero.displayName = "MonumentalHero";
