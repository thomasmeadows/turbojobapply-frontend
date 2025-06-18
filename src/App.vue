<script setup lang="ts">
import { onMounted } from 'vue';
import TheHeader from './components/layout/TheHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
import { useAuthStore } from './stores/auth';
import { useJobsStore } from './stores/jobs';

const authStore = useAuthStore();
const jobsStore = useJobsStore();

onMounted(async () => {
  // Check if user is logged in from local storage
  await authStore.checkAuth();
  // Fetch user config
  await jobsStore.fetchUserConfig();
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="grow">
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
