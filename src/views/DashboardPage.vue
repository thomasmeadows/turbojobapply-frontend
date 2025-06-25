<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
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
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        Welcome, {{ user?.name || 'User' }}!
      </h1>
      <p class="text-gray-600">Your job search dashboard</p>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Column -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Status Card -->
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-medium text-gray-900">
              Account Status
            </h2>
            <div class="flex items-center">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ user?.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ user?.email }}
                </p>
              </div>
              <div class="ml-auto">
                <span
                  v-if="isPremium"
                  class="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800"
                >
                  Premium
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  Free
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="rounded-md bg-gray-50 p-4">
                <div class="text-2xl font-bold text-gray-900">
                  {{ bookmarkedJobs.length }}
                </div>
                <p class="text-sm text-gray-500">Bookmarked Jobs</p>
              </div>
              <div class="rounded-md bg-gray-50 p-4">
                <router-link
                  to="/job-applications"
                  class="-m-2 block rounded-md p-2 transition-colors duration-200 hover:bg-gray-100"
                >
                  <div class="text-2xl font-bold text-gray-900">0</div>
                  <p class="text-sm text-gray-500">Applications</p>
                </router-link>
              </div>
            </div>

            <div v-if="isPremium" class="mt-6 rounded-md bg-green-50 p-4">
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 mt-0.5 size-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">Premium Member</span> - You have
                    access to all premium features including fast-track
                    applications, enhanced profile visibility, and priority
                    support.
                  </p>
                  <p class="mt-1 text-xs text-gray-600">
                    Beta access to premium features is active
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="mt-6 rounded-md bg-accent-50 p-4">
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 mt-0.5 size-5 text-accent-500"
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
                    <span class="font-medium">Upgrade to Premium</span> for
                    $10/month to access fast-track applications and enhanced
                    profile visibility.
                  </p>
                  <router-link
                    to="/subscription"
                    class="mt-1 inline-block text-sm font-medium text-accent-600 hover:text-accent-700"
                  >
                    Upgrade now
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookmarked Jobs Preview -->
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div class="p-6">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">
                Recently Bookmarked Jobs
              </h2>
              <router-link
                to="/saved-jobs"
                class="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View all
              </router-link>
            </div>

            <div
              v-if="loading || jobsStore.bookmarksLoading"
              class="flex justify-center py-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6 animate-spin text-primary-500"
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
              class="py-10 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto mb-2 size-8 text-gray-400"
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
              <p class="mb-2 text-gray-500">
                You haven't bookmarked any jobs yet
              </p>
              <router-link
                to="/search"
                class="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Start exploring jobs
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="bookmark in bookmarkedJobs.slice(0, 3)"
                :key="bookmark.bookmark_id"
                class="rounded-md border border-gray-200 p-4 transition-colors duration-200 hover:bg-gray-50"
              >
                <div class="flex justify-between">
                  <div>
                    <a
                      :href="bookmark.external_url"
                      target="_blank"
                      class="text-base font-medium text-gray-900 hover:text-primary-600"
                    >
                      {{ bookmark.title }}
                    </a>
                    <p class="text-sm text-gray-600">
                      {{ bookmark.company_name }} •
                      {{ bookmark.location || 'Remote' }}
                    </p>
                    <div class="mt-1 flex items-center">
                      <span
                        class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {{
                          bookmark.source === 'bamboohr'
                            ? 'BambooHR'
                            : bookmark.source === 'greenhouseio'
                              ? 'GreenhouseIO'
                              : 'Workday'
                        }}
                      </span>
                      <span
                        v-if="bookmark.remote"
                        class="ml-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                      >
                        Remote
                      </span>
                    </div>
                  </div>
                  <div class="text-right text-xs text-gray-500">
                    <div>
                      Bookmarked
                      {{
                        formatDistanceToNow(parseISO(bookmark.bookmarked_at), {
                          addSuffix: true
                        })
                      }}
                    </div>
                    <div class="mt-1">
                      Posted
                      {{
                        formatDistanceToNow(parseISO(bookmark.posted_at), {
                          addSuffix: true
                        })
                      }}
                    </div>
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
        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-medium text-gray-900">
              Quick Actions
            </h2>
            <div class="space-y-3">
              <router-link
                to="/search"
                class="block rounded-md border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
              >
                <div class="flex items-center">
                  <div class="mr-3 rounded-full bg-primary-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >Search Jobs</span
                  >
                </div>
              </router-link>

              <router-link
                to="/saved-jobs"
                class="block rounded-md border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
              >
                <div class="flex items-center">
                  <div class="mr-3 rounded-full bg-secondary-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-secondary-600"
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
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >Saved Jobs</span
                  >
                </div>
              </router-link>

              <router-link
                to="/job-applications"
                class="block rounded-md border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
              >
                <div class="flex items-center">
                  <div class="mr-3 rounded-full bg-blue-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >Application History</span
                  >
                </div>
              </router-link>

              <router-link
                to="/profile"
                class="block rounded-md border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
              >
                <div class="flex items-center">
                  <div class="mr-3 rounded-full bg-gray-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >Update Profile</span
                  >
                </div>
              </router-link>

              <router-link
                v-if="!isPremium"
                to="/subscription"
                class="block rounded-md border border-gray-200 bg-accent-50 p-3 transition-colors duration-200 hover:bg-accent-100"
              >
                <div class="flex items-center">
                  <div class="mr-3 rounded-full bg-accent-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-4 text-accent-600"
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
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >Upgrade to Premium</span
                  >
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
