<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">Work Experience</h2>
      <p class="mt-2 text-base text-gray-600">
        Add up to 10 work experience entries. Include your most recent and relevant positions.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Add Experience Button -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          Experience Entries ({{ experience.length }} / 10)
        </h3>
        <button
          @click="addNewExperience"
          :disabled="experience.length >= 10"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Experience
        </button>
      </div>

      <!-- Experience Limit Warning -->
      <div v-if="experience.length >= 10" class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex">
          <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-amber-800">Experience limit reached</p>
            <p class="text-xs text-amber-700">You have reached the maximum of 10 experience entries. Remove some to add new ones.</p>
          </div>
        </div>
      </div>

      <!-- Experience List -->
      <div v-if="experience.length > 0" class="space-y-6">
        <div
          v-for="(exp, index) in sortedExperience"
          :key="exp.id || `new-${index}`"
          class="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Experience Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                {{ index + 1 }}
              </span>
              <h4 class="text-lg font-semibold text-gray-900">
                {{ exp.job_title || 'New Experience' }}
                <span v-if="exp.company_name" class="text-gray-600 font-normal">at {{ exp.company_name }}</span>
              </h4>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="index > 0"
                @click="moveExperience(index, 'up')"
                class="p-1 text-gray-400 hover:text-gray-600"
                title="Move up"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                v-if="index < experience.length - 1"
                @click="moveExperience(index, 'down')"
                class="p-1 text-gray-400 hover:text-gray-600"
                title="Move down"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                @click="removeExperience(exp, index)"
                class="p-1 text-red-400 hover:text-red-600"
                title="Remove experience"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m7 0H4" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Experience Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Job Title -->
            <div>
              <label :for="`job-title-${index}`" class="block text-sm font-semibold text-gray-800 mb-2">
                Job Title *
              </label>
              <input
                :id="`job-title-${index}`"
                v-model="exp.job_title"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <!-- Company Name -->
            <div>
              <label :for="`company-name-${index}`" class="block text-sm font-semibold text-gray-800 mb-2">
                Company Name *
              </label>
              <input
                :id="`company-name-${index}`"
                v-model="exp.company_name"
                type="text"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                placeholder="e.g., Acme Corporation"
              />
            </div>

            <!-- Start Date -->
            <div>
              <label :for="`start-date-${index}`" class="block text-sm font-semibold text-gray-800 mb-2">
                Start Date *
              </label>
              <input
                :id="`start-date-${index}`"
                v-model="exp.start_date"
                type="date"
                required
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
              />
            </div>

            <!-- End Date / Current Job -->
            <div>
              <label :for="`end-date-${index}`" class="block text-sm font-semibold text-gray-800 mb-2">
                End Date
              </label>
              <div class="space-y-3">
                <input
                  :id="`end-date-${index}`"
                  v-model="exp.end_date"
                  type="date"
                  :disabled="exp.is_current_job"
                  class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <label class="inline-flex items-center">
                  <input
                    v-model="exp.is_current_job"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    @change="handleCurrentJobChange(exp)"
                  />
                  <span class="ml-3 text-sm text-gray-700">This is my current job</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label :for="`description-${index}`" class="block text-sm font-semibold text-gray-800 mb-3">
              Description
            </label>
            <QuillEditor
              v-model="exp.description"
              :placeholder="'Describe your responsibilities, achievements, and key contributions in this role...'"
              @update:modelValue="handleDescriptionUpdate(exp, $event)"
            />
            <p class="mt-2 text-sm text-gray-500">
              Use bullet points to highlight key achievements and responsibilities. Content auto-saves as you type.
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No work experience added</h3>
        <p class="mt-1 text-sm text-gray-500">Add your work history to showcase your professional background.</p>
        <div class="mt-6">
          <button
            @click="addNewExperience"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Experience
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import QuillEditor from '@/components/common/QuillEditor.vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  update: [value: any]
}>()

