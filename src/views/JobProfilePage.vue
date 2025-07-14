<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <!-- Header Section -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900">Job Profiles</h1>
            <p class="mt-3 text-lg text-gray-600">
              Create and manage profiles for different career paths
            </p>
          </div>

          <!-- Profile Selector and Actions -->
          <div class="flex items-center space-x-6 mb-6">
            <!-- Profile Dropdown -->
            <div v-if="profiles.length > 0" class="relative flex-1">
              <select
                v-model="selectedProfileId"
                class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="handleProfileChange"
              >
                <option value="">Select a profile...</option>
                <option
                  v-for="profile in profiles"
                  :key="profile.id"
                  :value="profile.id"
                >
                  {{ profile.profile_name }}
                  <span v-if="profile.desired_job_title">
                    - {{ profile.desired_job_title }}</span
                  >
                </option>
              </select>
            </div>

            <!-- Spacer when no dropdown (pushes buttons to the right) -->
            <div v-if="profiles.length === 0" class="flex-1"></div>

            <!-- Create New Profile Button Group -->
            <div class="flex items-center space-x-3 flex-shrink-0">
              <!-- Resume Upload Drop Box -->
              <ResumeDropBox 
                :can-create-profile="canCreateProfile"
                @profile-created="handleResumeProfileCreated" 
              />

              <!-- Create New Profile Button -->
              <button
                :disabled="!canCreateProfile"
                class="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
                @click="showCreateModal = true"
              >
                <svg
                  class="-ml-1 mr-2 size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Profile
              </button>
            </div>
          </div>

          <!-- Premium Limitation Notice -->
          <div
            v-if="!canCreateProfile && !authStore.isPremium"
            class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6"
          >
            <div class="flex">
              <svg
                class="size-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-amber-800">
                  Profile Limit Reached
                </h3>
                <p class="mt-2 text-sm text-amber-700">
                  Free users are limited to 1 job profile.
                  <router-link
                    to="/subscription"
                    class="font-medium underline hover:text-amber-600"
                  >
                    Upgrade to premium
                  </router-link>
                  for unlimited profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="profiles.length === 0 && !loading" class="py-16">
        <!-- Resume Upload Area -->
        <div class="mx-auto max-w-lg">
          <div class="mb-8 text-center">
            <svg
              class="mx-auto h-16 w-16 text-blue-500"
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
            <h3 class="mt-4 text-xl font-semibold text-gray-900">
              Upload Your Resume
            </h3>
            <p class="mt-2 text-gray-600">
              Get started quickly by uploading your resume. We'll extract your
              information and create a job profile automatically.
            </p>
          </div>

          <!-- Upload Drop Zone -->
          <div
            class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400"
            :class="{
              'border-blue-400 bg-blue-50': isDragOver,
              'border-green-400 bg-green-50': uploadedFile
            }"
            @click="triggerFileInput"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleFileDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf"
              class="hidden"
              @change="handleFileSelect"
            />

            <div v-if="!uploadedFile">
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
              <div class="mt-4">
                <p class="text-lg font-medium text-gray-900">
                  Drop your resume here or
                  <span class="text-blue-600">click to browse</span>
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  PDF files only, max 1MB
                </p>
              </div>
            </div>

            <div v-else class="flex items-center justify-center space-x-3">
              <svg
                class="h-8 w-8 text-green-500"
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
              <div>
                <p class="text-lg font-medium text-gray-900">
                  {{ uploadedFile.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(uploadedFile.size) }}
                </p>
              </div>
              <button
                type="button"
                class="text-sm text-blue-600 hover:text-blue-500"
                @click.stop="clearFile"
              >
                Change
              </button>
            </div>
          </div>

          <!-- Profile Name Input -->
          <div v-if="uploadedFile" class="mt-6">
            <label
              for="profile-name"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Profile Name
            </label>
            <input
              id="profile-name"
              v-model="profileName"
              type="text"
              placeholder="e.g., Software Engineer Profile"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Action Buttons -->
          <div v-if="uploadedFile" class="mt-6 flex space-x-3">
            <button
              type="button"
              :disabled="uploadLoading || !profileName.trim()"
              class="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
              @click="handleResumeUpload"
            >
              <svg
                v-if="uploadLoading"
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
              {{
                uploadLoading
                  ? 'Creating Profile...'
                  : 'Create Profile from Resume'
              }}
            </button>

            <button
              type="button"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="showCreateModal = true"
            >
              Start from Scratch
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="mt-4 rounded-md bg-red-50 p-4">
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
                <p class="text-sm text-red-800">{{ uploadError }}</p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="uploadSuccess" class="mt-4 rounded-md bg-green-50 p-4">
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
                <p class="text-sm text-green-800">{{ uploadSuccess }}</p>
              </div>
            </div>
          </div>

          <!-- Alternative Option -->
          <div v-if="!uploadedFile" class="mt-8 text-center">
            <p class="mb-4 text-sm text-gray-500">
              Don't have a resume ready? No problem.
            </p>
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              @click="showCreateModal = true"
            >
              <svg
                class="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Profile from Scratch
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Editor -->
      <div v-else-if="selectedProfile" class="flex gap-10">
        <!-- Context Menu Sidebar -->
        <div class="w-72 shrink-0">
          <nav class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="p-6">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">
                Profile Sections
              </h3>
              <ul class="space-y-2">
                <li>
                  <button
                    :class="[
                      'w-full rounded-lg px-4 py-3 text-left text-base transition-colors',
                      activeSection === 'contact'
                        ? 'bg-blue-100 font-medium text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                    @click="activeSection = 'contact'"
                  >
                    <svg
                      class="mr-3 inline-block size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Contact Information
                  </button>
                </li>
                <li>
                  <button
                    :class="[
                      'w-full rounded-lg px-4 py-3 text-left text-base transition-colors',
                      activeSection === 'job-info'
                        ? 'bg-blue-100 font-medium text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                    @click="activeSection = 'job-info'"
                  >
                    <svg
                      class="mr-3 inline-block size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                      />
                    </svg>
                    Job Information
                  </button>
                </li>
                <li>
                  <button
                    :class="[
                      'w-full rounded-lg px-4 py-3 text-left text-base transition-colors',
                      activeSection === 'skills'
                        ? 'bg-blue-100 font-medium text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                    @click="activeSection = 'skills'"
                  >
                    <svg
                      class="mr-3 inline-block size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Skills
                    <span
                      v-if="selectedProfile.skills"
                      class="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-1 text-xs font-bold leading-none text-blue-600"
                    >
                      {{ selectedProfile.skills.length }}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    :class="[
                      'w-full rounded-lg px-4 py-3 text-left text-base transition-colors',
                      activeSection === 'experience'
                        ? 'bg-blue-100 font-medium text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                    @click="activeSection = 'experience'"
                  >
                    <svg
                      class="mr-3 inline-block size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Experience
                    <span
                      v-if="selectedProfile.experience"
                      class="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-1 text-xs font-bold leading-none text-blue-600"
                    >
                      {{ selectedProfile.experience.length }}
                    </span>
                  </button>
                </li>
              </ul>

              <!-- ATS Settings Section -->
              <div class="mt-8 border-t border-gray-200 pt-6">
                <h4
                  class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900"
                >
                  ATS Settings
                </h4>
                <p class="mb-4 text-xs text-gray-500">
                  Configure specific settings for each ATS. These settings may
                  be required for individual job applications.
                </p>
                <ul class="space-y-1">
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-bamboohr'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-bamboohr'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      BambooHR
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-workday'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-workday'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Workday
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-greenhouse'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-greenhouse'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      GreenhouseIO
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-adp'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-adp'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      ADP
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-jobvite'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-jobvite'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Jobvite
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-breezy'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-breezy'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Breezy
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-lever'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-lever'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Lever
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-smartrecruiters'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-smartrecruiters'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      SmartRecruiters
                    </button>
                  </li>
                  <li>
                    <button
                      :class="[
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        activeSection === 'ats-dover'
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                      @click="activeSection = 'ats-dover'"
                    >
                      <svg
                        class="mr-2 inline-block size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Dover
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Profile Actions -->
            <div class="border-t border-gray-200 p-6">
              <div class="space-y-3">
                <button
                  :disabled="saving"
                  class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300"
                  @click="saveProfile"
                >
                  <svg
                    v-if="saving"
                    class="-ml-1 mr-2 size-5 animate-spin text-white"
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
                  <svg
                    v-else
                    class="-ml-1 mr-2 size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ saving ? 'Saving...' : 'Save Profile' }}
                </button>

                <button
                  class="inline-flex w-full items-center justify-center rounded-lg border border-red-300 bg-white px-6 py-3 text-base font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  @click="showDeleteModal = true"
                >
                  <svg
                    class="-ml-1 mr-2 size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m7 0H4"
                    />
                  </svg>
                  Delete Profile
                </button>
              </div>
            </div>
          </nav>
        </div>

        <!-- Form Content Area -->
        <div class="flex-1">
          <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <!-- Contact Information Section -->
            <ContactInformationSection
              v-if="activeSection === 'contact'"
              v-model="selectedProfile"
            />

            <!-- Job Information Section -->
            <JobInformationSection
              v-if="activeSection === 'job-info'"
              v-model="selectedProfile"
            />

            <!-- Skills Section -->
            <SkillsSection
              v-if="activeSection === 'skills'"
              v-model="selectedProfile"
            />

            <!-- Experience Section -->
            <ExperienceSection
              v-if="activeSection === 'experience'"
              v-model="selectedProfile"
            />

            <!-- ATS Settings Sections -->
            <div v-if="activeSection === 'ats-adp'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  ADP Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for ADP job applications. These
                  settings may be required when applying to jobs through ADP's
                  Workforce Now system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    ADP-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-bamboohr'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  BambooHR Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for BambooHR job applications.
                  These settings may be required when applying to jobs through
                  BambooHR's system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    BambooHR-specific settings will be available here in a
                    future update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-breezy'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  Breezy Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for Breezy job applications. These
                  settings may be required when applying to jobs through
                  Breezy's system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    Breezy-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-dover'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  Dover Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for Dover job applications. These
                  settings may be required when applying to jobs through Dover's
                  system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    Dover-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-greenhouse'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  GreenhouseIO Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for GreenhouseIO job applications.
                  These settings may be required when applying to jobs through
                  Greenhouse's system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    GreenhouseIO-specific settings will be available here in a
                    future update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-jobvite'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  Jobvite Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for Jobvite job applications.
                  These settings may be required when applying to jobs through
                  Jobvite's system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    Jobvite-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-lever'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  Lever Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for Lever job applications. These
                  settings may be required when applying to jobs through Lever's
                  system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    Lever-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-smartrecruiters'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  SmartRecruiters Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for SmartRecruiters job
                  applications. These settings may be required when applying to
                  jobs through SmartRecruiters' system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    SmartRecruiters-specific settings will be available here in
                    a future update.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'ats-workday'">
              <div class="max-w-3xl">
                <h2 class="mb-4 text-2xl font-bold text-gray-900">
                  Workday Settings
                </h2>
                <p class="mb-6 text-gray-600">
                  Configure specific settings for Workday job applications.
                  These settings may be required when applying to jobs through
                  Workday's system.
                </p>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p class="text-center text-gray-500">
                    Workday-specific settings will be available here in a future
                    update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Profile Modal -->
    <CreateProfileModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProfileCreated"
    />

    <!-- Delete Profile Modal -->
    <DeleteProfileModal
      v-if="showDeleteModal"
      :profile="selectedProfile"
      @close="showDeleteModal = false"
      @deleted="handleProfileDeleted"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <svg
        class="size-8 animate-spin text-blue-600"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useJobProfilesStore } from '@/stores/jobProfiles';
