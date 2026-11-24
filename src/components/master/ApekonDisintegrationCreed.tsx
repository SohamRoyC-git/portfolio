"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import * as THREE from "three";
import { Sparkles } from "lucide-react";

export interface CreedStationData {
  num: string;
  tag: string;
  headline: string;
  entity: string;
  details: string;
  metricLabel: string;
  metricValue: string;
  accent: string;
}

export const CREED_STATIONS: CreedStationData[] = [
  {
    num: "01",
    tag: "01 // ACADEMIC CORE",
    headline: "Architecting predictive neural systems & autonomous intelligence.",
    entity: "Netaji Subhash Engineering College",
    details: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028) · Computational algebra, high-throughput architectures, and algorithmic optimization.",
    metricLabel: "System Convergence",
    metricValue: "99.4%",
    accent: "#ffffff",
  },
  {
    num: "02",
    tag: "02 // EUROPEAN OPERATIONS",
    headline: "Directing live tournament telemetry & national sports ecosystems.",
    entity: "Latvian Cricket Federation",
    details: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga.",
    metricLabel: "Telemetry Stream",
    metricValue: "100% Active",
    accent: "#fbbf24",
  },
  {
    num: "03",
    tag: "03 // HIGH-PERFORMANCE CORE",
    headline: "Eliminating API roundtrip latency with in-memory localization.",
    entity: "278-Key Sub-Millisecond Engine",
    details: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
    metricLabel: "Roundtrip Latency",
    metricValue: "< 4.8ms",
    accent: "#38bdf8",
  },
  {
    num: "04",
    tag: "04 // ALGORITHMIC FOUNDATION",
    headline: "Grounding high-throughput architectures in analytical mechanics.",
    entity: "The Heritage School Distinction",
    details: "Pure sciences, discrete mathematics, analytical mechanics, and algorithm design distinction foundation.",
    metricLabel: "Academic Distinction",
    metricValue: "Top Tier",
    accent: "#34d399",
  },
];

// Apekon Deterministic Pseudo-Random Noise function extracted directly from apekon.com script
const FX = (s: number, e: number): number => {
  let t = (s * 123.34) % 1;
  let n = (e * 456.21) % 1;
  if (t < 0) t += 1;
  if (n < 0) n += 1;
  const i = t * (t + 45.32) + n * (n + 45.32);
  t += i;
  n += i;
  const r = (t * n) % 1;
  return r < 0 ? r + 1 : r;
};

// Smoothstep interpolation helper
const smoothstep = (min: number, max: number, val: number): number => {
  const n = Math.min(1, Math.max(0, (val - min) / (max - min)));
  return n * n * (3 - 2 * n);
};

interface TriangleItem {
  corners: [number, number][];
  cx: number;
  cy: number;
  n: number; // Normalized noise distance delay
  seed: number;
}

interface ApekonDisintegrationCreedProps {
  progress?: number;
}

