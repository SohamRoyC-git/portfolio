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

  // Interaction HUD & Status
  const [interactionHint, setInteractionHint] = useState<string>("MOVE TO SCATTER · HOLD FOR BLACK HOLE · CLICK TO WARP");

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: "system.init", out: "Kinetic CPU Particle Core · Studio Smoke Atmosphere Active" },
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
  const particlesRef = useRef<THREE.Points | null>(null);

  // Simulation physics state
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const blackHolePosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseWorldPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningRef = useRef(false);

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
      blastOsc.frequency.setValueAtTime(160, ctx.currentTime);
      blastOsc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.22);

      blastGain.gain.setValueAtTime(0.18, ctx.currentTime);
      blastGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

      blastOsc.connect(blastGain);
      blastGain.connect(ctx.destination);
      blastOsc.start();
      blastOsc.stop(ctx.currentTime + 0.25);
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

  // Warp Flight into Portfolio Website
  const triggerWarpTransition = useCallback(() => {
    if (isTransitioningRef.current || !cameraRef.current) return;
    isTransitioningRef.current = true;
    playTactileClick(1400);

    const camera = cameraRef.current;

    // Camera surges forward through the particle field
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: -0.8,
      duration: 1.35,
      ease: "power3.inOut",
      onComplete: () => {
        onEnterPortfolio();
        isTransitioningRef.current = false;
      },
    });
  }, [onEnterPortfolio, playTactileClick]);

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

  // Main Three.js Particle Physics Engine (CPU Structure + Studio Smoke Shader)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(isMobile ? 54 : 45, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 3.4 : 2.8);
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

    // 4. PROCEDURAL HIGH-TECH CPU POINT-CLOUD GENERATION
    // Particle count: 60,000 for locked 60-120fps performance
    const PARTICLE_COUNT = isMobile ? 35000 : 60000;
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);

    // Light Sand / Champagne / Warm Beige Color Palette Variations
    const SAND_SHADES = [
      [0.98, 0.95, 0.90], // Light Champagne (#FFF8F0)
      [0.94, 0.88, 0.78], // Cream Sand (#F5E6D3)
      [0.89, 0.80, 0.68], // Warm Desert Ecru (#E8D2B8)
      [0.82, 0.71, 0.56], // Golden Sand (#D9BD99)
      [0.72, 0.60, 0.45], // Deep Sand Shadow (#B89975)
    ];

    let pIdx = 0;
    function addCpuPoint(x: number, y: number, z: number, shade: number[]) {
      if (pIdx >= PARTICLE_COUNT) return;
      const i3 = pIdx * 3;
      // Start in subtle initial scattered formation, will spring into CPU
      currentPositions[i3] = x + (Math.random() - 0.5) * 0.6;
      currentPositions[i3 + 1] = y + (Math.random() - 0.5) * 0.6;
      currentPositions[i3 + 2] = z + (Math.random() - 0.5) * 0.6;

      targetPositions[i3] = x;
      targetPositions[i3 + 1] = y;
      targetPositions[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Color variation
      particleColors[i3] = shade[0] + (Math.random() - 0.5) * 0.04;
      particleColors[i3 + 1] = shade[1] + (Math.random() - 0.5) * 0.04;
      particleColors[i3 + 2] = shade[2] + (Math.random() - 0.5) * 0.04;

      particleSizes[pIdx] = Math.random() * 2.2 + 1.2;
      pIdx++;
    }

    // A. Central Compute Die (Multi-core matrix) - 40% of particles
    const dieSize = 0.95;
    const dieCount = Math.floor(PARTICLE_COUNT * 0.40);
    for (let i = 0; i < dieCount; i++) {
      const coreX = Math.floor(Math.random() * 4);
      const coreY = Math.floor(Math.random() * 4);
      const coreOriginX = -dieSize * 0.5 + coreX * (dieSize / 4) + 0.02;
      const coreOriginY = -dieSize * 0.5 + coreY * (dieSize / 4) + 0.02;
      const x = coreOriginX + Math.random() * (dieSize / 4 - 0.04);
      const y = coreOriginY + Math.random() * (dieSize / 4 - 0.04);
      const z = (Math.random() - 0.5) * 0.035;
      const shade = SAND_SHADES[Math.floor(Math.random() * 3)];
      addCpuPoint(x, y, z, shade);
    }

    // B. Radiating Bus Lines & Interconnect Traces - 25% of particles
    const traceCount = Math.floor(PARTICLE_COUNT * 0.25);
    for (let i = 0; i < traceCount; i++) {
      const angle = (Math.floor(Math.random() * 32) / 32) * Math.PI * 2;
      const r = 0.52 + Math.random() * 0.48;
      const x = Math.cos(angle) * r + (Math.random() - 0.5) * 0.015;
      const y = Math.sin(angle) * r + (Math.random() - 0.5) * 0.015;
      const z = (Math.random() - 0.5) * 0.03;
      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      addCpuPoint(x, y, z, shade);
    }

    // C. Substrate & Outer Heat Spreader Frame - 22% of particles
    const frameCount = Math.floor(PARTICLE_COUNT * 0.22);
    const frameSize = 1.75;
    for (let i = 0; i < frameCount; i++) {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      const t = (Math.random() - 0.5) * frameSize;
      const offset = frameSize * 0.5 * (Math.random() > 0.5 ? 1 : -1);
      if (side === 0 || side === 1) {
        x = t;
        y = offset + (Math.random() - 0.5) * 0.05;
      } else {
        x = offset + (Math.random() - 0.5) * 0.05;
        y = t;
      }
      const z = (Math.random() - 0.5) * 0.05;
      const shade = Math.random() > 0.5 ? SAND_SHADES[0] : SAND_SHADES[4];
      addCpuPoint(x, y, z, shade);
    }

    // D. Outer Pin Grid Array (PGA / BGA Contacts) - 10% of particles
    const pinCount = Math.floor(PARTICLE_COUNT * 0.10);
    for (let i = 0; i < pinCount; i++) {
      const px = (Math.floor(Math.random() * 26) - 13) * 0.065;
      const py = (Math.floor(Math.random() * 26) - 13) * 0.065;
      if (Math.abs(px) < 0.55 && Math.abs(py) < 0.55) continue;
      addCpuPoint(px, py, -0.04 + (Math.random() - 0.5) * 0.02, SAND_SHADES[3]);
    }

    // E. Ambient Floating Dust Halo - Remaining particles
    while (pIdx < PARTICLE_COUNT) {
      const r = Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.cos(phi);
      const z = r * Math.sin(phi) * 0.3;
      addCpuPoint(x, y, z, SAND_SHADES[4]);
    }

    // 5. POINT CLOUD GEOMETRY & CUSTOM CIRCULAR SHADER MATERIAL
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(size * (7.0 / -mvPosition.z), 1.5, 8.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Circular particle with crisp edge falloff
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.15, d) * 0.92;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. INTERACTION RAYCASTING PLANE
    const rayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    // Map screen mouse coordinates to 3D world plane
    const updateMouseWorldPos = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(rayPlane, intersectionPoint);

      if (intersectionPoint) {
        mouseWorldPosRef.current.copy(intersectionPoint);
      }
    };

    // POINTER MOVE: Scatter particles around cursor
    const onPointerMove = (e: PointerEvent) => {
      updateMouseWorldPos(e.clientX, e.clientY);
      if (isHoldingRef.current) {
        blackHolePosRef.current.copy(mouseWorldPosRef.current);
      }
    };

    // POINTER DOWN: Record position & schedule Black Hole hold
    const holdTimerRef = { id: 0 as any };
    const onPointerDown = (e: PointerEvent) => {
      updateMouseWorldPos(e.clientX, e.clientY);
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      holdStartRef.current = performance.now();

      // If user holds for more than 160ms, ignite the Black Hole Singularity!
      holdTimerRef.id = setTimeout(() => {
        isHoldingRef.current = true;
        blackHolePosRef.current.copy(mouseWorldPosRef.current);
        startBlackHoleSound();
        setInteractionHint("BLACK HOLE ACTIVE · SUCKING PARTICLES IN · RELEASE TO EXPLODE");
      }, 160);
    };

    // POINTER UP: If holding -> Detonate Supernova! If quick click -> Warp into Portfolio!
    const onPointerUp = (e: PointerEvent) => {
      clearTimeout(holdTimerRef.id);
      const pressDuration = performance.now() - holdStartRef.current;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (isHoldingRef.current) {
        // Was holding: Detonate Supernova Shockwave!
        isHoldingRef.current = false;
        stopBlackHoleSoundAndBlast();
        setInteractionHint("SUPERNOVA SHOCKWAVE RELEASED · REFORMING CPU");

        // Apply outward explosive velocity impulse to all particles
        const bh = blackHolePosRef.current;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const px = currentPositions[i3];
          const py = currentPositions[i3 + 1];
          const pz = currentPositions[i3 + 2];

          const edx = px - bh.x;
          const edy = py - bh.y;
          const edz = pz - bh.z;
          const dist = Math.sqrt(edx * edx + edy * edy + edz * edz) + 0.05;

          const blastForce = (Math.random() * 4.5 + 2.5) / dist;
          velocities[i3] += (edx / dist) * blastForce;
          velocities[i3 + 1] += (edy / dist) * blastForce;
          velocities[i3 + 2] += (edz / dist) * blastForce;
        }

        setTimeout(() => {
          setInteractionHint("MOVE TO SCATTER · HOLD FOR BLACK HOLE · CLICK TO WARP");
        }, 2000);
      } else if (pressDuration < 220 && dx < 15 && dy < 15) {
        // Quick single click/tap on particle structure: Trigger Genesis Warp!
        triggerWarpTransition();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // 7. HIGH-PERFORMANCE PHYSICS SIMULATION LOOP (60 - 120 FPS)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.getElapsedTime();

      // Update studio smoke background shader
      smokeMat.uniforms.uTime.value = elapsed;

      // Physics constants
      const isHolding = isHoldingRef.current;
      const bh = blackHolePosRef.current;
      const mw = mouseWorldPosRef.current;
      const posArr = currentPositions;
      const targetArr = targetPositions;
      const velArr = velocities;

      const scatterRadius = 0.38;
      const scatterRadiusSq = scatterRadius * scatterRadius;

      // Single fast loop over all particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        let px = posArr[i3];
        let py = posArr[i3 + 1];
        let pz = posArr[i3 + 2];
        let vx = velArr[i3];
        let vy = velArr[i3 + 1];
        let vz = velArr[i3 + 2];

        if (isHolding) {
          // BLACK HOLE MODE: Sucks all particles into swirling singularity
          const dx = bh.x - px;
          const dy = bh.y - py;
          const dz = bh.z - pz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.04;

          // Inward gravitational pull + tangential vortex spin
          const pull = 4.2 / dist;
          const spin = 2.0 / dist;

          vx += (dx / dist * pull - dy / dist * spin) * delta;
          vy += (dy / dist * pull + dx / dist * spin) * delta;
          vz += (dz / dist * pull) * delta;

          // Damping to prevent infinite orbital acceleration
          vx *= 0.94;
          vy *= 0.94;
          vz *= 0.94;
        } else {
          // IDLE / RETURN MODE: Elastic spring back to CPU formation
          const tx = targetArr[i3];
          const ty = targetArr[i3 + 1];
          const tz = targetArr[i3 + 2];

          // Harmonic spring return
          vx += (tx - px) * 6.5 * delta;
          vy += (ty - py) * 8.0 * delta;
          vz += (tz - pz) * 6.5 * delta;

          // Cursor Scatter / Repulsion
          const mdx = px - mw.x;
          const mdy = py - mw.y;
          const distSq = mdx * mdx + mdy * mdy;

          if (distSq < scatterRadiusSq) {
            const mDist = Math.sqrt(distSq) + 0.001;
            const repForce = (scatterRadius - mDist) * 9.5;
            vx += (mdx / mDist) * repForce * delta;
            vy += (mdy / mDist) * repForce * delta;
          }

          // Kinetic friction damping
          vx *= 0.92;
          vy *= 0.92;
          vz *= 0.92;
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

      // Subtle atmospheric rotation
      if (particlesRef.current && !isHolding) {
        particlesRef.current.rotation.z = Math.sin(elapsed * 0.2) * 0.02;
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
      cameraRef.current.fov = mobile ? 54 : 45;
      cameraRef.current.position.z = mobile ? 3.4 : 2.8;
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

      {/* Top Header Bar: Telemetry Status Indicator */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · CPU PARTICLE CORE</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">STUDIO SMOKE ATMOSPHERE</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>GPU Kinetic Physics Active</span>
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

          {/* Direct Warp Enter Website CTA */}
          <button
            onClick={triggerWarpTransition}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#F5E6D3] hover:bg-[#FFF8F0] text-black font-semibold text-xs transition-all shadow-lg shadow-[#F5E6D3]/20 shrink-0"
          >
            <span>Warp to Portfolio</span>
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
                  <h3 className="text-lg font-bold text-white">SYSTEM ARCHITECTURE // HARDWARE & STACK</h3>
                  <p className="text-xs font-mono text-white/60">Bare-Metal Systems Engine & AI Pipelines</p>
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
                <h4 className="text-xs font-mono text-[#FF7A00] tracking-wider uppercase mb-2">Systems Engineering Principles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Zero-Allocation Concurrency</p>
                    <p className="text-white/60 text-[11px]">Lock-free ring buffers, cache-line alignment, and SIMD vectorization.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Real-Time Telemetry Streaming</p>
                    <p className="text-white/60 text-[11px]">Sub-millisecond WebSocket fan-out and binary protocol serialization.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Autonomous Agent Orchestration</p>
                    <p className="text-white/60 text-[11px]">Recursive local model inference and verifiable sandbox execution.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <p className="font-semibold text-white">Kinetic GPU Physics Simulation</p>
                    <p className="text-white/60 text-[11px]">Sub-millisecond vector math, harmonic damping, and 120 FPS render loops.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-blue-400 tracking-wider uppercase mb-2">Production Software Stack</h4>
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
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">TERRACE RITUALS & HOBBIES</h3>
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
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5E6D3] hover:bg-[#FFF8F0] text-black text-xs font-semibold transition-all"
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
                <span className="text-xs text-white/60 ml-2">soham@particle-kernel: ~ (bash)</span>
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
