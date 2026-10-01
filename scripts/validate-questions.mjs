import fs from 'node:fs';
import path from 'node:path';
import { validateExamFile } from './question-validation.mjs';

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
if (failures) process.exit(1);
console.log(`Schema and question validation PASSED: ${total} questions checked.`);
