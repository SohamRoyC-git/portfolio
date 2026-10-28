"use client";

import React, { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { AnimatedWireframeMatrix } from "./AnimatedWireframeMatrix";

gsap.registerPlugin(ScrollTrigger);

interface MonumentalHeroProps {
  onExplore: () => void;
  onConnect?: () => void;
}

export const MonumentalHero: React.FC<MonumentalHeroProps> = memo(({ onExplore, onConnect }) => {
  // Desktop refs
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLDivElement | null>(null);

  // Mobile refs
  const mobileTerraceRef = useRef<HTMLDivElement | null>(null);
  const mobileAlertRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // MOBILE TIMELINE (< 768px):
    mm.add("(max-width: 767px)", () => {
      // 1. Gentle continuous levitation for the laptop alert telemetry beacon
      let levitationTween: gsap.core.Tween | null = null;
      if (mobileAlertRef.current) {
        levitationTween = gsap.to(mobileAlertRef.current, {
          y: -8,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 2. Smooth scroll-out as user begins scrolling down the terrace
      if (mobileAlertRef.current && mobileTerraceRef.current) {
        gsap.to(mobileAlertRef.current, {
          opacity: 0,
          y: -25,
          scale: 0.92,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mobileTerraceRef.current,
            start: "top top",
            end: "28% top",
            scrub: 0.5,
          },
        });
      }

      return () => {
        if (levitationTween) levitationTween.kill();
      };
    });

    // DESKTOP TIMELINE (>= 768px):
    mm.add("(min-width: 768px)", () => {
      if (desktopVideoRef.current && desktopSectionRef.current) {
        gsap.to(desktopVideoRef.current, {
          y: 60,
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: desktopSectionRef.current,
            start: "45% top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });

    return () => mm.revert();
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
    <div id="monument-hero" className="relative w-full overflow-visible">
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE (< 768px): BESPOKE CINEMATIC DARK-THEMED SEQUENCE        */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full flex flex-col">
        {/* SCENE 1: ATMOSPHERIC LIVING TERRACE (100svh) */}
        <section
          ref={mobileTerraceRef}
          className="relative h-[100svh] w-full flex flex-col justify-between pt-24 pb-6 px-4 z-10 select-none overflow-hidden"
        >
          {/* Living Pixel Art Terrace Video (Mobile focused on right: cat, coffee, laptop) */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-[85%_bottom]"
            >
              <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
              <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
            </video>

            {/* Seamless Bottom Gradient Bleed directly into luxury dark palette */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070A11] via-[#070A11]/70 to-transparent pointer-events-none z-10" />
          </div>

          {/* Top spacer */}
          <div className="relative z-20" />

          {/* GSAP Floating Laptop Alert Notification / HUD Telemetry Beacon */}
          <div
            ref={mobileAlertRef}
            className="absolute pointer-events-none z-20 flex flex-col items-center will-change-[transform,opacity]"
            style={{
              left: "56%",
              top: "47%",
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Holographic Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070A11]/85 border border-emerald-400/50 backdrop-blur-md shadow-[0_0_24px_rgba(0,255,135,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]" />
              </span>
              <span className="font-sans font-black text-[9px] tracking-[0.22em] text-emerald-300 uppercase">
                LAPTOP ACTIVE
              </span>
              <span className="text-white/30 text-[9px]">/</span>
              <span className="font-sans font-bold text-[9px] tracking-wider text-slate-100 uppercase flex items-center gap-1">
                Scroll to meet Soham
                <ArrowDown size={10} className="text-emerald-400 animate-bounce" />
              </span>
            </div>

            {/* Telemetry connector stem pointing down toward laptop */}
            <div className="w-[1.5px] h-4 bg-gradient-to-b from-emerald-400/80 to-transparent mx-auto" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF87] mx-auto -mt-0.5" />
          </div>

          {/* Bottom Coordinates & Location Bar */}
          <div className="relative z-20 w-full flex items-center justify-between pt-3 border-t border-white/20 text-[10px] font-sans font-bold text-white/90 uppercase tracking-widest drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            <span>KOLKATA // LAT 22.5726° N</span>
            <span className="text-emerald-300">TERRACE ONLINE</span>
          </div>
        </section>

        {/* SCENE 2: MONUMENTAL IDENTITY WITH CONTINUOUS 3D WIREFRAME MATRIX */}
        <section
          id="monument-identity"
          className="relative min-h-[100svh] w-full flex flex-col justify-center items-center text-center px-4 py-16 bg-[#070A11] select-none overflow-hidden"
        >
          {/* Continuous 60FPS 3D Wireframe Polyhedron & Horizon Terrain Matrix */}
          <AnimatedWireframeMatrix />

          {/* Foreground Identity Lockup */}
          <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
            {/* Institutional Eyebrow */}
            <div className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-300 mb-4 px-3.5 py-1.5 rounded-full bg-[#0F172A]/85 border border-emerald-500/30 backdrop-blur-md shadow-lg">
              <Sparkles size={12} className="text-[#10B981]" />
              <span>Netaji Subhash Engineering College (2024–2028)</span>
            </div>

            {/* Cinematic Grand Headline in BN Riley */}
            <h1 className="font-riley text-5xl xs:text-6xl text-white tracking-tight uppercase leading-[0.92] mb-4 drop-shadow-[0_8px_36px_rgba(0,0,0,0.95)] select-none">
              Soham <br />
              <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.45)]">
                Roychoudhury
              </span>
            </h1>

            {/* Editorial Subtitle in Athelas Italic */}
            <p className="font-athelas italic font-normal text-sm xs:text-base text-slate-300 leading-relaxed mb-8 max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] px-2">
              Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onExplore}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#070A11] hover:bg-[#10B981] hover:text-white transition-all duration-300 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl active:scale-95"
              >
                <span>Explore Work</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={handleConnectClick}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B0F17]/90 hover:bg-[#0B0F17] text-white border border-white/25 transition-all duration-300 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl backdrop-blur-md active:scale-95"
              >
                <span>Get In Touch</span>
                <ArrowUpRight size={14} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): HIGH-ART GALLERY CINEMATIC HERO            */}
      {/* ========================================================================= */}
      <section
        ref={desktopSectionRef}
        className="hidden md:flex relative min-h-[100svh] flex-col justify-between pt-36 pb-14 px-8 md:px-12 z-10 select-none overflow-visible"
      >
        {/* Living Pixel Art Terrace Video */}
        <div
          ref={desktopVideoRef}
          className="absolute inset-0 -bottom-16 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
          }}
        >
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

          {/* Balanced Vignette */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/35" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 65%, transparent 100%)",
              }}
            />
          </div>

          {/* Multi-stop bottom bleed into Movement 01 */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Centered Monumental Headline in BN Riley */}
        <div className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-10">
          {/* Institutional Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-emerald-300 mb-6 px-4 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-lg">
            <Sparkles size={12} className="text-[#10B981]" />
            <span>Netaji Subhash Engineering College (2024–2028)</span>
          </div>

          {/* Grand Headline in BN Riley */}
          <h1 className="font-riley text-7xl md:text-8xl lg:text-[6.8rem] xl:text-[8rem] text-white tracking-tight uppercase leading-[0.92] mb-6 drop-shadow-[0_6px_36px_rgba(0,0,0,0.95)] select-none">
            Soham <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              Roychoudhury
            </span>
          </h1>

          {/* Editorial Subtitle in Athelas Italic */}
          <p className="font-athelas italic font-normal text-2xl md:text-3xl text-slate-100 leading-relaxed mb-10 max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] px-2">
            Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
          </p>

          {/* Dual Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0F172A] hover:bg-[#10B981] hover:text-white transition-all duration-300 font-sans font-black text-sm uppercase tracking-wider cursor-pointer shadow-xl active:scale-98"
            >
              <span>Explore Work</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={handleConnectClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/30 transition-all duration-300 font-sans font-black text-sm uppercase tracking-wider cursor-pointer shadow-xl backdrop-blur-md active:scale-98"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={14} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Coordinates Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-3 border-t border-white/20 text-[11px] font-sans font-bold text-white/85 uppercase tracking-widest drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          <span>KOLKATA // LAT 22.5726° N · LON 88.3639° E</span>
          <span>CYBER-PASTORAL TERRACE</span>
        </div>
      </section>
    </div>
  );
});

MonumentalHero.displayName = "MonumentalHero";
