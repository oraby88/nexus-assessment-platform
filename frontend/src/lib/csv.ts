// Dependency-free CSV helper (research D3) — used by bulk upload (US1) and exports (US4).
// RFC-4180-ish: fields containing comma, quote, or newline are double-quoted; embedded quotes doubled.

/** Serialize rows to CSV text given an ordered column list (header row included). */
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const head = columns.map(escapeField).join(',');
  const body = rows.map((r) => columns.map((c) => escapeField(r[c])).join(','));
  return [head, ...body].join('\r\n');
}

function escapeField(value: unknown): string {
  const s = value == null ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Parse CSV text into row objects keyed by the header row (handles quotes/commas/newlines in fields). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows = parseRows(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((cells) => cells.some((c) => c.trim() !== '')) // skip blank lines
    .map((cells) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = (cells[i] ?? '').trim();
      });
      return obj;
    });
}

/** Tokenize CSV text into a grid of raw cell strings, honoring quoted fields. */
function parseRows(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      out.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  // flush trailing field/row
  if (field !== '' || row.length > 0) {
    row.push(field);
    out.push(row);
  }
  return out;
}
