import { render, screen } from '@testing-library/vue';
import JobCard from '../jobs/JobCard.vue';
import { describe, it, expect } from 'vitest';
import { RouterLinkStub } from '@vue/test-utils';

describe('JobCard', () => {
  const job = {
    id: '1',
    title: 'Software Engineer',
    companyName: 'Tech Corp',
    location: 'New York, NY',
    postedAt: '2024-01-01T00:00:00.000Z',
    navigation: {
      atsType: 'greenhouse',
      clientName: 'tech-corp',
      urlSafeJobTitle: 'software-engineer-1'
    }
  };

  it('renders job details correctly', () => {
    render(JobCard, {
      props: { job },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });
});
