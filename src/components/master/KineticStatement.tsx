"use client";

import React, { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const KineticStatement: React.FC = memo(() => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const metaBarRef = useRef<HTMLDivElement | null>(null);
  const dividerTopRef = useRef<HTMLDivElement | null>(null);
  const dividerBottomRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const attributionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP & TABLET EXPERIENCE (>= 768px):
    // Dedicated Monumental Quote Stage. Clean Canvas, Snappy Scroll, Zero Blur.
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");

      // 1. Center Ellipse Aperture Zoom Out Reveal Entrance
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: "ellipse(0% 0% at 50% 50%)" },
          {
            clipPath: "ellipse(135% 135% at 50% 50%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 15%",
              scrub: 0.3,
            },
          }
        );
      }

      // 2. Entrance Timeline (Plays crisp unmasking as stage locks at top)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350",
          scrub: 0.3,
        },
      });

      // Dividers draw across
      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.2, ease: "power2.out" },
          0
        );
      }

      // Meta bar materializes
      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.05
        );
      }

      // Monumental Statement unmasks line-by-line (ZERO blur, immediate crispness)
      if (statementLines && statementLines.length > 0) {
        tl.fromTo(
          statementLines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.35,
            ease: "power3.out",
          },
          0.1
        );
      }

      // Attribution tag unmasks
      if (attributionRef.current) {
        tl.fromTo(
          attributionRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.3
        );
      }

      // 3. Dynamic Shrink & Dismissal as Section scrolls into Creed (Snappy ~500px total distance)
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.94,
          yPercent: -14,
          opacity: 0.15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    // =========================================================================
    // MOBILE SCROLL EXPERIENCE (< 768px):
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");

      if (statementLines && statementLines.length > 0) {
        gsap.fromTo(
          statementLines,
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      id="monument-statement"
      ref={sectionRef}
      className="relative w-full z-20"
      style={{ height: "calc(100svh + 500px)" }}
    >
      {/* Sticky 100svh Dedicated Architectural Stage */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-center pt-24 sm:pt-28 pb-12 px-6 sm:px-12 md:px-20 overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline (Zero AI glows) */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

        <div
          ref={containerRef}
          className="w-full max-w-6xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
        >
          {/* Architectural Meta Bar */}
          <div
            ref={metaBarRef}
            className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-slate-400 mb-6 pb-2"
          >
            <span>ARCHITECTURAL STATEMENT</span>
            <span className="hidden sm:inline text-slate-500">LAT 22.5726° N · LON 88.3639° E</span>
            <span className="text-[#FF7A00]">TERRACE PERSPECTIVE</span>
          </div>

          {/* Top Hairline Divider */}
          <div ref={dividerTopRef} className="w-full h-[1px] bg-white/10 mb-8 sm:mb-12 will-change-transform" />

          {/* Monumental All-Caps Statement (Forge Automotive & Heron AI Proportions) */}
          <h2
            ref={headlineRef}
            className="font-sans font-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[4rem] tracking-tight leading-[1.04] uppercase text-[#FFFDF9] mb-8 sm:mb-12 select-none"
          >
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block">
                WE DO NOT BUILD SOFTWARE TO SIT PASSIVELY ON A SCREEN.
              </span>
            </div>
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block">
                WE ENGINEER <span className="text-[#FF7A00]">DIGITAL ENVIRONMENTS</span> WITH PHYSICAL WEIGHT,
              </span>
            </div>
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block text-white/50">
                KINETIC INTENTION, AND INTERNATIONAL SCALE.
              </span>
            </div>
          </h2>

          {/* Bottom Hairline Divider */}
          <div ref={dividerBottomRef} className="w-full h-[1px] bg-white/10 mb-6 will-change-transform" />

          {/* Attribution Tag */}
          <div
            ref={attributionRef}
            className="flex items-center justify-between text-xs font-mono text-slate-400 tracking-wider"
          >
            <span className="text-white/60">SOHAM ROYCHOUDHURY · ARCHITECTURAL CREED</span>
            <span className="text-white/30 hidden sm:inline">KOLKATA // LATVIA // GLOBAL</span>
          </div>
        </div>
      </section>
    </div>
  );
});

KineticStatement.displayName = "KineticStatement";
