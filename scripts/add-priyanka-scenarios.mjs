import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, '../data/questions/cca-f/questions.json');
const examsPath = path.resolve(__dirname, '../data/exams.toml');

const newQuestions = [
  {
    id: "cca-f-deficit-059",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D5 Context Management & Reliability",
    section: "Session State & Long Conversations",
    topic: "context-regrounding-vs-staleness",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Context Staleness in Long Refactoring Sessions",
    roleContext: "Role: AI Systems Architect Designing Developer Assistant Workflows",
    scenario: "You have built an AI coding assistant using the Claude Agent SDK to help a developer work through a large codebase refactor over an extended multi-hour session. Around turn 40, after dozens of turns of conversational back-and-forth, the assistant begins struggling. It generates edits based on file versions from early in the conversation, ignoring modifications the developer made 10 turns ago.",
    prompt: "Which architectural pattern should you implement to resolve this context staleness and ensure the assistant always reasons over current code state?",
    options: [
      {
        "id": "A",
        "text": "Implement a periodic re-grounding step that pulls fresh state directly from the live files via targeted tool reads, rather than trusting accumulated conversational token history."
      },
      {
        "id": "B",
        "text": "Switch to a model with a larger context window so the accumulated history can expand without pushing out older turns."
      },
      {
        "id": "C",
        "text": "Add an urgent system prompt reminder instructing the model: 'Always use the latest file versions and check recent developer edits before writing code'."
      },
      {
        "id": "D",
        "text": "Re-paste the entire repository codebase into the user prompt on every turn to guarantee the latest state is visible."
      }
    ],
    correct: "A",
    explanation: "In long multi-turn sessions (turn 40+), models suffer from context dilution and staleness as accumulated conversational turns compete for attention. Simply increasing context window size (Option B) only delays staleness. System prompt reminders (Option C) are weak because they compete with dozens of turns of conversational history. Re-pasting the entire codebase (Option D) is costly and inefficient. The winning architectural fix is a periodic re-grounding step that fetches fresh file state directly from live storage via tool reads."
  },
  {
    id: "cca-f-deficit-060",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Schema Enforcement & Downstream Reliability",
    topic: "schema-validation-and-retry-loops",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Downstream Parser Failures on Edge-Case Invoices",
    roleContext: "Role: Lead AI Architect Handling Document Processing Pipelines",
    scenario: "You have deployed an extraction agent using Claude to parse line items from scanned invoice PDFs into structured JSON for an automated downstream billing system. On standard digital invoices, the pipeline operates reliably. However, on invoices with non-standard table layouts, handwritten totals, and merged cells, the agent occasionally returns malformed JSON that crashes the downstream JSON parser.",
    prompt: "Which architectural solution provides the most reliable fix to guarantee downstream billing pipeline stability?",
    options: [
      {
        "id": "A",
        "text": "Enforce JSON schema validation at the output layer using tool use or strict schemas, coupled with an automated client-side validation check that programmatically triggers a correction retry loop before transmitting the payload to the billing system."
      },
      {
        "id": "B",
        "text": "Add a bold instruction to the system prompt: 'You are a billing extractor. You must ALWAYS return strictly valid JSON with no markdown formatting or natural language preamble'."
      },
      {
        "id": "C",
        "text": "Swap out Claude Sonnet for Claude Opus, as larger frontier models never emit syntactic JSON errors."
      },
      {
        "id": "D",
        "text": "Configure the downstream billing parser to ignore JSON syntax errors and infer missing commas and brackets using heuristic string replacement."
      }
    ],
    correct: "A",
    explanation: "Prompt instructions (Option B) work most of the time, but in production billing pipelines, occasional failures are unacceptable. Swapping in a larger model (Option C) does not guarantee syntax compliance under complex handwritten OCR layouts. The robust architectural pattern is schema enforcement at the output layer (tool use) combined with automated client-side schema validation and programmatic retry loops before downstream dispatch."
  },
  {
    id: "cca-f-deficit-061",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Multi-Agent State Synchronization",
    topic: "isolated-output-slots-and-sequenced-merge",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Multi-Agent Concurrency & Shared State Race Conditions",
    roleContext: "Role: Principal AI Architect Designing Multi-Agent Pipelines",
    scenario: "You are designing a research pipeline where two specialized subagents execute concurrently: Subagent A summarizes market trends, and Subagent B summarizes competitor product data. Both subagents are configured to write their findings directly to a single shared summary markdown document in parallel. In production telemetry, you observe that Subagent B occasionally overwrites Subagent A's findings, resulting in missing sections in the executive report.",
    prompt: "What is the best architectural design to eliminate this write conflict and ensure complete report synthesis?",
    options: [
      {
        "id": "A",
        "text": "Assign each subagent its own isolated output slot (separate sections or distinct intermediate artifacts), and have the coordinator agent execute a single sequenced merge step at the end to assemble the final report."
      },
      {
        "id": "B",
        "text": "Add a system prompt note to both subagents: 'Please write carefully and ensure you do not overwrite any peer findings in the document'."
      },
      {
        "id": "C",
        "text": "Merge Subagent A and Subagent B into a single monolithic agent that performs market research and competitor analysis sequentially."
      },
      {
        "id": "D",
        "text": "Have both subagents ping each other in a continuous peer-to-peer polling loop before every file write."
      }
    ],
    correct: "A",
    explanation: "Prompt instructions (Option B) cannot resolve concurrent timing race conditions between independent processes. Merging subagents into a single monolithic agent (Option C) re-introduces context bloat and degrades specialized reasoning. The correct architectural pattern is isolated output slots per subagent (isolated state) followed by a deterministic coordinator-orchestrated fan-in merge step."
  }
];

const existing = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const existingIds = new Set(existing.map(q => q.id));

let added = 0;
for (const q of newQuestions) {
  if (!existingIds.has(q.id)) {
    existing.push(q);
    added++;
  }
}

fs.writeFileSync(questionsPath, JSON.stringify(existing, null, 2));
console.log(`[add-priyanka-scenarios] Added ${added} new questions. Total in cca-f: ${existing.length}`);

// Update data/exams.toml questions count
let toml = fs.readFileSync(examsPath, 'utf8');
toml = toml.replace(/questions = \d+/, `questions = ${existing.length}`);
fs.writeFileSync(examsPath, toml);
console.log(`[add-priyanka-scenarios] Updated data/exams.toml with questions = ${existing.length}`);
