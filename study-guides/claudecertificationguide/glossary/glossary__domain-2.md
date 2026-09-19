# Glossary: Domain 2 — Tool Design & MCP Integration | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/glossary/domain-2

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
Domain 2
DOMAIN 2
18%
Glossary: Tool Design & MCP Integration

Quick-lookup definitions for the 18% exam domain. Each entry includes a concise definition and exam context. Follow the lesson links to dive deeper.

Tool Schema

A JSON Schema definition that describes a tool's name, purpose, and expected input parameters. Claude uses the schema to understand what a tool does and how to call it correctly. Well-designed schemas include clear descriptions, constrained types, and sensible defaults.

Exam context: The exam tests schema design best practices — descriptive names, detailed parameter descriptions, required vs optional fields, and enum constraints. Know that better descriptions lead to better tool selection by Claude.

See also: 2.1 Tool Interface Design

MCP Server

A process that exposes tools, resources, and prompts to MCP clients via the Model Context Protocol. An MCP server registers its capabilities and handles incoming tool calls. Servers can be local (running on the same machine) or remote (accessible over a network).

Exam context: Know the distinction between MCP servers and regular tool definitions passed directly via the API. Understand what an MCP server exposes (tools, resources, prompts) and how it communicates with clients.

See also: 2.4 MCP Server Integration

MCP Client

The component that connects to one or more MCP servers, discovers their capabilities, and forwards tool calls from Claude to the appropriate server. In Claude Code, the MCP client is built in. In custom applications, you implement the client using the MCP SDK.

Exam context: Questions may ask about the client's responsibilities: capability discovery, transport management, and routing tool calls to the correct server. Know how a client handles multiple servers with overlapping tool names.

See also: 2.4 MCP Server Integration

MCP Transport

The communication layer between an MCP client and server. The two standard transports are stdio (communication over standard input/output, used for local processes) and streamable HTTP (communication over HTTP with server-sent events, used for remote servers). The transport is configured when connecting a client to a server.

Exam context: Know which transport to use in which scenario. stdio is simpler for local tools; streamable HTTP is necessary for remote or shared servers. The exam may ask about transport selection for specific deployment scenarios.

See also: 2.4 MCP Server Integration

JSON Schema

The specification used to define the structure of tool input parameters in the Claude API. Each tool's input_schema is a JSON Schema object that specifies property types, required fields, enums, and descriptions. Claude uses this schema to generate valid tool call inputs.

Exam context: You need to read and write JSON Schema fluently. Common exam traps include confusing required (an array at the object level) with individual property attributes, and forgetting that additionalProperties: false prevents unexpected fields.

See also: 2.1 Tool Interface Design

Tool Selection

The process by which Claude decides which tool to call based on the user's request and the available tool schemas. Claude evaluates tool names and descriptions to find the best match. When many tools are available, clear and distinct descriptions become critical for accurate selection.

Exam context: The exam tests strategies for improving tool selection accuracy: descriptive naming, non-overlapping tool descriptions, and reducing the number of tools presented at any one time. Know the concept of tool filtering or routing to narrow down available tools.

See also: 2.3 Tool Distribution & Tool Choice

Tool Routing

A technique for directing tool calls to the correct handler when multiple tools or MCP servers are available. Routing can happen at the application level (filtering which tools Claude sees based on context) or at the model level (Claude selecting from available tools). Application-level routing reduces ambiguity and improves selection accuracy.

Exam context: Know the difference between letting Claude choose from all tools versus pre-filtering by request type. Do not reach for a routing layer as the fix for a large tool set — the exam keys that wrong. An oversized toolkit is a distribution problem: split into role-scoped agents, or consolidate variants of one job into a parameterised tool.

See also: 2.3 Tool Distribution & Tool Choice

Resources (MCP)

Read-only data sources exposed by an MCP server. Unlike tools (which perform actions), resources provide contextual information that can be loaded into Claude's context. Examples include file contents, database records, or documentation. Resources are identified by URIs and can be listed and read by the client.

Exam context: Understand the distinction between MCP resources and tools. Resources are for reading data; tools are for performing actions. The exam may test when to use a resource versus a tool for data retrieval.

See also: 2.4 MCP Server Integration

Prompts (MCP)

Reusable prompt templates exposed by an MCP server. These are pre-defined message sequences that a client can retrieve and use to interact with Claude in standardised ways. Prompts can include arguments that customise the template at runtime.

Exam context: This is a less frequently tested concept, but you should know that MCP servers can expose prompts alongside tools and resources. Understand the three capability types: tools, resources, and prompts.

See also: 2.4 MCP Server Integration

Tool Error Handling

Strategies for managing failures when a tool call returns an error or unexpected result. Best practices include returning is_error: true in the tool_result with a descriptive error message, so Claude can decide how to recover. Never silently swallow errors — Claude needs to know what went wrong to adjust its approach.

Exam context: The exam tests error reporting patterns. Know that is_error: true in a tool_result tells Claude the call failed, and that the error message should be actionable so Claude can retry or take an alternative approach.

See also: 2.2 Structured Error Responses

Previous
Domain 1: Agentic Architecture & Orchestration
Next
Domain 3: Claude Code Configuration & Workflows