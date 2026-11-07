'use client';

import React, { useState } from 'react';
import {
  Ship,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Anchor,
  MapPin,
  Lock,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CUSTOMS_SHIPMENTS, CustomsShipment, formatTZS } from '@/lib/data';
import { useBingwaStore } from '@/lib/store';

const MILESTONE_STEPS = [
  {
    step: 1,
    titleSw: '1. Japan / UK Port Exit (Kupakiwa Meli)',
    titleEn: '1. Japan / UK Port Exit (Vessel Loaded)',
    descSw: 'Ukaguzi wa JAAI/TBS umekamilika na Bill of Lading (BL) imetolewa.',
    descEn: 'Pre-export JAAI/TBS inspection passed & Bill of Lading issued.',
  },
  {
    step: 2,
    titleSw: '2. Dar es Salaam Port Arrival / TICTS (Meli Kuwasili)',
    titleEn: '2. Dar es Salaam Port Arrival / DP World & TICTS',
    descSw: 'Meli imetia nanga Bandari ya Dar es Salaam na gariimeshushwa.',
    descEn: 'Ro-Ro vessel berthed at Dar es Salaam Port & manifest discharged.',
  },
  {
    step: 3,
    titleSw: '3. TRA Customs Valuation & Assessment (Ukaguzi wa Forodha)',
    titleEn: '3. TRA Customs Valuation & TANSAD Assessment',
    descSw: 'Mamlaka ya Mapato (TRA) imehakiki TANSAD na kukadiria ushuru halali.',
    descEn: 'TRA Single Customs Declaration (TANSAD) verified & assessed.',
  },
  {
    step: 4,
    titleSw: '4. Wharfage & Tax Clearance (Kodi Imelipwa)',
    titleEn: '4. TPA Wharfage & Full TRA Tax Clearance',
    descSw: 'Ushuru wote wa TRA na tozo za Bandari (TPA) zimelipwa kikamilifu.',
    descEn: 'All TRA import duties, VAT, excise & TPA port storage charges settled.',
  },
  {
    step: 5,
    titleSw: '5. TBS Physical Inspection & Plate Registration (Usajili wa Namba)',
    titleEn: '5. TBS Physical Verification & TRA Plate Registration',
    descSw: 'Ukaguzi wa mwisho wa TBS na utoaji wa kadi na namba mpya za T-Series.',
    descEn: 'Final TBS roadworthiness check & buyer TIN registration plate issued.',
  },
  {
    step: 6,
    titleSw: '6. Ready for Yard Collection at Mwenge / Mikocheni',
    titleEn: '6. Ready for Handover at Mwenge Yard / Mikocheni Showroom',
    descSw: 'Gari lipo tayari ofisini kwetu kwa makabidhiano rasmi na mteja.',
    descEn: 'Vehicle detailed, fueled & ready for collection at designated branch.',
  },
];

