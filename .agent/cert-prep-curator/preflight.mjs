import fs from 'fs';
import path from 'path';

export function runPreflight(rootDir, examId = 'cca-f') {
  console.log('[Cert Prep Curator] Running preflight checks...');
  const errors = [];

  // Required repository directories (tracked in git)
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

  const reqFiles = ['hugo.toml', 'data/exams.toml', `data/questions/${examId}/questions.json`];
  reqFiles.forEach(f => {
    const p = path.join(rootDir, f);
    if (!fs.existsSync(p)) {
      errors.push(`Missing required file: ${f}`);
    }
  });

  // Ensure local runtime working directories exist (gitignored)
  const runtimeDirs = [
    `.data/exams/${examId}`
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

  console.log('[Cert Prep Curator] Preflight PASSED cleanly.');
  return true;
}

if (process.argv[1].endsWith('preflight.mjs')) {
  const rootDir = process.cwd();
  const examId = process.argv[2] || 'cca-f';
  const ok = runPreflight(rootDir, examId);
  process.exit(ok ? 0 : 1);
}
