import type {
  AddUserInput,
  AssessmentAssignment,
  BulkUploadResult,
  CsvRowResult,
  JobLevel,
  Participant,
} from '@/models';
import { mockRequest } from '@/services/http';
import { parseCsv } from '@/lib/csv';
import { participants as seed, assignments } from '@/mocks';
import type { ParticipantServiceContract } from '@/services/contracts';

// In-memory mutable roster seeded from fixtures so adds/imports persist within the session
// (constitution IV — components never read this directly; only this service does).
const roster: Participant[] = [...seed];
let seq = 9000 + roster.length;

const ORG = 'org-meridian';
const JOB_LEVELS: JobLevel[] = [
  'Individual Contributor',
  'Professional',
  'Manager',
  'Senior Manager',
  'Director',
  'Executive',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailExists(email: string): boolean {
  const e = email.trim().toLowerCase();
  return roster.some((p) => p.email.trim().toLowerCase() === e);
}

function toParticipant(input: AddUserInput): Participant {
  seq += 1;
  return {
    id: `CND-${seq}`,
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    currentJobTitle: input.currentJobTitle,
    targetJobTitle: input.targetJobTitle,
    jobLevel: input.jobLevel,
    departmentText: input.departmentText,
    organizationId: ORG,
    dateAdded: '2026-06-15',
    totalAssessments: 0,
    latestAssessmentLifecycle: 'Not Started',
    latestReportStatus: 'Unavailable',
  };
}

/** Map a CSV row (human headers, case-insensitive) to an AddUserInput shape. */
function rowToInput(raw: Record<string, string>): Partial<AddUserInput> {
  const get = (key: string) => {
    const found = Object.keys(raw).find((k) => k.trim().toLowerCase() === key);
    return found ? raw[found]?.trim() : undefined;
  };
  return {
    fullName: get('full name') || get('name'),
    email: get('email'),
    currentJobTitle: get('current job title'),
    targetJobTitle: get('target job title'),
    jobLevel: get('job level') as JobLevel | undefined,
    departmentText: get('department'),
    notes: get('notes'),
  };
}

export const participantService = {
  async list(query?: { search?: string }): Promise<Participant[]> {
    return mockRequest(() => {
      const q = query?.search?.toLowerCase().trim();
      if (!q) return [...roster];
      return roster.filter(
        (p) => p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
      );
    });
  },

  async get(id: string): Promise<Participant | undefined> {
    return mockRequest(() => roster.find((p) => p.id === id));
  },

  /** Create one person; rejects on duplicate email or invalid required fields (FR-ADM-003). */
  async add(input: AddUserInput): Promise<Participant> {
    return mockRequest(() => {
      const reasons = validateRequired(input);
      if (reasons.length) throw new Error(reasons.join('; '));
      if (emailExists(input.email)) throw new Error('A user with this email already exists');
      const p = toParticipant(input);
      roster.push(p);
      return p;
    });
  },

  /** Classify CSV rows into valid/invalid/duplicate without importing (FR-ADM-004). */
  async bulkUpload(csvText: string): Promise<BulkUploadResult> {
    return mockRequest(() => {
      const rows = parseCsv(csvText);
      const seenEmails = new Set<string>();
      const result: BulkUploadResult = { valid: [], invalid: [], duplicate: [] };
      rows.forEach((raw, i) => {
        const input = rowToInput(raw);
        const reasons = validateRequired(input);
        const entry: CsvRowResult = { row: i + 1, raw, status: 'valid' };
        if (reasons.length) {
          entry.status = 'invalid';
          entry.reasons = reasons;
          result.invalid.push(entry);
          return;
        }
        const email = (input.email as string).trim().toLowerCase();
        if (emailExists(email) || seenEmails.has(email)) {
          entry.status = 'duplicate';
          entry.reasons = [
            emailExists(email) ? 'Email already in organization' : 'Duplicate email within file',
          ];
          result.duplicate.push(entry);
          return;
        }
        seenEmails.add(email);
        entry.participant = input as AddUserInput;
        result.valid.push(entry);
      });
      return result;
    });
  },

  /** Import only the confirmed valid rows (FR-ADM-004). */
  async confirmImport(rows: CsvRowResult[]): Promise<Participant[]> {
    return mockRequest(() => {
      const added: Participant[] = [];
      for (const r of rows) {
        if (r.status !== 'valid' || !r.participant) continue;
        if (emailExists(r.participant.email)) continue;
        const p = toParticipant(r.participant);
        roster.push(p);
        added.push(p);
      }
      return added;
    });
  },

  async history(participantId: string): Promise<AssessmentAssignment[]> {
    return mockRequest(() => assignments.filter((a) => a.participantId === participantId));
  },
} satisfies ParticipantServiceContract;

function validateRequired(input: Partial<AddUserInput>): string[] {
  const reasons: string[] = [];
  if (!input.fullName || !input.fullName.trim()) reasons.push('Missing Full Name');
  if (!input.email || !EMAIL_RE.test(input.email.trim())) reasons.push('Missing or invalid Email');
  if (!input.jobLevel || !JOB_LEVELS.includes(input.jobLevel))
    reasons.push('Missing or invalid Job Level');
  return reasons;
}
