# 3.3 — Path-Specific Rules for Conditional Convention Loading | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/3-claude-code-config/3-3-path-specific-rules

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
3.3
DOMAIN 3
TASK 3.3
Mark Complete
Path-Specific Rules for Conditional Convention Loading
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Path-specific rules apply conventions conditionally, based on which files you're editing. They solve something neither root CLAUDE.md nor directory-level CLAUDE.md handles well: conventions that must apply to one file type scattered across many directories.

How Path-Specific Rules Work

Rule files live in the .claude/rules/ directory. Each file carries YAML frontmatter with a paths field specifying glob patterns. The rules inside load only when you're editing files that match those patterns.

YAML
Copy
---
paths: ["terraform/**/*"]
---
# Terraform Conventions

- Use snake_case for all resource names
- Tag every resource with environment and team labels
- Never hardcode AMI IDs — use data sources
- All modules must have a variables.tf, outputs.tf, and README.md


Edit a file matching terraform/**/* and these rules load automatically. Edit a React component or an API handler and they don't. The rules stay invisible until they're relevant.

Glob Patterns Match Across the Entire Codebase

This is where they earn their keep. A glob like **/*.test.tsx catches every test file in the codebase, wherever it sits. Take a typical project structure:

Copy
src/
  components/
    Button.tsx
    Button.test.tsx
  api/
    auth.ts
    auth.test.ts
  utils/
    format.ts
    format.test.ts
  pages/
    dashboard/
      Dashboard.tsx
      Dashboard.test.tsx


Test files sit next to their source files across four directories. A path-specific rule with paths: ["**/*.test.tsx", "**/*.test.ts"] applies the same test conventions to every one of them, automatically.

Why Not Directory-Level CLAUDE.md?

A directory-level CLAUDE.md applies to files in that one directory. To cover test files spread across 50+ directories, you'd have to drop a CLAUDE.md into every single directory that holds tests. That means:

50+ copies of the same conventions
Every new directory with tests needs a new copy
Any convention change requires updating all 50+ files
Inevitable drift as some copies fall behind

Path-specific rules with glob patterns eliminate this entirely. One file, one pattern, universal coverage.

Why Not Root CLAUDE.md?

Root CLAUDE.md loads for every session, regardless of which files you edit. Put your Terraform conventions in the root CLAUDE.md and they burn tokens even while you're editing React components. Put your test conventions there and they load while you're writing API handlers.

KEY CONCEPT

Path-scoped rules are more token-efficient than root CLAUDE.md because they load ONLY when editing matching files. This reduces irrelevant context and keeps the model focused on conventions that actually apply to the current work. In large projects with many convention categories, this efficiency gain is substantial.

Practical Rule File Examples

Test conventions across the entire codebase:

YAML
Copy
---
paths: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"]
---
# Test Conventions

- Use describe/it blocks with descriptive names that read as sentences
- Each test file must have at least one happy path and one error case
- Use factory functions for test data, not inline object literals
- Mock external services at the module boundary, not individual functions
- Assert behaviour, not implementation details


API conventions for any route handler:

YAML
Copy
---
paths: ["src/api/**/*", "**/routes/**/*", "**/*.controller.ts"]
---
# API Conventions

- All endpoints return { data, error, metadata } response shape
- Use Zod schemas for request validation at the handler boundary
- Log request ID on every error response
- Rate limiting configuration must be explicit, not inherited from defaults


Infrastructure-as-code conventions:

YAML
Copy
---
paths: ["terraform/**/*", "**/*.tf", "infrastructure/**/*"]
---
# Infrastructure Conventions

- State files must reference remote backends, never local
- Use workspaces for environment separation
- Every module must be versioned with a CHANGELOG

When to Use Each Approach
Scenario	Best approach
Universal team standards that apply to all code	Root CLAUDE.md
Conventions for one specific package directory	Directory-level CLAUDE.md
Conventions for a file type spread across many directories	Path-specific rules with glob patterns
Task-specific workflows invoked on demand	Skills in .claude/skills/

The exam frequently presents the scenario of test files co-located with source files across many directories. The answer is always path-specific rules with glob patterns.

Exam Traps
EXAM TRAP

Choosing directory-level CLAUDE.md over path-specific rules for cross-directory conventions

When conventions must apply to files spread across 50+ directories (like co-located test files), path-specific rules with glob patterns are correct. Directory-level CLAUDE.md would require placing a file in every directory — a massive maintenance burden.

EXAM TRAP

Placing file-type-specific conventions in root CLAUDE.md

Root CLAUDE.md loads for every session regardless of which files you edit. Terraform conventions consume tokens when editing React components. Path-specific rules load only when editing matching files, preserving token budget.

EXAM TRAP

Confusing skills with path-specific rules for automatic convention application

