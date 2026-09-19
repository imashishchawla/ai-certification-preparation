# 1.5 — Agent SDK Hooks | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-5-agent-sdk-hooks

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
1.1
Agentic Loops
1.2
Multi-Agent Orchestration
1.3
Subagent Invocation and Context Passing
1.4
Workflow Enforcement and Handoff
1.5
Agent SDK Hooks
1.6
Task Decomposition Strategies
1.7
Session State and Resumption
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
LEARN
/
AGENTIC ARCHITECTURE & ORCHESTRATION
/
1.5
DOMAIN 1
TASK 1.5
Mark Complete
Agent SDK Hooks
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Agent SDK hooks inject deterministic behaviour into an otherwise probabilistic system. They sit right at the boundary between the model's decisions and the real world, intercepting tool calls and results to enforce business rules and normalise data. Remember the enforcement spectrum from 1.4? Hooks are how you implement its programmatic side in practice.

Two Types of Hooks

The Agent SDK provides hooks at two points in the tool execution lifecycle:

PostToolUse hooks run after a tool executes but before the model processes the result. They intercept tool results and transform them before the model sees them. The model receives clean, normalised data regardless of which tool produced it.

PreToolUse hooks (sometimes described as tool-call interception) run before a tool executes. They intercept the outgoing tool call and can block it, modify it, or redirect it to an alternative workflow. The tool never runs if the hook decides to block it.

What each hook returns. In the Agent SDK a PreToolUse hook answers with a permissionDecision of allow, deny, ask or defer, plus an optional updatedInput that rewrites the tool's arguments before it runs. A PostToolUse hook can set updatedToolOutput to replace what the model sees, for built-in and MCP tools alike. The older updatedMCPToolOutput covered MCP tools only and is deprecated. One thing neither field changes: by the time PostToolUse fires the tool has already run, so blocking there stops the loop but does not undo the side effect. (Agent SDK hooks guide, checked September 2026.)

KEY CONCEPT

PostToolUse hooks transform data after execution. PreToolUse hooks enforce policy before execution. Know which direction each hook operates in — the exam tests this distinction.

PostToolUse Hooks: Data Normalisation

Different MCP tools return data in different formats. A customer database might return Unix timestamps (1710489600). An order management system might return ISO 8601 dates ("2024-03-15T12:00:00Z"). A status API might return numeric codes (200, 404, 500) while another returns strings ("active", "cancelled", "pending").

Without normalisation, the model has to interpret these mixed formats on every single iteration. That breeds inconsistency. It might parse a Unix timestamp correctly one time and misread it the next.

A PostToolUse hook solves this by normalising all formats before the model processes them:

Unix timestamps → ISO 8601 dates
Numeric status codes → human-readable strings
Currency values → consistent decimal format with currency code
Date strings in various regional formats → a single standard format

The model receives clean, consistent data every time, regardless of which tool or backend system produced it.

PreToolUse Hooks: Policy Enforcement

PreToolUse hooks are the implementation mechanism for the prerequisite gates described in 1.4. They intercept outgoing tool calls before execution and apply business rules:

Use case: Refund threshold enforcement. A hook intercepts all calls to process_refund. If the refund amount exceeds $500, the hook blocks the call and redirects to a human escalation workflow. The refund tool never executes — the hook prevents it before it can run.

Use case: Compliance prerequisite gates. A hook intercepts calls to transfer_funds. If the required anti-money laundering (AML) check has not been completed for this session, the hook blocks the call and returns an error message directing the agent to complete the AML check first.

Use case: Manager approval workflow. A hook intercepts calls to approve_discount for discounts above 20%. The hook pauses execution and routes the request to a manager approval queue. Only after manager approval does the tool execute.

EXAM TRAP

The exam will present PostToolUse hooks as a solution for blocking policy-violating actions. This is wrong. PostToolUse runs after execution — by the time it fires, the non-compliant action has already occurred. Use PreToolUse hooks (pre-execution) to block actions before they happen.

The Decision Framework

This framework is the core mental model for the exam:

Requirement	Mechanism	Guarantee
Must be followed 100% of the time	Hooks	Deterministic
Preferred but occasional deviation is acceptable	Prompts	Probabilistic

If the business would lose money from a single failure → use a hook. If the business would face legal risk from a single failure → use a hook. If it is a formatting preference or style guideline → prompt-based guidance is fine.

