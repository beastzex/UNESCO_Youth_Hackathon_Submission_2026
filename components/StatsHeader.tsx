"use client";

import React from "react";
import { Strain, Submission } from "@/types";
import { ShieldCheck, Eye, Syringe, Radio, TrendingUp } from "lucide-react";

interface StatsHeaderProps {
  strains: Strain[];
  submissions: Submission[];
}

export function StatsHeader({ strains, submissions }: StatsHeaderProps) {
  const pendingSubmissions = submissions.filter((s) => s.status === "pending_review").length;
  const confirmedSubmissions = submissions.filter((s) => s.status === "confirmed").length;
  const vaccinatedStrains = strains.filter((s) => s.has_vaccine).length;
  
  // Total distribution points
  const totalDistributedPoints = strains.reduce(
    (acc, s) => acc + (s.distributed_regions?.length || 0),
    0
  );

  // Overall Herd Immunity across all strains and regions
  const totalPossiblePoints = strains.reduce(
    (acc, s) => acc + Math.max(1, s.regions_affected?.length || 1),
    0
  );
  const overallHerdImmunity = totalPossiblePoints > 0
    ? Math.round((totalDistributedPoints / totalPossiblePoints) * 100)
    : 0;

  const stats = [
    {
      label: "Spotter Reports",
      value: submissions.length,
      subtext: `${pendingSubmissions} in triage queue`,
      icon: Eye,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Active Strains",
      value: strains.length,
      subtext: `${confirmedSubmissions} verified vectors`,
      icon: TrendingUp,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      label: "Synthesized Vaccines",
      value: vaccinatedStrains,
      subtext: `${strains.length - vaccinatedStrains} strains need explainer`,
      icon: Syringe,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      label: "Field Dispatches",
      value: totalDistributedPoints,
      subtext: "Regional inoculation units",
      icon: Radio,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      label: "System Herd Immunity",
      value: `${overallHerdImmunity}%`,
      subtext: overallHerdImmunity > 50 ? "Stable containment" : "Elevated transmission",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl bg-white border shadow-sm transition-all hover:shadow-md ${
              stat.highlight ? "ring-2 ring-teal-500/30 border-teal-300" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`p-1.5 rounded-lg border ${stat.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
