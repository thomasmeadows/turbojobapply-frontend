<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Form data
const formData = ref({
  company_name: '',
  contact_name: '',
  contact_email: '',
  ats_description: '',
})

// Form state
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

// Submit form
const submitForm = async () => {
  if (isSubmitting.value) return

  // Clear previous error
  errorMessage.value = ''

  // Basic validation
  if (!formData.value.company_name.trim()) {
    errorMessage.value = 'Company name is required'
    return
  }

  if (!formData.value.contact_name.trim()) {
    errorMessage.value = 'Contact name is required'
    return
  }

  if (!formData.value.contact_email.trim()) {
    errorMessage.value = 'Email is required'
    return
  }

  if (!formData.value.ats_description.trim()) {
    errorMessage.value = 'ATS description is required'
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.contact_email.trim())) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  isSubmitting.value = true

  try {
    await axios.post(`${API_URL}/api/ats-integration/request`, {
      company_name: formData.value.company_name.trim(),
      contact_name: formData.value.contact_name.trim(),
      contact_email: formData.value.contact_email.trim(),
      ats_description: formData.value.ats_description.trim(),
    })

    // Success
    isSubmitted.value = true

    // Reset form
    formData.value = {
      company_name: '',
      contact_name: '',
      contact_email: '',
      ats_description: '',
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Failed to submit request. Please try again.'
    }
    console.error('Failed to submit ATS integration request:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Close success message
const closeSuccessMessage = () => {
  isSubmitted.value = false
}
</script>

<template>
  <div class="min-h-screen bg-white py-16">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Employer Integrations</h1>
        <p class="mt-4 text-lg text-gray-500">Seamlessly connect your ATS with Turbo Job Apply</p>
      </div>

      <div class="prose prose-lg prose-primary mx-auto">
        <section>
          <div class="my-8 border-l-4 border-primary-400 bg-primary-50 p-6">
            <h2 class="mt-0 text-xl font-bold text-primary-800">Integration Capabilities</h2>
            <p class="mb-0 text-primary-700">
              Turbo Job Apply integrates with many popular Applicant Tracking Systems (ATS), making it easy for employers to receive and process applications. We're continuously working to expand our integration options to better serve your recruitment
              needs.
            </p>
          </div>
        </section>

        <section>
          <h2>Supported ATS Platforms</h2>
          <p>Our platform is designed to work seamlessly with industry-standard Applicant Tracking Systems, ensuring that applications submitted through Turbo Job Apply can be easily imported and managed within your existing recruiting workflow.
</p>

          <div class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto size-12 text-gray-700"
fill="none" viewBox="0 0 24 24" stroke="currentColor"
>
                <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
/>
              </svg>
              <h3 class="mt-4 font-semibold">Workday</h3>
            </div>

            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto size-12 text-gray-700"
fill="none" viewBox="0 0 24 24" stroke="currentColor"
>
                <path stroke-linecap="round" stroke-linejoin="round"
stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
/>
              </svg>
              <h3 class="mt-4 font-semibold">Greenhouse</h3>
            </div>

            <div class="rounded-lg bg-gray-50 p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto size-12 text-gray-700"
fill="none" viewBox="0 0 24 24" stroke="currentColor"
>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 class="mt-4 font-semibold">BambooHR</h3>
            </div>
          </div>

          <p class="mt-8">We're continuously expanding our integration capabilities. If you don't see your ATS listed here, please contact us to discuss compatibility options.
</p>
        </section>

        <section>
          <h2>How Our Integrations Work</h2>
          <p>Turbo Job Apply uses industry-standard APIs and data formats to ensure smooth data transfer between our platform and your ATS. When a candidate applies through our system:
</p>
          <ol>
            <li>Their application data is structured according to your ATS requirements</li>
            <li>Résumés and supporting documents are formatted appropriately</li>
            <li>All data is securely transferred to your ATS</li>
            <li>Your recruiting team can review applications within your familiar ATS interface</li>
          </ol>
          <p>This seamless integration means you can take advantage of Turbo Job Apply's efficient application process without disrupting your existing recruitment workflow.
</p>
        </section>

        <section>
          <h2>Custom ATS Integration</h2>
          <p>
            We understand that many organizations have custom-built or highly customized Applicant Tracking Systems tailored to their specific hiring processes. If you have a custom ATS solution that you'd like to integrate with Turbo Job Apply, we can
            work with you to develop a plan for implementation.
          </p>
          <p>Our development team can create custom integrations that connect your proprietary ATS with our platform, ensuring that applications flow smoothly into your system with all the necessary data formatting and processing.
</p>
          <div class="my-6 border-l-4 border-gray-400 bg-gray-50 p-4">
            <p class="mb-0 font-medium text-gray-700">For custom ATS integration work, please contact us directly to discuss your requirements, timeline, and to receive a custom quote for development and scheduled maintenance.
</p>
          </div>
        </section>

        <section>
          <h2>Benefits of Integration</h2>
          <p>By integrating your ATS with Turbo Job Apply, you gain several advantages:</p>
          <ul>
            <li><strong>Higher application completion rates</strong> - Our streamlined application process reduces drop-offs
</li>
            <li><strong>Better candidate experience</strong> - Applicants spend less time on tedious form-filling</li>
            <li><strong>Faster time-to-hire</strong> - Reduce administrative overhead in your recruitment process</li>
            <li><strong>Consistent data quality</strong> - Structured information flows directly into your system</li>
            <li><strong>Wider talent pool</strong> - Remove barriers that might discourage qualified candidates</li>
          </ul>
        </section>

        <section class="rounded-lg bg-gray-50 p-6">
          <h2 class="mt-0">Request Custom ATS Integration</h2>
          <p>If you're interested in developing a custom integration between your proprietary ATS and Turbo Job Apply, please provide your information below and we'll contact you to discuss your requirements.
</p>
          <div class="mt-6">
            <!-- Success Message -->
            <div v-if="isSubmitted"
class="mb-6 rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="shrink-0">
                  <svg class="size-5 text-green-400" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20" fill="currentColor"
>
                    <path fill-rule="evenodd"
d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"
/>
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="text-sm font-medium text-green-800">Request Submitted Successfully!</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Thank you for your interest in custom ATS integration. We will contact you within 24-48 hours to discuss your requirements.
</p>
                  </div>
                  <div class="mt-4">
                    <button class="rounded-md bg-green-50 p-2 text-sm text-green-800 hover:bg-green-100"
@click="closeSuccessMessage"
>
Dismiss
</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage"
class="mb-6 rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="shrink-0">
                  <svg class="size-5 text-red-400" xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 20 20" fill="currentColor"
>
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>

            <form class="space-y-4"
@submit.prevent="submitForm">
              <div>
                <label for="company"
class="block text-sm font-medium text-gray-700">Company Name <span class="text-red-500">*</span></label>
                <input
                  id="company"
                  v-model="formData.company_name"
                  type="text"
                  :disabled="isSubmitting"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 sm:text-sm"
                />
              </div>
              <div>
                <label for="name"
class="block text-sm font-medium text-gray-700">Contact Name <span class="text-red-500">*</span></label>
                <input
                  id="name"
                  v-model="formData.contact_name"
                  type="text"
                  :disabled="isSubmitting"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 sm:text-sm"
                />
              </div>
              <div>
                <label for="email"
class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                <input
                  id="email"
                  v-model="formData.contact_email"
                  type="email"
                  :disabled="isSubmitting"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 sm:text-sm"
                />
              </div>
              <div>
                <label for="ats"
class="block text-sm font-medium text-gray-700">ATS Description <span class="text-red-500">*</span></label>
                <textarea
                  id="ats"
                  v-model="formData.ats_description"
                  :disabled="isSubmitting"
                  required
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 sm:text-sm"
                  placeholder="Please describe your ATS system, including the name, version, and any specific integration requirements or challenges."
                />
              </div>
              <div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg v-if="isSubmitting" class="-ml-1 mr-2 size-4 animate-spin text-white"
xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
>
                    <circle class="opacity-25"
cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
/>
                  </svg>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-bold text-gray-800 mt-6 mb-3;
}

.prose ul,
.prose ol {
  @apply my-4 pl-8;
}

.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}

.prose li {
  @apply mb-2;
}

.prose section {
  @apply mb-8;
}

.prose a {
  @apply text-primary-600 hover:text-primary-800;
}

.prose strong {
  @apply font-bold;
}
</style>
