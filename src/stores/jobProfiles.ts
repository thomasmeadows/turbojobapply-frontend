/* eslint-disable max-lines-per-function */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useJobsStore } from './jobs';

export interface JobProfile {
  id: string;
  profile_name: string;
  desired_job_title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country_code?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  availability_date?: string;
  salary_expectation?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  optional_fields_handling?: string;
  skills?: Array<{ id: string; skill_name: string }>;
  experience?: Array<{
    id: string;
    job_title: string;
    company_name: string;
    start_date: string;
    end_date?: string;
    is_current_job: boolean;
    description?: string;
  }>;
  resume_file_name?: string;
  cover_letter_file_name?: string;
  // ATS custom fields (normalized structure)
  ats_custom_fields?: UserJobProfileATSCustomField[];
  created_at?: string;
  updated_at?: string;
  validating: boolean;
}

// ATS Custom Field interfaces (aligned with backend models)
export interface UserJobProfileATSCustomField {
  id: string;
  user_job_profile_id: string;
  ats_source_id: number;
  input_type: ATSCustomFieldInputType;
  ats_question_id: string;
  question_options?: QuestionOption[];
  question_text: string;
  question_label: string;
  question_answer?: string;
  is_required: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface QuestionOption {
  value: string;
  label: string;
}

// Enum for ATS custom field input types
export enum ATSCustomFieldInputType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  FILE = 'file'
}

// Request/Response DTOs for API calls
export interface CreateATSCustomFieldRequest {
  user_job_profile_id: string;
  ats_source_id: number;
  input_type: ATSCustomFieldInputType;
  ats_question_id: string;
  question_options?: QuestionOption[];
  question_text: string;
  question_label: string;
  question_answer?: string;
  is_required?: boolean;
}

export interface UpdateATSCustomFieldRequest
  extends Partial<CreateATSCustomFieldRequest> {
  id: string;
}

export interface BulkUpdateATSCustomFieldsRequest {
  user_job_profile_id: string;
  ats_source_id: number;
  custom_fields: Array<{
    id?: string; // If provided, update existing; if not, create new
    ats_question_id: string;
    input_type: ATSCustomFieldInputType;
    question_text: string;
    question_label: string;
    question_options?: QuestionOption[];
    question_answer?: string;
    is_required?: boolean;
  }>;
}

export interface JobApplyField {
  id: string;
  category: string;
  value: string;
  question: string;
  type: string;
  options: { id: string; text: string }[];
  optional: boolean;
}

export interface JobProfileField {
  name: string;
  type: JobProfileFieldType;
  question?: string;
  options?: Array<{ id: string; text: string }>;
  customQuestion?: boolean;
  ats?: string;
}

export enum JobProfileFieldType {
  INPUT = 'input',
  SELECT = 'select',
  YES_NO = 'yes_no',
  CHECKBOX = 'checkbox',
  COVER_LETTER = 'cover_letter',
  RESUME = 'resume',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  LINKEDIN = 'linkedin',
  WEBSITE = 'website',
  CITY = 'city',
  STATE = 'state',
  ZIP = 'zip'
}

const API_URL = import.meta.env.VITE_API_URL;

