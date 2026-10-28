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

    // Elastic click bounce & optical shockwave ring
    let clickScale = 1.0;
    let clickScaleVel = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;

    // Double-Click Orbital Escape Loop (Figure-eight Lemniscate)
    let isOrbiting = false;
    let orbitProgress = 0; // 0 to 1
    const ORBIT_DURATION_FRAMES = 115; // ~1.9 seconds at 60fps

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

    // Touch tap and double-tap handler for mobile screens
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

    // Helper to draw a 4-pointed diamond sparkle star
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
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor lerp
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
        // Section 00 (Hero): Moves dynamically from LEFT (0.36) to RIGHT (0.64)
        const t = p / 0.18;
        const leftX = width * 0.36;
        const rightX = width * 0.64;
        targetX = leftX + (rightX - leftX) * t;
        targetY = height * (0.42 + t * 0.08);
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.38) {
        // Section 01 (Statement): Sweeps sharply back to the LEFT (0.24)
        const t = (p - 0.18) / 0.20;
        const startX = width * 0.64;
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
        targetRadius = isMobile ? 75 : 135;
      } else if (p < 0.88) {
        // Section 03 (Blueprint): Sweeps back to the LEFT (0.22)
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

      // --- Figure-Eight (Lemniscate) Orbital Escape Math ---
      let orbitOffsetX = 0;
      let orbitOffsetY = 0;
      let orbitScaleFactor = 1.0;

      if (isOrbiting) {
        orbitProgress += 1 / ORBIT_DURATION_FRAMES;
        if (orbitProgress >= 1.0) {
          isOrbiting = false;
          orbitProgress = 0;

          // Arrival celebration shockwave + sparkles
          shockwaveRadius = currentRadius * 0.9;
          shockwaveAlpha = 0.85;
          clickScale = 0.88;
          clickScaleVel = 0.09;

          for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            sparkles.push({
              x: currentX,
              y: currentY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 5 + 3,
              rot: Math.random() * Math.PI * 2,
              rotSpeed: (Math.random() - 0.5) * 0.12,
              alpha: 1.0,
              life: 0,
              maxLife: 35,
              color: "#00FF87",
              isStar: true,
            });
          }
        } else {
          // Smooth sinusoidal ease-in-out trajectory
          const eased = 0.5 - 0.5 * Math.cos(orbitProgress * Math.PI);
          const theta = eased * Math.PI * 2;
          const ampX = isMobile ? width * 0.35 : width * 0.38;
          const ampY = isMobile ? height * 0.22 : height * 0.26;

          // Lemniscate figure-8 parametric equation
          orbitOffsetX = ampX * Math.sin(theta);
          orbitOffsetY = ampY * Math.sin(theta * 2);

          // Dynamic 3D parallax zoom
          orbitScaleFactor = 1.0 + 0.22 * Math.sin(orbitProgress * Math.PI);

          // Emit dense comet stardust tail during orbital flight
          if (trail.length < 36) {
            for (let k = 0; k < 2; k++) {
              trail.push({
                x: currentX + (Math.random() - 0.5) * 16,
                y: currentY + (Math.random() - 0.5) * 16,
                size: Math.random() * 3.5 + 2.0,
                alpha: 0.85,
                life: 0,
                maxLife: 40,
              });
            }
          }
        }
      }

      // Organic idle floating drift
      const floatX = Math.sin(time * 1.3) * (isMobile ? 16 : 32);
      const floatY = Math.cos(time * 1.0) * (isMobile ? 12 : 20);

      const finalTargetX = targetX + orbitOffsetX;
      const finalTargetY = targetY + orbitOffsetY;

      // Higher lerp responsiveness during orbital flight so it tracks the figure-8 energetically
      const lerpSpeed = isOrbiting ? 0.18 : 0.055;
      currentX += (finalTargetX + floatX - currentX) * lerpSpeed;
      currentY += (finalTargetY + floatY - currentY) * lerpSpeed;
      currentRadius += (targetRadius - currentRadius) * 0.055;

      // Elastic rebound physics on click & orbit
      clickScale += clickScaleVel;
      clickScaleVel += (1.0 - clickScale) * 0.18;
      clickScaleVel *= 0.78; // damping

      const r = Math.max(currentRadius * clickScale * orbitScaleFactor, 45);

      // --- Cursor Distance Check & Inversion Factor ---
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isCursorInside = dist < r * 1.35;

      if (isCursorInside) {
        hoverFactor += (1 - hoverFactor) * 0.14;
      } else {
        hoverFactor += (0 - hoverFactor) * 0.08;
      }

      // Stardust trail update for normal flight
      if (!isOrbiting) {
        const distMoved = Math.hypot(currentX - lastEmitX, currentY - lastEmitY);
        if (distMoved > 7) {
          lastEmitX = currentX;
          lastEmitY = currentY;
          if (trail.length < 16) {
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

      // 2. Base 3D Volumetric Jade / Sea-Glass Crystal Orb (No pure white spots, completely smooth emerald/mint volume)
      const sphereGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.15, r * 0.08, 0, 0, r);
      sphereGrad.addColorStop(0, "rgba(110, 231, 183, 0.85)"); // Luminous mint (#6EE7B7) - inverts to cosmic violet
      sphereGrad.addColorStop(0.32, "rgba(52, 211, 153, 0.70)"); // Vibrant spring emerald (#34D399)
      sphereGrad.addColorStop(0.68, "rgba(16, 185, 129, 0.48)"); // Core emerald (#10B981)
      sphereGrad.addColorStop(0.92, "rgba(5, 150, 105, 0.28)"); // Deep jade emerald (#059669)
      sphereGrad.addColorStop(1, "rgba(4, 120, 87, 0.05)");

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

      // --- 4. BRIGHTER & LARGER SOFT INVERTED COLOR AURA (Restricted ONLY to within the sphere) ---
      // Under difference composite, mint/emerald smoothly inverts into pure velvet lavender & violet with NO black spots!
      if (hoverFactor > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.clip();

        const localX = mouseX - currentX;
        const localY = mouseY - currentY;
        const softAuraRadius = Math.max(r * 0.72, 82);

        ctx.globalCompositeOperation = "difference";

        const softGlow = ctx.createRadialGradient(
          localX,
          localY,
          0,
          localX,
          localY,
          softAuraRadius
        );
        softGlow.addColorStop(0, `rgba(255, 255, 255, ${hoverFactor * 0.92})`);
        softGlow.addColorStop(0.28, `rgba(255, 255, 255, ${hoverFactor * 0.75})`);
        softGlow.addColorStop(0.60, `rgba(255, 255, 255, ${hoverFactor * 0.42})`);
        softGlow.addColorStop(0.85, `rgba(255, 255, 255, ${hoverFactor * 0.15})`);
        softGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = softGlow;
        ctx.beginPath();
        ctx.arc(localX, localY, softAuraRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // --- 5. EXPANDING OPTICAL SHOCKWAVE PULSE ON CLICK OR LAUNCH ---
      if (shockwaveAlpha > 0.01) {
        shockwaveRadius += 3.2;
        shockwaveAlpha *= 0.92;

        ctx.save();
        ctx.strokeStyle = `rgba(0, 255, 135, ${shockwaveAlpha * 0.75})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(0, 0, shockwaveRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary subtle outer ripple
        ctx.strokeStyle = `rgba(56, 189, 248, ${shockwaveAlpha * 0.45})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, shockwaveRadius * 1.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // --- 6. RENDER CLICK SPARKLES & 4-POINTED TWINKLE STARS ---
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94; // friction
        s.vy *= 0.94;
        s.rot += s.rotSpeed;
        s.life++;

        const ratio = 1 - s.life / s.maxLife;
        if (ratio <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        const currentAlpha = ratio * s.alpha;

        if (s.isStar) {
          // Radiant 4-pointed diamond twinkle star
          ctx.fillStyle = s.color;
          ctx.globalAlpha = currentAlpha;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          drawSparkleStar(ctx, s.x, s.y, s.size * ratio, s.rot);
        } else {
          // Prismatic ember particle
          ctx.fillStyle = s.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * ratio, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

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
