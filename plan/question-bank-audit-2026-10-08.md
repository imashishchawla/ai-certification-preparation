# Question bank audit — 2026-10-08

Scope: `data/questions/*/questions.json` in this repository. This is a local source-bank audit, not a check of a live deployment. No question records were changed.

This report captures the bank **before** the official-scope review later on 2026-10-08. The status labels in the full comparisons are a historical snapshot. The later review quarantined the confirmed duplicates, unusable questions, and scope/answer exclusions; see [the official-scope review](cca-f-official-scope-review-2026-10-08.md) for current decisions.

## Inventory and schema validation

| Exam | Records | State |
| --- | ---: | --- |
| `cca-f` | 1,217 | All `ready` |
| `ccao-f` | 20 | All `pending-review` |
| `ccar-p` | 18 | All `pending-review` |
| `ccdv-f` | 14 | All `pending-review` |
| `terraform-associate` | 5 | All `ready` |
| **Total** | **1,274** | |

`node scripts/validate-questions.mjs` passed with zero schema/answer-reference errors and zero duplicate IDs. That validator does not compare question content or detect placeholder choices.

## Confirmed duplicate questions

There are **56 duplicate pairs**, all in `cca-f` and currently `ready`:

1. **51 pairs from the same 170-question source.** Each pair has the same numbered source question, the same answer, and the same four choice texts after stripping formatting. Pair IDs are `cca-f-prep-NNN` and `cca-f-cca-prep-170-qu-NNN` for these suffixes:

   `001, 002, 003, 004, 005, 007, 008, 009, 010, 016, 021, 023, 024, 027, 040, 045, 046, 047, 051, 052, 053, 062, 069, 076, 078, 081, 101, 104, 105, 106, 107, 108, 109, 113, 119, 120, 129, 133, 141, 143, 144, 146, 159, 160, 161, 162, 163, 164, 166, 169, 170`.

   Of these, 24 pairs have identical prompts after case/punctuation normalization. The others contain a scenario prefix or rewritten wording. Retain the better question and explanation when resolving each pair; some `prep` versions include richer context and reference links.

2. **5 foundation/associate pairs.** These have the same answer and choice texts; the foundation copy adds a malformed topic prefix to the same substantive question:

   | Foundation ID | Associate ID |
   | --- | --- |
   | `cca-f-foundation-003` | `cca-f-associate-163` |
   | `cca-f-foundation-004` | `cca-f-associate-164` |
   | `cca-f-foundation-005` | `cca-f-associate-165` |
   | `cca-f-foundation-008` | `cca-f-associate-168` |
   | `cca-f-foundation-009` | `cca-f-associate-169` |

`cca-f-scenario-035` and `cca-f-scenario-041` reuse all four choices but give different situations; treat them as a manual review pair, not a confirmed duplicate.

## Incomplete or malformed content

| Finding | Records | Impact |
| --- | --- | --- |
| Choice texts are literal `* A`, `* B`, `* C`, `* D` | `cca-f-archeval-012`, `013`, `041`, `052`, `067`, `069` | Published questions are unusable despite passing schema validation. |
| Ordering question omits the five steps to order | `ccao-f-certyiq-001` | Cannot be answered from the stored prompt. The missing steps are present in its `.data` raw source. This record is still pending review. |
| No explanation | All five `terraform-associate` records (`official-004-001` through `005`) | The schema allows this, but learners receive no rationale. |
| Domain is `D0 Pending objective mapping` | All 52 records in `ccao-f`, `ccar-p`, `ccdv-f` | Intended review work remains; none of these records is published. |
| Prompt contains a malformed `**` topic prefix | `cca-f-foundation-001` through `035` | Visible content needs cleanup; five of these are duplicates above. |
| Repeated question sentence and stray `****` in a choice | `cca-f-scenario-035`, `cca-f-scenario-041` | Visible text needs cleanup. |

The source schema treats `questionType`, `difficulty`, `sourceLocator`, `sourceHash`, and `explanation` as optional. Their absence alone is not counted as a schema failure. `questionType` is absent in all 1,217 `cca-f` records; `difficulty` is absent in the 57 non-`cca-f` records.

## Copies and publication

`public/data/exams/cca-f/questions.json` contains all 1,217 eligible CCA-F IDs, including the duplicates and unusable records. The other exam public artifacts contain zero published questions, consistent with their release rules.

`static/data/questions/cca-f/questions.json` has 1,196 records: 21 fewer than the source bank, and 36 shared records differ. The browser question loader reads `data/exams/<exam>/questions.json`, but the stale static copy is an additional maintenance risk.

## Recommended order

1. Remove the six placeholder-choice questions from the ready/published pool until their choices can be recovered and reviewed.
2. Resolve the 56 duplicate pairs by comparing explanation quality and preserving the preferred IDs; rebuild the browser artifacts and update question counts.
3. Restore the missing five-step list in `ccao-f-certyiq-001` from its raw source and continue review of the 52 `D0` records.
4. Clean the 35 foundation prompts and the two scenario prompts; add explanations to the five Terraform questions if reliable source material is available.
5. Add content checks for placeholder choices, normalized duplicate prompts/choice sets, and required context to the validation workflow.

## Full duplicate pair comparison

“Original” means the first copy in the source bank; it does not establish authorship. Both complete prompts, any separate scenario context, choices, answer keys, and explanations are shown below.

### Pair 01

#### Original (first in bank): cca-f-prep-001

