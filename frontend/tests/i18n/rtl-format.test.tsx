import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { useT } from '@/i18n/useT';
import { resetState } from '../_helpers/reset';

// Spec 009 / US2 (FR-PVR-008/009, SC-005). An RTL locale sets <html dir="rtl">/lang and the surface
// still renders its key controls; Intl date/number formatting follows the active locale.
function Probe() {
  const { t, setLocale, dir, formatNumber, formatDate } = useT();
  return (
    <div>
      <button onClick={() => setLocale('ar')}>{t('auth.signIn')}</button>
      <span data-testid="dir">{dir}</span>
      <span data-testid="num">{formatNumber(1234.5)}</span>
      <span data-testid="date">{formatDate('2026-06-16')}</span>
    </div>
  );
}

describe('i18n RTL + locale formatting (Spec 009 / US2)', () => {
  beforeEach(resetState);

  it('an RTL locale sets document dir/lang and keeps key controls rendered', async () => {
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    // Default LTR English: formatters thread the active locale into Intl (FR-PVR-008).
    expect(document.documentElement.dir).toBe('ltr');
    expect(screen.getByTestId('num').textContent).toBe(new Intl.NumberFormat('en').format(1234.5));
    expect(screen.getByTestId('date').textContent).toBe(
      new Intl.DateTimeFormat('en').format(new Date('2026-06-16')),
    );

    fireEvent.click(screen.getByRole('button'));

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(screen.getByTestId('dir').textContent).toBe('rtl');
    // The control is still present and labeled (translated) after switching. The Arabic table is
    // code-split (Spec 012 / T020), so its copy resolves asynchronously after the locale change.
    expect(await screen.findByText('تسجيل الدخول')).toBeInTheDocument();
    // Formatting now follows the active (ar) locale.
    expect(screen.getByTestId('num').textContent).toBe(new Intl.NumberFormat('ar').format(1234.5));
    expect(screen.getByTestId('date').textContent).toBe(
      new Intl.DateTimeFormat('ar').format(new Date('2026-06-16')),
    );
  });
});
