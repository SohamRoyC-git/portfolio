"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, Terminal, ShieldCheck } from "lucide-react";

interface SohamAvatarProps {
  className?: string;
  size?: number;
  caption?: string;
}

export const SohamAvatar: React.FC<SohamAvatarProps> = ({
  className = "",
  size = 340,
  caption = "Soham Roychoudhury • CSE (AI & ML)",
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 16,
      y: (x / rect.width) * 16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center select-none perspective-[1000px] ${className}`}
      style={{ width: size }}
    >
      {/* Ambient background orange glow */}
      <div
        className="absolute inset-4 rounded-full filter blur-2xl opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundColor: "#F97316",
          transform: "scale(1.05)",
        }}
      />

      {/* 3D Floating Avatar Card */}
      <div
        className="relative w-full rounded-3xl p-3 bg-white border border-[#E9E7E3] shadow-xl transition-transform duration-150 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic rim border */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF9F6] border border-[#E9E7E3]">
          <Image
            src="/assets/soham_avatar.png"
            alt="3D Stylized Persona of Soham Roychoudhury"
            fill
            priority
            sizes="(max-width: 768px) 300px, 400px"
            className="object-cover transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? "scale(1.04)" : "scale(1)",
            }}
          />

          {/* Glare overlay on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.25 : 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)",
            }}
          />

          {/* Floating verified badge in top right */}
          <div className="absolute top-3 right-3 bg-[#202124]/90 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-neutral-700 flex items-center gap-1 shadow-sm">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>AI & ML 2028</span>
          </div>

          {/* Status pill in bottom left */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#202124] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#E9E7E3] flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>status: open to work</span>
          </div>
        </div>
      </div>

      {/* Caption pill below */}
      {caption && (
        <span className="mt-3 px-3 py-1 text-xs font-mono tracking-tight text-[#6B6B6B] bg-[#FFFFFF] border border-[#E9E7E3] rounded-full shadow-xs flex items-center gap-1.5">
          <Terminal size={11} className="text-[#F97316]" />
          <span>{caption}</span>
        </span>
      )}
    </div>
  );
};
