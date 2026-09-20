---
title: "2 Tool Design Mcp__2 4 Mcp Server Integration"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 2.4 — MCP Server Integration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-4-mcp-server-integration

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
2.4
DOMAIN 2
TASK 2.4
Mark Complete
MCP Server Integration
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

MCP (Model Context Protocol) servers extend Claude's capabilities by connecting it to external systems — databases, APIs, development tools, issue trackers. Configuring them correctly determines whether your team shares a consistent toolset or descends into configuration chaos.

The Scoping Hierarchy

MCP server configuration lives at two levels, and mixing them up is where most setup problems start.

Project-level: .mcp.json Lives in the project repository root. Version-controlled. Shared with every team member who clones or pulls the repository. Use this for servers that the entire team needs — your Jira integration, your GitHub tools, your internal API connectors.

JSON
Copy
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp/authv2"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${WORKSPACE_ROOT:-.}"]
    }
  }
}


Note the two entry shapes. A remote server declares "type": "http" and a url. A local one declares a command and args, and speaks over stdio. An entry with a url but no type is a configuration error — Claude Code reads it as a stdio server, skips it, and tells you to add the type. Both GitHub and Atlassian ship official remote servers now, which is why neither is an npx line.

User-level: ~/.claude.json Lives in the user's home directory. Personal. NOT version-controlled. NOT shared with teammates. Use this for experimental servers, personal integrations, or servers you're testing before proposing them to the team.

CURRENT STATE

Exam guide v1.0 describes MCP configuration at two levels, project and user, and that is the expected exam answer. As of 14 August 2026 the MCP documentation documents three scopes — local (the default), project and user — selected with -s / --scope, with ~/.claude.json holding both the local and user entries. On the exam, answer with the two-level project-vs-user split.

Key principle: all tools from all configured servers (both project-level and user-level) are discovered at connection time and available simultaneously. There's no manual activation step — if a server is configured and reachable, its tools appear in the agent's toolkit.

Environment Variable Expansion

The .mcp.json file supports ${VARIABLE_NAME} syntax for environment variable expansion. This is how you keep credentials out of version control whilst still sharing server configuration with your team.

JSON
Copy
{
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    "DATABASE_URL": "${DATABASE_URL}"
  }
}


Each developer sets their own tokens locally (in their shell profile, .env file, or secrets manager). The .mcp.json file references the variable names, not the values. This means:

The configuration file is safe to commit to version control
Each developer authenticates with their own credentials
Token rotation does not require config file changes
No secrets leak through repository history

There is a second form worth knowing: ${VAR:-default} expands to VAR when it is set and falls back to default when it is not. Use it for machine-specific paths that have a sensible fallback, as in the ${WORKSPACE_ROOT:-.} argument above. As of 14 August 2026, an unset variable with no default does not stop the rest of the configuration loading. Claude Code warns and carries on, so do not rely on a missing token failing loudly.

MCP Resources

MCP resources expose content catalogues to agents without requiring exploratory tool calls. Instead of calling a tool to discover what data exists, the agent gets that information upfront.

That is the exam guide's framing and the keyed answer. One precision from the MCP specification (September 2026): resources are application-controlled. The server lists them, but the client decides when to attach one to the model's context, so the agent sees a resource only when the host surfaces it. Claude Code does that through @server:resource mentions and a resource-listing tool.

Examples of what to expose as resources:

Issue summaries — a list of current Jira issues with titles and statuses
Documentation hierarchies — a table of contents for your internal docs
Database schemas — table names, column types, and relationships

The payoff is fewer wasted calls. Without resources, an agent might call list_tables, then describe_table for every table, burning tool calls just to get its bearings. With a database schema resource, it knows immediately.

Resources show agents what data is available. Tools let them act on it.

The Build-vs-Use Decision

This decision comes up constantly, in the exam and in real work. Your team needs to integrate with an external system: build a custom MCP server, or use an existing community one?

Use community servers for standard integrations:

Jira, GitHub, Slack, Linear, Notion — these all have maintained community MCP servers
They cover standard use cases, are tested by the community, and receive updates
Using them saves development time and maintenance burden

Build custom servers only when:

Your team has specific workflows that community servers cannot handle
You need custom business logic embedded in the tool layer
You require integration with proprietary internal systems that have no community server

The exam consistently favours the pragmatic choice. "Evaluate community servers first" is always correct when a standard integration is involved. "Build custom" is only correct when the scenario explicitly describes team-specific requirements that community servers cannot meet.

Enhancing MCP Tool Descriptions

Here's a subtle one: when an MCP tool has a sparse description, the agent may prefer built-in tools (like Grep) even when the MCP tool is more capable. The model simply has better context about built-in tools — their descriptions are rich and detailed.

The fix: enhance your MCP tool descriptions to explain capabilities and outputs in detail. Instead of:

Copy
search_codebase: "Searches code"


Write:

Copy
search_codebase: "Performs semantic code search across the
entire repository using AST-aware indexing. Returns matching
functions, classes, and methods with full context including
file path, line numbers, and surrounding code. More accurate
than text-based grep for finding code by intent rather than
exact string match. Use this instead of Grep when searching
for code by what it does rather than what it contains."


