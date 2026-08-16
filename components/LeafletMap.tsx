"use client";

import React, { useState } from "react";
import { useVoisStore } from "@/lib/store";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function LeafletMap() {
  const { strains, regions, getRegionImmunityScore } = useVoisStore();
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string | null>("Capital Area");

  const activeStrainsForSelected = strains.filter((s) =>
    selectedRegion ? s.regions_affected.includes(selectedRegion) : false
  );

  const selectedScore = selectedRegion ? getRegionImmunityScore(selectedRegion) : 0;

  const scoreColor = (score: number) => {
    if (score >= 70) return "#22C55E"; // green (accent-i)
    if (score >= 35) return "#EAB308"; // yellow (accent-c)
    return "#EF4444";                  // red (accent-e)
  };

  return (
    <div className="relative w-full min-h-[600px] bg-neutral-50 dark:bg-neutral-950/70 border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm transition-colors duration-300">

      {/* ─── Left: Map Canvas ─────────────────────────────── */}
      <div className="relative flex-1 h-full p-6 sm:p-8 flex flex-col gap-6 overflow-hidden bg-white dark:bg-[#080808]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">
              {t("radar_tag")}
            </span>
          </div>
          <span className="text-xs font-manrope font-medium text-black/40 dark:text-white/30 hidden sm:block">
            {regions.length} {t("radar_monitored")}
          </span>
        </div>

        {/* Region Grid */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
            {regions.map((region, idx) => {
              const activeCount = strains.filter((s) => s.regions_affected.includes(region.name)).length;
              const score = getRegionImmunityScore(region.name);
              const isSelected = selectedRegion === region.name;
              const color = scoreColor(score);

              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.name)}
                  className={`p-5 text-left rounded-xl transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? "border-black/40 dark:border-white/40 bg-neutral-100 dark:bg-white/[0.08] shadow-md"
                      : "border-black/[0.06] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 bg-neutral-50/60 dark:bg-neutral-950/40"
                  }`}
                >
                  {/* Score bar */}
                  <div className="h-[3px] w-full bg-black/10 dark:bg-white/[0.08] mb-3.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${score}%`, backgroundColor: color }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-manrope font-medium text-black/40 dark:text-white/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-manrope font-bold" style={{ color }}>
                      {score}%
                    </span>
                  </div>

                  <h4 className="font-manrope text-base font-bold text-black dark:text-white leading-tight">
                    {region.name}
                  </h4>
                  <p className="text-xs text-black/40 dark:text-white/40 font-medium mt-1">
                    {activeCount} {t("reports_count")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-manrope font-medium text-black/50 dark:text-white/40 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#22C55E" }} />
            {t("radar_stable")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#EAB308" }} />
            {t("radar_moderate")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#EF4444" }} />
            {t("radar_critical")}
          </span>
        </div>
      </div>

      {/* ─── Right: Region Detail Panel ───────────────────── */}
      <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-black/[0.08] dark:border-white/[0.08] bg-neutral-50 dark:bg-black/40 p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
        {selectedRegion ? (
          <>
            {/* Region Header */}
            <div className="space-y-3 pb-5 border-b border-black/[0.08] dark:border-white/[0.08]">
              <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 block">
                {t("radar_regional_report")}
              </span>
              <h3 className="font-manrope text-2xl font-bold text-black dark:text-white">{selectedRegion}</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[3px] bg-black/10 dark:bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedScore}%`, backgroundColor: scoreColor(selectedScore) }}
                  />
                </div>
                <span className="text-sm font-bold font-manrope" style={{ color: scoreColor(selectedScore) }}>
                  {selectedScore}%
                </span>
              </div>
            </div>

            {/* Active Strains */}
            <div className="space-y-4 flex-1">
              <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 block">
                {t("radar_active_strains")} ({activeStrainsForSelected.length})
              </span>

              {activeStrainsForSelected.length === 0 ? (
                <p className="text-xs text-black/40 dark:text-white/40 font-normal leading-relaxed py-4">
                  {t("radar_no_strains")}
                </p>
              ) : (
                activeStrainsForSelected.map((strain) => {
                  const isDistributed = strain.distributed_regions.includes(selectedRegion);
                  return (
                    <div key={strain.id} className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-neutral-900/40 border border-black/[0.06] dark:border-white/[0.06] shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-manrope font-semibold uppercase tracking-wider text-black/70 dark:text-white/60 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                          {strain.technique.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-black/40 dark:text-white/40">{strain.report_count} {t("reports_count")}</span>
                      </div>
                      <h4 className="font-manrope text-sm font-bold text-black dark:text-white leading-snug">
                        {strain.name}
                      </h4>
                      <p className="text-xs text-black/60 dark:text-white/50 font-normal line-clamp-2 leading-relaxed">
                        {strain.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-1">
                        {strain.has_vaccine ? (
                          <span className="flex items-center gap-1 font-manrope font-medium text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isDistributed ? t("radar_distributed") : t("radar_vaccine_ready")}
                          </span>
                        ) : (
                          <span className="font-manrope font-medium text-rose-600 dark:text-rose-400">{t("no_vaccine")}</span>
                        )}
                        {!strain.has_vaccine && (
                          <Link href="/vaccine" className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors text-xs font-manrope font-semibold uppercase cursor-pointer">
                            {t("synthesize_btn")}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-black/[0.08] dark:border-white/[0.08]">
              <Link
                href="/distribute"
                className="w-full text-center block py-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-manrope font-bold uppercase tracking-wider transition-colors rounded-full shadow-md cursor-pointer"
              >
                {t("radar_deploy_btn")}
              </Link>
              <Link
                href="/strains"
                className="w-full text-center block py-2 text-xs font-manrope font-semibold text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t("radar_view_all")}
              </Link>
            </div>
          </>
        ) : (
          <p className="my-auto text-xs text-black/40 dark:text-white/40 font-normal text-center leading-relaxed">
            {t("radar_select_prompt")}
          </p>
        )}
      </div>
    </div>
  );
}
