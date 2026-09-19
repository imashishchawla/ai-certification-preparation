# 5.3 — Error Propagation in Multi-Agent Systems | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/5-context-management/5-3-error-propagation

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
5.1
Context Window Management
5.2
Escalation & Ambiguity Resolution
5.3
Error Propagation in Multi-Agent Systems
5.4
Codebase Exploration & Context Degradation
5.5
Human Review & Confidence Calibration
5.6
Information Provenance & Multi-Source Synthesis

PRACTICE

Build Exercises
Diagnostic Test

LOOK UP

Quick Reference
Glossary
LEARN
/
CONTEXT MANAGEMENT & RELIABILITY
/
5.3
DOMAIN 5
TASK 5.3
Mark Complete
Error Propagation in Multi-Agent Systems
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

Error propagation determines whether a multi-agent system recovers gracefully or fails silently. When a subagent encounters a failure — a timeout, a permission error, an invalid query — how that failure information flows back to the coordinator dictates the system's reliability. The exam tests your understanding of structured error context, the two critical anti-patterns, and the distinction that most developers get wrong: access failures versus valid empty results.

Structured Error Context

When a subagent fails, it must return structured error context that enables the coordinator to make intelligent recovery decisions. This context must include four elements:

1. Failure type. Categorise the failure: transient (timeout, rate limit — may succeed on retry), validation (bad input — fix the query), business (rule violation — escalate or find alternative), or permission (access denied — cannot be retried without authorisation changes).

2. What was attempted. The specific query, parameters used, and target system. "Searched academic database for 'renewable energy policy' with date range 2022-2024" is actionable. "Search failed" is not.

3. Partial results gathered before failure. If the subagent retrieved three of five sources before timing out, those three results are valuable. Discarding them because the overall operation failed is wasteful.

4. Potential alternative approaches. The subagent knows its domain. If an academic database is down, it might suggest trying a different database, broadening the search terms, or checking cached results. These suggestions help the coordinator decide on recovery strategy.

JSON
Copy
{
  "status": "partial_failure",
  "failureType": "transient",
  "attemptedAction": {
    "tool": "search_academic_db",
    "query": "renewable energy policy",
    "dateRange": "2022-2024"
  },
  "partialResults": [
    {
      "title": "EU Renewable Energy Directive 2023",
      "source": "EUR-Lex",
      "retrieved": true
    }
  ],
  "alternativeApproaches": [
    "Retry with narrower date range (2023-2024)",
    "Search alternative database: government_publications",
    "Use cached results from previous research session"
  ]
}


This structure gives the coordinator everything it needs to decide: retry the same query, try an alternative, proceed with partial results, or escalate.

The Two Anti-Patterns

The exam tests these explicitly. Both are catastrophic in different ways:

Silent suppression: returning empty results marked as success. This is the worst anti-pattern. The subagent encounters a timeout but returns { "results": [], "status": "success" }. The coordinator believes the search ran and found nothing. It won't retry, won't try alternatives, and produces a synthesis that silently omits an entire research area. The final output looks complete. It is missing critical content.

Silent suppression is especially dangerous because it's invisible. The output looks correct — it just has gaps that nobody can detect. In a customer support context, it might mean the agent reports "no orders found" when the order lookup system was actually down, leading the agent to tell the customer they have no account.

Workflow termination: killing the entire pipeline on a single failure. One subagent times out and the entire research pipeline crashes. The other four subagents completed successfully, but their results are thrown away. This is a disproportionate response that wastes completed work and provides no recovery path.

The correct middle ground is structured error propagation: the failing subagent reports what happened, the coordinator assesses the damage, and the system continues with partial results or targeted recovery.

Access Failure vs Valid Empty Result

This distinction is critical and the exam tests it directly:

Access failure: The tool could not reach the data source. A timeout, a connection error, a permission denial. The search did not execute. Consider retry with the same or modified parameters.

Valid empty result: The tool reached the source and executed the query. It found no matches. This IS the answer. No retry is needed because the system worked correctly — there simply are no results for this query.

Conflating these leads to two problems:

Treating access failures as valid empty results means you never retry when you should.
Treating valid empty results as access failures means you waste time retrying a query that will always return nothing.
PYTHON
Copy
# Access failure — consider retry
{
    "status": "error",
    "failureType": "transient",
    "message": "Connection timeout after 30s",
    "shouldRetry": True
}

# Valid empty result — no retry needed
{
    "status": "success",
    "results": [],
    "message": "Query executed successfully. No matching records found.",
    "shouldRetry": False
}

Coverage Annotations

When a synthesis agent combines findings from multiple subagents, the output should note which topic areas are well-supported and which have gaps. If one subagent failed to retrieve sources on geothermal energy, the synthesis should say:

"Section on geothermal energy is limited due to unavailable journal access during research."

This is far better than silently omitting the topic. Coverage annotations let the consumer know what the report covers fully and where there are known limitations. Without them, a gap in the synthesis looks like the topic was not relevant rather than the source being unavailable.

Local Recovery for Transient Failures

Subagents should implement local recovery for transient failures — retry logic, fallback sources, degraded responses — before propagating errors to the coordinator. Only propagate errors the subagent can't resolve locally. When propagating, always include what was attempted and any partial results gathered.

This reduces coordinator complexity. The coordinator doesn't need to manage retry logic for every possible transient failure across every subagent. Each subagent handles its own transient failures and escalates only the persistent ones.

