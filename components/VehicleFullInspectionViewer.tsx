"use client";

import React, { useState } from "react";
import {
  Compass,
  Cpu,
  Disc,
  Eye,
  PackageOpen,
  RotateCw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
} from "lucide-react";
import { VehicleConfig } from "@/types/vehicle";

export type InspectionZoneId =
  | "exterior"
  | "cockpit"
  | "bonnet"
  | "boot"
  | "wheels";

interface CameraZonePreset {
  id: InspectionZoneId;
  labelSw: string;
  labelEn: string;
  specBadge: string;
  descriptionSw: string;
  descriptionEn: string;
  fallbackImage: string;
  zoomScale: number;
  transformOrigin: string;
}

const INSPECTION_ZONES: CameraZonePreset[] = [
  {
    id: "exterior",
    labelSw: "1. Nje 360° (Exterior Studio)",
    labelEn: "1. Exterior 360° Studio",
    specBadge: "GRADE 4.5B • ZERO RUST",
    descriptionSw:
      "Mwonekano halisi wa nje wa gari likiwa kwenye studio na yadi yetu ya Dar es Salaam.",
    descriptionEn:
      "Full exterior studio & yard photograph with verified factory paintwork and zero chassis rust.",
    fallbackImage:
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1400&q=85",
    zoomScale: 1.0,
    transformOrigin: "50% 50%",
  },
  {
    id: "cockpit",
    labelSw: "2. Ndani ya Gari (Cockpit & Cabin)",
    labelEn: "2. Cabin / Cockpit Interior",
    specBadge: "INTERIOR GRADE A • LEATHER",
    descriptionSw:
      "Ukaguzi wa ndani ya kabini: usukani, skrini ya kisasa ya infotainment, na siti za ngozi safi.",
    descriptionEn:
      "First-person cabin interior view: multifunction steering wheel, digital display, and heated leather seats.",
    fallbackImage:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85",
    zoomScale: 1.08,
    transformOrigin: "50% 45%",
  },
  {
    id: "bonnet",
    labelSw: "3. Injini & Boneti (Engine Bay)",
    labelEn: "3. Bonnet / Engine Bay",
    specBadge: "TBS & JAAI MECHANICAL PASS",
    descriptionSw:
      "Ukaguzi wa karibu wa injini, mfumo wa kupooza, na vyeti vya TBS/JAAI bila uvujaji wa oili.",
    descriptionEn:
      "Close-up mechanical inspection of the engine block, intercooler, and TBS/JAAI roadworthiness verification.",
    fallbackImage:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=85",
    zoomScale: 1.12,
    transformOrigin: "45% 50%",
  },
  {
    id: "boot",
    labelSw: "4. Buti & Mizigo (Cargo Boot)",
    labelEn: "4. Boot / Cargo Compartment",
    specBadge: "CLEAN REAR CARGO BAY",
    descriptionSw:
      "Ukaguzi wa nafasi ya mizigo nyuma, siti zinazokunjika, na vifaa vyote vya dharura.",
    descriptionEn:
      "Rear cargo compartment, folding rear seating arrangement, and factory tool kit inspection.",
    fallbackImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    zoomScale: 1.06,
    transformOrigin: "55% 50%",
  },
  {
    id: "wheels",
    labelSw: "5. Rimu & Tairi (Wheels & Brakes)",
    labelEn: "5. Wheels, Tyres & Brakes",
    specBadge: "FACTORY ALLOY • 90% TREAD",
    descriptionSw:
      "Ukaguzi wa karibu wa rimu halisi za kiwandani, kashata za tairi, na mfumo wa breki za diski.",
    descriptionEn:
      "Macro inspection on factory alloy rims, tyre tread depth, and ventilated disc brake calipers.",
    fallbackImage:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1400&q=85",
    zoomScale: 1.15,
    transformOrigin: "50% 60%",
  },
];

interface VehicleFullInspectionViewerProps {
  config?: Partial<VehicleConfig>;
  images?: string[];
  locale?: "sw" | "en";
}

