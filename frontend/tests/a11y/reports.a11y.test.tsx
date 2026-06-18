import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { UserReport } from '@/features/reports/user/UserReport';
import { AdminReport } from '@/features/reports/AdminReport';
import { renderRoute, resetAll, axeConfig } from '../helpers/render';

// Spec 008 / US3 — report viewing (User + Admin): zero critical axe violations.
describe('A11y: report viewing (Spec 008 / US3)', () => {
  beforeEach(() => resetAll());

  it('UserReport has no axe violations', async () => {
    const { container } = renderRoute(<UserReport />, {
      path: '/app/reports/RPT-001',
      route: '/app/reports/:reportId',
      role: 'user',
    });
    await screen.findByText('Your strengths');
    expect(await axe(container, axeConfig)).toHaveNoViolations();
  });

  it('AdminReport has no axe violations', async () => {
    const { container } = renderRoute(<AdminReport />, {
      path: '/admin/reports/RPT-001',
      route: '/admin/reports/:reportId',
      role: 'admin',
    });
    await screen.findByText(/RPT-001/i);
    expect(await axe(container, axeConfig)).toHaveNoViolations();
  });
});
