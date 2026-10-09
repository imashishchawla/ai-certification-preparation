#!/usr/bin/env node
/**
 * build-browser-artifacts.mjs
 *
 * Post-Hugo step: reads compiled question banks from data/questions/<examId>/questions.json
 * and writes browser-ready shards into public/data/exams/<examId>/.
 *
 * Shards produced per exam:
 *   public/data/exams/<examId>/questions.json        — published practice questions only
 *   public/data/exams/<examId>/mock-pool.json        — published mock pool only
 *   public/data/exams/<examId>/manifest.json         — count + domain distribution + build metadata
 *
 * These files are NOT committed to git (public/ is gitignored after CI builds them).
 * Run: node scripts/build-browser-artifacts.mjs [examId...]
 *      If no examId is given, processes all exams found in data/questions/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publishedQuestionsForExam, mockQuestionsForExam } from './browser-question-pool.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function getExamIds(requested) {
  if (requested.length > 0) return requested;
  const qDir = path.join(rootDir, 'data/questions');
  if (!fs.existsSync(qDir)) return [];
  return fs.readdirSync(qDir).filter(f =>
    fs.statSync(path.join(qDir, f)).isDirectory()
  );
}

function buildForExam(examId) {
  const srcFile = path.join(rootDir, `data/questions/${examId}/questions.json`);
  if (!fs.existsSync(srcFile)) {
    console.warn(`[build-artifacts] SKIP ${examId}: no questions.json at ${srcFile}`);
    return;
  }

  let allQuestions;
  try {
    allQuestions = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
  } catch (e) {
    console.error(`[build-artifacts] ERROR ${examId}: invalid JSON — ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(allQuestions)) {
    console.error(`[build-artifacts] ERROR ${examId}: questions.json root must be an array`);
    process.exit(1);
  }

  // CCAF predates the released status and its reviewed ready bank is already public.
  // Other exams require explicit release before their questions enter browser artifacts.
  const publishedQuestions = publishedQuestionsForExam(allQuestions, examId);
  const mockQuestions = mockQuestionsForExam(allQuestions, examId);

  // Domain distribution from released pool
  const domainCounts = {};
  publishedQuestions.forEach(q => {
    const d = q.domain || 'unknown';
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  const manifest = {
    examId,
    buildAt: new Date().toISOString(),
    totalQuestions: allQuestions.length,
    publishedQuestions: publishedQuestions.length,
    mockQuestions: mockQuestions.length,
    releasedQuestions: allQuestions.filter(q => q.status === 'released').length,
    domainDistribution: domainCounts
  };

  const outDir = path.join(rootDir, `public/data/exams/${examId}`);
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(publishedQuestions, null, 2));
  fs.writeFileSync(path.join(outDir, 'mock-pool.json'), JSON.stringify(mockQuestions, null, 2));
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // If static/data/exams/<examId>/shared-175.json exists, copy to public artifact
  const sharedSrc = path.join(rootDir, `static/data/exams/${examId}/shared-175.json`);
  if (fs.existsSync(sharedSrc)) {
    fs.copyFileSync(sharedSrc, path.join(outDir, 'shared-175.json'));
  }

  console.log(`[build-artifacts] ${examId}: ${allQuestions.length} total, ${publishedQuestions.length} published → ${outDir}`);
}

const requested = process.argv.slice(2);
const examIds = getExamIds(requested);

if (examIds.length === 0) {
  console.warn('[build-artifacts] No exam directories found under data/questions/. Nothing to do.');
  process.exit(0);
}

examIds.forEach(buildForExam);
console.log('[build-artifacts] Done.');
