import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { validateQuestionBank } from './question-validation.mjs';
import { publishedQuestionsForExam, mockQuestionsForExam } from './browser-question-pool.mjs';

const sample = JSON.parse(fs.readFileSync(new URL('../data/questions/cca-f/questions.json', import.meta.url), 'utf8'))[0];

test('schema validation accepts a published question and rejects missing required fields', () => {
  assert.deepEqual(validateQuestionBank([sample], 'cca-f'), []);
  const incomplete = { ...sample };
  delete incomplete.mockEligible;
  assert.match(validateQuestionBank([incomplete], 'cca-f').join('\n'), /mockEligible: required field missing/);
});

test('question validation rejects duplicate IDs, invalid answers and parser metadata', () => {
  const badAnswer = { ...sample, correct: 'Z' };
  assert.match(validateQuestionBank([badAnswer], 'cca-f').join('\n'), /correct answer/);
  assert.match(validateQuestionBank([sample, sample], 'cca-f').join('\n'), /duplicate ID/);
  const leaked = { ...sample, prompt: '133 · D4 Prompt Engineering · [intermediate] ' + sample.prompt };
  assert.match(validateQuestionBank([leaked], 'cca-f').join('\n'), /parser metadata/);
});

test('mock pool excludes published but ineligible questions', () => {
  const ready = { ...sample, id: 'ready-eligible', status: 'ready', mockEligible: true };
  const ineligible = { ...sample, id: 'ready-ineligible', status: 'ready', mockEligible: false };
  const pending = { ...sample, id: 'pending-eligible', status: 'pending-review', mockEligible: true };
  assert.deepEqual(publishedQuestionsForExam([ready, ineligible, pending], 'cca-f').map(q => q.id), ['ready-eligible', 'ready-ineligible']);
  assert.deepEqual(mockQuestionsForExam([ready, ineligible, pending], 'cca-f').map(q => q.id), ['ready-eligible']);
  assert.deepEqual(mockQuestionsForExam([ready], 'terraform-associate'), []);
});
