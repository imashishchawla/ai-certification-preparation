---
title: "3 Claude Code Config__3 1 Claude Md Hierarchy"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 3.1 — CLAUDE.md Hierarchy, Scoping, and Modular Organisation | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/3-claude-code-config/3-1-claude-md-hierarchy

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
3.1
DOMAIN 3
TASK 3.1
Mark Complete
CLAUDE.md Hierarchy, Scoping, and Modular Organisation
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Claude Code reads configuration from CLAUDE.md files at three levels. Knowing which one applies where — and spotting when the wrong level was used — comes up again and again on the exam.

The Three-Level Hierarchy

User-level: ~/.claude/CLAUDE.md

This file applies only to you. It lives in your home directory, outside any repository, so it isn't version-controlled and never travels through git. Clone the repo as a new teammate and you won't get these instructions. Keep this level for strictly personal preferences: verbosity settings, a preferred output style, your own shortcuts.

Project-level: .claude/CLAUDE.md or root CLAUDE.md

This file applies to everyone on the project. It lives in the repository and is version-controlled, so every developer who clones or pulls the repo gets these instructions automatically. Team-wide standards belong here: naming conventions, error handling patterns, testing requirements, architecture decisions, code review checklists.

Both .claude/CLAUDE.md (inside the .claude directory) and a CLAUDE.md at the repository root are valid project-level locations. The exam may present either path.

Directory-level: subdirectory CLAUDE.md files

These apply when you're working in that specific directory. Use them for package-specific conventions that differ from the project root. A /packages/api/CLAUDE.md, say, might hold REST conventions that the frontend package never needs.

Loading Order and Conflict Handling

CLAUDE.md files aren't a strict-precedence config. The Anthropic memory docs are explicit: "All discovered files are concatenated into context rather than overriding each other." Every applicable file loads into the same context window. None replaces another.

The docs describe a documented load order, not a precedence chain:

Files are ordered from broadest scope to most specific. A project instruction appears in context after a user instruction. Across the directory tree, "content is ordered from the filesystem root down to your working directory," so "instructions closer to where you launched Claude are read last."
Within a directory, CLAUDE.local.md is appended after CLAUDE.md, so your personal notes are the last thing Claude reads at that level.

None of this makes it a winner-take-all hierarchy. The docs are blunt about it: "if two rules contradict each other, Claude may pick one arbitrarily." CLAUDE.md is delivered as a user message — not as part of the system prompt — and Anthropic says "there's no guarantee of strict compliance." Treat CLAUDE.md as guidance the model usually follows, not as a configuration layer with deterministic overrides.

The practical consequence: if a rule must hold on every run — a blocked tool, a required formatter, a permission policy — don't lean on CLAUDE.md scoping to enforce it. Encode it in settings.json (which the client enforces regardless of what Claude decides) or in a hook (which fires at a fixed lifecycle event). The Anthropic docs spell this out directly: "Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer."

DON'T CONFUSE CLAUDE.MD WITH SETTINGS.JSON

settings.json has a strict precedence chain (managed policy > local > project > user, with managed always winning). CLAUDE.md does not — files are concatenated and conflicts may resolve arbitrarily. If a question asks "which CLAUDE.md wins on a conflict?", the docs-honest answer is "neither is guaranteed to — move the rule to settings.json or a hook." Watch for distractors that claim "more specific scope wins" or "user-level overrides project-level": both are paraphrases the official docs never make.

Modular Organisation with @ path imports

Past a few hundred lines, one CLAUDE.md becomes a slog to maintain. The @ syntax lets you split it across files and reference them from the main one. The directive is just @ followed by a path. There is no @import keyword, even though half the docs you'll find online write it that way.

The syntax in your CLAUDE.md:

MARKDOWN
Copy
# .claude/CLAUDE.md

Coding standards:

@./standards/naming-conventions.md
@./standards/error-handling.md
@./standards/testing-requirements.md


Each @<path> line gets that file inlined into the CLAUDE.md at load time. Per-package CLAUDE.md files can import only the standards that apply to them. The API package pulls in API conventions, the frontend pulls in component rules. No duplication.

One thing the docs are quiet about: imports load eagerly. The referenced file gets inlined the moment Claude reads your CLAUDE.md, exactly as if you'd pasted it in. So splitting a 600-line CLAUDE.md into six 100-line imports makes the source nicer to work in, but the context Claude actually sees is the same size. If you want to shrink per-session context, the tool for the job is .claude/rules/ with path-scoped frontmatter (covered in Task Statement 3.3). Those files only load when Claude is working in matching paths.

CLAUDE.local.md, local-only overrides

