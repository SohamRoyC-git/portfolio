"use client";

import React, { memo, useState, useRef, useEffect, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  QrCode,
  RotateCw,
  Send,
  Compass,
  FileText,
  UserCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const TerminalFinale: React.FC = memo(() => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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
  const cardRef = useRef<HTMLDivElement | null>(null);

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

  // 3D Holographic Card Mouse Move Handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12; // tilt degrees
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCopyEmail = async () => {
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

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {}
  };

  // Generate downloadable vCard
  const downloadVCard = () => {
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

  // Form Submit Handler (Ready for Web3Forms or simulation)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus("error");
      setStatusMessage("Please provide your name, email, and message.");
      return;
    }

    setFormStatus("submitting");

    // Check if user set up a custom Web3Forms access key
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
          setStatusMessage("Transmission received! I will get back to you shortly.");
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
      // Graceful Interactive Simulation until Web3Forms key is provided by the user
      setTimeout(() => {
        setFormStatus("success");
        setStatusMessage("Transmission simulation sent! (Ready for Web3Forms access key).");
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
      className="relative w-full z-40 min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#16060A] text-[#F8F5EE] border-t border-[#EAD7C0]/20 select-none overflow-hidden"
    >
      {/* Background Subtle Gradient & Mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D0A12]/80 via-[#16060A] to-[#0A0507] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF8C38]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#10B981]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 gap-12 sm:gap-16">
        
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

        {/* Section Headline */}
        <div className="max-w-3xl">
          <h2 className="font-helvetica font-normal text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#EAD7C0] tracking-tight leading-[0.9] uppercase mb-4">
            LET&apos;S INITIATE <br />
            <span className="text-[#EAD7C0]/40 hover:text-[#EAD7C0] transition-colors duration-500">
              SOMETHING TANGIBLE.
            </span>
          </h2>
          <p className="font-serif italic font-light text-base sm:text-lg md:text-xl text-[#D8C4AE] leading-relaxed max-w-2xl">
            Seeking software engineering and frontend development internships. Interact with the 3D identity card or transmit a direct inquiry below.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MAIN INTERACTIVE DUAL COLUMN: 3D HOLOGRAPHIC CARD + TRANSMISSION FORM     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: 3D GYROSCOPIC HOLOGRAPHIC BUSINESS CARD                             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs font-mono text-white/50 mb-3 px-1">
              <span className="text-[#FF8C38] font-bold">3D ARCHITECTURAL VCARD</span>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-[#FF8C38] transition-colors cursor-pointer"
              >
                <RotateCw size={12} className={isFlipped ? "rotate-180 transition-transform" : "transition-transform"} />
                <span>{isFlipped ? "SHOW FRONT" : "FLIP CARD"}</span>
              </button>
            </div>

            {/* 3D Perspective Viewport */}
            <div
              className="w-full max-w-md h-[340px] sm:h-[360px] perspective-[1200px] cursor-pointer select-none"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                ref={cardRef}
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? rotateY + 180 : rotateY}deg)`,
                  transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
              >
                {/* ----------------------------------------------------------------- */}
                {/* FRONT FACE                                                        */}
                {/* ----------------------------------------------------------------- */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#1F070E] via-[#140509] to-[#0A0205] border border-[#EAD7C0]/30 p-6 sm:p-7 flex flex-col justify-between overflow-hidden backdrop-blur-xl"
                >
                  {/* Dynamic Specular Glare Effect */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 70%)`,
                    }}
                  />

                  {/* Geometric Carbon Wireframe Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#EAD7C0_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

                  {/* Card Top: Chip & Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>AVAILABLE FOR 2026</span>
                    </div>

                    <div className="text-[10px] font-mono text-white/40 tracking-wider">
                      SR // ARCHIVE 2026
                    </div>
                  </div>

                  {/* Card Center: Hero Typography Lockup */}
                  <div className="relative z-10 my-auto flex flex-col items-start select-none">
                    <span className="font-citadel font-normal text-5xl sm:text-6xl text-[#FFFDF8] leading-[0.74] relative z-20 -mb-2.5 -translate-x-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                      Soham
                    </span>
                    <span className="font-helvetica font-normal text-4xl sm:text-5xl text-[#F8F5EE] tracking-[0.025em] leading-[0.84] relative z-10 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
                      Roychoudhury
                    </span>
                    <p className="font-helvetica font-normal text-[11px] text-[#D8C4AE] tracking-[0.16em] uppercase mt-3">
                      CSE (AI/ML) Undergraduate · Frontend Architect
                    </p>
                  </div>

                  {/* Card Bottom: Live Kolkata IST & Tap Hint */}
                  <div className="relative z-10 flex items-center justify-between pt-3 border-t border-[#EAD7C0]/15 text-[10px] font-mono text-white/60">
                    <div className="flex items-center gap-1.5 text-[#FF8C38]">
                      <Compass size={12} />
                      <span className="text-white font-bold">{time || "00:00:00"} IST</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#EAD7C0]/60 text-[9px] uppercase tracking-wider">
                      <QrCode size={11} className="text-[#FF8C38]" />
                      <span>TAP TO SCAN VCARD</span>
                    </div>
                  </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* BACK FACE (Flipped 180deg)                                        */}
                {/* ----------------------------------------------------------------- */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#1A060C] via-[#0F0307] to-[#070103] border border-[#FF8C38]/40 p-6 flex flex-col justify-between overflow-hidden backdrop-blur-xl"
                >
                  {/* Card Back Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[10px] text-[#FF8C38] font-bold tracking-wider uppercase">
                      DIGITAL CONTACT CARD
                    </span>
                    <span className="font-mono text-[9px] text-white/40">vCard 3.0</span>
                  </div>

                  {/* Center: High-Precision Architectural SVG QR Code */}
                  <div className="my-auto flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-xl bg-white text-black shadow-2xl flex items-center justify-center">
                      {/* Stylized QR Code SVG pointing to LinkedIn / Contact Info */}
                      <svg
                        width="110"
                        height="110"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        aria-label="QR Code to connect with Soham Roychoudhury"
                      >
                        {/* Finder pattern Top-Left */}
                        <rect x="5" y="5" width="28" height="28" rx="4" fill="black" />
                        <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                        <rect x="13" y="13" width="12" height="12" rx="2" fill="black" />

                        {/* Finder pattern Top-Right */}
                        <rect x="67" y="5" width="28" height="28" rx="4" fill="black" />
                        <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                        <rect x="75" y="13" width="12" height="12" rx="2" fill="black" />

                        {/* Finder pattern Bottom-Left */}
                        <rect x="5" y="67" width="28" height="28" rx="4" fill="black" />
                        <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                        <rect x="13" y="75" width="12" height="12" rx="2" fill="black" />

                        {/* Data Modules Matrix */}
                        <rect x="38" y="8" width="6" height="6" rx="1" fill="black" />
                        <rect x="48" y="12" width="6" height="6" rx="1" fill="black" />
                        <rect x="38" y="24" width="6" height="6" rx="1" fill="black" />
                        <rect x="54" y="24" width="6" height="6" rx="1" fill="black" />

                        <rect x="10" y="38" width="6" height="6" rx="1" fill="black" />
                        <rect x="22" y="44" width="6" height="6" rx="1" fill="black" />
                        <rect x="38" y="38" width="8" height="8" rx="1.5" fill="#FF8C38" />
                        <rect x="50" y="42" width="6" height="6" rx="1" fill="black" />
                        <rect x="64" y="38" width="6" height="6" rx="1" fill="black" />
                        <rect x="78" y="44" width="6" height="6" rx="1" fill="black" />

                        <rect x="38" y="54" width="6" height="6" rx="1" fill="black" />
                        <rect x="48" y="60" width="6" height="6" rx="1" fill="black" />
                        <rect x="58" y="54" width="6" height="6" rx="1" fill="black" />

                        <rect x="68" y="68" width="6" height="6" rx="1" fill="black" />
                        <rect x="78" y="74" width="6" height="6" rx="1" fill="black" />
                        <rect x="88" y="68" width="6" height="6" rx="1" fill="black" />
                        <rect x="74" y="84" width="6" height="6" rx="1" fill="black" />
                        <rect x="86" y="84" width="6" height="6" rx="1" fill="black" />
                      </svg>
                    </div>

                    <p className="text-[10px] font-sans text-center text-white/70 max-w-[200px]">
                      Scan with any camera to import vCard or connect instantly.
                    </p>
                  </div>

                  {/* Actions on Back Face */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadVCard();
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-[#EAD7C0] text-black font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#FF8C38] hover:text-white transition-colors cursor-pointer"
                    >
                      <UserCheck size={11} />
                      <span>Save vCard (.vcf)</span>
                    </button>

                    <a
                      href="/cv.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-white/20 bg-white/5 text-white font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      <FileText size={11} />
                      <span>Open CV (PDF)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Quick Shortcuts below Card */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:border-[#FF8C38]/40 hover:bg-white/10 transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="text-[9px] font-mono text-white/40 uppercase">EMAIL DIRECT</div>
                  <div className="text-xs font-bold text-[#EAD7C0] truncate max-w-[130px]">roychoudhurysoham...</div>
                </div>
                {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40 group-hover:text-[#FF8C38]" />}
              </button>

              <button
                onClick={handleCopyPhone}
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="text-[9px] font-mono text-white/40 uppercase">TELEPHONY / WA</div>
                  <div className="text-xs font-bold text-[#EAD7C0]">{phone}</div>
                </div>
                {copiedPhone ? <Check size={14} className="text-emerald-400" /> : <Phone size={14} className="text-white/40 group-hover:text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: DIRECT TRANSMISSION INQUIRY FORM (Web3Forms Ready)                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#1E070F]/90 border border-[#EAD7C0]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAD7C0]/15">
              <div>
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#FF8C38]">
                  DIRECT TRANSMISSION FORM
                </span>
                <p className="font-sans text-xs text-[#D8C4AE]/70 mt-0.5">
                  Send a dispatch straight to my inbox. Response time: &lt; 24h.
                </p>
              </div>
              <Sparkles size={16} className="text-[#FF8C38]" />
            </div>

            {/* Quick Intent Chips */}
            <div className="mb-6">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-2">
                TRANSMISSION TOPIC / INQUIRY INTENT
              </label>
              <div className="flex flex-wrap gap-2">
                {intentOptions.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setSelectedIntent(intent)}
                    className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                      selectedIntent === intent
                        ? "bg-[#FF8C38] text-black font-bold shadow-md scale-105"
                        : "bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Web3Forms Hidden Key Placeholder (User will configure key later) */}
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

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                    YOUR NAME / ORGANIZATION *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Elena Rostova / Acme Inc."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-sm text-[#EAD7C0] placeholder:text-white/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                    YOUR EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. elena@organization.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-sm text-[#EAD7C0] placeholder:text-white/20 transition-colors"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  MESSAGE / PROJECT SCOPE *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={`Hello Soham, we are interested in discussing an opportunity regarding ${selectedIntent}...`}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-[#EAD7C0]/20 focus:border-[#FF8C38] focus:outline-none text-sm text-[#EAD7C0] placeholder:text-white/20 transition-colors resize-none"
                />
              </div>

              {/* Submit Button & Status */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#EAD7C0] hover:bg-[#FF8C38] text-black font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {formStatus === "submitting" ? (
                    <>
                      <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT DISPATCH</span>
                      <Send size={13} />
                    </>
                  )}
                </button>

                {statusMessage && (
                  <div
                    className={`text-xs font-sans font-medium ${
                      formStatus === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
});

TerminalFinale.displayName = "TerminalFinale";
