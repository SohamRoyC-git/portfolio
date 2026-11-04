"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
    { cmd: "system.init", out: "Soham Battlestation 3D Kernel · Photogrammetry Mesh Active" },
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

  // Seated Chair POV Target Coordinates
  const mouseNorm = useRef({ x: 0, y: 0 });
  const cameraBasePos = useRef(new THREE.Vector3(-0.10, 0.65, 0.58));
  const cameraLookTarget = useRef(new THREE.Vector3(-0.11, 0.58, -0.05));
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
    // Monitor screen 3D center coordinates: (x: -0.112, y: 0.725, z: -0.04)
    const targetPos = new THREE.Vector3(-0.112, 0.725, 0.18);
    const targetLook = new THREE.Vector3(-0.112, 0.725, -0.04);

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

  // Main Three.js Scene Setup (Seated Chair POV with Polycam Mesh + Live Interactive Overlays)
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
    scene.fog = new THREE.FogExp2("#07080A", 0.08);

    // 2. CAMERA (Seated Chair POV: right in front of the keyboard and monitor!)
    const camera = new THREE.PerspectiveCamera(isMobile ? 58 : 50, width / height, 0.05, 30);
    const initialPos = isMobile
      ? new THREE.Vector3(-0.10, 0.72, 0.68)
      : new THREE.Vector3(-0.10, 0.65, 0.58);
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
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING: Multi-Source Studio
    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.35);
    scene.add(ambientLight);

    // Soft Studio Warm Key Light (matches real room ceiling light)
    const keyLight = new THREE.DirectionalLight(0xFFEDD5, 2.4);
    keyLight.position.set(2.0, 4.0, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Cool Rim Light (edge highlights on PC tower)
    const rimLight = new THREE.DirectionalLight(0x93C5FD, 1.2);
    rimLight.position.set(-2.5, 3.0, -1.0);
    scene.add(rimLight);

    // Emissive BenQ Monitor Glow Light (Bounces blue-white light downward onto keyboard)
    const screenGlow = new THREE.PointLight(0x60A5FA, 1.8, 1.4);
    screenGlow.position.set(-0.112, 0.725, 0.12);
    scene.add(screenGlow);
    screenGlowLightRef.current = screenGlow;

    // Internal Zebronics ARGB Fan Glow Light (Pulsing warm magenta/red)
    const pcFanLight = new THREE.PointLight(0xFF2D55, 2.4, 1.2);
    pcFanLight.position.set(0.38, 0.65, 0.02);
    scene.add(pcFanLight);

    // 5. ARCHITECTURAL STUDIO BACKDROP & FLOOR (Cleans up raw scan boundary edges)
    // Dark mahogany desk extension underneath
    const deskExtension = new THREE.Mesh(
      new THREE.PlaneGeometry(5.0, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.6 })
    );
    deskExtension.rotation.x = -Math.PI / 2;
    deskExtension.position.set(0, 0.385, 0);
    deskExtension.receiveShadow = true;
    scene.add(deskExtension);

    // Warm Terracotta Wall behind the desk
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x82382D, roughness: 0.85 })
    );
    backWall.position.set(0, 1.0, -0.45);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const hitBoxes: THREE.Mesh[] = [];
    const hitBoxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

    // 6. LOAD USER'S REAL POLYCAM GLTF 3D SCAN
    const loader = new GLTFLoader();
    loader.load(
      "/models/soham_real_desk.glb",
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
      },
      undefined,
      (err) => {
        console.warn("Polycam model load error:", err);
      }
    );

    // 7. HIGH-DEFINITION INTERACTIVE 3D SCREEN OVERLAY (Crisp Live Interface)
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
      sCtx.fillStyle = "rgba(255, 122, 0, 0.4)";
      sCtx.beginPath();
      sCtx.ellipse(512, 280, 380, 100, 0, 0, Math.PI * 2);
      sCtx.fill();

      // Top Status Bar
      sCtx.fillStyle = "rgba(255,255,255,0.7)";
      sCtx.font = "bold 20px monospace";
      sCtx.fillText("SOHAM ROYCHOUDHURY · ATELIER // 2026", 60, 60);
      sCtx.fillText("SYS: RUNNING · PORT 3000", 700, 60);

      // Main Typography
      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 52px sans-serif";
      sCtx.fillText("CYBER-PASTORAL TERRACE", 60, 240);

      sCtx.fillStyle = "rgba(255,255,255,0.85)";
      sCtx.font = "24px sans-serif";
      sCtx.fillText("AI/ML Engineer · Systems · Frontend Architect", 60, 290);

      // Enter Button Pill
      sCtx.fillStyle = "rgba(255, 122, 0, 0.9)";
      sCtx.beginPath();
      sCtx.roundRect(60, 370, 420, 68, 34);
      sCtx.fill();

      sCtx.fillStyle = "#000000";
      sCtx.font = "bold 24px monospace";
      sCtx.fillText("CLICK MONITOR TO ENTER ↗", 95, 412);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTextureRef.current = screenTexture;

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.52, 0.30),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    // Positioned right on the front face of the BenQ monitor
    screenMesh.position.set(-0.112, 0.725, -0.04);
    scene.add(screenMesh);

    // Screen Hit-Box
    const monitorHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.12), hitBoxMat);
    monitorHitBox.position.set(-0.112, 0.725, -0.02);
    monitorHitBox.userData = {
      key: "monitor",
      label: "BenQ Widescreen Monitor",
      sub: "Master Portal · Click to Fly Into Website ↗",
      action: trigger3DCameraFlight,
    };
    scene.add(monitorHitBox);
    hitBoxes.push(monitorHitBox);

    // 8. ZEBRONICS PC TOWER: SPINNING ARGB FAN & HIT-BOX
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0.38, 0.65, 0.02);
    const fanRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.008, 16, 32), new THREE.MeshBasicMaterial({ color: 0xFF2D55 }));
    fanGroup.add(fanRing);

    const bladeGeo = new THREE.BoxGeometry(0.016, 0.05, 0.004);
    const bladeMat = new THREE.MeshBasicMaterial({ color: 0xFF5588 });
    for (let b = 0; b < 7; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (b / 7) * Math.PI * 2;
      blade.position.set(Math.cos(blade.rotation.z) * 0.03, Math.sin(blade.rotation.z) * 0.03, 0);
      fanGroup.add(blade);
    }
    fanMeshRef.current = fanGroup;
    scene.add(fanGroup);

    // PC Hit-Box
    const pcHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.55), hitBoxMat);
    pcHitBox.position.set(0.40, 0.65, 0.02);
    pcHitBox.userData = {
      key: "pc_tower",
      label: "Zebronics Gaming Rig",
      sub: "Compute Hardware & AI Tech Stack",
      action: () => {
        playClickSound(950);
        setActiveModal("specs");
      },
    };
    scene.add(pcHitBox);
    hitBoxes.push(pcHitBox);

    // 9. COMPACT TKL KEYBOARD HIT-BOX
    const kbHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.22), hitBoxMat);
    kbHitBox.position.set(-0.11, 0.42, 0.22);
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

    // 10. GAMEPAD HIT-BOX (On Wooden Riser Left of Monitor)
    const gpHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.18), hitBoxMat);
    gpHitBox.position.set(-0.35, 0.53, -0.10);
    gpHitBox.userData = {
      key: "gamepad",
      label: "Gamepad Controller",
      sub: "Selected Commissions & Projects",
      action: () => {
        playClickSound(950);
        setActiveModal("projects");
      },
    };
    scene.add(gpHitBox);
    hitBoxes.push(gpHitBox);

    // 11. HEADSET HIT-BOX (Left Front Desk)
    const hsHitBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.26), hitBoxMat);
    hsHitBox.position.set(-0.45, 0.46, 0.22);
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

    // 12. FLOATING ATMOSPHERIC PARTICLES
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 2.5;
      particlePos[i + 1] = Math.random() * 1.5 + 0.3;
      particlePos[i + 2] = (Math.random() - 0.5) * 1.8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xFFE5B4, size: 0.015, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    hitBoxesRef.current = hitBoxes;

    // 13. RAYCASTING & INTERACTION
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

    // 14. ANIMATION LOOP (Damped Head Tracking Parallax & Fan Rotation)
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

      // Seated Chair Head-Tracking Parallax (Subtle natural head tilt!)
      if (!isFlyingIntoScreen.current && cameraRef.current) {
        const targetX = cameraBasePos.current.x + mouseNorm.current.x * 0.12;
        const targetY = cameraBasePos.current.y + mouseNorm.current.y * 0.08;
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
      cameraRef.current.fov = mobile ? 58 : 50;
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
          <span>Real Photogrammetry 3D Active</span>
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
