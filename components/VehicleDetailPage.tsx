"use client";

import React, { useState } from "react";
import VehicleShowroomConfigurator from "@/components/VehicleShowroomConfigurator";
import VehicleFullInspectionViewer from "@/components/VehicleFullInspectionViewer";

export interface VehicleDetailProps {
  vehicle: {
    vin: string;
    make: string;
    model: string;
    year: number;
    selling_price_tzs: number;
    mileage_km: number;
    fuel_type: string;
    transmission: string;
    color: string;
    branch_name: string;
    model_3d_url?: string;
    body_mesh_names?: string[];
    available_colors?: { name: string; hex: string }[];
    hotspots?: {
      title: string;
      description: string;
      position: [number, number, number];
    }[];
    images: string[];
    specifications: Record<string, string>;
  };
}

export default function VehicleDetailPage({ vehicle }: VehicleDetailProps) {
  const [viewMode, setViewMode] = useState<"360" | "multizone" | "gallery">(
    "360"
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [locale, setLocale] = useState<"sw" | "en">("sw");

  const formattedPrice = new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(vehicle.selling_price_tzs);

  const resolvedModelUrl =
    vehicle.model_3d_url ||
    (vehicle.make.toLowerCase().includes("land rover")
      ? "/models/defender_110.glb"
      : vehicle.model.toLowerCase().includes("300")
      ? "/models/land_cruiser_300.glb"
      : "/models/toyota_prado.glb");

  const resolvedColors = vehicle.available_colors || [
    { name: "Pearl White", hex: "#f8f9fa" },
    { name: "Attitude Black", hex: "#111111" },
    { name: "Slate Silver", hex: "#71717a" },
    { name: "Imperial Bronze", hex: "#453229" },
  ];

  const resolvedHotspots = vehicle.hotspots || [
    {
      title: "Engine Status",
      description: `${vehicle.specifications.engine_code || "1GD-FTV"} ${
        vehicle.fuel_type
      } - TBS Tested`,
      position: [0, 1.2, 1.8] as [number, number, number],
    },
    {
      title: "Mileage & Condition",
      description: `${vehicle.mileage_km.toLocaleString()} km - ${
        vehicle.specifications.auction_grade || "Authentic Grade 4.5"
      }`,
      position: [1.2, 1.4, 0] as [number, number, number],
    },
    {
      title: "Owner Locked Price",
      description: `${formattedPrice} - ${vehicle.branch_name}`,
      position: [0, 1.0, -1.9] as [number, number, number],
    },
  ];

  const t = {
    sw: {
      view360: "Mwonekano wa 360° Studio",
      viewMultiZone: "Ukaguzi wa Ndani & Injini (5-Zone)",
      viewGallery: "Picha za Yadi",
      ownerLockBadge: "Bei ya Mmiliki (Imefungwa)",
      fixedPriceMsg:
        "Bei hii imethibitishwa moja kwa moja na Mmiliki Mkuu. Hakuna madalali wala nyongeza iliyofichika.",
      bookViewing: "Omba Kuona Gari / Test Drive",
      transferPrompt: "Gari lipo",
      requestTransfer: "Omba lihamishwe kuja tawi la karibu nawe bure.",
      specsTitle: "Sifa na Taarifa za Ufundi",
      traVerified:
        "Imelipiwa Kodi Zote za TRA na Ukaguzi wa TBS Umekamilika",
      whatsAppChat: "Wasiliana WhatsApp Kuhusu Gari Hili",
    },
    en: {
      view360: "360° Studio Configurator",
      viewMultiZone: "5-Zone Cockpit & Engine Inspector",
      viewGallery: "Yard Photos",
      ownerLockBadge: "Owner Price Locked",
      fixedPriceMsg:
        "Direct owner-verified valuation. Zero broker markups, zero hidden customs fees.",
      bookViewing: "Schedule Inspection / Test Drive",
      transferPrompt: "Vehicle currently at",
      requestTransfer:
        "Request a free viewing transfer to your preferred branch.",
      specsTitle: "Technical Specifications & Verification",
      traVerified: "Full TRA Customs Duty Paid & TBS Verified",
      whatsAppChat: "Inquire via WhatsApp for this Vehicle",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Locale Header */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <a
            href="/vehicles"
            className="text-sm font-medium text-amber-500 hover:text-amber-400 transition"
          >
            &larr;{" "}
            {locale === "sw" ? "Rudi kwenye Magari Yote" : "Back to Catalog"}
          </a>
          <button
            onClick={() => setLocale(locale === "sw" ? "en" : "sw")}
            className="text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-neutral-300 hover:border-amber-500 transition cursor-pointer"
          >
            {locale === "sw"
              ? "Switch to English 🇬🇧"
              : "Badili kwenda Swahili 🇹🇿"}
          </button>
        </div>

        {/* Vehicle Title & Yard Location Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md border border-amber-500/20">
                {vehicle.branch_name}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                VIN: {vehicle.vin}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
          </div>

          {/* Toggle 360 Configurator vs Multi-Zone Inspector vs Gallery */}
          <div className="flex flex-wrap bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start md:self-auto gap-1">
            <button
              onClick={() => setViewMode("360")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === "360"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.view360}
            </button>
            <button
              onClick={() => setViewMode("multizone")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === "multizone"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.viewMultiZone}
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === "gallery"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.viewGallery}
            </button>
          </div>
        </div>

        {/* Visual Inspection Showcase */}
        <div className="w-full">
          {viewMode === "360" ? (
            <VehicleShowroomConfigurator
              modelUrl={resolvedModelUrl}
              images={vehicle.images}
              vehicleTitle={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
              bodyMeshNames={
                vehicle.body_mesh_names || [
                  "Body",
                  "Car_Body",
                  "Exterior",
                  "Paint",
                  "Hood",
                  "Doors",
                ]
              }
              availableColors={resolvedColors}
              hotspots={resolvedHotspots}
            />
          ) : viewMode === "multizone" ? (
            <VehicleFullInspectionViewer
              locale={locale}
              images={vehicle.images}
              config={{
                id: vehicle.vin,
                name: `${vehicle.make} ${vehicle.model}`,
                vin: vehicle.vin,
                modelUrl: resolvedModelUrl,
                defaultColor: resolvedColors[0].hex,
                availableColors: resolvedColors,
                bodyMeshNames: [
                  "Body",
                  "Car_Body",
                  "Exterior",
                  "Paint",
                  "Hood",
                  "Doors",
                ],
                hotspots: resolvedHotspots,
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="w-full h-[500px] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                <img
                  src={vehicle.images[activeImageIndex]}
                  alt="Vehicle Showcase"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-24 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activeImageIndex === index
                        ? "border-amber-500"
                        : "border-neutral-800 opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing, Action Box & Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Details & Specs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-emerald-400 text-sm font-semibold mb-6">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t.traVerified}
              </div>

              <h3 className="text-lg font-bold text-white mb-4">
                {t.specsTitle}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                  <span className="text-xs text-neutral-400 uppercase">
                    Mileage
                  </span>
                  <p className="text-base font-bold text-white mt-1">
                    {vehicle.mileage_km.toLocaleString()} KM
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                  <span className="text-xs text-neutral-400 uppercase">
                    Fuel Type
                  </span>
                  <p className="text-base font-bold text-white mt-1">
                    {vehicle.fuel_type}
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                  <span className="text-xs text-neutral-400 uppercase">
                    Transmission
                  </span>
                  <p className="text-base font-bold text-white mt-1">
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                  <span className="text-xs text-neutral-400 uppercase">
                    Color
                  </span>
                  <p className="text-base font-bold text-white mt-1">
                    {vehicle.color}
                  </p>
                </div>
                {Object.entries(vehicle.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80"
                  >
                    <span className="text-xs text-neutral-400 uppercase">
                      {key.replace("_", " ")}
                    </span>
                    <p className="text-base font-bold text-white mt-1">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Price Locking & Booking Box */}
          <div className="space-y-6">
            <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {t.ownerLockBadge}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white my-2">
                {formattedPrice}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {t.fixedPriceMsg}
              </p>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 mb-6">
                <strong>
                  {t.transferPrompt} {vehicle.branch_name}.
                </strong>{" "}
                {t.requestTransfer}
              </div>

              <div className="space-y-3">
                <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer">
                  {t.bookViewing}
                </button>
                <a
                  href={`https://wa.me/255700000000?text=Hello%20Bingwa%20Cars,%20I%20am%20interested%20in%20VIN:%20${vehicle.vin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold py-3.5 px-4 rounded-xl transition border border-neutral-700"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  {t.whatsAppChat}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
