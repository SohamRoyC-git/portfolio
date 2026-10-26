"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Disc3, ExternalLink, Play, RotateCw, ShieldCheck, Sparkles, X, ChevronDown } from "lucide-react";
import { PROJECTS } from "@/data/portfolioData";
import { LocalizationDemo } from "./LocalizationDemo";

interface DiscItem {
  id: string;
  title: string;
  client: string;
  role: string;
  year: string;
  category: string;
  discImage: string;
  accentColor: string;
  accentBg: string;
  deliverables: string;
  specs: { label: string; value: string }[];
  summary: string;
  projectRefId: string;
}

const DISCS: DiscItem[] = [
  {
    id: "izieat",
    title: "IZIEAT",
    client: "IZIEAT Private Limited (Agricultural Export)",
    role: "Website Developer",
    year: "2026",
    category: "Frontend Engineering & Client-Side i18n",
    discImage: "/assets/disc_izieat.png",
    accentColor: "#F97316",
    accentBg: "rgba(249, 115, 22, 0.12)",
    deliverables: "278 Structured Keys • Zero External API Latency",
    specs: [
      { label: "ROLE", value: "Website Developer" },
      { label: "PERIOD", value: "Aug 2026 – Present" },
      { label: "KEY INNOVATION", value: "200+ Key Client-Side Translation Engine" },
      { label: "AGRONOMY DOMAIN", value: "IQF Sweet Corn • Blast Freeze -38°C" },
      { label: "LATENCY OVERHEAD", value: "0ms Deterministic DOM Hydration" },
    ],
    summary:
      "Engineered a production-ready business website for a sweet corn export enterprise. Built a custom-coded client-side localization architecture containing 278 translation keys, eliminating recurring per-character API translation costs and third-party latency.",
    projectRefId: "izieat-localization",
  },
  {
    id: "lcf",
    title: "Latvian Cricket",
    client: "Latvian Cricket Federation (National Governing Body)",
    role: "Digital Operations Manager",
    year: "2025–2026",
    category: "Sports Administration & Digital Operations",
    discImage: "/assets/disc_lcf.png",
    accentColor: "#2563EB",
    accentBg: "rgba(37, 99, 235, 0.12)",
    deliverables: "Riga Premier League & Baltic Cup Digital Platforms",
    specs: [
      { label: "ROLE", value: "Digital Operations Manager" },
      { label: "PERIOD", value: "Oct 2025 – Present" },
      { label: "ORGANIZATION", value: "Latvian Cricket Federation" },
      { label: "TOURNAMENTS", value: "Riga Premier League (RPL) & Baltic Cup" },
      { label: "WORKFLOW", value: "Digital Asset Pipelines & Schedule Coordination" },
    ],
    summary:
      "Directing cross-border digital platforms, tournament scheduling workflows, and official branding dissemination for the national cricket governing body in Latvia.",
    projectRefId: "lcf-digital-platform",
  },
  {
    id: "indiacenter",
    title: "India Center",
    client: "India Center Bilateral Cultural Platform",
    role: "Website Development & Digital Operations",
    year: "2026",
    category: "Web Infrastructure & Digital Maintenance",
    discImage: "/assets/disc_indiacenter.png",
    accentColor: "#DC2626",
    accentBg: "rgba(220, 38, 38, 0.12)",
    deliverables: "DNS, Hosting Records & Cultural Showcase Deployments",
    specs: [
      { label: "ROLE", value: "Website Development & Digital Operations" },
      { label: "PERIOD", value: "Mar 2026 – Present" },
      { label: "INFRASTRUCTURE", value: "Domain, DNS Records & Hosting Resolution" },
      { label: "HIGH VISIBILITY", value: "India Day Cultural Event Deployments" },
      { label: "RESPONSIVENESS", value: "Cross-Device Layout Audits & Stability" },
    ],
    summary:
      "Managing end-to-end website infrastructure, DNS propagation troubleshooting, hosting stability, and rapid deployment of bilateral cultural event landing pages.",
    projectRefId: "india-center-platform",
  },
  {
    id: "varti",
    title: "Varti International",
    client: "Varti International Trade & Export",
    role: "Website Designer",
    year: "2026",
    category: "UI Architecture & Global Trade Layouts",
    discImage: "/assets/disc_varti.png",
    accentColor: "#0F172A",
    accentBg: "rgba(15, 23, 42, 0.12)",
    deliverables: "Global Trade Route Corridors & Intuitive Navigation",
    specs: [
      { label: "ROLE", value: "Website Designer" },
      { label: "PERIOD", value: "Apr 2026 – Aug 2026" },
      { label: "FOCUS", value: "B2B Trade Route Map Visualizations" },
      { label: "INFORMATION ARCH", value: "Structured Commodity Product Hierarchies" },
      { label: "GRID SYSTEM", value: "Modular Responsive Multi-Column Framework" },
    ],
    summary:
      "Designed structured page layouts and visual hierarchy for international commodity commerce. Engineered custom global trade route maps and intuitive inquiry flows.",
    projectRefId: "varti-international-design",
  },
];

