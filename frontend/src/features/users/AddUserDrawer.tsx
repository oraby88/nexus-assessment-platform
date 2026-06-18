// Add User drawer (US1 / FR-ADM-003): form with validation + duplicate-email guard, focus-trapped.
import { useState } from 'react';
import { Drawer, Field, TextInput, TextArea, Select, Button } from '@/components/ui';
import { useToast } from '@/hooks';
import { participantService } from '@/services';
import type { AddUserInput, JobLevel, Participant } from '@/models';

const JOB_LEVELS: JobLevel[] = [
  'Individual Contributor',
  'Professional',
  'Manager',
  'Senior Manager',
  'Director',
  'Executive',
];

export function AddUserDrawer({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (p: Participant) => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<AddUserInput>({
    fullName: '',
    email: '',
    jobLevel: 'Professional',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (patch: Partial<AddUserInput>) => setForm((f) => ({ ...f, ...patch }));

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const created = await participantService.add(form);
      toast('User added', 'success', created.fullName);
      onCreated(created);
      setForm({ fullName: '', email: '', jobLevel: 'Professional' });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add User">
      <Field label="Full Name">
        <TextInput
          value={form.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          aria-label="Full Name"
        />
      </Field>
      <Field label="Email">
        <TextInput
          type="email"
          value={form.email}
          onChange={(e) => set({ email: e.target.value })}
          aria-label="Email"
        />
      </Field>
      <Field label="Current Job Title">
        <TextInput
          value={form.currentJobTitle ?? ''}
          onChange={(e) => set({ currentJobTitle: e.target.value })}
          aria-label="Current Job Title"
        />
      </Field>
      <Field label="Target Job Title">
        <TextInput
          value={form.targetJobTitle ?? ''}
          onChange={(e) => set({ targetJobTitle: e.target.value })}
          aria-label="Target Job Title"
        />
      </Field>
      <Field label="Job Level">
        <Select
          value={form.jobLevel}
          onChange={(e) => set({ jobLevel: e.target.value as JobLevel })}
          aria-label="Job Level"
        >
          {JOB_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Department (optional)">
        <TextInput
          value={form.departmentText ?? ''}
          onChange={(e) => set({ departmentText: e.target.value })}
          aria-label="Department"
        />
      </Field>
      <Field label="Notes (optional)">
        <TextArea
          value={form.notes ?? ''}
          onChange={(e) => set({ notes: e.target.value })}
          aria-label="Notes"
        />
      </Field>

      {error && <p className="text-rose-600 text-[13px] mb-2.5">{error}</p>}

      <div className="flex gap-2.5 mt-2">
        <Button onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
      </div>
    </Drawer>
  );
}
