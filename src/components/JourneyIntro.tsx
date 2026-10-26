"use client";

import React from "react";
import { DoodleCharacter } from "./DoodleCharacter";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const JourneyIntro: React.FC = () => {
  return (
    <section id="journey" className="relative py-28 bg-[#FFFFFF] border-y border-[#E9E7E3] overflow-hidden">
      {/* Decorative journey path connecting from previous section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 px-3 py-1 w-fit rounded-full bg-[#FAF9F6] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
          <span>SCENE 02 / THE PATHWAY</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Character walking along the journey line */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-2xl bg-[#FAF9F6] border border-[#E9E7E3] w-full max-w-sm flex flex-col items-center">
              {/* Hand-drawn journey waypoint banner */}
              <div className="w-full flex items-center justify-between font-mono text-[11px] text-[#6B6B6B] border-b border-[#E9E7E3] pb-2 mb-4">
                <span>TRANSIT POINT</span>
                <span className="text-[#F97316] font-semibold">STAGE 01 → 02</span>
              </div>

              <DoodleCharacter
                pose="path-walking"
                size={270}
                caption="In Transit: Operations → Engineering"
              />

              {/* Progress step */}
              <div className="w-full mt-4 bg-white rounded-lg p-3 border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B]">
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span>Journey Progression</span>
                  <span className="text-[#F97316] font-bold">25%</span>
                </div>
                <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E9E7E3]">
                  <div className="bg-[#F97316] h-full w-1/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Large, well-composed typography statement */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <h2 className="font-mono text-xs text-[#F97316] uppercase tracking-wider font-semibold mb-3">
              Professional Approach & Engineering Philosophy
            </h2>

            <blockquote className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#202124] tracking-tight leading-[1.15] mb-8">
              &ldquo;From digital operations to the code behind the experience.&rdquo;
            </blockquote>

            <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed mb-6">
              Engineering isn&apos;t just writing syntax in isolation — it&apos;s solving tangible operational bottlenecks, making interfaces intuitive for real human beings, and ensuring digital systems stay resilient under actual business pressures.
            </p>

            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-8">
              My journey pairs continuous undergraduate studies in Computer Science and Engineering (specializing in AI & Machine Learning) with live responsibilities across international sports federations, bilateral exchange bodies, and export enterprises.
            </p>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3]">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E9E7E3] flex items-center justify-center text-[#F97316] font-mono font-bold text-xs mb-2">
                  01
                </div>
                <div className="font-sans font-semibold text-sm text-[#202124] mb-1">
                  Practical Frontend
                </div>
                <div className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                  Clean DOM architecture, zero-latency client-side localization, responsive accessibility.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3]">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E9E7E3] flex items-center justify-center text-[#F97316] font-mono font-bold text-xs mb-2">
                  02
                </div>
                <div className="font-sans font-semibold text-sm text-[#202124] mb-1">
                  Digital Operations
                </div>
                <div className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                  DNS troubleshooting, hosting stability, cross-border workflow automation, asset pipelines.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3]">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E9E7E3] flex items-center justify-center text-[#F97316] font-mono font-bold text-xs mb-2">
                  03
                </div>
                <div className="font-sans font-semibold text-sm text-[#202124] mb-1">
                  Rigorous Basics
                </div>
                <div className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                  Data Structures & Algorithms, OOP, relational databases, and debugging fundamentals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
