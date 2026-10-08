import fs from 'node:fs';
import path from 'node:path';
import { reviewFlags } from './cca-f-review-flags.mjs';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'data/questions/cca-f/questions.json');
const staticCopy = path.join(root, 'static/data/questions/cca-f/questions.json');
const questions = JSON.parse(fs.readFileSync(source, 'utf8'));
const ids = new Set(questions.map(question => question.id));
for (const id of reviewFlags.keys()) {
  if (!ids.has(id)) throw new Error(`Review flag points to missing question: ${id}`);
}

let changed = 0;
for (const question of questions) {
  const flag = reviewFlags.get(question.id);
  if (!flag) continue;
  const next = {
    status: 'quarantined',
    reviewStatus: 'needs-review',
    mockEligible: false,
    qualityReview: { ...flag, guide: 'CCAR-F Exam Guide v1.0, July 2026', reviewedOn: '2026-10-08' }
  };
  if (Object.entries(next).some(([key, value]) => JSON.stringify(question[key]) !== JSON.stringify(value))) changed++;
  Object.assign(question, next);
}

if (!process.argv.includes('--write')) {
  console.log(`Dry run: ${reviewFlags.size} flagged questions; ${changed} records would change. Pass --write to apply.`);
  process.exit(0);
}

const serialized = `${JSON.stringify(questions, null, 2)}\n`;
fs.writeFileSync(source, serialized);
const published = questions.filter(question => question.status === 'ready' || question.status === 'released');
fs.writeFileSync(staticCopy, `${JSON.stringify(published, null, 2)}\n`);
console.log(`Quarantined ${reviewFlags.size} flagged questions (${changed} changed); wrote ${published.length} published questions to the legacy static copy.`);
