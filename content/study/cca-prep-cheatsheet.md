---
title: "Cheat Sheet"
meta: "29-entry printable cheat sheet with code"
tags: ["study", "guide"]
---
# CCA-Prep Cheat Sheet (29 quick-reference entries)

Source: github.com/vinipx/cca-prep · src/data/cheatsheet.ts


## 1. [Agentic loops] D1 Agentic Architecture & Orchestration — stop_reason control flow

Continue loop when stop_reason === "tool_use". Execute tools, append results to conversation history, call Claude again. Terminate when stop_reason === "end_turn". Never use text content checks as a stop signal.

```
while (true) {
  const response = await claude.messages.create({...});
  if (response.stop_reason === 'end_turn') break;
  // stop_reason === 'tool_use' — execute tools
  const toolResults = await executeTools(response.content);
  messages.push({ role: 'assistant', content: response.content });
  messages.push({ role: 'user', content: toolResults });
}
```

## 2. [Multi-agent] D1 Agentic Architecture & Orchestration — Hub-and-spoke coordinator pattern

Coordinator manages ALL inter-subagent communication, error handling, and information routing. Subagents receive isolated context — must be passed explicitly in each prompt. Coordinator decomposes tasks, delegates, aggregates results, and routes errors. Subagents never communicate directly with each other.

## 3. [Hooks] D1 Agentic Architecture & Orchestration — Programmatic enforcement via hooks

PostToolUse hooks normalize data between tool calls (timestamps, status codes, heterogeneous formats). Interception hooks block policy-violating calls before execution (refunds > $500). Use hooks for GUARANTEED compliance. Use prompt instructions only for guidance — they have a non-zero failure rate on compliance-critical paths.

## 4. [Session management] D1 Agentic Architecture & Orchestration — --resume vs fork_session

--resume <session-name>: continues a named prior session. Use when prior context is mostly still valid. Best practice: explicitly inform Claude about any files that changed since the last session.

fork_session: creates independent branches from a shared baseline. Use to explore two divergent approaches (e.g., two refactoring strategies) without interference.

Start fresh when: prior tool results are stale due to major system changes.

## 5. [Tool descriptions] D2 Tool Design & MCP Integration — Tool descriptions are the routing mechanism

Tool descriptions are the primary signal Claude uses for tool selection. Each description must state: (1) exact purpose, (2) required input format, (3) what it returns, (4) when to use it vs. similar alternatives, (5) edge cases. Overlapping descriptions cause misrouting. System prompt keywords can create unintended tool associations — review prompts for conflicts.

## 6. [MCP errors] D2 Tool Design & MCP Integration — Structured MCP error fields

Every MCP error response must include:
• isError: true/false
• errorCategory: "transient" | "validation" | "business" | "permission"
• isRetryable: true/false
• message: human-readable description

Critical distinction: isError: false + empty array = successful query with no results (do NOT retry). isError: true = execution failure (handle per errorCategory).

```
// Transient — retry appropriate
{ isError: true, errorCategory: 'transient', isRetryable: true, message: 'DB timeout' }

// Business rule — do not retry
{ isError: true, errorCategory: 'business', isRetryable: false, message: 'Refund exceeds $500 limit' }

// Valid empty result — NOT an error
{ isError: false, content: [], message: 'No records found' }
```

## 7. [CLAUDE.md] D3 Claude Code Configuration & Workflows — CLAUDE.md hierarchy and use cases

Hierarchy (most specific wins): subdirectory CLAUDE.md > project root CLAUDE.md > global user ~/.claude/CLAUDE.md.

Project root: coding standards, architecture decisions, naming conventions, PR format, shared tooling.
Subdirectory: technology-specific rules (React patterns in /frontend, Python conventions in /backend).
Global user: personal defaults and preferences.

Loaded automatically at every session start — no additional configuration needed.

## 8. [Plan mode] D3 Claude Code Configuration & Workflows — When to require plan mode

Plan mode shows Claude's full intended action sequence BEFORE any execution begins. Mandatory for: large-scale refactors, database schema migrations, CI/CD deployments, changes spanning 10+ files, any irreversible production operations.

