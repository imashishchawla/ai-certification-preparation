import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { syncCertyIQ } from './sync-certyiq.mjs';

/**
 * Validates whether an endpoint URL is trusted — its hostname matches one of the
 * registered source base URLs (or the source's allowed_redirect_hosts list).
 */
export function isUrlTrusted(targetUrl, sources) {
  try {
    const parsed = new URL(targetUrl);
    return sources.some(source => {
      // Check base url hostname
      try {
        const baseHostname = new URL(source.url).hostname;
        if (parsed.hostname === baseHostname || parsed.hostname.endsWith('.' + baseHostname)) {
          return true;
        }
      } catch { /* skip malformed base URLs */ }

      // Check allowed_redirect_hosts
      return (source.allowed_redirect_hosts || []).some(
        h => parsed.hostname === h || parsed.hostname.endsWith('.' + h)
      );
    });
  } catch {
    return false;
  }
}

/**
 * Fetches content from a URL via HTTP/HTTPS with a single redirect follow.
 */
export function fetchUrl(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'CertPrepCurator/2.0.0 (+https://www.revendum.com)' }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeoutMs).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`Timeout fetching ${url}`)); });
    req.on('error', reject);
  });
}

/**
 * Runs source synchronization for the given exam ID.
 *
 * Reads sources from the v2.0.0 multi-exam registry at
 * .agent/cert-prep-curator/sources.json under exams.<examId>.sources[].
 *
 * Dispatches to the appropriate adapter based on each source's parser_adapter:
 *   certyiq-api → syncCertyIQ (exam-agnostic, config-driven)
 *   http-generic → standard URL fetch + hash manifest
 *
 * @param {string} rootDir
 * @param {string} examId
 * @param {{ dryRun?: boolean, timeoutMs?: number }} [options]
 */
export async function syncSources(rootDir, examId = 'cca-f', options = {}) {
  const { dryRun = false, timeoutMs = 15000 } = options;

  const sourcesFilePath = path.join(rootDir, '.agent/cert-prep-curator/sources.json');
  if (!fs.existsSync(sourcesFilePath)) {
    console.error(`[Source Sync] Error: sources.json not found at ${sourcesFilePath}`);
    return { success: false, synced: 0, skipped: 0, errors: 1 };
  }

  const registry = JSON.parse(fs.readFileSync(sourcesFilePath, 'utf8'));

  // v2.0.0 format: registry.exams.<examId>.sources[]
  // Guard against accidentally running against v1.0.0 format
  if (!registry.exams || !registry.exams[examId]) {
    console.error(`[Source Sync] No sources entry found for exam "${examId}" in sources.json.`);
    console.error(`  Make sure sources.json is v2.0.0 format with an "exams" key.`);
    return { success: false, synced: 0, skipped: 0, errors: 1 };
  }

  const sources = registry.exams[examId].sources || [];
  const machineDir = path.join(rootDir, `.data/exams/${examId}`);
  const manifestPath = path.join(machineDir, 'manifest.json');
  const rawDir = path.join(machineDir, 'raw');

  console.log(`[Source Sync] exam=${examId} sources=${sources.length} dryRun=${dryRun}`);

  fs.mkdirSync(rawDir, { recursive: true });

  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }

  let synced = 0, skipped = 0, errors = 0;
  const changes = [];

  for (const source of sources) {
    if (!source.active) {
      console.log(`[Source Sync] SKIP inactive source: ${source.id}`);
      skipped++;
      continue;
    }

    // ── CertyIQ API adapter ──────────────────────────────────────────────────
    if (source.parser_adapter === 'certyiq-api') {
      if (dryRun) {
        console.log(`[DRY RUN] Would sync CertyIQ via API: source=${source.id} exam=${examId}`);
        skipped++;
      } else {
        try {
          const result = await syncCertyIQ(rootDir, examId, source);
          console.log(`[Source Sync] certyiq-api ok: core=${result.coreCount} all=${result.allCount}`);
          synced++;
        } catch (err) {
          console.warn(`[Source Sync] certyiq-api error (${source.id}): ${err.message}`);
          errors++;
        }
      }
      continue;
    }

    // ── Generic HTTP adapter ─────────────────────────────────────────────────
    const endpoints = source.endpoints || (source.url ? [source.url] : []);
    if (endpoints.length === 0) {
      console.warn(`[Source Sync] source "${source.id}" has no endpoints — skipping`);
      skipped++;
      continue;
    }

    for (const endpoint of endpoints) {
      if (!isUrlTrusted(endpoint, sources)) {
        console.warn(`[Source Sync] UNTRUSTED SOURCE BLOCKED: ${endpoint}`);
        errors++;
        continue;
      }

      const fileSlug = endpoint.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const manifestEntry = manifest[endpoint] || {};

      if (dryRun) {
        console.log(`[DRY RUN] Would sync: ${endpoint}`);
        skipped++;
        continue;
      }

      try {
        console.log(`[Source Sync] Checking ${endpoint}...`);
        const content = await fetchUrl(endpoint, timeoutMs);
        const hash = crypto.createHash('sha256').update(content).digest('hex');

        if (manifestEntry.hash === hash) {
          console.log(`  -> Unchanged (${hash.slice(0, 8)}). Skipping.`);
          skipped++;
        } else {
          console.log(`  -> Updated (${hash.slice(0, 8)})`);
          const category = source.publication_mode || 'unknown';
          const targetSubdir = path.join(rawDir, category, source.id);
          fs.mkdirSync(targetSubdir, { recursive: true });
          const targetFile = path.join(targetSubdir, `${fileSlug}.txt`);
          fs.writeFileSync(targetFile, content);
          manifest[endpoint] = {
            sourceId: source.id,
            category,
            hash,
            lastChecked: new Date().toISOString(),
            savedPath: path.relative(rootDir, targetFile)
          };
          changes.push({ endpoint, sourceId: source.id, hash });
          synced++;
        }
      } catch (err) {
        console.warn(`[Source Sync] Notice: ${endpoint} (${err.message}). Preserving cached version.`);
        errors++;
      }
    }
  }

  if (!dryRun) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  console.log(`[Source Sync] Done. synced=${synced} unchanged=${skipped} errors=${errors}`);
  return { success: true, synced, skipped, errors, changes };
}

if (process.argv[1]?.endsWith('sync-sources.mjs')) {
  const rootDir = process.cwd();
  const examId  = process.argv[2] || 'cca-f';
  const dryRun  = process.argv.includes('--dry-run');
  syncSources(rootDir, examId, { dryRun }).catch(err => {
    console.error('[Source Sync] Fatal:', err);
    process.exit(1);
  });
}
