import React from "react";
import { TechniqueType, SubmissionStatus } from "@/types";

export function TechniqueBadge({ technique }: { technique?: TechniqueType | string }) {
  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    deepfake: {
      label: "Deepfake Video/Photo",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    cloned_voice: {
      label: "Cloned Voice Note",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    doctored_screenshot: {
      label: "Doctored Screenshot",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    fabricated_statistic: {
      label: "Fabricated Statistic",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    out_of_context_image: {
      label: "Out of Context Media",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    other: {
      label: "Synthetic Claim",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
  };

  const cfg = configs[technique || "other"] || configs.other;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        Confirmed Strain
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        Dismissed / Noise
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
      Pending Triage
    </span>
  );
}

export function HerdScoreBadge({ score }: { score: number }) {
  let color = "bg-rose-50 text-rose-700 border-rose-200";
  let label = "Critical Vulnerability";

  if (score >= 70) {
    color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = "Inoculated / Protected";
  } else if (score >= 40) {
    color = "bg-amber-50 text-amber-700 border-amber-200";
    label = "Moderate Resistance";
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-semibold ${color}`}>
      <span className="font-mono text-sm">{score}%</span>
      <span className="text-[11px] opacity-80">{label}</span>
    </div>
  );
}
