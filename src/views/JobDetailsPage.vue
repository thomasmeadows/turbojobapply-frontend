<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays
} from 'date-fns';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';
import type { Job } from '../types/job';
import TurboApplyModal from '@components/job-applications/TurboApplyModal.vue';

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
  return false;
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
  return formatDistanceToNow(parseISO(job.value.posted_at), {
    addSuffix: true
  });
});

// Job freshness alert logic
const jobFreshnessAlert = computed(() => {
  if (!job.value?.updated_at) return null;

  const updatedDate = parseISO(job.value.updated_at);
  const daysSinceUpdate = differenceInDays(new Date(), updatedDate);
  console.error(daysSinceUpdate, ' days since update');

  if (daysSinceUpdate >= 14) {
    return {
      type: 'error',
      message:
        'An update has not been found for this job in over 2 weeks. It is likely the job has been taken down and has been queued for potential deletion.'
    };
  } else if (daysSinceUpdate >= 7) {
    return {
      type: 'warning',
      message:
        'An update was not found for this job in the last week, we have queued it to review if the job is still available.'
    };
  }

  return null;
});

const isSaved = false;

// Set up dynamic meta tags based on job data
useHead(
  computed(() => {
    if (!job.value) {
      return {};
    }

    // Use meta_title and meta_description if available, otherwise generate defaults
    const title = job.value?.meta_title || `${job.value?.title}`;
    const description =
      job.value?.meta_description ||
      `${title} position in ${job.value?.location?.substring(0, 130)}. Apply now through TurboJobApply.`;

    return {
      title,
      meta: [
        {
          name: 'description',
          content: description
        },
        {
          name: 'title',
          content: title
        },
        {
          property: 'og:title',
          content: title
        },
        {
          property: 'og:description',
          content: description
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:title',
          content: title
        },
        {
          name: 'twitter:description',
          content: description
        }
      ]
    };
  })
);

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
        .filter(
          (j) => j.category === job.value?.category && j.id !== job.value?.id
        )
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
  } finally {
    loading.value = false;
  }
});

