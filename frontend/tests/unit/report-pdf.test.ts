import { describe, it, expect, beforeEach } from 'vitest';
import { reportService } from '@/services/report/reportService';
import { exportService } from '@/services/export/exportService';
import { setMockFailRate } from '@/services/http';

// FR-RPT-005 / SC-008
describe('reportService.downloadPdf records an export-history entry', () => {
  beforeEach(() => setMockFailRate(0));

  it('adds a history entry on download', async () => {
    const before = (await exportService.history()).length;
    await reportService.downloadPdf('RPT-001');
    const after = await exportService.history();
    expect(after.length).toBe(before + 1);
    expect(after[0].type).toBe('reports');
  });
});
