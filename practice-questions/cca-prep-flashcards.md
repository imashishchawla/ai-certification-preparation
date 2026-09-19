# CCA-Prep Flashcards (45 cards)

Source: github.com/vinipx/cca-prep · src/data/flashcards.ts


## Card 1 · D1 Agentic Architecture & Orchestration

**Q:** What are the two key stop_reason values in an agentic loop and what does each mean?

**A:** "tool_use" → Claude wants to call a tool; loop must execute tools and continue.
"end_turn" → Claude finished; loop terminates.

Never use text content to decide termination — always use stop_reason.

## Card 2 · D1 Agentic Architecture & Orchestration

**Q:** What is the Task tool and what must be in allowedTools to use it?

**A:** Task is the Agent SDK mechanism for spawning subagents.

"Task" MUST be included in the coordinator's allowedTools — otherwise the coordinator cannot invoke subagents.

## Card 3 · D1 Agentic Architecture & Orchestration

**Q:** Do subagents inherit context from the coordinator automatically?

**A:** NO. Subagents are fully isolated.

Context must be explicitly included in the subagent's prompt by the coordinator. This includes prior findings, source URLs, metadata, and any shared state.

## Card 4 · D1 Agentic Architecture & Orchestration

**Q:** How do you spawn subagents in parallel with the Task tool?

**A:** Emit multiple Task tool calls in a SINGLE coordinator response (single turn).

Multiple Task calls across separate turns = sequential execution.
Multiple Task calls in one turn = parallel execution.

## Card 5 · D1 Agentic Architecture & Orchestration

**Q:** When should you use programmatic hooks vs. prompt instructions for workflow enforcement?

**A:** Hooks → deterministic, guaranteed compliance (financial gates, identity verification, policy rules).

Prompt instructions → probabilistic guidance, non-zero failure rate.

Rule: if the failure rate must be zero, use hooks.

## Card 6 · D1 Agentic Architecture & Orchestration

**Q:** What is fork_session vs --resume?

**A:** --resume <name> → continues a named prior session (use when prior context is still valid).

fork_session → creates independent branches from a shared baseline (use to explore divergent approaches in parallel).

## Card 7 · D2 Tool Design & MCP Integration

**Q:** What is the primary mechanism Claude uses for tool selection?

**A:** Tool descriptions.

Claude reads each tool's description to decide which tool to invoke. Weak, minimal, or overlapping descriptions are the #1 cause of misrouting in production.

## Card 8 · D2 Tool Design & MCP Integration

**Q:** What are the four MCP error categories and what does isRetryable indicate?

**A:** errorCategory values:
• transient — timeout, service unavailable (isRetryable: true)
• validation — bad input format (isRetryable: false)
• business — policy violation (isRetryable: false)
• permission — access denied (isRetryable: false)

isRetryable: true → agent may retry with same params.

## Card 9 · D2 Tool Design & MCP Integration

**Q:** What is the difference between isError: false + empty array vs isError: true?

**A:** isError: false + [] → successful query, no records found. Do NOT retry.

isError: true → execution failed. Agent should read errorCategory and decide whether to retry or escalate.

Treating these identically causes agents to retry successful queries.

## Card 10 · D2 Tool Design & MCP Integration

**Q:** What are the three tool_choice configuration options?

**A:** "auto" → Claude decides whether to use a tool.
"any" → Claude must use at least one tool.
{"type": "tool", "name": "tool_name"} → Claude must call this specific tool.

There is no "required" or "none" option.

## Card 11 · D3 Claude Code Configuration & Workflows

**Q:** What is the CLAUDE.md hierarchy and which takes precedence?

**A:** Subdirectory CLAUDE.md (closest to file)
  > Project root CLAUDE.md
  > Global user CLAUDE.md (~/.claude/CLAUDE.md)

More specific always wins. Subdirectory rules override project root rules.

## Card 12 · D3 Claude Code Configuration & Workflows

**Q:** When should you use plan mode in Claude Code?

