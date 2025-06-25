<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useJobProfilesStore } from '../../stores/jobProfiles';
// import TurboApplyValidationModal from './TurboApplyValidationModal.vue'

interface Emits {
  close: [];
}

const emit = defineEmits<Emits>();

const jobProfilesStore = useJobProfilesStore();

const selectedProfileId = computed({
  get: () => jobProfilesStore.selectedProfileId,
  set: (value: string) => jobProfilesStore.selectProfile(value)
});
// const showValidationModal = ref(false)
// const validationQuestions = ref<any[]>([])
const error = ref<string>('');
const show = ref<boolean>(false);

const validating = computed(() => jobProfilesStore.validating);
const hasProfiles = computed(() => jobProfilesStore.profiles.length > 0);
const loading = computed(() => jobProfilesStore.loading);

onMounted(async () => {
  // Fetch profiles if not already loaded
  if (jobProfilesStore.profiles.length === 0) {
    await jobProfilesStore.fetchProfiles();
  }
  if (jobProfilesStore.selectedProfileId) {
    await jobProfilesStore.validateProfile();
  }
});

const closeModal = () => {
  emit('close');
};

// const closeValidationModal = () => {
//   showValidationModal.value = false
// }

const submit = () => {
  jobProfilesStore.submitApplication();
};
</script>

<template>
  <!-- Modal Backdrop -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/75"
  >
    <div
      class="mx-4 max-h-96 w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl"
    >
      <!-- Modal Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Turbo Apply</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <svg
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-4 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-4 text-center">
          <svg
            class="mx-auto size-8 animate-spin text-primary-500"
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
          <p class="mt-2 text-sm text-gray-600">Loading...</p>
        </div>

        <!-- No Profiles State -->
        <div v-else-if="!hasProfiles" class="py-6 text-center">
          <svg
            class="mx-auto mb-4 size-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h4 class="mb-2 text-lg font-medium text-gray-900">
            No Job Profiles Found
          </h4>
          <p class="mb-4 text-gray-600">
            You need to create a job profile before using Turbo Apply.
          </p>
          <router-link
            to="/job-profiles"
            class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
            @click="closeModal"
          >
            Create Job Profile
          </router-link>
        </div>

        <!-- Profile Selection -->
        <div v-else-if="!selectedProfileId">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Select a job profile to apply with:
            </label>
            <select
              v-model="selectedProfileId"
              onchange="jobProfilesStore.validateProfile()"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a profile...</option>
              <option
                v-for="profile in jobProfilesStore.profiles"
                :key="profile.id"
                :value="profile.id"
              >
                {{ profile.profile_name }}
                <span v-if="profile.first_name && profile.last_name">
                  ({{ profile.first_name }} {{ profile.last_name }})
                </span>
              </option>
            </select>
            <p class="text-sm text-blue-700">
              <svg
                class="mr-1 inline size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              This profile will be used for your application. You may be asked
              additional questions specific to this job.
            </p>
          </div>
        </div>
        <div v-else-if="selectedProfileId">
          <small>
            {{ jobProfilesStore.selectedProfile?.profile_name }} profile
            selected.
            <span
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              :onClick="
                () => {
                  selectedProfileId = '';
                }
              "
              >Change</span
            ></small
          >
          <div v-if="validating">
            <svg
              class="mx-auto size-8 animate-spin text-primary-500"
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
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div
        v-if="hasProfiles"
        class="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4"
      >
        <button
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          :disabled="validating || loading"
          class="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="submit"
        >
          Continue
        </button>
      </div>
    </div>
  </div>

  <!-- Turbo Apply Validation Modal -->
  <!-- <TurboApplyValidationModal v-if="showValidationModal" :show="showValidationModal"
:job="job" :questions="validationQuestions" :loading="loading" @close="closeValidationModal" @submit="submit"
/> -->
</template>
