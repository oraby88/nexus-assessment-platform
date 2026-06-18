// Live data-source stub (Spec 009 / FR-PVR-002, constitution I). Proves the swap seam with ZERO
// network: every method of every contract rejects with "live data source not wired in V1". The
// future backend phase replaces this module with real adapters that satisfy the same contracts —
// no UI/feature code changes (FR-PVR-002 / SC-002).
import type {
  ActivityLogServiceContract,
  AdaptationServiceContract,
  AgentDiscoveryServiceContract,
  AssessmentDraftServiceContract,
  AssessmentReminderServiceContract,
  AssessmentServiceContract,
  AuthServiceContract,
  ComparisonServiceContract,
  ConsentServiceContract,
  ContextProfileServiceContract,
  ExportServiceContract,
  InvitationServiceContract,
  NotificationServiceContract,
  ParticipantServiceContract,
  QuestionBankServiceContract,
  ReportServiceContract,
  RoleBlueprintServiceContract,
  RuntimeServiceContract,
  ServiceContracts,
  SettingsServiceContract,
} from '@/services/contracts';

export const NOT_WIRED_MESSAGE = 'live data source not wired in V1';

/**
 * Build a throwing implementation of any contract: every accessed member is a function that rejects
 * with the not-wired error. Typed as the contract `T` so the aggregator can route to it unchanged.
 */
function notWired<T extends object>(): T {
  return new Proxy({} as T, {
    get() {
      return async () => {
        throw new Error(NOT_WIRED_MESSAGE);
      };
    },
  });
}

export const liveServices: ServiceContracts = {
  authService: notWired<AuthServiceContract>(),
  participantService: notWired<ParticipantServiceContract>(),
  questionBankService: notWired<QuestionBankServiceContract>(),
  assessmentService: notWired<AssessmentServiceContract>(),
  assessmentDraftService: notWired<AssessmentDraftServiceContract>(),
  agentDiscoveryService: notWired<AgentDiscoveryServiceContract>(),
  adaptationService: notWired<AdaptationServiceContract>(),
  roleBlueprintService: notWired<RoleBlueprintServiceContract>(),
  contextProfileService: notWired<ContextProfileServiceContract>(),
  reportService: notWired<ReportServiceContract>(),
  comparisonService: notWired<ComparisonServiceContract>(),
  runtimeService: notWired<RuntimeServiceContract>(),
  consentService: notWired<ConsentServiceContract>(),
  notificationService: notWired<NotificationServiceContract>(),
  exportService: notWired<ExportServiceContract>(),
  settingsService: notWired<SettingsServiceContract>(),
  activityLogService: notWired<ActivityLogServiceContract>(),
  assessmentReminderService: notWired<AssessmentReminderServiceContract>(),
  invitationService: notWired<InvitationServiceContract>(),
};