**A:** Before irreversible or high-impact operations:
• Large-scale refactors
• Database migrations
• CI/CD deployments
• Multi-file changes

Plan mode shows Claude's intended actions BEFORE execution. You approve, modify, or cancel.

## Card 13 · D3 Claude Code Configuration & Workflows

**Q:** What is the difference between CLAUDE.md and Agent Skills (SKILL.md)?

**A:** CLAUDE.md → always-loaded persistent context: project conventions, architecture rules, naming standards, build commands.

SKILL.md → on-demand specialized knowledge: loaded when the task matches the skill's triggers. Good for deep domain expertise (accessibility, security, API patterns).

## Card 14 · D3 Claude Code Configuration & Workflows

**Q:** What does permissionMode: "acceptEdits" do and when is it appropriate?

**A:** acceptEdits → auto-approves all file read/write operations without prompting.

Appropriate for: CI/CD pipelines, automated batch workflows.
Not appropriate for: interactive development where human review per edit is desired.

## Card 15 · D4 Prompt Engineering & Structured Output

**Q:** What is a validation retry loop and what makes the error feedback effective?

**A:** Pattern:
1. Request structured output
2. Validate against schema
3. On failure: send specific error back to Claude
4. Claude regenerates with that feedback
5. Repeat until valid or max retries

Effective feedback: exact field name + expected format + actual wrong value.

## Card 16 · D4 Prompt Engineering & Structured Output

**Q:** When should you use the Message Batches API vs synchronous API?

**A:** Batches API:
• ~50% cost savings
• 24-hour window, no SLA
• Use for: overnight processing, bulk classification, non-interactive jobs

Synchronous API:
• Real-time, sub-second
• Use for: live user queries, blocking workflows, anything with a hard latency requirement

## Card 17 · D4 Prompt Engineering & Structured Output

**Q:** What does strict: true on a tool definition guarantee?

**A:** strict: true enables Structured Outputs mode for tool calls.

Guarantees: Claude's tool inputs ALWAYS match the defined JSON schema — no missing required fields, no type mismatches.

This is a pre-call guarantee enforced at the API level.

## Card 18 · D5 Context Management & Reliability

**Q:** What is attention dilution and how do you fix it?

**A:** Attention dilution: content in the MIDDLE of very long contexts receives less reliable model attention ("lost in the middle").

Fix: per-section passes (each section gets full context window focus) + separate integration pass over summaries.

Larger context window does NOT fix this — it just moves the diluted zone.

## Card 19 · D5 Context Management & Reliability

**Q:** Why is self-reported LLM confidence unreliable for escalation routing?

**A:** LLMs are poorly calibrated — they are often MOST confident on the cases they get WRONG.

Use programmatic escalation signals instead:
• Missing required data fields
• Policy threshold violations (amount > $500)
• Tool error count > N
• Specific issue category flags

## Card 20 · D5 Context Management & Reliability

**Q:** What is information provenance and why does it matter in multi-agent pipelines?

**A:** Provenance = ability to trace any claim in synthesized output back to its original source (URL, doc title, page number).

Requires: coordinator passes structured context with source metadata; synthesis schema includes citations array.

Enables: fact-checking, transparency, source invalidation.

## Card 21 · D1 Agentic Architecture & Orchestration

**Q:** What must allowedTools include for a coordinator agent to spawn subagents?

**A:** "Task" must be explicitly listed in the coordinator's allowedTools configuration.

Without "Task" in allowedTools, the coordinator cannot emit Task tool calls — they are silently ignored.

Common misconfiguration: developers configure subagent AgentDefinitions carefully but forget to add "Task" to the coordinator's own allowed tools.

## Card 22 · D1 Agentic Architecture & Orchestration

**Q:** How do you run subagents in parallel instead of sequentially?

**A:** Emit multiple Task tool calls in a SINGLE coordinator response.

Single response → multiple Task calls = parallel execution.
Separate turns → one Task call each = sequential execution.

Latency: parallel = max(subtask times) vs sequential = sum(subtask times).

Independent subagents (no data dependencies between them) should always be parallelized.

