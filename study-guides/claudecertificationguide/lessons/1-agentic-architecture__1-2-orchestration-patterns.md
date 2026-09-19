# 1.2 — Multi-Agent Orchestration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-2-orchestration-patterns

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
1.2
DOMAIN 1
TASK 1.2
Mark Complete
Multi-Agent Orchestration
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Multi-agent orchestration is how you get several Claude agents working together on one complex task. The exam isn't loose about the shape this takes. It tests one pattern: hub-and-spoke, with a coordinator at the centre.

Hub-and-Spoke Architecture

The architecture has two roles:

Coordinator agent: sits at the centre. Receives the initial task, decomposes it, decides which subagents to invoke, passes context to them, aggregates their results, handles errors, and routes information between them.
Subagents: the spokes. Each one handles a specialised task (web search, document analysis, synthesis, report generation). They receive instructions from the coordinator and return results to it.

The cardinal rule: ALL communication flows through the coordinator. Subagents never communicate directly with each other. Never. Not for efficiency, not for convenience, not for any reason. Every piece of information that moves between subagents passes through the coordinator.

CURRENT STATE

This strict hub-and-spoke model is what the exam tests. In current Claude Code a sub-agent can itself spawn sub-agents (nested parent-child delegation), so the "never, for any reason" absolute is an exam simplification rather than a hard product limit. On the exam, treat direct subagent-to-subagent communication as the wrong answer.

This centralisation provides three things the exam cares about:

Observability — you can log and monitor every message in one place.
Consistent error handling — the coordinator applies uniform error recovery policies.
Controlled information flow — the coordinator decides what context each subagent receives.

KEY CONCEPT

All inter-subagent communication flows through the coordinator. Subagents never communicate directly with each other. This is the foundational architectural constraint of hub-and-spoke orchestration.

The Critical Isolation Principle

This is the single most misunderstood idea in multi-agent systems, and the exam leans on that confusion hard.

Subagents do NOT automatically inherit the coordinator's conversation history. When the coordinator spawns a subagent, that subagent starts with only what the coordinator explicitly includes in its prompt. It has no access to:

The coordinator's system prompt (unless explicitly included)
Previous messages in the coordinator's conversation
Results from other subagents (unless the coordinator passes them)
Any "shared memory" or global state

Subagents do NOT share memory between invocations. If the coordinator calls the web search subagent twice, the second invocation has no knowledge of the first. Every invocation is independent.

So the coordinator has to be deliberate about context. Every piece of information a subagent needs goes in its prompt, explicitly. If the synthesis agent needs web search results, the coordinator passes those results — the synthesis agent can't "look them up" from a shared store. There's no shared store.

EXAM TRAP

When a multi-agent system produces incomplete or incorrect output, the exam expects you to trace the failure to its origin. Do not blame the subagent that produced the output — check whether the coordinator gave it the right input.

Coordinator Responsibilities

The coordinator has four key responsibilities that the exam tests:

1. Dynamic subagent selection. The coordinator analyses query requirements and dynamically selects which subagents to invoke. It does NOT always route through the full pipeline. A simple factual question might only need the web search subagent, not the full research-analysis-synthesis chain. Routing every query through every subagent wastes time and resources.

2. Research scope partitioning. When delegating to multiple subagents, the coordinator partitions the research scope to minimise duplication. It assigns distinct subtopics or source types to each agent. For example, one agent searches academic papers while another searches news articles — they do not both search the same sources.

3. Iterative refinement loops. The coordinator evaluates synthesis output for gaps. If the synthesis is incomplete, it re-delegates to search and analysis subagents with targeted queries. It re-invokes synthesis until coverage is sufficient. This is not a single-shot process — it is an iterative cycle.

4. Centralised communication routing. All subagent communication routes through the coordinator for observability, consistent error handling, and controlled information flow.

The Narrow Decomposition Failure

This is a specific exam pattern you must recognise. The exam guide's sample set includes a question (Question 7) where a coordinator decomposes "impact of AI on creative industries" into only visual arts subtopics, missing music, writing, and film entirely.

The root cause is the coordinator's task decomposition, not any downstream agent. The web search agent searched thoroughly for what it was assigned. The synthesis agent synthesised everything it received. But the coordinator only assigned visual arts topics, so music, writing, and film were never researched.

The exam expects you to trace failures to their origin. When a multi-agent system produces a report that misses entire categories, do not blame the subagents — check the coordinator's decomposition.

This pattern applies broadly: if the output is incomplete in scope (not depth), the coordinator's decomposition is almost always the root cause.

Practical Example: Research System Coverage Gap

A multi-agent research system is tasked with "renewable energy technologies." The coordinator decomposes this into "solar panel efficiency" and "wind turbine design." Each subagent produces thorough, well-sourced research on its assigned topic.

The final report is comprehensive on solar and wind but says nothing about geothermal, tidal, biomass, or nuclear fusion. The coverage gap is not because the search was poor or the synthesis was weak — it is because the coordinator never assigned those subtopics.

The fix is not better search queries, not a more capable synthesis agent, and not more subagents. The fix is better coordinator decomposition that covers the full breadth of the topic.

Exam Traps
EXAM TRAP

Blaming downstream subagents for coverage gaps when the coordinator's task decomposition was too narrow

