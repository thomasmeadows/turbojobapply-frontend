import type { JobNavigation } from '../types/job';

/**
 * Generate SEO-friendly URL for a job based on its navigation data
 * Navigation data is required for all job URLs
 */
export function generateJobUrl(jobId: string, navigation: JobNavigation): string {
  if (!navigation) {
    throw new Error('Navigation data is required to generate job URLs');
  }

  const { atsType, urlSafeClientName, clientName, domain, clientProject, urlSafeJobTitle } = navigation;
  console.log(navigation);

  switch (atsType) {
    case 'adp':
      return `/ats/adp/${urlSafeClientName}/job/${urlSafeJobTitle}`;

    case 'bamboo':
      return `/ats/bamboo/${clientName}/job/${urlSafeJobTitle}`;

    case 'breezy':
      return `/ats/breezy/${clientName}/job/${urlSafeJobTitle}`;

    case 'dover':
      return `/ats/dover/${urlSafeClientName}/job/${urlSafeJobTitle}`;

    case 'greenhouse':
      return `/ats/greenhouse/${clientName}/job/${urlSafeJobTitle}`;

    case 'jobvite':
      return `/ats/jobvite/${clientName}/job/${urlSafeJobTitle}`;

    case 'lever':
      return `/ats/lever/${clientName}/job/${urlSafeJobTitle}`;

    case 'smartrecruiters':
      return `/ats/smartrecruiters/${clientName}/job/${urlSafeJobTitle}`;

    case 'workday':
      return `/ats/workday/${domain}/${clientName}/${clientProject}/job/${urlSafeJobTitle}`;

    default:
      throw new Error(`Unknown ATS type: ${atsType}. Cannot generate URL.`);
  }
}

/**
 * Generate SEO-friendly client URL based on ATS type and navigation data
 */
export function generateClientUrl(navigation: JobNavigation): string {
  const { atsType, urlSafeClientName, clientName, domain, clientProject } = navigation;

  switch (atsType) {
    case 'adp':
      return `/ats/adp/${urlSafeClientName}`;

    case 'bamboo':
      return `/ats/bamboo/${clientName}`;

    case 'breezy':
      return `/ats/breezy/${clientName}`;

    case 'dover':
      return `/ats/dover/${urlSafeClientName}`;

    case 'greenhouse':
      return `/ats/greenhouse/${clientName}`;

    case 'jobvite':
      return `/ats/jobvite/${clientName}`;

    case 'lever':
      return `/ats/lever/${clientName}`;

    case 'smartrecruiters':
      return `/ats/smartrecruiters/${clientName}`;

    case 'workday':
      return `/ats/workday/${domain}/${clientName}/${clientProject}`;

    default:
      return '#';
  }
}
