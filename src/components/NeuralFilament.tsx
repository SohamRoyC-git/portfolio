"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Sparkles, Activity } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface NodePoint {
  id: string;
  name: string;
  code: string;
  yRatio: number; // 0 to 1 down the document
}

const SECTION_NODES: NodePoint[] = [
  { id: "hero", name: "SYNAPSE ORIGIN", code: "CH.01", yRatio: 0.05 },
  { id: "journey", name: "FOUNDATION TRACE", code: "CH.02", yRatio: 0.18 },
  { id: "experience", name: "GLOBAL LATVIA LINK", code: "CH.03", yRatio: 0.32 },
  { id: "work", name: "SPATIAL VINYL CORE", code: "CH.04", yRatio: 0.50 },
  { id: "skills", name: "LOGIC LAB MATRIX", code: "CH.05", yRatio: 0.68 },
  { id: "education", name: "ACADEMIC VECTOR", code: "CH.06", yRatio: 0.82 },
  { id: "contact", name: "TERMINAL BEACON", code: "CH.07", yRatio: 0.95 },
];

export const NeuralFilament: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<NodePoint>(SECTION_NODES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Physics & Animation state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const scrollRef = useRef({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    progress: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking for magnetic attraction
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Particle & Wave trail history
    const NUM_SEGMENTS = 40;
    const trail: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      trail.push({
        x: width * 0.85,
        y: (height / NUM_SEGMENTS) * i,
        vx: 0,
        vy: 0,
      });
    }

    // Spark pulses that travel along the filament
    interface Pulse {
      segment: number;
      speed: number;
      brightness: number;
      size: number;
    }
    const pulses: Pulse[] = [
      { segment: 0, speed: 0.35, brightness: 1, size: 3.5 },
      { segment: 15, speed: 0.25, brightness: 0.8, size: 2.5 },
      { segment: 30, speed: 0.4, brightness: 0.9, size: 3.0 },
    ];

    let lastScrollY = window.scrollY;
    let time = 0;

    const render = () => {
      time += 0.02;

      // Calculate scroll progress & velocity
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScroll / docHeight, 0), 1) : 0;
      const deltaScroll = currentScroll - lastScrollY;
      lastScrollY = currentScroll;

      scrollRef.current.velocity += (deltaScroll - scrollRef.current.velocity) * 0.15;
      scrollRef.current.progress = progress;
      setScrollProgress(progress);

      // Determine active chapter node
      const currentNode =
        SECTION_NODES.reduce((prev, curr) => {
          return Math.abs(curr.yRatio - progress) < Math.abs(prev.yRatio - progress) ? curr : prev;
        }, SECTION_NODES[0]);

      setActiveNode(currentNode);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Dynamic path calculation:
      // The filament swoops organically down the screen on the right flank,
      // weaving inward toward the center based on scroll progression and section landmarks
      const basePathX = width > 1024 ? width * 0.88 : width * 0.93;
      const waveAmplitude = Math.min(Math.abs(scrollRef.current.velocity) * 1.8 + 24, 80);

      // Update head point
      const headTargetX =
        basePathX +
        Math.sin(time * 1.5 + progress * 6) * waveAmplitude +
        (mouseRef.current.active
          ? Math.max(Math.min((mouseRef.current.x - basePathX) * 0.18, 50), -50)
          : 0);

      const headTargetY =
        height * 0.15 +
        progress * (height * 0.7) +
        Math.cos(time * 1.2) * 12;

      // Relax trail towards targets
      trail[0].x += (headTargetX - trail[0].x) * 0.25;
      trail[0].y += (headTargetY - trail[0].y) * 0.25;

      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const prev = trail[i - 1];
        const curr = trail[i];

        const targetX = prev.x + Math.sin(time + i * 0.25) * (waveAmplitude * 0.35);
        const targetY = prev.y + (height / NUM_SEGMENTS) * 0.85;

        curr.x += (targetX - curr.x) * 0.18;
        curr.y += (targetY - curr.y) * 0.18;
      }

      // Draw outer neural aura / glow
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < NUM_SEGMENTS - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      ctx.strokeStyle = "rgba(249, 115, 22, 0.12)";
      ctx.lineWidth = 14 + Math.min(Math.abs(scrollRef.current.velocity) * 0.5, 12);
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw secondary harmonic filament (electric ember)
      ctx.beginPath();
      ctx.moveTo(trail[0].x + 3, trail[0].y);
      for (let i = 1; i < NUM_SEGMENTS - 1; i++) {
        const offset = Math.sin(time * 2 + i * 0.4) * 6;
        const xc = (trail[i].x + trail[i + 1].x) / 2 + offset;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x + offset, trail[i].y, xc, yc);
      }
      ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw primary high-intensity neural filament
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < NUM_SEGMENTS - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#F97316");
      grad.addColorStop(0.5, "#FB923C");
      grad.addColorStop(1, "#EA580C");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();

      // Draw Synaptic Pulses traveling along the filament
      pulses.forEach((pulse) => {
        pulse.segment = (pulse.segment + pulse.speed) % (NUM_SEGMENTS - 1);
        const idx = Math.floor(pulse.segment);
        const frac = pulse.segment - idx;
        const p1 = trail[idx];
        const p2 = trail[idx + 1] || p1;

        const px = p1.x + (p2.x - p1.x) * frac;
        const py = p1.y + (p2.y - p1.y) * frac;

        // Pulse glow
        const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 3.5);
        pulseGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        pulseGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.85)");
        pulseGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

        ctx.fillStyle = pulseGrad;
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // White core
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Leading Synapse Core (Active interactive node at trail head)
      const head = trail[0];
      const corePulse = Math.sin(time * 4) * 2;
      const coreSize = 9 + corePulse;

      // Aura
      const headAura = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, coreSize * 3);
      headAura.addColorStop(0, "rgba(249, 115, 22, 0.45)");
      headAura.addColorStop(0.6, "rgba(249, 115, 22, 0.1)");
      headAura.addColorStop(1, "rgba(249, 115, 22, 0)");
      ctx.fillStyle = headAura;
      ctx.beginPath();
      ctx.arc(head.x, head.y, coreSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Outer rotating reticle ring
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(time * 1.5);
      ctx.strokeStyle = "rgba(249, 115, 22, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, coreSize + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner glowing core
      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.arc(head.x, head.y, coreSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(head.x, head.y, coreSize * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Micro circuit sparks radiating from the core
      for (let s = 0; s < 4; s++) {
        const sparkAngle = time * 2 + (s * Math.PI) / 2;
        const sparkDist = 18 + Math.sin(time * 3 + s) * 6;
        const sx = head.x + Math.cos(sparkAngle) * sparkDist;
        const sy = head.y + Math.sin(sparkAngle) * sparkDist;

        ctx.strokeStyle = "rgba(249, 115, 22, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.fillStyle = "#FB923C";
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* 60fps Dynamic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Persistent Neural Telemetry HUD Pill (Floating beside the filament) */}
      <aside 
        aria-label="Scroll telemetry"
        className="pointer-events-auto absolute bottom-8 right-6 md:right-10 flex items-center gap-3 px-3.5 py-2 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E9E7E3] shadow-[0_8px_24px_rgba(32,33,36,0.08)] transition-all duration-300 hover:border-[#F97316]/50 group cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
          <span className="absolute w-4 h-4 rounded-full bg-[#F97316]/30 animate-ping" />
        </div>

        {/* Section Telemetry & Percentage */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#F97316] tracking-wider">
              {activeNode.code}
            </span>
            <span className="font-mono text-[10px] font-medium text-[#202124] tracking-tight">
              {activeNode.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-16 h-1 rounded-full bg-[#E9E7E3] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-[#6B6B6B]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Dynamic Activity Icon */}
        <div className="pl-1 border-l border-[#E9E7E3] text-[#6B6B6B] group-hover:text-[#F97316] transition-colors">
          <Activity size={13} className="animate-pulse" />
        </div>
      </aside>
    </div>
  );
};
