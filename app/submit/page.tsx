"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVoisStore } from "@/lib/store";
import { useRole } from "@/context/RoleContext";
import { ClassificationResult } from "@/lib/groq";
import { 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Image as ImageIcon, 
  RefreshCw 
} from "lucide-react";

export default function SpotterSubmitPage() {
  const { addSubmission, regions } = useVoisStore();
  const { setRole } = useRole();

  const [contentText, setContentText] = useState("");
  const [region, setRegion] = useState("Capital Area");
  const [language, setLanguage] = useState("English");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    submissionId: string;
    classification: ClassificationResult;
  } | null>(null);

  const sampleSubmissions = [
    {
      text: "WhatsApp forward with audio: Audio recording supposedly of the Health Minister claiming all municipal hospitals will halt emergency operations tomorrow due to oxygen cuts.",
      region: "Capital Area",
      lang: "English"
    },
    {
      text: "Viral screenshot of bank portal showing negative account balances with warning that deposits over 50k are being frozen by government decree.",
      region: "North District",
      lang: "Hindi"
    },
    {
      text: "Photo of flooded bridge claiming the Coastal dam collapsed 20 minutes ago and everyone must evacuate immediately.",
      region: "Coastal Region",
      lang: "English"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentText.trim()) return;

    setIsLoading(true);
    try {
      const res = await addSubmission({
        content_text: contentText,
        region,
        language,
        image_url: imageUrl || undefined,
      });

      setSubmittedResult({
        submissionId: res.submission.id,
        classification: res.classification,
      });
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContentText("");
    setImageUrl("");
    setSubmittedResult(null);
  };

  return (
    <div className="bg-white text-black min-h-screen pt-28 pb-32 px-6 sm:px-12 lg:px-20 selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-black pb-8">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-black/50">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>ROLE: SPOTTER — SUBMISSION PORTAL</span>
          </div>
          <h1 className="font-heavy-grotesk text-4xl sm:text-6xl tracking-tight text-black uppercase">
            Report A Suspected Misinformation Strain
          </h1>
          <p className="text-sm sm:text-base font-light text-black/70 max-w-2xl">
            Submit deceptive claims, synthetic voice notes, deepfakes, or altered documents. Our Groq AI engine will auto-triage the technique and route it to MIL analysts.
          </p>
        </div>

        {/* Quick Sample Autofil */}
        {!submittedResult && (
          <div className="p-4 bg-neutral-100 border border-black/20 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/60 font-bold block">
              QUICK TEST SAMPLES (CLICK TO AUTOFILL):
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleSubmissions.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setContentText(sample.text);
                    setRegion(sample.region);
                    setLanguage(sample.lang);
                  }}
                  className="text-left text-xs font-mono px-3 py-1.5 bg-white border border-black hover:bg-black hover:text-white transition-colors"
                >
                  Sample 0{idx + 1} ({sample.region})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Spotter Submission Form or Success View */}
        {!submittedResult ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Content Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-black block">
                DESCRIBE OR PASTE THE SUSPICIOUS CONTENT *
              </label>
              <textarea
                required
                rows={6}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Paste the viral social media post, voice note transcript, forwarded message, or describe the questionable claim encountered..."
                className="w-full p-4 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400 bg-white"
              />
            </div>

            {/* Region & Language Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black block">
                  AFFECTED REGION / VECTOR *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-3.5 border-2 border-black font-mono text-xs uppercase bg-white focus:outline-none"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black block">
                  LANGUAGE OF CONTENT *
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3.5 border-2 border-black font-mono text-xs uppercase bg-white focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Regional Dialect">Regional Dialect</option>
                </select>
              </div>
            </div>

            {/* Optional Image URL or Screenshot Upload Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-black block">
                OPTIONAL IMAGE / SCREENSHOT URL
              </label>
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-black/50" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (image evidence URL or Supabase storage link)"
                  className="w-full p-3 border-2 border-black font-sans text-xs bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button with Live Groq Indicator */}
            <div className="pt-4 border-t border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-black/60">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>AI Auto-Classification Engine: Groq GPT-OSS-120B</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !contentText.trim()}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>DIAGNOSING STRAIN...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT FOR ANALYST REVIEW</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Live Submission Diagnosis & Success Card */
          <div className="p-8 border-2 border-black bg-neutral-50 space-y-8 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-800 border-b border-black/20 pb-4">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="font-heavy-grotesk text-xl uppercase">
                  Submission Successfully Transmitted
                </h3>
                <p className="text-xs font-mono text-black/60">
                  ID: {submittedResult.submissionId} • ROUTED TO ANALYST QUEUE
                </p>
              </div>
            </div>

            {/* AI Diagnosis Breakdown */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/60 font-bold block">
                GROQ AI PRELIMINARY DIAGNOSIS (GPT-OSS-120B):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-white border border-black">
                  <span className="text-black/50 block mb-1">DETECTED TECHNIQUE:</span>
                  <span className="text-sm font-bold uppercase text-black">
                    {submittedResult.classification.technique.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="p-4 bg-white border border-black">
                  <span className="text-black/50 block mb-1">AI CONFIDENCE SCORE:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black">
                      {Math.round(submittedResult.classification.confidence * 100)}%
                    </span>
                    <div className="w-28 h-2 bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${submittedResult.classification.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border border-black space-y-1 text-xs">
                <span className="font-mono text-black/50 block">DETECTED INTENT / VECTOR:</span>
                <p className="font-sans font-medium text-black">
                  {submittedResult.classification.intent}
                </p>
              </div>

              <div className="p-4 bg-white border border-black space-y-1 text-xs">
                <span className="font-mono text-black/50 block">AI CLAIM SUMMARY:</span>
                <p className="font-editorial-serif text-sm italic text-black">
                  &ldquo;{submittedResult.classification.summary}&rdquo;
                </p>
              </div>
            </div>

            {/* Actions for next role */}
            <div className="pt-4 border-t border-black flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
              >
                SUBMIT ANOTHER REPORT
              </button>

              <Link
                href="/analyst"
                onClick={() => setRole("analyst")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors"
              >
                <span>SWITCH TO ANALYST DASHBOARD</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
