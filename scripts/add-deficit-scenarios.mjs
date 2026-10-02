import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, '../data/questions/cca-f/questions.json');

const newQuestions = [
  {
    id: "cca-f-deficit-041",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Multi-Agent Systems",
    topic: "subagent-tool-scoping",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Subagent Tool Scoping & Role Sandboxing",
    roleContext: "Role: AI Systems Engineer Handling Claude Agent SDK",
    scenario: "You are an AI Systems Engineer managing an automated incident triage pipeline built on the Claude Agent SDK. A primary Coordinator agent receives alert webhooks and spawns worker subagents using the AgentDefinition API. During a recent database outage, an incident triage subagent intended solely for log inspection invoked the shell tool to run destructive cleanup commands, causing unrecoverable service downtime. The coordinator had passed all its available tools to every spawned subagent without restriction.",
    prompt: "Which subagent configuration and tool distribution pattern should you implement to guarantee that the triage subagent is strictly constrained to its designated read-only diagnostic role?",
    options: [
      {
        "id": "A",
        "text": "Add a few-shot reminder to the coordinator system prompt instructing it to warn subagents not to execute destructive commands."
      },
      {
        "id": "B",
        "text": "Configure the subagent's AgentDefinition with explicit allowed_tools containing only read-only diagnostic tools (e.g. read_logs, query_metrics), omitting shell and destructive mutation tools entirely, and scope its system prompt exclusively to log analysis."
      },
      {
        "id": "C",
        "text": "Set max_turns to 2 on the subagent so it does not have enough conversation turns to execute unauthorized shell commands."
      },
      {
        "id": "D",
        "text": "Allow all tools on all subagents, but append a post-execution bash filter in the CI/CD wrapper that parses terminal text for rm and kill commands."
      }
    ],
    correct: "B",
    explanation: "Under the Principle of Least Privilege, subagents must be sandboxed at invocation time by configuring allowed_tools on their AgentDefinition to strictly include only tools required for their role. Soft prompt instructions (Option A) can be overridden or ignored, turn limits (Option C) do not prevent early destructive calls, and post-execution text parsing (Option D) operates after the damage has already occurred."
  },
  {
    id: "cca-f-deficit-042",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Dynamic Task Decomposition",
    topic: "adaptive-subtasks",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Dynamic Task Decomposition vs Fixed Pipelines",
    roleContext: "Role: Lead AI Architect Managing Complex Codebase Audits",
    scenario: "You are designing an autonomous codebase security audit agent that inspects legacy enterprise repositories. The initial architecture used a static Directed Acyclic Graph (DAG) pipeline that unconditionally executed four fixed stages: 1) Scan package.json, 2) Grep for eval(), 3) Inspect routes, 4) Draft vulnerability report. In production, when the agent discovers obfuscated base64 payloads in vendor binaries, the fixed pipeline ignores this discovery and continues to stage 3, failing to audit the discovered obfuscation vector.",
    prompt: "How should the orchestration architecture be restructured to ensure the agent dynamically adapts its investigation to intermediate discoveries?",
    options: [
      {
        "id": "A",
        "text": "Replace the static sequential pipeline with a dynamic coordinator-worker loop where the coordinator evaluates intermediate findings after each tool execution, generates new targeted subtasks (such as deobfuscation or binary analysis) based on discovered leads, and continues until all hypotheses are resolved."
      },
      {
        "id": "B",
        "text": "Hardcode an additional 20 static steps into the DAG pipeline covering every known potential vulnerability type in sequential order."
      },
      {
        "id": "C",
        "text": "Increase max_tokens on the final reporting prompt so the model can hallucinate what was inside the obfuscated binaries without scanning them."
      },
      {
        "id": "D",
        "text": "Switch from Claude Sonnet to Claude Haiku so the fixed four-step pipeline runs at lower latency."
      }
    ],
    correct: "A",
    explanation: "Dynamic task decomposition requires an adaptive agentic loop where intermediate tool findings are evaluated against the task objective. If an anomaly or new discovery arises, the coordinator dynamically spawns specialized subtasks rather than marching down an unyielding static waterfall pipeline."
  },
  {
    id: "cca-f-deficit-043",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "State Persistence",
    topic: "resumption-without-duplicate-work",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Multi-Agent State Persistence & Resumption",
    roleContext: "Role: Cloud Systems Engineer Handling Long-Running Pipelines",
    scenario: "You are running a multi-agent architectural analysis across a repository containing 1,500 source files. The process takes 45 minutes and runs on spot cloud compute instances that are subject to abrupt preemption and termination. When an instance is preempted at minute 40, the naive pipeline restarts from file 1, re-reading hundreds of files and exhausting API rate limits and token budgets.",
    prompt: "Which state persistence strategy enables reliable resumption after interruption without repeating completed analysis or losing prior findings?",
    options: [
      {
        "id": "A",
        "text": "Serialize and checkpoint a structured state object (containing completed file paths, content hashes, extracted entity schemas, and pending work queues) to durable storage after each subagent batch, resuming by loading only the structured checkpoint and uncompleted items."
      },
      {
        "id": "B",
        "text": "Save the entire raw conversational message history (100,000+ tokens) to disk and re-inject all raw turns into the model context upon restart."
      },
      {
        "id": "C",
        "text": "Run three identical pipeline workers in parallel from the beginning so that if one is terminated, another might finish first."
      },
      {
        "id": "D",
        "text": "Disable spot instance preemption warnings and configure Claude to summarize its own memory into a single text file every 5 seconds."
      }
    ],
    correct: "A",
    explanation: "Efficient multi-agent resumption requires checkpointing structured state objects (e.g. processed artifacts, entity summaries, remaining task queues) rather than raw token transcripts. Replaying full conversational transcripts causes severe context bloat and hits token limits, while structured checkpointing allows immediate pickup at the exact boundary of uncompleted work."
  },
  {
    id: "cca-f-deficit-044",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Orchestration Topology",
    topic: "coordinator-vs-parallel-vs-sequential",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Multi-Agent Orchestration Patterns & Trade-offs",
    roleContext: "Role: Principal Architect Designing Research Systems",
    scenario: "You are architecting an enterprise competitive intelligence platform. The workflow requires analyzing 50 competitor websites across 5 distinct regulatory regions, synthesizing contradictory pricing claims, and publishing an executive briefing with high source attribution within a strict 3-minute SLA.",
    prompt: "Which orchestration topology best balances research coverage, synthesis reliability, and the 3-minute latency requirement?",
    options: [
      {
        "id": "A",
        "text": "A purely sequential single-agent pipeline that visits all 50 websites one by one in a single conversation thread."
      },
      {
        "id": "B",
        "text": "A coordinator-worker pattern with parallel subagent execution: the coordinator spawns independent regional worker subagents in parallel to extract structured site data, and an Opus-powered synthesis coordinator reconciles conflicting findings into the final report."
      },
      {
        "id": "C",
        "text": "A fully decentralized peer-to-peer network where all 50 agents message each other directly without a coordinator."
      },
      {
        "id": "D",
        "text": "A single prompt containing all 50 website URLs passed to Claude Haiku with instructions to browse them simultaneously without tools."
      }
    ],
    correct: "B",
    explanation: "A coordinator-worker pattern with parallel subagent execution is ideal when tasks are horizontally partitionable (50 sites / 5 regions) and bound by tight latency SLAs. Parallel workers maximize throughput, while a centralized coordinator performs structured synthesis and resolves conflicting claims without peer-to-peer coordination overhead."
  },
  {
    id: "cca-f-deficit-045",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Automated Code Review",
    topic: "claude-code-review-config",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Automated Code Review via Claude Code CLI",
    roleContext: "Role: DevSecOps Engineer Integrating Claude Code into CI/CD",
    scenario: "You are setting up an automated PR review job in GitHub Actions using Claude Code CLI (`claude -p`). The automated reviewer must evaluate pull requests against company architectural guidelines, must not make any filesystem changes or commit code, and must output structured JSON conforming to a schema required by the GitHub PR comment bot.",
    prompt: "How should the Claude Code CLI invocation and configuration be structured to satisfy these requirements securely?",
    options: [
      {
        "id": "A",
        "text": "Run `claude` in interactive mode on the runner and pipe mock keystrokes into stdin."
      },
      {
        "id": "B",
        "text": "Invoke `claude -p 'review PR'` with `--disallowedTools Edit,Write,Bash`, load project standards via `.claude/rules/pr-standards.md`, and pass structured output enforcement parameters or a tool definition with `tool_choice` to guarantee strict JSON output."
      },
      {
        "id": "C",
        "text": "Grant full `--dangerously-skip-permissions` with write access, and add a prompt sentence: 'Please do not edit any files if you can avoid it'."
      },
      {
        "id": "D",
        "text": "Execute `claude` inside an unprivileged Docker container with no project context files and parse freeform markdown comments."
      }
    ],
    correct: "B",
    explanation: "In automated review pipelines, Claude Code must be invoked non-interactively (`-p`), stripped of mutating tools via `--disallowedTools` (or settings permissions), grounded in project standards via path/review rules (`.claude/rules/`), and constrained to structured JSON output via tool use or schema definitions for downstream automated consumption."
  },
  {
    id: "cca-f-deficit-046",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Configuration Hierarchy",
    topic: "claude-md-vs-rules-vs-hooks",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Claude Code Configuration Hierarchy & Scoping",
    roleContext: "Role: Staff Software Engineer Standardizing Repository Tooling",
    scenario: "Your engineering organization has 120 engineers working on a monorepo containing a Python backend (`/services/api/`) and a TypeScript frontend (`/apps/web/`). You need to: 1) Enforce strict TypeScript typing rules only when frontend files are modified, 2) Provide general architecture overview globally, and 3) Deterministically block any tool execution that attempts to run `git push --force` across all developers.",
    prompt: "Which Claude Code configuration mechanisms should be selected for these three requirements?",
    options: [
      {
        "id": "A",
        "text": "Put all typing rules, architecture notes, and bash warnings into a single root `CLAUDE.md` file."
      },
      {
        "id": "B",
        "text": "Root `CLAUDE.md` for global architecture overview; `.claude/rules/frontend.md` with glob pattern `paths: ['apps/web/**']` for frontend typing rules; and a `PreToolUse` hook in `.claude/settings.json` executing a deterministic validation script that rejects `git push --force`."
      },
      {
        "id": "C",
        "text": "Create three different custom Skills that developers must remember to trigger manually before running any CLI command."
      },
      {
        "id": "D",
        "text": "Configure global `~/.claude/CLAUDE.md` on each developer's laptop with hardcoded frontend rules."
      }
    ],
    correct: "B",
    explanation: "Claude Code provides a layered configuration hierarchy: root `CLAUDE.md` provides universal repository context; `.claude/rules/*.md` with `paths:` frontmatter ensures modular rules load only for matching file globs (saving context); and deterministic security invariants (like blocking forbidden shell commands) must be enforced via `PreToolUse` hooks in settings, not advisory prompt text."
  },
  {
    id: "cca-f-deficit-047",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D5 Context Management & Reliability",
    section: "Codebase Exploration",
    topic: "grep-glob-read-context-strategy",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Systematic Codebase Exploration Strategies",
    roleContext: "Role: Senior AI Architect Implementing Autonomous Dev Tools",
    scenario: "An autonomous developer agent is tasked with fixing an authentication session bug in a 2-million-line codebase. The agent immediately calls `Read` on 30 full files in the `auth/` directory, exceeding the 200,000-token context window within its first three turns and crashing the session.",
    prompt: "Which exploration sequence represents the correct systematic strategy to build incremental understanding while managing context window constraints?",
    options: [
      {
        "id": "A",
        "text": "First use Glob to map directory structure and discover file names; then use targeted Grep to pinpoint exact function signatures, error strings, or symbol definitions; finally use Read with line-range offsets (start_line/end_line) on only the relevant code sections."
      },
      {
        "id": "B",
        "text": "Run a single Bash script that concats all `.ts` files into one master text file and feeds it into the agent's system prompt."
      },
      {
        "id": "C",
        "text": "Immediately call Read on the largest file in the repository to maximize initial context ingestion."
      },
      {
        "id": "D",
        "text": "Instruct the model to guess the file contents based on package names without invoking any tools."
      }
    ],
    correct: "A",
    explanation: "The canonical exploration funnel is Glob (structural discovery) -> Grep (high-signal symbol/error location) -> targeted Read (reading only localized line ranges). Reading entire files prematurely floods the context window with boilerplate, pushing early critical instructions out of the effective attention span."
  },
  {
    id: "cca-f-deficit-048",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Subagent Communication",
    topic: "subagent-output-schemas",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Subagent Output Schemas for Downstream Synthesis",
    roleContext: "Role: AI Pipeline Architect Building Research Agents",
    scenario: "In a hierarchical multi-agent research pipeline, worker subagents research medical literature and return their findings to a synthesis coordinator. When workers return freeform conversational prose summaries, the coordinator frequently loses track of publication years, confuses conflicting clinical trial outcomes, and drops citation URLs during final report compilation.",
    prompt: "How should the subagent return format be architected to optimize synthesis quality and citation fidelity?",
    options: [
      {
        "id": "A",
        "text": "Instruct subagents to write longer conversational paragraphs with poetic adjectives."
      },
      {
        "id": "B",
        "text": "Enforce a strict structured output schema via tool use that mandates three distinct sections: 1) structured metadata (study_id, sample_size, year), 2) atomic claims with certainty levels (established vs conflicting), and 3) explicit source citations with exact URI anchors."
      },
      {
        "id": "C",
        "text": "Require subagents to dump raw HTML source code of the medical papers into the coordinator conversation."
      },
      {
        "id": "D",
        "text": "Eliminate subagents and have the coordinator perform all search and synthesis in a single prompt."
      }
    ],
    correct: "B",
    explanation: "Downstream synthesis agents require structured payloads that cleanly separate quantitative metadata, atomic factual claims (with certainty scores), and verifiable source citations. Freeform conversational text creates extraction ambiguity and increases hallucination during synthesis."
  },
  {
    id: "cca-f-deficit-049",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D5 Context Management & Reliability",
    section: "Long Session Context Management",
    topic: "scratchpad-and-subagent-isolation",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Context Management via Scratchpads & Subagent Isolation",
    roleContext: "Role: Systems Architect Designing Multi-Hour Code Refactoring Workflows",
    scenario: "A refactoring agent is converting 50 React components from class syntax to functional hooks. As the session progresses beyond turn 25, the conversation token count approaches 180k tokens. The agent begins repeating previously fixed errors, hallucinates variable names from components refactored 20 turns prior, and slows down significantly.",
    prompt: "Which context management pattern should be implemented to sustain coherent exploration and execution across sessions exceeding token limits?",
    options: [
      {
        "id": "A",
        "text": "Subagent isolation combined with an external scratchpad file: isolate each component refactor to a fresh subagent with a clean context window, and persist refactoring progress, shared utilities, and component mappings to a persistent markdown scratchpad file (e.g. `refactor_progress.md`)."
      },
      {
        "id": "B",
        "text": "Keep all 50 component conversions in a single unbroken conversation thread and set temperature to 0.9."
      },
      {
        "id": "C",
        "text": "Truncate the system prompt by 80% to free up context space for more component tokens."
      },
      {
        "id": "D",
        "text": "Re-run the entire conversation from turn 1 after every component refactor."
      }
    ],
    correct: "A",
    explanation: "To manage context bloat in iterative multi-file tasks, architects isolate atomic units of work to clean subagent sessions (`context: fork` or fresh subagent invocations) and maintain cross-task state in an external scratchpad file. This decouples total project volume from individual conversation window limits."
  },
  {
    id: "cca-f-deficit-050",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Specialized Review Passes",
    topic: "separation-of-concerns-review",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Specialized Review Passes & Separation of Concerns",
    roleContext: "Role: Application Security Architect Automating Code Audits",
    scenario: "You are designing an automated code review workflow for enterprise backend PRs. Your initial prompt asked Claude to simultaneously verify SQL injection vulnerabilities, check business logic compliance, review REST API naming standards, validate performance benchmarks, and check spelling in docstrings. Evaluation benchmarks show that recall for critical SQL injection vulnerabilities dropped by 45% compared to baseline.",
    prompt: "Why did security recall drop, and what architectural redesign should you implement?",
    options: [
      {
        "id": "A",
        "text": "Competing concerns in a single monolithic prompt cause attention dilution and cognitive overload; decompose the review into specialized, sequential or parallel review passes (e.g. Pass 1: Security & Injection vulnerabilities with dedicated few-shot examples; Pass 2: Business logic & validation; Pass 3: API style & conventions)."
      },
      {
        "id": "B",
        "text": "The prompt was too short; combine all rules into a single 5,000-word paragraph and increase temperature to 1.0."
      },
      {
        "id": "C",
        "text": "Claude cannot detect SQL injection; switch entirely to static regex rules and remove LLM review."
      },
      {
        "id": "D",
        "text": "Run the same monolithic prompt three times and accept findings only if all three runs report them."
      }
    ],
    correct: "A",
    explanation: "When a single prompt combines competing review concerns (security, style, business logic), the model experiences attention trade-offs and recall degradation. Partitioning the audit into dedicated, specialized review passes with focused prompts and few-shot examples restores high recall for critical safety and security defects."
  },
  {
    id: "cca-f-deficit-051",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Truncation Failure Recovery",
    topic: "splitting-large-outputs-vs-max-tokens",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Structured Output Truncation & Chunk Splitting",
    roleContext: "Role: Senior Backend Engineer Handling High-Volume JSON APIs",
    scenario: "Your application requests an exhaustive security audit of a 5,000-line microservice, expecting a single structured JSON response containing findings across all modules. The API call frequently aborts with `stop_reason: \"max_tokens\"`, generating incomplete, invalid JSON that crashes downstream JSON parsers. The developer on call proposes increasing `max_tokens` from 4,096 to 16,384.",
    prompt: "What is the correct architectural solution to resolve this structured output truncation failure?",
    options: [
      {
        "id": "A",
        "text": "Increase `max_tokens` to the maximum supported model limit and retry indefinitely on JSON parse error."
      },
      {
        "id": "B",
        "text": "Decompose the large audit task into smaller scoped review API calls (e.g. per module, file, or functional slice) that output bounded JSON structures, and programmatically merge the resulting structured objects in client-side orchestration code."
      },
      {
        "id": "C",
        "text": "Instruct the model in the prompt to compress its output by removing all spaces, punctuation, and keys from the JSON."
      },
      {
        "id": "D",
        "text": "Switch from JSON output to freeform conversational English text so that syntax errors cannot occur."
      }
    ],
    correct: "B",
    explanation: "Simply increasing max_tokens increases latency, risk of mid-generation timeout, and cost without guaranteeing immunity from schema truncation. The robust architectural pattern is task splitting (fan-out): evaluate individual modules in parallel or chunked API calls with bounded JSON schemas, then merge the structured objects deterministically."
  },
  {
    id: "cca-f-deficit-052",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D2 Tool Design & MCP Integration",
    section: "Multi-Agent Tool Distribution",
    topic: "least-privilege-tool-distribution",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Tool Distribution & Decision Complexity in Multi-Agent Systems",
    roleContext: "Role: Enterprise AI Architect Building Agentic Microservices",
    scenario: "You are building a customer operations agent network consisting of three subagents: Billing Inquiry, Technical Diagnostics, and Account Provisioning. Currently, all 45 organizational tools (SQL mutations, credential resets, network pings, invoice PDFs) are provided in the `tools` array of every subagent. Telemetry indicates high tool misrouting (subagents calling irrelevant tools) and occasional accidental privilege escalations.",
    prompt: "How should tool distribution be configured across these subagents?",
    options: [
      {
        "id": "A",
        "text": "Assign each subagent strictly the minimal subset of tools required for its designated domain (e.g. Billing gets only invoice/payment tools, Diagnostics gets telemetry tools), reducing model decision complexity and preventing out-of-role invocations."
      },
      {
        "id": "B",
        "text": "Keep all 45 tools accessible to all subagents, but prefix every tool description with 'DO NOT USE UNLESS AUTHORIZED'."
      },
      {
        "id": "C",
        "text": "Remove all tools and require subagents to write Python scripts from scratch to interact with APIs."
      },
      {
        "id": "D",
        "text": "Switch all subagents to Claude Haiku to reduce the token cost of transmitting 45 tool definitions on every turn."
      }
    ],
    correct: "A",
    explanation: "Supplying an excessive tool catalog increases prompt token overhead, expands the model's decision search space, and causes tool misrouting. Distributing strictly scoped tool sets per subagent adheres to the Principle of Least Privilege, simplifies tool selection reasoning, and eliminates cross-domain security hazards."
  },
  {
    id: "cca-f-deficit-053",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D2 Tool Design & MCP Integration",
    section: "Tool Choice & Sequencing",
    topic: "tool-choice-guarantee-and-prerequisites",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Guaranteed Tool Invocation & Workflow Sequencing",
    roleContext: "Role: AI Integration Engineer Handling Financial Transactions",
    scenario: "In an automated invoice processing workflow, an agent must extract metadata from an invoice PDF and call the `submit_invoice_record` tool. In 15% of executions, Claude responds with a conversational greeting ('Here is the extracted invoice...') instead of triggering the tool, causing the downstream automated pipeline to fail.",
    prompt: "How should the tool configuration and workflow sequencing be architected to guarantee tool execution and ensure prerequisite data is present?",
    options: [
      {
        "id": "A",
        "text": "Configure `tool_choice: {\"type\": \"tool\", \"name\": \"submit_invoice_record\"}` when invoking the submission step, and sequence the workflow so invoice parsing occurs in a prior step before the submission tool is exposed."
      },
      {
        "id": "B",
        "text": "Use `tool_choice: {\"type\": \"auto\"}` and add 'PLEASE ALWAYS CALL THE TOOL' in bold capital letters in the prompt."
      },
      {
        "id": "C",
        "text": "Expose both the invoice extraction tool and submission tool simultaneously and set `tool_choice: {\"type\": \"any\"}`."
      },
      {
        "id": "D",
        "text": "Parse the model's conversational response with regex to extract invoice fields when the tool is not called."
      }
    ],
    correct: "A",
    explanation: "When an agent turn must trigger a specific structured output or API action without conversational preamble, `tool_choice: {\"type\": \"tool\", \"name\": \"...\"}` enforces deterministic tool invocation. Furthermore, multi-tool workflows must be sequenced so that prerequisite data extraction happens before exposing the dependent mutation tool."
  },
  {
    id: "cca-f-deficit-054",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Human-in-the-Loop Routing",
    topic: "confidence-based-review-routing",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Human Review Routing & Ambiguity Triage",
    roleContext: "Role: Lead AI Solutions Architect Designing Document Extraction Systems",
    scenario: "You are architecting an automated insurance claims processing engine handling 50,000 claims daily. Regulators require human oversight, but human review capacity is capped at 5,000 claims per day (10%). The current system randomly routes 10% of all extractions to human reviewers, resulting in human reviewers approving straightforward clean claims while erroneous ambiguous extractions slip into production untouched.",
    prompt: "Which routing architecture maximizes audit efficacy and catches the highest volume of errors within the 5,000-claim review budget?",
    options: [
      {
        "id": "A",
        "text": "Design a dynamic routing policy that calculates an extraction confidence score based on field-level ambiguity, model log-probabilities or self-reported field confidence flags, document quality indicators (e.g. low OCR resolution), and high-dollar thresholds, routing only the highest-risk / lowest-confidence claims to human reviewers."
      },
      {
        "id": "B",
        "text": "Double the human review team size so 20% of claims can be randomly sampled."
      },
      {
        "id": "C",
        "text": "Route the first 5,000 claims received each morning to humans, and automatically approve all claims received in the afternoon."
      },
      {
        "id": "D",
        "text": "Instruct Claude in the prompt to guarantee 100% extraction accuracy so human review can be completely abolished."
      }
    ],
    correct: "A",
    explanation: "Human-in-the-loop review capacity is a scarce resource. Instead of random sampling, optimal architecture routes based on risk signals: field-level ambiguity, schema validation flags, low extraction confidence, document anomalies, and high-value claim thresholds."
  },
  {
    id: "cca-f-deficit-055",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Schema Design Patterns",
    topic: "optional-fields-and-nullables-anti-hallucination",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Extraction Schemas & Preventing Value Fabrication",
    roleContext: "Role: Data Architect Designing Clinical Information Extraction",
    scenario: "You are designing a JSON extraction schema to extract patient demographics from unstructured medical discharge notes. In your schema, fields such as `emergency_contact_phone` and `secondary_insurance_id` are defined as required string properties. In evaluation tests on 1,000 records where patients did not have secondary insurance, Claude fabricated plausible 10-digit phone numbers and alphanumeric policy IDs in 28% of cases.",
    prompt: "Why is the model fabricating these values, and how should the JSON schema be modified to eliminate this hallucination vector?",
    options: [
      {
        "id": "A",
        "text": "When a schema marks non-universal fields as strictly required non-null types, the model is forced to choose between schema violation and value fabrication; modify the schema to make missing fields optional or define them as nullable (`{\"type\": [\"string\", \"null\"]}`), and provide explicit prompt instructions to emit `null` when data is absent."
      },
      {
        "id": "B",
        "text": "Add a few-shot example showing a patient who has secondary insurance."
      },
      {
        "id": "C",
        "text": "Change the prompt to say: 'Please try your best not to invent fake phone numbers'."
      },
      {
        "id": "D",
        "text": "Convert the schema from JSON Schema to YAML."
      }
    ],
    correct: "A",
    explanation: "Rigid schemas that mandate required values for attributes that may not exist in the source document force the model to hallucinate or fabricate values to satisfy schema validation constraints. Supporting nullable types (`type: ['string', 'null']`), optional properties, and explicit enums (`'UNKNOWN'`, `'NOT_APPLICABLE'`) allows the model to faithfully report missing data."
  },
  {
    id: "cca-f-deficit-056",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Delegation Strategies",
    topic: "goal-oriented-vs-procedural-delegation",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Subagent Delegation: Goal-Oriented vs Procedural Instructions",
    roleContext: "Role: Multi-Agent Systems Architect",
    scenario: "You are architecting an automated troubleshooting agent for cloud networking issues. In Version 1, the coordinator issued strict procedural instructions to subagents ('Step 1: ping 10.0.0.1; Step 2: traceroute; Step 3: cat iptables'). When the subagent encountered a cloud security group blocking ICMP on Step 1, it crashed and halted, despite DNS and VPC routing tools being readily available. In Version 2, the team wants more adaptive behavior while retaining coordinator control.",
    prompt: "How should subagent delegation instructions be formulated to enable adaptive problem-solving while preserving coordinator visibility?",
    options: [
      {
        "id": "A",
        "text": "Provide goal-oriented instructions defining the desired end state, acceptance criteria, available tools, and boundary constraints, allowing the subagent to adapt its investigation strategy to unexpected errors while requiring structured progress reporting back to the coordinator."
      },
      {
        "id": "B",
        "text": "Write a 500-step procedural script covering every possible network error in exact if-else order."
      },
      {
        "id": "C",
        "text": "Remove the coordinator completely and let the subagent run indefinitely with no goal or instructions."
      },
      {
        "id": "D",
        "text": "Instruct the subagent to ignore all ping failures and assume the network is always healthy."
      }
    ],
    correct: "A",
    explanation: "Rigid procedural instructions make agents brittle to unexpected environmental errors. Goal-oriented delegation establishes the objective, constraints, and success criteria, empowering the subagent to dynamically pivot (e.g. switching from ICMP ping to TCP/DNS checks) while maintaining coordinator governance through structured milestone reporting."
  },
  {
    id: "cca-f-deficit-057",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D3 Claude Code Configuration & Workflows",
    section: "CI/CD Pipeline Automation",
    topic: "claude-code-cli-flags-and-limits",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Claude Code CLI Non-Interactive CI/CD Invocations",
    roleContext: "Role: Lead Platform Architect Managing CI/CD Infrastructure",
    scenario: "You are configuring a headless nightly documentation updater in GitLab CI using Claude Code CLI. In an initial test run without safeguards, a bug in an MCP server caused the agent to enter an infinite loop of failing tool retries, running for 6 hours and consuming $450 in API credits before the CI runner timed out.",
    prompt: "Which Claude Code CLI invocation parameters and flags must be configured to prevent runaway execution in automated headless pipelines?",
    options: [
      {
        "id": "A",
        "text": "Invoke `claude -p '<prompt>'` with explicit cost and iteration limits: `--max-turns <N>` (or SDK turn cap), `--max-cost <USD>`, and configure a hard CI job timeout in the runner definition."
      },
      {
        "id": "B",
        "text": "Run `claude` with `--dangerously-skip-permissions` and rely solely on the developer's honor not to write infinite loops."
      },
      {
        "id": "C",
        "text": "Set model temperature to 0.0 and assume deterministic models can never loop."
      },
      {
        "id": "D",
        "text": "Run the command in background mode with `nohup claude &` and disown the process."
      }
    ],
    correct: "A",
    explanation: "Automated CI/CD invocations of Claude Code must be strictly non-interactive (`-p`) and guarded by deterministic execution caps: `--max-turns` to limit agentic loop iterations, cost caps (`--max-cost`) to prevent budget exhaustion, and runner-level timeouts as a secondary fail-safe."
  },
  {
    id: "cca-f-deficit-058",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Explicit Prompt Boundaries",
    topic: "inclusion-and-exclusion-boundaries",
    difficulty: "advanced",
    topicBrief: "Topic Brief: Defining Explicit Inclusion & Exclusion Boundaries in Prompts",
    roleContext: "Role: Legal AI Architect Building Contract Analysis Agents",
    scenario: "You are developing a contract risk extraction prompt for an enterprise procurement team. The prompt instructs Claude: 'Identify all risks in the attached vendor contract.' During testing, Claude generates dozens of low-value, speculative findings regarding hypothetical macroeconomic inflation and force majeure asteroid strikes, drowning out actionable indemnity and confidentiality liabilities.",
    prompt: "How should the prompt criteria be designed to eliminate noise and focus extractions on high-reliability categories?",
    options: [
      {
        "id": "A",
        "text": "Establish explicit inclusion criteria (e.g. uncapped indemnification, IP ownership transfer, confidentiality breaches exceeding standard terms) and strict exclusion boundaries (e.g. standard force majeure, general macroeconomic inflation, standard boilerplate governing law clauses), with negative few-shot examples illustrating non-reportable findings."
      },
      {
        "id": "B",
        "text": "Instruct Claude to 'only extract important things' without defining what important means."
      },
      {
        "id": "C",
        "text": "Lower max_tokens to 100 so Claude only has room to type one sentence."
      },
      {
        "id": "D",
        "text": "Switch to Claude Opus without changing the prompt text."
      }
    ],
    correct: "A",
    explanation: "Open-ended extraction prompts ('extract all risks') cause high false-positive rates because LLMs will surface tangential or speculative findings to satisfy broad criteria. Defining explicit inclusion boundaries, explicit negative exclusions, and boundary few-shot examples anchors the model to actionable, high-precision findings."
  }
];

// Load existing questions
const existing = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const existingIds = new Set(existing.map(q => q.id));

let addedCount = 0;
for (const q of newQuestions) {
  if (!existingIds.has(q.id)) {
    existing.push(q);
    addedCount++;
  }
}

fs.writeFileSync(questionsPath, JSON.stringify(existing, null, 2));
console.log(`[add-deficit-scenarios] Added ${addedCount} new scenario questions. Total in cca-f: ${existing.length}`);
