---
title: "Quick Reference__domain 3"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# Quick Reference: Domain 3 — Claude Code Configuration & Workflows | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/quick-reference/domain-3

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
Quick Reference
/
Domain 3
DOMAIN 3
20%
Quick Reference: Domain 3 — Claude Code Configuration & Workflows
Print this page
Configuration Hierarchy

CLAUDE.md files are concatenated into context, not overridden. Every applicable file loads together, in a documented order from broadest scope to most specific:

Load order	Location	Scope	Committed to Git?
1 (broadest)	~/.claude/CLAUDE.md	User-global, all projects	No
2	.claude/CLAUDE.md (project root)	Project-wide	Yes
3	CLAUDE.md (any directory)	Directory and below	Yes

Where .claude/rules/ sits: not at the end of that chain. Rules without paths frontmatter load at launch at the same priority as .claude/CLAUDE.md — they are a way to split a monolithic file, not a more-specific layer that wins. Rules with paths load conditionally, when Claude reads a file matching the pattern. Separately, user-level rules in ~/.claude/rules/ load before project rules, which gives project rules the higher priority.

Key rule: This is a load order, not a precedence chain — no file replaces another. If two rules contradict each other, Claude may pick one arbitrarily, so fix contradictions at the source. Distractors claiming "more specific scope wins" or "user-level overrides project-level" are wrong.

.claude/rules/ — Conditional Rules

Files in .claude/rules/ use YAML frontmatter with a paths field for conditional loading:

YAML
Copy
---
paths:
  - "src/api/**"
  - "src/middleware/**"
---
Always validate authentication tokens before processing API requests.
Use structured error responses with proper HTTP status codes.


Rules are loaded only when Claude Code operates on files matching the glob patterns. This prevents irrelevant rules from consuming context window space.

Skills System
Property	Project Skills	Personal Skills
Location	.claude/skills/	~/.claude/skills/
Entry point	SKILL.md in skill directory	SKILL.md in skill directory
Shared with team	Yes (committed)	No (personal)

Skill properties:

allowed-tools — The exam guide describes this as restricting the skill's tool access, and that is the expected exam answer. In current Claude Code (July 2026) it pre-approves the listed tools so they run without a permission prompt; disallowed-tools and permission deny rules do the restricting
context: fork — Runs in a forked context so skill execution does not pollute the main conversation

Skills are reusable capability modules. They encapsulate a workflow (e.g., "run tests", "deploy to staging") with tool access configured in frontmatter.

Commands
Type	Location	Scope
Project commands	.claude/commands/	Shared with team
Personal commands	~/.claude/commands/	Personal only

Commands are invoked with / prefix. They are templates — predefined prompts that can include $ARGUMENTS placeholders for user input.

Difference from skills: Commands and skills have been merged into one system — both create /commands. A command is a single flat .md file (a prompt template, $ARGUMENTS supported); a skill is a directory with a SKILL.md entrypoint that adds supporting files, frontmatter configuration, and automatic invocation when relevant.

Hooks — Deterministic Enforcement
Hook	Fires When	Use For
PreToolUse	Before a tool executes	Block dangerous calls, validate parameters, require confirmation
PostToolUse	After a tool returns	Validate output, sanitise results, audit logging, trigger side effects

Critical property: Hooks are deterministic — they run as code, not as model instructions. They cannot be bypassed by prompt injection or model reasoning.

Contrast with prompt instructions:

Prompt: "Never delete production files" → Probabilistic, may be violated
PreToolUse hook blocking rm on /prod/ paths → Deterministic, cannot be violated
Working Modes
Mode	When to Use
Plan mode	Complex tasks, multiple possible approaches, need to think before acting
Direct execution	Clear scope, well-defined task, no ambiguity about approach
-p flag (non-interactive)	CI/CD pipelines, automated workflows, no human present

Plan mode signals: The task is complex, has multiple valid approaches, or the consequences of a wrong approach are high. Plan mode forces Claude to outline its approach before executing.

-p flag: Runs Claude Code in non-interactive mode. Essential for CI/CD integration. No confirmation prompts, no interactive input — the command must be self-contained.

