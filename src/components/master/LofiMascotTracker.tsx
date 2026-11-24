"use client";

import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";

interface LofiMascotTrackerProps {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  onScrollToTop?: () => void;
}

export const LofiMascotTracker: React.FC<LofiMascotTrackerProps> = memo(
  ({ scrollerRef, onScrollToTop }) => {
    const [progress, setProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("HERO");
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isWiggling, setIsWiggling] = useState(false);
    const [notes, setNotes] = useState<{ id: number; symbol: string; x: number }[]>([]);

    const mascotRef = useRef<SVGSVGElement | null>(null);
    const leftEyeRef = useRef<SVGGElement | null>(null);
    const rightEyeRef = useRef<SVGGElement | null>(null);
    const leftStringRef = useRef<SVGPathElement | null>(null);
    const rightStringRef = useRef<SVGPathElement | null>(null);
    const drawstringsRef = useRef<SVGGElement | null>(null);
    const podRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const prevScrollY = useRef(0);
    const velocityRef = useRef(0);
    const lastSectionRef = useRef("HERO");
    const noteIdRef = useRef(0);

    // Circumference of r=36 is 2 * PI * 36 ≈ 226.195
    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference - progress * circumference;

    // Trigger floating Lo-Fi music notes
    const emitMusicNote = useCallback(() => {
      const symbols = ["♪", "♫", "♩", "♬", "✨"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const id = ++noteIdRef.current;
      const x = Math.random() * 24 - 12; // -12px to +12px offset

      setNotes((prev) => [...prev.slice(-4), { id, symbol, x }]);

      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }, 1600);
    }, []);

    // 1. Idle Lo-Fi Head-Bob & Earphone Groove (75 BPM chill groove)
    useEffect(() => {
      if (!mascotRef.current) return;

      const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
      idleTl.to(mascotRef.current, {
        y: 2.5,
        scaleY: 0.96,
        scaleX: 1.03,
        duration: 0.75,
        ease: "power1.inOut",
      });

      // Subtle swinging of hoodie strings
      let stringTween: gsap.core.Tween | null = null;
      if (drawstringsRef.current) {
        stringTween = gsap.to(drawstringsRef.current, {
          rotation: 4,
          transformOrigin: "50% 66%",
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Natural friendly blink cycle (every 3.8s)
      const blinkInterval = setInterval(() => {
        if (!leftEyeRef.current || !rightEyeRef.current) return;
        gsap.to([leftEyeRef.current, rightEyeRef.current], {
          scaleY: 0.1,
          transformOrigin: "center center",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }, 3800);

      return () => {
        idleTl.kill();
        if (stringTween) stringTween.kill();
        clearInterval(blinkInterval);
      };
    }, []);

    // 2. Scroll Velocity & Progress Observer
    useEffect(() => {
      const getScrollTarget = () => {
        if (scrollerRef && scrollerRef.current) {
          return scrollerRef.current;
        }
        return window;
      };

      const target = getScrollTarget();
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollerEl = scrollerRef?.current;
            let currentY = 0;
            let maxY = 1;

            if (scrollerEl) {
              currentY = scrollerEl.scrollTop;
              maxY = scrollerEl.scrollHeight - scrollerEl.clientHeight;
            } else {
              currentY = window.scrollY;
              maxY = document.documentElement.scrollHeight - window.innerHeight;
            }

            const p = Math.min(1, Math.max(0, currentY / (maxY || 1)));
            setProgress(p);

            // Determine Section Label based on scroll progress
            let sec = "HERO";
            if (p < 0.15) sec = "HERO";
            else if (p < 0.32) sec = "STATEMENT";
            else if (p < 0.65) sec = "CREED";
            else if (p < 0.88) sec = "COMMISSIONS";
            else sec = "MATRIX";

            if (sec !== lastSectionRef.current) {
              lastSectionRef.current = sec;
              setCurrentSection(sec);
              emitMusicNote();
            }

            // Calculate instantaneous velocity for squash & stretch
            const deltaY = currentY - prevScrollY.current;
            prevScrollY.current = currentY;
            velocityRef.current = deltaY;

            setIsScrolling(true);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
              setIsScrolling(false);
            }, 1800);

            // Velocity-based squash & fabric reaction
            if (mascotRef.current) {
              const clampedVel = Math.max(-40, Math.min(40, deltaY));
              const squishFactor = Math.abs(clampedVel) * 0.0035;

              gsap.to(mascotRef.current, {
                y: clampedVel * 0.18,
                scaleY: 1 - squishFactor,
                scaleX: 1 + squishFactor * 0.8,
                duration: 0.15,
                ease: "power1.out",
                overwrite: "auto",
                onComplete: () => {
                  gsap.to(mascotRef.current, {
                    y: 0,
                    scaleY: 1,
                    scaleX: 1,
                    duration: 0.55,
                    ease: "elastic.out(1.2, 0.45)",
                  });
                },
              });
            }

            // Strings flutter backward against scroll direction
            if (drawstringsRef.current) {
              const swingAngle = Math.max(-14, Math.min(14, deltaY * 0.35));
              gsap.to(drawstringsRef.current, {
                rotation: -swingAngle,
                transformOrigin: "50% 66%",
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
              });
            }

            ticking = false;
          });
          ticking = true;
        }
      };

      if (scrollerRef && scrollerRef.current) {
        scrollerRef.current.addEventListener("scroll", handleScroll, { passive: true });
      } else {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }

      return () => {
        if (scrollerRef && scrollerRef.current) {
          scrollerRef.current.removeEventListener("scroll", handleScroll);
        } else {
          window.removeEventListener("scroll", handleScroll);
        }
      };
    }, [scrollerRef, emitMusicNote]);

    // 3. Playful Tap Interaction: 360 Spin + Joyous Hop
    const handleTap = () => {
      if (isWiggling || !mascotRef.current) return;
      setIsWiggling(true);
      emitMusicNote();

      gsap.timeline({
        onComplete: () => setIsWiggling(false),
      })
        .to(mascotRef.current, {
          y: -14,
          scaleY: 1.15,
          scaleX: 0.88,
          duration: 0.22,
          ease: "power2.out",
        })
        .to(mascotRef.current, {
          rotation: 360,
          transformOrigin: "center center",
          duration: 0.55,
          ease: "back.out(1.5)",
        })
        .to(mascotRef.current, {
          y: 0,
          scaleY: 1,
          scaleX: 1,
          rotation: 0,
          duration: 0.35,
          ease: "elastic.out(1.2, 0.4)",
        });

      if (onScrollToTop && progress > 0.85) {
        onScrollToTop();
      }
    };

    return (
      <aside
        ref={podRef}
        aria-label="Lo-Fi Mascot Scroll Tracker"
        className="fixed bottom-14 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3 select-none pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Speech / Telemetry Pill (Appears on Hover or during Scroll) */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1015]/90 border border-[#EAD7C0]/20 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 transform ${
            isHovered || isScrolling
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-x-2 scale-95 pointer-events-none sm:opacity-85 sm:translate-x-0 sm:scale-100"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-[#EAD7C0] uppercase font-bold">
            {currentSection}
          </span>
          <span className="font-mono text-[9px] text-[#CBB59D]/60">•</span>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#FF8C38] font-bold">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Circular Pod with Lo-Fi Mascot Blob & Progress Ring */}
        <div
          onClick={handleTap}
          className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer group"
          role="button"
          tabIndex={0}
          title="Lo-Fi Mascot: Tap to groove!"
        >
          {/* SVG Circular Progress Perimeter Gauge */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 80 80"
          >
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(234, 215, 192, 0.12)"
              strokeWidth="2.5"
            />
            {/* Active Amber Glowing Progress Arc */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#FF8C38"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 ease-out filter drop-shadow-[0_0_4px_#FF8C38]"
            />
          </svg>

          {/* Floating Music Notes Animation Container */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {notes.map((note) => (
              <span
                key={note.id}
                className="absolute text-[12px] text-[#FF8C38] font-bold animate-ping pointer-events-none"
                style={{
                  left: `calc(50% + ${note.x}px)`,
                  top: "-10px",
                  animationDuration: "1.2s",
                }}
              >
                {note.symbol}
              </span>
            ))}
          </div>

          {/* Frosted Glass Disc Base */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0D1016]/85 border border-[#EAD7C0]/25 shadow-[0_10px_28px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-[#FF8C38]/40">
            {/* Cozy Ambient Horizon Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(255,140,56,0.22)_0%,transparent_70%)]" />

            {/* The Mascot Blob (SVG Illustration) */}
            <svg
              ref={mascotRef}
              viewBox="0 0 100 100"
              className="w-11 h-11 sm:w-13 sm:h-13 overflow-visible transform origin-bottom"
            >
              {/* 1. Dark Green Hoodie Body & Torso */}
              <g id="hoodie-torso">
                <path
                  d="M 26 73 C 26 62, 74 62, 74 73 C 74 88, 26 88, 26 73 Z"
                  fill="#153624"
                  stroke="#235238"
                  strokeWidth="1.5"
                />
                {/* Hoodie bottom ribbing */}
                <path
                  d="M 28 82 Q 50 85 72 82"
                  stroke="#102B1D"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              {/* 2. Cozy Oversized Dark Forest Green Hood */}
              <g id="hoodie-head">
                {/* Outer hood volume */}
                <ellipse cx="50" cy="50" rx="33" ry="30" fill="#153624" />
                {/* Hood rim / collar fold */}
                <ellipse
                  cx="50"
                  cy="51"
                  rx="27"
                  ry="25"
                  fill="#1B422D"
                  stroke="#2B6141"
                  strokeWidth="1.8"
                />
                {/* Inner hood depth shadow */}
                <ellipse cx="50" cy="51" rx="24" ry="22" fill="#0E2217" />
              </g>

              {/* 3. The Squishy Cream Blob Face */}
              <g id="blob-face">
                <ellipse cx="50" cy="52" rx="21" ry="19" fill="#FAF6EE" />
                
                {/* Soft warm peach blush cheeks */}
                <ellipse cx="36.5" cy="57" rx="3.5" ry="2" fill="#FF8C38" opacity="0.35" />
                <ellipse cx="63.5" cy="57" rx="3.5" ry="2" fill="#FF8C38" opacity="0.35" />

                {/* Cute Round Eyes (Glossy Button Dots - Strictly No Anime Eyes) */}
                <g ref={leftEyeRef} id="left-eye">
                  <circle cx="41.5" cy="49" r="3.4" fill="#111216" />
                  <circle cx="42.8" cy="47.6" r="1.3" fill="#FFFFFF" />
                  <circle cx="40.5" cy="50.2" r="0.6" fill="#FFFFFF" opacity="0.6" />
                </g>

                <g ref={rightEyeRef} id="right-eye">
                  <circle cx="58.5" cy="49" r="3.4" fill="#111216" />
                  <circle cx="59.8" cy="47.6" r="1.3" fill="#FFFFFF" />
                  <circle cx="57.5" cy="50.2" r="0.6" fill="#FFFFFF" opacity="0.6" />
                </g>

                {/* Gentle happy curved smile */}
                <path
                  d="M 47 55 Q 50 57.5 53 55"
                  fill="none"
                  stroke="#111216"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* 4. Hanging Hoodie Drawstrings (Physics reactive) */}
              <g ref={drawstringsRef} id="drawstrings">
                {/* Left string */}
                <path
                  ref={leftStringRef}
                  d="M 41 66 Q 40 76 39 82"
                  fill="none"
                  stroke="#2C5F43"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="39" cy="82" r="1.6" fill="#EAD7C0" />

                {/* Right string */}
                <path
                  ref={rightStringRef}
                  d="M 59 66 Q 60 76 61 82"
                  fill="none"
                  stroke="#2C5F43"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="61" cy="82" r="1.6" fill="#EAD7C0" />
              </g>

              {/* 5. Retro Studio Monitor Headphones */}
              <g id="studio-headphones">
                {/* Headband arch over the hood */}
                <path
                  d="M 24 48 C 22 23, 78 23, 76 48"
                  fill="none"
                  stroke="#1A1C22"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                {/* Headband inner cushion bar */}
                <path
                  d="M 31 32 C 39 26, 61 26, 69 32"
                  fill="none"
                  stroke="#2E313A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Metal extension sliders */}
                <rect x="22" y="44" width="3" height="6" rx="1" fill="#9DA3AF" />
                <rect x="75" y="44" width="3" height="6" rx="1" fill="#9DA3AF" />

                {/* Left Earcup */}
                <g id="left-earcup">
                  <rect
                    x="15"
                    y="41"
                    width="10"
                    height="20"
                    rx="5"
                    fill="#15171C"
                    stroke="#2D3039"
                    strokeWidth="1.2"
                  />
                  {/* Plush cushion pad */}
                  <rect x="21" y="43" width="3.5" height="16" rx="1.8" fill="#0D0E12" />
                  {/* Glowing amber LED indicator ring */}
                  <circle
                    cx="19"
                    cy="51"
                    r="2.2"
                    fill="#FF8C38"
                    className="animate-pulse"
                  />
                </g>

                {/* Right Earcup */}
                <g id="right-earcup">
                  <rect
                    x="75"
                    y="41"
                    width="10"
                    height="20"
                    rx="5"
                    fill="#15171C"
                    stroke="#2D3039"
                    strokeWidth="1.2"
                  />
                  {/* Plush cushion pad */}
                  <rect x="75.5" y="43" width="3.5" height="16" rx="1.8" fill="#0D0E12" />
                  {/* Glowing amber LED indicator ring */}
                  <circle
                    cx="81"
                    cy="51"
                    r="2.2"
                    fill="#FF8C38"
                    className="animate-pulse"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </aside>
    );
  }
);

LofiMascotTracker.displayName = "LofiMascotTracker";
