<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';
import type { Job } from '../types/job';
import TurboApplyModal from '../components/job-applications/TurboApplyModal.vue';

const route = useRoute();
const router = useRouter();
const jobsStore = useJobsStore();
const authStore = useAuthStore();
const loading = ref(true);
const relatedJobs = ref<Job[]>([]);
const showTurboApplyModal = ref(false);

// Extract job ID from the urlSafeJobTitlePlusId parameter (SEO-friendly routes only)
const jobId = computed(() => {
  const urlSafeJobTitlePlusId = route.params.urlSafeJobTitlePlusId as string;
  if (urlSafeJobTitlePlusId) {
    // Extract job ID from the end of the URL-safe title (format: "job-title-123")
    const parts = urlSafeJobTitlePlusId.split('-');
    const lastPart = parts[parts.length - 1];
    // Check if the last part is a valid number
    const id = parseInt(lastPart, 10);
    return !isNaN(id) ? id.toString() : '';
  }
  return '';
});
const job = computed(() => jobsStore.currentJob);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

// Turbo Apply functionality
const canTurboApply = computed(() => {
  if (!job.value || !isAuthenticated.value) return false;
  // Only enable for BambooHR jobs for now
  return job.value.navigation?.atsType === 'bamboo';
});

const getRequisitionId = computed(() => {
  if (!job.value) return null;
  // Extract requisition ID based on ATS type
  if (job.value.navigation?.atsType === 'bamboo') {
    return job.value.bamboohr_requisition_id;
  }
  return null;
});

const formattedDate = computed(() => {
  if (!job.value) return '';
  const date = parseISO(job.value.posted_at);
  return format(date, 'MMMM d, yyyy');
});

const timeAgo = computed(() => {
  if (!job.value) return '';
  return formatDistanceToNow(parseISO(job.value.posted_at), { addSuffix: true });
});

// Job freshness alert logic
const jobFreshnessAlert = computed(() => {
  if (!job.value?.updated_at) return null;
  
  const updatedDate = parseISO(job.value.updated_at);
  const daysSinceUpdate = differenceInDays(new Date(), updatedDate);
  console.error(daysSinceUpdate, ' days since update')
  
  if (daysSinceUpdate >= 14) {
    return {
      type: 'error',
      message: 'An update has not been found for this job in over 2 weeks. It is likely the job has been taken down and has been queued for potential deletion.'
    };
  } else if (daysSinceUpdate >= 7) {
    return {
      type: 'warning',
      message: 'An update was not found for this job in the last week, we have queued it to review if the job is still available.'
    };
  }
  
  return null;
});

const isSaved = false;

