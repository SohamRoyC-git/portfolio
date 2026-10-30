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
    // UNIFIED SHOWCASE ENGINE (Desktop + Mobile):
    // Forge Automotive Geometric Inset Reveal: Solid Opacity (Zero Fade In / Fade Away)
    // Left: Framed Logo Portal blooming inside-out via clipPath inset
    // Right: Downward Flowing Editorial Narrative
    // =========================================================================
    const setupShowcase = (isDesktop: boolean) => {
      // 1. Entrance: Horizontal Blade Sweep on desktop, or smooth iris expansion on mobile
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { clipPath: isDesktop ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "inset(25% 0% round 0px)" },
          {
            clipPath: isDesktop ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "inset(0% 0% round 0px)",
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
          scrub: isDesktop ? 0.4 : 0.25,
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

      // Initialize initial states for Solid Geometric Inset Reveal (Forge Automotive mechanism)
      logoContainersRef.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          gsap.set(el, {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            autoAlpha: 1,
            zIndex: 10,
          });
        } else {
          gsap.set(el, {
            clipPath: "inset(50% 50% 50% 50% round 16px)",
            autoAlpha: 0,
            zIndex: 10 + i,
          });
        }
      });

      editorialBlocksRef.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          gsap.set(el, { yPercent: 0, autoAlpha: 1, pointerEvents: "auto" });
        } else {
          gsap.set(el, { yPercent: -40, autoAlpha: 0, pointerEvents: "none" });
        }
      });

      // Build transition sequence between consecutive projects:
      // Project 0 -> Project 1 -> Project 2 -> Project 3
      const numSteps = PROJECTS.length - 1;
      const stepDuration = 1 / numSteps;

      for (let i = 0; i < numSteps; i++) {
        const startTime = i * stepDuration;
        const nextLogo = logoContainersRef.current[i + 1];
        const curEditorial = editorialBlocksRef.current[i];
        const nextEditorial = editorialBlocksRef.current[i + 1];

        // --- Left Framed Visual: Pure Solid Geometric Inset Aperture Bloom (No Fade In / Fade Away) ---
        if (nextLogo) {
          // At startTime, make nextLogo active so it unmasks on top of current logo
          masterTl.set(nextLogo, { autoAlpha: 1 }, startTime);

          // nextLogo physically expands from center outward: inset(50% ... round 16px) -> inset(0% ... round 0px)
          // Solid opacity throughout! Zero ghosting, zero fade in/fade out!
          masterTl.fromTo(
            nextLogo,
            { clipPath: "inset(50% 50% 50% 50% round 16px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "power2.inOut",
              duration: stepDuration,
            },
            startTime
          );

          // Subtle optical zoom on the inner logo image as the portal expands
          const nextImg = nextLogo.querySelector("img");
          if (nextImg) {
            masterTl.fromTo(
              nextImg,
              { scale: 0.82 },
              { scale: 1.0, ease: "power2.out", duration: stepDuration },
              startTime
            );
          }
        }

        // --- Right Editorial Narrative: Downward Flowing Motion ---
        if (curEditorial && nextEditorial) {
          // Current editorial block slides downward and fades out
          masterTl.to(
            curEditorial,
            {
              yPercent: 35,
              autoAlpha: 0,
              pointerEvents: "none",
              ease: "power2.inOut",
              duration: stepDuration * 0.6,
            },
            startTime
          );

          // Next editorial block slides in downwards from top into center position
          masterTl.fromTo(
            nextEditorial,
            { yPercent: -35, autoAlpha: 0, pointerEvents: "none" },
            {
              yPercent: 0,
              autoAlpha: 1,
              pointerEvents: "auto",
              ease: "power2.out",
              duration: stepDuration * 0.65,
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
          yPercent: -12,
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
    };

    mm.add("(min-width: 768px)", () => setupShowcase(true));
    mm.add("(max-width: 767px)", () => setupShowcase(false));

    return () => mm.revert();
  }, []);

  return (
    <div
      id="monument-exhibition"
      ref={sectionRef}
      className="relative w-full z-30"
      style={{ height: "calc(100svh + 2400px)" }}
    >
      {/* Sticky 100svh Architectural Stage (Deep Velvet Burgundy & Italian Light Sand) */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden bg-[#1D090E] border-t border-[#F7EFE8]/15 will-change-[clip-path]"
      >
        {/* Leading Architectural Razor Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[#F7EFE8]/25" />

        {/* Top Section Header & Telemetry */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#E6DCD2]/70 pb-3 border-b border-[#F7EFE8]/15">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF8C38]" />
            <span className="text-[#F7EFE8]">SELECTED COMMISSIONS // ARCHITECTURAL SHOWCASE</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5">
              {PROJECTS.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    dotIdx === activeIdx ? "bg-[#FF8C38]" : "bg-[#F7EFE8]/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-[#E6DCD2]/60">DEPTH:</span>
            <span className="text-[#FF8C38] font-bold">
              <span ref={counterRef}>01</span> / 04
            </span>
          </div>
        </div>

        {/* Main Split Screen Container */}
        <div className="showcase-container w-full max-w-7xl mx-auto flex-1 flex items-center my-auto will-change-[transform,opacity]">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-center">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Large Commanding Logo Portal (Inside-Out Aperture Bloom) */}
            {/* ================================================================= */}
            <div className="md:col-span-6 lg:col-span-6 flex justify-center items-center">
              <div className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] aspect-square rounded-3xl bg-[#14080B] border border-[#F7EFE8]/15 p-4 sm:p-8 md:p-10 flex items-center justify-center overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
                
                {/* Architectural Corner Reticle Accents */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-[#F7EFE8]/40 pointer-events-none" />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-[#F7EFE8]/40 pointer-events-none" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-[#F7EFE8]/40 pointer-events-none" />
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-[#F7EFE8]/40 pointer-events-none" />
                
                {/* Viewfinder Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <div className="w-10 sm:w-14 h-[1px] bg-[#F7EFE8]" />
                  <div className="h-10 sm:h-14 w-[1px] bg-[#F7EFE8] absolute" />
                </div>

                {/* 4 Inside-Out Layered Logo Containers (Pure Solid Inset Bloom, Zero Fade) */}
                {PROJECTS.map((proj, idx) => (
                  <div
                    key={proj.id}
                    ref={(el) => {
                      logoContainersRef.current[idx] = el;
                    }}
                    className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#14080B] will-change-[clip-path,transform]"
                  >
                    <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
                      <Image
                        src={proj.logo}
                        alt={`${proj.title} Monogram Logo`}
                        fill
                        className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] select-none p-1 sm:p-2"
                        sizes="(max-width: 768px) 340px, 560px"
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
            <div className="md:col-span-6 lg:col-span-6 relative min-h-[300px] xs:min-h-[340px] sm:min-h-[380px] md:min-h-[440px] flex items-center">
              {PROJECTS.map((proj, idx) => (
                <div
                  key={proj.id}
                  ref={(el) => {
                    editorialBlocksRef.current[idx] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center will-change-[transform,opacity]"
                >
                  {/* Project Index & Category */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="font-serif italic text-2xl sm:text-4xl text-[#FF8C38] font-normal leading-none">
                      {proj.num}
                    </span>
                    <span className="text-[#F7EFE8]/25 font-sans text-base sm:text-xl">/</span>
                    <span className="text-[#F7EFE8]/40 font-mono text-xs sm:text-sm">04</span>
                    <span className="w-[1px] h-3 sm:h-4 bg-[#F7EFE8]/15 mx-1" />
                    <span className="text-[9px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#FF8C38]">
                      {proj.category}
                    </span>
                  </div>

                  {/* Monumental Editorial Heading */}
                  <h3 className="font-sans font-black text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-[#F7EFE8] mb-2 sm:mb-4 leading-[1.05]">
                    {proj.title}
                  </h3>

                  {/* Narrative Subtext */}
                  <p className="font-sans font-normal text-xs sm:text-sm md:text-base text-[#DDD3C7] leading-relaxed max-w-2xl mb-3 sm:mb-6 line-clamp-2 xs:line-clamp-3 sm:line-clamp-none">
                    {proj.summary}
                  </p>

                  {/* Micro-Spec Hairline Metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-b border-[#F7EFE8]/15 py-2.5 sm:py-3.5 mb-3 sm:mb-6 max-w-xl">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-[8px] sm:text-[9px] font-mono uppercase text-[#E6DCD2]/60 tracking-wider mb-0.5">
                          {m.label}
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-bold text-[#F7EFE8] tracking-tight truncate">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link Stack */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-[#F7EFE8] text-[#1D090E] font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-[#FF8C38] hover:text-white transition-all shadow-md group cursor-pointer"
                    >
                      <span>EXPLORE LIVE PLATFORM</span>
                      <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {proj.hasDemo && (
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-3 rounded-full bg-[#14080B] border border-[#F7EFE8]/25 text-[#F7EFE8] font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:border-[#FF8C38] hover:text-[#FF8C38] transition-colors cursor-pointer"
                      >
                        <Activity size={12} className="text-[#FF8C38]" />
                        <span>TEST &lt;5MS</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedDossier(proj);
                        setIsDossierOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[#DDD3C7] hover:text-[#F7EFE8] font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Layers size={12} />
                      <span>DOSSIER</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Progress Bar & Scrub Indicator */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-4 border-t border-[#F7EFE8]/15 text-[10px] font-mono text-[#E6DCD2]/70">
          <div className="flex items-center gap-2">
            <span>SCROLL TO ADVANCE COMMISSIONS</span>
            <ArrowRight size={11} className="text-[#FF8C38]" />
          </div>

          <div className="w-48 sm:w-64 h-[2px] bg-[#F7EFE8]/15 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#FF8C38] w-full transform origin-left scale-x-0 transition-transform duration-75"
            />
          </div>

          <span className="text-[#E6DCD2]/70">01 — 04 PORTFOLIO CORE</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODAL 1: In-Memory 278-Key Localization Engine Sandbox        */}
      {/* ========================================================================= */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#14080B] border border-[#F7EFE8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F7EFE8]/15">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#FF8C38]/15 text-[#FF8C38] border border-[#FF8C38]/30">
                  <Terminal size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#F7EFE8] tracking-wide">
                    IZIEAT 278-KEY LOCALIZATION ENGINE
                  </h3>
                  <p className="text-xs text-[#E6DCD2]/70 font-mono">
                    Client-side in-memory dictionary test • Latency: &lt; 2.8ms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#F7EFE8]/15 text-xs font-mono text-[#DDD3C7] hover:text-[#F7EFE8] hover:border-[#F7EFE8]/40"
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
          <div className="relative w-full max-w-2xl bg-[#14080B] border border-[#F7EFE8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F7EFE8]/15">
              <div>
                <span className="text-[10px] font-mono text-[#FF8C38] tracking-wider uppercase">
                  {selectedDossier.catalogueNo}
                </span>
                <h3 className="text-lg font-bold text-[#F7EFE8] tracking-wide mt-1">
                  {selectedDossier.title} — ARCHITECTURAL DOSSIER
                </h3>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#F7EFE8]/15 text-xs font-mono text-[#DDD3C7] hover:text-[#F7EFE8] hover:border-[#F7EFE8]/40"
              >
                ESC [CLOSE]
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#DDD3C7]">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-[#F7EFE8]/15">
                <span className="text-[#F7EFE8] font-bold block mb-1">CLIENT & ENGAGEMENT:</span>
                <span>{selectedDossier.client} ({selectedDossier.year})</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-[#F7EFE8]/15">
                <span className="text-[#F7EFE8] font-bold block mb-1">ENGINEERING NARRATIVE:</span>
                <p className="leading-relaxed text-[#DDD3C7]/90">{selectedDossier.summary}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-[#F7EFE8]/15">
                <span className="text-[#F7EFE8] font-bold block mb-1">TECHNOLOGY STACK:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDossier.stack.map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-[#F7EFE8]/15 text-[11px] font-mono text-[#DDD3C7]">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F7EFE8]/15 flex justify-end">
              <a
                href={selectedDossier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8C38] text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors"
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
