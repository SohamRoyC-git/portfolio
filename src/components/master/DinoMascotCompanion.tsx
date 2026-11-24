"use client";

import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Volume2, VolumeX, MessageSquare, Send, X, Sparkles, Music, Headphones } from "lucide-react";

interface DinoMascotCompanionProps {
  scrollerRef?: React.RefObject<HTMLDivElement | null>;
  onScrollToTop?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "dino" | "user";
  text: string;
  timestamp: string;
}

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  projects:
    "🦖 Soham's flagship works include:\n• Apekon Logistics Engine: 278-Key Sub-Millisecond in-memory localization system with WebGL disintegration transitions.\n• 3D Studio Workspace: Fully tactile Three.js room with interactive mechanical keyboards, CRT monitors, and audio synthesizers.\n• IziEat Global Platform: Enterprise agricultural supply chain platform connecting international commodity trade routes.\n• Monumental Creed Manifesto: Spatial computing interface exploring the intersection of raw performance and digital poise.",
  tech:
    "🦖 Soham's core technical stack includes:\n• Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS.\n• Kinetics & 3D: GSAP & ScrollTrigger, Three.js, Custom WebGL/GLSL shaders.\n• Systems & Architecture: Node.js, Python, In-Memory Caching, High-Concurrence Data Pipelines.\n• Design & Spatial: Figma, Blender, CADD, and High-Precision Spatial Couture.",
  creed:
    "🦖 The Architectural Creed is Soham's 4-pillar design philosophy:\n1. Spatial Poise: Interfaces built as architectural monuments rather than static flat pages.\n2. Sub-Millisecond Precision: Zero perceptible latency with client-side localization and in-memory caches.\n3. Tactile Feedback: Deep mechanical and physical interaction in every movement.\n4. Autonomous Intelligence: AI-native companions and autonomous digital environments.",
  hire:
    "🦖 Yes! Soham is available for high-impact full-stack development, creative engineering, and spatial computing architecture. You can connect via the terminal at the bottom of the page or directly through LinkedIn!",
  dino:
    "🦖 That's me! I'm Soham's portfolio companion. I rock this oversized matte-black streetwear hoodie and retro studio headphones because I love deep bass and good grooves. Right now, I'm jamming to Michael Jackson's 'Chicago'!",
};

