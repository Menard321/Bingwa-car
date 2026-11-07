'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Ship,
  Lock,
  ArrowUpDown,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import InventoryCard from '@/components/InventoryCard';
import { useBingwaStore } from '@/lib/store';
import { BranchId, ImportSource } from '@/lib/data';
import { useTranslation } from '@/lib/i18n';

type SortOption =
  | 'date_desc'
  | 'price_asc'
  | 'price_desc'
  | 'year_desc'
  | 'mileage_asc';

type PriceBracket = 'ALL' | 'UNDER_25M' | '25M_50M' | '50M_100M' | 'OVER_100M';

function CatalogMatrixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vehicles, locale, selectedBranch, setSelectedBranch } = useBingwaStore();
  const { t } = useTranslation();

  // Initialize state from URLSearchParams or global selectedBranch for shareable/bookmarkable search states
  const [branch, setBranch] = useState<BranchId>(
    (searchParams.get('branch') as BranchId) || selectedBranch || 'all'
  );
  const [make, setMake] = useState<string>(searchParams.get('make') || 'ALL');
  const [model, setModel] = useState<string>(searchParams.get('model') || 'ALL');
  const [priceBracket, setPriceBracket] = useState<PriceBracket>(
    (searchParams.get('bracket') as PriceBracket) || 'ALL'
  );
  const [maxPriceM, setMaxPriceM] = useState<number>(
    Number(searchParams.get('maxM')) || 250
  );
  const [minYear, setMinYear] = useState<string>(
    searchParams.get('year') || 'ALL'
  );
  const [fuelType, setFuelType] = useState<string>(
    searchParams.get('fuel') || 'ALL'
  );
  const [transmission, setTransmission] = useState<string>(
    searchParams.get('trans') || 'ALL'
  );
  const [driveTrain, setDriveTrain] = useState<string>(
    searchParams.get('drive') || 'ALL'
  );
  const [importSource, setImportSource] = useState<ImportSource>(
    (searchParams.get('source') as ImportSource) || 'ALL'
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'date_desc'
  );
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync local branch state when user selects a branch from the Navbar dropdown
  useEffect(() => {
    if (selectedBranch && selectedBranch !== branch) {
      setBranch(selectedBranch);
    }
  }, [selectedBranch]);

  // Sync URLSearchParams whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (branch !== 'all') params.set('branch', branch);
    if (make !== 'ALL') params.set('make', make);
    if (model !== 'ALL') params.set('model', model);
    if (priceBracket !== 'ALL') params.set('bracket', priceBracket);
    if (maxPriceM < 250) params.set('maxM', String(maxPriceM));
    if (minYear !== 'ALL') params.set('year', minYear);
    if (fuelType !== 'ALL') params.set('fuel', fuelType);
    if (transmission !== 'ALL') params.set('trans', transmission);
    if (driveTrain !== 'ALL') params.set('drive', driveTrain);
    if (importSource !== 'ALL') params.set('source', importSource);
    if (sortBy !== 'date_desc') params.set('sort', sortBy);

    const qs = params.toString();
    router.replace(qs ? `/vehicles?${qs}` : '/vehicles', { scroll: false });
  }, [
    branch,
    make,
    model,
    priceBracket,
    maxPriceM,
    minYear,
    fuelType,
    transmission,
    driveTrain,
    importSource,
    sortBy,
    router,
  ]);

  // Dynamic cascading Makes & Models
  const availableMakes = useMemo(() => {
    const setOfMakes = new Set(vehicles.map((v) => v.make));
    return ['ALL', ...Array.from(setOfMakes)];
  }, [vehicles]);

  const availableModelsForMake = useMemo(() => {
    const relevant =
      make === 'ALL' ? vehicles : vehicles.filter((v) => v.make === make);
    const setOfModels = new Set(relevant.map((v) => v.model));
    return ['ALL', ...Array.from(setOfModels)];
  }, [vehicles, make]);

  const handleMakeChange = (nextMake: string) => {
    setMake(nextMake);
    setModel('ALL'); // Reset cascading model on make change
  };

  const handleResetAll = () => {
    setBranch('all');
    setMake('ALL');
    setModel('ALL');
    setPriceBracket('ALL');
    setMaxPriceM(250);
    setMinYear('ALL');
    setFuelType('ALL');
    setTransmission('ALL');
    setDriveTrain('ALL');
    setImportSource('ALL');
    setSortBy('date_desc');
  };

  // Multi-faceted filtering & sorting pipeline
  const filteredAndSortedVehicles = useMemo(() => {
    const list = vehicles.filter((v) => {
      if (branch !== 'all' && v.branchId !== branch) return false;
      if (make !== 'ALL' && v.make !== make) return false;
      if (model !== 'ALL' && v.model !== model) return false;

      // Price bracket checks
      if (priceBracket === 'UNDER_25M' && v.priceTzs >= 25_000_000) return false;
      if (
        priceBracket === '25M_50M' &&
        (v.priceTzs < 25_000_000 || v.priceTzs > 50_000_000)
      )
        return false;
      if (
        priceBracket === '50M_100M' &&
        (v.priceTzs < 50_000_000 || v.priceTzs > 100_000_000)
      )
        return false;
      if (priceBracket === 'OVER_100M' && v.priceTzs <= 100_000_000) return false;

      // Slider max check
      if (v.priceTzs > maxPriceM * 1_000_000) return false;

      if (minYear !== 'ALL' && v.year < Number(minYear)) return false;
      if (fuelType !== 'ALL' && v.fuelType !== fuelType) return false;
      if (transmission !== 'ALL' && v.transmission !== transmission) return false;
      if (driveTrain !== 'ALL' && v.driveTrain !== driveTrain) return false;
      if (importSource !== 'ALL' && v.importSource !== importSource) return false;

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceTzs - b.priceTzs;
      if (sortBy === 'price_desc') return b.priceTzs - a.priceTzs;
      if (sortBy === 'year_desc') return b.year - a.year;
      if (sortBy === 'mileage_asc') return a.mileageKm - b.mileageKm;
      return b.dateAdded.localeCompare(a.dateAdded);
    });
  }, [
    vehicles,
    branch,
    make,
    model,
    priceBracket,
    maxPriceM,
    minYear,
    fuelType,
    transmission,
    driveTrain,
    importSource,
    sortBy,
  ]);

  const handleCopyShareableUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase">
            <Lock className="h-3.5 w-3.5" />
            <span>
              {locale === 'sw'
                ? 'KATALOGI KAMILI YA MAGARI • BEI ZA MMILIKI ZILIZOFUNGWA'
                : 'MULTI-BRANCH VEHICLE CATALOG • STRICT OWNER-LOCKED PRICING'}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {branch === 'mwenge'
              ? locale === 'sw'
                ? 'Magari ya Mwenge Central Yard (Morogoro Rd)'
                : 'Mwenge Central Yard Inventory (Morogoro Rd)'
              : branch === 'mikocheni'
              ? locale === 'sw'
                ? 'Magari ya Mikocheni Flagship Showroom (Bagamoyo Rd)'
                : 'Mikocheni Flagship Showroom Inventory (Bagamoyo Rd)'
              : branch === 'transit'
              ? locale === 'sw'
                ? 'Magari ya Bandari ya Dar / TRA Clearance'
                : 'Dar Port & TRA Customs Transit Inventory'
              : locale === 'sw'
              ? 'Chuja Magari Yaliyopo Mwenge, Mikocheni & Bandari'
              : 'All Dar es Salaam Branches Inventory & Filter Matrix'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {locale === 'sw'
              ? 'Kila matokeo ya utafutaji yanahifadhiwa kwenye URL ili uweze kumtumia mwenzako au kuhifadhi.'
              : 'Shareable URLSearchParams state with real-time cascading Make/Model and TZS bracket filters.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopyShareableUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-white transition cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'sw' ? 'Kiungo Kimenakiliwa!' : 'Search Link Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>{locale === 'sw' ? 'Shiriki Utafutaji Huu' : 'Share Filter State'}</span>
              </>
            )}
          </button>

          <Link
            href="/import-request"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow hover:brightness-110 transition"
          >
            <Ship className="h-4 w-4" />
            <span>{locale === 'sw' ? 'Agiza Gari Maalum' : 'Custom Import Request'}</span>
          </Link>
        </div>
      </div>

      {/* Main Layout: Left Faceted Filter Matrix (4 cols) + Right Results Grid (8 cols) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Faceted Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6 rounded-3xl border border-white/10 bg-[#080C17] p-5 h-fit">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Filter className="h-4 w-4 text-amber-400" />
              <span>{locale === 'sw' ? 'Vichujio vya Kina' : 'Faceted Filters'}</span>
            </div>
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{locale === 'sw' ? 'Safisha' : 'Reset'}</span>
            </button>
          </div>

          {/* 1. Branch Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              {locale === 'sw' ? '1. Tawi / Yard Dar es Salaam' : '1. Dar es Salaam Branch'}
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'all', sw: 'Yards Zote za Dar es Salaam', en: 'All Dar es Salaam Yards' },
                { id: 'mwenge', sw: 'Mwenge Yard (Morogoro Rd)', en: 'Mwenge Central Yard' },
                { id: 'mikocheni', sw: 'Mikocheni Flagship Showroom', en: 'Mikocheni Flagship' },
                { id: 'transit', sw: 'Bandari / In-Transit (TRA)', en: 'Port / In-Transit' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBranch(b.id as BranchId);
                    setSelectedBranch(b.id as BranchId);
                  }}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                    branch === b.id
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                      : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <span>{locale === 'sw' ? b.sw : b.en}</span>
                  {branch === b.id && <Check className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dynamic Cascading Make & Model */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-300">
                {locale === 'sw' ? '2. Kampuni (Make)' : '2. Vehicle Make'}
              </label>
              <select
                value={make}
                onChange={(e) => handleMakeChange(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#050811] px-3 py-2.5 text-xs font-semibold text-white"
              >
                {availableMakes.map((m) => (
                  <option key={m} value={m}>
                    {m === 'ALL'
                      ? locale === 'sw'
                        ? 'Kampuni Zote (All Makes)'
                        : 'All Makes'
                      : m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-300">
                {locale === 'sw' ? 'Muundo (Model)' : 'Cascading Model'}
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#050811] px-3 py-2.5 text-xs font-semibold text-white"
              >
                {availableModelsForMake.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod === 'ALL'
                      ? locale === 'sw'
                        ? 'Miundo Yote (All Models)'
                        : 'All Models'
                      : mod}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. TZS Price Brackets & Slider */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              {locale === 'sw' ? '3. Viwango vya Bei (TZS)' : '3. Price Brackets (TZS)'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'ALL', label: locale === 'sw' ? 'Bei Zote' : 'All Prices' },
                { id: 'UNDER_25M', label: '< TZS 25M' },
                { id: '25M_50M', label: '25M – 50M' },
                { id: '50M_100M', label: '50M – 100M' },
                { id: 'OVER_100M', label: '> TZS 100M' },
              ].map((br) => (
                <button
                  key={br.id}
                  type="button"
                  onClick={() => setPriceBracket(br.id as PriceBracket)}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-bold transition cursor-pointer ${
                    priceBracket === br.id
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {br.label}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">
                  {locale === 'sw' ? 'Kiwango cha Juu:' : 'Slider Cap:'}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  ≤ TZS {maxPriceM}M
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={maxPriceM}
                onChange={(e) => setMaxPriceM(Number(e.target.value))}
                className="mt-1.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
              />
            </div>
          </div>

          {/* 4. Technical Attributes: Year, Fuel, Transmission, DriveTrain, Import Source */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                {locale === 'sw' ? 'Mwaka wa Kutengenezwa (Min Year)' : 'Minimum Year'}
              </label>
              <select
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#050811] px-3 py-2 text-xs text-white"
              >
                <option value="ALL">{locale === 'sw' ? 'Miaka Yote' : 'Any Year'}</option>
                <option value="2022">2022+</option>
                <option value="2021">2021+</option>
                <option value="2020">2020+</option>
                <option value="2019">2019+</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  {locale === 'sw' ? 'Nishati (Fuel)' : 'Fuel Type'}
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#050811] px-2.5 py-2 text-xs text-white"
                >
                  <option value="ALL">All</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  {locale === 'sw' ? 'Gia' : 'Transmission'}
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#050811] px-2.5 py-2 text-xs text-white"
                >
                  <option value="ALL">All</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Drive Train
                </label>
                <select
                  value={driveTrain}
                  onChange={(e) => setDriveTrain(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#050811] px-2.5 py-2 text-xs text-white"
                >
                  <option value="ALL">All</option>
                  <option value="4WD / 4x4">4WD / 4x4</option>
                  <option value="AWD">AWD</option>
                  <option value="2WD">2WD</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  {locale === 'sw' ? 'Chanzo' : 'Import Source'}
                </label>
                <select
                  value={importSource}
                  onChange={(e) => setImportSource(e.target.value as ImportSource)}
                  className="w-full rounded-xl border border-white/15 bg-[#050811] px-2.5 py-2 text-xs text-white"
                >
                  <option value="ALL">All Sources</option>
                  <option value="Japan">Japan 🇯🇵</option>
                  <option value="UK">UK 🇬🇧</option>
                  <option value="Local Yard">Local Yard 🇹🇿</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Catalog Results & Dynamic Sorting */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#080C17] px-5 py-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
              <span>
                {locale === 'sw'
                  ? `Magari ${filteredAndSortedVehicles.length} Yamepatikana`
                  : `Showing ${filteredAndSortedVehicles.length} Verified Vehicles`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-amber-400" />
              <label className="text-xs font-semibold text-slate-400">
                {locale === 'sw' ? 'Panga kwa:' : 'Sort By:'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-white/15 bg-[#050811] px-3 py-1.5 text-xs font-bold text-white"
              >
                <option value="date_desc">
                  {locale === 'sw' ? 'Yaliyoina Hivi Karibuni (Date Added)' : 'Date Added (Newest)'}
                </option>
                <option value="price_asc">
                  {locale === 'sw' ? 'Bei: Chini kwenda Juu (Low to High)' : 'Price: Low to High'}
                </option>
                <option value="price_desc">
                  {locale === 'sw' ? 'Bei: Juu kwenda Chini (High to Low)' : 'Price: High to Low'}
                </option>
                <option value="year_desc">
                  {locale === 'sw' ? 'Mwaka: Mpya Zaidi (Newest First)' : 'Year: Newest First'}
                </option>
                <option value="mileage_asc">
                  {locale === 'sw' ? 'Kilomita: Chache Zaidi (Lowest KM)' : 'Mileage: Lowest First'}
                </option>
              </select>
            </div>
          </div>

          {/* Results Grid or Contextual Zero-State Fallback */}
          {filteredAndSortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredAndSortedVehicles.map((vehicle) => (
                <InventoryCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-[#080C17] to-[#080C17] p-8 sm:p-12 text-center space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                <Sparkles className="h-8 w-8" />
              </div>

              <h2 className="mx-auto max-w-xl text-xl font-black text-white sm:text-2xl">
                {t('catalog.zeroStateTitle')}
              </h2>

              <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-300 leading-relaxed">
                {locale === 'sw'
                  ? 'Timu yetu ya uagizaji inaweza kukutafutia gari hili moja kwa moja kwenye minada ya USS Tokyo (Japan) au Uingereza na kukufikishia Bandari ya Dar es Salaam ndani ya siku 21–30 kwa bei iliyofungwa.'
                  : 'Our direct importation desk sources Grade 4.5+ vehicles daily from USS Tokyo, Nagoya, and Southampton UK with full TRA TANSAD & TBS clearance.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={`/import-request?make=${encodeURIComponent(
                    make !== 'ALL' ? make : 'Toyota'
                  )}&model=${encodeURIComponent(model !== 'ALL' ? model : '')}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg hover:brightness-110 transition"
                >
                  <Ship className="h-4 w-4" />
                  <span>{t('catalog.zeroStateCta')}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>
                    {locale === 'sw' ? 'Onyesha Magari Yote Yaliyopo Yard' : 'Reset All Filters'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VehiclesCatalogPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      <Navbar />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-20 text-center font-mono text-sm text-amber-400">
            Loading Bingwa Cars Multi-Branch Catalog Matrix...
          </div>
        }
      >
        <CatalogMatrixContent />
      </Suspense>
    </div>
  );
}

