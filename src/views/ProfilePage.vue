<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const user = ref({ ...authStore.user });
const saving = ref(false);
const savedSuccessfully = ref(false);

const saveProfile = async () => {
  saving.value = true;

  try {
    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would update the user data on the server
    // authStore.updateProfile(user.value);

    savedSuccessfully.value = true;

    // Reset the success message after 3 seconds
    setTimeout(() => {
      savedSuccessfully.value = false;
    }, 3000);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Profile Settings</h1>

    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div class="p-6 sm:p-8">
        <form @submit.prevent="saveProfile">
          <!-- Success Message -->
          <div v-if="savedSuccessfully" class="mb-6 rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="shrink-0">
                <svg
                  class="size-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>

          <!-- Profile Picture -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center">
            <div class="relative mb-4 sm:mb-0 sm:mr-6">
              <div
                class="flex size-24 items-center justify-center rounded-full bg-gray-100 text-2xl font-medium text-gray-600"
              >
                {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <button
                type="button"
                class="absolute bottom-0 right-0 rounded-full border border-gray-300 bg-white p-1 shadow-sm hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h2 class="text-xl font-medium text-gray-900">
                {{ user?.name }}
              </h2>
              <p class="text-gray-600">
                {{ user?.email }}
              </p>
              <p v-if="authStore.isPremium" class="mt-1">
                <span
                  class="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800"
                >
                  Premium Member
                </span>
              </p>
            </div>
          </div>

          <!-- Account Information -->
          <div class="mb-8">
            <h3 class="mb-4 text-lg font-medium text-gray-900">
              Account Information
            </h3>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  for="name"
                  class="mb-1 block text-sm font-medium text-gray-700"
                  >Full Name</label
                >
                <input
                  id="name"
                  v-model="user.name"
                  type="text"
                  class="form-input"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="mb-1 block text-sm font-medium text-gray-700"
                  >Email Address</label
                >
                <input
                  id="email"
                  v-model="user.email"
                  type="email"
                  class="form-input"
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="mb-1 block text-sm font-medium text-gray-700"
                  >Phone Number</label
                >
                <input
                  id="phone"
                  type="tel"
                  class="form-input"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label
                  for="location"
                  class="mb-1 block text-sm font-medium text-gray-700"
                  >Location</label
                >
                <input
                  id="location"
                  type="text"
                  class="form-input"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          <!-- Notification Preferences -->
          <div class="mb-8">
            <h3 class="mb-4 text-lg font-medium text-gray-900">
              Notification Preferences
            </h3>

            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="notifications-email"
                    type="checkbox"
                    checked
                    class="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="notifications-email"
                    class="font-medium text-gray-700"
                    >Email Notifications</label
                  >
                  <p class="text-gray-500">
                    Receive email notifications about new job matches and
                    updates
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="notifications-jobs"
                    type="checkbox"
                    checked
                    class="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="notifications-jobs"
                    class="font-medium text-gray-700"
                    >Job Recommendations</label
                  >
                  <p class="text-gray-500">
                    Receive personalized job recommendations based on your
                    profile
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input
                    id="notifications-marketing"
                    type="checkbox"
                    class="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="notifications-marketing"
                    class="font-medium text-gray-700"
                    >Marketing Communications</label
                  >
                  <p class="text-gray-500">
                    Receive updates about new features, tips, and special offers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button type="button" class="btn-outline">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <svg
                v-if="saving"
                class="-ml-1 mr-2 size-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