import { useRouter } from 'vue-router';

// Import section components (these will be created next)
import ContactInformationSection from '@/components/job-profiles/ContactInformationSection.vue';
import JobInformationSection from '@/components/job-profiles/JobInformationSection.vue';
import SkillsSection from '@/components/job-profiles/SkillsSection.vue';
import ExperienceSection from '@/components/job-profiles/ExperienceSection.vue';
import CreateProfileModal from '@/components/job-profiles/CreateProfileModal.vue';
import DeleteProfileModal from '@/components/job-profiles/DeleteProfileModal.vue';
import ResumeDropBox from '@/components/job-profiles/ResumeDropBox.vue';

// Stores and routing
const authStore = useAuthStore();
const jobProfilesStore = useJobProfilesStore();
const router = useRouter();

// Local UI state only
const activeSection = ref('contact');
const showCreateModal = ref(false);
const showDeleteModal = ref(false);

// Resume upload state
const uploadedFile = ref<File | null>(null);
const profileName = ref('');
const isDragOver = ref(false);
const uploadLoading = ref(false);
const uploadError = ref('');
const uploadSuccess = ref('');

// File input ref
const fileInput = ref<HTMLInputElement>();

// Computed properties using the store
const profiles = computed(() => jobProfilesStore.profiles);
const selectedProfile = computed(() => jobProfilesStore.selectedProfile);
const selectedProfileId = computed({
  get: () => jobProfilesStore.selectedProfileId,
  set: (value: string) => jobProfilesStore.selectProfile(value)
});
const loading = computed(() => jobProfilesStore.loading);
const saving = computed(() => jobProfilesStore.saving);
const canCreateProfile = computed(() => jobProfilesStore.canCreateProfile);

