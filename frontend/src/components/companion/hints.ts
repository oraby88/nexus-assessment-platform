// Companion contextual hints (Spec 011 / US2, FR-SSP-003). Display copy only — no restricted/internal
// content (constitution IX). Voice ported from project/app/robot_companion.jsx. Scoped to the surfaces
// where the companion actually mounts (standard Admin + User shell pages); the immersive full-bleed
// flows (Create-Assessment, Assessment Runtime) and public/auth/landing are intentionally NOT covered
// (clarify C1 / FR-SSP-003) — those resolve to the generic fallback but the companion never renders there.

export const COMPANION_FALLBACK_HINT = "I'm Nex — I'll travel with you. Ask me anytime.";

// Ordered most-specific → least-specific; first match wins. Tested against the pathname.
const HINT_RULES: { match: RegExp; hint: string }[] = [
  // Admin
  { match: /\/admin\/dashboard/, hint: "Here's your overview. Everything important, at a glance." },
  { match: /\/admin\/users\/[^/]+/, hint: 'Everything about this person lives here.' },
  { match: /\/admin\/users/, hint: 'Add people individually or upload in bulk — your call.' },
  {
    match: /\/admin\/assessments\/[^/]+/,
    hint: 'Full assignment, consent and timeline details here.',
  },
  { match: /\/admin\/assessments/, hint: "Track every assessment's progress in real time." },
  {
    match: /\/admin\/role-blueprints\/[^/]+/,
    hint: 'Review, duplicate or activate this blueprint.',
  },
  {
    match: /\/admin\/role-blueprints/,
    hint: 'Blueprints define what success looks like for a role.',
  },
  {
    match: /\/admin\/context-profiles\/[^/]+/,
    hint: 'Here’s the full context signature for this role.',
  },
  {
    match: /\/admin\/context-profiles/,
    hint: 'Context profiles shape how results are interpreted.',
  },
  { match: /\/admin\/reports\/[^/]+/, hint: 'Tip: Domain 6 shows true contextual fit.' },
  { match: /\/admin\/reports/, hint: 'Governed, explainable results — ready when you are.' },
  {
    match: /\/admin\/comparison/,
    hint: 'Compare candidates side by side — judgement stays yours.',
  },
  { match: /\/admin\/history/, hint: 'Every past assessment, fully versioned.' },
  { match: /\/admin\/exports/, hint: 'Export anything to CSV, XLSX or PDF.' },
  { match: /\/admin\/notifications/, hint: "I'll keep you posted here and by email." },
  { match: /\/admin\/settings/, hint: 'Tune your workspace defaults here.' },
  { match: /\/admin\/profile/, hint: 'Your account, your preferences.' },
  // User portal
  {
    match: /\/app\/reports\/[^/]+/,
    hint: 'These results are written to support you, not label you.',
  },
  { match: /\/app\/reports/, hint: 'Your governed results, in plain language.' },
  { match: /\/app\/history/, hint: 'A record of everything you’ve completed.' },
  { match: /\/app\/notifications/, hint: "I'll keep you posted here and by email." },
  { match: /\/app\/profile/, hint: 'Your information and privacy choices live here.' },
  { match: /\/app\/help/, hint: "Stuck? I'm right here to help." },
  {
    match: /\/app\/(dashboard|assessments)/,
    hint: 'Take your time — you can pause and resume anytime.',
  },
];

/** Resolve the contextual hint for a pathname; falls back to a generic line (never blank). */
export function hintForPath(pathname: string): string {
  return HINT_RULES.find((r) => r.match.test(pathname))?.hint ?? COMPANION_FALLBACK_HINT;
}
