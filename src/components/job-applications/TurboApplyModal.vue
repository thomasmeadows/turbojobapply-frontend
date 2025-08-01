<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useJobProfilesStore } from '@/stores/jobProfiles';
import {
  JobProfileFieldType
} from '@/stores/jobProfiles';

interface Emits {
  close: [];
}

const emit = defineEmits<Emits>();

const jobProfilesStore = useJobProfilesStore();

const selectedProfileId = computed({
  get: () => jobProfilesStore.selectedProfileId,
  set: (value: string) => jobProfilesStore.selectProfile(value)
});

const error = ref<string>('');
const isUpdatingFields = ref(false);
const saving = ref(false);

// Form data for missing fields
const profileUpdates = ref<Record<string, any>>({});
const customQuestions = ref<Record<string, any>>({});
const fieldErrors = ref<Record<string, string>>({});

const validating = computed(() => jobProfilesStore.validating);
const hasProfiles = computed(() => jobProfilesStore.profiles.length > 0);
const loading = computed(() => jobProfilesStore.loading);
const hasMissingFields = computed(
  () =>
    jobProfilesStore.fieldsNeededForProfile &&
    jobProfilesStore.fieldsNeededForProfile.length > 0
);

const regularFields = computed(
  () =>
    jobProfilesStore.fieldsNeededForProfile?.filter(
      (field) => !field.customQuestion
    ) || []
);

const customFields = computed(
  () =>
    jobProfilesStore.fieldsNeededForProfile?.filter(
      (field) => field.customQuestion
    ) || []
);

const canSave = computed(() => {
  if (!hasMissingFields.value) return false;

  return jobProfilesStore.fieldsNeededForProfile.every((field) => {
    if (field.customQuestion) {
      const answer = customQuestions.value[field.name];
      return answer !== undefined && answer !== null && answer !== '';
    } else {
      const value = profileUpdates.value[field.name];
      return value !== undefined && value !== null && value !== '';
    }
  });
});