CLAUDE.local.md lives next to CLAUDE.md at any level in the hierarchy and loads the same way, with three small differences worth knowing:

Loading order. CLAUDE.local.md is appended after CLAUDE.md at the same level, so your personal notes are the last thing Claude reads there. That's load order, not precedence: reading last doesn't win a contradiction. If two instructions conflict, Claude may still pick either one.
Gitignored by convention. The .local suffix flags files you don't want committed. Most teams add CLAUDE.local.md to .gitignore so personal tweaks stay personal.
What it's for. The shared CLAUDE.md is the team's rules. The CLAUDE.local.md next to it is your own quirks for this repo: a favourite scratchpad path, a verbose explanation you keep needing to re-paste, a temporary debugging note you'll delete next week.

Think of CLAUDE.local.md as a project-scoped version of ~/.claude/CLAUDE.md: same idea, narrower scope. If you find yourself reaching for it to express a team rule, that rule belongs in CLAUDE.md instead.

The .claude/rules/ Directory

As an alternative to a single CLAUDE.md file, the .claude/rules/ directory holds topic-specific rule files:

testing.md — test naming, assertion patterns, fixture usage
api-conventions.md — endpoint naming, request/response schemas
deployment.md — deployment checklist, environment configuration

Each file can optionally include YAML frontmatter with path scoping (covered in detail in Task Statement 3.3). Without frontmatter, rules files load for all sessions.

Diagnosing What Loaded: /memory and /context

When behaviour drifts between sessions, or between developers, you need to see which memory files the session actually picked up. If Claude Code follows the team conventions for one teammate and ignores them for another, that answer settles it.

Current Claude Code splits the job across two commands. /memory lists your CLAUDE.md, CLAUDE.local.md and auto-memory locations, and opens any of them in your editor. /context reports what actually loaded into this session, under Memory files — so to confirm a file is live, run /context and read that list. The docs are explicit about it: "check the list under Memory files to verify your CLAUDE.md and CLAUDE.local.md files loaded". (Claude Code memory docs, verified August 2026.)

KEY CONCEPT

Neither command loads anything. They reveal which files are already loaded — configuration loads automatically based on its level and location. Use them to diagnose, not to activate. That is the part the exam tests, and it holds for /memory and /context alike.

ON THE EXAM, ANSWER /MEMORY

The exam guide (v1.0) predates the split and treats /memory as the command that shows which files are loaded. Give /memory as the keyed answer. Run /context at your actual keyboard.

What Survives Compaction

When /compact summarises a long session, project-root CLAUDE.md comes back intact. Not because it sits somewhere privileged. Because Claude re-reads it from disk after compaction and re-injects it, and your instructions were never part of the conversation history to begin with, so there's nothing there for the summariser to compress.

Two things don't come back automatically: nested CLAUDE.md files in subdirectories, and .claude/rules/ files with paths: frontmatter. Both load on demand, so they return the next time Claude reads a matching file rather than the moment compaction ends. When an instruction seems to vanish after /compact, that's usually why. The other candidate is an instruction that only ever existed in conversation, which compaction is free to summarise.

The Critical Exam Scenario: New Team Member Not Receiving Instructions

This is the exam's favourite trap for Task Statement 3.1. It usually runs like this:

Developer A has been on the team for months. Claude Code follows all the team's conventions perfectly — API naming, test structure, error handling. Developer B joins the team, clones the repository, and Claude Code produces inconsistent results that ignore the conventions.

The root cause is always the same: the conventions are stored in Developer A's user-level config (~/.claude/CLAUDE.md) instead of the project-level config (.claude/CLAUDE.md or root CLAUDE.md). User-level config is not shared via git. Developer B never received the instructions.

The fix: move instructions from user-level to project-level configuration.

You need to diagnose this on sight. See "new team member" paired with "inconsistent behaviour"? Check where the configuration lives.

Exam Traps
EXAM TRAP

New team member not receiving Claude Code instructions despite working on the same repo and branch

The instructions are in user-level config (~/.claude/CLAUDE.md) instead of project-level. User-level is not version-controlled or shared via git. Move to .claude/CLAUDE.md for team-wide application.

EXAM TRAP

Thinking /memory triggers configuration loading

/memory is a diagnostic command that shows which files are loaded. Configuration files load automatically based on their location in the hierarchy. /memory helps you debug — it does not activate anything.

EXAM TRAP

Assuming directory-level CLAUDE.md is the best solution for cross-directory conventions

Directory-level CLAUDE.md applies to one directory only. For conventions spanning many directories (like test files spread throughout a codebase), use path-specific rules in .claude/rules/ with glob patterns instead.

