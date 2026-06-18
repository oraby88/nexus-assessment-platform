// Governance helpers — advisory in the frontend, server-authoritative later (constitution V–XI).
import type { ConfidenceBand, ItemBankItem, JobLevel, OutputVisibility, UseCase } from '@/models';
import { SE_THRESHOLDS } from '@/models';

/** A bank item is operationally eligible only if it passes every gate (status-models.md §4). */
export function isOperationallyEligible(
  item: ItemBankItem,
  ctx?: { jobLevel?: JobLevel; useCase?: UseCase },
): boolean {
  if (item.bankState !== 'production') return false;
  if (item.useStatus === 'operational_blocked') return false;
  if (item.reviewStatus === 'quarantine_pending_dif_review') return false;
  if (!passesJobLevelOverlay(item, ctx?.jobLevel)) return false;
  return true;
}

function passesJobLevelOverlay(item: ItemBankItem, jobLevel?: JobLevel): boolean {
  if (item.jobLevelOverlay === 'all_levels' || !jobLevel) return true;
  const rank: Record<JobLevel, number> = {
    'Individual Contributor': 0,
    Professional: 1,
    Manager: 2,
    'Senior Manager': 3,
    Director: 4,
    Executive: 5,
  };
  const min = { all_levels: 0, professional_plus: 1, manager_plus: 2, senior_plus: 3 }[
    item.jobLevelOverlay
  ];
  return rank[jobLevel] >= min;
}

/** Filter a bank to the operational set (excludes blocked/quarantine/pilot/research). */
export function selectEligible(
  items: readonly ItemBankItem[],
  ctx?: { jobLevel?: JobLevel; useCase?: UseCase },
): ItemBankItem[] {
  return items.filter((i) => isOperationallyEligible(i, ctx));
}

/** Map a standard error to a confidence band. */
export function confidenceBand(se: number): ConfidenceBand {
  if (se <= SE_THRESHOLDS.high) return 'High';
  if (se <= SE_THRESHOLDS.moderate) return 'Moderate';
  if (se <= SE_THRESHOLDS.low) return 'Low';
  return 'Unacceptable';
}

/** Decide how a dimension/section renders for a given confidence + use case + audience. */
export function visibility(
  band: ConfidenceBand,
  useCase: UseCase,
  audience: 'admin' | 'user',
): OutputVisibility {
  if (band === 'Unacceptable') return 'hidden';
  if (band === 'High') return 'visible';
  if (band === 'Moderate') {
    return useCase === 'hiring_support' && audience === 'admin'
      ? 'downgraded'
      : 'visible_with_caution';
  }
  // Low
  return audience === 'user' ? 'hidden' : 'downgraded';
}

/** Project an Admin report shape into a user-safe shape (strips restricted/internal fields). */
export function toUserSafe<T extends Record<string, unknown>>(
  report: T,
): Omit<T, 'scoringVersion' | 'synthVersion' | 'omitted' | 'd6'> {
  const clone = { ...report } as Record<string, unknown>;
  delete clone.scoringVersion;
  delete clone.synthVersion;
  delete clone.omitted; // technical omission codes
  delete clone.d6; // Domain 6 internals (a safe summary is added by the report service)
  return clone as Omit<T, 'scoringVersion' | 'synthVersion' | 'omitted' | 'd6'>;
}
