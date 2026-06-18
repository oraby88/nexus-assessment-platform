import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resetState } from '../_helpers/reset';
import { NOT_WIRED_MESSAGE } from '@/services/live/liveStub';

// Spec 009 / US1 (FR-PVR-002/004, SC-002). The data-source mode selects which adapter the aggregator
// routes through. `mock` (default) resolves data as today; `live` rejects through the SAME interface
// with "not wired in V1" — proving the swap seam with zero network and zero UI/feature changes.
describe('data-source mode switch (Spec 009 / US1)', () => {
  beforeEach(() => {
    resetState();
    vi.resetModules();
  });
  afterEach(() => {
    try {
      localStorage.removeItem('nexus_datasource_mode');
    } catch {
      /* no-op */
    }
  });

  it('defaults to mock and resolves a representative call as today', async () => {
    const { getMode } = await import('@/services/dataSource');
    expect(getMode()).toBe('mock');
    const { reportService } = await import('@/services');
    const reports = await reportService.list();
    expect(Array.isArray(reports)).toBe(true);
  });

  it('routes through the throwing live stub when mode is live (same interface)', async () => {
    const { setMode, getMode } = await import('@/services/dataSource');
    setMode('live');
    expect(getMode()).toBe('live');
    vi.resetModules();
    const { reportService, participantService } = await import('@/services');
    await expect(reportService.list()).rejects.toThrow(NOT_WIRED_MESSAGE);
    await expect(participantService.list()).rejects.toThrow(NOT_WIRED_MESSAGE);
  });
});
