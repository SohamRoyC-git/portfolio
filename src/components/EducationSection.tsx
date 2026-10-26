"use client";

import React from "react";
import { EDUCATION, PERSONAL_INFO } from "@/data/portfolioData";
import { GraduationCap, BookOpen, Calendar, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface EducationSectionProps {
  onContactClick: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ onContactClick }) => {
  return (
    <section id="education" className="relative py-28 bg-[#FFFFFF] border-b border-[#E9E7E3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>SCENE 06 / ACADEMIC FOUNDATIONS</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[#202124] tracking-tight">
              Education & Engineering Progression
            </h2>
          </div>

          <p className="font-sans text-sm text-[#6B6B6B] max-w-md">
            Undergraduate engineering curriculum in Computer Science (AI & ML) supported by strong science and mathematics fundamentals.
          </p>
        </div>

        {/* Education Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {EDUCATION.map((edu, idx) => (
            <div
              key={edu.degree}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                idx === 0
                  ? "bg-[#FAF9F6] border-[#F97316] shadow-md ring-2 ring-[#F97316]/10"
                  : "bg-white border-[#E9E7E3] shadow-xs"
              }`}
            >
              <div>
                {/* Degree Badge & Year */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3] mb-4">
                  <span className="font-mono text-xs font-bold text-[#F97316] flex items-center gap-1.5">
                    {idx === 0 ? <GraduationCap size={15} /> : <BookOpen size={14} />}
                    {idx === 0 ? "CURRENT DEGREE" : `FOUNDATION 0${idx}`}
                  </span>
                  <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1">
                    <Calendar size={11} />
                    {edu.period}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-lg text-[#202124] mb-1.5 leading-snug">
                  {edu.degree}
                </h3>

                <div className="font-sans font-semibold text-sm text-[#202124] mb-3">
                  {edu.institution}
                </div>

                <div className="font-mono text-[11px] text-[#6B6B6B] flex items-center gap-1 mb-4">
                  <MapPin size={11} className="text-[#F97316]" />
                  <span>{edu.location}</span>
                </div>

                {/* Highlights */}
                <ul className="space-y-2">
                  {edu.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-sans text-[#6B6B6B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status pill */}
              <div className="mt-6 pt-4 border-t border-[#E9E7E3]">
                <span
                  className={`inline-block font-mono text-[11px] px-2.5 py-1 rounded-md ${
                    idx === 0
                      ? "bg-[#F97316]/10 text-[#F97316] font-semibold"
                      : "bg-[#FAF9F6] text-[#6B6B6B]"
                  }`}
                >
                  {edu.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Direction Statement Banner */}
        <div className="bg-[#202124] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="font-mono text-xs text-[#F97316] uppercase font-bold tracking-wider mb-2 block">
              Professional Objective & Next Step
            </span>

            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white mb-4 leading-snug">
              Seeking Software Development & Web Development Internship Opportunities
            </h3>

            <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
              I am actively looking for engineering roles where I can contribute to practical web features, solve real-world user interface challenges, optimize frontend operations, and collaborate within a growth-focused engineering team.
            </p>

            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-mono text-xs font-semibold rounded-full shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Connect for Internship Inquiries</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Decorative code watermark in background */}
          <div className="absolute right-4 bottom-2 text-neutral-800 font-mono text-8xl font-black opacity-30 select-none pointer-events-none">
            2026–2028
          </div>
        </div>
      </div>
    </section>
  );
};
