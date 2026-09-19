---
title: "2 Tool Design Mcp__2 5 Built In Tools"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 2.5 — Built-in Tools | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-5-built-in-tools

STUDY TOOLS

Progress Dashboard
Drill Mode

CURRICULUM

01
Agentic Architecture & Orchestration
02
Tool Design & MCP Integration
2.1
Tool Interface Design
2.2
Structured Error Responses
2.3
Tool Distribution & Tool Choice
2.4
MCP Server Integration
2.5
Built-in Tools
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
TOOL DESIGN & MCP INTEGRATION
/
2.5
DOMAIN 2
TASK 2.5
Mark Complete
Built-in Tools
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Claude Code provides six built-in tools for working with codebases: Read, Write, Edit, Bash, Grep, and Glob. Each has a specific purpose, and using the wrong tool for a task wastes time, context tokens, or both. The exam deliberately presents scenarios where confusing these tools leads to incorrect answers.

Grep vs Glob: The Core Distinction

This is the distinction that matters most in this task statement. Get it wrong and you'll lose marks.

Grep searches file CONTENTS for patterns. Use Grep when you need to find text inside files. Function callers. Error messages. Import statements. Variable assignments. Any time you are searching for what files contain, Grep is the tool.

Copy
// Find all files that call processLegacyOrder()
Grep: "processLegacyOrder"

// Find all error messages containing "timeout"
Grep: "timeout"

// Find all files that import a specific module
Grep: "import.*from 'utils/auth'"


Glob matches file PATHS by naming patterns. Use Glob when you need to find files by name, extension, or directory structure. Test files. Configuration files. All TypeScript files in a specific directory. Any time you are searching for files based on their path, Glob is the tool.

Copy
// Find all test files
Glob: "**/*.test.tsx"

// Find all configuration files
Glob: "**/config.*"

// Find all MDX files in the domains directory
Glob: "content/domains/**/*.mdx"


The distinction in one sentence: Grep finds what is INSIDE files. Glob finds files by their NAMES.

The exam presents scenarios where a developer uses the wrong tool. Use Glob to find function callers and it fails — Glob matches paths, not contents. Use Grep to find test files by naming pattern and it works technically (by searching for "test" in filenames via content), but it's the wrong tool, and the exam expects you to identify the correct one.

Read, Write, and Edit

These three tools handle file operations, each optimised for a different use case.

Edit performs targeted modifications using unique text matching. You specify the exact text to find and its replacement. It's fast and precise because it touches only the specific text you identify.

Copy
Edit:
  old_string: "function processOrder(id: string)"
  new_string: "function processOrder(id: string, validate: boolean = true)"


When Edit fails: Edit requires unique text matching. If the text you specify appears in multiple places in the file, Edit can't tell which occurrence you mean, so it fails. That's a safety mechanism, not a bug — it stops you changing text you never meant to touch.

When Edit can't find a unique anchor: the exam's answer. The exam guide names one fallback, Read + Write. Read the full file, then Write the complete modified version back. It works every time, because you're no longer asking Edit to guess. It also spends a file's worth of tokens on what was usually a one-line change, which is why it's the fallback and not the default.

When Edit can't find a unique anchor: current Claude Code. The Edit tool docs now give you a cheaper move first: widen old_string with more surrounding context until it pins down one location, or set replace_all: true if you actually want every occurrence updated. Both keep you on Edit and cost almost no extra context. In real work, do that before you reach for Read + Write.

The ordering in real work:

Try Edit with the shortest anchor that's plausibly unique.
On a non-unique match, widen old_string until it matches one location, or use replace_all: true if you want every occurrence changed.
Fall back to Read + Write when neither of those can disambiguate the target.

The ordering on the exam has two steps: Edit first, Read + Write when Edit fails. Both orderings agree on the first step. Don't default to Read + Write for every modification. The exam penalises that because it burns context tokens.

CURRENT STATE

Exam guide v1.0 frames Read + Write as the documented fallback when Edit cannot find unique anchor text ("Using Read to load full file contents followed by Write when Edit cannot find unique anchor text"). As of 14 August 2026 the Edit tool reference documents widening old_string or setting replace_all: true as the behaviour on a non-unique match. On the exam, answer Read + Write. In real work, widen the anchor first — it is cheaper and the practice above still holds.

Incremental Codebase Understanding

How you explore a codebase matters as much as which tools you use. There's a right way and a wrong way.

Wrong: Read all files upfront. Loading every file into context before you know what you need is a context-budget killer. A 200-file codebase read in full swallows your entire context window, mostly on files that have nothing to do with your task. No other exploration mistake costs you more.

