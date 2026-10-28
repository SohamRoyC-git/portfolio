"use client";

import React, { memo } from "react";

export const SilkyFluidBackdrop: React.FC = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAFAF9] max-md:bg-[#0A0502]"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE (< 768px): VIBRANT ORANGE FLUID GRADIENT BACKDROP       */}
      {/* ========================================================================= */}
      <div
        className="md:hidden absolute inset-0 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, #1c0a02 0%, #0a0401 100%)",
        }}
      >
        {/* Radiant Molten Orange Fluid Glow (Top-Right) */}
        <div
          className="absolute -top-[10%] -right-[15%] w-[115vw] h-[115vw] rounded-full blur-[70px] opacity-80 animate-aurora-one will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #FF5500 0%, #FF3300 45%, transparent 70%)",
          }}
        />

        {/* Luminous Electric Mandarin / Amber Fluid Glow (Center-Left) */}
        <div
          className="absolute top-[30%] -left-[20%] w-[125vw] h-[125vw] rounded-full blur-[80px] opacity-75 animate-aurora-two will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #FF8C00 0%, #FF5000 40%, transparent 70%)",
          }}
        />

        {/* Deep Sunset Coral Fluid Glow (Mid-Lower) */}
        <div
          className="absolute top-[60%] -right-[10%] w-[120vw] h-[120vw] rounded-full blur-[85px] opacity-70 animate-aurora-one will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #FF3700 0%, #FF6A00 45%, transparent 75%)",
          }}
        />

        {/* Golden Dawn Fluid Accent (Bottom-Left) */}
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[110vw] h-[110vw] rounded-full blur-[75px] opacity-65 animate-aurora-two will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #FFAA00 0%, #FF4400 45%, transparent 70%)",
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EXPERIENCE (>= 768px): SILKY PASTEL FLUID MESH (GALLERY LIGHT)    */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block absolute inset-0 opacity-75 sm:opacity-85 blur-xl sm:blur-3xl"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 15% 75%, rgba(14, 165, 233, 0.40) 0%, transparent 70%),
            radial-gradient(ellipse 60% 45% at 45% 55%, rgba(244, 114, 182, 0.35) 0%, transparent 65%),
            radial-gradient(ellipse 65% 50% at 72% 65%, rgba(192, 132, 252, 0.42) 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 85% 20%, rgba(56, 189, 248, 0.45) 0%, transparent 65%),
            radial-gradient(circle at 62% 60%, rgba(147, 51, 234, 0.30) 0%, transparent 60%)
          `,
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Ultra-subtle Micro-Noise Grain for Premium Matte Surface Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
});

SilkyFluidBackdrop.displayName = "SilkyFluidBackdrop";
