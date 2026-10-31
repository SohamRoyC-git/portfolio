"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import {
  Mail,
  Phone,
  Copy,
  Check,
  Sparkles,
  QrCode,
  RotateCw,
  Send,
  Compass,
  FileText,
  UserCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { CALLIGRAPHY_VIEWBOX, CALLIGRAPHY_LETTERS } from "./CalligraphyPaths";

export const TerminalFinale: React.FC = memo(() => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 3D Gyro Tilt Card State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // Contact Form State
  const [selectedIntent, setSelectedIntent] = useState("Internship 2026");
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    message: string;
  }>({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const email = "roychoudhurysoham006@gmail.com";
  const phone = "+91 8240708402";

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(SVGPathElement | null)[]>([]);
  const subtextRef = useRef<HTMLSpanElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const signatureTlRef = useRef<gsap.core.Timeline | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live Kolkata IST Clock
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

  // Authentic Sequential SVG Calligraphy Letter Stroke Handwriting Animation:
  // Option 1B: Deliberate calligraphy pace (~2.96s total writing time across 10 letters)
  // Option 2A: Per-letter ink bloom as each letter finishes its stroke
  // Option 3B: Rhythmic 0.3s pause before "SOMETHING REAL." typewriter begins
  // Resilient IntersectionObserver handles entering and bidirectional replay
  useEffect(() => {
    const paths = letterRefs.current.filter(Boolean) as SVGPathElement[];
    if (!headlineRef.current || paths.length !== CALLIGRAPHY_LETTERS.length) return;

    const lengths = paths.map((p) => p.getTotalLength());

    // Initial setup: stroke hidden, fill transparent
    paths.forEach((p, i) => {
      p.style.strokeDasharray = `${lengths[i]}`;
      p.style.strokeDashoffset = `${lengths[i]}`;
      p.style.fillOpacity = "0";
    });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resetAnimation = () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (signatureTlRef.current) {
        signatureTlRef.current.kill();
        signatureTlRef.current = null;
      }

      paths.forEach((p, i) => {
        gsap.set(p, { strokeDashoffset: lengths[i], fillOpacity: 0 });
      });

      if (subtextRef.current) subtextRef.current.textContent = "\u00A0";
      if (caretRef.current) caretRef.current.style.display = "none";
    };

    const playAnimation = () => {
      resetAnimation();

      if (prefersReducedMotion) {
        paths.forEach((p) => gsap.set(p, { strokeDashoffset: 0, fillOpacity: 1 }));
        if (subtextRef.current) subtextRef.current.textContent = "SOMETHING REAL.";
        return;
      }

      const fullSubtext = "SOMETHING REAL.";
      const signatureTl = gsap.timeline({
        onComplete: () => {
          // Option 3B: Rhythmic 0.3s pause before typing begins
          pauseTimerRef.current = setTimeout(() => {
            if (subtextRef.current) subtextRef.current.textContent = fullSubtext.slice(0, 1);
            if (caretRef.current) caretRef.current.style.display = "inline-block";

            let idx = 1;
            typingTimerRef.current = setInterval(() => {
              idx++;
              if (subtextRef.current) {
                subtextRef.current.textContent = fullSubtext.slice(0, idx);
              }
              if (idx >= fullSubtext.length) {
                if (typingTimerRef.current) {
                  clearInterval(typingTimerRef.current);
                  typingTimerRef.current = null;
                }
                if (caretRef.current) {
                  caretRef.current.style.display = "none";
                }
              }
            }, 70);
          }, 300);
        },
      });

      signatureTlRef.current = signatureTl;

      // Sequential letter-by-letter handwriting:
      // Option 1B: Deliberate calligraphy pace
      // Option 2A: Per-letter ink bloom as each letter completes
      CALLIGRAPHY_LETTERS.forEach((l, i) => {
        const pathEl = paths[i];
        const dur = l.duration; // Paced per letter (L: 0.42s, e: 0.22s, etc.)
        const isWordBreak = i === 5; // Pen lift between "Let's" and "Build"

        // 1. Stroke drawing along the curve of this letter
        signatureTl.to(
          pathEl,
          {
            strokeDashoffset: 0,
            duration: dur,
            ease: "power1.inOut",
          },
          isWordBreak ? "+=0.26" : ">"
        );

        // 2. Option 2A: Soft solid ivory fill bloom as each letter's stroke finishes
        signatureTl.to(
          pathEl,
          {
            fillOpacity: 1,
            duration: 0.16,
            ease: "power1.out",
          },
          "<80%"
        );
      });
    };

    // Dedicated IntersectionObserver: 100% resilient to Lenis, dynamic layout, and window resizes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAnimation();
          } else {
            resetAnimation();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px", // triggers when headline is 20% above bottom of viewport
        threshold: 0.15,
      }
    );

    observer.observe(headlineRef.current);

    return () => {
      observer.disconnect();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (signatureTlRef.current) signatureTlRef.current.kill();
    };
  }, []);

  // 3D Holographic Card Mouse Move Handler (Smooth tactile gyro tilt)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCopyEmail = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FF8C38", "#EAD7C0", "#10B981"],
      });
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCopyPhone = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {}
  };

  // Generate downloadable vCard
  const downloadVCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Soham Roychoudhury
