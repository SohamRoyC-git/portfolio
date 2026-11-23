"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award } from "lucide-react";

export interface FluidStationData {
  num: string;
  short: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  statusLabel: string;
  fluidMode: "sphere" | "torus" | "ferro" | "droplet";
  accentColor: string;
  chips: string[];
  benchLabel: string;
  benchValue: string;
}

export const FLUID_STATIONS: FluidStationData[] = [
  {
    num: "01",
    short: "Academic",
    tag: "Academic Core",
    title: "Netaji Subhash Engineering College",
    role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
    desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
    statusLabel: "Liquid Platinum Core",
    fluidMode: "sphere",
    accentColor: "#f8fafc",
    chips: ["Neural Architectures", "Computational Algebra", "System Convergence: 99.4%"],
    benchLabel: "System Convergence",
    benchValue: "99.4%",
  },
  {
    num: "02",
    short: "European Ops",
    tag: "European Operations",
    title: "Latvian Cricket Federation",
    role: "National Sports Governing Body Digital Ecosystem",
    desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga and European circuits.",
    statusLabel: "Fluid Kinetic Vortex",
    fluidMode: "torus",
    accentColor: "#fbbf24",
    chips: ["EU Compliance", "Live Telemetry", "Riga Circuit"],
    benchLabel: "Telemetry Stream",
    benchValue: "100% Active",
  },
  {
    num: "03",
    short: "Localization",
    tag: "High-Performance Core",
    title: "278-Key In-Memory Localization Engine",
    role: "Zero-API Sub-Millisecond Bilingual Translation",
    desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
    statusLabel: "Ferrofluid Harmonic Bus",
    fluidMode: "ferro",
    accentColor: "#38bdf8",
    chips: ["Zero-API", "Sub-Millisecond", "Trade Pipeline"],
    benchLabel: "Roundtrip Latency",
    benchValue: "< 4.8ms",
  },
  {
    num: "04",
    short: "Heritage",
    tag: "Algorithmic Foundation",
    title: "The Heritage School",
    role: "ISC Class XII (82.75%) · ICSE (89.4%) Distinction",
    desc: "Pure sciences, discrete mathematics, analytical mechanics, and algorithm design distinction foundation.",
    statusLabel: "Pristine Mercury Tension",
    fluidMode: "droplet",
    accentColor: "#34d399",
    chips: ["Discrete Math", "Analytical Mechanics", "Distinction Honors"],
    benchLabel: "Academic Distinction",
    benchValue: "Top Tier",
  },
];

interface LiquidChromeCreedProps {
  progress?: number;
}

/**
 * Procedural Luxury Studio Softbox Environment Map
 */
