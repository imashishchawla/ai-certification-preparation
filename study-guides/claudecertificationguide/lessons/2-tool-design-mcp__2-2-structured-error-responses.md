# 2.2 — Structured Error Responses | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-2-structured-error-responses

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
2.2
DOMAIN 2
TASK 2.2
Mark Complete
Structured Error Responses
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

When an MCP tool fails, the error response it returns determines whether the agent can recover intelligently or fail blindly. Generic messages like "Operation failed" are useless to an LLM. No signal about what went wrong, whether to retry, or what to try instead.

The MCP protocol provides the isError flag specifically for communicating tool failures back to the agent. Set it and the model knows the execution failed, so it can reason about recovery instead of treating the error text as a normal successful result.

Two Error Layers

The MCP specification reports tool failures through two separate channels, and knowing which one a failure belongs to is the first step in designing the recovery.

Protocol errors are standard JSON-RPC error responses. The server sends one when the request itself is malformed: the tool name does not exist, the arguments fail the input schema, or the server hits an internal fault. There's no result object at all, only an error with a code and a message. The host application handles these. The model never sees a tool result, because no tool ran.

JSON
Copy
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": { "code": -32602, "message": "Unknown tool: invalid_tool_name" }
}


Tool execution errors are results. The tool was found, the arguments were valid, the tool ran, and something went wrong inside it: an upstream API failed, the input data was wrong, a business rule rejected the request. The server returns a normal result with isError: true and the detail in content, and the model reads it and decides what to do next.

JSON
Copy
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [{ "type": "text", "text": "Failed to fetch weather data: API rate limit exceeded" }],
    "isError": true
  }
}


Everything else in this lesson lives in the second layer. The four categories below, isRetryable and the recovery guidance all describe execution errors, because that is the layer the agent reasons about. A protocol error means the call was built wrong, and the fix belongs in the tool schema or the client, not in the agent's recovery loop.

The Four Error Categories

Every tool failure falls into one of four categories. Each demands a different recovery strategy, and the agent needs structured metadata to distinguish them.

One shape note before the examples. errorCategory, isRetryable and description are an application-level convention, not part of the MCP envelope: the protocol's CallToolResult defines only content, structuredContent and isError. The examples below carry the metadata in structuredContent, which is where structured data belongs. The exam guide names these four categories and the isRetryable boolean, so know them by name; just do not expect to find them in the MCP specification.

1. Transient Errors Timeouts, service unavailability, rate limits. The underlying system is temporarily unreachable but the request itself is valid. Recovery: retry after a brief delay.

JSON
Copy
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Service temporarily unavailable"
  }],
  "structuredContent": {
    "errorCategory": "transient",
    "isRetryable": true,
    "description": "The order database is experiencing high load. The request is valid and should succeed on retry."
  }
}


2. Validation Errors Invalid input format, missing required fields, out-of-range values. The request itself is malformed. Recovery: fix the input, then send a corrected call.

JSON
Copy
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Invalid order ID format"
  }],
  "structuredContent": {
    "errorCategory": "validation",
    "isRetryable": false,
    "description": "Order ID must be in format #NNNNN (e.g. #12345). Received: 'order-abc'. Reformat the ID and call again."
  }
}


isRetryable: false here is not "give up". It means resending this call is pointless: order-abc fails the same format check every time. The agent still recovers, just by correcting the input first — and the description tells it exactly how. The boolean says whether to resend; errorCategory says what to do instead.

3. Business Errors Policy violations, limit exceedances, business rule conflicts. The request is technically valid but violates a business constraint. Recovery: do NOT retry — the same request will always fail. The agent needs an alternative workflow.

JSON
Copy
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Refund exceeds policy limit"
  }],
  "structuredContent": {
    "errorCategory": "business",
    "isRetryable": false,
    "description": "Refund amount of £750 exceeds the £500 automatic refund limit. This requires manager approval. Please escalate to a human agent with the refund details."
  }
}


Note the isRetryable: false flag. Business errors never resolve through retrying — the same policy violation applies every time. The agent has to take a fundamentally different path, usually escalation or an alternative workflow, and a customer-friendly explanation in the description lets it communicate that properly.

4. Permission Errors Access denied, insufficient credentials, authorisation failures. The tool cannot execute because the caller lacks the required permissions. Recovery: escalate or use different credentials.

JSON
Copy
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Access denied"
  }],
  "structuredContent": {
    "errorCategory": "permission",
    "isRetryable": false,
    "description": "The current service account does not have permission to access financial records. Escalate to a senior agent with financial system access."
  }
}

