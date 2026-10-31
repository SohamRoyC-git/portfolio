"use client";

import React, { memo, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const KineticStatement: React.FC = memo(() => {
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0, active: false });

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const metaBarRef = useRef<HTMLDivElement | null>(null);
  const dividerTopRef = useRef<HTMLDivElement | null>(null);
  const dividerBottomRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const attributionRef = useRef<HTMLDivElement | null>(null);

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      setTouchPos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchPos((prev) => ({ ...prev, active: false }));
  };

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

      // 1. Entrance Ascent: The deep dramatic ellipse rises from below until its apex
      // touches the absolute top edge of the screen (y = 0) at the exact moment the stage pins at top top.
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: "ellipse(70% 166% at 50% 266%)" },
          {
            clipPath: "ellipse(70% 166% at 50% 166%)",
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top top",
              scrub: 0.5,
            },
          }
        );
      }

      // 2. Pinned Stage Timeline:
      // While pinned at the top, scrolling first expands the curved shoulders to fill
      // into a full rectangle, then continues scrolling reveals the statement text upwards!
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=650",
          scrub: 0.4,
        },
      });

      // Step 2A (0.0 -> 0.35): Now that the apex has reached the top, continuing to scroll
      // expands the curved shoulders into the top corners, smoothly transforming into a full rectangle!
      if (stageRef.current) {
        tl.fromTo(
          stageRef.current,
          { clipPath: "ellipse(70% 166% at 50% 166%)" },
          {
            clipPath: "ellipse(150% 150% at 50% 50%)",
            ease: "power2.inOut",
            duration: 0.35,
          },
          0
        );
      }

      // Step 2B (0.35 -> 1.0): With the stage now a 100% full rectangle,
      // continuing to scroll triggers the upward reveal of dividers and text!
      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.20, ease: "power2.out" },
          0.35
        );
      }

      // Meta bar materializes
      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.20, ease: "power2.out" },
          0.40
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
          0.45
        );
      }

      // Attribution tag unmasks
      if (attributionRef.current) {
        tl.fromTo(
          attributionRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.20, ease: "power2.out" },
          0.65
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
    // MOBILE SCROLL EXPERIENCE (< 768px) — DIRECTION B:
    // Architectural Sheet Lift + Laser Hairlines + Touch Specular Glow (Zero Ellipse)
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");

      // 1. Direction B: Architectural Sheet Lift from Below
      // The wine plinth smoothly lifts upward and expands from scale 0.95 to 1.0 as you scroll into it
      if (stageRef.current) {
        gsap.set(stageRef.current, { clipPath: "none" });

        gsap.fromTo(
          stageRef.current,
          { yPercent: 12, scale: 0.95 },
          {
            yPercent: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 30%",
              scrub: 0.35,
            },
          }
        );
      }

      // 2. Laser Hairlines & Kinetic Unmasking
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          0
        );
      }

      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.1
        );
      }

      if (statementLines && statementLines.length > 0) {
        tl.fromTo(
          statementLines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.65,
            ease: "power3.out",
          },
          0.2
        );
      }

      if (attributionRef.current) {
        tl.fromTo(
          attributionRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.55
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      id="monument-statement"
      ref={sectionRef}
      className="relative w-full z-20 min-h-[100svh] md:h-[calc(100svh+900px)]"
    >
      {/* 
        Direction B: Architectural Sheet on Mobile (rounded-t-[2.2rem], top amber horizon line, touch light) 
        and Sticky 100svh on Desktop
      */}
      <section
        ref={stageRef}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative md:sticky md:top-0 min-h-[100svh] md:h-[100svh] w-full flex flex-col justify-center pt-24 sm:pt-28 pb-12 sm:pb-12 px-5 sm:px-12 md:px-20 overflow-hidden bg-[#2D0A12] border-t-2 border-[#FF8C38]/40 md:border-t md:border-[#EAD7C0]/20 rounded-t-[2.2rem] md:rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.95)] md:shadow-none will-change-[transform,opacity]"
      >
        {/* Glowing Horizon Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF8C38] to-transparent shadow-[0_0_15px_#FF8C38]" />

        {/* Dynamic Mobile Specular Amber Finger Light */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            opacity: touchPos.active ? 1 : 0,
            background: `radial-gradient(circle 240px at ${touchPos.x}px ${touchPos.y}px, rgba(255, 140, 56, 0.22), transparent 70%)`,
          }}
        />

        <div
          ref={containerRef}
          className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
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

          {/* Top Laser Hairline Divider */}
          <div ref={dividerTopRef} className="w-full h-[1px] bg-[#EAD7C0]/25 mb-5 sm:mb-12 will-change-transform shadow-[0_0_8px_rgba(255,140,56,0.3)]" />

          {/* Monumental All-Caps Statement in Warm Italian Light Sand */}
          <h2
            ref={headlineRef}
            className="font-sans font-black text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[4rem] tracking-tight leading-[1.08] uppercase text-[#EAD7C0] mb-5 sm:mb-12 select-none"
          >
            <div className="overflow-hidden py-1.5">
              <span className="statement-line inline-block">
                WE DO NOT BUILD SOFTWARE TO SIT PASSIVELY ON A SCREEN.
              </span>
            </div>
            <div className="overflow-hidden py-1.5">
              <span className="statement-line inline-block">
                WE ENGINEER <span className="text-[#FF8C38]">DIGITAL ENVIRONMENTS</span> WITH PHYSICAL WEIGHT,
              </span>
            </div>
            <div className="overflow-hidden py-1.5">
              <span className="statement-line inline-block text-[#EAD7C0]/50">
                KINETIC INTENTION, AND INTERNATIONAL SCALE.
              </span>
            </div>
          </h2>

          {/* Bottom Laser Hairline Divider */}
          <div ref={dividerBottomRef} className="w-full h-[1px] bg-[#EAD7C0]/25 mb-4 sm:mb-6 will-change-transform shadow-[0_0_8px_rgba(255,140,56,0.3)]" />

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
