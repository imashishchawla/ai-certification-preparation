---
title: "4 Prompt Engineering__4 5 Batch Processing"
meta: "ClaudeCertificationGuide lesson"
tags: ["study", "claudecertificationguide"]
---

# 4.5 — Batch Processing Strategies | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/4-prompt-engineering/4-5-batch-processing

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
4.1
System Prompts with Explicit Criteria
4.2
Few-Shot Prompting
4.3
Structured Output with Tool Use
4.4
Validation, Retry, and Feedback Loops
4.5
Batch Processing Strategies
4.6
Multi-Instance and Multi-Pass Review
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
PROMPT ENGINEERING & STRUCTURED OUTPUT
/
4.5
DOMAIN 4
TASK 4.5
Mark Complete
Batch Processing Strategies
Learn this interactively
|
Concept Check
|
Exam Sim
|
Build Coach
What You Need to Know

The Message Batches API is a cost optimisation tool with hard constraints that the exam tests directly. Understanding when to use it — and when not to — is the core of this task statement.

Message Batches API: The Facts

The constraints are fixed, and you have to design around them:

50% cost savings compared to synchronous API calls
Up to 24-hour processing window — results may arrive in minutes or take up to 24 hours
No guaranteed latency SLA — you cannot rely on results arriving within any specific timeframe
No multi-turn tool calling within a single batch request — the model cannot execute tools mid-request and use the results to continue processing
custom_id fields for correlating request/response pairs — each request in a batch gets a unique identifier used to match it with its response
The Matching Rule

This is the single most tested concept from this task statement:

Synchronous API: For blocking workflows where someone or something is waiting for the result. Pre-merge checks in CI/CD, real-time code review feedback, any workflow where developers are blocked pending completion.

Batch API: For latency-tolerant workflows where results are consumed later. Overnight technical debt reports, weekly code audit summaries, nightly test generation runs, batch document extraction.

The exam specifically presents a scenario (Question 11 in the sample questions) where a manager proposes switching everything to batch processing for the cost savings. The correct answer keeps blocking workflows synchronous and only moves latency-tolerant workflows to batch.

TYPESCRIPT
Copy
// Synchronous — developer is waiting for this
const preMergeReview = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 4096,
  messages: [{ role: "user", content: prDiffContent }]
});

// Batch — results consumed tomorrow morning
const batchRequest = await client.messages.batches.create({
  requests: technicalDebtDocuments.map((doc, i) => ({
    custom_id: `debt-report-${i}`,
    params: {
      model: "claude-sonnet-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: doc }]
    }
  }))
});

SLA Calculation

When designing batch processing schedules, you must account for the 24-hour maximum processing window. If your organisation requires a 30-hour SLA for a report:

The 24 hours is a maximum window, not a delivery guarantee. A batch that does not finish inside it comes back expired, so size the schedule against that worst case and treat an expired batch as a resubmission
30 hours total SLA minus the 24-hour worst case = 6 hours of buffer for collecting requests, validating inputs, or absorbing operational delays
Submit batches every 4 hours within that buffer window so a fresh batch is always in flight. A 6-hour cadence leaves no margin at all

The exam may present a scheduling question where you need to work backwards from the SLA to determine submission frequency.

Batch Failure Handling

Not all documents in a batch succeed. The correct failure handling pattern has three steps:

1. Identify failures by custom_id. Each request has a unique identifier. Parse the batch results to find which custom_id values failed.

2. Resubmit only failures with modifications. Do not resubmit the entire batch. Common modifications include:

Chunking oversized documents that exceeded context limits
Simplifying extraction prompts for documents with unusual structures
Adding format-specific few-shot examples for documents that failed due to structural variety

3. Refine prompts on a sample set BEFORE batch processing. This is the proactive step that maximises first-pass success and reduces resubmission costs. Test your prompts against a representative sample (5-10 documents covering the range of formats and edge cases) before processing the full batch.

