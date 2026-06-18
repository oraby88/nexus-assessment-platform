// Data-source boundary (Spec 009 / FR-PVR-002/004, constitution I & IV). A single runtime switch
// selects which adapter the aggregator routes through: `mock` (default, the only working mode in V1)
// or `live` (a typed stub that throws "not wired in V1" — the future backend fills it). Switching
// modes requires NO UI/feature code change: components keep importing from `@/services`.
export type DataSourceMode = 'mock' | 'live';

/** Dev-only override key (mirrors the theme/locale store convention). Never used in production paths. */
const DEV_MODE_KEY = 'nexus_datasource_mode';

function envMode(): DataSourceMode | null {
  // Build-time override via Vite env (e.g. VITE_DATA_SOURCE=live). Optional; defaults to mock.
  // Cast keeps this independent of `vite/client` ambient types (not in the app tsconfig).
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const v = env?.VITE_DATA_SOURCE;
  return v === 'live' || v === 'mock' ? v : null;
}

/**
 * The active data-source mode. Precedence: build-time env override → dev-only localStorage → `mock`.
 * `mock` is the default and the only mode that resolves data in V1 (constitution I).
 */
export function getMode(): DataSourceMode {
  const fromEnv = envMode();
  if (fromEnv) return fromEnv;
  try {
    const v = localStorage.getItem(DEV_MODE_KEY);
    if (v === 'live' || v === 'mock') return v;
  } catch {
    /* no-op (SSR/jsdom without storage) */
  }
  return 'mock';
}

export function isLive(): boolean {
  return getMode() === 'live';
}

/**
 * Dev/test-only setter to flip the mode at runtime (persists via the dev key). Production builds
 * never call this; the future backend selects `live` via the build-time env override.
 */
export function setMode(mode: DataSourceMode): void {
  try {
    localStorage.setItem(DEV_MODE_KEY, mode);
  } catch {
    /* no-op */
  }
}