## Card 23 · D1 Agentic Architecture & Orchestration

**Q:** fork_session vs --resume: when do you use each?

**A:** fork_session — creates two INDEPENDENT branches from a shared session baseline.
Use when: exploring two divergent approaches from the same analysis starting point.

--resume — CONTINUES a single existing named session.
Use when: prior context is still valid and you want to pick up where you left off.

Key difference: fork = branch into two paths; resume = continue one path.

## Card 24 · D3 Claude Code Configuration & Workflows

**Q:** What is the interview pattern in iterative refinement?

**A:** Have Claude ask clarifying questions BEFORE implementing, to surface design decisions you may not have anticipated.

Best for: unfamiliar domains with significant tradeoffs (caching, failure modes, security).

Example questions surfaced: "Fail open or closed? TTL only or write-invalidate? Per-user or shared keys?"

Prevents costly rework by resolving underspecified decisions upfront — before a line of code is written.

## Card 25 · D2 Tool Design & MCP Integration

**Q:** What is the difference between project-scoped and user-scoped MCP servers?

**A:** Project-scoped (.mcp.json in project root):
• Committed to version control
• Available to ALL team members automatically
• Use for: shared tooling (GitHub, Jira, internal databases)

User-scoped (~/.claude.json):
• Personal, never version-controlled
• Use for: personal or experimental servers

Both are available simultaneously.

## Card 26 · D2 Tool Design & MCP Integration

**Q:** When should you use Grep vs Glob vs Read for codebase exploration?

**A:** Grep — search FILE CONTENTS for patterns
• Find all callers of getUserById
• Find all imports of lodash

