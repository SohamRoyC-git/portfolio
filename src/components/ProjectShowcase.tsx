"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PROJECTS, ProjectItem } from "@/data/portfolioData";
import { LocalizationDemo } from "./LocalizationDemo";
import { DoodleCharacter } from "./DoodleCharacter";
import { ArrowUpRight, CheckCircle2, X, ExternalLink, Layers, FileCode2, Globe, Sparkles, ShieldCheck } from "lucide-react";

export const ProjectShowcase: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="work" className="relative py-28 bg-[#FFFFFF] border-b border-[#E9E7E3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>SCENE 04 / ENGINEERING DELIVERABLES</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[#202124] tracking-tight">
              Featured Work & Case Studies
            </h2>
          </div>

          <p className="font-sans text-sm text-[#6B6B6B] max-w-md">
            Production deliverables highlighting frontend architecture, custom client-side localization, digital workflows, and website design.
          </p>
        </div>

        {/* ============================================================
            FEATURED PROJECT 01: IZIEAT (HERO SPOTLIGHT)
           ============================================================ */}
        <div className="mb-16">
          <div className="bg-[#FAF9F6] rounded-3xl border border-[#E9E7E3] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Corner Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E9E7E3] mb-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#F97316] text-white text-xs font-mono font-bold">
                  PROJECT 01 • FLAGSHIP
                </span>
                <span className="font-mono text-xs text-[#6B6B6B]">
                  Client Project | Aug 2026 – Present
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#202124] font-medium bg-white px-3 py-1 rounded-full border border-[#E9E7E3]">
                  Agricultural Export Website
                </span>
                <button
                  onClick={() => setSelectedProject(PROJECTS[0])}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#202124] text-[#202124] hover:text-white border border-[#E9E7E3] rounded-full text-xs font-mono transition-colors"
                >
                  <span>Detailed Case Study</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
              <div className="lg:col-span-8">
                <h3 className="font-sans font-bold text-2xl sm:text-4xl text-[#202124] tracking-tight mb-4">
                  IZIEAT — Business Website & Custom Multilingual Localization
                </h3>
                <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-6">
                  {PROJECTS[0].description}
                </p>

                {/* Key Technical Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {PROJECTS[0].technicalHighlights.slice(0, 4).map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#E9E7E3] text-xs font-sans text-[#202124] flex items-start gap-2"
                    >
                      <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {PROJECTS[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Character Inspecting Frame */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#E9E7E3]">
                <DoodleCharacter
                  pose="inspecting-panel"
                  size={240}
                  caption="Inspecting i18n DOM Engine"
                />
              </div>
            </div>

            {/* Embedded Interactive Localization Architecture Demonstration */}
            <div className="mt-8">
              <LocalizationDemo />
            </div>
          </div>
        </div>

        {/* ============================================================
            PROJECTS 02, 03, 04 GRID
           ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROJECTS.slice(1).map((project, idx) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between bg-[#FAF9F6] rounded-2xl border border-[#E9E7E3] hover:border-[#F97316] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3] mb-4">
                  <span className="font-mono text-xs font-bold text-[#F97316]">
                    0{idx + 2} / DELIVERABLE
                  </span>
                  <span className="font-mono text-[11px] text-[#6B6B6B]">
                    {project.period.split("–")[0].trim()}
                  </span>
                </div>

                {/* Image Preview Thumbnail */}
                {project.assets.hero && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-5 border border-[#E9E7E3] bg-white">
                    <Image
                      src={project.assets.hero}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 font-mono text-[11px] text-white font-medium drop-shadow-sm">
                      {project.client}
                    </div>
                  </div>
                )}

                <h4 className="font-sans font-bold text-lg text-[#202124] mb-2 leading-snug">
                  {project.title}
                </h4>

                <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed mb-4 line-clamp-3">
                  {project.tagline}
                </p>

                {/* Quick highlights */}
                <ul className="space-y-1.5 mb-6">
                  {project.technicalHighlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="text-xs font-sans text-[#202124] flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 shrink-0" />
                      <span className="line-clamp-2">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button & Tags */}
              <div className="pt-4 border-t border-[#E9E7E3]">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white hover:bg-[#202124] text-[#202124] hover:text-white border border-[#E9E7E3] text-xs font-mono font-medium transition-colors"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          CASE STUDY SLIDE-OVER DRAWER MODAL
         ============================================================ */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202124]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full max-w-3xl max-h-[90vh] rounded-3xl border border-[#E9E7E3] shadow-2xl overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FFFFFF]/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-[#E9E7E3] flex items-center justify-between z-10">
              <div>
                <span className="font-mono text-xs text-[#F97316] font-bold uppercase tracking-wider">
                  Case Study Dossier
                </span>
                <h3 className="font-sans font-bold text-xl text-[#202124]">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] text-[#202124] hover:bg-[#202124] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-[#E9E7E3] text-xs font-mono">
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Client</div>
                  <div className="font-semibold text-[#202124]">{selectedProject.client}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Role</div>
                  <div className="font-semibold text-[#202124]">{selectedProject.role}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Period</div>
                  <div className="font-semibold text-[#202124]">{selectedProject.period}</div>
                </div>
                <div>
                  <div className="text-[#6B6B6B] text-[10px] uppercase">Category</div>
                  <div className="font-semibold text-[#F97316]">{selectedProject.category}</div>
                </div>
              </div>

              {/* Narrative Summary */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#202124] font-bold mb-2">
                  Project Overview & Scope
                </h4>
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technical Highlights */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#202124] font-bold mb-3">
                  Technical Specifications & Key Deliverables
                </h4>
                <div className="space-y-2">
                  {selectedProject.technicalHighlights.map((th, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-sans text-[#202124] p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E9E7E3]">
                      <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>{th}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Notes */}
              <div className="p-4 bg-[#171717] text-white rounded-2xl border border-neutral-800">
                <div className="font-mono text-xs text-[#F97316] uppercase font-bold mb-1">
                  Engineering Architecture Decisions
                </div>
                <p className="font-mono text-xs text-neutral-300 leading-relaxed">
                  {selectedProject.architectureNotes}
                </p>
              </div>

              {/* Asset Preview in Modal */}
              {selectedProject.assets.hero && (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-[#E9E7E3]">
                  <Image
                    src={selectedProject.assets.hero}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#FAF9F6] border-t border-[#E9E7E3] flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 bg-[#202124] text-white font-mono text-xs font-medium rounded-full hover:bg-[#F97316] transition-colors"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
