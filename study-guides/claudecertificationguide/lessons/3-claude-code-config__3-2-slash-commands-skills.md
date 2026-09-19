# 3.2 — Custom Slash Commands and Skills | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/3-claude-code-config/3-2-slash-commands-skills

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
3.2
DOMAIN 3
TASK 3.2
Mark Complete
Custom Slash Commands and Skills
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

A skill is a named, reusable set of instructions that Claude Code loads on demand: a Markdown file, with optional YAML frontmatter and supporting files, that tells Claude how to carry out one specific workflow, such as reviewing staged changes or working through a deployment checklist. You invoke it by typing its name as a slash command (/review), or Claude loads it itself when a request matches its description. A skill is not always-on context. CLAUDE.md loads every session; a skill's instructions enter the conversation only when it runs. That distinction, on-demand workflow versus persistent configuration, is the one this task statement turns on.

Custom commands and skills have been merged into a single unified system: the Skills system. The two locations, .claude/skills/ and .claude/commands/, create /commands that behave the same way, but their file structures differ. A skill is a directory containing a SKILL.md file (.claude/skills/deploy/SKILL.md); a command is a flat Markdown file (.claude/commands/deploy.md). A flat file placed directly inside .claude/skills/ does not create a command. The .claude/skills/ path is the canonical location. .claude/commands/ still works for backward compatibility.

The Unified Skills System

Both paths produce the same result — a /command that developers can invoke:

.claude/commands/deploy.md creates /deploy — a flat file whose filename becomes the command name
.claude/skills/deploy/SKILL.md also creates /deploy — one directory per skill, named after the command, with SKILL.md as the required entrypoint inside it

The skills path is the recommended one because it adds features the commands alias does not: a supporting-files directory alongside the SKILL.md, automatic discovery so Claude can load a skill when it matches your intent, and precedence when a skill and a command share the same name (the skill wins). Both paths support the same YAML frontmatter (context: fork, allowed-tools, argument-hint) and both produce the same /command, so existing .claude/commands/ files keep working unchanged.

Two Scoping Levels

Project-scoped (shared via git):

Place skills in .claude/skills/ (canonical) or .claude/commands/ (alias) inside your repository. Both are version-controlled and shared via git. Every developer who clones or pulls the repository gets these commands automatically. Use for team-wide workflows: /review, /deploy-check, /lint, /migration-guide.

MARKDOWN
Copy
<!-- .claude/commands/review.md — creates /review -->
Review the staged changes against our team checklist:
1. Check error handling patterns
2. Verify test coverage for new functions
3. Confirm API naming conventions
4. Flag any hardcoded credentials or secrets


User-scoped (personal):

Place skills in ~/.claude/skills/ (canonical) or ~/.claude/commands/ (alias). These are personal and not version-controlled or shared. Use for individual productivity workflows that other team members do not need.

KEY CONCEPT

The scoping pattern is consistent across Claude Code: project-level (.claude/) is shared via git; user-level (~/.claude/) is personal. This applies to CLAUDE.md, commands/skills, and rules. Memorise this pattern — it appears throughout Domain 3. Both .claude/commands/ and .claude/skills/ are project-scoped and create the same commands; .claude/skills/ is the canonical, fuller-featured path. Keep the file shapes straight, though: skills are directories with a SKILL.md inside; commands are flat .md files.

Skills Frontmatter: Optional Configuration

Skills in .claude/skills/ with SKILL.md files support optional YAML frontmatter configuration. This frontmatter also works with .claude/commands/ files, but .claude/skills/ is the canonical location for configured skills. Skills are task-specific workflows invoked on demand — they aren't loaded automatically like CLAUDE.md.

The three critical frontmatter options:

context: fork

Runs the skill in an isolated sub-agent context. All the verbose output stays contained in the fork, and the main conversation stays clean. This is essential for:

Codebase analysis (produces extensive file listings and code excerpts)
Brainstorming (generates many alternatives and evaluations)
Any task that produces noisy, exploratory output

Without context: fork, skill output flows into the main conversation and consumes context window tokens. For verbose skills, this degrades the quality of subsequent responses.

The frontmatter sits at the top of the skill's SKILL.md. For a skill invoked as /analyse-feature, that file lives at .claude/skills/analyse-feature/SKILL.md:

YAML
Copy
---
description: "Analyse a feature area of the codebase and report structure, patterns and risks"
context: fork
allowed-tools:
  - Read
  - Grep
  - Glob
argument-hint: "Provide a feature description or area of the codebase to analyse"
---


The description line isn't one of the three the exam tests. Leave it out of a real skill, though, and Claude has nothing to match your request against, so the skill only ever fires when you type /analyse-feature yourself.

allowed-tools

Pre-approves the listed tools so Claude can use them without a permission prompt while the skill is active. It does not restrict which tools are available: every other tool remains callable, and your normal permission settings still govern anything that is not listed. Use it to let a trusted workflow run without stopping to ask on each call.

CURRENT STATE

The exam guide (v1.0) describes allowed-tools as restricting the skill's tool access, and that is the keyed answer: if a question asks what the field does, answer "restricts". The pre-approval behaviour above is what current Claude Code (September 2026) actually does. The Domain 3 quick reference and this lesson's Concept Check prompt carry the same two-part note.

