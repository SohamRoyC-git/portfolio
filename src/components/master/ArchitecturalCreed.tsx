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

// Concept 1 + 3 Continuity: Quantum Stardust Incoming Convergence Particles
const INCOMING_PARTICLES = [
  { left: "12%", top: "10%", width: 2, height: 35, color: "#FF8C38", opacity: 0.8 },
  { left: "25%", top: "5%", width: 1.5, height: 45, color: "#F5EEDA", opacity: 0.9 },
  { left: "42%", top: "15%", width: 2, height: 50, color: "#FFFDF8", opacity: 0.85 },
  { left: "58%", top: "8%", width: 1.5, height: 36, color: "#FF8C38", opacity: 0.8 },
  { left: "72%", top: "20%", width: 2, height: 46, color: "#F5EEDA", opacity: 0.9 },
  { left: "85%", top: "12%", width: 1.5, height: 32, color: "#EAD7C0", opacity: 0.75 },
  { left: "20%", top: "40%", width: 2, height: 48, color: "#FFFDF8", opacity: 0.8 },
  { left: "36%", top: "45%", width: 1.5, height: 38, color: "#FF8C38", opacity: 0.7 },
  { left: "50%", top: "35%", width: 2.5, height: 58, color: "#F5EEDA", opacity: 0.95 },
  { left: "66%", top: "50%", width: 1.5, height: 40, color: "#FFFDF8", opacity: 0.8 },
  { left: "80%", top: "42%", width: 2, height: 44, color: "#FF8C38", opacity: 0.75 },
  { left: "15%", top: "65%", width: 1.5, height: 30, color: "#EAD7C0", opacity: 0.65 },
  { left: "30%", top: "70%", width: 2, height: 40, color: "#F5EEDA", opacity: 0.85 },
  { left: "48%", top: "78%", width: 1.5, height: 35, color: "#FF8C38", opacity: 0.75 },
  { left: "65%", top: "68%", width: 2, height: 50, color: "#FFFDF8", opacity: 0.9 },
  { left: "82%", top: "75%", width: 1.5, height: 32, color: "#F5EEDA", opacity: 0.7 },
  { left: "18%", top: "25%", width: 3, height: 3, color: "#FFFDF8", opacity: 0.9 },
  { left: "54%", top: "28%", width: 4, height: 4, color: "#FF8C38", opacity: 0.95 },
  { left: "78%", top: "32%", width: 3, height: 3, color: "#F5EEDA", opacity: 0.85 },
  { left: "34%", top: "58%", width: 3, height: 3, color: "#FF8C38", opacity: 0.8 },
  { left: "70%", top: "82%", width: 4, height: 4, color: "#FFFDF8", opacity: 0.9 },
];

