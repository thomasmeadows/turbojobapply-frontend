<template>
  <div class="fixed inset-0 z-50 size-full overflow-y-auto bg-gray-600/50">
    <div class="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
      <div class="mt-3">
        <h3 class="mb-4 text-lg font-medium text-gray-900">Create New Job Profile</h3>

        <form @submit.prevent="createProfile">
          <div class="mb-6">
            <label for="profile-name"
class="mb-3 block text-sm font-medium text-gray-700"> Profile Name * </label>
            <input
              id="profile-name"
              v-model="profileName"
              type="text"
              required
              maxlength="100"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
            <p class="mt-1 text-xs text-gray-500">Give this profile a descriptive name to distinguish it from others</p>
          </div>

          <div class="mb-6">
            <label for="desired-job-title"
class="mb-3 block text-sm font-medium text-gray-700"> Desired Job Title </label>
            <input
              id="desired-job-title"
              v-model="desiredJobTitle"
              type="text"
              maxlength="200"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
            <p class="mt-1 text-xs text-gray-500">The specific job title you're targeting (optional)</p>
          </div>

          <div v-if="jobProfilesStore.error"
class="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p class="text-sm text-red-600">
              {{ jobProfilesStore.error }}
            </p>
          </div>

          <div class="mt-8 flex gap-4">
            <button
              type="submit"
              :disabled="jobProfilesStore.loading || !profileName.trim()"
              class="flex-1 rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <span v-if="jobProfilesStore.loading"
class="flex items-center justify-center">
                <svg class="-ml-1 mr-2 size-4 animate-spin text-white"
fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25"
cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
/>
                </svg>
                Creating...
              </span>
              <span v-else>Create Profile</span>
            </button>
            <button
              type="button"
              :disabled="jobProfilesStore.loading"
              class="flex-1 rounded-md bg-gray-300 px-6 py-3 text-base font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
              @click="$emit('close')"
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
import { useJobProfilesStore } from '@/stores/jobProfiles'

const emit = defineEmits<{
  close: []
  created: [profile: any]
}>()

const jobProfilesStore = useJobProfilesStore()

// Form state
const profileName = ref('')
const desiredJobTitle = ref('')

const createProfile = async () => {
  if (!profileName.value.trim()) return

  const newProfile = await jobProfilesStore.createProfile({
    profile_name: profileName.value.trim(),
    desired_job_title: desiredJobTitle.value.trim() || undefined,
  })

  if (newProfile) {
    emit('created', newProfile)
  }
}
</script>
