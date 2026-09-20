---
title: "5 Context Management__5 4 Codebase Exploration"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 5.4 — Codebase Exploration & Context Degradation | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/5-context-management/5-4-codebase-exploration

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
5.1
Context Window Management
5.2
Escalation & Ambiguity Resolution
5.3
Error Propagation in Multi-Agent Systems
5.4
Codebase Exploration & Context Degradation
5.5
Human Review & Confidence Calibration
5.6
Information Provenance & Multi-Source Synthesis

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
CONTEXT MANAGEMENT & RELIABILITY
/
5.4
DOMAIN 5
TASK 5.4
Mark Complete
Codebase Exploration & Context Degradation
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Large codebase exploration is one of the most context-intensive tasks a Claude-based agent performs. Whether an agent is exploring an unfamiliar repository, tracing dependency chains, or understanding legacy systems, extended sessions create a specific failure mode: context degradation. It has nothing to do with running out of tokens. The model simply loses its grip on earlier findings as the context fills with verbose discovery output.

Context Degradation

Context degradation manifests as a specific, observable behaviour: the model starts referencing "typical patterns" instead of the specific classes, methods, and dependency chains it discovered earlier in the session. After investigating several modules, the agent might say "this follows the typical repository pattern" instead of "the OrderRepository class at src/repos/order.ts implements the base Repository<T> interface with custom caching in the findById method."

This happens because:

Each exploration step generates verbose output (file contents, search results, directory listings).
This output accumulates in the conversation context.
Earlier, precise discoveries are pushed further into the context while more recent verbose output dominates.
The model's attention shifts to recent output and it loses specific references to earlier findings.

The critical insight: context degradation is not a token limit problem. Increasing the context window doesn't fix it. The model isn't running out of space. It's losing track of specific details as they get buried under newer, more verbose output.

Scratchpad Files

The primary mitigation for context degradation is scratchpad files. The agent writes key findings to a file and references it for subsequent questions. This persists knowledge outside the conversation context, making it immune to context degradation.

MARKDOWN
Copy
# Exploration Scratchpad — Order Service

## Key Classes
- `OrderRepository` (src/repos/order.ts) — implements Repository<T>, custom findById caching
- `OrderService` (src/services/order.ts) — orchestrates OrderRepository + PaymentGateway
- `RefundProcessor` (src/services/refund.ts) — depends on OrderService.getOrderWithItems()

## Dependency Chain
RefundProcessor → OrderService → OrderRepository → PostgreSQL
RefundProcessor → PaymentGateway → Stripe API

## Critical Findings
- RefundProcessor has no retry logic for Stripe API failures
- OrderRepository caches by orderId but cache invalidation on status change is missing
- Test coverage: OrderService has 87% coverage, RefundProcessor has 12%


When the agent needs to reference earlier discoveries, it reads the scratchpad file instead of relying on conversation context. Treat this as a deliberate strategy from the outset, not a rescue move once things degrade — agents should be instructed to maintain scratchpad files from the start of any extended exploration session.

Subagent Delegation

Spawning subagents for specific investigation tasks is the second major mitigation strategy. Instead of the main agent doing all exploration directly (filling its context with verbose output from every file read and search), delegate specific questions to subagents:

"Find all test files for the order service and report their coverage status"
"Trace the refund flow from API endpoint to database and list all intermediate services"
"Identify all external API integrations and their error handling patterns"

Each subagent operates with its own isolated context. It can explore verbosely without polluting the main agent's context. It returns a structured summary to the coordinator, which keeps only the key findings.

Parallelisation is the obvious read; the real value is context isolation. The main agent's context stays clean for high-level coordination while subagents handle the verbose exploration.

Summary Injection Between Phases

When exploration happens in phases (Phase 1: understand the architecture, Phase 2: investigate specific components), summarise key findings from Phase 1 before spawning Phase 2 subagents. Inject these summaries into the initial context of Phase 2 subagents.

This prevents the "cold start" problem where Phase 2 subagents duplicate Phase 1 exploration because they were not given the previous findings. It also ensures that Phase 2 agents have the architectural understanding needed to ask the right questions.

Copy
Phase 1 Summary (injected into Phase 2 subagent prompts):
- The system follows a layered architecture: Controllers → Services → Repositories → Database
- The refund flow passes through: RefundController → RefundProcessor → OrderService → PaymentGateway
- Key concern: RefundProcessor has no retry logic for external API failures
- Phase 2 objective: Investigate error handling in RefundProcessor and PaymentGateway

The /compact Command

Claude Code provides a /compact command specifically for reducing context usage during extended sessions. When context fills with verbose discovery output — file contents, search results, directory listings — /compact summarises the conversation to free up space while preserving key information.

Use /compact proactively during extended exploration sessions, not just when you hit context limits. It's there to protect context quality, not only quantity.

Crash Recovery via Structured State Manifests

Extended exploration sessions can fail due to session crashes, network interruptions, or context exhaustion. Without recovery mechanisms, all exploration progress is lost.

The fix is structured state persistence. Each agent exports its current state to a known file location (a manifest). This manifest includes:

What has been explored (files read, searches performed)
Key findings discovered so far
Current phase and next steps
Any pending questions or unresolved issues
JSON
Copy
{
  "sessionId": "explore-order-service-001",
  "phase": 2,
  "exploredPaths": [
    "src/repos/order.ts",
    "src/services/order.ts",
    "src/services/refund.ts"
  ],
  "keyFindings": {
    "architecture": "Layered: Controllers → Services → Repositories → DB",
    "criticalIssue": "RefundProcessor has no retry logic for Stripe API failures",
    "testCoverage": {"OrderService": "87%", "RefundProcessor": "12%"}
  },
  "nextSteps": [
    "Investigate PaymentGateway error handling",
    "Review RefundProcessor test files",
    "Check cache invalidation logic in OrderRepository"
  ]
}


