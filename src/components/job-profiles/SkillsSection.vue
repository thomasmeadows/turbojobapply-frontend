<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">Skills</h2>
      <p class="mt-2 text-base text-gray-600">
        Add skills relevant to this job profile. You can add up to 50 skills per profile.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Add Skills Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Skills</h3>
        
        <!-- Single Skill Input -->
        <div class="flex gap-3 mb-5">
          <input
            v-model="newSkill"
            type="text"
            placeholder="Enter a skill (e.g., JavaScript, Project Management)"
            class="flex-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            @keyup.enter="addSingleSkill"
            maxlength="100"
          />
          <button
            @click="addSingleSkill"
            :disabled="!newSkill.trim() || isAtSkillLimit"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>

        <!-- Bulk Import -->
        <div>
          <label for="bulk-skills" class="block text-sm font-semibold text-gray-800 mb-2">
            Or add multiple skills (comma-separated):
          </label>
          <div class="flex gap-3">
            <textarea
              id="bulk-skills"
              v-model="bulkSkills"
              rows="3"
              placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
              class="flex-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            />
            <button
              @click="addBulkSkills"
              :disabled="!bulkSkills.trim() || isAtSkillLimit"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Import
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Separate skills with commas. Each skill will be added individually.
          </p>
        </div>

        <!-- Skill Limit Warning -->
        <div v-if="isNearSkillLimit" class="mt-4 p-4 rounded-lg" :class="isAtSkillLimit ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'">
          <div class="flex">
            <svg class="h-5 w-5" :class="isAtSkillLimit ? 'text-red-400' : 'text-amber-400'" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm font-medium" :class="isAtSkillLimit ? 'text-red-800' : 'text-amber-800'">
                <span v-if="isAtSkillLimit">Skill limit reached</span>
                <span v-else>Approaching skill limit</span>
              </p>
              <p class="text-xs" :class="isAtSkillLimit ? 'text-red-700' : 'text-amber-700'">
                You have {{ currentSkillCount }} of 50 skills. 
                <span v-if="isAtSkillLimit">Remove some skills to add new ones.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Display -->
      <div v-if="skills.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            Current Skills ({{ skills.length }})
          </h3>
          <button
            v-if="skills.length > 0"
            @click="showClearAllModal = true"
            class="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 font-medium rounded-md transition-colors"
          >
            Clear All
          </button>
        </div>

        <!-- Skills Grid -->
        <div class="flex flex-wrap gap-3">
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors"
          >
            <span>{{ skill.skill_name }}</span>
            <button
              @click="removeSkill(skill)"
              class="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-blue-600 hover:bg-blue-300 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              :title="`Remove ${skill.skill_name}`"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No skills added</h3>
        <p class="mt-2 text-base text-gray-500">Add skills to showcase your expertise for this profile.</p>
      </div>
    </div>

    <!-- Clear All Confirmation Modal -->
    <div v-if="showClearAllModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">Clear All Skills</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to remove all {{ skills.length }} skills from this profile? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <div class="flex gap-3">
              <button
                @click="clearAllSkills"
                class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear All
              </button>
              <button
                @click="showClearAllModal = false"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  update: [value: any]
}>()

const authStore = useAuthStore()
const localProfile = ref({ ...props.modelValue })

// Skills state
const skills = ref(localProfile.value.skills || [])
const newSkill = ref('')
const bulkSkills = ref('')
const showClearAllModal = ref(false)

// Computed properties
const currentSkillCount = computed(() => skills.value.length)
const isAtSkillLimit = computed(() => currentSkillCount.value >= 50)
const isNearSkillLimit = computed(() => currentSkillCount.value >= 45)

// Watch for external updates
watch(() => props.modelValue, (newValue) => {
  localProfile.value = { ...newValue }
  skills.value = newValue.skills || []
}, { deep: true })

// Watch for local changes and emit updates
watch([localProfile, skills], () => {
  const updatedProfile = { ...localProfile.value, skills: skills.value }
  emit('update', updatedProfile)
}, { deep: true })

// Methods
const addSingleSkill = async () => {
  const skillName = newSkill.value.trim()
  if (!skillName || isAtSkillLimit.value) return

  // Check for duplicates
  if (skills.value.some(skill => skill.skill_name.toLowerCase() === skillName.toLowerCase())) {
    alert('This skill already exists in your profile')
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/skills`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skill_name: skillName
      })
    })

    if (response.ok) {
      const result = await response.json()
      skills.value.push(result.skill)
      newSkill.value = ''
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to add skill')
    }
  } catch (error) {
    console.error('Error adding skill:', error)
    alert('Failed to add skill')
  }
}

const addBulkSkills = async () => {
  const skillNames = bulkSkills.value
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0)
    .slice(0, 50 - currentSkillCount.value) // Respect the limit

  if (skillNames.length === 0) return

  // Filter out duplicates
  const existingSkillNames = skills.value.map(skill => skill.skill_name.toLowerCase())
  const newSkillNames = skillNames.filter(skillName => 
    !existingSkillNames.includes(skillName.toLowerCase()) && skillName.length <= 100
  )

  if (newSkillNames.length === 0) {
    alert('All skills already exist in your profile or are invalid')
    return
  }

  let addedCount = 0
  for (const skillName of newSkillNames) {
    if (isAtSkillLimit.value) break

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skill_name: skillName
        })
      })

      if (response.ok) {
        const result = await response.json()
        skills.value.push(result.skill)
        addedCount++
      }
    } catch (error) {
      console.error('Error adding skill:', skillName, error)
    }
  }

  bulkSkills.value = ''
  
  if (addedCount > 0) {
    alert(`Successfully added ${addedCount} skill${addedCount > 1 ? 's' : ''}`)
  }
}

const removeSkill = async (skill: any) => {
  if (!confirm(`Remove "${skill.skill_name}" from your skills?`)) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/skills/${skill.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`
      }
    })

    if (response.ok) {
      skills.value = skills.value.filter(s => s.id !== skill.id)
    } else {
      alert('Failed to remove skill')
    }
  } catch (error) {
    console.error('Error removing skill:', error)
    alert('Failed to remove skill')
  }
}

const clearAllSkills = async () => {
  const skillsToRemove = [...skills.value]
  
  for (const skill of skillsToRemove) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/skills/${skill.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`
        }
      })
    } catch (error) {
      console.error('Error removing skill:', skill.skill_name, error)
    }
  }
  
  skills.value = []
  showClearAllModal.value = false
}
</script>