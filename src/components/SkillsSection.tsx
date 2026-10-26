"use client";

import React, { useState } from "react";
import { SKILL_CATEGORIES } from "@/data/portfolioData";
import { DoodleCharacter } from "./DoodleCharacter";
import { Terminal, Monitor, Smartphone, Tablet, Code2, Cpu, Wrench, Layers, Database, ArrowRight, Play } from "lucide-react";

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"skills" | "dom-demo" | "responsive-demo">("skills");

  // DOM Playground state
  const [domCounter, setDomCounter] = useState(1);
  const [domColor, setDomColor] = useState<string>("#F97316");

  // Responsive Playground state
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const colors = ["#F97316", "#2563EB", "#16A34A", "#9333EA", "#EA580C"];

  return (
    <section id="skills" className="relative py-28 bg-[#FAF9F6] border-b border-[#E9E7E3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>SCENE 05 / THE DEVELOPER&apos;S WORKBENCH</span>
            </div>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[#202124] tracking-tight">
              Technical Toolkit & CS Foundations
            </h2>
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center p-1 bg-white rounded-full border border-[#E9E7E3] shadow-xs">
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                activeTab === "skills"
                  ? "bg-[#202124] text-white font-medium"
                  : "text-[#6B6B6B] hover:text-[#202124]"
              }`}
            >
              Curated Stack
            </button>
            <button
              onClick={() => setActiveTab("dom-demo")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                activeTab === "dom-demo"
                  ? "bg-[#202124] text-white font-medium"
                  : "text-[#6B6B6B] hover:text-[#202124]"
              }`}
            >
              DOM Lab
            </button>
            <button
              onClick={() => setActiveTab("responsive-demo")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                activeTab === "responsive-demo"
                  ? "bg-[#202124] text-white font-medium"
                  : "text-[#6B6B6B] hover:text-[#202124]"
              }`}
            >
              Layout Lab
            </button>
          </div>
        </div>

        {/* Character Workspace Header Strip */}
        <div className="bg-white rounded-3xl border border-[#E9E7E3] p-6 sm:p-8 mb-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 font-mono text-xs text-[#F97316] font-semibold uppercase mb-2">
              <Terminal size={14} />
              <span>Workspace Terminal • Engineering Discipline</span>
            </div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#202124] mb-3">
              Practical Engineering Grounded in Academic Rigor
            </h3>
            <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed max-w-2xl mb-4">
              All listed technologies represent genuine coursework, verified client projects, or direct practical implementation. Categorized strictly from my supplied CV without fabricated percentages or superficial proficiencies.
            </p>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#202124] bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#E9E7E3]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>B.Tech CSE (AI & ML) Syllabus + Live Client Deployments</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <DoodleCharacter
              pose="laptop-coding"
              size={240}
              caption="Live at the Terminal"
            />
          </div>
        </div>

        {/* ============================================================
            TAB 1: CURATED SKILLS DECK (5 Strict Categories)
           ============================================================ */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.title}
                className="bg-white rounded-2xl border border-[#E9E7E3] p-6 shadow-xs hover:border-[#F97316] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3] mb-4">
                    <span className="font-mono text-xs font-bold text-[#F97316]">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-[11px] text-[#6B6B6B] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#E9E7E3]">
                      {cat.badge}
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-lg text-[#202124] mb-1">
                    {cat.title}
                  </h4>
                  <p className="font-sans text-xs text-[#6B6B6B] mb-5 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Skills List */}
                  <div className="space-y-2">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-sans font-semibold text-xs text-[#202124]">
                            {skill.name}
                          </span>
                          {skill.note && (
                            <span className="block font-mono text-[10px] text-[#6B6B6B]">
                              {skill.note}
                            </span>
                          )}
                        </div>
                        {skill.isCore && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" title="Core skill" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {cat.title === "Backend Technologies" && (
                  <div className="mt-4 pt-3 border-t border-[#E9E7E3] font-mono text-[10px] text-[#6B6B6B] italic">
                    *Verified technical exposure. IZIEAT frontend project remains independent with zero backend dependency.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            TAB 2: INTERACTIVE DOM MANIPULATION LAB
           ============================================================ */}
        {activeTab === "dom-demo" && (
          <div className="bg-white rounded-3xl border border-[#E9E7E3] p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl mx-auto text-center mb-8">
              <span className="font-mono text-xs text-[#F97316] uppercase font-bold">
                Interactive Micro-Experiment
              </span>
              <h4 className="font-sans font-bold text-2xl text-[#202124] mt-1 mb-2">
                Live DOM Mutation & Reactive State Machine
              </h4>
              <p className="font-sans text-xs text-[#6B6B6B]">
                Demonstrating lightweight JavaScript DOM manipulation, attribute re-renders, and dynamic style calculations without external framework bloat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
              {/* Interactive Sandbox */}
              <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E9E7E3] flex flex-col items-center text-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center font-mono text-3xl font-bold text-white shadow-lg transition-all duration-300 transform"
                  style={{
                    backgroundColor: domColor,
                    transform: `scale(${1 + (domCounter % 5) * 0.05})`,
                  }}
                >
                  {domCounter}
                </div>

                <div className="font-mono text-xs text-[#6B6B6B] mt-4 mb-6">
                  element.style.backgroundColor = &quot;{domColor}&quot;
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      setDomCounter((c) => c + 1);
                      setDomColor(colors[(domCounter + 1) % colors.length]);
                    }}
                    className="px-4 py-2 bg-[#202124] hover:bg-[#F97316] text-white font-mono text-xs font-medium rounded-full transition-colors"
                  >
                    Mutate DOM Node (+1)
                  </button>
                  <button
                    onClick={() => {
                      setDomCounter(1);
                      setDomColor("#F97316");
                    }}
                    className="px-3 py-2 bg-white text-[#202124] border border-[#E9E7E3] font-mono text-xs rounded-full hover:border-[#202124]"
                  >
                    Reset
                  </button>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#6B6B6B]">Style Tokens:</span>
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDomColor(c)}
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Live DOM Inspector Code View */}
              <div className="bg-[#171717] rounded-2xl p-5 border border-neutral-800 text-neutral-300 font-mono text-xs overflow-x-auto">
                <div className="text-neutral-500 text-[10px] pb-2 border-b border-neutral-800 mb-3 flex items-center justify-between">
                  <span>DOM INSPECTOR ENGINE</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <pre className="text-[11px] leading-relaxed">
{`// Real-time Event Listener & Mutation
const node = document.querySelector("#node-target");

function handleNodeMutation() {
  node.textContent = ${domCounter};
  node.setAttribute("data-state", "active");
  node.style.backgroundColor = "${domColor}";
  node.dispatchEvent(new CustomEvent("domUpdated"));
}

// 0ms Overhead, Pure Client-Side Execution`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: RESPONSIVE LAYOUT TESTER
           ============================================================ */}
        {activeTab === "responsive-demo" && (
          <div className="bg-white rounded-3xl border border-[#E9E7E3] p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl mx-auto text-center mb-6">
              <span className="font-mono text-xs text-[#F97316] uppercase font-bold">
                Interactive Micro-Experiment
              </span>
              <h4 className="font-sans font-bold text-2xl text-[#202124] mt-1 mb-2">
                Responsive Grid & Flexbox Viewport Adaptor
              </h4>
              <p className="font-sans text-xs text-[#6B6B6B]">
                Test how interface containers adapt structurally across breakpoints using pure CSS Grid and Flexbox conventions.
              </p>
            </div>

            {/* Viewport switch buttons */}
            <div className="flex justify-center gap-2 mb-8">
              <button
                onClick={() => setViewportMode("desktop")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors ${
                  viewportMode === "desktop"
                    ? "bg-[#202124] text-white"
                    : "bg-[#FAF9F6] text-[#6B6B6B] border border-[#E9E7E3]"
                }`}
              >
                <Monitor size={13} />
                <span>Desktop (1200px)</span>
              </button>
              <button
                onClick={() => setViewportMode("tablet")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors ${
                  viewportMode === "tablet"
                    ? "bg-[#202124] text-white"
                    : "bg-[#FAF9F6] text-[#6B6B6B] border border-[#E9E7E3]"
                }`}
              >
                <Tablet size={13} />
                <span>Tablet (768px)</span>
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors ${
                  viewportMode === "mobile"
                    ? "bg-[#202124] text-white"
                    : "bg-[#FAF9F6] text-[#6B6B6B] border border-[#E9E7E3]"
                }`}
              >
                <Smartphone size={13} />
                <span>Mobile (375px)</span>
              </button>
            </div>

            {/* Simulated Frame */}
            <div className="flex justify-center">
              <div
                className="border-2 border-[#202124] rounded-2xl p-4 bg-[#FAF9F6] shadow-md transition-all duration-300 overflow-hidden"
                style={{
                  width:
                    viewportMode === "desktop"
                      ? "100%"
                      : viewportMode === "tablet"
                      ? "640px"
                      : "320px",
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E9E7E3] mb-3 font-mono text-[10px] text-[#6B6B6B]">
                  <span>SIMULATED VIEWPORT: {viewportMode.toUpperCase()}</span>
                  <span className="text-[#F97316]">CSS GRID / FLEX</span>
                </div>

                <div
                  className={`grid gap-2 ${
                    viewportMode === "desktop"
                      ? "grid-cols-3"
                      : viewportMode === "tablet"
                      ? "grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  <div className="p-3 bg-white rounded-lg border border-[#E9E7E3] text-xs font-mono text-[#202124]">
                    <div className="text-[#F97316] font-bold">Col A</div>
                    <div className="text-[10px] text-[#6B6B6B]">Flexible B2B Product Cell</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E9E7E3] text-xs font-mono text-[#202124]">
                    <div className="text-[#F97316] font-bold">Col B</div>
                    <div className="text-[10px] text-[#6B6B6B]">Dynamic Translation Matrix</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E9E7E3] text-xs font-mono text-[#202124]">
                    <div className="text-[#F97316] font-bold">Col C</div>
                    <div className="text-[10px] text-[#6B6B6B]">Operations Workflow Pipe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
