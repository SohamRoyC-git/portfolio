"use client";

import React, { memo } from "react";

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
      {/* MOBILE EXPERIENCE (< 768px): UNDERSTATED SMOKY EMBER FLUID RIBBON        */}
      {/* (Directly matched to user reference: deep matte charcoal + organic ribbon)*/}
      {/* ========================================================================= */}
      <div
        className="md:hidden absolute inset-0 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 85% 15%, #180C08 0%, #0C0C0E 70%)",
        }}
      >
        {/* Upper-Right Molten Ember Bloom (Primary focal light from reference) */}
        <div
          className="absolute -top-[8%] -right-[15%] w-[115vw] h-[115vw] rounded-full blur-[85px] opacity-75 animate-aurora-one will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 55% 45%, #E63B08 0%, #C42D05 35%, #7A1705 60%, transparent 75%)",
          }}
        />

        {/* Diagonal S-Curve Smoky Fluid Stream (Organic ribbon body) */}
        <div
          className="absolute top-[28%] -right-[10%] w-[100vw] h-[110vw] rounded-full blur-[95px] opacity-65 animate-aurora-two will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 55% 65% at 60% 50%, #D83A08 0%, #8E1F06 42%, #420C04 68%, transparent 80%)",
          }}
        />

        {/* Subtle Smoky Shadow Crevice (Creates the 3D ribbon depth from reference) */}
        <div
          className="absolute top-[38%] right-[18%] w-[65vw] h-[75vw] rounded-full blur-[80px] opacity-45 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #080D11 0%, rgba(12,12,14,0.6) 50%, transparent 75%)",
          }}
        />

        {/* Lower-Right Soft Residual Ember Horizon */}
        <div
          className="absolute -bottom-[8%] right-[0%] w-[105vw] h-[105vw] rounded-full blur-[90px] opacity-55 animate-aurora-one will-change-transform"
          style={{
            background:
              "radial-gradient(circle, #B83006 0%, #631404 45%, transparent 75%)",
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
