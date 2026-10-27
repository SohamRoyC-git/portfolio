"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import { FluidBackgroundMesh } from "@/components/master/FluidBackgroundMesh";
import { FluidGradientAura } from "@/components/master/FluidGradientAura";
import { CursorParticleCanvas } from "@/components/master/CursorParticleCanvas";
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
    if (prefersReducedMotion) return;

    // Direct, pristine Lenis + GSAP synchronization
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger update
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis raf for zero lag / jitter
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger once DOM is stabilized
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

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

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] text-[#0F172A] selection:bg-[#10B981]/20 selection:text-[#059669] overflow-x-hidden">
      {/* 0. Authentic YouTube Shimmer Skeleton Loader (Mounts on initial load, dissolves smoothly) */}
      <YouTubeSkeletonLoader />

      {/* 1. Fluid Ambient Mesh Gradient */}
      <FluidBackgroundMesh />

      {/* 2. Silky GPU-Accelerated Fluid Gradient Aura (Ethereal, zero-lag organic depth) */}
      <FluidGradientAura />

      {/* 3. Interactive Cursor Particle Emitter */}
      <CursorParticleCanvas />

      {/* 4. Autonomous Emerald Optical Orb */}
      <TravelingPrismaticSphere />

      {/* 5. Architectural Minimal Navigation */}
      <MasterNav onNavigate={handleNavigate} activeId={activeId} />

      {/* 6. Cohesive Spatial Storytelling Sequence */}
      <main className="relative z-10 flex flex-col">
        {/* Movement 00: Monumental Hero */}
        <MonumentalHero onExplore={() => handleNavigate("monument-statement")} />

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
