"use client";

import React, { useEffect, useRef, memo } from "react";

export const AnimatedWireframeMatrix: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Polyhedron Wireframe Vertices (Icosahedron / Geodesic Orb)
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const rawVertices = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1],
    ];

    // Normalize vertices to unit sphere
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    // Edges connecting vertices
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const d2 =
          Math.pow(vertices[i][0] - vertices[j][0], 2) +
          Math.pow(vertices[i][1] - vertices[j][1], 2) +
          Math.pow(vertices[i][2] - vertices[j][2], 2);
        // Golden ratio edge distance check (~1.05)
        if (d2 < 1.15) {
          edges.push([i, j]);
        }
      }
    }

    let rotX = 0.2;
    let rotY = 0.4;
    let rotZ = 0.1;
    let time = 0;
    let animId: number;
    let isVisible = true;

    // IntersectionObserver to pause rendering when scrolled offscreen (100% battery efficiency)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.016;
      rotX += 0.007;
      rotY += 0.009;
      rotZ += 0.004;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const isMobile = width < 768;
      const scale = isMobile ? Math.min(width * 0.42, 160) : Math.min(width * 0.26, 210);

      // --- 1. CONTINUOUS ROTATING PERSPECTIVE GRID TERRAIN (Horizon wave) ---
      ctx.save();
      ctx.strokeStyle = "rgba(16, 185, 129, 0.14)";
      ctx.lineWidth = 1;

      const gridLines = 14;
      const horizonY = cy + (isMobile ? 70 : 90);
      const gridWidth = width * 1.2;

      // Perspective vertical rays
      for (let i = -gridLines; i <= gridLines; i++) {
        const xStart = cx + i * (gridWidth / (gridLines * 2));
        ctx.beginPath();
        ctx.moveTo(cx, horizonY - 40);
        ctx.lineTo(xStart * 1.35, height);
        ctx.stroke();
      }

      // Horizontal moving wave lines
      const offset = (time * 24) % 28;
      for (let y = horizonY - 20; y < height; y += 22) {
        const currentY = y + offset;
        if (currentY > height) continue;
        const progress = (currentY - (horizonY - 20)) / (height - horizonY + 20);
        ctx.strokeStyle = `rgba(0, 255, 135, ${progress * 0.18})`;
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(width, currentY);
        ctx.stroke();
      }
      ctx.restore();

      // --- 2. 3D CONTINUOUS ROTATING WIREFRAME POLYHEDRON ---
      // Apply 3D Euler rotations (Y -> X -> Z)
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      const projected = vertices.map(([vx, vy, vz]) => {
        // Rotate Y
        const x1 = vx * cosY + vz * sinY;
        const y1 = vy;
        const z1 = -vx * sinY + vz * cosY;

        // Rotate X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Rotate Z
        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = x2 * sinZ + y2 * cosZ;
        const z3 = z2;

        // Perspective projection
        const cameraDist = 2.8;
        const fov = cameraDist / (cameraDist + z3);

        return {
          x: cx + x3 * scale * fov,
          y: cy + y3 * scale * fov - (isMobile ? 15 : 0),
          z: z3,
          fov,
        };
      });

      // Render wireframe edges with luminous gradient stroke
      ctx.save();
      for (const [i, j] of edges) {
        const p1 = projected[i];
        const p2 = projected[j];

        const avgZ = (p1.z + p2.z) / 2;
        const depthAlpha = Math.max(0.12, Math.min(0.65, (avgZ + 1.2) / 2.2));

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, `rgba(0, 255, 135, ${depthAlpha * 0.85})`);
        grad.addColorStop(0.5, `rgba(56, 189, 248, ${depthAlpha * 0.75})`);
        grad.addColorStop(1, `rgba(16, 185, 129, ${depthAlpha * 0.85})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = isMobile ? 1.2 : 1.6;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Render glowing vertices
      for (const p of projected) {
        const alpha = Math.max(0.2, (p.z + 1.2) / 2.4);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isMobile ? 2.2 : 3.0) * p.fov, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing emerald halo on front vertices
        if (p.z > 0.2) {
          ctx.fillStyle = `rgba(0, 255, 135, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (isMobile ? 5.5 : 7.0) * p.fov, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Ambient Radial Vignette behind wireframe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(0, 255, 135, 0.03) 45%, transparent 75%)",
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full block will-change-transform" />
    </div>
  );
});

AnimatedWireframeMatrix.displayName = "AnimatedWireframeMatrix";
