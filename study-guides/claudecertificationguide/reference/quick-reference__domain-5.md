# Quick Reference: Domain 5 — Context Management & Reliability | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/quick-reference/domain-5

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
Domain 5
DOMAIN 5
15%
Quick Reference: Domain 5 — Context Management & Reliability
Print this page
Progressive Summarisation Trap

The most common mistake: Relying on the model to progressively summarise earlier context as the conversation grows. Each summarisation pass loses specific details — names, numbers, exact quotes, precise timestamps.

The fix: Extract concrete facts into persistent structured blocks that are carried forward verbatim. Don't ask the model to "summarise what we've discussed" — maintain a structured facts section instead:

Copy
## Persistent Facts
- Customer: Jane Smith (ID: 12847)
- Order: #ORD-2024-8821, placed 2024-01-15
- Issue: Delivery address incorrect (postcode SW1A 1AA, should be SW1A 2AA)
- Status: Refund approved, reshipment pending


This block is copied forward exactly, not summarised. The model can't lose these details.

Scratchpad Files

Use scratchpad files to persist findings across context boundaries during multi-step exploration.

When to use: Long-running tasks that may exceed the context window, or tasks where intermediate findings need to survive a context reset.

Pattern:

Write findings to a scratchpad file as you discover them
At context boundaries, read the scratchpad to restore state
The scratchpad is a file on disk — it survives any context reset

Key distinction: Scratchpads are external persistence (files). Conversation history is internal persistence (context window). When the context window fills up, conversation history is lost — scratchpad files are not.

Two TS 5.1 Facts the Guide Names Explicitly
Lost in the middle. Models reliably process information at the beginning and end of long inputs, but may omit findings from middle sections. Order matters: put what must not be missed at the edges, not buried mid-context.
The API is stateless. Nothing is remembered between calls. Every request must carry the complete history it needs, which is exactly why tool results accumulate and why the window fills.
Error Propagation

Structured error context must include:

Field	Purpose	Example
Failure type	What category of failure	"network_timeout", "validation_error"
What was attempted	The query, parameters and target system	"Searched academic DB for 'renewable energy policy', 2022-2024"
Partial results	What was successfully retrieved before the failure	{ "orders": [...], "payments": null }
Potential alternatives	Approaches the coordinator could try next	"Try the mirror index, or broaden the date range"

Note the last two carefully: the guide asks for potential alternative approaches the coordinator can choose from, not a log of recovery already attempted. "Retried twice" belongs under what was attempted.

Never propagate generic error messages. "Something went wrong" gives the next agent (or human) nothing to work with. Structured error context enables intelligent recovery.

Valid Empty Results vs Access Failures
Situation	Type	Correct Action
Search returns 0 results	Valid empty	Accept — absence of data is the answer
API returns 401 Unauthorised	Access failure	Retry with correct credentials or escalate
Database query returns empty set	Valid empty	Accept — the record does not exist
Network timeout	Access failure	Retry or use fallback
Filter matches no items	Valid empty	Accept — refine the filter or report no matches
Rate limit (429)	Access failure	Wait and retry (respect Retry-After)

The exam tests this distinction repeatedly. If the tool executed successfully and returned nothing, that's a valid result. If the tool failed to execute, that's an error requiring recovery.

Confidence Calibration & Stratified Validation

Aggregate metrics mask per-type issues. An overall accuracy of 95% can hide the fact that one category has 60% accuracy.

Stratified validation pattern:

Group extractions by type/category
Calculate per-type accuracy
Identify categories where the model underperforms
Apply targeted fixes (better examples, tighter schema) to weak categories

Stratified random sampling: Select validation samples from each category proportionally. This detects novel error patterns that random sampling across all categories would miss.

Key exam point: When the question mentions "high overall accuracy but users report errors", the answer is stratified validation — break down accuracy by category to find the weak spots.

Source Attribution

Structured claim-source mappings survive synthesis. Inline links do not.

Approach	Survives Synthesis?	Use When
Structured mapping: { claim: "...", source: "...", url: "...", date: "..." }	Yes	Production systems, multi-step pipelines
Inline links in text	No — lost during summarisation	Quick prototyping only

Conflicting sources: Annotate both with provenance and dates. Never average conflicting claims or silently pick one. Present both with their sources and let the consumer decide.

Copy
Claim: "Sonnet's context window is 1M tokens"
  Source A: Anthropic docs (2026-08-14) — 1M tokens
  Source B: Blog post (2024-03-15) — 200K tokens
  Annotation: temporal change, not a conflict — the window grew
  between the two publication dates. Both kept, dated, for the
  consumer to interpret.

Escalation & Ambiguity

The three valid escalation triggers:

The customer explicitly asks for a human — honour it immediately, without attempting investigation first
Policy gap or exception — the policy is silent or ambiguous on the request (e.g. competitor price matching when policy only covers own-site adjustments)
The agent cannot make meaningful progress

Unreliable triggers (exam distractors): sentiment-based escalation and self-reported confidence scores. Neither tracks actual case complexity. A frustrated customer with a resolvable issue gets an acknowledgement and an offer to resolve; escalate only if they reiterate their preference.

Multiple matches: when a tool returns several customer records, ask for additional identifiers. Never select by heuristic.

Policy gap vs violation: a gap (policy silent) means escalate; a violation (policy forbids) means refuse with the policy explanation.

Context Window Strategies
Strategy	When to Use
Persistent fact blocks	Critical details that must survive summarisation
Scratchpad files	Multi-step exploration across context boundaries
Per-file passes + integration	Large codebases — avoid attention dilution
Fresh start + summary injection	Context has become stale or contradictory
Prompt caching	Repeated system prompts across requests (cost + latency savings)

Context window pressure signals: Model starts repeating itself, contradicts earlier statements, or ignores recent information. These indicate the window is too full or the context is stale.

Decision Rules for the Exam
If the question says...	The answer is likely...
"details lost over long conversation"	Persistent fact blocks, not progressive summarisation
"findings need to survive context reset"	Scratchpad files (external persistence)
"tool returned nothing"	Distinguish: valid empty (accept) vs access failure (retry)
"high overall accuracy, users report errors"	Stratified validation — check per-type accuracy
"sources disagree"	Annotate both with provenance and dates
"generic error message"	Replace with structured error context
"model contradicts itself"	Fresh start + summary injection
"inline citations lost after processing"	Switch to structured claim-source mappings
"monitoring shows stable metrics but quality complaints"	Per-type error rates instead of aggregate
"long task exceeds context window"	Scratchpad files + context boundary management
Common Exam Traps
Trap	Correct Answer
"Summarise the conversation to save context"	Wrong — summarisation loses details; use persistent fact blocks
"Overall 95% accuracy means the system is reliable"	Wrong — check per-type accuracy; aggregate masks category issues
"Pick the more recent source when they conflict"	Wrong — annotate both with provenance; let consumer decide
"Return 'No results found — please try again'"	Wrong if search legitimately found nothing — accept the empty result
"Inline citations in the text are sufficient"	Wrong for production — they are lost during synthesis; use structured mappings
"Monitor overall error rate for quality"	Wrong — monitor per-type error rates to catch category-specific degradation
"Keep all context in the conversation history"	Wrong — use scratchpad files for external persistence across boundaries
Previous
Domain 4: Prompt Engineering & Structured Output