"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

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
    const [currentStationIdx, setCurrentStationIdx] = useState(0);
    const [displayedIdx, setDisplayedIdx] = useState(0);
    const [isDisintegrating, setIsDisintegrating] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const threeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const transitionCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Touch origin for directional disintegration wave
    const touchOriginRef = useRef<{ x: number; y: number }>({ x: 195, y: 422 });
    const animFrameRef = useRef<number | null>(null);
    const lastScrollProgressRef = useRef<number>(0);
    const isExitingRef = useRef(false);

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

      const origin = touchOriginRef.current;
      const maxDist = Math.max(
        Math.hypot(origin.x, origin.y),
        Math.hypot(w - origin.x, origin.y),
        Math.hypot(origin.x, h - origin.y),
        Math.hypot(w - origin.x, h - origin.y)
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
          const distA = Math.hypot(cxA - origin.x, cyA - origin.y);
          const noiseA = distA / maxDist * 0.76 + FX(cxA * 0.013, cyA * 0.017) * 0.24;
          items.push({ corners: cornersA, cx: cxA, cy: cyA, n: noiseA, seed: FX(cxA * 0.05, cyA * 0.05) });

          // Triangle B (pointing down)
          const cornersB: [number, number][] = [
            [xMid, yTop],
            [xRight + side / 2, yTop],
            [xRight, yBottom],
          ];
          const cxB = (xMid + (xRight + side / 2) + xRight) / 3;
          const cyB = (yTop + yTop + yBottom) / 3;
          const distB = Math.hypot(cxB - origin.x, cyB - origin.y);
          const noiseB = distB / maxDist * 0.76 + FX(cxB * 0.013, cyB * 0.017) * 0.24;
          items.push({ corners: cornersB, cx: cxB, cy: cyB, n: noiseB, seed: FX(cxB * 0.05, cyB * 0.05) });
        }
      }

      trianglesRef.current = items;
    }, []);

    /**
     * 2. Trigger the Apekon Disintegration Animation
     */
    const triggerDisintegrationTo = useCallback(
      (nextIdx: number, originX?: number, originY?: number) => {
        if (nextIdx === currentStationIdx && !isDisintegrating) return;

        const canvas = transitionCanvasRef.current;
        if (!canvas) {
          setCurrentStationIdx(nextIdx);
          setDisplayedIdx(nextIdx);
          return;
        }

        const rect = canvas.getBoundingClientRect();
        touchOriginRef.current = {
          x: originX !== undefined ? originX - rect.left : rect.width * 0.5,
          y: originY !== undefined ? originY - rect.top : rect.height * 0.55,
        };

        rebuildTriangleGrid();
        setIsDisintegrating(true);
        setCurrentStationIdx(nextIdx);

        let startTime: number | null = null;
        const duration = 680; // ms

        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }

        let swapped = false;

        const renderFrame = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const p = Math.min(1, elapsed / duration);

          // Disintegration wave progress runs from 0.0 to 1.35
          const q = p * 1.35;

          // Swap text exactly at the 46% midpoint of the wave sweep
          if (p >= 0.46 && !swapped) {
            setDisplayedIdx(nextIdx);
            swapped = true;
          }

          // Draw canvas disintegration overlay
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const triangles = trianglesRef.current;

            // Draw dissolving triangles, crystalline facets and glowing wireframe borders
            for (let i = 0; i < triangles.length; i++) {
              const tri = triangles[i];
              if (q < tri.n) {
                // Not yet reached by the disintegration wave
                continue;
              }

              const waveDist = q - tri.n;
              if (waveDist > 0.38) {
                // Wave has fully passed this triangle
                continue;
              }

              // Disintegration shard fade factor
              const shardAlpha = 1 - smoothstep(0, 0.38, waveDist);
              const edgeAlpha = Math.sin(smoothstep(0, 0.38, waveDist) * Math.PI);

              ctx.beginPath();
              ctx.moveTo(tri.corners[0][0], tri.corners[0][1]);
              ctx.lineTo(tri.corners[1][0], tri.corners[1][1]);
              ctx.lineTo(tri.corners[2][0], tri.corners[2][1]);
              ctx.closePath();

              // High-fashion dark crystalline optical shard fill
              if (shardAlpha > 0.04) {
                // Subtle crystalline facet luminosity glint
                const glint = (tri.seed * 0.12).toFixed(3);
                ctx.fillStyle = `rgba(10, 12, 16, ${(shardAlpha * 0.88).toFixed(3)})`;
                ctx.fill();

                if (edgeAlpha > 0.3) {
                  ctx.fillStyle = `rgba(255, 255, 255, ${(edgeAlpha * Number(glint)).toFixed(3)})`;
                  ctx.fill();
                }
              }

              // Crisp laser wireframe outline (Apekon style)
              if (edgeAlpha > 0.04) {
                ctx.strokeStyle = `rgba(225, 235, 245, ${(edgeAlpha * 0.82).toFixed(3)})`;
                ctx.lineWidth = 1.0;
                ctx.stroke();
              }
            }
          }

          if (p < 1) {
            animFrameRef.current = requestAnimationFrame(renderFrame);
          } else {
            // Finished transition
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            setIsDisintegrating(false);
            animFrameRef.current = null;
          }
        };

        animFrameRef.current = requestAnimationFrame(renderFrame);
      },
      [currentStationIdx, isDisintegrating, rebuildTriangleGrid]
    );

    /**
     * Trigger full-viewport triangular disintegration burst into Projects
     */
    const triggerExitDisintegration = useCallback(() => {
      const canvas = transitionCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      touchOriginRef.current = {
        x: rect.width * 0.5,
        y: rect.height * 0.45,
      };
      rebuildTriangleGrid();
      setIsDisintegrating(true);

      let startTime: number | null = null;
      const duration = 720;

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      const renderExit = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const p = Math.min(1, elapsed / duration);
        const q = p * 1.45;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const triangles = trianglesRef.current;
          for (let i = 0; i < triangles.length; i++) {
            const tri = triangles[i];
            if (q < tri.n) continue;
            const waveDist = q - tri.n;
            if (waveDist > 0.40) continue;

            const shardAlpha = 1 - smoothstep(0, 0.40, waveDist);
            const edgeAlpha = Math.sin(smoothstep(0, 0.40, waveDist) * Math.PI);

            ctx.beginPath();
            ctx.moveTo(tri.corners[0][0], tri.corners[0][1]);
            ctx.lineTo(tri.corners[1][0], tri.corners[1][1]);
            ctx.lineTo(tri.corners[2][0], tri.corners[2][1]);
            ctx.closePath();

            if (shardAlpha > 0.04) {
              ctx.fillStyle = `rgba(6, 7, 9, ${(shardAlpha * 0.95).toFixed(3)})`;
              ctx.fill();
            }
            if (edgeAlpha > 0.04) {
              ctx.strokeStyle = `rgba(235, 242, 250, ${(edgeAlpha * 0.90).toFixed(3)})`;
              ctx.lineWidth = 1.15;
              ctx.stroke();
            }
          }
        }

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(renderExit);
        } else {
          setIsDisintegrating(false);
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(renderExit);
    }, [rebuildTriangleGrid]);

    /**
     * 3. Sync with parent scroll progress (0.0 -> 1.0)
     */
    useEffect(() => {
      if (progress === undefined || progress === null) return;
      if (Math.abs(progress - lastScrollProgressRef.current) < 0.01) return;
      lastScrollProgressRef.current = progress;

      // When scrolling past station 4 towards Projects (progress > 0.88), trigger exit disintegration wave
      if (progress > 0.88 && !isExitingRef.current) {
        isExitingRef.current = true;
        triggerExitDisintegration();
        return;
      } else if (progress <= 0.88 && isExitingRef.current) {
        isExitingRef.current = false;
      }

      // 4 stations distributed across scroll progress
      let targetIdx = 0;
      if (progress < 0.28) targetIdx = 0;
      else if (progress < 0.54) targetIdx = 1;
      else if (progress < 0.78) targetIdx = 2;
      else targetIdx = 3;

      if (targetIdx !== currentStationIdx && !isDisintegrating) {
        triggerDisintegrationTo(targetIdx);
      }
    }, [progress, currentStationIdx, isDisintegrating, triggerDisintegrationTo, triggerExitDisintegration]);

    /**
     * 4. Three.js Background Geodesic Sphere Scene (Apekon Atmosphere)
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
        metalness: 0.70,
        roughness: 0.42,
        clearcoat: 0.25,
        clearcoatRoughness: 0.50,
        reflectivity: 0.50,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
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

        // Subtle organic breathing & slow cinematic drift
        mesh.rotation.y = time * 0.14;
        mesh.rotation.x = Math.sin(time * 0.16) * 0.10;

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

    // Initial grid calculation
    useEffect(() => {
      rebuildTriangleGrid();
    }, [rebuildTriangleGrid]);

    // Handle touch tap or swipe navigation
    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch && transitionCanvasRef.current) {
        const rect = transitionCanvasRef.current.getBoundingClientRect();
        touchOriginRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    const handleNext = (e?: React.MouseEvent) => {
      const next = (currentStationIdx + 1) % CREED_STATIONS.length;
      triggerDisintegrationTo(
        next,
        e ? e.clientX : undefined,
        e ? e.clientY : undefined
      );
    };

    const handlePrev = (e?: React.MouseEvent) => {
      const prev = (currentStationIdx - 1 + CREED_STATIONS.length) % CREED_STATIONS.length;
      triggerDisintegrationTo(
        prev,
        e ? e.clientX : undefined,
        e ? e.clientY : undefined
      );
    };

    const station = CREED_STATIONS[displayedIdx];

    return (
      <div
        ref={rootRef}
        onTouchStart={handleTouchStart}
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

        {/* 3. Top Architectural Header (Pushed down with headroom below global nav) */}
        <header className="relative z-10 w-full flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">
              ARCHITECTURAL CREED
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-white/50">
            <span className="text-white font-bold">{station.num}</span>
            <span>/</span>
            <span>04</span>
          </div>
        </header>

        {/* 4. Central Monumental Typography (100% Unboxed · High Fashion Apekon Style) */}
        <main
          className={`relative z-10 w-full max-w-md my-auto flex flex-col items-start transition-all duration-300 ${
            isDisintegrating
              ? "opacity-90 [filter:drop-shadow(-3px_0px_#ef4444)_drop-shadow(3px_0px_#38bdf8)] scale-[0.99]"
              : "opacity-100 filter-none scale-100"
          }`}
        >
          {/* Eyebrow Pillar Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-5 bg-white/40" />
            <span className="font-mono text-[11px] tracking-[0.22em] text-white/60 uppercase">
              {station.tag}
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="text-[26px] sm:text-[30px] font-light leading-[1.18] tracking-[-0.03em] text-white mb-4">
            {station.headline}
          </h2>

          {/* Entity & Proof Sub-text */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-medium tracking-wide text-white/90">
              {station.entity}
            </p>
            <p className="text-[12px] font-normal leading-[1.5] text-white/55 pr-2">
              {station.details}
            </p>
          </div>

          {/* Minimal Key Metric Pill */}
          <div className="mt-5 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-white/70" />
            <span className="font-mono text-[10px] tracking-wider text-white/50 uppercase">
              {station.metricLabel}:
            </span>
            <span className="font-mono text-[10px] font-bold text-white tracking-widest">
              {station.metricValue}
            </span>
          </div>
        </main>

        {/* 5. Minimalist Technical Navigation HUD (Bottom) */}
        <footer className="relative z-10 w-full flex items-center justify-between pt-3 border-t border-white/[0.08]">
          {/* Station Selector Pills */}
          <div className="flex items-center gap-2">
            {CREED_STATIONS.map((st, i) => (
              <button
                key={st.num}
                onClick={(e) => triggerDisintegrationTo(i, e.clientX, e.clientY)}
                className={`group relative flex items-center justify-center transition-all duration-300 ${
                  currentStationIdx === i
                    ? "w-8 h-6 bg-white text-black font-bold"
                    : "w-6 h-6 text-white/40 hover:text-white bg-white/[0.04]"
                } rounded text-[10px] font-mono`}
                aria-label={`Go to station ${st.num}`}
              >
                {st.num}
              </button>
            ))}
          </div>

          {/* Stepper Chevrons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/70 active:scale-90 active:bg-white active:text-black transition-all"
              aria-label="Previous station"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/70 active:scale-90 active:bg-white active:text-black transition-all"
              aria-label="Next station"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>
    );
  }
);

ApekonDisintegrationCreed.displayName = "ApekonDisintegrationCreed";
