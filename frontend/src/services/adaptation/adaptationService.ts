// Controlled rephrasing (Spec 003 / FR-CA-011/012, research D2). Accepts display text only and
// returns a word diff; method-family safeguards apply. In V1 there are no approved-equivalence
// templates, so SJT and cognitive MCQ are always retained verbatim. Never mutates source metadata.
import type { AdaptationMode, AdaptedQuestionText, ItemBankItem, MethodFamily } from '@/models';
import { mockRequest } from '@/services/http';
import { diffWords } from '@/lib/diffWords';
import type { AdaptationServiceContract } from '@/services/contracts';

const MODE: Record<MethodFamily, AdaptationMode> = {
  likert: 'contextual_rephrase_allowed',
  contextual_self_report: 'contextual_rephrase_allowed',
  forced_choice: 'light_terminology_only',
  cognitive_multiple_choice: 'verbatim_default',
  sjt: 'approved_equivalence_only',
};

/** Whether a method family may be rephrased in V1 (SJT + cognitive are verbatim — no templates). */
export function canAdapt(methodFamily: MethodFamily): boolean {
  return (
    methodFamily === 'likert' ||
    methodFamily === 'contextual_self_report' ||
    methodFamily === 'forced_choice'
  );
}

export const adaptationService = {
  canAdapt,
  adapt(input: {
    itemId: string;
    adaptedText: string;
    item: Readonly<ItemBankItem>;
  }): Promise<AdaptedQuestionText> {
    return mockRequest(() => {
      const mf = input.item.methodFamily;
      if (!canAdapt(mf)) {
        return {
          itemId: input.itemId,
          originalText: input.item.itemText,
          adaptedText: input.item.itemText,
          diff: [{ text: input.item.itemText, changed: false }],
          mode: MODE[mf],
          reason: 'Original wording retained (no approved equivalence template in V1)',
          generatedAt: '2026-06-15',
        };
      }
      return {
        itemId: input.itemId,
        originalText: input.item.itemText,
        adaptedText: input.adaptedText,
        diff: diffWords(input.item.itemText, input.adaptedText),
        mode: MODE[mf],
        reason: 'Governed role-context rephrase (display wording only)',
        generatedAt: '2026-06-15',
      };
    });
  },
} satisfies AdaptationServiceContract;
