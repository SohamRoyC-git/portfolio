"use client";

import React, { memo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Globe,
  Search,
} from "lucide-react";
import { TechIcons } from "./TechIcons";

interface TechItem {
  id: string;
  name: string;
  category: "frontend" | "languages" | "aiml" | "performance" | "systems";
  categoryLabel: string;
  icon: keyof typeof TechIcons;
  level: "Architectural" | "Production Ready" | "Core Competency" | "Foundational";
  role: string;
  description: string;
  projectHighlight: string;
  metrics: string;
}

const TECH_ITEMS: TechItem[] = [
  // Column 1 Stack
  {
    id: "nextjs",
    name: "Next.js 16",
    category: "frontend",
    categoryLabel: "Frontend Architecture",
    icon: "nextjs",
    level: "Architectural",
    role: "App Router Full-Stack Framework",
    description: "Server/Client component orchestration, hybrid rendering, static prerendering, and edge deployment.",
    projectHighlight: "Spatial Developer Portfolio & Next-Gen Web Portals",
    metrics: "Turbopack / Webpack build optimization",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    categoryLabel: "Core Languages",
    icon: "typescript",
    level: "Production Ready",
    role: "Type-Safe System Contracts",
    description: "Strict compile-time verification, utility types, and generic interfaces across application modules.",
    projectHighlight: "End-to-End Type Safety in React Architectures",
    metrics: "100% strict type checking with zero runtime overhead",
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    categoryLabel: "AI & Scripting",
    icon: "python",
    level: "Core Competency",
    role: "AI/ML Pipelines & Automation",
    description: "Data preprocessing, algorithm foundations, neural network modeling, and automation scripts.",
    projectHighlight: "Academic AI/ML Systems & Scripting Automation",
    metrics: "Algorithmic data pipelines",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS v4",
    category: "frontend",
    categoryLabel: "Design Tokens",
    icon: "tailwind",
    level: "Architectural",
    role: "Utility & Design Token Engine",
    description: "High-performance CSS compilation, fluid typography scales, and custom Italian Sand theme tokens.",
    projectHighlight: "Custom Editorial & Obsidian Design Systems",
    metrics: "Sub-10kb critical CSS footprint",
  },
  {
    id: "docker",
    name: "Docker",
    category: "systems",
    categoryLabel: "DevOps & Containers",
    icon: "docker",
    level: "Core Competency",
    role: "Containerized Workflows",
    description: "Isolated environments, repeatable image builds, and multi-stage container pipelines.",
    projectHighlight: "Modern Development Containerisation",
    metrics: "Consistent reproducible environments",
  },

  // Column 2 Stack
  {
    id: "react",
    name: "React 19",
    category: "frontend",
    categoryLabel: "Frontend Architecture",
    icon: "react",
    level: "Architectural",
    role: "Concurrent UI Runtime",
    description: "Fine-grained reactive state hooks (useCallback, useRef), concurrent rendering, and memoized trees.",
    projectHighlight: "Client-Side Multilingual Engine & Spatial UI",
    metrics: "Zero unnecessary re-renders",
  },
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "languages",
    categoryLabel: "Core Languages",
    icon: "javascript",
    level: "Architectural",
    role: "Asynchronous Web Runtime",
    description: "Event-driven asynchronous DOM manipulation, custom event buses, and client-side dictionary stores.",
    projectHighlight: "IziEat Custom Localisation Engine (200+ keys)",
    metrics: "Zero-dependency client execution",
  },
  {
    id: "gsap",
    name: "GSAP 3.15",
    category: "frontend",
    categoryLabel: "Kinetic Animation",
    icon: "gsap",
    level: "Architectural",
    role: "Kinetic ScrollTrigger Engine",
    description: "Pinned stages, scrubbed timelines, curtain reveals, and responsive matchMedia animations.",
    projectHighlight: "Forge Automotive Spatial Storytelling & Domes",
    metrics: "60fps buttery GPU acceleration",
  },
  {
    id: "aws",
    name: "AWS Cloud",
    category: "systems",
    categoryLabel: "Cloud Infrastructure",
    icon: "aws",
    level: "Foundational",
    role: "Cloud Services & Storage",
    description: "S3 storage buckets, edge distribution, cloud hosting, and serverless compute primitives.",
    projectHighlight: "Cloud Asset Hosting & Deployment",
    metrics: "High availability & edge delivery",
  },
  {
    id: "i18n",
    name: "Client i18n",
    category: "systems",
    categoryLabel: "Systems & Operations",
    icon: "i18n",
    level: "Architectural",
    role: "Zero-Dependency Localisation",
    description: "Custom dictionary with 200+ structured translation keys across languages without external API lag.",
    projectHighlight: "IziEat Agricultural Export Business",
    metrics: "200+ structured keys, 0 external API lag",
  },

  // Column 3 Stack
  {
    id: "framer",
    name: "Framer Motion",
    category: "frontend",
    categoryLabel: "Frontend Architecture",
    icon: "framer",
    level: "Production Ready",
    role: "Spring Physics & Modals",
    description: "Curtain unmasking reveals, spring physics animations, layout transitions, and staggered kinetic typography.",
    projectHighlight: "Forge Navigation Drawer & 3D Card Physics",
    metrics: "Physical spring easing transitions",
  },
  {
    id: "cpp",
    name: "C++",
    category: "languages",
    categoryLabel: "Core Languages",
    icon: "cpp",
    level: "Foundational",
    role: "Data Structures & OOP",
    description: "Core algorithms, data structures, object-oriented concepts, and computational foundations.",
    projectHighlight: "NSEC Computer Science Fundamentals",
    metrics: "Low-level computational efficiency",
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "frontend",
    categoryLabel: "3D Spatial Web",
    icon: "threejs",
    level: "Core Competency",
    role: "WebGL 3D Scenes",
    description: "WebGL 3D rendering, camera perspective control, procedural meshes, and lighting effects for spatial depth.",
    projectHighlight: "Interactive 3D Viewport Experiences",
    metrics: "Direct WebGL rendering pipeline",
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "systems",
    categoryLabel: "Systems & Operations",
    icon: "git",
    level: "Production Ready",
    role: "Version Control & CI/CD",
    description: "Branching strategies, CI/CD automated deployments, release tagging, and collaborative workflow management.",
    projectHighlight: "Multi-branch deployment pipelines & GitHub Actions",
    metrics: "Zero merge conflicts in production",
  },
  {
    id: "aiml",
    name: "Machine Learning",
    category: "aiml",
    categoryLabel: "AI / ML Foundations",
    icon: "aiml",
    level: "Core Competency",
    role: "Predictive Models & Neural Nets",
    description: "Supervised and unsupervised learning, regression, classification, clustering, and neural concepts.",
    projectHighlight: "B.Tech CSE (AI & ML) Curriculum",
    metrics: "Mathematical foundations & model validation",
  },

  // Column 4 Stack
  {
    id: "html5",
    name: "HTML5",
    category: "languages",
    categoryLabel: "Core Languages",
    icon: "html5",
    level: "Architectural",
    role: "Semantic Web Structure",
    description: "Accessible ARIA markup, semantic layout architecture, and DOM hierarchy integrity.",
    projectHighlight: "Client Portals & Responsive Mobile Experiences",
    metrics: "100% WCAG semantic compliance",
  },
  {
    id: "css3",
    name: "CSS3 / Modern CSS",
    category: "languages",
    categoryLabel: "Core Languages",
    icon: "css3",
    level: "Architectural",
    role: "Cascading Style Sheets",
    description: "CSS custom properties, modern flexbox/grid layout engines, and hardware-accelerated animations.",
    projectHighlight: "Cross-browser fluid layouts",
    metrics: "High-performance CSS rendering",
  },
  {
    id: "node",
    name: "Node.js",
    category: "systems",
    categoryLabel: "Backend & Tooling",
    icon: "node",
    level: "Production Ready",
    role: "JavaScript Server Runtime",
    description: "Server-side scripts, build orchestration, PostCSS transforms, and tooling automation.",
    projectHighlight: "Full-Stack Web Deployments & CLI Tooling",
    metrics: "Asynchronous non-blocking I/O",
  },
  {
    id: "seo",
    name: "Technical SEO",
    category: "performance",
    categoryLabel: "Performance & SEO",
    icon: "seo",
    level: "Production Ready",
    role: "Organic Crawl & Discovery",
    description: "Automated XML sitemaps, robots.txt directives, OpenGraph meta tags, and Google Search Console indexing.",
    projectHighlight: "International Client Discoverability",
    metrics: "Zero crawl errors in Search Console",
  },
];

