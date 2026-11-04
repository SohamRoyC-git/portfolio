"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import {
  X,
  ArrowRight,
  Terminal as TerminalIcon,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Monitor,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
} from "lucide-react";

export interface Studio3DWorkspaceProps {
  onEnterPortfolio: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  isLocked?: boolean;
}

export const Studio3DWorkspace = memo(function Studio3DWorkspace({
  onEnterPortfolio,
  onNavigateToSection,
  isLocked = true,
}: Studio3DWorkspaceProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Interactive Modals
  const [activeModal, setActiveModal] = useState<"projects" | "specs" | "hobbies" | "terminal" | null>(null);

  // Audio Ambience
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Hovered item detection via Raycaster
  const [hoveredItem, setHoveredItem] = useState<{
    key: string;
    label: string;
    sub: string;
    x: number;
    y: number;
  } | null>(null);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: "system.init", out: "Soham Battlestation 3D Kernel · Production GLB Assets Active" },
    { cmd: "whoami", out: "Soham Roychoudhury — AI/ML Engineer & Systems Architect" },
    { cmd: "help", out: "Commands: 'whoami', 'projects', 'specs', 'hobbies', 'sound on', 'sound off', 'enter', 'clear'" },
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hitBoxesRef = useRef<THREE.Mesh[]>([]);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const fanMeshRef = useRef<THREE.Group | null>(null);
  const screenGlowLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Seated Chair POV Coordinates (Eye-level seated view overlooking keyboard, mousepad, monitor, and PC)
  const mouseNorm = useRef({ x: 0, y: 0 });
  const cameraBasePos = useRef(new THREE.Vector3(-0.04, 0.78, 0.78));
  const cameraLookTarget = useRef(new THREE.Vector3(-0.05, 0.56, -0.06));
  const isFlyingIntoScreen = useRef(false);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Synthesize tactile switch clicks
  const playClickSound = useCallback((freq = 900) => {
    try {
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
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.35, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }
    } catch {}
  }, []);

  // Ambient organic terrace breeze generator
  const toggleAmbientSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") ctx.resume();

      if (isAudioPlaying) {
        if (ambientGainRef.current) {
          ambientGainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
          setTimeout(() => {
            try {
              if (noiseSourceRef.current) {
                noiseSourceRef.current.stop();
                noiseSourceRef.current.disconnect();
                noiseSourceRef.current = null;
              }
            } catch {}
          }, 350);
        }
        setIsAudioPlaying(false);
      } else {
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.25;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        noiseSourceRef.current = whiteNoise;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(380, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 1.2);
        ambientGainRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsAudioPlaying(true);
      }
    } catch {}
  }, [isAudioPlaying]);

  // Continuous 3D Camera Flight into the BenQ Monitor Screen
  const trigger3DCameraFlight = useCallback(() => {
    if (isFlyingIntoScreen.current || !cameraRef.current) return;
    isFlyingIntoScreen.current = true;
    playClickSound(1100);

    const camera = cameraRef.current;
    // Monitor screen 3D center: (x: -0.06, y: 0.70, z: -0.07)
    const targetPos = new THREE.Vector3(-0.06, 0.70, 0.15);
    const targetLook = new THREE.Vector3(-0.06, 0.70, -0.07);

    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.25,
      ease: "power3.inOut",
    });

    gsap.to(cameraLookTarget.current, {
      x: targetLook.x,
      y: targetLook.y,
      z: targetLook.z,
      duration: 1.25,
      ease: "power3.inOut",
      onComplete: () => {
        onEnterPortfolio();
        isFlyingIntoScreen.current = false;
      },
    });
  }, [onEnterPortfolio, playClickSound]);

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playClickSound(1200);

    let output = "";
    if (cmd === "whoami") {
      output = "Soham Roychoudhury · AI Engineer & Frontend Architect. NSEC IT 2026 · European Cricket Ops.";
    } else if (cmd === "projects") {
      output = "1. In-Memory Translation Engine (<5ms)  2. European Cricket Ops Platform  3. DeepSeek Agent Harness";
    } else if (cmd === "specs") {
      output = "Rig: Zebronics Geometric Chassis, BenQ Widescreen IPS, Redgear Deskpad, Compact TKL Mech Keyboard.";
    } else if (cmd === "hobbies") {
      output = "Cricket Athletics (Latvian Cricket Fed), Keyboard Modding, Ambient Audio, Generative Art.";
    } else if (cmd === "sound on") {
      if (!isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic mountain wind soundscape: ACTIVE.";
    } else if (cmd === "sound off") {
      if (isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic soundscape: MUTED.";
    } else if (cmd === "enter") {
      output = "Initiating 3D camera flight into portfolio...";
      setTimeout(() => {
        setActiveModal(null);
        trigger3DCameraFlight();
      }, 400);
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "help") {
      output = "Commands: whoami | projects | specs | hobbies | sound on | sound off | enter | clear";
    } else {
      output = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd, out: output }]);
    setTerminalInput("");

    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Keyboard navigation & modal dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Main Three.js Scene Setup (Curated GLB Assets + First-Person Seated Chair POV)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#08090C");
    scene.fog = new THREE.FogExp2("#08090C", 0.04);

    // 2. CAMERA (First-person seated view overlooking the entire desk setup)
    const camera = new THREE.PerspectiveCamera(isMobile ? 56 : 48, width / height, 0.05, 30);
    const initialPos = isMobile
      ? new THREE.Vector3(-0.04, 0.85, 0.90)
      : new THREE.Vector3(-0.04, 0.78, 0.78);
    camera.position.copy(initialPos);
    cameraBasePos.current.copy(initialPos);
    cameraLookTarget.current.set(-0.05, 0.56, -0.06);
    camera.lookAt(cameraLookTarget.current);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. MULTI-SOURCE STUDIO LIGHTING
    const ambientLight = new THREE.AmbientLight(0x2A303C, 1.4);
    scene.add(ambientLight);

    // Warm Studio Key Light (Ceiling downlight)
    const keyLight = new THREE.DirectionalLight(0xFFEDD5, 2.4);
    keyLight.position.set(2.4, 4.2, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Cool Studio Rim Light (Bevel edge definition)
    const rimLight = new THREE.DirectionalLight(0x93C5FD, 1.3);
    rimLight.position.set(-2.5, 3.2, -1.0);
    scene.add(rimLight);

    // Emissive BenQ Monitor Glow (Downward illumination onto keyboard & mousepad)
    const screenGlow = new THREE.PointLight(0x60A5FA, 2.0, 1.6);
    screenGlow.position.set(-0.06, 0.70, 0.15);
    scene.add(screenGlow);
    screenGlowLightRef.current = screenGlow;

    // Zebronics ARGB Internal Fan Glow (Pulsing warm magenta/red)
    const pcFanLight = new THREE.PointLight(0xFF2D55, 2.8, 1.4);
    pcFanLight.position.set(0.44, 0.67, 0.02);
    scene.add(pcFanLight);

    // 5. ARCHITECTURAL ROOM SURFACES
    // Terracotta accent wall behind desk
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x7A362D, roughness: 0.88 })
    );
    backWall.position.set(0, 1.1, -0.65);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Deep mahogany floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x120E0C, roughness: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. DUAL-TIER DESK SETUP (Main Desk + Wooden Monitor Riser Shelf)
    // Main Desk Surface (Dark teak/walnut)
    const deskGeo = new THREE.BoxGeometry(2.3, 0.04, 1.1);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x221A15,
      roughness: 0.52,
      metalness: 0.08,
    });
    const mainDesk = new THREE.Mesh(deskGeo, deskMat);
    mainDesk.position.set(0, 0.38, 0.06);
    mainDesk.receiveShadow = true;
    mainDesk.castShadow = true;
    scene.add(mainDesk);

    // Desk Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x14161A, roughness: 0.65, metalness: 0.3 });
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 16);
    [
      [-1.05, 0.19, -0.40],
      [1.05, 0.19, -0.40],
      [-1.05, 0.19, 0.45],
      [1.05, 0.19, 0.45],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      scene.add(leg);
    });

    // Wooden Monitor Riser Shelf (Dual-tier shelf)
    const riserGeo = new THREE.BoxGeometry(1.28, 0.025, 0.28);
    const riserMat = new THREE.MeshStandardMaterial({
      color: 0x2C211A,
      roughness: 0.48,
      metalness: 0.06,
    });
    const riserShelf = new THREE.Mesh(riserGeo, riserMat);
    riserShelf.position.set(-0.06, 0.50, -0.14);
    riserShelf.receiveShadow = true;
    riserShelf.castShadow = true;
    scene.add(riserShelf);

    // Aluminum Riser Feet
    const riserFootGeo = new THREE.BoxGeometry(0.04, 0.10, 0.24);
    const footL = new THREE.Mesh(riserFootGeo, legMat);
    footL.position.set(-0.66, 0.45, -0.14);
    scene.add(footL);
    const footR = new THREE.Mesh(riserFootGeo, legMat);
    footR.position.set(0.54, 0.45, -0.14);
    scene.add(footR);

    // 7. EXTENDED REDGEAR GAMING MOUSEPAD (Distressed Crimson Artwork)
    const padCanvas = document.createElement("canvas");
    padCanvas.width = 1024;
    padCanvas.height = 512;
    const pCtx = padCanvas.getContext("2d");
    if (pCtx) {
      // Dark carbon micro-weave
      pCtx.fillStyle = "#121418";
      pCtx.fillRect(0, 0, 1024, 512);

      // Fine grid
      pCtx.fillStyle = "rgba(255,255,255,0.025)";
      for (let x = 0; x < 1024; x += 4) pCtx.fillRect(x, 0, 2, 512);
      for (let y = 0; y < 512; y += 4) pCtx.fillRect(0, y, 1024, 2);

      // Crimson distress artwork
      pCtx.save();
      const grad = pCtx.createLinearGradient(420, 0, 1024, 512);
      grad.addColorStop(0, "rgba(220, 20, 45, 0.15)");
      grad.addColorStop(0.4, "rgba(230, 30, 50, 0.85)");
      grad.addColorStop(0.8, "rgba(160, 10, 25, 0.95)");
      grad.addColorStop(1, "rgba(70, 5, 12, 0.9)");

      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.moveTo(530, 30);
      pCtx.lineTo(990, 20);
      pCtx.lineTo(1005, 490);
      pCtx.lineTo(610, 470);
      pCtx.lineTo(690, 280);
      pCtx.closePath();
      pCtx.fill();

      // Distressed claw scratches
      pCtx.fillStyle = "#FF2E44";
      for (let i = 0; i < 5; i++) {
        pCtx.beginPath();
        pCtx.ellipse(760 + i * 40, 140 + i * 55, 110, 12, -0.65, 0, Math.PI * 2);
        pCtx.fill();
      }

      // Redgear emblem & logo
      pCtx.fillStyle = "rgba(255,255,255,0.85)";
      pCtx.font = "bold 26px sans-serif";
      pCtx.fillText("REDGEAR", 845, 62);
      pCtx.restore();

      // Perimeter stitched border
      pCtx.strokeStyle = "rgba(255, 30, 55, 0.6)";
      pCtx.lineWidth = 8;
      pCtx.strokeRect(4, 4, 1016, 504);
    }

    const padTexture = new THREE.CanvasTexture(padCanvas);
    padTexture.anisotropy = 4;
    const mousepad = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.005, 0.40),
      new THREE.MeshStandardMaterial({ map: padTexture, roughness: 0.82, metalness: 0.05 })
    );
    mousepad.position.set(-0.06, 0.402, 0.18);
    mousepad.receiveShadow = true;
    scene.add(mousepad);

    // 8. ERGONOMIC GAMING MOUSE
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(0.24, 0.406, 0.18);
    mouseGroup.rotation.y = -0.06;

    const mouseBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.068, 0.032, 0.118),
      new THREE.MeshStandardMaterial({ color: 0x16181D, roughness: 0.38, metalness: 0.2 })
    );
    mouseBody.position.y = 0.016;
    mouseBody.castShadow = true;
    mouseGroup.add(mouseBody);

    const mouseWheelGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.008, 16);
    mouseWheelGeo.rotateZ(Math.PI / 2);
    const mouseWheel = new THREE.Mesh(
      mouseWheelGeo,
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, emissive: 0x00FFCC, emissiveIntensity: 0.35 })
    );
    mouseWheel.position.set(0, 0.033, -0.025);
    mouseGroup.add(mouseWheel);

    const mouseRgb = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.004, 0.008),
      new THREE.MeshBasicMaterial({ color: 0xFF0055 })
    );
    mouseRgb.position.set(0, 0.012, 0.052);
    mouseGroup.add(mouseRgb);
    scene.add(mouseGroup);

    // 9. BENQ WIDESCREEN IPS MONITOR & INTERACTIVE SCREEN
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.06, 0.70, -0.08);

    // Trapezoidal Base on the wooden riser
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.014, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x181A1F, roughness: 0.5, metalness: 0.4 })
    );
    baseMesh.position.set(0, -0.194, 0.02);
    baseMesh.castShadow = true;
    monitorGroup.add(baseMesh);

    // Upright Support Neck
    const neckMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.22, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x1A1C22, roughness: 0.4, metalness: 0.5 })
    );
    neckMesh.position.set(0, -0.08, -0.02);
    neckMesh.castShadow = true;
    monitorGroup.add(neckMesh);

    // Monitor Outer Bezel Housing
    const bezelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.42, 0.025),
      new THREE.MeshStandardMaterial({ color: 0x0E1014, roughness: 0.4, metalness: 0.3 })
    );
    bezelMesh.castShadow = true;
    monitorGroup.add(bezelMesh);

    // Live High-Res Interactive Canvas Display
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 576;
    const sCtx = screenCanvas.getContext("2d");
    if (sCtx) {
      // Atmospheric Cyber-Pastoral Terrace Background
      const grad = sCtx.createLinearGradient(0, 0, 0, 576);
      grad.addColorStop(0, "#080D1A");
      grad.addColorStop(0.5, "#141D30");
      grad.addColorStop(1, "#06070B");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 576);

      // Glowing Amber Sunrise Horizon
      sCtx.fillStyle = "rgba(255, 122, 0, 0.45)";
      sCtx.beginPath();
      sCtx.ellipse(512, 290, 400, 110, 0, 0, Math.PI * 2);
      sCtx.fill();

      // Top Status Bar
      sCtx.fillStyle = "rgba(255,255,255,0.75)";
      sCtx.font = "bold 20px monospace";
      sCtx.fillText("SOHAM ROYCHOUDHURY · ATELIER // 2026", 60, 60);
      sCtx.fillText("SYS: RUNNING · 120 FPS", 700, 60);

      // Main Typography
      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 52px sans-serif";
      sCtx.fillText("CYBER-PASTORAL TERRACE", 60, 240);

      sCtx.fillStyle = "rgba(255,255,255,0.85)";
      sCtx.font = "24px sans-serif";
      sCtx.fillText("AI/ML Engineer · Systems Architect · Full-Stack Leader", 60, 290);

      // Enter Button Pill
      sCtx.fillStyle = "rgba(255, 122, 0, 0.95)";
      sCtx.beginPath();
      sCtx.roundRect(60, 370, 460, 68, 34);
      sCtx.fill();

      sCtx.fillStyle = "#000000";
      sCtx.font = "bold 24px monospace";
      sCtx.fillText("CLICK SCREEN TO ENTER ↗", 95, 412);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTextureRef.current = screenTexture;
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.38),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screenMesh.position.set(0, 0, 0.014);
    monitorGroup.add(screenMesh);
    scene.add(monitorGroup);

    // 10. ZEBRONICS GAMING PC RIG (Angular Chassis + Tempered Glass + Spinning ARGB Fan)
    const pcGroup = new THREE.Group();
    pcGroup.position.set(0.46, 0.67, 0.02);

    // Main Chassis Body
    const pcBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.56, 0.46),
      new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.45, metalness: 0.3 })
    );
    pcBody.castShadow = true;
    pcGroup.add(pcBody);

    // Front Angular Facet Panel
    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.235, 0.55, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x0B0C0E, roughness: 0.3, metalness: 0.5 })
    );
    frontPanel.position.set(0, 0, 0.24);
    pcGroup.add(frontPanel);

    // Front RGB Accent Strip
    const frontRgb = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.45, 0.005),
      new THREE.MeshBasicMaterial({ color: 0xFF2D55 })
    );
    frontRgb.position.set(-0.06, 0, 0.256);
    pcGroup.add(frontRgb);

    // Optical Tempered Glass Side Panel (Facing seated user)
    const glassPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, 0.52, 0.42),
      new THREE.MeshPhysicalMaterial({
        color: 0x11151F,
        transmission: 0.85,
        opacity: 0.95,
        transparent: true,
        roughness: 0.08,
        metalness: 0.1,
        clearcoat: 1.0,
      })
    );
    glassPanel.position.set(-0.122, 0, 0);
    pcGroup.add(glassPanel);

    // Internal Motherboard & GPU Block
    const gpuMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x1F242C, roughness: 0.4, metalness: 0.6 })
    );
    gpuMesh.position.set(0, -0.05, 0);
    pcGroup.add(gpuMesh);

    // Dual RAM Sticks with Glowing RGB Diffusers
    for (let r = 0; r < 2; r++) {
      const ram = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.05, 0.06),
        new THREE.MeshBasicMaterial({ color: 0x00E5FF })
      );
      ram.position.set(-0.02, 0.12, -0.03 + r * 0.02);
      pcGroup.add(ram);
    }

    // ARGB Spinning Cooling Fan Assembly
    const fanAssembly = new THREE.Group();
    fanAssembly.position.set(-0.02, 0.08, 0.08);

    const fanRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.065, 0.008, 16, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF2D55 })
    );
    fanAssembly.add(fanRing);

    const fanBladesGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.016, 0.05, 0.004);
    const bladeMat = new THREE.MeshBasicMaterial({ color: 0xFF5588 });
    for (let b = 0; b < 7; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (b / 7) * Math.PI * 2;
      blade.position.set(Math.cos(blade.rotation.z) * 0.03, Math.sin(blade.rotation.z) * 0.03, 0);
      fanBladesGroup.add(blade);
    }
    fanAssembly.add(fanBladesGroup);
    fanMeshRef.current = fanBladesGroup;
    pcGroup.add(fanAssembly);
    scene.add(pcGroup);

    // 11. LOAD & NORMALIZE CURATED HIGH-FIDELITY GLB ASSETS (DRACO DECODED)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Helper: auto-center geometry & normalize dimensions
    const normalizeAndMount = (
      rawScene: THREE.Group,
      targetWidth: number,
      targetPos: THREE.Vector3,
      targetRot: THREE.Euler,
      onMounted?: (wrapper: THREE.Group) => void
    ) => {
      const box = new THREE.Box3().setFromObject(rawScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Re-center internal mesh so origin is at (0, bottom, 0)
      rawScene.position.x -= center.x;
      rawScene.position.y -= box.min.y;
      rawScene.position.z -= center.z;

      const wrapper = new THREE.Group();
      wrapper.add(rawScene);

      const scale = targetWidth / Math.max(size.x, 0.01);
      wrapper.scale.set(scale, scale, scale);
      wrapper.position.copy(targetPos);
      wrapper.rotation.copy(targetRot);

      rawScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(wrapper);
      if (onMounted) onMounted(wrapper);
      return wrapper;
    };

    // A. Mechanical TKL Keyboard (/models/keyboard.gltf)
    gltfLoader.load(
      "/models/keyboard.gltf",
      (gltf) => {
        normalizeAndMount(
          gltf.scene,
          0.38, // 38cm TKL keyboard width
          new THREE.Vector3(-0.08, 0.404, 0.18),
          new THREE.Euler(-0.02, 0.02, 0)
        );
      },
      undefined,
      (err) => console.warn("Keyboard GLTF load fallback:", err)
    );

    // B. Over-Ear Gaming Headphones (/models/headphones.gltf)
    gltfLoader.load(
      "/models/headphones.gltf",
      (gltf) => {
        normalizeAndMount(
          gltf.scene,
          0.19, // 19cm ear-to-ear
          new THREE.Vector3(-0.46, 0.402, 0.16),
          new THREE.Euler(0.10, 0.30, -1.25)
        );
      },
      undefined,
      (err) => console.warn("Headphones GLTF load fallback:", err)
    );

    // C. Gaming Controller / Gamepad (/models/controller.glb)
    gltfLoader.load(
      "/models/controller.glb",
      (gltf) => {
        normalizeAndMount(
          gltf.scene,
          0.18, // 18cm controller width
          new THREE.Vector3(-0.52, 0.513, -0.12), // on wooden riser shelf clearly to the left of monitor
          new THREE.Euler(-0.15, 0.25, -0.05)
        );
      },
      undefined,
      (err) => console.warn("Controller GLB load fallback:", err)
    );

    // 12. INTERACTIVE 3D HIT-BOXES
    const hitBoxes: THREE.Mesh[] = [];
    const hitBoxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

    // Monitor Hit-Box
    const monitorHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.44, 0.15), hitBoxMat);
    monitorHitBox.position.set(-0.06, 0.70, -0.06);
    monitorHitBox.userData = {
      key: "monitor",
      label: "BenQ Widescreen IPS Monitor",
      sub: "Master Portal · Click to Fly Into Website ↗",
      action: trigger3DCameraFlight,
    };
    scene.add(monitorHitBox);
    hitBoxes.push(monitorHitBox);

    // Zebronics PC Rig Hit-Box
    const pcHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.65, 0.52), hitBoxMat);
    pcHitBox.position.set(0.46, 0.67, 0.02);
    pcHitBox.userData = {
      key: "pc_tower",
      label: "Zebronics Gaming Rig",
      sub: "Compute Hardware & AI Architecture",
      action: () => {
        playClickSound(950);
        setActiveModal("specs");
      },
    };
    scene.add(pcHitBox);
    hitBoxes.push(pcHitBox);

    // Keyboard Hit-Box
    const kbHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.10, 0.22), hitBoxMat);
    kbHitBox.position.set(-0.08, 0.42, 0.18);
    kbHitBox.userData = {
      key: "keyboard",
      label: "TKL Mechanical Keyboard",
      sub: "Interactive Hacker CLI Terminal",
      action: () => {
        playClickSound(950);
        setActiveModal("terminal");
      },
    };
    scene.add(kbHitBox);
    hitBoxes.push(kbHitBox);

    // Gamepad Hit-Box (on wooden riser shelf to left of monitor)
    const gpHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.20), hitBoxMat);
    gpHitBox.position.set(-0.52, 0.55, -0.12);
    gpHitBox.userData = {
      key: "gamepad",
      label: "Next-Gen Gamepad Controller",
      sub: "Selected Commissions & High-Performance Projects",
      action: () => {
        playClickSound(950);
        setActiveModal("projects");
      },
    };
    scene.add(gpHitBox);
    hitBoxes.push(gpHitBox);

    // Headset Hit-Box (left desk surface)
    const hsHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.24), hitBoxMat);
    hsHitBox.position.set(-0.46, 0.44, 0.16);
    hsHitBox.userData = {
      key: "headset",
      label: "Over-Ear Gaming Headset",
      sub: "Hobbies, Rituals & Terrace Ambience",
      action: () => {
        playClickSound(950);
        setActiveModal("hobbies");
      },
    };
    scene.add(hsHitBox);
    hitBoxes.push(hsHitBox);

    hitBoxesRef.current = hitBoxes;

    // 13. FLOATING ATMOSPHERIC PARTICLES
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 2.5;
      particlePos[i + 1] = Math.random() * 1.5 + 0.3;
      particlePos[i + 2] = (Math.random() - 0.5) * 1.8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xFFE5B4, size: 0.015, transparent: true, opacity: 0.45 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 14. RAYCASTING & INTERACTION
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseNorm.current.x = x;
      mouseNorm.current.y = y;
      mouseVector.set(x, y);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(hitBoxesRef.current);

      if (intersects.length > 0 && !isFlyingIntoScreen.current) {
        const hit = intersects[0].object;
        const data = hit.userData;
        container.style.cursor = "pointer";
        setHoveredItem({
          key: data.key,
          label: data.label,
          sub: data.sub,
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        container.style.cursor = "default";
        setHoveredItem(null);
      }
    };

    const onPointerClick = (e: MouseEvent) => {
      if (isFlyingIntoScreen.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(hitBoxesRef.current);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.action) {
          hit.userData.action();
        }
      }
    };

    window.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("click", onPointerClick);

    // 15. ANIMATION LOOP (Damped Head Tracking Parallax & Fan Rotation)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Spin ARGB Fan in Zebronics PC
      if (fanMeshRef.current) {
        fanMeshRef.current.rotation.z += delta * 18;
      }

      // Float Ambient Dust Motes
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += delta * 0.04;
          if (pos[i] > 2.0) pos[i] = 0.4;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Seated Chair Head-Tracking Parallax (Natural head tilt!)
      if (!isFlyingIntoScreen.current && cameraRef.current) {
        const targetX = cameraBasePos.current.x + mouseNorm.current.x * 0.08;
        const targetY = cameraBasePos.current.y + mouseNorm.current.y * 0.05;
        camera.position.x += (targetX - camera.position.x) * 0.07;
        camera.position.y += (targetY - camera.position.y) * 0.07;
        camera.lookAt(cameraLookTarget.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w / h < 1.0;

      cameraRef.current.aspect = w / h;
      cameraRef.current.fov = mobile ? 56 : 48;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [trigger3DCameraFlight, playClickSound]);

  return (
    <div className="relative w-full h-[100svh] bg-[#08090C] text-[#F8F5EE] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Top Header Bar: Status Indicator */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · 3D BATTLESTATION</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">BENQ · ZEBRONICS · REDGEAR</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated 3D Studio Active</span>
        </div>
      </header>

      {/* Floating Hologram Tag (Only shows strictly over hovered item!) */}
      {hoveredItem && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: hoveredItem.x, top: hoveredItem.y - 12 }}
        >
          <div className="flex items-center gap-2.5 bg-[#0B0D14]/95 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl shadow-2xl">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              {hoveredItem.key === "monitor" && <Monitor className="w-4 h-4 text-blue-400" />}
              {hoveredItem.key === "pc_tower" && <Cpu className="w-4 h-4 text-red-400" />}
              {hoveredItem.key === "gamepad" && <Gamepad2 className="w-4 h-4 text-purple-400" />}
              {hoveredItem.key === "keyboard" && <Keyboard className="w-4 h-4 text-emerald-400" />}
              {hoveredItem.key === "headset" && <Headphones className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">{hoveredItem.label}</p>
              <p className="text-[10px] text-white/70 font-mono leading-tight">{hoveredItem.sub}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Hardware Navigation Dock */}
      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-full px-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-xl border border-white/15 px-2.5 py-1.5 rounded-2xl shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none">
          {/* BenQ Monitor Enter */}
          <button
            onClick={trigger3DCameraFlight}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all shrink-0"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Monitor</span>
            <span className="text-[10px] opacity-70 font-mono">(Enter)</span>
          </button>

          {/* Zebronics PC Specs */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("specs");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <span>PC Rig</span>
          </button>

          {/* Gamepad Projects */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("projects");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Projects</span>
          </button>

          {/* Headset Hobbies & Sound */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("hobbies");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>Hobbies</span>
          </button>

          {/* Mechanical Keyboard Terminal */}
          <button
            onClick={() => {
              playClickSound(950);
              setActiveModal("terminal");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>CLI Terminal</span>
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            aria-label="Toggle Terrace Wind Ambience"
            className={`p-1.5 rounded-xl border transition-all shrink-0 ${
              isAudioPlaying
                ? "bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40"
                : "bg-white/5 hover:bg-white/15 text-white/60 border-white/10"
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Direct Enter Website CTA */}
          <button
            onClick={trigger3DCameraFlight}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black font-semibold text-xs transition-all shadow-lg shadow-[#FF7A00]/20 shrink-0"
          >
            <span>Enter Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* =========================================================================
          MODALS (Projects, Specs, Hobbies, CLI Terminal)
          ========================================================================= */}
      {activeModal === "projects" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">SELECTED COMMISSIONS // 2024–2026</h3>
                  <p className="text-xs font-mono text-white/60">High-Performance Systems & AI Architectures</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">In-Memory Microsecond Translation Engine</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    &lt; 5ms Latency
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Engineered concurrent lock-free queue and zero-allocation memory pipeline in C++ and Rust for high-frequency live linguistic translation.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">C++</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Rust</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Concurrency</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">European Cricket Federation Real-Time Platform</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Production Ops
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Official operational hub and live broadcast telemetry platform for the Latvian Cricket Federation, powering real-time match engine and international fixture tracking.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Next.js 16</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">WebSockets</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Tailwind</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">DeepSeek & Agentic Multi-Model Orchestrator</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Autonomous AI
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-2">
                  Autonomous task delegation harness running local LLM reasoning benchmarks, recursive code generation, and multi-agent coordination.
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">PyTorch</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">DeepSeek</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">Python</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onNavigateToSection) onNavigateToSection("monument-exhibition");
                  else onEnterPortfolio();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                <span>View Full Exhibition in Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "specs" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ZEBRONICS BATTLESTATION // SPECS & ARCHITECTURE</h3>
                  <p className="text-xs font-mono text-white/60">Hardware Engine & Production Software Stack</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  SYSTEM STATUS: OPTIMAL · THERMALS 28°C
                </span>
                <span>COMPUTE CORES ACTIVE</span>
              </div>

              <div>
                <h4 className="text-xs font-mono text-[#FF7A00] tracking-wider uppercase mb-2">Hardware Peripherals & Enclosure</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Zebronics Angular Gaming Chassis</p>
                    <p className="text-white/60 text-[11px]">Tempered glass side panel with high-airflow ARGB cooling array.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">BenQ Widescreen IPS Monitor</p>
                    <p className="text-white/60 text-[11px]">Color-calibrated precision panel mounted on teak wood shelf riser.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Compact TKL Mechanical Keyboard</p>
                    <p className="text-white/60 text-[11px]">Linear lubricated tactile switches with acoustic dampening foam.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Redgear Mat & Logitech Precision Mouse</p>
                    <p className="text-white/60 text-[11px]">Extended distressed crimson cloth mat with optical precision sensor.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-2">Software Stack & AI Frameworks</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ Next.js 16 (App Router)
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ React 19 & TypeScript
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ Three.js & WebGL 2.0
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ PyTorch & DeepSeek
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ C++ & Rust Systems
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-white/80">
                    ✦ GSAP & Lenis Smooth
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "hobbies" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">LIFE RITUALS & HOBBIES</h3>
                  <p className="text-xs font-mono text-white/60">Music, Sports Operations, Acoustics & Lifestyle</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Organic Terrace Mountain Wind Generator</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isAudioPlaying ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"
                  }`}>
                    {isAudioPlaying ? "PLAYING" : "MUTED"}
                  </span>
                </div>
                <p className="text-xs text-white/70 mb-3">
                  Synthesized in real-time using Web Audio API pink/white noise filtered through organic mountain resonance.
                </p>
                <button
                  onClick={toggleAmbientSound}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black text-xs font-semibold transition-all"
                >
                  {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAudioPlaying ? "Stop Soundscape" : "Start Terrace Breeze"}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-0.5">European Cricket Federation Operations & Athletics</h4>
                <p className="text-xs text-white/70">
                  Active operations contributor for the Latvian Cricket Federation, coordinating international match fixtures, live broadcast graphics, and competitive team management.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-0.5">Mechanical Switch Modding & Acoustic Tuning</h4>
                <p className="text-xs text-white/70">
                  Obsessed with tactile keystroke feedback, lubing switches with Krytox 205g0, custom brass plates, and acoustic dampening.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Close Hobbies
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "terminal" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#090B10] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-white/60 ml-2">soham@battlestation: ~ (bash)</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close terminal"
                className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-white/40">guest@soham:~$</span>
                    <span>{item.cmd}</span>
                  </div>
                  <div className="text-white/80 whitespace-pre-wrap pl-4 border-l border-white/10">
                    {item.out}
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            <form onSubmit={handleTerminalSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-emerald-400 text-xs shrink-0">guest@soham:~$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoFocus
                placeholder="Type 'help', 'whoami', 'projects', 'specs', or 'enter'..."
                className="flex-1 bg-transparent text-white text-xs outline-none border-none placeholder:text-white/30"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px]"
              >
                RUN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
