<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';
import { parseISO, formatDistanceToNow } from 'date-fns';

const jobsStore = useJobsStore();
const authStore = useAuthStore();
const loading = ref(true);

const user = computed(() => authStore.user);
const bookmarkedJobs = computed(() => jobsStore.bookmarkedJobs);
const isPremium = computed(() => authStore.isPremium);

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch bookmarks if user is authenticated
    if (authStore.isAuthenticated) {
      await jobsStore.fetchBookmarks();
    }
    
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome, {{ user?.name || 'User' }}!</h1>
      <p class="text-gray-600">Your job search dashboard</p>
    </div>
    
    <!-- Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Status Card -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Account Status</h2>
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">{{ user?.name }}</h3>
                <p class="text-sm text-gray-500">{{ user?.email }}</p>
              </div>
              <div class="ml-auto">
                <span v-if="isPremium" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                  Premium
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Free
                </span>
              </div>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-md">
                <div class="text-2xl font-bold text-gray-900">{{ bookmarkedJobs.length }}</div>
                <p class="text-sm text-gray-500">Bookmarked Jobs</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-md">
                <router-link to="/job-applications" class="block hover:bg-gray-100 transition-colors duration-200 rounded-md p-2 -m-2">
                  <div class="text-2xl font-bold text-gray-900">0</div>
                  <p class="text-sm text-gray-500">Applications</p>
                </router-link>
              </div>
            </div>
            
            <div v-if="isPremium" class="mt-6 bg-green-50 rounded-md p-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">Premium Member</span> - You have access to all premium features including fast-track applications, enhanced profile visibility, and priority support.
                  </p>
                  <p class="text-xs text-gray-600 mt-1">Beta access to premium features is active</p>
                </div>
              </div>
            </div>
            
            <div v-else class="mt-6 bg-accent-50 rounded-md p-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">Upgrade to Premium</span> for $10/month to access fast-track applications and enhanced profile visibility.
                  </p>
                  <router-link to="/subscription" class="text-sm font-medium text-accent-600 hover:text-accent-700 mt-1 inline-block">
                    Upgrade now
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bookmarked Jobs Preview -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium text-gray-900">Recently Bookmarked Jobs</h2>
              <router-link to="/saved-jobs" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all
              </router-link>
            </div>
            
            <div v-if="loading || jobsStore.bookmarksLoading" class="py-10 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            
            <div v-else-if="bookmarkedJobs.length === 0" class="py-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p class="text-gray-500 mb-2">You haven't bookmarked any jobs yet</p>
              <router-link to="/search" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                Start exploring jobs
              </router-link>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="bookmark in bookmarkedJobs.slice(0, 3)" :key="bookmark.bookmark_id" class="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex justify-between">
                  <div>
                    <a :href="bookmark.external_url" target="_blank" class="text-base font-medium text-gray-900 hover:text-primary-600">
                      {{ bookmark.title }}
                    </a>
                    <p class="text-sm text-gray-600">{{ bookmark.company_name }} • {{ bookmark.location || 'Remote' }}</p>
                    <div class="flex items-center mt-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {{ bookmark.source === 'bamboohr' ? 'BambooHR' : bookmark.source === 'greenhouseio' ? 'GreenhouseIO' : 'Workday' }}
                      </span>
                      <span v-if="bookmark.remote" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Remote
                      </span>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 text-right">
                    <div>Bookmarked {{ formatDistanceToNow(parseISO(bookmark.bookmarked_at), { addSuffix: true }) }}</div>
                    <div class="mt-1">Posted {{ formatDistanceToNow(parseISO(bookmark.posted_at), { addSuffix: true }) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar Column -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <router-link to="/search" class="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center">
                  <div class="rounded-full bg-primary-100 p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Search Jobs</span>
                </div>
              </router-link>
              
              <router-link to="/saved-jobs" class="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center">
                  <div class="rounded-full bg-secondary-100 p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Saved Jobs</span>
                </div>
              </router-link>
              
              <router-link to="/job-applications" class="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center">
                  <div class="rounded-full bg-blue-100 p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Application History</span>
                </div>
              </router-link>
              
              <router-link to="/profile" class="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center">
                  <div class="rounded-full bg-gray-100 p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Update Profile</span>
                </div>
              </router-link>
              
              <router-link v-if="!isPremium" to="/subscription" class="block p-3 rounded-md border border-gray-200 bg-accent-50 hover:bg-accent-100 transition-colors duration-200">
                <div class="flex items-center">
                  <div class="rounded-full bg-accent-100 p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Upgrade to Premium</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>