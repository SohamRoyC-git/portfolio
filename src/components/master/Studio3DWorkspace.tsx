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
  Compass,
  Layers,
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
    { cmd: "system.init", out: "Cyber-Pastoral Prism · Spatial Architecture Kernel Active" },
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
  const prismGroupRef = useRef<THREE.Group | null>(null);
  const coreOrbRef = useRef<THREE.Mesh | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const sporesRef = useRef<THREE.Points | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const causticLightRef = useRef<THREE.PointLight | null>(null);

  // Motion physics
  const mouseNorm = useRef({ x: 0, y: 0 });
  const isTransitioning = useRef(false);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Synthesize crystalline resonance chime
  const playGlassChime = useCallback((freq = 1200) => {
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
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      }
    } catch {}
  }, []);

  // Ambient organic terrace mountain breeze generator
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

  // "Genesis Unfold" Transition into Portfolio Hero
  const triggerPrismTransition = useCallback(() => {
    if (isTransitioning.current || !cameraRef.current || !prismGroupRef.current) return;
    isTransitioning.current = true;
    playGlassChime(1500);

    const camera = cameraRef.current;
    const prismGroup = prismGroupRef.current;

    // 1. Crystal Facet Expansion / Bloom
    gsap.to(prismGroup.scale, {
      x: 1.8,
      y: 1.8,
      z: 1.8,
      duration: 1.2,
      ease: "power2.out",
    });

    // 2. Core Light Surge
    if (coreLightRef.current) {
      gsap.to(coreLightRef.current, {
        intensity: 8.0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }

    // 3. Camera Glide straight through the heart of the crystal
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 0.2,
      duration: 1.25,
      ease: "power3.inOut",
      onComplete: () => {
        onEnterPortfolio();
        isTransitioning.current = false;
      },
    });
  }, [onEnterPortfolio, playGlassChime]);

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    playGlassChime(1300);

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
      output = "Unfolding Cyber-Pastoral Prism into portfolio...";
      setTimeout(() => {
        setActiveModal(null);
        triggerPrismTransition();
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

  // Main Three.js Scene Setup (Cyber-Pastoral Prism Architecture)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE & ATMOSPHERE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#05070D");
    scene.fog = new THREE.FogExp2("#05070D", 0.035);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(isMobile ? 54 : 44, width / height, 0.1, 50);
    camera.position.set(0, 0.1, isMobile ? 3.8 : 3.2);
    camera.lookAt(0, 0, 0);
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
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING: Multi-Source Studio & Caustic Shimmer
    const ambientLight = new THREE.AmbientLight(0x1E2538, 1.4);
    scene.add(ambientLight);

    // Warm Dawn Key Light
    const dawnLight = new THREE.DirectionalLight(0xFFA34D, 2.6);
    dawnLight.position.set(3.5, 4.5, 2.5);
    dawnLight.castShadow = true;
    scene.add(dawnLight);

    // Electric Cyan Rim Light
    const rimLight = new THREE.DirectionalLight(0x60A5FA, 2.0);
    rimLight.position.set(-3.5, 3.0, -2.5);
    scene.add(rimLight);

    // Liquid Obsidian Floor Caustic Shimmer Light
    const causticLight = new THREE.PointLight(0xFFB255, 1.8, 3.5);
    causticLight.position.set(0, -1.2, 0.8);
    scene.add(causticLight);
    causticLightRef.current = causticLight;

    // 5. REFLECTIVE LIQUID OBSIDIAN FLOOR
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090E,
      roughness: 0.18,
      metalness: 0.82,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.35, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. MASTER PRISM GROUP (Floating Centered Centerpiece)
    const prismGroup = new THREE.Group();
    prismGroup.position.set(0, 0.05, 0);
    scene.add(prismGroup);
    prismGroupRef.current = prismGroup;

    // A. Outer Sculpted Optical Glass Shell
    const crystalGeo = new THREE.IcosahedronGeometry(1.22, 0);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xEEF5FF,
      transmission: 0.93,
      opacity: 0.98,
      transparent: true,
      roughness: 0.06,
      metalness: 0.08,
      ior: 1.54,
      thickness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.92,
      side: THREE.DoubleSide,
    });
    const glassCrystal = new THREE.Mesh(crystalGeo, glassMat);
    glassCrystal.castShadow = true;
    glassCrystal.receiveShadow = true;
    prismGroup.add(glassCrystal);

    // Chamfered Luminous Facet Edges
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xFFEDD5,
      transparent: true,
      opacity: 0.45,
    });
    const crystalEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    prismGroup.add(crystalEdges);

    // B. Inner Living Terrarium: Miniature Mountain Ridge
    const mountainGroup = new THREE.Group();
    mountainGroup.position.set(0, -0.42, 0);

    const basePlateGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.12, 7);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: 0x181C24,
      roughness: 0.7,
      metalness: 0.2,
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    mountainGroup.add(basePlate);

    // Stepped low-poly mountain peak
    const peakGeo = new THREE.ConeGeometry(0.38, 0.65, 5);
    const peakMat = new THREE.MeshStandardMaterial({
      color: 0x22362C,
      roughness: 0.55,
      flatShading: true,
    });
    const peak = new THREE.Mesh(peakGeo, peakMat);
    peak.position.set(-0.06, 0.35, 0);
    peak.rotation.y = 0.4;
    mountainGroup.add(peak);

    const subPeakGeo = new THREE.ConeGeometry(0.24, 0.45, 4);
    const subPeakMat = new THREE.MeshStandardMaterial({
      color: 0x2E4A3C,
      roughness: 0.6,
      flatShading: true,
    });
    const subPeak = new THREE.Mesh(subPeakGeo, subPeakMat);
    subPeak.position.set(0.22, 0.24, 0.08);
    mountainGroup.add(subPeak);

    // Stylized Bonsai Trunk & Foliage Cloud
    const trunkGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.35, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2D211C, roughness: 0.8 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(-0.16, 0.32, 0.15);
    trunk.rotation.z = -0.35;
    trunk.rotation.y = 0.5;
    mountainGroup.add(trunk);

    const foliageColors = [0xDC2626, 0xEA580C, 0xF59E0B];
    for (let f = 0; f < 4; f++) {
      const folGeo = new THREE.DodecahedronGeometry(0.09 - f * 0.012, 0);
      const folMat = new THREE.MeshStandardMaterial({
        color: foliageColors[f % foliageColors.length],
        roughness: 0.5,
        emissive: foliageColors[f % foliageColors.length],
        emissiveIntensity: 0.25,
      });
      const foliage = new THREE.Mesh(folGeo, folMat);
      foliage.position.set(-0.25 + f * 0.05, 0.48 + (f % 2) * 0.04, 0.18 + f * 0.03);
      mountainGroup.add(foliage);
    }
    prismGroup.add(mountainGroup);

    // C. Pulsing Amber Sun Orb & Internal Solar PointLight
    const sunOrbGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const sunOrbMat = new THREE.MeshBasicMaterial({ color: 0xFFA028 });
    const sunOrb = new THREE.Mesh(sunOrbGeo, sunOrbMat);
    sunOrb.position.set(0.05, 0.06, -0.05);
    prismGroup.add(sunOrb);
    coreOrbRef.current = sunOrb;

    const coreLight = new THREE.PointLight(0xFF7A00, 3.6, 2.8);
    coreLight.position.set(0.05, 0.06, -0.05);
    prismGroup.add(coreLight);
    coreLightRef.current = coreLight;

    // D. Zero-Gravity Golden Spores & Pollen Motes
    const sporeCount = 75;
    const sporeGeo = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    for (let i = 0; i < sporeCount * 3; i += 3) {
      const r = Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      sporePos[i] = r * Math.sin(phi) * Math.cos(theta);
      sporePos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      sporePos[i + 2] = r * Math.cos(phi);
    }
    sporeGeo.setAttribute("position", new THREE.BufferAttribute(sporePos, 3));
    const sporeMat = new THREE.PointsMaterial({
      color: 0xFFE082,
      size: 0.024,
      transparent: true,
      opacity: 0.75,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    prismGroup.add(spores);
    sporesRef.current = spores;

    // E. Floating Exterior Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.005, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    prismGroup.add(ring1);
    ring1Ref.current = ring1;

    const ring2Geo = new THREE.TorusGeometry(1.95, 0.004, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    prismGroup.add(ring2);
    ring2Ref.current = ring2;

    // 7. INTERACTIVE 3D HIT-BOXES
    const hitBoxes: THREE.Mesh[] = [];
    const hitBoxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

    // Center Core Hitbox: Triggers Genesis Unfold -> Portfolio
    const coreHitBox = new THREE.Mesh(new THREE.SphereGeometry(1.28, 16, 16), hitBoxMat);
    coreHitBox.position.set(0, 0.05, 0);
    coreHitBox.userData = {
      key: "prism_core",
      label: "Cyber-Pastoral Prism",
      sub: "Click Core to Unfold into Portfolio ↗",
      action: triggerPrismTransition,
    };
    scene.add(coreHitBox);
    hitBoxes.push(coreHitBox);

    // Left Anchor: Selected Projects
    const projectsHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.45), hitBoxMat);
    projectsHitBox.position.set(-1.65, 0.45, 0);
    projectsHitBox.userData = {
      key: "projects",
      label: "Selected Commissions",
      sub: "Microsecond Translation · Cricket Ops · DeepSeek Harness",
      action: () => {
        playGlassChime(1100);
        setActiveModal("projects");
      },
    };
    scene.add(projectsHitBox);
    hitBoxes.push(projectsHitBox);

    // Right Anchor: Rig Specs & Architecture
    const specsHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.45), hitBoxMat);
    specsHitBox.position.set(1.65, 0.45, 0);
    specsHitBox.userData = {
      key: "specs",
      label: "System Architecture",
      sub: "C++ · Rust · Concurrency · Optimal 28°C Thermals",
      action: () => {
        playGlassChime(1100);
        setActiveModal("specs");
      },
    };
    scene.add(specsHitBox);
    hitBoxes.push(specsHitBox);

    // Bottom-Left Anchor: Terrace Ambience & Sound
    const soundHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.45), hitBoxMat);
    soundHitBox.position.set(-1.55, -0.65, 0);
    soundHitBox.userData = {
      key: "sound",
      label: "Terrace Mountain Soundscape",
      sub: "Real-Time Web Audio Organic Mountain Breeze",
      action: () => {
        playGlassChime(1100);
        setActiveModal("hobbies");
      },
    };
    scene.add(soundHitBox);
    hitBoxes.push(soundHitBox);

    // Bottom-Right Anchor: Interactive CLI Terminal
    const terminalHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.45), hitBoxMat);
    terminalHitBox.position.set(1.55, -0.65, 0);
    terminalHitBox.userData = {
      key: "terminal",
      label: "Hacker CLI Terminal",
      sub: "Interactive Kernel Bash Shell",
      action: () => {
        playGlassChime(1100);
        setActiveModal("terminal");
      },
    };
    scene.add(terminalHitBox);
    hitBoxes.push(terminalHitBox);

    hitBoxesRef.current = hitBoxes;

    // 8. RAYCASTING & CURSOR INTERACTION
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

      if (intersects.length > 0 && !isTransitioning.current) {
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
      if (isTransitioning.current) return;
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

    // 9. ANIMATION LOOP (Refractive Tilting, Orbital Harmonics, Spore Drift)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Refractive Prism Spring-Damped Tilting
      if (!isTransitioning.current && prismGroupRef.current) {
        const targetRotY = mouseNorm.current.x * 0.45 + elapsed * 0.08;
        const targetRotX = -mouseNorm.current.y * 0.35 + Math.sin(elapsed * 0.6) * 0.05;

        prismGroupRef.current.rotation.y += (targetRotY - prismGroupRef.current.rotation.y) * 0.06;
        prismGroupRef.current.rotation.x += (targetRotX - prismGroupRef.current.rotation.x) * 0.06;
        prismGroupRef.current.position.y = 0.05 + Math.sin(elapsed * 1.2) * 0.04;
      }

      // Orbital Rings Rotation
      if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.25;
      if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.18;

      // Internal Sun Pulse
      if (coreOrbRef.current && coreLightRef.current && !isTransitioning.current) {
        const pulse = 1.0 + Math.sin(elapsed * 2.5) * 0.08;
        coreOrbRef.current.scale.set(pulse, pulse, pulse);
        coreLightRef.current.intensity = 3.6 + Math.sin(elapsed * 2.5) * 0.6;
      }

      // Zero-Gravity Spores Swirl
      if (sporesRef.current) {
        const pos = sporesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i + 1] += Math.sin(elapsed + i) * 0.0006;
        }
        sporesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Floor Caustic Light Tracks Mouse Cursor
      if (causticLightRef.current) {
        causticLightRef.current.position.x = mouseNorm.current.x * 2.2;
        causticLightRef.current.position.z = 0.8 - mouseNorm.current.y * 1.4;
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
      cameraRef.current.position.z = mobile ? 3.8 : 3.2;
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
  }, [triggerPrismTransition, playGlassChime]);

  return (
    <div className="relative w-full h-[100svh] bg-[#05070D] text-[#F8F5EE] overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Top Header Bar: Status Indicator */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 font-medium">SOHAM ROYCHOUDHURY · CYBER-PASTORAL PRISM</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/50">ATELIER // 2026</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-white/70">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Spatial Art Core Active</span>
        </div>
      </header>

      {/* Floating Hologram Tag (Strictly follows cursor when over interactive anchor) */}
      {hoveredItem && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: hoveredItem.x, top: hoveredItem.y - 12 }}
        >
          <div className="flex items-center gap-2.5 bg-[#0B0D14]/95 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-xl shadow-2xl">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              {hoveredItem.key === "prism_core" && <Sparkles className="w-4 h-4 text-amber-400" />}
              {hoveredItem.key === "specs" && <Cpu className="w-4 h-4 text-red-400" />}
              {hoveredItem.key === "projects" && <Gamepad2 className="w-4 h-4 text-purple-400" />}
              {hoveredItem.key === "sound" && <Headphones className="w-4 h-4 text-blue-400" />}
              {hoveredItem.key === "terminal" && <TerminalIcon className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">{hoveredItem.label}</p>
              <p className="text-[10px] text-white/70 font-mono leading-tight">{hoveredItem.sub}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Screen Waypoints: Left & Right Tactical Badges */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex items-center justify-between">
        {/* Left Badges */}
        <div className="space-y-4 pointer-events-auto">
          <button
            onClick={() => {
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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
              playGlassChime(1100);
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

          {/* Direct Genesis Unfold Enter Website CTA */}
          <button
            onClick={triggerPrismTransition}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF8D24] text-black font-semibold text-xs transition-all shadow-lg shadow-[#FF7A00]/25 shrink-0"
          >
            <span>Unfold Portfolio</span>
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
                    <p className="font-semibold text-white">Spatial WebGL & Shader Mechanics</p>
                    <p className="text-white/60 text-[11px]">Custom refraction shaders, physical glass IOR, and 120 FPS render loops.</p>
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
                <span className="text-xs text-white/60 ml-2">soham@prism-kernel: ~ (bash)</span>
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
