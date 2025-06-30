<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useJobsStore } from '../stores/jobs';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const jobsStore = useJobsStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

// Rotating facts state
const currentFactIndex = ref(0);
const isVisible = ref(true);
let rotationInterval: ReturnType<typeof setInterval> | null = null;

// Define the facts that will rotate
const facts = ref([
  { text: 'jobs available worldwide', value: 0 },
  { text: 'opportunities in the US', value: 0 },
  { text: 'remote positions in the US', value: 0 }
]);

// Function to update fact values from statistics
const updateFactValues = () => {
  if (jobsStore.statistics) {
    facts.value[0].value = jobsStore.statistics.total;
    facts.value[1].value = jobsStore.statistics.usJobs;
    facts.value[2].value = jobsStore.statistics.remoteUsJobs;
  }
};

// Function to rotate to next fact with scale and fade effect
const rotateFact = () => {
  isVisible.value = false;

  setTimeout(() => {
    currentFactIndex.value = (currentFactIndex.value + 1) % facts.value.length;
    isVisible.value = true;
  }, 5000); // Duration of the scale/fade out animation
};

// Start the rotation
const startFactRotation = () => {
  rotationInterval = setInterval(rotateFact, 10000); // 10 seconds total (5s visible + 5s transition)
};

// Stop the rotation
const stopFactRotation = () => {
  if (rotationInterval) {
    clearInterval(rotationInterval);
    rotationInterval = null;
  }
};

const tabFocus = ref(true);

const detectFocusOut = () => {
  let inView = false;

  const onWindowFocusChange = (e: Event) => {
    if ({ focus: 1, pageshow: 1 }[e.type]) {
      if (inView) return;
      tabFocus.value = true;
      inView = true;
    } else if (inView) {
      tabFocus.value = !tabFocus.value;
      inView = false;
    }
  };

  window.addEventListener('focus', onWindowFocusChange);
  window.addEventListener('blur', onWindowFocusChange);
  window.addEventListener('pageshow', onWindowFocusChange);
  window.addEventListener('pagehide', onWindowFocusChange);
};

onMounted(async () => {
  // Fetch job statistics
  await jobsStore.fetchJobStatistics();
  updateFactValues();
  startFactRotation();
  detectFocusOut();
});

onUnmounted(() => {
  stopFactRotation();
});

watch(tabFocus, (newVal) => {
  if (!newVal) {
    return stopFactRotation();
  }
  return startFactRotation();
});

