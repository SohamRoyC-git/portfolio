"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Eye,
  Disc3,
  Building2,
  Ship,
  Activity,
  Layers,
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
  visualType: "turntable" | "cricket" | "india_center" | "varti";
  discImage?: string;
  hasDemo?: boolean;
  socials?: { name: string; svgPath: string; viewBox?: string }[];
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
    visualType: "turntable",
    discImage: "/assets/vinyl_izieat.png",
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
    socials: [
      {
        name: "Instagram",
        viewBox: "0 0 24 24",
        svgPath:
          "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      },
      {
        name: "X (Twitter)",
        viewBox: "0 0 24 24",
        svgPath:
          "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      },
      {
        name: "Facebook",
        viewBox: "0 0 24 24",
        svgPath:
          "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
      },
      {
        name: "YouTube",
        viewBox: "0 0 24 24",
        svgPath:
          "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      },
      {
        name: "LinkedIn",
        viewBox: "0 0 24 24",
        svgPath:
          "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
      },
    ],
  },
  {
    id: "india-center",
    num: "03",
    catalogueNo: "CAT.03 // DIPLOMATIC-PORTAL",
    category: "BILATERAL CULTURAL & TRADE PLATFORM",
    title: "India Center (Indijas Centrs)",
    client: "Indijas Centrs · Latvia",
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
  },
];

export const GrandSpatialDiscs: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<ProjectItem>(PROJECTS[0]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Vinyl platter tilt state
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    // Apply exact centering and straight flat zone
    const updateOrbitalCards = () => {
      const screenCenter = window.innerWidth / 2;
      // Generous flat zone (±20% of viewport width ~ 280px each side)
      const flatZone = window.innerWidth * 0.20;

      let closestIdx = 0;
      let minDistance = Infinity;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
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
          // IN THE VIEWING CENTER: 100% straight, zero slant, full opacity!
          rotateY = 0;
          translateZ = 0;
          scale = 1;
          opacity = 1;
        } else {
          // OUTSIDE THE FLAT ZONE: smoothly curve and slant away as it leaves/enters
          const excess = (absDist - flatZone) / (window.innerWidth * 0.40);
          const sign = distFromCenter > 0 ? 1 : -1;
          const t = Math.min(Math.max(excess, 0), 1.6);

          rotateY = sign * -22 * Math.min(t, 1);
          translateZ = -Math.pow(t, 1.3) * 120;
          scale = 1 - Math.min(t * 0.08, 0.16);
          opacity = 1 - Math.min(t * 0.28, 0.5);
        }

        card.style.transform = `perspective(1400px) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      });

      setActiveIdx(closestIdx);
    };

    // EXACT pixel offset calculation:
    // Distance from Card 1's offsetLeft to Card 4's offsetLeft!
    // Since Card 1 starts at center, translating by exactly -(card4 - card1)
    // guarantees Card 4 arrives at the EXACT SAME CENTER coordinate!
    const getExactScrollAmount = () => {
      const card1 = cardsRef.current[0];
      const card4 = cardsRef.current[cardsRef.current.length - 1];
      if (!card1 || !card4) return 0;
      return -(card4.offsetLeft - card1.offsetLeft);
    };

    const ctx = gsap.context(() => {
      // Immediate response: transit starts immediately at 0.0 with NO sluggish initial pause!
      // Card 4 reaches dead-center at 0.78, and holds dead-center until 1.00 (generous dwell buffer).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pin,
          start: "top top",
          end: "+=3200",
          scrub: 0.4, // Snappy, immediate scroll response
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            updateOrbitalCards();
          },
        },
      });

      // Horizontal track translation begins immediately
      tl.to(
        track,
        {
          x: getExactScrollAmount,
          ease: "none",
          duration: 0.78,
        },
        0
      );

      // Card 4 rest / dwell buffer (0.78 to 1.00)
      tl.to({}, { duration: 0.22 }, 0.78);
    }, section);

    // Initial update
    updateOrbitalCards();
    window.addEventListener("resize", updateOrbitalCards);

    return () => {
      window.removeEventListener("resize", updateOrbitalCards);
      ctx.revert();
    };
  }, []);

  const handlePlatterMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (-y / rect.height) * 16,
      y: (x / rect.width) * 16,
    });
  };

  const handlePlatterMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const openDossier = (project: ProjectItem) => {
    setSelectedDossier(project);
    setIsDossierOpen(true);
  };

  return (
    <section
      id="monument-exhibition"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
    >
      {/* Pinned Fullscreen Stage with Generous Top/Bottom Clearance below fixed Navbar */}
      <div
        ref={pinRef}
        className="h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-10 px-4 sm:px-12 relative overflow-hidden bg-transparent z-20"
      >
        {/* Pinned Top HUD Header (Safely below fixed navbar with ample air) */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto px-2 mb-2 sm:mb-4">
          <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#10B981]" />
            <span>02 / SELECTED WORK &amp; EXPERIENCES</span>
          </div>

          {/* Interactive Progress Scrub Indicator */}
          <div className="hidden md:flex items-center gap-4">
            <span className="font-sans font-black text-[11px] text-slate-400 uppercase tracking-wider">
              360° ORBITAL CAROUSEL
            </span>
            <div className="w-48 h-2 rounded-full bg-slate-200/80 p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] via-[#00FF87] to-[#10B981] transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-sans font-black text-xs text-[#0F172A]">
              0{activeIdx + 1} / 0{PROJECTS.length}
            </span>
          </div>

          <div className="font-sans font-black text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <ArrowRight size={14} className="text-[#10B981] animate-pulse" />
          </div>
        </div>

        {/* Horizontal Orbital 3D Track:
            Symmetrical padding ensures Card 1 starts exactly centered at 50vw */}
        <div className="relative z-10 my-auto w-full overflow-visible py-2">
          <div
            ref={trackRef}
            className="flex gap-8 sm:gap-14 items-center will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              paddingLeft: "calc((100vw - min(880px, 80vw)) / 2)",
              paddingRight: "calc((100vw - min(880px, 80vw)) / 2)",
            }}
          >
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                /* Premium Frosted Glassmorphism Card with safe vertical constraints */
                className="w-[82vw] max-w-[880px] shrink-0 p-6 sm:p-8 lg:p-10 rounded-[2.25rem] bg-white/75 border-2 border-white/90 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12),0_10px_25px_-5px_rgba(16,185,129,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:border-[#10B981]/50 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center will-change-transform max-h-[calc(100vh-210px)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Card Editorial Metadata (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between z-10">
                  <div>
                    {/* Catalogue Badge & Category */}
                    <div className="inline-flex items-center gap-2 font-sans font-black text-xs text-[#10B981] uppercase tracking-wider mb-2">
                      <Disc3 size={15} className="animate-spin" />
                      <span>{project.catalogueNo}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{project.category}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-[1.05] mb-1.5">
                      {project.title}
                    </h3>

                    {/* Client & Year */}
                    <div className="font-sans font-black text-xs text-slate-500 uppercase tracking-wider mb-2.5">
                      {project.client} · {project.year}
                    </div>

                    {/* Editorial Summary in Apple Garamond Light Italic */}
                    <p className="font-serif italic font-light text-sm sm:text-base text-slate-700 leading-relaxed mb-4 line-clamp-3 sm:line-clamp-none">
                      {project.summary}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2.5 border-y border-slate-200/80 mb-4 bg-white/40 rounded-xl px-4 backdrop-blur-xs">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                            {m.label}
                          </div>
                          <div className="font-sans font-black text-xs sm:text-sm text-[#0F172A]">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Social Icons for Latvian Cricket Federation */}
                    {project.socials && (
                      <div className="mb-4">
                        <div className="font-sans font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                          OFFICIAL CHANNELS &amp; SOCIALS:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {project.socials.map((s) => (
                            <button
                              key={s.name}
                              title={s.name}
                              className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#10B981] text-slate-700 hover:text-white border border-slate-200/90 shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer p-2"
                            >
                              <svg
                                viewBox={s.viewBox || "0 0 24 24"}
                                fill="currentColor"
                                className="w-3.5 h-3.5 fill-current"
                              >
                                <path d={s.svgPath} />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row with DIRECT CLICKABLE LINKS */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {/* Primary Clickable Live URL */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0F172A] hover:bg-[#10B981] text-white font-sans font-black text-xs uppercase tracking-wider shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <span>Visit {new URL(project.url).hostname.replace("www.", "")}</span>
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {/* Interactive 278-Key Lab Demo Button for IZIEAT */}
                    {project.hasDemo && (
                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#10B981]/15 hover:bg-[#10B981] text-[#059669] hover:text-white border border-[#10B981]/30 font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Sparkles size={14} />
                        <span>Launch 278-Key Lab</span>
                      </button>
                    )}

                    {/* Full Technical Dossier Modal */}
                    <button
                      onClick={() => openDossier(project)}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/80 hover:bg-slate-100 text-[#0F172A] border border-slate-200/90 font-sans font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Eye size={14} />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Right Interactive Visual Stage (5 Cols) with Glassmorphic Pod */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                  {/* Visual 1: 3D Turntable Vinyl (IZIEAT) */}
                  {project.visualType === "turntable" && project.discImage && (
                    <div
                      className="relative w-52 h-52 sm:w-64 sm:h-64 transition-transform duration-200 ease-out flex items-center justify-center cursor-pointer select-none p-3 rounded-3xl bg-white/40 border border-white/60 shadow-inner"
                      style={{
                        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                      }}
                      onMouseMove={handlePlatterMouseMove}
                      onMouseLeave={handlePlatterMouseLeave}
                      onClick={() => setIsDemoOpen(true)}
                    >
                      <div className="absolute inset-3 rounded-full bg-slate-900 border-2 border-white/40 shadow-xl" />
                      <Image
                        src={project.discImage}
                        alt={project.title}
                        width={280}
                        height={280}
                        priority
                        className="relative w-full h-full object-contain filter drop-shadow-2xl animate-spin-slow hover:scale-105 transition-transform duration-500"
                        style={{ animationDuration: "22s" }}
                      />
                      <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-2 border-white shadow-md flex items-center justify-center pointer-events-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      </div>
                    </div>
                  )}

                  {/* Visual 2: Live Ingest Mesh & Telemetry (Latvian Cricket Federation) */}
                  {project.visualType === "cricket" && (
                    <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/80 border-2 border-white/90 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-[#10B981] animate-pulse" />
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                            CRICLV.COM ENGINE
                          </span>
                        </div>
                        <span className="font-sans font-black text-[10px] text-[#059669] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          LIVE
                        </span>
                      </div>

                      <div className="space-y-2 my-2.5 sm:my-3">
                        <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase mb-0.5">
                            TOURNAMENT EVENT BUS
                          </div>
                          <div className="font-sans font-black text-xs text-[#0F172A]">
                            National League Telemetry · Realtime Sync
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-[#059669] uppercase mb-0.5">
                            EU REGULATORY COMPLIANCE
                          </div>
                          <div className="font-sans font-black text-xs text-[#059669]">
                            Federation Governance Records · Verified
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="font-sans font-black text-[10px] text-slate-400 uppercase">
                          FAILOVER POOL: ACTIVE
                        </span>
                        <span className="font-sans font-black text-xs text-[#10B981]">
                          99.98% UPTIME
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual 3: Diplomatic Bilateral Bridge (India Center) */}
                  {project.visualType === "india_center" && (
                    <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/80 border-2 border-white/90 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-[#10B981]" />
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                            INDIJASCENTRS.LV
                          </span>
                        </div>
                        <span className="font-sans font-black text-[10px] text-sky-600 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                          LV / EN DUAL
                        </span>
                      </div>

                      <div className="space-y-2 my-2.5 sm:my-3">
                        <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase mb-0.5">
                            BILATERAL DIPLOMATIC BRIDGE
                          </div>
                          <div className="font-sans font-black text-xs text-[#0F172A]">
                            India · Latvia Cultural &amp; Trade Portal
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-sky-700 uppercase mb-0.5">
                            CONSULAR SCHEDULING BUS
                          </div>
                          <div className="font-sans font-black text-xs text-sky-700">
                            Academic &amp; Cultural Event Dispatch Active
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="font-sans font-black text-[10px] text-slate-400 uppercase">
                          EDGE DISTRIBUTION
                        </span>
                        <span className="font-sans font-black text-xs text-[#10B981]">
                          &lt; 18ms LATENCY
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual 4: Global Commodity & Cross-Border Supply (Varti International) */}
                  {project.visualType === "varti" && (
                    <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/80 border-2 border-white/90 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <Ship size={16} className="text-[#10B981]" />
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                            VARTIINTERNATIONAL.COM
                          </span>
                        </div>
                        <span className="font-sans font-black text-[10px] text-[#059669] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          GLOBAL AGRO
                        </span>
                      </div>

                      <div className="space-y-2 my-2.5 sm:my-3">
                        <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase mb-0.5">
                            COMMODITY TRADING MATRIX
                          </div>
                          <div className="font-sans font-black text-xs text-[#0F172A]">
                            Automated Multi-Currency Export Pipeline
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="font-sans font-black text-[9px] sm:text-[10px] text-[#059669] uppercase mb-0.5">
                            BUYER VERIFICATION ENGINE
                          </div>
                          <div className="font-sans font-black text-xs text-[#059669]">
                            Cross-Border Compliance &amp; Freight Routing
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="font-sans font-black text-[10px] text-slate-400 uppercase">
                          SETTLEMENT CURRENCY
                        </span>
                        <span className="font-sans font-black text-xs text-[#10B981]">
                          EUR · USD · MULTI
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Bottom HUD Bar with card navigation indicators */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2 border-t border-slate-200/80 px-2">
          <div className="flex items-center gap-3">
            {PROJECTS.map((p, i) => (
              <span
                key={p.id}
                className={`transition-all duration-300 font-sans font-black text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
                  activeIdx === i
                    ? "text-[#10B981] font-black"
                    : "text-slate-400 font-medium"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeIdx === i ? "bg-[#10B981] scale-125" : "bg-slate-300"
                  }`}
                />
                <span className="hidden sm:inline">{p.title.split(" ")[0]}</span>
              </span>
            ))}
          </div>

          <div className="font-sans font-black text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider">
            SCROLL TO EXPLORE ALL 4 PROJECTS
          </div>
        </div>
      </div>

      {/* Interactive Translation Lab Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl">
            <button
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-6 right-6 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-sans font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              ✕ Exit Lab
            </button>
            <div className="mt-4">
              <LocalizationDemo />
            </div>
          </div>
        </div>
      )}

      {/* Full Technical Dossier Modal */}
      {isDossierOpen && selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl">
            <button
              onClick={() => setIsDossierOpen(false)}
              className="absolute top-6 right-6 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-sans font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              ✕ Exit
            </button>
            <div className="font-sans font-black text-xs text-[#10B981] mb-2 uppercase tracking-wider">
              {selectedDossier.catalogueNo}
            </div>
            <h3 className="font-sans font-black text-2xl text-[#0F172A] mb-3">
              {selectedDossier.title}
            </h3>
            <p className="font-serif italic font-light text-base text-slate-700 leading-relaxed mb-6">
              {selectedDossier.summary}
            </p>
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-sans font-black text-xs text-slate-500 uppercase tracking-wider">
                  DIRECT PORTAL:
                </span>
                <a
                  href={selectedDossier.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-black text-xs text-[#10B981] hover:underline flex items-center gap-1"
                >
                  <span>{selectedDossier.url}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div>
                <div className="font-sans font-black text-xs text-slate-500 uppercase tracking-wider mb-2">
                  CORE ARCHITECTURE STACK:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDossier.stack.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
