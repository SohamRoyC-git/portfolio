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
    "MOVE ACROSS ATTRACTOR · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE"
  );

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const attractorGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const blackHoleGroupRef = useRef<THREE.Group | null>(null);

  // Particle data references for dynamic reset
  const currentPositionsRef = useRef<Float32Array | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const particleScalesRef = useRef<Float32Array | null>(null);

  // Simulation physics state
  const isHoldingRef = useRef(false);
  const holdStartRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const blackHolePosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseLocalPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const prevMouseLocalPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const mouseVelocityRef = useRef(new THREE.Vector2(0, 0));
  const mouseNormRef = useRef({ x: 0, y: 0 });
  const gyroTiltRef = useRef({ x: 0, y: 0 });

  // Black hole phases: absorption (0-2.5s), singularity void (>2.5s), reverse unspooling
  const isAbsorbedRef = useRef(false);
  const isUnspoolingRef = useRef(false);
  const unspoolStartTimeRef = useRef(0);

  // Hyperspace transition state (sustained 3.8 seconds)
  const isTransitioningRef = useRef(false);
  const warpProgressRef = useRef(0);
  const warpStartTimeRef = useRef(0);

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
      osc.frequency.setValueAtTime(52, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 2.5);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, ctx.currentTime);
      filter.Q.setValueAtTime(3.4, ctx.currentTime);

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

  // Audio: Cosmic Detonation Bloom Sound on Black Hole Release
  const playCosmicReleaseSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Sub-bass dissipation whoosh (65 Hz -> 26 Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.8);

      subGain.gain.setValueAtTime(0.18, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.95);

      // 2. Luminous celestial chime bloom (880 Hz harmonic shimmer)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(880, now);
      chimeOsc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

      chimeGain.gain.setValueAtTime(0.06, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now);
      chimeOsc.stop(now + 1.35);
    } catch {}
  }, [getAudioContext]);

  // Audio: Sustained Star Wars Hyperspace Spool (3.8 seconds)
  const playHyperspaceSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3400, ctx.currentTime + 3.4);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(4200, ctx.currentTime + 3.4);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.26, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.26, ctx.currentTime + 2.8);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.9);
    } catch {}
  }, [getAudioContext]);

  // Reset workspace state whenever navigating back to 3D Studio
  useEffect(() => {
    if (isActive) {
      if (warpFlashRef.current) {
        gsap.killTweensOf(warpFlashRef.current);
        warpFlashRef.current.style.opacity = "0";
      }
      if (cameraRef.current) {
        gsap.killTweensOf(cameraRef.current.position);
        const isMobile = window.innerWidth / window.innerHeight < 1.0;
        cameraRef.current.position.set(0, 0, isMobile ? 3.8 : 3.2);
        cameraRef.current.lookAt(0, 0, 0);
      }
      gsap.killTweensOf(warpProgressRef);
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
        if (particlesRef.current.geometry.attributes.scale) {
          particlesRef.current.geometry.attributes.scale.needsUpdate = true;
        }
      }


      if (blackHoleGroupRef.current) {
        blackHoleGroupRef.current.scale.set(0, 0, 0);
        blackHoleGroupRef.current.visible = false;
      }
      setInteractionHint("MOVE ACROSS ATTRACTOR · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE");
    }
  }, [isActive]);

  // Star Wars Galactic Lightspeed Hyperspace Jump (Sustained 3.8 Seconds with Needle Streaks)
  const triggerWarpTransition = useCallback(() => {
    if (isTransitioningRef.current || !cameraRef.current) return;
    isTransitioningRef.current = true;
    warpStartTimeRef.current = performance.now();
    playHyperspaceSound();
    setInteractionHint("HYPERSPACE JUMP ENGAGED · LIGHTSPEED WARP");

    const camera = cameraRef.current;

    // Warp progress ramps smoothly over 3.8 seconds
    gsap.to(warpProgressRef, {
      current: 1.0,
      duration: 3.8,
      ease: "power2.inOut",
    });

    // Camera surges forward smoothly through the starfield
    gsap.to(camera.position, {
      z: 0.8,
      duration: 3.8,
      ease: "power2.in",
    });

    // Final lightspeed flash overlay dissolves into portfolio hero
    if (warpFlashRef.current) {
      gsap.to(warpFlashRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 3.2,
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
      }, 3800);
    }
  }, [onEnterPortfolio, playHyperspaceSound]);

  // Main Three.js Particle Physics Engine (Lorenz Strange Attractor + Studio Smoke)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(isMobile ? 56 : 45, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 3.5 : 3.2);
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

    // 3. VELVET OBSIDIAN STUDIO MIST BACKGROUND (Fullscreen Volumetric Shader Quad)
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
          float t = uTime * 0.022; // Silky, slow volumetric evolution

          vec2 smokeCoord = p * 1.15 + vec2(sin(t * 0.35) * 0.15, t * 0.12);
          float s1 = fbm(smokeCoord);
          float s2 = fbm(smokeCoord + vec2(s1 * 0.6, s1 * 0.4));

          // Velvet Obsidian Studio Mist (Deep, luxurious dark tones with soft champagne core depth)
          vec3 deepObsidian = vec3(0.024, 0.025, 0.032); // #06070B rich dark base
          vec3 velvetSmoke  = vec3(0.052, 0.050, 0.046); // warm charcoal-taupe mist
          vec3 coreAmbient  = vec3(0.078, 0.068, 0.054); // warm champagne depth glow

          float dist = length(p);
          float vignette = 1.0 - smoothstep(0.25, 1.35, dist);

          // Subtle ambient central depth glow behind the attractor (no digital dots or blinking stars!)
          float coreGlow = exp(-dist * 2.2) * 0.55;

          vec3 col = mix(deepObsidian, velvetSmoke, s2 * 0.65);
          col += coreAmbient * coreGlow * (0.85 + 0.15 * s1);
          col *= vignette;

          // Pure tactile micro analog film grain
          float grain = (hash(vUv * 640.0 + fract(uTime * 0.5)) - 0.5) * 0.010;
          col += grain;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const smokeQuad = new THREE.Mesh(smokeQuadGeo, smokeMat);
    scene.add(smokeQuad);

    // 4. 3D ATTRACTOR ROOT GROUP (For dynamic 3D tilt & perspective parallax)
    const attractorGroup = new THREE.Group();
    scene.add(attractorGroup);
    attractorGroupRef.current = attractorGroup;

    // 5. BLACK HOLE VISUAL ENTITY (Event Horizon Void + Pulsating Celestial Photon Ring)
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.visible = false;
    blackHoleGroup.scale.set(0, 0, 0);
    attractorGroup.add(blackHoleGroup);
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

    // 5B. Pulsating Celestial Photon Light (Breathes when particles are absorbed)
    const pulsatingLightGeo = new THREE.PlaneGeometry(0.52, 0.52);
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

          float pulse = 0.5 + 0.5 * sin(uTime * 4.2);
          float ring = smoothstep(0.34, 0.44, r) * (1.0 - smoothstep(0.52, 0.95, r));
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

    // 5C. Gravitational Shockwave Ring (Detonates on Black Hole Release)
    const shockwaveGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shockwaveMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 1.0 },
        uColor: { value: new THREE.Color(0xFFE8CA) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          if (uProgress >= 0.999) discard;
          vec2 p = (vUv - vec2(0.5)) * 2.0;
          float r = length(p);
          if (r > 1.0) discard;

          float curRadius = clamp(uProgress * 0.96, 0.01, 0.98);
          float thickness = 0.05 + 0.03 * uProgress;
          float ring = smoothstep(curRadius - thickness, curRadius, r) *
                       (1.0 - smoothstep(curRadius, curRadius + thickness, r));
          float glow = exp(-abs(r - curRadius) * 14.0) * 0.5;
          float alpha = (ring * 0.85 + glow * 0.4) * (1.0 - uProgress);

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.renderOrder = 22;
    shockwaveMesh.visible = false;
    attractorGroup.add(shockwaveMesh);

    // 6. NUMERICAL INTEGRATION OF THE 3D LORENZ STRANGE ATTRACTOR TRAJECTORY
    // Perfectly centered with breathing room matching IMURUN reference
    const LORENZ_STEPS = 24000;
    const lorenzPath = new Float32Array(LORENZ_STEPS * 3);
    {
      let x = 0.1, y = 0.0, z = 0.0;
      const sigma = 10.0;
      const rho = 28.0;
      const beta = 8.0 / 3.0;
      const dt = 0.004;

      // Warm-up to settle onto the manifold
      for (let i = 0; i < 4000; i++) {
        const f = (cx: number, cy: number, cz: number) => [
          sigma * (cy - cx),
          cx * (rho - cz) - cy,
          cx * cy - beta * cz,
        ];
        const [k1x, k1y, k1z] = f(x, y, z);
        const [k2x, k2y, k2z] = f(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, z + 0.5 * dt * k1z);
        const [k3x, k3y, k3z] = f(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, z + 0.5 * dt * k2z);
        const [k4x, k4y, k4z] = f(x + dt * k3x, y + dt * k3y, z + dt * k3z);
        x += (dt / 6.0) * (k1x + 2 * k2x + 2 * k3x + k4x);
        y += (dt / 6.0) * (k1y + 2 * k2y + 2 * k3y + k4y);
        z += (dt / 6.0) * (k1z + 2 * k2z + 2 * k3z + k4z);
      }

      // Record trajectory centered at (0.32, 0.61, 25.09) with scale giving breathing room
      const scale = isMobile ? 0.026 : 0.032;
      for (let i = 0; i < LORENZ_STEPS; i++) {
        const f = (cx: number, cy: number, cz: number) => [
          sigma * (cy - cx),
          cx * (rho - cz) - cy,
          cx * cy - beta * cz,
        ];
        const [k1x, k1y, k1z] = f(x, y, z);
        const [k2x, k2y, k2z] = f(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, z + 0.5 * dt * k1z);
        const [k3x, k3y, k3z] = f(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, z + 0.5 * dt * k2z);
        const [k4x, k4y, k4z] = f(x + dt * k3x, y + dt * k3y, z + dt * k3z);

        x += (dt / 6.0) * (k1x + 2 * k2x + 2 * k3x + k4x);
        y += (dt / 6.0) * (k1y + 2 * k2y + 2 * k3y + k4y);
        z += (dt / 6.0) * (k1z + 2 * k2z + 2 * k3z + k4z);

        const idx3 = i * 3;
        // Map X -> Screen X, Z -> Screen Y (canonical butterfly orientation), Y -> Depth Z
        lorenzPath[idx3] = (x - 0.32) * scale;
        lorenzPath[idx3 + 1] = (z - 25.09) * scale;
        lorenzPath[idx3 + 2] = (y - 0.61) * scale;
      }
    }

    // 7. PARTICLES INITIALIZATION: GOLDEN MIDDLE GROUND (12,000 Desktop / 7,500 Mobile)
    // Distinct, sparkling individual stardust embers with crystal-clear negative space
    const PARTICLE_COUNT = isMobile ? 7500 : 12000;
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particleScales = new Float32Array(PARTICLE_COUNT);
    const particleIndices = new Float32Array(PARTICLE_COUNT); // Position along trajectory
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);  // Flow velocity along trajectory
    const particleRadii = new Float32Array(PARTICLE_COUNT);   // Radial ribbon dispersion
    const particleAngles = new Float32Array(PARTICLE_COUNT);  // Angle around ribbon core

    currentPositionsRef.current = currentPositions;
    targetPositionsRef.current = targetPositions;
    velocitiesRef.current = velocities;
    particleScalesRef.current = particleScales;

    // Refined Monochromatic Champagne / Warm Sand Palette (IMURUN Palette)
    const SAND_SHADES = [
      [0.98, 0.95, 0.90], // Light Champagne (#FFF8F0)
      [0.94, 0.88, 0.78], // Cream Sand (#F5E6D3)
      [0.89, 0.80, 0.68], // Warm Desert Ecru (#E8D2B8)
      [0.82, 0.71, 0.56], // Golden Sand (#D9BD99)
      [0.74, 0.62, 0.48], // Soft Amber Sand (#BC9E7A)
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const sIndex = (i / PARTICLE_COUNT) * LORENZ_STEPS + Math.random() * 12.0;
      particleIndices[i] = sIndex % LORENZ_STEPS;
      // Calibrated speed: 50 to 75 steps per second (clearly visible, elegant flow)
      particleSpeeds[i] = Math.random() * 25.0 + 50.0;

      // Delicate cross-sectional ribbon width around the curve (ample breathing room)
      particleRadii[i] = Math.random() * 0.020 + 0.004;
      particleAngles[i] = Math.random() * Math.PI * 2;

      const baseIdx = Math.floor(particleIndices[i]) % LORENZ_STEPS;
      const bx = lorenzPath[baseIdx * 3];
      const by = lorenzPath[baseIdx * 3 + 1];
      const bz = lorenzPath[baseIdx * 3 + 2];

      const r = particleRadii[i];
      const theta = particleAngles[i];
      const x = bx + Math.cos(theta) * r;
      const y = by + Math.sin(theta) * r;
      const z = bz + (Math.random() - 0.5) * 0.015;

      currentPositions[i3] = x;
      currentPositions[i3 + 1] = y;
      currentPositions[i3 + 2] = z;

      targetPositions[i3] = x;
      targetPositions[i3 + 1] = y;
      targetPositions[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      const shade = SAND_SHADES[Math.floor(Math.random() * SAND_SHADES.length)];
      particleColors[i3] = shade[0] + (Math.random() - 0.5) * 0.02;
      particleColors[i3 + 1] = shade[1] + (Math.random() - 0.5) * 0.02;
      particleColors[i3 + 2] = shade[2] + (Math.random() - 0.5) * 0.02;

      particleSizes[i] = Math.random() * 1.6 + 1.3;
      particleScales[i] = 1.0;
    }

    // 8. ATTRACTOR POINT CLOUD GEOMETRY & SHADER
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));
    particleGeo.setAttribute("scale", new THREE.BufferAttribute(particleScales, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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
          float warpScale = 1.0 + uWarpProgress * 4.0;
          float ptSize = size * scale * warpScale * (12.0 / -mvPos.z);
          gl_PointSize = clamp(ptSize, 2.0, 64.0);
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
            coord.y *= (1.8 + vWarp * 3.2);
          }

          float d = length(coord);
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.02, d) * (0.86 + vWarp * 0.14) * vScale;
          // Warp stars turn into brilliant white/champagne lightspeed needles
          vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), vWarp * 0.94);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    attractorGroup.add(particles);
    particlesRef.current = particles;

    // 10. INTERACTION RAYCASTING & FLUID CURSOR BRUSH
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

      if (intersectionPoint && attractorGroupRef.current) {
        const localPos = attractorGroupRef.current.worldToLocal(intersectionPoint.clone());
        prevMouseLocalPosRef.current.copy(mouseLocalPosRef.current);
        mouseLocalPosRef.current.copy(localPos);

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

    // POINTER DOWN: Record position & initiate Cascading Accretion Black Hole Intake
    const holdTimerRef = { id: 0 as any };
    const onPointerDown = (e: PointerEvent) => {
      updateMousePos(e.clientX, e.clientY);
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      holdStartRef.current = performance.now();

      // Mobile haptic vibration on touch engagement
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(18);
      }

      // Trigger Black Hole after 120ms
      holdTimerRef.id = setTimeout(() => {
        isHoldingRef.current = true;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = false;
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
        startBlackHoleSound();
        setInteractionHint("BLACK HOLE ENGAGED · INTAKE OF ACCRETION STREAM");
      }, 120);
    };

    // POINTER UP: Reverse Unspooling Supernova & Nebular Bloom, or Hyperspace Jump
    const onPointerUp = (e: PointerEvent) => {
      clearTimeout(holdTimerRef.id);
      const pressDuration = performance.now() - holdStartRef.current;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (isHoldingRef.current) {
        // Was holding: Release into Reverse Unspooling Supernova Bloom!
        isHoldingRef.current = false;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = true;
        unspoolStartTimeRef.current = performance.now();
        stopBlackHoleSound();
        playCosmicReleaseSound();

        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([35, 40, 20]);
        }
        setInteractionHint("SUPERNOVA RELEASE · STREAM REVERSING TO EQUILIBRIUM");

        // Set outward velocity unwinding along reverse accretion vortex
        const bh = blackHolePosRef.current;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const tx = targetPositions[i3];
          const ty = targetPositions[i3 + 1];
          const tz = targetPositions[i3 + 2];

          let dirX = tx - bh.x;
          let dirY = ty - bh.y;
          let dirZ = tz - bh.z;
          let dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

          if (dist < 0.001) {
            const angle = Math.random() * Math.PI * 2;
            dirX = Math.cos(angle);
            dirY = Math.sin(angle);
            dirZ = (Math.random() - 0.5) * 0.4;
            dist = 1.0;
          }

          const uX = dirX / dist;
          const uY = dirY / dist;
          const uZ = dirZ / dist;

          // Reverse accretion swirl vector: unwinds along natural stream curve
          const revSwirlStrength = 0.016 + (i % 7) * 0.002;
          const revSwirlX = -uY * revSwirlStrength;
          const revSwirlY = uX * revSwirlStrength;

          // Outward burst speed: perfectly calibrated to screen space (0.024 to 0.038 units/frame)
          const stagger = 0.88 + (i % 19) * 0.012;
          const burstSpeed = (Math.min(dist * 0.032, 0.038) + 0.012) * stagger;

          velocities[i3] = uX * burstSpeed + revSwirlX;
          velocities[i3 + 1] = uY * burstSpeed + revSwirlY;
          velocities[i3 + 2] = uZ * burstSpeed + (Math.random() - 0.5) * 0.006;

          // Micro-flare scale on detonation
          particleScales[i] = 0.35 + Math.random() * 0.3;
        }

        setTimeout(() => {
          isUnspoolingRef.current = false;
          setInteractionHint("MOVE ACROSS ATTRACTOR · HOLD FOR BLACK HOLE · CLICK FOR HYPERSPACE");
        }, 2400);
      } else if (pressDuration < 220 && dx < 15 && dy < 15) {
        // Quick single click/tap: Star Wars Lightspeed Hyperspace Jump!
        triggerWarpTransition();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // 11. HIGH-PERFORMANCE PHYSICS SIMULATION LOOP (60 - 120 FPS)
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

      // A. DYNAMIC 3D PERSPECTIVE TILT TOWARDS CURSOR & GYROSCOPE
      if (attractorGroupRef.current) {
        const targetTiltX = -mouseNormRef.current.y * 0.42 + gyroTiltRef.current.y * 0.32;
        const targetTiltY = mouseNormRef.current.x * 0.48 + gyroTiltRef.current.x * 0.36;
        attractorGroupRef.current.rotation.x += (targetTiltX - attractorGroupRef.current.rotation.x) * 0.06;
        attractorGroupRef.current.rotation.y += (targetTiltY - attractorGroupRef.current.rotation.y) * 0.06;
      }

      // B. BLACK HOLE VISUAL ANIMATION & SUPERNOVA SHOCKWAVE
      const isHolding = isHoldingRef.current;
      const isUnspooling = isUnspoolingRef.current;
      const bh = blackHolePosRef.current;
      const holdDuration = isHolding ? (performance.now() - holdStartRef.current) / 1000.0 : 0;
      const timeSinceUnspool = isUnspooling ? (performance.now() - unspoolStartTimeRef.current) / 1000.0 : 999.0;
      const maxHoldDuration = isMobile ? 2.0 : 2.8;

      if (isHolding) {
        blackHoleGroup.visible = true;
        blackHoleGroup.position.copy(bh);
        shockwaveMesh.visible = false;
        shockwaveMat.uniforms.uProgress.value = 1.0;

        if (holdDuration >= maxHoldDuration) {
          // After full intake: Singularity void with pulsating celestial photon light at hold point
          if (!isAbsorbedRef.current) {
            isAbsorbedRef.current = true;
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([25, 60, 35]);
            }
            setInteractionHint("SINGULARITY VOID · PULSATING CORE · RELEASE FOR SUPERNOVA");
          }
          const pulseScale = 1.0 + Math.sin(elapsed * 4.2) * 0.12;
          blackHoleGroup.scale.lerp(new THREE.Vector3(pulseScale, pulseScale, pulseScale), 0.15);
          eventHorizonMesh.scale.set(1.0, 1.0, 1.0);
          pulsatingLightMesh.scale.set(1.0, 1.0, 1.0);
        } else {
          // Sucking in phase: Event horizon expands as it feeds on the incoming stream
          const targetScale = Math.min(holdDuration / 0.8, 1.0) * (1.0 + Math.sin(elapsed * 8.0) * 0.05);
          blackHoleGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
          eventHorizonMesh.scale.set(1.0, 1.0, 1.0);
          pulsatingLightMesh.scale.set(1.0, 1.0, 1.0);
        }
      } else if (isUnspooling && timeSinceUnspool < 0.65) {
        // DETONATION SHOCKWAVE & CORE DISSIPATION (Stage 1)
        shockwaveMesh.visible = true;
        shockwaveMesh.position.copy(bh);
        shockwaveMat.uniforms.uProgress.value = timeSinceUnspool / 0.65;

        if (timeSinceUnspool < 0.35) {
          blackHoleGroup.visible = true;
          blackHoleGroup.position.copy(bh);
          const flareProgress = timeSinceUnspool / 0.35;
          const flareScale = 1.0 + (1.0 - flareProgress) * 1.8;
          blackHoleGroup.scale.set(flareScale, flareScale, flareScale);
          eventHorizonMesh.scale.setScalar(Math.max(0.001, 1.0 - timeSinceUnspool / 0.18));
        } else {
          blackHoleGroup.visible = false;
          blackHoleGroup.scale.set(0, 0, 0);
        }
      } else {
        shockwaveMesh.visible = false;
        shockwaveMat.uniforms.uProgress.value = 1.0;
        blackHoleGroup.scale.lerp(new THREE.Vector3(0, 0, 0), 0.25);
        if (blackHoleGroup.scale.x < 0.01) {
          blackHoleGroup.visible = false;
        }
      }

      // C. CONSTANT VISIBLE LORENZ ATTRACTOR FLOW & PHYSICS INTEGRATION
      const mw = mouseLocalPosRef.current;
      const mVel = mouseVelocityRef.current;
      const posArr = currentPositions;
      const targetArr = targetPositions;
      const velArr = velocities;
      const scaleArr = particleScales;
      const isWarping = isTransitioningRef.current;
      const brushRadius = isMobile ? 0.24 : 0.18;

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
          vz = (18.0 + (i % 7) * 2.5) * warpFactor;
          vx = 0;
          vy = 0;
          scl = 1.0;

          // Continuous Star Wars Hyperspace loop for the entire 3.8 seconds!
          if (pz > camera.position.z - 0.2) {
            pz = -10.0 - Math.random() * 4.0;
            const theta = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 0.55) * 3.2 + 0.12;
            px = Math.cos(theta) * r;
            py = Math.sin(theta) * r;
          }
        } else if (isHolding) {
          // CASCADING ACCRETION STREAM INTAKE (SLOW, CINEMATIC, INTEGRATED INTO SCENE)
          // Stream coordinates continue advancing along Lorenz manifold
          let pIdx = particleIndices[i] + particleSpeeds[i] * delta;
          if (pIdx >= LORENZ_STEPS) pIdx -= LORENZ_STEPS;
          particleIndices[i] = pIdx;

          const idxA = Math.floor(pIdx) % LORENZ_STEPS;
          const idxB = (idxA + 1) % LORENZ_STEPS;
          const frac = pIdx - Math.floor(pIdx);

          const idxA3 = idxA * 3;
          const idxB3 = idxB * 3;
          const bx = lorenzPath[idxA3] + (lorenzPath[idxB3] - lorenzPath[idxA3]) * frac;
          const by = lorenzPath[idxA3 + 1] + (lorenzPath[idxB3 + 1] - lorenzPath[idxA3 + 1]) * frac;
          const bz = lorenzPath[idxA3 + 2] + (lorenzPath[idxB3 + 2] - lorenzPath[idxA3 + 2]) * frac;

          const r = particleRadii[i];
          const theta = particleAngles[i];
          const tx = bx + Math.cos(theta) * r;
          const ty = by + Math.sin(theta) * r;
          const tz = bz;

          targetArr[i3] = tx;
          targetArr[i3 + 1] = ty;
          targetArr[i3 + 2] = tz;

          const dx = bh.x - px;
          const dy = bh.y - py;
          const dz = bh.z - pz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;

          const distStream = Math.sqrt(
            (bh.x - tx) * (bh.x - tx) + (bh.y - ty) * (bh.y - ty) + (bh.z - tz) * (bh.z - tz)
          );

          const maxHold = isMobile ? 2.0 : 2.8;
          const hProg = Math.min(1.0, holdDuration / maxHold);
          // Gravitational horizon expands progressively over time (cascading intake)
          const rGrav = 0.22 + hProg * 2.8;

          if (hProg >= 1.0 || dist < 0.024) {
            // Fully swallowed inside event horizon!
            px = bh.x;
            py = bh.y;
            pz = bh.z;
            vx = 0;
            vy = 0;
            vz = 0;
            scl = Math.max(0.0, scl - delta * 3.6);
          } else if (distStream <= rGrav || dist < 0.35) {
            // Captured in the swirling accretion stream into the singularity!
            const uX = dx / dist;
            const uY = dy / dist;
            const uZ = dz / dist;

            // Relativistic accretion vortex swirl around black hole core
            const swirlSpeed = 0.012 / (dist + 0.08);
            const swirlX = -uY * swirlSpeed;
            const swirlY = uX * swirlSpeed;

            // Inward suction rate accelerates near singularity
            const suctionRate = 0.014 + hProg * 0.022 + 0.003 / (dist + 0.04);
            vx += (uX * suctionRate + swirlX) * (delta * 60);
            vy += (uY * suctionRate + swirlY) * (delta * 60);
            vz += (uZ * suctionRate) * (delta * 60);

            if (dist < 0.12) {
              scl = Math.max(0.0, dist / 0.12);
            }
            vx *= 0.90;
            vy *= 0.90;
            vz *= 0.90;
          } else {
            // Outside gravitational reach: continues natural flow along Lorenz attractor towards intake
            const springK = 2.4;
            vx += (tx - px) * springK * delta;
            vy += (ty - py) * springK * delta;
            vz += (tz - pz) * springK * delta;
            vx *= 0.91;
            vy *= 0.91;
            vz *= 0.91;
          }
        } else if (isUnspooling) {
          // MULTI-STAGE COSMIC SUPERNOVA & NEBULAR BLOOM (Elegantly timed across 2.4s)
          // Advance stream index along Lorenz trajectory at 50-75 steps/s
          let pIdx = particleIndices[i] + particleSpeeds[i] * delta;
          if (pIdx >= LORENZ_STEPS) pIdx -= LORENZ_STEPS;
          particleIndices[i] = pIdx;

          const idxA = Math.floor(pIdx) % LORENZ_STEPS;
          const idxB = (idxA + 1) % LORENZ_STEPS;
          const frac = pIdx - Math.floor(pIdx);

          const idxA3 = idxA * 3;
          const idxB3 = idxB * 3;
          const bx = lorenzPath[idxA3] + (lorenzPath[idxB3] - lorenzPath[idxA3]) * frac;
          const by = lorenzPath[idxA3 + 1] + (lorenzPath[idxB3 + 1] - lorenzPath[idxA3 + 1]) * frac;
          const bz = lorenzPath[idxA3 + 2] + (lorenzPath[idxB3 + 2] - lorenzPath[idxA3 + 2]) * frac;

          const r = particleRadii[i];
          const theta = particleAngles[i];
          const tx = bx + Math.cos(theta) * r;
          const ty = by + Math.sin(theta) * r;
          const tz = bz;

          targetArr[i3] = tx;
          targetArr[i3 + 1] = ty;
          targetArr[i3 + 2] = tz;

          if (timeSinceUnspool < 0.75) {
            // STAGE 1 & 2: EXPANDING SPIRAL NEBULAR BLOOM
            // Pure celestial inertial flight without spring snapping
            vx *= 0.945;
            vy *= 0.945;
            vz *= 0.945;
            scl = Math.min(1.0, scl + delta * 3.2);
          } else {
            // STAGE 3: GRAVITATIONAL RE-CAPTURE (0.75s to 2.4s)
            // Smooth cubic S-curve ease (0.0 -> 1.0)
            const progress = Math.min(1.0, (timeSinceUnspool - 0.75) / 1.65);
            const blend = progress * progress * (3.0 - 2.0 * progress);

            const springK = 2.4 * blend;
            vx += (tx - px) * springK * delta;
            vy += (ty - py) * springK * delta;
            vz += (tz - pz) * springK * delta;

            const damping = 0.945 - 0.035 * blend;
            vx *= damping;
            vy *= damping;
            vz *= damping;

            scl = Math.min(1.0, scl + delta * 2.2);
          }
        } else {
          // ACTIVE LORENZ ATTRACTOR FLIGHT (ELEGANT 50-75 STEPS/SEC MOTION)
          let pIdx = particleIndices[i] + particleSpeeds[i] * delta;
          if (pIdx >= LORENZ_STEPS) pIdx -= LORENZ_STEPS;
          particleIndices[i] = pIdx;

          // Interpolate between discrete trajectory points for silky smooth flight
          const idxA = Math.floor(pIdx) % LORENZ_STEPS;
          const idxB = (idxA + 1) % LORENZ_STEPS;
          const frac = pIdx - Math.floor(pIdx);

          const idxA3 = idxA * 3;
          const idxB3 = idxB * 3;
          const bx = lorenzPath[idxA3] + (lorenzPath[idxB3] - lorenzPath[idxA3]) * frac;
          const by = lorenzPath[idxA3 + 1] + (lorenzPath[idxB3 + 1] - lorenzPath[idxA3 + 1]) * frac;
          const bz = lorenzPath[idxA3 + 2] + (lorenzPath[idxB3 + 2] - lorenzPath[idxA3 + 2]) * frac;

          // Ribbon cross-section
          const r = particleRadii[i];
          const theta = particleAngles[i];
          const tx = bx + Math.cos(theta) * r;
          const ty = by + Math.sin(theta) * r;
          const tz = bz;

          targetArr[i3] = tx;
          targetArr[i3 + 1] = ty;
          targetArr[i3 + 2] = tz;

          // Silky smooth spring tracking
          const springK = 2.4;
          vx += (tx - px) * springK * delta;
          vy += (ty - py) * springK * delta;
          vz += (tz - pz) * springK * delta;

          if (scl < 1.0) {
            scl = Math.min(1.0, scl + delta * 2.0);
          }

          // FLUID INERTIA BRUSH (IMURUN Reference Video Style - NO WATER RIPPLE)
          const mdx = px - mw.x;
          const mdy = py - mw.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (dist < brushRadius) {
            const w = Math.cos((dist / brushRadius) * (Math.PI * 0.5));
            // Impart directional mouse drag momentum to the flying stream
            vx += mVel.x * 0.36 * w;
            vy += mVel.y * 0.36 * w;
            // Soft micro-deflection
            vx += (mdx / (dist + 0.001)) * 0.35 * w * delta;
            vy += (mdy / (dist + 0.001)) * 0.35 * w * delta;
          }

          // Damping for smooth fluid relaxation
          vx *= 0.91;
          vy *= 0.91;
          vz *= 0.91;
        }

        posArr[i3] = px + vx * (delta * 60);
        posArr[i3 + 1] = py + vy * (delta * 60);
        posArr[i3 + 2] = pz + vz * (delta * 60);
        velArr[i3] = vx;
        velArr[i3 + 1] = vy;
        velArr[i3 + 2] = vz;
        scaleArr[i] = scl;
      }

      particleGeo.attributes.position.needsUpdate = true;
      if (particleGeo.attributes.scale) {
        particleGeo.attributes.scale.needsUpdate = true;
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
      cameraRef.current.fov = mobile ? 56 : 45;
      cameraRef.current.position.z = mobile ? 3.5 : 3.2;
      cameraRef.current.updateProjectionMatrix();

      smokeMat.uniforms.uResolution.value.set(w, h);
      rendererRef.current.setSize(w, h);
    };

    // Mobile Gyroscope 3D Tilt Parallax
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const gx = Math.max(-1.0, Math.min(1.0, e.gamma / 30.0));
        const gy = Math.max(-1.0, Math.min(1.0, (e.beta - 40.0) / 30.0));
        gyroTiltRef.current = { x: gx, y: gy };
      }
    };

    window.addEventListener("resize", handleResize);
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (warpFlashRef.current) gsap.killTweensOf(warpFlashRef.current);
      if (cameraRef.current) gsap.killTweensOf(cameraRef.current.position);
      gsap.killTweensOf(warpProgressRef);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [triggerWarpTransition, startBlackHoleSound, stopBlackHoleSound, playCosmicReleaseSound]);

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
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · LORENZ ATTRACTOR</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">NON-LINEAR DYNAMICAL CORE</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Kinetic Chaos Stream</span>
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
