// Shared in-memory stores for blueprints + contexts (Spec 004). Both services mutate these so the
// two-way link (research D6) stays consistent without circular service imports. Seeded from fixtures.
import type { ContextProfile, RoleBlueprint } from '@/models';
import { blueprints as bpSeed, contexts as cxSeed } from '@/mocks';

export const bpStore: RoleBlueprint[] = bpSeed.map((b) => ({ ...b }));
export const cxStore: ContextProfile[] = cxSeed.map((c) => ({ ...c }));
