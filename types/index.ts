export type TechniqueType =
  | "deepfake"
  | "out_of_context_image"
  | "fabricated_statistic"
  | "cloned_voice"
  | "doctored_screenshot"
  | "other";

export type SubmissionStatus = "pending_review" | "confirmed" | "rejected";

export type RoleType =
  | "spotter"
  | "analyst"
  | "vaccine_maker"
  | "field_worker"
  | "public_view";

export interface Strain {
  id: string;
  name: string;
  technique: TechniqueType;
  intent?: string;
  summary: string;
  report_count: number;
  regions_affected: string[];
  distributed_regions: string[];
  has_vaccine: boolean;
  created_at: string;
  vaccine?: VaccineContent;
  submissions_count?: number;
}

export interface Submission {
  id: string;
  content_text: string;
  image_url?: string;
  region: string;
  language: string;
  ai_suggested_technique?: TechniqueType;
  ai_confidence?: number;
  ai_summary?: string;
  status: SubmissionStatus;
  strain_id?: string | null;
  created_at: string;
}

export interface VaccineContent {
  id: string;
  strain_id: string;
  title: string;
  explainer: string;
  created_at: string;
}

export interface RegionInfo {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  populationEstimate: string;
  bounds?: [[number, number], [number, number]];
}

export interface RegionStats {
  region: string;
  totalConfirmedStrains: number;
  distributedStrainsCount: number;
  herdImmunityScore: number; // (distributed_regions.length / total_confirmed_strains_in_region) * 100
  activeStrains: Strain[];
  topStrain?: Strain;
  status: "protected" | "moderate" | "critical";
}

export interface AIClassificationResponse {
  technique: TechniqueType;
  intent: string;
  confidence: number;
  summary: string;
}

export interface AIStrainMatchResponse {
  same_strain: boolean;
  confidence: number;
  reason: string;
}
