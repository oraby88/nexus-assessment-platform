// Namespaced, versioned localStorage wrapper (constitution: local persistence).
// FR-FND-009 + research D2: versioned reads discard a stale entry on schema-version mismatch
// (safe reset; no migration in V1).
const NS = 'nexus';

export const StorageKeys = {
  theme: 'nexus_theme',
  runtime: 'nexus_runtime_v1',
  drafts: 'nexus_drafts_v1',
  session: 'nexus_session_v1',
  locale: 'nexus_locale_v1',
  companion: 'nexus_companion_v1',
} as const;

/** Current schema versions for versioned payloads (bump to invalidate older stored data). */
export const SchemaVersions = {
  runtime: 1,
  drafts: 1,
  locale: 1,
  companion: 1,
} as const;

export function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeKey<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / unavailable — non-fatal in prototype */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

interface Envelope<T> {
  v: number;
  data: T;
}

/**
 * Read a versioned value. On a schema-version mismatch (or unparseable/legacy payload),
 * the stale entry is discarded and `fallback` is returned (research D2 — safe reset).
 */
export function getVersioned<T>(key: string, version: number, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const env = JSON.parse(raw) as Partial<Envelope<T>>;
    if (!env || typeof env !== 'object' || env.v !== version || !('data' in env)) {
      localStorage.removeItem(key); // discard stale
      return fallback;
    }
    return env.data as T;
  } catch {
    removeKey(key);
    return fallback;
  }
}

/** Write a versioned value wrapped in a `{ v, data }` envelope. */
export function setVersioned<T>(key: string, version: number, data: T): void {
  writeKey<Envelope<T>>(key, { v: version, data });
}

export type ThemePref = 'light' | 'dark' | 'system';

/** Resolve the OS/browser preference (research D1 — default when no explicit choice is stored). */
export function systemTheme(): 'light' | 'dark' {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Theme store backing the pre-paint script in index.html.
 * An explicit 'light'/'dark' choice is persisted; 'system' clears the key so the OS
 * preference is followed on next load (research D1).
 */
export const themeStore = {
  getPref(): ThemePref {
    try {
      const v = localStorage.getItem(StorageKeys.theme);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch {
      return 'system';
    }
  },
  resolve(): 'light' | 'dark' {
    const p = this.getPref();
    return p === 'system' ? systemTheme() : p;
  },
  set(pref: ThemePref): void {
    try {
      if (pref === 'system') localStorage.removeItem(StorageKeys.theme);
      else localStorage.setItem(StorageKeys.theme, pref);
    } catch {
      /* no-op */
    }
  },
};

/**
 * Locale store backing the in-house i18n layer (Spec 009 / FR-PVR-005). The active locale code is
 * persisted via the versioned envelope (mirrors `themeStore`); the i18n layer validates it against
 * the catalog and falls back to the default locale when absent/unknown.
 */
export const localeStore = {
  get(): string | null {
    return getVersioned<string | null>(StorageKeys.locale, SchemaVersions.locale, null);
  },
  set(locale: string): void {
    setVersioned(StorageKeys.locale, SchemaVersions.locale, locale);
  },
};

/**
 * Companion preference (Spec 011 / US2, FR-SSP-004). The Nex companion is enabled (visible) by
 * default; dismissal persists via the versioned envelope (mirrors theme/locale). Absent → enabled.
 */
export interface CompanionPref {
  enabled: boolean;
}
export const companionStore = {
  get(): CompanionPref {
    return getVersioned<CompanionPref>(StorageKeys.companion, SchemaVersions.companion, {
      enabled: true,
    });
  },
  set(pref: CompanionPref): void {
    setVersioned(StorageKeys.companion, SchemaVersions.companion, pref);
  },
};

export const namespace = NS;
