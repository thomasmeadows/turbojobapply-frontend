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

const logout = () => {
  authStore.logout();
  router.push('/');
  closeMobileMenu();
};
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and primary navigation -->
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center" @click="closeMobileMenu">
            <img src="/turbojobapply.svg" alt="Turbo Job Apply Logo" class="h-8 w-auto" />
          </router-link>
          
          <!-- Desktop Navigation -->
          <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/search" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200" 
                :class="[$route.path === '/search' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              Find Jobs
            </router-link>
            <router-link to="/pricing" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200" 
                :class="[$route.path === '/pricing' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              Pricing
            </router-link>
            <router-link to="/about" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200" 
                :class="[$route.path === '/about' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              About
            </router-link>
          </nav>
        </div>
        
        <!-- Auth Buttons / User Menu -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <template v-if="isLoggedIn">
            <router-link to="/saved-jobs" class="ml-4 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200">
              Saved Jobs
            </router-link>
            
            <div class="ml-3 relative">
              <div class="relative">
                <button class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" @click="toggleMobileMenu">
                  <span class="p-2 rounded-full text-gray-700 bg-gray-100">
                    <span class="sr-only">Open user menu</span>
                    {{ authStore.user?.name.charAt(0).toUpperCase() }}
                  </span>
                </button>
                <span v-if="isPremium" class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-accent-500 ring-2 ring-white"></span>
              </div>
              <!-- Dropdown menu -->
              <div v-if="mobileMenuOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="closeMobileMenu">Dashboard</router-link>
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="closeMobileMenu">Profile</router-link>
                <router-link to="/subscription" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="closeMobileMenu">
                  <span v-if="isPremium">Premium Account</span>
                  <span v-else>Upgrade to Premium</span>
                </router-link>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/login" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                Log in
              </router-link>
              <router-link to="/register" class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                Sign up
              </router-link>
            </div>
          </template>
        </div>
        
        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-controls="mobile-menu" aria-expanded="false" @click="toggleMobileMenu">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/search" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200" 
            :class="[$route.path === '/search' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']"
            @click="closeMobileMenu">
          Find Jobs
        </router-link>
        <router-link to="/pricing" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200" 
            :class="[$route.path === '/pricing' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']"
            @click="closeMobileMenu">
          Pricing
        </router-link>
        <router-link to="/about" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200" 
            :class="[$route.path === '/about' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']"
            @click="closeMobileMenu">
          About
        </router-link>
      </div>
      
      <div class="pt-4 pb-3 border-t border-gray-200">
        <template v-if="isLoggedIn">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span class="text-gray-700 font-medium">{{ authStore.user?.name.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ authStore.user?.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email }}</div>
            </div>
            <span v-if="isPremium" class="ml-3 px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-800">Premium</span>
          </div>
          <div class="mt-3 space-y-1">
            <router-link to="/dashboard" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="closeMobileMenu">Dashboard</router-link>
            <router-link to="/saved-jobs" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="closeMobileMenu">Saved Jobs</router-link>
            <router-link to="/profile" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="closeMobileMenu">Profile</router-link>
            <router-link to="/subscription" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="closeMobileMenu">
              <span v-if="isPremium">Premium Account</span>
              <span v-else>Upgrade to Premium</span>
            </router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Sign out
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col px-4 space-y-3">
            <router-link to="/login" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200" @click="closeMobileMenu">
              Log in
            </router-link>
            <router-link to="/register" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-colors duration-200" @click="closeMobileMenu">
              Sign up
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>