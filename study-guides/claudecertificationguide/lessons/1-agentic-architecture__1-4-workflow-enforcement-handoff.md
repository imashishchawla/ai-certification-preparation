# 1.4 — Workflow Enforcement and Handoff | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-4-workflow-enforcement-handoff

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
1.4
DOMAIN 1
TASK 1.4
Mark Complete
Workflow Enforcement and Handoff
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Task Statement 1.4 draws a hard line between two approaches to controlling agent behaviour: prompt-based guidance and programmatic enforcement. The exam tests this distinction repeatedly, and getting it wrong on high-stakes scenarios will cost you marks.

The Enforcement Spectrum

There are two very different ways to enforce workflow ordering in an agentic system:

Prompt-based guidance means putting instructions in the system prompt. For example: "Always verify the customer's identity before processing a refund." It works most of the time — perhaps 90-95% of cases. But it carries a non-zero failure rate. The model is probabilistic. Sometimes it'll skip steps, reorder them, or read the instruction loosely. For low-stakes operations, that failure rate is fine.

Programmatic enforcement means implementing hooks, prerequisite gates, or code-level checks that physically block downstream tools until prerequisites complete. For example: the process_refund tool cannot execute until get_customer has returned a verified customer ID. This works every time. It is deterministic, not probabilistic. No matter what the model decides to do, the gate prevents the wrong execution order.

KEY CONCEPT

Prompt-based guidance is probabilistic — it works most of the time. Programmatic enforcement is deterministic — it works every time. The exam decision rule: if a single failure would cause financial loss, security breach, or compliance violation, use programmatic enforcement.

The Exam Decision Rule

The exam applies a consistent decision rule across multiple scenarios:

Financial operations (refunds, transfers, payments): programmatic enforcement. A single unverified refund to the wrong account is a financial loss.
Security operations (identity verification, access control): programmatic enforcement. A single bypass of identity verification is a security breach.
Compliance operations (AML checks, regulatory requirements): programmatic enforcement. A single missed compliance check can result in legal penalties.
Low-stakes operations (formatting preferences, style guidelines, output ordering): prompt-based guidance is acceptable. A formatting inconsistency is not a business risk.

The exam will present prompt-based solutions as answer options for high-stakes scenarios. Reject them. Enhanced system prompts, few-shot examples, and stronger instructions all improve accuracy but none provide deterministic guarantees. When the scenario involves money, security, or compliance, the answer is always programmatic enforcement.

EXAM TRAP

The exam consistently presents "add stronger instructions to the system prompt" or "include few-shot examples showing the correct workflow" as distractors for high-stakes scenarios. These answers improve probability but do not eliminate the failure rate. For financial, security, and compliance operations, only programmatic enforcement is correct.

Prerequisite Gates in Practice

A prerequisite gate is a programmatic check that blocks a tool from executing until a prior condition is met. In a customer support agent:

The agent has access to get_customer, lookup_order, and process_refund tools.
A prerequisite gate checks: has get_customer returned a verified customer ID for this session?
If yes, process_refund executes normally.
If no, process_refund returns an error message: "Cannot process refund — customer identity not verified. Please call get_customer first."

The gate is code, not a prompt instruction. The model can't bypass it by deciding to skip verification. Even if the model attempts to call process_refund directly, the gate blocks the call and returns an error that forces the model to verify identity first.

Subagent Lifecycle Hooks: SubagentStart and SubagentStop

BEYOND THE GUIDE

Task Statement 1.4 covers programmatic enforcement, prerequisite gates and structured handoff, and the guide's appendix scopes Agent SDK hooks to PostToolUse and tool-call interception. The subagent lifecycle events below are useful background rather than tested material. Verified against the hooks reference on 16 September 2026.

The Claude Agent SDK provides lifecycle hook events specifically for subagent management. These complement the PreToolUse and PostToolUse hooks covered in Task Statement 1.5.

SubagentStart fires when a subagent is spawned via the Task tool (renamed Agent in current Claude Code). The hook receives the subagent's type and id, and it cannot block the spawn. What it can do is add context: return additionalContext in its JSON output and that string is placed in the subagent's context before its first prompt, which is the documented way to hand a freshly spawned subagent a standing instruction. To enforce rules on spawning itself — rate limits, or checking that the coordinator passed required context — attach a PreToolUse hook to the Agent tool instead, which can deny or rewrite the outgoing invocation before the subagent starts.

