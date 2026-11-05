"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

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
  const telemetryHintRef = useRef<HTMLDivElement>(null);

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
  const mouseUvRef = useRef(new THREE.Vector2(0.5, 0.5));
  const gyroTiltRef = useRef({ x: 0, y: 0 });

  // Black hole phases: absorption (0-2.5s), singularity void (>2.5s), reverse unspooling
  const isAbsorbedRef = useRef(false);
  const isUnspoolingRef = useRef(false);
  const unspoolStartTimeRef = useRef(0);

  // Typography Gravitational Lensing, Event Horizon Suction & Supernova Flash
  const textLensingRef = useRef(0);
  const textAlphaRef = useRef(1.0);
  const textFlareRef = useRef(0);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const textReturnTriggeredRef = useRef(false);
  const planeWRef = useRef(4.85);
  const planeHRef = useRef(2.73);

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

  // Audio: Cosmic Detonation & Celestial Condensation Bloom Sound on Black Hole Release
  const playCosmicReleaseSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Pre-detonation micro-implosion breath (inward pitch rise 42Hz -> 175Hz)
      const inhaleOsc = ctx.createOscillator();
      const inhaleGain = ctx.createGain();
      inhaleOsc.type = "sine";
      inhaleOsc.frequency.setValueAtTime(42, now);
      inhaleOsc.frequency.exponentialRampToValueAtTime(175, now + 0.07);

      inhaleGain.gain.setValueAtTime(0.01, now);
      inhaleGain.gain.linearRampToValueAtTime(0.12, now + 0.07);
      inhaleGain.gain.linearRampToValueAtTime(0.001, now + 0.09);

      inhaleOsc.connect(inhaleGain);
      inhaleGain.connect(ctx.destination);
      inhaleOsc.start(now);
      inhaleOsc.stop(now + 0.095);

      // 2. Deep Sub-bass cosmic detonation boom (90 Hz -> 22 Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(90, now + 0.07);
      subOsc.frequency.exponentialRampToValueAtTime(22, now + 1.2);

      subGain.gain.setValueAtTime(0.24, now + 0.07);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 0.07);
      subOsc.stop(now + 1.45);

      // 3. Luminous celestial harmonic stardust shimmer (1100 Hz -> 520 Hz)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "triangle";
      chimeOsc.frequency.setValueAtTime(1100, now + 0.08);
      chimeOsc.frequency.exponentialRampToValueAtTime(520, now + 2.2);

      chimeGain.gain.setValueAtTime(0.08, now + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.08);
      chimeOsc.stop(now + 2.45);
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
        cameraRef.current.position.set(0, 0, isMobile ? 3.5 : 3.0);
        cameraRef.current.lookAt(0, 0, 0);
      }
      gsap.killTweensOf(warpProgressRef);
      gsap.killTweensOf(textLensingRef);
      gsap.killTweensOf(textAlphaRef);
      gsap.killTweensOf(textFlareRef);
      textLensingRef.current = 0;
      textAlphaRef.current = 1.0;
      textFlareRef.current = 0;
      textReturnTriggeredRef.current = false;
      warpProgressRef.current = 0;
      isTransitioningRef.current = false;
      isHoldingRef.current = false;
      isAbsorbedRef.current = false;
      isUnspoolingRef.current = false;
      if (telemetryHintRef.current) {
        telemetryHintRef.current.style.opacity = "1";
      }

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


      if (textMeshRef.current) {
        const isMobile = window.innerWidth / window.innerHeight < 1.0;
        const camDist = isMobile ? 3.8 : 3.3;
        textMeshRef.current.visible = true;
        textMeshRef.current.scale.set(1.0, 1.0, 1.0);
        textMeshRef.current.position.set(0, 0, -camDist);
      }

      if (blackHoleGroupRef.current) {
        blackHoleGroupRef.current.scale.set(0, 0, 0);
        blackHoleGroupRef.current.visible = false;
      }
      setInteractionHint("MOVE TO DISTURB · HOLD TO CONDENSE MANIFOLD · WARP TO ARCHIVE");
    }
  }, [isActive]);

  // High-production cinematic entrance sequence from preloader into 3D structure screen
  const triggerCinematicEntrance = useCallback(() => {
    if (!cameraRef.current) return;
    const isMobile = window.innerWidth / window.innerHeight < 1.0;
    const targetZ = isMobile ? 3.5 : 3.0;

    // 1. Camera starts pushed back and glides into prime viewing focal length
    cameraRef.current.position.set(0, 0, targetZ + 1.4);
    gsap.killTweensOf(cameraRef.current.position);
    gsap.to(cameraRef.current.position, {
      z: targetZ,
      duration: 1.9,
      ease: "power3.out",
    });

    // 2. Stardust ignition & bloom: particle scales bloom from 0 to 1
    if (particleScalesRef.current && particlesRef.current) {
      const scl = particleScalesRef.current;
      for (let i = 0; i < scl.length; i++) {
        scl[i] = 0.0;
      }
      if (particlesRef.current.geometry.attributes.scale) {
        particlesRef.current.geometry.attributes.scale.needsUpdate = true;
      }

      const ignition = { progress: 0 };
      gsap.to(ignition, {
        progress: 1,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          if (!particleScalesRef.current || !particlesRef.current) return;
          const s = particleScalesRef.current;
          const total = s.length;
          const activeBoundary = Math.floor(ignition.progress * total);
          for (let i = 0; i < total; i++) {
            if (i < activeBoundary) {
              s[i] = Math.min(1.0, s[i] + 0.08);
            }
          }
          if (particlesRef.current.geometry.attributes.scale) {
            particlesRef.current.geometry.attributes.scale.needsUpdate = true;
          }
        },
      });
    }

    // 3. Champagne flare on the grand typography as it arrives
    textAlphaRef.current = 0.0;
    textFlareRef.current = 0.85;
    gsap.killTweensOf(textAlphaRef);
    gsap.killTweensOf(textFlareRef);
    gsap.to(textAlphaRef, {
      current: 1.0,
      duration: 1.4,
      delay: 0.15,
      ease: "power2.out",
    });
    gsap.to(textFlareRef, {
      current: 0.0,
      duration: 1.8,
      delay: 0.25,
      ease: "power2.inOut",
    });
  }, []);

  // Wire up preloader enter event listener
  useEffect(() => {
    const handleEnterEvent = () => {
      triggerCinematicEntrance();
    };
    window.addEventListener("atelier-enter-studio", handleEnterEvent);
    return () => {
      window.removeEventListener("atelier-enter-studio", handleEnterEvent);
    };
  }, [triggerCinematicEntrance]);

  // Star Wars Galactic Lightspeed Hyperspace Jump (Sustained 3.8 Seconds with Needle Streaks)
  const triggerWarpTransition = useCallback(() => {
    if (isTransitioningRef.current || !cameraRef.current) return;
    isTransitioningRef.current = true;
    warpStartTimeRef.current = performance.now();
    playHyperspaceSound();
    if (telemetryHintRef.current) {
      telemetryHintRef.current.style.opacity = "0";
    }
    setInteractionHint("LIGHTSPEED WARP · CROSSING EVENT HORIZON INTO ARCHIVE");

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
    camera.position.set(0, 0, isMobile ? 3.5 : 3.0);
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

    // 4B. CASA MOMO INSPIRED TWO-CORNER DIAGONAL EDITORIAL TYPOGRAPHY (FIXED ON SCREEN)
    // Top-Left: "WELCOME TO", Bottom-Right: "MY PORTFOLIO", Center completely open for Lorenz Attractor
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 2560;
    textCanvas.height = 1440;
    const tCtx = textCanvas.getContext("2d");

    const renderTypographyCanvas = () => {
      if (!tCtx) return;
      tCtx.clearRect(0, 0, 2560, 1440);

      const fontFamily = "'Druk Trial', 'Druk', 'Helvetica Compressed', 'Anton', -apple-system, sans-serif";

      // Solid Warm Ivory Fill (#F5EEDA)
      tCtx.fillStyle = "#F5EEDA";
      tCtx.strokeStyle = "rgba(245, 238, 218, 0.45)";
      tCtx.lineWidth = 1.6;

      if (isMobile) {
        // MOBILE PORTRAIT (Large commanding architectural scale)
        tCtx.textAlign = "left";
        tCtx.textBaseline = "top";
        tCtx.letterSpacing = "0.02em";
        tCtx.font = `900 220px ${fontFamily}`;
        tCtx.fillText("WELCOME", 80, 80);
        tCtx.strokeText("WELCOME", 80, 80);
        tCtx.fillText("TO", 80, 310);
        tCtx.strokeText("TO", 80, 310);

        tCtx.textAlign = "right";
        tCtx.textBaseline = "bottom";
        tCtx.font = `900 220px ${fontFamily}`;
        tCtx.fillText("MY", 2480, 1180);
        tCtx.strokeText("MY", 2480, 1180);
        tCtx.fillText("PORTFOLIO", 2480, 1400);
        tCtx.strokeText("PORTFOLIO", 2480, 1400);
      } else {
        // DESKTOP: Giant Monumental Druk Diagonal (Overlapping Lorenz Manifold)
        // Top-Left Anchor: "WELCOME" on line 1, "TO" on line 2
        tCtx.textAlign = "left";
        tCtx.textBaseline = "top";
        tCtx.letterSpacing = "0.02em";
        const welcomeFontSize = 390;
        tCtx.font = `900 ${welcomeFontSize}px ${fontFamily}`;
        tCtx.fillText("WELCOME", 80, 70);
        tCtx.strokeText("WELCOME", 80, 70);

        const toFontSize = 390;
        tCtx.font = `900 ${toFontSize}px ${fontFamily}`;
        tCtx.fillText("TO", 80, 470);
        tCtx.strokeText("TO", 80, 470);

        // Bottom-Right Counterbalance: "MY" on line 1, "PORTFOLIO" on line 2
        // Lorenz lower lobe physically overlaps the top of PORTFOLIO!
        tCtx.textAlign = "right";
        tCtx.textBaseline = "top";
        tCtx.letterSpacing = "0.02em";
        const myFontSize = 390;
        tCtx.font = `900 ${myFontSize}px ${fontFamily}`;
        tCtx.fillText("MY", 2480, 470);
        tCtx.strokeText("MY", 2480, 470);

        const portfolioFontSize = 425;
        tCtx.font = `900 ${portfolioFontSize}px ${fontFamily}`;
        tCtx.fillText("PORTFOLIO", 2480, 900);
        tCtx.strokeText("PORTFOLIO", 2480, 900);
      }
    };

    renderTypographyCanvas();

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;

    // Font readiness hook to redraw once Druk / Helvetica Compressed is ready
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load("390px 'Druk Trial'").then(() => {
        renderTypographyCanvas();
        textTexture.needsUpdate = true;
      });
      document.fonts.load("390px 'Helvetica Compressed'").then(() => {
        renderTypographyCanvas();
        textTexture.needsUpdate = true;
      });
      document.fonts.ready.then(() => {
        renderTypographyCanvas();
        textTexture.needsUpdate = true;
      });
    }

    // Viewport-Locked Screen Geometry: Attached directly to camera so letters stay 100% rock-solid fixed on screen
    const vFovRad = (camera.fov * Math.PI) / 180;
    const camDist = isMobile ? 3.8 : 3.3;
    const planeH = 2 * Math.tan(vFovRad / 2) * camDist;
    const planeW = planeH * (width / height);
    planeWRef.current = planeW;
    planeHRef.current = planeH;

    const trailPosVecs: THREE.Vector2[] = Array.from(
      { length: 12 },
      () => new THREE.Vector2(0.5, 0.5)
    );
    const trailRadiiArray = new Float32Array(12);
    const trailAgesArray = new Float32Array(12).fill(100.0);

    const textGeo = new THREE.PlaneGeometry(planeW, planeH, 64, 36);
    const textMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTexture: { value: textTexture },
        uTrailPos: { value: trailPosVecs },
        uTrailRadii: { value: trailRadiiArray },
        uTrailAges: { value: trailAgesArray },
        uTime: { value: 0 },
        uAspect: { value: width / height },
        uBlackHole: { value: new THREE.Vector2(0, 0) },
        uBlackHoleUv: { value: new THREE.Vector2(0.5, 0.5) },
        uLensing: { value: 0.0 },
        uTextAlpha: { value: 1.0 },
        uFlare: { value: 0.0 },
        uWarpProgress: { value: 0.0 },
      },
      vertexShader: `
        uniform vec2 uBlackHole;
        uniform float uLensing;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          if (uLensing > 0.0001) {
            vec2 toBh = uBlackHole - pos.xy;
            float dist = length(toBh);

            // Gravitational Einstein warp pulling fixed screen text into the singularity
            float pull = pow(uLensing, 1.4);
            pos.xy += toBh * min(1.0, pull * (0.85 + 0.35 / (dist + 0.2)));
            pos.z -= pull * exp(-dist * 1.8) * 0.45;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uTrailPos[12];
        uniform float uTrailRadii[12];
        uniform float uTrailAges[12];
        uniform float uTime;
        uniform float uAspect;
        uniform vec2 uBlackHoleUv;
        uniform float uLensing;
        uniform float uTextAlpha;
        uniform float uFlare;
        uniform float uWarpProgress;
        varying vec2 vUv;

        float hash21(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 uv = vUv;

          // VISCOUS GRAVITATIONAL TENDRILS (During Black Hole Singularity hold)
          if (uLensing > 0.02) {
            float tendrilPhase = smoothstep(0.15, 1.0, uLensing);
            if (tendrilPhase > 0.0) {
              vec2 toBh = uBlackHoleUv - uv;
              toBh.x *= uAspect;
              float distToBh = length(toBh);
              vec2 dir = normalize(toBh);
              dir.x /= uAspect;

              // Viscous stretching tendrils modulated by angular noise
              float angle = atan(toBh.y, toBh.x);
              float tendrilNoise = sin(angle * 12.0 + uTime * 3.5) * 0.5 + 0.5;
              float stretch = pow(tendrilPhase, 2.0) * (0.35 + 0.65 * tendrilNoise) / (distToBh + 0.12);
              uv += dir * min(0.65, stretch * 0.42);
            }
          }

          vec4 texCol = texture2D(uTexture, uv);
          if (texCol.a < 0.01) discard;

          // 1. VISCOUS METABALL FLUID MASK (High Surface Tension Droplets - Lando Norris Effect)
          vec2 aspectUv = uv;
          aspectUv.x *= uAspect;

          float fluidField = 0.0;
          for (int i = 0; i < 12; i++) {
            vec2 pos = uTrailPos[i];
            pos.x *= uAspect;
            float r = max(0.001, uTrailRadii[i]);
            float age = uTrailAges[i];
            float w = exp(-age * 1.8);
            float d = length(aspectUv - pos);
            fluidField += (w * r * r) / (d * d + 0.0006);
          }

          // High surface tension threshold with smoothstep creates organic, viscous droplets
          float fluidMask = smoothstep(0.82, 1.18, fluidField);

          // 2. SWIRLING STARDUST EMBERS LAYER (Revealed inside the fluid droplet)
          vec2 dustGrid = uv * vec2(380.0 * uAspect, 380.0);
          vec2 dustCell = floor(dustGrid);
          vec2 dustUv = fract(dustGrid) - 0.5;
          float dustSeed = hash21(dustCell);
          float dustSparkle = sin(uTime * 7.0 + dustSeed * 6.28) * 0.5 + 0.5;
          float emberDist = length(dustUv);
          float emberCore = smoothstep(0.38, 0.06, emberDist) * step(0.30, dustSeed);

          vec3 stardustColor = mix(vec3(0.96, 0.92, 0.82), vec3(1.0, 0.98, 0.94), dustSparkle);
          float stardustAlpha = texCol.a * (0.35 + 0.65 * emberCore);

          // 3. RESTING STATE: LUMINOUS CELESTIAL SAND
          // Crisp, solid ivory fill (#F5EEDA) with living micro-shimmer along letter contours
          float edgeShimmer = sin(uv.x * 280.0 + uv.y * 280.0 + uTime * 3.0) * 0.5 + 0.5;
          float isEdge = smoothstep(0.12, 0.90, texCol.a) * (1.0 - smoothstep(0.90, 0.99, texCol.a));
          vec3 solidColor = vec3(0.961, 0.933, 0.855); // #F5EEDA
          solidColor += vec3(0.10, 0.08, 0.04) * isEdge * edgeShimmer;

          // 4. VISCOUS LIQUID MENISCUS (Glowing Mercury/Champagne Rim)
          float rim = smoothstep(0.15, 0.55, fluidMask) * (1.0 - smoothstep(0.55, 0.98, fluidMask));
          vec3 meniscusGlow = vec3(1.0, 0.96, 0.88) * rim * 1.5;

          // Blend resting solid text into swirling stardust embers through the fluid mask
          vec3 finalRgb = mix(solidColor, stardustColor, fluidMask) + meniscusGlow;
          float finalAlpha = mix(texCol.a, stardustAlpha, fluidMask * 0.70);

          // Gravitational spaghettification collapse: dissolve into event horizon
          if (uLensing > 0.45) {
            float collapseProg = (uLensing - 0.45) / 0.55;
            finalAlpha *= clamp(1.0 - pow(collapseProg, 1.4) * 1.5, 0.0, 1.0);
          }

          // In hyperspace warp: dissolve text as it rushes past camera frustum
          if (uWarpProgress > 0.01) {
            finalAlpha *= clamp(1.0 - pow(uWarpProgress, 1.2) * 1.65, 0.0, 1.0);
          }

          // Supernova flash luminosity flare on return
          finalRgb = mix(finalRgb, vec3(1.0, 0.98, 0.92), uFlare * 0.85);

          gl_FragColor = vec4(finalRgb, finalAlpha * uTextAlpha);
        }
      `,
    });

    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(0, 0, -camDist);
    textMesh.renderOrder = 2; // drawn behind 3D foreground particles
    camera.add(textMesh);
    scene.add(camera);
    textMeshRef.current = textMesh;

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

      // Record trajectory centered at (0.32, 0.61, 25.09) with scale giving commanding cinematic presence
      const scale = isMobile ? 0.026 : 0.040;
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

    // 7. PARTICLES INITIALIZATION: PRISTINE STARDUST FILAMENT (6,400 Desktop / 3,800 Mobile)
    // Distinct, sparkling individual stardust embers with crystal-clear negative space
    const PARTICLE_COUNT = isMobile ? 3800 : 6400;
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
      // Calibrated speed: 12 to 22 steps per second (slow, meditative, serene majestic flow)
      particleSpeeds[i] = Math.random() * 10.0 + 12.0;

      // Delicate cross-sectional ribbon width around the curve (ample breathing room)
      particleRadii[i] = Math.random() * 0.016 + 0.003;
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

      // Crisp, fine diamond stardust embers (calibrated for high-DPI displays)
      particleSizes[i] = Math.random() * 1.4 + 1.2;
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
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWarpProgress;
        uniform float uPixelRatio;
        attribute float size;
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vScale;

        void main() {
          vColor = color;
          vScale = scale;

          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vec4 clipPos = projectionMatrix * mvPos;

          // Crisp, pinpoint calibrated ember sizing (sharp diamond core)
          float ptSize = size * scale * (10.0 / max(0.2, -mvPos.z)) * (uPixelRatio / 1.5);
          gl_PointSize = clamp(ptSize, 2.0, 22.0);
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform float uWarpProgress;
        varying vec3 vColor;
        varying float vScale;

        void main() {
          if (vScale < 0.01) discard;

          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          // Razor-sharp anti-aliased diamond core with delicate celestial perimeter
          float core = smoothstep(0.48, 0.36, d);
          float halo = exp(-d * 4.8) * 0.45;
          float alpha = (core * 0.90 + halo * 0.40) * vScale;

          // In hyperspace warp: points crossfade smoothly into the 3D hyperdrive line beams
          if (uWarpProgress > 0.01) {
            alpha *= clamp(1.0 - uWarpProgress * 2.5, 0.0, 1.0);
          }

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.renderOrder = 10; // Foreground particles render in front of textMesh (renderOrder: 2)
    attractorGroup.add(particles);
    particlesRef.current = particles;

    // 9B. TRUE 3D STAR WARS HYPERDRIVE LINE BEAMS (Razor-Sharp LineSegments)
    const WARP_BEAMS_COUNT = 3200;
    const warpLinePos = new Float32Array(WARP_BEAMS_COUNT * 2 * 3);
    const warpLineCol = new Float32Array(WARP_BEAMS_COUNT * 2 * 3);
    const warpBeamsData: Array<{ x: number; y: number; z: number; speed: number; length: number }> = [];

    for (let i = 0; i < WARP_BEAMS_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.65) * 3.6 + 0.15;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      const z = 1.0 - Math.random() * 14.0;
      const speed = 26.0 + Math.random() * 18.0;
      const length = 1.4 + Math.random() * 2.2;

      warpBeamsData.push({ x, y, z, speed, length });

      const i6 = i * 6;
      // Head vertex
      warpLinePos[i6] = x;
      warpLinePos[i6 + 1] = y;
      warpLinePos[i6 + 2] = z;
      // Tail vertex
      warpLinePos[i6 + 3] = x;
      warpLinePos[i6 + 4] = y;
      warpLinePos[i6 + 5] = z - length;

      // Head: pure brilliant white/champagne laser core
      warpLineCol[i6] = 1.0;
      warpLineCol[i6 + 1] = 0.99;
      warpLineCol[i6 + 2] = 0.95;
      // Tail: luminous champagne trailing falloff
      warpLineCol[i6 + 3] = 0.95;
      warpLineCol[i6 + 4] = 0.85;
      warpLineCol[i6 + 5] = 0.68;
    }

    const warpLinesGeo = new THREE.BufferGeometry();
    warpLinesGeo.setAttribute("position", new THREE.BufferAttribute(warpLinePos, 3));
    warpLinesGeo.setAttribute("color", new THREE.BufferAttribute(warpLineCol, 3));

    const warpLinesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const warpLinesMesh = new THREE.LineSegments(warpLinesGeo, warpLinesMat);
    warpLinesMesh.renderOrder = 12; // Drawn on top of letters
    warpLinesMesh.visible = false;
    scene.add(warpLinesMesh);

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
      mouseUvRef.current.set((nx + 1.0) * 0.5, (ny + 1.0) * 0.5);

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

      // Trigger Black Hole only after deliberate hold (>260ms)
      holdTimerRef.id = setTimeout(() => {
        isHoldingRef.current = true;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = false;
        blackHolePosRef.current.copy(mouseLocalPosRef.current);
        startBlackHoleSound();
        if (telemetryHintRef.current) {
          telemetryHintRef.current.style.opacity = "0";
        }
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(22);
        }
        setInteractionHint("GRAVITATIONAL DECONSTRUCTION · COLLAPSING INTO SINGULARITY");
      }, 260);
    };

    // POINTER UP: Reverse Accretion River Supernova & Spacetime Typography Restoration
    const onPointerUp = (e: PointerEvent) => {
      clearTimeout(holdTimerRef.id);
      const pressDuration = performance.now() - holdStartRef.current;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);

      if (isHoldingRef.current) {
        // Was holding: Initiate Sequential Reverse Accretion River!
        isHoldingRef.current = false;
        isAbsorbedRef.current = false;
        isUnspoolingRef.current = true;
        unspoolStartTimeRef.current = performance.now();
        textReturnTriggeredRef.current = false;
        stopBlackHoleSound();
        playCosmicReleaseSound();

        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([35, 40, 20]);
        }
        setInteractionHint("REVERSE ACCRETION RIVER · STARDUST STREAMING OUT OF SINGULARITY");

        gsap.killTweensOf(textLensingRef);
        gsap.killTweensOf(textAlphaRef);
        gsap.killTweensOf(textFlareRef);

        // If text was sucked in (or in process of being sucked in), keep it collapsed until particles flow back!
        if (textLensingRef.current > 0.3) {
          textLensingRef.current = 1.0;
          textAlphaRef.current = 0.0;
        } else {
          // If released early before text started suction:
          gsap.to(textLensingRef, { current: 0.0, duration: 0.5, ease: "power2.out" });
          gsap.to(textAlphaRef, { current: 1.0, duration: 0.5, ease: "power2.out" });
        }

        // Initialize particles at the singularity point with zero velocity and zero scale
        // They will emerge sequentially as a continuous flowing river of stardust
        const bh = blackHolePosRef.current;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          currentPositions[i3] = bh.x;
          currentPositions[i3 + 1] = bh.y;
          currentPositions[i3 + 2] = bh.z;
          velocities[i3] = 0;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = 0;
          particleScales[i] = 0.0;
        }

        // Slower 4.6s timeline gives plenty of time for river unspooling followed by typography restoration
        setTimeout(() => {
          isUnspoolingRef.current = false;
          if (telemetryHintRef.current) {
            telemetryHintRef.current.style.opacity = "1";
          }
          setInteractionHint("MOVE TO DISTURB · HOLD TO CONDENSE MANIFOLD · TAP TO WARP");
        }, 4600);
      } else if (pressDuration < 260 && dx < 20 && dy < 20 && !isTransitioningRef.current) {
        // Quick tap or click anywhere on screen -> engage Star Wars Hyperspace Jump!
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

        if (isAbsorbedRef.current) {
          // After all particles are absorbed: Singularity void with pulsating celestial photon light
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

        if (timeSinceUnspool < 0.06) {
          // Pre-detonation micro-implosion "breath"
          blackHoleGroup.visible = true;
          blackHoleGroup.position.copy(bh);
          const inhaleProg = timeSinceUnspool / 0.06;
          const inhaleScale = 1.0 - inhaleProg * 0.22;
          blackHoleGroup.scale.set(inhaleScale, inhaleScale, inhaleScale);
        } else if (timeSinceUnspool < 0.38) {
          // Blinding champagne-white flare eruption
          blackHoleGroup.visible = true;
          blackHoleGroup.position.copy(bh);
          const flareProgress = (timeSinceUnspool - 0.06) / 0.32;
          const flareScale = 1.1 + (1.0 - flareProgress) * 2.2;
          blackHoleGroup.scale.set(flareScale, flareScale, flareScale);
          eventHorizonMesh.scale.setScalar(Math.max(0.001, 1.0 - flareProgress * 1.5));
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

      // C. CONSTANT VISIBLE LORENZ ATTRACTOR FLOW & 3D MANIFOLD RAYCASTING
      const mw = mouseLocalPosRef.current;
      const mVel = mouseVelocityRef.current;
      const posArr = currentPositions;
      const targetArr = targetPositions;
      const velArr = velocities;
      const scaleArr = particleScales;
      const isWarping = isTransitioningRef.current;
      // Generous brush radius (0.42 desktop / 0.48 mobile) to reach the outer edge loops and wings!
      const brushRadius = isMobile ? 0.48 : 0.42;

      // Transform camera cursor ray into attractorGroup local coordinates
      const localCursorRay = raycaster.ray.clone();
      if (attractorGroupRef.current) {
        const invMat = new THREE.Matrix4().copy(attractorGroupRef.current.matrixWorld).invert();
        localCursorRay.applyMatrix4(invMat);
      }
      const particlePosVec = new THREE.Vector3();
      const closestRayPoint = new THREE.Vector3();

      let swallowedCount = 0;

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

          // Gravitational horizon expands progressively across the entire screen
          const rGrav = 0.30 + holdDuration * 1.6;

          if (dist < 0.022) {
            // Swallowed cleanly inside the singularity void core
            px = bh.x;
            py = bh.y;
            pz = bh.z;
            vx = 0;
            vy = 0;
            vz = 0;
            scl = 0.0;
            swallowedCount++;
          } else if (distStream <= rGrav || dist < 0.60) {
            // Captured: pulled DIRECTLY into the black hole center (no orbital tangential swirl)
            const uX = dx / dist;
            const uY = dy / dist;
            const uZ = dz / dist;

            // Inward relativistic acceleration that increases as particles plunge towards the core
            // Slower, weighted, cinematic suction
            const inwardAccel = 0.016 + Math.min(holdDuration * 0.010, 0.022) + 0.005 / (dist + 0.040);
            vx += uX * inwardAccel * (delta * 60);
            vy += uY * inwardAccel * (delta * 60);
            vz += uZ * inwardAccel * (delta * 60);

            // Smooth scale attenuation ONLY right at the doorstep of the singularity core (0.16 to 0.022)
            if (dist < 0.16) {
              scl = Math.max(0.0, (dist - 0.022) / 0.138);
            } else {
              scl = 1.0;
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
          // REVERSE ACCRETION RIVER (Slower, Sequential Ribbon of Light Flowing Back into Both Lobes)
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

          // Slower staggered launch across 2.2s: stardust flows out as a continuous ribbon of light
          const launchTime = (i / PARTICLE_COUNT) * 2.2;

          if (timeSinceUnspool < launchTime) {
            // Particle still waiting inside singularity core
            px = bh.x;
            py = bh.y;
            pz = bh.z;
            vx = 0;
            vy = 0;
            vz = 0;
            scl = 0.0;
          } else {
            // Stardust ember travelling along curved accretion river back to the Lorenz manifold
            const travelProg = Math.min(1.0, (timeSinceUnspool - launchTime) / 1.8);
            // Smooth quintic S-curve
            const s = travelProg * travelProg * travelProg * (travelProg * (travelProg * 6.0 - 15.0) + 10.0);

            // Arced ribbon path retracing the curved intake stream
            const arcFactor = Math.sin(travelProg * Math.PI);
            const arcX = -(ty - bh.y) * 0.28 * arcFactor;
            const arcY = (tx - bh.x) * 0.28 * arcFactor;
            const arcZ = (tz - bh.z) * 0.18 * arcFactor;

            const targetX = bh.x + (tx - bh.x) * s + arcX;
            const targetY = bh.y + (ty - bh.y) * s + arcY;
            const targetZ = bh.z + (tz - bh.z) * s + arcZ;

            const easeRate = 0.14 * (delta * 60);
            px += (targetX - px) * easeRate;
            py += (targetY - py) * easeRate;
            pz += (targetZ - pz) * easeRate;

            scl = Math.min(1.0, travelProg * 2.2);

            if (travelProg >= 1.0) {
              vx = (tx - px) * 2.0 * delta;
              vy = (ty - py) * 2.0 * delta;
              vz = (tz - pz) * 2.0 * delta;
            }
          }
        } else {
          // ACTIVE LORENZ ATTRACTOR FLIGHT (ELEGANT 22-40 STEPS/SEC MOTION)
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

          // CRITICALLY DAMPED FLUID TRACKING: Smooth return without jelly wobble or elastic bounce!
          const dispX = tx - px;
          const dispY = ty - py;
          const dispZ = tz - pz;
          const springK = 3.6;
          vx += dispX * springK * delta;
          vy += dispY * springK * delta;
          vz += dispZ * springK * delta;

          if (scl < 1.0) {
            scl = Math.min(1.0, scl + delta * 2.0);
          }

          // 3D MANIFOLD SURFACE RAYCASTING & FLUID INERTIA BRUSH (Edge-Mapped Reach)
          particlePosVec.set(px, py, pz);
          const distToCursorRay = localCursorRay.distanceToPoint(particlePosVec);

          if (distToCursorRay < brushRadius) {
            const w = Math.cos((distToCursorRay / brushRadius) * (Math.PI * 0.5));
            // Smooth fluid parting without unlimited velocity buildup
            const partSpeed = 0.32 * w;
            localCursorRay.closestPointToPoint(particlePosVec, closestRayPoint);
            const mdx = px - closestRayPoint.x;
            const mdy = py - closestRayPoint.y;
            const mdz = pz - closestRayPoint.z;
            const pushDist = Math.sqrt(mdx * mdx + mdy * mdy + mdz * mdz) + 0.001;
            vx += (mdx / pushDist) * partSpeed * delta;
            vy += (mdy / pushDist) * partSpeed * delta;
            vz += (mdz / pushDist) * partSpeed * delta * 0.5;

            // Subtle viscous drag in cursor direction (clamped)
            vx += Math.sign(mVel.x) * Math.min(Math.abs(mVel.x) * 0.20, 0.40) * w;
            vy += Math.sign(mVel.y) * Math.min(Math.abs(mVel.y) * 0.20, 0.40) * w;
          }

          // Critically damped decay (0.84): eliminates oscillation instantly while preserving silky glide
          vx *= 0.84;
          vy *= 0.84;
          vz *= 0.84;
        }

        posArr[i3] = px + vx * (delta * 60);
        posArr[i3 + 1] = py + vy * (delta * 60);
        posArr[i3 + 2] = pz + vz * (delta * 60);
        velArr[i3] = vx;
        velArr[i3 + 1] = vy;
        velArr[i3 + 2] = vz;
        scaleArr[i] = scl;
      }

      // Engage typography suction ONLY after all particles have actually arrived at core
      if (isHolding && swallowedCount >= PARTICLE_COUNT * 0.95) {
        if (!isAbsorbedRef.current) {
          isAbsorbedRef.current = true;
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([25, 60, 35]);
          }
          setInteractionHint("SPACETIME COLLAPSE · LETTERS WARPING INTO SINGULARITY");

          // Slower text warp and suction into the black hole!
          gsap.killTweensOf(textLensingRef);
          gsap.killTweensOf(textAlphaRef);
          gsap.to(textLensingRef, {
            current: 1.0,
            duration: 1.8,
            ease: "power2.inOut",
          });
          gsap.to(textAlphaRef, {
            current: 0.0,
            duration: 1.8,
            ease: "power2.inOut",
          });
        }
      }

      // STAGE 2 OF SUPERNOVA: Typography emerges and unwarps out of singularity AFTER particles flow back
      if (isUnspooling && timeSinceUnspool >= 2.2 && !textReturnTriggeredRef.current) {
        textReturnTriggeredRef.current = true;
        setInteractionHint("SPACETIME RESTORATION · TYPOGRAPHY WARPING OUT OF SINGULARITY");

        gsap.killTweensOf(textLensingRef);
        gsap.killTweensOf(textAlphaRef);
        gsap.killTweensOf(textFlareRef);

        // Alpha fades in smoothly as letters emerge from singularity point
        gsap.to(textAlphaRef, {
          current: 1.0,
          duration: 1.6,
          ease: "power2.out",
        });

        // Lensing relaxes from 1.0 down to 0.0, expanding and unwarping the letters
        gsap.to(textLensingRef, {
          current: 0.0,
          duration: 1.9,
          ease: "power2.out",
          onComplete: () => {
            textLensingRef.current = 0.0;
          },
        });

        // Champagne flare as letters settle into equilibrium
        gsap.to(textFlareRef, {
          current: 1.0,
          duration: 0.22,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(textFlareRef, {
              current: 0.0,
              duration: 0.85,
              ease: "power2.inOut",
            });
          },
        });
      }

      // UPDATE TRUE 3D STAR WARS HYPERDRIVE LINE BEAMS
      if (isWarping) {
        const warpProg = warpProgressRef.current;
        warpLinesMesh.visible = true;
        // Fade in rapidly as hyperdrive engages, then smooth hold until final flash
        warpLinesMat.opacity = Math.min(1.0, warpProg * 3.5) * (1.0 - Math.max(0, (warpProg - 0.88) / 0.12));

        const linePos = warpLinesGeo.attributes.position.array as Float32Array;
        const camZ = camera.position.z;

        for (let i = 0; i < WARP_BEAMS_COUNT; i++) {
          const b = warpBeamsData[i];
          // Accelerate forward along Z towards camera
          b.z += b.speed * warpProg * delta;

          // Elongate laser beams dynamically with hyperdrive speed
          const currentStreakLen = b.length * (0.8 + warpProg * 2.2);

          // Recycle beam to deep space once it rushes past camera frustum
          if (b.z - currentStreakLen > camZ + 0.6) {
            b.z = -14.0 - Math.random() * 4.0;
            const theta = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 0.65) * 3.6 + 0.15;
            b.x = Math.cos(theta) * r;
            b.y = Math.sin(theta) * r;
          }

          const i6 = i * 6;
          // Head (forward laser tip)
          linePos[i6] = b.x;
          linePos[i6 + 1] = b.y;
          linePos[i6 + 2] = b.z;

          // Tail (trailing beam)
          linePos[i6 + 3] = b.x;
          linePos[i6 + 4] = b.y;
          linePos[i6 + 5] = b.z - currentStreakLen;
        }

        warpLinesGeo.attributes.position.needsUpdate = true;
      } else {
        warpLinesMesh.visible = false;
        warpLinesMat.opacity = 0.0;
      }

      // HYPERSPACE TEXT ZOOM FLY-PAST (Words rush outward past screen corners into deep space)
      if (textMeshRef.current) {
        const warpProg = warpProgressRef.current;
        if (warpProg > 0.001) {
          if (warpProg > 0.62) {
            textMeshRef.current.visible = false;
          } else {
            textMeshRef.current.visible = true;
            // Zoom words outward towards screen corners, leaving center hyperdrive tunnel clear
            const zoomScale = 1.0 + Math.pow(warpProg, 1.2) * 4.6;
            textMeshRef.current.scale.set(zoomScale, zoomScale, 1.0);
            textMeshRef.current.position.set(0, 0, -camDist);
          }
        } else {
          textMeshRef.current.visible = true;
          textMeshRef.current.scale.set(1.0, 1.0, 1.0);
          textMeshRef.current.position.set(0, 0, -camDist);
        }
      }

      // Update Viscous Metaball Fluid Droplets Trail
      const mVelMag = Math.sqrt(mVel.x * mVel.x + mVel.y * mVel.y);
      const curUv = mouseUvRef.current;

      for (let k = 11; k > 0; k--) {
        trailPosVecs[k].copy(trailPosVecs[k - 1]);
        trailRadiiArray[k] = trailRadiiArray[k - 1] * 0.94;
        trailAgesArray[k] = trailAgesArray[k - 1] + delta * 2.6;
      }
      trailPosVecs[0].copy(curUv);
      trailRadiiArray[0] = Math.min(0.24, 0.09 + mVelMag * 0.10);
      trailAgesArray[0] = 0.0;

      // Update Typography Shader Uniforms
      if (textMat) {
        const textBhX = (mouseNormRef.current.x * planeWRef.current) * 0.5;
        const textBhY = (mouseNormRef.current.y * planeHRef.current) * 0.5;
        textMat.uniforms.uBlackHole.value.set(textBhX, textBhY);
        const bhScreenX = (mouseNormRef.current.x + 1.0) * 0.5;
        const bhScreenY = (mouseNormRef.current.y + 1.0) * 0.5;
        textMat.uniforms.uBlackHoleUv.value.set(bhScreenX, bhScreenY);
        textMat.uniforms.uLensing.value = textLensingRef.current;
        textMat.uniforms.uTextAlpha.value = textAlphaRef.current;
        textMat.uniforms.uFlare.value = textFlareRef.current;
        textMat.uniforms.uWarpProgress.value = warpProgressRef.current;
        textMat.uniforms.uTime.value = elapsed;
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
      cameraRef.current.position.z = mobile ? 3.5 : 3.0;
      cameraRef.current.updateProjectionMatrix();

      const vFovRad = (cameraRef.current.fov * Math.PI) / 180;
      const camDist = mobile ? 3.8 : 3.3;
      const newH = 2 * Math.tan(vFovRad / 2) * camDist;
      const newW = newH * (w / h);
      planeWRef.current = newW;
      planeHRef.current = newH;
      if (textMeshRef.current) {
        textMeshRef.current.geometry.dispose();
        textMeshRef.current.geometry = new THREE.PlaneGeometry(newW, newH, 64, 36);
        textMeshRef.current.position.set(0, 0, -camDist);
      }

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
      gsap.killTweensOf(textLensingRef);
      gsap.killTweensOf(textAlphaRef);
      gsap.killTweensOf(textFlareRef);
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
        className="absolute inset-0 bg-[#FFFDF5] pointer-events-none opacity-0 z-50"
      />

      {/* Whisper-Quiet Subtle Center Telemetry Hint (Pure CASA MOMO Layout) */}
      <div
        ref={telemetryHintRef}
        className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none select-none transition-opacity duration-500"
      >
        <span className="text-[9.5px] font-mono tracking-[0.28em] text-[#F5EEDA]/35 uppercase">
          TAP TO WARP · HOLD TO CONDENSE
        </span>
      </div>
    </div>
  );
});
