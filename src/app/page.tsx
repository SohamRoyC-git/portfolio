"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import { SilkyFluidBackdrop } from "@/components/master/SilkyFluidBackdrop";
import { TravelingPrismaticSphere } from "@/components/master/TravelingPrismaticSphere";
import { MasterNav } from "@/components/master/MasterNav";
import { MonumentalHero } from "@/components/master/MonumentalHero";
import { KineticStatement } from "@/components/master/KineticStatement";
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

    // On touch mobile devices, use ultra-fast native hardware-accelerated scrolling for zero lag!
    if (prefersReducedMotion || isTouch) {
      ScrollTrigger.refresh();
      return;
    }

    // On desktop, use lightweight, ultra-responsive Lenis synchronization
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Section Observer for Navigation Spy
  useEffect(() => {
    const sectionIds = [
      "monument-hero",
      "monument-statement",
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
    <div className="relative min-h-screen bg-[#FAFAF9] max-md:bg-[#000000] text-[#0F172A] max-md:text-white selection:bg-[#10B981]/20 selection:text-[#059669] overflow-x-clip">
      {/* 0. Authentic YouTube Shimmer Skeleton Loader (Mounts once on load, dissolves smoothly) */}
      <YouTubeSkeletonLoader />

      {/* 1. Silky Fluid Gradient Backdrop (Direct match to reference screenshot: lightweight, GPU-composited, zero-lag) */}
      <SilkyFluidBackdrop />

      {/* Autonomous Emerald Optical Guiding Sphere */}
      <TravelingPrismaticSphere />

      {/* 2. Architectural Minimal Navigation */}
      <MasterNav onNavigate={handleNavigate} activeId={activeId} />

      {/* 3. Cohesive Spatial Storytelling Sequence */}
      <main className="relative z-10">
        {/* Movement 00: Monumental Hero */}
        <MonumentalHero onExplore={() => handleNavigate("monument-statement")} onConnect={() => handleNavigate("monument-terminal")} />

        {/* Movement 01: Kinetic Pinned Statement & Credentials */}
        <KineticStatement />

        {/* Movement 02: 360° Cylindrical Horizontal Scroll Exhibition */}
        <GrandSpatialDiscs />

        {/* Movement 03: Architectural Bento Matrix & Live Code */}
        <ArchitecturalMatrix />

        {/* Movement 04: The Initiation Terminal */}
        <TerminalFinale />
      </main>
    </div>
  );
}