export const A24DiscShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [indexMenuOpen, setIndexMenuOpen] = useState(false);

  // 3D tilt tracking on disc
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const discRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDisc = DISCS[activeIndex];

  // Ambient spin
  useEffect(() => {
    let animId: number;
    let angle = rotationAngle;
    const animate = () => {
      if (isRotating) {
        angle = (angle + 0.25) % 360;
        setRotationAngle(angle);
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isRotating, rotationAngle]);

  // Handle scroll navigation inside showcase section
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 35) {
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % DISCS.length);
    setRotationAngle((prev) => prev + 90);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + DISCS.length) % DISCS.length);
    setRotationAngle((prev) => prev - 90);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!discRef.current) return;
    const rect = discRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 22,
      y: (x / rect.width) * 22,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="experience-canvas"
      ref={containerRef}
      onWheel={handleWheel}
      className="relative min-h-screen bg-[#FAF9F6] border-y border-[#E9E7E3] flex flex-col justify-between overflow-hidden select-none py-12"
    >
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(#202124 0.65px, transparent 0.65px),
            linear-gradient(to right, #E9E7E3 1px, transparent 1px),
            linear-gradient(to bottom, #E9E7E3 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px, 128px 128px, 128px 128px",
        }}
      />

      {/* Top Experience Navigation Bar (A24-style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span>EXHIBITION STAGE</span>
          </span>
          <span className="text-[#E9E7E3]">/</span>
          <span className="font-mono text-xs text-[#202124] font-semibold">
            THE PHYSICAL ARTIFACTS
          </span>
        </div>

        {/* Dropdown Index (A24 "Index" style) */}
        <div className="relative">
          <button
            onClick={() => setIndexMenuOpen(!indexMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9E7E3] hover:border-[#202124] text-xs font-mono transition-colors shadow-xs"
          >
            <span>Catalogue Index</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${indexMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {indexMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E9E7E3] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 text-[10px] font-mono uppercase text-[#6B6B6B] border-b border-[#E9E7E3]">
                Artifact Selection
              </div>
              <div className="space-y-1 mt-1">
                {DISCS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      setIndexMenuOpen(false);
                      setRotationAngle((a) => a + 120);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-mono transition-all ${
                      activeIndex === idx
                        ? "bg-[#202124] text-white"
                        : "hover:bg-[#FAF9F6] text-[#202124]"
                    }`}
                  >
                    <span className="font-sans font-medium">{item.title}</span>
                    <span className="text-[10px] opacity-70">{item.year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Spatial Stage (Left: Metadata, Center/Right: 3D Disc) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Synchronized Editorial Metadata (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Counter */}
            <div className="font-mono text-xs text-[#F97316] font-bold tracking-wider mb-2 flex items-center gap-2">
              <span>0{activeIndex + 1} / 0{DISCS.length}</span>
              <span className="text-[#E9E7E3]">|</span>
              <span className="text-[#6B6B6B] uppercase font-normal">{activeDisc.category}</span>
            </div>

            {/* Title with split-text aesthetic */}
            <h2 className="font-sans font-bold text-4xl sm:text-6xl text-[#202124] tracking-tight leading-none mb-6">
              {activeDisc.title}
            </h2>

            {/* Hairline Divider */}
            <div className="w-full h-px bg-[#E9E7E3] mb-5" />

            {/* Key Specifications Grid (A24-style) */}
            <div className="space-y-3 mb-6">
              {activeDisc.specs.map((spec, i) => (
                <div key={i} className="flex items-baseline justify-between text-xs pb-2 border-b border-[#E9E7E3]/60">
                  <span className="font-mono text-[10px] uppercase text-[#6B6B6B] tracking-wider">
                    {spec.label}
                  </span>
                  <span className="font-sans font-semibold text-[#202124] text-right max-w-[260px] truncate">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Summary */}
            <p className="font-sans text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mb-6">
              {activeDisc.summary}
            </p>

            {/* Actions: Explore Case Study & Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#202124] hover:bg-[#F97316] text-white font-mono text-xs font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Explore Dossier</span>
                <ExternalLink size={13} />
              </button>

              <button
                onClick={() => setIsRotating(!isRotating)}
                className="w-10 h-10 rounded-full bg-white border border-[#E9E7E3] text-[#202124] hover:border-[#202124] flex items-center justify-center transition-colors shadow-xs"
                title={isRotating ? "Pause Spin" : "Resume Spin"}
              >
                <RotateCw size={14} className={isRotating ? "animate-spin text-[#F97316]" : ""} />
              </button>
            </div>
          </div>

          {/* Right Column: Physical 3D Spinning Vinyl Disc (7 cols) */}
          <div
            className="lg:col-span-7 flex items-center justify-center relative perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Center Stage Glowing Pedestal */}
            <div
              className="absolute w-[440px] h-[440px] rounded-full filter blur-3xl opacity-30 transition-all duration-700 pointer-events-none"
              style={{ backgroundColor: activeDisc.accentColor }}
            />

            {/* 3D Vinyl Disc Object */}
            <div
              ref={discRef}
              className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[500px] lg:h-[500px] cursor-grab active:cursor-grabbing transition-transform duration-150 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
              }}
              onClick={goToNext}
              title="Click or scroll to advance disc"
            >
              {/* Disc Drop Shadow */}
              <div
                className="absolute inset-4 rounded-full filter blur-2xl opacity-40 transition-all duration-500"
                style={{
                  backgroundColor: "#000000",
                  transform: `translate3d(0, 30px, -50px)`,
                }}
              />

              {/* The Spinning Vinyl Disc */}
              <div
                className="w-full h-full relative"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: isRotating ? "none" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <Image
                  src={activeDisc.discImage}
                  alt={`${activeDisc.title} 3D Physical Disc`}
                  fill
                  priority
                  sizes="(max-width: 768px) 340px, (max-width: 1200px) 460px, 500px"
                  className="object-contain drop-shadow-2xl select-none pointer-events-none"
                />
              </div>

              {/* Center Holographic Glint (Non-rotating) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%, rgba(249,115,22,0.12) 70%, rgba(255,255,255,0.15) 100%)",
                }}
              />

              {/* Floating Interaction Hint */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/95 backdrop-blur-xs border border-[#E9E7E3] rounded-full text-[11px] font-mono text-[#6B6B6B] shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                <Disc3 size={12} className="text-[#F97316]" />
                <span>Scroll wheel or click to spin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Scrubber (A24-style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="bg-white rounded-2xl border border-[#E9E7E3] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] hover:border-[#202124] text-[#202124] flex items-center justify-center transition-colors"
              aria-label="Previous Disc"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={goToNext}
              className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] hover:border-[#202124] text-[#202124] flex items-center justify-center transition-colors"
              aria-label="Next Disc"
            >
              <ArrowRight size={14} />
            </button>
            <div className="font-mono text-xs text-[#202124] font-semibold ml-2">
              DISC {activeIndex + 1} OF {DISCS.length}
            </div>
          </div>

          {/* Scrubber Timeline Bar */}
          <div className="flex-1 max-w-md w-full flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#6B6B6B]">01</span>
            <div className="flex-1 h-1.5 bg-[#FAF9F6] rounded-full border border-[#E9E7E3] relative overflow-hidden">
              <div
                className="h-full bg-[#F97316] rounded-full transition-all duration-300"
                style={{
                  width: `${((activeIndex + 1) / DISCS.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#6B6B6B]">04</span>
          </div>

          {/* Active Deliverable Tag */}
          <div className="font-mono text-[11px] text-[#202124] bg-[#FAF9F6] px-3 py-1 rounded-lg border border-[#E9E7E3] truncate max-w-xs">
            {activeDisc.deliverables}
          </div>
        </div>
      </div>

      {/* ============================================================
          CASE STUDY DOSSIER MODAL
         ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202124]/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#E9E7E3] shadow-2xl overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FFFFFF]/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-[#E9E7E3] flex items-center justify-between z-10">
              <div>
                <span className="font-mono text-xs text-[#F97316] font-bold uppercase tracking-wider">
                  Case Study Dossier • {activeDisc.year}
                </span>
                <h3 className="font-sans font-bold text-2xl text-[#202124]">
                  {activeDisc.title} — {activeDisc.role}
                </h3>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] text-[#202124] hover:bg-[#202124] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* If IZIEAT, show live localization demonstration */}
              {activeDisc.id === "izieat" && (
                <div>
                  <div className="font-mono text-xs uppercase text-[#F97316] font-bold mb-3 flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Embedded Demonstration: Client-Side Localization Engine</span>
                  </div>
                  <LocalizationDemo />
                </div>
              )}

              {/* Metadata specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-[#E9E7E3] text-xs font-mono">
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Client</div>
                  <div className="font-semibold text-[#202124]">{activeDisc.client}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Role</div>
                  <div className="font-semibold text-[#202124]">{activeDisc.role}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Timeline</div>
                  <div className="font-semibold text-[#202124]">{activeDisc.year}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Discipline</div>
                  <div className="font-semibold text-[#F97316]">{activeDisc.category}</div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#202124] font-bold mb-2">
                  Technical Architecture & Execution
                </h4>
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                  {activeDisc.summary}
                </p>
              </div>

              {/* Disc Artwork Preview */}
              <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#E9E7E3] flex flex-col items-center">
                <div className="font-mono text-[11px] uppercase text-[#6B6B6B] mb-4">
                  Official Artifact Disc
                </div>
                <div className="relative w-48 h-48 rounded-full shadow-lg">
                  <Image
                    src={activeDisc.discImage}
                    alt={activeDisc.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#FAF9F6] border-t border-[#E9E7E3] flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-[#202124] text-white font-mono text-xs font-medium rounded-full hover:bg-[#F97316] transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
