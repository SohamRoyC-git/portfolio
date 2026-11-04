"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";

// 5x7 Dot Matrix Font Map for the clean, minimalist tactile counter
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

// Web Audio API Synthesizer (Instant subtle clicks & cinematic sub-whoosh)
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
      osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
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
      osc.frequency.setValueAtTime(115, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 1.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 1.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    } catch {}
  }
}

const sounds = new PreloaderSoundEngine();

// Clean Dot Matrix Character Component
const DotChar: React.FC<{
  char: string;
  size?: number;
  gap?: number;
  className?: string;
}> = ({ char, size = 3.5, gap = 1.4, className = "" }) => {
  const pattern = DOT_MAP[char.toUpperCase()] || DOT_MAP[" "];

  return (
    <div
      className={`inline-grid grid-cols-5 ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${size}px)`,
        gridTemplateRows: `repeat(7, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {pattern.flatMap((row, rIdx) =>
        row.map((active, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            style={{ width: `${size}px`, height: `${size}px` }}
            className={`rounded-full transition-all duration-150 ${
              active
                ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-100"
                : "bg-white/[0.08] scale-90"
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const roomStageRef = useRef<HTMLDivElement | null>(null);
  const laptopScreenRef = useRef<HTMLDivElement | null>(null);
  const bloomVeilRef = useRef<HTMLDivElement | null>(null);
  const lastProgressRef = useRef(0);

  // Status message for minimalistic elegance
  const getStatus = (p: number) => {
    if (p < 30) return "Warming workstation light...";
    if (p < 65) return "Buffering living terrace textures...";
    if (p < 95) return "Synchronizing spatial coordinates...";
    return "The terrace is peaceful and ready.";
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

    let totalWeight = criticalImages.length + 4; // +3 video, +1 fonts
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

  useEffect(() => {
    if (progress >= 100) {
      setIsReady(true);
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

  // 2. INTERACTIVE 3D MOUSE PARALLAX ON THE PHOTOREALISTIC WORKSTATION
  useEffect(() => {
    if (!roomStageRef.current) return;
    const stage = roomStageRef.current;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (isZooming) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = x * 2.8; // subtle horizontal 3D tilt
      targetRotX = -y * 1.8; // subtle vertical 3D tilt
    };

    const updateParallax = () => {
      if (!isZooming) {
        currentRotX += (targetRotX - currentRotX) * 0.06;
        currentRotY += (targetRotY - currentRotY) * 0.06;
        stage.style.transform = `perspective(1400px) rotateX(${currentRotX.toFixed(
          3
        )}deg) rotateY(${currentRotY.toFixed(3)}deg) scale(1.01)`;
      }
      animId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isZooming]);

  // 3. THE CINEMATIC 3D DOLLY ZOOM INTO THE LAPTOP SCREEN
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

    // A. Dolly zoom straight into the laptop screen center
    // The screen is centered at X: 50%, Y: 54.8% of the 3D room render.
    // Scaling by 3.98x makes the 25.15% width screen fill exactly 100vw!
    if (roomStageRef.current) {
      tl.to(
        roomStageRef.current,
        {
          scale: 4.02,
          transformOrigin: "50% 54.8%",
          duration: 1.6,
          ease: "power3.inOut",
        },
        0
      );
    }

    // B. Optical White Flash / Bloom Veil as the camera breaches through the glass
    if (bloomVeilRef.current) {
      tl.fromTo(
        bloomVeilRef.current,
        { opacity: 0 },
        { opacity: 0.95, duration: 0.5, ease: "power2.in" },
        0.85
      );
    }

    // C. Seamless crossfade to reveal living hero video
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.55,
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
      className={`fixed inset-0 z-[99999] bg-[#0E0F12] select-none overflow-hidden touch-none flex items-center justify-center ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Atelier 3D Workspace Preloader"
    >
      {/* 1. MASTER 3D WORKSPACE ROOM (Photorealistic 3D Render matching Wisq Reference) */}
      <div
        ref={roomStageRef}
        className="relative w-full h-full flex items-center justify-center will-change-[transform]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Aspect-ratio locked canvas covering the viewport seamlessly without distortion */}
        <div
          className="relative shrink-0 flex items-center justify-center pointer-events-auto"
          style={{
            width: "max(100vw, calc(100vh * (1376 / 768)))",
            height: "max(100vh, calc(100vw * (768 / 1376)))",
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <img
            src="/assets/3d_room_workspace.jpg"
            alt="3D Workstation Studio"
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* 2. THE EMBEDDED LAPTOP SCREEN (Pixel-perfect aligned to the 3D laptop monitor) */}
          {/* Exact coordinates measured: left: 37.43%, top: 40.23%, width: 25.15%, height: 29.17% */}
          <div
            ref={laptopScreenRef}
            className="absolute rounded-[4px] sm:rounded-[6px] overflow-hidden bg-[#07080A] text-white flex flex-col justify-between p-3 sm:p-5 md:p-6 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)] border border-black/40"
            style={{
              left: "37.43%",
              top: "40.23%",
              width: "25.15%",
              height: "29.17%",
            }}
          >
            {/* Subtle Screen Diagonal Glass Glare */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05]" />

            {/* Quiet Screen Header */}
            <div className="relative z-10 w-full flex items-center justify-between text-[7px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.22em] uppercase text-white/45">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white/80 font-medium truncate max-w-[90px] sm:max-w-none">
                  SOHAM ROYCHOUDHURY
                </span>
              </div>
              <div className="tracking-[0.2em] text-white/35 hidden sm:block">
                ATELIER // 2026
              </div>
            </div>

            {/* MINIMALISTIC CENTERPIECE: Elegant Breathing Room with Dot-Matrix Counter */}
            <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center px-2">
              {/* Dot Matrix Percentage Counter */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-2.5 mb-2 sm:mb-3">
                <DotChar char={pStr[0]} size={3.2} gap={1.2} />
                <DotChar char={pStr[1]} size={3.2} gap={1.2} />
                <DotChar char={pStr[2]} size={3.2} gap={1.2} />
                <DotChar char="%" size={3.2} gap={1.2} />
              </div>

              {/* Minimal Hairline Progress Bar */}
              <div className="w-full max-w-[140px] sm:max-w-[200px] md:max-w-[240px] h-[1px] sm:h-[1.5px] bg-white/15 rounded-full overflow-hidden mb-2 sm:mb-3">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Serene Single-Line Status Indicator */}
              <div className="text-[6.5px] sm:text-[8.5px] md:text-[9.5px] font-mono tracking-[0.18em] uppercase text-white/50 text-center truncate max-w-[90%]">
                {getStatus(progress)}
              </div>

              {/* Tactile Enter Action Cue (Fades in at 100%) */}
              {isReady && (
                <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/25 bg-white/10 text-white font-mono text-[6.5px] sm:text-[8px] md:text-[9px] tracking-[0.2em] uppercase backdrop-blur-sm animate-pulse shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="hidden sm:inline">Click or Press Enter</span>
                  <span className="inline sm:hidden">Tap to Step Outside</span>
                </div>
              )}
            </div>

            {/* Screen Footer */}
            <div className="relative z-10 w-full flex items-center justify-between text-[6.5px] sm:text-[8px] font-mono tracking-[0.18em] uppercase text-white/30 border-t border-white/[0.08] pt-1.5 sm:pt-2">
              <span>HARDWARE OPTIMIZED</span>
              <span>100% BUFFERED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Screen-Wide Interaction Pill Cue for Mobile & Desktop */}
      {isReady && !isZooming && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full border border-black/15 bg-white/85 text-black font-sans font-medium text-[9px] sm:text-[11px] tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.25)] animate-pulse whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black shrink-0" />
            <span className="hidden sm:inline">Press Enter or Click to Step Outside</span>
            <span className="inline sm:hidden">Tap to Step Outside</span>
          </div>
        </div>
      )}

      {/* 4. Optical White Flash / Bloom Veil upon 3D zoom penetration */}
      <div
        ref={bloomVeilRef}
        className="absolute inset-0 pointer-events-none z-50 bg-white opacity-0"
      />
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
