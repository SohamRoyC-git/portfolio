"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";
import { X, ExternalLink, ArrowRight, BookOpen, Coffee, Laptop, Terminal, Sparkles, ChevronDown } from "lucide-react";

export interface Studio3DWorkspaceProps {
  onEnterPortfolio: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

type CameraFocusMode = "overview" | "laptop" | "books" | "mug" | "keyboard";

export const Studio3DWorkspace = memo(function Studio3DWorkspace({
  onEnterPortfolio,
  onNavigateToSection,
}: Studio3DWorkspaceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [focusMode, setFocusMode] = useState<CameraFocusMode>("overview");
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"projects" | "hobbies" | "terminal" | null>(null);

  // Cursor coordinates
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const interactablesRef = useRef<THREE.Object3D[]>([]);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const topBookRef = useRef<THREE.Mesh | null>(null);
  const laptopScreenMeshRef = useRef<THREE.Mesh | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = useCallback((freq = 800) => {
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
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }
    } catch {}
  }, []);

  // Camera Target States (Responsive positioning)
  const cameraTargets = useRef({
    overview: {
      pos: new THREE.Vector3(0, 1.6, 3.3),
      lookAt: new THREE.Vector3(0, 0.45, 0),
    },
    overviewMobile: {
      pos: new THREE.Vector3(0, 1.85, 4.3),
      lookAt: new THREE.Vector3(0, 0.45, 0),
    },
    laptop: {
      pos: new THREE.Vector3(0, 0.68, 1.12),
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
    keyboard: {
      pos: new THREE.Vector3(0, 0.78, 0.95),
      lookAt: new THREE.Vector3(0, 0.42, 0.35),
    },
  });

  const currentLookAt = useRef(new THREE.Vector3(0, 0.45, 0));

  // Animate camera to target
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

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width / height < 1.0;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#0E0F12");
    scene.fog = new THREE.FogExp2("#0E0F12", 0.035);

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

    // 4. LIGHTING (Morning Sunbeams from the Left Window)
    const ambientLight = new THREE.AmbientLight(0xFFF5E8, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF1DE, 2.9);
    sunLight.position.set(-4.5, 5.5, 2.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.camera.left = -3;
    sunLight.shadow.camera.right = 3;
    sunLight.shadow.camera.top = 3;
    sunLight.shadow.camera.bottom = -3;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xD8EAFF, 0.55);
    skyFill.position.set(4, 3, -1);
    scene.add(skyFill);

    const screenGlow = new THREE.PointLight(0xFFFFFF, 0.35, 2);
    screenGlow.position.set(0, 0.72, 0.25);
    scene.add(screenGlow);

    // 5. MATERIALS (High-End Tactile Scandinavian Materials)
    const oakWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0xC6A275,
      roughness: 0.55,
      metalness: 0.05,
    });

    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1C20,
      roughness: 0.35,
      metalness: 0.85,
    });

    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xD2D4D8,
      roughness: 0.28,
      metalness: 0.82,
    });

    const ceramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xF2EFE6,
      roughness: 0.18,
      metalness: 0.05,
    });

    const wallPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4BC96,
      roughness: 0.7,
      metalness: 0.02,
    });

    const interactables: THREE.Object3D[] = [];

    // 6. ARCHITECTURAL ROOM
    // A. Back Wood-Slatted Wall (Wisq Architectural Rhythm)
    const wallGroup = new THREE.Group();
    const wallBacking = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x1E1B18, roughness: 0.9 })
    );
    wallBacking.position.set(0, 2.2, -1.8);
    wallGroup.add(wallBacking);

    // Vertical Scandinavian Slats with soft rounded profile
    const slatGeo = new RoundedBoxGeometry(0.045, 6.0, 0.03, 2, 0.006);
    for (let x = -5.0; x <= 5.0; x += 0.13) {
      const slat = new THREE.Mesh(slatGeo, wallPanelMaterial);
      slat.position.set(x, 2.2, -1.78);
      slat.receiveShadow = true;
      wallGroup.add(slat);
    }
    scene.add(wallGroup);

    // B. Left Architectural Window Frame
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 5.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
    );
    windowFrame.position.set(-4.5, 2.5, 0.5);
    scene.add(windowFrame);

    // C. The Master Oak Desk
    const deskTop = new THREE.Mesh(
      new RoundedBoxGeometry(3.6, 0.08, 1.8, 4, 0.02),
      oakWoodMaterial
    );
    deskTop.position.set(0, 0.38, 0);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    scene.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 16);
    const legPositions = [
      [-1.65, -0.22, -0.75],
      [1.65, -0.22, -0.75],
      [-1.65, -0.22, 0.75],
      [1.65, -0.22, 0.75],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMaterial);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // 7. INTERACTIVE OBJECT 1: MACBOOK PRO LAPTOP
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.42, 0.05);

    const laptopBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.016, 0.38, 4, 0.006),
      aluminumMaterial
    );
    laptopBase.castShadow = true;
    laptopBase.receiveShadow = true;
    laptopGroup.add(laptopBase);

    const keyboardWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.002, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.8 })
    );
    keyboardWell.position.set(0, 0.009, -0.04);
    laptopGroup.add(keyboardWell);

    const trackpad = new THREE.Mesh(
      new RoundedBoxGeometry(0.2, 0.002, 0.12, 2, 0.004),
      new THREE.MeshStandardMaterial({ color: 0xC0C2C6, roughness: 0.4, metalness: 0.6 })
    );
    trackpad.position.set(0, 0.009, 0.11);
    laptopGroup.add(trackpad);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.008, -0.185);
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-16); // ~106 degree open angle

    const screenLid = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.38, 0.012, 4, 0.005),
      aluminumMaterial
    );
    screenLid.position.set(0, 0.19, 0);
    screenLid.castShadow = true;
    lidGroup.add(screenLid);

    // Screen Display Surface with rich canvas texture
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    const sCtx = screenCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createLinearGradient(0, 0, 0, 680);
      grad.addColorStop(0, "#161D2B");
      grad.addColorStop(0.45, "#2C394E");
      grad.addColorStop(1, "#0A0D14");
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
      emissiveIntensity: 0.38,
    });

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.53, 0.35),
      screenMaterial
    );
    screenMesh.position.set(0, 0.19, 0.007);
    laptopScreenMeshRef.current = screenMesh;
    lidGroup.add(screenMesh);

    laptopGroup.add(lidGroup);
    laptopGroup.name = "interactive_laptop";
    laptopGroup.userData = { id: "laptop", label: "ENTER WEBSITE 💻" };
    scene.add(laptopGroup);
    interactables.push(laptopGroup);

    // 8. INTERACTIVE OBJECT 2: STACK OF BOOKS (PROJECTS)
    const booksGroup = new THREE.Group();
    booksGroup.position.set(-0.95, 0.42, 0.1);

    const book1 = new THREE.Mesh(
      new RoundedBoxGeometry(0.34, 0.058, 0.46, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x9B422D, roughness: 0.55 })
    );
    book1.position.set(0, 0.029, 0);
    book1.rotation.y = THREE.MathUtils.degToRad(8);
    book1.castShadow = true;
    book1.receiveShadow = true;
    booksGroup.add(book1);

    const book2 = new THREE.Mesh(
      new RoundedBoxGeometry(0.32, 0.05, 0.44, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x42584A, roughness: 0.65 })
    );
    book2.position.set(0.02, 0.082, 0.01);
    book2.rotation.y = THREE.MathUtils.degToRad(-4);
    book2.castShadow = true;
    book2.receiveShadow = true;
    booksGroup.add(book2);

    const book3 = new THREE.Mesh(
      new RoundedBoxGeometry(0.3, 0.044, 0.41, 3, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x181A1F, roughness: 0.45, metalness: 0.2 })
    );
    book3.position.set(-0.01, 0.128, -0.01);
    book3.rotation.y = THREE.MathUtils.degToRad(12);
    book3.castShadow = true;
    book3.receiveShadow = true;
    topBookRef.current = book3;
    booksGroup.add(book3);

    booksGroup.name = "interactive_books";
    booksGroup.userData = { id: "books", label: "VIEW PROJECTS 📚" };
    scene.add(booksGroup);
    interactables.push(booksGroup);

    // 9. INTERACTIVE OBJECT 3: FLUTED CERAMIC COFFEE MUG (HOBBIES)
    const mugGroup = new THREE.Group();
    mugGroup.position.set(0.92, 0.42, 0.1);

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.078, 0.068, 0.16, 32),
      ceramicMaterial
    );
    mugBody.position.set(0, 0.08, 0);
    mugBody.castShadow = true;
    mugBody.receiveShadow = true;
    mugGroup.add(mugBody);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.048, 0.013, 16, 24, Math.PI * 1.1),
      ceramicMaterial
    );
    handle.position.set(0.078, 0.08, 0);
    handle.rotation.z = Math.PI / 2;
    handle.castShadow = true;
    mugGroup.add(handle);

    const coffeeLiquid = new THREE.Mesh(
      new THREE.CircleGeometry(0.07, 32),
      new THREE.MeshStandardMaterial({ color: 0x22130C, roughness: 0.1, metalness: 0.1 })
    );
    coffeeLiquid.position.set(0, 0.152, 0);
    coffeeLiquid.rotation.x = -Math.PI / 2;
    mugGroup.add(coffeeLiquid);

    const steamGeo = new THREE.BufferGeometry();
    const steamCount = 50;
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.06;
      steamPos[i * 3 + 1] = 0.16 + Math.random() * 0.3;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));

    const steamMat = new THREE.PointsMaterial({
      color: 0xFFF5E6,
      size: 0.016,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    mugGroup.add(steamParticles);
    steamParticlesRef.current = steamParticles;

    mugGroup.name = "interactive_mug";
    mugGroup.userData = { id: "mug", label: "HOBBIES & LIFE ☕" };
    scene.add(mugGroup);
    interactables.push(mugGroup);

    // 10. INTERACTIVE OBJECT 4: WIRELESS KEYBOARD & MOUSE
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, 0.42, 0.45);

    const keyboardBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.48, 0.012, 0.16, 3, 0.005),
      aluminumMaterial
    );
    keyboardBase.castShadow = true;
    keyboardGroup.add(keyboardBase);

    const keysPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.003, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1A1C20, roughness: 0.8 })
    );
    keysPlate.position.set(0, 0.008, 0);
    keyboardGroup.add(keysPlate);

    keyboardGroup.name = "interactive_keyboard";
    keyboardGroup.userData = { id: "keyboard", label: "TERMINAL ⌨️" };
    scene.add(keyboardGroup);
    interactables.push(keyboardGroup);

    const mouse = new THREE.Mesh(
      new RoundedBoxGeometry(0.08, 0.02, 0.13, 4, 0.008),
      new THREE.MeshStandardMaterial({ color: 0xF3F4F6, roughness: 0.25, metalness: 0.4 })
    );
    mouse.position.set(0.48, 0.42, 0.45);
    mouse.castShadow = true;
    scene.add(mouse);

    // 11. DECORATIVE VASE WITH BOTANICAL TWIG
    const vaseGroup = new THREE.Group();
    vaseGroup.position.set(-1.25, 0.42, -0.2);

    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.085, 0.32, 24),
      new THREE.MeshStandardMaterial({ color: 0xDCE4DE, roughness: 0.35 })
    );
    vase.position.set(0, 0.16, 0);
    vase.castShadow = true;
    vaseGroup.add(vase);

    const branchMat = new THREE.MeshStandardMaterial({ color: 0x4A3B32, roughness: 0.8 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.008, 0.55, 8), branchMat);
    stem.position.set(0, 0.48, 0);
    stem.rotation.z = THREE.MathUtils.degToRad(-12);
    vaseGroup.add(stem);
    scene.add(vaseGroup);

    interactablesRef.current = interactables;

    // 12. RAYCASTER & INTERACTION
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
        const targetX = x * 0.16;
        const targetY = (isMobile ? 1.85 : 1.6) + y * 0.1;
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
      const intersects = raycaster.intersectObjects(interactablesRef.current, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.id && obj.parent) {
          obj = obj.parent;
        }

        if (obj?.userData?.id) {
          const actionId = obj.userData.id;
          playClickSound(900);

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
          } else if (actionId === "keyboard") {
            transitionCameraTo("keyboard");
            setActiveModal("terminal");
          }
        }
      }
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("click", handleClick);

    // 13. ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (steamParticlesRef.current) {
        const positions = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          positions[i * 3 + 1] += 0.0016;
          positions[i * 3] += Math.sin(elapsed * 2 + i) * 0.0003;
          if (positions[i * 3 + 1] > 0.44) {
            positions[i * 3 + 1] = 0.16;
            positions[i * 3] = (Math.random() - 0.5) * 0.06;
          }
        }
        steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(interactablesRef.current, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.id && obj.parent) {
          obj = obj.parent;
        }
        if (obj?.userData?.id) {
          setHoveredObject(obj.userData.label);
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

    // 14. RESIZE LISTENER
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
  }, [playClickSound, transitionCameraTo, onEnterPortfolio, focusMode]);

  const handleCloseModal = () => {
    setActiveModal(null);
    transitionCameraTo("overview");
  };

  return (
    <div className="relative w-full h-[100svh] overflow-hidden select-none bg-[#0E0F12]">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/85 backdrop-blur-md text-white font-mono text-[9px] tracking-[0.2em] uppercase shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/25 bg-black/80 hover:bg-white hover:text-black text-white text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer"
          >
            <span>← Back to Room Overview</span>
          </button>
        </div>
      )}

      {/* Bottom Interactive Spatial Guide & Navigation Pill Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-full border border-white/15 bg-black/75 backdrop-blur-lg shadow-[0_16px_50px_rgba(0,0,0,0.7)] max-w-[95vw] overflow-x-auto">
        <button
          onClick={() => {
            playClickSound(900);
            transitionCameraTo("laptop");
            setTimeout(onEnterPortfolio, 1200);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10.5px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>💻</span>
          <span className="font-semibold text-white">Laptop</span>
          <span className="text-white/40 hidden sm:inline">(Portfolio)</span>
        </button>

        <button
          onClick={() => {
            playClickSound(900);
            transitionCameraTo("books");
            setActiveModal("projects");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10.5px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>📚</span>
          <span className="font-semibold text-white">Books</span>
          <span className="text-white/40 hidden sm:inline">(Projects)</span>
        </button>

        <button
          onClick={() => {
            playClickSound(900);
            transitionCameraTo("mug");
            setActiveModal("hobbies");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white text-[9px] sm:text-[10.5px] font-mono tracking-wider transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>☕</span>
          <span className="font-semibold text-white">Mug</span>
          <span className="text-white/40 hidden sm:inline">(Hobbies)</span>
        </button>

        <button
          onClick={onEnterPortfolio}
          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-white text-black hover:bg-[#FF7A00] hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-semibold transition-colors whitespace-nowrap cursor-pointer ml-1 shadow-md"
        >
          <span>Explore ↓</span>
        </button>
      </div>

      {/* ----------------- MODAL 1: PROJECTS SHOWCASE (WHEN BOOKS ARE CLICKED) ----------------- */}
      {activeModal === "projects" && (
        <div className="absolute inset-0 z-40 flex items-center justify-end p-4 sm:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#111317]/95 border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#FF7A00]" />
                <h3 className="font-mono text-xs tracking-[0.22em] uppercase text-white/90">
                  SELECTED COMMISSIONS // BOOKS
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white/60" />
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

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  handleCloseModal();
                  onEnterPortfolio();
                  if (onNavigateToSection) onNavigateToSection("monument-exhibition");
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-[#FF7A00] hover:text-white transition-colors"
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
        <div className="absolute inset-0 z-40 flex items-center justify-end p-4 sm:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#111317]/95 border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-[#FF7A00]" />
                <h3 className="font-mono text-xs tracking-[0.22em] uppercase text-white/90">
                  LIFE BEYOND CODE // THE DESK
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white/60" />
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

      {/* ----------------- MODAL 3: TERMINAL EASTER EGG (WHEN KEYBOARD IS CLICKED) ----------------- */}
      {activeModal === "terminal" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0D0E12] border border-white/20 rounded-xl p-6 text-white shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-white/80">soham@atelier: ~</span>
              </div>
              <button onClick={handleCloseModal} className="p-1 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-white/80">
              <p className="text-emerald-400">$ whoami</p>
              <p className="text-white/60">Soham Roychoudhury — AI/ML Engineer & Frontend Architect</p>
              <p className="text-emerald-400 mt-3">$ uptime</p>
              <p className="text-white/60">Crafting systems with precision and serenity since 2024</p>
              <p className="text-emerald-400 mt-3">$ ls -la /skills</p>
              <p className="text-white/60">drwxr-xr-x  Three.js WebGL PyTorch Next.js GSAP TypeScript</p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[10px] tracking-wider uppercase text-white"
              >
                Close Terminal [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Studio3DWorkspace.displayName = "Studio3DWorkspace";
