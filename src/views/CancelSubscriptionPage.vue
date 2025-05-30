<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { StripeService, type SubscriptionStatus } from '../services/stripe';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const loadingSubscription = ref(true);
const subscriptionData = ref<SubscriptionStatus | null>(null);
const error = ref('');
const cancelationComplete = ref(false);

const isSubscriptionActive = computed(() => {
  if (!subscriptionData.value?.subscription) return false;
  return StripeService.isSubscriptionActive(subscriptionData.value.subscription) && 
         !subscriptionData.value.subscription.cancel_at_period_end;
});

const nextBillingDate = computed(() => {
  if (!subscriptionData.value?.subscription) return null;
  return StripeService.formatDate(subscriptionData.value.subscription.current_period_end);
});

const daysRemaining = computed(() => {
  if (!subscriptionData.value?.subscription) return 0;
  return StripeService.getDaysRemaining(subscriptionData.value.subscription);
});

const loadSubscriptionStatus = async () => {
  try {
    loadingSubscription.value = true;
    subscriptionData.value = await StripeService.getSubscriptionStatus();
  } catch (error) {
    console.error('Error loading subscription status:', error);
  } finally {
    loadingSubscription.value = false;
  }
};

const handleCancel = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await StripeService.cancelSubscription();
    cancelationComplete.value = true;
    await loadSubscriptionStatus(); // Refresh subscription data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Cancellation failed. Please try again.';
    console.error('Cancellation error:', err);
  } finally {
    loading.value = false;
  }
};

const handleKeepSubscription = () => {
  router.push('/subscription');
};

onMounted(async () => {
  await loadSubscriptionStatus();
  
  // If user doesn't have an active subscription, redirect to subscription page
  if (!loadingSubscription.value && !isSubscriptionActive.value) {
    router.push('/subscription');
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loadingSubscription" class="flex justify-center items-center py-12">
      <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-gray-600">Loading subscription details...</span>
    </div>

    <!-- Main Content -->
    <div v-else-if="isSubscriptionActive">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-red-50 px-6 py-8 border-b border-red-100">
          <div class="flex items-center">
            <div class="bg-red-100 p-3 rounded-full">
              <svg class="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-4">
              <h1 class="text-2xl font-bold text-gray-900">Cancel Your Subscription</h1>
              <p class="text-gray-600 mt-1">We're sorry to see you go!</p>
            </div>
          </div>
        </div>

        <!-- Cancellation Complete -->
        <div v-if="cancelationComplete" class="p-6">
          <div class="mb-6 rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">Subscription Canceled Successfully</h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>Your subscription has been canceled. You'll continue to have premium access until {{ nextBillingDate }} ({{ daysRemaining }} days remaining).</p>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <h3 class="text-lg font-medium text-gray-900 mb-4">What happens next?</h3>
            <div class="space-y-4 text-left max-w-2xl mx-auto">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">You keep premium access until {{ nextBillingDate }}</p>
                  <p class="text-gray-600 text-sm">Continue using all premium features for the remainder of your billing period</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">No future charges</p>
                  <p class="text-gray-600 text-sm">Your subscription will not renew and you won't be charged again</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">Easy to reactivate</p>
                  <p class="text-gray-600 text-sm">You can reactivate your subscription anytime from your subscription page</p>
                </div>
              </div>
            </div>

            <div class="mt-8 space-y-3">
              <button 
                @click="router.push('/subscription')" 
                class="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                Back to Subscription
              </button>
              
              <div class="text-center">
                <button 
                  @click="router.push('/dashboard')" 
                  class="text-sm text-accent-600 hover:text-accent-700"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancellation Form -->
        <div v-else class="p-6">
          <!-- Error Message -->
          <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <div class="text-center mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Before you cancel...</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              We'd hate to see you go! Your cancellation will take effect at the end of your current billing period,
              so you'll continue to have access to all premium features until {{ nextBillingDate }}.
            </p>
          </div>

          <!-- Current Subscription Info -->
          <div class="bg-gray-50 rounded-md p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Your Current Subscription</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Plan</p>
                <p class="text-gray-900">Premium Monthly</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Next Billing Date</p>
                <p class="text-gray-900">{{ nextBillingDate }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Monthly Cost</p>
                <p class="text-gray-900">$19.99</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Status</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          <!-- What You'll Lose -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">What you'll lose after {{ nextBillingDate }}:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">Turbo Job Apply</p>
                  <p class="text-gray-600 text-sm">One-click job applications</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">AI Job Apply</p>
                  <p class="text-gray-600 text-sm">AI-enhanced resumes and cover letters</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">Auto Job Apply</p>
                  <p class="text-gray-600 text-sm">Automated job applications</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p class="text-gray-900 font-medium">Premium Support</p>
                  <p class="text-gray-600 text-sm">Priority customer assistance</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                @click="handleKeepSubscription" 
                class="inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                Keep My Subscription
              </button>
              
              <button 
                @click="handleCancel" 
                class="inline-flex justify-center py-3 px-6 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                :disabled="loading"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loading ? 'Processing...' : 'Yes, Cancel My Subscription' }}
              </button>
            </div>
            
            <p class="text-xs text-gray-500 text-center mt-4">
              You can reactivate your subscription anytime before {{ nextBillingDate }} without losing access.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Active Subscription -->
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="mt-4 text-lg font-medium text-gray-900">No Active Subscription</h2>
        <p class="mt-2 text-gray-500">You don't have an active subscription to cancel.</p>
        <div class="mt-6">
          <button 
            @click="router.push('/subscription')" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            View Subscription Options
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>