// Methods using the store
const handleProfileChange = () => {
  if (selectedProfileId.value) {
    jobProfilesStore.selectProfile(selectedProfileId.value);
  }
};

const saveProfile = async () => {
  if (!selectedProfile.value) return;

  const success = await jobProfilesStore.updateProfile(
    selectedProfile.value.id,
    selectedProfile.value
  );
  if (success) {
    // Show success message
    console.log('Profile saved successfully');
  } else {
    // Show error message
    console.error('Failed to save profile:', jobProfilesStore.error);
  }
};

const handleProfileCreated = () => {
  showCreateModal.value = false;
  // The store will handle updating the profiles list and selecting the new profile
};

const handleProfileDeleted = () => {
  showDeleteModal.value = false;
  // The store will handle removing the profile and updating selection
};

const handleResumeProfileCreated = (profile: any) => {
  // Refresh the profiles list to include the new profile
  jobProfilesStore.fetchProfiles();
  // Auto-select the new profile
  jobProfilesStore.selectProfile(profile.id);
};

// Resume upload methods
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileDrop = (event: DragEvent) => {
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
  uploadError.value = '';

  // Validate file type
  if (file.type !== 'application/pdf') {
    uploadError.value = 'Only PDF files are supported for resume parsing.';
    return;
  }

  // Validate file size (1MB limit)
  if (file.size > 1048576) {
    uploadError.value = 'File size must be less than 1MB.';
    return;
  }

  uploadedFile.value = file;

  // Auto-generate profile name if empty
  if (!profileName.value.trim()) {
    const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    profileName.value = `${baseName} Profile`;
  }
};

