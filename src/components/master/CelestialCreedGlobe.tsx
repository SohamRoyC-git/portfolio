"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award, ChevronUp, ChevronDown } from "lucide-react";

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
  targetRotationY: number;
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
    targetRotationY: 0.0, // Front-facing quadrant
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
    targetRotationY: -Math.PI * 0.5, // 90° rotation
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
    targetRotationY: -Math.PI, // 180° rotation
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
    targetRotationY: -Math.PI * 1.5, // 270° rotation
  },
];

interface CelestialCreedGlobeProps {
  progress?: number; // 0 to 1 scroll progress from parent GSAP
  onPillarSelect?: (index: number) => void;
}

export const CelestialCreedGlobe: React.FC<CelestialCreedGlobeProps> = memo(
  ({ progress = 0, onPillarSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [activePillar, setActivePillar] = useState<number>(0);
    const activePillarRef = useRef<number>(0);
    const [isDetailExpanded, setIsDetailExpanded] = useState<boolean>(true);

    // Three.js object references
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const globeGroupRef = useRef<THREE.Group | null>(null);
    const beaconHitTargetsRef = useRef<THREE.Mesh[]>([]);
    const beaconRingsRef = useRef<THREE.Mesh[]>([]);
    const animIdRef = useRef<number | null>(null);

    // Interaction physics state
    const isDraggingRef = useRef<boolean>(false);
    const dragDistanceRef = useRef<number>(0);
    const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const rotationTargetRef = useRef<{ x: number; y: number }>({ x: 0.08, y: 0.0 });
    const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.08, y: 0.0 });
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
          osc.frequency.setValueAtTime(360, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.018, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.07);
        }
      } catch {}
    }, []);

    // Rotate globe to target pillar index
    const rotateToPillar = useCallback(
      (idx: number) => {
        playHapticAudio();
        activePillarRef.current = idx;
        setActivePillar(idx);
        lastUserActionTimeRef.current = Date.now();

        const targetY = CELESTIAL_PILLARS[idx].targetRotationY;
        rotationTargetRef.current.x = 0.06;

        // Take shortest path around Y
        let diff = targetY - rotationTargetRef.current.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        rotationTargetRef.current.y += diff;
        if (onPillarSelect) onPillarSelect(idx);
      },
      [playHapticAudio, onPillarSelect]
    );

    // Handle scroll progress mapping from parent GSAP
    useEffect(() => {
      // If user hasn't dragged within the last 1.4s, scroll controls the globe
      if (Date.now() - lastUserActionTimeRef.current > 1400 && !isDraggingRef.current) {
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
      const width = rect.width || 360;
      const height = rect.height || 380;

      // 1. Scene & Camera (Positioned closer for monumental presence on mobile)
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 0, 3.55);
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
      renderer.toneMappingExposure = 1.25;
      rendererRef.current = renderer;

      // 2. Studio Lighting Setup for Pure Silk White & Matte Charcoal Shading
      // Key Light: Crisp front-right light illuminating outer white ribbons
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
      keyLight.position.set(3.5, 5.0, 4.5);
      scene.add(keyLight);

      // Fill Light: Soft slate light for sculptural contrast on left flank
      const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
      fillLight.position.set(-4.5, -2.0, 2.5);
      scene.add(fillLight);

      // Top Rim Light: Accentuates the upper crest wave edge
      const rimLight = new THREE.DirectionalLight(0xffffff, 2.6);
      rimLight.position.set(0, 6.0, -2.0);
      scene.add(rimLight);

      // Ambient Light: Gives the interior ribbons the deep slate grey tone from user reference
      const ambientLight = new THREE.AmbientLight(0x475569, 0.95);
      scene.add(ambientLight);

      // 3. Tilting & Hierarchy Architecture
      // tiltGroup establishes the dynamic ~35° diagonal ribbon swirl matching the user's reference
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = -0.60; // ~34.4° diagonal slant
      tiltGroup.rotation.x = 0.18;  // Forward pitch
      scene.add(tiltGroup);

      // globeGroup handles user drag rotation around the tilted Y axis
      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      tiltGroup.add(globeGroup);

      // =======================================================================
      // 4. SCULPTURAL HELICAL RIBBON GEOMETRY (Matching media_1795436470383_7a284648.png)
      // =======================================================================
      const outerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.02,
        side: THREE.FrontSide,
      });

      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x75808f,
        roughness: 0.38,
        metalness: 0.04,
        side: THREE.FrontSide,
      });

      const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0xc8d0db,
        roughness: 0.25,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });

      function createRibbonMesh(
        phiSpan: [number, number],
        thetaSpan: [number, number],
        widthProfile: (u: number) => number,
        R = 1.25,
        thickness = 0.046,
        segments = 160
      ) {
        const outerPositions: number[] = [];
        const outerIndices: number[] = [];
        const innerPositions: number[] = [];
        const innerIndices: number[] = [];
        const rimPositions: number[] = [];
        const rimIndices: number[] = [];

        const outerL: THREE.Vector3[] = [];
        const outerR: THREE.Vector3[] = [];
        const innerL: THREE.Vector3[] = [];
        const innerR: THREE.Vector3[] = [];

        for (let i = 0; i <= segments; i++) {
          const u = i / segments;
          const phi = phiSpan[0] + u * (phiSpan[1] - phiSpan[0]);
          const theta = thetaSpan[0] + u * (thetaSpan[1] - thetaSpan[0]);

          const pt = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta)
          );

          const nextU = Math.min(1, u + 0.005);
          const nextPhi = phiSpan[0] + nextU * (phiSpan[1] - phiSpan[0]);
          const nextTheta = thetaSpan[0] + nextU * (thetaSpan[1] - thetaSpan[0]);
          const nextPt = new THREE.Vector3(
            Math.sin(nextPhi) * Math.cos(nextTheta),
            Math.cos(nextPhi),
            Math.sin(nextPhi) * Math.sin(nextTheta)
          );
          const tangent = nextPt.sub(pt).normalize();
          const sphereNorm = pt.clone().normalize();
          const binormal = new THREE.Vector3().crossVectors(tangent, sphereNorm).normalize();

          const w = Math.max(0.001, widthProfile(u));
          const halfW = w * 0.5;

          const pOutL = pt
            .clone()
            .multiplyScalar(R)
            .add(binormal.clone().multiplyScalar(halfW))
            .normalize()
            .multiplyScalar(R);
          const pOutR = pt
            .clone()
            .multiplyScalar(R)
            .sub(binormal.clone().multiplyScalar(halfW))
            .normalize()
            .multiplyScalar(R);

          const pInL = pOutL.clone().normalize().multiplyScalar(R - thickness);
          const pInR = pOutR.clone().normalize().multiplyScalar(R - thickness);

          outerL.push(pOutL);
          outerR.push(pOutR);
          innerL.push(pInL);
          innerR.push(pInR);
        }

        // 1. Outer Face (Silk White)
        for (let i = 0; i <= segments; i++) {
          outerPositions.push(outerL[i].x, outerL[i].y, outerL[i].z);
          outerPositions.push(outerR[i].x, outerR[i].y, outerR[i].z);
        }
        for (let i = 0; i < segments; i++) {
          const v = i * 2;
          const vNext = (i + 1) * 2;
          outerIndices.push(v + 0, vNext + 0, v + 1);
          outerIndices.push(v + 1, vNext + 0, vNext + 1);
        }
        const outerGeo = new THREE.BufferGeometry();
        outerGeo.setAttribute("position", new THREE.Float32BufferAttribute(outerPositions, 3));
        outerGeo.setIndex(outerIndices);
        outerGeo.computeVertexNormals();

        // 2. Inner Face (Shaded Slate Charcoal)
        for (let i = 0; i <= segments; i++) {
          innerPositions.push(innerL[i].x, innerL[i].y, innerL[i].z);
          innerPositions.push(innerR[i].x, innerR[i].y, innerR[i].z);
        }
        for (let i = 0; i < segments; i++) {
          const v = i * 2;
          const vNext = (i + 1) * 2;
          innerIndices.push(v + 0, v + 1, vNext + 0);
          innerIndices.push(v + 1, vNext + 1, vNext + 0);
        }
        const innerGeo = new THREE.BufferGeometry();
        innerGeo.setAttribute("position", new THREE.Float32BufferAttribute(innerPositions, 3));
        innerGeo.setIndex(innerIndices);
        innerGeo.computeVertexNormals();

        // 3. Rim Edges & Smooth Bevels
        for (let i = 0; i <= segments; i++) {
          rimPositions.push(outerL[i].x, outerL[i].y, outerL[i].z);
          rimPositions.push(innerL[i].x, innerL[i].y, innerL[i].z);
          rimPositions.push(outerR[i].x, outerR[i].y, outerR[i].z);
          rimPositions.push(innerR[i].x, innerR[i].y, innerR[i].z);
        }
        for (let i = 0; i < segments; i++) {
          const v = i * 4;
          const vNext = (i + 1) * 4;
          rimIndices.push(v + 0, v + 1, vNext + 0);
          rimIndices.push(v + 1, vNext + 1, vNext + 0);
          rimIndices.push(v + 2, vNext + 2, v + 3);
          rimIndices.push(v + 3, vNext + 2, vNext + 3);
        }

        const rimGeo = new THREE.BufferGeometry();
        rimGeo.setAttribute("position", new THREE.Float32BufferAttribute(rimPositions, 3));
        rimGeo.setIndex(rimIndices);
        rimGeo.computeVertexNormals();

        const ribbonGroup = new THREE.Group();
        ribbonGroup.add(new THREE.Mesh(outerGeo, outerMaterial));
        ribbonGroup.add(new THREE.Mesh(innerGeo, innerMaterial));
        ribbonGroup.add(new THREE.Mesh(rimGeo, rimMaterial));

        return ribbonGroup;
      }

      // Add the 4 master sculptural ribbons reproducing the reference image swirl
      // Ribbon 0: Top Cresting Wave looping over the north pole
      globeGroup.add(
        createRibbonMesh(
          [0.16, 1.48],
          [0.6, 4.2],
          (u) => 0.46 * Math.pow(Math.sin(u * Math.PI), 0.82),
          1.25,
          0.046,
          160
        )
      );

      // Ribbon 1: Upper-Mid Diagonal Ribbon sweeping across front face
      globeGroup.add(
        createRibbonMesh(
          [0.55, 1.88],
          [-1.2, 2.7],
          (u) => 0.48 * Math.pow(Math.sin(u * Math.PI), 0.72),
          1.25,
          0.046,
          160
        )
      );

      // Ribbon 2: Lower-Mid Diagonal Ribbon sweeping across front face
      globeGroup.add(
        createRibbonMesh(
          [1.15, 2.48],
          [-2.8, 1.2],
          (u) => 0.48 * Math.pow(Math.sin(u * Math.PI), 0.72),
          1.25,
          0.046,
          160
        )
      );

      // Ribbon 3: Bottom Cresting Hook looping under the south pole
      globeGroup.add(
        createRibbonMesh(
          [1.65, 2.96],
          [-4.4, -0.5],
          (u) => 0.44 * Math.pow(Math.sin(u * Math.PI), 0.82),
          1.25,
          0.046,
          160
        )
      );

      // =======================================================================
      // 5. 4 HIGH-PRECISION INTERACTIVE BEACON NODES
      // =======================================================================
      const beaconHitTargets: THREE.Mesh[] = [];
      const beaconRings: THREE.Mesh[] = [];
      const R_BEACON = 1.27; // Mounted precisely on outer ribbon surface

      // Spherical coordinates for the 4 pillars
      const beaconCoords = [
        { phi: 1.22, theta: 0.0 },                     // 01: NSEC AIML (Front-center)
        { phi: 1.55, theta: -Math.PI * 0.5 },          // 02: LCF RIGA (90°)
        { phi: 1.35, theta: -Math.PI },                // 03: 5MS ENGINE (180°)
        { phi: 1.68, theta: -Math.PI * 1.5 },          // 04: HERITAGE (270°)
      ];

      for (let i = 0; i < 4; i++) {
        const c = beaconCoords[i];
        const x = R_BEACON * Math.sin(c.phi) * Math.cos(c.theta);
        const y = R_BEACON * Math.cos(c.phi);
        const z = R_BEACON * Math.sin(c.phi) * Math.sin(c.theta);

        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, y, z);

        // A. Invisible Touch Hit Target (Radius 0.22 for effortless fingertip tapping)
        const hitGeo = new THREE.SphereGeometry(0.22, 12, 12);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.userData = { index: i };
        nodeGroup.add(hitMesh);
        beaconHitTargets.push(hitMesh);

        // B. Diamond Silk Core Sphere
        const coreGeo = new THREE.SphereGeometry(0.046, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        nodeGroup.add(coreMesh);

        // C. Concentric Interactive Halo Ring
        const ringGeo = new THREE.RingGeometry(0.082, 0.102, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.lookAt(x * 2, y * 2, z * 2);
        nodeGroup.add(ringMesh);
        beaconRings.push(ringMesh);

        globeGroup.add(nodeGroup);
      }
      beaconHitTargetsRef.current = beaconHitTargets;
      beaconRingsRef.current = beaconRings;

      // =======================================================================
      // 6. ANIMATION & TOUCH PHYSICS RENDER LOOP
      // =======================================================================
      let lastTime = performance.now();

      const animate = (time: number) => {
        animIdRef.current = requestAnimationFrame(animate);
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        // Apply physics damping when finger is lifted
        if (!isDraggingRef.current) {
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;

          rotationTargetRef.current.y += velocityRef.current.y;
          rotationTargetRef.current.x += velocityRef.current.x;

          // Clamp X pitch to prevent flipping upside down (±25°)
          rotationTargetRef.current.x = Math.max(-0.42, Math.min(0.42, rotationTargetRef.current.x));

          // Gentle ambient float if untouched
          if (
            Math.abs(velocityRef.current.y) < 0.0004 &&
            Date.now() - lastUserActionTimeRef.current > 3200
          ) {
            rotationTargetRef.current.y += 0.0014;
          }
        }

        // Smooth Lerp toward rotation target
        currentRotationRef.current.y +=
          (rotationTargetRef.current.y - currentRotationRef.current.y) * 0.12;
        currentRotationRef.current.x +=
          (rotationTargetRef.current.x - currentRotationRef.current.x) * 0.12;

        globeGroup.rotation.y = currentRotationRef.current.y;
        globeGroup.rotation.x = currentRotationRef.current.x;

        // Pulse active beacon ring
        const currentActive = activePillarRef.current;
        for (let i = 0; i < beaconRings.length; i++) {
          if (i === currentActive) {
            const pulse = 1.0 + Math.sin(time * 0.005) * 0.22;
            beaconRings[i].scale.set(pulse, pulse, 1);
            (beaconRings[i].material as THREE.MeshBasicMaterial).opacity = 0.95;
          } else {
            beaconRings[i].scale.set(1, 1, 1);
            (beaconRings[i].material as THREE.MeshBasicMaterial).opacity = 0.45;
          }
        }

        // Active node detection based on front-facing orientation
        let normY =
          ((-currentRotationRef.current.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
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
        const w = box.width || 360;
        const h = box.height || 380;
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

    // Pointer Event Handlers for 3D Drag & Beacon Tap
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = true;
      dragDistanceRef.current = 0;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
      lastUserActionTimeRef.current = Date.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      dragDistanceRef.current += Math.hypot(deltaX, deltaY);
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const vY = deltaX * 0.0072;
      const vX = deltaY * 0.0042;

      velocityRef.current = { x: vX, y: vY };
      rotationTargetRef.current.y += vY;
      rotationTargetRef.current.x += vX;
      rotationTargetRef.current.x = Math.max(-0.42, Math.min(0.42, rotationTargetRef.current.x));
      lastUserActionTimeRef.current = Date.now();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = false;
      lastUserActionTimeRef.current = Date.now();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}

      // If finger barely moved (< 8px), raycast to detect tap on beacon pin
      if (dragDistanceRef.current < 8 && cameraRef.current && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);
        const hits = raycaster.intersectObjects(beaconHitTargetsRef.current, false);

        if (hits.length > 0) {
          const hitIndex = hits[0].object.userData.index;
          if (hitIndex !== undefined) {
            rotateToPillar(hitIndex);
            setIsDetailExpanded(true); // Automatically expand details on clicking any point!
            return;
          }
        }
      }
    };

    const currentPillarData = CELESTIAL_PILLARS[activePillar] || CELESTIAL_PILLARS[0];
    const IconComponent = currentPillarData.icon;

    return (
      <div
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-between pointer-events-auto select-none"
      >
        {/* Minimalist Monochrome Header Tag */}
        <div className="w-full flex items-center justify-between px-2 pt-1 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.26em] text-white/90 uppercase font-bold">
              THE ARCHITECTURAL CREED
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/40">
            [ <span className="text-white font-bold">0{activePillar + 1}</span> / 04 ]
          </div>
        </div>

        {/* 3D Monumental Sculptural Ribbon Globe Canvas (Heroic Central Display) */}
        <div className="relative w-full h-[360px] xs:h-[390px] sm:h-[420px] flex items-center justify-center my-0.5 overflow-hidden">
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
          <div className="absolute top-2 right-2 pointer-events-none px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
            <span className="font-mono text-[8px] tracking-[0.18em] text-white/60 uppercase">
              DRAG TO ROTATE · TAP BEACON
            </span>
          </div>

          {/* Pure Ethereal Monochrome Void Glow Behind Sculpture */}
          <div className="absolute w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(160,174,192,0.03)_50%,transparent_75%)] blur-3xl pointer-events-none -z-10" />
        </div>

        {/* Floating Liquid Glass Monograph Sheet (Smooth, Non-intrusive, Collapsible) */}
        <div className="w-full bg-[#080A0F]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between transition-all duration-300">
          <div>
            {/* Monograph Top Meta & Collapse/Expand Toggle */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-helvetica font-normal text-2xl text-white/40 leading-none">
                  {currentPillarData.num}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                  <IconComponent size={12} className="text-white" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                    {currentPillarData.tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 border border-white/10 cursor-pointer transition-colors"
                aria-label="Toggle Creed details"
              >
                <span>{isDetailExpanded ? "COLLAPSE" : "EXPAND"}</span>
                {isDetailExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>

            {/* Title & Subtitle */}
            <h4 className="font-sans font-bold text-base sm:text-lg text-white leading-snug mb-1">
              {currentPillarData.title}
            </h4>
            <div className="text-[11px] font-mono text-slate-300 mb-2 leading-snug">
              {currentPillarData.role}
            </div>

            {/* Expandable Body Content */}
            {isDetailExpanded && (
              <div className="space-y-2.5 transition-all duration-300">
                {/* Narrative Description */}
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
                  {currentPillarData.desc}
                </p>

                {/* Minimalist System Benchmark Bar */}
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 mb-1">
                    <span>{currentPillarData.benchLabel}</span>
                    <span className="text-emerald-300 font-semibold">{currentPillarData.benchValue}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400/80 to-white/90 transition-all duration-500 rounded-full"
                      style={{ width: `${currentPillarData.benchPercent}%` }}
                    />
                  </div>
                </div>

                {/* Spec Chips */}
                <div className="flex flex-wrap gap-1">
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
            )}
          </div>

          {/* Quick Selector Tabs [ 01 NSEC ] [ 02 LCF ] [ 03 5MS ] [ 04 HERITAGE ] */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 mt-2.5">
            {CELESTIAL_PILLARS.map((p, pIdx) => {
              const isSelected = pIdx === activePillar;
              return (
                <button
                  key={pIdx}
                  onClick={() => rotateToPillar(pIdx)}
                  className={`flex-1 py-1 rounded text-[8px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#0A0D14] font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                      : "bg-white/5 text-white/50 border border-white/10 hover:text-white/80"
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
