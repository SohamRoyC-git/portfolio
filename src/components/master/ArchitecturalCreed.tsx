"use client";

import React, { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import { GraduationCap, Trophy, Cpu, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface FoundationPillar {
  num: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  status: string;
  icon: React.ElementType;
  chips: string[];
}

export const ArchitecturalCreed: React.FC = memo(() => {
  // Desktop Refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Mobile Cinematic Monograph Deck Refs (< 768px)
  const mobileSectionRef = useRef<HTMLDivElement | null>(null);
  const mobileStageRef = useRef<HTMLDivElement | null>(null);

  // Alternative 4: Mechanical Monocoque Shutter Reveal
  const creedShutterTopRef = useRef<HTMLDivElement | null>(null);
  const creedShutterBottomRef = useRef<HTMLDivElement | null>(null);
  const creedShutterLaserRef = useRef<HTMLDivElement | null>(null);
  const mobileSpotlightRef = useRef<HTMLDivElement | null>(null);

  // Mobile Telemetry HUD
  const hudRef = useRef<HTMLDivElement | null>(null);
  const mobileOdometerRef = useRef<HTMLDivElement | null>(null);
  const railSeg1Ref = useRef<HTMLDivElement | null>(null);
  const railSeg2Ref = useRef<HTMLDivElement | null>(null);
  const railSeg3Ref = useRef<HTMLDivElement | null>(null);
  const railSeg4Ref = useRef<HTMLDivElement | null>(null);

  // Mobile 4-Sheet Stacking Deck
  const cardDeckRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const card4Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP & TABLET EXPERIENCE (>= 768px): HIGH-ART PLINTH CARDS GRID
    // 100% UNTOUCHED & PRISTINE
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      if (!sectionRef.current) return;

      // 1. Entrance Horizontal Curtain Sweep (Left-to-Right)
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 20%",
              scrub: 0.3,
            },
          }
        );
      }

      // 2. Timeline for Header and Cards Reveal
      const cards = gridRef.current?.querySelectorAll(".creed-card");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350",
          scrub: 0.3,
        },
      });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
          0
        );
      }

      if (cards && cards.length > 0) {
        tl.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.35,
            ease: "power2.out",
          },
          0.1
        );
      }

      // 3. Smooth Exit into Movement 03 (Projects Showcase)
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.94,
          yPercent: -12,
          opacity: 0.2,
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
    // MOBILE CINEMATIC EXPERIENCE (< 768px):
    // Alternative 4: Mechanical Monocoque Shutter Reveal & 4-Sheet Titanium Deck
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileSectionRef.current) return;

      // Initial States:
      // Shutter starts closed with center laser glowing (seamless handoff from MonumentalHero)
      if (creedShutterTopRef.current && creedShutterBottomRef.current) {
        gsap.set(creedShutterTopRef.current, { yPercent: 0 });
        gsap.set(creedShutterBottomRef.current, { yPercent: 0 });
      }
      if (creedShutterLaserRef.current) {
        gsap.set(creedShutterLaserRef.current, { scaleX: 1, opacity: 1 });
      }

      // HUD and Stage Interior
      if (hudRef.current) gsap.set(hudRef.current, { opacity: 0, y: -12 });
      if (mobileSpotlightRef.current) gsap.set(mobileSpotlightRef.current, { opacity: 0 });
      if (mobileOdometerRef.current) gsap.set(mobileOdometerRef.current, { yPercent: 0 });

      // Cards initial positions: Sheet 01 docked, Sheets 02-04 stacked completely offscreen below (yPercent: 180)
      if (card1Ref.current) gsap.set(card1Ref.current, { yPercent: 0, scale: 1.0, opacity: 1 });
      if (card2Ref.current) gsap.set(card2Ref.current, { yPercent: 180, scale: 1.0, opacity: 1 });
      if (card3Ref.current) gsap.set(card3Ref.current, { yPercent: 180, scale: 1.0, opacity: 1 });
      if (card4Ref.current) gsap.set(card4Ref.current, { yPercent: 180, scale: 1.0, opacity: 1 });

      // Master Mobile Timeline across 360vh of thumb travel (Normalized 0.00 -> 10.00s)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      // Phase 1 (0.00 -> 1.50): AIRLOCK IRIS OPENING
      // Center laser line flares and splits; carbon shutters slide open vertically
      if (creedShutterLaserRef.current) {
        masterTl.to(
          creedShutterLaserRef.current,
          { scaleX: 1.15, opacity: 0, duration: 0.9, ease: "power2.out" },
          0
        );
      }
      if (creedShutterTopRef.current && creedShutterBottomRef.current) {
        masterTl.to(
          creedShutterTopRef.current,
          { yPercent: -100, duration: 1.35, ease: "power3.inOut" },
          0.10
        );
        masterTl.to(
          creedShutterBottomRef.current,
          { yPercent: 100, duration: 1.35, ease: "power3.inOut" },
          0.10
        );
      }
      // Stage spotlight and HUD bloom in
      if (mobileSpotlightRef.current) {
        masterTl.to(mobileSpotlightRef.current, { opacity: 1, duration: 1.2, ease: "power1.out" }, 0.30);
      }
      if (hudRef.current) {
        masterTl.to(hudRef.current, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, 0.40);
      }

      // Phase 2 (1.50 -> 3.20): SHEET 01 READING HOLD (Academic Core — NSEC AIML)
      masterTl.to({}, { duration: 1.7 }, 1.5);

      // Phase 3 (3.20 -> 5.00): SHEET 02 STACKS OVER SHEET 01 (Latvian Cricket Federation)
      if (card1Ref.current) {
        masterTl.to(
          card1Ref.current,
          { scale: 0.94, yPercent: -3, duration: 1.6, ease: "power2.out" },
          3.20
        );
      }
      if (card2Ref.current) {
        masterTl.to(
          card2Ref.current,
          { yPercent: 0, duration: 1.6, ease: "power2.out" },
          3.20
        );
      }
      if (railSeg2Ref.current) {
        masterTl.to(railSeg2Ref.current, { backgroundColor: "#FF8C38", duration: 0.4 }, 3.60);
      }
      if (mobileOdometerRef.current) {
        masterTl.to(mobileOdometerRef.current, { yPercent: -25, duration: 0.5, ease: "power2.out" }, 3.60);
      }

      // Phase 4 (5.00 -> 5.80): SHEET 02 READING HOLD
      masterTl.to({}, { duration: 0.8 }, 5.0);

      // Phase 5 (5.80 -> 7.40): SHEET 03 STACKS OVER SHEET 02 (278-Key Localization Engine)
      if (card1Ref.current) {
        masterTl.to(card1Ref.current, { opacity: 0, duration: 0.4 }, 5.80);
      }
      if (card2Ref.current) {
        masterTl.to(
          card2Ref.current,
          { scale: 0.94, yPercent: -3, duration: 1.6, ease: "power2.out" },
          5.80
        );
      }
      if (card3Ref.current) {
        masterTl.to(
          card3Ref.current,
          { yPercent: 0, duration: 1.6, ease: "power2.out" },
          5.80
        );
      }
      if (railSeg3Ref.current) {
        masterTl.to(railSeg3Ref.current, { backgroundColor: "#FF8C38", duration: 0.4 }, 6.20);
      }
      if (mobileOdometerRef.current) {
        masterTl.to(mobileOdometerRef.current, { yPercent: -50, duration: 0.5, ease: "power2.out" }, 6.20);
      }

      // Phase 6 (7.40 -> 8.00): SHEET 03 READING HOLD
      masterTl.to({}, { duration: 0.6 }, 7.4);

      // Phase 7 (8.00 -> 9.20): SHEET 04 STACKS AS FINAL DISTINCTION (The Heritage School)
      if (card2Ref.current) {
        masterTl.to(card2Ref.current, { opacity: 0, duration: 0.4 }, 8.00);
      }
      if (card3Ref.current) {
        masterTl.to(
          card3Ref.current,
          { scale: 0.94, yPercent: -3, duration: 1.2, ease: "power2.out" },
          8.00
        );
      }
      if (card4Ref.current) {
        masterTl.to(
          card4Ref.current,
          { yPercent: 0, duration: 1.2, ease: "power2.out" },
          8.00
        );
      }
      if (railSeg4Ref.current) {
        masterTl.to(railSeg4Ref.current, { backgroundColor: "#FF8C38", duration: 0.4 }, 8.30);
      }
      if (mobileOdometerRef.current) {
        masterTl.to(mobileOdometerRef.current, { yPercent: -75, duration: 0.5, ease: "power2.out" }, 8.30);
      }

      // Phase 8 (9.20 -> 9.55): MONOLITHIC PLINTH VERIFIED HOLD
      masterTl.to({}, { duration: 0.35 }, 9.2);

      // Phase 9 (9.55 -> 10.00): SMOOTH MONOLITHIC UNPIN INTO MOVEMENT 03
      if (cardDeckRef.current) {
        masterTl.to(
          cardDeckRef.current,
          { scale: 0.90, opacity: 0.20, yPercent: -12, duration: 0.45, ease: "power2.inOut" },
          9.55
        );
      }
    });

    return () => mm.revert();
  }, []);

  const pillars: FoundationPillar[] = [
    {
      num: "01",
      tag: "ACADEMIC CORE",
      title: "Netaji Subhash Engineering College",
      role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
      desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
      status: "CURRENT CANDIDATE",
      icon: GraduationCap,
      chips: ["NEURAL ARCHITECTURES", "COMPUTATIONAL ALGEBRA", "HIGH-THROUGHPUT"],
    },
    {
      num: "02",
      tag: "EUROPEAN OPS",
      title: "Latvian Cricket Federation",
      role: "National Sports Governing Body Digital Ecosystem",
      desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga & European circuits.",
      status: "PRODUCTION SYSTEM",
      icon: Trophy,
      chips: ["EU COMPLIANCE", "LIVE TELEMETRY", "RIGA CIRCUIT"],
    },
    {
      num: "03",
      tag: "< 5MS ENGINE",
      title: "278-Key In-Memory Localization Engine",
      role: "Zero-API Sub-Millisecond Bilingual Translation",
      desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
      status: "PROPRIETARY CORE",
      icon: Cpu,
      chips: ["ZERO-API", "SUB-MILLISECOND", "EU-CIS TRADE"],
    },
    {
      num: "04",
      tag: "DISTINCTION",
      title: "The Heritage School",
      role: "ISC Class XII (82.75%) · ICSE (89.4%)",
      desc: "Distinction in Computer Science & Mathematics. Rigorous foundations in pure algorithmic logic, object-oriented design, and discrete mathematics.",
      status: "ALUMNI DISTINCTION",
      icon: Award,
      chips: ["ALGORITHMIC LOGIC", "DISCRETE MATH", "OOP ARCHITECTURE"],
    },
  ];

  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref];

  return (
    <div id="monument-creed" className="relative w-full z-25 overflow-visible -mt-[100svh] md:mt-0">
      {/* ========================================================================= */}
      {/* MOBILE CINEMATIC STAGE (< 768px):                                          */}
      {/* Alternative 4: Mechanical Monocoque Shutter & 4-Sheet Titanium Stacking    */}
      {/* ========================================================================= */}
      <div
        ref={mobileSectionRef}
        className="md:hidden relative w-full h-[360vh] bg-[#060709] overflow-clip"
      >
        {/* Sticky 100svh Dedicated Monograph Viewport */}
        <div
          ref={mobileStageRef}
          className="sticky top-0 h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#060709] select-none flex flex-col justify-between pt-16 pb-8 px-6"
        >
          {/* Atmospheric Twilight Horizon Spotlight (Matches Movement 01) */}
          <div
            ref={mobileSpotlightRef}
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(255,140,56,0.15)_0%,transparent_75%)] will-change-[opacity]"
          />

          {/* Starlit Celestial Dust Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_1px,transparent_1px),radial-gradient(circle_at_75%_35%,rgba(255,140,56,0.12)_1.5px,transparent_1.5px)] bg-[length:80px_80px]" />

          {/* Precision Atelier Corner Crosshairs */}
          <span className="absolute top-4 left-5 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
          <span className="absolute top-4 right-5 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
          <span className="absolute bottom-4 left-5 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
          <span className="absolute bottom-4 right-5 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>

          {/* 1. TOP TELEMETRY HUD BAR */}
          <div
            ref={hudRef}
            className="relative z-20 w-full max-w-sm mx-auto flex flex-col gap-2.5 pt-1 will-change-[transform,opacity]"
          >
            {/* Header Telemetry Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] animate-pulse" />
                <span className="font-sans font-bold text-[9px] uppercase tracking-[0.22em] text-[#CBB59D]">
                  FOUNDATION ARCHITECTURE
                </span>
              </div>

              {/* Swiss Rolling Odometer Counter [ 01 / 04 ] */}
              <div className="font-mono text-xs tracking-wider flex items-center gap-1 text-white/50">
                <span>[</span>
                <div className="relative h-4 w-5 overflow-hidden inline-flex flex-col items-center">
                  <div
                    ref={mobileOdometerRef}
                    className="flex flex-col items-center font-bold text-[#FF8C38] will-change-transform leading-none"
                  >
                    <span className="h-4 flex items-center justify-center">01</span>
                    <span className="h-4 flex items-center justify-center">02</span>
                    <span className="h-4 flex items-center justify-center">03</span>
                    <span className="h-4 flex items-center justify-center">04</span>
                  </div>
                </div>
                <span>/ 04 ]</span>
              </div>
            </div>

            {/* 4-Segment Monograph Progress Rail */}
            <div className="flex items-center gap-1.5 w-full">
              <div ref={railSeg1Ref} className="h-[2px] flex-1 rounded-full bg-[#FF8C38] transition-colors" />
              <div ref={railSeg2Ref} className="h-[2px] flex-1 rounded-full bg-white/10 transition-colors" />
              <div ref={railSeg3Ref} className="h-[2px] flex-1 rounded-full bg-white/10 transition-colors" />
              <div ref={railSeg4Ref} className="h-[2px] flex-1 rounded-full bg-white/10 transition-colors" />
            </div>
          </div>

          {/* 2. THE 4 TITANIUM MONOGRAPH SHEETS STACKING STAGE */}
          <div
            ref={cardDeckRef}
            className="relative z-10 w-full max-w-sm mx-auto my-auto h-[400px] flex items-center justify-center will-change-[transform,opacity] [perspective:1000px]"
          >
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  ref={cardRefs[idx]}
                  className="absolute inset-0 rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-[#0A0D14] border border-white/15 shadow-[0_22px_55px_rgba(0,0,0,0.95),0_0_25px_rgba(255,140,56,0.06)] overflow-hidden will-change-[transform,opacity]"
                  style={{ zIndex: (idx + 1) * 10 }}
                >
                  {/* Solid Titanium Gradient Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#121622] via-[#0D1018] to-[#0A0D14] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,140,56,0.08)_0%,transparent_70%)] pointer-events-none" />

                  {/* Corner Accent Marks */}
                  <span className="absolute top-3 left-3 text-[9px] font-mono text-[#FF8C38]/40 select-none pointer-events-none">+</span>
                  <span className="absolute top-3 right-3 text-[9px] font-mono text-[#FF8C38]/40 select-none pointer-events-none">+</span>

                  {/* Card Top Meta */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-helvetica font-normal text-3xl sm:text-4xl text-white/30 leading-none">
                        {item.num}
                      </span>
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-[#FF8C38]" />
                        <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.16em] text-[#FF8C38]">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Institution / Project Title */}
                    <h4 className="font-sans font-bold text-lg text-white mb-1.5 leading-snug">
                      {item.title}
                    </h4>

                    {/* Role / Degree */}
                    <div className="text-xs font-mono text-[#FF8C38]/90 mb-3 leading-snug">
                      {item.role}
                    </div>

                    {/* Detailed Narrative */}
                    <p className="font-sans font-normal text-xs text-slate-300 leading-relaxed mb-4">
                      {item.desc}
                    </p>

                    {/* Spec Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.chips.map((chip, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Pill Footer */}
                  <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <span>VERIFICATION</span>
                    <span className="text-amber-200 font-semibold">{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. FOOTER TELEMETRY BAR */}
          <div className="relative z-20 w-full max-w-sm mx-auto flex items-center justify-between text-[9px] font-mono text-[#CBB59D]/70 uppercase tracking-widest pt-2.5 border-t border-white/5">
            <span>KOLKATA · LATVIA · GLOBAL EDGE</span>
            <span className="text-[#FF8C38] font-bold">VERIFIED PLINTH</span>
          </div>

          {/* 4. MECHANICAL MONOCOQUE SHUTTERS (Alternative 4: Reveal Stage) */}
          <div
            ref={creedShutterTopRef}
            className="absolute top-0 inset-x-0 h-1/2 bg-[#060709] z-40 will-change-transform border-b border-[#FF8C38]/50 shadow-[0_4px_25px_rgba(0,0,0,0.95)] flex flex-col justify-end pb-3 px-6 pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#1a1d24_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-[#FF8C38]/70 uppercase tracking-[0.2em]">
              <span>MONOCOQUE CHAMBER // UNSEALING</span>
              <span>SYS.AIRLOCK.02</span>
            </div>
          </div>

          <div
            ref={creedShutterBottomRef}
            className="absolute bottom-0 inset-x-0 h-1/2 bg-[#060709] z-40 will-change-transform border-t border-[#FF8C38]/50 shadow-[0_-4px_25px_rgba(0,0,0,0.95)] flex flex-col justify-start pt-3 px-6 pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#1a1d24_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-[#FF8C38]/70 uppercase tracking-[0.2em]">
              <span>CREDENTIALS UNLOCKED</span>
              <span>FOUNDATIONS ACTIVE</span>
            </div>
          </div>

          {/* Center Glowing Amber Laser Hairline at the Shutter Meeting Seam */}
          <div
            ref={creedShutterLaserRef}
            className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[2px] bg-[#FF8C38] z-50 pointer-events-none will-change-transform origin-center shadow-[0_0_20px_#FF8C38,0_0_45px_rgba(255,140,56,0.85)]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): HIGH-ART GALLERY PLINTH GRID                */}
      {/* 100% UNTOUCHED & PRISTINE                                                 */}
      {/* ========================================================================= */}
      <div
        ref={sectionRef}
        className="hidden md:block relative w-full h-[calc(100svh+500px)]"
      >
        <section
          ref={stageRef}
          className="sticky top-0 h-[100svh] w-full flex flex-col justify-center px-12 md:px-16 overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
        >
          {/* Leading Architectural Razor Hairline */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

          <div
            ref={containerRef}
            className="w-full max-w-7xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
          >
            {/* Header Block */}
            <div ref={headerRef} className="mb-8">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-slate-400 mb-3">
                <span>ACADEMIC & TECHNICAL FOUNDATIONS</span>
                <span className="text-[#FF7A00]">04 MONOLITHIC PILLARS</span>
              </div>
              <div className="w-full h-[1px] bg-white/10 mb-5" />
              <div className="flex items-end justify-between gap-2">
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight text-[#FFFDF9]">
                  ARCHITECTURAL CREDENTIALS & SPECIALIZATIONS
                </h3>
                <span className="text-xs font-mono text-slate-400">VERIFIED ENGINEERING TRACK</span>
              </div>
            </div>

            {/* 4 Plinth Cards Grid */}
            <div
              ref={gridRef}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-b border-white/10 py-6"
            >
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 25 } }}
                    className="creed-card group p-7 flex flex-col justify-between min-h-[250px] bg-[#0A0D14] border border-white/10 rounded-xl hover:border-white/25 transition-all"
                  >
                    <div>
                      {/* Top Meta Line */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-helvetica font-normal text-4xl text-white/30 leading-none group-hover:text-[#FF7A00] transition-colors">
                          {item.num}
                        </span>
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-[#FF7A00]" />
                          <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.16em] text-[#FF7A00]">
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      {/* Institution / Project Title */}
                      <h4 className="font-sans font-bold text-lg text-white mb-1.5 leading-snug group-hover:text-amber-100 transition-colors">
                        {item.title}
                      </h4>

                      {/* Role / Degree */}
                      <div className="text-xs font-mono text-white/60 mb-3 leading-snug">
                        {item.role}
                      </div>

                      {/* Detailed Narrative */}
                      <p className="font-sans font-normal text-[13px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Status Pill */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      <span>STATUS</span>
                      <span className="text-slate-300 font-semibold">{item.status}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-5">
              <span>DISCIPLINE: ARTIFICIAL INTELLIGENCE · HIGH-THROUGHPUT SYSTEMS</span>
              <span>KOLKATA · LATVIA · GLOBAL EDGE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

ArchitecturalCreed.displayName = "ArchitecturalCreed";