On resume, the coordinator loads this manifest and injects it into agent prompts. The agent picks up where it left off without repeating earlier exploration.

KEY CONCEPT

Context degradation is not a token limit problem — it is the model losing grip on specific findings as verbose output accumulates. Scratchpad files persist key discoveries outside the context. Subagent delegation isolates verbose exploration. Crash recovery manifests prevent progress loss across sessions.

Exam Traps
EXAM TRAP

Increasing the context window to solve context degradation

Context degradation is not about running out of tokens. It is about the model losing track of specific details as verbose output accumulates. A larger window still fills with verbose output.

EXAM TRAP

Assuming subagent delegation is only about parallelisation

The primary benefit of subagent delegation for codebase exploration is context isolation — keeping the main agent's context clean while subagents handle verbose exploration.

EXAM TRAP

Restarting a session to fix context degradation without saving state

Restarting loses all accumulated knowledge. Use scratchpad files and state manifests to persist findings before restarting, then inject them into the new session.

EXAM TRAP

Using /compact only when hitting context limits

/compact should be used proactively during extended sessions to maintain context quality, not just as a last resort when context is exhausted.

Practice Scenario

A developer productivity agent is exploring an unfamiliar codebase. After investigating several modules, it starts referencing 'typical repository patterns' instead of the specific class names and dependency chains it discovered earlier. What is the most effective mitigation?

OPTION A
Increase the model context window so that far more of the discovery output can be retained throughout the whole exploration
OPTION B
Have the agent maintain scratchpad files recording key findings and reference them for subsequent questions
OPTION C
Restart the session with a fresh context and ask the agent to explore the codebase more efficiently this time
OPTION D
Pre-load the entire codebase structure into the initial context so exploration has less to rediscover
Check Answer
Build Exercise
BUILD EXERCISE
Build a Context-Resilient Codebase Explorer
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

Recognise context degradation as an attention quality problem, not a token limit problem
Implement scratchpad files to persist key findings outside the conversation context
Use subagent delegation for context isolation, not just parallelisation
Design crash recovery via structured state manifests for session resilience
Apply summary injection between exploration phases to prevent cold start duplication
Create a coordinator agent that delegates specific codebase exploration tasks to subagents (e.g., find test files, trace dependency chains, identify external integrations)

WHY: Subagent delegation is primarily about context isolation, not parallelisation. The main agent context stays clean for high-level coordination while subagents handle verbose exploration. This directly prevents context degradation by keeping verbose file contents and search results out of the coordinator context.

YOU SHOULD SEE: A coordinator function that spawns subagents with specific, focused investigation prompts. Each subagent returns a structured summary (key findings, file paths, class names) rather than raw verbose output. The coordinator context should remain clean.

Stuck? Get a nudge
Implement scratchpad file management: agents write key findings (class names, file paths, dependency chains) to a known file and read it before subsequent exploration steps

WHY: Scratchpad files are the primary mitigation for context degradation. They persist knowledge outside the conversation context, making it immune to the attention shift that causes the model to reference typical patterns instead of specific class names and file paths it discovered earlier.

YOU SHOULD SEE: An agent that writes structured findings to a scratchpad file after each exploration step and reads the scratchpad at the start of each subsequent step. The scratchpad should contain specific class names, file paths, and dependency chains, not summaries.

Stuck? Get a nudge
Build summary injection logic: after Phase 1 exploration, summarise findings and inject the summary into Phase 2 subagent prompts

WHY: Summary injection prevents the cold start problem where Phase 2 subagents duplicate Phase 1 exploration because they were not given previous findings. It ensures Phase 2 agents have the architectural understanding needed to ask the right questions without rediscovering the system structure.

YOU SHOULD SEE: A Phase 1 summary document that captures the high-level architecture, key concerns, and specific investigation targets for Phase 2. This summary is injected into the initial prompt of every Phase 2 subagent.

Stuck? Get a nudge
Implement crash recovery: each agent exports structured state (explored paths, key findings, next steps) to a manifest file that the coordinator loads on resume

WHY: Extended exploration sessions can fail from crashes, network interruptions, or context exhaustion. Without recovery mechanisms, all progress is lost. Structured state manifests enable the coordinator to resume from the last checkpoint rather than restarting from scratch.

YOU SHOULD SEE: A manifest file in JSON format containing the session ID, current phase, explored paths, key findings, and next steps. On resume, the coordinator loads this manifest and injects it into agent prompts so exploration continues from where it left off.

Stuck? Get a nudge
Test context degradation by running an extended exploration session across multiple modules and verify that scratchpad files preserve specific class names and file paths that would otherwise degrade to generic descriptions

WHY: This validates that the scratchpad mitigation actually works against context degradation. The observable symptom is the model referencing typical patterns instead of specific classes and paths. You need to confirm that scratchpad files prevent this degradation.

YOU SHOULD SEE: Two comparison runs: one without scratchpad files where the agent degrades to generic references after exploring 4-5 modules, and one with scratchpad files where the agent maintains specific class names and file paths throughout the entire session.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.4 — Anthropic
Claude Code Documentation — Context Management — Anthropic
Claude Code Documentation — Commands — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Error Propagation in Multi-Agent Systems
NEXT LESSON
Human Review & Confidence Calibration