<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useJobsStore } from '../stores/jobs';
import JobCard from '../components/jobs/JobCard.vue';

const jobsStore = useJobsStore();
const loading = ref(true);

const savedJobs = computed(() => jobsStore.savedJobsList);

onMounted(async () => {
  loading.value = true;
  await jobsStore.fetchJobs();
  loading.value = false;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Saved Jobs</h1>
    
    <!-- Content -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </div>
    
    <div v-else-if="savedJobs.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
      <p class="text-gray-600 mb-4">When you find a job that interests you, click the bookmark icon to save it for later.</p>
      <router-link to="/search" class="btn-primary">
        Browse Jobs
      </router-link>
    </div>
    
    <div v-else>
      <p class="text-gray-600 mb-4">You have saved {{ savedJobs.length }} job{{ savedJobs.length !== 1 ? 's' : '' }}</p>
      
      <JobCard 
        v-for="job in savedJobs" 
        :key="job.id" 
        :job="job" 
      />
    </div>
  </div>
</template>