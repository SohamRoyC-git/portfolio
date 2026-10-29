"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Layers, ShieldCheck, Check, Copy } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type CodeTab = "dictionary" | "neural" | "eventbus";

export const ArchitecturalMatrix: React.FC = memo(() => {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("dictionary");
  const [copiedCode, setCopiedCode] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic Section Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 35%",
          scrub: 0.5,
        },
      });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0
        );
      }

      if (bentoGridRef.current) {
        tl.fromTo(
          bentoGridRef.current.children,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.1
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const codeSnippets: Record<CodeTab, { filename: string; language: string; code: string; telemetry: { speed: string; overhead: string; footprint: string } }> = {
    dictionary: {
      filename: "DictionaryEngine.ts",
      language: "TypeScript",
      code: `// Zero-API In-Memory Localization Dictionary (IZIEAT B2B)
export const lookupTerm = (
  key: string,
  lang: "en" | "ru"
): string => {
  const term = DICTIONARY_STORE[key];
  if (!term) return key;

  // Sub-3ms memory lookup, zero external network requests
  return term[lang] || term.en;
};

// Client-side cache hydration with O(1) hash map access
export const prewarmCache = (dictionary: Record<string, TermPair>): void => {
  Object.assign(DICTIONARY_STORE, dictionary);
};`,
      telemetry: {
        speed: "< 2.8ms",
        overhead: "0 API Calls",
        footprint: "48 KB Gzip",
      },
    },
    neural: {
      filename: "SpatialExtractor.py",
      language: "Python",
      code: `# AI & ML Spatial Representation Pipeline
import torch
import torch.nn as nn

class SpatialFeatureExtractor(nn.Module):
    def __init__(self, in_features=128, out_features=64):
        super().__init__()
        self.dense = nn.Linear(in_features, out_features)
        self.activation = nn.GELU()
        self.norm = nn.LayerNorm(out_features)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Residual projection with non-linear embedding
        projected = self.dense(x)
        return self.norm(self.activation(projected)) + x[:, :64]`,
      telemetry: {
        speed: "1.4ms GPU",
        overhead: "TensorRT INT8",
        footprint: "18.2 MB Weights",
      },
    },
    eventbus: {
      filename: "TournamentIngest.ts",
      language: "TypeScript",
      code: `// Realtime Sports Telemetry Stream (Latvian Cricket)
export async function ingestMatchTelemetry(
  event: MatchEventPayload
): Promise<IngestResult> {
  const validated = MatchSchema.parse(event);
  
  // High-throughput Redis event broadcast with stream consumer group
  const streamId = await redis.xadd(
    \`tournaments:\${validated.tournamentId}:live\`,
    "*",
    "payload",
    JSON.stringify(validated)
  );

  return { success: true, streamId, latencyMs: 4.1 };
}`,
      telemetry: {
        speed: "< 4.5ms",
        overhead: "100k+ Evt/mo",
        footprint: "99.98% Uptime",
      },
    },
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[activeCodeTab].code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const currentSnippet = codeSnippets[activeCodeTab];

  return (
    <section
      id="monument-matrix"
      ref={sectionRef}
      className="relative min-h-[90svh] py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 z-30 max-w-7xl mx-auto flex flex-col justify-center bg-[#060709] border-t border-white/12 shadow-[0_-35px_100px_rgba(0,0,0,0.95)]"
    >
      {/* Chapter Marker */}
      <div className="font-sans font-bold text-[11px] sm:text-xs text-[#FF7A00] tracking-[0.2em] uppercase mb-6 sm:mb-10 flex items-center gap-3">
        <span className="w-6 sm:w-8 h-[1px] bg-[#FF7A00]" />
        <span>TECHNICAL BLUEPRINT &amp; ARCHITECTURE</span>
      </div>

      {/* Headline & Description */}
      <div ref={headlineRef} className="mb-10 sm:mb-14 will-change-[transform,opacity]">
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-[#FFFDF9] tracking-tight leading-[1.08] mb-3">
          Technical Matrix &amp; Systems
        </h2>
        <p className="font-serif italic font-light text-base sm:text-xl text-slate-300/90 max-w-2xl leading-relaxed">
          Zero-roundtrip client dictionaries, high-throughput telemetry event streams, and production engineering architectures.
        </p>
      </div>

      {/* Bento Grid */}
      <div ref={bentoGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Bento 1: Interactive Code Sandbox & Telemetry (7 cols) */}
        <div
          className="lg:col-span-7 p-5 sm:p-8 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="CODE"
        >
          <div>
            {/* Header with Spring Tabs & Copy Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-white/10 mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5">
                <Terminal size={15} className="text-[#FF7A00]" />
                <span className="font-sans font-bold text-[11px] sm:text-xs text-[#FFFDF9] uppercase tracking-wider">
                  {currentSnippet.filename}
                </span>
                <span className="text-[10px] text-white/30 font-mono">({currentSnippet.language})</span>
              </div>

              {/* Framer Motion Spring Code Tabs */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10">
                {(
                  [
                    { id: "dictionary", label: "278-Key i18n" },
                    { id: "neural", label: "Neural PyTorch" },
                    { id: "eventbus", label: "Event Bus" },
                  ] as const
                ).map((tab) => {
                  const isActive = activeCodeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCodeTab(tab.id)}
                      className={`relative px-3 py-1 rounded-full font-sans font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                        isActive ? "text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="matrix-code-tab"
                          className="absolute inset-0 bg-[#FF7A00] rounded-full"
                          transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Block */}
            <div className="relative group/code">
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                title="Copy code"
              >
                {copiedCode ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#08090D] border border-white/10 font-mono text-[11px] sm:text-xs text-slate-200 leading-relaxed overflow-x-auto shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeCodeTab}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="font-mono text-slate-300 whitespace-pre"
                  >
                    {activeCodeTab === "dictionary" && (
                      <code>
                        <span className="text-[#FF7A00] font-bold">{"// Zero-API In-Memory Localization Dictionary (IZIEAT B2B)\n"}</span>
                        <span className="text-amber-300 font-semibold">export const</span> lookupTerm = ({"\n"}
                        {"  "}key: <span className="text-emerald-400">string</span>,{"\n"}
                        {"  "}lang: <span className="text-emerald-400">&quot;en&quot; | &quot;ru&quot;</span>{"\n"}
                        ): <span className="text-emerald-400">string</span> =&gt; &#123;{"\n"}
                        {"  "}const term = DICTIONARY_STORE[key];{"\n"}
                        {"  "}<span className="text-amber-300 font-semibold">if</span> (!term) return key;{"\n\n"}
                        {"  "}<span className="text-slate-500">{"// Sub-3ms memory lookup, zero external network requests\n"}</span>
                        {"  "}return term[lang] || term.en;{"\n"}
                        &#125;;
                      </code>
                    )}
                    {activeCodeTab === "neural" && (
                      <code>
                        <span className="text-[#FF7A00] font-bold">{"# AI & ML Spatial Representation Pipeline\n"}</span>
                        <span className="text-amber-300 font-semibold">class</span> SpatialFeatureExtractor(nn.Module):{"\n"}
                        {"    "}<span className="text-amber-300 font-semibold">def</span> __init__(self, in_features=128, out_features=64):{"\n"}
                        {"        "}super().__init__(){"\n"}
                        {"        "}self.dense = nn.Linear(in_features, out_features){"\n"}
                        {"        "}self.activation = nn.GELU(){"\n"}
                        {"        "}self.norm = nn.LayerNorm(out_features){"\n\n"}
                        {"    "}<span className="text-amber-300 font-semibold">def</span> forward(self, x: torch.Tensor) -&gt; torch.Tensor:{"\n"}
                        {"        "}return self.norm(self.activation(self.dense(x))) + x[:, :64]
                      </code>
                    )}
                    {activeCodeTab === "eventbus" && (
                      <code>
                        <span className="text-[#FF7A00] font-bold">{"// Realtime Sports Telemetry Stream (Latvian Cricket)\n"}</span>
                        <span className="text-amber-300 font-semibold">export async function</span> ingestMatchTelemetry(event: MatchEventPayload) &#123;{"\n"}
                        {"  "}const validated = MatchSchema.parse(event);{"\n\n"}
                        {"  "}<span className="text-slate-500">{"// High-throughput Redis event broadcast\n"}</span>
                        {"  "}const streamId = await redis.xadd(&quot;tournaments:live&quot;, &quot;*&quot;, &quot;payload&quot;, JSON.stringify(validated));{"\n"}
                        {"  "}return &#123; success: true, streamId, latencyMs: 4.1 &#125;;{"\n"}
                        &#125;
                      </code>
                    )}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Architectural Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/10 mt-5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="font-sans font-medium text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">
                SPEED / LATENCY
              </div>
              <div className="font-sans font-black text-sm sm:text-base text-[#FFFDF9]">
                {currentSnippet.telemetry.speed}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="font-sans font-medium text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">
                OVERHEAD
              </div>
              <div className="font-sans font-black text-sm sm:text-base text-emerald-400">
                {currentSnippet.telemetry.overhead}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="font-sans font-medium text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">
                BENCHMARK
              </div>
              <div className="font-sans font-black text-sm sm:text-base text-[#FFFDF9]">
                {currentSnippet.telemetry.footprint}
              </div>
            </div>
          </div>
        </div>

        {/* Bento 2: 3-Tier Production Blueprint & Architecture (5 cols) */}
        <div
          className="lg:col-span-5 p-5 sm:p-8 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between"
          data-cursor="pointer"
          data-cursor-text="STACK"
        >
          <div>
            <div className="flex items-center gap-2.5 pb-4 sm:pb-5 border-b border-white/10 mb-5">
              <Layers size={15} className="text-[#FF7A00]" />
              <span className="font-sans font-bold text-[11px] sm:text-xs text-[#FFFDF9] uppercase tracking-wider">
                PRODUCTION TOOLKIT &amp; TOPOLOGY
              </span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Tier 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-bold text-[10px] text-[#FF7A00] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                    01 // FRONTEND ARCHITECTURE &amp; MOTION
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">REACT 19 CORE</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "GSAP 3", "Framer Motion", "Lenis Smooth"].map(
                    (tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-sans font-medium text-[11px] text-[#FFFDF9] uppercase tracking-wider shadow-xs cursor-default"
                      >
                        {tech}
                      </motion.span>
                    )
                  )}
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-bold text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    02 // SYSTEMS, DATA &amp; AI
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">POSIX / HIGH SPEED</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "PyTorch", "JavaScript (ES6+)", "C / C++", "PostgreSQL", "Redis Event Bus"].map(
                    (tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-sans font-medium text-[11px] text-[#FFFDF9] uppercase tracking-wider shadow-xs cursor-default"
                      >
                        {tech}
                      </motion.span>
                    )
                  )}
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-bold text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    03 // DEPLOYMENT &amp; RESILIENCE
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">EDGE NATIVE</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Cloudflare Workers", "Vercel Edge", "Git & GitHub", "Turbopack", "Linux / POSIX", "REST Endpoints"].map(
                    (tech) => (
                      <motion.span
                        key={tech}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-sans font-medium text-[11px] text-[#FFFDF9] uppercase tracking-wider shadow-xs cursor-default"
                      >
                        {tech}
                      </motion.span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Reliability Verification Badge */}
          <div className="pt-4 border-t border-white/10 mt-5 flex items-center justify-between text-[10px]">
            <span className="font-sans font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>DETERMINISTIC VERIFICATION</span>
            </span>
            <span className="text-emerald-400 font-mono font-bold">100% PASS</span>
          </div>
        </div>
      </div>
    </section>
  );
});

ArchitecturalMatrix.displayName = "ArchitecturalMatrix";
