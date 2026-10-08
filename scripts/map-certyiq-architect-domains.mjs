import fs from 'node:fs';
import path from 'node:path';

// Editorial mapping of the previously imported first 40 items in the
// supplied 175-item questionnaire to the July 2026 CCAR-F task statements.
const taskByNumber = {
  1: '1.3', 2: '5.6', 3: '1.2', 4: '1.7', 5: '1.2', 6: '1.6',
  7: '1.2', 8: '5.6', 9: '1.2', 10: '1.3', 11: '5.6', 12: '1.3',
  13: '1.2', 14: '1.3', 15: '2.1', 16: '2.2', 17: '2.2', 18: '2.1',
  19: '2.3', 20: '2.2', 22: '1.4', 23: '2.1', 24: '2.1', 25: '2.1',
  26: '2.1', 27: '2.1', 28: '5.2', 29: '4.4', 30: '4.3', 31: '4.4',
  32: '4.4', 33: '4.5', 34: '5.6', 35: '4.3', 36: '4.2', 37: '4.3',
  38: '5.5', 39: '5.1', 40: '4.4'
};

const sectionByTask = {
  '1.2': 'orchestration-patterns', '1.3': 'subagent-invocation-context',
  '1.4': 'workflow-enforcement-handoff', '1.6': 'task-decomposition',
  '1.7': 'session-state-resumption', '2.1': 'tool-schema-design',
  '2.2': 'structured-error-responses', '2.3': 'tool-distribution-choice',
  '4.2': 'few-shot-prompting', '4.3': 'structured-output',
  '4.4': 'validation-retry', '4.5': 'batch-processing',
  '5.1': 'context-window-management', '5.2': 'escalation-ambiguity',
  '5.5': 'human-review-calibration', '5.6': 'information-provenance'
};

const domains = {
  1: 'D1 Agentic Architecture & Orchestration',
  2: 'D2 Tool Design & MCP Integration',
  3: 'D3 Claude Code Configuration & Workflows',
  4: 'D4 Prompt Engineering & Structured Output',
  5: 'D5 Context Management & Reliability'
};

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'data/questions/cca-f/questions.json');
const staticCopy = path.join(root, 'static/data/questions/cca-f/questions.json');
const questions = JSON.parse(fs.readFileSync(source, 'utf8'));
let mapped = 0;
for (const question of questions) {
  const match = /^cca-f-certyiq-(\d{3})$/.exec(question.id);
  if (!match) continue;
  const task = taskByNumber[Number(match[1])];
  if (!task) throw new Error(`No task mapping for ${question.id}`);
  question.domain = domains[Number(task[0])];
  question.section = `${task} ${sectionByTask[task]}`;
  mapped++;
}
if (mapped !== Object.keys(taskByNumber).length) throw new Error(`Expected ${Object.keys(taskByNumber).length} items, mapped ${mapped}`);

if (!process.argv.includes('--write')) {
  console.log(`Dry run: mapped ${mapped} previously imported questions to D1–D5 tasks. Pass --write to apply.`);
  process.exit(0);
}
fs.writeFileSync(source, `${JSON.stringify(questions, null, 2)}\n`);
fs.writeFileSync(staticCopy, `${JSON.stringify(questions.filter(q => q.status === 'ready' || q.status === 'released'), null, 2)}\n`);
console.log(`Mapped ${mapped} questions to CCAR-F tasks.`);
