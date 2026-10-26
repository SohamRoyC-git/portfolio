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

/**
 * Reusable Character Head & Face Component matching Soham's real features:
 * - Voluminous dark wavy hair with signature center-part curtain fringe
 * - Modern translucent rectangular acetate glasses
 * - Expressive thick eyebrows & warm squinted smiling eyes
 * - Groomed mustache & neat goatee / chin stubble
 * - Black hoop earring on the right ear (viewer's left)
 */
const CharacterHead: React.FC<{
  headTilt?: number;
  eyeLook?: "center" | "down" | "right";
  isWinking?: boolean;
}> = ({ headTilt = 0, eyeLook = "center", isWinking = false }) => {
  const charcoal = "#202124";
  const white = "#FFFFFF";
  const orange = "#F97316";

  return (
    <g
      style={{
        transform: `rotate(${headTilt}deg)`,
        transformOrigin: "160px 115px",
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* Neck */}
      <path d="M151 140 L151 122 M169 140 L169 122" stroke={charcoal} strokeWidth="3" strokeLinecap="round" />

      {/* Head Contour / Jawline */}
      <path
        d="M136 78 C136 58 147 52 160 52 C173 52 184 58 184 78 C184 104 176 122 160 122 C144 122 136 104 136 78 Z"
        fill={white}
        stroke={charcoal}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Left Ear (Viewer's left) with black hoop earring */}
      <path d="M136 84 C131 82 131 92 136 94" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="132" cy="93" r="2.5" stroke={charcoal} strokeWidth="2.2" fill="none" />

      {/* Right Ear */}
      <path d="M184 84 C189 82 189 92 184 94" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" />

      {/* Signature Hair - Voluminous Wavy Hair with Center-Part Curtain Fringe */}
      {/* Background hair crown & side bulk */}
      <path
        d="M132 80 C128 66 130 46 144 38 C154 32 166 32 176 38 C190 46 192 66 188 80 C186 64 176 56 160 56 C144 56 134 64 132 80 Z"
        fill={charcoal}
      />
      {/* Wavy textured crest on top */}
      <path
        d="M136 46 Q144 30 154 34 Q160 28 166 34 Q176 30 184 46"
        stroke={charcoal}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M146 36 Q153 26 160 28 Q167 26 174 36"
        stroke={charcoal}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center-part parting notch */}
      <path d="M158 52 L160 56 L162 52" stroke="#FAF9F6" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Left curtain fringe wave curling outward */}
      <path
        d="M158 52 C155 64 142 66 136 76 C134 81 138 85 142 83 C148 81 154 70 158 62"
        fill={charcoal}
        stroke={charcoal}
        strokeWidth="1.5"
      />

      {/* Right curtain fringe wave curling outward */}
      <path
        d="M162 52 C165 64 178 66 184 76 C186 81 182 85 178 83 C172 81 166 70 162 62"
        fill={charcoal}
        stroke={charcoal}
        strokeWidth="1.5"
      />

      {/* Thick, Expressive Eyebrows */}
      <path d="M141 73 Q148 70 155 73" stroke={charcoal} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M165 73 Q172 70 179 73" stroke={charcoal} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Modern Translucent Rectangular Acetate Glasses */}
      {/* Left Lens Frame */}
      <rect
        x="138"
        y="75"
        width="19"
        height="16"
        rx="3.5"
        fill="rgba(255, 255, 255, 0.75)"
        stroke={charcoal}
        strokeWidth="2.2"
      />
      {/* Right Lens Frame */}
      <rect
        x="163"
        y="75"
        width="19"
        height="16"
        rx="3.5"
        fill="rgba(255, 255, 255, 0.75)"
        stroke={charcoal}
        strokeWidth="2.2"
      />
      {/* Glasses Bridge */}
      <path d="M157 80 Q160 78 163 80" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Temple Arms to Ears */}
      <path d="M138 79 L133 83" stroke={charcoal} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M182 79 L187 83" stroke={charcoal} strokeWidth="1.8" strokeLinecap="round" />
      {/* Glass Glare Highlight */}
      <path d="M141 77 L145 77 M166 77 L170 77" stroke={white} strokeWidth="1.6" strokeLinecap="round" />

      {/* Eyes Behind Lenses */}
      {eyeLook === "center" && (
        <>
          <path d="M143 82 Q147 86 152 82" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="147.5" cy="82.5" r="2.2" fill={charcoal} />

          {isWinking ? (
            <path d="M167 83 Q172 80 177 83" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <path d="M168 82 Q172 86 177 82" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="172.5" cy="82.5" r="2.2" fill={charcoal} />
            </>
          )}
        </>
      )}

      {eyeLook === "down" && (
        <>
          <path d="M143 81 Q147 87 152 81" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="147.5" cy="84" r="2" fill={charcoal} />
          <path d="M168 81 Q172 87 177 81" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="172.5" cy="84" r="2" fill={charcoal} />
        </>
      )}

      {eyeLook === "right" && (
        <>
          <path d="M143 82 Q147 86 152 82" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="82.5" r="2.2" fill={charcoal} />
          <path d="M168 82 Q172 86 177 82" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="175" cy="82.5" r="2.2" fill={charcoal} />
        </>
      )}

      {/* Nose */}
      <path d="M159 80 L158 90 L162 90" stroke={charcoal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Groomed Mustache */}
      <path
        d="M152 95 Q156 93.5 160 95 Q164 93.5 168 95"
        stroke={charcoal}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Warm, Relaxed Smile */}
      <path d="M152 99 Q160 105 168 99" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Subtle Warm Cheeks */}
      <circle cx="144" cy="93" r="3" fill={orange} opacity="0.35" />
      <circle cx="176" cy="93" r="3" fill={orange} opacity="0.35" />

      {/* Soul Patch & Chin Goatee */}
      <path d="M159 103 L161 103" stroke={charcoal} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M155 111 Q160 114 165 111" stroke={charcoal} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
};

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
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================
            POSE 1: HERO STANDING (Tailored Blazer, Coffee Cup, Confident)
           ============================================================ */}
        {pose === "hero-standing" && (
          <g className="pose-hero" style={{ transformOrigin: "160px 240px" }}>
            {/* Ground shadow */}
            <ellipse cx="160" cy="358" rx="72" ry="7" fill="#E9E7E3" opacity="0.8" />

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
            <path d="M135 255 L133 330 L115 348 L142 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M115 348 C115 344 122 340 135 340 L146 340 C149 344 148 348 145 352 L115 352 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M142 342 L146 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            <path d="M175 255 L180 330 L168 348 L196 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M168 348 C168 344 175 340 188 340 L198 340 C202 344 200 348 198 352 L168 352 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M194 342 L198 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            {/* TAILORED SUIT / BLAZER (Navy/Charcoal with Open White Collar) */}
            <path
              d="M125 155 C125 145 138 140 155 140 C172 140 185 145 185 155 L188 245 C188 252 180 256 155 256 C130 256 122 252 122 245 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Crisp Open-Collar White Shirt V-Neck */}
            <path d="M144 142 L155 174 L166 142" stroke={charcoal} strokeWidth="2.5" fill={white} />
            {/* Structured Suit Lapels */}
            <path d="M140 142 L148 185 L130 190" stroke={charcoal} strokeWidth="2.5" fill="none" />
            <path d="M170 142 L162 185 L180 190" stroke={charcoal} strokeWidth="2.5" fill="none" />
            {/* Orange Pocket Square Accent */}
            <path d="M132 188 L140 186 L138 192 Z" fill={orange} stroke={charcoal} strokeWidth="1.5" />
            <path d="M155 174 L155 254" stroke={charcoal} strokeWidth="2" strokeDasharray="6 4" />

            {/* Left Arm (Relaxed) */}
            <path d="M124 158 C110 175 106 205 110 230 C112 238 120 240 125 235" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Right Arm (Holding Warm Coffee) */}
            <path d="M185 158 C202 172 210 195 212 212 C214 220 206 226 198 222" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <g transform="translate(202, 210)">
              <rect x="0" y="0" width="16" height="20" rx="3" fill={white} stroke={charcoal} strokeWidth="2.5" />
              <rect x="0" y="6" width="16" height="8" fill={orange} />
              <path d="M5 -4 Q8 -10 4 -14 M11 -3 Q14 -9 10 -13" stroke={deepOrange} strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </g>

            {/* Character Head with exact real features */}
            <CharacterHead isWinking={clickCount % 2 === 1} />
          </g>
        )}

        {/* ============================================================
            POSE 2: PATH WALKING (Walking purposefully along journey path)
           ============================================================ */}
        {pose === "path-walking" && (
          <g className="pose-walking" style={{ transformOrigin: "160px 240px" }}>
            <path d="M60 340 L100 340" stroke={charcoal} strokeWidth="2.5" strokeDasharray="6 6" />
            <path d="M75 350 L115 350" stroke={orange} strokeWidth="2" strokeDasharray="4 4" />

            {/* Legs */}
            <path d="M145 250 L115 305 L95 342 L116 345" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M95 342 L116 345 L118 350 L90 348 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M94 345 L102 346" stroke={orange} strokeWidth="2.5" strokeLinecap="round" />

            <path d="M165 250 L185 295 L205 340 L228 344" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M205 340 L228 344 L225 350 L198 348 Z" fill={white} stroke={charcoal} strokeWidth="3" />
            <path d="M222 343 L225 348" stroke={orange} strokeWidth="3" strokeLinecap="round" />

            {/* Torso & Backpack */}
            <g transform="rotate(5 160 200)">
              <rect x="110" y="155" width="22" height="60" rx="8" fill={white} stroke={charcoal} strokeWidth="3" />
              <rect x="114" y="165" width="14" height="25" rx="3" fill={orange} />

              <path
                d="M130 150 C130 142 142 138 160 138 C176 138 186 142 186 150 L182 245 C182 250 172 254 158 254 C140 254 130 250 130 245 Z"
                fill={white}
                stroke={charcoal}
                strokeWidth="3.5"
              />
              <path d="M150 140 L160 170 L170 140" stroke={charcoal} strokeWidth="2.5" fill={white} />
              <path d="M160 170 L158 252" stroke={charcoal} strokeWidth="2" strokeDasharray="5 4" />

              {/* Arms */}
              <path d="M136 155 L118 190 L108 215" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M178 155 L202 185 L218 208" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

              <CharacterHead headTilt={5} eyeLook="right" />
            </g>
          </g>
        )}

        {/* ============================================================
            POSE 3: EXPERIENCE TRAVELER (Holding International Tablet)
           ============================================================ */}
        {pose === "experience-traveler" && (
          <g className="pose-traveler">
            <ellipse cx="160" cy="358" rx="65" ry="7" fill="#E9E7E3" />

            {/* Legs */}
            <path d="M138 255 L136 334 L120 350 L146 350" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M172 255 L174 334 L162 350 L188 350" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Torso */}
            <path
              d="M126 150 C126 140 138 136 155 136 C172 136 184 140 184 150 L184 246 C184 252 174 256 155 256 C136 256 126 252 126 246 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M146 138 L155 170 L164 138" stroke={charcoal} strokeWidth="2.5" fill={white} />

            {/* Digital Transit Tablet */}
            <g transform="translate(182, 175) rotate(-6)">
              <rect x="0" y="0" width="70" height="52" rx="6" fill={white} stroke={charcoal} strokeWidth="3" />
              <rect x="6" y="6" width="58" height="10" rx="2" fill={charcoal} />
              <circle cx="12" cy="11" r="2" fill={orange} />
              <rect x="18" y="9" width="30" height="4" rx="1" fill={white} />

              <path d="M12 28 C24 22 42 36 54 28" stroke={orange} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
              <circle cx="12" cy="28" r="3" fill={deepOrange} />
              <circle cx="54" cy="28" r="3" fill={deepOrange} />

              <rect x="10" y="38" width="18" height="6" rx="2" fill="#FAF9F6" />
              <rect x="32" y="38" width="26" height="6" rx="2" fill={orange} opacity="0.8" />
            </g>

            {/* Arms */}
            <path d="M126 155 C116 175 125 210 182 205" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M184 155 C198 170 215 190 220 205" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <CharacterHead headTilt={-3} eyeLook="down" />
          </g>
        )}

        {/* ============================================================
            POSE 4: INSPECTING PANEL (Holding UI Frame with Crosshairs)
           ============================================================ */}
        {pose === "inspecting-panel" && (
          <g className="pose-inspect">
            <ellipse cx="160" cy="358" rx="65" ry="7" fill="#E9E7E3" />

            <path d="M140 255 L136 332 L118 348 L144 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M170 255 L174 332 L162 348 L188 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <path
              d="M128 152 C128 142 140 138 156 138 C172 138 184 142 184 152 L182 248 C182 254 172 258 156 258 C138 258 128 254 128 248 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M148 140 L156 172 L164 140" stroke={charcoal} strokeWidth="2.5" fill={white} />

            {/* UI Wireframe Glass Tool */}
            <g transform="translate(190, 120)">
              <rect x="0" y="0" width="84" height="64" rx="8" fill={white} stroke={charcoal} strokeWidth="3" strokeDasharray="6 3" />
              <path d="M4 14 L4 4 L14 4" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M70 4 L80 4 L80 14" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M80 50 L80 60 L70 60" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M14 60 L4 60 L4 50" stroke={orange} strokeWidth="3" strokeLinecap="round" fill="none" />

              <rect x="14" y="14" width="24" height="6" rx="2" fill={charcoal} />
              <rect x="14" y="26" width="56" height="4" rx="1" fill="#FAF9F6" />
              <rect x="14" y="34" width="48" height="4" rx="1" fill="#FAF9F6" />
              <rect x="14" y="44" width="20" height="8" rx="3" fill={orange} />
              <text x="38" y="50" fontSize="7" fontFamily="monospace" fill={charcoal} fontWeight="bold">
                200+ i18n
              </text>
            </g>

            {/* Arms */}
            <path d="M128 156 C115 175 140 215 190 175" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M184 156 C200 165 210 180 230 184" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <CharacterHead headTilt={4} eyeLook="right" />
          </g>
        )}

        {/* ============================================================
            POSE 5: LAPTOP CODING (Sitting at desk with terminal sparks)
           ============================================================ */}
        {pose === "laptop-coding" && (
          <g className="pose-coding">
            <path d="M50 310 L270 310" stroke={charcoal} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 310 L70 360 M250 310 L250 360" stroke={charcoal} strokeWidth="3" strokeLinecap="round" />

            <ellipse cx="190" cy="245" rx="50" ry="40" fill="url(#screenGlow)" />

            {/* Laptop */}
            <path d="M155 306 L225 306 L218 310 L162 310 Z" fill={charcoal} />
            <rect x="172" y="225" width="50" height="75" rx="4" transform="rotate(14 172 225)" fill="#171717" stroke={charcoal} strokeWidth="2.5" />
            <g transform="rotate(14 172 225)">
              <rect x="178" y="235" width="20" height="3" fill={orange} />
              <rect x="178" y="242" width="36" height="2.5" fill="#4ADE80" />
              <rect x="184" y="248" width="28" height="2.5" fill="#60A5FA" />
              <rect x="184" y="254" width="22" height="2.5" fill="#FBBF24" />
              <rect x="178" y="260" width="14" height="2.5" fill={orange} />
            </g>

            {/* Sitting chair & legs */}
            <path d="M96 220 L96 320" stroke={charcoal} strokeWidth="5" strokeLinecap="round" />
            <path d="M125 285 L145 285 L148 350 L168 350" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M148 350 L168 350 L166 355 L145 354 Z" fill={white} stroke={charcoal} strokeWidth="2.5" />
            <path d="M164 350 L168 354" stroke={orange} strokeWidth="2.5" />

            {/* Torso */}
            <path
              d="M108 200 C108 190 120 185 136 185 C152 185 162 190 162 200 L158 285 C158 290 148 294 134 294 C120 294 108 290 108 285 Z"
              fill={white}
              stroke={charcoal}
              strokeWidth="3.5"
            />
            <path d="M128 186 L136 215 L144 186" stroke={charcoal} strokeWidth="2" fill={white} />

            {/* Hands typing */}
            <path d="M112 205 C118 230 145 275 180 300" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M148 205 C155 225 170 270 192 298" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Character Head looking at laptop screen */}
            <g transform="translate(-20, 45)">
              <CharacterHead headTilt={7} eyeLook="right" />
            </g>

            <text x="215" y="200" fill={orange} fontSize="20" fontFamily="monospace" fontWeight="bold">
              {"</>"}
            </text>
          </g>
        )}

        {/* ============================================================
            POSE 6: CONTACT WELCOMING (Finish line celebratory wave)
           ============================================================ */}
        {pose === "contact-welcoming" && (
          <g className="pose-welcoming">
            <ellipse cx="160" cy="358" rx="75" ry="7" fill="#E9E7E3" />

            {/* Sparkles */}
            <g>
              <path d="M85 100 L95 100 M90 95 L90 105" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <path d="M245 80 L255 80 M250 75 L250 85" stroke={orange} strokeWidth="3" strokeLinecap="round" />
              <circle cx="230" cy="130" r="3" fill={deepOrange} />
              <circle cx="80" cy="140" r="3" fill={orange} />
            </g>

            {/* Legs */}
            <path d="M136 255 L134 332 L116 348 L142 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M174 255 L178 332 L166 348 L194 348" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
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
            <path d="M144 142 L155 174 L166 142" stroke={charcoal} strokeWidth="2.5" fill={white} />
            {/* Orange Pocket Square */}
            <path d="M132 188 L140 186 L138 192 Z" fill={orange} stroke={charcoal} strokeWidth="1.5" />

            {/* Left Arm gesturing towards contact form */}
            <path d="M125 158 C105 180 85 200 68 215" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M68 215 C62 218 58 212 65 206 C70 202 75 205 78 210" stroke={charcoal} strokeWidth="2.5" strokeLinecap="round" fill={white} />

            {/* Right Arm waving hello */}
            <path d="M185 158 C205 150 220 130 232 105" stroke={charcoal} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <g transform="translate(230, 95)">
              <circle cx="8" cy="8" r="8" fill={white} stroke={charcoal} strokeWidth="2.5" />
              <path d="M18 -2 C22 4 22 14 18 20" stroke={orange} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M23 2 C26 7 26 12 23 16" stroke={deepOrange} strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>

            {/* Character Head with welcoming smile */}
            <CharacterHead headTilt={-4} />
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
