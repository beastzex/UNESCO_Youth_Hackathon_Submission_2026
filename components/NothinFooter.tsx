import React from "react";
import Link from "next/link";

export function NothinFooter() {
  return (
    <footer id="contact" className="bg-black text-white px-6 sm:px-12 lg:px-20 py-24 sm:py-36 border-t border-white/20 relative">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Top Split: Closing CTA Statement + Stacked Socials */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Main Statement */}
          <div className="space-y-8 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50 block">
              ( CONTACT )
            </span>
            <h2 className="font-heavy-grotesk text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95] uppercase">
              Let&apos;s start <br />
              from nothin&apos;.
            </h2>

            {/* Pill Buttons: BOOK A CALL → & DROP US AN EMAIL @ */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://calendly.com/hello-noth/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all hover:scale-105"
              >
                <span>BOOK A CALL</span>
                <span>→</span>
              </a>

              <a
                href="mailto:hello@noth.in"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent text-white font-bold text-xs uppercase tracking-wider border border-white hover:bg-white hover:text-black transition-all"
              >
                <span>DROP US AN EMAIL</span>
                <span>@</span>
              </a>
            </div>
          </div>

          {/* Stacked Socials in Top-Right */}
          <div className="flex flex-col items-start lg:items-end space-y-3 text-xs font-bold uppercase tracking-widest pt-4">
            <span className="text-white/40 pb-2 text-[10px]">DIRECT CHANNELS</span>
            <a
              href="https://www.linkedin.com/company/nothin/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:opacity-70 transition-opacity"
            >
              Linkedin →
            </a>
            <a
              href="https://www.instagram.com/nooothinatall/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:opacity-70 transition-opacity"
            >
              Instagram →
            </a>
            <a
              href="https://www.behance.net/nothintoshow"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:opacity-70 transition-opacity"
            >
              Behance →
            </a>
          </div>
        </div>

        {/* Bottom Credits & Studio Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/20 text-xs text-white/60">
          <div>
            <span className="font-bold text-white uppercase tracking-widest block mb-1">
              STUDIO
            </span>
            <p>Nothin&apos; — Paris, France</p>
            <p>A protean augmented-creative studio</p>
          </div>

          <div>
            <span className="font-bold text-white uppercase tracking-widest block mb-1">
              CREDITS
            </span>
            <p>Founded by Sara Guedj</p>
            <p>Site & visuals by Pierre Patrault, Thomas Carré & Guillaume Perrette</p>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <span className="font-bold text-white uppercase tracking-widest block mb-1">
                ARCHIVE
              </span>
              <p>24 . 26</p>
            </div>
            <p className="text-[10px] text-white/40 pt-4">
              © 2026 NOTHIN&apos;. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
