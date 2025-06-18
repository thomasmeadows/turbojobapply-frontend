<script setup lang="ts">
// No specific setup needed for this page
</script>

<template>
  <div class="min-h-screen bg-white py-16">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Accessibility Statement</h1>
        <p class="mt-4 text-lg text-gray-500">
          Last updated:
          {{
            new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </p>
      </div>

      <div class="prose prose-lg prose-primary mx-auto">
        <section>
          <h2>Our Commitment to Accessibility</h2>
          <p>
            At Turbo Job Apply, we are committed to ensuring that our website and services are accessible to all users, including those with disabilities. We strive to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA and to
            continually improve the user experience for everyone.
          </p>
          <div class="my-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div class="flex">
              <div class="shrink-0">
                <svg class="size-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Beta Notice</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>
                    We are currently in the alpha/beta testing phase of our company. While we strive for excellent accessibility, there may be issues or anomalies as we grow. We appreciate your patience and feedback during this development period. Any
                    major accessibility issues will be addressed before paid plans go live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>What We're Doing</h2>
          <p>To ensure our platform is accessible, we are working on:</p>
          <ul>
            <li>Ensuring sufficient color contrast throughout our site</li>
            <li>Adding alternative text to images</li>
            <li>Making our forms and interactive elements keyboard accessible</li>
            <li>Providing clear navigation and semantic structure</li>
            <li>Testing with assistive technologies</li>
            <li>Developing with accessibility in mind from the beginning</li>
          </ul>
        </section>

        <section>
          <h2>Feedback and Reporting Issues</h2>
          <p>We welcome your feedback on the accessibility of the Turbo Job Apply website and services. If you encounter any barriers or have suggestions for improvement, please let us know by:</p>
          <ul>
            <li>Emailing us at <a href="mailto:accessibility@turbojobapply.com">accessibility@turbojobapply.com</a></li>
            <li>Using the feedback form on our website</li>
            <li>Contacting our support team</li>
          </ul>
          <p>We take all feedback seriously and will respond as promptly as possible. Your input helps us identify areas for improvement and prioritize accessibility enhancements.</p>
        </section>

        <section>
          <h2>Known Issues</h2>
          <p>As we grow and develop our platform, we are aware of the following accessibility issues that we are working to address:</p>
          <ul>
            <li>Some form controls may not have explicit labels</li>
            <li>Certain dynamic content updates may not be properly announced to screen reader users</li>
            <li>Some interactive elements may not be fully keyboard accessible</li>
            <li>Mobile responsiveness may need improvement in certain views</li>
          </ul>
          <p>These issues are on our roadmap for improvement, and we are actively working to resolve them.</p>
        </section>

        <section>
          <h2>Third-Party Content</h2>
          <p>
            Our website may include third-party content or functionality that is not under our control. While we strive to work with partners who share our commitment to accessibility, we cannot guarantee that all third-party content will meet the same
            accessibility standards as our own.
          </p>
        </section>

        <section>
          <h2>Continuous Improvement</h2>
          <p>Accessibility is an ongoing process, and we are committed to continually improving the user experience for all visitors to our website. We regularly review our site for accessibility issues and work to address them as quickly as possible.</p>
          <p>Thank you for your support and understanding as we work to make Turbo Job Apply accessible to everyone.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>If you have questions, concerns, or feedback about accessibility on our website, please contact us at:</p>
          <p>
            <strong>Turbo Job Apply</strong><br />
            Email: accessibility@turbojobapply.com<br />
            Address: 123 Career Street, Suite 500, San Francisco, CA 94103, USA
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose h2 {
  @apply mb-4 mt-8 text-2xl font-bold text-gray-900;
}

.prose h3 {
  @apply mb-3 mt-6 text-xl font-bold text-gray-800;
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
</style>
