"use client";

import React, { useEffect, useState } from "react";

interface PutureChapterHUDProps {
  activeChapter: string;
}

const CHAPTER_LABELS: Record<string, { num: string; title: string }> = {
  "chapter-hero": { num: "00", title: "WELCOME" },
  "chapter-about": { num: "01", title: "ABOUT & PHILOSOPHY" },
  "chapter-work": { num: "02", title: "CORE PILLARS" },
  "chapter-showcase": { num: "03", title: "VINYL EXHIBITION" },
  "chapter-process": { num: "04", title: "METHODOLOGY" },
  "chapter-contact": { num: "05", title: "COMMS TERMINAL" },
};

export const PutureChapterHUD: React.FC<PutureChapterHUDProps> = ({ activeChapter }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const info = CHAPTER_LABELS[activeChapter] || CHAPTER_LABELS["chapter-hero"];

  return (
    <div className="fixed bottom-6 left-6 lg:left-12 z-40 pointer-events-none select-none flex items-center gap-3">
      {/* Chapter Indicator Pill */}
      <div className="px-3.5 py-1.5 rounded-full bg-[#12141A]/90 border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
        <span className="font-mono text-xs font-bold text-[#F97316]">{info.num}</span>
        <span className="font-mono text-xs text-white tracking-wide">{info.title}</span>
      </div>

      {/* Progress Metric */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md font-mono text-xs text-slate-400">
        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F97316] rounded-full transition-all duration-150"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
        <span>{Math.round(scrollProgress * 100)}%</span>
      </div>
    </div>
  );
};
