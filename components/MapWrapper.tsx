"use client";

import dynamic from "next/dynamic";
import React from "react";
import { RegionStats } from "@/types";
import { Activity } from "lucide-react";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] bg-slate-100/80 rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-inner">
      <Activity className="w-8 h-8 animate-spin text-teal-600 mb-2" />
      <p className="text-sm font-semibold text-slate-700">Loading Epidemiological Outbreak GIS...</p>
      <p className="text-xs text-slate-500 mt-1">Calibrating OpenStreetMap geospatial tiles</p>
    </div>
  ),
});

interface MapWrapperProps {
  regionStats: Record<string, RegionStats>;
  onSelectRegion?: (regionName: string) => void;
  selectedRegion?: string;
}

export function MapWrapper(props: MapWrapperProps) {
  return <MapComponent {...props} />;
}
