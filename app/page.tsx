'use client';

import React, { useMemo } from 'react';
import {
  Lock,
  ShieldCheck,
  Award,
  ArrowRightLeft,
  Car,
  PhoneCall,
  MapPin,
  Clock,
  FileCheck2,
  X,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import StartupLoader from '@/components/StartupLoader';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import BrandCarousel from '@/components/BrandCarousel';
import Vehicle360Viewer from '@/components/Vehicle360Viewer';
import InventoryCard from '@/components/InventoryCard';
import CustomsTrackerWidget from '@/components/CustomsTrackerWidget';
import BranchLocator from '@/components/BranchLocator';
import { useBingwaStore } from '@/lib/store';
import { BranchId, formatTZS } from '@/lib/data';

export default function BingwaHomePage() {
  const {
    locale,
    vehicles,
    selectedBranch,
    setSelectedBranch,
    selectedMake,
    selectedBodyType,
    maxPriceMillions,
    resetFilters,
    selectedVehicleModal,
    setSelectedVehicleModal,
  } = useBingwaStore();

  // Filter inventory by Branch, Make, BodyType, and Price Ceiling
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
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
    });
  }, [vehicles, selectedBranch, selectedMake, selectedBodyType, maxPriceMillions]);

  const branchTabs: { id: BranchId; labelSw: string; labelEn: string }[] = [
    { id: 'all', labelSw: 'Matawi Yote (6)', labelEn: 'All Branches (6)' },
    { id: 'mwenge', labelSw: 'Mwenge Central Yard', labelEn: 'Mwenge Central Yard' },
    { id: 'mikocheni', labelSw: 'Mikocheni Showroom', labelEn: 'Mikocheni Showroom' },
    { id: 'transit', labelSw: 'Bandari / In-Transit', labelEn: 'Port / In-Transit' },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      {/* Phase 1.1: Startup Odometer Preloader */}
      <StartupLoader />

      {/* Phase 1.2: Global Sticky Navbar & Dynamic Locale/Branch Switcher */}
      <Navbar />

      <main>
        {/* Phase 2.1: Hero Section: Luxury Showroom & Direct Quick Search */}
        <HeroSearch />

        {/* Phase 2.2: Infinite Flow-Motion Brand Carousel */}
        <BrandCarousel />

        {/* Phase 2.4: Featured Yard Inventory (Owner Price Locked Showcase) */}
        <section
          id="inventory"
          className="relative border-b border-white/10 bg-[#060913] py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Inventory Header & Branch Isolation Filter Tabs */}
            <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase">
                  <Lock className="h-3.5 w-3.5" />
                  <span>STRICT OWNER-LOCKED PRICE INVENTORY • ZERO BROKER MARKUP</span>
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
                  {locale === 'sw'
                    ? 'Magari Yaliyopo Yard Tayari Kuondoka (Dar es Salaam)'
                    : 'Featured Yard Inventory (Owner Price Locked Showcase)'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                  {locale === 'sw'
                    ? 'Kila gari lina bei rasmi iliyofungwa na Mkurugenzi Mtendaji kwenye mfumo wetu wa PostgreSQL ikiwa na sahihi ya SHA-256 na nyaraka halisi za TRA TANSAD.'
                    : 'Every vehicle is strictly isolated by branch and carries an immutable owner-locked TZS price with full SHA-256 audit verification and TRA TANSAD clearance.'}
                </p>
              </div>

              {/* Branch Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-1.5">
                {branchTabs.map((tab) => {
                  const active = selectedBranch === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedBranch(tab.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                        active
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {locale === 'sw' ? tab.labelSw : tab.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filter Summary Bar if any filter is applied */}
            {(selectedMake !== 'ALL' ||
              selectedBodyType !== 'ALL' ||
              selectedBranch !== 'all' ||
              maxPriceMillions < 250) && (
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-amber-200">
                  <span className="font-bold">
                    {locale === 'sw' ? 'Vichujio Vinavyofanya Kazi:' : 'Active Filters:'}
                  </span>
                  {selectedBranch !== 'all' && (
                    <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono">
                      Branch: {selectedBranch.toUpperCase()}
                    </span>
                  )}
                  {selectedMake !== 'ALL' && (
                    <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono">
                      Make: {selectedMake}
                    </span>
                  )}
                  {selectedBodyType !== 'ALL' && (
                    <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono">
                      Body: {selectedBodyType}
                    </span>
                  )}
                  {maxPriceMillions < 250 && (
                    <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono">
                      Max: TZS {maxPriceMillions}M
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{locale === 'sw' ? 'Onyesha Magari Yote' : 'Reset All Filters'}</span>
                </button>
              </div>
            )}

            {/* Vehicle Grid (3 columns on large screens) */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle) => (
                  <InventoryCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-12 text-center">
                <Car className="mx-auto h-12 w-12 text-amber-400 opacity-80" />
                <h3 className="mt-4 text-lg font-bold text-white">
                  {locale === 'sw'
                    ? 'Hakuna gari lililopatikana kwa vichujio hivi kwa sasa'
                    : 'No vehicles match the selected filter combination'}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {locale === 'sw'
                    ? 'Badilisha tawi au kiwango cha bei kuona magari yote yaliyopo Mwenge na Mikocheni.'
                    : 'Adjust your branch or budget filter to view all verified units at Mwenge and Mikocheni.'}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{locale === 'sw' ? 'Safisha Vichujio' : 'Reset Filters'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Phase 2.3: Interactive 3D / 360° Hero Showcase Component */}
        <Vehicle360Viewer />

        {/* Phase 2.5: Foreign Custom Import & TRA Customs Clearance Tracker Widget */}
        <CustomsTrackerWidget />

        {/* Phase 2.6: Interactive Branch Locator ("Nielekeze Ofisini") */}
        <BranchLocator />

        {/* Phase 2.7: Trust, Legitimacy & Inspection Guarantee Section (4-Pillar Tanzanian Market Layout) */}
        <section
          id="trust-pillars"
          className="relative border-b border-white/10 bg-[#070B14] py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>NGUZO 4 ZA UAMINIFU • TANZANIA AUTOMOTIVE STANDARD</span>
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
                {locale === 'sw'
                  ? 'Kwa Nini Wateja wa Dar es Salaam Wanaiamini Bingwa Cars?'
                  : 'Trust, Legitimacy & Verified Inspection Guarantee'}
              </h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                {locale === 'sw'
                  ? 'Tumeondoa kabisa changamoto za madalali, kodi zilizofichika, na kilomita zilizochezewa.'
                  : 'Engineered specifically for the Tanzanian automotive market with cryptographic price integrity and full TRA/TBS compliance.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Pillar 1: Strict Owner Price Lock */}
              <div className="rounded-3xl border border-white/10 bg-[#090E1A] p-6 transition hover:border-amber-500/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block font-mono text-[11px] font-bold text-amber-400">
                  PILLAR 01 // ZERO MARKUP
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-white">
                  {locale === 'sw'
                    ? 'Strict Owner Price Lock'
                    : 'Strict Owner Price Lock'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {locale === 'sw'
                    ? 'Hakuna ongezeko la dalali wala gharama zilizofichika za showroom. Bei unayoiona hapa ndiyo bei ya mwisho iliyopangwa na kufungwa na Mmiliki.'
                    : 'No broker markups, no hidden showroom fees. The price you see is the absolute final price set and cryptographically locked by the executive owner.'}
                </p>
              </div>

              {/* Pillar 2: 100% TRA Verified & Tax Legitimate */}
              <div className="rounded-3xl border border-white/10 bg-[#090E1A] p-6 transition hover:border-emerald-500/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block font-mono text-[11px] font-bold text-emerald-400">
                  PILLAR 02 // TRA TANSAD
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-white">
                  {locale === 'sw'
                    ? '100% TRA Verified & Tax Legitimate'
                    : '100% TRA Verified & Tax Legitimate'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {locale === 'sw'
                    ? 'Nyaraka zote za uagizaji ziko wazi: fomu halisi ya TRA Single Customs Declaration (TANSAD), risiti za ushuru, na usajili safi wa namba.'
                    : 'Transparent importation documents, original TRA Single Customs Declaration (TANSAD), and clear registration plates.'}
                </p>
              </div>

              {/* Pillar 3: TBS Certified & Japanese Auction Verification */}
              <div className="rounded-3xl border border-white/10 bg-[#090E1A] p-6 transition hover:border-sky-500/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
                  <Award className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block font-mono text-[11px] font-bold text-sky-400">
                  PILLAR 03 // TBS & JAAI GRADE 4.0+
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-white">
                  {locale === 'sw'
                    ? 'TBS Certified & Auction Sheet Halisi'
                    : 'TBS Certified & Auction Verification'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {locale === 'sw'
                    ? 'Kila gari lina cheti kamili cha ukaguzi wa TBS na karatasi halisi ya mnada wa Japan (Grade 4.0+) pamoja na uhakika wa kilomita zisizorudishwa nyuma.'
                    : 'Complete inspection sheet (Grade 4.0+) guaranteed with original verified odometer readings and TBS roadworthiness certification.'}
                </p>
              </div>

              {/* Pillar 4: Inter-Branch Free Viewing Transfer */}
              <div className="rounded-3xl border border-white/10 bg-[#090E1A] p-6 transition hover:border-purple-500/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                  <ArrowRightLeft className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block font-mono text-[11px] font-bold text-purple-400">
                  PILLAR 04 // 2-HR TRANSFER
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-white">
                  {locale === 'sw'
                    ? 'Uhamisho wa Bure Kati ya Matawi'
                    : 'Inter-Branch Free Viewing Transfer'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {locale === 'sw'
                    ? 'Unapenda gari lililopo Mwenge Yard lakini upo karibu na Mikocheni Showroom? Tunalihamisha ndani ya saa 2 bure ili ulikague kwa ukaribu.'
                    : 'Want a car located at Mwenge brought to Mikocheni for inspection? We move it within 2 hours at zero cost to you.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Phase 2.8: Comprehensive Automotive Footer */}
      <footer className="bg-[#04060C] pt-16 pb-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Column 1: Brand Narrative */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-400">
                  <Car className="h-5 w-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  BINGWA <span className="text-amber-400">CARS</span> LIMITED
                </span>
              </div>

              <p className="text-sm leading-relaxed text-slate-400 max-w-md">
                {locale === 'sw'
                  ? 'Jukwaa kuu la uuzaji wa magari yaliyohakikiwa na uagizaji wa magari kutoka Japan, UK na Ujerumani jijini Dar es Salaam. Bei zote zimefungwa na mmiliki kwa Shilingi ya Tanzania (TZS).'
                  : "Dar es Salaam's premier multi-branch dealership and foreign vehicle importation platform. Operating Mwenge Central Yard and Mikocheni Flagship Showroom with strict owner-locked pricing."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-emerald-400">
                <span>TIN: 142-889-301</span>
                <span>•</span>
                <span>BRELA REG: 1589204</span>
                <span>•</span>
                <span>TRA AUTHORIZED IMPORTER</span>
              </div>
            </div>

            {/* Column 2: Quick Catalog Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {locale === 'sw' ? 'Katalogi ya Magari' : 'Quick Catalog'}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#inventory" className="hover:text-amber-400 transition">
                    Toyota Land Cruiser 300 & Prado TX-L
                  </a>
                </li>
                <li>
                  <a href="#inventory" className="hover:text-amber-400 transition">
                    Toyota Hilux Revo Rocco 4x4 Pickups
                  </a>
                </li>
                <li>
                  <a href="#inventory" className="hover:text-amber-400 transition">
                    Land Rover Defender 110 & Range Rover
                  </a>
                </li>
                <li>
                  <a href="#inventory" className="hover:text-amber-400 transition">
                    Mercedes-Benz GLE & AMG Executive
                  </a>
                </li>
                <li>
                  <a href="#inventory" className="hover:text-amber-400 transition">
                    Subaru Forester EyeSight & Harrier Hybrid
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: TRA Import Guide & Verification Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {locale === 'sw' ? 'Mwongozo wa TRA & Forodha' : 'TRA & Import Guides'}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#custom-import" className="hover:text-amber-400 transition">
                    {locale === 'sw'
                      ? 'Fuatilia Meli & TANSAD (Live Tracker)'
                      : 'Live Ro-Ro Vessel & TANSAD Tracker'}
                  </a>
                </li>
                <li>
                  <a href="#trust-pillars" className="hover:text-amber-400 transition">
                    {locale === 'sw'
                      ? 'Ukaguzi wa TBS & JAAI (Japan)'
                      : 'TBS & JAAI Pre-Shipment Inspection'}
                  </a>
                </li>
                <li>
                  <a href="#trust-pillars" className="hover:text-amber-400 transition">
                    {locale === 'sw'
                      ? 'Sera ya Bei Iliyofungwa na Mmiliki'
                      : 'Cryptographic Owner Price-Lock Policy'}
                  </a>
                </li>
                <li>
                  <a href="#showroom-3d" className="hover:text-amber-400 transition">
                    {locale === 'sw'
                      ? 'Ukaguzi wa 360° WebGL Showroom'
                      : '360° Interactive WebGL Inspection'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Dar es Salaam Physical Addresses & Active Working Hours */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {locale === 'sw' ? 'Anwani & Muda wa Kazi' : 'DSM Branches & Hours'}
              </h3>
              <div className="space-y-2.5 text-xs">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Mwenge Yard:</strong> Morogoro Rd / Sam Nujoma Jct (Mon–Sat 8:00 AM – 6:30 PM)
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Mikocheni Showroom:</strong> Old Bagamoyo Rd (Mon–Sun 8:30 AM – 7:00 PM)
                  </span>
                </p>
                <p className="flex items-center gap-2 pt-1 text-emerald-400 font-mono font-bold">
                  <PhoneCall className="h-4 w-4" />
                  <span>+255 754 889 900 / +255 767 224 400</span>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>Dar es Salaam EAT (UTC+3)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>
              © 2026 Bingwa Cars Limited. All Rights Reserved. Built for Dar es Salaam, Tanzania.
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <FileCheck2 className="h-3.5 w-3.5" />
                Currency: Strictly Tanzanian Shillings (TZS)
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Vehicle Detail & Cryptographic Owner Price-Lock Audit Modal */}
      {selectedVehicleModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#090E1A] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedVehicleModal(null)}
              aria-label="Close modal"
              className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/5 p-2 text-slate-300 hover:bg-white/15 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-400">
              <span>{selectedVehicleModal.year} MODEL</span>
              <span>•</span>
              <span>
                {locale === 'sw'
                  ? selectedVehicleModal.branchLabel.sw
                  : selectedVehicleModal.branchLabel.en}
              </span>
              <span>•</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                {selectedVehicleModal.auctionGrade}
              </span>
            </div>

            <h3 className="mt-2 text-2xl font-black text-white">
              {selectedVehicleModal.title}
            </h3>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {selectedVehicleModal.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${selectedVehicleModal.title} view ${i + 1}`}
                  className="h-32 w-full rounded-2xl object-cover border border-white/10"
                />
              ))}
            </div>

            {/* Cryptographic Owner Price Lock Ledger Box */}
            <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Lock className="h-4 w-4" />
                    {locale === 'sw'
                      ? 'BEI YA MMILIKI ILIYOFUNGWA (SHA-256 AUDIT LOG)'
                      : 'OWNER-LOCKED PRICE (SHA-256 CRYPTOGRAPHIC AUDIT)'}
                  </span>
                  <div className="mt-1 text-3xl font-black text-white">
                    {formatTZS(selectedVehicleModal.priceTzs)}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-300">
                  <div>Locked By: {selectedVehicleModal.priceAudit.lockedBy}</div>
                  <div>Timestamp: {selectedVehicleModal.priceAudit.verifiedAt}</div>
                  <div className="text-emerald-400">
                    TANSAD: {selectedVehicleModal.priceAudit.tansadRef}
                  </div>
                  <div className="text-slate-400">
                    {selectedVehicleModal.priceAudit.hash}
                  </div>
                </div>
              </div>
            </div>

            {/* JSONB Technical Specifications */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">Engine Code</span>
                <strong className="text-white font-mono">
                  {selectedVehicleModal.specsJsonb.engineCode} ({selectedVehicleModal.engineSpec})
                </strong>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">Verified Odometer</span>
                <strong className="text-white font-mono">
                  {selectedVehicleModal.mileageKm.toLocaleString()} KM
                </strong>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">TBS Certificate</span>
                <strong className="text-emerald-400 font-mono">
                  {selectedVehicleModal.specsJsonb.tbsCertificateNo}
                </strong>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">Chassis Prefix</span>
                <strong className="text-white font-mono">
                  {selectedVehicleModal.specsJsonb.chassisPrefix}XXXX
                </strong>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">Origin Country</span>
                <strong className="text-white">
                  {selectedVehicleModal.specsJsonb.originCountry} ({selectedVehicleModal.specsJsonb.seats} Seats)
                </strong>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-slate-400 block">Drivetrain</span>
                <strong className="text-white">
                  {selectedVehicleModal.driveTrain} • {selectedVehicleModal.transmission}
                </strong>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {locale === 'sw' ? 'Vifaa & Teknolojia ya Gari:' : 'Verified Factory Features:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedVehicleModal.specsJsonb.features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
              <a
                href="#showroom-3d"
                onClick={() => setSelectedVehicleModal(null)}
                className="rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition"
              >
                {locale === 'sw' ? 'Kagua Kwenye 3D Showroom' : 'Open in 3D Showroom'}
              </a>
              <a
                href={`https://wa.me/255754889900?text=${encodeURIComponent(
                  `Habari Bingwa Cars, nimeangalia maelezo ya ${selectedVehicleModal.title} (${formatTZS(
                    selectedVehicleModal.priceTzs
                  )}). Naomba kuweka miadi ya Test Drive.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition"
              >
                {locale === 'sw'
                  ? 'Weka Oda / Omba Test Drive (WhatsApp)'
                  : 'Reserve / Book Test Drive (WhatsApp)'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
