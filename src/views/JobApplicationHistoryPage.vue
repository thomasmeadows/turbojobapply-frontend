<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

interface JobApplication {
  id: string;
  ats_source: string;
  job_data: {
    title: string;
    company?: string;
    client_name?: string;
    location?: string;
    external_url?: string;
    description?: string;
  };
  application_status: 'submitted' | 'failed' | 'pending' | 'completed';
  applied_at: string;
  created_at: string;
}

interface ApplicationHistory {
  applications: JobApplication[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const authStore = useAuthStore();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;

const loading = ref(true);
const applications = ref<JobApplication[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalCount = ref(0);
const hasNextPage = ref(false);
const hasPreviousPage = ref(false);
const selectedAtsSource = ref<string>('');
const error = ref<string>('');

const limit = 20;

const atsSourceOptions = [
  { value: '', label: 'All ATS Sources' },
  { value: 'bamboo', label: 'BambooHR' },
  { value: 'workday', label: 'Workday' },
  { value: 'greenhouse', label: 'GreenhouseIO' },
  { value: 'adp', label: 'ADP' },
  { value: 'jobvite', label: 'Jobvite' },
  { value: 'breezy', label: 'Breezy' },
  { value: 'lever', label: 'Lever' },
  { value: 'smartrecruiters', label: 'SmartRecruiters' },
  { value: 'dover', label: 'Dover' }
];

const statusBadgeClasses = computed(() => {
  return {
    submitted: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };
});

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return 'Unknown date';
  }
};

const getCompanyName = (application: JobApplication) => {
  return application.job_data.company || application.job_data.client_name || 'Unknown Company';
};

const getAtsDisplayName = (atsSource: string) => {
  const source = atsSourceOptions.find(option => option.value === atsSource);
  return source?.label || atsSource.toUpperCase();
};

const fetchApplicationHistory = async (page: number = 1) => {
  try {
    loading.value = true;
    error.value = '';
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (selectedAtsSource.value) {
      params.append('atsSource', selectedAtsSource.value);
    }

    const response = await axios.get(`${API_URL}/api/job-applications/history?${params}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    if (response.data.success) {
      const data: ApplicationHistory = response.data.data;
      applications.value = data.applications;
      currentPage.value = data.currentPage;
      totalPages.value = data.totalPages;
      totalCount.value = data.totalCount;
      hasNextPage.value = data.hasNextPage;
      hasPreviousPage.value = data.hasPreviousPage;
    }
  } catch (err: any) {
    console.error('Error fetching application history:', err);
    error.value = err.response?.data?.message || 'Failed to load application history';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchApplicationHistory(page);
  }
};

const onAtsSourceChange = () => {
  currentPage.value = 1;
  fetchApplicationHistory(1);
};

const viewJobDetails = (application: JobApplication) => {
  if (application.job_data.external_url) {
    window.open(application.job_data.external_url, '_blank');
  }
};

const viewApplicationDetails = (applicationId: string) => {
  // Future enhancement: could navigate to a detailed view of the application
  console.log('View application details:', applicationId);
};

onMounted(() => {
  fetchApplicationHistory();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Job Application History</h1>
      <p class="mt-2 text-gray-600">
        Track all the jobs you've applied to through Turbo Apply
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <label for="ats-filter" class="block text-sm font-medium text-gray-700 mb-1">
          Filter by ATS Source
        </label>
        <select
          id="ats-filter"
          v-model="selectedAtsSource"
          @change="onAtsSourceChange"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option v-for="option in atsSourceOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="text-sm text-gray-500">
        {{ totalCount }} total application{{ totalCount !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Empty State -->
    <div v-else-if="applications.length === 0" class="text-center py-16">
      <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
      <p class="text-gray-600 mb-4">
        You haven't applied to any jobs using Turbo Apply yet.
      </p>
      <router-link 
        to="/search" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
      >
        Browse Jobs
      </router-link>
    </div>

    <!-- Applications List -->
    <div v-else class="space-y-4">
      <div 
        v-for="application in applications" 
        :key="application.id"
        class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h3 class="text-lg font-medium text-gray-900 mr-3">
                  {{ application.job_data.title }}
                </h3>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="statusBadgeClasses[application.application_status]"
                >
                  {{ application.application_status.charAt(0).toUpperCase() + application.application_status.slice(1) }}
                </span>
              </div>
              
              <div class="text-gray-600 mb-2">
                <span class="font-medium">{{ getCompanyName(application) }}</span>
                <span v-if="application.job_data.location" class="mx-2">•</span>
                <span v-if="application.job_data.location">{{ application.job_data.location }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500 space-x-4">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Applied {{ formatDate(application.applied_at) }}
                </span>
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                  </svg>
                  {{ getAtsDisplayName(application.ats_source) }}
                </span>
              </div>
              
              <!-- Job Description Preview -->
              <div v-if="application.job_data.description" class="mt-3 text-sm text-gray-600">
                <div class="line-clamp-2" v-html="application.job_data.description.substring(0, 200) + (application.job_data.description.length > 200 ? '...' : '')"></div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button 
                v-if="application.job_data.external_url"
                @click="viewJobDetails(application)"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Job
              </button>
              <button 
                @click="viewApplicationDetails(application.id)"
                class="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ ((currentPage - 1) * limit) + 1 }} to {{ Math.min(currentPage * limit, totalCount) }} of {{ totalCount }} applications
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="!hasPreviousPage"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <template v-for="page in Math.min(5, totalPages)" :key="page">
            <button 
              v-if="page <= totalPages"
              @click="goToPage(page)"
              class="px-3 py-1 border rounded-md text-sm font-medium"
              :class="page === currentPage 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </template>
          
          <span v-if="totalPages > 5" class="px-2 text-gray-500">...</span>
          
          <button 
            v-if="totalPages > 5 && currentPage < totalPages - 2"
            @click="goToPage(totalPages)"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {{ totalPages }}
          </button>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="!hasNextPage"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>