export const ApekonDisintegrationCreed: React.FC<ApekonDisintegrationCreedProps> = memo(
  ({ progress = 0 }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const threeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const transitionCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const currentProgressRef = useRef<number>(progress);
    currentProgressRef.current = progress;

    // Triangles geometry cache
    const trianglesRef = useRef<TriangleItem[]>([]);

    /**
     * 1. Rebuild the Equilateral Triangular Tessellation Grid
     */
    const rebuildTriangleGrid = useCallback(() => {
      const canvas = transitionCanvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const side = 28; // Equilateral triangle side length in px
      const height = side * 0.8660254; // h = side * sqrt(3) / 2

      const originX = w * 0.5;
      const originY = h * 0.45;
      const maxDist =
        Math.max(
          Math.hypot(originX, originY),
          Math.hypot(w - originX, originY),
          Math.hypot(originX, h - originY),
          Math.hypot(w - originX, h - originY)
        ) || 1;

      const items: TriangleItem[] = [];
      const rows = Math.ceil(h / height) + 2;
      const cols = Math.ceil(w / side) + 2;

      for (let r = -1; r < rows; r++) {
        const yTop = r * height;
        const yBottom = yTop + height;
        const xOffset = r % 2 === 0 ? 0 : side / 2;

        for (let c = -1; c < cols; c++) {
          const xLeft = c * side - xOffset;
          const xMid = xLeft + side / 2;
          const xRight = xLeft + side;

          // Triangle A (pointing up)
          const cornersA: [number, number][] = [
            [xLeft, yBottom],
            [xRight, yBottom],
            [xMid, yTop],
          ];
          const cxA = (xLeft + xRight + xMid) / 3;
          const cyA = (yBottom + yBottom + yTop) / 3;
          const distA = Math.hypot(cxA - originX, cyA - originY);
          const noiseA = (distA / maxDist) * 0.76 + FX(cxA * 0.012, cyA * 0.016) * 0.24;

          items.push({
            corners: cornersA,
            cx: cxA,
            cy: cyA,
            n: noiseA,
            seed: FX(cxA * 0.05, cyA * 0.05),
          });

          // Triangle B (pointing down)
          const cornersB: [number, number][] = [
            [xMid, yTop],
            [xRight + side / 2, yTop],
            [xRight, yBottom],
          ];
          const cxB = (xMid + (xRight + side / 2) + xRight) / 3;
          const cyB = (yTop + yTop + yBottom) / 3;
          const distB = Math.hypot(cxB - originX, cyB - originY);
          const noiseB = (distB / maxDist) * 0.76 + FX(cxB * 0.012, cyB * 0.016) * 0.24;

          items.push({
            corners: cornersB,
            cx: cxB,
            cy: cyB,
            n: noiseB,
            seed: FX(cxB * 0.05, cyB * 0.05),
          });
        }
      }

      trianglesRef.current = items;
    }, []);

    useEffect(() => {
      rebuildTriangleGrid();
      const handleResize = () => rebuildTriangleGrid();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [rebuildTriangleGrid]);

    /**
     * 2. Deterministic Triangle Disintegration Wave Renderer
     * 100% Scroll-Scrubbed (0ms JS timer delay, zero race conditions)
     */
    const renderTransitionCanvas = useCallback((t: number, isExit: boolean = false) => {
      const canvas = transitionCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (t <= 0.001 || t >= 0.999) return;

      const q = t * (isExit ? 1.45 : 1.35);
      const triangles = trianglesRef.current;
      const waveSpan = isExit ? 0.40 : 0.38;

      for (let i = 0; i < triangles.length; i++) {
        const tri = triangles[i];
        if (q < tri.n) continue;

        const waveDist = q - tri.n;
        if (waveDist > waveSpan) continue;

        const shardAlpha = 1 - smoothstep(0, waveSpan, waveDist);
        const edgeAlpha = Math.sin(smoothstep(0, waveSpan, waveDist) * Math.PI);

        ctx.beginPath();
        ctx.moveTo(tri.corners[0][0], tri.corners[0][1]);
        ctx.lineTo(tri.corners[1][0], tri.corners[1][1]);
        ctx.lineTo(tri.corners[2][0], tri.corners[2][1]);
        ctx.closePath();

        if (shardAlpha > 0.04) {
          const glint = (tri.seed * 0.12).toFixed(3);
          ctx.fillStyle = `rgba(6, 7, 9, ${(shardAlpha * 0.95).toFixed(3)})`;
          ctx.fill();

          if (edgeAlpha > 0.3 && !isExit) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(edgeAlpha * Number(glint)).toFixed(3)})`;
            ctx.fill();
          }
        }

        if (edgeAlpha > 0.04) {
          ctx.strokeStyle = `rgba(235, 242, 250, ${(edgeAlpha * 0.88).toFixed(3)})`;
          ctx.lineWidth = isExit ? 1.15 : 1.0;
          ctx.stroke();
        }
      }
    }, []);

    // Compute active station and transition state based on scroll progress (0.0 to 1.0)
    // Stations: 01 (0.00-0.22), T1 (0.22-0.28), 02 (0.28-0.47), T2 (0.47-0.53), 03 (0.53-0.72), T3 (0.72-0.78), 04 (0.78-0.90), Exit (0.90-1.00)
    let activeStationIdx = 0;
    let nextStationIdx = 0;
    let transitionProgress = 0; // 0 to 1
    let isTransitioning = false;
    let isExitWave = false;

    if (progress < 0.22) {
      activeStationIdx = 0;
      nextStationIdx = 0;
      transitionProgress = 0;
    } else if (progress < 0.28) {
      activeStationIdx = 0;
      nextStationIdx = 1;
      transitionProgress = (progress - 0.22) / 0.06;
      isTransitioning = true;
    } else if (progress < 0.47) {
      activeStationIdx = 1;
      nextStationIdx = 1;
      transitionProgress = 0;
    } else if (progress < 0.53) {
      activeStationIdx = 1;
      nextStationIdx = 2;
      transitionProgress = (progress - 0.47) / 0.06;
      isTransitioning = true;
    } else if (progress < 0.72) {
      activeStationIdx = 2;
      nextStationIdx = 2;
      transitionProgress = 0;
    } else if (progress < 0.78) {
      activeStationIdx = 2;
      nextStationIdx = 3;
      transitionProgress = (progress - 0.72) / 0.06;
      isTransitioning = true;
    } else if (progress < 0.90) {
      activeStationIdx = 3;
      nextStationIdx = 3;
      transitionProgress = 0;
    } else {
      activeStationIdx = 3;
      nextStationIdx = 3;
      transitionProgress = Math.min(1, Math.max(0, (progress - 0.90) / 0.10));
      isTransitioning = true;
      isExitWave = true;
    }

    // Direct scrub render of canvas
    useEffect(() => {
      if (isTransitioning) {
        renderTransitionCanvas(transitionProgress, isExitWave);
      } else {
        const canvas = transitionCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }, [isTransitioning, transitionProgress, isExitWave, renderTransitionCanvas]);

    // Current displayed pillar number for HUD (1, 2, 3, or 4)
    const displayPillarNum =
      progress < 0.25 ? "01" : progress < 0.50 ? "02" : progress < 0.75 ? "03" : "04";

    /**
     * 3. Three.js Background Geodesic Sphere Scene (Apekon Atmosphere)
     */
    useEffect(() => {
      const canvas = threeCanvasRef.current;
      if (!canvas) return;

      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      // Deep atmospheric studio lighting (Soft diffused ambient + silhouette grazing rim lights; zero harsh hotspots)
      const ambientLight = new THREE.AmbientLight(0xdde3ea, 0.65);
      scene.add(ambientLight);

      // Subtle, non-glaring directional fill from top-left (low intensity, diffused)
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.65);
      fillLight.position.set(-2, 3, 2);
      scene.add(fillLight);

      // Soft dual rim lights for subtle chromatic depth
      const rimLightBlue = new THREE.PointLight(0x38bdf8, 1.8, 8);
      rimLightBlue.position.set(-3.2, -1.8, -1.5);
      scene.add(rimLightBlue);

      const rimLightAmber = new THREE.PointLight(0xff7a00, 1.4, 8);
      rimLightAmber.position.set(3.0, -2.0, -1.5);
      scene.add(rimLightAmber);

      // Apekon-style dark geodesic hemisphere/sphere
      const geometry = new THREE.IcosahedronGeometry(2.35, 4);

      // Custom dark obsidian-chrome physical material (Matte luxury obsidian; zero white glare flare)
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0a0c10,
        roughness: 0.35,
        metalness: 0.85,
        clearcoat: 0.40,
        clearcoatRoughness: 0.30,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);

      // Delicate wireframe lattice overlay
      const wireGeometry = new THREE.WireframeGeometry(geometry);
      const wireMaterial = new THREE.LineBasicMaterial({
        color: 0xdde5ed,
        transparent: true,
        opacity: 0.16,
      });
      const wireMesh = new THREE.LineSegments(wireGeometry, wireMaterial);
      mesh.add(wireMesh);

      // Floating ambient stardust motes
      const particleCount = 140;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 5;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.028,
        transparent: true,
        opacity: 0.45,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      let time = 0;
      let rafId = 0;

      const animate = () => {
        time += 0.007;

        // Subtle organic breathing & direct coupling with scroll progress
        mesh.rotation.y = time * 0.10 + currentProgressRef.current * Math.PI * 2.4;
        mesh.rotation.x = Math.sin(time * 0.12) * 0.08 + Math.sin(currentProgressRef.current * Math.PI) * 0.28;

        const pulse = 1.0 + Math.sin(time * 0.45) * 0.022;
        mesh.scale.set(pulse, pulse, pulse);

        particles.rotation.y = time * 0.025;

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        if (!canvas) return;
        const nw = canvas.clientWidth || window.innerWidth;
        const nh = canvas.clientHeight || window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
        rebuildTriangleGrid();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(rafId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        wireGeometry.dispose();
        wireMaterial.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      };
    }, [rebuildTriangleGrid]);

    // Active station calculation for display
    const currentStation =
      isTransitioning && transitionProgress >= 0.50
        ? CREED_STATIONS[nextStationIdx]
        : CREED_STATIONS[activeStationIdx];

    // Compute typography opacity and subtle transform based on scroll progress
    let typoOpacity = 1;
    let typoScale = 1;

    if (isExitWave) {
      typoOpacity = Math.max(0, 1 - transitionProgress * 1.5);
      typoScale = 1 + transitionProgress * 0.04;
    } else if (isTransitioning) {
      if (transitionProgress < 0.50) {
        typoOpacity = Math.max(0.1, 1 - transitionProgress * 1.8);
        typoScale = 1 - transitionProgress * 0.03;
      } else {
        typoOpacity = Math.min(1, (transitionProgress - 0.50) * 2.0);
        typoScale = 0.97 + (transitionProgress - 0.50) * 0.06;
      }
    }

    const isGlitchActive = isTransitioning && transitionProgress > 0.12 && transitionProgress < 0.88;

    return (
      <div
        ref={rootRef}
        className="relative w-full h-full flex flex-col justify-between items-center text-white select-none overflow-hidden bg-[#060709] px-6 pt-16 pb-8"
      >
        {/* 1. Subtle 3D Geodesic Atmosphere Canvas (Apekon Inspiration) */}
        <canvas
          ref={threeCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-85"
        />

        {/* 2. Procedural Equilateral Triangle Disintegration Overlay Canvas */}
        <canvas
          ref={transitionCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* 3. Top Architectural Header (Headroom below global nav) */}
        <header className="relative z-10 w-full flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">
              ARCHITECTURAL CREED
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-white/50">
            <span className="text-white font-bold">{currentStation.num}</span>
            <span>/</span>
            <span>04</span>
          </div>
        </header>

        {/* 4. Central Monumental Typography (100% Scroll Scrubbed · Zero Timers) */}
        <main
          className="relative z-10 w-full max-w-md my-auto flex flex-col items-start transition-[filter] duration-150"
          style={{
            opacity: typoOpacity,
            transform: `scale(${typoScale.toFixed(3)})`,
            filter: isGlitchActive
              ? "drop-shadow(-2px 0px rgba(239,68,68,0.75)) drop-shadow(2px 0px rgba(56,189,248,0.75))"
              : "none",
          }}
        >
          {/* Eyebrow Pillar Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-5 bg-white/40" />
            <span className="font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase">
              {currentStation.tag}
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="text-[26px] sm:text-[30px] font-light leading-[1.18] tracking-[-0.03em] text-white mb-4">
            {currentStation.headline}
          </h2>

          {/* Entity & Proof Sub-text */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-medium tracking-wide text-white/90">
              {currentStation.entity}
            </p>
            <p className="text-[12px] font-normal leading-[1.5] text-white/55 pr-2">
              {currentStation.details}
            </p>
          </div>

          {/* Minimal Key Metric Pill */}
          <div className="mt-5 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-white/70" />
            <span className="font-mono text-[10px] tracking-wider text-white/50 uppercase">
              {currentStation.metricLabel}:
            </span>
            <span className="font-mono text-[10px] font-bold text-white tracking-widest">
              {currentStation.metricValue}
            </span>
          </div>
        </main>

        {/* 5. Pure Minimalist Scroll Progress HUD (100% Scroll-Driven · Zero Buttons) */}
        <footer className="relative z-10 w-full flex items-center justify-between pt-3 border-t border-white/[0.08] text-[10px] font-mono tracking-wider text-white/45">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="uppercase tracking-[0.2em]">SCROLL TO ADVANCE PILLARS</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-white/80">
            <span>PILLAR {displayPillarNum}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">04</span>
          </div>
        </footer>
      </div>
    );
  }
);

ApekonDisintegrationCreed.displayName = "ApekonDisintegrationCreed";