TYPESCRIPT
Copy
// Poll until the batch has finished before reading results
let batch = await client.messages.batches.retrieve(batchId);
while (batch.processing_status !== "ended") {
  await new Promise(r => setTimeout(r, 60_000));
  batch = await client.messages.batches.retrieve(batchId);
}

// results() returns a JSONL async iterable, not an array — accumulate it.
// Treat `expired` as a failure too: that is what an overrun batch returns.
const failedIds: string[] = [];
for await (const result of client.messages.batches.results(batchId)) {
  if (result.result.type === "errored" || result.result.type === "expired") {
    failedIds.push(result.custom_id);
  }
}

// Resubmit only failures with modifications
const retryRequests = failedIds.map(id => {
  const originalDoc = documentsById[id];
  return {
    custom_id: `${id}-retry-1`,
    params: {
      model: "claude-sonnet-5",
      max_tokens: 8192,  // increased for oversized docs
      messages: [{
        role: "user",
        content: chunkIfNeeded(originalDoc)
      }]
    }
  };
});

Multi-Turn Tool Calling Limitation

The batch API doesn't support multi-turn tool calling within a single request. This means you cannot:

Define tools and have the model call them mid-request
Process tool results and continue the conversation within the same batch item
Run agentic loops within a single batch request

If your workflow requires tool execution mid-processing, you must use the synchronous API. This limitation is a direct exam test point — if a scenario describes a batch workflow that needs to call external tools during processing, the correct answer is to use the synchronous API for that step.

CURRENT STATE

Exam guide v1.0 states the limitation exactly as above, and that is the keyed answer. Anthropic's batch processing docs (checked September 2026) now split it by tool type. Server tools (web search, web fetch, code execution, MCP connectors, tool search) run the same server-side agentic loop inside a batch request as they do synchronously, and a batch result can come back with stop_reason: "pause_turn" for you to continue in a follow-up request. Client tools, the ones your own code executes, still cannot complete a loop inside a batch item: the request ends at tool_use, you run the tool after retrieving the result, then submit a follow-up request. When a question names a tool your own code runs (an internal lookup, a database query), the guide's rule and the current docs give the same answer. On the exam, answer per the guide: no multi-turn tool calling in a batch request, so a step that needs tool execution mid-processing runs on the synchronous API.

KEY CONCEPT

The Message Batches API provides 50% cost savings with an up to 24-hour processing window and no latency SLA. Use it only for latency-tolerant workflows (overnight reports, weekly audits). Blocking workflows (pre-merge checks) must remain synchronous. Always refine prompts on a sample set before submitting large batches.

Prompt Optimisation Before Batch Submission

The most cost-effective batch processing strategy is to invest time in prompt refinement before submitting large volumes:

Sample set testing: Take 5-10 representative documents covering the range of formats, edge cases, and document types in your batch
Iterate on the sample: Refine your extraction prompts, add few-shot examples, adjust schema design until the sample set achieves high accuracy
Submit the full batch: With refined prompts, your first-pass success rate will be significantly higher
Handle failures: Resubmit only the failed documents with targeted modifications

This workflow slashes total cost. A 90% first-pass success rate on 1,000 documents means only 100 retries. A 60% first-pass rate means 400 retries, four times the resubmission cost, plus the batch processing cost for those retries.

Exam Traps
EXAM TRAP

Switching all workflows to batch processing for cost savings

Blocking workflows where developers wait for results (pre-merge checks, real-time reviews) must remain synchronous. The batch API has no guaranteed latency SLA and can take up to 24 hours. Only latency-tolerant workflows should use batch.

EXAM TRAP

Assuming batch results arrive quickly because they often do

The batch API has no latency SLA. Results often arrive faster than 24 hours, but you cannot design blocking workflows around best-case timing. Design around the 24-hour maximum.

EXAM TRAP

Using batch API for workflows requiring multi-turn tool calling

The batch API does not support multi-turn tool calling within a single request. If your workflow needs to execute tools and use results mid-processing, you must use the synchronous API.

Practice Scenario

