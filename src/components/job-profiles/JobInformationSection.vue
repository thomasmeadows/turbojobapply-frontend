<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">Job Information</h2>
      <p class="mt-2 text-base text-gray-600">Your job preferences and professional information for this profile.</p>
    </div>

    <div class="space-y-8">
      <!-- Date Available -->
      <div>
        <label for="date-available"
class="mb-2 block text-sm font-semibold text-gray-800"> Date Available </label>
        <input id="date-available" v-model="localProfile.date_available"
type="date" class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
/>
        <p class="mt-2 text-sm text-gray-500">When you're available to start a new position</p>
      </div>

      <!-- Desired Pay -->
      <div>
        <label for="desired-pay"
class="mb-2 block text-sm font-semibold text-gray-800"> Desired Pay </label>
        <input
          id="desired-pay"
          v-model="localProfile.desired_pay"
          type="text"
          class="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., $80,000/year, $40/hour, Competitive"
        />
        <p class="mt-2 text-sm text-gray-500">Your salary expectations or preferred compensation</p>
      </div>

      <!-- LinkedIn Profile URL -->
      <div>
        <label for="linkedin-url"
class="mb-2 block text-sm font-semibold text-gray-800"> LinkedIn Profile URL </label>
        <div class="flex rounded-lg shadow-sm">
          <span class="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-base font-medium text-gray-600"> https:// </span>
          <input
            id="linkedin-url"
            v-model="linkedinUrl"
            type="text"
            class="block w-full flex-1 rounded-none rounded-r-lg border border-gray-300 px-4 py-3 text-base transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="linkedin.com/in/yourprofile"
          />
        </div>
        <p class="mt-2 text-sm text-gray-500">Your professional LinkedIn profile</p>
      </div>

      <!-- Website, Blog, or Portfolio URL -->
      <div>
        <label for="website-url"
class="mb-2 block text-sm font-semibold text-gray-800"> Website, Blog, or Portfolio URL </label>
        <div class="flex rounded-lg shadow-sm">
          <span class="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-base font-medium text-gray-600"> https:// </span>
          <input
            id="website-url"
            v-model="websiteUrl"
            type="text"
            class="block w-full flex-1 rounded-none rounded-r-lg border border-gray-300 px-4 py-3 text-base transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="yourportfolio.com"
          />
        </div>
        <p class="mt-2 text-sm text-gray-500">Your personal website, blog, or online portfolio</p>
      </div>

      <!-- Resume Upload -->
      <div class="border-t border-gray-200 pt-8">
        <h3 class="mb-6 text-lg font-semibold text-gray-900">Documents</h3>
        <p class="mb-6 text-sm text-gray-600">Upload your resume and cover letter to include with applications</p>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Resume -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-800"> Resume </label>

            <div v-if="!localProfile.has_resume"
class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
>
              <svg class="mx-auto size-12 text-gray-400"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
/>
              </svg>
              <div class="mt-4">
                <label for="resume-upload"
class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900"> Upload your resume </span>
                  <span class="mt-1 block text-xs text-gray-500"> PDF, DOC, DOCX up to 1MB </span>
                </label>
                <input id="resume-upload" type="file"
class="sr-only" accept=".pdf,.doc,.docx" @change="handleResumeUpload"
/>
              </div>
            </div>

            <div v-else
class="rounded-xl border border-green-200 bg-green-50 p-6">
              <div class="flex items-center">
                <svg class="size-5 text-green-400"
fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"
/>
                </svg>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-green-800">
                    {{ localProfile.resume_filename || 'Resume uploaded' }}
                  </p>
                  <p class="text-xs text-green-600">
                    {{ formatFileSize(localProfile.resume_size) }}
                  </p>
                </div>
                <div class="ml-4 flex space-x-3">
                  <button class="rounded-md px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 hover:text-green-900"
@click="downloadResume"
>
Download
</button>
                  <button class="rounded-md px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
@click="removeResume"
>
Remove
</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover Letter -->
          <div>
            <label class="mb-3 block text-sm font-semibold text-gray-800"> Cover Letter </label>

            <div v-if="!localProfile.has_cover_letter"
class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
>
              <svg class="mx-auto size-12 text-gray-400"
fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
/>
              </svg>
              <div class="mt-4">
                <label for="cover-letter-upload"
class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900"> Upload your cover letter </span>
                  <span class="mt-1 block text-xs text-gray-500"> PDF, DOC, DOCX up to 1MB </span>
                </label>
                <input id="cover-letter-upload" type="file"
