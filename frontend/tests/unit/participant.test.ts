import { describe, it, expect, beforeEach } from 'vitest';
import { participantService } from '@/services/participant/participantService';
import { setMockFailRate } from '@/services/http';

// FR-ADM-003 / FR-ADM-004 / SC-001 / SC-002
describe('participantService add + bulk upload', () => {
  beforeEach(() => setMockFailRate(0));

  it('adds a new person with valid fields', async () => {
    const p = await participantService.add({
      fullName: 'New Person',
      email: 'new.person@meridian.co',
      jobLevel: 'Professional',
    });
    expect(p.id).toMatch(/^CND-/);
    expect(p.fullName).toBe('New Person');
  });

  it('rejects a duplicate email', async () => {
    await expect(
      participantService.add({
        fullName: 'Dup',
        email: 'amara.okonkwo@meridian.co',
        jobLevel: 'Manager',
      }),
    ).rejects.toThrow(/already exists/i);
  });

  it('rejects missing/invalid required fields', async () => {
    await expect(
      participantService.add({ fullName: '', email: 'bad', jobLevel: 'Manager' }),
    ).rejects.toThrow(/Full Name|Email/);
  });

  it('classifies CSV rows into valid / invalid / duplicate', async () => {
    const csv = [
      'Full Name,Email,Job Level',
      'Jamie Rivera,jamie.rivera@meridian.co,Professional', // valid
      ',not-an-email,Manager', // invalid: missing name + bad email
      'Jamie Again,jamie.rivera@meridian.co,Manager', // duplicate in-file
      'Existing,amara.okonkwo@meridian.co,Manager', // duplicate in-org
    ].join('\n');
    const r = await participantService.bulkUpload(csv);
    expect(r.valid).toHaveLength(1);
    expect(r.invalid).toHaveLength(1);
    expect(r.duplicate).toHaveLength(2);
  });

  it('imports only confirmed valid rows', async () => {
    const csv = ['Full Name,Email,Job Level', 'Import Me,import.me@meridian.co,Manager'].join('\n');
    const r = await participantService.bulkUpload(csv);
    const added = await participantService.confirmImport(r.valid);
    expect(added).toHaveLength(1);
    expect(added[0].email).toBe('import.me@meridian.co');
  });
});
