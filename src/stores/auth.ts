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
    
    // Login user
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - in real app, this would be a real API endpoint
        // const response = await axios.post('/api/login', { email, password });
        
        // Mock successful login for demo
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          isPremium: false,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        
        // Save to store
        this.user = mockUser;
        this.token = mockToken;
        
        // Save to local storage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return true;
      } catch (error) {
        this.error = 'Invalid email or password';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Register user
    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Mock API call - in real app, this would be a real API endpoint
        // const response = await axios.post('/api/register', { name, email, password });
        
        // Mock successful registration for demo
        const mockUser: User = {
          id: '1',
          email,
          name,
          isPremium: false,
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        
        // Save to store
        this.user = mockUser;
        this.token = mockToken;
        
        // Save to local storage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return true;
      } catch (error) {
        this.error = 'Registration failed. Please try again.';
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