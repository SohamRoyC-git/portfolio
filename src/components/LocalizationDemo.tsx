"use client";

import React, { useState } from "react";
import { Globe, Cpu, Zap, Database, ArrowRight, ShieldCheck, Check, Sparkles, RefreshCw } from "lucide-react";

type Lang = "en" | "ru";

interface VerifiedKeySample {
  key: string;
  category: string;
  en: string;
  ru: string;
}

const VERIFIED_SAMPLES: VerifiedKeySample[] = [
  {
    key: "nav.products",
    category: "Navigation",
    en: "Products & Specifications",
    ru: "Продукция и Характеристики",
  },
  {
    key: "products.cobs.title",
    category: "B2B Agronomy",
    en: "IQF Frozen Sweet Corn Cobs (Super Sweet Variety)",
    ru: "Замороженные початки сахарной кукурузы IQF",
  },
  {
    key: "products.cobs.desc",
    category: "Cold-Chain Logistics",
    en: "Harvested at peak brix sweetness, processed within 4 hours, and blast frozen at -38°C for worldwide container shipping.",
    ru: "Собраны на пике сладости по шкале Брикс, переработаны в течение 4 часов и подвергнуты шоковой заморозке при -38°C для контейнерных перевозок.",
  },
  {
    key: "products.specs.brix",
    category: "Quality Standards",
    en: "Brix Sweetness Index: 12° – 14° Natural Sucrose",
    ru: "Индекс сладости Брикс: 12° – 14° натуральной сахарозы",
  },
  {
    key: "products.specs.shelf",
    category: "Storage",
    en: "Shelf Life: 24 Months at -18°C / ISO & HACCP Certified",
    ru: "Срок хранения: 24 месяца при -18°C / Сертифицировано ISO и HACCP",
  },
  {
    key: "contact.title",
    category: "Buyer Inquiry",
    en: "Ready to Elevate Your Agricultural Supply Chain?",
    ru: "Готовы улучшить свою цепочку поставок?",
  },
  {
    key: "contact.cta",
    category: "Call to Action",
    en: "Request Export Grade Specifications & Quotation",
    ru: "Запросить экспортную спецификацию и коммерческое предложение",
  },
];

export const LocalizationDemo: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [switchCount, setSwitchCount] = useState(0);

  const toggleLanguage = (lang: Lang) => {
    setCurrentLang(lang);
    setSwitchCount((c) => c + 1);
  };

  const sample = VERIFIED_SAMPLES[selectedSampleIndex];

  return (
    <div className="bg-[#171717] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl overflow-hidden relative">
      {/* Top Banner & Context Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span className="font-mono text-xs text-[#F97316] uppercase tracking-wider font-semibold">
              Interactive Architectural Demonstration
            </span>
          </div>
          <h4 className="font-sans font-bold text-lg sm:text-xl text-white">
            Zero-API Client-Side Localization Engine (200+ Keys)
          </h4>
        </div>

        {/* Verification badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Frontend-Only • 0ms Latency</span>
        </div>
      </div>

      {/* Main Grid: Interactive Demo Card (Left) vs Architecture Flow (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Interactive B2B UI Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Language Toggle Controls */}
          <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
              <Globe size={14} className="text-[#F97316]" />
              <span>Target Language:</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              <button
                onClick={() => toggleLanguage("en")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  currentLang === "en"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🇬🇧 English (Default)
              </button>
              <button
                onClick={() => toggleLanguage("ru")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  currentLang === "ru"
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🇷🇺 Русский (Russian)
              </button>
            </div>
          </div>

          {/* Interactive Agricultural Sample Card */}
          <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 relative overflow-hidden transition-all duration-300">
            {/* Top key header */}
            <div className="flex items-center justify-between font-mono text-xs text-neutral-400 pb-4 border-b border-neutral-800 mb-4">
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live DOM Render Node
              </span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px] text-[#F97316]">
                key: &ldquo;{sample.key}&rdquo;
              </span>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded bg-[#F97316]/20 border border-[#F97316]/30 text-[#F97316] text-xs font-mono">
                {sample.category}
              </div>

              <div className="font-sans font-bold text-xl sm:text-2xl text-white transition-opacity duration-200">
                {currentLang === "en" ? sample.en : sample.ru}
              </div>

              <div className="font-sans text-xs text-neutral-400 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="font-mono text-[10px] text-neutral-500 uppercase mb-1">
                  Active Localization String:
                </div>
                <div className="font-mono text-xs text-emerald-400 break-words">
                  {currentLang === "en" ? sample.en : sample.ru}
                </div>
              </div>
            </div>

            {/* Key Selector Pills */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <div className="font-mono text-[11px] text-neutral-400 mb-2">
                Sample Verified Dictionary Keys:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VERIFIED_SAMPLES.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedSampleIndex(idx)}
                    className={`font-mono text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                      selectedSampleIndex === idx
                        ? "bg-[#F97316]/20 border-[#F97316] text-white"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Flow Diagram (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900/90 rounded-2xl p-6 border border-neutral-800 space-y-5">
          <div className="font-mono text-xs font-bold text-[#F97316] uppercase tracking-wider flex items-center gap-2">
            <Cpu size={14} />
            Architectural Pipeline
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[#F97316] font-bold text-[11px] mb-1 flex items-center justify-between">
                <span>01. LANGUAGE EVENT</span>
                <span className="text-neutral-500 text-[10px]">Client Event</span>
              </div>
              <div className="text-neutral-300 text-xs">
                User selects EN ↔ RU toggle button; updates internal locale state in memory.
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-neutral-600">↓</div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[#F97316] font-bold text-[11px] mb-1 flex items-center justify-between">
                <span>02. CENTRALIZED DICTIONARY</span>
                <span className="text-emerald-400 text-[10px]">Zero External API</span>
              </div>
              <div className="text-neutral-300 text-xs">
                Pre-compiled structured JSON containing 278 verified agricultural key pairs.
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-neutral-600">↓</div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[#F97316] font-bold text-[11px] mb-1 flex items-center justify-between">
                <span>03. DETERMINISTIC REHYDRATION</span>
                <span className="text-amber-400 text-[10px]">0ms Latency</span>
              </div>
              <div className="text-neutral-300 text-xs">
                DOM query selector matches <code className="text-[#F97316]">[data-i18n]</code> tags; text nodes update synchronously without page reload.
              </div>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-base font-bold text-white">278</div>
              <div className="text-[10px] text-neutral-400">Translation Keys</div>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-base font-bold text-emerald-400">0 ms</div>
              <div className="text-[10px] text-neutral-400">API Overhead</div>
            </div>
          </div>

          <div className="text-[11px] font-sans text-neutral-400 italic">
            *Verified architectural constraint: 100% frontend implementation. No server translation API or database dependency.
          </div>
        </div>
      </div>
    </div>
  );
};
