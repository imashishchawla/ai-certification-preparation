# 2.3 — Tool Distribution & Tool Choice | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/2-tool-design-mcp/2-3-tool-distribution-choice

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
2.3
DOMAIN 2
TASK 2.3
Mark Complete
Tool Distribution & Tool Choice
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

The number of tools you give an agent directly affects how reliably it selects the right one. That sounds like an implementation detail. It isn't — it's an architectural decision that determines whether your multi-agent system works in production.

The Tool Overload Problem

Giving a single agent 18 tools degrades selection reliability. Every additional tool adds decision complexity, and error rates climb as the toolkit grows. The optimal range is 4-5 tools per agent, scoped to that agent's specific role.

Quantity isn't the whole story, though — relevance matters just as much. A synthesis agent should NOT have web search tools. A web search agent should NOT have document analysis tools. Give an agent tools outside its specialisation and it will tend to misuse them: a synthesis agent with access to web_search might run its own searches instead of using the results already handed to it, duplicating work and wasting context.

The principle: each agent gets only the tools it needs for its defined role. Nothing more.

Consolidating Near-Duplicate Tools

Splitting by role is the obvious answer to tool overload. It's the wrong one when the tools all do the same kind of work.

Take a data platform server with 22 tools: three query tools, one per data source, and 19 transformations — pivot_table, calculate_percentile, normalise_currency, on down the list. Split that by role and you hand a transformation agent 19 tools, which is the original problem moved one level down. The agent still can't choose reliably.

Those 19 collapse instead, because they share a shape. Data in, an operation, data out:

JSON
Copy
{
  "name": "transform_data",
  "description": "Apply a transformation to a dataset. Use transform_type to select the operation.",
  "input_schema": {
    "type": "object",
    "properties": {
      "dataset": { "type": "string" },
      "transform_type": {
        "type": "string",
        "enum": ["pivot", "percentile", "normalise_currency", "..."]
      },
      "options": { "type": "object" }
    },
    "required": ["dataset", "transform_type"]
  }
}


Twenty-two tools become four. Nothing is lost: every transformation is still reachable, now as an enum value the model picks inside a single call rather than a tool it has to find among nineteen near-identical descriptions. Selection accuracy improves because the hard choice got smaller, not because the capability did.

So which fix applies?

The tools are...	The fix
Few enough to handle, but two of them read alike	Sharpen the descriptions (Task Statement 2.1)
Different jobs (query, transform, export)	Split by role, 4-5 tools each
Variations on one job, sharing a shape	Consolidate into one parameterised tool
Doing more than the agent should be able to do	Constrain them (next section)

The first row is the one candidates trip on. Task Statement 2.1 teaches descriptions as the fix for misrouting, and it is right when the toolkit is small enough to reason about. An agent choosing get_customer over lookup_order from a set of five is a description problem. The same symptom from a set of 22 is not: the agent is past the point where any description quality rescues selection, and rewriting all 22 leaves the decision complexity exactly where it was. Same symptom, different disease. Count the tools before you pick the remedy.

Watch the third row: it pulls the other way, and the exam likes that tension. Consolidation reduces how many tools an agent chooses between. Constraining reduces what any one tool can reach. Collapsing 19 transformations into transform_data doesn't hand the agent new powers, so it doesn't undo least privilege. Replacing fetch_url with load_document does the opposite job and both can be right in the same system.

One fix that isn't a fix: moving tools onto a second MCP server. Server boundaries are invisible to the model. A client hands it every tool from every connected server as one flat list, so a 22-tool problem split across two servers is still a 22-tool problem.

The tool_choice Configuration

The tool_choice parameter controls how the model interacts with available tools. Three settings, three distinct jobs.

"auto" (default) The model decides whether to call a tool or return text. Use this for general operation where the model needs flexibility to respond conversationally when no tool call is appropriate.

JSON
Copy
{
  "tool_choice": { "type": "auto" }
}


"any" The model MUST call a tool but chooses which one. Use this when you need guaranteed structured output from one of multiple schemas — the model will always produce a tool call, never plain text.

