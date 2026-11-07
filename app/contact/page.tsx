'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import BranchLocator from '@/components/BranchLocator';
import { PhoneCall, Mail, Clock, MapPin, ShieldCheck, Building2 } from 'lucide-react';
import { useBingwaStore } from '@/lib/store';

export default function ContactPage() {
  const { locale } = useBingwaStore();

  const branchContacts = [
    {
      name: 'Mwenge Central Yard (HQ)',
      road: 'Morogoro Road / Sam Nujoma Junction, Dar es Salaam',
      phonePrimary: '+255 754 889 900',
      phoneSecondary: '+255 688 441 200',
      email: 'mwenge@bingwacars.co.tz',
      hours: 'Mon – Sat: 08:00 AM – 06:30 PM | Sun: 10:00 AM – 04:00 PM',
      badge: locale === 'sw' ? 'Makao Makuu & Yard Kuu' : 'Central Yard & Fleet HQ',
    },
    {
      name: 'Mikocheni Flagship Showroom',
      road: 'Old Bagamoyo Road, Near Warioba Street, Dar es Salaam',
      phonePrimary: '+255 767 990 111',
      phoneSecondary: '+255 713 550 888',
      email: 'mikocheni@bingwacars.co.tz',
      hours: 'Mon – Sat: 08:30 AM – 07:00 PM | Sun: By Appointment',
      badge: locale === 'sw' ? 'Showroom ya Kifahari (VIP)' : 'Executive & Diplomatic Showroom',
    },
    {
      name: 'Dar es Salaam Port & TRA Customs Desk',
      road: 'Sokoine Drive / TPA Gate 3 Clearing Office, Dar es Salaam',
      phonePrimary: '+255 784 220 555',
      phoneSecondary: '+255 755 119 400',
      email: 'customs@bingwacars.co.tz',
      hours: 'Mon – Fri: 08:00 AM – 05:00 PM | Sat: 09:00 AM – 01:00 PM',
      badge: locale === 'sw' ? 'Idara ya Forodha (TRA & TBS)' : 'TRA TANSAD & Port Logistics',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>
              {locale === 'sw'
                ? 'ORODHA YA NAMBA ZA SIMU & OFISI ZETU'
                : 'OFFICIAL BRANCH CONTACT DIRECTORY'}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {locale === 'sw'
              ? 'Wasiliana na Matawi ya Bingwa Cars (Dar es Salaam)'
              : 'Contact Our Dar es Salaam Yards & Customs Desk'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
            {locale === 'sw'
              ? 'Piga simu moja kwa moja au tembelea tawi letu la Mwenge au Mikocheni kwa ukaguzi wa gari na huduma za uagizaji.'
              : 'Reach our Mwenge Central Yard, Mikocheni Flagship Showroom, or Dar Port TRA Clearing Desk directly via the verified numbers below.'}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {branchContacts.map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#090E1A] p-6 shadow-2xl space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{item.badge}</span>
                  </span>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">{item.name}</h2>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.road}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/50 p-4 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'sw' ? 'Namba za Simu za Moja kwa Moja:' : 'Direct Telephone Lines:'}
                  </div>
                  <a
                    href={`tel:${item.phonePrimary.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 font-mono text-base font-black text-amber-400 hover:underline"
                  >
                    <PhoneCall className="h-4 w-4 text-emerald-400" />
                    <span>{item.phonePrimary}</span>
                  </a>
                  <a
                    href={`tel:${item.phoneSecondary.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 font-mono text-sm font-bold text-slate-200 hover:underline"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.phoneSecondary}</span>
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="font-mono">{item.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Interactive Branch Locator & GPS Directions */}
      <BranchLocator />
    </div>
  );
}

