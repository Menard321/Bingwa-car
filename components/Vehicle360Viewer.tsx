'use client';

import React, { useRef, useState } from 'react';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Lock,
  ShieldCheck,
  Gauge,
  Cpu,
  Palette,
  Sparkles,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { useBingwaStore } from '@/lib/store';

type PaintKey = 'original' | 'pearl_white' | 'onyx_black' | 'slate_grey';

interface PaintOption {
  id: PaintKey;
  labelSw: string;
  labelEn: string;
  hex: string;
}

const PAINT_OPTIONS: PaintOption[] = [
  {
    id: 'original',
    labelSw: 'Rangi Halisi (Original)',
    labelEn: 'Original Factory',
    hex: 'transparent',
  },
  {
    id: 'pearl_white',
    labelSw: 'Pearl White (Nyeupe)',
    labelEn: 'Pearl White (070)',
    hex: '#F3F4F6',
  },
  {
    id: 'onyx_black',
    labelSw: 'Onyx Black (Nyeusi)',
    labelEn: 'Onyx Black (202)',
    hex: '#111827',
  },
  {
    id: 'slate_grey',
    labelSw: 'Slate Grey (Kijivu)',
    labelEn: 'Slate Grey (1G3)',
    hex: '#475569',
  },
];

const SHOWROOM_ANGLES = [
  {
    url: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1400&q=85',
    labelSw: '1. Mwonekano wa Mbele & Pembeni (Front-Quarter)',
    labelEn: '1. Front-Quarter Studio Angle',
  },
  {
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85',
    labelSw: '2. Mwonekano wa Ubavuni & Rimu (Side Stance)',
    labelEn: '2. Side Profile & Off-Road Stance',
  },
  {
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85',
    labelSw: '3. Kabini ya Ngozi & Dashboard (Interior Cockpit)',
    labelEn: '3. Luxury Leather Cockpit & Infotainment',
  },
];

interface HotspotInfo {
  id: 'engine' | 'mileage' | 'pricing';
  labelSw: string;
  labelEn: string;
  titleSw: string;
  titleEn: string;
  detailSw: string;
  detailEn: string;
  badge: string;
  positionClass: string;
  angleIndex: number;
  zoomOrigin: string;
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: 'engine',
    labelSw: '1. Injini & TBS',
    labelEn: '1. Engine Status',
    titleSw: '1GD-FTV 2.8L Clean Turbo Diesel - TBS Verified',
    titleEn: '1GD-FTV 2.8L Clean Turbo Diesel - TBS Verified',
    detailSw:
      'Imekaguliwa kikamilifu na JAAI Japan & Shirika la Viwango Tanzania (TBS-DAR-2026-88412). Hakuna uvujaji wala moshi.',
    detailEn:
      'Certified by JAAI Japan & Tanzania Bureau of Standards (TBS-DAR-2026-88412). 204 HP / 500 Nm Torque.',
    badge: 'TBS PASS • 1GD-FTV',
    positionClass: 'top-[46%] left-[28%]',
    angleIndex: 0,
    zoomOrigin: '28% 46%',
  },
  {
    id: 'mileage',
    labelSw: '2. Kilomita & Grade',
    labelEn: '2. Mileage & Condition',
    titleSw: '32,450 km - Original Japan Grade 4.5B',
    titleEn: '32,450 km - Original Japan Grade 4.5B',
    detailSw:
      'Odometer halisi isiyorudishwa nyuma. Cheti cha mnada wa USS Tokyo kinaonyesha alama 4.5B (Ndani na Nje Safi).',
    detailEn:
      'Guaranteed non-tampered odometer reading with original USS Tokyo Auction Sheet Grade 4.5B verification.',
    badge: 'USS TOKYO 4.5B',
    positionClass: 'top-[35%] left-[54%]',
    angleIndex: 2,
    zoomOrigin: '54% 35%',
  },
  {
    id: 'pricing',
    labelSw: '3. Bei ya Mmiliki',
    labelEn: '3. Owner Locked Price',
    titleSw: 'TZS 145,000,000 (Owner Price Locked)',
    titleEn: 'TZS 145,000,000 (Owner Price Locked)',
    detailSw:
      'Bei imefungwa moja kwa moja na Mkurugenzi Mtendaji (SHA-256 Audit). Imejumuisha Ushuru wa TRA (TANSAD) na Usajili.',
    detailEn:
      'Cryptographically locked by Managing Director (Zero broker markup). Includes 100% TRA Customs Duty & Plate.',
    badge: 'TZS 145,000,000',
    positionClass: 'top-[52%] right-[20%]',
    angleIndex: 1,
    zoomOrigin: '75% 52%',
  },
];