function createStudioEnvMap(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(c);

  // Obsidian studio backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, c.height);
  bg.addColorStop(0, "#08090b");
  bg.addColorStop(0.5, "#0e1117");
  bg.addColorStop(1, "#040507");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);

  // Main Overhead Softbox Light Panel (Bright diffused light)
  const topGrad = ctx.createRadialGradient(512, 110, 10, 512, 110, 320);
  topGrad.addColorStop(0, "#ffffff");
  topGrad.addColorStop(0.3, "rgba(245, 248, 255, 0.95)");
  topGrad.addColorStop(0.65, "rgba(200, 215, 235, 0.3)");
  topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, c.width, 320);

  // Soft lateral silver rim light panels
  const leftRim = ctx.createLinearGradient(0, 220, 260, 220);
  leftRim.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  leftRim.addColorStop(0.6, "rgba(210, 220, 240, 0.2)");
  leftRim.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = leftRim;
  ctx.fillRect(0, 140, 260, 200);

  const rightRim = ctx.createLinearGradient(c.width, 220, c.width - 260, 220);
  rightRim.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  rightRim.addColorStop(0.6, "rgba(210, 220, 240, 0.2)");
  rightRim.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = rightRim;
  ctx.fillRect(c.width - 260, 140, 260, 200);

  // Fine architectural specular bars
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(180, 70, 664, 6);
  ctx.fillRect(320, 120, 384, 3);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export const LiquidChromeCreed: React.FC<LiquidChromeCreedProps> = memo(
  ({ progress = 0 }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const currentIdxRef = useRef(0);
    currentIdxRef.current = currentIdx;

    // Interactive disturbance on touch/drag
    const touchDisturbRef = useRef({ x: 0, y: 0, intensity: 0 });
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Audio click for station selection
    const playHapticTick = useCallback(() => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch {
        // Fallback
      }
    }, []);

    // Sync station with scroll progress
    const lastProgressRef = useRef(progress);
    useEffect(() => {
      if (typeof progress === "number" && progress !== lastProgressRef.current) {
        lastProgressRef.current = progress;
        const idx = Math.min(
          FLUID_STATIONS.length - 1,
          Math.max(0, Math.floor(progress * FLUID_STATIONS.length))
        );
        setCurrentIdx(idx);
      }
    }, [progress]);

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 390;
      const height = container.clientHeight || 580;

      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);

      // Studio Environment Map
      const envMap = createStudioEnvMap();
      scene.environment = envMap;

      // Lights
      const amb = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(amb);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
      keyLight.position.set(4, 7, 5);
      scene.add(keyLight);

      const fillLight = new THREE.PointLight(0xffffff, 1.8, 12);
      fillLight.position.set(-4, -2, 4);
      scene.add(fillLight);

      // Floor Caustic Light Pool
      const floorGeo = new THREE.PlaneGeometry(6, 6);
      const floorCanvas = document.createElement("canvas");
      floorCanvas.width = 512;
      floorCanvas.height = 512;
      const fctx = floorCanvas.getContext("2d");
      if (fctx) {
        const fgrad = fctx.createRadialGradient(256, 256, 10, 256, 256, 220);
        fgrad.addColorStop(0, "rgba(255, 255, 255, 0.25)");
        fgrad.addColorStop(0.35, "rgba(220, 230, 255, 0.12)");
        fgrad.addColorStop(0.7, "rgba(180, 200, 230, 0.04)");
        fgrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        fctx.fillStyle = fgrad;
        fctx.fillRect(0, 0, 512, 512);
      }
      const floorTex = new THREE.CanvasTexture(floorCanvas);
      const floorMat = new THREE.MeshBasicMaterial({
        map: floorTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = -1.65;
      scene.add(floorMesh);

      // Silky Smooth Subdivided Fluid Geometry (128x96)
      const fluidRadius = 1.08;
      const fluidGeo = new THREE.SphereGeometry(fluidRadius, 128, 96);
      const origPos = fluidGeo.attributes.position.clone();

      // Mirror-Polished Liquid Chrome Material
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4f6fa,
        metalness: 0.99,
        roughness: 0.03,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.6,
        reflectivity: 1.0,
      });

      const fluidMesh = new THREE.Mesh(fluidGeo, chromeMat);
      scene.add(fluidMesh);

      // Orbiting Liquid Chrome Satellite Droplets
      const dropletCount = 3;
      const droplets: THREE.Mesh[] = [];
      const dropletAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
      const dropGeo = new THREE.SphereGeometry(0.13, 48, 32);

      for (let d = 0; d < dropletCount; d++) {
        const drop = new THREE.Mesh(dropGeo, chromeMat);
        scene.add(drop);
        droplets.push(drop);
      }

      // Animation & Fluid Dynamics Loop
      let animationFrameId: number;
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const stIdx = currentIdxRef.current;
        const mode = FLUID_STATIONS[stIdx]?.fluidMode || "sphere";

        // Decay touch disturbance
        touchDisturbRef.current.intensity *= 0.94;

        // Fluid deformation calculation
        const pos = fluidGeo.attributes.position;
        const v = new THREE.Vector3();
        const n = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(origPos, i);
          n.copy(v).normalize();

          let displacement = 0;

          if (mode === "sphere") {
            // Calm, undulating liquid platinum core
            const wave1 = Math.sin(v.x * 2.2 + t * 1.6) * Math.cos(v.y * 2.4 + t * 1.3);
            const wave2 = Math.sin(v.z * 2.8 - t * 1.8) * 0.35;
            displacement = (wave1 + wave2) * 0.16;
          } else if (mode === "torus") {
            // Kinetic fluid vortex / torus ripple
            const theta = Math.atan2(v.z, v.x);
            const wave1 = Math.sin(theta * 3.0 + t * 2.4) * Math.cos(v.y * 3.0);
            const indent = -Math.sin(Math.abs(v.y) * 1.8) * 0.22;
            displacement = (wave1 + indent) * 0.18;
          } else if (mode === "ferro") {
            // High-frequency magnetic ferrofluid spikes
            const spike1 = Math.sin(v.x * 6.5 + t * 4.2) * Math.cos(v.y * 6.5 - t * 3.8);
            const spike2 = Math.sin(v.z * 5.0 + t * 3.0) * 0.45;
            displacement = (spike1 + spike2) * 0.12;
          } else {
            // Classical pristine mercury droplet relaxation
            const teardrop = (1.0 - v.y * 0.35) * 0.08;
            const gentleWave = Math.sin(v.x * 1.5 + t * 1.1) * 0.09;
            displacement = teardrop + gentleWave;
          }

          // Apply interactive touch ripple
          if (touchDisturbRef.current.intensity > 0.01) {
            const dist = Math.sqrt(
              Math.pow(v.x - touchDisturbRef.current.x, 2) +
                Math.pow(v.y - touchDisturbRef.current.y, 2)
            );
            const ripple =
              Math.sin(dist * 12.0 - t * 14.0) *
              touchDisturbRef.current.intensity *
              0.15;
            displacement += ripple;
          }

          v.addScaledVector(n, displacement);
          pos.setXYZ(i, v.x, v.y, v.z);
        }

        pos.needsUpdate = true;
        fluidGeo.computeVertexNormals();

        // Slow fluid rotation
        fluidMesh.rotation.y = t * 0.2;
        fluidMesh.rotation.x = Math.sin(t * 0.25) * 0.12;

        // Orbiting droplets
        droplets.forEach((drop, d) => {
          const angle = t * 0.65 + dropletAngles[d];
          const rad = 1.75 + Math.sin(t * 1.4 + d) * 0.18;
          const dropY = Math.sin(t * 1.2 + d * 2.0) * 0.55;
          drop.position.set(Math.cos(angle) * rad, dropY, Math.sin(angle) * rad * 0.75);
          drop.scale.setScalar(0.9 + Math.sin(t * 2.8 + d) * 0.15);
        });

        renderer.render(scene, camera);
      };
      animate();

      // Touch / Drag handler to ripple liquid surface
      const handlePointer = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        touchDisturbRef.current = {
          x: normX * 1.2,
          y: normY * 1.2,
          intensity: 0.85,
        };
      };

      const dom = renderer.domElement;
      dom.addEventListener("pointerdown", handlePointer);
      dom.addEventListener("pointermove", handlePointer);

      // Resize
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        dom.removeEventListener("pointerdown", handlePointer);
        dom.removeEventListener("pointermove", handlePointer);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        if (dom.parentElement) dom.parentElement.removeChild(dom);
      };
    }, []);

    const activeStation = FLUID_STATIONS[currentIdx];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between select-none pointer-events-auto overflow-hidden bg-transparent">
        {/* 1. TOP MINIMAL BADGE (Clean, single-line, safe below fixed navbar) */}
        <div className="w-full pt-16 px-6 flex items-center justify-between z-20 max-w-sm pointer-events-none whitespace-nowrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
            <span
              className="w-2 h-2 rounded-full animate-pulse transition-colors duration-500"
              style={{ backgroundColor: activeStation.accentColor }}
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/90">
              {activeStation.statusLabel}
            </span>
          </div>
          <div className="text-[11px] font-mono text-white/50 tracking-widest pl-2">
            [{activeStation.num} / 04]
          </div>
        </div>

        {/* 2. THE 3D LIQUID CHROME CANVAS (~80% OF SCREEN) */}
        <div
          ref={mountRef}
          className="w-full flex-1 relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        />

        {/* 3. BOTTOM MINIMAL STATUS BAR */}
        <div className="w-full pb-8 px-6 z-20 flex flex-col items-center gap-3 max-w-sm">
          <div className="w-full text-center">
            <h3 className="text-white font-semibold text-base tracking-tight leading-snug">
              {activeStation.title}
            </h3>
            <p className="text-white/60 text-xs mt-1 leading-relaxed line-clamp-2">
              {activeStation.role}
            </p>
          </div>

          {/* Quick Station Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
            {FLUID_STATIONS.map((st, i) => (
              <button
                key={st.num}
                onClick={() => {
                  setCurrentIdx(i);
                  playHapticTick();
                }}
                className={`px-3.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  i === currentIdx
                    ? "bg-white text-black font-semibold shadow-lg shadow-white/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {st.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

LiquidChromeCreed.displayName = "LiquidChromeCreed";

