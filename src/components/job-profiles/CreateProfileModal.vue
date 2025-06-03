<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Job Profile</h3>
        
        <form @submit.prevent="createProfile">
          <div class="mb-4">
            <label for="profile-name" class="block text-sm font-medium text-gray-700 mb-2">
              Profile Name *
            </label>
            <input
              id="profile-name"
              v-model="profileName"
              type="text"
              required
              maxlength="100"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
            <p class="mt-1 text-xs text-gray-500">
              Give this profile a descriptive name to distinguish it from others
            </p>
          </div>

          <div class="mb-4">
            <label for="desired-job-title" class="block text-sm font-medium text-gray-700 mb-2">
              Desired Job Title
            </label>
            <input
              id="desired-job-title"
              v-model="desiredJobTitle"
              type="text"
              maxlength="200"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Senior Software Engineer"
            />
            <p class="mt-1 text-xs text-gray-500">
              The specific job title you're targeting (optional)
            </p>
          </div>

          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="loading || !profileName.trim()"
              class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
              <span v-else>Create Profile</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{
  close: []
  created: [profile: any]
}>()

const authStore = useAuthStore()

// Form state
const profileName = ref('')
const desiredJobTitle = ref('')
const loading = ref(false)
const error = ref('')

const createProfile = async () => {
  if (!profileName.value.trim()) return

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile_name: profileName.value.trim(),
        desired_job_title: desiredJobTitle.value.trim() || undefined
      })
    })

    if (response.ok) {
      const newProfile = await response.json()
      emit('created', newProfile)
    } else {
      const errorData = await response.json()
      error.value = errorData.error || 'Failed to create profile'
    }
  } catch (err) {
    console.error('Error creating profile:', err)
    error.value = 'Failed to create profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>