// Package and Pricing Store for Rijschool TEEZ
// Enables the instructor to update package prices, lesson counts, and single rates from the Admin Portal

export interface PackagePlan {
  id: string;
  name: string;
  tag: string;
  price: number;
  lessons: number;
  popular?: boolean;
  features: string[];
  desc?: string;
}

export interface SingleRates {
  hourlyRate: number;      // Losse les 60 min
  rate90Min: number;        // Losse les 90 min
  cbrExam: number;          // CBR Praktijkexamen
  tttExam: number;          // Tussentijdse toets
  theoryCourse?: number;    // Theoriecursus
}

export interface PricingData {
  packages: PackagePlan[];
  singleRates: SingleRates;
}

export const DEFAULT_PACKAGES: PackagePlan[] = [
  {
    id: 'Pakket T',
    name: 'PAKKET T',
    tag: 'Instap',
    price: 1550,
    lessons: 20,
    popular: false,
    desc: '20 lessen + CBR praktijkexamen',
    features: [
      '20 Rijlessen (60 min)',
      'Theoriemateriaal',
      'Tussentijdse toets (TTT)',
      'CBR Praktijkexamen',
      'Gratis intakeles',
    ],
  },
  {
    id: 'Pakket EE',
    name: 'PAKKET EE',
    tag: 'Aanrader',
    price: 2050,
    lessons: 30,
    popular: true,
    desc: '30 lessen + TTT + praktijkexamen',
    features: [
      '30 Rijlessen (60 min)',
      'Theoriemateriaal',
      'Tussentijdse toets (TTT)',
      'CBR Praktijkexamen',
      'Gratis intakeles',
    ],
  },
  {
    id: 'Pakket Z',
    name: 'PAKKET Z',
    tag: 'Compleet',
    price: 2470,
    lessons: 38,
    popular: false,
    desc: '38 lessen + TTT + praktijkexamen',
    features: [
      '38 Rijlessen (60 min)',
      'Theoriemateriaal',
      'Tussentijdse toets (TTT)',
      'CBR Praktijkexamen',
      'Gratis intakeles',
    ],
  },
];

export const DEFAULT_SINGLE_RATES: SingleRates = {
  hourlyRate: 55,
  rate90Min: 82.50,
  cbrExam: 280,
  tttExam: 240,
  theoryCourse: 99,
};

const PRICING_STORAGE_KEY = 'teez_pricing_data_v1';

export function getPricingData(): PricingData {
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (!raw) {
      const initial: PricingData = {
        packages: DEFAULT_PACKAGES,
        singleRates: DEFAULT_SINGLE_RATES,
      };
      localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      packages: parsed.packages || DEFAULT_PACKAGES,
      singleRates: { ...DEFAULT_SINGLE_RATES, ...parsed.singleRates },
    };
  } catch {
    return {
      packages: DEFAULT_PACKAGES,
      singleRates: DEFAULT_SINGLE_RATES,
    };
  }
}

export function savePricingData(data: PricingData): void {
  localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(data));
  // Dispatch custom storage event for real-time reactivity across tabs/components
  window.dispatchEvent(new Event('teez_pricing_updated'));
}

export function resetPricingToDefaults(): PricingData {
  const defaults: PricingData = {
    packages: DEFAULT_PACKAGES,
    singleRates: DEFAULT_SINGLE_RATES,
  };
  savePricingData(defaults);
  return defaults;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
