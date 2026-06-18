// Lazy GSAP loader (Spec 011 / FR-SSP-012, contracts/gsap-loader.md). GSAP is a heavy animation
// engine; importing it dynamically keeps it in a SEPARATE chunk, never the initial eager bundle, so
// the ≤260 KB budget (Spec 009 check-bundle) holds. ONLY CinematicLanding and TransformSequence call
// this, inside an effect after mount and only when motion is allowed (the reduced-motion path never
// loads GSAP). There must be NO top-level `import ... from 'gsap'` anywhere in src/.
export async function loadGsap() {
  const mod = await import('gsap');
  // GSAP ships both a named and a default export depending on build; normalize.
  return (mod as { gsap?: typeof import('gsap').gsap }).gsap ?? mod.default;
}
