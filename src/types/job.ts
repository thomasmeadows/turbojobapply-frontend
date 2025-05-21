export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  applicationCount: number;
  featured: boolean;
  isRemote: string;
  country: string;
  external_url?: string;
}

export interface JobFilters {
  query: string;
  location: string;
  category: string;
  timeframe: 'today' | 'week' | 'month' | 'all';
  sortBy: 'newest' | 'oldest';
  isRemote: string;
  country: string;
}

export interface LocationOption {
  value: string;
  label: string;
  count: number;
}

export interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

export interface CountryOption {
  value: string;
  label: string;
  code: string;
}

// ISO 3166-1 alpha-2 country codes
export const COUNTRIES: CountryOption[] = [
  { value: 'US', label: 'United States of America', code: 'US' },
  { value: 'CA', label: 'Canada', code: 'CA' },
  { value: 'GB', label: 'United Kingdom', code: 'GB' },
  { value: 'AU', label: 'Australia', code: 'AU' },
  { value: 'DE', label: 'Germany', code: 'DE' },
  { value: 'FR', label: 'France', code: 'FR' },
  { value: 'ES', label: 'Spain', code: 'ES' },
  { value: 'IT', label: 'Italy', code: 'IT' },
  { value: 'JP', label: 'Japan', code: 'JP' },
  { value: 'IN', label: 'India', code: 'IN' },
  { value: 'BR', label: 'Brazil', code: 'BR' },
  { value: 'MX', label: 'Mexico', code: 'MX' },
  { value: 'NL', label: 'Netherlands', code: 'NL' },
  { value: 'SE', label: 'Sweden', code: 'SE' },
  { value: 'CH', label: 'Switzerland', code: 'CH' },
  { value: 'SG', label: 'Singapore', code: 'SG' },
  { value: 'AE', label: 'United Arab Emirates', code: 'AE' },
  { value: 'ZA', label: 'South Africa', code: 'ZA' },
  { value: 'NZ', label: 'New Zealand', code: 'NZ' },
  { value: 'IE', label: 'Ireland', code: 'IE' }
];