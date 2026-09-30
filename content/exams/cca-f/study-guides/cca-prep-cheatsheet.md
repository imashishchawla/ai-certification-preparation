---
title: "Architect Foundations: exam decision cheat sheet"
description: "A scenario-first quick reference for the five Claude Certified Architect – Foundations domains."
guide_kind: "Cheat sheet"
guide_summary: "Recognize the constraint in a scenario, choose a reliable design, and explain why the tempting alternative fails."
exam_code: "CCAR-F"
study_time: "12–15 minutes"
exam_lens: "Five domains · six published scenarios"
exam_tip: "Read the decision rules once, then cover the answer column and rehearse each scenario aloud. Use the linked lessons when you cannot explain a tradeoff."
tags: ["study", "guide", "cheat-sheet", "cca-f"]
---

## Start with the shape of the exam

The [official exam guide](/ai-certification-preparation/exams/cca-f/study-materials/) describes **60 multiple-choice and multiple-response questions in 120 minutes**. Four of six published production scenarios are selected for a sitting. A question usually gives you a system, a constraint, and several plausible actions. Identify the constraint before choosing a tool or pattern.

| Domain | Weight | Ask yourself first |
| --- | ---: | --- |
| D1 · Agentic architecture & orchestration | 27% | Who owns the loop, handoff, and state? |
| D2 · Tool design & MCP integration | 18% | Which tool, scope, or error signal gives the model a safe next step? |
| D3 · Claude Code configuration & workflows | 20% | Where should the instruction live, and when should execution pause for a plan? |
| D4 · Prompt engineering & structured output | 20% | How is the output constrained, validated, and corrected? |
| D5 · Context management & reliability | 15% | What information must survive, and when should a human take over? |

**Fast question method:** (1) Name the scenario and required outcome. (2) Mark any hard constraint: latency, policy, context, cost, or output shape. (3) Choose the control that enforces that constraint. (4) Eliminate answers that merely ask the model to remember it.

## D1 · Agentic architecture & orchestration

| If the question describes… | Choose or check… | Watch for… |
| --- | --- | --- |
| A tool-using agent that must continue after a tool call | Branch on `stop_reason`: run tools on `tool_use`, return tool results, call the model again; finish on `end_turn`. | Treating assistant text as a completion signal. |
| Several specialist agents | A coordinator that delegates, passes task context explicitly, and combines results. | Assuming subagents share all conversation context. |
| A policy that must always block an action | A pre-execution hook or application check. Use a post-tool hook for normalization after execution. | Relying on prompt wording to guarantee a hard rule. |
| A previous session | Resume when its context is useful; fork to explore divergent paths; start fresh if prior observations are stale. | Reusing stale tool output after files or systems changed. |
| Large codebase exploration | Give an explorer a narrow question and request a concise, sourced return. | Pulling every file and tool result into the coordinator context. |

```js
while (true) {
  const response = await claude.messages.create({ /* ... */ });
  if (response.stop_reason === 'end_turn') break;
  if (response.stop_reason !== 'tool_use') throw new Error('Unexpected stop reason');
  const results = await executeTools(response.content);
  messages.push({ role: 'assistant', content: response.content });
  messages.push({ role: 'user', content: results });
}
```

**Scenario cue:** In customer support, separate the agent's proposed refund from the application rule that permits it. In research, specify what each specialist receives and what the coordinator verifies on return.

## D2 · Tool design & MCP integration

| If the question describes… | Choose or check… | Watch for… |
| --- | --- | --- |
| The wrong tool being called | Make descriptions distinguish purpose, inputs, output, and when to use each tool. Narrow overlapping choices. | Adding prompt keywords while tools remain ambiguous. |
| No matching records | Return a valid empty result. | Labeling “no records” as an execution failure and retrying forever. |
| A tool failure | Return an error signal with actionable context; classify whether retry makes sense. | Hiding a timeout or permission error as an empty success. |
| A shared external integration | Configure an MCP server at the appropriate project or user scope and pass secrets through environment configuration. | Committing personal credentials or exposing every tool to every agent. |
| Filesystem versus external data | Use built-in file/search tools for local code; use MCP tools for external actions and data, resources for browsable context. | Building a custom tool for an action the built-in tools already cover. |

**Remember:** In MCP, `isError: false` with empty content can be a successful query. `isError: true` means the call failed. A tool contract can additionally describe transient, validation, business, and permission failures; these categories are an application design pattern, not mandatory MCP fields.

**Scenario cue:** A customer lookup with no orders is different from a database timeout. The next step should differ too.

## D3 · Claude Code configuration & workflows

