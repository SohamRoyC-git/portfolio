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
  Globe,
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
  previewImage?: string;
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
    visualType: "izieat",
    logo: "/assets/logos/izieat.png",
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
  },
];

export const GrandSpatialDiscs: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierProject, setDossierProject] = useState<ProjectItem | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const horizontalTrackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = horizontalTrackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const getScrollDist = () => track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              PROJECTS.length - 1,
              Math.floor(self.progress * PROJECTS.length)
            );
            setActiveIdx(idx);
          },
        },
      });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0.85, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 85%",
              end: "center center",
              scrub: true,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full min-h-screen z-10 select-none overflow-hidden"
    >
      {/* Editorial Chapter Header */}
      <div className="absolute top-6 sm:top-12 left-6 sm:left-16 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-sans font-black text-[11px] sm:text-xs text-[#10B981] uppercase tracking-[0.25em]">
            SECTION 02 // WORK DIRECTORY
          </span>
        </div>
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-none mb-1">
          SELECTED COMMISSIONS
        </h2>
        <p className="font-serif italic font-light text-base sm:text-xl text-slate-500">
          Global trade portals, national sport engines &amp; institutional platforms
        </p>
      </div>

      {/* Progress & Quick Nav Indicator */}
      <div className="absolute top-8 sm:top-14 right-6 sm:right-16 z-20 hidden md:flex items-center gap-3 bg-white/70 backdrop-blur-xl px-4 py-2 rounded-full border border-slate-200/80 shadow-sm">
        <span className="font-sans font-black text-xs text-slate-400">INDEX</span>
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              const card = cardsRef.current[i];
              if (card) {
                card.scrollIntoView({ behavior: "smooth", inline: "center" });
              }
            }}
            className={`font-sans font-black text-xs transition-colors ${
              activeIdx === i ? "text-[#10B981]" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            0{i + 1}
          </button>
        ))}
      </div>

      {/* Horizontal Cards Stage */}
      <div className="h-screen flex items-center">
        <div
          ref={horizontalTrackRef}
          className="flex items-center gap-8 sm:gap-14 px-6 sm:px-16 pt-24 sm:pt-28 will-change-transform"
        >
          {PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              /* Responsive Frosted Glassmorphism Card with Mobile Scroll Guard */
              className="w-[86vw] max-w-[880px] shrink-0 p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.25rem] bg-white/80 border-2 border-white/95 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12),0_10px_25px_-5px_rgba(16,185,129,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:border-[#10B981]/50 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center will-change-transform max-h-[calc(100svh-140px)] overflow-y-auto sm:overflow-visible"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Left Card Editorial Metadata (7 Cols on desktop, full on mobile) */}
              <div className="lg:col-span-7 flex flex-col justify-between z-10">
                <div>
                  {/* Catalogue Badge & Category */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 font-sans font-black text-[10px] sm:text-xs text-[#10B981] uppercase tracking-wider mb-2">
                    <Disc3 size={14} className="animate-spin" />
                    <span>{project.catalogueNo}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate max-w-[150px] sm:max-w-none">
                      {project.category}
                    </span>
                  </div>

                  {/* Client Logo & Header Badge */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="h-11 px-2.5 py-1 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0">
                      <Image
                        src={project.logo}
                        alt={project.client}
                        width={75}
                        height={36}
                        className="object-contain max-h-8 w-auto"
                      />
                    </div>
                    <div>
                      <div className="font-sans font-black text-xs sm:text-sm text-[#0F172A] leading-tight">
                        {project.client}
                      </div>
                      <div className="font-sans font-medium text-[11px] text-slate-400">
                        Production Commission • {project.year}
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="font-sans font-black text-2xl xs:text-3xl sm:text-4xl text-[#0F172A] tracking-tight leading-[1.05] mb-2">
                    {project.title}
                  </h3>

                  {/* Editorial Summary in Apple Garamond Light Italic */}
                  <p className="font-serif italic font-light text-sm sm:text-base text-slate-700 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                    {project.summary}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl bg-white/70 border border-slate-200/70 mb-3 sm:mb-4 shadow-sm">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="text-left">
                        <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 truncate">
                          {m.label}
                        </div>
                        <div className="font-sans font-black text-xs sm:text-sm text-[#0F172A] truncate">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 font-sans font-black text-[10px] sm:text-[11px] text-slate-600 border border-slate-200/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Controls: View Site & Technical Dossier */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 border-t border-slate-200/80">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-sans font-black text-xs tracking-wider uppercase hover:bg-[#10B981] transition-colors shadow-sm"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink size={13} />
                  </a>

                  {project.hasDemo && (
                    <button
                      onClick={() => setIsDemoOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-500/30 font-sans font-black text-xs tracking-wider uppercase hover:bg-emerald-100 transition-colors"
                    >
                      <Sparkles size={13} />
                      <span>Interactive Demo</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDossierProject(project);
                      setIsDossierOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-sans font-black text-xs tracking-wider uppercase hover:text-[#0F172A] hover:border-slate-400 transition-colors"
                  >
                    <Eye size={13} />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>

              {/* Right Card Visual Artifact (5 Cols on desktop, full on mobile) */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                {/* Visual 1: Clickable Homepage Preview Card with IZIEAT Logo (IZIEAT) */}
                {project.visualType === "izieat" && project.previewImage && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/izieat block w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/85 border-2 border-white/95 p-3 sm:p-3.5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-[#10B981]/50 hover:shadow-2xl relative overflow-hidden"
                  >
                    {/* Browser window top bar */}
                    <div className="flex items-center justify-between pb-2 px-1 border-b border-slate-200/80 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 font-sans font-bold text-[10px] text-slate-500 border border-slate-200/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          izieat.com
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#10B981] group-hover/izieat:translate-x-0.5 group-hover/izieat:-translate-y-0.5 transition-transform duration-200">
                        <span className="font-sans font-black text-[9px] uppercase tracking-wider hidden xs:inline">
                          Visit Site
                        </span>
                        <ExternalLink size={12} />
                      </div>
                    </div>

                    {/* Rectangular homepage preview frame */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-inner">
                      <Image
                        src={project.previewImage}
                        alt="IZIEAT Homepage"
                        fill
                        className="object-cover object-top group-hover/izieat:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay indicator */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 group-hover/izieat:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-sans font-bold text-xs text-white flex items-center gap-1.5">
                            <ExternalLink size={13} className="text-emerald-400" />
                            Explore Live Portal
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-sans font-black text-[9px] uppercase tracking-wider">
                            Live ↗
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer badge with official IZIEAT Logo */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0">
                          <Image
                            src={project.logo}
                            alt="IZIEAT Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-sans font-black text-xs text-[#0F172A] leading-none mb-0.5">
                            IZIEAT LLC
                          </div>
                          <div className="font-sans font-medium text-[10px] text-slate-400">
                            Natural &amp; Ready To Eat
                          </div>
                        </div>
                      </div>
                      <span className="font-sans font-black text-[10px] text-[#059669] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        GLOBAL EXPORT
                      </span>
                    </div>
                  </a>
                )}

                {/* Visual 2: Live Ingest Mesh & Telemetry (Latvian Cricket Federation) */}
                {project.visualType === "cricket" && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cricket block w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/85 border-2 border-white/95 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#10B981]/50 hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0">
                          <Image
                            src={project.logo}
                            alt="Latvian Cricket Federation"
                            width={38}
                            height={38}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider block">
                            CRICLV.COM ENGINE
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-400">
                            Latvijas Kriketa Federācija
                          </span>
                        </div>
                      </div>
                      <span className="font-sans font-black text-[10px] text-[#059669] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    </div>

                    <div className="space-y-2 my-2.5">
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                        <div className="font-sans font-black text-[9px] text-slate-400 uppercase mb-0.5">
                          TOURNAMENT EVENT BUS
                        </div>
                        <div className="font-sans font-black text-xs text-[#0F172A]">
                          National League Telemetry • Realtime Sync
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="font-sans font-black text-[9px] text-[#059669] uppercase mb-0.5">
                          EU REGULATORY COMPLIANCE
                        </div>
                        <div className="font-sans font-black text-xs text-[#059669]">
                          Federation Governance Records • Verified
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span className="font-sans font-black text-[10px] text-slate-400 uppercase">
                        FAILOVER POOL: ACTIVE
                      </span>
                      <span className="font-sans font-black text-xs text-[#10B981] flex items-center gap-1">
                        99.98% UPTIME
                        <ExternalLink size={11} className="opacity-70 group-hover/cricket:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </a>
                )}

                {/* Visual 3: Diplomatic Bilateral Bridge (India Center) */}
                {project.visualType === "india_center" && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/india block w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/85 border-2 border-white/95 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#10B981]/50 hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0">
                          <Image
                            src={project.logo}
                            alt="India Center"
                            width={38}
                            height={38}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider block">
                            INDIJASCENTRS.LV
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-400">
                            Indijas Centrs • Latvia
                          </span>
                        </div>
                      </div>
                      <span className="font-sans font-black text-[10px] text-orange-600 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                        LV / EN DUAL
                      </span>
                    </div>

                    <div className="space-y-2 my-2.5">
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                        <div className="font-sans font-black text-[9px] text-slate-400 uppercase mb-0.5">
                          BILATERAL DIPLOMATIC BRIDGE
                        </div>
                        <div className="font-sans font-black text-xs text-[#0F172A]">
                          India • Latvia Cultural &amp; Trade Portal
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                        <div className="font-sans font-black text-[9px] text-orange-700 uppercase mb-0.5">
                          CONSULAR SCHEDULING BUS
                        </div>
                        <div className="font-sans font-black text-xs text-orange-700">
                          Academic &amp; Cultural Event Dispatch Active
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <span className="font-sans font-black text-[10px] text-slate-400 uppercase">
                        EDGE DISTRIBUTION
                      </span>
                      <span className="font-sans font-black text-xs text-[#10B981] flex items-center gap-1">
                        &lt; 18ms LATENCY
                        <ExternalLink size={11} className="opacity-70 group-hover/india:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </a>
                )}

                {/* Visual 4: Global Commodity & Cross-Border Supply (Varti International) */}
                {project.visualType === "varti" && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/varti block w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/85 border-2 border-white/95 p-4 sm:p-5 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#10B981]/50 hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="h-11 px-2.5 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0">
                          <Image
                            src={project.logo}
                            alt="Varti International"
                            width={90}
                            height={30}
                            className="object-contain max-h-8 w-auto"
                          />
                        </div>
                        <div>
                          <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider block">
                            VARTI INTERNATIONAL
                          </span>
                          <span className="font-sans font-medium text-[10px] text-slate-400">
                            Global Agro &amp; Commodity
                          </span>
                        </div>
                      </div>
                      <span className="font-sans font-black text-[10px] text-[#059669] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        EXPORT
                      </span>
                    </div>

                    <div className="space-y-2 my-2.5">
                      <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80">
                        <div className="font-sans font-black text-[9px] text-slate-400 uppercase mb-0.5">
                          COMMODITY TRADING MATRIX
                        </div>
                        <div className="font-sans font-black text-xs text-[#0F172A]">
                          Automated Multi-Currency Export Pipeline
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="font-sans font-black text-[9px] text-[#059669] uppercase mb-0.5">
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
                      <span className="font-sans font-black text-xs text-[#10B981] flex items-center gap-1">
                        EUR • USD • MULTI
                        <ExternalLink size={11} className="opacity-70 group-hover/varti:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 278-Key Instant Translation Dictionary Demo Modal */}
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="font-sans font-black text-xs text-[#10B981] uppercase tracking-wider">
                IZIEAT • Instant 278-Key Translation Engine
              </span>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#0F172A] hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>
            <LocalizationDemo />
          </div>
        </div>
      )}

      {/* Technical Architecture Dossier Modal */}
      {isDossierOpen && dossierProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setIsDossierOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 px-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center">
                  <Image
                    src={dossierProject.logo}
                    alt={dossierProject.client}
                    width={70}
                    height={30}
                    className="object-contain max-h-7 w-auto"
                  />
                </div>
                <div>
                  <span className="font-sans font-black text-xs text-[#10B981] uppercase tracking-wider block">
                    {dossierProject.catalogueNo}
                  </span>
                  <h4 className="font-sans font-black text-xl text-[#0F172A]">
                    {dossierProject.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#0F172A] hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <h5 className="font-sans font-black text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Executive Brief &amp; Architecture
                </h5>
                <p className="font-serif italic font-light text-slate-700 leading-relaxed text-sm sm:text-base">
                  {dossierProject.summary}
                </p>
              </div>

              <div>
                <h5 className="font-sans font-black text-xs text-slate-400 uppercase tracking-wider mb-2">
                  System Benchmarks
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  {dossierProject.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60"
                    >
                      <div className="font-sans font-black text-[9px] text-slate-400 uppercase mb-0.5">
                        {m.label}
                      </div>
                      <div className="font-sans font-black text-sm text-[#0F172A]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-sans font-black text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Engineering Stack
                </h5>
                <div className="flex flex-wrap gap-2">
                  {dossierProject.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-sans font-black text-xs border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <a
                href={dossierProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-sans font-black text-xs uppercase tracking-wider hover:bg-[#10B981] transition-colors"
              >
                <span>Launch Deployment</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
