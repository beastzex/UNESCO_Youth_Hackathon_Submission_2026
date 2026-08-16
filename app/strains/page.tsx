"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { Strain } from "@/lib/seed-data";
import { 
  FileCheck2, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Eye, 
  X, 
  Filter 
} from "lucide-react";

export default function StrainDirectoryPage() {
  const { strains } = useVoisStore();
  const { setRole } = useRole();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState<string>("ALL");
  const [selectedVaccineStrain, setSelectedVaccineStrain] = useState<Strain | null>(null);

  const techniques = [
    "ALL",
    "deepfake",
    "out_of_context_image",
    "fabricated_statistic",
    "cloned_voice",
    "doctored_screenshot",
    "other",
  ];

  const filteredStrains = strains.filter((strain) => {
    const matchesSearch =
      strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strain.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strain.regions_affected.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTechnique =
      selectedTechnique === "ALL" || strain.technique === selectedTechnique;

    return matchesSearch && matchesTechnique;
  });

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-black pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black/50">
              <FileCheck2 className="w-4 h-4 text-black" />
              <span>PUBLIC SURVEILLANCE INDEX — STRAIN DIRECTORY</span>
            </div>
            <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-black uppercase">
              Confirmed Misinformation Strains
            </h1>
            <p className="text-sm sm:text-base font-light text-black/70">
              Comprehensive catalog of clustered deception vectors, technical signatures, regional outbreak paths, and attached counter-content vaccines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              onClick={() => setRole("spotter")}
              className="px-6 py-3 rounded-full bg-black text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors"
            >
              Report New Strain →
            </Link>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-black bg-neutral-50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strains, claims, regions..."
              className="w-full pl-9 pr-4 py-2 border border-black text-xs font-sans bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase">
            <span className="text-black/50 font-bold mr-1">TECHNIQUE:</span>
            {techniques.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTechnique(tech)}
                className={`px-3 py-1.5 border border-black transition-colors ${
                  selectedTechnique === tech
                    ? "bg-black text-white font-bold"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {tech.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Strains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrains.map((strain) => (
            <div
              key={strain.id}
              className="p-6 border-2 border-black bg-white flex flex-col justify-between space-y-6 hover:shadow-xl transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-black text-white uppercase">
                    {strain.technique.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-mono font-bold text-black/60">
                    {strain.report_count} Reports
                  </span>
                </div>

                <h3 className="font-editorial-serif text-2xl text-black">
                  {strain.name}
                </h3>

                <p className="text-xs font-light text-black/80 leading-relaxed">
                  {strain.summary}
                </p>

                <div className="space-y-1 pt-2 border-t border-black/10 text-[11px] font-mono">
                  <div className="text-black/60">
                    <span className="font-bold">AFFECTED:</span> {strain.regions_affected.join(", ")}
                  </div>
                  <div className="text-black/60">
                    <span className="font-bold">DISTRIBUTED:</span> {strain.distributed_regions.length > 0 ? strain.distributed_regions.join(", ") : "None yet"}
                  </div>
                </div>
              </div>

              {/* Vaccine Trigger Bar */}
              <div className="pt-4 border-t border-black">
                {strain.has_vaccine && strain.vaccine ? (
                  <button
                    type="button"
                    onClick={() => setSelectedVaccineStrain(strain)}
                    className="w-full py-2.5 px-4 bg-emerald-600 text-white font-bold text-xs uppercase hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>INSPECT VACCINE EXPLAINER</span>
                  </button>
                ) : (
                  <Link
                    href="/vaccine"
                    onClick={() => setRole("vaccine_maker")}
                    className="w-full block text-center py-2.5 px-4 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Synthesize Vaccine →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="p-16 border-2 border-dashed border-black/20 text-center text-xs font-mono text-black/50">
            No matching misinformation strains found. Try modifying the search query or filter tags.
          </div>
        )}
      </div>

      {/* Vaccine Explainer Modal */}
      {selectedVaccineStrain && selectedVaccineStrain.vaccine && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black pb-4">
              <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="w-5 h-5" />
                <span>OFFICIAL VACCINE COUNTER-EXPLAINER</span>
              </div>
              <button onClick={() => setSelectedVaccineStrain(null)} className="hover:opacity-60">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-black/50 uppercase block">TARGET DECEPTION:</span>
                <h4 className="font-editorial-serif text-2xl text-black">
                  {selectedVaccineStrain.name}
                </h4>
              </div>

              <div className="p-6 bg-neutral-50 border border-black space-y-3">
                <h5 className="font-heavy-grotesk text-base uppercase text-black">
                  &ldquo;{selectedVaccineStrain.vaccine.title}&rdquo;
                </h5>
                <p className="text-sm font-light text-black/80 leading-relaxed">
                  {selectedVaccineStrain.vaccine.explainer}
                </p>
              </div>

              <div className="text-xs font-mono text-black/60 pt-2">
                Distributed Across: {selectedVaccineStrain.distributed_regions.join(" • ") || "Pending regional broadcast"}
              </div>
            </div>

            <div className="pt-4 border-t border-black flex items-center justify-between">
              <Link
                href="/distribute"
                onClick={() => {
                  setSelectedVaccineStrain(null);
                  setRole("field_health_worker");
                }}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
              >
                Broadcast to Regions →
              </Link>
              <button
                type="button"
                onClick={() => setSelectedVaccineStrain(null)}
                className="px-6 py-2.5 border border-black text-xs font-bold uppercase hover:bg-neutral-200"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
