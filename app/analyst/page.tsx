"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { Submission, Strain } from "@/lib/seed-data";
import { 
  Search, 
  Check, 
  Edit3, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  SlidersHorizontal,
  X
} from "lucide-react";

export default function AnalystDashboardPage() {
  const { submissions, strains, confirmSubmission } = useVoisStore();
  const { setRole } = useRole();

  const [triageLoadingId, setTriageLoadingId] = useState<string | null>(null);
  const [clusteringNotice, setClusteringNotice] = useState<string | null>(null);

  // Edit Modal State
  const [editingSub, setEditingSub] = useState<Submission | null>(null);
  const [editTechnique, setEditTechnique] = useState<Strain["technique"]>("other");
  const [editName, setEditName] = useState("");
  const [editSummary, setEditSummary] = useState("");

  const pendingSubmissions = submissions.filter((s) => s.status === "pending_review");
  const confirmedSubmissions = submissions.filter((s) => s.status === "confirmed");

  // One-click Confirm with automated LLM strain-matching
  const handleConfirm = async (sub: Submission) => {
    setTriageLoadingId(sub.id);
    setClusteringNotice(null);
    try {
      const res = await confirmSubmission(sub.id);
      if (res) {
        setClusteringNotice(
          res.isNew
            ? `New strain created from submission [${sub.id}].`
            : `Matched & clustered into existing strain vector [${res.matchedStrainId}]. Report count incremented.`
        );
      }
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setTriageLoadingId(null);
    }
  };

  const openEditModal = (sub: Submission) => {
    setEditingSub(sub);
    setEditTechnique((sub.ai_suggested_technique as Strain["technique"]) || "other");
    setEditName(sub.ai_summary.slice(0, 45));
    setEditSummary(sub.ai_summary || sub.content_text);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    setTriageLoadingId(editingSub.id);
    try {
      await confirmSubmission(editingSub.id, {
        technique: editTechnique,
        name: editName,
        summary: editSummary,
      });
      setEditingSub(null);
      setClusteringNotice(`Submission [${editingSub.id}] confirmed with analyst overrides.`);
    } catch (err) {
      console.error("Save edit error:", err);
    } finally {
      setTriageLoadingId(null);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-black pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black/50">
              <Search className="w-4 h-4 text-purple-600" />
              <span>ROLE: ANALYST — TRIAGE & CLUSTERING LAB</span>
            </div>
            <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-black uppercase">
              Misinformation Triage Queue
            </h1>
            <p className="text-sm sm:text-base font-light text-black/70">
              Review raw spotter reports, verify Groq AI suggested classification tags, and trigger LLM strain-matching clustering.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <span className="px-3 py-1.5 bg-black text-white">
              {pendingSubmissions.length} PENDING REVIEW
            </span>
            <span className="px-3 py-1.5 border border-black text-black">
              {strains.length} CONFIRMED STRAINS
            </span>
          </div>
        </div>

        {/* Dynamic Clustering Feedback Alert */}
        {clusteringNotice && (
          <div className="p-4 bg-black text-white text-xs font-mono flex items-center justify-between border-l-4 border-emerald-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{clusteringNotice}</span>
            </div>
            <button onClick={() => setClusteringNotice(null)} className="hover:underline text-[10px]">
              DISMISS
            </button>
          </div>
        )}

        {/* Pending Submissions Queue */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/20 pb-3">
            <h2 className="font-heavy-grotesk text-xl uppercase tracking-tight">
              Incoming Citizen Reports ({pendingSubmissions.length})
            </h2>
            <span className="text-[10px] font-mono text-black/50 uppercase">
              AUTOMATIC STRAIN MATCHING ENABLED
            </span>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-black/30 text-center space-y-4">
              <div className="font-heavy-grotesk text-2xl uppercase">Queue Clear</div>
              <p className="text-xs font-mono text-black/60 max-w-md mx-auto">
                All submitted misinformation reports have been triaged and clustered into confirmed strains.
              </p>
              <div className="pt-2">
                <Link
                  href="/submit"
                  onClick={() => setRole("spotter")}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Submit More Reports (Spotter) →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingSubmissions.map((sub) => {
                const isLoading = triageLoadingId === sub.id;
                return (
                  <div
                    key={sub.id}
                    className="p-6 sm:p-8 border-2 border-black bg-neutral-50 space-y-6 transition-all"
                  >
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/20 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-black text-white uppercase">
                          {sub.region}
                        </span>
                        <span className="text-xs font-mono text-black/60">
                          LANG: {sub.language}
                        </span>
                        <span className="text-xs font-mono text-black/40">
                          ID: {sub.id}
                        </span>
                      </div>

                      {/* AI Confidence Indicator */}
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-black/60">AI CONFIDENCE:</span>
                        <span className="font-bold text-black">
                          {Math.round(sub.ai_confidence * 100)}%
                        </span>
                        <div className="w-20 h-2 bg-neutral-200">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${sub.ai_confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Raw Text Content */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-black/50 block font-bold">
                        RAW SUBMITTED CONTENT:
                      </span>
                      <blockquote className="font-sans text-sm sm:text-base font-normal text-black bg-white p-4 border border-black/20">
                        &ldquo;{sub.content_text}&rdquo;
                      </blockquote>
                    </div>

                    {/* AI Suggested Diagnosis */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
                      <div className="p-3 bg-white border border-black">
                        <span className="text-black/50 block mb-1 text-[10px]">SUGGESTED TECHNIQUE:</span>
                        <span className="font-bold uppercase text-black">
                          {sub.ai_suggested_technique.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="p-3 bg-white border border-black sm:col-span-2">
                        <span className="text-black/50 block mb-1 text-[10px]">DIAGNOSED CLAIM SUMMARY:</span>
                        <span className="font-sans font-medium text-black">
                          {sub.ai_summary}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-black flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-black/60">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Confirming triggers Groq LLM strain-matching against {strains.length} active strains.</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(sub)}
                          disabled={isLoading}
                          className="px-5 py-2.5 rounded-full border border-black text-xs font-bold uppercase hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Edit & Confirm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleConfirm(sub)}
                          disabled={isLoading}
                          className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>CLUSTERING...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>CONFIRM STRAIN</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmed Strains Vector Overview */}
        <div className="pt-12 border-t-2 border-black space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heavy-grotesk text-2xl uppercase tracking-tight">
              Active Clustered Strains ({strains.length})
            </h2>
            <Link href="/vaccine" onClick={() => setRole("vaccine_maker")} className="text-xs font-bold uppercase hover:underline">
              Go to Vaccine Lab →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strains.map((strain) => (
              <div key={strain.id} className="p-6 border border-black space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black text-white uppercase">
                    {strain.technique.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-mono font-bold">
                    {strain.report_count} Clustered Reports
                  </span>
                </div>

                <h3 className="font-editorial-serif text-xl text-black">
                  {strain.name}
                </h3>
                <p className="text-xs text-black/70 font-light">
                  {strain.summary}
                </p>

                <div className="pt-2 border-t border-black/20 flex items-center justify-between text-[11px] font-mono">
                  <span>AFFECTED: {strain.regions_affected.join(", ")}</span>
                  <span className={strain.has_vaccine ? "text-emerald-700 font-bold" : "text-rose-600"}>
                    {strain.has_vaccine ? "VACCINATED" : "NEEDS VACCINE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit & Confirm Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black pb-4">
              <h3 className="font-heavy-grotesk text-2xl uppercase">
                Edit & Confirm Strain
              </h3>
              <button onClick={() => setEditingSub(null)} className="hover:opacity-60">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase block">
                  MISINFORMATION TECHNIQUE *
                </label>
                <select
                  value={editTechnique}
                  onChange={(e) => setEditTechnique(e.target.value as Strain["technique"])}
                  className="w-full p-3 border border-black font-mono text-xs uppercase bg-white"
                >
                  <option value="deepfake">Deepfake</option>
                  <option value="out_of_context_image">Out of Context Image</option>
                  <option value="fabricated_statistic">Fabricated Statistic</option>
                  <option value="cloned_voice">Cloned Voice</option>
                  <option value="doctored_screenshot">Doctored Screenshot</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase block">
                  STRAIN TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 border border-black text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase block">
                  REFINED CLAIM SUMMARY *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full p-3 border border-black text-sm"
                />
              </div>

              <div className="pt-4 border-t border-black flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-6 py-2.5 border border-black text-xs font-bold uppercase hover:bg-neutral-200"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  CONFIRM & CLUSTER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
