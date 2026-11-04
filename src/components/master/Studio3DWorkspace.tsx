"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import {
  X,
  ArrowRight,
  Terminal as TerminalIcon,
  Cpu,
  Gamepad2,
  Headphones,
  Volume2,
  VolumeX,
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
  const warpFlashRef = useRef<HTMLDivElement>(null);

  // Interactive Modals
  const [activeModal, setActiveModal] = useState<"projects" | "specs" | "hobbies" | "terminal" | null>(null);

  // Audio Ambience
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Interaction HUD & Status
  const [interactionHint, setInteractionHint] = useState<string>("MOVE TO SCATTER · HOLD FOR BLACK HOLE · CLICK TO HYPERSPACE");

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: "system.init", out: "Kinetic CPU Particle Core · 4-Way Bus Architecture Active" },
    { cmd: "whoami", out: "Soham Roychoudhury — AI/ML Engineer & Systems Architect" },
    { cmd: "help", out: "Commands: 'whoami', 'projects', 'specs', 'hobbies', 'sound on', 'sound off', 'enter', 'clear'" },
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cpuGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Simulation physics state
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const blackHolePosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseLocalPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseNormRef = useRef({ x: 0, y: 0 });
  const isTransitioningRef = useRef(false);
  const isExplodingRef = useRef(false);
  const explosionStartTimeRef = useRef(0);
  const warpProgressRef = useRef(0);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const blackHoleOscRef = useRef<OscillatorNode | null>(null);
  const blackHoleGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize Audio Context safely
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Audio: Black Hole Gravitational Drone (starts on hold)
  const startBlackHoleSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (blackHoleOscRef.current) {
        try {
          blackHoleOscRef.current.stop();
          blackHoleOscRef.current.disconnect();
        } catch {}
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      blackHoleOscRef.current = osc;
      blackHoleGainRef.current = gain;
    } catch {}
  }, [getAudioContext]);

  // Audio: Supernova Shockwave Detonation (plays on release)
  const stopBlackHoleSoundAndBlast = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Stop black hole drone
      if (blackHoleGainRef.current) {
        blackHoleGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      }
      setTimeout(() => {
        try {
          if (blackHoleOscRef.current) {
            blackHoleOscRef.current.stop();
            blackHoleOscRef.current.disconnect();
            blackHoleOscRef.current = null;
          }
        } catch {}
      }, 100);

      // Supernova air-burst pop
      const blastOsc = ctx.createOscillator();
      const blastGain = ctx.createGain();
      blastOsc.type = "sine";
      blastOsc.frequency.setValueAtTime(170, ctx.currentTime);
      blastOsc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.22);

      blastGain.gain.setValueAtTime(0.20, ctx.currentTime);
      blastGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

      blastOsc.connect(blastGain);
      blastGain.connect(ctx.destination);
      blastOsc.start();
      blastOsc.stop(ctx.currentTime + 0.25);
    } catch {}
  }, [getAudioContext]);

  // Audio: Star Wars Hyperspace Hyperdrive Spool (plays on warp jump)
  const playHyperspaceSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.25);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3400, ctx.currentTime + 1.25);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.35);
    } catch {}
  }, [getAudioContext]);

  // Audio: Tactical Keystroke/Chime
  const playTactileClick = useCallback((freq = 900) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, [getAudioContext]);

  // Ambient organic terrace mountain breeze generator
  const toggleAmbientSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

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
  }, [isAudioPlaying, getAudioContext]);

  // Star Wars Galactic Warp Hyperspace Jump into Portfolio Website
  const triggerWarpTransition = useCallback(() => {
    if (isTransitioningRef.current || !cameraRef.current) return;
    isTransitioningRef.current = true;
    playHyperspaceSound();
    setInteractionHint("HYPERSPACE JUMP ENGAGED · WARPING TO PORTFOLIO");

    const camera = cameraRef.current;

    // Animate warp progress uniform (streaks particles into hyperspace speed trails)
    gsap.to(warpProgressRef, {
      current: 1.0,
      duration: 1.25,
      ease: "power3.in",
    });

    // Camera surges forward through the particle field
    gsap.to(camera.position, {
      z: -1.4,
      duration: 1.35,
      ease: "power3.in",
    });

    // White/champagne hyperspace flash overlay
    if (warpFlashRef.current) {
      gsap.to(warpFlashRef.current, {
        opacity: 1,
        duration: 0.45,
        delay: 0.95,
        ease: "power2.inOut",
        onComplete: () => {
          onEnterPortfolio();
          isTransitioningRef.current = false;
        },
      });
    } else {
      setTimeout(() => {
        onEnterPortfolio();
        isTransitioningRef.current = false;
      }, 1300);
    }
  }, [onEnterPortfolio, playHyperspaceSound]);

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playTactileClick(1200);

    let output = "";
    if (cmd === "whoami") {
      output = "Soham Roychoudhury · AI Engineer & Frontend Architect. NSEC IT 2026 · European Cricket Ops.";
    } else if (cmd === "projects") {
      output = "1. In-Memory Translation Engine (<5ms)  2. European Cricket Ops Platform  3. DeepSeek Agent Harness";
    } else if (cmd === "specs") {
      output = "Architecture: C++20, Rust, PyTorch, DeepSeek, Next.js 16, Distributed Agent Kernels.";
    } else if (cmd === "hobbies") {
      output = "Cricket Athletics (Latvian Cricket Fed), Keyboard Modding, Ambient Acoustics, Generative Art.";
    } else if (cmd === "sound on") {
      if (!isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic mountain wind soundscape: ACTIVE.";
    } else if (cmd === "sound off") {
      if (isAudioPlaying) toggleAmbientSound();
      output = "Terrace organic soundscape: MUTED.";
    } else if (cmd === "enter") {
      output = "Warping particle core into portfolio...";
      setTimeout(() => {
        setActiveModal(null);
        triggerWarpTransition();
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

  // Main Three.js Particle Physics Engine (CPU Structure + 4-Way Bus + Studio Smoke)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(isMobile ? 52 : 44, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 3.6 : 3.0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. CINEMATIC VOLUMETRIC STUDIO SMOKE BACKGROUND (Fullscreen Shader Quad)
    const smokeQuadGeo = new THREE.PlaneGeometry(2, 2);
    const smokeMat = new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = rot * p * 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
          float t = uTime * 0.05;

          // Slow billowing studio smoke
          vec2 smokeCoord = p * 1.4 + vec2(sin(t * 0.4) * 0.25, t * 0.2);
          float s1 = fbm(smokeCoord);
          float s2 = fbm(smokeCoord + vec2(s1 * 0.7, s1 * 0.4));

          // Palette: Deep graphite / charcoal base with subtle warm champagne haze
          vec3 darkBg = vec3(0.024, 0.027, 0.035);
          vec3 smokeColor = vec3(0.075, 0.070, 0.065);

          // Deep radial vignette
          float vignette = 1.0 - smoothstep(0.3, 1.35, length(p));
          vec3 col = mix(darkBg, smokeColor, s2 * 0.7) * vignette;

          // 35mm film grain
          float grain = (hash(vUv * 500.0 + fract(uTime)) - 0.5) * 0.022;
          col += grain;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const smokeQuad = new THREE.Mesh(smokeQuadGeo, smokeMat);
    scene.add(smokeQuad);

    // 4. 3D CPU ROOT GROUP (For dynamic 3D tilt & perspective parallax)
    const cpuGroup = new THREE.Group();
    scene.add(cpuGroup);
    cpuGroupRef.current = cpuGroup;

    // 5. BLACK HOLE VISUAL ENTITY (Event Horizon Void + Glowing Accretion Photon Sphere)
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.visible = false;
    blackHoleGroup.scale.set(0, 0, 0);
    cpuGroup.add(blackHoleGroup);

    // 5A. Dark Event Horizon Void (Pure black disk that masks background smoke and particles)
    const eventHorizonGeo = new THREE.CircleGeometry(0.095, 48);
    const eventHorizonMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      depthTest: true,
    });
    const eventHorizonMesh = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
    eventHorizonMesh.renderOrder = 20;
    blackHoleGroup.add(eventHorizonMesh);

    // 5B. Luminous Accretion Ring (Photon Sphere with swirling champagne/gold fire)
    const accretionGeo = new THREE.PlaneGeometry(0.42, 0.42);
    const accretionMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv - vec2(0.5);
          float r = length(p) * 2.0; // 0 to 1
          if (r < 0.42 || r > 1.0) discard;

          float angle = atan(p.y, p.x);
          // High-energy relativistic swirling photon stream
          float swirl = sin(angle * 7.0 - uTime * 9.0) * 0.5 + 0.5;
          float ringFalloff = smoothstep(0.42, 0.58, r) * (1.0 - smoothstep(0.75, 1.0, r));

          // Monochromatic Champagne / Gold Photon Colors
          vec3 innerHot = vec3(1.0, 0.98, 0.92);  // Intense champagne white
          vec3 outerAmber = vec3(0.92, 0.74, 0.42); // Warm golden beige
          vec3 col = mix(outerAmber, innerHot, ringFalloff * 0.8 + swirl * 0.2);

          float alpha = ringFalloff * (0.85 + swirl * 0.15);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const accretionMesh = new THREE.Mesh(accretionGeo, accretionMat);
    accretionMesh.renderOrder = 21;
    blackHoleGroup.add(accretionMesh);

    // 6. PROCEDURAL COMPACT CPU POINT-CLOUD WITH 4-WAY EXTENDED BUS LINES
    const PARTICLE_COUNT = isMobile ? 35000 : 60000;
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particlePhases = new Float32Array(PARTICLE_COUNT);
    const particleTypes = new Uint8Array(PARTICLE_COUNT); // 0: die, 1: N/S trace, 2: E/W trace, 3: pad, 4: dust

    // Monochromatic Light Sand / Champagne / Warm Beige Color Palette Variations
    const SAND_SHADES = [
      [0.98, 0.95, 0.90], // Light Champagne (#FFF8F0)
      [0.94, 0.88, 0.78], // Cream Sand (#F5E6D3)
      [0.89, 0.80, 0.68], // Warm Desert Ecru (#E8D2B8)
      [0.82, 0.71, 0.56], // Golden Sand (#D9BD99)
      [0.72, 0.60, 0.45], // Deep Sand Shadow (#B89975)
    ];

    let pIdx = 0;
    function addCpuPoint(
      x: number,
      y: number,
      z: number,
      shade: number[],
      type: number,
      sizeMultiplier = 1.0
    ) {
      if (pIdx >= PARTICLE_COUNT) return;
      const i3 = pIdx * 3;

      currentPositions[i3] = x + (Math.random() - 0.5) * 0.2;
      currentPositions[i3 + 1] = y + (Math.random() - 0.5) * 0.2;
      currentPositions[i3 + 2] = z + (Math.random() - 0.5) * 0.2;

      targetPositions[i3] = x;
      targetPositions[i3 + 1] = y;
      targetPositions[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Color variation within champagne palette
      particleColors[i3] = shade[0] + (Math.random() - 0.5) * 0.03;
      particleColors[i3 + 1] = shade[1] + (Math.random() - 0.5) * 0.03;
      particleColors[i3 + 2] = shade[2] + (Math.random() - 0.5) * 0.03;

      particleSizes[pIdx] = (Math.random() * 1.8 + 1.2) * sizeMultiplier;
      particlePhases[pIdx] = Math.random() * Math.PI * 2;
      particleTypes[pIdx] = type;

      pIdx++;
    }

    // A. CENTRAL COMPUTE DIE (Compact focal core giving generous breathing room)
    // Scale: 0.52 x 0.52 total chip die footprint
    const dieHalf = 0.26;
    const coreCount = Math.floor(PARTICLE_COUNT * 0.28);
    for (let i = 0; i < coreCount; i++) {
      // 4 Multi-core silicon quadrants
      const quadX = Math.random() > 0.5 ? 1 : -1;
      const quadY = Math.random() > 0.5 ? 1 : -1;
      const coreCenterX = quadX * 0.13;
      const coreCenterY = quadY * 0.13;

      // Silicon logic gate lines: dense parallel micro-gate stripes
      const lineIndex = Math.floor(Math.random() * 12);
      const rowY = coreCenterY - 0.09 + lineIndex * 0.016;
      const rowX = coreCenterX + (Math.random() - 0.5) * 0.18;
      const z = 0.03 + (Math.random() - 0.5) * 0.015;

      const shade = SAND_SHADES[Math.floor(Math.random() * 3)];
      addCpuPoint(rowX, rowY, z, shade, 0, 1.0);
    }

    // Gold Pin 1 Corner Alignment Notch (Top-Left of Die)
    for (let i = 0; i < 180; i++) {
      const u = Math.random();
      const v = Math.random() * (1 - u);
      const x = -dieHalf + u * 0.06;
      const y = dieHalf - v * 0.06;
      addCpuPoint(x, y, 0.045, SAND_SHADES[0], 0, 1.2);
    }

    // Die Perimeter Bevel & Heat Spreader Lip
    const borderCount = Math.floor(PARTICLE_COUNT * 0.08);
    for (let i = 0; i < borderCount; i++) {
      const side = Math.floor(Math.random() * 4);
      const t = (Math.random() - 0.5) * (dieHalf * 2);
      let x = 0, y = 0;
      if (side === 0) { x = t; y = dieHalf; }
      else if (side === 1) { x = t; y = -dieHalf; }
      else if (side === 2) { x = dieHalf; y = t; }
      else { x = -dieHalf; y = t; }
      addCpuPoint(x + (Math.random() - 0.5) * 0.01, y + (Math.random() - 0.5) * 0.01, 0.02, SAND_SHADES[1], 0, 1.1);
    }

    // B. 4-WAY EXTENDED BUS INTERCONNECT TRACES (North, South, East, West)
    // Clean, distinct parallel particle ribbons shooting outwards from all four sides
    const traceParticles = Math.floor(PARTICLE_COUNT * 0.44);
    const particlesPerDir = Math.floor(traceParticles / 4);

    // North Traces (Y > +0.32 up to +1.32)
    for (let i = 0; i < particlesPerDir; i++) {
      const lane = Math.floor(Math.random() * 18) - 9; // -9 to +8
      const t = Math.random(); // 0 to 1 along length
      let lx = lane * 0.026;
      let ly = 0.32 + t * 1.00;

      // Outer traces make authentic 45-degree circuit bends
      if (Math.abs(lane) > 4) {
        const sign = lane > 0 ? 1 : -1;
        if (t > 0.35 && t < 0.60) {
          const bendT = (t - 0.35) / 0.25;
          lx += sign * bendT * 0.16;
        } else if (t >= 0.60) {
          lx += sign * 0.16;
        }
      }

      const z = (Math.random() - 0.5) * 0.02;
      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      addCpuPoint(lx, ly, z, shade, 1, 0.95);
    }

    // South Traces (Y < -0.32 down to -1.32)
    for (let i = 0; i < particlesPerDir; i++) {
      const lane = Math.floor(Math.random() * 18) - 9;
      const t = Math.random();
      let lx = lane * 0.026;
      let ly = -0.32 - t * 1.00;

      if (Math.abs(lane) > 4) {
        const sign = lane > 0 ? 1 : -1;
        if (t > 0.35 && t < 0.60) {
          const bendT = (t - 0.35) / 0.25;
          lx += sign * bendT * 0.16;
        } else if (t >= 0.60) {
          lx += sign * 0.16;
        }
      }

      const z = (Math.random() - 0.5) * 0.02;
      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      addCpuPoint(lx, ly, z, shade, 1, 0.95);
    }

    // East Traces (X > +0.32 out to +1.38)
    for (let i = 0; i < particlesPerDir; i++) {
      const lane = Math.floor(Math.random() * 18) - 9;
      const t = Math.random();
      let lx = 0.32 + t * 1.06;
      let ly = lane * 0.026;

      if (Math.abs(lane) > 4) {
        const sign = lane > 0 ? 1 : -1;
        if (t > 0.35 && t < 0.60) {
          const bendT = (t - 0.35) / 0.25;
          ly += sign * bendT * 0.16;
        } else if (t >= 0.60) {
          ly += sign * 0.16;
        }
      }

      const z = (Math.random() - 0.5) * 0.02;
      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      addCpuPoint(lx, ly, z, shade, 2, 0.95);
    }

    // West Traces (X < -0.32 out to -1.38)
    for (let i = 0; i < particlesPerDir; i++) {
      const lane = Math.floor(Math.random() * 18) - 9;
      const t = Math.random();
      let lx = -0.32 - t * 1.06;
      let ly = lane * 0.026;

      if (Math.abs(lane) > 4) {
        const sign = lane > 0 ? 1 : -1;
        if (t > 0.35 && t < 0.60) {
          const bendT = (t - 0.35) / 0.25;
          ly += sign * bendT * 0.16;
        } else if (t >= 0.60) {
          ly += sign * 0.16;
        }
      }

      const z = (Math.random() - 0.5) * 0.02;
      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      addCpuPoint(lx, ly, z, shade, 2, 0.95);
    }

    // C. TERMINAL VIA PADS / SOLDER BALL TEST POINTS (At the outer tips of traces)
    const padCount = Math.floor(PARTICLE_COUNT * 0.06);
    for (let i = 0; i < padCount; i++) {
      const side = Math.floor(Math.random() * 4);
      const lane = Math.floor(Math.random() * 18) - 9;
      const sign = lane > 0 ? 1 : -1;
      const bendOffset = Math.abs(lane) > 4 ? sign * 0.16 : 0;
      let cx = 0, cy = 0;

      if (side === 0) { cx = lane * 0.026 + bendOffset; cy = 1.32; }
      else if (side === 1) { cx = lane * 0.026 + bendOffset; cy = -1.32; }
      else if (side === 2) { cx = 1.38; cy = lane * 0.026 + bendOffset; }
      else { cx = -1.38; cy = lane * 0.026 + bendOffset; }

      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.028;
      addCpuPoint(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r, 0.015, SAND_SHADES[0], 3, 1.25);
    }

    // D. SUBSTRATE PIN GRID ARRAY (PGA / BGA Contacts underneath)
    const pinCount = Math.floor(PARTICLE_COUNT * 0.06);
    for (let i = 0; i < pinCount; i++) {
      const px = (Math.floor(Math.random() * 16) - 8) * 0.045;
      const py = (Math.floor(Math.random() * 16) - 8) * 0.045;
      if (Math.abs(px) < 0.18 && Math.abs(py) < 0.18) continue;
      addCpuPoint(px, py, -0.06 + (Math.random() - 0.5) * 0.015, SAND_SHADES[4], 0, 0.9);
    }

    // E. AMBIENT CHAMPAGNE FLOATING DUST (Fills negative breathing space)
    while (pIdx < PARTICLE_COUNT) {
      const r = 0.8 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.cos(phi);
      const z = r * Math.sin(phi) * 0.35;
      addCpuPoint(x, y, z, SAND_SHADES[4], 4, 0.8);
    }

    // 7. POINT CLOUD GEOMETRY & SHADER MATERIAL WITH STAR WARS WARP STRETCH
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uWarpProgress: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWarpProgress;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vWarp;

        void main() {
          vColor = color;
          vWarp = uWarpProgress;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // During Star Wars warp, scale particles up dynamically as they race to screen
          float warpScale = 1.0 + uWarpProgress * 2.8;
          float ptSize = size * warpScale * (7.2 / -mvPosition.z);
          gl_PointSize = clamp(ptSize, 1.5, 26.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uWarpProgress;
        varying vec3 vColor;
        varying float vWarp;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          // Stretch into speed trails during galactic hyperspace jump
          if (vWarp > 0.05) {
            coord.x *= (1.0 + vWarp * 1.6);
          }
          float d = length(coord);
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.12, d) * (0.92 + vWarp * 0.08);
          // Particles glow into pure luminous champagne star-trails in hyperspace
          vec3 finalColor = mix(vColor, vec3(1.0, 0.98, 0.92), vWarp * 0.65);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    cpuGroup.add(particles);
    particlesRef.current = particles;

    // 8. INTERACTION RAYCASTING WITH 3D LOCAL TRANSFORMATION
    const rayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    // Map screen mouse coordinates to 3D local coordinates inside the tilted CPU group
    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
      mouseVector.x = nx;
      mouseVector.y = ny;
      mouseNormRef.current = { x: nx, y: ny };

      raycaster.setFromCamera(mouseVector, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(rayPlane, intersectionPoint);

      if (intersectionPoint && cpuGroupRef.current) {
        // Transform world coordinate into tilted CPU local space!
        const localPos = cpuGroupRef.current.worldToLocal(intersectionPoint.clone());
        mouseLocalPosRef.current.copy(localPos);
      }
    };

    // POINTER MOVE: Update tilt & local position
    const onPointerMove = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
      if (isHoldingRef.current) {
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
      }
    };

    // POINTER DOWN: Record position & schedule Black Hole hold
    const holdTimerRef = { id: 0 as any };
    const onPointerDown = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      holdStartRef.current = performance.now();

      // If user holds for more than 150ms, ignite the True Black Hole Singularity!
      holdTimerRef.id = setTimeout(() => {
        isHoldingRef.current = true;
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
        startBlackHoleSound();
        setInteractionHint("BLACK HOLE ACTIVE · SUCKING ALL PARTICLES IN · RELEASE TO EXPLODE");
      }, 150);
    };

    // POINTER UP: If holding -> Detonate Violent 3D Scatter! If click -> Star Wars Hyperspace!
    const onPointerUp = (e: PointerEvent) => {
      clearTimeout(holdTimerRef.id);
      const pressDuration = performance.now() - holdStartRef.current;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (isHoldingRef.current) {
        // Was holding: Detonate Supernova 3D Scatter Explosion!
        isHoldingRef.current = false;
        isExplodingRef.current = true;
        explosionStartTimeRef.current = performance.now();
        stopBlackHoleSoundAndBlast();
        setInteractionHint("SUPERNOVA SHOCKWAVE DETONATED · MAGNETIC RE-STRUCTURING");

        // Apply violent 3D omnidirectional scatter impulse (No liquid ripple!)
        const bh = blackHolePosRef.current;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const px = currentPositions[i3];
          const py = currentPositions[i3 + 1];
          const pz = currentPositions[i3 + 2];

          const edx = px - bh.x;
          const edy = py - bh.y;
          const edz = pz - bh.z;
          const dist = Math.sqrt(edx * edx + edy * edy + edz * edz) + 0.01;

          // Chaotic 3D outward burst vectors
          const rx = (Math.random() - 0.5) * 2.0;
          const ry = (Math.random() - 0.5) * 2.0;
          const rz = (Math.random() - 0.5) * 2.0;
          const blastMag = Math.random() * 6.5 + 4.5;

          velocities[i3] = ((edx / dist) * 0.5 + rx * 0.5) * blastMag;
          velocities[i3 + 1] = ((edy / dist) * 0.5 + ry * 0.5) * blastMag;
          velocities[i3 + 2] = ((edz / dist) * 0.5 + rz * 0.5) * blastMag;
        }

        setTimeout(() => {
          setInteractionHint("MOVE TO SCATTER · HOLD FOR BLACK HOLE · CLICK TO HYPERSPACE");
        }, 2200);
      } else if (pressDuration < 220 && dx < 15 && dy < 15) {
        // Quick single click/tap on CPU particle structure: Star Wars Galactic Warp!
        triggerWarpTransition();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // 9. HIGH-PERFORMANCE PHYSICS SIMULATION LOOP (60 - 120 FPS)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.getElapsedTime();

      // Update shader uniforms
      smokeMat.uniforms.uTime.value = elapsed;
      particleMat.uniforms.uTime.value = elapsed;
      particleMat.uniforms.uWarpProgress.value = warpProgressRef.current;
      accretionMat.uniforms.uTime.value = elapsed;

      // A. DYNAMIC 3D PERSPECTIVE TILT TOWARDS CURSOR
      if (cpuGroupRef.current) {
        const targetTiltX = -mouseNormRef.current.y * 0.32;
        const targetTiltY = mouseNormRef.current.x * 0.40;
        cpuGroupRef.current.rotation.x += (targetTiltX - cpuGroupRef.current.rotation.x) * 0.07;
        cpuGroupRef.current.rotation.y += (targetTiltY - cpuGroupRef.current.rotation.y) * 0.07;
        // Subtle ambient roll
        cpuGroupRef.current.rotation.z = Math.sin(elapsed * 0.25) * 0.015;
      }

      // B. BLACK HOLE VISUAL ANIMATION
      const isHolding = isHoldingRef.current;
      const bh = blackHolePosRef.current;
      if (isHolding) {
        blackHoleGroup.visible = true;
        blackHoleGroup.position.copy(bh);
        // Ominous pulsing event horizon
        const targetScale = 1.0 + Math.sin(elapsed * 12.0) * 0.06;
        blackHoleGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
        accretionMesh.rotation.z += delta * 5.0;
      } else {
        blackHoleGroup.scale.lerp(new THREE.Vector3(0, 0, 0), 0.22);
        if (blackHoleGroup.scale.x < 0.01) {
          blackHoleGroup.visible = false;
        }
      }

      // C. PHYSICS INTEGRATION
      const mw = mouseLocalPosRef.current;
      const posArr = currentPositions;
      const targetArr = targetPositions;
      const velArr = velocities;
      const isExploding = isExplodingRef.current;
      const isWarping = isTransitioningRef.current;
      const timeSinceBlast = isExploding ? (performance.now() - explosionStartTimeRef.current) / 1000.0 : 999.0;

      // Reduced, pinpoint cursor repulsion radius
      const scatterRadius = isMobile ? 0.16 : 0.14;
      const scatterRadiusSq = scatterRadius * scatterRadius;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        let px = posArr[i3];
        let py = posArr[i3 + 1];
        let pz = posArr[i3 + 2];
        let vx = velArr[i3];
        let vy = velArr[i3 + 1];
        let vz = velArr[i3 + 2];

        if (isWarping) {
          // STAR WARS HYPERSPACE WARP: Particles race forward into camera with lightspeed acceleration!
          const warpFactor = warpProgressRef.current;
          vz += (14.0 + Math.random() * 14.0) * warpFactor * delta;
          vx += px * 1.6 * warpFactor * delta;
          vy += py * 1.6 * warpFactor * delta;
        } else if (isHolding) {
          // TRUE BLACK HOLE SINGULARITY: Pure inward suction straight to cursor (NO swirl!)
          const dx = bh.x - px;
          const dy = bh.y - py;
          const dz = bh.z - pz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.02;

          // Pure radial inward pull
          const pull = 8.5 / (dist + 0.05);
          vx += (dx / dist) * pull * delta;
          vy += (dy / dist) * pull * delta;
          vz += (dz / dist) * pull * delta;

          // Extreme damping at the center to compress into super-dense core
          if (dist < 0.05) {
            vx *= 0.82;
            vy *= 0.82;
            vz *= 0.82;
          } else {
            vx *= 0.94;
            vy *= 0.94;
            vz *= 0.94;
          }
        } else if (isExploding && timeSinceBlast < 0.38) {
          // PHASE 1 EXPLOSION: Pure ballistic 3D scatter across screen
          vx *= 0.97;
          vy *= 0.97;
          vz *= 0.97;
        } else {
          // NORMAL IDLE & RE-STRUCTURING MODE
          const tx = targetArr[i3];
          const ty = targetArr[i3 + 1];
          const tz = targetArr[i3 + 2];

          // Progressive magnetic snap-back if recovering from explosion
          let springK = 7.5;
          if (isExploding) {
            if (timeSinceBlast >= 2.0) {
              isExplodingRef.current = false;
            } else {
              const progress = (timeSinceBlast - 0.38) / 1.62;
              springK = progress * progress * 8.5;
            }
          }

          vx += (tx - px) * springK * delta;
          vy += (ty - py) * (springK * 1.1) * delta;
          vz += (tz - pz) * springK * delta;

          // CONTINUOUS AMBIENT KINETIC CURRENTS (Particles constantly move along traces & die)
          const phase = particlePhases[i];
          const pType = particleTypes[i];
          if (pType === 1) {
            // N/S traces: micro-current pulses along Y
            vy += Math.sin(elapsed * 4.0 + phase) * 0.06 * delta;
          } else if (pType === 2) {
            // E/W traces: micro-current pulses along X
            vx += Math.sin(elapsed * 4.0 + phase) * 0.06 * delta;
          } else if (pType === 0) {
            // Die core: micro clock-cycle vibration
            vx += Math.cos(elapsed * 8.0 + phase) * 0.02 * delta;
            vy += Math.sin(elapsed * 8.0 + phase) * 0.02 * delta;
          }

          // TIGHT CURSOR REPULSION & LAMINAR FLOW AROUND STATIONARY CURSOR
          const mdx = px - mw.x;
          const mdy = py - mw.y;
          const distSq = mdx * mdx + mdy * mdy;

          if (distSq < scatterRadiusSq) {
            const mDist = Math.sqrt(distSq) + 0.001;
            // Precise, sharp quadratic repulsion
            const factor = 1.0 - mDist / scatterRadius;
            const repForce = factor * factor * 16.0;
            vx += (mdx / mDist) * repForce * delta;
            vy += (mdy / mDist) * repForce * delta;

            // Stream / glide continuously around stationary cursor
            const tangX = -mdy / mDist;
            const tangY = mdx / mDist;
            const flowSpeed = 0.85 * factor;
            vx += tangX * flowSpeed * delta;
            vy += tangY * flowSpeed * delta;
          }

          // Kinetic friction damping
          vx *= 0.91;
          vy *= 0.91;
          vz *= 0.91;
        }

        // Apply velocities
        posArr[i3] = px + vx * (delta * 60);
        posArr[i3 + 1] = py + vy * (delta * 60);
        posArr[i3 + 2] = pz + vz * (delta * 60);
        velArr[i3] = vx;
        velArr[i3 + 1] = vy;
        velArr[i3 + 2] = vz;
      }

      particleGeo.attributes.position.needsUpdate = true;
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
      cameraRef.current.fov = mobile ? 52 : 44;
      cameraRef.current.position.z = mobile ? 3.6 : 3.0;
      cameraRef.current.updateProjectionMatrix();

      smokeMat.uniforms.uResolution.value.set(w, h);
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [triggerWarpTransition, startBlackHoleSound, stopBlackHoleSoundAndBlast]);

  return (
    <div className="relative w-full h-[100svh] bg-[#06070B] text-[#F8F5EE] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10 cursor-crosshair" />

      {/* Star Wars Hyperspace Flash Overlay */}
      <div
        ref={warpFlashRef}
        className="absolute inset-0 bg-[#FFFBF0] pointer-events-none opacity-0 z-50 transition-opacity"
      />

      {/* Top Header Bar: Telemetry Status Indicator */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · CPU CORE</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">4-WAY BUS ARCHITECTURE</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Kinetic Tilt & Graviton Physics</span>
        </div>
      </header>

      {/* Center Interactive Action Pill Banner */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-mono text-white/70 tracking-wider">
          {interactionHint}
        </div>
      </div>

      {/* Floating Tactical Badges: Left & Right */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex items-center justify-between">
        {/* Left Badges */}
        <div className="space-y-4 pointer-events-auto">
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("projects");
            }}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-purple-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-purple-300">Selected Commissions</p>
              <p className="text-[10px] font-mono text-white/50">Microsecond Engine & Cricket Ops</p>
            </div>
          </button>

          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("hobbies");
            }}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-blue-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-blue-300">Terrace Ambience</p>
              <p className="text-[10px] font-mono text-white/50">Web Audio Mountain Breeze</p>
            </div>
          </button>
        </div>

        {/* Right Badges */}
        <div className="space-y-4 pointer-events-auto">
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("specs");
            }}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-red-500/40 text-right transition-all group"
          >
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-red-300">System Architecture</p>
              <p className="text-[10px] font-mono text-white/50">C++ · Rust · Concurrency</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("terminal");
            }}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 text-right transition-all group"
          >
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-emerald-300">Hacker CLI Terminal</p>
              <p className="text-[10px] font-mono text-white/50">Interactive Bash Shell</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <TerminalIcon className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Floating Bottom Navigation Dock */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/75 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none">
          {/* Projects Button */}
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("projects");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Projects</span>
          </button>

          {/* Specs Button */}
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("specs");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <span>Specs</span>
          </button>

          {/* Sound & Hobbies */}
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("hobbies");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <Headphones className="w-3.5 h-3.5 text-blue-400" />
            <span>Hobbies</span>
          </button>

          {/* Terminal */}
          <button
            onClick={() => {
              playTactileClick(1100);
              setActiveModal("terminal");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-xs font-medium transition-all shrink-0"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal</span>
          </button>

          {/* Ambient Breeze Soundscape Toggle */}
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

          {/* Direct Hyperspace Warp Enter Website CTA */}
          <button
            onClick={triggerWarpTransition}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F5E6D3] hover:bg-[#FFF8F0] text-black font-semibold text-xs transition-all shadow-lg shadow-[#F5E6D3]/20 shrink-0"
          >
            <span>Hyperspace Jump</span>
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
                  if (onNavigateToSection) onNavigateToSection("work-matrix");
                }}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <span>Inspect in Portfolio</span>
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
            className="relative w-full max-w-xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">SYSTEM ARCHITECTURE & HARDWARE</h3>
                  <p className="text-xs font-mono text-white/60">Engineering Stack · Real-Time Microsecond Kernel</p>
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

            <div className="space-y-3 font-mono text-xs text-white/80 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <p className="text-red-400 font-semibold">// LOW-LEVEL SYSTEMS & ENGINE RUNTIME</p>
                <p className="text-white/60">C++20 · Rust 1.80 · Memory Pooling · Lock-Free Ring Buffers · Zero-Alloc Pipelines</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <p className="text-purple-400 font-semibold">// DISTRIBUTED AI & AGENTIC INFRASTRUCTURE</p>
                <p className="text-white/60">DeepSeek-R1 Local Harness · PyTorch · CUDA Accelerators · Distributed Worker Swarms</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <p className="text-blue-400 font-semibold">// FRONTEND ARCHITECTURE</p>
                <p className="text-white/60">Next.js 16 (Turbopack) · Three.js WebGL Shader Quad · Tailwind CSS · Lenis 1.1</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <p className="text-emerald-400 font-semibold">// TELEMETRY & HARDWARE THERMALS</p>
                <p className="text-white/60">GPU Particle Shader (60k Point-Cloud) · Sub-millisecond Physics Tick (0.6ms) · Nominal 28°C</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-white/70 hover:text-white"
              >
                Dismiss
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
            className="relative w-full max-w-xl bg-[#0D0F16] border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">TERRACE AMBIENCE & LIFE OUTSIDE</h3>
                  <p className="text-xs font-mono text-white/60">Acoustics · Cricket Athletics · Mechanical Modding</p>
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

            <div className="space-y-3.5 text-xs text-white/80 overflow-y-auto pr-1">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="font-semibold text-white mb-1">Cricket Athletics & International Ops</h4>
                <p className="text-white/60 leading-relaxed">
                  Active competitive cricketer with deep involvement in the Latvian Cricket Federation ecosystem, merging high-performance sports analytics with international tournament operations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="font-semibold text-white mb-1">Mechanical Keyboards & Tactile Craftsmanship</h4>
                <p className="text-white/60 leading-relaxed">
                  Building custom aluminum keyboards with hand-lubed switches (Krytox 205g0), custom FR4 plates, and meticulously tuned acoustic damping foams.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="font-semibold text-white mb-1">Web Audio Generative Terrace Breeze</h4>
                <p className="text-white/60 leading-relaxed mb-3">
                  A pure mathematical pink-noise biquad audio filter that models the relaxing organic mountain wind whistling through terrace leaves at dusk.
                </p>
                <button
                  onClick={toggleAmbientSound}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isAudioPlaying
                      ? "bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40"
                      : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                  }`}
                >
                  {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioPlaying ? "Mute Terrace Ambience" : "Listen to Terrace Ambience"}</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono">Press ESC to close</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-white/70 hover:text-white"
              >
                Dismiss
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
            className="relative w-full max-w-2xl bg-[#080A10] border border-emerald-500/30 rounded-2xl shadow-2xl p-5 overflow-hidden max-h-[85vh] flex flex-col font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-emerald-400 font-semibold ml-2">soham@particle-kernel: ~ (bash)</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close terminal"
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1 scrollbar-thin">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <span className="text-emerald-400">➜</span>
                    <span className="text-purple-400">~</span>
                    <span className="text-white/90">{item.cmd}</span>
                  </div>
                  <div className="text-emerald-300/90 whitespace-pre-wrap pl-3.5 border-l border-emerald-500/20">
                    {item.out}
                  </div>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            <form onSubmit={handleTerminalSubmit} className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-emerald-400 text-xs">➜</span>
              <span className="text-purple-400 text-xs">~</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type 'help', 'whoami', 'projects', 'specs', 'sound on', 'enter'..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none font-mono"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
