"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import { SilkyFluidBackdrop } from "@/components/master/SilkyFluidBackdrop";
import { MasterNav } from "@/components/master/MasterNav";
import { PullToRefresh } from "@/components/master/PullToRefresh";
import { MonumentalHero } from "@/components/master/MonumentalHero";
import { KineticStatement } from "@/components/master/KineticStatement";
import { ArchitecturalCreed } from "@/components/master/ArchitecturalCreed";
import { GrandSpatialDiscs } from "@/components/master/GrandSpatialDiscs";
import { ArchitecturalMatrix } from "@/components/master/ArchitecturalMatrix";
import { TerminalFinale } from "@/components/master/TerminalFinale";
import { SiteFooter } from "@/components/master/SiteFooter";
import { TerraceBreezePreloader } from "@/components/master/TerraceBreezePreloader";
import { Studio3DWorkspace } from "@/components/master/Studio3DWorkspace";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  ScrollTrigger.defaults({
    scroller: "#app-scroller",
  });
}

export default function Home() {
  const [activeId, setActiveId] = useState("monument-studio-3d");
  const [isWorkspaceLocked, setIsWorkspaceLocked] = useState(true);
  const [isStudioActive, setIsStudioActive] = useState(true);

  // Strict Window & Scroller Lock: Completely prevent any scrolling while in 3D Studio
  useEffect(() => {
    if (!isWorkspaceLocked) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "End", "Home"].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("keydown", handleKey, { capture: true });

    if (lenisRef.current) {
      lenisRef.current.stop();
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = 0;
    }

    return () => {
      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
      window.removeEventListener("keydown", handleKey, { capture: true });
    };
  }, [isWorkspaceLocked]);

  const lenisRef = useRef<Lenis | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let tickerCallback: ((time: number) => void) | null = null;

    // Set default scroller for all ScrollTrigger instances to internal app shell
    if (scrollerRef.current) {
      ScrollTrigger.defaults({
        scroller: scrollerRef.current,
      });
    }

    // Unified Lenis Smooth Scroll targeting internal App Shell
    if (!prefersReducedMotion && scrollerRef.current) {
      const lenis = new Lenis({
        wrapper: scrollerRef.current,
        content: scrollerRef.current.firstElementChild as HTMLElement,
        lerp: isTouch ? 0.09 : 0.08,
        duration: isTouch ? 0.9 : 1.1,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1.15,
      });
      lenisRef.current = lenis;
      (window as any).lenis = lenis;
      lenis.stop(); // Strictly lock scrolling until laptop is clicked

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
        delete (window as any).lenis;
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
          if (entry.isIntersecting && !isStudioActive) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: scrollerRef.current,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isStudioActive]);

  const handleEnterPortfolio = useCallback(() => {
    setIsStudioActive(false);
    setIsWorkspaceLocked(false);
    setActiveId("monument-hero");

    if (lenisRef.current) {
      lenisRef.current.start();
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = 0;
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    if (id === "monument-studio-3d") {
      setIsStudioActive(true);
      setIsWorkspaceLocked(true);
      setActiveId("monument-studio-3d");
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
      return;
    }

    setIsStudioActive(false);
    setIsWorkspaceLocked(false);
    setActiveId(id);

    if (lenisRef.current) {
      lenisRef.current.start();
    }

    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#060709] text-[#F8F5EE] selection:bg-[#FF7A00]/30 selection:text-[#FF7A00] overflow-hidden">
      {/* 0. Cyber-Pastoral Terrace Breeze Preloader (Sleek hairline progress bar with wind reveal) */}
      <TerraceBreezePreloader />

      {/* 1. Disciplined Architectural Obsidian Canvas (Zero AI glows) */}
      <SilkyFluidBackdrop />

      {/* 2. Architectural Minimal Navigation */}
      <MasterNav onNavigate={handleNavigate} activeId={activeId} />

      {/* Tactile In-App Pull-Down Refresh (Leaves browser bottom toolbar locked & stable) */}
      <PullToRefresh scrollerRef={scrollerRef} />

      {/* Movement 00: Interactive 3D Studio Workspace (Fixed Viewport; strictly decoupled from scroller track) */}
      <div
        id="monument-studio-3d"
        className={`fixed inset-0 w-full h-[100svh] z-30 transition-opacity duration-700 ${
          isStudioActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Studio3DWorkspace
          onEnterPortfolio={handleEnterPortfolio}
          onNavigateToSection={handleNavigate}
        />
      </div>

      {/* 3. Cohesive Spatial Storytelling Sequence (Top of scroller is now #hero-wrapper) */}
      <div
        id="app-scroller"
        ref={scrollerRef}
        className={`relative h-full w-full ${
          isWorkspaceLocked ? "overflow-hidden touch-none" : "overflow-y-auto"
        } overflow-x-hidden overscroll-none`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <main className="relative z-10">
          {/* Movement 01: Monumental Hero (Top of Portfolio Website) */}
          <div id="hero-wrapper" className="relative w-full z-10 overflow-x-clip md:sticky md:top-0 md:h-[100svh] will-change-[transform,opacity]">
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

          {/* Movement 05: Master Architectural Site Map & Colophon Footer */}
          <SiteFooter onNavigate={handleNavigate} />
        </main>
      </div>
    </div>
  );
}
