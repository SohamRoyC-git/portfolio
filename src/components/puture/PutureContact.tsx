"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight } from "lucide-react";

export const PutureContact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "roychoudhurysoham006@gmail.com";
  const phone = "+91 8240708402";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#F97316", "#EA580C", "#FFFFFF", "#FBBF24"],
    });

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="chapter-contact" className="relative min-h-[85vh] py-28 px-6 lg:px-16 z-10 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Chapter Marker */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-slate-300">05 / COMMS TERMINAL</span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-xs text-emerald-400">OPEN TO ROLES & INTERNSHIPS</span>
        </div>

        {/* Big Puture-Style Call to Action */}
        <h2 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
          Let’s build something <br />
          <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-white bg-clip-text text-transparent">
            extraordinary together.
          </span>
        </h2>

        <p className="font-sans text-lg text-slate-400 max-w-2xl font-light mb-12">
          Currently seeking Software Engineering & Frontend Developer internships. Ready to contribute across international scale, modern web architectures, and intelligent systems.
        </p>

        {/* Contact Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {/* Direct Email Card */}
          <div className="p-6 rounded-2xl bg-[#12141A]/90 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between group hover:border-[#F97316]/60 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-3">
                <Mail size={18} />
              </div>
              <div className="font-mono text-xs text-slate-400 mb-1">DIRECT INQUIRIES</div>
              <div className="font-mono text-sm font-bold text-white break-all mb-4">
                {email}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Address"}</span>
              </button>
              <a
                href={`mailto:${email}`}
                className="p-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white transition-all cursor-pointer"
                title="Send direct email"
              >
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Telephone Card */}
          <div className="p-6 rounded-2xl bg-[#12141A]/90 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between group hover:border-sky-500/60 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                <Phone size={18} />
              </div>
              <div className="font-mono text-xs text-slate-400 mb-1">PHONE & WHATSAPP</div>
              <div className="font-mono text-sm font-bold text-white mb-4">
                {phone}
              </div>
            </div>
            <a
              href={`tel:${phone}`}
              className="w-fit px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center gap-2 transition-all"
            >
              <span>Call Direct</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Location & Academic Base */}
          <div className="p-6 rounded-2xl bg-[#12141A]/90 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between group hover:border-emerald-500/60 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <MapPin size={18} />
              </div>
              <div className="font-mono text-xs text-slate-400 mb-1">BASE & EDUCATION</div>
              <div className="font-sans text-sm font-bold text-white mb-1">
                Kolkata, West Bengal, India
              </div>
              <div className="font-mono text-xs text-slate-400">
                Netaji Subhash Engineering College (AI/ML)
              </div>
            </div>
            <div className="font-mono text-xs text-emerald-400 flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Globally (Remote / Relocation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Colophon */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
        <div>
          © 2026 SOHAM ROYCHOUDHURY. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#F97316]">NEXT.JS 16 • REACT 19 • GSAP 3</span>
        </div>
      </div>
    </footer>
  );
};
