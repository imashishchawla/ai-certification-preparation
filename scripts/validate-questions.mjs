import fs from 'fs';
import path from 'path';

const rootDir = '/Users/ashishchawla/Documents/My-DIY-Projects/n8-rev-build/neighter/ccaf-exam';
const dataPath = path.join(rootDir, 'data/questions/cca-f/questions.json');

if (!fs.existsSync(dataPath)) {
  console.error(`ERROR: Question file not found at ${dataPath}`);
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let errors = 0;

questions.forEach((q, index) => {
  const prefix = `[Q #${index + 1} ID: ${q.id}]`;

  if (!q.id || !q.exam || !q.domain || !q.prompt || !q.correct || !q.options) {
    console.error(`${prefix} Missing required fields.`);
    errors++;
  }

  if (q.options.length !== 4) {
    console.error(`${prefix} Expected 4 options, found ${q.options.length}`);
    errors++;
  }

  const optionIds = q.options.map(o => o.id);
  if (JSON.stringify(optionIds) !== JSON.stringify(['A', 'B', 'C', 'D'])) {
    console.error(`${prefix} Option IDs are not ['A', 'B', 'C', 'D']: ${JSON.stringify(optionIds)}`);
    errors++;
  }

  if (!['A', 'B', 'C', 'D'].includes(q.correct)) {
    console.error(`${prefix} Invalid correct answer: ${q.correct}`);
    errors++;
  }

  // Check for leaks
  if (/✔|✅|Correct:|Answer:|Explanation:/i.test(q.prompt)) {
    console.error(`${prefix} Prompt contains answer key markers.`);
    errors++;
  }

  q.options.forEach(opt => {
    if (/✔|✅|Correct:/i.test(opt.text)) {
      console.error(`${prefix} Option ${opt.id} contains answer key marker.`);
      errors++;
    }
  });
});

if (errors > 0) {
  console.error(`Validation failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`Validation PASSED: ${questions.length} questions checked cleanly.`);
}
