"use client";

import React, { memo } from "react";
import Image from "next/image";

export const SilkyFluidBackdrop: React.FC = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAFAF9] max-md:bg-[#0C0C0E]"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* MOBILE EXPERIENCE (< 768px): REFERENCE-MATCHED SMOKY EMBER FLUID WAVE    */}
      {/* (Direct visual match to user reference: deep matte charcoal + organic ribbon)*/}
      {/* ========================================================================= */}
      <div className="md:hidden absolute inset-0 overflow-hidden bg-[#0C0C0E]">
        <Image
          src="/assets/mobile_fluid_ember_reference.jpg"
          alt=""
          fill
          priority
          className="object-cover object-top select-none pointer-events-none opacity-90"
        />
        {/* Subtle vignette darkening at bottom to guarantee clean seamless black bleed */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0C0C0E] to-transparent pointer-events-none" />
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
