import countries from 'i18n-iso-countries';
import englishList from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(englishList);

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

let countryList = countries.getNames('en', { select: 'official' })
// ISO 3166-1 alpha-2 country codes
export const COUNTRIES: CountryOption[] = 
  Object.keys(countryList)
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