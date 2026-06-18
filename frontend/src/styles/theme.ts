// Typed token mirror for JS/SVG charts (constitution: charts read theme.ts).
// Values mirror tokens.css; for theme-reactive reads, prefer getComputedStyle on :root.
export const chartColors = {
  indigo: '#4f46e5',
  teal: '#0d9488',
  amber: '#c2820b',
  rose: '#d03a2c',
  violet: '#7c3aed',
  slate: '#94a0b0',
} as const;

export const domainColors: Record<string, string> = {
  D1: '#4f46e5',
  D2: '#0d9488',
  D3: '#7c3aed',
  D4: '#14b8a6',
  D5: '#c2820b',
  D6: '#4338ca',
};

/** Read a CSS custom property at runtime (theme-reactive). */
export function cssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
