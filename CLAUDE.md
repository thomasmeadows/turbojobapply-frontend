# Frontend - CLAUDE.md

This file provides guidance to Claude Code when working with the TurboJobApply frontend application.

## Frontend Overview

The TurboJobApply frontend is a modern Vue 3 application with TypeScript that provides:
- Job search and filtering interface
- User authentication with magic links and LinkedIn OAuth
- User bookmark management
- Subscription management with Stripe integration
- Job profiles creation and management
- Responsive design with Tailwind CSS

## Development Commands

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test            # Run TypeScript compiler check
```

## Frontend Architecture

### Vue 3 Composition API
- **Modern Vue.js** with `<script setup>` syntax
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Single File Components** with scoped styling

### State Management
- **Pinia** for reactive state management
- **Stores** for authentication and job data
- **Composables** for reusable logic
- **Persistent storage** with localStorage integration

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Custom fonts** (Glacial Indifference)
- **Responsive design** mobile-first approach
- **Component-based** design system

## Environment Variables

```bash
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## Project Structure

### Core Application Files
- `src/App.vue` - Main application component
- `src/main.ts` - Application entry point
- `src/router/index.ts` - Vue Router configuration
- `src/style.css` - Global styles

### Stores (Pinia)
- `src/stores/auth.ts` - Authentication state and methods
- `src/stores/jobs.ts` - Job search and bookmark state

### Views (Pages)
- `src/views/HomePage.vue` - Landing page
- `src/views/SearchPage.vue` - Job search interface
- `src/views/JobDetailsPage.vue` - Individual job details
- `src/views/SavedJobsPage.vue` - User bookmarks management
- `src/views/DashboardPage.vue` - User dashboard
- `src/views/LoginPage.vue` - Authentication interface
- `src/views/ProfilePage.vue` - User profile management
- `src/views/JobProfilePage.vue` - Job profiles management
- `src/views/SubscriptionPage.vue` - Stripe subscription management
- `src/views/CancelSubscriptionPage.vue` - Subscription cancellation
- `src/views/EmployerIntegrationsPage.vue` - ATS integration requests
- `src/views/EmailVerificationPage.vue` - Magic link verification
- `src/views/AboutPage.vue` - About page
- `src/views/CareersPage.vue` - Careers page
- `src/views/PricingPage.vue` - Pricing information
- `src/views/NotFoundPage.vue` - 404 error page

### Legal Pages
- `src/views/TermsOfServicePage.vue` - Terms of service
- `src/views/PrivacyPolicyPage.vue` - Privacy policy
- `src/views/CookiePolicyPage.vue` - Cookie policy
- `src/views/AccessibilityPage.vue` - Accessibility statement

### Components

#### Layout Components
- `src/components/layout/TheHeader.vue` - Navigation header
- `src/components/layout/TheFooter.vue` - Site footer

#### Job Components
- `src/components/jobs/JobCard.vue` - Individual job listing card
- `src/components/jobs/JobFilters.vue` - Advanced job search filters

#### Job Profile Components
- `src/components/job-profiles/ContactInformationSection.vue` - Personal contact details
- `src/components/job-profiles/JobInformationSection.vue` - Job preferences and file uploads
- `src/components/job-profiles/SkillsSection.vue` - Skills management interface
- `src/components/job-profiles/ExperienceSection.vue` - Work experience with rich text editor
- `src/components/job-profiles/CreateProfileModal.vue` - Profile creation modal
- `src/components/job-profiles/DeleteProfileModal.vue` - Profile deletion confirmation

#### Common Components
- `src/components/common/QuillEditor.vue` - Rich text editor component

### Services
- `src/services/stripe.ts` - Frontend Stripe integration

### Composables
- `src/composables/useSubscriptionRefresh.ts` - Reusable subscription refresh logic

### Types
- `src/types/job.ts` - Job-related TypeScript interfaces
- `src/vite-env.d.ts` - Vite environment type definitions

### Assets
- `src/assets/styles/main.css` - Main stylesheet
- `src/assets/styles/fonts.css` - Custom font definitions
- `public/fonts/` - Font files (Glacial Indifference)
- `public/turbojobapply.svg` - Logo and branding

## Key Frontend Features

### Authentication System
- **Magic Link Login**: Passwordless authentication via email
- **LinkedIn OAuth**: Professional social login option
- **JWT Management**: Automatic token refresh and session handling
- **Role-Based UI**: Dynamic interface based on user roles (admin, premium)
- **Persistent Sessions**: Login state maintained across browser sessions

### Job Search & Management
- **Advanced Search**: Multi-criteria job filtering
- **Real-time Results**: Dynamic search with instant updates
- **Bookmark System**: Save/unsave jobs with persistent storage
- **ATS Source Filtering**: Filter by BambooHR, Workday, GreenhouseIO
- **Location Filtering**: Country and city-based job filtering
- **Remote Work Options**: Dedicated remote job filtering

