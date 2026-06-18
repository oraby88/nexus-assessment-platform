// Context Profile service (Spec 004 / FR-BC-008..012). Draft/Active/Archived (Archived terminal);
// two-way link via the shared store; versioning on update.
import type { ContextProfile, ContextStatus, VersionEntry } from '@/models';
import { mockRequest } from '@/services/http';
import { bpStore, cxStore } from '@/services/blueprintContextStore';
import type { ContextProfileServiceContract } from '@/services/contracts';

let seq = cxStore.length;

function bumpVersion(v: string): string {
  const n = parseFloat(v);
  return (Number.isFinite(n) ? n + 0.1 : 1.1).toFixed(1);
}

type ContextInput = Omit<ContextProfile, 'id' | 'version' | 'versionHistory' | 'updatedAt'>;

export const contextProfileService = {
  list(): Promise<ContextProfile[]> {
    return mockRequest(() => cxStore.map((c) => ({ ...c })));
  },
  get(id: string): Promise<ContextProfile | undefined> {
    return mockRequest(() => {
      const c = cxStore.find((x) => x.id === id);
      return c ? { ...c } : undefined;
    });
  },
  create(input: ContextInput): Promise<ContextProfile> {
    return mockRequest(() => {
      seq += 1;
      const c: ContextProfile = {
        ...input,
        id: `CX-${seq}`,
        version: '1.0',
        updatedAt: '2026-06-15',
        versionHistory: [{ version: '1.0', date: '2026-06-15', summary: 'Created' }],
      };
      cxStore.unshift(c);
      return { ...c };
    });
  },
  update(cx: ContextProfile): Promise<ContextProfile> {
    return mockRequest(() => {
      const i = cxStore.findIndex((x) => x.id === cx.id);
      if (i < 0) throw new Error('Context profile not found');
      const version = bumpVersion(cxStore[i].version);
      const entry: VersionEntry = { version, date: '2026-06-15', summary: 'Updated' };
      cxStore[i] = {
        ...cx,
        version,
        updatedAt: '2026-06-15',
        versionHistory: [entry, ...(cxStore[i].versionHistory ?? [])],
      };
      return { ...cxStore[i] };
    });
  },
  duplicate(id: string): Promise<ContextProfile> {
    return mockRequest(() => {
      const src = cxStore.find((x) => x.id === id);
      if (!src) throw new Error('Context profile not found');
      seq += 1;
      const copy: ContextProfile = {
        ...src,
        id: `CX-${seq}`,
        name: `${src.name} (copy)`,
        status: 'Draft',
        version: '1.0',
        linkedBlueprintId: undefined,
        versionHistory: [{ version: '1.0', date: '2026-06-15', summary: 'Duplicated' }],
      };
      cxStore.unshift(copy);
      return { ...copy };
    });
  },
  setStatus(id: string, status: ContextStatus): Promise<ContextProfile> {
    return mockRequest(() => {
      const c = cxStore.find((x) => x.id === id);
      if (!c) throw new Error('Context profile not found');
      if (c.status === 'Archived') throw new Error('Archived is terminal');
      c.status = status;
      return { ...c };
    });
  },
  versions(id: string): Promise<VersionEntry[]> {
    return mockRequest(() => cxStore.find((x) => x.id === id)?.versionHistory ?? []);
  },
  /** Two-way link: set linkedBlueprintId on the context and linkedContextProfileId on the blueprint. */
  link(contextId: string, blueprintId: string): Promise<ContextProfile> {
    return mockRequest(() => {
      const c = cxStore.find((x) => x.id === contextId);
      if (!c) throw new Error('Context profile not found');
      c.linkedBlueprintId = blueprintId;
      const b = bpStore.find((x) => x.id === blueprintId);
      if (b) b.linkedContextProfileId = contextId;
      return { ...c };
    });
  },
} satisfies ContextProfileServiceContract;
