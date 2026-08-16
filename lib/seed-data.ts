export interface Submission {
  id: string;
  content_text: string;
  image_url?: string;
  region: string;
  language: string;
  ai_suggested_technique: string;
  ai_confidence: number;
  ai_summary: string;
  status: "pending_review" | "confirmed" | "rejected";
  strain_id?: string;
  created_at: string;
}

export interface Strain {
  id: string;
  name: string;
  technique: "deepfake" | "out_of_context_image" | "fabricated_statistic" | "cloned_voice" | "doctored_screenshot" | "other";
  intent: string;
  summary: string;
  report_count: number;
  regions_affected: string[];
  distributed_regions: string[];
  has_vaccine: boolean;
  created_at: string;
  vaccine?: VaccineContent;
}

export interface VaccineContent {
  id: string;
  strain_id: string;
  title: string;
  explainer: string;
  created_at: string;
}

export const DEMO_REGIONS = [
  { id: "north", name: "North District", lat: 28.7041, lng: 77.1025 },
  { id: "south", name: "South District", lat: 12.9716, lng: 77.5946 },
  { id: "coastal", name: "Coastal Region", lat: 18.922, lng: 72.8347 },
  { id: "capital", name: "Capital Area", lat: 28.6139, lng: 77.209 },
  { id: "rural", name: "Rural Belt", lat: 25.5941, lng: 85.1376 },
];