Your team wants to reduce API costs for automated analysis. You have two workflows: (1) a blocking pre-merge check that must complete before developers merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for 50% cost savings. How should you evaluate this proposal?

OPTION A
Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks
OPTION B
Switch both workflows to batch processing, with a timeout fallback to real-time if the batch takes too long
OPTION C
Keep real-time calls for both workflows to avoid batch result ordering issues
OPTION D
Switch both to batch processing with status polling to check for completion
Check Answer
Build Exercise
BUILD EXERCISE
Design a Batch Processing Strategy
Difficulty
45 MINUTES

WHAT YOU'LL LEARN

Classify workflows as blocking (synchronous) or latency-tolerant (batch-eligible) based on latency requirements
Use the Message Batches API with custom_id fields for request-response correlation
Implement failure handling that resubmits only failed documents with targeted modifications
Calculate batch submission frequency against SLA constraints accounting for the 24-hour processing window
Apply the prompt refinement workflow: sample set testing before full batch submission
List 5 workflows in a hypothetical organisation and categorise each as blocking (synchronous) or latency-tolerant (batch-eligible) with justification

WHY: The matching rule between synchronous and batch API is the most tested concept in this task statement. The exam presents a scenario where a manager proposes switching everything to batch for cost savings, and you must identify which workflows cannot tolerate the 24-hour processing window.

YOU SHOULD SEE: A table with 5 workflows, each clearly categorised with justification. Blocking workflows have someone or something waiting for the result. Batch-eligible workflows consume results later with no real-time dependency.

Stuck? Get a nudge
Define a batch submission for 20 documents using the Message Batches API format with unique custom_id fields for each document

WHY: custom_id fields are the mechanism for correlating request-response pairs in batch results. Without unique identifiers, you cannot determine which documents succeeded or failed, making failure handling impossible.

YOU SHOULD SEE: A valid batch request object with 20 entries, each containing a unique custom_id, model specification, max_tokens, and a messages array with the document content.

Stuck? Get a nudge
Implement failure handling: parse batch results, identify failures by custom_id, and construct a retry batch containing only failed documents with increased max_tokens

WHY: Resubmitting only failures with targeted modifications is the correct batch failure pattern. Resubmitting the entire batch wastes cost on already-successful documents. The exam tests that you understand custom_id correlation and targeted retry.

YOU SHOULD SEE: A failure handler that filters results by error status, extracts the custom_id values of failures, looks up the original documents, and creates a retry batch with modifications like increased max_tokens or chunked content.

Stuck? Get a nudge
Calculate the batch submission frequency needed to guarantee a 30-hour SLA given the 24-hour maximum processing window

WHY: SLA calculation with the 24-hour batch processing window is a direct exam test point. You must work backwards from the SLA deadline to determine when to submit, accounting for the maximum processing time plus a safety margin.

YOU SHOULD SEE: A calculation showing: 30-hour SLA minus 24-hour maximum processing window equals 6 hours of buffer. The latest safe submission is 24 hours before the deadline, with batches submitted every 4 hours so a fresh batch is always in flight.

Stuck? Get a nudge
Create a 5-document sample set and refine extraction prompts iteratively before submitting the full batch of 20 documents

WHY: Prompt refinement on a sample set before batch submission is the most cost-effective batch processing strategy. A 90% first-pass success rate means 2 retries on 20 documents. A 60% first-pass rate means 8 retries, four times the resubmission cost.

YOU SHOULD SEE: A sample set covering the range of document types and edge cases, 2-3 prompt iterations improving accuracy on the sample, and then the full batch submission achieving a high first-pass success rate.

Stuck? Get a nudge
Sources
Claude Certified Architect Foundations Exam Guide — Task Statement 4.5 — Anthropic
Message Batches API — Anthropic
Building with Claude API (Skilljar) — Anthropic
Drill This Domain
Quick Reference
Mark Complete
PREVIOUS LESSON
Validation, Retry, and Feedback Loops
NEXT LESSON
Multi-Instance and Multi-Pass Review