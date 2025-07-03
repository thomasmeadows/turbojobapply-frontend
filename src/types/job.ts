import countries from 'i18n-iso-countries';
import englishList from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(englishList);

export interface JobNavigation {
  atsType: string;
  urlSafeClientName?: string;
  clientName?: string;
  domain?: string;
  clientProject?: string;
  urlSafeJobTitle: string;
}

export interface Job {
  remote: boolean;
  bamboohr_requisition_id: any;
  greenhouseio_requisition_id: any;
  workday_requisition_id: any;
  adp_requisition_id: any;
  jobvite_requisition_id: any;
  breezy_requisition_id: any;
  lever_requisition_id: any;
  smartrecruiters_requisition_id: any;
  dover_requisition_id: any;
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
  applicationCount: number;
  posted_at: any;
  updated_at?: any;
  featured: boolean;
  country: string;
  external_url: string;
  source: string;
  navigation: JobNavigation;
  summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface JobSummaryRequest {
  ats_id: string;
  ats_type: string;
}

export interface JobSummaryResponse {
  ats_id: string;
  ats_type: string;
  summary: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface LocationOption {
  value: string;
  label: string;
  count: number;
}

export interface CountryOption {
  value: string;
  label: string;
  code: string;
}

const countryList = countries.getNames('en', { select: 'official' });
// ISO 3166-1 alpha-2 country codes
export const COUNTRIES: CountryOption[] = Object.keys(countryList)
  .map((key) => ({ value: key, label: countryList[key], code: key }))
  .sort((a, b) => {
    const nameA = a.label.toUpperCase(); // ignore upper and lowercase
    const nameB = b.label.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
