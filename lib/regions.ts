import { RegionInfo } from "@/types";

export const DEMO_REGIONS: RegionInfo[] = [
  {
    id: "capital-area",
    name: "Capital Area",
    coordinates: [28.6139, 77.2090], // Center hub
    description: "Dense metropolitan administrative and media hub with high social media velocity.",
    populationEstimate: "18.5M",
  },
  {
    id: "north-district",
    name: "North District",
    coordinates: [30.7333, 76.7794], // North
    description: "Industrial and educational valley vulnerable to synthetic academic credentials and deepfakes.",
    populationEstimate: "9.2M",
  },
  {
    id: "south-district",
    name: "South District",
    coordinates: [12.9716, 77.5946], // South
    description: "Technology hub and multi-lingual corridor seeing cloned voice and financial scam strains.",
    populationEstimate: "14.1M",
  },
  {
    id: "coastal-region",
    name: "Coastal Region",
    coordinates: [18.9220, 72.8347], // Coastal
    description: "Maritime shipping and coastal trade zone prone to weather and port panic disinformation.",
    populationEstimate: "12.8M",
  },
  {
    id: "rural-belt",
    name: "Rural Belt",
    coordinates: [24.5854, 78.4350], // Central/Rural
    description: "Agricultural heartland with reliance on voice notes and messaging forwards.",
    populationEstimate: "22.4M",
  },
];

export const DEMO_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "ar", name: "Arabic (العربية)" },
];

export function getRegionByName(name: string): RegionInfo | undefined {
  return DEMO_REGIONS.find((r) => r.name.toLowerCase() === name.toLowerCase());
}
