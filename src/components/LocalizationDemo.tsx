"use client";

import React, { useState } from "react";
import { Globe, Cpu, ShieldCheck } from "lucide-react";

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
    ru: "Продукция и Спецификации",
  },
  {
    key: "products.cobs.title",
    category: "B2B Agronomy",
    en: "IQF Frozen Sweet Corn Cobs (Super Sweet Variety)",
    ru: "Замороженная сахарная кукуруза в початках IQF",
  },
  {
    key: "products.cobs.desc",
    category: "Cold-Chain Logistics",
    en: "Harvested at peak brix sweetness, processed within 4 hours, and blast frozen at -38°C for worldwide container shipping.",
    ru: "Собрано на пике сладости по шкале Брикс, переработано за 4 часа и подвергнуто шоковой заморозке при -38°C.",
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
    ru: "Срок хранения: 24 месяца при -18°C / Сертификация ISO и HACCP",
  },
  {
    key: "contact.title",
    category: "Buyer Inquiry",
    en: "Ready to Elevate Your Agricultural Supply Chain?",
    ru: "Готовы оптимизировать цепочку поставок агропродукции?",
  },
  {
    key: "contact.cta",
    category: "Call to Action",
    en: "Request Export Grade Specifications & Quotation",
    ru: "Запросить экспортные спецификации и ценовое предложение",
  },
];

export const LocalizationDemo: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const toggleLanguage = (lang: Lang) => {
    setCurrentLang(lang);
  };

  const sample = VERIFIED_SAMPLES[selectedSampleIndex];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Top Banner & Context Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-sans font-black text-xs text-[#10B981] uppercase tracking-wider">
              Interactive Architectural Demonstration
            </span>
          </div>
          <h4 className="font-sans font-black text-lg sm:text-xl text-white">
            Zero-API Client-Side Localization Engine (278 Keys)
          </h4>
        </div>

        {/* Verification badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-sans font-black text-slate-300 uppercase tracking-wider">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Frontend-Only · &lt; 5ms Latency</span>
        </div>
      </div>

      {/* Main Grid: Interactive Demo Card (Left) vs Architecture Flow (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Interactive B2B UI Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Language Toggle Controls */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 font-sans font-black text-xs text-slate-300 uppercase tracking-wider">
              <Globe size={14} className="text-[#10B981]" />
              <span>Target Language:</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => toggleLanguage("en")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                  currentLang === "en"
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                English (Default)
              </button>
              <button
                onClick={() => toggleLanguage("ru")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                  currentLang === "ru"
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Русский (Russian)
              </button>
            </div>
          </div>

          {/* Interactive Agricultural Sample Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 relative overflow-hidden transition-all duration-300">
            {/* Top key header */}
            <div className="flex items-center justify-between font-sans font-black text-xs text-slate-400 pb-4 border-b border-slate-700 mb-4 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live DOM Render Node
              </span>
              <span className="bg-slate-900 px-2.5 py-1 rounded text-[11px] text-[#10B981]">
                key: &ldquo;{sample.key}&rdquo;
              </span>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-xs font-sans font-black uppercase tracking-wider">
                {sample.category}
              </div>

              <div className="font-sans font-black text-xl sm:text-2xl text-white transition-opacity duration-200">
                {currentLang === "en" ? sample.en : sample.ru}
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-sans font-black text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  Active Localization String:
                </div>
                <div className="font-serif italic font-light text-base text-emerald-400 break-words">
                  {currentLang === "en" ? sample.en : sample.ru}
                </div>
              </div>
            </div>

            {/* Key Selector Pills */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="font-sans font-black text-[11px] text-slate-400 mb-2 uppercase tracking-wider">
                Sample Verified Dictionary Keys:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VERIFIED_SAMPLES.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedSampleIndex(idx)}
                    className={`font-sans font-black text-[11px] px-2.5 py-1 rounded-md border uppercase tracking-wider transition-all cursor-pointer ${
                      selectedSampleIndex === idx
                        ? "bg-[#10B981]/20 border-[#10B981] text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
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
        <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-5">
          <div className="font-sans font-black text-xs text-[#10B981] uppercase tracking-wider flex items-center gap-2">
            <Cpu size={14} />
            Architectural Pipeline
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[#10B981] font-sans font-black text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>01. LANGUAGE EVENT</span>
                <span className="text-slate-500 text-[10px]">Client Event</span>
              </div>
              <div className="font-serif italic font-light text-slate-300 text-sm">
                User selects EN ↔ RU toggle; updates internal locale state in memory without page reload.
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[#10B981] font-sans font-black text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>02. CENTRALIZED DICTIONARY</span>
                <span className="text-emerald-400 text-[10px]">Zero External API</span>
              </div>
              <div className="font-serif italic font-light text-slate-300 text-sm">
                Pre-compiled structured JSON containing 278 verified agricultural key pairs.
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[#10B981] font-sans font-black text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>03. SUB-5MS RESOLUTION</span>
                <span className="text-emerald-400 text-[10px]">O(1) Hash Map</span>
              </div>
              <div className="font-serif italic font-light text-slate-300 text-sm">
                Instant translation delivered to buyer terminals with zero network overhead.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