Glob — find FILES by name/extension pattern
• Find all *.test.tsx files
• Find all files in src/api/**

Read — load FULL FILE CONTENTS after finding the file

Typical flow: Grep to find entry points → Read to follow imports → build understanding incrementally.

## Card 27 · D3 Claude Code Configuration & Workflows

**Q:** What does context: fork do in a SKILL.md frontmatter?

**A:** Runs the skill in an ISOLATED sub-agent context.

All intermediate output (tool calls, verbose reasoning) stays inside the isolated context.
Only the FINAL RESPONSE returns to the main conversation.

Use for: exploration or analysis skills that produce a lot of intermediate output, preventing them from polluting the main conversation.

## Card 28 · D3 Claude Code Configuration & Workflows

**Q:** Why do settings in ~/.claude/CLAUDE.md not help teammates?

**A:** User-level configuration (~/.claude/CLAUDE.md) is PERSONAL.
It exists only on your machine and is never committed to version control.

Teammates cloning the repo get no user-level config.

For team-wide standards: use PROJECT-level CLAUDE.md (root or .claude/CLAUDE.md) — this IS committed to version control.

Rule: personal preferences → user-level; team standards → project-level.

## Card 29 · D3 Claude Code Configuration & Workflows

**Q:** What does argument-hint do in SKILL.md frontmatter?

**A:** Prompts developers for required parameters when they invoke a skill WITHOUT providing arguments.

Example frontmatter:
  argument-hint: "target-version (e.g., v2.0.0)"

When a developer runs /migrate without an argument, Claude Code displays this hint and requests the argument before proceeding.

Prevents silent invocation with empty required inputs.

## Card 30 · D4 Prompt Engineering & Structured Output

**Q:** What is the difference between tool_choice: "auto", "any", and forced selection?

**A:** "auto" — Claude MAY call a tool OR return text. No guarantee of tool use.

"any" — Claude MUST call at least one tool (its choice).
Use when: multiple valid schemas exist and you need guaranteed structured output.

Forced: {"type": "tool", "name": "X"} — Claude MUST call this SPECIFIC tool.
Use when: a specific tool must run first (e.g., extract_metadata before enrichment).

auto = maybe; any = definitely some tool; forced = definitely this tool.

## Card 31 · D4 Prompt Engineering & Structured Output

**Q:** When does a validation-retry loop fail to help?

**A:** Retries WORK for:
✓ Format mismatches (wrong date format, wrong nesting)
✓ Structural errors (wrong field placement)
✓ Data that IS in the document but was extracted incorrectly

Retries DO NOT HELP when:
✗ Required information is ABSENT from the source document
✗ The document references an external file not provided

If contracts consistently fail on every retry → information is missing from the source, not fixable by re-prompting.

## Card 32 · D4 Prompt Engineering & Structured Output

**Q:** Why are independent review instances more effective than self-review?

**A:** Self-review in the same session retains REASONING CONTEXT from code generation.
The model is less likely to question its own decisions — it "knows why" it made each choice.

An INDEPENDENT instance (fresh session, no generation context) reviews with fresh eyes.

Practical rule: generate in session A, review in fresh session B.

Equivalent to: having code reviewed by someone who didn't write it.

## Card 33 · D5 Context Management & Reliability

**Q:** What is the "lost in the middle" effect and how do you mitigate it?

**A:** Models reliably process content at the BEGINNING and END of long inputs, but miss MIDDLE sections.

Symptom: synthesis omits findings from middle sections, reliably includes beginning/end.

Mitigation:
1. Place key summaries at the BEGINNING of aggregated inputs
2. Per-section passes (each section gets its own focused context window)
3. Separate integration pass over all section summaries

Larger context window does NOT fix this — it just moves the diluted zone.

## Card 34 · D5 Context Management & Reliability

**Q:** What are the three canonical escalation triggers for a support agent?

**A:** 1. EXPLICIT customer request for a human → escalate IMMEDIATELY, no investigation first

2. POLICY GAP — policy is silent or ambiguous on the case → human must decide

3. INABILITY TO PROGRESS — agent cannot make meaningful progress

NOT valid triggers:
✗ Customer sentiment / frustration level
✗ Agent self-reported confidence score
✗ General case "complexity"

## Card 35 · D5 Context Management & Reliability

**Q:** What is a structured claim-source mapping and why is it required in multi-agent synthesis?

**A:** Links each extracted finding to its original source:
{ claim: "34% adoption rate", source_url: "...", document: "McKinsey 2024", excerpt: "..." }

Why required:
• Summarization strips attribution — "34%" becomes an unsourced fact
• Source conflicts must preserve BOTH values with attribution
• Downstream agents need to know WHERE each claim came from

Without it: synthesis output is unverifiable; conflicts get silently resolved.

## Card 36 · D1 Agentic Architecture & Orchestration

**Q:** What is the crash recovery manifest pattern for multi-phase coordinator agents?

**A:** At the end of each phase, the coordinator writes a structured manifest to a known file location:
• Phase number completed
• Outputs produced by that phase
• Inputs required for the next phase

On startup, the coordinator reads the manifest to resume from the last completed phase.

Why not --resume? It reloads conversation history, not computed subagent outputs.
Why not fork_session? It branches conversation state, not phase results.

## Card 37 · D2 Tool Design & MCP Integration

**Q:** What is the difference between an MCP Resource and an MCP Tool?

**A:** MCP RESOURCE — a content catalog entry.
Exposes WHAT data exists so the agent can choose what to request.
Example: list of available issue summaries, documentation pages, DB schema.
No parameters, no side effects — pure discovery.

MCP TOOL — an operation.
Takes parameters, executes logic, returns results.
Example: fetch_issue(id), create_ticket(title, body).

Browse Resources FIRST → avoid blind exploratory Tool calls.

## Card 38 · D3 Claude Code Configuration & Workflows

**Q:** How do you verify which CLAUDE.md files are loaded in the current Claude Code session?

**A:** Run `/memory` — it lists all memory files currently loaded, including which CLAUDE.md files are active and from which directories.

Use this FIRST when Claude Code is not applying expected rules.

Common causes for missing CLAUDE.md:
• File is in the wrong directory
• Session started from a different working directory
• Typo in the filename (must be exactly CLAUDE.md)

## Card 39 · D3 Claude Code Configuration & Workflows

**Q:** What is test-driven iteration and why does it converge faster than prose descriptions?

**A:** Write the test suite FIRST (expected behavior, edge cases, boundaries).
Then iterate by sharing the ACTUAL test failure output — not a prose description of what went wrong.

Why faster:
• Test failure output is machine-precise: exact assertion, expected vs. actual, stack trace
• Prose descriptions are ambiguous — Claude may misinterpret what "wrong" means
• Each iteration targets a specific failing assertion, not a vague "still broken"

Pattern: write tests → run → share failures → fix → repeat.

## Card 40 · D4 Prompt Engineering & Structured Output

**Q:** Why should optional fields in extraction schemas be nullable rather than required?

**A:** Required fields FORCE the model to fabricate a value when the source document does not contain the information.

Nullable optional fields allow an explicit null return:
{ "invoice_date": null }  ← field absent in source

vs.
{ "invoice_date": "2024-01-01" }  ← fabricated to satisfy required

Rule: make a field required only if the source document ALWAYS contains it.
Make it nullable if the document MAY omit it.

## Card 41 · D4 Prompt Engineering & Structured Output

**Q:** What distinguishes a valid use of per-field confidence scores from the escalation anti-pattern?

**A:** ANTI-PATTERN (Domain 5): using raw, uncalibrated self-reported confidence as a blanket escalation trigger. Models are overconfident on wrong answers — high confidence ≠ correct.

VALID USE (Domain 4): per-field confidence in extraction pipelines, CALIBRATED against a labeled validation set.

Calibration process:
1. Label 500+ extractions as correct/incorrect
2. Find the confidence threshold where accuracy ≥ 95%
3. Route fields BELOW that threshold to human review

Key: empirically validated threshold, not raw score.

## Card 42 · D5 Context Management & Reliability

**Q:** How do you prevent temporal differences from being misclassified as source conflicts in synthesis?

**A:** Require subagents to include publication_date or data_collection_date in structured outputs.

Without dates:
"48% cloud adoption" vs "81% cloud adoption" → looks like a conflict

With dates:
"48% (2021)" vs "81% (2024)" → correctly interpreted as a time series

Rule: two sources reporting the same metric at DIFFERENT times = time series, not a conflict.
Two sources reporting the same metric at the SAME time = genuine conflict to annotate.

## Card 43 · D3 Claude Code Configuration & Workflows

**Q:** What is the @import syntax in CLAUDE.md and when should you use it over subdirectory CLAUDE.md files?

**A:** @import path/to/standards.md

Includes the content of another file inside CLAUDE.md at load time.

Use @import when:
• Sharing a standards file across multiple packages in a monorepo
• A subdirectory maintainer wants to include shared rules without duplicating them

Use subdirectory CLAUDE.md when:
• Rules apply to all files in that directory
• Rules are directory-bound (not shared elsewhere)

Key: @import enables modular composition; subdirectory files are directory-scoped.

## Card 44 · D3 Claude Code Configuration & Workflows

**Q:** What is the plan-then-execute workflow and when is it most valuable?

**A:** Two-phase workflow:
1. PLAN MODE — explore the codebase, gather context, produce an implementation plan. No edits made.
2. DIRECT EXECUTION — approve the plan, then Claude implements it.

Most valuable when:
• The task spans many files (migration, refactor)
• You want to review the approach before any code changes
• The scope is uncertain and needs investigation first

Not needed for: targeted bug fixes, single-file changes, or tasks with a clear, known approach.

## Card 45 · D3 Claude Code Configuration & Workflows

**Q:** When should you send multiple bugs in a single message vs. fix them sequentially?

**A:** SINGLE MESSAGE — when bugs INTERACT:
• Both stem from the same flawed data model
• Fixing one first would require re-fixing after the other
• The correct fix requires seeing both together

SEQUENTIAL — when bugs are INDEPENDENT:
• Different modules, no shared code
• Each fix is self-contained
• Smaller diffs = cleaner attribution and review

Default: prefer sequential unless you have a reason to believe fixes interact.