export const INITIAL_STRAINS: Strain[] = [
  {
    id: "str-01",
    name: "Apex Bank Liquidity Freeze Hoax",
    technique: "doctored_screenshot",
    intent: "Trigger financial panic and ATM run in urban sectors",
    summary: "Falsified screenshot of a central bank notice claiming automated teller machines and digital wire transfers will be suspended for 72 hours.",
    report_count: 5,
    regions_affected: ["Capital Area", "North District", "Coastal Region"],
    distributed_regions: ["Capital Area", "North District"],
    has_vaccine: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    vaccine: {
      id: "vac-01",
      strain_id: "str-01",
      title: "Bank Liquidity Freeze Is A Forged Screenshot",
      explainer: "Official central banking operations continue without interruption. The viral graphic uses an outdated 2019 typography template and an invalid circular reference code not found in any government gazette.",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  },
  {
    id: "str-02",
    name: "Coastal Dam Breach Catastrophe Imagery",
    technique: "out_of_context_image",
    intent: "Evoke acute flood panic during standard seasonal rain",
    summary: "Viral images claiming the Coastal Hydro-Dam has suffered a structural wall collapse, causing emergency evacuations.",
    report_count: 4,
    regions_affected: ["Coastal Region", "South District"],
    distributed_regions: ["Coastal Region"],
    has_vaccine: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    vaccine: {
      id: "vac-02",
      strain_id: "str-02",
      title: "Dam Collapse Images Are From a 2017 Typhoon in East Asia",
      explainer: "Water levels at the Coastal Dam remain in the standard green zone at 64% capacity. Reverse image search confirms the viral photograph is from a 2017 dam spillway test in Taiwan, not local infrastructure.",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    }
  },
  {
    id: "str-03",
    name: "Electoral Ballot Digital Scanner Tamper Audio",
    technique: "cloned_voice",
    intent: "Erode voter confidence in municipal democratic tallying",
    summary: "Synthetic audio purporting to be a senior election commissioner giving instructions to miscalibrate optical vote counters in rural precincts.",
    report_count: 3,
    regions_affected: ["Rural Belt", "North District"],
    distributed_regions: [],
    has_vaccine: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "str-04",
    name: "Synthetic Tap Water Toxicity Study",
    technique: "fabricated_statistic",
    intent: "Promote uncertified private water filtration systems",
    summary: "Fake scientific infographic claiming 87% of municipal tap water tested positive for synthetic neuro-toxins.",
    report_count: 2,
    regions_affected: ["South District", "Rural Belt"],
    distributed_regions: ["South District"],
    has_vaccine: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    vaccine: {
      id: "vac-03",
      strain_id: "str-04",
      title: "Municipal Water Safety Metrics Fully Verified by Public Health Lab",
      explainer: "The cited 'National Hydrological Institute 2026 Report' is completely fabricated. Municipal water quality is tested daily across 42 parameters and complies with all ISO-10500 potable water safety guidelines.",
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    }
  },
  {
    id: "str-05",
    name: "Deepfake Mayoral Curfew Declaration",
    technique: "deepfake",
    intent: "Disrupt commerce and incite localized civil unrest",
    summary: "AI-generated video showing the city mayor declaring an immediate emergency military curfew across the Capital Area.",
    report_count: 1,
    regions_affected: ["Capital Area"],
    distributed_regions: [],
    has_vaccine: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "sub-01",
    content_text: "URGENT: Received a circular on WhatsApp claiming Apex Bank has completely locked all ATM cash withdrawals starting tonight at 11 PM for 3 days due to server collapse!",
    region: "Capital Area",
    language: "English",
    ai_suggested_technique: "doctored_screenshot",
    ai_confidence: 0.94,
    ai_summary: "False claim that Apex Bank will lock all ATM withdrawals for 72 hours.",
    status: "confirmed",
    strain_id: "str-01",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "sub-02",
    content_text: "Forwarded message in family group: 'Photos of the dam breaking down south! Houses already flooded, share before authorities cut internet!'",
    region: "Coastal Region",
    language: "English",
    ai_suggested_technique: "out_of_context_image",
    ai_confidence: 0.91,
    ai_summary: "Unverified disaster photos alleging sudden coastal dam burst.",
    status: "confirmed",
    strain_id: "str-02",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "sub-03",
    content_text: "Breaking audio leak: Hear the election officer admitting on phone that voting machines will swap party buttons in rural districts!",
    region: "Rural Belt",
    language: "Hindi",
    ai_suggested_technique: "cloned_voice",
    ai_confidence: 0.95,
    ai_summary: "Cloned voice note accusing election commission of rigging optical ballots.",
    status: "confirmed",
    strain_id: "str-03",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "sub-04",
    content_text: "A pamphlet circulated near the primary school claims 87% of tap water is contaminated with heavy neuro-metals and people should buy PurifyMax filters immediately.",
    region: "South District",
    language: "English",
    ai_suggested_technique: "fabricated_statistic",
    ai_confidence: 0.88,
    ai_summary: "Commercial fear-mongering using fake 87% tap water toxicity figures.",
    status: "confirmed",
    strain_id: "str-04",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "sub-05",
    content_text: "Deepfake video of the Mayor wearing an emergency vest saying everyone must stay indoors under military law from midnight.",
    region: "Capital Area",
    language: "English",
    ai_suggested_technique: "deepfake",
    ai_confidence: 0.96,
    ai_summary: "Synthetic video of Mayor announcing military curfew.",
    status: "confirmed",
    strain_id: "str-05",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "sub-06",
    content_text: "Social media post claiming all petrol pumps in North District will shut down tomorrow morning due to nationwide pipeline explosion.",
    region: "North District",
    language: "Hindi",
    ai_suggested_technique: "fabricated_statistic",
    ai_confidence: 0.89,
    ai_summary: "Rumor claiming indefinite fuel station shutdown across North District.",
    status: "pending_review",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "sub-07",
    content_text: "Viral photo showing dead fish on the south river bank, post says chemical factory dumped waste this morning, but I saw this photo on Reddit 2 years ago.",
    region: "South District",
    language: "English",
    ai_suggested_technique: "out_of_context_image",
    ai_confidence: 0.93,
    ai_summary: "Recycled historical river pollution image falsely attributed to current date.",
    status: "pending_review",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "sub-08",
    content_text: "Audio note forwarded 100+ times claiming hospital ICU beds are 100% full and private clinics are hoarding oxygen cylinders.",
    region: "Rural Belt",
    language: "Hindi",
    ai_suggested_technique: "cloned_voice",
    ai_confidence: 0.92,
    ai_summary: "Unverified voice recording asserting critical medical supply collapse.",
    status: "pending_review",
    created_at: new Date(Date.now() - 900000).toISOString(),
  }
];
