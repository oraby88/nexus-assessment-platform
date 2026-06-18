# High-Level Traceability Matrix

| Business requirement | Spec | Main route(s) | Primary service(s) | Acceptance focus |
|---|---|---|---|---|
| Two roles only | 001, 006 | `/login`, `/invitation`, shell routes | `authService` | guard separation |
| One Admin per organization V1 | 002 | `/admin/settings` | `settingsService`, `authService` | no multi-Admin workflow |
| Admin add User | 002 | `/admin/users` | `participantService` | save and list refresh |
| Bulk upload Users | 002 | `/admin/users` overlay | `participantService` | CSV validation phases |
| Create tailored assessment | 003 | `/admin/assessments/new` | `assessmentDraftService` | 12-step completion |
| Agent discovery chat | 003 | `/admin/assessments/new` | `agentDiscoveryService` | requirements update live |
| Select only from governed bank | 003 | `/admin/assessments/new` | `questionBankService` | blocked/quarantine exclusion |
| Controlled rephrasing only | 003 | `/admin/assessments/new` | `adaptationService` | metadata immutable |
| Question-level scoring attribution | 003,006 | creation + runtime | `runtimeService`, future scoring | source ID preserved |
| Role Blueprints | 004 | `/admin/role-blueprints*` | `roleBlueprintService` | create/link/version |
| Context Profiles | 004 | `/admin/context-profiles*` | `contextProfileService` | context map/live sliders |
| Domain 6 visible V1 | 005 | `/admin/reports/:reportId` | `reportService`, future Domain6 | governed visuals |
| Admin report | 005 | `/admin/reports/:reportId` | `reportService` | visibility treatment |
| User-safe report | 005,006 | user-preview and User report | `reportService` | restricted fields stripped |
| Candidate Comparison | 005 | `/admin/comparison` | `comparisonService` | no ranking/decision action |
| Admin History | 005 | `/admin/history` | `assessmentService`, `reportService` | global searchable archive |
| User runtime | 006 | `/app/assessments/:assessmentId/run` | `runtimeService` | 5 question types, pause/resume |
| Per-use-case consent | 006 | consent and profile | `consentService` | required current consent, revoke |
| PDF downloads | 005,006 | report routes | `reportService`, `exportService` | simulated action |
| Exports | 002 | `/admin/exports` | `exportService` | seven types |
| Email + in-platform notifications | 002,006 | notifications | `notificationService` | delivery indicator |
| Public/auth recovery | 007 | public/auth routes | `authService` | no bypass |
| Activity log | 007 | `/admin/activity-log` | `activityLogService` | org-scoped traceability |
| Release QA | 008 | all | all | E2E + a11y + responsive |
