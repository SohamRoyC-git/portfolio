"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";

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
  const monogramSRef = useRef<SVGPathElement>(null);
  const monogramRStemRef = useRef<SVGPathElement>(null);
  const monogramRBowlRef = useRef<SVGPathElement>(null);
  const monogramFlourishRef = useRef<SVGPathElement>(null);
  const monogramGroupRef = useRef<SVGGElement>(null);

  const blob1Ref = useRef<SVGPathElement>(null);
  const blob2Ref = useRef<SVGPathElement>(null);
  const liquidWashRef = useRef<HTMLDivElement>(null);
  const liquidWavePathRef = useRef<SVGPathElement>(null);
  const readyBtnRef = useRef<HTMLDivElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Resonant deep enter chime
  const playEnterSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
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

  // Calm single-line telemetry status
  const getStatus = (p: number) => {
    if (p < 30) return "PREPARING ATELIER CANVAS...";
    if (p < 65) return "CALIBRATING 3D SPATIAL GEOMETRY...";
    if (p < 100) return "ALIGNING MONOGRAM ARCHITECTURE...";
    return "READY · STEP INTO THE VOID";
  };

  // 1. Living 2D Liquid Background Blobs + 60fps SR Monogram Draw & Fill
  useEffect(() => {
    // Initialize liquid wash completely below viewport cleanly via GSAP (no inline transform conflict)
    if (liquidWashRef.current) {
      gsap.set(liquidWashRef.current, { yPercent: 100 });
    }

    // Organic drifting background blobs so the Oat Milk canvas feels alive
    if (blob1Ref.current) {
      gsap.to(blob1Ref.current, {
        attr: {
          d: "M 0 180 Q 260 120 520 210 T 1040 160 T 1440 220 L 1440 0 L 0 0 Z",
        },
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (blob2Ref.current) {
      gsap.to(blob2Ref.current, {
        attr: {
          d: "M 0 760 Q 320 670 680 750 T 1180 690 T 1440 740 L 1440 900 L 0 900 Z",
        },
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Initialize trim-path lengths on SR Monogram
    const paths = [
      monogramSRef.current,
      monogramRStemRef.current,
      monogramRBowlRef.current,
      monogramFlourishRef.current,
    ];
    const lengths = paths.map((p) => {
      if (!p) return 0;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      return len;
    });

    // Silky 60fps GSAP progress timeline (zero stepped interval jitter)
    const state = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setProgress(100);
        setIsReady(true);
      },
    });

    tl.to(state, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = state.val / 100;
        setProgress(Math.round(state.val));

        // 0% -> 82%: Smoothly draw the SR Monogram strokes
        const drawP = Math.min(1, p / 0.82);
        paths.forEach((pathEl, idx) => {
          if (!pathEl) return;
          // Slight stagger across S -> R -> Flourish
          const startOffset = idx * 0.12;
          const localP = Math.max(0, Math.min(1, (drawP - startOffset) / (1 - startOffset)));
          pathEl.style.strokeDashoffset = String(lengths[idx] * (1 - localP));
        });

        // 72% -> 100%: Gentle scale settle & luminous glow
        if (monogramGroupRef.current && p > 0.72) {
          const bloom = (p - 0.72) / 0.28;
          gsap.set(monogramGroupRef.current, {
            scale: 0.96 + bloom * 0.04,
            transformOrigin: "center center",
          });
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Gentle float on Ready button
  useEffect(() => {
    if (isReady && readyBtnRef.current) {
      gsap.fromTo(
        readyBtnRef.current,
        { y: 16, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [isReady]);

  // 2. Liquify 2D Obsidian Wave Wash Transition into the Dark Lorenz Attractor Screen
  const handleTriggerEnter = useCallback(() => {
    if (isEntering) return;
    setIsEntering(true);
    playEnterSound();

    if (liquidWashRef.current && liquidWavePathRef.current) {
      const washTl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          if (onComplete) onComplete();
          if (typeof window !== "undefined") {
            const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
            if (lenis) lenis.start();
            import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
            });
          }
        },
      });

      // Gently lift the monogram as the liquid obsidian wave rises to wash over the screen
      if (monogramGroupRef.current) {
        washTl.to(
          monogramGroupRef.current,
          { y: -32, scale: 1.08, opacity: 0, duration: 0.55, ease: "power2.in" },
          0
        );
      }

      // Morph wave crest smoothly while rising so it ripples like real 2D liquid
      washTl.to(
        liquidWavePathRef.current,
        {
          attr: {
            d: "M 0 110 C 320 260, 560 0, 920 170 C 1180 280, 1340 20, 1440 120 L 1440 900 L 0 900 Z",
          },
          duration: 0.65,
          ease: "sine.inOut",
        },
        0
      );

      // Sweep liquid obsidian wash from yPercent: 100 (just below screen) to yPercent: -25 (completely covering screen)
      washTl.fromTo(
        liquidWashRef.current,
        { yPercent: 100 },
        {
          yPercent: -25,
          duration: 0.95,
          ease: "power2.inOut",
        },
        0
      );

      // Trigger 3D Studio entrance right as obsidian wave completes covering the screen, then fade preloader
      washTl.call(
        () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("atelier-enter-studio"));
          }
        },
        [],
        0.85
      );

      if (containerRef.current) {
        washTl.to(
          containerRef.current,
          { opacity: 0, duration: 0.35, ease: "power2.out" },
          0.95
        );
      }
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("atelier-enter-studio"));
      }
      setVisible(false);
      if (onComplete) onComplete();
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
      className={`fixed inset-0 z-[99999] bg-[#EEE5D4] text-[#1D4A35] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden touch-none ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Atelier Preloader"
    >
      {/* Living 2D Liquid Background Waves (Warm Sand & Subtle Forest Green depth) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={blob1Ref}
          d="M 0 140 Q 320 220 680 130 T 1180 190 T 1440 130 L 1440 0 L 0 0 Z"
          fill="#E1D5BE"
          fillOpacity="0.65"
        />
        <path
          ref={blob2Ref}
          d="M 0 720 Q 280 790 620 710 T 1120 770 T 1440 700 L 1440 900 L 0 900 Z"
          fill="#1D4A35"
          fillOpacity="0.08"
        />
      </svg>

      {/* Top Header: Minimal Atelier Identity */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[10px] font-mono tracking-[0.24em] uppercase text-[#1D4A35]/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F2462E] animate-pulse" />
          <span className="text-[#1D4A35] font-bold">SR // ATELIER</span>
        </div>
        <div className="tracking-[0.22em] text-[#1D4A35]/70 font-semibold">
          2026 EDITION
        </div>
      </div>

      {/* Centerpiece: Sculptural Animated SR Monogram */}
      <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center max-w-xl mx-auto px-4">
        <div className="w-48 h-36 sm:w-64 sm:h-48 mb-4 flex items-center justify-center">
          <svg
            viewBox="0 0 240 180"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            <g ref={monogramGroupRef}>
              {/* Calligraphic S (Hero Script inspired) */}
              <path
                ref={monogramSRef}
                d="M 106 44 C 94 24, 56 26, 52 54 C 48 78, 102 84, 98 114 C 94 140, 48 142, 38 118"
                stroke="#1D4A35"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Architectural R Stem */}
              <path
                ref={monogramRStemRef}
                d="M 132 134 L 132 34"
                stroke="#1D4A35"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Architectural R Bowl + Sweeping Leg */}
              <path
                ref={monogramRBowlRef}
                d="M 132 34 L 166 34 C 194 34, 196 82, 166 84 L 132 84 M 158 84 L 194 134"
                stroke="#1D4A35"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Flowing 2D Underline Flourish in Tomato Red */}
              <path
                ref={monogramFlourishRef}
                d="M 38 152 Q 118 168 198 148"
                stroke="#F2462E"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Clean Progress Readout */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono font-black text-lg sm:text-xl tracking-widest text-[#1D4A35]">
            {pStr}%
          </span>
        </div>

        {/* Minimal Forest Progress Bar */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] h-[3px] bg-[#1D4A35]/15 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#1D4A35] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Telemetry */}
        <div className="text-[8.5px] sm:text-[9.5px] font-mono font-semibold tracking-[0.2em] uppercase text-[#1D4A35]/75 text-center truncate max-w-full mb-7">
          {getStatus(progress)}
        </div>

        {/* Tactile Entry Pill Button (Appears gracefully at 100%) */}
        {isReady && (
          <div ref={readyBtnRef}>
            <div className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#1D4A35] text-[#EEE5D4] font-mono text-[9px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase shadow-[0_14px_34px_rgba(29,74,53,0.3)] hover:scale-105 active:scale-95 transition-transform duration-200">
              <span className="w-2 h-2 rounded-full bg-[#F2462E] animate-ping" />
              <span className="hidden sm:inline">Click or Press Enter to Step Inside</span>
              <span className="inline sm:hidden">Tap to Step Inside</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="relative z-10 w-full flex items-center justify-between text-[7px] sm:text-[8.5px] font-mono font-semibold tracking-[0.2em] uppercase text-[#1D4A35]/60 border-t border-[#1D4A35]/15 pt-3">
        <span>HARDWARE ACCELERATED</span>
        <span>STANDALONE EXPERIENCE</span>
      </div>

      {/* 2D Liquid Obsidian Wave Wash Overlay (Washes smoothly over screen into Lorenz Attractor) */}
      <div
        ref={liquidWashRef}
        className="fixed inset-0 h-[135vh] w-full pointer-events-none z-50"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            ref={liquidWavePathRef}
            d="M 0 160 C 320 10, 560 270, 920 100 C 1180 -20, 1340 210, 1440 80 L 1440 900 L 0 900 Z"
            fill="#06070B"
          />
        </svg>
      </div>
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
