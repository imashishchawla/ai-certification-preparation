import fs from 'node:fs';
import path from 'node:path';
import { reviewFlags } from './cca-f-review-flags.mjs';
import { recallOnlySet, lacksMockContext } from './cca-f-format-review.mjs';

const schemaPath = new URL('../.agent/schemas/question.schema.json', import.meta.url);
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const answerLeak = /✔|✅|\[CORRECT\]|^\s*\(?(?:Correct|Answer|Explanation)\s*[:\)]/i;
const leakedPrefix = /^(?:\s*\d+\s*·\s*D[1-5]\b|\s*\d+\.\d+\s+[^/]+\s*\/[^·]+·\s*\*\*Difficulty:|\s*\(Scenario:\s*[^)]+\)\s*Situation:\*\*)/i;

// The question schema uses this deliberately small JSON Schema vocabulary.
// Keep the validator and schema in step instead of reporting a shape check as schema validation.
export function validateSchema(value, rule = schema, location = '$') {
  const errors = [];
  const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (rule.type && actualType !== rule.type) {
    return [`${location}: expected ${rule.type}, found ${actualType}`];
  }
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${location}: value is outside the allowed set`);
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) errors.push(`${location}: too short`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) errors.push(`${location}: invalid format`);
  }
  if (Array.isArray(value)) {
    if (rule.minItems && value.length < rule.minItems) errors.push(`${location}: too few items`);
    if (rule.maxItems && value.length > rule.maxItems) errors.push(`${location}: too many items`);
    if (rule.items) value.forEach((item, index) => errors.push(...validateSchema(item, rule.items, `${location}[${index}]`)));
  }
  if (actualType === 'object') {
    for (const key of rule.required || []) {
      if (!Object.hasOwn(value, key)) errors.push(`${location}.${key}: required field missing`);
    }
    for (const [key, child] of Object.entries(rule.properties || {})) {
      if (Object.hasOwn(value, key)) errors.push(...validateSchema(value[key], child, `${location}.${key}`));
    }
  }
  if (rule.oneOf) {
    const matches = rule.oneOf.filter(branch => validateSchema(value, branch, location).length === 0);
    if (matches.length !== 1) errors.push(`${location}: must match exactly one allowed shape`);
  }
  return errors;
}

export function validateQuestionBank(questions, examId) {
  if (!Array.isArray(questions)) return ['Question bank must be an array'];
  const errors = [];
  const seen = new Set();
  const seenActivePrompts = new Map();
  questions.forEach((question, index) => {
    const label = `Question ${index + 1} (${question?.id || 'missing ID'})`;
    errors.push(...validateSchema(question).map(message => `${label}: ${message}`));
    if (!question || typeof question !== 'object') return;
    if (question.exam !== examId) errors.push(`${label}: exam does not match ${examId}`);
    if (seen.has(question.id)) errors.push(`${label}: duplicate ID`);
    seen.add(question.id);
    const active = question.status === 'ready' || question.status === 'released';
    if (examId === 'cca-f' && active && reviewFlags.has(question.id)) {
      errors.push(`${label}: flagged question must not be published (${reviewFlags.get(question.id).code})`);
    }
    if (question.status === 'quarantined' && question.mockEligible === true) {
      errors.push(`${label}: quarantined question cannot be mock eligible`);
    }
    if (examId === 'cca-f' && recallOnlySet.has(question.id) && question.mockEligible === true) {
      errors.push(`${label}: recall-only question cannot be mock eligible`);
    }
    if (examId === 'cca-f' && active && lacksMockContext(question) && question.mockEligible === true) {
      errors.push(`${label}: short stem without a scenario cannot be mock eligible`);
    }
    if (active && typeof question.prompt === 'string') {
      const normalized = question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      const earlier = seenActivePrompts.get(normalized);
      if (earlier) errors.push(`${label}: duplicate active prompt matches ${earlier}`);
      else if (normalized) seenActivePrompts.set(normalized, question.id);
    }
    if (!Array.isArray(question.options)) return;
    const ids = question.options.map(option => option?.id);
    if (new Set(ids).size !== ids.length) errors.push(`${label}: duplicate option ID`);
    if (examId === 'cca-f' && JSON.stringify(ids) !== JSON.stringify(['A', 'B', 'C', 'D'])) {
      errors.push(`${label}: CCA-F options must be A, B, C, D`);
    }
    const correct = Array.isArray(question.correct) ? question.correct : [question.correct];
    if (!correct.length || new Set(correct).size !== correct.length || correct.some(id => !ids.includes(id))) {
      errors.push(`${label}: correct answer must refer to distinct option IDs`);
    }
    if (examId === 'cca-f' && (Array.isArray(question.correct) || question.questionType === 'multiple_choice')) {
      errors.push(`${label}: CCA-F mock questions must have one correct answer`);
    }
    if (typeof question.prompt === 'string' && (answerLeak.test(question.prompt) || leakedPrefix.test(question.prompt))) {
      errors.push(`${label}: prompt contains answer or parser metadata`);
    }
    question.options.forEach((option, optionIndex) => {
      if (typeof option?.text === 'string' && answerLeak.test(option.text)) {
        errors.push(`${label}: option ${optionIndex + 1} contains an answer marker`);
      }
      if (active && /^\s*\*?\s*[A-E]\s*$/i.test(option?.text || '')) {
        errors.push(`${label}: option ${optionIndex + 1} is only a letter placeholder`);
      }
    });
  });
  return errors;
}

export function validateExamFile(rootDir, examId) {
  const file = path.join(rootDir, 'data/questions', examId, 'questions.json');
  if (!fs.existsSync(file)) return { count: 0, errors: [`Missing question file: ${file}`] };
  try {
    const questions = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { count: Array.isArray(questions) ? questions.length : 0, errors: validateQuestionBank(questions, examId) };
  } catch (error) {
    return { count: 0, errors: [`Unable to parse ${file}: ${error.message}`] };
  }
}
