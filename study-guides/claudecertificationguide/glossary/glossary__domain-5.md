# Glossary: Domain 5 — Context Management & Reliability | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/glossary/domain-5

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
Domain 5
DOMAIN 5
15%
Glossary: Context Management & Reliability

Quick-lookup definitions for the 15% exam domain. Each entry includes a concise definition and exam context. Follow the lesson links to dive deeper.

Context Window

The maximum number of tokens (input plus output) that Claude can process in a single API call. Everything in the conversation — system prompt, message history, tool definitions, and the response — must fit within this limit.

Current state (checked 14 August 2026): context-window size is model-specific, not a single figure. Current Claude models range from 200K tokens (Haiku 4.5) to 1M (Sonnet 5, Opus 5, Fable 5). The exam guide states no window size anywhere in Domain 5, and nothing in the bank keys on the number — treat any specific figure in a scenario as a constraint that scenario sets, not a property of the model.

Exam context: The exam tests strategies for staying within limits: progressive summarisation, message pruning, and content prioritisation. Know the trap in progressive summarisation — repeated compression can drop the specific facts a later step needs.

See also: 5.1 Context Window Management

Token Counting

The process of measuring how many tokens a prompt or response consumes. The API response includes input_tokens and output_tokens in the usage field. Accurate token accounting is essential for context window management.

Exam context: Know how to read the usage field and that token counts include all content (system prompt, messages, tool definitions). Tokenisation algorithms and per-character ratios are explicitly out of scope — the guide's out-of-scope list excludes "token counting algorithms or tokenization specifics".

See also: 5.1 Context Window Management

Prompt Caching

An API feature that lets frequently reused prompt content be cached, reducing latency and cost on subsequent requests. Content is marked with a cache_control breakpoint (type: "ephemeral", roughly five-minute TTL) placed at the end of the static block — system prompt, tool definitions, large documents — with dynamic content ordered after it. Cache hits are charged at a reduced rate.

Exam context: Know that caching exists, the static-then-dynamic ordering requirement, and the breakpoint placement at the end of the static prefix. The guide's out-of-scope list excludes "prompt caching implementation details (beyond knowing it exists)", so depth beyond this is not tested.

See also: 5.1 Context Window Management

Escalation Triggers

The conditions under which an agent should hand a case to a human rather than continue autonomously. The valid triggers are: the customer explicitly asks for a human (honour it immediately, without attempting investigation first), the policy has a gap or exception the agent cannot resolve, and the agent cannot make meaningful progress.

Exam context: Sentiment-based escalation and self-reported confidence scores are unreliable proxies for case complexity — options built on them are distractors. When a customer is frustrated but the issue is within the agent's capability, acknowledge the frustration and offer to resolve, escalating only if they reiterate their preference.

See also: 5.2 Escalation & Ambiguity

Policy Gap vs Policy Violation

The distinction between a request the policy does not address (a gap) and a request the policy forbids (a violation). A gap — for example, competitor price matching when the policy only covers own-site adjustments — warrants escalation because the agent has no authority to decide. A violation warrants a clear refusal with the policy explanation.

Exam context: The exam tests recognising that ambiguous or silent policy means escalate, not improvise. When tool results return multiple customer matches, ask for additional identifiers rather than selecting by heuristic.

See also: 5.2 Escalation & Ambiguity

Structured Error Context

The error-reporting pattern that lets a coordinator make intelligent recovery decisions: failure type, the attempted query, any partial results, and potential alternative approaches. Generic statuses like "search unavailable" hide the context the coordinator needs.

Exam context: Both silently suppressing errors (returning empty results as success) and terminating an entire workflow on a single failure are anti-patterns. Subagents should recover locally from transient failures and propagate only what they cannot resolve, with partial results attached.

See also: 5.3 Error Propagation

Access Failure vs Valid Empty Result

The distinction between a query that could not run (timeout, auth failure — a retry decision is needed) and a query that ran successfully and found nothing (the absence of data is the answer). Error reporting must distinguish the two so the coordinator can respond appropriately.

Exam context: Treating a valid empty result as an error, or an access failure as "no results", are both keyed wrong answers. Synthesis output should carry coverage annotations marking which findings are well-supported and which areas have gaps from unavailable sources.

See also: 5.3 Error Propagation

Context Degradation

The failure mode of extended exploration sessions: the model starts giving inconsistent answers and referencing "typical patterns" instead of the specific classes and files it discovered earlier. It signals that the context window has filled with verbose discovery output.

Exam context: The remedies are scratchpad files, subagent delegation to isolate verbose output, summarising each exploration phase before starting the next, and /compact to reduce context usage mid-session.

See also: 5.4 Codebase Exploration

Scratchpad Files

Files an agent maintains to persist key findings across context boundaries during large codebase exploration. The agent records discoveries as it goes and re-reads the scratchpad for later questions, counteracting context degradation.

Exam context: Also know the crash-recovery variant: each agent exports structured state to a known location, and the coordinator loads a manifest on resume and injects it into agent prompts.

See also: 5.4 Codebase Exploration

Stratified Sampling

Randomly sampling high-confidence extractions for human review, stratified by document type and field, to measure true error rates and catch novel error patterns. It guards against the trap of aggregate metrics: 97% overall accuracy can mask poor performance on a specific document type or field.

Exam context: Validate accuracy by segment before automating high-confidence extractions. Options that trust the aggregate number, or stop reviewing high-confidence items entirely, are distractors.

See also: 5.5 Human Review & Calibration

Confidence Calibration

Checking model-reported confidence against actual accuracy using a labelled validation set, then setting review thresholds from the calibrated scores. Field-level confidence scores route limited reviewer capacity to where it matters: low-confidence extractions and ambiguous or contradictory source documents.

Exam context: Raw self-reported confidence is not trustworthy on its own — calibration against labelled data is the keyed step before using confidence for routing.

See also: 5.5 Human Review & Calibration

Claim-Source Mapping

A structured record tying each claim to its source (URL, document name, relevant excerpt) that must be preserved and merged through every synthesis step. Attribution is lost when findings are compressed without carrying these mappings along.

Exam context: When credible sources conflict, annotate the conflict with both attributions rather than arbitrarily selecting one value; the coordinator decides how to reconcile. Reports should separate well-established findings from contested ones.

See also: 5.6 Information Provenance

Temporal Annotation

Requiring publication or data-collection dates in structured outputs so that figures from different periods are not misread as contradictions. A 2023 statistic and a 2026 statistic that differ are a temporal change, not a conflict.

Exam context: The keyed pattern is to include dates in subagent outputs and preserve them through synthesis, letting consumers interpret differences correctly.

See also: 5.6 Information Provenance

Rate Limits & Quotas (out of scope)

API throughput controls (requests or tokens per minute, returning 429 when exceeded) and billing-period usage caps. Worth knowing they exist — but the exam guide's out-of-scope list states that "rate limiting, quotas, or API pricing calculations" will not appear on the exam.

Exam context: If an option hinges on rate-limit handling strategy in a Domain 5 question, treat it with suspicion; a 429 appears in this domain only as an example of an access failure (retry with Retry-After), never as a topic of its own.

Batches API

An API endpoint for submitting large volumes of requests for asynchronous processing at a 50% cost reduction, with completion inside a 24-hour window but no guaranteed turnaround time. Ideal for offline bulk work; wrong for real-time or user-facing flows.

Exam context: Batch processing is tested in Domain 4, not Domain 5 — know the cost figure, the window, and the no-guarantee trade-off.

See also: 4.5 Batch Processing

Previous
Domain 4: Prompt Engineering & Structured Output