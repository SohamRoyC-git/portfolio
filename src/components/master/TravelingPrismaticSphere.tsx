"use client";

import React, { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StardustTrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  rotSpeed: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  isStar: boolean;
}

export const TravelingPrismaticSphere: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef({ progress: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("pointermove", handleMouseMove, { passive: true });

    // GSAP ScrollTrigger Synchronization with Lenis
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;
      },
    });

    // Fallback standard scroll listener
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const p = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      scrollRef.current.progress = Math.min(Math.max(p, 0), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let animId: number;
    let time = 0;

    const isMobileInitial = width < 640;
    // Initialize directly at Section 00 coordinates so there is zero jump
    let currentX = isMobileInitial ? width * 0.72 : width * 0.72;
    let currentY = isMobileInitial ? height * 0.22 : height * 0.35;
    let currentRadius = isMobileInitial ? 58 : 125;

    // Smooth hover transition factor
    let hoverFactor = 0;

    // Elastic click bounce & optical shockwave ring
    let clickScale = 1.0;
    let clickScaleVel = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;

    // Double-Click Orbital Escape Loop (Figure-eight Lemniscate)
    let isOrbiting = false;
    let orbitProgress = 0;
    const ORBIT_DURATION_FRAMES = 115;

    // Stardust trail & click sparkles pools
    const trail: StardustTrailParticle[] = [];
    const sparkles: SparkleParticle[] = [];
    let lastEmitX = currentX;
    let lastEmitY = currentY;

    // Trigger elastic pulse and sparkle burst
    const triggerClickPulse = () => {
      clickScale = 0.90;
      clickScaleVel = 0.08;
      shockwaveRadius = currentRadius * 0.9;
      shockwaveAlpha = 0.9;

      const count = width < 640 ? 18 : 28;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2.5;
        const isStar = Math.random() < 0.45;
        const colors = [
          "#00FF87",
          "#10B981",
          "#38BDF8",
          "#F472B6",
          "#E0E7FF",
          "#FFFFFF",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        sparkles.push({
          x: currentX + Math.cos(angle) * (currentRadius * 0.4),
          y: currentY + Math.sin(angle) * (currentRadius * 0.4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isStar ? Math.random() * 6 + 6 : Math.random() * 3 + 2,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
          alpha: 1.0,
          life: 0,
          maxLife: Math.floor(Math.random() * 25 + 35),
          color,
          isStar,
        });
      }
    };

    // Trigger figure-eight orbital escape loop
    const triggerOrbitalEscape = () => {
      isOrbiting = true;
      orbitProgress = 0;

      clickScale = 0.82;
      clickScaleVel = 0.14;
      shockwaveRadius = currentRadius * 0.85;
      shockwaveAlpha = 1.0;

      const count = width < 640 ? 18 : 26;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3.5;
        sparkles.push({
          x: currentX,
          y: currentY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 7 + 4,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.16,
          alpha: 1.0,
          life: 0,
          maxLife: 42,
          color: Math.random() < 0.5 ? "#00FF87" : "#38BDF8",
          isStar: true,
        });
      }
    };

    // Mouse click handler
    const handleClick = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.getAttribute("role") === "button")
      ) {
        return;
      }

      const dx = e.clientX - currentX;
      const dy = e.clientY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < currentRadius * 1.35) {
        triggerClickPulse();
      }
    };
    window.addEventListener("click", handleClick);

    // Mouse double-click handler
    const handleDblClick = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.getAttribute("role") === "button")
      ) {
        return;
      }

      const dx = e.clientX - currentX;
      const dy = e.clientY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < currentRadius * 1.5) {
        triggerOrbitalEscape();
      }
    };
    window.addEventListener("dblclick", handleDblClick);

    // Touch tap handler for mobile
    let lastTapTime = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.getAttribute("role") === "button")
      ) {
        return;
      }

      const dx = touch.clientX - currentX;
      const dy = touch.clientY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < currentRadius * 1.6) {
        const now = Date.now();
        if (now - lastTapTime < 380) {
          triggerOrbitalEscape();
          lastTapTime = 0;
        } else {
          lastTapTime = now;
          triggerClickPulse();
        }
      }
    };
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 4-pointed diamond sparkle star drawer
    const drawSparkleStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      rotation: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);
      context.beginPath();

      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.22;

      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.closePath();
      context.fill();
      context.restore();
    };

    const render = () => {
      if (typeof document !== "undefined" && document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor lerp
      if (targetMouseX > 0) {
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;
      }

      const p = scrollRef.current.progress;
      const isMobile = width < 640;

      // --- Alternating Trajectory Across Page Sections ---
      let targetX = width * 0.5;
      let targetY = height * 0.46;
      let targetRadius = isMobile ? 58 : 125;

      if (p < 0.18) {
        // Section 00 (Hero): Anchored in the open sky right above the terrace desk!
        const t = p / 0.18;
        const startX = width * 0.72;
        const endX = width * 0.65;
        targetX = isMobile ? width * 0.72 : (startX + (endX - startX) * t);
        targetY = isMobile ? height * 0.22 : (height * (0.35 + t * 0.10));
        targetRadius = isMobile ? 55 : 125;
      } else if (p < 0.38) {
        // Section 01 (Statement): Sweeps smoothly back to the LEFT (0.24)
        const t = (p - 0.18) / 0.20;
        const startX = isMobile ? width * 0.72 : width * 0.65;
        const endX = width * 0.24;
        targetX = startX + (endX - startX) * Math.min(t, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 65 : 120;
      } else if (p < 0.72) {
        // Section 02 (Horizontal Work Gallery): Sweeps over to the RIGHT (0.76)
        const t = (p - 0.38) / 0.34;
        const startX = width * 0.24;
        const endX = width * (isMobile ? 0.65 : 0.76);
        targetX = startX + (endX - startX) * Math.min(t * 1.15, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 60 : 130;
      } else if (p < 0.90) {
        // Section 03 (Architectural Bento Matrix): Centers itself (0.50)
        const t = (p - 0.72) / 0.18;
        const startX = width * (isMobile ? 0.65 : 0.76);
        const endX = width * 0.50;
        targetX = startX + (endX - startX) * Math.min(t, 1);
        targetY = height * (0.50 + Math.sin(t * Math.PI) * 0.10);
        targetRadius = isMobile ? 70 : 135;
      } else {
        // Section 04 (Terminal Finale): Ascends softly into the top-center halo
        const t = (p - 0.90) / 0.10;
        targetX = width * 0.50;
        targetY = height * (0.50 - t * 0.20);
        targetRadius = isMobile ? 55 : 110;
      }

      // Smooth trajectory tracking
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      currentRadius += (targetRadius - currentRadius) * 0.055;

      // Handle Double-Click Figure-Eight Orbital Loop
      let drawX = currentX;
      let drawY = currentY;

      if (isOrbiting) {
        orbitProgress += 1 / ORBIT_DURATION_FRAMES;
        if (orbitProgress >= 1) {
          isOrbiting = false;
          orbitProgress = 0;
        } else {
          const theta = orbitProgress * Math.PI * 2;
          const a = width < 640 ? 110 : 210;
          const denom = 1 + Math.sin(theta) * Math.sin(theta);
          const loopX = (a * Math.SQRT2 * Math.cos(theta)) / denom;
          const loopY = (a * Math.SQRT2 * Math.sin(theta) * Math.cos(theta)) / denom;
          drawX = currentX + loopX;
          drawY = currentY + loopY;
        }
      }

      // Subtle Autonomous Breathing Float
      const floatX = Math.sin(time * 0.85) * (isMobile ? 7 : 14);
      const floatY = Math.cos(time * 1.1) * (isMobile ? 9 : 18);
      drawX += floatX;
      drawY += floatY;

      // Interactive Cursor Proximity Inversion
      const distToMouse = Math.hypot(mouseX - drawX, mouseY - drawY);
      const hoverThreshold = currentRadius * 1.45;
      const targetHover = distToMouse < hoverThreshold ? 1 : 0;
      hoverFactor += (targetHover - hoverFactor) * 0.1;

      // Click Elastic Pulse Physics
      clickScale += clickScaleVel;
      clickScaleVel += (1.0 - clickScale) * 0.18;
      clickScaleVel *= 0.72;
      const effectiveRadius = currentRadius * clickScale;

      // Emit Golden Stardust Trail
      const moveDist = Math.hypot(drawX - lastEmitX, drawY - lastEmitY);
      if (moveDist > 6 || Math.random() < 0.22) {
        trail.push({
          x: drawX + (Math.random() - 0.5) * effectiveRadius * 0.45,
          y: drawY + (Math.random() - 0.5) * effectiveRadius * 0.45,
          size: Math.random() * 2.8 + 1.2,
          alpha: 0.65,
          life: 0,
          maxLife: Math.floor(Math.random() * 25 + 30),
        });
        lastEmitX = drawX;
        lastEmitY = drawY;
      }

      // Render Stardust Trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const pt = trail[i];
        pt.life++;
        pt.alpha *= 0.94;
        pt.size *= 0.98;
        if (pt.life >= pt.maxLife || pt.alpha < 0.02) {
          trail.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${pt.alpha * 0.75})`;
        ctx.shadowColor = "rgba(0, 255, 135, 0.45)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Render Double-Click / Single-Click Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.93;
        sp.vy *= 0.93;
        sp.rot += sp.rotSpeed;
        sp.alpha = Math.max(0, 1 - sp.life / sp.maxLife);

        if (sp.life >= sp.maxLife || sp.alpha < 0.02) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;

        if (sp.isStar) {
          drawSparkleStar(ctx, sp.x, sp.y, sp.size, sp.rot);
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Render Shockwave Expansion Ring on Click
      if (shockwaveAlpha > 0.02) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(drawX, drawY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 135, ${shockwaveAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(0, 255, 135, 0.8)";
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();

        shockwaveRadius += 4.5;
        shockwaveAlpha *= 0.88;
      }

      // --- Optical Sphere Shading: Jade Glass & Chromatic Dispersion ---
      ctx.save();

      // Outer Volumetric Ambient Halo
      const outerGlow = ctx.createRadialGradient(
        drawX,
        drawY,
        effectiveRadius * 0.5,
        drawX,
        drawY,
        effectiveRadius * 2.2
      );
      if (hoverFactor > 0.05) {
        outerGlow.addColorStop(0, `rgba(56, 189, 248, ${0.40 * hoverFactor})`);
        outerGlow.addColorStop(0.5, `rgba(16, 185, 129, ${0.25 * hoverFactor})`);
        outerGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
      } else {
        outerGlow.addColorStop(0, "rgba(0, 255, 135, 0.32)");
        outerGlow.addColorStop(0.4, "rgba(16, 185, 129, 0.18)");
        outerGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
      }
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(drawX, drawY, effectiveRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Prismatic Inner Body Gradient
      const lx = drawX - effectiveRadius * 0.38;
      const ly = drawY - effectiveRadius * 0.38;
      const innerGrad = ctx.createRadialGradient(
        lx,
        ly,
        effectiveRadius * 0.05,
        drawX,
        drawY,
        effectiveRadius
      );

      if (hoverFactor > 0.05) {
        innerGrad.addColorStop(0, "#FFFFFF");
        innerGrad.addColorStop(0.2, "#E0F2FE");
        innerGrad.addColorStop(0.5, "#38BDF8");
        innerGrad.addColorStop(0.8, "#059669");
        innerGrad.addColorStop(1, "#022C22");
      } else {
        innerGrad.addColorStop(0, "#FFFFFF");
        innerGrad.addColorStop(0.25, "#A7F3D0");
        innerGrad.addColorStop(0.55, "#10B981");
        innerGrad.addColorStop(0.82, "#059669");
        innerGrad.addColorStop(1, "#022C22");
      }

      ctx.beginPath();
      ctx.arc(drawX, drawY, effectiveRadius, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.shadowColor = hoverFactor > 0.05 ? "rgba(56, 189, 248, 0.6)" : "rgba(0, 255, 135, 0.55)";
      ctx.shadowBlur = 24;
      ctx.fill();

      // Specular Glass Highlight Glint
      ctx.beginPath();
      ctx.ellipse(
        drawX - effectiveRadius * 0.28,
        drawY - effectiveRadius * 0.28,
        effectiveRadius * 0.34,
        effectiveRadius * 0.20,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      ctx.shadowColor = "#FFFFFF";
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointermove", handleMouseMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("dblclick", handleDblClick);
      window.removeEventListener("touchend", handleTouchEnd);
      st.kill();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
});

TravelingPrismaticSphere.displayName = "TravelingPrismaticSphere";