onMounted(async () => {
  loading.value = true;
  try {
    // Only use SEO-friendly routes
    await jobsStore.fetchJobBySeoRoute(route);
    
    // Get all jobs if not already fetched
    if (jobsStore.jobs.length === 0) {
      await jobsStore.fetchJobs();
    }
    
    // Get related jobs based on category
    if (job.value) {
      relatedJobs.value = jobsStore.jobs
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

const openTurboApply = () => {
  if (!isAuthenticated.value) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  showTurboApplyModal.value = true;
};

const closeTurboApply = () => {
  showTurboApplyModal.value = false;
};

// Lightning bolt animation management
const lightningBolts = ref<HTMLElement[]>([]);
let lightningInterval: NodeJS.Timeout | null = null;

const createLightningBolt = () => {
  const bolt = document.createElement('div');
  bolt.innerHTML = '⚡';
  bolt.className = 'lightning-bolt';
  
  bolt.style.color = Math.random() > 0.5 ? '#fbbf24' : '#eab308'; // Random yellow shade
  bolt.style.fontSize = `${12 + Math.random() * 6}px`; // Random size 12-18px
  bolt.style.animation = 'lightningFade 1.5s ease-in-out';
  bolt.style.pointerEvents = 'none';
  bolt.style.userSelect = 'none';
  bolt.style.zIndex = '1000';
  
  return bolt;
};

const startLightningEffect = (buttonElement: HTMLElement) => {
  if (lightningInterval) return; // Already running
  
  const showLightning = () => {
    // Create 2-4 random lightning bolts
    const boltCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < boltCount; i++) {
      setTimeout(() => {
        const bolt = createLightningBolt();
        
        // Get button position relative to viewport
        const buttonRect = buttonElement.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        // Calculate button radius (half the diagonal to ensure we clear the entire button)
        const buttonRadius = Math.sqrt(
          Math.pow(buttonRect.width / 2, 2) + Math.pow(buttonRect.height / 2, 2)
        );
        
        // Random positioning around the button (with minimum distance from button edge)
        const minDistance = buttonRadius + 20; // Button radius + extra clearance
        const maxDistance = buttonRadius + 60; // Button radius + max distance
        
        const angle = Math.random() * 2 * Math.PI; // Random angle around button
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // Position relative to viewport
        bolt.style.position = 'fixed';
        bolt.style.left = `${buttonCenterX + x}px`;
        bolt.style.top = `${buttonCenterY + y}px`;
        bolt.style.transform = 'translate(-50%, -50%)';
        
        // Add to document body instead of button
        document.body.appendChild(bolt);
        lightningBolts.value.push(bolt);
        
        // Remove after animation completes
        setTimeout(() => {
          if (bolt.parentNode) {
            bolt.parentNode.removeChild(bolt);
          }
          const index = lightningBolts.value.indexOf(bolt);
          if (index > -1) {
            lightningBolts.value.splice(index, 1);
          }
        }, 1500); // Animation duration
      }, i * 100); // Stagger the bolts
    }
  };
  
  // Show lightning immediately and then repeat
  showLightning();
  lightningInterval = setInterval(showLightning, 1800);
};

const stopLightningEffect = () => {
  if (lightningInterval) {
    clearInterval(lightningInterval);
    lightningInterval = null;
  }
  
  // Clean up existing bolts
  lightningBolts.value.forEach(bolt => {
    if (bolt.parentNode) {
      bolt.parentNode.removeChild(bolt);
    }
  });
  lightningBolts.value = [];
};

// Turbo Apply button hover handlers
const handleTurboApplyHover = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  startLightningEffect(button);
};

const handleTurboApplyLeave = () => {
  stopLightningEffect();
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

      <!-- Job Freshness Alerts -->
      <div v-if="jobFreshnessAlert" class="mb-6">
        <!-- Error Alert (2+ weeks old) -->
        <div v-if="jobFreshnessAlert.type === 'error'" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Job Listing May Be Outdated
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ jobFreshnessAlert.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning Alert (1+ week old) -->
        <div v-if="jobFreshnessAlert.type === 'warning'" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Job Listing Under Review
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>{{ jobFreshnessAlert.message }}</p>
              </div>
            </div>
          </div>
        </div>
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
              </div>
            </div>
            
            <div class="flex mt-6 md:mt-0 space-x-4">
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
              
              <!-- Turbo Apply Button (BambooHR only for now) -->
              <button 
                v-if="canTurboApply"
                @click="openTurboApply"
                @mouseenter="handleTurboApplyHover"
                @mouseleave="handleTurboApplyLeave"
                class="turbo-apply-button flex items-center justify-center px-4 py-2 border border-green-700 rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="turbo-apply-text">Turbo Apply</span>
              </button>
              
              <button 
                @click="applyToJob" 
                class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 9c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-3-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM5 12c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2s2-.9 2-2v-1c0-1.1-.9-2-2-2zm13 5H8c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h3.5L15 6.5c.28-.28.72-.28 1 0L19.5 10c.28.28.28.72 0 1L16 14.5V15c0 1.1.9 2 2 2z"/>
                </svg>
                Snail Apply
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Job Description -->
        <div class="p-6 sm:p-8 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Job Description - {{ job.company }}</h2>
          <div class="text-gray-700 mb-6 prose max-w-none" v-html="job.description"></div>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 9c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-3-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM5 12c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2s2-.9 2-2v-1c0-1.1-.9-2-2-2zm13 5H8c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h3.5L15 6.5c.28-.28.72-.28 1 0L19.5 10c.28.28.28.72 0 1L16 14.5V15c0 1.1.9 2 2 2z"/>
              </svg>
              Snail Apply
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
      
      <!-- Turbo Apply Modal -->
      <TurboApplyModal
        v-if="showTurboApplyModal && job"
        :show="showTurboApplyModal"
        :job="job"
        :requisitionId="getRequisitionId || 0"
        :atsSource="job.navigation?.atsType || 'bamboo'"
        @close="closeTurboApply"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes turboButtonPulse {
  0% {
    transform: scale(1);
    background-color: rgb(21, 128, 61); /* bg-green-700 */
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); /* green-500 with opacity */
  }
  50% {
    transform: scale(1.05);
    background-color: rgb(22, 163, 74); /* bg-green-600 */
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.3);
  }
  100% {
    transform: scale(1);
    background-color: rgb(21, 128, 61); /* bg-green-700 */
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes turboTextPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.turbo-apply-button {
  animation: turboButtonPulse 5s ease-in-out infinite;
  transform-origin: center;
  position: relative;
  overflow: visible;
}

.turbo-apply-text {
  animation: turboTextPulse 5s ease-in-out infinite;
  transform-origin: center;
  display: inline-block;
}

/* Pause animation on hover for better UX */
.turbo-apply-button:hover {
  animation-play-state: paused;
}

.turbo-apply-button:hover .turbo-apply-text {
  animation-play-state: paused;
}

/* Lightning bolt hover effect - JavaScript controlled */
.turbo-apply-button {
  position: relative;
  overflow: visible;
}

.turbo-apply-button:hover {
  animation-play-state: paused;
}

.turbo-apply-button:hover .turbo-apply-text {
  animation-play-state: paused;
}

/* Lightning bolt styles for dynamically created elements */
.lightning-bolt {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  font-size: 16px;
  user-select: none;
}

/* Lightning bolt fade animation */
@keyframes lightningFade {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>