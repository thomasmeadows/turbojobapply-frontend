<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 mt-2">Delete Job Profile</h3>
        
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500 mb-3">
            Are you sure you want to delete the profile 
            <strong>"{{ profile?.profile_name }}"</strong>?
          </p>
          
          <div v-if="profile" class="text-left bg-gray-50 rounded-md p-3 mb-3">
            <h4 class="text-xs font-medium text-gray-700 mb-2">This will permanently delete:</h4>
            <ul class="text-xs text-gray-600 space-y-1">
              <li class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                All contact and job information
              </li>
              <li v-if="profile.skills && profile.skills.length > 0" class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ profile.skills.length }} skill{{ profile.skills.length > 1 ? 's' : '' }}
              </li>
              <li v-if="profile.experience && profile.experience.length > 0" class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ profile.experience.length }} experience entr{{ profile.experience.length > 1 ? 'ies' : 'y' }}
              </li>
              <li v-if="profile.has_resume" class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Resume file ({{ profile.resume_filename }})
              </li>
              <li v-if="profile.has_cover_letter" class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Cover letter file ({{ profile.cover_letter_filename }})
              </li>
            </ul>
          </div>
          
          <p class="text-xs text-red-600 font-medium">
            This action cannot be undone.
          </p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="items-center px-4 py-3">
          <div class="flex gap-3">
            <button
              @click="deleteProfile"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
              <span v-else>Delete Profile</span>
            </button>
            <button
              @click="$emit('close')"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  profile: any
}>()

const emit = defineEmits<{
  close: []
  deleted: []
}>()

const authStore = useAuthStore()

// State
const loading = ref(false)
const error = ref('')

const deleteProfile = async () => {
  if (!props.profile?.id) return

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${props.profile.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })

    if (response.ok) {
      emit('deleted')
    } else {
      const errorData = await response.json()
      error.value = errorData.error || 'Failed to delete profile'
    }
  } catch (err) {
    console.error('Error deleting profile:', err)
    error.value = 'Failed to delete profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>