<script setup lang="ts">
// No specific setup needed for this page
</script>

<template>
  <div class="min-h-screen bg-white py-16">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Cookie Policy
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Last updated:
          {{
            new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }}
        </p>
      </div>

      <div class="prose prose-lg prose-primary mx-auto">
        <section>
          <h2>Introduction</h2>
          <p>
            This Cookie Policy explains how Turbo Job Apply ("we", "us", "our")
            uses cookies and similar technologies on our website and
            application. This policy is designed to help you understand what
            cookies are, how we use them, and the choices you have regarding
            their use.
          </p>
          <p>
            By using or accessing our Platform, you agree to the use of cookies
            as described in this Cookie Policy. This policy should be read
            alongside our Privacy Policy, which explains how we use your
            personal information.
          </p>
        </section>

        <section>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device
            (computer, tablet, or mobile) when you visit a website. They allow
            the website to recognize your device and remember information about
            your visit, such as your preferences or login information.
          </p>
          <p>
            Cookies are widely used to make websites work more efficiently, as
            well as to provide information to the owners of the site. They help
            make the user's experience smoother by:
          </p>
          <ul>
            <li>Remembering your preferences and settings</li>
            <li>Keeping you logged in</li>
            <li>Helping us understand how you use our website</li>
            <li>Improving your experience based on your previous visits</li>
            <li>Showing you relevant content and advertisements</li>
          </ul>
        </section>

        <section>
          <h2>Types of Cookies We Use</h2>
          <p>
            We use different types of cookies for various purposes. Depending on
            their function and purpose, cookies can be classified as:
          </p>

          <h3>Essential/Necessary Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly.
            They enable core functionality such as security, network management,
            and accessibility. You may disable these by changing your browser
            settings, but this may affect how the website functions.
          </p>

          <h3>Performance/Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our
            website by collecting and reporting information anonymously. They
            help us improve the way our website works by collecting information
            about how you use it.
          </p>

          <h3>Functionality Cookies</h3>
          <p>
            These cookies enable the website to provide enhanced functionality
            and personalization. They may be set by us or by third-party
            providers whose services we have added to our pages.
          </p>

          <h3>Targeting/Advertising Cookies</h3>
          <p>
            These cookies are used to build a profile of your interests and show
            you relevant advertisements on other sites. They remember that you
            have visited our website and may share this information with other
            organizations, such as advertisers.
          </p>
        </section>

        <section>
          <h2>Cookies We Use</h2>
          <p>Here is a detailed list of the cookies we use on our website:</p>

          <table class="my-4 w-full border-collapse border border-gray-200">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-200 px-4 py-2 text-left">Name</th>
                <th class="border border-gray-200 px-4 py-2 text-left">Type</th>
                <th class="border border-gray-200 px-4 py-2 text-left">
                  Purpose
                </th>
                <th class="border border-gray-200 px-4 py-2 text-left">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-200 px-4 py-2">auth_session</td>
                <td class="border border-gray-200 px-4 py-2">Essential</td>
                <td class="border border-gray-200 px-4 py-2">
                  Maintains your login session
                </td>
                <td class="border border-gray-200 px-4 py-2">Session</td>
              </tr>
              <tr>
                <td class="border border-gray-200 px-4 py-2">cookie_consent</td>
                <td class="border border-gray-200 px-4 py-2">Essential</td>
                <td class="border border-gray-200 px-4 py-2">
                  Saves your cookie preferences
                </td>
                <td class="border border-gray-200 px-4 py-2">1 year</td>
              </tr>
              <tr>
                <td class="border border-gray-200 px-4 py-2">_ga</td>
                <td class="border border-gray-200 px-4 py-2">Analytics</td>
                <td class="border border-gray-200 px-4 py-2">
                  Used by Google Analytics to distinguish users
                </td>
                <td class="border border-gray-200 px-4 py-2">2 years</td>
              </tr>
              <tr>
                <td class="border border-gray-200 px-4 py-2">_gid</td>
                <td class="border border-gray-200 px-4 py-2">Analytics</td>
                <td class="border border-gray-200 px-4 py-2">
                  Used by Google Analytics to distinguish users
                </td>
                <td class="border border-gray-200 px-4 py-2">24 hours</td>
              </tr>
              <tr>
                <td class="border border-gray-200 px-4 py-2">
                  user_preferences
                </td>
                <td class="border border-gray-200 px-4 py-2">Functionality</td>
                <td class="border border-gray-200 px-4 py-2">
                  Saves your preferences for job search filters
                </td>
                <td class="border border-gray-200 px-4 py-2">30 days</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third parties on our website. These third
            parties include:
          </p>
          <ul>
            <li>Analytics providers (like Google Analytics)</li>
            <li>Social media platforms (if you use social sharing features)</li>
            <li>Advertising partners (if applicable)</li>
          </ul>
          <p>
            These third parties may use cookies, pixel tags, and similar
            technologies to collect or receive information from our website and
            elsewhere on the internet. They use this information to provide
            measurement services and target ads.
          </p>
        </section>

        <section>
          <h2>Your Cookie Choices and How to Manage Cookies</h2>
          <p>
            When you first visit our website, we will ask for your consent to
            use non-essential cookies through a cookie banner. You can choose to
            accept all cookies, reject non-essential cookies, or select your
            preferences for different types of cookies.
          </p>
          <p>You can change your cookie preferences at any time by:</p>
          <ul>
            <li>
              Using our cookie preference center (accessible via the "Cookie
              Settings" link in our website footer)
            </li>
            <li>Adjusting your browser settings to block or delete cookies</li>
          </ul>
          <p>
            Most web browsers allow you to manage your cookie preferences. You
            can:
          </p>
          <ul>
            <li>Delete cookies from your device</li>
            <li>
              Block cookies by activating the setting on your browser that
              allows you to refuse all or some cookies
            </li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, you may
            not be able to access certain areas or features of our website, and
            some services may not function properly.
          </p>
          <p>
            Here are links to instructions on how to manage cookies in common
            browsers:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                >Google Chrome</a
              >
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
                >Mozilla Firefox</a
              >
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                >Safari</a
              >
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                >Microsoft Edge</a
              >
            </li>
          </ul>
        </section>

        <section>
          <h2>EU Cookie Law Compliance</h2>
          <p>
            We comply with applicable EU laws regarding cookies, including the
            ePrivacy Directive (Cookie Law) and the General Data Protection
            Regulation (GDPR). In accordance with these laws:
          </p>
          <ul>
            <li>
              We obtain your informed consent before placing non-essential
              cookies on your device
            </li>
            <li>
              We provide clear and comprehensive information about the cookies
              we use
            </li>
            <li>
              We make it easy for you to withdraw your consent and manage your
              cookie preferences
            </li>
            <li>
              We only use strictly necessary cookies without consent, as they
              are required for the proper functioning of our website
            </li>
          </ul>
        </section>

        <section>
          <h2>Cookie Consent</h2>
          <p>
            According to the EU Cookie Law, we are required to obtain your
            consent for all non-essential cookies. When you first visit our
            website, you will see a cookie banner asking for your consent. You
            can choose to:
          </p>
          <ul>
            <li>Accept all cookies</li>
            <li>Reject non-essential cookies</li>
            <li>Customize your preferences</li>
          </ul>
          <p>
            Your consent preferences are stored in a cookie, so we know your
            choice the next time you visit. You can change your preferences at
            any time through our cookie preference center.
          </p>
        </section>

        <section>
          <h2>Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time to reflect changes
            in technology, regulation, or our business practices. Any changes
            will be posted on this page with an updated "Last updated" date.
          </p>
          <p>
            We encourage you to check this policy regularly for any changes.
            Your continued use of our website after changes have been posted
            constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or comments about our Cookie Policy or our
            data practices, please contact us at:
          </p>
          <p>
            <strong>Turbo Job Apply</strong><br />
            Email: privacy@turbojobapply.com<br />
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

.prose table {
  @apply my-4 w-full border-collapse border border-gray-300;
}

.prose table th {
  @apply border border-gray-300 bg-gray-100 px-4 py-2 text-left;
}

.prose table td {
  @apply border border-gray-300 px-4 py-2;
}

.prose a {
  @apply text-primary-600 hover:text-primary-800;
}
</style>
