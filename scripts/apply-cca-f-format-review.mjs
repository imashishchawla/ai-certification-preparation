import fs from 'node:fs';
import path from 'node:path';
import { recallOnlyIds, recallOnlySet, lacksMockContext } from './cca-f-format-review.mjs';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'data/questions/cca-f/questions.json');
const staticCopy = path.join(root, 'static/data/questions/cca-f/questions.json');
const questions = JSON.parse(fs.readFileSync(source, 'utf8'));
const ids = new Set(questions.map(question => question.id));
for (const id of recallOnlyIds) if (!ids.has(id)) throw new Error(`Missing recall-only question: ${id}`);

let changed = 0;
let flagged = 0;
for (const question of questions) {
  if (question.status !== 'ready' && question.status !== 'released') continue;
  if (!recallOnlySet.has(question.id) && !lacksMockContext(question)) continue;
  if (recallOnlySet.has(question.id) && question.scenario) throw new Error(`Recall-only question already has a scenario: ${question.id}`);
  flagged++;
  if (question.mockEligible !== false || question.reviewStatus !== 'needs-rewrite') changed++;
  question.mockEligible = false;
  question.reviewStatus = 'needs-rewrite';
  question.qualityReview = {
    code: recallOnlySet.has(question.id) ? 'recall-only' : 'short-without-scenario',
    reason: 'Useful for study, but this short stem has no separate scenario and is too thin for an exam-style mock; rewrite before mock use.',
    guide: 'CCAR-F Exam Guide v1.0, July 2026',
    reviewedOn: '2026-10-08'
  };
}

if (!process.argv.includes('--write')) {
  console.log(`Dry run: ${flagged} study-only questions (${recallOnlyIds.length} explicit recall); ${changed} would change. Pass --write to apply.`);
  process.exit(0);
}
fs.writeFileSync(source, `${JSON.stringify(questions, null, 2)}\n`);
fs.writeFileSync(staticCopy, `${JSON.stringify(questions.filter(question => question.status === 'ready' || question.status === 'released'), null, 2)}\n`);
console.log(`Excluded ${flagged} study-only questions from timed mocks (${changed} changed).`);
