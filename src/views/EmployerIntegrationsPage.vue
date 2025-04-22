<script setup lang="ts">
// No specific setup needed for this page
</script>

<template>
  <div class="bg-white min-h-screen py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Employer Integrations</h1>
        <p class="mt-4 text-lg text-gray-500">Seamlessly connect your ATS with Turbo Job Apply</p>
      </div>

      <div class="prose prose-lg prose-primary mx-auto">
        <section>
          <div class="bg-primary-50 border-l-4 border-primary-400 p-6 my-8">
            <h2 class="text-xl font-bold text-primary-800 mt-0">Integration Capabilities</h2>
            <p class="text-primary-700 mb-0">
              Turbo Job Apply integrates with many popular Applicant Tracking Systems (ATS), making it easy for employers to 
              receive and process applications. We're continuously working to expand our integration options to better serve 
              your recruitment needs.
            </p>
          </div>
        </section>

        <section>
          <h2>Supported ATS Platforms</h2>
          <p>
            Our platform is designed to work seamlessly with industry-standard Applicant Tracking Systems, 
            ensuring that applications submitted through Turbo Job Apply can be easily imported and managed 
            within your existing recruiting workflow.
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 class="mt-4 font-semibold">Workday</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <h3 class="mt-4 font-semibold">Greenhouse</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 class="mt-4 font-semibold">Lever</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 class="mt-4 font-semibold">BambooHR</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <h3 class="mt-4 font-semibold">iCIMS</h3>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <h3 class="mt-4 font-semibold">Jobvite</h3>
            </div>
          </div>
          
          <p class="mt-8">
            We're continuously expanding our integration capabilities. If you don't see your ATS listed here, 
            please contact us to discuss compatibility options.
          </p>
        </section>

        <section>
          <h2>How Our Integrations Work</h2>
          <p>
            Turbo Job Apply uses industry-standard APIs and data formats to ensure smooth data transfer between 
            our platform and your ATS. When a candidate applies through our system:
          </p>
          <ol>
            <li>Their application data is structured according to your ATS requirements</li>
            <li>Résumés and supporting documents are formatted appropriately</li>
            <li>All data is securely transferred to your ATS</li>
            <li>Your recruiting team can review applications within your familiar ATS interface</li>
          </ol>
          <p>
            This seamless integration means you can take advantage of Turbo Job Apply's efficient application 
            process without disrupting your existing recruitment workflow.
          </p>
        </section>

        <section>
          <h2>Custom ATS Integration</h2>
          <p>
            We understand that many organizations have custom-built or highly customized Applicant Tracking Systems 
            tailored to their specific hiring processes. If you have a custom ATS solution that you'd like to integrate 
            with Turbo Job Apply, we can work with you to develop a plan for implementation.
          </p>
          <p>
            Our development team can create custom integrations that connect your proprietary ATS with our platform, 
            ensuring that applications flow smoothly into your system with all the necessary data formatting and 
            processing.
          </p>
          <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-6">
            <p class="text-gray-700 font-medium mb-0">
              For custom ATS integration work, please contact us directly to discuss your requirements, timeline, 
              and to receive a custom quote for development and scheduled maintenance.
            </p>
          </div>
        </section>

        <section>
          <h2>Benefits of Integration</h2>
          <p>
            By integrating your ATS with Turbo Job Apply, you gain several advantages:
          </p>
          <ul>
            <li><strong>Higher application completion rates</strong> - Our streamlined application process reduces drop-offs</li>
            <li><strong>Better candidate experience</strong> - Applicants spend less time on tedious form-filling</li>
            <li><strong>Faster time-to-hire</strong> - Reduce administrative overhead in your recruitment process</li>
            <li><strong>Consistent data quality</strong> - Structured information flows directly into your system</li>
            <li><strong>Wider talent pool</strong> - Remove barriers that might discourage qualified candidates</li>
          </ul>
        </section>

        <section class="bg-gray-50 p-6 rounded-lg">
          <h2 class="mt-0">Request Custom ATS Integration</h2>
          <p>
            If you're interested in developing a custom integration between your proprietary ATS and Turbo Job Apply, 
            please provide your information below and we'll contact you to discuss your requirements.
          </p>
          <div class="mt-6">
            <form class="space-y-4">
              <div>
                <label for="company" class="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="ats" class="block text-sm font-medium text-gray-700">ATS Description</label>
                <textarea
                  id="ats"
                  name="ats"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Please briefly describe your ATS system"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Submit Request
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

.prose ul, .prose ol {
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