<script setup lang="ts">
import { ref, computed } from 'vue';
import { useJobsStore } from '../../stores/jobs';

const jobsStore = useJobsStore();

// Get the location and category options from the store
const countries = computed(() => jobsStore.countries);

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
          type="text" 
          class="form-input pl-10 block w-full"
          placeholder="Search jobs by title, company, or keyword"
        >
      </div>
    </div>
    
    <!-- Mobile Filters Toggle -->
    <div class="p-4 border-b border-gray-200 block sm:hidden">
      <button
        class="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
      </button>
    </div>
    
    <!-- Filters Section -->
    <div>

      <!-- Country Filter -->
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Country</h3>
        <select
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
          class="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Clear All
        </button>
        <button 
          class="btn-primary text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
    
    <!-- Desktop Reset Filters Button -->
    <div class="p-4 bg-gray-50 border-t border-gray-200 hidden sm:block">
      <button 
        class="text-sm font-medium text-primary-600 hover:text-primary-800"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>