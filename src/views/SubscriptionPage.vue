<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { StripeService, type SubscriptionStatus } from '../services/stripe';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const paymentSuccess = ref(false);
const errorMessage = ref('');
const subscriptionData = ref<SubscriptionStatus | null>(null);
const loadingSubscription = ref(true);

const isPremium = computed(() => authStore.isPremium);

const isSubscriptionActive = computed(() => {
  if (!subscriptionData.value?.subscription) return false;
  return StripeService.isSubscriptionActive(subscriptionData.value.subscription);
});

const subscriptionStatus = computed(() => {
  if (!subscriptionData.value?.subscription) return 'inactive';
  return StripeService.formatSubscriptionStatus(subscriptionData.value.subscription.status);
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

const handleSubscribe = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Redirect to Stripe Checkout
    const currentUrl = window.location.origin;
    await StripeService.redirectToCheckout(
      `${currentUrl}/subscription?success=true`,
      `${currentUrl}/subscription?canceled=true`
    );
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to start checkout process. Please try again.';
    console.error('Subscription error:', error);
    loading.value = false;
  }
};


const handleReactivate = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    await StripeService.reactivateSubscription();
    paymentSuccess.value = true;
    await loadSubscriptionStatus(); // Refresh subscription data
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Reactivation failed. Please try again.';
    console.error('Reactivation error:', error);
  } finally {
    loading.value = false;
  }
};

const handleManageBilling = async () => {
  try {
    await StripeService.redirectToCustomerPortal();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to access billing portal. Please try again.';
    console.error('Billing portal error:', error);
  }
};

onMounted(async () => {
  await loadSubscriptionStatus();
  
  // Check for success/canceled URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    paymentSuccess.value = true;
    await authStore.refreshUserProfile(); // Refresh user profile to get updated roles
    await loadSubscriptionStatus(); // Refresh subscription data
  } else if (urlParams.get('canceled') === 'true') {
    errorMessage.value = 'Subscription setup was canceled. You can try again anytime.';
  }
});
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
        
        <!-- Loading State -->
        <div v-if="loadingSubscription" class="flex justify-center items-center py-8">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Loading subscription status...</span>
        </div>

        <!-- Main Content -->
        <div v-else-if="isPremium || isSubscriptionActive">
          <div class="flex items-center mb-6">
            <div class="bg-accent-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">You're a Premium Member!</h3>
              <p class="text-gray-600" v-if="subscriptionData?.subscription?.cancel_at_period_end">
                Your subscription is canceled but remains active until {{ nextBillingDate }}
              </p>
              <p class="text-gray-600" v-else>
                Your subscription is active and will renew automatically
              </p>
            </div>
          </div>
          
          <!-- Cancellation Notice -->
          <div v-if="subscriptionData?.subscription?.cancel_at_period_end" class="mb-6 rounded-md bg-yellow-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Subscription Canceled</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>Your subscription has been canceled but you'll continue to have premium access until {{ nextBillingDate }} ({{ daysRemaining }} days remaining).</p>
                </div>
                <div class="mt-4">
                  <button 
                    @click="handleReactivate" 
                    class="text-sm bg-yellow-50 text-yellow-800 hover:bg-yellow-100 px-3 py-1 rounded border border-yellow-200"
                    :disabled="loading"
                  >
                    {{ loading ? 'Processing...' : 'Reactivate Subscription' }}
                  </button>
                </div>
              </div>
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
                  <p class="text-gray-600" v-if="nextBillingDate">
                    {{ subscriptionData?.subscription?.cancel_at_period_end ? 'Access expires on' : 'Next billing date:' }} {{ nextBillingDate }}
                  </p>
                </div>
                <span 
                  :class="{
                    'bg-green-100 text-green-800': subscriptionStatus === 'Active',
                    'bg-yellow-100 text-yellow-800': subscriptionStatus === 'Canceled',
                    'bg-red-100 text-red-800': subscriptionStatus === 'Past Due' || subscriptionStatus === 'Unpaid',
                    'bg-blue-100 text-blue-800': subscriptionStatus === 'Trial Period',
                    'bg-gray-100 text-gray-800': !['Active', 'Canceled', 'Past Due', 'Unpaid', 'Trial Period'].includes(subscriptionStatus)
                  }"
                  class="text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {{ subscriptionStatus }}
                </span>
              </div>
              
              <div class="bg-gray-50 rounded-md p-4 mb-6">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-gray-900 font-medium">Premium Plan</p>
                    <p class="text-gray-600 text-sm">Monthly subscription with advanced features</p>
                  </div>
                  <div class="text-right">
                    <p class="text-gray-900 font-medium">$19.99/month</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3">
                <button 
                  @click="handleManageBilling" 
                  class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Manage Billing
                </button>
                
                <button 
                  v-if="!subscriptionData?.subscription?.cancel_at_period_end"
                  @click="router.push('/subscription/cancel')" 
                  class="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Upgrade to Premium</h3>
          
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
                  <p class="text-gray-600 text-sm">Monthly subscription with advanced features</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-900 font-medium">$19.99/month</p>
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
              {{ loading ? 'Redirecting to checkout...' : 'Subscribe Now' }}
            </button>
            
            <p class="mt-2 text-xs text-gray-500 text-center">
              Cancel anytime. You'll continue to have access until the end of your billing period.
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