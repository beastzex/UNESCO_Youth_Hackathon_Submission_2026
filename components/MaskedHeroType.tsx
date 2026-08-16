"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

// Per-letter accent colours rendered in the accent lens layer
const LETTER_COLORS = [
  "#8B5CF6", // V — violet
  "#3B82F6", // 0 — blue
  "#22C55E", // I — green
  "#EAB308", // C — yellow
  "#EF4444", // E — red
];

export function MaskedHeroType() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);

    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let currentRadius = 20;
    let isInside = false;
    let lastTime = performance.now();
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        if (!isInside) {
          currentX = e.clientX - rect.left;
          currentY = e.clientY - rect.top;
        }
        isInside = true;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      } else {
        isInside = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", () => { isInside = false; }, { passive: true });

    const renderLoop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (isInside) {
        const posDamp = 1 - Math.exp(-18 * delta);
        currentX += (mouseX - currentX) * posDamp;
        currentY += (mouseY - currentY) * posDamp;

        let targetRadius = 20;
        if (wordRef.current) {
          const wordRect = wordRef.current.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const wLeft = wordRect.left - containerRect.left;
          const wRight = wordRect.right - containerRect.left;
          const wTop = wordRect.top - containerRect.top;
          const wBottom = wordRect.bottom - containerRect.top;
          const dx = Math.max(wLeft - mouseX, 0, mouseX - wRight);
          const dy = Math.max(wTop - mouseY, 0, mouseY - wBottom);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const falloffRange = 40;
          if (distance === 0) {
            targetRadius = 75;
          } else if (distance < falloffRange) {
            const t = 1 - distance / falloffRange;
            targetRadius = 20 + t * t * (3 - 2 * t) * 55;
          }
        }

        const radiusDamp = 1 - Math.exp(-16 * delta);
        currentRadius += (targetRadius - currentRadius) * radiusDamp;
        lens.style.clipPath = `circle(${currentRadius.toFixed(2)}px at ${currentX.toFixed(2)}px ${currentY.toFixed(2)}px)`;
        lens.style.opacity = "1";
      } else {
        lens.style.opacity = "0";
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const letters = ["V", "0", "I", "C", "E"];

  // Shared letter geometry renderer
  const renderLetters = (colors: string[]) => (
    <h1 className="font-heavy-grotesk text-[19vw] sm:text-[20vw] md:text-[21vw] lg:text-[22vw] leading-[1] tracking-tight flex items-center justify-center w-full">
      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          paddingTop: "0.15em",
          paddingBottom: "0.15em",
          lineHeight: 1,
        }}
      >
        <span
          ref={wordRef}
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.03em",
            lineHeight: 1,
          }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: animated ? "translateY(0)" : "translateY(115%)",
                transition: `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms`,
                willChange: "transform",
                lineHeight: 1,
                color: colors[i],
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );

  const isDark = theme === "dark";
  const baseBg = isDark ? "bg-black" : "bg-white";
  const baseTextColor = isDark ? "#FFFFFF" : "#000000";
  const lensBg = isDark ? "bg-white" : "bg-black";

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden select-none cursor-crosshair transition-colors duration-300 ${baseBg}`}
    >
      {/* ============================================================ */}
      {/* LAYER 1 (BASE):                                              */}
      {/* Dark Mode: Black bg — all letters WHITE                      */}
      {/* Light Mode: White bg — all letters BLACK                     */}
      {/* ============================================================ */}
      <div className={`absolute inset-0 w-full h-full ${baseBg} flex items-center justify-center pointer-events-none px-4 sm:px-8 transition-colors duration-300`}>
        {renderLetters(letters.map(() => baseTextColor))}
      </div>

      {/* ============================================================ */}
      {/* LAYER 2 (ACCENT LENS):                                       */}
      {/* Dark Mode: WHITE circle lens with accent-coloured letters    */}
      {/* Light Mode: BLACK circle lens with accent-coloured letters   */}
      {/* ============================================================ */}
      <div
        ref={lensRef}
        className={`absolute inset-0 w-full h-full ${lensBg} flex items-center justify-center pointer-events-none px-4 sm:px-8 transition-colors duration-300`}
        style={{
          clipPath: "circle(0px at 50% 50%)",
          opacity: 0,
          transition: "opacity 0.2s ease-out",
          willChange: "clip-path, opacity",
        }}
      >
        {renderLetters(LETTER_COLORS)}
      </div>
    </div>
  );
}

export { MaskedHeroType as FluidGlassHero };
