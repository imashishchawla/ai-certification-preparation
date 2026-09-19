# 1.7 — Session State and Resumption | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/1-agentic-architecture/1-7-session-state-resumption

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
1.7
DOMAIN 1
TASK 1.7
Mark Complete
Session State and Resumption
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Session management determines how an agent maintains continuity across work sessions. In long-running tasks — debugging a complex system, reviewing a large codebase, conducting multi-day research — the agent's context accumulates tool results, file analyses, and reasoning chains. Task Statement 1.7 covers how to manage this accumulated state: when to continue it, when to branch it, and when to start fresh.

Three Session Management Options

The Agent SDK and Claude Code give you three approaches to session management. Each does a different job, and the exam expects you to pick the right one for the scenario in front of you.

Option 1: --resume <session-name>

Resume continues a specific named session from where it left off. The entire conversation history — including all tool results, analyses, and reasoning — is restored.

When to use: The prior context is mostly still valid. Files have not changed significantly since the last session. You want to pick up exactly where you stopped.

When NOT to use: Files have been modified since the last session. Tool results in the conversation history no longer reflect the current state of the codebase. This leads to the stale context problem (covered below).

CURRENT STATE: HOW SESSIONS GET THEIR NAMES

--resume only resumes sessions that already exist — it accepts a session ID or name, or opens an interactive picker, but it never creates a session. In the current CLI you name a session when you start it with --name / -n (or mid-session with /rename), then continue it later with claude --resume <name>. There's also -c / --continue, which resumes the most recent conversation in the current directory without naming anything. (Verified against the Claude Code CLI reference, July 2026.)

Option 2: fork_session

Fork creates an independent branch from a shared analysis baseline. After the fork, each branch operates independently — changes in one branch do not affect the other, and branches cannot see each other's results.

In the SDK you set it beside resume, not instead of it: resume picks the session, and fork_session: true starts a new session from a copy of that history rather than appending to it. The CLI pairs --fork-session with --resume the same way. (Agent SDK sessions guide, checked September 2026. Lesson 1.3 has the full note.)

When to use: You have completed an initial analysis and want to explore divergent approaches from that shared starting point. For example, after analysing a codebase, you fork to compare two refactoring strategies. Each fork builds on the same initial understanding but takes a different direction.

When NOT to use: You simply want to continue the same line of investigation. Fork is for divergence, not continuation. If you are not comparing alternatives, use resume.

Option 3: Fresh start with summary injection

Start a completely new session but inject a structured summary of the prior session's findings into the initial context. The new session has no stale tool results — only the curated summary you provide.

When to use: Tool results from the prior session are stale (files have changed, APIs have been updated, dependencies have shifted). Context has degraded over a long session (too many irrelevant tool results cluttering the history). You need a clean baseline with preserved knowledge.

When NOT to use: The prior context is still valid and you want to maintain the full conversation history. In this case, resume is more efficient.

KEY CONCEPT

Three session management options serve three distinct purposes: resume for continuation, fork for divergent exploration, and fresh start with summary injection for when prior tool results are stale. The exam tests your ability to select the right option for each scenario.

The Stale Context Problem

The stale context problem is the central concept of this task statement. It occurs when an agent resumes a session after code modifications and reasons from cached tool results that no longer reflect the current state of files.

How it manifests: A developer works with Claude Code to analyse a codebase. They make changes to 3 files and resume the session. Claude gives contradictory advice about those files — recommending changes that were already made, or referencing code that no longer exists — because it is reasoning from the old tool results still in its conversation history.

Why it happens: When you resume a session, the entire conversation history is restored, including every tool result from the previous session. If a file was read during the previous session and has since been modified, the old file contents are still in the conversation as a tool result. The model reasons from that stale data alongside any new data, leading to contradictions.

The naive fix (and why it is insufficient): Simply resuming the session and asking the agent to re-read the modified files. This is better than nothing, but the stale tool results remain in the conversation history. The model may still reference old information from earlier in the context, especially for tangential decisions that do not directly involve the modified files.