// Split into 4 columns for the alternating vertical marquee
const COLUMN_1 = [TECH_ITEMS[0], TECH_ITEMS[1], TECH_ITEMS[2], TECH_ITEMS[3], TECH_ITEMS[4]];
const COLUMN_2 = [TECH_ITEMS[5], TECH_ITEMS[6], TECH_ITEMS[7], TECH_ITEMS[8], TECH_ITEMS[9]];
const COLUMN_3 = [TECH_ITEMS[10], TECH_ITEMS[11], TECH_ITEMS[12], TECH_ITEMS[13], TECH_ITEMS[14]];
const COLUMN_4 = [TECH_ITEMS[15], TECH_ITEMS[16], TECH_ITEMS[17], TECH_ITEMS[18], TECH_ITEMS[0]];

export const ArchitecturalMatrix: React.FC = memo(() => {
  const [isExplorationMode, setIsExplorationMode] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECH_ITEMS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const sectionRef = useRef<HTMLElement | null>(null);

  const categories = [
    { id: "all", label: "ALL TECHNOLOGIES" },
    { id: "frontend", label: "FRONTEND & 3D" },
    { id: "languages", label: "LANGUAGES" },
    { id: "aiml", label: "AI / ML" },
    { id: "systems", label: "SYSTEMS & CLOUD" },
    { id: "performance", label: "PERFORMANCE & SEO" },
  ];

  const filteredExploreItems = TECH_ITEMS.filter((item) => {
    const matchesCategory = activeCategoryFilter === "all" || item.category === activeCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="monument-matrix"
      ref={sectionRef}
      className="relative w-full z-30 min-h-[100svh] py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#0B0609] text-[#F8F5EE] border-t border-[#EAD7C0]/15 select-none overflow-hidden"
    >
      {/* Background Architectural Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#EAD7C0_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#FF8C38]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-[#10B981]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between flex-1 gap-12 sm:gap-16">
        
        {/* ========================================================================= */}
        {/* TWO-COLUMN LAYOUT MIRRORING YOUR REFERENCE VIDEO                          */}
        {/* Left: Editorial Header & Trigger | Right: 4-Column Floating Marquee / Grid*/}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: EDITORIAL NARRATIVE & EXPLORE ACTION                       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            {/* Pill Eyebrow matching reference video "* Our Tech Stack" */}
            <div className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.24em] text-[#FF8C38] mb-5 px-3.5 py-1.5 rounded-full border border-[#FF8C38]/30 bg-[#FF8C38]/10 backdrop-blur-md">
              <span className="text-xs">✱</span>
              <span>OUR TECH STACK</span>
            </div>

            {/* Main Headline matching reference */}
            <h2 className="font-sans font-black text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-[#FFFDF8] tracking-tight leading-[1.05] mb-5">
              Key Technologies &amp; <br />
              <span className="text-[#EAD7C0]/70">Platforms</span>
            </h2>

            {/* Descriptive Body Narrative matching reference */}
            <p className="font-sans font-normal text-sm sm:text-base text-[#D8C4AE]/80 leading-relaxed max-w-md mb-8">
              We work with leading platforms, modern runtimes, and engineering frameworks that empower digital transformation, accelerate delivery, and drive measurable real-world outcomes.
            </p>

            {/* Action Pill matching reference "Explore Tech Stack" */}
            <button
              onClick={() => setIsExplorationMode(!isExplorationMode)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black hover:bg-[#FF8C38] hover:text-white font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            >
              <span>{isExplorationMode ? "Back to Kinetic Flow" : "Explore Tech Stack"}</span>
              {isExplorationMode ? (
                <RotateCcw size={13} className="rotate-180" />
              ) : (
                <ArrowRight size={13} />
              )}
            </button>

            {/* Active Mode Notice */}
            <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isExplorationMode
                  ? "GRID EXPLORATION ACTIVE · CLICK ANY LOGO TO INSPECT EXAMPLES"
                  : "CONTINUOUS 4-COLUMN VERTICAL KINETIC FLOW"}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: 4-COLUMN VERTICAL MARQUEE / FULL ROW-WISE EXPLORATION VIEW*/}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 w-full flex justify-center">
            
            <AnimatePresence mode="wait">
              {!isExplorationMode ? (
                /* ================================================================= */
                /* MODE 1: 4-COLUMN ALTERNATING VERTICAL MARQUEE (EXACT VIDEO MATCH) */
                /* ================================================================= */
                <motion.div
                  key="kinetic-marquee-view"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full max-w-xl h-[460px] sm:h-[500px] rounded-3xl border border-[#EAD7C0]/20 bg-[#14050A]/60 backdrop-blur-2xl overflow-hidden p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
                >
                  {/* Top and Bottom Gradient Fade Masks (for smooth entry and exit) */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#14050A] via-[#14050A]/80 to-transparent z-10" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#14050A] via-[#14050A]/80 to-transparent z-10" />

                  {/* 4 Alternating Vertical Columns Container */}
                  <div className="grid grid-cols-4 gap-3 sm:gap-4 h-full">
                    
                    {/* COLUMN 1: FLOATS UPWARD */}
                    <div className="flex flex-col gap-3 sm:gap-4 animate-marquee-up hover:[animation-play-state:paused]">
                      {[...COLUMN_1, ...COLUMN_1, ...COLUMN_1].map((item, idx) => {
                        const IconComponent = TechIcons[item.icon];
                        return (
                          <div
                            key={`col1-${item.id}-${idx}`}
                            className="w-full aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center p-3 text-white hover:bg-[#EAD7C0] hover:text-[#0B0609] hover:border-[#EAD7C0] transition-all duration-300 cursor-pointer group shadow-sm hover:scale-105 active:scale-95"
                          >
                            <IconComponent size={28} className="transition-transform group-hover:scale-110" />
                          </div>
                        );
                      })}
                    </div>

                    {/* COLUMN 2: FLOATS DOWNWARD */}
                    <div className="flex flex-col gap-3 sm:gap-4 animate-marquee-down hover:[animation-play-state:paused]">
                      {[...COLUMN_2, ...COLUMN_2, ...COLUMN_2].map((item, idx) => {
                        const IconComponent = TechIcons[item.icon];
                        return (
                          <div
                            key={`col2-${item.id}-${idx}`}
                            className="w-full aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center p-3 text-white hover:bg-[#EAD7C0] hover:text-[#0B0609] hover:border-[#EAD7C0] transition-all duration-300 cursor-pointer group shadow-sm hover:scale-105 active:scale-95"
                          >
                            <IconComponent size={28} className="transition-transform group-hover:scale-110" />
                          </div>
                        );
                      })}
                    </div>

                    {/* COLUMN 3: FLOATS UPWARD */}
                    <div className="flex flex-col gap-3 sm:gap-4 animate-marquee-up hover:[animation-play-state:paused]">
                      {[...COLUMN_3, ...COLUMN_3, ...COLUMN_3].map((item, idx) => {
                        const IconComponent = TechIcons[item.icon];
                        return (
                          <div
                            key={`col3-${item.id}-${idx}`}
                            className="w-full aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center p-3 text-white hover:bg-[#EAD7C0] hover:text-[#0B0609] hover:border-[#EAD7C0] transition-all duration-300 cursor-pointer group shadow-sm hover:scale-105 active:scale-95"
                          >
                            <IconComponent size={28} className="transition-transform group-hover:scale-110" />
                          </div>
                        );
                      })}
                    </div>

                    {/* COLUMN 4: FLOATS DOWNWARD */}
                    <div className="flex flex-col gap-3 sm:gap-4 animate-marquee-down hover:[animation-play-state:paused]">
                      {[...COLUMN_4, ...COLUMN_4, ...COLUMN_4].map((item, idx) => {
                        const IconComponent = TechIcons[item.icon];
                        return (
                          <div
                            key={`col4-${item.id}-${idx}`}
                            className="w-full aspect-square rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center p-3 text-white hover:bg-[#EAD7C0] hover:text-[#0B0609] hover:border-[#EAD7C0] transition-all duration-300 cursor-pointer group shadow-sm hover:scale-105 active:scale-95"
                          >
                            <IconComponent size={28} className="transition-transform group-hover:scale-110" />
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </motion.div>
              ) : (
                /* ================================================================= */
                /* MODE 2: ROW-WISE EXPLORATION VIEW WITH CLICKABLE EXAMPLES         */
                /* ================================================================= */
                <motion.div
                  key="row-wise-explore-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col gap-5 bg-[#14050A]/90 border border-[#EAD7C0]/25 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl"
                >
                  {/* Category Filter Pills & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                            activeCategoryFilter === cat.id
                              ? "bg-[#FF8C38] text-black font-bold shadow-sm"
                              : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filter stack..."
                        className="pl-7 pr-3 py-1 rounded-full bg-black/40 border border-white/15 text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8C38]"
                      />
                    </div>
                  </div>

                  {/* Full Row-Wise Grid of Tech Logos */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {filteredExploreItems.map((item) => {
                      const IconComponent = TechIcons[item.icon];
                      const isSelected = selectedTech.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedTech(item)}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2.5 transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-[#EAD7C0] text-[#0B0609] border-[#FF8C38] shadow-lg scale-105"
                              : "bg-white/5 text-white border-white/10 hover:bg-[#EAD7C0] hover:text-[#0B0609] hover:border-[#EAD7C0]"
                          }`}
                        >
                          <IconComponent size={24} />
                          <span className="text-[9px] font-sans font-bold tracking-tight truncate max-w-full mt-1.5">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Tech Detail Drawer with Real-World Production Examples */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#EAD7C0]/20 flex flex-col gap-3">
                    <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-black text-lg text-[#FFFDF8]">
                            {selectedTech.name}
                          </h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-950/30">
                            {selectedTech.level}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#FF8C38] uppercase mt-0.5">
                          {selectedTech.role}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {selectedTech.categoryLabel}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[#D8C4AE] leading-relaxed">
                      {selectedTech.description}
                    </p>

                    {/* Production Example Highlight */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-1.5 text-white/90">
                        <CheckCircle2 size={13} className="text-[#FF8C38]" />
                        <span className="font-bold text-[11px]">Production Implementation:</span>
                        <span className="text-[11px] text-[#EAD7C0]">{selectedTech.projectHighlight}</span>
                      </div>

                      <div className="font-mono text-[10px] text-emerald-400">
                        {selectedTech.metrics}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* Global CSS Animation Keyframes for the Alternating Vertical Marquee */}
      <style jsx>{`
        @keyframes marqueeUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes marqueeDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-marquee-up {
          animation: marqueeUp 24s linear infinite;
        }
        .animate-marquee-down {
          animation: marqueeDown 24s linear infinite;
        }
      `}</style>
    </section>
  );
});

ArchitecturalMatrix.displayName = "ArchitecturalMatrix";
