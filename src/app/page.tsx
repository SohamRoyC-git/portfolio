"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import { SilkyFluidBackdrop } from "@/components/master/SilkyFluidBackdrop";
import { MasterNav } from "@/components/master/MasterNav";
import { MonumentalHero } from "@/components/master/MonumentalHero";
import { KineticStatement } from "@/components/master/KineticStatement";
import { ArchitecturalCreed } from "@/components/master/ArchitecturalCreed";
import { GrandSpatialDiscs } from "@/components/master/GrandSpatialDiscs";
import { ArchitecturalMatrix } from "@/components/master/ArchitecturalMatrix";
import { TerminalFinale } from "@/components/master/TerminalFinale";
import { YouTubeSkeletonLoader } from "@/components/master/YouTubeSkeletonLoader";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeId, setActiveId] = useState("monument-hero");
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let tickerCallback: ((time: number) => void) | null = null;

    // Unified Lenis Smooth Scroll (Desktop + Mobile with buttery touch interpolation)
    if (!prefersReducedMotion) {
      const lenis = new Lenis({
        lerp: isTouch ? 0.09 : 0.08,
        duration: isTouch ? 0.9 : 1.1,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: true,
        touchMultiplier: 1.2,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Hero Monolithic Exit: Cleans out the canvas completely before Statement plays (Desktop + Mobile)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.to("#hero-wrapper", {
        scale: 0.94,
        yPercent: -12,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#monument-statement",
          start: "top bottom",
          end: "top top",
          scrub: 0.4,
        },
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.to("#hero-wrapper", {
        scale: 0.96,
        yPercent: -8,
        opacity: 0.05,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#monument-statement",
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
        },
      });
    });

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timeout);
      mm.revert();
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Section Observer for Navigation Spy
  useEffect(() => {
    const sectionIds = [
      "monument-hero",
      "monument-statement",
      "monument-creed",
      "monument-exhibition",
      "monument-matrix",
      "monument-terminal",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060709] text-[#F8F5EE] selection:bg-[#FF7A00]/30 selection:text-[#FF7A00] overflow-x-clip">
      {/* 0. Authentic YouTube Shimmer Skeleton Loader (Mounts once on load, dissolves smoothly) */}
      <YouTubeSkeletonLoader />

      {/* 1. Disciplined Architectural Obsidian Canvas (Zero AI glows) */}
      <SilkyFluidBackdrop />

      {/* 2. Architectural Minimal Navigation */}
      <MasterNav onNavigate={handleNavigate} activeId={activeId} />

      {/* 3. Cohesive Spatial Storytelling Sequence */}
      <main className="relative z-10">
        {/* Movement 00: Monumental Hero (Sticky at top on desktop so Movement 01 wipes over it) */}
        <div id="hero-wrapper" className="relative w-full z-10 md:sticky md:top-0 md:h-[100svh] will-change-[transform,opacity]">
          <MonumentalHero onExplore={() => handleNavigate("monument-statement")} onConnect={() => handleNavigate("monument-terminal")} />
        </div>

        {/* Movement 01: Kinetic Pinned Statement (Quote) */}
        <KineticStatement />

        {/* Movement 02: Educational & Professional Foundations (Creed Monoliths) */}
        <ArchitecturalCreed />

        {/* Movement 03: Selected Commissions Showcase (Forge Automotive Split-Screen) */}
        <GrandSpatialDiscs />

        {/* Movement 03: Architectural Bento Matrix & Live Code */}
        <ArchitecturalMatrix />

        {/* Movement 04: The Initiation Terminal */}
        <TerminalFinale />
      </main>
    </div>
  );
}