// Watch for changes in missing fields to reset form
watch(
  () => jobProfilesStore.fieldsNeededForProfile,
  (newFields) => {
    if (newFields && newFields.length > 0) {
      resetFieldsForm();
      isUpdatingFields.value = true;
    } else {
      isUpdatingFields.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // Fetch profiles if not already loaded
  if (jobProfilesStore.profiles.length === 0) {
    await jobProfilesStore.fetchProfiles();
  }
  if (jobProfilesStore.selectedProfileId) {
    await jobProfilesStore.validateProfile();
  }
});

const resetFieldsForm = () => {
  profileUpdates.value = {};
  customQuestions.value = {};
  fieldErrors.value = {};

  // Pre-populate with existing profile data
  const profile = jobProfilesStore.selectedProfile;
  if (profile) {
    regularFields.value.forEach((field) => {
      const existingValue = (profile as any)[field.name];
      if (existingValue) {
        profileUpdates.value[field.name] = existingValue;
      }
    });
  }
};

const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'ZIP Code',
    country: 'Country',
    desired_job_title: 'Desired Job Title',
    date_available: 'Date Available',
    desired_pay: 'Desired Salary',
    linkedin_url: 'LinkedIn URL',
    website_url: 'Website/Portfolio URL',
    resume_data: 'Resume',
    cover_letter_data: 'Cover Letter'
  };
  return (
    labels[fieldName] ||
    fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const getInputType = (fieldType: JobProfileFieldType): string => {
  switch (fieldType) {
    case JobProfileFieldType.EMAIL:
      return 'email';
    case JobProfileFieldType.PHONE:
      return 'tel';
    case JobProfileFieldType.DATE:
      return 'date';
    case JobProfileFieldType.LINKEDIN:
      return 'url';
    case JobProfileFieldType.WEBSITE:
      return 'url';
    default:
      return 'text';
  }
};

const validateField = (fieldName: string, value: any): boolean => {
  delete fieldErrors.value[fieldName];

  if (!value || value === '') {
    fieldErrors.value[fieldName] = 'This field is required';
    return false;
  }

  if (fieldName === 'email' || fieldName.includes('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      fieldErrors.value[fieldName] = 'Please enter a valid email address';
      return false;
    }
  }

  if (
    fieldName.includes('url') ||
    fieldName.includes('linkedin') ||
    fieldName.includes('website')
  ) {
    try {
      new URL(value);
    } catch {
      fieldErrors.value[fieldName] = 'Please enter a valid URL';
      return false;
    }
  }

  return true;
};

const handleFieldChange = (fieldName: string, value: any, isCustom = false) => {
  if (isCustom) {
    customQuestions.value[fieldName] = value;
  } else {
    profileUpdates.value[fieldName] = value;
  }
  validateField(fieldName, value);
};

const getAtsColumnName = (atsName: string): string => {
  return `ats_${atsName.toLowerCase()}_custom_questions`;
};

const saveAndRevalidate = async () => {
  if (!selectedProfileId.value) return;

  saving.value = true;
  fieldErrors.value = {};
  error.value = '';

  try {
    // Validate all fields
    let hasErrors = false;

    regularFields.value.forEach((field) => {
      const value = profileUpdates.value[field.name];
      if (!validateField(field.name, value)) {
        hasErrors = true;
      }
    });

    customFields.value.forEach((field) => {
      const value = customQuestions.value[field.name];
      if (!validateField(field.name, value)) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }

    // Prepare updates object
    const updates: Record<string, any> = { ...profileUpdates.value };

    // Handle custom questions - group by ATS
    const customQuestionsByAts: Record<string, Record<string, any>> = {};

    customFields.value.forEach((field) => {
      if (field.ats) {
        if (!customQuestionsByAts[field.ats]) {
          customQuestionsByAts[field.ats] = {};
        }
        customQuestionsByAts[field.ats][field.name] = {
          question: field.name,
          answer: customQuestions.value[field.name],
          type: field.type,
          required: true
        };
      }
    });

    // Add ATS-specific custom questions to updates
    Object.keys(customQuestionsByAts).forEach((atsName) => {
      const columnName = getAtsColumnName(atsName);
      updates[columnName] = customQuestionsByAts[atsName];
    });

    // Update the profile
    const success = await jobProfilesStore.updateProfile(
      selectedProfileId.value,
      updates
    );

    if (success) {
      // Re-validate the profile to check if there are still missing fields
      await jobProfilesStore.validateProfile();

      // Reset the updating state if validation passes
      if (
        !jobProfilesStore.fieldsNeededForProfile ||
        jobProfilesStore.fieldsNeededForProfile.length === 0
      ) {
        isUpdatingFields.value = false;
      }
    }
  } catch (err: any) {
    console.error('Error updating profile fields:', err);
    error.value = 'Failed to update profile. Please try again.';
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const submit = () => {
  jobProfilesStore.submitApplication();
};
</script>

<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/75 p-2 sm:p-4">
    <div :class="[
      'flex w-full flex-col rounded-lg bg-white shadow-xl',
      hasMissingFields
        ? 'max-h-[90vh] min-h-[400px] max-w-3xl sm:min-h-[500px]'
        : 'max-h-96 max-w-md overflow-y-auto'
    ]">
      <!-- Modal Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Turbo Apply</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-4">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-4 text-center">
          <svg class="mx-auto size-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p class="mt-2 text-sm text-gray-600">Loading...</p>
        </div>

        <!-- No Profiles State -->
        <div v-else-if="!hasProfiles" class="py-6 text-center">
          <svg class="mx-auto mb-4 size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h4 class="mb-2 text-lg font-medium text-gray-900">
            No Job Profiles Found
          </h4>
          <p class="mb-4 text-gray-600">
            You need to create a job profile before using Turbo Apply.
          </p>
          <router-link to="/job-profiles"
            class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
            @click="closeModal">
            Create Job Profile
          </router-link>
        </div>

        <!-- Profile Selection -->
        <div v-else-if="!selectedProfileId">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Select a job profile to apply with:
            </label>
            <select v-model="selectedProfileId" onchange="jobProfilesStore.validateProfile()"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Choose a profile...</option>
              <option v-for="profile in jobProfilesStore.profiles" :key="profile.id" :value="profile.id">
                {{ profile.profile_name }}
                <span v-if="profile.first_name && profile.last_name">
                  ({{ profile.first_name }} {{ profile.last_name }})
                </span>
              </option>
            </select>
            <p class="text-sm text-blue-700">
              <svg class="mr-1 inline size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer" :onClick="() => {
              selectedProfileId = '';
            }
              ">Change</span></small>
          <div v-if="validating">
            <svg class="mx-auto size-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
        <!-- Missing Fields Form (Inline) -->
        <div v-if="isUpdatingFields && hasMissingFields" class="flex min-h-0 flex-1 flex-col space-y-6">
          <!-- Instructions -->
          <div class="rounded-md border border-blue-200 bg-blue-50 p-4">
            <div class="flex">
              <svg class="mr-2 mt-0.5 size-5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="mb-1 text-sm font-medium text-blue-800">
                  Additional Information Required
                </h4>
                <p class="text-sm text-blue-700">
                  Please complete the following
                  {{ jobProfilesStore.fieldsNeededForProfile.length }} field{{
                    jobProfilesStore.fieldsNeededForProfile.length > 1
                      ? 's'
                      : ''
                  }}
                  to proceed with your application.
                </p>
              </div>
            </div>
          </div>

          <!-- Scrollable Form Fields -->
          <div class="min-h-0 flex-1 space-y-6 overflow-y-auto">
            <!-- Regular Profile Fields -->
            <div v-if="regularFields.length > 0">
              <h4 class="mb-4 text-sm font-semibold text-gray-900">
                Profile Information
              </h4>
              <div class="space-y-4">
                <div v-for="field in regularFields" :key="field.name" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ getFieldLabel(field.name) }}
                    <span class="text-red-500">*</span>
                  </label>

                  <!-- Text/Email/URL inputs -->
                  <input v-if="
                    field.type !== 'cover_letter' && field.type !== 'resume'
                  " :type="getInputType(field.type)" :value="profileUpdates[field.name] || ''" :class="[
                    'w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500',
                    fieldErrors[field.name]
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-transparent'
                  ]" @input="
                    handleFieldChange(
                      field.name,
                      ($event.target as HTMLInputElement).value
                    )
                    " />

                  <!-- File upload placeholders -->
                  <div v-else class="rounded-md border border-dashed border-gray-300 p-4 text-center">
                    <p class="text-sm text-gray-500">
                      {{ field.type === 'resume' ? 'Resume' : 'Cover Letter' }}
                      upload required. Please go to your Job Profiles page to
                      upload files.
                    </p>
                    <router-link to="/job-profiles"
                      class="mt-2 inline-flex text-sm text-primary-600 hover:text-primary-800" @click="closeModal">
                      Go to Job Profiles →
                    </router-link>
                  </div>

                  <!-- Error Message -->
                  <p v-if="fieldErrors[field.name]" class="text-sm text-red-600">
                    {{ fieldErrors[field.name] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Custom Questions -->
            <div v-if="customFields.length > 0">
              <h4 class="mb-4 text-sm font-semibold text-gray-900">
                Job-Specific Questions
              </h4>
              <div class="space-y-4">
                <div v-for="field in customFields" :key="field.name" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ field.name }}
                    <span class="text-red-500">*</span>
                  </label>
                  <span v-if="field.ats" class="text-xs uppercase text-gray-500">
                    {{ field.ats }} Question
                  </span>

                  <!-- Text Input for custom questions -->
                  <input v-if="field.type === 'input'" type="text" :value="customQuestions[field.name] || ''" :class="[
                    'w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500',
                    fieldErrors[field.name]
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-transparent'
                  ]" @input="
                    handleFieldChange(
                      field.name,
                      ($event.target as HTMLInputElement).value,
                      true
                    )
                    " />

                  <!-- Textarea for longer responses -->
                  <textarea v-else-if="field.type === 'cover_letter'" :value="customQuestions[field.name] || ''"
                    rows="4" :class="[
                      'w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500',
                      fieldErrors[field.name]
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-transparent'
                    ]" @input="
                      handleFieldChange(
                        field.name,
                        ($event.target as HTMLTextAreaElement).value,
                        true
                      )
                      " />

                  <!-- Error Message -->
                  <p v-if="fieldErrors[field.name]" class="text-sm text-red-600">
                    {{ fieldErrors[field.name] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div v-if="hasProfiles" class="flex flex-shrink-0 justify-end space-x-3 border-t border-gray-200 px-6 py-4">
        <button class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="closeModal">
          Cancel
        </button>

        <!-- Save & Revalidate Button (when updating fields) -->
        <button v-if="isUpdatingFields" :disabled="!canSave || saving"
          class="flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="saveAndRevalidate">
          <svg v-if="saving" class="-ml-1 mr-2 size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ saving ? 'Saving...' : 'Save & Revalidate' }}
        </button>

        <!-- Continue Button (when not updating fields) -->
        <button v-else :disabled="validating || loading"
          class="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="submit">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>