Practice Scenario

Developer A's Claude Code follows the team's API naming conventions perfectly. Developer B, who joined last week, gets inconsistent naming from Claude Code. Both work on the same repo and branch. What is the most likely root cause?

OPTION A
Developer B has not yet installed the MCP server that supplies the naming convention rules for the team to the Claude Code session running on their machine
OPTION B
The conventions are stored in a .claude/rules/ file that Developer B's local setup does not support, so the rules never load on their machine
OPTION C
The API naming conventions are stored in Developer A's user-level CLAUDE.md (~/.claude/CLAUDE.md) rather than the project-level configuration
OPTION D
Developer B has not run /memory to load the configuration files into the session, so the project-level instructions have never entered the model context
Check Answer
Build Exercise
BUILD EXERCISE
Build a Multi-Level CLAUDE.md Configuration
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Understand the three-level CLAUDE.md hierarchy (user, project, directory) and when to use each
Configure modular project standards using @ path imports
Use .claude/rules/ for topic-specific rule files
Diagnose configuration scoping issues with the /memory command
Identify root cause when a new team member does not receive instructions
Create a project-level .claude/CLAUDE.md with universal coding standards: naming conventions, error handling patterns, and a code review checklist

WHY: Project-level configuration is the foundation of team-wide standards. The exam tests whether you place shared conventions here rather than in user-level config, which is the most common misconfiguration scenario.

YOU SHOULD SEE: A .claude/CLAUDE.md file at the repository root containing at least three sections: naming conventions, error handling patterns, and a code review checklist. Running /context in the project root lists this file under Memory files.

Stuck? Get a nudge
Create a directory-level CLAUDE.md in a /packages/api/ subdirectory with API-specific conventions (REST endpoint naming, request/response schema requirements)

WHY: Directory-level configuration scopes conventions to a specific package. The exam tests whether you know that directory-level CLAUDE.md applies only within that directory, not across the entire project.

YOU SHOULD SEE: A CLAUDE.md file inside /packages/api/ containing REST-specific conventions. When you run /context while working in /packages/api/, both the project-level and directory-level files appear under Memory files.

Stuck? Get a nudge
Create .claude/rules/testing.md with test-specific conventions (test naming pattern, assertion style, fixture usage)

WHY: The .claude/rules/ directory holds topic-specific rule files that can optionally include YAML frontmatter for path scoping. Understanding this mechanism is tested alongside path-specific rules in Task Statement 3.3.

YOU SHOULD SEE: A testing.md file inside .claude/rules/ containing at least three test conventions. Running /context lists this rules file under Memory files.

Stuck? Get a nudge
Use an @ path import in the project-level CLAUDE.md to reference a shared standards file at ./standards/naming.md

WHY: The @ import syntax enables modular organisation of conventions. There is no @import keyword — a path prefixed with @ on its own line is the import. Each package can import only relevant standards, reducing duplication and drift in the source files. The exam tests whether you know the mechanism exists and how the syntax actually looks.

YOU SHOULD SEE: The project-level .claude/CLAUDE.md contains a line beginning with @ pointing to ./standards/naming.md. A separate file at .claude/standards/naming.md (or standards/naming.md relative to the CLAUDE.md) exists with naming conventions. Running /context confirms the imported content is loaded inline.

Stuck? Get a nudge
Run /context in different directories to verify the correct files are loaded in each context

WHY: The exam tests that the diagnostic command reveals loaded files but does not trigger loading — configuration loads automatically based on location. The guide names /memory for this; current Claude Code reports the loaded set under /context, so that is what you run here.

YOU SHOULD SEE: In the project root, /context shows the project-level CLAUDE.md and rules files under Memory files. In /packages/api/, it additionally shows the directory-level CLAUDE.md. The imported standards file content appears as part of the project-level configuration.

Stuck? Get a nudge
Move one convention from project-level to user-level (~/.claude/CLAUDE.md) and verify that a different user session does NOT pick it up — confirming the scoping boundary

WHY: This is the exam favourite trap scenario. When conventions live in user-level config, new team members who clone the repo do not receive them. Proving this boundary experimentally cements the concept.

YOU SHOULD SEE: After moving a convention to ~/.claude/CLAUDE.md, your own /context shows it loaded. A simulated second user session (or a fresh clone without your home directory config) does NOT show that convention. This confirms the scoping boundary.

Stuck? Get a nudge
Sources
How Claude remembers your project (CLAUDE.md and auto memory) — Anthropic
Claude Certified Architect Foundations Exam Guide — Task Statement 3.1 — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Built-in Tools
NEXT LESSON
Custom Slash Commands and Skills