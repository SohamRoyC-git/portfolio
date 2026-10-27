"use client";

import React from "react";

export const SilkyFluidBackdrop: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAFAF9]"
      aria-hidden="true"
    >
      {/* 
        High-Performance SVG Fluid Gradient Backdrop
        Directly matches the user's reference screenshot:
        - Pure crisp white/pearl background
        - Silky S-curved fluid wave sweeping across the page
        - Colors: Cerulean blue (left) -> Lilac/Rose pink (mid) -> Vivid violet (dip) -> Sky blue (top right)
        - ZERO canvas loops, ZERO heavy multi-layer blur thrashing, ZERO lag!
      */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Hardware-accelerated single SVG blur filter */}
          <filter id="silk-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="60" />
          </filter>

          {/* S-Curve Fluid Wave Gradient: Cyan -> Rose/Lilac -> Deep Violet -> Sky Blue */}
          <linearGradient id="fluidFlow" x1="5%" y1="75%" x2="95%" y2="15%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.85" />
            <stop offset="28%" stopColor="#38BDF8" stopOpacity="0.75" />
            <stop offset="48%" stopColor="#F472B6" stopOpacity="0.80" />
            <stop offset="68%" stopColor="#C084FC" stopOpacity="0.88" />
            <stop offset="82%" stopColor="#9333EA" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.82" />
          </linearGradient>

          {/* Accent Glow for Center Depth */}
          <radialGradient id="centerPlume" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E879F9" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#C084FC" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FAFAF9" stopOpacity="0" />
          </radialGradient>

          {/* Right Top Plume */}
          <radialGradient id="topRightGlow" cx="60%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#0284C7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FAFAF9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Group with single GPU filter */}
        <g filter="url(#silk-blur)">
          {/* Main S-Curved Fluid Ribbon Path (Exact path from user's screenshot) */}
          <path
            d="M -100 620 
               C 80 500, 180 680, 320 540 
               C 440 420, 500 240, 680 320 
               C 820 380, 880 720, 1060 680 
               C 1200 640, 1260 220, 1420 120 
               C 1520 60, 1580 80, 1620 140
               L 1620 950 L -100 950 Z"
            fill="url(#fluidFlow)"
            opacity="0.88"
          />

          {/* Secondary Organic Accent Plume (Deepens mid-curve violet glow) */}
          <circle cx="980" cy="580" r="280" fill="url(#centerPlume)" />

          {/* Top Right Cyan Flare */}
          <ellipse cx="1320" cy="180" rx="260" ry="220" fill="url(#topRightGlow)" />

          {/* Left Bottom Cyan Aura */}
          <circle cx="120" cy="620" r="220" fill="#38BDF8" opacity="0.45" />
        </g>
      </svg>

      {/* Ultra-subtle Micro-Noise Grain for Premium Matte Surface Texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
};
