"use client";

import React from "react";

export const FluidGradientAura: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 
        Ultra-smooth, zero-lag GPU-accelerated fluid gradient aura.
        Matches the soft, smoky, organic velvet light from the user's reference screenshot.
        Completely eliminates canvas CPU draw-loop bottlenecks and worm-like segments.
      */}

      {/* Primary Warm Crimson / Vermilion Fluid Aura (Top-Right Sweeping Flow) */}
      <div
        className="absolute -top-[10%] -right-[15%] w-[85vw] max-w-[1100px] h-[80vw] max-h-[900px] rounded-[42%_58%_70%_30%/45%_45%_55%_55%] blur-[80px] sm:blur-[130px] md:blur-[170px] opacity-70 sm:opacity-75 mix-blend-multiply will-change-transform animate-fluid-drift-1"
        style={{
          background: "radial-gradient(ellipse at 45% 45%, #FF385C 0%, #FF5722 35%, #F97316 60%, rgba(254, 240, 138, 0.4) 80%, transparent 100%)",
        }}
      />

      {/* Secondary Deep Royal Violet & Wine Smoke (Center-Left Undulating Glow) */}
      <div
        className="absolute top-[28%] -left-[18%] w-[75vw] max-w-[950px] h-[75vw] max-h-[850px] rounded-[58%_42%_35%_65%/55%_65%_35%_45%] blur-[90px] sm:blur-[140px] md:blur-[180px] opacity-60 sm:opacity-65 mix-blend-multiply will-change-transform animate-fluid-drift-2"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #E11D48 0%, #C026D3 38%, #7C3AED 65%, #3B82F6 85%, transparent 100%)",
        }}
      />

      {/* Tertiary Radiant Sunburst Amber / Coral Core (Mid-Right Warm Flare) */}
      <div
        className="absolute top-[48%] right-[5%] w-[65vw] max-w-[800px] h-[65vw] max-h-[750px] rounded-[50%_50%_60%_40%/40%_60%_50%_50%] blur-[80px] sm:blur-[120px] md:blur-[160px] opacity-55 sm:opacity-60 mix-blend-multiply will-change-transform animate-fluid-drift-3"
        style={{
          background: "radial-gradient(circle at 40% 40%, #F59E0B 0%, #F97316 45%, #EF4444 75%, transparent 100%)",
        }}
      />

      {/* Bottom Emerald / Mint Aurora Wave (Ties seamlessly into the portfolio's accent theme) */}
      <div
        className="absolute -bottom-[20%] left-[10%] w-[80vw] max-w-[1000px] h-[65vw] max-h-[750px] rounded-[65%_35%_50%_50%/50%_40%_60%_50%] blur-[90px] sm:blur-[140px] md:blur-[170px] opacity-45 sm:opacity-50 mix-blend-multiply will-change-transform animate-fluid-drift-1"
        style={{
          background: "radial-gradient(circle at 50% 50%, #10B981 0%, #059669 40%, #0284C7 70%, transparent 100%)",
          animationDelay: "-12s",
        }}
      />

      {/* Ultra-subtle Micro-Noise Grain for Film/Silk Texture (Zero banding) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Embedded High-Performance Keyframes */}
      <style jsx>{`
        @keyframes fluidDrift1 {
          0%, 100% {
            transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translate3d(40px, -35px, 0px) rotate(6deg) scale(1.08);
          }
          66% {
            transform: translate3d(-35px, 25px, 0px) rotate(-5deg) scale(0.95);
          }
        }
        @keyframes fluidDrift2 {
          0%, 100% {
            transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1.02);
          }
          50% {
            transform: translate3d(-45px, 40px, 0px) rotate(-8deg) scale(0.94);
          }
        }
        @keyframes fluidDrift3 {
          0%, 100% {
            transform: translate3d(0px, 0px, 0px) scale(0.98);
          }
          50% {
            transform: translate3d(30px, -20px, 0px) scale(1.06);
          }
        }
        .animate-fluid-drift-1 {
          animation: fluidDrift1 20s ease-in-out infinite;
        }
        .animate-fluid-drift-2 {
          animation: fluidDrift2 26s ease-in-out infinite;
        }
        .animate-fluid-drift-3 {
          animation: fluidDrift3 22s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
