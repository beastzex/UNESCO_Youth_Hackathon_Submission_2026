"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRole, ROLES, RoleType } from "@/context/RoleContext";
import { useLanguage, GLOBAL_LANGUAGES, LanguageCode } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  Check, 
  ArrowUpRight,
  Menu,
  Sun,
  Moon
} from "lucide-react";

export function VoisNavbar() {
  const { role, roleInfo, setRole } = useRole();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langSliderRef = useRef<HTMLDivElement>(null);

  const currentLangObj = GLOBAL_LANGUAGES.find((l) => l.code === language) || GLOBAL_LANGUAGES[0];

  const slideLang = (direction: "left" | "right") => {
    if (langSliderRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      langSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const navItems = [
    { index: "01", label: t("nav_radar"), href: "/map", meta: t("nav_radar_meta") },
    { index: "02", label: t("nav_strains"), href: "/strains", meta: t("nav_strains_meta") },
    { index: "03", label: t("nav_report"), href: "/submit", meta: t("nav_report_meta") },
    { index: "04", label: t("nav_analyst"), href: "/analyst", meta: t("nav_analyst_meta") },
    { index: "05", label: t("nav_vaccine"), href: "/vaccine", meta: t("nav_vaccine_meta") },
    { index: "06", label: t("nav_field"), href: "/distribute", meta: t("nav_field_meta") },
  ];

  return (
    <>
      {/* Top Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/85 backdrop-blur-md text-black dark:text-white transition-colors duration-300 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          {/* Left: Brandmark */}
          <div className="flex items-center">
            <Link
              href="/"
              className="font-manrope font-extrabold text-2xl tracking-tighter text-black dark:text-white hover:opacity-80 transition-opacity"
            >
              V0ICE
            </Link>
          </div>

          {/* Right: Theme Toggle + Language Dropdown + Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/15 dark:border-white/20 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white text-xs font-manrope font-semibold hover:border-black/40 dark:hover:border-white/50 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-bold">{t("theme_light")}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-violet-600" />
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-bold">{t("theme_dark")}</span>
                </>
              )}
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  if (menuOpen) setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-manrope font-semibold tracking-wider transition-all cursor-pointer ${
                  langDropdownOpen
                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-lg"
                    : "bg-neutral-100 dark:bg-neutral-900 border-black/15 dark:border-white/20 text-black dark:text-white hover:border-black/40 dark:hover:border-white/50"
                }`}
                aria-label="Toggle Language Selector"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLangObj.code}</span>
                <span className="hidden sm:inline text-[11px] opacity-75">({currentLangObj.native})</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Language Dropdown Panel */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[320px] sm:w-[420px] bg-white dark:bg-neutral-950 text-black dark:text-white border border-black/15 dark:border-white/15 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
                    <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/60 dark:text-white/60 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> {t("nav_languages")} ({GLOBAL_LANGUAGES.length})
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => slideLang("left")}
                        className="p-1 rounded-full text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Slide Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => slideLang("right")}
                        className="p-1 rounded-full text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Slide Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Sliding Strip */}
                  <div
                    ref={langSliderRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1.5"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {GLOBAL_LANGUAGES.map((lang) => {
                      const isActive = language === lang.code;
                      const isFirstEuropean = lang.code === "FR";
                      const isFirstOther = lang.code === "HI";

                      return (
                        <React.Fragment key={lang.code}>
                          {isFirstEuropean && (
                            <div className="flex items-center gap-1.5 px-2 border-l border-black/15 dark:border-white/15 h-8 flex-shrink-0">
                              <span className="text-[9px] font-manrope font-bold uppercase tracking-widest text-black/40 dark:text-white/40 rotate-180 [writing-mode:vertical-rl]">
                                EUR
                              </span>
                            </div>
                          )}
                          {isFirstOther && (
                            <div className="flex items-center gap-1.5 px-2 border-l border-black/15 dark:border-white/15 h-8 flex-shrink-0">
                              <span className="text-[9px] font-manrope font-bold uppercase tracking-widest text-black/40 dark:text-white/40 rotate-180 [writing-mode:vertical-rl]">
                                WORLD
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setLanguage(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`px-3.5 py-2.5 rounded-xl text-left transition-all flex flex-col flex-shrink-0 min-w-[105px] border cursor-pointer ${
                              isActive
                                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md font-bold"
                                : "bg-neutral-50 dark:bg-neutral-900 border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            <span className="font-manrope text-xs font-bold">{lang.code}</span>
                            <span className="text-[10px] opacity-80 truncate max-w-[90px]">{lang.native}</span>
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                if (langDropdownOpen) setLangDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/15 dark:border-white/20 bg-transparent text-black dark:text-white font-manrope text-xs font-semibold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{t("menu")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Dimmer */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Navigation Drawer Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[480px] md:w-[540px] bg-white dark:bg-black text-black dark:text-white border-r border-black/15 dark:border-white/15 shadow-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-5">
          <div className="space-y-0.5">
            <span className="font-manrope font-extrabold text-2xl tracking-tighter text-black dark:text-white">V0ICE</span>
            <span className="text-xs font-manrope font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block">
              {t("footer_immune_system")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 dark:border-white/20 text-xs font-manrope font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <span>{t("close")}</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="py-6 space-y-8">
          {/* Main Route Index */}
          <nav className="space-y-4">
            <span className="text-xs font-manrope font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider block">
              {t("nav_protocols")}
            </span>

            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.index}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-manrope font-semibold text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {item.index}
                      </span>
                      <span className="font-manrope text-xl font-bold uppercase tracking-tight text-black/90 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-all">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-black/50 dark:text-white/50 pl-7 group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors">
                      {item.meta}
                    </p>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </nav>

          {/* Role Selector Strip */}
          <div className="space-y-3 border-t border-black/10 dark:border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-manrope font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">
                {t("nav_active_role")}
              </span>
              <span className="text-xs font-manrope font-bold text-emerald-600 dark:text-emerald-400">
                ● {roleInfo.title.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(ROLES) as RoleType[]).map((rKey) => {
                const r = ROLES[rKey];
                const isCurrent = role === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      setRole(rKey);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-black text-white dark:bg-white dark:text-black font-medium shadow-md"
                        : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-manrope font-bold uppercase tracking-wider">
                        {r.title}
                      </div>
                      <div className={`text-xs ${isCurrent ? "text-white/70 dark:text-black/70" : "text-black/40 dark:text-white/40"}`}>
                        {r.description}
                      </div>
                    </div>

                    {isCurrent && <Check className="w-4 h-4 text-white dark:text-black flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-black/10 dark:border-white/10 pt-5 text-xs font-manrope font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider flex items-center justify-between">
          <span>{t("hero_tag")}</span>
          <span>Paris</span>
        </div>
      </aside>
    </>
  );
}
