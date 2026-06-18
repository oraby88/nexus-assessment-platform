import { describe, it, expect } from 'vitest';
import { translate } from '@/i18n/LocaleProvider';
import { catalog, DEFAULT_LOCALE } from '@/i18n/catalog';

// Spec 009 / US2 (FR-PVR-007). A key missing in the active locale falls back to the default locale —
// never a raw key or blank. Also verifies {var} interpolation.
describe('i18n missing-key fallback (Spec 009 / US2)', () => {
  it('falls back to the default locale when a key is missing in the active locale', () => {
    const key = 'auth.admin.title';
    const arValue = catalog.ar[key];
    try {
      delete catalog.ar[key]; // simulate an untranslated key in the active (ar) locale
      const out = translate('ar', key);
      expect(out).toBe(catalog[DEFAULT_LOCALE][key]); // English fallback
      expect(out).not.toBe(key); // never a raw key
      expect(out.trim().length).toBeGreaterThan(0); // never blank
    } finally {
      catalog.ar[key] = arValue; // restore
    }
  });

  it('interpolates {var} placeholders', () => {
    const out = translate('en', 'auth.reset.invalidBody', { state: 'expired or already used' });
    expect(out).toContain('expired or already used');
    expect(out).not.toContain('{state}');
  });
});
