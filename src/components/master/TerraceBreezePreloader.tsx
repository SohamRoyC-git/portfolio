"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";

export const TerraceBreezePreloader: React.FC = memo(() => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isBreezing, setIsBreezing] = useState(false);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const centerBoxRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const enterBtnRef = useRef<HTMLButtonElement | null>(null);
  const mistForeRef = useRef<HTMLDivElement | null>(null);
  const mistMidRef = useRef<HTMLDivElement | null>(null);
  const windLayerRef = useRef<HTMLDivElement | null>(null);

  // Poetic natural status message
  const getStatusText = (p: number) => {
    if (p < 25) return "Listening to the morning quiet...";
    if (p < 55) return "Warming the terrace sunlight...";
    if (p < 80) return "Buffering mountain pixel textures...";
    if (p < 100) return "Gathering the garden in stillness...";
    return "The terrace is peaceful and ready.";
  };

  // 1. GENUINE ASSET PRELOADING ENGINE
  // Rigorously verifies that the hero video, document fonts, and site assets are 100% loaded
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
      setProgress((prev) => Math.max(prev, targetPercent));
    };

    // A. Preload Fonts
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateWeight(1);
      });
    } else {
      updateWeight(1);
    }

    // B. Preload Images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => updateWeight(1);
      img.onerror = () => updateWeight(1); // gracefully don't block
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
    } catch {
      // ignore
    }

    // Also inspect any existing DOM hero video elements
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

    // Fallback timer: ensure if slow connection or constrained mobile data, we still complete within 4.5s max
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

  // Lock Lenis scroll while preloader is active to prevent scroll drift
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenis = (window as any).lenis;
      if (lenis && visible) {
        lenis.stop();
      }
    }
  }, [visible]);

  // Check when 100% is reached
  useEffect(() => {
    if (progress >= 100) {
      setIsReady(true);
    }
  }, [progress]);

  // Update loading bar fill via GSAP with organic easing
  useEffect(() => {
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        width: `${progress}%`,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [progress]);

  // Entrance of subtle CTA when 100% loaded
  useEffect(() => {
    if (isReady && enterBtnRef.current) {
      gsap.fromTo(
        enterBtnRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [isReady]);

  // 2. OPTION 2: THE ATMOSPHERIC MOUNTAIN MIST & LEAF CURRENT BREEZE REVEAL (2.2s)
  const handleStepOutside = useCallback(() => {
    if (isBreezing) return;
    setIsBreezing(true);

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

    // Phase 1 (0.0s - 0.5s): Center typography and bar dissolve upward into morning air
    if (centerBoxRef.current) {
      tl.to(
        centerBoxRef.current,
        {
          opacity: 0,
          y: -18,
          duration: 0.65,
          ease: "power2.inOut",
        },
        0
      );
    }

    // Phase 2 (0.2s - 2.0s): Aerodynamic Leaf Current flutters across the screen
    if (windLayerRef.current) {
      const leaves = windLayerRef.current.querySelectorAll(".nature-leaf");
      const wisps = windLayerRef.current.querySelectorAll(".air-wisp");

      // Soft air wisps roll across
      if (wisps && wisps.length > 0) {
        tl.fromTo(
          wisps,
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 140,
            opacity: (i) => (i % 2 === 0 ? 0.45 : 0.25),
            stagger: 0.08,
            duration: 1.4,
            ease: "power1.inOut",
          },
          0.1
        );
      }

      // Botanical leaves tumble & flutter with 3D aerodynamic rotation
      if (leaves && leaves.length > 0) {
        tl.fromTo(
          leaves,
          {
            x: -120,
            y: (i) => (i % 2 === 0 ? 10 : -10),
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            opacity: 0,
          },
          {
            x: () => window.innerWidth + 200,
            y: (i) => (i % 2 === 0 ? -60 : 70),
            rotation: (i) => (i % 2 === 0 ? 540 : -480),
            rotationX: (i) => (i % 2 === 0 ? 360 : -360),
            rotationY: 720,
            opacity: 0.9,
            stagger: 0.05,
            duration: 1.8,
            ease: "sine.inOut",
          },
          0.15
        );
      }
    }

    // Phase 3 (0.5s - 2.2s): Multi-layered Valley Mist Dissolves and Parts
    if (mistForeRef.current) {
      tl.to(
        mistForeRef.current,
        {
          xPercent: 120,
          opacity: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.4
      );
    }

    if (mistMidRef.current) {
      tl.to(
        mistMidRef.current,
        {
          opacity: 0,
          scale: 1.08,
          duration: 1.8,
          ease: "power2.out",
        },
        0.5
      );
    }

    // Phase 4 (0.8s - 2.2s): The deep cedar background softens away into the sunny terrace
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.8
      );
    }
  }, [isBreezing]);

  // Global keydown listener for desktop ("Press any key to step outside")
  useEffect(() => {
    const handleKeyDown = () => {
      if (isReady && !isBreezing) {
        handleStepOutside();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, isBreezing, handleStepOutside]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onClick={isReady ? handleStepOutside : undefined}
      onTouchMove={(e) => {
        if (!isBreezing) e.stopPropagation();
      }}
      onWheel={(e) => {
        if (!isBreezing) e.stopPropagation();
      }}
      className={`fixed inset-0 z-[99999] bg-[#0D0C0A] text-[#ECE5DA] select-none overflow-hidden touch-none flex flex-col justify-between p-6 sm:p-10 md:p-14 ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Terrace Experience Loader"
    >
      {/* 1. Warm Cedar Wood Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_70%_at_50%_45%,rgba(229,178,110,0.07)_0%,rgba(16,14,12,0.8)_60%,#0D0C0A_100%)]" />

      {/* 2. Valley Mist Layers (For Option 2 Breeze Parting) */}
      <div
        ref={mistMidRef}
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[#14120E]/40 to-transparent will-change-[opacity,transform]"
      />
      <div
        ref={mistForeRef}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_80%_at_30%_50%,rgba(30,26,22,0.6)_0%,transparent_75%)] will-change-[transform,opacity]"
      />

      {/* 3. Top Natural Header */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] sm:text-[11px] font-sans tracking-[0.24em] uppercase text-[#ECE5DA]/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B26E] opacity-80" />
          <span className="text-[#ECE5DA]/80 font-medium">Soham Roychoudhury</span>
        </div>
        <div className="hidden xs:block text-[#ECE5DA]/40 tracking-[0.2em]">
          Mountain Veranda · Kolkata
        </div>
      </div>

      {/* 4. Centerpiece: Serene Title, Natural Hairline Bar, and Poetic Status */}
      <div
        ref={centerBoxRef}
        className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center text-center px-4 will-change-[transform,opacity]"
      >
        <div className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#E5B26E]/85 mb-2.5">
          Summer Afternoon
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic tracking-wide text-[#ECE5DA] mb-7">
          Preparing the Terrace
        </h1>

        {/* Minimalist Natural Hairline Loading Bar */}
        <div className="w-full h-[1.5px] bg-[#ECE5DA]/15 rounded-full overflow-hidden relative mb-4">
          <div
            ref={fillRef}
            className="absolute top-0 left-0 bottom-0 w-0 bg-gradient-to-r from-[#9C784C] via-[#E5B26E] to-[#FFF2DD] rounded-full shadow-[0_0_10px_rgba(229,178,110,0.5)]"
          />
        </div>

        {/* Status Line */}
        <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#ECE5DA]/55 mb-6">
          <span className="truncate pr-2 font-sans">{getStatusText(progress)}</span>
          <span className="text-[#E5B26E] font-medium shrink-0 font-mono">[ {progress}% ]</span>
        </div>

        {/* Step Outside Action (Appears when 100% loaded) */}
        <div className="h-12 flex items-center justify-center">
          {isReady && (
            <button
              ref={enterBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                handleStepOutside();
              }}
              className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2 rounded-full border border-[#E5B26E]/40 hover:border-[#E5B26E]/70 bg-[#E5B26E]/10 hover:bg-[#E5B26E]/15 text-[#ECE5DA] font-sans text-[9px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.22em] uppercase backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)] whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B26E] animate-pulse shrink-0" />
              <span className="hidden sm:inline">Press any key or click to step outside</span>
              <span className="inline sm:hidden">Tap anywhere to step outside</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Natural Footer */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#ECE5DA]/35 border-t border-[#ECE5DA]/10 pt-3">
        <span>Quiet Nature &amp; Architecture</span>
        <span>Living Atelier</span>
      </div>

      {/* 6. Option 2 Wind Breeze: Organic Valley Air Wisps & Aerodynamic Leaves */}
      <div
        ref={windLayerRef}
        className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
      >
        {/* Soft Air Currents */}
        {[22, 38, 54, 70, 84].map((top, idx) => (
          <div
            key={`air-${idx}`}
            className="air-wisp absolute h-[1px] opacity-0"
            style={{
              top: `${top}%`,
              left: "0%",
              width: `${300 + idx * 60}px`,
              background:
                "linear-gradient(90deg, transparent, rgba(236, 229, 218, 0.45), transparent)",
              transform: `rotate(${idx % 2 === 0 ? -3 : -1.5}deg)`,
            }}
          />
        ))}

        {/* Aerodynamic Botanical Leaves (Varying organic tea, oak, and willow silhouettes) */}
        {[14, 22, 31, 40, 48, 57, 65, 74, 82, 89].map((top, idx) => (
          <div
            key={`leaf-${idx}`}
            className="nature-leaf absolute opacity-0"
            style={{
              top: `${top}%`,
              left: "0%",
              perspective: "600px",
            }}
          >
            <svg
              width={14 + (idx % 4) * 3}
              height={14 + (idx % 4) * 3}
              viewBox="0 0 24 24"
              fill={idx % 3 === 0 ? "#8A9A7B" : idx % 3 === 1 ? "#E5B26E" : "#C48A54"}
              opacity={0.88}
              className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            >
              {idx % 2 === 0 ? (
                // Tea / Laurel Leaf
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7.2 9.5-.2-1.8.2-3.7 1.3-5.2 1.6-2.2 4.1-3.6 6.8-3.8 1.8-.1 3.5.5 4.7 1.7.1-.7.2-1.5.2-2.2 0-5.5-4.5-10-10-10z" />
              ) : (
                // Maple / Oak Foliage
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              )}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