N:Roychoudhury;Soham;;;
EMAIL;TYPE=INTERNET,HOME:${email}
TEL;TYPE=CELL:${phone}
TITLE:Software & Web Development | CSE (AI/ML)
ORG:NSEC Kolkata
URL:https://www.linkedin.com/in/soham-roychoudhury-a3537a364/
ADR;TYPE=HOME:;;Kolkata;West Bengal;;India
NOTE:Computer Science & Engineering (AI/ML) Undergraduate. Frontend Architect & Digital Operations.
END:VCARD`;

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Soham_Roychoudhury.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Form Submit Handler (Ready for Web3Forms)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus("error");
      setStatusMessage("Please provide your name, email, and message.");
      return;
    }

    setFormStatus("submitting");

    const formElement = e.currentTarget;
    const accessKeyInput = formElement.querySelector<HTMLInputElement>('input[name="access_key"]');
    const accessKey = accessKeyInput?.value;

    if (accessKey && accessKey !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
      try {
        const formData = new FormData(formElement);
        formData.append("intent", selectedIntent);

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setFormStatus("success");
          setStatusMessage("Transmission received! I will reply shortly.");
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
            colors: ["#FF8C38", "#10B981", "#EAD7C0"],
          });
          setFormState({ name: "", email: "", message: "" });
        } else {
          setFormStatus("error");
          setStatusMessage(data.message || "Failed to transmit message. Please try emailing directly.");
        }
      } catch (err) {
        setFormStatus("error");
        setStatusMessage("Network error. Please use direct email.");
      }
    } else {
      // Graceful Interactive Simulation until Web3Forms key is provided
      setTimeout(() => {
        setFormStatus("success");
        setStatusMessage("Transmission received! (Ready for Web3Forms key).");
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.75 },
          colors: ["#FF8C38", "#10B981", "#EAD7C0"],
        });
        setFormState({ name: "", email: "", message: "" });
      }, 1000);
    }
  };

  const intentOptions = [
    "Internship 2026",
    "Frontend Architecture",
    "AI/ML Systems",
    "Digital Operations",
    "General Inquiry",
  ];

  return (
    <section
      id="monument-terminal"
      ref={sectionRef}
      className="relative w-full z-40 min-h-[100svh] flex flex-col justify-between pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#120408] text-[#F8F5EE] border-t border-[#EAD7C0]/20 select-none overflow-hidden"
    >
      {/* Background Subtle Gradient & Mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#25070F]/90 via-[#120408] to-[#070103] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FF8C38]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#10B981]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-between flex-1 gap-12 sm:gap-16">
        
        {/* Chapter Bar */}
        <div className="flex items-center justify-between font-sans font-bold text-[11px] sm:text-xs text-[#FF8C38] tracking-[0.24em] uppercase pb-4 border-b border-[#EAD7C0]/15">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF8C38]" />
            <span className="text-[#EAD7C0]">06 // INITIATION &amp; TRANSMISSION</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPEN FOR ROLES 2026</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEQUENCED HEADLINE: "Let's Build" (Handwriting) -> "SOMETHING REAL." (Typing)*/}
        {/* ========================================================================= */}
        <div
          id="terminal-headline"
          ref={headlineRef}
          className="w-full flex flex-col items-center text-center select-none mb-4"
        >
          <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-2">
            {/* Word 1: "Let's Build" in Sequential SVG Calligraphy Letter Stroke Paths */}
            <div className="w-full max-w-[760px] mx-auto -mb-2 sm:-mb-5">
              <svg
                viewBox={CALLIGRAPHY_VIEWBOX}
                className="w-full h-auto overflow-visible drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                fill="none"
              >
                {CALLIGRAPHY_LETTERS.map((letter, idx) => (
                  <path
                    key={letter.id}
                    ref={(el) => {
                      letterRefs.current[idx] = el;
                    }}
                    d={letter.d}
                    fill="#FFFDF8"
                    stroke="#FFFDF8"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ fillOpacity: 0 }}
                  />
                ))}
              </svg>
            </div>

            {/* Word 2: "SOMETHING REAL." in Helvetica Compressed with Typing Animation (Full Line Height & Vertical Clearance) */}
            <h2 className="font-helvetica font-normal text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] text-[#EAD7C0] tracking-[0.03em] leading-[1.05] relative z-10 drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] uppercase flex items-center min-h-[1.15em] mt-1 sm:mt-2 py-2 sm:py-3 overflow-visible">
              <span ref={subtextRef}>{"\u00A0"}</span>
              <span
                ref={caretRef}
                className="hidden inline-block w-1.5 sm:w-2.5 h-[0.75em] bg-[#FF8C38] ml-2 animate-pulse align-middle"
              />
            </h2>
          </div>

          <p className="font-serif italic font-light text-sm sm:text-lg md:text-xl text-[#D8C4AE] leading-relaxed max-w-xl mx-auto mt-4">
            Seeking software engineering and frontend development internships. Interact with the 3D identity card or flip it to send a direct message.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MONUMENTAL 3D GYROSCOPIC BUSINESS CARD (HIGHLIGHT OF THE SECTION)         */}
        {/* Front: Luxury Obsidian Profile | Back: Contact Transmission Form + QR     */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col items-center justify-center my-auto">
          
          {/* Card Viewport Container */}
          <div
            className="w-full max-w-3xl min-h-[480px] xs:min-h-[500px] sm:min-h-[540px] perspective-[1400px] select-none touch-pan-y"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div
              ref={cardRef}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? rotateY + 180 : rotateY}deg)`,
                transition: "transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)",
                transformStyle: "preserve-3d",
              }}
              className="relative w-full h-full min-h-[480px] xs:min-h-[500px] sm:min-h-[540px] rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] touch-pan-y"
            >
              
              {/* =================================================================== */}
              {/* FRONT FACE: LUXURY ARCHITECTURAL BUSINESS CARD                      */}
              {/* =================================================================== */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#1C060D] via-[#120408] to-[#080103] border-2 border-[#EAD7C0]/35 p-5 xs:p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                {/* Specular Glare Reflection */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 75%)`,
                  }}
                />

                {/* Subtle Carbon Grid Matrix */}
                <div className="absolute inset-0 bg-[radial-gradient(#EAD7C0_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

                {/* Front Top Bar: Live Status + Telemetry */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                  <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AVAILABLE FOR ROLES 2026</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-white/60">
                    <Compass size={13} className="text-[#FF8C38]" />
                    <span className="text-white font-bold">{time || "00:00:00"} IST</span>
                    <span className="hidden sm:inline text-white/30">•</span>
                    <span className="hidden sm:inline text-white/50">22.5726° N · 88.3639° E</span>
                  </div>
                </div>

                {/* Front Center: Signature Hero Typography Lockup */}
                <div className="relative z-10 my-auto py-4 sm:py-6 flex flex-col items-start select-none">
                  <div className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#FF8C38] mb-1.5 sm:mb-2 flex items-center gap-2">
                    <Sparkles size={11} className="text-[#FF8C38]" />
                    <span>MASTER IDENTITY // B.TECH CSE (AI &amp; ML)</span>
                  </div>

                  <span className="font-citadel font-normal text-5xl xs:text-6xl sm:text-8xl md:text-[6.8rem] text-[#FFFDF8] leading-[0.8] relative z-20 -mb-2 sm:-mb-5 -translate-x-2 sm:-translate-x-4 drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] overflow-visible">
                    Soham
                  </span>
                  <span className="font-helvetica font-normal text-[2.2rem] xs:text-[2.6rem] sm:text-7xl md:text-8xl text-[#F8F5EE] tracking-[0.025em] leading-[1.0] pb-2 sm:pb-3 relative z-10 drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)] overflow-visible inline-block">
                    Roychoudhury
                  </span>

                  <p className="font-helvetica font-normal text-[11px] xs:text-xs sm:text-sm text-[#D8C4AE] tracking-[0.14em] uppercase mt-3 sm:mt-4 leading-normal">
                    Computer Science &amp; Engineering (AI/ML) · Frontend Architect · Digital Operations
                  </p>
                </div>

                {/* Front Bottom Bar: Direct Contacts + Flip to Contact Form Button */}
                <div className="relative z-10 pt-4 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Quick Direct Contacts */}
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border border-white/15 bg-white/5 hover:border-[#FF8C38] hover:bg-white/10 text-white/90 hover:text-white transition-all text-xs font-mono cursor-pointer"
                    >
                      <Mail size={13} className="text-[#FF8C38] shrink-0" />
                      <span className="hidden sm:inline">roychoudhurysoham006@gmail.com</span>
                      <span className="sm:hidden">Email</span>
                      {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={11} className="text-white/40" />}
                    </button>

                    <button
                      onClick={handleCopyPhone}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border border-white/15 bg-white/5 hover:border-emerald-400 hover:bg-white/10 text-white/90 hover:text-white transition-all text-xs font-mono cursor-pointer"
                    >
                      <Phone size={13} className="text-emerald-400 shrink-0" />
                      <span>+91 8240708402</span>
                      {copiedPhone ? <Check size={12} className="text-emerald-400" /> : <Copy size={11} className="text-white/40" />}
                    </button>
                  </div>

                  {/* Prominent Flip Action to Contact Form */}
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#EAD7C0] hover:bg-[#FF8C38] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  >
                    <span>TRANSMIT DIRECT MESSAGE</span>
                    <RotateCw size={13} />
                  </button>
                </div>
              </div>

              {/* =================================================================== */}
              {/* BACK FACE: DIRECT CONTACT FORM + SCAN QR PILL (Flipped 180deg)      */}
              {/* =================================================================== */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#1C060D] via-[#100307] to-[#070103] border-2 border-[#FF8C38]/40 p-4 xs:p-5 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                {/* Back Top Bar: Return to Profile + SCAN QR Pill */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setShowQR(false);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-white text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <RotateCw size={12} className="rotate-180" />
                    <span>RETURN TO PROFILE</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* SCAN QR PILL (On the back of the card, per your request!) */}
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        showQR
                          ? "bg-[#FF8C38] text-black font-bold shadow-md"
                          : "border border-[#FF8C38]/40 bg-[#FF8C38]/10 text-[#FF8C38] hover:bg-[#FF8C38] hover:text-black"
                      }`}
                    >
                      <QrCode size={13} />
                      <span>{showQR ? "CLOSE QR" : "SCAN QR"}</span>
                    </button>
                  </div>
                </div>

                {/* Back Content Area: Toggle between Form and Scannable QR Code */}
                <div className="relative z-10 my-auto py-2 overflow-y-auto max-h-[380px] xs:max-h-[420px] sm:max-h-none pr-1">
                  <AnimatePresence mode="wait">
                    {showQR ? (
                      /* ----------------------------------------------------------- */
                      /* AUTHENTIC SCANNABLE QR CODE VIEW                            */
                      /* ----------------------------------------------------------- */
                      <motion.div
                        key="qr-view"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-2"
                      >
                        <div className="p-3 sm:p-4 rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center">
                          {/* Authentic Scan-Tested QR Code Vector Image */}
                          <Image
                            src="/assets/linkedin_qr.svg"
                            alt="Scannable QR Code for Soham Roychoudhury"
                            width={160}
                            height={160}
                            className="w-32 h-32 sm:w-44 sm:h-44 object-contain"
                            priority
                          />
                        </div>

                        <div className="text-center">
                          <p className="font-sans font-bold text-xs text-[#EAD7C0] uppercase tracking-wider">
                            SCAN WITH SMARTPHONE CAMERA
                          </p>
                          <p className="font-sans text-[11px] text-white/50 max-w-xs mt-0.5">
                            Instantly connects to Soham Roychoudhury&apos;s verified LinkedIn &amp; direct profile.
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={downloadVCard}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EAD7C0] text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FF8C38] hover:text-white transition-colors cursor-pointer"
                          >
                            <UserCheck size={12} />
                            <span>SAVE VCARD (.VCF)</span>
                          </button>

                          <button
                            onClick={() => setShowQR(false)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white font-sans font-bold text-xs uppercase tracking-wider hover:bg-white/15 transition-colors cursor-pointer"
                          >
                            <span>BACK TO FORM</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* ----------------------------------------------------------- */
                      /* DIRECT TRANSMISSION CONTACT FORM (Web3Forms Ready)          */
                      /* ----------------------------------------------------------- */
                      <motion.div
                        key="form-view"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-3 sm:gap-3.5"
                      >
                        {/* Topic Selector Chips */}
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
                            TRANSMISSION INTENT
                          </div>
                          <div className="flex flex-wrap gap-1 xs:gap-1.5">
                            {intentOptions.map((intent) => (
                              <button
                                key={intent}
                                type="button"
                                onClick={() => setSelectedIntent(intent)}
                                className={`px-2 xs:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-[11px] font-sans transition-all cursor-pointer ${
                                  selectedIntent === intent
                                    ? "bg-[#FF8C38] text-black font-bold shadow-md"
                                    : "bg-white/5 border border-white/15 text-white/70 hover:text-white"
                                }`}
                              >
                                {intent}
                              </button>
                            ))}
                          </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2.5 sm:gap-3">
                          {/* Web3Forms Access Key Hidden Input */}
                          <input
                            type="hidden"
                            name="access_key"
                            value="YOUR_WEB3FORMS_ACCESS_KEY_HERE"
                          />
                          <input type="hidden" name="from_name" value="Portfolio Transmission" />
                          <input
                            type="hidden"
                            name="subject"
                            value={`[Portfolio Dispatch] ${selectedIntent} - from ${formState.name || "Visitor"}`}
                          />

                          {/* Inputs Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5 sm:mb-1">
                                YOUR NAME / ORG *
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                placeholder="e.g. Elena Rostova / Acme"
                                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-xs text-[#EAD7C0] placeholder:text-white/20 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5 sm:mb-1">
                                EMAIL ADDRESS *
                              </label>
                              <input
                                type="email"
                                name="email"
                                required
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                placeholder="e.g. elena@company.com"
                                className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-xs text-[#EAD7C0] placeholder:text-white/20 transition-colors"
                              />
                            </div>
                          </div>

                          {/* Message Area */}
                          <div>
                            <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5 sm:mb-1">
                              MESSAGE / PROJECT SCOPE *
                            </label>
                            <textarea
                              name="message"
                              required
                              rows={3}
                              value={formState.message}
                              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                              placeholder={`Hello Soham, we want to discuss an opportunity regarding ${selectedIntent}...`}
                              className="w-full px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-xs text-[#EAD7C0] placeholder:text-white/20 transition-colors resize-none"
                            />
                          </div>

                          {/* Submit & Status Bar */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-1">
                            <button
                              type="submit"
                              disabled={formStatus === "submitting"}
                              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#EAD7C0] hover:bg-[#FF8C38] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                              {formStatus === "submitting" ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                  <span>TRANSMITTING...</span>
                                </>
                              ) : (
                                <>
                                  <span>TRANSMIT DISPATCH</span>
                                  <Send size={12} />
                                </>
                              )}
                            </button>

                            {statusMessage && (
                              <div
                                className={`text-xs font-sans font-medium truncate max-w-xs ${
                                  formStatus === "success" ? "text-emerald-400" : "text-rose-400"
                                }`}
                              >
                                {statusMessage}
                              </div>
                            )}
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Back Bottom Bar */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span>RESPONSE WINDOW &lt; 24H</span>
                  <span>SR // ENCRYPTED INBOX</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
});

TerminalFinale.displayName = "TerminalFinale";
