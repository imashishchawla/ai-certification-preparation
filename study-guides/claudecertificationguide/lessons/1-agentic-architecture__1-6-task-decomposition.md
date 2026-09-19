# 1.6 — Task Decomposition Strategies | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-6-task-decomposition

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
1.6
DOMAIN 1
TASK 1.6
Mark Complete
Task Decomposition Strategies
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Task decomposition is how you break complex work into pieces an agentic system can actually handle. The exam tests two patterns and expects you to pick the right one for the task in front of you. Pick wrong and the work suffers in predictable ways. It also tests one specific failure mode — attention dilution — that shows up when decomposition is too shallow.

Pattern 1: Fixed Sequential Pipelines (Prompt Chaining)

Fixed sequential pipelines break work into predetermined steps that execute in order. Each step takes the output of the previous step as input.

How it works: The workflow is defined in advance. Step 1 runs, its output feeds into Step 2, Step 2's output feeds into Step 3, and so on. The sequence does not change based on intermediate results.

Example — Code review pipeline:

For each file, run a local analysis pass (style, bugs, complexity).
After all local passes, run a cross-file integration pass (data flow, API consistency, import chains).
Compile results into a unified review report.

Best for: Predictable, structured tasks where the steps are known in advance. Code reviews, document processing, data extraction pipelines, and compliance checks all fit this pattern.

Advantages: Consistent and reliable. The same input always follows the same path. Easy to debug — you know exactly which step produced which output. Easy to monitor — you can log the output of each step.

Limitations: Cannot adapt to unexpected findings. If Step 2 discovers something that should change the approach for Step 3, the pipeline can't adjust. The steps are fixed regardless of what turns up along the way.

KEY CONCEPT

Fixed sequential pipelines (prompt chaining) are best for predictable, structured tasks. They provide consistency and reliability but cannot adapt to unexpected findings during execution.

Pattern 2: Dynamic Adaptive Decomposition

Dynamic adaptive decomposition generates subtasks based on what is discovered at each step. The plan evolves as the agent learns more about the problem.

How it works: The agent starts with a high-level goal, performs initial investigation, and generates a plan based on what it finds. As it executes the plan, it discovers new information that may change the remaining steps. The agent adapts the plan accordingly.

Example — Adding tests to a legacy codebase:

Map the codebase structure (directories, modules, dependencies).
Identify high-impact areas (most-used modules, modules with the most bugs, untested critical paths).
Create a prioritised test plan based on the mapping.
Start writing tests. Discover that Module A depends on Module B, which has no tests.
Reprioritise: test Module B first so Module A's tests can rely on it.
Continue adapting as new dependencies and issues emerge.

Best for: Open-ended investigation tasks where the full scope is not known at the start. Legacy system exploration, security audits, research projects, and debugging unfamiliar codebases all benefit from this pattern.

Advantages: Adapts to the problem. Can discover and respond to unexpected complexity. Produces more thorough results for open-ended tasks because it does not force-fit a predetermined plan.

Limitations: Less predictable. Execution time varies depending on what is discovered. Harder to estimate completion time or resource usage. More difficult to debug when things go wrong.

Selecting the Right Pattern

The exam tests your ability to match the pattern to the task:

Task Characteristics	Pattern	Reasoning
Steps known in advance, structured input	Fixed pipeline	Consistency and reliability outweigh adaptability
Open-ended, unknown scope	Dynamic decomposition	Adaptability is essential when the problem is not fully defined
Multi-file code review	Fixed pipeline	Per-file analysis + cross-file integration is predictable
Legacy codebase exploration	Dynamic decomposition	Dependencies and issues emerge during investigation
Document extraction	Fixed pipeline	Fields and format are predetermined
Debugging an unfamiliar system	Dynamic decomposition	Root cause is unknown; investigation must adapt

EXAM TRAP

The exam may present a fixed pipeline as the solution for an open-ended investigation task, or dynamic decomposition for a structured processing task. Match the pattern to the task characteristics, not to what sounds more sophisticated.

The Attention Dilution Problem

Attention dilution is a specific failure mode that occurs when an agent processes too many items in a single pass. The result is inconsistent depth — the agent produces thorough analysis for some items and misses obvious issues in others.

The telltale symptoms:

Detailed feedback for the first few files, increasingly shallow analysis for later files.
A pattern flagged as problematic in one file while identical code is approved in another file.
Obvious bugs missed in some files while minor style issues are caught in others.

Why it happens: The model allocates attention across all items in the context. When there are too many items, attention per item decreases. Early items get disproportionate attention; later items get skimmed.

The fix: Multi-pass architecture. Split the work into two layers:

Per-item local analysis passes: analyse each file (or document, or module) individually in its own pass. Each pass has the full attention budget focused on a single item.
Cross-item integration pass: after all local passes complete, run a separate pass that looks across all items for cross-cutting concerns (data flow issues, inconsistent pattern usage, cross-file dependencies).

The per-item passes catch local issues consistently because each item gets dedicated attention. The integration pass catches cross-item issues because it focuses specifically on relationships between items rather than trying to do everything at once.

Practical Example: The 14-File Code Review

A code review agent processes 14 files in a single pass. The results:

Files 1-5: detailed feedback with specific line references, bug identification, and improvement suggestions.
Files 6-9: moderate feedback with some issues identified but less thorough analysis.
Files 10-14: superficial feedback that misses obvious null pointer bugs and SQL injection vulnerabilities.
A forEach loop flagged as inefficient in File 3, while identical code in File 11 receives no comment.

