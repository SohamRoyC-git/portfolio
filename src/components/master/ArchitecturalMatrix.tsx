"use client";

import React, { memo, useState } from "react";
import { Terminal, Layers } from "lucide-react";

export const ArchitecturalMatrix: React.FC = memo(() => {
  const [activeCodeTab, setActiveCodeTab] = useState<"dictionary" | "neural">("dictionary");

  return (
    <section
      id="monument-matrix"
      className="relative min-h-[90svh] py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 z-10 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Marker */}
      <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase mb-6 sm:mb-12 flex items-center gap-3">
        <span className="w-6 sm:w-8 h-[2px] bg-[#10B981]" />
        <span>03 / BLUEPRINT</span>
      </div>

      <div className="mb-8 sm:mb-12">
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-[#0F172A] max-md:text-white tracking-tight leading-[1.08] mb-2">
          Technical Matrix
        </h2>
        <p className="font-serif italic font-light text-base sm:text-xl text-slate-700 max-md:text-slate-300 max-w-xl">
          Core engineering engines, algorithm architecture, and production stacks.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Bento 1: Live Code Telemetry (7 cols) */}
        <div 
          className="lg:col-span-7 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/75 max-md:bg-[#0B0F17]/90 border border-slate-200/80 max-md:border-white/10 backdrop-blur-2xl shadow-sm flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="CODE"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-200/80 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Terminal size={16} className="text-[#10B981]" />
                <span className="font-sans font-black text-[11px] sm:text-xs text-[#0F172A] max-md:text-white uppercase tracking-wider">
                  SYSTEM CORE ENGINE
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setActiveCodeTab("dictionary")}
                  className={`px-2.5 sm:px-3 py-1 rounded-full font-sans font-black text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    activeCodeTab === "dictionary"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-black"
                  }`}
                >
                  278-Key Engine
                </button>
                <button
                  onClick={() => setActiveCodeTab("neural")}
                  className={`px-2.5 sm:px-3 py-1 rounded-full font-sans font-black text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    activeCodeTab === "neural"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-black"
                  }`}
                >
                  AI Pipeline
                </button>
              </div>
            </div>

            {/* Code Block in Inter Sans */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 font-sans text-[11px] sm:text-xs text-slate-200 leading-relaxed overflow-x-auto shadow-inner">
              {activeCodeTab === "dictionary" ? (
                <pre className="font-sans text-slate-300">
                  <span className="text-[#10B981] font-bold">{"// Zero-API In-Memory Localization Dictionary\n"}</span>
                  <span className="text-sky-400 font-semibold">export const</span> lookupTerm = (
                  <span className="text-amber-400">key: string</span>,{" "}
                  <span className="text-amber-400">lang: &quot;en&quot; | &quot;ru&quot;</span>
                  ): <span className="text-emerald-400 font-bold">string</span> =&gt; &#123;{"\n"}
                  {"  "}const term = DICTIONARY_STORE[key];{"\n"}
                  {"  "}<span className="text-sky-400 font-semibold">if</span> (!term) return key;{"\n"}
                  {"  "}<span className="text-slate-400">{"// Sub-5ms lookup, zero network overhead\n"}</span>
                  {"  "}return term[lang] || term.en;{"\n"}
                  &#125;;
                </pre>
              ) : (
                <pre className="font-sans text-slate-300">
                  <span className="text-[#10B981] font-bold">{"// AI & ML Algorithmic Processing Engine\n"}</span>
                  <span className="text-sky-400 font-semibold">class</span> SpatialFeatureExtractor(
                  <span className="text-amber-400">nn.Module</span>
                  ):{"\n"}
                  {"  "}def __init__(self, in_features=128, out_features=64):{"\n"}
                  {"    "}super().__init__(){"\n"}
                  {"    "}self.dense = nn.Linear(in_features, out_features){"\n"}
                  {"    "}self.activation = nn.GELU(){"\n"}
                  {"    "}self.norm = nn.LayerNorm(out_features)
                </pre>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200/80 max-md:border-white/10 mt-4 sm:mt-6">
            <div>
              <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">SPEED</div>
              <div className="font-sans font-black text-sm sm:text-base text-[#0F172A] max-md:text-white">&lt; 5ms</div>
            </div>
            <div>
              <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">OVERHEAD</div>
              <div className="font-sans font-black text-sm sm:text-base text-[#0F172A] max-md:text-white">0 API Calls</div>
            </div>
            <div>
              <div className="font-sans font-black text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">FOOTPRINT</div>
              <div className="font-sans font-black text-sm sm:text-base text-[#0F172A] max-md:text-white">48 KB Gzip</div>
            </div>
          </div>
        </div>

        {/* Bento 2: Toolkit (5 cols) */}
        <div 
          className="lg:col-span-5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/75 max-md:bg-[#0B0F17]/90 border border-slate-200/80 max-md:border-white/10 backdrop-blur-2xl shadow-sm flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="STACK"
        >
          <div>
            <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-slate-200/80 mb-4 sm:mb-6">
              <Layers size={16} className="text-[#10B981]" />
              <span className="font-sans font-black text-[11px] sm:text-xs text-[#0F172A] max-md:text-white uppercase tracking-wider">
                PRODUCTION TOOLKIT
              </span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <div className="font-sans font-black text-[10px] text-[#10B981] uppercase tracking-wider mb-2">
                  FRONTEND & MOTION
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "GSAP 3", "Lenis Scroll"].map((t) => (
                    <span key={t} className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 max-md:bg-[#161F30] border border-slate-200 max-md:border-white/10 font-sans font-black text-[11px] sm:text-xs text-[#0F172A] max-md:text-slate-200 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-sans font-black text-[10px] text-sky-600 uppercase tracking-wider mb-2">
                  SYSTEMS & LANGUAGES
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["Python", "JavaScript (ES6+)", "C / C++", "SQL", "REST APIs"].map((t) => (
                    <span key={t} className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 max-md:bg-[#161F30] border border-slate-200 max-md:border-white/10 font-sans font-black text-[11px] sm:text-xs text-[#0F172A] max-md:text-slate-200 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-sans font-black text-[10px] text-emerald-600 uppercase tracking-wider mb-2">
                  ENVIRONMENT
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["Git & GitHub", "Turbopack", "Linux / POSIX", "Vercel Edge"].map((t) => (
                    <span key={t} className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 max-md:bg-[#161F30] border border-slate-200 max-md:border-white/10 font-sans font-black text-[11px] sm:text-xs text-[#0F172A] max-md:text-slate-200 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ArchitecturalMatrix.displayName = "ArchitecturalMatrix";
