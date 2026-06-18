import type { Config } from 'tailwindcss';

// Tailwind config for the Nexus frontend (spec 0091-tailwind-css-adoption).
// The token bridge: every theme value resolves to a CSS variable defined in src/styles/tokens.css,
// which remains the single source of truth (light on :root, dark on [data-theme="dark"]). No hex
// literals here (data-model VR-2). Preflight is disabled so globals.css stays the authoritative
// reset (R4 / FR-006). Dark mode keys off the [data-theme="dark"] selector, not prefers-color-scheme.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        // Brand palettes (deep-merged over Tailwind defaults so e.g. bg-indigo-500 → var(--indigo-500)).
        indigo: {
          50: 'var(--indigo-50)',
          100: 'var(--indigo-100)',
          300: 'var(--indigo-300)',
          400: 'var(--indigo-400)',
          500: 'var(--indigo-500)',
          600: 'var(--indigo-600)',
          700: 'var(--indigo-700)',
        },
        teal: {
          50: 'var(--teal-50)',
          100: 'var(--teal-100)',
          500: 'var(--teal-500)',
          600: 'var(--teal-600)',
          700: 'var(--teal-700)',
        },
        amber: {
          50: 'var(--amber-50)',
          100: 'var(--amber-100)',
          600: 'var(--amber-600)',
          700: 'var(--amber-700)',
        },
        rose: {
          50: 'var(--rose-50)',
          100: 'var(--rose-100)',
          600: 'var(--rose-600)',
          700: 'var(--rose-700)',
        },
        violet: { 100: 'var(--violet-100)', 600: 'var(--violet-600)' },
        // Neutrals
        ink: {
          200: 'var(--ink-200)',
          300: 'var(--ink-300)',
          400: 'var(--ink-400)',
          500: 'var(--ink-500)',
          600: 'var(--ink-600)',
          700: 'var(--ink-700)',
          800: 'var(--ink-800)',
          900: 'var(--ink-900)',
        },
        // Navy shell
        shell: {
          600: 'var(--shell-600)',
          700: 'var(--shell-700)',
          800: 'var(--shell-800)',
          850: 'var(--shell-850)',
          900: 'var(--shell-900)',
          line: 'var(--shell-line)',
          text: 'var(--shell-text)',
          muted: 'var(--shell-muted)',
        },
        // Surfaces
        canvas: 'var(--canvas)',
        'canvas-2': 'var(--canvas-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'border-soft': 'var(--border-soft)',
        track: 'var(--track)',
        // Text
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        // Status tone pairs
        'tone-indigo-bg': 'var(--tone-indigo-bg)',
        'tone-indigo-fg': 'var(--tone-indigo-fg)',
        'tone-teal-bg': 'var(--tone-teal-bg)',
        'tone-teal-fg': 'var(--tone-teal-fg)',
        'tone-amber-bg': 'var(--tone-amber-bg)',
        'tone-amber-fg': 'var(--tone-amber-fg)',
        'tone-rose-bg': 'var(--tone-rose-bg)',
        'tone-rose-fg': 'var(--tone-rose-fg)',
        'tone-slate-bg': 'var(--tone-slate-bg)',
        'tone-slate-fg': 'var(--tone-slate-fg)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        xs: 'var(--sh-xs)',
        sm: 'var(--sh-sm)',
        md: 'var(--sh-md)',
        lg: 'var(--sh-lg)',
        xl: 'var(--sh-xl)',
        indigo: 'var(--sh-indigo)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        ui: ['var(--font-ui)'],
        mono: ['var(--font-mono)'],
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease)',
        out: 'var(--ease-out)',
      },
    },
  },
  plugins: [],
} satisfies Config;
