"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

export function NothinNavbar({ isLight = false }: { isLight?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "FR">("EN");

  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black" : "border-white";
  const buttonBg = isLight ? "bg-black text-white" : "bg-white text-black";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6 sm:px-10 lg:px-14 flex items-center justify-between pointer-events-none">
        {/* Top-Left: Stylized N' wordmark */}
        <Link
          href="/"
          className={`pointer-events-auto font-heavy-grotesk text-2xl sm:text-3xl tracking-tighter ${textColor} hover:opacity-75 transition-opacity`}
        >
          N&apos;
        </Link>

        {/* Top-Right: Micro-links, Language, Book a Call pill, and MENU :: */}
        <div className="pointer-events-auto flex items-center gap-5 sm:gap-8 text-xs font-bold uppercase tracking-widest">
          {/* Socials on large screens */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="https://www.linkedin.com/company/nothin/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} hover:opacity-70 transition-opacity`}
            >
              LINKEDIN
            </a>
            <a
              href="https://www.instagram.com/nooothinatall/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} hover:opacity-70 transition-opacity`}
            >
              INSTAGRAM
            </a>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "EN" ? "FR" : "EN")}
            className={`${textColor} hover:opacity-70 transition-opacity`}
          >
            {lang}
          </button>

          {/* Primary Pill Button: BOOK A CALL → */}
          <a
            href="https://calendly.com/hello-noth/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[11px] tracking-wider transition-transform hover:scale-105 ${buttonBg}`}
          >
            <span>BOOK A CALL</span>
            <span>→</span>
          </a>

          {/* Signature MENU :: Affordance */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`flex items-center gap-1.5 font-bold tracking-widest hover:opacity-70 transition-opacity ${textColor}`}
            aria-label="Open Menu"
          >
            <span>MENU</span>
            <span className="font-mono text-sm tracking-tighter">::</span>
          </button>
        </div>
      </header>

      {/* Fullscreen Minimalist Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-8 sm:p-16 animate-in fade-in duration-200">
          {/* Menu Top Bar */}
          <div className="flex items-center justify-between border-b border-white pb-6">
            <span className="font-heavy-grotesk text-3xl">N&apos;</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-70"
            >
              <span>CLOSE</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Giant Menu Links */}
          <nav className="my-auto space-y-6">
            {[
              { label: "Works", href: "/works" },
              { label: "Studio", href: "/#studio" },
              { label: "Manifesto", href: "/#manifesto" },
              { label: "Contact", href: "/#contact" },
            ].map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-heavy-grotesk text-5xl sm:text-7xl md:text-8xl uppercase tracking-tighter hover:italic transition-all inline-flex items-center gap-4 group"
                >
                  <span>{item.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-4xl sm:text-6xl font-sans">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Menu Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white pt-6 text-xs font-bold uppercase tracking-widest">
            <a href="mailto:hello@noth.in" className="hover:underline">
              DROP US AN EMAIL @ hello@noth.in
            </a>
            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/nothin/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LINKEDIN
              </a>
              <a
                href="https://www.instagram.com/nooothinatall/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                INSTAGRAM
              </a>
              <a
                href="https://www.behance.net/nothintoshow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                BEHANCE
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
