'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Ship,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Lock,
  Clock,
  FileCheck2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useBingwaStore } from '@/lib/store';
import { formatTZS } from '@/lib/data';

type OriginCountry = 'Japan' | 'UK' | 'UAE' | 'South Africa';

const SHIPPING_ESTIMATES: Record<
  OriginCountry,
  {
    flag: string;
    ports: string;
    seaDays: string;
    clearanceDays: string;
    freightEstimateTzs: number;
  }
> = {
  Japan: {
    flag: '🇯🇵',
    ports: 'Yokohama / Nagoya / Kobe → Dar es Salaam Port',
    seaDays: '21 – 28 Days (Ro-Ro Direct Vessel)',
    clearanceDays: '5 – 7 Working Days (TRA TANSAD & TBS)',
    freightEstimateTzs: 4200000,
  },
  UK: {
    flag: '🇬🇧',
    ports: 'Southampton / Tilbury → Dar es Salaam Port',
    seaDays: '24 – 32 Days (Ro-Ro Carrier)',
    clearanceDays: '5 – 7 Working Days (TRA TANSAD & TBS)',
    freightEstimateTzs: 5400000,
  },
  UAE: {
    flag: '🇦🇪',
    ports: 'Jebel Ali (Dubai) → Dar es Salaam Port',
    seaDays: '10 – 14 Days (Fast Gulf Feeder)',
    clearanceDays: '4 – 6 Working Days (TRA TANSAD & TBS)',
    freightEstimateTzs: 3100000,
  },
  'South Africa': {
    flag: '🇿🇦',
    ports: 'Durban Port → Dar es Salaam Port',
    seaDays: '7 – 12 Days (Southern Corridor Vessel)',
    clearanceDays: '4 – 6 Working Days (SADC / TRA Clearance)',
    freightEstimateTzs: 2800000,
  },
};