JSON
Copy
{
  "tool_choice": { "type": "any" }
}


Extraction pipelines are where this earns its keep. If you have multiple extraction schemas (one for invoices, one for receipts, one for contracts) and the document type is unknown, "any" guarantees the model picks one and produces structured output rather than returning a conversational response.

Forced selection The model MUST call a specific named tool. Use this to enforce mandatory first steps — the model cannot skip or reorder the required operation.

JSON
Copy
{
  "tool_choice": { "type": "tool", "name": "extract_metadata" }
}


This is the tool for enforcing workflow ordering. If metadata extraction must happen before any enrichment tools run, forced selection guarantees it. The model can't decide to skip extract_metadata and jump straight to enrichment. After the forced call completes, subsequent turns can use "auto" for the remaining steps.

Scoped Cross-Role Tools

Sometimes an agent needs occasional access to a capability that belongs to another role. The naive approach is to route every such request through the coordinator. The problem: this adds 2-3 round trips per request and can increase latency by 40% or more.

The solution is a scoped cross-role tool: a constrained version of the capability, given directly to the agent that needs it.

Say a synthesis agent needs to verify simple facts constantly during report generation. The naive design routes every verification back to the coordinator, which delegates to the search agent, waits for results, and returns them. For 85% of verifications — simple lookups that take milliseconds — that round trip is pure waste.

The fix: give the synthesis agent a scoped verify_fact tool that handles simple lookups directly. Complex verifications (requiring multiple sources, cross-referencing, or real judgement) still route through the coordinator. The 85% simple case is handled locally; the 15% complex case uses the full pipeline.

The exam guide's sample Question 9 tests this pattern directly.

Replacing Generic Tools with Constrained Alternatives

Instead of giving a subagent fetch_url (which can fetch anything from anywhere), give it load_document that validates document URLs only. The constrained tool:

Prevents misuse (the agent cannot fetch arbitrary URLs)
Makes the tool's purpose clearer (the description is specific, not generic)
Reduces the risk of unintended side effects (no fetching of non-document resources)

This is least privilege applied to tool design. Each tool does exactly what the agent needs and nothing more.

Role-Specific Tool Scoping in Practice

Here is how tool distribution looks in a well-designed multi-agent research system:

Agent	Tools (4-5 each)
Web Search	search_web, fetch_page, extract_links, save_snippet
Document Analysis	extract_metadata, extract_data_points, summarize_content, verify_claim
Synthesis	compile_report, verify_fact (scoped), format_citation, assess_coverage
Coordinator	Agent (formerly Task, used to spawn subagents), review_output, request_revision

Each agent has exactly the tools it needs. The synthesis agent has a scoped verify_fact for simple lookups. The coordinator runs the workflow without holding any domain-specific tools itself.

KEY CONCEPT

The optimal range is 4-5 tools per agent, scoped to its role. For high-frequency simple operations, add a scoped cross-role tool directly to the agent that needs it — this avoids coordinator round-trip latency for the common case.

Exam Traps
EXAM TRAP

Routing all simple verification requests through the coordinator when 85% are simple lookups

Coordinator round-trips add 2-3 extra hops per request. A scoped verify_fact tool on the synthesis agent handles the 85% simple case directly, cutting latency by up to 40%.

EXAM TRAP

Using tool_choice 'auto' when structured output is required

With 'auto', the model may return conversational text instead of calling a tool. Use 'any' to guarantee a tool call, or forced selection to guarantee a specific tool call.

EXAM TRAP

Giving an agent 18 tools and expecting reliable selection

Tool selection reliability degrades as the number of tools increases. The optimal range is 4-5 tools per agent. More tools means more decision complexity and more selection errors.

EXAM TRAP

Giving a subagent a generic fetch_url tool when a constrained load_document would suffice

Generic tools enable misuse. Constrained alternatives (load_document that validates document URLs only) enforce the principle of least privilege and make the tool's purpose clearer.

