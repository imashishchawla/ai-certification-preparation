import fs from 'node:fs';
import path from 'node:path';
import { validateExamFile } from './question-validation.mjs';
import { publishedQuestionsForExam } from './browser-question-pool.mjs';

const rootDir = process.cwd();
const questionRoot = path.join(rootDir, 'data/questions');
const exams = process.argv.slice(2);
const examIds = exams.length ? exams : fs.readdirSync(questionRoot).filter(name =>
  fs.statSync(path.join(questionRoot, name)).isDirectory() &&
  fs.existsSync(path.join(questionRoot, name, 'questions.json'))
);

let total = 0;
let failures = 0;
for (const examId of examIds) {
  const result = validateExamFile(rootDir, examId);
  total += result.count;
  failures += result.errors.length;
  for (const error of result.errors) console.error(`[${examId}] ${error}`);
  console.log(`[${examId}] ${result.count} questions checked; ${result.errors.length} errors`);
}
if (examIds.includes('cca-f')) {
  const source = JSON.parse(fs.readFileSync(path.join(questionRoot, 'cca-f/questions.json'), 'utf8'));
  const staticFile = path.join(rootDir, 'static/data/questions/cca-f/questions.json');
  if (fs.existsSync(staticFile)) {
    const expected = publishedQuestionsForExam(source, 'cca-f');
    const actual = JSON.parse(fs.readFileSync(staticFile, 'utf8'));
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      failures++;
      console.error('[cca-f] legacy static question copy must contain exactly the published source records');
    }
  }
}
if (failures) process.exit(1);
console.log(`Schema and question validation PASSED: ${total} questions checked.`);