| If the question describes… | Choose or check… | Watch for… |
| --- | --- | --- |
| A rule for everyone on a project | Put it in a project `CLAUDE.md`; use a nearer directory file or path-scoped rule for narrower work. | Storing shared rules only in a personal user file. |
| A reusable workflow | Use a skill or command with clear purpose and scope. | Copying a long workflow into every prompt. |
| A broad or risky change | Review a plan before execution; use direct execution for small, clear tasks. | Treating a plan as a substitute for validation or approval. |
| CI that needs parseable findings | Use non-interactive output with an explicit schema, then validate the result. | Parsing free-form prose as a stable machine contract. |
| A prior session after repository changes | Resume with a clear note about changed files, or restart when the old context is unreliable. | Assuming the agent automatically knows what changed. |

**Scope ladder:** user preferences → project instructions → directory or path-specific instructions. Prefer the narrowest shared location that covers the work. For CI findings, include evidence or a `detected_pattern` field if dismissal trends will help tune false positives.

**Scenario cue:** In code generation, the question often hinges on *where* a convention should live. In CI/CD, it often hinges on how the output is consumed downstream.

## D4 · Prompt engineering & structured output

| If the question describes… | Choose or check… | Watch for… |
| --- | --- | --- |
| A strict JSON contract | Define a schema, validate the response, and retry with the exact field error when needed. | Assuming a “return JSON” prompt proves validity. |
| A category list that may grow | Add an `other` route with a detail field and a review path. | Forcing an unfamiliar value into the nearest wrong enum. |
| Repeated review misses | Review locally per file, then examine cross-file flow; record prior findings for a dedup pass. | Asking one pass to inspect too many files at equal depth. |
| Many independent, non-urgent requests | Consider Message Batches when asynchronous completion is acceptable. | Putting a live user wait or blocking CI step behind batch latency. |
| Tool selection must happen | Choose an appropriate `tool_choice` mode and constrain the available tools. | Treating optional tool use as a guaranteed call. |

**Validation loop:** generate → parse and validate → return a precise field-level error → retry within a limit → escalate persistent failure. For extraction, carry source or provenance with each field so a reviewer can check it.

**Scenario cue:** For document extraction, schema validity and factual correctness are separate checks. For code review, a finding needs enough evidence to act on and enough structure to measure false positives.

## D5 · Context management & reliability

| If the question describes… | Choose or check… | Watch for… |
| --- | --- | --- |
| Important details lost in long context | Split work into focused passes and preserve exact facts in a compact record. | Simply increasing the context window. |
| Long tool responses | Trim irrelevant fields before adding them to conversation history. | Dropping fields needed for later decisions or error handling. |
| An agent failure | Propagate failure type, retryability, attempted action, and partial results to the coordinator. | Returning `[]` so failure looks like “nothing found.” |
| An uncertain extraction | Calibrate confidence against labeled examples and route doubtful fields to review. | Treating an uncalibrated score as proof. |
| A final research report | Use tables for comparisons, prose for reasoning, and explicit source conflicts. | Flattening all evidence into one undifferentiated summary. |

**Scenario cue:** In support, preserve exact order IDs and amounts through summarization. In research, keep citations attached to claims and show conflicting sources. In extraction, route ambiguous or unsupported fields to a human.

## Six scenarios to rehearse

Four of these six published scenarios frame a sitting. Rehearse each as a sequence of decisions, rather than memorizing a single answer.

| Scenario | Likely decision pressure | Rehearsal question |
| --- | --- | --- |
| Customer support resolution | Agent loop, tool errors, refund policy, escalation | What happens after a tool fails or a refund exceeds policy? |
| Code generation with Claude Code | Instruction scope, skills, plan versus execution | Where should the team rule live? |
| Multi-agent research | Delegation, context, citations, synthesis | What must the coordinator pass and verify? |
| Developer productivity tooling | Built-in tools, MCP scope, codebase exploration | Which work stays local and which needs an integration? |
| Claude Code in CI/CD | Structured findings, false positives, latency | Can downstream automation trust the output shape? |
| Structured data extraction | Schema, retries, provenance, review | What happens when a field is valid JSON but unsupported? |

For full walkthroughs, use the [scenario exercises](/ai-certification-preparation/exams/cca-f/study-guides/cca-prep-exam-scenarios/). For domain depth, return to the [study guide index](/ai-certification-preparation/exams/cca-f/study-guides/).

## Source and scope

This is a condensed, reorganized study aid based on the [community CCA prep cheatsheet](https://github.com/vinipx/cca-prep/blob/main/src/data/cheatsheet.ts), with the exam structure cross-checked against the [local official guide](/ai-certification-preparation/exams/cca-f/study-materials/). The decision cues are study advice, not official exam questions or guaranteed answers. Check current product documentation for exact CLI options and API behavior before using examples in production.
