// Initial-bundle budget check (Spec 009 / US4, FR-PVR-012, SC-007). Run AFTER `vite build`. Sums the
// initial EAGER JS — the entry module plus its statically-preloaded chunks referenced from
// dist/index.html — and fails if the raw total exceeds the budget. Lazy (dynamic-import) chunks
// (e.g. the governed bank, feature routes) are NOT preloaded in index.html, so they're excluded.
// Uses only Node built-ins (fs + zlib) — no extra dependency.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '../dist');
const INDEX_HTML = join(DIST, 'index.html');

const BUDGET_RAW_BYTES = 266_240; // 260 KB (FR-PVR-012)
const BUDGET_GZIP_APPROX = 87_040; // ~85 KB (reported, not enforced)

function fail(msg) {
  console.error(`✗ check-bundle: ${msg}`);
  process.exit(1);
}

if (!existsSync(INDEX_HTML)) {
  fail(`dist/index.html not found — run \`vite build\` first (looked in ${DIST}).`);
}

const html = readFileSync(INDEX_HTML, 'utf8');

// The eager set = the entry <script type="module" src> + every <link rel="modulepreload" href>.
const eager = new Set();
const scriptRe = /<script[^>]*type="module"[^>]*src="([^"]+)"/g;
const preloadRe = /<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g;
for (const re of [scriptRe, preloadRe]) {
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1].endsWith('.js')) eager.add(m[1]);
  }
}

if (eager.size === 0) {
  fail('no eager module scripts found in dist/index.html — build output unexpected.');
}

let rawTotal = 0;
let gzipTotal = 0;
const rows = [];
const eagerGsap = []; // Spec 011 / FR-SSP-012: GSAP must stay lazy — never in the eager chunk.
for (const href of eager) {
  const rel = href.replace(/^\//, '');
  const file = join(DIST, rel);
  if (!existsSync(file)) fail(`referenced chunk missing on disk: ${rel}`);
  const buf = readFileSync(file);
  // GSAP's runtime registers a `_gsap` global marker; its presence in an eager chunk means GSAP
  // leaked out of its lazy chunk (a static `import 'gsap'` crept in).
  if (buf.includes('_gsap')) eagerGsap.push(rel);
  const gz = gzipSync(buf).length;
  rawTotal += buf.length;
  gzipTotal += gz;
  rows.push({ rel, raw: buf.length, gz });
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log('Initial eager JS chunks:');
for (const r of rows.sort((a, b) => b.raw - a.raw)) {
  console.log(`  ${r.rel}  ${kb(r.raw)} raw / ${kb(r.gz)} gzip`);
}
console.log(
  `Total: ${kb(rawTotal)} raw / ${kb(gzipTotal)} gzip  (budget ${kb(BUDGET_RAW_BYTES)} raw, ~${kb(
    BUDGET_GZIP_APPROX,
  )} gzip)`,
);

if (rawTotal > BUDGET_RAW_BYTES) {
  fail(
    `initial eager JS ${kb(rawTotal)} raw exceeds the ${kb(BUDGET_RAW_BYTES)} budget. ` +
      `Split a heavy dependency into a lazy chunk (FR-PVR-012/013).`,
  );
}

if (eagerGsap.length > 0) {
  fail(
    `GSAP found in the eager chunk(s): ${eagerGsap.join(', ')}. ` +
      `GSAP MUST stay lazy (import('gsap') via lib/gsap) — Spec 011 FR-SSP-012.`,
  );
}

console.log(
  `✓ check-bundle: within budget (${kb(rawTotal)} raw ≤ ${kb(BUDGET_RAW_BYTES)}); GSAP not in the eager chunk.`,
);
