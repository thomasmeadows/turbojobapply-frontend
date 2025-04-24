<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer style="background-color: rgba(12, 61, 91, 0.1);" class="text-gray-800">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <div class="space-y-8 xl:col-span-1">
          <div class="flex items-center">
            <img src="/turbojobapply.svg" alt="Turbo Job Apply Logo" class="h-8 w-auto" />
          </div>
          <p class="text-gray-600 text-base">
            Connecting talented professionals with their dream careers.
            Find your next opportunity with our powerful job search platform.
          </p>
          <div class="flex space-x-6">
            <a href="https://www.linkedin.com/company/turbojobapply" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-900">
              <span class="sr-only">LinkedIn</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 tracking-wider uppercase">For Job Seekers</h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <router-link to="/search" class="text-base text-gray-600 hover:text-gray-900">
                    Browse Jobs
                  </router-link>
                </li>
                <li>
                  <router-link to="/subscription" class="text-base text-gray-600 hover:text-gray-900">
                    Premium Features
                  </router-link>
                </li>
                <li>
                  <router-link to="/pricing" class="text-base text-gray-600 hover:text-gray-900">
                    Pricing
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-800 tracking-wider uppercase">For Employers</h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <router-link to="/employer-integrations" class="text-base text-gray-600 hover:text-gray-900">
                    ATS Integrations
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 tracking-wider uppercase">Company</h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <router-link to="/about" class="text-base text-gray-600 hover:text-gray-900">
                    About Us
                  </router-link>
                </li>
                <li>
                  <router-link to="/careers" class="text-base text-gray-600 hover:text-gray-900">
                    Careers at Turbo Apply
                  </router-link>
                </li>
              </ul>
            </div>
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-800 tracking-wider uppercase">Legal</h3>
              <ul class="mt-4 space-y-4">
                <li>
                  <router-link to="/privacy-policy" class="text-base text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </router-link>
                </li>
                <li>
                  <router-link to="/terms-of-service" class="text-base text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </router-link>
                </li>
                <li>
                  <router-link to="/cookie-policy" class="text-base text-gray-600 hover:text-gray-900">
                    Cookie Policy
                  </router-link>
                </li>
                <li>
                  <router-link to="/accessibility" class="text-base text-gray-600 hover:text-gray-900">
                    Accessibility
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12 border-t border-gray-200 pt-8">
        <p class="text-base text-gray-600 xl:text-center">
          &copy; {{ currentYear }} Turbo Apply. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>