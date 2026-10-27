"use client";

import React, { useEffect, useRef } from "react";

interface DropletParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
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

    // Mouse tracking for liquid cursor interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let isHovered = false;
    let liquidDeform = 0; // 0 to 1 liquid wobble intensity

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll progress listener
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

    // Smooth position interpolation state
    let currentX = width * 0.42;
    let currentY = height * 0.44;
    let currentRadius = width < 640 ? 75 : 135;

    // Droplets pool
    const droplets: DropletParticle[] = [];

    const render = () => {
      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      const p = scrollRef.current.progress;
      const isMobile = width < 640;

      // --- Alternating Trajectory (Left <-> Right for every section) ---
      let targetX = width * 0.5;
      let targetY = height * 0.46;
      let targetRadius = isMobile ? 75 : 135;

      if (p < 0.18) {
        // Section 00 (Hero): Moves dynamically from LEFT (0.36) to RIGHT (0.64) as you scroll down the hero
        const t = p / 0.18;
        const leftX = width * 0.36;
        const rightX = width * 0.64;
        targetX = leftX + (rightX - leftX) * t;
        targetY = height * (0.42 + t * 0.08);
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.38) {
        // Section 01 (Statement): Sweeps sharply back to the LEFT (0.24) behind the kinetic quote
        const t = (p - 0.18) / 0.20;
        const startX = width * 0.64;
        const endX = width * 0.24;
        targetX = startX + (endX - startX) * Math.min(t, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 65 : 120;
      } else if (p < 0.72) {
        // Section 02 (Horizontal Work Gallery): Sweeps over to the RIGHT (0.76) behind the orbital cards
        const t = (p - 0.38) / 0.34;
        const startX = width * 0.24;
        const endX = width * (isMobile ? 0.65 : 0.76);
        targetX = startX + (endX - startX) * Math.min(t * 1.15, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.88) {
        // Section 03 (Blueprint): Sweeps back to the LEFT (0.22) behind technical matrix code
        const t = (p - 0.72) / 0.16;
        const startX = width * (isMobile ? 0.65 : 0.76);
        const endX = width * (isMobile ? 0.30 : 0.22);
        targetX = startX + (endX - startX) * Math.min(t * 1.2, 1);
        targetY = height * 0.48;
        targetRadius = isMobile ? 65 : 115;
      } else {
        // Section 04 (Terminal): Sweeps to the RIGHT (0.70) then settles into the CENTER (0.50)
        const t = (p - 0.88) / 0.12;
        const startX = width * (isMobile ? 0.30 : 0.22);
        const midX = width * 0.70;
        const endX = width * 0.50;
        if (t < 0.5) {
          targetX = startX + (midX - startX) * (t * 2);
        } else {
          targetX = midX + (endX - midX) * ((t - 0.5) * 2);
        }
        targetY = height * 0.52;
        targetRadius = isMobile ? 70 : 125;
      }

      // Add continuous organic breathing & floating drift so it NEVER stays statically in one spot
      const floatX = Math.sin(time * 1.4) * (isMobile ? 18 : 36);
      const floatY = Math.cos(time * 1.1) * (isMobile ? 12 : 22);

      currentX += (targetX + floatX - currentX) * 0.06;
      currentY += (targetY + floatY - currentY) * 0.06;
      currentRadius += (targetRadius - currentRadius) * 0.06;

      const r = Math.max(currentRadius, 50);

      // --- Liquid Cursor Hover Effect & Surface Deformation ---
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hoverThreshold = r * 1.7;

      if (dist < hoverThreshold) {
        isHovered = true;
        const proximity = 1 - dist / hoverThreshold;
        liquidDeform += (proximity - liquidDeform) * 0.12;

        // Emit subtle liquid micro-droplets when touching the surface
        if (Math.random() < 0.25 && droplets.length < 15) {
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;
          droplets.push({
            x: currentX + Math.cos(angle) * r,
            y: currentY + Math.sin(angle) * r,
            vx: Math.cos(angle) * (Math.random() * 2 + 1),
            vy: Math.sin(angle) * (Math.random() * 2 + 1),
            size: Math.random() * 3 + 2,
            alpha: 0.8,
            life: 0,
            maxLife: 28,
          });
        }
      } else {
        isHovered = false;
        liquidDeform += (0 - liquidDeform) * 0.08;
      }

      // --- Render Liquid Droplets ---
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.life++;
        const ratio = 1 - d.life / d.maxLife;
        if (ratio <= 0) {
          droplets.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(0, 255, 135, ${ratio * d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * ratio, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Draw Deformable Liquid Prismatic Sphere ---
      ctx.save();
      ctx.translate(currentX, currentY);

      // Liquid pull angle toward cursor
      const pullAngle = Math.atan2(dy, dx);
      const pullDistance = Math.min(dist * 0.15, 25) * liquidDeform;

      // 1. Ambient Greenish Radial Bloom (Expands on liquid hover)
      const bloomRadius = r * (1.7 + liquidDeform * 0.3);
      const bloomGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, bloomRadius);
      bloomGrad.addColorStop(0, `rgba(0, 255, 135, ${0.35 + liquidDeform * 0.25})`);
      bloomGrad.addColorStop(0.35, `rgba(16, 185, 129, ${0.22 + liquidDeform * 0.15})`);
      bloomGrad.addColorStop(0.75, "rgba(5, 150, 105, 0.06)");
      bloomGrad.addColorStop(1, "rgba(250, 250, 249, 0)");

      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(0, 0, bloomRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Liquid Surface Path using Multi-Harmonic Ripple Polygon
      const numPoints = 36;
      ctx.beginPath();

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;

        // Mercury fluid harmonic ripples
        const wave1 = Math.sin(angle * 4 + time * 5) * (liquidDeform * 14);
        const wave2 = Math.cos(angle * 6 - time * 4) * (liquidDeform * 8);

        // Surface pull toward cursor
        const angleDiff = Math.cos(angle - pullAngle);
        const directionalStretch = Math.max(angleDiff, 0) * pullDistance;

        const currentPtRadius = r + wave1 + wave2 + directionalStretch;
        const px = Math.cos(angle) * currentPtRadius;
        const py = Math.sin(angle) * currentPtRadius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();

      // 3D Liquid Volumetric Fluid Gradient (Light source dynamically tracks cursor)
      const lightOffsetX = -r * 0.28 + (isHovered ? (dx / hoverThreshold) * 20 : 0);
      const lightOffsetY = -r * 0.28 + (isHovered ? (dy / hoverThreshold) * 20 : 0);

      const sphereGrad = ctx.createRadialGradient(
        lightOffsetX,
        lightOffsetY,
        r * 0.04,
        0,
        0,
        r * 1.05
      );
      sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      sphereGrad.addColorStop(0.18, "rgba(209, 250, 229, 0.92)");
      sphereGrad.addColorStop(0.45, "rgba(52, 211, 153, 0.55)");
      sphereGrad.addColorStop(0.75, "rgba(16, 185, 129, 0.38)");
      sphereGrad.addColorStop(0.95, "rgba(5, 150, 105, 0.20)");
      sphereGrad.addColorStop(1, "rgba(16, 185, 129, 0.04)");

      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Precision Optical Hairline Rim with Liquid Shimmer
      const rimGrad = ctx.createLinearGradient(-r, -r, r, r);
      rimGrad.addColorStop(0, `rgba(0, 255, 135, ${0.85 + liquidDeform * 0.15})`);
      rimGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.75)");
      rimGrad.addColorStop(1, "rgba(56, 189, 248, 0.55)");

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.6 + liquidDeform * 0.8;
      ctx.stroke();

      // Secondary Concentric Precision Hairline Ring (Ripples when liquid is disturbed)
      const rippleRadius = r * (1.18 + Math.sin(time * 3) * 0.04 + liquidDeform * 0.1);
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 + liquidDeform * 0.2})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, rippleRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