export const useJobProfilesStore = defineStore('jobProfiles', () => {
  // State
  const profiles = ref<JobProfile[]>([]);
  const selectedProfileId = ref<string>('');
  const loading = ref(false);
  const validating = ref(false);
  const saving = ref(false);
  const error = ref<string>('');
  const jobsStore = useJobsStore();
  const fieldsNeededForProfile = ref<JobProfileField[]>([]);

  // Getters
  const selectedProfile = computed(
    () => profiles.value.find((p) => p.id === selectedProfileId.value) || null
  );

  const canCreateProfile = computed(() => {
    const authStore = useAuthStore();
    return authStore.isPremium || profiles.value.length === 0;
  });

  // Actions
  const fetchProfiles = async (): Promise<void> => {
    const authStore = useAuthStore();
    try {
      loading.value = true;
      error.value = '';

      const response = await axios.get(`${API_URL}/api/job-profiles`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      profiles.value = response.data;

      // Auto-select first profile if none selected
      if (profiles.value.length > 0 && !selectedProfileId.value) {
        selectedProfileId.value = profiles.value[0].id;
        await fetchProfile(selectedProfileId.value);
      }
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to load profiles. Please try again.';
      }
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async (profileId: string): Promise<void> => {
    const authStore = useAuthStore();
    try {
      const response = await axios.get(
        `${API_URL}/api/job-profiles/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const profile = response.data;

      // Update the profile in the profiles array
      const index = profiles.value.findIndex((p) => p.id === profileId);
      if (index !== -1) {
        profiles.value[index] = profile;
      } else {
        profiles.value.push(profile);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to load profile. Please try again.';
      }
    }
  };

  const createProfile = async (profileData: {
    profile_name: string;
    desired_job_title?: string;
  }): Promise<JobProfile | null> => {
    const authStore = useAuthStore();
    try {
      loading.value = true;
      error.value = '';

      const response = await axios.post(
        `${API_URL}/api/job-profiles`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newProfile = response.data;
      profiles.value.push(newProfile);
      selectedProfileId.value = newProfile.id;
      return newProfile;
    } catch (err: any) {
      console.error('Error creating profile:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to create profile. Please try again.';
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (
    profileId: string,
    updates: Partial<JobProfile>
  ): Promise<boolean> => {
    const authStore = useAuthStore();
    try {
      saving.value = true;
      error.value = '';

      // Find the current profile
      const currentProfile = profiles.value.find((p) => p.id === profileId);
      if (!currentProfile) {
        error.value = 'Profile not found';
        return false;
      }

      const response = await axios.put(
        `${API_URL}/api/job-profiles/${profileId}`,
        { ...currentProfile, ...updates },
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedProfile = response.data;

      // Update the profile in the profiles array
      const index = profiles.value.findIndex((p) => p.id === profileId);
      if (index !== -1) {
        profiles.value[index] = updatedProfile;
      }

      return true;
    } catch (err: any) {
      console.error('Error saving profile:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to save profile. Please try again.';
      }
      return false;
    } finally {
      saving.value = false;
    }
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    const authStore = useAuthStore();
    try {
      loading.value = true;
      error.value = '';

      await axios.delete(`${API_URL}/api/job-profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove from profiles array
      profiles.value = profiles.value.filter((p) => p.id !== profileId);

      // Update selected profile if needed
      if (selectedProfileId.value === profileId) {
        if (profiles.value.length > 0) {
          selectedProfileId.value = profiles.value[0].id;
        } else {
          selectedProfileId.value = '';
        }
      }

      return true;
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to delete profile. Please try again.';
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  const selectProfile = (profileId: string) => {
    selectedProfileId.value = profileId;
  };

  const validateProfile = async () => {
    const authStore = useAuthStore();
    const atsSource: any = jobsStore.getCurrentJobAts();
    const id: any = jobsStore.getCurrentJobId();
    validating.value = true;
    if (!selectedProfileId.value) return;

    try {
      error.value = '';
      if (!selectedProfileId.value || !id || !atsSource) {
        throw new Error(
          `missing required fields selectedProfileId=${selectedProfileId?.value}, id=${id}, atsSource=${atsSource}`
        );
      }

      // Validate the profile first
      const results = await axios.post(
        `${API_URL}/api/job-applications/validate`,
        {
          jobProfileId: selectedProfileId.value,
          id: id,
          atsSource: atsSource
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      fieldsNeededForProfile.value = results.data.data.missingFields;
      loading.value = false;
      validating.value = false;

      // Response data is automatically parsed by axios
      // const data = validateResponse.data;
    } catch (_error: any) {
      console.error('Error validating profile:', _error);
      error.value =
        _error.response?.data?.message || 'Failed to validate profile';
    }
  };

  const submitApplication = () => {
    try {
      error.value = '';

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
      console.error('Error submitting application:', error);
      error.value =
        error.response?.data?.message || 'Failed to submit application';
    }
  };

  const clearError = (): void => {
    error.value = '';
  };

  const resetStore = (): void => {
    profiles.value = [];
    selectedProfileId.value = '';
    loading.value = false;
    saving.value = false;
    error.value = '';
  };

  // ===========================================
  // ATS CUSTOM FIELDS METHODS
  // ===========================================

  const fetchATSCustomFields = async (
    profileId: string,
    atsSourceId?: number
  ): Promise<UserJobProfileATSCustomField[]> => {
    const authStore = useAuthStore();
    try {
      const url = atsSourceId
        ? `${API_URL}/api/job-profiles/${profileId}/ats-custom-fields?ats_source_id=${atsSourceId}`
        : `${API_URL}/api/job-profiles/${profileId}/ats-custom-fields`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (err: any) {
      console.error('Error fetching ATS custom fields:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to load ATS custom fields. Please try again.';
      }
      return [];
    }
  };

  const createATSCustomField = async (
    customFieldData: CreateATSCustomFieldRequest
  ): Promise<UserJobProfileATSCustomField | null> => {
    const authStore = useAuthStore();
    try {
      const response = await axios.post(
        `${API_URL}/api/job-profiles/ats-custom-fields`,
        customFieldData,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('Error creating ATS custom field:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to create ATS custom field. Please try again.';
      }
      return null;
    }
  };

  const updateATSCustomField = async (
    customFieldData: UpdateATSCustomFieldRequest
  ): Promise<UserJobProfileATSCustomField | null> => {
    const authStore = useAuthStore();
    try {
      const response = await axios.put(
        `${API_URL}/api/job-profiles/ats-custom-fields/${customFieldData.id}`,
        customFieldData,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('Error updating ATS custom field:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to update ATS custom field. Please try again.';
      }
      return null;
    }
  };

  const deleteATSCustomField = async (
    customFieldId: string
  ): Promise<boolean> => {
    const authStore = useAuthStore();
    try {
      await axios.delete(
        `${API_URL}/api/job-profiles/ats-custom-fields/${customFieldId}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return true;
    } catch (err: any) {
      console.error('Error deleting ATS custom field:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value = 'Failed to delete ATS custom field. Please try again.';
      }
      return false;
    }
  };

  const bulkUpdateATSCustomFields = async (
    bulkUpdateData: BulkUpdateATSCustomFieldsRequest
  ): Promise<UserJobProfileATSCustomField[]> => {
    const authStore = useAuthStore();
    try {
      const response = await axios.post(
        `${API_URL}/api/job-profiles/${bulkUpdateData.user_job_profile_id}/ats-custom-fields/bulk`,
        bulkUpdateData,
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('Error bulk updating ATS custom fields:', err);
      if (err.response?.data?.error) {
        error.value = err.response.data.error;
      } else {
        error.value =
          'Failed to bulk update ATS custom fields. Please try again.';
      }
      return [];
    }
  };

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
    fieldsNeededForProfile,

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

    // ATS Custom Field Actions
    fetchATSCustomFields,
    createATSCustomField,
    updateATSCustomField,
    deleteATSCustomField,
    bulkUpdateATSCustomFields
  };
});
