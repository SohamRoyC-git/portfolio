"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Award, Compass, Globe, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const KineticStatement: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !textRef.current) return;

    const words = textRef.current.querySelectorAll(".kinetic-word");

    gsap.fromTo(
      words,
      { opacity: 0.2, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "bottom 35%",
          scrub: 0.8,
        },
      }
    );
  }, []);

  const statement =
    "We do not build software to sit passively on a screen. We engineer digital environments with physical weight, kinetic intention, and international scale.";

  return (
    <section
      id="monument-statement"
      ref={containerRef}
      className="relative min-h-screen py-32 px-6 sm:px-12 z-10 max-w-7xl mx-auto flex flex-col justify-center"
    >
      {/* Chapter Marker */}
      <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase mb-12 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-[#10B981]" />
        <span>01 / STATEMENT</span>
      </div>

      {/* Kinetic Big Typography in Apple Garamond Light Italic */}
      <h2
        ref={textRef}
        className="font-serif italic font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#0F172A] tracking-tight leading-[1.15] mb-20 max-w-5xl"
      >
        “{statement.split(" ").map((word, i) => (
          <span
            key={i}
            className="kinetic-word inline-block mr-3 transition-colors duration-150 text-[#0F172A]"
          >
            {word}
          </span>
        ))}”
      </h2>

      {/* 4 Clean Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-slate-200/80">
        {/* Monolith 1 */}
        <div 
          className="p-8 rounded-2xl bg-white/75 backdrop-blur-xl border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs group"
          data-cursor="pointer"
          data-cursor-text="ACADEMIC"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">01</span>
            <GraduationCap size={18} className="text-[#10B981]" />
          </div>
          <div className="font-sans font-black text-lg text-[#0F172A] uppercase tracking-tight mb-2">
            B.Tech CSE (AI &amp; ML)
          </div>
          <p className="font-serif italic font-light text-sm text-slate-600 leading-relaxed">
            Netaji Subhash Engineering College (2024–2028). Specialized in machine learning models and scalable systems.
          </p>
        </div>

        {/* Monolith 2 */}
        <div 
          className="p-8 rounded-2xl bg-white/75 backdrop-blur-xl border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs group"
          data-cursor="pointer"
          data-cursor-text="LATVIA"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">02</span>
            <Globe size={18} className="text-sky-600" />
          </div>
          <div className="font-sans font-black text-lg text-[#0F172A] uppercase tracking-tight mb-2">
            Latvia Cricket &amp; EU Ops
          </div>
          <p className="font-serif italic font-light text-sm text-slate-600 leading-relaxed">
            Modernized national digital governing infrastructure for the Latvian Cricket Federation and EU trade channels.
          </p>
        </div>

        {/* Monolith 3 */}
        <div 
          className="p-8 rounded-2xl bg-white/75 backdrop-blur-xl border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs group"
          data-cursor="pointer"
          data-cursor-text="ENGINE"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">03</span>
            <Compass size={18} className="text-emerald-600" />
          </div>
          <div className="font-sans font-black text-lg text-[#0F172A] uppercase tracking-tight mb-2">
            278-Key Client Engine
          </div>
          <p className="font-serif italic font-light text-sm text-slate-600 leading-relaxed">
            Zero-API in-memory English-Russian dictionary with &lt;5ms lookup for global B2B agricultural export buyers.
          </p>
        </div>

        {/* Monolith 4 */}
        <div 
          className="p-8 rounded-2xl bg-white/75 backdrop-blur-xl border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs group"
          data-cursor="pointer"
          data-cursor-text="SCHOLAR"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">04</span>
            <Award size={18} className="text-emerald-600" />
          </div>
          <div className="font-sans font-black text-lg text-[#0F172A] uppercase tracking-tight mb-2">
            The Heritage School
          </div>
          <p className="font-serif italic font-light text-sm text-slate-600 leading-relaxed">
            ISC Class XII (82.75%, 2024) with distinction in Computer Science &amp; Mathematics; ICSE (89.4%).
          </p>
        </div>
      </div>
    </section>
  );
};
