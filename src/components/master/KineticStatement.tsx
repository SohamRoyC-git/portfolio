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

      // 1. Two-Phase Deep Dramatic Dome to Rectangle Entrance (70% Ascend, 30% Corner Fill)
      // The tall ellipse dome rises all the way up until its apex touches y=0 (corners at y=50%).
      // Only after touching the top edge do the shoulders expand to complete a 100% full rectangle.
      if (stageRef.current) {
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          },
        });

        // Phase A (0.0 -> 0.70): Tall dramatic ellipse rises up across the screen
        // At 0.70, apex hits exact top (y=0) while corners remain curved at y=50%
        entranceTl.fromTo(
          stageRef.current,
          { clipPath: "ellipse(70% 166% at 50% 266%)" },
          {
            clipPath: "ellipse(70% 166% at 50% 166%)",
            ease: "power1.inOut",
            duration: 0.7,
          },
          0
        );

        // Phase B (0.70 -> 1.00): Apex remains locked at top while shoulders smoothly fill top corners into full rectangle
        entranceTl.to(
          stageRef.current,
          {
            clipPath: "ellipse(150% 150% at 50% 50%)",
            ease: "power2.out",
            duration: 0.3,
          },
          0.7
        );
      }

      // 2. Entrance Timeline: Once the ellipse completes into a rectangle at top top,
      // continuing to scroll reveals the dividers and text line-by-line in an upwards reveal animation.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=450",
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
    // Full Cinematic Ellipse Aperture Reveal & Silky Line Unmasking on Mobile
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");

      // 1. Two-Phase Deep Dramatic Dome on Mobile (70% Ascend, 30% Corner Fill)
      if (stageRef.current) {
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          },
        });

        // Phase A (0.0 -> 0.70): Ascend until apex reaches y=0
        entranceTl.fromTo(
          stageRef.current,
          { clipPath: "ellipse(65% 138% at 50% 238%)" },
          {
            clipPath: "ellipse(65% 138% at 50% 138%)",
            ease: "power1.inOut",
            duration: 0.7,
          },
          0
        );

        // Phase B (0.70 -> 1.00): Fill corners into full rectangle
        entranceTl.to(
          stageRef.current,
          {
            clipPath: "ellipse(150% 150% at 50% 50%)",
            ease: "power2.out",
            duration: 0.3,
          },
          0.7
        );
      }

      // 2. Entrance Timeline: Once the ellipse completes at top top, reveals text upwards smoothly
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350",
          scrub: 0.4,
        },
      });

      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.25, ease: "power2.out" },
          0
        );
      }

      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
          0.05
        );
      }

      if (statementLines && statementLines.length > 0) {
        tl.fromTo(
          statementLines,
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.4,
            ease: "power3.out",
          },
          0.1
        );
      }

      if (attributionRef.current) {
        tl.fromTo(
          attributionRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
          0.3
        );
      }

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.94,
          yPercent: -10,
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

    return () => mm.revert();
  }, []);

  return (
    <div
      id="monument-statement"
      ref={sectionRef}
      className="relative w-full z-20"
      style={{ height: "calc(100svh + 800px)" }}
    >
      {/* Sticky 100svh Dedicated Architectural Stage (Rich Wine Red & Warm Italian Light Sand) */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-center pt-20 sm:pt-28 pb-8 sm:pb-12 px-5 sm:px-12 md:px-20 overflow-hidden bg-[#2D0A12] border-t border-[#EAD7C0]/20 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[#EAD7C0]/30" />

        <div
          ref={containerRef}
          className="w-full max-w-6xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
        >
          {/* Architectural Meta Bar */}
          <div
            ref={metaBarRef}
            className="flex items-center justify-between text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-[#CBB59D] mb-4 sm:mb-6 pb-2"
          >
            <span className="text-[#EAD7C0]">ARCHITECTURAL STATEMENT</span>
            <span className="hidden sm:inline text-[#CBB59D]/70">LAT 22.5726° N · LON 88.3639° E</span>
            <span className="text-[#FF8C38]">TERRACE PERSPECTIVE</span>
          </div>

          {/* Top Hairline Divider */}
          <div ref={dividerTopRef} className="w-full h-[1px] bg-[#EAD7C0]/20 mb-5 sm:mb-12 will-change-transform" />

          {/* Monumental All-Caps Statement in Warm Italian Light Sand */}
          <h2
            ref={headlineRef}
            className="font-sans font-black text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[4rem] tracking-tight leading-[1.08] uppercase text-[#EAD7C0] mb-5 sm:mb-12 select-none"
          >
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block">
                WE DO NOT BUILD SOFTWARE TO SIT PASSIVELY ON A SCREEN.
              </span>
            </div>
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block">
                WE ENGINEER <span className="text-[#FF8C38]">DIGITAL ENVIRONMENTS</span> WITH PHYSICAL WEIGHT,
              </span>
            </div>
            <div className="overflow-hidden pb-1">
              <span className="statement-line inline-block text-[#EAD7C0]/50">
                KINETIC INTENTION, AND INTERNATIONAL SCALE.
              </span>
            </div>
          </h2>

          {/* Bottom Hairline Divider */}
          <div ref={dividerBottomRef} className="w-full h-[1px] bg-[#EAD7C0]/20 mb-4 sm:mb-6 will-change-transform" />

          {/* Attribution Tag */}
          <div
            ref={attributionRef}
            className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-[#CBB59D] tracking-wider"
          >
            <span className="text-[#EAD7C0]/80">SOHAM ROYCHOUDHURY · ARCHITECTURAL CREED</span>
            <span className="text-[#EAD7C0]/50 hidden sm:inline">KOLKATA // LATVIA // GLOBAL</span>
          </div>
        </div>
      </section>
    </div>
  );
});

KineticStatement.displayName = "KineticStatement";
