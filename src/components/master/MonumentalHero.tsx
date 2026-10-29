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
  // Mobile Refs
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileVideoWrapperRef = useRef<HTMLDivElement | null>(null);
  const irisOverlayRef = useRef<HTMLDivElement | null>(null);
  const laptopCueRef = useRef<HTMLDivElement | null>(null);
  const mobileIdentityRef = useRef<HTMLDivElement | null>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement | null>(null);

  // Desktop Refs
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // MOBILE TIMELINE (< 768px):
    // Black Lens Ellipse Aperture Transition & Cinematic Header Blur Reveal
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current) return;

      // 1. Initial State: Dedicated Black Elliptical Aperture (Wide open at 150%)
      const irisData = { r: 150 };

      const updateIrisMask = (r: number) => {
        if (!irisOverlayRef.current) return;
        const inner = Math.max(0, r);
        const outer = Math.max(0, r + 24);
        const mask = `radial-gradient(ellipse 70% 60% at 56% 52%, transparent 0%, transparent ${inner.toFixed(1)}%, black ${outer.toFixed(1)}%, black 100%)`;
        irisOverlayRef.current.style.webkitMaskImage = mask;
        irisOverlayRef.current.style.maskImage = mask;
      };

      updateIrisMask(150);

      if (irisOverlayRef.current) {
        gsap.set(irisOverlayRef.current, { opacity: 1 });
      }

      if (mobileVideoWrapperRef.current) {
        mobileVideoWrapperRef.current.style.webkitMaskImage = "";
        mobileVideoWrapperRef.current.style.maskImage = "";
        gsap.set(mobileVideoWrapperRef.current, { opacity: 1, scale: 1, display: "block" });
      }

      // Initial Cinematic Blur & Depth State for Monumental Headline
      if (mobileIdentityRef.current) {
        gsap.set(mobileIdentityRef.current, {
          opacity: 0,
          y: 45,
          scale: 0.94,
          filter: "blur(18px)",
          pointerEvents: "none",
        });
      }

      if (laptopCueRef.current) {
        gsap.set(laptopCueRef.current, { opacity: 1, y: 0 });
      }

      // 2. Continuous Idle Levitation on Laptop Micro-Cue
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

      // 3. Silky Continuous Scroll Scrub Timeline (Aesthetic, organic & fluid)
      // Generous scroll distance ensures ellipse finishes completely with 0% of next section visible
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35, // Smooth touch momentum tracking
          onUpdate: (self) => {
            // 1. Instantly stop and freeze video when aperture has closed
            const videoEl = mobileVideoWrapperRef.current?.querySelector("video");
            if (videoEl) {
              if (self.progress >= 0.35 && !videoEl.paused) {
                videoEl.pause();
              } else if (self.progress < 0.35 && videoEl.paused) {
                videoEl.play().catch(() => {});
              }
            }

            // 2. Interactive pointer events
            if (mobileIdentityRef.current) {
              mobileIdentityRef.current.style.pointerEvents =
                self.progress > 0.45 ? "auto" : "none";
            }
          },
        },
      });

      // Phase 1 (0 -> 14%): Laptop micro-cue dissolves early
      if (laptopCueRef.current) {
        masterTl.to(
          laptopCueRef.current,
          {
            opacity: 0,
            y: -18,
            scale: 0.92,
            duration: 0.14,
            ease: "power2.out",
          },
          0
        );
      }

      // Phase 2 (0 -> 35%): Black Photographic Ellipse contracts smoothly into the laptop
      // Pure deep black (#0C0C0E) closes in on the laptop at 56% 52% (Never becomes a square!)
      // By 35% scroll, the ellipse has fully closed, while the next section is still 160vh below!
      masterTl.to(
        irisData,
        {
          r: -24,
          duration: 0.35,
          ease: "power2.inOut",
          onUpdate: () => {
            updateIrisMask(irisData.r);
          },
        },
        0
      );

      // Terrace video subtle camera scale for optical depth (stays 100% solid, zero premature transparency)
      if (mobileVideoWrapperRef.current) {
        masterTl.to(
          mobileVideoWrapperRef.current,
          {
            scale: 0.96,
            duration: 0.35,
            ease: "power1.inOut",
          },
          0
        );

        // HARD CUT: At exact moment 0.35 (aperture 100% closed into solid black),
        // completely hide and remove the video wrapper so it NEVER shows or plays for a split second!
        masterTl.set(
          mobileVideoWrapperRef.current,
          {
            display: "none",
            opacity: 0,
          },
          0.35
        );
      }

      // Phase 2b (0.35 -> 0.50): With video completely gone behind solid black,
      // the black overlay dissolves to unveil the continuous global smoky fluid artwork
      if (irisOverlayRef.current) {
        masterTl.to(
          irisOverlayRef.current,
          {
            opacity: 0,
            duration: 0.15,
            ease: "power1.inOut",
          },
          0.35
        );
      }

      // Phase 3 (0.38 -> 0.65): Monumental Header materializes with cinematic optical focus pull into razor-sharp clarity
      if (mobileIdentityRef.current) {
        masterTl.to(
          mobileIdentityRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.27,
            ease: "power2.out",
          },
          0.38
        );
      }

      // Phase 4 (0.65 -> 1.00): Dedicated luxury hold period where header remains 100% crisp and readable
      masterTl.to({}, { duration: 0.35 });

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
      {/* MOBILE EXPERIENCE (< 768px): VIBRANT ORANGE FLUID CINEMATIC APERTURE      */}
      {/* ========================================================================= */}
      <div
        ref={mobileContainerRef}
        className="md:hidden relative w-full h-[360vh] bg-transparent overflow-clip"
      >
        <div className="sticky top-0 h-[100dvh] min-h-[100dvh] min-h-screen w-full overflow-hidden bg-transparent flex flex-col justify-between">
          {/* 1. Living Pixel-Art Terrace Video Layer */}
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
          </div>

          {/* 2. Full-Screen Black Elliptical Aperture Overlay (Deep black #0C0C0E lens eclipse) */}
          <div
            ref={irisOverlayRef}
            className="absolute inset-0 z-10 pointer-events-none bg-[#0C0C0E] will-change-[mask-image,opacity]"
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
                <span>Scroll to see portfolio</span>
                <ArrowDown size={10} className="text-[#FF7A00] animate-bounce" />
              </span>
            </div>
            {/* Minimalist hairline pointer stem */}
            <div className="w-[1px] h-3.5 bg-gradient-to-b from-[#FF5500]/60 to-transparent mx-auto" />
            <div className="w-1 h-1 rounded-full bg-[#FF5500] mx-auto -mt-0.5" />
          </div>

          {/* 3. Monumental Identity Section (Vibrant Orange Fluid Background throughout) */}
          <div
            ref={mobileIdentityRef}
            className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-8 px-6 text-center will-change-[transform,opacity] pointer-events-none opacity-0"
          >
            {/* Top spacer */}
            <div />

            {/* Centered Identity Lockup */}
            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center my-auto">
              {/* Minimalist Hairline Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-[0.24em] text-orange-200/90 mb-5 px-3.5 py-1 rounded-full border border-orange-500/25 bg-black/40 backdrop-blur-md">
                <Sparkles size={10} className="text-[#FF7A00]" />
                <span>NSEC (2024–2028)</span>
              </div>

              {/* Signature Aesthetic Font Pairing (Citadel Script draped over Helvetica) */}
              <h1
                ref={mobileTitleRef}
                className="relative flex flex-col items-center justify-center select-none mb-4"
              >
                {/* Line 1: Soham in Citadel Script (flowing, flourished calligraphy) */}
                <span className="font-citadel text-7xl xs:text-8xl text-white normal-case leading-[0.74] relative z-20 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] -mb-2 xs:-mb-3.5 -rotate-1 -translate-x-2">
                  Soham
                </span>
                {/* Line 2: Roychoudhury in Bold Architectural Helvetica */}
                <span className="font-helvetica font-normal text-5xl xs:text-6xl text-white normal-case tracking-[0.02em] leading-[0.88] relative z-10 drop-shadow-[0_6px_35px_rgba(0,0,0,0.95)]">
                  Roychoudhury
                </span>
              </h1>

              {/* Editorial Subtitle in Helvetica Compressed */}
              <p className="font-helvetica uppercase tracking-[0.16em] font-normal text-xs xs:text-sm text-orange-100/90 leading-relaxed mb-8 max-w-xs px-1 drop-shadow-md">
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
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/25 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer backdrop-blur-md active:scale-95 shadow-lg"
                >
                  <span>Contact</span>
                  <ArrowUpRight size={13} className="text-orange-300" />
                </button>
              </div>
            </div>

            {/* Bottom Coordinates & Location Bar (Clean floating typography without card border) */}
            <div className="relative z-10 w-full flex items-center justify-between pt-3 text-[9px] font-sans font-bold text-orange-200/70 uppercase tracking-widest">
              <span>KOLKATA // LAT 22.5726° N</span>
              <span>ARCHIVE 2026</span>
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
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Centered Monumental Headline in BN Riley */}
        <div className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-10">
          {/* Institutional Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-emerald-300 mb-6 px-4 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-lg">
            <Sparkles size={12} className="text-[#10B981]" />
            <span>Netaji Subhash Engineering College (2024–2028)</span>
          </div>

          {/* Signature Aesthetic Font Pairing (Citadel Script draped over Helvetica) */}
          <h1 className="relative flex flex-col items-center justify-center select-none mb-6">
            {/* Line 1: Soham in Citadel Script (flowing, flourished calligraphy draped on top) */}
            <span className="font-citadel text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] text-white normal-case leading-[0.72] relative z-20 drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)] -mb-5 md:-mb-8 lg:-mb-10 -rotate-1 -translate-x-4">
              Soham
            </span>
            {/* Line 2: Roychoudhury in Bold Architectural Helvetica */}
            <span className="font-helvetica font-normal text-6xl md:text-7xl lg:text-[6.8rem] xl:text-[7.8rem] text-white normal-case tracking-[0.02em] leading-[0.85] relative z-10 drop-shadow-[0_8px_40px_rgba(0,0,0,0.95)]">
              Roychoudhury
            </span>
          </h1>

          {/* Editorial Subtitle in Helvetica Compressed (like 'Some moments glow in silence') */}
          <p className="font-helvetica uppercase tracking-[0.18em] font-normal text-sm md:text-base text-slate-200/90 leading-relaxed mb-10 max-w-2xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] px-2">
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