Right: Incremental discovery. Start narrow. Expand only as needed.

Grep to find entry points. Search for the function name, class name, or error message that anchors your investigation. This tells you which files are relevant.

Read to follow imports and trace flows. Once you know which files matter, Read them to understand the code structure. Follow import statements to discover related files.

Grep again to trace usage. The files you read in step 2 may expose the function under another name: a wrapper (submitOrder() that calls processOrder() inside it) or a barrel file that re-exports it (export { processOrder as submitOrder }). Callers of the new name never mention the original, so your first Grep never saw them. Grep for each new name, across the whole codebase, to get the full list of consumers. The next section works through an example.

Read only what you need. Each file you read should be justified by what you discovered in the previous step.

That's minimal context for maximum understanding. You map the codebase progressively, spending tokens only on files that matter to the task.

Tracing Function Usage Across Wrapper Modules

A common codebase pattern: a function is defined in one module, re-exported through a wrapper, and consumed through the wrapper's name. A simple Grep for the original name misses every consumer who imports through the wrapper.

The correct approach:

Grep for the function definition to find where it is defined
Read the defining file to identify exported names
Grep for each exported name across the codebase to find all consumers
If the function is re-exported through a barrel file (e.g. index.ts), Grep for the barrel file's module name to find consumers who import from it

Concretely: processOrder is defined in orders.ts. The barrel utils/index.ts re-exports it as submitOrder, and three of its five consumers import submitOrder from utils. A Grep for processOrder finds the definition, the barrel line and the two consumers that import the original name. It cannot find the other three, because the string processOrder never appears in their files. Read the barrel, spot the rename, Grep for submitOrder, and the three turn up.

The multi-step trace catches indirect consumers a single Grep would miss.

The Deprecation Scenario

This one turns up constantly in exam prep: find every file that calls a deprecated function AND the test files that exercise it. The correct sequence:

Grep for the function name — finds every file whose contents reference the function, including any tests that import it directly (content search)
Glob for sibling test files — finds the test file that pairs with each caller by naming convention, e.g. OrderProcessor.ts → OrderProcessor.test.tsx, even when the test exercises the function indirectly through the source module (path matching)
Grep again for wrapper names — when a caller exposes the function through a wrapper (e.g. applyLegacyOrder calls processLegacyOrder internally), Grep for the wrapper name to find tests that cover the function transitively through it

Say Grep reveals that OrderProcessor.ts and RefundHandler.ts call the deprecated function. Glob for **/OrderProcessor.test.* and **/RefundHandler.test.* to pull in their sibling test files, even if those tests never mention processLegacyOrder by name. And if either source file wraps the function under a new name, Grep for the wrapper to catch any remaining tests.

This is Grep, then Glob, then Grep again — content search for direct references, path matching for adjacent tests, content search for indirect coverage. Not Glob first.

KEY CONCEPT

Grep searches file contents. Glob matches file paths. Edit is the default for modifications. On a non-unique match the exam's answer is Read + Write. Current Claude Code widens the anchor or uses replace_all: true first, and that is the better move in real work. Build codebase understanding incrementally. Never read all files upfront.

Exam Traps
EXAM TRAP

Using Glob to find function callers (it searches paths, not contents)

Glob matches file paths by naming pattern. It cannot search inside files for function calls. Use Grep to search file contents for function names, import statements, or error messages.

EXAM TRAP

Using Grep to find files by extension or naming pattern

While Grep could technically find filenames mentioned in content, Glob is the purpose-built tool for matching file paths. Use Glob for **/*.test.tsx, **/config.*, and similar path-based searches.

EXAM TRAP

Reading all source files upfront before understanding what is relevant

Loading every file into context is a context-budget killer. The correct approach is incremental: Grep to find entry points, then Read to trace flows from those specific entry points.

EXAM TRAP

Defaulting to Read + Write for every file modification instead of trying Edit first

Edit is faster and uses less context because it only touches the specific text. Read + Write loads the entire file. Try Edit first. Read + Write is the fallback for when Edit cannot find a unique anchor, not the standard response.

EXAM TRAP

Answering 'widen old_string or set replace_all' when a question asks what to do after Edit reports a non-unique match

That is what current Claude Code does, and it is the cheaper move in real work. The exam guide names Read + Write as the fallback when Edit cannot find unique anchor text, and every keyed answer follows the guide. Read the full file, then Write the complete modified version.

Practice Scenario

