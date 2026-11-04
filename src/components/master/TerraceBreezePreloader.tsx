"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";

// 5x7 Dot Matrix Bitmap Font Map (Dieter Rams / Braun Monolith Edition)
const DOT_MAP: Record<string, number[][]> = {
  "0": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  "1": [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  "2": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  "3": [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  "4": [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  "5": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "6": [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "7": [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  "8": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "9": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0],
  ],
  "%": [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  ">": [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  " ": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

// Web Audio API Synthesizer (Instant mechanical clicks & cinematic zoom whoosh)
class PreloaderSoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playMechanicalClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {}
  }

  playCinematicWhoosh() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.9);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.1);
    } catch {}
  }
}

const sounds = new PreloaderSoundEngine();

// Responsive 5x7 Dot Matrix Character Component
const DotChar: React.FC<{
  char: string;
  variant?: "hero" | "standard" | "compact";
  className?: string;
}> = ({ char, variant = "standard", className = "" }) => {
  const pattern = DOT_MAP[char.toUpperCase()] || DOT_MAP[" "];

  // Dynamic responsive dot sizing per variant
  const getDims = () => {
    if (variant === "hero") {
      return {
        dotClass: "w-[4.8px] h-[4.8px] sm:w-[6.8px] sm:h-[6.8px] md:w-[7.5px] md:h-[7.5px]",
        gapClass: "gap-[1.8px] sm:gap-[2.6px]",
      };
    }
    if (variant === "compact") {
      return {
        dotClass: "w-[3.4px] h-[3.4px] sm:w-[5.2px] sm:h-[5.2px] md:w-[6px] md:h-[6px]",
        gapClass: "gap-[1.4px] sm:gap-[2.2px]",
      };
    }
    return {
      dotClass: "w-[4px] h-[4px] sm:w-[5.8px] sm:h-[5.8px]",
      gapClass: "gap-[1.6px] sm:gap-[2.4px]",
    };
  };

  const { dotClass, gapClass } = getDims();

  return (
    <div
      className={`inline-grid grid-cols-5 ${gapClass} ${className}`}
      style={{ gridTemplateColumns: "repeat(5, min-content)" }}
    >
      {pattern.flatMap((row, rIdx) =>
        row.map((active, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`${dotClass} rounded-full transition-all duration-150 ${
              active
                ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-100"
                : "bg-white/[0.06] scale-90"
            }`}
          />
        ))
      )}
    </div>
  );
};

