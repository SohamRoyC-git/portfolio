"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { GraduationCap, Trophy, Cpu, Award } from "lucide-react";

export interface StationData {
  num: string;
  short: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  statusLabel: string;
  accentColor: string;
  progressPercent: number;
  centerCard: {
    heading: string;
    subheading: string;
    detail: string;
  };
  satellites: Array<{
    title: string;
    subtitle: string;
    color: string;
  }>;
}

export const STATIONS: StationData[] = [
  {
    num: "01",
    short: "Academic",
    tag: "Academic Core",
    title: "Netaji Subhash Engineering College",
    role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
    desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
    statusLabel: "Building Neural Connectors",
    accentColor: "#ff7a00",
    progressPercent: 94,
    centerCard: {
      heading: "Academic Core",
      subheading: "Netaji Subhash Eng. College",
      detail: "B.Tech AI & ML (2024–2028)",
    },
    satellites: [
      { title: "Neural Arch", subtitle: "Optimized v4", color: "#38bdf8" },
      { title: "Comp Algebra", subtitle: "High-Speed Core", color: "#f59e0b" },
      { title: "Convergence", subtitle: "99.4% Valid", color: "#10b981" },
      { title: "Telemetry", subtitle: "Live 100%", color: "#a855f7" },
    ],
  },
  {
    num: "02",
    short: "European Ops",
    tag: "European Operations",
    title: "Latvian Cricket Federation",
    role: "National Sports Governing Body Digital Ecosystem",
    desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga and European circuits.",
    statusLabel: "Connecting Telemetry Stream",
    accentColor: "#f59e0b",
    progressPercent: 100,
    centerCard: {
      heading: "European Operations",
      subheading: "Latvian Cricket Federation",
      detail: "EU Sports Governing Infrastructure",
    },
    satellites: [
      { title: "EU Compliance", subtitle: "Regulatory Active", color: "#38bdf8" },
      { title: "Live Telemetry", subtitle: "Sub-Second Feed", color: "#f59e0b" },
      { title: "Riga Circuit", subtitle: "Active Nodes", color: "#10b981" },
      { title: "Stream Uptime", subtitle: "100% Active", color: "#a855f7" },
    ],
  },
  {
    num: "03",
    short: "Localization",
    tag: "High-Performance Core",
    title: "278-Key In-Memory Localization Engine",
    role: "Zero-API Sub-Millisecond Bilingual Translation",
    desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
    statusLabel: "Deploying Sub-Millisecond Bus",
    accentColor: "#38bdf8",
    progressPercent: 98,
    centerCard: {
      heading: "High-Performance Core",
      subheading: "278-Key In-Memory Engine",
      detail: "Sub-Millisecond Bilingual Bus",
    },
    satellites: [
      { title: "Zero-API", subtitle: "In-Memory Hash", color: "#38bdf8" },
      { title: "Roundtrip", subtitle: "< 4.8ms Latency", color: "#f59e0b" },
      { title: "Commodity Pipeline", subtitle: "EU–CIS Stream", color: "#10b981" },
      { title: "Bilingual Sync", subtitle: "Zero Overhead", color: "#a855f7" },
    ],
  },
  {
    num: "04",
    short: "Heritage",
    tag: "Algorithmic Foundation",
    title: "The Heritage School",
    role: "ISC Class XII (82.75%) · ICSE (89.4%) Distinction",
    desc: "Pure sciences, discrete mathematics, analytical mechanics, and algorithm design distinction foundation.",
    statusLabel: "Validating Foundation Kernels",
    accentColor: "#10b981",
    progressPercent: 92,
    centerCard: {
      heading: "Algorithmic Foundation",
      subheading: "The Heritage School",
      detail: "ISC XII (82.75%) · ICSE (89.4%)",
    },
    satellites: [
      { title: "Discrete Math", subtitle: "Top Percentile", color: "#38bdf8" },
      { title: "Mechanics", subtitle: "Analytical Rigor", color: "#f59e0b" },
      { title: "Logic Design", subtitle: "Distinction Honors", color: "#10b981" },
      { title: "Heritage", subtitle: "Classical Foundation", color: "#a855f7" },
    ],
  },
];

interface IsometricConsoleCreedProps {
  progress?: number;
}

