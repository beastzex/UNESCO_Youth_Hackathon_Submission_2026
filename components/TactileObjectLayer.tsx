"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function TactileObjectLayer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      {/* 1. Chrome Inflatable Balloon Sphere (Top Right) */}
      <div
        className="absolute top-[12%] right-[8%] sm:right-[15%] w-32 h-32 sm:w-44 sm:h-44 rounded-full transition-transform duration-700 ease-out animate-float-slow"
        style={{
          transform: `translate(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px)`,
          background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 30%, #475569 70%, #0f172a 100%)",
          boxShadow: "0 25px 50px -12px rgba(255,255,255,0.15), inset -10px -10px 25px rgba(0,0,0,0.8), inset 10px 10px 25px rgba(255,255,255,0.8)",
        }}
      >
        <div className="absolute top-4 left-6 w-12 h-6 bg-white/60 rounded-full blur-[2px] -rotate-45" />
      </div>

      {/* 2. Iridescent Foil Fold (Bottom Left) */}
      <div
        className="absolute bottom-[20%] left-[6%] sm:left-[12%] w-28 h-28 sm:w-36 sm:h-36 transition-transform duration-1000 ease-out animate-float-reverse rotate-12"
        style={{
          transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
          background: "linear-gradient(135deg, rgba(226,232,240,0.9) 0%, rgba(165,180,252,0.6) 50%, rgba(203,213,225,0.8) 100%)",
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="w-full h-full border border-white/40 flex items-center justify-center">
          <span className="text-[10px] font-mono text-studio-950 font-bold uppercase tracking-widest">
            FOIL_01
          </span>
        </div>
      </div>

      {/* 3. Holographic Bubble Pill (Mid Right) */}
      <div
        className="absolute top-[52%] right-[5%] w-24 h-14 sm:w-32 sm:h-18 rounded-full transition-transform duration-500 ease-out animate-float-slow"
        style={{
          transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(192,132,252,0.4) 40%, rgba(99,102,241,0.2) 70%, rgba(15,23,42,0.8) 100%)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 15px 35px rgba(168,85,247,0.15)",
        }}
      />

      {/* 4. Chrome Metallic Candy Swirl (Top Left) */}
      <div
        className="absolute top-[25%] left-[8%] w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-transform duration-700 ease-out animate-pulse-glow"
        style={{
          transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)`,
          background: "conic-gradient(from 0deg, #e2e8f0, #475569, #ffffff, #1e293b, #e2e8f0)",
          boxShadow: "0 10px 30px rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}
