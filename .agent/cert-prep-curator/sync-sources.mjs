import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { syncCertyIQ } from './sync-certyiq.mjs';

/**
 * Validates whether an endpoint URL is trusted according to sources.json.
 */
export function isUrlTrusted(targetUrl, trustedSources) {
  try {
    const parsed = new URL(targetUrl);
    return trustedSources.some(source => {
      const sourceUrl = new URL(source.baseUrl);
      return parsed.hostname === sourceUrl.hostname || parsed.hostname.endsWith('.' + sourceUrl.hostname);
    });
  } catch {
    return false;
  }
}

/**
 * Fetches content from a URL via HTTP/HTTPS.
 */
export function fetchUrl(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'CertPrepCurator/1.0.0 (+https://www.revendum.com)'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle single redirect
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

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });

    req.on('error', err => reject(err));
  });
}

/**
 * Runs source synchronization against active sources.json entries.
 */
export async function syncSources(rootDir, examId = 'cca-f', options = { dryRun: false }) {
  const sourcesFilePath = path.join(rootDir, '.agent/cert-prep-curator/sources.json');
  const machineDir = path.join(rootDir, `.data/exams/${examId}`);
  const manifestPath = path.join(machineDir, 'manifest.json');
  const rawDir = path.join(machineDir, 'raw');

  if (!fs.existsSync(sourcesFilePath)) {
    console.error(`[Source Sync] Error: sources.json not found at ${sourcesFilePath}`);
    return { success: false, synced: 0, skipped: 0, errors: 1 };
  }

  const sourcesData = JSON.parse(fs.readFileSync(sourcesFilePath, 'utf8'));
  const sources = sourcesData.sources || [];
  console.log(`[Source Sync] Checking ${sources.length} trusted sources for ${examId}...`);

  fs.mkdirSync(rawDir, { recursive: true });
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }

  let synced = 0;
  let skipped = 0;
  let errors = 0;
  const changes = [];

  for (const source of sources) {
    if (!source.active) continue;

    if (source.id === 'certyiq') {
      if (!options.dryRun) {
        try {
          await syncCertyIQ(rootDir, examId);
          synced++;
        } catch (err) {
          console.warn(`[Source Sync] CertyIQ API sync warning: ${err.message}`);
          errors++;
        }
      } else {
        console.log(`[DRY RUN] Would sync CertyIQ via API`);
        skipped++;
      }
      continue;
    }
      if (!isUrlTrusted(endpoint, sources)) {
        console.warn(`[Source Sync] UNTRUSTED SOURCE BLOCKED: ${endpoint}`);
        errors++;
        continue;
      }

      const fileSlug = endpoint.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const manifestEntry = manifest[endpoint] || {};

      try {
        if (options.dryRun) {
          console.log(`[DRY RUN] Would sync: ${endpoint}`);
          skipped++;
          continue;
        }

        console.log(`[Source Sync] Checking ${endpoint}...`);
        const content = await fetchUrl(endpoint);
        const hash = crypto.createHash('sha256').update(content).digest('hex');

        if (manifestEntry.hash === hash) {
          console.log(`  -> Unchanged (${hash.slice(0, 8)}). Skipping.`);
          skipped++;
        } else {
          console.log(`  -> Content updated! (${hash.slice(0, 8)})`);
          const targetSubdir = path.join(rawDir, source.category, source.id);
          fs.mkdirSync(targetSubdir, { recursive: true });
          const targetFile = path.join(targetSubdir, `${fileSlug}.txt`);

          fs.writeFileSync(targetFile, content);
          manifest[endpoint] = {
            sourceId: source.id,
            category: source.category,
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

  if (!options.dryRun) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  console.log(`[Source Sync] Done. ${synced} updated, ${skipped} unchanged, ${errors} warnings.`);
  return { success: true, synced, skipped, errors, changes };
}

if (process.argv[1]?.endsWith('sync-sources.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  syncSources(rootDir, examId);
}
