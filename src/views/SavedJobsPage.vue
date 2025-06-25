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
    bamboohr_requisition_id:
      bookmark.source === 'bamboohr' ? bookmark.requisition_id : null,
    greenhouseio_requisition_id:
      bookmark.source === 'greenhouseio' ? bookmark.requisition_id : null,
    workday_requisition_id:
      bookmark.source === 'workday' ? bookmark.requisition_id : null,
    adp_requisition_id:
      bookmark.source === 'adp' ? bookmark.requisition_id : null,
    jobvite_requisition_id:
      bookmark.source === 'jobvite' ? bookmark.requisition_id : null,
    breezy_requisition_id:
      bookmark.source === 'breezy' ? bookmark.requisition_id : null,
    lever_requisition_id:
      bookmark.source === 'lever' ? bookmark.requisition_id : null,
    smartrecruiters_requisition_id:
      bookmark.source === 'smartrecruiters' ? bookmark.requisition_id : null,
    dover_requisition_id:
      bookmark.source === 'dover' ? bookmark.requisition_id : null
  };

  await jobsStore.removeBookmark(fakeJob as any);
};

const getJobUrl = (bookmark: any) => {
  if (bookmark.navigation) {
    try {
      return generateJobUrl(
        bookmark.requisition_id.toString(),
        bookmark.navigation
      );
    } catch (error) {
      console.warn(
        'Failed to generate SEO URL for bookmark, falling back to external URL:',
        error
      );
      return bookmark.external_url;
    }
  }
  return bookmark.external_url;
};

const getSourceDisplayName = (source: string) => {
  const sourceMap: { [key: string]: string } = {
    bamboohr: 'BambooHR',
    greenhouseio: 'GreenhouseIO',
    workday: 'Workday',
    adp: 'ADP',
    jobvite: 'Jobvite',
    breezy: 'Breezy',
    lever: 'Lever',
    smartrecruiters: 'SmartRecruiters',
    dover: 'Dover'
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
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Bookmarked Jobs</h1>
      <button
        v-if="bookmarkedJobs.length > 0"
        class="text-sm font-medium text-red-600 hover:text-red-700"
        @click="jobsStore.clearAllBookmarks()"
      >
        Clear All Bookmarks
      </button>
    </div>

    <!-- Content -->
    <div
      v-if="loading || jobsStore.bookmarksLoading"
      class="flex items-center justify-center py-16"
    >
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

    <div
      v-else-if="bookmarkedJobs.length === 0"
      class="rounded-lg bg-white p-8 text-center shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto mb-4 size-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <h3 class="mb-2 text-lg font-medium text-gray-900">
        No bookmarked jobs yet
      </h3>
      <p class="mb-4 text-gray-600">
        When you find a job that interests you, click the bookmark icon to save
        it for later.
      </p>
      <router-link to="/search" class="btn-primary"> Browse Jobs </router-link>
    </div>

    <div v-else>
      <p class="mb-4 text-gray-600">
        You have bookmarked {{ bookmarkedJobs.length }} job{{
          bookmarkedJobs.length !== 1 ? 's' : ''
        }}
      </p>

      <div class="space-y-4">
        <div
          v-for="bookmark in bookmarkedJobs"
          :key="bookmark.bookmark_id"
          class="card mb-4 border border-gray-100 p-6 transition-all duration-300 hover:border-primary-100"
        >
          <div class="flex flex-col justify-between sm:flex-row sm:items-start">
            <div class="flex-1">
              <div class="mb-2 flex items-start justify-between">
                <div>
                  <router-link :to="getJobUrl(bookmark)" class="mb-1 block">
                    <h3
                      class="text-xl font-semibold text-gray-900 transition-colors duration-200 hover:text-primary-600"
                    >
                      {{ bookmark.title }}
                    </h3>
                  </router-link>
                  <div class="mb-3">
                    <span class="font-medium text-gray-800">{{
                      bookmark.company_name
                    }}</span>
                    <span class="mx-2 text-gray-400">•</span>
                    <span class="text-gray-600">{{
                      bookmark.location || 'Remote'
                    }}</span>
                  </div>
                </div>

                <button
                  class="flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Remove bookmark"
                  @click="removeBookmark(bookmark)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-6 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <div class="mb-4 mt-2">
                <div class="flex flex-wrap gap-2">
                  <span
                    class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                  >
                    {{ getSourceDisplayName(bookmark.source) }}
                  </span>
                  <span
                    v-if="bookmark.remote"
                    class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                  >
                    Remote
                  </span>
                  <span
                    v-if="bookmark.country"
                    class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                  >
                    {{ bookmark.country }}
                  </span>
                </div>
              </div>

              <p class="mb-4 line-clamp-3 text-gray-700">
                {{ bookmark.description }}
              </p>

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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <span class="text-gray-500"
                    >Bookmarked
                    {{
                      formatDistanceToNow(parseISO(bookmark.bookmarked_at), {
                        addSuffix: true
                      })
                    }}</span
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-gray-500"
                    >Posted
                    {{
                      formatDistanceToNow(parseISO(bookmark.posted_at), {
                        addSuffix: true
                      })
                    }}</span
                  >
                </div>
              </div>

              <div
                class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"
              >
                <span class="text-xs text-gray-500"
                  >Job ID: {{ bookmark.external_id }}</span
                >
                <a
                  :href="bookmark.external_url"
                  target="_blank"
                  class="inline-flex items-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
                >
                  Apply Now
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
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
