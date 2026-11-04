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
};

const DotChar = memo(function DotChar({
  char,
  size = 4,
  gap = 1.8,
}: {
  char: string;
  size?: number;
  gap?: number;
}) {
  const matrix = DOT_MAP[char] || DOT_MAP["0"];

  return (
    <div
      className="inline-grid select-none"
      style={{
        gridTemplateColumns: `repeat(5, ${size}px)`,
        gridTemplateRows: `repeat(7, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {matrix.flatMap((row, r) =>
        row.map((on, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-full transition-all duration-150"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: on ? "#FFFFFF" : "rgba(255, 255, 255, 0.06)",
              boxShadow: on ? "0 0 6px rgba(255, 255, 255, 0.7)" : "none",
            }}
          />
        ))
      )}
    </div>
  );
});

DotChar.displayName = "DotChar";

export interface TerraceBreezePreloaderProps {
  onComplete?: () => void;
}

export const TerraceBreezePreloader = memo(function TerraceBreezePreloader({
  onComplete,
}: TerraceBreezePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize tactile split-flap tick sounds
  const playTickSound = useCallback(() => {
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
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      }
    } catch {}
  }, []);

  // Resonant deep enter chime
  const playEnterSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        // Warm low sub chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.8);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.95);
      }
    } catch {}
  }, []);

  // Calm, single-line poetic status indicator
  const getStatus = (p: number) => {
    if (p < 25) return "CALIBRATING SPATIAL STUDIO CANVAS...";
    if (p < 55) return "SYNTHESIZING 3D WORKSPACE GEOMETRY...";
    if (p < 85) return "CALIBRATING NATURAL SUNLIGHT CAUSTICS...";
    if (p < 100) return "HARMONIZING ATELIER SOUNDSCAPE...";
    return "THE WORKSPACE IS PEACEFUL AND READY [ 100% ]";
  };

  // Buffer and progress simulation
  useEffect(() => {
    let current = 0;
    let tickCount = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 2;
      tickCount++;
      if (tickCount % 4 === 0) playTickSound();

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setIsReady(true);
      } else {
        setProgress(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [playTickSound]);

  // Handle entry transition into the 3D studio
  const handleTriggerEnter = useCallback(() => {
    if (isEntering) return;
    setIsEntering(true);
    playEnterSound();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete: () => {
          setVisible(false);
          if (onComplete) onComplete();
          if (typeof window !== "undefined") {
            const lenis = (window as any).lenis;
            if (lenis) lenis.start();
            import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
            });
          }
        },
      });
    }
  }, [isEntering, playEnterSound, onComplete]);

  // Global keydown trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReady && !isEntering) {
        if (e.key === "Enter" || e.code === "Space") {
          e.preventDefault();
          handleTriggerEnter();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, isEntering, handleTriggerEnter]);

  if (!visible) return null;

  const pStr = String(Math.min(100, Math.max(0, progress))).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      onClick={isReady ? handleTriggerEnter : undefined}
      className={`fixed inset-0 z-[99999] bg-[#07080A] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden touch-none ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Atelier Preloader"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(255,255,255,0.035),transparent_70%)]" />

      {/* Top Header: Atelier Identity */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[10px] font-mono tracking-[0.24em] uppercase text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY</span>
        </div>
        <div className="tracking-[0.22em] text-white/35">
          ATELIER // 2026
        </div>
      </div>

      {/* Centerpiece: Clean Tactile Dot-Matrix Counter & Hairline Bar */}
      <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center max-w-xl mx-auto px-4">
        {/* Dot Matrix Readout */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <DotChar char={pStr[0]} size={4.5} gap={1.8} />
          <DotChar char={pStr[1]} size={4.5} gap={1.8} />
          <DotChar char={pStr[2]} size={4.5} gap={1.8} />
          <DotChar char="%" size={4.5} gap={1.8} />
        </div>

        {/* Minimal Hairline Progress Bar */}
        <div className="w-full max-w-[220px] sm:max-w-[280px] h-[1.5px] bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.85)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Calm Poetic Status Telemetry */}
        <div className="text-[8px] sm:text-[9.5px] font-mono tracking-[0.2em] uppercase text-white/45 text-center truncate max-w-full mb-8">
          {getStatus(progress)}
        </div>

        {/* Tactile Entry Pill Button (Appears gracefully at 100%) */}
        {isReady && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-white/20 bg-white/10 text-white font-mono text-[8.5px] sm:text-[10px] tracking-[0.24em] uppercase backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:bg-white hover:text-black transition-all duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span className="hidden sm:inline">Click or Press Enter to Step Inside</span>
              <span className="inline sm:hidden">Tap to Step Inside</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="relative z-10 w-full flex items-center justify-between text-[7px] sm:text-[8.5px] font-mono tracking-[0.2em] uppercase text-white/25 border-t border-white/[0.06] pt-3">
        <span>HARDWARE ACCELERATED</span>
        <span>STANDALONE EXPERIENCE</span>
      </div>
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
