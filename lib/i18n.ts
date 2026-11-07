'use client';

import { useBingwaStore } from './store';

export const DICTIONARY = {
  sw: {
    'nav.stock': 'Magari Yaliyopo',
    'nav.catalog': 'Katalogi Kamili',
    'nav.import': 'Agiza Gari (Japan/UK)',
    'nav.showroom3d': '3D Showroom',
    'nav.branches': 'Ofisi Zetu',
    'nav.admin': 'Executive Portal',
    'price.lockedBadge': 'Bei ya Mmiliki — Bei Kamili Isiyo na Madalali',
    'price.statutoryIncluded': 'Inajumuisha Ushuru wa TRA (TANSAD), TBS & Usajili wa Namba',
    'catalog.zeroStateTitle':
      'Hatujaona gari linalolingana na vigezo hivi kwa sasa — Ungependa kuliagiza moja kwa moja kutoka Japan/UK?',
    'catalog.zeroStateCta': 'Agiza Gari Hili Moja kwa Moja (Custom Import Wizard)',
    'transfer.requestMikocheni': 'Niletee Gari Tawi la Mikocheni (Bure Saa 2)',
    'transfer.requestMwenge': 'Niletee Gari Tawi la Mwenge (Bure Saa 2)',
  },
  en: {
    'nav.stock': 'Available Stock',
    'nav.catalog': 'Full Catalog',
    'nav.import': 'Custom Import (Japan/UK)',
    'nav.showroom3d': '3D Showroom',
    'nav.branches': 'Branch Locator',
    'nav.admin': 'Executive Portal',
    'price.lockedBadge': 'Owner-Locked Price — Zero Broker Markup',
    'price.statutoryIncluded': 'Includes 100% TRA Customs Duty (TANSAD), TBS & Plate Registration',
    'catalog.zeroStateTitle':
      'No vehicles match these exact specifications right now — Would you like us to import it directly from Japan or the UK?',
    'catalog.zeroStateCta': 'Launch Custom Foreign Import Wizard',
    'transfer.requestMikocheni': 'Transfer Vehicle to Mikocheni Showroom (Free 2-Hr)',
    'transfer.requestMwenge': 'Transfer Vehicle to Mwenge Yard (Free 2-Hr)',
  },
} as const;

export type TranslationKey = keyof typeof DICTIONARY.sw;

export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useBingwaStore();

  const t = (key: TranslationKey): string => {
    return DICTIONARY[locale][key] ?? key;
  };

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
  };
}

