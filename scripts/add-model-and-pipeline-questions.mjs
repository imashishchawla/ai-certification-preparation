#!/usr/bin/env node
/**
 * add-model-and-pipeline-questions.mjs
 *
 * Adds 4 targeted exam-grade questions testing:
 * - Haiku vs Sonnet vs Opus architectural trade-offs
 * - Claude Code CLI & MCP in CI/CD pipelines
 */

import fs from 'node:fs';
import path from 'node:path';

const newQuestions = [
  {
    id: "cca-f-deficit-037",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Model Family Selection",
    topic: "haiku-sonnet-opus-tradeoffs",
    difficulty: "advanced",
    prompt: "Scenario: High-Volume Customer Inquiry Processing. Situation: A global retail platform receives 350,000 incoming support tickets daily. The pipeline must classify incoming ticket intent, detect language, and route inquiries to specialized backend subagents within a strict 600ms latency SLA, while operating under a strict cost ceiling. How should the architect assign models across this multi-tier pipeline?",
    options: [
      { id: "A", text: "Deploy Claude Haiku as the frontline routing and classification filter, and invoke Claude Sonnet only for downstream subagents requiring multi-turn tool interaction." },
      { id: "B", text: "Deploy Claude Opus across all 350,000 requests to maximize initial classification accuracy regardless of latency." },
      { id: "C", text: "Use Claude Sonnet for initial triage and Claude Haiku for the complex multi-turn refund resolution agents." },
      { id: "D", text: "Route all tickets into the Message Batches API to minimize costs despite the 24-hour turnaround window." }
    ],
    correct: "A",
    explanation: "Claude Haiku provides near-instant latency and orders-of-magnitude lower cost, making it the optimal architectural choice for high-volume, low-latency triage and classification. Once intent is identified, requests requiring multi-turn tool execution are routed to Claude Sonnet."
  },
  {
    id: "cca-f-deficit-038",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Model Family Selection",
    topic: "haiku-sonnet-opus-tradeoffs",
    difficulty: "advanced",
    prompt: "Scenario: Cross-Border Regulatory M&A Synthesis. Situation: An investment bank builds a multi-agent system to analyze conflicting antitrust filings across three jurisdictions. The coordinator must resolve contradictory regulatory rulings, perform nuanced legal reasoning, and produce an executive risk briefing. Worker subagents simply extract structured financial tables from PDF disclosures. Which model distribution fits this architecture?",
    options: [
      { id: "A", text: "Assign Claude Opus to the coordinator for deep synthesis and reconciliation of conflicting legal positions, while assigning Claude Haiku or Sonnet to worker subagents for bounded tabular extraction." },
      { id: "B", text: "Assign Claude Haiku to the coordinator to minimize total token costs and Claude Opus to the worker subagents." },
      { id: "C", text: "Use Claude Opus for all workers and coordinator, disabling all prompt caching." },
      { id: "D", text: "Enforce a single-agent architecture using Claude Haiku without tool calling." }
    ],
    correct: "A",
    explanation: "Claude Opus excels at high-order reasoning, strategic task decomposition, and resolving contradictory claims in high-stakes environments. Pairing an Opus coordinator with specialized Sonnet/Haiku extraction workers optimizes reasoning depth where it matters while bounding execution costs."
  },
  {
    id: "cca-f-deficit-039",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D3 Claude Code Configuration & Workflows",
    section: "CI/CD Pipeline Architecture",
    topic: "claude-code-cli-automation",
    difficulty: "advanced",
    prompt: "Scenario: Pull Request Security Gate in GitLab CI. Situation: An engineering team integrates Claude Code CLI into their CI pipeline to audit merge requests. The CI runner must execute autonomously without hanging on human confirmation prompts, fail the pipeline if severe vulnerabilities exist, and export machine-readable metrics. Which CLI invocation command satisfies these requirements?",
    options: [
      { id: "A", text: "claude -p 'Audit diff for OWASP vulnerabilities' --output-format json --json-schema /schemas/vuln.json --max-turns 5 --cost-limit 2.00" },
      { id: "B", text: "claude interactive --verbose --auto-approve-all-scripts" },
      { id: "C", text: "claude review --format markdown | grep -i 'vulnerability'" },
      { id: "D", text: "cat diff.txt | claude --stdin-only --loop-indefinitely" }
    ],
    correct: "A",
    explanation: "Automated CI/CD invocations require headless mode (-p/--print) to eliminate interactive blocking, structured output enforcement (--output-format json and --json-schema) for deterministic downstream parsing, and safety bounds (--max-turns and --cost-limit) to prevent runaway execution costs."
  },
  {
    id: "cca-f-deficit-040",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D2 Tool Design & MCP Integration",
    section: "MCP Architecture",
    topic: "tools-vs-resources",
    difficulty: "advanced",
    prompt: "Scenario: Enterprise Data Warehouse Catalog Integration. Situation: A data analytics agent frequently queries 200 database table definitions to understand relational schemas before generating SQL. Exposing each table lookup as an active MCP tool call burns 6–10 turns of conversation latency and tool tokens before SQL generation begins. How should the MCP server be architected to optimize this interaction?",
    options: [
      { id: "A", text: "Expose the schema metadata catalog as an MCP Resource (e.g. resource URI schema://warehouse/tables) so the client can inject or browse schemas directly, reserving MCP Tools strictly for SQL query execution." },
      { id: "B", text: "Create 200 distinct MCP tools, one for each individual table in the warehouse." },
      { id: "C", text: "Hardcode the entire 200-table database DDL into the system prompt of every turn." },
      { id: "D", text: "Instruct the model to hallucinate table schemas and retry queries upon database error." }
    ],
    correct: "A",
    explanation: "MCP Resources represent read-only context, documentation, and data catalogs that can be inspected without burning model tool execution turns. Reserving MCP Tools for executable mutations (running SQL) while serving static schemas via MCP Resources optimizes latency and context efficiency."
  }
];

const rootDir = process.cwd();
const qFilePath = path.join(rootDir, 'data/questions/cca-f/questions.json');
const staticQFilePath = path.join(rootDir, 'static/data/questions/cca-f/questions.json');

const existing = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
const filtered = existing.filter(q => !['cca-f-deficit-037', 'cca-f-deficit-038', 'cca-f-deficit-039', 'cca-f-deficit-040'].includes(q.id));
const merged = [...filtered, ...newQuestions];

fs.writeFileSync(qFilePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
fs.writeFileSync(staticQFilePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');

console.log(`[add-model-questions] Added ${newQuestions.length} targeted questions.`);
console.log(`[add-model-questions] Total questions now: ${merged.length}`);
