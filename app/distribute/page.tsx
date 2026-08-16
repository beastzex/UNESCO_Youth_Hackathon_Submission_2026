"use client";

import React from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { 
  Radio, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Activity, 
  MapPin 
} from "lucide-react";

export default function FieldHealthWorkerPage() {
  const { strains, regions, toggleDistribution, getRegionImmunityScore } = useVoisStore();
  const { setRole } = useRole();

  const vaccinatedStrains = strains.filter((s) => s.has_vaccine);

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-black pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black/50">
              <Radio className="w-4 h-4 text-amber-600" />
              <span>ROLE: FIELD HEALTH WORKER — REGIONAL DEPLOYMENT DISPATCH</span>
            </div>
            <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-black uppercase">
              Deploy Counter-Content To Affected Territories
            </h1>
            <p className="text-sm sm:text-base font-light text-black/70">
              Broadcast verified plain-language vaccines across grassroots messaging groups, local press, and community networks to establish regional herd immunity.
            </p>
          </div>

          <Link
            href="/map"
            onClick={() => setRole("public_view")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors"
          >
            <span>VIEW OUTBREAK RADAR MAP</span>
            <span>→</span>
          </Link>
        </div>

        {/* Regional Herd Immunity Score Ticker */}
        <div className="p-6 bg-neutral-100 border border-black space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase">
            <span>LIVE REGIONAL HERD IMMUNITY RADAR</span>
            <span className="text-black/50 font-normal">
              Formula: (Distributed Vaccines ÷ Active Strains) × 100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {regions.map((region) => {
              const score = getRegionImmunityScore(region.name);
              const activeCount = strains.filter((s) => s.regions_affected.includes(region.name)).length;

              let badgeColor = "bg-rose-500 text-white";
              if (score >= 70) badgeColor = "bg-emerald-500 text-black";
              else if (score >= 35) badgeColor = "bg-amber-400 text-black";

              return (
                <div key={region.id} className="p-4 bg-white border border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase">{region.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${badgeColor}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-black/60">
                    {activeCount} Active {activeCount === 1 ? "Strain" : "Strains"}
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vaccinated Strains Distribution Matrix */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/20 pb-3">
            <h2 className="font-heavy-grotesk text-xl uppercase tracking-tight">
              Ready Vaccines Deployment Matrix ({vaccinatedStrains.length})
            </h2>
            <span className="text-[10px] font-mono text-black/50 uppercase">
              CLICK REGION BUTTONS TO TOGGLE BROADCAST
            </span>
          </div>

          {vaccinatedStrains.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-black/30 text-center space-y-3">
              <div className="font-heavy-grotesk text-xl uppercase">No Vaccines Ready For Deployment</div>
              <p className="text-xs font-mono text-black/60">
                Vaccine Makers must attach counter-explainers to confirmed strains before field distribution can begin.
              </p>
              <div className="pt-2">
                <Link
                  href="/vaccine"
                  onClick={() => setRole("vaccine_maker")}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Synthesize Vaccines in Lab →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {vaccinatedStrains.map((strain) => (
                <div key={strain.id} className="p-6 sm:p-8 border-2 border-black bg-neutral-50 space-y-6">
                  {/* Top Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/20 pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black text-white uppercase">
                        {strain.technique.replace(/_/g, " ")}
                      </span>
                      <h3 className="font-editorial-serif text-2xl text-black">
                        {strain.name}
                      </h3>
                    </div>

                    <div className="text-right text-xs font-mono">
                      <span className="text-black/50 block">AFFECTED VECTORS:</span>
                      <span className="font-bold text-black">{strain.regions_affected.join(" • ")}</span>
                    </div>
                  </div>

                  {/* Attached Vaccine Rebuttal */}
                  {strain.vaccine && (
                    <div className="p-4 bg-white border border-black space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
                        <ShieldCheck className="w-4 h-4" /> BROADCAST REBUTTAL TEXT
                      </div>
                      <h4 className="font-bold text-sm text-black">&ldquo;{strain.vaccine.title}&rdquo;</h4>
                      <p className="text-xs text-black/80 font-light italic">{strain.vaccine.explainer}</p>
                    </div>
                  )}

                  {/* Region Distribution Buttons */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-black font-bold block">
                      DISTRIBUTE VACCINE TO REGIONAL CHANNELS:
                    </span>

                    <div className="flex flex-wrap gap-3">
                      {regions.map((reg) => {
                        const isDistributed = strain.distributed_regions.includes(reg.name);
                        const isAffected = strain.regions_affected.includes(reg.name);

                        return (
                          <button
                            key={reg.id}
                            type="button"
                            onClick={() => toggleDistribution(strain.id, reg.name)}
                            className={`px-4 py-2.5 text-xs font-mono uppercase transition-all flex items-center gap-2 border ${
                              isDistributed
                                ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                                : isAffected
                                ? "bg-white text-rose-700 border-rose-400 hover:bg-rose-50"
                                : "bg-white text-black border-black hover:bg-neutral-200"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span>{reg.name}</span>
                            {isDistributed && <Check className="w-3.5 h-3.5" />}
                            {!isDistributed && isAffected && (
                              <span className="text-[9px] px-1 bg-rose-100 text-rose-800 font-bold">
                                ACTIVE VECTOR
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
