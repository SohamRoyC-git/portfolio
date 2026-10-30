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
  const ambientBackdropsRef = useRef<(HTMLDivElement | null)[]>([]);
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
          { clipPath: isDesktop ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "inset(20% 0% round 0px)" },
          {
            clipPath: isDesktop ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "inset(0% 0% round 0px)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top top",
              scrub: 0.4,
            },
          }
        );
      }

      // 2. Master Scrub Timeline for Project Transitions (With Butter-Smooth Inertia)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: isDesktop ? 1.0 : 0.8,
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
            clipPath: "inset(0% 0% 0% 0%)",
            autoAlpha: 1,
            zIndex: 10,
          });
        } else {
          gsap.set(el, {
            clipPath: "inset(50% 50% 50% 50%)",
            autoAlpha: 0,
            zIndex: 10 + i,
          });
        }
      });

      ambientBackdropsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 });
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
      // Includes 40% resting pause on each project so it stays locked and readable,
      // followed by a 60% smooth solid inside-out bloom transition.
      const numSteps = PROJECTS.length - 1;
      const stepDuration = 1 / numSteps;

      for (let i = 0; i < numSteps; i++) {
        const stepStart = i * stepDuration;
        const transitionStart = stepStart + stepDuration * 0.40;
        const transitionDuration = stepDuration * 0.60;
        const transitionEnd = transitionStart + transitionDuration;

        const curLogo = logoContainersRef.current[i];
        const nextLogo = logoContainersRef.current[i + 1];
        const curAmbient = ambientBackdropsRef.current[i];
        const nextAmbient = ambientBackdropsRef.current[i + 1];
        const curEditorial = editorialBlocksRef.current[i];
        const nextEditorial = editorialBlocksRef.current[i + 1];

        // --- Left Visual Canvas: Forge Direct Precision Inset Bloom ---
        if (nextLogo) {
          // At transitionStart, activate nextLogo so it blooms over current logo
          masterTl.set(nextLogo, { autoAlpha: 1 }, transitionStart);

          // Direct Precision Inset: Sharp, linear geometric center-out bloom edge-to-edge
          masterTl.fromTo(
            nextLogo,
            { clipPath: "inset(50% 50% 50% 50%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power2.inOut",
              duration: transitionDuration,
            },
            transitionStart
          );

          // Instant Complete Dismissal of Previous Logo:
          // The moment nextLogo finishes its bloom (transitionEnd), immediately hide curLogo
          // so transparent logos (Varti, India Center) never reveal previous logos behind them!
          if (curLogo) {
            masterTl.set(curLogo, { autoAlpha: 0 }, transitionEnd);
          }
        }

        // --- Atmospheric Depth: Cross-fade Subtle Ambient Reflected Silhouette ---
        if (curAmbient) {
          masterTl.to(
            curAmbient,
            { autoAlpha: 0, ease: "power2.inOut", duration: transitionDuration },
            transitionStart
          );
        }
        if (nextAmbient) {
          masterTl.fromTo(
            nextAmbient,
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: "power2.inOut", duration: transitionDuration },
            transitionStart
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
              duration: transitionDuration * 0.55,
            },
            transitionStart
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
              duration: transitionDuration * 0.65,
            },
            transitionStart + transitionDuration * 0.25
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
      style={{ height: "calc(100svh + 3800px)" }}
    >
      {/* Sticky 100svh Architectural Stage (Rich Wine Red & Warm Italian Light Sand) */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between pt-16 xs:pt-20 sm:pt-24 pb-4 sm:pb-8 px-4 sm:px-12 md:px-16 lg:px-20 overflow-hidden bg-[#2D0A12] border-t border-[#EAD7C0]/20 will-change-[clip-path]"
      >
        {/* Subtle Ambient Reflected Depth (Forge Automotive Atmospheric Depth) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {PROJECTS.map((proj, idx) => (
            <div
              key={`ambient-${proj.id}`}
              ref={(el) => {
                ambientBackdropsRef.current[idx] = el;
              }}
              className="absolute -right-16 -top-16 sm:-right-28 sm:-top-28 md:-right-36 md:-top-36 w-[360px] h-[360px] sm:w-[600px] sm:h-[600px] md:w-[750px] md:h-[750px] rounded-full blur-[100px] sm:blur-[140px] md:blur-[180px] will-change-[opacity]"
            >
              <div className="relative w-full h-full opacity-20 sm:opacity-25 saturate-150">
                <Image
                  src={proj.logo}
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Leading Architectural Razor Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[#EAD7C0]/30" />

        {/* Top Section Header & Telemetry */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#CBB59D] pb-2 sm:pb-3 border-b border-[#EAD7C0]/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF8C38]" />
            <span className="text-[#EAD7C0]">SELECTED COMMISSIONS // ARCHITECTURAL SHOWCASE</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5">
              {PROJECTS.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    dotIdx === activeIdx ? "bg-[#FF8C38]" : "bg-[#EAD7C0]/25"
                  }`}
                />
              ))}
            </div>
            <span className="text-[#CBB59D]/70">DEPTH:</span>
            <span className="text-[#FF8C38] font-bold">
              <span ref={counterRef}>01</span> / 04
            </span>
          </div>
        </div>

        {/* Main Split Screen Container */}
        <div className="showcase-container w-full max-w-7xl mx-auto flex-1 flex items-center my-auto will-change-[transform,opacity]">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-8 lg:gap-16 items-center">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Dedicated Architectural Canvas Frame (Forge Style)   */}
            {/* Crisp, borderless square matte canvas with center aperture bloom  */}
            {/* ================================================================= */}
            <div className="md:col-span-6 lg:col-span-6 flex justify-center items-center">
              <div className="relative w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[490px] xl:max-w-[530px] aspect-square rounded-2xl md:rounded-3xl bg-[#160408] border border-[#EAD7C0]/15 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden">
                {PROJECTS.map((proj, idx) => (
                  <div
                    key={proj.id}
                    ref={(el) => {
                      logoContainersRef.current[idx] = el;
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-[#160408] will-change-[clip-path]"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-6 xs:p-8 sm:p-12 md:p-14">
                      <Image
                        src={proj.logo}
                        alt={`${proj.title} Monogram Logo`}
                        fill
                        className="object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none pointer-events-none p-2 sm:p-4"
                        sizes="(max-width: 768px) 300px, (max-width: 1280px) 490px, 550px"
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
            <div className="md:col-span-6 lg:col-span-6 relative min-h-[220px] xs:min-h-[250px] sm:min-h-[340px] md:min-h-[440px] flex items-center">
              {PROJECTS.map((proj, idx) => (
                <div
                  key={proj.id}
                  ref={(el) => {
                    editorialBlocksRef.current[idx] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center will-change-[transform,opacity]"
                >
                  {/* Project Index & Category */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-3">
                    <span className="font-serif italic text-xl xs:text-2xl sm:text-4xl text-[#FF8C38] font-normal leading-none">
                      {proj.num}
                    </span>
                    <span className="text-[#EAD7C0]/30 font-sans text-sm sm:text-xl">/</span>
                    <span className="text-[#EAD7C0]/50 font-mono text-xs sm:text-sm">04</span>
                    <span className="w-[1px] h-3 sm:h-4 bg-[#EAD7C0]/20 mx-1" />
                    <span className="text-[9px] sm:text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#FF8C38]">
                      {proj.category}
                    </span>
                  </div>

                  {/* Monumental Editorial Heading in Italian Light Sand */}
                  <h3 className="font-sans font-black text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-[#EAD7C0] mb-1 xs:mb-2 sm:mb-4 leading-[1.05]">
                    {proj.title}
                  </h3>

                  {/* Narrative Subtext in Warm Sand */}
                  <p className="font-sans font-normal text-xs sm:text-sm md:text-base text-[#D8C4AE] leading-relaxed max-w-2xl mb-2 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                    {proj.summary}
                  </p>

                  {/* Micro-Spec Hairline Metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-b border-[#EAD7C0]/20 py-1.5 sm:py-3.5 mb-2 sm:mb-6 max-w-xl">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-[8px] sm:text-[9px] font-mono uppercase text-[#CBB59D] tracking-wider mb-0.5">
                          {m.label}
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-bold text-[#EAD7C0] tracking-tight truncate">
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
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3 rounded-full bg-[#EAD7C0] text-[#2D0A12] font-sans font-bold text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider hover:bg-[#FF8C38] hover:text-white transition-all shadow-md group cursor-pointer"
                    >
                      <span>EXPLORE LIVE PLATFORM</span>
                      <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {proj.hasDemo && (
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 xs:px-3.5 xs:py-2 sm:px-5 sm:py-3 rounded-full bg-[#1A060B] border border-[#EAD7C0]/30 text-[#EAD7C0] font-sans font-bold text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider hover:border-[#FF8C38] hover:text-[#FF8C38] transition-colors cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 xs:px-3 xs:py-2 text-[#D8C4AE] hover:text-[#EAD7C0] font-mono text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-2 sm:pt-4 border-t border-[#EAD7C0]/20 text-[9px] sm:text-[10px] font-mono text-[#CBB59D]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>SCROLL TO ADVANCE COMMISSIONS</span>
            <ArrowRight size={11} className="text-[#FF8C38]" />
          </div>

          <div className="w-36 xs:w-48 sm:w-64 h-[2px] bg-[#EAD7C0]/20 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#FF8C38] w-full transform origin-left scale-x-0 transition-transform duration-75"
            />
          </div>

          <span className="text-[#CBB59D]">01 — 04 PORTFOLIO CORE</span>
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
