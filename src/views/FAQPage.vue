<script setup lang="ts">
import { ref } from 'vue';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

const faqs = ref<FAQ[]>([
  {
    id: '1',
    question: 'What is Turbo Job Apply?',
    answer: 'At its core, Turbo Job Apply is an improved Job Board where you can find and apply for jobs.',
    isOpen: false
  },
  {
    id: '2',
    question: 'What is wrong with current job boards post 2025?',
    answer: '2025 has given rise to AI. This has created both good and bad. Features like Zip Apply, Quick Apply, and Easy Apply have created a system that only exist to harvest emails and data. Most of the jobs are fake because it is free to post these types of jobs. This problem is only amplified by the no-brainer AI swipe left and right software that lets you instant apply to these jobs which makes people who are hiring wary of using them.',
    isOpen: false
  },
  {
    id: '3',
    question: 'What makes Turbo Job Apply different?',
    answer: 'Turbo Job Apply\'s search engine solves the Zip, Quick, Easy Apply problem by only having ATS Solution Listed Jobs. We aggregate jobs from 9+ major ATS platforms with daily updates, going out to get 100% real jobs from ATS solutions around the web for you to apply to.',
    isOpen: false
  },
  {
    id: '4',
    question: 'Why are Turbo Job Apply\'s postings more likely to be real?',
    answer: 'The theory is, since businesses pay top dollar for applicant tracking systems, these have a very low probability of being fake job postings. Paying even a small amount is a good way to filter out bots and cheesy swipe applications that trick your brain into thinking you\'re applying for a lot of jobs when in reality you\'re just giving away your information for data harvesting.',
    isOpen: false
  },
  {
    id: '5',
    question: 'What does Turbo Job Apply get out of it?',
    answer: 'Nothing, unless you would like to upgrade to premium features that help you apply to jobs faster. We can\'t quite get the magic of swipe left and right yet, but were working on it. We have lots of cool features planned out.',
    isOpen: false
  },
  {
    id: '6',
    question: 'How do I search for jobs?',
    answer: 'Use our advanced search filters to find jobs by location, company, remote work options, and ATS source. You can search across multiple platforms including BambooHR, Workday, GreenhouseIO, ADP, Jobvite, Breezy, Lever, SmartRecruiters, and Dover.',
    isOpen: false
  },
  {
    id: '7',
    question: 'Can I save jobs to apply later?',
    answer: 'Yes! You can bookmark any job listing and access your saved jobs from your dashboard. This feature works across all ATS sources and requires a free account.',
    isOpen: false
  },
  {
    id: '8',
    question: 'What are the premium features?',
    answer: 'Premium features include unlimited job profiles, advanced search filters, priority customer support, enhanced application tracking, and early access to new features like Turbo Apply. Premium members also get access to beta features as they become available.',
    isOpen: false
  },
  {
    id: '9',
    question: 'How much does premium cost?',
    answer: 'Premium subscriptions are $19.99/month. You can cancel anytime and retain access until the end of your billing period.',
    isOpen: false
  },
  {
    id: '10',
    question: 'Which ATS platforms do you support?',
    answer: 'We currently support 9 major ATS platforms: BambooHR, Workday, GreenhouseIO, ADP Workforce Now, Jobvite, Breezy, Lever, SmartRecruiters, and Dover. We\'re continuously adding new platforms based on user demand.',
    isOpen: false
  },
  {
    id: '11',
    question: 'How often are job postings updated?',
    answer: 'We strive to add new jobs daily since it is important to apply as quickly as possible. Unfortunately some jobs take up to a week to appear from posting.',
    isOpen: false
  },
  {
    id: '12',
    question: 'Can I apply directly through Turbo Job Apply?',
    answer: 'This feature is currently in development. When available, you\'ll see a \'Turbo Apply\' button that will auto-fill applications using your job profile information.',
    isOpen: false
  },
  {
    id: '13',
    question: 'Do you support international job searches?',
    answer: 'If the job poster correctly indicated a country outside the US and it was parsable.',
    isOpen: false
  },
  {
    id: '14',
    question: 'How do I create a job profile?',
    answer: 'Navigate to the Job Profiles section in your dashboard after creating an account. You can create multiple profiles for different career paths (premium users get unlimited profiles, free users get 1). Fill out your contact information, job preferences, skills, and work experience. You can also upload your resume and cover letter files. Premium users can create unlimited profiles while free users are limited to one profile.',
    isOpen: false
  },
  {
    id: '15',
    question: 'Why do I need to create an account?',
    answer: 'You don\'t need to create an account unless you would like to bookmark jobs and apply for jobs faster with job profiles and turbo apply.',
    isOpen: false
  },
  {
    id: '16',
    question: 'How is my data protected and used?',
    answer: 'We don\'t sell your data, it is kept private. Only your email might be known to partners such as stripe for payments. We delete all data on request per compliance with GDPR.',
    isOpen: false
  },
  {
    id: '17',
    question: 'How do I log in without a password?',
    answer: 'We use magic link authentication for security and convenience. Simply enter your email address, and we\'ll send you a secure login link. Click the link in your email to instantly log in - no password required.',
    isOpen: false
  },
  {
    id: '18',
    question: 'Can I log in with LinkedIn?',
    answer: 'Yes! You can use LinkedIn OAuth to log in with your professional profile. This option is available on the login page and helps pre-populate some of your profile information.',
    isOpen: false
  },
  {
    id: '19',
    question: 'How long do I stay logged in?',
    answer: 'Your session will automatically refresh and keep you logged in for convenience. Sessions are managed securely with JWT tokens and will expire after extended periods of inactivity.',
    isOpen: false
  },
  {
    id: '20',
    question: 'What browsers do you support?',
    answer: 'Turbo Job Apply works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience.',
    isOpen: false
  },
  {
    id: '21',
    question: 'I found a bug or have feedback, how do I report it?',
    answer: 'We appreciate your feedback! You can report bugs or share suggestions by contacting us through the About page. We actively monitor and respond to all feedback to improve the platform.',
    isOpen: false
  },
  {
    id: '22',
    question: 'How do I contact customer support?',
    answer: 'You can reach our customer support team through the contact information provided on our About page. Premium users receive priority support with faster response times.',
    isOpen: false
  },
  {
    id: '23',
    question: 'How do I know if a job posting is still active?',
    answer: 'We automatically remove stale job postings that are older than 7 days or no longer available on the original ATS platform. If you can see a job listing, it should still be active and accepting applications.',
    isOpen: false
  },
  {
    id: '24',
    question: 'Can I track my job applications?',
    answer: 'Application tracking is available through the Application History section in your dashboard. This feature helps you keep track of jobs you\'ve applied to and their status.',
    isOpen: false
  },
  {
    id: '25',
    question: 'What information do employers see about me?',
    answer: 'Employers only see the information you choose to share when applying through their ATS platform. Turbo Job Apply doesn\'t share your personal data with employers - you control what information to include in your applications.',
    isOpen: false
  },
  {
    id: '26',
    question: 'Can I delete my account and data?',
    answer: 'Yes, you can request account deletion at any time. We comply with GDPR and will permanently delete all your personal data within 30 days of your request. Contact us through the about page to initiate account deletion.',
    isOpen: false
  },
  {
    id: '27',
    question: 'What happens to my bookmarks if I don\'t upgrade to premium?',
    answer: 'Your bookmarks are saved permanently regardless of your account type. Free users can bookmark unlimited jobs - premium features focus on job profiles and application tools, not basic bookmark functionality.',
    isOpen: false
  },
  {
    id: '28',
    question: 'How accurate are the job locations and remote status?',
    answer: 'We parse location and remote status directly from the original ATS postings. Accuracy depends on how well the employer filled out their job posting. We use advanced parsing to detect remote positions from job titles and descriptions.',
    isOpen: false
  },
  {
    id: '29',
    question: 'Can I get notified about new jobs?',
    answer: 'Job notifications are a planned feature. Currently, we recommend bookmarking your searches and checking back regularly since we add new jobs daily.',
    isOpen: false
  }
]);

const toggleFAQ = (id: string) => {
  const faq = faqs.value.find(f => f.id === id);
  if (faq) {
    faq.isOpen = !faq.isOpen;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p class="mt-4 text-lg text-gray-600">
          Find answers to common questions about Turbo Job Apply
        </p>
      </div>

      <!-- FAQ List -->
      <div class="mt-12 space-y-4">
        <div
          v-for="faq in faqs"
          :key="faq.id"
          class="overflow-hidden rounded-lg bg-white shadow"
        >
          <button
            class="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            @click="toggleFAQ(faq.id)"
          >
            <span class="text-lg font-medium text-gray-900">
              {{ faq.question }}
            </span>
            <svg
              class="size-5 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': faq.isOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="faq.isOpen"
            class="border-t border-gray-200 px-6 py-4"
          >
            <p class="text-gray-700 leading-relaxed">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-16 rounded-lg bg-blue-50 p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900">
          Still have questions?
        </h2>
        <p class="mt-2 text-gray-600">
          Can't find what you're looking for? We're here to help.
        </p>
        <div class="mt-6">
          <router-link
            to="/about"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Contact Us
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>