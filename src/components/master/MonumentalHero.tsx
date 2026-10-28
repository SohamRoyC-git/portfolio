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
  // Mobile Refs
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileVideoWrapperRef = useRef<HTMLDivElement | null>(null);
  const irisOverlayRef = useRef<HTMLDivElement | null>(null);
  const laptopCueRef = useRef<HTMLDivElement | null>(null);
  const mobileIdentityRef = useRef<HTMLDivElement | null>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mobileTerraceFooterRef = useRef<HTMLDivElement | null>(null);

  // Desktop Refs
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // MOBILE TIMELINE (< 768px):
    // 100% GPU-Composited Silky Smooth Lens Iris & Kinetic Materialization
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current) return;

      // 1. Initial GPU-Composited States
      if (irisOverlayRef.current) {
        gsap.set(irisOverlayRef.current, {
          scale: 1,
          transformOrigin: "50% 50%",
        });
      }

      if (mobileIdentityRef.current) {
        gsap.set(mobileIdentityRef.current, {
          opacity: 0,
          y: 35,
          scale: 0.95,
          pointerEvents: "none",
        });
      }

      if (laptopCueRef.current) {
        gsap.set(laptopCueRef.current, { opacity: 1, y: 0 });
      }

      // 2. Idle Levitation for the Laptop Micro-Cue
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

      // 3. Silky 1:1 Responsive Scrub Timeline (zero rubber-band lag, 120 FPS compositor)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2, // Ultra-responsive tactile tracking with user touch momentum
          onUpdate: (self) => {
            if (mobileIdentityRef.current) {
              mobileIdentityRef.current.style.pointerEvents =
                self.progress > 0.45 ? "auto" : "none";
            }
          },
        },
      });

      // Phase 1 (0 -> 25%): Laptop micro-cue & terrace coordinates dissolve
      if (laptopCueRef.current) {
        masterTl.to(
          laptopCueRef.current,
          {
            opacity: 0,
            y: -18,
            scale: 0.92,
            duration: 0.22,
            ease: "power2.out",
          },
          0
        );
      }

      if (mobileTerraceFooterRef.current) {
        masterTl.to(
          mobileTerraceFooterRef.current,
          {
            opacity: 0,
            duration: 0.18,
            ease: "power2.out",
          },
          0
        );
      }

      // Phase 2 (0 -> 46%): 100% Hardware GPU-Accelerated Lens Iris Scale Down (Zero CPU/SVG repaint bottleneck)
      if (irisOverlayRef.current) {
        masterTl.to(
          irisOverlayRef.current,
          {
            scale: 0,
            duration: 0.46,
            ease: "power2.inOut",
          },
          0
        );
      }

      if (mobileVideoWrapperRef.current) {
        masterTl.to(
          mobileVideoWrapperRef.current,
          {
            scale: 0.96,
            opacity: 0,
            duration: 0.46,
            ease: "power1.inOut",
          },
          0
        );
      }

      // Phase 3 (38% -> 76%): Monumental Header materializes cleanly with GPU opacity & translation
      if (mobileIdentityRef.current) {
        masterTl.to(
          mobileIdentityRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power2.out",
          },
          0.38
        );
      }

      // Phase 4 (76% -> 100%): Luxury hold period before unpinning smoothly into Movement 01
      masterTl.to({}, { duration: 0.24 });

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
      {/* MOBILE EXPERIENCE (< 768px): MIDNIGHT MONOLITH LENS IRIS CINEMATIC APERTURE */}
      {/* ========================================================================= */}
      <div
        ref={mobileContainerRef}
        className="md:hidden relative w-full h-[220vh] bg-[#000000]"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#000000] flex flex-col justify-between">
          {/* 1. Living Pixel-Art Terrace Video Layer (Cropped to cat, coffee, laptop) */}
          <div
            ref={mobileVideoWrapperRef}
            className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
          >
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
          </div>

          {/* 2. 100% GPU-Composited Photographic Lens Iris / Eclipse Dissolve Layer */}
          <div
            ref={irisOverlayRef}
            className="absolute pointer-events-none z-10 will-change-transform"
            style={{
              left: "56%",
              top: "52%",
              width: "360vmax",
              height: "360vmax",
              transform: "translate3d(-50%, -50%, 0) scale(1)",
              background:
                "radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.92) 38%, #000000 48%, #000000 100%)",
            }}
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-md shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-sans font-bold text-[9px] tracking-[0.22em] text-white/95 uppercase">
                TERRACE 01
              </span>
              <span className="text-white/30 text-[8px]">•</span>
              <span className="font-sans font-medium text-[9px] tracking-widest text-slate-300 uppercase flex items-center gap-1">
                SCROLL
                <ArrowDown size={9} className="text-white/80 animate-bounce" />
              </span>
            </div>
            <div className="w-[1px] h-3.5 bg-gradient-to-b from-white/40 to-transparent mx-auto" />
            <div className="w-1 h-1 rounded-full bg-white/60 mx-auto -mt-0.5" />
          </div>

          {/* 4. Monumental Identity Section with Understated Wireframe & Stark Typography */}
          <div
            ref={mobileIdentityRef}
            className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-8 px-6 text-center will-change-[transform,opacity] pointer-events-none opacity-0"
          >
            {/* Background Understated 3D Mathematical Wireframe Matrix */}
            <AnimatedWireframeMatrix />

            {/* Top spacer */}
            <div />

            {/* Centered Identity Lockup (A24 / Balenciaga High-Fashion Minimal) */}
            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center my-auto">
              {/* Minimalist Hairline Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-[0.24em] text-slate-300 mb-5 px-3.5 py-1 rounded-full border border-white/15 bg-black/50 backdrop-blur-md">
                <Sparkles size={10} className="text-white/80" />
                <span>NSEC (2024–2028)</span>
              </div>

              {/* Cinematic Grand Headline in BN Riley (Pure Stark White) */}
              <h1
                ref={mobileTitleRef}
                className="font-riley text-5xl xs:text-6xl text-white tracking-tight uppercase leading-[0.92] mb-5 select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
              >
                Soham <br />
                <span className="text-white">
                  Roychoudhury
                </span>
              </h1>

              {/* Editorial Subtitle in Athelas Italic */}
              <p className="font-athelas italic font-normal text-sm xs:text-base text-slate-300 leading-relaxed mb-8 max-w-xs px-1">
                Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
              </p>

              {/* Minimalist High-Contrast Action Controls */}
              <div className="flex items-center justify-center gap-3 w-full max-w-xs">
                <button
                  onClick={onExplore}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-slate-200 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowDown size={13} />
                </button>

                <button
                  onClick={handleConnectClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black hover:bg-white/10 text-white border border-white/20 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer backdrop-blur-md active:scale-95"
                >
                  <span>Contact</span>
                  <ArrowUpRight size={13} className="text-slate-300" />
                </button>
              </div>
            </div>

            {/* Bottom Coordinates & Location Bar */}
            <div className="relative z-10 w-full flex items-center justify-between pt-3 border-t border-white/10 text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
              <span>KOLKATA // LAT 22.5726° N</span>
              <span>ARCHIVE 2026</span>
            </div>
          </div>

          {/* Initial Bottom Bar on Terrace (Fades on early scroll) */}
          <div
            ref={mobileTerraceFooterRef}
            className="relative z-10 w-full flex items-center justify-between p-4 border-t border-white/15 text-[9px] font-sans font-bold text-white/80 uppercase tracking-widest will-change-[opacity]"
          >
            <span>KOLKATA // 22.5726° N</span>
            <span>TERRACE</span>
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
