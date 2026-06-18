import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { useT } from '@/i18n/useT';
import { localeStore } from '@/services/persistence';
import { resetState } from '../_helpers/reset';

// Spec 009 / US2 (FR-PVR-005, SC-004). Switching locale updates rendered copy AND persists across
// reloads (a remount rehydrates the persisted choice).
function Probe() {
  const { t, setLocale } = useT();
  return (
    <div>
      <span data-testid="title">{t('auth.admin.title')}</span>
      <button onClick={() => setLocale('ar')}>to-ar</button>
    </div>
  );
}

describe('i18n locale switch + persistence (Spec 009 / US2)', () => {
  beforeEach(resetState);

  it('switching locale updates copy and persists the choice', async () => {
    const { unmount } = render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('title').textContent).toBe('Admin sign in');

    fireEvent.click(screen.getByText('to-ar'));
    // The Arabic table is code-split (Spec 012 / T020) — it resolves asynchronously after the switch.
    await screen.findByText('تسجيل دخول المسؤول');
    expect(localeStore.get()).toBe('ar');

    // Reload simulation: a fresh provider rehydrates the persisted locale.
    unmount();
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(await screen.findByText('تسجيل دخول المسؤول')).toBeInTheDocument();
  });
});
