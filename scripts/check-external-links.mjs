#!/usr/bin/env node
/**
 * check-external-links.mjs
 *
 * Scans the built Hugo site (public/) for external links and checks they return
 * a non-5xx HTTP response. Exits 0 if all reachable or 1 if any return 5xx.
 *
 * Called by: .github/workflows/deploy.yml (prepare job) and cli.mjs build-site
 * Run:  node scripts/check-external-links.mjs [--strict]
 *
 * Flags:
 *   --strict   Exit 1 on any non-2xx (including 3xx, 4xx). Default: only fail on 5xx.
 *   --timeout  Per-request timeout ms (default: 8000)
 *
 * Note: This is a best-effort check. DNS failures and TLS errors are logged as
 * warnings but do not cause a build failure (external sites may be temporarily down).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const STRICT  = process.argv.includes('--strict');
const TIMEOUT = (() => {
  const idx = process.argv.indexOf('--timeout');
  return idx !== -1 ? Number(process.argv[idx + 1]) || 8000 : 8000;
})();

// ── Collect all .html files ───────────────────────────────────────────────────

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

// ── Extract href/src values that look like external URLs ─────────────────────

function extractExternalUrls(html) {
  const urls = new Set();
  const re = /(?:href|src|action)="(https?:\/\/[^"#?]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const u = new URL(m[1]);
      // Skip known analytics / tracking / CDN noise
      if (/google|gstatic|cloudflare|fonts\.googleapis|unpkg|jsdelivr|cdnjs/.test(u.hostname)) continue;
      urls.add(u.href);
    } catch { /* skip malformed */ }
  }
  return urls;
}

// ── Check a single URL with timeout ──────────────────────────────────────────

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'cert-prep-link-checker/1.0' }
    });
    clearTimeout(timer);
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    clearTimeout(timer);
    return { url, status: 0, ok: false, error: err.message };
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(publicDir)) {
    console.warn('[check-links] public/ directory not found — skipping (Hugo not built yet)');
    process.exit(0);
  }

  const htmlFiles = walk(publicDir);
  if (htmlFiles.length === 0) {
    console.log('[check-links] No HTML files found in public/ — nothing to check');
    process.exit(0);
  }

  // Collect unique external URLs across all pages
  const allUrls = new Set();
  for (const f of htmlFiles) {
    const html = fs.readFileSync(f, 'utf8');
    for (const u of extractExternalUrls(html)) allUrls.add(u);
  }

  if (allUrls.size === 0) {
    console.log('[check-links] No external URLs found — done');
    process.exit(0);
  }

  console.log(`[check-links] Checking ${allUrls.size} unique external URLs (timeout=${TIMEOUT}ms, strict=${STRICT})...`);

  // Concurrency-limited checks (max 8 parallel)
  const CONCURRENCY = 8;
  const urlList = Array.from(allUrls);
  const results = [];

  for (let i = 0; i < urlList.length; i += CONCURRENCY) {
    const batch = urlList.slice(i, i + CONCURRENCY).map(checkUrl);
    results.push(...await Promise.all(batch));
  }

  let failures = 0;
  let warnings = 0;

  for (const r of results) {
    if (r.error) {
      console.warn(`  [WARN ] ${r.url} — ${r.error}`);
      warnings++;
    } else if (r.status >= 500) {
      console.error(`  [FAIL ] ${r.status} ${r.url}`);
      failures++;
    } else if (STRICT && !r.ok) {
      console.error(`  [FAIL ] ${r.status} ${r.url}`);
      failures++;
    } else {
      console.log(`  [  OK ] ${r.status} ${r.url}`);
    }
  }

  console.log(`\n[check-links] Done. ${results.length} checked, ${failures} failures, ${warnings} warnings`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('[check-links] Fatal:', err);
  process.exit(1);
});
