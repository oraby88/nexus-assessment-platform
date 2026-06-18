# Phase 1 Data Model: Post-V1 Readiness

This feature adds infrastructure types/structures; it changes no domain entities. New types live in `src/services` and `src/i18n`.

## Service Contracts (US1)

```ts
// services/contracts.ts — one interface per service, mirroring today's mock signatures.
// These ARE the de-facto API a future backend must satisfy (constitution IV).
export interface ReportServiceContract {
  list(): Promise<Report[]>;
  getAdmin(id: string): Promise<Report | undefined>;
  getUserSafe(id: string): Promise<UserSafeReport | undefined>;
  downloadPdf(id: string): Promise<{ ok: true }>;
}
// ...one per service (auth, participant, assessment, runtime, consent, comparison,
//    notification, export, activityLog, settings, questionBank, roleBlueprint, contextProfile, ...)

// Each mock service asserts conformance at compile time (no runtime cost):
//   export const reportService = { ... } satisfies ReportServiceContract;
```

## Data-Source Mode (US1)

```ts
// services/dataSource.ts
export type DataSourceMode = 'mock' | 'live';
export function getMode(): DataSourceMode;     // default 'mock'; override via env/config (+ dev localStorage)
// services/live/liveStub.ts — every method throws:
//   throw new Error('live data source not wired in V1');
```

State: `mode` is read once per selection; `mock` (default) → existing services; `live` → throwing stub. Switching requires **no UI/feature change** (FR-PVR-002).

## Locale & Message Catalog (US2)

```ts
// src/i18n/catalog.ts
export type Locale = 'en' | 'ar';              // 'en' default (LTR); 'ar' sample (RTL)
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: Locale[] = ['ar'];
export type MessageKey = string;               // namespaced, e.g. 'auth.signIn'
export const catalog: Record<Locale, Record<MessageKey, string>>;

// src/i18n/useT.ts
export function useT(): {
  t: (key: MessageKey, vars?: Record<string, string | number>) => string; // fallback to DEFAULT_LOCALE on miss
  locale: Locale;
  dir: 'ltr' | 'rtl';
  formatDate: (iso: string) => string;         // Intl, active locale
  formatNumber: (n: number) => string;         // Intl, active locale
};
```

State transitions (locale): `DEFAULT_LOCALE` → **setLocale(l)** → persisted (versioned localStorage) + `document.documentElement.dir/lang` updated; restored on reload.

Invariants: missing key → default-locale value (never a raw key/blank); only display copy lives in the catalog (no restricted content — IX).

## Design Token Set (US3)

- The existing CSS-variable token set (color/spacing/typography/theming) sourced from `project/`; this feature reconciles deviations on priority surfaces. No new schema — tokens remain CSS variables.

## Bundle Budget (US4)

```ts
// conceptual (enforced by scripts/check-bundle.mjs)
interface BundleBudget {
  initialEagerRawBytesMax: 266_240;   // 260 KB
  initialEagerGzipBytesApprox: 87_040; // ~85 KB (reported)
  lazyChunksRequired: ['governed-bank', 'feature routes'];
}
```

## Validation & invariants

- **IV** — every UI/feature module imports from `@/services` (contracts), never fixtures/persistence; every service has a contract interface (drift test).
- **I** — `mock` is the default and only working mode in V1; `live` throws; no network.
- **i18n** — fallback on miss; RTL sets `dir`; locale-formatted dates/numbers.
- **Perf** — initial eager chunk ≤ 260 KB raw; governed bank + routes are separate lazy chunks.
- **Determinism** — new tests reset state + `setMockFailRate(0)`; bundle check runs post-build in the gate.
