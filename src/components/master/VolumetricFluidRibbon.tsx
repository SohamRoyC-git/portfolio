"use client";

import React, { useEffect, useRef } from "react";

interface FloatingPrism {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  color: string;
  speedY: number;
}

export const VolumetricFluidRibbon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Mouse tilt / interactive parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll progress
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Floating micro-prisms (from Screenshot 1)
    const prisms: FloatingPrism[] = Array.from({ length: 10 }).map((_, i) => ({
      x: (width * (i + 1)) / 11 + (Math.random() - 0.5) * 60,
      y: (height * ((i % 4) + 1)) / 5 + (Math.random() - 0.5) * 100,
      size: Math.random() * 5 + 6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: i % 2 === 0 ? "rgba(217, 70, 239, 0.45)" : "rgba(249, 115, 22, 0.45)",
      speedY: (Math.random() - 0.5) * 0.35,
    }));

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      const mouseNormX = (mouseX / width - 0.5) * 2;
      const mouseNormY = (mouseY / height - 0.5) * 2;

      const isMobile = width < 768;
      const ribbonWidth = isMobile ? Math.min(width * 0.22, 90) : Math.min(width * 0.15, 185);
      const numPoints = isMobile ? 160 : 300;

      // 1. Ambient Background Atmosphere (Luminous Magenta & Warm Coral Bloom)
      ctx.save();
      const ambientGlow = ctx.createRadialGradient(
        width * 0.62 + mouseNormX * 25,
        height * 0.42 + mouseNormY * 20,
        20,
        width * 0.62,
        height * 0.42,
        width * 0.58
      );
      ambientGlow.addColorStop(0, "rgba(217, 70, 239, 0.18)");
      ambientGlow.addColorStop(0.35, "rgba(249, 115, 22, 0.14)");
      ambientGlow.addColorStop(0.7, "rgba(124, 58, 237, 0.06)");
      ambientGlow.addColorStop(1, "rgba(250, 250, 249, 0)");

      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Render 3D Volumetric Extruded Wave Ribbon (Screenshot 1 curve aesthetic)
      ctx.save();

      // Soft volumetric drop shadow under the 3D ribbon
      ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
      ctx.shadowBlur = isMobile ? 20 : 38;
      ctx.shadowOffsetY = isMobile ? 12 : 22;

      // Calculate scroll factor: ribbon softens when scrolling deep into text sections
      const scrollRatio = Math.min(scrollY / (height * 1.5), 1);
      const globalOpacity = Math.max(0.88 - scrollRatio * 0.4, 0.48);
      ctx.globalAlpha = globalOpacity;

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints; // 0.0 to 1.0

        // Parametric curve coordinates sweeping from left to right
        let x = -width * 0.06 + t * (width * 1.12);

        // Dynamic 3D Sine Wave harmonics mirroring the user's reference screenshot
        // Arching crest on left -> dipping smoothly -> surging high on right
        let wave1 = Math.sin(t * Math.PI * 2.2 - time * 0.7) * (height * 0.24);
        let wave2 = Math.cos(t * Math.PI * 3.4 + time * 0.4) * (height * 0.08);

        // Adjust curve trajectory so the hero center text "SOHAM ROYCHOUDHURY" has breathing room
        // The ribbon gracefully cradles the text from above and behind
        let y =
          height * 0.42 +
          wave1 +
          wave2 +
          mouseNormY * 20 * (1 - t);

        if (isMobile) {
          // On mobile, keep the wave gently undulating along the upper and right perimeter
          y = height * 0.38 + wave1 * 0.75 + wave2 * 0.6;
        }

        // Ribbon thickness with subtle natural tapering at ends
        const taper = Math.sin(t * Math.PI);
        const radius = Math.max(ribbonWidth * (0.6 + 0.4 * taper), 20);

        // Color interpolation based on position:
        // Flame Coral (#F97316) -> Vivid Magenta (#D946EF) -> Deep Royal Violet (#7C3AED) -> Radiant Gold (#FBBF24)
        let primaryColor = "#F97316";
        let secondaryColor = "#D946EF";
        let highlightColor = "#FEF08A";

        if (t < 0.28) {
          // Flame Coral into Neon Magenta
          const subT = t / 0.28;
          primaryColor = `rgba(${Math.round(255 - subT * 38)}, ${Math.round(115 - subT * 45)}, ${Math.round(22 + subT * 180)}, 0.90)`;
          secondaryColor = `rgba(236, 72, 153, 0.85)`;
          highlightColor = "rgba(254, 215, 170, 0.95)";
        } else if (t < 0.65) {
          // Neon Magenta into Royal Violet
          const subT = (t - 0.28) / 0.37;
          primaryColor = `rgba(${Math.round(217 - subT * 93)}, ${Math.round(70 - subT * 12)}, ${Math.round(239 - subT * 2)}, 0.92)`;
          secondaryColor = `rgba(${Math.round(139 - subT * 40)}, ${Math.round(92 - subT * 25)}, ${Math.round(246 - subT * 10)}, 0.88)`;
          highlightColor = "rgba(245, 208, 254, 0.95)";
        } else if (t < 0.88) {
          // Royal Violet surging into Vivid Sunburst Yellow
          const subT = (t - 0.65) / 0.23;
          primaryColor = `rgba(${Math.round(124 + subT * 127)}, ${Math.round(58 + subT * 133)}, ${Math.round(237 - subT * 201)}, 0.94)`;
          secondaryColor = `rgba(${Math.round(245 + subT * 6)}, ${Math.round(158 + subT * 33)}, ${Math.round(11 + subT * 25)}, 0.90)`;
          highlightColor = "rgba(254, 240, 138, 0.98)";
        } else {
          // Radiant Gold into Coral Pink
          const subT = (t - 0.88) / 0.12;
          primaryColor = `rgba(${Math.round(251 - subT * 7)}, ${Math.round(191 - subT * 76)}, ${Math.round(36 + subT * 58)}, 0.92)`;
          secondaryColor = `rgba(244, 63, 94, 0.88)`;
          highlightColor = "rgba(254, 215, 170, 0.95)";
        }

        // Draw 3D cylindrical volumetric cross section with specular light
        const diskGrad = ctx.createLinearGradient(
          x - radius * 0.35,
          y - radius,
          x + radius * 0.35,
          y + radius
        );
        diskGrad.addColorStop(0, highlightColor);
        diskGrad.addColorStop(0.22, secondaryColor);
        diskGrad.addColorStop(0.65, primaryColor);
        diskGrad.addColorStop(1, "rgba(88, 28, 135, 0.75)");

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.88, (t * 1.5) + Math.sin(time + t), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 3. Render floating micro-prisms (from Screenshot 1)
      ctx.save();
      for (const p of prisms) {
        p.y += p.speedY;
        p.rot += p.rotSpeed;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
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
