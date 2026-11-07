'use client';

import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { BRAND_LIST } from '@/lib/data';
import { useBingwaStore } from '@/lib/store';

export default function BrandCarousel() {
  const { locale, selectedMake, setSelectedMake } = useBingwaStore();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list for seamless infinite flow-motion loop
  const loopedBrands = [...BRAND_LIST, ...BRAND_LIST];

  const handleSelectBrand = (brandName: string) => {
    if (selectedMake === brandName) {
      setSelectedMake('ALL');
    } else {
      setSelectedMake(brandName);
      const inv = document.getElementById('inventory');
      if (inv) {
        inv.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      aria-label="Supported Vehicle Brands Carousel"
      className="relative overflow-hidden border-b border-white/10 bg-[#070B14] py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {locale === 'sw'
                ? 'MAGARI YANAYOINGIZWA KWA WINGI TANZANIA'
                : 'DIRECT AUTHORIZED IMPORT & SHOWROOM BRANDS'}
            </span>
          </div>
          <h2 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
            {locale === 'sw'
              ? 'Bonyeza Kampuni Kuchuja Magari Yaliyopo Yard (Japan 🇯🇵 • UK 🇬🇧 • Germany 🇩🇪)'
              : 'Click Any Make Badge to Filter Live Yard Stock (Japan 🇯🇵 • UK 🇬🇧 • Germany 🇩🇪)'}
          </h2>
        </div>

        {selectedMake !== 'ALL' && (
          <button
            type="button"
            onClick={() => setSelectedMake('ALL')}
            className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
          >
            {locale === 'sw'
              ? `Kichujio: ${selectedMake} (Ondoa ×)`
              : `Active Filter: ${selectedMake} (Clear ×)`}
          </button>
        )}
      </div>

      {/* Infinite Marquee Track */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative flex w-full overflow-hidden py-2"
      >
        {/* Left & Right Edge Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-[#070B14] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-[#070B14] to-transparent" />

        <div
          className="flex gap-4 px-4"
          style={{
            width: 'max-content',
            animation: 'bingwaMarquee 38s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {loopedBrands.map((brand, idx) => {
            const isSelected = selectedMake === brand.name;
            return (
              <button
                key={`${brand.name}-${idx}`}
                type="button"
                onClick={() => handleSelectBrand(brand.name)}
                className={`group relative flex w-72 shrink-0 flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.02]'
                    : 'border-white/10 bg-slate-900/70 hover:border-white/30 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg"
                      title={brand.originCountry}
                    >
                      {brand.originFlag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-extrabold text-white group-hover:text-amber-300 transition">
                          {brand.name}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-amber-400 stroke-[3]" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        Origin: {brand.originCountry}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
                    {brand.inStockCount} {locale === 'sw' ? 'Magari' : 'In Stock'}
                  </span>
                </div>

                <p className="mt-3 truncate text-xs text-slate-400">
                  {brand.popularModels}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

