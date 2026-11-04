"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
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
    { cmd: "system.init", out: "Soham Battlestation 3D Kernel · PBR Studio Active" },
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
  const pcFanLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Mouse / Camera Target coordinates for Smooth Damped Orbit
  const mouseNorm = useRef({ x: 0, y: 0 });
  const cameraBasePos = useRef(new THREE.Vector3(0, 1.45, 2.85));
  const cameraLookTarget = useRef(new THREE.Vector3(0, 0.42, 0.05));
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

  // Continuous 3D Camera Flight into the BenQ Monitor Screen (Zero Flash, Zero Blur Pop)
  const trigger3DCameraFlight = useCallback(() => {
    if (isFlyingIntoScreen.current || !cameraRef.current) return;
    isFlyingIntoScreen.current = true;
    playClickSound(1100);

    const camera = cameraRef.current;
    // Monitor screen 3D center coordinates: (x: -0.15, y: 0.76, z: -0.05)
    const targetPos = new THREE.Vector3(-0.15, 0.76, 0.28);
    const targetLook = new THREE.Vector3(-0.15, 0.76, -0.05);

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

  // Main Three.js Scene Setup (Option B1: High-Fidelity Procedural PBR Room)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#07080A");
    scene.fog = new THREE.FogExp2("#07080A", 0.05);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(isMobile ? 54 : 44, width / height, 0.1, 40);
    const initialPos = isMobile
      ? new THREE.Vector3(0, 1.85, 3.8)
      : new THREE.Vector3(0, 1.45, 2.85);
    camera.position.copy(initialPos);
    cameraBasePos.current.copy(initialPos);
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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING: Multi-Source Cinematic Studio
    // Ambient Base (Deep blue-slate shadow fill)
    const ambientLight = new THREE.AmbientLight(0x222634, 1.4);
    scene.add(ambientLight);

    // Studio Key Softbox (Warm Tungsten Key Light)
    const keyLight = new THREE.DirectionalLight(0xFFE5D0, 2.6);
    keyLight.position.set(-3.5, 4.8, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Cool Rim Light (Sharp blue edge highlight on PC case & monitor)
    const rimLight = new THREE.DirectionalLight(0x60A5FA, 1.1);
    rimLight.position.set(4.0, 3.2, -0.6);
    scene.add(rimLight);

    // Emissive BenQ Monitor Glow Light (Bounces blue-white light downward onto keyboard)
    const screenGlow = new THREE.PointLight(0x8AB4F8, 1.6, 2.2);
    screenGlow.position.set(-0.15, 0.72, 0.25);
    scene.add(screenGlow);
    screenGlowLightRef.current = screenGlow;

    // Internal Zebronics ARGB Fan Glow Light (Casts warm crimson/magenta through tempered glass)
    const pcFanLight = new THREE.PointLight(0xFF3366, 2.2, 1.4);
    pcFanLight.position.set(1.05, 0.72, 0.05);
    scene.add(pcFanLight);
    pcFanLightRef.current = pcFanLight;

    // 5. PBR MATERIALS
    // Dark Smoked Espresso Mahogany Desk Surface
    const mahoganyDeskMat = new THREE.MeshStandardMaterial({
      color: 0x221B18,
      roughness: 0.35,
      metalness: 0.15,
    });

    // Warm Teak Wood Riser Shelf
    const teakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x8C5638,
      roughness: 0.42,
      metalness: 0.1,
    });

    // Space Black Anodized Aluminum (Legs, Stand, Keyboard Base)
    const blackAluminumMat = new THREE.MeshStandardMaterial({
      color: 0x15161A,
      roughness: 0.28,
      metalness: 0.85,
    });

    // Matte Polycarbonate (Keycaps, Bezel)
    const mattePolycarbMat = new THREE.MeshStandardMaterial({
      color: 0x121316,
      roughness: 0.55,
      metalness: 0.1,
    });

    // Real Optical Tempered Glass (Zebronics PC Side Panel)
    const temperedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.35,
      transmission: 0.9,
      roughness: 0.08,
      ior: 1.52,
      thickness: 0.4,
      reflectivity: 0.6,
    });

    // Invisible Hit-Box Material
    const hitBoxMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    const hitBoxes: THREE.Mesh[] = [];

    // 6. ARCHITECTURAL ROOM & WALLS
    // Backing Terracotta/Coral Wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x8B4438, roughness: 0.85 })
    );
    backWall.position.set(0, 2.0, -1.8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Architectural Acoustic Slats on Back Wall
    const slatGeo = new RoundedBoxGeometry(0.045, 5.5, 0.03, 2, 0.005);
    const slatMat = new THREE.MeshStandardMaterial({ color: 0x3A1F1B, roughness: 0.6 });
    for (let x = -5.0; x <= 5.0; x += 0.22) {
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(x, 2.0, -1.78);
      slat.receiveShadow = true;
      scene.add(slat);
    }

    // Master Mahogany Desk Top
    const deskTop = new THREE.Mesh(
      new RoundedBoxGeometry(3.6, 0.08, 1.8, 4, 0.02),
      mahoganyDeskMat
    );
    deskTop.position.set(0, 0.38, 0);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    scene.add(deskTop);

    // Chamfered Metal Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.2, 24);
    const legPositions = [
      [-1.65, -0.22, -0.75],
      [1.65, -0.22, -0.75],
      [-1.65, -0.22, 0.75],
      [1.65, -0.22, 0.75],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, blackAluminumMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // 7. TEAK MONITOR RISER SHELF & NETWORK SWITCH
    const riserGroup = new THREE.Group();
    riserGroup.position.set(-0.15, 0.44, -0.25);

    const riserPlank = new THREE.Mesh(
      new RoundedBoxGeometry(1.65, 0.035, 0.46, 3, 0.008),
      teakWoodMat
    );
    riserPlank.position.set(0, 0.09, 0);
    riserPlank.castShadow = true;
    riserPlank.receiveShadow = true;
    riserGroup.add(riserPlank);

    // Steel Riser Legs
    const riserLegGeo = new THREE.BoxGeometry(0.04, 0.09, 0.44);
    const riserLegLeft = new THREE.Mesh(riserLegGeo, blackAluminumMat);
    riserLegLeft.position.set(-0.75, 0.045, 0);
    riserGroup.add(riserLegLeft);

    const riserLegRight = new THREE.Mesh(riserLegGeo, blackAluminumMat);
    riserLegRight.position.set(0.75, 0.045, 0);
    riserGroup.add(riserLegRight);

    // Small Network Switch Under Shelf
    const netSwitch = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.04, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0A0B0E, roughness: 0.4 })
    );
    netSwitch.position.set(0, 0.02, -0.05);
    riserGroup.add(netSwitch);

    // Switch Activity LEDs
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
    for (let i = -0.12; i <= 0.12; i += 0.04) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.008, 0.002), ledMat);
      led.position.set(i, 0.02, 0.061);
      riserGroup.add(led);
    }
    scene.add(riserGroup);

    // 8. BENQ WIDESCREEN MONITOR (Screen Portal & Light Emitter)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.15, 0.55, -0.25);

    // Stand Base on Riser
    const standBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.42, 0.015, 0.28, 3, 0.005),
      blackAluminumMat
    );
    standBase.position.set(0, 0.02, 0);
    standBase.castShadow = true;
    monitorGroup.add(standBase);

    // Stand Neck
    const standNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.04, 0.35, 24),
      blackAluminumMat
    );
    standNeck.position.set(0, 0.18, -0.04);
    standNeck.castShadow = true;
    monitorGroup.add(standNeck);

    // Monitor Bezel & Frame (16:9 Widescreen)
    const monitorFrame = new THREE.Mesh(
      new RoundedBoxGeometry(1.22, 0.72, 0.035, 3, 0.006),
      blackAluminumMat
    );
    monitorFrame.position.set(0, 0.46, 0.02);
    monitorFrame.castShadow = true;
    monitorGroup.add(monitorFrame);

    // BenQ Logo on Chin
    const benqChin = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 0.004),
      new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.2, metalness: 0.9 })
    );
    benqChin.position.set(0, 0.12, 0.04);
    monitorGroup.add(benqChin);

    // Active Website Screen Texture Canvas
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 576;
    const sCtx = screenCanvas.getContext("2d");
    if (sCtx) {
      // Atmospheric Cyber-Pastoral Terrace Background
      const grad = sCtx.createLinearGradient(0, 0, 0, 576);
      grad.addColorStop(0, "#080D1A");
      grad.addColorStop(0.5, "#131C2E");
      grad.addColorStop(1, "#05070B");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 576);

      // Glowing Amber Sunrise Horizon
      sCtx.fillStyle = "rgba(255, 122, 0, 0.35)";
      sCtx.beginPath();
      sCtx.ellipse(512, 280, 360, 90, 0, 0, Math.PI * 2);
      sCtx.fill();

      // Top Status Bar
      sCtx.fillStyle = "rgba(255,255,255,0.6)";
      sCtx.font = "bold 18px monospace";
      sCtx.fillText("SOHAM ROYCHOUDHURY · ATELIER // 2026", 60, 60);
      sCtx.fillText("SYS: RUNNING · PORT 3000", 720, 60);

      // Main Typography
      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 52px sans-serif";
      sCtx.fillText("CYBER-PASTORAL TERRACE", 60, 240);

      sCtx.fillStyle = "rgba(255,255,255,0.75)";
      sCtx.font = "24px sans-serif";
      sCtx.fillText("AI/ML Engineer · Systems · Frontend Architect", 60, 290);

      // Enter Button Pill
      sCtx.fillStyle = "rgba(255, 122, 0, 0.85)";
      sCtx.beginPath();
      sCtx.roundRect(60, 370, 380, 64, 32);
      sCtx.fill();

      sCtx.fillStyle = "#000000";
      sCtx.font = "bold 22px monospace";
      sCtx.fillText("CLICK MONITOR TO ENTER ↗", 95, 410);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTextureRef.current = screenTexture;

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.16, 0.65),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screenMesh.position.set(0, 0.465, 0.039);
    monitorGroup.add(screenMesh);

    // Screen Hit-Box
    const monitorHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.24, 0.74, 0.15),
      hitBoxMat
    );
    monitorHitBox.position.set(0, 0.46, 0.05);
    monitorHitBox.userData = {
      key: "monitor",
      label: "BenQ Widescreen Monitor",
      sub: "Master Portal · Click to Fly Into Website ↗",
      action: trigger3DCameraFlight,
    };
    monitorGroup.add(monitorHitBox);
    hitBoxes.push(monitorHitBox);

    scene.add(monitorGroup);

    // 9. ZEBRONICS GAMING PC TOWER (Right Side)
    const pcGroup = new THREE.Group();
    pcGroup.position.set(1.15, 0.76, 0.0);

    // Main Chassis Body
    const pcBody = new THREE.Mesh(
      new RoundedBoxGeometry(0.26, 0.68, 0.58, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.35, metalness: 0.8 })
    );
    pcBody.castShadow = true;
    pcBody.receiveShadow = true;
    pcGroup.add(pcBody);

    // Front Angular Faceted Mesh Panel
    const frontFacet = new THREE.Mesh(
      new THREE.BoxGeometry(0.258, 0.66, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x18191E, roughness: 0.7 })
    );
    frontFacet.position.set(0, 0, 0.29);
    pcGroup.add(frontFacet);

    // Tempered Glass Left Side Panel (Facing User/Desk)
    const glassSide = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.64, 0.54),
      temperedGlassMat
    );
    glassSide.position.set(-0.132, 0, 0);
    pcGroup.add(glassSide);

    // PC Interior: Motherboard, GPU & Spinning ARGB Fan
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(-0.02, 0, 0);

    // Motherboard PCB
    const mobo = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.52, 0.44),
      new THREE.MeshStandardMaterial({ color: 0x081510, roughness: 0.8 })
    );
    mobo.position.set(0.08, 0, 0);
    interiorGroup.add(mobo);

    // GPU Block
    const gpu = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x1E2128, roughness: 0.4, metalness: 0.8 })
    );
    gpu.position.set(0.02, -0.06, 0.02);
    interiorGroup.add(gpu);

    // Spinning ARGB Rear Fan
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0.02, 0.14, -0.16);
    const fanRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.01, 16, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF2D55 })
    );
    fanGroup.add(fanRing);

    const bladeGeo = new THREE.BoxGeometry(0.02, 0.06, 0.004);
    const bladeMat = new THREE.MeshBasicMaterial({ color: 0xFF5588 });
    for (let b = 0; b < 7; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (b / 7) * Math.PI * 2;
      blade.position.set(Math.cos(blade.rotation.z) * 0.035, Math.sin(blade.rotation.z) * 0.035, 0);
      fanGroup.add(blade);
    }
    fanMeshRef.current = fanGroup;
    interiorGroup.add(fanGroup);

    pcGroup.add(interiorGroup);

    // PC Hit-Box
    const pcHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.72, 0.62),
      hitBoxMat
    );
    pcHitBox.position.set(0, 0, 0);
    pcHitBox.userData = {
      key: "pc_tower",
      label: "Zebronics Gaming Rig",
      sub: "Compute Hardware & AI Tech Stack",
      action: () => {
        playClickSound(950);
        setActiveModal("specs");
      },
    };
    pcGroup.add(pcHitBox);
    hitBoxes.push(pcHitBox);

    scene.add(pcGroup);

    // 10. REDGEAR MOUSEPAD & COMPACT TKL KEYBOARD (Front Center)
    const matGroup = new THREE.Group();
    matGroup.position.set(0, 0.422, 0.35);

    // Redgear Desk Mat with Red Splash Artwork
    const mousePad = new THREE.Mesh(
      new RoundedBoxGeometry(1.65, 0.004, 0.65, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x18191D, roughness: 0.95 })
    );
    mousePad.receiveShadow = true;
    matGroup.add(mousePad);

    // Red Distressed Splash Accent
    const splashAccent = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.45),
      new THREE.MeshBasicMaterial({ color: 0xCC1122, transparent: true, opacity: 0.35 })
    );
    splashAccent.rotation.x = -Math.PI / 2;
    splashAccent.position.set(0.45, 0.003, 0.05);
    matGroup.add(splashAccent);

    // Compact TKL Mechanical Keyboard
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.15, 0.015, 0.02);

    const kbBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.022, 0.22, 3, 0.006),
      blackAluminumMat
    );
    kbBase.castShadow = true;
    kbBase.receiveShadow = true;
    kbGroup.add(kbBase);

    // Modeled Individual Keycaps Grid
    const keyGeo = new RoundedBoxGeometry(0.026, 0.012, 0.026, 2, 0.003);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        const kx = (c - 6.5) * 0.035;
        const kz = (r - 2) * 0.036;
        const keycap = new THREE.Mesh(keyGeo, mattePolycarbMat);
        keycap.position.set(kx, 0.015, kz);
        kbGroup.add(keycap);
      }
    }

    // Keyboard Hit-Box
    const kbHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.08, 0.28),
      hitBoxMat
    );
    kbHitBox.position.set(0, 0.02, 0);
    kbHitBox.userData = {
      key: "keyboard",
      label: "TKL Mechanical Keyboard",
      sub: "Interactive Hacker CLI Terminal",
      action: () => {
        playClickSound(950);
        setActiveModal("terminal");
      },
    };
    kbGroup.add(kbHitBox);
    hitBoxes.push(kbHitBox);

    matGroup.add(kbGroup);

    // 11. LOGITECH G GAMING MOUSE (Right Side of Mat)
    const mouseGroup = new THREE.Group();
    mouseGroup.position.set(0.48, 0.02, 0.02);

    const mouseBody = new THREE.Mesh(
      new RoundedBoxGeometry(0.11, 0.035, 0.18, 4, 0.015),
      mattePolycarbMat
    );
    mouseBody.castShadow = true;
    mouseGroup.add(mouseBody);

    // Glowing G Logo
    const gLogo = new THREE.Mesh(
      new THREE.CircleGeometry(0.014, 16),
      new THREE.MeshBasicMaterial({ color: 0x00E5FF })
    );
    gLogo.rotation.x = -Math.PI / 2;
    gLogo.position.set(0, 0.02, 0.02);
    mouseGroup.add(gLogo);

    matGroup.add(mouseGroup);
    scene.add(matGroup);

    // 12. OVER-EAR GAMING HEADSET (Front Left Desk)
    const headsetGroup = new THREE.Group();
    headsetGroup.position.set(-1.05, 0.48, 0.35);
    headsetGroup.rotation.y = THREE.MathUtils.degToRad(35);

    // Headband Dual Arch
    const headband = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.012, 16, 32, Math.PI),
      blackAluminumMat
    );
    headband.rotation.x = Math.PI / 2;
    headsetGroup.add(headband);

    // Earcups Left & Right
    const cupGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.045, 24);
    const cupLeft = new THREE.Mesh(cupGeo, mattePolycarbMat);
    cupLeft.position.set(-0.12, 0, 0);
    cupLeft.rotation.z = Math.PI / 2;
    cupLeft.castShadow = true;
    headsetGroup.add(cupLeft);

    const cupRight = new THREE.Mesh(cupGeo, mattePolycarbMat);
    cupRight.position.set(0.12, 0, 0);
    cupRight.rotation.z = Math.PI / 2;
    cupRight.castShadow = true;
    headsetGroup.add(cupRight);

    // Boom Microphone Arm
    const boomMic = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.16, 12),
      blackAluminumMat
    );
    boomMic.position.set(-0.12, -0.04, 0.08);
    boomMic.rotation.x = Math.PI / 3;
    headsetGroup.add(boomMic);

    // Headset Hit-Box
    const headsetHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.22, 0.28),
      hitBoxMat
    );
    headsetHitBox.position.set(0, 0, 0);
    headsetHitBox.userData = {
      key: "headset",
      label: "Over-Ear Gaming Headset",
      sub: "Hobbies, Rituals & Terrace Ambience",
      action: () => {
        playClickSound(950);
        setActiveModal("hobbies");
      },
    };
    headsetGroup.add(headsetHitBox);
    hitBoxes.push(headsetHitBox);

    scene.add(headsetGroup);

    // 13. GAMEPAD (Resting on Teak Shelf Left of Monitor)
    const gamepadGroup = new THREE.Group();
    gamepadGroup.position.set(-0.65, 0.58, -0.22);
    gamepadGroup.rotation.y = THREE.MathUtils.degToRad(-15);

    const gpBody = new THREE.Mesh(
      new RoundedBoxGeometry(0.22, 0.04, 0.14, 4, 0.015),
      mattePolycarbMat
    );
    gpBody.castShadow = true;
    gamepadGroup.add(gpBody);

    // Thumbsticks with Red Rings
    const redRingMat = new THREE.MeshBasicMaterial({ color: 0xFF1133 });
    const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 16);

    const stickLeft = new THREE.Mesh(stickGeo, mattePolycarbMat);
    stickLeft.position.set(-0.05, 0.025, 0.02);
    const ringLeft = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.003, 8, 16), redRingMat);
    ringLeft.rotation.x = Math.PI / 2;
    ringLeft.position.set(-0.05, 0.028, 0.02);
    gamepadGroup.add(stickLeft);
    gamepadGroup.add(ringLeft);

    const stickRight = new THREE.Mesh(stickGeo, mattePolycarbMat);
    stickRight.position.set(0.05, 0.025, -0.01);
    const ringRight = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.003, 8, 16), redRingMat);
    ringRight.rotation.x = Math.PI / 2;
    ringRight.position.set(0.05, 0.028, -0.01);
    gamepadGroup.add(stickRight);
    gamepadGroup.add(ringRight);

    // Gamepad Hit-Box
    const gpHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.08, 0.18),
      hitBoxMat
    );
    gpHitBox.position.set(0, 0.02, 0);
    gpHitBox.userData = {
      key: "gamepad",
      label: "Gamepad Controller",
      sub: "Selected Commissions & Projects",
      action: () => {
        playClickSound(950);
        setActiveModal("projects");
      },
    };
    gamepadGroup.add(gpHitBox);
    hitBoxes.push(gpHitBox);

    scene.add(gamepadGroup);

    // 14. ATMOSPHERIC PARTICLES (Floating Dust Motes in Light Shaft)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4;
      particlePos[i + 1] = Math.random() * 2.5 + 0.3;
      particlePos[i + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFE5B4,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    hitBoxesRef.current = hitBoxes;

    // 15. RAYCASTING & INTERACTION
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

    // 16. ANIMATION LOOP (Damped Orbit, Spinning Fan, Particle Float)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Spin ARGB Fan in Zebronics PC
      if (fanMeshRef.current) {
        fanMeshRef.current.rotation.z += delta * 18;
      }

      // Float Ambient Dust Motes
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] += delta * 0.05;
          if (pos[i] > 3.0) pos[i] = 0.4;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth Damped Orbit Parallax (Near objects shift faster than background!)
      if (!isFlyingIntoScreen.current && cameraRef.current) {
        const targetX = cameraBasePos.current.x + mouseNorm.current.x * 0.45;
        const targetY = cameraBasePos.current.y + mouseNorm.current.y * 0.28;
        camera.position.x += (targetX - camera.position.x) * 0.06;
        camera.position.y += (targetY - camera.position.y) * 0.06;
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
      cameraRef.current.fov = mobile ? 54 : 44;
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
    <div className="relative w-full h-[100svh] bg-[#07080A] text-[#F8F5EE] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Top Header Bar: Status Indicator */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · REAL BATTLESTATION</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">BENQ · ZEBRONICS · REDGEAR</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D PBR Studio Active</span>
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
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-4 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/80 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-2xl shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none">
          {/* BenQ Monitor Enter */}
          <button
            onClick={trigger3DCameraFlight}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>CLI Terminal</span>
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleAmbientSound}
            aria-label="Toggle Terrace Wind Ambience"
            className={`p-2 rounded-xl border transition-all shrink-0 ${
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black font-semibold text-xs transition-all shadow-lg shadow-[#FF7A00]/20 shrink-0"
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
                    <p className="font-semibold text-white">Redgear Mat & Logitech G Mouse</p>
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