The exam consistently presents prompt-based solutions as distractors for scenarios requiring deterministic enforcement. The decision is not about whether prompts are "good enough" — it's about whether the consequence of a single failure justifies deterministic guarantees.

Hooks vs Prompts: Side-by-Side Comparison

Scenario: International transfers must pass AML checks.

Prompt approach: "Always complete AML verification before processing international transfers." Works 95% of the time. The 5% failure rate means some transfers skip AML checks — a regulatory violation.
Hook approach: A PreToolUse hook blocks transfer_funds until aml_check returns a pass. Works 100% of the time. No transfer can execute without AML verification.

Scenario: Responses should be formatted in markdown.

Prompt approach: "Format all responses using markdown with headers and bullet points." Works most of the time. Occasional plain-text responses are not a business risk.
Hook approach: Unnecessary overhead. Formatting preferences do not require deterministic enforcement.

Scenario: Refunds above $500 require human approval.

Prompt approach: "For refunds above $500, escalate to a human agent." Works most of the time. A single failure means a large refund processed without approval.
Hook approach: Intercept process_refund, check the amount, block if above $500 and route to human escalation. Works 100% of the time.
Beyond PreToolUse and PostToolUse

BEYOND THE GUIDE

The guide scopes Task Statement 1.5 to PreToolUse and PostToolUse. Claude Code fires hooks at other points in a session as well, and the practice bank has tested one of them, PreCompact, since July. Verified against the hooks reference on 16 September 2026.

The same hook mechanism covers session events, not only tool calls. The one worth knowing is PreCompact, which runs immediately before Claude Code compacts the conversation, whether the user typed /compact (matcher manual) or the context reached the auto-compact window (matcher auto). The hook receives the transcript path, the trigger, and any custom instructions the user passed to /compact, so it can archive the full transcript to a log before the summary discards detail. Exit code 2, or "decision": "block" in its JSON output, blocks the compaction. A PostCompact event fires afterwards carrying the generated summary. The pattern is the one you already know from tool hooks: a Pre event can inspect and block, a Post event can only observe what's already happened.

Practical Example: Data Format Chaos

A customer support agent uses three MCP tools:

get_customer returns dates as Unix timestamps and status as numeric codes.
lookup_order returns dates as ISO 8601 strings and status as English strings.
check_shipping returns dates as "DD/MM/YYYY" and status as single-character codes ("S" for shipped, "P" for pending).

Without a PostToolUse hook, the model must interpret three different date formats and three different status representations on every iteration. Sometimes it correctly converts a Unix timestamp; sometimes it confuses the day/month order in "DD/MM/YYYY"; sometimes it misinterprets "P" as "processed" instead of "pending."

With a PostToolUse hook, all tool results are normalised before the model sees them:

All dates → ISO 8601 ("2024-03-15T12:00:00Z")
All status codes → human-readable strings ("shipped", "pending", "delivered")

The model always receives consistent data, eliminating interpretation errors entirely.

Exam Traps
EXAM TRAP

Using PostToolUse hooks to block policy-violating actions

PostToolUse hooks run after tool execution. By the time the hook fires, the non-compliant action has already been processed. Use PreToolUse hooks (pre-execution) to block actions before they happen.

EXAM TRAP

Enhanced prompt instructions as the solution for 100% compliance requirements

Prompts provide probabilistic compliance. If the business requires 100% enforcement (financial operations, regulatory compliance, security checks), only hooks provide deterministic guarantees.

EXAM TRAP

Suggesting model-side data transformation instead of PostToolUse hooks for normalisation

Relying on the model to normalise heterogeneous data formats introduces inconsistency. PostToolUse hooks ensure clean, consistent data reaches the model every time, regardless of which tool produced it.

EXAM TRAP

Confusing the direction of hooks — PostToolUse runs after execution, PreToolUse runs before

PostToolUse transforms results after a tool runs. PreToolUse blocks or modifies calls before a tool runs. Using the wrong hook direction means either missing the opportunity to prevent an action or unnecessarily blocking completed work.

Practice Scenario

An agent occasionally processes international transfers without required compliance checks. The compliance team requires 100% enforcement of anti-money laundering (AML) checks before any international transfer is executed. The current system uses prompt instructions that work approximately 95% of the time. What is the correct approach?

