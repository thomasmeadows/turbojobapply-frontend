import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name?: string;
  email_validated: boolean;
  last_login?: string;
  created_at: string;
  roles?: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Auth API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.accessToken;
    },
    isEmailValidated(): boolean {
      return this.user?.email_validated || false;
    },
    hasRole:
      (state) =>
      (roleName: string): boolean => {
        return state.user?.roles?.includes(roleName) || false;
      },
    isAdmin(): boolean {
      return this.user?.roles?.includes('admin') || false;
    },
    isPremium(): boolean {
      return this.user?.roles?.includes('premium') || false;
    },
  },

  actions: {
    // Check if user is logged in (from local storage)
    async checkAuth() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (accessToken && refreshToken && userData) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        try {
          this.user = JSON.parse(userData);
          // Ensure roles array exists for backward compatibility
          if (this.user && !this.user.roles) {
            this.user.roles = [];
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          await this.logout();
          return;
        }

        // Set up axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
    },

    // Send magic link to user's email
    async sendMagicLink(email: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/api/auth/send-magic-link`, {
          email,
        });

        return {
          success: true,
          message: response.data.message,
        };
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Failed to send magic link. Please try again.';
        }
        console.error('Magic link error:', error);
        return {
          success: false,
          message: this.error,
        };
      } finally {
        this.loading = false;
      }
    },

    // Verify magic link token (called when user clicks magic link)
    async verifyMagicLink(token: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_URL}/api/auth/verify?token=${token}`);

        if (response.data && response.data.access_token) {
          const { access_token, refresh_token, user } = response.data;

          // Ensure user has roles array
          if (user && !user.roles) {
            user.roles = [];
          }

          // Save to store
          this.accessToken = access_token;
          this.refreshToken = refresh_token;
          this.user = user;

          // Save to local storage
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));

          // Set up axios default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          return true;
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Invalid or expired magic link';
        }
        console.error('Magic link verification error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Refresh access token using refresh token
    async refreshAccessToken() {
      if (!this.refreshToken) {
        await this.logout();
        return false;
      }

      try {
        const axiosRefresh = axios.create();
        const response = await axiosRefresh.post(`${API_URL}/api/auth/refresh`, {
          refresh_token: this.refreshToken,
        });

        if (response.data && response.data.access_token) {
          const { access_token, user } = response.data;

          // Ensure user has roles array
          if (user && !user.roles) {
            user.roles = [];
          }

          // Update tokens
          this.accessToken = access_token;
          this.user = user;

          // Update local storage
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('user', JSON.stringify(user));

          // Update axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          return true;
        } else {
          await this.logout();
          throw new Error('Invalid refresh response');
        }
      } catch (error: any) {
        console.error('Token refresh failed:', error);
        await this.logout();
        return false;
      }
    },

    // Get user profile
    async getUserProfile() {
      if (!this.accessToken) {
        return false;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/profile`);

        if (response.data) {
          const user = response.data;
          // Ensure user has roles array
          if (user && !user.roles) {
            user.roles = [];
          }

          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }

        return false;
      } catch (error: any) {
        console.error('Failed to get user profile:', error);

        // If token is invalid, try to refresh
        if (error.response?.status === 401) {
          return await this.refreshAccessToken();
        }

        return false;
      }
    },

    // Logout user
    async logout() {
      // Call logout endpoint if we have a token
      if (this.accessToken) {
        try {
          await axios.post(`${API_URL}/api/auth/logout`);
        } catch (error) {
          console.error('Logout API call failed:', error);
        }
      }

      // Clear state
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.error = null;

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
    },

    // Set up axios interceptor for automatic token refresh
    setupAxiosInterceptor() {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = false;

            try {
              const refreshSuccess = await this.refreshAccessToken();
              if (refreshSuccess) {
                originalRequest.headers['Authorization'] = `Bearer ${this.accessToken}`;
                return axios(originalRequest);
              }
              return this.logout();
            } catch (_e: any) {
              console.error(_e);
              return this.logout();
            }
          }
        },
      );
    },

    // Initiate LinkedIn OAuth flow
    async linkedInLogin() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/api/auth/linkedin`);

        if (response.data && response.data.authUrl) {
          // Store state for verification
          sessionStorage.setItem('linkedin_oauth_state', response.data.state);

          // Redirect to LinkedIn OAuth
          window.location.href = response.data.authUrl;

          return true;
        } else {
          throw new Error('Failed to get LinkedIn OAuth URL');
        }
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Failed to initiate LinkedIn login. Please try again.';
        }
        console.error('LinkedIn login error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Handle LinkedIn OAuth callback
    async handleLinkedInCallback(code: string, state?: string) {
      this.loading = true;
      this.error = null;

      try {
        // Verify state parameter if provided
        const storedState = sessionStorage.getItem('linkedin_oauth_state');
        if (state && storedState && state !== storedState) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }

        // Clear stored state
        sessionStorage.removeItem('linkedin_oauth_state');

        const response = await axios.get(`${API_URL}/api/auth/linkedin/callback?code=${code}&state=${state || ''}`);

        if (response.data && response.data.access_token) {
          const { access_token, refresh_token, user } = response.data;

          // Ensure user has roles array
          if (user && !user.roles) {
            user.roles = [];
          }

          // Save to store
          this.accessToken = access_token;
          this.refreshToken = refresh_token;
          this.user = user;

          // Save to local storage
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));

          // Set up axios default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          return true;
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        if (error.response?.data?.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'LinkedIn login failed. Please try again.';
        }
        console.error('LinkedIn callback error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Update user data in store and localStorage
    updateUserData(userData: User) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    // Refresh user profile and roles from server
    async refreshUserProfile() {
      try {
        const success = await this.getUserProfile();
        if (success) {
          // User profile updated successfully with latest roles
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
        return false;
      }
    },

    // Comprehensive refresh after subscription changes
    async refreshAfterSubscriptionChange(pollForChanges = false, maxAttempts = 5) {
      try {
        let attempts = 0;
        const previousPremiumStatus = this.isPremium;

        while (attempts < maxAttempts) {
          attempts++;
          console.log(`Refreshing user data after subscription change - attempt ${attempts}`);

          // Wait before checking (except first attempt)
          if (attempts > 1) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }

          // Refresh user profile (triggers Stripe sync on backend)
          await this.refreshUserProfile();

          // Refresh access token to get latest roles in JWT
          await this.refreshAccessToken();

          // If we're not polling, or if status changed, we're done
          if (!pollForChanges || this.isPremium !== previousPremiumStatus) {
            console.log('User data refreshed successfully');
            return true;
          }

          console.log('Subscription status unchanged, retrying...');
        }

        console.warn('Max attempts reached for subscription refresh');
        return false;
      } catch (error) {
        console.error('Error refreshing user data after subscription change:', error);
        return false;
      }
    },
  },
});
