<script setup lang="ts">
import { computed } from 'vue';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useJobsStore } from '../../stores/jobs';
import { useAuthStore } from '../../stores/auth';
import type { Job } from '../../types/job';
import { generateJobUrl } from '../../utils/urlUtils';

const props = defineProps<{
  job: Job;
}>();

const jobsStore = useJobsStore();
const authStore = useAuthStore();

const isBookmarked = computed(() => {
  return jobsStore.isJobBookmarked(props.job);
});

const toggleBookmark = async () => {
  if (!authStore.isAuthenticated) {
    // You could redirect to login here
    return;
  }

  await jobsStore.toggleBookmark(props.job);
};

const formattedDate = computed(() => {
  if (!props.job.posted_at) return '';
  const date = parseISO(props.job.posted_at);
  return format(date, 'MMMM d, yyyy');
});

const timeAgo = computed(() => {
  if (!props.job) return '';
  return formatDistanceToNow(parseISO(props.job.posted_at), {
    addSuffix: true
  });
});

const jobUrl = computed(() => {
  try {
    return generateJobUrl(props.job.id, props.job.navigation);
  } catch (error) {
    console.error('Error generating job URL:', error);
    // Return a placeholder that won't break the UI
    return '#';
  }
});
</script>

<template>
  <div
    class="card relative mb-4 border border-gray-100 p-6 transition-all duration-300 hover:border-primary-100"
    :class="{ 'border-l-4 border-l-primary-500': job.featured }"
  >
    <div v-if="job.featured" class="absolute -right-2 -top-2">
      <span class="premium-badge">Featured</span>
    </div>

    <div class="flex flex-col justify-between sm:flex-row sm:items-start">
      <div>
        <router-link :to="jobUrl" class="mb-1 block">
          <h3
            class="text-xl font-semibold text-gray-900 transition-colors duration-200 hover:text-primary-600"
          >
            {{ job.title }}
          </h3>
        </router-link>
        <div class="mb-3">
          <span class="font-medium text-gray-800">{{
            jobsStore.getSourceName(job)
          }}</span>
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-gray-600">{{ job.location }}</span>
        </div>
      </div>

      <div class="mt-2 flex items-start sm:mt-0">
        <button
          class="flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          :aria-label="isBookmarked ? 'Remove bookmark' : 'Bookmark job'"
          :disabled="jobsStore.bookmarksLoading"
          @click="toggleBookmark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-6"
            :class="
              isBookmarked ? 'fill-current text-primary-500' : 'text-gray-400'
            "
            viewBox="0 0 24 24"
            stroke="currentColor"
            :fill="isBookmarked ? 'currentColor' : 'none'"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="mb-4 mt-2">
      <div class="flex flex-wrap gap-2">
        <span
          class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
        >
          type
        </span>
        <span
          class="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-800"
        >
          category
        </span>
        <span
          class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
        >
          salary
        </span>
      </div>
    </div>

    <p class="mb-4 line-clamp-2 text-gray-700" />

    <div
      class="mt-2 flex flex-col justify-between text-sm sm:flex-row sm:items-center"
    >
      <div class="mb-2 flex items-center sm:mb-0">
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
        <span class="text-gray-500"
          >Posted {{ timeAgo }} ({{ formattedDate }})</span
        >
      </div>

      <div class="flex items-center">
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span class="text-gray-500">{{
          job.remote ? 'Remote' : 'On-site'
        }}</span>
      </div>
    </div>

    <div
      class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"
    >
      <span class="text-xs text-gray-500">Job ID: {{ job.id }}</span>
      <router-link
        :to="jobUrl"
        class="inline-flex items-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
      >
        View Details
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ml-1 size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </router-link>
    </div>
  </div>
</template>
