'use client';

import React, { useMemo } from 'react';
import {
  Search,
  Lock,
  ShieldCheck,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useBingwaStore } from '@/lib/store';
import { BodyType, BranchId, VEHICLES_INVENTORY, formatTZS } from '@/lib/data';

const MAKES = [
  'ALL',
  'Toyota',
  'Nissan',
  'Mercedes-Benz',
  'Land Rover',
  'Subaru',
  'BMW',
  'Suzuki',
  'Mitsubishi',
  'Ford',
  'Isuzu',
];

const BODY_TYPES: { id: BodyType; labelSw: string; labelEn: string }[] = [
  { id: 'ALL', labelSw: 'Aina Zote za Bodi', labelEn: 'All Body Types' },
  { id: 'SUV', labelSw: 'SUV / Luxury 4x4', labelEn: 'SUV / Luxury 4x4' },
  { id: 'Pickup', labelSw: 'Pick-up / Double Cab 4x4', labelEn: 'Pick-up / 4x4' },
  { id: 'Sedan', labelSw: 'Sedan / Saloon', labelEn: 'Executive Sedan' },
  { id: 'Hatchback', labelSw: 'Hatchback / Compact', labelEn: 'Hatchback' },
  { id: 'Commercial', labelSw: 'Magari ya Kazi / Commercial', labelEn: 'Commercial' },
];

