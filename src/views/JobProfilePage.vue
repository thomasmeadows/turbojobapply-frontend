<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold text-gray-900">Job Profiles</h1>
              <p class="mt-3 text-lg text-gray-600">
                Create and manage profiles for different career paths
              </p>
            </div>
            
            <!-- Profile Selector and Actions -->
            <div class="flex items-center space-x-6">
              <!-- Profile Dropdown -->
              <div class="relative" v-if="profiles.length > 0">
                <select
                  v-model="selectedProfileId"
                  @change="handleProfileChange"
                  class="block w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white transition-colors"
                >
                  <option value="">Select a profile...</option>
                  <option
                    v-for="profile in profiles"
                    :key="profile.id"
                    :value="profile.id"
                  >
                    {{ profile.profile_name }}
                    <span v-if="profile.desired_job_title"> - {{ profile.desired_job_title }}</span>
                  </option>
                </select>
              </div>
              
              <!-- Create New Profile Button -->
              <button
                @click="showCreateModal = true"
                :disabled="!canCreateProfile"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Profile
              </button>
            </div>
          </div>
          
          <!-- Premium Limitation Notice -->
          <div v-if="!canCreateProfile && !authStore.isPremium" class="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex">
              <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-amber-800">
                  Profile Limit Reached
                </h3>
                <p class="mt-2 text-sm text-amber-700">
                  Free users are limited to 1 job profile. 
                  <router-link to="/subscription" class="font-medium underline hover:text-amber-600">
                    Upgrade to premium
                  </router-link> 
                  for unlimited profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="profiles.length === 0 && !loading" class="text-center py-16">
        <!-- Empty State -->
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No job profiles</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first job profile.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Job Profile
          </button>
        </div>
      </div>

      <!-- Profile Editor -->
      <div v-else-if="selectedProfile" class="flex gap-10">
        <!-- Context Menu Sidebar -->
        <div class="w-72 flex-shrink-0">
          <nav class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Sections</h3>
              <ul class="space-y-2">
                <li>
                  <button
                    @click="activeSection = 'contact'"
                    :class="[
                      'w-full text-left px-4 py-3 text-base rounded-lg transition-colors',
                      activeSection === 'contact' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <svg class="inline-block w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Information
                  </button>
                </li>
                <li>
                  <button
                    @click="activeSection = 'job-info'"
                    :class="[
                      'w-full text-left px-4 py-3 text-base rounded-lg transition-colors',
                      activeSection === 'job-info' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <svg class="inline-block w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                    </svg>
                    Job Information
                  </button>
                </li>
                <li>
                  <button
                    @click="activeSection = 'skills'"
                    :class="[
                      'w-full text-left px-4 py-3 text-base rounded-lg transition-colors',
                      activeSection === 'skills' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <svg class="inline-block w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Skills
                    <span v-if="selectedProfile.skills" class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded-full">
                      {{ selectedProfile.skills.length }}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    @click="activeSection = 'experience'"
                    :class="[
                      'w-full text-left px-4 py-3 text-base rounded-lg transition-colors',
                      activeSection === 'experience' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <svg class="inline-block w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Experience
                    <span v-if="selectedProfile.experience" class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded-full">
                      {{ selectedProfile.experience.length }}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            
            <!-- Profile Actions -->
            <div class="border-t border-gray-200 p-6">
              <div class="space-y-3">
                <button
                  @click="saveProfile"
                  :disabled="saving"
                  class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 transition-colors"
                >
                  <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ saving ? 'Saving...' : 'Save Profile' }}
                </button>
                
                <button
                  @click="showDeleteModal = true"
                  class="w-full inline-flex justify-center items-center px-6 py-3 border border-red-300 text-base font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m7 0H4" />
                  </svg>
                  Delete Profile
                </button>
              </div>
            </div>
          </nav>
        </div>

        <!-- Form Content Area -->
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <!-- Contact Information Section -->
            <ContactInformationSection
              v-if="activeSection === 'contact'"
              v-model="selectedProfile"
              @update="handleProfileUpdate"
            />
            
            <!-- Job Information Section -->
            <JobInformationSection
              v-if="activeSection === 'job-info'"
              v-model="selectedProfile"
              @update="handleProfileUpdate"
            />
            
            <!-- Skills Section -->
            <SkillsSection
              v-if="activeSection === 'skills'"
              v-model="selectedProfile"
              @update="handleProfileUpdate"
            />
            
            <!-- Experience Section -->
            <ExperienceSection
              v-if="activeSection === 'experience'"
              v-model="selectedProfile"
              @update="handleProfileUpdate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create Profile Modal -->
    <CreateProfileModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProfileCreated"
    />

    <!-- Delete Profile Modal -->
    <DeleteProfileModal
      v-if="showDeleteModal"
      :profile="selectedProfile"
      @close="showDeleteModal = false"
      @deleted="handleProfileDeleted"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Import section components (these will be created next)
import ContactInformationSection from '@/components/job-profiles/ContactInformationSection.vue'
import JobInformationSection from '@/components/job-profiles/JobInformationSection.vue'
import SkillsSection from '@/components/job-profiles/SkillsSection.vue'
import ExperienceSection from '@/components/job-profiles/ExperienceSection.vue'
import CreateProfileModal from '@/components/job-profiles/CreateProfileModal.vue'
import DeleteProfileModal from '@/components/job-profiles/DeleteProfileModal.vue'

// Stores and routing
const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const profiles = ref([])
const selectedProfileId = ref('')
const selectedProfile = ref(null)
const activeSection = ref('contact')
const loading = ref(true)
const saving = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)

// Computed properties
const canCreateProfile = computed(() => {
  return authStore.isPremium || profiles.value.length === 0
})

// Methods
const loadProfiles = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      profiles.value = await response.json()
      if (profiles.value.length > 0 && !selectedProfileId.value) {
        selectedProfileId.value = profiles.value[0].id
        await loadProfile(selectedProfileId.value)
      }
    } else {
      console.error('Failed to load profiles')
    }
  } catch (error) {
    console.error('Error loading profiles:', error)
  } finally {
    loading.value = false
  }
}

const loadProfile = async (profileId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      selectedProfile.value = await response.json()
    } else {
      console.error('Failed to load profile')
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const handleProfileChange = () => {
  if (selectedProfileId.value) {
    loadProfile(selectedProfileId.value)
  } else {
    selectedProfile.value = null
  }
}

const handleProfileUpdate = (updatedProfile: any) => {
  selectedProfile.value = { ...selectedProfile.value, ...updatedProfile }
}

const saveProfile = async () => {
  if (!selectedProfile.value) return
  
  try {
    saving.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${selectedProfile.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedProfile.value)
    })
    
    if (response.ok) {
      const updatedProfile = await response.json()
      selectedProfile.value = updatedProfile
      // Show success message
    } else {
      console.error('Failed to save profile')
      // Show error message
    }
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

const handleProfileCreated = (newProfile: any) => {
  profiles.value.push(newProfile)
  selectedProfileId.value = newProfile.id
  selectedProfile.value = newProfile
  showCreateModal.value = false
}

const handleProfileDeleted = () => {
  const deletedId = selectedProfile.value?.id
  profiles.value = profiles.value.filter(p => p.id !== deletedId)
  
  if (profiles.value.length > 0) {
    selectedProfileId.value = profiles.value[0].id
    loadProfile(selectedProfileId.value)
  } else {
    selectedProfileId.value = ''
    selectedProfile.value = null
  }
  
  showDeleteModal.value = false
}

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadProfiles()
})
</script>