// Service aggregator (FR-FND-013 / FR-ADM-* / Spec 009 FR-PVR-001/002). The typed mock-service layer
// is the ONLY data boundary (constitution IV). Signatures mirror specs/000-shared/handoff-map.md and
// are the de-facto API contract (services/contracts.ts) a future FastAPI/Supabase backend must satisfy
// without a UI rewrite. Exports route through the data-source boundary: `mock` (default) → these
// services unchanged; `live` → a typed stub that throws "not wired in V1" (Spec 009 seam).
import { mockRequest } from '@/services/http';
import { activityEvents, invitations, reminders } from '@/mocks';
import type { ActivityLogEvent, AssessmentInvitation, AssessmentReminder } from '@/models';
import type {
  ActivityLogServiceContract,
  AssessmentReminderServiceContract,
  InvitationServiceContract,
} from '@/services/contracts';
import { isLive } from '@/services/dataSource';
import { liveServices } from '@/services/live/liveStub';

import { authService as mockAuthService } from '@/services/auth/authService';
import { participantService as mockParticipantService } from '@/services/participant/participantService';
import { questionBankService as mockQuestionBankService } from '@/services/questionBank/questionBankService';
import { assessmentService as mockAssessmentService } from '@/services/assessment/assessmentService';
import { assessmentDraftService as mockAssessmentDraftService } from '@/services/assessmentDraft/assessmentDraftService';
import { agentDiscoveryService as mockAgentDiscoveryService } from '@/services/agentDiscovery/agentDiscoveryService';
import { adaptationService as mockAdaptationService } from '@/services/adaptation/adaptationService';
import { roleBlueprintService as mockRoleBlueprintService } from '@/services/roleBlueprint/roleBlueprintService';
import { contextProfileService as mockContextProfileService } from '@/services/contextProfile/contextProfileService';
import { reportService as mockReportService } from '@/services/report/reportService';
import { comparisonService as mockComparisonService } from '@/services/comparison/comparisonService';
import { runtimeService as mockRuntimeService } from '@/services/runtime/runtimeService';
import { consentService as mockConsentService } from '@/services/consent/consentService';
import { notificationService as mockNotificationService } from '@/services/notification/notificationService';
import { exportService as mockExportService } from '@/services/export/exportService';
import { settingsService as mockSettingsService } from '@/services/settings/settingsService';

// --- Read-only list services defined on the aggregator (Spec 002/007). ---
const mockActivityLogService = {
  list: (): Promise<ActivityLogEvent[]> => mockRequest(() => activityEvents),
} satisfies ActivityLogServiceContract;

const mockAssessmentReminderService = {
  list: (): Promise<AssessmentReminder[]> => mockRequest(() => reminders),
} satisfies AssessmentReminderServiceContract;

const mockInvitationService = {
  list: (): Promise<AssessmentInvitation[]> => mockRequest(() => invitations),
} satisfies InvitationServiceContract;

// --- Data-source boundary: select mock (default) or the throwing live stub once per module load. ---
const live = isLive();

export const authService = live ? liveServices.authService : mockAuthService;
export const participantService = live ? liveServices.participantService : mockParticipantService;
export const questionBankService = live
  ? liveServices.questionBankService
  : mockQuestionBankService;
export const assessmentService = live ? liveServices.assessmentService : mockAssessmentService;
export const assessmentDraftService = live
  ? liveServices.assessmentDraftService
  : mockAssessmentDraftService;
export const agentDiscoveryService = live
  ? liveServices.agentDiscoveryService
  : mockAgentDiscoveryService;
export const adaptationService = live ? liveServices.adaptationService : mockAdaptationService;
export const roleBlueprintService = live
  ? liveServices.roleBlueprintService
  : mockRoleBlueprintService;
export const contextProfileService = live
  ? liveServices.contextProfileService
  : mockContextProfileService;
export const reportService = live ? liveServices.reportService : mockReportService;
export const comparisonService = live ? liveServices.comparisonService : mockComparisonService;
export const runtimeService = live ? liveServices.runtimeService : mockRuntimeService;
export const consentService = live ? liveServices.consentService : mockConsentService;
export const notificationService = live
  ? liveServices.notificationService
  : mockNotificationService;
export const exportService = live ? liveServices.exportService : mockExportService;
export const settingsService = live ? liveServices.settingsService : mockSettingsService;
export const activityLogService = live ? liveServices.activityLogService : mockActivityLogService;
export const assessmentReminderService = live
  ? liveServices.assessmentReminderService
  : mockAssessmentReminderService;
export const invitationService = live ? liveServices.invitationService : mockInvitationService;

export * as governance from '@/services/governance';
export { mockRequest, setMockFailRate, MockHttpError } from '@/services/http';

// --- Thin stubs (no fixture data yet) — implemented by their area specs / the future backend. ---
const notImplemented = <T>(name: string): Promise<T> =>
  mockRequest<T>(() => {
    throw new Error(`${name} not implemented in the foundation (owned by a later area spec)`);
  });

export const scoringService = {
  getReportFixture: () => notImplemented<unknown>('scoringService.getReportFixture'),
};
export const domain6Service = {
  getDomain6: () => notImplemented<unknown>('domain6Service.getDomain6'),
};
