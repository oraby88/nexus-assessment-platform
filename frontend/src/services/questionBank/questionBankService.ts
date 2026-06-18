import type {
  ItemBankItem,
  JobLevel,
  JobRequirementsProfile,
  SelectedQuestion,
  UseCase,
} from '@/models';
import { mockRequest } from '@/services/http';
import { selectEligible } from '@/services/governance';
import type { QuestionBankServiceContract } from '@/services/contracts';

// The governed bank is lazy-loaded (code-split) so it never blocks first paint (constitution / Risk R18).
async function loadBank(): Promise<readonly ItemBankItem[]> {
  const mod = await import('@/mocks/governed-bank');
  return mod.governedBank;
}

const TARGET = 6;

export const questionBankService = {
  /** Return only operationally eligible items (excludes blocked/quarantine/pilot/research). */
  async select(criteria?: {
    domainId?: string;
    dimensionId?: string;
    jobLevel?: JobLevel;
    useCase?: UseCase;
  }): Promise<ItemBankItem[]> {
    const bank = await loadBank();
    return mockRequest(() => {
      let eligible = selectEligible(bank, {
        jobLevel: criteria?.jobLevel,
        useCase: criteria?.useCase,
      });
      if (criteria?.domainId) eligible = eligible.filter((i) => i.domainId === criteria.domainId);
      if (criteria?.dimensionId)
        eligible = eligible.filter((i) => i.dimensionId === criteria.dimensionId);
      return eligible;
    });
  },

  /**
   * Auto-propose an initial eligible set (Spec 003 / FR-CA-009, research D3): cover each critical
   * dimension first, then fill toward a small target. Only governed-eligible items are ever proposed.
   */
  async propose(
    profile: JobRequirementsProfile,
    jobLevel: JobLevel,
    useCase: UseCase,
  ): Promise<SelectedQuestion[]> {
    const bank = await loadBank();
    return mockRequest(() => {
      const eligible = selectEligible(bank, { jobLevel, useCase });
      const picked: SelectedQuestion[] = [];
      const has = (id: string) => picked.some((p) => p.item.itemId === id);
      const dims = profile.criticalDimensionIds.length
        ? profile.criticalDimensionIds
        : Array.from(new Set(eligible.map((i) => i.dimensionId)));
      for (const dim of dims) {
        const item = eligible.find((i) => i.dimensionId === dim && !has(i.itemId));
        if (item) {
          picked.push({
            item,
            requirementCovered: item.dimensionName,
            selectionReason: `Covers required dimension ${item.dimensionName}`,
            approved: false,
          });
        }
      }
      for (const item of eligible) {
        if (picked.length >= TARGET) break;
        if (!has(item.itemId)) {
          picked.push({
            item,
            requirementCovered: item.dimensionName,
            selectionReason: 'Additional coverage',
            approved: false,
          });
        }
      }
      return picked;
    });
  },
} satisfies QuestionBankServiceContract;
