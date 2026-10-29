"use client";

import React, { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export const KineticStatement: React.FC = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);
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
    // DESKTOP CINEMATIC SCROLL-PINNED EXPERIENCE (>= 768px)
    // Inspired by Heron AI's slot-mask text rise & Forge Automotive's plinths
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");
      const plinthCards = plinthsRef.current?.querySelectorAll(".plinth-cell");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1600",
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0 -> 15%): Hairline Dividers draw across the screen
      if (dividerTopRef.current && dividerBottomRef.current) {
        tl.fromTo(
          [dividerTopRef.current, dividerBottomRef.current],
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.15, ease: "power2.out" },
          0
        );
      }

      // Phase 1b (0 -> 20%): Meta bar materializes
      if (metaBarRef.current) {
        tl.fromTo(
          metaBarRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
          0.05
        );
      }

      // Phase 2 (15% -> 45%): Monumental Statement unmasks line-by-line (Heron AI Style)
      if (statementLines && statementLines.length > 0) {
        tl.fromTo(
          statementLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.3,
            ease: "power3.out",
          },
          0.15
        );
      }

      // Phase 3 (35% -> 65%): 4 Architectural Plinths rise with optical focus pull
      if (plinthCards && plinthCards.length > 0) {
        tl.fromTo(
          plinthCards,
          {
            y: 50,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.06,
            duration: 0.3,
            ease: "power2.out",
          },
          0.35
        );
      }

      // Phase 4 (65% -> 85%): Dedicated reading plateau
      tl.to({}, { duration: 0.2 });

      // Phase 5 (85% -> 100%): Cinematic Exit & Camera Depth Pull-Back
      if (containerRef.current) {
        tl.to(
          containerRef.current,
          {
            scale: 0.95,
            opacity: 0.2,
            filter: "blur(4px)",
            yPercent: -8,
            duration: 0.15,
            ease: "power1.in",
          },
          0.85
        );
      }
    });

    // =========================================================================
    // MOBILE SCROLL EXPERIENCE (< 768px): Responsive, smooth entrance
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const statementLines = headlineRef.current?.querySelectorAll(".statement-line");
      const plinthCards = plinthsRef.current?.querySelectorAll(".plinth-cell");

      if (statementLines && statementLines.length > 0) {
        gsap.fromTo(
          statementLines,
          { yPercent: 80, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 80%",
            },
          }
        );
      }

      if (plinthCards && plinthCards.length > 0) {
        gsap.fromTo(
          plinthCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: plinthsRef.current,
              start: "top 85%",
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
    <section
      id="monument-statement"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center py-20 md:py-0 px-6 sm:px-10 md:px-16 z-10 overflow-hidden bg-[#060709]"
    >
      <div ref={containerRef} className="w-full max-w-7xl mx-auto flex flex-col justify-center will-change-transform">
        {/* Architectural Meta Bar (Heron AI / Belgrade Arbor Style) */}
        <div
          ref={metaBarRef}
          className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-slate-400 mb-8 pb-3"
        >
          <span>01 // ARCHITECTURAL CREED</span>
          <span className="hidden sm:inline text-slate-500">LAT 22.5726° N · LON 88.3639° E</span>
          <span className="text-[#FF7A00]">TERRACE PERSPECTIVE</span>
        </div>

        {/* Top Hairline Divider */}
        <div ref={dividerTopRef} className="w-full h-[1px] bg-white/10 mb-10 will-change-transform" />

        {/* Monumental All-Caps Statement (Heron AI & Forge Automotive Style) */}
        <h2
          ref={headlineRef}
          className="font-sans font-black text-3xl sm:text-5xl md:text-6xl lg:text-[4.6rem] xl:text-[5.2rem] tracking-tighter leading-[0.96] uppercase text-[#FFFDF9] mb-12 sm:mb-16 select-none"
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
  );
});

KineticStatement.displayName = "KineticStatement";
