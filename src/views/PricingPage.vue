<script setup lang="ts">
// No specific setup needed for this page
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner for temporary free pricing -->
    <div class="bg-primary-600 py-4 text-white">
      <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-lg font-medium">
          <span class="inline-flex items-center">
            <svg class="mr-2 size-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            Limited Time Offer: All Premium Features Free During Beta Testing
          </span>
        </p>
      </div>
    </div>

    <!-- Page header -->
    <div class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
            Pricing Plans
          </h1>
          <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Premium features to supercharge your job search, currently available
            for free during our testing phase.
          </p>
        </div>
      </div>
    </div>

    <!-- Beta testing explanation -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-12 rounded-lg border border-accent-200 bg-accent-50 p-6">
        <h2 class="mb-3 text-xl font-bold text-accent-800">
          Alpha & Beta Testing Phase
        </h2>
        <p class="text-accent-700">
          While Turbo Job Apply is undergoing alpha and beta testing, we're
          offering all paid features completely free of charge. This allows us
          to gather valuable feedback while giving you access to our premium
          tools without any cost. Normal pricing will be implemented once we
          exit the beta testing phase.
        </p>
      </div>
    </div>

    <!-- Pricing cards -->
    <div class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-2">
        <!-- Free tier -->
        <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h2 class="text-2xl font-bold text-gray-900">Free</h2>
          <p class="mt-4 text-gray-500">
            Basic job search and application features.
          </p>
          <p class="mt-8">
            <span class="text-4xl font-extrabold text-gray-900">$0</span>
            <span class="text-base font-medium text-gray-500">/month</span>
          </p>
          <ul class="mt-8 space-y-4">
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">Job search</p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">Save jobs</p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">Basic profile</p>
            </li>
          </ul>
        </div>

        <!-- Premium tier (currently free) -->
        <div
          class="relative rounded-lg border-2 border-primary-500 bg-white p-8 shadow-lg"
        >
          <div
            class="absolute right-0 top-0 -mt-4 mr-8 rounded-full bg-accent-500 px-4 py-1 text-sm font-bold text-white"
          >
            Currently Free!
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Premium</h2>
          <p class="mt-4 text-gray-500">
            Advanced features to accelerate your job search.
          </p>
          <p class="mt-8">
            <span class="text-4xl font-extrabold text-gray-900">
              <span class="text-gray-400 line-through">$19.99</span> $0
            </span>
            <span class="text-base font-medium text-gray-500">/month</span>
          </p>
          <ul class="mt-8 space-y-4">
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">All Free features</p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">Turbo Job Apply</span> - Apply to jobs
                with one click
              </p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">AI Job Apply</span> - Use AI to
                enhance resume's and cover's before submitting them
              </p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">Auto Job Apply</span> - Set criteria
                and let us apply for you
              </p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">Job Notifications</span> - Real-time
                alerts for new matching jobs
              </p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">Job Tracking</span> - Track
                application status and follow-ups
              </p>
            </li>
            <li class="flex items-start">
              <div class="shrink-0">
                <svg
                  class="size-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p class="ml-3 text-base text-gray-700">
                <span class="font-medium">Premium Customer Support</span> -
                Priority assistance
              </p>
            </li>
          </ul>
          <div class="mt-8">
            <router-link
              to="/subscription"
              class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700"
            >
              Sign up for Free Access
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Donation Section -->
    <div class="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div
        class="rounded-lg border border-primary-200 bg-primary-50 p-8 text-center"
      >
        <h2 class="mb-4 text-2xl font-bold text-primary-900">
          Support Our Development
        </h2>
        <p class="mx-auto mb-6 max-w-3xl text-primary-800">
          If Turbo Job Apply has helped you and you'd like to support our work
          before we officially launch, you can donate to
          <span class="font-bold">$thomasjmeadows</span> on Cash App.
        </p>
        <div
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700"
        >
          <svg
            class="mr-2 size-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5c-5.799 0-10.5-4.701-10.5-10.5S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm1.125-13.125c.621 0 1.125-.504 1.125-1.125s-.504-1.125-1.125-1.125S12 7.629 12 8.25s.504 1.125 1.125 1.125zM13.5 18h-3v-1.5h.75v-4.5h-.75V10.5h3v6h.75V18z"
            />
          </svg>
          <span>Donate via Cash App: $thomasjmeadows</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