OPTION A
Implement a PreToolUse hook that blocks the transfer_funds tool from executing until aml_check returns a verified pass result
OPTION B
Add detailed AML check instructions to the system prompt with examples of correct behaviour and explicit warnings about penalties for non-compliance
OPTION C
Add a PostToolUse hook that flags any completed transfer which skipped its AML check and queues it for manual review by the compliance team
OPTION D
Train the agent with few-shot examples demonstrating the correct AML verification workflow before every transfer
Check Answer
Build Exercise
BUILD EXERCISE
Implement Agent SDK Hooks for Normalisation and Policy Enforcement
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

The distinction between PostToolUse hooks (after execution, data normalisation) and PreToolUse hooks (before execution, policy enforcement)
Why hooks provide deterministic guarantees that prompts cannot match
How to normalise heterogeneous data formats from multiple MCP tools into a consistent schema
How to implement threshold-based and prerequisite-based policy enforcement using pre-execution hooks
The decision framework: hooks for 100% requirements, prompts for preferences
Create an agent with three MCP tools that return data in different formats: Tool A returns Unix timestamps and numeric status codes, Tool B returns ISO 8601 dates and string statuses, Tool C returns DD/MM/YYYY dates and single-character status codes

WHY: This recreates the data format chaos example from the exam. Without normalisation, the model must interpret three different date formats and three different status representations, leading to inconsistent parsing across iterations.

YOU SHOULD SEE: Three tool implementations that each return data with distinct date and status formats. Tool A uses epoch seconds and numeric codes, Tool B uses ISO strings and English statuses, Tool C uses DD/MM/YYYY and single characters.

Stuck? Get a nudge
Implement a PostToolUse hook that intercepts all tool results and normalises dates to ISO 8601 format and status codes to human-readable English strings

WHY: PostToolUse hooks run after execution but before the model processes the result. This is the correct hook direction for data normalisation — the exam tests whether you know that PostToolUse transforms data after execution, not before.

YOU SHOULD SEE: A HookCallback registered under PostToolUse that reads tool_response and rewrites it: Unix timestamps and DD/MM/YYYY dates to ISO 8601, numeric and single-character status codes to English strings. The rewritten object comes back as updatedToolOutput inside hookSpecificOutput.

Stuck? Get a nudge
Verify the model receives consistent data by testing with queries that require results from all three tools

WHY: Consistent data eliminates interpretation errors. Without normalisation, the model might confuse day/month order in DD/MM/YYYY or misinterpret status code P as processed instead of pending. Verification proves the hook works across all tool outputs.

YOU SHOULD SEE: Three tool results that all use ISO 8601 dates and English status strings, whichever tool produced them. The model response should reference dates and statuses consistently.

Stuck? Get a nudge
Add a PreToolUse hook that blocks process_refund when the amount exceeds $500 and redirects to a human escalation workflow

WHY: A PreToolUse hook runs before execution — the refund never processes. The exam specifically warns against using PostToolUse for blocking, because by that point the action has already occurred. Pre-execution interception is the only correct hook direction for policy enforcement.

YOU SHOULD SEE: A PreToolUse callback that inspects the refund amount and denies anything above $500, returning permissionDecision deny with a permissionDecisionReason. The refund tool never executes for denied calls.

Stuck? Get a nudge
Add a second PreToolUse hook that blocks transfer_funds until aml_check has returned a pass result in the current session

WHY: This is the AML compliance scenario from the exam. Prompt instructions achieve 95% compliance, but regulatory requirements demand 100%. The hook provides deterministic enforcement that no prompt can match — a single missed AML check can result in legal penalties.

YOU SHOULD SEE: Two callbacks: a PreToolUse hook on transfer_funds that denies until session state records a passing AML check, and a PostToolUse hook on aml_check that sets that state.

Stuck? Get a nudge
Test both hooks by attempting to trigger the blocked operations and verify they are prevented before execution

WHY: Testing confirms that the hooks provide deterministic enforcement. The key verification is that blocked tools never execute — the hook prevents the call, not just logs a warning after the fact.

YOU SHOULD SEE: Both denied operations leave their tool handlers untouched, and the model receives the permissionDecisionReason. Once the prerequisites are met, the same operations run.

Stuck? Get a nudge
Sources
Claude Agent SDK Overview — Anthropic
Claude Agent SDK Hooks Documentation — Anthropic
Claude Code Hooks Reference — PreCompact — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Workflow Enforcement and Handoff
NEXT LESSON
Task Decomposition Strategies