// Original editorial items calibrated to the six production contexts and task
// statements in Anthropic's July 2026 CCAR-F Exam Guide v1.0. These are not
// copied from the guide, practice test, or any claimed live exam question.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'data/questions/cca-f/questions.json');
const staticCopy = path.join(root, 'static/data/questions/cca-f/questions.json');
const domain = {
  D1: 'D1 Agentic Architecture & Orchestration',
  D2: 'D2 Tool Design & MCP Integration',
  D3: 'D3 Claude Code Configuration & Workflows',
  D4: 'D4 Prompt Engineering & Structured Output',
  D5: 'D5 Context Management & Reliability'
};
const sourceId = 'ccar-f-editorial-calibration-2026-10';
const common = {
  exam: 'cca-f', examVersion: 'v1.0', status: 'ready', reviewStatus: 'approved',
  sourceId, difficulty: 'exam', mockEligible: true, questionType: 'single_choice', contentVersion: 1,
  qualityReview: {
    code: 'original-editorial',
    reason: 'Original scenario item reviewed against the stated CCAR-F v1.0 task and official sample style; no claim of live-exam provenance.',
    guide: 'CCAR-F Exam Guide v1.0, July 2026', reviewedOn: '2026-10-08'
  }
};
const items = [
  {
    id: 'cca-f-calibration-001', domain: domain.D2, section: '2.2 structured-error-responses',
    scenarioTag: 'Customer Support Resolution Agent',
    prompt: 'A support agent calls process_refund for a verified $40 refund. The connection times out after the request reaches the payment service, so the agent cannot tell whether the refund was committed. The current MCP tool returns only “timeout, retryable,” and a blind retry has once created a duplicate refund. What should the tool and agent workflow do next?',
    options: [
      { id: 'A', text: 'Retry the same refund call immediately because a timeout always means the payment service made no change.' },
      { id: 'B', text: 'Return an uncertain-outcome error with the attempted transaction identifier; check the payment state before any retry, using an idempotency key when retrying.' },
      { id: 'C', text: 'Mark the refund successful in the agent transcript and let a later finance audit correct any discrepancy.' },
      { id: 'D', text: 'Ask the customer to submit the refund again in a new conversation, avoiding a retry in the current agent loop.' }
    ], correct: 'B',
    explanation: 'A timeout after submission has an uncertain side-effect outcome. B preserves structured error context and verifies state before a safe retry. A risks a duplicate refund; C falsely asserts success; D shifts uncertainty to the customer and can also duplicate the operation. Guide: task 2.2 (structured tool errors) and task 5.3 (error propagation).'
  },
  {
    id: 'cca-f-calibration-002', domain: domain.D3, section: '3.4 plan-mode-execution',
    scenarioTag: 'Code Generation with Claude Code',
    prompt: 'A developer asks Claude Code to split a service used by 18 modules into two components. The public API must stay stable, but no one has mapped which callers depend on undocumented side effects. The developer wants a reviewable approach before files are changed. Which first step best fits this work?',
    options: [
      { id: 'A', text: 'Enter plan mode, trace callers and side effects, propose the component boundary and migration checks, then review the plan before editing.' },
      { id: 'B', text: 'Start direct execution with the 18 known modules and let failing tests reveal any undocumented behavior after the first edit.' },
      { id: 'C', text: 'Run two editing agents in parallel, assigning nine modules to each so the work finishes before dependencies are mapped.' },
      { id: 'D', text: 'Write a broad CLAUDE.md instruction telling Claude to preserve compatibility, then begin the split without inspecting callers.' }
    ], correct: 'A',
    explanation: 'A addresses the stated uncertainty and request for review before changes. Tests are valuable after a boundary is understood, but B starts changes before discovering dependencies. C introduces coordination risk; D gives a goal without mapping the side effects. Guide: task 3.4 (plan mode for architectural changes).'
  },
  {
    id: 'cca-f-calibration-003', domain: domain.D5, section: '5.6 information-provenance',
    scenarioTag: 'Multi-Agent Research System',
    prompt: 'A research coordinator receives two credible 2025 estimates for “AI adoption.” One survey says 18% of individual employees use AI weekly; another says 27% of companies have deployed at least one AI workflow. The synthesis agent calls the figures contradictory and publishes their average as the market adoption rate. How should the final report handle them?',
    options: [
      { id: 'A', text: 'Publish the average because both sources are credible and report on the same calendar year.' },
      { id: 'B', text: 'Keep the company-level figure because deployment is a more architectural measure than employee use.' },
      { id: 'C', text: 'Preserve each claim with its source, measured population, definition, and collection date; present them as different measures rather than one rate.' },
      { id: 'D', text: 'Ask the synthesis agent to choose the estimate with the larger sample size, then omit the other to avoid confusing readers.' }
    ], correct: 'C',
    explanation: 'The estimates have different denominators and definitions, so averaging or selecting one would create a misleading single rate. C preserves claim-source mappings and methodological context. A averages unlike measures; B and D erase relevant evidence. Guide: task 5.6 (provenance and methodological context).'
  },
  {
    id: 'cca-f-calibration-004', domain: domain.D5, section: '5.4 codebase-exploration',
    scenarioTag: 'Developer Productivity with Claude',
    prompt: 'An agent investigating a bug in a large repository runs a broad search and receives 900 matching lines. The tool output fills much of the remaining context, and the agent starts naming files that were not in the results. The user needs a traced call path, not a repository-wide summary. What should the agent do first?',
    options: [
      { id: 'A', text: 'Repeat the same search with a larger output limit so the agent can compare every occurrence in one context window.' },
      { id: 'B', text: 'Narrow by likely module or file pattern, extract file paths and relevant signatures, then inspect a small set of callers and persist the traced path.' },
      { id: 'C', text: 'Ask a second agent to read the full 900-line output and send back its narrative summary without source locations.' },
      { id: 'D', text: 'Skip search results and ask Claude to infer the call path from naming conventions because the broad search is too noisy.' }
    ], correct: 'B',
    explanation: 'B reduces irrelevant context while retaining verifiable locations and a reusable trace. A increases noise; C loses provenance; D substitutes guesses for code evidence. Guide: task 5.4 (progressive codebase exploration and compact facts).'
  },
  {
    id: 'cca-f-calibration-005', domain: domain.D4, section: '4.1 explicit-review-criteria',
    scenarioTag: 'Claude Code for Continuous Integration',
    prompt: 'A CI review bot flags naming and style preferences as “high severity” on nearly every pull request. Developers dismiss the comments, including occasional real security findings. The team wants fewer false positives while still catching security and correctness issues. What is the best first change?',
    options: [
      { id: 'A', text: 'Keep every review category but ask the model to report only findings it feels at least 90% confident about.' },
      { id: 'B', text: 'Add a second identical review pass and report only comments that appear in both passes, without changing the review criteria.' },
      { id: 'C', text: 'Define explicit reportable categories and severity examples, suppress style comments for now, and measure dismissal rates by category.' },
      { id: 'D', text: 'Switch all reviews to a larger model while leaving the broad “find any issue” prompt and severity rules intact.' }
    ], correct: 'C',
    explanation: 'C targets the observed category-level false positives with concrete criteria and a feedback measure. Self-confidence (A) is not calibrated evidence; agreement (B) can hide real issues; a model swap (D) leaves the faulty task definition intact. Guide: task 4.1 (explicit review criteria and false positives).'
  },
  {
    id: 'cca-f-calibration-006', domain: domain.D4, section: '4.4 validation-retry',
    scenarioTag: 'Structured Data Extraction',
    prompt: 'An extraction pipeline processes invoices with a strict output schema. One invoice omits its tax ID and another has line items totaling $128 while the printed total says $138. The current pipeline retries both documents whenever the output passes schema validation but fails a business check. Which design handles these cases most reliably?',
    options: [
      { id: 'A', text: 'Require a tax ID for every invoice, then retry both documents until the model fills the field and the totals match.' },
      { id: 'B', text: 'Allow an absent tax ID as null; retain the stated and calculated totals separately, flag their discrepancy, and route unresolved source conflicts for review.' },
      { id: 'C', text: 'Trust the strict schema to prevent both errors, because valid JSON fields also guarantee that extracted values agree with the source.' },
      { id: 'D', text: 'Use the calculated $128 as the only total, discard the printed $138, and ask the model to infer the missing tax ID from other invoice fields.' }
    ], correct: 'B',
    explanation: 'B distinguishes absent source data from a semantic inconsistency. Retrying cannot supply a missing tax ID, and a strict schema does not reconcile conflicting totals. A and D invite fabrication; C confuses structural validity with factual correctness. Guide: tasks 4.3 and 4.4 (nullable fields and semantic validation).'
  }
].map(item => ({ ...common, ...item }));

const questions = JSON.parse(fs.readFileSync(source, 'utf8'));
const existing = new Set(questions.map(question => question.id));
const toAdd = items.filter(item => !existing.has(item.id));
for (const item of items) {
  const current = questions.find(question => question.id === item.id);
  if (current && current.sourceId !== sourceId) throw new Error(`Editorial ID belongs to another source: ${item.id}`);
}
if (!process.argv.includes('--write')) {
  console.log(`Dry run: ${toAdd.length} original scenario questions would be added.`);
  process.exit(0);
}
for (const item of items) {
  const index = questions.findIndex(question => question.id === item.id);
  if (index >= 0) questions[index] = item;
  else questions.push(item);
}
fs.writeFileSync(source, `${JSON.stringify(questions, null, 2)}\n`);
fs.writeFileSync(staticCopy, `${JSON.stringify(questions.filter(question => question.status === 'ready' || question.status === 'released'), null, 2)}\n`);
console.log(`Added ${toAdd.length} original scenario questions; ${questions.length} source records total.`);
