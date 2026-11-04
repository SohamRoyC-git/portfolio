"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";

export interface Studio3DWorkspaceProps {
  onEnterPortfolio: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  isLocked?: boolean;
  isActive?: boolean;
}

export const Studio3DWorkspace = memo(function Studio3DWorkspace({
  onEnterPortfolio,
  onNavigateToSection,
  isLocked = true,
  isActive = true,
}: Studio3DWorkspaceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const warpFlashRef = useRef<HTMLDivElement>(null);

  // Interaction HUD & Status
  const [interactionHint, setInteractionHint] = useState<string>(
    "MOVE ACROSS CORE · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE"
  );

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const cpuGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const blackHoleGroupRef = useRef<THREE.Group | null>(null);

  // Particle data references for dynamic reset
  const currentPositionsRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const particleScalesRef = useRef<Float32Array | null>(null); // For shrinking into singularity

  // Simulation physics state
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const blackHolePosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseLocalPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const prevMouseLocalPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
  const mouseNormRef = useRef({ x: 0, y: 0 });

  // Black hole phases: absorption (0-2.5s), singularity void (>2.5s), reverse unspooling
  const isAbsorbedRef = useRef(false);
  const isUnspoolingRef = useRef(false);
  const unspoolStartTimeRef = useRef(0);

  // Hyperspace transition state
  const isTransitioningRef = useRef(false);
  const warpProgressRef = useRef(0);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const blackHoleOscRef = useRef<OscillatorNode | null>(null);
  const blackHoleGainRef = useRef<GainNode | null>(null);

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
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 2.5);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(130, ctx.currentTime);
      filter.Q.setValueAtTime(3.2, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      blackHoleOscRef.current = osc;
      blackHoleGainRef.current = gain;
    } catch {}
  }, [getAudioContext]);

  // Audio: Stop Black Hole Drone
  const stopBlackHoleSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (blackHoleGainRef.current) {
        blackHoleGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      }
      setTimeout(() => {
        try {
          if (blackHoleOscRef.current) {
            blackHoleOscRef.current.stop();
            blackHoleOscRef.current.disconnect();
            blackHoleOscRef.current = null;
          }
        } catch {}
      }, 180);
    } catch {}
  }, [getAudioContext]);

  // Audio: Star Wars Hyperspace Hyperdrive Spool (matching reference video)
  const playHyperspaceSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 1.2);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.26, ctx.currentTime + 0.7);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch {}
  }, [getAudioContext]);

  // Audio: Tactical Click
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

  // Reset workspace state whenever navigating back to 3D Studio
  useEffect(() => {
    if (isActive) {
      if (cameraRef.current) {
        const isMobile = window.innerWidth / window.innerHeight < 1.0;
        cameraRef.current.position.set(0, 0, isMobile ? 3.6 : 3.0);
        cameraRef.current.lookAt(0, 0, 0);
      }
      if (warpFlashRef.current) {
        warpFlashRef.current.style.opacity = "0";
      }
      warpProgressRef.current = 0;
      isTransitioningRef.current = false;
      isHoldingRef.current = false;
      isAbsorbedRef.current = false;
      isUnspoolingRef.current = false;

      // Reset particles to target coordinates with zero velocity and full scale
      if (
        particlesRef.current &&
        currentPositionsRef.current &&
        targetPositionsRef.current &&
        velocitiesRef.current &&
        particleScalesRef.current
      ) {
        const cur = currentPositionsRef.current;
        const tgt = targetPositionsRef.current;
        const vel = velocitiesRef.current;
        const scl = particleScalesRef.current;
        for (let i = 0; i < cur.length; i++) {
          cur[i] = tgt[i];
          vel[i] = 0;
        }
        for (let i = 0; i < scl.length; i++) {
          scl[i] = 1.0;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (blackHoleGroupRef.current) {
        blackHoleGroupRef.current.scale.set(0, 0, 0);
        blackHoleGroupRef.current.visible = false;
      }
      setInteractionHint("MOVE ACROSS CORE · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE");
    }
  }, [isActive]);

  // Star Wars Galactic Warp Hyperspace Jump (Fast Moving Stars)
  const triggerWarpTransition = useCallback(() => {
    if (isTransitioningRef.current || !cameraRef.current) return;
    isTransitioningRef.current = true;
    playHyperspaceSound();
    setInteractionHint("HYPERSPACE JUMP ENGAGED · WARPING TO PORTFOLIO");

    const camera = cameraRef.current;

    // Animate warp progress uniform (streaks stars into lightspeed radial needles)
    gsap.to(warpProgressRef, {
      current: 1.0,
      duration: 1.25,
      ease: "power2.in",
    });

    // Camera surges forward through the particle field
    gsap.to(camera.position, {
      z: -1.5,
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

  // Main Three.js Particle Physics Engine (CPU Structure + Studio Smoke)
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
          float t = uTime * 0.04;

          vec2 smokeCoord = p * 1.35 + vec2(sin(t * 0.4) * 0.22, t * 0.18);
          float s1 = fbm(smokeCoord);
          float s2 = fbm(smokeCoord + vec2(s1 * 0.7, s1 * 0.4));

          vec3 darkBg = vec3(0.022, 0.024, 0.030);
          vec3 smokeColor = vec3(0.068, 0.064, 0.058);

          float vignette = 1.0 - smoothstep(0.3, 1.35, length(p));
          vec3 col = mix(darkBg, smokeColor, s2 * 0.65) * vignette;

          float grain = (hash(vUv * 500.0 + fract(uTime)) - 0.5) * 0.020;
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

    // 5. BLACK HOLE VISUAL ENTITY (Event Horizon Void + Pulsating Celestial Light)
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.visible = false;
    blackHoleGroup.scale.set(0, 0, 0);
    cpuGroup.add(blackHoleGroup);
    blackHoleGroupRef.current = blackHoleGroup;

    // 5A. Dark Event Horizon Void
    const eventHorizonGeo = new THREE.CircleGeometry(0.085, 48);
    const eventHorizonMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      depthTest: true,
    });
    const eventHorizonMesh = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
    eventHorizonMesh.renderOrder = 20;
    blackHoleGroup.add(eventHorizonMesh);

    // 5B. Pulsating Celestial Photon Light (Pulsating light representing the black hole)
    const pulsatingLightGeo = new THREE.PlaneGeometry(0.48, 0.48);
    const pulsatingLightMat = new THREE.ShaderMaterial({
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
          float r = length(p) * 2.0;
          if (r > 1.0) discard;

          // Smooth breathing pulsation frequency
          float pulse = 0.5 + 0.5 * sin(uTime * 4.2);

          // Concentrated photon ring at event horizon rim
          float ring = smoothstep(0.35, 0.44, r) * (1.0 - smoothstep(0.52, 0.95, r));
          // Soft radial celestial aura
          float halo = exp(-r * 3.8) * (0.4 + 0.6 * pulse);

          vec3 hotChampagne = vec3(1.0, 0.98, 0.92);
          vec3 warmAmber = vec3(0.94, 0.76, 0.44);
          vec3 col = mix(hotChampagne, warmAmber, r);

          float alpha = (ring * 0.95 + halo * 0.45) * (0.8 + 0.2 * pulse);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const pulsatingLightMesh = new THREE.Mesh(pulsatingLightGeo, pulsatingLightMat);
    pulsatingLightMesh.renderOrder = 21;
    blackHoleGroup.add(pulsatingLightMesh);

    // 6. PROCEDURAL COMPACT CPU POINT-CLOUD WITH 4-WAY EXTENDED BUS LINES
    const PARTICLE_COUNT = isMobile ? 35000 : 60000;
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particlePhases = new Float32Array(PARTICLE_COUNT);
    const particleScales = new Float32Array(PARTICLE_COUNT); // 1.0 -> 0.0 when absorbed

    currentPositionsRef.current = currentPositions;
    targetPositionsRef.current = targetPositions;
    velocitiesRef.current = velocities;
    particleScalesRef.current = particleScales;

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
      sizeMultiplier = 1.0
    ) {
      if (pIdx >= PARTICLE_COUNT) return;
      const i3 = pIdx * 3;

      currentPositions[i3] = x + (Math.random() - 0.5) * 0.15;
      currentPositions[i3 + 1] = y + (Math.random() - 0.5) * 0.15;
      currentPositions[i3 + 2] = z + (Math.random() - 0.5) * 0.15;

      targetPositions[i3] = x;
      targetPositions[i3 + 1] = y;
      targetPositions[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      particleColors[i3] = shade[0] + (Math.random() - 0.5) * 0.03;
      particleColors[i3 + 1] = shade[1] + (Math.random() - 0.5) * 0.03;
      particleColors[i3 + 2] = shade[2] + (Math.random() - 0.5) * 0.03;

      particleSizes[pIdx] = (Math.random() * 1.8 + 1.2) * sizeMultiplier;
      particlePhases[pIdx] = Math.random() * Math.PI * 2;
      particleScales[pIdx] = 1.0;

      pIdx++;
    }

    // A. CENTRAL COMPUTE DIE (Compact focal core giving generous breathing room)
    const dieHalf = 0.26;
    const coreCount = Math.floor(PARTICLE_COUNT * 0.28);
    for (let i = 0; i < coreCount; i++) {
      const quadX = Math.random() > 0.5 ? 1 : -1;
      const quadY = Math.random() > 0.5 ? 1 : -1;
      const coreCenterX = quadX * 0.13;
      const coreCenterY = quadY * 0.13;

      const lineIndex = Math.floor(Math.random() * 12);
      const rowY = coreCenterY - 0.09 + lineIndex * 0.016;
      const rowX = coreCenterX + (Math.random() - 0.5) * 0.18;
      const z = 0.03 + (Math.random() - 0.5) * 0.015;

      const shade = SAND_SHADES[Math.floor(Math.random() * 3)];
      addCpuPoint(rowX, rowY, z, shade, 1.0);
    }

    // Gold Pin 1 Corner Alignment Notch (Top-Left of Die)
    for (let i = 0; i < 180; i++) {
      const u = Math.random();
      const v = Math.random() * (1 - u);
      const x = -dieHalf + u * 0.06;
      const y = dieHalf - v * 0.06;
      addCpuPoint(x, y, 0.045, SAND_SHADES[0], 1.2);
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
      addCpuPoint(x + (Math.random() - 0.5) * 0.01, y + (Math.random() - 0.5) * 0.01, 0.02, SAND_SHADES[1], 1.1);
    }

    // B. 4-WAY EXTENDED BUS INTERCONNECT TRACES (North, South, East, West)
    const traceParticles = Math.floor(PARTICLE_COUNT * 0.44);
    const particlesPerDir = Math.floor(traceParticles / 4);

    // North Traces (Y > +0.32 up to +1.32)
    for (let i = 0; i < particlesPerDir; i++) {
      const lane = Math.floor(Math.random() * 18) - 9;
      const t = Math.random();
      let lx = lane * 0.026;
      let ly = 0.32 + t * 1.00;

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
      addCpuPoint(lx, ly, z, shade, 0.95);
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
      addCpuPoint(lx, ly, z, shade, 0.95);
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
      addCpuPoint(lx, ly, z, shade, 0.95);
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
      addCpuPoint(lx, ly, z, shade, 0.95);
    }

    // C. TERMINAL VIA PADS / SOLDER BALL TEST POINTS
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
      addCpuPoint(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r, 0.015, SAND_SHADES[0], 1.25);
    }

    // D. SUBSTRATE PIN GRID ARRAY (PGA / BGA Contacts underneath)
    const pinCount = Math.floor(PARTICLE_COUNT * 0.06);
    for (let i = 0; i < pinCount; i++) {
      const px = (Math.floor(Math.random() * 16) - 8) * 0.045;
      const py = (Math.floor(Math.random() * 16) - 8) * 0.045;
      if (Math.abs(px) < 0.18 && Math.abs(py) < 0.18) continue;
      addCpuPoint(px, py, -0.06 + (Math.random() - 0.5) * 0.015, SAND_SHADES[4], 0.9);
    }

    // E. DISTANT CELESTIAL BACKGROUND STARS (Visible during Singularity Void & Hyperspace)
    while (pIdx < PARTICLE_COUNT) {
      const r = 0.9 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.cos(phi);
      const z = -0.4 + (Math.random() - 0.5) * 1.8;
      addCpuPoint(x, y, z, SAND_SHADES[0], 0.75);
    }

    // 7. POINT CLOUD GEOMETRY & STAR WARS HYPERSPACE STRETCH SHADER
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));
    particleGeo.setAttribute("scale", new THREE.BufferAttribute(particleScales, 1));

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
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        varying vec2 vStreakDir;
        varying float vWarp;
        varying float vScale;

        void main() {
          vColor = color;
          vWarp = uWarpProgress;
          vScale = scale;

          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vec4 clipPos = projectionMatrix * mvPos;

          // Normalized 2D radial direction from screen vanishing center
          vec2 screenPos = clipPos.xy / (clipPos.w + 0.0001);
          float len = length(screenPos);
          vStreakDir = len > 0.001 ? screenPos / len : vec2(1.0, 0.0);

          // Star Wars Warp streak expansion
          float warpScale = 1.0 + uWarpProgress * 4.8;
          float ptSize = size * scale * warpScale * (7.4 / -mvPos.z);
          gl_PointSize = clamp(ptSize, 1.0, 42.0);
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform float uWarpProgress;
        varying vec3 vColor;
        varying vec2 vStreakDir;
        varying float vWarp;
        varying float vScale;

        void main() {
          if (vScale < 0.01) discard;

          vec2 coord = gl_PointCoord - vec2(0.5);

          // Star Wars Hyperspace needle-streak alignment along radial vector
          if (vWarp > 0.02) {
            float c = vStreakDir.x;
            float s = vStreakDir.y;
            // Rotate coordinate space to align with radial velocity streak direction
            mat2 rot = mat2(c, s, -s, c);
            coord = rot * coord;
            // Squeeze Y into an aerodynamic needle streak so it never touches square sprite bounds
            coord.y *= (2.4 + vWarp * 5.0);
          }

          float d = length(coord);
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.08, d) * (0.94 + vWarp * 0.06) * vScale;
          // Warp stars turn into brilliant white/champagne lightspeed needles
          vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), vWarp * 0.92);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    cpuGroup.add(particles);
    particlesRef.current = particles;

    // 8. INTERACTION RAYCASTING & FLUID CURSOR BRUSH
    const rayPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

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
        const localPos = cpuGroupRef.current.worldToLocal(intersectionPoint.clone());
        prevMouseLocalPosRef.current.copy(mouseLocalPosRef.current);
        mouseLocalPosRef.current.copy(localPos);

        // Fluid cursor brush velocity
        const vx = localPos.x - prevMouseLocalPosRef.current.x;
        const vy = localPos.y - prevMouseLocalPosRef.current.y;
        mouseVelocityRef.current.set(vx, vy);
      }
    };

    // POINTER MOVE: Update tilt & fluid brush
    const onPointerMove = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
      if (isHoldingRef.current) {
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
      }
    };

    // POINTER DOWN: Record position & initiate 2.5s Black Hole Absorption
    const holdTimerRef = { id: 0 as any };
    const onPointerDown = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      holdStartRef.current = performance.now();

      // Trigger Black Hole after 140ms
      holdTimerRef.id = setTimeout(() => {
        isHoldingRef.current = true;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = false;
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
        startBlackHoleSound();
        setInteractionHint("BLACK HOLE ACTIVE · ABSORBING PARTICLES INTO SINGULARITY");
      }, 140);
    };

    // POINTER UP: Reverse Unspooling Scatter Flow or Hyperspace Jump
    const onPointerUp = (e: PointerEvent) => {
      clearTimeout(holdTimerRef.id);
      const pressDuration = performance.now() - holdStartRef.current;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (isHoldingRef.current) {
        // Was holding: Release into Reverse Unspooling Motion (No liquid ripple / thump!)
        isHoldingRef.current = false;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = true;
        unspoolStartTimeRef.current = performance.now();
        stopBlackHoleSound();
        setInteractionHint("SINGULARITY RELEASED · REVERSING FLOW BACK INTO CPU");

        // Set outward velocity in the exact direction of each particle's home position
        const bh = blackHolePosRef.current;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const tx = targetPositions[i3];
          const ty = targetPositions[i3 + 1];
          const tz = targetPositions[i3 + 2];

          const dirX = tx - bh.x;
          const dirY = ty - bh.y;
          const dirZ = tz - bh.z;
          const dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) + 0.01;

          // Smooth outward reverse flow velocity
          const flowSpeed = Math.min(dist * 2.8, 4.2) + Math.random() * 0.4;
          velocities[i3] = (dirX / dist) * flowSpeed;
          velocities[i3 + 1] = (dirY / dist) * flowSpeed;
          velocities[i3 + 2] = (dirZ / dist) * flowSpeed;
        }

        setTimeout(() => {
          isUnspoolingRef.current = false;
          setInteractionHint("MOVE ACROSS CORE · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE");
        }, 2200);
      } else if (pressDuration < 220 && dx < 15 && dy < 15) {
        // Quick single click/tap: Star Wars Lightspeed Hyperspace Jump!
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
      pulsatingLightMat.uniforms.uTime.value = elapsed;

      // A. DYNAMIC 3D PERSPECTIVE TILT TOWARDS CURSOR
      if (cpuGroupRef.current) {
        const targetTiltX = -mouseNormRef.current.y * 0.30;
        const targetTiltY = mouseNormRef.current.x * 0.38;
        cpuGroupRef.current.rotation.x += (targetTiltX - cpuGroupRef.current.rotation.x) * 0.07;
        cpuGroupRef.current.rotation.y += (targetTiltY - cpuGroupRef.current.rotation.y) * 0.07;
        cpuGroupRef.current.rotation.z = Math.sin(elapsed * 0.25) * 0.012;
      }

      // B. BLACK HOLE VISUAL ANIMATION
      const isHolding = isHoldingRef.current;
      const bh = blackHolePosRef.current;
      const holdDuration = isHolding ? (performance.now() - holdStartRef.current) / 1000.0 : 0;

      if (isHolding) {
        blackHoleGroup.visible = true;
        blackHoleGroup.position.copy(bh);

        if (holdDuration >= 2.5) {
          // After 2.5s: Fully absorbed singularity void! Pulsating celestial light at hold point
          if (!isAbsorbedRef.current) {
            isAbsorbedRef.current = true;
            setInteractionHint("SINGULARITY VOID · PULSATING CORE · RELEASE TO REVERSE FLOW");
          }
          const pulseScale = 1.0 + Math.sin(elapsed * 4.2) * 0.12;
          blackHoleGroup.scale.lerp(new THREE.Vector3(pulseScale, pulseScale, pulseScale), 0.15);
        } else {
          // Sucking in phase (0 to 2.5s)
          const targetScale = Math.min(holdDuration / 0.8, 1.0) * (1.0 + Math.sin(elapsed * 8.0) * 0.05);
          blackHoleGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
        }
      } else {
        blackHoleGroup.scale.lerp(new THREE.Vector3(0, 0, 0), 0.25);
        if (blackHoleGroup.scale.x < 0.01) {
          blackHoleGroup.visible = false;
        }
      }

      // C. PARTICLE PHYSICS INTEGRATION
      const mw = mouseLocalPosRef.current;
      const mVel = mouseVelocityRef.current;
      const posArr = currentPositions;
      const targetArr = targetPositions;
      const velArr = velocities;
      const scaleArr = particleScales;
      const isWarping = isTransitioningRef.current;
      const isUnspooling = isUnspoolingRef.current;
      const timeSinceUnspool = isUnspooling ? (performance.now() - unspoolStartTimeRef.current) / 1000.0 : 999.0;

      // Smooth fluid brush radius (reference video 2 style)
      const brushRadius = isMobile ? 0.24 : 0.20;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        let px = posArr[i3];
        let py = posArr[i3 + 1];
        let pz = posArr[i3 + 2];
        let vx = velArr[i3];
        let vy = velArr[i3 + 1];
        let vz = velArr[i3 + 2];
        let scl = scaleArr[i];

        if (isWarping) {
          // STAR WARS HYPERSPACE WARP: Particles race forward into camera as radial lightspeed needles!
          const warpFactor = warpProgressRef.current;
          vz += (16.0 + Math.random() * 16.0) * warpFactor * delta;
          vx += px * 1.8 * warpFactor * delta;
          vy += py * 1.8 * warpFactor * delta;
          scl = 1.0;
        } else if (isHolding) {
          // BLACK HOLE INWARD ABSORPTION (2.5 SECONDS)
          const dx = bh.x - px;
          const dy = bh.y - py;
          const dz = bh.z - pz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;

          if (holdDuration >= 2.5 || dist < 0.025) {
            // Fully absorbed into the singularity core!
            px = bh.x;
            py = bh.y;
            pz = bh.z;
            vx = 0;
            vy = 0;
            vz = 0;
            scl = Math.max(0.0, scl - delta * 4.0); // Shrinks to 0
          } else {
            // Pure direct inward suction accelerating smoothly over 2.5s
            const accel = 6.0 + (holdDuration / 2.5) * 8.0;
            const pull = accel / (dist + 0.04);
            vx += (dx / dist) * pull * delta;
            vy += (dy / dist) * pull * delta;
            vz += (dz / dist) * pull * delta;

            // Smoothly shrink as particle approaches singularity
            if (dist < 0.12) {
              scl = Math.max(0.0, dist / 0.12);
            }
            vx *= 0.92;
            vy *= 0.92;
            vz *= 0.92;
          }
        } else if (isUnspooling && timeSinceUnspool < 0.45) {
          // PHASE 1 REVERSE UNSPOOLING: Smooth outward stream from singularity back to home (No ripple!)
          scl = Math.min(1.0, scl + delta * 3.5);
          vx *= 0.94;
          vy *= 0.94;
          vz *= 0.94;
        } else {
          // NORMAL LIVING CPU & SMOOTH RE-STRUCTURING
          const tx = targetArr[i3];
          const ty = targetArr[i3 + 1];
          const tz = targetArr[i3 + 2];

          // Critically damped spring return (No bouncing ripple!)
          const springK = 4.8;
          vx += (tx - px) * springK * delta;
          vy += (ty - py) * (springK * 1.08) * delta;
          vz += (tz - pz) * springK * delta;

          // Scale smoothly restores to 1.0
          if (scl < 1.0) {
            scl = Math.min(1.0, scl + delta * 2.5);
          }

          // FLUID INERTIA BRUSH (IMURUN Reference Video Style - NO WATER RIPPLE)
          const mdx = px - mw.x;
          const mdy = py - mw.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (dist < brushRadius) {
            const w = Math.cos((dist / brushRadius) * (Math.PI * 0.5)); // Smooth cosine bell curve
            // Impart directional mouse drag momentum
            vx += mVel.x * 0.35 * w;
            vy += mVel.y * 0.35 * w;
            // Soft micro-deflection to prevent pointer crowding
            vx += (mdx / (dist + 0.001)) * 0.45 * w * delta;
            vy += (mdy / (dist + 0.001)) * 0.45 * w * delta;
          }

          // Ambient micro-flow along traces
          const phase = particlePhases[i];
          vx += Math.cos(elapsed * 3.0 + phase) * 0.012 * delta;
          vy += Math.sin(elapsed * 3.0 + phase) * 0.012 * delta;

          // Critical damping (Prevents oscillations / water ripples)
          vx *= 0.88;
          vy *= 0.88;
          vz *= 0.88;
        }

        // Integrate positions
        posArr[i3] = px + vx * (delta * 60);
        posArr[i3 + 1] = py + vy * (delta * 60);
        posArr[i3 + 2] = pz + vz * (delta * 60);
        velArr[i3] = vx;
        velArr[i3 + 1] = vy;
        velArr[i3 + 2] = vz;
        scaleArr[i] = scl;
      }

      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.scale.needsUpdate = true;
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
  }, [triggerWarpTransition, startBlackHoleSound, stopBlackHoleSound]);

  return (
    <div className="relative w-full h-[100svh] bg-[#06070B] text-[#F8F5EE] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10 cursor-crosshair" />

      {/* Star Wars Hyperspace Lightspeed Flash Overlay */}
      <div
        ref={warpFlashRef}
        className="absolute inset-0 bg-[#FFFDF5] pointer-events-none opacity-0 z-50 transition-opacity"
      />

      {/* Top Header Bar: Clean Minimal Telemetry */}
      <header className="absolute top-5 left-5 right-5 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · CPU CORE</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">4-WAY BUS ARCHITECTURE</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Kinetic Parallax</span>
        </div>
      </header>

      {/* Center Interactive Action Pill Banner */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-black/35 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-mono text-white/70 tracking-wider">
          {interactionHint}
        </div>
      </div>

      {/* Subtle, Non-Intrusive Bottom Hyperspace Jump Button */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={triggerWarpTransition}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-xs font-mono tracking-widest uppercase transition-all backdrop-blur-xl shadow-xl hover:scale-105 active:scale-95"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          <span>Hyperspace Jump</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
        </button>
      </footer>
    </div>
  );
});