Invoke with /plan or the plan mode flag. Review the plan carefully. Approve, modify specific steps, or cancel entirely.

## 9. [Structured output] D4 Prompt Engineering & Structured Output — Validation retry loop pattern

Step 1: Request output with JSON schema defined.
Step 2: Validate response against schema.
Step 3: If validation fails, return specific error to Claude: exact field + expected type/format + actual wrong value + example correction.
Step 4: Claude regenerates with that feedback.
Repeat until valid or max retries exceeded.
On persistent failures: set requires_human_review: true and route to manual queue.

## 10. [Batch API] D4 Prompt Engineering & Structured Output — Message Batches API decision criteria

Use Batches API when ALL of these are true:
✓ No real-time user waiting for the response
✓ Deadline is hours away (not seconds)
✓ Volume is high (100+ requests)
✓ ~50% cost savings justify the variable latency

NEVER use for:
✗ Live user queries (chat, search)
✗ Blocking workflows with hard SLAs
✗ Any step a user is actively waiting on

## 11. [Context & reliability] D5 Context Management & Reliability — Attention dilution — diagnosis and fix

Symptom: agent misses details from the middle of long documents or contexts.
Root cause: attention dilution — not a context window size problem.

Fix pattern:
1. Split document into logical sections
2. Process each section with its own focused context pass
3. Run a separate integration/synthesis pass over all section summaries

A larger context window does NOT fix this — it just relocates the diluted zone. Never substitute window size for focused passes.

## 12. [CLAUDE.md] D3 Claude Code Configuration & Workflows — CLAUDE.md configuration hierarchy

Three levels, each with a different scope:

1. User-level (~/.claude/CLAUDE.md) — personal only, never shared via version control. Use for personal preferences.

2. Project-level (root CLAUDE.md or .claude/CLAUDE.md) — committed to version control, applies to all team members.

3. Directory-level (subdirectory CLAUDE.md) — applies only when working in that directory.

