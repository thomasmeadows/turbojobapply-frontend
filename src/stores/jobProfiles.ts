/* eslint-disable max-lines-per-function */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface JobProfile {
  id: string
  profile_name: string
  desired_job_title?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  country_code?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  availability_date?: string
  salary_expectation?: string
  linkedin_url?: string
  portfolio_url?: string
  skills?: Array<{ id: string; skill_name: string }>
  experience?: Array<{
    id: string
    job_title: string
    company_name: string
    start_date: string
    end_date?: string
    is_current_job: boolean
    description?: string
  }>
  resume_file_name?: string
  cover_letter_file_name?: string
  created_at?: string
  updated_at?: string
  validating: boolean
}

const API_URL = import.meta.env.VITE_API_URL
const authStore = useAuthStore()

export const useJobProfilesStore = defineStore('jobProfiles', () => {
  // State
  const profiles = ref<JobProfile[]>([])
  const selectedProfileId = ref<string>('')
  const loading = ref(false)
  const validating = ref(false)
  const saving = ref(false)
  const error = ref<string>('')

  // Getters
  const selectedProfile = computed(() => profiles.value.find((p) => p.id === selectedProfileId.value) || null)

  const canCreateProfile = computed(() => {
    const authStore = useAuthStore()
    return authStore.isPremium || profiles.value.length === 0
  })

  // Actions
  const fetchProfiles = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = ''

      const response = await fetch(`${API_URL}/api/job-profiles`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        profiles.value = await response.json()

        // Auto-select first profile if none selected
        if (profiles.value.length > 0 && !selectedProfileId.value) {
          selectedProfileId.value = profiles.value[0].id
          await fetchProfile(selectedProfileId.value)
        }
      } else {
        const errorData = await response.json()
        error.value = errorData.error || 'Failed to load profiles'
      }
    } catch (err: any) {
      console.error('Error fetching profiles:', err)
      error.value = 'Failed to load profiles. Please try again.'
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async (profileId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/job-profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const profile = await response.json()

        // Update the profile in the profiles array
        const index = profiles.value.findIndex((p) => p.id === profileId)
        if (index !== -1) {
          profiles.value[index] = profile
        } else {
          profiles.value.push(profile)
        }
      } else {
        const errorData = await response.json()
        error.value = errorData.error || 'Failed to load profile'
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      error.value = 'Failed to load profile. Please try again.'
    }
  }

  const createProfile = async (profileData: { profile_name: string; desired_job_title?: string }): Promise<JobProfile | null> => {
    try {
      loading.value = true
      error.value = ''

      const response = await fetch(`${API_URL}/api/job-profiles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const newProfile = await response.json()
        profiles.value.push(newProfile)
        selectedProfileId.value = newProfile.id
        return newProfile
      } else {
        const errorData = await response.json()
        error.value = errorData.error || 'Failed to create profile'
        return null
      }
    } catch (err: any) {
      console.error('Error creating profile:', err)
      error.value = 'Failed to create profile. Please try again.'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileId: string, updates: Partial<JobProfile>): Promise<boolean> => {
    try {
      saving.value = true
      error.value = ''

      // Find the current profile
      const currentProfile = profiles.value.find((p) => p.id === profileId)
      if (!currentProfile) {
        error.value = 'Profile not found'
        return false
      }

      const response = await fetch(`${API_URL}/api/job-profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...currentProfile, ...updates }),
      })

      if (response.ok) {
        const updatedProfile = await response.json()

        // Update the profile in the profiles array
        const index = profiles.value.findIndex((p) => p.id === profileId)
        if (index !== -1) {
          profiles.value[index] = updatedProfile
        }

        return true
      } else {
        const errorData = await response.json()
        error.value = errorData.error || 'Failed to save profile'
        return false
      }
    } catch (err: any) {
      console.error('Error saving profile:', err)
      error.value = 'Failed to save profile. Please try again.'
      return false
    } finally {
      saving.value = false
    }
  }

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = ''

      const response = await fetch(`${API_URL}/api/job-profiles/${profileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Remove from profiles array
        profiles.value = profiles.value.filter((p) => p.id !== profileId)

        // Update selected profile if needed
        if (selectedProfileId.value === profileId) {
          if (profiles.value.length > 0) {
            selectedProfileId.value = profiles.value[0].id
          } else {
            selectedProfileId.value = ''
          }
        }

        return true
      } else {
        const errorData = await response.json()
        error.value = errorData.error || 'Failed to delete profile'
        return false
      }
    } catch (err: any) {
      console.error('Error deleting profile:', err)
      error.value = 'Failed to delete profile. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  const selectProfile = (profileId: string) => {
    selectedProfileId.value = profileId
  }

  const validateProfile = async () => {
    const atsSource: any = null;
    const requisitionId: any = null;
    validating.value = true
    if (!selectedProfileId.value) return

    try {
      error.value = ''

      // Validate the profile first
      const validateResponse = await fetch(`${API_URL}/api/job-applications/validate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobProfileId: selectedProfileId.value,
          requisitionId: requisitionId,
          atsSource: atsSource,
        }),
      })

      if (validateResponse.ok) {
        await validateResponse.json()
      }
    } catch (_error: any) {
      console.error('Error validating profile:', _error)
      error.value = _error.response?.data?.message || 'Failed to validate profile'
    }
  }

  const submitApplication = () => {
    try {
      error.value = ''

      // const response = await axios.post(`${API_URL}/api/job-applications/submit`, {
      //   jobProfileId: selectedProfileId.value,
      //   requisitionId: props.requisitionId,
      //   atsSource: props.atsSource,
      //   validationAnswers
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${authStore.accessToken}`
      //   }
      // });

      // if (response.data.success) {
      //   // Success! Close modals and show success message
      //   showValidationModal.value = false;
      //   emit('close');

      //   // You might want to show a success toast here
      //   alert('Application submitted successfully! You can view your application history in your dashboard.');
      // }
    } catch (error: any) {
      console.error('Error submitting application:', error)
      error.value = error.response?.data?.message || 'Failed to submit application'
    }
  }

  const clearError = (): void => {
    error.value = ''
  }

  const resetStore = (): void => {
    profiles.value = []
    selectedProfileId.value = ''
    loading.value = false
    saving.value = false
    error.value = ''
  }

  return {
    // State
    profiles,
    selectedProfileId,
    loading,
    saving,
    error,
    validating,

    // Getters
    selectedProfile,
    canCreateProfile,

    // Actions
    fetchProfiles,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    validateProfile,
    submitApplication,
    clearError,
    resetStore,
  }
})
