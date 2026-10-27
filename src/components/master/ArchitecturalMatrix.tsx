"use client";

import React, { useState } from "react";
import { Layers, Terminal } from "lucide-react";

export const ArchitecturalMatrix: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<"dictionary" | "neural">("dictionary");

  return (
    <section
      id="monument-matrix"
      className="relative min-h-screen py-32 px-6 sm:px-12 z-10 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Chapter Marker */}
      <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase mb-4 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-[#10B981]" />
        <span>03 / BLUEPRINT</span>
      </div>

      <div className="mb-12">
        <h2 className="font-sans font-black text-4xl sm:text-6xl text-[#0F172A] tracking-tight leading-[1.05] mb-2">
          Technical Matrix
        </h2>
        <p className="font-serif italic font-light text-lg sm:text-xl text-slate-700 max-w-xl">
          Core engineering engines, algorithm architecture, and production stacks.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bento 1: Live Code Telemetry (7 cols) */}
        <div 
          className="lg:col-span-7 p-8 rounded-3xl bg-white/75 border border-slate-200/80 backdrop-blur-2xl shadow-sm flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="CODE"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-[#10B981]" />
                <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                  SYSTEM CORE ENGINE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCodeTab("dictionary")}
                  className={`px-3 py-1 rounded-full font-sans font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    activeCodeTab === "dictionary"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-black"
                  }`}
                >
                  278-Key Engine
                </button>
                <button
                  onClick={() => setActiveCodeTab("neural")}
                  className={`px-3 py-1 rounded-full font-sans font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
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
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed overflow-x-auto shadow-inner">
              {activeCodeTab === "dictionary" ? (
                <pre className="font-sans text-slate-300">
                  <span className="text-[#10B981] font-bold">// Zero-API In-Memory Localization Dictionary</span>{"\n"}
                  <span className="text-sky-400 font-semibold">export const</span> lookupTerm = (
                  <span className="text-amber-400">key: string</span>,{" "}
                  <span className="text-amber-400">lang: &quot;en&quot; | &quot;ru&quot;</span>
                  ): <span className="text-emerald-400 font-bold">string</span> =&gt; &#123;{"\n"}
                  {"  "}const term = DICTIONARY_STORE[key];{"\n"}
                  {"  "}<span className="text-sky-400 font-semibold">if</span> (!term) return key;{"\n"}
                  {"  "}<span className="text-slate-400">// Sub-5ms lookup, zero network overhead</span>{"\n"}
                  {"  "}return term[lang] || term.en;{"\n"}
                  &#125;;
                </pre>
              ) : (
                <pre className="font-sans text-slate-300">
                  <span className="text-[#10B981] font-bold">// AI &amp; ML Algorithmic Processing Engine</span>{"\n"}
                  <span className="text-sky-400 font-semibold">class</span> SpatialFeatureExtractor(
                  <span className="text-amber-400">nn.Module</span>
                  ):{"\n"}
                  {"  "}def __init__(self, in_features=128, out_features=64):{"\n"}
                  {"    "}super().__init__(){"\n"}
                  {"    "}self.dense = nn.Linear(in_features, out_features){"\n"}
                  {"    "}self.activation = nn.GELU(){"\n"}
                  {"    "}self.norm = nn.LayerNorm(out_features){"\n"}
                </pre>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 mt-6">
            <div>
              <div className="font-sans font-black text-[10px] text-slate-400 uppercase tracking-wider">SPEED</div>
              <div className="font-sans font-black text-base text-[#0F172A]">&lt; 5ms</div>
            </div>
            <div>
              <div className="font-sans font-black text-[10px] text-slate-400 uppercase tracking-wider">OVERHEAD</div>
              <div className="font-sans font-black text-base text-[#0F172A]">0 API Calls</div>
            </div>
            <div>
              <div className="font-sans font-black text-[10px] text-slate-400 uppercase tracking-wider">FOOTPRINT</div>
              <div className="font-sans font-black text-base text-[#0F172A]">48 KB Gzip</div>
            </div>
          </div>
        </div>

        {/* Bento 2: Toolkit (5 cols) */}
        <div 
          className="lg:col-span-5 p-8 rounded-3xl bg-white/75 border border-slate-200/80 backdrop-blur-2xl shadow-sm flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="STACK"
        >
          <div>
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200/80 mb-6">
              <Layers size={16} className="text-[#10B981]" />
              <span className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                PRODUCTION TOOLKIT
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="font-sans font-black text-[10px] text-[#10B981] uppercase tracking-wider mb-2">
                  FRONTEND &amp; MOTION
                </div>
                <div className="flex flex-wrap gap-2">
                  {["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "GSAP 3", "Locomotive Scroll"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-sans font-black text-[10px] text-sky-600 uppercase tracking-wider mb-2">
                  SYSTEMS &amp; LANGUAGES
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Python", "JavaScript (ES6+)", "C / C++", "SQL", "REST APIs"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-sans font-black text-[10px] text-emerald-600 uppercase tracking-wider mb-2">
                  ENVIRONMENT
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Git & GitHub", "Turbopack", "Linux / POSIX", "Vercel Edge"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 font-sans font-black text-xs text-[#0F172A] uppercase tracking-wider">
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
};
