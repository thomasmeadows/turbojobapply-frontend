<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const verificationStatus = ref<'loading' | 'success' | 'error' | 'expired'>('loading');
const errorMessage = ref('');

// Get redirect path from query params
const redirectPath = (route.query.redirect as string) || '/dashboard';

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    verificationStatus.value = 'error';
    errorMessage.value = 'No verification token provided';
    return;
  }

  loading.value = true;

  try {
    const success = await authStore.verifyMagicLink(token);

    if (success) {
      verificationStatus.value = 'success';

      // Redirect after 3 seconds
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        await router.push(redirectPath);
      }, 3000);
    } else {
      verificationStatus.value = 'error';
      errorMessage.value = authStore.error || 'Invalid or expired magic link';

      if (authStore.error?.includes('expired')) {
        verificationStatus.value = 'expired';
      }
    }
  } catch (error) {
    verificationStatus.value = 'error';
    errorMessage.value = 'Failed to verify magic link';
    console.error('Magic link verification error:', error);
  } finally {
    loading.value = false;
  }
});

const goToDashboard = async () => {
  await router.push(redirectPath);
};

const goToLogin = async () => {
  await router.push('/login');
};
</script>

<template>
  <div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <!-- Loading State -->
        <div v-if="verificationStatus === 'loading'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto size-12 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Verifying your email...</h2>
          <p class="mt-2 text-gray-600">Please wait while we verify your magic link.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationStatus === 'success'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto size-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Welcome to TurboJobApply!</h2>
          <p class="mt-2 text-gray-600">Your email has been verified and you're now logged in.</p>
          <p class="mt-4 text-sm text-gray-500">Redirecting you to the dashboard in a few seconds...</p>

          <div class="mt-6">
            <button
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="goToDashboard"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <!-- Expired State -->
        <div v-else-if="verificationStatus === 'expired'" class="text-center">
          <div class="mb-4">
            <svg class="mx-auto size-12 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Magic Link Expired</h2>
          <p class="mt-2 text-gray-600">This magic link has expired. Magic links are only valid for 15 minutes for security reasons.</p>

          <div class="mt-6">
            <button
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="goToLogin"
            >
              Request New Magic Link
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center">
          <div class="mb-4">
            <svg class="mx-auto size-12 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Verification Failed</h2>
          <p class="mt-2 text-gray-600">
            {{ errorMessage }}
          </p>

          <div class="mt-6">
            <button
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="goToLogin"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
