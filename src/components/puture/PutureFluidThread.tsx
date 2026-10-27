"use client";

import React, { useEffect, useState, useRef } from "react";

interface PutureFluidThreadProps {
  onNavigate: (id: string) => void;
}

const CHAPTERS = [
  { id: "chapter-hero", num: "00", label: "WELCOME" },
  { id: "chapter-about", num: "01", label: "ABOUT" },
  { id: "chapter-work", num: "02", label: "WORK" },
  { id: "chapter-showcase", num: "03", label: "SHOWCASE" },
  { id: "chapter-process", num: "04", label: "PROCESS" },
  { id: "chapter-contact", num: "05", label: "CONTACT" },
];

export const PutureFluidThread: React.FC<PutureFluidThreadProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const dropletRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef({ lastY: 0, velocity: 0 });

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));

      const delta = currentScroll - scrollRef.current.lastY;
      scrollRef.current.lastY = currentScroll;
      scrollRef.current.velocity += (delta - scrollRef.current.velocity) * 0.2;

      // Identify active chapter
      const middleY = window.scrollY + window.innerHeight * 0.4;
      CHAPTERS.forEach((ch, idx) => {
        const el = document.getElementById(ch.id);
        if (el && middleY >= el.offsetTop) {
          setActiveIdx(idx);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Liquid squash & stretch
    const loop = () => {
      scrollRef.current.velocity *= 0.9;
      const v = scrollRef.current.velocity;

      if (dropletRef.current) {
        const stretchY = 1 + Math.min(Math.abs(v) * 0.04, 1.2);
        const squashX = 1 / Math.sqrt(stretchY);
        dropletRef.current.style.transform = `scale(${squashX}, ${stretchY})`;
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed right-4 sm:right-8 top-0 bottom-0 z-40 pointer-events-none flex items-center select-none">
      <div className="relative h-[65vh] flex items-center">
        {/* Subtle background rail line */}
        <div className="absolute right-2.5 top-0 bottom-0 w-[2px] bg-white/10 rounded-full overflow-hidden">
          {/* Active Liquid Orange Fill */}
          <div
            className="w-full bg-gradient-to-b from-[#F97316] via-[#FB923C] to-[#EA580C] rounded-full transition-all duration-150 ease-out"
            style={{
              height: `${scrollProgress * 100}%`,
              boxShadow: "0 0 16px rgba(249, 115, 22, 0.8)",
            }}
          />
        </div>

        {/* Traveling Liquid Amber Droplet */}
        <div
          className="absolute right-2.5 translate-x-1/2 pointer-events-none transition-all duration-150 ease-out"
          style={{
            top: `${scrollProgress * 100}%`,
          }}
        >
          <div
            ref={dropletRef}
            className="relative -top-2 flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-b from-[#F97316] to-[#EA580C] shadow-[0_0_20px_rgba(249,115,22,0.95)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
            <div className="absolute inset-0 rounded-full border border-[#F97316]/50 animate-ping opacity-60" />
          </div>
        </div>

        {/* Chapter Landmark Checkpoints */}
        <div className="relative flex flex-col justify-between h-full py-2 pointer-events-auto">
          {CHAPTERS.map((ch, idx) => {
            const isCurrent = idx === activeIdx;
            const isPassed = idx <= activeIdx;

            return (
              <div
                key={ch.id}
                onClick={() => onNavigate(ch.id)}
                className="relative flex items-center justify-end group cursor-pointer"
              >
                {/* Chapter Label Tooltip on Hover */}
                <div
                  className={`mr-3 px-2 py-0.5 rounded bg-[#12141A] border border-white/10 font-mono text-[9px] text-slate-300 transition-all duration-200 ${
                    isCurrent
                      ? "opacity-100 text-[#F97316] border-[#F97316]/50"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {ch.num} {ch.label}
                </div>

                {/* Node Ring */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? "bg-[#0A0B0E] border-2 border-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.6)] scale-110"
                      : isPassed
                      ? "bg-[#0A0B0E] border-2 border-[#F97316]"
                      : "bg-[#0A0B0E] border border-white/20 group-hover:border-white/50"
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent
                        ? "w-2 h-2 bg-[#F97316]"
                        : isPassed
                        ? "w-1.5 h-1.5 bg-[#EA580C]"
                        : "w-1 h-1 bg-white/20"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
