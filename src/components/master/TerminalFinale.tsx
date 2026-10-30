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
      className="relative w-full z-50 min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 bg-[#2D0A12] border-t border-[#EAD7C0]/20"
    >
      {/* Leading Architectural Razor Hairline */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[#EAD7C0]/30" />

      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1">
        {/* Chapter Marker */}
        <div className="font-sans font-bold text-[11px] sm:text-xs text-[#FF8C38] tracking-[0.2em] uppercase mb-4 sm:mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF8C38]" />
            <span className="text-[#EAD7C0]">INITIATION &amp; CONTACT</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPEN FOR INTERNSHIPS 2026</span>
          </div>
        </div>

        {/* Main Massive Editorial Headline in Italian Light Sand */}
        <div className="my-3 md:my-auto py-2 sm:py-6">
          <h2
            ref={headlineRef}
            className="font-helvetica font-normal text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] text-[#EAD7C0] tracking-tight leading-[0.92] uppercase mb-3 sm:mb-6 will-change-[transform,opacity]"
          >
            LET&apos;S BUILD <br />
            <span className="text-[#EAD7C0]/40 hover:text-[#EAD7C0] transition-colors duration-500">
              SOMETHING REAL.
            </span>
          </h2>
          <p className="font-serif italic font-light text-sm sm:text-xl md:text-2xl text-[#D8C4AE] max-w-2xl leading-relaxed">
            Open to software engineering and frontend development internships. Crafting high-performance digital environments with physical weight.
          </p>
        </div>

        {/* Direct Contact Monoliths */}
        <div
          ref={monolithsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 pt-5 sm:pt-10 border-t border-[#EAD7C0]/20"
        >
          {/* Email Monolith */}
          <motion.div
            whileHover={{ y: -4, borderColor: "rgba(255, 140, 56, 0.5)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleCopyEmail}
            className="p-4 xs:p-5 sm:p-7 rounded-2xl bg-[#1A060B]/90 border border-[#EAD7C0]/20 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] cursor-pointer group flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-5">
                <span className="font-sans font-bold text-[10px] sm:text-xs text-[#CBB59D] uppercase tracking-widest">
                  DIRECT INQUIRY
                </span>
                <Mail size={16} className="text-[#FF8C38]" />
              </div>
              <div className="font-sans font-bold text-sm sm:text-base md:text-lg text-[#EAD7C0] tracking-tight mb-2 break-all">
                {email}
              </div>
            </div>
            <div className="flex items-center gap-2 font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D8C4AE] group-hover:text-[#FF8C38] transition-colors mt-3 sm:mt-6">
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
            className="p-4 xs:p-5 sm:p-7 rounded-2xl bg-[#1A060B]/90 border border-[#EAD7C0]/20 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-5">
                <span className="font-sans font-bold text-[10px] sm:text-xs text-[#CBB59D] uppercase tracking-widest">
                  TELEPHONY &amp; WHATSAPP
                </span>
                <Phone size={16} className="text-emerald-400" />
              </div>
              <div className="font-sans font-bold text-sm sm:text-lg md:text-xl text-[#EAD7C0] tracking-tight mb-2">
                {phone}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#EAD7C0]/15">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D8C4AE] hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span>CALL</span>
                <ArrowUpRight size={13} />
              </a>
              <button
                onClick={handleCopyPhone}
                className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#CBB59D] hover:text-[#EAD7C0] transition-colors cursor-pointer"
              >
                {copiedPhone ? "COPIED" : "COPY"}
              </button>
            </div>
          </motion.div>

          {/* Location & Timezone Monolith */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="p-4 xs:p-5 sm:p-7 rounded-2xl bg-[#1A060B]/90 border border-[#EAD7C0]/20 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-5">
                <span className="font-sans font-bold text-[10px] sm:text-xs text-[#CBB59D] uppercase tracking-widest">
                  GEOGRAPHIC ANCHOR
                </span>
                <MapPin size={16} className="text-[#FF8C38]" />
              </div>
              <div className="font-sans font-bold text-sm sm:text-lg md:text-xl text-[#EAD7C0] tracking-tight mb-2">
                Kolkata, India
              </div>
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-[#CBB59D] uppercase tracking-wider mt-3 sm:mt-6">
              LAT 22.5726° N · IST (UTC+05:30)
            </div>
          </motion.div>
        </div>

        {/* Colophon & Back to Top */}
        <div className="pt-5 sm:pt-10 mt-5 sm:mt-10 border-t border-[#EAD7C0]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#CBB59D] gap-4">
          <div className="font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-widest text-[#CBB59D] text-center sm:text-left">
            SOHAM ROYCHOUDHURY // ARCHIVE 2026 · ALL RIGHTS RESERVED
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAD7C0]/10 hover:bg-[#EAD7C0]/20 border border-[#EAD7C0]/25 text-[#EAD7C0] font-sans font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>RETURN TO TERRACE</span>
            <ArrowUp size={12} className="text-[#FF8C38]" />
          </button>
        </div>
      </div>
    </footer>
  );
});

TerminalFinale.displayName = "TerminalFinale";
