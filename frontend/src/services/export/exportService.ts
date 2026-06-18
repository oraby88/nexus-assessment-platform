// Exports (US4 / FR-ADM-009, research D2): framework + Users/Assessments active; five registered-pending.
import type { ExportJob, ExportRegistryEntry, ExportType } from '@/models';
import { mockRequest } from '@/services/http';
import { exportJobs } from '@/mocks';
import { toCsv } from '@/lib/csv';
import { participantService } from '@/services/participant/participantService';
import { assessmentService } from '@/services/assessment/assessmentService';
import type { ExportServiceContract } from '@/services/contracts';

const REGISTRY: ExportRegistryEntry[] = [
  { type: 'users', label: 'Users', available: true, ownedBy: '002' },
  { type: 'assessments', label: 'Assessments', available: true, ownedBy: '002' },
  { type: 'history', label: 'Assessment History', available: false, ownedBy: '005' },
  { type: 'reports', label: 'Reports', available: false, ownedBy: '005' },
  { type: 'comparison', label: 'Candidate Comparison', available: false, ownedBy: '005' },
  { type: 'blueprints', label: 'Role Blueprints', available: false, ownedBy: '004' },
  { type: 'contexts', label: 'Context Profiles', available: false, ownedBy: '004' },
];

const jobs: ExportJob[] = exportJobs.map((j) => ({ ...j }));
const csvByJob = new Map<string, string>();
let seq = jobs.length;

async function buildCsv(type: ExportType): Promise<string> {
  if (type === 'users') {
    const rows = await participantService.list();
    return toCsv(rows as unknown as Record<string, unknown>[], [
      'id',
      'fullName',
      'email',
      'jobLevel',
      'targetJobTitle',
      'latestAssessmentLifecycle',
      'latestReportStatus',
    ]);
  }
  const rows = await assessmentService.list();
  return toCsv(rows as unknown as Record<string, unknown>[], [
    'id',
    'participantId',
    'targetRole',
    'jobLevel',
    'lifecycleStatus',
    'validityStatus',
    'reportStatus',
  ]);
}

export const exportService = {
  registry(): Promise<ExportRegistryEntry[]> {
    return mockRequest(() => REGISTRY.map((e) => ({ ...e })));
  },
  history(): Promise<ExportJob[]> {
    return mockRequest(() => [...jobs]);
  },
  async request(type: ExportType): Promise<ExportJob> {
    const entry = REGISTRY.find((e) => e.type === type);
    if (!entry || !entry.available) {
      throw new Error(`Export "${type}" is pending its owning spec (004/005)`);
    }
    const csv = await buildCsv(type);
    seq += 1;
    const job: ExportJob = {
      id: `EXP-${seq}`,
      organizationId: 'org-meridian',
      type,
      status: 'Ready',
      progressPercent: 100,
      downloadUrl: '#',
      createdAt: '2026-06-15',
    };
    jobs.unshift(job);
    csvByJob.set(job.id, csv);
    return job;
  },
  /** Returns the generated CSV text for a job so the UI can trigger a download. */
  getCsv(jobId: string): Promise<string> {
    return mockRequest(() => csvByJob.get(jobId) ?? '');
  },
  /** Record a simulated PDF export in history (Spec 005 / FR-RPT-005) without the registry gate. */
  recordPdf(type: ExportType): Promise<ExportJob> {
    return mockRequest(() => {
      seq += 1;
      const job: ExportJob = {
        id: `EXP-${seq}`,
        organizationId: 'org-meridian',
        type,
        status: 'Ready',
        progressPercent: 100,
        downloadUrl: '#',
        createdAt: '2026-06-15',
      };
      jobs.unshift(job);
      return job;
    });
  },
} satisfies ExportServiceContract;
