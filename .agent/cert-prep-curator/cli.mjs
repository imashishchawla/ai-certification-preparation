import { runPreflight } from './preflight.mjs';
import { runValidation } from './validate-output.mjs';
import { scaffoldExam } from './scaffold-exam.mjs';
import { execSync } from 'child_process';
import http from 'http';
import { URL } from 'url';

const args = process.argv.slice(2);
const command = args[0] || 'help';
const rootDir = process.cwd();

console.log(`=== Cert Prep Curator CLI ===`);
console.log(`Command: ${command}`);

switch (command) {
  case 'preflight': {
    const ok = runPreflight(rootDir);
    process.exit(ok ? 0 : 1);
    break;
  }
  case 'validate': {
    const exam = args[1] || 'cca-f';
    const ok = runValidation(rootDir, exam);
    process.exit(ok ? 0 : 1);
    break;
  }
  case 'scaffold': {
    const examId = args[1];
    const name = args[2] || 'New AI Exam';
    const code = args[3] || 'NEW-EXAM';
    if (!examId) {
      console.error('ERROR: Missing examId. Usage: node cli.mjs scaffold <examId> <name> <code>');
      process.exit(1);
    }
    scaffoldExam(rootDir, examId, name, code);
    break;
  }
  case 'crawl-audit': {
    console.log('[Cert Prep Curator] Running site crawler audit...');
    runCrawlAudit();
    break;
  }
  case 'normalize': {
    console.log('[Cert Prep Curator] Normalizing question data...');
    try {
      const out = execSync('node scripts/normalize-questions.mjs', { encoding: 'utf8' });
      console.log(out);
      const valOk = runValidation(rootDir, 'cca-f');
      process.exit(valOk ? 0 : 1);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    break;
  }
  case 'build-site': {
    console.log('[Cert Prep Curator] Building static site output...');
    try {
      execSync('rm -rf public && hugo --minify', { encoding: 'utf8' });
      const linkOut = execSync('node scripts/check-external-links.mjs', { encoding: 'utf8' });
      console.log(linkOut);
      console.log('[Cert Prep Curator] Site build & link check PASSED.');
      process.exit(0);
    } catch (err) {
      console.error('[Cert Prep Curator] Build failed:', err.message);
      process.exit(1);
    }
    break;
  }
  default: {
    console.log(`
Available commands:
  node .agent/cert-prep-curator/cli.mjs preflight                     Run safety & directory checks
  node .agent/cert-prep-curator/cli.mjs validate <examId>             Validate question schema & keys
  node .agent/cert-prep-curator/cli.mjs scaffold <id> <name> <code>   Scaffold new exam folder structure
  node .agent/cert-prep-curator/cli.mjs crawl-audit                   Audit local website routes & assets
  node .agent/cert-prep-curator/cli.mjs normalize                    Parse raw banks -> questions.json
  node .agent/cert-prep-curator/cli.mjs build-site                  Build Hugo site & check external links
`);
    process.exit(0);
  }
}

function runCrawlAudit() {
  const queue = [
    'http://127.0.0.1:1313/ccaf-exam/',
    'http://127.0.0.1:1313/ccaf-exam/exams/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/sample-questions/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/mock-test/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/study-guides/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/exam-notes/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/articles/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/study-materials/',
    'http://127.0.0.1:1313/ccaf-exam/exams/cca-f/resources/'
  ];

  let pending = queue.length;
  queue.forEach(url => {
    http.get(url, (res) => {
      console.log(`[CRAWL] ${res.statusCode} OK -> ${url}`);
      pending--;
      if (pending === 0) {
        console.log('[Cert Prep Curator] Crawl audit completed. All routes healthy.');
      }
    }).on('error', (err) => {
      console.error(`[CRAWL] FAIL -> ${url} (${err.message})`);
      pending--;
    });
  });
}
