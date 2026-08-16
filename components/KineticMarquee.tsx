"use client";

import React from "react";

export function KineticMarquee({ reverse = false }: { reverse?: boolean }) {
  const items = [
    "we are nothin'",
    "[ 010101 ]",
    "because nothin' is everythin'",
    "( 08 )",
    "we are nothin'",
    "refuse the generic",
    "paris 24.26",
    "we are nothin'",
    "augmented creative",
    "[ 000 ]",
    "we are nothin'",
    "perspective over style",
  ];

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-6 bg-studio-900 border-y border-white/10 select-none">
      <div className={`inline-flex gap-8 items-center ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-xl sm:text-2xl md:text-3xl font-sans font-light tracking-tight text-studio-400 hover:text-white transition-colors uppercase">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-chrome-iridescent/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
