// Locale provider (Spec 009 / US2, FR-PVR-005/007/008/009). Holds the active locale, persists it via
// the versioned localeStore (mirrors themeStore), and keeps <html dir>/<html lang> in sync so RTL
// reading order and assistive tech follow the choice. Mounted once in App. No runtime i18n dependency.
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { catalog, DEFAULT_LOCALE, isRtl, toLocale, type Locale, type MessageKey } from './catalog';
import { localeStore } from '@/services/persistence';

export interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  formatDate: (iso: string) => string;
  formatNumber: (n: number) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Resolve a key in the active locale, falling back to the default locale (never a blank). */
export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const active = catalog[locale]?.[key];
  const fallback = catalog[DEFAULT_LOCALE]?.[key];
  // Active → default-locale fallback → key (dev fallback for an entirely unknown key) (FR-PVR-007).
  return interpolate(active ?? fallback ?? key, vars);
}

function applyDocument(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    () => toLocale(localeStore.get()) ?? DEFAULT_LOCALE,
  );

  // The non-default (RTL/ar) message table is code-split (Spec 012 / T020 budget reclaim) and loaded
  // on demand here. Until it resolves, translate() falls back to the eager English copy (FR-PVR-007).
  const [arReady, setArReady] = useState(() => Object.keys(catalog.ar).length > 0);

  useEffect(() => {
    applyDocument(locale);
  }, [locale]);

  useEffect(() => {
    if (!isRtl(locale) || Object.keys(catalog.ar).length > 0) return;
    let active = true;
    void import('./catalog.ar').then((m) => {
      Object.assign(catalog.ar, m.arMessages);
      if (active) setArReady(true);
    });
    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localeStore.set(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dir = isRtl(locale) ? 'rtl' : 'ltr';
    return {
      locale,
      dir,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      formatDate: (iso: string) => {
        try {
          return new Intl.DateTimeFormat(locale).format(new Date(iso));
        } catch {
          return iso;
        }
      },
      formatNumber: (n: number) => {
        try {
          return new Intl.NumberFormat(locale).format(n);
        } catch {
          return String(n);
        }
      },
    };
    // arReady flips once the code-split Arabic table is merged, so memoized t() recomputes.
  }, [locale, setLocale, arReady]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
