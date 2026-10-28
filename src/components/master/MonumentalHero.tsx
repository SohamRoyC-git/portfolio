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
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // MOBILE TIMELINE (< 768px): Atmospheric scene first -> Cinematic scroll reveal
    mm.add("(max-width: 767px)", () => {
      // 1. Initial State: Name & details are completely hidden, allowing the pixel art world to shine
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 45,
        scale: 0.94,
        pointerEvents: "none",
      });
      gsap.set(titleRef.current, {
        filter: "blur(12px)",
      });
      gsap.set(scrollCueRef.current, {
        opacity: 1,
        y: 0,
      });

      // 2. Pinned Scroll Timeline for tactile, unhurried cinematic emergence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=125%", // ~1.25x viewport height for natural scroll pacing
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      });

      // Step A: Fade out the atmospheric scroll cue right as scroll starts
      tl.to(scrollCueRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.15,
        ease: "power2.out",
      })
      // Step B: Smoothly materialize the entire centered content container
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        onUpdate: () => {
          if (contentRef.current) contentRef.current.style.pointerEvents = "auto";
        },
      }, "-=0.05")
      // Step C: De-blur the monumental title for crisp optical focus
      .to(titleRef.current, {
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.45")
      // Step D: Subtle spring on action controls
      .fromTo(actionsRef.current,
        { scale: 0.92, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      )
      // Step E: Lingering pause so user absorbs the majestic headline before scrolling into Movement 01
      .to({}, { duration: 0.4 });
    });

    // DESKTOP TIMELINE (>= 768px): Header visible from start, subtle parallax dissolve
    mm.add("(min-width: 768px)", () => {
      gsap.set(contentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "none",
        pointerEvents: "auto",
      });
      gsap.set(titleRef.current, {
        filter: "none",
      });

      if (videoWrapperRef.current) {
        gsap.to(videoWrapperRef.current, {
          y: 60,
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: sectionRef.current,
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
    <section
      id="monument-hero"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-36 pb-8 sm:pb-14 px-4 sm:px-8 md:px-12 z-10 select-none overflow-hidden"
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

        {/* Ambient Contrast Balance Vignettes for Razor-Sharp Centered Readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/30 pointer-events-none z-10" />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)",
          }}
        />

        {/* Soft, Lowered Multi-Stop Bleed Gradient at the Very Bottom Edge */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-44 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/85 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Centered Monumental Hero: Headline in BN Riley (Materializes on Mobile Scroll) */}
      <div
        ref={contentRef}
        className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-4 sm:py-10 will-change-transform"
      >
        {/* Institutional Eyebrow */}
        <div
          ref={eyebrowRef}
          className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-emerald-300 mb-3 sm:mb-6 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-lg"
        >
          <Sparkles size={12} className="text-[#10B981]" />
          <span>Netaji Subhash Engineering College (2024–2028)</span>
        </div>

        {/* Cinematic Grand Headline in BN Riley (Monumental Focal Highlight) */}
        <h1
          ref={titleRef}
          className="font-riley text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] xl:text-[8rem] text-white tracking-tight uppercase leading-[0.95] sm:leading-[0.92] mb-4 sm:mb-6 drop-shadow-[0_6px_36px_rgba(0,0,0,0.95)] select-none"
        >
          Soham <br />
          <span className="bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(16,185,129,0.35)]">
            Roychoudhury
          </span>
        </h1>

        {/* Editorial Subtitle in Athelas Italic (Centered & High Legibility) */}
        <p
          ref={subtitleRef}
          className="font-athelas italic font-normal text-sm xs:text-base sm:text-2xl md:text-3xl text-slate-100 leading-relaxed mb-6 sm:mb-10 max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] px-2"
        >
          Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
        </p>

        {/* Dual Action Controls (Centered) */}
        <div
          ref={actionsRef}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
        >
          <button
            onClick={onExplore}
            className="group inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white text-[#0F172A] hover:bg-[#10B981] hover:text-white transition-all duration-300 font-sans font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-xl active:scale-98"
          >
            <span>Explore Work</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={handleConnectClick}
            className="group inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/30 transition-all duration-300 font-sans font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-xl backdrop-blur-md active:scale-98"
          >
            <span>Get In Touch</span>
            <ArrowUpRight size={14} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. Mobile Initial Atmospheric Scroll Cue (Visible only on mobile before scroll) */}
      <div
        ref={scrollCueRef}
        className="md:hidden absolute bottom-16 inset-x-0 mx-auto flex flex-col items-center gap-2 pointer-events-none z-20 transition-opacity"
      >
        <span className="font-sans font-black text-[9px] tracking-[0.24em] text-white/85 uppercase px-3.5 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-lg drop-shadow-md">
          Scroll to Explore
        </span>
        <div className="w-4 h-7 rounded-full border border-white/30 flex items-start justify-center p-1 backdrop-blur-xs">
          <div className="w-1 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
        </div>
      </div>

      {/* 4. Bottom Coordinates Bar (Whitish & Subtle) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-3 border-t border-white/20 text-[10px] sm:text-[11px] font-sans font-bold text-white/85 uppercase tracking-widest drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
        <span>KOLKATA // LAT 22.5726° N · LON 88.3639° E</span>
        <span className="hidden sm:inline">CYBER-PASTORAL TERRACE</span>
      </div>
    </section>
  );
});

MonumentalHero.displayName = "MonumentalHero";