### User Experience
- **Responsive Design**: Mobile-first responsive interface
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and recovery
- **Navigation**: Intuitive routing and breadcrumbs
- **Accessibility**: WCAG-compliant interface design

## Frontend Routing

### Subscription Routes
- `/subscription` - Main subscription management page
- `/subscription/cancel` - Dedicated cancellation flow

### Premium User Experience Routes

#### Dashboard Page (`/dashboard`)
- **Premium Badge**: Shows "Premium" status in account section
- **Premium Benefits Display**: Green-themed section highlighting active premium features
- **Beta Access Messaging**: Clear indication of beta premium access
- **No Upgrade Prompts**: Hides upgrade CTAs for premium users

#### Subscription Page (`/subscription`)
- **Premium Member View**: Different layout showing active subscription status
- **Benefits Overview**: Lists all accessible premium features
- **Billing Information**: Shows current beta status with future pricing
- **Account Management**: Premium users see cancellation options instead of purchase

#### Home Page (`/`)
- **Dynamic Content**: Premium users see personalized welcome section
- **Conditional Promotion**: Hides premium promotion section for premium users
- **Smart CTAs**: Context-aware call-to-action buttons based on user status
- **Feature Highlighting**: Premium users see confirmation of feature access

## Role-Based UI Patterns

### Frontend Role Management
- **Auth Store Integration**: Role checking with `isAdmin`, `isPremium`, `hasRole(roleName)`
- **Dynamic UI**: Show/hide features based on user roles
- **Real-time Updates**: Roles are included in user authentication data
- **JWT Token Integration**: User roles are embedded in JWT tokens for client-side access
- **Premium User Experience**: Dedicated UI flows for premium vs free users across all pages

### Frontend Role Checking Examples

```typescript
// In Vue components
const authStore = useAuthStore();
authStore.isAdmin // boolean
authStore.isPremium // boolean  
authStore.hasRole('admin') // boolean

// JWT token contains roles for client-side access
// Token payload: { userId, email, sessionId, sessionToken, roles: ['admin', 'premium'] }
```

### Role-Based UI Implementation

```vue
<!-- Conditional rendering based on roles -->
<div v-if="authStore.isPremium" class="premium-features">
  <!-- Premium user content -->
</div>

<div v-else class="upgrade-prompt">
  <!-- Upgrade messaging for free users -->
</div>

<!-- Premium status indicator -->
<span v-if="authStore.isPremium" class="premium-badge">
  Premium Member
</span>
```

## Subscription Integration Frontend

### Frontend Subscription Flow
1. **Subscription Page** (`/subscription`)
   - Shows current subscription status with real-time data from Stripe
   - Premium users see billing information, next billing date, and management options
   - Non-premium users see upgrade options with Stripe Checkout integration
   - Displays subscription benefits and pricing information

2. **Cancellation Flow** (`/subscription/cancel`)
   - Dedicated cancellation page with clear messaging about access retention
   - Shows what users will lose and when access expires
   - Option to keep subscription or proceed with cancellation
   - Reactivation option for users who change their mind

3. **Billing Management**
   - Direct integration with Stripe Customer Portal for invoice history, payment methods, etc.
   - One-click access to hosted Stripe billing interface

### Post-Payment User Data Refresh
The frontend includes sophisticated refresh mechanisms to ensure users get immediate premium access after payment:

1. **Automatic Refresh on Return**: When users return from Stripe checkout with `?success=true`
2. **Polling for Webhook Processing**: Waits up to 30 seconds for Stripe webhooks to process
3. **Multiple Refresh Strategies**: 
   - Force subscription sync via `/api/subscription/refresh`
   - User profile refresh with role updates
   - JWT token refresh to include latest roles
4. **Composable Architecture**: `useSubscriptionRefresh()` for reusable refresh logic
5. **Graceful Fallbacks**: Handles webhook delays and API failures gracefully

### Job Profiles System
- **Multiple Profiles**: Create profiles for different career paths
- **Contact Management**: Complete personal information forms
- **Skills Interface**: Add/remove skills with bulk import options
- **Experience Editor**: Rich text editor for work experience descriptions
- **File Upload**: Resume and cover letter upload with validation
- **Premium Limitations**: Free users limited to 1 profile with upgrade prompts
- **Auto-Save**: Seamless data persistence with debounced saving

### Subscription Management
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Subscription Status**: Real-time subscription status display
- **Billing Management**: Direct integration with Stripe Customer Portal
- **Cancellation Flow**: User-friendly cancellation with access retention
- **Upgrade Prompts**: Context-aware premium feature promotion
- **Post-Payment Refresh**: Automatic user data refresh after payment

### Role-Based Interface

#### Premium User Experience
- **Premium Badges**: Visual indicators of premium status
- **Feature Access**: Full access to premium functionality
- **No Upgrade Prompts**: Clean interface without sales messaging
- **Enhanced Features**: Unlimited job profiles and advanced functionality

