"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { GraduationCap, Award, Compass, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const PutureStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !cardsRef.current) return;

    const cards = cardsRef.current.children;

    gsap.from(cards, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section
      id="chapter-about"
      ref={sectionRef}
      className="relative min-h-[90vh] flex flex-col justify-center py-28 px-6 lg:px-16 z-10 max-w-7xl mx-auto"
    >
      {/* Chapter Marker - Minimalist Swiss Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
        <span className="font-mono text-[11px] text-slate-300 tracking-wider uppercase">01 / ABOUT & PHILOSOPHY</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-[11px] text-[#F97316] font-medium tracking-wide uppercase">THE CORE MISSION</span>
      </div>

      {/* Main High-Contrast Headline */}
      <div className="mb-16">
        <h2 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.15] max-w-5xl tracking-tight">
          What people only read, they{" "}
          <span className="inline-block px-3 py-0.5 rounded-lg bg-white/[0.06] text-slate-300 font-serif italic border border-white/10">
            forget
          </span>
          . What they touch, navigate, and interact with, they{" "}
          <span className="inline-block px-3 py-0.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            experience
          </span>
          .
        </h2>

        <p className="font-sans text-base sm:text-xl text-slate-400 font-normal mt-8 max-w-3xl leading-relaxed">
          I am Soham Roychoudhury, a Computer Science & Engineering undergraduate specializing in Artificial Intelligence and Machine Learning at Netaji Subhash Engineering College (2024–2028). I merge disciplined software engineering with international digital operations.
        </p>
      </div>

      {/* 4 Architectural Fact Cards with Staggered ScrollTrigger */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-[#12141A]/95 border border-white/[0.08] backdrop-blur-md hover:border-[#F97316]/60 transition-all duration-300 group">
          <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <GraduationCap size={18} />
          </div>
          <div className="font-mono text-[10px] text-[#F97316] tracking-wider uppercase mb-1">DEGREE PROGRAM</div>
          <div className="font-sans text-base font-bold text-white mb-2">
            B.Tech in CSE (AI & ML)
          </div>
          <div className="font-sans text-xs text-slate-400 leading-relaxed">
            Netaji Subhash Engineering College, Kolkata (2024–2028). Core focus on algorithmic optimization, distributed systems, and machine intelligence.
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-[#12141A]/95 border border-white/[0.08] backdrop-blur-md hover:border-sky-500/60 transition-all duration-300 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Globe size={18} />
          </div>
          <div className="font-mono text-[10px] text-sky-400 tracking-wider uppercase mb-1">CROSS-BORDER LEAD</div>
          <div className="font-sans text-base font-bold text-white mb-2">
            Latvia & Global B2B
          </div>
          <div className="font-sans text-xs text-slate-400 leading-relaxed">
            Managed official web infrastructure for the Latvian Cricket Federation and global trading platforms for IZIEAT across European and South Asian channels.
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-[#12141A]/95 border border-white/[0.08] backdrop-blur-md hover:border-amber-500/60 transition-all duration-300 group">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Compass size={18} />
          </div>
          <div className="font-mono text-[10px] text-amber-400 tracking-wider uppercase mb-1">CLIENT ARCHITECTURE</div>
          <div className="font-sans text-base font-bold text-white mb-2">
            278-Key Localization
          </div>
          <div className="font-sans text-xs text-slate-400 leading-relaxed">
            Engineered instant English-Russian dual-market dictionary with sub-5ms lookup, zero API dependency, and automated fallback caching.
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 rounded-2xl bg-[#12141A]/95 border border-white/[0.08] backdrop-blur-md hover:border-emerald-500/60 transition-all duration-300 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Award size={18} />
          </div>
          <div className="font-mono text-[10px] text-emerald-400 tracking-wider uppercase mb-1">ACADEMIC FOUNDATION</div>
          <div className="font-sans text-base font-bold text-white mb-2">
            The Heritage School
          </div>
          <div className="font-sans text-xs text-slate-400 leading-relaxed">
            ISC Class XII (82.75%, 2024) with distinction in Computer Science & Mathematics; ICSE Class X (89.4%, 2022).
          </div>
        </div>
      </div>
    </section>
  );
};
