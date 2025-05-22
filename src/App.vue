<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from './components/layout/TheHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
import { useAuthStore } from './stores/auth';
import { useJobsStore } from './stores/jobs';

const authStore = useAuthStore();
const jobsStore = useJobsStore();
const router = useRouter();

onMounted(async () => {
  // Check if user is logged in from local storage
  authStore.checkAuth();
  // Fetch user config
  await jobsStore.fetchUserConfig();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <TheFooter />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>