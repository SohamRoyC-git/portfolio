"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Disc3, Eye, ArrowLeft, ArrowRight, ExternalLink, Sparkles, Layers, Volume2, VolumeX } from "lucide-react";

interface DiscProject {
  id: string;
  catalogueNo: string;
  title: string;
  client: string;
  role: string;
  year: string;
  category: string;
  summary: string;
  discImage: string;
  rpm: string;
  color: string;
  accent: string;
  specs: {
    stack: string[];
    deliverables: string[];
    impact: string;
  };
}

const PROJECTS: DiscProject[] = [
  {
    id: "izieat",
    catalogueNo: "DISC-01 // AGRO-FOOD",
    title: "IZIEAT Export Portal",
    client: "IZIEAT LLC",
    role: "Lead Frontend & Localization Architect",
    year: "2024",
    category: "B2B Export Web Infrastructure",
    summary:
      "Enterprise portal for global sweet corn and frozen food exporter. Built with a 278-key zero-API instant English/Russian translation engine, wholesale spec sheets, and responsive packaging visualizers.",
    discImage: "/assets/disc_izieat.png",
    rpm: "33⅓ RPM",
    color: "#F97316",
    accent: "from-orange-500/30 to-amber-500/10",
    specs: {
      stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Client JSON Engine"],
      deliverables: ["Wholesale Portal", "Dual-Language Dictionary", "Product Catalog"],
      impact: "Zero-latency language switching (<5ms) across 278 verified business terms.",
    },
  },
  {
    id: "lcf",
    catalogueNo: "DISC-02 // SPORT-GOV",
    title: "Latvian Cricket Federation",
    client: "Latvian Cricket Federation (ICC Associate)",
    role: "Digital Operations & Brand Architect",
    year: "2024",
    category: "National Governing Body Portal",
    summary:
      "Modernized web presence and tournament records infrastructure for the governing authority of cricket in Latvia, establishing official registry for national squad members and international fixtures.",
    discImage: "/assets/disc_lcf.png",
    rpm: "45 RPM",
    color: "#991B1B",
    accent: "from-red-600/30 to-rose-900/10",
    specs: {
      stack: ["Web Platform", "Brand Guidelines", "Asset Optimization"],
      deliverables: ["Official Federation Identity", "Fixtures Calendar", "Player Registry"],
      impact: "Official digital governance for ICC associate member nation.",
    },
  },
  {
    id: "india-center",
    catalogueNo: "DISC-03 // DIPLOMATIC",
    title: "India Center Latvia",
    client: "Latvian India Center",
    role: "Full-Stack Web Architect",
    year: "2024",
    category: "Bilateral Trade & Cultural Portal",
    summary:
      "Cultural and commercial diplomacy platform connecting business ventures, academic exchanges, and diaspora initiatives between the Republic of Latvia and India.",
    discImage: "/assets/disc_indiacenter.png",
    rpm: "33⅓ RPM",
    color: "#D97706",
    accent: "from-amber-500/30 to-orange-800/10",
    specs: {
      stack: ["React", "Bilingual Navigation", "Responsive Editorial"],
      deliverables: ["Diplomatic Showcase", "Event Registry", "Cultural Resource Hub"],
      impact: "Bilateral resource hub for international students, investors, and diplomats.",
    },
  },
  {
    id: "varti",
    catalogueNo: "DISC-04 // GLOBAL-TRADE",
    title: "Varti International",
    client: "Varti International Trade",
    role: "Web & Sourcing Operations Designer",
    year: "2024",
    category: "Intercontinental Supply Chain",
    summary:
      "High-density trade and commodity logistics portal. Streamlined verified supplier inquiries, regulatory customs checklists, and worldwide freight transit routing.",
    discImage: "/assets/disc_varti.png",
    rpm: "45 RPM",
    color: "#2563EB",
    accent: "from-blue-600/30 to-indigo-900/10",
    specs: {
      stack: ["Next.js", "Supply Chain Architecture", "Performance Optimization"],
      deliverables: ["Corporate Sourcing Portal", "Inquiry Workflow", "Logistics Map"],
      impact: "Unified intercontinental freight inquiries and verified sourcing routes.",
    },
  },
];

