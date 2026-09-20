---
title: "3 Claude Code Config__3 4 Plan Mode Execution"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 3.4 — Plan Mode vs Direct Execution | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/3-claude-code-config/3-4-plan-mode-execution

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
3.1
CLAUDE.md Hierarchy, Scoping, and Modular Organisation
3.2
Custom Slash Commands and Skills
3.3
Path-Specific Rules for Conditional Convention Loading
3.4
Plan Mode vs Direct Execution
3.5
Iterative Refinement Techniques
3.6
CI/CD Integration
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
CLAUDE CODE CONFIGURATION & WORKFLOWS
/
3.4
DOMAIN 3
TASK 3.4
Mark Complete
Plan Mode vs Direct Execution
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Claude Code works in two main modes: plan mode and direct execution. The exam tests whether you can pick the right one for a given task. It's not a matter of taste — there are clear criteria for when each mode fits.

Plan Mode: When to Use It

Plan mode is for complex tasks where you need to explore the codebase, evaluate multiple approaches, and design a strategy before making changes. Use plan mode when:

Large-scale changes are involved. Restructuring a monolith into microservices, reorganising a module system, or refactoring a core abstraction all require understanding the existing structure before changing it.
Multiple valid approaches exist. When there are different ways to solve the problem (e.g., different integration architectures with different infrastructure requirements), you need to evaluate them before committing.
Architectural decisions are required. Service boundaries, module dependencies, API contracts — these decisions have downstream consequences. Planning prevents costly rework.
Multi-file modifications are needed. A library migration affecting 45+ files requires a consistent strategy. Without a plan, you risk applying the migration inconsistently across files.
Codebase exploration is necessary. When you need to understand dependencies, trace data flows, or map the existing structure before changing anything.

Plan mode enables safe exploration and design. Claude reads the codebase, analyses dependencies, and proposes an approach — all without modifying any files.

You switch into it rather than ask for it. Three routes: start the session with claude --permission-mode plan, press Shift+Tab during a session until the status bar shows plan mode on, or prefix a single prompt with /plan. Claude then reads and proposes but writes nothing to disk until you approve the plan. Writing "in plan mode" into the body of a prompt does nothing; /plan at the start of it does.

Direct Execution: When to Use It

Direct execution is for well-understood changes with clear, limited scope. Use direct execution when:

The change is well-scoped. A single-file bug fix with a clear stack trace. Adding a date validation conditional. Updating a configuration value.
The correct approach is already known. You know what needs to change, where, and how. There is no design decision to make.
The scope is limited. One function, one file, one clear modification.

Direct execution skips the planning phase and makes changes straight away. For simple, well-defined tasks, planning adds nothing.

KEY CONCEPT

The decision is not about difficulty but about ambiguity. A difficult but well-defined bug fix (clear stack trace, single function, known cause) is direct execution. A seemingly simple feature request that could be implemented three different ways and affects multiple modules is plan mode.

The Explore Subagent

The Explore subagent keeps verbose discovery output out of the main conversation. On multi-phase tasks, exploring the codebase throws off a lot: file listings, dependency graphs, code excerpts, analysis notes. Let all that flow into the main conversation and it fills the context window, which drags down the quality of later responses.

The Explore subagent:

Runs the exploration in isolation
Produces summaries of its findings
Returns those summaries to the main conversation
Keeps the main context window clean for the actual implementation work

Use the Explore subagent during multi-phase tasks where the discovery phase is verbose but the implementation phase needs focused context.

The Hybrid Approach: Plan Then Execute

The combination of plan mode for investigation and direct execution for implementation is common in practice and tested on the exam. The pattern:

Plan phase: Use plan mode to explore the codebase, understand dependencies, evaluate approaches, and design the implementation strategy.
Execute phase: Switch to direct execution to implement the planned approach, file by file, with the strategy already decided.

For example, migrating from one logging library to another across 30 files:

Plan: Identify all files importing the old library, map the API differences between old and new, design the migration pattern, check for edge cases.
Execute: Apply the migration pattern to each file using the planned approach.

It's plan THEN direct, not plan OR direct. The exam expects you to spot the pattern.

Decision Framework Summary
Task characteristics	Mode
Architectural restructuring	Plan mode
Library migration (many files)	Plan mode (then direct execution)
Multiple valid implementation approaches	Plan mode
Codebase exploration needed	Plan mode (with Explore subagent)
Single-file bug fix with clear stack trace	Direct execution
Adding a validation check to one function	Direct execution
Configuration value update	Direct execution
Known fix, known location, known approach	Direct execution
Recognising Complexity Upfront

A common exam trap: starting in direct execution and switching to plan mode only once complexity shows up. When the requirements already say the task is complex (e.g., "restructure the monolith into microservices"), reach for plan mode straight away. The complexity isn't going to emerge later — it's right there in the task description. Waiting for surprises is the wrong move.

Exam Traps
EXAM TRAP

Defaulting to direct execution for multi-file architectural changes

