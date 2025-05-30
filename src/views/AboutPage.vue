<script setup lang="ts">
// No specific setup needed for this page
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Page header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <img src="/turbojobapply.svg" alt="Turbo Job Apply Logo" class="h-16 w-auto mb-6" />
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 text-center">
          About Turbo Job Apply
        </h1>
        <p class="mt-4 text-xl text-gray-500 max-w-3xl text-center">
          We're on a mission to revolutionize how people find and apply to jobs, making the process faster, smarter, and more efficient.
        </p>
      </div>
    </div>

    <!-- Our Mission -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Our Mission</h2>
          <p class="mt-4 text-lg text-gray-500">
            At Turbo Job Apply, we believe job hunting should be easy, efficient, and even enjoyable. 
            Our platform is designed to eliminate the frustration and time-consumption typically 
            associated with job applications.
          </p>
          <p class="mt-4 text-lg text-gray-500">
            We're building tools that help job seekers quickly identify relevant opportunities, apply 
            with a single click, and track their applications — all while maintaining the personal 
            touch that makes each candidate unique.
          </p>
        </div>
        <div class="mt-10 lg:mt-0">
          <div class="bg-primary-50 rounded-lg p-8">
            <h3 class="text-xl font-bold text-primary-900 mb-4">What Sets Us Apart</h3>
            <ul class="space-y-4">
              <li class="flex">
                <svg class="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">One-click job applications with our Turbo Job Apply technology</span>
              </li>
              <li class="flex">
                <svg class="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">Automated job matching based on your skills and preferences</span>
              </li>
              <li class="flex">
                <svg class="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">Comprehensive application tracking and status updates</span>
              </li>
              <li class="flex">
                <svg class="h-6 w-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">Instant notifications for new relevant job postings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Our CEO section (replacing Our Team) -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">Our CEO</h2>
        </div>

        <div class="mt-12 flex flex-col md:flex-row items-center gap-12">
          <div class="w-full md:w-1/3 flex justify-center">
            <div class="h-48 w-48 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-primary-800 text-6xl font-bold">TM</span>
            </div>
          </div>
          <div class="w-full md:w-2/3">
            <p class="text-lg text-gray-700 leading-relaxed">
              Our CEO, like most interesting tech moguls did not receive a college degree in computer science.  He left college early to pursue career opportunities. After getting laid off from a failing multi-million dollar company, who outsourced his position, he embarked on a way to fix the industry.
            </p>
            <p class="text-lg text-gray-700 leading-relaxed mt-4">
              The company he worked for, a prominent contingent workforce solutions company, a company whose income revolved around getting people a job. He noticed the problem of Job Placement could be vastly improved and fixed by simply putting the power into the hands of the employee instead of the employer.
            </p>
            <p class="text-lg text-gray-700 leading-relaxed mt-4">
               With a new suite of AI tools, the CEO set out on his journey. He embarked to fix job placement problems. How could he do it?  Several days later, while playing retro games, he looked at his SNES controller from 1996 and saw a turbo button. The idea came to him instantly.  It was time, time for job searching to get a turbo button.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Us Banner -->
    <div class="bg-primary-600">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to find your dream job?</span>
          <span class="block text-primary-200">Join Turbo Job Apply today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <router-link to="/subscription" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
              Sign up for free
            </router-link>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <router-link to="/pricing" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700">
              View pricing
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 