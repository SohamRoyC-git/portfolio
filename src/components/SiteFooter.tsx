"use client";

import React from "react";
import { ArrowUp, Heart, Code2, Globe } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export const SiteFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E9E7E3] py-12 text-[#6B6B6B] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-[#E9E7E3] gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#E9E7E3] flex items-center justify-center font-bold text-[#202124]">
              SR
            </div>
            <div>
              <div className="font-sans font-bold text-sm text-[#202124]">
                {PERSONAL_INFO.name}
              </div>
              <div className="text-[11px] text-[#6B6B6B]">
                {PERSONAL_INFO.headline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right">
            <div>
              <span className="text-[#202124] font-medium">B.Tech CSE (AI & ML)</span> • NSEC 2024–2028
            </div>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-[#FAF9F6] hover:bg-[#202124] hover:text-white border border-[#E9E7E3] flex items-center justify-center transition-colors"
              aria-label="Back to top of page"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 Soham Roychoudhury.</span>
            <span>Hand-crafted with Next.js, TypeScript &amp; SVG.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available for Internships</span>
            </span>
            <span>Kolkata, IN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
