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
}

export const ArchitecturalCreed: React.FC = memo(() => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
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

    // Mobile scroll experience: curtain sweep & smooth staggered cards
    mm.add("(max-width: 767px)", () => {
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
              end: "top 30%",
              scrub: 0.25,
            },
          }
        );
      }

      const cards = gridRef.current?.querySelectorAll(".creed-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
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
    },
    {
      num: "02",
      tag: "EUROPEAN OPS",
      title: "Latvian Cricket Federation",
      role: "National Sports Governing Body Digital Ecosystem",
      desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga & European circuits.",
      status: "PRODUCTION SYSTEM",
      icon: Trophy,
    },
    {
      num: "03",
      tag: "< 5MS ENGINE",
      title: "278-Key In-Memory Localization Engine",
      role: "Zero-API Sub-Millisecond Bilingual Translation",
      desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
      status: "PROPRIETARY CORE",
      icon: Cpu,
    },
    {
      num: "04",
      tag: "DISTINCTION",
      title: "The Heritage School",
      role: "ISC Class XII (82.75%) · ICSE (89.4%)",
      desc: "Distinction in Computer Science & Mathematics. Rigorous foundations in pure algorithmic logic, object-oriented design, and discrete mathematics.",
      status: "ALUMNI DISTINCTION",
      icon: Award,
    },
  ];

  return (
    <div
      id="monument-creed"
      ref={sectionRef}
      className="relative w-full z-25 min-h-[100svh] md:h-[calc(100svh+500px)]"
    >
      {/* Sticky 100svh Dedicated Architectural Stage on Desktop, Natural Fluid Stage on Mobile */}
      <section
        ref={stageRef}
        className="relative md:sticky md:top-0 min-h-[100svh] md:h-[100svh] w-full flex flex-col justify-center pt-20 sm:pt-28 pb-12 sm:pb-10 px-4 sm:px-12 md:px-16 overflow-visible md:overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

        <div
          ref={containerRef}
          className="w-full max-w-7xl mx-auto flex flex-col justify-center will-change-[transform,opacity]"
        >
          {/* Header Block */}
          <div ref={headerRef} className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-slate-400 mb-3">
              <span>ACADEMIC & TECHNICAL FOUNDATIONS</span>
              <span className="text-[#FF7A00]">04 MONOLITHIC PILLARS</span>
            </div>
            <div className="w-full h-[1px] bg-white/10 mb-5" />
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h3 className="font-sans font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-[#FFFDF9]">
                ARCHITECTURAL CREDENTIALS & SPECIALIZATIONS
              </h3>
              <span className="text-xs font-mono text-slate-400">VERIFIED ENGINEERING TRACK</span>
            </div>
          </div>

          {/* 4 Plinth Cards Grid - Fully readable with generous padding */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-b border-white/10 py-6"
          >
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 25 } }}
                  className="creed-card group p-6 sm:p-7 flex flex-col justify-between min-h-[220px] sm:min-h-[250px] bg-[#0A0D14] border border-white/10 rounded-xl hover:border-white/25 transition-all"
                >
                  <div>
                    {/* Top Meta Line */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-helvetica font-normal text-3xl sm:text-4xl text-white/30 leading-none group-hover:text-[#FF7A00] transition-colors">
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
                    <h4 className="font-sans font-bold text-base sm:text-lg text-white mb-1.5 leading-snug group-hover:text-amber-100 transition-colors">
                      {item.title}
                    </h4>

                    {/* Role / Degree */}
                    <div className="text-xs font-mono text-white/60 mb-3 leading-snug">
                      {item.role}
                    </div>

                    {/* Detailed Narrative */}
                    <p className="font-sans font-normal text-xs sm:text-[13px] text-slate-400 leading-relaxed">
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
            <span className="hidden sm:inline">KOLKATA · LATVIA · GLOBAL EDGE</span>
          </div>
        </div>
      </section>
    </div>
  );
});

ArchitecturalCreed.displayName = "ArchitecturalCreed";