Source: [question record](../data/questions/cca-f/questions.json#L3) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
The application runner inspects the API response and observes `stop_reason: "tool_use"`. What does this status code indicate your client-side agentic loop runner must do before returning a final answer to the user?
~~~

**topicBrief**

~~~text
Topic Brief: Agentic Loop Execution & Stop Signals
~~~

**roleContext**

~~~text
Role: AI Systems Engineer Handling Claude Agent SDK
~~~

**scenario**

~~~text
You are building an autonomous customer support bot using the Claude Agent SDK. During an active execution turn, the model emits an API response requesting a query to the customer order database via `lookup_order`.
~~~

**Choices**

~~~text
A. Claude is requesting that a tool be executed and its result fed back
B. Claude has finished the task and no further action is needed
C. The agentic loop has exceeded its configured maximum iteration count limit and was terminated
D. Claude encountered an unrecoverable error and cannot continue
~~~

**Correct:** `A`

**Explanation**

~~~text
`stop_reason: "tool_use"` means Claude wants to invoke one or more tools. Your loop must execute those tools, append the results to the conversation history, and call Claude again. The loop only terminates when `stop_reason` is `"end_turn"` (or a budget/turn limit is hit).
Refs: [Agent SDK — how the loop works](https://platform.claude.com/docs/en/agent-sdk/agent-loop) · [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-001

Source: [question record](../data/questions/cca-f/questions.json#L6862) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
In an agentic loop, what does a `stop_reason` value of `"tool_use"` indicate?
~~~

**Choices**

~~~text
A. * Claude is requesting that a tool be executed and its result fed back
B. * Claude has finished the task and no further action is needed
C. * The agentic loop has exceeded its configured maximum iteration count limit and was terminated
D. * Claude encountered an unrecoverable error and cannot continue
~~~

**Correct:** `A`

**Explanation**

~~~text
`stop_reason: "tool_use"` means Claude wants to invoke one or more tools. Your loop must execute those tools, append the results to the conversation history, and call Claude again. The loop only terminates when `stop_reason` is `"end_turn"` (or a budget/turn limit is hit).
~~~

### Pair 02

#### Original (first in bank): cca-f-prep-002

Source: [question record](../data/questions/cca-f/questions.json#L38) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
The runner inspects the response and receives `stop_reason: "end_turn"`. What does this control signal indicate regarding the agentic loop lifecycle?
~~~

**topicBrief**

~~~text
Topic Brief: Agentic Loop Termination Lifecycle
~~~

**roleContext**

~~~text
Role: AI Systems Engineer Handling Claude Agent SDK
~~~

**scenario**

~~~text
An autonomous agent has completed multiple tool calls, querying database records and calculating account refunds. In its most recent turn, the model outputs a natural language summary to the customer.
~~~

**Choices**

~~~text
A. A tool execution failed and must be retried by the loop handler
B. Claude has completed its response and the loop should terminate
C. The model ran out of available context window space mid-response
D. The user must provide additional input before the loop continues
~~~

**Correct:** `B`

**Explanation**

~~~text
`end_turn` means Claude has produced a final text-only response with no pending tool calls. This is the correct loop termination signal. Do not check text content or other heuristics to decide when to stop — always use `stop_reason`.
Refs: [Agent SDK — how the loop works](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-002

Source: [question record](../data/questions/cca-f/questions.json#L6894) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
What does `stop_reason: "end_turn"` signal in an agentic loop?
~~~

**Choices**

~~~text
A. * A tool execution failed and must be retried by the loop handler
B. * Claude has completed its response and the loop should terminate
C. * The model ran out of available context window space mid-response
D. * The user must provide additional input before the loop continues
~~~

**Correct:** `B`

**Explanation**

~~~text
`end_turn` means Claude has produced a final text-only response with no pending tool calls. This is the correct loop termination signal. Do not check text content or other heuristics to decide when to stop — always use `stop_reason`.
~~~

### Pair 03

#### Original (first in bank): cca-f-prep-003

Source: [question record](../data/questions/cca-f/questions.json#L73) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
What is the primary architectural responsibility of the central coordinator agent in this hub-and-spoke multi-agent topology?
~~~

**topicBrief**

~~~text
Topic Brief: Hub-and-Spoke Coordinator Patterns
~~~

**roleContext**

~~~text
Role: Lead AI Architect Designing Multi-Agent Systems
~~~

**scenario**

~~~text
You are architecting an enterprise legal research platform with five specialized worker subagents (contract analysis, case law search, compliance check, citation verifier, and report formatter).
~~~

**Choices**

~~~text
A. To execute all tool calls directly without delegating to others
B. To act as a proxy relay between subagents and external tool APIs
C. To decompose tasks, delegate to subagents, and aggregate results
D. To store a shared memory space accessible by all active subagents
~~~

**Correct:** `C`

**Explanation**

~~~text
In hub-and-spoke, the coordinator is the central hub. It decomposes the task, delegates to specialist subagents, routes information, and aggregates results. Subagents communicate only through the coordinator — never directly with each other.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-003

Source: [question record](../data/questions/cca-f/questions.json#L6926) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
What is the role of a coordinator agent in a hub-and-spoke multi-agent architecture?
~~~

**Choices**

~~~text
A. * To execute all tool calls directly without delegating to others
B. * To act as a proxy relay between subagents and external tool APIs
C. * To decompose tasks, delegate to subagents, and aggregate results
D. * To store a shared memory space accessible by all active subagents
~~~

**Correct:** `C`

**Explanation**

~~~text
In hub-and-spoke, the coordinator is the central hub. It decomposes the task, delegates to specialist subagents, routes information, and aggregates results. Subagents communicate only through the coordinator — never directly with each other.
~~~

### Pair 04

#### Original (first in bank): cca-f-prep-004

Source: [question record](../data/questions/cca-f/questions.json#L108) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Which Claude Agent SDK parameter should you configure in the runner to enforce a hard ceiling on the maximum number of tool-use turns allowed per execution?
~~~

**topicBrief**

~~~text
Topic Brief: Preventing Runaway Agentic Loops
~~~

**roleContext**

~~~text
Role: Cloud Systems Engineer Handling Production Cost Controls
~~~

**scenario**

~~~text
An autonomous debugging agent occasionally gets trapped in an infinite cycle of failing bash commands and retry loops, threatening to exhaust API token budgets and incur runaway costs.
~~~

**Choices**

~~~text
A. max_iterations
B. turn_limit
C. stop_after
D. max_turns
~~~

**Correct:** `D`

**Explanation**

~~~text
`max_turns` (Python) / `maxTurns` (TypeScript) limits how many tool-use turns the loop can run. It counts tool-use turns only, not the final text response. `max_budget_usd` / `maxBudgetUsd` is the cost-based equivalent.
Refs: [Agent SDK — turns and budget](https://platform.claude.com/docs/en/agent-sdk/agent-loop)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-004

Source: [question record](../data/questions/cca-f/questions.json#L6958) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Which SDK option caps the number of tool-use turns in an agentic loop?
~~~

**Choices**

~~~text
A. * max_iterations
B. * turn_limit
C. * stop_after
D. * max_turns
~~~

**Correct:** `D`

**Explanation**

~~~text
`max_turns` (Python) / `maxTurns` (TypeScript) limits how many tool-use turns the loop can run. It counts tool-use turns only, not the final text response. `max_budget_usd` / `maxBudgetUsd` is the cost-based equivalent.
~~~

### Pair 05

#### Original (first in bank): cca-f-prep-005

Source: [question record](../data/questions/cca-f/questions.json#L143) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Does the spawned subagent automatically inherit and have access to the coordinator's entire conversation history?
~~~

**topicBrief**

~~~text
Topic Brief: Subagent Context Scoping & Isolation
~~~

**roleContext**

~~~text
Role: AI Pipeline Architect Building Hierarchical Agents
~~~

**scenario**

~~~text
A coordinator agent with 45,000 tokens of accumulated conversational history spawns a specialized code analysis subagent using the Task tool to audit a single cryptographic function.
~~~

**Choices**

~~~text
A. No — subagents have isolated context and receive information only via their prompt
B. Yes — the Agent SDK shares conversation context and tool results automatically between all agents
C. Yes — subagents inherit context through the SDK's shared session state store
D. Only if the coordinator explicitly sets `share_context: true` in the Task call
~~~

**Correct:** `A`

**Explanation**

~~~text
Subagents are isolated. They have no access to the coordinator's conversation history unless the coordinator explicitly includes the relevant information in the subagent's prompt. This is one of the most commonly tested facts on the exam.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-005

Source: [question record](../data/questions/cca-f/questions.json#L6990) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
After a coordinator spawns a subagent using the Task tool, does the subagent automatically have access to the coordinator's conversation history?
~~~

**Choices**

~~~text
A. * No — subagents have isolated context and receive information only via their prompt
B. * Yes — the Agent SDK shares conversation context and tool results automatically between all agents
C. * Yes — subagents inherit context through the SDK's shared session state store
D. * Only if the coordinator explicitly sets `share_context: true` in the Task call
~~~

**Correct:** `A`

**Explanation**

~~~text
Subagents are isolated. They have no access to the coordinator's conversation history unless the coordinator explicitly includes the relevant information in the subagent's prompt. This is one of the most commonly tested facts on the exam.
~~~

### Pair 06

#### Original (first in bank): cca-f-prep-007

Source: [question record](../data/questions/cca-f/questions.json#L213) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A coordinator agent decomposes a research task into 3 fixed subtopics and consistently misses entire subject areas. What is the root cause?
~~~

**Choices**

~~~text
A. The subagents are not returning their completed results back to the coordinator agent for aggregation
B. The context window is too small to handle all aspects of the full topic
C. Fixed decomposition is too narrow — the coordinator should adapt scope dynamically
D. The web search tool is returning incomplete or low-quality search results
~~~

**Correct:** `C`

**Explanation**

~~~text
Fixed decomposition causes incomplete coverage when topics are broader or more complex than the preset subtopics. The coordinator should analyze the query and dynamically determine how many subtopics to generate, not always route through a fixed pipeline. This is a task decomposition design flaw.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-007

Source: [question record](../data/questions/cca-f/questions.json#L7022) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A coordinator agent decomposes a research task into 3 fixed subtopics and consistently misses entire subject areas. What is the root cause?
~~~

**Choices**

~~~text
A. * The subagents are not returning their completed results back to the coordinator agent for aggregation
B. * The context window is too small to handle all aspects of the full topic
C. * Fixed decomposition is too narrow — the coordinator should adapt scope dynamically
D. * The web search tool is returning incomplete or low-quality search results
~~~

**Correct:** `C`

**Explanation**

~~~text
Fixed decomposition causes incomplete coverage when topics are broader or more complex than the preset subtopics. The coordinator should analyze the query and dynamically determine how many subtopics to generate, not always route through a fixed pipeline. This is a task decomposition design flaw.
~~~

### Pair 07

#### Original (first in bank): cca-f-prep-008

Source: [question record](../data/questions/cca-f/questions.json#L245) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
How should the coordinator formulate its tool invocation to spawn three worker subagents to run in parallel using the Task tool?
~~~

**topicBrief**

~~~text
Topic Brief: Parallel Subagent Spawning via Task Tool
~~~

**roleContext**

~~~text
Role: Performance Architect Optimizing Multi-Agent Latency
~~~

**scenario**

~~~text
A coordinator agent needs to analyze three independent microservice repositories simultaneously to meet a 30-second pipeline latency SLA.
~~~

**Choices**

~~~text
A. Set `parallel: true` in the Task tool configuration object for concurrent execution
B. Call the Task tool separately, once per coordinator turn each time
C. Use the `fork_session` function instead of the standard Task tool
D. Emit multiple Task tool calls within a single coordinator response
~~~

**Correct:** `D`

**Explanation**

~~~text
Parallel subagent execution is triggered by emitting multiple Task tool calls in a single coordinator response (single turn). If you make separate Task calls across separate turns, they execute sequentially. The SDK interprets multiple tool calls in one response as concurrent invocations.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-008

Source: [question record](../data/questions/cca-f/questions.json#L7054) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You want to spawn multiple subagents to run in parallel. How do you achieve this with the Task tool?
~~~

**Choices**

~~~text
A. * Set `parallel: true` in the Task tool configuration object for concurrent execution
B. * Call the Task tool separately, once per coordinator turn each time
C. * Use the `fork_session` function instead of the standard Task tool
D. * Emit multiple Task tool calls within a single coordinator response
~~~

**Correct:** `D`

**Explanation**

~~~text
Parallel subagent execution is triggered by emitting multiple Task tool calls in a single coordinator response (single turn). If you make separate Task calls across separate turns, they execute sequentially. The SDK interprets multiple tool calls in one response as concurrent invocations.
~~~

### Pair 08

#### Original (first in bank): cca-f-prep-009

Source: [question record](../data/questions/cca-f/questions.json#L280) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
When passing context from a web search subagent to a synthesis subagent, what should the coordinator include to preserve attribution?
~~~

**Choices**

~~~text
A. Structured data separating content from metadata like source URLs and page numbers
B. Only the final text summary without source URLs; including metadata adds unnecessary token overhead cost
C. A plain text blob of all findings concatenated together without structure
D. A reference to the shared session ID where the subagent results are stored
~~~

**Correct:** `A`

**Explanation**

~~~text
The coordinator should use structured data to separate content (what was found) from metadata (where it came from — URLs, titles, page numbers). This allows the synthesis subagent to produce properly cited output and enables the coordinator to trace any finding back to its source for verification.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-009

Source: [question record](../data/questions/cca-f/questions.json#L7086) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
When passing context from a web search subagent to a synthesis subagent, what should the coordinator include to preserve attribution?
~~~

**Choices**

~~~text
A. * Structured data separating content from metadata like source URLs and page numbers
B. * Only the final text summary without source URLs; including metadata adds unnecessary token overhead cost
C. * A plain text blob of all findings concatenated together without structure
D. * A reference to the shared session ID where the subagent results are stored
~~~

**Correct:** `A`

**Explanation**

~~~text
The coordinator should use structured data to separate content (what was found) from metadata (where it came from — URLs, titles, page numbers). This allows the synthesis subagent to produce properly cited output and enables the coordinator to trace any finding back to its source for verification.
~~~

### Pair 09

#### Original (first in bank): cca-f-prep-010

Source: [question record](../data/questions/cca-f/questions.json#L312) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Which specific tool must be explicitly included in the coordinator's `allowedTools` list to permit subagent delegation?
~~~

**topicBrief**

~~~text
Topic Brief: Coordinator Tool Permissions & Spawning
~~~

**roleContext**

~~~text
Role: DevSecOps Engineer Configuring Agent Tool Sandboxes
~~~

**scenario**

~~~text
You are defining an AgentDefinition for a high-level coordinator agent. You need to ensure the coordinator has permission to spawn and delegate tasks to specialized subagents without granting it arbitrary bash access.
~~~

**Choices**

~~~text
A. Spawn
B. Task
C. Delegate
D. SubAgent
~~~

**Correct:** `B`

**Explanation**

~~~text
The `Task` tool is the Agent SDK mechanism for spawning subagents. If "Task" is not included in the coordinator's `allowedTools`, the coordinator cannot invoke subagents — the call will either fail or Claude will not attempt it.
Refs: [Agent SDK quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-010

Source: [question record](../data/questions/cca-f/questions.json#L7118) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Which mechanism must be included in the coordinator's `allowedTools` for it to spawn subagents?
~~~

**Choices**

~~~text
A. * Spawn
B. * Task
C. * Delegate
D. * SubAgent
~~~

**Correct:** `B`

**Explanation**

~~~text
The `Task` tool is the Agent SDK mechanism for spawning subagents. If "Task" is not included in the coordinator's `allowedTools`, the coordinator cannot invoke subagents — the call will either fail or Claude will not attempt it.
~~~

### Pair 10

#### Original (first in bank): cca-f-prep-016

Source: [question record](../data/questions/cca-f/questions.json#L513) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You are designing a coordinator prompt for a multi-agent research system. Which prompt style leads to better subagent outcomes?
~~~

**Choices**

~~~text
A. Step-by-step procedural instructions: "First search for X, then analyze Y, then synthesize Z"
B. Goal-oriented prompts specifying research goals and quality criteria rather than procedural steps
C. Single-sentence prompts to minimize token usage
D. Prompts that list which tools each subagent should use in what order
~~~

**Correct:** `B`

**Explanation**

~~~text
Goal-oriented coordinator prompts ("Research the impact of X on Y, ensure findings are cited, cover both short-term and long-term effects") outperform procedural step-by-step instructions. Specifying the *what* and *quality bar* rather than the *how* allows subagents to adapt their approach based on what they discover, producing more thorough and accurate results.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-016

Source: [question record](../data/questions/cca-f/questions.json#L7150) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You are designing a coordinator prompt for a multi-agent research system. Which prompt style leads to better subagent outcomes?
~~~

**Choices**

~~~text
A. * Step-by-step procedural instructions: "First search for X, then analyze Y, then synthesize Z"
B. * Goal-oriented prompts specifying research goals and quality criteria rather than procedural steps
C. * Single-sentence prompts to minimize token usage
D. * Prompts that list which tools each subagent should use in what order
~~~

**Correct:** `B`

**Explanation**

~~~text
Goal-oriented coordinator prompts ("Research the impact of X on Y, ensure findings are cited, cover both short-term and long-term effects") outperform procedural step-by-step instructions. Specifying the *what* and *quality bar* rather than the *how* allows subagents to adapt their approach based on what they discover, producing more thorough and accurate results.
~~~

### Pair 11

#### Original (first in bank): cca-f-prep-021

Source: [question record](../data/questions/cca-f/questions.json#L673) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A subagent fails to retrieve data from a slow external API (timeout). What is the correct error-handling architecture?
~~~

**Choices**

~~~text
A. Return an empty result set and let the coordinator decide what to do
B. Immediately propagate the error to the coordinator without any local recovery attempt
C. Attempt local recovery (e.g., retry); if unresolvable, propagate to coordinator with partial results and a structured error description
D. Log the error silently and continue as if the tool call succeeded
~~~

**Correct:** `C`

**Explanation**

~~~text
Subagents should attempt local recovery for transient errors (timeouts, temporary unavailability) before escalating. When escalating, they must return structured context: what data was retrieved before failure, what failed and why, and whether retry is appropriate. Silent error suppression prevents coordinator recovery; immediate escalation without retry wastes resources on recoverable failures.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) · [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-021

Source: [question record](../data/questions/cca-f/questions.json#L7182) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A subagent fails to retrieve data from a slow external API (timeout). What is the correct error-handling architecture?
~~~

**Choices**

~~~text
A. * Return an empty result set and let the coordinator decide what to do
B. * Immediately propagate the error to the coordinator without any local recovery attempt
C. * Attempt local recovery (e.g., retry); if unresolvable, propagate to coordinator with partial results and a structured error description
D. * Log the error silently and continue as if the tool call succeeded
~~~

**Correct:** `C`

**Explanation**

~~~text
Subagents should attempt local recovery for transient errors (timeouts, temporary unavailability) before escalating. When escalating, they must return structured context: what data was retrieved before failure, what failed and why, and whether retry is appropriate. Silent error suppression prevents coordinator recovery; immediate escalation without retry wastes resources on recoverable failures.
~~~

### Pair 12

#### Original (first in bank): cca-f-prep-023

Source: [question record](../data/questions/cca-f/questions.json#L738) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your coordinator agent delegates a broad research topic to four specialist subagents. The synthesis subagent's output has poor source attribution — it cannot identify which findings came from which source. What caused this and what is the fix?
~~~

**Choices**

~~~text
A. The synthesis subagent needs a larger context window to hold all sources
B. The coordinator passed findings as plain concatenated text without preserving source metadata; fix by passing structured data that separates content from source URLs, titles, and page numbers
C. The web search subagent is not returning URLs in its results
D. Attribution requires a dedicated attribution subagent in the pipeline
~~~

**Correct:** `B`

**Explanation**

~~~text
When a coordinator passes subagent findings as unstructured text blobs, attribution data (source URLs, document titles, page numbers) is lost or conflated. The fix is to pass structured data — e.g., a JSON array where each finding has a `content` field and a `source` field with URL and metadata. The synthesis subagent can then produce properly cited output.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-023

Source: [question record](../data/questions/cca-f/questions.json#L7214) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Multi-Agent Research System* Your coordinator agent delegates a broad research topic to four specialist subagents. The synthesis subagent's output has poor source attribution — it cannot identify which findings came from which source. What caused this and what is the fix?
~~~

**Choices**

~~~text
A. * The synthesis subagent needs a larger context window to hold all sources
B. * The coordinator passed findings as plain concatenated text without preserving source metadata; fix by passing structured data that separates content from source URLs, titles, and page numbers
C. * The web search subagent is not returning URLs in its results
D. * Attribution requires a dedicated attribution subagent in the pipeline
~~~

**Correct:** `B`

**Explanation**

~~~text
When a coordinator passes subagent findings as unstructured text blobs, attribution data (source URLs, document titles, page numbers) is lost or conflated. The fix is to pass structured data — e.g., a JSON array where each finding has a `content` field and a `source` field with URL and metadata. The synthesis subagent can then produce properly cited output.
~~~

### Pair 13

#### Original (first in bank): cca-f-prep-024

Source: [question record](../data/questions/cca-f/questions.json#L771) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
An engineer asks your developer productivity agent to "add comprehensive tests to this legacy codebase." The agent immediately starts writing tests for the first file it finds, without understanding the codebase structure. What task decomposition pattern should the agent use?
~~~

**Choices**

~~~text
A. Prompt chaining: write tests for each file in alphabetical order
B. Dynamic adaptive decomposition: first map codebase structure, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered
C. Parallel decomposition: spawn one subagent per file simultaneously
D. Sequential fixed pipeline: analyze → write → run → fix
~~~

**Correct:** `B`

**Explanation**

~~~text
Open-ended tasks on unknown systems require dynamic adaptive decomposition. The agent cannot know the right approach until it understands the codebase. Phase 1: map the structure and understand the domain. Phase 2: identify high-impact, under-tested areas. Phase 3: create a prioritized plan that adapts as dependencies and test complexity emerge. This contrasts with prompt chaining, which requires knowing the steps upfront.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-024

Source: [question record](../data/questions/cca-f/questions.json#L7246) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Developer Productivity Tools* An engineer asks your developer productivity agent to "add comprehensive tests to this legacy codebase." The agent immediately starts writing tests for the first file it finds, without understanding the codebase structure. What task decomposition pattern should the agent use?
~~~

**Choices**

~~~text
A. * Prompt chaining: write tests for each file in alphabetical order
B. * Dynamic adaptive decomposition: first map codebase structure, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered
C. * Parallel decomposition: spawn one subagent per file simultaneously
D. * Sequential fixed pipeline: analyze → write → run → fix
~~~

**Correct:** `B`

**Explanation**

~~~text
Open-ended tasks on unknown systems require dynamic adaptive decomposition. The agent cannot know the right approach until it understands the codebase. Phase 1: map the structure and understand the domain. Phase 2: identify high-impact, under-tested areas. Phase 3: create a prioritized plan that adapts as dependencies and test complexity emerge. This contrasts with prompt chaining, which requires knowing the steps upfront.
~~~

### Pair 14

#### Original (first in bank): cca-f-prep-027

Source: [question record](../data/questions/cca-f/questions.json#L870) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your agent has resolved a complex billing dispute but cannot resolve a technical account issue that requires backend engineering access. It must hand off to a human agent. What should the handoff summary include?
~~~

**Choices**

~~~text
A. A link to the conversation transcript only — the human agent can read it
B. Customer ID, root cause analysis, actions already taken, refund amounts applied, and recommended next action
C. A single sentence summary of the issue
D. The full raw conversation history in JSON format
~~~

**Correct:** `B`

**Explanation**

~~~text
Human agents receiving escalations typically do not have access to the full conversation transcript or AI session context. The structured handoff summary must be self-contained: customer ID (for lookup), root cause (what was determined), actions taken (what the AI already did, including any credits applied), and recommended next action (what the human should do first). This prevents duplicate actions and allows the human to work from a cold start.
Refs: [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-027

Source: [question record](../data/questions/cca-f/questions.json#L7278) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Customer Support Resolution Agent* Your agent has resolved a complex billing dispute but cannot resolve a technical account issue that requires backend engineering access. It must hand off to a human agent. What should the handoff summary include?
~~~

**Choices**

~~~text
A. * A link to the conversation transcript only — the human agent can read it
B. * Customer ID, root cause analysis, actions already taken, refund amounts applied, and recommended next action
C. * A single sentence summary of the issue
D. * The full raw conversation history in JSON format
~~~

**Correct:** `B`

**Explanation**

~~~text
Human agents receiving escalations typically do not have access to the full conversation transcript or AI session context. The structured handoff summary must be self-contained: customer ID (for lookup), root cause (what was determined), actions taken (what the AI already did, including any credits applied), and recommended next action (what the human should do first). This prevents duplicate actions and allows the human to work from a cold start.
~~~

### Pair 15

#### Original (first in bank): cca-f-prep-040

Source: [question record](../data/questions/cca-f/questions.json#L1287) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You want to validate all tool inputs against a strict schema and ensure Claude never passes missing or incorrectly typed parameters. What configuration achieves this?
~~~

**Choices**

~~~text
A. Add a `validate: true` flag to the tool definition
B. Use `strict: true` in tool definitions to enable Structured Outputs for guaranteed schema validation
C. Write a PostToolUse hook that validates inputs after the call
D. Add explicit validation instructions to the tool description
~~~

**Correct:** `B`

**Explanation**

~~~text
`strict: true` in tool definitions enables Structured Outputs mode, which guarantees that Claude's tool calls always match the defined schema exactly — no missing required fields, no type mismatches. This eliminates an entire class of production failures where Claude generates syntactically valid but schema-invalid tool calls.
Refs: [Tool use — structured outputs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-040

Source: [question record](../data/questions/cca-f/questions.json#L7310) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You want to validate all tool inputs against a strict schema and ensure Claude never passes missing or incorrectly typed parameters. What configuration achieves this?
~~~

**Choices**

~~~text
A. * Add a `validate: true` flag to the tool definition
B. * Use `strict: true` in tool definitions to enable Structured Outputs for guaranteed schema validation
C. * Write a PostToolUse hook that validates inputs after the call
D. * Add explicit validation instructions to the tool description
~~~

**Correct:** `B`

**Explanation**

~~~text
`strict: true` in tool definitions enables Structured Outputs mode, which guarantees that Claude's tool calls always match the defined schema exactly — no missing required fields, no type mismatches. This eliminates an entire class of production failures where Claude generates syntactically valid but schema-invalid tool calls.
~~~

### Pair 16

#### Original (first in bank): cca-f-prep-045

Source: [question record](../data/questions/cca-f/questions.json#L1450) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
What is CLAUDE.md and when does Claude Code read it?
~~~

**Choices**

~~~text
A. A runtime configuration file passed via the `--config` flag each session
B. A system prompt template stored in the Anthropic cloud service backend
C. A markdown file in the project that Claude Code reads automatically at session start
D. A configuration file that explicitly defines which tools Claude Code is allowed to use per session
~~~

**Correct:** `C`

**Explanation**

~~~text
CLAUDE.md is a markdown file you place in your project (typically at the root) that Claude Code reads automatically at session start. It provides persistent project context — coding standards, architectural decisions, naming conventions, review checklists — without requiring you to re-explain them every session.
Refs: [Claude Code overview — CLAUDE.md](https://code.claude.com/docs/en/overview) · [Claude Code — store instructions and memory](https://code.claude.com/docs/en/memory)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-045

Source: [question record](../data/questions/cca-f/questions.json#L7342) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
What is CLAUDE.md and when does Claude Code read it?
~~~

**Choices**

~~~text
A. * A runtime configuration file passed via the `--config` flag each session
B. * A system prompt template stored in the Anthropic cloud service backend
C. * A markdown file in the project that Claude Code reads automatically at session start
D. * A configuration file that explicitly defines which tools Claude Code is allowed to use per session
~~~

**Correct:** `C`

**Explanation**

~~~text
CLAUDE.md is a markdown file you place in your project (typically at the root) that Claude Code reads automatically at session start. It provides persistent project context — coding standards, architectural decisions, naming conventions, review checklists — without requiring you to re-explain them every session.
~~~

### Pair 17

#### Original (first in bank): cca-f-prep-046

Source: [question record](../data/questions/cca-f/questions.json#L1482) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
In the CLAUDE.md hierarchy, which file takes precedence when there are conflicting instructions?
~~~

**Choices**

~~~text
A. The global user-level CLAUDE.md at ~/.claude/CLAUDE.md takes precedence
B. The project root CLAUDE.md always overrides all other CLAUDE.md files
C. The most recently modified CLAUDE.md, regardless of its directory location
D. The subdirectory CLAUDE.md closest to the file currently being edited
~~~

**Correct:** `D`

**Explanation**

~~~text
CLAUDE.md files follow a specificity hierarchy: subdirectory (closest to the current file) > project root > global user. More specific context overrides more general context. This allows subdirectories to set their own conventions (e.g., a `frontend/` directory with React-specific rules) that override project-wide defaults.
Refs: [Claude Code — store instructions and memory](https://code.claude.com/docs/en/memory)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-046

Source: [question record](../data/questions/cca-f/questions.json#L7374) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
In the CLAUDE.md hierarchy, which file takes precedence when there are conflicting instructions?
~~~

**Choices**

~~~text
A. * The global user-level CLAUDE.md at ~/.claude/CLAUDE.md takes precedence
B. * The project root CLAUDE.md always overrides all other CLAUDE.md files
C. * The most recently modified CLAUDE.md, regardless of its directory location
D. * The subdirectory CLAUDE.md closest to the file currently being edited
~~~

**Correct:** `D`

**Explanation**

~~~text
CLAUDE.md files follow a specificity hierarchy: subdirectory (closest to the current file) > project root > global user. More specific context overrides more general context. This allows subdirectories to set their own conventions (e.g., a `frontend/` directory with React-specific rules) that override project-wide defaults.
~~~

### Pair 18

#### Original (first in bank): cca-f-prep-047

Source: [question record](../data/questions/cca-f/questions.json#L1514) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
When should you use plan mode in Claude Code?
~~~

**Choices**

~~~text
A. Before irreversible or high-impact operations, to review plans before execution
B. For every task without exception, to review Claude's full reasoning process before it acts
C. Only when working with files that are larger than 1MB in total size
D. When you want Claude to run autonomously without any human interaction
~~~

**Correct:** `A`

**Explanation**

~~~text
Plan mode is a human review checkpoint before execution. Use it before: large refactors, database migrations, CI/CD deployments, anything that modifies many files, or any operation that is difficult to reverse. Claude shows its plan; you can approve, modify, or cancel before a single line of code changes.
Refs: [Claude Code overview](https://code.claude.com/docs/en/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-047

Source: [question record](../data/questions/cca-f/questions.json#L7406) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
When should you use plan mode in Claude Code?
~~~

**Choices**

~~~text
A. * Before irreversible or high-impact operations, to review plans before execution
B. * For every task without exception, to review Claude's full reasoning process before it acts
C. * Only when working with files that are larger than 1MB in total size
D. * When you want Claude to run autonomously without any human interaction
~~~

**Correct:** `A`

**Explanation**

~~~text
Plan mode is a human review checkpoint before execution. Use it before: large refactors, database migrations, CI/CD deployments, anything that modifies many files, or any operation that is difficult to reverse. Claude shows its plan; you can approve, modify, or cancel before a single line of code changes.
~~~

### Pair 19

#### Original (first in bank): cca-f-prep-051

Source: [question record](../data/questions/cca-f/questions.json#L1642) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You want Claude Code to automatically run your linter after every file edit. Which mechanism achieves this?
~~~

**Choices**

~~~text
A. Configure a hook that runs the linter command after each Write tool invocation
B. Add a `post_edit_command` key to the project CLAUDE.md configuration file under the hooks section
C. Use `permissionMode: "acceptEdits"` which triggers post-edit callback hooks
D. Set up a separate file watcher in your CI/CD pipeline to catch file changes
~~~

**Correct:** `A`

**Explanation**

~~~text
Hooks let you run shell commands at specific points in the Claude Code agent loop. A PostToolUse hook configured on the Write tool will automatically run your linter (or formatter, or type checker) after each file edit. This provides immediate feedback without any additional prompting and ensures code quality gates are applied deterministically.
Refs: [Agent SDK — hooks](https://github.com/anthropics/claude-agent-sdk-python)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-051

Source: [question record](../data/questions/cca-f/questions.json#L7438) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You want Claude Code to automatically run your linter after every file edit. Which mechanism achieves this?
~~~

**Choices**

~~~text
A. * Configure a hook that runs the linter command after each Write tool invocation
B. * Add a `post_edit_command` key to the project CLAUDE.md configuration file under the hooks section
C. * Use `permissionMode: "acceptEdits"` which triggers post-edit callback hooks
D. * Set up a separate file watcher in your CI/CD pipeline to catch file changes
~~~

**Correct:** `A`

**Explanation**

~~~text
Hooks let you run shell commands at specific points in the Claude Code agent loop. A PostToolUse hook configured on the Write tool will automatically run your linter (or formatter, or type checker) after each file edit. This provides immediate feedback without any additional prompting and ensures code quality gates are applied deterministically.
~~~

### Pair 20

#### Original (first in bank): cca-f-prep-052

Source: [question record](../data/questions/cca-f/questions.json#L1674) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
What is the key benefit of integrating Claude Code into a CI/CD pipeline for automated PR reviews?
~~~

**Choices**

~~~text
A. It eliminates the need for human code review entirely across the engineering team
B. Consistent automated checks on every PR without fatigue, catching bugs early
C. It provides real-time streaming feedback to developers as they type code
D. It replaces unit tests with AI-generated assertions for faster test cycles
~~~

**Correct:** `B`

**Explanation**

~~~text
CI/CD integration provides consistent, scalable code review that does not suffer from reviewer fatigue. Claude Code can run on every PR with the same thoroughness: linting, security scan, test coverage check, architecture review, documentation check. This surfaces issues earlier (cheaper to fix) and makes human reviews more focused on logic and design rather than mechanics.
Refs: [Claude Code overview](https://code.claude.com/docs/en/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-052

Source: [question record](../data/questions/cca-f/questions.json#L7470) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
What is the key benefit of integrating Claude Code into a CI/CD pipeline for automated PR reviews?
~~~

**Choices**

~~~text
A. * It eliminates the need for human code review entirely across the engineering team
B. * Consistent automated checks on every PR without fatigue, catching bugs early
C. * It provides real-time streaming feedback to developers as they type code
D. * It replaces unit tests with AI-generated assertions for faster test cycles
~~~

**Correct:** `B`

**Explanation**

~~~text
CI/CD integration provides consistent, scalable code review that does not suffer from reviewer fatigue. Claude Code can run on every PR with the same thoroughness: linting, security scan, test coverage check, architecture review, documentation check. This surfaces issues earlier (cheaper to fix) and makes human reviews more focused on logic and design rather than mechanics.
~~~

### Pair 21

#### Original (first in bank): cca-f-prep-053

Source: [question record](../data/questions/cca-f/questions.json#L1706) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A new engineer joins the team. What is the most effective way to use CLAUDE.md to accelerate their onboarding?
~~~

**Choices**

~~~text
A. Have the new engineer write their own CLAUDE.md from scratch as a team onboarding learning task
B. Provide a curated list of documentation links for them to read independently
C. Add a section with key architectural decisions, conventions, and common pitfalls
D. CLAUDE.md is only for configuring Claude Code, not for developer onboarding
~~~

**Correct:** `C`

**Explanation**

~~~text
CLAUDE.md functions as a "tech lead in a file." It can include architectural decision rationale, naming conventions, test patterns, required build commands, common pitfalls, and links to deeper documentation. When a new engineer runs Claude Code, Claude immediately applies all these rules without the engineer needing to ask — effectively encoding institutional knowledge into the development tool.
Refs: [Claude Code — store instructions and memory](https://code.claude.com/docs/en/memory)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-053

Source: [question record](../data/questions/cca-f/questions.json#L7502) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A new engineer joins the team. What is the most effective way to use CLAUDE.md to accelerate their onboarding?
~~~

**Choices**

~~~text
A. * Have the new engineer write their own CLAUDE.md from scratch as a team onboarding learning task
B. * Provide a curated list of documentation links for them to read independently
C. * Add a section with key architectural decisions, conventions, and common pitfalls
D. * CLAUDE.md is only for configuring Claude Code, not for developer onboarding
~~~

**Correct:** `C`

**Explanation**

~~~text
CLAUDE.md functions as a "tech lead in a file." It can include architectural decision rationale, naming conventions, test patterns, required build commands, common pitfalls, and links to deeper documentation. When a new engineer runs Claude Code, Claude immediately applies all these rules without the engineer needing to ask — effectively encoding institutional knowledge into the development tool.
~~~

### Pair 22

#### Original (first in bank): cca-f-prep-062

Source: [question record](../data/questions/cca-f/questions.json#L1997) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
What is a few-shot prompt?
~~~

**Choices**

~~~text
A. A prompt sent multiple times until Claude eventually produces the right answer through repetition
B. A prompt with input-output examples that demonstrate the desired behavior pattern
C. A prompt that limits Claude to short responses of only a few sentences each
D. A batch of multiple prompts that are processed simultaneously in one API call
~~~

**Correct:** `B`

**Explanation**

~~~text
Few-shot prompting provides examples of the desired input-output pattern within the prompt. These examples act as demonstrations — they show Claude the format, style, and reasoning pattern expected. Few-shot examples are effective for establishing output format and tone but are not compliance mechanisms (they cannot guarantee behavior).
Refs: [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-062

Source: [question record](../data/questions/cca-f/questions.json#L7534) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
What is a few-shot prompt?
~~~

**Choices**

~~~text
A. * A prompt sent multiple times until Claude eventually produces the right answer through repetition
B. * A prompt with input-output examples that demonstrate the desired behavior pattern
C. * A prompt that limits Claude to short responses of only a few sentences each
D. * A batch of multiple prompts that are processed simultaneously in one API call
~~~

**Correct:** `B`

**Explanation**

~~~text
Few-shot prompting provides examples of the desired input-output pattern within the prompt. These examples act as demonstrations — they show Claude the format, style, and reasoning pattern expected. Few-shot examples are effective for establishing output format and tone but are not compliance mechanisms (they cannot guarantee behavior).
~~~

### Pair 23

#### Original (first in bank): cca-f-prep-069

Source: [question record](../data/questions/cca-f/questions.json#L2221) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Few-shot examples are effective for which purpose, and NOT effective for which purpose?
~~~

**Choices**

~~~text
A. Effective for format and style demonstration; not for guaranteeing compliance
B. Effective for compliance enforcement; not effective for output format control
C. Effective for preventing hallucinations; not effective for formatting output
D. Effective for all purposes universally; no known limitations for few-shot use
~~~

**Correct:** `A`

**Explanation**

~~~text
Few-shot examples are excellent for demonstrating desired output format, style, and reasoning patterns — Claude reliably mimics demonstrated patterns. They are NOT compliance mechanisms: showing Claude examples of correct tool ordering does not guarantee it will always follow that order (a probabilistic influence, not deterministic enforcement). For compliance, use programmatic mechanisms.
Refs: [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-069

Source: [question record](../data/questions/cca-f/questions.json#L7566) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Few-shot examples are effective for which purpose, and NOT effective for which purpose?
~~~

**Choices**

~~~text
A. * Effective for format and style demonstration; not for guaranteeing compliance
B. * Effective for compliance enforcement; not effective for output format control
C. * Effective for preventing hallucinations; not effective for formatting output
D. * Effective for all purposes universally; no known limitations for few-shot use
~~~

**Correct:** `A`

**Explanation**

~~~text
Few-shot examples are excellent for demonstrating desired output format, style, and reasoning patterns — Claude reliably mimics demonstrated patterns. They are NOT compliance mechanisms: showing Claude examples of correct tool ordering does not guarantee it will always follow that order (a probabilistic influence, not deterministic enforcement). For compliance, use programmatic mechanisms.
~~~

### Pair 24

#### Original (first in bank): cca-f-prep-076

Source: [question record](../data/questions/cca-f/questions.json#L2446) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your CI pipeline generates code review comments using Claude. Developers complain that 40% of security-related comments are false positives about their use of `eval()` in a controlled, sandboxed context. You have documented that `eval()` in the `/sandbox` directory is reviewed and approved. What is the most targeted fix?
~~~

**Choices**

~~~text
A. Remove all security checks from the automated review
B. Add a post-processing filter that removes any comment mentioning `eval()`
C. Add to CLAUDE.md: "In the /sandbox directory, eval() usage has been security-reviewed and approved. Do not flag eval() in /sandbox as a security issue."
D. Increase the review model's temperature to reduce repeated patterns
~~~

**Correct:** `C`

**Explanation**

~~~text
This is a targeted CLAUDE.md context injection. The false positives are caused by Claude lacking project-specific knowledge that `/sandbox/eval()` is approved. Adding this specific exception to CLAUDE.md tells Claude exactly which pattern to exempt and why — without removing eval() coverage elsewhere. Removing all security checks or adding blanket filters are over-corrections that reduce security coverage across the codebase.
Refs: [Claude Code — store instructions and memory](https://code.claude.com/docs/en/memory)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-076

Source: [question record](../data/questions/cca-f/questions.json#L7598) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Claude Code for CI/CD* Your CI pipeline generates code review comments using Claude. Developers complain that 40% of security-related comments are false positives about their use of `eval()` in a controlled, sandboxed context. You have documented that `eval()` in the `/sandbox` directory is reviewed and approved. What is the most targeted fix?
~~~

**Choices**

~~~text
A. * Remove all security checks from the automated review
B. * Add a post-processing filter that removes any comment mentioning `eval()`
C. * Add to CLAUDE.md: "In the /sandbox directory, eval() usage has been security-reviewed and approved. Do not flag eval() in /sandbox as a security issue."
D. * Increase the review model's temperature to reduce repeated patterns
~~~

**Correct:** `C`

**Explanation**

~~~text
This is a targeted CLAUDE.md context injection. The false positives are caused by Claude lacking project-specific knowledge that `/sandbox/eval()` is approved. Adding this specific exception to CLAUDE.md tells Claude exactly which pattern to exempt and why — without removing eval() coverage elsewhere. Removing all security checks or adding blanket filters are over-corrections that reduce security coverage across the codebase.
~~~

### Pair 25

#### Original (first in bank): cca-f-prep-078

Source: [question record](../data/questions/cca-f/questions.json#L2512) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A product classification pipeline achieves 94% accuracy on well-formatted product listings but drops to 71% on short, abbreviated listings (e.g., "16GB DDR5 3200MHz" instead of "Kingston 16GB DDR5 RAM Module 3200MHz CL16"). How should you address this?
~~~

**Choices**

~~~text
A. Filter out short listings and process them manually
B. Use a higher temperature for short listings to generate more diverse outputs
C. Add few-shot examples specifically demonstrating classification of abbreviated, incomplete listings, including the reasoning process for resolving ambiguous abbreviations
D. Use a larger model for all listings to improve overall accuracy
~~~

**Correct:** `C`

**Explanation**

~~~text
Few-shot examples are ideally suited for demonstrating how to handle the specific failure mode: abbreviated input. By showing Claude several examples of abbreviated listings and the reasoning used to classify them ("DDR5 3200MHz → RAM category, 3200MHz is the speed → subcategory: Memory"), you teach the pattern without modifying the schema. This is targeted prompt engineering for a specific input distribution.
Refs: [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-078

Source: [question record](../data/questions/cca-f/questions.json#L7630) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Structured Data Extraction* A product classification pipeline achieves 94% accuracy on well-formatted product listings but drops to 71% on short, abbreviated listings (e.g., "16GB DDR5 3200MHz" instead of "Kingston 16GB DDR5 RAM Module 3200MHz CL16"). How should you address this?
~~~

**Choices**

~~~text
A. * Filter out short listings and process them manually
B. * Use a higher temperature for short listings to generate more diverse outputs
C. * Add few-shot examples specifically demonstrating classification of abbreviated, incomplete listings, including the reasoning process for resolving ambiguous abbreviations
D. * Use a larger model for all listings to improve overall accuracy
~~~

**Correct:** `C`

**Explanation**

~~~text
Few-shot examples are ideally suited for demonstrating how to handle the specific failure mode: abbreviated input. By showing Claude several examples of abbreviated listings and the reasoning used to classify them ("DDR5 3200MHz → RAM category, 3200MHz is the speed → subcategory: Memory"), you teach the pattern without modifying the schema. This is targeted prompt engineering for a specific input distribution.
~~~

### Pair 26

#### Original (first in bank): cca-f-prep-081

Source: [question record](../data/questions/cca-f/questions.json#L2609) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
When should you use prompt caching for cost optimization?
~~~

**Choices**

~~~text
A. When the same prefix (system prompt, examples, document) is reused across calls
B. For any API call to reduce costs regardless of the prompt content or structure being repeated
C. When the user asks the same question multiple times in a single conversation
D. When the response is expected to be very long and consume many output tokens
~~~

**Correct:** `A`

**Explanation**

~~~text
Prompt caching stores the KV cache of a prompt prefix. Subsequent calls that share the same prefix pay the cache read price instead of re-processing those tokens. Maximum benefit comes from large, stable prefixes — a long system prompt, a big document, or a large set of few-shot examples that are reused across many requests.
Refs: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-081

Source: [question record](../data/questions/cca-f/questions.json#L7662) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
When should you use prompt caching for cost optimization?
~~~

**Choices**

~~~text
A. * When the same prefix (system prompt, examples, document) is reused across calls
B. * For any API call to reduce costs regardless of the prompt content or structure being repeated
C. * When the user asks the same question multiple times in a single conversation
D. * When the response is expected to be very long and consume many output tokens
~~~

**Correct:** `A`

**Explanation**

~~~text
Prompt caching stores the KV cache of a prompt prefix. Subsequent calls that share the same prefix pay the cache read price instead of re-processing those tokens. Maximum benefit comes from large, stable prefixes — a long system prompt, a big document, or a large set of few-shot examples that are reused across many requests.
~~~

### Pair 27

#### Original (first in bank): cca-f-prep-101

Source: [question record](../data/questions/cca-f/questions.json#L3257) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?
~~~

**Choices**

~~~text
A. Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID
B. Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations
C. Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details
D. Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type
~~~

**Correct:** `A`

**Explanation**

~~~text
When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.
Refs: [Hooks — tool prerequisites](https://platform.claude.com/docs/en/agent-sdk/hooks)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-101

Source: [question record](../data/questions/cca-f/questions.json#L7694) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.* Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?
~~~

**Choices**

~~~text
A. * Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID
B. * Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations
C. * Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details
D. * Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type
~~~

**Correct:** `A`

**Explanation**

~~~text
When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.
~~~

### Pair 28

#### Original (first in bank): cca-f-prep-104

Source: [question record](../data/questions/cca-f/questions.json#L3356) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?
~~~

**Choices**

~~~text
A. In the .claude/commands/ directory in the project repository
B. In ~/.claude/commands/ in each developer's home directory
C. In the CLAUDE.md file at the project root
D. In a .claude/config.json file with a commands array
~~~

**Correct:** `A`

**Explanation**

~~~text
Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren't shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn't exist in Claude Code.
Refs: [Claude Code slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-104

Source: [question record](../data/questions/cca-f/questions.json#L7726) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.* You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?
~~~

**Choices**

~~~text
A. * In the .claude/commands/ directory in the project repository
B. * In ~/.claude/commands/ in each developer's home directory
C. * In the CLAUDE.md file at the project root
D. * In a .claude/config.json file with a commands array
~~~

**Correct:** `A`

**Explanation**

~~~text
Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren't shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn't exist in Claude Code.
~~~

### Pair 29

#### Original (first in bank): cca-f-prep-105

Source: [question record](../data/questions/cca-f/questions.json#L3389) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?
~~~

**Choices**

~~~text
A. Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes
B. Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries
C. Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured
D. Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation
~~~

**Correct:** `A`

**Explanation**

~~~text
Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code. Option D ignores that the complexity is already stated in the requirements, not something that might emerge later.
Refs: [Claude Code plan mode](https://docs.anthropic.com/en/docs/claude-code/plan-mode)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-105

Source: [question record](../data/questions/cca-f/questions.json#L7758) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.* You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?
~~~

**Choices**

~~~text
A. * Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes
B. * Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries
C. * Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured
D. * Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation
~~~

**Correct:** `A`

**Explanation**

~~~text
Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code. Option D ignores that the complexity is already stated in the requirements, not something that might emerge later.
~~~

### Pair 30

#### Original (first in bank): cca-f-prep-106

Source: [question record](../data/questions/cca-f/questions.json#L3422) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?
~~~

**Choices**

~~~text
A. Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths
B. Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies
C. Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files
D. Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions
~~~

**Correct:** `A`

**Explanation**

~~~text
.claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location — essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching, making it unreliable. Option C requires manual skill invocation or relies on Claude choosing to load them, contradicting the need for deterministic "automatic" application based on file paths. Option D can't easily handle files spread across many directories since CLAUDE.md files are directory-bound.
Refs: [CLAUDE.md configuration](https://docs.anthropic.com/en/docs/claude-code/memory)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-106

Source: [question record](../data/questions/cca-f/questions.json#L7790) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.* Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?
~~~

**Choices**

~~~text
A. * Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths
B. * Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies
C. * Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files
D. * Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions
~~~

**Correct:** `A`

**Explanation**

~~~text
.claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location — essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching, making it unreliable. Option C requires manual skill invocation or relies on Claude choosing to load them, contradicting the need for deterministic "automatic" application based on file paths. Option D can't easily handle files spread across many directories since CLAUDE.md files are directory-bound.
~~~

### Pair 31

#### Original (first in bank): cca-f-prep-107

Source: [question record](../data/questions/cca-f/questions.json#L3455) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
After running the system on the topic "impact of AI on creative industries," you observe that each subagent completes successfully — the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. When you examine the coordinator's logs, you see it decomposed the topic into three subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?
~~~

**Choices**

~~~text
A. The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents
B. The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic
C. The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors
D. The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria
~~~

**Correct:** `B`

**Explanation**

~~~text
The coordinator's logs reveal the root cause directly: it decomposed "creative industries" into only visual arts subtasks (digital art, graphic design, photography), completely omitting music, writing, and film. The subagents executed their assigned tasks correctly — the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.
Refs: [Multi-agent orchestration](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-107

Source: [question record](../data/questions/cca-f/questions.json#L7822) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.* After running the system on the topic "impact of AI on creative industries," you observe that each subagent completes successfully — the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. When you examine the coordinator's logs, you see it decomposed the topic into three subtasks: "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?
~~~

**Choices**

~~~text
A. * The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents
B. * The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic
C. * The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors
D. * The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria
~~~

**Correct:** `B`

**Explanation**

~~~text
The coordinator's logs reveal the root cause directly: it decomposed "creative industries" into only visual arts subtasks (digital art, graphic design, photography), completely omitting music, writing, and film. The subagents executed their assigned tasks correctly — the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.
~~~

### Pair 32

#### Original (first in bank): cca-f-prep-108

Source: [question record](../data/questions/cca-f/questions.json#L3488) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?
~~~

**Choices**

~~~text
A. Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches
B. Implement automatic retry logic with exponential backoff within the subagent, returning a generic "search unavailable" status only after all retries are exhausted
C. Catch the timeout within the subagent and return an empty result set marked as successful
D. Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow
~~~

**Correct:** `A`

**Explanation**

~~~text
Structured error context gives the coordinator the information it needs to make intelligent recovery decisions — whether to retry with a modified query, try an alternative approach, or proceed with partial results. Option B's generic status hides valuable context from the coordinator, preventing informed decisions. Option C suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.
Refs: [Error handling in agents](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-108

Source: [question record](../data/questions/cca-f/questions.json#L7854) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.* The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?
~~~

**Choices**

~~~text
A. * Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches
B. * Implement automatic retry logic with exponential backoff within the subagent, returning a generic "search unavailable" status only after all retries are exhausted
C. * Catch the timeout within the subagent and return an empty result set marked as successful
D. * Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow
~~~

**Correct:** `A`

**Explanation**

~~~text
Structured error context gives the coordinator the information it needs to make intelligent recovery decisions — whether to retry with a modified query, try an alternative approach, or proceed with partial results. Option B's generic status hides valuable context from the coordinator, preventing informed decisions. Option C suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.
~~~

### Pair 33

#### Original (first in bank): cca-f-prep-109

Source: [question record](../data/questions/cca-f/questions.json#L3521) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
During testing, you observe that the synthesis agent frequently needs to verify specific claims while combining findings. Currently, when verification is needed, the synthesis agent returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2–3 round trips per task and increases latency by 40%. Your evaluation shows that 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?
~~~

**Choices**

~~~text
A. Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator
B. Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once
C. Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator
D. Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify
~~~

**Correct:** `A`

**Explanation**

~~~text
Option A applies the principle of least privilege by giving the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases. Option B's batching approach creates blocking dependencies since synthesis steps may depend on earlier verified facts. Option C over-provisions the synthesis agent, violating separation of concerns. Option D relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify.
Refs: [Tool distribution across agents](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-109

Source: [question record](../data/questions/cca-f/questions.json#L7886) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.* During testing, you observe that the synthesis agent frequently needs to verify specific claims while combining findings. Currently, when verification is needed, the synthesis agent returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2–3 round trips per task and increases latency by 40%. Your evaluation shows that 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?
~~~

**Choices**

~~~text
A. * Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator
B. * Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once
C. * Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator
D. * Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify
~~~

**Correct:** `A`

**Explanation**

~~~text
Option A applies the principle of least privilege by giving the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases. Option B's batching approach creates blocking dependencies since synthesis steps may depend on earlier verified facts. Option C over-provisions the synthesis agent, violating separation of concerns. Option D relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify.
~~~

### Pair 34

#### Original (first in bank): cca-f-prep-113

Source: [question record](../data/questions/cca-f/questions.json#L3653) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A coordinator agent is configured with allowedTools: ["Read", "Grep", "Glob"]. When it attempts to spawn a subagent by emitting a Task tool call, nothing happens — the call is silently ignored. What is the most likely cause?
~~~

**Choices**

~~~text
A. The subagent's AgentDefinition is missing a required system prompt field
B. "Task" is not included in the coordinator's allowedTools list configuration
C. Subagents can only be spawned from the root agent, not from nested coordinator agents
D. The Task tool call must include an allowedTools array for the subagent
~~~

**Correct:** `B`

**Explanation**

~~~text
The Task tool is the mechanism for spawning subagents. Like any other tool, it must be included in the coordinator's allowedTools configuration before it can be called. If "Task" is absent, the coordinator simply cannot emit Task calls. This is a common misconfiguration when assembling multi-agent systems: developers configure the subagents' AgentDefinitions carefully but forget to add "Task" to the coordinator's own allowed tools.
Refs: [Subagent spawning with Task tool](https://platform.claude.com/docs/en/agent-sdk/tasks)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-113

Source: [question record](../data/questions/cca-f/questions.json#L7918) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A coordinator agent is configured with allowedTools: ["Read", "Grep", "Glob"]. When it attempts to spawn a subagent by emitting a Task tool call, nothing happens — the call is silently ignored. What is the most likely cause?
~~~

**Choices**

~~~text
A. * The subagent's AgentDefinition is missing a required system prompt field
B. * "Task" is not included in the coordinator's allowedTools list configuration
C. * Subagents can only be spawned from the root agent, not from nested coordinator agents
D. * The Task tool call must include an allowedTools array for the subagent
~~~

**Correct:** `B`

**Explanation**

~~~text
The Task tool is the mechanism for spawning subagents. Like any other tool, it must be included in the coordinator's allowedTools configuration before it can be called. If "Task" is absent, the coordinator simply cannot emit Task calls. This is a common misconfiguration when assembling multi-agent systems: developers configure the subagents' AgentDefinitions carefully but forget to add "Task" to the coordinator's own allowed tools.
~~~

### Pair 35

#### Original (first in bank): cca-f-prep-119

Source: [question record](../data/questions/cca-f/questions.json#L3845) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your team wants to share a GitHub MCP server configuration so all developers have access to it when they clone the repository. Where should you configure this MCP server?
~~~

**Choices**

~~~text
A. In the project's .mcp.json file, committed to version control for the team
B. In ~/.claude.json on each developer's machine for personal MCP server configuration
C. In the root CLAUDE.md file as a structured MCP configuration code block
D. In a .env file at the project root with MCP_SERVER_URL variables defined
~~~

**Correct:** `A`

**Explanation**

~~~text
Project-level MCP server configuration belongs in .mcp.json at the project root. This file is committed to version control and automatically available to all team members when they clone or pull the repository. ~/.claude.json is for personal or experimental MCP servers that should not be shared with the team. CLAUDE.md is for instructions and context, not server configuration. A .env file doesn't configure MCP servers.
Refs: [MCP server configuration](https://docs.anthropic.com/en/docs/claude-code/mcp)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-119

Source: [question record](../data/questions/cca-f/questions.json#L7950) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Your team wants to share a GitHub MCP server configuration so all developers have access to it when they clone the repository. Where should you configure this MCP server?
~~~

**Choices**

~~~text
A. * In the project's .mcp.json file, committed to version control for the team
B. * In ~/.claude.json on each developer's machine for personal MCP server configuration
C. * In the root CLAUDE.md file as a structured MCP configuration code block
D. * In a .env file at the project root with MCP_SERVER_URL variables defined
~~~

**Correct:** `A`

**Explanation**

~~~text
Project-level MCP server configuration belongs in .mcp.json at the project root. This file is committed to version control and automatically available to all team members when they clone or pull the repository. ~/.claude.json is for personal or experimental MCP servers that should not be shared with the team. CLAUDE.md is for instructions and context, not server configuration. A .env file doesn't configure MCP servers.
~~~

### Pair 36

#### Original (first in bank): cca-f-prep-120

Source: [question record](../data/questions/cca-f/questions.json#L3877) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You are configuring a GitHub MCP server in your project's .mcp.json. The server requires a personal access token. A teammate suggests hardcoding the token directly in the JSON file since it's an internal repo. What is the correct approach?
~~~

**Choices**

~~~text
A. Hardcode the token — internal repos don't need the same security standards
B. Use ${GITHUB_TOKEN} env var expansion in .mcp.json; each dev sets it locally
C. Store the token in CLAUDE.md under a dedicated secrets configuration section
D. Create a .mcp.local.json file with the token and add it to the .gitignore
~~~

**Correct:** `B`

**Explanation**

~~~text
.mcp.json supports environment variable expansion using ${VAR_NAME} syntax. This allows the shared configuration file to be committed safely without containing credentials — each developer sets the actual token value in their shell environment (e.g., ~/.zshrc or a local .env). Hardcoding tokens (A) is a security anti-pattern even in internal repos — tokens get leaked through git history, screenshots, and team changes. CLAUDE.md is not a secrets store. A .mcp.local.json approach isn't a supported pattern.
Refs: [MCP server configuration](https://docs.anthropic.com/en/docs/claude-code/mcp)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-120

Source: [question record](../data/questions/cca-f/questions.json#L7982) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You are configuring a GitHub MCP server in your project's .mcp.json. The server requires a personal access token. A teammate suggests hardcoding the token directly in the JSON file since it's an internal repo. What is the correct approach?
~~~

**Choices**

~~~text
A. * Hardcode the token — internal repos don't need the same security standards
B. * Use ${GITHUB_TOKEN} env var expansion in .mcp.json; each dev sets it locally
C. * Store the token in CLAUDE.md under a dedicated secrets configuration section
D. * Create a .mcp.local.json file with the token and add it to the .gitignore
~~~

**Correct:** `B`

**Explanation**

~~~text
.mcp.json supports environment variable expansion using ${VAR_NAME} syntax. This allows the shared configuration file to be committed safely without containing credentials — each developer sets the actual token value in their shell environment (e.g., ~/.zshrc or a local .env). Hardcoding tokens (A) is a security anti-pattern even in internal repos — tokens get leaked through git history, screenshots, and team changes. CLAUDE.md is not a secrets store. A .mcp.local.json approach isn't a supported pattern.
~~~

### Pair 37

#### Original (first in bank): cca-f-prep-129

Source: [question record](../data/questions/cca-f/questions.json#L4165) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
You are building a document enrichment pipeline. Documents must first go through metadata extraction (extract_metadata tool) before any enrichment steps run. If metadata extraction is skipped, enrichment tools may fail or produce incorrect results. How do you enforce this ordering using the Claude API?
~~~

**Choices**

~~~text
A. Add a system prompt instruction: "Always call extract_metadata before any enrichment tools run"
B. Use tool_choice: "any" so Claude is guaranteed to call a tool on the first turn
C. Set tool_choice to force extract_metadata on the first call; use auto for the rest
D. List extract_metadata first in the tools array so Claude encounters it first
~~~

**Correct:** `C`

**Explanation**

~~~text
Forced tool selection (tool_choice: {"type": "tool", "name": "extract_metadata"}) guarantees that the specific named tool is called, not just any tool. By using this on the first API call, you ensure metadata extraction runs before the model has the option to call enrichment tools. Subsequent turns can then use tool_choice: "auto" or "any" for the enrichment steps. System prompt instructions (A) are probabilistic. tool_choice: "any" (C) guarantees a tool call but doesn't specify which one. Tool array ordering (D) has no effect on tool selection.
Refs: [Tool use — tool_choice](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-129

Source: [question record](../data/questions/cca-f/questions.json#L8014) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
You are building a document enrichment pipeline. Documents must first go through metadata extraction (extract_metadata tool) before any enrichment steps run. If metadata extraction is skipped, enrichment tools may fail or produce incorrect results. How do you enforce this ordering using the Claude API?
~~~

**Choices**

~~~text
A. * Add a system prompt instruction: "Always call extract_metadata before any enrichment tools run"
B. * Use tool_choice: "any" so Claude is guaranteed to call a tool on the first turn
C. * Set tool_choice to force extract_metadata on the first call; use auto for the rest
D. * List extract_metadata first in the tools array so Claude encounters it first
~~~

**Correct:** `C`

**Explanation**

~~~text
Forced tool selection (tool_choice: {"type": "tool", "name": "extract_metadata"}) guarantees that the specific named tool is called, not just any tool. By using this on the first API call, you ensure metadata extraction runs before the model has the option to call enrichment tools. Subsequent turns can then use tool_choice: "auto" or "any" for the enrichment steps. System prompt instructions (A) are probabilistic. tool_choice: "any" (C) guarantees a tool call but doesn't specify which one. Tool array ordering (D) has no effect on tool selection.
~~~

### Pair 38

#### Original (first in bank): cca-f-prep-133

Source: [question record](../data/questions/cca-f/questions.json#L4293) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A team generates code with Claude and then uses the same Claude session to review that code for bugs. The review consistently misses subtle logical errors — issues that human reviewers catch immediately. What is the most likely explanation and best fix?
~~~

**Choices**

~~~text
A. The model is running out of context space; the fix is to use /compact before the code review step
B. The generating session retains reasoning context, making it less likely to question itself
C. The same model cannot both generate and review code — use a different model instead
D. Add a "be critical" system prompt instruction to Claude before starting the review
~~~

**Correct:** `B`

**Explanation**

~~~text
Self-review in the same session is a known limitation: the model retains reasoning context from generation and is less likely to question its own decisions. This is not a model capability issue — it's a context contamination issue. An independent review instance (fresh session without the generation context) is substantially more effective at catching subtle issues. This is equivalent to the human practice of having code reviewed by someone who didn't write it. /compact (A) reduces tokens but doesn't remove the reasoning context. Different model (C) may help but misidentifies the root cause. System prompt instructions (D) are probabilistic and don't address context contamination.
Refs: [Multi-instance review patterns](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-133

Source: [question record](../data/questions/cca-f/questions.json#L8046) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A team generates code with Claude and then uses the same Claude session to review that code for bugs. The review consistently misses subtle logical errors — issues that human reviewers catch immediately. What is the most likely explanation and best fix?
~~~

**Choices**

~~~text
A. * The model is running out of context space; the fix is to use /compact before the code review step
B. * The generating session retains reasoning context, making it less likely to question itself
C. * The same model cannot both generate and review code — use a different model instead
D. * Add a "be critical" system prompt instruction to Claude before starting the review
~~~

**Correct:** `B`

**Explanation**

~~~text
Self-review in the same session is a known limitation: the model retains reasoning context from generation and is less likely to question its own decisions. This is not a model capability issue — it's a context contamination issue. An independent review instance (fresh session without the generation context) is substantially more effective at catching subtle issues. This is equivalent to the human practice of having code reviewed by someone who didn't write it. /compact (A) reduces tokens but doesn't remove the reasoning context. Different model (C) may help but misidentifies the root cause. System prompt instructions (D) are probabilistic and don't address context contamination.
~~~

### Pair 39

#### Original (first in bank): cca-f-prep-141

Source: [question record](../data/questions/cca-f/questions.json#L4549) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A multi-phase coordinator agent crashes after completing phase 2 of a 4-phase research pipeline. The pipeline must resume without restarting from the beginning. Which architecture enables reliable crash recovery?
~~~

**Choices**

~~~text
A. Rely on `--resume` to reload the conversation history and infer progress from prior messages
B. Implement session checkpointing with `fork_session` at the end of each phase
C. Have each phase export a structured state manifest (completed work, partial results, next phase inputs) to a known location, and have the coordinator load that manifest on startup to determine where to resume
D. Configure the coordinator with a high `max_tokens` budget so phases are less likely to be interrupted
~~~

**Correct:** `C`

**Explanation**

~~~text
`--resume` reloads conversation history but cannot recover in-progress subagent state or structured phase outputs — it tells you what was discussed, not what was computed. `fork_session` creates a branch of the conversation but also does not persist phase outputs across crashes. The correct pattern is structured state exports: at the end of each phase, the coordinator writes a manifest (phase number, completed agent outputs, next-phase inputs) to a known file location. On startup, the coordinator reads the manifest to determine the last completed phase and continues from there. High `max_tokens` budgets (D) affect generation length, not crash recovery.
Refs: [Agent state persistence](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration) · [Claude Code --resume flag](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-141

Source: [question record](../data/questions/cca-f/questions.json#L8078) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A multi-phase coordinator agent crashes after completing phase 2 of a 4-phase research pipeline. The pipeline must resume without restarting from the beginning. Which architecture enables reliable crash recovery?
~~~

**Choices**

~~~text
A. * Rely on `--resume` to reload the conversation history and infer progress from prior messages
B. * Implement session checkpointing with `fork_session` at the end of each phase
C. * Have each phase export a structured state manifest (completed work, partial results, next phase inputs) to a known location, and have the coordinator load that manifest on startup to determine where to resume
D. * Configure the coordinator with a high `max_tokens` budget so phases are less likely to be interrupted
~~~

**Correct:** `C`

**Explanation**

~~~text
`--resume` reloads conversation history but cannot recover in-progress subagent state or structured phase outputs — it tells you what was discussed, not what was computed. `fork_session` creates a branch of the conversation but also does not persist phase outputs across crashes. The correct pattern is structured state exports: at the end of each phase, the coordinator writes a manifest (phase number, completed agent outputs, next-phase inputs) to a known file location. On startup, the coordinator reads the manifest to determine the last completed phase and continues from there. High `max_tokens` budgets (D) affect generation length, not crash recovery.
~~~

### Pair 40

#### Original (first in bank): cca-f-prep-143

Source: [question record](../data/questions/cca-f/questions.json#L4613) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
In the Model Context Protocol, what is the difference between an MCP Resource and an MCP Tool?
~~~

**Choices**

~~~text
A. Resources are faster than Tools because they skip the server round-trip and resolve content locally
B. Resources are defined in `.mcp.json` while Tools are defined in prompts
C. Resources expose content catalogs for browsing; Tools expose parameterized operations
D. Resources are read-only versions of Tools with otherwise identical functionality
~~~

**Correct:** `C`

**Explanation**

~~~text
MCP Resources and MCP Tools serve distinct purposes. A Resource is a content catalog entry — it tells the agent what data exists (e.g., a list of issue summaries, documentation pages, database schema) so the agent can choose what to request without making blind exploratory tool calls. A Tool is an operation: it takes parameters, executes logic, and returns results. By browsing Resources first, an agent avoids calling a tool with wrong parameters or fetching documents it does not need. Options A, C, and D conflate or misrepresent these distinct concepts.
Refs: [MCP — Resources](https://docs.anthropic.com/en/docs/build-with-claude/mcp) · [MCP concepts overview](https://modelcontextprotocol.io/docs/concepts/resources)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-143

Source: [question record](../data/questions/cca-f/questions.json#L8110) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
In the Model Context Protocol, what is the difference between an MCP Resource and an MCP Tool?
~~~

**Choices**

~~~text
A. * Resources are faster than Tools because they skip the server round-trip and resolve content locally
B. * Resources are defined in `.mcp.json` while Tools are defined in prompts
C. * Resources expose content catalogs for browsing; Tools expose parameterized operations
D. * Resources are read-only versions of Tools with otherwise identical functionality
~~~

**Correct:** `C`

**Explanation**

~~~text
MCP Resources and MCP Tools serve distinct purposes. A Resource is a content catalog entry — it tells the agent what data exists (e.g., a list of issue summaries, documentation pages, database schema) so the agent can choose what to request without making blind exploratory tool calls. A Tool is an operation: it takes parameters, executes logic, and returns results. By browsing Resources first, an agent avoids calling a tool with wrong parameters or fetching documents it does not need. Options A, C, and D conflate or misrepresent these distinct concepts.
~~~

### Pair 41

#### Original (first in bank): cca-f-prep-144

Source: [question record](../data/questions/cca-f/questions.json#L4645) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your team needs to integrate Claude Code with Jira to let agents create and update tickets. A developer proposes building a custom MCP server for Jira. What is the recommended approach?
~~~

**Choices**

~~~text
A. Build a custom MCP server to have full control over the Jira API surface and schema exposed
B. Connect directly to the Jira REST API via a generic `fetch_url` tool instead
C. Embed Jira credentials in the system prompt and use built-in web fetch tool
D. Use the existing community MCP server; reserve custom builds for unique needs
~~~

**Correct:** `D`

**Explanation**

~~~text
For standard integrations like Jira, GitHub, or Slack, the MCP ecosystem has community servers that are already built, tested, and maintained. Using an existing community server eliminates engineering overhead and gets the integration working immediately. Custom MCP servers should be reserved for workflows that are genuinely team-specific — internal databases, proprietary APIs, or unusual tool compositions that have no existing solution. A generic `fetch_url` tool (C) bypasses the structured, purpose-built capabilities of an MCP server. Embedding credentials in the system prompt (D) is a security anti-pattern.
Refs: [MCP server ecosystem](https://docs.anthropic.com/en/docs/build-with-claude/mcp) · [Claude Code MCP configuration](https://docs.anthropic.com/en/docs/claude-code/mcp)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-144

Source: [question record](../data/questions/cca-f/questions.json#L8142) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Your team needs to integrate Claude Code with Jira to let agents create and update tickets. A developer proposes building a custom MCP server for Jira. What is the recommended approach?
~~~

**Choices**

~~~text
A. * Build a custom MCP server to have full control over the Jira API surface and schema exposed
B. * Connect directly to the Jira REST API via a generic `fetch_url` tool instead
C. * Embed Jira credentials in the system prompt and use built-in web fetch tool
D. * Use the existing community MCP server; reserve custom builds for unique needs
~~~

**Correct:** `D`

**Explanation**

~~~text
For standard integrations like Jira, GitHub, or Slack, the MCP ecosystem has community servers that are already built, tested, and maintained. Using an existing community server eliminates engineering overhead and gets the integration working immediately. Custom MCP servers should be reserved for workflows that are genuinely team-specific — internal databases, proprietary APIs, or unusual tool compositions that have no existing solution. A generic `fetch_url` tool (C) bypasses the structured, purpose-built capabilities of an MCP server. Embedding credentials in the system prompt (D) is a security anti-pattern.
~~~

### Pair 42

#### Original (first in bank): cca-f-prep-146

Source: [question record](../data/questions/cca-f/questions.json#L4709) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
A team member reports that Claude Code is not applying the project's CLAUDE.md rules — it seems to ignore certain conventions that should be loaded. What is the first diagnostic step?
~~~

**Choices**

~~~text
A. Delete and re-create the CLAUDE.md file from scratch, as it may have been corrupted or malformed
B. Run `/memory` to verify which memory files are actually loaded in the session
C. Check the file permissions on CLAUDE.md to ensure Claude Code can read it
D. Add the rules to the system prompt in `docusaurus.config.ts` as a fallback
~~~

**Correct:** `B`

**Explanation**

~~~text
The `/memory` command displays all memory files currently loaded in the session, including which CLAUDE.md files are active and from which directories. This is the direct way to verify whether the expected CLAUDE.md is being found and loaded — before spending time debugging the file's contents. Common causes for missing CLAUDE.md: the file is in the wrong directory, the session was started from a different working directory, or there is a typo in the filename. Deleting and recreating (A) destroys content unnecessarily. File permissions (C) are rarely the issue on developer machines. Modifying project config files (D) is not how Claude Code memory works.
Refs: [Claude Code memory and CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory) · [Claude Code slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-146

Source: [question record](../data/questions/cca-f/questions.json#L8174) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
A team member reports that Claude Code is not applying the project's CLAUDE.md rules — it seems to ignore certain conventions that should be loaded. What is the first diagnostic step?
~~~

**Choices**

~~~text
A. * Delete and re-create the CLAUDE.md file from scratch, as it may have been corrupted or malformed
B. * Run `/memory` to verify which memory files are actually loaded in the session
C. * Check the file permissions on CLAUDE.md to ensure Claude Code can read it
D. * Add the rules to the system prompt in `docusaurus.config.ts` as a fallback
~~~

**Correct:** `B`

**Explanation**

~~~text
The `/memory` command displays all memory files currently loaded in the session, including which CLAUDE.md files are active and from which directories. This is the direct way to verify whether the expected CLAUDE.md is being found and loaded — before spending time debugging the file's contents. Common causes for missing CLAUDE.md: the file is in the wrong directory, the session was started from a different working directory, or there is a typo in the filename. Deleting and recreating (A) destroys content unnecessarily. File permissions (C) are rarely the issue on developer machines. Modifying project config files (D) is not how Claude Code memory works.
~~~

### Pair 43

#### Original (first in bank): cca-f-prep-159

Source: [question record](../data/questions/cca-f/questions.json#L5125) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your CI/CD system performs three types of Claude-powered analysis: (1) quick style checks on each PR that block merging until complete, (2) comprehensive security audits of the entire codebase run weekly, and (3) test case generation triggered nightly for recently-modified modules. The Message Batches API offers 50% cost savings but can take up to 24 hours to process. You want to optimize API costs while maintaining acceptable developer experience. Which combination correctly matches each task to its API approach?
~~~

**Choices**

~~~text
A. Use synchronous calls for PR style checks and nightly test generation; use Message Batches API only for weekly security audits.
B. Use the Message Batches API for all three tasks to maximize the 50% cost savings, and configure the pipeline to poll for batch completion.
C. Use synchronous calls for all three tasks for consistent response times, and rely on prompt caching to reduce costs across all workloads.
D. Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.
~~~

**Correct:** `D`

**Explanation**

~~~text
PR style checks block developers from merging and require immediate responses — they must use synchronous calls. Weekly security audits and nightly test generation are scheduled tasks with flexible timelines: they already run asynchronously and can easily tolerate the up-to-24-hour batch processing window. Using the Batches API for both scheduled workflows captures the 50% cost savings on the two highest-volume workloads without degrading developer experience. Option A incorrectly uses sync for nightly test generation, missing cost savings. Option B would make PR style checks unusable. Option C foregoes all batch savings.
_Why A is wrong:_ Incorrect: nightly test generation is a scheduled, latency-tolerant task — identical to the security audit in its batch-compatibility. Using sync for it wastes 50% cost savings with no benefit.
_Why B is wrong:_ Incorrect: PR style checks block merging — developers cannot wait up to 24 hours. Batching them would halt the development workflow entirely.
_Why C is wrong:_ Incorrect: prompt caching reduces costs for repeated prefixes but does not provide the 50% across-the-board savings of batch processing. Using sync for all three foregoes significant savings on the two scheduled tasks.
Refs: [Message Batches API](https://docs.anthropic.com/en/docs/build-with-claude/message-batches) · [Claude Code in CI/CD](https://docs.anthropic.com/en/docs/claude-code/github-actions)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-159

Source: [question record](../data/questions/cca-f/questions.json#L8206) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team uses Claude Code in a CI/CD pipeline for automated code quality, security, and testing tasks. You need to balance cost optimization against developer experience constraints across workflows with different latency requirements.* Your CI/CD system performs three types of Claude-powered analysis: (1) quick style checks on each PR that block merging until complete, (2) comprehensive security audits of the entire codebase run weekly, and (3) test case generation triggered nightly for recently-modified modules. The Message Batches API offers 50% cost savings but can take up to 24 hours to process. You want to optimize API costs while maintaining acceptable developer experience. Which combination correctly matches each task to its API approach?
~~~

**Choices**

~~~text
A. * Use synchronous calls for PR style checks and nightly test generation; use Message Batches API only for weekly security audits.
B. * Use the Message Batches API for all three tasks to maximize the 50% cost savings, and configure the pipeline to poll for batch completion.
C. * Use synchronous calls for all three tasks for consistent response times, and rely on prompt caching to reduce costs across all workloads.
D. * Use synchronous calls for PR style checks; use the Message Batches API for weekly security audits and nightly test generation.
~~~

**Correct:** `D`

**Explanation**

~~~text
PR style checks block developers from merging and require immediate responses — they must use synchronous calls. Weekly security audits and nightly test generation are scheduled tasks with flexible timelines: they already run asynchronously and can easily tolerate the up-to-24-hour batch processing window. Using the Batches API for both scheduled workflows captures the 50% cost savings on the two highest-volume workloads without degrading developer experience. Option A incorrectly uses sync for nightly test generation, missing cost savings. Option B would make PR style checks unusable. Option C foregoes all batch savings.
_Why A is wrong:_ Incorrect: nightly test generation is a scheduled, latency-tolerant task — identical to the security audit in its batch-compatibility. Using sync for it wastes 50% cost savings with no benefit.
_Why B is wrong:_ Incorrect: PR style checks block merging — developers cannot wait up to 24 hours. Batching them would halt the development workflow entirely.
_Why C is wrong:_ Incorrect: prompt caching reduces costs for repeated prefixes but does not provide the 50% across-the-board savings of batch processing. Using sync for all three foregoes significant savings on the two scheduled tasks.
~~~

### Pair 44

#### Original (first in bank): cca-f-prep-160

Source: [question record](../data/questions/cca-f/questions.json#L5158) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your automated review analyzes comments and docstrings. The current prompt instructs Claude to "check that comments are accurate and up-to-date." Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?
~~~

**Choices**

~~~text
A. Include git blame data so Claude can identify comments that predate recent code modifications
B. Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise
C. Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase
D. Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior
~~~

**Correct:** `D`

**Explanation**

~~~text
The root cause is the vague instruction "check that comments are accurate and up-to-date," which provides no concrete definition of what makes a comment problematic. Specifying explicit criteria — flag a comment only when its stated behavior contradicts what the code actually does — removes the ambiguity that generates both false positives (TODO markers, obvious descriptions) and false negatives (stale behavioral claims). This directly targets the mismatch between claim and implementation. Git blame (A) adds noise without a decision rule. Filtering (B) is a workaround, not a fix. Few-shot examples (C) help but are secondary to fixing the missing criterion.
_Why A is wrong:_ Git blame data indicates which comments are old but does not define whether an old comment is wrong. A comment from 3 years ago may still be accurate; a comment added yesterday may already be stale. Age alone cannot substitute for behavioral accuracy criteria.
_Why B is wrong:_ Filtering out TODO and descriptive patterns treats the symptom rather than the root cause. This reduces false positives on those specific patterns but does not prevent future false positives on new acceptable patterns, nor does it improve detection of genuinely stale behavioral descriptions.
_Why C is wrong:_ Few-shot examples can improve recognition of specific misleading patterns but only generalize well to similar examples. Without an explicit criterion (claimed behavior vs. actual code), the model lacks a general principle to apply to novel comment structures it has not seen examples of.
Refs: [Prompt engineering — explicit criteria](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) · [Claude Code CI/CD integration](https://docs.anthropic.com/en/docs/claude-code/github-actions)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-160

Source: [question record](../data/questions/cca-f/questions.json#L8238) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline analyzes code quality, documentation accuracy, and potential bugs across a large codebase with varied commenting conventions.* Your automated review analyzes comments and docstrings. The current prompt instructs Claude to "check that comments are accurate and up-to-date." Findings frequently flag acceptable patterns (TODO markers, straightforward descriptions) while missing comments that describe behavior the code no longer implements. What change addresses the root cause of this inconsistent analysis?
~~~

**Choices**

~~~text
A. * Include git blame data so Claude can identify comments that predate recent code modifications
B. * Filter out TODO, FIXME, and descriptive comment patterns before analysis to reduce noise
C. * Add few-shot examples of misleading comments to help the model recognize similar patterns in the codebase
D. * Specify explicit criteria: flag comments only when their claimed behavior contradicts actual code behavior
~~~

**Correct:** `D`

**Explanation**

~~~text
The root cause is the vague instruction "check that comments are accurate and up-to-date," which provides no concrete definition of what makes a comment problematic. Specifying explicit criteria — flag a comment only when its stated behavior contradicts what the code actually does — removes the ambiguity that generates both false positives (TODO markers, obvious descriptions) and false negatives (stale behavioral claims). This directly targets the mismatch between claim and implementation. Git blame (A) adds noise without a decision rule. Filtering (B) is a workaround, not a fix. Few-shot examples (C) help but are secondary to fixing the missing criterion.
_Why A is wrong:_ Git blame data indicates which comments are old but does not define whether an old comment is wrong. A comment from 3 years ago may still be accurate; a comment added yesterday may already be stale. Age alone cannot substitute for behavioral accuracy criteria.
_Why B is wrong:_ Filtering out TODO and descriptive patterns treats the symptom rather than the root cause. This reduces false positives on those specific patterns but does not prevent future false positives on new acceptable patterns, nor does it improve detection of genuinely stale behavioral descriptions.
_Why C is wrong:_ Few-shot examples can improve recognition of specific misleading patterns but only generalize well to similar examples. Without an explicit criterion (claimed behavior vs. actual code), the model lacks a general principle to apply to novel comment structures it has not seen examples of.
~~~

### Pair 45

#### Original (first in bank): cca-f-prep-161

Source: [question record](../data/questions/cca-f/questions.json#L5191) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
The code review component works iteratively: Claude analyzes a changed file, then may request related files (imports, base classes, tests) via tool calling to understand context before providing final feedback. Your application defines a tool that lets Claude request file contents; Claude invokes this tool, receives results, and continues its analysis. You're evaluating batch processing to reduce API costs. What is the primary technical constraint when considering batch processing for this workflow?
~~~

**Choices**

~~~text
A. The batch API does not support tool definitions in request parameters.
B. Batch processing latency of up to 24 hours is too slow for pull request feedback, though the workflow could otherwise function.
C. The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis.
D. Batch processing lacks request correlation identifiers for matching outputs to input requests.
~~~

**Correct:** `C`

**Explanation**

~~~text
The Batches API uses a fire-and-forget asynchronous model: you submit a batch and poll for completion; there is no mechanism to intercept a tool call mid-request, execute it server-side, and return the result so Claude can continue. Iterative tool-calling requires multiple round-trips within a single logical interaction — Claude calls a tool, your code executes it and returns the result, Claude resumes. This architecture is fundamentally incompatible with the batch model. The latency concern (B) is real but secondary — even if latency were acceptable, the workflow would still be broken because the tool calls cannot be served. Tool definitions (A) are supported in batch requests. Correlation IDs (D) are handled via the custom_id field.
_Why A is wrong:_ Incorrect: the Batches API does support tool definitions in request parameters — you can include a `tools` array. The problem is not the request schema but the inability to serve tool calls asynchronously mid-execution.
_Why B is wrong:_ Incorrect: latency is a valid concern for PR-blocking workflows, but it is not the primary technical constraint. Even for a workflow where latency is acceptable, the tool-calling interaction pattern still cannot function with the async fire-and-forget model.
_Why C is wrong:_ Incorrect: the Batches API does provide correlation — each request includes a `custom_id` field that maps to the corresponding output. Request correlation is not the constraint.
Refs: [Message Batches API](https://docs.anthropic.com/en/docs/build-with-claude/message-batches) · [Tool use overview](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-161

Source: [question record](../data/questions/cca-f/questions.json#L8270) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline uses an iterative tool-calling pattern where Claude requests additional file context mid-analysis before producing final feedback.* The code review component works iteratively: Claude analyzes a changed file, then may request related files (imports, base classes, tests) via tool calling to understand context before providing final feedback. Your application defines a tool that lets Claude request file contents; Claude invokes this tool, receives results, and continues its analysis. You're evaluating batch processing to reduce API costs. What is the primary technical constraint when considering batch processing for this workflow?
~~~

**Choices**

~~~text
A. * The batch API does not support tool definitions in request parameters.
B. * Batch processing latency of up to 24 hours is too slow for pull request feedback, though the workflow could otherwise function.
C. * The asynchronous model prevents executing tools mid-request and returning results for Claude to continue analysis.
D. * Batch processing lacks request correlation identifiers for matching outputs to input requests.
~~~

**Correct:** `C`

**Explanation**

~~~text
The Batches API uses a fire-and-forget asynchronous model: you submit a batch and poll for completion; there is no mechanism to intercept a tool call mid-request, execute it server-side, and return the result so Claude can continue. Iterative tool-calling requires multiple round-trips within a single logical interaction — Claude calls a tool, your code executes it and returns the result, Claude resumes. This architecture is fundamentally incompatible with the batch model. The latency concern (B) is real but secondary — even if latency were acceptable, the workflow would still be broken because the tool calls cannot be served. Tool definitions (A) are supported in batch requests. Correlation IDs (D) are handled via the custom_id field.
_Why A is wrong:_ Incorrect: the Batches API does support tool definitions in request parameters — you can include a `tools` array. The problem is not the request schema but the inability to serve tool calls asynchronously mid-execution.
_Why B is wrong:_ Incorrect: latency is a valid concern for PR-blocking workflows, but it is not the primary technical constraint. Even for a workflow where latency is acceptable, the tool-calling interaction pattern still cannot function with the async fire-and-forget model.
_Why C is wrong:_ Incorrect: the Batches API does provide correlation — each request includes a `custom_id` field that maps to the corresponding output. Request correlation is not the constraint.
~~~

### Pair 46

#### Original (first in bank): cca-f-prep-162

Source: [question record](../data/questions/cca-f/questions.json#L5224) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your automated code review averages 15 findings per pull request, with developers reporting a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude's reasoning before deciding whether to address or dismiss it. Your CLAUDE.md already contains comprehensive rules for acceptable patterns, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?
~~~

**Choices**

~~~text
A. Require Claude to include its reasoning and confidence assessment inline with each finding
B. Categorize findings as "blocking issues" versus "suggestions" with tiered review requirements
C. Add a post-processor that analyzes finding patterns and automatically suppresses those matching historical false positive signatures
D. Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags before developers see them
~~~

**Correct:** `A`

**Explanation**

~~~text
The bottleneck is clicking into findings to read reasoning. Including reasoning and confidence inline with each finding eliminates that click — developers can triage at a glance without navigating away. This respects the no-filtering constraint because all findings remain visible; it simply makes the information needed for triage immediately accessible. Categorizing (B) adds a useful label but still requires developers to evaluate each finding without the reasoning they need. The post-processor (C) was explicitly rejected by stakeholders as a filtering approach. High-confidence filtering (D) was also explicitly rejected — it hides findings from developers.
_Why A is wrong:_ While categorizing findings into blocking vs. suggestions can speed some triage decisions, it does not address the root bottleneck: developers still need to click into each finding to understand why it was flagged before deciding. Inline reasoning is what eliminates the click.
_Why B is wrong:_ Adding a post-processor to suppress historical false positive patterns is a form of pre-filtering — it removes findings before developers see them. Stakeholders explicitly rejected this approach.
_Why C is wrong:_ High-confidence filtering hides findings from developers — this was explicitly rejected by stakeholders who want all findings visible.
Refs: [Prompt engineering — structured output](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) · [Claude Code CI/CD integration](https://docs.anthropic.com/en/docs/claude-code/github-actions)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-162

Source: [question record](../data/questions/cca-f/questions.json#L8302) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team uses the Claude Code CLI with --print mode for automated PR reviews in CI. The review pipeline analyzes code quality, documentation accuracy, and potential bugs across a large codebase with varied commenting conventions.* Your automated code review averages 15 findings per pull request, with developers reporting a 40% false positive rate. The bottleneck is investigation time: developers must click into each finding to read Claude's reasoning before deciding whether to address or dismiss it. Your CLAUDE.md already contains comprehensive rules for acceptable patterns, and stakeholders have rejected any approach that filters findings before developer review. What change would best address the investigation time bottleneck?
~~~

**Choices**

~~~text
A. * Require Claude to include its reasoning and confidence assessment inline with each finding
B. * Categorize findings as "blocking issues" versus "suggestions" with tiered review requirements
C. * Add a post-processor that analyzes finding patterns and automatically suppresses those matching historical false positive signatures
D. * Configure Claude to only surface findings it assesses as high confidence, filtering out uncertain flags before developers see them
~~~

**Correct:** `A`

**Explanation**

~~~text
The bottleneck is clicking into findings to read reasoning. Including reasoning and confidence inline with each finding eliminates that click — developers can triage at a glance without navigating away. This respects the no-filtering constraint because all findings remain visible; it simply makes the information needed for triage immediately accessible. Categorizing (B) adds a useful label but still requires developers to evaluate each finding without the reasoning they need. The post-processor (C) was explicitly rejected by stakeholders as a filtering approach. High-confidence filtering (D) was also explicitly rejected — it hides findings from developers.
_Why A is wrong:_ While categorizing findings into blocking vs. suggestions can speed some triage decisions, it does not address the root bottleneck: developers still need to click into each finding to understand why it was flagged before deciding. Inline reasoning is what eliminates the click.
_Why B is wrong:_ Adding a post-processor to suppress historical false positive patterns is a form of pre-filtering — it removes findings before developers see them. Stakeholders explicitly rejected this approach.
_Why C is wrong:_ High-confidence filtering hides findings from developers — this was explicitly rejected by stakeholders who want all findings visible.
~~~

### Pair 47

#### Original (first in bank): cca-f-prep-163

Source: [question record](../data/questions/cca-f/questions.json#L5257) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your CLAUDE.md has grown to over 400 lines containing coding standards, testing conventions, a detailed PR review checklist, deployment workflow instructions, and database migration procedures. You want Claude to always follow the coding standards and testing conventions, but only apply PR review, deployment, and migration guidance when you're actually performing those tasks. What's the most effective restructuring approach?
~~~

**Choices**

~~~text
A. Split the CLAUDE.md into files in .claude/rules/ with path-specific glob patterns so each rule loads only for matching file types
B. Keep universal standards in CLAUDE.md and create Skills for task-specific workflows (PR reviews, deployments, migrations) with trigger keywords
C. Move all guidance into separate Skills files organized by workflow type, keeping only a brief project description in CLAUDE.md
D. Keep all content in CLAUDE.md but use @import syntax to organize it into separately maintained files by category
~~~

**Correct:** `B`

**Explanation**

~~~text
CLAUDE.md content is loaded for every conversation, making it the right home for standards that should always apply (coding conventions, testing rules). Skills are invoked on-demand when Claude detects relevant trigger keywords or the developer uses a slash command, making them ideal for task-specific workflows like PR reviews, deployments, and migrations. This matches loading behavior to usage frequency. Glob rules (A) are path-based — they activate for files matching a pattern, not for tasks like "I'm doing a deployment." Moving everything to Skills (C) would cause coding standards to be absent from regular coding sessions. The `@import` syntax (D) does not exist in CLAUDE.md — there is no such feature.
_Why A is wrong:_ Glob patterns in .claude/rules/ activate based on the file path being edited — they are ideal for "apply this when editing test files" but cannot express "apply this when the developer is performing a deployment." Task-based activation requires Skills.
_Why B is wrong:_ Moving all guidance to Skills means coding standards and testing conventions would only be active when a developer explicitly invokes the relevant skill. During normal coding, Claude would have no standards to follow — the opposite of what is needed.
_Why C is wrong:_ CLAUDE.md does not support an @import syntax. There is no mechanism to compose CLAUDE.md from separate files via imports.
Refs: [Claude Code memory — CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory) · [Claude Code slash commands and skills](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-163

Source: [question record](../data/questions/cca-f/questions.json#L8334) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.* Your CLAUDE.md has grown to over 400 lines containing coding standards, testing conventions, a detailed PR review checklist, deployment workflow instructions, and database migration procedures. You want Claude to always follow the coding standards and testing conventions, but only apply PR review, deployment, and migration guidance when you're actually performing those tasks. What's the most effective restructuring approach?
~~~

**Choices**

~~~text
A. * Split the CLAUDE.md into files in .claude/rules/ with path-specific glob patterns so each rule loads only for matching file types
B. * Keep universal standards in CLAUDE.md and create Skills for task-specific workflows (PR reviews, deployments, migrations) with trigger keywords
C. * Move all guidance into separate Skills files organized by workflow type, keeping only a brief project description in CLAUDE.md
D. * Keep all content in CLAUDE.md but use @import syntax to organize it into separately maintained files by category
~~~

**Correct:** `B`

**Explanation**

~~~text
CLAUDE.md content is loaded for every conversation, making it the right home for standards that should always apply (coding conventions, testing rules). Skills are invoked on-demand when Claude detects relevant trigger keywords or the developer uses a slash command, making them ideal for task-specific workflows like PR reviews, deployments, and migrations. This matches loading behavior to usage frequency. Glob rules (A) are path-based — they activate for files matching a pattern, not for tasks like "I'm doing a deployment." Moving everything to Skills (C) would cause coding standards to be absent from regular coding sessions. The `@import` syntax (D) does not exist in CLAUDE.md — there is no such feature.
_Why A is wrong:_ Glob patterns in .claude/rules/ activate based on the file path being edited — they are ideal for "apply this when editing test files" but cannot express "apply this when the developer is performing a deployment." Task-based activation requires Skills.
_Why B is wrong:_ Moving all guidance to Skills means coding standards and testing conventions would only be active when a developer explicitly invokes the relevant skill. During normal coding, Claude would have no standards to follow — the opposite of what is needed.
_Why C is wrong:_ CLAUDE.md does not support an @import syntax. There is no mechanism to compose CLAUDE.md from separate files via imports.
~~~

### Pair 48

#### Original (first in bank): cca-f-prep-164

Source: [question record](../data/questions/cca-f/questions.json#L5290) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Your team uses a /commit skill stored in .claude/skills/commit/SKILL.md. One developer wants to customize it for their personal workflow (different commit message format, additional checks) without affecting teammates. What should you recommend?
~~~

**Choices**

~~~text
A. Set override: true in the personal skill's frontmatter for precedence
B. Create a personal version in ~/.claude/skills/ with a different name like /my-commit
C. Create a personal version at ~/.claude/skills/commit/SKILL.md with the same /commit name to override
D. Add username-based conditional logic to the project skill's frontmatter config
~~~

**Correct:** `B`

**Explanation**

~~~text
Project-scoped skills (in .claude/skills/) take precedence over user-scoped skills (~/.claude/skills/) when both have the same name. To make a personal skill accessible alongside the project skill, the developer must use a different name — such as /my-commit — in their personal ~/.claude/skills/ directory. Using the same /commit name in user scope (C) would be silently overridden by the project skill. The override: true key (A) and username-based conditionals (D) are not valid SKILL.md frontmatter options.
Refs: [Claude Code slash commands and skills](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-164

Source: [question record](../data/questions/cca-f/questions.json#L8366) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
Your team uses a /commit skill stored in .claude/skills/commit/SKILL.md. One developer wants to customize it for their personal workflow (different commit message format, additional checks) without affecting teammates. What should you recommend?
~~~

**Choices**

~~~text
A. * Set override: true in the personal skill's frontmatter for precedence
B. * Create a personal version in ~/.claude/skills/ with a different name like /my-commit
C. * Create a personal version at ~/.claude/skills/commit/SKILL.md with the same /commit name to override
D. * Add username-based conditional logic to the project skill's frontmatter config
~~~

**Correct:** `B`

**Explanation**

~~~text
Project-scoped skills (in .claude/skills/) take precedence over user-scoped skills (~/.claude/skills/) when both have the same name. To make a personal skill accessible alongside the project skill, the developer must use a different name — such as /my-commit — in their personal ~/.claude/skills/ directory. Using the same /commit name in user scope (C) would be silently overridden by the project skill. The override: true key (A) and username-based conditionals (D) are not valid SKILL.md frontmatter options.
~~~

### Pair 49

#### Original (first in bank): cca-f-prep-166

Source: [question record](../data/questions/cca-f/questions.json#L5355) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
When researching a broad topic, you observe that the web search agent and document analysis agent are both investigating the same subtopics, resulting in significant overlap in their findings. Token usage nearly doubled without proportionally increasing the breadth or depth of research coverage. What's the most effective way to address this?
~~~

**Choices**

~~~text
A. Implement a shared state mechanism where agents log their current focus area, allowing other agents to dynamically avoid duplicating work in progress
B. Convert to sequential execution where document analysis runs only after web search completes, using the web search findings as context to avoid duplication
C. Allow both agents to complete their parallel work, then have the coordinator deduplicate overlapping findings before passing to the synthesis agent
D. Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent
~~~

**Correct:** `D`

**Explanation**

~~~text
The root cause is that the coordinator delegated the same research space to both agents without defining boundaries. Having the coordinator explicitly partition the research space before delegation — assigning distinct subtopics (e.g., agent A covers academic/primary sources; agent B covers industry/news) or distinct domains of the topic — addresses the problem at its source, before any wasted work occurs. This preserves the benefits of parallel execution. Shared state (A) adds coordination complexity and coordination failures. Sequential execution (B) eliminates the parallelism benefit. Post-hoc deduplication (C) is a workaround that still wastes all the tokens spent on overlapping work.
_Why A is wrong:_ Shared state between parallel agents introduces coordination overhead and race conditions (what if both agents choose the same focus area simultaneously?). It also requires agents to monitor and respond to each other's state, adding complexity. Upfront partitioning is simpler and more reliable.
_Why B is wrong:_ Converting to sequential execution solves the overlap but at the cost of the primary performance benefit — parallel research. The coordinator pattern uses parallel subagents specifically to reduce total time. Sequential execution defeats this architecture.
_Why C is wrong:_ Post-hoc deduplication removes overlapping findings before synthesis but the tokens were already spent generating them. This treats the symptom (duplicate findings) rather than the cause (unpartitioned task assignment).
Refs: [Build effective agents — orchestration](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration) · [Agentic systems overview](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/build-effective-agents)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-166

Source: [question record](../data/questions/cca-f/questions.json#L8398) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.* When researching a broad topic, you observe that the web search agent and document analysis agent are both investigating the same subtopics, resulting in significant overlap in their findings. Token usage nearly doubled without proportionally increasing the breadth or depth of research coverage. What's the most effective way to address this?
~~~

**Choices**

~~~text
A. * Implement a shared state mechanism where agents log their current focus area, allowing other agents to dynamically avoid duplicating work in progress
B. * Convert to sequential execution where document analysis runs only after web search completes, using the web search findings as context to avoid duplication
C. * Allow both agents to complete their parallel work, then have the coordinator deduplicate overlapping findings before passing to the synthesis agent
D. * Have the coordinator explicitly partition the research space before delegation, assigning distinct subtopics or source types to each agent
~~~

**Correct:** `D`

**Explanation**

~~~text
The root cause is that the coordinator delegated the same research space to both agents without defining boundaries. Having the coordinator explicitly partition the research space before delegation — assigning distinct subtopics (e.g., agent A covers academic/primary sources; agent B covers industry/news) or distinct domains of the topic — addresses the problem at its source, before any wasted work occurs. This preserves the benefits of parallel execution. Shared state (A) adds coordination complexity and coordination failures. Sequential execution (B) eliminates the parallelism benefit. Post-hoc deduplication (C) is a workaround that still wastes all the tokens spent on overlapping work.
_Why A is wrong:_ Shared state between parallel agents introduces coordination overhead and race conditions (what if both agents choose the same focus area simultaneously?). It also requires agents to monitor and respond to each other's state, adding complexity. Upfront partitioning is simpler and more reliable.
_Why B is wrong:_ Converting to sequential execution solves the overlap but at the cost of the primary performance benefit — parallel research. The coordinator pattern uses parallel subagents specifically to reduce total time. Sequential execution defeats this architecture.
_Why C is wrong:_ Post-hoc deduplication removes overlapping findings before synthesis but the tokens were already spent generating them. This treats the symptom (duplicate findings) rather than the cause (unpartitioned task assignment).
~~~

### Pair 50

#### Original (first in bank): cca-f-prep-169

Source: [question record](../data/questions/cca-f/questions.json#L5454) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
During testing, combined outputs from the web search agent (85K tokens including page content) and the document analysis agent (70K tokens including reasoning chains) total 155K tokens, but the synthesis agent performs optimally with inputs under 50K tokens. What's the most effective solution?
~~~

**Choices**

~~~text
A. Store findings in a vector database and give the synthesis agent retrieval tools to query during its work
B. Add an intermediate summarization agent that condenses findings before passing to synthesis
C. Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning
D. Have the synthesis agent process findings in sequential batches, maintaining running state between calls
~~~

**Correct:** `C`

**Explanation**

~~~text
Modifying upstream agents to return structured data addresses the root cause: the agents are returning far more token-volume than the synthesis step needs. Full page content and reasoning chains are intermediate artifacts of the search and analysis process — they are not the output the synthesis agent needs. Requiring agents to output key facts, citations, and relevance scores reduces token volume at the source while preserving the essential information. This is better than downstream approaches: vector retrieval (A) adds latency and requires the synthesis agent to know what to retrieve; intermediate summarization (B) adds another agent hop and may lose structured facts; sequential batches (D) require maintaining state across calls and do not reduce total token usage.
_Why A is wrong:_ A vector database with retrieval tools gives the synthesis agent a way to query for specific information but requires it to generate queries, increasing complexity and latency. It also does not reduce the total data generated by upstream agents — the 155K tokens are still produced and stored. Structured output upstream is simpler and more direct.
_Why B is wrong:_ An intermediate summarization agent adds a third layer of processing and another agent hop. It also risks losing structured data (key facts, specific figures, citation metadata) that is easier to preserve by having the upstream agents return structured output directly.
_Why C is wrong:_ Sequential batch processing of 155K tokens across multiple calls adds complexity through state management and does not reduce the total context the synthesis agent must process — it just fragments it. Upstream structured output is more efficient.
Refs: [Build effective agents — orchestration](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems/orchestration) · [Context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-169

Source: [question record](../data/questions/cca-f/questions.json#L8430) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team built a multi-agent research system using Claude as a coordinator with specialized subagents: a web search agent, a document analysis agent, and a synthesis agent. The coordinator decomposes research topics, delegates to subagents, and passes combined findings to the synthesis agent.* During testing, combined outputs from the web search agent (85K tokens including page content) and the document analysis agent (70K tokens including reasoning chains) total 155K tokens, but the synthesis agent performs optimally with inputs under 50K tokens. What's the most effective solution?
~~~

**Choices**

~~~text
A. * Store findings in a vector database and give the synthesis agent retrieval tools to query during its work
B. * Add an intermediate summarization agent that condenses findings before passing to synthesis
C. * Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning
D. * Have the synthesis agent process findings in sequential batches, maintaining running state between calls
~~~

**Correct:** `C`

**Explanation**

~~~text
Modifying upstream agents to return structured data addresses the root cause: the agents are returning far more token-volume than the synthesis step needs. Full page content and reasoning chains are intermediate artifacts of the search and analysis process — they are not the output the synthesis agent needs. Requiring agents to output key facts, citations, and relevance scores reduces token volume at the source while preserving the essential information. This is better than downstream approaches: vector retrieval (A) adds latency and requires the synthesis agent to know what to retrieve; intermediate summarization (B) adds another agent hop and may lose structured facts; sequential batches (D) require maintaining state across calls and do not reduce total token usage.
_Why A is wrong:_ A vector database with retrieval tools gives the synthesis agent a way to query for specific information but requires it to generate queries, increasing complexity and latency. It also does not reduce the total data generated by upstream agents — the 155K tokens are still produced and stored. Structured output upstream is simpler and more direct.
_Why B is wrong:_ An intermediate summarization agent adds a third layer of processing and another agent hop. It also risks losing structured data (key facts, specific figures, citation metadata) that is easier to preserve by having the upstream agents return structured output directly.
_Why C is wrong:_ Sequential batch processing of 155K tokens across multiple calls adds complexity through state management and does not reduce the total context the synthesis agent must process — it just fragments it. Upstream structured output is more efficient.
~~~

### Pair 51

#### Original (first in bank): cca-f-prep-170

Source: [question record](../data/questions/cca-f/questions.json#L5487) · Status: `ready` · Source ID: `cca-prep-170`

**Prompt**

~~~text
Production logs show the agent sometimes selects get_customer when lookup_order would be more appropriate, particularly for ambiguous requests like "I need help with my recent purchase." You decide to add few-shot examples to your system prompt to improve tool selection. Which approach will most effectively address this issue?
~~~

**Choices**

~~~text
A. Add examples grouped by tool—all get_customer scenarios together, then all lookup_order scenarios.
B. Add 10–15 examples of clear, unambiguous requests that demonstrate correct tool selection for each tool's typical use cases.
C. Add explicit "use when" and "do not use when" guidelines in each tool's description covering the ambiguous cases.
D. Add 4–6 examples targeting ambiguous scenarios, each showing reasoning for why one tool was chosen over plausible alternatives.
~~~

**Correct:** `D`

**Explanation**

~~~text
The error occurs on ambiguous requests — not on clear cases where the agent already performs correctly. Few-shot examples are most effective when they target the specific scenarios where errors occur, paired with explicit reasoning about the comparative decision. For "I need help with my recent purchase," the reasoning might be: "This mentions a purchase, not account details — use lookup_order, not get_customer. If the customer had said 'my account' or 'my profile,' get_customer would be appropriate." This comparative reasoning directly teaches the decision process for edge cases. Grouping by tool (A) makes examples easier to scan but does not demonstrate comparative reasoning. Many clear-case examples (B) reinforce behavior that already works correctly without addressing the ambiguous cases. Tool description updates (C) are a valid complementary fix but are not few-shot examples.
_Why A is wrong:_ Grouping examples by tool (all get_customer first, then all lookup_order) organizes the prompt for human readability but does not teach comparative reasoning. The model sees each tool's use cases in isolation rather than side-by-side for ambiguous inputs.
_Why B is wrong:_ Adding 10–15 clear-case examples reinforces correct behavior on cases the agent already handles correctly. Since the errors occur specifically on ambiguous requests, these examples do not address the problem. More examples of already-known patterns do not generalize to edge cases.
_Why C is wrong:_ Updating tool descriptions with "use when / do not use when" guidelines is a valid and complementary approach, but it is not few-shot prompting. The question asks specifically about which few-shot approach is most effective.
Refs: [Tool use best practices](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices) · [Prompt engineering — few-shot](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-examples)
~~~

#### Duplicate (second in bank): cca-f-cca-prep-170-qu-170

Source: [question record](../data/questions/cca-f/questions.json#L8462) · Status: `ready` · Source ID: `cca-prep-170-qu`

**Prompt**

~~~text
*Scenario: Your team is building an AI-powered customer support agent that handles order inquiries, billing disputes, and account management. The agent uses a set of tools including get_customer, lookup_order, process_refund, and escalate_to_human to resolve customer issues autonomously.* Production logs show the agent sometimes selects get_customer when lookup_order would be more appropriate, particularly for ambiguous requests like "I need help with my recent purchase." You decide to add few-shot examples to your system prompt to improve tool selection. Which approach will most effectively address this issue?
~~~

**Choices**

~~~text
A. * Add examples grouped by tool—all get_customer scenarios together, then all lookup_order scenarios.
B. * Add 10–15 examples of clear, unambiguous requests that demonstrate correct tool selection for each tool's typical use cases.
C. * Add explicit "use when" and "do not use when" guidelines in each tool's description covering the ambiguous cases.
D. * Add 4–6 examples targeting ambiguous scenarios, each showing reasoning for why one tool was chosen over plausible alternatives.
~~~

**Correct:** `D`

**Explanation**

~~~text
The error occurs on ambiguous requests — not on clear cases where the agent already performs correctly. Few-shot examples are most effective when they target the specific scenarios where errors occur, paired with explicit reasoning about the comparative decision. For "I need help with my recent purchase," the reasoning might be: "This mentions a purchase, not account details — use lookup_order, not get_customer. If the customer had said 'my account' or 'my profile,' get_customer would be appropriate." This comparative reasoning directly teaches the decision process for edge cases. Grouping by tool (A) makes examples easier to scan but does not demonstrate comparative reasoning. Many clear-case examples (B) reinforce behavior that already works correctly without addressing the ambiguous cases. Tool description updates (C) are a valid complementary fix but are not few-shot examples.
_Why A is wrong:_ Grouping examples by tool (all get_customer first, then all lookup_order) organizes the prompt for human readability but does not teach comparative reasoning. The model sees each tool's use cases in isolation rather than side-by-side for ambiguous inputs.
_Why B is wrong:_ Adding 10–15 clear-case examples reinforces correct behavior on cases the agent already handles correctly. Since the errors occur specifically on ambiguous requests, these examples do not address the problem. More examples of already-known patterns do not generalize to edge cases.
_Why C is wrong:_ Updating tool descriptions with "use when / do not use when" guidelines is a valid and complementary approach, but it is not few-shot prompting. The question asks specifically about which few-shot approach is most effective.
~~~

### Pair 52

#### Original (first in bank): cca-f-foundation-003

Source: [question record](../data/questions/cca-f/questions.json#L5586) · Status: `ready` · Source ID: `foundations-prep-35`

**Prompt**

~~~text
Multi-agent research: Agentic Architecture & Orchestration.** Your coordinator delegates to search, analysis, and report subagents. Final reports cite sources that do not support their claims, though each subagent behaves sensibly alone. What is the most likely architectural cause?
~~~

**Choices**

~~~text
A. Provenance is lost at handoffs: findings and their sources are not passed together in a structured form, so the report writer pairs claims with citations by guesswork
B. The report subagent's model is too small
C. The web is unreliable
D. Too many subagents are running in parallel
~~~

**Correct:** `A`

**Explanation**

~~~text
Option A is correct per scenario guidelines.
~~~

#### Duplicate (second in bank): cca-f-associate-163

Source: [question record](../data/questions/cca-f/questions.json#L19918) · Status: `ready` · Source ID: `associate-prep-50`

**Prompt**

~~~text
Your coordinator delegates to search, analysis, and report subagents. Final reports cite sources that do not support their claims, though each subagent behaves sensibly alone. What is the most likely architectural cause?
~~~

**Choices**

~~~text
A. Provenance is lost at handoffs: findings and their sources are not passed together in a structured form, so the report writer pairs claims with citations by guesswork
B. The report subagent's model is too small
C. The web is unreliable
D. Too many subagents are running in parallel
~~~

**Correct:** `A`

**Explanation**

~~~text
In multi-agent pipelines, provenance survives only if the handoff format carries claim and source together. That failure mode produces exactly this symptom while every stage looks locally fine. Model size (B), source quality (C), and parallelism (D) do not explain correct facts paired with wrong citations.
~~~

### Pair 53

#### Original (first in bank): cca-f-foundation-004

Source: [question record](../data/questions/cca-f/questions.json#L5618) · Status: `ready` · Source ID: `foundations-prep-35`

**Prompt**

~~~text
Multi-agent research: Context Management & Reliability.** The analysis subagent returns 30,000-token document dumps to the coordinator, which then fails on context limits. What is the right fix?
~~~

**Choices**

~~~text
A. Give the coordinator a bigger context window
B. Have subagents return structured extracts, findings with citations and confidence, while full documents stay in the subagent's context or a scratchpad file
C. Have the coordinator drop the oldest messages silently
D. Run the analysis twice and keep the shorter answer
~~~

**Correct:** `B`

**Explanation**

~~~text
Option B is correct per scenario guidelines.
~~~

#### Duplicate (second in bank): cca-f-associate-164

Source: [question record](../data/questions/cca-f/questions.json#L19950) · Status: `ready` · Source ID: `associate-prep-50`

**Prompt**

~~~text
The analysis subagent returns 30,000-token document dumps to the coordinator, which then fails on context limits. What is the right fix?
~~~

**Choices**

~~~text
A. Give the coordinator a bigger context window
B. Have subagents return structured extracts, findings with citations and confidence, while full documents stay in the subagent's context or a scratchpad file
C. Have the coordinator drop the oldest messages silently
D. Run the analysis twice and keep the shorter answer
~~~

**Correct:** `B`

**Explanation**

~~~text
Context isolation is the point of subagent delegation: raw bulk stays at the edge, distilled results travel. A larger window (A) postpones the failure, silent dropping (C) loses arbitrary information, and rerunning (D) changes nothing structural.
~~~

### Pair 54

#### Original (first in bank): cca-f-foundation-005

Source: [question record](../data/questions/cca-f/questions.json#L5650) · Status: `ready` · Source ID: `foundations-prep-35`

**Prompt**

~~~text
Claude Code for development: Claude Code Configuration & Workflows.** Your monorepo has frontend and backend directories with different conventions, and one team-wide rule about commit style. Where does each piece of configuration belong?
~~~

**Choices**

~~~text
A. Everything in one root CLAUDE.md
B. Each engineer's personal user-level CLAUDE.md
C. The commit rule in the project-level CLAUDE.md; the per-area conventions in path-scoped rules under .claude/rules/ that load only when matching files are touched
D. A wiki page linked from the README
~~~

**Correct:** `C`

**Explanation**

~~~text
Option C is correct per scenario guidelines.
~~~

#### Duplicate (second in bank): cca-f-associate-165

Source: [question record](../data/questions/cca-f/questions.json#L19982) · Status: `ready` · Source ID: `associate-prep-50`

**Prompt**

~~~text
Your monorepo has frontend and backend directories with different conventions, and one team-wide rule about commit style. Where does each piece of configuration belong?
~~~

**Choices**

~~~text
A. Everything in one root CLAUDE.md
B. Each engineer's personal user-level CLAUDE.md
C. The commit rule in the project-level CLAUDE.md; the per-area conventions in path-scoped rules under .claude/rules/ that load only when matching files are touched
D. A wiki page linked from the README
~~~

**Correct:** `C`

**Explanation**

~~~text
The hierarchy exists for exactly this: shared rules at project scope, conditional conventions path-scoped so context is spent only where relevant. One root file (A) loads everything everywhere, personal files (B) diverge per engineer, and a wiki (D) never reaches the model.
~~~

### Pair 55

#### Original (first in bank): cca-f-foundation-008

Source: [question record](../data/questions/cca-f/questions.json#L5748) · Status: `ready` · Source ID: `foundations-prep-35`

**Prompt**

~~~text
Structured data extraction: Prompt Engineering & Structured Output.** Invoices sometimes lack a purchase-order number, and your extraction schema must handle that honestly while catching real misses. What is the right schema design?
~~~

**Choices**

~~~text
A. Make every field required so nothing is missed
B. Make purchase_order nullable, so absence is recorded as null, and validate that it is present whenever the document type requires it
C. Make everything optional to avoid validation errors
D. Have the model invent a plausible number when one is missing
~~~

**Correct:** `B`

**Explanation**

~~~text
Option B is correct per scenario guidelines.
~~~

#### Duplicate (second in bank): cca-f-associate-168

Source: [question record](../data/questions/cca-f/questions.json#L20014) · Status: `ready` · Source ID: `associate-prep-50`

**Prompt**

~~~text
Invoices sometimes lack a purchase-order number, and your extraction schema must handle that honestly while catching real misses. What is the right schema design?
~~~

**Choices**

~~~text
A. Make every field required so nothing is missed
B. Make purchase_order nullable, so absence is recorded as null, and validate that it is present whenever the document type requires it
C. Make everything optional to avoid validation errors
D. Have the model invent a plausible number when one is missing
~~~

**Correct:** `B`

**Explanation**

~~~text
Schema design encodes reality: genuinely optional data is nullable, and conditional requirements are validated downstream. All-required (A) forces fabrication or failure on legitimate documents, all-optional (C) blinds you to true misses, and invention (D) is data corruption.
~~~

### Pair 56

#### Original (first in bank): cca-f-foundation-009

Source: [question record](../data/questions/cca-f/questions.json#L5780) · Status: `ready` · Source ID: `foundations-prep-35`

**Prompt**

~~~text
Structured data extraction: Context Management & Reliability.** Your pipeline reports 98% field accuracy, measured on the documents the schema validated cleanly. An auditor calls the number misleading. Why?
~~~

**Choices**

~~~text
A. Accuracy should be measured only on the hardest documents
B. 98% is below industry standard
C. Validation-clean documents are a biased sample: the honest measure comes from a labeled sample drawn across all documents, including ones that failed or barely passed validation
D. Field accuracy is not a real metric
~~~

**Correct:** `C`

**Explanation**

~~~text
Option C is correct per scenario guidelines.
~~~

#### Duplicate (second in bank): cca-f-associate-169

Source: [question record](../data/questions/cca-f/questions.json#L20046) · Status: `ready` · Source ID: `associate-prep-50`

**Prompt**

~~~text
Your pipeline reports 98% field accuracy, measured on the documents the schema validated cleanly. An auditor calls the number misleading. Why?
~~~

**Choices**

~~~text
A. Accuracy should be measured only on the hardest documents
B. 98% is below industry standard
C. Validation-clean documents are a biased sample: the honest measure comes from a labeled sample drawn across all documents, including ones that failed or barely passed validation
D. Field accuracy is not a real metric
~~~

**Correct:** `C`

**Explanation**

~~~text
Measuring only where the system already succeeded inflates the estimate; calibration requires a labeled sample representative of the full input stream. Hardest-only (A) biases in the opposite direction, the standard claim (B) is invented, and (D) is false.
~~~

## All six unusable published questions

These choices contain only their letter labels. The stored explanations also give only a letter, so the records cannot function as practice questions.

### Unusable 1 of 6

#### Question: cca-f-archeval-012

Source: [question record](../data/questions/cca-f/questions.json#L6670) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
12 [Agentic Architecture & Orchestration] What is the strongest justification for splitting work across subagents?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `B`

**Explanation**

~~~text
Option B is the correct answer.
~~~

### Unusable 2 of 6

#### Question: cca-f-archeval-013

Source: [question record](../data/questions/cca-f/questions.json#L6702) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
13 [Agentic Architecture & Orchestration] An agent loops between two tools without converging. What is the most appropriate first control?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `C`

**Explanation**

~~~text
Option C is the correct answer.
~~~

### Unusable 3 of 6

#### Question: cca-f-archeval-041

Source: [question record](../data/questions/cca-f/questions.json#L6734) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
41 [Claude Code Configuration & Workflows] When is plan mode the appropriate choice over direct execution?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `C`

**Explanation**

~~~text
Option C is the correct answer.
~~~

### Unusable 4 of 6

#### Question: cca-f-archeval-052

Source: [question record](../data/questions/cca-f/questions.json#L6766) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
52 [Agentic Architecture & Orchestration] What is the principal cost of introducing a subagent?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `A`

**Explanation**

~~~text
Option A is the correct answer.
~~~

### Unusable 5 of 6

#### Question: cca-f-archeval-067

Source: [question record](../data/questions/cca-f/questions.json#L6798) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
67 [Agentic Architecture & Orchestration] What determines whether two lines of work belong in separate subagents?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `A`

**Explanation**

~~~text
Option A is the correct answer.
~~~

### Unusable 6 of 6

#### Question: cca-f-archeval-069

Source: [question record](../data/questions/cca-f/questions.json#L6830) · Status: `ready` · Source ID: `architectural-eval-6`

**Prompt**

~~~text
69 [Claude Code Configuration & Workflows] A CLAUDE.md has grown to several thousand lines. What is the likely effect?
~~~

**Choices**

~~~text
A. * A
B. * B
C. * C
D. * D
~~~

**Correct:** `B`

**Explanation**

~~~text
Option B is the correct answer.
~~~
