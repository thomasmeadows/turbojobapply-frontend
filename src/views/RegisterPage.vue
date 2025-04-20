<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);
const loading = ref(false);
const errorMessage = ref('');

// Get redirect path from query params
const redirectPath = route.query.redirect as string || '/dashboard';

const handleSubmit = async () => {
  // Basic validation
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all required fields';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  
  if (!agreeTerms.value) {
    errorMessage.value = 'Please agree to the terms and conditions';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const success = await authStore.register(name.value, email.value, password.value);
    
    if (success) {
      router.push(redirectPath);
    } else {
      errorMessage.value = authStore.error || 'Registration failed. Please try again.';
    }
  } catch (error) {
    errorMessage.value = 'Something went wrong. Please try again.';
    console.error('Registration error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
            <div class="mt-1">
              <input 
                id="name" 
                v-model="name" 
                name="name" 
                type="text" 
                autocomplete="name" 
                required 
                class="form-input"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="password" 
                name="password" 
                type="password" 
                autocomplete="new-password" 
                required 
                class="form-input"
              />
            </div>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm password</label>
            <div class="mt-1">
              <input 
                id="confirm-password" 
                v-model="confirmPassword" 
                name="confirm-password" 
                type="password" 
                required 
                class="form-input"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input 
              id="agree-terms" 
              v-model="agreeTerms" 
              name="agree-terms" 
              type="checkbox" 
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" 
            />
            <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
              I agree to the
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">terms and conditions</a>
            </label>
          </div>

          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>

            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>