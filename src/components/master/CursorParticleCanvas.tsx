"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export const CursorParticleCanvas: React.FC = () => {
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

    const particles: Particle[] = [];
    const colors = [
      "rgba(0, 255, 135,",   // Neon Mint
      "rgba(16, 185, 129,",  // Luminous Emerald
      "rgba(52, 211, 153,",  // Soft Jade
      "rgba(56, 189, 248,",  // Celestial Cyan
      "rgba(255, 255, 255,", // Specular White
    ];

    let lastX = -100;
    let lastY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastX = x;
      lastY = y;

      const count = Math.min(Math.floor(speed * 0.3) + 1, 5);
      for (let i = 0; i < count; i++) {
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        const maxLife = Math.random() * 45 + 25;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 1.5 + 0.3;

        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * velocity + (dx * 0.05),
          vy: Math.sin(angle) * velocity + (dy * 0.05),
          size: Math.random() * 3 + 1,
          alpha: 0,
          maxAlpha: Math.random() * 0.7 + 0.3,
          color: colorPrefix,
          life: 0,
          maxLife,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (p.life < p.maxLife * 0.3) {
          p.alpha = (p.life / (p.maxLife * 0.3)) * p.maxAlpha;
        } else {
          p.alpha = ((p.maxLife - p.life) / (p.maxLife * 0.7)) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 2.5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      aria-hidden="true"
    />
  );
};
