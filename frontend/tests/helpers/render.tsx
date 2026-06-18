// Shared test helpers (Spec 008). Deterministic render harness + axe config for the verification suites.
import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '@/hooks';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { StorageKeys, writeKey } from '@/services/persistence';
import { consentStore } from '@/services/consentStore';
import { setMockFailRate } from '@/services/http';
import type { Role } from '@/models';

/** Seed a mock session so role-guarded screens render. */
export function seedSession(role: Role): void {
  writeKey(StorageKeys.session, {
    role,
    userId: role === 'admin' ? 'admin-1' : 'user-amara',
    name: role === 'admin' ? 'Jordan Avery' : 'Amara Okonkwo',
    email: role === 'admin' ? 'admin@meridian.co' : 'amara.okonkwo@meridian.co',
    organizationId: 'org-meridian',
    organizationName: 'Meridian',
  });
}

/** Deterministic reset for beforeEach across every suite (FR-QA-018 / SC-009). */
export function resetAll(): void {
  localStorage.clear();
  consentStore.__resetForTest();
  setMockFailRate(0);
}

/** Render a single element at a route, optionally seeding a session first. */
export function renderRoute(
  ui: ReactNode,
  opts: { path?: string; route?: string; role?: Role } = {},
) {
  const { path = '/', route = '*', role } = opts;
  if (role) seedSession(role);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocaleProvider>
        <SessionProvider>
          <Routes>
            <Route path={route} element={ui} />
          </Routes>
        </SessionProvider>
      </LocaleProvider>
    </MemoryRouter>,
  );
}

/**
 * axe options scoped for jsdom (research R2): jsdom has no layout/canvas, so color-contrast can't be
 * computed, and isolated component renders legitimately lack page-level landmarks/headings. We keep
 * the meaningful control-level rules (names, labels, roles, ARIA) and disable the rules that only
 * make sense for a full-page DOM. Contrast is verified via design tokens / manual review.
 */
export const axeConfig = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
  },
} as const;