YAML
Copy
---
allowed-tools:
  - Read
  - Grep
  - Glob
---


To remove tools from Claude's pool while a skill runs, which is the actual security boundary, list them in disallowed-tools instead, or add deny rules in your permission settings.

argument-hint

A hint shown during autocomplete to indicate the arguments the skill expects. Improves the developer experience by making inputs explicit rather than relying on the developer to remember what the skill needs. It is a label, not an interactive prompt: invoking the skill with no arguments does not stop and ask for them.

CURRENT STATE

Exam guide v1.0 describes argument-hint as prompting developers for required parameters when they invoke the skill without arguments, and that is the expected exam answer. As of 14 August 2026 the skills frontmatter reference defines it as a "Hint shown during autocomplete to indicate expected arguments." No bank or pack item keys on its behaviour, so the exercise above teaches the current behaviour.

YAML
Copy
---
argument-hint: "Specify the module path to analyse (e.g., src/api/auth)"
---


CURRENT STATE: DESCRIPTION IS THE FIELD THAT DOES THE MOST WORK

Those three are the ones the exam guide (v1.0) names, and they're what a question will key on. The live field list is much longer, and the one you'll reach for first isn't on the guide's list at all: description. It's what Claude reads to decide whether a skill applies to what you just asked, so a skill without a useful one only ever runs when you type /name yourself. The docs mark it Recommended rather than required: leave it out and Claude Code falls back to the first paragraph of the skill body, which is usually a worse summary than one you'd write. Also live: disallowed-tools, disable-model-invocation, model, effort and when_to_use. (Claude Code skills docs, verified August 2026.)

Skills vs CLAUDE.md: The Critical Distinction

This distinction is tested directly on the exam:

Skills = on-demand, task-specific workflows. Their descriptions are always in context so Claude knows they exist, but the full skill body loads only when invoked. Invocation can be explicit (/skill-name) or automatic: Claude picks up skills whose description matches the user's intent, or skills with a paths frontmatter field when you're working on matching files. Skills with disable-model-invocation: true require explicit user invocation.
CLAUDE.md = always-loaded, universal standards. Applied automatically to every session, with no invocation step.

The rule: do not put task-specific procedures in CLAUDE.md. Do not put always-on reference material in skills.

API naming conventions that must apply to every code generation task belong in CLAUDE.md (or .claude/rules/). A multi-step codebase analysis workflow that a developer runs occasionally belongs in a skill. For conventions that apply to a specific file type — like test files — path-scoped .claude/rules/ are the best fit because they load as always-on context alongside matching files.

Personal Skill Customisation

Create personal variants in ~/.claude/skills/ (or ~/.claude/commands/) with different names to avoid affecting teammates. If the team has a standard /analyse skill but you prefer a more verbose version, create your own in ~/.claude/skills/ with a different name (e.g., /deep-analyse). Your personal skill doesn't override or conflict with the team version.

Where to Place Custom Commands: Quick Reference
Need	Canonical location	Also works	Scoping
Team-wide command	.claude/skills/<name>/SKILL.md	.claude/commands/<name>.md	Project (shared via git)
Team-wide command with frontmatter config	.claude/skills/<name>/SKILL.md	.claude/commands/<name>.md	Project (shared via git)
Personal command	~/.claude/skills/<name>/SKILL.md	~/.claude/commands/<name>.md	User (not shared)
Universal standards	.claude/CLAUDE.md or root CLAUDE.md	—	Project (always loaded)
Personal preferences	~/.claude/CLAUDE.md	—	User (not shared)
Exam Traps
EXAM TRAP

Creating a flat Markdown file directly inside .claude/skills/ (e.g., .claude/skills/review.md) and expecting a /review command

The two paths create the same commands but have different file structures. A skill is a directory containing a SKILL.md entrypoint (.claude/skills/review/SKILL.md); a flat .md file only creates a command under .claude/commands/ (.claude/commands/review.md). A loose file dropped straight into .claude/skills/ is not picked up.

EXAM TRAP

Placing a team-shared command in a user-scoped path (~/.claude/commands/ or ~/.claude/skills/) instead of a project-scoped path

User-scoped paths (~/.claude/commands/ and ~/.claude/skills/) are personal and not version-controlled. Team commands that should be available to everyone on clone must go in a project-scoped path (.claude/skills/ or .claude/commands/) inside the repository. Both project-scoped paths create the same commands; .claude/skills/ is the canonical, fuller-featured location.

EXAM TRAP

Thinking skills behave like CLAUDE.md for always-on guidance

Skills load on-demand as task-style workflows, not as always-in-context guidance. Claude can auto-invoke a skill when the prompt matches the skill's description (or when a paths-scoped skill matches an edited file), but the skill still loads as a separate invocation-style unit rather than shaping every session by default. CLAUDE.md and .claude/rules/ load automatically into context for every session (or every matching file, for path-scoped rules). If the question asks about always-on conventions that apply to every edit, the answer is CLAUDE.md or .claude/rules/, not a skill.

EXAM TRAP

