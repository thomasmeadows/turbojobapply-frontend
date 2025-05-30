<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const loading = ref(false);
const paymentSuccess = ref(false);
const errorMessage = ref('');

const isPremium = computed(() => authStore.isPremium);

const handleSubscribe = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Simulating payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update user's premium status
    authStore.updatePremiumStatus(true);
    
    // Show success message
    paymentSuccess.value = true;
  } catch (error) {
    errorMessage.value = 'Payment processing failed. Please try again.';
    console.error('Subscription error:', error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Simulating cancellation processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user's premium status
    authStore.updatePremiumStatus(false);
    
    // Show success message
    paymentSuccess.value = false;
  } catch (error) {
    errorMessage.value = 'Cancellation failed. Please try again.';
    console.error('Cancellation error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Beta Banner -->
    <div class="bg-primary-600 text-white py-4 rounded-lg mb-6">
      <div class="text-center">
        <p class="text-lg font-medium">
          <span class="inline-flex items-center">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Limited Time: All Premium Features Free During Beta Testing
          </span>
        </p>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 mb-2">Premium Subscription</h1>
    <p class="text-gray-600 mb-6">Unlock advanced features to supercharge your job search</p>
    
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Banner -->
      <div class="bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-8 text-white">
        <h2 class="text-2xl font-bold mb-2">Turbo Job Apply Premium</h2>
        <p class="text-accent-100">Advanced AI-powered job application features</p>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Success Message -->
        <div v-if="paymentSuccess && !loading" class="mb-6 rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">Your premium subscription has been activated successfully!</p>
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div v-if="isPremium">
          <div class="flex items-center mb-6">
            <div class="bg-accent-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">You're a Premium Member!</h3>
              <p class="text-gray-600">Your subscription is active and will renew automatically</p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Your Premium Benefits</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">Turbo Job Apply</h4>
                  <p class="text-gray-600">Apply to jobs with one click</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">AI Job Apply</h4>
                  <p class="text-gray-600">Use AI to enhance resume's and cover's before submitting them</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">Auto Job Apply</h4>
                  <p class="text-gray-600">Set criteria and let us apply for you</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">Job Notifications</h4>
                  <p class="text-gray-600">Real-time alerts for new matching jobs</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">Job Tracking</h4>
                  <p class="text-gray-600">Track application status and follow-ups</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 class="text-gray-900 font-medium">Premium Customer Support</h4>
                  <p class="text-gray-600">Priority assistance</p>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="text-gray-900 font-medium">Billing Information</h4>
                  <p class="text-gray-600">Your plan renews on June 15, 2023</p>
                </div>
                <span class="bg-accent-100 text-accent-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
              </div>
              
              <div class="bg-gray-50 rounded-md p-4 mb-6">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-gray-900 font-medium">Premium Plan</p>
                    <p class="text-gray-600 text-sm">Currently free during beta - Future price: $19.99/month</p>
                  </div>
                  <div class="text-right">
                    <p class="text-gray-900 font-medium line-through text-gray-400">$19.99/month</p>
                    <p class="text-accent-600 font-bold">FREE (Beta)</p>
                  </div>
                </div>
              </div>
              
              <button 
                @click="handleCancel" 
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                :disabled="loading"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Processing...' : 'Cancel Subscription' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Get Premium Features - Free During Beta Testing</h3>
          
          <div class="space-y-4 mb-6">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">Turbo Job Apply</h4>
                <p class="text-gray-600">Apply to jobs with one click</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">AI Job Apply</h4>
                <p class="text-gray-600">Use AI to enhance resume's and cover's before submitting them</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">Auto Job Apply</h4>
                <p class="text-gray-600">Set criteria and let us apply for you</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">Job Notifications</h4>
                <p class="text-gray-600">Real-time alerts for new matching jobs</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">Job Tracking</h4>
                <p class="text-gray-600">Track application status and follow-ups</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 class="text-gray-900 font-medium">Premium Customer Support</h4>
                <p class="text-gray-600">Priority assistance</p>
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-6">
            <div class="bg-gray-50 rounded-md p-4 mb-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-900 font-medium">Premium Plan</p>
                  <p class="text-gray-600 text-sm">Free during beta - Future price: $19.99/month</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-900 font-medium line-through text-gray-400">$19.99/month</p>
                  <p class="text-accent-600 font-bold">FREE (Beta)</p>
                </div>
              </div>
            </div>
            
            <button 
              @click="handleSubscribe" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Processing...' : 'Get Free Beta Access' }}
            </button>
            
            <p class="mt-2 text-xs text-gray-500 text-center">
              Free during beta testing. By accessing premium features, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>