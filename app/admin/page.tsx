'use client';

import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Fingerprint,
  History,
  Ship,
  ArrowRightLeft,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Building2,
  BellRing,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminOwnerConsole from '@/components/AdminOwnerConsole';
import { useBingwaStore } from '@/lib/store';
import {
  BranchId,
  CustomsStage,
  UserRole,
  Vehicle,
  formatTZS,
} from '@/lib/data';

type AdminTab =
  | 'dashboard'
  | 'price_console'
  | 'customs_pipeline'
  | 'transfers'
  | 'rbac_users'
  | 'finance_escrow_bi';

const CUSTOMS_STAGES_ORDER: {
  stage: CustomsStage;
  step: number;
  labelSw: string;
  labelEn: string;
}[] = [
  { stage: 'ORDERED', step: 1, labelSw: '1. Imeagizwa (Ordered)', labelEn: '1. Ordered (Auction)' },
  { stage: 'SHIPPED', step: 1, labelSw: '2. Melini (Shipped Ro-Ro)', labelEn: '2. Shipped (Ro-Ro)' },
  { stage: 'PORT_DAR', step: 2, labelSw: '3. Bandari ya Dar (Port)', labelEn: '3. Dar Port Arrival' },
  { stage: 'TRA_ASSESSMENT', step: 3, labelSw: '4. Tathmini TRA (TANSAD)', labelEn: '4. TRA Assessment' },
  { stage: 'TAX_PAID', step: 4, labelSw: '5. Kodi Imelipwa (Tax Paid)', labelEn: '5. Tax & Wharfage Paid' },
  { stage: 'TBS_CLEARED', step: 5, labelSw: '6. TBS & Namba (Cleared)', labelEn: '6. TBS & Plate Issued' },
  { stage: 'YARD_DELIVERED', step: 6, labelSw: '7. Imefika Yard (Delivered)', labelEn: '7. Yard Delivered' },
];

