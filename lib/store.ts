"use client";

import { useState, useEffect, useCallback } from "react";
import { Strain, Submission, VaccineContent, INITIAL_STRAINS, INITIAL_SUBMISSIONS, DEMO_REGIONS } from "./seed-data";
import { isSameStrain, classifySubmission } from "./groq";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEYS = {
  STRAINS: "vois_strains_v1",
  SUBMISSIONS: "vois_submissions_v1",
};

export function useVoisStore() {
  const [strains, setStrains] = useState<Strain[]>(INITIAL_STRAINS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Supabase (with fallback to localStorage/initial data)
  const fetchCloudData = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Fetch strains with joined vaccine_content
      const { data: cloudStrains, error: strainsErr } = await supabase
        .from("strains")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: cloudVaccines, error: vacErr } = await supabase
        .from("vaccine_content")
        .select("*");

      const { data: cloudSubmissions, error: subsErr } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!strainsErr && cloudStrains && cloudStrains.length > 0) {
        const vaccineMap = new Map<string, VaccineContent>();
        if (!vacErr && cloudVaccines) {
          cloudVaccines.forEach((v) => vaccineMap.set(v.strain_id, v as VaccineContent));
        }

        const hydratedStrains: Strain[] = cloudStrains.map((st) => ({
          id: st.id,
          name: st.name,
          technique: st.technique,
          intent: st.intent || "",
          summary: st.summary || "",
          report_count: st.report_count || 1,
          regions_affected: st.regions_affected || [],
          distributed_regions: st.distributed_regions || [],
          has_vaccine: Boolean(st.has_vaccine),
          created_at: st.created_at,
          vaccine: vaccineMap.get(st.id) || undefined,
        }));

        setStrains(hydratedStrains);
        localStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(hydratedStrains));
      }

      if (!subsErr && cloudSubmissions && cloudSubmissions.length > 0) {
        const hydratedSubmissions: Submission[] = cloudSubmissions.map((s) => ({
          id: s.id,
          content_text: s.content_text,
          image_url: s.image_url || undefined,
          region: s.region,
          language: s.language,
          ai_suggested_technique: s.ai_suggested_technique || "other",
          ai_confidence: s.ai_confidence || 0.85,
          ai_summary: s.ai_summary || "",
          status: (s.status as Submission["status"]) || "pending_review",
          strain_id: s.strain_id || undefined,
          created_at: s.created_at,
        }));

        setSubmissions(hydratedSubmissions);
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(hydratedSubmissions));
      }
    } catch (err) {
      console.warn("Could not sync with Supabase cloud, using local cache:", err);
    }
  }, []);

  // Initial Load on mount
  useEffect(() => {
    try {
      const storedStrains = localStorage.getItem(STORAGE_KEYS.STRAINS);
      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);

      if (storedStrains) {
        setStrains(JSON.parse(storedStrains));
      } else {
        localStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(INITIAL_STRAINS));
      }

      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      } else {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      }
    } catch (e) {
      console.warn("Storage access failed, using memory state", e);
    }

    setIsLoaded(true);

    // If Supabase is connected, fetch the latest live cloud state
    if (isSupabaseConfigured) {
      fetchCloudData();
    }
  }, [fetchCloudData]);

  // Save changes locally + to Supabase
  const saveState = (updatedStrains: Strain[], updatedSubmissions: Submission[]) => {
    setStrains(updatedStrains);
    setSubmissions(updatedSubmissions);
    try {
      localStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(updatedStrains));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedSubmissions));
    } catch (e) {
      console.warn("Saving to localStorage failed", e);
    }
  };

  // SPOTTER: Submit new suspicious content
  const addSubmission = async (data: {
    content_text: string;
    region: string;
    language: string;
    image_url?: string;
  }) => {
    // 1. Auto-classify using Groq AI
    const classification = await classifySubmission(data.content_text);

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      content_text: data.content_text,
      image_url: data.image_url,
      region: data.region,
      language: data.language,
      ai_suggested_technique: classification.technique,
      ai_confidence: classification.confidence,
      ai_summary: classification.summary,
      status: "pending_review",
      created_at: new Date().toISOString(),
    };

    const updatedSubmissions = [newSub, ...submissions];
    saveState(strains, updatedSubmissions);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      supabase.from("submissions").insert({
        id: newSub.id,
        content_text: newSub.content_text,
        image_url: newSub.image_url || null,
        region: newSub.region,
        language: newSub.language,
        ai_suggested_technique: newSub.ai_suggested_technique,
        ai_confidence: newSub.ai_confidence,
        ai_summary: newSub.ai_summary,
        status: newSub.status,
        created_at: newSub.created_at,
      }).then(({ error }) => {
        if (error) console.warn("Supabase submission sync error:", error);
      });
    }

    return { submission: newSub, classification };
  };

  // ANALYST: Confirm & Match Strain
  const confirmSubmission = async (
    submissionId: string,
    overrides?: {
      technique?: Strain["technique"];
      name?: string;
      intent?: string;
      summary?: string;
    }
  ) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const technique = overrides?.technique || (sub.ai_suggested_technique as Strain["technique"]) || "other";
    const summary = overrides?.summary || sub.ai_summary || sub.content_text;
    const intent = overrides?.intent || "Civic misinformation vector";

    // Run LLM-based isSameStrain comparison against existing confirmed strains
    let matchedStrainId: string | null = null;
    let highestConfidence = 0;

    for (const strain of strains) {
      const matchResult = await isSameStrain(sub.content_text, strain.summary);
      if (matchResult.same_strain && matchResult.confidence > 0.7 && matchResult.confidence > highestConfidence) {
        matchedStrainId = strain.id;
        highestConfidence = matchResult.confidence;
      }
    }

    let updatedStrains = [...strains];
    let createdOrUpdatedStrain: Strain | null = null;

    if (matchedStrainId) {
      // Cluster into existing strain: increment report count and add region if not present
      updatedStrains = updatedStrains.map((strain) => {
        if (strain.id === matchedStrainId) {
          const regions = strain.regions_affected.includes(sub.region)
            ? strain.regions_affected
            : [...strain.regions_affected, sub.region];
          createdOrUpdatedStrain = {
            ...strain,
            report_count: strain.report_count + 1,
            regions_affected: regions,
          };
          return createdOrUpdatedStrain;
        }
        return strain;
      });
    } else {
      // Create new strain
      const newStrain: Strain = {
        id: `str-${Date.now()}`,
        name: overrides?.name || (sub.ai_summary.slice(0, 45) || "New Misinformation Strain"),
        technique,
        intent,
        summary,
        report_count: 1,
        regions_affected: [sub.region],
        distributed_regions: [],
        has_vaccine: false,
        created_at: new Date().toISOString(),
      };
      updatedStrains = [newStrain, ...updatedStrains];
      matchedStrainId = newStrain.id;
      createdOrUpdatedStrain = newStrain;
    }

    // Update submission status to confirmed
    const updatedSubmissions = submissions.map((s) => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: "confirmed" as const,
          strain_id: matchedStrainId || undefined,
        };
      }
      return s;
    });

    saveState(updatedStrains, updatedSubmissions);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      if (createdOrUpdatedStrain) {
        const s = createdOrUpdatedStrain as Strain;
        supabase.from("strains").upsert({
          id: s.id,
          name: s.name,
          technique: s.technique,
          intent: s.intent,
          summary: s.summary,
          report_count: s.report_count,
          regions_affected: s.regions_affected,
          distributed_regions: s.distributed_regions,
          has_vaccine: s.has_vaccine,
          created_at: s.created_at,
        }).then(({ error }) => {
          if (error) console.warn("Supabase strain sync error:", error);
        });
      }

      supabase.from("submissions").update({
        status: "confirmed",
        strain_id: matchedStrainId,
      }).eq("id", submissionId).then(({ error }) => {
        if (error) console.warn("Supabase sub update error:", error);
      });
    }

    return { matchedStrainId, isNew: !matchedStrainId };
  };

  // VACCINE MAKER: Attach counter-content explainer
  const attachVaccine = (strainId: string, title: string, explainer: string) => {
    const newVaccine: VaccineContent = {
      id: `vac-${Date.now()}`,
      strain_id: strainId,
      title,
      explainer,
      created_at: new Date().toISOString(),
    };

    const updatedStrains = strains.map((st) => {
      if (st.id === strainId) {
        return {
          ...st,
          has_vaccine: true,
          vaccine: newVaccine,
        };
      }
      return st;
    });

    saveState(updatedStrains, submissions);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      supabase.from("vaccine_content").insert({
        id: newVaccine.id,
        strain_id: newVaccine.strain_id,
        title: newVaccine.title,
        explainer: newVaccine.explainer,
        created_at: newVaccine.created_at,
      }).then(({ error }) => {
        if (error) console.warn("Supabase vaccine insert error:", error);
      });

      supabase.from("strains").update({
        has_vaccine: true,
      }).eq("id", strainId).then(({ error }) => {
        if (error) console.warn("Supabase strain vaccine update error:", error);
      });
    }

    return newVaccine;
  };

  // FIELD HEALTH WORKER: Mark strain as distributed to a region
  const toggleDistribution = (strainId: string, regionName: string) => {
    let targetDistributed: string[] = [];

    const updatedStrains = strains.map((st) => {
      if (st.id === strainId) {
        const distributed = st.distributed_regions.includes(regionName)
          ? st.distributed_regions.filter((r) => r !== regionName)
          : [...st.distributed_regions, regionName];
        targetDistributed = distributed;
        return {
          ...st,
          distributed_regions: distributed,
        };
      }
      return st;
    });

    saveState(updatedStrains, submissions);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      supabase.from("strains").update({
        distributed_regions: targetDistributed,
      }).eq("id", strainId).then(({ error }) => {
        if (error) console.warn("Supabase distribution update error:", error);
      });
    }
  };

  // REGIONAL IMMUNITY SCORE CALCULATION
  const getRegionImmunityScore = (regionName: string) => {
    const activeStrainsInRegion = strains.filter((s) => s.regions_affected.includes(regionName));
    if (activeStrainsInRegion.length === 0) return 100;

    const distributedCount = activeStrainsInRegion.filter((s) =>
      s.distributed_regions.includes(regionName)
    ).length;

    return Math.round((distributedCount / activeStrainsInRegion.length) * 100);
  };

  // Reset demo state
  const resetToSeed = () => {
    saveState(INITIAL_STRAINS, INITIAL_SUBMISSIONS);
  };

  return {
    isLoaded,
    strains,
    submissions,
    regions: DEMO_REGIONS,
    addSubmission,
    confirmSubmission,
    attachVaccine,
    toggleDistribution,
    getRegionImmunityScore,
    resetToSeed,
  };
}