What isRetryable Really Signals

isRetryable answers one narrow question: will resending this exact request work? Only transient errors get true — the call was valid, the system was briefly not. Everything else is false, because something has to change first: the input (validation), the request itself (business), or the caller (permission).

Read isRetryable to decide whether to resend as-is, then read errorCategory to decide what to do when you can't:

Category	isRetryable	Recovery
transient	true	Resend the same call after a delay
validation	false	Correct the input, send a new call
business	false	Take an alternative path or escalate
permission	false	Retry as a principal with the right access

The distinction that matters most is between the three false rows. Validation is recoverable by the agent alone. Business and permission are not — a policy limit applies no matter how the request is worded, and a permission error needs a different account, not a better call. false means "not this call again", not "stop".

CURRENT STATE: WHERE THIS TABLE COMES FROM

The exam guide (v1.0) states retriable: false for business rule violations and never assigns a value to validation. The false above is the convention the wider ecosystem uses — gRPC treats INVALID_ARGUMENT as non-retryable, and AWS-style retry metadata does the same — applied to a gap the guide leaves open. Expect the exam to test which category a failure belongs to and what recovery it needs, which the guide does specify. If a question turns on the boolean for validation, reason from "will resending this exact call work" and you will land on false. (Verified against the exam guide, August 2026.)

Access Failure vs Valid Empty Result

Of everything in this domain, this is the distinction to nail. The exam tests it directly.

Access failure: The tool couldn't reach the data source. A timeout occurred, authentication failed, or the service was down. The data might exist, but the tool couldn't check. The agent needs to decide whether to retry.

Valid empty result: The tool successfully queried the data source and found no matches. The query executed correctly — there simply is no data matching the criteria. The agent should NOT retry. The answer is "no results found."

Confusing the two breaks recovery logic entirely. Here's how that plays out:

A tool returns an empty array after a customer lookup. The agent retries 3 times, then escalates to a human. Analysis reveals the customer's account simply does not exist.

The tool succeeded. It queried the database, found no matching customer, and correctly returned an empty result. But because the response doesn't distinguish between "I couldn't reach the database" and "I reached the database and found nothing", the agent treats both the same way — as a failure worth retrying.

The fix: structure your tool responses so a successful query with no results looks nothing like a failed query.

JSON
Copy
// Valid empty result — NOT an error
{
  "isError": false,
  "content": [{
    "type": "text",
    "text": "No customer found matching email 'john@example.com'. The query executed successfully but returned no matches."
  }],
  "structuredContent": {
    "resultCount": 0
  }
}

// Access failure — IS an error
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "Could not reach customer database"
  }],
  "structuredContent": {
    "errorCategory": "transient",
    "isRetryable": true,
    "description": "Connection to the customer database timed out after 5 seconds. The query did not execute."
  }
}

Error Propagation in Multi-Agent Systems

In multi-agent architectures, error handling follows a principle of local recovery with selective propagation:

Subagents implement local recovery for transient failures. If a web search times out, the search subagent retries before bothering the coordinator.
Only propagate errors that cannot be resolved locally. If all retries fail, the subagent reports the failure upward.
Include partial results and what was attempted. The coordinator needs context: "I searched 3 of 5 sources successfully. Sources 4 and 5 timed out. Here are partial results from the 3 successful sources."

This prevents two anti-patterns: silently suppressing errors (returning empty results as success) and terminating entire workflows on a single failure. Both leave the coordinator making decisions blind.

KEY CONCEPT

The distinction between access failures (tool could not reach the data source) and valid empty results (tool successfully queried and found nothing) is critical. Confusing the two causes wasted retries and incorrect escalations. The exam tests this directly.

Exam Traps
EXAM TRAP

Retrying when a tool returns an empty result from a successful query

An empty result from a successful query means 'no data matches your criteria.' Retrying will produce the same empty result. The agent should accept the result and respond accordingly.

EXAM TRAP

Using generic error messages like 'Operation failed' without structured metadata

Without errorCategory, isRetryable, and a description, the agent cannot distinguish transient failures from business rule violations. It cannot make appropriate recovery decisions.

EXAM TRAP

Treating business errors as retryable

Business errors (e.g. refund exceeds policy limit) will never resolve through retry. The same policy violation applies every time. The agent must take an alternative path such as escalation.

EXAM TRAP

Marking a validation error isRetryable: true because the agent can recover from it

