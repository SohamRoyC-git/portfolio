"use client";

import React, { memo } from "react";

export const SilkyFluidBackdrop: React.FC = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#060709]"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* 1. Fine Architectural Hairline Grid (Belgrade Arbor / CAD Precision) */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundSize: "80px 80px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 1px, transparent 1px)
          `,
        }}
      />

      {/* 2. Tactile Matte Paper/Film Grain Texture (Zero AI neon blobs) */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
});

SilkyFluidBackdrop.displayName = "SilkyFluidBackdrop";
