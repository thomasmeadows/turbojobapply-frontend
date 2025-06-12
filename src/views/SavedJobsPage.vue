<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { generateJobUrl } from '../utils/urlUtils';

const jobsStore = useJobsStore();
const authStore = useAuthStore();
const loading = ref(true);

const bookmarkedJobs = computed(() => jobsStore.bookmarkedJobs);

const removeBookmark = async (bookmark: any) => {
  const fakeJob = {
    bamboohr_requisition_id: bookmark.source === 'bamboohr' ? bookmark.requisition_id : null,
    greenhouseio_requisition_id: bookmark.source === 'greenhouseio' ? bookmark.requisition_id : null,
    workday_requisition_id: bookmark.source === 'workday' ? bookmark.requisition_id : null,
    adp_requisition_id: bookmark.source === 'adp' ? bookmark.requisition_id : null,
    jobvite_requisition_id: bookmark.source === 'jobvite' ? bookmark.requisition_id : null,
    breezy_requisition_id: bookmark.source === 'breezy' ? bookmark.requisition_id : null,
    lever_requisition_id: bookmark.source === 'lever' ? bookmark.requisition_id : null,
    smartrecruiters_requisition_id: bookmark.source === 'smartrecruiters' ? bookmark.requisition_id : null,
    dover_requisition_id: bookmark.source === 'dover' ? bookmark.requisition_id : null,
  };
  
  await jobsStore.removeBookmark(fakeJob as any);
};

const getJobUrl = (bookmark: any) => {
  if (bookmark.navigation) {
    try {
      return generateJobUrl(bookmark.requisition_id.toString(), bookmark.navigation);
    } catch (error) {
      console.warn('Failed to generate SEO URL for bookmark, falling back to external URL:', error);
      return bookmark.external_url;
    }
  }
  return bookmark.external_url;
};

const getSourceDisplayName = (source: string) => {
  const sourceMap: { [key: string]: string } = {
    'bamboohr': 'BambooHR',
    'greenhouseio': 'GreenhouseIO',
    'workday': 'Workday',
    'adp': 'ADP',
    'jobvite': 'Jobvite',
    'breezy': 'Breezy',
    'lever': 'Lever',
    'smartrecruiters': 'SmartRecruiters',
    'dover': 'Dover'
  };
  return sourceMap[source] || source;
};

onMounted(async () => {
  loading.value = true;
  if (authStore.isAuthenticated) {
    await jobsStore.fetchBookmarks();
  }
  loading.value = false;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Bookmarked Jobs</h1>
      <button 
        v-if="bookmarkedJobs.length > 0" 
        @click="jobsStore.clearAllBookmarks()" 
        class="text-sm text-red-600 hover:text-red-700 font-medium"
      >
        Clear All Bookmarks
      </button>
    </div>
    
    <!-- Content -->
    <div v-if="loading || jobsStore.bookmarksLoading" class="flex justify-center items-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </div>
    
    <div v-else-if="bookmarkedJobs.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No bookmarked jobs yet</h3>
      <p class="text-gray-600 mb-4">When you find a job that interests you, click the bookmark icon to save it for later.</p>
      <router-link to="/search" class="btn-primary">
        Browse Jobs
      </router-link>
    </div>
    
    <div v-else>
      <p class="text-gray-600 mb-4">You have bookmarked {{ bookmarkedJobs.length }} job{{ bookmarkedJobs.length !== 1 ? 's' : '' }}</p>
      
      <div class="space-y-4">
        <div 
          v-for="bookmark in bookmarkedJobs" 
          :key="bookmark.bookmark_id" 
          class="card p-6 mb-4 transition-all duration-300 border border-gray-100 hover:border-primary-100"
        >
          <div class="flex flex-col sm:flex-row sm:items-start justify-between">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <router-link :to="getJobUrl(bookmark)" class="block mb-1">
                    <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">{{ bookmark.title }}</h3>
                  </router-link>
                  <div class="mb-3">
                    <span class="font-medium text-gray-800">{{ bookmark.company_name }}</span>
                    <span class="mx-2 text-gray-400">•</span>
                    <span class="text-gray-600">{{ bookmark.location || 'Remote' }}</span>
                  </div>
                </div>
                
                <button 
                  @click="removeBookmark(bookmark)" 
                  class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label="Remove bookmark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
              
              <div class="mt-2 mb-4">
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {{ getSourceDisplayName(bookmark.source) }}
                  </span>
                  <span v-if="bookmark.remote" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Remote
                  </span>
                  <span v-if="bookmark.country" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ bookmark.country }}
                  </span>
                </div>
              </div>
              
              <p class="text-gray-700 line-clamp-3 mb-4">{{ bookmark.description }}</p>
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-2 text-sm">
                <div class="flex items-center mb-2 sm:mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-gray-500">Bookmarked {{ formatDistanceToNow(parseISO(bookmark.bookmarked_at), { addSuffix: true }) }}</span>
                </div>
                
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-gray-500">Posted {{ formatDistanceToNow(parseISO(bookmark.posted_at), { addSuffix: true }) }}</span>
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span class="text-xs text-gray-500">Job ID: {{ bookmark.external_id }}</span>
                <a :href="bookmark.external_url" target="_blank" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  Apply Now
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>