CLI Flags (Headless & Non-Interactive)

-p is the most-tested flag, but know the rest of the headless toolkit too.

Flag	What it does
-p / --print	Non-interactive (print) mode for CI/CD and piping
-c / --continue	Resume the most recent conversation in this directory
-r / --resume <id|name>	Resume a specific session
--bare	Minimal mode: skips hooks, skills, plugins, MCP, memory, and CLAUDE.md for faster scripted runs
--output-format text|json|stream-json	Output shape for -p (json and stream-json are parseable)
--json-schema '<schema>'	Schema-validated output for -p (lands in the JSON envelope's structured_output field)
--max-turns <n>	Cap agentic turns in print mode
--permission-mode <mode>	default, acceptEdits, plan, auto, dontAsk, bypassPermissions, manual (alias for default)
--allowedTools / --disallowedTools	Allow or deny tool calls without prompting
--add-dir <path>	Add a readable/editable working directory
--model <alias|name>	Set the session model

System prompt — append vs replace (exam favourite):

Flag	Effect
--append-system-prompt "<text>"	Adds to the default prompt; keeps tool guidance and safety instructions
--system-prompt "<text>"	Replaces the whole default prompt; you own everything it needs

The *-file variants (--append-system-prompt-file, --system-prompt-file) load the same text from a file.

Feedback Techniques
Concrete examples beat prose descriptions. Show the code you want, not a paragraph describing it.
Batch interacting fixes in a single message so the model sees all the constraints at once. Fix independent issues sequentially, one focused change at a time.
Independent review sessions: Never review code in the same session that wrote it. The model retains reasoning bias from the writing session. Start a fresh session for review.
Severity calibration: Use examples to show what constitutes a critical issue vs. a minor style nit. Without calibration, the model treats all issues as equally important.
Permissions & Security
Permissions are controlled at the tool level — you grant or deny access to specific tools.
A subagent's tool set is scoped with the tools field on its AgentDefinition; skills use allowed-tools frontmatter (see Skills System above).
Principle of least privilege: Each agent/skill should have access only to the tools it needs.
Project-level settings (.claude/) are committed and shared. Personal settings (~/.claude/) are not.
Decision Rules for the Exam
If the question says...	The answer is likely...
"guaranteed enforcement", "cannot be bypassed"	Hooks (PreToolUse/PostToolUse)
"style guidance", "preferred approach"	Prompt instructions in CLAUDE.md
"applies only to specific file paths"	.claude/rules/ with paths frontmatter
"reusable workflow with restricted tools"	Skills (.claude/skills/)
"prompt template with arguments"	Commands (.claude/commands/)
"CI/CD pipeline", "automated", "non-interactive"	-p flag
"extra rules but keep default coding behaviour"	--append-system-prompt (not --system-prompt)
"fast scripted run, skip project config/hooks/skills"	--bare
"machine-parseable / schema-validated CI output"	--output-format json + --json-schema
"review quality of generated code"	Independent session (not the writing session)
"multiple approaches, complex task"	Plan mode first
"personal preference, not shared"	~/.claude/ (user-level config)
Common Exam Traps
Trap	Correct Answer
"Put all rules in the project CLAUDE.md"	Wrong — use .claude/rules/ for path-specific rules
"Hooks are prompt-based guardrails"	Wrong — hooks are deterministic code, not prompt instructions
"Review code in the same session that wrote it"	Wrong — model retains reasoning bias; use independent session
"A flat .md file directly inside .claude/skills/ creates a command"	Wrong — skills are directories with a SKILL.md entrypoint; flat files belong in .claude/commands/
"User CLAUDE.md overrides project CLAUDE.md"	Wrong — CLAUDE.md files are concatenated, none overrides another; contradictions may be resolved arbitrarily
"-p flag enables plan mode"	Wrong — -p enables non-interactive (piped) mode for CI/CD
"--append-system-prompt replaces the system prompt"	Wrong — it appends and keeps the defaults; --system-prompt replaces
Previous
Domain 2: Tool Design & MCP Integration
Next
Domain 4: Prompt Engineering & Structured Output