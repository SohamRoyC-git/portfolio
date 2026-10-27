"use client";

import React, { useState } from "react";
import { Cpu, Terminal, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export const PutureProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "System Architecture & Data Modeling",
      description:
        "Analyzing requirements, drafting type-safe schemas, designing component contracts, and structuring localized content pipelines for zero runtime friction.",
      deliverable: "Schema definitions, wireframe logic, state management contracts",
    },
    {
      num: "02",
      title: "Interactive Development & Creative Motion",
      description:
        "Building responsive React 19 / Next.js 16 components, integrating GSAP timelines, physics-based scroll triggers, and hardware-accelerated 3D transforms.",
      deliverable: "Spatial UI components, 60fps animations, mobile-first responsive layout",
    },
    {
      num: "03",
      title: "Zero-Latency Client-Side Optimization",
      description:
        "Eliminating unnecessary network round-trips with instant in-memory dictionaries (like the 278-key IZIEAT engine), bundle splitting, and image optimization.",
      deliverable: "Sub-5ms dictionary switching, optimal Core Web Vitals, 0 hydration errors",
    },
    {
      num: "04",
      title: "Production Deployment & Quality Assurance",
      description:
        "Rigorous cross-browser stress testing, accessibility checks, automated build validations, and deploying on edge platforms with continuous delivery.",
      deliverable: "Edge deployment, production verification, clean audit scores",
    },
  ];

  const skillCategories = [
    {
      category: "Frontend & Creative Engineering",
      skills: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4", "GSAP 3", "Locomotive Scroll", "HTML5/CSS3"],
    },
    {
      category: "Languages & Core Systems",
      skills: ["Python", "JavaScript (ES6+)", "C / C++", "SQL", "REST APIs", "JSON Pipelines"],
    },
    {
      category: "Tools & Deployment",
      skills: ["Git & GitHub", "Turbopack", "VS Code / Linux", "Figma", "Vercel", "Performance Profiling"],
    },
  ];

  return (
    <section id="chapter-process" className="relative min-h-screen py-28 px-6 lg:px-16 z-10 max-w-7xl mx-auto">
      {/* Chapter Marker */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 w-fit">
        <span className="w-2 h-2 rounded-full bg-[#F97316]" />
        <span className="font-mono text-xs text-slate-300">04 / ENGINEERING PIPELINE</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-xs text-[#F97316]">HOW I BUILD</span>
      </div>

      <div className="mb-16">
        <h2 className="font-sans font-bold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Methodology & <br />
          <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-white bg-clip-text text-transparent">
            Technical Stack
          </span>
        </h2>
        <p className="font-sans text-base sm:text-lg text-slate-400 max-w-xl mt-3">
          Disciplined computer science principles combined with high-velocity creative execution.
        </p>
      </div>

      {/* 4 Pipeline Steps (Puture-style horizontal progression) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            onClick={() => setActiveStep(idx)}
            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeStep === idx
                ? "bg-[#12141A] border-[#F97316] shadow-[0_0_24px_rgba(249,115,22,0.25)]"
                : "bg-white/[0.02] border-white/5 hover:border-white/20"
            }`}
          >
            <div className="font-mono text-2xl font-bold text-[#F97316] mb-3">
              {step.num}
            </div>
            <h3 className="font-sans font-bold text-lg text-white mb-2">
              {step.title}
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
              {step.description}
            </p>
            <div className="pt-3 border-t border-white/5 font-mono text-[10px] text-slate-500">
              <span className="text-[#F97316]">DELIVERY:</span> {step.deliverable}
            </div>
          </div>
        ))}
      </div>

      {/* Verified Skills Grid */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#12141A]/90 border border-white/[0.12] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
          <Terminal size={20} className="text-[#F97316]" />
          <h3 className="font-sans text-xl font-bold text-white tracking-tight">
            Verified Technical Toolkit
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <div className="font-mono text-xs text-[#F97316] font-semibold uppercase tracking-wider">
                {cat.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-slate-200 hover:border-[#F97316] transition-colors"
                  >
                    {skill}
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
