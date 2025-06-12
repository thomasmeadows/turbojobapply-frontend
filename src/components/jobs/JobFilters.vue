<script setup lang="ts">
import { ref, computed } from 'vue';
import { useJobsStore } from '../../stores/jobs';

const jobsStore = useJobsStore();

// Get the location and category options from the store
const countries = computed(() => jobsStore.countries);

</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <form @submit.prevent="() => jobsStore.fetchJobs()">
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
            v-model="jobsStore.query"
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
            v-model="jobsStore.country"
          >
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.label }}
            </option>
          </select>
        </div>

        <!-- Location Filter -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Location</h3>
          <input 
            type="text" 
            class="form-input"
            v-model="jobsStore.location"
            placeholder="Enter city or state"
          >
        </div>

        <!-- Remote Work Filter -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Remote Work</h3>
          <select
            class="form-input"
            v-model="jobsStore.isRemote"
          >
            <option value="">Remote?</option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <!-- Job Source Filter -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Job Source</h3>
          <select
            class="form-input"
            v-model="jobsStore.jobSource"
          >
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
        <div class="p-4 bg-gray-50 border-t border-gray-200">
          <button 
            class="w-full btn-primary text-sm"
            type="submit"
            :disabled="!jobsStore.query || jobsStore.loading"
            :class="{ 'opacity-25 cursor-not-allowed': !jobsStore.query || jobsStore.loading }"
          >
            Search Jobs
          </button>
        </div>
      </div>
    </form>
  </div>
</template>