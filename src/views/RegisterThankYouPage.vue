<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</h1>
      <h2 class="text-xl font-medium text-gray-700 mb-4">Thank you for signing up.</h2>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-gray-700 mb-2">
          <strong>Please check your email</strong> to verify your email address.
        </p>
        <p class="text-gray-600 text-sm">
          We've sent a verification link to the email address you provided. 
          After verifying your email, you'll be able to log in and enjoy all features.
        </p>
      </div>
      <div class="mt-6">
        <button 
          @click="goToLogin" 
          class="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
</template> 