# Quick Reference: Domain 4 — Prompt Engineering & Structured Output | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/quick-reference/domain-4

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
Domain 4
DOMAIN 4
20%
Quick Reference: Domain 4 — Prompt Engineering & Structured Output
Print this page
System Prompts

Concrete code examples beat prose descriptions. Instead of writing "use clear variable names", show a before/after code snippet.

Severity calibration: Without examples of what constitutes "critical" vs. "minor", the model treats all issues as equally important. Provide 2–3 calibration examples showing severity levels with specific code samples.

Structure a system prompt as:

Role and context (who the model is, what it is doing)
Rules and constraints (what it must/must not do)
Output format specification
Calibration examples (severity, tone, detail level)

Key rule: System prompts are the most cost-effective way to control behaviour, because one prompt shapes every request rather than being repeated per call.

Structured Output — tool_use vs Text
Method	Guarantee	Use When
Forced tool_choice ({ type: "tool", name: ... })	Tool call guaranteed; the tool's JSON schema constrains the shape	You need one specific structure every time
tool_choice: any	A tool call is guaranteed, model picks which tool	Multiple extraction schemas, document type unknown
tool_choice: auto	Model may or may not use the tool	Agentic loops where text responses are also valid
Prompt-based JSON	No schema enforcement	Simple cases, prototyping only

The exam's preferred pattern: Define a tool whose sole purpose is to structure output (e.g., extract_entities), then force it with tool_choice: { type: "tool", name: "extract_entities" }. This guarantees the response matches your schema.

Why tool_use over prompt-based JSON:

Schema is validated by the API, not by post-processing
Eliminates syntax errors: malformed JSON, missing fields, extra fields
Works with streaming (structured chunks)

The caveat the exam tests most: a strict JSON schema eliminates syntax errors but does not prevent semantic ones — line items that do not sum to the total, a value extracted into the wrong field, a plausible-looking date that is not the one in the document. Options claiming tool_use prevents all extraction errors are wrong.

Schema Design for Structured Output
Make fields optional or union-typed with null when data may be missing. If a field is required but the data is absent, the model will fabricate a value to satisfy the schema.
Use enum for constrained choices to prevent freeform values.
Keep schemas flat where possible — deeply nested schemas increase extraction errors.
Include description fields on each property — these guide the model on what to extract.

Fabrication prevention rule: If a field might not have a real value, give it a union type — {"type": ["string", "null"]} — and leave it out of the parent object's required array. That gives the model permission to return null instead of inventing data.

Note the syntax: nullable: true is OpenAPI, not JSON Schema, and required is an array on the parent object rather than a per-property boolean. An input_schema using either form is rejected.

Few-Shot Examples

When to use few-shot: When instructions alone produce inconsistent output. Few-shot examples demonstrate the exact format and reasoning you expect.

Best practices:

2–4 examples is the sweet spot. More adds context cost; fewer may not cover edge cases.
Include reasoning in examples, not just input → output. Show why the answer is what it is.
Cover edge cases — at least one example should demonstrate boundary behaviour.
Place examples in the system prompt for caching benefits, or in the user message for per-request variation.

Diminishing returns: Going from 0 to 2 examples has the largest impact. Going from 4 to 8 rarely improves quality and costs more context.

Prompt Chaining

Scope note: the guide places prompt chaining under Task Statement 1.6 (fixed sequential pipelines versus dynamic adaptive decomposition), not Domain 4. It is repeated here because validation between steps is a natural companion to TS 4.4 retry loops, but expect it to be keyed as a Domain 1 construct.

Multi-step pipelines where each step is a focused prompt with a single responsibility.

Pattern: Step 1 (extract) → Step 2 (validate) → Step 3 (format) → Step 4 (synthesise)

Advantages:

Each step has a smaller, focused prompt — higher accuracy per step
Intermediate results can be validated before proceeding
Individual steps can be retried without rerunning the entire chain
Different models can be used for different steps (cost optimisation)

When to chain vs. single prompt: Chain when the task has distinct phases with different requirements. Use a single prompt when the task is cohesive and the output format is straightforward.

Retry Pattern — retry-with-error-feedback

When output fails validation, send back: original prompt + failed output + specific validation error.

Copy
Original: "Extract all dates from this contract"
Failed output: { dates: ["2024-01-15", "next Tuesday"] }
Error: "dates[1] is relative ('next Tuesday'), not absolute. All dates must be ISO 8601 format."


The model sees what it produced, what was wrong, and can correct specifically. Never just say "try again" — always include the specific error.

When to retry vs. escalate:

Retry: Validation error, format mismatch, missing field — the model can fix it
Escalate: Repeated failures (>2 retries), confidence below threshold, fundamentally wrong interpretation

Pydantic's role (Python): parsing enforces the schema; custom validators enforce semantic rules a JSON schema cannot express (sums that must match, ordered dates). Its ValidationError yields per-field messages you feed straight into the retry prompt.

Batch API
Property	Value
Cost saving	50% cheaper than synchronous
Latency	Up to 24 hours (not guaranteed faster)
Use case	Latency-tolerant bulk workloads
Not for	Real-time, interactive, or user-facing requests

Key exam point: Batch API is for throughput and cost, not speed. If the question mentions "real-time" or "user-facing", Batch API is wrong.

Self-Review Limitation

A model cannot effectively review its own output in the same session. It retains the reasoning that produced the original output and is biased toward confirming it.

Fix: Use a separate model instance (new conversation, no shared history) for review. The reviewing instance sees only the output, not the reasoning that produced it.

For large inputs: Use per-file passes (analyse each file independently) plus a cross-file integration pass (synthesise findings). This is the "attention dilution" mitigation — processing everything in one pass causes the model to miss details.

Decision Rules for the Exam
If the question says...	The answer is likely...
"guaranteed schema compliance"	Forced tool_choice with specific tool; tool_choice: any when the document type is unknown
"output sometimes has wrong format"	Add few-shot examples (2–4)
"model fabricates missing data"	Make schema fields optional/nullable
"validation failed, need to fix"	retry-with-error-feedback (original + failed + error)
"50% cost reduction", "bulk processing"	Batch API
"real-time", "user-facing"	NOT Batch API — use synchronous
"inconsistent output quality"	Few-shot examples or prompt chaining
"review its own output"	Separate instance (not same session)
"large document, missing details"	Per-file passes + cross-file integration
"instructions alone aren't working"	Add few-shot examples
Common Exam Traps
Trap	Correct Answer
"Use prompt-based JSON for production"	Wrong — use forced tool_choice for guaranteed schema
"Just say 'try again' on validation failure"	Wrong — include original + failed output + specific error
"Batch API for faster responses"	Wrong — Batch API trades latency for cost savings
"Review output in the same conversation"	Wrong — same-session review is biased; use separate instance
"Add 10+ few-shot examples for best results"	Wrong — 2–4 is the sweet spot; diminishing returns after that
"Required fields prevent fabrication"	Wrong — required fields CAUSE fabrication when data is missing
"One big prompt handles everything"	Wrong — chain prompts when task has distinct phases
Previous
Domain 3: Claude Code Configuration & Workflows
Next
Domain 5: Context Management & Reliability