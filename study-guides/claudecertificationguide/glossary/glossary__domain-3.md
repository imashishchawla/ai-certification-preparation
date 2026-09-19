# Glossary: Domain 3 — Claude Code Configuration & Workflows | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/glossary/domain-3

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
Domain 3
DOMAIN 3
20%
Glossary: Claude Code Configuration & Workflows

Quick-lookup definitions for the 20% exam domain. Each entry includes a concise definition and exam context. Follow the lesson links to dive deeper.

CLAUDE.md

A markdown file that provides persistent instructions to Claude Code. It acts as a project-level system prompt, loaded automatically when Claude Code starts in a directory. CLAUDE.md files can exist at multiple levels (user home, project root, subdirectories) and every applicable file is concatenated into context — none overrides another, and if two rules contradict, Claude may pick one arbitrarily.

Exam context: This is heavily tested. Know the three scopes (user, project, directory), that files concatenate in a documented load order rather than overriding, and that both root CLAUDE.md and .claude/CLAUDE.md are valid, version-controlled project-level locations.

See also: 3.1 CLAUDE.md Hierarchy

Hooks

Custom scripts that run at specific points during Claude Code's execution lifecycle. Hooks can trigger before or after tool calls, on notification events, or when a session starts. They are defined in the settings.json configuration and run as shell commands on your local machine.

Exam context: Know the available hook types (PreToolUse, PostToolUse, Notification, etc.), how to configure them, and that a PreToolUse hook can block a tool call before it executes. Hooks are deterministic code, not prompt instructions, so they cannot be bypassed by model reasoning.

See also: 1.5 Agent SDK Hooks

Permissions

The security system that controls which tools and operations Claude Code can execute. Permissions operate on an allowlist/denylist model — you can explicitly permit or deny specific tools, file paths, and commands. The default mode requires user confirmation for potentially destructive operations.

Exam context: Know the permission modes (default, acceptEdits, plan, bypassPermissions, plus auto, dontAsk, and manual as an alias for default) and the allow/deny rule patterns. Understand which operations require confirmation by default and how to configure auto-approval for trusted operations.

See also: 3.6 CI/CD Integration

Slash Commands

Custom reusable commands defined as markdown files in the .claude/commands/ directory. When a user types / in Claude Code, available slash commands appear as options. Each command file contains a prompt template that can include $ARGUMENTS placeholders for dynamic input. Commands and skills have been merged into one system: a command is a flat .md file, while a skill is a directory with a SKILL.md entrypoint, and both create /commands.

Exam context: Know where slash command files live (.claude/commands/ for project-level, ~/.claude/commands/ for user-level), the file naming convention, how $ARGUMENTS substitution works, and the file-structure difference from skills.

See also: 3.2 Custom Slash Commands and Skills

CI/CD Integration

Running Claude Code in non-interactive mode within continuous integration and deployment pipelines. This uses the claude -p flag for single-prompt mode or piped input. It typically needs credentials configured for the environment and runs with --allowedTools to restrict available operations.

Exam context: The exam tests how to configure Claude Code for headless environments. Know the flags (-p, --output-format json) and how to restrict tool access in automated pipelines. Note that the guide's out-of-scope list excludes Claude API authentication and billing, so credential mechanics are not tested.

See also: 3.6 CI/CD Integration

settings.json Precedence

The hierarchy that controls Claude Code's settings.json behaviour. Settings can be defined at the project level (.claude/settings.json), user level (~/.claude/settings.json), or enterprise level. More specific scopes override broader ones, with enterprise settings taking the highest priority.

Exam context: Understand how settings.json layers merge and which one wins. Do not carry this override model across to CLAUDE.md files: those are concatenated into context rather than overriding one another, and "more specific scope wins" is a keyed distractor there.

See also: 3.6 CI/CD Integration

Allowlist/Denylist

Permission configuration patterns for controlling tool access. An allowlist names the tools that may run (in permission settings, everything unnamed still prompts rather than being silently denied). A denylist specifies which tools are blocked (everything else is permitted). These are configured in settings.json under the permissions key.

Exam context: Know when to use an allowlist versus a denylist. Allowlists are the tighter default for unattended pipelines. Denylists are more permissive. Note the related trap: a skill's allowed-tools frontmatter pre-approves tools rather than restricting them — disallowed-tools and permission deny rules are the actual boundary.

See also: 3.6 CI/CD Integration

settings.json

The JSON configuration file that controls Claude Code's behaviour, including permissions, hooks, MCP servers, and model preferences. It can exist at the project level (.claude/settings.json) or user level (~/.claude/settings.json). Project-level settings are typically committed to the repository.

Exam context: Know the key configuration sections (permissions, hooks, mcpServers) and the file's location at different scopes. Understand that project-level settings apply to all team members who clone the repo.

See also: 3.1 CLAUDE.md Hierarchy

.claude Directory

A directory at the project root that stores Claude Code's project-level configuration. It contains settings.json (committed to the repo for shared team settings), settings.local.json (git-ignored for personal settings), and the commands/ subdirectory for slash commands.

Exam context: Know what goes in .claude/ versus what stays in the project root. Understand which files are committed (settings.json, commands/) and which are local-only (settings.local.json).

See also: 3.1 CLAUDE.md Hierarchy

Subagents

Separate Claude Code instances spawned by the main agent using the Task tool to handle specific, scoped pieces of work. Each subagent runs in its own context with its own tool access, preventing context pollution in the main conversation. The main agent coordinates subagents and aggregates their results.

Exam context: Know when to use subagents versus handling everything in the main conversation. Subagents are useful for parallel tasks, large codebases, or when you want to isolate a task's context. Understand that subagents do not share memory with the parent.

See also: 1.3 Subagent Invocation and Context Passing

Previous
Domain 2: Tool Design & MCP Integration
Next
Domain 4: Prompt Engineering & Structured Output