The enhanced description gives the model enough context to prefer the MCP tool when it's genuinely more capable than the built-in alternative.

KEY CONCEPT

Project-level .mcp.json is version-controlled and shared with the team. User-level ~/.claude.json is personal and not shared. Use ${ENV_VAR} syntax to keep credentials out of version control.

Exam Traps
EXAM TRAP

Building a custom MCP server for a standard integration like Jira

Community MCP servers exist for standard integrations and should be evaluated first. Custom builds are only justified for team-specific workflows that community servers cannot handle.

EXAM TRAP

Putting team-wide MCP server configuration in ~/.claude.json

~/.claude.json is user-level and personal — it is not version-controlled or shared. Team-wide servers belong in .mcp.json at the project root.

EXAM TRAP

Committing credentials directly in .mcp.json instead of using environment variable expansion

Credentials in version control are a security risk. Use ${GITHUB_TOKEN} syntax so each developer sets tokens locally and secrets never enter repository history.

EXAM TRAP

Leaving MCP tool descriptions sparse, causing the agent to prefer built-in tools

The model defaults to tools it understands best. Sparse MCP descriptions lose out to detailed built-in tool descriptions. Enhance MCP descriptions to explain capabilities and outputs fully.

Practice Scenario

A team needs to integrate with Jira for issue tracking in their Claude Code workflow. A developer proposes building a custom MCP server. What is the correct first step?

OPTION A
Evaluate existing community MCP servers for Jira and only build custom if they cannot handle team-specific workflows.
OPTION B
Add the Jira integration to ~/.claude.json so that each developer can configure their own connection to Jira independently.
OPTION C
Use the Jira REST API directly from Bash commands instead of MCP, which avoids the whole server setup and its configuration.
OPTION D
Build a custom MCP server exposing exactly the Jira API endpoints the team needs, so the integration matches their workflow precisely.
Check Answer
Build Exercise
BUILD EXERCISE
Configure MCP Servers with Scoping and Environment Variables
Difficulty
30 MINUTES

WHAT YOU'LL LEARN

Configure project-level MCP servers in .mcp.json for team-wide sharing
Use environment variable expansion to keep credentials out of version control
Distinguish between project-level and user-level MCP configuration scoping
Expose MCP resources to reduce unnecessary exploratory tool calls
Write enhanced MCP tool descriptions that compete with built-in tool descriptions
Create a .mcp.json file in your project root configuring an official MCP server (e.g. the GitHub remote endpoint)

WHY: Project-level .mcp.json is version-controlled and shared with every team member who clones the repository. The exam tests whether you know that team-wide servers belong here, not in ~/.claude.json. Using community servers for standard integrations is always the correct first choice.

YOU SHOULD SEE: A .mcp.json file at the project root containing an mcpServers object with at least one server entry. A remote server needs "type": "http" and a url; a local one needs command and args.

Stuck? Get a nudge
Use ${GITHUB_TOKEN} environment variable expansion for authentication credentials

WHY: Committing credentials directly in .mcp.json is a security risk the exam penalises. The ${VARIABLE_NAME} syntax lets the configuration file reference environment variables without containing the actual values, keeping secrets out of repository history.

YOU SHOULD SEE: The headers section of your server configuration contains ${GITHUB_TOKEN} (not an actual token value). Running git diff confirms no secrets are staged for commit. Each developer sets their own token locally.

Stuck? Get a nudge
Add a personal or experimental MCP server to ~/.claude.json for user-level configuration

WHY: User-level configuration in ~/.claude.json is personal, not version-controlled, and not shared with teammates. The exam tests whether you know the scoping hierarchy: .mcp.json for team servers, ~/.claude.json for personal or experimental servers.

YOU SHOULD SEE: A ~/.claude.json file with an mcpServers entry for a personal server (e.g. an experimental integration you are testing). This file is NOT in your project repository and NOT in version control.

Stuck? Get a nudge
Expose a content catalogue (e.g. a documentation hierarchy or database schema) as an MCP resource

WHY: MCP resources give agents visibility into available data without requiring exploratory tool calls. Without resources, an agent might call list_tables then describe_table for every table, wasting multiple tool calls. A schema resource makes that information available immediately.

YOU SHOULD SEE: An MCP resource definition that exposes structured data (e.g. a list of database tables with column types, or a documentation table of contents) accessible at a URI like db://schema/main. The resource should have a name, description, and mimeType.

Stuck? Get a nudge
Enhance the tool descriptions for your configured MCP server to explain capabilities and outputs in detail, preventing the agent from preferring built-in tools

WHY: When an MCP tool has a sparse description, the agent prefers built-in tools like Grep because their descriptions are richer and more detailed. The exam tests whether you know that enhanced MCP descriptions are required to compete with built-in tools for selection priority.

YOU SHOULD SEE: Tool descriptions that are 3-5 sentences long, explaining what the tool does, what it returns, when to use it, and how it compares to built-in alternatives. For example, a search_codebase tool description that explicitly states it is more accurate than Grep for semantic searches.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.4 — Anthropic
MCP Server Configuration — Claude Code Documentation — Anthropic
Model Context Protocol — Resources — Model Context Protocol
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Tool Distribution & Tool Choice
NEXT LESSON
Built-in Tools