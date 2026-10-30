"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowUp, Compass, Sparkles, ExternalLink } from "lucide-react";

interface SiteFooterProps {
  onNavigate?: (id: string) => void;
}

const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" r="2" />
  </svg>
);

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const directoryLinks = [
    { id: "monument-hero", num: "01", label: "INDEX", sub: "Terrace Perspective" },
    { id: "monument-statement", num: "02", label: "STATEMENT", sub: "Kinetic Intention" },
    { id: "monument-creed", num: "03", label: "CREED", sub: "Education & Foundations" },
    { id: "monument-exhibition", num: "04", label: "COMMISSIONS", sub: "Selected Engineering" },
    { id: "monument-matrix", num: "05", label: "BLUEPRINT", sub: "Technical Architecture" },
    { id: "monument-terminal", num: "06", label: "CONTACT", sub: "Direct Initiation" },
  ];

  const works = [
    { title: "IziEat", role: "Frontend & Digital Operations", tag: "EU Startup" },
    { title: "LCF Luxury", role: "Global Commerce Architecture", tag: "Fashion Brand" },
    { title: "India Center", role: "Socio-Tech Digital Infrastructure", tag: "National Portal" },
    { title: "Varti", role: "Fintech & Analytics Intelligence", tag: "Next-Gen SaaS" },
  ];

  return (
    <footer className="relative w-full z-40 bg-[#080608] text-[#F8F5EE] border-t border-[#EAD7C0]/15 pt-20 sm:pt-28 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 lg:px-20 overflow-hidden select-none">
      {/* Background Architectural Watermark Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#EAD7C0_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Main Footer Container */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between gap-16 lg:gap-24">
        {/* Top Split Section: Left Identity Lockup + Right Site Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: EXACT HERO TYPOGRAPHY LOCKUP ("Soham Roychoudhury")                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Metadata Pill */}
            <div className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#FF8C38] mb-5 px-3 py-1 rounded-full border border-[#FF8C38]/25 bg-white/5 backdrop-blur-md">
              <Sparkles size={11} className="text-[#FF8C38]" />
              <span>ARCHITECTURAL PORTFOLIO // 2026</span>
            </div>

            {/* Signature Font Pairing Matching Hero Section */}
            <div className="relative flex flex-col items-start select-none mb-6">
              {/* Word 1: Soham in Citadel Script */}
              <span className="font-citadel font-normal text-6xl xs:text-7xl sm:text-8xl md:text-9xl text-[#FFFDF8] leading-[0.74] relative z-20 -mb-3 sm:-mb-5 md:-mb-6 -translate-x-3 sm:-translate-x-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                Soham
              </span>
              {/* Word 2: Roychoudhury in Helvetica Compressed */}
              <span className="font-helvetica font-normal text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-[#F8F5EE] tracking-[0.025em] leading-[0.84] relative z-10 drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)]">
                Roychoudhury
              </span>
            </div>

            {/* Subtitle & Focus */}
            <p className="font-helvetica font-normal text-xs sm:text-sm text-[#D8C4AE] tracking-[0.15em] uppercase leading-relaxed max-w-md mb-8">
              Artificial Intelligence &amp; Machine Learning · Frontend Architect · Cross-Border Digital Operations
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/5 hover:bg-white hover:text-black font-sans font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
              >
                <span>Curriculum Vitae</span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href="https://www.linkedin.com/in/soham-roychoudhury-a3537a364/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/5 hover:bg-[#FF8C38] hover:border-[#FF8C38] font-sans font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
              >
                <LinkedinIcon size={13} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: ARCHITECTURAL SITE MAP                                             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-4 lg:pt-2">
            
            {/* Column 1: Directory Index */}
            <div className="flex flex-col gap-3">
              <div className="font-sans font-bold text-[10px] tracking-[0.24em] uppercase text-[#FF8C38] pb-2 border-b border-white/10">
                01 // SITEMAP
              </div>
              <ul className="flex flex-col gap-2.5 pt-1">
                {directoryLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id)}
                      className="group flex items-baseline gap-2 text-left font-sans text-xs tracking-wide text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="font-mono text-[10px] text-[#FF8C38]/70 group-hover:text-[#FF8C38]">
                        {link.num}
                      </span>
                      <span className="font-bold group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Selected Commissions */}
            <div className="flex flex-col gap-3">
              <div className="font-sans font-bold text-[10px] tracking-[0.24em] uppercase text-[#FF8C38] pb-2 border-b border-white/10">
                02 // COMMISSIONS
              </div>
              <ul className="flex flex-col gap-3 pt-1">
                {works.map((work) => (
                  <li key={work.title} className="flex flex-col">
                    <button
                      onClick={() => handleLinkClick("monument-exhibition")}
                      className="group text-left cursor-pointer"
                    >
                      <div className="font-sans font-bold text-xs text-white/80 group-hover:text-[#FF8C38] transition-colors flex items-center justify-between">
                        <span>{work.title}</span>
                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="font-sans text-[10px] text-white/40 tracking-tight">
                        {work.role}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Protocols & Direct Inquiry */}
            <div className="flex flex-col gap-3">
              <div className="font-sans font-bold text-[10px] tracking-[0.24em] uppercase text-[#FF8C38] pb-2 border-b border-white/10">
                03 // TRANSMISSION
              </div>
              <div className="flex flex-col gap-3 pt-1 text-xs">
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mb-0.5">DIRECT EMAIL</div>
                  <a
                    href="mailto:roychoudhurysoham006@gmail.com"
                    className="font-sans font-bold text-white/80 hover:text-[#FF8C38] transition-colors break-all"
                  >
                    roychoudhurysoham006@gmail.com
                  </a>
                </div>

                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mb-0.5">TELEPHONY / WHATSAPP</div>
                  <a
                    href="tel:+918240708402"
                    className="font-sans font-bold text-white/80 hover:text-emerald-400 transition-colors"
                  >
                    +91 8240708402
                  </a>
                </div>

                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mb-0.5">LOCATION</div>
                  <div className="font-mono text-[11px] text-white/60">
                    KOLKATA, INDIA (UTC+05:30)
                  </div>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AVAILABLE FOR 2026 ROLES</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COLOPHON BAR (Live Telemetry, Coordinates & Back to Top)            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 font-mono text-[10px] sm:text-[11px] text-white/50">
          {/* Copyright */}
          <div>
            © 2026 SOHAM ROYCHOUDHURY · ARCHIVE ALL RIGHTS RESERVED
          </div>

          {/* Coordinates & Live Time */}
          <div className="flex items-center gap-2 text-white/70">
            <Compass size={12} className="text-[#FF8C38]" />
            <span>22.5726° N · 88.3639° E</span>
            <span>•</span>
            <span className="text-white font-bold">{time || "00:00:00"} IST</span>
          </div>

          {/* Return to Top Button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-[#FF8C38] text-white hover:text-[#FF8C38] transition-colors cursor-pointer"
          >
            <span>RETURN TO TOP</span>
            <ArrowUp size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
};