SubagentStop fires when a subagent finishes execution and returns its results to the coordinator. The hook receives the subagent's id and final message, so it can validate output and log completion for performance monitoring. If validation fails — say the output does not conform to the expected schema — the hook exits with code 2, which prevents the subagent from stopping and sends it back to keep working. Exit code 2 is the documented blocking mechanism; there is no decision field for this event. SubagentStop does not transform the returned output, and the hooks reference documents no field on any event that rewrites a tool result in place, so treat output reshaping as something the coordinator does after the fact rather than something a hook does for you.

Side by side:

	SubagentStart	SubagentStop
Fires	when the coordinator spawns a subagent via Task (Agent)	when the subagent finishes and returns its result
Receives	the subagent's type and id	the subagent's id and its final message
Can block	no	yes: exit code 2 sends the subagent back to work
Can add context	yes: additionalContext goes into the subagent's context before its first prompt	no
Can rewrite the result	no	no
Typical use	an audit log of spawns, or a standing instruction for every subagent	validate the result against a schema before the coordinator acts on it
To enforce instead	a PreToolUse hook on the Agent tool, which can deny or rewrite the spawn	a PostToolUse hook on the Agent tool, which acts on the returned result

Both are configured like any other hook event, in settings.json or a subagent's frontmatter:

JSON
Copy
{
  "hooks": {
    "SubagentStart": [
      { "hooks": [{ "type": "command", "command": "echo \"subagent started $(date)\" >> .claude/spawns.log" }] }
    ],
    "SubagentStop": [
      { "hooks": [{ "type": "command", "command": ".claude/hooks/validate-subagent-output.sh" }] }
    ]
  }
}


The first script only appends a line. To add context instead, print JSON with an additionalContext field. The second reads the result on stdin and exits 2 if the schema check fails, which is the one lever SubagentStop has.

Subagent-scoped hooks: Subagents can define their own hooks in their frontmatter. All hook events are supported there, including PreToolUse and PostToolUse, and they are scoped to the component's lifetime — they only intercept tool calls made by that specific subagent, not the coordinator or other subagents. This enables per-subagent policy enforcement (for example, a billing subagent might have a PreToolUse hook that blocks refunds above a threshold, while a technical support subagent has no such restriction).

Stop hook auto-conversion: When a subagent's frontmatter defines Stop hooks, these are automatically converted to SubagentStop events, because SubagentStop is the event that fires when a subagent completes. You can therefore define cleanup or validation logic in the subagent's own configuration and rely on it running at completion.

KEY CONCEPT

SubagentStart observes subagent spawning, can add context to the subagent, and cannot block it. SubagentStop gates completion by exiting with code 2, which sends the subagent back to work. Neither hook rewrites subagent output. Subagents can define hooks in their own frontmatter, scoped to their execution, and Stop hooks there auto-convert to SubagentStop.

Multi-Concern Request Handling

Customers frequently submit requests with multiple issues: "I want to return my order, update my shipping address, and ask about my loyalty points." The exam tests how agents should handle these compound requests.

The correct approach:

