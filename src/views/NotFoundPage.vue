<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto mb-4 size-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 class="mb-4 text-4xl font-bold text-gray-900">404</h1>
      <h2 class="mb-2 text-2xl font-semibold text-gray-900">Page Not Found</h2>
      <p class="mb-8 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div
        class="flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
      >
        <button class="btn-outline" @click="goBack">Go Back</button>
        <router-link to="/" class="btn-primary"> Back to Home </router-link>
      </div>
    </div>
  </div>
</template>
