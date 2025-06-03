<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useJobsStore } from '../stores/jobs';
import JobCard from '../components/jobs/JobCard.vue';
import JobFilters from '../components/jobs/JobFilters.vue';

const jobsStore = useJobsStore();
const jobCount = ref(0);

const handlePageChange = async (page: number) => {
  await jobsStore.fetchJobs(page);
};

onMounted(async () => {
  jobCount.value = jobsStore.jobs.length;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
      <!-- Sidebar with Filters -->
      <div class="md:w-80 flex-shrink-0">
        <JobFilters />
      </div>
      
      <!-- Main Content - Job Listings -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-6" v-if="!jobsStore.firstSearch && jobsStore.totalJobs > 0">
          <h1 class="text-2xl font-bold text-gray-900">Job Listings</h1>
          <p class="text-gray-600">{{ jobsStore.totalJobs }} jobs found</p>
        </div>

        <!-- Pagination Controls (Top) -->
        <div v-if="!jobsStore.loading && jobsStore.totalPages > 1" class="mb-6">
          <nav class="flex justify-center space-x-2">
            <button
              @click="handlePageChange(jobsStore.currentPage - 1)"
              :disabled="jobsStore.currentPage === 1"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="jobsStore.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Previous
            </button>
            <template v-for="page in jobsStore.totalPages" :key="page">
              <button
                v-if="page === 1 || page === jobsStore.totalPages || (page >= jobsStore.currentPage - 1 && page <= jobsStore.currentPage + 1)"
                @click="handlePageChange(page)"
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="page === jobsStore.currentPage ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <span
                v-else-if="page === jobsStore.currentPage - 2 || page === jobsStore.currentPage + 2"
                class="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            </template>
            <button
              @click="handlePageChange(jobsStore.currentPage + 1)"
              :disabled="jobsStore.currentPage === jobsStore.totalPages"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="jobsStore.currentPage === jobsStore.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Next
            </button>
          </nav>
        </div>
        
        <!-- Job List -->
        <div v-if="!jobsStore.loading && jobsStore.jobs.length > 0">
          <JobCard 
            v-for="job in jobsStore.jobs" 
            :key="job.id" 
            :job="job" 
          />
        </div>

        <!-- Pagination Controls (Bottom) -->
        <div v-if="!jobsStore.loading && jobsStore.totalPages > 1" class="mt-6">
          <nav class="flex justify-center space-x-2">
            <button
              @click="handlePageChange(jobsStore.currentPage - 1)"
              :disabled="jobsStore.currentPage === 1"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="jobsStore.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Previous
            </button>
            <template v-for="page in jobsStore.totalPages" :key="page">
              <button
                v-if="page === 1 || page === jobsStore.totalPages || (page >= jobsStore.currentPage - 1 && page <= jobsStore.currentPage + 1)"
                @click="handlePageChange(page)"
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="page === jobsStore.currentPage ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <span
                v-else-if="page === jobsStore.currentPage - 2 || page === jobsStore.currentPage + 2"
                class="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            </template>
            <button
              @click="handlePageChange(jobsStore.currentPage + 1)"
              :disabled="jobsStore.currentPage === jobsStore.totalPages"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="jobsStore.currentPage === jobsStore.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              Next
            </button>
          </nav>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!jobsStore.firstSearch && !jobsStore.loading && jobsStore.jobs.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search filters or try a different search term.</p>
        </div>

        <div v-else-if="jobsStore.firstSearch && jobsStore.jobs.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Ready To Find Jobs</h3>
          <p class="text-gray-600 mb-4">Adjust your search filters, add a search term, and press enter or click search.</p>
        </div>
        
        <!-- Loading State -->
        <div v-else-if="jobsStore.loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-8 w-8 mx-auto text-primary-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p class="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    </div>
  </div>
</template>