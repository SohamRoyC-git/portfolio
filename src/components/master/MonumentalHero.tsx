"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT_LINES = [
  {
    words: [
      { text: "I", highlight: false },
      { text: "shape", highlight: false },
      { text: "the", highlight: false },
      { text: "digital", highlight: false },
      { text: "void", highlight: false },
    ],
  },
  {
    words: [
      { text: "into", highlight: false },
      { text: "high-precision", highlight: false },
      { text: "spatial", highlight: false },
      { text: "couture,", highlight: false },
    ],
  },
  {
    words: [
      { text: "architecting", highlight: false },
      { text: "autonomous", highlight: false },
      { text: "intelligence", highlight: false },
    ],
  },
  {
    words: [
      { text: "and", highlight: false },
      { text: "monumental", highlight: false },
      { text: "digital", highlight: true },
      { text: "environments.", highlight: true },
    ],
  },
];

// Concept 1 + 3 Hybrid: Quantum Stardust & Anamorphic Speed Particles
const WARP_PARTICLES = [
  { left: "10%", top: "12%", width: 2, height: 32, color: "#FF8C38", opacity: 0.8 },
  { left: "22%", top: "6%", width: 1.5, height: 44, color: "#F5EEDA", opacity: 0.9 },
  { left: "38%", top: "18%", width: 2, height: 55, color: "#FFFDF8", opacity: 0.85 },
  { left: "55%", top: "10%", width: 1.5, height: 38, color: "#FF8C38", opacity: 0.8 },
  { left: "70%", top: "22%", width: 2, height: 48, color: "#F5EEDA", opacity: 0.9 },
  { left: "86%", top: "8%", width: 1.5, height: 34, color: "#EAD7C0", opacity: 0.75 },
  { left: "16%", top: "42%", width: 2, height: 50, color: "#FFFDF8", opacity: 0.85 },
  { left: "32%", top: "48%", width: 1.5, height: 40, color: "#FF8C38", opacity: 0.75 },
  { left: "48%", top: "44%", width: 2.5, height: 64, color: "#F5EEDA", opacity: 0.95 },
  { left: "64%", top: "54%", width: 1.5, height: 42, color: "#FFFDF8", opacity: 0.8 },
  { left: "82%", top: "46%", width: 2, height: 46, color: "#FF8C38", opacity: 0.75 },
  { left: "8%", top: "66%", width: 1.5, height: 32, color: "#EAD7C0", opacity: 0.7 },
  { left: "26%", top: "72%", width: 2, height: 44, color: "#F5EEDA", opacity: 0.85 },
  { left: "44%", top: "80%", width: 1.5, height: 38, color: "#FF8C38", opacity: 0.8 },
  { left: "60%", top: "70%", width: 2, height: 54, color: "#FFFDF8", opacity: 0.9 },
  { left: "76%", top: "76%", width: 1.5, height: 36, color: "#F5EEDA", opacity: 0.75 },
  { left: "90%", top: "82%", width: 2, height: 45, color: "#FF8C38", opacity: 0.8 },
  { left: "14%", top: "28%", width: 3, height: 3, color: "#FFFDF8", opacity: 0.9 },
  { left: "52%", top: "32%", width: 4, height: 4, color: "#FF8C38", opacity: 0.95 },
  { left: "80%", top: "36%", width: 3, height: 3, color: "#F5EEDA", opacity: 0.85 },
  { left: "30%", top: "62%", width: 3, height: 3, color: "#FF8C38", opacity: 0.8 },
  { left: "68%", top: "86%", width: 4, height: 4, color: "#FFFDF8", opacity: 0.9 },
];

interface MonumentalHeroProps {
  onExplore: () => void;
  onConnect?: () => void;
}

