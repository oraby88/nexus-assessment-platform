// useT() — translation + locale access hook (Spec 009 / US2). Returns the active locale, direction,
// the t() lookup (with default-locale fallback + {var} interpolation), locale-aware Intl formatters,
// and setLocale. Throws if used outside <LocaleProvider> (mounted once in App).
import { useContext } from 'react';
import { LocaleContext, type LocaleContextValue } from './LocaleProvider';

export function useT(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT must be used within a LocaleProvider');
  return ctx;
}
