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
    "🦖 That's me! I'm Soham's portfolio companion. I wear this custom streetwear black hoodie and studio headphones because I love deep bass and good grooves. Right now, I'm jamming to Michael Jackson's 'Chicago'!",
};

export const DinoMascotCompanion: React.FC<DinoMascotCompanionProps> = memo(
  ({ scrollerRef, onScrollToTop }) => {
    // States
    const [progress, setProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("HERO");
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isGrowing, setIsGrowing] = useState(false);
    const [isTypingQuestion, setIsTypingQuestion] = useState(false);
    const [isDinoSpeaking, setIsDinoSpeaking] = useState(false);
    const [showHeadphonePrompt, setShowHeadphonePrompt] = useState(false);
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
    const dockContainerRef = useRef<HTMLDivElement | null>(null);
    const modalBackdropRef = useRef<HTMLDivElement | null>(null);
    const modalStageRef = useRef<HTMLDivElement | null>(null);
    const chatConsoleRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // SVG Layer Refs for Animation & Lip-Sync / Eye Tracking
    const danceRootRef = useRef<SVGGElement | null>(null);
    const leftArmRef = useRef<SVGGElement | null>(null);
    const rightArmRef = useRef<SVGGElement | null>(null);
    const tailRef = useRef<SVGGElement | null>(null);
    const eyesRef = useRef<SVGGElement | null>(null);
    const mouthRef = useRef<SVGPathElement | null>(null);
    const drawstringsRef = useRef<SVGGElement | null>(null);
    const leftEyeRef = useRef<SVGGElement | null>(null);
    const rightEyeRef = useRef<SVGGElement | null>(null);
    const noteIdRef = useRef(0);

    // Circular Progress Perimeter Ring (r=44)
    const circumference = 2 * Math.PI * 44;
    const strokeDashoffset = circumference - progress * circumference;

    // Trigger Floating Musical Notes
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

    // 1. Audio Control: "Want to hear what Dino is hearing? Tap his headphones"
    const toggleHeadphoneAudio = useCallback(
      (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!audioRef.current) return;

        if (isPlayingAudio) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
        } else {
          audioRef.current.volume = 0.24; // mellow, warm headphone bleed volume
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

    // 2. Full Chibi Dance Animation (~104 BPM groove to "Chicago" by MJ)
    useEffect(() => {
      if (!danceRootRef.current) return;

      // Hip sway and knee bounce: 104 BPM = ~0.58s per beat
      const danceTl = gsap.timeline({ repeat: -1 });
      danceTl
        .to(danceRootRef.current, {
          y: 4,
          rotation: -2.5,
          duration: 0.29,
          ease: "sine.inOut",
        })
        .to(danceRootRef.current, {
          y: 0,
          rotation: 0,
          duration: 0.29,
          ease: "sine.inOut",
        })
        .to(danceRootRef.current, {
          y: 4,
          rotation: 2.5,
          duration: 0.29,
          ease: "sine.inOut",
        })
        .to(danceRootRef.current, {
          y: 0,
          rotation: 0,
          duration: 0.29,
          ease: "sine.inOut",
        });

      // Grooving Arms (Left & Right alternating paw bobs)
      const armTl = gsap.timeline({ repeat: -1, yoyo: true });
      if (leftArmRef.current && rightArmRef.current) {
        armTl
          .to(leftArmRef.current, {
            rotation: -18,
            duration: 0.58,
            ease: "sine.inOut",
          }, 0)
          .to(rightArmRef.current, {
            rotation: 20,
            duration: 0.58,
            ease: "sine.inOut",
          }, 0);
      }

      // Tail Wagging
      let tailTween: gsap.core.Tween | null = null;
      if (tailRef.current) {
        tailTween = gsap.to(tailRef.current, {
          rotation: 8,
          duration: 0.58,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Drawstrings Swaying
      let stringTween: gsap.core.Tween | null = null;
      if (drawstringsRef.current) {
        stringTween = gsap.to(drawstringsRef.current, {
          rotation: 4,
          transformOrigin: "93px 126px",
          duration: 1.16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Cute Round Eyes Blink Cycle
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
      }, 3400);

      // Periodic music notes when audio is playing
      const noteInterval = setInterval(() => {
        if (isPlayingAudio) {
          emitMusicNote();
        }
      }, 2400);

      return () => {
        danceTl.kill();
        armTl.kill();
        if (tailTween) tailTween.kill();
        if (stringTween) stringTween.kill();
        clearInterval(blinkInterval);
        clearInterval(noteInterval);
      };
    }, [isPlayingAudio, emitMusicNote]);

    // 3. Scroll Tracking (Stable, NO deflating/shrinking blob velocity!)
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
    }, [scrollerRef]);

    // 4. Spatial Morph Growth: Smoothly Grow from Corner to Center
    const handleOpenChat = () => {
      if (isGrowing || isChatOpen) return;
      setIsChatOpen(true);

      // If audio is playing, gently adjust volume for chat atmosphere
      if (audioRef.current && isPlayingAudio) {
        audioRef.current.volume = 0.28;
      }
    };

    // Animate modal entry as soon as it mounts
    useEffect(() => {
      if (!isChatOpen) return;
      if (!modalBackdropRef.current || !modalStageRef.current || !chatConsoleRef.current) return;

      // 1. Fade backdrop in smoothly
      gsap.fromTo(
        modalBackdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" }
      );

      // 2. Animate modal stage growing and gliding from the bottom-right corner to center
      const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
      gsap.fromTo(
        modalStageRef.current,
        {
          scale: 0.2,
          x: isDesktop ? 320 : 120,
          y: isDesktop ? 260 : 180,
          opacity: 0,
        },
        {
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "back.out(1.15)",
        }
      );

      // 3. Unfold chat console smoothly from the right
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
        // Slide out chat panel
        gsap.to(chatConsoleRef.current, {
          opacity: 0,
          x: 40,
          duration: 0.25,
          ease: "power2.in",
        });

        // Smoothly glide Dino & stage back to bottom-right corner
        const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
        gsap.to(modalStageRef.current, {
          scale: 0.2,
          x: isDesktop ? 320 : 120,
          y: isDesktop ? 260 : 180,
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

    // 5. Interactive Dino Reactions: Eye Tracking & Lip-Sync
    // Look down at what user is typing
    useEffect(() => {
      if (!eyesRef.current) return;
      if (isTypingQuestion) {
        // Eyes shift down and slightly right, head tilts attentively
        gsap.to(eyesRef.current, {
          y: 4,
          x: 2.5,
          duration: 0.2,
          ease: "power1.out",
        });
      } else {
        // Return eyes to looking at user
        gsap.to(eyesRef.current, {
          y: 0,
          x: 0,
          duration: 0.25,
          ease: "power1.out",
        });
      }
    }, [isTypingQuestion]);

    // Animate mouth when Dino speaks
    useEffect(() => {
      if (!mouthRef.current) return;
      if (isDinoSpeaking) {
        gsap.to(mouthRef.current, {
          scaleY: 1.5,
          y: 1.5,
          transformOrigin: "center center",
          duration: 0.12,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      } else {
        gsap.to(mouthRef.current, {
          scaleY: 1,
          y: 0,
          duration: 0.2,
          ease: "power1.out",
        });
      }
    }, [isDinoSpeaking]);

    // 6. Chat Messaging
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

      // Generate response with animated lip-sync
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

    // Handle Escape Key to close
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
    // Reusable Organic Dino SVG Vector Component
    // ─────────────────────────────────────────────────────────────
    const renderOrganicDino = (isLargeStage = false) => (
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full overflow-visible select-none"
      >
        <g ref={isLargeStage ? null : danceRootRef} id="dino-dance-root">
          {/* 1. Tail with Teal Dorsal Plates */}
          <g ref={isLargeStage ? null : tailRef} id="tail-group" style={{ transformOrigin: "130px 165px" }}>
            <path d="M 148 142 C 164 140, 168 156, 154 164" fill="#256F4E" stroke="#161F18" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 158 162 C 172 164, 172 180, 156 182" fill="#256F4E" stroke="#161F18" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 124 156 C 154 154, 178 166, 170 182 C 156 192, 132 180, 118 172 Z" fill="#8CE56C" stroke="#161F18" strokeWidth="3.8" strokeLinejoin="round" />
          </g>

          {/* 2. Dorsal Plates along Head and Spine */}
          <g id="dorsal-plates">
            <path d="M 86 16 C 92 4, 114 4, 120 18" fill="#256F4E" stroke="#161F18" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M 128 32 C 146 28, 154 46, 140 58" fill="#256F4E" stroke="#161F18" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M 140 64 C 158 62, 164 80, 148 92" fill="#256F4E" stroke="#161F18" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M 146 98 C 164 98, 166 118, 150 128" fill="#256F4E" stroke="#161F18" strokeWidth="3.8" strokeLinecap="round" />
          </g>

          {/* 3. Stubby Feet with Rounded Toes */}
          <g id="feet">
            <path d="M 60 172 L 60 188 C 60 196, 80 196, 80 188 L 81 172 Z" fill="#8CE56C" stroke="#161F18" strokeWidth="3.6" strokeLinejoin="round" />
            <path d="M 66 189 Q 67 185 68 189 M 73 189 Q 74 185 75 189" stroke="#256F4E" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 106 172 L 106 188 C 106 196, 126 196, 126 188 L 125 172 Z" fill="#8CE56C" stroke="#161F18" strokeWidth="3.6" strokeLinejoin="round" />
            <path d="M 112 189 Q 113 185 114 189 M 119 189 Q 120 185 121 189" stroke="#256F4E" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* 4. Pear-Shaped Chubby Body & Head (Organic flow from reference image) */}
          <path
            id="dino-body"
            d="
              M 50 62
              C 36 82, 36 108, 52 128
              C 44 142, 46 166, 60 178
              L 126 178
              C 140 166, 140 138, 134 122
              C 148 104, 146 66, 130 42
              C 108 20, 68 30, 50 62 Z
            "
            fill="#8CE56C"
            stroke="#161F18"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* 5. Cream Belly Oval */}
          <ellipse cx="93" cy="138" rx="28" ry="25" fill="#FFF8DC" stroke="#161F18" strokeWidth="3" />

          {/* 6. Real Streetwear Black Hoodie (Fitted smoothly over body) */}
          <g id="black-hoodie">
            <path
              d="
                M 52 126
                C 45 140, 46 164, 60 176
                L 78 176
                C 70 158, 68 142, 74 126
                C 64 127, 56 126, 52 126 Z
              "
              fill="#151820"
              stroke="#0D1016"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path
              d="
                M 134 126
                C 141 140, 140 164, 126 176
                L 108 176
                C 116 158, 118 142, 112 126
                C 122 127, 130 126, 134 126 Z
              "
              fill="#151820"
              stroke="#0D1016"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path d="M 50 118 C 72 132, 114 132, 136 118 C 130 110, 56 110, 50 118 Z" fill="#1D222D" stroke="#0D1016" strokeWidth="3" />
            <path d="M 61 154 L 75 154 L 75 170 L 61 168 Z" fill="#222835" stroke="#323B4E" strokeWidth="1.6" />
            <path d="M 125 154 L 111 154 L 111 170 L 125 168 Z" fill="#222835" stroke="#323B4E" strokeWidth="1.6" />

            {/* Drawstrings */}
            <g ref={isLargeStage ? null : drawstringsRef} id="drawstrings">
              <path d="M 77 126 Q 76 142, 75 152" stroke="#424A5E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="75" cy="153" r="2.2" fill="#FFF8DC" />
              <path d="M 109 126 Q 110 142, 111 152" stroke="#424A5E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="111" cy="153" r="2.2" fill="#FFF8DC" />
            </g>
          </g>

          {/* 7. Cute Chubby Face */}
          <g id="face">
            {/* Peach Blush Cheeks */}
            <ellipse cx="56" cy="94" rx="9" ry="5.5" fill="#FFA563" opacity="0.48" />
            <ellipse cx="128" cy="94" rx="9" ry="5.5" fill="#FFA563" opacity="0.48" />

            {/* Interactive Eyes Group (Tracks user typing!) */}
            <g ref={isLargeStage ? eyesRef : null} id="dino-eyes">
              <g ref={isLargeStage ? null : leftEyeRef} id="left-eye">
                <circle cx="66" cy="82" r="7.2" fill="#161F18" />
                <circle cx="68.8" cy="79.2" r="2.4" fill="#FFFFFF" />
                <circle cx="64.5" cy="84" r="1" fill="#FFFFFF" opacity="0.75" />
              </g>
              <g ref={isLargeStage ? null : rightEyeRef} id="right-eye">
                <circle cx="118" cy="82" r="7.2" fill="#161F18" />
                <circle cx="120.8" cy="79.2" r="2.4" fill="#FFFFFF" />
                <circle cx="116.5" cy="84" r="1" fill="#FFFFFF" opacity="0.75" />
              </g>
            </g>

            {/* Interactive Mouth (Lip-syncs while Dino speaks!) */}
            <path
              ref={isLargeStage ? mouthRef : null}
              id="dino-mouth"
              d="M 85 91 Q 89.5 97 94 92 Q 98.5 97 103 91"
              fill="none"
              stroke="#161F18"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 8. Arms / Paws */}
          <g id="arms">
            <g ref={isLargeStage ? null : leftArmRef} id="left-arm" style={{ transformOrigin: "64px 132px" }}>
              <path d="M 52 124 C 42 132, 44 148, 56 150 C 62 144, 62 136, 56 126 Z" fill="#8CE56C" stroke="#161F18" strokeWidth="3.4" strokeLinejoin="round" />
              <path d="M 44 144 Q 45 147 47 145" stroke="#256F4E" strokeWidth="1.8" strokeLinecap="round" />
            </g>
            <g ref={isLargeStage ? null : rightArmRef} id="right-arm" style={{ transformOrigin: "136px 132px" }}>
              <path d="M 132 124 C 142 132, 140 148, 128 150 C 122 144, 122 136, 128 126 Z" fill="#8CE56C" stroke="#161F18" strokeWidth="3.4" strokeLinejoin="round" />
              <path d="M 140 144 Q 139 147 137 145" stroke="#256F4E" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>

          {/* 9. Retro Studio Headphones (Interactive Audio Trigger) */}
          <g
            id="headphones"
            onClick={toggleHeadphoneAudio}
            className="cursor-pointer group/headphones"
            role="button"
            tabIndex={0}
            aria-label={isPlayingAudio ? "Pause MJ Chicago" : "Want to hear what Dino is hearing? Tap his headphones!"}
          >
            <title>{isPlayingAudio ? "Pause MJ Chicago" : "Want to hear what Dino is hearing? Tap his headphones!"}</title>
            {/* Padded Headband */}
            <path d="M 42 66 C 35 20, 149 20, 142 66" fill="none" stroke="#161920" strokeWidth="8.5" strokeLinecap="round" />
            <path d="M 52 46 C 68 30, 116 30, 132 46" fill="none" stroke="#2F3646" strokeWidth="3.5" strokeLinecap="round" />

            <rect x="40" y="60" width="5.5" height="10" rx="2" fill="#B0B6C6" />
            <rect x="138.5" y="60" width="5.5" height="10" rx="2" fill="#B0B6C6" />

            {/* Left Earcup */}
            <g id="left-earcup">
              <rect x="28" y="55" width="17" height="32" rx="8.5" fill="#151820" stroke="#353D50" strokeWidth="2" />
              <rect x="39" y="58" width="5.5" height="26" rx="2.5" fill="#0C0E13" />
              {/* Amber LED Indicator (Pulses actively when music is playing) */}
              <circle cx="36" cy="71" r="3.6" fill="#FF8C38" className={isPlayingAudio ? "animate-ping" : "opacity-75"} />
              <circle cx="36" cy="71" r="2" fill="#FFF0D6" />
            </g>

            {/* Right Earcup */}
            <g id="right-earcup">
              <rect x="139" y="55" width="17" height="32" rx="8.5" fill="#151820" stroke="#353D50" strokeWidth="2" />
              <rect x="139.5" y="58" width="5.5" height="26" rx="2.5" fill="#0C0E13" />
              {/* Amber LED Indicator (Pulses actively when music is playing) */}
              <circle cx="148" cy="71" r="3.6" fill="#FF8C38" className={isPlayingAudio ? "animate-ping" : "opacity-75"} />
              <circle cx="148" cy="71" r="2" fill="#FFF0D6" />
            </g>
          </g>
        </g>
      </svg>
    );

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
            CORNER DOCKED MASCOT POD (CONTINUOUSLY DANCING, NO SCROLL SQUISH)
        ══════════════════════════════════════════════════════════════ */}
        <aside
          ref={dockContainerRef}
          aria-label="Dino Companion & Scroll Tracker"
          className={`fixed bottom-14 right-4 sm:bottom-8 sm:right-8 z-40 flex items-end gap-3 select-none pointer-events-auto transition-opacity duration-300 ${
            isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip Badges Column */}
          <div className="flex flex-col items-end gap-2 mb-2">
            {/* Audio Prompt: "Want to hear what Dino is hearing? Tap his headphones" */}
            <div
              onClick={toggleHeadphoneAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1016]/95 border shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isPlayingAudio
                  ? "border-[#FF8C38]/50 text-[#FF8C38]"
                  : "border-[#8CE56C]/40 text-[#EAD7C0] hover:border-[#8CE56C]"
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#FF8C38] shrink-0" />
              <span className="font-mono text-[9.5px] sm:text-[10px] tracking-wide font-medium">
                {isPlayingAudio
                  ? "Listening to Chicago (MJ) 🎶"
                  : "Want to hear what Dino is hearing? Tap headphones 🎧"}
              </span>
            </div>

            {/* "Want to chat?" Bar */}
            <div
              id="btn-open-dino-chat"
              onClick={handleOpenChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1016]/90 border border-[#8CE56C]/40 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-[#8CE56C]"
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

          {/* Dino Mascot Stage in Corner */}
          <div
            onClick={handleOpenChat}
            className="relative w-22 h-26 sm:w-26 sm:h-30 flex items-center justify-center cursor-pointer group"
            role="button"
            tabIndex={0}
            title="Dino: Tap to chat or tap his headphones to listen!"
          >
            {/* SVG Circular Progress Perimeter Ring */}
            <svg
              className="absolute inset-x-0 bottom-0 w-22 h-22 sm:w-26 sm:h-26 -rotate-90 pointer-events-none"
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
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0D1016]/90 border border-[#EAD7C0]/25 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center justify-center overflow-visible transition-transform duration-300 group-hover:scale-105 group-hover:border-[#8CE56C]/50">
              {/* Cozy Ambient Horizon Glow */}
              <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(140,229,108,0.25)_0%,transparent_70%)]" />

              {/* Dancing Dino Vector */}
              <div className="w-22 h-24 sm:w-26 sm:h-28 overflow-visible transform origin-bottom">
                {renderOrganicDino(false)}
              </div>

              {/* Headphone Audio Indicator / Toggle Badge on Rim */}
              <button
                onClick={toggleHeadphoneAudio}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[#141822] border border-[#EAD7C0]/30 shadow-md hover:scale-110 transition-all"
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
            EXPANDED SPLIT-STAGE CHATBOT MODAL (GROWTH MORPH FROM CORNER)
        ══════════════════════════════════════════════════════════════ */}
        {isChatOpen && (
          <div
            ref={modalBackdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Dino Chatbot Companion"
          >
            {/* Morphing Split-Stage Modal Container */}
            <div
              ref={modalStageRef}
              className="relative w-full max-w-4xl max-h-[88vh] h-[88vh] md:h-auto bg-[#0C0F14]/95 border border-[#8CE56C]/30 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseChat}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-[#141822]/80 border border-[#EAD7C0]/20 text-[#EAD7C0] hover:text-[#8CE56C] hover:border-[#8CE56C]/50 transition-all hover:scale-110"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Large Dino Showcase (Split Stage Main Attraction!) */}
              <div className="md:w-5/12 bg-gradient-to-b from-[#141A22] to-[#0A0D12] border-b md:border-b-0 md:border-r border-[#8CE56C]/20 p-3 sm:p-6 shrink-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_60%,rgba(140,229,108,0.18)_0%,transparent_70%)]" />

                {/* Dino Header Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1016] border border-[#8CE56C]/30 z-10">
                  <span className="w-2 h-2 rounded-full bg-[#8CE56C] animate-pulse" />
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#EAD7C0] uppercase font-bold">
                    PORTFOLIO COMPANION
                  </span>
                </div>

                {/* Large Interactive Dino Illustration (~300px on desktop, ~120px on mobile) */}
                <div className="my-1 sm:my-3 relative w-24 h-28 sm:w-48 sm:h-56 md:w-64 md:h-72 flex items-center justify-center">
                  {renderOrganicDino(true)}
                </div>

                {/* Music Player Bar with Headphone Toggle */}
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0E121A]/80 border border-[#EAD7C0]/15 w-full justify-between z-10">
                  <div className="flex items-center gap-2 text-left">
                    <Music
                      className={`w-4 h-4 text-[#FF8C38] ${isPlayingAudio ? "animate-spin" : ""}`}
                      style={{ animationDuration: "6s" }}
                    />
                    <div>
                      <div className="font-mono text-[10px] text-[#EAD7C0] font-bold">CHICAGO</div>
                      <div className="font-mono text-[9px] text-[#CBB59D]/60">Michael Jackson (Xscape)</div>
                    </div>
                  </div>
                  <button
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

              {/* Right Side: Interactive Chat Console */}
              <div
                ref={chatConsoleRef}
                className="flex-1 min-h-0 md:w-7/12 p-4 sm:p-6 flex flex-col justify-between bg-[#0C0F14]"
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EAD7C0]/10">
                  <div>
                    <h3 className="font-mono text-[12px] sm:text-[13px] tracking-wider text-[#FAF6EE] font-bold uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8CE56C]" />
                      Dino Assistant
                    </h3>
                    <p className="font-mono text-[10px] text-[#CBB59D]/60">
                      Looking at what you type & lip-syncing replies!
                    </p>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#8CE56C]/20 text-[#8CE56C] font-semibold border border-[#8CE56C]/30">
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

                  {/* Dino Lip-sync Typing Indicator */}
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
                  <button
                    onClick={() => handleSendMessage("Why are you wearing a black hoodie and headphones?")}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-[#161B26] border border-[#EAD7C0]/15 text-[10px] font-mono text-[#EAD7C0] hover:border-[#8CE56C] hover:text-[#8CE56C] transition-colors"
                  >
                    🦖 About Dino
                  </button>
                </div>

                {/* Freeform Input Field (With Eye Tracking on Focus & Change) */}
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
                    placeholder="Ask Dino about Soham's portfolio (watch his eyes!)..."
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
