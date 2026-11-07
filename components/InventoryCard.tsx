'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Lock,
  ShieldCheck,
  Gauge,
  Fuel,
  Cog,
  Eye,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { Vehicle, formatTZS } from '@/lib/data';
import { useBingwaStore } from '@/lib/store';

interface InventoryCardProps {
  vehicle: Vehicle;
}

export default function InventoryCard({ vehicle }: InventoryCardProps) {
  const { locale } = useBingwaStore();
  const [angleIndex, setAngleIndex] = useState(0);

  const angleLabelsSw = ['Mbele (3/4 Front)', 'Ubavu / Ndani (Side)', 'Nyuma (Rear Spec)'];
  const angleLabelsEn = ['Front 3/4 Angle', 'Profile / Cabin', 'Rear & Chassis'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAngleIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAngleIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const branchBadgeStyles =
    vehicle.branchId === 'mikocheni'
      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
      : vehicle.branchId === 'mwenge'
      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
      : 'border-sky-500/40 bg-sky-500/15 text-sky-300';

  const whatsappBookingUrl = `https://wa.me/255754889900?text=${encodeURIComponent(
    `Habari Bingwa Cars, nahitaji Test Drive / Kuweka Oda ya ${vehicle.year} ${vehicle.title} (VIN: ${vehicle.vin}, Bei: ${formatTZS(
      vehicle.priceTzs
    )}) iliyopo ${vehicle.branchLabel.sw}. Ref: ${vehicle.priceAudit.tansadRef}`
  )}`;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#080C17] transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      {/* Top 3-Angle Image Carousel with Hover Zoom */}
      <div>
        <div className="relative h-60 w-full overflow-hidden bg-slate-950">
          <img
            src={vehicle.images[angleIndex]}
            alt={`${vehicle.title} - Angle ${angleIndex + 1}`}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C17] via-transparent to-black/40" />

          {/* Top Badges: Branch Location & Auction Grade */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold backdrop-blur-md ${branchBadgeStyles}`}
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {vehicle.branchId === 'mikocheni'
                  ? 'Mikocheni Showroom'
                  : vehicle.branchId === 'mwenge'
                  ? 'Mwenge Yard'
                  : 'Dar Port / TRA'}
              </span>
            </span>

            <span className="rounded-full bg-black/80 border border-white/15 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300 backdrop-blur-md">
              {vehicle.auctionGrade}
            </span>
          </div>

          {/* Left / Right Carousel Controls */}
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous vehicle angle"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next vehicle angle"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Bottom 3-Angle Selector Pills */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 backdrop-blur-md border border-white/10">
              {vehicle.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAngleIndex(idx)}
                  aria-label={`Select angle ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    angleIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white'
                  }`}
                />
              ))}
              <span className="ml-1 font-mono text-[10px] text-slate-300">
                {locale === 'sw' ? angleLabelsSw[angleIndex] : angleLabelsEn[angleIndex]}
              </span>
            </div>

            <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
              {vehicle.year}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-5 space-y-4">
          {/* Verification Tag & VIN */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              {locale === 'sw'
                ? vehicle.verificationBadge.sw
                : vehicle.verificationBadge.en}
            </span>
            <span className="font-mono text-slate-400">VIN: {vehicle.vin}</span>
          </div>

          {/* Vehicle Title */}
          <div>
            <Link
              href={`/vehicles/${encodeURIComponent(vehicle.vin)}`}
              className="text-lg font-extrabold text-white group-hover:text-amber-300 transition line-clamp-1"
            >
              {vehicle.title}
            </Link>
            <p className="mt-0.5 text-xs text-slate-400">
              {vehicle.engineSpec} • {locale === 'sw' ? vehicle.registrationStatus.sw : vehicle.registrationStatus.en}
            </p>
          </div>

          {/* Key Mechanical Specs Grid */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Gauge className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-mono">
                {vehicle.mileageKm.toLocaleString()} km
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Fuel className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Cog className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{vehicle.driveTrain}</span>
            </div>
          </div>

          {/* STRICT OWNER-PRICE LOCK DISPLAY */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 p-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                {locale === 'sw'
                  ? 'Bei ya Mmiliki — Hakuna Kodi Iliyofichika'
                  : 'Owner Price Locked — Fixed Genuine Price'}
              </span>
              <span className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                {vehicle.priceAudit.tansadRef}
              </span>
            </div>

            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-black tracking-tight text-white">
                {formatTZS(vehicle.priceTzs)}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <FileCheck2 className="h-3 w-3" />
                {locale === 'sw' ? 'Ushuru 100% Tayari' : 'Duty Paid'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Action Buttons Footer */}
      <div className="grid grid-cols-2 gap-2.5 border-t border-white/10 bg-black/30 p-4">
        <Link
          href={`/vehicles/${encodeURIComponent(vehicle.vin)}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-bold text-white hover:border-amber-400 hover:bg-white/10 transition"
        >
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          <span>
            {locale === 'sw' ? 'Tazama Gari & 360°' : 'Details & 360°'}
          </span>
        </Link>

        <a
          href={whatsappBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-black text-slate-950 shadow hover:from-emerald-400 hover:to-emerald-500 transition"
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          <span>
            {locale === 'sw' ? 'Omba Test Drive' : 'Book Test Drive'}
          </span>
        </a>
      </div>
    </article>
  );
}
