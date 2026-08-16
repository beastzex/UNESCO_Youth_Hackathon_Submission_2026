"use client";

import React from "react";
import Link from "next/link";
import { LeafletMap } from "@/components/LeafletMap";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { Activity, ShieldCheck, AlertTriangle, ArrowRight, Radio, Eye } from "lucide-react";

export default function OutbreakMapPage() {
  const { strains, regions } = useVoisStore();
  const { setRole } = useRole();

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/20 pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/50">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>ROLE: REGIONAL LEAD / PUBLIC VIEW — EPIDEMIOLOGICAL RADAR</span>
            </div>
            <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-white uppercase">
              Live Misinformation Outbreak Map
            </h1>
            <p className="text-sm sm:text-base font-light text-white/70">
              Surveillance radar monitoring regional viral deception vectors and localized Herd Immunity Scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              onClick={() => setRole("spotter")}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>REPORT A STRAIN</span>
            </Link>

            <Link
              href="/strains"
              className="px-6 py-3 rounded-full border border-white text-white font-bold text-xs uppercase hover:bg-white hover:text-black transition-colors"
            >
              <span>STRAIN DIRECTORY</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Leaflet Map Visualizer */}
        <LeafletMap />

        {/* Public Health Explainer Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20 text-xs font-mono text-white/70">
          <div className="p-4 border border-white/10 space-y-2">
            <span className="font-bold text-white uppercase block">
              01 / HERD IMMUNITY METRIC
            </span>
            <p>
              Calculated as <code className="text-emerald-400">(Distributed Vaccines ÷ Total Active Strains) × 100</code>. When reaching 70%+, community inoculation counters viral re-sharing.
            </p>
          </div>

          <div className="p-4 border border-white/10 space-y-2">
            <span className="font-bold text-white uppercase block">
              02 / PRE-BUNKING PARADIGM
            </span>
            <p>
              Rather than waiting for deepfakes to inflict societal polarization, plain-language vaccines inoculate citizens against deceptive narrative patterns in advance.
            </p>
          </div>

          <div className="p-4 border border-white/10 space-y-2">
            <span className="font-bold text-white uppercase block">
              03 / FIELD DEPLOYMENT
            </span>
            <p>
              Field health workers broadcast counter-content across grassroots peer messaging groups to neutralize active deceptive vectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