export default function HeroSearch() {
  const {
    locale,
    selectedBranch,
    setSelectedBranch,
    selectedMake,
    setSelectedMake,
    selectedBodyType,
    setSelectedBodyType,
    maxPriceMillions,
    setMaxPriceMillions,
    resetFilters,
  } = useBingwaStore();

  // Compute live count match preview based on current filter matrix
  const matchingCount = useMemo(() => {
    return VEHICLES_INVENTORY.filter((vehicle) => {
      if (selectedBranch !== 'all' && vehicle.branchId !== selectedBranch) {
        return false;
      }
      if (selectedMake !== 'ALL' && vehicle.make !== selectedMake) {
        return false;
      }
      if (selectedBodyType !== 'ALL' && vehicle.bodyType !== selectedBodyType) {
        return false;
      }
      if (vehicle.priceTzs > maxPriceMillions * 1_000_000) {
        return false;
      }
      return true;
    }).length;
  }, [selectedBranch, selectedMake, selectedBodyType, maxPriceMillions]);

  const handleScrollToInventory = () => {
    const el = document.getElementById('inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-[#050811] pt-10 pb-20 lg:pt-16 lg:pb-24"
    >
      {/* Luxury Showroom Lighting & Architectural Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        {/* Overhead Showroom Light Beams */}
        <div className="absolute -top-40 left-1/4 h-[34rem] w-[48rem] -rotate-12 rounded-full bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute top-10 right-1/4 h-[30rem] w-[42rem] rotate-12 rounded-full bg-gradient-to-b from-emerald-500/12 via-sky-500/5 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Bilingual Headline, Value Prop & Showroom Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {locale === 'sw'
                  ? 'MWENGE CENTRAL YARD • MIKOCHENI FLAGSHIP SHOWROOM'
                  : 'MWENGE CENTRAL YARD • MIKOCHENI FLAGSHIP SHOWROOM'}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
              {locale === 'sw' ? (
                <>
                  Magari Bora ya Uhakika Dar es Salaam —{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                    Bei ya Mmiliki Isiyoyumba.
                  </span>
                </>
              ) : (
                <>
                  Dar es Salaam&apos;s Premier Verified Dealership —{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                    Authentic Owner-Locked Prices.
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {locale === 'sw'
                ? 'Nunua gari lililokaguliwa kwa viwango vya TBS na TRA TANSAD halisi moja kwa moja kwenye yard zetu za Mwenge na Mikocheni, au agiza moja kwa moja kutoka Japan na Uingereza bila gharama zilizofichika.'
                : 'Purchase TBS-inspected, 100% TRA TANSAD tax-cleared vehicles directly from our Mwenge Yard and Mikocheni Flagship Showroom, or order custom imports from Japan & the UK with zero broker markups.'}
            </p>

            {/* Unbreakable Business Logic Guarantee Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {locale === 'sw' ? 'Bei Imefungwa na Mmiliki' : 'Strict Owner Price Lock'}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {locale === 'sw'
                      ? 'Hakunaongezeko la dalali. Bei halisi ya mfumo.'
                      : 'Zero staff edits or broker markups. Cryptographic audit.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {locale === 'sw' ? '100% Ushuru wa TRA Halali' : '100% TRA Duty Cleared'}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {locale === 'sw'
                      ? 'Nyaraka kamili za TANSAD, TBS & kadi mpya.'
                      : 'Verified TANSAD declaration, JAAI/TBS & clean plate.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {locale === 'sw' ? 'Uhamisho wa Bure (Saa 2)' : '2-Hr Inter-Branch Transfer'}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {locale === 'sw'
                      ? 'Tunahamisha gari kati ya Mwenge na Mikocheni bure.'
                      : 'Free viewing transfer between Mwenge & Mikocheni.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showroom Visual Silhouette Card */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/90 to-[#070B14] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.75)]">
              <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=85"
                  alt="Bingwa Cars Flagship Toyota Land Cruiser Prado TX-L in Dar es Salaam Showroom"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/30 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {locale === 'sw' ? 'IPO MIKOCHENI SHOWROOM' : 'IN STOCK • MIKOCHENI'}
                  </span>
                  <span className="rounded-full bg-amber-500 px-3 py-1 font-mono text-[11px] font-extrabold text-slate-950 shadow">
                    GRADE 4.5B JAPAN
                  </span>
                </div>

                {/* Bottom Overlay Vehicle Spotlight */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                        2021 TOYOTA LAND CRUISER PRADO TX-L (2.8L DIESEL)
                      </p>
                      <h2 className="text-base font-extrabold text-white">
                        {formatTZS(145000000)}
                      </h2>
                    </div>
                    <a
                      href="#showroom-3d"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      <span>{locale === 'sw' ? 'Kagua 360°' : 'Inspect 360°'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Glassmorphism Quick-Search & Filter Matrix Card */}
        <div className="mt-10 rounded-3xl border border-white/15 bg-slate-900/75 p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white sm:text-base">
                  {locale === 'sw'
                    ? 'Chuja Magari kwa Haraka (Quick-Search & Branch Matrix)'
                    : 'Direct Inventory Quick-Search & Filter Matrix'}
                </h2>
                <p className="text-xs text-slate-400">
                  {locale === 'sw'
                    ? 'Bei zote zinaonyeshwa kwa Shilingi ya Tanzania (TZS) zikiwa zimejumuisha ushuru wa TRA'
                    : 'All prices displayed strictly in Tanzanian Shillings (TZS) inclusive of TRA customs duty'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{locale === 'sw' ? 'Safisha Vichujio' : 'Reset Filters'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* 1. Brand / Make Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {locale === 'sw' ? '1. Kampuni / Make' : '1. Brand / Make'}
              </label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#090D18] px-3.5 py-2.5 text-sm font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                {MAKES.map((make) => (
                  <option key={make} value={make}>
                    {make === 'ALL'
                      ? locale === 'sw'
                        ? 'Kampuni Zote (All Makes)'
                        : 'All Makes & Brands'
                      : make}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Body Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {locale === 'sw' ? '2. Muundo wa Bodi' : '2. Body Type'}
              </label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value as BodyType)}
                className="w-full rounded-xl border border-white/15 bg-[#090D18] px-3.5 py-2.5 text-sm font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                {BODY_TYPES.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {locale === 'sw' ? bt.labelSw : bt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Branch / Import Location Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {locale === 'sw' ? '3. Tawi / Yard Dar es Salaam' : '3. Branch / Import Source'}
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as BranchId)}
                className="w-full rounded-xl border border-white/15 bg-[#090D18] px-3.5 py-2.5 text-sm font-medium text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="all">
                  {locale === 'sw' ? 'Matawi Yote (Mwenge & Mikocheni)' : 'All Branches (DSM)'}
                </option>
                <option value="mwenge">
                  {locale === 'sw' ? 'Mwenge Central Yard' : 'Mwenge Central Yard'}
                </option>
                <option value="mikocheni">
                  {locale === 'sw' ? 'Mikocheni Showroom' : 'Mikocheni Showroom'}
                </option>
                <option value="transit">
                  {locale === 'sw' ? 'Direct Japan / Bandari (In-Transit)' : 'Direct Japan Import / Port'}
                </option>
              </select>
            </div>

            {/* 4. Price Range Slider in TZS (15M - 250M+) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  {locale === 'sw' ? '4. Kiwango cha Bei (TZS)' : '4. Max Budget (TZS)'}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {maxPriceMillions >= 250
                    ? 'TZS 250M+'
                    : `≤ TZS ${maxPriceMillions},000,000`}
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={250}
                step={5}
                value={maxPriceMillions}
                onChange={(e) => setMaxPriceMillions(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>TZS 15M</span>
                <span>TZS 120M</span>
                <span>TZS 250M+</span>
              </div>
            </div>

            {/* 5. Direct Action CTA Button with Live Count Match Preview */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleScrollToInventory}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition cursor-pointer"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
                <span>
                  {locale === 'sw' ? 'Tafuta Gari' : 'Search Stock'} ({matchingCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

