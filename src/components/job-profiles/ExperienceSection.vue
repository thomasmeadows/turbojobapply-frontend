<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">Work Experience</h2>
      <p class="mt-2 text-base text-gray-600">Add up to 10 work experience entries. Include your most recent and relevant positions.
</p>
    </div>

    <div class="space-y-8">
      <!-- Add Experience Button -->
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Experience Entries ({{ experience.length }} / 10)</h3>
        <button
          :disabled="experience.length >= 10"
          class="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          @click="addNewExperience"
        >
          <svg class="-ml-1 mr-2 size-5"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round"
stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Experience
        </button>
      </div>

      <!-- Experience Limit Warning -->
      <div v-if="experience.length >= 10"
class="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div class="flex">
          <svg class="size-5 text-amber-400"
fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-amber-800">Experience limit reached</p>
            <p class="text-xs text-amber-700">You have reached the maximum of 10 experience entries. Remove some to add new ones.
</p>
          </div>
        </div>
      </div>

      <!-- Experience List -->
      <div v-if="experience.length > 0"
class="space-y-6">
        <div v-for="(exp, index) in sortedExperience" :key="exp.id || `new-${index}`"
class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
>
          <!-- Experience Header -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
                {{ index + 1 }}
              </span>
              <h4 class="text-lg font-semibold text-gray-900">
                {{ exp.job_title || 'New Experience' }}
                <span v-if="exp.company_name"
class="font-normal text-gray-600">at {{ exp.company_name }}</span>
              </h4>
            </div>
            <div class="flex items-center space-x-2">
              <button v-if="index > 0" class="p-1 text-gray-400 hover:text-gray-600"
title="Move up" @click="moveExperience(index, 'up')"
>
                <svg class="size-4"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round"
stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button v-if="index < experience.length - 1" class="p-1 text-gray-400 hover:text-gray-600"
title="Move down" @click="moveExperience(index, 'down')"
>
                <svg class="size-4"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round"
stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button class="p-1 text-red-400 hover:text-red-600" title="Remove experience"
@click="removeExperience(exp, index)"
>
                <svg class="size-4"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m7 0H4"
/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Experience Form -->
          <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Job Title -->
            <div>
              <label :for="`job-title-${index}`"
class="mb-2 block text-sm font-semibold text-gray-800"> Job Title * </label>
              <input
                :id="`job-title-${index}`"
                v-model="exp.job_title"
                type="text"
                required
                class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <!-- Company Name -->
            <div>
              <label :for="`company-name-${index}`"
class="mb-2 block text-sm font-semibold text-gray-800"> Company Name * </label>
              <input
                :id="`company-name-${index}`"
                v-model="exp.company_name"
                type="text"
                required
                class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Acme Corporation"
              />
            </div>

            <!-- Start Date -->
            <div>
              <label :for="`start-date-${index}`"
class="mb-2 block text-sm font-semibold text-gray-800"> Start Date * </label>
              <input :id="`start-date-${index}`" v-model="exp.start_date"
type="date" required class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
/>
            </div>

            <!-- End Date / Current Job -->
            <div>
              <label :for="`end-date-${index}`"
class="mb-2 block text-sm font-semibold text-gray-800"> End Date </label>
              <div class="space-y-3">
                <input
                  :id="`end-date-${index}`"
                  v-model="exp.end_date"
                  type="date"
                  :disabled="exp.is_current_job"
                  class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <label class="inline-flex items-center">
                  <input v-model="exp.is_current_job" type="checkbox"
class="size-4 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200/50" @change="handleCurrentJobChange(exp)"
/>
                  <span class="ml-3 text-sm text-gray-700">This is my current job</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label :for="`description-${index}`"
class="mb-3 block text-sm font-semibold text-gray-800"> Description </label>
            <QuillEditor v-model="exp.description"
:placeholder="'Describe your responsibilities, achievements, and key contributions in this role...'" @update:model-value="handleDescriptionUpdate(exp, $event)"
/>
            <p class="mt-2 text-sm text-gray-500">Use bullet points to highlight key achievements and responsibilities. Content auto-saves as you type.
