"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award, ChevronUp, ChevronDown } from "lucide-react";

export interface StationData {
  num: string;
  short: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  chips: string[];
  benchLabel: string;
  benchValue: string;
  benchPercent: number;
  targetAngleY: number; // Y rotation angle to align station directly under 12 o'clock needle
}

export const ROTARY_STATIONS: StationData[] = [
  {
    num: "01",
    short: "Academic",
    tag: "Academic Core",
    title: "Netaji Subhash Engineering College",
    role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
    desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
    icon: GraduationCap,
    chips: ["Neural Architectures", "Computational Algebra", "High-Throughput Systems"],
    benchLabel: "System Convergence",
    benchValue: "99.4%",
    benchPercent: 94,
    targetAngleY: 0.0,
  },
  {
    num: "02",
    short: "European Ops",
    tag: "European Operations",
    title: "Latvian Cricket Federation",
    role: "National Sports Governing Body Digital Ecosystem",
    desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems across Riga and European circuits.",
    icon: Trophy,
    chips: ["EU Compliance", "Live Telemetry", "Riga Circuit"],
    benchLabel: "Telemetry Stream",
    benchValue: "100% Active",
    benchPercent: 100,
    targetAngleY: Math.PI * 0.5,
  },
  {
    num: "03",
    short: "Localization",
    tag: "High-Performance Core",
    title: "278-Key In-Memory Localization Engine",
    role: "Zero-API Sub-Millisecond Bilingual Translation",
    desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels between EU and CIS.",
    icon: Cpu,
    chips: ["Zero-API", "Sub-Millisecond", "Trade Pipeline"],
    benchLabel: "Roundtrip Latency",
    benchValue: "< 4.8ms",
    benchPercent: 98,
    targetAngleY: Math.PI,
  },
  {
    num: "04",
    short: "Heritage",
    tag: "Algorithmic Foundation",
    title: "The Heritage School",
    role: "ISC Class XII (82.75%) · ICSE (89.4%)",
    desc: "Distinction in Computer Science and Mathematics. Rigorous foundations in pure algorithmic logic, object-oriented design, and discrete mathematics.",
    icon: Award,
    chips: ["Algorithmic Logic", "Discrete Math", "OOP Systems"],
    benchLabel: "Academic Distinction",
    benchValue: "Top Tier",
    benchPercent: 92,
    targetAngleY: Math.PI * 1.5,
  },
];

interface TactileRotaryDialProps {
  progress?: number;
  onStationSelect?: (index: number) => void;
}