export default function VehicleFullInspectionViewer({
  config,
  images = [],
  locale = "sw",
}: VehicleFullInspectionViewerProps) {
  const availableColors = config?.availableColors || [
    { name: "Original Factory Finish", hex: "transparent" },
    { name: "Pearl White", hex: "#f8f9fa" },
    { name: "Attitude Black", hex: "#111111" },
    { name: "Slate Silver", hex: "#71717a" },
    { name: "Imperial Bronze", hex: "#453229" },
  ];
  const hotspots = config?.hotspots || [
    {
      title: "Engine Status",
      description: "2.8L 1GD-FTV Turbo Diesel - TBS Verified",
      position: [0, 1.2, 1.8] as [number, number, number],
    },
    {
      title: "Mileage & Condition",
      description: "32,450 km - Authentic Japan Grade 4.5B",
      position: [1.2, 1.4, 0] as [number, number, number],
    },
    {
      title: "Owner Locked Price",
      description: "TZS 145,000,000 - Cryptographically Locked",
      position: [0, 1.0, -1.9] as [number, number, number],
    },
  ];

  const [activeZone, setActiveZone] = useState<InspectionZoneId>("exterior");
  const [activeHotspotIdx, setActiveHotspotIdx] = useState<number | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("transparent");
  const [extraZoom, setExtraZoom] = useState<number>(1);

  const currentZoneInfo =
    INSPECTION_ZONES.find((z) => z.id === activeZone) || INSPECTION_ZONES[0];

  // Resolve the best real photograph for each inspection zone
  const resolveZonePhoto = (zone: CameraZonePreset): string => {
    if (zone.id === "exterior" && images[0]) return images[0];
    if (zone.id === "cockpit" && images[2]) return images[2];
    if (zone.id === "boot" && images[1]) return images[1];
    return zone.fallbackImage;
  };

  const handleSelectZone = (zoneId: InspectionZoneId) => {
    setActiveZone(zoneId);
    setActiveHotspotIdx(null);
    setExtraZoom(1);
  };

  const handleSelectHotspot = (idx: number) => {
    setActiveHotspotIdx(idx);
    if (idx === 0) setActiveZone("bonnet");
    if (idx === 1) setActiveZone("cockpit");
    if (idx === 2) setActiveZone("exterior");
  };

  const cycleNextZone = () => {
    const idx = INSPECTION_ZONES.findIndex((z) => z.id === activeZone);
    const next = INSPECTION_ZONES[(idx + 1) % INSPECTION_ZONES.length];
    handleSelectZone(next.id);
  };

  return (
    <div className="relative w-full h-[600px] sm:h-[640px] bg-[#070910] rounded-3xl overflow-hidden border border-white/15 shadow-2xl select-none">
      {/* Real High-Res Zone Photograph Viewport */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={resolveZonePhoto(currentZoneInfo)}
          alt={currentZoneInfo.labelEn}
          style={{
            transform: `scale(${currentZoneInfo.zoomScale * extraZoom})`,
            transformOrigin: currentZoneInfo.transformOrigin,
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="w-full h-full object-cover object-center"
        />

        {/* Dark Gradient Overlays for HUD Legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/60" />

        {/* Optional Paint Tint on Exterior Zone */}
        {activeZone === "exterior" && currentColor !== "transparent" && (
          <div
            style={{ backgroundColor: currentColor }}
            className="pointer-events-none absolute inset-0 mix-blend-color opacity-40 transition-colors duration-500"
          />
        )}
      </div>

      {/* Top-Left Multi-Zone Camera Switcher Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/15 bg-black/80 p-1.5 backdrop-blur-xl">
          {INSPECTION_ZONES.map((z) => {
            const active = activeZone === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => handleSelectZone(z.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  active
                    ? "bg-amber-500 text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {z.id === "exterior" && <Compass className="h-3.5 w-3.5" />}
                {z.id === "cockpit" && <Eye className="h-3.5 w-3.5" />}
                {z.id === "bonnet" && <Cpu className="h-3.5 w-3.5" />}
                {z.id === "boot" && <PackageOpen className="h-3.5 w-3.5" />}
                {z.id === "wheels" && <Disc className="h-3.5 w-3.5" />}
                <span>{locale === "sw" ? z.labelSw : z.labelEn}</span>
              </button>
            );
          })}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/85 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300 backdrop-blur-md">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{currentZoneInfo.specBadge}</span>
        </span>
      </div>

      {/* Top-Right Hotspot Inspection Buttons */}
      <div className="absolute top-20 right-4 z-20 hidden md:flex flex-col gap-2 max-w-xs">
        {hotspots.map((spot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectHotspot(idx)}
            className={`p-3 rounded-2xl border text-left backdrop-blur-md transition cursor-pointer ${
              activeHotspotIdx === idx
                ? "bg-amber-500 text-black border-amber-400 font-bold shadow-lg"
                : "bg-black/75 text-white border-white/15 hover:border-amber-400/50"
            }`}
          >
            <div className="text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>{spot.title}</span>
            </div>
            <div
              className={`text-[11px] mt-0.5 ${
                activeHotspotIdx === idx ? "text-neutral-900" : "text-slate-300"
              }`}
            >
              {spot.description}
            </div>
          </button>
        ))}
      </div>

      {/* Active Zone Telemetry Callout Banner */}
      <div className="pointer-events-none absolute bottom-20 left-6 right-6 z-20 max-w-xl rounded-2xl border border-white/15 bg-black/80 p-3.5 backdrop-blur-md">
        <div className="text-xs font-extrabold text-amber-400 uppercase">
          {locale === "sw" ? currentZoneInfo.labelSw : currentZoneInfo.labelEn}
        </div>
        <p className="mt-0.5 text-xs text-slate-200">
          {locale === "sw"
            ? currentZoneInfo.descriptionSw
            : currentZoneInfo.descriptionEn}
        </p>
      </div>

      {/* Bottom-Left Paint Customizer */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/85 px-4 py-2.5 backdrop-blur-xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          {locale === "sw" ? "Rangi:" : "Finish:"}
        </span>
        <div className="flex items-center gap-2">
          {availableColors.map((color, idx) => (
            <button
              key={`${color.name}-${idx}`}
              type="button"
              onClick={() =>
                setCurrentColor(idx === 0 ? "transparent" : color.hex)
              }
              title={color.name}
              style={{
                backgroundColor:
                  color.hex === "transparent" ? "#e5e7eb" : color.hex,
              }}
              className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
                (idx === 0 && currentColor === "transparent") ||
                currentColor === color.hex
                  ? "scale-125 border-amber-400 ring-2 ring-amber-400/40"
                  : "border-white/30 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom-Right Zone Cycle & Zoom HUD */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 rounded-2xl border border-white/15 bg-black/85 p-1.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={cycleNextZone}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-bold transition hover:bg-amber-400 cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>{locale === "sw" ? "Sehemu Inayofuata" : "Next Zone"}</span>
        </button>

        <button
          type="button"
          onClick={() => setExtraZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
          className="rounded-xl p-1.5 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setExtraZoom((z) => Math.max(1.0, +(z - 0.15).toFixed(2)))}
          className="rounded-xl p-1.5 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => handleSelectZone("exterior")}
          className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
