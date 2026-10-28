"use client";

import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const SilkyFluidBackdrop: React.FC = memo(() => {
  const mobileBgWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // =========================================================================
    // MOBILE STORYTELLING CHROMATIC TRANSITIONS (< 768px):
    // Slow, continuous scroll-scrubbed temperature shifts across sections
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      let currentHue = 0;
      let targetHue = 0;

      const sections = [
        { id: "monument-hero", hue: 0 },
        { id: "monument-statement", hue: 30 },
        { id: "monument-exhibition", hue: 100 },
        { id: "monument-matrix", hue: 170 },
        { id: "monument-terminal", hue: 230 },
      ];

      // Measure section positions relative to viewport transition zones
      const updateTargetHue = () => {
        const vh = window.innerHeight;
        // Start transition when next section reaches 85% of viewport height
        // Complete transition when next section reaches 15% of viewport height
        const startY = vh * 0.85;
        const endY = vh * 0.15;
        const distance = startY - endY;

        let computedHue = sections[0].hue;

        for (let i = 1; i < sections.length; i++) {
          const el = document.getElementById(sections[i].id);
          if (!el) continue;

          const rect = el.getBoundingClientRect();

          if (rect.top <= endY) {
            // Next section is fully in active reading zone, inherit its hue
            computedHue = sections[i].hue;
          } else if (rect.top < startY) {
            // Next section is in active transition zone: scrub slowly with scroll
            const prevHue = computedHue;
            const target = sections[i].hue;
            const progress = (startY - rect.top) / distance;
            // Smooth sine curve for natural fluid easing
            const eased = (1 - Math.cos(progress * Math.PI)) / 2;
            computedHue = prevHue + (target - prevHue) * eased;
            break;
          } else {
            // Next section is still below transition zone, keep current computed hue
            break;
          }
        }

        targetHue = computedHue;
      };

      // Ticker for liquid inertia smoothing (chases targetHue smoothly at 60/120fps)
      const tickerCallback = () => {
        if (Math.abs(currentHue - targetHue) > 0.05) {
          currentHue += (targetHue - currentHue) * 0.08;
          if (mobileBgWrapperRef.current) {
            mobileBgWrapperRef.current.style.filter = `hue-rotate(${currentHue.toFixed(1)}deg)`;
          }
        }
      };

      gsap.ticker.add(tickerCallback);

      // Connect to ScrollTrigger update so it updates during all user scrolls and momentum
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: updateTargetHue,
      });

      // Initial measurement
      updateTargetHue();

      return () => {
        st.kill();
        gsap.ticker.remove(tickerCallback);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAFAF9] max-md:bg-[#0C0C0E]"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE (< 768px): REFERENCE-MATCHED SMOKY EMBER FLUID WAVE    */}
      {/* (Option 2: Chromatic Section Storytelling across movements)               */}
      {/* ========================================================================= */}
      <div
        ref={mobileBgWrapperRef}
        className="md:hidden absolute inset-0 overflow-hidden bg-[#0C0C0E] will-change-[filter]"
        style={{ filter: "hue-rotate(0deg)" }}
      >
        <Image
          src="/assets/mobile_fluid_ember_reference.jpg"
          alt=""
          fill
          priority
          className="object-cover object-top select-none pointer-events-none opacity-90"
        />
        {/* Subtle vignette darkening at bottom to guarantee clean seamless black bleed */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0C0C0E] to-transparent pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): SILKY PASTEL FLUID MESH (GALLERY LIGHT)    */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block absolute inset-0 opacity-75 sm:opacity-85 blur-xl sm:blur-3xl"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 15% 75%, rgba(14, 165, 233, 0.40) 0%, transparent 70%),
            radial-gradient(ellipse 60% 45% at 45% 55%, rgba(244, 114, 182, 0.35) 0%, transparent 65%),
            radial-gradient(ellipse 65% 50% at 72% 65%, rgba(192, 132, 252, 0.42) 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 85% 20%, rgba(56, 189, 248, 0.45) 0%, transparent 65%),
            radial-gradient(circle at 62% 60%, rgba(147, 51, 234, 0.30) 0%, transparent 60%)
          `,
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Ultra-subtle Micro-Noise Grain for Premium Matte Surface Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
});

SilkyFluidBackdrop.displayName = "SilkyFluidBackdrop";