export const TactileRotaryDial: React.FC<TactileRotaryDialProps> = memo(
  ({ progress = 0, onStationSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [activeStation, setActiveStation] = useState<number>(0);
    const activeStationRef = useRef<number>(0);
    const [isDetailExpanded, setIsDetailExpanded] = useState<boolean>(true);

    // Three.js object references
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const dialAssemblyRef = useRef<THREE.Group | null>(null);
    const animIdRef = useRef<number | null>(null);

    // Rotation physics state
    const isDraggingRef = useRef<boolean>(false);
    const lastPointerXRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);
    const targetAngleRef = useRef<number>(0);
    const currentAngleRef = useRef<number>(0);
    const lastUserActionTimeRef = useRef<number>(0);
    const lastTickAngleRef = useRef<number>(0);

    // Web Audio Synthesizer for Mechanical Haptics
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Fine chronometer mechanical micro-click (tick mark crossed)
    const playMicroTickAudio = useCallback(() => {
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
          osc.frequency.setValueAtTime(1600, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.010);
          gain.gain.setValueAtTime(0.009, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.010);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.012);
        }
      } catch {}
    }, []);

    // Solid magnetic latch click (detent locked)
    const playMagneticLatchAudio = useCallback(() => {
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
          osc.type = "triangle";
          osc.frequency.setValueAtTime(460, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.032);
          gain.gain.setValueAtTime(0.026, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.032);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.035);
        }
      } catch {}
    }, []);

    // Rotate dial directly to target station
    const rotateToStation = useCallback(
      (idx: number) => {
        playMagneticLatchAudio();
        activeStationRef.current = idx;
        setActiveStation(idx);
        lastUserActionTimeRef.current = Date.now();

        const target = ROTARY_STATIONS[idx].targetAngleY;
        let diff = target - (targetAngleRef.current % (Math.PI * 2));
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        targetAngleRef.current += diff;
        if (onStationSelect) onStationSelect(idx);
      },
      [playMagneticLatchAudio, onStationSelect]
    );

    // Sync scroll progress from parent GSAP when user is not manually interacting
    useEffect(() => {
      if (Date.now() - lastUserActionTimeRef.current > 1400 && !isDraggingRef.current) {
        const targetIdx = Math.min(3, Math.max(0, Math.floor(progress * 4)));
        if (targetIdx !== activeStationRef.current) {
          activeStationRef.current = targetIdx;
          setActiveStation(targetIdx);
          playMagneticLatchAudio();
        }
        targetAngleRef.current = progress * (Math.PI * 1.5);
      }
    }, [progress, playMagneticLatchAudio]);

    // Setup Three.js WebGL Scene
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 360;
      const height = rect.height || 280;

      // 1. Scene & Camera (Console perspective tilted 28° toward the user)
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
      camera.position.set(0, 2.8, 3.6);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.45;
      rendererRef.current = renderer;

      // 2. High-Precision Studio Lighting (Crisp highlights on titanium knurling & chamfers)
      const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
      keyLight.position.set(4.0, 7.0, 4.0);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xa0aec0, 1.8);
      fillLight.position.set(-4.5, 3.0, 2.5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 3.4);
      rimLight.position.set(0, 8.0, -3.5);
      scene.add(rimLight);

      const frontBounce = new THREE.DirectionalLight(0xffffff, 1.2);
      frontBounce.position.set(0, -1.0, 4.0);
      scene.add(frontBounce);

      const ambientLight = new THREE.AmbientLight(0x475569, 0.95);
      scene.add(ambientLight);

      // Console Tilt Group (Tilts the entire dial mechanism 26° toward user for clear face viewing)
      const consoleTiltGroup = new THREE.Group();
      consoleTiltGroup.rotation.x = 0.46; // ~26.4° console angle
      scene.add(consoleTiltGroup);

      // 3. Stationary Housing / Base Collar
      const housingGroup = new THREE.Group();
      consoleTiltGroup.add(housingGroup);

      // Dark Anodized Titanium Bezel Base
      const baseCollarGeo = new THREE.CylinderGeometry(1.52, 1.58, 0.22, 64);
      const baseCollarMat = new THREE.MeshStandardMaterial({
        color: 0x0d0f14,
        roughness: 0.38,
        metalness: 0.92,
      });
      const baseCollarMesh = new THREE.Mesh(baseCollarGeo, baseCollarMat);
      baseCollarMesh.position.y = -0.12;
      housingGroup.add(baseCollarMesh);

      // Stationary 12 O'Clock Optical Alignment Index Needle
      const needleGeo = new THREE.BoxGeometry(0.046, 0.06, 0.38);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const needleMesh = new THREE.Mesh(needleGeo, needleMat);
      needleMesh.position.set(0, 0.22, -1.30);
      housingGroup.add(needleMesh);

      // Luminous alignment index pip
      const haloGeo = new THREE.RingGeometry(0.05, 0.085, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.set(0, 0.24, -1.14);
      housingGroup.add(haloMesh);

      // 4. Rotatable CNC Machined Dial Assembly
      const dialAssembly = new THREE.Group();
      dialAssemblyRef.current = dialAssembly;
      consoleTiltGroup.add(dialAssembly);

      // A. Procedural Diamond Knurling Normal Map
      function createKnurlingNormalTexture(): THREE.CanvasTexture {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 128;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgb(128, 128, 255)";
          ctx.fillRect(0, 0, 512, 128);

          const numRibs = 128;
          const ribW = 512 / numRibs;
          for (let i = 0; i < numRibs; i++) {
            const x = i * ribW;
            const grad = ctx.createLinearGradient(x, 0, x + ribW, 0);
            grad.addColorStop(0, "rgb(70, 70, 255)");
            grad.addColorStop(0.5, "rgb(128, 128, 255)");
            grad.addColorStop(1, "rgb(210, 210, 255)");
            ctx.fillStyle = grad;
            ctx.fillRect(x, 0, ribW, 128);
          }
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(5, 1);
        return tex;
      }

      // B. Procedural Chronometer Face Texture (Engraved Station Markers & Ticks)
      function createBezelDialTexture(): THREE.CanvasTexture {
        const c = document.createElement("canvas");
        c.width = 1024;
        c.height = 1024;
        const ctx = c.getContext("2d");
        if (ctx) {
          const cx = 512;
          const cy = 512;

          // Radial concentric brushed titanium finish
          const bgGrad = ctx.createRadialGradient(cx, cy, 60, cx, cy, 512);
          bgGrad.addColorStop(0, "#222730");
          bgGrad.addColorStop(0.5, "#181C23");
          bgGrad.addColorStop(0.85, "#10131A");
          bgGrad.addColorStop(1, "#0A0C10");
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, 1024, 1024);

          // Concentric micro-machining spirals
          ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
          ctx.lineWidth = 1;
          for (let r = 220; r < 490; r += 12) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Chronometer Micro-Tick Marks around perimeter
          for (let deg = 0; deg < 360; deg += 3) {
            const rad = (deg * Math.PI) / 180;
            const isMajor = deg % 30 === 0;
            const isSemi = deg % 15 === 0;
            const rIn = isMajor ? 434 : isSemi ? 448 : 460;
            const rOut = 478;

            ctx.strokeStyle = isMajor
              ? "rgba(255, 255, 255, 0.95)"
              : isSemi
              ? "rgba(255, 255, 255, 0.60)"
              : "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = isMajor ? 4.0 : isSemi ? 2.2 : 1.2;

            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * rIn, cy + Math.sin(rad) * rIn);
            ctx.lineTo(cx + Math.cos(rad) * rOut, cy + Math.sin(rad) * rOut);
            ctx.stroke();
          }

          // 4 Main Quadrant Stations: 01, 02, 03, 04
          // 01 is at Top (270° in canvas = -Z in Three.js)
          const stations = [
            { num: "01", label: "ACADEMIC", angleDeg: 270 },
            { num: "02", label: "EUROPEAN", angleDeg: 0 },
            { num: "03", label: "ENGINE", angleDeg: 90 },
            { num: "04", label: "HERITAGE", angleDeg: 180 },
          ];

          stations.forEach((st) => {
            const rad = (st.angleDeg * Math.PI) / 180;
            const dist = 356;
            const px = cx + Math.cos(rad) * dist;
            const py = cy + Math.sin(rad) * dist;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(rad + Math.PI / 2);

            // Numerals (Pure Swiss Bold Sans, High-Contrast White)
            ctx.font = "bold 52px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
            ctx.shadowBlur = 8;
            ctx.fillText(st.num, 0, -8);
            ctx.shadowBlur = 0;

            // Sub-label
            ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.letterSpacing = "2px";
            ctx.fillText(st.label, 0, 24);

            ctx.restore();
          });
        }
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return tex;
      }

      // Outer Tier: Knurled Titanium Grip Ring
      const knurlNormalTex = createKnurlingNormalTexture();
      const dialRimGeo = new THREE.CylinderGeometry(1.40, 1.40, 0.32, 96, 1, true);
      const dialRimMat = new THREE.MeshStandardMaterial({
        color: 0xd4d9e4,
        metalness: 0.94,
        roughness: 0.20,
        normalMap: knurlNormalTex,
        normalScale: new THREE.Vector2(0.95, 0.95),
      });
      const dialRimMesh = new THREE.Mesh(dialRimGeo, dialRimMat);
      dialRimMesh.position.y = 0.05;
      dialAssembly.add(dialRimMesh);

      // Polished Top Chamfer Bevel Ring (Razor-sharp specular glint)
      const bevelGeo = new THREE.RingGeometry(1.30, 1.40, 96);
      const bevelMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.08,
        side: THREE.DoubleSide,
      });
      const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
      bevelMesh.rotation.x = -Math.PI / 2;
      bevelMesh.position.y = 0.21;
      dialAssembly.add(bevelMesh);

      // Engraved Chronometer Face Disc
      const bezelTex = createBezelDialTexture();
      const dialFaceGeo = new THREE.CircleGeometry(1.30, 96);
      const dialFaceMat = new THREE.MeshStandardMaterial({
        map: bezelTex,
        metalness: 0.88,
        roughness: 0.24,
        side: THREE.DoubleSide,
      });
      const dialFaceMesh = new THREE.Mesh(dialFaceGeo, dialFaceMat);
      dialFaceMesh.rotation.x = -Math.PI / 2;
      dialFaceMesh.position.y = 0.208;
      dialAssembly.add(dialFaceMesh);

      // Recessed Center Smoked Sapphire Lens
      const crystalGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 48);
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x141824,
        metalness: 0.15,
        roughness: 0.04,
        transmission: 0.5,
        ior: 1.55,
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalMesh.position.y = 0.23;
      dialAssembly.add(crystalMesh);

      // Center Specular Aperture Ring
      const apertureRingGeo = new THREE.RingGeometry(0.36, 0.38, 48);
      const apertureRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const apertureRingMesh = new THREE.Mesh(apertureRingGeo, apertureRingMat);
      apertureRingMesh.rotation.x = -Math.PI / 2;
      apertureRingMesh.position.y = 0.272;
      dialAssembly.add(apertureRingMesh);

      // 5. Physics Animation Loop
      let lastTime = performance.now();

      const animate = (time: number) => {
        animIdRef.current = requestAnimationFrame(animate);
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        if (!isDraggingRef.current) {
          velocityRef.current *= 0.90;
          targetAngleRef.current += velocityRef.current;

          // Magnetically snap to nearest 90-degree quadrant detent
          if (
            Math.abs(velocityRef.current) < 0.003 &&
            Date.now() - lastUserActionTimeRef.current > 400
          ) {
            const step = Math.PI / 2;
            const snappedAngle = Math.round(targetAngleRef.current / step) * step;
            targetAngleRef.current += (snappedAngle - targetAngleRef.current) * 0.14;
          }
        }

        // Smooth Lerp toward target angle
        currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.14;
        dialAssembly.rotation.y = currentAngleRef.current;

        // Detect mechanical micro-tick clicks (every 15 degrees)
        const tickStep = Math.PI / 12;
        if (Math.abs(currentAngleRef.current - lastTickAngleRef.current) >= tickStep) {
          lastTickAngleRef.current = currentAngleRef.current;
          playMicroTickAudio();
        }

        // Active station detection (normalized angle to [0, 4))
        let normAngle = ((currentAngleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const closestIdx = Math.round(normAngle / (Math.PI / 2)) % 4;

        if (closestIdx !== activeStationRef.current) {
          activeStationRef.current = closestIdx;
          setActiveStation(closestIdx);
          playMagneticLatchAudio();
        }

        renderer.render(scene, camera);
      };

      animIdRef.current = requestAnimationFrame(animate);

      const handleResize = () => {
        if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
        const box = canvasRef.current.getBoundingClientRect();
        const w = box.width || 360;
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
    }, [playMicroTickAudio, playMagneticLatchAudio]);

    // Pointer Event Handlers for Tangible Dial Rotation
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      velocityRef.current = 0;
      lastUserActionTimeRef.current = Date.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;

      const v = deltaX * 0.0095;
      velocityRef.current = v;
      targetAngleRef.current += v;
      lastUserActionTimeRef.current = Date.now();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = false;
      lastUserActionTimeRef.current = Date.now();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    };

    const currentStationData = ROTARY_STATIONS[activeStation] || ROTARY_STATIONS[0];
    const IconComponent = currentStationData.icon;

    return (
      <div
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-between pointer-events-auto select-none"
      >
        {/* Minimalist Monochrome Header Tag */}
        <div className="w-full flex items-center justify-between px-3 pt-1 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] tracking-[0.24em] text-white/80 uppercase font-medium">
              Architectural Creed
            </span>
          </div>
          <div className="text-[10px] tracking-widest text-white/40 font-mono">
            [ <span className="text-white font-bold">0{activeStation + 1}</span> / 04 ]
          </div>
        </div>

        {/* 3D Tactile Precision Rotary Dial Canvas */}
        <div className="relative w-full h-[250px] xs:h-[270px] flex items-center justify-center my-0.5 overflow-hidden">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full cursor-ew-resize active:cursor-grabbing touch-none"
            style={{ touchAction: "none" }}
          />

          {/* Minimalist Touch Guidance Badge */}
          <div className="absolute top-2 right-2 pointer-events-none px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="text-[8px] tracking-[0.16em] text-white/50 uppercase font-medium">
              Rotate Dial
            </span>
          </div>

          {/* Subtle Studio Void Backlight */}
          <div className="absolute w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,rgba(148,163,184,0.02)_50%,transparent_75%)] blur-2xl pointer-events-none -z-10" />
        </div>

        {/* Apple-Grade Liquid Glass Monograph Card */}
        <div className="w-full bg-white/[0.04] backdrop-blur-3xl border border-white/15 border-t-white/30 border-b-white/8 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col justify-between transition-all duration-300">
          <div>
            {/* Card Header & Expand/Collapse Toggle */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-light text-white/40 leading-none">
                  {currentStationData.num}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                  <IconComponent size={12} className="text-white" />
                  <span className="text-[9px] font-medium tracking-wide text-white uppercase">
                    {currentStationData.tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-wider text-white/70 hover:text-white bg-white/5 border border-white/10 cursor-pointer transition-colors"
                aria-label="Toggle details"
              >
                <span>{isDetailExpanded ? "Collapse" : "Expand"}</span>
                {isDetailExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>

            {/* Title & Role */}
            <h4 className="font-sans font-bold text-base sm:text-lg text-white leading-snug mb-1">
              {currentStationData.title}
            </h4>
            <div className="text-[11px] text-slate-300 mb-2 leading-snug">
              {currentStationData.role}
            </div>

            {/* Expandable Body */}
            {isDetailExpanded && (
              <div className="space-y-2.5 transition-all duration-300 pt-1">
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
                  {currentStationData.desc}
                </p>

                {/* Minimalist System Benchmark Bar */}
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                    <span>{currentStationData.benchLabel}</span>
                    <span className="text-emerald-300 font-medium">{currentStationData.benchValue}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400/80 to-white/90 transition-all duration-500 rounded-full"
                      style={{ width: `${currentStationData.benchPercent}%` }}
                    />
                  </div>
                </div>

                {/* Spec Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {currentStationData.chips.map((chip, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[8px] bg-white/[0.06] border border-white/10 text-slate-300"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4 Tactile Station Buttons: [ Academic ] [ European Ops ] [ Localization ] [ Heritage ] */}
          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-1.5 mt-2.5">
            {ROTARY_STATIONS.map((st, sIdx) => {
              const isSelected = sIdx === activeStation;
              return (
                <button
                  key={sIdx}
                  onClick={() => rotateToStation(sIdx)}
                  className={`flex-1 py-1 rounded text-[8px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                      : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80"
                  }`}
                >
                  {st.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

TactileRotaryDial.displayName = "TactileRotaryDial";
