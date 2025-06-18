import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

// Initialize Stripe
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY environment variable is required');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface SubscriptionStatus {
  has_subscription: boolean;
  subscription: {
    id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    canceled_at?: string;
    ended_at?: string;
  } | null;
  message: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
  message: string;
}

export interface CustomerPortalResponse {
  portal_url: string;
  message: string;
}

export class StripeService {
  /**
   * Create a checkout session and redirect to Stripe
   */
  static async createCheckoutSession(successUrl?: string, cancelUrl?: string): Promise<CreateCheckoutResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscription/create-checkout-session`,
        {
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.response?.data?.error || 'Failed to create checkout session');
    }
  }

  /**
   * Redirect to Stripe Checkout
   */
  static async redirectToCheckout(successUrl?: string, cancelUrl?: string): Promise<void> {
    try {
      const { checkout_url } = await this.createCheckoutSession(successUrl, cancelUrl);
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  /**
   * Get current subscription status
   */
  static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await axios.get(`${API_URL}/api/subscription/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error getting subscription status:', error);
      throw new Error(error.response?.data?.error || 'Failed to get subscription status');
    }
  }

  /**
   * Force refresh subscription status from Stripe
   * Useful after payment completion to immediately sync status
   */
  static async refreshSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscription/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Error refreshing subscription status:', error);
      throw new Error(error.response?.data?.error || 'Failed to refresh subscription status');
    }
  }

  /**
   * Cancel subscription at period end
   */
  static async cancelSubscription(): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscription/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to cancel subscription');
    }
  }

  /**
   * Reactivate a canceled subscription
   */
  static async reactivateSubscription(): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscription/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      throw new Error(error.response?.data?.error || 'Failed to reactivate subscription');
    }
  }

  /**
   * Create customer portal session and redirect
   */
  static async redirectToCustomerPortal(): Promise<void> {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscription/customer-portal`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      const { portal_url } = response.data as CustomerPortalResponse;
      window.location.href = portal_url;
    } catch (error: any) {
      console.error('Error redirecting to customer portal:', error);
      throw new Error(error.response?.data?.error || 'Failed to access customer portal');
    }
  }

  /**
   * Format subscription status for display
   */
  static formatSubscriptionStatus(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial Period';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'unpaid':
        return 'Unpaid';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Expired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  /**
   * Check if subscription allows premium features
   */
  static isSubscriptionActive(subscription: SubscriptionStatus['subscription']): boolean {
    if (!subscription) return false;

    const activeStatuses = ['active', 'trialing'];
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);

    // Active subscription or canceled but still within billing period
    return activeStatuses.includes(subscription.status) || (subscription.cancel_at_period_end && now < periodEnd);
  }

  /**
   * Get days remaining in current period
   */
  static getDaysRemaining(subscription: SubscriptionStatus['subscription']): number {
    if (!subscription) return 0;

    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    const diffTime = periodEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
