"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Globe, Shield, Sparkles } from "lucide-react";
import { LocalizationDemo } from "@/components/LocalizationDemo";

export const PutureWorkPillars: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  const pillars = [
    {
      id: "01",
      title: "IZIEAT — Global Agro-Food Enterprise Portal",
      category: "ENTERPRISE B2B • CROSS-BORDER LOCALIZATION",
      description:
        "Full digital platform for an international sweet corn and frozen food exporter. Built with a bespoke 278-key zero-API instant client-side English/Russian dictionary, wholesale spec sheets, and high-performance product visualizers.",
      tags: ["Next.js", "TypeScript", "Zero-API Translation", "Tailwind CSS", "Export Ops"],
      metrics: [
        { label: "Translation Keys", value: "278 Keys" },
        { label: "Switch Latency", value: "< 5ms" },
        { label: "Target Markets", value: "EU & CIS" },
      ],
      hasInteractiveDemo: true,
      image: "/assets/disc_izieat.png",
      logo: "/assets/izieat_main_logo.png",
    },
    {
      id: "02",
      title: "Latvian Cricket Federation & India Center",
      category: "NATIONAL SPORTING BODY • DIPLOMATIC PORTAL",
      description:
        "Digital web infrastructure for Latvia's national cricket governing body (ICC Associate member) and the associated India Center bilateral cultural exchange. Modernized team registries, match fixtures, and tournament announcements.",
      tags: ["Web Architecture", "ICC Associate", "Brand Identity", "Digital Operations"],
      metrics: [
        { label: "Governing Authority", value: "National Federation" },
        { label: "Jurisdiction", value: "Riga, Latvia (EU)" },
        { label: "Focus", value: "Operations & Governance" },
      ],
      hasInteractiveDemo: false,
      image: "/assets/disc_lcf.png",
      logo: "/assets/lcf_logo.png",
    },
    {
      id: "03",
      title: "Varti International Trade & Logistics",
      category: "GLOBAL SUPPLY CHAIN • EXPORT NETWORKS",
      description:
        "Commercial web presence for a global export and trade conglomerate. Designed with high-density supplier verification workflows, regulatory compliance documentation, and clear buyer inquiries.",
      tags: ["B2B Architecture", "Supply Chain", "Global Trade", "Operations"],
      metrics: [
        { label: "Reach", value: "Intercontinental" },
        { label: "Sector", value: "Commodities & Trade" },
        { label: "Deliverables", value: "Portal & Inquiries" },
      ],
      hasInteractiveDemo: false,
      image: "/assets/disc_varti.png",
      logo: "/assets/varti_logo.png",
    },
  ];

  return (
    <section id="chapter-work" className="relative min-h-screen py-28 px-6 lg:px-16 z-10 max-w-7xl mx-auto">
      {/* Chapter Marker */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 w-fit">
        <span className="w-2 h-2 rounded-full bg-[#F97316]" />
        <span className="font-mono text-xs text-slate-300">02 / CORE PILLARS</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-xs text-[#F97316]">FEATURED WORK</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="font-sans font-bold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
            Selected Works & <br />
            <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-white bg-clip-text text-transparent">
              Digital Operations
            </span>
          </h2>
          <p className="font-sans text-base sm:text-lg text-slate-400 max-w-xl mt-4">
            Production software engineered for international trade, national governance, and high-performance digital scale.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#12141A] p-1.5 rounded-2xl border border-white/10 w-fit">
          {pillars.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeTab === idx
                  ? "bg-[#F97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p.id} {p.title.split("—")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Pillar Card Display */}
      {pillars.map((p, idx) => {
        if (idx !== activeTab) return null;

        return (
          <div
            key={p.id}
            className="p-8 sm:p-12 rounded-3xl bg-[#12141A]/90 border border-white/[0.12] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-500"
          >
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs font-bold text-[#F97316] px-2.5 py-1 rounded-md bg-[#F97316]/10 border border-[#F97316]/20">
                    PILLAR {p.id}
                  </span>
                  <span className="font-mono text-xs text-slate-400 tracking-wider">
                    {p.category}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-3xl sm:text-4xl text-white mb-4">
                  {p.title}
                </h3>

                <p className="font-sans text-base text-slate-300 leading-relaxed mb-8">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-mono text-xs text-slate-400 mb-0.5">{m.label}</div>
                      <div className="font-sans text-sm sm:text-base font-bold text-white">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                {p.hasInteractiveDemo && (
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="px-6 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-sans text-xs font-semibold shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Test 278-Key Live Translation Lab</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Visual Vinyl/Preview Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F97316]/20 to-transparent blur-2xl group-hover:blur-3xl transition-all" />
                <Image
                  src={p.image}
                  alt={p.title}
                  width={320}
                  height={320}
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.8)] animate-spin-slow hover:scale-105 transition-transform duration-500"
                  style={{ animationDuration: "25s" }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Interactive Translation Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D0E14] border border-white/20 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
            >
              ✕ Close Lab
            </button>
            <div className="mt-4">
              <LocalizationDemo />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
