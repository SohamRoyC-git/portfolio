"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  ExternalLink,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import { LocalizationDemo } from "@/components/LocalizationDemo";

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  id: string;
  num: string;
  catalogueNo: string;
  category: string;
  title: string;
  client: string;
  year: string;
  url: string;
  summary: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  logo: string;
  displayDomain: string;
  hasDemo?: boolean;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "izieat-export",
    num: "01",
    catalogueNo: "COMMISSION 01 // B2B-EXPORT",
    category: "GLOBAL TRADE INFRASTRUCTURE",
    title: "IZIEAT Export Portal",
    client: "IZIEAT LLC",
    year: "2024",
    url: "https://www.izieat.com",
    summary:
      "Global wholesale export portal engineered with an in-memory 278-key instant English-Russian dictionary (<5ms latency), eliminating external translation API roundtrips and powering international buyer operations across the EU and CIS regions.",
    metrics: [
      { label: "TRANSLATION KEYS", value: "278 Keys" },
      { label: "SWITCH LATENCY", value: "< 5ms" },
      { label: "TRADING REGION", value: "EU & CIS" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "i18n Engine", "Client Cache"],
    logo: "/assets/logos/izieat.png",
    displayDomain: "IZIEAT.COM",
    hasDemo: true,
  },
  {
    id: "latvia-cricket",
    num: "02",
    catalogueNo: "COMMISSION 02 // SPORTS-GOVERNANCE",
    category: "NATIONAL DIGITAL INFRASTRUCTURE",
    title: "Latvian Cricket Federation",
    client: "Latvijas Kriketa Federācija",
    year: "2024",
    url: "https://criclv.com",
    summary:
      "Modernized national governing infrastructure and digital communication channels for the Latvian Cricket Federation, orchestrating automated tournament reporting, live match telemetry, and EU regulatory compliance.",
    metrics: [
      { label: "SYSTEM UPTIME", value: "99.98%" },
      { label: "EVENT INGESTION", value: "100k+/mo" },
      { label: "DATA LOSS RATE", value: "0.00%" },
    ],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Cloudflare Workers"],
    logo: "/assets/logos/latvia_cricket.png",
    displayDomain: "CRICLV.COM",
  },
  {
    id: "india-center",
    num: "03",
    catalogueNo: "COMMISSION 03 // DIPLOMATIC-PORTAL",
    category: "BILATERAL CULTURAL & TRADE PLATFORM",
    title: "India Center (Indijas Centrs)",
    client: "Indijas Centrs • Latvia",
    year: "2024-2025",
    url: "https://indijascentrs.lv",
    summary:
      "Official Indo-Baltic cultural, academic, and economic bilateral platform connecting India and Latvia. Engineered with multi-tier access, consular event scheduling, and high-performance international content delivery.",
    metrics: [
      { label: "EDGE LATENCY", value: "< 18ms" },
      { label: "LANGUAGES", value: "Bilingual LV/EN" },
      { label: "AVAILABILITY", value: "100% Edge" },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Edge CDN", "TypeScript"],
    logo: "/assets/logos/india_center.png",
    displayDomain: "INDIJASCENTRS.LV",
  },
  {
    id: "varti-international",
    num: "04",
    catalogueNo: "COMMISSION 04 // GLOBAL-SUPPLY-CHAIN",
    category: "CROSS-BORDER COMMODITY & EXPORT",
    title: "Varti International",
    client: "Varti International Corp",
    year: "2024-2025",
    url: "https://www.vartiinternational.com/",
    summary:
      "Enterprise international commodity trading and cross-border supply chain platform. Features automated multi-currency pricing models, logistics freight tracking, and secure institutional buyer verification.",
    metrics: [
      { label: "COMMODITY SCOPE", value: "Global Agro" },
      { label: "CURRENCIES", value: "Multi-Currency" },
      { label: "SECURITY TIER", value: "Institutional" },
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Cloud Architecture"],
    logo: "/assets/logos/varti_international.png",
    displayDomain: "VARTIINTERNATIONAL.COM",
  },
];

export const GrandSpatialDiscs: React.FC = memo(() => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<ProjectItem | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const logoContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const editorialBlocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP & TABLET EXPERIENCE (>= 768px):
    // Forge Automotive Style Split Showcase:
    // Left: Framed Logo with Inside-Out Zoom Unmasking
    // Right: Downward Flowing Editorial Narrative
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      // 1. Entrance: Horizontal Architectural Blade Sweep
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
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

      // 2. Master Scrub Timeline for Project Transitions
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${p})`;
            }
            const idx = Math.min(PROJECTS.length - 1, Math.floor(p * PROJECTS.length));
            setActiveIdx(idx);
            if (counterRef.current) {
              counterRef.current.textContent = PROJECTS[idx].num;
            }
          },
        },
      });

      // Initialize initial states
      logoContainersRef.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          gsap.set(el, { scale: 1, autoAlpha: 1, zIndex: 10 });
        } else {
          gsap.set(el, { scale: 0.15, autoAlpha: 0, zIndex: 10 + i });
        }
      });

      editorialBlocksRef.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          gsap.set(el, { yPercent: 0, autoAlpha: 1, pointerEvents: "auto" });
        } else {
          gsap.set(el, { yPercent: -50, autoAlpha: 0, pointerEvents: "none" });
        }
      });

      // Build transition sequence between consecutive projects:
      // Project 0 -> Project 1 -> Project 2 -> Project 3
      const numSteps = PROJECTS.length - 1;
      const stepDuration = 1 / numSteps;

      for (let i = 0; i < numSteps; i++) {
        const startTime = i * stepDuration;
        const curLogo = logoContainersRef.current[i];
        const nextLogo = logoContainersRef.current[i + 1];
        const curEditorial = editorialBlocksRef.current[i];
        const nextEditorial = editorialBlocksRef.current[i + 1];

        // --- Left Framed Visual: Inside-Out Zoom Reveal ---
        if (curLogo && nextLogo) {
          // Current logo expands out and fades away cleanly and rapidly
          masterTl.to(
            curLogo,
            {
              scale: 1.35,
              autoAlpha: 0,
              ease: "power2.out",
              duration: stepDuration * 0.45,
            },
            startTime
          );

          // Next logo blooms outward from within center (0.15 -> 1.0)
          masterTl.fromTo(
            nextLogo,
            { scale: 0.15, autoAlpha: 0 },
            {
              scale: 1.0,
              autoAlpha: 1,
              ease: "power2.out",
              duration: stepDuration * 0.65,
            },
            startTime + stepDuration * 0.15
          );
        }

        // --- Right Editorial Narrative: Downward Flowing Motion ---
        if (curEditorial && nextEditorial) {
          // Current editorial block slides downward and fades out
          masterTl.to(
            curEditorial,
            {
              yPercent: 40,
              autoAlpha: 0,
              pointerEvents: "none",
              ease: "power2.inOut",
              duration: stepDuration * 0.65,
            },
            startTime
          );

          // Next editorial block slides in downwards from top into center position
          masterTl.fromTo(
            nextEditorial,
            { yPercent: -40, autoAlpha: 0, pointerEvents: "none" },
            {
              yPercent: 0,
              autoAlpha: 1,
              pointerEvents: "auto",
              ease: "power2.out",
              duration: stepDuration * 0.7,
            },
            startTime + stepDuration * 0.25
          );
        }
      }

      // 3. Exit Dismissal: Smooth shrink as next section wipes up
      const containerEl = stageRef.current?.querySelector(".showcase-container");
      if (containerEl) {
        gsap.to(containerEl, {
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

    // Mobile fallback (clean scrollable list)
    mm.add("(max-width: 767px)", () => {
      // Mobile displays as a clean vertical feed
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      id="monument-exhibition"
      ref={sectionRef}
      className="relative w-full z-30"
      style={{ height: "calc(100svh + 2400px)" }}
    >
      {/* Sticky 100svh Architectural Stage */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

        {/* Top Section Header & Telemetry */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-slate-400 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
            <span className="text-white">SELECTED COMMISSIONS // ARCHITECTURAL SHOWCASE</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5">
              {PROJECTS.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    dotIdx === activeIdx ? "bg-[#FF7A00]" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400">DEPTH:</span>
            <span className="text-[#FF7A00] font-bold">
              <span ref={counterRef}>01</span> / 04
            </span>
          </div>
        </div>

        {/* Main Split Screen Container */}
        <div className="showcase-container w-full max-w-7xl mx-auto flex-1 flex items-center my-auto will-change-[transform,opacity]">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Framed Logo Portal with Inside-Out Zoom Reveal        */}
            {/* ================================================================= */}
            <div className="md:col-span-6 lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] aspect-square rounded-2xl bg-[#090B10] border border-white/15 p-10 sm:p-14 flex items-center justify-center overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
                
                {/* Architectural Corner Reticle Accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/40 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/40 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/40 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/40 pointer-events-none" />
                
                {/* Viewfinder Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <div className="w-12 h-[1px] bg-white" />
                  <div className="h-12 w-[1px] bg-white absolute" />
                </div>

                {/* 4 Inside-Out Layered Logo Containers */}
                {PROJECTS.map((proj, idx) => (
                  <div
                    key={proj.id}
                    ref={(el) => {
                      logoContainersRef.current[idx] = el;
                    }}
                    className="absolute inset-0 flex items-center justify-center p-12 sm:p-16 bg-[#090B10] will-change-[transform,opacity]"
                  >
                    <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
                      <Image
                        src={proj.logo}
                        alt={`${proj.title} Monogram Logo`}
                        fill
                        className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] select-none p-3"
                        sizes="(max-width: 768px) 280px, 420px"
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: Editorial Narrative (Downward Flow on Scroll)       */}
            {/* ================================================================= */}
            <div className="md:col-span-6 lg:col-span-7 relative min-h-[360px] sm:min-h-[420px] flex items-center">
              {PROJECTS.map((proj, idx) => (
                <div
                  key={proj.id}
                  ref={(el) => {
                    editorialBlocksRef.current[idx] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center will-change-[transform,opacity]"
                >
                  {/* Project Index & Category */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif italic text-3xl sm:text-4xl text-[#FF7A00] font-normal leading-none">
                      {proj.num}
                    </span>
                    <span className="text-white/20 font-sans text-xl">/</span>
                    <span className="text-white/40 font-mono text-sm">04</span>
                    <span className="w-[1px] h-4 bg-white/15 mx-1" />
                    <span className="text-[10px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#FF7A00]">
                      {proj.category}
                    </span>
                  </div>

                  {/* Monumental Editorial Heading */}
                  <h3 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-4 leading-[1.05]">
                    {proj.title}
                  </h3>

                  {/* Narrative Subtext */}
                  <p className="font-sans font-normal text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-6">
                    {proj.summary}
                  </p>

                  {/* Micro-Spec Hairline Metrics */}
                  <div className="grid grid-cols-3 gap-3 border-t border-b border-white/10 py-3.5 mb-6 max-w-xl">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-[9px] font-mono uppercase text-slate-500 tracking-wider mb-0.5">
                          {m.label}
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link Stack */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FF7A00] hover:text-white transition-all shadow-md group"
                    >
                      <span>EXPLORE LIVE PLATFORM</span>
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {proj.hasDemo && (
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#11141C] border border-white/20 text-white font-sans font-bold text-xs uppercase tracking-wider hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
                      >
                        <Activity size={13} className="text-[#FF7A00]" />
                        <span>TEST &lt;5MS TRANSLATION</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedDossier(proj);
                        setIsDossierOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-3 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      <Layers size={13} />
                      <span>VIEW DOSSIER</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Progress Bar & Scrub Indicator */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>SCROLL TO ADVANCE COMMISSIONS</span>
            <ArrowRight size={11} className="text-slate-400" />
          </div>

          <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#FF7A00] w-full transform origin-left scale-x-0 transition-transform duration-75"
            />
          </div>

          <span className="text-slate-400">01 — 04 PORTFOLIO CORE</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL 1: In-Memory 278-Key Localization Engine Sandbox        */}
      {/* ========================================================================= */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#090C12] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-orange-500/10 text-[#FF7A00] border border-orange-500/20">
                  <Terminal size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    IZIEAT 278-KEY LOCALIZATION ENGINE
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Client-side in-memory dictionary test • Latency: &lt; 2.8ms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-400 hover:text-white hover:border-white/30"
              >
                ESC [CLOSE]
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <LocalizationDemo />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL 2: Architectural Deep-Dive Dossier                       */}
      {/* ========================================================================= */}
      {isDossierOpen && selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090C12] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#FF7A00] tracking-wider uppercase">
                  {selectedDossier.catalogueNo}
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide mt-1">
                  {selectedDossier.title} — ARCHITECTURAL DOSSIER
                </h3>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-400 hover:text-white hover:border-white/30"
              >
                ESC [CLOSE]
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-300">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white font-bold block mb-1">CLIENT & ENGAGEMENT:</span>
                <span>{selectedDossier.client} ({selectedDossier.year})</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white font-bold block mb-1">ENGINEERING NARRATIVE:</span>
                <p className="leading-relaxed text-slate-400">{selectedDossier.summary}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white font-bold block mb-1">TECHNOLOGY STACK:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDossier.stack.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <a
                href={selectedDossier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF7A00] text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors"
              >
                <span>OPEN OFFICIAL DOMAIN</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GrandSpatialDiscs.displayName = "GrandSpatialDiscs";
