"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  Terminal,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type TechCategory = "all" | "frontend" | "languages" | "aiml" | "performance" | "systems";

interface TechItem {
  id: string;
  name: string;
  category: "frontend" | "languages" | "aiml" | "performance" | "systems";
  level: "Architectural" | "Production Ready" | "Core Competency" | "Foundational";
  role: string;
  description: string;
  projectHighlight: string;
  metrics: string;
  codeSnippet?: string;
}

const TECH_STACK: TechItem[] = [
  // 1. Languages
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "languages",
    level: "Architectural",
    role: "Core Execution Language",
    description: "Modern asynchronous JavaScript, DOM manipulation, custom event buses, and client-side state engines.",
    projectHighlight: "IziEat Custom Localisation Engine (200+ keys)",
    metrics: "Zero-dependency client execution",
    codeSnippet: `// Custom zero-dependency event bus
const EventBus = {
  events: {},
  emit(event, data) {
    (this.events[event] || []).forEach(cb => cb(data));
  }
};`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    level: "Production Ready",
    role: "Type-Safe Contracts",
    description: "Strict compile-time type verification, custom utility types, and robust component props interfaces across Next.js.",
    projectHighlight: "Portfolio Architecture & Component Libraries",
    metrics: "100% strict type checking",
    codeSnippet: `interface ProjectCommission {
  readonly id: string;
  title: string;
  category: 'EU Startup' | 'Global Commerce';
  metrics: Record<string, string | number>;
}`,
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    level: "Core Competency",
    role: "AI/ML & Automation",
    description: "Data analysis pipelines, machine learning model foundations, neural concepts, and system scripting.",
    projectHighlight: "CSE (AI/ML) Academic & Applied Systems",
    metrics: "Data preprocessing & model pipelines",
  },
  {
    id: "cpp",
    name: "C++ (Fundamentals)",
    category: "languages",
    level: "Foundational",
    role: "Memory & Algorithms",
    description: "Core algorithms, data structures, object-oriented concepts, and computational foundations.",
    projectHighlight: "NSEC Computer Science Fundamentals",
    metrics: "Low-level computational efficiency",
  },
  {
    id: "html5-css3",
    name: "HTML5 & Modern CSS",
    category: "languages",
    level: "Architectural",
    role: "Semantic Web Structure",
    description: "Accessible ARIA markup, semantic layout architecture, modern CSS custom properties, and responsive grid systems.",
    projectHighlight: "Client Portals & Responsive Mobile Experiences",
    metrics: "WCAG accessibility & fluid responsive design",
  },

  // 2. Frontend Architecture
  {
    id: "nextjs",
    name: "Next.js 16 (App Router)",
    category: "frontend",
    level: "Architectural",
    role: "React Full-Stack Framework",
    description: "Hybrid Server/Client Component paradigms, dynamic route handlers, static generation, and edge deployment.",
    projectHighlight: "High-Performance Portfolio & Modern Web Apps",
    metrics: "Turbopack / Webpack hybrid build stability",
  },
  {
    id: "react",
    name: "React 19",
    category: "frontend",
    level: "Architectural",
    role: "Reactive UI Runtime",
    description: "Concurrent rendering, fine-grained state hooks (`useCallback`, `useRef`), and component lifecycle orchestration.",
    projectHighlight: "Interactive Component Hierarchies",
    metrics: "Zero unnecessary re-renders with memoization",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS v4",
    category: "frontend",
    level: "Architectural",
    role: "Design Token Engine",
    description: "CSS theme architecture, CSS variable hooks, dark-mode palettes, and high-performance utility compilation.",
    projectHighlight: "Custom Italian Sand & Obsidian Aesthetics",
    metrics: "Sub-10kb critical CSS footprint",
  },
  {
    id: "gsap",
    name: "GSAP 3.15 & ScrollTrigger",
    category: "frontend",
    level: "Architectural",
    role: "Kinetic Animation Engine",
    description: "Scrubbed scroll timelines, pinned viewport stages, clip-path reveals, and responsive matchMedia animations.",
    projectHighlight: "Forge Automotive Spatial Storytelling",
    metrics: "60fps buttery GPU-accelerated transforms",
  },
  {
    id: "lenis",
    name: "Lenis 1.3 Smooth Scroll",
    category: "frontend",
    level: "Production Ready",
    role: "Inertial Scroll Synchronization",
    description: "Smooth wheel and touch momentum scroll synchronized with GSAP ticker loop for unified page momentum.",
    projectHighlight: "Seamless Global Scroll Experience",
    metrics: "0.08 lerp buttery damping",
  },
  {
    id: "framer-motion",
    name: "Framer Motion",
    category: "frontend",
    level: "Production Ready",
    role: "Gestural & Modal Physics",
    description: "Curtain unmasking reveals, spring physics animations, layout transitions, and staggered kinetic typography.",
    projectHighlight: "Forge Navigation Drawer & 3D Card Physics",
    metrics: "Physical spring easing transitions",
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "frontend",
    level: "Core Competency",
    role: "Spatial 3D Canvas",
    description: "WebGL 3D scenes, camera perspective control, procedural meshes, and lighting effects for spatial depth.",
    projectHighlight: "Interactive 3D Viewport Experiences",
    metrics: "Direct WebGL rendering pipeline",
  },

  // 3. AI & Machine Learning
  {
    id: "ml-fundamentals",
    name: "Machine Learning Concepts",
    category: "aiml",
    level: "Core Competency",
    role: "Predictive Models & Theory",
    description: "Supervised and unsupervised learning, regression, classification, clustering, and model validation techniques.",
    projectHighlight: "B.Tech CSE (AI & ML) Curriculum",
    metrics: "Mathematical foundations & model evaluation",
  },
  {
    id: "neural-architectures",
    name: "Neural & Deep Learning",
    category: "aiml",
    level: "Foundational",
    role: "Modern AI Paradigms",
    description: "Artificial neural network structures, backpropagation, activation functions, and foundational LLM architectures.",
    projectHighlight: "AI/ML Specialization at NSEC",
    metrics: "Algorithmic gradient optimization",
  },

  // 4. Performance & Technical SEO
  {
    id: "page-optimization",
    name: "Page-Load Optimization",
    category: "performance",
    level: "Architectural",
    role: "Speed & Core Web Vitals",
    description: "Asset preloading, code splitting, script deferral, WebP/AVIF formats, and sub-second initial paint times.",
    projectHighlight: "IziEat European Export Platform",
    metrics: "Sub-1s LCP & 100/100 Core Web Vitals",
  },
  {
    id: "seo-infrastructure",
    name: "Technical SEO Infrastructure",
    category: "performance",
    level: "Production Ready",
    role: "Organic Crawl & Discovery",
    description: "Automated XML sitemaps, robots.txt directives, OpenGraph meta tags, and Google Search Console indexing monitoring.",
    projectHighlight: "International Client Discoverability",
    metrics: "Zero crawl errors in Search Console",
  },
  {
    id: "caching-architecture",
    name: "Caching & Cache Headers",
    category: "performance",
    level: "Production Ready",
    role: "Latency Reduction",
    description: "Browser caching policies, Cache-Control headers, stale-while-revalidate, and CDN edge optimization.",
    projectHighlight: "Global Multi-Region Response Times",
    metrics: "Repeat visits load in < 200ms",
  },

  // 5. Systems & Engineering Operations
  {
    id: "client-i18n",
    name: "Client-Side Multilingual i18n",
    category: "systems",
    level: "Architectural",
    role: "Zero-Dependency Localisation",
    description: "Custom dictionary with 200+ structured translation keys across languages without external API dependencies.",
    projectHighlight: "IziEat Agricultural Export Business",
    metrics: "200+ structured keys, 0 external API lag",
    codeSnippet: `// Client-side instant i18n switcher
const i18nDict = {
  en: { hero: 'Agricultural Export Excellence' },
  fr: { hero: "Excellence de l'exportation agricole" }
};
function setLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18nDict[lang][el.dataset.i18n];
  });
}`,
  },
  {
    id: "product-calculator",
    name: "Product-Load Calculator",
    category: "systems",
    level: "Production Ready",
    role: "Logistics Automation",
    description: "Custom mathematical calculator for B2B container payload weight, volume distribution, and shipping logistics.",
    projectHighlight: "IziEat Container Shipment Planner",
    metrics: "Real-time payload optimization",
  },
  {
    id: "dns-domain-ops",
    name: "DNS & Domain Operations",
    category: "systems",
    level: "Production Ready",
    role: "Cross-Border Infrastructure",
    description: "DNS record orchestration (A, CNAME, TXT, MX), domain propagation troubleshooting, and SSL/HTTPS certificate deployment.",
    projectHighlight: "India Centre & Latvian Cricket Federation",
    metrics: "Zero-downtime platform maintenance",
  },
  {
    id: "automation-scripting",
    name: "Workflow Automation",
    category: "systems",
    level: "Core Competency",
    role: "Operations Efficiency",
    description: "Google Apps Script automation, webhooks, automated form dispatch, and Git/GitHub CI/CD deployment pipelines.",
    projectHighlight: "Automated Inquiry Routing & Operations",
    metrics: "Eliminated repetitive manual workflows",
  },
];

