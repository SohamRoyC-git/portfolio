"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award } from "lucide-react";

export interface PillarData {
  num: string;
  short: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  status: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  chips: string[];
  benchLabel: string;
  benchValue: string;
  benchPercent: number;
}

export const CELESTIAL_PILLARS: PillarData[] = [
  {
    num: "01",
    short: "NSEC AIML",
    tag: "ACADEMIC CORE",
    title: "Netaji Subhash Engineering College",
    role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
    desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
    status: "CURRENT CANDIDATE",
    icon: GraduationCap,
    chips: ["NEURAL ARCHITECTURES", "COMPUTATIONAL ALGEBRA", "HIGH-THROUGHPUT"],
    benchLabel: "SYSTEM BENCH",
    benchValue: "99.4% CONVERGENCE",
    benchPercent: 94,
  },
  {
    num: "02",
    short: "LCF RIGA",
    tag: "EUROPEAN OPS",
    title: "Latvian Cricket Federation",
    role: "National Sports Governing Body Digital Ecosystem",
    desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga & European circuits.",
    status: "PRODUCTION SYSTEM",
    icon: Trophy,
    chips: ["EU COMPLIANCE", "LIVE TELEMETRY", "RIGA CIRCUIT"],
    benchLabel: "EU TELEMETRY",
    benchValue: "RIGA · ACTIVE 100%",
    benchPercent: 100,
  },
  {
    num: "03",
    short: "5MS ENGINE",
    tag: "< 5MS ENGINE",
    title: "278-Key In-Memory Localization Engine",
    role: "Zero-API Sub-Millisecond Bilingual Translation",
    desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
    status: "PROPRIETARY CORE",
    icon: Cpu,
    chips: ["ZERO-API", "SUB-MILLISECOND", "EU-CIS TRADE"],
    benchLabel: "LATENCY BENCH",
    benchValue: "< 4.8MS ROUNDTRIP",
    benchPercent: 98,
  },
  {
    num: "04",
    short: "HERITAGE",
    tag: "DISTINCTION",
    title: "The Heritage School",
    role: "ISC Class XII (82.75%) · ICSE (89.4%)",
    desc: "Distinction in Computer Science & Mathematics. Rigorous foundations in pure algorithmic logic, object-oriented design, and discrete mathematics.",
    status: "ALUMNI DISTINCTION",
    icon: Award,
    chips: ["ALGORITHMIC LOGIC", "DISCRETE MATH", "OOP ARCHITECTURE"],
    benchLabel: "ALGORITHMIC LOGIC",
    benchValue: "ISC DISTINCTION",
    benchPercent: 92,
  },
];

interface CelestialCreedGlobeProps {
  progress?: number; // 0 to 1 scroll progress from parent GSAP
  isExiting?: boolean;
  onPillarSelect?: (index: number) => void;
}