const authStore = useAuthStore()
const localProfile = ref({ ...props.modelValue })
const experience = ref(localProfile.value.experience || [])

// Computed properties
const sortedExperience = computed(() => {
  return [...experience.value].sort((a, b) => a.display_order - b.display_order)
})

// Watch for external updates
watch(() => props.modelValue, (newValue) => {
  localProfile.value = { ...newValue }
  experience.value = newValue.experience || []
}, { deep: true })

// Watch for local changes and emit updates
watch([localProfile, experience], () => {
  const updatedProfile = { ...localProfile.value, experience: experience.value }
  emit('update', updatedProfile)
}, { deep: true })

// Methods
const addNewExperience = () => {
  if (experience.value.length >= 10) return

  const newExp = {
    id: null, // Will be set when saved to backend
    user_job_profile_id: localProfile.value.id,
    job_title: '',
    company_name: '',
    start_date: '',
    end_date: '',
    is_current_job: false,
    description: '',
    display_order: experience.value.length,
    created_at: new Date(),
    updated_at: new Date()
  }

  experience.value.push(newExp)
}

const removeExperience = async (exp: any, index: number) => {
  if (!confirm('Are you sure you want to remove this experience?')) return

  if (exp.id) {
    // Remove from backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/experience/${exp.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`
        }
      })

      if (!response.ok) {
        alert('Failed to remove experience')
        return
      }
    } catch (error) {
      console.error('Error removing experience:', error)
      alert('Failed to remove experience')
      return
    }
  }

  // Remove from local array
  experience.value.splice(index, 1)
  
  // Update display orders
  experience.value.forEach((exp, idx) => {
    exp.display_order = idx
  })
}

const moveExperience = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= experience.value.length) return

  // Swap the experiences
  const temp = experience.value[index]
  experience.value[index] = experience.value[newIndex]
  experience.value[newIndex] = temp

  // Update display orders
  experience.value[index].display_order = index
  experience.value[newIndex].display_order = newIndex

  // Save both experiences
  saveExperience(experience.value[index])
  saveExperience(experience.value[newIndex])
}

const handleCurrentJobChange = (exp: any) => {
  if (exp.is_current_job) {
    exp.end_date = ''
  }
}

const handleDescriptionUpdate = (exp: any, html: string) => {
  exp.description = html
  // Trigger auto-save after description change
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(() => {
    if (exp.job_title && exp.company_name && exp.start_date) {
      saveExperience(exp)
    }
  }, 1500) // Auto-save after 1.5 seconds of inactivity
}

const saveExperience = async (exp: any) => {
  // Validate required fields
  if (!exp.job_title.trim() || !exp.company_name.trim() || !exp.start_date) {
    return // Don't save incomplete experiences
  }

  // Validate dates
  if (exp.end_date && new Date(exp.end_date) < new Date(exp.start_date)) {
    alert('End date cannot be before start date')
    return
  }

  try {
    if (exp.id) {
      // Update existing experience
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/experience/${exp.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_title: exp.job_title,
          company_name: exp.company_name,
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          is_current_job: exp.is_current_job,
          description: exp.description,
          display_order: exp.display_order
        })
      })

      if (response.ok) {
        const result = await response.json()
        Object.assign(exp, result.experience)
      }
    } else {
      // Create new experience
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/experience`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_title: exp.job_title,
          company_name: exp.company_name,
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          is_current_job: exp.is_current_job,
          description: exp.description,
          display_order: exp.display_order
        })
      })

      if (response.ok) {
        const result = await response.json()
        Object.assign(exp, result.experience)
      }
    }
  } catch (error) {
    console.error('Error saving experience:', error)
  }
}

// Auto-save when user stops typing (debounced)
let saveTimeout: number | null = null
watch(experience, () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(() => {
    experience.value.forEach(exp => {
      if (exp.job_title && exp.company_name && exp.start_date) {
        saveExperience(exp)
      }
    })
  }, 2000) // Auto-save after 2 seconds of inactivity
}, { deep: true })
</script>

