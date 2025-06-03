<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">Contact Information</h2>
      <p class="mt-2 text-base text-gray-600">
        Your personal contact details for this job profile.
      </p>
    </div>

    <div class="space-y-8">
      <!-- Profile Name -->
      <div>
        <label for="profile-name" class="block text-sm font-semibold text-gray-800 mb-2">
          Profile Name *
        </label>
        <input
          id="profile-name"
          v-model="localProfile.profile_name"
          type="text"
          required
          class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          placeholder="e.g., Software Engineer, Marketing Manager"
        />
        <p class="mt-2 text-sm text-gray-500">Give this profile a descriptive name to distinguish it from others</p>
      </div>

      <!-- Desired Job Title -->
      <div>
        <label for="desired-job-title" class="block text-sm font-semibold text-gray-800 mb-2">
          Desired Job Title
        </label>
        <input
          id="desired-job-title"
          v-model="localProfile.desired_job_title"
          type="text"
          class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          placeholder="e.g., Senior Software Engineer"
        />
        <p class="mt-2 text-sm text-gray-500">The specific job title you're targeting</p>
      </div>

      <!-- Name Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label for="first-name" class="block text-sm font-semibold text-gray-800 mb-2">
            First Name
          </label>
          <input
            id="first-name"
            v-model="localProfile.first_name"
            type="text"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          />
        </div>
        <div>
          <label for="last-name" class="block text-sm font-semibold text-gray-800 mb-2">
            Last Name
          </label>
          <input
            id="last-name"
            v-model="localProfile.last_name"
            type="text"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          />
        </div>
      </div>

      <!-- Address -->
      <div>
        <label for="address" class="block text-sm font-semibold text-gray-800 mb-2">
          Street Address
        </label>
        <input
          id="address"
          v-model="localProfile.address"
          type="text"
          class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          placeholder="123 Main Street, Apt 4B"
        />
      </div>

      <!-- City, State, Zip -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="city" class="block text-sm font-semibold text-gray-800 mb-2">
            City
          </label>
          <input
            id="city"
            v-model="localProfile.city"
            type="text"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            placeholder="New York"
          />
        </div>
        <div>
          <label for="state" class="block text-sm font-semibold text-gray-800 mb-2">
            State/Province
          </label>
          <input
            id="state"
            v-model="localProfile.state"
            type="text"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            placeholder="NY"
          />
        </div>
        <div>
          <label for="zip" class="block text-sm font-semibold text-gray-800 mb-2">
            ZIP/Postal Code
          </label>
          <input
            id="zip"
            v-model="localProfile.zip"
            type="text"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            placeholder="10001"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-semibold text-gray-800 mb-2">
          Email Address
        </label>
        <input
          id="email"
          v-model="localProfile.email"
          type="email"
          class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
          placeholder="your.email@example.com"
        />
      </div>

      <!-- Country -->
      <div>
        <label for="country" class="block text-sm font-semibold text-gray-800 mb-2">
          Country
        </label>
        <select
          id="country"
          v-model="localProfile.country"
          class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors bg-white"
        >
          <option value="">Select a country...</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="NL">Netherlands</option>
          <option value="SE">Sweden</option>
          <!-- Add more countries as needed -->
        </select>
      </div>

      <!-- Phone -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="phone-country-code" class="block text-sm font-semibold text-gray-800 mb-2">
            Country Code
          </label>
          <select
            id="phone-country-code"
            v-model="localProfile.phone_country_code"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors bg-white"
          >
            <option value="">Select...</option>
            <option value="+1">+1 (US/CA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+49">+49 (DE)</option>
            <option value="+33">+33 (FR)</option>
            <option value="+31">+31 (NL)</option>
            <option value="+46">+46 (SE)</option>
            <option value="+61">+61 (AU)</option>
            <!-- Add more country codes as needed -->
          </select>
        </div>
        <div class="md:col-span-2">
          <label for="phone" class="block text-sm font-semibold text-gray-800 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            v-model="localProfile.phone"
            type="tel"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <!-- Optional Information -->
      <div class="border-t border-gray-200 pt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Optional Information</h3>
        <p class="text-sm text-gray-600 mb-6">This information is optional but may be required by some employers</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Veteran Status -->
          <div>
            <label for="veteran-status" class="block text-sm font-semibold text-gray-800 mb-2">
              Veteran Status
            </label>
            <select
              id="veteran-status"
              v-model="localProfile.veteran_status"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors bg-white"
            >
              <option value="">Select...</option>
              <option value="None">None</option>
              <option value="Veteran">Veteran</option>
              <option value="Disabled Veteran">Disabled Veteran</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Disability Status -->
          <div>
            <label for="disability-status" class="block text-sm font-semibold text-gray-800 mb-2">
              Disability Status
            </label>
            <select
              id="disability-status"
              v-model="localProfile.disability_status"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors bg-white"
            >
              <option value="">Select...</option>
              <option value="None">None</option>
              <option value="Yes">Yes</option>
              <option value="Prefer not to disclose">Prefer not to disclose</option>
            </select>
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-semibold text-gray-800 mb-2">
              Gender
            </label>
            <select
              id="gender"
              v-model="localProfile.gender"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors bg-white"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to disclose">Prefer not to disclose</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  update: [value: any]
}>()

const localProfile = ref({ ...props.modelValue })

// Watch for external updates
watch(() => props.modelValue, (newValue) => {
  localProfile.value = { ...newValue }
}, { deep: true })

// Watch for local changes and emit updates
watch(localProfile, (newValue) => {
  emit('update', newValue)
}, { deep: true })
</script>