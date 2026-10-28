"use client";

import React, { useState, useEffect } from "react";

export const YouTubeSkeletonLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // 1.1s warm-up window: allows video textures, fonts, and GSAP contexts to initialize smoothly
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 650);
      return () => clearTimeout(removeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FAFAF9] overflow-hidden select-none transition-opacity duration-650 ease-out will-change-[opacity] ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transform: "translate3d(0, 0, 0)",
      }}
      aria-label="Loading portfolio wireframe"
    >
      {/* 100% GPU-Composited YouTube Shimmer CSS Style */}
      <style jsx>{`
        .yt-shimmer {
          position: relative;
          overflow: hidden;
          background-color: #e2e8f0;
          will-change: transform;
        }
        .yt-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translate3d(-100%, 0, 0);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: ytShimmerSweep 1.5s infinite;
          will-change: transform;
        }
        @keyframes ytShimmerSweep {
          0% {
            transform: translate3d(-100%, 0, 0);
          }
          100% {
            transform: translate3d(100%, 0, 0);
          }
        }
      `}</style>

      {/* Top Header Navigation Skeleton */}
      <div className="w-full px-4 sm:px-8 md:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        {/* Logo Monogram Skeleton */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full yt-shimmer" />
          <div className="w-36 sm:w-52 h-4 rounded-md yt-shimmer" />
        </div>

        {/* Center Nav Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="w-14 h-3.5 rounded-md yt-shimmer" />
          <div className="w-20 h-3.5 rounded-md yt-shimmer" />
          <div className="w-16 h-3.5 rounded-md yt-shimmer" />
          <div className="w-20 h-3.5 rounded-md yt-shimmer" />
          <div className="w-16 h-3.5 rounded-md yt-shimmer" />
        </div>

        {/* Right Action Skeleton */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-32 h-7 rounded-full yt-shimmer" />
          <div className="w-24 sm:w-28 h-8 rounded-full yt-shimmer" />
        </div>
      </div>

      {/* Main Monumental Hero Wireframe Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 h-[calc(100svh-72px)] flex flex-col justify-between py-8 sm:py-12">
        {/* Top Status Bar Skeleton */}
        <div className="flex items-center justify-between w-full">
          <div className="w-40 sm:w-48 h-3.5 rounded-md yt-shimmer" />
          <div className="w-28 sm:w-36 h-6 rounded-full yt-shimmer" />
        </div>

        {/* Central Title & Subtitle Skeleton */}
        <div className="flex flex-col items-center justify-center text-center my-auto w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Eyebrow Pill */}
          <div className="w-56 sm:w-80 h-7 rounded-full yt-shimmer" />

          {/* SOHAM Title Line 1 */}
          <div className="w-3/5 sm:w-1/2 h-12 sm:h-24 md:h-28 rounded-2xl yt-shimmer" />

          {/* ROYCHOUDHURY Title Line 2 */}
          <div className="w-4/5 sm:w-3/4 h-12 sm:h-24 md:h-28 rounded-2xl yt-shimmer" />

          {/* Editorial Subtitle Lines */}
          <div className="space-y-2.5 w-full max-w-xl mx-auto pt-2">
            <div className="w-full h-3.5 sm:h-5 rounded-md yt-shimmer mx-auto" />
            <div className="w-4/5 h-3.5 sm:h-5 rounded-md yt-shimmer mx-auto" />
          </div>

          {/* Dual Action Buttons Skeleton */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="w-32 sm:w-40 h-10 rounded-full yt-shimmer" />
            <div className="w-32 sm:w-40 h-10 rounded-full yt-shimmer" />
          </div>
        </div>

        {/* Bottom Bar: Action Button Skeleton */}
        <div className="flex items-center justify-center sm:justify-between pt-4 border-t border-slate-200/60">
          <div className="hidden md:block w-48 h-3.5 rounded-md yt-shimmer" />
          <div className="w-36 h-3 rounded-md yt-shimmer" />
        </div>
      </div>
    </div>
  );
};
