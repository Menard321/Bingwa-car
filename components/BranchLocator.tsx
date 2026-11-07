'use client';

import React from 'react';
import {
  MapPin,
  PhoneCall,
  Navigation,
  Clock,
  Car,
  MessageSquare,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react';
import { useBingwaStore } from '@/lib/store';
import { BranchId } from '@/lib/data';

interface BranchDetail {
  id: Exclude<BranchId, 'all' | 'transit'>;
  nameSw: string;
  nameEn: string;
  corridorSw: string;
  corridorEn: string;
  capacitySw: string;
  capacityEn: string;
  hoursSw: string;
  hoursEn: string;
  phone: string;
  whatsapp: string;
  coordinates: string;
  googleMapsUrl: string;
  specialtiesSw: string[];
  specialtiesEn: string[];
  badgeColor: string;
  imageUrl: string;
}

const DAR_BRANCHES: BranchDetail[] = [
  {
    id: 'mwenge',
    nameSw: 'Tawi la Mwenge (Mwenge Central Yard)',
    nameEn: 'Mwenge Central Yard (Main Stock Yard)',
    corridorSw: 'Barabara ya Morogoro / Makutano ya Sam Nujoma Road, Mwenge, Dar es Salaam',
    corridorEn: 'Along Morogoro Road / Sam Nujoma Junction, Mwenge, Dar es Salaam',
    capacitySw: 'Uwezo wa Yard: Magari 60+ Tayari Kuondoka',
    capacityEn: 'Yard Capacity: 60+ Vehicles Ready for Drive-Away',
    hoursSw: 'Jumatatu – Jumamosi: Saa 2:00 Asubuhi – Saa 12:30 Jioni',
    hoursEn: 'Mon – Sat: 8:00 AM – 6:30 PM EAT',
    phone: '+255 754 889 900',
    whatsapp: '255754889900',
    coordinates: 'PostGIS: -6.7724° S, 39.2284° E',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=-6.7724,39.2284',
    specialtiesSw: [
      '4x4 Double Cabin Pick-ups (Hilux Rocco, Ranger, D-Max)',
      'Mid-Size SUVs (Subaru Forester, Harrier, Rav4, X-Trail)',
      'Ofisi ya Ukaguzi wa TBS & Usajili wa Kadi za TRA',
    ],
    specialtiesEn: [
      '4x4 Double Cabin Pick-ups (Hilux Rocco, Ranger, D-Max)',
      'Mid-Size SUVs (Subaru Forester, Harrier, RAV4, X-Trail)',
      'On-site TBS Inspection Bay & TRA TIN Transfer Desk',
    ],
    badgeColor: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    imageUrl:
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mikocheni',
    nameSw: 'Tawi la Mikocheni (Mikocheni Flagship Showroom)',
    nameEn: 'Mikocheni Flagship Showroom (Executive Lounge)',
    corridorSw: 'Barabara ya Old Bagamoyo (Karibu na Shoppers Plaza), Mikocheni, Dar es Salaam',
    corridorEn: 'Along Old Bagamoyo Road (Near Shoppers Plaza), Mikocheni, Dar es Salaam',
    capacitySw: 'Luxury & Executive SUV Indoor Showroom (Magari 35+)',
    capacityEn: 'Luxury & Executive SUV Indoor Showroom (35+ Flagship Units)',
    hoursSw: 'Jumatatu – Jumapili: Saa 2:30 Asubuhi – Saa 1:00 Usiku',
    hoursEn: 'Mon – Sun: 8:30 AM – 7:00 PM EAT',
    phone: '+255 767 224 400',
    whatsapp: '255767224400',
    coordinates: 'PostGIS: -6.7612° S, 39.2618° E',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=-6.7612,39.2618',
    specialtiesSw: [
      'Executive SUVs (Land Cruiser 300, Prado TX-L, Defender 110)',
      'German Luxury (Mercedes-Benz GLE/G-Wagon, BMW X5 M-Sport)',
      'VIP Custom Import Consultation Lounge (Japan & UK)',
    ],
    specialtiesEn: [
      'Executive SUVs (Land Cruiser 300, Prado TX-L, Defender 110)',
      'German Luxury (Mercedes-Benz GLE/G-Wagon, BMW X5 M-Sport)',
      'VIP Custom Import Consultation Lounge (Japan & UK)',
    ],
    badgeColor: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    imageUrl:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function BranchLocator() {
  const { locale, selectedBranch, setSelectedBranch } = useBingwaStore();

  const handleFilterByBranch = (branchId: 'mwenge' | 'mikocheni') => {
    setSelectedBranch(branchId);
    const inv = document.getElementById('inventory');
    if (inv) {
      inv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="branches"
      className="relative border-b border-white/10 bg-[#050811] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase">
              <MapPin className="h-3.5 w-3.5" />
              <span>DAR ES SALAAM MULTI-BRANCH NETWORK (POSTGIS GEOCODED)</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
              {locale === 'sw'
                ? 'Ofisi Zetu Dar es Salaam — "Nielekeze Ofisini"'
                : 'Interactive Dar es Salaam Branch Locator ("Nielekeze Ofisini")'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              {locale === 'sw'
                ? 'Tembelea yard yetu kuu ya Mwenge au Showroom ya kisasa ya Mikocheni. Unataka gari lililopo Mwenge liletwe Mikocheni ukague? Tunakuhamishia ndani ya saa 2 bure!'
                : 'Visit our high-capacity Mwenge Central Yard or our climate-controlled Mikocheni Executive Showroom. Free 2-hour inter-branch vehicle transfer on request.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300">
            <ArrowRightLeft className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              {locale === 'sw'
                ? 'Huduma ya Uhamisho wa Gari Kati ya Mwenge ↔ Mikocheni (Saa 2 Bure)'
                : 'Free 2-Hour Inter-Branch Viewing Transfer (Mwenge ↔ Mikocheni)'}
            </span>
          </div>
        </div>

        {/* Split Grid Branch Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {DAR_BRANCHES.map((branch) => {
            const isCurrentlyFiltered = selectedBranch === branch.id;
            return (
              <div
                key={branch.id}
                className={`flex flex-col justify-between overflow-hidden rounded-3xl border bg-[#080C17] transition-all ${
                  isCurrentlyFiltered
                    ? 'border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.18)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div>
                  {/* Visual Map & Yard Header Banner */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={branch.imageUrl}
                      alt={locale === 'sw' ? branch.nameSw : branch.nameEn}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C17] via-[#080C17]/50 to-transparent" />

                    {/* Top PostGIS Telemetry & Capacity Badge */}
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${branch.badgeColor}`}
                      >
                        <Car className="h-3.5 w-3.5" />
                        <span>
                          {locale === 'sw' ? branch.capacitySw : branch.capacityEn}
                        </span>
                      </span>

                      <span className="rounded-lg bg-black/80 border border-white/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                        {branch.coordinates}
                      </span>
                    </div>

                    {/* Visual Radar Map Pin Overlay */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white sm:text-2xl">
                          {locale === 'sw' ? branch.nameSw : branch.nameEn}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>
                            {locale === 'sw' ? branch.corridorSw : branch.corridorEn}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Branch Details & Specialties */}
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 sm:grid-cols-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">
                            {locale === 'sw' ? 'Muda wa Kazi:' : 'Working Hours:'}
                          </span>
                          <span className="text-slate-300">
                            {locale === 'sw' ? branch.hoursSw : branch.hoursEn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">
                            {locale === 'sw' ? 'Simu ya Moja kwa Moja:' : 'Direct Branch Line:'}
                          </span>
                          <a
                            href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                            className="font-mono font-bold text-emerald-400 hover:underline"
                          >
                            {branch.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Branch Specialties List */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {locale === 'sw'
                          ? 'aina kuu za magari kwenye tawi hili:'
                          : 'Branch Inventory Specialties:'}
                      </p>
                      <ul className="space-y-1.5">
                        {(locale === 'sw'
                          ? branch.specialtiesSw
                          : branch.specialtiesEn
                        ).map((spec, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-slate-300"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Footer: GPS Deep Link, WhatsApp & Filter Stock */}
                <div className="border-t border-white/10 bg-black/40 p-5 space-y-3">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-xs font-black text-slate-950 shadow hover:brightness-110 transition"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>
                        {locale === 'sw'
                          ? 'Nielekeze Ofisini (Google Maps)'
                          : 'Navigate to Yard (GPS)'}
                      </span>
                    </a>

                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                        `Habari Bingwa Cars (${branch.nameSw}), naomba maelekezo ya kufika ofisini kuona magari.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {locale === 'sw' ? 'WhatsApp Tawi Hili' : 'WhatsApp Branch Desk'}
                      </span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFilterByBranch(branch.id)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-white transition cursor-pointer"
                  >
                    {locale === 'sw'
                      ? `Onyesha Magari Yaliyopo ${
                          branch.id === 'mwenge' ? 'Mwenge Yard' : 'Mikocheni Showroom'
                        } Pekee →`
                      : `Filter Catalog by ${
                          branch.id === 'mwenge' ? 'Mwenge Yard' : 'Mikocheni Showroom'
                        } Stock →`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

