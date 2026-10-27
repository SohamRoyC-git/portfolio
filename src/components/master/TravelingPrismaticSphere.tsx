"use client";

import React, { useEffect, useRef } from "react";

interface StardustTrailParticle {
  x: number;
  y: number;
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

    // Mouse tracking for localized color inversion hover
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

    // Smooth hover transition factor (0 = normal, 1 = fully inverted)
    let hoverFactor = 0;

    // Stardust trail
    const trail: StardustTrailParticle[] = [];
    let lastEmitX = currentX;
    let lastEmitY = currentY;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Buttery smooth cursor lerp (luxurious inertia, zero harshness)
      if (targetMouseX > 0) {
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;
      }

      const p = scrollRef.current.progress;
      const isMobile = width < 640;

      // --- Alternating Trajectory (Left <-> Right for every section) ---
      let targetX = width * 0.5;
      let targetY = height * 0.46;
      let targetRadius = isMobile ? 75 : 135;

      if (p < 0.18) {
        // Section 00 (Hero): Moves dynamically from LEFT (0.36) to RIGHT (0.64) as you scroll down
        const t = p / 0.18;
        const leftX = width * 0.36;
        const rightX = width * 0.64;
        targetX = leftX + (rightX - leftX) * t;
        targetY = height * (0.42 + t * 0.08);
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.38) {
        // Section 01 (Statement): Sweeps sharply back to the LEFT (0.24) behind kinetic quote
        const t = (p - 0.18) / 0.20;
        const startX = width * 0.64;
        const endX = width * 0.24;
        targetX = startX + (endX - startX) * Math.min(t, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 65 : 120;
      } else if (p < 0.72) {
        // Section 02 (Horizontal Work Gallery): Sweeps over to the RIGHT (0.76) behind orbital cards
        const t = (p - 0.38) / 0.34;
        const startX = width * 0.24;
        const endX = width * (isMobile ? 0.65 : 0.76);
        targetX = startX + (endX - startX) * Math.min(t * 1.15, 1);
        targetY = height * 0.50;
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.88) {
        // Section 03 (Blueprint): Sweeps back to the LEFT (0.22) behind technical code matrix
        const t = (p - 0.72) / 0.16;
        const startX = width * (isMobile ? 0.65 : 0.76);
        const endX = width * (isMobile ? 0.30 : 0.22);
        targetX = startX + (endX - startX) * Math.min(t * 1.2, 1);
        targetY = height * 0.48;
        targetRadius = isMobile ? 65 : 115;
      } else {
        // Section 04 (Terminal): Sweeps to the RIGHT (0.70) then settles into CENTER (0.50)
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

      // Organic idle floating drift
      const floatX = Math.sin(time * 1.3) * (isMobile ? 16 : 32);
      const floatY = Math.cos(time * 1.0) * (isMobile ? 12 : 20);

      currentX += (targetX + floatX - currentX) * 0.055;
      currentY += (targetY + floatY - currentY) * 0.055;
      currentRadius += (targetRadius - currentRadius) * 0.055;

      const r = Math.max(currentRadius, 50);

      // --- Cursor Distance Check & Inversion Factor ---
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isCursorInside = dist < r * 1.35;

      if (isCursorInside) {
        hoverFactor += (1 - hoverFactor) * 0.08;
      } else {
        hoverFactor += (0 - hoverFactor) * 0.08;
      }

      // Stardust trail update
      const distMoved = Math.hypot(currentX - lastEmitX, currentY - lastEmitY);
      if (distMoved > 7) {
        lastEmitX = currentX;
        lastEmitY = currentY;
        if (trail.length < 12) {
          trail.push({
            x: currentX + (Math.random() - 0.5) * 20,
            y: currentY + (Math.random() - 0.5) * 20,
            size: Math.random() * 2.5 + 1.2,
            alpha: 0.6,
            life: 0,
            maxLife: 32,
          });
        }
      }

      // Render stardust trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const pt = trail[i];
        pt.life++;
        const ratio = 1 - pt.life / pt.maxLife;
        if (ratio <= 0) {
          trail.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(0, 255, 135, ${ratio * pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * ratio, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Draw Optical Sphere ---
      ctx.save();
      ctx.translate(currentX, currentY);

      // 1. Ambient Greenish Radial Bloom
      const bloomGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.7);
      bloomGrad.addColorStop(0, "rgba(0, 255, 135, 0.35)");
      bloomGrad.addColorStop(0.35, "rgba(16, 185, 129, 0.20)");
      bloomGrad.addColorStop(0.75, "rgba(5, 150, 105, 0.06)");
      bloomGrad.addColorStop(1, "rgba(250, 250, 249, 0)");

      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base 3D Volumetric Greenish Gradient Sphere (Always pure emerald - never changes as a whole)
      const sphereGrad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.04, 0, 0, r);
      sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      sphereGrad.addColorStop(0.18, "rgba(209, 250, 229, 0.92)");
      sphereGrad.addColorStop(0.48, "rgba(52, 211, 153, 0.52)");
      sphereGrad.addColorStop(0.75, "rgba(16, 185, 129, 0.36)");
      sphereGrad.addColorStop(0.95, "rgba(5, 150, 105, 0.18)");
      sphereGrad.addColorStop(1, "rgba(16, 185, 129, 0.02)");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // 3. Precision Optical Glass Hairline Rim
      const rimGrad = ctx.createLinearGradient(-r, -r, r, r);
      rimGrad.addColorStop(0, "rgba(0, 255, 135, 0.85)");
      rimGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.75)");
      rimGrad.addColorStop(1, "rgba(56, 189, 248, 0.55)");

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Outer concentric ring
      ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.18, 0, Math.PI * 2);
      ctx.stroke();

      // --- 4. SOFT BUTTERY INVERTED COLOR AURA (Silky, feathered, zero harsh dots or rings) ---
      if (hoverFactor > 0.01) {
        // Clip strictly to the sphere geometry so it stays ONLY inside the sphere
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.clip();

        // Local cursor coordinates relative to sphere center
        const localX = mouseX - currentX;
        const localY = mouseY - currentY;

        // Soft, diffused feathered aura (radius ~52px with dreamy soft falloff)
        const softAuraRadius = 52;

        // Subtle, mathematical difference blend for a soft, silky inverted glow
        ctx.globalCompositeOperation = "difference";

        const softGlow = ctx.createRadialGradient(
          localX,
          localY,
          0,
          localX,
          localY,
          softAuraRadius
        );
        // Soft, progressive feathered falloff: gentle, dreamy, buttery
        softGlow.addColorStop(0, `rgba(255, 255, 255, ${hoverFactor * 0.48})`);
        softGlow.addColorStop(0.35, `rgba(255, 255, 255, ${hoverFactor * 0.32})`);
        softGlow.addColorStop(0.70, `rgba(255, 255, 255, ${hoverFactor * 0.12})`);
        softGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = softGlow;
        ctx.beginPath();
        ctx.arc(localX, localY, softAuraRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

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
