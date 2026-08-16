"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { DEMO_REGIONS } from "@/lib/regions";
import { RegionStats, Strain } from "@/types";
import { HerdScoreBadge, TechniqueBadge } from "./Badge";
import { ShieldCheck, AlertTriangle, Syringe, ExternalLink, Activity, Info } from "lucide-react";
import Link from "next/link";

// Custom Leaflet DivIcon generator
function createCustomPin(score: number, activeCount: number) {
  let bgColor = "bg-rose-600";
  let pulseColor = "animate-radar";
  if (score >= 70) {
    bgColor = "bg-emerald-600";
    pulseColor = "animate-green-pulse";
  } else if (score >= 40) {
    bgColor = "bg-amber-500";
    pulseColor = "";
  }

  const html = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
      <div class="absolute w-10 h-10 rounded-full ${bgColor} opacity-30 ${pulseColor}"></div>
      <div class="relative w-8 h-8 rounded-full ${bgColor} text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
        ${activeCount}
      </div>
      <div class="absolute -top-6 whitespace-nowrap bg-slate-900/90 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md border border-slate-700">
        ${score}% Immune
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-map-pin",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapController({ selectedCoords }: { selectedCoords?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 6, { duration: 1.2 });
    }
  }, [selectedCoords, map]);
  return null;
}

interface MapComponentProps {
  regionStats: Record<string, RegionStats>;
  onSelectRegion?: (regionName: string) => void;
  selectedRegion?: string;
}

export default function MapComponent({
  regionStats,
  onSelectRegion,
  selectedRegion,
}: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[550px] bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Activity className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs font-semibold">Initializing Epidemiological Geocache...</span>
        </div>
      </div>
    );
  }

  // Demo center coordinate
  const center: [number, number] = [21.5, 78.5];

  const currentSelectedInfo = DEMO_REGIONS.find((r) => r.name === selectedRegion);

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedCoords={currentSelectedInfo?.coordinates} />

        {DEMO_REGIONS.map((region) => {
          const stats = regionStats[region.name] || {
            region: region.name,
            totalConfirmedStrains: 0,
            distributedStrainsCount: 0,
            herdImmunityScore: 100,
            activeStrains: [],
            status: "protected",
          };

          const isSelected = selectedRegion === region.name;

          return (
            <React.Fragment key={region.id}>
              {/* Regional Ambient Radius */}
              <CircleMarker
                center={region.coordinates}
                radius={isSelected ? 45 : 32}
                pathOptions={{
                  color: stats.herdImmunityScore >= 70 ? "#10b981" : stats.herdImmunityScore >= 40 ? "#f59e0b" : "#ef4444",
                  fillColor: stats.herdImmunityScore >= 70 ? "#10b981" : stats.herdImmunityScore >= 40 ? "#f59e0b" : "#ef4444",
                  fillOpacity: isSelected ? 0.25 : 0.15,
                  weight: isSelected ? 2 : 1,
                  dashArray: isSelected ? "4, 4" : undefined,
                }}
              />

              {/* Pin Marker */}
              <Marker
                position={region.coordinates}
                icon={createCustomPin(stats.herdImmunityScore, stats.totalConfirmedStrains)}
                eventHandlers={{
                  click: () => {
                    if (onSelectRegion) onSelectRegion(region.name);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                      <span className="font-extrabold text-sm text-slate-900">{region.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{region.populationEstimate} pop</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Active Strains:</span>
                        <strong className="text-slate-900">{stats.totalConfirmedStrains}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vaccinated Inoculations:</span>
                        <strong className="text-teal-700">{stats.distributedStrainsCount}</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-500">Herd Immunity:</span>
                        <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                          stats.herdImmunityScore >= 70 ? "bg-emerald-100 text-emerald-800" : stats.herdImmunityScore >= 40 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {stats.herdImmunityScore}%
                        </span>
                      </div>

                      {stats.topStrain && (
                        <div className="mt-2 p-1.5 bg-slate-50 rounded border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Primary Vector</p>
                          <p className="text-xs font-semibold text-slate-900 line-clamp-1">{stats.topStrain.name}</p>
                        </div>
                      )}

                      <button
                        onClick={() => onSelectRegion && onSelectRegion(region.name)}
                        className="w-full mt-2 text-center text-xs font-bold text-teal-700 hover:text-teal-900 py-1 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                      >
                        Inspect Regional Vector Dossier →
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 pointer-events-auto max-w-xs">
        <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Herd Immunity Gauge</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-600 text-[11px]">≥ 70% Inoculated (High Community Defense)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <span className="text-slate-600 text-[11px]">40-69% Moderate Contagion Friction</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
          <span className="text-slate-600 text-[11px]">&lt; 40% High Vulnerability Outbreak</span>
        </div>
      </div>
    </div>
  );
}
