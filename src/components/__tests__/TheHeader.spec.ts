import { render, screen } from '@testing-library/vue';
import TheHeader from '../layout/TheHeader.vue';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '../../stores/auth';
import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { RouterLinkStub } from '@vue/test-utils';

describe('TheHeader', () => {
  it('renders login button when user is not authenticated', async () => {
    render(TheHeader, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    await nextTick();

    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders dashboard and logout buttons when user is authenticated', async () => {
    render(TheHeader, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { isAuthenticated: true },
            },
          }),
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const authStore = useAuthStore();
    authStore.isAuthenticated = true;

    await nextTick();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });
});
