"use client";

import React, { useEffect, useRef } from "react";

export const PuturePerspectiveGrid: React.FC = () => {
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

    // Particle field
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const NUM_PARTICLES = 45;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep spatial gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#12141F");
      bgGrad.addColorStop(0.5, "#0D0E14");
      bgGrad.addColorStop(1, "#07080B");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective Grid Lines with Crosshairs
      const horizonY = height * 0.55;
      const gridSize = 64;

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;

      // Vertical perspective lines converging to horizon
      const numLines = 24;
      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const topX = width / 2 + (i * width) / (numLines * 1.5);
        const bottomX = width / 2 + (i * width * 1.8) / numLines;

        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let y = horizonY; y < height; y += (y - horizonY + 20) * 0.22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Draw coordinate crosshairs (+) at intersections
        for (let x = (time * 10) % gridSize; x < width; x += gridSize * 2) {
          ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
          ctx.font = "8px monospace";
          ctx.fillText("+", x, y + 3);
        }
      }
      ctx.restore();

      // Ambient particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity * (0.6 + Math.sin(time + p.x) * 0.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};
