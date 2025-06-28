import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import HomePage from '../views/HomePage.vue';
import SearchPage from '../views/SearchPage.vue';
import JobDetailsPage from '../views/JobDetailsPage.vue';
import LoginPage from '../views/LoginPage.vue';
import EmailVerificationPage from '../views/EmailVerificationPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import SavedJobsPage from '../views/SavedJobsPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import JobProfilePage from '../views/JobProfilePage.vue';
import SubscriptionPage from '../views/SubscriptionPage.vue';
import PricingPage from '../views/PricingPage.vue';
import AboutPage from '../views/AboutPage.vue';
import PrivacyPolicyPage from '../views/PrivacyPolicyPage.vue';
import CookiePolicyPage from '../views/CookiePolicyPage.vue';
import AccessibilityPage from '../views/AccessibilityPage.vue';
import TermsOfServicePage from '../views/TermsOfServicePage.vue';
import CareersPage from '../views/CareersPage.vue';
import EmployerIntegrationsPage from '../views/EmployerIntegrationsPage.vue';
import CancelSubscriptionPage from '../views/CancelSubscriptionPage.vue';
import JobApplicationHistoryPage from '../views/JobApplicationHistoryPage.vue';
import FAQPage from '../views/FAQPage.vue';
import FeatureComparisonPage from '../views/FeatureComparisonPage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Turbo Job Apply - Find Your Dream Job' }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
    meta: { title: 'Search Jobs - Turbo Job Apply' }
  },
  // SEO-friendly job detail routes (only these routes are supported)
  {
    path: '/ats/adp/:urlSafeClientName/job/:urlSafeJobTitlePlusId',
    name: 'ADPJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/bamboo/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'BambooJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/breezy/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'BreezyJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/dover/:urlSafeClientName/job/:urlSafeJobTitlePlusId',
    name: 'DoverJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/greenhouse/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'GreenhouseJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/jobvite/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'JobviteJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/lever/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'LeverJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/smartrecruiters/:clientName/job/:urlSafeJobTitlePlusId',
    name: 'SmartRecruitersJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/ats/workday/:domain/:clientName/:clientProject/job/:urlSafeJobTitlePlusId',
    name: 'WorkdayJobDetails',
    component: JobDetailsPage,
    meta: { title: 'Job Details - Turbo Job Apply' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Log In - Turbo Job Apply', guestOnly: true }
  },
  {
    path: '/auth/verify',
    name: 'EmailVerification',
    component: EmailVerificationPage,
    meta: { title: 'Email Verification - Turbo Job Apply' }
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
    path: '/faq',
    name: 'FAQ',
    component: FAQPage,
    meta: { title: 'Frequently Asked Questions - Turbo Job Apply' }
  },
  {
    path: '/features',
    name: 'Features',
    component: FeatureComparisonPage,
    meta: { title: 'Feature Comparison - Turbo Job Apply' }
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
    meta: { title: 'Dashboard - Turbo Job Apply', requiresAuth: true }
  },
  {
    path: '/saved-jobs',
    name: 'SavedJobs',
    component: SavedJobsPage,
    meta: { title: 'Saved Jobs - Turbo Job Apply', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { title: 'My Profile - Turbo Job Apply', requiresAuth: true }
  },
  {
    path: '/job-profiles',
    name: 'JobProfiles',
    component: JobProfilePage,
    meta: { title: 'Job Profiles - Turbo Job Apply', requiresAuth: true }
  },
  {
    path: '/job-applications',
    name: 'JobApplicationHistory',
    component: JobApplicationHistoryPage,
    meta: { title: 'Application History - Turbo Job Apply', requiresAuth: true }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: SubscriptionPage,
    meta: {
      title: 'Premium Subscription - Turbo Job Apply',
      requiresAuth: true
    }
  },
  {
    path: '/subscription/cancel',
    name: 'CancelSubscription',
    component: CancelSubscriptionPage,
    meta: { title: 'Cancel Subscription - Turbo Job Apply', requiresAuth: true }
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
    path: '/careers',
    name: 'Careers',
    component: CareersPage,
    meta: { title: 'Careers - Turbo Job Apply' }
  },
  {
    path: '/employer-integrations',
    name: 'EmployerIntegrations',
    component: EmployerIntegrationsPage,
    meta: { title: 'Employer Integrations - Turbo Job Apply' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Page Not Found - Turbo Job Apply' }
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
  document.title = (to.meta.title as string) || 'Turbo Job Apply';

  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuthenticated;

  // Handle protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  // Handle guest-only routes (prevent logged-in users from accessing login/register)
  else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
