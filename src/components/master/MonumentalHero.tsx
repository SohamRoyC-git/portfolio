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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const mm = gsap.matchMedia();

    // MOBILE TIMELINE (< 768px):
    // Native sticky pinning locks the hero on screen for 2.2x scroll height.
    // 1. Landing: Pure video (cat, laptop, coffee in center, ZERO black filter, zero text clutter).
    // 2. On Scroll: Dark contrast vignette fades in, name & details de-blur & materialize ON THE HERO.
    // 3. Luxury Hold: The full lockup stays visible on the hero before smoothly flowing into Movement 01.
    mm.add("(max-width: 767px)", () => {
      if (vignetteRef.current) {
        gsap.set(vignetteRef.current, { opacity: 0 });
      }
      if (contentRef.current) {
        gsap.set(contentRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.94,
          pointerEvents: "none",
        });
      }
      if (titleRef.current) {
        gsap.set(titleRef.current, { filter: "blur(14px)" });
      }
      if (scrollCueRef.current) {
        gsap.set(scrollCueRef.current, { opacity: 1, y: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          onUpdate: (self) => {
            if (contentRef.current) {
              contentRef.current.style.pointerEvents = self.progress > 0.35 ? "auto" : "none";
            }
          },
        },
      });

      // Phase 1 (0 to 25%): Fade out the initial scroll alert, smoothly fade in the dark contrast vignette
      if (scrollCueRef.current) {
        tl.to(
          scrollCueRef.current,
          {
            opacity: 0,
            y: -15,
            duration: 0.2,
            ease: "power2.out",
          },
          0
        );
      }

      if (vignetteRef.current) {
        tl.to(
          vignetteRef.current,
          {
            opacity: 1,
            duration: 0.45,
            ease: "power2.inOut",
          },
          0.05
        );
      }

      // Phase 2 (25% to 70%): Materialize the name and details directly ON the hero section
      if (contentRef.current) {
        tl.to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
          },
          0.22
        );
      }

      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          },
          0.26
        );
      }

      // Phase 3 (70% to 92%): Luxury hold period so the user absorbs the lockup while still on the hero
      tl.to({}, { duration: 0.4 });

      // Phase 4 (92% to 100%): Organic video dissolve as the hero un-sticks and transitions into Movement 01
      if (videoWrapperRef.current) {
        tl.to(
          videoWrapperRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.25,
            ease: "power1.out",
          },
          0.85
        );
      }
    });

    // DESKTOP TIMELINE (>= 768px): Centered headline directly visible, organic video dissolve
    mm.add("(min-width: 768px)", () => {
      if (vignetteRef.current) {
        gsap.set(vignetteRef.current, { opacity: 1 });
      }
      if (contentRef.current) {
        gsap.set(contentRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "none",
          pointerEvents: "auto",
        });
      }
      if (titleRef.current) {
        gsap.set(titleRef.current, { filter: "none" });
      }

      // Desktop video dissolve parallax into Movement 01
      if (videoWrapperRef.current && sectionRef.current) {
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
    <div
      id="monument-hero"
      ref={containerRef}
      className="relative w-full h-[220vh] md:h-auto overflow-visible"
    >
      <section
        ref={sectionRef}
        className="sticky top-0 h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-36 pb-8 sm:pb-14 px-4 sm:px-8 md:px-12 z-10 select-none overflow-visible md:relative md:min-h-[100svh] md:h-auto"
      >
        {/* 1. Living Pixel-Art Environment Video with Feathered Progressive Alpha Bleed at the Very Bottom */}
        <div
          ref={videoWrapperRef}
          className="absolute inset-0 -bottom-10 sm:-bottom-16 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
          }}
        >
          {/* Seamlessly Looping Pixel Art Environment Video (Mobile focused on right-side cat/coffee/laptop) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover max-md:object-[85%_bottom] md:object-bottom"
          >
            <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
            <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
          </video>

          {/* Dynamic Contrast Balance Vignettes (Hidden initially on mobile, fades in on scroll) */}
          <div
            ref={vignetteRef}
            className="absolute inset-0 pointer-events-none z-10 will-change-[opacity] max-md:opacity-0 transition-none"
          >
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

          {/* Soft, Lowered Multi-Stop Bleed Gradient at the Very Bottom Edge (Seamless flow into Movement 01) */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* 2. Centered Monumental Hero: Headline in BN Riley */}
        <div
          ref={contentRef}
          className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-6 sm:py-10 will-change-[transform,opacity] max-md:opacity-0 max-md:translate-y-8 max-md:pointer-events-none"
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

        {/* 3. Mobile Initial Atmospheric Scroll Alert (Visible at landing, dissolves on scroll) */}
        <div
          ref={scrollCueRef}
          className="md:hidden absolute inset-x-0 bottom-20 mx-auto flex flex-col items-center gap-2 pointer-events-none z-20 will-change-[transform,opacity]"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="font-sans font-black text-[9px] tracking-[0.24em] text-white/95 uppercase drop-shadow-xs">
              Scroll to Explore
            </span>
            <ArrowDown size={12} className="text-emerald-400 animate-bounce" />
          </div>
        </div>

        {/* 4. Bottom Coordinates Bar (Whitish & Subtle) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-3 border-t border-white/20 text-[10px] sm:text-[11px] font-sans font-bold text-white/85 uppercase tracking-widest drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          <span>KOLKATA // LAT 22.5726° N · LON 88.3639° E</span>
          <span className="hidden sm:inline">CYBER-PASTORAL TERRACE</span>
        </div>
      </section>
    </div>
  );
});

MonumentalHero.displayName = "MonumentalHero";
