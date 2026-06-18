// Assessment monitoring + management actions (US2 / FR-ADM-006, FR-ADM-007).
// Actions mutate mock state, append a TimelineEvent, and emit an AppNotification with a simulated
// email-delivery state. Lifecycle and validity remain SEPARATE fields (status-models §1).
import type {
  AppNotification,
  AssessmentAssignment,
  AssessmentInvitation,
  TimelineEvent,
} from '@/models';
import { mockRequest } from '@/services/http';
import {
  assignments as seedAssignments,
  invitations as seedInvitations,
  notifications,
} from '@/mocks';
import type { AssessmentServiceContract } from '@/services/contracts';

const assignments: AssessmentAssignment[] = seedAssignments.map((a) => ({ ...a }));
const invitations: AssessmentInvitation[] = seedInvitations.map((i) => ({ ...i }));
const timelines = new Map<string, TimelineEvent[]>();
let seq = 0;

const TERMINAL: AssessmentAssignment['lifecycleStatus'][] = ['Completed', 'Cancelled', 'Expired'];

function ensureTimeline(id: string): TimelineEvent[] {
  if (!timelines.has(id)) {
    const a = assignments.find((x) => x.id === id);
    timelines.set(
      id,
      a
        ? [
            {
              id: `${id}-created`,
              entityType: 'Assessment',
              entityId: id,
              label: 'Assessment assigned',
              detail: a.targetRole,
              createdAt: a.assignedAt,
            },
          ]
        : [],
    );
  }
  return timelines.get(id)!;
}

function addEvent(id: string, label: string, detail?: string) {
  seq += 1;
  ensureTimeline(id).push({
    id: `${id}-ev-${seq}`,
    entityType: 'Assessment',
    entityId: id,
    label,
    detail,
    createdAt: '2026-06-15T12:00:00Z',
  });
}

function emitNotification(type: string, title: string, body: string) {
  seq += 1;
  const n: AppNotification = {
    id: `NTF-gen-${seq}`,
    type,
    title,
    body,
    time: '2026-06-15T12:00:00Z',
    read: false,
    email: true,
  };
  notifications.unshift(n); // simulated email-delivery: email=true (queued/sent)
}

function getOrThrow(id: string): AssessmentAssignment {
  const a = assignments.find((x) => x.id === id);
  if (!a) throw new Error('Assessment not found');
  return a;
}

function assertActionable(a: AssessmentAssignment, action: string) {
  if (TERMINAL.includes(a.lifecycleStatus)) {
    throw new Error(`Cannot ${action}: assessment is ${a.lifecycleStatus}`);
  }
}

export const assessmentService = {
  list(): Promise<AssessmentAssignment[]> {
    return mockRequest(() => assignments.map((a) => ({ ...a })));
  },
  /**
   * Create a Not-Started assignment + invitation and emit timeline/notification (Spec 003 send).
   * The new assignment immediately appears in the Admin Core monitoring list (FR-ADM-006/SC-001).
   */
  create(input: {
    participantId: string;
    email?: string;
    useCase: AssessmentAssignment['useCase'];
    targetRole: string;
    jobLevel: AssessmentAssignment['jobLevel'];
    deadline?: string;
  }): Promise<{ assignment: AssessmentAssignment; invitation: AssessmentInvitation }> {
    return mockRequest(() => {
      seq += 1;
      const id = `ASN-new-${seq}`;
      const assignment: AssessmentAssignment = {
        id,
        participantId: input.participantId,
        organizationId: 'org-meridian',
        useCase: input.useCase,
        targetRole: input.targetRole,
        jobLevel: input.jobLevel,
        assignedAt: '2026-06-15',
        deadline: input.deadline,
        lifecycleStatus: 'Not Started',
        validityStatus: 'Pending',
        progressPercent: 0,
        reportStatus: 'Unavailable',
      };
      assignments.unshift(assignment);
      const invitation: AssessmentInvitation = {
        id: `INV-new-${seq}`,
        assessmentId: id,
        participantId: input.participantId,
        email: input.email ?? 'user@meridian.co',
        status: 'Sent',
        sentAt: '2026-06-15',
      };
      invitations.push(invitation);
      addEvent(id, 'Assessment assigned', input.targetRole);
      emitNotification('invited', 'Assessment sent', `${input.targetRole} assessment sent.`);
      return { assignment, invitation };
    });
  },
  get(id: string): Promise<AssessmentAssignment | undefined> {
    return mockRequest(() => {
      const a = assignments.find((x) => x.id === id);
      return a ? { ...a } : undefined;
    });
  },
  timeline(id: string): Promise<TimelineEvent[]> {
    return mockRequest(() => [...ensureTimeline(id)]);
  },
  remind(id: string): Promise<AssessmentAssignment> {
    return mockRequest(() => {
      const a = getOrThrow(id);
      assertActionable(a, 'send reminder');
      addEvent(id, 'Reminder sent', 'Email reminder queued');
      emitNotification('reminder', 'Reminder sent', `Reminder sent for ${a.targetRole}.`);
      return { ...a };
    });
  },
  resendInvitation(id: string): Promise<AssessmentInvitation> {
    return mockRequest(() => {
      const a = getOrThrow(id);
      assertActionable(a, 'resend invitation');
      const inv = invitations.find((i) => i.assessmentId === id);
      const updated: AssessmentInvitation = inv ?? {
        id: `INV-gen-${id}`,
        assessmentId: id,
        participantId: a.participantId,
        email: 'user@meridian.co',
        status: 'Sent',
      };
      updated.status = 'Sent';
      updated.sentAt = '2026-06-15';
      if (!inv) invitations.push(updated);
      addEvent(id, 'Invitation resent');
      emitNotification('invited', 'Invitation resent', `Invitation resent for ${a.targetRole}.`);
      return { ...updated };
    });
  },
  extendDeadline(id: string, deadline: string): Promise<AssessmentAssignment> {
    return mockRequest(() => {
      const a = getOrThrow(id);
      assertActionable(a, 'extend deadline');
      a.deadline = deadline;
      addEvent(id, 'Deadline extended', deadline);
      emitNotification(
        'deadline',
        'Deadline extended',
        `Deadline extended to ${deadline} for ${a.targetRole}.`,
      );
      return { ...a };
    });
  },
  cancel(id: string): Promise<AssessmentAssignment> {
    return mockRequest(() => {
      const a = getOrThrow(id);
      assertActionable(a, 'cancel');
      a.lifecycleStatus = 'Cancelled';
      addEvent(id, 'Assessment cancelled');
      emitNotification(
        'expired',
        'Assessment cancelled',
        `${a.targetRole} assessment was cancelled.`,
      );
      return { ...a };
    });
  },
} satisfies AssessmentServiceContract;
