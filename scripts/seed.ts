import { INITIAL_STRAINS, INITIAL_SUBMISSIONS } from "../lib/seed-data";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

async function postData(endpoint: string, data: any) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey!,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error on ${endpoint}:`, res.status, errorText);
    return null;
  }
  return await res.json();
}

async function runSeed() {
  console.log("--------------------------------------------------");
  console.log("  VoIS: Seeding Cloud Supabase Database...        ");
  console.log("--------------------------------------------------");

  // 1. Seed Strains
  console.log(`1. Seeding ${INITIAL_STRAINS.length} confirmed misinformation strains...`);
  for (const strain of INITIAL_STRAINS) {
    const strainPayload = {
      id: strain.id,
      name: strain.name,
      technique: strain.technique,
      intent: strain.intent,
      summary: strain.summary,
      report_count: strain.report_count,
      regions_affected: strain.regions_affected,
      distributed_regions: strain.distributed_regions,
      has_vaccine: strain.has_vaccine,
      created_at: strain.created_at,
    };
    await postData("strains", strainPayload);

    if (strain.vaccine) {
      const vaccinePayload = {
        id: strain.vaccine.id,
        strain_id: strain.id,
        title: strain.vaccine.title,
        explainer: strain.vaccine.explainer,
        created_at: strain.vaccine.created_at,
      };
      await postData("vaccine_content", vaccinePayload);
    }
  }

  // 2. Seed Submissions
  console.log(`2. Seeding ${INITIAL_SUBMISSIONS.length} citizen submissions...`);
  for (const sub of INITIAL_SUBMISSIONS) {
    const subPayload = {
      id: sub.id,
      content_text: sub.content_text,
      region: sub.region,
      language: sub.language,
      ai_suggested_technique: sub.ai_suggested_technique,
      ai_confidence: sub.ai_confidence,
      ai_summary: sub.ai_summary,
      status: sub.status,
      strain_id: sub.strain_id,
      created_at: sub.created_at,
    };
    await postData("submissions", subPayload);
  }

  console.log("--------------------------------------------------");
  console.log("✓ Cloud Supabase Database successfully seeded! 🎉");
  console.log("--------------------------------------------------");
}

runSeed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
