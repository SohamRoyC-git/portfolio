"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight, ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const TerminalFinale: React.FC = memo(() => {
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = "roychoudhurysoham006@gmail.com";
  const phone = "+91 8240708402";

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const monolithsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          end: "top top",
          scrub: 0.4,
        },
      });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, ease: "power2.out" },
          0
        );
      }

      if (monolithsRef.current) {
        tl.fromTo(
          monolithsRef.current.children,
          { opacity: 0, y: 35, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: "power2.out" },
          0.1
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.85 },
        colors: ["#FF7A00", "#FFFDF9", "#10B981"],
      });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {}
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="monument-terminal"
      ref={sectionRef}
      className="relative w-full z-50 h-[100svh] min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 overflow-hidden bg-[#060709] border-t border-white/15 shadow-[0_-40px_100px_rgba(0,0,0,0.98)]"
    >
      {/* Leading Architectural Hairline Edge (Forge Automotive Style) */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent shadow-[0_0_20px_rgba(255,122,0,0.6)]" />

      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between h-full">
        {/* Chapter Marker */}
      <div className="font-sans font-bold text-[11px] sm:text-xs text-[#FF7A00] tracking-[0.2em] uppercase mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#FF7A00]" />
          <span>INITIATION &amp; CONTACT</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>OPEN FOR INTERNSHIPS 2026</span>
        </div>
      </div>

      {/* Main Massive Editorial Headline */}
      <div className="my-auto py-6">
        <h2
          ref={headlineRef}
          className="font-helvetica font-normal text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-[#FFFDF9] tracking-tight leading-[0.88] uppercase mb-6 will-change-[transform,opacity]"
        >
          LET&apos;S BUILD <br />
          <span className="text-white/40 hover:text-white transition-colors duration-500">
            SOMETHING REAL.
          </span>
        </h2>
        <p className="font-serif italic font-light text-lg sm:text-2xl text-slate-300 max-w-2xl leading-relaxed">
          Open to software engineering and frontend development internships. Crafting high-performance digital environments with physical weight.
        </p>
      </div>

      {/* Direct Contact Monoliths */}
      <div
        ref={monolithsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-10 sm:pt-14 border-t border-white/10"
      >
        {/* Email Monolith */}
        <motion.div
          whileHover={{ y: -4, borderColor: "rgba(255, 122, 0, 0.4)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={handleCopyEmail}
          className="p-6 sm:p-8 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] cursor-pointer group flex flex-col justify-between transition-colors duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                DIRECT INQUIRY
              </span>
              <Mail size={16} className="text-[#FF7A00]" />
            </div>
            <div className="font-sans font-bold text-base sm:text-lg text-[#FFFDF9] tracking-tight mb-2 break-all">
              {email}
            </div>
          </div>
          <div className="flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-wider text-slate-400 group-hover:text-[#FF7A00] transition-colors mt-6">
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>CLICK TO COPY ADDRESS</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Phone & WhatsApp Monolith */}
        <motion.div
          whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.4)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 sm:p-8 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-colors duration-300"
        >
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                TELEPHONY &amp; WHATSAPP
              </span>
              <Phone size={16} className="text-emerald-400" />
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#FFFDF9] tracking-tight mb-2">
              {phone}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/8">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span>CALL</span>
              <ArrowUpRight size={13} />
            </a>
            <button
              onClick={handleCopyPhone}
              className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              {copiedPhone ? "COPIED" : "COPY"}
            </button>
          </div>
        </motion.div>

        {/* Location & Timezone Monolith */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="p-6 sm:p-8 rounded-[2rem] bg-[#0C0E14]/92 border border-white/12 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-sans font-bold text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                GEOGRAPHIC ANCHOR
              </span>
              <MapPin size={16} className="text-amber-400" />
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl text-[#FFFDF9] tracking-tight mb-2">
              Kolkata, India
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mt-6">
            LAT 22.5726° N · IST (UTC+05:30)
          </div>
        </motion.div>
      </div>

      {/* Colophon & Back to Top */}
      <div className="pt-10 sm:pt-14 mt-8 sm:mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-400">
          SOHAM ROYCHOUDHURY // ARCHIVE 2026 · ALL RIGHTS RESERVED
        </div>

        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white font-sans font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span>RETURN TO TERRACE</span>
          <ArrowUp size={12} className="text-[#FF7A00]" />
        </button>
      </div>
      </div>
    </footer>
  );
});

TerminalFinale.displayName = "TerminalFinale";