#### Admin User Experience
- **Admin Dashboard**: Access to administrative functionality
- **ATS Integration Management**: Submit and manage integration requests
- **System Statistics**: Access to system analytics and metrics

## Authentication Store (`auth.ts`)

### State Management
```typescript
// User authentication state
const user = ref<User | null>(null)
const accessToken = ref<string | null>(null)
const isAuthenticated = ref<boolean>(false)

// Role checking methods
const isAdmin = computed(() => hasRole('admin'))
const isPremium = computed(() => hasRole('premium'))
const hasRole = (roleName: string) => user.value?.roles?.includes(roleName) || false
```

### Key Methods
- `login(email: string)` - Send magic link email
- `verifyMagicLink(token: string)` - Verify magic link token
- `loginWithLinkedIn()` - Initiate LinkedIn OAuth
- `refreshToken()` - Refresh JWT access token
- `logout()` - Clear session and logout
- `fetchProfile()` - Get current user profile

### Token Management
- **Automatic Refresh**: Tokens refreshed before expiration
- **Axios Integration**: Access tokens automatically added to requests
- **Local Storage**: Secure token persistence
- **Role Embedding**: User roles included in JWT tokens

## Jobs Store (`jobs.ts`)

### State Management
```typescript
// Job search state
const jobs = ref<Job[]>([])
const bookmarkedJobs = ref<Job[]>([])
const filters = ref<SearchFilters>({})
const loading = ref<boolean>(false)
```

### Key Methods
- `searchJobs(filters: SearchFilters)` - Search jobs with filters
- `getJobDetails(id: string)` - Get individual job details
- `toggleBookmark(job: Job)` - Add/remove job bookmark
- `getBookmarkedJobs()` - Fetch user's bookmarked jobs
- `clearBookmarks()` - Remove all user bookmarks

### Bookmark Integration
- **Real-time Updates**: Bookmark status updated immediately
- **Persistent Storage**: Bookmarks saved to backend
- **Cross-ATS Support**: Bookmarks work across all ATS sources
- **Bulk Operations**: Clear all bookmarks functionality

## Routing Configuration

### Public Routes
- `/` - Home page
- `/search` - Job search (accessible without login)
- `/jobs/:id` - Job details
- `/login` - Authentication page
- `/about` - About page
- `/careers` - Careers page
- `/pricing` - Pricing information

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- `/profile` - User profile management
- `/saved-jobs` - Bookmarked jobs
- `/job-profiles` - Job profiles management
- `/subscription` - Subscription management
- `/subscription/cancel` - Subscription cancellation

### Admin Routes
- `/employer-integrations` - ATS integration requests (admin only)

### Legal Routes
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/cookies` - Cookie policy
- `/accessibility` - Accessibility statement

## Component Patterns

### Composition API Usage
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Component initialization
})
</script>
```

### Props and Emits
```vue
<script setup lang="ts">
interface Props {
  job: Job
  showBookmark?: boolean
}

interface Emits {
  (e: 'bookmark-toggled', job: Job): void
}

const props = withDefaults(defineProps<Props>(), {
  showBookmark: true
})

const emit = defineEmits<Emits>()
</script>
```

### API Integration
```vue
<script setup lang="ts">
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const fetchData = async () => {
  try {
    const response = await axios.get('/api/endpoint', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
  }
}
</script>
```

## Styling Guidelines

### Tailwind CSS Classes
- **Layout**: `container`, `mx-auto`, `px-4`, `py-8`
- **Typography**: `text-lg`, `font-semibold`, `text-gray-900`
- **Colors**: `bg-blue-600`, `text-white`, `border-gray-300`
- **Spacing**: `mb-4`, `mt-8`, `space-y-4`, `gap-6`
- **Responsive**: `sm:text-xl`, `md:grid-cols-2`, `lg:px-8`

### Component Styling
```vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600 leading-relaxed">{{ description }}</p>
  </div>
</template>

<style scoped>
/* Custom styles when Tailwind isn't sufficient */
.custom-component {
  /* Component-specific styles */
}
</style>
```

### Custom Fonts
```css
/* Glacial Indifference font family */
.font-glacial {
  font-family: 'Glacial Indifference', sans-serif;
}
```

## Best Practices

### Component Design
- Use Composition API with `<script setup>`
- Define clear TypeScript interfaces for props
- Implement proper error handling
- Use computed properties for derived state
- Emit events for parent communication

### State Management
- Use Pinia stores for shared state
- Keep component state local when possible
- Implement proper loading states
- Handle errors gracefully with user feedback

### Performance
- Use `v-memo` for expensive list rendering
- Implement proper component lazy loading
- Optimize images and assets
- Use proper caching strategies

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide alternative text for images

### Security
- Validate user inputs
- Sanitize HTML content
- Use secure authentication practices
- Implement proper CORS handling