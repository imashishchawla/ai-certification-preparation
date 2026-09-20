---
title: "Glossary__domain 1"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# Glossary: Domain 1 — Agentic Architecture & Orchestration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/glossary/domain-1

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
Glossary
/
Domain 1
DOMAIN 1
27%
Glossary: Agentic Architecture & Orchestration

Quick-lookup definitions for the 27% exam domain. Each entry includes a concise definition and exam context. Follow the lesson links to dive deeper.

Agentic Loop

A control flow where Claude repeatedly receives input, decides on an action (often a tool call), observes the result, and continues until a task is complete. The loop runs until the model returns a stop_reason of end_turn rather than tool_use.

Exam context: Questions test whether you understand the loop termination conditions and how stop_reason values determine whether the loop continues or exits.

See also: 1.1 Agentic Loops

stop_reason

A field in the Claude API response that indicates why the model stopped generating. The exam's two key values are end_turn (the model finished its response naturally) and tool_use (the model wants to call a tool). In an agentic loop, tool_use means the loop should continue; end_turn means the task is complete. A production loop must also handle pause_turn, max_tokens, stop_sequence, refusal, and model_context_window_exceeded.

Exam context: This is a frequently tested concept. Key the exam answers on end_turn vs tool_use, and know what each value signals to the orchestration layer.

See also: 1.1 Agentic Loops

tool_use

A stop_reason value indicating that Claude wants to invoke a tool. The response will contain a tool_use content block specifying the tool name and input parameters. The orchestrator must execute the tool and return the result as a tool_result message before the next API call.

Exam context: Understand the full tool-use flow: Claude returns tool_use, the orchestrator executes, and sends back tool_result. Know what happens if the tool result is malformed or missing.

See also: 1.1 Agentic Loops

end_turn

A stop_reason value indicating that Claude has finished its response and does not need to call any more tools. In an agentic loop, this is the signal to exit the loop and return the final response to the user.

Exam context: The exam may present scenarios where you must determine whether to continue looping or terminate. end_turn is always the termination signal.

See also: 1.1 Agentic Loops

Orchestration Pattern

A design approach for coordinating one or more Claude calls to accomplish a task. The patterns the guide names are prompt chaining (fixed sequential steps), dynamic adaptive decomposition (the model decides the split at runtime), and hub-and-spoke coordination. Parallel execution of independent subtasks is the other common shape.

Exam context: You must match each orchestration pattern to the correct use case. Know when prompt chaining is preferable to a single monolithic prompt, and when parallel execution provides a genuine benefit.

See also: 1.2 Multi-Agent Orchestration

Multi-Agent System

An architecture where multiple specialised agents collaborate to complete a task. Each agent has its own system prompt, tools, and responsibilities. The tested topology is hub-and-spoke: a coordinator delegates to subagents and all inter-agent communication flows through it. Subagents never communicate directly with each other — options proposing direct peer-to-peer communication are exam distractors, because they break observability, consistent error handling, and controlled information flow.

Exam context: Know the trade-offs between single-agent and multi-agent designs. The exam tests whether you can identify when a multi-agent system is justified versus when a simpler pattern suffices.

See also: 1.2 Multi-Agent Orchestration

Coordinator

The central agent in a hub-and-spoke system. It decomposes the task, spawns and sequences subagents, and aggregates their results. It is the only component with a view of the whole job, and every message between subagents passes through it.

Exam context: Scenarios often fail because the coordinator is doing specialist work itself, or because subagents are talking to each other. Both are distractors — the coordinator delegates and aggregates, and it is the sole communication hub.

See also: 1.2 Multi-Agent Orchestration

Subagent

A separate Claude instance spawned by a coordinator to handle a scoped piece of work. It runs in its own context window with its own system prompt and its own tool list, and it returns a result to the coordinator when it finishes.