const toggleSave = async () => {
  if (!isAuthenticated.value) {
    await router.push({ name: 'Login', query: { redirect: route.fullPath } });
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

const openTurboApply = async () => {
  if (!isAuthenticated.value) {
    await router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  showTurboApplyModal.value = true;
};

const closeTurboApply = () => {
  showTurboApplyModal.value = false;
};

// Lightning bolt animation management
const lightningBolts = ref<HTMLElement[]>([]);
let lightningInterval: ReturnType<typeof setInterval> | null = null;

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
        const distance =
          minDistance + Math.random() * (maxDistance - minDistance);

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
  lightningBolts.value.forEach((bolt) => {
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
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-10 animate-spin text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="!job" class="rounded-lg bg-white p-8 text-center shadow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto mb-4 size-12 text-error-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 class="mb-2 text-lg font-medium text-gray-900">Job Not Found</h3>
      <p class="mb-4 text-gray-600">
        The job listing you're looking for doesn't exist or has been removed.
      </p>
      <router-link to="/search" class="btn-primary"> Browse Jobs </router-link>
    </div>

    <!-- Job Details Content -->
    <div v-else>
      <!-- Back Button -->
      <div class="mb-6">
        <button
          class="flex items-center text-primary-600 transition-colors duration-200 hover:text-primary-700"
          @click="router.back()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-1 size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to results
        </button>
      </div>

      <!-- Job Freshness Alerts -->
      <div v-if="jobFreshnessAlert" class="mb-6">
        <!-- Error Alert (2+ weeks old) -->
        <div
          v-if="jobFreshnessAlert.type === 'error'"
          class="rounded-md border border-red-200 bg-red-50 p-4"
        >
          <div class="flex">
            <div class="shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
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
        <div
          v-if="jobFreshnessAlert.type === 'warning'"
          class="rounded-md border border-yellow-200 bg-yellow-50 p-4"
        >
          <div class="flex">
            <div class="shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
      <div class="overflow-hidden rounded-lg bg-white shadow-sm">
        <!-- Job Header -->
        <div class="border-b border-gray-200 p-6 sm:p-8">
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between"
          >
            <div>
              <div v-if="job.featured" class="mb-2">
                <span class="premium-badge">Featured</span>
              </div>
              <h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {{ job.title }}
              </h1>
              <div class="mb-4">
                <span class="font-medium text-gray-800">{{ job.company }}</span>
                <span class="mx-2 text-gray-400">•</span>
                <span class="text-gray-600">{{ job.location }}</span>
              </div>

              <div class="mb-4 flex flex-wrap gap-2">
                <span
                  v-if="job.type"
                  class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                >
                  {{ job.type }}
                </span>
                <span
                  v-if="job.category"
                  class="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-800"
                >
                  {{ job.category }}
                </span>
                <span
                  v-if="job.salary"
                  class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  {{ job.salary }}
                </span>
              </div>

              <div class="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 size-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Posted {{ timeAgo }} ({{ formattedDate }})
              </div>
            </div>

            <div class="mt-6 flex space-x-4 md:mt-0">
              <button
                class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :class="{
                  'border-primary-500 text-primary-600': isSaved,
                  'text-gray-700': !isSaved
                }"
                @click="toggleSave"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2 size-5"
                  :class="
                    isSaved ? 'fill-current text-primary-500' : 'text-gray-400'
                  "
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  :fill="isSaved ? 'currentColor' : 'none'"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                {{ isSaved ? 'Saved' : 'Save' }}
              </button>

              <!-- Turbo Apply Button (BambooHR only for now) -->
              <button
                v-if="canTurboApply"
                class="turbo-apply-button flex items-center justify-center rounded-md border border-green-700 bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                @click="openTurboApply"
                @mouseenter="handleTurboApplyHover"
                @mouseleave="handleTurboApplyLeave"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span class="turbo-apply-text">Turbo Apply</span>
              </button>

              <button
                class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                @click="applyToJob"
              >
                <svg
                  class="mr-2 size-4"
                  fill="currentColor"
                  id="Layer_1"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <path
                        d="M417.953,193.696c-0.339-0.429-0.68-0.857-1.025-1.281c-3.978-4.91-11.178-5.665-16.085-1.692
                      c-4.907,3.974-5.664,11.177-1.689,16.085c0.284,0.351,0.565,0.702,0.845,1.058c2.258,2.86,5.604,4.352,8.985,4.352
                      c2.481,0,4.98-0.803,7.077-2.459C421.019,205.847,421.866,198.655,417.953,193.696z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M510.904,426.482c-0.789-1.669-19.139-39.351-83.008-79.695c7.115-10.629,12.304-22.36,15.471-35.025
                      c7.812-31.276,4.316-64.421-9.843-93.333c-2.779-5.672-9.627-8.022-15.302-5.241c-5.673,2.778-8.02,9.629-5.241,15.302
                      c11.791,24.073,14.7,51.677,8.194,77.724c-3.392,13.568-9.688,25.784-18.71,36.309c-0.032,0.038-0.066,0.073-0.098,0.111
                      c-0.019,0.023-0.041,0.045-0.061,0.068c-22.084,25.615-56.142,36.436-88.959,28.24c-29.046-7.248-49.948-32.167-52.011-62.017
                      c-0.501-7.185,0.14-14.403,1.905-21.461c3.414-13.685,11.953-25.217,24.043-32.476c12.089-7.258,26.283-9.369,39.965-5.952
                      c10.355,2.585,19.083,9.046,24.575,18.194c5.493,9.148,7.093,19.886,4.509,30.237c-1.92,7.69-6.722,14.174-13.52,18.255
                      c-6.798,4.082-14.78,5.268-22.465,3.352c-11.469-2.868-18.473-14.54-15.613-26.02c1.528-6.129-2.203-12.336-8.332-13.863
                      c-6.125-1.525-12.336,2.203-13.863,8.332c-5.909,23.709,8.564,47.818,32.264,53.742c13.617,3.403,27.747,1.294,39.783-5.932
                      c12.037-7.226,20.538-18.706,23.939-32.325c4.066-16.279,1.547-33.168-7.091-47.554c-8.639-14.387-22.363-24.549-38.643-28.611
                      c-19.613-4.901-39.955-1.871-57.282,8.532c-17.331,10.404-29.57,26.936-34.462,46.542c-0.931,3.717-1.616,7.472-2.076,11.246
                      l-43.412-16.95c-0.022-0.009-0.045-0.014-0.066-0.022c-0.017-0.007-0.032-0.015-0.049-0.022l-0.041-0.016
                      c-2.703-1.106-5.085-2.162-7.318-3.237c-6.395-3.711-11.151-9.937-13.067-17.134c-1.91-7.175-0.889-14.619,2.878-20.968
                      c32.486-54.807,98.397-82.298,160.287-66.846c16.084,4.017,30.743,11.259,43.571,21.525c4.932,3.947,12.129,3.149,16.076-1.784
                      c3.947-4.932,3.149-12.128-1.784-16.076c-15.416-12.337-33.019-21.039-52.322-25.859c-35.849-8.95-72.715-6.041-106.616,8.405
                      c-32.792,13.973-60.808,38.468-78.887,68.968c-3.32,5.596-5.468,11.655-6.433,17.895c-5.219-9.247-8.024-18.927-10.782-28.465
                      c-2.366-8.182-4.601-15.911-8.206-23.219c-2.795-5.679-6.451-10.757-10.879-15.162V80.632c0-6.316-5.12-11.437-11.437-11.437
                      c-6.317,0-11.437,5.122-11.437,11.437v79.659c-5.474-1.74-11.211-2.652-17.007-2.652h-4.655V80.632
                      c0-6.316-5.12-11.437-11.437-11.437s-11.437,5.122-11.437,11.437v77.055c-14.339,0.488-27.758,6.289-37.979,16.495
                      C5.871,184.857,0,199.04,0,214.116c0,30.029,23.549,54.659,53.144,56.391c10.888,48.255,35.681,79.067,55.163,96.72
                      c12.487,11.317,24.337,18.742,32.595,23.179l-17.73,35.896c-1.751,3.546-1.547,7.744,0.54,11.102
                      c2.087,3.358,5.761,5.401,9.715,5.401h367.136c3.918,0,7.563-2.006,9.661-5.316C512.321,434.178,512.578,430.025,510.904,426.482z
                      M151.833,419.93l14.723-29.808c1.435-2.906,1.57-6.285,0.372-9.296c-1.2-3.013-3.62-5.373-6.66-6.497
                      c-0.701-0.26-70.292-26.956-86.494-117.184c-0.979-5.45-5.72-9.415-11.258-9.415h-6.039c-18.528,0-33.603-15.08-33.603-33.614
                      c0-8.973,3.495-17.414,9.833-23.759c6.356-6.348,14.798-9.843,23.77-9.843h25.562c7.693,0,15.221,2.696,21.215,7.605
                      c3.813,3.111,6.849,6.928,9.027,11.353c2.713,5.499,4.674,12.28,6.75,19.462c6.908,23.887,15.504,53.614,58.669,74.375
                      c0.023,0.011,0.047,0.022,0.07,0.033c1.915,1.047,3.896,1.996,5.92,2.792l3.351,1.314c0.01,0.003,0.021,0.006,0.03,0.01
                      c0.034,0.014,0.069,0.027,0.103,0.04l0.065,0.025c0.001,0,0.001,0.001,0.002,0.001l52.077,20.333
                      c5.457,36.462,32.202,66.225,68.486,75.278c9.118,2.277,18.304,3.388,27.396,3.388c28.963-0.002,56.885-11.282,77.954-31.976
                      c34.402,21.356,54.708,41.823,65.758,55.384H151.833z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M81.719,196.571c-6.317,0-11.437,5.122-11.437,11.437v4.289c0,6.316,5.12,11.437,11.437,11.437
                      c6.317,0,11.437-5.122,11.437-11.437v-4.289C93.156,201.693,88.036,196.571,81.719,196.571z"
                      />
                    </g>
                  </g>
                </svg>
                Snail Apply
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-2 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Job Description -->
        <div class="border-b border-gray-200 p-6 sm:p-8">
          <h2 class="mb-4 text-xl font-bold text-gray-900">
            Job Description - {{ job.company }}
          </h2>
          <div
            class="prose mb-6 max-w-none text-gray-700"
            v-html="job.description"
          />
        </div>

        <!-- Apply Section -->
        <div class="bg-gray-50 p-6 sm:p-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="mb-4 sm:mb-0">
              <h3 class="mb-1 text-lg font-medium text-gray-900">
                Interested in this job?
              </h3>
              <p class="text-gray-600">
                Apply now and take the next step in your career
              </p>
            </div>
            <button
              class="btn flex w-full items-center justify-center bg-primary-600 text-white hover:bg-primary-700 sm:w-auto"
              @click="applyToJob"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18 9c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-3-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM5 12c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2s2-.9 2-2v-1c0-1.1-.9-2-2-2zm13 5H8c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h3.5L15 6.5c.28-.28.72-.28 1 0L19.5 10c.28.28.28.72 0 1L16 14.5V15c0 1.1.9 2 2 2z"
                />
              </svg>
              Snail Apply
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>

          <div
            v-if="!isPremium && isAuthenticated"
            class="mt-4 rounded-md border border-accent-100 bg-accent-50 p-4"
          >
            <div class="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 mt-0.5 size-5 shrink-0 text-accent-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Want to stand out?</span> Premium
                  members get their applications processed faster.
                </p>
                <router-link
                  to="/subscription"
                  class="mt-1 inline-block text-sm font-medium text-accent-600 hover:text-accent-700"
                >
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
        :requisition-id="getRequisitionId || 0"
        :ats-source="job.navigation?.atsType || 'bamboo'"
        @close="closeTurboApply"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes turboButtonPulse {
  0% {
    transform: scale(1);
    background-color: rgb(21, 128, 61);
    /* bg-green-700 */
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    /* green-500 with opacity */
  }

  50% {
    transform: scale(1.05);
    background-color: rgb(22, 163, 74);
    /* bg-green-600 */
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.3);
  }

  100% {
    transform: scale(1);
    background-color: rgb(21, 128, 61);
    /* bg-green-700 */
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
