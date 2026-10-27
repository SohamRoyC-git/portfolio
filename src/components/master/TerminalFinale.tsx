"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";

export const TerminalFinale: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "roychoudhurysoham006@gmail.com";
  const phone = "+91 8240708402";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.8 },
      colors: ["#10B981", "#00FF87", "#34D399", "#059669", "#0F172A"],
    });

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer
      id="monument-terminal"
      className="relative min-h-[85vh] py-32 px-6 sm:px-12 z-10 max-w-7xl mx-auto flex flex-col justify-between"
    >
      <div>
        {/* Chapter Marker */}
        <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase mb-12 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-[#10B981]" />
          <span>04 / CONTACT</span>
        </div>

        {/* Headline */}
        <h2 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vw] text-[#0F172A] uppercase tracking-tight leading-[0.92] mb-6 max-w-4xl">
          Let&apos;s build <br />
          <span className="bg-gradient-to-r from-[#0F172A] via-slate-700 to-slate-500 bg-clip-text text-transparent">
            something real.
          </span>
        </h2>

        {/* Narrative */}
        <p className="font-serif italic font-light text-xl sm:text-2xl text-slate-700 tracking-normal max-w-xl leading-relaxed mb-16">
          Open to software engineering and frontend development internships.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {/* Card 1: Copy Email */}
          <div
            onClick={handleCopyEmail}
            className="p-8 rounded-3xl bg-white/80 border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-sm flex flex-col justify-between cursor-pointer group"
            data-cursor="pointer"
            data-cursor-text={copied ? "COPIED!" : "COPY"}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">EMAIL</span>
                <Mail size={18} className="text-[#10B981]" />
              </div>
              <div className="font-sans font-black text-base sm:text-lg text-[#0F172A] break-all mb-4 group-hover:text-[#10B981] transition-colors">
                {email}
              </div>
            </div>
            <div className="flex items-center gap-2 font-sans font-black text-xs text-slate-500 uppercase tracking-wider">
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? "COPIED TO CLIPBOARD" : "CLICK TO COPY"}</span>
            </div>
          </div>

          {/* Card 2: Phone */}
          <a
            href={`tel:${phone}`}
            className="p-8 rounded-3xl bg-white/80 border border-slate-200/80 hover:border-[#10B981]/60 transition-all duration-300 shadow-sm flex flex-col justify-between group cursor-pointer"
            data-cursor="pointer"
            data-cursor-text="CALL"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">PHONE &amp; WHATSAPP</span>
                <Phone size={18} className="text-[#10B981]" />
              </div>
              <div className="font-sans font-black text-xl sm:text-2xl text-[#0F172A] mb-4 group-hover:text-[#10B981] transition-colors">
                {phone}
              </div>
            </div>
            <div className="flex items-center gap-2 font-sans font-black text-xs text-slate-500 uppercase tracking-wider">
              <span>DIRECT VOICE</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>

          {/* Card 3: Location */}
          <div 
            className="p-8 rounded-3xl bg-white/80 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            data-cursor="pointer"
            data-cursor-text="LOCATION"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans font-black text-xs text-slate-400 uppercase tracking-widest">LOCATION</span>
                <MapPin size={18} className="text-emerald-600" />
              </div>
              <div className="font-sans font-black text-xl text-[#0F172A] mb-1">
                Kolkata, India
              </div>
              <div className="font-serif italic font-light text-sm text-slate-600">
                Netaji Subhash Engineering College (AI/ML)
              </div>
            </div>
            <div className="flex items-center gap-2 font-sans font-black text-xs text-emerald-600 pt-4 border-t border-slate-200 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>REMOTE &amp; RELOCATION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Minimal Colophon */}
      <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans font-black text-xs text-slate-400 uppercase tracking-wider">
        <div>© 2026 SOHAM ROYCHOUDHURY</div>
        <div>KOLKATA, INDIA</div>
      </div>
    </footer>
  );
};
