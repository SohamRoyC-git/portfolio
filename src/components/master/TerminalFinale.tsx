"use client";

import React, { memo, useState } from "react";
import confetti from "canvas-confetti";
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight } from "lucide-react";

export const TerminalFinale: React.FC = memo(() => {
  const [copied, setCopied] = useState(false);

  const email = "roychoudhurysoham006@gmail.com";
  const phone = "+91 8240708402";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#10B981", "#34D399", "#00FF87"],
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <footer
      id="monument-terminal"
      className="relative min-h-[100svh] pt-28 sm:pt-36 pb-20 px-4 sm:px-8 md:px-12 z-10 max-w-7xl mx-auto flex flex-col justify-between"
    >
      {/* Chapter Marker */}
      <div className="font-sans font-black text-xs text-[#10B981] tracking-widest uppercase mb-6 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-[#10B981]" />
        <span>04 / CONTACT</span>
      </div>

      {/* Main Massive Editorial Headline */}
      <div className="my-auto py-4">
        <h2 className="font-sans font-black text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#0F172A] max-md:text-white tracking-tighter leading-[0.9] uppercase mb-4 sm:mb-6">
          LET&apos;S BUILD <br />
          <span className="bg-gradient-to-r from-[#0F172A] via-slate-800 to-slate-600 max-md:from-white max-md:via-slate-200 max-md:to-emerald-300 bg-clip-text text-transparent">
            SOMETHING REAL.
          </span>
        </h2>
        <p className="font-serif italic font-light text-lg sm:text-2xl text-slate-700 max-md:text-slate-300 max-w-xl">
          Open to software engineering and frontend development internships.
        </p>
      </div>

      {/* Direct Contact Monoliths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 border-t border-slate-200/80 max-md:border-white/10">
        {/* Email Monolith */}
        <div
          onClick={handleCopyEmail}
          className="p-6 sm:p-8 rounded-3xl bg-white/75 max-md:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 max-md:border-white/10 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-black text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">EMAIL</span>
              <Mail size={18} className="text-[#10B981]" />
            </div>
            <div className="font-sans font-black text-sm xs:text-base sm:text-lg text-[#0F172A] max-md:text-white tracking-tight mb-2 break-all">
              {email}
            </div>
          </div>
          <div className="flex items-center gap-2 font-sans font-black text-xs text-slate-500 uppercase tracking-wider group-hover:text-[#10B981] transition-colors mt-4">
            {copied ? (
              <>
                <Check size={14} className="text-[#10B981]" />
                <span className="text-[#10B981]">COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>CLICK TO COPY</span>
              </>
            )}
          </div>
        </div>

        {/* Phone Monolith */}
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="p-6 sm:p-8 rounded-3xl bg-white/75 max-md:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 max-md:border-white/10 hover:border-[#10B981]/60 transition-all duration-300 shadow-xs group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-black text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">PHONE &amp; WHATSAPP</span>
              <Phone size={18} className="text-emerald-600" />
            </div>
            <div className="font-sans font-black text-lg sm:text-xl text-[#0F172A] max-md:text-white tracking-tight mb-2">
              {phone}
            </div>
          </div>
          <div className="flex items-center gap-1 font-sans font-black text-xs text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors mt-4">
            <span>DIRECT VOICE</span>
            <ArrowUpRight size={14} />
          </div>
        </a>

        {/* Location Monolith */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/75 max-md:bg-[#0B0F17]/90 backdrop-blur-xl border border-slate-200/80 max-md:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-black text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">LOCATION</span>
              <MapPin size={18} className="text-emerald-600" />
            </div>
            <div className="font-sans font-black text-lg sm:text-xl text-[#0F172A] max-md:text-white tracking-tight mb-2">
              Kolkata, India
            </div>
          </div>
          <div className="font-sans font-black text-xs text-slate-400 uppercase tracking-wider mt-4">
            TIMEZONE: IST (UTC+05:30)
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="pt-8 sm:pt-12 mt-6 sm:mt-12 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="font-sans font-black text-[10px] uppercase tracking-widest">
          SOHAM ROYCHOUDHURY · 2026 ARCHIVE
        </div>
        <div className="font-serif italic font-light text-slate-500 text-center sm:text-right">
          Designed with kinetic intention.
        </div>
      </div>
    </footer>
  );
});

TerminalFinale.displayName = "TerminalFinale";
