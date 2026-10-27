"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  id: string;
  num: string;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { id: "hero", num: "01", label: "INTRODUCTION" },
  { id: "journey", num: "02", label: "GENESIS & JOURNEY" },
  { id: "experience", num: "03", label: "LATVIA & GLOBAL OPS" },
  { id: "work", num: "04", label: "SPATIAL DISCS" },
  { id: "skills", num: "05", label: "DEVELOPER TOOLKIT" },
  { id: "education", num: "06", label: "EDUCATION" },
  { id: "contact", num: "07", label: "CONTACT" },
];

export const FluidOrangeThread: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  const liquidDropletRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef({ lastY: 0, velocity: 0, smoothProgress: 0 });

  useEffect(() => {
    let animId: number;

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const rawProgress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const delta = currentScroll - scrollRef.current.lastY;
      scrollRef.current.lastY = currentScroll;
      scrollRef.current.velocity += (delta - scrollRef.current.velocity) * 0.2;
      scrollRef.current.smoothProgress = progress;

      setScrollProgress(progress);

      // Identify active chapter based on scroll position
      const chapterEls = CHAPTERS.map((ch) => document.getElementById(ch.id));
      const scrollMiddle = window.scrollY + window.innerHeight * 0.4;

      let foundIndex = 0;
      chapterEls.forEach((el, idx) => {
        if (el) {
          const top = el.offsetTop;
          if (scrollMiddle >= top) {
            foundIndex = idx;
          }
        }
      });
      setActiveChapterIndex(foundIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Render loop for smooth liquid deformation
    const updatePhysics = () => {
      scrollRef.current.velocity *= 0.9;
      const v = scrollRef.current.velocity;

      if (liquidDropletRef.current) {
        // Stretch droplet based on scroll speed (liquid squash & stretch)
        const stretchY = 1 + Math.min(Math.abs(v) * 0.04, 1.2);
        const squashX = 1 / Math.sqrt(stretchY);
        liquidDropletRef.current.style.transform = `scale(${squashX}, ${stretchY})`;
      }

      animId = requestAnimationFrame(updatePhysics);
    };
    animId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="fixed left-4 md:left-8 top-0 bottom-0 z-40 pointer-events-none flex items-center select-none"
      aria-hidden="true"
    >
      <div className="relative h-[72vh] flex items-center">
        {/* Subtle background rail line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-[#E9E7E3] rounded-full overflow-hidden">
          {/* Active Fluid Liquid Fill */}
          <div
            className="w-full bg-gradient-to-b from-[#F97316] via-[#FB923C] to-[#EA580C] rounded-full transition-all duration-150 ease-out"
            style={{
              height: `${scrollProgress * 100}%`,
              boxShadow: "0 0 12px rgba(249, 115, 22, 0.6)",
            }}
          />
        </div>

        {/* Traveling Liquid Droplet that rides the fluid line */}
        <div
          className="absolute left-3 -translate-x-1/2 pointer-events-none transition-all duration-150 ease-out"
          style={{
            top: `${scrollProgress * 100}%`,
          }}
        >
          {/* Outer Liquid Glow */}
          <div
            ref={liquidDropletRef}
            className="relative -top-2 flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-b from-[#F97316] to-[#EA580C] shadow-[0_0_16px_rgba(249,115,22,0.85)]"
          >
            {/* White liquid reflection highlight */}
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
            {/* Ambient liquid ripple ring */}
            <div className="absolute inset-0 rounded-full border border-[#F97316]/50 animate-ping opacity-60" />
          </div>
        </div>

        {/* Architectural Chapter Nodes (Puture-style vertical index) */}
        <div className="relative flex flex-col justify-between h-full py-2 pointer-events-auto">
          {CHAPTERS.map((ch, idx) => {
            const isPassed = idx <= activeChapterIndex;
            const isCurrent = idx === activeChapterIndex;

            return (
              <div
                key={ch.id}
                className="relative flex items-center group cursor-pointer"
                onClick={() => scrollToChapter(ch.id)}
                onMouseEnter={() => setHoveredChapter(idx)}
                onMouseLeave={() => setHoveredChapter(null)}
              >
                {/* Node bead on the line */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? "scale-110 bg-[#FFFFFF] border-2 border-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                      : isPassed
                      ? "bg-[#FFFFFF] border-2 border-[#F97316]"
                      : "bg-[#FFFFFF] border-2 border-[#E9E7E3] hover:border-[#F97316]/60"
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent
                        ? "w-2.5 h-2.5 bg-[#F97316]"
                        : isPassed
                        ? "w-1.5 h-1.5 bg-[#EA580C]"
                        : "w-1 h-1 bg-[#D6D3CD]"
                    }`}
                  />
                </div>

                {/* Chapter Label (Hidden on small mobile, visible on desktop or on hover) */}
                <div
                  className={`ml-3.5 transition-all duration-300 flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFFFFF]/90 backdrop-blur-md border shadow-xs ${
                    isCurrent
                      ? "opacity-100 translate-x-0 border-[#F97316]/30"
                      : hoveredChapter === idx
                      ? "opacity-100 translate-x-0 border-[#E9E7E3]"
                      : "opacity-0 -translate-x-2 pointer-events-none md:opacity-40 md:translate-x-0 md:border-transparent md:bg-transparent md:shadow-none"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isCurrent ? "text-[#F97316]" : "text-[#6B6B6B]"
                    }`}
                  >
                    {ch.num}
                  </span>
                  <span
                    className={`font-sans text-[11px] font-medium tracking-wide whitespace-nowrap ${
                      isCurrent ? "text-[#202124]" : "text-[#6B6B6B]"
                    }`}
                  >
                    {ch.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
