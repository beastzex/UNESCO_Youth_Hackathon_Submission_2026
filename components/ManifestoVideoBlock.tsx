"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Repeat, Maximize2, Sparkles } from "lucide-react";

export function ManifestoVideoBlock() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [variant, setVariant] = useState<"standard" | "reflect">("standard");
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-studio-950 border-y border-white/10 group">
      {/* Video Container */}
      <div className="relative aspect-[16/9] max-h-[85vh] w-full overflow-hidden bg-studio-900">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={`w-full h-full object-cover transition-all duration-700 ${
            variant === "reflect" ? "scale-x-[-1] contrast-125 saturate-150" : "scale-100"
          }`}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        />

        {/* Cinematic Film Grain & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-studio-950/60 pointer-events-none" />

        {/* Ambient Holographic Reflection */}
        {variant === "reflect" && (
          <div className="absolute inset-0 bg-chrome-iridescent/10 mix-blend-overlay pointer-events-none" />
        )}

        {/* Top Status Bar Overlays */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80 z-20 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] font-bold">
              [ NOTHIN_MANIFESTE_24.26 ]
            </span>
            <span className="hidden sm:inline-block text-studio-400 text-[10px] border border-white/20 px-2 py-0.5 rounded">
              {variant === "reflect" ? "MODE: REFLECT_H265" : "MODE: STANDARD_4K"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-studio-300 font-mono">00:01:24:08</span>
            <span className="text-studio-500 font-mono">( 08 )</span>
          </div>
        </div>

        {/* Bottom Interactive Controls Strip */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-studio-950 backdrop-blur-md border border-white/20 transition-all shadow-lg"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-studio-950 backdrop-blur-md border border-white/20 transition-all shadow-lg"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Reflection Mode Variant Toggle */}
            <button
              onClick={() => setVariant(variant === "standard" ? "reflect" : "standard")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider backdrop-blur-md border transition-all flex items-center gap-2 ${
                variant === "reflect"
                  ? "bg-white text-studio-950 border-white font-bold"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{variant === "reflect" ? "Reflect Variant: ON" : "Mirror Variant"}</span>
            </button>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs font-mono text-studio-300">
              Shot on 35mm & Generative Neural Synthetics
            </p>
            <p className="text-[10px] font-mono text-studio-500">
              Paris / Tokyo / Bunny CDN Edge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
