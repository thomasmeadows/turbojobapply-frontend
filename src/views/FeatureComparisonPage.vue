<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// Hover state for feature tooltips
const hoveredFeature = ref<string>('');

const setHoveredFeature = (feature: string) => {
  hoveredFeature.value = feature;
};

const clearHoveredFeature = () => {
  hoveredFeature.value = '';
};

// Feature data with detailed descriptions
const featureData = {
  'job-search': {
    title: 'Job Listing Search Engine',
    description:
      'Search and browse job listings from multiple ATS platforms including BambooHR, Workday, GreenhouseIO, ADP, Jobvite, Breezy, Lever, SmartRecruiters, and Dover. Filter by location, company, job type, and more.'
  },
  'manual-apply': {
    title: 'Manual Job Applications',
    description:
      'Click through to individual company websites to apply for jobs manually. Perfect for traditional job seekers who prefer handling each application personally.'
  },
  'no-tracking': {
    title: 'No Data Tracking',
    description:
      'Browse jobs without creating an account. Your search history and activity are not tracked or stored by our system, ensuring complete privacy.'
  },
  'bookmark-jobs': {
    title: 'Bookmark Jobs',
    description:
      "Save jobs to your personal bookmarks list for easy access later. Keep track of positions you're interested in across all ATS platforms."
  },
  'beta-access': {
    title: 'Limited Beta Access',
    description:
      'Get early access to new features during beta testing phases. Provide feedback and help shape the future of our platform while enjoying new capabilities first.'
  },
  'job-profiles': {
    title: 'Basic Job Profiles',
    description:
      'Create one job profile with your contact information, resume, and basic preferences. Perfect for getting started with organized job applications.'
  },
  'turbo-apply': {
    title: 'Turbo Job Apply',
    description:
      'Apply to jobs with one click using your saved profile information. Automatically fill application forms and submit your information instantly to compatible ATS systems.'
  },
  'ai-enhance': {
    title: 'AI Job Apply',
    description:
      'Use artificial intelligence to enhance your resume and cover letters before submitting them. AI analyzes job descriptions and optimizes your application materials for each position.'
  },
  'auto-apply': {
    title: 'Auto Job Apply',
    description:
      'Set your job search criteria and let our system automatically apply to matching positions. Wake up to new applications submitted on your behalf based on your preferences.'
  },
  'job-notifications': {
    title: 'Job Notifications',
    description:
      'Receive real-time alerts when new jobs matching your criteria are posted. Never miss an opportunity with instant email and in-app notifications.'
  },
  'unlimited-profiles': {
    title: 'Unlimited Job Profiles',
    description:
      'Create multiple job profiles for different career paths or industries. Tailor your applications with specific resumes, cover letters, and preferences for each type of role.'
  },
  'application-tracking': {
    title: 'Application Tracking',
    description:
      'Track the status of all your job applications in one centralized dashboard. Monitor follow-ups, interview schedules, and application outcomes across all platforms.'
  },
  'premium-support': {
    title: 'Premium Customer Support',
    description:
      'Get priority customer support with faster response times and dedicated assistance. Access to premium support channels and personalized help with platform features.'
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
            Feature Comparison
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Compare what's available for different user types and find the plan
            that's right for you
          </p>
        </div>
      </div>
    </div>

    <!-- Feature Comparison Table -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="grid grid-cols-4 divide-x divide-gray-200">
          <!-- Feature Column Header -->
          <div class="bg-gray-50 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900">Features</h3>
          </div>

          <!-- Anonymous Users Column -->
          <div class="bg-gray-50 px-6 py-4 text-center">
            <h3 class="text-lg font-semibold text-gray-900">Anonymous Users</h3>
            <p class="mt-1 text-sm text-gray-500">No account required</p>
          </div>

          <!-- Logged In Users Column -->
          <div class="bg-blue-50 px-6 py-4 text-center">
            <h3 class="text-lg font-semibold text-blue-900">Logged In Users</h3>
            <p class="mt-1 text-sm text-blue-600">Free account</p>
          </div>

          <!-- Subscribed Users Column -->
          <div class="bg-primary-50 px-6 py-4 text-center">
            <h3 class="text-lg font-semibold text-primary-900">
              Premium Subscribers
            </h3>
            <p class="mt-1 text-sm text-primary-600">$19.99/month</p>
          </div>
        </div>

        <!-- Feature Rows -->
        <div class="divide-y divide-gray-200">
          <!-- Job Search -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('job-search')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['job-search'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <!-- Tooltip -->
              <div
                v-if="hoveredFeature === 'job-search'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['job-search'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Manual Apply -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('manual-apply')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['manual-apply'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'manual-apply'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['manual-apply'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- No Data Tracking -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('no-tracking')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['no-tracking'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'no-tracking'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['no-tracking'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Bookmark Jobs -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('bookmark-jobs')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['bookmark-jobs'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'bookmark-jobs'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['bookmark-jobs'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Beta Access -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('beta-access')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['beta-access'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'beta-access'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['beta-access'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Job Profiles -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('job-profiles')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['job-profiles'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'job-profiles'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['job-profiles'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <div class="flex items-center justify-center">
                <svg
                  class="size-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-1 text-xs text-gray-500">(1 profile)</span>
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Premium Features Section Header -->
          <div class="bg-primary-25 grid grid-cols-4 divide-x divide-gray-200">
            <div class="px-6 py-3">
              <h4 class="text-sm font-bold text-primary-900">
                Premium Features
              </h4>
            </div>
            <div class="px-6 py-3"></div>
            <div class="px-6 py-3"></div>
            <div class="px-6 py-3"></div>
          </div>

          <!-- Turbo Apply -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('turbo-apply')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['turbo-apply'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'turbo-apply'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['turbo-apply'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- AI Job Apply -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('ai-enhance')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['ai-enhance'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'ai-enhance'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['ai-enhance'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Auto Job Apply -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('auto-apply')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['auto-apply'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'auto-apply'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['auto-apply'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Job Notifications -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('job-notifications')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['job-notifications'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'job-notifications'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['job-notifications'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Unlimited Job Profiles -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('unlimited-profiles')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['unlimited-profiles'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'unlimited-profiles'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['unlimited-profiles'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Application Tracking -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('application-tracking')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['application-tracking'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'application-tracking'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['application-tracking'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Premium Support -->
          <div class="grid grid-cols-4 divide-x divide-gray-200">
            <div
              class="cursor-help px-6 py-4"
              @mouseenter="setHoveredFeature('premium-support')"
              @mouseleave="clearHoveredFeature"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900">{{
                  featureData['premium-support'].title
                }}</span>
                <svg
                  class="ml-2 size-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                v-if="hoveredFeature === 'premium-support'"
                class="absolute z-10 mt-2 w-64 rounded-md bg-gray-900 p-2 text-sm text-white shadow-lg"
              >
                {{ featureData['premium-support'].description }}
              </div>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="px-6 py-4 text-center">
              <svg
                class="mx-auto size-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-primary-50 px-6 py-12 text-center">
        <h2 class="text-3xl font-bold text-primary-900">
          Ready to Get Started?
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-primary-700">
          Choose the plan that's right for you and start your job search journey
          today.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/login"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Get Started for Free
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated && !authStore.isPremium"
            to="/subscription"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Upgrade to Premium
          </router-link>
          <router-link
            to="/search"
            class="inline-flex items-center justify-center rounded-md border border-primary-300 bg-white px-6 py-3 text-base font-medium text-primary-700 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Browse Jobs
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.primary-25 {
  background-color: #fef7ee;
}
</style>