const searchJobs = async () => {
  return Promise.all([jobsStore.fetchJobs(), router.push('/search')]);
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white"
    >
      <div class="pattern-dots absolute inset-0 bg-gray-900 opacity-10" />
      <div
        class="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div class="mx-auto max-w-3xl text-center">
          <h1
            class="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find Your Dream Job Today
          </h1>
          <p class="mb-10 text-xl text-primary-100 sm:text-2xl">
            Search thousands of jobs with powerful filters and find your next
            career opportunity
          </p>

          <!-- Search Box -->
          <div class="mx-auto mt-8 max-w-xl">
            <form class="flex flex-col space-y-4" @submit.prevent="searchJobs">
              <div
                class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
              >
                <label for="search" class="sr-only">Search</label>
                <input
                  id="search"
                  v-model="jobsStore.query"
                  type="text"
                  class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
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
                <small style="position: absolute"
                  ><router-link to="/search"
                    >Advanced Search</router-link
                  ></small
                >
              </div>
              <div class="flex justify-center">
                <button
                  :disabled="!jobsStore.query"
                  :class="{ 'cursor-not-allowed opacity-25': !jobsStore.query }"
                  type="submit"
                  class="w-full rounded-md bg-secondary-500 px-4 py-3 font-medium text-white shadow hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 sm:w-48"
                >
                  Search Jobs
                </button>
              </div>
            </form>
            <!-- Rotating Job Statistics -->
            <div
              class="mt-3 flex h-8 items-center justify-center overflow-hidden text-sm text-primary-100"
            >
              <transition name="scale-fade" mode="out-in">
                <p
                  v-if="
                    isVisible &&
                    facts[currentFactIndex] &&
                    facts[currentFactIndex].value > 0
                  "
                  :key="currentFactIndex"
                  class="scale-fade-text"
                >
                  <span class="font-semibold text-white">{{
                    facts[currentFactIndex].value.toLocaleString()
                  }}</span>
                  {{ facts[currentFactIndex].text }}
                </p>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave SVG -->
      <div class="absolute inset-x-0 bottom-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          class="h-auto w-full"
        >
          <path
            fill="#ffffff"
            fill-opacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-white py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Find the Perfect Job Match
          </h2>
          <p class="mx-auto max-w-3xl text-xl text-gray-600">
            Turbo Job Apply helps you discover opportunities aligned with your
            skills and career goals
          </p>
        </div>

        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div
            class="rounded-lg bg-gray-50 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
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
            <h3 class="mb-2 text-xl font-semibold text-gray-900">
              Advanced Search
            </h3>
            <p class="text-gray-600">
              Filter jobs by creation date, location, industry, and more to find
              exactly what you're looking for.
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            class="rounded-lg bg-gray-50 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              class="mb-4 flex size-12 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
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
            <h3 class="mb-2 text-xl font-semibold text-gray-900">
              Save Job Listings
            </h3>
            <p class="text-gray-600">
              Bookmark job opportunities to revisit later and keep track of your
              applications.
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            class="rounded-lg bg-gray-50 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              class="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
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
            <h3 class="mb-2 text-xl font-semibold text-gray-900">
              Premium Features
            </h3>
            <p v-if="isPremium" class="text-gray-600">
              <span class="font-bold text-green-600"
                >You have premium access!</span
              >
              Enjoy unlimited one-click applications and automated job
              searching.
            </p>
            <p v-else class="text-gray-600">
              All premium features are
              <span class="font-bold text-accent-600">FREE</span> during our
              beta testing phase! Enjoy one-click applications and automated job
              searching.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Premium Promotion Section -->
    <section
      v-if="!isPremium"
      class="bg-gradient-to-r from-accent-500 to-accent-600 py-16 text-white lg:py-24"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="items-center lg:grid lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Stand Out with Premium Features
            </h2>
            <p class="mb-4 text-lg text-white">
              During our alpha & beta testing phase, all premium features are
              completely <span class="font-bold">FREE</span>!
            </p>
            <p class="mb-8 text-lg text-white">
              Take advantage of our powerful tools to supercharge your job
              search before we implement our regular pricing after beta.
            </p>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 size-6 shrink-0 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p class="text-white">
                  <span class="font-medium">Turbo Job Apply</span> - Apply to
                  jobs with one click
                </p>
              </div>
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 size-6 shrink-0 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p class="text-white">
                  <span class="font-medium">AI Job Apply</span> - Use AI to
                  enhance resume's and cover's before submitting them
                </p>
              </div>
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 size-6 shrink-0 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p class="text-white">
                  <span class="font-medium">Auto Job Apply</span> - Set criteria
                  and let us apply for you
                </p>
              </div>
              <div class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-3 size-6 shrink-0 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p class="text-white">
                  <span class="font-medium">Job Tracking</span> - Track
                  application status and follow-ups
                </p>
              </div>
            </div>
            <div class="mt-10">
              <router-link
                to="/pricing"
                class="btn bg-white text-accent-600 hover:bg-gray-100"
              >
                View Pricing Details
              </router-link>
            </div>
          </div>
          <div class="mt-10 flex justify-center lg:mt-0">
            <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div class="py-4 text-center">
                <h3 class="mb-2 text-2xl font-bold text-gray-900">
                  Premium Membership
                </h3>
                <div class="mb-2 text-4xl font-bold text-accent-600">
                  <span class="text-3xl text-gray-400 line-through"
                    >$19.99</span
                  >
                  $0
                  <span class="text-lg text-gray-500">/month</span>
                </div>
                <p class="mb-2 text-gray-600">During Beta Testing</p>
                <div
                  class="mb-4 rounded-lg border border-accent-200 bg-accent-50 p-3"
                >
                  <p class="text-sm text-accent-700">
                    Limited Time Offer: All Premium Features Free During Beta
                    Testing
                  </p>
                </div>
              </div>
              <div class="mb-6 space-y-4">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-3 size-5 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-gray-700">One-click applications</p>
                </div>
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-3 size-5 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-gray-700">
                    AI-enhanced resumes and cover letters
                  </p>
                </div>
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-3 size-5 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-gray-700">Automated job applications</p>
                </div>
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-3 size-5 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-gray-700">Real-time job notifications</p>
                </div>
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-3 size-5 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-gray-700">Premium customer support</p>
                </div>
              </div>
              <router-link
                v-if="!isAuthenticated"
                to="/subscription"
                class="btn-primary block w-full py-2 text-center"
              >
                Sign Up Free
              </router-link>
              <router-link
                v-else
                to="/subscription"
                class="btn-primary block w-full py-2 text-center"
              >
                Get Premium Access
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Premium Member Section -->
    <section
      v-if="isPremium"
      class="bg-gradient-to-r from-green-500 to-green-600 py-16 text-white lg:py-24"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div
            class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-8 text-white"
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
          </div>
          <h2 class="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Welcome Back, Premium Member!
          </h2>
          <p class="mx-auto mb-8 max-w-3xl text-lg text-green-100">
            You have full access to all premium features during our beta testing
            phase. Start using your advanced job search tools to find your
            perfect opportunity.
          </p>
          <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-lg bg-white/10 p-4">
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mx-auto mb-2 size-8"
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
                <h3 class="font-medium text-white">Turbo Apply</h3>
                <p class="text-sm text-green-100">One-click applications</p>
              </div>
            </div>
            <div class="rounded-lg bg-white/10 p-4">
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mx-auto mb-2 size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 class="font-medium text-white">AI Enhancement</h3>
                <p class="text-sm text-green-100">AI-powered resumes</p>
              </div>
            </div>
            <div class="rounded-lg bg-white/10 p-4">
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mx-auto mb-2 size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                <h3 class="font-medium text-white">Auto Apply</h3>
                <p class="text-sm text-green-100">Automated applications</p>
              </div>
            </div>
            <div class="rounded-lg bg-white/10 p-4">
              <div class="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mx-auto mb-2 size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-5 5v-5zM4 12h16M4 18h16"
                  />
                </svg>
                <h3 class="font-medium text-white">Job Tracking</h3>
                <p class="text-sm text-green-100">Application tracking</p>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <router-link
              to="/dashboard"
              class="rounded-md bg-white px-6 py-3 font-medium text-green-600 transition-colors hover:bg-gray-100"
            >
              Go to Dashboard
            </router-link>
            <router-link
              to="/search"
              class="rounded-md bg-green-700 px-6 py-3 font-medium text-white transition-colors hover:bg-green-800"
            >
              Start Job Search
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-white py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
          Ready to Find Your Dream Job?
        </h2>
        <p class="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
          Join thousands of professionals who found their perfect career match
          with Turbo Job Apply
        </p>
        <div
          class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <router-link to="/search" class="btn-primary">
            Start Searching
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/subscription"
            class="btn-outline"
          >
            Create Account
          </router-link>
          <router-link
            v-else-if="!isPremium"
            to="/subscription"
            class="btn-outline"
          >
            Get Premium Access
          </router-link>
          <router-link v-else to="/dashboard" class="btn-outline">
            Go to Dashboard
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
  @apply inline-flex rounded-full bg-secondary-100 px-2 py-1 text-xs text-secondary-800;
}

.btn-primary {
  @apply inline-block rounded-md bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-primary-700;
}

.line-through {
  text-decoration: line-through;
}

/* Scale and fade transition for rotating facts */
.scale-fade-enter-active {
  transition: all 0.5s ease-in;
}

.scale-fade-leave-active {
  transition: all 5s ease-out;
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.scale-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(2);
}

.scale-fade-text {
  transform-origin: center;
  white-space: nowrap;
}
</style>
