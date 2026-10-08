import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, '../data/questions/cca-f/questions.json');
const examsPath = path.resolve(__dirname, '../data/exams.toml');
const indexPath = path.resolve(__dirname, '../content/exams/cca-f/_index.md');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const metadataMap = {
  'cca-f-sample5-001': {
    section: 'Subagent Error Handling',
    topic: 'subagent-failure-modes',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Subagent Partial Failure & Coordinator Recovery',
    roleContext: 'Role: AI Systems Architect Designing Parallel Workflows'
  },
  'cca-f-sample5-002': {
    section: 'Permissions & Command Execution',
    topic: 'permission-boundaries',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Tool & Command Execution Security Controls',
    roleContext: 'Role: Lead Developer Configuring Claude Code Workflows'
  },
  'cca-f-sample5-003': {
    section: 'System Prompt Architecture',
    topic: 'system-prompt-clarity',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Eliminating Vague System Prompt Instructions',
    roleContext: 'Role: Prompt Architect Designing Support Workflows'
  },
  'cca-f-sample5-004': {
    section: 'Tool Design & Consolidation',
    topic: 'tool-consolidation',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Overlapping Tool Schemas & Tool Selection Ambiguity',
    roleContext: 'Role: AI Architect Designing Tool Definitions'
  },
  'cca-f-sample5-005': {
    section: 'Context Management',
    topic: 'context-budgeting',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Managing Long-Running Context Near Token Limits',
    roleContext: 'Role: Systems Architect Managing Agent State Persistence'
  },
  'cca-f-community-d1-001': {
    section: 'Agentic Loop Lifecycle',
    topic: 'stop-reason-inspection',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Agentic Loop State Machine & Stop Reasons',
    roleContext: 'Role: AI Engineer Implementing Orchestration Loops'
  },
  'cca-f-community-d1-002': {
    section: 'Coordinator & Subagent Communication',
    topic: 'context-isolation',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Targeted Context Handoffs in Multi-Agent Systems',
    roleContext: 'Role: Principal Architect Designing Multi-Agent Systems'
  },
  'cca-f-community-d1-003': {
    section: 'Human-in-the-Loop & High Stakes Actions',
    topic: 'human-in-the-loop',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Regulatory Compliance & Human Authorization Gates',
    roleContext: 'Role: Compliance Architect Designing Financial Agent Workflows'
  },
  'cca-f-community-d2-001': {
    section: 'Tool Registry & Selection Accuracy',
    topic: 'tool-registry-pruning',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Mitigating Tool Explosion in Agent Configuration',
    roleContext: 'Role: Tool Integration Specialist'
  },
  'cca-f-community-d2-002': {
    section: 'Tool Result Semantics',
    topic: 'empty-result-handling',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Handling Empty Tool Results & Absent Data',
    roleContext: 'Role: Agent Developer Implementing Retrieval Tools'
  },
  'cca-f-community-d2-003': {
    section: 'MCP Security & Credentials',
    topic: 'mcp-credential-storage',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Secret Management in MCP Server Configurations',
    roleContext: 'Role: DevSecOps Engineer Configuring MCP Infrastructures'
  },
  'cca-f-community-d2-004': {
    section: 'Large-Scale MCP Architecture',
    topic: 'mcp-tool-aggregation',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Scalable Routing Across Multi-Server MCP Registries',
    roleContext: 'Role: Platform Architect Designing Enterprise Tool Gateways'
  },
  'cca-f-community-d2-005': {
    section: 'Tool Choice & Schema Forcing',
    topic: 'tool-choice-forcing',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Schema Enforcement via tool_choice Strictness',
    roleContext: 'Role: Lead Extraction Pipeline Architect'
  },
  'cca-f-community-d3-001': {
    section: 'Claude Code Rules & Scope',
    topic: 'rules-hierarchy',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Scoping Repository Rules for Testing Patterns',
    roleContext: 'Role: Senior Developer Configuring Repository Guidelines'
  },
  'cca-f-community-d3-003': {
    section: 'Automated CI/CD Workflows',
    topic: 'ci-automation',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Headless Execution & Non-Interactive Claude Code in CI',
    roleContext: 'Role: DevOps Architect Implementing AI Review Automation'
  },
  'cca-f-community-d4-001': {
    section: 'Evaluation & Criteria Definition',
    topic: 'prompt-eval-criteria',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Replacing Subjective Prompt Directives with Concrete Metrics',
    roleContext: 'Role: Quality Assurance Lead'
  },
  'cca-f-community-d4-002': {
    section: 'Structured Extraction & Semantic Validation',
    topic: 'schema-vs-semantics',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Structural Schema Validation vs Mathematical Correctness',
    roleContext: 'Role: Data Processing Architect'
  },
  'cca-f-community-d4-003': {
    section: 'Anthropic Batch API Workflows',
    topic: 'batch-api-recovery',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Custom ID Correlation & Granular Error Retries in Batches',
    roleContext: 'Role: High-Throughput Pipeline Architect'
  },
  'cca-f-community-d4-004': {
    section: 'Frontier Model Thinking & Sampling Parameters',
    topic: 'adaptive-thinking-migration',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Migrating Fixed Token Budgets to Adaptive Thinking',
    roleContext: 'Role: AI Framework Architect Migrating to Frontier Models'
  },
  'cca-f-community-d5-001': {
    section: 'Transactional State Preservation',
    topic: 'persistent-fact-blocks',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Preserving Critical Entity Metadata Across Summaries',
    roleContext: 'Role: Customer Support Architecture Lead'
  },
  'cca-f-community-d5-002': {
    section: 'Human Escalation Thresholds',
    topic: 'escalation-calibration',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Decoupling Emotional Intensity from Technical Complexity',
    roleContext: 'Role: Conversational AI Reliability Engineer'
  },
  'cca-f-community-d5-003': {
    section: 'Model Evaluation & Stratification',
    topic: 'stratified-evaluation',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Uncovering Subpopulation Failure Modes in Benchmark Metrics',
    roleContext: 'Role: AI Evaluation & Benchmark Lead'
  },
  'cca-f-community-d5-004': {
    section: 'Multi-Agent Conflict Resolution',
    topic: 'discrepancy-attribution',
    difficulty: 'intermediate',
    topicBrief: 'Topic Brief: Transparent Source Attribution for Conflicting Claims',
    roleContext: 'Role: Research Pipeline Architect'
  },
  'cca-f-community-d5-005': {
    section: 'Compaction State & Turn History',
    topic: 'server-side-compaction-blocks',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Preserving Compaction Metadata Blocks in API History',
    roleContext: 'Role: Stateful Conversation Systems Architect'
  },
  'cca-f-community-d5-006': {
    section: 'Generation Pacing & Token Budgets',
    topic: 'task-budget-pacing',
    difficulty: 'advanced',
    topicBrief: 'Topic Brief: Pacing Complex Chain-of-Thought with Task Budgets',
    roleContext: 'Role: Reasoning Systems Architect'
  },
  'cca-f-community-d5-007': {
    section: 'Thinking Block Integrity & Context Pruning',
    topic: 'thinking-prefix-integrity',
    difficulty: 'hard',
    topicBrief: 'Topic Brief: Prefix Dependency Constraints on Reasoning Blocks',
    roleContext: 'Role: Core Runtime Infrastructure Architect'
  }
};