A developer needs to find all files that call a deprecated function processLegacyOrder() and also find all test files for those callers. Which tool sequence is correct?

OPTION A
Bash with find and xargs grep for both steps, since a single shell pipeline can locate the callers and their test files in one pass without switching between built-in tools.
OPTION B
Glob for **/*processLegacyOrder* to find caller files, then Grep inside that result set for test files. Glob resolves the file list first, so the content search runs over fewer files and stays inside the context budget.
OPTION C
Grep for processLegacyOrder to find callers (this also surfaces tests that import the function directly), then Glob for the sibling test file of each caller (e.g. **/OrderProcessor.test.*) to catch tests that exercise the function through the source module without naming it.
OPTION D
Read all the source files to search for the function manually, then Read all the test files to pair them with their callers. Reading every file gives complete visibility of each call site and test, so no caller can be missed by a naming mismatch, and the full contents remain available in context for the later refactoring steps.
Check Answer
Build Exercise
BUILD EXERCISE
Trace and Refactor a Deprecated Function Using Built-in Tools
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Apply Grep for content search and Glob for path matching in the correct sequence
Use incremental codebase discovery instead of reading all files upfront
Select Edit as the primary modification tool and widen the anchor (or use replace_all) when Edit reports a non-unique match
Trace function usage across wrapper modules and barrel files
Follow the Grep-then-Glob pattern for finding callers and their test files
Use Grep to search for all callers of a target function (e.g. processLegacyOrder) across the codebase

WHY: Grep searches file contents — it is the correct tool for finding function callers. Using Glob here would fail because Glob matches file paths, not contents. The exam tests this distinction directly and penalises candidates who confuse the two.

YOU SHOULD SEE: A list of file paths containing calls to processLegacyOrder, with line numbers and matching lines showing the exact call sites. For example: src/OrderProcessor.ts:42: await processLegacyOrder(orderId).

Stuck? Get a nudge
Use Glob to find test files matching the caller filenames (e.g. **/*.test.tsx)

WHY: Glob matches file paths by naming pattern — it is the correct tool for finding test files by extension or naming convention. This completes the Grep-then-Glob pattern: content search to find callers, then path matching to find their tests.

YOU SHOULD SEE: A list of test file paths matching the pattern, such as src/OrderProcessor.test.tsx and src/RefundHandler.test.tsx. These correspond to the caller files found by Grep in the previous step.

Stuck? Get a nudge
Use Read to examine each caller file and understand the usage pattern and context

WHY: Reading files incrementally — only after Grep identifies which files matter — is the correct approach. Reading all source files upfront is a context-budget killer that the exam explicitly penalises. Each Read should be justified by what you discovered in the previous step.

YOU SHOULD SEE: The full contents of each caller file, showing how processLegacyOrder is called, what parameters are passed, how the return value is used, and whether the function is imported directly or through a wrapper module.

Stuck? Get a nudge
Use Edit to replace the deprecated function call with the new API in each caller file

WHY: Edit is the preferred modification tool because it targets specific text and uses less context than Read + Write. The exam penalises defaulting to Read + Write for every modification. Always try Edit first — it is faster and more precise.

YOU SHOULD SEE: Each caller file updated with the new API call replacing the deprecated one. For example, processLegacyOrder(orderId) replaced with processOrder(orderId, { validate: true }). The Edit tool confirms the replacement was made successfully.

Stuck? Get a nudge
When Edit fails with a non-unique match, widen old_string with more surrounding lines until it pins down one location (or set replace_all: true if you actually want every occurrence updated). Only fall back to Read + Write if neither option can disambiguate the target

WHY: Edit fails when the target text appears multiple times in the file — this is a safety mechanism, not a bug. Per the Edit tool documentation, the documented recovery is to expand the anchor with more surrounding context until it matches one place, or to use replace_all for global replacements. Both keep you on Edit and cost almost nothing in context. Read + Write loads the entire file for what is usually a single-line change — keep it as a last resort. That is the practice answer. On the exam, the guide names Read + Write as the fallback, so answer that.

YOU SHOULD SEE: On the first try, Edit fails with an error like: old_string matches 3 locations. On the retry with a wider old_string that includes the surrounding function name or unique adjacent line, Edit succeeds and changes exactly one occurrence. If replace_all: true was the right call, every occurrence is updated atomically.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.5 — Anthropic
Claude Code Documentation — Built-in Tools — Anthropic
Building with Claude API — Anthropic — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
MCP Server Integration
NEXT LESSON
CLAUDE.md Hierarchy, Scoping, and Modular Organisation