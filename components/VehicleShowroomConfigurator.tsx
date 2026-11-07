"use client";

import React, { useState, useRef } from "react";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  Camera,
  Maximize2,
} from "lucide-react";

export interface Props {
  modelUrl?: string;
  images?: string[];
  vehicleTitle?: string;
  bodyMeshNames?: string[];
  availableColors?: { name: string; hex: string }[];
  hotspots?: {
    title: string;
    description: string;
    position: [number, number, number];
  }[];
}

const DEFAULT_CAR_IMAGES = [
  "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85",
];

// Screen-space hotspot pin coordinates + zoom targets on the real car photo
const PIN_POSITIONS: {
  top: string;
  left: string;
  zoomOrigin: string;
  angleIndex: number;
}[] = [
  { top: "48%", left: "28%", zoomOrigin: "28% 48%", angleIndex: 0 }, // Engine / Front Bonnet
  { top: "38%", left: "52%", zoomOrigin: "52% 38%", angleIndex: 1 }, // Cabin / Mileage & Grade
  { top: "52%", left: "74%", zoomOrigin: "74% 52%", angleIndex: 2 }, // Rear / Owner Locked Price
];

export default function VehicleShowroomConfigurator({
  images = DEFAULT_CAR_IMAGES,
  vehicleTitle = "Bingwa Certified Vehicle",
  availableColors = [
    { name: "Original Factory Finish", hex: "transparent" },
    { name: "Pearl White", hex: "#f8f9fa" },
    { name: "Attitude Black", hex: "#111111" },
    { name: "Slate Silver", hex: "#71717a" },
    { name: "Imperial Bronze", hex: "#453229" },
  ],
  hotspots = [
    {
      title: "Engine Status",
      description: "2.8L 1GD-FTV Turbo Diesel - Tested",
      position: [0, 1.2, 1.8],
    },
    {
      title: "Mileage & Condition",
      description: "42,000 km - Authentic Japan Grade 4.5",
      position: [1.2, 1.4, 0],
    },
    {
      title: "Owner Locked Price",
      description: "TZS 145,000,000 - Mwenge Yard",
      position: [0, 1.0, -1.9],
    },
  ],
}: Props) {
  const validImages = images.length > 0 ? images : DEFAULT_CAR_IMAGES;

  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [currentColor, setCurrentColor] = useState<string>(
    availableColors[0]?.hex || "transparent"
  );
  const [currentColorName, setCurrentColorName] = useState<string>(
    availableColors[0]?.name || "Original Finish"
  );
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomOrigin, setZoomOrigin] = useState<string>("50% 50%");
  const [rotationY, setRotationY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);

  // Drag left/right on the studio stage to scrub across real vehicle angles & 3D perspective
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Apply subtle 3D perspective tilt while dragging
    const clampedTilt = Math.max(-14, Math.min(14, deltaX * 0.08));
    setRotationY(clampedTilt);

    // Switch real photo angle when user drags past threshold
    if (Math.abs(deltaX) > 95) {
      const direction = deltaX > 0 ? -1 : 1;
      setActiveAngleIdx(
        (prev) => (prev + direction + validImages.length) % validImages.length
      );
      dragStartXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setRotationY(0);
  };

  const focusHotspot = (index: number) => {
    if (activeHotspot === index) {
      setActiveHotspot(null);
      setZoomScale(1);
      setZoomOrigin("50% 50%");
      return;
    }
    const pin = PIN_POSITIONS[index % PIN_POSITIONS.length];
    setActiveHotspot(index);
    setActiveAngleIdx(pin.angleIndex % validImages.length);
    setZoomOrigin(pin.zoomOrigin);
    setZoomScale(1.38);
  };

  const resetView = () => {
    setActiveHotspot(null);
    setZoomScale(1);
    setZoomOrigin("50% 50%");
    setRotationY(0);
    setActiveAngleIdx(0);
  };

  const cycleNextAngle = () => {
    setActiveAngleIdx((prev) => (prev + 1) % validImages.length);
  };

  const angleLabels = [
    "Front-Quarter Studio View",
    "Side Profile & Alloy Stance",
    "Rear & Cabin Detail View",
  ];

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-[560px] sm:h-[620px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl select-none cursor-grab active:cursor-grabbing"
    >
      {/* Studio Showroom Ambient Spotlight & Golden Turntable Floor */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.14),rgba(10,10,14,0.96)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[85%] h-40 rounded-[100%] border-2 border-amber-500/40 bg-gradient-to-t from-amber-500/15 via-neutral-900/60 to-transparent blur-[1px] shadow-[0_0_60px_rgba(245,158,11,0.25)]" />

      {/* Real High-Resolution Vehicle Photograph Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-10 overflow-hidden">
        <div
          style={{
            transform: `perspective(1200px) rotateY(${rotationY}deg) scale(${zoomScale})`,
            transformOrigin: zoomOrigin,
            transition: isDragging
              ? "transform 60ms linear"
              : "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="relative w-full h-full max-w-5xl max-h-[460px] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10"
        >
          <img
            src={validImages[activeAngleIdx]}
            alt={`${vehicleTitle} - Angle ${activeAngleIdx + 1}`}
            draggable={false}
            className="w-full h-full object-cover object-center transition-opacity duration-300"
          />

          {/* Subtle Studio Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

          {/* Optional Paint Finish Tint Overlay (when user previews another paint color) */}
          {currentColor !== "transparent" &&
            currentColor !== availableColors[0]?.hex && (
              <div
                style={{ backgroundColor: currentColor }}
                className="pointer-events-none absolute inset-0 mix-blend-color opacity-45 transition-colors duration-500"
              />
            )}

          {/* Interactive Pulsing Hotspot Pins Directly on the Real Car Photo */}
          {hotspots.map((spot, idx) => {
            const pin = PIN_POSITIONS[idx % PIN_POSITIONS.length];
            const isSelected = activeHotspot === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  focusHotspot(idx);
                }}
                style={{ top: pin.top, left: pin.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-black border-amber-300 scale-110 shadow-[0_0_25px_rgba(245,158,11,0.9)]"
                    : "bg-black/80 text-white border-white/40 hover:border-amber-400 hover:scale-105 backdrop-blur-md"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                </span>
                <span className="hidden sm:inline">{spot.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-Left Studio Status & Angle Selector Pills */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-black/80 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-md">
          <Camera className="w-3.5 h-3.5" />
          <span>REAL VEHICLE STUDIO • DRAG TO ORBIT ANGLES</span>
        </span>
        <span className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/85 border border-emerald-500/30 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-300 backdrop-blur-md">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {angleLabels[activeAngleIdx] || `Angle ${activeAngleIdx + 1}`}
          </span>
        </span>
      </div>

      {/* Feature Hotspot Cards on the Top-Right */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex flex-col gap-2 max-w-xs">
        {hotspots.map((spot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              focusHotspot(idx);
            }}
            className={`p-3 rounded-xl border text-left backdrop-blur-md transition cursor-pointer ${
              activeHotspot === idx
                ? "bg-amber-500 text-black border-amber-400 font-bold shadow-lg"
                : "bg-neutral-900/85 text-white border-neutral-700/70 hover:bg-neutral-800"
            }`}
          >
            <div className="text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{spot.title}</span>
            </div>
            <div
              className={`text-[11px] mt-0.5 ${
                activeHotspot === idx ? "text-neutral-900" : "text-neutral-300"
              }`}
            >
              {spot.description}
            </div>
          </button>
        ))}
      </div>

      {/* Angle Thumbnails Strip (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-700/60 shadow-xl">
        {validImages.map((imgUrl, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveAngleIdx(idx);
              setZoomScale(1);
              setActiveHotspot(null);
            }}
            className={`relative w-16 h-11 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
              activeAngleIdx === idx
                ? "border-amber-500 scale-105 shadow-md"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={imgUrl}
              alt={`Angle ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Exterior Paint Finish Preview Palette (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl border border-neutral-700/60 shadow-xl">
        <span className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
          Paint Finish: <span className="text-amber-400">{currentColorName}</span>
        </span>
        <div className="flex items-center gap-2">
          {availableColors.map((color, idx) => (
            <button
              key={`${color.name}-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentColor(idx === 0 ? "transparent" : color.hex);
                setCurrentColorName(color.name);
              }}
              title={color.name}
              style={{
                backgroundColor:
                  color.hex === "transparent" ? "#e5e7eb" : color.hex,
              }}
              className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                currentColorName === color.name
                  ? "scale-125 border-amber-500 shadow-md ring-2 ring-amber-500/30"
                  : "border-neutral-600 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Camera Zoom & Angle Controls (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl border border-neutral-700/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cycleNextAngle();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Next Angle ({activeAngleIdx + 1}/{validImages.length})</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale((z) => Math.min(2.0, +(z + 0.25).toFixed(2)));
          }}
          className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale((z) => Math.max(1.0, +(z - 0.25).toFixed(2)));
          }}
          className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            resetView();
          }}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