Exam context: The single most-tested property is isolation — a subagent cannot see the coordinator's conversation. Everything it needs must be passed explicitly in the task definition.

See also: 1.3 Subagent Invocation and Context Passing

Task Tool (Agent)

The tool a coordinator calls to delegate work to a subagent. The exam guide names it Task. Current Claude Code renamed it to Agent. Both names refer to the same delegation mechanism.

Exam context: Answer with the guide's Task naming on keyed items. Recognise Agent if you meet it in current documentation or tooling.

See also: 1.3 Subagent Invocation and Context Passing

AgentDefinition

The declaration of a subagent: its description, its instructions, and the tools field that scopes which tools it can reach. Note that the instruction field is named prompt, not systemPrompt — a common wrong answer.

Exam context: Know the field names and know that tools scopes access. Scope each agent to a small, role-focused set. The guide's illustration contrasts 4–5 tools with 18, where selection reliability degrades on decision complexity alone.

See also: 1.3 Subagent Invocation and Context Passing

allowedTools

The list of tools a given agent is permitted to call. For a coordinator this is a gate on delegation itself: unless allowedTools includes "Task" (or "Agent", its current name), the coordinator cannot spawn subagents at all, no matter how its prompt is written.

Exam context: A frequently tested failure mode — a coordinator that "will not delegate" usually has an allowedTools list missing the delegation tool, not a prompt problem.

See also: 1.3 Subagent Invocation and Context Passing

fork_session

An option that branches a session so an agent can explore an alternative path without polluting the original context. Exposed as fork_session / forkSession in the SDK and --fork-session on the CLI. It is set beside resume: resume names the session, fork_session branches from it instead of appending.

Exam context: The answer when a scenario needs divergent exploration — trying several approaches — while keeping the main line of work clean.

See also: 1.7 Session State and Resumption

Programmatic Enforcement

Enforcing a workflow rule in code — a hook, a gate, or a check — rather than by instruction in a system prompt. Prompt guidance is probabilistic and carries a non-zero failure rate. Programmatic enforcement is deterministic.

Exam context: The decision rule the exam applies repeatedly: if a single failure means financial loss, a security breach, or a compliance violation, the answer is programmatic enforcement. Stronger prompts and few-shot examples are always distractors in those scenarios.

See also: 1.4 Workflow Enforcement and Handoff

Prerequisite Gate

A code-level check that blocks a tool from executing until a prior condition is satisfied — for example, refusing process_refund until get_customer has returned a verified customer ID in the current session.

Exam context: The canonical fix for a "the prompt says to verify but it skips it 8% of the time" scenario. The gate takes the failure rate to zero because the model cannot route around it.

See also: 1.4 Workflow Enforcement and Handoff

Structured Handoff

The self-contained summary an agent compiles when escalating to a human who does not have the conversation transcript. It must carry customer ID, a factual summary, root cause, any monetary amount, and a recommended action.

Exam context: The tested constraint is that the human sees nothing but this summary. Options that omit a required field, or that assume the human can read the chat history, are wrong. Note that "handoff" in this guide means escalation to a person — there is no agent-to-agent handoff primitive in the Agent SDK.

See also: 1.4 Workflow Enforcement and Handoff

PreToolUse

An Agent SDK hook event that fires before a tool executes. Because it runs first, it can deny the call or rewrite its parameters, which makes it the mechanism for blocking dangerous operations and validating inputs.

Exam context: The answer whenever a scenario demands that something "must never" happen. Pair it with PostToolUse: Pre gates the call, Post handles the result.

See also: 1.5 Agent SDK Hooks

PostToolUse

An Agent SDK hook event that fires after a tool call succeeds. It is the place for normalising or validating tool output, redacting sensitive values, and audit logging.

Exam context: Tool-result problems — inconsistent formats across data sources, credit-card numbers arriving in results — are PostToolUse work, not prompt work.

See also: 1.5 Agent SDK Hooks

Prompt Chaining