isRetryable answers whether resending this exact call can work. A malformed order ID fails the same check every time, so validation is isRetryable: false. The agent still recovers — by correcting the input and issuing a new call — but errorCategory carries that instruction, not the boolean.

EXAM TRAP

Reading isRetryable: false as 'abandon the task'

Three categories are non-retryable and only two of them are dead ends. Validation is false because the input must change first, and the agent fixes it unaided. Business and permission are the ones that need an alternative path or a different principal.

EXAM TRAP

Silently suppressing subagent errors by returning empty results as success

This hides failure information from the coordinator, preventing intelligent recovery. The coordinator cannot distinguish 'found nothing' from 'could not search' and may produce incomplete or inaccurate output.

Practice Scenario

A tool returns an empty array after a customer lookup. The agent retries 3 times, then escalates to a human agent. Analysis shows the customer's account simply does not exist. What is the root cause of this wasted effort?

OPTION A
The retry limit is too low. Raising it to 5 attempts would give the lookup enough chances to return the account before escalation triggers.
OPTION B
The system prompt should instruct the agent never to retry a customer lookup, so that every failed search escalates to a human immediately.
OPTION C
The escalation threshold is too aggressive. The agent should exhaust more retries before involving a human in the loop.
OPTION D
The tool does not distinguish between access failures and valid empty results, so the agent treats no matches as a retriable failure.
Check Answer
Build Exercise
BUILD EXERCISE
Build Structured Error Responses for All Four Categories
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Implement structured error responses with errorCategory, isRetryable, and description metadata
Distinguish between access failures (isError: true) and valid empty results (isError: false)
Categorise tool failures into transient, validation, business, and permission types
Build agent recovery logic that takes different actions based on error metadata
Create an MCP tool that queries a mock customer database with simulated failure modes

WHY: Simulating failure modes in a controlled environment lets you observe how agents behave when errors lack structure. The exam tests your understanding of how poor error responses cause wasted retries and incorrect escalations.

YOU SHOULD SEE: An MCP server running with a customer_lookup tool that accepts a customer identifier and a failure_mode parameter to trigger specific error conditions on demand.

Stuck? Get a nudge
Implement four error response types: transient (simulated timeout), validation (invalid input format), business (refund exceeds policy limit), and permission (access denied)

WHY: Each error category demands a different recovery strategy. The exam tests whether you can identify which category an error belongs to and what recovery action is appropriate. Transient errors are retryable; business errors never are.

YOU SHOULD SEE: Four distinct error responses, each with isError: true, a specific errorCategory value, the correct isRetryable boolean, and a descriptive message explaining what went wrong and what to do next.

Stuck? Get a nudge
Include structured metadata in each error: errorCategory, isRetryable boolean, and a human-readable description

WHY: Structured metadata is what enables intelligent recovery. Without these fields, the agent cannot distinguish a transient timeout from a permanent policy violation. The exam specifically tests whether you know that isRetryable: false means the agent must take an alternative path, not retry.

YOU SHOULD SEE: Each error response parses to a JSON object containing exactly three fields: errorCategory (one of transient, validation, business, permission), isRetryable (boolean), and description (a sentence explaining the error and suggesting recovery).

Stuck? Get a nudge
Implement a valid empty result response (isError: false, resultCount: 0) clearly distinguished from an access failure

WHY: This is one of the most critical distinctions in Domain 2. Confusing access failures with valid empty results causes wasted retries and incorrect escalations. The exam tests this directly — an agent retrying a successful empty query is the canonical anti-pattern.

YOU SHOULD SEE: Two structurally different responses: a valid empty result with isError: false and resultCount: 0 (indicating the query ran successfully but found nothing), and an access failure with isError: true, errorCategory: transient, and isRetryable: true.

Stuck? Get a nudge
Write an agent loop that reads the error metadata and takes appropriate action: retry for transient, fix input for validation, escalate for business, and request credentials for permission

WHY: The agent loop demonstrates the practical outcome of structured error metadata. Each error category maps to a specific recovery action, and the loop must branch correctly. This is exactly the kind of decision logic the exam expects you to design.

YOU SHOULD SEE: An agent loop that parses the error metadata, branches on errorCategory, retries transient errors up to 3 times with backoff, reformats input for validation errors, escalates business errors to a human, and requests elevated credentials for permission errors.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.2 — Anthropic
MCP Specification — Tool Results — Model Context Protocol
MCP Specification — Tools, Error Handling — Model Context Protocol
Building Effective Agents — Anthropic — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Tool Interface Design
NEXT LESSON
Tool Distribution & Tool Choice