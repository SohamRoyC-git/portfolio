"use client";

import React, { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export const KineticStatement: React.FC = memo(() => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const metaBarRef = useRef<HTMLDivElement | null>(null);
  const dividerTopRef = useRef<HTMLDivElement | null>(null);
  const dividerBottomRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const plinthsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP & TABLET EXPERIENCE (>= 768px):
    // Monolithic Sticky Stage, Immediate Razor-Sharp Entrance, Extended Reading Hold,
    // and Dynamic Parallax Dismissal into Movement 02 Wipe
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");
      const plinthCards = plinthsRef.current?.querySelectorAll(".plinth-cell");

      // 1. Center Ellipse Aperture Zoom Out Reveal Entrance (Heron AI / Camera Iris)
      // Section blooms outward from the center like a cinematic lens aperture!
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: "ellipse(0% 0% at 50% 50%)" },
          {
            clipPath: "ellipse(130% 130% at 50% 50%)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
      }

      // 2. Entrance & Reveal Timeline (Triggers cleanly as stage locks at top)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top top",
          scrub: 0.4,
        },
      });

      // Hairline Dividers draw across
      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.25, ease: "power2.out" },
          0
        );
      }

      // Meta bar materializes
      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
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
            duration: 0.45,
            ease: "power3.out",
          },
          0.1
        );
      }

      // 4 Architectural Plinths rise cleanly (100% crisp, ZERO blur)
      if (plinthCards && plinthCards.length > 0) {
        tl.fromTo(
          plinthCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.35,
            ease: "power2.out",
          },
          0.25
        );
      }

      // 3. Dynamic Shrink & Dismissal as Section finishes (ZERO blur, pure self-contained trigger)
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.92,
          yPercent: -16,
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
    // MOBILE SCROLL EXPERIENCE (< 768px): Smooth upward reveal
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");
      const plinthCards = plinthsRef.current?.querySelectorAll(".plinth-cell");

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

      if (plinthCards && plinthCards.length > 0) {
        gsap.fromTo(
          plinthCards,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: plinthsRef.current,
              start: "top 90%",
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  const plinths = [
    {
      num: "01",
      tag: "ACADEMIC CORE",
      title: "Netaji Subhash Engineering College",
      desc: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028). Specialized in predictive neural architectures and high-throughput systems.",
    },
    {
      num: "02",
      tag: "EUROPEAN OPS",
      title: "Latvian Cricket Federation",
      desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems.",
    },
    {
      num: "03",
      tag: "< 5MS ENGINE",
      title: "278-Key In-Memory Engine",
      desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels.",
    },
    {
      num: "04",
      tag: "DISTINCTION",
      title: "The Heritage School",
      desc: "ISC Class XII (82.75%) with distinction in Computer Science & Mathematics; ICSE (89.4%). Rigorous foundations in pure algorithmic logic.",
    },
  ];

  return (
    <div
      id="monument-statement"
      ref={sectionRef}
      className="relative w-full z-20"
      style={{ height: "calc(100svh + 1600px)" }}
    >
      {/* Sticky 100svh Architectural Stage */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-center pt-24 sm:pt-28 pb-8 px-6 sm:px-10 md:px-16 overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline (Zero AI glows) */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

        <div
          ref={containerRef}
          className="w-full max-w-7xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
        >
          {/* Architectural Meta Bar (Heron AI / Belgrade Arbor Style) */}
          <div
            ref={metaBarRef}
            className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-slate-400 mb-6 pb-2"
          >
            <span>ARCHITECTURAL CREED</span>
            <span className="hidden sm:inline text-slate-500">LAT 22.5726° N · LON 88.3639° E</span>
            <span className="text-[#FF7A00]">TERRACE PERSPECTIVE</span>
          </div>

          {/* Top Hairline Divider */}
          <div ref={dividerTopRef} className="w-full h-[1px] bg-white/10 mb-8 will-change-transform" />

          {/* Monumental All-Caps Statement (Heron AI & Forge Automotive Style) */}
          <h2
            ref={headlineRef}
            className="font-sans font-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] tracking-tighter leading-[0.98] uppercase text-[#FFFDF9] mb-8 sm:mb-12 select-none"
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

          {/* 4 Architectural Plinths (Forge Automotive / Swiss Architecture Style) */}
          <div
            ref={plinthsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-white/10"
          >
            {plinths.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 25 } }}
                className={`plinth-cell p-6 sm:p-8 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] border-b sm:border-b-0 border-white/10 ${
                  idx !== plinths.length - 1 ? "lg:border-r border-white/10" : ""
                } ${idx % 2 === 0 ? "sm:border-r sm:border-white/10 lg:border-r" : ""} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-helvetica font-normal text-5xl sm:text-6xl text-white/25 leading-none group-hover:text-[#FF7A00] transition-colors">
                    {item.num}
                  </span>
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#FF7A00]">
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-sans font-black text-base sm:text-lg uppercase tracking-tight text-[#FFFDF9] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans font-normal text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Hairline Divider */}
          <div ref={dividerBottomRef} className="w-full h-[1px] bg-white/10 mt-10 will-change-transform" />
        </div>
      </section>
    </div>
  );
});

KineticStatement.displayName = "KineticStatement";