Path-scoped rules (.claude/rules/*.md with YAML frontmatter) apply only to files matching glob patterns. Use these over directory-level CLAUDE.md when conventions span multiple directories (e.g., test files spread throughout the codebase).

@import syntax: reference external files from any CLAUDE.md for modular configuration.

```
# .claude/rules/testing.md
---
paths: ["**/*.test.tsx", "**/*.spec.ts"]
---
# Testing conventions
- Use React Testing Library
- Prefer userEvent over fireEvent
- Always test accessibility
```

## 13. [Skills] D3 Claude Code Configuration & Workflows — Skill SKILL.md frontmatter options

Three key frontmatter options for skills in .claude/skills/:

context: fork — runs the skill in an isolated sub-agent context. Intermediate tool output stays isolated; only the final response returns. Use for verbose analysis or exploration skills.

allowed-tools — restrict which tools the skill can call during execution. Prevents destructive actions.

argument-hint — display text shown when the skill is invoked without arguments, prompting for required parameters.

Project-scoped skills: .claude/skills/ (committed, shared)
User-scoped skills: ~/.claude/skills/ (personal, not shared)

```
# .claude/skills/analyze-codebase.md
---
context: fork
allowed-tools: Read, Grep, Glob
argument-hint: "module-name to analyze (e.g., auth, payments)"
---
Analyze the architecture of the specified module...
```

## 14. [Session management] D1 Agentic Architecture & Orchestration — Session resumption vs fork_session

--resume <session-name> — continues a specific prior named session. Use when prior context is still valid (no major file changes). When resuming after file changes, explicitly inform the agent about what changed for targeted re-analysis.

fork_session — creates two independent branches from a shared session baseline. Use when exploring two divergent approaches from the same starting point (e.g., comparing two refactoring strategies).

Starting fresh with summaries — preferred when prior tool results are stale (many files changed). Inject a structured summary of key findings into the new session's initial context.

/compact — reduces context usage during extended sessions when context fills with verbose discovery output.

## 15. [MCP servers] D2 Tool Design & MCP Integration — MCP server scoping: project vs user

Project-scoped .mcp.json (project root):
• Committed to version control
• Available to ALL team members automatically on clone/pull
• Use for: shared team tooling (GitHub, Jira, internal databases)
• Use environment variable expansion for credentials: ${GITHUB_TOKEN}

User-scoped ~/.claude.json:
• Personal only, never version-controlled
• Use for: personal experimental servers or user-specific integrations

Both scopes are active simultaneously — you can have project and user servers configured at the same time.

```
// .mcp.json (committed to version control)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## 16. [Built-in tools] D2 Tool Design & MCP Integration — Built-in tool selection guide

Grep — search file CONTENTS for patterns
• Finding all callers of a function
• Finding all imports of a module
• Finding error message strings
• Pattern: grep → find entry points → Read to follow

Glob — find FILES by name/extension pattern
• Find all *.test.tsx files
• Find all files in src/api/**
• Find all Terraform *.tf files

Read — load FULL FILE CONTENTS for one file
Edit — targeted modification using UNIQUE anchor text; fallback: Read + Write when anchor is non-unique
Write — create new files or full rewrites
Bash — shell commands not covered by above tools

Rule: Grep for content search, Glob for file name patterns, never use Bash for what a dedicated tool can do.

## 17. [Structured output] D4 Prompt Engineering & Structured Output — tool_choice options — when to use each

"auto" (default) — Claude may call a tool OR return conversational text. No guarantee of tool use. Use when tool calling is optional.

"any" — Claude MUST call at least one tool, its choice. Use when you need guaranteed structured output but multiple extraction schemas are valid (e.g., document type unknown).

Forced {"type": "tool", "name": "X"} — Claude MUST call this specific named tool. Use when a specific tool must run FIRST before any other step (e.g., extract_metadata before enrichment tools).

For multi-step pipelines: use forced selection on the first turn, then "auto" or "any" for subsequent turns.

```
// Guarantee a specific tool runs first
const response = await claude.messages.create({
  tools: [extractMetadata, enrichContent],
  tool_choice: { type: 'tool', name: 'extract_metadata' },
  messages,
});

// Then allow free tool selection for enrichment
const enriched = await claude.messages.create({
  tools: [enrichContent, validateOutput],
  tool_choice: { type: 'any' },
  messages: [...messages, response],
});
```

## 18. [Batch API] D4 Prompt Engineering & Structured Output — Message Batches API — use vs avoid

Message Batches API: ~50% cost savings, up to 24-hour processing window, no guaranteed latency SLA. Responses correlated via custom_id fields.

USE for (latency-tolerant, non-blocking):
✓ Overnight technical debt reports
✓ Weekly security audits
✓ Nightly test generation
✓ Bulk document classification
✓ Any job where results are reviewed hours later

AVOID for (blocking, latency-sensitive):
✗ Pre-merge CI checks (developers waiting)
✗ Live user queries
✗ Any workflow with a hard sub-minute SLA

Note: Batch API does NOT support multi-turn tool calling within a single request.

## 19. [Review architecture] D4 Prompt Engineering & Structured Output — Multi-pass code review architecture

Problem: single-pass review of many files causes attention dilution — inconsistent depth, missed bugs, contradictory feedback.

Solution — split into focused passes:

Pass 1 (per-file local): analyze each file individually for local issues (correctness, security, style). Each file gets its own focused context.

Pass 2 (cross-file integration): examine cross-file data flow, interface contracts, and integration points across all files together.

Additional patterns:
• Independent review instance: use a fresh session (no generation context) for final review
• Dedup pass: when re-running after new commits, include prior findings and instruct Claude to report only new or still-unaddressed issues

## 20. [Context management] D5 Context Management & Reliability — Structured facts extraction pattern

Problem: progressive summarization loses numerical precision — "$43.27" becomes "$43" or "approximately $40."

Solution: extract transactional facts into a persistent "case facts" block included VERBATIM in every subsequent prompt, outside the summarized conversation history.

What to extract:
• Exact amounts (disputed charges, refund amounts)
• Dates and order numbers
• Account and case IDs
• Statuses confirmed by the customer
• Policy thresholds exceeded

The conversation history can be compressed; the facts block must stay exact.

```
// Injected at the top of every prompt in the session
const caseFacts = {
  customerId: 'C-98234',
  disputedAmount: 43.27,  // exact — never summarize
  orderIds: ['ORD-1122', 'ORD-1133'],
  confirmedIssue: 'double charge on 2024-11-03',
};
```

## 21. [Error propagation] D5 Context Management & Reliability — Structured error propagation response format

When a subagent fails, return structured error context — not empty results and not a generic "error" status.

Required fields in error response:
• errorCategory: "transient" | "validation" | "permission" | "business"
• isRetryable: boolean — should the coordinator retry?
• failureType: what specifically went wrong
• attemptedQuery: what the subagent tried
• partialResults: any data retrieved before failure
• alternativeApproach: suggestions for recovery

Never return empty results on failure (coordinator mistakes it for "found nothing").
Never terminate the entire workflow on a single subagent failure.

```
// Structured error context returned by a subagent
return {
  isError: true,
  errorCategory: 'transient',
  isRetryable: true,
  failureType: 'timeout',
  attemptedQuery: 'AI adoption in healthcare 2024',
  partialResults: ['article1.pdf summary'],
  alternativeApproach: 'Try splitting query into two narrower searches',
};
```

## 22. [Context management] D1 Agentic Architecture & Orchestration — Trimming verbose tool outputs before context accumulation

Tool results often return far more data than the agent needs. A 40-field order object trimmed to 5 relevant fields before being appended to context costs ~90% fewer tokens — preventing exhaustion without losing semantic value.

When to trim:
• API responses with many irrelevant fields
• File system listings where only a few paths are needed
• Database records where only specific columns matter

When NOT to trim:
• When downstream agents need the full record
• When the "irrelevant" fields might be referenced in error handling

Trim at the tool result layer, before appending to conversation history.

```
// Before appending tool result to context, extract only needed fields
const rawOrder = await getOrder(orderId); // 40 fields
const relevantOrder = {
  orderId: rawOrder.orderId,
  status: rawOrder.status,
  amount: rawOrder.amount,
  customerId: rawOrder.customerId,
  lastUpdated: rawOrder.lastUpdated,
  // 35 fields omitted — not needed for this agent's task
};
messages.push({ role: 'user', content: JSON.stringify(relevantOrder) });
```

## 23. [Multi-agent] D1 Agentic Architecture & Orchestration — Explore subagent pattern for context budget preservation

Spawn a dedicated Explore subagent for verbose discovery work. The subagent's tool calls — file listings, search results, directory trees — accumulate in its own isolated context. Only the structured summary returns to the coordinator.

Coordinator context stays clean for high-level orchestration.

Use when:
• Discovering which files match a complex pattern across a large repo
• Scanning many documents to find relevant ones
• Any exploratory task that generates output the coordinator does not need verbatim

The coordinator's prompt to the Explore subagent should specify: what to look for and what format to return the summary in.

## 24. [MCP servers] D2 Tool Design & MCP Integration — MCP Resources as content catalogs

MCP Resources expose WHAT data is available — they are content catalogs, not actions.

Use Resources when:
• Agents need to know which documents, issues, or schemas exist before deciding what to fetch
• Exploratory tool calls waste quota when the agent does not know what is available
• The data set is large and browsable (e.g., 500 Jira issues, a documentation hierarchy)

Use Tools when:
• The agent needs to perform an operation (create, update, fetch a specific item)

Pattern: agent browses Resource catalog → selects relevant items → calls Tools to fetch only those items.

This avoids blind tool calls like "fetch all issues and filter" when 450 of 500 are irrelevant.

## 25. [CI/CD] D3 Claude Code Configuration & Workflows — --output-format json + --json-schema for CI structured findings

For CI pipelines that need to post findings as inline PR comments or feed downstream tooling, use structured output flags instead of parsing prose.

`--output-format json` — Claude Code emits JSON instead of Markdown prose.
`--json-schema <schema-file>` — enforces a specific JSON shape.

Combined with `-p` (non-interactive), this produces a fully machine-parseable output.

Typical CI workflow:
1. Claude Code runs review with these flags
2. CI script parses the JSON findings
3. Script posts each finding as an inline PR comment via the GitHub API

Do not parse prose for structured data — use these flags instead.

```
# CI step: structured review output
claude -p "Review for security issues" \
  --output-format json \
  --json-schema .claude/review-schema.json \
  > findings.json

# findings.json shape (defined by review-schema.json):
# [{ "file": "src/auth.ts", "line": 42, "severity": "high", "message": "..." }]
```

## 26. [Structured output] D4 Prompt Engineering & Structured Output — "other" + detail string pattern for extensible enums

Pure enums force the model to pick the nearest wrong category when a value does not fit — degrading accuracy silently.

Pattern: add "other" to the enum + a companion detail field.

Rules:
• `category_detail` is null when `category !== "other"`
• `category_detail` is a non-null string when `category === "other"`
• Downstream: items with `category === "other"` are routed to human review

Benefits:
• Preserves controlled vocabulary for known types (enables aggregation, filtering)
• Gives a structured escape hatch for novel cases
• Surfaces unknown types for later enum expansion — do not silently fail

```
// Schema
{
  "category": {
    "type": "string",
    "enum": ["medical", "dental", "pharmacy", "vision", "other"]
  },
  "category_detail": {
    "type": ["string", "null"],
    "description": "Required when category is 'other'. Null otherwise."
  }
}

// Valid outputs:
{ "category": "dental", "category_detail": null }
{ "category": "other", "category_detail": "holistic wellness treatment" }
```

## 27. [Structured output] D4 Prompt Engineering & Structured Output — detected_pattern field for false positive analysis

Add a `detected_pattern` field to structured review findings to name the code construct that triggered each finding.

When developers dismiss findings, log which patterns were dismissed. Over time, high-dismissal patterns are false positive candidates for prompt tuning.

Workflow:
1. Pipeline outputs `{ finding: "...", detected_pattern: "eval_in_userland" }`
2. Developer dismisses the finding → pattern is logged
3. Weekly: patterns dismissed > 70% of the time are flagged for review
4. Tune prompt to exclude or handle those patterns differently

Without this field: you know precision is low but not WHY or WHERE to fix it.

```
// Structured finding with pattern annotation
{
  "file": "src/renderer.js",
  "line": 88,
  "severity": "medium",
  "message": "Dynamic code execution via eval()",
  "detected_pattern": "eval_in_userland",  // ← enables false positive analysis
  "dismissed": false  // set to true when developer dismisses
}
```

## 28. [Context management] D5 Context Management & Reliability — Field-level confidence calibration workflow

Per-field confidence scores are a valid routing signal when calibrated against labeled data — not when used raw.

Calibration workflow:
1. Extraction pipeline outputs { value: "2026-03-15", confidence: 0.82 } per field
2. Team manually labels 500+ extractions as correct / incorrect
3. Plot accuracy vs. confidence score — find the threshold where accuracy ≥ 95%
4. Route fields below that threshold to human review
5. Re-calibrate quarterly as document types evolve

Key distinction from the anti-pattern:
• Anti-pattern: raw, uncalibrated confidence as a blanket escalation signal
• Valid use: empirically validated per-field threshold for review routing

```
// Extraction output per field
{
  "invoice_number": { "value": "INV-2024-0892", "confidence": 0.97 },
  "invoice_date":   { "value": "2024-11-03",    "confidence": 0.91 },
  "line_items":     { "value": [...],             "confidence": 0.61 }  // → human review
}

// Routing logic (threshold calibrated from labeled validation set)
const REVIEW_THRESHOLD = 0.87; // empirically: accuracy ≥ 95% above this
const needsReview = fields.filter(f => f.confidence < REVIEW_THRESHOLD);
```

## 29. [Context management] D5 Context Management & Reliability — Rendering content types appropriately in synthesis output

Do not homogenize all synthesis output to prose. Different content types communicate more clearly in different formats.

• Financial / numerical data → tables (enables direct comparison)
• Narrative findings, analysis → prose paragraphs
• Technical specifications, APIs → structured lists or code blocks
• Contested findings with conflicting sources → side-by-side comparison
• Time series data → table with date column

Why it matters: converting a 10-row financial comparison to prose strips the structure that makes comparison possible. Converting a nuanced narrative to bullet points loses the connective reasoning.

Instruct synthesis agents explicitly: "present financial data as tables, narrative analysis as prose, and flagged conflicts as side-by-side comparisons."
