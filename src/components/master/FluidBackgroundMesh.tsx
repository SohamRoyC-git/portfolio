"use client";

import React from "react";

export const FluidBackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Base Luminous Pearl Canvas */}
      <div className="absolute inset-0 bg-[#FAFAF9]" />

      {/* Luminous Fluid Aurora Orb 1 (Mint / Emerald) */}
      <div
        className="absolute -top-[12%] -left-[8%] w-[68vw] h-[68vw] rounded-full blur-[140px] opacity-60 animate-aurora-one"
        style={{
          background: "radial-gradient(circle, rgba(0, 255, 135, 0.35) 0%, rgba(16, 185, 129, 0.25) 50%, rgba(255, 255, 255, 0) 75%)",
        }}
      />

      {/* Luminous Fluid Aurora Orb 2 (Celestial Sky Cyan / Soft Aqua) */}
      <div
        className="absolute top-[35%] -right-[12%] w-[62vw] h-[62vw] rounded-full blur-[150px] opacity-50 animate-aurora-two"
        style={{
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(52, 211, 153, 0.25) 50%, rgba(255, 255, 255, 0) 80%)",
        }}
      />

      {/* Luminous Fluid Aurora Orb 3 (Bottom Golden Jade) */}
      <div
        className="absolute -bottom-[15%] left-[25%] w-[58vw] h-[58vw] rounded-full blur-[160px] opacity-45 animate-aurora-one"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 55%, rgba(255, 255, 255, 0) 80%)",
          animationDelay: "-7s",
        }}
      />

      {/* Delicate Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F172A 1px, transparent 1px),
            linear-gradient(to bottom, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
};
