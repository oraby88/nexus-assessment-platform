# SpecKit Usage Guide

## Recommended Command Order

1. `/speckit.constitution`
   - Paste `CONSTITUTION_DRAFT.md`

2. `/speckit.specify`
   - Provide this package
   - Provide Claude Design files
   - Provide Nexus source documents
   - Provide the questionnaire workbook

3. `/speckit.clarify`
   - Use `000-shared/open-questions.md`
   - Ask for any additional gaps found by SpecKit

4. `/speckit.plan`
   - Frontend prototype only
   - React + TypeScript
   - mock services
   - no FastAPI
   - no Supabase implementation
   - no real AI
   - no real scoring

5. `/speckit.tasks`
   - Require dependency order
   - Require phase checkpoints
   - Require QA tasks
   - Require file-path guidance
   - Mark parallel tasks

6. `/speckit.analyze`
   - Compare constitution, scope, specs, routes, tasks
   - Confirm no missing page
   - Confirm no backend leakage
   - Confirm Agent governance
   - Confirm User-safe boundary
   - Confirm Domain 6 V1 visibility
   - Confirm no ranking

7. Stop for human review.

8. Run `/speckit.implement` only after explicit approval.
