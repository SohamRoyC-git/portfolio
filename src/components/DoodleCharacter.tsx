"use client";

import React, { useState } from "react";

export type CharacterPose =
  | "hero-standing"
  | "path-walking"
  | "experience-traveler"
  | "inspecting-panel"
  | "laptop-coding"
  | "contact-welcoming";

interface DoodleCharacterProps {
  pose: CharacterPose;
  className?: string;
  size?: number | string;
  interactive?: boolean;
  caption?: string;
}

export const DoodleCharacter: React.FC<DoodleCharacterProps> = ({
  pose,
  className = "",
  size = 280,
  interactive = true,
  caption,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const charcoal = "#202124";
  const orange = "#F97316";
  const deepOrange = "#EA580C";
  const white = "#FFFFFF";
  const warmWhite = "#FAF9F6";
  const lightGrey = "#F1EFEA";

  const handleCharacterClick = () => {
    if (!interactive) return;
    setClickCount((c) => c + 1);
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCharacterClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`Illustrated character of Soham Roychoudhury in ${pose} pose`}
      style={{
        cursor: interactive ? "pointer" : "default",
      }}
    >
      <svg
        viewBox="0 0 320 380"
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? (size * 380) / 320 : undefined}
        className="w-full h-auto transition-transform duration-300 ease-out"
        style={{
          transform: isHovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
          filter: "drop-shadow(0 12px 24px rgba(32, 33, 36, 0.06))",
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="handDrawnFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
          </filter>

          {/* Radial glow for laptop screen */}
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================
            POSE 1: HERO STANDING (Confident, friendly, standing beside name)
           ============================================================ */}
        {pose === "hero-standing" && (
          <g className="pose-hero" style={{ transformOrigin: "160px 240px" }}>
            {/* Ground shadow */}
            <ellipse cx="160" cy="358" rx="72" ry="7" fill="#E9E7E3" opacity="0.8" />

            {/* Subtle drawn sketch accents */}
            <path
              d="M140 366 Q160 368 180 366"
              stroke={charcoal}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />

            {/* Spark of ideas / greeting */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{
                transform: isHovered ? "translateY(-6px) scale(1.1)" : "translateY(0) scale(1)",
                transformOrigin: "240px 100px",
              }}
            >
              <path d="M235 95 L250 82" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <path d="M245 105 L262 105" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <path d="M238 116 L254 126" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <circle cx="230" cy="105" r="4" fill={deepOrange} />
            </g>

            {/* LEGS */}
            {/* Left Leg */}
            <path
              d="M135 255 L133 330 L115 348 L142 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Left Sneaker with orange heel accent */}
            <path
              d="M115 348 C115 344 122 340 135 340 L146 340 C149 344 148 348 145 352 L115 352 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3"
            />
            <path d="M142 342 L146 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            {/* Right Leg */}
            <path
              d="M175 255 L180 330 L168 348 L196 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Sneaker */}
            <path
              d="M168 348 C168 344 175 340 188 340 L198 340 C202 344 200 348 198 352 L168 352 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3"
            />
            <path d="M194 342 L198 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            {/* TORSO / JACKET */}
            {/* Body base */}
            <path
              d="M125 155 C125 145 138 140 155 140 C172 140 185 145 185 155 L188 245 C188 252 180 256 155 256 C130 256 122 252 122 245 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Signature Orange Inner Tee / Accent */}
            <path d="M146 142 L155 170 L164 142 Z" fill={orange} stroke={charcoal} strokeWidth="2.5" />
            <path d="M155 170 L155 254" stroke={charcoal} strokeWidth="2" strokeDasharray="6 4" />

            {/* Left Arm (Relaxed at side, hand casually hooked near hip) */}
            <path
              d="M124 158 C110 175 106 205 110 230 C112 238 120 240 125 235"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Right Arm (Slightly raised, waving or holding a warm coffee cup) */}
            <path
              d="M185 158 C202 172 210 195 212 212 C214 220 206 226 198 222"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Warm Coffee Cup in Right Hand */}
            <g transform="translate(202, 210)">
              <rect x="0" y="0" width="16" height="20" rx="3" fill={white} stroke={charcoal} strokeWidth="2.5" />
              {/* Cup sleeve in orange */}
              <rect x="0" y="6" width="16" height="8" fill={orange} />
              {/* Coffee steam */}
              <path
                d="M5 -4 Q8 -10 4 -14 M11 -3 Q14 -9 10 -13"
                stroke={deepOrange}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* HEAD & FACE */}
            {/* Neck */}
            <path d="M147 142 L147 125 M163 142 L163 125" stroke={charcoal} strokeWidth="3" />
            {/* Head Contour */}
            <path
              d="M136 78 C136 60 148 54 157 54 C172 54 180 64 180 78 C180 102 174 122 157 122 C142 122 136 102 136 78 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Ears */}
            <path
              d="M136 84 C132 82 132 90 136 92 M180 84 C184 82 184 90 180 92"
              stroke={charcoal}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Signature Textured Modern Hair (Drawn directly from Soham's headshot) */}
            {/* Volume on top, swept softly to the right with distinct hand-drawn tufts */}
            <path
              d="M133 76 C130 65 134 46 148 40 C160 35 174 38 184 46 C188 50 188 60 185 70 C183 62 176 58 170 58 C160 58 152 64 144 64 C138 64 135 70 133 76 Z"
              fill={charcoal}
            />
            <path
              d="M142 42 Q148 32 156 34 Q166 30 172 38 Q182 36 186 48"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Expressive Eyes & Smile */}
            {/* Left Eye */}
            <circle cx="149" cy="84" r="2.5" fill={charcoal} />
            {/* Right Eye */}
            <circle cx="167" cy="84" r="2.5" fill={charcoal} />
            {/* Eyebrows */}
            <path d="M145 77 Q149 75 153 77" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M163 77 Q167 75 171 77" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Nose */}
            <path d="M157 84 L156 92 L159 92" stroke={charcoal} strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Warm, confident Smile */}
            <path
              d="M151 98 Q157 106 164 98"
              stroke={charcoal}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle cheeks accent in soft orange */}
            <circle cx="144" cy="92" r="3" fill={orange} opacity="0.4" />
            <circle cx="172" cy="92" r="3" fill={orange} opacity="0.4" />
          </g>
        )}

        {/* ============================================================
            POSE 2: PATH WALKING (Walking purposefully along the narrative path)
           ============================================================ */}
        {pose === "path-walking" && (
          <g className="pose-walking" style={{ transformOrigin: "160px 240px" }}>
            {/* Motion lines */}
            <path d="M60 340 L100 340" stroke={charcoal} strokeWidth="2.5" strokeDasharray="6 6" />
            <path d="M75 350 L115 350" stroke={orange} strokeWidth="2" strokeDasharray="4 4" />

            {/* Back Leg (Extending backward) */}
            <path
              d="M145 250 L115 305 L95 342 L116 345"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Back Sneaker */}
            <path d="M95 342 L116 345 L118 350 L90 348 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M94 345 L102 346" stroke={orange} strokeWidth="2.5" strokeLinecap="round" />

            {/* Front Leg (Stepping forward) */}
            <path
              d="M165 250 L185 295 L205 340 L228 344"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Front Sneaker */}
            <path d="M205 340 L228 344 L225 350 L198 348 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M222 343 L225 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            {/* Torso tilted forward slightly */}
            <g transform="rotate(6 160 200)">
              {/* Backpack */}
              <rect x="110" y="155" width="22" height="60" rx="8" fill={white} stroke={charcoal} strokeWidth="3" />
              <rect x="114" y="165" width="14" height="25" rx="3" fill={orange} />

              {/* Jacket & Body */}
              <path
                d="M130 150 C130 142 142 138 160 138 C176 138 186 142 186 150 L182 245 C182 250 172 254 158 254 C140 254 130 250 130 245 Z"
                fill={white}
                stroke={charcoal}
                strokeWidth="3.5"
              />
              <path d="M152 140 L160 165 L168 140" fill={orange} stroke={charcoal} strokeWidth="2.5" />
              <path d="M160 165 L158 252" stroke={charcoal} strokeWidth="2" strokeDasharray="5 4" />

              {/* Arms swinging in walk stride */}
              {/* Back Arm */}
              <path
                d="M136 155 L118 190 L108 215"
                stroke={charcoal}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Front Arm (Reaching forward) */}
              <path
                d="M178 155 L202 185 L218 208"
                stroke={charcoal}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Head */}
              <path d="M152 138 L152 122 M166 138 L166 122" stroke={charcoal} strokeWidth="3" />
              <path
                d="M142 75 C142 58 154 52 163 52 C178 52 186 62 186 75 C186 98 180 118 164 118 C148 118 142 98 142 75 Z"
                fill={white}
                stroke={charcoal}
                strokeWidth="3.5"
              />
              {/* Hair */}
              <path
                d="M139 72 C136 60 140 44 154 38 C166 33 180 36 190 44 C194 48 194 58 191 68 C189 60 182 56 176 56 C166 56 158 62 150 62 C144 62 141 68 139 72 Z"
                fill={charcoal}
              />
              {/* Eyes looking forward */}
              <circle cx="160" cy="82" r="2.5" fill={charcoal} />
              <circle cx="176" cy="82" r="2.5" fill={charcoal} />
              <path d="M156 75 Q160 73 164 75" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
              <path d="M172 75 Q176 73 180 75" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
              {/* Determined Smile */}
              <path d="M164 96 Q172 102 178 96" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* ============================================================
            POSE 3: EXPERIENCE TRAVELER (International stops, holding passport/tablet)
           ============================================================ */}
        {pose === "experience-traveler" && (
          <g className="pose-traveler">
            {/* Ground shadow */}
            <ellipse cx="160" cy="358" rx="65" ry="7" fill="#E9E7E3" />

            {/* Legs standing stable */}
            <path
              d="M138 255 L136 334 L120 350 L146 350"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M172 255 L174 334 L162 350 L188 350"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Torso */}
            <path
              d="M126 150 C126 140 138 136 155 136 C172 136 184 140 184 150 L184 246 C184 252 174 256 155 256 C136 256 126 252 126 246 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M148 138 L155 164 L162 138" fill={orange} stroke={charcoal} strokeWidth="2.5" />

            {/* Cross-border Digital Tablet held in hands */}
            <g transform="translate(182, 175) rotate(-6)">
              <rect x="0" y="0" width="70" height="52" rx="6" fill={white} stroke={charcoal} strokeWidth="3" />
              {/* Screen header */}
              <rect x="6" y="6" width="58" height="10" rx="2" fill={charcoal} />
              <circle cx="12" cy="11" r="2" fill={orange} />
              <rect x="18" y="9" width="30" height="4" rx="1" fill={white} />

              {/* International route line on screen */}
              <path
                d="M12 28 C24 22 42 36 54 28"
                stroke={orange}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="3 3"
                fill="none"
              />
              <circle cx="12" cy="28" r="3" fill={deepOrange} />
              <circle cx="54" cy="28" r="3" fill={deepOrange} />

              {/* Status badges */}
              <rect x="10" y="38" width="18" height="6" rx="2" fill={lightGrey} />
              <rect x="32" y="38" width="26" height="6" rx="2" fill={orange} opacity="0.8" />
            </g>

            {/* Left Arm holding tablet */}
            <path
              d="M126 155 C116 175 125 210 182 205"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm supporting tablet */}
            <path
              d="M184 155 C198 170 215 190 220 205"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head looking with curiosity at the tablet */}
            <path d="M148 136 L148 120 M162 136 L162 120" stroke={charcoal} strokeWidth="3" />
            <path
              d="M136 74 C136 56 148 50 157 50 C172 50 180 60 180 74 C180 98 174 116 157 116 C142 116 136 98 136 74 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            {/* Hair */}
            <path
              d="M133 72 C130 60 134 44 148 38 C160 33 174 36 184 44 C188 48 188 58 185 68 C183 60 176 56 170 56 C160 56 152 62 144 62 C138 62 135 68 133 72 Z"
              fill={charcoal}
            />
            {/* Eyes looking down towards tablet */}
            <circle cx="154" cy="85" r="2.5" fill={charcoal} />
            <circle cx="170" cy="85" r="2.5" fill={charcoal} />
            <path d="M150 78 Q154 77 158 79" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
            <path d="M166 78 Q170 77 174 79" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
            <path d="M156 98 Q162 104 168 98" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================
            POSE 4: INSPECTING PANEL (Holding UI frame / crosshair magnifier)
           ============================================================ */}
        {pose === "inspecting-panel" && (
          <g className="pose-inspect">
            <ellipse cx="160" cy="358" rx="65" ry="7" fill="#E9E7E3" />

            {/* Legs */}
            <path
              d="M140 255 L136 332 L118 348 L144 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M170 255 L174 332 L162 348 L188 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Torso */}
            <path
              d="M128 152 C128 142 140 138 156 138 C172 138 184 142 184 152 L182 248 C182 254 172 258 156 258 C138 258 128 254 128 248 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M150 140 L156 166 L162 140" fill={orange} stroke={charcoal} strokeWidth="2.5" />

            {/* Holding UI Wireframe Glass Tool / Inspector Panel */}
            <g transform="translate(190, 120)">
              {/* Frame */}
              <rect
                x="0"
                y="0"
                width="84"
                height="64"
                rx="8"
                fill={white}
                stroke={charcoal}
                strokeWidth="3"
                strokeDasharray="6 3"
              />
              {/* Orange corner brackets */}
              <path d="M4 14 L4 4 L14 4" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M70 4 L80 4 L80 14" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M80 50 L80 60 L70 60" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M14 60 L4 60 L4 50" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Wireframe lines inside */}
              <rect x="14" y="14" width="24" height="6" rx="2" fill={charcoal} />
              <rect x="14" y="26" width="56" height="4" rx="1" fill={lightGrey} />
              <rect x="14" y="34" width="48" height="4" rx="1" fill={lightGrey} />
              <rect x="14" y="44" width="20" height="8" rx="3" fill={orange} />
              <text x="38" y="50" fontSize="7" fontFamily="monospace" fill={charcoal} fontWeight="bold">
                200+ i18n
              </text>
            </g>

            {/* Arms reaching to hold the inspector */}
            <path
              d="M128 156 C115 175 140 215 190 175"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M184 156 C200 165 210 180 230 184"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head & Eyes inspecting with focus */}
            <path d="M148 138 L148 122 M164 138 L164 122" stroke={charcoal} strokeWidth="3" />
            <path
              d="M138 74 C138 56 150 50 159 50 C174 50 182 60 182 74 C182 98 176 116 159 116 C144 116 138 98 138 74 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path
              d="M135 72 C132 60 136 44 150 38 C162 33 176 36 186 44 C190 48 190 58 187 68 C185 60 178 56 172 56 C162 56 154 62 146 62 C140 62 137 68 135 72 Z"
              fill={charcoal}
            />
            {/* Eyes looking keenly towards the panel */}
            <circle cx="158" cy="82" r="2.5" fill={charcoal} />
            <circle cx="174" cy="80" r="2.5" fill={charcoal} />
            <path d="M154 75 Q158 73 162 75" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M170 73 Q174 72 178 74" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M160 97 Q167 101 174 96" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================
            POSE 5: LAPTOP CODING (Sitting at desk, typing code, orange terminal glow)
           ============================================================ */}
        {pose === "laptop-coding" && (
          <g className="pose-coding">
            {/* Desk / Platform surface */}
            <path d="M50 310 L270 310" stroke={charcoal} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 310 L70 360 M250 310 L250 360" stroke={charcoal} strokeWidth="3" strokeLinecap="round" />

            {/* Glowing Laptop Screen */}
            <ellipse cx="190" cy="245" rx="50" ry="40" fill="url(#screenGlow)" />

            {/* Laptop Base */}
            <path d="M155 306 L225 306 L218 310 L162 310 Z" fill={charcoal} />
            {/* Laptop Screen Open */}
            <rect
              x="172"
              y="225"
              width="50"
              height="75"
              rx="4"
              transform="rotate(14 172 225)"
              fill="#171717"
              stroke={charcoal}
              strokeWidth="2.5"
            />
            {/* Code lines on screen */}
            <g transform="rotate(14 172 225)">
              <rect x="178" y="235" width="20" height="3" fill={orange} />
              <rect x="178" y="242" width="36" height="2.5" fill="#4ADE80" />
              <rect x="184" y="248" width="28" height="2.5" fill="#60A5FA" />
              <rect x="184" y="254" width="22" height="2.5" fill="#FBBF24" />
              <rect x="178" y="260" width="14" height="2.5" fill={orange} />
            </g>

            {/* Developer sitting on chair */}
            {/* Chair back */}
            <path d="M96 220 L96 320" stroke={charcoal} strokeWidth="5" strokeLinecap="round" />

            {/* Legs bent in sitting position */}
            <path
              d="M125 285 L145 285 L148 350 L168 350"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M148 350 L168 350 L166 355 L145 354 Z" fill={white} stroke={charcoal} strokeWidth="2.5" />
            <path d="M164 350 L168 354" stroke={orange} strokeWidth="2.5" />

            {/* Torso leaning comfortably towards laptop */}
            <path
              d="M108 200 C108 190 120 185 136 185 C152 185 162 190 162 200 L158 285 C158 290 148 294 134 294 C120 294 108 290 108 285 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M130 186 L136 210 L142 186" fill={orange} stroke={charcoal} strokeWidth="2" />

            {/* Hands on keyboard */}
            <path
              d="M112 205 C118 230 145 275 180 300"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M148 205 C155 225 170 270 192 298"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head looking attentively at the screen */}
            <path d="M128 185 L128 168 M142 185 L142 168" stroke={charcoal} strokeWidth="3" />
            <path
              d="M118 124 C118 106 130 100 139 100 C154 100 162 110 162 124 C162 148 156 166 139 166 C124 166 118 148 118 124 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            {/* Hair */}
            <path
              d="M115 122 C112 110 116 94 130 88 C142 83 156 86 166 94 C170 98 170 108 167 118 C165 110 158 106 152 106 C142 106 134 112 126 112 C120 112 117 118 115 122 Z"
              fill={charcoal}
            />
            {/* Eyes lit up by code */}
            <circle cx="138" cy="132" r="2.5" fill={charcoal} />
            <circle cx="152" cy="132" r="2.5" fill={charcoal} />
            <path d="M134 125 Q138 124 142 126" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
            <path d="M148 125 Q152 124 156 126" stroke={charcoal} strokeWidth="2" strokeLinecap="round" />
            {/* Smile while building */}
            <path d="M140 146 Q146 151 152 146" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />

            {/* Floating code brackets */}
            <text x="215" y="200" fill={orange} fontSize="20" fontFamily="monospace" fontWeight="bold">
              {"</>"}
            </text>
          </g>
        )}

        {/* ============================================================
            POSE 6: CONTACT WELCOMING (Reaching journey's end, warm wave)
           ============================================================ */}
        {pose === "contact-welcoming" && (
          <g className="pose-welcoming">
            {/* Ground celebratory confetti / sparkle shadows */}
            <ellipse cx="160" cy="358" rx="75" ry="7" fill="#E9E7E3" />

            {/* Sparkles around character */}
            <g>
              <path d="M85 100 L95 100 M90 95 L90 105" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <path d="M245 80 L255 80 M250 75 L250 85" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <circle cx="230" cy="130" r="3" fill={deepOrange} />
              <circle cx="80" cy="140" r="3" fill={orange} />
            </g>

            {/* Legs */}
            <path
              d="M136 255 L134 332 L116 348 L142 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M174 255 L178 332 L166 348 L194 348"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sneakers */}
            <path d="M116 348 C116 344 122 340 135 340 L144 340 L142 352 L116 352 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M140 342 L144 348" stroke={orange} strokeWidth="3" />
            <path d="M166 348 C166 344 175 340 188 340 L196 340 L194 352 L166 352 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M192 342 L196 348" stroke={orange} strokeWidth="3" />

            {/* Torso */}
            <path
              d="M125 155 C125 145 138 140 155 140 C172 140 185 145 185 155 L186 248 C186 254 176 258 155 258 C134 258 124 254 124 248 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M148 142 L155 168 L162 142" fill={orange} stroke={charcoal} strokeWidth="2.5" />

            {/* Left Arm (Gesturing towards contact form) */}
            <path
              d="M125 158 C105 180 85 200 68 215"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Open Palm gesturing */}
            <path
              d="M68 215 C62 218 58 212 65 206 C70 202 75 205 78 210"
              stroke={charcoal}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill={white}
            />

            {/* Right Arm (Waving hello enthusiastically) */}
            <path
              d="M185 158 C205 150 220 130 232 105"
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Waving Hand */}
            <g transform="translate(230, 95)">
              <circle cx="8" cy="8" r="8" fill={white} stroke={charcoal} strokeWidth="2.5" />
              {/* Waving motion arcs */}
              <path d="M18 -2 C22 4 22 14 18 20" stroke={orange} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M23 2 C26 7 26 12 23 16" stroke={deepOrange} strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>

            {/* Head tilted with friendly smile */}
            <path d="M147 142 L147 125 M163 142 L163 125" stroke={charcoal} strokeWidth="3" />
            <path
              d="M136 78 C136 60 148 54 157 54 C172 54 180 64 180 78 C180 102 174 122 157 122 C142 122 136 102 136 78 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            {/* Hair */}
            <path
              d="M133 76 C130 65 134 46 148 40 C160 35 174 38 184 46 C188 50 188 60 185 70 C183 62 176 58 170 58 C160 58 152 64 144 64 C138 64 135 70 133 76 Z"
              fill={charcoal}
            />
            {/* Big friendly eyes */}
            <circle cx="150" cy="84" r="2.8" fill={charcoal} />
            <circle cx="168" cy="84" r="2.8" fill={charcoal} />
            <path d="M146 76 Q150 74 154 76" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M164 76 Q168 74 172 76" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" />
            {/* Welcoming Broad Smile */}
            <path
              d="M150 96 C152 106 166 106 168 96 Z"
              fill={charcoal}
              stroke={charcoal}
              strokeWidth="2"
            />
            <circle cx="143" cy="92" r="3.5" fill={orange} opacity="0.45" />
            <circle cx="175" cy="92" r="3.5" fill={orange} opacity="0.45" />
          </g>
        )}
      </svg>

      {caption && (
        <span className="mt-3 px-3 py-1 text-xs font-mono tracking-tight text-[#6B6B6B] bg-[#FFFFFF] border border-[#E9E7E3] rounded-full shadow-sm">
          {caption}
        </span>
      )}

      {/* Easter Egg Click Interaction */}
      {clickCount > 0 && clickCount % 5 === 0 && (
        <div className="absolute -top-10 px-3 py-1 bg-[#202124] text-white text-xs font-mono rounded-lg shadow-lg animate-bounce z-20">
          Ready to build! 🚀
        </div>
      )}
    </div>
  );
};
