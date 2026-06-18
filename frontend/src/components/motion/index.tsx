// Motion primitives (FR-FND-007 / task T024). Every primitive degrades to instant/opacity under
// prefers-reduced-motion via useReducedMotion, is non-blocking, and uses no shell parallax.
import { Children, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks';

/** Route-level reveal (gentle fade/slide on mount). */
export function PageFX({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const style: CSSProperties = reduced ? {} : { animation: 'nx-fade-up .28s var(--ease-out) both' };
  return <div style={style}>{children}</div>;
}

/**
 * App-wide route entrance (Spec 010 / US2, FR-009/010). Mounted once around <Outlet/> in each shell;
 * keyed to the active pathname so it re-fires on every navigation. Reduced-motion → no animation.
 */
export function RouteReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  if (reduced) return <>{children}</>;
  return (
    <div key={pathname} style={{ animation: 'nx-fade-up .28s var(--ease-out) both' }}>
      {children}
    </div>
  );
}

/** Scale/opacity entrance (FR-007). */
export function ScaleIn({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const reduced = useReducedMotion();
  const style: CSSProperties = reduced
    ? {}
    : { animation: 'nx-scale-in .3s var(--ease-out) both', animationDelay: `${delayMs}ms` };
  return <div style={style}>{children}</div>;
}

/** Directional entrance; mirrors under RTL (FR-007/026). */
export function SlideIn({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const reduced = useReducedMotion();
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const name = rtl ? 'nx-slide-in-left' : 'nx-slide-in-right';
  const style: CSSProperties = reduced
    ? {}
    : { animation: `${name} .3s var(--ease-out) both`, animationDelay: `${delayMs}ms` };
  return <div style={style}>{children}</div>;
}

/** Success confirmation pop (FR-007). */
export function CheckPop({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const style: CSSProperties = reduced
    ? { display: 'inline-flex' }
    : { animation: 'nx-check-pop .3s var(--ease-out) both', display: 'inline-flex' };
  return <span style={style}>{children}</span>;
}

/** Section-level reveal. */
export function SectionReveal({
  children,
  delayMs = 0,
}: {
  children: ReactNode;
  delayMs?: number;
}) {
  const reduced = useReducedMotion();
  const style: CSSProperties = reduced
    ? {}
    : { animation: `nx-fade-up .3s var(--ease-out) both`, animationDelay: `${delayMs}ms` };
  return <div style={style}>{children}</div>;
}

/**
 * Staggered list reveal — each child animates with an incremental delay (Spec 010 / US2, FR-012).
 * Bounded by COUNT (clarify Q1): only the first STAGGER_CAP rows stagger; all remaining rows appear
 * together immediately (delay 0), so large collections stay usable. Reduced-motion → no animation.
 */
const STAGGER_CAP = 10;
export function StaggerRows({ children, stepMs = 50 }: { children: ReactNode; stepMs?: number }) {
  const reduced = useReducedMotion();
  return (
    <>
      {Children.map(children, (child, i) => (
        <div
          style={
            reduced
              ? {}
              : {
                  animation: 'nx-fade-up .3s var(--ease-out) both',
                  animationDelay: `${(i < STAGGER_CAP ? i : 0) * stepMs}ms`,
                }
          }
        >
          {child}
        </div>
      ))}
    </>
  );
}

/** Pop-in used when a chip is created (e.g., agent question selection). */
export function ChipCreate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <span
      style={
        reduced ? {} : { animation: 'nx-fade-up .2s var(--ease-out) both', display: 'inline-flex' }
      }
    >
      {children}
    </span>
  );
}

// CountUp lives in the UI primitives (it is reduced-motion aware); re-exported here for the
// motion namespace listed in the spec.
export { CountUp } from '@/components/ui';
