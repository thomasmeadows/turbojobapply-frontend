import { defineStore } from 'pinia';
import type { Job, LocationOption, CountryOption } from '../types/job';
import { COUNTRIES } from '../types/job';
const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

interface JobsState {
  jobs: Job[];
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  savedJobs: string[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  query: string,
  location: string,
  isRemote: string,
  country: string
}

export const useJobsStore = defineStore('jobs', {
  state: (): JobsState => ({
    jobs: [],
    savedJobs: JSON.parse(localStorage.getItem('savedJobs') || '[]'),
    currentJob: null,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    loading: false,
    error: null,
    query: '',
    location: '',
    isRemote: '',
    country: 'US'
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
    }
  },
  
  actions: {
    async fetchJobs() {
      if (!this.query) {
        return
      }
      this.loading = true;
      this.error = null;
      
      try {
        // Build query parameters from filters
        const params = new URLSearchParams();
        if (this.query) params.append('q', this.query);
        if (this.location) params.append('location', this.location);
        if (this.isRemote) params.append('isRemote', this.isRemote);
        if (this.country) params.append('country', this.country);
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
          postedAt: jobData.posted_at,
          applicationCount: 0, // Default value since not provided in API
          featured: false, // Default value since not provided in API
          isRemote: jobData.remote ? 'true' : 'false',
          country: jobData.country,
          external_url: jobData.external_url
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
    }
  }
});