A fixed sequential decomposition: the task is split at design time into an ordered series of steps, and each step receives the previous step's output.

Exam context: The right choice when the structure of the work is known in advance and stable. Contrast with dynamic adaptive decomposition, which is the answer when it is not.

See also: 1.6 Task Decomposition Strategies

Dynamic Adaptive Decomposition

Letting the model decide at runtime how to break a task up, rather than fixing the steps in advance.

Exam context: Signalled by stems that describe unpredictable, open-ended or exploratory work — "the structure is not known upfront". Where the steps are predictable, prompt chaining is the better answer.

See also: 1.6 Task Decomposition Strategies

Attention Dilution

The degradation that occurs when a single agent is asked to hold too many concerns at once: as instructions and tools accumulate, quality drops across all of them rather than on any one.

Exam context: The reason decomposition and role-scoped subagents beat one large do-everything agent. Recognise it as the underlying cause when a stem describes an agent that has become unreliable after scope was added.

See also: 1.6 Task Decomposition Strategies

Session Resumption

Continuing a previous session rather than starting fresh, so accumulated state is preserved. Resume by name or by ID. A name can be set at session start with -n / --name.

Exam context: The answer when a scenario needs continuity across invocations. Contrast with a deliberate fresh start, which is what you want when the existing context has gone stale.

See also: 1.7 Session State and Resumption

Stale Context

A session whose accumulated history has started to work against it — the model repeats itself, contradicts its earlier statements, or ignores recent tool results.

Exam context: The counter-intuitive fix is the tested one: not more context, but a fresh session seeded with a curated summary of the facts that still matter.

See also: 1.7 Session State and Resumption

Error Recovery

Strategies for handling failures within an agentic loop without crashing the entire workflow. Common approaches include retry with error feedback, fallback to a simpler strategy, graceful degradation (returning partial results), and escalation to a human operator.

Exam context: The exam tests whether you can design resilient agentic systems. Know when to retry versus when to fail gracefully, and how to prevent infinite retry loops.

See also: 1.4 Workflow Enforcement and Handoff

Claude Agent SDK

Anthropic's official framework (Python and TypeScript) for building agentic applications. It provides agent definitions with tool management, hooks, and subagent spawning, and handles the agentic loop internally so developers focus on configuring agent behaviour rather than writing loop logic.

Exam context: Know the AgentDefinition shape, the Task tool gate for spawning subagents, and the SDK hooks tested in 1.5.

See also: 1.3 Subagent Invocation and Context Passing

Routing Pattern

An approach where a classification step decides which specialised handler processes a request.

Exam context: Treat this as a trap term in Domain 1. A routing classifier decides which agent receives a request. It does nothing about how that agent then behaves. The guide's Domain 1 sample questions key it wrong twice, because the failures described happen inside an agent's execution, where the fix is a prerequisite gate or a hook. Routing is also the wrong remedy for a bloated tool set — splitting into role-scoped agents is the keyed answer there.

See also: 1.4 Workflow Enforcement and Handoff

Guardrail

A safety mechanism that constrains Claude's behaviour within acceptable boundaries, whether by validating input, validating output, or restricting tool access.

Exam context: Guardrails are no longer a standalone Domain 1 task statement. The tested forms are deterministic enforcement via workflow prerequisites and handoff gates (1.4) and Agent SDK hooks such as PreToolUse interception (1.5).

See also: 1.4 Workflow Enforcement and Handoff

Human-in-the-Loop

A design pattern where certain agent actions require explicit human approval before execution, typically for high-impact operations.

Exam context: Human-in-the-loop is no longer a standalone Domain 1 task statement. Approval gates are tested as workflow enforcement patterns (1.4), and escalation to humans is tested in Domain 5.2 (escalation and ambiguity resolution).

See also: 1.4 Workflow Enforcement and Handoff

Next
Domain 2: Tool Design & MCP Integration