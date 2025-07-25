<script setup lang="ts">
import { computed, watch } from 'vue';
import { useJobsStore } from '../../stores/jobs';
import LocationTypeahead from '../common/LocationTypeahead.vue';

const jobsStore = useJobsStore();

// Get the location and category options from the store
const countries = computed(() => jobsStore.countries);

// Handle location selection from typeahead
const handleLocationSelect = (location: any) => {
  if (location) {
    // Set the structured location data
    jobsStore.city = location.city || '';
    jobsStore.state = location.state || '';
    jobsStore.zip = location.zip || '';
    jobsStore.selectedLocation = location;

    // Clear the legacy location field since we're using structured data
    jobsStore.location = '';
  } else {
    // Clear all location data
    jobsStore.city = '';
    jobsStore.state = '';
    jobsStore.zip = '';
    jobsStore.location = '';
    jobsStore.selectedLocation = null;
  }
};

// Watch for changes in selectedLocation and trigger search
watch(
  () => jobsStore.selectedLocation,
  () => jobsStore.fetchJobs()
);
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
  >
    <form @submit.prevent="() => jobsStore.fetchJobs()">
      <!-- Search Header -->
      <div class="border-b border-gray-200 p-4">
        <div class="relative rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5 text-gray-400"
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
          <input
            v-model="jobsStore.query"
            type="text"
            class="form-input block w-full pl-10"
            placeholder="Search jobs by title, company, or keyword"
          />
        </div>
      </div>

      <!-- Mobile Filters Toggle -->
      <div class="block border-b border-gray-200 p-4 sm:hidden">
        <button
          class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        />
      </div>

      <!-- Filters Section -->
      <div>
        <!-- Country Filter -->
        <div class="border-b border-gray-200 p-4">
          <h3 class="mb-3 text-sm font-medium text-gray-900">Country</h3>
          <select v-model="jobsStore.country" class="form-input">
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.label }}
            </option>
          </select>
        </div>

        <!-- Location Filter -->
        <div class="border-b border-gray-200 p-4">
          <div class="mb-3 flex items-center gap-2">
            <h3 class="text-sm font-medium text-gray-900">Location</h3>
            <div class="group relative">
              <svg
                class="size-4 cursor-help text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <!-- Hover tooltip -->
              <div
                class="absolute -left-8 bottom-full z-50 mb-2 hidden group-hover:block"
              >
                <div
                  class="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
                >
                  <div class="mb-1 font-medium">For best results use:</div>
                  <div>• ZIP code only (e.g., 90210)</div>
                  <div>• City and 2-letter state (e.g., Austin, TX)</div>
                  <div>• Full state name (e.g., California, or Texas)</div>

                  <!-- Tooltip arrow -->
                  <div
                    class="absolute left-4 top-full size-0 border-x-4 border-t-4 border-transparent border-t-gray-900"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <LocationTypeahead
            :model-value="jobsStore.selectedLocation"
            :country="jobsStore.country"
            placeholder="ZIP, City, or Full State Name"
            @update:model-value="handleLocationSelect"
            @clear="handleLocationSelect(null)"
          />
        </div>

        <!-- Remote Work Filter -->
        <div class="border-b border-gray-200 p-4">
          <h3 class="mb-3 text-sm font-medium text-gray-900">Remote Work</h3>
          <select v-model="jobsStore.isRemote" class="form-input">
            <option value="">Remote?</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <!-- Job Source Filter -->
        <div class="border-b border-gray-200 p-4">
          <h3 class="mb-3 text-sm font-medium text-gray-900">Job Source</h3>
          <select v-model="jobsStore.jobSource" class="form-input">
            <option value="">All Job Sources</option>
            <option value="4">ADP</option>
            <option value="1">BambooHR</option>
            <option value="6">Breezy</option>
            <option value="9">Dover</option>
            <option value="3">GreenhouseIO</option>
            <option value="5">Jobvite</option>
            <option value="7">Lever</option>
            <option value="8">SmartRecruiters</option>
            <option value="2">Workday</option>
          </select>
        </div>

        <!-- Search Button -->
        <div class="border-t border-gray-200 bg-gray-50 p-4">
          <button
            class="btn-primary w-full text-sm"
            type="submit"
            :disabled="!jobsStore.query || jobsStore.loading"
            :class="{
              'cursor-not-allowed opacity-25':
                !jobsStore.query || jobsStore.loading
            }"
          >
            Search Jobs
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
