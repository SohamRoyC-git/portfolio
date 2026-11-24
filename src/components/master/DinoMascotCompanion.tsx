"use client";

import React, { memo, useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Volume2, VolumeX, MessageSquare, Send, X, Sparkles, Music } from "lucide-react";

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
    "🦖 That's me! I'm Soham's portfolio companion. I rock an oversized black streetwear hoodie and studio monitor headphones because I love deep bass and good music. Right now, I'm jamming to Michael Jackson's 'Chicago'!",
};

export const DinoMascotCompanion: React.FC<DinoMascotCompanionProps> = memo(
  ({ scrollerRef, onScrollToTop }) => {
    // States
    const [progress, setProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("HERO");
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasWaved, setHasWaved] = useState(false);
    const [showWaveBubble, setShowWaveBubble] = useState(false);
    const [showChatPrompt, setShowChatPrompt] = useState(false);
    const [isDinoSpeaking, setIsDinoSpeaking] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: "intro-1",
        sender: "dino",
        text: "Hey! 🦖 I'm Soham's companion. I'm currently vibing to Michael Jackson's 'Chicago' on my headphones! Ask me anything about Soham's projects, tech stack, or creative philosophy.",
        timestamp: "Just now",
      },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [notes, setNotes] = useState<{ id: number; symbol: string; x: number }[]>([]);

    // Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mascotRootRef = useRef<SVGSVGElement | null>(null);
    const wavingArmRef = useRef<SVGGElement | null>(null);
    const leftEyeRef = useRef<SVGGElement | null>(null);
    const rightEyeRef = useRef<SVGGElement | null>(null);
    const tailRef = useRef<SVGGElement | null>(null);
    const mouthRef = useRef<SVGPathElement | null>(null);
    const drawstringsRef = useRef<SVGGElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevScrollY = useRef(0);
    const noteIdRef = useRef(0);

    // Progress Ring Circumference (r = 44 => 2 * PI * 44 ≈ 276.46)
    const circumference = 2 * Math.PI * 44;
    const strokeDashoffset = circumference - progress * circumference;

    // Trigger floating musical notes
    const emitMusicNote = useCallback(() => {
      const symbols = ["♪", "♫", "♩", "♬", "✨"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const id = ++noteIdRef.current;
      const x = Math.random() * 32 - 16;

      setNotes((prev) => [...prev.slice(-3), { id, symbol, x }]);
      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }, 1600);
    }, []);

    // 1. Audio Playback Control (Michael Jackson - Chicago)
    const tryPlayAudio = useCallback(() => {
      if (!audioRef.current) return;
      audioRef.current.volume = 0.22; // subtle headphone leakage volume
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(() => {
          // Autoplay policy prevented immediate playback; waiting for user gesture
          setIsPlayingAudio(false);
        });
    }, []);

    // Initialize audio on first user gesture anywhere on the page
    useEffect(() => {
      const handleFirstInteraction = () => {
        if (!isMuted && audioRef.current && audioRef.current.paused) {
          tryPlayAudio();
        }
        window.removeEventListener("pointerdown", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      };

      window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
      window.addEventListener("keydown", handleFirstInteraction, { passive: true });

      // Try autoplaying right away
      tryPlayAudio();

      return () => {
        window.removeEventListener("pointerdown", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      };
    }, [tryPlayAudio, isMuted]);

    const toggleMute = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!audioRef.current) return;
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
        setIsMuted(false);
        setIsPlayingAudio(true);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
        setIsPlayingAudio(false);
      }
    };

    // 2. Wave Animation on Site Entry
    useEffect(() => {
      if (hasWaved || !wavingArmRef.current) return;

      const waveDelay = setTimeout(() => {
        setShowWaveBubble(true);
        setHasWaved(true);

        const waveTl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => setShowWaveBubble(false), 3800);
          },
        });

        // Joyful wave motion: 3 distinct back-and-forth arm waves
        waveTl
          .to(wavingArmRef.current, {
            rotation: 26,
            duration: 0.26,
            ease: "power2.out",
          })
          .to(wavingArmRef.current, {
            rotation: -8,
            duration: 0.26,
            repeat: 4,
            yoyo: true,
            ease: "sine.inOut",
          })
          .to(wavingArmRef.current, {
            rotation: 0,
            duration: 0.35,
            ease: "power1.out",
          });
      }, 1500);

      return () => clearTimeout(waveDelay);
    }, [hasWaved]);

    // 3. Idle Head-Bobbing to "Chicago" by MJ (~104 BPM chill groove)
    useEffect(() => {
      if (!mascotRootRef.current) return;

      // 104 BPM = ~0.58s per beat
      const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
      idleTl.to(mascotRootRef.current, {
        y: 3.5,
        scaleY: 0.96,
        scaleX: 1.03,
        duration: 0.58,
        ease: "sine.inOut",
      });

      // Tail wagging
      let tailTween: gsap.core.Tween | null = null;
      if (tailRef.current) {
        tailTween = gsap.to(tailRef.current, {
          rotation: 7,
          duration: 0.85,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Drawstrings swinging
      let stringTween: gsap.core.Tween | null = null;
      if (drawstringsRef.current) {
        stringTween = gsap.to(drawstringsRef.current, {
          rotation: 5,
          transformOrigin: "76px 106px",
          duration: 1.16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Cute round eye blink cycle every ~3.5 seconds
      const blinkInterval = setInterval(() => {
        if (!leftEyeRef.current || !rightEyeRef.current) return;
        gsap.to([leftEyeRef.current, rightEyeRef.current], {
          scaleY: 0.1,
          transformOrigin: "center center",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }, 3500);

      // Periodic music note release
      const noteInterval = setInterval(() => {
        if (isPlayingAudio && !isMuted) {
          emitMusicNote();
        }
      }, 2600);

      return () => {
        idleTl.kill();
        if (tailTween) tailTween.kill();
        if (stringTween) stringTween.kill();
        clearInterval(blinkInterval);
        clearInterval(noteInterval);
      };
    }, [isPlayingAudio, isMuted, emitMusicNote]);

    // 4. Scroll Tracking & Velocity Reaction
    useEffect(() => {
      const getScrollTarget = () => {
        if (scrollerRef && scrollerRef.current) return scrollerRef.current;
        return window;
      };

      const target = getScrollTarget();
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollerEl = scrollerRef?.current;
            let currentY = 0;
            let maxY = 1;

            if (scrollerEl) {
              currentY = scrollerEl.scrollTop;
              maxY = scrollerEl.scrollHeight - scrollerEl.clientHeight;
            } else {
              currentY = window.scrollY;
              maxY = document.documentElement.scrollHeight - window.innerHeight;
            }

            const p = Math.min(1, Math.max(0, currentY / (maxY || 1)));
            setProgress(p);

            // Section Identification
            let sec = "HERO";
            if (p < 0.15) sec = "HERO";
            else if (p < 0.32) sec = "STATEMENT";
            else if (p < 0.65) sec = "CREED";
            else if (p < 0.88) sec = "COMMISSIONS";
            else sec = "MATRIX";
            setCurrentSection(sec);

            // Scroll velocity
            const deltaY = currentY - prevScrollY.current;
            prevScrollY.current = currentY;

            setIsScrolling(true);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
              setIsScrolling(false);
            }, 1800);

            // Velocity Squash & Stretch
            if (mascotRootRef.current && !isChatOpen) {
              const clamped = Math.max(-35, Math.min(35, deltaY));
              const squish = Math.abs(clamped) * 0.003;
              gsap.to(mascotRootRef.current, {
                y: clamped * 0.15,
                scaleY: 1 - squish,
                scaleX: 1 + squish * 0.8,
                duration: 0.14,
                ease: "power1.out",
                overwrite: "auto",
                onComplete: () => {
                  gsap.to(mascotRootRef.current, {
                    y: 0,
                    scaleY: 1,
                    scaleX: 1,
                    duration: 0.5,
                    ease: "elastic.out(1.2, 0.45)",
                  });
                },
              });
            }

            ticking = false;
          });
          ticking = true;
        }
      };

      if (scrollerRef && scrollerRef.current) {
        scrollerRef.current.addEventListener("scroll", handleScroll, { passive: true });
      } else {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }

      return () => {
        if (scrollerRef && scrollerRef.current) {
          scrollerRef.current.removeEventListener("scroll", handleScroll);
        } else {
          window.removeEventListener("scroll", handleScroll);
        }
      };
    }, [scrollerRef, isChatOpen]);

    // 5. Chat Interaction
    const handleOpenChat = () => {
      setIsChatOpen(true);
      setShowChatPrompt(false);
      setShowWaveBubble(false);

      // Boost volume slightly for interactive chat mood
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = 0.28;
      }
    };

    const handleCloseChat = () => {
      setIsChatOpen(false);
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = 0.22;
      }
    };

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
      setIsDinoSpeaking(true);

      // Animate Dino Speaking (mouth wiggle + happy head nod)
      if (mouthRef.current) {
        gsap.to(mouthRef.current, {
          scaleY: 1.4,
          transformOrigin: "center center",
          duration: 0.15,
          repeat: 7,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Generate Knowledge Response
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
      }, 700);
    };

    // Auto-scroll chat to bottom
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isDinoSpeaking]);

    // Handle Escape key to close chat
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isChatOpen) {
          handleCloseChat();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isChatOpen]);

    return (
      <>
        {/* Hidden Audio Loop: Michael Jackson - Chicago */}
        <audio
          ref={audioRef}
          src="/assets/chicago_mj_preview.m4a"
          loop
          preload="auto"
          aria-label="Chicago by Michael Jackson"
        />

        {/* ══════════════════════════════════════════════════════════════
            CORNER DOCKED MASCOT POD (PROMINENT ~105px)
        ══════════════════════════════════════════════════════════════ */}
        <aside
          aria-label="Dino Companion & Scroll Tracker"
          className="fixed bottom-14 right-4 sm:bottom-8 sm:right-8 z-40 flex items-end gap-3 select-none pointer-events-auto"
          onMouseEnter={() => {
            setIsHovered(true);
            setShowChatPrompt(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowChatPrompt(false);
          }}
        >
          {/* Floating Speech / Interaction Pill (Wave Greeting or "Want to chat?") */}
          <div className="flex flex-col items-end gap-2 mb-3">
            {/* Entry Wave Greeting Bubble */}
            {showWaveBubble && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0E1117]/95 border border-[#8CE56C]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md animate-bounce">
                <span className="text-sm">👋</span>
                <span className="font-sans text-[11px] sm:text-[12px] font-bold text-[#FAF6EE]">
                  Hey! I&apos;m Dino. Vibe with me!
                </span>
              </div>
            )}

            {/* "Want to chat?" Popup Bar */}
            <div
              onClick={handleOpenChat}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1016]/90 border border-[#8CE56C]/30 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-[#8CE56C] ${
                isHovered || isScrolling || showChatPrompt
                  ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-x-3 scale-95 pointer-events-none sm:opacity-90 sm:translate-x-0 sm:scale-100"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#8CE56C]" />
              <span className="font-mono text-[10px] tracking-wider text-[#EAD7C0] font-bold">
                Want to chat?
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#8CE56C]/20 text-[#8CE56C] font-semibold">
                TALK 💬
              </span>
            </div>

            {/* Telemetry Indicator Pill */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0E1015]/80 border border-[#EAD7C0]/15 backdrop-blur-sm transition-all duration-300 ${
                isHovered || isScrolling ? "opacity-100" : "opacity-0 sm:opacity-75"
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

          {/* Dino Mascot Stage in Corner */}
          <div
            onClick={handleOpenChat}
            className="relative w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center cursor-pointer group"
            role="button"
            tabIndex={0}
            title="Dino Mascot: Listening to Chicago by MJ (Click to chat!)"
          >
            {/* SVG Circular Progress Perimeter Ring */}
            <svg
              className="absolute inset-x-0 bottom-0 w-20 h-20 sm:w-24 sm:h-24 -rotate-90 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(234, 215, 192, 0.12)"
                strokeWidth="2.5"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
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
                  className="absolute text-[13px] text-[#FF8C38] font-bold animate-ping pointer-events-none"
                  style={{
                    left: `calc(50% + ${note.x}px)`,
                    top: "-15px",
                    animationDuration: "1.2s",
                  }}
                >
                  {note.symbol}
                </span>
              ))}
            </div>

            {/* Frosted Dock Disc Base */}
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#0D1016]/90 border border-[#EAD7C0]/25 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center justify-center overflow-visible transition-transform duration-300 group-hover:scale-105 group-hover:border-[#8CE56C]/50">
              {/* Cozy Ambient Horizon Glow */}
              <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(140,229,108,0.25)_0%,transparent_70%)]" />

              {/* The Dino Mascot (SVG Illustration) */}
              <svg
                ref={mascotRootRef}
                viewBox="0 0 170 190"
                className="w-20 h-22 sm:w-24 sm:h-26 overflow-visible transform origin-bottom"
              >
                {/* 1. Tail with Dorsal Plates */}
                <g ref={tailRef} id="tail-group" style={{ transformOrigin: "100px 145px" }}>
                  <path d="M 124 122 C 138 122, 140 136, 128 142" fill="#256B4A" stroke="#121814" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 134 140 C 146 142, 145 156, 131 156" fill="#256B4A" stroke="#121814" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 102 136 C 128 135, 148 145, 142 158 C 130 166, 110 156, 98 150 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                </g>

                {/* 2. Dorsal Plates along Back & Head */}
                <g id="dorsal-plates">
                  <path d="M 72 16 C 76 6, 94 6, 98 18" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 106 28 C 120 25, 126 39, 116 48" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 116 54 C 130 52, 134 68, 122 76" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 120 84 C 134 84, 136 100, 123 108" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                </g>

                {/* 3. Stubby Feet */}
                <g id="feet">
                  <path d="M 50 148 L 50 162 C 50 168, 66 168, 66 162 L 67 148 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                  <path d="M 54 163 Q 55 160 56 163 M 60 163 Q 61 160 62 163" stroke="#256B4A" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 88 148 L 88 162 C 88 168, 104 168, 104 162 L 103 148 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                  <path d="M 92 163 Q 93 160 94 163 M 98 163 Q 99 160 100 163" stroke="#256B4A" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* 4. Chubby Dino Body & Head */}
                <path
                  id="dino-body"
                  d="
                    M 42 54
                    C 30 70, 30 92, 44 108
                    C 38 120, 40 140, 50 152
                    L 104 152
                    C 116 142, 116 118, 112 104
                    C 122 88, 120 56, 106 36
                    C 88 18, 56 26, 42 54 Z
                  "
                  fill="#8CE56C"
                  stroke="#121814"
                  strokeWidth="3.4"
                  strokeLinejoin="round"
                />

                {/* 5. Cream Belly Patch */}
                <ellipse cx="76" cy="120" rx="22" ry="20" fill="#FFF8DC" stroke="#121814" strokeWidth="2.6" />

                {/* 6. Streetwear Open-Zipped Black Hoodie */}
                <g id="black-hoodie">
                  <path
                    d="
                      M 44 106
                      C 39 118, 40 138, 50 150
                      L 64 150
                      C 58 136, 56 122, 60 108
                      C 52 108, 46 106, 44 106 Z
                    "
                    fill="#14171D"
                    stroke="#0C0E12"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="
                      M 108 106
                      C 113 118, 112 138, 104 150
                      L 88 150
                      C 94 136, 96 122, 92 108
                      C 100 108, 106 106, 108 106 Z
                    "
                    fill="#14171D"
                    stroke="#0C0E12"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  <path d="M 44 100 C 60 110, 92 110, 108 100 C 104 94, 48 94, 44 100 Z" fill="#1A1E26" stroke="#0C0E12" strokeWidth="2.4" />
                  <path d="M 52 132 L 64 132 L 64 146 L 52 144 Z" fill="#1F242F" stroke="#2B313E" strokeWidth="1.4" />
                  <path d="M 100 132 L 88 132 L 88 146 L 100 144 Z" fill="#1F242F" stroke="#2B313E" strokeWidth="1.4" />

                  {/* Drawstrings */}
                  <g ref={drawstringsRef} id="drawstrings">
                    <path d="M 64 106 Q 63 118, 62 126" stroke="#383E4D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                    <circle cx="62" cy="127" r="1.8" fill="#FFF8DC" />
                    <path d="M 88 106 Q 89 118, 90 126" stroke="#383E4D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                    <circle cx="90" cy="127" r="1.8" fill="#FFF8DC" />
                  </g>
                </g>

                {/* 7. Chibi Face */}
                <g id="face">
                  <ellipse cx="48" cy="78" rx="7.5" ry="4.5" fill="#FFA35C" opacity="0.48" />
                  <ellipse cx="104" cy="78" rx="7.5" ry="4.5" fill="#FFA35C" opacity="0.48" />

                  {/* Cute Round Eyes */}
                  <g ref={leftEyeRef} id="left-eye">
                    <circle cx="56" cy="68" r="6" fill="#121814" />
                    <circle cx="58.2" cy="65.8" r="2" fill="#FFFFFF" />
                    <circle cx="54.8" cy="69.8" r="0.9" fill="#FFFFFF" opacity="0.75" />
                  </g>
                  <g ref={rightEyeRef} id="right-eye">
                    <circle cx="96" cy="68" r="6" fill="#121814" />
                    <circle cx="98.2" cy="65.8" r="2" fill="#FFFFFF" />
                    <circle cx="94.8" cy="69.8" r="0.9" fill="#FFFFFF" opacity="0.75" />
                  </g>

                  {/* :3 Mouth */}
                  <path
                    ref={mouthRef}
                    d="M 70 75 Q 73.5 80 77 76 Q 80.5 80 84 75"
                    fill="none"
                    stroke="#121814"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* 8. Arms */}
                <g id="arms">
                  <path d="M 46 102 C 38 108, 40 120, 50 122 C 54 118, 54 112, 50 104 Z" fill="#8CE56C" stroke="#121814" strokeWidth="2.8" strokeLinejoin="round" />
                  <g ref={wavingArmRef} id="waving-arm" style={{ transformOrigin: "104px 105px" }}>
                    <path d="M 102 102 C 114 104, 126 98, 126 84 C 120 80, 112 84, 104 94 Z" fill="#8CE56C" stroke="#121814" strokeWidth="2.8" strokeLinejoin="round" />
                    <path d="M 123 85 Q 125 87 126 84" stroke="#256B4A" strokeWidth="1.6" strokeLinecap="round" />
                  </g>
                </g>

                {/* 9. Retro Studio Headphones */}
                <g id="studio-headphones">
                  <path d="M 36 56 C 30 18, 122 18, 116 56" fill="none" stroke="#14171E" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 44 40 C 56 26, 96 26, 108 40" fill="none" stroke="#2B303E" strokeWidth="3" strokeLinecap="round" />
                  <rect x="34" y="52" width="4.5" height="8" rx="1.5" fill="#A0A6B5" />
                  <rect x="113.5" y="52" width="4.5" height="8" rx="1.5" fill="#A0A6B5" />

                  {/* Left Earcup */}
                  <g id="left-earcup">
                    <rect x="24" y="48" width="14" height="26" rx="7" fill="#12141A" stroke="#2D3342" strokeWidth="1.6" />
                    <rect x="33" y="50" width="4.5" height="22" rx="2" fill="#090A0D" />
                    <circle cx="31" cy="61" r="3" fill="#FF8C38" className="animate-pulse" />
                    <circle cx="31" cy="61" r="1.5" fill="#FFE5C2" />
                  </g>

                  {/* Right Earcup */}
                  <g id="right-earcup">
                    <rect x="114" y="48" width="14" height="26" rx="7" fill="#12141A" stroke="#2D3342" strokeWidth="1.6" />
                    <rect x="114.5" y="50" width="4.5" height="22" rx="2" fill="#090A0D" />
                    <circle cx="121" cy="61" r="3" fill="#FF8C38" className="animate-pulse" />
                    <circle cx="121" cy="61" r="1.5" fill="#FFE5C2" />
                  </g>
                </g>
              </svg>

              {/* Mute / Unmute Button on Dock Edge */}
              <button
                onClick={toggleMute}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[#141822] border border-[#EAD7C0]/30 text-[#FF8C38] shadow-md hover:scale-110 hover:border-[#FF8C38] transition-all"
                title={isMuted ? "Unmute MJ Chicago" : "Mute MJ Chicago"}
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-[#A0A6B5]" /> : <Volume2 className="w-3 h-3 text-[#FF8C38] animate-pulse" />}
              </button>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            EXPANDED MAIN ATTRACTION CHATBOT MODAL
        ══════════════════════════════════════════════════════════════ */}
        {isChatOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Dino Chatbot Companion"
          >
            {/* Modal Container */}
            <div className="relative w-full max-w-4xl max-h-[88vh] h-[88vh] md:h-auto bg-[#0C0F14]/95 border border-[#8CE56C]/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row">
              {/* Close Button */}
              <button
                onClick={handleCloseChat}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-[#141822]/80 border border-[#EAD7C0]/20 text-[#EAD7C0] hover:text-[#8CE56C] hover:border-[#8CE56C]/50 transition-all hover:scale-110"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Large Dino Showcase (The Main Attraction!) */}
              <div className="md:w-5/12 bg-gradient-to-b from-[#141A22] to-[#0A0D12] border-b md:border-b-0 md:border-r border-[#8CE56C]/20 p-3 sm:p-6 shrink-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
                {/* Ambient glow behind Dino */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_60%,rgba(140,229,108,0.18)_0%,transparent_70%)]" />

                {/* Dino Header Pill */}
                <div className="flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-[#0D1016] border border-[#8CE56C]/30 z-10">
                  <span className="w-2 h-2 rounded-full bg-[#8CE56C] animate-pulse" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#EAD7C0] uppercase font-bold">
                    PORTFOLIO COMPANION
                  </span>
                </div>

                {/* Large Interactive Dino Illustration (~300px on desktop, ~120px on mobile) */}
                <div className="my-1 sm:my-3 relative w-24 h-28 sm:w-48 sm:h-56 md:w-64 md:h-72 flex items-center justify-center">
                  <svg
                    viewBox="0 0 170 190"
                    className="w-full h-full overflow-visible transform"
                  >
                    {/* Tail */}
                    <g id="large-tail">
                      <path d="M 124 122 C 138 122, 140 136, 128 142" fill="#256B4A" stroke="#121814" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 134 140 C 146 142, 145 156, 131 156" fill="#256B4A" stroke="#121814" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 102 136 C 128 135, 148 145, 142 158 C 130 166, 110 156, 98 150 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                    </g>
                    {/* Dorsal Plates */}
                    <g id="large-dorsal">
                      <path d="M 72 16 C 76 6, 94 6, 98 18" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                      <path d="M 106 28 C 120 25, 126 39, 116 48" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                      <path d="M 116 54 C 130 52, 134 68, 122 76" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                      <path d="M 120 84 C 134 84, 136 100, 123 108" fill="#256B4A" stroke="#121814" strokeWidth="3.2" strokeLinecap="round" />
                    </g>
                    {/* Feet */}
                    <g id="large-feet">
                      <path d="M 50 148 L 50 162 C 50 168, 66 168, 66 162 L 67 148 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                      <path d="M 54 163 Q 55 160 56 163 M 60 163 Q 61 160 62 163" stroke="#256B4A" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 88 148 L 88 162 C 88 168, 104 168, 104 162 L 103 148 Z" fill="#8CE56C" stroke="#121814" strokeWidth="3.2" strokeLinejoin="round" />
                      <path d="M 92 163 Q 93 160 94 163 M 98 163 Q 99 160 100 163" stroke="#256B4A" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* Body */}
                    <path
                      d="
                        M 42 54
                        C 30 70, 30 92, 44 108
                        C 38 120, 40 140, 50 152
                        L 104 152
                        C 116 142, 116 118, 112 104
                        C 122 88, 120 56, 106 36
                        C 88 18, 56 26, 42 54 Z
                      "
                      fill="#8CE56C"
                      stroke="#121814"
                      strokeWidth="3.4"
                      strokeLinejoin="round"
                    />
                    <ellipse cx="76" cy="120" rx="22" ry="20" fill="#FFF8DC" stroke="#121814" strokeWidth="2.6" />
                    {/* Black Hoodie */}
                    <g id="large-hoodie">
                      <path d="M 44 106 C 39 118, 40 138, 50 150 L 64 150 C 58 136, 56 122, 60 108 C 52 108, 46 106, 44 106 Z" fill="#14171D" stroke="#0C0E12" strokeWidth="2.6" />
                      <path d="M 108 106 C 113 118, 112 138, 104 150 L 88 150 C 94 136, 96 122, 92 108 C 100 108, 106 106, 108 106 Z" fill="#14171D" stroke="#0C0E12" strokeWidth="2.6" />
                      <path d="M 44 100 C 60 110, 92 110, 108 100 C 104 94, 48 94, 44 100 Z" fill="#1A1E26" stroke="#0C0E12" strokeWidth="2.4" />
                      <path d="M 52 132 L 64 132 L 64 146 L 52 144 Z" fill="#1F242F" stroke="#2B313E" strokeWidth="1.4" />
                      <path d="M 100 132 L 88 132 L 88 146 L 100 144 Z" fill="#1F242F" stroke="#2B313E" strokeWidth="1.4" />
                      <path d="M 64 106 Q 63 118, 62 126" stroke="#383E4D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      <circle cx="62" cy="127" r="1.8" fill="#FFF8DC" />
                      <path d="M 88 106 Q 89 118, 90 126" stroke="#383E4D" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      <circle cx="90" cy="127" r="1.8" fill="#FFF8DC" />
                    </g>
                    {/* Face */}
                    <g id="large-face">
                      <ellipse cx="48" cy="78" rx="7.5" ry="4.5" fill="#FFA35C" opacity="0.48" />
                      <ellipse cx="104" cy="78" rx="7.5" ry="4.5" fill="#FFA35C" opacity="0.48" />
                      <g id="large-left-eye">
                        <circle cx="56" cy="68" r="6" fill="#121814" />
                        <circle cx="58.2" cy="65.8" r="2" fill="#FFFFFF" />
                        <circle cx="54.8" cy="69.8" r="0.9" fill="#FFFFFF" opacity="0.75" />
                      </g>
                      <g id="large-right-eye">
                        <circle cx="96" cy="68" r="6" fill="#121814" />
                        <circle cx="98.2" cy="65.8" r="2" fill="#FFFFFF" />
                        <circle cx="94.8" cy="69.8" r="0.9" fill="#FFFFFF" opacity="0.75" />
                      </g>
                      <path
                        d="M 70 75 Q 73.5 80 77 76 Q 80.5 80 84 75"
                        fill="none"
                        stroke="#121814"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    {/* Arms */}
                    <g id="large-arms">
                      <path d="M 46 102 C 38 108, 40 120, 50 122 C 54 118, 54 112, 50 104 Z" fill="#8CE56C" stroke="#121814" strokeWidth="2.8" strokeLinejoin="round" />
                      <path d="M 102 102 C 114 104, 126 98, 126 84 C 120 80, 112 84, 104 94 Z" fill="#8CE56C" stroke="#121814" strokeWidth="2.8" strokeLinejoin="round" />
                      <path d="M 123 85 Q 125 87 126 84" stroke="#256B4A" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                    {/* Headphones */}
                    <g id="large-headphones">
                      <path d="M 36 56 C 30 18, 122 18, 116 56" fill="none" stroke="#14171E" strokeWidth="7" strokeLinecap="round" />
                      <path d="M 44 40 C 56 26, 96 26, 108 40" fill="none" stroke="#2B303E" strokeWidth="3" strokeLinecap="round" />
                      <rect x="34" y="52" width="4.5" height="8" rx="1.5" fill="#A0A6B5" />
                      <rect x="113.5" y="52" width="4.5" height="8" rx="1.5" fill="#A0A6B5" />
                      <g id="large-left-earcup">
                        <rect x="24" y="48" width="14" height="26" rx="7" fill="#12141A" stroke="#2D3342" strokeWidth="1.6" />
                        <rect x="33" y="50" width="4.5" height="22" rx="2" fill="#090A0D" />
                        <circle cx="31" cy="61" r="3" fill="#FF8C38" className="animate-pulse" />
                        <circle cx="31" cy="61" r="1.5" fill="#FFE5C2" />
                      </g>
                      <g id="large-right-earcup">
                        <rect x="114" y="48" width="14" height="26" rx="7" fill="#12141A" stroke="#2D3342" strokeWidth="1.6" />
                        <rect x="114.5" y="50" width="4.5" height="22" rx="2" fill="#090A0D" />
                        <circle cx="121" cy="61" r="3" fill="#FF8C38" className="animate-pulse" />
                        <circle cx="121" cy="61" r="1.5" fill="#FFE5C2" />
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Music Player Status */}
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0E121A]/80 border border-[#EAD7C0]/15 w-full justify-between z-10">
                  <div className="flex items-center gap-2 text-left">
                    <Music className="w-4 h-4 text-[#FF8C38] animate-spin" style={{ animationDuration: "6s" }} />
                    <div>
                      <div className="font-mono text-[10px] text-[#EAD7C0] font-bold">CHICAGO</div>
                      <div className="font-mono text-[9px] text-[#CBB59D]/60">Michael Jackson (Xscape)</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg bg-[#151A24] border border-[#EAD7C0]/20 text-[#FF8C38] hover:scale-105"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF8C38]" />}
                  </button>
                </div>
              </div>

              {/* Right Side: Interactive Chat Conversation Console */}
              <div className="flex-1 min-h-0 md:w-7/12 p-4 sm:p-6 flex flex-col justify-between bg-[#0C0F14]">
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EAD7C0]/10">
                  <div>
                    <h3 className="font-mono text-[12px] sm:text-[13px] tracking-wider text-[#FAF6EE] font-bold uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8CE56C]" />
                      Dino Assistant
                    </h3>
                    <p className="font-mono text-[10px] text-[#CBB59D]/60">
                      Powered by portfolio knowledge base
                    </p>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#8CE56C]/20 text-[#8CE56C] font-semibold border border-[#8CE56C]/30">
                    ONLINE
                  </span>
                </div>

                {/* Conversation Scroll Area */}
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

                  {/* Dino Typing Indicator */}
                  {isDinoSpeaking && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#141822] border border-[#8CE56C]/30 text-[#8CE56C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CE56C] animate-ping" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="pt-2 pb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => handleSendMessage("Tell me about Soham's top projects")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    ⚡ Top Projects
                  </button>
                  <button
                    onClick={() => handleSendMessage("What is his tech stack?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🛠️ Tech Stack
                  </button>
                  <button
                    onClick={() => handleSendMessage("Explain the Architectural Creed")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🏛️ Creed Manifesto
                  </button>
                  <button
                    onClick={() => handleSendMessage("How can I get in touch with Soham?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    💼 Hire / Contact
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
                    onChange={(e) => setInputValue(e.target.value)}
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
