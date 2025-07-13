<template>
  <div class="relative">
    <!-- Resume Upload Button -->
    <div class="relative group">
      <button
        :disabled="!props.canCreateProfile"
        class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        @click="showResumeModal = true"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Upload Resume
        
        <!-- Help Icon inside button -->
        <div class="ml-2 flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500">
          <svg
            class="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </button>
      
      <!-- Tooltip -->
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        <div class="bg-gray-900 text-white text-xs rounded-lg py-3 px-4 w-80 text-center leading-relaxed">
          Automatically parse your resume and fill fields you need to apply by uploading your resume first
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
        </div>
      </div>
    </div>

    <!-- Drop Zone Overlay (appears on drag) -->
    <div
      v-if="isDragOver && props.canCreateProfile"
      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-90"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-8 w-8 text-blue-500"
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
        <p class="text-sm font-medium text-blue-700">Drop PDF here</p>
      </div>
    </div>

    <!-- Global drop zone listener -->
    <div
      v-if="props.canCreateProfile"
      class="pointer-events-none fixed inset-0 z-0"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    />

    <!-- Resume Upload Modal -->
    <ResumeUploadModal
      v-if="showResumeModal"
      :initial-file="droppedFile"
      @close="handleModalClose"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ResumeUploadModal from './ResumeUploadModal.vue';

interface Props {
  canCreateProfile: boolean;
}

interface Emits {
  (e: 'profile-created', profile: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const authStore = useAuthStore();

// State
const isDragOver = ref(false);
const showResumeModal = ref(false);
const droppedFile = ref<File | null>(null);
const dragCounter = ref(0);

// Computed - none needed since canCreateProfile is now a prop

// Methods
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  dragCounter.value++;

  // Check if the dragged items include a PDF file
  const types = event.dataTransfer?.types || [];
  if (types.includes('Files')) {
    isDragOver.value = true;
  }
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  dragCounter.value--;

  // Only hide the overlay when we've left all drag areas
  if (dragCounter.value <= 0) {
    isDragOver.value = false;
    dragCounter.value = 0;
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  dragCounter.value = 0;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];

    // Check if it's a PDF
    if (file.type === 'application/pdf') {
      droppedFile.value = file;
      showResumeModal.value = true;
    } else {
      // Could show a toast notification here
      console.warn('Only PDF files are supported for resume parsing');
    }
  }
};

const handleModalClose = () => {
  showResumeModal.value = false;
  droppedFile.value = null;
};

const handleUploadSuccess = (profile: any) => {
  showResumeModal.value = false;
  droppedFile.value = null;
  emit('profile-created', profile);
};
</script>