Not knowing when to use context: fork

context: fork isolates verbose skill output from the main conversation. Without it, brainstorming or codebase analysis output pollutes the context window. The exam will present scenarios where verbose output clutters the main conversation — the fix is context: fork.

EXAM TRAP

Putting task-specific workflows in CLAUDE.md

CLAUDE.md is for always-loaded universal standards. Task-specific procedures (code review workflows, analysis routines, brainstorming templates) belong in skills that are invoked on demand.

Practice Scenario

A team wants a /review command available to everyone who clones the repository. A developer also wants a personal /brainstorm skill that produces verbose codebase analysis output without cluttering the main conversation. Where should each be created and what configuration does the skill need?

OPTION A
Both in ~/.claude/commands/ with a note in the README instructing every developer to copy the two files into their own local setup
OPTION B
Create both in .claude/commands/ so they ship with the repository, giving the brainstorm skill context: fork frontmatter for isolation
OPTION C
/review in .claude/commands/ for team sharing; /brainstorm as ~/.claude/skills/brainstorm/SKILL.md with context: fork frontmatter
OPTION D
/review in CLAUDE.md as a documented procedure, and /brainstorm in .claude/skills/ carrying only its own allowed-tools restrictions
Check Answer
Build Exercise
BUILD EXERCISE
Create Custom Commands and Skills
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Distinguish between project-scoped and user-scoped command locations
Configure SKILL.md frontmatter with context: fork, allowed-tools, and argument-hint
Understand when to use skills vs CLAUDE.md for conventions vs workflows
Verify scoping boundaries between shared and personal configuration
Apply the context: fork pattern to isolate verbose output from the main conversation
Create a project-scoped /review command in .claude/commands/review.md containing a team code review checklist

WHY: Project-scoped commands are shared via git so every developer gets them on clone. The exam tests whether you place team commands in .claude/commands/ (project) vs ~/.claude/commands/ (personal).

YOU SHOULD SEE: A file at .claude/commands/review.md in the repository. Running /review in Claude Code triggers the code review checklist. The command appears when any developer clones the repository.

Stuck? Get a nudge
Create a personal /brainstorm skill in ~/.claude/skills/brainstorm/SKILL.md with context: fork in the frontmatter

WHY: The context: fork frontmatter option isolates verbose skill output from the main conversation. Without it, codebase analysis output fills the context window and degrades subsequent responses. The exam directly tests this concept.

YOU SHOULD SEE: A SKILL.md file at ~/.claude/skills/brainstorm/SKILL.md with YAML frontmatter containing context: fork. The skill is available only in your sessions, not shared with teammates.

Stuck? Get a nudge
Add allowed-tools to the brainstorm skill, restricting it to Read, Grep, and Glob (read-only operations)

WHY: The exam guide describes allowed-tools as restricting which tools a skill can access, and that is the expected exam answer. In current Claude Code it pre-approves the listed tools so they run without a permission prompt (disallowed-tools is the actual boundary), but the intent is the same: a read-only analysis skill should never be using Write or Bash.

YOU SHOULD SEE: The SKILL.md frontmatter now includes an allowed-tools list with exactly Read, Grep, and Glob. Under the exam-guide model the skill cannot use Write or Bash; in current Claude Code the list pre-approves those three tools for promptless use.

Stuck? Get a nudge
Add argument-hint to the brainstorm skill: "Provide a feature description or codebase area to explore"

WHY: The argument-hint is shown during autocomplete to indicate the arguments a skill expects. It improves developer experience and is one of the three SKILL.md frontmatter options tested on the exam.

YOU SHOULD SEE: The SKILL.md frontmatter now includes argument-hint. Typing /brainstorm at the prompt shows the hint text alongside the command in autocomplete, indicating what input it expects.

Stuck? Get a nudge
Test that /review appears for all project users (shared via git) and /brainstorm only for you

WHY: This verifies the scoping boundary that the exam repeatedly tests: .claude/ is project-scoped and shared via git, while ~/.claude/ is user-scoped and personal. Confirming this experimentally solidifies the concept.

YOU SHOULD SEE: Running /review works in any clone of the repository. Running /brainstorm works only in your session. A colleague or fresh clone without your home directory config does not see /brainstorm as an available command.

Stuck? Get a nudge
Invoke the brainstorm skill and verify that its verbose output does not appear in the main conversation context

WHY: The context: fork option runs the skill in an isolated sub-agent. The main conversation receives only the summary, not the full verbose output. This is critical for preserving context window tokens during exploratory tasks.

YOU SHOULD SEE: After invoking /brainstorm with a codebase area, the main conversation shows a concise summary of findings. The verbose file listings, code excerpts, and analysis notes are not visible in the main conversation history. Subsequent responses remain high quality because the context window is not filled with exploration output.

Stuck? Get a nudge
Sources
Claude Code Skills Documentation (custom slash commands are part of the unified Skills system) — Anthropic
Claude Certified Architect Foundations Exam Guide — Task Statement 3.2 — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
CLAUDE.md Hierarchy, Scoping, and Modular Organisation
NEXT LESSON
Path-Specific Rules for Conditional Convention Loading