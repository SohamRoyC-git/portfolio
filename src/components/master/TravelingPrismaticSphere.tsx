"use client";

import React, { useEffect, useRef } from "react";

interface StardustTrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

export const TravelingPrismaticSphere: React.FC = () => {
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

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const p = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      scrollRef.current.progress = Math.min(Math.max(p, 0), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let animId: number;

    // Smooth position interpolation state (Initial: Centered behind monumental hero name)
    let currentX = width * 0.5;
    let currentY = height * 0.46;
    let currentRadius = 140;

    // Stardust trail history
    const trail: StardustTrailParticle[] = [];
    let lastEmitX = currentX;
    let lastEmitY = currentY;

    const render = () => {
      const p = scrollRef.current.progress;

      ctx.clearRect(0, 0, width, height);

      // --- Autonomous Trajectory from Section to Section ---
      let targetX = width * 0.5;
      let targetY = height * 0.46;
      let targetRadius = 140;

      if (p < 0.16) {
        // Section 00 (Hero): Strictly in the CENTER directly behind "SOHAM ROYCHOUDHURY"
        targetX = width * 0.5;
        targetY = height * 0.46;
        targetRadius = 145;
      } else if (p < 0.36) {
        // Section 01 (Statement): Glides smoothly to the LEFT behind the kinetic quote
        const t = (p - 0.16) / 0.20;
        const startX = width * 0.5;
        const endX = width * 0.32;
        targetX = startX + (endX - startX) * Math.min(t, 1);
        targetY = height * 0.50;
        targetRadius = 125;
      } else if (p < 0.76) {
        // Section 02 (Horizontal Work Gallery): Glides to center-right behind the active orbital cards
        const t = (p - 0.36) / 0.40;
        const leftSide = width * 0.32;
        const rightSide = width > 1024 ? width * 0.62 : width * 0.5;
        targetX = leftSide + (rightSide - leftSide) * Math.min(t * 1.2, 1);
        targetY = height * 0.50;
        targetRadius = 140;
      } else if (p < 0.90) {
        // Section 03 (Blueprint): Glides back to the LEFT behind code telemetry
        const t = (p - 0.76) / 0.14;
        const rightSide = width > 1024 ? width * 0.62 : width * 0.5;
        const leftSide = width * 0.32;
        targetX = rightSide - (rightSide - leftSide) * Math.min(t * 1.3, 1);
        targetY = height * 0.50;
        targetRadius = 120;
      } else {
        // Section 04 (Terminal): Glides to the CENTER behind the dispatch contact cards
        const t = (p - 0.90) / 0.10;
        const leftSide = width * 0.32;
        targetX = leftSide + (width * 0.5 - leftSide) * Math.min(t * 1.2, 1);
        targetY = height * 0.52;
        targetRadius = 125;
      }

      // Calm, silk-smooth lerping (Zero wobble)
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      currentRadius += (targetRadius - currentRadius) * 0.055;

      const r = Math.max(currentRadius, 60);

      // --- Emit subtle luminous stardust trail on movement ---
      const dx = currentX - lastEmitX;
      const dy = currentY - lastEmitY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        lastEmitX = currentX;
        lastEmitY = currentY;
        trail.push({
          x: currentX + (Math.random() - 0.5) * 24,
          y: currentY + (Math.random() - 0.5) * 24,
          size: Math.random() * 2.8 + 1.2,
          alpha: 0.65,
          maxAlpha: 0.65,
          life: 0,
          maxLife: 38,
        });
      }

      // Render Stardust Trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const pt = trail[i];
        pt.life++;
        const lifeRatio = 1 - pt.life / pt.maxLife;
        if (lifeRatio <= 0) {
          trail.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(0, 255, 135, ${lifeRatio * pt.maxAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Draw Main Autonomous Emerald Orb ---
      ctx.save();
      ctx.translate(currentX, currentY);

      // Layer 1: Ambient Greenish Radial Bloom
      const bloomGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.7);
      bloomGrad.addColorStop(0, "rgba(0, 255, 135, 0.36)");
      bloomGrad.addColorStop(0.35, "rgba(16, 185, 129, 0.20)");
      bloomGrad.addColorStop(0.75, "rgba(5, 150, 105, 0.06)");
      bloomGrad.addColorStop(1, "rgba(250, 250, 249, 0)");

      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Layer 2: 3D Volumetric Greenish Gradient Sphere
      const sphereGrad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.04, 0, 0, r);
      sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      sphereGrad.addColorStop(0.2, "rgba(209, 250, 229, 0.88)");
      sphereGrad.addColorStop(0.48, "rgba(52, 211, 153, 0.48)");
      sphereGrad.addColorStop(0.75, "rgba(16, 185, 129, 0.34)");
      sphereGrad.addColorStop(0.95, "rgba(5, 150, 105, 0.16)");
      sphereGrad.addColorStop(1, "rgba(16, 185, 129, 0.02)");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Layer 3: Precision Optical Glass Hairline Rim
      const rimGrad = ctx.createLinearGradient(-r, -r, r, r);
      rimGrad.addColorStop(0, "rgba(0, 255, 135, 0.85)");
      rimGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.75)");
      rimGrad.addColorStop(1, "rgba(56, 189, 248, 0.48)");

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary Concentric Precision Hairline
      ctx.strokeStyle = "rgba(16, 185, 129, 0.16)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