This is attention dilution. The fix is not a better model, a larger context window, or a more detailed prompt. The fix is structural: split into 14 per-file analysis passes (each focused on one file) plus a cross-file integration pass (checking for data flow issues and pattern consistency across all files).

The multi-pass approach catches the null pointer bugs in Files 10-14 (because each file gets its own dedicated pass) and identifies the inconsistent forEach evaluation (because the integration pass specifically checks for cross-file pattern consistency).

Exam Traps
EXAM TRAP

Suggesting a more powerful model or larger context window as the fix for attention dilution

Attention dilution is an architectural problem, not a model capability problem. Processing too many items in a single pass produces inconsistent depth regardless of model power or context size. The fix is multi-pass architecture.

EXAM TRAP

Proposing a single-pass review with better prompts as equivalent to multi-pass architecture

Better prompts improve average quality but do not solve the fundamental attention allocation problem. Multi-pass architecture ensures each item receives dedicated attention, which a single-pass approach cannot guarantee.

EXAM TRAP

Applying fixed pipelines to open-ended investigation tasks

Open-ended tasks require adaptability. Fixed pipelines cannot respond to unexpected findings. Dynamic adaptive decomposition is the correct pattern when the full scope is unknown at the start.

EXAM TRAP

Batching files into groups without adding a cross-file integration pass

Batching reduces attention dilution within each batch but misses cross-batch issues. Without a dedicated cross-file integration pass, data flow issues and pattern inconsistencies across batches go undetected.

Practice Scenario

A code review agent processes 14 files and produces detailed feedback for the first 5 files but misses obvious bugs in files 10-14. It also flags a forEach loop as inefficient in one file while approving identical code in another. What is the root cause and the most appropriate solution?

OPTION A
Reduce the number of files per review to 5 and process in sequential batches of 5 files each
OPTION B
The model context window is too small to hold all 14 files — upgrade to a model with a larger context window
OPTION C
Add a stronger system prompt emphasising the importance of reviewing all files with equal thoroughness
OPTION D
Split the review into per-file local analysis passes plus a separate cross-file integration pass to avoid attention dilution
Check Answer
Build Exercise
BUILD EXERCISE
Build a Multi-Pass Code Review Pipeline
Difficulty
60 MINUTES

WHAT YOU'LL LEARN

Why attention dilution produces inconsistent analysis depth across files in single-pass reviews
How multi-pass architecture (per-item + cross-item) solves the structural attention allocation problem
The difference between fixed sequential pipelines and dynamic adaptive decomposition
Why batching without a cross-file integration pass still misses cross-cutting issues
How to identify attention dilution artefacts: same pattern flagged in one file, approved in another
Create a code review agent that accepts a directory path containing at least 10 source files

WHY: The 10+ file threshold is where attention dilution becomes observable. The exam uses a 14-file example where detailed feedback for early files degrades to superficial analysis for later files. Your setup must replicate this scale.

YOU SHOULD SEE: A code review function that reads all files in a directory and prepares them for analysis. It should handle at least 10 TypeScript or JavaScript source files.

Stuck? Get a nudge
Implement a single-pass review that processes all files at once and record the results

WHY: The single-pass approach is the baseline that demonstrates attention dilution. The exam expects you to recognise the symptoms: thorough analysis for early files, shallow analysis for later files, and contradictory pattern evaluation.

YOU SHOULD SEE: A review result where early files receive detailed feedback with specific line references and bug identification, while later files receive increasingly brief or missing feedback. This is the attention dilution pattern.

Stuck? Get a nudge
Implement per-file local analysis passes that produce structured feedback for each file individually (bug count, severity, specific line references)

WHY: Per-file passes give each file the full attention budget. This is the first layer of multi-pass architecture. The exam contrasts this with single-pass to show that structural decomposition solves attention dilution, not better prompts or larger context windows.

YOU SHOULD SEE: Consistent analysis depth across all files. The last file receives the same level of detail as the first. Each review includes bug count, severity ratings, and specific line references in a structured format.

Stuck? Get a nudge
Implement a cross-file integration pass that checks for data flow issues, API consistency, and pattern usage consistency across all files

WHY: Per-file passes catch local issues but miss cross-cutting concerns. The exam tests whether you include a cross-file integration pass — batching without it still misses data flow issues and pattern inconsistencies across files.

YOU SHOULD SEE: A separate analysis that takes the per-file summaries and checks for cross-file issues: inconsistent API usage, data flow problems between modules, and patterns used differently across files.

Stuck? Get a nudge
Compare results: document which issues the single-pass review caught versus the multi-pass approach, paying special attention to consistency of analysis depth across all files

WHY: This comparison demonstrates the exam argument quantitatively. Attention dilution is not a model capability problem — it is an architectural problem. The same model produces better results with multi-pass architecture, proving the fix is structural.

YOU SHOULD SEE: A comparison table showing: more total issues found by multi-pass, consistent issue counts across files (no drop-off for later files), and cross-file issues caught only by the integration pass.

Stuck? Get a nudge
Record any cases where the single-pass review flagged a pattern in one file but approved identical code in another — these are attention dilution artefacts

WHY: Contradictory pattern evaluation is the clearest symptom of attention dilution. The exam uses the forEach example: flagged as inefficient in File 3, approved without comment in File 11. Documenting these artefacts proves the structural nature of the problem.

YOU SHOULD SEE: At least one case where the single-pass review treated identical code patterns differently across files. The multi-pass review should treat the same pattern consistently.

Stuck? Get a nudge
Sources
Claude Agent SDK Overview — Anthropic
Claude Code in Action (Skilljar) — Anthropic
Anthropic Prompt Engineering Guide — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Agent SDK Hooks
NEXT LESSON
Session State and Resumption