The correct fix: Start a fresh session with a structured summary of prior findings. Specify which files have changed so the agent can perform targeted re-analysis of those files. The fresh session has no stale tool results, and the injected summary preserves the knowledge from the prior session without the outdated data.

EXAM TRAP

The exam tests whether you recognise that resuming after file changes can lead to stale context. Simply resuming and asking the agent to re-read changed files is not the best answer — the stale results remain in history and can still influence reasoning. A fresh start with summary injection is more reliable.

Targeted Re-Analysis vs Full Re-Exploration

When files have changed, the agent doesn't need to re-analyse the whole codebase. That's wasteful. Re-reading 50 files because 3 of them changed is time you don't get back.

The correct approach is targeted re-analysis: inform the agent about the specific files that changed and let it re-analyse only those files. The summary from the prior session covers everything that has not changed.

What targeted re-analysis looks like in practice:

Start a fresh session.
Inject a structured summary: "Prior analysis found X, Y, and Z across the codebase. The following 3 files have been modified since: auth.ts, database.ts, and api-routes.ts."
The agent re-reads and re-analyses only the 3 modified files.
It combines the fresh analysis of changed files with the preserved summary of unchanged files.

This is faster than full re-exploration and more reliable than resuming with stale context.

When to Use Each Option: Decision Matrix
Scenario	Best Option	Reasoning
Continuing work from yesterday, no files changed	--resume	Prior context is valid, full history is useful
Comparing two refactoring approaches	fork_session	Divergent exploration from shared baseline
Resuming after modifying 3 of 50 files	Fresh start + summary	Stale tool results for modified files would cause contradictions
Long session with cluttered history	Fresh start + summary	Degraded context benefits from a clean baseline
Exploring a testing strategy vs a documentation strategy	fork_session	Two independent approaches from the same analysis
Resuming after dependency updates	Fresh start + summary	Multiple files may have changed indirectly
Practical Example: The Contradictory Advice Bug

A developer uses Claude Code to analyse a 50-file codebase over two days. On Day 1, they analyse the authentication module and identify three issues. Overnight, they fix all three issues by modifying auth.ts, session.ts, and middleware.ts.

On Day 2, they resume the session. Claude recommends fixing the three issues that were already fixed — because the old tool results showing the unfixed code are still in the conversation history. Worse, when asked about the current state of auth.ts, Claude gives contradictory answers: sometimes referencing the old code (from the stale tool result) and sometimes referencing the new code (from a fresh read).

The fix: start a fresh session with a summary. "Prior analysis identified three authentication issues in auth.ts, session.ts, and middleware.ts. All three have been fixed. Please re-analyse these three files to verify the fixes and check for any new issues introduced by the changes."

The fresh session has no stale tool results. The agent reads the current files, verifies the fixes, and provides consistent advice based on the actual current state.

Exam Traps
EXAM TRAP

Suggesting full re-exploration of a 50-file codebase when only 3 files changed

Full re-exploration is wasteful. Inform the agent about the specific 3 files that changed for targeted re-analysis. The prior summary covers everything else.

EXAM TRAP

Recommending --resume after files have been modified

Resuming preserves stale tool results in the conversation history. The agent may reason from outdated file contents, leading to contradictory advice. A fresh start with summary injection avoids this.

EXAM TRAP

Confusing fork_session with --resume

fork_session starts a new session from a copy of the existing history, so the original is left as it was. --resume appends to the same session. Fork for divergence, resume for continuation. In the SDK fork_session is set beside resume, so the choice is append or branch, not one option or the other.

EXAM TRAP

Using fork_session to handle stale context after file changes

fork_session branches from the existing session, which still contains stale tool results. The fork inherits the stale context. A fresh start with summary injection is the correct approach for stale data.

Practice Scenario

A developer resumes a Claude Code session after modifying 3 files in a 50-file codebase. The agent gives contradictory advice about the modified files — recommending changes that were already made and referencing code that no longer exists. What is the most appropriate approach?

