'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  ShieldCheck,
  MapPin,
  Box,
  Ship,
  Menu,
  X,
  Lock,
  LayoutDashboard,
  ChevronDown,
  Globe,
  Sparkles,
  CheckCircle2,
  Building2,
  Compass,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { useBingwaStore } from '@/lib/store';
import { BranchId } from '@/lib/data';

interface BranchDetailOption {
  id: BranchId;
  labelSw: string;
  labelEn: string;
  shortSw: string;
  shortEn: string;
  subSw: string;
  subEn: string;
  badgeColor: string;
}

const BRANCH_OPTIONS: BranchDetailOption[] = [
  {
    id: 'all',
    labelSw: 'Matawi Yote (Dar es Salaam)',
    labelEn: 'All DSM Branches',
    shortSw: 'Matawi Yote (DSM)',
    shortEn: 'All DSM Yards',
    subSw: 'Mwenge + Mikocheni + Bandari',
    subEn: 'Combined inventory across all yards',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/15',
  },
  {
    id: 'mwenge',
    labelSw: 'Mwenge Central Yard',
    labelEn: 'Mwenge Central Yard',
    shortSw: 'Mwenge Central Yard',
    shortEn: 'Mwenge Central Yard',
    subSw: 'Barabara ya Morogoro, Dar es Salaam',
    subEn: 'Morogoro Road • High-Volume Utility & 4x4s',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/15',
  },
  {
    id: 'mikocheni',
    labelSw: 'Mikocheni Flagship Showroom',
    labelEn: 'Mikocheni Flagship Showroom',
    shortSw: 'Mikocheni Showroom',
    shortEn: 'Mikocheni Showroom',
    subSw: 'Barabara ya Bagamoyo, Dar es Salaam',
    subEn: 'Old Bagamoyo Rd • Executive & Diplomatic SUVs',
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/15',
  },
  {
    id: 'transit',
    labelSw: 'Bandari ya Dar / TRA Clearance',
    labelEn: 'Dar Port / TRA Customs Transit',
    shortSw: 'Bandari / TRA Transit',
    shortEn: 'Dar Port / TRA Transit',
    subSw: 'Magari yanayokamilisha ushuru wa TRA',
    subEn: 'Incoming vessels & active TRA TANSAD clearance',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/15',
  },
];

type DropdownKey = 'catalog' | 'import' | 'showroom' | 'branches' | 'admin' | null;

