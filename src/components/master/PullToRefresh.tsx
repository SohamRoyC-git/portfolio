"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { RotateCw } from "lucide-react";

interface PullToRefreshProps {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}

const THRESHOLD = 64;

export const PullToRefresh: React.FC<PullToRefreshProps> = memo(({ scrollerRef }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate pull-to-refresh if user is at the very top of the scroll container
      if (scroller.scrollTop <= 2 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      } else {
        isPullingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - startYRef.current;

      if (rawDelta > 0 && scroller.scrollTop <= 2) {
        // Damped logarithmic pull resistance for high-end tactile feel
        const damped = Math.min(85, Math.pow(rawDelta, 0.82) * 1.6);
        setPullDistance(damped);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullDistance >= THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(15);
        }
        setTimeout(() => {
          window.location.reload();
        }, 550);
      } else {
        setPullDistance(0);
      }
    };

    scroller.addEventListener("touchstart", handleTouchStart, { passive: true });
    scroller.addEventListener("touchmove", handleTouchMove, { passive: true });
    scroller.addEventListener("touchend", handleTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      scroller.removeEventListener("touchstart", handleTouchStart);
      scroller.removeEventListener("touchmove", handleTouchMove);
      scroller.removeEventListener("touchend", handleTouchEnd);
      scroller.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [scrollerRef, pullDistance, isRefreshing]);

  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(1, pullDistance / THRESHOLD);
  const isReady = pullDistance >= THRESHOLD;

  return (
    <div
      className="fixed top-3 inset-x-0 z-50 pointer-events-none flex flex-col items-center justify-center transition-transform duration-100 ease-out select-none"
      style={{
        transform: `translateY(${Math.min(pullDistance * 0.85, 60)}px)`,
        opacity: Math.min(1, progress * 1.2),
      }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#060709]/90 backdrop-blur-md border border-[#FF8C38]/30 shadow-[0_0_24px_rgba(255,140,56,0.35)]">
        <div
          className={`w-5 h-5 flex items-center justify-center text-[#FF8C38] ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
          }}
        >
          <RotateCw size={13} className="text-[#FF8C38]" />
        </div>

        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#EAD7C0]">
          {isRefreshing
            ? "RELOADING STUDIO..."
            : isReady
            ? "RELEASE TO RELOAD"
            : "PULL TO REFRESH"}
        </span>
      </div>
    </div>
  );
});

PullToRefresh.displayName = "PullToRefresh";

