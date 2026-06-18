// Role Blueprint service (Spec 004 / FR-BC-001..007, 011, 012, 013). Free-form lifecycle with
// Archived terminal; Validated enforced at consumption (isEligible). Two-way link via the shared store.
import type { BlueprintStatus, RoleBlueprint, UseCase, VersionEntry } from '@/models';
import { mockRequest } from '@/services/http';
import { bpStore, cxStore } from '@/services/blueprintContextStore';
import type { RoleBlueprintServiceContract } from '@/services/contracts';

let seq = bpStore.length;

function bumpVersion(v: string): string {
  const n = parseFloat(v);
  return (Number.isFinite(n) ? n + 0.1 : 1.1).toFixed(1);
}

/** Eligibility at consumption (research D7): Deprecated/Archived excluded; Validated for hiring. */
export function isEligible(b: RoleBlueprint, opts?: { useCase?: UseCase }): boolean {
  if (b.status === 'Deprecated' || b.status === 'Archived') return false;
  if (opts?.useCase === 'hiring_support') return b.status === 'Validated';
  return true;
}

type BlueprintInput = Omit<
  RoleBlueprint,
  'id' | 'version' | 'versionHistory' | 'updatedAt' | 'assessmentsUsed'
>;

export const roleBlueprintService = {
  list(): Promise<RoleBlueprint[]> {
    return mockRequest(() => bpStore.map((b) => ({ ...b })));
  },
  get(id: string): Promise<RoleBlueprint | undefined> {
    return mockRequest(() => {
      const b = bpStore.find((x) => x.id === id);
      return b ? { ...b } : undefined;
    });
  },
  create(input: BlueprintInput): Promise<RoleBlueprint> {
    return mockRequest(() => {
      seq += 1;
      const b: RoleBlueprint = {
        ...input,
        id: `BP-${seq}`,
        version: '1.0',
        updatedAt: '2026-06-15',
        assessmentsUsed: 0,
        versionHistory: [{ version: '1.0', date: '2026-06-15', summary: 'Created' }],
      };
      bpStore.unshift(b);
      return { ...b };
    });
  },
  update(bp: RoleBlueprint): Promise<RoleBlueprint> {
    return mockRequest(() => {
      const i = bpStore.findIndex((x) => x.id === bp.id);
      if (i < 0) throw new Error('Blueprint not found');
      const version = bumpVersion(bpStore[i].version);
      const entry: VersionEntry = { version, date: '2026-06-15', summary: 'Updated' };
      bpStore[i] = {
        ...bp,
        version,
        updatedAt: '2026-06-15',
        versionHistory: [entry, ...(bpStore[i].versionHistory ?? [])],
      };
      return { ...bpStore[i] };
    });
  },
  duplicate(id: string): Promise<RoleBlueprint> {
    return mockRequest(() => {
      const src = bpStore.find((x) => x.id === id);
      if (!src) throw new Error('Blueprint not found');
      seq += 1;
      const copy: RoleBlueprint = {
        ...src,
        id: `BP-${seq}`,
        name: `${src.name} (copy)`,
        status: 'Draft',
        version: '1.0',
        linkedContextProfileId: undefined,
        versionHistory: [{ version: '1.0', date: '2026-06-15', summary: 'Duplicated' }],
      };
      bpStore.unshift(copy);
      return { ...copy };
    });
  },
  setStatus(id: string, status: BlueprintStatus): Promise<RoleBlueprint> {
    return mockRequest(() => {
      const b = bpStore.find((x) => x.id === id);
      if (!b) throw new Error('Blueprint not found');
      if (b.status === 'Archived') throw new Error('Archived is terminal');
      b.status = status;
      return { ...b };
    });
  },
  versions(id: string): Promise<VersionEntry[]> {
    return mockRequest(() => bpStore.find((x) => x.id === id)?.versionHistory ?? []);
  },
  /** Two-way link: set linkedContextProfileId on the blueprint and linkedBlueprintId on the context. */
  link(blueprintId: string, contextId: string): Promise<RoleBlueprint> {
    return mockRequest(() => {
      const b = bpStore.find((x) => x.id === blueprintId);
      if (!b) throw new Error('Blueprint not found');
      b.linkedContextProfileId = contextId;
      const c = cxStore.find((x) => x.id === contextId);
      if (c) c.linkedBlueprintId = blueprintId;
      return { ...b };
    });
  },
  isEligible,
} satisfies RoleBlueprintServiceContract;