export interface Vehicle360ViewerProps {
  modelUrl?: string;
  vehicleName?: string;
  plateNumber?: string;
}

export default function Vehicle360Viewer({
  vehicleName = '2021 PRADO TX-L',
  plateNumber = 'GDJ150W',
}: Vehicle360ViewerProps = {}) {
  const { locale } = useBingwaStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number>(0);

  const [selectedPaint, setSelectedPaint] = useState<PaintOption>(PAINT_OPTIONS[0]);
  const [activeAngleIdx, setActiveAngleIdx] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo>(HOTSPOTS[0]);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomOrigin, setZoomOrigin] = useState<string>('50% 50%');
  const [rotationY, setRotationY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const clampedTilt = Math.max(-12, Math.min(12, deltaX * 0.08));
    setRotationY(clampedTilt);

    if (Math.abs(deltaX) > 90) {
      const dir = deltaX > 0 ? -1 : 1;
      setActiveAngleIdx(
        (prev) => (prev + dir + SHOWROOM_ANGLES.length) % SHOWROOM_ANGLES.length
      );
      dragStartXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setRotationY(0);
  };

  const handleSelectHotspot = (spot: HotspotInfo) => {
    setActiveHotspot(spot);
    setActiveAngleIdx(spot.angleIndex);
    setZoomOrigin(spot.zoomOrigin);
    setZoomScale(1.25);
  };

  const handleCycleAngle = () => {
    setActiveAngleIdx((prev) => (prev + 1) % SHOWROOM_ANGLES.length);
    setZoomScale(1);
    setZoomOrigin('50% 50%');
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomScale((prev) =>
      direction === 'in'
        ? Math.min(1.85, +(prev + 0.2).toFixed(2))
        : Math.max(1.0, +(prev - 0.2).toFixed(2))
    );
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentAngle = SHOWROOM_ANGLES[activeAngleIdx];

  return (
    <section
      id="showroom-3d"
      className="relative border-b border-white/10 bg-[#050811] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>INTERACTIVE 360° DIGITAL SHOWROOM</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
              {locale === 'sw'
                ? 'Kagua Gari Halisi kwa 360° Kabla ya Kufika Yard'
                : '360° Interactive Real-Vehicle Showroom & Spec Hotspots'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              {locale === 'sw'
                ? 'Buruta picha kushoto au kulia kubadilisha pembe za gari, jaribu rangi za bodi, na bonyeza alama za ukaguzi kuona vyeti vya TBS, kilomita halisi, na bei iliyofungwa na mmiliki.'
                : 'Drag left or right to orbit across real multi-angle photography of our flagship 2021 Toyota Land Cruiser Prado TX-L, preview paint finishes, and inspect verified hotspots.'}
            </p>
          </div>

          {/* Paint Color Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-2">
            <span className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-400">
              <Palette className="h-3.5 w-3.5 text-amber-400" />
              {locale === 'sw' ? 'Rangi:' : 'Finish:'}
            </span>
            {PAINT_OPTIONS.map((paint) => {
              const active = selectedPaint.id === paint.id;
              return (
                <button
                  key={paint.id}
                  type="button"
                  onClick={() => setSelectedPaint(paint)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-white text-slate-950 shadow'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/40"
                    style={{
                      backgroundColor:
                        paint.hex === 'transparent' ? '#f59e0b' : paint.hex,
                    }}
                  />
                  <span>{locale === 'sw' ? paint.labelSw : paint.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Stage & Inspection Telemetry Split Layout */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 gap-6 rounded-3xl border border-white/15 bg-[#070B14] p-4 sm:p-6 shadow-2xl lg:grid-cols-12"
        >
          {/* Left 8 Columns: Real High-Res Interactive Showroom Stage */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative h-[420px] sm:h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#070B14] select-none cursor-grab active:cursor-grabbing lg:col-span-8"
          >
            {/* Real Vehicle Image with 3D Perspective Tilt & Smooth Hotspot Zoom */}
            <div
              style={{
                transform: `perspective(1200px) rotateY(${rotationY}deg) scale(${zoomScale})`,
                transformOrigin: zoomOrigin,
                transition: isDragging
                  ? 'transform 60ms linear'
                  : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative h-full w-full"
            >
              <img
                src={currentAngle.url}
                alt={currentAngle.labelEn}
                draggable={false}
                className="h-full w-full object-cover object-center"
              />

              {/* Studio Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Paint Tint Overlay */}
              {selectedPaint.hex !== 'transparent' && (
                <div
                  style={{ backgroundColor: selectedPaint.hex }}
                  className="pointer-events-none absolute inset-0 mix-blend-color opacity-45 transition-colors duration-500"
                />
              )}
            </div>

            {/* Top-Left Live Telemetry Overlay */}
            <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1 font-mono text-xs font-bold text-amber-400 backdrop-blur-md">
                <Camera className="h-3.5 w-3.5" />
                <span>
                  {locale === 'sw' ? currentAngle.labelSw : currentAngle.labelEn}
                </span>
              </span>
              <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/85 px-3 py-1 font-mono text-xs font-semibold text-emerald-300 backdrop-blur-md">
                {vehicleName} ({plateNumber})
              </span>
            </div>

            {/* Interactive Inspection Hotspot Pins on the Real Car Photo */}
            {HOTSPOTS.map((spot) => {
              const isSelected = activeHotspot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotspot(spot);
                  }}
                  className={`absolute ${spot.positionClass} z-20 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.85)] scale-105'
                      : 'border-white/30 bg-black/80 text-white hover:border-amber-400 backdrop-blur-md'
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
                  </span>
                  <span>{locale === 'sw' ? spot.labelSw : spot.labelEn}</span>
                </button>
              );
            })}

            {/* Bottom HUD Action Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-black/80 px-4 py-2.5 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCycleAngle();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'sw'
                      ? `Badili Pembe (${activeAngleIdx + 1}/${SHOWROOM_ANGLES.length})`
                      : `Next Angle (${activeAngleIdx + 1}/${SHOWROOM_ANGLES.length})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoom('in');
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Zoom +</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoom('out');
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Zoom -</span>
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>{locale === 'sw' ? 'Punguza Skrini' : 'Exit Fullscreen'}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>{locale === 'sw' ? 'Skrini Kamili' : 'Full Screen'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 4 Columns: Active Hotspot Inspection Readout & Owner Lock Ledger */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 lg:col-span-4 space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === 'sw' ? 'UKAGUZI WA HOTSPOT' : 'VERIFIED HOTSPOT SPEC'}
                </span>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
                  {activeHotspot.badge}
                </span>
              </div>

              {/* Active Hotspot Detail Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/15 to-transparent p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  {activeHotspot.id === 'engine' && <Cpu className="h-4 w-4" />}
                  {activeHotspot.id === 'mileage' && <Gauge className="h-4 w-4" />}
                  {activeHotspot.id === 'pricing' && <Lock className="h-4 w-4" />}
                  <span>
                    {locale === 'sw' ? activeHotspot.labelSw : activeHotspot.labelEn}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-black text-white">
                  {locale === 'sw' ? activeHotspot.titleSw : activeHotspot.titleEn}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {locale === 'sw' ? activeHotspot.detailSw : activeHotspot.detailEn}
                </p>
              </div>

              {/* All 3 Clickable Inspection Spec Selectors */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">
                  {locale === 'sw'
                    ? 'Vipengele vyote vilivyokaguliwa:'
                    : 'All Verified Inspection Points:'}
                </p>
                {HOTSPOTS.map((h) => {
                  const active = activeHotspot.id === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleSelectHotspot(h)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs transition cursor-pointer ${
                        active
                          ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                          : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span>{locale === 'sw' ? h.titleSw : h.titleEn}</span>
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          active ? 'text-amber-400' : 'text-emerald-400/60'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strict Owner Price Lock Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-[#050912] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Lock className="h-3.5 w-3.5" />
                  {locale === 'sw'
                    ? 'BEI YA MMILIKI ILIYOFUNGWA'
                    : 'STRICT OWNER-LOCKED PRICE'}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  SHA256:9F86D08
                </span>
              </div>

              <div className="text-2xl font-black text-white">
                TZS 145,000,000
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {locale === 'sw'
                    ? 'Ipo Mikocheni Showroom • Inajumuisha Ushuru wa TRA & Usajili'
                    : 'At Mikocheni Showroom • Includes Full TRA Duty & Registration'}
                </span>
              </div>

              <a
                href="https://wa.me/255754889900?text=Habari%20Bingwa%20Cars%2C%20nimeona%202021%20Land%20Cruiser%20Prado%20TX-L%20(TZS%20145%2C000%2C000)%20kwenye%203D%20Showroom.%20Naomba%20kuiona%20Mikocheni."
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-black text-slate-950 shadow hover:brightness-110 transition"
              >
                <span>
                  {locale === 'sw'
                    ? 'Weka Miadi ya Kuiona (Mikocheni Showroom)'
                    : 'Book Viewing / Reserve at Mikocheni'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