class="sr-only" accept=".pdf,.doc,.docx" @change="handleCoverLetterUpload"
/>
              </div>
            </div>

            <div v-else
class="rounded-xl border border-green-200 bg-green-50 p-6">
              <div class="flex items-center">
                <svg class="size-5 text-green-400"
fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"
/>
                </svg>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-green-800">
                    {{ localProfile.cover_letter_filename || 'Cover letter uploaded' }}
                  </p>
                  <p class="text-xs text-green-600">
                    {{ formatFileSize(localProfile.cover_letter_size) }}
                  </p>
                </div>
                <div class="ml-4 flex space-x-3">
                  <button class="rounded-md px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 hover:text-green-900"
@click="downloadCoverLetter"
>
Download
</button>
                  <button class="rounded-md px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
@click="removeCoverLetter"
>
Remove
</button>
                </div>
              </div>
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

// Computed properties for URL handling
const linkedinUrl = computed({
  get: () => {
    if (!localProfile.value.linkedin_url) return ''
    return localProfile.value.linkedin_url.replace(/^https?:\/\//, '')
  },
  set: (value: string) => {
    localProfile.value.linkedin_url = value ? `https://${value}` : ''
  },
})

const websiteUrl = computed({
  get: () => {
    if (!localProfile.value.website_url) return ''
    return localProfile.value.website_url.replace(/^https?:\/\//, '')
  },
  set: (value: string) => {
    localProfile.value.website_url = value ? `https://${value}` : ''
  },
})

// Watch for external updates
watch(
  () => props.modelValue,
  (newValue) => {
    localProfile.value = { ...newValue }
  },
  { deep: true }
)

// Watch for local changes and emit updates
watch(
  localProfile,
  (newValue) => {
    emit('update', newValue)
  },
  { deep: true }
)

// File handling methods
const handleResumeUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (1MB)
  if (file.size > 1048576) {
    alert('File size must be less than 1MB')
    return
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    alert('Only PDF, DOC, and DOCX files are allowed')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: formData,
    })

    if (response.ok) {
      localProfile.value.has_resume = true
      localProfile.value.resume_filename = file.name
      localProfile.value.resume_size = file.size
      localProfile.value.resume_mimetype = file.type
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to upload resume')
    }
  } catch (error) {
    console.error('Error uploading resume:', error)
    alert('Failed to upload resume')
  }

  // Reset input
  target.value = ''
}

const handleCoverLetterUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (1MB)
  if (file.size > 1048576) {
    alert('File size must be less than 1MB')
    return
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    alert('Only PDF, DOC, and DOCX files are allowed')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/cover-letter`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: formData,
    })

    if (response.ok) {
      localProfile.value.has_cover_letter = true
      localProfile.value.cover_letter_filename = file.name
      localProfile.value.cover_letter_size = file.size
      localProfile.value.cover_letter_mimetype = file.type
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to upload cover letter')
    }
  } catch (error) {
    console.error('Error uploading cover letter:', error)
    alert('Failed to upload cover letter')
  }

  // Reset input
  target.value = ''
}

const downloadResume = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/resume/download`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = localProfile.value.resume_filename || 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      alert('Failed to download resume')
    }
  } catch (error) {
    console.error('Error downloading resume:', error)
    alert('Failed to download resume')
  }
}

const downloadCoverLetter = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/job-profiles/${localProfile.value.id}/cover-letter/download`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = localProfile.value.cover_letter_filename || 'cover-letter.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      alert('Failed to download cover letter')
    }
  } catch (error) {
    console.error('Error downloading cover letter:', error)
    alert('Failed to download cover letter')
  }
}

const removeResume = () => {
  if (confirm('Are you sure you want to remove your resume?')) {
    localProfile.value.has_resume = false
    localProfile.value.resume_filename = null
    localProfile.value.resume_size = null
    localProfile.value.resume_mimetype = null
    // Note: This doesn't actually delete from the backend - you might want to add that functionality
  }
}

const removeCoverLetter = () => {
  if (confirm('Are you sure you want to remove your cover letter?')) {
    localProfile.value.has_cover_letter = false
    localProfile.value.cover_letter_filename = null
    localProfile.value.cover_letter_size = null
    localProfile.value.cover_letter_mimetype = null
    // Note: This doesn't actually delete from the backend - you might want to add that functionality
  }
}

const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}
</script>