export const IsometricConsoleCreed: React.FC<IsometricConsoleCreedProps> = memo(
  ({ progress = 0 }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Audio click for station selection
    const playHapticTick = useCallback(() => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch {
        // Audio fallback
      }
    }, []);

    // Sync station with scroll progress only when progress actually moves
    const lastProgressRef = useRef(progress);
    useEffect(() => {
      if (typeof progress === "number" && progress !== lastProgressRef.current) {
        lastProgressRef.current = progress;
        const idx = Math.min(
          STATIONS.length - 1,
          Math.max(0, Math.floor(progress * STATIONS.length))
        );
        setCurrentIdx(idx);
      }
    }, [progress]);

    const activeStation = STATIONS[currentIdx];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between select-none pointer-events-auto overflow-hidden bg-transparent">
        {/* 1. TOP STATUS PILL (Placed safely below fixed navbar) */}
        <div className="w-full pt-16 px-6 flex items-center justify-between z-20 max-w-sm pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-lg">
            <span
              className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
              style={{ backgroundColor: activeStation.accentColor }}
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/90">
              {activeStation.statusLabel}
            </span>
          </div>
          <div className="text-[11px] font-mono text-white/50 tracking-widest pl-2">
            [{activeStation.num} / 04]
          </div>
        </div>

        {/* 2. THE 3D ISOMETRIC CONSOLE VIEWPORT (~80% OF SCREEN) */}
        <div
          className="w-full flex-1 relative flex items-center justify-center overflow-visible"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 42%",
          }}
        >
          {/* Floor PCB Ambient Pattern */}
          <div
            className="absolute w-[460px] h-[460px] rounded-full pointer-events-none opacity-30"
            style={{
              transform: "rotateX(55deg) rotateZ(-35deg) translateZ(-60px)",
              backgroundImage:
                "linear-gradient(to right, rgba(255, 130, 0, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 130, 0, 0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Isometric Deck Container */}
          <div
            className="relative w-[330px] h-[430px]"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(55deg) rotateZ(-35deg)",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* LAYER 1: Radiant Dot-Matrix LED Base & Underglow */}
            <div
              className="absolute inset-0 rounded-[28px] border-2 border-[#ff7a00]/70"
              style={{
                backgroundColor: "#160600",
                backgroundImage:
                  "radial-gradient(#ffaa00 1.5px, transparent 1.5px), radial-gradient(#ff7700 1px, #160600 1px)",
                backgroundSize: "14px 14px",
                backgroundPosition: "0 0, 7px 7px",
                boxShadow:
                  "0 0 45px 12px rgba(255, 122, 0, 0.45), 0 0 90px 25px rgba(255, 90, 0, 0.2), 0 25px 60px rgba(0, 0, 0, 0.95)",
                transform: "translateZ(0px)",
              }}
            />

            {/* LAYER 2: Machined Dark Titanium Chassis */}
            <div
              className="absolute inset-[8px] rounded-[22px] bg-[#14161b] border border-white/10"
              style={{
                transform: "translateZ(12px)",
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 20px rgba(0,0,0,0.8)",
              }}
            >
              {/* Left Side Ventilation Cooling Gills */}
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-60">
                <div className="w-1.5 h-3 bg-black/80 rounded-r-sm" />
                <div className="w-1.5 h-3 bg-black/80 rounded-r-sm" />
                <div className="w-1.5 h-3 bg-black/80 rounded-r-sm" />
                <div className="w-1.5 h-3 bg-black/80 rounded-r-sm" />
              </div>

              {/* Laser-Etched Subtle Side Signature */}
              <div className="absolute right-[-14px] top-1/3 -rotate-90 origin-right text-[7px] font-mono tracking-[0.25em] text-white/30 uppercase">
                Soham Roychowdhury · Creed Engine
              </div>

              {/* LAYER 3: Recessed Obsidian Glass Surface */}
              <div
                className="absolute inset-[10px] rounded-[18px] bg-[#0c0d11] border border-[#ff7a00]/80 overflow-hidden flex flex-col justify-between p-3.5"
                style={{
                  boxShadow:
                    "inset 0 0 25px rgba(255, 122, 0, 0.15), inset 0 2px 8px rgba(0,0,0,0.9)",
                }}
              >
                {/* Screen Dot Grid Matrix */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Laser-Sharp Circuit Conduits linking cards */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none stroke-white/40 fill-none"
                  style={{
                    filter: "drop-shadow(0 0 3px rgba(255,255,255,0.6))",
                  }}
                >
                  <path
                    d="M 148 135 L 72 135 L 72 72"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <circle cx="72" cy="72" r="3.5" fill={activeStation.accentColor} />

                  <path
                    d="M 148 135 L 224 135 L 224 72"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <circle cx="224" cy="72" r="3.5" fill={activeStation.accentColor} />

                  <path
                    d="M 148 225 L 72 225 L 72 270"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <circle cx="72" cy="270" r="3.5" fill={activeStation.accentColor} />

                  <path
                    d="M 148 225 L 224 225 L 224 270"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <circle cx="224" cy="270" r="3.5" fill={activeStation.accentColor} />
                </svg>

                {/* Top Satellite Row */}
                <div className="relative z-10 flex justify-between gap-2.5">
                  <div
                    className="flex-1 bg-[#1a1c23] border border-white/10 rounded-xl p-2.5 transition-all duration-300"
                    style={{
                      transform: "translateZ(18px)",
                      boxShadow:
                        "0 12px 24px -4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="h-1 w-full rounded-full mb-1.5 transition-colors duration-500"
                      style={{
                        backgroundColor: activeStation.satellites[0].color,
                      }}
                    />
                    <div className="text-[9px] font-bold text-white tracking-tight">
                      {activeStation.satellites[0].title}
                    </div>
                    <div className="text-[7.5px] text-white/50 font-mono mt-0.5">
                      {activeStation.satellites[0].subtitle}
                    </div>
                  </div>

                  <div
                    className="flex-1 bg-[#1a1c23] border border-white/10 rounded-xl p-2.5 transition-all duration-300"
                    style={{
                      transform: "translateZ(18px)",
                      boxShadow:
                        "0 12px 24px -4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="h-1 w-full rounded-full mb-1.5 transition-colors duration-500"
                      style={{
                        backgroundColor: activeStation.satellites[1].color,
                      }}
                    />
                    <div className="text-[9px] font-bold text-white tracking-tight">
                      {activeStation.satellites[1].title}
                    </div>
                    <div className="text-[7.5px] text-white/50 font-mono mt-0.5">
                      {activeStation.satellites[1].subtitle}
                    </div>
                  </div>
                </div>

                {/* Main Center Card (Elevated 3D Core) */}
                <div
                  className="relative z-10 bg-[#21242d] border border-white/15 rounded-xl p-3 my-auto mx-1 transition-all duration-300"
                  style={{
                    transform: "translateZ(26px)",
                    boxShadow: `0 20px 35px -6px rgba(0, 0, 0, 0.9), 0 0 25px ${activeStation.accentColor}44, inset 0 1px 1px rgba(255, 255, 255, 0.25)`,
                  }}
                >
                  <div
                    className="h-1.5 w-full rounded-full mb-2 transition-colors duration-500"
                    style={{
                      background: `linear-gradient(to right, ${activeStation.accentColor}, #ffa726)`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white tracking-tight">
                      {activeStation.centerCard.heading}
                    </div>
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[7px] font-mono font-semibold transition-colors duration-500"
                      style={{
                        backgroundColor: `${activeStation.accentColor}25`,
                        border: `1px solid ${activeStation.accentColor}60`,
                        color: activeStation.accentColor,
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[9px] text-white/80 mt-1 font-medium leading-tight">
                    {activeStation.centerCard.subheading}
                  </div>
                  <div className="text-[7.5px] text-white/50 font-mono mt-0.5">
                    {activeStation.centerCard.detail}
                  </div>
                </div>

                {/* Bottom Satellite Row */}
                <div className="relative z-10 flex justify-between gap-2.5">
                  <div
                    className="flex-1 bg-[#1a1c23] border border-white/10 rounded-xl p-2.5 transition-all duration-300"
                    style={{
                      transform: "translateZ(18px)",
                      boxShadow:
                        "0 12px 24px -4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="h-1 w-full rounded-full mb-1.5 transition-colors duration-500"
                      style={{
                        backgroundColor: activeStation.satellites[2].color,
                      }}
                    />
                    <div className="text-[9px] font-bold text-white tracking-tight">
                      {activeStation.satellites[2].title}
                    </div>
                    <div
                      className="text-[7.5px] font-mono font-bold mt-0.5"
                      style={{ color: activeStation.satellites[2].color }}
                    >
                      {activeStation.satellites[2].subtitle}
                    </div>
                  </div>

                  <div
                    className="flex-1 bg-[#1a1c23] border border-white/10 rounded-xl p-2.5 transition-all duration-300"
                    style={{
                      transform: "translateZ(18px)",
                      boxShadow:
                        "0 12px 24px -4px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div
                      className="h-1 w-full rounded-full mb-1.5 transition-colors duration-500"
                      style={{
                        backgroundColor: activeStation.satellites[3].color,
                      }}
                    />
                    <div className="text-[9px] font-bold text-white tracking-tight">
                      {activeStation.satellites[3].title}
                    </div>
                    <div className="text-[7.5px] text-white/50 font-mono mt-0.5">
                      {activeStation.satellites[3].subtitle}
                    </div>
                  </div>
                </div>

                {/* Animated Glowing Progress Bar Track */}
                <div className="relative z-10 w-full bg-black/60 rounded-full h-3 border border-white/10 p-0.5 flex items-center mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${activeStation.progressPercent}%`,
                      background: `linear-gradient(to right, ${activeStation.accentColor}, #ffaa00)`,
                      boxShadow: `0 0 10px ${activeStation.accentColor}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM MINIMAL STATUS BAR */}
        <div className="w-full pb-8 px-6 z-20 flex flex-col items-center gap-3">
          <div className="w-full max-w-sm text-center">
            <h3 className="text-white font-semibold text-base tracking-tight leading-snug">
              {activeStation.title}
            </h3>
            <p className="text-white/60 text-xs mt-1 leading-relaxed line-clamp-2">
              {activeStation.role}
            </p>
          </div>

          {/* Quick Station Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
            {STATIONS.map((st, i) => (
              <button
                key={st.num}
                onClick={() => {
                  setCurrentIdx(i);
                  playHapticTick();
                }}
                className={`px-3.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  i === currentIdx
                    ? "bg-white text-black font-semibold shadow-lg shadow-white/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {st.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

IsometricConsoleCreed.displayName = "IsometricConsoleCreed";
