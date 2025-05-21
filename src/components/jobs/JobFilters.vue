<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useJobsStore } from '../../stores/jobs';
import type { JobFilters, LocationOption, CategoryOption } from '../../types/job';

const jobsStore = useJobsStore();
const filters = ref({ ...jobsStore.filters });
const isMobileFiltersOpen = ref(false);
const searchInput = ref(filters.value.query);

// Get the location and category options from the store
const locations = computed(() => jobsStore.locations);
const categories = computed(() => jobsStore.categories);
const timeframeOptions = computed(() => jobsStore.timeframeOptions);
const countries = computed(() => jobsStore.countries);

// Reset the filters
const resetFilters = () => {
  jobsStore.resetFilters();
  filters.value = { ...jobsStore.filters };
  searchInput.value = '';
};

// Apply the selected filters
const applyFilters = () => {
  jobsStore.updateFilters(filters.value);
  isMobileFiltersOpen.value = false;
};

// Handle the search input
const handleSearch = () => {
  filters.value.query = searchInput.value;
  applyFilters();
};

// Toggle the mobile filters
const toggleMobileFilters = () => {
  isMobileFiltersOpen.value = !isMobileFiltersOpen.value;
};

// Apply filters on change for desktop view
watch(filters, (newFilters) => {
  // Only apply automatically on desktop
  // On mobile, the user needs to click the Apply button
  if (!isMobileFiltersOpen.value) {
    jobsStore.updateFilters(newFilters);
  }
}, { deep: true });
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <!-- Search Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchInput" 
          type="text" 
          class="form-input pl-10 block w-full"
          placeholder="Search jobs by title, company, or keyword"
          @keyup.enter="handleSearch"
        >
      </div>
    </div>
    
    <!-- Mobile Filters Toggle -->
    <div class="p-4 border-b border-gray-200 block sm:hidden">
      <button
        @click="toggleMobileFilters"
        class="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <span>Filters</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" :class="{ 'transform rotate-180': isMobileFiltersOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <!-- Filters Section -->
    <div :class="{ 'hidden sm:block': !isMobileFiltersOpen }">

      <!-- Country Filter -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Country</h3>
        <select
          v-model="filters.country"
          class="form-input"
        >
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.label }}
          </option>
        </select>
      </div>
      
      <!-- Mobile Filter Actions -->
      <div class="p-4 bg-gray-50 flex justify-between sm:hidden">
        <button 
          @click="resetFilters"
          class="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Clear All
        </button>
        <button 
          @click="applyFilters"
          class="btn-primary text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
    
    <!-- Desktop Reset Filters Button -->
    <div class="p-4 bg-gray-50 border-t border-gray-200 hidden sm:block">
      <button 
        @click="resetFilters"
        class="text-sm font-medium text-primary-600 hover:text-primary-800"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>