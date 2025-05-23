<script setup lang="ts">
import { computed } from 'vue';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useJobsStore } from '../../stores/jobs';
import { useAuthStore } from '../../stores/auth';
import type { Job } from '../../types/job';

const props = defineProps<{
  job: Job;
}>();

const jobsStore = useJobsStore();
const authStore = useAuthStore();

const isSaved = false;

const toggleSave = () => {
  if (!authStore.isAuthenticated) {
    // You could redirect to login here
    return;
  }
  
  jobsStore.toggleSaveJob(props.job.id);
};

const formattedDate = computed(() => {
  if (!props.job.posted_at) return '';
  const date = parseISO(props.job.posted_at);
  return format(date, 'MMMM d, yyyy');
});

const timeAgo = computed(() => {
  if (!props.job) return '';
  return formatDistanceToNow(parseISO(props.job.posted_at), { addSuffix: true });
});
</script>

<template>
  <div class="card p-6 mb-4 transition-all duration-300 border border-gray-100 hover:border-primary-100 relative" :class="{ 'border-l-4 border-l-primary-500': job.featured }">
    <div v-if="job.featured" class="absolute -top-2 -right-2">
      <span class="premium-badge">Featured</span>
    </div>
    
    <div class="flex flex-col sm:flex-row sm:items-start justify-between">
      <div>
        <router-link :to="`/jobs/${job.id}`" class="block mb-1">
          <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">{{ job.title }}</h3>
        </router-link>
        <div class="mb-3">
          <span class="font-medium text-gray-800">{{ jobsStore.getSourceName(job) }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-gray-600">{{ job.location }}</span>
        </div>
      </div>
      
      <div class="flex items-start mt-2 sm:mt-0">
        <button 
          @click="toggleSave" 
          class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :aria-label="isSaved ? 'Unsave job' : 'Save job'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isSaved ? 'text-primary-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" stroke="currentColor" :fill="isSaved ? 'currentColor' : 'none'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="mt-2 mb-4">
      <div class="flex flex-wrap gap-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          type
        </span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
          category
        </span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          salary
        </span>
      </div>
    </div>
    
    <p class="text-gray-700 line-clamp-2 mb-4"></p>
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-2 text-sm">
      <div class="flex items-center mb-2 sm:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-gray-500">Posted {{ timeAgo }} ({{ formattedDate }})</span>
      </div>
      
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text-gray-500">{{ job.isRemote ? 'Remote' : 'On-site' }}</span>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
      <span class="text-xs text-gray-500">Job ID: {{ job.id }}</span>
      <router-link :to="`/jobs/${job.id}`" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
        View Details
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </div>
</template>