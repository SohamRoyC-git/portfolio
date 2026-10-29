"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  ExternalLink,
  ShieldCheck,
  Globe2,
  Terminal,
  Activity,
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
  previewImage?: string;
  hasDemo?: boolean;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "izieat-export",
    num: "01",
    catalogueNo: "CAT.01 // B2B-EXPORT",
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
      { label: "TRADING FOCUS", value: "EU & CIS" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "i18n Engine", "Client Cache"],
    logo: "/assets/logos/izieat.png",
    displayDomain: "IZIEAT.COM",
    previewImage: "/assets/izieat_preview.png",
    hasDemo: true,
  },
  {
    id: "latvia-cricket",
    num: "02",
    catalogueNo: "CAT.02 // SPORTS-GOVERNANCE",
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
    catalogueNo: "CAT.03 // DIPLOMATIC-PORTAL",
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
    catalogueNo: "CAT.04 // GLOBAL-SUPPLY-CHAIN",
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

  // In-card interactive language switcher for IZIEAT
  const [inCardLang, setInCardLang] = useState<"en" | "ru">("en");
  const [sampleIdx, setSampleIdx] = useState(0);

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);

  const sampleSnippets = [
    {
      en: "IQF Frozen Sweet Corn Cobs (Super Sweet Variety)",
      ru: "Замороженная сахарная кукуруза в початках IQF",
      specEn: "Brix Sweetness: 12°–14° • Blast Frozen at -38°C",
      specRu: "Сладость Брикс: 12°–14° • Шоковая заморозка при -38°C",
    },
    {
      en: "Export Specifications & Phytosanitary Compliance",
      ru: "Экспортные спецификации и фитосанитарный контроль",
      specEn: "ISO 22000 & HACCP Certified • Global Cold Chain",
      specRu: "Сертификация ISO 22000 и HACCP • Международная логистика",
    },
    {
      en: "Multi-Port Container Logistics (Hamburg, Rotterdam, Riga)",
      ru: "Контейнерная логистика (Гамбург, Роттердам, Рига)",
      specEn: "Direct Vessel Booking • CIF & FOB Incoterms 2020",
      specRu: "Прямой букинг судов • Условия CIF и FOB Incoterms 2020",
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      // =======================================================================
      // 1. HORIZONTAL ARCHITECTURAL CURTAIN SWEEP ENTRANCE (Left to Right)
      // Section wipes smoothly across the screen horizontally from left to right!
      // =======================================================================
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

      // =======================================================================
      // 2. INSIDE-OUT PROJECT CARD REVEAL TIMELINE
      // Each next project card expands and zooms outward from the center portal
      // of the previous card as you scroll!
      // =======================================================================
      const projTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      // Segment 1: Card 0 -> Card 1 expands outward from Card 0's portal
      projTL.to(
        "#proj-card-0",
        {
          scale: 1.12,
          opacity: 0,
          pointerEvents: "none",
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      projTL.fromTo(
        "#proj-card-1",
        { scale: 0.45, opacity: 0, pointerEvents: "none" },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: "auto",
          duration: 1,
          ease: "power2.inOut",
          onStart: () => {
            setActiveIdx(1);
            if (counterRef.current) counterRef.current.textContent = "02 / 04";
          },
          onReverseComplete: () => {
            setActiveIdx(0);
            if (counterRef.current) counterRef.current.textContent = "01 / 04";
          },
        },
        0
      );

      // Segment 2: Card 1 -> Card 2 expands outward from Card 1's portal
      projTL.to(
        "#proj-card-1",
        {
          scale: 1.12,
          opacity: 0,
          pointerEvents: "none",
          duration: 1,
          ease: "power2.inOut",
        },
        1.2
      );

      projTL.fromTo(
        "#proj-card-2",
        { scale: 0.45, opacity: 0, pointerEvents: "none" },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: "auto",
          duration: 1,
          ease: "power2.inOut",
          onStart: () => {
            setActiveIdx(2);
            if (counterRef.current) counterRef.current.textContent = "03 / 04";
          },
          onReverseComplete: () => {
            setActiveIdx(1);
            if (counterRef.current) counterRef.current.textContent = "02 / 04";
          },
        },
        1.2
      );

      // Segment 3: Card 2 -> Card 3 expands outward from Card 2's portal
      projTL.to(
        "#proj-card-2",
        {
          scale: 1.12,
          opacity: 0,
          pointerEvents: "none",
          duration: 1,
          ease: "power2.inOut",
        },
        2.4
      );

      projTL.fromTo(
        "#proj-card-3",
        { scale: 0.45, opacity: 0, pointerEvents: "none" },
        {
          scale: 1,
          opacity: 1,
          pointerEvents: "auto",
          duration: 1,
          ease: "power2.inOut",
          onStart: () => {
            setActiveIdx(3);
            if (counterRef.current) counterRef.current.textContent = "04 / 04";
          },
          onReverseComplete: () => {
            setActiveIdx(2);
            if (counterRef.current) counterRef.current.textContent = "03 / 04";
          },
        },
        2.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openDossier = (project: ProjectItem) => {
    setSelectedDossier(project);
    setIsDossierOpen(true);
  };

  return (
    <div
      id="monument-exhibition"
      ref={sectionRef}
      className="relative w-full z-30"
      style={{ height: "calc(100svh + 3400px)" }}
    >
      <span id="work" className="sr-only" aria-hidden="true" />

      {/* Sticky 100svh Architectural Stage */}
      <section
        ref={stageRef}
        className="sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-6 px-4 sm:px-8 md:px-12 overflow-hidden bg-[#060709] border-t border-white/10 will-change-[clip-path]"
      >
        {/* Leading Razor Hairline Edge (Clean architectural rule, ZERO glows) */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />

        {/* Top Editorial HUD Header */}
        <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto px-2 mb-2 sm:mb-4 border-b border-white/10 pb-3">
          <div className="font-sans font-bold text-[11px] sm:text-xs text-[#FF7A00] tracking-[0.2em] uppercase flex items-center gap-2 sm:gap-3">
            <span className="w-5 sm:w-8 h-[1px] bg-[#FF7A00]" />
            <span>SELECTED COMMISSIONS</span>
            <span className="text-slate-500 hidden sm:inline">· INSIDE-OUT EXPANSION</span>
          </div>

          {/* Interactive Progress Indicator */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-sans font-medium text-[10px] text-slate-400 uppercase tracking-widest">
              COMMISSION ARCHIVE
            </span>
            <div className="w-28 sm:w-36 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#FF7A00] transition-all duration-75"
                style={{ width: "0%" }}
              />
            </div>
            <span
              ref={counterRef}
              className="font-mono text-xs text-[#FFFDF9] tracking-wider"
            >
              01 / 04
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* INSIDE-OUT CARD ARENA                                               */}
        {/* =================================================================== */}
        <div className="relative w-full max-w-6xl h-[560px] sm:h-[590px] mx-auto flex items-center justify-center my-auto">
          {/* ----------------------------------------------------------------- */}
          {/* CARD 0: IZIEAT EXPORT PORTAL                                      */}
          {/* ----------------------------------------------------------------- */}
          <div
            id="proj-card-0"
            className="absolute inset-0 rounded-2xl bg-[#0C0E14] border border-white/12 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden will-change-[transform,opacity]"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#FF7A00] tracking-widest uppercase">
                    CAT.01 // B2B EXPORT
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">2024</span>
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-4xl text-[#FFFDF9] uppercase tracking-tight mt-1">
                  IZIEAT Export Portal
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
                  Global wholesale portal with an in-memory 278-key instant English-Russian dictionary (&lt;5ms latency), eliminating external translation API roundtrips.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECTS[0].stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interior Two-Column: Interactive Engine on Left + Portal for Next Project on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto py-2">
              {/* Left Column: Live In-Memory Translation Tester */}
              <div className="md:col-span-7 rounded-xl bg-[#08090C] border border-white/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      IN-MEMORY ENGINE TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">LATENCY &lt; 2.8ms</span>
                  </div>

                  {/* Snippet Display */}
                  <div className="min-h-[70px] mb-3">
                    <div className="text-xs font-mono text-slate-500 mb-1">
                      {inCardLang === "en" ? "[EN] COMMODITY KEY" : "[RU] ТОВАРНАЯ ПОЗИЦИЯ"}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white transition-all duration-150">
                      {inCardLang === "en"
                        ? sampleSnippets[sampleIdx].en
                        : sampleSnippets[sampleIdx].ru}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {inCardLang === "en"
                        ? sampleSnippets[sampleIdx].specEn
                        : sampleSnippets[sampleIdx].specRu}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInCardLang("en")}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                        inCardLang === "en"
                          ? "bg-[#FF7A00] text-black"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setInCardLang("ru")}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                        inCardLang === "ru"
                          ? "bg-[#FF7A00] text-black"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      RU
                    </button>
                  </div>

                  <button
                    onClick={() => setSampleIdx((prev) => (prev + 1) % sampleSnippets.length)}
                    className="text-[11px] font-mono text-[#FF7A00] hover:text-[#FFA347] transition-colors"
                  >
                    CYCLE STRING ⟳
                  </button>
                </div>
              </div>

              {/* Right Column: Inset Next Project Portal (Latvian Cricket) */}
              <div
                id="portal-seed-1"
                className="md:col-span-5 rounded-xl bg-[#0A0D14] border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    NESTED REVELATION
                  </div>
                  <div className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-wider">
                    CAT.02 // SPORTS GOVERNANCE
                  </div>
                  <h4 className="font-sans font-bold text-lg sm:text-xl text-white mt-1">
                    Latvian Cricket Federation
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    National sports infrastructure, automated tournament reporting, and live telemetry streams.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FF7A00]">
                  <span>SCROLL TO EXPAND FROM WITHIN</span>
                  <span>↓</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <a
                  href={PROJECTS[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#FF7A00] hover:text-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                >
                  <span>Launch Live Site</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Terminal size={12} className="text-[#FF7A00]" />
                  <span>278-Key Sandbox</span>
                </button>
              </div>

              <button
                onClick={() => openDossier(PROJECTS[0])}
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                VIEW ARCHITECTURAL DOSSIER →
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 1: LATVIAN CRICKET FEDERATION (Reveals from inside Card 0)   */}
          {/* ----------------------------------------------------------------- */}
          <div
            id="proj-card-1"
            className="absolute inset-0 rounded-2xl bg-[#0C0E14] border border-white/12 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden will-change-[transform,opacity] pointer-events-none"
            style={{ opacity: 0, transform: "scale(0.45)" }}
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#FF7A00] tracking-widest uppercase">
                    CAT.02 // SPORTS GOVERNANCE
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">2024</span>
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-4xl text-[#FFFDF9] uppercase tracking-tight mt-1">
                  Latvian Cricket Federation
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
                  Modernized national governing infrastructure and digital communication channels, orchestrating automated tournament reporting and EU regulatory compliance.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECTS[1].stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interior Two-Column: Telemetry Metrics + Portal for Project 03 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto py-2">
              <div className="md:col-span-7 rounded-xl bg-[#08090C] border border-white/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity size={12} className="text-emerald-400" />
                      EVENT INGESTION TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">STATUS: NOMINAL</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-white">99.98%</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">System Uptime</div>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-[#FF7A00]">100k+</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">Events / mo</div>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">0.00%</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">Data Loss</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>EU Compliance: Verified</span>
                  <span>Cloudflare Workers: Edge Native</span>
                </div>
              </div>

              {/* Inset Portal for Project 03 */}
              <div
                id="portal-seed-2"
                className="md:col-span-5 rounded-xl bg-[#0A0D14] border border-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    NESTED REVELATION
                  </div>
                  <div className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-wider">
                    CAT.03 // DIPLOMATIC PORTAL
                  </div>
                  <h4 className="font-sans font-bold text-lg sm:text-xl text-white mt-1">
                    India Center (Indijas Centrs)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Official Indo-Baltic cultural, academic, and economic bilateral platform connecting India and Latvia.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FF7A00]">
                  <span>SCROLL TO EXPAND FROM WITHIN</span>
                  <span>↓</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href={PROJECTS[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#FF7A00] hover:text-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={12} />
              </a>

              <button
                onClick={() => openDossier(PROJECTS[1])}
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                VIEW ARCHITECTURAL DOSSIER →
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 2: INDIA CENTER (Reveals from inside Card 1)                  */}
          {/* ----------------------------------------------------------------- */}
          <div
            id="proj-card-2"
            className="absolute inset-0 rounded-2xl bg-[#0C0E14] border border-white/12 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden will-change-[transform,opacity] pointer-events-none"
            style={{ opacity: 0, transform: "scale(0.45)" }}
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#FF7A00] tracking-widest uppercase">
                    CAT.03 // DIPLOMATIC PORTAL
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">2024–2025</span>
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-4xl text-[#FFFDF9] uppercase tracking-tight mt-1">
                  India Center (Indijas Centrs)
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
                  Official Indo-Baltic cultural, academic, and economic bilateral platform connecting India and Latvia with consular event scheduling.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECTS[2].stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interior Two-Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto py-2">
              <div className="md:col-span-7 rounded-xl bg-[#08090C] border border-white/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe2 size={12} className="text-emerald-400" />
                      BILATERAL PLATFORM TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">EDGE NATIVE</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-white">&lt; 18ms</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">Edge Latency</div>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-[#FF7A00]">LV / EN</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">Bilingual</div>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">100%</div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase mt-1">Edge Availability</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Consular Integration: Online</span>
                  <span>Bilateral Portal: Indo-Baltic</span>
                </div>
              </div>

              {/* Inset Portal for Project 04 */}
              <div
                id="portal-seed-3"
                className="md:col-span-5 rounded-xl bg-[#0A0D14] border border-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    NESTED REVELATION
                  </div>
                  <div className="text-[10px] font-mono text-[#FF7A00] uppercase tracking-wider">
                    CAT.04 // GLOBAL SUPPLY CHAIN
                  </div>
                  <h4 className="font-sans font-bold text-lg sm:text-xl text-white mt-1">
                    Varti International
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Enterprise international commodity trading and cross-border supply chain platform.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#FF7A00]">
                  <span>SCROLL TO EXPAND FROM WITHIN</span>
                  <span>↓</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href={PROJECTS[2].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#FF7A00] hover:text-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={12} />
              </a>

              <button
                onClick={() => openDossier(PROJECTS[2])}
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                VIEW ARCHITECTURAL DOSSIER →
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CARD 3: VARTI INTERNATIONAL (Reveals from inside Card 2)          */}
          {/* ----------------------------------------------------------------- */}
          <div
            id="proj-card-3"
            className="absolute inset-0 rounded-2xl bg-[#0C0E14] border border-white/12 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden will-change-[transform,opacity] pointer-events-none"
            style={{ opacity: 0, transform: "scale(0.45)" }}
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#FF7A00] tracking-widest uppercase">
                    CAT.04 // GLOBAL SUPPLY CHAIN
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">2024–2025</span>
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-4xl text-[#FFFDF9] uppercase tracking-tight mt-1">
                  Varti International
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
                  Enterprise international commodity trading and cross-border supply chain platform with multi-currency pricing models and logistics tracking.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECTS[3].stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interior Two-Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto py-2">
              <div className="md:col-span-12 rounded-xl bg-[#08090C] border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      INSTITUTIONAL TIER VERIFICATION
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">GLOBAL AGRO PORTFOLIO</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-white">Multi-Port</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">Hamburg · Rotterdam · Riga</div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-[#FF7A00]">Multi-Currency</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">Realtime FX Settlement</div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">Verified</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">Institutional B2B Network</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Logistics Pipeline: Automated Cargo Tracking</span>
                  <span>Compliance Tier: Institutional</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href={PROJECTS[3].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#FF7A00] hover:text-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={12} />
              </a>

              <button
                onClick={() => openDossier(PROJECTS[3])}
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                VIEW ARCHITECTURAL DOSSIER →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status Ticker */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto px-2 pt-2 border-t border-white/10 text-[10px] font-mono text-slate-500 uppercase">
          <div className="flex items-center gap-4">
            {PROJECTS.map((p, i) => (
              <span
                key={p.id}
                className={`flex items-center gap-1.5 transition-colors ${
                  activeIdx === i ? "text-[#FF7A00] font-bold" : "text-slate-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeIdx === i ? "bg-[#FF7A00]" : "bg-white/20"
                  }`}
                />
                <span>{p.title.split(" ")[0]}</span>
              </span>
            ))}
          </div>

          <div className="tracking-widest">
            ENGINEERED WITH ARCHITECTURAL DISCIPLINE
          </div>
        </div>
      </section>

      {/* Interactive 278-Key Translation Engine Modal (Frosted Obsidian CAD) */}
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0C0E14] border border-white/15 shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="font-mono font-bold text-xs text-[#FF7A00] uppercase tracking-wider">
                IZIEAT // 278-KEY IN-MEMORY LOCALIZATION ENGINE
              </span>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <LocalizationDemo />
          </div>
        </div>
      )}

      {/* Project Architectural Dossier Modal */}
      {isDossierOpen && selectedDossier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsDossierOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#0C0E14] border border-white/15 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="font-mono text-xs text-[#FF7A00] uppercase tracking-wider">
                  {selectedDossier.catalogueNo}
                </span>
                <h4 className="font-sans font-black text-2xl text-white uppercase mt-1">
                  {selectedDossier.title}
                </h4>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
              {selectedDossier.summary}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedDossier.metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-center">
                  <div className="font-mono text-base font-bold text-[#FF7A00]">{m.value}</div>
                  <div className="font-mono text-[9px] text-slate-500 uppercase mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="font-mono text-xs text-slate-400">
                DOMAIN: {selectedDossier.displayDomain}
              </span>
              <a
                href={selectedDossier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#FF7A00] hover:text-black text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GrandSpatialDiscs.displayName = "GrandSpatialDiscs";