export const TerraceBreezePreloader: React.FC = memo(() => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<"name" | "loading" | "enter">("name");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const laptopScreenRef = useRef<HTMLDivElement | null>(null);
  const laptopBezelRef = useRef<HTMLDivElement | null>(null);
  const bloomVeilRef = useRef<HTMLDivElement | null>(null);
  const lastProgressRef = useRef(0);

  // Status message for genuine telemetry
  const getTelemetry = (p: number) => {
    if (p < 25) return "INITIALIZING PORTFOLIO ENGINE";
    if (p < 55) return "BUFFERING TERRACE VIDEO STREAM";
    if (p < 85) return "MOUNTING 3D ASSETS & GEOMETRY";
    if (p < 100) return "CALIBRATING LIVING ENVIRONMENT";
    return "ATELIER SYSTEM VERIFIED & READY";
  };

  // 1. GENUINE ASSET PRELOADING ENGINE
  useEffect(() => {
    let mounted = true;
    const criticalImages = [
      "/assets/soham_headshot.png",
      "/assets/disc_indiacenter.png",
      "/assets/disc_izieat.png",
      "/assets/disc_lcf.png",
      "/assets/disc_varti.png",
      "/assets/lcf_logo.png",
      "/assets/varti_logo.png",
      "/assets/terrace_laptop_desk.jpg",
      "/assets/logos/izieat.png",
      "/assets/logos/latvia_cricket.png",
      "/assets/logos/india_center.png",
      "/assets/logos/varti_international.png",
      "/assets/linkedin_qr.svg",
    ];

    let totalWeight = criticalImages.length + 4; // +3 weight for video, +1 for fonts
    let loadedWeight = 0;

    const updateWeight = (weightToAdd: number) => {
      if (!mounted) return;
      loadedWeight += weightToAdd;
      const targetPercent = Math.min(100, Math.round((loadedWeight / totalWeight) * 100));
      setProgress((prev) => {
        const next = Math.max(prev, targetPercent);
        if (next !== lastProgressRef.current) {
          lastProgressRef.current = next;
          sounds.playMechanicalClick();
        }
        return next;
      });
    };

    // A. Preload Fonts
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => updateWeight(1));
    } else {
      updateWeight(1);
    }

    // B. Preload Images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => updateWeight(1);
      img.onerror = () => updateWeight(1);
    });

    // C. Genuine Hero Video Buffer Verification
    let videoHandled = false;
    const handleVideoReady = () => {
      if (videoHandled) return;
      videoHandled = true;
      updateWeight(3);
    };

    const video = document.createElement("video");
    video.src = "/assets/hero_pixel_art_loop.mp4";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("canplaythrough", handleVideoReady, { once: true });
    video.addEventListener("loadeddata", () => {
      if (video.readyState >= 3) handleVideoReady();
    });
    try {
      video.load();
    } catch {}

    // Check existing DOM hero video elements
    if (typeof document !== "undefined") {
      const domVideos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
      domVideos.forEach((v) => {
        if (v.readyState >= 3) {
          handleVideoReady();
        } else {
          v.addEventListener("canplaythrough", handleVideoReady, { once: true });
          v.addEventListener("loadeddata", () => {
            if (v.readyState >= 3) handleVideoReady();
          });
        }
      });
    }

    // Fallback timer: guarantees transition within 4.5s max
    const fallbackTimer = setTimeout(() => {
      if (!videoHandled) handleVideoReady();
      setProgress(100);
      setIsReady(true);
    }, 4500);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      video.removeEventListener("canplaythrough", handleVideoReady);
    };
  }, []);

  // Stage Transitions: Name (0-1.8s) -> Loading (1.8s-100%) -> Enter (100%)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage((prev) => (prev === "name" ? "loading" : prev));
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setIsReady(true);
      const enterTimer = setTimeout(() => {
        setStage("enter");
      }, 500);
      return () => clearTimeout(enterTimer);
    }
  }, [progress]);

  // Lock Lenis scroll while preloader is active
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenis = (window as any).lenis;
      if (lenis && visible) {
        lenis.stop();
      }
    }
  }, [visible]);

  // 2. THE CINEMATIC 3D DOLLY ZOOM INTO THE LAPTOP SCREEN
  const handleTriggerEnter = useCallback(() => {
    if (isZooming) return;
    setIsZooming(true);
    sounds.playCinematicWhoosh();

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        if (typeof window !== "undefined") {
          const lenis = (window as any).lenis;
          if (lenis) lenis.start();
          import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
      },
    });

    // A. 3D Camera Dolly Zoom into the laptop glass (scale 9.0x centered on display)
    if (sceneRef.current) {
      tl.to(
        sceneRef.current,
        {
          scale: 9.0,
          transformOrigin: "center 48%",
          duration: 1.6,
          ease: "power3.inOut",
        },
        0
      );
    }

    // B. Bezel and dark room elements dissolve away as we breach through the glass
    if (laptopBezelRef.current) {
      tl.to(
        laptopBezelRef.current,
        {
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        },
        0.5
      );
    }

    // C. Optical bloom veil flashes as we enter the sunlit terrace
    if (bloomVeilRef.current) {
      tl.fromTo(
        bloomVeilRef.current,
        { opacity: 0 },
        { opacity: 0.95, duration: 0.6, ease: "power2.in" },
        0.7
      );
    }

    // D. Seamless crossfade to reveal living hero video
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        1.15
      );
    }
  }, [isZooming]);

  // Global keydown trigger on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReady && !isZooming) {
        if (e.key === "Enter" || e.code === "Space") {
          e.preventDefault();
        }
        handleTriggerEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, isZooming, handleTriggerEnter]);

  if (!visible) return null;

  // Format 3-digit percentage for dot-matrix
  const pStr = String(Math.min(100, Math.max(0, progress))).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      onClick={isReady ? handleTriggerEnter : undefined}
      onTouchMove={(e) => {
        if (!isZooming) e.stopPropagation();
      }}
      onWheel={(e) => {
        if (!isZooming) e.stopPropagation();
      }}
      className={`fixed inset-0 z-[99999] bg-[#050507] text-white select-none overflow-hidden flex items-center justify-center touch-none ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Atelier Monolith Preloader"
    >
      {/* 1. Dark Room Atmosphere & Studio Accents */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_80%_at_50%_40%,#09090D_0%,#050507_70%,#020203_100%)]" />

      {/* Warm Minimalist Desk Lamp Rim Glow in upper corner */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,184,77,0.08)_0%,rgba(255,184,77,0.02)_50%,transparent_75%)] pointer-events-none blur-3xl" />

      {/* The Master 3D Zoomable Scene Container */}
      <div
        ref={sceneRef}
        className="relative w-full h-full flex items-center justify-center will-change-[transform,opacity]"
      >
        {/* Desk Surface & Horizon Line in lower third */}
        <div className="absolute bottom-0 left-0 right-0 h-[38%] pointer-events-none bg-gradient-to-t from-[#030304] via-[#090A0E] to-transparent border-t border-white/[0.04]">
          {/* Subtle Brushed Desk Sheen */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />

          {/* Atmospheric Silhouette: Ceramic Coffee Mug on the Desk (Echoes Terrace Hero Mug!) */}
          <div className="absolute bottom-12 right-[8%] sm:right-[16%] md:right-[20%] opacity-60 flex flex-col items-center">
            {/* Soft Steam Curl */}
            <div className="w-1.5 h-6 bg-gradient-to-t from-white/20 to-transparent blur-[1px] animate-pulse mb-1 -ml-1 rounded-full" />
            {/* Ceramic Mug Body */}
            <div className="relative w-7 h-8 sm:w-9 sm:h-10 bg-gradient-to-b from-[#18191E] to-[#0E0F12] rounded-b-lg border-t border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.8)]">
              {/* Mug Handle */}
              <div className="absolute -right-2 top-1.5 w-3 h-4 rounded-r-md border-2 border-[#18191E] border-l-0" />
            </div>
          </div>
        </div>

        {/* 2. THE LAPTOP (Straight-on Front Elevation, Prominent & Centered) */}
        <div className="relative z-10 w-[94vw] max-w-[820px] md:w-[74vw] lg:w-[64vw] flex flex-col items-center">
          {/* Laptop Upper Display Frame & Chamfered Bezel */}
          <div
            ref={laptopBezelRef}
            className="w-full relative rounded-t-2xl sm:rounded-t-3xl bg-[#15161B] border border-white/10 pt-2.5 sm:pt-3 px-2.5 sm:px-3 pb-1 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
          >
            {/* Top Bezel: Centered Camera Notch Dot */}
            <div className="w-full flex items-center justify-center pb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A0B0D] border border-white/20 shadow-inner" />
            </div>

            {/* LAPTOP SCREEN (16:10 Ratio, Obsidian Glass with Dieter Rams Monolith Display) */}
            <div
              ref={laptopScreenRef}
              className="relative w-full aspect-[16/10] bg-[#07080A] rounded-lg sm:rounded-xl overflow-hidden border border-white/[0.08] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col justify-between p-3.5 sm:p-7 md:p-9"
            >
              {/* Subtle Screen Diagonal Glass Glare */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04]" />

              {/* Inactive Background Dot Grid (Authentic Flip-Disc / LED Pegboard Texture) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #FFFFFF 1.5px, transparent 1.5px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* Screen Header Bar: Mono Architectural Monograph */}
              <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[10px] font-mono tracking-[0.24em] uppercase text-white/45">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-white/80 font-medium truncate max-w-[140px] sm:max-w-none">
                    SOHAM ROYCHOUDHURY
                  </span>
                </div>
                <div className="tracking-[0.2em] text-white/40 hidden xs:block">
                  ATELIER 2026 // MONOLITH
                </div>
              </div>

              {/* Screen Centerpiece: Interactive Morphing Dot Matrix Display */}
              <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center">
                {/* STAGE 1: Morphing Name "SOHAM" */}
                {stage === "name" && (
                  <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 animate-in fade-in zoom-in-95 duration-500">
                    {["S", "O", "H", "A", "M"].map((ch, idx) => (
                      <DotChar
                        key={`name-${idx}`}
                        char={ch}
                        variant="hero"
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                      />
                    ))}
                  </div>
                )}

                {/* STAGE 2: Giant Dot-Matrix Percentage & Directional Arrow */}
                {stage === "loading" && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
                    {/* Left: Directional Dot-Matrix Arrow & Telemetry Status */}
                    <div className="flex flex-col items-start gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <DotChar char=">" variant="compact" />
                        <span className="font-mono text-[8px] sm:text-[11px] tracking-[0.22em] uppercase text-white/75">
                          {getTelemetry(progress)}
                        </span>
                      </div>
                      <div className="h-[1px] w-24 sm:w-32 bg-white/15" />
                    </div>

                    {/* Right: Giant Dot-Matrix Percentage (000% -> 100%) */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3.5">
                      <DotChar char={pStr[0]} variant="hero" />
                      <DotChar char={pStr[1]} variant="hero" />
                      <DotChar char={pStr[2]} variant="hero" />
                      <DotChar char="%" variant="hero" />
                    </div>
                  </div>
                )}

                {/* STAGE 3: Final Ready Prompt "ENTER >" */}
                {stage === "enter" && (
                  <div className="flex flex-col items-center gap-3 sm:gap-4 animate-in fade-in zoom-in-95 duration-400">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-3.5">
                      {["E", "N", "T", "E", "R", " ", ">"].map((ch, idx) => (
                        <DotChar
                          key={`enter-${idx}`}
                          char={ch}
                          variant="compact"
                          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                        />
                      ))}
                    </div>

                    {/* Minimalist Pill CTA */}
                    <div className="mt-2 sm:mt-3 inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/20 bg-white/10 text-white font-mono text-[8.5px] sm:text-[10px] tracking-[0.22em] uppercase backdrop-blur-md animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="hidden sm:inline">
                        Press Enter or Click to Initiate
                      </span>
                      <span className="inline sm:hidden">
                        Tap Anywhere to Step Inside
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Screen Footer: Sub-telemetry */}
              <div className="relative z-10 w-full flex items-center justify-between text-[7.5px] sm:text-[9px] font-mono tracking-[0.2em] uppercase text-white/35 border-t border-white/[0.08] pt-2 sm:pt-3">
                <span>HARDWARE ACCELERATED</span>
                <span>SYSTEM STATE: {progress}%</span>
              </div>
            </div>
          </div>

          {/* Laptop Lower Deck / Keyboard Lip & Hinge */}
          <div className="w-[101.5%] h-5 sm:h-7 bg-[#111216] rounded-b-xl border-x border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex items-center justify-center relative">
            {/* Center Thumb Notch for opening */}
            <div className="w-16 h-1 bg-[#1E2026] rounded-full" />

            {/* Keyboard Backlight Spill Glow on the desk surface */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[85%] h-8 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_85%)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Optical White Flash / Bloom Veil upon zoom penetration */}
      <div
        ref={bloomVeilRef}
        className="absolute inset-0 pointer-events-none z-50 bg-white opacity-0"
      />
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
