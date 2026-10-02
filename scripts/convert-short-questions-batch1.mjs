import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, '../data/questions/cca-f/questions.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const scenarioEnrichments = {
  "cca-f-prep-001": {
    topicBrief: "Topic Brief: Agentic Loop Execution & Stop Signals",
    roleContext: "Role: AI Systems Engineer Handling Claude Agent SDK",
    scenario: "You are building an autonomous customer support bot using the Claude Agent SDK. During an active execution turn, the model emits an API response requesting a query to the customer order database via `lookup_order`.",
    prompt: "The application runner inspects the API response and observes `stop_reason: \"tool_use\"`. What does this status code indicate your client-side agentic loop runner must do before returning a final answer to the user?"
  },
  "cca-f-prep-002": {
    topicBrief: "Topic Brief: Agentic Loop Termination Lifecycle",
    roleContext: "Role: AI Systems Engineer Handling Claude Agent SDK",
    scenario: "An autonomous agent has completed multiple tool calls, querying database records and calculating account refunds. In its most recent turn, the model outputs a natural language summary to the customer.",
    prompt: "The runner inspects the response and receives `stop_reason: \"end_turn\"`. What does this control signal indicate regarding the agentic loop lifecycle?"
  },
  "cca-f-prep-003": {
    topicBrief: "Topic Brief: Hub-and-Spoke Coordinator Patterns",
    roleContext: "Role: Lead AI Architect Designing Multi-Agent Systems",
    scenario: "You are architecting an enterprise legal research platform with five specialized worker subagents (contract analysis, case law search, compliance check, citation verifier, and report formatter).",
    prompt: "What is the primary architectural responsibility of the central coordinator agent in this hub-and-spoke multi-agent topology?"
  },
  "cca-f-prep-004": {
    topicBrief: "Topic Brief: Preventing Runaway Agentic Loops",
    roleContext: "Role: Cloud Systems Engineer Handling Production Cost Controls",
    scenario: "An autonomous debugging agent occasionally gets trapped in an infinite cycle of failing bash commands and retry loops, threatening to exhaust API token budgets and incur runaway costs.",
    prompt: "Which Claude Agent SDK parameter should you configure in the runner to enforce a hard ceiling on the maximum number of tool-use turns allowed per execution?"
  },
  "cca-f-prep-005": {
    topicBrief: "Topic Brief: Subagent Context Scoping & Isolation",
    roleContext: "Role: AI Pipeline Architect Building Hierarchical Agents",
    scenario: "A coordinator agent with 45,000 tokens of accumulated conversational history spawns a specialized code analysis subagent using the Task tool to audit a single cryptographic function.",
    prompt: "Does the spawned subagent automatically inherit and have access to the coordinator's entire conversation history?"
  },
  "cca-f-prep-006": {
    topicBrief: "Topic Brief: Anti-Patterns in Loop Termination",
    roleContext: "Role: Senior AI Engineer Refactoring Legacy Agent Code",
    scenario: "A junior developer writes an agentic loop runner with the logic: `if (response.content[0].text.includes(\"Done\") || response.content[0].text.includes(\"I am finished\")) break;`.",
    prompt: "Why is parsing natural language text rather than inspecting `stop_reason` considered a dangerous anti-pattern in production agentic systems?"
  },
  "cca-f-prep-008": {
    topicBrief: "Topic Brief: Parallel Subagent Spawning via Task Tool",
    roleContext: "Role: Performance Architect Optimizing Multi-Agent Latency",
    scenario: "A coordinator agent needs to analyze three independent microservice repositories simultaneously to meet a 30-second pipeline latency SLA.",
    prompt: "How should the coordinator formulate its tool invocation to spawn three worker subagents to run in parallel using the Task tool?"
  },
  "cca-f-prep-010": {
    topicBrief: "Topic Brief: Coordinator Tool Permissions & Spawning",
    roleContext: "Role: DevSecOps Engineer Configuring Agent Tool Sandboxes",
    scenario: "You are defining an AgentDefinition for a high-level coordinator agent. You need to ensure the coordinator has permission to spawn and delegate tasks to specialized subagents without granting it arbitrary bash access.",
    prompt: "Which specific tool must be explicitly included in the coordinator's `allowedTools` list to permit subagent delegation?"
  },
  "cca-f-prep-011": {
    topicBrief: "Topic Brief: PostToolUse Hook Applications",
    roleContext: "Role: AI Platform Engineer Implementing Guardrails",
    scenario: "You are designing safety guardrails in `.claude/settings.json` for a codebase refactoring agent that executes bash tests and edits source files.",
    prompt: "Which production task is a `PostToolUse` hook best architected to accomplish?"
  },
  "cca-f-prep-013": {
    topicBrief: "Topic Brief: Session Forking vs In-Place Resumption",
    roleContext: "Role: AI Architect Designing Code Exploration Workflows",
    scenario: "An engineer has established a deep investigation session into a legacy billing bug and wants to test two radically different refactoring strategies without contaminating the baseline session state.",
    prompt: "Under what operational circumstance is `fork_session` the most appropriate mechanism to employ?"
  }
};

let enrichedCount = 0;
questions.forEach(q => {
  if (scenarioEnrichments[q.id]) {
    const e = scenarioEnrichments[q.id];
    q.topicBrief = e.topicBrief;
    q.roleContext = e.roleContext;
    q.scenario = e.scenario;
    q.prompt = e.prompt;
    enrichedCount++;
  }
});

fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`[enrich-short-questions] Enriched ${enrichedCount} short questions into full scenarios.`);
