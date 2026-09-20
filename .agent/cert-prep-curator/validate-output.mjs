import fs from 'fs';
import path from 'path';

export function runValidation(rootDir, examId = 'cca-f') {
  console.log(`[Cert Prep Curator] Validating question data for exam: ${examId}...`);
  const dataPath = path.join(rootDir, `data/questions/${examId}/questions.json`);

  if (!fs.existsSync(dataPath)) {
    console.error(`ERROR: File not found at ${dataPath}`);
    return false;
  }

  const questions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  let errors = 0;

  questions.forEach((q, idx) => {
    const label = `[Item #${idx + 1} ID: ${q.id}]`;
    if (!q.id || !q.exam || !q.domain || !q.prompt || !q.correct || !q.options) {
      console.error(`${label} Missing required fields.`);
      errors++;
    }

    if (q.options.length !== 4) {
      console.error(`${label} Expected 4 options, found ${q.options.length}`);
      errors++;
    }

    const ids = q.options.map(o => o.id);
    if (JSON.stringify(ids) !== JSON.stringify(['A', 'B', 'C', 'D'])) {
      console.error(`${label} Option IDs must be A, B, C, D.`);
      errors++;
    }

    if (!['A', 'B', 'C', 'D'].includes(q.correct)) {
      console.error(`${label} Invalid correct choice: ${q.correct}`);
      errors++;
    }

    if (/✔|✅|\[CORRECT\]|^\s*\(?(?:Correct|Answer|Explanation)\s*[:\)]/i.test(q.prompt)) {
      console.error(`${label} Prompt contains answer key markers.`);
      errors++;
    }

    q.options.forEach(opt => {
      if (/✔|✅|\[CORRECT\]|^\s*\(?(?:Correct|Answer)\s*[:\)]/i.test(opt.text)) {
        console.error(`${label} Option ${opt.id} contains answer key marker.`);
        errors++;
      }
    });
  });

  if (errors > 0) {
    console.error(`[Cert Prep Curator] Validation FAILED with ${errors} error(s).`);
    return false;
  }

  console.log(`[Cert Prep Curator] Validation PASSED: ${questions.length} questions valid.`);
  return true;
}

if (process.argv[1].endsWith('validate-output.mjs')) {
  const rootDir = process.cwd();
  const ok = runValidation(rootDir);
  process.exit(ok ? 0 : 1);
}