export default function CustomsTrackerWidget() {
  const { locale } = useBingwaStore();
  const [trackingInput, setTrackingInput] = useState('BINGWA-IMP-7821');
  const [activeShipment, setActiveShipment] = useState<CustomsShipment>(
    SAMPLE_CUSTOMS_SHIPMENTS['BINGWA-IMP-7821']
  );
  const [notFoundError, setNotFoundError] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = trackingInput.trim().toUpperCase();

    // Match by tracking code or VIN/Chassis substring
    const matched = Object.values(SAMPLE_CUSTOMS_SHIPMENTS).find(
      (s) =>
        s.trackingCode.toUpperCase() === normalized ||
        s.vinChassis.toUpperCase().includes(normalized)
    );

    if (matched) {
      setActiveShipment(matched);
      setNotFoundError(false);
    } else {
      setNotFoundError(true);
    }
  };

  const selectQuickCode = (code: string) => {
    setTrackingInput(code);
    setActiveShipment(SAMPLE_CUSTOMS_SHIPMENTS[code]);
    setNotFoundError(false);
  };

  return (
    <section
      id="custom-import"
      className="relative border-b border-white/10 bg-[#070B14] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-300 uppercase">
              <Ship className="h-3.5 w-3.5" />
              <span>FOREIGN IMPORTATION & TRA CUSTOMS TELEMETRY</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
              {locale === 'sw'
                ? 'Je, uliagiza gari kupitia sisi kutoka Japan au UK?'
                : 'Ordered a Custom Import from Japan or the UK?'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              {locale === 'sw'
                ? 'Fuatilia safari ya meli (Ro-Ro), tathmini ya kodi ya TRA (TANSAD), malipo ya bandari (TPA), na usajili wa namba mubashara bila usumbufu.'
                : 'Track your vehicle shipment from Yokohama, Nagoya, or Southampton through Dar es Salaam Port, TRA TANSAD customs valuation, and TBS registration in real time.'}
            </p>
          </div>

          {/* Sample Tracking Codes Quick-Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {locale === 'sw' ? 'Namba za Mfano:' : 'Sample Codes:'}
            </span>
            {Object.keys(SAMPLE_CUSTOMS_SHIPMENTS).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => selectQuickCode(code)}
                className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition cursor-pointer ${
                  activeShipment.trackingCode === code
                    ? 'border-amber-400 bg-amber-500 text-slate-950'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Main Tracking Card */}
        <div className="rounded-3xl border border-white/15 bg-[#090E1A] p-5 sm:p-8 shadow-2xl">
          {/* Input Form */}
          <form
            onSubmit={handleTrack}
            className="grid grid-cols-1 gap-4 border-b border-white/10 pb-6 md:grid-cols-12"
          >
            <div className="md:col-span-9">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                {locale === 'sw'
                  ? 'Ingiza Namba ya Oda / Tracking Code / Chassis (VIN) / BL:'
                  : 'Enter Order Tracking Code / Chassis Number (VIN) / Bill of Lading:'}
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. BINGWA-IMP-7821 or GDJ150W-9041827"
                  className="w-full rounded-xl border border-white/15 bg-black/60 pl-11 pr-4 py-3 font-mono text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              {notFoundError && (
                <p className="mt-2 text-xs font-semibold text-rose-400">
                  {locale === 'sw'
                    ? 'Namba haijapatikana. Tafadhali jaribu BINGWA-IMP-7821, BINGWA-UK-4092, au BINGWA-IMP-3310.'
                    : 'Tracking reference not found. Try BINGWA-IMP-7821, BINGWA-UK-4092, or BINGWA-IMP-3310.'}
                </p>
              )}
            </div>

            <div className="flex items-end md:col-span-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:brightness-110 transition cursor-pointer"
              >
                <Anchor className="h-4 w-4" />
                <span>
                  {locale === 'sw' ? 'Kagua Hatua ya Forodha' : 'Track Customs Status'}
                </span>
              </button>
            </div>
          </form>

          {/* Shipment Telemetry Summary Header */}
          <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 lg:grid-cols-4">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                {locale === 'sw' ? 'Gari & Chassis (VIN)' : 'Vehicle & Chassis (VIN)'}
              </span>
              <p className="mt-1 text-sm font-extrabold text-white">
                {activeShipment.vehicleTitle}
              </p>
              <p className="font-mono text-xs text-amber-400">
                VIN: {activeShipment.vinChassis} • {activeShipment.customerInitials}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                {locale === 'sw' ? 'Meli & Bandari ya Mwanzo' : 'Ro-Ro Vessel & Origin'}
              </span>
              <p className="mt-1 text-sm font-bold text-white">
                {activeShipment.vesselName} ({activeShipment.voyageNo})
              </p>
              <p className="text-xs text-slate-300">{activeShipment.originPort}</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                {locale === 'sw' ? 'Nyaraka za TRA & TBS' : 'TRA TANSAD & TBS Ref'}
              </span>
              <p className="mt-1 font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {activeShipment.tansadNumber}
              </p>
              <p className="font-mono text-xs text-slate-300 mt-0.5">
                {activeShipment.tbsInspectionCode}
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {locale === 'sw' ? 'CIF + Ushuru Kamili' : 'Locked CIF + Duty'}
                </span>
                <span>FIXED</span>
              </div>
              <p className="mt-1 text-lg font-black text-white">
                {formatTZS(activeShipment.lockedCifAndTaxTzs)}
              </p>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-400" />
                {activeShipment.destinationBranch}
              </p>
            </div>
          </div>

          {/* 6-Stage Visual Milestone Step Progress Indicator */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                {locale === 'sw'
                  ? 'Mtiririko wa Hatua 6 za Uagizaji na Ukombozi Bandari ya Dar es Salaam'
                  : '6-Stage Dar es Salaam Port & TRA Clearance Milestone Pipeline'}
              </h3>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                {locale === 'sw'
                  ? `Hatua ya ${activeShipment.currentStep} kati ya 6`
                  : `Stage ${activeShipment.currentStep} of 6`}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MILESTONE_STEPS.map((item, idx) => {
                const isCompleted = item.step < activeShipment.currentStep;
                const isCurrent = item.step === activeShipment.currentStep;

                return (
                  <div
                    key={item.step}
                    className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                        : isCompleted
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-white/10 bg-white/[0.02] opacity-65'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{locale === 'sw' ? 'Imekamilika' : 'Completed'}</span>
                            </>
                          ) : isCurrent ? (
                            <>
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>{locale === 'sw' ? 'Hatua ya Sasa' : 'In Progress'}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>{locale === 'sw' ? 'Inafuata' : 'Upcoming'}</span>
                            </>
                          )}
                        </span>

                        <span className="font-mono text-[11px] text-slate-400">
                          {activeShipment.stepTimestamps[idx]}
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-extrabold text-white">
                        {locale === 'sw' ? item.titleSw : item.titleEn}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        {locale === 'sw' ? item.descSw : item.descEn}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Bingwa Logistics Verified
                      </span>
                      <span className="font-mono">0{item.step}/06</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

