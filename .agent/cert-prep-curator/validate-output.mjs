import { fileURLToPath } from 'node:url';
import { validateExamFile } from '../../scripts/question-validation.mjs';

export function runValidation(rootDir, examId = 'cca-f') {
  const { count, errors } = validateExamFile(rootDir, examId);
  for (const error of errors) console.error(`[${examId}] ${error}`);
  console.log(`[Cert Prep Curator] ${examId}: ${count} questions checked; ${errors.length} errors`);
  return errors.length === 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(runValidation(process.cwd(), process.argv[2] || 'cca-f') ? 0 : 1);
}
