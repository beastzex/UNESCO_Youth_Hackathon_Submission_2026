"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole, RoleType } from "@/context/RoleContext";
import { useLanguage } from "@/context/LanguageContext";
import { LeafletMap } from "@/components/LeafletMap";
import { MaskedHeroType } from "@/components/MaskedHeroType";
import {
  Eye,
  Search,
  FlaskConical,
  Radio,
  Activity,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Fingerprint
} from "lucide-react";

// V0ICE Accent Palette
const ACCENT = {
  v: "#8B5CF6", // Violet
  zero: "#3B82F6", // Blue
  i: "#22C55E", // Green
  c: "#EAB308", // Yellow
  e: "#EF4444", // Red
};

// Scroll Reveal Hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal, .reveal-left, .reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function VoisLandingPage() {
  const { strains, submissions } = useVoisStore();
  const { setRole } = useRole();
  const { t } = useLanguage();

  const [activePipelineRole, setActivePipelineRole] = useState<number>(0);
  const [selectedStrainFilter, setSelectedStrainFilter] = useState<string>("all");
  const [pledged, setPledged] = useState<boolean>(false);
  const [pledgeCount, setPledgeCount] = useState<number>(14829);

  const pendingCount = submissions.filter((s) => s.status === "pending_review").length;
  const vaccinatedCount = strains.filter((s) => s.has_vaccine).length;

  const pageRef = useScrollReveal();

  const pipelineStages = [
    {
      step: "01",
      role: t("role_spotter"),
      roleKey: "spotter" as RoleType,
      icon: Eye,
      href: "/submit",
      title: t("role_spotter_title"),
      tagline: t("role_spotter_tagline"),
      desc: t("role_spotter_desc"),
      accent: ACCENT.v,
      interactiveMock: {
        type: t("mock1_type"),
        badge: t("mock1_badge"),
        specimen: t("mock1_specimen"),
        aiDiagnosis: t("mock1_ai"),
        action: t("mock1_action"),
      },
    },
    {
      step: "02",
      role: t("role_analyst"),
      roleKey: "analyst" as RoleType,
      icon: Search,
      href: "/analyst",
      title: t("role_analyst_title"),
      tagline: t("role_analyst_tagline"),
      desc: t("role_analyst_desc"),
      accent: ACCENT.zero,
      interactiveMock: {
        type: t("mock2_type"),
        badge: t("mock2_badge"),
        specimen: t("mock2_specimen"),
        aiDiagnosis: t("mock2_ai"),
        action: t("mock2_action"),
      },
    },
    {
      step: "03",
      role: t("role_vaccine"),
      roleKey: "vaccine_maker" as RoleType,
      icon: FlaskConical,
      href: "/vaccine",
      title: t("role_vaccine_title"),
      tagline: t("role_vaccine_tagline"),
      desc: t("role_vaccine_desc"),
      accent: ACCENT.i,
      interactiveMock: {
        type: t("mock3_type"),
        badge: t("mock3_badge"),
        specimen: t("mock3_specimen"),
        aiDiagnosis: t("mock3_ai"),
        action: t("mock3_action"),
      },
    },
    {
      step: "04",
      role: t("role_field"),
      roleKey: "field_health_worker" as RoleType,
      icon: Radio,
      href: "/distribute",
      title: t("role_field_title"),
      tagline: t("role_field_tagline"),
      desc: t("role_field_desc"),
      accent: ACCENT.c,
      interactiveMock: {
        type: t("mock4_type"),
        badge: t("mock4_badge"),
        specimen: t("mock4_specimen"),
        aiDiagnosis: t("mock4_ai"),
        action: t("mock4_action"),
      },
    },
    {
      step: "05",
      role: t("role_lead"),
      roleKey: "public_view" as RoleType,
      icon: Activity,
      href: "/map",
      title: t("role_lead_title"),
      tagline: t("role_lead_tagline"),
      desc: t("role_lead_desc"),
      accent: ACCENT.e,
      interactiveMock: {
        type: t("mock5_type"),
        badge: t("mock5_badge"),
        specimen: t("mock5_specimen"),
        aiDiagnosis: t("mock5_ai"),
        action: t("mock5_action"),
      },
    },
  ];

  const currentStage = pipelineStages[activePipelineRole];

  const filteredStrains = selectedStrainFilter === "all"
    ? strains
    : strains.filter((s) => {
        if (selectedStrainFilter === "vaccinated") return s.has_vaccine;
        if (selectedStrainFilter === "deepfake") return s.technique === "deepfake";
        return s.technique === selectedStrainFilter;
      });

  return (
    <div ref={pageRef} className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* ====================================================== */}
      {/* SCENE 1 · HERO (Inverts Black/White in Light Mode)     */}
      {/* ====================================================== */}
      <section className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        <MaskedHeroType />
        <div className="absolute bottom-8 inset-x-0 flex justify-center items-center pointer-events-none z-30">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("manifesto-section");
              el ? el.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }}
            className="pointer-events-auto text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white flex items-center justify-center gap-2 animate-bounce py-2 px-4 transition-colors cursor-pointer bg-transparent border-0 outline-none select-none"
            aria-label="Scroll to Explore"
          >
            <span>↓ {t("scroll_explore")}</span>
          </button>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 2 · EDITORIAL MANIFESTO & ACTIVE INTAKE          */}
      {/* ====================================================== */}
      <section id="manifesto-section" className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto">
          {/* Top Status Bar */}
          <div className="reveal flex flex-wrap items-center justify-between gap-4 pb-12 border-b border-black/[0.08] dark:border-white/[0.08] text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("hero_tag")}</span>
              <span className="text-black/20 dark:text-white/20">/</span>
              <span className="text-black/70 dark:text-white/70">{t("hero_subtag")}</span>
            </div>
            <div className="flex items-center gap-6 text-black/40 dark:text-white/40">
              <span>{t("status_protocol")}</span>
              <span className="hidden md:inline">{t("status_operational")}</span>
            </div>
          </div>

          {/* Editorial Split Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 pt-12 items-start">
            {/* Left Giant Typographic Statement */}
            <div className="lg:col-span-8 space-y-8">
              <h2 className="reveal reveal-delay-1 font-manrope text-4xl sm:text-6xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-[1.04]">
                {t("hero_statement_1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-emerald-500 to-amber-500">
                  {t("hero_statement_2")}
                </span>
              </h2>

              <p className="reveal reveal-delay-2 text-lg sm:text-xl font-light text-black/60 dark:text-white/60 max-w-3xl leading-relaxed">
                {t("hero_desc")}
              </p>

              {/* Action Buttons */}
              <div className="reveal reveal-delay-3 flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/submit"
                  onClick={() => setRole("spotter")}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-manrope font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-xl cursor-pointer"
                >
                  <span>{t("btn_report")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/map"
                  onClick={() => setRole("public_view")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent text-black dark:text-white font-manrope font-semibold text-xs uppercase tracking-wider border border-black/20 hover:border-black hover:bg-black hover:text-white dark:border-white/20 dark:hover:border-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
                >
                  <span>{t("btn_map")}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Architectural Protocol Card */}
            <div className="reveal reveal-delay-2 lg:col-span-4 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between text-xs font-manrope font-bold uppercase tracking-wider text-black/40 dark:text-white/40 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
                <span>{t("card_surveillance_telemetry")}</span>
                <span className="text-emerald-500 font-bold">{t("card_live_feed")}</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.06] space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-manrope">
                    <span className="text-black/40 dark:text-white/40">{t("card_vector_defense")}</span>
                    <span className="font-bold text-emerald-500">{t("card_contained")}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full w-[94.8%]" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.06] space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-manrope">
                    <span className="text-black/40 dark:text-white/40">{t("card_mean_time")}</span>
                    <span className="font-bold text-black dark:text-white">{t("card_minutes")}</span>
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                    {t("card_mean_time_desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.06] space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-manrope">
                    <span className="text-black/40 dark:text-white/40">{t("card_unesco_framework")}</span>
                    <span className="font-bold text-amber-500">{t("card_youth_led")}</span>
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                    {t("card_unesco_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 3 · BIO-IMMUNE TELEMETRY CONSOLE                 */}
      {/* ====================================================== */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="reveal flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("telemetry_tag")}
                </span>
              </div>
              <h3 className="reveal reveal-delay-1 font-manrope text-2xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
                {t("telemetry_heading")}
              </h3>
            </div>
            <span className="text-xs font-manrope text-black/40 dark:text-white/40">
              {t("telemetry_sync")}
            </span>
          </div>

          {/* Architectural 4-Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="reveal reveal-delay-1 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("metrics_detections")}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT.v }} />
              </div>
              <div className="font-manrope text-5xl sm:text-6xl font-extrabold text-black dark:text-white leading-none">
                {submissions.length}
              </div>
              <div className="flex items-center justify-between text-xs text-black/40 dark:text-white/40 border-t border-black/[0.06] dark:border-white/[0.06] pt-3">
                <span>{t("metric_sub_ingest")}</span>
                <span className="text-violet-500 font-semibold">{t("metric_sub_hour")}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="reveal reveal-delay-2 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("metrics_confirmed")}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT.zero }} />
              </div>
              <div className="font-manrope text-5xl sm:text-6xl font-extrabold text-black dark:text-white leading-none">
                {strains.length}
              </div>
              <div className="flex items-center justify-between text-xs text-black/40 dark:text-white/40 border-t border-black/[0.06] dark:border-white/[0.06] pt-3">
                <span>{t("metric_sub_clustered")}</span>
                <span className="text-blue-500 font-semibold">{t("metric_sub_hotspots")}</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="reveal reveal-delay-3 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("metrics_vaccines")}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT.i }} />
              </div>
              <div className="font-manrope text-5xl sm:text-6xl font-extrabold text-black dark:text-white leading-none">
                {vaccinatedCount}
              </div>
              <div className="flex items-center justify-between text-xs text-black/40 dark:text-white/40 border-t border-black/[0.06] dark:border-white/[0.06] pt-3">
                <span>{t("metric_sub_doses")}</span>
                <span className="text-emerald-500 font-semibold">{t("metric_sub_verified")}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="reveal reveal-delay-4 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("metrics_pending")}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT.c }} />
              </div>
              <div className="font-manrope text-5xl sm:text-6xl font-extrabold text-black dark:text-white leading-none">
                {pendingCount}
              </div>
              <div className="flex items-center justify-between text-xs text-black/40 dark:text-white/40 border-t border-black/[0.06] dark:border-white/[0.06] pt-3">
                <span>{t("metric_sub_awaiting")}</span>
                <span className="text-amber-500 font-semibold">{t("metric_sub_speed")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 4 · INTERACTIVE 5-ROLE TRANSMISSION CHAMBER      */}
      {/* ====================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto space-y-14">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="reveal flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("protocol_tag")}
                </span>
              </div>
              <h2 className="reveal reveal-delay-1 font-manrope text-3xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight">
                {t("protocol_heading")}
              </h2>
            </div>
            <p className="reveal reveal-delay-2 text-sm text-black/50 dark:text-white/50 max-w-md leading-relaxed">
              {t("protocol_desc")}
            </p>
          </div>

          {/* Interactive Pipeline Stage Switcher */}
          <div className="reveal grid grid-cols-2 sm:grid-cols-5 gap-3">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activePipelineRole === idx;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActivePipelineRole(idx)}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between space-y-4 cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-neutral-900 border-black/40 dark:border-white/40 shadow-xl scale-[1.02]"
                      : "bg-neutral-50 dark:bg-neutral-950/40 border-black/[0.06] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-manrope font-bold border"
                      style={{
                        borderColor: `${stage.accent}60`,
                        color: stage.accent,
                        backgroundColor: `${stage.accent}15`,
                      }}
                    >
                      {stage.step}
                    </span>
                    <Icon className="w-4 h-4" style={{ color: stage.accent }} />
                  </div>
                  <div>
                    <span className="text-xs font-manrope font-bold uppercase tracking-wider block" style={{ color: stage.accent }}>
                      {stage.role}
                    </span>
                    <span className="font-manrope text-sm font-bold text-black dark:text-white block mt-0.5">
                      {stage.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Simulator Stage Card */}
          <div className="reveal-scale p-8 sm:p-12 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-manrope font-semibold" style={{ borderColor: `${currentStage.accent}50`, color: currentStage.accent, backgroundColor: `${currentStage.accent}15` }}>
                <span>{t("stage_protocol")} {currentStage.step}</span>
                <span>·</span>
                <span>{currentStage.tagline}</span>
              </div>

              <h3 className="font-manrope text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight">
                {currentStage.title}
              </h3>

              <p className="text-base text-black/60 dark:text-white/60 font-light leading-relaxed">
                {currentStage.desc}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={currentStage.href}
                  onClick={() => setRole(currentStage.roleKey)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-manrope font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>{t("launch_console")} ({currentStage.role})</span>
                  <span>→</span>
                </Link>
                <span className="text-xs font-manrope text-black/40 dark:text-white/40">
                  {t("step_of").replace("{step}", currentStage.step)}
                </span>
              </div>
            </div>

            {/* Live Interactive Specimen Simulator */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-black/80 border border-black/[0.08] dark:border-white/[0.08] space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-3 text-xs font-manrope">
                <span className="text-black/40 dark:text-white/40 uppercase tracking-wider">{currentStage.interactiveMock.type}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${currentStage.accent}25`, color: currentStage.accent }}>
                  {currentStage.interactiveMock.badge}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">{t("live_specimen_payload")}</div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-black/[0.06] dark:border-white/[0.06] text-sm text-black/90 dark:text-white/90 font-medium leading-relaxed">
                  &ldquo;{currentStage.interactiveMock.specimen}&rdquo;
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">{t("ai_diagnostic_stream")}</div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {currentStage.interactiveMock.aiDiagnosis}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-black/50 dark:text-white/50">{t("surveillance_result")}</span>
                <span className="font-bold text-black dark:text-white">{currentStage.interactiveMock.action}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 5 · SURVEILLANCE RADAR (Outbreak Map)            */}
      {/* ====================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="reveal flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("radar_tag")}
                </span>
              </div>
              <h2 className="reveal reveal-delay-1 font-manrope text-3xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight">
                {t("radar_heading")}
              </h2>
            </div>
            <Link
              href="/map"
              className="reveal reveal-delay-2 group inline-flex items-center gap-2 px-6 py-3 text-xs font-manrope font-semibold uppercase tracking-wider text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white border border-black/20 hover:border-black dark:border-white/20 dark:hover:border-white rounded-full transition-all cursor-pointer"
            >
              <span>{t("radar_btn")}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="reveal-scale">
            <LeafletMap />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 6 · SPECIMEN DOSSIER (Threat Vectors & Vaccines) */}
      {/* ====================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto space-y-12">
          {/* Header + Filter Pill Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="reveal flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-manrope font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {t("strains_tag")}
                </span>
              </div>
              <h2 className="reveal reveal-delay-1 font-manrope text-3xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight">
                {t("strains_heading")}
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="reveal reveal-delay-2 flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: t("filter_all") },
                { id: "vaccinated", label: t("filter_vaccinated") },
                { id: "deepfake", label: t("filter_deepfake") },
                { id: "doctored_screenshot", label: t("filter_doctored") },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedStrainFilter(f.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-manrope font-semibold transition-all cursor-pointer ${
                    selectedStrainFilter === f.id
                      ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-md"
                      : "bg-neutral-100 dark:bg-neutral-950 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white border border-black/10 dark:border-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Forensic Specimen Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStrains.slice(0, 4).map((strain, i) => {
              const accentColor = [ACCENT.v, ACCENT.zero, ACCENT.i, ACCENT.c][i % 4];
              return (
                <div
                  key={strain.id}
                  className={`reveal reveal-delay-${(i % 2) + 1} group p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm`}
                >
                  <div className="space-y-4">
                    {/* Header Specimen Meta */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-manrope font-semibold uppercase tracking-wider py-1 px-3.5 rounded-full border"
                        style={{
                          borderColor: `${accentColor}60`,
                          color: accentColor,
                          backgroundColor: `${accentColor}15`,
                        }}
                      >
                        {strain.technique.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-manrope text-black/40 dark:text-white/40">
                        {strain.report_count} {t("reports_count")}
                      </span>
                    </div>

                    <h3 className="font-manrope text-2xl font-bold text-black dark:text-white leading-snug">
                      {strain.name}
                    </h3>

                    <p className="text-sm text-black/60 dark:text-white/60 font-light leading-relaxed">
                      {strain.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-black/40 dark:text-white/40">
                      <span className="font-semibold text-black/60 dark:text-white/60">{t("affected_territories")}</span>
                      {strain.regions_affected.map((r) => (
                        <span key={r} className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.06] text-black/70 dark:text-white/70">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vaccine Counter-Payload Drawer */}
                  <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                    {strain.has_vaccine && strain.vaccine ? (
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/80 border border-black/[0.06] dark:border-white/[0.06] space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-manrope font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{t("vaccine_active")}</span>
                          </div>
                          <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">{t("vaccine_dose")}</span>
                        </div>
                        <p className="text-xs text-black/80 dark:text-white/80 italic font-medium leading-relaxed">
                          &ldquo;{strain.vaccine.explainer}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20">
                        <span className="text-xs font-manrope font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t("no_vaccine")}</span>
                        </span>
                        <Link
                          href="/vaccine"
                          onClick={() => setRole("vaccine_maker")}
                          className="text-xs font-manrope font-bold text-black dark:text-white hover:underline uppercase cursor-pointer"
                        >
                          {t("synthesize_btn")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/strains"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-xs font-manrope font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
            >
              <span>{t("explore_all_vectors")} ({strains.length})</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SCENE 7 · UNESCO INITIATIVE & DIGITAL CITIZEN STAMP    */}
      {/* ====================================================== */}
      <section className="py-28 sm:py-36 px-4 sm:px-8 lg:px-12 bg-white dark:bg-black border-t border-black/[0.08] dark:border-white/[0.08] transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-xs font-manrope font-semibold text-black/60 dark:text-white/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("unesco_initiative")}</span>
          </div>

          <h2 className="reveal reveal-delay-1 font-manrope text-3xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white tracking-tight leading-[1.08]">
            {t("unesco_heading")}
          </h2>

          <p className="reveal reveal-delay-2 text-base sm:text-lg font-light text-black/60 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t("unesco_desc")}
          </p>

          {/* Interactive Citizen Inoculation Node Stamp */}
          <div className="reveal reveal-delay-3 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-black/[0.08] dark:border-white/[0.08] max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-manrope font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                {t("pledge_registry")}
              </span>
              <div className="text-2xl font-extrabold font-manrope text-black dark:text-white">
                {pledgeCount.toLocaleString()} {t("pledge_nodes_active")}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!pledged) {
                  setPledged(true);
                  setPledgeCount((prev) => prev + 1);
                }
              }}
              className={`w-full py-4 rounded-full text-xs font-manrope font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                pledged
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-extrabold"
                  : "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 hover:scale-[1.02]"
              }`}
            >
              {pledged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("pledge_activated")}</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>{t("unesco_cta")}</span>
                </>
              )}
            </button>

            {pledged && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in duration-300">
                ✓ CALLSIGN-VOICE-{Math.floor(1000 + Math.random() * 9000)} · {t("pledge_confirmation")}
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
