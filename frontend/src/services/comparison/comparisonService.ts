// Candidate Comparison (Spec 005 / FR-RPT-006/007, research D3). Reads each participant's CURRENT
// released report; participants without an eligible/released report are flagged ineligible. Human
// judgment only — NO ranking, ordering by fit, or automatic decision (constitution X).
import type { CandidateComparison, ComparisonEligibility, ComparisonParticipant } from '@/models';
import { mockRequest } from '@/services/http';
import { reports } from '@/mocks/reports';
import { participants } from '@/mocks';
import type { ComparisonServiceContract } from '@/services/contracts';

const RELEASED = ['Released', 'Released with Caution', 'Partial Release'];

export interface ComparisonSetup {
  roleTitle: string;
  blueprintId?: string;
  contextProfileId?: string;
  participantIds: string[];
  dimensionIds: string[];
}

export const comparisonService = {
  build(setup: ComparisonSetup): Promise<{
    comparison: CandidateComparison;
    eligibility: ComparisonEligibility[];
  }> {
    return mockRequest(() => {
      const eligibility: ComparisonEligibility[] = [];
      const cps: ComparisonParticipant[] = [];
      // Preserve the Admin's selection order — never reorder by fit.
      for (const pid of setup.participantIds) {
        const rep = reports.find((r) => r.participantId === pid && RELEASED.includes(r.status));
        if (!rep) {
          eligibility.push({ participantId: pid, eligible: false, reason: 'No released report' });
          continue;
        }
        eligibility.push({ participantId: pid, eligible: true });
        const person = participants.find((p) => p.id === pid);
        const name = person?.fullName ?? pid;
        const dimensionScores: Record<string, number> = {};
        for (const dom of rep.domains ?? []) {
          for (const d of dom.dimensions) {
            if (d.blocked) continue;
            if (setup.dimensionIds.length === 0 || setup.dimensionIds.includes(d.dimensionId)) {
              dimensionScores[d.dimensionId] = d.score;
            }
          }
        }
        cps.push({
          participantId: pid,
          reportId: rep.id,
          displayName: name,
          initials: name
            .split(' ')
            .map((s) => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase(),
          confidence: rep.confidence,
          contextualBand: rep.domain6?.caiBand,
          cai: rep.domain6?.cai,
          dimensionScores,
          strengths: (rep.strengths ?? []).map((s) => s.text),
          areasToExplore: (rep.areasToExplore ?? []).map((s) => s.text),
          interviewPrompts: (rep.interviewPrompts ?? []).map((p) => p.question),
        });
      }
      const comparison: CandidateComparison = {
        roleTitle: setup.roleTitle,
        blueprintId: setup.blueprintId,
        contextProfileId: setup.contextProfileId,
        dimensionIds: setup.dimensionIds,
        participants: cps,
      };
      return { comparison, eligibility };
    });
  },
} satisfies ComparisonServiceContract;
