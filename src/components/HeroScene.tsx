"use client";

import React from "react";
import { DoodleCharacter } from "./DoodleCharacter";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { ArrowDown, Sparkles, Code2, Globe2, Layers, Terminal } from "lucide-react";

interface HeroSceneProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ onExploreClick, onContactClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[#FAF9F6]"
    >
      {/* Subtle architectural background grid & paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(#202124 0.65px, transparent 0.65px),
            linear-gradient(to right, #E9E7E3 1px, transparent 1px),
            linear-gradient(to bottom, #E9E7E3 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px, 120px 120px, 120px 120px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      {/* Narrative chapter tag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
          <span>SCENE 01 / PROTAGONIST INTRODUCTION</span>
          <span className="text-[#E9E7E3]">|</span>
          <span className="text-[#202124] font-medium">THE DEVELOPER&apos;S JOURNEY</span>
        </div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & Narrative Copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Monogram & Title reveal */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs tracking-wider uppercase text-[#F97316] font-semibold bg-[#F97316]/10 px-2.5 py-1 rounded-md">
                Frontend • Software • Operations
              </span>
              <span className="font-mono text-xs text-[#6B6B6B]">
                Kolkata, West Bengal, India
              </span>
            </div>

            <h1 className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl text-[#202124] tracking-tight leading-[1.05] mb-6">
              Soham <br className="hidden sm:inline" />
              <span className="relative inline-block text-[#202124]">
                Roychoudhury
                {/* Hand-drawn underline in primary orange */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#F97316] overflow-visible"
                  viewBox="0 0 280 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8 C60 2, 180 2, 277 7"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Core statement */}
            <h2 className="font-sans font-medium text-xl sm:text-2xl lg:text-3xl text-[#202124] leading-snug mb-4">
              &ldquo;Building digital experiences that work beautifully.&rdquo;
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-xl mb-8">
              {PERSONAL_INFO.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreClick}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-mono text-sm font-semibold rounded-full shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Explore My Work</span>
                <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onContactClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#202124] border border-[#E9E7E3] hover:border-[#202124] font-mono text-sm font-medium rounded-full shadow-sm transition-all duration-200"
              >
                <span>Contact Me</span>
              </button>
            </div>

            {/* Verified Credentials Pills */}
            <div className="pt-6 border-t border-[#E9E7E3] grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E7E3] shadow-xs">
                <div className="text-[11px] font-mono text-[#6B6B6B] uppercase flex items-center gap-1.5 mb-1">
                  <Code2 size={12} className="text-[#F97316]" />
                  Education
                </div>
                <div className="font-sans text-xs font-semibold text-[#202124] truncate">
                  B.Tech CSE (AI & ML)
                </div>
                <div className="font-mono text-[10px] text-[#6B6B6B]">
                  NSEC • 2024–2028
                </div>
              </div>

              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E7E3] shadow-xs">
                <div className="text-[11px] font-mono text-[#6B6B6B] uppercase flex items-center gap-1.5 mb-1">
                  <Globe2 size={12} className="text-[#F97316]" />
                  Cross-Border
                </div>
                <div className="font-sans text-xs font-semibold text-[#202124] truncate">
                  Latvia & Global B2B
                </div>
                <div className="font-mono text-[10px] text-[#6B6B6B]">
                  LCF & IZIEAT
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E7E3] shadow-xs">
                <div className="text-[11px] font-mono text-[#6B6B6B] uppercase flex items-center gap-1.5 mb-1">
                  <Layers size={12} className="text-[#F97316]" />
                  Focus
                </div>
                <div className="font-sans text-xs font-semibold text-[#202124] truncate">
                  Internship Ready
                </div>
                <div className="font-mono text-[10px] text-[#6B6B6B]">
                  Frontend & Ops
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Original Hand-drawn Protagonist Character (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Backdrop organic circle sketch */}
            <div className="relative w-full max-w-[340px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FFFFFF] border-2 border-dashed border-[#E9E7E3] transform -rotate-3 scale-95" />

              {/* Character in Hero Standing Pose */}
              <DoodleCharacter
                pose="hero-standing"
                size={320}
                className="relative z-10"
                caption="Protagonist • Soham (CSE AI/ML)"
              />

              {/* Floating interactive tooltip */}
              <div className="absolute -top-3 -right-2 bg-[#202124] text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-md border border-[#202124] flex items-center gap-1.5 z-20">
                <Sparkles size={11} className="text-[#F97316]" />
                <span>Scroll to begin journey</span>
              </div>

              {/* Floating code badge */}
              <div className="absolute -bottom-2 -left-2 bg-[#FFFFFF] border border-[#E9E7E3] text-[#202124] text-[11px] font-mono px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5 z-20">
                <Terminal size={11} className="text-[#F97316]" />
                <span>status: ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom journey transition track */}
      <div className="w-full mt-10 relative flex flex-col items-center">
        <div className="flex items-center gap-2 font-mono text-xs text-[#6B6B6B]">
          <span>SCROLL DOWN TO ADVANCE</span>
          <ArrowDown size={13} className="animate-bounce text-[#F97316]" />
        </div>
        {/* Continuous journey line start */}
        <div className="w-0.5 h-10 bg-gradient-to-b from-[#E9E7E3] via-[#F97316] to-[#F97316] mt-2" />
      </div>
    </section>
  );
};
