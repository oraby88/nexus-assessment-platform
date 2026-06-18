// Report service (Spec 005 / FR-RPT-001/002/004/005). Reads full report fixtures; derives the
// user-safe projection via field selection (Safe Reporting); PDF records an export-history entry.
// The frontend performs NO production scoring.
import type { Report, UserSafeReport } from '@/models';
import { mockRequest } from '@/services/http';
import { reports } from '@/mocks/reports';
import { exportService } from '@/services/export/exportService';
import type { ReportServiceContract } from '@/services/contracts';

export const reportService = {
  list(): Promise<Report[]> {
    return mockRequest(() => reports.map((r) => ({ ...r })));
  },
  getAdmin(id: string): Promise<Report | undefined> {
    return mockRequest(() => {
      const r = reports.find((x) => x.id === id);
      return r ? { ...r } : undefined;
    });
  },
  /** Audience projection (FR-RPT-004): strips raw/internal/blocked/Domain-6-internal fields. */
  getUserSafe(id: string): Promise<UserSafeReport | undefined> {
    return mockRequest(() => {
      const r = reports.find((x) => x.id === id);
      if (!r) return undefined;
      const safe: UserSafeReport = {
        id: r.id,
        assessmentId: r.assessmentId,
        useCase: r.useCase,
        targetRole: r.targetRole,
        completedAt: r.completedAt,
        status: r.status,
        confidence: r.confidence,
        strengths: r.strengths ?? [],
        areasToExplore: r.areasToExplore ?? [],
        // Only a safe, high-level Domain 6 summary where permitted — never indices/radar/internals.
        domain6Summary: r.domain6
          ? { alignmentBand: r.domain6.caiBand, narrative: r.domain6.narrative }
          : undefined,
        limitations: r.limitations ?? [],
      };
      return safe;
    });
  },
  /** Simulated PDF — records an export-history entry (FR-RPT-005 / SC-008). */
  async downloadPdf(_id: string): Promise<{ ok: true }> {
    await exportService.recordPdf('reports');
    return { ok: true };
  },
} satisfies ReportServiceContract;
