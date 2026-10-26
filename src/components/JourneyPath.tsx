"use client";

import React, { useEffect, useState } from "react";

export const JourneyPath: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = window.scrollY / totalScroll;
        setScrollProgress(Math.min(Math.max(currentProgress, 0), 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top minimal progress line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#F97316] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Side journey floating indicator (Desktop only) */}
      <div className="hidden xl:flex fixed right-8 bottom-10 z-40 flex-col items-center gap-2 pointer-events-none select-none">
        <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#E9E7E3] text-[10px] font-mono text-[#202124] shadow-xs">
          {Math.round(scrollProgress * 100)}% JOURNEY
        </div>
        <div className="w-1 h-16 bg-[#E9E7E3] rounded-full overflow-hidden">
          <div
            className="w-full bg-[#F97316] rounded-full transition-all duration-75"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </>
  );
};
