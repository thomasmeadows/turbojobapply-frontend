<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, parseISO } from 'date-fns'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

interface JobApplication {
  id: string
  ats_source: string
  job_data: {
    title: string
    company?: string
    client_name?: string
    location?: string
    external_url?: string
    description?: string
  }
  application_status: 'submitted' | 'failed' | 'pending' | 'completed'
  applied_at: string
  created_at: string
}

interface ApplicationHistory {
  applications: JobApplication[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

const authStore = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL

const loading = ref(true)
const applications = ref<JobApplication[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const hasNextPage = ref(false)
const hasPreviousPage = ref(false)
const selectedAtsSource = ref<string>('')
const error = ref<string>('')

const limit = 20

const atsSourceOptions = [
  { value: '', label: 'All ATS Sources' },
  { value: 'bamboo', label: 'BambooHR' },
  { value: 'workday', label: 'Workday' },
  { value: 'greenhouse', label: 'GreenhouseIO' },
  { value: 'adp', label: 'ADP' },
  { value: 'jobvite', label: 'Jobvite' },
  { value: 'breezy', label: 'Breezy' },
  { value: 'lever', label: 'Lever' },
  { value: 'smartrecruiters', label: 'SmartRecruiters' },
  { value: 'dover', label: 'Dover' },
]

const statusBadgeClasses = computed(() => {
  return {
    submitted: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }
})

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
  } catch {
    return 'Unknown date'
  }
}

const getCompanyName = (application: JobApplication) => {
  return application.job_data.company || application.job_data.client_name || 'Unknown Company'
}

const getAtsDisplayName = (atsSource: string) => {
  const source = atsSourceOptions.find((option) => option.value === atsSource)
  return source?.label || atsSource.toUpperCase()
}

const fetchApplicationHistory = async (page: number = 1) => {
  try {
    loading.value = true
    error.value = ''

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (selectedAtsSource.value) {
      params.append('atsSource', selectedAtsSource.value)
    }

    const response = await axios.get(`${API_URL}/api/job-applications/history?${params}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (response.data.success) {
      const data: ApplicationHistory = response.data.data
      applications.value = data.applications
      currentPage.value = data.currentPage
      totalPages.value = data.totalPages
      totalCount.value = data.totalCount
      hasNextPage.value = data.hasNextPage
      hasPreviousPage.value = data.hasPreviousPage
    }
  } catch (err: any) {
    console.error('Error fetching application history:', err)
    error.value = err.response?.data?.message || 'Failed to load application history'
  } finally {
    loading.value = false
  }
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    await fetchApplicationHistory(page)
  }
}

const onAtsSourceChange = async() => {
  currentPage.value = 1
  await fetchApplicationHistory(1)
}

const viewJobDetails = (application: JobApplication) => {
  if (application.job_data.external_url) {
    window.open(application.job_data.external_url, '_blank')
  }
}

const viewApplicationDetails = (applicationId: string) => {
  // Future enhancement: could navigate to a detailed view of the application
  console.log('View application details:', applicationId)
}

onMounted(async () => {
  await fetchApplicationHistory()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Job Application History</h1>
      <p class="mt-2 text-gray-600">Track all the jobs you've applied to through Turbo Apply</p>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <label for="ats-filter"
class="mb-1 block text-sm font-medium text-gray-700"> Filter by ATS Source </label>
        <select id="ats-filter" v-model="selectedAtsSource"
class="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" @change="onAtsSourceChange"
>
          <option v-for="option in atsSourceOptions"
:key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="text-sm text-gray-500">{{ totalCount }} total application{{ totalCount !== 1 ? 's' : '' }}</div>
    </div>

    <!-- Error State -->
    <div v-if="error"
class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
      <div class="flex">
        <svg class="mr-2 size-5 text-red-400"
fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
/>
        </svg>
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading"
class="flex items-center justify-center py-16">
      <svg class="size-8 animate-spin text-primary-500"
fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25"
cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
/>
      </svg>
    </div>

    <!-- Empty State -->
    <div v-else-if="applications.length === 0"
class="py-16 text-center">
      <svg class="mx-auto mb-4 size-16 text-gray-400"
fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
/>
      </svg>
      <h3 class="mb-2 text-lg font-medium text-gray-900">No Applications Yet</h3>
      <p class="mb-4 text-gray-600">You haven't applied to any jobs using Turbo Apply yet.</p>
      <router-link to="/search"
class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
>
Browse Jobs
</router-link>
    </div>

    <!-- Applications List -->
    <div v-else
class="space-y-4">
      <div v-for="application in applications" :key="application.id"
class="rounded-lg border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300"
>
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="mb-2 flex items-center">
                <h3 class="mr-3 text-lg font-medium text-gray-900">
                  {{ application.job_data.title }}
                </h3>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
:class="statusBadgeClasses[application.application_status]"
>
                  {{ application.application_status.charAt(0).toUpperCase() + application.application_status.slice(1) }}
                </span>
              </div>

              <div class="mb-2 text-gray-600">
                <span class="font-medium">{{ getCompanyName(application) }}</span>
                <span v-if="application.job_data.location"
class="mx-2">•</span>
                <span v-if="application.job_data.location">{{ application.job_data.location }}</span>
              </div>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="mr-1 size-4"
fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
/>
                  </svg>
                  Applied {{ formatDate(application.applied_at) }}
                </span>
                <span class="flex items-center">
                  <svg class="mr-1 size-4"
fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
/>
                  </svg>
                  {{ getAtsDisplayName(application.ats_source) }}
                </span>
              </div>

              <!-- Job Description Preview -->
              <div v-if="application.job_data.description"
class="mt-3 text-sm text-gray-600">
                <div class="line-clamp-2"
v-html="application.job_data.description.substring(0, 200) + (application.job_data.description.length > 200 ? '...' : '')"
/>
              </div>
            </div>

            <div class="ml-4 flex items-center space-x-2">
              <button v-if="application.job_data.external_url"
class="text-sm font-medium text-primary-600 hover:text-primary-700" @click="viewJobDetails(application)"
>
View Job
</button>
              <button class="text-sm font-medium text-gray-600 hover:text-gray-700"
@click="viewApplicationDetails(application.id)"
>
Details
</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1"
class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-700">Showing {{ (currentPage - 1) * limit + 1 }} to {{ Math.min(currentPage * limit, totalCount) }} of {{ totalCount }} applications
</div>

      <div class="flex items-center space-x-2">
        <button :disabled="!hasPreviousPage"
class="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" @click="goToPage(currentPage - 1)"
>
Previous
</button>

        <div class="flex items-center space-x-1">
          <template v-for="page in Math.min(5, totalPages)"
:key="page">
            <button
              v-if="page <= totalPages"
              class="rounded-md border px-3 py-1 text-sm font-medium"
              :class="page === currentPage ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </template>

          <span v-if="totalPages > 5"
class="px-2 text-gray-500">...</span>

          <button v-if="totalPages > 5 && currentPage < totalPages - 2"
class="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="goToPage(totalPages)"
>
            {{ totalPages }}
          </button>
        </div>

        <button :disabled="!hasNextPage"
class="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" @click="goToPage(currentPage + 1)"
>
Next
</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
