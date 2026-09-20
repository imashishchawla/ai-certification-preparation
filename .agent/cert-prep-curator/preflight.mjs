import fs from 'fs';
import path from 'path';

export function runPreflight(rootDir) {
  console.log('[Cert Prep Curator] Running preflight checks...');
  const errors = [];

  const reqDirs = [
    'content/exams/cca-f',
    'data/questions/cca-f',
    '.data/exams/cca-f',
    'themes/retro-prep',
    'scripts'
  ];

  reqDirs.forEach(d => {
    const p = path.join(rootDir, d);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required directory: ${d}`);
    }
  });

  const reqFiles = ['hugo.toml', 'data/exams.toml', 'data/questions/cca-f/questions.json'];
  reqFiles.forEach(f => {
    const p = path.join(rootDir, f);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required file: ${f}`);
    }
  });

  if (errors.length > 0) {
    console.error('[Cert Prep Curator] Preflight FAILED with errors:');
    errors.forEach(e => console.error('  - ' + e));
    return false;
  }

  console.log('[Cert Prep Curator] Preflight PASSED cleanly.');
  return true;
}

if (process.argv[1].endsWith('preflight.mjs')) {
  const rootDir = process.cwd();
  const ok = runPreflight(rootDir);
  process.exit(ok ? 0 : 1);
}
