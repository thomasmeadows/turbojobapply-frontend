<template>
  <div class="fixed inset-0 z-50 size-full overflow-y-auto bg-gray-600/50">
    <div
      class="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg"
    >
      <div class="mt-3 text-center">
        <div
          class="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100"
        >
          <svg
            class="size-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3 class="mt-2 text-lg font-medium text-gray-900">
          Delete Job Profile
        </h3>

        <div class="mt-2 px-7 py-3">
          <p class="mb-3 text-sm text-gray-500">
            Are you sure you want to delete the profile
            <strong>"{{ profile?.profile_name }}"</strong>?
          </p>

          <div v-if="profile" class="mb-3 rounded-md bg-gray-50 p-3 text-left">
            <h4 class="mb-2 text-xs font-medium text-gray-700">
              This will permanently delete:
            </h4>
            <ul class="space-y-1 text-xs text-gray-600">
              <li class="flex items-center">
                <svg
                  class="mr-2 size-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                All contact and job information
              </li>
              <li
                v-if="profile.skills && profile.skills.length > 0"
                class="flex items-center"
              >
                <svg
                  class="mr-2 size-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ profile.skills.length }} skill{{
                  profile.skills.length > 1 ? 's' : ''
                }}
              </li>
              <li
                v-if="profile.experience && profile.experience.length > 0"
                class="flex items-center"
              >
                <svg
                  class="mr-2 size-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ profile.experience.length }} experience entr{{
                  profile.experience.length > 1 ? 'ies' : 'y'
                }}
              </li>
              <li v-if="profile.has_resume" class="flex items-center">
                <svg
                  class="mr-2 size-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Resume file ({{ profile.resume_filename }})
              </li>
              <li v-if="profile.has_cover_letter" class="flex items-center">
                <svg
                  class="mr-2 size-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Cover letter file ({{ profile.cover_letter_filename }})
              </li>
            </ul>
          </div>

          <p class="text-xs font-medium text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <div
          v-if="jobProfilesStore.error"
          class="mb-4 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p class="text-sm text-red-600">
            {{ jobProfilesStore.error }}
          </p>
        </div>

        <div class="items-center px-4 py-3">
          <div class="flex gap-3">
            <button
              :disabled="jobProfilesStore.loading"
              class="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-gray-300"
              @click="deleteProfile"
            >
              <span
                v-if="jobProfilesStore.loading"
                class="flex items-center justify-center"
              >
                <svg
                  class="-ml-1 mr-2 size-4 animate-spin text-white"
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
                Deleting...
              </span>
              <span v-else>Delete Profile</span>
            </button>
            <button
              :disabled="jobProfilesStore.loading"
              class="flex-1 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobProfilesStore } from '@/stores/jobProfiles';

const props = defineProps<{
  profile: any;
}>();

const emit = defineEmits<{
  close: [];
  deleted: [];
}>();

const jobProfilesStore = useJobProfilesStore();

const deleteProfile = async () => {
  if (!props.profile?.id) return;

  const success = await jobProfilesStore.deleteProfile(props.profile.id);

  if (success) {
    emit('deleted');
  }
};
</script>