Multi-file modifications with multiple valid approaches require plan mode. Direct execution risks costly rework when dependencies are discovered late. If the task involves architectural decisions or affects many files, plan first.

EXAM TRAP

Using plan mode for a single-file bug fix with a clear stack trace

A single-function fix with a known cause and clear stack trace is the textbook case for direct execution. Plan mode adds unnecessary overhead when the problem, location, and solution are all clear.

EXAM TRAP

Not recognising the plan-then-execute hybrid pattern

The exam tests whether you know to combine plan mode for investigation with direct execution for implementation. This is the correct approach for tasks like library migrations: plan the strategy, then execute it.

EXAM TRAP

Starting direct execution and switching to plan mode only when complexity emerges

When complexity is already stated in the requirements (e.g., monolith restructuring), plan mode should be chosen upfront. The complexity is known, not speculative. Do not wait for surprises.

Practice Scenario

Your team faces three tasks: (1) restructure a monolith into microservices, (2) fix a null pointer exception in a single function with a clear stack trace, (3) migrate from one logging library to another across 30 files. Which mode should be used for each?

OPTION A
Plan mode for (1) and (3), and direct execution for (2)
OPTION B
Plan mode for all three, since they all involve code changes
OPTION C
Direct execution for all three with comprehensive upfront instructions
OPTION D
Plan mode only for (1), direct execution otherwise
Check Answer
Build Exercise
BUILD EXERCISE
Practice Plan Mode vs Direct Execution Decision-Making
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Apply the decision framework for choosing plan mode vs direct execution based on task ambiguity
Execute the hybrid plan-then-execute pattern for multi-file migrations
Use the Explore subagent to isolate verbose discovery output from the main conversation
Recognise complexity upfront rather than waiting for it to emerge
Distinguish task difficulty from task ambiguity when selecting execution mode
Identify a complex multi-file task in a codebase (refactoring, migration, or restructuring) and use plan mode to explore dependencies and design an approach

WHY: Plan mode is for tasks with multiple valid approaches, architectural decisions, or multi-file modifications. The exam tests whether you choose plan mode upfront when complexity is stated in the requirements rather than waiting for surprises.

YOU SHOULD SEE: Claude Code explores the codebase without modifying any files. The output includes: identified dependencies between modules, multiple possible approaches with tradeoffs, and a recommended implementation strategy. No files are changed during the planning phase.

Stuck? Get a nudge
Identify a simple single-file bug and use direct execution to fix it — observe the efficiency gain over planning

WHY: Direct execution is correct when the problem, location, and solution are all clear. The exam tests that you do not over-plan well-understood changes. The decision is about ambiguity, not difficulty.

YOU SHOULD SEE: Claude Code makes the fix immediately without a planning phase. The change is confined to a single file or function. The total time from prompt to fix is noticeably shorter than the plan mode task above.

Stuck? Get a nudge
Use the hybrid approach: plan mode to design a migration strategy for a library change across multiple files, then switch to direct execution to implement the plan

WHY: The plan-then-execute hybrid is a specific pattern tested on the exam. Plan mode designs the strategy; direct execution applies it consistently. This is the correct approach for tasks like library migrations affecting many files.

YOU SHOULD SEE: Phase 1 (plan): Claude identifies all files importing the old library, maps API differences, and produces a migration pattern. Phase 2 (execute): Claude applies the migration pattern file by file using the planned approach. The implementation is consistent across all files.

Stuck? Get a nudge
Use the Explore subagent for a verbose codebase discovery task and observe how it keeps the main conversation context clean

WHY: The Explore subagent isolates verbose discovery output so the main conversation context stays focused. Without isolation, extensive file listings and analysis fill the context window and degrade subsequent responses.

YOU SHOULD SEE: The Explore subagent runs the discovery task and returns a concise summary to the main conversation. The full verbose output (file listings, dependency graphs, code excerpts) is not visible in the main conversation. Subsequent responses in the main conversation remain high quality.

Stuck? Get a nudge
Create a written decision framework: list your criteria for choosing plan mode vs direct execution, with examples for each

WHY: Internalising the decision criteria is essential for the exam. The framework should cover the key distinction: ambiguity determines the mode, not difficulty. A difficult but well-defined fix is direct execution; a simple-sounding feature with multiple approaches is plan mode.

YOU SHOULD SEE: A clear decision framework with at least four criteria for plan mode and three for direct execution. Each criterion has a concrete example. The framework explicitly addresses the ambiguity-vs-difficulty distinction.

Stuck? Get a nudge
Sources
Claude Code Plan Mode Documentation — Anthropic
Claude Code Permission Modes — Plan mode — Anthropic
Claude Certified Architect Foundations Exam Guide — Task Statement 3.4 — Anthropic
Claude Certified Architect Foundations Exam Guide — Sample Question 5 — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Path-Specific Rules for Conditional Convention Loading
NEXT LESSON
Iterative Refinement Techniques