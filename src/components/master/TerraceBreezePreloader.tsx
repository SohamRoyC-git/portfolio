"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";

// 5x7 Dot Matrix Font Map for the chunky counter & letters
const DOT_MAP: Record<string, number[][]> = {
  "0": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  "1": [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  "2": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  "3": [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  "4": [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  "5": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "6": [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "7": [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  "8": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  "9": [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0],
  ],
  "%": [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  ">": [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  " ": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

// Web Audio API Synthesizer (Instant mechanical clicks & cinematic sub-whoosh)
class PreloaderSoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playMechanicalClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {}
  }

  playCinematicWhoosh() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 1.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 1.1);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    } catch {}
  }
}

const sounds = new PreloaderSoundEngine();

export const TerraceBreezePreloader: React.FC = memo(() => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bloomVeilRef = useRef<HTMLDivElement | null>(null);

  // References for 3D state
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    screenTexture: THREE.CanvasTexture;
    screenCanvas: HTMLCanvasElement;
    screenCtx: CanvasRenderingContext2D;
    laptopLid: THREE.Group;
    matrixCols: number[];
    reqId: number;
    mouseTarget: { x: number; y: number };
  } | null>(null);

  const progressRef = useRef(0);
  progressRef.current = progress;
  const isReadyRef = useRef(false);
  isReadyRef.current = isReady;

  // 1. GENUINE ASSET PRELOADING ENGINE
  useEffect(() => {
    let mounted = true;
    const criticalImages = [
      "/assets/soham_headshot.png",
      "/assets/disc_indiacenter.png",
      "/assets/disc_izieat.png",
      "/assets/disc_lcf.png",
      "/assets/disc_varti.png",
      "/assets/lcf_logo.png",
      "/assets/varti_logo.png",
      "/assets/terrace_laptop_desk.jpg",
      "/assets/logos/izieat.png",
      "/assets/logos/latvia_cricket.png",
      "/assets/logos/india_center.png",
      "/assets/logos/varti_international.png",
      "/assets/linkedin_qr.svg",
    ];

    let totalWeight = criticalImages.length + 4; // +3 video, +1 fonts
    let loadedWeight = 0;

    const updateWeight = (weightToAdd: number) => {
      if (!mounted) return;
      loadedWeight += weightToAdd;
      const targetPercent = Math.min(100, Math.round((loadedWeight / totalWeight) * 100));
      setProgress((prev) => {
        const next = Math.max(prev, targetPercent);
        if (next !== prev) {
          sounds.playMechanicalClick();
        }
        return next;
      });
    };

    // A. Preload Fonts
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => updateWeight(1));
    } else {
      updateWeight(1);
    }

    // B. Preload Images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => updateWeight(1);
      img.onerror = () => updateWeight(1);
    });

    // C. Genuine Hero Video Buffer Verification
    let videoHandled = false;
    const handleVideoReady = () => {
      if (videoHandled) return;
      videoHandled = true;
      updateWeight(3);
    };

    const video = document.createElement("video");
    video.src = "/assets/hero_pixel_art_loop.mp4";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("canplaythrough", handleVideoReady, { once: true });
    video.addEventListener("loadeddata", () => {
      if (video.readyState >= 3) handleVideoReady();
    });
    try {
      video.load();
    } catch {}

    // Check existing DOM hero video elements
    if (typeof document !== "undefined") {
      const domVideos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
      domVideos.forEach((v) => {
        if (v.readyState >= 3) {
          handleVideoReady();
        } else {
          v.addEventListener("canplaythrough", handleVideoReady, { once: true });
          v.addEventListener("loadeddata", () => {
            if (v.readyState >= 3) handleVideoReady();
          });
        }
      });
    }

    const fallbackTimer = setTimeout(() => {
      if (!videoHandled) handleVideoReady();
      setProgress(100);
      setIsReady(true);
    }, 4500);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      video.removeEventListener("canplaythrough", handleVideoReady);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setIsReady(true);
    }
  }, [progress]);

  // Lock Lenis scroll while preloader is active
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenis = (window as any).lenis;
      if (lenis && visible) {
        lenis.stop();
      }
    }
  }, [visible]);

  // 2. BUILD THE THREE.JS 3D ROOM & 3D LAPTOP SCENE
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    // A. Scene Setup with Atmospheric Room Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.08);

    // B. Perspective 3D Camera
    // Initial camera position: Seated at the workstation looking down slightly at the laptop
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 52 : 40,
      width / height,
      0.1,
      100
    );
    camera.position.set(0, isMobile ? 1.6 : 1.35, isMobile ? 4.8 : 3.8);
    camera.lookAt(0, 0.65, 0);

    // C. WebGL Renderer with High Dynamic Range & Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // D. 3D Lighting in the Room
    // Ambient soft room shadow
    const ambientLight = new THREE.AmbientLight(0x0c0e18, 0.8);
    scene.add(ambientLight);

    // Desk Lamp: Warm amber spotlight casting shadows from the upper right
    const deskLampSpot = new THREE.SpotLight(0xffb84d, 3.2, 14, Math.PI / 4, 0.5, 1.2);
    deskLampSpot.position.set(2.8, 3.2, 1.6);
    deskLampSpot.castShadow = true;
    deskLampSpot.shadow.bias = -0.001;
    scene.add(deskLampSpot);

    // Subtle cool rim fill from the left
    const coolRimLight = new THREE.DirectionalLight(0x406085, 0.5);
    coolRimLight.position.set(-3.5, 2.5, -2.0);
    scene.add(coolRimLight);

    // Laptop Screen Light: Real-time point light emitting from the monitor onto the keys and desk!
    const screenGlowLight = new THREE.PointLight(0xffffff, 2.2, 3.2, 1.2);
    screenGlowLight.position.set(0, 0.85, 0.35);
    scene.add(screenGlowLight);

    // E. 3D Meshes: The Room & Desk
    // 1. Desk Surface
    const deskGeo = new THREE.BoxGeometry(12, 0.4, 6);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.65,
      metalness: 0.2,
    });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, -0.2, 0);
    deskMesh.receiveShadow = true;
    scene.add(deskMesh);

    // 2. Leather/Matte Desk Pad
    const padGeo = new THREE.BoxGeometry(3.6, 0.015, 2.3);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.9,
      metalness: 0.05,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(0, 0.008, 0.15);
    padMesh.receiveShadow = true;
    scene.add(padMesh);

    // 3. 3D Coffee Mug Silhouette (Echoes the living terrace hero mug!)
    const mugGroup = new THREE.Group();
    const mugGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.38, 24);
    const mugMat = new THREE.MeshStandardMaterial({
      color: 0x16181f,
      roughness: 0.55,
      metalness: 0.1,
    });
    const mugMesh = new THREE.Mesh(mugGeo, mugMat);
    mugMesh.position.set(0, 0.19, 0);
    mugMesh.castShadow = true;
    mugGroup.add(mugMesh);

    const handleGeo = new THREE.TorusGeometry(0.1, 0.028, 12, 24, Math.PI);
    const handleMesh = new THREE.Mesh(handleGeo, mugMat);
    handleMesh.position.set(0.16, 0.19, 0);
    handleMesh.rotation.z = -Math.PI / 2;
    mugGroup.add(handleMesh);

    mugGroup.position.set(1.5, 0.01, 0.3);
    scene.add(mugGroup);

    // F. 3D LAPTOP MODEL (Authentic Anodized Aluminum Physical Machine)
    const laptopGroup = new THREE.Group();

    // 1. Laptop Base / Keyboard Deck
    const baseGeo = new THREE.BoxGeometry(2.35, 0.05, 1.55);
    const alumMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.32,
      metalness: 0.88,
    });
    const baseMesh = new THREE.Mesh(baseGeo, alumMat);
    baseMesh.position.set(0, 0.04, 0.3);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Keyboard well cutout & keys bed
    const kbBedGeo = new THREE.BoxGeometry(2.0, 0.008, 0.82);
    const kbBedMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d11,
      roughness: 0.8,
      metalness: 0.2,
    });
    const kbBedMesh = new THREE.Mesh(kbBedGeo, kbBedMat);
    kbBedMesh.position.set(0, 0.068, 0.16);
    laptopGroup.add(kbBedMesh);

    // Individual Key rows with subtle edge bevels
    const keyGeo = new THREE.BoxGeometry(0.12, 0.012, 0.12);
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x121317,
      roughness: 0.5,
      metalness: 0.5,
    });
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 13; c++) {
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(-0.84 + c * 0.14, 0.076, -0.15 + r * 0.155);
        laptopGroup.add(key);
      }
    }

    // Large Glass Trackpad
    const trackGeo = new THREE.BoxGeometry(0.72, 0.004, 0.44);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x1f2229,
      roughness: 0.25,
      metalness: 0.85,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.set(0, 0.068, 0.72);
    laptopGroup.add(trackMesh);

    // 2. Laptop Lid / Display Assembly (Angled back at ~105° in real 3D space!)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.065, -0.47); // Pinned precisely to the rear hinge!
    // Natural open angle (-15 deg from vertical = 105 deg open)
    lidGroup.rotation.x = -15 * (Math.PI / 180);

    // Aluminum Back Chassis & Bezel
    const lidBackGeo = new THREE.BoxGeometry(2.35, 1.48, 0.035);
    const lidBackMesh = new THREE.Mesh(lidBackGeo, alumMat);
    lidBackMesh.position.set(0, 0.74, 0);
    lidBackMesh.castShadow = true;
    lidGroup.add(lidBackMesh);

    // Webcam notch dot at top center
    const camGeo = new THREE.CircleGeometry(0.012, 16);
    const camMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
    const camMesh = new THREE.Mesh(camGeo, camMat);
    camMesh.position.set(0, 1.43, 0.019);
    lidGroup.add(camMesh);

    // G. THE DYNAMIC 60FPS MATRIX & PORT SCANNER CANVAS TEXTURE
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1280;
    screenCanvas.height = 800;
    const screenCtx = screenCanvas.getContext("2d")!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    // Physical Glass Screen Plane (16:10 Ratio)
    const screenGeo = new THREE.PlaneGeometry(2.26, 1.39);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.73, 0.0185);
    lidGroup.add(screenMesh);

    laptopGroup.add(lidGroup);
    scene.add(laptopGroup);

    // Matrix Rain Stream state
    const cols = 48;
    const matrixCols: number[] = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -40)
    );

    // Mouse parallax tracking
    const mouseTarget = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.fov = w < 768 ? 52 : 40;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // H. 60 FPS RENDER & SCREEN PAINT LOOP
    let startTime = performance.now();

    const drawScreenCanvas = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const p = progressRef.current;
      const ready = isReadyRef.current;

      // 1. Deep Obsidian Screen Background
      screenCtx.fillStyle = "#06070A";
      screenCtx.fillRect(0, 0, 1280, 800);

      // 2. Matrix Rain Columns in the Background
      screenCtx.font = "14px monospace";
      for (let i = 0; i < cols; i++) {
        const x = i * 26 + 12;
        const y = matrixCols[i] * 18;

        // Draw fading tail glyphs
        for (let j = 0; j < 12; j++) {
          const tailY = y - j * 18;
          if (tailY > 0 && tailY < 780) {
            const alpha = Math.max(0, 1 - j / 12) * 0.22;
            screenCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            const glyph = String.fromCharCode(0x30a0 + ((i + j) % 96));
            screenCtx.fillText(glyph, x, tailY);
          }
        }

        // Bright leading head glyph
        if (y > 0 && y < 780) {
          screenCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
          screenCtx.shadowColor = "#FFFFFF";
          screenCtx.shadowBlur = 8;
          screenCtx.fillText("0x" + ((i * 7) % 99).toString(16).toUpperCase(), x, y);
          screenCtx.shadowBlur = 0;
        }

        matrixCols[i] += 0.85;
        if (matrixCols[i] * 18 > 800) {
          matrixCols[i] = Math.floor(Math.random() * -20);
        }
      }

      // 3. Screen Top Header Bar: Monograph Branding
      screenCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
      screenCtx.font = "13px monospace";
      screenCtx.fillText("• SOHAM ROYCHOUDHURY", 48, 54);
      screenCtx.fillText("SYSTEM INITIALIZATION // KERNEL v6.12", 840, 54);

      screenCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      screenCtx.beginPath();
      screenCtx.moveTo(48, 72);
      screenCtx.lineTo(1232, 72);
      screenCtx.stroke();

      // 4. Left Panel: Living Network Port Scanning & Telemetry Box
      screenCtx.fillStyle = "rgba(10, 12, 16, 0.85)";
      screenCtx.fillRect(48, 110, 480, 580);
      screenCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      screenCtx.strokeRect(48, 110, 480, 580);

      // Terminal Header
      screenCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
      screenCtx.font = "bold 13px monospace";
      screenCtx.fillText(">> ACTIVE PORT TELEMETRY", 72, 146);

      // Ports List
      const ports = [
        { port: "0080 [HTTP]", label: "BUFFERING ASSETS...", status: p > 20 ? "OK" : "PENDING" },
        { port: "0443 [TLS/SSL]", label: "CRYPTO HANDSHAKE", status: p > 45 ? "SECURE" : "WAIT" },
        { port: "3000 [NEXT.JS]", label: "REACT APP MOUNT", status: p > 70 ? "ACTIVE" : "MOUNT" },
        { port: "8080 [STREAM]", label: "PIXEL ART VIDEO", status: p >= 100 ? "READY" : "BUFFER" },
      ];

      screenCtx.font = "12px monospace";
      ports.forEach((pt, idx) => {
        const py = 190 + idx * 46;
        screenCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
        screenCtx.fillText(`PORT ${pt.port}:`, 72, py);

        screenCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        screenCtx.fillText(pt.label, 230, py);

        screenCtx.fillStyle = pt.status === "OK" || pt.status === "SECURE" || pt.status === "READY" || pt.status === "ACTIVE"
          ? "#FFFFFF"
          : "rgba(255, 255, 255, 0.3)";
        screenCtx.fillText(`[ ${pt.status} ]`, 440, py);
      });

      // Asset Pipeline Progress Bar inside the Left Box
      screenCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
      screenCtx.fillText("PIPELINE BUFFER:", 72, 400);

      screenCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
      screenCtx.fillRect(72, 415, 430, 8);

      screenCtx.fillStyle = "#FFFFFF";
      screenCtx.fillRect(72, 415, (430 * p) / 100, 8);

      screenCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
      screenCtx.font = "11px monospace";
      screenCtx.fillText(`CACHE: ${Math.round(p)}% OF 100% COMPLETE`, 72, 448);
      screenCtx.fillText(`VIDEO READY STATE: ${p >= 100 ? "4 (ENOUGH_DATA)" : "3 (CAN_PLAY)"}`, 72, 474);
      screenCtx.fillText(`FONTS SUBSYSTEM: READY`, 72, 500);

      // 5. Right Panel: Chunky Dot Matrix Visual Centerpiece
      // In the first 1.6s, show S O H A M; then morph into 000% -> 100%; then ENTER >
      const showName = elapsed < 1.6 && !ready;
      const pStr = String(Math.min(100, Math.max(0, p))).padStart(3, "0");

      const drawDotString = (str: string, startX: number, startY: number, dotSize: number, gap: number) => {
        let curX = startX;
        for (let s = 0; s < str.length; s++) {
          const ch = str[s];
          const pattern = DOT_MAP[ch] || DOT_MAP[" "];

          for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 5; c++) {
              const active = pattern[r][c] === 1;
              const dx = curX + c * (dotSize + gap);
              const dy = startY + r * (dotSize + gap);

              screenCtx.beginPath();
              screenCtx.arc(dx, dy, dotSize / 2, 0, Math.PI * 2);

              if (active) {
                screenCtx.fillStyle = "#FFFFFF";
                screenCtx.shadowColor = "rgba(255, 255, 255, 0.9)";
                screenCtx.shadowBlur = 10;
                screenCtx.fill();
                screenCtx.shadowBlur = 0;
              } else {
                screenCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
                screenCtx.fill();
              }
            }
          }
          curX += 5 * (dotSize + gap) + gap * 2.5;
        }
      };

      if (showName) {
        drawDotString("SOHAM", 640, 310, 11, 4.5);
      } else if (!ready || p < 100) {
        drawDotString(`${pStr}%`, 600, 310, 11, 4.5);
      } else {
        // Ready State: ENTER >
        drawDotString("ENTER >", 580, 290, 11, 4.5);

        // Flashing Trigger Prompt
        const blink = Math.sin(time * 0.006) > 0;
        screenCtx.fillStyle = blink ? "#FFFFFF" : "rgba(255, 255, 255, 0.35)";
        screenCtx.font = "bold 15px monospace";
        screenCtx.fillText(">>> [ PRESS ENTER OR CLICK TO INITIATE ] <<<", 630, 430);
      }

      // Screen Bottom Status Line
      screenCtx.fillStyle = "rgba(255, 255, 255, 0.3)";
      screenCtx.font = "12px monospace";
      screenCtx.fillText("ATELIER HARDWARE ENGINE // DIRECT 3D SPATIAL PIPELINE", 48, 755);
      screenCtx.fillText(`FPS: 60 // RENDER: THREE.JS`, 980, 755);

      screenTexture.needsUpdate = true;
    };

    let animationFrameId: number;
    const animate = (time: number) => {
      // 1. Mouse-Driven Spatial Parallax (Subtle 3D orbit)
      const targetCamX = mouseTarget.x * 0.35;
      const targetCamY = (isMobile ? 1.6 : 1.35) + mouseTarget.y * 0.2;
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 0.65, 0);

      // 2. Render Screen Canvas Texture
      drawScreenCanvas(time);

      // 3. Render Three.js 3D WebGL Scene
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    threeRef.current = {
      scene,
      camera,
      renderer,
      screenTexture,
      screenCanvas,
      screenCtx,
      laptopLid: lidGroup,
      matrixCols,
      reqId: animationFrameId,
      mouseTarget,
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Clean disposal of WebGL resources to prevent memory leaks
      renderer.dispose();
      deskGeo.dispose();
      deskMat.dispose();
      padGeo.dispose();
      padMat.dispose();
      mugGeo.dispose();
      mugMat.dispose();
      handleGeo.dispose();
      baseGeo.dispose();
      alumMat.dispose();
      kbBedGeo.dispose();
      kbBedMat.dispose();
      keyGeo.dispose();
      keyMat.dispose();
      trackGeo.dispose();
      trackMat.dispose();
      lidBackGeo.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
    };
  }, []);

  // 3. TRUE 3D CAMERA DOLLY ZOOM INTO THE LAPTOP DISPLAY
  const handleTriggerEnter = useCallback(() => {
    if (isZooming || !threeRef.current) return;
    setIsZooming(true);
    sounds.playCinematicWhoosh();

    const { camera, laptopLid } = threeRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        if (typeof window !== "undefined") {
          const lenis = (window as any).lenis;
          if (lenis) lenis.start();
          import("gsap/dist/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
      },
    });

    // 1. The 3D Camera physically dollies forward along the Z and Y axes right into the screen
    // The screen center sits at: Y ~0.80, Z ~-0.45. We dolly camera to right in front of the glass!
    tl.to(
      camera.position,
      {
        x: 0,
        y: 0.81,
        z: -0.15,
        duration: 1.6,
        ease: "power3.inOut",
      },
      0
    );

    // 2. Camera tilts slightly to align parallel to the tilted 105° laptop screen lid
    tl.to(
      camera.rotation,
      {
        x: -15 * (Math.PI / 180),
        y: 0,
        z: 0,
        duration: 1.6,
        ease: "power3.inOut",
      },
      0
    );

    // 3. Optical White Flash / Bloom Veil as we penetrate through the glass
    if (bloomVeilRef.current) {
      tl.fromTo(
        bloomVeilRef.current,
        { opacity: 0 },
        { opacity: 0.95, duration: 0.5, ease: "power2.in" },
        0.85
      );
    }

    // 4. Smooth crossfade of the Three.js canvas revealing the live terrace hero video
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        1.25
      );
    }
  }, [isZooming]);

  // Global keydown trigger on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReady && !isZooming) {
        if (e.key === "Enter" || e.code === "Space") {
          e.preventDefault();
        }
        handleTriggerEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, isZooming, handleTriggerEnter]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onClick={isReady ? handleTriggerEnter : undefined}
      onTouchMove={(e) => {
        if (!isZooming) e.stopPropagation();
      }}
      onWheel={(e) => {
        if (!isZooming) e.stopPropagation();
      }}
      className={`fixed inset-0 z-[99999] bg-[#050508] select-none overflow-hidden touch-none ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Atelier 3D Monolith Preloader"
    >
      {/* The Master Three.js WebGL 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating HUD Interaction Cue when ready */}
      {isReady && !isZooming && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/25 bg-black/60 text-white font-mono text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.24em] uppercase backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.8)] animate-pulse whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_8px_#FFF] shrink-0" />
            <span className="hidden sm:inline">Press Enter or Click to Step Inside</span>
            <span className="inline sm:hidden">Tap Anywhere to Step Inside</span>
          </div>
        </div>
      )}

      {/* Optical White Flash / Bloom Veil upon 3D zoom penetration */}
      <div
        ref={bloomVeilRef}
        className="absolute inset-0 pointer-events-none z-50 bg-white opacity-0"
      />
    </div>
  );
});

TerraceBreezePreloader.displayName = "TerraceBreezePreloader";
