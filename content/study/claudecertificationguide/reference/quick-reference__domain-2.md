---
title: "Quick Reference__domain 2"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# Quick Reference: Domain 2 — Tool Design & MCP Integration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/quick-reference/domain-2

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
Domain 2
DOMAIN 2
18%
Quick Reference: Domain 2 — Tool Design & MCP Integration
Print this page
Tool Description Design

Tool descriptions are the primary mechanism Claude uses to select which tool to call. They matter more than tool names.

What to include in a tool description:

What the tool does (one sentence)
Expected input formats and constraints
What it returns (shape of the response)
Boundary conditions (what it does NOT do)
Example queries that would trigger this tool

Count the tools before you pick the remedy. Misselection has two different causes and they take opposite fixes:

The tools are...	The fix
Few enough to reason about, but two read alike	Sharpen the descriptions (TS 2.1)
Different jobs (query, transform, export)	Split by role into focused agents (TS 2.3)
Variations on one job, sharing a shape	Consolidate into one parameterised tool (TS 2.3)

Descriptions are the first fix only when the toolkit is already a workable size. Past roughly 4–5 tools per agent, selection degrades on decision complexity alone, and rewriting 22 descriptions leaves that untouched. Few-shot examples are not a sanctioned step for misselection — the bank keys them wrong.

Schema Design Rules
Keep each agent's tool set small and role-focused. The guide contrasts 4–5 tools with 18 to show how selection reliability degrades as the set grows.
Use descriptive parameter names — customer_email not email, order_date_range not range.
Mark parameters as required only when truly mandatory. Optional parameters with defaults reduce friction.
Use enum types for constrained choices — they guide the model better than freeform strings.
Diagnose before you fix. A small toolkit with two lookalike tools is a description problem. An oversized toolkit is a distribution problem, and no amount of description quality rescues it.
tool_choice Modes
Mode	Behaviour	Use When
auto	Model decides whether to call a tool	Default for most agentic loops
any	Model must call at least one tool (chooses which)	Guaranteed structured output when the input could match one of several schemas
tool (forced)	Model must call a specific named tool	Guaranteed schema compliance for one known structure

Key exam point: Use tool_choice: { type: "tool", name: "extract_data" } when you need one specific structure every time. When the document type is unknown and any of several extraction schemas could apply, tool_choice: "any" still guarantees structured output while letting the model pick the right tool.

auto is the correct default for agentic loops — the model needs freedom to decide when to call tools and when to respond with text.

MCP Architecture

Three-layer model: Host ⊃ Client ↔ Server (the host application contains the client; the client connects to servers)

Layer	Role	Example
Host	The application that manages client lifecycle	Claude Desktop, an IDE extension
Client	The connector inside the host, which connects to one server and routes its tool calls	The client instance the desktop app creates per server
Server	Exposes tools, resources, prompts	A database connector, file system server

Protocol: JSON-RPC 2.0 over stdio or streamable HTTP.

Configuration files:

.mcp.json in project root — project-level MCP servers (shared with team)
~/.claude.json — personal/global MCP servers (not committed)

Key rule: Use community MCP servers first. Only build custom servers when no community server meets your requirements.

Tool Error Handling

Structured error metadata (the exam-tested pattern). This is an application-level convention carried inside the result content, not part of the MCP envelope — the protocol's CallToolResult defines only content, structuredContent and isError:

Copy
{
  "errorCategory": "transient" | "validation" | "business" | "permission",
  "isRetryable": true | false,
  "description": "Rate limit hit; retry after 5 seconds"
}


The four categories: transient (timeouts, service unavailability — isRetryable: true, resend as-is), validation (invalid input — false, correct the input and send a new call), business (policy violations — false, take an alternative path), permission (missing access — false, escalate to a principal with access). Only transient is retryable: the flag asks whether resending this call can work, and everything else needs something to change first. "Not found" is deliberately absent: a query that finds nothing is a valid empty result, not an error.

Critical distinction:

Access failure (auth error, network timeout) → Retry or escalate. Something went wrong.
Valid empty result (search returned 0 results) → Accept. The absence of data IS the answer.

Never treat a valid empty result as an error. Never silently swallow an access failure.

Tool Selection in Claude Code
Tool	Purpose	Use When
Grep	Search file contents by pattern	Looking for code patterns, string occurrences
Glob	Find files by name/path pattern	Looking for files by extension or naming convention
Read	Read a specific file	You know the exact file path
Write	Write a complete file	Creating a file, or replacing one wholesale
Edit	Modify file contents	Making targeted changes to existing files
Bash	Run shell commands	Build, test, git operations, anything not covered above

Selection principle: Use the most specific tool. Grep for content search, Glob for file discovery, Read for known files. Avoid Bash for tasks that specialised tools handle better.

When Edit fails on a non-unique match: the exam guide names Read + Write as the tested fallback — load the full file, then write the complete modified version.

Current state (checked 14 August 2026): the live tools reference describes Claude first supplying a longer anchor string with enough surrounding context to pin down one occurrence, or setting replace_all: true. Answer Read + Write on the exam; recognise the widening and replace_all behaviour in current Claude Code.

Decision Rules for the Exam
If the question says...	The answer is likely...
"Claude keeps picking the wrong tool" (small toolkit)	Improve tool descriptions
"Claude keeps picking the wrong tool" (20+ tools)	Split by role or consolidate — not descriptions
"guaranteed structured output"	Forced tool_choice for one known schema; tool_choice: any across multiple schemas
"model should decide which tool"	tool_choice: auto
"must call a tool but can choose which"	tool_choice: any
"search returned no results"	Valid empty result — accept it
"API returned 401/timeout"	Access failure — retry or escalate
"too many tools, selection errors"	Split into role-scoped agents, or consolidate variants of one job
"need a custom MCP server"	Check community servers first
"project-wide MCP config"	.mcp.json in project root
"personal MCP config"	~/.claude.json
Common Exam Traps
Trap	Correct Answer
"Improve all 22 tool descriptions to fix misselection"	Wrong — past ~4–5 tools the problem is decision complexity, not wording
"Add few-shot examples to fix misselection"	Wrong — not a sanctioned remedy; fix the descriptions or the distribution
"tool_choice: any guarantees a specific tool"	Wrong — any forces a tool call, not a specific one
"MCP servers connect directly to each other"	Wrong — all communication goes through the client/host
"Empty search results mean the tool failed"	Wrong — absence of data is a valid result
"Return generic error string from tools"	Wrong — return structured metadata (category, retryable, suggestion)
"Build a custom MCP server for common integrations"	Wrong — check community servers first
"Tool name is the primary selection signal"	Wrong — tool description is the primary signal
Previous
Domain 1: Agentic Architecture & Orchestration
Next
Domain 3: Claude Code Configuration & Workflows