"use client";

import React, { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MonumentalHeroProps {
  onExplore: () => void;
  onConnect?: () => void;
}

export const MonumentalHero: React.FC<MonumentalHeroProps> = memo(({ onExplore, onConnect }) => {
  // Mobile Refs (Alternative 1: Monolithic Filmic Depth Dissolve)
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileVideoWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileBackdropVeilRef = useRef<HTMLDivElement | null>(null);
  const laptopCueRef = useRef<HTMLDivElement | null>(null);
  const mobileIdentityRef = useRef<HTMLDivElement | null>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mobileBottomHudRef = useRef<HTMLDivElement | null>(null);

  // Desktop Refs
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // MOBILE TIMELINE (< 768px) — ALTERNATIVE 1: MONOLITHIC FILMIC DEPTH DISSOLVE
    // Full-Bleed 100% Canvas Throughout · Optical Push-In · Zero Box Fragmentation
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current) return;

      // 1. Initial State Setup
      if (mobileVideoWrapperRef.current) {
        gsap.set(mobileVideoWrapperRef.current, {
          opacity: 1,
          scale: 1,
        });
      }

      if (mobileBackdropVeilRef.current) {
        gsap.set(mobileBackdropVeilRef.current, {
          opacity: 0,
        });
      }

      if (mobileIdentityRef.current) {
        gsap.set(mobileIdentityRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.96,
          pointerEvents: "none",
        });
      }

      if (laptopCueRef.current) {
        gsap.set(laptopCueRef.current, { opacity: 1, y: 0 });
      }

      if (mobileBottomHudRef.current) {
        gsap.set(mobileBottomHudRef.current, { opacity: 1, y: 0 });
      }

      // Continuous Idle Levitation on Laptop Micro-Cue
      let cueTween: gsap.core.Tween | null = null;
      if (laptopCueRef.current) {
        cueTween = gsap.to(laptopCueRef.current, {
          y: -6,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 2. Silky Continuous Scroll Scrub Timeline (~180vh total height = ~1.5 thumb swipes)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35, // Smooth touch momentum tracking
          onUpdate: (self) => {
            const videoEl = mobileVideoWrapperRef.current?.querySelector("video");
            if (videoEl) {
              if (self.progress >= 0.85 && !videoEl.paused) {
                videoEl.pause();
              } else if (self.progress < 0.85 && videoEl.paused) {
                videoEl.play().catch(() => {});
              }
            }

            if (mobileIdentityRef.current) {
              mobileIdentityRef.current.style.pointerEvents =
                self.progress > 0.40 ? "auto" : "none";
            }
          },
        },
      });

      // Phase 1 (0.0 -> 0.16): Cue & initial bottom hint dissolve early
      if (laptopCueRef.current) {
        masterTl.to(
          laptopCueRef.current,
          {
            opacity: 0,
            y: -18,
            scale: 0.92,
            duration: 0.16,
            ease: "power2.out",
          },
          0
        );
      }

      if (mobileBottomHudRef.current) {
        masterTl.to(
          mobileBottomHudRef.current,
          {
            opacity: 0,
            y: 12,
            duration: 0.16,
            ease: "power2.out",
          },
          0
        );
      }

      // Phase 2 (0.0 -> 0.48): Optical Camera Push-In on Full-Bleed Video (No box shrinkage!)
      if (mobileVideoWrapperRef.current) {
        masterTl.to(
          mobileVideoWrapperRef.current,
          {
            scale: 1.08,
            duration: 0.48,
            ease: "power1.inOut",
          },
          0
        );
      }

      // Deep atmospheric obsidian veil smoothly washes over video, turning it into living background texture
      if (mobileBackdropVeilRef.current) {
        masterTl.to(
          mobileBackdropVeilRef.current,
          {
            opacity: 0.88,
            duration: 0.48,
            ease: "power1.inOut",
          },
          0
        );
      }

      // Phase 3 (0.16 -> 0.48): Monumental Identity materializes in center screen from depth
      if (mobileIdentityRef.current) {
        masterTl.to(
          mobileIdentityRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.32,
            ease: "power2.out",
          },
          0.16
        );
      }

      // Phase 4 (0.48 -> 0.76): High-impact hold for full reading & button interaction
      masterTl.to({}, { duration: 0.28 });

      // Phase 5 (0.76 -> 1.00): Monolithic hero gently eases as Kinetic Statement lifts up
      if (mobileIdentityRef.current) {
        masterTl.to(
          mobileIdentityRef.current,
          {
            opacity: 0.3,
            scale: 0.98,
            duration: 0.24,
            ease: "power1.inOut",
          },
          0.76
        );
      }

      return () => {
        if (cueTween) cueTween.kill();
      };
    });

    // =========================================================================
    // DESKTOP TIMELINE (>= 768px):
    // High-Art Gallery Hero with Video Dissolve Parallax
    // =========================================================================
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
      {/* MOBILE EXPERIENCE (< 768px): MONOLITHIC FILMIC DEPTH DISSOLVE HERO        */}
      {/* ========================================================================= */}
      <div
        ref={mobileContainerRef}
        className="md:hidden relative w-full h-[180vh] bg-transparent overflow-clip"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[100dvh] min-h-screen w-full overflow-hidden bg-transparent select-none flex flex-col justify-between">
          {/* 1. Full-Bleed Living Pixel-Art Terrace Video Layer (Zero box shrinkage) */}
          <div
            ref={mobileVideoWrapperRef}
            className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden will-change-[transform,opacity]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-[85%_60%]"
            >
              <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
              <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
            </video>
            {/* Base atmospheric gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* 2. Deep Obsidian-Espresso Atmosphere Veil (Smooth filmic dissolve on scroll) */}
          <div
            ref={mobileBackdropVeilRef}
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#120408]/92 via-[#0A0205]/88 to-[#060103]/96 will-change-[opacity]"
          />

          {/* 3. Understated Editorial Swiss Laptop Micro-Cue (Anchored above laptop) */}
          <div
            ref={laptopCueRef}
            className="absolute pointer-events-none z-20 flex flex-col items-center will-change-[transform,opacity]"
            style={{
              left: "56%",
              top: "47%",
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
              <span className="font-sans font-bold text-[9px] tracking-[0.2em] text-white/95 uppercase">
                TERRACE
              </span>
              <span className="text-white/30 text-[8px]">•</span>
              <span className="font-sans font-medium text-[9px] tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                <span>Swipe to enter</span>
                <ArrowDown size={10} className="text-[#FF7A00] animate-bounce" />
              </span>
            </div>
            {/* Minimalist hairline pointer stem */}
            <div className="w-[1px] h-3.5 bg-gradient-to-b from-[#FF5500]/60 to-transparent mx-auto" />
            <div className="w-1 h-1 rounded-full bg-[#FF5500] mx-auto -mt-0.5" />
          </div>

          {/* 4. Initial Mobile Bottom Hint HUD */}
          <div
            ref={mobileBottomHudRef}
            className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between text-[9px] font-mono text-white/70 uppercase tracking-widest pointer-events-none"
          >
            <span>KOLKATA // STUDIO</span>
            <span className="flex items-center gap-1.5 text-[#FF8C38] font-bold">
              <span>SCROLL TO ENTER</span>
              <ArrowDown size={11} className="animate-bounce" />
            </span>
          </div>

          {/* 5. Monumental Identity Section (Centered in the Full-Bleed Viewport) */}
          <div
            ref={mobileIdentityRef}
            className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-8 px-6 text-center will-change-[transform,opacity] pointer-events-none opacity-0"
          >
            {/* Top spacer */}
            <div />

            {/* Centered Identity Lockup */}
            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center my-auto">
              {/* Minimalist Hairline Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-[0.24em] text-orange-200/90 mb-5 px-3.5 py-1 rounded-full border border-orange-500/25 bg-black/50 backdrop-blur-md shadow-lg">
                <Sparkles size={10} className="text-[#FF7A00]" />
                <span>NSEC (2024–2028)</span>
              </div>

              {/* Signature Aesthetic Font Pairing (Citadel Script + Helvetica Compressed) */}
              <h1
                ref={mobileTitleRef}
                className="relative flex flex-col items-center justify-center text-center select-none mb-4 overflow-visible"
              >
                {/* Word 1: Soham in Citadel Script */}
                <span className="font-citadel font-normal text-[4.8rem] xs:text-[5.8rem] sm:text-[6.8rem] text-[#FFFDF8] leading-[0.8] relative z-20 -mb-2.5 xs:-mb-4 -translate-x-3 xs:-translate-x-6 drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                  Soham
                </span>
                {/* Word 2: Roychoudhury in Helvetica Compressed */}
                <span className="font-helvetica font-normal text-[3.4rem] xs:text-[4.2rem] sm:text-[4.8rem] text-[#F8F5EE] tracking-[0.025em] leading-[1.0] pb-2 sm:pb-3 relative z-10 drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)] overflow-visible inline-block">
                  Roychoudhury
                </span>
              </h1>

              {/* Editorial Subtitle in Helvetica Compressed */}
              <p className="font-helvetica font-normal text-xs xs:text-sm text-orange-100/90 tracking-[0.14em] uppercase leading-relaxed mb-7 max-w-xs px-1 drop-shadow-md">
                Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
              </p>

              {/* Minimalist High-Contrast Action Controls */}
              <div className="flex items-center justify-center gap-3 w-full max-w-xs">
                <button
                  onClick={onExplore}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-orange-100 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xl active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowDown size={13} />
                </button>

                <button
                  onClick={handleConnectClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/25 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer backdrop-blur-md active:scale-95 shadow-lg"
                >
                  <span>Contact</span>
                  <ArrowUpRight size={13} className="text-orange-300" />
                </button>
              </div>
            </div>

            {/* Bottom Coordinates Bar */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-orange-200/60 uppercase tracking-widest pt-2">
              <span>KOLKATA // LAT 22.5726° N</span>
              <span>ATELIER 2026</span>
            </div>
          </div>
        </div>
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
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#060709] via-[#060709]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Centered Monumental Headline (Matching the 'Soft Light' Reference) */}
        <div className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-6">
          {/* Top Editorial HUD Metadata (Mirroring @nidzzify and 02 / 05) */}
          <div className="w-full max-w-2xl flex items-center justify-between text-xs font-sans font-bold uppercase tracking-[0.22em] text-white/60 mb-6 px-2">
            <span>@sohamroychoudhury</span>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-md">
              <Sparkles size={11} className="text-[#10B981]" />
              <span>NSEC (2024–2028)</span>
            </div>
            <span>01 / 05</span>
          </div>

          {/* Signature Aesthetic Font Pairing (Citadel Script + Helvetica Compressed - Matching 'Soft Light') */}
          <h1 className="relative flex flex-col items-center justify-center text-center select-none mb-6">
            {/* Word 1: Soham in Citadel Script (matching 'Soft') */}
            <span className="font-citadel font-normal text-[8.5rem] md:text-[10rem] lg:text-[11.5rem] xl:text-[13rem] text-[#FFFDF8] leading-[0.76] relative z-20 -mb-6 md:-mb-8 lg:-mb-10 xl:-mb-12 -translate-x-7 md:-translate-x-11 lg:-translate-x-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]">
              Soham
            </span>
            {/* Word 2: Roychoudhury in Helvetica Compressed (matching 'Light') */}
            <span className="font-helvetica font-normal text-[6.5rem] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[9.5rem] text-[#F8F5EE] tracking-[0.03em] leading-[0.84] relative z-10 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
              Roychoudhury
            </span>
          </h1>

          {/* Editorial Subtitle in Helvetica Compressed (matching 'Some moments glow in silence.') */}
          <p className="font-helvetica font-normal text-sm md:text-base lg:text-lg text-slate-200/90 tracking-[0.16em] uppercase leading-relaxed mb-10 max-w-2xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] px-2">
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
