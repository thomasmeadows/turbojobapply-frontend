<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const mobileMenuOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);
const isPremium = computed(() => authStore.isPremium);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const logout = async () => {
  await authStore.logout();
  await router.push('/');
  closeMobileMenu();
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Logo and primary navigation -->
        <div class="flex">
          <router-link
            to="/"
            class="flex shrink-0 items-center"
            @click="closeMobileMenu"
          >
            <img
              src="/turbojobapply.svg"
              alt="Turbo Job Apply Logo"
              class="h-8 w-auto"
            />
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/search"
              class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="[
                $route.path === '/search'
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              Find Jobs
            </router-link>
            <router-link
              to="/pricing"
              class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="[
                $route.path === '/pricing'
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              Pricing
            </router-link>
            <router-link
              to="/about"
              class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="[
                $route.path === '/about'
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              About
            </router-link>
          </nav>
        </div>

        <!-- Auth Buttons / User Menu -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <template v-if="isLoggedIn">
            <router-link
              to="/saved-jobs"
              class="ml-4 rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
            >
              Saved Jobs
            </router-link>

            <div class="relative ml-3 flex items-center">
              <!-- User Icon - Click to go to dashboard -->
              <div class="relative">
                <router-link
                  to="/dashboard"
                  class="flex rounded-full bg-white text-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span class="rounded-full bg-gray-100 p-2 text-gray-700">
                    <span class="sr-only">Go to dashboard</span>
                    <svg
                      class="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                </router-link>
                <span
                  v-if="isPremium"
                  class="absolute bottom-0 right-0 block size-2.5 rounded-full bg-accent-500 ring-2 ring-white"
                />
              </div>

              <!-- Dropdown Arrow Button -->
              <button
                class="ml-1 rounded-md p-1 text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                @click="toggleMobileMenu"
              >
                <span class="sr-only">Open user menu</span>
                <svg
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <!-- Dropdown menu -->
              <div
                v-if="mobileMenuOpen"
                class="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <router-link
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeMobileMenu"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeMobileMenu"
                >
                  Profile
                </router-link>
                <router-link
                  to="/job-profiles"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeMobileMenu"
                >
                  Job Profiles
                </router-link>
                <router-link
                  to="/job-applications"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeMobileMenu"
                >
                  Application History
                </router-link>
                <router-link
                  to="/subscription"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeMobileMenu"
                >
                  <span v-if="isPremium">Premium Account</span>
                  <span v-else>Upgrade to Premium</span>
                </router-link>
                <button
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  @click="logout"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex shrink-0 items-center">
              <router-link
                to="/login"
                class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log in/Create Account
              </router-link>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" id="mobile-menu" class="sm:hidden">
      <div class="space-y-1 pb-3 pt-2">
        <router-link
          to="/search"
          class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200"
          :class="[
            $route.path === '/search'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          ]"
          @click="closeMobileMenu"
        >
          Find Jobs
        </router-link>
        <router-link
          to="/pricing"
          class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200"
          :class="[
            $route.path === '/pricing'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          ]"
          @click="closeMobileMenu"
        >
          Pricing
        </router-link>
        <router-link
          to="/about"
          class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200"
          :class="[
            $route.path === '/about'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          ]"
          @click="closeMobileMenu"
        >
          About
        </router-link>
      </div>

      <div class="border-t border-gray-200 pb-3 pt-4">
        <template v-if="isLoggedIn">
          <div class="flex items-center px-4">
            <div class="shrink-0">
              <div
                class="flex size-10 items-center justify-center rounded-full bg-gray-100"
              >
                <svg
                  class="size-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ authStore.user?.name }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ authStore.user?.email }}
              </div>
            </div>
            <span
              v-if="isPremium"
              class="ml-3 rounded-full bg-accent-100 px-2 py-1 text-xs text-accent-800"
              >Premium</span
            >
          </div>
          <div class="mt-3 space-y-1">
            <router-link
              to="/dashboard"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="closeMobileMenu"
            >
              Dashboard
            </router-link>
            <router-link
              to="/saved-jobs"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="closeMobileMenu"
            >
              Saved Jobs
            </router-link>
            <router-link
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="closeMobileMenu"
            >
              Profile
            </router-link>
            <router-link
              to="/subscription"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="closeMobileMenu"
            >
              <span v-if="isPremium">Premium Account</span>
              <span v-else>Upgrade to Premium</span>
            </router-link>
            <button
              class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              @click="logout"
            >
              Sign out
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-3 px-4">
            <router-link
              to="/login"
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none"
              @click="closeMobileMenu"
            >
              Log in/Create Account
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
