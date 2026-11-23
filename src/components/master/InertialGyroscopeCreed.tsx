"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award, ChevronUp, ChevronDown } from "lucide-react";

export interface GyroStationData {
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
  targetAngleY: number;
}

export const GYRO_STATIONS: GyroStationData[] = [
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

interface InertialGyroscopeCreedProps {
  progress?: number;
  onStationSelect?: (index: number) => void;
}

export const InertialGyroscopeCreed: React.FC<InertialGyroscopeCreedProps> = memo(
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
    const outerRingRef = useRef<THREE.Group | null>(null);
    const middleRingRef = useRef<THREE.Group | null>(null);
    const innerRingRef = useRef<THREE.Group | null>(null);
    const animIdRef = useRef<number | null>(null);

    // Interactive physics state
    const isDraggingRef = useRef<boolean>(false);
    const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const targetAngleYRef = useRef<number>(0.0);
    const currentAngleYRef = useRef<number>(0.0);
    const targetTiltXRef = useRef<number>(0.0);
    const currentTiltXRef = useRef<number>(0.0);
    const lastUserActionTimeRef = useRef<number>(0);

    // Web Audio Synthesizer for High-Precision Mechanical Latch Audio
    const audioCtxRef = useRef<AudioContext | null>(null);
    const playMechanicalLatchAudio = useCallback(() => {
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
          osc.frequency.setValueAtTime(1400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.032);
          gain.gain.setValueAtTime(0.024, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.032);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.035);
        }
      } catch {}
    }, []);

    // Rotate gyroscope directly to target station
    const rotateToStation = useCallback(
      (idx: number) => {
        playMechanicalLatchAudio();
        activeStationRef.current = idx;
        setActiveStation(idx);
        lastUserActionTimeRef.current = Date.now();

        const targetY = GYRO_STATIONS[idx].targetAngleY;
        let diffY = targetY - (targetAngleYRef.current % (Math.PI * 2));
        while (diffY < -Math.PI) diffY += Math.PI * 2;
        while (diffY > Math.PI) diffY -= Math.PI * 2;

        targetAngleYRef.current += diffY;
        targetTiltXRef.current = 0.0;

        if (onStationSelect) onStationSelect(idx);
      },
      [playMechanicalLatchAudio, onStationSelect]
    );

    // Synchronize scroll progress from parent GSAP
    useEffect(() => {
      if (Date.now() - lastUserActionTimeRef.current > 1400 && !isDraggingRef.current) {
        const targetIdx = Math.min(3, Math.max(0, Math.floor(progress * 4)));
        if (targetIdx !== activeStationRef.current) {
          activeStationRef.current = targetIdx;
          setActiveStation(targetIdx);
          playMechanicalLatchAudio();
        }
        targetAngleYRef.current = progress * (Math.PI * 1.5);
      }
    }, [progress, playMechanicalLatchAudio]);

    // Setup Three.js WebGL Scene with Studio HDR Environment
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 360;
      const height = rect.height || 300;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
      camera.position.set(0, 0.2, 3.8);
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
      renderer.toneMappingExposure = 1.35;
      rendererRef.current = renderer;

      // 2. High-End Studio Softbox Environment Map (Makes platinum & titanium look real)
      const envCanvas = document.createElement("canvas");
      envCanvas.width = 1024;
      envCanvas.height = 512;
      const envCtx = envCanvas.getContext("2d");
      if (envCtx) {
        // Dark studio background
        envCtx.fillStyle = "#0a0c10";
        envCtx.fillRect(0, 0, 1024, 512);

        // Top softbox light panel
        const topGrad = envCtx.createLinearGradient(0, 0, 0, 180);
        topGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        topGrad.addColorStop(0.7, "rgba(240, 245, 255, 0.4)");
        topGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        envCtx.fillStyle = topGrad;
        envCtx.fillRect(160, 0, 700, 180);

        // Right rim softbox light
        const rightGrad = envCtx.createRadialGradient(850, 220, 20, 850, 220, 200);
        rightGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        rightGrad.addColorStop(0.5, "rgba(200, 220, 255, 0.35)");
        rightGrad.addColorStop(1, "transparent");
        envCtx.fillStyle = rightGrad;
        envCtx.fillRect(650, 50, 374, 340);

        // Left subtle blue fill panel
        const leftGrad = envCtx.createRadialGradient(150, 250, 20, 150, 250, 220);
        leftGrad.addColorStop(0, "rgba(180, 200, 230, 0.6)");
        leftGrad.addColorStop(0.6, "rgba(100, 130, 180, 0.15)");
        leftGrad.addColorStop(1, "transparent");
        envCtx.fillStyle = leftGrad;
        envCtx.fillRect(0, 50, 350, 360);
      }
      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envTexture;

      // 3. Multi-Point Studio Directional Lights
      const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
      keyLight.position.set(4.0, 6.0, 4.0);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.5);
      fillLight.position.set(-4.5, -1.0, 2.5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 3.2);
      rimLight.position.set(0, 7.0, -3.5);
      scene.add(rimLight);

      const ambientLight = new THREE.AmbientLight(0x334155, 0.8);
      scene.add(ambientLight);

      // 4. Master Architectural Tilt Group
      // Tilted 22° pitch & 14° yaw so the user always sees the glorious 3D depth of all 3 rings
      const masterTiltGroup = new THREE.Group();
      masterTiltGroup.rotation.x = 0.38;
      masterTiltGroup.rotation.y = 0.24;
      scene.add(masterTiltGroup);

      // 5. Central Optical Sapphire Core (Silky smooth, zero polygons)
      const coreGroup = new THREE.Group();
      masterTiltGroup.add(coreGroup);

      // Outer flawless optical crystal sphere (64 x 48 segments = pristine curvature)
      const crystalSphereGeo = new THREE.SphereGeometry(0.26, 64, 48);
      const crystalSphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.02,
        transmission: 0.92,
        ior: 1.58,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      });
      const crystalSphereMesh = new THREE.Mesh(crystalSphereGeo, crystalSphereMat);
      coreGroup.add(crystalSphereMesh);

      // Inner miniature floating chronometer core
      const innerCoreGeo = new THREE.SphereGeometry(0.10, 32, 32);
      const innerCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.08,
      });
      const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
      coreGroup.add(innerCoreMesh);

      // Internal light caustics
      const coreLight = new THREE.PointLight(0xffffff, 2.2, 3.5);
      coreGroup.add(coreLight);

      // =======================================================================
      // 6. ULTRA-REALISTIC DUAL-BEVEL GIMBAL RING GENERATOR
      // Dense 160-segment toroidal-bevel geometry eliminating any polygonal faceting
      // =======================================================================
      function createLuxuryGimbalRing(
        radius: number,
        pipeRadius: number,
        bodyMat: THREE.Material,
        chamferMat: THREE.Material,
        segments = 160,
        radialSeg = 48
      ): THREE.Group {
        const ring = new THREE.Group();

        // Main Toroidal Caliper Ring (Prismatically smooth)
        const torusGeo = new THREE.TorusGeometry(radius, pipeRadius, radialSeg, segments);
        const torusMesh = new THREE.Mesh(torusGeo, bodyMat);
        ring.add(torusMesh);

        // Concentric Polished Platinum Hairline Bevel Rings (Top & Bottom specular glints)
        const topBevelGeo = new THREE.RingGeometry(radius - 0.008, radius + 0.008, segments);
        const topBevelMesh = new THREE.Mesh(topBevelGeo, chamferMat);
        topBevelMesh.position.z = pipeRadius + 0.002;
        ring.add(topBevelMesh);

        const bottomBevelMesh = topBevelMesh.clone();
        bottomBevelMesh.position.z = -(pipeRadius + 0.002);
        ring.add(bottomBevelMesh);

        return ring;
      }

      // Materials for Authentic Luxury Horology
      const platinumSatinMat = new THREE.MeshStandardMaterial({
        color: 0xedf2f7,
        metalness: 0.96,
        roughness: 0.14,
        envMapIntensity: 1.5,
      });

      const titaniumSatinMat = new THREE.MeshStandardMaterial({
        color: 0xc4cbd6,
        metalness: 0.94,
        roughness: 0.18,
        envMapIntensity: 1.4,
      });

      const mirrorPlatinumMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.04,
        envMapIntensity: 2.0,
      });

      const goldChatonMat = new THREE.MeshStandardMaterial({
        color: 0xe5b842, // 18k Swiss yellow gold chaton
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 1.8,
      });

      const rubyJewelMat = new THREE.MeshPhysicalMaterial({
        color: 0xba1324, // Deep synthetic red ruby endstone
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.78,
        ior: 1.76,
      });

      // Helper for Swiss Horology Jeweled Pivot Bearings (Gold Chaton + Ruby Cap)
      function createJeweledBearing(): THREE.Group {
        const b = new THREE.Group();
        // Gold chaton collar
        const chatonGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.038, 24);
        const chatonMesh = new THREE.Mesh(chatonGeo, goldChatonMat);
        b.add(chatonMesh);
        // Ruby jewel dome
        const rubyGeo = new THREE.SphereGeometry(0.028, 24, 16);
        const rubyMesh = new THREE.Mesh(rubyGeo, rubyJewelMat);
        rubyMesh.position.y = 0.014;
        b.add(rubyMesh);
        return b;
      }

      // =======================================================================
      // 7. GIMBAL RING 1: OUTER RING (Yaw Axis / Satin Platinum)
      // =======================================================================
      const outerRingGroup = new THREE.Group();
      outerRingRef.current = outerRingGroup;
      masterTiltGroup.add(outerRingGroup);

      const R_OUTER = 1.34;
      const outerRingMesh = createLuxuryGimbalRing(
        R_OUTER,
        0.042,
        platinumSatinMat,
        mirrorPlatinumMat,
        160,
        48
      );
      outerRingGroup.add(outerRingMesh);

      // Top and Bottom Jeweled Bearing Housings holding Middle Ring axle
      [R_OUTER, -R_OUTER].forEach((posY) => {
        const bearing = createJeweledBearing();
        bearing.position.set(0, posY, 0);
        bearing.rotation.x = Math.PI / 2;
        outerRingGroup.add(bearing);
      });

      // =======================================================================
      // 8. GIMBAL RING 2: MIDDLE RING (Pitch Axis / Dark Satin Titanium)
      // =======================================================================
      const middleRingGroup = new THREE.Group();
      middleRingRef.current = middleRingGroup;
      outerRingGroup.add(middleRingGroup);

      const R_MIDDLE = 1.14;
      const middleRingMesh = createLuxuryGimbalRing(
        R_MIDDLE,
        0.038,
        titaniumSatinMat,
        mirrorPlatinumMat,
        140,
        48
      );
      middleRingMesh.rotation.x = Math.PI / 2;
      middleRingGroup.add(middleRingMesh);

      // Horological Balance Screws on Middle Ring Perimeter (Gold & Platinum)
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const sx = Math.cos(ang) * (R_MIDDLE + 0.016);
        const sy = Math.sin(ang) * (R_MIDDLE + 0.016);
        const screwGeo = new THREE.CylinderGeometry(0.020, 0.020, 0.034, 16);
        const screwMesh = new THREE.Mesh(screwGeo, i % 2 === 0 ? goldChatonMat : mirrorPlatinumMat);
        screwMesh.position.set(sx, sy, 0);
        screwMesh.rotation.z = ang + Math.PI / 2;
        middleRingGroup.add(screwMesh);
      }

      // Middle-to-Inner Jeweled Bearing Axles (along X axis)
      [R_MIDDLE, -R_MIDDLE].forEach((posX) => {
        const bearing = createJeweledBearing();
        bearing.position.set(posX, 0, 0);
        bearing.rotation.z = Math.PI / 2;
        middleRingGroup.add(bearing);
      });

      // =======================================================================
      // 9. GIMBAL RING 3: INNER RING (Roll Axis & 4 Precision Station Medallions)
      // =======================================================================
      const innerRingGroup = new THREE.Group();
      innerRingRef.current = innerRingGroup;
      middleRingGroup.add(innerRingGroup);

      const R_INNER = 0.94;
      const innerRingMesh = createLuxuryGimbalRing(
        R_INNER,
        0.034,
        platinumSatinMat,
        mirrorPlatinumMat,
        120,
        48
      );
      innerRingMesh.rotation.y = Math.PI / 2;
      innerRingGroup.add(innerRingMesh);

      // 4 Precision Station Medallions Mounted on the Inner Ring
      const stationPodCoords = [
        { angle: 0.0, num: "01" },              // Top front
        { angle: Math.PI * 0.5, num: "02" },    // Right
        { angle: Math.PI, num: "03" },          // Bottom
        { angle: Math.PI * 1.5, num: "04" },    // Left
      ];

      stationPodCoords.forEach((st) => {
        const pod = new THREE.Group();
        const px = Math.sin(st.angle) * R_INNER;
        const py = Math.cos(st.angle) * R_INNER;
        pod.position.set(px, py, 0);

        // Gold Chaton Base Collar
        const collarGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.032, 24);
        const collarMesh = new THREE.Mesh(collarGeo, goldChatonMat);
        pod.add(collarMesh);

        // Sapphire Convex Crystal Lens
        const lensGeo = new THREE.SphereGeometry(0.046, 24, 16);
        const lensMesh = new THREE.Mesh(lensGeo, crystalSphereMat);
        lensMesh.position.y = 0.016;
        pod.add(lensMesh);

        // Glowing Diamond Pip
        const pipGeo = new THREE.SphereGeometry(0.022, 16, 16);
        const pipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pipMesh = new THREE.Mesh(pipGeo, pipMat);
        pipMesh.position.y = 0.016;
        pod.add(pipMesh);

        innerRingGroup.add(pod);
      });

      // =======================================================================
      // 10. PHYSICS & GYROSCOPIC KINETIC RENDER LOOP
      // =======================================================================
      let lastTime = performance.now();

      const animate = (time: number) => {
        animIdRef.current = requestAnimationFrame(animate);
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        // Apply inertia damping when touch finger is lifted
        if (!isDraggingRef.current) {
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;

          targetAngleYRef.current += velocityRef.current.x;
          targetTiltXRef.current += velocityRef.current.y;

          // Clamp middle ring pitch (±28°)
          targetTiltXRef.current = Math.max(-0.48, Math.min(0.48, targetTiltXRef.current));

          // Gentle zero-gravity orbital drift when idle
          if (
            Math.abs(velocityRef.current.x) < 0.0004 &&
            Date.now() - lastUserActionTimeRef.current > 2400
          ) {
            targetAngleYRef.current += 0.0014;
          }
        }

        // Smooth Lerp toward target angles
        currentAngleYRef.current += (targetAngleYRef.current - currentAngleYRef.current) * 0.12;
        currentTiltXRef.current += (targetTiltXRef.current - currentTiltXRef.current) * 0.12;

        // Apply differential gyroscopic rotations
        outerRingGroup.rotation.y = currentAngleYRef.current;
        middleRingGroup.rotation.x = currentTiltXRef.current;
        innerRingGroup.rotation.z = -currentAngleYRef.current * 0.35; // Gyroscopic counter-rotation

        // Sapphire crystal core rotates slowly on its own axis
        crystalSphereMesh.rotation.y = time * 0.0005;
        innerCoreMesh.rotation.y = -time * 0.0008;

        // Active station detection
        let normY = ((currentAngleYRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const closestIdx = Math.round(normY / (Math.PI / 2)) % 4;

        if (closestIdx !== activeStationRef.current) {
          activeStationRef.current = closestIdx;
          setActiveStation(closestIdx);
          playMechanicalLatchAudio();
        }

        renderer.render(scene, camera);
      };

      animIdRef.current = requestAnimationFrame(animate);

      // Handle Resize smoothly
      const handleResize = () => {
        if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
        const box = canvasRef.current.getBoundingClientRect();
        const w = box.width || 360;
        const h = box.height || 300;
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
    }, [playMechanicalLatchAudio]);

    // Pointer Event Handlers for Multi-Axis Gyroscope Drag
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

      const vX = deltaX * 0.0075;
      const vY = deltaY * 0.0045;

      velocityRef.current = { x: vX, y: vY };
      targetAngleYRef.current += vX;
      targetTiltXRef.current += vY;
      targetTiltXRef.current = Math.max(-0.48, Math.min(0.48, targetTiltXRef.current));
      lastUserActionTimeRef.current = Date.now();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = false;
      lastUserActionTimeRef.current = Date.now();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    };

    const currentStationData = GYRO_STATIONS[activeStation] || GYRO_STATIONS[0];
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

        {/* 3D Ultra-Realistic Inertial Gyroscope Canvas */}
        <div className="relative w-full h-[280px] xs:h-[300px] flex items-center justify-center my-0.5 overflow-hidden">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            style={{ touchAction: "none" }}
          />

          {/* Minimalist Touch Guidance Badge */}
          <div className="absolute top-2 right-2 pointer-events-none px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="text-[8px] tracking-[0.16em] text-white/50 uppercase font-medium">
              Drag Gyroscope
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
            {GYRO_STATIONS.map((st, sIdx) => {
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

InertialGyroscopeCreed.displayName = "InertialGyroscopeCreed";
