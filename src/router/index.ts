import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import HomePage from '../views/HomePage.vue';
import SearchPage from '../views/SearchPage.vue';
import JobDetailsPage from '../views/JobDetailsPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import SavedJobsPage from '../views/SavedJobsPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import SubscriptionPage from '../views/SubscriptionPage.vue';
import PricingPage from '../views/PricingPage.vue';
import AboutPage from '../views/AboutPage.vue';
import PrivacyPolicyPage from '../views/PrivacyPolicyPage.vue';
import CookiePolicyPage from '../views/CookiePolicyPage.vue';
import AccessibilityPage from '../views/AccessibilityPage.vue';
import TermsOfServicePage from '../views/TermsOfServicePage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'CareerHub - Find Your Dream Job' }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
    meta: { title: 'Search Jobs - CareerHub' }
  },
  {
    path: '/jobs/:id',
    name: 'JobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - CareerHub' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Log In - CareerHub', guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { title: 'Sign Up - CareerHub', guestOnly: true }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { title: 'Pricing - Turbo Job Apply' }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { title: 'About Us - Turbo Job Apply' }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage,
    meta: { title: 'Privacy Policy - Turbo Job Apply' }
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: CookiePolicyPage,
    meta: { title: 'Cookie Policy - Turbo Job Apply' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard - CareerHub', requiresAuth: true }
  },
  {
    path: '/saved-jobs',
    name: 'SavedJobs',
    component: SavedJobsPage,
    meta: { title: 'Saved Jobs - CareerHub', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { title: 'My Profile - CareerHub', requiresAuth: true }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: SubscriptionPage,
    meta: { title: 'Premium Subscription - CareerHub', requiresAuth: true }
  },
  {
    path: '/accessibility',
    name: 'Accessibility',
    component: AccessibilityPage,
    meta: { title: 'Accessibility - Turbo Job Apply' }
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: TermsOfServicePage,
    meta: { title: 'Terms of Service - Turbo Job Apply' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Page Not Found - CareerHub' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title as string || 'CareerHub';
  
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuthenticated;
  
  // Handle protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } 
  // Handle guest-only routes (prevent logged-in users from accessing login/register)
  else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Dashboard' });
  }
  else {
    next();
  }
});

export default router;