# Glossary: Domain 4 — Prompt Engineering & Structured Output | Claude Certification Guide

> source: https://claudecertificationguide.com/learn/glossary/domain-4

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
Domain 4
DOMAIN 4
20%
Glossary: Prompt Engineering & Structured Output

Quick-lookup definitions for the 20% exam domain. Each entry includes a concise definition and exam context. Follow the lesson links to dive deeper.

System Prompt

The initial instruction message sent to Claude with the system parameter in an API call. It sets the overall behaviour, persona, constraints, and output format for the conversation. System prompts are not part of the message history — they sit above it and persist across all turns.

Exam context: Know the difference between system prompts and user messages. The exam tests system prompt best practices: clear role definition, explicit constraints, output format specification, and avoiding conflicting instructions.

See also: 4.1 System Prompts

Structured Output

A technique for getting Claude to return responses in a specific, machine-parseable format such as JSON, XML, or YAML. This is achieved through explicit format instructions in the prompt, JSON Schema definitions, or tool-use schemas.

Exam context: The exam tests two approaches to structured output: prompt-based instructions and tool-use schemas. Know the trade-offs, and know that tool-use schemas eliminate syntax errors without preventing semantic ones.

Current state (checked 14 August 2026): the API-level control for constrained output is now output_config.format (structured outputs), which the guide does not cover.

See also: 4.3 Structured Output

Prompt Chaining

An orchestration technique where the output of one Claude call becomes the input to the next. Each step in the chain has a focused, specific task. Chaining decomposes a complex problem into manageable steps and allows for validation or transformation between steps.

Exam context: Know when to use prompt chaining versus a single prompt. The exam tests the principle that each link in the chain should do one thing well. Understand how to pass context between chain steps and where to insert validation gates.

Scope note: the exam guide places prompt chaining under Task Statement 1.6, not Domain 4.

See also: 4.4 Validation-Retry Loops

Few-Shot Examples

Input-output pairs included in the prompt to demonstrate the desired behaviour, format, or reasoning pattern. By showing Claude concrete examples of correct responses, you reduce ambiguity and improve consistency. Few-shot examples are placed in the system prompt or user message before the actual request.

Exam context: Know best practices for few-shot examples: use diverse examples that cover edge cases, place them before the request, and match the exact format you want in the output. The exam may test how many examples are typically needed (2-4 targeted examples; more than 4 wastes tokens).

See also: 4.2 Few-Shot Prompting

Prompt Optimisation

The iterative process of refining prompts to improve output quality, reduce costs, and increase reliability. Techniques include simplifying instructions, removing ambiguity, adding constraints, and testing against a set of evaluation cases.

Exam context: The exam tests systematic approaches to prompt improvement rather than ad-hoc tweaking. Know the evaluation-driven workflow: define test cases, measure baseline performance, make targeted changes, and measure again.

See also: 4.5 Batch Processing

Output Validation

Programmatic checks applied to Claude's responses to verify they meet expected criteria before being used downstream. Validation can check format (valid JSON, correct schema), content (required fields present, values within ranges), and safety (no prohibited content). Failed validation triggers a retry or fallback.

Exam context: Know the common validation strategies: schema validation (JSON Schema, Zod, Pydantic), content checks, and review by an independent Claude instance without the generation context (same-session self-review retains reasoning bias and is a keyed exam trap). Understand how validation fits into an agentic loop.

See also: 4.4 Validation-Retry Loops

Prefilling

Starting Claude's response by supplying the opening of the assistant message, historically used to force a response into a given format.

Current state (checked 14 August 2026): a trailing assistant-turn prefill is rejected with an HTTP 400 on every current Claude model. The word "prefill" appears nowhere in the exam guide, so it is not a tested technique either. It is listed here only so you recognise the term if you meet it in older material; the documented replacement is output_config.format.

See also: 4.3 Structured Output

XML Tags

Delimiters used within prompts to structure content into clearly labelled sections. Claude is trained to understand XML-style tags like <instructions>, <context>, and <examples>. Using tags makes prompts more readable and helps Claude identify the purpose of each section.

Exam context: "XML" appears nowhere in the exam guide, so do not expect a keyed item on tag syntax. The underlying practice is genuine Anthropic guidance and worth knowing: tagged sections reduce misinterpretation of prompt boundaries.

See also: 4.1 System Prompts

Chain of Thought

A prompting technique that instructs Claude to show its reasoning step by step before arriving at a final answer. This improves accuracy on complex tasks by forcing the model to work through the problem methodically. Chain of thought can be elicited by adding instructions like "think step by step" or by using extended thinking.

Exam context: Know when chain of thought helps (complex reasoning, multi-step problems) and when it is unnecessary (simple factual retrieval). Understand the relationship between chain of thought prompting and Claude's extended thinking feature.

See also: 4.1 System Prompts

Temperature

A sampling parameter that historically controlled the randomness of Claude's responses. Lower temperatures (e.g., 0.0) produce more deterministic, focused output. Higher temperatures (e.g., 0.8) produce more varied, creative output. The default is 1.0.

Exam context: "Temperature" appears nowhere in the exam guide — not in any task statement, not in the appendix — so do not expect it to be keyed. It does appear as a distractor in this domain's bank, and is never the answer.

Current state (checked 14 August 2026): temperature, top_p and top_k are rejected with an HTTP 400 on current Claude models. Steer behaviour with prompting instead.

See also: 4.5 Batch Processing

Previous
Domain 3: Claude Code Configuration & Workflows
Next
Domain 5: Context Management & Reliability