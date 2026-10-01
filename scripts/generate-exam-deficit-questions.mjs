#!/usr/bin/env node
/**
 * generate-exam-deficit-questions.mjs
 *
 * Generates 36 advanced, exam-grade scenario questions targeting the 18 specific
 * deficit objectives from the official Pearson VUE CCAR-F score report.
 */

import fs from 'node:fs';
import path from 'node:path';

const questions = [
  // Objective 5 (0%): Subagent tool restrictions & context scoping
  {
    id: "cca-f-deficit-001",
    exam: "cca-f",
    status: "ready",
    reviewStatus: "approved",
    sourceId: "cca-f-exam-score-target",
    contentVersion: 1,
    mockEligible: true,
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Subagent Invocations & Scoping",
    topic: "tool-restrictions",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Enterprise Database Migration Assistant. Situation: A coordinator agent orchestrates a multi-step migration. It delegates schema analysis to a SchemaAnalyzer subagent. During execution, the SchemaAnalyzer accidentally invoked a destructive DROP TABLE command on a staging database while attempting to verify index constraints. How should the architect reconfigure the subagent invocation to prevent destructive actions?",
    options: [
      { id: "A", text: "Prepend an instruction in the SchemaAnalyzer system prompt stating that it must operate in read-only mode and never call destructive DDL commands." },
      { id: "B", text: "Configure the subagent invocation with an allowedTools array strictly limited to read-only inspection tools (list_tables, describe_table, get_indexes), omitting execution tools." },
      { id: "C", text: "Implement an auxiliary classifier agent that intercepts all subagent outputs and evaluates whether generated commands are safe." },
      { id: "D", text: "Increase coordinator temperature so it samples and audits child actions more frequently." }
    ],
    correct: "B",
    explanation: "Hard operational boundaries and security limits must be enforced deterministically through tool restriction. Restricting the allowedTools array passed to the subagent physically prevents the model from calling destructive tools, whereas prompt-based instructions are probabilistic and vulnerable to failure."
  },
  {
    id: "cca-f-deficit-002",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Subagent Invocations & Scoping",
    topic: "context-scoping",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Tiered Customer Support System. Situation: A coordinator agent routes refund inquiries to a specialized PolicyEvaluation subagent. The subagent unexpectedly called an external payment gateway tool to issue an immediate credit, bypassing the required manager sign-off. What is the correct architectural control to confine the subagent to evaluation only?",
    options: [
      { id: "A", text: "Strip payment and transaction tools from the PolicyEvaluation subagent's allowedTools list, granting it access only to policy document retrieval tools." },
      { id: "B", text: "Instruct the subagent in its prompt to always ask the customer for manager approval before calling payment tools." },
      { id: "C", text: "Add a 30-second delay in the agentic loop to give human supervisors time to cancel erroneous transactions." },
      { id: "D", text: "Increase the max_tokens limit so the subagent can output longer justifications for its refund actions." }
    ],
    correct: "A",
    explanation: "Constraining an agent to its designated evaluation role requires removing execution tools from its allowedTools list. Providing only retrieval tools guarantees the subagent cannot trigger side effects or financial transactions."
  },

  // Objective 7 (0%): Dynamic subtask generation vs. fixed sequence
  {
    id: "cca-f-deficit-003",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Task Decomposition",
    topic: "dynamic-subtasks",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Cloud Security Audit Pipeline. Situation: A coordinator agent follows a fixed three-step plan: (1) Scan open network ports, (2) Scan public HTTP endpoints, (3) Verify SSL certificates. During Step 1, the port scanner discovers an active unauthenticated Redis database on non-standard port 6380. Because the sequence is pre-programmed, the pipeline completes Step 3 and exits without examining the exposed database. How should the task decomposition architecture be redesigned?",
    options: [
      { id: "A", text: "Hardcode checks for all 65,535 possible network ports and database protocols into the initial static task sequence." },
      { id: "B", text: "Implement an adaptive coordinator loop that evaluates intermediate structured findings from completed subtasks and dynamically enqueues targeted investigation subtasks before final reporting." },
      { id: "C", text: "Instruct the initial port scanning tool to loop infinitely until no additional open ports exist." },
      { id: "D", text: "Raise the coordinator's temperature to 0.9 to encourage spontaneous exploration during static execution." }
    ],
    correct: "B",
    explanation: "Static linear pipelines cannot adapt to emergent findings. An adaptive coordinator inspects structured outputs from intermediate steps, evaluates discovered entities against inspection criteria, and dynamically schedules follow-up tasks."
  },
  {
    id: "cca-f-deficit-004",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Task Decomposition",
    topic: "dynamic-subtasks",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Forensic Incident Triage. Situation: An incident triage agent executes a static sequence of log inspection scripts. In the first step, firewall logs reveal an unexpected cluster of outbound data transfers to an unknown IP range. The static pipeline proceeds directly to user authentication logs, ignoring the data exfiltration indicator. How should the workflow be structured to investigate anomalies?",
    options: [
      { id: "A", text: "Replace the static pipeline with dynamic task decomposition, where an anomaly evaluator examines step outputs and dynamically schedules an IP reputation and egress volume subtask." },
      { id: "B", text: "Merge all log analysis scripts into a single massive bash command executed via the CLI." },
      { id: "C", text: "Add a prompt clause asking the model to think about potential anomalies while running the static script sequence." },
      { id: "D", text: "Double the token budget allocated to the authentication log analysis step." }
    ],
    correct: "A",
    explanation: "Dynamic task decomposition enables autonomous agents to adapt to real-time discoveries. When intermediate tool results return anomalous indicators, the coordinator dynamically schedules targeted subtasks to investigate."
  },

  // Objective 9 (0%): State persistence across multi-agent pipelines
  {
    id: "cca-f-deficit-005",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "State Persistence",
    topic: "pipeline-resumption",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Clinical Trial Regulatory Pipeline. Situation: A pipeline orchestrates 8 sequential subagents analyzing pharmacology trial filings over 45 minutes. A transient network timeout during Agent 6 causes the process to crash. Currently, engineers must restart the entire pipeline from Agent 1, wasting substantial compute and breaching SLA windows. What state persistence pattern enables reliable resumption?",
    options: [
      { id: "A", text: "Persist task completion records, input parameters, and generated artifact URIs to an external state ledger; on restart, the pipeline reads the ledger and resumes directly from Agent 6." },
      { id: "B", text: "Store all intermediate turn transcripts in Node.js volatile process memory and use a try/catch loop." },
      { id: "C", text: "Pass the raw cumulative conversation history as a system prompt to Agent 6 upon manual re-invocation." },
      { id: "D", text: "Combine the 8 subagents into a single monolithic prompt to avoid multi-agent state boundaries." }
    ],
    correct: "A",
    explanation: "Resilient multi-agent state persistence requires an externalized task ledger (database or persistent JSON manifest). Checkpointing completed task outputs and artifact pointers allows the pipeline to resume from the point of failure without repeating completed work."
  },
  {
    id: "cca-f-deficit-006",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "State Persistence",
    topic: "pipeline-resumption",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Distributed Document Synthesis Pipeline. Situation: A financial research pipeline runs three data extraction subagents followed by a synthesis agent. If the server container terminates during synthesis, all extracted subagent data is lost. How should intermediate findings be managed to ensure idempotent recovery?",
    options: [
      { id: "A", text: "Require each extraction subagent to write its validated findings to a persistent storage location and record the task state in a manifest before the coordinator invokes synthesis." },
      { id: "B", text: "Instruct the coordinator to re-run all web searches automatically whenever a network error is caught." },
      { id: "C", text: "Rely on Claude's internal prompt caching to retain subagent outputs across container crashes." },
      { id: "D", text: "Send all extraction outputs as email attachments to the administrator." }
    ],
    correct: "A",
    explanation: "Prompt cache and container memory are volatile. Persisting structured outputs to durable storage and updating an orchestration manifest ensures the synthesis stage can be re-run independently using pre-computed extractions."
  },

  // Objective 10 (0%): Multi-agent orchestration patterns
  {
    id: "cca-f-deficit-007",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Orchestration Patterns",
    topic: "topology-selection",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Comprehensive Market Intelligence Report. Situation: An investment system must analyze 10 competitor companies across regulatory filings, quarterly earnings, and patent grants within a 5-minute SLA. A sequential agentic pipeline takes 22 minutes to execute. Which orchestration pattern best satisfies the coverage, latency, and reliability requirements?",
    options: [
      { id: "A", text: "A coordinator-worker pattern with parallel subagent execution, where the coordinator spawns 10 concurrent worker subagents and aggregates their structured outputs into a synthesis pass." },
      { id: "B", text: "A single sequential agent loop with an expanded context window of 200k tokens." },
      { id: "C", text: "A fully decentralized peer-to-peer network where subagents message each other without a coordinator." },
      { id: "D", text: "A monolithic batch prompt submitted to the Message Batches API." }
    ],
    correct: "A",
    explanation: "When independent subtasks can be executed simultaneously, the coordinator-worker pattern with parallel subagent execution collapses total round-trip time from linear O(N) to concurrent O(1) latency while maintaining centralized synthesis quality."
  },
  {
    id: "cca-f-deficit-008",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Orchestration Patterns",
    topic: "topology-selection",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Code Vulnerability Patching Workflow. Situation: An engineering agent receives a reported vulnerability, locates the vulnerable AST node, generates a patch, verifies the patch against regression tests, and opens a pull request. A developer suggests running test verification in parallel with patch generation to minimize latency. Why is this suggestion architecturally flawed?",
    options: [
      { id: "A", text: "Regression testing has a hard sequential dependency on the generated patch artifact; running it in parallel evaluates unmodified code and produces invalid results." },
      { id: "B", text: "Parallel execution always costs four times more than sequential execution regardless of token usage." },
      { id: "C", text: "Claude cannot execute more than one tool per calendar day." },
      { id: "D", text: "Regression test suites can only be executed in interactive terminal sessions." }
    ],
    correct: "A",
    explanation: "Parallel execution is appropriate strictly for independent tasks. When Step B requires the artifact produced by Step A (e.g. testing requires the generated patch), the workflow must be sequenced deterministically."
  },

  // Objective 13 (0%): Claude Code review configurations with tool restrictions & structured output
  {
    id: "cca-f-deficit-009",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Claude Code Configurations",
    topic: "review-tool-restrictions",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Automated Security Review in GitHub Actions. Situation: A platform team integrates Claude Code into CI to perform automated pull request reviews. In several runs, the review agent executed arbitrary shell scripts and created temporary files in the repository workspace. How should the review invocation be configured for secure, automated downstream processing?",
    options: [
      { id: "A", text: "Invoke Claude Code in headless non-interactive mode with file-writing tools disabled, restricting tool access to read-only inspection (Read, Grep, Glob) and enforcing JSON schema output." },
      { id: "B", text: "Add a comment in the PR template asking Claude Code not to run bash scripts." },
      { id: "C", text: "Grant full administrative permissions to the runner container and delete temporary files after the job finishes." },
      { id: "D", text: "Run Claude Code in an interactive tmux terminal session with human oversight." }
    ],
    correct: "A",
    explanation: "Automated review pipelines must operate with least privilege. Restricting Claude Code tool access to read-only tools prevents side-effects, and enforcing JSON schema output ensures downstream CI jobs can parse and act on findings deterministically."
  },
  {
    id: "cca-f-deficit-010",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Claude Code Configurations",
    topic: "review-tool-restrictions",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Code Compliance Linting with Claude Code. Situation: A compliance auditor tool based on Claude Code must inspect source files for cryptographic weaknesses and export findings to an enterprise dashboard. It occasionally fails because the model outputs informal markdown summaries instead of machine-readable data. What configuration guarantees compliant output?",
    options: [
      { id: "A", text: "Invoke the CLI with --output-format json and provide a JSON schema via --json-schema while restricting execution permissions." },
      { id: "B", text: "Append 'OUTPUT ONLY VALID JSON OR BE TERMINATED' to the prompt." },
      { id: "C", text: "Use regular expressions in Python to parse the terminal console output." },
      { id: "D", text: "Lower the context window limit to 1,000 tokens." }
    ],
    correct: "A",
    explanation: "Enforcing structured output in Claude Code automation requires using the native --output-format json and --json-schema parameters. This forces the model to adhere strictly to the target schema for automated downstream processing."
  },

  // Objective 16 (0%): Claude Code configuration mechanism selection
  {
    id: "cca-f-deficit-011",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Configuration Mechanisms",
    topic: "scoping-hierarchy",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Polyglot Monorepo Architecture. Situation: A repository contains a Go microservice in /services/auth and a React application in /apps/dashboard. When developers use Claude Code in /apps/dashboard, the tool frequently hallucinates Go concurrency conventions and test imports. All guidelines are currently located in the root CLAUDE.md. What is the correct configuration refactor?",
    options: [
      { id: "A", text: "Retain only repo-wide conventions in the root CLAUDE.md, and create path-scoped rule files in .claude/rules/go.md (with globs: ['services/**']) and .claude/rules/web.md (with globs: ['apps/**'])." },
      { id: "B", text: "Instruct developers to add personal language settings to ~/.claude/CLAUDE.md on their individual laptops." },
      { id: "C", text: "Create two separate git repositories and completely disallow monorepos." },
      { id: "D", text: "Prompt Claude Code at the start of every session: 'Do not remember Go rules right now'." }
    ],
    correct: "A",
    explanation: ".claude/rules/*.md files with glob frontmatter allow path-specific contextual rule loading. Putting language-specific conventions into glob-scoped rule files ensures rules are loaded only when files in matching paths are touched, preventing context contamination."
  },
  {
    id: "cca-f-deficit-012",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Configuration Mechanisms",
    topic: "scoping-hierarchy",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Development Team Workflow Standards. Situation: A team lead needs to enforce: (1) Mandatory Git commit message formatting for all team members, (2) Auto-formatting of Python files before every commit, and (3) Personal terminal keybindings for specific developers. How should these three requirements be assigned across configuration mechanisms?",
    options: [
      { id: "A", text: "Commit conventions in project CLAUDE.md; auto-formatting in a git hook or custom post-tool hook; personal keybindings in each developer's ~/.claude/CLAUDE.md." },
      { id: "B", text: "Put all three requirements into the root project CLAUDE.md and commit to git." },
      { id: "C", text: "Put all three requirements into each developer's personal user configuration file." },
      { id: "D", text: "Store all requirements in an uncommitted README.txt file." }
    ],
    correct: "A",
    explanation: "Shared team standards belong in the repo-level CLAUDE.md. Enforced actions before/after file operations belong in hooks. Individual developer preferences belong in the user-level configuration (~/.claude/CLAUDE.md)."
  },

  // Objective 17 (0%): Systematic codebase exploration
  {
    id: "cca-f-deficit-013",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Codebase Exploration",
    topic: "tool-funnel",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Large Monolith Codebase Investigation. Situation: A developer asks Claude Code to investigate how OAuth token revocation is handled in a 500,000-line repository. In the first turn, Claude executes a recursive Read tool across entire directories, consuming 180,000 tokens of context and triggering compaction before discovering the handler. What systematic exploration strategy prevents this context window exhaustion?",
    options: [
      { id: "A", text: "Use Glob to identify candidate file paths matching auth patterns, use Grep to locate exact token revocation method signatures, and use Read with targeted line offsets on specific segments." },
      { id: "B", text: "Increase the developer's laptop physical memory to 128 GB." },
      { id: "C", text: "Run git log across the entire history and read all commit diffs sequentially." },
      { id: "D", text: "Ask Claude Code to guess the implementation based on standard library conventions." }
    ],
    correct: "A",
    explanation: "Systematic exploration follows a funnel: Glob locates relevant file paths without reading content; Grep finds precise code patterns or symbol references; Read inspects targeted line slices (offset/limit) only where relevant, preserving context window."
  },
  {
    id: "cca-f-deficit-014",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "Codebase Exploration",
    topic: "tool-funnel",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Investigating Shared Database Schema Dependencies. Situation: An engineer needs to locate all references to a deprecated table column across 3,000 files. Which sequence of built-in Claude Code tools accomplishes this with the lowest token consumption?",
    options: [
      { id: "A", text: "Run Grep across the repository for the exact column name, review the matched file paths and line numbers, and Read only the specific calling functions." },
      { id: "B", text: "Run Read on every file in alphabetical order until the column name is found." },
      { id: "C", text: "Execute a bash script that concatenates all 3,000 files into a single text file and inspect it." },
      { id: "D", text: "Use Glob to list all files and paste the list into a new prompt asking Claude to guess." }
    ],
    correct: "A",
    explanation: "Grep performs targeted string and symbol searches across files without loading the entire contents into the conversation context, returning only matching line numbers and snippets for targeted reading."
  },

  // Objective 18 (0%): Subagent output schemas for synthesis
  {
    id: "cca-f-deficit-015",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Subagent Output Schemas",
    topic: "downstream-synthesis",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Competitive Intelligence Research System. Situation: A coordinator agent delegates web research on competitor pricing to 4 subagents. The subagents return unstructured narrative paragraphs with informal links. The coordinator fails to synthesize a clean comparison table and hallucinates attribution. How should the subagent output schema be structured to optimize downstream synthesis?",
    options: [
      { id: "A", text: "Enforce a structured JSON output schema requiring key-value fields for entity_name, extracted_metrics, exact_source_url, extraction_timestamp, and an uncertainty_rating." },
      { id: "B", text: "Ask the subagents to write their answers in bullet points with emoji icons." },
      { id: "C", text: "Increase the coordinator's token limit and instruct it to read between the lines." },
      { id: "D", text: "Have subagents send their raw browser DOM trees directly to the coordinator." }
    ],
    correct: "A",
    explanation: "Subagents designed for downstream synthesis must produce standardized structured outputs containing normalized values, exact source metadata, and confidence/uncertainty indicators so the coordinator can aggregate and cite accurately."
  },
  {
    id: "cca-f-deficit-016",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Subagent Output Schemas",
    topic: "downstream-synthesis",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Legal Contract Due Diligence Pipeline. Situation: Subagents extract liability caps, termination clauses, and indemnity obligations from commercial leases. When the coordinator generates the executive risk report, conflicting provisions are flattened into generic summaries with lost source references. What schema property preserves auditability?",
    options: [
      { id: "A", text: "Require every extracted clause object to contain verbatim_quote, document_id, section_reference, and confidence_score alongside the normalized interpretation." },
      { id: "B", text: "Instruct subagents to output only true or false flags." },
      { id: "C", text: "Concatenate all lease texts into a single prompt for the coordinator." },
      { id: "D", text: "Allow subagents to paraphrase clauses without citing original paragraph numbers." }
    ],
    correct: "A",
    explanation: "Carrying provenance (exact verbatim quote, document ID, and section reference) inside the subagent's structured output schema guarantees that citations and source verifications survive downstream synthesis."
  },

  // Objective 20 (0%): Context management across sessions
  {
    id: "cca-f-deficit-017",
    exam: "cca-f",
    domain: "D5 Context Management & Reliability",
    section: "Multi-Session Persistence",
    topic: "scratchpad-pattern",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Multi-Day Architectural Refactoring. Situation: A developer uses Claude Code to refactor an enterprise authentication module across multiple sessions. In Session 2, Claude Code loses track of which interfaces were modified in Session 1, re-analyzing already completed modules and overwriting working code. What context management strategy sustains coherence across session boundaries?",
    options: [
      { id: "A", text: "Maintain a dedicated scratchpad markdown file (e.g. .refactor_state.md) in the project containing completed tasks, modified files, open items, and design decisions, injected at the start of each session." },
      { id: "B", text: "Keep the terminal window open continuously for several weeks without closing the laptop." },
      { id: "C", text: "Paste the entire terminal scrollback buffer from Session 1 into Session 2." },
      { id: "D", text: "Use Claude Desktop instead of the command-line interface." }
    ],
    correct: "A",
    explanation: "Scratchpad files (.scratchpad.md or state manifests) provide durable, file-based session persistence. They allow a fresh session to load current progress, completed modifications, and active constraints without context window exhaustion."
  },
  {
    id: "cca-f-deficit-018",
    exam: "cca-f",
    domain: "D5 Context Management & Reliability",
    section: "Multi-Session Persistence",
    topic: "scratchpad-pattern",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Multi-Agent Microservice Decomposition. Situation: Four explorer subagents independently analyze dependencies across different modules of a monolith. Their collective observations exceed the coordinator's 200,000 token context limit. How should their findings be managed to enable coherent architectural synthesis?",
    options: [
      { id: "A", text: "Have each subagent write its findings into a structured scratchpad file in a temporary directory, and have the coordinator read only the distilled summaries and cross-module dependency tables." },
      { id: "B", text: "Feed all four subagent transcripts into the coordinator in a single massive prompt." },
      { id: "C", text: "Drop all dependency details and guess the service boundaries." },
      { id: "D", text: "Execute the explorer subagents in an infinite loop." }
    ],
    correct: "A",
    explanation: "External scratchpad files act as an intermediate storage buffer. Explorer subagents dump detailed findings to disk, and the coordinator ingests only high-level distilled summaries, respecting context limits."
  },

  // Objective 24 (0%): Specialized review passes
  {
    id: "cca-f-deficit-019",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Review Passes",
    topic: "separation-of-concerns",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Pull Request Review Automation. Situation: A security-conscious engineering team deploys a single-pass Claude Code review action in CI. The prompt instructs Claude to simultaneously evaluate SQL injection, business logic invariants, CSS consistency, and TypeScript typing. Audit metrics show that while formatting issues are caught 98% of the time, subtle IDOR vulnerabilities are missed. What architectural change fixes this recall disparity?",
    options: [
      { id: "A", text: "Decompose the review into specialized passes: execute a dedicated Security Pass focusing solely on authorization and injection with focused few-shot examples, followed by separate Passes for Logic and Style, then merge findings." },
      { id: "B", text: "Add 'PRIORITIZE SECURITY ABOVE ALL' in bold capital letters to the single prompt." },
      { id: "C", text: "Raise the temperature to 0.8 to make Claude more suspicious of code." },
      { id: "D", text: "Run the single combined prompt three times and accept only findings that appear in all three." }
    ],
    correct: "A",
    explanation: "Single prompts with competing concerns suffer from attention dilution, where the model prioritizes frequent, surface-level patterns (style, formatting) over complex vulnerabilities. Running dedicated specialized passes ensures comprehensive recall."
  },
  {
    id: "cca-f-deficit-020",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Review Passes",
    topic: "separation-of-concerns",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Healthcare HIPAA Compliance Review Pipeline. Situation: An automated reviewer evaluates doctor-patient intake software code. When data encryption, patient privacy, and code runtime performance are audited in a single prompt, privacy leakages are frequently overlooked. How should the review prompt architecture be structured?",
    options: [
      { id: "A", text: "Separate privacy and encryption compliance into an isolated pass with dedicated healthcare compliance few-shot examples, decoupled from performance optimization reviews." },
      { id: "B", text: "Ask developers to self-certify compliance in the PR description." },
      { id: "C", text: "Increase max_tokens to 100,000 on the combined prompt." },
      { id: "D", text: "Remove few-shot examples to allow more room for general instructions." }
    ],
    correct: "A",
    explanation: "Specialized review passes decouple competing concerns. Giving critical compliance checks their own focused prompt and dedicated few-shot examples guarantees undivided attention and maximum recall."
  },

  // Objective 28 (0%): Structured output truncation resolution
  {
    id: "cca-f-deficit-021",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Output Truncation",
    topic: "batch-splitting",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Enterprise Software Dependency Vulnerability Auditor. Situation: A compliance pipeline audits 150 package dependencies in a single API call, requiring a detailed JSON vulnerability assessment for each. The response consistently truncates mid-sentence with stop_reason: 'max_tokens', rendering the JSON invalid and halting CI. What is the correct architectural resolution?",
    options: [
      { id: "A", text: "Partition the 150 dependencies into smaller batches of 15-20, execute separate extraction calls with individual schema validation, and merge the resulting arrays downstream." },
      { id: "B", text: "Increase max_tokens to 128,000 and enable streaming." },
      { id: "C", text: "Instruct the model to remove all indentation, whitespace, and descriptive fields from the JSON." },
      { id: "D", text: "Switch to plain unformatted text output and parse with regular expressions." }
    ],
    correct: "A",
    explanation: "When structured outputs exceed token generation limits, increasing max_tokens is a brittle anti-pattern. The robust architecture partitions the input workload into bounded chunks, executes scoped API calls, and programmatically merges the validated JSON structures."
  },
  {
    id: "cca-f-deficit-022",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Output Truncation",
    topic: "batch-splitting",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Codebase API Documentation Generator. Situation: An agent generates OpenAPI specification schemas for 60 microservices in a single prompt. The output consistently truncates halfway through service 28 due to token generation limits. How should the pipeline be refactored?",
    options: [
      { id: "A", text: "Iterate across the microservices individually or in small clusters, generating and validating the OpenAPI specification for each service independently before concatenating them." },
      { id: "B", text: "Instruct Claude to use single-letter parameter names to conserve tokens." },
      { id: "C", text: "Lower the temperature to 0.0." },
      { id: "D", text: "Delete half of the microservices from the documentation scope." }
    ],
    correct: "A",
    explanation: "Splitting large structured generation tasks into discrete, individually scoped API calls guarantees that each document completes within token limits, enabling granular retry and modular error recovery."
  },

  // Objective 33 (0%): Tool distribution in multi-agent systems
  {
    id: "cca-f-deficit-023",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Tool Distribution",
    topic: "least-privilege",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Autonomous Site Reliability Engineering Agent. Situation: An SRE coordinator manages an incident response team consisting of a LogAnalyzer agent, a MetricsMonitor agent, and a TrafficRouter agent. All three agents are initialized with the same complete tool catalog, including restart_pod and alter_routing_table. During a minor log check, the LogAnalyzer accidentally terminated a production pod. How should tool distribution be re-architected?",
    options: [
      { id: "A", text: "Assign each subagent only the specific tools necessary for its defined role (LogAnalyzer gets only read_logs and query_elasticsearch), restricting destructive infrastructure tools exclusively to TrafficRouter." },
      { id: "B", text: "Add a prompt warning to the LogAnalyzer: 'Do not restart pods unless you are sure'." },
      { id: "C", text: "Combine all three subagents into one large agent to simplify management." },
      { id: "D", text: "Require the LogAnalyzer to output an apology if it restarts a pod." }
    ],
    correct: "A",
    explanation: "Tool distribution in multi-agent systems must enforce the principle of least privilege. Granting subagents only the tools required for their specific role eliminates out-of-role tool invocations and reduces tool selection entropy."
  },
  {
    id: "cca-f-deficit-024",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Tool Distribution",
    topic: "least-privilege",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: E-Commerce Customer Service Routing. Situation: A triage agent, a billing inquiry agent, and an inventory checker agent handle customer inquiries. The inventory checker agent repeatedly calls the process_credit_card_refund tool when checking out-of-stock items. What architectural change prevents this behavior?",
    options: [
      { id: "A", text: "Omit financial and refund tools from the inventory checker's tool definition list, providing it only with search_catalog and get_stock_level tools." },
      { id: "B", text: "Instruct the inventory checker to check stock three times before refunding." },
      { id: "C", text: "Set temperature to 1.0 on the inventory checker." },
      { id: "D", text: "Rename the refund tool to something hard to pronounce." }
    ],
    correct: "A",
    explanation: "Restricting the tool catalog exposed to each subagent ensures that out-of-role tools are completely unavailable in the agent's schema, eliminating any possibility of unauthorized invocation."
  },

  // Objective 37 (0%): tool_choice parameter & multi-tool workflow sequencing
  {
    id: "cca-f-deficit-025",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Tool Choice & Sequencing",
    topic: "dependent-workflows",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Automated Cloud VPC Provisioner. Situation: An infrastructure agent provisions networks using create_vpc, create_subnet, and launch_instance. In multi-turn conversations, the agent frequently attempts to call launch_instance simultaneously with create_vpc, failing because the required vpc_id and subnet_id have not yet been allocated by AWS. How should the workflow be architected?",
    options: [
      { id: "A", text: "Sequence the workflow across turns so that dependent tools are only exposed in the tools parameter after prerequisite data (vpc_id, subnet_id) has been returned in state." },
      { id: "B", text: "Expose all tools on turn 1 and set tool_choice to 'any'." },
      { id: "C", text: "Ask the user to manually type in the vpc_id before running the agent." },
      { id: "D", text: "Prompt Claude: 'Please wait 60 seconds before calling launch_instance'." }
    ],
    correct: "A",
    explanation: "Multi-tool workflows with strict data dependencies must be sequenced across turns. By withholding dependent tools until prerequisite resources are created and returned in prior tool results, out-of-order execution is rendered impossible."
  },
  {
    id: "cca-f-deficit-026",
    exam: "cca-f",
    domain: "D2 Tool Design & MCP Integration",
    section: "Tool Choice & Sequencing",
    topic: "dependent-workflows",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Structured Invoice Extraction Pipeline. Situation: A document processing pipeline must extract financial data and guarantees structured output. In 15% of cases, Claude outputs conversational acknowledgments ('Here is your invoice summary:') without invoking the required save_extracted_invoice tool, causing downstream parse failures. How should tool_choice be configured?",
    options: [
      { id: "A", text: "Configure tool_choice: { type: 'tool', name: 'save_extracted_invoice' } to enforce deterministic tool invocation and prevent conversational output." },
      { id: "B", text: "Set tool_choice: 'auto' and write 'PLEASE USE THE TOOL' in the prompt." },
      { id: "C", text: "Remove the tool and parse markdown using regular expressions." },
      { id: "D", text: "Set temperature to 0.9." }
    ],
    correct: "A",
    explanation: "Setting tool_choice to a specific tool definition forces the model to emit a tool call for that specific tool, completely eliminating conversational text and guaranteeing structured schema compliance."
  },

  // Objective 22 (33%): Human review routing based on confidence & ambiguity
  {
    id: "cca-f-deficit-027",
    exam: "cca-f",
    domain: "D5 Context Management & Reliability",
    section: "Human Review Routing",
    topic: "confidence-calibration",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Mortgage Application Document Extraction. Situation: An extraction system auto-approves loan documents with confidence scores >= 0.92. A lender uploads documents in an unfamiliar hybrid two-column layout. The system continues reporting 0.94 confidence despite making frequent omission errors on the unfamiliar format. What is the appropriate human review routing safeguard?",
    options: [
      { id: "A", text: "Detect document layout shift and route extractions from novel structural formats to human review using stratified sampling, regardless of the model's reported confidence score." },
      { id: "B", text: "Lower the auto-approval threshold to 0.80 to accept more documents." },
      { id: "C", text: "Trust the 0.94 confidence score because LLM scores are calibrated across all formats." },
      { id: "D", text: "Re-run the same extraction three times with temperature 0.8." }
    ],
    correct: "A",
    explanation: "Confidence calibration collapses when data distribution shifts (e.g. encountering novel document layouts). Model confidence remains deceptively high while accuracy drops. Routing based on document characteristics and layout novelty protects pipeline integrity."
  },
  {
    id: "cca-f-deficit-028",
    exam: "cca-f",
    domain: "D5 Context Management & Reliability",
    section: "Human Review Routing",
    topic: "confidence-calibration",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Medical Records Entity Extraction. Situation: A healthcare pipeline extracts patient medication dosages. A hospital submits handwritten notes where dosage amounts are faint or smudged. The pipeline randomly routes 5% of all documents to human doctors. What routing strategy improves safety and efficiency?",
    options: [
      { id: "A", text: "Route documents to human review based on field-level ambiguity, OCR confidence metrics, and detected document degradation rather than uniform random sampling." },
      { id: "B", text: "Increase random sampling to 100% of all documents." },
      { id: "C", text: "Instruct the model to guess the most common dosage if handwriting is unreadable." },
      { id: "D", text: "Omit all dosage fields that are difficult to read." }
    ],
    correct: "A",
    explanation: "Targeted human-in-the-loop review routes cases based on risk indicators: field-level ambiguity, low OCR scores, and image degradation. This catches errors where failure risk is highest rather than wasting reviewer time on uniform random sampling."
  },

  // Objective 26 (33%): Extraction schemas with optional/nullable/enums
  {
    id: "cca-f-deficit-029",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Extraction Schemas",
    topic: "nullable-enums",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Real Estate Lease Extraction. Situation: An extraction schema requires commercial lease fields including lease_start_date, rent_amount, and renewal_notice_period_days. In 30% of standard leases, no renewal notice period is stated. The model frequently hallucinates '30' or '60' days. How should the schema be defined to stop fabrication?",
    options: [
      { id: "A", text: "Define renewal_notice_period_days as nullable: true (or optional) in the JSON schema, with instructions allowing null when no period is specified in the text." },
      { id: "B", text: "Make renewal_notice_period_days required and add 'DO NOT GUESS' in the prompt." },
      { id: "C", text: "Set a default value of 0 for all leases." },
      { id: "D", text: "Retry extraction up to 5 times until the model finds a number." }
    ],
    correct: "A",
    explanation: "Marking missing fields as required forces the model to invent values to pass schema validation. Defining optional and nullable fields allows the model to faithfully output null when the information is legitimately absent."
  },
  {
    id: "cca-f-deficit-030",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Extraction Schemas",
    topic: "nullable-enums",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Insurance Claim Damage Categorization. Situation: A property claim schema has an enum damage_type: ['FIRE', 'FLOOD', 'THEFT', 'WIND']. A customer files a claim for 'EARTHQUAKE'. Because 'EARTHQUAKE' is not in the enum, the extraction fails validation or forces Claude to pick 'WIND'. How should the enum schema be designed?",
    options: [
      { id: "A", text: "Include an 'OTHER' option in the enum paired with a conditional nullable string field other_damage_description to capture unlisted categories." },
      { id: "B", text: "Instruct the customer to only experience damages listed in the enum." },
      { id: "C", text: "Remove the enum and allow completely unconstrained free-form strings." },
      { id: "D", text: "Automatically categorize all unlisted damages as 'THEFT'." }
    ],
    correct: "A",
    explanation: "Closed enums cause classification failures when encountering real-world edge cases. Adding an 'OTHER' option alongside a free-text detail field preserves structured categorization while accommodating novel inputs without fabrication."
  },

  // Objective 4 (50%): Subagent delegation strategies: goal-oriented vs. procedural
  {
    id: "cca-f-deficit-031",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Delegation Strategies",
    topic: "goal-vs-procedural",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Cross-System Technical Research Agent. Situation: A coordinator agent delegates an investigation to a subagent exploring an unfamiliar third-party REST API with incomplete documentation. When given rigid step-by-step procedural instructions ('Call /users, then call /roles'), the subagent halts when /users returns a 404. How should the delegation prompt be framed?",
    options: [
      { id: "A", text: "Provide goal-oriented instructions defining the target objective, discovery constraints, and required output schema, empowering the subagent to adapt its API exploration path." },
      { id: "B", text: "Provide an even longer list of hardcoded procedural steps covering 100 possible endpoints." },
      { id: "C", text: "Terminate the subagent immediately whenever any HTTP 404 is encountered." },
      { id: "D", text: "Switch from Claude to a static shell script." }
    ],
    correct: "A",
    explanation: "Procedural instructions are brittle in exploratory environments. Goal-oriented delegation establishes the desired outcome, boundaries, and validation criteria, allowing the subagent to autonomously navigate alternative paths when obstacles arise."
  },
  {
    id: "cca-f-deficit-032",
    exam: "cca-f",
    domain: "D1 Agentic Architecture & Orchestration",
    section: "Delegation Strategies",
    topic: "goal-vs-procedural",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Codebase Bug Localization. Situation: A coordinator dispatches a subagent to locate a memory leak. If the coordinator provides rigid procedural instructions ('Check file A, then file B'), the subagent misses the leak located in file C. What delegation approach succeeds?",
    options: [
      { id: "A", text: "Frame the task around the diagnostic goal (identify unclosed database connections across all repository modules), providing search tools and completion criteria." },
      { id: "B", text: "Manually review the entire codebase before delegating to the subagent." },
      { id: "C", text: "Instruct the subagent to guess which file has the bug without searching." },
      { id: "D", text: "Set max_tokens to 500." }
    ],
    correct: "A",
    explanation: "Goal-oriented instructions empower the subagent to leverage exploration tools dynamically, following code references and import graphs to locate issues rather than being restricted to an arbitrary file checklist."
  },

  // Objective 11 (50%): Claude Code CLI automated CI/CD invocations
  {
    id: "cca-f-deficit-033",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "CI/CD Invocations",
    topic: "non-interactive-flags",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Nightly Automated Test Maintenance Pipeline. Situation: A CI/CD pipeline runs Claude Code headlessly to generate regression tests for newly merged code. On two occasions, the pipeline hung indefinitely waiting for terminal input, and on another occasion, it entered a runaway loop costing $400 in API credits. What CLI invocation flags prevent these failures?",
    options: [
      { id: "A", text: "Invoke with non-interactive flags (e.g. -p/--print), set a hard cost ceiling (--cost-limit), and cap the maximum iterations (--max-turns) with timeout guards." },
      { id: "B", text: "Run Claude Code inside an interactive screen session and check it every morning." },
      { id: "C", text: "Remove Claude Code from CI and require developers to write tests manually." },
      { id: "D", text: "Increase API rate limits to allow unlimited executions." }
    ],
    correct: "A",
    explanation: "Headless CI invocations must use non-interactive mode (-p) to prevent blocking on user stdin, combined with cost ceilings (--cost-limit), iteration bounds (--max-turns), and CI timeouts to stop runaway execution loops."
  },
  {
    id: "cca-f-deficit-034",
    exam: "cca-f",
    domain: "D3 Claude Code Configuration & Workflows",
    section: "CI/CD Invocations",
    topic: "non-interactive-flags",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Pull Request Automated Documentation Checker. Situation: A GitHub Actions workflow runs Claude Code to review documentation diffs. The job frequently fails because Claude Code prompts for interactive permission confirmations before reading files. How should permissions be configured?",
    options: [
      { id: "A", text: "Configure pre-authorized read-only permission modes or flags in the non-interactive CLI invocation to allow necessary file inspections without interactive prompts." },
      { id: "B", text: "Grant full root access and disable all operating system security controls." },
      { id: "C", text: "Have a team member sit at the server to press 'Y' when prompted." },
      { id: "D", text: "Switch from GitHub Actions to manual terminal runs." }
    ],
    correct: "A",
    explanation: "Automated pipelines cannot respond to interactive permission prompts. Specifying non-interactive permission modes for designated operations allows headless execution while maintaining security boundaries."
  },

  // Objective 31 (50%): Prompt criteria with explicit inclusion/exclusion boundaries
  {
    id: "cca-f-deficit-035",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Prompt Criteria",
    topic: "inclusion-exclusion-boundaries",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Automated Security Vulnerability Reviewer. Situation: A PR review bot produces 80 comments per pull request, 90% of which are subjective opinions about variable names and personal formatting preferences. Developers find it noisy and are ignoring valid security alerts. How should the review prompt criteria be designed?",
    options: [
      { id: "A", text: "Define explicit inclusion criteria (OWASP Top 10, unhandled exceptions) and strict exclusion boundaries (variable naming, formatting, styling choices) with concrete examples." },
      { id: "B", text: "Add 'Be concise' to the system prompt." },
      { id: "C", text: "Filter comments randomly to only show 10% of generated findings." },
      { id: "D", text: "Disable the review bot entirely." }
    ],
    correct: "A",
    explanation: "High false-positive rates are eliminated by establishing explicit inclusion criteria (what to report) and exclusion boundaries (what to ignore), supported by concrete examples. Vague adjectives like 'be concise' are ineffective."
  },
  {
    id: "cca-f-deficit-036",
    exam: "cca-f",
    domain: "D4 Prompt Engineering & Structured Output",
    section: "Prompt Criteria",
    topic: "inclusion-exclusion-boundaries",
    difficulty: "advanced",
    status: "ready",
    prompt: "Scenario: Earnings Call Financial Extraction. Situation: A financial extraction prompt instructs Claude to extract 'material company announcements'. The model frequently extracts vague executive pleasantries and aspirational quotes alongside audited figures. How do you eliminate subjective noise?",
    options: [
      { id: "A", text: "Define strict inclusion criteria (GAAP revenue figures, dividend declarations, formal guidance ranges) and explicit exclusion criteria (aspirational commentary, generic optimism)." },
      { id: "B", text: "Instruct Claude to only extract statements that sound important." },
      { id: "C", text: "Set temperature to 0.0 without changing prompt criteria." },
      { id: "D", text: "Delete the executive quote section of the transcript before extraction." }
    ],
    correct: "A",
    explanation: "Explicit inclusion and exclusion boundaries define the precise operational scope. Setting clear definitions of what qualifies as an extraction target prevents the model from generating noisy, speculative findings."
  }
];

// Write or merge into data/questions/cca-f/questions.json
const rootDir = process.cwd();
const qFilePath = path.join(rootDir, 'data/questions/cca-f/questions.json');
const staticQFilePath = path.join(rootDir, 'static/data/questions/cca-f/questions.json');

const existing = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));

// Filter out any previous deficit questions if re-running
const filtered = existing.filter(q => !q.id.startsWith('cca-f-deficit-'));

const enrichedQuestions = questions.map(q => ({
  id: q.id,
  exam: "cca-f",
  status: "ready",
  reviewStatus: "approved",
  sourceId: "cca-f-exam-score-target",
  contentVersion: 1,
  mockEligible: true,
  domain: q.domain,
  difficulty: q.difficulty || "advanced",
  section: q.section,
  topic: q.topic,
  prompt: q.prompt,
  options: q.options,
  correct: q.correct,
  explanation: q.explanation
}));

const merged = [...filtered, ...enrichedQuestions];

fs.writeFileSync(qFilePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
fs.writeFileSync(staticQFilePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');

console.log(`[generate-deficit-questions] Added ${questions.length} targeted questions.`);
console.log(`[generate-deficit-questions] Total questions now: ${merged.length}`);