export const ArchitecturalCreed: React.FC = memo(() => {
  // Desktop Refs (Flowing Ribbon Editorial Stream)
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerLineRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const ribbonPathRef = useRef<SVGPathElement | null>(null);
  const ribbonGlowRef = useRef<SVGPathElement | null>(null);

  // Mobile Cinematic Monograph Deck Refs (< 768px)
  const mobileSectionRef = useRef<HTMLDivElement | null>(null);
  const mobileStageRef = useRef<HTMLDivElement | null>(null);

  // Concept 1 + 3 Continuity: Quantum Stardust & Holographic Plinth Refs
  const incomingParticlesRef = useRef<HTMLDivElement | null>(null);
  const creedHoloGridRef = useRef<HTMLDivElement | null>(null);
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
    // DESKTOP & TABLET EXPERIENCE (>= 768px):
    // Direction 1: Flowing Ribbon Editorial Stream (Inspired by two26.studio)
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      if (!sectionRef.current) return;

      // 1. Continuous Sweeping Trim-Path SVG Ribbon scrubbed to scroll
      [ribbonPathRef.current, ribbonGlowRef.current].forEach((pathEl) => {
        if (!pathEl) return;
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 75%",
            scrub: 0.45,
          },
        });
      });

      // 2. Editorial Header & Trim-Path Hairline Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (headerLineRef.current) {
        gsap.fromTo(
          headerLineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Alternating Editorial Pillars + Springy Tilted Floating Pills
      const items = gridRef.current?.querySelectorAll(".creed-stream-item");
      items?.forEach((item, idx) => {
        const isEven = idx % 2 === 0;
        const content = item.querySelector(".creed-stream-content");
        const pills = item.querySelectorAll(".creed-pill");
        const nodeDot = item.querySelector(".creed-node-dot");

        if (content) {
          gsap.fromTo(
            content,
            { y: 48, x: isEven ? -24 : 24, opacity: 0 },
            {
              y: 0,
              x: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 82%",
                once: true,
              },
            }
          );
        }

        if (pills && pills.length > 0) {
          gsap.fromTo(
            pills,
            { scale: 0.78, y: 18, opacity: 0 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              stagger: 0.07,
              duration: 0.65,
              delay: 0.15,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: item,
                start: "top 82%",
                once: true,
              },
            }
          );
        }

        if (nodeDot) {
          gsap.fromTo(
            nodeDot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                once: true,
              },
            }
          );
        }
      });
    });

    // =========================================================================
    // MOBILE CINEMATIC EXPERIENCE (< 768px):
    // Alternative 4: Mechanical Monocoque Shutter Reveal & 4-Sheet Titanium Deck
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileSectionRef.current) return;

      // Initial States:
      // Incoming Quantum Stream & Holographic Plinth (Continuity from MonumentalHero)
      if (incomingParticlesRef.current) gsap.set(incomingParticlesRef.current, { opacity: 1, y: -40, scale: 1.15 });
      if (creedHoloGridRef.current) gsap.set(creedHoloGridRef.current, { opacity: 0.35, scaleY: 0.8 });

      // HUD and Stage Interior
      if (hudRef.current) gsap.set(hudRef.current, { opacity: 0, y: -14 });
      if (mobileSpotlightRef.current) gsap.set(mobileSpotlightRef.current, { opacity: 0.7 });
      if (mobileOdometerRef.current) gsap.set(mobileOdometerRef.current, { yPercent: 0 });

      // Cards initial positions: Sheet 01 glides up as stardust converges, Sheets 02-04 stacked below
      if (card1Ref.current) gsap.set(card1Ref.current, { yPercent: 36, scale: 0.95, opacity: 0 });
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

      // Phase 1 (0.00 -> 1.50): STARDUST CONVERGENCE & SHEET 01 PLINTH DOCK
      // Streaming quantum particles decelerate and dock into Card 01 perimeter
      if (incomingParticlesRef.current) {
        masterTl.to(
          incomingParticlesRef.current,
          { opacity: 0, y: 70, scale: 0.85, duration: 1.25, ease: "power2.out" },
          0
        );
      }
      if (creedHoloGridRef.current) {
        masterTl.to(
          creedHoloGridRef.current,
          { opacity: 0.15, scaleY: 1.0, duration: 1.4, ease: "power1.out" },
          0
        );
      }
      // Sheet 01 glides smoothly up from the event horizon into docked focus
      if (card1Ref.current) {
        masterTl.to(
          card1Ref.current,
          { yPercent: 0, scale: 1.0, opacity: 1, duration: 1.45, ease: "power2.out" },
          0.05
        );
      }
      // Top Telemetry HUD illuminates cleanly
      if (hudRef.current) {
        masterTl.to(hudRef.current, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }, 0.25);
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
    <div id="monument-creed" className="hidden md:block relative w-full z-25 overflow-visible">
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

          {/* Concept 1 + 3 Continuity: Incoming Quantum Stardust Stream */}
          <div
            ref={incomingParticlesRef}
            className="absolute inset-0 pointer-events-none will-change-[transform,opacity] overflow-hidden"
          >
            {INCOMING_PARTICLES.map((p, idx) => (
              <div
                key={idx}
                className="absolute rounded-full"
                style={{
                  left: p.left,
                  top: p.top,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  opacity: p.opacity,
                  background:
                    p.height > 6
                      ? `linear-gradient(to bottom, transparent, ${p.color}, #FFFDF8)`
                      : p.color,
                  boxShadow: `0 0 8px ${p.color}`,
                }}
              />
            ))}
          </div>

          {/* Architectural Perspective Holographic Grid Floor */}
          <div
            ref={creedHoloGridRef}
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none will-change-[transform,opacity] opacity-20"
            style={{
              perspective: "500px",
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                transform: "rotateX(72deg)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 140, 56, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 140, 56, 0.12) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
              }}
            />
          </div>

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


        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): FLOWING RIBBON EDITORIAL STREAM             */}
      {/* Inspired by two26.studio: Sweeping trim-path ribbon, tilted pills,        */}
      {/* spacious alternating editorial choreography, and zero stiff boxes.        */}
      {/* ========================================================================= */}
      <div
        ref={sectionRef}
        className="hidden md:block relative w-full bg-[#060709] border-t border-white/10 overflow-hidden"
      >
        {/* Subtle Ambient Warm Backlight */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_40%_at_50%_15%,rgba(255,140,56,0.06)_0%,transparent_70%),radial-gradient(ellipse_65%_40%_at_50%_75%,rgba(234,215,192,0.04)_0%,transparent_70%)]" />

        <section
          ref={stageRef}
          className="relative w-full py-28 lg:py-36 px-12 md:px-16 lg:px-24"
        >
          <div
            ref={containerRef}
            className="relative w-full max-w-6xl mx-auto"
          >
            {/* Header Block */}
            <div ref={headerRef} className="mb-20 lg:mb-28">
              <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.26em] text-[#CBB59D]/70 mb-4">
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] animate-pulse" />
                  ACADEMIC &amp; TECHNICAL FOUNDATIONS
                </span>
                <span className="text-[#FF8C38]">04 MONOLITHIC PILLARS</span>
              </div>
              <div
                ref={headerLineRef}
                className="w-full h-[1px] bg-gradient-to-r from-[#FF8C38]/60 via-[#EAD7C0]/25 to-transparent mb-7"
              />
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <h3 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-[#FFFDF9] leading-[1.05]">
                  Architectural <span className="text-[#FF8C38]">Credentials</span>
                  <br />
                  &amp; Specializations
                </h3>
                <span className="text-xs font-mono text-[#EAD7C0]/50 uppercase tracking-widest">
                  VERIFIED ENGINEERING TRACK · 2026
                </span>
              </div>
            </div>

            {/* Alternating Editorial Stream + Continuous Sweeping SVG Ribbon */}
            <div ref={gridRef} className="relative">
              {/* Sweeping Center SVG Ribbon (Draws continuously as user scrolls) */}
              <svg
                className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-[420px] pointer-events-none z-0 overflow-visible"
                viewBox="0 0 420 1200"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <linearGradient id="creedRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF8C38" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#EAD7C0" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#FF8C38" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                {/* Soft Ambient Glow Trail */}
                <path
                  ref={ribbonGlowRef}
                  d="M 210 10 C 360 140, 360 280, 210 380 C 60 480, 60 620, 210 730 C 360 840, 360 980, 210 1180"
                  stroke="#FF8C38"
                  strokeOpacity="0.18"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Crisp Main Flowing Ribbon */}
                <path
                  ref={ribbonPathRef}
                  d="M 210 10 C 360 140, 360 280, 210 380 C 60 480, 60 620, 210 730 C 360 840, 360 980, 210 1180"
                  stroke="url(#creedRibbonGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>

              {/* 4 Alternating Editorial Pillars */}
              <div className="relative z-10 flex flex-col gap-24 lg:gap-32">
                {pillars.map((item, idx) => {
                  const Icon = item.icon;
                  const isLeft = idx % 2 === 0;
                  const pillAngles = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

                  return (
                    <div
                      key={idx}
                      className={`creed-stream-item relative flex flex-col lg:flex-row items-start lg:items-center ${
                        isLeft ? "lg:justify-start" : "lg:justify-end"
                      }`}
                    >
                      {/* Glowing Orbital Node on Center Ribbon */}
                      <div className="creed-node-dot hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#060709] border-2 border-[#FF8C38] items-center justify-center shadow-[0_0_16px_rgba(255,140,56,0.65)] z-20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFDF8]" />
                      </div>

                      {/* Borderless Editorial Pillar Content */}
                      <div
                        className={`creed-stream-content group w-full lg:w-[44%] ${
                          isLeft ? "lg:pr-8 text-left" : "lg:pl-8 text-left"
                        }`}
                      >
                        {/* Top Tag + Oversized Hollow-to-Illuminated Numeral */}
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                          <span
                            className="font-helvetica font-normal text-6xl lg:text-7xl leading-none text-transparent transition-all duration-500 select-none group-hover:text-[#FF8C38]"
                            style={{
                              WebkitTextStroke: "1.2px rgba(234, 215, 192, 0.38)",
                            }}
                          >
                            {item.num}
                          </span>

                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                            <Icon size={13} className="text-[#FF8C38]" />
                            <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.18em] text-[#FF8C38]">
                              {item.tag}
                            </span>
                          </div>
                        </div>

                        {/* Title & Role */}
                        <h4 className="font-sans font-bold text-2xl lg:text-3xl text-[#FFFDF9] mb-2 leading-tight group-hover:text-[#EAD7C0] transition-colors">
                          {item.title}
                        </h4>
                        <div className="text-xs lg:text-[13px] font-mono text-[#FF8C38]/90 mb-4 tracking-wide">
                          {item.role}
                        </div>

                        {/* Narrative */}
                        <p className="font-sans font-normal text-sm lg:text-[15px] text-slate-300/85 leading-relaxed mb-6">
                          {item.desc}
                        </p>

                        {/* Two26-Inspired Tilted Floating Pills + Status */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          {item.chips.map((chip, cIdx) => (
                            <motion.span
                              key={cIdx}
                              whileHover={{ scale: 1.07, rotate: 0 }}
                              className={`creed-pill inline-block px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#11151E] border border-[#EAD7C0]/20 text-[#EAD7C0] shadow-[0_8px_20px_rgba(0,0,0,0.45)] cursor-default transition-colors hover:border-[#FF8C38] hover:text-[#FF8C38] ${
                                pillAngles[(idx + cIdx) % pillAngles.length]
                              }`}
                            >
                              {chip}
                            </motion.span>
                          ))}
                          <motion.span
                            whileHover={{ scale: 1.07, rotate: 0 }}
                            className="creed-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF8C38]/15 border border-[#FF8C38]/40 text-[#FF8C38] rotate-1 cursor-default"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38]" />
                            {item.status}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#CBB59D]/55 mt-24 pt-6 border-t border-white/10">
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
