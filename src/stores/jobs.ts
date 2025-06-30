import { defineStore } from 'pinia';
import type { Job, LocationOption, CountryOption } from '../types/job';
import { COUNTRIES } from '../types/job';
const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

interface UserConfig {
  ipLocation: {
    country: string | null;
    city: string | null;
    state: string | null;
  };
}

interface JobStatistics {
  total: number;
  usJobs: number;
  remoteUsJobs: number;
}

interface JobsState {
  jobs: Job[];
  firstSearch: boolean;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  savedJobs: string[];
  bookmarkedJobs: any[];
  bookmarkedJobIds: Set<number>;
  currentJob: Job | null;
  loading: boolean;
  bookmarksLoading: boolean;
  error: string | null;
  query: string;
  location: string;
  selectedLocation: any;
  city: string;
  state: string;
  zip: string;
  isRemote: string;
  country: string;
  userConfig: UserConfig | null;
  jobSource: string;
  statistics: JobStatistics | null;
}

export const useJobsStore = defineStore('jobs', {
  state: (): JobsState => ({
    jobs: [],
    firstSearch: true,
    savedJobs: JSON.parse(localStorage.getItem('savedJobs') || '[]'),
    bookmarkedJobs: [],
    bookmarkedJobIds: new Set(),
    currentJob: null,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    loading: false,
    bookmarksLoading: false,
    error: null,
    query: '',
    location: '',
    selectedLocation: null,
    city: '',
    state: '',
    zip: '',
    isRemote: '',
    country: 'US',
    userConfig: null,
    jobSource: '',
    statistics: null
  }),

  getters: {
    locations(): LocationOption[] {
      const locations = new Set<string>();
      this.jobs.forEach((job) => locations.add(job.location));
      return Array.from(locations).map((loc) => ({
        value: loc,
        label: loc,
        count: this.jobs.filter((job) => job.location === loc).length
      }));
    },

    countries(): CountryOption[] {
      return COUNTRIES;
    },

    savedJobsList(): Job[] {
      return this.jobs.filter((job) => this.savedJobs.includes(job.id));
    },

    getSourceName() {
      return (job: Job) => {
        if (job.bamboohr_requisition_id) {
          return 'BambooHR';
        }
        if (job.greenhouseio_requisition_id) {
          return 'GreenhouseIO';
        }
        if (job.workday_requisition_id) {
          return 'Workday';
        }
        if (job.adp_requisition_id) {
          return 'ADP';
        }
        if (job.jobvite_requisition_id) {
          return 'Jobvite';
        }
        if (job.breezy_requisition_id) {
          return 'Breezy';
        }
        if (job.lever_requisition_id) {
          return 'Lever';
        }
        if (job.smartrecruiters_requisition_id) {
          return 'SmartRecruiters';
        }
        if (job.dover_requisition_id) {
          return 'Dover';
        }
        return 'Unknown';
      };
    },

    getJobSource() {
      return (job: Job) => {
        if (job.bamboohr_requisition_id) {
          return 'bamboohr';
        }
        if (job.greenhouseio_requisition_id) {
          return 'greenhouseio';
        }
        if (job.workday_requisition_id) {
          return 'workday';
        }
        if (job.adp_requisition_id) {
          return 'adp';
        }
        if (job.jobvite_requisition_id) {
          return 'jobvite';
        }
        if (job.breezy_requisition_id) {
          return 'breezy';
        }
        if (job.lever_requisition_id) {
          return 'lever';
        }
        if (job.smartrecruiters_requisition_id) {
          return 'smartrecruiters';
        }
        if (job.dover_requisition_id) {
          return 'dover';
        }
        return '';
      };
    },

    getJobRequisitionId() {
      return (job: Job) => {
        if (job.bamboohr_requisition_id) {
          return job.bamboohr_requisition_id;
        }
        if (job.greenhouseio_requisition_id) {
          return job.greenhouseio_requisition_id;
        }
        if (job.workday_requisition_id) {
          return job.workday_requisition_id;
        }
        if (job.adp_requisition_id) {
          return job.adp_requisition_id;
        }
        if (job.jobvite_requisition_id) {
          return job.jobvite_requisition_id;
        }
        if (job.breezy_requisition_id) {
          return job.breezy_requisition_id;
        }
        if (job.lever_requisition_id) {
          return job.lever_requisition_id;
        }
        if (job.smartrecruiters_requisition_id) {
          return job.smartrecruiters_requisition_id;
        }
        if (job.dover_requisition_id) {
          return job.dover_requisition_id;
        }
        return null;
      };
    },

    isJobBookmarked() {
      return (job: Job) => {
        const requisitionId = this.getJobRequisitionId(job);
        return requisitionId ? this.bookmarkedJobIds.has(requisitionId) : false;
      };
    }
  },

  actions: {
    async fetchUserConfig() {
      try {
        const response = await axios.get(`${API_URL}/api/users/config`);
        this.userConfig = response.data;

        // If we have country info from IP, update the country filter
        if (this.userConfig?.ipLocation?.country) {
          this.country = this.userConfig.ipLocation.country;
        }
        if (!this.country) {
          this.country = 'US';
        }
      } catch (error) {
        console.error('Failed to fetch user config:', error);
      }
    },

    async fetchJobs(currentPage: number = 1) {
      if (!this.query) {
        return;
      }
      this.loading = true;
      this.firstSearch = false;
      this.currentPage = currentPage || 1;
      this.offset = (currentPage - 1) * this.limit;
      this.totalJobs = 0;
      this.jobs = [];
      this.error = null;

      try {
        // Build query parameters from filters
        const params = new URLSearchParams();
        if (this.query) params.append('q', this.query);
        if (this.location) params.append('location', this.location);
        if (this.city) params.append('city', this.city);
        if (this.state) params.append('state', this.state);
        if (this.zip) params.append('zip', this.zip);
        if (this.isRemote) params.append('isRemote', this.isRemote);
        if (this.country) params.append('country', this.country);
        if (this.jobSource) params.append('source', this.jobSource);
        if (this.offset) params.append('offset', this.offset.toString());

        const response = await axios.get(
          `${API_URL}/api/requisitions/search?${params.toString()}`
        );
        // Map the search results to include navigation data
        this.jobs = response.data.data.map((job: any) => ({
          ...job,
          navigation: job.navigation || {
            atsType: 'unknown',
            urlSafeJobTitle: `job-${job.id}`
          }
        }));
        this.totalJobs = response.data.total;
        this.limit = response.data.limit;
        this.offset = response.data.offset;
        this.totalPages = Math.floor(this.totalJobs / this.limit) + 1;
      } catch (_error: any) {
        this.error =
          'Failed to fetch jobs. Please try again. ' + _error.message;
      } finally {
        this.loading = false;
      }
    },

    updateSearchOptions(query: string, country: string, isRemote: string) {
      this.query = query;
      this.country = country;
      this.isRemote = isRemote;
    },

    // Fetch job details using SEO-friendly routes
    async fetchJobBySeoRoute(route: any) {
      this.loading = true;
      this.error = null;

      try {
        let apiUrl = '';

        // Construct API URL based on route parameters
        if (route.name === 'ADPJobDetails') {
          apiUrl = `${API_URL}/api/ats/adp/${route.params.urlSafeClientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'BambooJobDetails') {
          apiUrl = `${API_URL}/api/ats/bamboo/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'BreezyJobDetails') {
          apiUrl = `${API_URL}/api/ats/breezy/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'DoverJobDetails') {
          apiUrl = `${API_URL}/api/ats/dover/${route.params.urlSafeClientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'GreenhouseJobDetails') {
          apiUrl = `${API_URL}/api/ats/greenhouse/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'JobviteJobDetails') {
          apiUrl = `${API_URL}/api/ats/jobvite/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'LeverJobDetails') {
          apiUrl = `${API_URL}/api/ats/lever/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'SmartRecruitersJobDetails') {
          apiUrl = `${API_URL}/api/ats/smartrecruiters/${route.params.clientName}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else if (route.name === 'WorkdayJobDetails') {
          apiUrl = `${API_URL}/api/ats/workday/${route.params.domain}/${route.params.clientName}/${route.params.clientProject}/job/${route.params.urlSafeJobTitlePlusId}`;
        } else {
          throw new Error('Unknown route type for SEO job fetching');
        }

        const response = await axios.get(apiUrl);
        const jobData = response.data.job;
        const clientData = response.data.client;

        // Map the API response to our frontend job structure
        this.currentJob = {
          bamboohr_requisition_id:
            jobData.atsType === 'bamboo' ? jobData.id : null,
          greenhouseio_requisition_id:
            jobData.atsType === 'greenhouse' ? jobData.id : null,
          workday_requisition_id:
            jobData.atsType === 'workday' ? jobData.id : null,
          adp_requisition_id: jobData.atsType === 'adp' ? jobData.id : null,
          jobvite_requisition_id:
            jobData.atsType === 'jobvite' ? jobData.id : null,
          breezy_requisition_id:
            jobData.atsType === 'breezy' ? jobData.id : null,
          lever_requisition_id: jobData.atsType === 'lever' ? jobData.id : null,
          smartrecruiters_requisition_id:
            jobData.atsType === 'smartrecruiters' ? jobData.id : null,
          dover_requisition_id: jobData.atsType === 'dover' ? jobData.id : null,
          id: jobData.id.toString(),
          title: jobData.title,
          company:
            clientData.client_name || clientData.name || 'Unknown Company',
          location: jobData.location,
          type: 'Full-time', // Default value since not provided in API
          salary:
            jobData.salary_min && jobData.salary_max
              ? `${jobData.salary_currency || '$'}${jobData.salary_min} - ${jobData.salary_currency || '$'}${jobData.salary_max}`
              : 'Competitive',
          category: 'Software Development', // Default value since not provided in API
          description: jobData.description,
          requirements: [], // We'll need to parse these from the description
          benefits: [], // We'll need to parse these from the description
          posted_at: jobData.posted_at,
          updated_at: jobData.updated_at,
          applicationCount: 0, // Default value since not provided in API
          featured: false, // Default value since not provided in API
          remote: jobData.remote,
          country: jobData.country,
          external_url: jobData.external_url,
          source: response.data.atsType,
          navigation: {
            atsType: response.data.atsType,
            urlSafeClientName: route.params.urlSafeClientName,
            clientName: route.params.clientName,
            domain: route.params.domain,
            clientProject: route.params.clientProject,
            urlSafeJobTitle: route.params.urlSafeJobTitlePlusId
          }
        };

        if (!this.currentJob) {
          throw new Error('Job not found');
        }
      } catch (error) {
        this.error = 'Failed to fetch job details. Please try again.';
        console.error('Error fetching job via SEO route:', error);
      } finally {
        this.loading = false;
      }
    },

    toggleSaveJob(jobId: string) {
      const index = this.savedJobs.indexOf(jobId);
      if (index === -1) {
        // Save job
        this.savedJobs.push(jobId);
      } else {
        // Unsave job
        this.savedJobs.splice(index, 1);
      }

      // Update localStorage
      localStorage.setItem('savedJobs', JSON.stringify(this.savedJobs));
    },

    // Fetch all bookmarked jobs for the user
    async fetchBookmarks() {
      this.bookmarksLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_URL}/api/bookmarks`);
        this.bookmarkedJobs = response.data.bookmarks;

        // Update bookmarked job IDs set for quick lookup
        this.bookmarkedJobIds.clear();
        this.bookmarkedJobs.forEach((bookmark) => {
          this.bookmarkedJobIds.add(bookmark.requisition_id);
        });
      } catch (error: any) {
        if (error.response?.status !== 401) {
          this.error = 'Failed to fetch bookmarks';
          console.error('Failed to fetch bookmarks:', error);
        }
      } finally {
        this.bookmarksLoading = false;
      }
    },

    // Add a bookmark for a job
    async addBookmark(job: Job) {
      const source = this.getJobSource(job);
      const requisitionId = this.getJobRequisitionId(job);

      if (!source || !requisitionId) {
        this.error = 'Invalid job data for bookmarking';
        return false;
      }

      try {
        await axios.post(`${API_URL}/api/bookmarks`, {
          source,
          requisition_id: requisitionId
        });

        // Add to local state
        this.bookmarkedJobIds.add(requisitionId);

        // Refresh bookmarks to get full job details
        await this.fetchBookmarks();

        return true;
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Failed to bookmark job';
        }
        console.error('Failed to bookmark job:', error);
        return false;
      }
    },

    // Remove a bookmark for a job
    async removeBookmark(job: Job) {
      const source = this.getJobSource(job);
      const requisitionId = this.getJobRequisitionId(job);

      if (!source || !requisitionId) {
        this.error = 'Invalid job data for removing bookmark';
        return false;
      }

      try {
        await axios.delete(`${API_URL}/api/bookmarks`, {
          data: {
            source,
            requisition_id: requisitionId
          }
        });

        // Remove from local state
        this.bookmarkedJobIds.delete(requisitionId);

        // Remove from bookmarked jobs array
        this.bookmarkedJobs = this.bookmarkedJobs.filter(
          (bookmark) => bookmark.requisition_id !== requisitionId
        );

        return true;
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Failed to remove bookmark';
        }
        console.error('Failed to remove bookmark:', error);
        return false;
      }
    },

    // Toggle bookmark status for a job
    async toggleBookmark(job: Job) {
      const isBookmarked = this.isJobBookmarked(job);

      if (isBookmarked) {
        return await this.removeBookmark(job);
      } else {
        return await this.addBookmark(job);
      }
    },

    // Clear all bookmarks
    async clearAllBookmarks() {
      try {
        await axios.delete(`${API_URL}/api/bookmarks/clear`);

        // Clear local state
        this.bookmarkedJobs = [];
        this.bookmarkedJobIds.clear();

        return true;
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Failed to clear bookmarks';
        }
        console.error('Failed to clear bookmarks:', error);
        return false;
      }
    },

    // Fetch job statistics for homepage display
    async fetchJobStatistics() {
      try {
        const response = await axios.get(
          `${API_URL}/api/requisitions/statistics`
        );
        this.statistics = response.data.data;
      } catch (error) {
        console.error('Failed to fetch job statistics:', error);
        this.statistics = { total: 0, usJobs: 0, remoteUsJobs: 0 };
      }
    }
  }
});
