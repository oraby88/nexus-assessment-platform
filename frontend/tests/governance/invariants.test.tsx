import { describe, it, expect, beforeEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { screen } from '@testing-library/react';
import { reportService } from '@/services/report/reportService';
import { runtimeService } from '@/services/runtime/runtimeService';
import { comparisonService } from '@/services/comparison/comparisonService';
import { isOperationallyEligible } from '@/services/governance';
import type { ItemBankItem } from '@/models';
import { AssessmentRuntime } from '@/features/runtime/AssessmentRuntime';
import { UserReport } from '@/features/reports/user/UserReport';
import { renderRoute, resetAll } from '../helpers/render';

// Spec 008 / US1 — one explicit, passing assertion per NON-NEGOTIABLE governance invariant.
// This consolidates the constitutional guarantees in one auditable place (SC-001). Existing
// per-spec tests remain authoritative for their features.

const RESTRICTED_USER_KEYS = [
  'domains',
  'domain6',
  'scoringVersion',
  'synthesisWeightVersion',
  'omittedSections',
  'interviewPrompts',
  'blueprintVersion',
  'contextVersion',
  'participantId',
  'organizationId',
];

function makeItem(over: Partial<ItemBankItem>): ItemBankItem {
  return {
    itemId: 'NEX-X-1',
    domainId: 'D1',
    domainName: 'Character & Work Style',
    dimensionId: 'D1-CE',
    dimensionName: 'Conscientious Execution',
    facetId: 'D1-CE-ORD',
    facetName: 'Orderliness',
    methodFamily: 'likert',
    itemFormat: 'statement',
    itemText: 'x',
    options: {},
    keyedAnswer: null,
    responseScale: '1-5 Agreement',
    bankState: 'production',
    useStatus: 'operational_allowed',
    reviewStatus: 'draft',
    jobLevelOverlay: 'all_levels',
    reverseScored: false,
    ...over,
  };
}

describe('Governance invariants (Spec 008 / US1 — constitution NON-NEGOTIABLE set)', () => {
  beforeEach(() => resetAll());

  it('VIII — no live/client score appears in the runtime or the User report', async () => {
    const { container, unmount } = renderRoute(<AssessmentRuntime />, {
      path: '/app/assessments/AS-RUNTIME/run',
      route: '/app/assessments/:assessmentId/run',
      role: 'user',
    });
    await screen.findByText(/plan my work tasks/i);
    expect(container.textContent?.toLowerCase()).not.toContain('score');
    unmount();
    renderRoute(<UserReport />, {
      path: '/app/reports/RPT-001',
      route: '/app/reports/:reportId',
      role: 'user',
    });
    await screen.findByText('Your strengths');
    expect(screen.queryByText(/score/i)).toBeNull();
  });

  it('IX/III — the user-safe projection exposes no Admin-only/internal field', async () => {
    for (const id of ['RPT-001', 'RPT-002', 'RPT-003']) {
      const safe = (await reportService.getUserSafe(id)) as Record<string, unknown> | undefined;
      if (!safe) continue;
      for (const key of RESTRICTED_USER_KEYS) expect(key in safe).toBe(false);
    }
  });

  it('XI — Domain 6 derailment risk is always blocked and never shown as data', async () => {
    const ids = ['RPT-001', 'RPT-002', 'RPT-003', 'RPT-004'];
    let sawDomain6 = false;
    for (const id of ids) {
      const r = await reportService.getAdmin(id);
      if (r?.domain6) {
        sawDomain6 = true;
        expect(r.domain6.derailmentRiskBlocked).toBe(true);
      }
    }
    expect(sawDomain6).toBe(true); // at least one fixture exercises Domain 6
  });

  it('X — Candidate Comparison preserves selection order and carries no ranking/decision field', async () => {
    const ids = ['CND-2041', 'CND-2045'];
    const { comparison } = await comparisonService.build({
      roleTitle: 'Finance Manager',
      participantIds: ids,
      dimensionIds: [],
    });
    expect('rank' in comparison).toBe(false);
    comparison.participants.forEach((p) => {
      expect('rank' in p).toBe(false);
      expect('recommendation' in p).toBe(false);
    });
    // order preserved (no auto-ordering by fit)
    expect(comparison.participants.map((p) => p.participantId)).toEqual(
      ids.filter((id) => comparison.participants.some((p) => p.participantId === id)),
    );
  });

  it('VIII — responses are keyed by the immutable source Question ID', async () => {
    const session = await runtimeService.load('AS-RUNTIME');
    const qid = session.items[0].sourceQuestionId;
    const state = await runtimeService.answer('AS-RUNTIME', qid, 4);
    expect(Object.keys(state.answers)).toContain(qid);
  });

  it('V — governance excludes blocked / quarantined / non-production items', () => {
    expect(isOperationallyEligible(makeItem({ useStatus: 'operational_allowed' }))).toBe(true);
    expect(isOperationallyEligible(makeItem({ useStatus: 'operational_blocked' }))).toBe(false);
    expect(
      isOperationallyEligible(makeItem({ reviewStatus: 'quarantine_pending_dif_review' })),
    ).toBe(false);
    expect(isOperationallyEligible(makeItem({ bankState: 'pilot' }))).toBe(false);
  });

  it('VI — no fabricated source metadata (weight/difficulty) reaches the User', async () => {
    const session = await runtimeService.load('AS-RUNTIME');
    for (const item of session.items) {
      expect('weight' in item).toBe(false);
      expect('difficulty' in item).toBe(false);
    }
    const safe = (await reportService.getUserSafe('RPT-001')) as unknown as Record<string, unknown>;
    expect('weight' in safe).toBe(false);
    expect('difficulty' in safe).toBe(false);
  });

  it('IV — no UI component imports fixtures or persistence directly', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const roots = [resolve(here, '../../src/features'), resolve(here, '../../src/components')];
    const forbidden = [
      /from\s+['"]@\/mocks(\/[^'"]*)?['"]/,
      /from\s+['"]@\/services\/persistence['"]/,
    ];
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) out.push(...walk(full));
        else if (/\.(ts|tsx)$/.test(name)) out.push(full);
      }
      return out;
    };
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of walk(root)) {
        const src = readFileSync(file, 'utf8');
        if (forbidden.some((re) => re.test(src))) offenders.push(file);
      }
    }
    expect(offenders, `Direct fixture/persistence imports in: ${offenders.join(', ')}`).toEqual([]);
  });
});