Both skills and .claude/rules/ can auto-activate via a paths frontmatter, but they serve different purposes. Rules stay in context as background guidance — loaded when Claude reads a matching file — so they shape every edit. Skills load on-demand as task-style workflows, triggered either by the model's intent match or by explicit invocation. When the question asks about automatic, always-on convention loading for a file type, path-specific rules are the right answer.

Practice Scenario

A codebase has test files co-located with source files throughout 50+ directories (e.g., Button.test.tsx next to Button.tsx). The team wants all tests to follow the same conventions regardless of location. What is the most maintainable approach?

OPTION A
Add all the test conventions to the root CLAUDE.md file so they are loaded into context for every session
OPTION B
Create a rule file in .claude/rules/ with YAML frontmatter paths: ["**/*.test.tsx", "**/*.test.ts"] holding the test conventions for the repo
OPTION C
Place a CLAUDE.md file in every directory that contains test files, each carrying a copy of the team test conventions
OPTION D
Create a skill in .claude/skills/ that includes the test conventions and instruct developers to invoke it before writing or editing any tests
Check Answer
Build Exercise
BUILD EXERCISE
Configure Path-Specific Rules with Glob Patterns
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Write YAML frontmatter with glob patterns for conditional rule loading
Apply path-specific rules to files spread across many directories
Understand why path-specific rules are more token-efficient than root CLAUDE.md
Distinguish when to use path-specific rules vs directory-level CLAUDE.md
Verify conditional loading behaviour using the /context command
Create .claude/rules/testing.md with YAML frontmatter paths: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"] and test conventions (naming, assertions, mocking patterns)

WHY: Path-specific rules with glob patterns are the correct solution for conventions that apply to a file type spread across many directories. The exam favourite scenario is test files co-located with source files across 50+ directories.

YOU SHOULD SEE: A file at .claude/rules/testing.md with YAML frontmatter containing a paths array with glob patterns. The body contains at least three test conventions covering naming, assertions, and mocking.

Stuck? Get a nudge
Create .claude/rules/api-conventions.md with paths: ["src/api/**/*", "**/routes/**/*"] and API conventions (response shape, validation, error handling)

WHY: Separating API conventions into their own path-scoped rule means they only load when editing API files. This avoids consuming tokens with irrelevant context when working on frontend or infrastructure code.

YOU SHOULD SEE: A file at .claude/rules/api-conventions.md with YAML frontmatter paths targeting API directories. The body contains at least three API conventions.

Stuck? Get a nudge
Create .claude/rules/terraform.md with paths: ["terraform/**/*", "**/*.tf"] and infrastructure conventions

WHY: Infrastructure conventions are completely irrelevant when editing application code. Path-scoped rules ensure Terraform rules never consume tokens during React or API development sessions.

YOU SHOULD SEE: A file at .claude/rules/terraform.md with YAML frontmatter paths matching Terraform files. The body contains infrastructure-specific conventions.

Stuck? Get a nudge
Edit a test file and use /context to verify that testing rules are loaded but API and Terraform rules are not

WHY: This proves the conditional loading mechanism works. The exam tests whether you understand that path-specific rules load only for matching files, and /context is the diagnostic tool to verify this.

YOU SHOULD SEE: When editing a .test.ts file, /context output lists .claude/rules/testing.md as loaded. The .claude/rules/api-conventions.md and .claude/rules/terraform.md files do NOT appear in the /context output.

Stuck? Get a nudge
Edit an API handler and verify that API rules load while testing and Terraform rules do not

WHY: This is the complementary verification. Switching contexts should swap which rules are loaded, confirming that the glob patterns correctly scope each rule file.

YOU SHOULD SEE: When editing a file in src/api/, /context output lists .claude/rules/api-conventions.md as loaded. The testing and Terraform rule files do NOT appear.

Stuck? Get a nudge
Compare the token footprint when all conventions are in root CLAUDE.md versus split into path-specific rules

WHY: Token efficiency is a key exam concept. Root CLAUDE.md loads all conventions for every session regardless of relevance. Path-specific rules load only matching conventions, reducing irrelevant context and preserving token budget for actual work.

YOU SHOULD SEE: With all conventions in root CLAUDE.md, /context shows the full set of conventions loaded even when editing a simple utility file. With path-specific rules, /context shows only the relevant subset. The token count for loaded configuration is measurably smaller when using path-specific rules for targeted editing sessions.

Stuck? Get a nudge
Sources
Claude Code Memory and Rules Documentation — Anthropic
Claude Certified Architect Foundations Exam Guide — Task Statement 3.3 — Anthropic
Claude Certified Architect Foundations Exam Guide — Sample Question 6 — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Custom Slash Commands and Skills
NEXT LESSON
Plan Mode vs Direct Execution