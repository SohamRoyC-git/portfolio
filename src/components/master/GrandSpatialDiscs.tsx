"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Eye,
  Disc3,
  ArrowUpRight,
  X,
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
  visualType: "izieat" | "cricket" | "india_center" | "varti";
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
    visualType: "izieat",
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
    visualType: "cricket",
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
    visualType: "india_center",
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
    visualType: "varti",
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

  const activeIdxRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    let cardOffsets: number[] = [];
    const measureCards = () => {
      cardOffsets = cardsRef.current.map((card) =>
        card ? card.offsetLeft + card.offsetWidth / 2 : 0
      );
    };

    const getExactScrollAmount = () => {
      const card1 = cardsRef.current[0];
      const cardLast = cardsRef.current[cardsRef.current.length - 1];
      if (!card1 || !cardLast) return 0;
      return -(cardLast.offsetLeft - card1.offsetLeft);
    };

    const updateOrbitalCards = (trackX: number) => {
      const screenCenter = window.innerWidth / 2;
      const isMobile = window.innerWidth < 768;
      const flatZone = window.innerWidth * (isMobile ? 0.28 : 0.22);
      const paddingLeft = (window.innerWidth - Math.min(880, window.innerWidth * 0.86)) / 2;

      let closestIdx = 0;
      let minDistance = Infinity;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const offset = cardOffsets[index] || (card.offsetLeft + card.offsetWidth / 2);
        const cardCenter = paddingLeft + trackX + offset;
        const distFromCenter = cardCenter - screenCenter;
        const absDist = Math.abs(distFromCenter);

        if (absDist < minDistance) {
          minDistance = absDist;
          closestIdx = index;
        }

        let rotateY = 0;
        let translateZ = 0;
        let scale = 1;
        let opacity = 1;

        if (absDist <= flatZone) {
          rotateY = 0;
          translateZ = 0;
          scale = 1;
          opacity = 1;
        } else {
          const excess = (absDist - flatZone) / (window.innerWidth * 0.40);
          const sign = distFromCenter > 0 ? 1 : -1;
          const t = Math.min(Math.max(excess, 0), 1.6);

          const maxTilt = isMobile ? 8 : 14;
          rotateY = sign * -maxTilt * Math.min(t, 1);
          translateZ = -Math.pow(t, 1.2) * (isMobile ? 50 : 90);
          scale = 1 - Math.min(t * (isMobile ? 0.04 : 0.06), 0.10);
          opacity = 1 - Math.min(t * 0.25, 0.45);
        }

        card.style.transform = `perspective(1400px) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      });

      if (closestIdx !== activeIdxRef.current) {
        activeIdxRef.current = closestIdx;
        setActiveIdx(closestIdx);
        if (counterRef.current) {
          counterRef.current.textContent = `0${closestIdx + 1} / 0${PROJECTS.length}`;
        }
      }
    };

    const ctx = gsap.context(() => {
      measureCards();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pin,
          start: "top top",
          end: "+=3200",
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measureCards();
          },
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
            const totalScroll = getExactScrollAmount();
            const tProgress = Math.min(self.progress / 0.85, 1.0);
            const currentTrackX = totalScroll * tProgress;
            updateOrbitalCards(currentTrackX);
          },
        },
      });

      // Horizontal track travel
      tl.to(
        track,
        {
          x: getExactScrollAmount,
          ease: "none",
          duration: 0.82,
        },
        0
      );

      // Dedicated hold period at end
      tl.to({}, { duration: 0.18 }, 0.82);
    }, section);

    measureCards();
    updateOrbitalCards(0);

    const handleResize = () => {
      measureCards();
      updateOrbitalCards(0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  const openDossier = (project: ProjectItem) => {
    setSelectedDossier(project);
    setIsDossierOpen(true);
  };

  return (
    <section
      id="monument-exhibition"
      ref={sectionRef}
      className="relative w-full overflow-hidden z-20 bg-[#060709] border-t border-white/12 shadow-[0_-35px_100px_rgba(0,0,0,0.95)]"
    >
      <span id="work" className="sr-only" aria-hidden="true" />

      {/* Pinned Fullscreen Stage */}
      <div
        ref={pinRef}
        className="h-[100svh] w-full flex flex-col justify-between pt-16 sm:pt-24 pb-4 sm:pb-8 px-4 sm:px-8 md:px-12 relative overflow-hidden bg-transparent z-20 will-change-transform"
      >
        {/* Pinned Top HUD Header */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto px-2 mb-2 sm:mb-4">
          <div className="font-sans font-bold text-[11px] sm:text-xs text-[#FF7A00] tracking-[0.2em] uppercase flex items-center gap-2 sm:gap-3">
            <span className="w-5 sm:w-8 h-[1px] bg-[#FF7A00]" />
            <span className="truncate">SELECTED COMMISSIONS</span>
          </div>

          {/* Interactive Progress Scrub Indicator */}
          <div className="hidden md:flex items-center gap-4">
            <span className="font-sans font-medium text-[10px] text-slate-400 uppercase tracking-widest">
              ORBITAL EXHIBITION
            </span>
            <div className="w-44 h-1.5 rounded-full bg-white/10 p-0.5 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#FF7A00] via-[#FFA347] to-[#10B981] rounded-full"
                style={{ width: "0%" }}
              />
            </div>
            <span
              ref={counterRef}
              className="font-helvetica font-normal text-sm text-[#FFFDF9] tracking-wider"
            >
              01 / 0{PROJECTS.length}
            </span>
          </div>

          <div className="font-sans font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
            <span>SCROLL</span>
            <ArrowRight size={13} className="text-[#FF7A00] animate-pulse" />
          </div>
        </div>

        {/* Horizontal Orbital 3D Track */}
        <div className="relative z-10 my-auto w-full overflow-visible py-2 sm:py-4">
          <div
            ref={trackRef}
            className="flex gap-6 sm:gap-12 items-center will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              paddingLeft: "calc((100vw - min(880px, 86vw)) / 2)",
              paddingRight: "calc((100vw - min(880px, 86vw)) / 2)",
            }}
          >
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                /* Frosted Obsidian CAD Plinth Card */
                className="w-[86vw] max-w-[880px] shrink-0 p-5 sm:p-8 lg:p-9 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/25 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center will-change-transform max-h-[calc(100svh-170px)] overflow-y-auto sm:overflow-visible"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Card Editorial Metadata (7 Cols on desktop, full on mobile) */}
                <div className="lg:col-span-7 flex flex-col justify-between z-10">
                  <div>
                    {/* Catalogue Badge & Category */}
                    <div className="inline-flex items-center gap-2 font-sans font-bold text-[10px] sm:text-xs text-[#FF7A00] uppercase tracking-wider mb-2.5">
                      <Disc3 size={13} className="animate-spin text-[#FF7A00]" />
                      <span>{project.catalogueNo}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-slate-400 truncate max-w-[170px] sm:max-w-none">
                        {project.category}
                      </span>
                    </div>

                    {/* Official Client Logo & Metadata Header */}
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="h-14 sm:h-16 px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0">
                        <Image
                          src={project.logo}
                          alt={project.client}
                          width={130}
                          height={56}
                          className="object-contain max-h-10 sm:max-h-12 w-auto"
                        />
                      </div>
                      <div>
                        <div className="font-sans font-bold text-sm sm:text-base text-[#FFFDF9] leading-tight">
                          {project.client}
                        </div>
                        <div className="font-sans font-medium text-xs text-slate-400">
                          Production System • {project.year}
                        </div>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-[#FFFDF9] tracking-tight leading-[1.08] mb-2.5">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="font-serif italic font-light text-sm sm:text-base text-slate-300/90 leading-relaxed mb-3.5 line-clamp-2 sm:line-clamp-3">
                      {project.summary}
                    </p>

                    {/* System Benchmarks */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/12 text-[#FF7A00] font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
                        <span>
                          {project.metrics[0].label}: {project.metrics[0].value}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                        <span>
                          {project.metrics[1].label}: {project.metrics[1].value}
                        </span>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 font-sans font-medium text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Controls: View Site & Technical Dossier */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-3 border-t border-white/10">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#060709] font-sans font-bold text-xs tracking-wider uppercase hover:bg-[#FF7A00] hover:text-white transition-colors duration-200 shadow-md cursor-pointer"
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink size={13} />
                    </a>

                    {project.hasDemo && (
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7A00]/15 text-[#FFA347] border border-[#FF7A00]/30 font-sans font-bold text-xs tracking-wider uppercase hover:bg-[#FF7A00]/25 transition-colors duration-200 cursor-pointer"
                      >
                        <Sparkles size={13} />
                        <span>278-Key Sandbox</span>
                      </button>
                    )}

                    <button
                      onClick={() => openDossier(project)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/12 text-slate-300 font-sans font-bold text-xs tracking-wider uppercase hover:text-white hover:border-white/30 transition-colors duration-200 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Right Card Visual Artifact (5 Cols on desktop, full on mobile) */}
                <div className="lg:col-span-5 flex items-center justify-center relative">
                  {/* Visual 1: IZIEAT - Interactive In-Card Framer Motion Language Sandbox */}
                  {project.visualType === "izieat" && (
                    <div className="w-full max-w-sm rounded-2xl bg-[#08090D] border border-white/12 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                      {/* Top Header: Traffic Lights + Verified Domain Badge */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                          <span className="ml-2 font-sans font-bold text-[10px] text-slate-300">
                            {project.displayDomain}
                          </span>
                        </div>

                        {/* Interactive Framer Motion Language Switcher Pill */}
                        <div className="relative flex items-center bg-white/[0.06] border border-white/10 rounded-full p-0.5">
                          <button
                            onClick={() => setInCardLang("en")}
                            className="relative px-2.5 py-0.5 font-sans font-bold text-[10px] uppercase tracking-wider text-white transition-colors cursor-pointer z-10"
                          >
                            {inCardLang === "en" && (
                              <motion.div
                                layoutId="card-lang-pill"
                                className="absolute inset-0 bg-[#FF7A00] rounded-full"
                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                              />
                            )}
                            <span className="relative z-20">EN</span>
                          </button>
                          <button
                            onClick={() => setInCardLang("ru")}
                            className="relative px-2.5 py-0.5 font-sans font-bold text-[10px] uppercase tracking-wider text-white transition-colors cursor-pointer z-10"
                          >
                            {inCardLang === "ru" && (
                              <motion.div
                                layoutId="card-lang-pill"
                                className="absolute inset-0 bg-[#FF7A00] rounded-full"
                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                              />
                            )}
                            <span className="relative z-20">RU</span>
                          </button>
                        </div>
                      </div>

                      {/* Live Reactive Dictionary Translation Stage */}
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3.5">
                        <div className="flex items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          <span>IN-MEMORY DICTIONARY OUTPUT</span>
                          <span className="text-emerald-400 font-mono">&lt; 2.8ms</span>
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={inCardLang + sampleIdx}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-1.5"
                          >
                            <div className="font-sans font-bold text-xs sm:text-sm text-[#FFFDF9] leading-snug">
                              {inCardLang === "en"
                                ? sampleSnippets[sampleIdx].en
                                : sampleSnippets[sampleIdx].ru}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">
                              {inCardLang === "en"
                                ? sampleSnippets[sampleIdx].specEn
                                : sampleSnippets[sampleIdx].specRu}
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Interactive Sample Stepper */}
                        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10 text-[9px]">
                          <span className="text-slate-400 uppercase font-mono">
                            KEY {sampleIdx + 1} OF {sampleSnippets.length}
                          </span>
                          <button
                            onClick={() =>
                              setSampleIdx((prev) => (prev + 1) % sampleSnippets.length)
                            }
                            className="text-[#FF7A00] hover:text-[#FFA347] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            CYCLE STRING →
                          </button>
                        </div>
                      </div>

                      {/* Telemetry Architecture Bar */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3.5">
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/8">
                          <div className="text-slate-400 uppercase font-mono text-[9px]">
                            EXTERNAL API DELAY
                          </div>
                          <div className="font-bold text-emerald-400">0.00ms (0 calls)</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/8">
                          <div className="text-slate-400 uppercase font-mono text-[9px]">
                            DICTIONARY CACHE
                          </div>
                          <div className="font-bold text-[#FFFDF9]">278 Key Pairs</div>
                        </div>
                      </div>

                      {/* Direct Link Capsule */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE AT {project.displayDomain}</span>
                        </span>
                        <ArrowUpRight size={13} className="text-emerald-400" />
                      </a>
                    </div>
                  )}

                  {/* Visual 2: Latvian Cricket Federation */}
                  {project.visualType === "cricket" && (
                    <div className="w-full max-w-sm rounded-2xl bg-[#08090D] border border-white/12 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-400 font-sans font-bold text-[9px] uppercase tracking-wider">
                            LV-FED // OFFICIAL
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-300">
                            Latvijas Kriketa Federācija
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">
                          99.98% UPTIME
                        </span>
                      </div>

                      {/* Logo & Federation Emblem Stage */}
                      <div className="flex items-center p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3.5">
                        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center p-1 rounded-lg bg-white/[0.05]">
                          <Image
                            src={project.logo}
                            alt="Latvian Cricket Federation"
                            width={56}
                            height={56}
                            className="object-contain max-h-12 w-auto"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="font-sans font-bold text-xs text-[#FFFDF9] uppercase tracking-wider mb-0.5">
                            National Sports Infrastructure
                          </div>
                          <div className="font-sans text-[11px] text-slate-400 leading-tight">
                            Tournament Event Bus • 4 Divisions • Realtime Ingestion
                          </div>
                        </div>
                      </div>

                      {/* Telemetry Architecture Monoliths */}
                      <div className="space-y-2 mb-3.5">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            GOVERNANCE ENGINE
                          </span>
                          <span className="font-sans font-bold text-xs text-[#FFFDF9]">
                            EU Compliance &amp; Match Ingest
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            EVENT INGESTION BUS
                          </span>
                          <span className="font-sans font-bold text-xs text-[#FF7A00]">
                            100k+ Telemetry Events / mo
                          </span>
                        </div>
                      </div>

                      {/* Direct Link Capsule */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE AT {project.displayDomain}</span>
                        </span>
                        <ArrowUpRight size={13} className="text-emerald-400" />
                      </a>
                    </div>
                  )}

                  {/* Visual 3: India Center */}
                  {project.visualType === "india_center" && (
                    <div className="w-full max-w-sm rounded-2xl bg-[#08090D] border border-white/12 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-sans font-bold text-[9px] uppercase tracking-wider">
                            IN-LV // DIPLOMATIC
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-300">
                            Indijas Centrs • Latvia
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-amber-400 font-bold">
                          LV / EN DUAL
                        </span>
                      </div>

                      {/* Emblem Stage */}
                      <div className="flex items-center p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3.5">
                        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center p-1 rounded-lg bg-white/[0.05]">
                          <Image
                            src={project.logo}
                            alt="India Center Peacock Emblem"
                            width={56}
                            height={56}
                            className="object-contain max-h-12 w-auto"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="font-sans font-bold text-xs text-[#FFFDF9] uppercase tracking-wider mb-0.5">
                            Bilateral Cultural &amp; Trade Bridge
                          </div>
                          <div className="font-sans text-[11px] text-slate-400 leading-tight">
                            Consular Dispatch • High-Throughput Baltic Edge
                          </div>
                        </div>
                      </div>

                      {/* Telemetry Monoliths */}
                      <div className="space-y-2 mb-3.5">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            CONSULAR SCHEDULING
                          </span>
                          <span className="font-sans font-bold text-xs text-[#FFFDF9]">
                            Academic &amp; Event Dispatch
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            BALTIC EDGE LATENCY
                          </span>
                          <span className="font-sans font-bold text-xs text-amber-400 font-mono">
                            &lt; 18ms Edge CDN
                          </span>
                        </div>
                      </div>

                      {/* Direct Link Capsule */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE AT {project.displayDomain}</span>
                        </span>
                        <ArrowUpRight size={13} className="text-emerald-400" />
                      </a>
                    </div>
                  )}

                  {/* Visual 4: Varti International */}
                  {project.visualType === "varti" && (
                    <div className="w-full max-w-sm rounded-2xl bg-[#08090D] border border-white/12 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 font-sans font-bold text-[9px] uppercase tracking-wider">
                            GLOBAL-SUPPLY // AGRO
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-300">
                            Varti International Corp
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-blue-400 font-bold">
                          INSTITUTIONAL
                        </span>
                      </div>

                      {/* Logo Stage */}
                      <div className="flex items-center p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3.5">
                        <div className="relative w-full h-12 flex items-center justify-center p-1 rounded-lg bg-white/[0.05]">
                          <Image
                            src={project.logo}
                            alt="Varti International Logo"
                            width={160}
                            height={48}
                            className="object-contain max-h-10 w-auto"
                          />
                        </div>
                      </div>

                      {/* Telemetry Monoliths */}
                      <div className="space-y-2 mb-3.5">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            COMMODITY SETTLEMENT
                          </span>
                          <span className="font-sans font-bold text-xs text-[#FFFDF9]">
                            Multi-Currency Clearing
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between">
                          <span className="font-sans font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                            BUYER VERIFICATION
                          </span>
                          <span className="font-sans font-bold text-xs text-blue-400">
                            Institutional Security
                          </span>
                        </div>
                      </div>

                      {/* Direct Link Capsule */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE AT {project.displayDomain}</span>
                        </span>
                        <ArrowUpRight size={13} className="text-emerald-400" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Bottom HUD Bar with card navigation indicators */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2 px-2 border-t border-white/10">
          <div className="flex items-center gap-2 sm:gap-4">
            {PROJECTS.map((p, i) => (
              <span
                key={p.id}
                className={`transition-all duration-300 font-sans text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
                  activeIdx === i ? "text-[#FF7A00] font-bold" : "text-slate-500 font-medium"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeIdx === i ? "bg-[#FF7A00] scale-125" : "bg-white/20"
                  }`}
                />
                <span className="hidden sm:inline">{p.title.split(" ")[0]}</span>
              </span>
            ))}
          </div>

          <div className="font-sans font-bold text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-widest">
            CURATED COMMISSIONS
          </div>
        </div>
      </div>

      {/* Interactive 278-Key Translation Engine Modal (Frosted Obsidian CAD) */}
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0C0E14] border border-white/15 shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="font-sans font-bold text-xs text-[#FF7A00] uppercase tracking-wider">
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

      {/* Technical Architecture Dossier Modal (Frosted Obsidian CAD) */}
      {isDossierOpen && selectedDossier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsDossierOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-[#0C0E14] rounded-3xl p-5 sm:p-8 border border-white/15 shadow-2xl relative flex flex-col overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 px-2 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0">
                  <Image
                    src={selectedDossier.logo}
                    alt={selectedDossier.client}
                    width={44}
                    height={44}
                    className="object-contain max-h-9 w-auto"
                  />
                </div>
                <div>
                  <span className="font-sans font-bold text-[10px] text-[#FF7A00] uppercase tracking-wider block">
                    {selectedDossier.catalogueNo}
                  </span>
                  <h4 className="font-sans font-bold text-lg sm:text-xl text-[#FFFDF9]">
                    {selectedDossier.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Dossier"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="space-y-4 text-left overflow-y-auto pr-2 flex-1 overscroll-contain">
              <div>
                <h5 className="font-sans font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">
                  Executive Brief &amp; Architecture
                </h5>
                <p className="font-serif italic font-light text-slate-300 leading-relaxed text-sm sm:text-base break-words">
                  {selectedDossier.summary}
                </p>
              </div>

              <div>
                <h5 className="font-sans font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                  System Benchmarks
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedDossier.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.04] border border-white/10"
                    >
                      <div className="font-sans font-medium text-[9px] text-slate-400 uppercase mb-0.5">
                        {m.label}
                      </div>
                      <div className="font-sans font-bold text-sm text-[#FFFDF9]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-sans font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                  Production Engineering Stack
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDossier.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-white/[0.05] text-slate-300 font-sans font-medium text-xs border border-white/10 uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
              <a
                href={selectedDossier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#060709] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FF7A00] hover:text-white transition-colors duration-200 shadow-sm"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

GrandSpatialDiscs.displayName = "GrandSpatialDiscs";
