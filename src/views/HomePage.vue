<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useJobsStore } from '../stores/jobs';

const router = useRouter();
const jobsStore = useJobsStore();

onMounted(async () => {
  // Fetch featured jobs
});

const searchJobs = () => {
  jobsStore.fetchJobs();
  router.push('/search');
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div class="absolute inset-0 bg-gray-900 opacity-10 pattern-dots"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 text-white">
            Find Your Dream Job Today
          </h1>
          <p class="text-xl sm:text-2xl text-primary-100 mb-10">
            Search thousands of jobs with powerful filters and find your next career opportunity
          </p>
          
          <!-- Search Box -->
          <div class="mt-8 max-w-xl mx-auto">
            <form @submit.prevent="searchJobs" class="flex flex-col space-y-4">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <label for="search" class="sr-only">Search</label>
                <input
                  id="search"
                  v-model="jobsStore.query"
                  type="text"
                  class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  placeholder="Job title"
                />
                <div class="grid shrink-0 grid-cols-1 focus-within:relative">
                  <label for="remote" class="sr-only">Remote</label>
                  <select
                    id="remote"
                    v-model="jobsStore.isRemote"
                    class="col-start-1 row-start-1 w-full appearance-none rounded-md border-0 px-4 py-3 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <option value="">Remote?</option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </div>
              </div>
              <div class="flex justify-end" style="margin: 5px">
                <small style="position: absolute"><router-link to="/search">Advanced Search</router-link></small>
              </div>
              <div class="flex justify-center">
                <button
                  :disabled="!jobsStore.query"
                  :class="{ 'opacity-25 cursor-not-allowed': !jobsStore.query }"
                  type="submit"
                  class="w-full sm:w-48 rounded-md bg-secondary-500 px-4 py-3 font-medium text-white shadow hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
                >
                  Search Jobs
                </button>
              </div>
            </form>
            <p class="mt-3 text-sm text-primary-100">
              Popular searches: Designer, Developer, Marketing, Remote
            </p>
          </div>
        </div>
      </div>
      
      <!-- Wave SVG -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
          <path fill="#ffffff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Find the Perfect Job Match
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Turbo Job Apply helps you discover opportunities aligned with your skills and career goals
          </p>
        </div>
        
        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="bg-gray-50 p-6 rounded-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
            <p class="text-gray-600">Filter jobs by creation date, location, industry, and more to find exactly what you're looking for.</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-gray-50 p-6 rounded-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
            <div class="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Save Job Listings</h3>
            <p class="text-gray-600">Bookmark job opportunities to revisit later and keep track of your applications.</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-gray-50 p-6 rounded-lg transition-transform duration-300 hover:transform hover:-translate-y-1">
            <div class="w-12 h-12 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Premium Features</h3>
            <p class="text-gray-600">
              All premium features are <span class="font-bold text-accent-600">FREE</span> during our beta testing phase! 
              Enjoy one-click applications and automated job searching.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Premium Promotion Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-white sm:text-4xl mb-6">
              Stand Out with Premium Features
            </h2>
            <p class="text-lg text-white mb-4">
              During our alpha & beta testing phase, all premium features are completely <span class="font-bold">FREE</span>!
            </p>
            <p class="text-lg text-white mb-8">
              Take advantage of our powerful tools to supercharge your job search before we implement 
              our regular pricing after beta.
            </p>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-white"><span class="font-medium">Turbo Job Apply</span> - Apply to jobs with one click</p>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-white"><span class="font-medium">Auto Job Apply</span> - Set criteria and let us apply for you</p>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-white"><span class="font-medium">Job Tracking</span> - Track application status and follow-ups</p>
              </div>
            </div>
            <div class="mt-10">
              <router-link to="/pricing" class="btn bg-white text-accent-600 hover:bg-gray-100">
                View Pricing Details
              </router-link>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 flex justify-center">
            <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <div class="text-center py-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Premium Membership</h3>
                <div class="text-4xl font-bold text-accent-600 mb-2">
                  <span class="line-through text-gray-400 text-3xl">$19.99</span> $0
                  <span class="text-lg text-gray-500">/month</span>
                </div>
                <p class="text-gray-600 mb-2">During Beta Testing</p>
                <div class="bg-accent-50 border border-accent-200 rounded-lg p-3 mb-4">
                  <p class="text-accent-700 text-sm">
                    Limited Time Offer: All Premium Features Free During Beta Testing
                  </p>
                </div>
              </div>
              <div class="space-y-4 mb-6">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p class="text-gray-700">One-click applications</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p class="text-gray-700">Automated job applications</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p class="text-gray-700">Real-time job notifications</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p class="text-gray-700">Premium customer support</p>
                </div>
              </div>
              <router-link to="/register" class="w-full btn-primary text-center block py-2">
                Sign Up Free
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
          Ready to Find Your Dream Job?
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Join thousands of professionals who found their perfect career match with Turbo Job Apply
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link to="/search" class="btn-primary">
            Start Searching
          </router-link>
          <router-link to="/register" class="btn-outline">
            Create Account
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pattern-dots {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: calc(10 * 1px) calc(10 * 1px);
}

.card {
  @apply rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md;
}

.premium-badge {
  @apply bg-secondary-100 text-secondary-800 inline-flex text-xs px-2 py-1 rounded-full;
}

.btn-primary {
  @apply inline-block px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors duration-300;
}

.line-through {
  text-decoration: line-through;
}
</style>