Decompose the request into distinct items (return, address update, loyalty inquiry).
Investigate each in parallel using shared context (the customer's account information is relevant to all three).
Synthesise a unified resolution that addresses all items in a single response.

The wrong approach is to handle them sequentially with separate conversations, or to address only the first item and forget the rest.

Structured Handoff Protocols

When an agent can't resolve an issue and must escalate to a human agent, the handoff must follow a structured protocol. The critical constraint: the human agent does NOT have access to the conversation transcript. They can't scroll through the chat history to understand the issue.

A proper handoff summary must be self-contained and include:

Customer ID — so the human agent can pull up the account.
Conversation summary — what the customer asked for and what has been attempted.
Root cause analysis — the agent's assessment of the underlying issue.
Refund amount (if applicable) — the specific financial figure, not a vague reference.
Recommended action — what the agent believes the human agent should do.

This summary is the only information the human agent receives. If it is incomplete, the human agent must ask the customer to repeat everything, creating a poor experience.

Practical Example: The 8% Failure Rate

Production data shows a customer support agent processes refunds without verifying account ownership in 8% of cases. The system prompt instructs: "Always verify the customer's identity before processing any refund." The prompt works 92% of the time but fails 8% of the time.

The 8% failure rate has already resulted in refunds processed on wrong accounts. This is a financial operation with real monetary consequences.

The fix is a programmatic prerequisite gate. Before process_refund can execute, the system checks that get_customer has returned a verified customer ID in the current session. This eliminates the 8% failure rate entirely — not by improving the prompt, but by physically preventing the incorrect execution order.

Exam Traps
EXAM TRAP

Enhanced system prompt instructions as the fix for high-stakes compliance failures

If the current prompt already instructs the correct workflow but fails 8% of the time, a stronger prompt might reduce failures to 3-4% but will never reach 0%. Financial, security, and compliance operations require programmatic enforcement for deterministic guarantees.

EXAM TRAP

Few-shot examples as sufficient for guaranteed compliance

Few-shot examples improve model behaviour but are still probabilistic. They cannot provide the 100% enforcement required for financial and compliance operations. Use programmatic prerequisite gates.

EXAM TRAP

Routing classifiers proposed to fix per-agent compliance issues

A routing classifier determines which agent handles a request. The compliance failure occurs within the agent execution sequence, not at the routing level. Classifiers handle routing, not per-agent workflow enforcement.

EXAM TRAP

Handoff summaries that omit critical fields like customer ID or recommended action

Human agents do not have access to the conversation transcript. The handoff summary must be self-contained with all required fields: customer ID, conversation summary, root cause analysis, refund amount, and recommended action.

Practice Scenario

Production data reveals that in 8% of cases, a customer support agent processes refunds without verifying account ownership, occasionally leading to refunds on wrong accounts. The system prompt clearly states 'always verify customer identity before processing refunds.' What is the most appropriate fix?

OPTION A
Add few-shot examples demonstrating the correct verification-then-refund workflow sequence
OPTION B
Implement a programmatic prerequisite gate that blocks process_refund until get_customer has returned a verified customer ID
OPTION C
Add stronger instructions to the system prompt emphasising the critical importance of verification before any refund processing
OPTION D
Implement a routing classifier that sends all refund requests to a specialised verification-first pipeline
Check Answer
Build Exercise
BUILD EXERCISE
Build a Prerequisite Gate for Financial Operations
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

Why programmatic enforcement is required for financial operations instead of prompt-based guidance
How prerequisite gates physically block tool execution until preconditions are met
The difference between the 8% prompt failure rate and 0% gate failure rate
How to implement structured handoff protocols with all required fields
How multi-concern requests should be decomposed and handled in parallel
Create a customer support agent with three tools: get_customer (returns customer ID and verification status), lookup_order (returns order details), and process_refund (processes a refund for a given amount)

WHY: These three tools create the exact scenario the exam uses for the 8% failure rate question. The workflow dependency between get_customer and process_refund is where programmatic enforcement becomes essential.

YOU SHOULD SEE: Three tool definitions with proper JSON Schema input_schema. get_customer accepts a name or email, lookup_order accepts an order ID, and process_refund accepts a customer ID and amount.

Stuck? Get a nudge
Implement a programmatic prerequisite gate that blocks process_refund from executing until get_customer has returned a verified customer ID in the current session

WHY: This is the core exam concept: prompt instructions work 92% of the time but fail 8%. A prerequisite gate provides 100% deterministic enforcement. The exam always rejects prompt-based solutions for financial operations.

YOU SHOULD SEE: A session-level state tracker that records whether get_customer has returned a verified customer. The process_refund handler checks this state before executing and returns an error if verification has not occurred.

Stuck? Get a nudge
Test that the gate works by prompting the agent to skip verification and process a refund directly — verify the gate blocks the attempt

WHY: Testing the bypass attempt demonstrates the difference between prompt-based and programmatic enforcement. Even when the model decides to skip verification, the gate blocks the action — which is the entire point of deterministic enforcement.

YOU SHOULD SEE: The agent attempts to call process_refund without prior verification. The gate returns a blocked error message. The agent then calls get_customer before retrying the refund successfully.

Stuck? Get a nudge
Implement a structured handoff protocol: when the agent cannot resolve an issue, it compiles a self-contained summary with customer ID, conversation summary, root cause analysis, refund amount, and recommended action

WHY: Human agents do NOT have access to the conversation transcript. The handoff summary is the only information they receive. The exam tests whether you include all five required fields: customer ID, summary, root cause, amount, and recommended action.

YOU SHOULD SEE: A handoff function that produces a structured object with all five fields populated. No field should be empty or contain placeholder text.

Stuck? Get a nudge
Test the handoff with a multi-concern request (return plus billing dispute plus account update) and verify the handoff summary is complete and self-contained

WHY: Multi-concern requests test whether the agent decomposes the request into distinct items and addresses all of them. The exam expects decomposition, parallel investigation, and unified resolution — not sequential handling or forgetting items.

YOU SHOULD SEE: The agent identifies all three concerns, investigates each one, and produces a handoff summary that covers all three issues with specific details for each. No concern is omitted.

Stuck? Get a nudge
Sources
Claude Agent SDK Overview — Anthropic
Hooks Reference — Anthropic (source for the subagent lifecycle section)
Building with Claude API, including the Customer Support Resolution Agent scenario (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Subagent Invocation and Context Passing
NEXT LESSON
Agent SDK Hooks