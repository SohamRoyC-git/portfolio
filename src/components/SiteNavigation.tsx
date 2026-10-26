"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Compass, Clock, MapPin } from "lucide-react";

interface SiteNavigationProps {
  activeSection?: string;
}

export const SiteNavigation: React.FC<SiteNavigationProps> = ({ activeSection = "hero" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Time in Kolkata
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection for compact bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Web Audio click effect
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = audioContext || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!audioContext) setAudioContext(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const navLinks = [
    { id: "hero", label: "Intro", marker: "01" },
    { id: "journey", label: "Story", marker: "02" },
    { id: "experience", label: "Experience", marker: "03" },
    { id: "work", label: "Work", marker: "04" },
    { id: "skills", label: "Toolkit", marker: "05" },
    { id: "education", label: "Education", marker: "06" },
    { id: "contact", label: "Contact", marker: "07" },
  ];

  const scrollTo = (id: string) => {
    playClick();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E9E7E3] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Monogram */}
        <button
          onClick={() => scrollTo("hero")}
          className="group flex items-center gap-3 text-left focus:outline-none"
          aria-label="Go to top"
        >
          <div className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] flex items-center justify-center font-mono font-semibold text-sm text-[#202124] shadow-sm group-hover:border-[#F97316] transition-colors">
            <span className="text-[#202124]">S</span>
            <span className="text-[#F97316]">R</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-sans font-medium text-sm text-[#202124] leading-tight flex items-center gap-1.5">
              Soham Roychoudhury
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            </div>
            <div className="font-mono text-[11px] text-[#6B6B6B] leading-none mt-0.5">
              Kolkata, IN • {currentTime || "IST"}
            </div>
          </div>
        </button>

        {/* Center: Desktop Nav Pill */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#FFFFFF]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E9E7E3] shadow-sm"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "text-[#202124] font-medium bg-[#FAF9F6] shadow-sm border border-[#E9E7E3]"
                    : "text-[#6B6B6B] hover:text-[#202124] hover:bg-[#FAF9F6]/60"
                }`}
              >
                <span className="text-[10px] text-[#F97316] mr-1 opacity-70">
                  {link.marker}.
                </span>
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Availability badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                // Prime audio context
                try {
                  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                  setAudioContext(ctx);
                } catch {}
              }
            }}
            className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-[#6B6B6B] hover:text-[#202124] flex items-center justify-center transition-colors shadow-sm"
            title={soundEnabled ? "Disable UI Sound Effects" : "Enable UI Sound Effects"}
            aria-label="Toggle sound effects"
          >
            {soundEnabled ? <Volume2 size={14} className="text-[#F97316]" /> : <VolumeX size={14} />}
          </button>

          {/* Quick CTA */}
          <button
            onClick={() => scrollTo("contact")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#202124] hover:bg-[#F97316] text-[#FFFFFF] text-xs font-mono font-medium rounded-full shadow-sm transition-colors duration-200"
          >
            <span>Get in Touch</span>
            <ArrowUpRight size={13} />
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E9E7E3] text-[#202124] flex items-center justify-center shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#FAF9F6] border-b border-[#E9E7E3] shadow-lg p-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E3] mb-3">
            <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5">
              <Compass size={13} className="text-[#F97316]" />
              Navigation Index
            </span>
            <span className="font-mono text-xs text-[#F97316] bg-[#F97316]/10 px-2.5 py-0.5 rounded-full">
              Available 2026
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="flex items-center justify-between p-3 rounded-lg bg-[#FFFFFF] border border-[#E9E7E3] text-left hover:border-[#F97316] transition-colors"
              >
                <span className="font-sans font-medium text-sm text-[#202124]">
                  {link.label}
                </span>
                <span className="font-mono text-xs text-[#6B6B6B]">
                  {link.marker}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9E7E3] flex items-center justify-between text-xs font-mono text-[#6B6B6B]">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#F97316]" />
              Kolkata, India
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {currentTime}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