KEY CONCEPT

Structured error context (failure type, attempted action, partial results, alternatives) enables intelligent coordinator recovery. The two anti-patterns are silent suppression (empty results as success) and workflow termination (killing the pipeline on one failure). Access failures need retry consideration; valid empty results do not.

Exam Traps
EXAM TRAP

Catching a timeout and returning empty results marked as successful

Silent suppression prevents all recovery. The coordinator believes the search succeeded and found nothing, so it will never attempt alternatives. This is the worst anti-pattern.

EXAM TRAP

Terminating the entire research pipeline when one subagent times out

Workflow termination wastes partial results from other subagents that completed successfully. The coordinator should assess the failure and decide on targeted recovery.

EXAM TRAP

Returning a generic 'search unavailable' status after retry exhaustion

Generic errors hide the query, partial results, and alternative approaches from the coordinator. Structured error context enables informed recovery; generic statuses prevent it.

EXAM TRAP

Retrying a valid empty result because it looks like a failure

A valid empty result means the query executed successfully and found no matches. This IS the answer. Retrying wastes time and resources on a query that will always return nothing.

Practice Scenario

A web search subagent in a multi-agent research system times out while researching a complex topic. You need to design how this failure information flows back to the coordinator. Which approach best enables intelligent recovery?

OPTION A
Catch the timeout and return an empty result set marked as successful, so the rest of the workflow carries on regardless of the failure
OPTION B
Propagate the timeout exception to a top-level handler that terminates the entire research workflow at once, discarding everything
OPTION C
Return structured error context including failure type, attempted query, partial results, and potential alternative approaches
OPTION D
Implement automatic retry with exponential backoff, returning a generic search unavailable status only after all retries are exhausted
Check Answer
Build Exercise
BUILD EXERCISE
Build a Structured Error Propagation System
Difficulty
50 MINUTES

WHAT YOU'LL LEARN

Design structured error context with the four required elements: failure type, attempted action, partial results, and alternative approaches
Distinguish access failures (timeout, connection error) from valid empty results (successful query, no matches)
Identify and avoid the two anti-patterns: silent suppression and workflow termination
Implement local retry logic for transient failures before propagating to the coordinator
Add coverage annotations to synthesis output for transparency about information gaps
Define a structured error schema with fields: failureType (transient/validation/business/permission), attemptedAction (tool, query, parameters), partialResults (array of any retrieved data), and alternativeApproaches (suggested recovery strategies)

WHY: Structured error context enables intelligent coordinator recovery. The four elements give the coordinator everything it needs to decide: retry, try an alternative, proceed with partial results, or escalate. Generic error messages like search unavailable prevent all informed recovery.

YOU SHOULD SEE: A TypeScript interface or JSON schema with failureType as an enum of the four categories, attemptedAction as an object with tool/query/parameters, partialResults as an array, and alternativeApproaches as a string array. Each field should have a description explaining its purpose.

Stuck? Get a nudge
Implement a subagent that distinguishes access failures (timeout, connection error) from valid empty results (successful query, no matches) in its error reporting

WHY: Conflating access failures with valid empty results is a critical error the exam tests directly. Access failures mean the query did not execute and should be retried. Valid empty results mean the query succeeded and found nothing, which IS the answer. Treating them the same leads to either never retrying when you should or wasting time retrying queries that will always return nothing.

YOU SHOULD SEE: A subagent function that catches exceptions (timeouts, connection errors) and reports them as access failures with shouldRetry: true, while successful queries returning no results are reported as success with an empty results array and shouldRetry: false.

Stuck? Get a nudge
Build local retry logic for transient failures within the subagent (3 retries with exponential backoff) before propagating to the coordinator

WHY: Subagents should handle their own transient failures locally before escalating. This reduces coordinator complexity as the coordinator does not need to manage retry logic for every possible transient failure across every subagent. Only persistent failures that survive local retry should propagate.

YOU SHOULD SEE: A retry wrapper with exponential backoff (e.g., 1s, 2s, 4s) that attempts the operation up to 3 times before propagating the structured error to the coordinator. Partial results gathered before failure should be preserved across retries.

Stuck? Get a nudge
Create a coordinator that receives structured errors and decides between retry with modified query, alternative approach, or proceed with partial results

WHY: The coordinator is the intelligent recovery decision-maker. With structured error context, it can make informed choices rather than applying blanket policies. This is the correct middle ground between silent suppression (ignoring failures) and workflow termination (killing the pipeline on one failure).

YOU SHOULD SEE: A coordinator function that examines the failure type, checks partial results, evaluates alternative approaches, and selects the appropriate recovery strategy. It should handle all four failure types differently and never silently suppress errors.

Stuck? Get a nudge
Add coverage annotations to synthesis output noting which findings are well-supported versus which topic areas have gaps due to unavailable sources

WHY: Coverage annotations let the consumer know what the report covers fully and where there are known limitations. Without them, a gap looks like the topic was not relevant rather than the source being unavailable. This transparency is far better than silently omitting topics.

YOU SHOULD SEE: A synthesis output that includes a coverage section listing each topic area with its data quality status: well-supported, limited (with reason), or unavailable (with reason). Failed subagent topics should be explicitly noted, not silently omitted.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.3 — Anthropic
Anthropic Multi-Agent Patterns — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Escalation & Ambiguity Resolution
NEXT LESSON
Codebase Exploration & Context Degradation