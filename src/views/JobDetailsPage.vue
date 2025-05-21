<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';
import type { Job } from '../types/job';

const route = useRoute();
const router = useRouter();
const jobsStore = useJobsStore();
const authStore = useAuthStore();
const loading = ref(true);
const relatedJobs = ref<Job[]>([]);

const jobId = computed(() => route.params.id as string);
const job = computed(() => jobsStore.currentJob);
const isSaved = computed(() => jobsStore.isSaved(jobId.value));
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

const formattedDate = computed(() => {
  if (!job.value) return '';
  const date = parseISO(job.value.postedAt);
  return format(date, 'MMMM d, yyyy');
});

const timeAgo = computed(() => {
  if (!job.value) return '';
  return formatDistanceToNow(parseISO(job.value.postedAt), { addSuffix: true });
});

onMounted(async () => {
  loading.value = true;
  try {
    await jobsStore.fetchJobById(jobId.value);
    
    // Get all jobs if not already fetched
    if (jobsStore.allJobs.length === 0) {
      await jobsStore.fetchJobs();
    }
    
    // Get related jobs based on category
    if (job.value) {
      relatedJobs.value = jobsStore.allJobs
        .filter(j => j.category === job.value?.category && j.id !== job.value?.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
  } finally {
    loading.value = false;
  }
});

const toggleSave = () => {
  if (!isAuthenticated.value) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  
  jobsStore.toggleSaveJob(jobId.value);
};

const applyToJob = () => {
  if (job.value?.external_url) {
    window.open(job.value.external_url, '_blank', 'noopener,noreferrer');
  } else {
    console.error('No external URL provided for this job');
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </div>
    
    <!-- Error State -->
    <div v-else-if="!job" class="bg-white rounded-lg shadow p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-error-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
      <p class="text-gray-600 mb-4">The job listing you're looking for doesn't exist or has been removed.</p>
      <router-link to="/search" class="btn-primary">
        Browse Jobs
      </router-link>
    </div>
    
    <!-- Job Details Content -->
    <div v-else>
      <!-- Back Button -->
      <div class="mb-6">
        <button @click="router.back()" class="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to results
        </button>
      </div>
      
      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Job Header -->
        <div class="p-6 sm:p-8 border-b border-gray-200">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div v-if="job.featured" class="mb-2">
                <span class="premium-badge">Featured</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{{ job.title }}</h1>
              <div class="mb-4">
                <span class="font-medium text-gray-800">{{ job.company }}</span>
                <span class="mx-2 text-gray-400">•</span>
                <span class="text-gray-600">{{ job.location }}</span>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {{ job.type }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                  {{ job.category }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ job.salary }}
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {{ timeAgo }} ({{ formattedDate }})
                <span class="mx-2">•</span>
                <span>{{ job.applicationCount }} applicants</span>
              </div>
            </div>
            
            <div class="flex mt-6 md:mt-0 space-x-3">
              <button 
                @click="toggleSave" 
                class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                :class="{ 'text-primary-600 border-primary-500': isSaved, 'text-gray-700': !isSaved }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="isSaved ? 'text-primary-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" stroke="currentColor" :fill="isSaved ? 'currentColor' : 'none'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {{ isSaved ? 'Saved' : 'Save' }}
              </button>
              
              <button 
                @click="applyToJob" 
                class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Apply Now
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Job Description -->
        <div class="p-6 sm:p-8 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
          <div class="text-gray-700 mb-6 prose max-w-none" v-html="job.description"></div>
          
          <!-- Requirements and Benefits sections will be populated from the description -->
          <div v-if="job.requirements && job.requirements.length > 0">
            <h3 class="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
            <ul class="list-disc pl-5 mb-6 space-y-2">
              <li v-for="(requirement, index) in job.requirements" :key="index" class="text-gray-700">
                {{ requirement }}
              </li>
            </ul>
          </div>
          
          <div v-if="job.benefits && job.benefits.length > 0">
            <h3 class="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li v-for="(benefit, index) in job.benefits" :key="index" class="text-gray-700">
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Apply Section -->
        <div class="p-6 sm:p-8 bg-gray-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div class="mb-4 sm:mb-0">
              <h3 class="text-lg font-medium text-gray-900 mb-1">Interested in this job?</h3>
              <p class="text-gray-600">Apply now and take the next step in your career</p>
            </div>
            <button 
              @click="applyToJob" 
              class="btn w-full sm:w-auto flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white"
            >
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          
          <div v-if="!isPremium && isAuthenticated" class="mt-4 p-4 bg-accent-50 border border-accent-100 rounded-md">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Want to stand out?</span> Premium members get their applications processed faster.
                </p>
                <router-link to="/subscription" class="text-sm font-medium text-accent-600 hover:text-accent-700 mt-1 inline-block">
                  Upgrade for $10/month
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Jobs Section -->
      <div v-if="relatedJobs.length > 0" class="mt-10">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Similar Jobs You Might Like</h2>
        
        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="relatedJob in relatedJobs" :key="relatedJob.id" class="card p-5">
            <h3 class="font-medium text-gray-900 mb-1 hover:text-primary-600 transition-colors duration-200">
              <router-link :to="`/jobs/${relatedJob.id}`">{{ relatedJob.title }}</router-link>
            </h3>
            <p class="text-gray-600 text-sm mb-2">{{ relatedJob.company }} • {{ relatedJob.location }}</p>
            <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ relatedJob.description }}</p>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ formatDistanceToNow(parseISO(relatedJob.postedAt), { addSuffix: true }) }}</span>
              <router-link :to="`/jobs/${relatedJob.id}`" class="text-primary-600 hover:text-primary-700 font-medium">
                View
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>