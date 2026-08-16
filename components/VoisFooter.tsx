"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function VoisFooter() {
  const { t } = useLanguage();

  return (
    <footer id="about" className="bg-white dark:bg-black text-black dark:text-white border-t border-black/[0.08] dark:border-white/[0.08] relative transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16">
        {/* Top Split */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          {/* Main Statement */}
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 block">
                {t("footer_immune_system")}
              </span>
            </div>

            <h2 className="font-manrope font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-black dark:text-white leading-tight">
              {t("hero_statement_1")} <br />
              {t("hero_statement_2")}
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-manrope font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
              >
                <span>{t("btn_report")}</span>
                <span>→</span>
              </Link>

              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent text-black dark:text-white font-manrope font-semibold text-xs uppercase tracking-wider border border-black/20 hover:border-black hover:bg-black hover:text-white dark:border-white/20 dark:hover:border-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
              >
                <span>{t("btn_map")}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Quick Roles in Top-Right */}
          <div className="flex flex-col items-start lg:items-end space-y-3 text-xs font-manrope font-semibold uppercase tracking-wider pt-2">
            <span className="text-black/40 dark:text-white/40 pb-1 text-xs">{t("footer_loop")}</span>
            <Link href="/submit" className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              01 / {t("role_spotter")} →
            </Link>
            <Link href="/analyst" className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              02 / {t("role_analyst")} →
            </Link>
            <Link href="/vaccine" className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              03 / {t("role_vaccine")} →
            </Link>
            <Link href="/distribute" className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              04 / {t("role_field")} →
            </Link>
            <Link href="/map" className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              05 / {t("role_lead")} →
            </Link>
          </div>
        </div>

        {/* Bottom Details & Hackathon Credits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-black/[0.08] dark:border-white/[0.08] text-xs text-black/60 dark:text-white/60 font-manrope">
          <div>
            <span className="font-bold text-black dark:text-white uppercase tracking-wider block mb-1">
              {t("footer_project")}
            </span>
            <p>V0ICE — {t("footer_immune_system")}</p>
            <p className="text-black/40 dark:text-white/40">{t("hero_tag")}</p>
          </div>

          <div>
            <span className="font-bold text-black dark:text-white uppercase tracking-wider block mb-1">
              {t("footer_theme")}
            </span>
            <p>{t("footer_theme_desc")}</p>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <span className="font-bold text-black dark:text-white uppercase tracking-wider block mb-1">
                {t("footer_engine")}
              </span>
              <p>{t("footer_engine_desc")}</p>
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 pt-4">
              {t("footer_copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
