# Feature Spec 007 — Public Entry, Auth Recovery, Activity Log, Privacy Requests, and Polish

**Status:** Rewritten Draft
**Depends on:** 001, 002, 006
**Prefix:** `FR-POL-*`
**Authoritative sources:** `../000-master-scope/spec.md` (§14, §16), `../000-shared/route-map.md`, `../000-shared/handoff-map.md`

---

## 1. Scope
Cover cross-cutting pages, system states, governance-visibility surfaces, and polish that complete the prototype: Public Landing · Forgot/Reset Password · Access Denied · Not Found · Offline/Reconnected · Admin Activity Log · Privacy Request inbox state · motion polish · design-state completion · responsive polish · theme polish.

## 2. Dependencies & Inputs
- **Depends on:** 001 (routes/shells/motion), 002 (Settings → Privacy & Consent host), 006 (privacy/deletion requests originate here).
- **Consumes services:** `authService`, `activityLogService`, `settingsService`, `notificationService`.
- **Consumes data:** activity events, `DataDeletionRequest`, `Session`.

## 3. Routes & Screens
| Screen | Route |
|---|---|
| Public Landing | `/` |
| Forgot Password | `/forgot-password` |
| Reset Password | `/reset-password` |
| Access Denied | `/access-denied` |
| Not Found | `*` |
| Admin Activity Log | `/admin/activity-log` |
| Privacy Request inbox | within `/admin/settings` → Privacy and Consent |

## 4. Public Landing
- **Purpose:** explain NEXUS at a high level without exposing protected pages.
- **CTA rules:** Admin CTA → `/login`; User invitation CTA → `/invitation`; **no CTA may bypass authentication** into protected pages.
- **Content:** platform overview · trusted enterprise tone · contextual alignment · governed AI · transparent reporting · development + hiring support · CTA.

## 5. Account Recovery (`/forgot-password`, `/reset-password`)
Prototype behavior: validate email · simulate request · success state · reset form · password strength hint · confirmation · return to login. No real email or token validation.

## 6. System States
- **`/access-denied`:** clear message · return to correct portal · logout.
- **Not Found (`*`):** route not found · return home · return to portal.
- **Offline/Reconnected:** non-blocking banner · auto-save status · retry message · reconnected toast.

## 7. Admin Activity Log (`/admin/activity-log`)
- **Scope:** organization-scoped prototype read view — **not** a replacement for future immutable backend audit logging.
- **Events:** Admin login · User added · User imported · Assessment draft created · Assessment approved · Invitation sent · Reminder sent · Deadline extended · Assessment cancelled · Consent accepted/declined/revoked · Assessment submitted · Report generated · PDF requested · Export requested · Blueprint created/changed · Context changed · Privacy request submitted.
- **UI:** search · filters · date range · actor · event type · target record · detail drawer · export activity CSV.

## 8. Privacy Request Inbox (Settings → Privacy and Consent)
Show submitted data-deletion requests · status · submitted date · User · simulated review action · activity-log entry. Production handling remains a future backend/legal workflow.

## 9. Motion & UX Polish
Implement: route transition · sidebar state transition · KPI count-up · table stagger · drawer/modal transition · typing indicator · requirement-chip creation · chat-to-summary transform · question-replace transition · wording-diff reveal · context-map morph · coverage-bar animation · auto-save feedback · completion check · report reveal · comparison-grid reflow · toast · skeleton · empty-state micro-animation.
**Rules:** short · purposeful · skippable where long · input never blocked · reduced-motion safe · no endless decorative animation · no parallax.

## 10. Responsive Polish
Verify: Admin sidebar off-canvas · table overflow · filters collapse · details stack · charts scale · comparison scrolls · runtime mobile-first · SJT readable · forced-choice stacked · modals safe on small viewport · sticky actions do not cover content.

## 11. User Stories & Acceptance Scenarios
### US-POL-1 — Safe public entry (P2)
- **Given** the landing page, **When** I click any CTA, **Then** I reach `/login` or `/invitation` and never a protected page directly.
### US-POL-2 — Account recovery (P3)
- **Given** forgot-password, **When** I submit an email, **Then** a simulated success + return-to-login appears (no real email).
### US-POL-3 — System states (P2)
- **Given** an out-of-role route, **When** I open it, **Then** `/access-denied` shows; **Given** an unknown route, **Then** Not Found shows; **Given** simulated offline, **Then** a non-blocking banner + auto-save status appear.
### US-POL-4 — Activity log (P2)
- **Given** the Activity Log, **When** I filter by actor/type/date, **Then** org-scoped events render with a detail drawer and CSV export.
### US-POL-5 — Privacy requests (P3)
- **Given** a submitted deletion request, **When** I open Settings → Privacy and Consent, **Then** it appears with status and a simulated review action that writes an activity-log entry.
### US-POL-6 — Polish (P3)
- **Given** `prefers-reduced-motion`, **When** any animation would run, **Then** it degrades safely; theme flip is verified across all pages.

## 12. Functional Requirements
- **FR-POL-001:** Public Landing with safe CTAs.
- **FR-POL-002:** Forgot/reset prototype.
- **FR-POL-003:** Access denied.
- **FR-POL-004:** Not Found.
- **FR-POL-005:** Offline/reconnected.
- **FR-POL-006:** Activity Log.
- **FR-POL-007:** Privacy request inbox state.
- **FR-POL-008:** Cross-app motion polish.
- **FR-POL-009:** Reduced motion.
- **FR-POL-010:** Responsive polish.
- **FR-POL-011:** Theme-flip audit.

## 13. States
- **Empty:** activity log with no matching events; privacy inbox with no requests.
- **Loading:** landing reveal; activity-log skeleton.
- **Error:** recovery validation errors; offline banner; failed log load → retry.
- **Responsive:** landing stacks; activity table scrolls in-card; recovery forms mobile-safe.
- **Accessibility:** CTA focus order; recovery form labels; activity filters keyboard-operable; reduced motion.
- **Animation:** landing entrance + governed motion polish (reduced-motion-safe; no parallax).

## 14. Services & Data
`authService` (recovery), `activityLogService` (org-scoped read + CSV), `settingsService` (privacy inbox), `notificationService`. Future: immutable audit-event stream + legal privacy workflow. See `../000-shared/handoff-map.md`.

## 15. Out of Scope / Backend Handoff
No real email/token recovery, no real audit stream, no real privacy/legal workflow. The Activity Log is a prototype read view only.

## 16. Risks
See `../000-shared/risk-register.md` — public CTA bypass (must not enter protected pages), activity-log volume/clarity (selected high-value events + filters), motion overuse, theme regressions.

## 17. Acceptance Checkpoint
Complete when no public page bypass exists; recovery pages work as mocks; error/system states are polished; the Activity Log exists with filters + detail + CSV; privacy requests surface in Settings; motion is reduced-motion-safe with no parallax; and desktop/tablet/mobile visual review passes.
