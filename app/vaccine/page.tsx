"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { Strain } from "@/lib/seed-data";
import { 
  FlaskConical, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  AlertCircle 
} from "lucide-react";

export default function VaccineMakerPage() {
  const { strains, attachVaccine } = useVoisStore();
  const { setRole } = useRole();

  const [activeStrainId, setActiveStrainId] = useState<string | null>(null);
  const [vaccineTitle, setVaccineTitle] = useState("");
  const [explainer, setExplainer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const strainsNeedingVaccine = strains.filter((s) => !s.has_vaccine);
  const vaccinatedStrains = strains.filter((s) => s.has_vaccine);

  const selectedStrain = strains.find((s) => s.id === activeStrainId);

  const handleSelectStrain = (strain: Strain) => {
    setActiveStrainId(strain.id);
    setVaccineTitle(`Verification: ${strain.name}`);
    setExplainer(
      `Official testing confirms the claim regarding ${strain.name.toLowerCase()} is unsupported. Citizens are advised to verify through accredited institutional gazettes and avoid forwarding uncredited audio or altered graphics.`
    );
    setSuccessMessage(null);
  };

  const handleSynthesizeAI = (strain: Strain) => {
    setIsGenerating(true);
    setTimeout(() => {
      setVaccineTitle(`Fact-Check: Disproving ${strain.name}`);
      setExplainer(
        `Analysis by verified fact-checking desks reveals that the viral claim is ${
          strain.technique === "cloned_voice"
            ? "synthesized using commercial AI voice clone filters."
            : strain.technique === "out_of_context_image"
            ? "an archived image from an unrelated historical incident."
            : "fabricated without official regulatory grounding."
        } Primary public services continue normal uninterrupted operations.`
      );
      setIsGenerating(false);
    }, 600);
  };

  const handleSubmitVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStrainId || !vaccineTitle.trim() || !explainer.trim()) return;

    attachVaccine(activeStrainId, vaccineTitle, explainer);
    setSuccessMessage(`Vaccine counter-explainer successfully attached to strain [${activeStrainId}].`);
    setActiveStrainId(null);
    setVaccineTitle("");
    setExplainer("");
  };

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-black pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black/50">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>ROLE: VACCINE MAKER — COUNTER-CONTENT SYNTHESIS LAB</span>
            </div>
            <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-black uppercase">
              Synthesize Digital Vaccines
            </h1>
            <p className="text-sm sm:text-base font-light text-black/70">
              Transform complex fact-checks into 2-sentence plain-language counter-narratives that inoculate communities before viral damage spreads.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <span className="px-3 py-1.5 bg-rose-600 text-white">
              {strainsNeedingVaccine.length} NEED COUNTER-CONTENT
            </span>
            <span className="px-3 py-1.5 bg-emerald-600 text-white">
              {vaccinatedStrains.length} VACCINES READY
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-950 text-emerald-200 border border-emerald-500 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <Link
              href="/distribute"
              onClick={() => setRole("field_health_worker")}
              className="text-white underline font-bold uppercase hover:opacity-80"
            >
              DEPLOY TO REGIONS (FIELD HEALTH WORKER) →
            </Link>
          </div>
        )}

        {/* Strains Requiring Counter-Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/20 pb-3">
            <h2 className="font-heavy-grotesk text-xl uppercase tracking-tight">
              Unvaccinated Strains ({strainsNeedingVaccine.length})
            </h2>
            <span className="text-[10px] font-mono text-black/50 uppercase">
              CLICK A STRAIN TO COMPOSE REBUTTAL
            </span>
          </div>

          {strainsNeedingVaccine.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-black/30 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-heavy-grotesk text-xl uppercase">All Strains Inoculated</div>
              <p className="text-xs font-mono text-black/60">
                Every confirmed misinformation strain has an active plain-language vaccine attached.
              </p>
              <div className="pt-2">
                <Link
                  href="/distribute"
                  onClick={() => setRole("field_health_worker")}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Distribute Vaccines to Regions →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strainsNeedingVaccine.map((strain) => {
                const isSelected = activeStrainId === strain.id;
                return (
                  <div
                    key={strain.id}
                    className={`p-6 border-2 transition-all space-y-4 ${
                      isSelected
                        ? "border-black bg-neutral-100 ring-2 ring-black"
                        : "border-black/30 hover:border-black bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black text-white uppercase">
                        {strain.technique.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-mono text-rose-600 font-bold uppercase">
                        NO VACCINE
                      </span>
                    </div>

                    <h3 className="font-editorial-serif text-2xl text-black">
                      {strain.name}
                    </h3>
                    <p className="text-xs text-black/70 font-light">
                      {strain.summary}
                    </p>

                    <div className="pt-3 border-t border-black/20 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-black/60">
                        Affected: {strain.regions_affected.join(", ")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectStrain(strain)}
                        className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors"
                      >
                        {isSelected ? "COMPOSING..." : "COMPOSE VACCINE →"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Counter-Content Editor Box (Active when a strain is selected) */}
        {selectedStrain && (
          <div className="p-8 border-2 border-black bg-neutral-900 text-white space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  SYNTHESIS CONSOLE
                </span>
                <h3 className="font-heavy-grotesk text-2xl uppercase tracking-tight text-white mt-1">
                  Draft Counter-Explainer for &ldquo;{selectedStrain.name}&rdquo;
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleSynthesizeAI(selectedStrain)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Synthesizing..." : "AI Auto-Draft"}</span>
              </button>
            </div>

            <form onSubmit={handleSubmitVaccine} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 block">
                  VACCINE HEADLINE / CORE TRUTH *
                </label>
                <input
                  type="text"
                  required
                  value={vaccineTitle}
                  onChange={(e) => setVaccineTitle(e.target.value)}
                  placeholder="e.g. Municipal Water Safety Metrics Fully Verified by Public Health Lab"
                  className="w-full p-4 border border-white/30 bg-black text-white font-sans text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 block">
                  PLAIN-LANGUAGE EXPLAINER (2–3 SENTENCES) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={explainer}
                  onChange={(e) => setExplainer(e.target.value)}
                  placeholder="Explain why the claim is false and provide concrete verifiable reference..."
                  className="w-full p-4 border border-white/30 bg-black text-white font-sans text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStrainId(null)}
                  className="px-6 py-3 border border-white/40 text-xs font-bold uppercase text-white hover:bg-white/10"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-colors"
                >
                  ATTACH VACCINE TO STRAIN →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Ready Vaccines Catalog */}
        <div className="pt-12 border-t-2 border-black space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heavy-grotesk text-2xl uppercase tracking-tight">
              Ready Vaccines ({vaccinatedStrains.length})
            </h2>
            <Link
              href="/distribute"
              onClick={() => setRole("field_health_worker")}
              className="text-xs font-bold uppercase hover:underline"
            >
              Distribute to Regional Channels →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vaccinatedStrains.map((strain) => (
              <div key={strain.id} className="p-6 border border-black bg-neutral-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-800 text-white uppercase">
                    VACCINE READY
                  </span>
                  <span className="text-xs font-mono text-black/60 font-bold">
                    Distributed to {strain.distributed_regions.length} Regions
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-black/50 block">TARGET STRAIN:</span>
                  <h4 className="font-editorial-serif text-lg text-black">{strain.name}</h4>
                </div>

                {strain.vaccine && (
                  <div className="p-4 bg-white border border-black/20 space-y-2">
                    <h5 className="font-bold text-xs text-black">&ldquo;{strain.vaccine.title}&rdquo;</h5>
                    <p className="text-xs text-black/80 italic font-light">{strain.vaccine.explainer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
