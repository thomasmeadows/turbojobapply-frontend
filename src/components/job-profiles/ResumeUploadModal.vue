<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
      >
        <div>
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
          >
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Create Profile from Resume
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Upload your resume (PDF only) and we'll extract your information
                to create a job profile.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5 sm:mt-6">
          <!-- Profile Name Input -->
          <div class="mb-4">
            <label
              for="profile-name"
              class="block text-sm font-medium text-gray-700"
            >
              Profile Name
            </label>
            <input
              id="profile-name"
              v-model="profileName"
              type="text"
              placeholder="e.g., Software Engineer Profile"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-300': !profileName.trim() && showErrors }"
            />
            <p
              v-if="!profileName.trim() && showErrors"
              class="mt-1 text-sm text-red-600"
            >
              Profile name is required
            </p>
          </div>

          <!-- File Upload Area -->
          <div
            class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors"
            :class="{
              'border-blue-400 bg-blue-50': isDragOver,
              'border-red-300 bg-red-50': showErrors && !selectedFile,
              'border-green-300 bg-green-50': selectedFile
            }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf"
              class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              @change="handleFileSelect"
            />

            <div v-if="!selectedFile" class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-2">
                <p class="text-sm text-gray-600">
                  <span class="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>
                  or drag and drop
                </p>
                <p class="text-xs text-gray-500">PDF files only, max 1MB</p>
              </div>
            </div>

            <div v-else class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="mt-2">
                <p class="text-sm font-medium text-gray-900">
                  {{ selectedFile.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(selectedFile.size) }}
                </p>
                <button
                  type="button"
                  class="mt-2 text-xs text-blue-600 hover:text-blue-500"
                  @click="clearFile"
                >
                  Choose different file
                </button>
              </div>
            </div>
          </div>

          <p
            v-if="showErrors && !selectedFile"
            class="mt-1 text-sm text-red-600"
          >
            Please select a PDF file to upload
          </p>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
            <div class="flex">
              <svg
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="mt-4 rounded-md bg-green-50 p-4">
            <div class="flex">
              <svg
                class="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ success }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
        >
          <button
            type="button"
            :disabled="loading"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 sm:col-start-2 sm:text-sm"
            @click="handleUpload"
          >
            <svg
              v-if="loading"
              class="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ loading ? 'Creating Profile...' : 'Create Profile' }}
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

interface Props {
  initialFile?: File | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'success', profile: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialFile: null
});

const emit = defineEmits<Emits>();
const authStore = useAuthStore();

// State
const profileName = ref('');
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');
const showErrors = ref(false);

// File input ref
const fileInput = ref<HTMLInputElement>();

// Initialize with dropped file if provided
onMounted(() => {
  if (props.initialFile) {
    handleFileSelection(props.initialFile);
  }
});

// Methods
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFileSelection(files[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleFileSelection(input.files[0]);
  }
};

const handleFileSelection = (file: File) => {
  error.value = '';

  // Validate file type
  if (file.type !== 'application/pdf') {
    error.value = 'Only PDF files are supported for resume parsing.';
    return;
  }

  // Validate file size (1MB limit)
  if (file.size > 1048576) {
    error.value = 'File size must be less than 1MB.';
    return;
  }

  selectedFile.value = file;

  // Auto-generate profile name if empty
  if (!profileName.value.trim()) {
    const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    profileName.value = `${baseName} Profile`;
  }
};

const clearFile = () => {
  selectedFile.value = null;
  error.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleUpload = async () => {
  showErrors.value = true;

  if (!profileName.value.trim()) {
    error.value = 'Profile name is required.';
    return;
  }

  if (!selectedFile.value) {
    error.value = 'Please select a PDF file to upload.';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('profile_name', profileName.value.trim());

    const response = await axios.post(
      '/api/job-profiles/parse-resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    );

    if (response.data.success) {
      const { profile, parsedData } = response.data;
      success.value = `Profile created successfully! Extracted ${parsedData.fieldsExtracted} fields, ${parsedData.skillsFound} skills, and ${parsedData.experienceEntries} work experiences.`;

      // Emit success after a brief delay to show the success message
      setTimeout(() => {
        emit('success', profile);
      }, 2000);
    }
  } catch (err: any) {
    console.error('Resume upload error:', err);
    if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value =
        'Failed to parse resume and create profile. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