export const ArchitecturalMatrix: React.FC = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>("all");
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECH_STACK[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const sectionRef = useRef<HTMLElement | null>(null);

  const categories: { id: TechCategory; label: string; count: number }[] = [
    { id: "all", label: "ALL CAPABILITIES", count: TECH_STACK.length },
    { id: "frontend", label: "FRONTEND ARCHITECTURE", count: TECH_STACK.filter((t) => t.category === "frontend").length },
    { id: "languages", label: "LANGUAGES", count: TECH_STACK.filter((t) => t.category === "languages").length },
    { id: "aiml", label: "AI / ML CONCEPTS", count: TECH_STACK.filter((t) => t.category === "aiml").length },
    { id: "performance", label: "PERFORMANCE & SEO", count: TECH_STACK.filter((t) => t.category === "performance").length },
    { id: "systems", label: "SYSTEMS & OPERATIONS", count: TECH_STACK.filter((t) => t.category === "systems").length },
  ];

  const filteredTech = TECH_STACK.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="monument-matrix"
      ref={sectionRef}
      className="relative w-full z-30 min-h-[100svh] py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#0B0609] text-[#F8F5EE] border-t border-[#EAD7C0]/15 select-none overflow-hidden"
    >
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#EAD7C0_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-[#FF8C38]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#10B981]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* Chapter Bar */}
        <div className="flex items-center justify-between font-sans font-bold text-[11px] sm:text-xs text-[#FF8C38] tracking-[0.24em] uppercase pb-4 border-b border-[#EAD7C0]/15">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF8C38]" />
            <span className="text-[#EAD7C0]">05 // TECHNICAL MATRIX &amp; CAPABILITIES</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 text-[10px] text-white/50 font-mono">
            <span>{TECH_STACK.length} VERIFIED STACK MODULES</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-helvetica font-normal text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#EAD7C0] tracking-tight leading-[0.9] uppercase mb-4">
              TECHNICAL MATRIX <br />
              <span className="text-[#EAD7C0]/40 hover:text-[#EAD7C0] transition-colors duration-500">
                &amp; ENGINEERING STACK.
              </span>
            </h2>
            <p className="font-serif italic font-light text-base sm:text-lg md:text-xl text-[#D8C4AE] leading-relaxed max-w-2xl">
              An interactive blueprint of languages, frontend systems, performance tools, and operational workflows deployed in production.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter technologies..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/15 focus:border-[#FF8C38] focus:outline-none text-xs text-white placeholder:text-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#FF8C38] text-black font-bold shadow-md scale-105"
                  : "bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/30"
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE BENTO STACK: GRID OF SKILLS + LIVE ARCHITECTURAL INSPECTOR    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tech Cards Grid (Left 7 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[750px] overflow-y-auto pr-1 select-none">
            <AnimatePresence>
              {filteredTech.map((tech) => {
                const isSelected = selectedTech.id === tech.id;
                return (
                  <motion.div
                    key={tech.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedTech(tech)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-[#2A0C16] border-[#FF8C38] shadow-[0_10px_30px_-10px_rgba(255,140,56,0.3)] scale-[1.02]"
                        : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div>
                      {/* Top Row: Category tag + Level */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#FF8C38]">
                          {tech.category}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            tech.level === "Architectural"
                              ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/30"
                              : tech.level === "Production Ready"
                              ? "border-amber-500/40 text-amber-300 bg-amber-950/30"
                              : "border-white/20 text-white/60 bg-white/5"
                          }`}
                        >
                          {tech.level}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-sans font-bold text-sm text-[#FFFDF8] tracking-tight">
                        {tech.name}
                      </h3>
                      <p className="font-sans text-[11px] text-[#D8C4AE]/80 mt-1 line-clamp-2 leading-relaxed">
                        {tech.description}
                      </p>
                    </div>

                    {/* Bottom Status / Selection Cue */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                      <span className="text-white/40 truncate max-w-[170px]">
                        {tech.projectHighlight}
                      </span>
                      <span
                        className={`font-bold transition-colors ${
                          isSelected ? "text-[#FF8C38]" : "text-white/30"
                        }`}
                      >
                        {isSelected ? "ACTIVE" : "INSPECT →"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Live Architectural Inspector HUD (Right 5 Columns) */}
          <div className="lg:col-span-5 sticky top-28 bg-[#1B060F]/90 border border-[#EAD7C0]/25 rounded-2xl p-6 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between gap-6">
            
            {/* Inspector Header */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#FF8C38]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white/70">
                    MODULE ARCHITECTURE INSPECTOR
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                  ● ACTIVE
                </span>
              </div>

              {/* Selected Module Title */}
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#FFFDF8] tracking-tight">
                  {selectedTech.name}
                </h3>
              </div>
              <div className="text-xs font-mono text-[#FF8C38] uppercase tracking-wider mb-4">
                {selectedTech.role}
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#D8C4AE] leading-relaxed mb-6">
                {selectedTech.description}
              </p>

              {/* Architectural Highlights Box */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-black/40 border border-white/10 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-0.5">
                    KEY IMPLEMENTATION &amp; WORK
                  </div>
                  <div className="font-sans font-bold text-xs text-[#EAD7C0] flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#FF8C38]" />
                    <span>{selectedTech.projectHighlight}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-0.5">
                    ARCHITECTURAL METRIC
                  </div>
                  <div className="font-mono text-xs text-emerald-400">
                    {selectedTech.metrics}
                  </div>
                </div>
              </div>

              {/* Optional Code Snippet / Architecture Spec */}
              {selectedTech.codeSnippet && (
                <div>
                  <div className="text-[10px] font-mono text-white/40 uppercase mb-1.5">
                    LIVE SYSTEM SIGNATURE
                  </div>
                  <pre className="p-3 rounded-lg bg-black/70 border border-white/10 font-mono text-[11px] text-[#EAD7C0]/90 overflow-x-auto leading-relaxed">
                    <code>{selectedTech.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40">
                CSE (AI/ML) · NSEC KOLKATA
              </span>
              <a
                href="#monument-exhibition"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#FF8C38] hover:text-[#EAD7C0] transition-colors"
              >
                <span>VIEW IN COMMISSIONS</span>
                <ArrowRight size={12} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
});

ArchitecturalMatrix.displayName = "ArchitecturalMatrix";
