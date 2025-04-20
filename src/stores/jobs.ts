import { defineStore } from 'pinia';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { Job, JobFilters, LocationOption, CategoryOption } from '../types/job';
import { mockJobs } from '../data/mockJobs';

interface JobsState {
  allJobs: Job[];
  filteredJobs: Job[];
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
    loading: false,
    error: null,
    filters: {
      query: '',
      location: '',
      category: '',
      timeframe: 'all',
      sortBy: 'newest'
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
        // In a real app, this would be an API call
        // const response = await axios.get('/api/jobs');
        // this.allJobs = response.data;
        
        // Using mock data for demo
        this.allJobs = mockJobs;
        this.applyFilters();
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
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/jobs/${id}`);
        // this.currentJob = response.data;
        
        // Using mock data for demo
        this.currentJob = this.allJobs.find(job => job.id === id) || null;
        
        if (!this.currentJob) {
          throw new Error('Job not found');
        }
      } catch (error) {
        this.error = 'Failed to fetch job details. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    applyFilters() {
      let result = [...this.allJobs];
      
      // Filter by search query
      if (this.filters.query) {
        const query = this.filters.query.toLowerCase();
        result = result.filter(job => 
          job.title.toLowerCase().includes(query) || 
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
        );
      }
      
      // Filter by location
      if (this.filters.location) {
        result = result.filter(job => job.location === this.filters.location);
      }
      
      // Filter by category
      if (this.filters.category) {
        result = result.filter(job => job.category === this.filters.category);
      }
      
      // Filter by timeframe
      if (this.filters.timeframe !== 'all') {
        const now = new Date();
        if (this.filters.timeframe === 'today') {
          result = result.filter(job => differenceInDays(now, parseISO(job.postedAt)) === 0);
        } else if (this.filters.timeframe === 'week') {
          result = result.filter(job => differenceInDays(now, parseISO(job.postedAt)) <= 7);
        } else if (this.filters.timeframe === 'month') {
          result = result.filter(job => differenceInDays(now, parseISO(job.postedAt)) <= 30);
        }
      }
      
      // Sort results
      if (this.filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      } else if (this.filters.sortBy === 'oldest') {
        result.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
      }
      
      this.filteredJobs = result;
    },
    
    updateFilters(newFilters: Partial<JobFilters>) {
      this.filters = { ...this.filters, ...newFilters };
      this.applyFilters();
    },
    
    resetFilters() {
      this.filters = {
        query: '',
        location: '',
        category: '',
        timeframe: 'all',
        sortBy: 'newest'
      };
      this.applyFilters();
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