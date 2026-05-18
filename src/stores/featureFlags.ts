import { defineStore } from 'pinia';
import axios from 'axios';

export const useFeatureFlagStore = defineStore('featureFlags', {
  state: () => ({
    flags: {} as Record<string, boolean>,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchFeatureFlags() {
      this.loading = true;
      try {
        const response = await axios.get('/v1/api/features');
        this.flags = response.data;
      } catch (err: any) {
        this.error = 'Failed to load feature flags';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    isEnabled(featureName: string): boolean {
      return this.flags[featureName] ?? true;
    },
  },
});
