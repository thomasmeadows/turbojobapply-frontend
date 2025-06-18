import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { StripeService } from '../services/stripe';

export function useSubscriptionRefresh() {
  const authStore = useAuthStore();
  const isRefreshing = ref(false);

  /**
   * Comprehensive subscription refresh after payment/changes
   * This handles the full flow of updating user data after subscription changes
   */
  const refreshAfterPayment = async (
    options: {
      pollForChanges?: boolean;
      maxAttempts?: number;
      onProgress?: (_attempt: number, _maxAttempts: number) => void;
    } = {},
  ) => {
    const { pollForChanges = true, maxAttempts = 6, onProgress } = options;

    if (isRefreshing.value) {
      console.log('Refresh already in progress, skipping');
      return false;
    }

    try {
      isRefreshing.value = true;
      let attempts = 0;
      let hasActivePremium = false;
      const startTime = Date.now();

      while (attempts < maxAttempts && !hasActivePremium) {
        attempts++;

        if (onProgress) {
          onProgress(attempts, maxAttempts);
        }

        console.log(`Subscription refresh attempt ${attempts}/${maxAttempts}`);

        // Wait before checking (2 seconds first attempt, then 5 seconds)
        if (attempts === 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        try {
          // 1. Force subscription sync via dedicated endpoint
          const refreshedData = await StripeService.refreshSubscriptionStatus();

          // 2. Refresh user profile to get updated roles
          await authStore.refreshUserProfile();

          // 3. Refresh access token to get latest roles in JWT
          if (authStore.refreshToken) {
            await authStore.refreshAccessToken();
          }

          // 4. Check if premium status is now active
          hasActivePremium = authStore.isPremium || (refreshedData.subscription && StripeService.isSubscriptionActive(refreshedData.subscription));

          if (hasActivePremium) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`Premium status confirmed after ${duration}s (${attempts} attempts)`);
            return true;
          }

          if (!pollForChanges) {
            // If not polling, just do one refresh attempt
            break;
          }

          console.log('Premium status not yet active, retrying...');
        } catch (error) {
          console.error(`Error during refresh attempt ${attempts}:`, error);

          // If we can't reach the API, try the fallback auth store method
          try {
            await authStore.refreshAfterSubscriptionChange(false);
          } catch (fallbackError) {
            console.error('Fallback refresh also failed:', fallbackError);
          }
        }
      }

      if (!hasActivePremium && pollForChanges) {
        console.warn(`Premium status not activated after ${maxAttempts} attempts`);
        return false;
      }

      return !pollForChanges; // Return true if not polling (single attempt)
    } catch (error) {
      console.error('Error in subscription refresh:', error);
      return false;
    } finally {
      isRefreshing.value = false;
    }
  };

  /**
   * Quick refresh without polling - useful for manual refresh buttons
   */
  const quickRefresh = async () => {
    return await refreshAfterPayment({
      pollForChanges: false,
      maxAttempts: 1,
    });
  };

  /**
   * Manual refresh with user feedback
   */
  const manualRefresh = async (onProgress?: (_message: string) => void) => {
    if (onProgress) onProgress('Checking subscription status...');

    const success = await refreshAfterPayment({
      pollForChanges: true,
      maxAttempts: 3,
      onProgress: (attempt, max) => {
        if (onProgress) {
          onProgress(`Checking subscription status... (${attempt}/${max})`);
        }
      },
    });

    if (onProgress) {
      onProgress(success ? 'Subscription status updated!' : 'Unable to confirm subscription status');
    }

    return success;
  };

  return {
    isRefreshing,
    refreshAfterPayment,
    quickRefresh,
    manualRefresh,
  };
}