export const MonumentalHero: React.FC<MonumentalHeroProps> = memo(({ onExplore, onConnect }) => {
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0, active: false });

  // Mobile 3D Camera Depth Tunnel Refs (Zero Y-axis scroll · Pure Z-depth)
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileStageRef = useRef<HTMLDivElement | null>(null);
  const mobileVideoWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileBackdropVeilRef = useRef<HTMLDivElement | null>(null);
  const laptopCueRef = useRef<HTMLDivElement | null>(null);
  const mobileBottomHudRef = useRef<HTMLDivElement | null>(null);

  // Hero Identity Plane Refs
  const mobileIdentityRef = useRef<HTMLDivElement | null>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mobileMetaRef = useRef<HTMLDivElement | null>(null);
  const mobileSubtitleRef = useRef<HTMLParagraphElement | null>(null);
  const mobileActionsRef = useRef<HTMLDivElement | null>(null);

  // Luminous Aperture Portal Refs (Technique 1: The Doctor Strange / A24 Gateway)
  const portalRingRef = useRef<HTMLDivElement | null>(null);
  const statementContainerRef = useRef<HTMLDivElement | null>(null);

  // Architectural Statement Plane Refs
  const mobileStatementRef = useRef<HTMLDivElement | null>(null);
  const statementMetaRef = useRef<HTMLDivElement | null>(null);
  const statementHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const statementDividerTopRef = useRef<HTMLDivElement | null>(null);
  const statementDividerBottomRef = useRef<HTMLDivElement | null>(null);
  const statementAttributionRef = useRef<HTMLDivElement | null>(null);

  // Concept 1 + 3 Hybrid: Cosmic Anamorphic Warp & Particle Matrix Deconstruction Refs
  const singularityCoreRef = useRef<HTMLDivElement | null>(null);
  const anamorphicStreaksRef = useRef<HTMLDivElement | null>(null);
  const particleMatrixRef = useRef<HTMLDivElement | null>(null);
  const holoGridHorizonRef = useRef<HTMLDivElement | null>(null);

  // Desktop Refs
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLDivElement | null>(null);

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    if (touch && mobileStageRef.current) {
      const rect = mobileStageRef.current.getBoundingClientRect();
      setTouchPos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchPos((prev) => ({ ...prev, active: false }));
  };

  const handleExploreClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && mobileContainerRef.current) {
      const targetScroll =
        mobileContainerRef.current.offsetTop +
        (mobileContainerRef.current.offsetHeight - window.innerHeight) * 0.82;
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.0 });
      } else {
        const scroller = document.getElementById("app-scroller");
        if (scroller) scroller.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    } else {
      onExplore();
    }
  };

  const handleConnectClick = () => {
    if (onConnect) {
      onConnect();
    } else {
      const el = document.getElementById("monument-terminal");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // MOBILE TIMELINE (< 768px): CONTINUOUS 3D CAMERA DEPTH TUNNEL
    // Zero Y-Axis Page Scrolling · Pure Z-Axis Camera Flight Deeper into Space
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      if (!mobileContainerRef.current) return;

      // 1. Initial State Setup
      if (mobileVideoWrapperRef.current) {
        gsap.set(mobileVideoWrapperRef.current, { opacity: 1, scale: 1 });
      }

      if (mobileBackdropVeilRef.current) {
        gsap.set(mobileBackdropVeilRef.current, { opacity: 0 });
      }

      if (mobileIdentityRef.current) {
        gsap.set(mobileIdentityRef.current, { opacity: 0, pointerEvents: "none" });
      }

      if (mobileTitleRef.current) {
        gsap.set(mobileTitleRef.current, {
          scale: 0.94,
          y: 24,
          opacity: 0,
          transformOrigin: "center center",
        });
      }

      if (mobileMetaRef.current) gsap.set(mobileMetaRef.current, { opacity: 0, y: 14 });
      if (mobileSubtitleRef.current) gsap.set(mobileSubtitleRef.current, { opacity: 0, y: 14 });
      if (mobileActionsRef.current) gsap.set(mobileActionsRef.current, { opacity: 0, y: 16 });
      if (laptopCueRef.current) gsap.set(laptopCueRef.current, { opacity: 1, y: 0 });
      if (mobileBottomHudRef.current) gsap.set(mobileBottomHudRef.current, { opacity: 1, y: 0 });

      // Stargate Portal Ring & Statement Initial Setup
      if (portalRingRef.current) {
        gsap.set(portalRingRef.current, {
          scale: 0.1,
          opacity: 0,
        });
      }

      if (mobileStatementRef.current) {
        gsap.set(mobileStatementRef.current, {
          clipPath: "circle(0% at 50% 50%)",
          opacity: 0,
          pointerEvents: "none",
        });
      }

      if (statementContainerRef.current) {
        gsap.set(statementContainerRef.current, {
          scale: 0.72,
          y: 20,
          opacity: 0.5,
          transformOrigin: "center center",
        });
      }

      if (statementDividerTopRef.current && statementDividerBottomRef.current) {
        gsap.set([statementDividerTopRef.current, statementDividerBottomRef.current], {
          scaleX: 0,
          transformOrigin: "center center",
        });
      }

      if (statementMetaRef.current) gsap.set(statementMetaRef.current, { opacity: 0, y: -8 });
      if (statementAttributionRef.current) gsap.set(statementAttributionRef.current, { opacity: 0, y: 8 });

      // Concept 1 + 3 Hybrid: Cosmic Anamorphic Warp initial states
      if (singularityCoreRef.current) gsap.set(singularityCoreRef.current, { scale: 0.1, opacity: 0 });
      if (anamorphicStreaksRef.current) gsap.set(anamorphicStreaksRef.current, { scaleX: 0.05, opacity: 0 });
      if (particleMatrixRef.current) gsap.set(particleMatrixRef.current, { opacity: 0, y: -20, scale: 0.85 });
      if (holoGridHorizonRef.current) gsap.set(holoGridHorizonRef.current, { opacity: 0, scaleY: 0.2 });

      const statementWords = statementHeadlineRef.current?.querySelectorAll(".statement-word");
      if (statementWords && statementWords.length > 0) {
        gsap.set(statementWords, {
          opacity: 0.2,
          color: "rgba(234, 215, 192, 0.2)",
          textShadow: "0 0 0px transparent",
        });
      }

      // Continuous Idle Levitation on Laptop Micro-Cue
      let cueTween: gsap.core.Tween | null = null;
      if (laptopCueRef.current) {
        cueTween = gsap.to(laptopCueRef.current, {
          y: -6,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 2. Silky Continuous Scroll Scrub Timeline across 280vh of thumb travel (Normalized to 10.0s)
      // Viewport remains 100% frozen on the Y-axis: ZERO vertical page scroll!
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            const videoEl = mobileVideoWrapperRef.current?.querySelector("video");
            if (videoEl) {
              if (self.progress >= 0.74 && !videoEl.paused) {
                videoEl.pause();
              } else if (self.progress < 0.74 && videoEl.paused) {
                videoEl.play().catch(() => {});
              }
            }

            if (mobileIdentityRef.current) {
              mobileIdentityRef.current.style.pointerEvents =
                self.progress >= 0.35 && self.progress <= 0.48 ? "auto" : "none";
            }
          },
        },
      });

      // Phase 1 (0.00 -> 1.50): Cue & initial bottom hint dissolve early
      if (laptopCueRef.current) {
        masterTl.to(laptopCueRef.current, { opacity: 0, y: -18, scale: 0.92, duration: 1.4, ease: "power2.out" }, 0);
      }
      if (mobileBottomHudRef.current) {
        masterTl.to(mobileBottomHudRef.current, { opacity: 0, y: 12, duration: 1.4, ease: "power2.out" }, 0);
      }

      // Phase 2 (0.00 -> 3.50): Optical Camera Push-In into Living Terrace
      if (mobileVideoWrapperRef.current) {
        masterTl.to(mobileVideoWrapperRef.current, { scale: 1.08, duration: 3.5, ease: "power1.inOut" }, 0);
      }
      if (mobileBackdropVeilRef.current) {
        masterTl.to(mobileBackdropVeilRef.current, { opacity: 0.75, duration: 3.5, ease: "power1.inOut" }, 0);
      }

      // Phase 3 (1.50 -> 3.50): Monumental Identity materializes in center frame from depth
      if (mobileIdentityRef.current) {
        masterTl.to(mobileIdentityRef.current, { opacity: 1, duration: 1.2, ease: "power1.out" }, 1.5);
      }
      if (mobileTitleRef.current) {
        masterTl.to(mobileTitleRef.current, { opacity: 1, scale: 1.0, y: 0, duration: 2.0, ease: "power2.out" }, 1.5);
      }
      if (mobileMetaRef.current) {
        masterTl.to(mobileMetaRef.current, { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" }, 1.7);
      }
      if (mobileSubtitleRef.current) {
        masterTl.to(mobileSubtitleRef.current, { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" }, 1.9);
      }
      if (mobileActionsRef.current) {
        masterTl.to(mobileActionsRef.current, { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" }, 2.1);
      }

      // Phase 4 (3.50 -> 4.60): Reading Hold for Soham Roychoudhury (Interactive buttons active)
      masterTl.to({}, { duration: 1.1 }, 3.5);

      // Phase 5 (4.60 -> 5.40): IDENTITY DISSOLVE & PORTAL APERTURE IGNITION
      // Identity elements gracefully scale outward and clear the frame for the portal
      if (mobileActionsRef.current) {
        masterTl.to(mobileActionsRef.current, { opacity: 0, y: 14, scale: 0.90, duration: 0.6, ease: "power2.in" }, 4.6);
      }
      if (mobileMetaRef.current) {
        masterTl.to(mobileMetaRef.current, { opacity: 0, y: -10, scale: 0.90, duration: 0.6, ease: "power2.in" }, 4.6);
      }
      if (mobileSubtitleRef.current) {
        masterTl.to(mobileSubtitleRef.current, { opacity: 0, y: 10, scale: 0.92, duration: 0.6, ease: "power2.in" }, 4.6);
      }
      if (mobileTitleRef.current) {
        masterTl.to(mobileTitleRef.current, { scale: 1.30, opacity: 0, y: -20, duration: 0.7, ease: "power2.in" }, 4.6);
      }

      // Glowing Stargate Ring ignites and expands into the center landscape (scale 1.0, 220px diameter)
      if (portalRingRef.current) {
        masterTl.to(portalRingRef.current, { scale: 1.0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }, 4.6);
      }
      // Circular portal aperture opens cleanly into the Twilight Landscape Realm (28.2% radius matches 220px ring)
      if (mobileStatementRef.current) {
        masterTl.to(mobileStatementRef.current, { opacity: 1, clipPath: "circle(28.2% at 50% 50%)", duration: 0.8, ease: "power2.out" }, 4.6);
      }

      // Phase 5B (5.40 -> 5.80): Portal Gateway Hold (Viewer sees the Stargate hovering in the terrace landscape)
      masterTl.to({}, { duration: 0.4 }, 5.4);

      // Phase 6 (5.80 -> 7.40): THE 3D PORTAL BREACH & PLUNGE (Camera flies through Stargate into Twilight Realm)
      // The Stargate ring expands massively past the phone screen edges (breaching the threshold)
      if (portalRingRef.current) {
        masterTl.to(portalRingRef.current, { scale: 7.0, opacity: 0, duration: 1.6, ease: "power2.in" }, 5.8);
      }

      // The portal clipPath expands to 140%, completely engulfing the entire phone screen
      if (mobileStatementRef.current) {
        masterTl.to(mobileStatementRef.current, { clipPath: "circle(140% at 50% 50%)", duration: 1.6, ease: "power2.in" }, 5.8);
      }

      // Statement content zooms from 0.72 to 1.0 into focal lock
      if (statementContainerRef.current) {
        masterTl.to(statementContainerRef.current, { scale: 1.0, opacity: 1, y: 0, duration: 1.6, ease: "power2.out" }, 5.8);
      }

      // Terrace video dissolves as portal engulfs screen
      if (mobileVideoWrapperRef.current) {
        masterTl.to(mobileVideoWrapperRef.current, { scale: 1.35, opacity: 0, duration: 1.6, ease: "power2.in" }, 5.8);
      }
      if (mobileBackdropVeilRef.current) {
        masterTl.to(mobileBackdropVeilRef.current, { opacity: 1.0, duration: 1.6, ease: "power2.in" }, 5.8);
      }

      // Laser hairlines and meta bar ignite as viewer emerges into the Twilight Realm
      if (statementDividerTopRef.current && statementDividerBottomRef.current) {
        masterTl.to([statementDividerTopRef.current, statementDividerBottomRef.current], { scaleX: 1, duration: 1.2, ease: "power2.out" }, 6.6);
      }
      if (statementMetaRef.current) {
        masterTl.to(statementMetaRef.current, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, 6.8);
      }

      // Phase 7 (7.40 -> 9.20): Forge Automotive Text Fill Wave scrubs across words
      if (statementWords && statementWords.length > 0) {
        masterTl.fromTo(
          statementWords,
          { opacity: 0.2, color: "rgba(234, 215, 192, 0.2)", textShadow: "0 0 0px transparent" },
          {
            opacity: 1,
            color: (index, target) => ((target as HTMLElement).getAttribute("data-highlight") === "amber" ? "#FF8C38" : "#FFFDF8"),
            textShadow: (index, target) =>
              (target as HTMLElement).getAttribute("data-highlight") === "amber"
                ? "0 0 24px rgba(255, 140, 56, 0.75)"
                : "0 0 14px rgba(255, 253, 248, 0.35)",
            stagger: 0.08,
            duration: 0.35,
            ease: "power1.out",
          },
          7.4
        );
      }
      if (statementAttributionRef.current) {
        masterTl.to(statementAttributionRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 8.8);
      }

      // Phase 8 (8.80 -> 9.15): Luxury Hold for illuminated statement in Twilight Realm
      masterTl.to({}, { duration: 0.35 }, 8.80);

      // Phase 9A (9.15 -> 9.48): Concept 3 - Wireframe Skeleton Deconstruction & Quantum Particles Awaken
      if (statementWords && statementWords.length > 0) {
        masterTl.to(
          statementWords,
          {
            color: "transparent",
            webkitTextStroke: "1px rgba(245, 238, 218, 0.9)",
            textShadow: "0 0 16px rgba(255, 140, 56, 0.65)",
            stagger: 0.012,
            duration: 0.32,
            ease: "power2.out",
          },
          9.15
        );
      }
      if (statementDividerTopRef.current && statementDividerBottomRef.current) {
        masterTl.to(
          [statementDividerTopRef.current, statementDividerBottomRef.current],
          {
            backgroundColor: "transparent",
            boxShadow: "0 0 18px rgba(255, 140, 56, 0.85)",
            duration: 0.30,
          },
          9.15
        );
      }
      // Quantum stardust particles materialize as typography deconstructs
      if (particleMatrixRef.current) {
        masterTl.to(
          particleMatrixRef.current,
          { opacity: 1, scale: 1.0, y: 0, duration: 0.32, ease: "power2.out" },
          9.18
        );
      }
      if (holoGridHorizonRef.current) {
        masterTl.to(
          holoGridHorizonRef.current,
          { opacity: 0.45, scaleY: 1.0, duration: 0.35, ease: "power2.out" },
          9.20
        );
      }

      // Phase 9B (9.48 -> 10.00): Concept 1 - Anamorphic Streak Warp & Event Horizon Acceleration
      // Central singularity flare expands into deep cosmic void
      if (singularityCoreRef.current) {
        masterTl.to(
          singularityCoreRef.current,
          { scale: 3.6, opacity: 1, duration: 0.50, ease: "power2.in" },
          9.48
        );
        masterTl.to(
          singularityCoreRef.current,
          { opacity: 0, duration: 0.15, ease: "power1.out" },
          9.85
        );
      }
      // Horizontal anamorphic laser streaks flash across the lens
      if (anamorphicStreaksRef.current) {
        masterTl.to(
          anamorphicStreaksRef.current,
          { scaleX: 18.0, opacity: 1, duration: 0.40, ease: "power2.inOut" },
          9.50
        );
        masterTl.to(
          anamorphicStreaksRef.current,
          { opacity: 0, duration: 0.15, ease: "power2.out" },
          9.85
        );
      }
      // Camera rockets THROUGH the wireframe typography into deep space
      if (statementContainerRef.current) {
        masterTl.to(
          statementContainerRef.current,
          {
            scale: 2.8,
            y: -50,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.48,
            ease: "power3.in",
          },
          9.50
        );
      }
      // Quantum stardust particles stream past the camera at hyper-speed
      if (particleMatrixRef.current) {
        masterTl.to(
          particleMatrixRef.current,
          {
            y: 420,
            scaleY: 3.8,
            opacity: 0,
            duration: 0.48,
            ease: "power3.in",
          },
          9.50
        );
      }
      if (holoGridHorizonRef.current) {
        masterTl.to(
          holoGridHorizonRef.current,
          { y: 150, opacity: 0, duration: 0.45, ease: "power2.in" },
          9.52
        );
      }

      return () => {
        if (cueTween) cueTween.kill();
      };
    });

    // =========================================================================
    // DESKTOP TIMELINE (>= 768px):
    // High-Art Gallery Hero with Video Dissolve Parallax
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      if (desktopVideoRef.current && desktopSectionRef.current) {
        gsap.to(desktopVideoRef.current, {
          y: 60,
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: desktopSectionRef.current,
            start: "45% top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="monument-hero" className="relative w-full overflow-visible">
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE (< 768px): UNIFIED 3D CAMERA DEPTH TUNNEL                */}
      {/* Zero Y-Axis Page Scrolling · Pure Z-Axis Camera Flight Deeper into Space   */}
      {/* ========================================================================= */}
      <div
        ref={mobileContainerRef}
        className="md:hidden relative w-full h-[280vh] bg-[#060709] overflow-clip"
      >
        {/* Navigation & Explore Anchor for Statement phase */}
        <div
          id="monument-statement-mobile"
          className="absolute top-[55%] inset-x-0 h-[1px] pointer-events-none"
        />

        {/* 100svh Sticky 3D Camera Viewport (Zero Y-axis translation throughout!) */}
        <div
          ref={mobileStageRef}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="sticky top-0 h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#060709] select-none [perspective:1200px]"
        >
          {/* 1. Full-Bleed Living Pixel-Art Terrace Video Layer */}
          <div
            ref={mobileVideoWrapperRef}
            className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden will-change-[transform,opacity]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-[85%_60%]"
            >
              <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
              <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* 2. Deep Obsidian-Wine Atmosphere Veil (Smooth filmic dissolve into living void) */}
          <div
            ref={mobileBackdropVeilRef}
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#120408]/92 via-[#0A0205]/88 to-[#060103]/98 will-change-[opacity]"
          />

          {/* 3. Understated Editorial Swiss Laptop Micro-Cue */}
          <div
            ref={laptopCueRef}
            className="absolute pointer-events-none z-20 flex flex-col items-center will-change-[transform,opacity]"
            style={{
              left: "56%",
              top: "47%",
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
              <span className="font-sans font-bold text-[9px] tracking-[0.2em] text-white/95 uppercase">
                TERRACE
              </span>
              <span className="text-white/30 text-[8px]">•</span>
              <span className="font-sans font-medium text-[9px] tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                <span>Swipe to enter</span>
                <ArrowDown size={10} className="text-[#FF7A00] animate-bounce" />
              </span>
            </div>
            <div className="w-[1px] h-3.5 bg-gradient-to-b from-[#FF5500]/60 to-transparent mx-auto" />
            <div className="w-1 h-1 rounded-full bg-[#FF5500] mx-auto -mt-0.5" />
          </div>

          {/* 4. Initial Mobile Bottom Hint HUD */}
          <div
            ref={mobileBottomHudRef}
            className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between text-[9px] font-mono text-white/70 uppercase tracking-widest pointer-events-none"
          >
            <span>KOLKATA // STUDIO</span>
            <span className="flex items-center gap-1.5 text-[#FF8C38] font-bold">
              <span>SCROLL TO ENTER</span>
              <ArrowDown size={11} className="animate-bounce" />
            </span>
          </div>

          {/* 5. HERO IDENTITY PLANE (Z=0 -> Flies Past Lens to Z=+600) */}
          <div
            ref={mobileIdentityRef}
            className="absolute inset-0 z-20 flex flex-col justify-between pt-24 pb-8 px-6 text-center will-change-[transform,opacity] pointer-events-none opacity-0 [transform-style:preserve-3d]"
          >
            <div />

            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center my-auto">
              <div
                ref={mobileMetaRef}
                className="inline-flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-[0.24em] text-orange-200/90 mb-5 px-3.5 py-1 rounded-full border border-orange-500/25 bg-black/50 backdrop-blur-md shadow-lg will-change-[transform,opacity]"
              >
                <Sparkles size={10} className="text-[#FF7A00]" />
                <span>NSEC (2024–2028)</span>
              </div>

              <h1
                ref={mobileTitleRef}
                className="relative flex flex-col items-center justify-center text-center select-none mb-4 overflow-visible will-change-transform"
              >
                <span className="font-citadel font-normal text-[4.8rem] xs:text-[5.8rem] sm:text-[6.8rem] text-[#FFFDF8] leading-[0.8] relative z-20 -mb-2.5 xs:-mb-4 -translate-x-3 xs:-translate-x-6 drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
                  Soham
                </span>
                <span className="font-helvetica font-normal text-[3.4rem] xs:text-[4.2rem] sm:text-[4.8rem] text-[#F8F5EE] tracking-[0.025em] leading-[1.0] pb-2 sm:pb-3 relative z-10 drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)] overflow-visible inline-block">
                  Roychoudhury
                </span>
              </h1>

              <p
                ref={mobileSubtitleRef}
                className="font-helvetica font-normal text-xs xs:text-sm text-orange-100/90 tracking-[0.14em] uppercase leading-relaxed mb-7 max-w-xs px-1 drop-shadow-md will-change-[transform,opacity]"
              >
                Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
              </p>

              <div
                ref={mobileActionsRef}
                className="flex items-center justify-center gap-3 w-full max-w-xs will-change-[transform,opacity]"
              >
                <button
                  onClick={handleExploreClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-orange-100 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xl active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowDown size={13} />
                </button>

                <button
                  onClick={handleConnectClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/25 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer backdrop-blur-md active:scale-95 shadow-lg"
                >
                  <span>Contact</span>
                  <ArrowUpRight size={13} className="text-orange-300" />
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-orange-200/60 uppercase tracking-widest pt-2">
              <span>KOLKATA // LAT 22.5726° N</span>
              <span>ATELIER 2026</span>
            </div>
          </div>

          {/* 6. THE DIMENSIONAL TWILIGHT REALM & ARCHITECTURAL STATEMENT */}
          <div
            ref={mobileStatementRef}
            className="absolute inset-0 z-20 flex flex-col justify-center px-6 text-left will-change-[transform,opacity,clip-path] pointer-events-none opacity-0 bg-[#060709]"
            style={{
              clipPath: "circle(0% at 50% 50%)",
            }}
          >
            {/* Deep Obsidian Cosmic Vacuum Background (Pure high-art space) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#090B10] via-[#060709] to-[#030406]" />

            {/* Deep Ambient Cosmic Glow */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none bg-[radial-gradient(ellipse_120%_60%_at_50%_90%,rgba(255,140,56,0.12)_0%,transparent_80%)]" />

            {/* Starlit Celestial Dust Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.12)_1px,transparent_1px),radial-gradient(circle_at_75%_35%,rgba(255,140,56,0.15)_1.5px,transparent_1.5px),radial-gradient(circle_at_45%_70%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:80px_80px]" />

            {/* Atelier Corner Crosshairs */}
            <span className="absolute top-6 left-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
            <span className="absolute top-6 right-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
            <span className="absolute bottom-6 left-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>
            <span className="absolute bottom-6 right-6 font-mono text-[10px] text-[#FF8C38]/40 select-none pointer-events-none">+</span>

            {/* Specular Amber Finger Touch Spotlight */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
              style={{
                opacity: touchPos.active ? 1 : 0,
                background: `radial-gradient(circle 240px at ${touchPos.x}px ${touchPos.y}px, rgba(255, 140, 56, 0.22), transparent 70%)`,
              }}
            />

            {/* Concept 1 + 3 Hybrid: Event Horizon Singularity & Anamorphic Warp System */}
            {/* 1. Central Event Horizon Singularity Core */}
            <div
              ref={singularityCoreRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none will-change-[transform,opacity]"
              style={{
                background: "radial-gradient(circle, rgba(255, 248, 235, 0.95) 0%, rgba(255, 140, 56, 0.55) 24%, rgba(180, 70, 20, 0.15) 55%, transparent 75%)",
                boxShadow: "0 0 50px rgba(255, 140, 56, 0.6), 0 0 100px rgba(255, 110, 30, 0.3)",
              }}
            />

            {/* 2. Anamorphic Horizontal Laser Flares (Needle-sharp speed streaks) */}
            <div
              ref={anamorphicStreaksRef}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none will-change-[transform,opacity] flex flex-col items-center justify-center gap-5"
            >
              {/* Center Primary Flare */}
              <div
                className="w-full h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255, 140, 56, 0.3) 15%, rgba(255, 248, 235, 1) 50%, rgba(255, 140, 56, 0.3) 85%, transparent 100%)",
                  boxShadow: "0 0 16px rgba(255, 200, 120, 0.9), 0 0 35px rgba(255, 140, 56, 0.7)",
                }}
              />
              {/* Satellite Upper Flare */}
              <div
                className="w-3/4 h-[1px] opacity-75"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255, 140, 56, 0.2) 20%, rgba(255, 245, 220, 0.9) 50%, rgba(255, 140, 56, 0.2) 80%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(255, 160, 60, 0.6)",
                }}
              />
              {/* Satellite Lower Flare */}
              <div
                className="w-3/4 h-[1px] opacity-75"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255, 140, 56, 0.2) 20%, rgba(255, 245, 220, 0.9) 50%, rgba(255, 140, 56, 0.2) 80%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(255, 160, 60, 0.6)",
                }}
              />
            </div>

            {/* 3. Quantum Stardust Particle Matrix (Continuity with 3D Lorenz Attractor) */}
            <div
              ref={particleMatrixRef}
              className="absolute inset-0 pointer-events-none will-change-[transform,opacity] overflow-hidden"
            >
              {WARP_PARTICLES.map((p, idx) => (
                <div
                  key={idx}
                  className="absolute rounded-full"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: `${p.width}px`,
                    height: `${p.height}px`,
                    opacity: p.opacity,
                    background:
                      p.height > 6
                        ? `linear-gradient(to bottom, transparent, ${p.color}, #FFFDF8)`
                        : p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                  }}
                />
              ))}
            </div>

            {/* 4. Architectural Perspective Holographic Grid Horizon */}
            <div
              ref={holoGridHorizonRef}
              className="absolute inset-x-0 bottom-0 h-48 pointer-events-none will-change-[transform,opacity] opacity-0"
              style={{
                perspective: "500px",
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  transform: "rotateX(72deg)",
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 140, 56, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 140, 56, 0.15) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
                }}
              />
            </div>

            <div
              ref={statementContainerRef}
              className="relative z-20 w-full max-w-sm mx-auto flex flex-col justify-center will-change-transform"
            >
              {/* Architectural Meta Bar */}
              <div
                ref={statementMetaRef}
                className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.24em] text-[#CBB59D] mb-4 pb-1 will-change-[transform,opacity]"
              >
                <span className="text-[#EAD7C0]">ARCHITECTURAL STATEMENT</span>
                <span className="text-[#FF8C38]">TERRACE PERSPECTIVE</span>
              </div>

              {/* Top Laser Hairline Divider */}
              <div
                ref={statementDividerTopRef}
                className="w-full h-[1px] bg-[#EAD7C0]/25 mb-5 will-change-transform shadow-[0_0_8px_rgba(255,140,56,0.3)] origin-center"
              />

              {/* Monumental All-Caps Statement with Forge Text Fill Wave */}
              <h2
                ref={statementHeadlineRef}
                className="font-sans font-black text-xl xs:text-2xl tracking-tight leading-[1.14] uppercase text-[#EAD7C0] mb-5 select-none"
              >
                {STATEMENT_LINES.map((line, lIdx) => (
                  <div key={lIdx} className="overflow-hidden py-1">
                    <span className="statement-line inline-block w-full">
                      {line.words.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          data-highlight={word.highlight ? "amber" : "none"}
                          className={`statement-word inline-block mr-[0.26em] transition-colors duration-150 ${
                            word.highlight ? "text-[#FF8C38]" : "text-[#EAD7C0]"
                          }`}
                        >
                          {word.text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </h2>

              {/* Bottom Laser Hairline Divider */}
              <div
                ref={statementDividerBottomRef}
                className="w-full h-[1px] bg-[#EAD7C0]/25 mb-4 will-change-transform shadow-[0_0_8px_rgba(255,140,56,0.3)] origin-center"
              />

              {/* Attribution Tag */}
              <div
                ref={statementAttributionRef}
                className="flex items-center justify-between text-[10px] font-mono text-[#CBB59D] tracking-wider will-change-[transform,opacity]"
              >
                <span className="text-[#EAD7C0]/80">SOHAM ROYCHOUDHURY · ARCHITECTURAL CREED</span>
                <span className="text-[#FF8C38]/70">2026</span>
              </div>
            </div>
          </div>

          {/* 7. THE LUMINOUS DIMENSIONAL STARGATE RING (Technique 1: Doctor Strange / A24 Gateway) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div
              ref={portalRingRef}
              className="relative w-[220px] h-[220px] rounded-full will-change-transform opacity-0 flex items-center justify-center"
            >
              {/* Multi-layered Glowing Plasma Border */}
              <div className="absolute inset-0 rounded-full border-2 border-[#FF8C38] shadow-[0_0_35px_#FF8C38,0_0_70px_rgba(255,140,56,0.6),inset_0_0_30px_rgba(255,140,56,0.8)]" />

              {/* Concentric Rotating Celestial Laser Rings */}
              <div
                className="absolute -inset-2 rounded-full border border-amber-300/40 animate-spin"
                style={{ animationDuration: "20s" }}
              />
              <div
                className="absolute -inset-5 rounded-full border border-[#FF8C38]/25 animate-spin"
                style={{ animationDuration: "35s", animationDirection: "reverse" }}
              />

              {/* Anamorphic Horizontal Horizon Lens Flares */}
              <div className="absolute top-1/2 -inset-x-12 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FF8C38] to-transparent shadow-[0_0_20px_#FF8C38]" />
              <div className="absolute top-1/2 -inset-x-24 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-80" />

              {/* Stargate Telemetry Tag */}
              <div className="absolute -top-7 inset-x-0 text-center font-mono text-[8px] tracking-[0.28em] text-[#FF8C38] uppercase">
                PORTAL // TRANSIT ACTIVE
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): HIGH-ART GALLERY CINEMATIC HERO            */}
      {/* ========================================================================= */}
      <section
        ref={desktopSectionRef}
        className="hidden md:flex relative min-h-[100svh] flex-col justify-between pt-36 pb-14 px-8 md:px-12 z-10 select-none overflow-visible"
      >
        {/* Living Pixel Art Terrace Video */}
        <div
          ref={desktopVideoRef}
          className="absolute inset-0 -bottom-16 z-0 pointer-events-none select-none overflow-hidden will-change-transform"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.92) 90%, rgba(0,0,0,0.3) 97%, transparent 100%)",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-bottom"
          >
            <source src="/assets/hero_pixel_art_loop.mp4" type="video/mp4" />
            <source src="/assets/Animate_pixel_art_environment_loop_03a9505a.mp4" type="video/mp4" />
          </video>

          {/* Balanced Vignette */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/35" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 65%, transparent 100%)",
              }}
            />
          </div>

          {/* Multi-stop bottom bleed into Movement 01 */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#060709] via-[#060709]/85 to-transparent pointer-events-none z-10" />
        </div>

        {/* Centered Monumental Headline (Matching the 'Soft Light' Reference) */}
        <div className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-6">
          {/* Top Editorial HUD Metadata (Mirroring @nidzzify and 02 / 05) */}
          <div className="w-full max-w-2xl flex items-center justify-between text-xs font-sans font-bold uppercase tracking-[0.22em] text-white/60 mb-6 px-2">
            <span>@sohamroychoudhury</span>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-md">
              <Sparkles size={11} className="text-[#10B981]" />
              <span>NSEC (2024–2028)</span>
            </div>
            <span>01 / 05</span>
          </div>

          {/* Signature Aesthetic Font Pairing (Citadel Script + Helvetica Compressed - Matching 'Soft Light') */}
          <h1 className="relative flex flex-col items-center justify-center text-center select-none mb-6">
            {/* Word 1: Soham in Citadel Script (matching 'Soft') */}
            <span className="font-citadel font-normal text-[8.5rem] md:text-[10rem] lg:text-[11.5rem] xl:text-[13rem] text-[#FFFDF8] leading-[0.76] relative z-20 -mb-6 md:-mb-8 lg:-mb-10 xl:-mb-12 -translate-x-7 md:-translate-x-11 lg:-translate-x-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]">
              Soham
            </span>
            {/* Word 2: Roychoudhury in Helvetica Compressed (matching 'Light') */}
            <span className="font-helvetica font-normal text-[6.5rem] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[9.5rem] text-[#F8F5EE] tracking-[0.03em] leading-[0.84] relative z-10 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
              Roychoudhury
            </span>
          </h1>

          {/* Editorial Subtitle in Helvetica Compressed (matching 'Some moments glow in silence.') */}
          <p className="font-helvetica font-normal text-sm md:text-base lg:text-lg text-slate-200/90 tracking-[0.16em] uppercase leading-relaxed mb-10 max-w-2xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] px-2">
            Artificial Intelligence &amp; Machine Learning · Frontend Architect · Digital Operations
          </p>

          {/* Dual Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0F172A] hover:bg-[#10B981] hover:text-white transition-all duration-300 font-sans font-black text-sm uppercase tracking-wider cursor-pointer shadow-xl active:scale-98"
            >
              <span>Explore Work</span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={handleConnectClick}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/30 transition-all duration-300 font-sans font-black text-sm uppercase tracking-wider cursor-pointer shadow-xl backdrop-blur-md active:scale-98"
            >
              <span>Get In Touch</span>
              <ArrowUpRight size={14} className="text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Coordinates Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-3 border-t border-white/20 text-[11px] font-sans font-bold text-white/85 uppercase tracking-widest drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          <span>KOLKATA // LAT 22.5726° N · LON 88.3639° E</span>
          <span>CYBER-PASTORAL TERRACE</span>
        </div>
      </section>
    </div>
  );
});

MonumentalHero.displayName = "MonumentalHero";
