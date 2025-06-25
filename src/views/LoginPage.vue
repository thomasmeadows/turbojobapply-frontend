<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Get redirect path from query params
const redirectPath = (route.query.redirect as string) || '/dashboard';

// Check for magic link token or LinkedIn callback in URL
onMounted(async () => {
  const token = route.query.token as string;
  const code = route.query.code as string;
  const state = route.query.state as string;

  if (token) {
    // Handle magic link verification
    loading.value = true;

    try {
      const success = await authStore.verifyMagicLink(token);

      if (success) {
        await router.push(redirectPath);
      } else {
        errorMessage.value = authStore.error || 'Invalid or expired magic link';
      }
    } catch (error) {
      errorMessage.value = 'Failed to verify magic link';
      console.error('Magic link verification error:', error);
    } finally {
      loading.value = false;
    }
  } else if (code) {
    // Handle LinkedIn OAuth callback
    loading.value = true;

    try {
      const success = await authStore.handleLinkedInCallback(code, state);

      if (success) {
        await router.push(redirectPath);
      } else {
        errorMessage.value = authStore.error || 'LinkedIn login failed';
      }
    } catch (error) {
      errorMessage.value = 'LinkedIn login failed';
      console.error('LinkedIn callback error:', error);
    } finally {
      loading.value = false;
    }
  }
});

const handleSubmit = async () => {
  // Basic validation
  if (!email.value) {
    errorMessage.value = 'Please enter your email address';
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await authStore.sendMagicLink(email.value);

    if (result.success) {
      successMessage.value = 'Magic link sent! Check your email to log in.';
      email.value = ''; // Clear email field
    } else {
      errorMessage.value =
        result.message || 'Failed to send magic link. Please try again.';
    }
  } catch (error) {
    errorMessage.value = 'Something went wrong. Please try again.';
    console.error('Magic link error:', error);
  } finally {
    loading.value = false;
  }
};

const handleLinkedInLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await authStore.linkedInLogin();
    // LinkedIn login will redirect to LinkedIn, so no need to handle success here
  } catch (error) {
    errorMessage.value = 'LinkedIn login failed. Please try again.';
    console.error('LinkedIn login error:', error);
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to TurboJobApply
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email and we'll send you a magic link to log in. New users
        will be automatically registered.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="shrink-0">
                <svg
                  class="size-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-4 rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="shrink-0">
                <svg
                  class="size-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  {{ successMessage }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email address</label
            >
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your email address"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
            >
              <svg
                v-if="loading"
                class="-ml-1 mr-2 size-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ loading ? 'Sending Magic Link...' : 'Send Magic Link' }}
            </button>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="handleLinkedInLogin"
            >
              <svg class="mr-2 size-5" viewBox="0 0 24 24" fill="#0077B5">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
              {{ loading ? 'Connecting...' : 'Continue with LinkedIn' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              No password required! We'll send you a secure link that expires in
              15 minutes. First time here? You'll be automatically registered.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
