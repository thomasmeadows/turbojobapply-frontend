import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Auth API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// In a real app, you would interact with an API
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
    isPremium(): boolean {
      return this.user?.isPremium || false;
    }
  },
  
  actions: {
    // Check if user is logged in (from local storage)
    checkAuth() {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
      }
    },
    
    // Login user with Auth0
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call the Auth0 API endpoint from the environment variable
        const response = await axios.post(`${API_URL}/api/auth/login`, { 
          username: email, 
          password
        });
        
        // Process the Auth0 response
        if (response.data && response.data.access_token) {
          const token = response.data.access_token;
          
          // Get user profile if the token doesn't contain it
          let userData;
          if (response.data.userinfo) {
            userData = response.data.userinfo;
          } else if (response.data.id_token) {
            // Parse JWT token if needed (simplified example)
            const base64Url = response.data.id_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            userData = JSON.parse(window.atob(base64));
          }
          
          // Create user object from Auth0 response
          const user: User = {
            id: userData?.sub || '',
            email: userData?.email || email,
            name: userData?.name || email.split('@')[0],
            isPremium: false, // You may get this from your user metadata
            createdAt: userData?.created_at || new Date().toISOString()
          };
          
          // Save to store
          this.user = user;
          this.token = token;
          
          // Save to local storage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return true;
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error: any) {
        // Handle Auth0 specific error messages if available
        if (error.response?.data?.error_description) {
          this.error = error.response.data.error_description;
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = 'Invalid email or password';
        }
        console.error('Login error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Register user
    async register(name: string | null = null, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Call the API to register user
        const response = await axios.post(`${API_URL}/api/auth/register`, { 
          email: email, 
          password
        });
        
        // Check for successful status code
        if (response.status >= 200 && response.status < 300) {
          return true;
        } else {
          throw new Error('Registration failed');
        }
      } catch (error: any) {
        // Handle specific error messages if available
        if (error.response?.data?.error_description) {
          this.error = error.response.data.error_description;
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        console.error('Registration error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Logout user
    logout() {
      this.user = null;
      this.token = null;
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    // Update premium status
    updatePremiumStatus(isPremium: boolean) {
      if (this.user) {
        this.user.isPremium = isPremium;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  }
});