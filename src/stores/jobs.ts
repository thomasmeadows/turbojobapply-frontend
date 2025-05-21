import { defineStore } from 'pinia';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { Job, JobFilters, LocationOption, CategoryOption, CountryOption } from '../types/job';
import { COUNTRIES } from '../types/job';
const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

interface JobsState {
  allJobs: Job[];
  filteredJobs: Job[];
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  savedJobs: string[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  filters: JobFilters;
}

export const useJobsStore = defineStore('jobs', {
  state: (): JobsState => ({
    allJobs: [],
    filteredJobs: [],
    savedJobs: JSON.parse(localStorage.getItem('savedJobs') || '[]'),
    currentJob: null,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    loading: false,
    error: null,
    filters: {
      query: '',
      location: '',
      category: '',
      timeframe: 'all',
      sortBy: 'newest',
      isRemote: '',
      country: 'US' // Default to United States
    }
  }),
  
  getters: {
    locations(): LocationOption[] {
      const locations = new Set<string>();
      this.allJobs.forEach(job => locations.add(job.location));
      return Array.from(locations).map(loc => ({ 
        value: loc, 
        label: loc,
        count: this.allJobs.filter(job => job.location === loc).length
      }));
    },
    
    categories(): CategoryOption[] {
      const categories = new Set<string>();
      this.allJobs.forEach(job => categories.add(job.category));
      return Array.from(categories).map(cat => ({ 
        value: cat, 
        label: cat,
        count: this.allJobs.filter(job => job.category === cat).length
      }));
    },
    
    countries(): CountryOption[] {
      return COUNTRIES;
    },
    
    timeframeOptions(): { value: string; label: string; count: number }[] {
      return [
        { 
          value: 'today', 
          label: 'Today',
          count: this.allJobs.filter(job => differenceInDays(new Date(), parseISO(job.postedAt)) === 0).length
        },
        { 
          value: 'week', 
          label: 'This Week',
          count: this.allJobs.filter(job => differenceInDays(new Date(), parseISO(job.postedAt)) <= 7).length
        },
        { 
          value: 'month', 
          label: 'This Month',
          count: this.allJobs.filter(job => differenceInDays(new Date(), parseISO(job.postedAt)) <= 30).length
        },
        { 
          value: 'all', 
          label: 'All Time',
          count: this.allJobs.length
        }
      ];
    },
    
    isSaved(): (id: string) => boolean {
      return (id: string) => this.savedJobs.includes(id);
    },
    
    savedJobsList(): Job[] {
      return this.allJobs.filter(job => this.savedJobs.includes(job.id));
    }
  },
  
  actions: {
    async fetchJobs() {
      this.loading = true;
      this.error = null;
      
      try {
        // Build query parameters from filters
        const params = new URLSearchParams();
        if (this.filters.query) params.append('q', this.filters.query);
        if (this.filters.location) params.append('location', this.filters.location);
        if (this.filters.isRemote) params.append('isRemote', this.filters.isRemote);
        if (this.filters.country) params.append('country', this.filters.country);
        if (this.offset) params.append('offset', this.offset.toString());

        const response = await axios.get(`${API_URL}/api/requisitions/search?${params.toString()}`);
        this.allJobs = response.data.data;
        this.totalJobs = response.data.total;
        this.limit = response.data.limit;
        this.offset = response.data.offset;
        this.totalPages = Math.floor(this.totalJobs / this.limit) + 1;
        this.filteredJobs = response.data.data; // Server already filtered the results
      } catch (error) {
        this.error = 'Failed to fetch jobs. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchJobById(id: string) {
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
    
    updateFilters(newFilters: Partial<JobFilters>) {
      this.filters = { ...this.filters, ...newFilters };
      this.fetchJobs(); // Fetch new results with updated filters
    },
    
    resetFilters() {
      this.filters = {
        query: '',
        location: '',
        category: '',
        timeframe: 'all',
        sortBy: 'newest',
        isRemote: '',
        country: 'US'
      };
      this.fetchJobs(); // Fetch results with reset filters
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