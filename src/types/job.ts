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
}

export interface JobFilters {
  query: string;
  location: string;
  category: string;
  timeframe: 'today' | 'week' | 'month' | 'all';
  sortBy: 'newest' | 'oldest';
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