OPTION A
Resume the existing session and ask the agent to re-read the 3 modified files, keeping the rest of the conversation history available for continuity
OPTION B
Start a completely new session with no carried-over context and re-analyse the entire 50-file codebase from scratch before continuing the work
OPTION C
Start a fresh session with an injected summary of prior findings and inform the agent about the specific 3 file changes for targeted re-analysis
OPTION D
Use fork_session to branch the existing session so the file changes can be incorporated in a separate line of work
Check Answer
Build Exercise
BUILD EXERCISE
Implement Session Management Strategies
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

The three session management options: resume, fork_session, and fresh start with summary injection
Why resuming after file changes leads to the stale context problem
How structured summary injection preserves knowledge without stale tool results
When targeted re-analysis is more efficient than full re-exploration
The difference between fork_session (divergent exploration) and resume (continuation)
Create a Claude Code session that analyses a 10-file codebase and name it with --name for later resumption

WHY: Named sessions resumed with --resume enable continuation of work across breaks. The exam tests when resume is appropriate (no files changed) versus when it creates the stale context problem (files have been modified since the last session).

YOU SHOULD SEE: A named Claude Code session that reads and analyses 10 source files. The session name should be memorable for later resumption. The agent should produce findings about each file.

Stuck? Get a nudge
Record the key findings from the initial analysis as a structured summary (file names, issues found, recommendations)

WHY: This structured summary is the knowledge you will inject into the fresh session later. The exam tests whether you preserve prior findings without carrying stale tool results. A good summary captures conclusions without raw tool output.

YOU SHOULD SEE: A structured document listing each file name, the issues found in it, severity ratings, and specific recommendations. This should be concise enough to inject into a prompt but complete enough to preserve all key findings.

Stuck? Get a nudge
Modify 3 files in the codebase to fix some of the identified issues

WHY: Modifying files after a session creates the conditions for stale context. The old file contents remain as tool results in the session history while the actual files now contain different code. This is the exact scenario that triggers the contradictory advice bug.

YOU SHOULD SEE: Three files modified with fixes for the issues identified in the initial analysis. The changes should be substantive enough that the old and new versions would produce different analysis results.

Stuck? Get a nudge
Attempt to resume the session with --resume and observe any stale context issues (contradictory advice, references to old code)

WHY: This demonstrates the stale context problem. The resumed session contains old tool results showing the unfixed code. The agent may recommend fixing issues that are already fixed, or give contradictory advice by referencing both old and new file contents.

YOU SHOULD SEE: The agent giving contradictory advice: recommending fixes for issues already resolved, referencing code that no longer exists, or providing inconsistent guidance about the modified files. These are the hallmarks of stale context.

Stuck? Get a nudge
Start a fresh session with the structured summary injected into the initial prompt, specifying the 3 changed files for targeted re-analysis

WHY: Fresh start with summary injection is the correct approach when files have changed. The exam specifically tests this: no stale tool results, preserved knowledge from the prior session, and targeted re-analysis of only the changed files instead of wasteful full re-exploration.

YOU SHOULD SEE: A clean session that knows about the prior findings (from the injected summary), targets only the 3 changed files for re-analysis, and produces consistent advice without contradictions.

Stuck? Get a nudge
Compare the quality and consistency of advice between the stale resume and the fresh start with targeted re-analysis

WHY: This comparison demonstrates why the exam favours fresh start with summary injection over naive resume after file changes. The fresh start produces consistent, accurate advice while the resume produces contradictions from stale context.

YOU SHOULD SEE: A clear quality difference: the resume session gives contradictory or outdated advice about the modified files, while the fresh session gives accurate, consistent analysis based on the current file contents.

Stuck? Get a nudge
Sources
Claude Code Documentation — Anthropic
Claude Code in Action (Skilljar) — Anthropic
Claude Agent SDK Overview — Anthropic
Agent SDK: Work with sessions — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Task Decomposition Strategies
NEXT LESSON
Tool Interface Design