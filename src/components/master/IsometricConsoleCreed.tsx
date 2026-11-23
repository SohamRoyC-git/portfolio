"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GraduationCap, Trophy, Cpu, Award } from "lucide-react";

export interface ConsoleStationData {
  num: string;
  short: string;
  tag: string;
  title: string;
  role: string;
  desc: string;
  statusLabel: string;
  chips: string[];
  benchLabel: string;
  benchValue: string;
  benchPercent: number;
}

export const CONSOLE_STATIONS: ConsoleStationData[] = [
  {
    num: "01",
    short: "Academic",
    tag: "Academic Core",
    title: "Netaji Subhash Engineering College",
    role: "B.Tech in Artificial Intelligence & Machine Learning (2024–2028)",
    desc: "Specialized in predictive neural architectures, high-throughput systems, computational algebra, and algorithmic optimization.",
    statusLabel: "Building Neural Connectors",
    chips: ["Neural Architectures", "Computational Algebra", "High-Throughput Systems"],
    benchLabel: "System Convergence",
    benchValue: "99.4%",
    benchPercent: 94,
  },
  {
    num: "02",
    short: "European Ops",
    tag: "European Operations",
    title: "Latvian Cricket Federation",
    role: "National Sports Governing Body Digital Ecosystem",
    desc: "Modernized national sports governing digital infrastructure, automated live tournament telemetry, and EU regulatory compliance systems.",
    statusLabel: "Connecting Telemetry Stream",
    chips: ["EU Compliance", "Live Telemetry", "Riga Circuit"],
    benchLabel: "Telemetry Stream",
    benchValue: "100% Active",
    benchPercent: 100,
  },
  {
    num: "03",
    short: "Localization",
    tag: "High-Performance Core",
    title: "278-Key In-Memory Localization Engine",
    role: "Zero-API Sub-Millisecond Bilingual Translation",
    desc: "Zero-API in-memory localization dictionary eliminating roundtrip latency for international B2B agricultural commodity trade channels.",
    statusLabel: "Deploying Sub-Millisecond Bus",
    chips: ["Zero-API", "Sub-Millisecond", "Trade Pipeline"],
    benchLabel: "Roundtrip Latency",
    benchValue: "< 4.8ms",
    benchPercent: 98,
  },
  {
    num: "04",
    short: "Heritage",
    tag: "Algorithmic Foundation",
    title: "The Heritage School",
    role: "ISC Class XII (82.75%) · ICSE (89.4%) Distinction",
    desc: "Pure sciences, discrete mathematics, analytical mechanics, and algorithm design distinction foundation.",
    statusLabel: "Validating Foundation Kernels",
    chips: ["Discrete Math", "Analytical Mechanics", "Distinction Honors"],
    benchLabel: "Academic Distinction",
    benchValue: "Top Tier",
    benchPercent: 92,
  },
];

interface IsometricConsoleCreedProps {
  progress?: number;
}

/**
 * Creates a rounded rectangular shape for ExtrudeGeometry
 */
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/**
 * Generates an illuminated dot-matrix LED texture for the console base
 */
function createDotMatrixTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#160901";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = 32;
  const rows = 16;
  const stepX = canvas.width / cols;
  const stepY = canvas.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * stepX + stepX / 2;
      const cy = r * stepY + stepY / 2;
      const rad = 3.2;

      // Glow halo
      const grad = ctx.createRadialGradient(cx, cy, 0.5, cx, cy, rad * 2);
      grad.addColorStop(0, "#fff5dd");
      grad.addColorStop(0.35, "#ffaa00");
      grad.addColorStop(0.75, "#cc6600");
      grad.addColorStop(1, "rgba(22, 9, 1, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central diode
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

/**
 * Generates PCB floor circuit traces
 */
function createPcbFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 160, 30, 0.4)";
  ctx.lineWidth = 3.0;
  ctx.lineCap = "round";

  // Pre-drawn gold PCB traces at 45-degree angles
  const paths = [
    // Left cluster
    [[-400, 200], [-250, 200], [-180, 270], [-80, 270]],
    [[-420, 150], [-300, 150], [-220, 70], [-100, 70]],
    [[-380, 320], [-280, 320], [-200, 400], [-60, 400]],
    // Right cluster
    [[400, 220], [260, 220], [190, 290], [90, 290]],
    [[430, 140], [310, 140], [210, 40], [110, 40]],
    [[370, 350], [250, 350], [170, 430], [50, 430]],
    // Bottom radiating traces
    [[-200, 420], [-120, 500], [0, 500]],
    [[200, 420], [120, 500], [0, 500]],
    [[-150, 360], [-80, 430], [0, 430]],
    [[150, 360], [80, 430], [0, 430]],
  ];

  const ox = canvas.width / 2;
  const oy = canvas.height / 2;

  paths.forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(ox + pts[0][0], oy + pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(ox + pts[i][0], oy + pts[i][1]);
    }
    ctx.stroke();

    // Solder pad via circle at start
    ctx.fillStyle = "#ffaa22";
    ctx.beginPath();
    ctx.arc(ox + pts[0][0], oy + pts[0][1], 5, 0, Math.PI * 2);
    ctx.fill();

    // Solder pad via circle at end
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(ox + last[0], oy + last[1], 4, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates high-res canvas card texture for on-screen 3D nodes
 */
function createNodeCardTexture(
  title: string,
  subtitle: string,
  accentColor = "#ff7a00"
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = "#1e2229";
  ctx.beginPath();
  ctx.roundRect(4, 4, canvas.width - 8, canvas.height - 8, 20);
  ctx.fill();

  // Top accent bar
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.roundRect(4, 4, canvas.width - 8, 28, [20, 20, 0, 0]);
  ctx.fill();

  // Subtle inner border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(4, 4, canvas.width - 8, canvas.height - 8, 20);
  ctx.stroke();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.fillText(title, 32, 92);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "normal 22px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
  ctx.fillText(subtitle, 32, 136);

  // Micro status pill
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.roundRect(32, 168, 180, 48, 24);
  ctx.fill();

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(52, 192, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 18px monospace";
  ctx.fillText("ACTIVE CORE", 68, 198);

  return new THREE.CanvasTexture(canvas);
}

export const IsometricConsoleCreed: React.FC<IsometricConsoleCreedProps> = memo(
  ({ progress = 0 }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [currentStationIdx, setCurrentStationIdx] = useState(0);
    const currentIdxRef = useRef(0);
    currentIdxRef.current = currentStationIdx;

    // Drag / Touch rotation
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const rotYawRef = useRef(-0.55); // Initial isometric angle
    const rotPitchRef = useRef(0.48); // Initial isometric pitch
    const targetYawRef = useRef(-0.55);
    const targetPitchRef = useRef(0.48);
    const velocityYawRef = useRef(0);
    const velocityPitchRef = useRef(0);

    // Dynamic 3D nodes group ref
    const nodesGroupRef = useRef<THREE.Group | null>(null);
    const progressBarMeshRef = useRef<THREE.Mesh | null>(null);

    // Audio click for station changes
    const audioCtxRef = useRef<AudioContext | null>(null);
    const playHapticTick = useCallback(() => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch {
        // Ignore audio failures
      }
    }, []);

    // Sync with scroll progress
    useEffect(() => {
      if (typeof progress === "number") {
        const idx = Math.min(
          CONSOLE_STATIONS.length - 1,
          Math.max(0, Math.floor(progress * CONSOLE_STATIONS.length))
        );
        if (idx !== currentIdxRef.current) {
          setCurrentStationIdx(idx);
          playHapticTick();
        }
      }
    }, [progress, playHapticTick]);

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const width = container.clientWidth || 390;
      const height = container.clientHeight || 700;

      // Scene & Camera
      const scene = new THREE.Scene();
      scene.background = null;

      // Perspective Camera tuned for expansive isometric view
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
      camera.position.set(0, 0, 8.4);
      camera.lookAt(0, 0, 0);

      // Renderer with high DPR
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      // Studio Environment Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      // Key Rim Light
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
      keyLight.position.set(6, 10, 5);
      scene.add(keyLight);

      // Warm Amber Fill Light
      const fillLight = new THREE.DirectionalLight(0xff9922, 1.8);
      fillLight.position.set(-6, -4, 4);
      scene.add(fillLight);

      // Top Soft Specular Light
      const topLight = new THREE.PointLight(0xffffff, 2.0, 15);
      topLight.position.set(0, 5, 2);
      scene.add(topLight);

      // MASTER TILT & ISOMETRIC RIG
      const masterRig = new THREE.Group();
      masterRig.position.set(0.12, 0.12, 0);
      scene.add(masterRig);

      // Set initial isometric angle
      masterRig.rotation.x = rotPitchRef.current;
      masterRig.rotation.y = rotYawRef.current;

      // 1. FLOOR PCB CIRCUIT BOARD
      const floorPcbGeo = new THREE.PlaneGeometry(8, 8);
      const floorPcbTex = createPcbFloorTexture();
      const floorPcbMat = new THREE.MeshBasicMaterial({
        map: floorPcbTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const floorMesh = new THREE.Mesh(floorPcbGeo, floorPcbMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = -1.25;
      masterRig.add(floorMesh);

      // 2. ILLUMINATED DOT-MATRIX LED BASE
      const baseWidth = 3.2;
      const baseDepth = 4.2;
      const baseHeight = 0.55;
      const baseCornerRadius = 0.22;

      const baseShape = createRoundedRectShape(baseWidth, baseDepth, baseCornerRadius);
      const baseExtrudeSettings = {
        depth: baseHeight,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.05,
      };
      const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
      baseGeo.center();

      const dotMatrixTex = createDotMatrixTexture();
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x110701,
        emissive: 0xff8800,
        emissiveMap: dotMatrixTex,
        emissiveIntensity: 2.8,
        metalness: 0.2,
        roughness: 0.4,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.rotation.x = Math.PI / 2;
      baseMesh.position.y = -0.92;
      masterRig.add(baseMesh);

      // Warm Amber Underglow Light
      const underglowLight = new THREE.PointLight(0xff8800, 4.5, 6);
      underglowLight.position.set(0, -1.0, 0);
      masterRig.add(underglowLight);

      // 3. MACHINED DARK ANODIZED ALUMINUM CHASSIS
      const chassisWidth = 3.3;
      const chassisDepth = 4.3;
      const chassisHeight = 0.42;
      const chassisShape = createRoundedRectShape(chassisWidth, chassisDepth, 0.26);
      const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
        depth: chassisHeight,
        bevelEnabled: true,
        bevelSegments: 8,
        bevelSize: 0.06,
        bevelThickness: 0.06,
      });
      chassisGeo.center();

      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x17181c,
        metalness: 0.92,
        roughness: 0.18,
      });
      const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
      chassisMesh.rotation.x = Math.PI / 2;
      chassisMesh.position.y = -0.42;
      masterRig.add(chassisMesh);

      // Polished Chamfer Top Accent Rim (Bright Titanium Line)
      const rimShape = createRoundedRectShape(chassisWidth - 0.04, chassisDepth - 0.04, 0.24);
      const rimGeo = new THREE.ExtrudeGeometry(rimShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });
      rimGeo.center();
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.98,
        roughness: 0.08,
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = -0.16;
      masterRig.add(rimMesh);

      // 4. RECESSED OBSIDIAN SCREEN SURFACE
      const screenWidth = 2.95;
      const screenDepth = 3.95;
      const screenGeo = new THREE.PlaneGeometry(screenWidth, screenDepth);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x090a0d,
        metalness: 0.85,
        roughness: 0.12,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.rotation.x = -Math.PI / 2;
      screenMesh.position.y = -0.11;
      masterRig.add(screenMesh);

      // Glowing Orange Border Contour Rail around Screen (Exact to reference video)
      const borderPts = [
        new THREE.Vector3(-screenWidth / 2, -0.1, -screenDepth / 2),
        new THREE.Vector3(screenWidth / 2, -0.1, -screenDepth / 2),
        new THREE.Vector3(screenWidth / 2, -0.1, screenDepth / 2),
        new THREE.Vector3(-screenWidth / 2, -0.1, screenDepth / 2),
        new THREE.Vector3(-screenWidth / 2, -0.1, -screenDepth / 2),
      ];
      const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
      const borderMat = new THREE.LineBasicMaterial({
        color: 0xff7a00,
        linewidth: 2,
      });
      const borderLine = new THREE.Line(borderGeo, borderMat);
      masterRig.add(borderLine);

      // 5. 3D DYNAMIC NODES ON SCREEN
      const nodesGroup = new THREE.Group();
      nodesGroup.position.y = -0.06;
      masterRig.add(nodesGroup);
      nodesGroupRef.current = nodesGroup;

      // Function to populate 3D nodes based on station index
      const buildStationNodes = (stIdx: number) => {
        // Clear previous children
        while (nodesGroup.children.length > 0) {
          const child = nodesGroup.children[0];
          nodesGroup.remove(child);
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
            else child.material.dispose();
          }
        }

        const data = CONSOLE_STATIONS[stIdx];

        // Center Main Node Card
        const mainCardGeo = new THREE.BoxGeometry(1.65, 0.08, 1.05);
        const mainCardTex = createNodeCardTexture(data.short, data.tag, "#ff7a00");
        const cardSideMat = new THREE.MeshStandardMaterial({
          color: 0x242832,
          metalness: 0.85,
          roughness: 0.25,
        });
        const cardFaceMat = new THREE.MeshBasicMaterial({
          map: mainCardTex,
        });
        // Box materials: [right, left, top, bottom, front, back]
        const mainCardMaterials = [
          cardSideMat,
          cardSideMat,
          cardFaceMat, // Top face
          cardSideMat,
          cardSideMat,
          cardSideMat,
        ];
        const mainCardMesh = new THREE.Mesh(mainCardGeo, mainCardMaterials);
        mainCardMesh.position.set(0, 0.04, -0.1);
        nodesGroup.add(mainCardMesh);

        // Satellite Satellite Node 1 (Top Left)
        const sat1Geo = new THREE.BoxGeometry(1.1, 0.06, 0.65);
        const sat1Tex = createNodeCardTexture(data.chips[0] || "Architecture", "Optimized", "#38bdf8");
        const sat1Mesh = new THREE.Mesh(sat1Geo, [
          cardSideMat,
          cardSideMat,
          new THREE.MeshBasicMaterial({ map: sat1Tex }),
          cardSideMat,
          cardSideMat,
          cardSideMat,
        ]);
        sat1Mesh.position.set(-0.75, 0.03, -1.15);
        nodesGroup.add(sat1Mesh);

        // Satellite Node 2 (Top Right)
        const sat2Geo = new THREE.BoxGeometry(1.1, 0.06, 0.65);
        const sat2Tex = createNodeCardTexture(data.chips[1] || "Throughput", "High-Speed", "#f59e0b");
        const sat2Mesh = new THREE.Mesh(sat2Geo, [
          cardSideMat,
          cardSideMat,
          new THREE.MeshBasicMaterial({ map: sat2Tex }),
          cardSideMat,
          cardSideMat,
          cardSideMat,
        ]);
        sat2Mesh.position.set(0.75, 0.03, -1.15);
        nodesGroup.add(sat2Mesh);

        // Satellite Node 3 (Bottom Left)
        const sat3Geo = new THREE.BoxGeometry(1.1, 0.06, 0.65);
        const sat3Tex = createNodeCardTexture(data.benchLabel, data.benchValue, "#10b981");
        const sat3Mesh = new THREE.Mesh(sat3Geo, [
          cardSideMat,
          cardSideMat,
          new THREE.MeshBasicMaterial({ map: sat3Tex }),
          cardSideMat,
          cardSideMat,
          cardSideMat,
        ]);
        sat3Mesh.position.set(-0.75, 0.03, 0.95);
        nodesGroup.add(sat3Mesh);

        // Satellite Node 4 (Bottom Right)
        const sat4Geo = new THREE.BoxGeometry(1.1, 0.06, 0.65);
        const sat4Tex = createNodeCardTexture("Telemetry", "Live 100%", "#a855f7");
        const sat4Mesh = new THREE.Mesh(sat4Geo, [
          cardSideMat,
          cardSideMat,
          new THREE.MeshBasicMaterial({ map: sat4Tex }),
          cardSideMat,
          cardSideMat,
          cardSideMat,
        ]);
        sat4Mesh.position.set(0.75, 0.03, 0.95);
        nodesGroup.add(sat4Mesh);

        // Glowing Connection Traces between nodes (Matching video style)
        const connectionPts = [
          // Center to Top-Left
          [new THREE.Vector3(0, 0.02, -0.6), new THREE.Vector3(-0.75, 0.02, -0.8)],
          // Center to Top-Right
          [new THREE.Vector3(0, 0.02, -0.6), new THREE.Vector3(0.75, 0.02, -0.8)],
          // Center to Bottom-Left
          [new THREE.Vector3(0, 0.02, 0.4), new THREE.Vector3(-0.75, 0.02, 0.6)],
          // Center to Bottom-Right
          [new THREE.Vector3(0, 0.02, 0.4), new THREE.Vector3(0.75, 0.02, 0.6)],
        ];

        connectionPts.forEach(([p1, p2]) => {
          const midX = (p1.x + p2.x) / 2;
          const curvePts = [p1, new THREE.Vector3(midX, 0.02, p1.z), new THREE.Vector3(midX, 0.02, p2.z), p2];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            linewidth: 2,
          });
          const line = new THREE.Line(lineGeo, lineMat);
          nodesGroup.add(line);

          // Glowing Junction Circle
          const ringGeo = new THREE.RingGeometry(0.02, 0.045, 16);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff9900,
            side: THREE.DoubleSide,
          });
          const r1 = new THREE.Mesh(ringGeo, ringMat);
          r1.rotation.x = Math.PI / 2;
          r1.position.copy(p1);
          nodesGroup.add(r1);

          const r2 = new THREE.Mesh(ringGeo, ringMat);
          r2.rotation.x = Math.PI / 2;
          r2.position.copy(p2);
          nodesGroup.add(r2);
        });

        // Animated On-Screen Progress Bar (Matching video "Saving Assembly" bar)
        const barTrackGeo = new THREE.BoxGeometry(2.4, 0.02, 0.16);
        const barTrackMat = new THREE.MeshBasicMaterial({ color: 0x1f242d });
        const barTrack = new THREE.Mesh(barTrackGeo, barTrackMat);
        barTrack.position.set(0, 0.02, 1.55);
        nodesGroup.add(barTrack);

        const barFillGeo = new THREE.BoxGeometry(2.35 * (data.benchPercent / 100), 0.03, 0.14);
        const barFillMat = new THREE.MeshBasicMaterial({ color: 0xff7a00 });
        const barFill = new THREE.Mesh(barFillGeo, barFillMat);
        barFill.position.set(-1.175 + (2.35 * (data.benchPercent / 100)) / 2, 0.03, 1.55);
        nodesGroup.add(barFill);
        progressBarMeshRef.current = barFill;
      };

      // Initial build
      buildStationNodes(currentStationIdx);

      // 6. FLOATING SIDE KEYPAD (As seen in reference video)
      const keypadGroup = new THREE.Group();
      keypadGroup.position.set(-2.2, -0.3, 0.2);
      keypadGroup.rotation.y = 0.2;
      masterRig.add(keypadGroup);

      const keypadBaseGeo = new THREE.BoxGeometry(0.85, 0.12, 2.2);
      const keypadBaseMat = new THREE.MeshStandardMaterial({
        color: 0x15161a,
        metalness: 0.9,
        roughness: 0.22,
      });
      const keypadBase = new THREE.Mesh(keypadBaseGeo, keypadBaseMat);
      keypadGroup.add(keypadBase);

      // Keypad Buttons
      const btnGeo = new THREE.BoxGeometry(0.65, 0.08, 0.42);
      const btnColors = [0x38bdf8, 0xffaa00, 0x10b981, 0xa855f7];
      for (let b = 0; b < 4; b++) {
        const btnMat = new THREE.MeshStandardMaterial({
          color: 0x222630,
          emissive: btnColors[b],
          emissiveIntensity: b === currentStationIdx ? 0.6 : 0.1,
          metalness: 0.8,
          roughness: 0.2,
        });
        const btnMesh = new THREE.Mesh(btnGeo, btnMat);
        btnMesh.position.set(0, 0.08, -0.75 + b * 0.5);
        keypadGroup.add(btnMesh);
      }

      // 7. FLOATING TOP PILL TAG (Handled crisply in HTML overlay below)

      // Animation Loop
      let animationFrameId: number;
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth drag inertia & return
        if (!isDraggingRef.current) {
          velocityYawRef.current *= 0.92;
          velocityPitchRef.current *= 0.92;
          rotYawRef.current += velocityYawRef.current;
          rotPitchRef.current += velocityPitchRef.current;

          // Gentle floating bob
          masterRig.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
        }

        masterRig.rotation.y = rotYawRef.current;
        masterRig.rotation.x = rotPitchRef.current;

        // Pulse LED underglow intensity
        baseMat.emissiveIntensity = 2.4 + Math.sin(elapsedTime * 2.8) * 0.4;
        underglowLight.intensity = 4.0 + Math.sin(elapsedTime * 2.8) * 0.8;

        renderer.render(scene, camera);
      };
      animate();

      // Touch / Mouse Handlers
      const onPointerDown = (e: PointerEvent) => {
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - startXRef.current;
        const deltaY = e.clientY - startYRef.current;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;

        const yawDelta = deltaX * 0.007;
        const pitchDelta = deltaY * 0.007;

        rotYawRef.current += yawDelta;
        rotPitchRef.current += pitchDelta;
        velocityYawRef.current = yawDelta;
        velocityPitchRef.current = pitchDelta;
      };

      const onPointerUp = () => {
        isDraggingRef.current = false;
      };

      const dom = renderer.domElement;
      dom.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      // Handle station updates
      const handleStationUpdate = () => {
        buildStationNodes(currentIdxRef.current);
      };

      // Expose update handler
      (container as unknown as { __updateStation?: () => void }).__updateStation = handleStationUpdate;

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
        dom.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        if (dom.parentElement) dom.parentElement.removeChild(dom);
      };
    }, []);

    // Rebuild station nodes when currentStationIdx changes
    useEffect(() => {
      const container = mountRef.current;
      if (container && (container as unknown as { __updateStation?: () => void }).__updateStation) {
        (container as unknown as { __updateStation?: () => void }).__updateStation?.();
      }
    }, [currentStationIdx]);

    const activeStation = CONSOLE_STATIONS[currentStationIdx];

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between pointer-events-auto select-none overflow-hidden">
        {/* 1. TOP MINIMAL BADGE (Clean, placed safely below fixed navbar) */}
        <div className="w-full pt-16 px-6 flex items-center justify-between z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/90">
              {activeStation.statusLabel}
            </span>
          </div>
          <div className="text-[11px] font-mono text-white/50 tracking-widest">
            [{activeStation.num} / 04]
          </div>
        </div>

        {/* 2. THE 3D CONSOLE CANVAS (Occupies ~80% of viewport) */}
        <div
          ref={mountRef}
          className="w-full flex-1 relative flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
          style={{ minHeight: "360px" }}
        />

        {/* 3. BOTTOM MINIMAL STATUS BAR (Ultra-clean, zero blocking cards) */}
        <div className="w-full pb-6 px-5 z-20 flex flex-col items-center gap-3">
          {/* Active Station Title & Role */}
          <div className="w-full max-w-sm text-center">
            <h3 className="text-white font-semibold text-base tracking-tight leading-snug">
              {activeStation.title}
            </h3>
            <p className="text-white/60 text-xs mt-1 leading-relaxed line-clamp-2">
              {activeStation.role}
            </p>
          </div>

          {/* Quick Station Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl">
            {CONSOLE_STATIONS.map((st, i) => (
              <button
                key={st.num}
                onClick={() => {
                  setCurrentStationIdx(i);
                  playHapticTick();
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  i === currentStationIdx
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

IsometricConsoleCreed.displayName = "IsometricConsoleCreed";

