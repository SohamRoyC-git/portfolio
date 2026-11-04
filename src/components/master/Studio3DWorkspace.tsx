"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";
import {
  X,
  ArrowRight,
  BookOpen,
  Coffee,
  Laptop,
  Terminal as TerminalIcon,
  Lightbulb,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export interface Studio3DWorkspaceProps {
  onEnterPortfolio: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  isLocked?: boolean;
}

type CameraFocusMode = "overview" | "laptop" | "books" | "mug" | "lamp" | "speaker" | "keyboard";

export const Studio3DWorkspace = memo(function Studio3DWorkspace({
  onEnterPortfolio,
  onNavigateToSection,
  isLocked = true,
}: Studio3DWorkspaceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [focusMode, setFocusMode] = useState<CameraFocusMode>("overview");
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"projects" | "hobbies" | "terminal" | null>(null);

  // Desk state toggles
  const [isLampOn, setIsLampOn] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: "whoami", out: "Soham Roychoudhury — AI/ML Engineer & Frontend Architect" },
    { cmd: "status", out: "Atelier systems active. Studio lighting calibrated." },
  ]);

  // Cursor coordinates
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hitBoxesRef = useRef<THREE.Mesh[]>([]);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const lampLightRef = useRef<THREE.SpotLight | null>(null);
  const lampBulbMeshRef = useRef<THREE.Mesh | null>(null);
  const speakerLedRef = useRef<THREE.Mesh | null>(null);

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
        // Fade out
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
          }, 400);
        }
        setIsAudioPlaying(false);
      } else {
        // Synthesize 5 seconds looped organic pink/white mountain wind
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

        // Bandpass filter for organic wind resonance
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

  // Camera Target States (Dark Obsidian Studio)
  const cameraTargets = useRef({
    overview: {
      pos: new THREE.Vector3(0, 1.55, 3.2),
      lookAt: new THREE.Vector3(0, 0.45, 0),
    },
    overviewMobile: {
      pos: new THREE.Vector3(0, 1.85, 4.4),
      lookAt: new THREE.Vector3(0, 0.45, 0),
    },
    laptop: {
      pos: new THREE.Vector3(0, 0.68, 1.1),
      lookAt: new THREE.Vector3(0, 0.68, 0.05),
    },
    books: {
      pos: new THREE.Vector3(-0.95, 0.68, 1.15),
      lookAt: new THREE.Vector3(-0.95, 0.48, 0.1),
    },
    mug: {
      pos: new THREE.Vector3(0.92, 0.65, 1.15),
      lookAt: new THREE.Vector3(0.92, 0.46, 0.1),
    },
    lamp: {
      pos: new THREE.Vector3(-1.3, 0.75, 1.15),
      lookAt: new THREE.Vector3(-1.3, 0.6, -0.2),
    },
    speaker: {
      pos: new THREE.Vector3(1.25, 0.72, 1.15),
      lookAt: new THREE.Vector3(1.25, 0.55, -0.2),
    },
    keyboard: {
      pos: new THREE.Vector3(0, 0.78, 0.95),
      lookAt: new THREE.Vector3(0, 0.42, 0.35),
    },
  });

  const currentLookAt = useRef(new THREE.Vector3(0, 0.45, 0));

  // Camera Transition
  const transitionCameraTo = useCallback((targetMode: CameraFocusMode) => {
    if (!cameraRef.current) return;
    const isMobile = window.innerWidth / window.innerHeight < 1.0;
    const target =
      targetMode === "overview" && isMobile
        ? cameraTargets.current.overviewMobile
        : cameraTargets.current[targetMode];

    setFocusMode(targetMode);

    gsap.to(cameraRef.current.position, {
      x: target.pos.x,
      y: target.pos.y,
      z: target.pos.z,
      duration: 1.3,
      ease: "power3.inOut",
    });

    gsap.to(currentLookAt.current, {
      x: target.lookAt.x,
      y: target.lookAt.y,
      z: target.lookAt.z,
      duration: 1.3,
      ease: "power3.inOut",
    });
  }, []);

  // Toggle Lamp Lighting
  const handleToggleLamp = useCallback(() => {
    playClickSound(1200);
    setIsLampOn((prev) => {
      const next = !prev;
      if (lampLightRef.current) {
        gsap.to(lampLightRef.current, {
          intensity: next ? 4.2 : 0,
          duration: 0.25,
          ease: "power2.out",
        });
      }
      if (lampBulbMeshRef.current) {
        const mat = lampBulbMeshRef.current.material as THREE.MeshStandardMaterial;
        gsap.to(mat, {
          emissiveIntensity: next ? 2.5 : 0,
          duration: 0.25,
        });
      }
      return next;
    });
  }, [playClickSound]);

  // Main Three.js Scene Setup (Dark Obsidian Studio)
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

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(isMobile ? 52 : 44, width / height, 0.1, 40);
    const initialPos = isMobile
      ? cameraTargets.current.overviewMobile.pos
      : cameraTargets.current.overview.pos;
    camera.position.copy(initialPos);
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

    // 4. LIGHTING (Cinematic Dark Obsidian Studio with Rich Depth)
    // Ambient Moody Base with soft blue-slate depth
    const ambientLight = new THREE.AmbientLight(0x282E3C, 1.25);
    scene.add(ambientLight);

    // Top Studio Softbox (softly lights the desk surface and slat geometry)
    const topSoftbox = new THREE.DirectionalLight(0xE0E8F8, 1.1);
    topSoftbox.position.set(0, 6, 1);
    scene.add(topSoftbox);

    // Studio Key Light (Cool Charcoal Moonlight / Top-Left Key)
    const keyLight = new THREE.DirectionalLight(0xDCE8FF, 2.4);
    keyLight.position.set(-4.5, 5.5, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Rim Fill Light (Deep Graphite Blue highlighting right side)
    const rimLight = new THREE.DirectionalLight(0x557095, 0.9);
    rimLight.position.set(4.5, 3.5, -0.5);
    scene.add(rimLight);

    // Screen Luminous Glow (Blue-White Screen Bounce onto Laptop Base)
    const screenGlow = new THREE.PointLight(0x8AB4F8, 0.85, 2.4);
    screenGlow.position.set(0, 0.72, 0.22);
    scene.add(screenGlow);

    // Desk Lamp SpotLight (Warm Tungsten Spotlight)
    const lampSpot = new THREE.SpotLight(0xFFA545, 4.8);
    lampSpot.position.set(-1.3, 0.88, -0.15);
    lampSpot.target.position.set(-0.5, 0.38, 0.1);
    lampSpot.angle = 0.8;
    lampSpot.penumbra = 0.85;
    lampSpot.decay = 1.8;
    lampSpot.distance = 4;
    lampSpot.castShadow = true;
    lampSpot.shadow.bias = -0.0005;
    scene.add(lampSpot);
    scene.add(lampSpot.target);
    lampLightRef.current = lampSpot;

    // 5. MATERIALS (Dark Obsidian Luxury Palette)
    // Dark Charcoal Smoked Walnut Desk with subtle metallic chamfer
    const obsidianDeskMaterial = new THREE.MeshStandardMaterial({
      color: 0x22242B,
      roughness: 0.32,
      metalness: 0.35,
    });

    // Anodized Space Black Aluminum (MacBook, Lamp)
    const spaceBlackAluminum = new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.28,
      metalness: 0.85,
    });

    // Dark Charcoal Acoustic Slats
    const acousticSlatMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1C22,
      roughness: 0.55,
      metalness: 0.2,
    });

    // Matte Ceramic Charcoal (Mug)
    const charcoalCeramicMaterial = new THREE.MeshStandardMaterial({
      color: 0x1F2128,
      roughness: 0.25,
      metalness: 0.1,
    });

    // Invisible Hit-Box Material
    const hitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    const hitBoxes: THREE.Mesh[] = [];

    // 6. ARCHITECTURAL ROOM
    // Acoustic Vertical Slatted Wall (Dark Obsidian Aesthetic)
    const wallGroup = new THREE.Group();
    const wallBacking = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x0A0B0E, roughness: 0.95 })
    );
    wallBacking.position.set(0, 2.2, -1.8);
    wallGroup.add(wallBacking);

    const slatGeo = new RoundedBoxGeometry(0.045, 6.0, 0.03, 2, 0.006);
    for (let x = -5.0; x <= 5.0; x += 0.14) {
      const slat = new THREE.Mesh(slatGeo, acousticSlatMaterial);
      slat.position.set(x, 2.2, -1.78);
      slat.receiveShadow = true;
      wallGroup.add(slat);
    }
    scene.add(wallGroup);

    // Left Architectural Window Frame (Studio Light Portal)
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1D212A, roughness: 0.3 })
    );
    windowFrame.position.set(-4.5, 2.5, 0.5);
    scene.add(windowFrame);

    // The Master Obsidian Desk
    const deskTop = new THREE.Mesh(
      new RoundedBoxGeometry(3.6, 0.08, 1.8, 4, 0.02),
      obsidianDeskMaterial
    );
    deskTop.position.set(0, 0.38, 0);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    scene.add(deskTop);

    // Chamfered Metal Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 16);
    const legPositions = [
      [-1.65, -0.22, -0.75],
      [1.65, -0.22, -0.75],
      [-1.65, -0.22, 0.75],
      [1.65, -0.22, 0.75],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, spaceBlackAluminum);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // 7. OBJECT 1: SPACE BLACK MACBOOK PRO
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.42, 0.05);

    const laptopBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.016, 0.38, 4, 0.006),
      spaceBlackAluminum
    );
    laptopBase.castShadow = true;
    laptopBase.receiveShadow = true;
    laptopGroup.add(laptopBase);

    const keyboardWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.002, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0B0C0E, roughness: 0.9 })
    );
    keyboardWell.position.set(0, 0.009, -0.04);
    laptopGroup.add(keyboardWell);

    const trackpad = new THREE.Mesh(
      new RoundedBoxGeometry(0.2, 0.002, 0.12, 2, 0.004),
      new THREE.MeshStandardMaterial({ color: 0x16181C, roughness: 0.35, metalness: 0.7 })
    );
    trackpad.position.set(0, 0.009, 0.11);
    laptopGroup.add(trackpad);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.008, -0.185);
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-16);

    const screenLid = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.38, 0.012, 4, 0.005),
      spaceBlackAluminum
    );
    screenLid.position.set(0, 0.19, 0);
    screenLid.castShadow = true;
    lidGroup.add(screenLid);

    // Active Website Screen Texture
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    const sCtx = screenCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createLinearGradient(0, 0, 0, 680);
      grad.addColorStop(0, "#0E1422");
      grad.addColorStop(0.5, "#1B2436");
      grad.addColorStop(1, "#07090E");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 680);

      sCtx.fillStyle = "rgba(255,255,255,0.45)";
      sCtx.font = "bold 20px monospace";
      sCtx.fillText("SOHAM ROYCHOUDHURY · ATELIER // 2026", 80, 100);

      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 54px sans-serif";
      sCtx.fillText("CYBER-PASTORAL TERRACE", 80, 240);

      sCtx.fillStyle = "rgba(255,255,255,0.65)";
      sCtx.font = "24px sans-serif";
      sCtx.fillText("Artificial Intelligence · Frontend Architect · Systems", 80, 290);

      sCtx.fillStyle = "rgba(255,255,255,0.18)";
      sCtx.beginPath();
      sCtx.roundRect(80, 360, 330, 60, 30);
      sCtx.fill();
      sCtx.strokeStyle = "rgba(255,255,255,0.45)";
      sCtx.lineWidth = 2;
      sCtx.stroke();

      sCtx.fillStyle = "#FFFFFF";
      sCtx.font = "bold 19px monospace";
      sCtx.fillText("CLICK TO ENTER WEBSITE ↗", 110, 398);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;

    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.15,
      metalness: 0.05,
      emissive: 0xFFFFFF,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.42,
    });

    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.35), screenMaterial);
    screenMesh.position.set(0, 0.19, 0.007);
    lidGroup.add(screenMesh);
    laptopGroup.add(lidGroup);
    scene.add(laptopGroup);

    // Dedicated Laptop HitBox
    const hitBoxLaptop = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.45), hitBoxMaterial);
    hitBoxLaptop.position.set(0, 0.58, 0.05);
    hitBoxLaptop.userData = { id: "laptop", label: "ENTER WEBSITE 💻" };
    scene.add(hitBoxLaptop);
    hitBoxes.push(hitBoxLaptop);

    // 8. OBJECT 2: STACK OF BOOKS (PROJECTS)
    const booksGroup = new THREE.Group();
    booksGroup.position.set(-0.95, 0.42, 0.1);

    const book1 = new THREE.Mesh(
      new RoundedBoxGeometry(0.34, 0.058, 0.46, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x853222, roughness: 0.55 })
    );
    book1.position.set(0, 0.029, 0);
    book1.rotation.y = THREE.MathUtils.degToRad(8);
    book1.castShadow = true;
    book1.receiveShadow = true;
    booksGroup.add(book1);

    const book2 = new THREE.Mesh(
      new RoundedBoxGeometry(0.32, 0.05, 0.44, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x2A3E33, roughness: 0.65 })
    );
    book2.position.set(0.02, 0.082, 0.01);
    book2.rotation.y = THREE.MathUtils.degToRad(-4);
    book2.castShadow = true;
    book2.receiveShadow = true;
    booksGroup.add(book2);

    const book3 = new THREE.Mesh(
      new RoundedBoxGeometry(0.3, 0.044, 0.41, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x131518, roughness: 0.4, metalness: 0.3 })
    );
    book3.position.set(-0.01, 0.128, -0.01);
    book3.rotation.y = THREE.MathUtils.degToRad(12);
    book3.castShadow = true;
    book3.receiveShadow = true;
    booksGroup.add(book3);
    scene.add(booksGroup);

    // Dedicated Books HitBox
    const hitBoxBooks = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.5), hitBoxMaterial);
    hitBoxBooks.position.set(-0.95, 0.52, 0.1);
    hitBoxBooks.userData = { id: "books", label: "VIEW PROJECTS 📚" };
    scene.add(hitBoxBooks);
    hitBoxes.push(hitBoxBooks);

    // 9. OBJECT 3: CHARCOAL CERAMIC MUG (HOBBIES)
    const mugGroup = new THREE.Group();
    mugGroup.position.set(0.92, 0.42, 0.1);

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.078, 0.068, 0.16, 32),
      charcoalCeramicMaterial
    );
    mugBody.position.set(0, 0.08, 0);
    mugBody.castShadow = true;
    mugBody.receiveShadow = true;
    mugGroup.add(mugBody);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.048, 0.013, 16, 24, Math.PI * 1.1),
      charcoalCeramicMaterial
    );
    handle.position.set(0.078, 0.08, 0);
    handle.rotation.z = Math.PI / 2;
    handle.castShadow = true;
    mugGroup.add(handle);

    const coffeeLiquid = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 32),
      new THREE.MeshStandardMaterial({ color: 0x140B07, roughness: 0.1, metalness: 0.1 })
    );
    coffeeLiquid.position.set(0, 0.152, 0);
    coffeeLiquid.rotation.x = -Math.PI / 2;
    mugGroup.add(coffeeLiquid);

    // Steam particles (Strictly visual, never raycasted!)
    const steamGeo = new THREE.BufferGeometry();
    const steamCount = 45;
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.05;
      steamPos[i * 3 + 1] = 0.16 + Math.random() * 0.28;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));

    const steamMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.015,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    mugGroup.add(steamParticles);
    steamParticlesRef.current = steamParticles;
    scene.add(mugGroup);

    // Dedicated Mug HitBox (Tight cylinder bounds so it never triggers outside the mug!)
    const hitBoxMug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16), hitBoxMaterial);
    hitBoxMug.position.set(0.92, 0.52, 0.1);
    hitBoxMug.userData = { id: "mug", label: "HOBBIES & LIFE ☕" };
    scene.add(hitBoxMug);
    hitBoxes.push(hitBoxMug);

    // 10. OBJECT 4: ARCHITECTURAL DESK LAMP (DAY / WARM NIGHT LIGHTING TOGGLE)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-1.35, 0.42, -0.2);

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.1, 0.02, 32),
      spaceBlackAluminum
    );
    lampBase.position.set(0, 0.01, 0);
    lampBase.castShadow = true;
    lampGroup.add(lampBase);

    // Curved stem
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.45, 16),
      spaceBlackAluminum
    );
    lampStem.position.set(0, 0.24, 0);
    lampGroup.add(lampStem);

    // Angled lamp head shade
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.12, 24, 1, true),
      spaceBlackAluminum
    );
    lampShade.position.set(0.05, 0.46, 0.05);
    lampShade.rotation.x = Math.PI * 0.7;
    lampShade.rotation.z = -Math.PI * 0.15;
    lampShade.castShadow = true;
    lampGroup.add(lampShade);

    // Glowing bulb mesh
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xFFA545,
      emissive: 0xFFA545,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 16), bulbMat);
    bulbMesh.position.set(0.05, 0.44, 0.05);
    lampGroup.add(bulbMesh);
    lampBulbMeshRef.current = bulbMesh;
    scene.add(lampGroup);

    // Dedicated Lamp HitBox
    const hitBoxLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.58, 16), hitBoxMaterial);
    hitBoxLamp.position.set(-1.35, 0.65, -0.2);
    hitBoxLamp.userData = { id: "lamp", label: "TOGGLE LIGHTING 💡" };
    scene.add(hitBoxLamp);
    hitBoxes.push(hitBoxLamp);

    // 11. OBJECT 5: AUDIO SPEAKER / AMBIENT TERRACE DECK
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(1.3, 0.42, -0.2);

    const speakerCabinet = new THREE.Mesh(
      new RoundedBoxGeometry(0.22, 0.18, 0.2, 3, 0.01),
      spaceBlackAluminum
    );
    speakerCabinet.position.set(0, 0.09, 0);
    speakerCabinet.castShadow = true;
    speakerGroup.add(speakerCabinet);

    // Bronze audio grille
    const grille = new THREE.Mesh(
      new THREE.CircleGeometry(0.065, 32),
      new THREE.MeshStandardMaterial({ color: 0x8C6B45, roughness: 0.4, metalness: 0.6 })
    );
    grille.position.set(0, 0.09, 0.101);
    speakerGroup.add(grille);

    // Glowing LED indicator
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x10B981,
      emissiveIntensity: 1.5,
    });
    const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 12), ledMat);
    ledMesh.position.set(0.08, 0.15, 0.102);
    speakerGroup.add(ledMesh);
    speakerLedRef.current = ledMesh;
    scene.add(speakerGroup);

    // Dedicated Speaker HitBox
    const hitBoxSpeaker = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.28), hitBoxMaterial);
    hitBoxSpeaker.position.set(1.3, 0.52, -0.2);
    hitBoxSpeaker.userData = { id: "speaker", label: "TERRACE SOUNDSCAPE 🔊" };
    scene.add(hitBoxSpeaker);
    hitBoxes.push(hitBoxSpeaker);

    // 12. OBJECT 6: SPACE GRAY KEYBOARD & MOUSE
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, 0.42, 0.45);

    const keyboardBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.48, 0.012, 0.16, 3, 0.005),
      spaceBlackAluminum
    );
    keyboardBase.castShadow = true;
    keyboardGroup.add(keyboardBase);

    const keysPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.003, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0A0B0E, roughness: 0.9 })
    );
    keysPlate.position.set(0, 0.008, 0);
    keyboardGroup.add(keysPlate);
    scene.add(keyboardGroup);

    // Dedicated Keyboard HitBox
    const hitBoxKeyboard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.2), hitBoxMaterial);
    hitBoxKeyboard.position.set(0, 0.44, 0.45);
    hitBoxKeyboard.userData = { id: "keyboard", label: "TERMINAL CONSOLE ⌨️" };
    scene.add(hitBoxKeyboard);
    hitBoxes.push(hitBoxKeyboard);

    // Magic Mouse
    const mouse = new THREE.Mesh(
      new RoundedBoxGeometry(0.08, 0.02, 0.13, 4, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x1A1C20, roughness: 0.25, metalness: 0.6 })
    );
    mouse.position.set(0.48, 0.42, 0.45);
    mouse.castShadow = true;
    scene.add(mouse);

    hitBoxesRef.current = hitBoxes;

    // 13. PRECISE RAYCASTER (Checked against dedicated hitBoxes only!)
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mousePos.set(x, y);

      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);

      if (focusMode === "overview" && cameraRef.current) {
        const targetX = x * 0.14;
        const targetY = (isMobile ? 1.85 : 1.55) + y * 0.08;
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
      }
    };

    const handlePointerLeave = () => {
      mousePos.set(-999, -999);
      setCursorVisible(false);
      setHoveredObject(null);
    };

    const handleClick = () => {
      if (!sceneRef.current || !cameraRef.current) return;

      raycaster.setFromCamera(mousePos, cameraRef.current);
      const intersects = raycaster.intersectObjects(hitBoxesRef.current, false);

      if (intersects.length > 0) {
        const actionId = intersects[0].object.userData?.id;
        if (!actionId) return;

        playClickSound(950);

        if (actionId === "laptop") {
          transitionCameraTo("laptop");
          setTimeout(() => {
            onEnterPortfolio();
          }, 1200);
        } else if (actionId === "books") {
          transitionCameraTo("books");
          setActiveModal("projects");
        } else if (actionId === "mug") {
          transitionCameraTo("mug");
          setActiveModal("hobbies");
        } else if (actionId === "lamp") {
          handleToggleLamp();
        } else if (actionId === "speaker") {
          toggleAmbientSound();
        } else if (actionId === "keyboard") {
          transitionCameraTo("keyboard");
          setActiveModal("terminal");
        }
      }
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("click", handleClick);

    // 14. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle steam animation
      if (steamParticlesRef.current) {
        const positions = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          positions[i * 3 + 1] += 0.0016;
          positions[i * 3] += Math.sin(elapsed * 2.2 + i) * 0.00025;
          if (positions[i * 3 + 1] > 0.44) {
            positions[i * 3 + 1] = 0.16;
            positions[i * 3] = (Math.random() - 0.5) * 0.05;
          }
        }
        steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Raycast hover check against strict hit-boxes
      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(hitBoxesRef.current, false);

      if (intersects.length > 0) {
        const label = intersects[0].object.userData?.label;
        if (label) {
          setHoveredObject(label);
          if (container) container.style.cursor = "pointer";
        }
      } else {
        setHoveredObject(null);
        if (container) container.style.cursor = "default";
      }

      camera.lookAt(currentLookAt.current);
      renderer.render(scene, camera);
    };

    animate();

    // 15. RESIZE LISTENER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w / h < 1.0;
      camera.fov = mobile ? 52 : 44;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("click", handleClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [playClickSound, transitionCameraTo, onEnterPortfolio, focusMode, handleToggleLamp, toggleAmbientSound]);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    transitionCameraTo("overview");
  }, [transitionCameraTo]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeModal) {
          handleCloseModal();
        } else if (focusMode !== "overview") {
          transitionCameraTo("overview");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, focusMode, handleCloseModal, transitionCameraTo]);

  // Terminal Command Executor
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let out = "";
    if (cmd === "help") {
      out = "Available commands: whoami, skills, projects, hobbies, clear, contact, exit";
    } else if (cmd === "whoami") {
      out = "Soham Roychoudhury — AI/ML Engineer & Frontend Architect (NSEC 2024-2028)";
    } else if (cmd === "skills") {
      out = "Core: Python, PyTorch, TypeScript, Next.js, Three.js, WebGL, GSAP, Tailwind v4";
    } else if (cmd === "projects") {
      out = "Selected: Forge Automotive Digital Twin, Autonomous Agent Fabric, Cyber-Pastoral Terrace";
    } else if (cmd === "hobbies") {
      out = "Rituals: Specialty V60/AeroPress brewing, 35mm rangefinders, ambient tape synths, bonsai botany";
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "exit") {
      handleCloseModal();
      return;
    } else {
      out = `Command not recognized: "${cmd}". Type "help" for active commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: terminalInput, out }]);
    setTerminalInput("");
  };

  return (
    <div
      className="relative w-full h-[100svh] overflow-hidden select-none bg-[#08090C]"
      onWheel={(e) => {
        if (isLocked) {
          e.stopPropagation();
        }
      }}
      onTouchMove={(e) => {
        if (isLocked) {
          e.stopPropagation();
        }
      }}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Dynamic Floating 3D Cursor Badge */}
      {cursorVisible && hoveredObject && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-12 transition-transform duration-75 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/90 backdrop-blur-md text-white font-mono text-[9px] tracking-[0.2em] uppercase shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
            <span>{hoveredObject}</span>
          </div>
        </div>
      )}

      {/* Top Floating Return Action (Appears when zoomed into an object) */}
      {focusMode !== "overview" && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in duration-300">
          <button
            onClick={() => {
              handleCloseModal();
              transitionCameraTo("overview");
            }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-black/85 hover:bg-white hover:text-black text-white text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer"
          >
            <span>← Back to Room Overview</span>
          </button>
        </div>
      )}

      {/* Bottom Interactive Spatial HUD & Navigation Pill Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-full border border-white/15 bg-black/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-[95vw] overflow-x-auto">
        {/* Laptop Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound(950);
            transitionCameraTo("laptop");
            setTimeout(onEnterPortfolio, 1200);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>💻</span>
          <span className="font-semibold text-white">Laptop</span>
          <span className="text-white/40 hidden sm:inline">(Portfolio)</span>
        </button>

        {/* Books Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound(950);
            transitionCameraTo("books");
            setActiveModal("projects");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>📚</span>
          <span className="font-semibold text-white">Books</span>
          <span className="text-white/40 hidden sm:inline">(Projects)</span>
        </button>

        {/* Mug Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound(950);
            transitionCameraTo("mug");
            setActiveModal("hobbies");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>☕</span>
          <span className="font-semibold text-white">Mug</span>
          <span className="text-white/40 hidden sm:inline">(Hobbies)</span>
        </button>

        {/* Lamp Toggle Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleLamp();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[9px] sm:text-[10px] font-mono tracking-wider ${
            isLampOn ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "hover:bg-white/15 text-white/60"
          }`}
          title="Toggle Warm Desk Lamp"
        >
          <Lightbulb className="w-3 h-3 text-current" />
          <span className="hidden sm:inline">{isLampOn ? "Lamp: On" : "Lamp: Off"}</span>
        </button>

        {/* Audio Speaker Toggle Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleAmbientSound();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[9px] sm:text-[10px] font-mono tracking-wider ${
            isAudioPlaying ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "hover:bg-white/15 text-white/60"
          }`}
          title="Toggle Ambient Mountain Soundscape"
        >
          {isAudioPlaying ? <Volume2 className="w-3 h-3 text-current animate-pulse" /> : <VolumeX className="w-3 h-3 text-current" />}
          <span className="hidden sm:inline">{isAudioPlaying ? "Audio: On" : "Audio"}</span>
        </button>

        {/* Terminal Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound(950);
            transitionCameraTo("keyboard");
            setActiveModal("terminal");
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
          title="Open Atelier Terminal"
        >
          <TerminalIcon className="w-3 h-3 text-current" />
          <span className="hidden sm:inline">CLI</span>
        </button>

        {/* Enter Full Website Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound(1000);
            transitionCameraTo("laptop");
            setTimeout(onEnterPortfolio, 1200);
          }}
          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-white text-black hover:bg-[#FF7A00] hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-semibold transition-colors whitespace-nowrap cursor-pointer ml-1 shadow-lg"
        >
          <span>Enter Website ↗</span>
        </button>
      </div>

      {/* ----------------- MODAL 1: PROJECTS SHOWCASE (WHEN BOOKS ARE CLICKED) ----------------- */}
      {activeModal === "projects" && (
        <div
          onClick={handleCloseModal}
          className="absolute inset-0 z-40 flex items-center justify-end p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0F1116]/95 border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#FF7A00]" />
                <h3 className="font-mono text-xs tracking-[0.22em] uppercase text-white/90">
                  SELECTED COMMISSIONS // BOOKS
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 mb-6 font-sans leading-relaxed">
              Each volume on the desk represents an engineering commission spanning distributed intelligence, automotive digital twins, and frontend architectures.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono tracking-widest text-[#FF7A00] uppercase">Vol. I · Neural Core</span>
                  <span className="text-[9px] font-mono text-white/40">2026</span>
                </div>
                <h4 className="font-serif text-base text-white mb-1">Forge Automotive Digital Twin</h4>
                <p className="text-xs text-white/50 mb-3">
                  Real-time telemetry and 3D spatial twin for next-generation electric hypercars with low-latency WebGL shaders.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">Three.js</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">WebGL</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">Next.js</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">Vol. II · Distributed Systems</span>
                  <span className="text-[9px] font-mono text-white/40">2025</span>
                </div>
                <h4 className="font-serif text-base text-white mb-1">Autonomous Agent Coordination Fabric</h4>
                <p className="text-xs text-white/50 mb-3">
                  Decentralized multi-agent orchestrator managing parallel execution pipelines and real-time reactive streaming.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">Python</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">gRPC</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">TypeScript</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono tracking-widest text-sky-400 uppercase">Vol. III · Creative Engineering</span>
                  <span className="text-[9px] font-mono text-white/40">2025</span>
                </div>
                <h4 className="font-serif text-base text-white mb-1">Cyber-Pastoral Terrace Portfolio</h4>
                <p className="text-xs text-white/50 mb-3">
                  Monumental editorial web experience blending Ghibli-inspired terrace serenity with razor-sharp Swiss typography.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">GSAP</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">Tailwind v4</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-mono uppercase">Lenis</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                  onEnterPortfolio();
                  if (onNavigateToSection) onNavigateToSection("monument-exhibition");
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF7A00] hover:text-white transition-colors cursor-pointer"
              >
                <span>Jump to Exhibition in Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: HOBBIES & LIFE (WHEN COFFEE MUG IS CLICKED) ----------------- */}
      {activeModal === "hobbies" && (
        <div
          onClick={handleCloseModal}
          className="absolute inset-0 z-40 flex items-center justify-end p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0F1116]/95 border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-[#FF7A00]" />
                <h3 className="font-mono text-xs tracking-[0.22em] uppercase text-white/90">
                  LIFE BEYOND CODE // THE DESK
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 mb-6 font-sans leading-relaxed">
              The coffee mug on the desk represents intentional living, slow rituals, and creative disciplines outside of terminal windows.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">☕</span>
                  <h4 className="font-serif text-base text-white">Specialty Pour-Overs & Roasts</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Precision hand-brewing with V60 and AeroPress. Dialing in grind distribution, water chemistry, and light-roast Ethiopian Yirgacheffe notes.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">📷</span>
                  <h4 className="font-serif text-base text-white">Analog 35mm Photography</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Shooting mechanical rangefinders on Kodak Portra 400 and Ilford HP5. Capturing quiet urban streetscapes, golden-hour light shadows, and architectural forms.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🎧</span>
                  <h4 className="font-serif text-base text-white">Ambient Soundscapes & Modular Synths</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Curating warm drone textures, tape loops, and generative ambient acoustics that power deep programming focus sessions.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🌱</span>
                  <h4 className="font-serif text-base text-white">Cyber-Pastoralism & Botany</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Cultivating desktop bonsai and terrace ferns, bridging the high-tech realm of artificial neural networks with the serene calm of the living world.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase text-center">
                • You can edit or add more hobbies anytime in Studio3DWorkspace.tsx •
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: INTERACTIVE TERMINAL CONSOLE (KEYBOARD) ----------------- */}
      {activeModal === "terminal" && (
        <div
          onClick={handleCloseModal}
          className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#090A0E] border border-white/20 rounded-xl p-5 text-white shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-white/80 font-bold">atelier@soham-pro: ~ (zsh)</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                className="p-1 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-4 scrollbar-thin">
              <p className="text-white/40">// Interactive Studio CLI. Type &quot;help&quot; for commands.</p>
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-emerald-400 font-semibold">$ {item.cmd}</p>
                  <p className="text-white/70 pl-2 leading-relaxed whitespace-pre-wrap">{item.out}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type command (e.g. whoami, skills, projects, clear)..."
                className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs placeholder:text-white/25"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase tracking-wider text-white cursor-pointer"
              >
                Run
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

Studio3DWorkspace.displayName = "Studio3DWorkspace";