function ImportWizardContent() {
  const searchParams = useSearchParams();
  const { locale } = useBingwaStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Vehicle Target
  const [origin, setOrigin] = useState<OriginCountry>('Japan');
  const [make, setMake] = useState(searchParams.get('make') || 'Toyota');
  const [model, setModel] = useState(
    searchParams.get('model') || 'Land Cruiser Prado TX-L'
  );
  const [yearFrom, setYearFrom] = useState('2020');
  const [yearTo, setYearTo] = useState('2023');
  const [preferredColor, setPreferredColor] = useState('Pearl White / Black');
  const [engineCc, setEngineCc] = useState('2800');

  // Step 2 State: Budgeting in TZS
  const [totalBudgetMillions, setTotalBudgetMillions] = useState(135);

  // Step 3 State: Verification Preferences
  const [wantTbsPreInspection, setWantTbsPreInspection] = useState(true);
  const [wantAuctionVerification, setWantAuctionVerification] = useState(true);
  const [wantMarineInsurance, setWantMarineInsurance] = useState(true);

  // Step 4 State: Customer Details & Branch Selection
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+255 ');
  const [email, setEmail] = useState('');
  const [pickupBranch, setPickupBranch] = useState<'mwenge' | 'mikocheni'>(
    'mikocheni'
  );
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Live Estimation Engine Calculations (Reference Only)
  const totalBudgetTzs = totalBudgetMillions * 1_000_000;
  const freightTzs = SHIPPING_ESTIMATES[origin].freightEstimateTzs;
  const clearingAndPortTzs = 2400000; // TPA Wharfage, Agency, TBS, Plate Registration
  const estimatedTraDutyTzs = Math.round(totalBudgetTzs * 0.28);
  const estimatedFobAllocationTzs = Math.max(
    10_000_000,
    totalBudgetTzs - freightTzs - clearingAndPortTzs - estimatedTraDutyTzs
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `BINGWA-ORD-${Math.floor(1000 + Math.random() * 8999)}`;
    setSubmittedRef(generatedCode);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Top Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-300 uppercase">
          <Ship className="h-3.5 w-3.5" />
          <span>
            {locale === 'sw'
              ? 'MFUMO WA KUAGIZA Gari NJE YA NCHI (JAPAN • UK • UAE • SA)'
              : 'DIRECT FOREIGN VEHICLE IMPORTATION ENGINE'}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          {locale === 'sw'
            ? 'Agiza Gari Moja kwa Moja kwa Bei Iliyofungwa (TZS)'
            : 'Custom Foreign Import Request & TRA Duty Estimator'}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          {locale === 'sw'
            ? 'Jaza hatua 4 rahisi hapa chini. Tunakuchagulia gari lenye alama za juu (Grade 4.5+), tunakagua kwa viwango vya TBS/JAAI, na kulikomboa Bandari ya Dar es Salaam.'
            : 'Complete our 4-step import wizard. We source Grade 4.5+ units directly from auction, handle JAAI/TBS inspection, and clear TRA customs to Mwenge or Mikocheni.'}
        </p>
      </div>

      {/* Main Split Grid: Left 7 Cols (4-Step Wizard) + Right 5 Cols (Live Estimation Engine) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left 7 Columns: Step-by-Step Interactive Wizard */}
        <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-[#080C17] p-6 sm:p-8 shadow-2xl">
          {/* Step Progress Bar */}
          <div className="mb-8 grid grid-cols-4 gap-2">
            {[
              { s: 1, sw: '1. Gari & Nchi', en: '1. Vehicle Target' },
              { s: 2, sw: '2. Bajeti (TZS)', en: '2. TZS Budget' },
              { s: 3, sw: '3. Ukaguzi TBS', en: '3. Verification' },
              { s: 4, sw: '4. Maelezo & Tawi', en: '4. Branch & Contact' },
            ].map((item) => {
              const active = step === item.s;
              const done = step > item.s;
              return (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setStep(item.s as 1 | 2 | 3 | 4)}
                  className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    active
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                      : done
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold'
                      : 'border-white/10 bg-black/40 text-slate-400'
                  }`}
                >
                  <span className="block text-[11px]">
                    {locale === 'sw' ? item.sw : item.en}
                  </span>
                </button>
              );
            })}
          </div>

          {submittedRef ? (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
              <h2 className="text-2xl font-black text-white">
                {locale === 'sw'
                  ? 'Ombi Lako la Kuagiza Gari Limepokelewa!'
                  : 'Custom Foreign Import Dossier Created!'}
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {locale === 'sw'
                  ? `Namba yako ya ufuatiliaji ni ${submittedRef}. Afisa wetu wa Uagizaji katika tawi la ${
                      pickupBranch === 'mikocheni'
                        ? 'Mikocheni Flagship Showroom'
                        : 'Mwenge Central Yard'
                    } atawasiliana nawe ndani ya dakika 30 akiwa na chaguzi 3 za minada.`
                  : `Your import dossier reference is ${submittedRef}. Our Importation Desk at ${
                      pickupBranch === 'mikocheni'
                        ? 'Mikocheni Showroom'
                        : 'Mwenge Yard'
                    } will send 3 verified auction sheets to ${phone} within 30 minutes.`}
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/vehicles"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10"
                >
                  {locale === 'sw' ? 'Angalia Magari Yaliyopo Yard' : 'Browse Local Yard Stock'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setStep(1);
                  }}
                  className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                >
                  {locale === 'sw' ? 'Weka Ombi Jingine' : 'Create Another Request'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* STEP 1: VEHICLE TARGET */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-extrabold text-white">
                    {locale === 'sw'
                      ? 'Hatua ya 1: Chagua Nchi ya Chanzo na Aina ya Gari'
                      : 'Step 1: Select Origin Country & Target Vehicle Specs'}
                  </h2>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-300">
                      {locale === 'sw' ? 'Nchi ya Kuagiza (Country of Origin)' : 'Country of Origin'}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {(['Japan', 'UK', 'UAE', 'South Africa'] as OriginCountry[]).map(
                        (country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => setOrigin(country)}
                            className={`flex flex-col items-center rounded-2xl border p-3 text-center transition cursor-pointer ${
                              origin === country
                                ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                                : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/25'
                            }`}
                          >
                            <span className="text-2xl">
                              {SHIPPING_ESTIMATES[country].flag}
                            </span>
                            <span className="mt-1 text-xs">{country}</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        {locale === 'sw' ? 'Kampuni (Make)' : 'Make'}
                      </label>
                      <input
                        type="text"
                        required
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        {locale === 'sw' ? 'Muundo (Model)' : 'Model'}
                      </label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        Year From
                      </label>
                      <input
                        type="number"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 font-mono text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        Year To
                      </label>
                      <input
                        type="number"
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 font-mono text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        Engine CC
                      </label>
                      <input
                        type="text"
                        value={engineCc}
                        onChange={(e) => setEngineCc(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 font-mono text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        {locale === 'sw' ? 'Rangi Pendwa' : 'Preferred Color'}
                      </label>
                      <input
                        type="text"
                        value={preferredColor}
                        onChange={(e) => setPreferredColor(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BUDGETING IN TZS */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-extrabold text-white">
                    {locale === 'sw'
                      ? 'Hatua ya 2: Panga Bajeti Yako Kamili kwa Shilingi (TZS)'
                      : 'Step 2: Total All-Inclusive TZS Budget Cap'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {locale === 'sw'
                      ? 'Bajeti hii inajumuisha gharama ya kununua gari mnadani (FOB), usafirishaji wa meli hadi Bandari ya Dar es Salaam, ushuru wa TRA, na usajili wa namba.'
                      : 'Your budget cap covers FOB acquisition, Ro-Ro ocean freight to Dar es Salaam Port, estimated TRA TANSAD duty, and port clearing charges.'}
                  </p>

                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-amber-300">
                        {locale === 'sw'
                          ? 'Kiwango cha Bajeti Kamili (TZS)'
                          : 'Target Landed & Cleared Budget'}
                      </span>
                      <span className="font-mono text-2xl font-black text-white">
                        {formatTZS(totalBudgetTzs)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={25}
                      max={350}
                      step={5}
                      value={totalBudgetMillions}
                      onChange={(e) => setTotalBudgetMillions(Number(e.target.value))}
                      className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
                    />
                    <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-400">
                      <span>TZS 25M</span>
                      <span>TZS 150M</span>
                      <span>TZS 350M</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFICATION PREFERENCES */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-extrabold text-white">
                    {locale === 'sw'
                      ? 'Hatua ya 3: Chagua Viwango vya Ukaguzi na Bima ya Meli'
                      : 'Step 3: Pre-Shipment Verification & Marine Insurance'}
                  </h2>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantTbsPreInspection}
                      onChange={(e) => setWantTbsPreInspection(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-amber-400"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {locale === 'sw'
                          ? 'Ukaguzi wa TBS & JAAI Kabla ya Kupakiwa Meli (Mandatory Standard)'
                          : 'Mandatory JAAI / TBS Pre-Shipment Roadworthiness & Radiation Certificate'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {locale === 'sw'
                          ? 'Inahakikisha gari linakidhi viwango vyote vya Shirika la Viwango Tanzania (TBS).'
                          : 'Guarantees zero radiation, structural integrity, and full TBS compliance.'}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantAuctionVerification}
                      onChange={(e) => setWantAuctionVerification(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-amber-400"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {locale === 'sw'
                          ? 'Uhakiki wa Karatasi ya Mnada (Grade 4.0+ & Odometer Verification)'
                          : 'Verified Original Auction Sheet (Grade 4.0+ Minimum & Non-Tampered Odometer)'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {locale === 'sw'
                          ? 'Tunakutumia karatasi halisi ya mnada wa Japan/UK pamoja na tafsiri ya Kiswahili/Kiingereza.'
                          : 'We share the authentic auction house sheet before bidding on your behalf.'}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantMarineInsurance}
                      onChange={(e) => setWantMarineInsurance(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-amber-400"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {locale === 'sw'
                          ? 'Bima Kamili ya Safari ya Baharini (100% All-Risk Marine Insurance)'
                          : '100% Comprehensive All-Risk Ocean Marine Transit Insurance'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {locale === 'sw'
                          ? 'Ulinzi kamili wa gari lako tangu linapopakiwa meli hadi linapofika Mwenge au Mikocheni.'
                          : 'Full coverage from foreign port loading until handover in Dar es Salaam.'}
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* STEP 4: CUSTOMER DETAILS & PICKUP BRANCH */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-extrabold text-white">
                    {locale === 'sw'
                      ? 'Hatua ya 4: Mawasiliano Yako na Tawi la Kukabidhiwa Gari'
                      : 'Step 4: Client Contact & Dar es Salaam Handover Branch'}
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        {locale === 'sw' ? 'Jina Kamili' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Eng. / Dkt. / Bw. / Bi."
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        {locale === 'sw' ? 'Simu ya WhatsApp (+255)' : 'Phone / WhatsApp (+255)'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 font-mono text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@company.co.tz"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase text-slate-300">
                      {locale === 'sw'
                        ? 'Chagua Tawi la Kusaini Mkataba na Kuchukua Gari:'
                        : 'Preferred Dar es Salaam Pickup & Consultation Branch:'}
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPickupBranch('mikocheni')}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
                          pickupBranch === 'mikocheni'
                            ? 'border-amber-400 bg-amber-500/15'
                            : 'border-white/10 bg-black/40'
                        }`}
                      >
                        <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-white block">
                            Mikocheni Flagship Showroom
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            Old Bagamoyo Road (VIP Import Lounge)
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupBranch('mwenge')}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
                          pickupBranch === 'mwenge'
                            ? 'border-emerald-400 bg-emerald-500/15'
                            : 'border-white/10 bg-black/40'
                        }`}
                      >
                        <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-white block">
                            Mwenge Central Yard
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            Morogoro Rd / Sam Nujoma Junction
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{locale === 'sw' ? 'Rudi Nyuma' : 'Previous Step'}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-black text-slate-950 shadow hover:bg-amber-400 cursor-pointer"
                  >
                    <span>{locale === 'sw' ? 'Hatua Inayofuata' : 'Next Step'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg hover:brightness-110 cursor-pointer"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>
                      {locale === 'sw'
                        ? 'Wasilisha Ombi la Kuagiza Gari'
                        : 'Submit Custom Import Request'}
                    </span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Right 5 Columns: Live Estimation Engine (Reference Only) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 via-[#080C17] to-[#080C17] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase">
                    {locale === 'sw'
                      ? 'Makadirio ya Muda na Gharama (Live Estimator)'
                      : 'Live Shipping & TRA Cost Estimator'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {locale === 'sw'
                      ? 'Kwa Marejeleo Tu — Bei ya Mwisho Inafungwa Kwenye Mkataba'
                      : 'Reference Estimate — Final Landed Price Locked on Contract'}
                  </span>
                </div>
              </div>
              <span className="text-2xl">{SHIPPING_ESTIMATES[origin].flag}</span>
            </div>

            {/* Target Vehicle Summary */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase text-amber-400">
                {origin} DIRECT IMPORT SPECIFICATION
              </span>
              <div className="text-base font-extrabold text-white">
                {yearFrom}–{yearTo} {make} {model} ({engineCc} cc)
              </div>
              <p className="text-xs text-slate-400">
                {SHIPPING_ESTIMATES[origin].ports}
              </p>
            </div>

            {/* Transit & Port Clearance Windows */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  {locale === 'sw' ? 'Muda wa Meli:' : 'Ocean Transit Window:'}
                </span>
                <strong className="mt-1 block text-white">
                  {SHIPPING_ESTIMATES[origin].seaDays}
                </strong>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  {locale === 'sw' ? 'Ukombozi Bandari ya Dar:' : 'Dar Port Clearance:'}
                </span>
                <strong className="mt-1 block text-white">
                  {SHIPPING_ESTIMATES[origin].clearanceDays}
                </strong>
              </div>
            </div>

            {/* Transparent TZS Cost Breakdown */}
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>
                  {locale === 'sw'
                    ? '1. Makadirio ya Bei ya Mnada (FOB):'
                    : '1. Est. Vehicle FOB Allocation:'}
                </span>
                <span className="font-mono font-bold text-white">
                  {formatTZS(estimatedFobAllocationTzs)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>
                  {locale === 'sw'
                    ? `2. Meli & Bima (${origin} → Dar Port):`
                    : `2. Ro-Ro Freight & Marine Insurance:`}
                </span>
                <span className="font-mono font-bold text-sky-300">
                  {formatTZS(freightTzs)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>
                  {locale === 'sw'
                    ? '3. Makadirio ya Ushuru wa TRA (TANSAD):'
                    : '3. Est. TRA Customs Duty & VAT:'}
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {formatTZS(estimatedTraDutyTzs)}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>
                  {locale === 'sw'
                    ? '4. Bandari (TPA), TBS & Usajili wa Namba:'
                    : '4. TPA Port Charges, TBS & Plate Reg:'}
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {formatTZS(clearingAndPortTzs)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-2.5 flex items-baseline justify-between">
                <span className="font-bold text-white">
                  {locale === 'sw' ? 'Jumla ya Bajeti Iliyopangwa:' : 'Total Target Landed Cap:'}
                </span>
                <span className="font-mono text-lg font-black text-amber-400">
                  {formatTZS(totalBudgetTzs)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[11px] text-emerald-300">
              <Lock className="h-4 w-4 shrink-0" />
              <span>
                {locale === 'sw'
                  ? 'Ukishachagua gari mnadani, bei ya mkataba inafungwa (Owner Price Lock) bila ongezeko lolote hadi unakabidhiwa funguo.'
                  : 'Once your auction unit is selected, the landed TZS contract price is strictly owner-locked with zero hidden surcharges.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomImportRequestPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      <Navbar />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-20 text-center font-mono text-sm text-sky-400">
            Loading Bingwa Cars Foreign Importation Wizard...
          </div>
        }
      >
        <ImportWizardContent />
      </Suspense>
    </div>
  );
}

