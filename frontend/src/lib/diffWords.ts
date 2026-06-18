// Dependency-free word-level diff for the rephrase panel (research D5). Returns the adapted text as
// spans, marking inserted/changed words (changed=true). Used to make display-only edits auditable.
import type { DiffSpan } from '@/models';

export function diffWords(original: string, adapted: string): DiffSpan[] {
  const a = original.split(/(\s+)/);
  const b = adapted.split(/(\s+)/);
  const m = a.length;
  const n = b.length;
  // LCS length table.
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const spans: DiffSpan[] = [];
  const push = (text: string, changed: boolean) => {
    if (text === '') return;
    const last = spans[spans.length - 1];
    if (last && last.changed === changed) last.text += text;
    else spans.push({ text, changed });
  };
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      push(b[j], false);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++; // word removed from original — not shown in adapted output
    } else {
      push(b[j], true); // word inserted/changed in adapted
      j++;
    }
  }
  while (j < n) {
    push(b[j], true);
    j++;
  }
  return spans;
}