const clearFile = () => {
  uploadedFile.value = null;
  profileName.value = '';
  uploadError.value = '';
  uploadSuccess.value = '';
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

const handleResumeUpload = async () => {
  if (!profileName.value.trim()) {
    uploadError.value = 'Profile name is required.';
    return;
  }

  if (!uploadedFile.value) {
    uploadError.value = 'Please select a PDF file to upload.';
    return;
  }

  uploadLoading.value = true;
  uploadError.value = '';
  uploadSuccess.value = '';

  try {
    const formData = new FormData();
    formData.append('file', uploadedFile.value);
    formData.append('profile_name', profileName.value.trim());

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/job-profiles/parse-resume`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: formData
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      const { profile, parsedData } = data;
      uploadSuccess.value = `Profile created successfully! Extracted ${parsedData.fieldsExtracted} fields, ${parsedData.skillsFound} skills, and ${parsedData.experienceEntries} work experiences.`;

      // Refresh profiles and select the new one
      await jobProfilesStore.fetchProfiles();
      jobProfilesStore.selectProfile(profile.id);

      // Clear the upload state after a brief delay
      setTimeout(() => {
        clearFile();
        uploadSuccess.value = '';
      }, 3000);
    } else {
      uploadError.value =
        data.error ||
        'Failed to parse resume and create profile. Please try again.';
    }
  } catch (err: any) {
    console.error('Resume upload error:', err);
    uploadError.value =
      'Failed to parse resume and create profile. Please try again.';
  } finally {
    uploadLoading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await router.push('/login');
    return;
  }

  await jobProfilesStore.fetchProfiles();
});
</script>
