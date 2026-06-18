import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as icons from '@/components/ui/icons';
import { Icon } from '@/components/ui/icons';

// Spec 012 / US1 (FR-PAR-002/012). The centralized icon set (ported from app/icons.jsx) exists and
// the Icon renderer produces stroke SVGs. (Chrome's use of these icons is verified at review + build.)
const EXPECTED = [
  'dashboard',
  'candidates',
  'assessment',
  'blueprint',
  'context',
  'reports',
  'compare',
  'history',
  'exports',
  'bell',
  'settings',
  'user',
  'search',
  'menu',
  'logout',
  'chevronRight',
  'check',
  'x',
  'plus',
  'sparkles',
  'agent',
];

describe('chrome / icon-set parity (Spec 012 / US1)', () => {
  it('exports the design icon set as non-empty path strings', () => {
    const missing = EXPECTED.filter(
      (name) => typeof (icons as Record<string, unknown>)[name] !== 'string',
    );
    expect(missing, `Missing icons: ${missing.join(', ')}`).toEqual([]);
  });

  it('Icon renders a stroke SVG with at least one path', () => {
    const { container } = render(<Icon path={icons.dashboard} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });
});
