"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { DoodleCharacter } from "./DoodleCharacter";
import { Mail, Phone, MapPin, Copy, Check, Send, Sparkles, Clock, ArrowUpRight } from "lucide-react";

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#F97316", "#EA580C", "#202124", "#FFFFFF"],
      });
    } catch {}

    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honest mailto fallback with pre-filled content
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name || "Visitor"}`);
    const body = encodeURIComponent(
      `Hello Soham,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative py-28 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Tag */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-xs font-mono text-[#6B6B6B] shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span>SCENE 07 / JOURNEY DESTINATION</span>
          </div>

          <h2 className="font-sans font-bold text-4xl sm:text-6xl text-[#202124] tracking-tight mb-4">
            Have something worth building?
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            I&apos;m interested in opportunities where thoughtful engineering, useful interfaces, and real-world problem-solving come together.
          </p>
        </div>

        {/* Main Grid: Welcoming Character + Verified Contact Dossier + Interactive Mail Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Character at Finish Line (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center p-8 bg-[#FFFFFF] rounded-3xl border border-[#E9E7E3] shadow-xs">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#E9E7E3] mb-4 font-mono text-xs text-[#6B6B6B]">
              <span>DESTINATION REACHED</span>
              <span className="text-[#F97316] font-bold">100% COMPLETE</span>
            </div>

            <DoodleCharacter
              pose="contact-welcoming"
              size={290}
              caption="Soham • Ready for collaboration"
            />

            <div className="w-full mt-6 pt-4 border-t border-[#E9E7E3] text-center font-mono text-xs text-[#6B6B6B]">
              <span className="text-[#202124] font-semibold">Current Status:</span>{" "}
              Available for Software Engineering & Web Development Internships
            </div>
          </div>

          {/* Right Column: Verified Cards & Direct Email Dispatcher (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Direct Verified Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E9E7E3] hover:border-[#F97316] transition-all shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-1 font-mono text-[11px] text-[#6B6B6B] hover:text-[#202124] bg-[#FAF9F6] px-2.5 py-1 rounded-md border border-[#E9E7E3]"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedEmail ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] uppercase text-[#6B6B6B] mb-1">Direct Email</div>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="font-sans font-bold text-sm sm:text-base text-[#202124] hover:text-[#F97316] transition-colors break-all"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>

              {/* Phone Card */}
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E9E7E3] hover:border-[#F97316] transition-all shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <button
                    onClick={copyPhone}
                    className="flex items-center gap-1 font-mono text-[11px] text-[#6B6B6B] hover:text-[#202124] bg-[#FAF9F6] px-2.5 py-1 rounded-md border border-[#E9E7E3]"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedPhone ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="font-mono text-[10px] uppercase text-[#6B6B6B] mb-1">Telephone & WhatsApp</div>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="font-sans font-bold text-sm sm:text-base text-[#202124] hover:text-[#F97316] transition-colors"
                >
                  {PERSONAL_INFO.phoneFormatted}
                </a>
              </div>

              {/* Location Card */}
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E9E7E3] shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-3">
                  <MapPin size={16} />
                </div>
                <div className="font-mono text-[10px] uppercase text-[#6B6B6B] mb-1">Base of Operations</div>
                <div className="font-sans font-bold text-sm sm:text-base text-[#202124]">
                  {PERSONAL_INFO.location}
                </div>
              </div>

              {/* Timezone Card */}
              <div className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#E9E7E3] shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-3">
                  <Clock size={16} />
                </div>
                <div className="font-mono text-[10px] uppercase text-[#6B6B6B] mb-1">Standard Timezone</div>
                <div className="font-sans font-bold text-sm sm:text-base text-[#202124]">
                  {PERSONAL_INFO.timezone}
                </div>
              </div>
            </div>

            {/* Transparent Email Composer Form */}
            <div className="p-6 sm:p-8 bg-[#FFFFFF] rounded-3xl border border-[#E9E7E3] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E7E3] mb-6">
                <div>
                  <h3 className="font-sans font-bold text-lg text-[#202124]">
                    Direct Message Dispatcher
                  </h3>
                  <p className="font-sans text-xs text-[#6B6B6B]">
                    Opens directly in your default email client with your message pre-loaded.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[#F97316] bg-[#F97316]/10 px-2.5 py-1 rounded-md">
                  Transparent Fallback
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#202124] font-medium mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Hiring Manager"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3] text-sm text-[#202124] focus:outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#202124] font-medium mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3] text-sm text-[#202124] focus:outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#202124] font-medium mb-1.5">
                    Your Message / Role Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We would love to discuss an internship opportunity or practical web project..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E9E7E3] text-sm text-[#202124] focus:outline-none focus:border-[#F97316] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="font-mono text-[11px] text-[#6B6B6B]">
                    Recipient: <span className="text-[#202124] font-semibold">{PERSONAL_INFO.email}</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#202124] hover:bg-[#F97316] text-white font-mono text-xs font-semibold rounded-full shadow-sm transition-all"
                  >
                    <span>Launch Email Client</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