export const PutureDiscStage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentProject = PROJECTS[activeIndex];

  // 3D Mouse Parallax Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <section
      id="chapter-showcase"
      className="relative min-h-screen py-28 px-6 lg:px-16 z-10 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Chapter Marker */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 w-fit">
        <span className="w-2 h-2 rounded-full bg-[#F97316]" />
        <span className="font-mono text-xs text-slate-300">03 / SPATIAL VINYL EXHIBITION</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-xs text-[#F97316]">3D OBJECT STAGE</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="font-sans font-bold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
            Interactive Vinyl <br />
            <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-white bg-clip-text text-transparent">
              Catalogue & Artifacts
            </span>
          </h2>
          <p className="font-sans text-base sm:text-lg text-slate-400 max-w-xl mt-3">
            Tangible 3D object physics. Each disc represents a production deployment engineered with precision.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-[#12141A] border border-white/10 hover:border-[#F97316] text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous Disc"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="font-mono text-sm text-slate-300">
            {activeIndex + 1} / {PROJECTS.length}
          </div>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-[#12141A] border border-white/10 hover:border-[#F97316] text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next Disc"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Main 3D Spatial Vinyl Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative p-8 sm:p-14 rounded-3xl bg-[#12141A]/90 border border-white/[0.12] backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]"
      >
        {/* Left Editorial Metadata (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-[#F97316] mb-4">
              <Disc3 size={13} className="animate-spin" />
              <span>{currentProject.catalogueNo}</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-400">{currentProject.rpm}</span>
            </div>

            <h3 className="font-sans font-bold text-3xl sm:text-4xl text-white mb-2">
              {currentProject.title}
            </h3>

            <div className="font-mono text-xs text-slate-400 mb-6">
              Client: <span className="text-white font-medium">{currentProject.client}</span> ({currentProject.year})
            </div>

            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              {currentProject.summary}
            </p>

            <div className="space-y-2 mb-8">
              <div className="font-mono text-xs text-[#F97316]">DELIVERABLES & IMPACT:</div>
              <div className="text-xs text-slate-300 font-sans">
                {currentProject.specs.impact}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDossierOpen(true)}
            className="w-fit px-6 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-sans text-xs font-semibold shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye size={14} />
            <span>Open Technical Dossier</span>
          </button>
        </div>

        {/* Right 3D Rotating Vinyl Disc (7 cols) */}
        <div className="lg:col-span-7 flex items-center justify-center relative perspective-[1200px]">
          <div
            className="relative w-72 h-72 sm:w-96 sm:h-96 transition-transform duration-300 ease-out flex items-center justify-center cursor-pointer"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            onClick={handleNext}
          >
            {/* Ambient Glow */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentProject.accent} blur-3xl opacity-70`} />

            {/* Turntable Platter Shadow */}
            <div className="absolute inset-4 rounded-full bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)]" />

            {/* Physical 3D Spinning Vinyl Record */}
            <Image
              src={currentProject.discImage}
              alt={currentProject.title}
              width={384}
              height={384}
              priority
              className="relative w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] animate-spin-slow hover:scale-105 transition-transform duration-500"
              style={{
                animationDuration: isHovered ? "12s" : "24s",
              }}
            />

            {/* Center Spindle Metal Accent */}
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border border-white/50 shadow-inner flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0A0B0E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Disc Scrubber Timeline Bar */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {PROJECTS.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => setActiveIndex(idx)}
            className={`p-3 rounded-xl border transition-all text-left cursor-pointer ${
              activeIndex === idx
                ? "bg-[#12141A] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.3)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400"
            }`}
          >
            <div className="font-mono text-[10px] text-[#F97316] font-bold">0{idx + 1}</div>
            <div className="font-sans text-xs font-semibold text-white truncate">
              {proj.title}
            </div>
          </button>
        ))}
      </div>

      {/* Technical Dossier Modal */}
      {isDossierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0D0E14] border border-white/20 p-8 shadow-2xl">
            <button
              onClick={() => setIsDossierOpen(false)}
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
            >
              ✕ Close
            </button>

            <div className="font-mono text-xs text-[#F97316] mb-1">
              ARCHIVE DOSSIER // {currentProject.catalogueNo}
            </div>
            <h3 className="font-sans text-3xl font-bold text-white mb-4">
              {currentProject.title}
            </h3>

            <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
              {currentProject.summary}
            </p>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <div className="font-mono text-xs text-slate-400 mb-2">TECHNOLOGY STACK:</div>
                <div className="flex flex-wrap gap-2">
                  {currentProject.specs.stack.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-slate-400 mb-2">KEY DELIVERABLES:</div>
                <div className="flex flex-wrap gap-2">
                  {currentProject.specs.deliverables.map((d) => (
                    <span key={d} className="px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-xs font-sans text-[#F97316]">
                      {d}
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