let publishedCount = 0;
for (const q of questions) {
  if (q.status === 'quarantined' || q.status === 'rejected') continue;
  if (q.status !== 'ready' || q.reviewStatus !== 'approved') {
    const meta = metadataMap[q.id] || {};
    q.status = 'ready';
    q.reviewStatus = 'approved';
    q.mockEligible = true;
    q.contentVersion = q.contentVersion || 1;
    q.difficulty = meta.difficulty || q.difficulty || 'intermediate';
    if (meta.section) q.section = meta.section;
    if (meta.topic) q.topic = meta.topic;
    if (meta.topicBrief) q.topicBrief = meta.topicBrief;
    if (meta.roleContext) q.roleContext = meta.roleContext;
    publishedCount++;
  }
}

fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`[publish-all] Successfully published ${publishedCount} questions. Total: ${questions.length}`);

// Update data/exams.toml questions count
let toml = fs.readFileSync(examsPath, 'utf8');
const eligibleCount = questions.filter(q => q.status === 'ready' || q.status === 'released').length;
toml = toml.replace(/questions = \d+/, `questions = ${eligibleCount}`);
fs.writeFileSync(examsPath, toml);
console.log(`[publish-all] Updated data/exams.toml with questions = ${eligibleCount}`);

// Update content/exams/cca-f/_index.md
let indexMd = fs.readFileSync(indexPath, 'utf8');
indexMd = indexMd.replace(/PRACTICE \(\d[\d,]* Qs\)/g, `PRACTICE (${eligibleCount.toLocaleString('en-US')} Qs)`);
indexMd = indexMd.replace(/Browse \d[\d,]* practice questions/g, `Browse ${eligibleCount.toLocaleString('en-US')} practice questions`);
fs.writeFileSync(indexPath, indexMd);
console.log(`[publish-all] Updated content/exams/cca-f/_index.md with ${eligibleCount.toLocaleString('en-US')} questions.`);
