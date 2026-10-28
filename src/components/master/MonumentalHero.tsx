"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const backdropRef = useRef<HTMLDivElement | null>(null);

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

  // GSAP Smooth Scroll Parallax Bleed into Movement 01
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !backdropRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax-shift and dissolve the terrace deck softly into Movement 01
      gsap.to(backdropRef.current, {
        y: 100,
        opacity: 0.15,
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
      {/* 1. Cyber-Pastoral Terrace Backdrop with Progressive Feathered Bleed & Parallax */}
      <div
        ref={backdropRef}
        className="absolute inset-0 -bottom-20 sm:-bottom-28 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 68%, rgba(0,0,0,0.38) 84%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.92) 68%, rgba(0,0,0,0.38) 84%, transparent 100%)",
        }}
      >
        <Image
          src="/assets/terrace_laptop_desk.jpg"
          alt="Cyber-Pastoral Terrace Workspace"
          fill
          priority
          quality={92}
          className="object-cover object-bottom"
        />

        {/* Ambient Top Sky Overlay for High-Contrast Heading Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

        {/* Dynamic Sunlight Beams (God-Rays Gleam Animation) */}
        <div className="absolute -top-16 -left-16 w-[90vw] h-[90vh] pointer-events-none opacity-60 mix-blend-screen overflow-hidden">
          <div className="sunbeam-ray ray-1" />
          <div className="sunbeam-ray ray-2" />
          <div className="sunbeam-ray ray-3" />
        </div>

        {/* Floating Golden Pollen / Sunbeam Motes (GPU CSS) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="hero-pollen p-1" style={{ top: "14%", left: "12%", animationDelay: "0s" }} />
          <span className="hero-pollen p-2" style={{ top: "22%", left: "20%", animationDelay: "1.8s" }} />
          <span className="hero-pollen p-3" style={{ top: "30%", left: "16%", animationDelay: "3.5s" }} />
          <span className="hero-pollen p-4" style={{ top: "18%", left: "32%", animationDelay: "0.8s" }} />
          <span className="hero-pollen p-5" style={{ top: "36%", left: "26%", animationDelay: "2.6s" }} />
          <span className="hero-pollen p-6" style={{ top: "26%", left: "40%", animationDelay: "4.2s" }} />
          <span className="hero-pollen p-7" style={{ top: "42%", left: "34%", animationDelay: "1.4s" }} />
          <span className="hero-pollen p-8" style={{ top: "16%", left: "52%", animationDelay: "3.1s" }} />
          <span className="hero-pollen p-9" style={{ top: "48%", left: "22%", animationDelay: "5.0s" }} />
          <span className="hero-pollen p-10" style={{ top: "24%", left: "62%", animationDelay: "2.1s" }} />
        </div>

        {/* Fluttering Green Leaves & Pink Sakura Petals Drifting Across the Scene */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="drifting-leaf leaf-1" style={{ top: "10%", right: "22%", animationDelay: "0s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-500/80 drop-shadow-sm">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9.5 9.8.5.1 1-.3 1-.8v-3.5c4.5-1 8-5 8-9.5 0-4.4-3.8-8-8.5-8z" />
            </svg>
          </div>
          <div className="drifting-leaf leaf-2" style={{ top: "18%", right: "15%", animationDelay: "2.5s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-pink-400/80 drop-shadow-sm">
              <path d="M12 2C8 2 4 6 4 11c0 4 3 8 8 11 5-3 8-7 8-11 0-5-4-9-8-9z" />
            </svg>
          </div>
          <div className="drifting-leaf leaf-3" style={{ top: "28%", right: "32%", animationDelay: "4.8s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-400/85 drop-shadow-sm">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9.5 9.8.5.1 1-.3 1-.8v-3.5c4.5-1 8-5 8-9.5 0-4.4-3.8-8-8.5-8z" />
            </svg>
          </div>
          <div className="drifting-leaf leaf-4" style={{ top: "14%", right: "10%", animationDelay: "1.2s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-pink-300/85 drop-shadow-sm">
              <path d="M12 2C8 2 4 6 4 11c0 4 3 8 8 11 5-3 8-7 8-11 0-5-4-9-8-9z" />
            </svg>
          </div>
          <div className="drifting-leaf leaf-5" style={{ top: "34%", right: "25%", animationDelay: "3.7s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-teal-400/80 drop-shadow-sm">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9.5 9.8.5.1 1-.3 1-.8v-3.5c4.5-1 8-5 8-9.5 0-4.4-3.8-8-8.5-8z" />
            </svg>
          </div>
          <div className="drifting-leaf leaf-6" style={{ top: "22%", right: "42%", animationDelay: "5.6s" }}>
            <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-500/75 drop-shadow-sm">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9.5 9.8.5.1 1-.3 1-.8v-3.5c4.5-1 8-5 8-9.5 0-4.4-3.8-8-8.5-8z" />
            </svg>
          </div>
        </div>

        {/* Delicate Steaming Coffee Mug Vapor on the Desk (Visible on all devices) */}
        <div
          className="absolute pointer-events-none"
          style={{ right: "19%", bottom: "27%" }}
        >
          <div className="coffee-steam steam-1" />
          <div className="coffee-steam steam-2" />
        </div>

        {/* Ambient Active Terminal Code Glow on Laptop Screen */}
        <div
          className="absolute w-28 h-20 rounded-md pointer-events-none"
          style={{
            right: "24.5%",
            bottom: "26.5%",
            animation: "screenCodeGlow 3.5s ease-in-out infinite",
          }}
        />

        {/* Deep Multi-Stop Bleed Gradient Dissolving the Terrace Deck into #FAFAF9 */}
        <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/95 via-[#FAFAF9]/50 to-transparent pointer-events-none z-10" />
      </div>

      {/* Embedded High-Performance GPU Keyframe Styles */}
      <style jsx global>{`
        /* 1. Shimmering God-Ray Light Shafts */
        .sunbeam-ray {
          position: absolute;
          top: 0;
          left: 0;
          width: 150%;
          height: 100px;
          transform-origin: top left;
          background: linear-gradient(
            90deg,
            rgba(254, 240, 138, 0.55) 0%,
            rgba(255, 255, 255, 0.35) 35%,
            transparent 85%
          );
          filter: blur(14px);
          pointer-events: none;
        }
        .ray-1 {
          transform: rotate(32deg);
          animation: rayPulse 6s ease-in-out infinite alternate;
        }
        .ray-2 {
          transform: rotate(45deg);
          animation: rayPulse 8s ease-in-out infinite alternate 1.5s;
          height: 130px;
        }
        .ray-3 {
          transform: rotate(58deg);
          animation: rayPulse 7s ease-in-out infinite alternate 3s;
          height: 110px;
        }
        @keyframes rayPulse {
          0% {
            opacity: 0.35;
            transform: scaleY(0.92) rotate(var(--rot, 35deg));
          }
          100% {
            opacity: 0.75;
            transform: scaleY(1.12) rotate(var(--rot, 35deg));
          }
        }

        /* 2. Golden Sun Pollen / Motes */
        .hero-pollen {
          position: absolute;
          width: 4.5px;
          height: 4.5px;
          border-radius: 50%;
          background: #FEF08A;
          box-shadow: 0 0 10px rgba(254, 240, 138, 0.95), 0 0 18px rgba(254, 240, 138, 0.6);
          animation: pollenDrift 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes pollenDrift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(85px, 110px, 0);
            opacity: 0;
          }
        }

        /* 3. Fluttering Leaves & Petals */
        .drifting-leaf {
          position: absolute;
          width: 18px;
          height: 18px;
          animation: leafFlutter 10s ease-in-out infinite;
          transform-origin: center center;
        }
        @keyframes leafFlutter {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
            transform: translate3d(-35px, 35px, 0) rotate(70deg) scale(1);
          }
          50% {
            transform: translate3d(-110px, 120px, 0) rotate(190deg) scale(1.05);
            opacity: 0.9;
          }
          85% {
            opacity: 0.75;
            transform: translate3d(-190px, 220px, 0) rotate(310deg) scale(0.95);
          }
          100% {
            transform: translate3d(-260px, 310px, 0) rotate(420deg) scale(0.8);
            opacity: 0;
          }
        }

        /* 4. Steaming Coffee Vapor */
        .coffee-steam {
          position: absolute;
          width: 10px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.75), transparent);
          filter: blur(2px);
          animation: coffeeVapor 3.2s ease-out infinite;
        }
        .coffee-steam.steam-2 {
          animation-delay: 1.6s;
          transform: scaleX(0.8);
        }
        @keyframes coffeeVapor {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.7;
          }
          65% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-38px) scaleX(1.8);
            opacity: 0;
          }
        }

        /* 5. Ambient Active Code Glow */
        @keyframes screenCodeGlow {
          0%, 100% {
            background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%);
          }
          50% {
            background: radial-gradient(circle, rgba(16, 185, 129, 0.50) 0%, transparent 75%);
          }
        }

        /* 6. Floating Status Pill Micro-Drift */
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