</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else
class="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
        <svg class="mx-auto size-12 text-gray-400"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No work experience added</h3>
        <p class="mt-1 text-sm text-gray-500">Add your work history to showcase your professional background.</p>
        <div class="mt-6">
          <button
            class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="addNewExperience"
          >
            <svg class="-ml-1 mr-2 size-5"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round"
stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Experience
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
// Format dates when initializing
const initialExperience = (localProfile.value.experience || []).map((exp: any) => ({
  ...exp,
  start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
  end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
}))
const experience = ref(initialExperience)
const isUpdatingFromAPI = ref(false)
const isSaving = ref(false)

// Computed properties
const sortedExperience = computed(() => {
  return [...experience.value].sort((a, b) => a.display_order - b.display_order)
})

// Watch for external updates
watch(
  () => props.modelValue,
  (newValue) => {
    localProfile.value = { ...newValue }
    // Format dates when loading from external data
    const formattedExperience = (newValue.experience || []).map((exp: any) => ({
      ...exp,
      start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
      end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
    }))
    experience.value = formattedExperience
  },
  { deep: true }
)

// Watch for local changes and emit updates
watch(
  [localProfile, experience],
  () => {
    const updatedProfile = { ...localProfile.value, experience: experience.value }
    emit('update', updatedProfile)
  },
  { deep: true }
)

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
    updated_at: new Date(),
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
          Authorization: `Bearer ${authStore.accessToken}`,
        },
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
  experience.value.forEach((exp: any, idx: number) => {
    exp.display_order = idx
  })
}

const moveExperience = async (index: number, direction: 'up' | 'down') => {
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
  await saveExperience(experience.value[index])
  await saveExperience(experience.value[newIndex])
}

const handleCurrentJobChange = (exp: any) => {
  if (exp.is_current_job) {
    exp.end_date = ''
  }
}

const handleDescriptionUpdate = (exp: any, html: string) => {
  exp.description = html
  // Trigger auto-save after description change
}

const saveExperience = async (exp: any) => {
  // Prevent recursive saves
  if (isSaving.value) return

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
    isSaving.value = true
    isUpdatingFromAPI.value = true // Prevent watcher from triggering auto-save

    if (exp.id) {
      // Update existing experience
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/experience/${exp.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: exp.job_title,
          company_name: exp.company_name,
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          is_current_job: exp.is_current_job,
          description: exp.description,
          display_order: exp.display_order,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Format dates to yyyy-MM-dd for date inputs
        const updatedExp = { ...result.experience }
        if (updatedExp.start_date) {
          updatedExp.start_date = new Date(updatedExp.start_date).toISOString().split('T')[0]
        }
        if (updatedExp.end_date) {
          updatedExp.end_date = new Date(updatedExp.end_date).toISOString().split('T')[0]
        }
        Object.assign(exp, updatedExp)
      }
    } else {
      // Create new experience
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/experience`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: exp.job_title,
          company_name: exp.company_name,
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          is_current_job: exp.is_current_job,
          description: exp.description,
          display_order: exp.display_order,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Format dates to yyyy-MM-dd for date inputs
        const updatedExp = { ...result.experience }
        if (updatedExp.start_date) {
          updatedExp.start_date = new Date(updatedExp.start_date).toISOString().split('T')[0]
        }
        if (updatedExp.end_date) {
          updatedExp.end_date = new Date(updatedExp.end_date).toISOString().split('T')[0]
        }
        Object.assign(exp, updatedExp)
      }
    }
  } catch (error) {
    console.error('Error saving experience:', error)
  } finally {
    isSaving.value = false
    isUpdatingFromAPI.value = false
  }
}

watch(
  experience,
  () => {
    // Skip auto-save if we're updating from API or already saving to prevent infinite loop
    if (isUpdatingFromAPI.value || isSaving.value) return
  },
  { deep: true }
)
</script>