Practice Scenario

A synthesis agent frequently returns control to the coordinator for simple fact verification, adding 2-3 round trips per task and 40% latency. Analysis shows 85% of verifications are simple lookups. What is the most effective solution?

OPTION A
Give the synthesis agent a scoped verify_fact tool for simple lookups, routing only complex verifications through the coordinator.
OPTION B
Remove the fact verification step from the synthesis workflow entirely so no task ever pays the round-trip latency.
OPTION C
Cache all verification results at the coordinator level so that repeated lookups return instantly without a second round trip to any subagent.
OPTION D
Increase the coordinator parallelism so that verification requests are processed concurrently and the queueing delay disappears entirely.
Check Answer
Build Exercise
BUILD EXERCISE
Configure Tool Distribution Across a Multi-Agent System
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Scope tools to agent roles using the 4-5 tools per agent guideline
Implement scoped cross-role tools to avoid coordinator round-trip latency
Configure tool_choice modes (auto, any, forced) for different workflow requirements
Apply least-privilege tool design by replacing generic tools with constrained alternatives
Verify that tool distribution prevents cross-role misuse in multi-agent systems
Design three agent roles (web search, document analysis, synthesis) and assign 4-5 tools to each, scoped to its role

WHY: Tool overload degrades selection reliability. The exam tests the principle that each agent should have 4-5 tools scoped to its specific role. Giving a single agent 18 tools is a known anti-pattern that causes misrouting.

YOU SHOULD SEE: A configuration object or table listing three agents, each with exactly 4-5 tools. No tool appears in more than one agent role (except scoped cross-role tools added later). Tool names clearly indicate their purpose and scope.

Stuck? Get a nudge
Add a scoped verify_fact tool to the synthesis agent that handles simple lookups directly

WHY: Routing every fact verification through the coordinator adds 2-3 round trips and up to 40% latency. The exam tests the scoped cross-role tool pattern — give the agent a constrained version of a capability for the 85% simple case, routing only complex cases to the coordinator.

YOU SHOULD SEE: A verify_fact tool added to the synthesis agent toolset with a description that explicitly limits it to simple single-source lookups and states that complex multi-source verifications should be escalated to the coordinator.

Stuck? Get a nudge
Configure tool_choice forced selection on the document analysis agent to ensure extract_metadata runs as the mandatory first step

WHY: Forced selection enforces workflow ordering. The exam tests your knowledge of all three tool_choice modes: auto lets the model choose freely, any guarantees a tool call, and forced selection guarantees a specific tool call. This prevents the model from skipping mandatory steps.

YOU SHOULD SEE: A document analysis agent configuration where the first API call uses tool_choice with type: tool and name: extract_metadata, and subsequent calls switch to tool_choice: auto for the remaining analysis steps.

Stuck? Get a nudge
Replace a generic fetch_url tool with a constrained load_document that validates document URLs only

WHY: This applies the principle of least privilege to tool design. A generic fetch_url tool can fetch anything from anywhere, enabling misuse. A constrained load_document that validates URLs prevents the agent from fetching arbitrary resources. The exam tests this pattern directly.

YOU SHOULD SEE: A load_document tool definition that includes URL validation logic (checking for document file extensions or trusted domains) and rejects non-document URLs with a clear error message.

Stuck? Get a nudge
Test with a query that requires all three agents and verify that no cross-role tool misuse occurs

WHY: End-to-end testing validates that your tool distribution works in practice. Cross-role misuse — such as a synthesis agent running its own web searches instead of using provided results — is a common failure the exam expects you to prevent through proper scoping.

YOU SHOULD SEE: A test run log showing: the web search agent using only its tools, the document analysis agent starting with extract_metadata (forced), and the synthesis agent using compile_report plus verify_fact for simple checks. No agent calls a tool outside its assigned set.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.3 — Anthropic
Tool use — Anthropic API Documentation — Anthropic
Claude Agent SDK — Tool Configuration — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Structured Error Responses
NEXT LESSON
MCP Server Integration