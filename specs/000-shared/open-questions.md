# Remaining Clarification Register

The package is ready for SpecKit planning. The following questions should be reviewed during `/speckit.clarify`.

| ID | Question | Why it matters | Safe prototype default | Blocking? |
|---|---|---|---|---|
| Q1 | Should the User always create a permanent account, or may invitation access work without full account creation? | Auth UX and future backend flow | Support invitation-access mock plus User session | No |
| Q2 | Who has production authority to move a Role Blueprint from Active to Validated? | Governance workflow | Show mock transition with “future governed approval” note | No for frontend |
| Q3 | May SJT scenarios ever be adapted automatically, or only through approved templates? | Keyed answer validity | Keep SJT verbatim unless approved mock template | No |
| Q4 | Should cognitive questions ever be rephrased? | Keyed answer validity | Keep cognitive questions verbatim | No |
| Q5 | Should User-safe reports show a high-level Domain 6 alignment summary, or omit Domain 6 entirely? | User report boundary | Show only safe optional narrative/band when fixture permits | No |
| Q6 | Are Users allowed to decline optional research and third-party consent while continuing the assigned assessment? | Consent UX | Yes; current-use-case consent mandatory, optional consent separate | No |
| Q7 | Should the Admin be able to save an Agent-generated assessment as a reusable Assessment Template for future batch assignment? | Batch assessment workflow | Not included in V1 | Yes for future template scope |
| Q8 | Should the Admin download a real browser-generated PDF in the frontend prototype or use simulated PDF preparation? | Prototype depth | Simulated PDF action + export entry | No |
| Q9 | Should Organization Settings display future multi-Admin UI placeholders? | V1 scope discipline | Show one Admin account and a future-ready note only | No |
| Q10 | Does the Activity Log show all organization operational events, or only selected high-value events? | Page volume and clarity | Show selected high-value events with filters | No |