export const CelestialCreedGlobe: React.FC<CelestialCreedGlobeProps> = memo(
  ({ progress = 0, isExiting = false, onPillarSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [activePillar, setActivePillar] = useState<number>(0);
    const activePillarRef = useRef<number>(0);

    // Three.js object references
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const globeGroupRef = useRef<THREE.Group | null>(null);
    const nodesRef = useRef<THREE.Mesh[]>([]);
    const animIdRef = useRef<number | null>(null);

    // Interaction physics state
    const isDraggingRef = useRef<boolean>(false);
    const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.15, y: 0 });
    const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.15, y: 0 });
    const lastUserActionTimeRef = useRef<number>(0);

    // Audio context for haptic micro-clicks
    const audioCtxRef = useRef<AudioContext | null>(null);
    const playHapticAudio = useCallback(() => {
      try {
        if (typeof window === "undefined") return;
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        if (audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.09);
        }
      } catch {}
    }, []);

    // Rotate globe to target pillar index
    const rotateToPillar = useCallback((idx: number) => {
      playHapticAudio();
      activePillarRef.current = idx;
      setActivePillar(idx);
      lastUserActionTimeRef.current = Date.now();

      // Node angles: 0: 0 rad, 1: -PI/2 rad, 2: -PI rad, 3: -3PI/2 rad
      // To bring node to front facing camera (+Z), we set rotation.y to -angle
      const targetY = -idx * (Math.PI / 2);

      // Normalize current rotation so we take the shortest path
      let diff = targetY - rotationTargetRef.current.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      rotationTargetRef.current.y += diff;
      rotationTargetRef.current.x = 0.12; // subtle level tilt
    }, [playHapticAudio]);

    // Handle scroll progress mapping from parent GSAP
    useEffect(() => {
      // If user hasn't dragged within the last 1.2s, scroll controls the globe
      if (Date.now() - lastUserActionTimeRef.current > 1200 && !isDraggingRef.current) {
        // Map progress (0 to 1) across the 4 nodes (0 to 3)
        const targetPillarIdx = Math.min(3, Math.max(0, Math.floor(progress * 4)));
        if (targetPillarIdx !== activePillarRef.current) {
          activePillarRef.current = targetPillarIdx;
          setActivePillar(targetPillarIdx);
        }
        // Continuous smooth rotation across the 4 quadrants
        const targetAngleY = -progress * (Math.PI * 1.5);
        rotationTargetRef.current.y = targetAngleY;
      }
    }, [progress]);

    // Setup Three.js WebGL Scene
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 340;
      const height = rect.height || 280;

      // Scene & Camera
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
      camera.position.set(0, 0.25, 3.4);
      cameraRef.current = camera;

      // Renderer with transparent background and max pixel ratio 2
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      // Main rotatable globe group
      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      scene.add(globeGroup);

      // =======================================================================
      // 1. CORE FROSTED GLASS / OBSIDIAN SPHERE
      // Custom Fresnel shader for luxury champagne/platinum rim lighting
      // =======================================================================
      const sphereGeo = new THREE.SphereGeometry(1.12, 36, 36);
      const sphereMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.6);
            // Ultra-clean void black interior with liquid champagne platinum rim glow
            vec3 core = vec3(0.035, 0.040, 0.055);
            vec3 rim = vec3(0.92, 0.88, 0.82);
            vec3 col = mix(core, rim, fresnel * 0.85);
            gl_FragColor = vec4(col, 0.90);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      });
      const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(coreSphere);

      // =======================================================================
      // 2. LUXURY WIREFRAME ASTROLABE RINGS (Hairline Titanium White)
      // =======================================================================
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      });
      const accentRingMat = new THREE.MeshBasicMaterial({
        color: 0xead7c0, // Pale Champagne
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });

      // Equator Ring
      const equatorGeo = new THREE.RingGeometry(1.22, 1.235, 64);
      const equatorRing = new THREE.Mesh(equatorGeo, accentRingMat);
      equatorRing.rotation.x = Math.PI / 2;
      globeGroup.add(equatorRing);

      // Tilted Orbital Rings (Astrolabe inclination)
      const orbit1Geo = new THREE.RingGeometry(1.28, 1.295, 64);
      const orbit1Ring = new THREE.Mesh(orbit1Geo, ringMat);
      orbit1Ring.rotation.set(Math.PI / 4, Math.PI / 6, 0);
      globeGroup.add(orbit1Ring);

      const orbit2Geo = new THREE.RingGeometry(1.28, 1.295, 64);
      const orbit2Ring = new THREE.Mesh(orbit2Geo, ringMat);
      orbit2Ring.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);
      globeGroup.add(orbit2Ring);

      // Latitude circles (+35° and -35°)
      const latRadius = 1.12 * Math.cos(Math.PI / 5);
      const latY = 1.12 * Math.sin(Math.PI / 5);
      const latGeo = new THREE.RingGeometry(latRadius, latRadius + 0.012, 48);

      const latNorth = new THREE.Mesh(latGeo, ringMat);
      latNorth.position.y = latY;
      latNorth.rotation.x = Math.PI / 2;
      globeGroup.add(latNorth);

      const latSouth = new THREE.Mesh(latGeo, ringMat);
      latSouth.position.y = -latY;
      latSouth.rotation.x = Math.PI / 2;
      globeGroup.add(latSouth);

      // =======================================================================
      // 3. 4 CONSTELLATION SATELLITE BEACONS (The 4 Pillars)
      // Placed around the equator at 90° intervals (Radius: 1.24)
      // =======================================================================
      const nodeMeshes: THREE.Mesh[] = [];
      const R = 1.24;

      for (let i = 0; i < 4; i++) {
        const angle = i * (Math.PI / 2);
        const x = Math.sin(angle) * R;
        const z = Math.cos(angle) * R;

        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, 0, z);

        // Core glowing dot
        const dotGeo = new THREE.SphereGeometry(0.048, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        nodeGroup.add(dotMesh);

        // Outer pulsing beacon halo ring
        const haloGeo = new THREE.RingGeometry(0.08, 0.098, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xead7c0,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.lookAt(x * 2, 0, z * 2);
        nodeGroup.add(haloMesh);

        globeGroup.add(nodeGroup);
        nodeMeshes.push(dotMesh);
      }
      nodesRef.current = nodeMeshes;

      // Geodesic Arcs connecting the 4 nodes
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        curvePoints.push(new THREE.Vector3(Math.sin(angle) * R, 0, Math.cos(angle) * R));
      }
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xead7c0,
        transparent: true,
        opacity: 0.35,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // =======================================================================
      // 4. MICRO-STARDUST PARTICLE FIELD (160 diamond embers)
      // =======================================================================
      const particleCount = 140;
      const particlePos = new Float32Array(particleCount * 3);
      for (let p = 0; p < particleCount; p++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const rad = 1.32 + Math.random() * 0.18;
        particlePos[p * 3] = rad * Math.sin(phi) * Math.cos(theta);
        particlePos[p * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        particlePos[p * 3 + 2] = rad * Math.cos(phi);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 0.026,
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
      });
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      globeGroup.add(dustPoints);

      // =======================================================================
      // 5. ANIMATION & TOUCH PHYSICS RENDER LOOP
      // =======================================================================
      let lastTime = performance.now();

      const animate = (time: number) => {
        animIdRef.current = requestAnimationFrame(animate);
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        // Apply physics damping when finger is lifted
        if (!isDraggingRef.current) {
          velocityRef.current.x *= 0.93;
          velocityRef.current.y *= 0.93;

          rotationTargetRef.current.y += velocityRef.current.y;
          rotationTargetRef.current.x += velocityRef.current.x;

          // Clamp X pitch to prevent flipping upside down (±32°)
          rotationTargetRef.current.x = Math.max(-0.55, Math.min(0.55, rotationTargetRef.current.x));

          // Gentle idle float if untouched
          if (Math.abs(velocityRef.current.y) < 0.0005 && Date.now() - lastUserActionTimeRef.current > 3000) {
            rotationTargetRef.current.y += 0.0018;
          }
        }

        // Smooth Slerp / Lerp toward rotation target
        currentRotationRef.current.y += (rotationTargetRef.current.y - currentRotationRef.current.y) * 0.12;
        currentRotationRef.current.x += (rotationTargetRef.current.x - currentRotationRef.current.x) * 0.12;

        globeGroup.rotation.y = currentRotationRef.current.y;
        globeGroup.rotation.x = currentRotationRef.current.x;

        // Rotate diamond embers subtly
        dustPoints.rotation.y += 0.0008;

        // Detect which node is currently facing front toward camera
        // Node world coordinates: node 0: 0°, node 1: 90°, node 2: 180°, node 3: 270°
        // Normalized Y rotation modulo 2PI:
        let normY = ((-currentRotationRef.current.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const closestNodeIdx = Math.round(normY / (Math.PI / 2)) % 4;

        if (closestNodeIdx !== activePillarRef.current) {
          activePillarRef.current = closestNodeIdx;
          setActivePillar(closestNodeIdx);
          playHapticAudio();
        }

        renderer.render(scene, camera);
      };

      animIdRef.current = requestAnimationFrame(animate);

      // Handle Resize smoothly
      const handleResize = () => {
        if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
        const box = canvasRef.current.getBoundingClientRect();
        const w = box.width || 340;
        const h = box.height || 280;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h, false);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);

      return () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        resizeObserver.disconnect();
        renderer.dispose();
      };
    }, [playHapticAudio]);

    // Touch & Pointer Gesture Handlers
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
      lastUserActionTimeRef.current = Date.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const vY = deltaX * 0.0075;
      const vX = deltaY * 0.0045;

      velocityRef.current = { x: vX, y: vY };
      rotationTargetRef.current.y += vY;
      rotationTargetRef.current.x += vX;

      // Clamp X pitch
      rotationTargetRef.current.x = Math.max(-0.55, Math.min(0.55, rotationTargetRef.current.x));
      lastUserActionTimeRef.current = Date.now();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = false;
      lastUserActionTimeRef.current = Date.now();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    };

    const currentPillarData = CELESTIAL_PILLARS[activePillar] || CELESTIAL_PILLARS[0];
    const IconComponent = currentPillarData.icon;

    return (
      <div
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-between pointer-events-auto select-none"
      >
        {/* Top Minimalist Header Tag */}
        <div className="w-full flex items-center justify-between px-2 pt-2 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAD7C0] animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.24em] text-[#EAD7C0] uppercase font-bold">
              THE ARCHITECTURAL CREED
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/40">
            [ <span className="text-[#EAD7C0] font-bold">0{activePillar + 1}</span> / 04 ]
          </div>
        </div>

        {/* 3D Interactive Three.js Celestial Globe Canvas */}
        <div className="relative w-full h-[260px] sm:h-[280px] flex items-center justify-center my-0.5 overflow-hidden">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: "none" }}
          />

          {/* Interactive Hint Indicator Overlay */}
          <div className="absolute top-2 right-2 pointer-events-none px-2 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="font-mono text-[8px] tracking-[0.18em] text-white/50 uppercase">
              TOUCH &amp; DRAG TO SPIN
            </span>
          </div>

          {/* Core Horizon Glow Behind Globe */}
          <div className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(234,215,192,0.12)_0%,rgba(255,255,255,0.03)_50%,transparent_75%)] blur-2xl pointer-events-none -z-10" />
        </div>

        {/* Clean Luxury Liquid Glass Editorial Monograph Card */}
        <div className="w-full bg-[#0A0D14]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between transition-all duration-300">
          <div>
            {/* Monograph Top Meta */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-helvetica font-normal text-2xl text-white/30 leading-none">
                {currentPillarData.num}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAD7C0]/10 border border-[#EAD7C0]/30">
                <IconComponent size={12} className="text-[#EAD7C0]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#F3E8D8]">
                  {currentPillarData.tag}
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h4 className="font-sans font-bold text-base sm:text-lg text-white leading-snug mb-1">
              {currentPillarData.title}
            </h4>
            <div className="text-[11px] font-mono text-[#EAD7C0] mb-2 leading-snug">
              {currentPillarData.role}
            </div>

            {/* Narrative Description */}
            <p className="font-sans text-[11px] text-slate-300 leading-relaxed mb-3">
              {currentPillarData.desc}
            </p>

            {/* Minimalist System Benchmark Bar */}
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 mb-2.5">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mb-1">
                <span>{currentPillarData.benchLabel}</span>
                <span className="text-emerald-300 font-semibold">{currentPillarData.benchValue}</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400/80 to-[#EAD7C0] transition-all duration-500 rounded-full"
                  style={{ width: `${currentPillarData.benchPercent}%` }}
                />
              </div>
            </div>

            {/* Spec Chips */}
            <div className="flex flex-wrap gap-1 mb-2">
              {currentPillarData.chips.map((chip, cIdx) => (
                <span
                  key={cIdx}
                  className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-white/5 border border-white/10 text-slate-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Selector Tabs [ 01 NSEC ] [ 02 LCF ] [ 03 5MS ] [ 04 HERITAGE ] */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1 mt-1">
            {CELESTIAL_PILLARS.map((p, pIdx) => {
              const isSelected = pIdx === activePillar;
              return (
                <button
                  key={pIdx}
                  onClick={() => rotateToPillar(pIdx)}
                  className={`flex-1 py-1 rounded text-[8px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white/15 text-white border border-white/30 font-bold shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                      : "bg-white/5 text-white/40 border border-transparent hover:text-white/70"
                  }`}
                >
                  {p.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

CelestialCreedGlobe.displayName = "CelestialCreedGlobe";

