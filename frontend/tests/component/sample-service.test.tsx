import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SampleServiceView } from '@/components/SampleServiceView';
import { setMockFailRate } from '@/services';

// SC-004: the sample view loads via a typed service Promise and renders the result.
describe('SampleServiceView seam (SC-004)', () => {
  beforeEach(() => setMockFailRate(0));
  afterEach(() => setMockFailRate(0));

  it('shows data after the service resolves', async () => {
    render(<SampleServiceView />);
    await waitFor(() => expect(screen.getByText('Amara Okonkwo')).toBeInTheDocument());
  });

  it('shows a retry affordance when the service errors', async () => {
    setMockFailRate(1);
    render(<SampleServiceView />);
    await waitFor(() => expect(screen.getByText('Retry')).toBeInTheDocument());
  });
});