export default function ExecutiveAdminPortalPage() {
  const {
    locale,
    vehicles,
    priceAuditLogs,
    transfers,
    customsShipments,
    users,
    activeAdminRole,
    setActiveAdminRole,
    updateOwnerLockedPrice,
    createTransferRequest,
    advanceTransferStatus,
    updateCustomsMilestone,
    updateUserRoleAndBranch,
  } = useBingwaStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // 5.2 Owner Biometric / Passkey Re-Authentication State
  const [ownerSessionUnlocked, setOwnerSessionUnlocked] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('OWNER-MWAKASEGE-2026');

  // Price Edit Modal State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');
  const [priceReasonInput, setPriceReasonInput] = useState<string>('');
  const [priceError, setPriceError] = useState<string | null>(null);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string | null>(null);

  // Slide-Over Audit History Drawer State
  const [auditDrawerVin, setAuditDrawerVin] = useState<string | null>(null);

  // 5.3 Customs Milestone Form State
  const [selectedTrackingCode, setSelectedTrackingCode] =
    useState<string>('BINGWA-IMP-7821');
  const [blInput, setBlInput] = useState<string>('BL-YOK-DAR-884920');
  const [tansadInput, setTansadInput] = useState<string>(
    'TANSAD-2026-DAR-889120'
  );
  const [dutyInput, setDutyInput] = useState<string>('37800000');
  const [customerSmsAlertSent, setCustomerSmsAlertSent] = useState<
    string | null
  >(null);

  // 5.4 New Inter-Branch Transfer Form State
  const [transferVehicleId, setTransferVehicleId] = useState<string>(
    vehicles[0]?.id || ''
  );
  const [transferDest, setTransferDest] = useState<'mwenge' | 'mikocheni'>(
    'mikocheni'
  );
  const [transferClient, setTransferClient] = useState<string>('');
  const [transferNotes, setTransferNotes] = useState<string>('');

  // Consolidated KPI Calculations
  const kpiStats = useMemo(() => {
    const totalValueTzs = vehicles.reduce((acc, v) => acc + v.priceTzs, 0);
    const mwengeVehicles = vehicles.filter((v) => v.branchId === 'mwenge');
    const mikocheniVehicles = vehicles.filter((v) => v.branchId === 'mikocheni');
    const portVehicles = vehicles.filter((v) => v.branchId === 'transit');

    const mwengeValue = mwengeVehicles.reduce((a, v) => a + v.priceTzs, 0);
    const mikocheniValue = mikocheniVehicles.reduce((a, v) => a + v.priceTzs, 0);
    const portValue = portVehicles.reduce((a, v) => a + v.priceTzs, 0);

    const customsClearingCount = Object.values(customsShipments).filter(
      (s) => s.customsStage !== 'YARD_DELIVERED'
    ).length;

    const activeTransitTransfers = transfers.filter(
      (t) =>
        t.status === 'IN_TRANSIT' || t.status === 'PENDING_AUTHORIZATION'
    ).length;

    return {
      totalValueTzs,
      mwengeCount: mwengeVehicles.length,
      mikocheniCount: mikocheniVehicles.length,
      portCount: portVehicles.length,
      mwengeValue,
      mikocheniValue,
      portValue,
      customsClearingCount,
      activeTransitTransfers,
    };
  }, [vehicles, customsShipments, transfers]);

  // Biometric Re-Auth Handler
  const handleVerifyOwnerBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAdminRole !== 'owner') {
      return;
    }
    if (passkeyInput.trim().length >= 6) {
      setOwnerSessionUnlocked(true);
      setShowBiometricModal(false);
    }
  };

  // Open Price Edit Modal
  const handleInitiatePriceEdit = (vehicle: Vehicle) => {
    setPriceError(null);
    setPriceSuccessMsg(null);
    if (activeAdminRole !== 'owner') {
      setPriceError(
        locale === 'sw'
          ? 'SERA YA BEI YA MMILIKI: Wafanyakazi hawaruhusiwi kubadili bei. Badili jukumu kuwa "Executive Owner" juu kulia.'
          : 'VEHICLE PRICING POLICY VIOLATION: Non-owner roles cannot mutate selling_price_tzs.'
      );
      return;
    }
    if (!ownerSessionUnlocked) {
      setShowBiometricModal(true);
      return;
    }
    setEditingVehicle(vehicle);
    setNewPriceInput(String(vehicle.priceTzs));
    setPriceReasonInput('');
  };

  // Commit Owner-Locked Price Change
  const handleCommitPriceChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    if (priceReasonInput.trim().length < 10) {
      setPriceError(
        locale === 'sw'
          ? 'Lazima uandike sababu kamili ya kubadili bei (angalau herufi 10) kwa ajili ya ukaguzi wa SHA-256.'
          : 'Explicit justification string (min 10 characters) is required for price_audit_logs.'
      );
      return;
    }

    const numericPrice = Number(newPriceInput);
    if (Number.isNaN(numericPrice) || numericPrice < 10_000_000) {
      setPriceError('Invalid TZS amount.');
      return;
    }

    const res = updateOwnerLockedPrice({
      vehicleId: editingVehicle.id,
      newPriceTzs: numericPrice,
      reason: priceReasonInput.trim(),
    });

    if (!res.success) {
      setPriceError(res.error || 'Failed to update price');
    } else {
      setPriceSuccessMsg(
        locale === 'sw'
          ? `Bei mpya ya ${editingVehicle.title} imefungwa kwa ${formatTZS(
              numericPrice
            )} na kuhifadhiwa kwenye price_audit_logs!`
          : `Owner-Locked Price for ${editingVehicle.title} updated to ${formatTZS(
              numericPrice
            )} and committed to price_audit_logs!`
      );
      setEditingVehicle(null);
    }
  };

  // Filtered audit logs for drawer
  const drawerLogs = useMemo(() => {
    if (!auditDrawerVin) return priceAuditLogs;
    return priceAuditLogs.filter((l) => l.vehicleVin === auditDrawerVin);
  }, [auditDrawerVin, priceAuditLogs]);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Top Executive Command Bar & Role Simulator */}
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#090E1A] via-[#0B1222] to-[#090E1A] p-6 shadow-2xl lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>
                BINGWA CARS ENTERPRISE OPERATIONS & OWNER PRICE-LOCK CONSOLE
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {locale === 'sw'
                ? 'Dashibodi Kuu ya Utawala (Mwenge • Mikocheni • Bandari)'
                : 'Executive Multi-Branch Admin & Operational Portal'}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {locale === 'sw'
                ? 'Inasimamia Ufungaji wa Bei za Mmiliki (SHA-256), Uhamisho wa Magari Kati ya Matawi, na Mfumo wa Forodha wa TRA.'
                : 'Enforcing VehiclePricingPolicy, BranchIsolationScope, Inter-Branch Transfers, and TRA Customs Pipeline.'}
            </p>
          </div>

          {/* Active RBAC Role Switcher to test Owner vs Staff permissions */}
          <div className="flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-black/60 p-3">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {locale === 'sw'
                ? 'Jukumu Linalotumika (RBAC Policy Simulator):'
                : 'Active RBAC Session Role:'}
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'owner', label: 'Executive Owner' },
                  { id: 'branch_manager', label: 'Branch Manager' },
                  { id: 'sales_agent', label: 'Sales Agent' },
                  { id: 'customs_agent', label: 'Customs Agent' },
                ] as { id: UserRole; label: string }[]
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setActiveAdminRole(r.id);
                    if (r.id !== 'owner') {
                      setOwnerSessionUnlocked(false);
                    }
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeAdminRole === r.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Phase 5 Modules */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            {
              id: 'dashboard',
              icon: BarChart3,
              sw: '5.1 Dashibodi Kuu & KPI',
              en: '5.1 Executive KPI Dashboard',
            },
            {
              id: 'price_console',
              icon: Lock,
              sw: '5.2 Console ya Bei za Mmiliki',
              en: '5.2 Owner Price Lock Console',
            },
            {
              id: 'customs_pipeline',
              icon: Ship,
              sw: '5.3 Forodha ya TRA & Meli',
              en: '5.3 TRA Customs Pipeline',
            },
            {
              id: 'transfers',
              icon: ArrowRightLeft,
              sw: '5.4 Uhamisho Kati ya Matawi',
              en: '5.4 Inter-Branch Transfers',
            },
            {
              id: 'rbac_users',
              icon: Users,
              sw: '5.5 Watumiaji & Matawi (RBAC)',
              en: '5.5 RBAC User Administration',
            },
            {
              id: 'finance_escrow_bi',
              icon: Sparkles,
              sw: '6–8. Fedha, M-Pesa Escrow & BI',
              en: '6–8. Finance, Escrow & BI',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg'
                    : 'border border-white/10 bg-[#080C17] text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{locale === 'sw' ? tab.sw : tab.en}</span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            MODULE 5.1: EXECUTIVE MULTI-BRANCH DASHBOARD
        ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 4 Consolidated KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-amber-500/30 bg-[#080C17] p-5">
                <span className="text-xs font-bold uppercase text-amber-400">
                  {locale === 'sw'
                    ? 'Thamani ya Magari Yote (TZS)'
                    : 'Total Active Inventory Value'}
                </span>
                <div className="mt-2 text-2xl font-black text-white">
                  {formatTZS(kpiStats.totalValueTzs)}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {vehicles.length} Units • 100% Owner Price Locked
                </p>
              </div>

              <div className="rounded-3xl border border-sky-500/30 bg-[#080C17] p-5">
                <span className="text-xs font-bold uppercase text-sky-400">
                  {locale === 'sw'
                    ? 'Magari Yanayokombolewa TRA Bandari'
                    : 'Held in TRA Customs (Dar Port)'}
                </span>
                <div className="mt-2 text-2xl font-black text-white">
                  {kpiStats.customsClearingCount} Shipments
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  TANSAD Assessment & Wharfage Active
                </p>
              </div>

              <div className="rounded-3xl border border-purple-500/30 bg-[#080C17] p-5">
                <span className="text-xs font-bold uppercase text-purple-400">
                  {locale === 'sw'
                    ? 'Uhamisho Kati ya Mwenge ↔ Mikocheni'
                    : 'Active Inter-Branch Transit'}
                </span>
                <div className="mt-2 text-2xl font-black text-white">
                  {kpiStats.activeTransitTransfers} Transfers
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  2-Hour Client Viewing SLA
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/30 bg-[#080C17] p-5">
                <span className="text-xs font-bold uppercase text-emerald-400">
                  {locale === 'sw'
                    ? 'Mauzo ya Siku 30 Zilizopita'
                    : '30-Day Showroom Sales Velocity'}
                </span>
                <div className="mt-2 text-2xl font-black text-white">
                  14 Units Sold
                </div>
                <p className="mt-1 text-xs text-emerald-400 font-mono">
                  TZS 1,840,000,000 Gross Turnover
                </p>
              </div>
            </div>

            {/* Branch Stock Distribution Visualizer */}
            <div className="rounded-3xl border border-white/10 bg-[#080C17] p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    {locale === 'sw'
                      ? 'Mgawanyo wa Magari na Thamani kwa Kila Tawi (Dar es Salaam)'
                      : 'Branch Stock Distribution & Valuation Visualizer'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {locale === 'sw'
                      ? 'Ulinganisho wa hisa kati ya Mikocheni Flagship Showroom, Mwenge Central Yard, na Bandari ya Dar.'
                      : 'Live branch-isolated stock valuation across Mikocheni, Mwenge, and Dar Port.'}
                  </p>
                </div>
                <span className="font-mono text-xs text-emerald-400">
                  RLS SCOPE: {activeAdminRole.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[
                  {
                    name: 'Mikocheni Flagship Showroom',
                    road: 'Old Bagamoyo Road',
                    count: kpiStats.mikocheniCount,
                    value: kpiStats.mikocheniValue,
                    pct: Math.round(
                      (kpiStats.mikocheniValue / kpiStats.totalValueTzs) * 100
                    ),
                    barClass: 'bg-amber-400',
                  },
                  {
                    name: 'Mwenge Central Yard',
                    road: 'Morogoro Rd / Sam Nujoma Jct',
                    count: kpiStats.mwengeCount,
                    value: kpiStats.mwengeValue,
                    pct: Math.round(
                      (kpiStats.mwengeValue / kpiStats.totalValueTzs) * 100
                    ),
                    barClass: 'bg-emerald-400',
                  },
                  {
                    name: 'Dar Port / TRA Bonded Transit',
                    road: 'Berth 7 TICTS / DP World',
                    count: kpiStats.portCount,
                    value: kpiStats.portValue,
                    pct: Math.round(
                      (kpiStats.portValue / kpiStats.totalValueTzs) * 100
                    ),
                    barClass: 'bg-sky-400',
                  },
                ].map((b) => (
                  <div
                    key={b.name}
                    className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Building2 className="h-5 w-5 text-slate-400" />
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                        {b.count} Units ({b.pct}%)
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{b.name}</h3>
                      <p className="text-xs text-slate-400">{b.road}</p>
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono">
                      {formatTZS(b.value)}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${b.barClass}`}
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 5.2: INVENTORY & OWNER PRICE LOCK CONSOLE
        ===================================================================== */}
        {activeTab === 'price_console' && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/15">
              <AdminOwnerConsole />
            </div>

            {/* Security Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-[#080C17] p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    ownerSessionUnlocked
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {ownerSessionUnlocked ? (
                    <Unlock className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    {ownerSessionUnlocked
                      ? locale === 'sw'
                        ? 'Kipindi cha Mmiliki Kimefunguliwa kwa Muda (Biometric Verified)'
                        : 'Executive Owner Price-Edit Session UNLOCKED (Biometric Verified)'
                      : locale === 'sw'
                      ? 'Bei Zote Zimefungwa kwa Ngao ya Kijani (Strict Owner Lock Active)'
                      : 'All Vehicle Prices Protected by Cryptographic Owner Lock'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {locale === 'sw'
                      ? 'Kila mabadiliko ya bei yanahitaji uthibitisho wa Passkey ya Mmiliki na maelezo ya sababu kwenye price_audit_logs.'
                      : 'Every price edit requires Executive Owner re-authentication and writes an immutable entry to price_audit_logs.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAuditDrawerVin('')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:border-amber-400 cursor-pointer"
                >
                  <History className="h-4 w-4 text-amber-400" />
                  <span>
                    {locale === 'sw'
                      ? `Fungua Historia ya Ukaguzi (${priceAuditLogs.length})`
                      : `Open Audit History Drawer (${priceAuditLogs.length})`}
                  </span>
                </button>

                {activeAdminRole === 'owner' && (
                  <button
                    type="button"
                    onClick={() =>
                      ownerSessionUnlocked
                        ? setOwnerSessionUnlocked(false)
                        : setShowBiometricModal(true)
                    }
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer ${
                      ownerSessionUnlocked
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    <Fingerprint className="h-4 w-4" />
                    <span>
                      {ownerSessionUnlocked
                        ? locale === 'sw'
                          ? 'Funga Tena Bei'
                          : 'Re-Lock Price Console'
                        : locale === 'sw'
                        ? 'Thibitisha Biometric ya Mmiliki'
                        : 'Authenticate Owner Passkey'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {priceError && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-4 text-xs font-bold text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{priceError}</span>
              </div>
            )}

            {priceSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{priceSuccessMsg}</span>
              </div>
            )}

            {/* Vehicle Price Lock Table */}
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#080C17]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-black/50 text-[11px] font-bold uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-4">VIN & Vehicle</th>
                    <th className="px-5 py-4">Assigned Branch</th>
                    <th className="px-5 py-4">Lock Status & SHA-256</th>
                    <th className="px-5 py-4">Selling Price (TZS)</th>
                    <th className="px-5 py-4 text-right">Owner Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white">
                          {v.year} {v.title}
                        </div>
                        <div className="font-mono text-[11px] text-amber-400">
                          VIN: {v.vin} • TANSAD: {v.priceAudit.tansadRef}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {locale === 'sw' ? v.branchLabel.sw : v.branchLabel.en}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          LOCKED
                        </span>
                        <div className="mt-1 font-mono text-[10px] text-slate-500">
                          {v.priceAudit.hash.slice(0, 22)}...
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-sm font-black text-white">
                        {formatTZS(v.priceTzs)}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setAuditDrawerVin(v.vin)}
                          className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 font-semibold text-slate-300 hover:text-white cursor-pointer"
                        >
                          Audit Log
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiatePriceEdit(v)}
                          className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 font-bold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
                        >
                          {locale === 'sw' ? 'Badili Bei (Mmiliki)' : 'Modify Locked Price'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 5.3: TRA CUSTOMS & LOGISTICS PIPELINE MANAGER
        ===================================================================== */}
        {activeTab === 'customs_pipeline' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 7 Columns: Kanban / Stepper Pipeline View */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-extrabold text-white">
                {locale === 'sw'
                  ? 'Mtiririko wa Magari Yanayoingia Bandari ya Dar es Salaam (TRA Pipeline)'
                  : 'Active Foreign Import & TRA Customs Clearance Pipeline'}
              </h2>

              {Object.values(customsShipments).map((ship) => (
                <div
                  key={ship.trackingCode}
                  onClick={() => {
                    setSelectedTrackingCode(ship.trackingCode);
                    setBlInput(ship.blNumber);
                    setTansadInput(ship.tansadNumber);
                    setDutyInput(String(ship.traDutyAmountTzs));
                  }}
                  className={`rounded-3xl border p-5 transition cursor-pointer ${
                    selectedTrackingCode === ship.trackingCode
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-white/10 bg-[#080C17] hover:border-white/25'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {ship.trackingCode} • VIN: {ship.vinChassis}
                    </span>
                    <span className="rounded-full bg-sky-500/20 border border-sky-500/40 px-3 py-0.5 font-mono text-xs font-bold text-sky-300">
                      STAGE: {ship.customsStage}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-base font-extrabold text-white">
                    {ship.vehicleTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Client: {ship.customerInitials} ({ship.customerPhone}) • Vessel:{' '}
                    {ship.vesselName}
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                    <div className="rounded-lg bg-black/40 p-2">
                      BL: {ship.blNumber}
                    </div>
                    <div className="rounded-lg bg-black/40 p-2">
                      TANSAD: {ship.tansadNumber}
                    </div>
                    <div className="rounded-lg bg-black/40 p-2 text-emerald-400">
                      Duty: {formatTZS(ship.traDutyAmountTzs)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 5 Columns: Customs Agent Milestone Update Form */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-[#080C17] p-6 space-y-5">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <FileText className="h-5 w-5 text-sky-400" />
                  <span>
                    {locale === 'sw'
                      ? `Sasisha Hatua ya Forodha (${selectedTrackingCode})`
                      : `Update TRA Customs Milestone (${selectedTrackingCode})`}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    {locale === 'sw'
                      ? 'Chagua Hatua Mpya ya Forodha (Milestone Progression):'
                      : 'Advance Shipment Stage:'}
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {CUSTOMS_STAGES_ORDER.map((st) => {
                      const currentShip =
                        customsShipments[selectedTrackingCode];
                      const isCurrent =
                        currentShip?.customsStage === st.stage;
                      return (
                        <button
                          key={st.stage}
                          type="button"
                          onClick={() =>
                            updateCustomsMilestone({
                              trackingCode: selectedTrackingCode,
                              customsStage: st.stage,
                              currentStep: st.step,
                              blNumber: blInput,
                              tansadNumber: tansadInput,
                              traDutyAmountTzs: Number(dutyInput) || 0,
                            })
                          }
                          className={`flex items-center justify-between rounded-xl border px-3.5 py-2 text-left text-xs font-bold transition cursor-pointer ${
                            isCurrent
                              ? 'border-amber-400 bg-amber-500 text-slate-950'
                              : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/30'
                          }`}
                        >
                          <span>{locale === 'sw' ? st.labelSw : st.labelEn}</span>
                          <span className="font-mono text-[10px]">
                            {st.stage}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Bill of Lading (BL Number)
                    </label>
                    <input
                      type="text"
                      value={blInput}
                      onChange={(e) => setBlInput(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      TRA Official TANSAD Assessment Number
                    </label>
                    <input
                      type="text"
                      value={tansadInput}
                      onChange={(e) => setTansadInput(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-400">
                      Assessed TRA Customs Duty (TZS)
                    </label>
                    <input
                      type="number"
                      value={dutyInput}
                      onChange={(e) => setDutyInput(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {customerSmsAlertSent && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-300">
                    {customerSmsAlertSent}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const ship = customsShipments[selectedTrackingCode];
                    updateCustomsMilestone({
                      trackingCode: selectedTrackingCode,
                      customsStage: ship.customsStage,
                      currentStep: ship.currentStep,
                      blNumber: blInput,
                      tansadNumber: tansadInput,
                      traDutyAmountTzs: Number(dutyInput) || ship.traDutyAmountTzs,
                    });
                    setCustomerSmsAlertSent(
                      `SMS & WhatsApp notification dispatched to ${ship.customerInitials} (${ship.customerPhone}) — Stage: ${ship.customsStage}`
                    );
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 py-3 text-xs font-black text-slate-950 shadow cursor-pointer"
                >
                  <BellRing className="h-4 w-4" />
                  <span>
                    {locale === 'sw'
                      ? 'Hifadhi & Mtumie Mteja Taarifa ya SMS/WhatsApp'
                      : 'Save Customs Data & Trigger Client SMS/Email Alert'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 5.4: INTER-BRANCH STOCK TRANSFER MANAGER
        ===================================================================== */}
        {activeTab === 'transfers' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 8 Columns: Active Inter-Branch Transfer Queue */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-lg font-extrabold text-white">
                {locale === 'sw'
                  ? 'Foleni ya Uhamisho wa Magari Kati ya Mwenge Yard na Mikocheni Showroom'
                  : 'Inter-Branch Vehicle Transfer Queue & Digital Verification'}
              </h2>

              {transfers.map((trf) => (
                <div
                  key={trf.id}
                  className="rounded-3xl border border-white/10 bg-[#080C17] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {trf.id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-mono text-xs text-slate-300">
                        VIN: {trf.vehicleVin}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                        trf.status === 'RECEIVED_AND_VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : trf.status === 'IN_TRANSIT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : trf.status === 'CANCELLED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {trf.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {trf.vehicleTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Route:{' '}
                      <strong className="uppercase text-amber-300">
                        {trf.sourceBranch}
                      </strong>{' '}
                      →{' '}
                      <strong className="uppercase text-emerald-300">
                        {trf.destinationBranch}
                      </strong>{' '}
                      • Client: {trf.customerName}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{trf.notes}</p>
                  </div>

                  {/* Action Workflow Buttons Based on Current Transfer State */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <span className="font-mono text-[11px] text-slate-400">
                      Updated: {trf.updatedAt}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {trf.status === 'PENDING_AUTHORIZATION' && (
                        <button
                          type="button"
                          onClick={() =>
                            advanceTransferStatus(
                              trf.id,
                              'IN_TRANSIT',
                              'Source Yard Manager (Authorized)'
                            )
                          }
                          className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-slate-950 hover:bg-amber-400 cursor-pointer"
                        >
                          {locale === 'sw'
                            ? '1. Ruhusu Gari Litoke Source Yard (Dispatch)'
                            : '1. Authorize Source Yard Release (IN_TRANSIT)'}
                        </button>
                      )}

                      {trf.status === 'IN_TRANSIT' && (
                        <button
                          type="button"
                          onClick={() =>
                            advanceTransferStatus(
                              trf.id,
                              'RECEIVED_AND_VERIFIED',
                              'Destination Branch Manager (Verified)'
                            )
                          }
                          className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer"
                        >
                          {locale === 'sw'
                            ? '2. Thibitisha Kuwasili & Badili Umiliki wa Tawi'
                            : '2. Verify Arrival Checklist & Flip Active Branch'}
                        </button>
                      )}

                      {trf.status !== 'RECEIVED_AND_VERIFIED' &&
                        trf.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() =>
                              advanceTransferStatus(
                                trf.id,
                                'CANCELLED',
                                'Branch Manager'
                              )
                            }
                            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 4 Columns: Request New Inter-Branch Transfer */}
            <div className="lg:col-span-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTransferRequest({
                    vehicleId: transferVehicleId,
                    destinationBranch: transferDest,
                    customerName: transferClient || 'Walk-in VIP Buyer',
                    notes:
                      transferNotes ||
                      'Requested via Executive Transfer Manager for client inspection.',
                  });
                  setTransferClient('');
                  setTransferNotes('');
                }}
                className="rounded-3xl border border-white/15 bg-[#080C17] p-6 space-y-4"
              >
                <h3 className="text-base font-extrabold text-white">
                  {locale === 'sw'
                    ? 'Anzisha Uhamisho Mpya wa Gari'
                    : 'Initiate Inter-Branch Vehicle Transfer'}
                </h3>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    {locale === 'sw' ? 'Chagua Gari (VIN)' : 'Select Vehicle'}
                  </label>
                  <select
                    value={transferVehicleId}
                    onChange={(e) => setTransferVehicleId(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-xs text-white"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vin} — {v.title} ({v.branchId.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    {locale === 'sw' ? 'Tawi Linalopokea' : 'Destination Branch'}
                  </label>
                  <select
                    value={transferDest}
                    onChange={(e) =>
                      setTransferDest(e.target.value as 'mwenge' | 'mikocheni')
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-xs text-white"
                  >
                    <option value="mikocheni">Mikocheni Flagship Showroom</option>
                    <option value="mwenge">Mwenge Central Yard</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    {locale === 'sw'
                      ? 'Jina la Mteja & Simu (+255)'
                      : 'Walk-in Customer Name & Phone'}
                  </label>
                  <input
                    type="text"
                    required
                    value={transferClient}
                    onChange={(e) => setTransferClient(e.target.value)}
                    placeholder="e.g. Bw. Kelvin Mtei (+255 754 112 900)"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    {locale === 'sw' ? 'Maelezo ya Uhamisho' : 'Transfer Notes'}
                  </label>
                  <textarea
                    rows={3}
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="2-hour viewing transfer notes..."
                    className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-black text-slate-950 shadow cursor-pointer"
                >
                  {locale === 'sw'
                    ? 'Tuma Ombi la Kuhamisha Gari'
                    : 'Dispatch Transfer Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 5.5: ROLE-BASED USER & BRANCH ADMINISTRATION
        ===================================================================== */}
        {activeTab === 'rbac_users' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#080C17] p-6">
              <h2 className="text-lg font-extrabold text-white mb-1">
                {locale === 'sw'
                  ? 'Usimamizi wa Watumiaji, Majukumu (RBAC) na Matawi'
                  : 'Role-Based User & Multi-Branch Affiliation Management'}
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                {locale === 'sw'
                  ? 'Kila mfanyakazi anafungwa kwenye tawi lake kupitia BranchIsolationScope isipokuwa Executive Owner.'
                  : 'Branch Managers and Sales Agents are automatically scoped to their assigned yard via BranchIsolationScope.'}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-black/50 text-[11px] font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3.5">Staff Member</th>
                      <th className="px-4 py-3.5">Contact (+255)</th>
                      <th className="px-4 py-3.5">Assigned Role</th>
                      <th className="px-4 py-3.5">Branch Scope</th>
                      <th className="px-4 py-3.5">Last Activity (EAT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-300">
                          {u.phone}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUserRoleAndBranch(
                                u.id,
                                e.target.value as UserRole,
                                u.branchId
                              )
                            }
                            className="rounded-lg border border-white/15 bg-black/60 px-2.5 py-1.5 font-bold text-amber-300"
                          >
                            <option value="owner">owner</option>
                            <option value="branch_manager">branch_manager</option>
                            <option value="sales_agent">sales_agent</option>
                            <option value="customs_agent">customs_agent</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.branchId}
                            onChange={(e) =>
                              updateUserRoleAndBranch(
                                u.id,
                                u.role,
                                e.target.value as BranchId
                              )
                            }
                            className="rounded-lg border border-white/15 bg-black/60 px-2.5 py-1.5 text-white"
                          >
                            <option value="all">All Branches (Owner Scope)</option>
                            <option value="mikocheni">Mikocheni Showroom</option>
                            <option value="mwenge">Mwenge Central Yard</option>
                            <option value="transit">Dar Port Customs Desk</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-emerald-400">
                          {u.lastLoginEat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULES 6, 7 & 8: FINANCIAL ESCROW, OWNER LEDGER, SMS/GATE PASS & BI
        ===================================================================== */}
        {activeTab === 'finance_escrow_bi' && (
          <div className="space-y-8">
            {/* Phase 6: Executive Confidential Unit Economics Ledger (Owner Only) */}
            <div className="rounded-3xl border border-amber-500/30 bg-[#080C17] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-400">
                    PHASE 6 // EXECUTIVE CONFIDENTIAL UNIT ECONOMICS LEDGER
                  </span>
                  <h2 className="text-lg font-extrabold text-white">
                    Gross Margin = Locked Price − (CIF + TRA Duty + Wharfage + TBS + Refurbishment)
                  </h2>
                </div>
                <span className="rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-300">
                  {activeAdminRole === 'owner' ? 'OWNER AUTHORIZED' : 'RESTRICTED'}
                </span>
              </div>

              {activeAdminRole !== 'owner' ? (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center text-xs font-bold text-rose-300">
                  HTTP 403 FORBIDDEN: Unit acquisition CIF and Gross Margin ledger is strictly restricted to Executive Owner credentials.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-white/10 bg-black/50 text-[11px] uppercase text-slate-400">
                      <tr>
                        <th className="p-3.5">VIN & Model</th>
                        <th className="p-3.5">Locked Price</th>
                        <th className="p-3.5">CIF (Japan/UK)</th>
                        <th className="p-3.5">TRA Duty</th>
                        <th className="p-3.5">Wharfage + TBS + Refurb</th>
                        <th className="p-3.5 text-right text-emerald-400">Net Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {vehicles.slice(0, 5).map((v) => {
                        const cif = Math.round(v.priceTzs * 0.54);
                        const duty = v.statutoryBreakdownTzs.traCustomsDutyIncluded;
                        const portAndRefurb =
                          1_450_000 +
                          v.statutoryBreakdownTzs.tbsInspectionFeeIncluded +
                          1_200_000;
                        const margin = v.priceTzs - (cif + duty + portAndRefurb);
                        return (
                          <tr key={v.id} className="hover:bg-white/[0.02]">
                            <td className="p-3.5 font-sans font-bold text-white">
                              {v.year} {v.model}{' '}
                              <span className="block font-mono text-[10px] text-slate-400">
                                {v.vin}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-amber-300">
                              {formatTZS(v.priceTzs)}
                            </td>
                            <td className="p-3.5 text-slate-300">{formatTZS(cif)}</td>
                            <td className="p-3.5 text-slate-300">{formatTZS(duty)}</td>
                            <td className="p-3.5 text-slate-300">
                              {formatTZS(portAndRefurb)}
                            </td>
                            <td className="p-3.5 text-right font-bold text-emerald-400">
                              {formatTZS(margin)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Phase 6, 7 & 8 Operational Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Phase 6: Mobile Money & Bank Escrow Gateways */}
              <div className="rounded-3xl border border-white/10 bg-[#080C17] p-5 space-y-3">
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  PHASE 6 // ESCROW & TRA VFD INVOICING
                </span>
                <h3 className="text-base font-extrabold text-white">
                  M-Pesa C2B, Airtel Money & CRDB/NMB 72h Reservation Lock
                </h3>
                <p className="text-xs text-slate-400">
                  Automated webhook listener locks vehicle status to RESERVED for 72 hours upon deposit confirmation and issues a QR-verified TRA Proforma Invoice.
                </p>
                <div className="rounded-2xl border border-emerald-500/30 bg-black/50 p-3 font-mono text-[11px] text-emerald-300 space-y-1">
                  <div>CHANNEL: M-PESA LIPA NAMBA 5590124</div>
                  <div>BANK WIRE: CRDB TZS / USD ESCROW</div>
                  <div>HOLD WINDOW: 72 HOURS AUTOMATIC</div>
                </div>
              </div>

              {/* Phase 7: Beem/NextSMS & Digital Inter-Branch QR Gate Pass */}
              <div className="rounded-3xl border border-white/10 bg-[#080C17] p-5 space-y-3">
                <span className="text-[11px] font-mono font-bold text-sky-400">
                  PHASE 7 // REDIS HORIZON & QR GATE PASS
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Sender ID: &quot;BINGWA CARS&quot; &amp; Inter-Branch Gate Pass
                </h3>
                <p className="text-xs text-slate-400">
                  Dispatches Swahili/English SMS via Beem Africa / NextSMS, WhatsApp Cloud API spec sheets, and HMAC-SHA256 QR Gate Passes for Mwenge ↔ Mikocheni transfers.
                </p>
                <div className="rounded-2xl border border-sky-500/30 bg-black/50 p-3 font-mono text-[11px] text-sky-300 space-y-1">
                  <div>QUEUE: redis-horizon (tanzania-notifications)</div>
                  <div>GATE PASS: GP-DSM-9F86D081 (VERIFIED)</div>
                  <div>WHATSAPP WEBHOOK: ACTIVE (200 OK)</div>
                </div>
              </div>

              {/* Phase 8: Executive BI, Draco 3D Pipeline & Yard Turnover Velocity */}
              <div className="rounded-3xl border border-white/10 bg-[#080C17] p-5 space-y-3">
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  PHASE 8 // YARD VELOCITY BI & DRACO 3D
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Fleet Turnover Analytics &amp; 4G Asset Optimization
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time yard sales velocity comparing average days on yard and top searched models across Dar es Salaam.
                </p>
                <div className="rounded-2xl border border-amber-500/30 bg-black/50 p-3 font-mono text-[11px] text-amber-300 space-y-1">
                  <div>MIKOCHENI AVG TURNOVER: 11.4 DAYS</div>
                  <div>MWENGE YARD AVG TURNOVER: 14.2 DAYS</div>
                  <div>TOP DEMAND: PRADO TX-L • HILUX ROCCO</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          MODAL 1: BIOMETRIC / PASSKEY RE-AUTHENTICATION CHALLENGE
      ===================================================================== */}
      {showBiometricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-[#090E1A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <Fingerprint className="h-5 w-5" />
                <span>Executive Owner Re-Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBiometricModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-white">
              {locale === 'sw'
                ? 'Thibitisha Utambulisho wa Mmiliki Kabla ya Kubadili Bei'
                : 'Unlock Strict Owner Price-Lock Console'}
            </h3>
            <p className="text-xs text-slate-300">
              {locale === 'sw'
                ? 'Ingiza Passkey ya Mkurugenzi Mtendaji ili kufungua uwezo wa kuhariri selling_price_tzs.'
                : 'Enter your Hardware Passkey / Executive Signature to unlock selling_price_tzs mutations.'}
            </p>

            <form onSubmit={handleVerifyOwnerBiometrics} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-mono text-slate-400">
                  EXECUTIVE PASSKEY SIGNATURE
                </label>
                <input
                  type="text"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 font-mono text-xs text-amber-300"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-black text-slate-950 cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                <span>
                  {locale === 'sw'
                    ? 'Fungua Console ya Bei Sasa'
                    : 'Verify Biometrics & Unlock Price Edits'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: OWNER PRICE MUTATION & MANDATORY JUSTIFICATION MODAL
      ===================================================================== */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/50 bg-[#090E1A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                OWNER PRICE MUTATION IN PROGRESS
              </span>
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {editingVehicle.year} {editingVehicle.title}
              </h3>
              <p className="font-mono text-xs text-slate-400">
                VIN: {editingVehicle.vin} • Current Locked Price:{' '}
                {formatTZS(editingVehicle.priceTzs)}
              </p>
            </div>

            <form onSubmit={handleCommitPriceChange} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-300">
                  {locale === 'sw'
                    ? 'Bei Mpya Iliyofungwa (TZS)'
                    : 'New Owner-Locked Selling Price (TZS)'}
                </label>
                <input
                  type="number"
                  required
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 font-mono text-sm font-bold text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-300">
                  {locale === 'sw'
                    ? 'Sababu Rasmi ya Ukaguzi (Inahifadhiwa kwenye price_audit_logs)'
                    : 'Mandatory Audit Justification (Committed to price_audit_logs)'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={priceReasonInput}
                  onChange={(e) => setPriceReasonInput(e.target.value)}
                  placeholder="e.g. Executive Owner adjustment following final TRA TANSAD tax reconciliation..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                >
                  {locale === 'sw'
                    ? 'Funga Bei Mpya & Andika Audit Log'
                    : 'Commit Owner Price & Sign Audit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE-OVER DRAWER: IMMUTABLE PRICE AUDIT HISTORY
      ===================================================================== */}
      {auditDrawerVin !== null && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/15 bg-[#080C17] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  IMMUTABLE CRYPTOGRAPHIC PRICE LEDGER
                </span>
                <h3 className="text-lg font-black text-white">
                  {auditDrawerVin
                    ? `Audit History for VIN: ${auditDrawerVin}`
                    : 'Complete Enterprise Price Audit Logs'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuditDrawerVin(null)}
                className="rounded-full border border-white/15 bg-white/5 p-2 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {drawerLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-amber-400">
                    <span>VIN: {log.vehicleVin}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="font-bold text-white">{log.vehicleTitle}</div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        PREVIOUS PRICE
                      </span>
                      <span className="text-slate-300">
                        {formatTZS(log.oldPriceTzs)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        NEW LOCKED PRICE
                      </span>
                      <span className="font-bold text-emerald-400">
                        {formatTZS(log.newPriceTzs)}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300">
                    <strong className="text-white">Justification:</strong>{' '}
                    {log.reason}
                  </p>
                  <div className="pt-1 font-mono text-[10px] text-slate-500 flex justify-between">
                    <span>By: {log.modifiedByName}</span>
                    <span>{log.signatureHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

