"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";

export const TerraceBreezePreloader: React.FC = memo(() => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isBreezing, setIsBreezing] = useState(false);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const enterBtnRef = useRef<HTMLButtonElement | null>(null);
  const windOverlayRef = useRef<HTMLDivElement | null>(null);

  // Status message based on loading percentage
  const getStatusText = (p: number) => {
    if (p < 28) return "CALIBRATING TERRACE HABITAT...";
    if (p < 58) return "WARMING PIXEL ART VIDEO TEXTURES...";
    if (p < 85) return "TUNING 3D KINETIC COORDINATES...";
    if (p < 100) return "SYNCHRONIZING MOUNTAIN ATMOSPHERE...";
    return "TERRACE ENVIRONMENT READY";
  };

  // Smooth asset loading simulation with real font/video readiness check
  useEffect(() => {
    let currentP = 0;
    const interval = setInterval(() => {
      // Accelerate towards 100%
      const increment = Math.max(1, Math.floor(Math.random() * 6) + 2);
      currentP = Math.min(100, currentP + increment);
      setProgress(currentP);

      if (currentP >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 45);

    // Ensure fonts and video textures kick in
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        // Boost if fonts are already loaded
        currentP = Math.max(currentP, 40);
      });
    }

    return () => clearInterval(interval);
  }, []);

  // Update loading bar fill via GSAP
  useEffect(() => {
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        width: `${progress}%`,
        duration: 0.15,
        ease: "power1.out",
      });
    }
  }, [progress]);

  // Entrance of interactive prompt when ready
  useEffect(() => {
    if (isReady && enterBtnRef.current) {
      gsap.fromTo(
        enterBtnRef.current,
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
    }
  }, [isReady]);

  // The Morning Breeze Reveal Sequence
  const handleEnter = useCallback(() => {
    if (isBreezing) return;
    setIsBreezing(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
      },
    });

    // 1. Enter button clicks/pops
    if (enterBtnRef.current) {
      tl.to(enterBtnRef.current, { scale: 0.92, opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
    }

    // 2. Wind breeze particles shoot from left to right across the screen
    if (windOverlayRef.current) {
      const leaves = windOverlayRef.current.querySelectorAll(".breeze-leaf");
      const streaks = windOverlayRef.current.querySelectorAll(".breeze-streak");

      // Wind streaks flash across screen with high velocity
      if (streaks && streaks.length > 0) {
        tl.fromTo(
          streaks,
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 140,
            opacity: (i) => (i % 2 === 0 ? 0.85 : 0.6),
            stagger: 0.04,
            duration: 0.75,
            ease: "power2.inOut",
          },
          0.05
        );
      }

      // Floating foliage & leaves drift with flutter
      if (leaves && leaves.length > 0) {
        tl.fromTo(
          leaves,
          { xPercent: -150, yPercent: 0, rotation: 0, opacity: 0 },
          {
            xPercent: 160,
            yPercent: (i) => (i % 2 === 0 ? -40 : 40),
            rotation: (i) => (i % 2 === 0 ? 360 : -360),
            opacity: 1,
            stagger: 0.03,
            duration: 0.95,
            ease: "power1.inOut",
          },
          0.08
        );
      }
    }

    // 3. The dark preloader curtain parts with an organic wind-wipe
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          opacity: 0.85,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0.20
      );
    }
  }, [isBreezing]);

  // Global keydown listener for desktop ("Press any key to enter")
  useEffect(() => {
    const handleKeyDown = () => {
      if (isReady && !isBreezing) {
        handleEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, isBreezing, handleEnter]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onClick={isReady ? handleEnter : undefined}
      className={`fixed inset-0 z-[99999] bg-[#07080B] text-[#F8F5EE] select-none overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-12 transition-colors ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }}
      aria-label="Terrace Atelier Loading Experience"
    >
      {/* 1. Ambient Warm Terrace Lantern Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_70%_at_50%_50%,rgba(255,140,56,0.12)_0%,rgba(20,10,8,0.5)_55%,transparent_100%)]" />

      {/* 2. Starlit Celestial Dust Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.8)_1px,transparent_1px),radial-gradient(circle_at_80%_30%,rgba(255,215,160,0.7)_1.5px,transparent_1.5px),radial-gradient(circle_at_45%_70%,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:140px_140px]" />

      {/* 3. Corner Atelier Crosshairs */}
      <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
      <span className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
      <span className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
      <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>

      {/* 4. Top Telemetry Header Bar */}
      <div className="relative z-10 w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.22em] uppercase text-[#CBB59D]/70">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] shadow-[0_0_8px_#FF8C38] animate-pulse" />
          <span className="text-[#EAD7C0]">ATELIER CALIBRATION</span>
        </div>
        <div className="hidden xs:block text-white/50">
          KOLKATA // LAT 22.5726° N · LON 88.3639° E
        </div>
      </div>

      {/* 5. Centerpiece: Emblem, Hairline Progress Bar & Interactive Enter Prompt */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center text-center px-4">
        {/* Minimal Animated Leaf/Sun Emblem */}
        <div className="relative w-11 h-11 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#FF8C38]/30 border-t-[#FF8C38] animate-spin" style={{ animationDuration: "6s" }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>

        <div className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-[#FF8C38] mb-2">
          CYBER-PASTORAL TERRACE
        </div>
        <h2 className="text-xl sm:text-2xl font-sans font-black tracking-tight uppercase text-[#FFFDF8] mb-6">
          INITIALIZING DIGITAL HABITAT
        </h2>

        {/* Sleek Hairline Horizontal Loading Bar */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-4">
          <div
            ref={fillRef}
            className="absolute top-0 left-0 bottom-0 w-0 bg-gradient-to-r from-[#EA580C] via-[#FF8C38] to-[#FEF08A] rounded-full shadow-[0_0_12px_#FF8C38,0_0_24px_rgba(255,140,56,0.8)]"
          />
        </div>

        {/* Status Telemetry Line */}
        <div className="w-full flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#EAD7C0]/70 mb-2">
          <span className="truncate pr-2">{getStatusText(progress)}</span>
          <span className="text-[#FF8C38] font-bold shrink-0">[ {progress}% ]</span>
        </div>

        {/* Interactive Enter Action (Appears when 100% loaded) */}
        <div className="h-14 flex items-center justify-center mt-2">
          {isReady && (
            <button
              ref={enterBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#FF8C38]/15 hover:bg-[#FF8C38]/25 border border-[#FF8C38]/40 hover:border-[#FF8C38]/70 text-[#FFFDF8] font-sans font-bold text-xs uppercase tracking-[0.22em] backdrop-blur-md shadow-[0_0_25px_rgba(255,140,56,0.25)] transition-all duration-300 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF8C38] shadow-[0_0_8px_#FF8C38] animate-ping" />
              <span>TAP / PRESS ANY KEY TO ENTER</span>
            </button>
          )}
        </div>
      </div>

      {/* 6. Footer Telemetry Bar */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-[0.2em] uppercase text-[#CBB59D]/50 border-t border-white/5 pt-3">
        <span>DIGITAL OPERATIONS · SPATIAL COUTURE</span>
        <span>ATELIER 2026 // ALL SYSTEMS OPTIMAL</span>
      </div>

      {/* 7. Wind Breeze Overlay Particles & High-Speed Streaks */}
      <div
        ref={windOverlayRef}
        className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
      >
        {/* Dynamic Wind Streaks */}
        {[20, 35, 52, 68, 82].map((top, idx) => (
          <div
            key={`streak-${idx}`}
            className="breeze-streak absolute h-[1px] opacity-0"
            style={{
              top: `${top}%`,
              left: "0%",
              width: `${260 + idx * 50}px`,
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)",
              boxShadow: "0 0 10px rgba(255, 200, 140, 0.6)",
              transform: `rotate(${idx % 2 === 0 ? -4 : -2}deg)`,
            }}
          />
        ))}

        {/* Floating Ghibli Foliage / Leaf Particles */}
        {[15, 28, 42, 58, 72, 85].map((top, idx) => (
          <div
            key={`leaf-${idx}`}
            className="breeze-leaf absolute opacity-0"
            style={{
              top: `${top}%`,
              left: "0%",
            }}
          >
            <svg
              width={16 + (idx % 3) * 4}
              height={16 + (idx % 3) * 4}
              viewBox="0 0 24 24"
              fill={idx % 2 === 0 ? "#FF8C38" : "#FBBF24"}
              opacity={0.85}
              className="drop-shadow-[0_0_8px_rgba(255,140,56,0.6)]"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
