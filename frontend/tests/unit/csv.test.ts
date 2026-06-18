import { describe, it, expect } from 'vitest';
import { toCsv, parseCsv } from '@/lib/csv';

describe('lib/csv (research D3)', () => {
  it('serializes rows with a header and quotes fields needing it', () => {
    const csv = toCsv(
      [
        { name: 'Amara', note: 'a, b' },
        { name: 'Lena "L"', note: 'x\ny' },
      ],
      ['name', 'note'],
    );
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('name,note');
    expect(lines[1]).toBe('Amara,"a, b"');
    expect(lines[2]).toBe('"Lena ""L""","x\ny"');
  });

  it('round-trips quoted fields with commas, quotes, and newlines', () => {
    const rows = [{ a: 'plain', b: 'has, comma', c: 'line1\nline2', d: 'say "hi"' }];
    const cols = ['a', 'b', 'c', 'd'];
    const parsed = parseCsv(toCsv(rows, cols));
    expect(parsed).toEqual(rows);
  });

  it('skips blank lines and trims header/cells', () => {
    const parsed = parseCsv('name, email\nAmara, a@x.co\n\n');
    expect(parsed).toEqual([{ name: 'Amara', email: 'a@x.co' }]);
  });

  it('returns empty array for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });
});
