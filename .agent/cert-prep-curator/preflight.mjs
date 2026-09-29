import fs from 'fs';
import path from 'path';

/**
 * Run preflight checks for a given exam.
 * Reads sources.json v2.0.0 to discover which exams are registered,
 * then validates required dirs/files and creates runtime working directories.
 *
 * @param {string} rootDir  - repo root (process.cwd())
 * @param {string} examId   - exam identifier, e.g. 'cca-f' | 'terraform-associate'
 * @returns {boolean}       - true = PASSED, false = FAILED
 */
export function runPreflight(rootDir, examId = 'cca-f') {
  console.log(`[Cert Prep Curator] Running preflight checks for exam: ${examId}...`);
  const errors = [];

  // ── 1. Validate sources.json v2.0.0 is present and has this exam ──────────
  const sourcesPath = path.join(rootDir, '.agent/cert-prep-curator/sources.json');
  if (!fs.existsSync(sourcesPath)) {
    errors.push('Missing .agent/cert-prep-curator/sources.json');
  } else {
    let sourcesDoc;
    try {
      sourcesDoc = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    } catch (e) {
      errors.push(`sources.json is not valid JSON: ${e.message}`);
    }
    if (sourcesDoc) {
      if (!sourcesDoc.version || !sourcesDoc.version.startsWith('2.')) {
        errors.push(`sources.json must be v2.x.x (found: ${sourcesDoc.version || 'none'})`);
      } else if (!sourcesDoc.exams || !sourcesDoc.exams[examId]) {
        errors.push(`sources.json has no entry for exam '${examId}' under exams.*`);
      }
    }
  }

  // ── 2. Required tracked directories ───────────────────────────────────────
  const reqDirs = [
    `content/exams/${examId}`,
    `data/questions/${examId}`,
    'themes/retro-prep',
    'scripts'
  ];
  reqDirs.forEach(d => {
    const p = path.join(rootDir, d);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required directory: ${d}`);
    }
  });

  // ── 3. Required tracked files ──────────────────────────────────────────────
  const reqFiles = [
    'hugo.toml',
    'data/exams.toml',
    `data/questions/${examId}/questions.json`
  ];
  reqFiles.forEach(f => {
    const p = path.join(rootDir, f);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required file: ${f}`);
    }
  });

  // ── 4. Runtime working directories (gitignored, auto-created) ─────────────
  const runtimeDirs = [
    `.data/exams/${examId}`,
    `.data/exams/${examId}/raw`,
    `.data/exams/${examId}/processed`
  ];
  runtimeDirs.forEach(d => {
    const p = path.join(rootDir, d);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  });

  if (errors.length > 0) {
    console.error('[Cert Prep Curator] Preflight FAILED with errors:');
    errors.forEach(e => console.error('  - ' + e));
    return false;
  }

  console.log(`[Cert Prep Curator] Preflight PASSED cleanly for ${examId}.`);
  return true;
}

if (process.argv[1].endsWith('preflight.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  const ok = runPreflight(rootDir, examId);
  process.exit(ok ? 0 : 1);
}
