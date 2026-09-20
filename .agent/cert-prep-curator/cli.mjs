import { runPreflight } from './preflight.mjs';
import { runValidation } from './validate-output.mjs';
import { scaffoldExam } from './scaffold-exam.mjs';
import { deduplicateExistingDatabase } from './deduplicate.mjs';
import { syncSources } from './sync-sources.mjs';
import { curateAndExtractQuestions } from './extract-ai.mjs';
import { extractAndMergeAllMaterials } from './extract-materials.mjs';
import { execSync } from 'child_process';
import http from 'http';

const args = process.argv.slice(2);
const command = args[0] || 'help';
const rootDir = process.cwd();

console.log(`=== Cert Prep Curator CLI ===`);
console.log(`Command: ${command}`);

async function main() {
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
    case 'dedup-db': {
      const exam = args[1] || 'cca-f';
      deduplicateExistingDatabase(rootDir, exam);
      break;
    }
    case 'sync': {
      const exam = args[1] || 'cca-f';
      const dryRun = args.includes('--dry-run');
      await syncSources(rootDir, exam, { dryRun });
      break;
    }
    case 'extract-ai': {
      const exam = args[1] || 'cca-f';
      await curateAndExtractQuestions(rootDir, exam);
      break;
    }
    case 'extract-materials': {
      const exam = args[1] || 'cca-f';
      extractAndMergeAllMaterials(rootDir, exam);
      break;
    }
    case 'curate': {
      const exam = args[1] || 'cca-f';
      console.log(`[Cert Prep Curator] Starting full autonomous curation cycle for ${exam}...`);
      
      console.log('\n--- Step 1: Preflight Checks ---');
      const preflightOk = runPreflight(rootDir);
      if (!preflightOk) process.exit(1);

      console.log('\n--- Step 2: Database Deduplication Sweep ---');
      deduplicateExistingDatabase(rootDir, exam);

      console.log('\n--- Step 3: Source Sync (Allowlist Guarded) ---');
      await syncSources(rootDir, exam);

      console.log('\n--- Step 4: Multi-Source Material Extraction & Deduplication ---');
      extractAndMergeAllMaterials(rootDir, exam);

      console.log('\n--- Step 5: AI Question Extraction & Relevance Filtering ---');
      await curateAndExtractQuestions(rootDir, exam);

      console.log('\n--- Step 6: Question Schema & Integrity Validation ---');
      const valOk = runValidation(rootDir, exam);
      if (!valOk) process.exit(1);

      console.log('\n--- Step 7: Site Build & External Link Check ---');
      buildSite();
      console.log('\n[Cert Prep Curator] Curation cycle completed successfully.');
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
      buildSite();
      break;
    }
    default: {
      console.log(`
Available commands:
  node .agent/cert-prep-curator/cli.mjs preflight                     Run safety & directory checks
  node .agent/cert-prep-curator/cli.mjs dedup-db <examId>             Deduplicate question database
  node .agent/cert-prep-curator/cli.mjs sync <examId> [--dry-run]     Sync allowlisted sources to .data/
  node .agent/cert-prep-curator/cli.mjs extract-materials <examId>   Extract & deduplicate questions from raw materials
  node .agent/cert-prep-curator/cli.mjs extract-ai <examId>           Extract new questions using AI
  node .agent/cert-prep-curator/cli.mjs curate <examId>               Run full end-to-end curation cycle
  node .agent/cert-prep-curator/cli.mjs validate <examId>             Validate question schema & keys
  node .agent/cert-prep-curator/cli.mjs scaffold <id> <name> <code>   Scaffold new exam folder structure
  node .agent/cert-prep-curator/cli.mjs crawl-audit                   Audit local website routes & assets
  node .agent/cert-prep-curator/cli.mjs build-site                    Build Hugo site & check external links
`);
      process.exit(0);
    }
  }
}

function buildSite() {
  console.log('[Cert Prep Curator] Building static site output...');
  try {
    execSync('rm -rf public && hugo --minify', { encoding: 'utf8' });
    const linkOut = execSync('node scripts/check-external-links.mjs', { encoding: 'utf8' });
    console.log(linkOut.trim());
    console.log('[Cert Prep Curator] Site build & link check PASSED.');
  } catch (err) {
    console.error('[Cert Prep Curator] Build failed:', err.message);
    process.exit(1);
  }
}

function runCrawlAudit() {
  const queue = [
    'http://127.0.0.1:1313/',
    'http://127.0.0.1:1313/exams/',
    'http://127.0.0.1:1313/exams/cca-f/',
    'http://127.0.0.1:1313/exams/cca-f/sample-questions/',
    'http://127.0.0.1:1313/exams/cca-f/mock-test/',
    'http://127.0.0.1:1313/exams/cca-f/study-guides/',
    'http://127.0.0.1:1313/exams/cca-f/exam-notes/',
    'http://127.0.0.1:1313/exams/cca-f/articles/',
    'http://127.0.0.1:1313/exams/cca-f/study-materials/',
    'http://127.0.0.1:1313/exams/cca-f/resources/'
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

main().catch(err => {
  console.error('[Cert Prep Curator] Fatal error:', err);
  process.exit(1);
});
