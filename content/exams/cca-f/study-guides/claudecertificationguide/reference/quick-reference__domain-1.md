---
title: "Quick Reference__domain 1"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# Quick Reference: Domain 1 — Agentic Architecture & Orchestration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/quick-reference/domain-1

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
02
Tool Design & MCP Integration
03
Claude Code Configuration & Workflows
04
Prompt Engineering & Structured Output
05
Context Management & Reliability

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
Quick Reference
/
Domain 1
DOMAIN 1
27%
Quick Reference: Domain 1 — Agentic Architecture & Orchestration
Print this page
The Agentic Loop

The core execution cycle: Send request → Inspect stop_reason → Execute tools or terminate.

stop_reason: "tool_use" — Claude wants to call tools. Continue the loop.
stop_reason: "end_turn" — Claude is finished. Terminate the loop.
Tool results must be appended to conversation history before the next iteration. Without this, Claude cannot reason about what the tool returned.
The stop_reason field is the reliable termination signal. It is deterministic and unambiguous, unlike parsing the response text.

Current state (checked 14 August 2026): the exam keys on end_turn and tool_use. The live Messages API also returns pause_turn, max_tokens, stop_sequence, refusal and model_context_window_exceeded, so a production loop handles more than the two exam values.

Three anti-patterns to recognise on sight:

Anti-Pattern	Why It Fails
Parsing natural language ("I'm done")	Ambiguous — Claude may say "finished step 1" while intending to continue
Iteration caps as primary control	Either cuts off useful work or runs unnecessary iterations
Checking content[0].type == "text"	Claude can return text alongside tool_use blocks in the same response

Iteration caps are acceptable only as a safety net (maximum bound to prevent runaway agents), never as the primary stopping mechanism.

Orchestration Patterns
Pattern	When to Use	Key Characteristic
Sequential	Steps depend on previous output	A → B → C, each step gets prior result
Parallel	Independent subtasks, latency matters	Fan-out, fan-in; tasks share no state
Pipeline	Stages with different specialisations	Assembly line; output of one is input to next
Dynamic Adaptive	Task complexity unknown upfront	Model decides decomposition at runtime
Hub-and-Spoke	Coordinator + specialist pattern	Central agent delegates to focused subagents

Decision rule: Use parallel when subtasks are independent. Use sequential when each step needs the previous result. Use dynamic adaptive when you cannot predict the decomposition at design time.

Guardrails Hierarchy

Prompt instructions are probabilistic. Hooks are deterministic. This distinction is the single most tested concept in this domain.

Mechanism	Type	Enforcement	Use For
System prompt rules	Probabilistic	Model may not comply	Style guidance, soft preferences
PreToolUse hooks	Deterministic	Code-level, pre-execution	Block dangerous tool calls, validate parameters
PostToolUse hooks	Deterministic	Code-level, post-execution	Validate outputs, sanitise results, audit logging

Hook execution order: PreToolUse fires before the tool runs. PostToolUse fires after. Both are programmatic — they cannot be bypassed by prompt injection.

When the exam says "must always" or "guaranteed" — the answer is hooks, not prompts.

Claude Agent SDK
AgentDefinition: Declares an agent's description, system prompt, and its tools field — the list that scopes which tools the subagent can access. Scope it to a small, role-focused set; the guide's illustration contrasts 4–5 tools with 18, where selection reliability degrades.
Task tool: Used by a coordinator to delegate work to a subagent; the coordinator's allowedTools must include "Task" (or "Agent", its current name in Claude Code) or it cannot spawn subagents at all. The subagent runs in its own context.

Key constraint: Subagents do not share memory. All context must be passed explicitly through task definitions or handoff payloads.

Multi-Agent Systems

Coordinator + Specialist pattern:

Coordinator handles task decomposition, sequencing, and result aggregation.
Specialists are scoped to a single domain, with a small tool set each.
Context passing must be explicit — no shared memory, no implicit state.

Why specialists over one large agent:

Focused tool sets reduce selection errors.
Smaller context windows per agent improve accuracy.
Independent scaling and testing of each specialist.

Task decomposition: The coordinator decides at runtime how to split work. Fixed decomposition suits predictable tasks; dynamic decomposition suits open-ended exploration.

Human-in-the-Loop

Structured handoff format (the exam tests this specific pattern):

Customer ID — Who is affected
Summary — What happened (factual, not interpretive)
Root cause — Why it happened
Recommended action — What the agent suggests

When to escalate: Policy exceptions, destructive operations, and genuine ambiguity that cannot be resolved with available context. Note the distinction the exam draws: a classifier score below a per-category threshold is a valid trigger, but an agent's self-reported confidence is not — the guide rejects it as poorly calibrated.

Key rule: Never silently fail. If the agent cannot complete a task, it must produce a structured handoff, not a generic error message.

Error Recovery & Resilience
Strategy	When to Use
fork_session	Divergent exploration — try multiple approaches without polluting main context
Fresh start + summary injection	Context has become stale or polluted; start new conversation with extracted facts
Retry with error feedback	Transient failure; send original + failed output + specific error back to model
Graceful degradation	Partial results are better than no results; return what you have with metadata

Stale context signals: Model repeats itself, contradicts earlier statements, or ignores recent tool results. The fix is not "more context" — it's a fresh start with a curated summary.

Decision Rules for the Exam
If the question says...	The answer is likely...
"guaranteed", "must always", "enforce"	Hooks (deterministic), not prompts
"flexibility", "adapt", "unexpected"	Model-driven decision-making
"independent subtasks"	Parallel orchestration
"each step needs previous output"	Sequential orchestration
"premature termination"	Check stop_reason, not iteration caps
"runaway agent"	Iteration cap as safety net
"share context between agents"	Explicit passing (subagents have no shared memory)
"complex task, unknown structure"	Dynamic adaptive orchestration
"compliance", "regulatory", "audit"	Programmatic enforcement (hooks), not model judgment
Common Exam Traps
Trap	Correct Answer
"Increase iteration cap to fix premature termination"	Wrong — fix the stop_reason check
"Subagents can read the coordinator's context"	Wrong — all context must be passed explicitly
"System prompt rules guarantee compliance"	Wrong — prompts are probabilistic; hooks guarantee
"Use one agent with many tools for simplicity"	Wrong — scope each agent to a small, role-focused tool set
"Iteration caps are the primary loop control"	Wrong — stop_reason is primary; caps are safety nets
"Text content in response means agent is done"	Wrong — text can appear alongside tool_use blocks
Next
Domain 2: Tool Design & MCP Integration