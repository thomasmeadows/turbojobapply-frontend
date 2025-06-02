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
  }
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
    isRemote: '',
    country: 'US',
    userConfig: null,
    jobSource: '',
    statistics: null
  }),
  
  getters: {
    locations(): LocationOption[] {
      const locations = new Set<string>();
      this.jobs.forEach(job => locations.add(job.location));
      return Array.from(locations).map(loc => ({ 
        value: loc, 
        label: loc,
        count: this.jobs.filter(job => job.location === loc).length
      }));
    },
    
    countries(): CountryOption[] {
      return COUNTRIES;
    },
    
    savedJobsList(): Job[] {
      return this.jobs.filter(job => this.savedJobs.includes(job.id));
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
        if(!this.country) {
          this.country = 'US';
        }
      } catch (error) {
        console.error('Failed to fetch user config:', error);
      }
    },

    async fetchJobs(currentPage: number = 1) {
      if (!this.query) {
        return
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
        if (this.isRemote) params.append('isRemote', this.isRemote);
        if (this.country) params.append('country', this.country);
        if (this.jobSource) params.append('source', this.jobSource);
        if (this.offset) params.append('offset', this.offset.toString());

        const response = await axios.get(`${API_URL}/api/requisitions/search?${params.toString()}`);
        this.jobs = response.data.data;
        this.totalJobs = response.data.total;
        this.limit = response.data.limit;
        this.offset = response.data.offset;
        this.totalPages = Math.floor(this.totalJobs / this.limit) + 1;
      } catch (error) {
        this.error = 'Failed to fetch jobs. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    async updateSearchOptions(query: string, country: string, isRemote: string) {
      this.query = query;
      this.country = country;
      this.isRemote = isRemote;
    },
    
    async fetchJobById(id: string) {
      if (!id) {
        return;
      }
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/api/requisitions/${id}`);
        const jobData = response.data.data;
        // Map the API response to our frontend job structure
        this.currentJob = {
          bamboohr_requisition_id: jobData.bamboohr_requisition_id,
          greenhouseio_requisition_id: jobData.greenhouseio_requisition_id,
          workday_requisition_id: jobData.workday_requisition_id,
          id: jobData.id.toString(),
          title: jobData.title,
          company: jobData.source, // Using source as company for now
          location: jobData.location,
          type: 'Full-time', // Default value since not provided in API
          salary: 'Competitive', // Default value since not provided in API
          category: 'Software Development', // Default value since not provided in API
          description: jobData.full_description,
          requirements: [], // We'll need to parse these from the description
          benefits: [], // We'll need to parse these from the description
          posted_at: jobData.posted_at,
          applicationCount: 0, // Default value since not provided in API
          featured: false, // Default value since not provided in API
          remote: jobData.remote,
          country: jobData.country,
          external_url: jobData.external_url,
          source: jobData.source // Added source to match the expected structure
        };
        if (!this.currentJob) {
          throw new Error('Job not found');
        }
      } catch (error) {
        this.error = 'Failed to fetch job details. Please try again.';
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
        this.bookmarkedJobs.forEach(bookmark => {
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
        const response = await axios.post(`${API_URL}/api/bookmarks`, {
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
          bookmark => bookmark.requisition_id !== requisitionId
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
        const response = await axios.get(`${API_URL}/api/requisitions/statistics`);
        this.statistics = response.data.data;
      } catch (error) {
        console.error('Failed to fetch job statistics:', error);
        this.statistics = { total: 0, usJobs: 0, remoteUsJobs: 0 };
      }
    }
  }
});