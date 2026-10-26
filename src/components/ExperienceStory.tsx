"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EXPERIENCES, ExperienceItem } from "@/data/portfolioData";
import { DoodleCharacter } from "./DoodleCharacter";
import { MapPin, Calendar, CheckCircle2, Globe, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export const ExperienceStory: React.FC = () => {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const activeExp = EXPERIENCES[activeStopIndex];

  return (
    <section id="experience" className="relative py-28 bg-[#FAF9F6] border-b border-[#E9E7E3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>SCENE 03 / INTERNATIONAL EXPEDITION</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[#202124] tracking-tight">
              Professional Journey & Cross-Border Exposure
            </h2>
          </div>
          <p className="font-sans text-sm text-[#6B6B6B] max-w-md">
            Four verified operational and engineering engagements spanning national sports bodies, bilateral cultural initiatives, and international trade.
          </p>
        </div>

        {/* ============================================================
            DESKTOP INTERACTIVE JOURNEY SCRUBBER (Hidden on mobile)
           ============================================================ */}
        <div className="hidden lg:block">
          {/* Station Selector Bar along continuous drawn path */}
          <div className="relative mb-12">
            {/* The Drawn Path Line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#E9E7E3] z-0" />
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#F97316] z-0 transition-all duration-500 ease-out"
              style={{
                width: `${(activeStopIndex / (EXPERIENCES.length - 1)) * 100}%`,
              }}
            />

            {/* Station Buttons */}
            <div className="relative z-10 flex justify-between">
              {EXPERIENCES.map((exp, idx) => {
                const isActive = activeStopIndex === idx;
                const isPassed = activeStopIndex >= idx;

                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveStopIndex(idx)}
                    className="group flex flex-col items-center text-center focus:outline-none"
                    aria-label={`View stop ${idx + 1}: ${exp.organization}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all duration-300 ${
                        isActive
                          ? "bg-[#F97316] text-white border-[#F97316] ring-4 ring-[#F97316]/20 scale-110 shadow-md"
                          : isPassed
                          ? "bg-white text-[#202124] border-[#F97316] shadow-sm"
                          : "bg-white text-[#6B6B6B] border-[#E9E7E3] group-hover:border-[#202124]"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <span
                      className={`mt-3 font-sans text-xs font-semibold max-w-[150px] transition-colors ${
                        isActive ? "text-[#F97316]" : "text-[#202124]"
                      }`}
                    >
                      {exp.organization}
                    </span>

                    <span className="font-mono text-[10px] text-[#6B6B6B] mt-0.5">
                      {exp.period.split("–")[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Experience Main Visual Stage */}
          <div className="grid grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border border-[#E9E7E3] p-8 shadow-sm transition-all duration-300">
            {/* Left 4 cols: Character in Traveler Pose & Waypoint Metadata */}
            <div className="col-span-4 flex flex-col justify-between p-6 bg-[#FAF9F6] rounded-2xl border border-[#E9E7E3]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase text-[#F97316] font-bold tracking-wider">
                    Stop 0{activeStopIndex + 1} / 04
                  </span>
                  <span className="text-xl" title={activeExp.country}>
                    {activeExp.flag}
                  </span>
                </div>

                <div className="font-sans font-bold text-xl text-[#202124] mb-1">
                  {activeExp.country}
                </div>
                <div className="font-mono text-xs text-[#6B6B6B] mb-6 flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#F97316]" />
                  {activeExp.location}
                </div>
              </div>

              {/* 3D Transit Artifact Card with Verified Emblem */}
              <div className="flex flex-col items-center justify-center my-4 p-4 rounded-2xl bg-white border border-[#E9E7E3] shadow-sm w-full">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#FAF9F6] border border-[#E9E7E3] p-2 flex items-center justify-center shadow-xs">
                  {activeExp.badgeAsset ? (
                    <Image
                      src={activeExp.badgeAsset}
                      alt={activeExp.organization}
                      fill
                      sizes="150px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <Globe size={48} className="text-[#F97316]" />
                  )}
                </div>
                <span className="mt-3 text-[11px] font-mono text-[#6B6B6B] bg-[#FAF9F6] px-3 py-1 rounded-full border border-[#E9E7E3]">
                  Transit Waypoint • Stop 0{activeStopIndex + 1}
                </span>
              </div>

              {/* Verified Status Tag */}
              <div className="pt-4 border-t border-[#E9E7E3] flex items-center justify-between text-xs font-mono text-[#6B6B6B]">
                <span className="flex items-center gap-1 text-[#202124] font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  CV Verified Role
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-[#E9E7E3]">
                  {activeExp.category}
                </span>
              </div>
            </div>

            {/* Right 8 cols: Detailed Experience Content & Asset Previews */}
            <div className="col-span-8 flex flex-col justify-between pl-4">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#202124] mb-1">
                      {activeExp.role}
                    </h3>
                    <div className="font-sans text-base font-semibold text-[#F97316]">
                      {activeExp.organization}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#6B6B6B] bg-[#FAF9F6] px-3 py-1.5 rounded-full border border-[#E9E7E3]">
                    <Calendar size={13} className="text-[#F97316]" />
                    <span>{activeExp.period}</span>
                  </div>
                </div>

                <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-6">
                  {activeExp.summary}
                </p>

                {/* Responsibilities list */}
                <div className="mb-6">
                  <div className="font-mono text-xs uppercase tracking-wider text-[#202124] font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#F97316]" />
                    Core Responsibilities & Technical Scope
                  </div>
                  <ul className="space-y-2.5">
                    {activeExp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-sans text-[#202124]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom: Deliverables & Brand Media Preview */}
              <div className="pt-6 border-t border-[#E9E7E3] grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#6B6B6B] mb-2 font-semibold">
                    Key Deliverables
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeExp.deliverables.map((deliv, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] bg-[#FAF9F6] border border-[#E9E7E3] px-2.5 py-1 rounded-md text-[#202124]"
                      >
                        {deliv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Asset Preview Thumbnail */}
                {activeExp.badgeAsset && (
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-mono text-[10px] text-[#6B6B6B]">Supplied Artifact:</span>
                    <div className="relative w-14 h-14 rounded-xl border border-[#E9E7E3] bg-[#FAF9F6] p-1.5 flex items-center justify-center overflow-hidden shadow-xs">
                      <Image
                        src={activeExp.badgeAsset}
                        alt={`${activeExp.organization} verified asset`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            MOBILE NATURAL VERTICAL TIMELINE (Shown on mobile & tablet)
           ============================================================ */}
        <div className="lg:hidden space-y-8">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-[#E9E7E3] p-6 shadow-sm relative overflow-hidden"
            >
              {/* Top Station Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-2.5 py-1 rounded-md">
                  STOP 0{idx + 1} • {exp.country} {exp.flag}
                </span>
                <span className="font-mono text-[11px] text-[#6B6B6B] flex items-center gap-1">
                  <Calendar size={11} />
                  {exp.period}
                </span>
              </div>

              <h3 className="font-sans font-bold text-xl text-[#202124] mb-1">
                {exp.role}
              </h3>
              <div className="font-sans font-semibold text-sm text-[#F97316] mb-3">
                {exp.organization}
              </div>

              <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed mb-4">
                {exp.summary}
              </p>

              {/* Responsibilities */}
              <div className="space-y-2 mb-4">
                {exp.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-sans text-[#202124]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              {/* Deliverables tags */}
              <div className="pt-3 border-t border-[#E9E7E3] flex flex-wrap gap-1">
                {exp.deliverables.map((deliv, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] bg-[#FAF9F6] border border-[#E9E7E3] px-2 py-0.5 rounded text-[#202124]"
                  >
                    {deliv}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