export default function Navbar() {
  const router = useRouter();
  const {
    locale,
    setLocale,
    selectedBranch,
    setSelectedBranch,
    vehicles,
  } = useBingwaStore();

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBranchObj =
    BRANCH_OPTIONS.find((b) => b.id === selectedBranch) || BRANCH_OPTIONS[0];

  const getBranchStockCount = (branchId: BranchId) =>
    vehicles.filter((v) => (branchId === 'all' ? true : v.branchId === branchId))
      .length;

  const liveStockCount = getBranchStockCount(selectedBranch);

  // When a user clicks any branch in the dropdown, update Active Yard state AND navigate directly to that branch page
  const handleSelectBranchAndRedirect = (branchId: BranchId) => {
    setSelectedBranch(branchId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (branchId === 'all') {
      router.push('/vehicles');
    } else {
      router.push(`/vehicles?branch=${branchId}`);
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === 'sw' ? 'en' : 'sw');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060911]/95 backdrop-blur-xl">
      {/* Top Enterprise Security & Single Active Yard Telemetry Bar */}
      <div className="border-b border-white/5 bg-black/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Left: Strict Owner-Locked Pricing Guarantee */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 whitespace-nowrap">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>
                {locale === 'sw'
                  ? 'Bei za Mmiliki Zimefungwa (Hakuna Dalali)'
                  : 'Strict Owner-Locked Pricing (Zero Broker Markup)'}
              </span>
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                {locale === 'sw'
                  ? '100% TRA TANSAD & Ukaguzi wa TBS'
                  : '100% TRA TANSAD & TBS Verified'}
              </span>
            </span>
          </div>

          {/* Right: Single Active Yard Readout (Displays the exact branch the user clicked) */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {locale === 'sw' ? 'TAWI LILILOCHAGULIWA:' : 'ACTIVE YARD:'}
            </span>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'branches' ? null : 'branches')
              }
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
              title={
                locale === 'sw'
                  ? 'Bonyeza kubadili tawi'
                  : 'Click to switch active branch'
              }
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {locale === 'sw'
                  ? activeBranchObj.shortSw
                  : activeBranchObj.shortEn}
              </span>
              <span className="rounded bg-black/50 px-1.5 py-0.2 font-mono text-[10px] text-emerald-300">
                {liveStockCount}
              </span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Executive Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: Brand Logo (Clean Single-Line Alignment) */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-slate-900 to-emerald-500/20 shadow-[0_0_20px_rgba(245,158,11,0.18)] transition-transform group-hover:scale-105">
            <Car className="h-5 w-5 text-amber-400" />
            <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg font-black tracking-tight text-white">
                BINGWA <span className="text-amber-400">CARS</span>
              </span>
              <span className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-300">
                DSM • TZ
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
              {locale === 'sw'
                ? activeBranchObj.shortSw
                : activeBranchObj.shortEn}
            </span>
          </div>
        </Link>

        {/* Center: Hover & Click Dropdown Menu Buttons */}
        <nav
          onMouseLeave={() => setOpenDropdown(null)}
          className="hidden lg:flex items-center gap-1.5"
        >
          {/* 1. VEHICLE CATALOG DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('catalog')}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'catalog' ? null : 'catalog')
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                openDropdown === 'catalog'
                  ? 'bg-white/10 text-amber-400'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Car className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {locale === 'sw' ? 'Katalogi ya Magari' : 'Vehicle Catalog'}
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 font-mono text-[10px] font-bold text-emerald-300">
                {liveStockCount}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'catalog' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {openDropdown === 'catalog' && (
              <div className="absolute left-0 top-full pt-2 w-80 z-50">
                <div className="rounded-2xl border border-white/15 bg-[#0B101D]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'sw'
                      ? 'Chuja Magari kwa Aina'
                      : 'Browse Verified Inventory'}
                  </div>
                  <Link
                    href="/vehicles"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white hover:bg-amber-500/15 hover:text-amber-300 transition"
                  >
                    <div>
                      <div>
                        {locale === 'sw'
                          ? 'Magari Yote Yaliyothibitishwa'
                          : 'All Verified Inventory'}
                      </div>
                      <div className="text-[11px] font-normal text-slate-400">
                        {locale === 'sw'
                          ? 'Chuja kwa bei, mwaka, na tawi'
                          : 'Full filter matrix & TZS price brackets'}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </Link>
                  <Link
                    href="/vehicles?make=Toyota"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? 'Toyota 4x4 & Land Cruiser'
                        : 'Toyota 4x4 & Land Cruisers'}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      JAPAN
                    </span>
                  </Link>
                  <Link
                    href="/vehicles?fuel=Hybrid"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? 'Magari ya Hybrid (Yanayookoa Mafuta)'
                        : 'Hybrid & Fuel-Saving Models'}
                    </span>
                    <span className="font-mono text-[10px] text-sky-400">
                      ECO
                    </span>
                  </Link>
                  <Link
                    href="/vehicles?bracket=OVER_100M"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? 'Magari ya Kifahari (VIP / Executive)'
                        : 'Executive & Luxury Flagships'}
                    </span>
                    <span className="font-mono text-[10px] text-amber-400">
                      VIP
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 2. CUSTOM IMPORT DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('import')}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'import' ? null : 'import')
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                openDropdown === 'import'
                  ? 'bg-white/10 text-amber-400'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Ship className="h-3.5 w-3.5 text-sky-400" />
              <span>
                {locale === 'sw' ? 'Agiza Gari' : 'Custom Import'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'import' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {openDropdown === 'import' && (
              <div className="absolute left-0 top-full pt-2 w-80 z-50">
                <div className="rounded-2xl border border-white/15 bg-[#0B101D]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'sw'
                      ? 'Huduma za Kuagiza Nje & TRA'
                      : 'Direct Foreign Import & TRA Pipeline'}
                  </div>
                  <Link
                    href="/import-request"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white hover:bg-sky-500/15 hover:text-sky-300 transition"
                  >
                    <div>
                      <div>
                        {locale === 'sw'
                          ? 'Fomu ya Kuagiza Gari (Japan/UK/UAE)'
                          : '4-Step Custom Import Wizard'}
                      </div>
                      <div className="text-[11px] font-normal text-slate-400">
                        {locale === 'sw'
                          ? 'Kokotoa CIF + Ushuru wa TRA papo hapo'
                          : 'Live CIF + TRA customs duty calculator'}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-sky-400" />
                  </Link>
                  <Link
                    href="/#customs-tracker"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? 'Fuatilia Kontena / Meli Bandari ya Dar'
                        : 'Track Shipment & TRA TANSAD Stage'}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      LIVE
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. 3D SHOWROOM DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('showroom')}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'showroom' ? null : 'showroom')
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                openDropdown === 'showroom'
                  ? 'bg-white/10 text-amber-400'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5 text-amber-400" />
              <span>3D Showroom</span>
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                360°
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'showroom' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {openDropdown === 'showroom' && (
              <div className="absolute left-0 top-full pt-2 w-80 z-50">
                <div className="rounded-2xl border border-white/15 bg-[#0B101D]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'sw'
                      ? 'Ukaguzi wa Kisasa wa Picha Halisi & 360°'
                      : 'Interactive Studio & Multi-Zone Inspection'}
                  </div>
                  <Link
                    href="/#showroom-3d"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white hover:bg-amber-500/15 hover:text-amber-300 transition"
                  >
                    <div>
                      <div>
                        {locale === 'sw'
                          ? '360° Studio & Kubadili Rangi'
                          : '360° Interactive Studio & Paint Preview'}
                      </div>
                      <div className="text-[11px] font-normal text-slate-400">
                        {locale === 'sw'
                          ? 'Kagua bodi, vyeti vya TBS, na bei iliyofungwa'
                          : 'Inspect real angles, TBS pass & locked price'}
                      </div>
                    </div>
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </Link>
                  <Link
                    href="/vehicles/GDJ150W-0194882"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? 'Ukaguzi wa Sehemu 5 (Ndani, Injini, Buti)'
                        : '5-Zone Cockpit, Engine Bay & Boot Inspector'}
                    </span>
                    <Compass className="h-3.5 w-3.5 text-emerald-400" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. BRANCHES DROPDOWN (Select branch -> Updates Active Yard + Redirects to exact branch page) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('branches')}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'branches' ? null : 'branches')
              }
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                openDropdown === 'branches'
                  ? 'bg-white/10 text-amber-400'
                  : 'text-slate-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>{locale === 'sw' ? 'Matawi Yetu' : 'Branches'}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'branches' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {openDropdown === 'branches' && (
              <div className="absolute right-0 top-full pt-2 w-96 z-50">
                <div className="rounded-2xl border border-white/15 bg-[#0B101D]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5">
                  <div className="flex items-center justify-between px-2.5 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {locale === 'sw'
                        ? 'Chagua Tawi Ufungue Magari Yake'
                        : 'Select Branch to Open Its Inventory'}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      DAR ES SALAAM
                    </span>
                  </div>

                  {BRANCH_OPTIONS.map((b) => {
                    const isSelected = selectedBranch === b.id;
                    const count = getBranchStockCount(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBranchAndRedirect(b.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-amber-500/50 bg-amber-500/15 text-white'
                            : 'border-transparent hover:border-white/10 hover:bg-white/5 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Building2
                            className={`h-4 w-4 mt-0.5 shrink-0 ${
                              isSelected ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <span>
                                {locale === 'sw' ? b.labelSw : b.labelEn}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {locale === 'sw' ? b.subSw : b.subEn}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`rounded-lg border px-2 py-0.5 font-mono text-[10px] font-bold ${b.badgeColor}`}
                        >
                          {count} {locale === 'sw' ? 'Magari' : 'Cars'}
                        </span>
                      </button>
                    );
                  })}

                  <div className="border-t border-white/10 pt-2 mt-1 space-y-1">
                    <Link
                      href="/contact"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition"
                    >
                      <span>
                        {locale === 'sw'
                          ? 'Namba za Mawasiliano & Ofisi (/contact)'
                          : 'Branch Contact Numbers & Directory'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/#branches"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition"
                    >
                      <span>
                        {locale === 'sw'
                          ? 'Ramani ya GPS & Mawasiliano ya Matawi'
                          : 'View GPS Map & Branch Directions'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. EXECUTIVE PORTAL DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('admin')}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === 'admin' ? null : 'admin')
              }
              className={`inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 whitespace-nowrap hover:bg-amber-500/20 transition cursor-pointer`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>
                {locale === 'sw' ? 'Executive Portal' : 'Executive Portal'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  openDropdown === 'admin' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'admin' && (
              <div className="absolute right-0 top-full pt-2 w-80 z-50">
                <div className="rounded-2xl border border-white/15 bg-[#0B101D]/95 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {locale === 'sw'
                      ? 'Mifumo ya Utawala na Mmiliki'
                      : 'Enterprise Governance & Owner Controls'}
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-white hover:bg-amber-500/15 hover:text-amber-300 transition"
                  >
                    <div>
                      <div>
                        {locale === 'sw'
                          ? 'Dashibodi Kuu & Kufunga Bei'
                          : 'Owner Price Lock & Audit Console'}
                      </div>
                      <div className="text-[11px] font-normal text-slate-400">
                        {locale === 'sw'
                          ? 'SHA-256 Price Audit & Uhamisho wa Magari'
                          : 'SHA-256 price ledger & branch transfers'}
                      </div>
                    </div>
                    <Lock className="h-4 w-4 text-amber-400" />
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setOpenDropdown(null)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>
                      {locale === 'sw'
                        ? '72h Escrow, Proforma & QR Gate Pass'
                        : '72h Escrow, Proforma & QR Gate Pass'}
                    </span>
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Single Professional Language Icon Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Single Professional Language Switcher Icon Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={
              locale === 'sw'
                ? 'Badili Lugha kwenda Kiingereza (Switch to English)'
                : 'Switch Language to Swahili (Badili kwenda Kiswahili)'
            }
            aria-label="Toggle Language Swahili / English"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-500/50 hover:text-amber-300 transition cursor-pointer whitespace-nowrap"
          >
            <Globe className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-12" />
            <span className="font-mono uppercase tracking-wider">
              {locale === 'sw' ? 'SW' : 'EN'}
            </span>
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-slate-200 lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0A0E19] px-4 py-5 lg:hidden space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {locale === 'sw'
                ? 'Chagua Tawi (Itakupeleka Kwenye Magari ya Tawi Hilo):'
                : 'Select Branch (Redirects to Branch Inventory):'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {BRANCH_OPTIONS.map((b) => {
                const active = selectedBranch === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBranchAndRedirect(b.id)}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition ${
                      active
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    <span>{locale === 'sw' ? b.labelSw : b.labelEn}</span>
                    <span className="font-mono text-[11px] text-emerald-400">
                      {getBranchStockCount(b.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm font-semibold text-slate-200 pt-2 border-t border-white/10">
            <Link
              href="/vehicles"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span>
                {locale === 'sw'
                  ? 'Katalogi ya Magari (/vehicles)'
                  : 'Vehicle Catalog (/vehicles)'}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300">
                {liveStockCount}
              </span>
            </Link>
            <Link
              href="/import-request"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span>
                {locale === 'sw'
                  ? 'Agiza Gari Japan/UK (/import-request)'
                  : 'Custom Import Wizard'}
              </span>
              <span className="text-xs text-sky-400">WIZARD</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-300"
            >
              <span>
                {locale === 'sw'
                  ? 'Dashibodi ya Mmiliki (/admin)'
                  : 'Executive Admin Portal'}
              </span>
              <span className="text-xs font-mono">RBAC</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
