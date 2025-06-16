<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import type { Job } from '../../types/job';
import TurboApplyValidationModal from './TurboApplyValidationModal.vue';

interface JobProfile {
  id: string;
  profile_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface Props {
  show: boolean;
  job: Job;
  requisitionId: number;
  atsSource: string;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;

const loading = ref(false);
const jobProfiles = ref<JobProfile[]>([]);
const selectedProfileId = ref<string>('');
const showValidationModal = ref(false);
const validationQuestions = ref<any[]>([]);
const profileData = ref<any>(null);
const error = ref<string>('');

const hasProfiles = computed(() => jobProfiles.value.length > 0);
const canProceed = computed(() => selectedProfileId.value !== '');

onMounted(async () => {
  await fetchJobProfiles();
});

const fetchJobProfiles = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/api/job-profiles`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    if (response.data.success) {
      jobProfiles.value = response.data.data || [];
    }
  } catch (error) {
    console.error('Error fetching job profiles:', error);
    // Don't show error for this, just leave profiles empty
  } finally {
    loading.value = false;
  }
};

const proceedWithApplication = async () => {
  if (!selectedProfileId.value) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    // Validate the profile first
    const validateResponse = await axios.post(`${API_URL}/api/job-applications/validate`, {
      jobProfileId: selectedProfileId.value,
      requisitionId: props.requisitionId,
      atsSource: props.atsSource
    }, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    if (validateResponse.data.success) {
      const validation = validateResponse.data.data;
      
      if (validation.isValid) {
        // Profile is valid, submit directly
        await submitApplication();
      } else {
        // Show validation questions
        validationQuestions.value = validation.missingFields || [];
        profileData.value = validation.profileData;
        showValidationModal.value = true;
      }
    }
  } catch (error: any) {
    console.error('Error validating profile:', error);
    error.value = error.response?.data?.message || 'Failed to validate profile';
  } finally {
    loading.value = false;
  }
};

const submitApplication = async (validationAnswers?: Record<string, any>) => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await axios.post(`${API_URL}/api/job-applications/submit`, {
      jobProfileId: selectedProfileId.value,
      requisitionId: props.requisitionId,
      atsSource: props.atsSource,
      validationAnswers
    }, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    if (response.data.success) {
      // Success! Close modals and show success message
      showValidationModal.value = false;
      emit('close');
      
      // You might want to show a success toast here
      alert('Application submitted successfully! You can view your application history in your dashboard.');
    }
  } catch (error: any) {
    console.error('Error submitting application:', error);
    error.value = error.response?.data?.message || 'Failed to submit application';
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const closeValidationModal = () => {
  showValidationModal.value = false;
};

const onValidationSubmit = (answers: Record<string, any>) => {
  submitApplication(answers);
};
</script>

<template>
  <!-- Modal Backdrop -->
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Turbo Apply</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <!-- Job Info -->
        <div class="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 class="font-medium text-gray-900">{{ job.title }}</h4>
          <p class="text-sm text-gray-600">{{ job.company }} • {{ job.location }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <svg class="animate-spin h-8 w-8 text-primary-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-gray-600 mt-2">Loading...</p>
        </div>

        <!-- No Profiles State -->
        <div v-else-if="!hasProfiles" class="text-center py-6">
          <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h4 class="text-lg font-medium text-gray-900 mb-2">No Job Profiles Found</h4>
          <p class="text-gray-600 mb-4">You need to create a job profile before using Turbo Apply.</p>
          <router-link 
            to="/job-profiles" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            @click="closeModal"
          >
            Create Job Profile
          </router-link>
        </div>

        <!-- Profile Selection -->
        <div v-else>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select a job profile to apply with:
            </label>
            <select 
              v-model="selectedProfileId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a profile...</option>
              <option 
                v-for="profile in jobProfiles" 
                :key="profile.id" 
                :value="profile.id"
              >
                {{ profile.profile_name }}
                <span v-if="profile.first_name && profile.last_name"> 
                  ({{ profile.first_name }} {{ profile.last_name }})
                </span>
              </option>
            </select>
          </div>

          <!-- Profile Preview (if selected) -->
          <div v-if="selectedProfileId" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-sm text-blue-700">
              <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This profile will be used for your application. You may be asked additional questions specific to this job.
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div v-if="hasProfiles" class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          @click="proceedWithApplication"
          :disabled="!canProceed || loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  </div>

  <!-- Turbo Apply Validation Modal -->
  <TurboApplyValidationModal
    v-if="showValidationModal"
    :show="showValidationModal"
    :job="job"
    :questions="validationQuestions"
    :loading="loading"
    @close="closeValidationModal"
    @submit="onValidationSubmit"
  />
</template>