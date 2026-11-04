"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";
import {
  X,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Terminal as TerminalIcon,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Monitor,
  Volume2,
  VolumeX,
  Camera,
  Layers,
  CheckCircle2,
  Flame,
  Code2,
  Activity,
} from "lucide-react";

export interface Studio3DWorkspaceProps {
  onEnterPortfolio: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  isLocked?: boolean;
}

type SceneViewMode = "studio" | "photo";

interface HotspotBox {
  left: number;
  top: number;
  width: number;
  height: number;
  label: string;
  sub: string;
  icon: React.ReactNode;
  action: () => void;
}

export const Studio3DWorkspace = memo(function Studio3DWorkspace({
  onEnterPortfolio,
  onNavigateToSection,
  isLocked = true,
}: Studio3DWorkspaceProps) {
  // Scene View Mode: Studio (3D digital twin) vs Photo (authentic battle station photo)
  const [sceneMode, setSceneMode] = useState<SceneViewMode>("studio");

  // Interactive Modals
  const [activeModal, setActiveModal] = useState<"projects" | "specs" | "hobbies" | "terminal" | null>(null);

  // Audio Ambience
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Hovered Gear item
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string; isUser?: boolean }>>([
    { cmd: "system.init", out: "Soham Battlestation Kernel v4.2 · Architecture Active" },
    { cmd: "whoami", out: "Soham Roychoudhury — AI/ML Engineer & Systems Architect" },
    { cmd: "help", out: "Commands available: 'whoami', 'projects', 'specs', 'hobbies', 'sound on', 'sound off', 'enter', 'clear'" },
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Refs for Continuous Dolly Zoom
  const stageRef = useRef<HTMLDivElement>(null);
  const monitorPortalRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);

  // Mouse Parallax coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Synthesize tactile switch clicks
  const playClickSound = useCallback((freq = 880) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.35, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }
    } catch {}
  }, []);

  // Ambient organic terrace breeze generator
  const toggleAmbientSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") ctx.resume();

      if (isAudioPlaying) {
        if (ambientGainRef.current) {
          ambientGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
          setTimeout(() => {
            try {
              if (noiseSourceRef.current) {
                noiseSourceRef.current.stop();
                noiseSourceRef.current.disconnect();
                noiseSourceRef.current = null;
              }
            } catch {}
          }, 350);
        }
        setIsAudioPlaying(false);
      } else {
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.25;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        noiseSourceRef.current = whiteNoise;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(380, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 1.2);
        ambientGainRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsAudioPlaying(true);
      }
    } catch {}
  }, [isAudioPlaying]);

  // Continuous Dolly Zoom directly into BenQ Monitor (Zero Flash, Zero Blur Pop)
  const triggerDollyZoom = useCallback(() => {
    if (isZooming) return;
    playClickSound(1050);
    setIsZooming(true);

    const monitorEl = monitorPortalRef.current;
    const stageEl = stageRef.current;

    if (!monitorEl || !stageEl) {
      onEnterPortfolio();
      return;
    }

    const rect = monitorEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();

    // Center point of monitor in screen coordinates
    const monitorCenterX = rect.left + rect.width / 2;
    const monitorCenterY = rect.top + rect.height / 2;

    // Center point relative to stage container
    const stageOriginX = ((monitorCenterX - stageRect.left) / stageRect.width) * 100;
    const stageOriginY = ((monitorCenterY - stageRect.top) / stageRect.height) * 100;

    // Timeline for continuous dolly camera push
    const tl = gsap.timeline({
      onComplete: () => {
        onEnterPortfolio();
        setIsZooming(false);
      },
    });

    // 1. Camera push: The desk scales up rapidly toward the viewer centered on the monitor screen
    tl.to(stageEl, {
      scale: 3.8,
      transformOrigin: `${stageOriginX}% ${stageOriginY}%`,
      opacity: 0,
      duration: 1.15,
      ease: "power3.in",
    }, 0);

    // 2. The monitor screen seamlessly expands to fill 100vw × 100vh with ZERO flash and ZERO blur
    tl.to(monitorEl, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      borderWidth: 0,
      zIndex: 9999,
      duration: 1.15,
      ease: "power3.inOut",
    }, 0);
  }, [isZooming, onEnterPortfolio, playClickSound]);

  // Mouse move parallax handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Keyboard navigation & modal dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playClickSound(1200);

    let output = "";
    if (cmd === "whoami") {
      output = "Soham Roychoudhury · AI Engineer & Frontend Architect. NSEC IT 2026 · European Cricket Ops.";
    } else if (cmd === "projects") {
      output = "1. In-Memory Translation Engine (<5ms)  2. European Cricket Ops Platform  3. DeepSeek Agent Harness";
    } else if (cmd === "specs") {
      output = "Rig: Zebronics Geometric Chassis, BenQ Widescreen IPS, Redgear Deskpad, Compact TKL Mech Keyboard.";
    } else if (cmd === "hobbies") {
      output = "Cricket Athletics (Latvian Cricket Fed), Keyboard Modding, Ambient Audio, Generative Art.";
    } else if (cmd === "sound on") {
      if (!isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic mountain wind soundscape: ACTIVE.";
    } else if (cmd === "sound off") {
      if (isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic soundscape: MUTED.";
    } else if (cmd === "enter") {
      output = "Initiating camera dolly zoom into website...";
      setTimeout(() => {
        setActiveModal(null);
        triggerDollyZoom();
      }, 500);
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "help") {
      output = "Commands: whoami | projects | specs | hobbies | sound on | sound off | enter | clear";
    } else {
      output = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd, out: output, isUser: true }]);
    setTerminalInput("");

    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Hotspots definitions for both Studio Twin and Real Photo modes
  const studioHotspots: Record<string, HotspotBox> = {
    monitor: {
      left: 28.3,
      top: 11.5,
      width: 36.0,
      height: 36.1,
      label: "BenQ Monitor",
      sub: "Master Website Portal · Click to Enter",
      icon: <Monitor className="w-4 h-4 text-blue-400" />,
      action: triggerDollyZoom,
    },
    pc_tower: {
      left: 65.0,
      top: 15.0,
      width: 25.0,
      height: 60.0,
      label: "Zebronics Rig",
      sub: "Compute Specs & AI Tech Stack",
      icon: <Cpu className="w-4 h-4 text-red-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("specs");
      },
    },
    gamepad: {
      left: 20.0,
      top: 45.0,
      width: 12.0,
      height: 15.0,
      label: "Gamepad",
      sub: "Selected Commissions & Projects",
      icon: <Gamepad2 className="w-4 h-4 text-purple-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("projects");
      },
    },
    keyboard: {
      left: 30.0,
      top: 60.0,
      width: 30.0,
      height: 25.0,
      label: "TKL Mechanical Keyboard",
      sub: "Interactive Hacker CLI Terminal",
      icon: <Keyboard className="w-4 h-4 text-emerald-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("terminal");
      },
    },
    headset: {
      left: 8.0,
      top: 55.0,
      width: 22.0,
      height: 35.0,
      label: "Over-Ear Headset",
      sub: "Hobbies, Rituals & Terrace Ambience",
      icon: <Headphones className="w-4 h-4 text-amber-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("hobbies");
      },
    },
  };

  const photoHotspots: Record<string, HotspotBox> = {
    monitor: {
      left: 27.9,
      top: 13.5,
      width: 31.3,
      height: 32.8,
      label: "BenQ Monitor",
      sub: "Master Website Portal · Click to Enter",
      icon: <Monitor className="w-4 h-4 text-blue-400" />,
      action: triggerDollyZoom,
    },
    pc_tower: {
      left: 61.5,
      top: 17.5,
      width: 23.5,
      height: 51.5,
      label: "Zebronics Rig",
      sub: "Compute Specs & AI Tech Stack",
      icon: <Cpu className="w-4 h-4 text-red-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("specs");
      },
    },
    gamepad: {
      left: 25.4,
      top: 47.9,
      width: 10.6,
      height: 9.2,
      label: "Gamepad",
      sub: "Selected Commissions & Projects",
      icon: <Gamepad2 className="w-4 h-4 text-purple-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("projects");
      },
    },
    keyboard: {
      left: 30.5,
      top: 68.5,
      width: 24.0,
      height: 12.5,
      label: "TKL Mechanical Keyboard",
      sub: "Interactive Hacker CLI Terminal",
      icon: <Keyboard className="w-4 h-4 text-emerald-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("terminal");
      },
    },
    headset: {
      left: 11.0,
      top: 66.0,
      width: 19.0,
      height: 23.0,
      label: "Over-Ear Headset",
      sub: "Hobbies, Rituals & Terrace Ambience",
      icon: <Headphones className="w-4 h-4 text-amber-400" />,
      action: () => {
        playClickSound(950);
        setActiveModal("hobbies");
      },
    },
  };

  const currentHotspots = sceneMode === "studio" ? studioHotspots : photoHotspots;
  const currentMonitorBox = currentHotspots.monitor;

  return (
    <div
      className="relative w-full h-[100svh] bg-[#07080A] text-[#F8F5EE] overflow-hidden select-none flex flex-col items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* 1. Subtle Radial Vignette Lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(255,122,0,0.06)_0%,rgba(0,0,0,0.7)_70%,#07080A_100%)] z-10" />

      {/* 2. Top Header Bar: Status Indicator & Scene Toggle */}
      <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · REAL BATTLESTATION</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">BENQ · ZEBRONICS · REDGEAR</span>
        </div>

        {/* Scene Mode Toggle: Studio Twin vs Authentic Photo */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full text-xs font-mono">
          <button
            onClick={() => {
              playClickSound(900);
              setSceneMode("studio");
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              sceneMode === "studio"
                ? "bg-white/20 text-white font-semibold shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Twin</span>
          </button>
          <button
            onClick={() => {
              playClickSound(900);
              setSceneMode("photo");
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              sceneMode === "photo"
                ? "bg-white/20 text-white font-semibold shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Real Photo</span>
          </button>
        </div>
      </header>

      {/* 3. The 3D Desk Stage Container */}
      <div
        ref={stageRef}
        className="relative w-full max-w-[1400px] aspect-[16/9] flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `perspective(1400px) rotateX(${mousePos.y * -1.2}deg) rotateY(${mousePos.x * 1.8}deg)`,
        }}
      >
        {/* Background Desk Image (Studio Twin or Real Photo) */}
        <img
          src={
            sceneMode === "studio"
              ? "/assets/soham_real_desk_studio.jpg"
              : "/assets/soham_real_desk_photo.jpg"
          }
          alt="Soham Roychoudhury Real Desk Battlestation"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
        />

        {/* 4. BenQ Monitor Screen Portal (Continuous Zoom Origin & Live Preview) */}
        <div
          ref={monitorPortalRef}
          onClick={triggerDollyZoom}
          onMouseEnter={() => setHoveredItem("monitor")}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            left: `${currentMonitorBox.left}%`,
            top: `${currentMonitorBox.top}%`,
            width: `${currentMonitorBox.width}%`,
            height: `${currentMonitorBox.height}%`,
          }}
          className={`absolute cursor-pointer rounded-[3px] overflow-hidden border border-blue-400/30 transition-all duration-300 ${
            hoveredItem === "monitor"
              ? "ring-2 ring-blue-400/80 shadow-[0_0_35px_rgba(59,130,246,0.6)]"
              : "shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          }`}
        >
          {/* Active Cyber-Pastoral Terrace Screen Contents */}
          <div className="relative w-full h-full bg-[#080B11] text-[#F8F5EE] flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden group">
            {/* Ambient Terrace Glowing Horizon */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0E18] to-[#040609] pointer-events-none" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-28 bg-[#FF7A00]/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Screen Top Status Line */}
            <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM RUNNING // ATELIER 2026
              </span>
              <span className="tracking-wider">PORT 3000: OPEN</span>
            </div>

            {/* Screen Center Live Typography */}
            <div className="relative z-10 my-auto text-center">
              <p className="text-[7px] sm:text-[9px] uppercase tracking-[0.25em] text-[#FF7A00] font-mono mb-0.5">
                Soham Roychoudhury
              </p>
              <h2 className="text-xs sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:scale-105 transition-transform">
                CYBER-PASTORAL TERRACE
              </h2>
              <p className="text-[7px] sm:text-[9px] text-white/60 mt-0.5">
                AI/ML Engineer · Systems · Frontend Architect
              </p>
            </div>

            {/* Screen Bottom CTA Banner */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-[8px] sm:text-[10px] font-mono text-white tracking-wider backdrop-blur-sm transition-all group-hover:bg-[#FF7A00] group-hover:text-black group-hover:border-transparent">
                <span>CLICK TO ENTER PORTFOLIO</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Subtle Screen Scanline Texture */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_3px] opacity-40" />

            {/* Screen Glass Glare Diagonal Reflection */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -rotate-12 translate-x-4 opacity-50" />
          </div>
        </div>

        {/* 5. Pinpoint Interactive Hotspots (Zebronics, Gamepad, Keyboard, Headset) */}
        {Object.entries(currentHotspots).map(([key, box]) => {
          if (key === "monitor") return null; // Handled separately as portal above
          const isHovered = hoveredItem === key;

          return (
            <div
              key={key}
              onClick={box.action}
              onMouseEnter={() => setHoveredItem(key)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
              }}
              className={`absolute cursor-pointer transition-all duration-200 z-20 group rounded-md ${
                isHovered
                  ? "bg-white/10 ring-2 ring-white/60 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                  : "bg-transparent hover:bg-white/5"
              }`}
            >
              {/* Pulsing Target Dot on Hover */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              >
                <div className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center animate-spin">
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                </div>
              </div>

              {/* Floating Hologram Tag (Only shows strictly over hovered item!) */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-30 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 bg-[#0B0D14]/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg shadow-2xl">
                    {box.icon}
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white leading-tight">{box.label}</p>
                      <p className="text-[10px] text-white/60 font-mono leading-tight">{box.sub}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 6. Floating Bottom Hardware Navigation Dock */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-4 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/75 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-2xl shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none">
          {/* BenQ Monitor Enter */}
          <button
            onClick={triggerDollyZoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all shrink-0"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Monitor</span>
            <span className="text-[10px] opacity-70 font-mono">(Enter)</span>
          </button>

          {/* Zebronics PC Specs */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("specs");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <span>PC Rig</span>
          </button>

          {/* Gamepad Projects */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("projects");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Projects</span>
          </button>

          {/* Headset Hobbies & Sound */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("hobbies");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>Hobbies</span>
          </button>

          {/* Mechanical Keyboard Terminal */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("terminal");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>CLI Terminal</span>
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            aria-label="Toggle Terrace Wind Ambience"
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              isAudioPlaying
                ? "bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40"
                : "bg-white/5 hover:bg-white/15 text-white/60 border-white/10"
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Direct Enter Website CTA */}
          <button
            onClick={triggerDollyZoom}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black font-semibold text-xs transition-all shadow-lg shadow-[#FF7A00]/20 shrink-0"
          >
            <span>Enter Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* =========================================================================
          MODAL 1: PROJECTS & SELECTED COMMISSIONS (Triggered by Gamepad)
          ========================================================================= */}
      {activeModal === "projects" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">SELECTED COMMISSIONS // 2024–2026</h3>
                  <p className="text-xs font-mono text-white/60">High-Performance Systems & AI Architectures</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1">
              {/* Project 1 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">In-Memory Microsecond Translation Engine</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    &lt; 5ms Latency
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Engineered concurrent lock-free queue and zero-allocation memory pipeline in C++ and Rust for high-frequency live linguistic translation.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">C++</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Rust</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Lock-Free Queues</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Concurrency</span>
                </div>
              </div>

              {/* Project 2 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">European Cricket Federation Real-Time Platform</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Production Ops
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Official operational hub and live broadcast telemetry platform for the Latvian Cricket Federation, powering real-time match engine and international fixture tracking.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Next.js 16</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">WebSockets</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Sports Telemetry</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Tailwind</span>
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">DeepSeek & Agentic Multi-Model Orchestrator</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Autonomous AI
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Autonomous task delegation harness running local LLM reasoning benchmarks, recursive code generation, and multi-agent coordination.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">PyTorch</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">DeepSeek</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Python</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Agents</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onNavigateToSection) onNavigateToSection("monument-exhibition");
                  else onEnterPortfolio();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                <span>View Full Exhibition in Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RIG SPECS & TECH STACK (Triggered by Zebronics PC)
          ========================================================================= */}
      {activeModal === "specs" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ZEBRONICS BATTLESTATION // SPECS & ARCHITECTURE</h3>
                  <p className="text-xs font-mono text-white/60">Hardware Engine & Production Software Stack</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Telemetry Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  SYSTEM STATUS: OPTIMAL · THERMALS 29°C
                </span>
                <span>COMPUTE CORES ACTIVE</span>
              </div>

              {/* Physical Rig Specs */}
              <div>
                <h4 className="text-xs font-mono text-[#FF7A00] tracking-wider uppercase mb-2">Hardware Peripherals & Enclosure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Zebronics Angular Gaming Chassis</p>
                    <p className="text-white/60 text-[11px]">Tempered glass side panel with high-airflow ARGB cooling array.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">BenQ Widescreen IPS Monitor</p>
                    <p className="text-white/60 text-[11px]">Color-calibrated precision panel mounted on teak wood shelf riser.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Compact TKL Mechanical Keyboard</p>
                    <p className="text-white/60 text-[11px]">Linear lubricated tactile switches with acoustic dampening foam.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Redgear Mat & Logitech G Mouse</p>
                    <p className="text-white/60 text-[11px]">Extended distressed crimson cloth mat with high-precision optical tracking.</p>
                  </div>
                </div>
              </div>

              {/* Software Engineering Stack */}
              <div>
                <h4 className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-2">Software Stack & AI Frameworks</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ Next.js 16 (App Router)
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ React 19 & TypeScript
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ Three.js & WebGL 2.0
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ PyTorch & DeepSeek
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ C++ & Rust Systems
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ GSAP & Lenis Smooth
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: HOBBIES, RITUALS & AMBIENT SOUND (Triggered by Headset)
          ========================================================================= */}
      {activeModal === "hobbies" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">LIFE RITUALS & HOBBIES</h3>
                  <p className="text-xs font-mono text-white/60">Music, Sports Operations, Acoustics & Lifestyle</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1">
              {/* Working Sound Generator Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Organic Terrace Mountain Wind Generator</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isAudioPlaying ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"
                  }`}>
                    {isAudioPlaying ? "PLAYING" : "MUTED"}
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-3">
                  Synthesized in real-time using Web Audio API pink/white noise filtered through organic mountain resonance.
                </p>
                <button
                  onClick={toggleAmbientSound}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black text-xs font-semibold transition-all"
                >
                  {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAudioPlaying ? "Stop Soundscape" : "Start Terrace Breeze"}</span>
                </button>
              </div>

              {/* Ritual 1: European Cricket */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-0.5">European Cricket Federation Operations & Athletics</h4>
                <p className="text-xs text-white/70">
                  Active operations contributor for the Latvian Cricket Federation, coordinating international match fixtures, live broadcast graphics, and competitive team management.
                </p>
              </div>

              {/* Ritual 2: Custom Mechanical Keyboards */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-0.5">Mechanical Switch Modding & Acoustic Tuning</h4>
                <p className="text-xs text-white/70">
                  Obsessed with tactile keystroke feedback, lubing switches with Krytox 205g0, custom brass plates, and high-frequency acoustic dampening.
                </p>
              </div>

              {/* Ritual 3: Computational Geometry */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-0.5">Generative Shaders & Spatial Graphics</h4>
                <p className="text-xs text-white/70">
                  Crafting procedural noise algorithms, raymarching fractal landscapes, and fluid simulation mechanics.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Close Hobbies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: INTERACTIVE CLI TERMINAL (Triggered by Keyboard)
          ========================================================================= */}
      {activeModal === "terminal" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#090B10] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-white/60 ml-2">soham@battlestation: ~ (bash)</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close terminal"
                className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal History */}
            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-white/40">guest@soham:~$</span>
                    <span>{item.cmd}</span>
                  </div>
                  <div className="text-white/80 whitespace-pre-wrap pl-4 border-l border-white/10">
                    {item.out}
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Input Line */}
            <form onSubmit={handleTerminalSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-emerald-400 text-xs shrink-0">guest@soham:~$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoFocus
                placeholder="Type 'help', 'whoami', 'projects', 'specs', or 'enter'..."
                className="flex-1 bg-transparent text-white text-xs outline-none border-none placeholder:text-white/30"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px]"
              >
                RUN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