Subagents research what they are assigned. If the coordinator only assigns solar and wind as subtopics for renewable energy, no subagent can cover geothermal or tidal. Trace failures to their origin — the coordinator's decomposition.

EXAM TRAP

Assuming subagents share memory or inherit the coordinator's conversation history

Subagents have completely isolated context. They do not automatically inherit anything from the coordinator. Every piece of information must be explicitly passed in the subagent's prompt.

EXAM TRAP

Proposing direct inter-subagent communication as an efficiency improvement

Direct communication breaks observability, consistent error handling, and controlled information flow. All communication must flow through the coordinator, regardless of perceived efficiency gains.

EXAM TRAP

Adding more subagents to fix a decomposition problem

If the coordinator decomposes a topic too narrowly, adding more subagents does not help — they will receive equally narrow assignments. The fix is improving the coordinator's decomposition logic.

Practice Scenario

A multi-agent research system produces a report on 'renewable energy technologies' that only covers solar and wind power. Each subagent produced thorough, well-sourced coverage of its assigned topic. The web search subagent returned relevant results for every query it received. The synthesis subagent accurately combined all research it was given. What is the most likely root cause of the coverage gap?

OPTION A
The document analysis subagent had no access to sources covering the other renewable energy categories, so none of those sections were ever written
OPTION B
The synthesis subagent failed to identify gaps in the research it received and request additional coverage of the missing technology categories from the coordinator
OPTION C
The web search subagent used queries that were too narrow, so geothermal, tidal, biomass and fusion sources never appeared anywhere in its results
OPTION D
The coordinator decomposed the topic into only solar and wind subtopics, never assigning geothermal, tidal, biomass, or fusion to any subagent
Check Answer
Build Exercise
BUILD EXERCISE
Build a Hub-and-Spoke Research Coordinator
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

How hub-and-spoke architecture centralises all communication through a coordinator
Why subagent isolation means every piece of context must be explicitly passed
How to implement broad task decomposition that avoids the narrow decomposition failure
How iterative refinement loops detect and fill coverage gaps
Why tracing failures to the coordinator decomposition is the correct diagnostic approach
Create a coordinator agent that accepts a broad research topic as input

WHY: The coordinator is the central hub in hub-and-spoke architecture. The exam tests whether you understand that the coordinator owns task decomposition, subagent selection, and result aggregation — not the subagents.

YOU SHOULD SEE: A coordinator function that accepts a topic string and returns a structured research report. It should have a system prompt defining its role as the orchestrating hub.

Stuck? Get a nudge
Implement task decomposition logic that breaks the topic into at least 5 distinct subtopics covering the full breadth of the subject

WHY: Narrow decomposition is a specific exam failure pattern. The coordinator that only assigns solar and wind for renewable energy misses entire categories. The exam expects you to recognise that incomplete output traces back to the coordinator decomposition.

YOU SHOULD SEE: A decomposition function that produces 5 or more subtopics for any broad topic. For renewable energy, it should cover solar, wind, geothermal, tidal, biomass, and fusion at minimum.

Stuck? Get a nudge
Spawn two subagents (web search and document analysis) with explicit context passing — include all relevant information in each subagent prompt

WHY: Subagent isolation means no shared memory and no inherited context. The exam heavily tests this: if a subagent produces poor results, check whether the coordinator gave it sufficient context, not whether the subagent itself is flawed.

YOU SHOULD SEE: Two subagent invocations where each receives the full assigned subtopic, the research goal, and any relevant context from prior agents — all explicitly included in the prompt.

Stuck? Get a nudge
Aggregate results from both subagents and evaluate coverage completeness

WHY: The coordinator must evaluate whether the combined results cover the full breadth of the original topic. This is where iterative refinement starts — gaps detected here trigger re-delegation.

YOU SHOULD SEE: An aggregation function that combines results from both subagents and produces a coverage assessment listing which subtopics are well-covered, partially covered, or missing.

Stuck? Get a nudge
Implement an iterative refinement loop: if the coordinator identifies coverage gaps, re-delegate to subagents with targeted queries and re-invoke until coverage is sufficient

WHY: Iterative refinement is a core coordinator responsibility the exam tests. A single-shot delegation is not enough — the coordinator must evaluate output and re-delegate for gaps. This distinguishes a coordinator from a simple dispatcher.

YOU SHOULD SEE: A loop that checks coverage, identifies gaps, sends targeted follow-up queries to subagents for the missing subtopics, and re-evaluates until a coverage threshold is met or a maximum iteration count is reached.

Stuck? Get a nudge
Test with the topic renewable energy technologies and verify that the final output covers solar, wind, geothermal, tidal, biomass, and fusion

WHY: This specific test case maps to the exam narrow decomposition failure pattern. If your output only covers solar and wind, the root cause is the coordinator decomposition — the exact diagnostic the exam expects you to make.

YOU SHOULD SEE: A final research report with substantive sections on all six energy types: solar, wind, geothermal, tidal, biomass, and fusion. The coverage evaluation should show 100% completeness.

Stuck? Get a nudge
Sources
Claude Agent SDK Overview — Anthropic
Building with Claude API, including the Multi-Agent Research System scenario (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Agentic Loops
NEXT LESSON
Subagent Invocation and Context Passing