export const DinoMascotCompanion: React.FC<DinoMascotCompanionProps> = memo(
  ({ scrollerRef, onScrollToTop }) => {
    const [progress, setProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("HERO");
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isGrowing, setIsGrowing] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [showWaveBubble, setShowWaveBubble] = useState(false);
    const [isTypingQuestion, setIsTypingQuestion] = useState(false);
    const [isDinoSpeaking, setIsDinoSpeaking] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: "intro-1",
        sender: "dino",
        text: "Hey! 🦖 I'm Soham's companion. I'm currently jamming to Michael Jackson's 'Chicago' on my headphones! Ask me anything about Soham's projects, tech stack, or creative philosophy.",
        timestamp: "Just now",
      },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [notes, setNotes] = useState<{ id: number; symbol: string; x: number }[]>([]);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const modalBackdropRef = useRef<HTMLDivElement | null>(null);
    const modalStageRef = useRef<HTMLDivElement | null>(null);
    const chatConsoleRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Dock & Stage Puppet Rig Refs
    const dockDinoRef = useRef<HTMLDivElement | null>(null);
    const dockShadowRef = useRef<HTMLDivElement | null>(null);
    const stageDinoRef = useRef<HTMLDivElement | null>(null);
    const stageShadowRef = useRef<HTMLDivElement | null>(null);
    const leftEyelidRef = useRef<HTMLDivElement | null>(null);
    const rightEyelidRef = useRef<HTMLDivElement | null>(null);
    const stageLeftEyelidRef = useRef<HTMLDivElement | null>(null);
    const stageRightEyelidRef = useRef<HTMLDivElement | null>(null);
    const stageMouthRef = useRef<HTMLDivElement | null>(null);
    const noteIdRef = useRef(0);

    // Circular Progress Perimeter Ring (r=46)
    const circumference = 2 * Math.PI * 46;
    const strokeDashoffset = circumference - progress * circumference;

    // Floating music notes
    const emitMusicNote = useCallback(() => {
      const symbols = ["♪", "♫", "♩", "♬", "✨"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const id = ++noteIdRef.current;
      const x = Math.random() * 36 - 18;

      setNotes((prev) => [...prev.slice(-3), { id, symbol, x }]);
      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }, 1600);
    }, []);

    // 1. Audio Control: Quiet by default! Only plays when visitor taps his headphones
    const toggleHeadphoneAudio = useCallback(
      (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!audioRef.current) return;

        if (isPlayingAudio) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
        } else {
          audioRef.current.volume = 0.24; // mellow headphone-bleed level
          audioRef.current
            .play()
            .then(() => {
              setIsPlayingAudio(true);
              emitMusicNote();
            })
            .catch(() => {
              setIsPlayingAudio(false);
            });
        }
      },
      [isPlayingAudio, emitMusicNote]
    );

    // 2. Entry Greeting Bounce + Bubble
    useEffect(() => {
      if (hasGreeted || !dockDinoRef.current) return;

      const greetTimer = setTimeout(() => {
        setHasGreeted(true);
        setShowWaveBubble(true);

        gsap
          .timeline({
            onComplete: () => {
              setTimeout(() => setShowWaveBubble(false), 3800);
            },
          })
          .to(dockDinoRef.current, {
            y: -12,
            rotationZ: -5,
            duration: 0.22,
            ease: "power2.out",
          })
          .to(dockDinoRef.current, {
            y: 0,
            rotationZ: 5,
            duration: 0.22,
            ease: "power2.inOut",
          })
          .to(dockDinoRef.current, {
            y: -10,
            rotationZ: -4,
            duration: 0.2,
            ease: "power2.out",
          })
          .to(dockDinoRef.current, {
            y: 0,
            rotationZ: 0,
            duration: 0.3,
            ease: "elastic.out(1.2, 0.5)",
          });
      }, 1400);

      return () => clearTimeout(greetTimer);
    }, [hasGreeted]);

    // 3. Continuous 104 BPM 3D Dance Groove (No scroll-velocity shrinking!)
    useEffect(() => {
      const targetDino = isChatOpen ? stageDinoRef.current : dockDinoRef.current;
      const targetShadow = isChatOpen ? stageShadowRef.current : dockShadowRef.current;
      if (!targetDino) return;

      // 104 BPM = 0.577s per beat -> rhythmic 2-step hip sway & knee bounce
      const danceTl = gsap.timeline({ repeat: -1 });
      danceTl
        .to(targetDino, {
          y: 4,
          scaleY: 0.96,
          scaleX: 1.03,
          rotationZ: -2.6,
          rotationY: -5,
          duration: 0.285,
          ease: "sine.inOut",
        })
        .to(targetDino, {
          y: -2,
          scaleY: 1.01,
          scaleX: 0.99,
          rotationZ: 0,
          rotationY: 0,
          duration: 0.285,
          ease: "sine.inOut",
        })
        .to(targetDino, {
          y: 4,
          scaleY: 0.96,
          scaleX: 1.03,
          rotationZ: 2.6,
          rotationY: 5,
          duration: 0.285,
          ease: "sine.inOut",
        })
        .to(targetDino, {
          y: -2,
          scaleY: 1.01,
          scaleX: 0.99,
          rotationZ: 0,
          rotationY: 0,
          duration: 0.285,
          ease: "sine.inOut",
        });

      let shadowTl: gsap.core.Timeline | null = null;
      if (targetShadow) {
        shadowTl = gsap.timeline({ repeat: -1 });
        shadowTl
          .to(targetShadow, { scaleX: 1.08, opacity: 0.75, duration: 0.285, ease: "sine.inOut" })
          .to(targetShadow, { scaleX: 0.94, opacity: 0.5, duration: 0.285, ease: "sine.inOut" })
          .to(targetShadow, { scaleX: 1.08, opacity: 0.75, duration: 0.285, ease: "sine.inOut" })
          .to(targetShadow, { scaleX: 0.94, opacity: 0.5, duration: 0.285, ease: "sine.inOut" });
      }

      // Natural blink cycle every 3.5s
      const blinkInterval = setInterval(() => {
        const lids = isChatOpen
          ? [stageLeftEyelidRef.current, stageRightEyelidRef.current]
          : [leftEyelidRef.current, rightEyelidRef.current];
        if (!lids[0] || !lids[1]) return;

        gsap.to(lids, {
          scaleY: 1,
          duration: 0.09,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }, 3500);

      // Periodic music notes when audio is playing
      const noteInterval = setInterval(() => {
        if (isPlayingAudio) emitMusicNote();
      }, 2200);

      return () => {
        danceTl.kill();
        if (shadowTl) shadowTl.kill();
        clearInterval(blinkInterval);
        clearInterval(noteInterval);
      };
    }, [isChatOpen, isPlayingAudio, emitMusicNote]);

    // 4. Scroll Progress Tracking (No blob squish on scroll!)
    useEffect(() => {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollerEl = scrollerRef?.current;
            const currentY = scrollerEl ? scrollerEl.scrollTop : window.scrollY;
            const maxY = scrollerEl
              ? scrollerEl.scrollHeight - scrollerEl.clientHeight
              : document.documentElement.scrollHeight - window.innerHeight;

            const p = Math.min(1, Math.max(0, currentY / (maxY || 1)));
            setProgress(p);

            let sec = "HERO";
            if (p < 0.15) sec = "HERO";
            else if (p < 0.32) sec = "STATEMENT";
            else if (p < 0.65) sec = "CREED";
            else if (p < 0.88) sec = "COMMISSIONS";
            else sec = "MATRIX";
            setCurrentSection(sec);

            ticking = false;
          });
          ticking = true;
        }
      };

      const target = scrollerRef?.current || window;
      target.addEventListener("scroll", handleScroll, { passive: true });
      return () => target.removeEventListener("scroll", handleScroll);
    }, [scrollerRef]);

    // 5. Corner-to-Center Spatial Morph Growth
    const handleOpenChat = () => {
      if (isGrowing || isChatOpen) return;
      setShowWaveBubble(false);
      setIsChatOpen(true);

      if (audioRef.current && isPlayingAudio) {
        audioRef.current.volume = 0.28;
      }
    };

    useEffect(() => {
      if (!isChatOpen) return;
      if (!modalBackdropRef.current || !modalStageRef.current || !chatConsoleRef.current) return;

      gsap.fromTo(
        modalBackdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" }
      );

      const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
      gsap.fromTo(
        modalStageRef.current,
        {
          scale: 0.22,
          x: isDesktop ? 340 : 120,
          y: isDesktop ? 260 : 200,
          opacity: 0,
        },
        {
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "back.out(1.12)",
        }
      );

      gsap.fromTo(
        chatConsoleRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.25, ease: "power3.out" }
      );
    }, [isChatOpen]);

    const handleCloseChat = () => {
      if (isGrowing || !isChatOpen) return;
      setIsGrowing(true);

      if (modalStageRef.current && modalBackdropRef.current && chatConsoleRef.current) {
        gsap.to(chatConsoleRef.current, {
          opacity: 0,
          x: 40,
          duration: 0.25,
          ease: "power2.in",
        });

        const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
        gsap.to(modalStageRef.current, {
          scale: 0.22,
          x: isDesktop ? 340 : 120,
          y: isDesktop ? 260 : 200,
          opacity: 0,
          duration: 0.45,
          ease: "power3.in",
        });

        gsap.to(modalBackdropRef.current, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => {
            setIsChatOpen(false);
            setIsGrowing(false);
            if (audioRef.current && isPlayingAudio) {
              audioRef.current.volume = 0.24;
            }
          },
        });
      } else {
        setIsChatOpen(false);
        setIsGrowing(false);
      }
    };

    // 6. Interactive Eye-Gaze Tilt (Looking at what user is typing) & Mouth Lip-Sync
    useEffect(() => {
      if (!stageDinoRef.current) return;
      if (isTypingQuestion) {
        gsap.to(stageDinoRef.current, {
          rotationX: -10,
          rotationY: 14,
          duration: 0.35,
          ease: "power2.out",
        });
      } else {
        gsap.to(stageDinoRef.current, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }, [isTypingQuestion]);

    useEffect(() => {
      if (!stageMouthRef.current) return;
      if (isDinoSpeaking) {
        gsap.to(stageMouthRef.current, {
          opacity: 1,
          scaleY: 1,
          duration: 0.11,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      } else {
        gsap.to(stageMouthRef.current, {
          opacity: 0,
          scaleY: 0.2,
          duration: 0.15,
          ease: "power1.out",
        });
      }
    }, [isDinoSpeaking]);

    // 7. Chat Submission
    const handleSendMessage = (textToSend?: string) => {
      const query = (textToSend || inputValue).trim();
      if (!query) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTypingQuestion(false);
      setIsDinoSpeaking(true);

      setTimeout(() => {
        let replyText = "";
        const lower = query.toLowerCase();

        if (lower.includes("project") || lower.includes("work") || lower.includes("built")) {
          replyText = KNOWLEDGE_RESPONSES.projects;
        } else if (lower.includes("tech") || lower.includes("stack") || lower.includes("languages")) {
          replyText = KNOWLEDGE_RESPONSES.tech;
        } else if (lower.includes("creed") || lower.includes("philosophy") || lower.includes("architectural")) {
          replyText = KNOWLEDGE_RESPONSES.creed;
        } else if (lower.includes("hire") || lower.includes("contact") || lower.includes("freelance") || lower.includes("email")) {
          replyText = KNOWLEDGE_RESPONSES.hire;
        } else if (lower.includes("dino") || lower.includes("you") || lower.includes("chicago") || lower.includes("hoodie")) {
          replyText = KNOWLEDGE_RESPONSES.dino;
        } else {
          replyText = `🦖 I heard you say "${query}"! Soham specializes in Next.js 16, Three.js 3D web spaces, GSAP kinetics, and ultra-low-latency architectures. You can ask me about his flagship projects, tech stack, or architectural creed!`;
        }

        const dinoReply: ChatMessage = {
          id: `dino-${Date.now()}`,
          sender: "dino",
          text: replyText,
          timestamp: "Just now",
        };

        setMessages((prev) => [...prev, dinoReply]);
        setIsDinoSpeaking(false);
        emitMusicNote();
      }, 750);
    };

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isDinoSpeaking]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isChatOpen) {
          handleCloseChat();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isChatOpen]);

    // ─────────────────────────────────────────────────────────────
    // Reusable 3D Dino Puppet Component (Transparent PNG + Rigged Overlays)
    // ─────────────────────────────────────────────────────────────
    const render3DDinoPuppet = (isLargeStage: boolean) => (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: "900px" }}
      >
        {/* Ground Contact Shadow */}
        <div
          ref={isLargeStage ? stageShadowRef : dockShadowRef}
          className="absolute bottom-[3%] w-[56%] h-[8%] rounded-full bg-black/70 blur-md pointer-events-none"
        />

        {/* Animated 3D Dino Body */}
        <div
          ref={isLargeStage ? stageDinoRef : dockDinoRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformOrigin: "50% 92%", transformStyle: "preserve-3d" }}
        >
          <img
            src="/assets/dino_model_3d.png"
            alt="3D Chibi Dino wearing black hoodie and studio headphones"
            draggable={false}
            className="w-full h-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.65)] select-none pointer-events-none"
          />

          {/* Natural Eyelid Blink Overlays (Positioned accurately over 3D eyes) */}
          <div
            ref={isLargeStage ? stageLeftEyelidRef : leftEyelidRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: "30.5%",
              top: "25%",
              width: "9.5%",
              height: "10%",
              backgroundColor: "#A6CA7E",
              transform: "scaleY(0)",
              transformOrigin: "top center",
            }}
          />
          <div
            ref={isLargeStage ? stageRightEyelidRef : rightEyelidRef}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: "69%",
              top: "25%",
              width: "9.5%",
              height: "10%",
              backgroundColor: "#9EC278",
              transform: "scaleY(0)",
              transformOrigin: "top center",
            }}
          />

          {/* Animated Speaking Mouth Overlay (Activates during Dino replies) */}
          {isLargeStage && (
            <div
              ref={stageMouthRef}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: "50.5%",
                top: "38.2%",
                width: "7%",
                height: "4.5%",
                background: "radial-gradient(circle, #FF7B8E 30%, #3E1920 95%)",
                border: "1.5px solid #1C231A",
                opacity: 0,
                transform: "translate(-50%, -50%) scaleY(0.2)",
              }}
            />
          )}

          {/* Glowing Amber LED Pulse Overlays on Earcups (Active when Chicago is playing) */}
          {isPlayingAudio && (
            <>
              <div
                className="absolute rounded-full pointer-events-none animate-ping"
                style={{
                  left: "7%",
                  top: "24%",
                  width: "8%",
                  height: "15%",
                  background: "radial-gradient(circle, rgba(255,140,56,0.55) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none animate-ping"
                style={{
                  right: "7%",
                  top: "24%",
                  width: "8%",
                  height: "15%",
                  background: "radial-gradient(circle, rgba(255,140,56,0.55) 0%, transparent 70%)",
                }}
              />
            </>
          )}

          {/* Clickable Headphone Hitboxes (Left Earcup, Right Earcup, Headband) */}
          <button
            type="button"
            id={isLargeStage ? "stage-headphones-left" : "headphones"}
            onClick={toggleHeadphoneAudio}
            aria-label={isPlayingAudio ? "Pause MJ Chicago" : "Want to hear what Dino is hearing? Tap his headphones"}
            title={isPlayingAudio ? "Pause MJ Chicago" : "Tap headphones to listen to MJ - Chicago!"}
            className="absolute cursor-pointer bg-transparent border-0 outline-none z-10"
            style={{ left: "3%", top: "17%", width: "16%", height: "23%" }}
          />
          <button
            type="button"
            onClick={toggleHeadphoneAudio}
            aria-label={isPlayingAudio ? "Pause MJ Chicago" : "Want to hear what Dino is hearing? Tap his headphones"}
            title={isPlayingAudio ? "Pause MJ Chicago" : "Tap headphones to listen to MJ - Chicago!"}
            className="absolute cursor-pointer bg-transparent border-0 outline-none z-10"
            style={{ right: "3%", top: "17%", width: "16%", height: "23%" }}
          />
          <button
            type="button"
            onClick={toggleHeadphoneAudio}
            aria-label={isPlayingAudio ? "Pause MJ Chicago" : "Want to hear what Dino is hearing? Tap his headphones"}
            title={isPlayingAudio ? "Pause MJ Chicago" : "Tap headphones to listen to MJ - Chicago!"}
            className="absolute cursor-pointer bg-transparent border-0 outline-none z-10"
            style={{ left: "20%", top: "2%", width: "60%", height: "14%" }}
          />
        </div>
      </div>
    );

    return (
      <>
        {/* Audio Loop: Michael Jackson - Chicago (Quiet until visitor taps headphones!) */}
        <audio
          ref={audioRef}
          src="/assets/chicago_mj_preview.m4a"
          loop
          preload="auto"
          aria-label="Chicago by Michael Jackson"
        />

        {/* ══════════════════════════════════════════════════════════════
            CORNER DOCKED 3D DINO POD
        ══════════════════════════════════════════════════════════════ */}
        <aside
          aria-label="Dino Companion & Scroll Tracker"
          className={`fixed bottom-14 right-4 sm:bottom-8 sm:right-8 z-40 flex items-end gap-3 select-none pointer-events-auto transition-opacity duration-300 ${
            isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating Prompts Stack */}
          <div className="flex flex-col items-end gap-2 mb-2">
            {/* Entry Wave Greeting Bubble */}
            {showWaveBubble && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0E1117]/95 border border-[#8CE56C]/45 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md animate-bounce">
                <span className="text-sm">👋</span>
                <span className="font-sans text-[11px] sm:text-[12px] font-bold text-[#FAF6EE]">
                  Hey! I&apos;m Dino!
                </span>
              </div>
            )}

            {/* Audio Prompt: "Want to hear what Dino is hearing? Tap his headphones" */}
            <button
              type="button"
              onClick={toggleHeadphoneAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1016]/95 border shadow-[0_8px_30px_rgba(0,0,0,0.75)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 ${
                isPlayingAudio
                  ? "border-[#FF8C38]/60 text-[#FF8C38]"
                  : "border-[#EAD7C0]/25 text-[#EAD7C0] hover:border-[#FF8C38]/60"
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#FF8C38] shrink-0" />
              <span className="font-mono text-[9.5px] sm:text-[10px] tracking-wide font-medium text-left">
                {isPlayingAudio
                  ? "Listening to Chicago (MJ) 🎶"
                  : "Want to hear what Dino is hearing? Tap his headphones 🎧"}
              </span>
            </button>

            {/* "Want to chat?" Bar */}
            <button
              type="button"
              id="btn-open-dino-chat"
              onClick={handleOpenChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1016]/95 border border-[#8CE56C]/40 shadow-[0_8px_30px_rgba(0,0,0,0.75)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#8CE56C]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#8CE56C]" />
              <span className="font-mono text-[10px] tracking-wider text-[#EAD7C0] font-bold">
                Want to chat?
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#8CE56C]/20 text-[#8CE56C] font-semibold">
                TALK 💬
              </span>
            </button>

            {/* Section Telemetry Pill */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0E1015]/80 border border-[#EAD7C0]/15 backdrop-blur-sm transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 sm:opacity-75"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] animate-pulse" />
              <span className="font-mono text-[9px] tracking-wider text-[#EAD7C0] uppercase font-bold">
                {currentSection}
              </span>
              <span className="font-mono text-[9px] text-[#CBB59D]/60">•</span>
              <span className="font-mono text-[9px] tracking-widest text-[#FF8C38] font-bold">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* 3D Dino Corner Stage */}
          <div
            onClick={handleOpenChat}
            className="relative w-24 h-30 sm:w-28 sm:h-36 flex items-end justify-center cursor-pointer group"
            role="button"
            tabIndex={0}
            title="Dino: Tap to chat or tap his headphones to listen!"
          >
            {/* Circular Progress Gauge */}
            <svg
              className="absolute inset-x-0 bottom-0 w-24 h-24 sm:w-28 sm:h-28 -rotate-90 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(234, 215, 192, 0.12)"
                strokeWidth="2.2"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#8CE56C"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150 ease-out filter drop-shadow-[0_0_5px_#8CE56C]"
              />
            </svg>

            {/* Floating Music Notes */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {notes.map((note) => (
                <span
                  key={note.id}
                  className="absolute text-[14px] text-[#FF8C38] font-bold animate-ping pointer-events-none"
                  style={{
                    left: `calc(50% + ${note.x}px)`,
                    top: "-12px",
                    animationDuration: "1.2s",
                  }}
                >
                  {note.symbol}
                </span>
              ))}
            </div>

            {/* Frosted Pedestal Disc */}
            <div className="relative w-22 h-22 sm:w-26 sm:h-26 mb-1 rounded-full bg-[#0D1016]/85 border border-[#EAD7C0]/20 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-end justify-center overflow-visible transition-transform duration-300 group-hover:scale-105 group-hover:border-[#8CE56C]/45">
              <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_50%_110%,rgba(140,229,108,0.22)_0%,transparent_70%)]" />

              {/* 3D Dino Standing on Pedestal */}
              <div className="w-22 h-30 sm:w-26 sm:h-34 -mb-1 overflow-visible">
                {render3DDinoPuppet(false)}
              </div>

              {/* Audio Mute/Play Indicator Badge */}
              <button
                type="button"
                onClick={toggleHeadphoneAudio}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[#141822] border border-[#EAD7C0]/30 shadow-md hover:scale-110 transition-all z-20"
                title={isPlayingAudio ? "Pause MJ Chicago" : "Listen to what Dino is hearing"}
              >
                {isPlayingAudio ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#FF8C38] animate-pulse" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#A0A6B5]" />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            EXPANDED SPLIT-STAGE CHATBOT MODAL (CORNER-TO-CENTER MORPH)
        ══════════════════════════════════════════════════════════════ */}
        {isChatOpen && (
          <div
            ref={modalBackdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Dino Chatbot Companion"
          >
            <div
              ref={modalStageRef}
              className="relative w-full max-w-4xl max-h-[88vh] h-[88vh] md:h-auto bg-[#0C0F14]/95 border border-[#8CE56C]/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseChat}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-[#141822]/80 border border-[#EAD7C0]/20 text-[#EAD7C0] hover:text-[#8CE56C] hover:border-[#8CE56C]/50 transition-all hover:scale-110"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Stage: Large 3D Dino Showcase */}
              <div className="md:w-5/12 bg-gradient-to-b from-[#141A22] to-[#0A0D12] border-b md:border-b-0 md:border-r border-[#8CE56C]/20 p-3 sm:p-6 shrink-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_60%,rgba(140,229,108,0.18)_0%,transparent_70%)]" />

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1016] border border-[#8CE56C]/30 z-10">
                  <span className="w-2 h-2 rounded-full bg-[#8CE56C] animate-pulse" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#EAD7C0] uppercase font-bold">
                    PORTFOLIO COMPANION
                  </span>
                </div>

                {/* Large Interactive 3D Dino */}
                <div className="my-1 sm:my-3 relative w-28 h-36 sm:w-52 sm:h-68 md:w-64 md:h-80 flex items-center justify-center">
                  {render3DDinoPuppet(true)}
                </div>

                {/* Music Player Bar */}
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0E121A]/80 border border-[#EAD7C0]/15 w-full justify-between z-10">
                  <div className="flex items-center gap-2 text-left">
                    <Music
                      className={`w-4 h-4 text-[#FF8C38] ${isPlayingAudio ? "animate-spin" : ""}`}
                      style={{ animationDuration: "6s" }}
                    />
                    <div>
                      <div className="font-mono text-[10px] text-[#EAD7C0] font-bold">CHICAGO</div>
                      <div className="font-mono text-[9px] text-[#CBB59D]/60">
                        {isPlayingAudio ? "Playing in headphones 🎶" : "Tap headphones to listen 🎧"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleHeadphoneAudio}
                    className="p-1.5 rounded-lg bg-[#151A24] border border-[#EAD7C0]/20 text-[#FF8C38] hover:scale-105"
                    title={isPlayingAudio ? "Pause" : "Play"}
                  >
                    {isPlayingAudio ? (
                      <Volume2 className="w-3.5 h-3.5 text-[#FF8C38]" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right Stage: Interactive Chat Console */}
              <div
                ref={chatConsoleRef}
                className="flex-1 min-h-0 md:w-7/12 p-4 sm:p-6 flex flex-col justify-between bg-[#0C0F14]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#EAD7C0]/10">
                  <div>
                    <h3 className="font-mono text-[12px] sm:text-[13px] tracking-wider text-[#FAF6EE] font-bold uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8CE56C]" />
                      Dino Assistant
                    </h3>
                    <p className="font-mono text-[10px] text-[#CBB59D]/60">
                      Watches you type &amp; responds live
                    </p>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#8CE56C]/20 text-[#8CE56C] font-semibold border border-[#8CE56C]/30 mr-8 md:mr-10">
                    ONLINE
                  </span>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                          msg.sender === "user"
                            ? "bg-[#8CE56C] text-[#0B0E12] font-semibold rounded-br-none shadow-md"
                            : "bg-[#141822] text-[#EAD7C0] border border-[#EAD7C0]/15 rounded-bl-none shadow-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isDinoSpeaking && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#141822] border border-[#8CE56C]/30 text-[#8CE56C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping" />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="pt-2 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => handleSendMessage("Tell me about Soham's top projects")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    ⚡ Top Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage("What is his tech stack?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🛠️ Tech Stack
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage("Explain the Architectural Creed")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🏛️ Creed Manifesto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage("How can I get in touch with Soham?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    💼 Hire / Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage("Why are you wearing a black hoodie and headphones?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🦖 About Dino
                  </button>
                </div>

                {/* Freeform Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 pt-2 border-t border-[#EAD7C0]/10"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onFocus={() => setIsTypingQuestion(true)}
                    onBlur={() => setIsTypingQuestion(false)}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsTypingQuestion(true);
                    }}
                    placeholder="Ask Dino about Soham's portfolio..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#141822] border border-[#EAD7C0]/20 text-[#FAF6EE] text-xs sm:text-[13px] placeholder:text-[#CBB59D]/40 focus:outline-none focus:border-[#8CE56C] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-2.5 rounded-xl bg-[#8CE56C] text-[#0C0F14] hover:bg-[#A3ED87] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

DinoMascotCompanion.displayName = "DinoMascotCompanion";
