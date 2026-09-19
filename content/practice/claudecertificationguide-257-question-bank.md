---
title: "claudecertificationguide — 257 Questions"
count: "257 Q"
meta: "Free CCAR-F course · extracted from Next.js RSC payload"
tags: ["practice", "questions"]
---
# Claude Certification Guide — CCAR-F Question Bank (257 questions)

> Source: https://claudecertificationguide.com (free, fully open practice site)
> Extracted: 2026-09-19 · via server-rendered RSC payload of `/mock-exam/start`
> Distribution by type: single: 247, multiple-response: 10
> Distribution by domain: D1 65 · D2 46 · D3 56 · D4 44 · D5 46
> Difficulty: {"application":138,"scenario-analysis":71,"recall":48}

This is the complete bank powering the free mock exams, exercises and drill mode on
claudecertificationguide.com, including per-option explanations, the answer key, rationale,
and each question's mapped task statement.

---


## Domain 1 — Agentic Architecture & Orchestration (27%)

_65 questions_

### Q001 (q-1-1-001) — single-choice

**Task statement:** 1.1 agentic-loops / lifecycle · **Difficulty:** application · scenario: s1

**A developer's customer support agent sometimes terminates prematurely because they check if response.content[0].type == 'text' to determine completion. The agent stops even when Claude has more tools to call. What is the bug and how should they fix it?**

　 **A.** Add an iteration cap of 15 loops and treat reaching the cap as the signal that the agent has finished its work.

✅ **[CORRECT]** **B.** Check the stop_reason field instead of content type: continue on 'tool_use', terminate on 'end_turn'.

　 **C.** Parse the assistant's text for completion phrases like 'I have completed' and treat the first match as the signal to stop.

　 **D.** Set tool_choice to 'any' so Claude always calls a tool instead of returning text

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The stop_reason field is the deterministic, authoritative signal for loop control. Claude can return text alongside tool_use blocks, so checking content type is unreliable.

**Option breakdown:**

- **A** (incorrect): Arbitrary caps do not address the root cause, and using the cap as a completion signal is itself an anti-pattern. The agent exits early because it misreads the response type; the fix is to inspect stop_reason, not to cap iterations.
- **B** (correct): The stop_reason field is the deterministic, authoritative signal for loop control. Claude can return text alongside tool_use blocks, so checking content type is unreliable.
- **C** (incorrect): Natural language parsing is ambiguous and unreliable. The stop_reason field already provides an unambiguous signal.
- **D** (incorrect): This forces tool use even when the agent is genuinely finished, creating an infinite loop rather than fixing the detection logic.

</details>

---

### Q002 (q-1-2-001) — single-choice

**Task statement:** 1.2 orchestration-patterns / decomposition · **Difficulty:** application · scenario: s2

**A multi-agent research system produces a report on 'renewable energy technologies' that only covers solar and wind, missing geothermal, tidal, biomass, and nuclear fusion. Each subagent produced thorough coverage of its assigned topic. Where is the root cause?**

　 **A.** The web search subagent scoped its queries too narrowly, so geothermal, tidal, biomass and fusion never surfaced in the results it returned.

　 **B.** The synthesis subagent failed to audit its inputs for coverage gaps, so it wrote up solar and wind as though they were the whole field.

✅ **[CORRECT]** **C.** The coordinator's task decomposition assigned only solar and wind, omitting the other renewable categories.

　 **D.** The document analysis subagent lacked access to sources on geothermal, tidal, biomass, and fusion, so those categories never entered the report.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The coordinator is responsible for decomposing the broad topic into subtopics. If it only assigns solar and wind, no downstream agent can cover the missing categories. Trace failures to their origin.

**Option breakdown:**

- **A** (incorrect): The web search subagent researched what it was assigned, and it returned thorough coverage of that assignment. The issue is what it was assigned, not how narrowly it searched.
- **B** (incorrect): The synthesis agent can only work with the research it receives. A coverage audit would flag the omission, but it cannot synthesise topics that were never researched.
- **C** (correct): The coordinator is responsible for decomposing the broad topic into subtopics. If it only assigns solar and wind, no downstream agent can cover the missing categories. Trace failures to their origin.
- **D** (incorrect): Source availability is not the root cause. The coordinator never asked any agent to research geothermal, tidal, biomass, or fusion, so no fix to source access would help.

</details>

---

### Q003 (q-1-3-001) — single-choice

**Task statement:** 1.3 subagent-invocation-context / structured-metadata · **Difficulty:** application · scenario: s2

**A synthesis agent produces a report with several claims that have no source attribution. The web search and document analysis subagents are working correctly and returning well-sourced results. What is the most likely root cause?**

　 **A.** The synthesis agent's system prompt does not instruct it to include citations, so it drops source attribution even when given well-sourced input.

✅ **[CORRECT]** **B.** The coordinator passes content to the synthesis agent stripped of structured metadata like source URLs and document names.

　 **C.** The web search subagent returns prose summaries rather than a structured citation format the synthesis agent can turn into attributions.

　 **D.** The synthesis agent has no direct web search access, so it cannot re-fetch the sources behind the claims it has been asked to write up.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Context passing must include structured data that separates content from metadata. Without source URLs and document names, the synthesis agent has no attribution information to include.

**Option breakdown:**

- **A** (incorrect): Even with a citation instruction, the synthesis agent cannot attribute claims to sources that were never passed to it. The lesson is explicit: do not blame the synthesis prompt; the root cause is the coordinator dropping structured metadata.
- **B** (correct): Context passing must include structured data that separates content from metadata. Without source URLs and document names, the synthesis agent has no attribution information to include.
- **C** (incorrect): The web search subagent is working correctly and returns well-sourced results. The issue is how the coordinator passes those results to the synthesis agent, not the shape the subagent emits.
- **D** (incorrect): Giving the synthesis agent web search tools violates the principle of scoped tool access, and re-fetching is not the fix. The coordinator is dropping attribution metadata it already holds.

</details>

---

### Q004 (q-1-4-001) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / prerequisite-gates · **Difficulty:** application · scenario: s1

**Production data shows that in 8% of cases, a customer support agent processes refunds without verifying account ownership, occasionally leading to refunds on wrong accounts. What is the most appropriate fix?**

✅ **[CORRECT]** **A.** Implement a programmatic prerequisite gate that blocks process_refund until get_customer has returned a verified customer ID

　 **B.** Add stronger instructions to the system prompt emphasising the importance of verification before refunds

　 **C.** Add few-shot examples showing the correct verification-then-refund workflow

　 **D.** Implement a routing classifier that sends refund requests to a specialised verification pipeline

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Financial operations require deterministic enforcement. A prerequisite gate physically prevents the refund tool from executing until identity verification is complete, eliminating the 8% failure rate entirely.

**Option breakdown:**

- **A** (correct): Financial operations require deterministic enforcement. A prerequisite gate physically prevents the refund tool from executing until identity verification is complete, eliminating the 8% failure rate entirely.
- **B** (incorrect): The current system prompt already instructs verification but fails 8% of the time. Enhanced prompts reduce but do not eliminate the failure rate. Financial operations require deterministic guarantees.
- **C** (incorrect): Few-shot examples improve consistency but still have a non-zero failure rate. For financial operations, probabilistic improvements are insufficient.
- **D** (incorrect): A routing classifier handles request routing, not per-agent workflow enforcement. The issue is within the agent's execution sequence, not how requests reach it.

</details>

---

### Q005 (q-1-5-001) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / pretooluse-enforcement · **Difficulty:** scenario-analysis · scenario: s1

**An agent occasionally processes international transfers without required compliance checks. The compliance team requires 100% enforcement of anti-money laundering (AML) checks before any international transfer. What is the correct approach?**

　 **A.** Add detailed AML check instructions to the system prompt with examples of correct behaviour

✅ **[CORRECT]** **B.** Implement a PreToolUse hook that blocks transfer execution until AML verification returns a pass result

　 **C.** Add a PostToolUse hook to flag completed transfers that skipped AML checks

　 **D.** Train the agent with few-shot examples showing the correct AML verification workflow

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A hook intercepts the outgoing tool call before execution and physically blocks it until the compliance check passes. This provides the deterministic guarantee that AML rules require.

**Option breakdown:**

- **A** (incorrect): Prompt instructions provide probabilistic compliance. With international transfers and AML regulations, a single failure could result in legal penalties. 100% enforcement requires deterministic guarantees.
- **B** (correct): A hook intercepts the outgoing tool call before execution and physically blocks it until the compliance check passes. This provides the deterministic guarantee that AML rules require.
- **C** (incorrect): PostToolUse hooks run after execution. By the time the hook fires, the non-compliant transfer has already been processed. Prevention is required, not detection.
- **D** (incorrect): Few-shot examples improve accuracy but do not guarantee 100% compliance. Regulatory requirements demand deterministic enforcement via hooks.

</details>

---

### Q006 (q-1-6-001) — single-choice

**Task statement:** 1.6 task-decomposition / attention-dilution · **Difficulty:** scenario-analysis · scenario: s2

**A code review agent processes 14 files and produces detailed feedback for the first 5 files but misses obvious bugs in files 10-14. It also flags a pattern as problematic in one file while approving identical code in another. What is the root cause and solution?**

　 **A.** The model's context window is too small — upgrade to a model with a larger context window

✅ **[CORRECT]** **B.** Split the review into per-file local analysis passes plus a separate cross-file integration pass

　 **C.** Add a stronger system prompt emphasising the importance of reviewing all files equally

　 **D.** Reduce the number of files reviewed per run to 5 and process in batches

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Multi-pass architecture solves attention dilution. Per-file passes ensure consistent depth for each file. The cross-file integration pass catches data flow issues and ensures consistent pattern evaluation.

**Option breakdown:**

- **A** (incorrect): Context window size is not the issue. Attention dilution occurs because processing too many items in a single pass produces inconsistent depth, regardless of window size.
- **B** (correct): Multi-pass architecture solves attention dilution. Per-file passes ensure consistent depth for each file. The cross-file integration pass catches data flow issues and ensures consistent pattern evaluation.
- **C** (incorrect): Prompt improvements do not solve attention dilution. The fundamental issue is processing too many items in a single pass, which is an architectural problem requiring a structural solution.
- **D** (incorrect): Batching is closer to the right idea but misses the cross-file integration pass. Without it, cross-file data flow issues and pattern consistency are not addressed.

</details>

---

### Q007 (q-1-7-001) — single-choice

**Task statement:** 1.7 session-state-resumption / fresh-start · **Difficulty:** scenario-analysis · scenario: s2

**A developer resumes a Claude Code session after modifying 3 files in a 50-file codebase. The agent gives contradictory advice about the modified files because it is reasoning from stale tool results. What is the correct approach?**

　 **A.** Start a completely new session and have the agent re-analyse all 50 files from scratch so nothing stale survives into the new context.

　 **B.** Resume the session and ask the agent to re-read only the 3 modified files, overwriting the stale results already in the context window.

✅ **[CORRECT]** **C.** Start a fresh session with an injected summary of prior findings, noting the 3 changed files for targeted re-analysis.

　 **D.** Use fork_session to branch the session so the new branch picks up the 3 changed files while the original keeps the earlier state.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A fresh session with summary injection avoids stale tool results. Specifying the 3 changed files enables targeted re-analysis without wasting time on unchanged files.

**Option breakdown:**

- **A** (incorrect): Re-analysing all 50 files is wasteful when only 3 changed. A fresh session with summary injection plus targeted re-reading of the 3 changed files is more efficient.
- **B** (incorrect): Resuming preserves the stale tool results in context, and a later read does not overwrite an earlier one. The agent may still reason from outdated information for other decisions. A fresh start with summary injection is more reliable.
- **C** (correct): A fresh session with summary injection avoids stale tool results. Specifying the 3 changed files enables targeted re-analysis without wasting time on unchanged files.
- **D** (incorrect): fork_session creates an independent exploration branch from a shared baseline, and that baseline still carries the stale results. It is for divergent approaches, not for updating stale context after file changes.

</details>

---

### Q008 (q-1-1-002) — single-choice

**Task statement:** 1.1 agentic-loops / anti-patterns · **Difficulty:** scenario-analysis · scenario: s1

**A customer support agent runs to its `max_iterations=10` cap on every request, even simple ones. Logs show stop_reason returns 'end_turn' after the third iteration, but the loop ignores it and uses the iteration count as its primary termination signal. What architectural change resolves this?**

　 **A.** Increase the iteration cap to 20 so the agent has more room to work on complex requests

　 **B.** Lower the iteration cap (for example to 3) so the loop is forced to terminate earlier on simple requests

✅ **[CORRECT]** **C.** Make stop_reason the primary loop control; keep the iteration cap only as a safety backstop, not the main stop.

　 **D.** Parse the agent's response text after each iteration to detect phrases like 'task complete' and terminate early when found

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The stop_reason field is the authoritative signal for loop control. The loop should exit on 'end_turn' and continue on 'tool_use'. An iteration cap can remain as a safety net for edge cases, but must not be the primary stopping mechanism, which is the anti-pattern causing unnecessary iterations here.

**Option breakdown:**

- **A** (incorrect): Increasing the cap does not address the root cause. The agent already finishes simple tasks by iteration 3 (stop_reason is 'end_turn') but the loop ignores this signal and keeps running. A higher cap would waste even more iterations.
- **B** (incorrect): This keeps the iteration count as the primary termination signal, which is the anti-pattern itself. Hard-coding a lower cap happens to fit this simple case but truncates genuinely complex requests that legitimately need more iterations, and it still ignores the stop_reason field that already reports completion. The fix is to make stop_reason the control signal, not to retune the cap.
- **C** (correct): The stop_reason field is the authoritative signal for loop control. The loop should exit on 'end_turn' and continue on 'tool_use'. An iteration cap can remain as a safety net for edge cases, but must not be the primary stopping mechanism, which is the anti-pattern causing unnecessary iterations here.
- **D** (incorrect): Parsing natural language for completion signals is an anti-pattern. The model may use such phrases while still having tool calls queued, and may complete work without such phrases. The stop_reason field already provides a deterministic, unambiguous signal.

</details>

---

### Q009 (q-1-2-002) — single-choice

**Task statement:** 1.2 orchestration-patterns / coordinator · **Difficulty:** application · scenario: s2

**A consulting firm's multi-agent research system has a coordinator that always invokes the full pipeline of five subagents (web search, document analysis, data extraction, synthesis, and formatting) for every query, including simple factual lookups that only need web search. This adds unnecessary latency and cost. What is the correct architectural fix?**

✅ **[CORRECT]** **A.** Have the coordinator select which subagents to invoke per query, not always the full pipeline.

　 **B.** Allow subagents to communicate directly with each other so they can skip unnecessary steps in the pipeline

　 **C.** Add a caching layer in front of the pipeline so subagents with no work to do return a cached empty result immediately.

　 **D.** Split into two separate systems: one for simple queries and one for complex queries

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The coordinator should analyse query requirements and decide which subagents are needed. A simple factual lookup only needs the web search agent, not the full five-agent pipeline. Dynamic selection reduces latency and cost for straightforward requests.

**Option breakdown:**

- **A** (correct): The coordinator should analyse query requirements and decide which subagents are needed. A simple factual lookup only needs the web search agent, not the full five-agent pipeline. Dynamic selection reduces latency and cost for straightforward requests.
- **B** (incorrect): Direct subagent communication violates the hub-and-spoke architecture. All communication must flow through the coordinator. The fix is smarter coordinator routing, not bypassing the coordinator.
- **C** (incorrect): Caching does not address the architectural issue. Invoking subagents that are not needed adds API call overhead and latency regardless of whether results are cached. The coordinator should not invoke unnecessary subagents in the first place.
- **D** (incorrect): Maintaining two separate systems creates unnecessary complexity. The coordinator's role is precisely to analyse query requirements and make routing decisions. A single coordinator with dynamic selection handles both cases.

</details>

---

### Q010 (q-1-3-002) — single-choice

**Task statement:** 1.3 subagent-invocation-context / parallel-spawning · **Difficulty:** scenario-analysis · scenario: s2

**A multi-agent research system has a coordinator that spawns a web search subagent and a document analysis subagent sequentially across separate API turns. The web search completes in 8 seconds and the document analysis completes in 12 seconds, giving a total latency of 20 seconds. The two subagents are investigating independent topics and do not depend on each other's results. How should the architect reduce this latency?**

　 **A.** Merge the web search and document analysis into a single subagent to reduce coordination overhead

✅ **[CORRECT]** **B.** Have the coordinator emit both Task tool calls in a single response to spawn both subagents in parallel, reducing total latency to roughly 12 seconds

　 **C.** Allow the web search subagent to directly invoke the document analysis subagent after it finishes, removing the coordinator round-trip

　 **D.** Use fork_session to split the coordinator into two parallel branches, one for each subagent

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When subagents investigate independent topics, the coordinator can emit multiple Task tool calls in a single response. Both subagents run concurrently, so total latency is determined by the slower one (12 seconds) rather than the sum (20 seconds).

**Option breakdown:**

- **A** (incorrect): Merging agents violates the principle of specialised subagents with scoped tool access. It also does not reduce total processing time — the merged agent still needs to do both tasks, and loses the benefit of parallel execution.
- **B** (correct): When subagents investigate independent topics, the coordinator can emit multiple Task tool calls in a single response. Both subagents run concurrently, so total latency is determined by the slower one (12 seconds) rather than the sum (20 seconds).
- **C** (incorrect): Direct subagent communication violates the hub-and-spoke architecture where all communication flows through the coordinator. This also would not achieve parallel execution — it would still be sequential.
- **D** (incorrect): fork_session is for divergent exploration of the same problem from a shared baseline, not for parallel subagent invocation. Emitting multiple Task tool calls in a single coordinator response is the correct mechanism for spawning concurrent subagents.

</details>

---

### Q011 (q-1-4-002) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / handoff-protocols · **Difficulty:** application · scenario: s1

**A customer support agent needs to escalate a complex billing dispute to a human agent. The AI agent compiles a handoff that includes the conversation summary and recommended action, but the human agent reports they cannot effectively resolve the issue because critical information is missing. Which missing element is most likely causing the problem?**

　 **A.** The handoff is missing the AI agent's confidence score for its recommendation

　 **B.** The handoff is missing the full conversation transcript so the human agent can review exact customer messages

✅ **[CORRECT]** **C.** The handoff omits the customer ID and root cause, so the human cannot open the account or grasp the issue.

　 **D.** The handoff should include links to internal knowledge base articles about the billing issue

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A structured handoff must include: customer ID, conversation summary, root cause analysis, refund amount (if applicable), and recommended action. Without the customer ID, the human agent cannot access the account. Without root cause analysis, they cannot understand the underlying problem. The human agent lacks the conversation transcript, so the handoff must be self-contained.

**Option breakdown:**

- **A** (incorrect): Confidence scores are not part of the required handoff protocol. The structured handoff requires customer ID, conversation summary, root cause analysis, refund amount if applicable, and recommended action.
- **B** (incorrect): The handoff protocol explicitly accounts for the fact that human agents do NOT have access to the conversation transcript. The handoff summary must be self-contained, not reliant on a transcript.
- **C** (correct): A structured handoff must include: customer ID, conversation summary, root cause analysis, refund amount (if applicable), and recommended action. Without the customer ID, the human agent cannot access the account. Without root cause analysis, they cannot understand the underlying problem. The human agent lacks the conversation transcript, so the handoff must be self-contained.
- **D** (incorrect): Knowledge base links are not part of the structured handoff protocol. The human agent needs the customer ID, root cause analysis, and other required fields to effectively resolve the escalation.

</details>

---

### Q012 (q-1-5-002) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / posttooluse-normalisation · **Difficulty:** application · scenario: s1

**A customer support agent integrates with three different backend systems via MCP tools. One system returns dates as Unix timestamps, another returns ISO 8601 strings, and the third returns dates in 'DD/MM/YYYY' format. The agent occasionally misinterprets dates, leading to incorrect order lookup results. What is the correct fix?**

　 **A.** Add instructions to the system prompt explaining the three date formats and how to interpret each one

　 **B.** Standardise the backend APIs to all return the same date format

　 **C.** Implement a PreToolUse hook that converts all dates to ISO 8601 before passing them to the tools

✅ **[CORRECT]** **D.** Implement a PostToolUse hook that normalises all date formats to ISO 8601 before the model processes the results

<details><summary><b>Answer</b>: D</summary>

**Rationale:** PostToolUse hooks intercept tool results after execution but before the model processes them. Converting all dates to a consistent ISO 8601 format ensures the model receives clean, unambiguous data regardless of which backend system produced it. This is the canonical use case for PostToolUse hooks.

**Option breakdown:**

- **A** (incorrect): Relying on the model to correctly interpret heterogeneous formats is unreliable. The model may confuse DD/MM/YYYY with MM/DD/YYYY or miscalculate Unix timestamps. Data normalisation should happen deterministically, not probabilistically.
- **B** (incorrect): While ideal, modifying three separate backend systems is often impractical and outside the agent architect's control. The Agent SDK provides PostToolUse hooks precisely for normalising heterogeneous outputs without modifying upstream systems.
- **C** (incorrect): PreToolUse hooks intercept outgoing calls before execution, not incoming results. Date normalisation needs to happen on tool results after execution. The correct hook type is PostToolUse, not PreToolUse.
- **D** (correct): PostToolUse hooks intercept tool results after execution but before the model processes them. Converting all dates to a consistent ISO 8601 format ensures the model receives clean, unambiguous data regardless of which backend system produced it. This is the canonical use case for PostToolUse hooks.

</details>

---

### Q013 (q-1-6-002) — single-choice

**Task statement:** 1.6 task-decomposition / adaptive-decomposition · **Difficulty:** application · scenario: s2

**A consulting firm needs an agent to add a comprehensive test suite to a large legacy codebase. The codebase has no existing tests, unclear dependencies between modules, and the team does not know which areas are most critical. Which task decomposition strategy is most appropriate?**

　 **A.** A fixed sequential pipeline that reviews each file in alphabetical order and generates tests for each one

　 **B.** A single-pass analysis that processes the entire codebase at once and generates a complete test plan

✅ **[CORRECT]** **C.** Dynamic adaptive decomposition: map the codebase, find the high-impact areas, and adapt the plan as dependencies emerge.

　 **D.** A multi-pass architecture with per-file analysis and a cross-file integration pass, exactly like a standard code review pipeline.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Adding tests to a legacy codebase with unknown dependencies is an open-ended investigation task. Dynamic adaptive decomposition generates subtasks based on what is discovered at each step — first mapping the structure, then identifying critical areas, then adapting the test plan as dependency relationships emerge.

**Option breakdown:**

- **A** (incorrect): Fixed sequential pipelines are best for predictable, structured tasks. Adding tests to a legacy codebase with unclear dependencies is an open-ended investigation that requires adaptive exploration to discover which areas are most critical and how dependencies affect test design.
- **B** (incorrect): A single-pass analysis of a large codebase would suffer from attention dilution, producing inconsistent coverage. Additionally, a single pass cannot adapt to discoveries about dependencies and critical areas that emerge during exploration.
- **C** (correct): Adding tests to a legacy codebase with unknown dependencies is an open-ended investigation task. Dynamic adaptive decomposition generates subtasks based on what is discovered at each step — first mapping the structure, then identifying critical areas, then adapting the test plan as dependency relationships emerge.
- **D** (incorrect): Multi-pass architecture solves attention dilution for review tasks, but test generation in a legacy codebase needs adaptive exploration: discovering critical modules and dependencies and prioritising coverage. The decomposition must adapt to findings, not follow a fixed per-file pattern.

</details>

---

### Q014 (q-1-7-002) — single-choice

**Task statement:** 1.7 session-state-resumption / fork-session · **Difficulty:** scenario-analysis · scenario: s2

**A research team is using Claude Code to analyse a large dataset. After completing an initial analysis, they want to explore two competing hypotheses: one using a statistical modelling approach and another using a machine learning approach. Both explorations should start from the same baseline analysis but proceed independently. Which session management strategy is correct?**

　 **A.** Resume the session twice with --resume, once for each hypothesis, running them one after the other

　 **B.** Start two fresh sessions, each with an injected summary of the initial analysis, and explore one hypothesis in each

　 **C.** Use the initial session and explore both hypotheses sequentially, asking the agent to set aside the first approach before starting the second

✅ **[CORRECT]** **D.** Use fork_session to create two independent branches from the shared analysis baseline, exploring one hypothesis in each fork

<details><summary><b>Answer</b>: D</summary>

**Rationale:** fork_session creates independent branches from a shared baseline, which is exactly the use case here. Both forks start from the complete initial analysis but proceed independently. Neither exploration contaminates the other, enabling a clean comparison of the two approaches.

**Option breakdown:**

- **A** (incorrect): Resuming the same session twice would mean the second resume inherits context from the first hypothesis exploration, contaminating the independent baseline. Each hypothesis needs to diverge from the original analysis, not from each other.
- **B** (incorrect): While this avoids context contamination, it loses the full richness of the original analysis context. Fresh start with summary injection is best when tool results are stale. Here, the baseline analysis is still valid and both branches should start from the complete shared baseline.
- **C** (incorrect): Sequential exploration in the same session means the second hypothesis is influenced by the first — the agent carries context, conclusions, and biases from the first exploration. Independent exploration requires isolated branches.
- **D** (correct): fork_session creates independent branches from a shared baseline, which is exactly the use case here. Both forks start from the complete initial analysis but proceed independently. Neither exploration contaminates the other, enabling a clean comparison of the two approaches.

</details>

---

### Q015 (q-1-3-003) — single-choice

**Task statement:** 1.3 subagent-invocation-context / agent-tool · **Difficulty:** application · scenario: s1

**A coordinator agent should spawn specialist subagents for billing disputes and technical issues. Its system prompt describes the delegation workflow correctly, yet when it tries to invoke a subagent nothing happens: no subagent is created and no related error is thrown. What is the most likely cause?**

✅ **[CORRECT]** **A.** The coordinator's allowedTools list does not include the Task tool (renamed Agent in current Claude Code), so it cannot spawn subagents.

　 **B.** The subagent's AgentDefinition is missing a description field, preventing it from being invoked

　 **C.** The coordinator needs to pass the full conversation history to the subagent for it to initialise properly

　 **D.** Subagents must be registered in a central agent registry that the coordinator loads at startup, and until they are, no Task call can resolve them.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The Task tool is the mechanism for spawning subagents. If 'Task' (or its current alias 'Agent') is not in the coordinator's allowedTools, it physically cannot create subagents regardless of what the system prompt instructs. This is a configuration issue, not a prompt issue.

**Option breakdown:**

- **A** (correct): The Task tool is the mechanism for spawning subagents. If 'Task' (or its current alias 'Agent') is not in the coordinator's allowedTools, it physically cannot create subagents regardless of what the system prompt instructs. This is a configuration issue, not a prompt issue.
- **B** (incorrect): A missing AgentDefinition description would cause issues with the subagent's behaviour, but the problem here is that the coordinator cannot invoke the spawning mechanism at all. The issue is upstream of any subagent definition.
- **C** (incorrect): Subagents do not inherit the coordinator's conversation history — context must be passed explicitly. However, this is not the cause of the failure to spawn. The fundamental issue is that the coordinator lacks the ability to invoke the Task tool.
- **D** (incorrect): There is no requirement for a subagent registry. Subagents are defined via an AgentDefinition and spawned through the Task tool. The real issue is that the coordinator's allowedTools omits 'Task' (or 'Agent').

</details>

---

### Q016 (q-1-4-003) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / multi-concern · **Difficulty:** scenario-analysis · scenario: s1

**A financial services company's customer support agent receives a request: 'I was charged twice for my subscription, and I also need to update my billing address.' The agent processes the address change successfully but only partially investigates the double-charge, providing an incomplete resolution. What architectural pattern should be applied to handle this correctly?**

　 **A.** Add a system prompt instruction telling the agent to address all customer concerns before responding

　 **B.** Route the request to two separate specialised agents — one for billing disputes and one for address changes

✅ **[CORRECT]** **C.** Decompose the request into items, investigate each in parallel with shared context, then synthesise a unified resolution.

　 **D.** Process the concerns sequentially — complete the address change first, then investigate the double-charge in a follow-up interaction

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Multi-concern request decomposition breaks the compound request into distinct items, investigates each in parallel using shared context (the customer's account), and synthesises a unified resolution that addresses all concerns. This ensures no concern is dropped or partially addressed.

**Option breakdown:**

- **A** (incorrect): Prompt-based guidance has a non-zero failure rate. Multi-concern decomposition is an architectural pattern, not a prompting issue. The agent needs a structured approach to identifying and tracking multiple concerns.
- **B** (incorrect): Splitting the request across agents adds coordination overhead and may lose the shared context between the two issues. The correct pattern is multi-concern decomposition within the agent's workflow, investigating each issue in parallel with shared context.
- **C** (correct): Multi-concern request decomposition breaks the compound request into distinct items, investigates each in parallel using shared context (the customer's account), and synthesises a unified resolution that addresses all concerns. This ensures no concern is dropped or partially addressed.
- **D** (incorrect): Sequential processing across separate interactions is a poor customer experience and risks the second concern being lost. The agent should decompose, investigate in parallel, and provide a unified resolution in a single interaction.

</details>

---

### Q017 (q-1-1-003) — single-choice

**Task statement:** 1.1 agentic-loops / lifecycle · **Difficulty:** recall · scenario: s1

**What value of stop_reason indicates that Claude has finished its task and no more tool calls are needed?**

　 **A.** stop_reason='complete'

✅ **[CORRECT]** **B.** stop_reason='end_turn'

　 **C.** stop_reason='tool_use'

　 **D.** stop_reason='max_tokens'

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When stop_reason is 'end_turn', Claude has determined it has completed its task and does not need to make any further tool calls. This is the authoritative termination signal for agentic loops.

**Option breakdown:**

- **A** (incorrect): 'complete' is not a valid stop_reason value in the Claude API. The correct signal for task completion is 'end_turn'.
- **B** (correct): When stop_reason is 'end_turn', Claude has determined it has completed its task and does not need to make any further tool calls. This is the authoritative termination signal for agentic loops.
- **C** (incorrect): 'tool_use' indicates the opposite — Claude wants to call a tool, meaning the loop should continue, not terminate.
- **D** (incorrect): 'max_tokens' means the response stopped because it hit the token limit, so the output is truncated, not complete. The completion signal is 'end_turn'.

</details>

---

### Q018 (q-1-1-004) — single-choice

**Task statement:** 1.1 agentic-loops / anti-patterns · **Difficulty:** recall · scenario: s1

**In an agentic loop, what is the primary role of an iteration cap?**

　 **A.** It serves as the primary mechanism for determining when the agent has completed its task

✅ **[CORRECT]** **B.** It acts as a safety net to prevent runaway loops, not as the primary loop control mechanism

　 **C.** It optimises token usage by limiting the number of API calls per request

　 **D.** It determines the maximum number of tools the agent can call during a single iteration

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Iteration caps are safety backstops that prevent infinite loops in edge cases. The primary loop control should be stop_reason inspection. The cap catches situations where the agent gets stuck or stop_reason is never 'end_turn'.

**Option breakdown:**

- **A** (incorrect): Using an iteration cap as the primary termination mechanism is an anti-pattern. The agent may finish early (wasting iterations) or need more iterations (truncating work). The primary control should be stop_reason.
- **B** (correct): Iteration caps are safety backstops that prevent infinite loops in edge cases. The primary loop control should be stop_reason inspection. The cap catches situations where the agent gets stuck or stop_reason is never 'end_turn'.
- **C** (incorrect): While iteration caps do indirectly limit API calls, their purpose is safety, not optimisation. Cost control is a secondary benefit, not the primary design intent.
- **D** (incorrect): An iteration cap limits the number of loop cycles, not the number of tools per cycle. Claude can call multiple tools in a single iteration. These are different concepts.

</details>

---

### Q019 (q-1-2-003) — single-choice

**Task statement:** 1.2 orchestration-patterns / hub-and-spoke · **Difficulty:** recall · scenario: s2

**In a hub-and-spoke orchestration pattern, how does inter-agent communication flow?**

　 **A.** Each subagent communicates directly with every other subagent as needed

✅ **[CORRECT]** **B.** All communication flows through the coordinator — subagents never communicate directly with each other

　 **C.** Subagents pass results to the next agent in a predefined sequence, forming a chain

　 **D.** Subagents share a common message bus that all agents read from and write to

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Hub-and-spoke means the coordinator (hub) mediates all communication. Subagents (spokes) send results only to the coordinator, which then routes information to other subagents as needed. This maintains clear control flow and context management.

**Option breakdown:**

- **A** (incorrect): Direct subagent communication is a mesh pattern, not hub-and-spoke. In hub-and-spoke, subagents never communicate directly with each other.
- **B** (correct): Hub-and-spoke means the coordinator (hub) mediates all communication. Subagents (spokes) send results only to the coordinator, which then routes information to other subagents as needed. This maintains clear control flow and context management.
- **C** (incorrect): Sequential chaining describes a pipeline pattern, not hub-and-spoke. In hub-and-spoke, the coordinator decides routing dynamically rather than following a fixed sequence.
- **D** (incorrect): A shared message bus is a publish-subscribe pattern. Hub-and-spoke uses a central coordinator for all routing, not a shared bus.

</details>

---

### Q020 (q-1-5-011) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / posttooluse-hooks · **Difficulty:** recall · scenario: s1

**Which hook type runs after a tool has executed but before the model processes the results?**

　 **A.** PreToolUse

✅ **[CORRECT]** **B.** PostToolUse

　 **C.** PreModelCall

　 **D.** OnToolComplete

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PostToolUse hooks run after a tool has executed and returned its results, but before those results are passed to the model for processing. This makes them ideal for normalisation, logging, and result transformation.

**Option breakdown:**

- **A** (incorrect): PreToolUse hooks intercept tool calls before execution. They run before the tool executes, not after. Their purpose is prevention and validation of outgoing calls.
- **B** (correct): PostToolUse hooks run after a tool has executed and returned its results, but before those results are passed to the model for processing. This makes them ideal for normalisation, logging, and result transformation.
- **C** (incorrect): PreModelCall is not the specific hook type for post-tool-execution processing. PostToolUse is the correct hook that intercepts results between tool execution and model processing.
- **D** (incorrect): OnToolComplete is not a standard hook type in the Claude Agent SDK. The correct hook for post-execution, pre-model processing is PostToolUse.

</details>

---

### Q021 (q-1-3-012) — single-choice

**Task statement:** 1.3 subagent-invocation-context / scoped-tools · **Difficulty:** recall · scenario: s2

**In the Claude Agent SDK, what is the purpose of the tools property in an AgentDefinition?**

　 **A.** It lists every tool available across the whole system so the agent can see the full catalogue and pick whichever it decides it needs.

✅ **[CORRECT]** **B.** It restricts the agent to a scoped set of tools, limiting the agent to what its role actually needs.

　 **C.** It defines the order in which the agent must call its tools, so the loop follows a fixed sequence rather than reasoning about what to call next.

　 **D.** It specifies which of the agent's tools require human approval before execution, and it is the permission gate for destructive operations.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The tools property enforces scoped tool access: it controls which tools this agent can reach. Keeping that set small and role-focused prevents agents from using tools outside their specialisation and reduces the chance of unintended actions. The guide illustrates the point by contrasting 4–5 tools with 18, where selection reliability degrades.

**Option breakdown:**

- **A** (incorrect): The tools property does not catalogue the whole system's tools. It restricts which tools this particular agent can access, enforcing scoped tool access.
- **B** (correct): The tools property enforces scoped tool access: it controls which tools this agent can reach. Keeping that set small and role-focused prevents agents from using tools outside their specialisation and reduces the chance of unintended actions. The guide illustrates the point by contrasting 4–5 tools with 18, where selection reliability degrades.
- **C** (incorrect): The tools property does not dictate execution order. It only controls which tools the agent can access. Tool calling order is determined by the agent's reasoning within its loop.
- **D** (incorrect): Human approval workflows are handled by separate mechanisms, not by the tools property, which controls tool availability, not approval requirements.

</details>

---

### Q022 (q-1-3-014) — single-choice

**Task statement:** 1.3 subagent-invocation-context / memory-isolation · **Difficulty:** recall · scenario: s2

**In a multi-agent system using the coordinator pattern, what happens to a subagent's memory when it completes its task?**

　 **A.** The subagent's memory is automatically merged into the coordinator's context

　 **B.** The subagent's memory is preserved and shared with all other subagents for future reference

✅ **[CORRECT]** **C.** The subagent's internal memory is not shared — only the results it explicitly returns are available to the coordinator

　 **D.** The subagent's memory is stored in a global context that persists across all sessions

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Subagents do not share memory. When a subagent completes, only the explicit output it returns is passed back to the coordinator. The internal reasoning and context remain isolated and are not visible to the coordinator or other subagents, so the coordinator must pass any relevant context explicitly to subagents that need it.

**Option breakdown:**

- **A** (incorrect): Subagent memory is not automatically merged. Subagents do not share memory with the coordinator or other subagents. Only the explicit return value from the subagent's task is passed back.
- **B** (incorrect): Subagents are memory-isolated. They do not share memory with each other. Each subagent has its own independent context that is not accessible to other subagents.
- **C** (correct): Subagents do not share memory. When a subagent completes, only the explicit output it returns is passed back to the coordinator. The internal reasoning and context remain isolated and are not visible to the coordinator or other subagents, so the coordinator must pass any relevant context explicitly to subagents that need it.
- **D** (incorrect): There is no global persistent context shared across all subagents. Subagents are memory-isolated — each runs in its own context that is not accessible to other subagents or the coordinator.

</details>

---

### Q023 (q-1-7-003) — single-choice

**Task statement:** 1.7 session-state-resumption / fork-session · **Difficulty:** recall · scenario: s2

**What is the purpose of fork_session in Claude Code?**

　 **A.** To snapshot the current session so the developer can roll back to it if a later change to the conversation turns out badly.

✅ **[CORRECT]** **B.** To split a session into independent branches for divergent exploration from a shared baseline.

　 **C.** To resume a previously terminated session and continue it from exactly the point where it stopped, preserving the full prior context.

　 **D.** To merge the transcripts of several parallel subagent sessions into one consolidated conversation for review.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** fork_session creates independent branches from a shared baseline. Each fork starts from the same point but can explore different approaches without contaminating each other. This is used when you want to try competing strategies from the same starting state.

**Option breakdown:**

- **A** (incorrect): fork_session is not a backup mechanism. It creates independent exploration branches for trying different approaches from the same starting point.
- **B** (correct): fork_session creates independent branches from a shared baseline. Each fork starts from the same point but can explore different approaches without contaminating each other. This is used when you want to try competing strategies from the same starting state.
- **C** (incorrect): Resuming a session is done with --resume, not fork_session. fork_session creates new divergent branches; it does not continue an existing session from where it stopped.
- **D** (incorrect): Result merging is the coordinator's responsibility. fork_session creates divergent branches; it does not merge anything.

</details>

---

### Q024 (q-1-4-010) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / handoff-protocols · **Difficulty:** recall · scenario: s1

**In a structured human-in-the-loop handoff, which of the following is a required component of the escalation payload?**

　 **A.** The full conversation transcript between the AI agent and the customer

✅ **[CORRECT]** **B.** Customer ID, conversation summary, root cause analysis, and recommended action

　 **C.** The AI agent's internal reasoning trace showing how it reached its conclusions

　 **D.** A priority score from 1–10 indicating the urgency of the escalation

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A structured handoff must include: customer ID (so the human can access the account), conversation summary (what happened), root cause analysis (why the issue occurred), refund amount if applicable, and recommended action. This makes the handoff self-contained.

**Option breakdown:**

- **A** (incorrect): The handoff protocol assumes the human agent does NOT have access to the conversation transcript. The handoff must be self-contained with a summary, not reliant on a transcript.
- **B** (correct): A structured handoff must include: customer ID (so the human can access the account), conversation summary (what happened), root cause analysis (why the issue occurred), refund amount if applicable, and recommended action. This makes the handoff self-contained.
- **C** (incorrect): Internal reasoning traces are not part of the structured handoff protocol. The human agent needs actionable information (customer ID, root cause, recommendation), not the AI's chain of thought.
- **D** (incorrect): Priority scoring is not part of the structured handoff protocol. The required components are customer ID, conversation summary, root cause analysis, refund amount (if applicable), and recommended action.

</details>

---

### Q025 (q-1-5-012) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / posttooluse-hooks · **Difficulty:** application · scenario: s1

**A customer support agent must redact credit card numbers from its responses before they reach the customer. The current system prompt instructs the agent to replace card numbers with asterisks, but QA testing reveals that 6% of responses still contain unredacted card numbers. What guardrail approach should the architect use?**

　 **A.** Rewrite the system prompt with more explicit redaction instructions and add few-shot examples of correct redaction

✅ **[CORRECT]** **B.** Add a PostToolUse hook that regex-redacts credit card numbers from tool results before the model sees them.

　 **C.** Implement a PreToolUse hook that blocks any tool call containing a credit card number in its parameters

　 **D.** Remove all tools that might return credit card numbers from the agent's allowedTools

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A PostToolUse hook runs deterministic code (regex pattern matching) on tool results before the model sees them. This ensures credit card numbers are redacted with 100% reliability, regardless of model behaviour. This is the correct guardrail for data security requirements.

**Option breakdown:**

- **A** (incorrect): The current prompt already instructs redaction but fails 6% of the time. Strengthening prompts may reduce the failure rate but cannot eliminate it. Leaking credit card numbers is a data security issue that demands deterministic enforcement.
- **B** (correct): A PostToolUse hook runs deterministic code (regex pattern matching) on tool results before the model sees them. This ensures credit card numbers are redacted with 100% reliability, regardless of model behaviour. This is the correct guardrail for data security requirements.
- **C** (incorrect): PreToolUse hooks intercept outgoing tool calls, not incoming results. The credit card numbers appear in tool results (data returned from backend systems), not in tool call parameters. PostToolUse is the correct hook type for redacting data from results.
- **D** (incorrect): Removing tools that return card numbers would eliminate the agent's ability to look up order and payment information, which is core to its customer support function. The correct approach is to keep the tools but redact sensitive data from their results.

</details>

---

### Q026 (q-1-6-007) — single-choice

**Task statement:** 1.6 task-decomposition / coordinator · **Difficulty:** application · scenario: s2

**A multi-agent research system must process a customer's request that involves three sequential stages: data collection, analysis, and report generation. Each stage depends on the output of the previous one. Which orchestration pattern is most appropriate?**

　 **A.** Parallel orchestration — run all three subagents simultaneously to minimise latency

✅ **[CORRECT]** **B.** Pipeline orchestration — pass the output of each stage as input to the next in a defined sequence

　 **C.** Dynamic adaptive decomposition — let the coordinator decide the order at runtime based on query complexity

　 **D.** Hub-and-spoke with all three agents reporting independently to the coordinator

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Pipeline orchestration is the correct pattern for sequential dependencies. Each stage completes before the next begins, with the output of one stage serving as the input to the next. This matches the data collection -> analysis -> report generation dependency chain.

**Option breakdown:**

- **A** (incorrect): Parallel execution requires independent tasks. Here, analysis depends on data collection results and report generation depends on analysis results. Running them simultaneously would mean the analysis agent has no data to analyse.
- **B** (correct): Pipeline orchestration is the correct pattern for sequential dependencies. Each stage completes before the next begins, with the output of one stage serving as the input to the next. This matches the data collection -> analysis -> report generation dependency chain.
- **C** (incorrect): Dynamic adaptive decomposition is for open-ended investigation tasks where the next step depends on discoveries. Here, the three stages and their dependencies are known in advance, making a fixed pipeline the more predictable and efficient choice.
- **D** (incorrect): Independent reporting ignores the sequential dependencies. The analysis agent cannot produce meaningful results without data collection output. The pipeline must enforce the execution order.

</details>

---

### Q027 (q-1-3-015) — single-choice

**Task statement:** 1.3 subagent-invocation-context / context-passing · **Difficulty:** application · scenario: s2

**A coordinator spawns a research subagent to investigate market trends. The subagent returns detailed findings. The coordinator then needs to pass these findings to a synthesis subagent for report writing. However, the synthesis subagent produces a report that contradicts the research findings. What is the most likely cause?**

　 **A.** The synthesis subagent has a conflicting system prompt whose instructions override the research data it is handed, replacing it with its own house view of the market.

✅ **[CORRECT]** **B.** The coordinator passes a summary instead of the full structured research output, so the synthesis agent fills gaps from its training data.

　 **C.** The synthesis subagent has its own web search tool and keeps pulling contradictory information from the open web instead of the research it was handed.

　 **D.** The two subagents run different model versions with separate training data, so they draw opposite conclusions from the same market evidence.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Subagents do not share memory. The coordinator must explicitly pass the complete research output to the synthesis agent. If the coordinator only passes a summary, the synthesis agent has no access to the detailed findings and will rely on its training data to fill gaps, potentially contradicting the actual research.

**Option breakdown:**

- **A** (incorrect): While possible, conflicting system prompts would produce consistently wrong outputs across all requests. The more common cause is that the coordinator is not passing the full research output, so the synthesis agent fills gaps with its own training data.
- **B** (correct): Subagents do not share memory. The coordinator must explicitly pass the complete research output to the synthesis agent. If the coordinator only passes a summary, the synthesis agent has no access to the detailed findings and will rely on its training data to fill gaps, potentially contradicting the actual research.
- **C** (incorrect): A synthesis subagent should not have web search tools; that violates scoped tool access. The real issue is that the full research output is not being passed to it, not that it is searching the web.
- **D** (incorrect): Model version differences would not cause contradictions with explicitly provided research data. The issue is that the research data is not being fully passed to the synthesis agent, not that the agents have different base knowledge.

</details>

---

### Q028 (q-1-5-013) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / pretooluse-hooks · **Difficulty:** application · scenario: s4

**A developer-tool agent writes code and runs shell commands. A system prompt instruction ('Do not run destructive commands or access files outside the project') is violated 3% of the time in testing. The team requires this rule to hold absolutely. What should the architect implement?**

　 **A.** Strengthen the system prompt with more specific examples of forbidden commands and add few-shot demonstrations

✅ **[CORRECT]** **B.** PreToolUse hooks that scan shell commands for destructive patterns and validate file paths before execution.

　 **C.** Implement PostToolUse hooks that detect and roll back destructive commands after they execute

　 **D.** Remove the shell execution tool entirely to prevent any possibility of destructive commands

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PreToolUse hooks intercept tool calls before execution. A hook can pattern-match against destructive commands like 'rm -rf' and validate that file paths fall within the project directory, blocking any violation with 100% reliability. This is deterministic enforcement for a safety-critical requirement.

**Option breakdown:**

- **A** (incorrect): The prompt already fails 3% of the time. Strengthening it may reduce the failure rate but cannot eliminate it. Destructive operations require 100% prevention, which only deterministic enforcement can guarantee.
- **B** (correct): PreToolUse hooks intercept tool calls before execution. A hook can pattern-match against destructive commands like 'rm -rf' and validate that file paths fall within the project directory, blocking any violation with 100% reliability. This is deterministic enforcement for a safety-critical requirement.
- **C** (incorrect): PostToolUse hooks run after execution. By the time a PostToolUse hook detects 'rm -rf', the files are already deleted. Destructive commands cannot be reliably rolled back. Prevention via PreToolUse is required, not post-execution detection.
- **D** (incorrect): Removing shell execution eliminates the agent's ability to run any commands, including legitimate ones needed for its development workflow. The correct approach is surgical — block specific dangerous patterns while allowing legitimate usage.

</details>

---

### Q029 (q-1-3-013) — single-choice

**Task statement:** 1.3 subagent-invocation-context / scoped-tools · **Difficulty:** application · scenario: s1

**An architect is designing a customer support system using the Claude Agent SDK. The system needs a coordinator agent that can delegate to a billing specialist and a technical support specialist. Each specialist needs different tools. How should the architect configure the AgentDefinitions?**

　 **A.** Create one AgentDefinition with all tools from both specialists, and use prompt instructions to tell the agent which tools to use in each context

✅ **[CORRECT]** **B.** Create separate AgentDefinitions for each specialist with scoped tools (4–5 tools each), and give the coordinator the Task tool to spawn them

　 **C.** Create the specialists as separate API endpoints and have the coordinator call them via HTTP rather than the Task tool

　 **D.** Give the coordinator all tools and have it handle all requests directly, eliminating the need for subagents

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Each specialist gets its own AgentDefinition with its tools restricted to the 4–5 tools relevant to its role. The coordinator has the Task tool (renamed to Agent in current Claude Code v2.1.63; 'Task' still works as a backward-compatible alias) in its allowedTools so it can spawn specialists. This enforces separation of concerns and scoped tool access.

**Option breakdown:**

- **A** (incorrect): Combining all tools into one agent violates the principle of scoped tool access. With too many tools, the agent is more likely to use the wrong tool. Each specialist should have only the 4–5 tools relevant to its role.
- **B** (correct): Each specialist gets its own AgentDefinition with its tools restricted to the 4–5 tools relevant to its role. The coordinator has the Task tool (renamed to Agent in current Claude Code v2.1.63; 'Task' still works as a backward-compatible alias) in its allowedTools so it can spawn specialists. This enforces separation of concerns and scoped tool access.
- **C** (incorrect): Using HTTP calls instead of the Task tool bypasses the Agent SDK's built-in orchestration capabilities. The Task tool is the designed mechanism for subagent invocation and provides proper context management.
- **D** (incorrect): A single agent with all tools has a higher error rate due to tool selection confusion. Specialist subagents with scoped tools produce more reliable results. As a rough guide, aim for a small set of around 4–5 tools per agent.

</details>

---

### Q030 (q-1-7-004) — single-choice

**Task statement:** 1.7 session-state-resumption / fresh-start · **Difficulty:** application · scenario: s8

**A Claude Code agent has been working on a feature branch for 45 minutes and has accumulated extensive context about the codebase. The developer notices that several tool results from early in the session (file reads from 40 minutes ago) are now stale because a colleague pushed changes to those files. The agent is making recommendations based on the outdated file contents. What is the best recovery strategy?**

　 **A.** Continue in the current session and simply ask the agent to re-read the files a colleague changed, so it picks up the latest contents.

　 **B.** Start a completely new session with no context carried over, so nothing from the previous 45 minutes can contaminate the new reasoning.

✅ **[CORRECT]** **C.** Start a fresh session with a summary of the key findings and decisions, then read the changed files for current state.

　 **D.** Use fork_session to create a new branch that excludes the stale tool results while keeping the rest of the accumulated context.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Fresh start with summary injection is the prescribed recovery strategy for stale tool results. It preserves the valuable insights and decisions from the previous session while eliminating the stale data. Reading the changed files in the new session ensures the agent works from current state.

**Option breakdown:**

- **A** (incorrect): Re-reading updates the file contents, but the stale results remain in the context window. The agent may still reference the outdated content from earlier in the conversation, leading to contradictory reasoning.
- **B** (incorrect): Starting fresh discards 45 minutes of accumulated context and architectural understanding. The agent would need to rediscover all the insights it already found about the codebase.
- **C** (correct): Fresh start with summary injection is the prescribed recovery strategy for stale tool results. It preserves the valuable insights and decisions from the previous session while eliminating the stale data. Reading the changed files in the new session ensures the agent works from current state.
- **D** (incorrect): fork_session creates a branch from the current state, which includes the stale tool results. It does not allow selective exclusion of context. It is designed for divergent exploration, not for stale context recovery.

</details>

---

### Q031 (q-1-5-015) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / pretooluse-enforcement · **Difficulty:** application · scenario: s1

**A customer support agent handles account deletion requests. The company policy requires explicit human approval before any account is permanently deleted. Currently, the agent sometimes processes deletions autonomously when the customer is insistent. What approval mechanism should the architect implement?**

　 **A.** Add a system prompt instruction: 'Always get manager approval before processing account deletions'

✅ **[CORRECT]** **B.** Implement a PreToolUse hook on the delete_account tool that pauses execution and routes the request to a human approval queue before proceeding

　 **C.** Remove the delete_account tool from the agent entirely and require customers to call a separate phone line

　 **D.** Implement a PostToolUse hook that reviews the deletion after it has been processed and reverts it if no approval was recorded

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A PreToolUse hook on the delete_account tool intercepts the call before execution and enforces the human approval requirement deterministically. The deletion cannot proceed until a human explicitly approves it, regardless of how insistent the customer is.

**Option breakdown:**

- **A** (incorrect): Prompt instructions are probabilistic. The question states the agent 'sometimes processes deletions autonomously when the customer is insistent,' showing that prompts alone are insufficient for irreversible operations that require 100% human approval.
- **B** (correct): A PreToolUse hook on the delete_account tool intercepts the call before execution and enforces the human approval requirement deterministically. The deletion cannot proceed until a human explicitly approves it, regardless of how insistent the customer is.
- **C** (incorrect): This creates a poor customer experience and eliminates the agent's ability to facilitate the process. The correct approach is to keep the tool but gate it behind human approval, providing a seamless escalation flow.
- **D** (incorrect): PostToolUse hooks run after execution. Account deletion may be irreversible or difficult to undo. Prevention via a PreToolUse hook is required, not post-execution rollback.

</details>

---

### Q032 (q-1-4-009) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / graceful-degradation · **Difficulty:** scenario-analysis · scenario: s1

**A customer support agent's loop terminates when cumulative token usage exceeds a budget. During a complex billing investigation the budget is exhausted mid-task, after data gathering but before resolution, with stop_reason still `tool_use`. What architectural change addresses this?**

　 **A.** Double the token budget to ensure the agent always has enough tokens to complete complex investigations

✅ **[CORRECT]** **B.** When the budget is nearly gone and stop_reason is still 'tool_use', summarise progress and escalate to a human.

　 **C.** Remove the token budget entirely and rely on the iteration cap alone, so a complex investigation is never cut off mid-task.

　 **D.** Switch to a cheaper model so each iteration uses fewer tokens, letting the agent fit more iterations into the same budget and finish the task.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When constraints prevent completion, the agent should degrade gracefully rather than terminating abruptly. Summarising progress and performing a structured handoff (customer ID, summary, root cause so far, recommended next steps) ensures no work is lost and the human agent can continue from where the AI left off.

**Option breakdown:**

- **A** (incorrect): Doubling the budget is an arbitrary fix that may still be insufficient for edge cases and wastes tokens on simple requests. The fundamental issue is that the budget terminates the loop even when stop_reason indicates the agent has more work to do.
- **B** (correct): When constraints prevent completion, the agent should degrade gracefully rather than terminating abruptly. Summarising progress and performing a structured handoff (customer ID, summary, root cause so far, recommended next steps) ensures no work is lost and the human agent can continue from where the AI left off.
- **C** (incorrect): Removing the token budget eliminates a valuable cost control mechanism. The issue is not having a budget, but how the system handles budget exhaustion during active work.
- **D** (incorrect): A cheaper model may reduce the quality of the investigation itself. The architectural fix is graceful degradation when constraints are reached, not lowering the quality of work to fit within arbitrary limits.

</details>

---

### Q033 (q-1-2-005) — single-choice

**Task statement:** 1.2 orchestration-patterns / coordinator · **Difficulty:** scenario-analysis · scenario: s2

**A research coordinator spawns 4 subagents to investigate different aspects of a market analysis. Agent A fails with an API error, Agent B returns partial results (3 of 5 requested data points), and Agents C and D return complete results. The final report is due in 2 hours. What should the coordinator do?**

　 **A.** Retry Agent A, discard Agent B's partial results as unreliable, and wait for both agents to return fully complete data before writing the report.

　 **B.** Proceed with only Agents C and D's results and produce the report without the data from Agents A and B

✅ **[CORRECT]** **C.** Retry Agent A, incorporate Agent B's partial results, flag B's missing data points as gaps, and synthesise from all available results.

　 **D.** Terminate all agents and restart the entire investigation from scratch with a simplified scope

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The coordinator should maximise data utilisation: retry the failed agent (A), incorporate partial results from B while flagging the 2 missing data points as known gaps, and synthesise all available results from A (after retry), B (partial), C, and D. Explicit gap annotations ensure the report is transparent about its completeness.

**Option breakdown:**

- **A** (incorrect): Discarding Agent B's partial results wastes valid data, and waiting for full completion ignores the two-hour deadline. The coordinator should use what is available while attempting to fill gaps.
- **B** (incorrect): This unnecessarily discards Agent B's partial results and abandons Agent A's scope entirely. A thorough coordinator should attempt recovery while incorporating all available data.
- **C** (correct): The coordinator should maximise data utilisation: retry the failed agent (A), incorporate partial results from B while flagging the 2 missing data points as known gaps, and synthesise all available results from A (after retry), B (partial), C, and D. Explicit gap annotations ensure the report is transparent about its completeness.
- **D** (incorrect): Restarting discards the complete results from Agents C and D and the partial results from Agent B. This wastes time and compute when most of the investigation has already succeeded.

</details>

---

### Q034 (q-1-3-016) — single-choice

**Task statement:** 1.3 subagent-invocation-context / scoped-tools · **Difficulty:** scenario-analysis · scenario: s2

**A coordinator delegates to a data collection agent (`web_search`, `database_query`) and an analysis agent (`calculate`, `chart_generate`). In testing, the analysis agent calls `web_search` directly to fetch extra context, bypassing the data collection agent. What is the architectural violation and how should it be fixed?**

✅ **[CORRECT]** **A.** The analysis agent's allowedTools includes web_search; remove it so only the data collection agent has it.

　 **B.** Add a system prompt instruction telling the analysis agent not to use web_search even though it has access

　 **C.** Allow the analysis agent to keep web_search access since it sometimes needs additional context for better analysis

　 **D.** Implement a PostToolUse hook that logs when the analysis agent uses web_search for monitoring purposes

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Each agent should only have tools relevant to its specific role. The analysis agent should have calculate and chart_generate, not web_search. If the analysis agent needs additional data, it should request it through the coordinator, which then delegates to the data collection agent. This enforces the scoped tool access principle.

**Option breakdown:**

- **A** (correct): Each agent should only have tools relevant to its specific role. The analysis agent should have calculate and chart_generate, not web_search. If the analysis agent needs additional data, it should request it through the coordinator, which then delegates to the data collection agent. This enforces the scoped tool access principle.
- **B** (incorrect): Prompt instructions are probabilistic. The agent is already occasionally using web_search despite the architectural intent. The fix is to remove the tool from allowedTools, providing deterministic enforcement rather than hoping the prompt works.
- **C** (incorrect): This violates scoped tool access and bypasses the data collection agent's role. If the analysis agent needs more data, the correct flow is: analysis agent signals the coordinator, coordinator delegates to the data collection agent, results flow back through the coordinator.
- **D** (incorrect): Logging the violation does not prevent it. The architectural fix is to remove web_search from the analysis agent's allowedTools, not to monitor its misuse.

</details>

---

### Q035 (q-1-7-005) — single-choice

**Task statement:** 1.7 session-state-resumption / fresh-start · **Difficulty:** scenario-analysis · scenario: s8

**A Claude Code agent has spent 30 minutes debugging a failing test suite mid-refactor, trying three different approaches that each modified configuration files. None worked, and its context now holds three sets of conflicting modifications and failed outputs. The developer wants to try a completely different strategy. What session management approach should they use?**

　 **A.** Continue in the current session and ask the agent to ignore all previous attempts and start fresh

　 **B.** Start a completely new session with no prior context at all, re-read the failing tests from scratch, and apply the new strategy fresh.

✅ **[CORRECT]** **C.** Start a fresh session summarising the three failed approaches and why each failed, then pursue the new strategy with clean context.

　 **D.** Use fork_session from the point before the first debugging attempt to explore the new strategy

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Fresh start with summary injection preserves the knowledge of what has been tried (preventing repetition) while eliminating the polluted context from three sets of conflicting file modifications. The agent starts with clean context and the lessons learned from previous attempts.

**Option breakdown:**

- **A** (incorrect): Asking the agent to ignore context is unreliable. The three sets of conflicting modifications and failed outputs remain in the context window, and the model may still reason from them. This is a stale/polluted context problem.
- **B** (incorrect): A completely blank session discards the useful record of what has already been tried and why it failed, which risks repeating failed approaches. Summary injection preserves that knowledge.
- **C** (correct): Fresh start with summary injection preserves the knowledge of what has been tried (preventing repetition) while eliminating the polluted context from three sets of conflicting file modifications. The agent starts with clean context and the lessons learned from previous attempts.
- **D** (incorrect): Forking from 30 minutes ago creates a branch without the knowledge of what was tried and why it failed. The new strategy benefits from knowing that three other approaches failed. Summary injection in a fresh session is more appropriate.

</details>

---

### Q036 (q-1-4-011) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / ambiguity-escalation · **Difficulty:** scenario-analysis · scenario: s1

**An insurance claim agent has gathered all relevant information but the policy language admits two valid interpretations and its confidence is low. With no escalation path, the agent picks one interpretation and proceeds. What architectural improvement is needed?**

　 **A.** Add more insurance policy documents and precedent rulings to the agent's knowledge base so it can resolve the ambiguous wording itself without escalating.

✅ **[CORRECT]** **B.** Detect the genuine ambiguity and escalate to a human claims specialist with a structured handoff of the two interpretations and their evidence.

　 **C.** Have the agent put both readings to the customer and let them choose which interpretation their claim should be assessed under, recording the choice on the file.

　 **D.** Fine-tune a model on insurance policy language so it can resolve contested wording itself, and route only the claims it still cannot read to a human.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When the agent encounters genuine ambiguity that requires human judgment (here, policy language that admits two valid readings), it should escalate with a structured handoff. Policy ambiguity is a guide-endorsed escalation trigger, unlike a raw self-reported confidence score. The escalation payload includes everything the human specialist needs: customer ID, claim summary, both interpretations, and supporting evidence, so the human can decide without re-investigating.

**Option breakdown:**

- **A** (incorrect): More documents do not resolve genuinely ambiguous policy language. When the policy itself can be read two ways, the agent needs a human expert to make the judgment call, not more reference material.
- **B** (correct): When the agent encounters genuine ambiguity that requires human judgment (here, policy language that admits two valid readings), it should escalate with a structured handoff. Policy ambiguity is a guide-endorsed escalation trigger, unlike a raw self-reported confidence score. The escalation payload includes everything the human specialist needs: customer ID, claim summary, both interpretations, and supporting evidence, so the human can decide without re-investigating.
- **C** (incorrect): Customers cannot authoritatively interpret their own insurance policies. Policy interpretation is a specialist function that requires expertise in insurance contract language. This is a human-in-the-loop scenario requiring a specialist, not customer input.
- **D** (incorrect): Fine-tuning may improve accuracy but cannot guarantee correct interpretation of genuinely ambiguous language. Cases that require human judgment should escalate to human experts. The architectural fix is an escalation path, not a more specialised model.

</details>

---

### Q037 (q-1-4-006) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / sequencing · **Difficulty:** scenario-analysis · scenario: s4

**A coordinator using the Claude Agent SDK delegates a refactoring task to a code reviewer, a test generator, and a documentation writer in parallel, all working from the original code. The code reviewer recommends significant changes; once applied, the tests and documentation generated against the old API become invalid. What architectural fix prevents this?**

　 **A.** Have all three agents share memory so they can see each other's outputs in real time

✅ **[CORRECT]** **B.** Run the code reviewer first, then the test generator and doc writer in parallel on the reviewed code.

　 **C.** Add a validation step at the end that checks whether tests and documentation match the final code

　 **D.** Instruct the coordinator to always run the three agents strictly one at a time, in sequence, regardless of whether their tasks actually depend on each other.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The code reviewer's output changes the code that tests and documentation must target. Therefore, the code reviewer must run first. Once the reviewed code is stable, the test generator and documentation writer can run in parallel since they are independent of each other. This is a hybrid pattern: sequential then parallel.

**Option breakdown:**

- **A** (incorrect): Subagents do not share memory — this is a fundamental architectural constraint. Even if they could, real-time sharing would create race conditions and ordering dependencies that are hard to manage.
- **B** (correct): The code reviewer's output changes the code that tests and documentation must target. Therefore, the code reviewer must run first. Once the reviewed code is stable, the test generator and documentation writer can run in parallel since they are independent of each other. This is a hybrid pattern: sequential then parallel.
- **C** (incorrect): Post-hoc validation detects the problem but does not prevent it. The tests and documentation must be rewritten entirely, wasting the initial parallel execution. The correct fix is to order the dependencies properly from the start.
- **D** (incorrect): Always-sequential execution is overly conservative. The test generator and documentation writer do not depend on each other, so they can run in parallel after the code reviewer completes. Parallelise independent tasks while respecting real dependencies.

</details>

---

### Q038 (q-1-3-017) — single-choice

**Task statement:** 1.3 subagent-invocation-context / scoped-tools · **Difficulty:** application · scenario: s2

**A web search agent has 9 tools: `web_search`, `url_fetch`, `html_parse`, `pdf_extract`, `image_ocr`, `translate`, `summarise`, `keyword_extract`, `sentiment_analysis`. In testing it frequently calls `summarise` and `sentiment_analysis` when it should only fetch raw data. How should the architect fix this?**

　 **A.** Add system prompt instructions telling the web search agent to only use data fetching tools and ignore analysis tools

✅ **[CORRECT]** **B.** Reduce the web search agent to the 4-5 data-fetching tools and move the analysis tools to the specialist agents.

　 **C.** Keep all 9 tools but implement PreToolUse hooks that block the web search agent from calling summarise and sentiment_analysis

　 **D.** Merge the web search and synthesis agents into a single agent since they share some tools

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The guide contrasts a focused 4–5-tool agent with an 18-tool one to show how selection reliability degrades as the set grows. The web search agent has 9 tools, causing it to use tools outside its intended role. Reducing to data-fetching tools enforces scoped access. The analysis tools (summarise, sentiment_analysis, keyword_extract) belong with the synthesis or analysis agents.

**Option breakdown:**

- **A** (incorrect): Prompt instructions are probabilistic and the agent is already misusing tools. The architectural fix is to remove the tools it should not have, providing deterministic enforcement through scoped tool access.
- **B** (correct): The guide contrasts a focused 4–5-tool agent with an 18-tool one to show how selection reliability degrades as the set grows. The web search agent has 9 tools, causing it to use tools outside its intended role. Reducing to data-fetching tools enforces scoped access. The analysis tools (summarise, sentiment_analysis, keyword_extract) belong with the synthesis or analysis agents.
- **C** (incorrect): Using hooks to block tool access is an over-engineered workaround for what should be a configuration fix. The proper solution is to remove the tools from allowedTools, not to provide them and then block their use.
- **D** (incorrect): Merging agents violates the principle of specialised subagents. The solution is to separate tools by role, not to combine agents. Merging would create an even larger tool set on a single agent.

</details>

---

### Q039 (q-1-2-006) — single-choice

**Task statement:** 1.2 orchestration-patterns / decomposition · **Difficulty:** scenario-analysis · scenario: s2

**A research system receives a customer query: 'Compare the environmental impact and cost-effectiveness of electric vehicles versus hydrogen fuel cell vehicles for commercial fleet operations.' The fleet manager needs a like-for-like comparison, with each dimension measured consistently across both vehicle types. The coordinator must decide how to decompose this task. Which decomposition strategy is most appropriate?**

　 **A.** Single-agent approach: assign the entire comparison to one research agent with access to all tools

✅ **[CORRECT]** **B.** Parallel tracks by dimension (environmental impact, cost-effectiveness), each covering both vehicle types, then synthesise.

　 **C.** Vehicle-based decomposition: assign one agent to research EVs and another to research hydrogen fuel cells, then merge findings

　 **D.** Dynamic adaptive decomposition: start with a broad search and let the coordinator decide next steps based on what it finds

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The query has two distinct analytical dimensions (environmental impact and cost-effectiveness) applied to the same subjects. Multi-concern decomposition splits these into parallel tracks, each with its own subagent. Both tracks investigate both vehicle types, ensuring consistent comparison methodology. A synthesis step produces the unified comparison.

**Option breakdown:**

- **A** (incorrect): A single agent with all tools violates scoped tool access and would struggle with attention dilution across the multiple dimensions of this comparison (environmental impact, cost-effectiveness, two vehicle types, commercial fleet context).
- **B** (correct): The query has two distinct analytical dimensions (environmental impact and cost-effectiveness) applied to the same subjects. Multi-concern decomposition splits these into parallel tracks, each with its own subagent. Both tracks investigate both vehicle types, ensuring consistent comparison methodology. A synthesis step produces the unified comparison.
- **C** (incorrect): Splitting by vehicle type risks inconsistent comparison methodology. One agent might emphasise different environmental metrics than the other, making the comparison unreliable. Splitting by analytical dimension (environmental impact, cost-effectiveness) ensures each dimension uses consistent methodology across both vehicle types.
- **D** (incorrect): The query's structure is clear and predictable — two analytical dimensions (environmental, cost), two vehicle types, one context (commercial fleets). Dynamic adaptive decomposition is for open-ended investigations where the next steps are unknown. Here, multi-concern decomposition is more efficient.

</details>

---

### Q040 (q-1-5-014) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / hooks-vs-prompts · **Difficulty:** scenario-analysis · scenario: s4

**A developer-tool agent working in a version-controlled project has two guardrails: a PreToolUse hook blocking file writes outside the project directory (enforced 100% of the time), and a system prompt instruction 'Always create a backup before overwriting existing files' (followed 88% of the time). A senior engineer wants all guardrails converted to hooks for consistency. What is the correct assessment?**

　 **A.** The senior engineer is correct: every guardrail, including the recoverable backup rule, should be converted to a deterministic hook for maximum reliability.

✅ **[CORRECT]** **B.** The directory restriction is rightly a hook; the backup instruction can stay a prompt because a missed backup is recoverable.

　 **C.** Both guardrails should be prompt instructions, since one enforcement mechanism is simpler to maintain than a mix of hooks and prompt rules.

　 **D.** The backup instruction should be converted to a hook, because a 12% failure rate on any stated guardrail is too high to leave to the prompt.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The guardrail strategy should match the severity of the consequence. Writing outside the project directory could damage the host system — this demands deterministic enforcement via a hook. Missing a backup is inconvenient but recoverable (files are in version control). The 88% compliance rate from the prompt is acceptable for a non-critical best practice.

**Option breakdown:**

- **A** (incorrect): Not all guardrails need deterministic enforcement. Converting everything to hooks adds implementation complexity for no benefit on recoverable rules. Match the enforcement mechanism to the severity of the requirement; a missed backup in version control is fine as a prompt.
- **B** (correct): The guardrail strategy should match the severity of the consequence. Writing outside the project directory could damage the host system — this demands deterministic enforcement via a hook. Missing a backup is inconvenient but recoverable (files are in version control). The 88% compliance rate from the prompt is acceptable for a non-critical best practice.
- **C** (incorrect): Prompt instructions for the directory restriction would have a non-zero failure rate for a safety-critical boundary. Writing outside the project directory could cause system damage. Safety-critical requirements must use deterministic hooks, not probabilistic prompts.
- **D** (incorrect): Whether 88% is acceptable depends on the consequences of failure. Missing a backup in a version-controlled codebase is recoverable, so 88% compliance is reasonable for a prompt-based best practice. The 12% failure rate does not justify the implementation complexity of a hook for a non-critical guideline.

</details>

---

### Q041 (q-1-1-006) — single-choice

**Task statement:** 1.1 agentic-loops / anti-patterns · **Difficulty:** application · scenario: s8

**A refactoring agent decomposes a legacy Java monolith into microservices. Its loop terminates by parsing the assistant's last message for the phrase 'refactoring complete', running 20 iterations even on simple classes. Logs show stop_reason returns 'end_turn' after iteration 4. What is the correct fix?**

　 **A.** Improve the phrase detection to also check for 'finished', 'done', and 'all changes applied'

✅ **[CORRECT]** **B.** Replace the natural language parsing with stop_reason inspection: exit on 'end_turn', continue on 'tool_use'.

　 **C.** Lower the iteration cap to 5 so the agent stops sooner on simple classes, matching the point where stop_reason already returns 'end_turn'.

　 **D.** Add a tool that the agent must call explicitly to signal completion, and check for that tool call each iteration

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Parsing natural language for termination is an anti-pattern. The stop_reason field is the authoritative, deterministic signal for agentic loop control. 'tool_use' means Claude has more work to do; 'end_turn' means it considers the task complete.

**Option breakdown:**

- **A** (incorrect): Adding more phrases to parse is still natural language detection, which is an anti-pattern. The model may finish without using any of these phrases, or use them mid-task. The stop_reason field already provides a deterministic signal.
- **B** (correct): Parsing natural language for termination is an anti-pattern. The stop_reason field is the authoritative, deterministic signal for agentic loop control. 'tool_use' means Claude has more work to do; 'end_turn' means it considers the task complete.
- **C** (incorrect): Lowering the cap would truncate complex refactoring tasks that genuinely need more iterations, and tuning it to one observed run does not generalise. The root cause is using natural language parsing instead of the stop_reason field for loop control.
- **D** (incorrect): A custom completion tool adds unnecessary complexity. The API already provides the stop_reason field as a built-in, deterministic mechanism for exactly this purpose.

</details>

---

### Q042 (q-1-2-007) — single-choice

**Task statement:** 1.2 orchestration-patterns / context-passing · **Difficulty:** application · scenario: s8

**A team runs a coordinator agent that delegates refactoring work to three specialist subagents: a schema-migration agent, an API-layer agent, and a test-update agent. The test-update agent frequently produces tests that reference database schemas the schema-migration agent has already renamed. The subagents do not communicate with each other. What is the root cause?**

　 **A.** The subagents need a shared message bus so the test-update agent can query the schema-migration agent for the latest schema names

　 **B.** The test-update agent should have read access to the schema migration files so it can discover the new names itself

✅ **[CORRECT]** **C.** The coordinator is not passing the schema-migration agent's output (including renamed schemas) as context when delegating to the test-update agent

　 **D.** The schema-migration agent and test-update agent should run sequentially rather than in parallel to avoid race conditions

<details><summary><b>Answer</b>: C</summary>

**Rationale:** In hub-and-spoke orchestration, the coordinator manages all inter-agent communication. Subagents do not inherit each other's context. The coordinator must explicitly pass relevant outputs from earlier subagents as context to downstream subagents. Here, the renamed schema mappings must be injected into the test-update agent's context.

**Option breakdown:**

- **A** (incorrect): In a hub-and-spoke multi-agent architecture, subagents must never communicate directly. All communication flows through the coordinator. Adding a message bus violates this principle and creates coordination complexity.
- **B** (incorrect): While this might work as a workaround, it misses the architectural root cause. The coordinator is responsible for passing all necessary context to each subagent. The test-update agent should not need to discover information that the coordinator already has.
- **C** (correct): In hub-and-spoke orchestration, the coordinator manages all inter-agent communication. Subagents do not inherit each other's context. The coordinator must explicitly pass relevant outputs from earlier subagents as context to downstream subagents. Here, the renamed schema mappings must be injected into the test-update agent's context.
- **D** (incorrect): Sequencing alone does not solve the problem if the coordinator does not pass the schema-migration agent's results to the test-update agent. The issue is missing context injection, not execution order.

</details>

---

### Q043 (q-1-6-008) — single-choice

**Task statement:** 1.6 task-decomposition / delegation · **Difficulty:** application · scenario: s8

**A coordinator agent receives a request to extract a payment processing module from the monolith into a standalone microservice. The task involves creating new API endpoints, migrating database tables, updating 40+ call sites, and writing integration tests. A junior developer suggests the coordinator should handle the entire task itself to avoid subagent communication overhead. Why is this approach wrong?**

　 **A.** The coordinator should never write code — it should only route tasks

✅ **[CORRECT]** **B.** Loading 40+ files into one context dilutes attention — the coordinator should delegate to scoped subagents instead

　 **C.** The coordinator cannot access file system tools, so it physically cannot make code changes

　 **D.** The coordinator's API rate limits would be exceeded when processing 40+ files

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Large, multi-file tasks suffer from attention dilution when processed in a single context. Delegating to specialist subagents ensures each agent works with focused context. The coordinator should handle task decomposition and context injection, delegating implementation to specialists.

**Option breakdown:**

- **A** (incorrect): The coordinator can handle simple, well-scoped tasks directly. The issue here is not a blanket rule against the coordinator writing code, but that this specific task is too large and cross-cutting for a single agent to handle effectively.
- **B** (correct): Large, multi-file tasks suffer from attention dilution when processed in a single context. Delegating to specialist subagents ensures each agent works with focused context. The coordinator should handle task decomposition and context injection, delegating implementation to specialists.
- **C** (incorrect): There is no inherent restriction preventing a coordinator from having file system tools. The issue is architectural — a single agent processing too many files suffers from attention dilution, not tool access limitations.
- **D** (incorrect): API rate limits are a practical concern but not the architectural reason to delegate. The root issue is attention dilution — quality degrades when one agent processes too many items in a single context, regardless of rate limits.

</details>

---

### Q044 (q-1-5-007) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / posttooluse-normalisation · **Difficulty:** application · scenario: s8

**During the monolith-to-microservices refactoring, each extracted service must follow a consistent Java package naming convention (com.company.service.<service-name>). The team notices that subagents sometimes use inconsistent package names like com.company.app.<service-name> or com.company.<service-name>. A team member proposes adding stronger instructions to the system prompt. What is the correct approach?**

　 **A.** Add the naming convention to the system prompt with three concrete examples showing the correct pattern

✅ **[CORRECT]** **B.** Implement a PostToolUse hook that inspects written files and normalises any package declarations to the correct com.company.service.<service-name> format

　 **C.** Create a separate validation subagent that reviews all written files for naming compliance after each refactoring batch

　 **D.** Use tool_choice to restrict the agent to a custom write_java_file tool that enforces the naming convention in its implementation

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A PostToolUse hook on file write operations can inspect the output and normalise package names deterministically. This provides a 100% enforcement guarantee regardless of what the model generates, which is the correct approach for structural consistency rules.

**Option breakdown:**

- **A** (incorrect): Prompt instructions with examples improve consistency but still have a non-zero failure rate. Package naming is a deterministic rule that must be enforced 100% of the time to avoid broken imports across services.
- **B** (correct): A PostToolUse hook on file write operations can inspect the output and normalise package names deterministically. This provides a 100% enforcement guarantee regardless of what the model generates, which is the correct approach for structural consistency rules. The exam guide names PostToolUse normalisation as the pattern for this class of rule. In practice the hook should rewrite the package declaration and the file's location together, so imports elsewhere stay valid.
- **C** (incorrect): A validation subagent is still probabilistic — it may miss violations. PostToolUse hooks provide deterministic, inline enforcement that catches every violation at the point of file creation.
- **D** (incorrect): Creating a custom tool wrapper adds unnecessary complexity. PostToolUse hooks on the existing file write tool achieve the same deterministic enforcement without modifying the tool interface.

</details>

---

### Q045 (q-1-4-012) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / prerequisite-gates · **Difficulty:** scenario-analysis · scenario: s8

**The refactoring coordinator delegates a database migration task to a subagent. The subagent sometimes executes destructive SQL migrations (DROP TABLE, ALTER TABLE DROP COLUMN) before verifying that a rollback script exists. The team requires that every destructive migration has a verified rollback before execution. What approach provides the strongest guarantee?**

　 **A.** Add a prerequisite check in the system prompt: 'Always verify rollback scripts exist before executing destructive migrations'

✅ **[CORRECT]** **B.** A programmatic prerequisite gate that blocks any DROP or ALTER TABLE DROP until a rollback verification returns success.

　 **C.** Have the coordinator agent review the subagent's SQL for destructive statements and withhold approval until a rollback script is present.

　 **D.** Run all migrations in a sandboxed database first and check for errors before applying to the real database

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A programmatic prerequisite gate physically prevents destructive SQL execution until the rollback verification precondition is met. This provides a deterministic guarantee that no destructive migration runs without a verified rollback, eliminating the failure mode entirely.

**Option breakdown:**

- **A** (incorrect): Prompt instructions are probabilistic. The agent 'sometimes' skips verification, proving that instructions alone are insufficient. Destructive database operations require deterministic guardrails.
- **B** (correct): A programmatic prerequisite gate physically prevents destructive SQL execution until the rollback verification precondition is met. This provides a deterministic guarantee that no destructive migration runs without a verified rollback, eliminating the failure mode entirely.
- **C** (incorrect): The coordinator is another LLM agent and provides probabilistic review, not deterministic enforcement. It may also miss destructive patterns in complex SQL statements. Programmatic gates are the correct approach for safety-critical operations.
- **D** (incorrect): Sandboxing tests for execution errors, not for the existence of rollback scripts. A migration that runs successfully in a sandbox still lacks a rollback plan. The requirement is specifically about verifying rollback scripts before execution.

</details>

---

### Q046 (q-1-7-006) — single-choice

**Task statement:** 1.7 session-state-resumption / named-resume · **Difficulty:** recall · scenario: s8

**A developer is refactoring the authentication module over multiple days. Yesterday's Claude Code session mapped all 23 authentication call sites across the monolith. Today, the developer wants to continue from where they left off. What is the correct approach to resume the work?**

　 **A.** Start a fresh session and re-analyse all 23 authentication call sites from scratch to rebuild the mapping in the new context.

✅ **[CORRECT]** **B.** Use --resume to continue yesterday's named session, keeping the full conversation context and the call site mapping.

　 **C.** Use fork_session to branch yesterday's session, continuing the refactor on the fork while the original stays available as a reference point.

　 **D.** Export yesterday's conversation to a text file and paste it into a new session so the call site mapping is available as context again.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** --resume continues a named session, restoring the full conversation context. This preserves yesterday's call site mapping, analysis, and decisions, allowing the developer to continue the refactoring without re-doing discovery work.

**Option breakdown:**

- **A** (incorrect): Re-analysing all 23 call sites wastes time when the previous session already mapped them. Claude Code provides session persistence via --resume to avoid this redundant work.
- **B** (correct): --resume continues a named session, restoring the full conversation context. This preserves yesterday's call site mapping, analysis, and decisions, allowing the developer to continue the refactoring without re-doing discovery work.
- **C** (incorrect): fork_session creates an independent branch for exploring alternative approaches from a shared baseline. The developer wants to continue the same line of work, not explore a divergent approach. --resume is the correct tool for continuation.
- **D** (incorrect): Manual context export and re-injection is error-prone and consumes tokens redundantly. --resume provides built-in session persistence that handles context preservation automatically.

</details>

---

### Q047 (q-1-2-008) — single-choice

**Task statement:** 1.2 orchestration-patterns / isolation · **Difficulty:** recall · scenario: s8

**In the team's multi-agent refactoring setup, a new developer asks whether the API-layer subagent can directly read the output of the schema-migration subagent to understand the new database schema. What is the correct answer?**

　 **A.** Yes — subagents in the same project share a common memory space and can access each other's outputs directly

　 **B.** Yes — as long as both subagents are registered with the same coordinator, they can exchange messages through a shared event bus

✅ **[CORRECT]** **C.** No — subagents do not inherit each other's memory; the coordinator must explicitly pass the schema-migration output to the API-layer agent as injected context

　 **D.** No — subagents can only receive instructions from the coordinator, not data; the API-layer agent must discover the schema by reading the database directly

<details><summary><b>Answer</b>: C</summary>

**Rationale:** In hub-and-spoke orchestration, subagents never communicate directly and do not share memory. All inter-agent data flow is mediated by the coordinator, which must explicitly pass relevant context from one subagent's output to another's input.

**Option breakdown:**

- **A** (incorrect): Subagents do not share memory. Each subagent runs in an isolated context. This is a common misconception about multi-agent systems.
- **B** (incorrect): There is no shared event bus in hub-and-spoke multi-agent architecture. Subagents never communicate directly, regardless of registration.
- **C** (correct): In hub-and-spoke orchestration, subagents never communicate directly and do not share memory. All inter-agent data flow is mediated by the coordinator, which must explicitly pass relevant context from one subagent's output to another's input.
- **D** (incorrect): The coordinator can pass both instructions and data to subagents. Context injection includes structured data like schema definitions. Requiring the subagent to independently discover information the coordinator already has is wasteful and error-prone.

</details>

---

### Q048 (q-1-2-011) — single-choice

**Task statement:** 1.2 orchestration-patterns / delegation · **Difficulty:** scenario-analysis · scenario: s8

**The coordinator receives two requests simultaneously: (1) rename a utility class used across 60 files, and (2) add a new health-check endpoint to one microservice. A developer proposes delegating both tasks to subagents. What is the optimal delegation strategy?**

　 **A.** Delegate both to subagents — task 1 to a rename specialist and task 2 to an API specialist

　 **B.** Handle both tasks directly in the coordinator to minimise subagent communication overhead

✅ **[CORRECT]** **C.** Delegate task 1 (60-file rename) to a subagent with scoped context, and have the coordinator handle task 2 (single-file health check) directly

　 **D.** Delegate task 2 to a subagent and have the coordinator handle task 1, since the coordinator has full codebase awareness needed for the rename

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The coordinator should delegate when tasks are large or require specialist focus, and handle tasks directly when they are simple and well-scoped. A 60-file rename benefits from a dedicated subagent with focused context. A single-file endpoint addition is trivial enough for the coordinator to handle without delegation overhead.

**Option breakdown:**

- **A** (incorrect): While task 1 requires delegation due to its scope, task 2 is a simple, well-scoped addition to a single file. Delegating trivial tasks to subagents adds unnecessary overhead from context injection and result collection.
- **B** (incorrect): Task 1 affects 60 files. Processing that many files directly in the coordinator will cause attention dilution. The coordinator should delegate large, multi-file tasks and only handle simple ones directly.
- **C** (correct): The coordinator should delegate when tasks are large or require specialist focus, and handle tasks directly when they are simple and well-scoped. A 60-file rename benefits from a dedicated subagent with focused context. A single-file endpoint addition is trivial enough for the coordinator to handle without delegation overhead.
- **D** (incorrect): This inverts the correct strategy. The coordinator's full codebase awareness does not prevent attention dilution across 60 files. The rename needs a subagent with focused context; the simple health check should stay with the coordinator.

</details>

---

### Q049 (q-1-5-008) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / hook-placement · **Difficulty:** scenario-analysis · scenario: s8

**The team's refactoring pipeline uses a PreToolUse hook to enforce that every new microservice includes a Dockerfile. However, the hook only checks for Dockerfile existence at the moment the create_service tool is called. A developer points out that some services have their Dockerfiles added in a later commit by a different subagent. What is the flaw in this approach?**

　 **A.** The hook should use PostToolUse instead of PreToolUse, checking after service creation whether a Dockerfile was added

✅ **[CORRECT]** **B.** Gate the deployment or merge tool rather than create_service, checking Dockerfile existence when the service is considered complete.

　 **C.** Run the hook on every single file write and continuously re-check whether a Dockerfile has appeared yet, failing the build until one does.

　 **D.** The PreToolUse hook is correct but needs a timeout to wait for the Dockerfile to appear within a configurable window

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Compliance checks should be enforced at the boundary where the precondition must hold — in this case, before deployment or merge. Checking at service creation time is too early when the workflow allows Dockerfiles to be added in subsequent steps. Moving the gate to the deployment or merge boundary ensures all required artefacts are present regardless of which subagent adds them.

**Option breakdown:**

- **A** (incorrect): PostToolUse checks after the tool executes but still only at that single point in time. If the Dockerfile is added in a later commit by a different subagent, PostToolUse on create_service will still miss it.
- **B** (correct): Compliance checks should be enforced at the boundary where the precondition must hold — in this case, before deployment or merge. Checking at service creation time is too early when the workflow allows Dockerfiles to be added in subsequent steps. Moving the gate to the deployment or merge boundary ensures all required artefacts are present regardless of which subagent adds them.
- **C** (incorrect): Running a Dockerfile check on every file write is wasteful and creates unnecessary overhead. The check should happen once at the right boundary (deployment or merge), not continuously during development.
- **D** (incorrect): Adding a timeout introduces non-deterministic behaviour and race conditions. The correct fix is to move the enforcement gate to the right point in the workflow, not to add polling delays.

</details>

---

### Q050 (q-1-7-007) — single-choice

**Task statement:** 1.7 session-state-resumption / fork-session · **Difficulty:** application · scenario: s8

**A developer is exploring two different strategies for decomposing the monolith's order processing module: (1) splitting by business capability (orders, payments, shipping) or (2) splitting by data ownership (order-db, payment-db, shipping-db). They want to explore both approaches in parallel without losing either analysis. What is the correct Claude Code approach?**

　 **A.** Open two terminal tabs and run separate Claude Code sessions with different instructions in each

✅ **[CORRECT]** **B.** Use fork_session to create two parallel exploration branches from the current session's baseline, one for each decomposition strategy

　 **C.** Use --resume to alternate between the two strategies in a single session, relying on conversation history to separate the analyses

　 **D.** Instruct the agent to evaluate both strategies sequentially in the same session, then compare results

<details><summary><b>Answer</b>: B</summary>

**Rationale:** fork_session creates independent branches from a shared baseline. Both branches inherit the current codebase analysis and context but can diverge independently to explore different strategies. Neither branch's exploration affects the other, and both analyses are preserved.

**Option breakdown:**

- **A** (incorrect): Separate sessions do not share the baseline context of the current analysis. Both explorations would need to re-do the initial codebase discovery, wasting time and losing the shared foundation.
- **B** (correct): fork_session creates independent branches from a shared baseline. Both branches inherit the current codebase analysis and context but can diverge independently to explore different strategies. Neither branch's exploration affects the other, and both analyses are preserved.
- **C** (incorrect): --resume continues a single linear session. Alternating between strategies in one context risks cross-contamination where analysis from one approach influences the other. fork_session provides clean isolation for parallel exploration.
- **D** (incorrect): Sequential evaluation in a single session means the first strategy's analysis occupies context when exploring the second, potentially biasing the comparison. fork_session allows true parallel exploration with isolated contexts.

</details>

---

### Q051 (q-1-1-007) — single-choice

**Task statement:** 1.1 agentic-loops / lifecycle · **Difficulty:** recall · scenario: s10

**The content moderation system uses an agentic loop to classify user-generated posts. After each API call, what field should the loop inspect to determine whether Claude has finished classifying the current post or still needs to call additional tools?**

　 **A.** Check response.content[0].type for a value of 'text' to indicate classification is complete

✅ **[CORRECT]** **B.** Check the stop_reason field — continue the loop when it is 'tool_use' and terminate when it is 'end_turn'

　 **C.** Parse the assistant's response text for phrases like 'classification complete' or 'moderation decision finalised'

　 **D.** Count the number of tool calls made so far and terminate after a fixed threshold

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The stop_reason field is the authoritative, deterministic signal for agentic loop control. 'tool_use' means Claude wants to call more tools; 'end_turn' means it considers the task complete.

**Option breakdown:**

- **A** (incorrect): Claude can return text content alongside tool_use blocks. Checking content type is unreliable because a text block does not necessarily mean the model has finished all tool calls.
- **B** (correct): The stop_reason field is the authoritative, deterministic signal for agentic loop control. 'tool_use' means Claude wants to call more tools; 'end_turn' means it considers the task complete.
- **C** (incorrect): Natural language parsing is ambiguous. Claude may use completion-sounding phrases while still intending to call tools, or finish without such phrases. The stop_reason field already provides an unambiguous signal.
- **D** (incorrect): A fixed tool-call count ignores the model's actual state. Simple posts may need one tool call while complex ones need several. The stop_reason field lets the model signal completion dynamically.

</details>

---

### Q052 (q-1-1-008) — single-choice

**Task statement:** 1.1 agentic-loops / model-driven · **Difficulty:** application · scenario: s10

**The moderation system's agentic loop uses a hardcoded decision tree: if the classify_content tool returns 'hate_speech', always call escalate_to_human; if it returns 'spam', always call auto_remove. During testing, the team discovers that satirical posts criticising hate speech are being auto-escalated, and sophisticated spam disguised as legitimate marketing slips through. What is the architectural problem?**

　 **A.** The classify_content tool needs more granular category labels so it can tell satire criticising hate speech apart from genuine hate speech.

✅ **[CORRECT]** **B.** Replace the hardcoded decision tree with model-driven decisions, letting Claude weigh the full context of each post before it acts.

　 **C.** Add a confidence threshold so only high-confidence classifications trigger automatic actions

　 **D.** Route to human review every case the decision tree cannot classify cleanly, so satire and disguised spam are both caught by a person.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Hardcoded decision trees treat classification labels as absolute when real content is nuanced. Letting Claude reason about context (satire vs genuine hate, sophisticated spam patterns) produces better moderation decisions. The agentic loop should let the model decide, not map labels to fixed actions.

**Option breakdown:**

- **A** (incorrect): More granular labels do not address the core issue. A hardcoded decision tree cannot adapt to nuance, such as satire versus genuine hate, no matter how fine the labels are. The fix is model-driven reasoning.
- **B** (correct): Hardcoded decision trees treat classification labels as absolute when real content is nuanced. Letting Claude reason about context (satire vs genuine hate, sophisticated spam patterns) produces better moderation decisions. The agentic loop should let the model decide, not map labels to fixed actions.
- **C** (incorrect): Confidence thresholds reduce false positives but the fundamental problem remains: a hardcoded tree cannot handle contextual nuance. Low-confidence cases still need model-driven reasoning, not just deferral.
- **D** (incorrect): Routing everything ambiguous to humans defeats the purpose of automated moderation. The model can reason about context effectively when given the opportunity; the hardcoded tree is what prevents it.

</details>

---

### Q053 (q-1-2-009) — single-choice

**Task statement:** 1.2 orchestration-patterns / isolation · **Difficulty:** application · scenario: s10

**The content moderation system uses a hub-and-spoke architecture with a coordinator that routes posts to specialist subagents: a text classifier, an image analyser, and a policy enforcer. The team notices that the image analyser sometimes directly calls the policy enforcer's action tools to remove posts, bypassing the coordinator. What is the architectural violation and how should it be fixed?**

　 **A.** Give the image analyser its own copy of the policy enforcer's action tools so it can remove posts itself without calling another subagent.

✅ **[CORRECT]** **B.** The image analyser breaks hub-and-spoke isolation; scope its tools to image analysis and route all results back through the coordinator.

　 **C.** Merge the image analyser and policy enforcer into a single subagent to simplify the communication flow

　 **D.** Add a message queue between the image analyser and the policy enforcer so the removal is decoupled and the coordinator can observe it after the fact.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** In hub-and-spoke orchestration, subagents must be isolated and communicate only through the coordinator. The image analyser should return its classification result to the coordinator, which then decides whether to invoke the policy enforcer. Direct subagent-to-subagent communication breaks the architecture.

**Option breakdown:**

- **A** (incorrect): Duplicating action tools across subagents creates inconsistent enforcement and makes policy changes harder to propagate. The issue is the communication pattern, not tool availability.
- **B** (correct): In hub-and-spoke orchestration, subagents must be isolated and communicate only through the coordinator. The image analyser should return its classification result to the coordinator, which then decides whether to invoke the policy enforcer. Direct subagent-to-subagent communication breaks the architecture.
- **C** (incorrect): Merging subagents with distinct responsibilities (analysis vs enforcement) violates separation of concerns. The image analyser and policy enforcer have fundamentally different roles and tool requirements.
- **D** (incorrect): An async queue between subagents still bypasses the coordinator, and observing a removal after it has happened is not routing it. In hub-and-spoke, all inter-agent communication must flow through the coordinator regardless of synchronicity.

</details>

---

### Q054 (q-1-3-010) — single-choice

**Task statement:** 1.3 subagent-invocation-context / parallel-spawning · **Difficulty:** application · scenario: s10

**A user reports a post that contains both potentially defamatory text and an embedded image that may violate graphic content policies. The coordinator receives this report as a single moderation request. What is the correct delegation strategy?**

　 **A.** Send the entire report to the text classifier first, then forward its output to the image analyser so the image step runs only after the text step has finished.

　 **B.** Triage the whole report to whichever subagent handles the more severe category, so the moderation decision reflects the worst violation present.

✅ **[CORRECT]** **C.** Route the text to the text classifier and the image to the image analyser in parallel, then aggregate both results for the final decision.

　 **D.** Spawn a new combined text-and-image subagent for multi-modal reports so one specialist owns the whole decision rather than splitting it in two.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The coordinator should decompose multi-concern requests into independent subtasks. Text defamation and image policy violations are separate analysis dimensions that can be evaluated in parallel. The coordinator aggregates the results to make a unified moderation decision.

**Option breakdown:**

- **A** (incorrect): Sequential processing creates unnecessary latency when the two concerns are independent. The text and image analyses do not depend on each other and can run in parallel.
- **B** (incorrect): Severity cannot be determined until both analyses are complete, so there is nothing to triage on. Routing to a single subagent also means one concern goes unanalysed.
- **C** (correct): The coordinator should decompose multi-concern requests into independent subtasks. Text defamation and image policy violations are separate analysis dimensions that can be evaluated in parallel. The coordinator aggregates the results to make a unified moderation decision.
- **D** (incorrect): Creating a new combined subagent duplicates capability that already exists in the specialist subagents. The coordinator's role is to decompose and delegate, not to spawn new agents for every combination of concerns.

</details>

---

### Q055 (q-1-4-007) — single-choice

**Task statement:** 1.4 workflow-enforcement-handoff / confidence-routing · **Difficulty:** scenario-analysis · scenario: s10

**The moderation system auto-removes posts classified as policy violations. Production logs reveal that 3% of auto-removed posts were legitimate content (false positives), generating user complaints and eroding platform trust. The team considers two approaches: (A) escalate all borderline cases to human reviewers, or (B) add a confidence threshold where only high-confidence violations are auto-removed and everything else goes to human review. Which approach is better and why?**

　 **A.** Approach A: escalate every borderline case, because human reviewers are more accurate than the classifier and a 3% false-positive rate is a trust problem.

✅ **[CORRECT]** **B.** Approach B: auto-remove only high-confidence violations, escalate uncertain cases to human review, and auto-approve high-confidence safe content.

　 **C.** Neither — instead lower the classification threshold so fewer posts are flagged as violations

　 **D.** Approach B, but apply a single fixed 95% confidence threshold to every category regardless of how costly a false positive is for that content type.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Confidence-based routing creates a tiered system: high-confidence violations are actioned immediately, high-confidence safe content passes through, and uncertain cases receive human review. This balances speed, accuracy, and reviewer workload while directly addressing the false positive problem.

**Option breakdown:**

- **A** (incorrect): Escalating all borderline cases overwhelms the human review queue without leveraging the system's ability to handle clear-cut cases autonomously. The goal is to route intelligently, not to defer everything.
- **B** (correct): Confidence-based routing creates a tiered system: high-confidence violations are actioned immediately, high-confidence safe content passes through, and uncertain cases receive human review. This balances speed, accuracy, and reviewer workload while directly addressing the false positive problem.
- **C** (incorrect): Lowering the threshold reduces false positives but increases false negatives (genuine violations going undetected). This trades one problem for another rather than adding an appropriate escalation path.
- **D** (incorrect): A single fixed threshold across all categories ignores that violation types have different risk profiles. The threshold should be calibrated per category based on the cost of false positives versus false negatives.

</details>

---

### Q056 (q-1-7-008) — single-choice

**Task statement:** 1.7 session-state-resumption / fresh-context · **Difficulty:** application · scenario: s10

**The moderation system handles appeals where users contest a moderation decision. Currently, the same agent that made the original decision re-evaluates the appeal. Appeal overturn rates are suspiciously low. What is the most effective architectural change?**

　 **A.** Add stronger instructions to the appeal handler's prompt requiring it to weigh the user's perspective fairly and set aside its earlier decision.

　 **B.** Route every appeal to a human reviewer with full authority to overturn the automated decision, taking the original agent out of the appeal path entirely.

✅ **[CORRECT]** **C.** Route appeals to a separate agent instance that cannot see the original reasoning, given only the content and the user's justification.

　 **D.** Automatically overturn decisions where the user provides any appeal justification to improve user trust

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A fresh agent instance without access to the original reasoning context evaluates the content independently. This avoids confirmation bias from the original decision. The appeal agent sees only the content and the user's argument, enabling a genuinely independent review.

**Option breakdown:**

- **A** (incorrect): Prompt instructions cannot overcome the bias of an agent reviewing its own decision. The original reasoning context still influences the re-evaluation regardless of instructions.
- **B** (incorrect): Human review for every appeal does not scale and removes the benefit of automated moderation. Some appeals can be resolved automatically by a separate, unbiased instance.
- **C** (correct): A fresh agent instance without access to the original reasoning context evaluates the content independently. This avoids confirmation bias from the original decision. The appeal agent sees only the content and the user's argument, enabling a genuinely independent review.
- **D** (incorrect): Automatic overturn on any appeal completely undermines moderation. Users who genuinely violated policies would simply appeal every decision.

</details>

---

### Q057 (q-1-5-009) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / posttooluse-normalisation · **Difficulty:** recall · scenario: s10

**The moderation system uses the Agent SDK to process posts. The team wants to automatically normalise Unicode characters in classified text (e.g., converting homoglyphs to standard Latin characters) after the classify_content tool runs but before the model processes the classification result. Which hook type is appropriate?**

　 **A.** A PreToolUse hook that modifies the tool input before execution

✅ **[CORRECT]** **B.** A PostToolUse hook that processes the tool result and normalises Unicode characters before the model sees the output

　 **C.** A system prompt instruction telling the model to normalise Unicode characters when it encounters them

　 **D.** A pre-processing middleware that normalises all input before it reaches any tool

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PostToolUse hooks run after a tool has executed but before the model processes the result. This is the correct point to normalise Unicode homoglyphs in the classification output.

**Option breakdown:**

- **A** (incorrect): A PreToolUse hook runs before the tool executes. The normalisation needs to happen after classify_content returns its result, not before it runs.
- **B** (correct): PostToolUse hooks run after a tool has executed but before the model processes the result. This is the correct point to normalise Unicode homoglyphs in the classification output.
- **C** (incorrect): Prompt instructions are probabilistic. Unicode normalisation is a deterministic text transformation that should be handled programmatically via a hook, not by the model.
- **D** (incorrect): Pre-processing normalises the input text, not the tool output. The question asks about normalising the classification result after the tool runs, which requires a PostToolUse hook.

</details>

---

### Q058 (q-1-5-010) — single-choice

**Task statement:** 1.5 agent-sdk-hooks / pretooluse-enforcement · **Difficulty:** scenario-analysis · scenario: s10

**Platform policy strictly prohibits the moderation system from auto-removing any post in the 'political speech' category without human approval. Currently this rule is enforced via the system prompt: 'Never auto-remove political speech without human approval.' Audit logs reveal that in 2% of cases the agent auto-removes political speech posts. What is the correct fix?**

　 **A.** Strengthen the system prompt by repeating the rule in several places with bold emphasis, and add a worked example of a political speech post.

　 **B.** Add few-shot examples showing the correct workflow for political speech: classify it, escalate to a human reviewer, and never auto-remove it under any circumstances.

✅ **[CORRECT]** **C.** A PreToolUse hook that checks the category before any removal runs and blocks it for 'political_speech', redirecting to human review.

　 **D.** Route all political speech posts to a dedicated subagent that has no access to the auto-remove tool

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A PreToolUse hook provides deterministic enforcement by physically blocking the removal tool when the content category is political speech. This is the only approach that guarantees 100% compliance with the policy, which is what platform rules require.

**Option breakdown:**

- **A** (incorrect): Repeating the rule more emphatically is still a probabilistic approach. The existing 2% failure rate demonstrates that prompt-based enforcement cannot guarantee 100% compliance for a strict policy requirement.
- **B** (incorrect): Few-shot examples improve compliance rates but cannot guarantee 100% adherence. Platform policy requires deterministic enforcement, not improved probability.
- **C** (correct): A PreToolUse hook provides deterministic enforcement by physically blocking the removal tool when the content category is political speech. This is the only approach that guarantees 100% compliance with the policy, which is what platform rules require.
- **D** (incorrect): Routing to a restricted subagent is partially correct but relies on the coordinator to correctly identify political speech before routing. A hook on the removal tool itself is more robust because it catches violations regardless of routing decisions.

</details>

---

### Q059 (q-1-2-010) — single-choice

**Task statement:** 1.2 orchestration-patterns / isolation · **Difficulty:** scenario-analysis · scenario: s10

**The moderation coordinator dispatches posts to specialist subagents. The text classifier has been extended to also handle image analysis: its prompt is now 2,500 tokens, its tool list has grown to 12 tools, and accuracy has dropped on both text and image tasks. What principle was violated and what is the fix?**

　 **A.** The text classifier's context window is too small — upgrade to a model with a larger context window to handle the expanded prompt

✅ **[CORRECT]** **B.** Isolation was violated; restore the text classifier to text-only work with scoped tools and keep image analysis separate.

　 **C.** Add better instructions to the combined subagent's prompt to clarify when it should use text tools versus image tools

　 **D.** Split the combined agent into three narrower specialists: text sentiment, text policy, and image analysis

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Each subagent should have a focused responsibility and a scoped tool set (4-5 tools maximum). Combining text and image analysis in one agent violates isolation, bloats the prompt, and confuses the model. Restoring separate specialists with scoped tools improves accuracy for both tasks.

**Option breakdown:**

- **A** (incorrect): Context window size is not the issue. Combining unrelated responsibilities in a single agent degrades performance because the model must juggle competing instructions and tools. A larger context window does not fix scope creep.
- **B** (correct): Each subagent should have a focused responsibility and a scoped tool set (4-5 tools maximum). Combining text and image analysis in one agent violates isolation, bloats the prompt, and confuses the model. Restoring separate specialists with scoped tools improves accuracy for both tasks.
- **C** (incorrect): Better instructions do not address the fundamental problem of an overloaded agent. Twelve tools and 2,500 tokens of instructions degrade performance regardless of instruction quality. The fix is architectural, not instructional.
- **D** (incorrect): Over-splitting into too many narrow specialists adds coordination overhead without clear benefit. The original architecture had a text classifier and an image analyser, which is the correct level of decomposition. Restoring that structure is the fix.

</details>

---

### Q060 (q-1-3-011) — single-choice

**Task statement:** 1.3 subagent-invocation-context / parallel-spawning · **Difficulty:** application · scenario: s10

**The coordinator receives a batch of 200 flagged posts to moderate. Currently it processes them sequentially, taking 45 minutes. Each post's moderation is independent — the decision on one post does not affect others. How should the coordinator handle this batch?**

　 **A.** Process all 200 posts in a single API call by concatenating them into one large prompt

✅ **[CORRECT]** **B.** Delegate independent posts to parallel subagent instances, with the coordinator aggregating results as they complete

　 **C.** Split into fixed batches of 20 posts and process each batch sequentially in a single prompt

　 **D.** Increase the iteration cap on the agentic loop to allow the agent more time to process all 200 posts

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Since each post's moderation is independent, the coordinator should delegate them to parallel instances. This reduces total processing time from sequential (45 minutes) to roughly the time of the slowest individual moderation, and a failure on one post does not block others.

**Option breakdown:**

- **A** (incorrect): Concatenating 200 posts into a single prompt causes attention dilution. Quality degrades for posts later in the sequence, and a single failure blocks the entire batch.
- **B** (correct): Since each post's moderation is independent, the coordinator should delegate them to parallel instances. This reduces total processing time from sequential (45 minutes) to roughly the time of the slowest individual moderation, and a failure on one post does not block others.
- **C** (incorrect): Batching 20 posts into a single prompt still risks attention dilution across posts within each batch. And sequential batch processing still takes much longer than parallel individual processing.
- **D** (incorrect): The iteration cap controls how many tool calls the agent can make within a single task, not how many independent tasks it can process. The issue is parallelism, not loop duration.

</details>

---

### Q061 (q-1-1-009) — single-choice

**Task statement:** 1.1 agentic-loops / tool-result-handling · **Difficulty:** application · scenario: s1

**A customer-support agent runs an agentic loop. Each turn it inspects `stop_reason`; when the value is `"tool_use"` it executes the requested tool and receives the tool's output. Before it calls the model again so the loop can continue coherently, what must the agent do with that output?**

✅ **[CORRECT]** **A.** Append the tool result to the conversation history as a new message, then send the full updated conversation on the next call.

　 **B.** Replace the previous assistant message with the tool output, keeping the context window small by not storing both halves of the exchange.

　 **C.** Send only the tool output on the next call, since the API retains the earlier turn server-side and will pair it with the pending tool request.

　 **D.** Store the tool output in an external store and pass a reference id to the model on the next call

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The Messages API is stateless: each call must include the full conversation, and a tool result is appended as a new message paired with its tool_use block. That is the mechanism by which the model continues the loop after a tool call.

**Option breakdown:**

- **A** (correct): The Messages API is stateless, so every call must carry the whole conversation. The tool result is appended as a new message paired with the tool_use block that requested it, which is how the model sees what its call returned and decides the next step.
- **B** (incorrect): Overwriting the assistant message discards the tool_use block that the result corresponds to, breaking the tool_use/tool_result pairing the API requires and losing the reasoning that led to the call.
- **C** (incorrect): The Messages API keeps no server-side memory of the turn. Sending only the tool output drops all prior context, so the model cannot continue the task coherently.
- **D** (incorrect): The model cannot dereference an external id. The tool result has to be present in the conversation the model actually receives.

</details>

---

### Q062 (q-1-2-012) — single-choice

**Task statement:** 1.2 orchestration-patterns / iterative-refinement · **Difficulty:** scenario-analysis · scenario: s2

**In a multi-agent research system the coordinator delegates to search and analysis subagents, then invokes a synthesis subagent. Reviewing the synthesis, the coordinator finds two claims with no supporting evidence and one sub-question left unanswered. What is the coordinator's correct next step?**

✅ **[CORRECT]** **A.** Assess the synthesis for gaps, re-delegate targeted follow-up queries to fill them, then re-invoke synthesis with the new findings.

　 **B.** Accept the synthesis as final, since re-running the search and analysis subagents would push the coordinator past its configured iteration budget.

　 **C.** Tell the synthesis subagent to fill the two evidence gaps and the open sub-question from its own knowledge, without any new delegation.

　 **D.** Restart the whole pipeline from scratch with a fresh coordinator to avoid contaminated context

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Iterative refinement is a coordinator responsibility: it evaluates the synthesis for gaps, re-delegates targeted queries to fill them, and re-invokes synthesis. Neither accepting the gaps nor restarting the pipeline is correct.

**Option breakdown:**

- **A** (correct): The coordinator owns iterative refinement: assess the synthesis for gaps, re-delegate focused follow-up queries, then re-synthesise. This closes the evidence gaps without discarding the work already done.
- **B** (incorrect): Shipping unsupported claims to save iterations defeats the purpose of the review. The iteration cap is a runaway safety net, not a reason to leave known gaps unfilled.
- **C** (incorrect): The synthesis subagent has no tools or sources to gather new evidence. Asking it to invent the missing support produces exactly the unsourced claims the review is meant to catch; new evidence requires re-delegation.
- **D** (incorrect): A full restart throws away correct findings and repeats work. Targeted re-delegation of only the missing pieces is the efficient, guide-recommended fix.

</details>

---

### Q063 (q-1-3-018) — single-choice

**Task statement:** 1.3 subagent-invocation-context / goal-oriented-prompts · **Difficulty:** application · scenario: s8

**A coordinator delegates a large refactoring subtask to a specialist subagent, and the architect must write the subagent's prompt. Which prompt design should the architect use?**

✅ **[CORRECT]** **A.** State the goal and its quality criteria (no breaking API changes, all tests pass) and let the subagent choose how to get there.

　 **B.** Give an exact step-by-step procedure (open file X, change line 12, run command Y, then edit file Z) so the subagent cannot deviate

　 **C.** Provide only the high-level goal with no success criteria, so the subagent has maximum freedom

　 **D.** Omit the goal and instead list the tools the subagent may use, letting it infer the objective from the toolset

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The guide directs coordinators to write goal-oriented, non-procedural subagent prompts: state the goal and quality criteria and let the subagent choose its approach. Rigid procedures and goals without success criteria are both weaker.

**Option breakdown:**

- **A** (correct): Goal-oriented prompts specify what to achieve and the quality bar, not a fixed procedure. Pairing the objective with success criteria lets the subagent adapt its approach when it meets something unexpected, which is what the guide recommends.
- **B** (incorrect): A rigid procedure constrains the subagent and breaks the moment reality diverges from the script. The guide specifically warns against procedural instructions in favour of goal-oriented ones.
- **C** (incorrect): A goal with no quality criteria gives the subagent no way to know when it has actually succeeded. Effective goal-oriented prompts pair the objective with explicit success criteria.
- **D** (incorrect): Listing tools without stating the goal leaves the objective ambiguous, and the subagent may optimise for the wrong outcome. The prompt must state the goal.

</details>

---

### Q064 (q-1-2-013) — multiple-response (select 3)

**Task statement:** 1.2 orchestration-patterns / coordinator · **Difficulty:** application · scenario: s2

_Select 3 options._

**In a hub-and-spoke research system, a coordinator manages several search and analysis subagents. Which responsibilities sit with the coordinator rather than with individual subagents? (Select 3)**

　 **A.** Sharing its full conversation history with each subagent automatically at spawn time.

✅ **[CORRECT]** **B.** Deciding which subagents to invoke based on the complexity of each incoming query.

✅ **[CORRECT]** **C.** Routing all inter-agent communication so subagents never exchange messages directly.

　 **D.** Running every search itself first so subagents only verify its findings.

✅ **[CORRECT]** **E.** Aggregating subagent results and re-delegating targeted follow-up queries when synthesis shows gaps.

<details><summary><b>Answer</b>: B, C, E</summary>

**Rationale:** Hub-and-spoke architecture concentrates subagent selection, message routing, result aggregation, and error handling in the coordinator, while subagents work in isolated contexts on delegated tasks.

**Option breakdown:**

- **A** (incorrect): Subagents run with isolated context; nothing is inherited automatically, and the coordinator passes only the context each task needs.
- **B** (correct): The guide places dynamic subagent selection with the coordinator, which analyses query requirements instead of always running the full pipeline.
- **C** (correct): Hub-and-spoke routes every message through the coordinator for observability and consistent error handling.
- **D** (incorrect): The coordinator delegates work rather than duplicating it; doing every search itself defeats the point of decomposition.
- **E** (correct): Result aggregation and gap-driven re-delegation are coordinator responsibilities in the iterative refinement loop.

</details>

---

### Q065 (q-1-6-009) — multiple-response (select 2)

**Task statement:** 1.6 task-decomposition / adaptive-decomposition · **Difficulty:** application · scenario: s8

_Select 2 options._

**You are planning how Claude should tackle a large, unfamiliar refactoring effort. Which characteristics of the work indicate dynamic adaptive decomposition rather than a fixed sequential pipeline? (Select 2)**

　 **A.** The review covers the same predictable set of aspects on every run.

✅ **[CORRECT]** **B.** The useful subtasks only become clear as intermediate findings come in.

　 **C.** Each step's output feeds the next in a stable, known order.

✅ **[CORRECT]** **D.** The task is open-ended, like adding comprehensive tests to a legacy codebase you have not mapped yet.

<details><summary><b>Answer</b>: B, D</summary>

**Rationale:** Fixed pipelines suit predictable, repeatable workflows; dynamic decomposition suits open-ended investigation where the plan must adapt to discoveries.

**Option breakdown:**

- **A** (incorrect): A predictable multi-aspect review is exactly where a fixed prompt-chaining pipeline fits best.
- **B** (correct): Adaptive plans generate subtasks from what each step discovers, which a fixed pipeline cannot do.
- **C** (incorrect): A stable, known step order is the defining property of a sequential pipeline, not of adaptive decomposition.
- **D** (correct): This is the guide's example of open-ended work: map the structure first, then build a prioritised plan that adapts as dependencies surface.

</details>

---


## Domain 2 — Tool Design & MCP Integration (18%)

_46 questions_

### Q066 (q-2-1-001) — single-choice

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** application · scenario: s1

**Production logs show an agent frequently calls get_customer when users ask about orders (e.g. 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What is the most effective first step to improve tool selection reliability?**

　 **A.** Add 5-8 few-shot examples to the system prompt demonstrating correct tool selection patterns for order-related queries.

✅ **[CORRECT]** **B.** Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools.

　 **C.** Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords.

　 **D.** Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Tool descriptions are the primary mechanism LLMs use for tool selection. Expanding them is the lowest-effort, highest-leverage fix that directly addresses the root cause.

**Option breakdown:**

- **A** (incorrect): Few-shot examples add token overhead without fixing the underlying issue. The root cause is that descriptions do not differentiate the tools.
- **B** (correct): Tool descriptions are the primary mechanism LLMs use for tool selection. Expanding them is the lowest-effort, highest-leverage fix that directly addresses the root cause.
- **C** (incorrect): A routing layer is over-engineered as a first step. It bypasses the LLM's natural language understanding and adds infrastructure complexity.
- **D** (incorrect): Consolidation is a valid architectural choice but requires significantly more effort than expanding descriptions. The exam favours proportionate first steps.

</details>

---

### Q067 (q-2-2-001) — single-choice

**Task statement:** 2.2 structured-error-responses / access-vs-empty · **Difficulty:** application · scenario: s1

**A tool returns an empty array after a customer lookup. The agent retries 3 times, then escalates to a human agent. Analysis shows the customer's account simply does not exist. What is the root cause of this wasted effort?**

　 **A.** The retry limit is too low — increasing to 5 retries would resolve the issue.

✅ **[CORRECT]** **B.** The tool does not distinguish between access failures and valid empty results, so the agent treats 'no matches' as a retriable failure.

　 **C.** The escalation threshold is too aggressive — the agent should exhaust more retries before involving a human.

　 **D.** The system prompt should instruct the agent not to retry customer lookups.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The tool successfully queried the data source and found no matches. This is a valid empty result, not an access failure. The agent's recovery logic cannot distinguish the two, causing it to retry when it should accept the result.

**Option breakdown:**

- **A** (incorrect): More retries make the problem worse. The tool succeeded — it found no matching customer. Retrying a successful query with no matches will never produce different results.
- **B** (correct): The tool successfully queried the data source and found no matches. This is a valid empty result, not an access failure. The agent's recovery logic cannot distinguish the two, causing it to retry when it should accept the result.
- **C** (incorrect): The problem is not the escalation threshold. The problem is that the agent retries at all. A valid empty result requires no retry and no escalation.
- **D** (incorrect): Hard-coding retry rules per tool in the system prompt is brittle. The proper fix is structured error metadata that tells the agent whether the result is retryable.

</details>

---

### Q068 (q-2-3-001) — single-choice

**Task statement:** 2.3 tool-distribution-choice / scoped-cross-role · **Difficulty:** scenario-analysis · scenario: s4

**A synthesis agent frequently returns control to the coordinator for simple fact verification, adding 2-3 round trips per task and 40% latency. Analysis shows 85% of verifications are simple lookups. What is the most effective solution?**

　 **A.** Increase the coordinator's parallelism so it can process the queued verification requests faster and absorb the extra round trips.

✅ **[CORRECT]** **B.** Give the synthesis agent a scoped verify_fact tool for simple lookups, escalating only complex checks to the coordinator.

　 **C.** Add a coordinator-level cache of verification results so repeated lookups return instantly, removing most of the round-trip latency.

　 **D.** Remove fact verification from the synthesis workflow altogether, which eliminates both the round trips and the latency they add.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A scoped cross-role tool handles the 85% simple case directly, eliminating round-trip latency. Complex cases still route through the coordinator for proper handling.

**Option breakdown:**

- **A** (incorrect): Faster processing does not eliminate unnecessary round trips. The latency comes from the routing overhead itself, not the coordinator's speed.
- **B** (correct): A scoped cross-role tool handles the 85% simple case directly, eliminating round-trip latency. Complex cases still route through the coordinator for proper handling.
- **C** (incorrect): Caching helps with repeated lookups but does not address the fundamental round-trip overhead for first-time verifications, which are the majority.
- **D** (incorrect): Removing verification compromises output quality. The goal is to make verification faster, not to skip it.

</details>

---

### Q069 (q-2-4-001) — single-choice

**Task statement:** 2.4 mcp-server-integration / build-vs-use · **Difficulty:** application · scenario: s4

**A team needs to integrate with Jira for issue tracking in their Claude Code workflow. A developer proposes building a custom MCP server. What is the correct first step?**

　 **A.** Build a custom MCP server with the exact API endpoints the team needs.

✅ **[CORRECT]** **B.** Evaluate existing community MCP servers for Jira and only build custom if they cannot handle team-specific workflows.

　 **C.** Use the Jira REST API directly from Bash commands instead of MCP.

　 **D.** Add the Jira integration to ~/.claude.json so each developer can configure it independently.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Community servers should always be the first choice for standard integrations. They are maintained, tested, and cover common use cases. Custom builds are justified only when community servers cannot handle team-specific requirements.

**Option breakdown:**

- **A** (incorrect): Building custom is premature. Community MCP servers for Jira already exist and cover standard use cases. Custom builds should be reserved for team-specific workflows.
- **B** (correct): Community servers should always be the first choice for standard integrations. They are maintained, tested, and cover common use cases. Custom builds are justified only when community servers cannot handle team-specific requirements.
- **C** (incorrect): Direct API calls bypass the MCP tool interface, losing the benefits of tool descriptions, structured responses, and agent-native integration.
- **D** (incorrect): A team-wide integration should be in project-level .mcp.json so it is version-controlled and shared. User-level ~/.claude.json is for personal/experimental servers.

</details>

---

### Q070 (q-2-5-001) — single-choice

**Task statement:** 2.5 built-in-tools / grep-vs-glob · **Difficulty:** application · scenario: s4

**A developer needs to find all files that call a deprecated function processLegacyOrder() and also find all test files for those callers. Which tool sequence is correct?**

　 **A.** Glob for '*processLegacyOrder*' to find the callers, then Grep the results for the matching test files.

　 **B.** Read every source file to search for the function calls, then Read every test file to confirm the callers.

✅ **[CORRECT]** **C.** Grep for 'processLegacyOrder' to find the callers, then Glob to match their test files by name.

　 **D.** Bash with 'find . -name "*.ts" | xargs grep processLegacyOrder' for the callers and again for the tests.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Grep searches file contents — correct for finding function callers. Glob matches file paths — correct for finding test files by naming pattern. This is the optimal two-step sequence.

**Option breakdown:**

- **A** (incorrect): Glob matches file paths, not file contents. It cannot find function callers — it would only match files named after the function, which is unlikely.
- **B** (incorrect): Reading all files upfront is a context-budget killer. It consumes tokens on irrelevant files and is the exact anti-pattern the exam penalises.
- **C** (correct): Grep searches file contents, which is correct for finding function callers. Glob matches file paths, which is correct for finding test files by naming pattern such as **/*.test.tsx. This is the optimal two-step sequence.
- **D** (incorrect): While technically functional, this bypasses the built-in tools designed for these tasks. The exam expects candidates to use the right built-in tool for each task.

</details>

---

### Q071 (q-2-1-002) — single-choice

**Task statement:** 2.1 tool-schema-design / system-prompt · **Difficulty:** scenario-analysis · scenario: s4

**An agent has two tools: `analyze_content` ('Analyses content') and `extract_web_results` ('Extracts data from web pages'). After a system prompt update added 'Always analyse content before responding', the agent started routing web-extraction tasks to `analyze_content` despite the unchanged descriptions. What is the most likely cause and fix?**

✅ **[CORRECT]** **A.** The system prompt's 'analyse content' phrasing keyword-matches the analyze_content tool; rephrase it to remove the overlap.

　 **B.** The tool descriptions need few-shot examples added to the system prompt showing when to use each tool.

　 **C.** The analyze_content tool should be renamed to something less generic, such as summarize_document, to avoid all future conflicts.

　 **D.** The tool descriptions have degraded over time and need to be rewritten with clearer boundaries between the two tools.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Keyword-sensitive instructions in system prompts can create unintended tool associations that override well-written descriptions. The phrase 'analyse content' directly matches the tool name, causing the model to favour it regardless of the task. The fix is to review and rephrase the system prompt after any update.

**Option breakdown:**

- **A** (correct): Keyword-sensitive instructions in system prompts can create unintended tool associations that override well-written descriptions. The phrase 'analyse content' directly matches the tool name, so the model favours it regardless of the task. The fix is to review and rephrase the system prompt after any update.
- **B** (incorrect): Few-shot examples add token overhead and do not address the root cause. The system prompt instruction is directly triggering the wrong tool via keyword association, and adding more content to the system prompt may compound the issue.
- **C** (incorrect): Renaming is a valid longer-term improvement but does not address the immediate cause: the system prompt instruction creating a keyword match. The prompt conflict would persist with any tool whose name overlaps with prompt wording.
- **D** (incorrect): The question states tool descriptions were not changed and routing was correct before the system prompt update. The descriptions are not the root cause — the new system prompt instruction is.

</details>

---

### Q072 (q-2-2-002) — single-choice

**Task statement:** 2.2 structured-error-responses / business-error · **Difficulty:** application · scenario: s1

**A support agent tries to refund $850, but policy caps automated refunds at $500. The MCP tool returns 'Operation failed' as its error. The agent retries three times before escalating to a human. What change to the tool's error response would most effectively prevent this behaviour?**

　 **A.** Include a longer error message explaining the policy: 'Operation failed because the refund amount of $850 exceeds the $500 automated refund limit'.

　 **B.** Set the MCP isError flag and add a retry-after header so the agent waits before retrying.

✅ **[CORRECT]** **C.** Return a structured error with errorCategory: 'business', isRetryable: false, and a customer-friendly description explaining the policy limit.

　 **D.** Catch the error in the agent's system prompt with a standing instruction telling it never to retry a refund operation once that operation has failed.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Business errors are never retryable — retrying a policy violation will always fail. Structured metadata with errorCategory and isRetryable: false tells the agent to stop retrying and take an alternative path, such as offering partial refund or escalating to a supervisor.

**Option breakdown:**

- **A** (incorrect): A better message helps human readers but does not give the agent structured metadata to determine that retrying is futile. The agent needs machine-readable fields, not just better prose.
- **B** (incorrect): A retry-after header implies the error is transient and will resolve with time. A business policy violation is never transient — no amount of waiting will change the refund limit. This would cause delayed retries that still fail.
- **C** (correct): Business errors are never retryable — retrying a policy violation will always fail. Structured metadata with errorCategory and isRetryable: false tells the agent to stop retrying and take an alternative path, such as offering partial refund or escalating to a supervisor.
- **D** (incorrect): Hard-coding retry rules per operation in the system prompt is brittle and does not scale. The proper fix is structured error metadata that the agent's recovery logic can interpret programmatically for any tool.

</details>

---

### Q073 (q-2-3-002) — single-choice

**Task statement:** 2.3 tool-distribution-choice / role-scoping · **Difficulty:** application · scenario: s4

**A developer productivity platform has a code review agent equipped with 18 tools covering code analysis, documentation lookup, test generation, dependency checking, security scanning, and deployment validation. Reviews are slow and the agent frequently selects the wrong tool. What is the most effective architectural change?**

　 **A.** Rewrite all 18 tool descriptions with explicit boundaries and 'use this when' guidance so the agent can tell them apart.

　 **B.** Implement a routing classifier that pre-selects the appropriate tool before each agent turn.

　 **C.** Switch tool_choice from 'auto' to 'any' so the model is forced to select a tool on every turn.

✅ **[CORRECT]** **D.** Split the agent into role-specific agents with 4-5 tools each, scoped to their specialisation.

<details><summary><b>Answer</b>: D</summary>

**Rationale:** The recommended range is 4-5 tools per agent. Splitting into role-specific agents with scoped tools eliminates decision complexity and prevents cross-specialisation misuse. Each agent excels within its narrow remit.

**Option breakdown:**

- **A** (incorrect): Better descriptions help but do not solve the fundamental problem: 18 tools exceed the recommended range and create too much decision complexity. Selection accuracy degrades regardless of description quality when tool count is too high.
- **B** (incorrect): A routing classifier adds infrastructure complexity and bypasses the LLM's natural language understanding. The root cause is too many tools, not inadequate routing.
- **C** (incorrect): Forcing tool selection does not help when the agent cannot reliably choose among 18 options. The problem is selection accuracy due to overload, not whether the model calls a tool at all.
- **D** (correct): The recommended range is 4-5 tools per agent. Splitting into role-specific agents (for example separate agents for code analysis, security scanning, and test generation) eliminates decision complexity and prevents cross-specialisation misuse. Each agent excels within its narrow remit.

</details>

---

### Q074 (q-2-4-002) — single-choice

**Task statement:** 2.4 mcp-server-integration / descriptions · **Difficulty:** scenario-analysis · scenario: s1

**A customer support team configures an MCP server for their internal CRM system. The agent frequently ignores the CRM MCP tool and instead uses the built-in Grep tool to search local log files for customer information, producing incomplete results. The MCP tool's description reads: 'CRM tool'. What should the team do first?**

　 **A.** Remove the Grep tool from the agent's available tools so it cannot fall back to local file search.

　 **B.** Add a system prompt instruction: 'Always use the CRM tool for customer queries. Never use Grep for customer data.'

　 **C.** Move the MCP server configuration from .mcp.json to ~/.claude.json so it takes higher priority.

✅ **[CORRECT]** **D.** Expand the sparse 'CRM tool' description to detail its full customer records and structured output.

<details><summary><b>Answer</b>: D</summary>

**Rationale:** When an MCP tool's description is sparse, the agent defaults to familiar built-in tools. Enhancing the description to explain capabilities and structured output in detail makes the agent prefer it for relevant queries. This is the recommended fix for MCP tool underutilisation.

**Option breakdown:**

- **A** (incorrect): Removing Grep cripples the agent for legitimate file search tasks. The problem is not that Grep exists but that the MCP tool's description does not communicate its superior capabilities for customer data.
- **B** (incorrect): Hard-coding tool preferences in the system prompt is brittle and does not scale. If new tools are added or the CRM tool is renamed, the instruction becomes stale or causes conflicts.
- **C** (incorrect): Configuration scoping (project vs user level) does not affect tool selection priority. Both levels make tools available simultaneously. The issue is the tool description, not the configuration location.
- **D** (correct): When an MCP tool's description is sparse, the agent defaults to familiar built-in tools like Grep. Enhancing the description to explain its full customer records, transaction history, account status, and structured output makes the agent prefer it for relevant queries. This is the recommended fix for MCP tool underutilisation.

</details>

---

### Q075 (q-2-5-002) — single-choice

**Task statement:** 2.5 built-in-tools / edit-recovery · **Difficulty:** application · scenario: s4

**A developer is using Claude Code to update a configuration value in a file. They use the Edit tool, but it fails because the text they are trying to match appears in three places in the file. What is the correct next step?**

　 **A.** Switch to using Bash with sed to perform the replacement, as it handles multiple matches natively.

　 **B.** Use Grep to find which of the three occurrences is the correct one, then provide more surrounding context to Edit to make the match unique.

✅ **[CORRECT]** **C.** Fall back to Read to load the full file, then Write the complete modified file.

　 **D.** Use Glob to find all files containing the configuration value, then edit each one individually.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The exam guide names Read + Write as the documented fallback when Edit cannot find unique anchor text: load the full file with Read, then Write the complete modified file. That is the recovery path the exam tests for a non-unique match.

**Option breakdown:**

- **A** (incorrect): Sed bypasses the built-in tool designed for this task and may introduce errors with special characters. The exam expects the built-in tool sequence, which for a non-unique Edit failure is Read + Write.
- **B** (incorrect): Widening the anchor until it is unique, or using replace_all, is what current Claude Code documents and is sound engineering. It is not the fallback the exam guide names, and the guide is what this item tests: a non-unique Edit failure routes to Read + Write. See the lesson's current-state note for the divergence.
- **C** (correct): The exam guide names Read + Write as the documented fallback when Edit cannot find unique anchor text: load the full file with Read, then Write the complete modified file. That is the recovery path the exam tests for a non-unique match.
- **D** (incorrect): Glob searches file paths, not file contents. It cannot find files containing a specific value. Additionally, the problem is within a single file, not across multiple files.

</details>

---

### Q076 (q-2-3-003) — single-choice

**Task statement:** 2.3 tool-distribution-choice / tool-choice · **Difficulty:** application · scenario: s4

**A developer productivity platform uses an automated documentation agent. The agent must always extract metadata from source files before generating documentation, but in testing it sometimes skips the metadata extraction step and produces documentation from incomplete information. What is the correct tool_choice configuration to enforce the mandatory first step?**

　 **A.** Set tool_choice to 'auto' and add a system prompt instruction: 'You must call extract_metadata before any other tool.'

　 **B.** Set tool_choice to 'any' so the model must call a tool, relying on the tool description to guide it to extract_metadata first.

✅ **[CORRECT]** **C.** Set tool_choice to forced selection with the specific tool name extract_metadata for the first turn, then switch to 'auto' for subsequent turns.

　 **D.** Remove all other tools except extract_metadata from the agent's configuration so it has no choice.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Forced selection {'type': 'tool', 'name': 'extract_metadata'} ensures the model must call this specific tool. The model cannot skip it or choose a different tool. After the first turn completes, switching to 'auto' allows normal operation for documentation generation.

**Option breakdown:**

- **A** (incorrect): With 'auto', the model decides whether to call a tool at all. A system prompt instruction is advisory, not enforced — the model can still skip the step. This does not guarantee the mandatory first step.
- **B** (incorrect): 'any' forces the model to call a tool but lets it choose which one. It may select a different tool first, still skipping extract_metadata. This guarantees a tool call but not the correct tool call.
- **C** (correct): Forced selection {'type': 'tool', 'name': 'extract_metadata'} ensures the model must call this specific tool. The model cannot skip it or choose a different tool. After the first turn completes, switching to 'auto' allows normal operation for documentation generation.
- **D** (incorrect): This prevents the agent from performing any other task after metadata extraction. The agent needs access to documentation generation tools for subsequent steps. Forced tool selection achieves the constraint without crippling the agent.

</details>

---

### Q077 (q-2-1-003) — single-choice

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** recall · scenario: s1

**What is the primary mechanism an LLM uses to decide which tool to call when multiple tools are available?**

　 **A.** The tool's position in the tools array — tools listed first receive higher selection priority.

✅ **[CORRECT]** **B.** The tool's description — the model reads descriptions to match the current task to the most appropriate tool.

　 **C.** The tool's input schema — the model matches available parameters against user-provided data to select the best fit.

　 **D.** The tool's name — the model performs exact string matching between user intent keywords and tool names.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Tool descriptions are the primary mechanism for LLM tool selection. The model uses the description text to understand what each tool does, when to use it, and what it returns, then matches that against the current task.

**Option breakdown:**

- **A** (incorrect): Tool ordering in the array has no reliable effect on selection priority. The model uses semantic understanding of tool descriptions to make selection decisions.
- **B** (correct): Tool descriptions are the primary mechanism for LLM tool selection. The model uses the description text to understand what each tool does, when to use it, and what it returns, then matches that against the current task.
- **C** (incorrect): Input schemas help the model fill in parameters after selection, but the initial selection decision is driven by the tool description, not the parameter schema.
- **D** (incorrect): Tool names contribute to selection but are not the primary mechanism. The model does not perform exact string matching — it uses semantic understanding of the full description.

</details>

---

### Q078 (q-2-4-011) — single-choice

**Task statement:** 2.4 mcp-server-integration / mcp-protocol · **Difficulty:** recall · scenario: s4

**What message format does the Model Context Protocol (MCP) use for communication between clients and servers?**

　 **A.** REST over HTTP with standard GET/POST methods.

　 **B.** GraphQL over WebSocket for real-time bidirectional queries.

✅ **[CORRECT]** **C.** JSON-RPC 2.0 for structured request-response messaging.

　 **D.** gRPC with Protocol Buffers for high-performance serialisation.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Per the MCP specification, MCP uses JSON-RPC 2.0 to encode messages. JSON-RPC is the message format; the actual transports are stdio (for local servers) and Streamable HTTP (for remote servers). Don't confuse the two — JSON-RPC defines the envelope, the transport defines how bytes move.

**Option breakdown:**

- **A** (incorrect): MCP does not use REST. It uses JSON-RPC 2.0 to encode all messages, regardless of which transport (stdio or Streamable HTTP) carries them.
- **B** (incorrect): MCP does not use GraphQL. It uses JSON-RPC 2.0, a simpler remote-procedure-call format designed for structured tool invocations.
- **C** (correct): Per the MCP specification, MCP uses JSON-RPC 2.0 to encode messages. JSON-RPC is the message format; the actual transports are stdio (for local servers) and Streamable HTTP (for remote servers). Don't confuse the two — JSON-RPC defines the envelope, the transport defines how bytes move.
- **D** (incorrect): MCP does not use gRPC or Protocol Buffers. It uses JSON-RPC 2.0 with JSON serialisation for simplicity and broad compatibility.

</details>

---

### Q079 (q-2-4-009) — single-choice

**Task statement:** 2.4 mcp-server-integration / config-scope · **Difficulty:** recall · scenario: s4

**Where should a team-wide MCP server configuration be placed so that it is version-controlled and shared across all developers on the project?**

　 **A.** In ~/.claude.json inside each developer's personal home directory.

✅ **[CORRECT]** **B.** In the project's .mcp.json file, committed to the repository.

　 **C.** In environment variables exported on each developer's own machine.

　 **D.** In the system prompt, as an inline JSON block that defines the server connection.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** .mcp.json is project-scoped configuration that lives in the repository root. It is version-controlled, shared across all team members, and ensures consistent tool availability for the project.

**Option breakdown:**

- **A** (incorrect): ~/.claude.json is user-scoped configuration. It is not version-controlled and must be configured separately on each developer's machine. It is appropriate for personal or experimental servers, not team-wide integrations.
- **B** (correct): .mcp.json is project-scoped configuration that lives in the repository root. It is version-controlled, shared across all team members, and ensures consistent tool availability for the project.
- **C** (incorrect): Environment variables are not the standard MCP configuration mechanism. MCP uses .mcp.json for project-scoped and ~/.claude.json for user-scoped configuration.
- **D** (incorrect): System prompts are not the configuration mechanism for MCP servers. MCP servers are configured through dedicated configuration files, not embedded in prompts.

</details>

---

### Q080 (q-2-2-009) — single-choice

**Task statement:** 2.2 structured-error-responses / error-categories · **Difficulty:** recall · scenario: s1

**In structured error metadata for MCP tool responses, what are the four categories the exam guide names for the errorCategory field?**

　 **A.** client-side, server-side, network, and timeout errors.

✅ **[CORRECT]** **B.** transient, validation, business, and permission.

　 **C.** critical, warning, recoverable, and informational.

　 **D.** authentication, authorisation, rate-limit, and schema.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The four standard errorCategory values map onto distinct recovery strategies: 'transient' (resend the same request), 'validation' (correct the input, then send a new request), 'business' (escalate or take an alternative path), and 'permission' (request elevated credentials). Only 'transient' carries isRetryable: true, because it is the only case where the identical call can succeed on a second attempt. Conflating 'validation' with 'business' is a common error: a business rule violation will never succeed however the request is worded, whereas a validation error succeeds as soon as the agent fixes the input.

**Option breakdown:**

- **A** (incorrect): These are generic HTTP-style error categories, not the structured error metadata categories used in MCP. MCP categories are chosen to map directly onto agent recovery actions.
- **B** (correct): The four standard errorCategory values are: 'transient' for temporary failures like timeouts (isRetryable: true — resend as-is), 'validation' for malformed input from the agent (false — correct the input, then send a new call), 'business' for policy violations such as exceeding a refund limit (false — escalate or use an alternative path), and 'permission' for access denials (false — request elevated credentials).
- **C** (incorrect): These are log severity levels, not MCP error categories. MCP categories map to recovery strategies (retry, correct input, escalate, request credentials), not to severity.
- **D** (incorrect): These describe specific error types rather than the broader recovery-oriented categories. MCP uses transient, validation, business, and permission — each one encompassing several specific error types.

</details>

---

### Q081 (q-2-5-003) — single-choice

**Task statement:** 2.5 built-in-tools / grep-vs-glob · **Difficulty:** recall · scenario: s4

**In Claude Code, which built-in tool is specifically designed to search for patterns within file contents?**

　 **A.** Glob — it searches file contents using glob patterns.

　 **B.** Read — it loads a file and then searches the loaded contents for matching text.

✅ **[CORRECT]** **C.** Grep — it searches file contents for text patterns using regular expressions.

　 **D.** Edit — it scans files for matching text patterns before applying modifications.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Grep is the built-in tool designed for searching file contents. It accepts regular expression patterns and returns matching lines across files, making it the correct choice for finding code references, function calls, or any text within files.

**Option breakdown:**

- **A** (incorrect): Glob matches file paths and names, not file contents. It is used to find files by their location or naming pattern, not to search within them.
- **B** (incorrect): Read loads the contents of a specific file but does not search across files. It requires knowing the file path in advance and returns the full content, not search matches.
- **C** (correct): Grep is the built-in tool designed for searching file contents. It accepts regular expression patterns and returns matching lines across files, making it the correct choice for finding code references, function calls, or any text within files.
- **D** (incorrect): Edit modifies files by replacing specified text. While it matches text as part of the replacement process, it is not a search tool — it is a modification tool.

</details>

---

### Q082 (q-2-3-010) — single-choice

**Task statement:** 2.3 tool-distribution-choice / scoping · **Difficulty:** recall · scenario: s4

**What is the recommended maximum number of tools per agent to maintain reliable tool selection?**

　 **A.** 2-3 tools per agent.

✅ **[CORRECT]** **B.** 4-5 tools per agent.

　 **C.** 8-10 tools per agent.

　 **D.** There is no recommended limit — add as many tools as the agent's role requires.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The recommended maximum is 4-5 tools per agent. This range provides enough capability for a focused role while keeping decision complexity manageable for reliable tool selection.

**Option breakdown:**

- **A** (incorrect): While fewer tools improve selection accuracy, 2-3 is unnecessarily restrictive. Most agents need more tools to handle their assigned responsibilities effectively.
- **B** (correct): The recommended maximum is 4-5 tools per agent. This range provides enough capability for a focused role while keeping decision complexity manageable for reliable tool selection.
- **C** (incorrect): 8-10 tools exceeds the recommended range. At this count, tool selection accuracy degrades because the model must evaluate too many options, increasing the chance of misrouting.
- **D** (incorrect): There is a clear recommendation of 4-5 tools per agent. Exceeding this range degrades selection accuracy. When more tools are needed, splitting into multiple role-specific agents is the recommended approach.

</details>

---

### Q083 (q-2-2-004) — single-choice

**Task statement:** 2.2 structured-error-responses / transient-error · **Difficulty:** application · scenario: s1

**A customer support MCP server receives a request to look up a customer record, but the database connection times out after 30 seconds. The server needs to communicate this failure to the agent. What is the correct way to structure the MCP error response?**

　 **A.** Return an empty result with no error flag, and let the agent infer the failure from the missing data.

✅ **[CORRECT]** **B.** Set isError to true and return a structured response with errorCategory: 'transient', isRetryable: true, and a message describing the timeout.

　 **C.** Set isError to true and return errorCategory: 'business', isRetryable: false, since the operation could not be completed.

　 **D.** Throw an unhandled exception to let the MCP framework propagate the error to the agent automatically.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A database timeout is a transient error — the database may be available on the next attempt. Setting isError: true signals failure, errorCategory: 'transient' classifies it correctly, and isRetryable: true tells the agent it is safe to retry.

**Option breakdown:**

- **A** (incorrect): Returning empty results without error metadata makes the failure indistinguishable from a valid empty result (e.g. customer not found). The agent cannot determine whether to retry or accept the result.
- **B** (correct): A database timeout is a transient error — the database may be available on the next attempt. Setting isError: true signals failure, errorCategory: 'transient' classifies it correctly, and isRetryable: true tells the agent it is safe to retry.
- **C** (incorrect): A database timeout is not a business error. Business errors represent policy violations (such as exceeding a refund limit) that will never succeed on retry. A timeout is transient — the database may recover, making retry appropriate.
- **D** (incorrect): Unhandled exceptions produce generic error messages without structured metadata. The agent cannot distinguish error types or determine retry behaviour from an unhandled exception.

</details>

---

### Q084 (q-2-1-005) — single-choice

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** application · scenario: s1

**A customer support agent has two tools: get_customer_profile (returns name, email, preferences) and get_customer_orders (returns order history with statuses). Users frequently ask 'Tell me about customer X', and the agent calls both tools sequentially, doubling response time. 90% of 'tell me about' queries only need the profile. What is the best approach?**

　 **A.** Consolidate both tools into a single get_customer_info tool that returns all customer data in one call.

✅ **[CORRECT]** **B.** Refine the descriptions so get_customer_profile is the default and get_customer_orders is order-specific.

　 **C.** Add a system prompt instruction: 'When a user says tell me about, only call get_customer_profile.'

　 **D.** Set tool_choice to forced selection of get_customer_profile for all turns to prevent unnecessary order lookups.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Refining tool descriptions with clear boundaries and default routing guidance is the lowest-effort fix. The descriptions should specify when each tool is the right choice, directing the agent to call only the profile tool for general queries.

**Option breakdown:**

- **A** (incorrect): Consolidation returns order data on every call, wasting resources for the 90% of queries that only need profile data. It also increases the response payload size unnecessarily.
- **B** (correct): Refining tool descriptions with clear defaults is the lowest-effort fix. get_customer_profile should be marked the default for general 'tell me about' queries, directing the agent to call only the profile tool unless order details are explicitly requested.
- **C** (incorrect): Hard-coding keyword-to-tool mappings in the system prompt is brittle. It does not generalise to other phrasings like 'What do you know about customer X?' and will break if tool names change.
- **D** (incorrect): Forced selection prevents the agent from ever calling get_customer_orders, even when users specifically ask about orders. This solves the over-calling problem by crippling legitimate functionality.

</details>

---

### Q085 (q-2-4-010) — single-choice

**Task statement:** 2.4 mcp-server-integration / config-scope · **Difficulty:** scenario-analysis · scenario: s4

**A team's shared `.mcp.json` configures a PostgreSQL MCP server. A developer adds a personal staging database MCP server to their `~/.claude.json`, so both database tools are available in their session. When they query 'check user count', the agent calls the production tool instead of staging. What is the best resolution?**

　 **A.** Remove the production database from .mcp.json during testing so only the staging server is available.

✅ **[CORRECT]** **B.** Rename the staging tool to a distinct name, put its environment in the description, and add a session rule that staging tools take precedence.

　 **C.** Move the personal staging server into the shared .mcp.json beside production and let the agent pick between them from each server's connection string.

　 **D.** Use tool_choice with forced selection of the staging database tool for all turns during testing.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When two similar tools are available, description tuning alone cannot route an ambiguous prompt — the user said 'check user count' with no environment signal. The fix combines a distinct tool name, environment-aware description, and a session-level routing instruction. All three changes live in the developer's own ~/.claude.json so the shared team configuration is untouched.

**Option breakdown:**

- **A** (incorrect): Modifying the shared .mcp.json affects all team members and removes production access for legitimate use. The configuration should not be altered for one developer's testing needs.
- **B** (correct): Description tuning alone cannot route a context-free prompt like 'check user count' because the user gave the agent no environment cue. The fix is to make the two tools structurally distinguishable (distinct names, environment in the description) and to give the agent an explicit routing rule for the session. Renaming sits inside the developer's own ~/.claude.json so it does not affect the shared team configuration.
- **C** (incorrect): Personal staging infrastructure does not belong in the shared .mcp.json, and agents route by tool name and description, not by connection strings, so this neither isolates the config nor fixes selection.
- **D** (incorrect): Forced selection prevents the agent from calling any other tool, including production database queries that may be needed for comparison or non-test tasks during the session.

</details>

---

### Q086 (q-2-2-010) — single-choice

**Task statement:** 2.2 structured-error-responses / access-vs-empty · **Difficulty:** application · scenario: s1

**A customer support agent calls a payment processing tool to check a refund status. The tool returns: {"status": "success", "data": [], "message": "No refunds found for this transaction"}. The agent's recovery logic treats this as an error and retries the request. What is wrong with the agent's behaviour?**

　 **A.** The agent should retry more times, as the payment system may be slow to process refund records.

✅ **[CORRECT]** **B.** The agent wrongly treats a valid empty result as a failure, not a successful query that found no records.

　 **C.** The tool should not return an empty array — it should return an error with isRetryable: false to prevent the retry.

　 **D.** The agent should escalate to a human immediately instead of retrying, as payment queries should never be retried.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** An empty array result is not a failure when the status indicates success. The tool queried the payment system, found no refund records, and returned that information correctly. The agent should inform the customer that no refund exists for this transaction, not retry.

**Option breakdown:**

- **A** (incorrect): The tool returned status 'success' with a clear message. This is not a slow-processing issue — the query completed successfully and found no refunds. Retrying will produce the same result.
- **B** (correct): An empty array result is not a failure when the status indicates success. The tool queried the payment system, found no refund records, and returned that information correctly. The agent should inform the customer that no refund exists for this transaction, not retry.
- **C** (incorrect): The tool response is correct — a successful query with no results should return an empty array with a success status. The problem is the agent's recovery logic failing to distinguish valid empty results from actual errors.
- **D** (incorrect): There is nothing to escalate. The query succeeded and returned a valid result: no refunds exist. The agent should simply communicate this to the customer.

</details>

---

### Q087 (q-2-5-004) — single-choice

**Task statement:** 2.5 built-in-tools / edit-replace-all · **Difficulty:** application · scenario: s4

**A developer needs to rename a variable from 'userData' to 'customerData' in a specific file. The variable appears 12 times throughout the file. What is the most efficient approach using Claude Code's built-in tools?**

　 **A.** Use Grep to find all 12 occurrences, then call Edit 12 times, once for each occurrence with unique surrounding context.

　 **B.** Use Read to load the whole file, then Write the entire file back with all twelve of the occurrences changed by hand.

✅ **[CORRECT]** **C.** Use Edit with replace_all set to true, specifying 'userData' as the old string and 'customerData' as the new string.

　 **D.** Use Bash with sed to perform a global find-and-replace across the file.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The Edit tool's replace_all parameter replaces all occurrences of the specified string in a single operation. This is the most efficient approach for renaming a variable throughout a file.

**Option breakdown:**

- **A** (incorrect): Calling Edit 12 times is inefficient. The Edit tool's replace_all parameter is designed for exactly this use case — renaming a variable across an entire file in a single call.
- **B** (incorrect): Read + Write rewrites the entire file, which is wasteful for a simple rename. The Edit tool with replace_all handles this more efficiently by sending only the diff.
- **C** (correct): The Edit tool's replace_all parameter replaces all occurrences of the specified string in a single operation. This is the most efficient approach for renaming a variable throughout a file.
- **D** (incorrect): While sed can perform the replacement, the exam expects candidates to use built-in tools for file modifications. Edit with replace_all is the purpose-built tool for this task.

</details>

---

### Q088 (q-2-2-005) — single-choice

**Task statement:** 2.2 structured-error-responses / transient-error · **Difficulty:** scenario-analysis · scenario: s2

**A research agent calls an external API via an MCP server. After the 30th query in a batch of 50, the API starts returning HTTP 429 errors. The MCP server returns a generic 'Request failed' for every failure, so the agent abandons the batch after three consecutive failures. What MCP server change would most improve resilience?**

　 **A.** Implement automatic retry with exponential backoff inside the MCP server, hiding rate limits from the agent entirely.

✅ **[CORRECT]** **B.** Return errorCategory: 'transient', isRetryable: true, with a retryAfterMs field telling the agent how long to wait.

　 **C.** Return errorCategory: 'business', isRetryable: false to tell the agent to stop making requests entirely.

　 **D.** Queue all 50 requests at the MCP server level and process them sequentially with built-in rate limiting.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Rate limiting is a transient error — it will resolve after a delay. Structured metadata with the specific retry delay lets the agent space out remaining queries intelligently rather than abandoning the batch. The agent can continue processing other tasks while waiting.

**Option breakdown:**

- **A** (incorrect): Hiding rate limits from the agent removes its ability to make informed decisions, such as prioritising remaining queries, switching to cached results, or reporting partial progress. The agent should receive structured metadata to decide its own recovery strategy.
- **B** (correct): Rate limiting is a transient error — it will resolve after a delay. Structured metadata with the specific retry delay lets the agent space out remaining queries intelligently rather than abandoning the batch. The agent can continue processing other tasks while waiting.
- **C** (incorrect): Rate limits are transient (they resolve after a delay), not business errors (which represent policy or rule violations the agent cannot recover from). Marking them as non-retryable causes the agent to abandon 20 remaining queries that would succeed after a brief delay.
- **D** (incorrect): Server-side queuing removes the agent's ability to prioritise, cancel, or reorder queries based on intermediate results. It also creates a long-running blocking call that prevents the agent from doing other work.

</details>

---

### Q089 (q-2-1-006) — single-choice

**Task statement:** 2.1 tool-schema-design / boundary-descriptions · **Difficulty:** scenario-analysis · scenario: s1

**A platform has `search_knowledge_base` ('Searches help articles') and `process_action` ('Handles customer actions like refunds and plan changes'). The agent picks `search_knowledge_base` for 'cancel my subscription' requests. After adding 'subscription cancellations' to `process_action`'s description, it now picks `process_action` for knowledge queries like 'how does cancellation work?'. What is the most effective solution?**

✅ **[CORRECT]** **A.** Add boundary descriptions to both tools that separate executing a cancellation from learning how cancellation works.

　 **B.** Remove the word 'cancellation' from both tool descriptions to eliminate the keyword conflict entirely.

　 **C.** Consolidate search_knowledge_base and process_action into a single tool that determines the correct action based on user intent.

　 **D.** Add few-shot examples to the system prompt showing five cancellation scenarios with the correct tool for each.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Boundary descriptions that specify when to use each tool versus similar tools resolve ambiguity. The key distinction is intent: executing an action versus seeking information. Describing these boundaries explicitly in both tools prevents cross-routing in both directions.

**Option breakdown:**

- **A** (correct): Boundary descriptions resolve the ambiguity by intent. process_action should say to use it when the customer wants to execute a cancellation; search_knowledge_base should say to use it when the customer wants to learn about the process without taking action. Stating both boundaries prevents cross-routing in either direction.
- **B** (incorrect): Removing relevant keywords makes both tools less discoverable for cancellation-related queries. The solution is to differentiate when each tool handles cancellation, not to hide the concept from both.
- **C** (incorrect): Consolidation pushes the routing problem inside the tool implementation and loses the LLM's natural language understanding. Keeping tools separate with clear boundary descriptions is simpler and more maintainable.
- **D** (incorrect): Few-shot examples consume tokens and do not scale to the many variations of cancellation queries. Boundary descriptions in tool definitions are more efficient and generalise better.

</details>

---

### Q090 (q-2-3-006) — single-choice

**Task statement:** 2.3 tool-distribution-choice / tool-choice · **Difficulty:** application · scenario: s4

**A team's agent must generate a weekly report on the first turn of each conversation by calling `generate_report`. With `tool_choice: 'auto'`, the agent sometimes responds with a text summary instead. The team wants to guarantee `generate_report` is called on turn one while allowing normal tool selection afterwards. What is the correct configuration?**

　 **A.** Set tool_choice to 'any' on every turn of the conversation, so the agent is always obliged to call one of its available tools.

✅ **[CORRECT]** **B.** Set tool_choice to forced selection of generate_report for the first turn, then switch to 'auto' for subsequent turns.

　 **C.** Add a system prompt instruction stating 'Always call generate_report on the first turn' and leave tool_choice on 'auto'.

　 **D.** Remove all tools except generate_report from the first turn's tool list, then add the remaining tools for subsequent turns.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Forced selection with the specific tool name guarantees generate_report is called on the first turn. Switching to 'auto' afterwards restores normal behaviour where the model decides whether and which tools to call.

**Option breakdown:**

- **A** (incorrect): 'any' forces a tool call but does not guarantee which tool is called. The agent might call a different tool on the first turn. Additionally, forcing tool calls on every subsequent turn prevents normal text responses.
- **B** (correct): Forced selection with the specific tool name guarantees generate_report is called on the first turn. Switching to 'auto' afterwards restores normal behaviour where the model decides whether and which tools to call.
- **C** (incorrect): System prompt instructions are advisory, not enforced. With 'auto', the model can still choose to respond with text instead of calling the tool. This does not guarantee the mandatory first step.
- **D** (incorrect): While this would work, dynamically modifying the tool list between turns is unnecessarily complex. Forced tool_choice selection achieves the same guarantee with a simpler configuration change.

</details>

---

### Q091 (q-2-2-006) — single-choice

**Task statement:** 2.2 structured-error-responses / error-categories · **Difficulty:** scenario-analysis · scenario: s2

**A `search_papers` MCP tool has three failure patterns: (1) the upstream academic API returns HTTP 503 during peak hours, (2) users request papers from a restricted journal the system has no licence for, and (3) the agent submits a malformed DOI like 'doi-1234' that fails the input regex. The team wants structured error metadata so agents can handle each case differently. Which `errorCategory` and `isRetryable` combination is correct for all three?**

　 **A.** All three are errorCategory: 'transient' with isRetryable: true, since each one stops the tool completing its task.

✅ **[CORRECT]** **B.** HTTP 503: transient, isRetryable true; restricted journal: business, false; malformed DOI: validation, false.

　 **C.** HTTP 503: transient, isRetryable true; restricted journal: transient, true; malformed DOI: transient, true.

　 **D.** HTTP 503: validation, isRetryable false; restricted journal: business, false; malformed DOI: business, false.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The canonical four errorCategory values map cleanly to these three failure patterns, and isRetryable answers one narrow question: will resending this exact call work? Only HTTP 503 qualifies (transient, isRetryable: true). The restricted journal is a policy limitation (business, false — escalate or pick an alternative source) and the malformed DOI is a bad argument (validation, false — the agent must repair the format and issue a new call, not resend 'doi-1234'). Note that isRetryable: false is not 'give up': validation sits there too, and the agent recovers from it unaided.

**Option breakdown:**

- **A** (incorrect): Lumping every failure into 'transient' is the canonical anti-pattern. The restricted journal case is a business error (licence policy); the agent must escalate, not retry. The malformed DOI is validation; the agent must repair the input format first.
- **B** (correct): Only HTTP 503 is worth resending unchanged — a temporary upstream outage clears on its own. The restricted journal is a policy limitation (business) and the malformed DOI is a bad argument (validation); neither succeeds if the identical call goes out again, so both are isRetryable: false. The categories then split the recovery: the agent repairs the DOI itself, but a licence gap needs an alternative source or a human.
- **C** (incorrect): The restricted journal error is not transient — the system lacks a licence, and no amount of retrying will grant access. A malformed DOI is validation, not transient; 'doi-1234' fails the same regex on every attempt, so resending it unchanged is wasted work.
- **D** (incorrect): HTTP 503 is transient and worth resending — nothing is wrong with the request input, so marking it validation and non-retryable abandons a call that would have succeeded. A malformed DOI is validation, not business — business errors represent policy or rule violations, not input format problems.

</details>

---

### Q092 (q-2-5-005) — single-choice

**Task statement:** 2.5 built-in-tools / grep-then-read · **Difficulty:** application · scenario: s4

**A developer is investigating a production bug. They know the error message 'InvalidStateTransition' is logged somewhere in the codebase, but they do not know which files contain it or where the state machine is defined. What is the correct tool sequence to locate the bug?**

　 **A.** Use Glob for '**/*state*' to find state machine files, then Read each one to search for the error message.

✅ **[CORRECT]** **B.** Grep for 'InvalidStateTransition' across the codebase, then Read the matching files.

　 **C.** Use Read on common file locations like src/index.ts and src/app.ts to find the error manually.

　 **D.** Use Edit to search for 'InvalidStateTransition' and replace it with a more descriptive error message.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Grep searches file contents, making it the correct tool to locate all occurrences of the error string regardless of file name. Read then loads only the relevant files to understand context. This is the minimal, targeted approach.

**Option breakdown:**

- **A** (incorrect): Glob matches file paths, so it would find files with 'state' in the name, but the error string could appear in files without 'state' in their name. Reading every matched file wastes context tokens on files that may not contain the error.
- **B** (correct): Grep searches file contents, so it locates every occurrence of the error string regardless of file name. Read then loads only the matching files to understand the surrounding code and state machine logic. This is the minimal, targeted approach.
- **C** (incorrect): Guessing file locations is unreliable and wastes context tokens. The developer does not know where the error is defined, so a content search (Grep) is needed first.
- **D** (incorrect): Edit is a modification tool, not a search tool. Using it to locate code is incorrect, and modifying error messages without understanding the bug first could mask the real issue.

</details>

---

### Q093 (q-2-4-005) — single-choice

**Task statement:** 2.4 mcp-server-integration / env-vars · **Difficulty:** application · scenario: s4

**A platform engineering team wants to share an MCP server for their internal ticketing system across all developers using Claude Code. The server requires an API token unique to each developer. Where should the MCP server be configured, and how should credentials be managed?**

　 **A.** Add the server to .mcp.json in the project root with each developer's API token hard-coded in the configuration.

✅ **[CORRECT]** **B.** Add the server to .mcp.json using ${TICKETING_API_TOKEN} expansion so each developer sets their own token.

　 **C.** Have each developer add the server to their personal ~/.claude.json with their API token.

　 **D.** Create a shared .env file in the repository holding all the developer tokens, and reference it from .mcp.json.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Project-level .mcp.json is version-controlled and shared with the team, making the server available to everyone. Environment variable expansion keeps individual credentials out of version control whilst allowing each developer to authenticate with their own token.

**Option breakdown:**

- **A** (incorrect): Hard-coding individual tokens in .mcp.json commits credentials to version control, which is a security risk. Each developer has a different token, so a single hard-coded value would not work for the team.
- **B** (correct): Project-level .mcp.json is version-controlled and shared, making the server available to everyone. Environment variable expansion keeps individual credentials out of version control while letting each developer authenticate with their own token.
- **C** (incorrect): User-level ~/.claude.json is for personal or experimental servers. A team-wide integration should be in project-level .mcp.json so it is version-controlled and consistently available to all developers.
- **D** (incorrect): A shared .env file with all developer tokens still commits credentials to version control and creates a single file containing every team member's secrets, compounding the security risk.

</details>

---

### Q094 (q-2-4-006) — single-choice

**Task statement:** 2.4 mcp-server-integration / descriptions · **Difficulty:** application · scenario: s7

**An MCP server exposes a `query_database` tool for Snowflake. Agents ignore it and run SQL via the built-in Bash tool against the Snowflake CLI, even though the MCP tool returns structured results with column types and pagination that Bash does not. What is the most likely cause and fix?**

　 **A.** The MCP server is not properly connected. Restart the MCP server and verify the connection with a test query.

✅ **[CORRECT]** **B.** Enhance the sparse description to spell out the tool's structured output and pagination advantages over Bash.

　 **C.** Disable the Bash tool entirely so the agent is forced to use the MCP tool for all operations.

　 **D.** Add a system prompt instruction telling the agent to always use query_database instead of Bash for SQL queries.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When MCP tool descriptions are sparse, agents prefer familiar built-in tools like Bash. Enhancing the description to explain capabilities — structured results, column types, pagination — gives the agent enough information to prefer the MCP tool for database queries.

**Option breakdown:**

- **A** (incorrect): If the server were disconnected, the tool would not appear in the available tools list at all. The agent is choosing not to use it, which is a description problem, not a connectivity problem.
- **B** (correct): When MCP tool descriptions are sparse, agents default to the familiar Bash tool. Enhancing the description to explain the structured results, column types, and pagination gives the agent enough to prefer the MCP tool for database queries.
- **C** (incorrect): Disabling Bash removes a critical general-purpose tool needed for many operations beyond database queries. The fix should make the MCP tool more attractive for its specific use case, not remove other tools.
- **D** (incorrect): Whilst a system prompt instruction could work as a short-term fix, it is brittle and does not scale. The root cause is the sparse description. Enhancing the description is the sustainable fix that works across all agents and contexts.

</details>

---

### Q095 (q-2-4-007) — single-choice

**Task statement:** 2.4 mcp-server-integration / build-vs-use · **Difficulty:** application · scenario: s7

**An enterprise data platform team is evaluating how to integrate with their existing PostgreSQL database, Slack workspace, and a custom internal approval workflow. A developer proposes building three custom MCP servers. What is the correct approach?**

　 **A.** Build all three custom MCP servers to ensure tight integration with the team's specific requirements and coding standards.

✅ **[CORRECT]** **B.** Use community MCP servers for PostgreSQL and Slack, and build a custom server only for the internal approval workflow that has no community equivalent.

　 **C.** Skip MCP entirely and use direct API calls from Bash for all three integrations to avoid the overhead of running MCP servers.

　 **D.** Use community MCP servers for all three integrations, adapting the internal approval workflow to fit an existing community server's interface.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Community servers should be evaluated first for standard integrations. PostgreSQL and Slack have well-maintained community MCP servers. The internal approval workflow is team-specific with no community equivalent, making it the only justified custom build.

**Option breakdown:**

- **A** (incorrect): Building custom servers for PostgreSQL and Slack is unnecessary when well-maintained community servers already exist for these standard integrations. Custom builds should be reserved for genuinely unique workflows.
- **B** (correct): Community servers should be evaluated first for standard integrations. PostgreSQL and Slack have well-maintained community MCP servers. The internal approval workflow is team-specific with no community equivalent, making it the only justified custom build.
- **C** (incorrect): Direct API calls bypass the MCP tool interface, losing the benefits of structured tool descriptions, standardised error handling, and agent-native integration. MCP servers provide a consistent interface that agents understand natively.
- **D** (incorrect): Forcing a custom internal workflow into a community server's interface leads to awkward abstractions and missing functionality. The community-first principle applies to standard integrations, not to genuinely unique team-specific workflows.

</details>

---

### Q096 (q-2-5-006) — single-choice

**Task statement:** 2.5 built-in-tools / grep-then-edit · **Difficulty:** application · scenario: s4

**An engineering team needs to update all references to a renamed API endpoint across their 500,000-line codebase. They know the old endpoint name (POST /api/v1/users/create) but not which files reference it. After locating the files, they need to replace the old endpoint with the new one (POST /api/v2/users). What is the correct tool sequence?**

　 **A.** Use Glob for '**/*.md' to find all documentation files, then Read each one to check for the old endpoint, then use Edit to update matches.

　 **B.** Use Read on the API router file to find all of the endpoint definitions, then trace each of the references through by hand.

✅ **[CORRECT]** **C.** Grep for '/api/v1/users/create' to find every file with the old endpoint, then use Edit to replace it in each match.

　 **D.** Use Bash with sed to perform a global find-and-replace across all files in a single command.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Grep searches file contents across the entire codebase, locating all references regardless of file type or location. Edit then makes targeted replacements in each matched file. This is the minimal, precise approach.

**Option breakdown:**

- **A** (incorrect): Glob finds files by path pattern, but the endpoint reference could appear in any file type, not just Markdown. Reading every documentation file to search for the string wastes context tokens on irrelevant files.
- **B** (incorrect): This approach only finds where the endpoint is defined, not where it is referenced. It also requires knowing which file contains the router definition, and manual tracing is unreliable across a large codebase.
- **C** (correct): Grep searches file contents across the entire codebase, locating all references regardless of file type or location. Edit then makes targeted replacements in each matched file. This is the minimal, precise approach.
- **D** (incorrect): A global sed command bypasses the built-in tools designed for this task and risks unintended modifications without the ability to review each change. Edit provides targeted modifications with unique text matching for safety.

</details>

---

### Q097 (q-2-5-007) — single-choice

**Task statement:** 2.5 built-in-tools / edit-recovery · **Difficulty:** application · scenario: s4

**A developer asks Claude Code to modify a function in a large file. The Edit tool fails with a 'non-unique match' error because the target text appears in multiple locations within the file. What is the correct recovery approach?**

　 **A.** Switch to Bash with sed to perform the replacement using line numbers instead of text matching.

✅ **[CORRECT]** **B.** Use Read to load the full file contents, then use Write to output the complete modified file with the change applied.

　 **C.** Expand the Edit search string to include more surrounding context until it becomes unique in the file.

　 **D.** Split the file into smaller files so that each occurrence appears in only one file, then use Edit on each.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The exam guide names Read + Write as the documented fallback when Edit cannot find unique anchor text: load the full file with Read, then Write the complete modified file. That is the recovery path the exam tests for a non-unique match.

**Option breakdown:**

- **A** (incorrect): Bash with sed bypasses the Edit tool's safety guarantees and is fragile when line numbers shift. The guide's documented fallback for a non-unique match is Read + Write, not a shell rewrite.
- **B** (correct): The exam guide names Read + Write as the documented fallback when Edit cannot find unique anchor text: load the full file with Read, then Write the complete modified file. That is the recovery path the exam tests for a non-unique match.
- **C** (incorrect): Widening the anchor until it is unique, or using replace_all, is what current Claude Code documents and is sound engineering. It is not the fallback the exam guide names, and the guide is what this item tests: a non-unique Edit failure routes to Read + Write. See the lesson's current-state note for the divergence.
- **D** (incorrect): Restructuring files to accommodate tool limitations is disproportionate effort. The Edit tool's own recovery path (more context or replace_all) handles non-unique matches without changing the codebase.

</details>

---

### Q098 (q-2-1-007) — single-choice

**Task statement:** 2.1 tool-schema-design / system-prompt · **Difficulty:** application · scenario: s1

**A support agent has `process_refund` and `adjust_billing` tools with clearly differentiated descriptions, yet still occasionally calls `adjust_billing` for refund requests. The system prompt contains the instruction: 'For any billing-related concerns, prioritise resolving them quickly using available billing tools.' What is the root cause?**

　 **A.** The tool descriptions are still too similar and need further differentiation with explicit boundary statements.

✅ **[CORRECT]** **B.** The system prompt's 'billing' wording steers refund requests to adjust_billing, overriding the improved tool descriptions.

　 **C.** The model needs few-shot examples demonstrating that refund requests should use process_refund, not adjust_billing.

　 **D.** The two tools should be consolidated into a single financial_operation tool that handles both refunds and billing adjustments.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** System prompt wording can silently override well-written tool descriptions. The phrase 'billing-related concerns' matches refund requests that mention billing, causing the model to favour adjust_billing even when process_refund is the correct tool. Reviewing system prompts for conflicts after updating tool descriptions is essential.

**Option breakdown:**

- **A** (incorrect): The descriptions were already improved and clearly differentiate the tools. The misrouting persists because a system prompt instruction is creating an unintended association between the keyword 'billing' in refund requests and the billing tool.
- **B** (correct): System prompt wording can silently override well-written tool descriptions. The phrase 'billing-related concerns' matches refund requests that mention billing, causing the model to favour adjust_billing even when process_refund is the correct tool. Reviewing system prompts for conflicts after updating tool descriptions is essential.
- **C** (incorrect): Few-shot examples add token overhead and treat the symptom rather than the cause. The root issue is the system prompt instruction creating a conflicting signal that needs to be resolved directly.
- **D** (incorrect): Consolidation eliminates the useful distinction between refunds and billing corrections. The fix is to correct the system prompt instruction, not to merge tools that serve different purposes.

</details>

---

### Q099 (q-2-1-008) — single-choice

**Task statement:** 2.1 tool-schema-design / splitting · **Difficulty:** application · scenario: s4

**A developer productivity platform has a tool called analyze_content with the description 'Analyses content from various sources.' Logs show the agent uses it for web scraping, document parsing, and code analysis indiscriminately, leading to poor results for each use case. What is the most effective fix?**

　 **A.** Add detailed few-shot examples to the system prompt showing which types of content the tool handles well and which it does not.

　 **B.** Improve the tool description to list all supported content types and their expected formats.

✅ **[CORRECT]** **C.** Split analyze_content into purpose-specific tools: extract_web_results, parse_document, and analyze_code, each with a narrow remit.

　 **D.** Implement a routing layer that inspects the input content type and dispatches to the appropriate internal processing function within analyze_content.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Tool splitting replaces a generic tool with purpose-specific alternatives that each have a clear, narrow description. Each resulting tool handles one use case well, with defined input/output contracts that eliminate ambiguity about when to use it.

**Option breakdown:**

- **A** (incorrect): Few-shot examples add token overhead and treat the symptom. The root cause is that a single generic tool is trying to serve three distinct use cases, each requiring different processing logic.
- **B** (incorrect): A better description on a generic tool does not change the fact that the tool's processing logic is too broad. When a tool serves multiple distinct purposes, the fix is to split it into purpose-specific tools.
- **C** (correct): Tool splitting replaces a generic tool with purpose-specific alternatives that each have a clear, narrow description and defined input/output contracts. Each resulting tool handles one use case well, which eliminates ambiguity about when to use it.
- **D** (incorrect): An internal routing layer hides the content type distinction from the agent. Splitting into separate tools exposes the distinction through tool descriptions, enabling the LLM's natural language understanding to select the right tool.

</details>

---

### Q100 (q-2-3-007) — single-choice

**Task statement:** 2.3 tool-distribution-choice / role-scoping · **Difficulty:** application · scenario: s7

**An enterprise data platform agent has 22 tools available, including query tools for Snowflake, PostgreSQL, and third-party APIs, plus data transformation, visualisation, export, and administrative tools. The team notices the agent frequently selects the wrong query tool — choosing the Snowflake tool for data that lives in PostgreSQL. What is the most effective architectural fix?**

　 **A.** Improve the descriptions of all 22 tools to include explicit boundaries and data source mappings.

✅ **[CORRECT]** **B.** Split the agent into role-specific agents — a query agent with 4-5 data source tools, a transformation agent, and an export agent — each scoped to its specialisation.

　 **C.** Add a pre-processing step that analyses the user query to determine which data source is needed, then use tool_choice forced selection to call the correct query tool.

　 **D.** Consolidate all query tools into a single universal_query tool that internally routes to the correct data source based on the query syntax.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Tool overload at 22 tools degrades selection reliability. Splitting into role-specific agents with 4-5 tools each reduces decision complexity and scopes each agent to its specialisation. The query agent can focus on selecting the right data source without being distracted by transformation or export tools.

**Option breakdown:**

- **A** (incorrect): Task Statement 2.1 does teach descriptions as the first fix for misrouting, which is why this option is tempting, but that rule assumes the agent has a workable number of tools and simply cannot tell two of them apart. Here there are 22, well past the 4-5 range where selection stays reliable. Decision complexity degrades selection regardless of how well each description is written, so rewriting all 22 treats the symptom and leaves the cause.
- **B** (correct): Tool overload at 22 tools degrades selection reliability. Splitting into role-specific agents with 4-5 tools each reduces decision complexity and scopes each agent to its specialisation. The query agent can focus on selecting the right data source without being distracted by transformation or export tools.
- **C** (incorrect): Forced tool selection based on a pre-processing step is over-engineered and brittle. It bypasses the LLM's ability to reason about which tool to use and breaks when queries span multiple data sources.
- **D** (incorrect): A universal query tool hides the data source distinction from the agent. When the agent needs to reason about which data source contains the relevant data, it loses the ability to make that decision explicitly.

</details>

---

### Q101 (q-2-1-009) — single-choice

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** recall · scenario: s7

**An enterprise data platform exposes three MCP tools — query_snowflake, query_postgres, and fetch_api — each with a one-line description such as 'Queries the database.' What is the primary risk of these sparse tool descriptions?**

　 **A.** The agent will call all three tools in parallel for every query to maximise coverage.

✅ **[CORRECT]** **B.** The agent will misroute queries to the wrong data source because descriptions lack input formats, example queries, and boundary conditions.

　 **C.** The MCP server will reject queries that lack the correct parameters because descriptions do not specify required fields.

　 **D.** The agent will default to using Bash with direct CLI commands instead of calling any of the three MCP tools.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Sparse descriptions are the single most common cause of tool misrouting. Without input formats, example queries, edge cases, and boundaries explaining when each tool is appropriate, the agent cannot distinguish between similarly described tools.

**Option breakdown:**

- **A** (incorrect): Parallel invocation of all tools is not the typical failure mode of sparse descriptions. The agent selects tools based on description matching, and sparse descriptions cause misrouting rather than blanket invocation.
- **B** (correct): Sparse descriptions are the single most common cause of tool misrouting. Without input formats, example queries, edge cases, and boundaries explaining when each tool is appropriate, the agent cannot distinguish between similarly described tools.
- **C** (incorrect): Parameter validation is handled by the tool's input schema, not the description. Sparse descriptions cause the agent to choose the wrong tool, not to omit required parameters.
- **D** (incorrect): Whilst agents may prefer Bash over a single poorly described tool, having three database tools available makes it less likely the agent ignores all of them. The primary risk is misrouting between the three, not abandoning them entirely.

</details>

---

### Q102 (q-2-1-010) — single-choice

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** application · scenario: s7

**The data platform's query_snowflake tool has a description that reads: 'Queries Snowflake data warehouse. Accepts SQL.' The agent correctly uses the tool but frequently sends queries using PostgreSQL-specific syntax (e.g. string_agg, which Snowflake spells LISTAGG) that Snowflake rejects. What is the most effective fix?**

　 **A.** Add a SQL syntax validation layer in front of the MCP tool that rejects non-Snowflake syntax before execution.

✅ **[CORRECT]** **B.** State in the tool description that it expects the Snowflake SQL dialect, not PostgreSQL.

　 **C.** Add a system prompt instruction listing all Snowflake-specific SQL functions the agent should use.

　 **D.** Have the MCP server automatically translate PostgreSQL syntax to Snowflake syntax before executing the query.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The description says 'Accepts SQL' without specifying the dialect. The agent defaults to PostgreSQL syntax because it has no guidance on dialect differences. Adding dialect-specific examples and boundary conditions in the description directly resolves the misrouting.

**Option breakdown:**

- **A** (incorrect): A validation layer adds infrastructure complexity and maintenance burden. The root cause is that the tool description does not specify which SQL dialect to use. Fixing the description is the proportionate first step.
- **B** (correct): The description says 'Accepts SQL' without naming the dialect, so the agent defaults to PostgreSQL syntax. Naming the Snowflake dialect and giving examples in the description (LISTAGG rather than string_agg, ILIKE is supported) resolves the misrouting at source.
- **C** (incorrect): A system prompt instruction is brittle and consumes context tokens for every turn, even when the Snowflake tool is not being used. The tool description is the correct place for tool-specific dialect guidance.
- **D** (incorrect): Auto-translation is fragile and cannot handle all dialect differences. It masks the problem rather than fixing it and introduces a complex transformation layer prone to edge cases.

</details>

---

### Q103 (q-2-2-007) — single-choice

**Task statement:** 2.2 structured-error-responses / error-categories · **Difficulty:** scenario-analysis · scenario: s7

**A `query_postgres` MCP tool returns 500 on transient server overload and 404 on missing tables. The agent retries both identically, exhausting retries on missing tables and then failing to retry once the server recovers. What change to the error response structure would fix this?**

　 **A.** Return all errors with the MCP isError flag set to true and include the HTTP status code in the error message text so the agent can parse it.

✅ **[CORRECT]** **B.** Add a structured category field so the agent retries transient errors but not permanent errors like a missing table.

　 **C.** Remove the retry logic entirely and escalate all errors to the user immediately for manual resolution.

　 **D.** Increase the retry limit from 3 to 10 so the agent has enough attempts to cover both transient and permanent errors.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Structured error categories give the agent explicit guidance on recovery strategy. Transient errors (overload, timeout) warrant retries. A missing table is a permanent failure: the resource does not exist, so retrying the identical request never helps. This eliminates wasted retries on unrecoverable errors.

**Option breakdown:**

- **A** (incorrect): Embedding status codes in free-text messages requires the agent to parse unstructured text, which is unreliable. Structured error categorisation is more robust than parsing status codes from strings.
- **B** (correct): Structured error categories give the agent explicit recovery guidance. Transient errors (overload, timeout) warrant retries; a missing table is a permanent failure that retrying never resolves, since the table still will not exist on the next attempt. This eliminates wasted retries on unrecoverable errors.
- **C** (incorrect): Removing retries eliminates the agent's ability to recover from transient failures automatically. The goal is smarter retries, not no retries.
- **D** (incorrect): More retries waste time on permanent errors (missing tables will never appear) and add unnecessary latency. The problem is retry categorisation, not retry count.

</details>

---

### Q104 (q-2-3-008) — single-choice

**Task statement:** 2.3 tool-distribution-choice / consolidation · **Difficulty:** scenario-analysis · scenario: s7

**The data platform team has built an MCP server with 22 tools: query_snowflake, query_postgres, query_api, plus 19 specialised tools for individual data transformations (pivot_table, calculate_percentile, normalise_currency, etc.). Agents take 3-4 turns to select the correct tool and frequently choose the wrong transformation. What is the most effective redesign?**

　 **A.** Improve all 22 tool descriptions with detailed examples and boundary conditions to help the agent distinguish between them.

✅ **[CORRECT]** **B.** Consolidate the 19 transformation tools into a single transform_data tool with a transform_type parameter, reducing the total to 4 tools.

　 **C.** Use tool_choice: 'any' to force the agent to always call a tool, eliminating turns where the agent reasons without acting.

　 **D.** Split the tools across two separate MCP servers — one for queries and one for transformations — to reduce cognitive load.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Reducing from 22 to 4 tools brings the count within the optimal 4-5 range for reliable tool selection. The 19 transformation tools share a common pattern (input data, transformation type, output format) and are natural candidates for consolidation into a single parameterised tool.

**Option breakdown:**

- **A** (incorrect): Better descriptions help, but 22 tools still exceeds the practical limit for reliable selection. Research shows tool selection degrades significantly beyond 4-5 tools per agent. The tool count itself is the problem.
- **B** (correct): Reducing from 22 to 4 tools brings the count within the optimal 4-5 range for reliable tool selection. The 19 transformation tools share a common pattern (input data, transformation type, output format) and are natural candidates for consolidation into a single parameterised tool.
- **C** (incorrect): Forcing tool calls does not improve selection accuracy — it just ensures the agent picks something, potentially the wrong tool. The root cause is too many similar tools, not too few tool calls.
- **D** (incorrect): MCP server boundaries are invisible to the agent. All tools from all connected servers appear in a single list. Splitting across servers does not reduce the number of tools the agent must choose from.

</details>

---

### Q105 (q-2-3-009) — single-choice

**Task statement:** 2.3 tool-distribution-choice / scoping-limit · **Difficulty:** recall · scenario: s7

**What is the recommended maximum number of tools per agent for reliable tool selection, and what happens when this limit is significantly exceeded?**

　 **A.** 10-15 tools per agent. Exceeding it mainly slows response times; selection accuracy stays stable because the model still evaluates each tool independently.

✅ **[CORRECT]** **B.** 4-5 tools. Exceeding this significantly, say 18 or more, sharply degrades selection accuracy.

　 **C.** There is no practical limit. Tool selection scales linearly with the number of available tools.

　 **D.** 1-2 tools. Any more than 2 tools requires a dedicated tool router agent.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Research and practice show that 4-5 tools per agent is optimal for reliable selection. At 18+ tools, the agent wastes turns choosing between similar options and frequently misroutes. Consolidation and role-based tool distribution are the standard remedies.

**Option breakdown:**

- **A** (incorrect): 10-15 is well above the recommended range. The primary impact of too many tools is degraded selection accuracy, not slower response times.
- **B** (correct): Research and practice show that 4-5 tools per agent is optimal for reliable selection. At 18+ tools, the agent wastes turns choosing between similar options and frequently misroutes. Consolidation and role-based tool distribution are the standard remedies.
- **C** (incorrect): Tool selection does not scale linearly. Accuracy degrades as the tool count increases, with diminishing returns on description quality once the count exceeds 4-5.
- **D** (incorrect): 1-2 tools is overly restrictive. Agents handle 4-5 tools well without dedicated routing. A router agent is only needed when the total exceeds practical limits across a multi-agent system.

</details>

---

### Q106 (q-2-4-008) — single-choice

**Task statement:** 2.4 mcp-server-integration / config-scope · **Difficulty:** application · scenario: s7

**The data platform team needs to share their Snowflake and PostgreSQL MCP server configurations with all team members whilst allowing individual developers to experiment with a personal API integration server. Where should each configuration be placed?**

　 **A.** Place all three servers in the project-level .mcp.json so they are version-controlled and consistent across the team.

✅ **[CORRECT]** **B.** Place the Snowflake and PostgreSQL servers in the project-level .mcp.json, and personal API integration servers in user-level ~/.claude.json.

　 **C.** Place all three servers in ~/.claude.json and have each developer copy the configuration manually.

　 **D.** Place the database servers in environment variables and reference them in both .mcp.json and ~/.claude.json.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Project-level .mcp.json is version-controlled and shared — correct for team-wide database integrations. User-level ~/.claude.json is machine-specific — correct for personal experimental servers that should not affect other team members.

**Option breakdown:**

- **A** (incorrect): Personal experimental servers should not be in project-level configuration. Changes to personal servers would create unnecessary merge conflicts and force experimental integrations on the entire team.
- **B** (correct): Project-level .mcp.json is version-controlled and shared — correct for team-wide database integrations. User-level ~/.claude.json is machine-specific — correct for personal experimental servers that should not affect other team members.
- **C** (incorrect): User-level configuration is not version-controlled and requires manual synchronisation. Team-wide servers belong in project-level .mcp.json for consistency and change tracking.
- **D** (incorrect): Environment variables are used for credentials (connection strings, API keys), not for MCP server configuration. The server definitions themselves belong in .mcp.json or ~/.claude.json depending on scope.

</details>

---

### Q107 (q-2-5-008) — single-choice

**Task statement:** 2.5 built-in-tools / grep-vs-glob · **Difficulty:** scenario-analysis · scenario: s7

**A developer is investigating a data inconsistency in the platform codebase. They need to find all files that reference a specific Snowflake table name 'fact_revenue_daily' and then check the directory structure for related migration files. Which tool sequence is correct?**

　 **A.** Glob for '**/*fact_revenue_daily*' to find references, then Glob for '**/migrations/**' to find migration files.

　 **B.** Read all SQL files in the project to search for the table name, then Read all migration files.

✅ **[CORRECT]** **C.** Grep for 'fact_revenue_daily' to find all content references, then Glob for '**/migrations/*.sql' to find migration files by path pattern.

　 **D.** Grep for 'fact_revenue_daily' for both steps — first to find references, then to find migration files containing the table.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Grep searches file contents — correct for finding code that references the table name. Glob matches file paths — correct for finding migration files by directory pattern. This is the optimal two-step sequence using each tool for its strength.

**Option breakdown:**

- **A** (incorrect): Glob matches file paths by name, not file contents. It would find files named after the table (unlikely) but miss all files that reference the table name in their code.
- **B** (incorrect): Reading all files upfront is a context-budget anti-pattern. It wastes tokens on irrelevant files and is exactly the approach the exam penalises.
- **C** (correct): Grep searches file contents — correct for finding code that references the table name. Glob matches file paths — correct for finding migration files by directory pattern. This is the optimal two-step sequence using each tool for its strength.
- **D** (incorrect): Using Grep for both steps would find migration files that mention the table, but would miss migration files related to the table that do not contain its name (e.g. schema migrations, index changes). Glob is the correct tool for path-based file discovery.

</details>

---

### Q108 (q-2-2-008) — single-choice

**Task statement:** 2.2 structured-error-responses / access-vs-empty · **Difficulty:** application · scenario: s7

**The data platform's fetch_api tool calls a third-party pricing API. When the API key has expired, the tool returns { "data": [], "status": "ok" } instead of signalling an authentication failure. The agent tells the user 'No pricing data is available for that product' and moves on. What is the root cause?**

　 **A.** The agent should be instructed via the system prompt to treat empty arrays as errors and retry with exponential backoff.

✅ **[CORRECT]** **B.** The tool cannot distinguish an access failure (expired key) from a valid empty result, so the agent treats a permission error as no data.

　 **C.** The third-party API is poorly designed. The platform team should switch to a different pricing provider that returns proper HTTP error codes.

　 **D.** The agent's context window is too small to hold the full API response, so it receives a truncated version that appears empty.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The tool returns the same structure for two fundamentally different outcomes: 'I could not access the data' versus 'I accessed the data and found nothing.' The agent cannot distinguish these and accepts the empty result at face value. The tool must return a structured error with the MCP isError flag for authentication failures.

**Option breakdown:**

- **A** (incorrect): Not all empty arrays are errors — a product with no pricing data is a valid empty result. The problem is that the tool masks an authentication failure as a successful empty response. System prompt instructions cannot reliably distinguish the two.
- **B** (correct): The tool returns the same structure for two fundamentally different outcomes: 'I could not access the data' versus 'I accessed the data and found nothing.' The agent cannot distinguish these and accepts the empty result at face value. The tool must return a structured error with the MCP isError flag for authentication failures.
- **C** (incorrect): Whilst the upstream API behaviour is unhelpful, the platform team controls the MCP tool layer. The tool should detect the authentication failure (even from the upstream response) and translate it into a structured MCP error rather than passing through the misleading response.
- **D** (incorrect): Context window truncation would not produce a well-formed { "data": [], "status": "ok" } response. The problem is semantic — the tool is returning a misleading success status for an authentication failure.

</details>

---

### Q109 (q-2-4-012) — single-choice

**Task statement:** 2.4 mcp-server-integration / resources · **Difficulty:** application · scenario: s7

**A data-analysis agent connects to an MCP server that exposes 40 database tables. Before almost every query, the agent makes several exploratory tool calls to discover which tables exist and what columns they hold, adding latency and token cost to each task. The server author wants to remove this discovery overhead. What is the most effective change?**

✅ **[CORRECT]** **A.** Expose the table catalogue and column schemas as MCP resources for upfront visibility.

　 **B.** Add a describe_schema tool and instruct the agent in its system prompt to call it before every query.

　 **C.** Enlarge the agent's context window so it can retain the results of the discovery calls across turns.

　 **D.** Reduce the server to the five most frequently queried tables so there is less to discover.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** MCP resources expose content catalogues (e.g. database schemas) so agents gain upfront visibility into available data without exploratory tool calls, cutting latency and token cost.

**Option breakdown:**

- **A** (correct): MCP resources expose content catalogues such as database schemas, documentation hierarchies, and issue summaries, giving the agent visibility into available data upfront. The agent no longer needs to call list_tables and then describe_table for each table, which removes the discovery overhead entirely.
- **B** (incorrect): This keeps an exploratory tool call on every task, which is the exact overhead the author wants to remove. Resources present the catalogue without a per-task call.
- **C** (incorrect): A larger context window does not stop the agent making the discovery calls; it still pays the latency and token cost on each task and merely stores the results.
- **D** (incorrect): This discards capability the agent legitimately needs and still leaves discovery calls for the remaining tables. It treats the symptom, not the discovery mechanism.

</details>

---

### Q110 (q-2-1-011) — multiple-response (select 3)

**Task statement:** 2.1 tool-schema-design / descriptions · **Difficulty:** application · scenario: s7

_Select 3 options._

**Your federated query platform exposes several similar search tools, and Claude keeps routing requests to the wrong one. Which changes improve tool selection reliability? (Select 3)**

✅ **[CORRECT]** **A.** Rename tools whose names overlap so each name reflects a distinct function.

　 **B.** Trim every description to one short sentence so the model relies on tool names alone.

✅ **[CORRECT]** **C.** Check the system prompt for keyword-sensitive instructions that create unintended associations with particular tools.

✅ **[CORRECT]** **D.** Rewrite each description to state the tool's purpose, inputs and outputs, and when to prefer it.

　 **E.** Merge the similar tools into one generic tool with a mode parameter.

<details><summary><b>Answer</b>: A, C, D</summary>

**Rationale:** Misrouting between similar tools is fixed by differentiated descriptions, distinct names, and a system prompt that does not fight the tool definitions.

**Option breakdown:**

- **A** (correct): The guide's example renames analyze_content to extract_web_results, removing the functional overlap that caused misrouting.
- **B** (incorrect): Minimal descriptions cause unreliable selection among similar tools; names alone cannot carry boundary information.
- **C** (correct): System prompt wording can override well-written descriptions, so it belongs in the same review.
- **D** (correct): Descriptions are the primary signal Claude uses to choose tools; differentiating them is the first fix for misrouting.
- **E** (incorrect): The guide moves in the opposite direction: split generic tools into purpose-specific tools with defined contracts.

</details>

---

### Q111 (q-2-2-011) — multiple-response (select 3)

**Task statement:** 2.2 structured-error-responses / error-context · **Difficulty:** application · scenario: s2

_Select 3 options._

**A research subagent's database query fails partway through an investigation. Which pieces of information belong in the structured error context it returns to the coordinator? (Select 3)**

　 **A.** No report at all: the subagent should retry silently until the query succeeds.

✅ **[CORRECT]** **B.** Partial results gathered before the failure.

✅ **[CORRECT]** **C.** The failure type, such as transient, validation, or permission.

✅ **[CORRECT]** **D.** What was attempted, including the query that failed.

　 **E.** A plain 'no results found' message in place of the error.

<details><summary><b>Answer</b>: B, C, D</summary>

**Rationale:** Structured error context (failure type, what was attempted, partial results) lets the coordinator handle errors consistently instead of guessing, and keeps access failures distinguishable from valid empty results.

**Option breakdown:**

- **A** (incorrect): Silent retries hide failures from the coordinator, which owns error handling and needs observability into what went wrong.
- **B** (correct): Partial results preserve completed work so the coordinator does not re-run what already succeeded.
- **C** (correct): Categorising the failure lets the coordinator make the right retry-or-reroute decision.
- **D** (correct): The attempted query gives the coordinator enough detail to retry intelligently or reformulate the request.
- **E** (incorrect): Reporting an access failure as an empty result conflates two different situations and hides the need for a retry decision.

</details>

---


## Domain 3 — Claude Code Configuration & Workflows (20%)

_56 questions_

### Q112 (q-3-1-001) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / hierarchy · **Difficulty:** application · scenario: s3

**Developer A's Claude Code follows the team's API naming conventions perfectly. Developer B, who joined last week, gets inconsistent naming from Claude Code. Both are working on the same repo, same branch. What is the most likely root cause?**

　 **A.** Developer B has not run /memory to load the configuration files into the session.

✅ **[CORRECT]** **B.** The API naming conventions live in Developer A's user-level CLAUDE.md, not the project-level configuration

　 **C.** Developer B needs to install an MCP server before the naming convention rules become available to Claude Code.

　 **D.** The conventions are in a .claude/rules/ file that Developer B's editor is not configured to load, so they never reach his session

<details><summary><b>Answer</b>: B</summary>

**Rationale:** User-level CLAUDE.md is not version-controlled or shared via git. Developer A has the instructions locally; Developer B, having just joined, does not. Moving instructions to project-level config (.claude/CLAUDE.md) would fix this.

**Option breakdown:**

- **A** (incorrect): /memory is a debugging command to verify what is loaded, not a command to trigger loading. Configuration files load automatically.
- **B** (correct): User-level CLAUDE.md is not version-controlled or shared via git. Developer A has the instructions locally; Developer B, having just joined, does not. Moving instructions to project-level config (.claude/CLAUDE.md) would fix this.
- **C** (incorrect): MCP servers provide tool integrations, not CLAUDE.md configuration. Naming conventions belong in CLAUDE.md files.
- **D** (incorrect): Rule files in .claude/rules/ are version-controlled and loaded by Claude Code from the repository, not by the editor. On the same repo and branch, both developers get identical rule loading, so an 'editor not loading rules' story cannot explain the difference.

</details>

---

### Q113 (q-3-2-001) — single-choice

**Task statement:** 3.2 slash-commands-skills / commands-vs-skills · **Difficulty:** scenario-analysis · scenario: s3

**A team wants a /review command available to everyone who clones the repository. A developer also wants a personal /brainstorm skill that produces verbose codebase analysis output without cluttering the main conversation. Where should each be created and what configuration does the skill need?**

　 **A.** Both in .claude/commands/ with the brainstorm skill using context: fork

✅ **[CORRECT]** **B.** /review in .claude/commands/ for team sharing; /brainstorm as a SKILL.md in ~/.claude/skills/ with context: fork frontmatter

　 **C.** /review in CLAUDE.md as a documented procedure; /brainstorm in .claude/skills/ with allowed-tools restrictions

　 **D.** Both in ~/.claude/commands/ with instructions for each developer to copy them locally

<details><summary><b>Answer</b>: B</summary>

**Rationale:** /review needs to be project-scoped (.claude/commands/ or equivalently .claude/skills/) so it is shared via version control. Both paths create identical /commands. /brainstorm is personal, so it goes in ~/.claude/skills/. context: fork isolates the verbose analysis output from the main conversation.

**Option breakdown:**

- **A** (incorrect): The /brainstorm skill should be personal (not shared with the team), so it should not go in the project-scoped .claude/commands/ directory.
- **B** (correct): /review needs to be project-scoped (.claude/commands/ or equivalently .claude/skills/) so it is shared via version control. Both paths create identical /commands. /brainstorm is personal, so it goes in ~/.claude/skills/. context: fork isolates the verbose analysis output from the main conversation.
- **C** (incorrect): CLAUDE.md is for always-loaded standards, not command definitions. The brainstorm skill needs context: fork for output isolation, not just allowed-tools.
- **D** (incorrect): ~/.claude/commands/ (or equivalently ~/.claude/skills/) is user-scoped and not shared via version control. Requiring manual copying defeats the purpose of project-scoped configuration.

</details>

---

### Q114 (q-3-3-001) — single-choice

**Task statement:** 3.3 path-specific-rules / glob-patterns · **Difficulty:** application · scenario: s5

**A codebase has test files co-located with source files throughout 50+ directories (e.g., Button.test.tsx next to Button.tsx). The team wants all tests to follow the same conventions regardless of location. What is the most maintainable approach?**

✅ **[CORRECT]** **A.** Create a .claude/rules/ file with frontmatter paths: ["**/*.test.tsx", "**/*.test.ts"] holding the test conventions

　 **B.** Place a copy of the CLAUDE.md file in every one of the 50+ directories that contain test files alongside their source.

　 **C.** Add all of the test conventions to the root CLAUDE.md file so that every session picks them up automatically at start.

　 **D.** Create a skill in .claude/skills/ with a paths frontmatter matching the test files so it auto-activates whenever a test file is edited

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Glob patterns in .claude/rules/ match files by pattern across the entire codebase. The conventions load automatically when editing any test file, regardless of directory. No maintenance burden as new test files are added.

**Option breakdown:**

- **A** (correct): Glob patterns in .claude/rules/ match files by pattern across the entire codebase. The conventions load automatically when editing any test file, regardless of directory. No maintenance burden as new test files are added.
- **B** (incorrect): With 50+ directories, this creates massive duplication and maintenance burden. Every new directory with tests would need a copy.
- **C** (incorrect): Root CLAUDE.md loads for every session. Test conventions would consume tokens even when editing non-test files like API handlers or database models.
- **D** (incorrect): Skills can auto-activate via a paths frontmatter, but they load on demand as a task-style workflow, not as always-in-context guidance. Test conventions must shape every edit to a matching file, which is what .claude/rules/ provides: rules load into context automatically when Claude reads a matching file, with no invocation step.

</details>

---

### Q115 (q-3-4-001) — single-choice

**Task statement:** 3.4 plan-mode-execution / mode-selection · **Difficulty:** application · scenario: s3

**Your team faces three tasks: (1) restructure a monolith into microservices, (2) fix a null pointer exception in a single function with a clear stack trace, (3) migrate from one logging library to another across 30 files. Which mode should be used for each?**

　 **A.** Plan mode for all three, since they all involve code changes

✅ **[CORRECT]** **B.** Plan mode for (1) and (3), direct execution for (2)

　 **C.** Plan mode for (1), direct execution for (2) and (3)

　 **D.** Direct execution for all three with comprehensive upfront instructions

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Task 1 involves architectural decisions with multiple valid approaches. Task 3 affects 30 files with a pattern that needs design before execution. Task 2 is a single-function fix with a clear stack trace — direct execution is appropriate.

**Option breakdown:**

- **A** (incorrect): Task 2 is a well-understood, limited-scope bug fix. Plan mode would waste time for a change where the problem and solution are already clear.
- **B** (correct): Task 1 involves architectural decisions with multiple valid approaches. Task 3 affects 30 files with a pattern that needs design before execution. Task 2 is a single-function fix with a clear stack trace — direct execution is appropriate.
- **C** (incorrect): Task 3 affects 30 files and requires a consistent migration strategy. Without planning, you risk inconsistent application of the logging library change across files.
- **D** (incorrect): Task 1 (monolith restructuring) requires codebase exploration and architectural design. Comprehensive upfront instructions assume you already know the right structure without exploring.

</details>

---

### Q116 (q-3-5-001) — single-choice

**Task statement:** 3.5 iterative-refinement / examples · **Difficulty:** application · scenario: s3

**A developer describes a code transformation in prose. Claude Code interprets it differently each time, producing inconsistent results. What technique should the developer try first?**

　 **A.** Rewrite the prose description with more precise language and technical terminology

✅ **[CORRECT]** **B.** Provide 2-3 concrete input/output examples showing the exact before and after transformation

　 **C.** Use the interview pattern to have Claude ask clarifying questions before implementing

　 **D.** Write a test suite first and iterate by sharing test failures

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Concrete examples eliminate interpretation ambiguity. The model generalises from examples more reliably than from descriptions. This is the documented first-line technique for inconsistent interpretation.

**Option breakdown:**

- **A** (incorrect): More precise prose still relies on the model's interpretation of natural language. If interpretation is inconsistent, more prose will not solve the root cause.
- **B** (correct): Concrete examples eliminate interpretation ambiguity. The model generalises from examples more reliably than from descriptions. This is the documented first-line technique for inconsistent interpretation.
- **C** (incorrect): The interview pattern is best for unfamiliar domains where the developer might miss considerations. When the developer knows the exact transformation but the model interprets it inconsistently, examples are the direct fix.
- **D** (incorrect): Test-driven iteration is effective but is a more heavyweight approach. Concrete examples are the faster first step when the issue is inconsistent interpretation of a known transformation.

</details>

---

### Q117 (q-3-6-001) — single-choice

**Task statement:** 3.6 cicd-integration / p-flag · **Difficulty:** application · scenario: s5

**A CI pipeline script runs 'claude "Analyse this PR"' but the job hangs indefinitely. Logs show Claude Code is waiting for interactive input. What is the correct fix?**

✅ **[CORRECT]** **A.** Add the -p flag: claude -p "Analyse this PR"

　 **B.** Set the environment variable CLAUDE_HEADLESS=true before running the command

　 **C.** Redirect stdin from /dev/null: claude "Analyse this PR" < /dev/null

　 **D.** Add the --batch flag: claude --batch "Analyse this PR"

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The -p (--print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input.

**Option breakdown:**

- **A** (correct): The -p (--print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input.
- **B** (incorrect): CLAUDE_HEADLESS is not a real Claude Code environment variable. This option references a non-existent feature.
- **C** (incorrect): Unix stdin redirection does not properly address Claude Code's interactive mode. The -p flag is the correct, documented approach.
- **D** (incorrect): --batch is not a real Claude Code CLI flag. This option references a non-existent feature.

</details>

---

### Q118 (q-3-3-008) — single-choice

**Task statement:** 3.3 path-specific-rules / paths-frontmatter · **Difficulty:** scenario-analysis · scenario: s3

**A large TypeScript monorepo has a root CLAUDE.md with universal coding standards and a .claude/rules/ directory with topic-specific rule files. A developer notices that conventions from testing.md in .claude/rules/ are loading even when editing API handler files, consuming unnecessary tokens. The testing.md file has no YAML frontmatter. What should the developer do to fix this?**

　 **A.** Move testing.md out of .claude/rules/ and into a directory-level CLAUDE.md inside the test folder

　 **B.** Add the testing conventions to the root CLAUDE.md instead, since rules files cannot be path-scoped

✅ **[CORRECT]** **C.** Add YAML frontmatter with a paths field of test-file globs to testing.md so it loads only for test files

　 **D.** Use an @./.claude/rules/testing.md line in the root CLAUDE.md so the file only loads when the import is reached

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Without YAML frontmatter, rule files in .claude/rules/ load for all sessions. Adding a paths field with glob patterns restricts loading to sessions where the developer is editing matching files. This is the correct approach for token-efficient, conditional convention loading.

**Option breakdown:**

- **A** (incorrect): Test files are co-located with source files throughout 200+ packages in this monorepo. A directory-level CLAUDE.md in a single test folder would not cover test files in other directories, and creating one in every directory would be unmaintainable.
- **B** (incorrect): Rules files absolutely support path scoping via YAML frontmatter with a paths field. Moving conventions to root CLAUDE.md would make the token efficiency problem worse, not better, because root CLAUDE.md loads for every session.
- **C** (correct): Without YAML frontmatter, rule files in .claude/rules/ load for all sessions. Adding a paths field with glob patterns restricts loading to sessions where the developer is editing matching files. This is the correct approach for token-efficient, conditional convention loading.
- **D** (incorrect): @ path imports load eagerly when the CLAUDE.md is loaded — the imported file's content is inlined at that moment, regardless of which file the developer is editing. They are a source-organisation mechanism, not a conditional-loading mechanism. Path-scoped frontmatter in .claude/rules/ is the only way to make rule files load only for matching paths.

</details>

---

### Q119 (q-3-2-002) — single-choice

**Task statement:** 3.2 slash-commands-skills / skills-frontmatter · **Difficulty:** application · scenario: s4

**A platform engineering team creates a /security-audit skill that scans the codebase for vulnerabilities. The skill should be available to every developer on the project, must not be able to modify any files, and produces extensive analysis output. Which configuration is correct?**

　 **A.** Place the skill in ~/.claude/skills/ with allowed-tools restricting it to Read, Grep, and Glob, and context: fork in the frontmatter

　 **B.** Place the skill in .claude/commands/ with allowed-tools restricting it to Read, Grep, and Glob

　 **C.** Place the skill in CLAUDE.md as an always-loaded security scanning procedure

✅ **[CORRECT]** **D.** Place the skill in .claude/skills/ with a SKILL.md containing allowed-tools: ["Read", "Grep", "Glob"] and context: fork in the frontmatter

<details><summary><b>Answer</b>: D</summary>

**Rationale:** .claude/skills/ is project-scoped and shared via version control, so every developer gets it. allowed-tools restricts the skill to read-only tools, preventing file modifications. context: fork isolates the extensive analysis output from the main conversation. This satisfies all three requirements. Current state (checked 14 August 2026): the live skills reference defines `allowed-tools` as "Tools Claude can use without asking permission during the turn that invokes this skill", with `disallowed-tools` removing tools from the pool. The exam guide frames it as restricting access, so answer that on the exam.

**Option breakdown:**

- **A** (incorrect): ~/.claude/skills/ is user-scoped and not shared via version control. The requirement states every developer on the project needs access, so it must be project-scoped.
- **B** (incorrect): While .claude/commands/ is project-scoped (and equivalent to .claude/skills/ — both paths create identical /commands), this configuration is missing context: fork for isolating the extensive analysis output. Frontmatter features like context: fork and allowed-tools require a SKILL.md file in .claude/skills/, making that the better location for this use case.
- **C** (incorrect): CLAUDE.md is for universal, always-loaded standards, not on-demand task-specific workflows. A security audit is invoked when needed, not applied to every session. Placing it in CLAUDE.md wastes tokens in sessions where no audit is needed.
- **D** (correct): .claude/skills/ is project-scoped and shared via version control, so every developer gets it. allowed-tools restricts the skill to read-only tools, preventing file modifications. context: fork isolates the extensive analysis output from the main conversation. This satisfies all three requirements. Current state (checked 14 August 2026): the live skills reference defines `allowed-tools` as "Tools Claude can use without asking permission during the turn that invokes this skill", with `disallowed-tools` removing tools from the pool. The exam guide frames it as restricting access, so answer that on the exam.

</details>

---

### Q120 (q-3-4-002) — single-choice

**Task statement:** 3.4 plan-mode-execution / plan-mode · **Difficulty:** application · scenario: s3

**A developer is migrating a monorepo from CommonJS to ES modules: 80+ files, multiple valid strategies, knock-on effects in build tooling, test configuration, and `package.json`. They start in direct execution mode and begin converting files. Halfway through, the chosen import resolution strategy breaks the test runner. What went wrong?**

✅ **[CORRECT]** **A.** The developer should have used plan mode to explore the codebase and evaluate migration strategies before committing to an approach

　 **B.** The developer should have provided more detailed upfront instructions to direct execution specifying the exact migration pattern for every file type

　 **C.** The developer should have used the interview pattern to have Claude ask questions about the migration before starting

　 **D.** The developer should have written a complete test suite first and iterated by sharing test failures

<details><summary><b>Answer</b>: A</summary>

**Rationale:** An 80+ file migration with multiple valid strategies and cross-cutting concerns (build tooling, test configuration, package.json) is a textbook plan mode scenario. Plan mode would have revealed the test runner incompatibility before any files were changed. Starting with direct execution for a complex, multi-approach task risks costly rework.

**Option breakdown:**

- **A** (correct): An 80+ file migration with multiple valid strategies and cross-cutting concerns (build tooling, test configuration, package.json) is a textbook plan mode scenario. Plan mode would have revealed the test runner incompatibility before any files were changed. Starting with direct execution for a complex, multi-approach task risks costly rework.
- **B** (incorrect): The core issue is not insufficient instructions — it is that the developer did not explore the codebase to understand dependencies before choosing a strategy. More detailed instructions would still have used the wrong strategy because the test runner conflict was not known upfront.
- **C** (incorrect): The interview pattern helps surface considerations the developer might miss, but the fundamental issue is choosing direct execution for a task that requires codebase exploration and strategy evaluation. Plan mode, not just questioning, was needed to map dependencies and test impacts.
- **D** (incorrect): Test-driven iteration is an iterative refinement technique (task statement 3.5), not a substitute for upfront planning. The root cause is skipping plan mode for a complex task, not the absence of tests. The existing test runner itself was the source of the incompatibility.

</details>

---

### Q121 (q-3-6-002) — single-choice

**Task statement:** 3.6 cicd-integration / session-isolation · **Difficulty:** scenario-analysis · scenario: s5

**A CI/CD pipeline uses Claude Code to generate tests in one step and then review the same code in a subsequent step. The team notices that the review step rarely finds issues with the generated tests, but human reviewers consistently find problems. Both CI steps use the -p flag correctly. What is the most likely cause and fix?**

　 **A.** The review step needs --output-format json to produce structured findings that can be parsed programmatically

　 **B.** The CLAUDE.md file lacks testing standards and review criteria, so the review has no project-specific context

　 **C.** The review step runs the same model tier as generation, which is not capable enough to critique its own output; upgrade the review step to a more powerful model

✅ **[CORRECT]** **D.** The generation and review steps must run as independent sessions with no shared context, so the review instance approaches the code without the original reasoning bias

<details><summary><b>Answer</b>: D</summary>

**Rationale:** The same Claude session (or a session with carried-over context) that generated code is less effective at reviewing its own changes because it retains the reasoning context from generation. An independent review instance without that context is more likely to catch issues, matching what human reviewers find. Session context isolation for independent reviews is a key CI integration concept.

**Option breakdown:**

- **A** (incorrect): The output format affects how findings are reported, not whether issues are detected. The problem is that the review misses issues entirely, not that findings are in the wrong format.
- **B** (incorrect): While documenting testing standards in CLAUDE.md is important, it would affect the quality of both generation and review. The specific pattern here — review missing issues that humans catch — points to self-review bias, not missing context.
- **C** (incorrect): Model capability is not the bottleneck. A more powerful model still inherits self-review bias when it runs in the generating session's context, because it retains the reasoning it used to justify the code. The pattern here (a review that passes work human reviewers reject) points to shared reasoning context, which is fixed by running the review as an independent session with no shared context, not by upgrading the model.
- **D** (correct): The same Claude session (or a session with carried-over context) that generated code is less effective at reviewing its own changes because it retains the reasoning context from generation. An independent review instance without that context is more likely to catch issues, matching what human reviewers find. Session context isolation for independent reviews is a key CI integration concept.

</details>

---

### Q122 (q-3-5-002) — single-choice

**Task statement:** 3.5 iterative-refinement / batch-vs-sequential · **Difficulty:** application · scenario: s4

**A developer is iterating on a data transformation function with Claude Code and has identified three issues: (1) date parsing mishandles timezone offsets, (2) currency formatting uses the wrong locale, and (3) the output JSON schema has an incorrect field name. Issues 1 and 2 are independent; issue 3 changes the output shape both must conform to. How should the developer provide feedback?**

　 **A.** Send all three issues in a single message to let Claude address them holistically

　 **B.** Send each of the three issues in a separate sequential message, waiting for confirmation after every single fix.

✅ **[CORRECT]** **C.** Fix issue 3 (schema field name) first, then address issues 1 and 2 one at a time since they are independent

　 **D.** Use the interview pattern to have Claude ask clarifying questions about all three issues before making any changes

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Issue 3 changes the output schema that issues 1 and 2 must conform to, so it must be resolved first. Once the schema is correct, issues 1 and 2 are independent, so they are fixed one at a time rather than batched, since batching independent issues can confuse which feedback applies to which fix. This follows the principle: resolve dependencies first, batch when fixes interact, and sequence when independent.

**Option breakdown:**

- **A** (incorrect): Batching everything together is appropriate when all issues are interdependent. Here, issues 1 and 2 are independent of each other, and sending them together risks conflating the feedback for those fixes. The interdependency is only between issue 3 and the other two.
- **B** (incorrect): Pure sequential iteration is appropriate when all issues are independent. Here, issue 3 (schema field name) affects the expected output that issues 1 and 2 must conform to. Fixing issues 1 and 2 first without correcting the schema would produce fixes targeting the wrong field name.
- **C** (correct): Issue 3 changes the output schema that issues 1 and 2 must conform to, so it must be resolved first. Once the schema is correct, issues 1 and 2 are independent, so they are fixed one at a time rather than batched, since batching independent issues can confuse which feedback applies to which fix. This follows the principle: resolve dependencies first, batch when fixes interact, and sequence when independent.
- **D** (incorrect): The interview pattern is for unfamiliar domains where the developer might miss considerations. Here, the developer has already identified the three specific issues and understands their interdependencies. The question is about feedback sequencing, not domain exploration.

</details>

---

### Q123 (q-3-3-002) — single-choice

**Task statement:** 3.3 path-specific-rules / multi-ruleset · **Difficulty:** application · scenario: s5

**A DevOps team's polyglot codebase has Terraform files in terraform/, Kubernetes manifests in k8s/, and Dockerfiles scattered throughout various service directories. They want Claude Code to automatically apply infrastructure-specific conventions when editing each type of file, without loading all conventions for every session. What is the correct approach?**

　 **A.** Create three directory-level CLAUDE.md files: one in terraform/, one in k8s/, and one in the project root for Docker conventions

　 **B.** Add all infrastructure conventions to the root CLAUDE.md with clear section headings so the model knows which section applies

　 **C.** Create a single .claude/rules/infrastructure.md file with paths: ["**/*"] containing all infrastructure conventions

✅ **[CORRECT]** **D.** Create three path-scoped .claude/rules/ files (terraform.md, kubernetes.md, docker.md), each targeting its own file types

<details><summary><b>Answer</b>: D</summary>

**Rationale:** Each rule file targets specific infrastructure file types with appropriate glob patterns. Terraform conventions load only when editing Terraform files, Kubernetes conventions only for k8s manifests, and Docker conventions only for Dockerfiles — regardless of which directory the Dockerfiles are in. This provides token-efficient conditional loading for all three file types.

**Option breakdown:**

- **A** (incorrect): Directory-level CLAUDE.md files in terraform/ and k8s/ would work for those specific directories, but Dockerfiles are scattered throughout various service directories. A single root CLAUDE.md for Docker conventions would load for every session, defeating the token efficiency goal. This approach does not handle the cross-directory Dockerfile pattern.
- **B** (incorrect): Root CLAUDE.md loads for every session. All infrastructure conventions would consume tokens even when editing TypeScript application code. Section headings do not prevent the conventions from being loaded — the model still processes the entire file.
- **C** (incorrect): The glob pattern **/* matches every file in the codebase, which means the infrastructure conventions would load for every session — exactly the same as putting them in root CLAUDE.md. This defeats the purpose of conditional loading.
- **D** (correct): Each rule file targets specific infrastructure file types with appropriate glob patterns. Terraform conventions load only when editing Terraform files, Kubernetes conventions only for k8s manifests, and Docker conventions only for Dockerfiles — regardless of which directory the Dockerfiles are in. This provides token-efficient conditional loading for all three file types.

</details>

---

### Q124 (q-3-1-003) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / rules-priority · **Difficulty:** recall · scenario: s3

**A team is documenting how Claude Code assembles its CLAUDE.md context. Where do files in `.claude/rules/` that have no `paths` frontmatter sit relative to `.claude/CLAUDE.md`?**

✅ **[CORRECT]** **A.** They load at the same priority as `.claude/CLAUDE.md`, because unscoped rules are a way to split a monolithic project file rather than a more specific layer.

　 **B.** They load last and override `.claude/CLAUDE.md`, because a rules file is the most specific scope.

　 **C.** They load before `~/.claude/CLAUDE.md`, because project configuration is read first.

　 **D.** They do not load at all until Claude reads a file matching a glob pattern.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Verbatim from the memory docs: "Rules without `paths` frontmatter are loaded at launch with the same priority as `.claude/CLAUDE.md`." Splitting a long project file into topic rules changes how it is organised, not where it sits.

**Option breakdown:**

- **A** (correct): Verbatim from the memory docs: "Rules without `paths` frontmatter are loaded at launch with the same priority as `.claude/CLAUDE.md`." Splitting a long project file into topic rules changes how it is organised, not where it sits.
- **B** (incorrect): No CLAUDE.md-family file overrides another. All discovered files are concatenated into context, and unscoped rules share project-CLAUDE.md priority rather than winning over it.
- **C** (incorrect): User-level rules and memory load before project ones; the docs state that project rules then carry higher priority. Project configuration is not read first.
- **D** (incorrect): That describes rules that DO carry `paths` frontmatter, which load conditionally on a match. Rules without `paths` load unconditionally at launch.

</details>

---

### Q125 (q-3-1-010) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / modular-import · **Difficulty:** recall · scenario: s3

**What does an `@./path/to/file.md` line in a CLAUDE.md do?**

　 **A.** It conditionally loads the referenced file only when a matching file type is being edited, similar to path-scoped .claude/rules/

　 **B.** It imports npm packages and other external code dependencies into the Claude Code session at the point it starts.

✅ **[CORRECT]** **C.** It inlines the referenced file's content at load time, exactly as if the file had been pasted into the CLAUDE.md

　 **D.** It loads MCP server configurations from external JSON files into the running session at the moment that file is read.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** `@<path>` inlines the referenced file's content at load time. The directive is the `@` itself — there is no `@import` keyword. It is a modular-source mechanism, not a context-reduction mechanism: the loaded context is identical to having the imported content pasted directly into CLAUDE.md.

**Option breakdown:**

- **A** (incorrect): @ path imports load eagerly and inline at load time; they are not conditional. Conditional, path-based loading is what .claude/rules/ frontmatter provides, not @ imports, so this describes the wrong mechanism.
- **B** (incorrect): `@` path imports in CLAUDE.md reference other documentation or instruction files, not code dependencies. Package management is handled through standard tools like npm.
- **C** (correct): `@<path>` on its own line is the import directive (there is no `@import` keyword). The referenced file's content loads eagerly at load time, just as if it were inline in the CLAUDE.md. This keeps source files readable and lets each package import only the standards it needs, but it does not reduce per-session context usage.
- **D** (incorrect): MCP server configurations live in `.mcp.json` (and related per-scope files), not in CLAUDE.md `@` imports.

</details>

---

### Q126 (q-3-1-011) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / hook-types · **Difficulty:** recall · scenario: s5

**In Claude Code, which hook fires before a tool is invoked (and can allow, deny, or modify the tool call), and which fires immediately after a tool completes successfully (and can modify the result or feed corrective context back to the model)?**

✅ **[CORRECT]** **A.** PreToolUse runs before the tool and can allow, deny, or modify the input; PostToolUse runs after it and can modify the result

　 **B.** BeforeToolCall fires before invocation; AfterToolCall fires after — both can only observe and log, not modify or block the tool call.

　 **C.** UserPromptSubmit fires before the tool is invoked, and Stop fires immediately after the tool has completed its work and returned.

　 **D.** PreCompact fires before any tool runs, and PostCompact fires immediately after each tool call has completed and returned its result.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** PreToolUse is the gating hook on tool calls: it runs after the model emits the tool call but before execution, and can allow, deny, or modify the input. PostToolUse runs immediately after a successful tool call and can transform the result or feed corrective context back to the model. These are the two foundational hooks for tool automation. Claude Code also exposes many other lifecycle hooks (UserPromptSubmit, SessionStart, SubagentStop, Stop, PreCompact, PostCompact, Notification, and others), but those wrap different events in the agentic loop, not the tool call itself.

**Option breakdown:**

- **A** (correct): PreToolUse is the gating hook on tool calls: it runs after the model emits the tool call but before execution, so it can short-circuit (allow/deny/ask) or rewrite the tool input. PostToolUse runs immediately after a successful tool call and can transform the result or feed corrective context back to the model. Claude Code exposes many other lifecycle hooks (UserPromptSubmit, SessionStart, Stop, PreCompact, Notification, and others), but PreToolUse and PostToolUse are the pair that wraps the tool call itself.
- **B** (incorrect): The canonical names are PreToolUse and PostToolUse, not BeforeToolCall/AfterToolCall. More importantly, both hooks can modify behaviour — PreToolUse can deny or rewrite the input, and PostToolUse can transform the result and feed context back — so framing them as observe-only misses the primary use case.
- **C** (incorrect): UserPromptSubmit and Stop are real Claude Code hooks, but they fire on different events. UserPromptSubmit fires after a user submits a prompt (before Claude processes it), not before each tool call. Stop fires when the main agent finishes responding to the user, not after every individual tool call.
- **D** (incorrect): PreCompact and PostCompact are real hooks, but they wrap conversation-history compaction events (when the transcript is summarised to free up context), not individual tool calls. They never fire on a per-tool basis.

</details>

---

### Q127 (q-3-2-010) — single-choice

**Task statement:** 3.2 slash-commands-skills / allowed-tools · **Difficulty:** recall · scenario: s4

**What does the allowedTools configuration control in Claude Code?**

　 **A.** It specifies which MCP servers are permitted to connect to the Claude Code session

✅ **[CORRECT]** **B.** It defines tool-level permissions, restricting which tools a session or skill can invoke

　 **C.** It lists the external CLI tools that Claude Code is permitted to install on the system

　 **D.** It determines which programming languages Claude Code is allowed to generate code in

<details><summary><b>Answer</b>: B</summary>

**Rationale:** allowedTools provides granular, tool-level access control. It can be used in skills (via SKILL.md frontmatter) or session configuration to restrict which tools are available, enabling least-privilege security for specific workflows. Current state (checked 14 August 2026): the live skills reference defines `allowed-tools` as "Tools Claude can use without asking permission during the turn that invokes this skill", with `disallowed-tools` removing tools from the pool. The exam guide frames it as restricting access, so answer that on the exam.

**Option breakdown:**

- **A** (incorrect): MCP server connections are managed through MCP configuration, not through allowedTools. allowedTools operates at the individual tool level within a session or skill.
- **B** (correct): allowedTools provides granular, tool-level access control. It can be used in skills (via SKILL.md frontmatter) or session configuration to restrict which tools are available, enabling least-privilege security for specific workflows.
- **C** (incorrect): allowedTools does not manage system-level tool installation. It controls which Claude Code tools (Read, Write, Bash, Grep, etc.) are available within a session or skill.
- **D** (incorrect): allowedTools does not restrict programming languages. It restricts which tools (such as file operations, search, or execution tools) can be used, not the content or language of generated code.

</details>

---

### Q128 (q-3-2-011) — single-choice

**Task statement:** 3.2 slash-commands-skills / commands-placement · **Difficulty:** recall · scenario: s3

**Where do team-shared custom slash commands (one Markdown file per command, invoked with /<name>) live so every developer who clones the repository gets them?**

　 **A.** In ~/.claude/commands/ on each developer's machine

✅ **[CORRECT]** **B.** In the project's .claude/commands/ directory, which is version-controlled

　 **C.** In the root CLAUDE.md file as documented procedures

　 **D.** In .claude/skills/<name>/SKILL.md as a skill

<details><summary><b>Answer</b>: B</summary>

**Rationale:** .claude/commands/ holds one Markdown file per slash command, version-controlled and shared with anyone who clones the repo. Skills (.claude/skills/<name>/SKILL.md) are a separate format with autoload and frontmatter; the stem describes the single-file slash-command shape, which belongs in commands/.

**Option breakdown:**

- **A** (incorrect): ~/.claude/commands/ is user-scoped. Files there are personal to the developer's home directory, not version-controlled, and not shared via git.
- **B** (correct): .claude/commands/ is the project-scoped slash-command directory: one Markdown file per command, committed to the repository so every developer who clones it gets the same /<name> commands. This is the canonical placement for the format the question asks about.
- **C** (incorrect): CLAUDE.md is loaded as always-on guidance; it cannot define a command that the user invokes with the / prefix. Slash commands need their own file in a commands directory.
- **D** (incorrect): Skills and slash commands are different formats — even though both can end up callable via /. A skill is a directory with a SKILL.md file plus YAML frontmatter (description, allowed-tools, context) that Claude auto-loads when relevant. The question specifies a one-Markdown-file-per-command format invoked explicitly with /<name>, which is the slash-command shape that lives in .claude/commands/. If you want skill behaviour (autoload, scoped tools), pick skills; if you want plain explicit /<name> commands, pick commands.

</details>

---

### Q129 (q-3-6-003) — single-choice

**Task statement:** 3.6 cicd-integration / output-format · **Difficulty:** recall · scenario: s5

**What does the --output-format flag control when running Claude Code in CI/CD pipelines?**

　 **A.** It determines the programming language used in any code the run generates.

✅ **[CORRECT]** **B.** It sets Claude Code's stdout output format, e.g. JSON for downstream parsing

　 **C.** It sets the file encoding for any files that Claude Code creates during the session

　 **D.** It configures the log level verbosity of the diagnostic output Claude Code writes.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** --output-format controls how Claude Code's output is structured when writing to stdout. Using JSON format enables downstream CI/CD steps to programmatically parse results, extract findings, or integrate with other tools.

**Option breakdown:**

- **A** (incorrect): --output-format controls the structure of Claude Code's stdout output, not the language of generated code. Code generation language is determined by the prompt and context, not output formatting flags.
- **B** (correct): --output-format controls how Claude Code's output is structured when writing to stdout. Using JSON format enables downstream CI/CD steps to programmatically parse results, extract findings, or integrate with other tools.
- **C** (incorrect): --output-format does not control file encoding. It controls the format of Claude Code's own output stream, not the encoding of files it creates.
- **D** (incorrect): --output-format controls output structure (e.g., plain text vs JSON), not log verbosity. Log levels and diagnostic output are separate concerns from output formatting.

</details>

---

### Q130 (q-3-3-009) — single-choice

**Task statement:** 3.3 path-specific-rules / glob-patterns · **Difficulty:** application · scenario: s4

**A developer working on a React Native project notices that Claude Code applies web-specific React conventions (e.g., using div elements) when editing mobile components in the src/mobile/ directory, despite having mobile-specific conventions documented. The root CLAUDE.md contains general React standards, and there is no directory-level or rules-based configuration for mobile. What is the best fix?**

　 **A.** Add mobile-specific conventions to the root CLAUDE.md alongside the existing web React standards

✅ **[CORRECT]** **B.** Create a .claude/rules/react-native.md file with paths: ["src/mobile/**/*"] containing the mobile-specific conventions

　 **C.** Replace the root CLAUDE.md web React conventions with mobile React Native conventions

　 **D.** Create a CLAUDE.md file in src/mobile/ and remove all React standards from the root CLAUDE.md

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A rules file with a path restriction to src/mobile/ ensures mobile conventions load only when editing mobile components. This keeps the root CLAUDE.md focused on universal standards while providing targeted, token-efficient mobile guidance.

**Option breakdown:**

- **A** (incorrect): Adding mobile conventions to the root CLAUDE.md would load them for every session, including when editing web components, API handlers, or any other file. This wastes tokens and could cause confusion when both web and mobile conventions are present simultaneously.
- **B** (correct): A rules file with a path restriction to src/mobile/ ensures mobile conventions load only when editing mobile components. This keeps the root CLAUDE.md focused on universal standards while providing targeted, token-efficient mobile guidance.
- **C** (incorrect): Replacing web conventions with mobile conventions would break guidance for the web portion of the codebase. Both web and mobile conventions are needed, but scoped to their respective file paths.
- **D** (incorrect): A directory-level CLAUDE.md in src/mobile/ would work for that directory, but removing React standards from the root CLAUDE.md would leave web components without guidance. The correct approach preserves root-level standards and adds path-scoped mobile rules.

</details>

---

### Q131 (q-3-1-012) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / posttooluse-validation · **Difficulty:** application · scenario: s5

**A team wants to enforce that all SQL migration files created by Claude Code follow a strict naming convention (YYYYMMDD_HHMMSS_description.sql) and contain a rollback section. Which approach provides deterministic enforcement without relying on the model's judgment?**

✅ **[CORRECT]** **A.** Add a PostToolUse hook on file creation that validates the filename pattern and checks for a rollback section

　 **B.** Document the naming convention and rollback requirement in the project CLAUDE.md with clear examples

　 **C.** Create a .claude/rules/migrations.md file with paths: ["**/migrations/**/*.sql"] containing the naming convention

　 **D.** Use a PreToolUse hook to inject the naming convention into every prompt before file creation occurs

<details><summary><b>Answer</b>: A</summary>

**Rationale:** PostToolUse hooks run deterministic validation code after tool execution. A hook that checks filename patterns and content requirements provides reliable, automated enforcement that does not depend on the model remembering or correctly interpreting naming conventions.

**Option breakdown:**

- **A** (correct): PostToolUse hooks run deterministic validation code after tool execution. A hook that checks filename patterns and content requirements provides reliable, automated enforcement that does not depend on the model remembering or correctly interpreting naming conventions.
- **B** (incorrect): CLAUDE.md instructions rely on the model's interpretation and compliance. While useful as guidance, they do not provide deterministic enforcement. The model may occasionally deviate from the convention, especially under complex prompts.
- **C** (incorrect): Rules files provide context-specific instructions but still rely on the model to follow them. They do not provide deterministic enforcement. A hook-based approach guarantees compliance through automated validation.
- **D** (incorrect): PreToolUse hooks fire before tool execution and are better suited for blocking or modifying tool calls. Injecting instructions into prompts still relies on the model's compliance. PostToolUse validation provides deterministic enforcement by checking the actual output.

</details>

---

### Q132 (q-3-2-012) — single-choice

**Task statement:** 3.2 slash-commands-skills / allowed-tools-scoping · **Difficulty:** application · scenario: s3

**A junior developer is using Claude Code to refactor a payment processing module. The team lead wants to ensure Claude Code cannot accidentally delete production configuration files or modify the database migration directory during the refactoring session. What is the most appropriate approach?**

　 **A.** Instruct the developer to use plan mode so Claude Code will ask for approval before each file change

✅ **[CORRECT]** **B.** Use allowedTools path rules, Read(src/payment/**) and Edit(src/payment/**), so the session can only read and change files inside the payment module

　 **C.** Add a rule in CLAUDE.md stating 'Never modify files in the config/ or migrations/ directories'

　 **D.** Set the whole repository to read-only at the filesystem level before the refactoring session starts.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** allowedTools provides tool-level permission control that can restrict which tools are available and their scope. By limiting read and edit access to the payment module directory, the team lead ensures Claude Code cannot modify production config or migration files. Current state (checked 16 September 2026): Claude Code checks file paths against Edit(path) and Read(path) rules only. A path rule written for Write, Glob or NotebookEdit is accepted but never consulted, so write Edit(src/payment/**) rather than Write(src/payment/**); a Read deny rule also blocks Edit and Write on the same path. The live skills reference defines allowed-tools as the tools Claude can use without asking, with disallowed-tools removing tools from the pool. The exam guide frames allowedTools as restricting access, so answer that on the exam.

**Option breakdown:**

- **A** (incorrect): Plan mode helps with evaluating strategies for complex tasks, but it does not provide file-level access control. Even in plan mode, the model can still access all tools and directories once execution begins.
- **B** (correct): allowedTools provides tool-level permission control that can restrict which tools are available and their scope. Read and Edit are the two tools Claude Code checks file paths against, so scoping both to the payment module keeps Claude Code out of production config and the migration directory while leaving the refactor possible.
- **C** (incorrect): CLAUDE.md instructions rely on the model's compliance and are not deterministic safeguards. For production-critical protection, tool-level permission restrictions provide reliable enforcement rather than natural language instructions.
- **D** (incorrect): Making the entire repository read-only would prevent Claude Code from making any changes, including the legitimate refactoring of the payment module. The requirement is selective protection, not blanket read-only access.

</details>

---

### Q133 (q-3-5-004) — single-choice

**Task statement:** 3.5 iterative-refinement / interview-pattern · **Difficulty:** application · scenario: s4

**A developer is new to a healthcare compliance domain and needs to build an audit logging system. They understand the technical implementation options but are unsure about regulatory requirements that might affect the design. Which Claude Code workflow technique is most appropriate?**

　 **A.** Provide concrete input/output examples of the desired audit log format and let Claude implement it

　 **B.** Use plan mode to have Claude explore the codebase and propose multiple audit logging architectures

✅ **[CORRECT]** **C.** Use the interview pattern so Claude asks clarifying questions about compliance requirements, data retention policies, and access control needs before proposing a design

　 **D.** Start with direct execution using a simple implementation and iterate based on test failures

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The interview pattern is specifically designed for unfamiliar domains where the developer might miss important considerations. By having Claude ask probing questions about regulatory requirements, the developer surfaces constraints they might not have considered, leading to a more compliant design.

**Option breakdown:**

- **A** (incorrect): Concrete examples fix inconsistent interpretation of known transformations. The developer's problem is not inconsistency but rather gaps in domain knowledge about regulatory requirements. Examples cannot surface unknown compliance considerations.
- **B** (incorrect): Plan mode is for evaluating implementation strategies when the requirements are understood. The developer's gap is in domain requirements (regulatory compliance), not in technical approach selection.
- **C** (correct): The interview pattern is specifically designed for unfamiliar domains where the developer might miss important considerations. By having Claude ask probing questions about regulatory requirements, the developer surfaces constraints they might not have considered, leading to a more compliant design. The developer does not need to know the answers in advance: the questions name the requirements they now have to look up or take to a compliance colleague, which is the point of the pattern.
- **D** (incorrect): Iterating from test failures works when the requirements are known and tests can be written upfront. Healthcare compliance requirements that the developer does not know about cannot be captured in tests. Missing a regulatory requirement is not something that shows up as a test failure.

</details>

---

### Q134 (q-3-6-004) — single-choice

**Task statement:** 3.6 cicd-integration / output-format · **Difficulty:** application · scenario: s5

**A team wants their CI pipeline to run Claude Code for both PR code review and automated test generation. The PR review should output structured JSON for integration with their review dashboard, while the test generation should produce standard text output. How should the two pipeline steps be configured?**

　 **A.** Run both steps with -p and configure the review dashboard to parse plain text output from both steps

✅ **[CORRECT]** **B.** Run the review step with -p --output-format json and the test generation step with -p only, as separate non-interactive invocations

　 **C.** Run both steps in a single Claude Code session with -p, using different prompts to request different output formats

　 **D.** Run both steps with --output-format json and have the test generation step extract code from the JSON response

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Each step uses -p for non-interactive mode. The review step adds --output-format json for structured output that the dashboard can parse reliably. The test generation step uses default text output since it produces code files, not structured data. Running them as separate invocations ensures session context isolation.

**Option breakdown:**

- **A** (incorrect): Plain text output requires fragile parsing logic in the review dashboard. The --output-format json flag provides structured, machine-readable output that is far more reliable for programmatic integration.
- **B** (correct): Each step uses -p for non-interactive mode. The review step adds --output-format json for structured output that the dashboard can parse reliably. The test generation step uses default text output since it produces code files, not structured data. Running them as separate invocations ensures session context isolation.
- **C** (incorrect): Running both steps in a single session violates session context isolation. The review step would retain reasoning context from test generation, reducing review effectiveness. Each step should be an independent invocation.
- **D** (incorrect): While this would work technically, it adds unnecessary complexity to the test generation step. Using JSON output format only for the step that needs structured parsing (review) is the cleaner approach.

</details>

---

### Q135 (q-3-1-013) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / splitting-rules · **Difficulty:** application · scenario: s3

**A growing project's CLAUDE.md has reached 800 lines covering API design rules, testing conventions, deployment procedures, and frontend style guides. Most of those topics only matter when working in the matching part of the codebase (API rules in /api, frontend rules in /web, etc.). Developers report attention dilution: Claude Code is increasingly inconsistent on specific conventions. What is the recommended fix to reduce the per-session token load while preserving coverage?**

　 **A.** Split CLAUDE.md into per-topic files referenced with @ path imports so each topic lives in its own file

　 **B.** Claude Code has a hard limit of 500 lines for CLAUDE.md files; trim the file to fit within the limit

✅ **[CORRECT]** **C.** Move each topic's sections into a path-scoped .claude/rules/ file that loads only in the matching area

　 **D.** Duplicate the CLAUDE.md content across directory-level CLAUDE.md files in each subdirectory

<details><summary><b>Answer</b>: C</summary>

**Rationale:** .claude/rules/ files with path-scoped frontmatter are the documented way to keep per-session context lean: each rule only loads when Claude is working in the matching paths. @ path imports do not help here — they load the imported file's content inline at load time, so the source is more modular but the loaded context is the same size as a single big CLAUDE.md.

**Option breakdown:**

- **A** (incorrect): @ path imports load eagerly — Claude reads the imported file inline at load time, exactly as if its content were pasted into CLAUDE.md. The source files become smaller, but the loaded context stays the same size. This improves source-file readability and authoring ergonomics, but it does not solve the attention-dilution problem the question is asking about.
- **B** (incorrect): There is no documented hard line limit for CLAUDE.md files. The issue is token economy and attention dilution at load time, not a technical file-size constraint.
- **C** (correct): Path-scoped .claude/rules/ files are the documented way to reduce per-session context for guidance that only applies to part of the codebase. With frontmatter like `paths: ["api/**"]`, the API rules only load when working in /api; the frontend rules only load when working in /web; and so on. CLAUDE.md keeps only the genuinely cross-cutting standards. This actually shrinks the loaded context — unlike @ imports, which load eagerly.
- **D** (incorrect): Directory-level CLAUDE.md files load *in addition to* the project root file, not instead of it. Duplicating content would make the problem worse and create a maintenance nightmare. Use path-scoped .claude/rules/ files instead.

</details>

---

### Q136 (q-3-1-014) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / posttooluse-enforcement · **Difficulty:** scenario-analysis · scenario: s5

**A fintech company requires that all API response payloads are normalised to snake_case before being logged, and that any file write to the src/api/ directory is automatically linted. They want these enforcements to be deterministic and not rely on the model remembering instructions. Which hook configuration achieves both requirements?**

　 **A.** A PreToolUse hook on file writes that runs the linter before the write completes, and a PostToolUse hook on API response handling that normalises field names to snake_case

✅ **[CORRECT]** **B.** A PostToolUse hook on file writes to src/api/ that runs the linter on the created file, and a PostToolUse hook on data processing that normalises response payloads to snake_case

　 **C.** Add both requirements to CLAUDE.md with clear examples, and add a PreToolUse hook that reminds the model about these rules before each tool call

　 **D.** A PreToolUse hook that blocks any file write to src/api/ unless the file has already been linted, and a PreToolUse hook that blocks API calls unless snake_case normalisation is configured

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Both are PostToolUse hooks because both act on completed outputs. The linter runs after a file write to src/api/ is complete, validating the written content. The normalisation hook processes API response data after it is retrieved, converting fields to snake_case before logging. Both provide deterministic enforcement independent of model instructions.

**Option breakdown:**

- **A** (incorrect): PreToolUse fires before the tool runs, so there is no file content to lint yet. Linting must happen after the file is written (PostToolUse). The ordering of hooks to actions is incorrect here.
- **B** (correct): Both are PostToolUse hooks because both act on completed outputs. The linter runs after a file write to src/api/ is complete, validating the written content. The normalisation hook processes API response data after it is retrieved, converting fields to snake_case before logging. Both provide deterministic enforcement independent of model instructions.
- **C** (incorrect): CLAUDE.md instructions and PreToolUse reminders both rely on the model's compliance, which is not deterministic. The requirement explicitly states that enforcement must not depend on the model remembering instructions.
- **D** (incorrect): PreToolUse blocking assumes the file exists before the write, which is contradictory. You cannot lint a file that has not been written yet. PostToolUse hooks that process output after completion are the correct approach for validation and normalisation.

</details>

---

### Q137 (q-3-1-005) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / hierarchy · **Difficulty:** scenario-analysis · scenario: s4

**A consultancy works across 12 client projects simultaneously. Each developer has personal preferences (editor keybindings, alias shortcuts) and the consultancy has firm-wide coding standards. Each client project has its own specific conventions. Some client projects have subsystems with additional specialised rules. What is the correct configuration architecture?**

✅ **[CORRECT]** **A.** User ~/.claude/CLAUDE.md for personal preferences; project .claude/CLAUDE.md for firm-wide standards and client conventions; directory-level CLAUDE.md or .claude/rules/ with paths for subsystem rules

　 **B.** User ~/.claude/CLAUDE.md for personal preferences and firm-wide standards; project .claude/CLAUDE.md for client-specific conventions; directory-level CLAUDE.md or .claude/rules/ with paths for subsystem-specific rules

　 **C.** A single CLAUDE.md at the root of each project containing all four levels of configuration, with clear section headings

　 **D.** User ~/.claude/CLAUDE.md for everything; use @ path imports to pull in project-specific files from each repository

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Personal preferences are per-developer, so they live at user level, which is not shared via version control. Firm-wide standards and client conventions must reach everyone who works on a project, so they belong at the project level, which is committed to the repository and distributed on clone. Putting shared standards at the user level is the classic hierarchy bug, where a colleague who clones a project would not receive them.

**Option breakdown:**

- **A** (correct): Personal preferences are per-developer, so they live at user level, which is not shared via version control. Firm-wide standards and client conventions must reach everyone who works on a project, so they belong at the project level, which is committed to the repository and distributed on clone; firm-wide standards can be kept in a shared file and pulled into each project's CLAUDE.md with an @import to stay modular. Putting shared standards at the user level is the classic hierarchy bug, where a colleague who clones a project would not receive them. Subsystem rules belong at the directory level or in path-scoped .claude/rules/.
- **B** (incorrect): User-level ~/.claude/CLAUDE.md applies only to the individual developer and is not shared via version control. Placing firm-wide standards there means a colleague who clones a client project does not receive them, which is the classic configuration-hierarchy bug. Shared standards belong at the project level.
- **C** (incorrect): Combining all configuration levels into a single file defeats the purpose of the hierarchy. Personal preferences would be version-controlled and shared with the team, firm-wide standards would need duplication across 12 projects, and the file would be bloated with subsystem rules that only apply to specific directories.
- **D** (incorrect): User-level CLAUDE.md loads for every session across all projects. Importing 12 client project configurations into the user-level file would load all client conventions for every project, wasting tokens and causing conflicting instructions.

</details>

---

### Q138 (q-3-2-013) — single-choice

**Task statement:** 3.2 slash-commands-skills / skills-frontmatter · **Difficulty:** scenario-analysis · scenario: s4

**A team has a /deploy-check skill that verifies deployment readiness. It needs to: (1) read configuration files across the repo, (2) run bash commands to check service health, (3) produce a lengthy multi-page report, and (4) never modify any source code. The skill should be available to the entire team. Which SKILL.md configuration satisfies all four requirements?**

✅ **[CORRECT]** **A.** Place in .claude/skills/ with allowed-tools: ["Read", "Grep", "Glob", "Bash"] and context: fork

　 **B.** Place in .claude/skills/ with allowed-tools: ["Read", "Grep", "Glob"] and context: fork

　 **C.** Place in ~/.claude/skills/ with allowed-tools: ["Read", "Grep", "Glob", "Bash", "Write"] and context: fork

　 **D.** Place in .claude/skills/ with allowed-tools: ["Read", "Grep", "Glob", "Bash"]

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The skill is in .claude/skills/ for team access (requirement 4 via version control). allowed-tools includes Read, Grep, and Glob for reading configuration files (requirement 1), Bash for running health check commands (requirement 2), and excludes Write and Edit to prevent source code modification (requirement 4). context: fork isolates the lengthy report from the main conversation (requirement 3). Current state (checked 14 August 2026): the live skills reference defines `allowed-tools` as "Tools Claude can use without asking permission during the turn that invokes this skill", with `disallowed-tools` removing tools from the pool. The exam guide frames it as restricting access, so answer that on the exam.

**Option breakdown:**

- **A** (correct): The skill is in .claude/skills/ for team access (requirement 4 via version control). allowed-tools includes Read, Grep, and Glob for reading configuration files (requirement 1), Bash for running health check commands (requirement 2), and excludes Write and Edit to prevent source code modification (requirement 4). context: fork isolates the lengthy report from the main conversation (requirement 3). Current state (checked 14 August 2026): the live skills reference defines `allowed-tools` as "Tools Claude can use without asking permission during the turn that invokes this skill", with `disallowed-tools` removing tools from the pool. The exam guide frames it as restricting access, so answer that on the exam.
- **B** (incorrect): This configuration excludes Bash, which is needed for running service health check commands (requirement 2). Without Bash access, the skill cannot verify that services are running and responsive.
- **C** (incorrect): Two problems: ~/.claude/skills/ is user-scoped, not shared with the team. Including Write in allowed-tools violates the requirement that the skill must never modify source code.
- **D** (incorrect): This configuration is missing context: fork. Without it, the lengthy multi-page deployment report would clutter the main conversation context, violating requirement 3.

</details>

---

### Q139 (q-3-6-005) — single-choice

**Task statement:** 3.6 cicd-integration / session-isolation · **Difficulty:** application · scenario: s5

**A CI/CD pipeline runs three Claude Code steps in sequence: (1) generate a changelog from git commits, (2) review the changelog for accuracy, and (3) check for breaking changes. The team notices that step 2 never flags inaccuracies and step 3 misses obvious breaking changes that the changelog omits. What is the root cause?**

✅ **[CORRECT]** **A.** The three steps share session context, so steps 2 and 3 inherit step 1's reasoning instead of judging the changelog

　 **B.** The CLAUDE.md file does not contain changelog formatting standards, so the review step has no criteria to evaluate against

　 **C.** The -p flag is not being used, causing each step to wait for interactive input

　 **D.** The steps need to use --output-format json so that each step can parse the previous step's structured output

<details><summary><b>Answer</b>: A</summary>

**Rationale:** When review and analysis steps share context with the generation step, they inherit the original reasoning and are less likely to identify gaps or errors. Independent sessions force each step to evaluate the changelog from scratch without bias from the generation reasoning. Session context isolation is critical for CI/CD review pipelines.

**Option breakdown:**

- **A** (correct): When review and analysis steps share context with the generation step, they inherit the original reasoning and are less likely to identify gaps or errors. Independent sessions force each step to evaluate the changelog from scratch without bias from the generation reasoning. Session context isolation is critical for CI/CD review pipelines.
- **B** (incorrect): Missing formatting standards would affect the quality of the generated changelog, not the review's ability to catch inaccuracies. The pattern of reviews consistently missing issues points to shared-context bias, not missing criteria.
- **C** (incorrect): If -p were missing, the pipeline would hang rather than produce output that misses issues. The steps are producing output (the changelog is generated, reviews complete), but the reviews are ineffective.
- **D** (incorrect): Output format affects how results are structured, not whether reviews are thorough. JSON output would help with parsing but would not address the fundamental issue of review steps retaining generation context bias.

</details>

---

### Q140 (q-3-1-015) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / user-level · **Difficulty:** application · scenario: s3

**A developer has personal code formatting preferences (2-space indentation, trailing commas) that differ from some of the projects they work on. They want Claude Code to apply these preferences across all of their projects by default. Where should these preferences be configured?**

　 **A.** In the project-level .claude/CLAUDE.md of each repository they work on

✅ **[CORRECT]** **B.** In ~/.claude/CLAUDE.md, so they apply across all of the developer's projects

　 **C.** In a .claude/rules/ file without YAML frontmatter so it loads for every session

　 **D.** In a ~/.claude/skills/ file that is invoked before each coding session

<details><summary><b>Answer</b>: B</summary>

**Rationale:** User-level CLAUDE.md (~/.claude/CLAUDE.md) applies to all of that developer's projects and is not shared with the team via version control, which is exactly right for personal preferences. CLAUDE.md files are concatenated into context rather than strictly overriding one another, so a project's conflicting standard is not guaranteed to win; if a rule must always be enforced, put it in settings.json or a hook.

**Option breakdown:**

- **A** (incorrect): Project-level configuration is shared with the team via version control. Personal formatting preferences should not be imposed on the entire team. Additionally, this would require duplicating the preferences across every project.
- **B** (correct): User-level CLAUDE.md (~/.claude/CLAUDE.md) applies to all of that developer's projects and is not shared with the team via version control, which is exactly right for personal preferences. Note that CLAUDE.md files are concatenated into context rather than strictly overriding one another, so a project's conflicting standard is not guaranteed to win; if a rule must always be enforced, put it in settings.json or a hook.
- **C** (incorrect): .claude/rules/ is project-scoped and version-controlled. Personal preferences should not be committed to project repositories where they would affect all team members.
- **D** (incorrect): Skills are on-demand workflows invoked for specific tasks, not always-loaded configuration. Formatting preferences need to be applied automatically to every session without manual invocation.

</details>

---

### Q141 (q-3-4-005) — single-choice

**Task statement:** 3.4 plan-mode-execution / hybrid · **Difficulty:** scenario-analysis · scenario: s4

**A team is debugging a complex distributed system issue. The lead developer wants to use Claude Code to explore logs, trace request flows, and form hypotheses without making any changes to the codebase. Partway through the investigation, they identify a one-line fix in a configuration file and want to apply it immediately. What is the optimal workflow?**

✅ **[CORRECT]** **A.** Start in plan mode for investigation, then switch to direct execution for the one-line fix once identified

　 **B.** Use direct execution throughout, with detailed upfront instructions describing both the investigation process and potential fix patterns

　 **C.** Use plan mode for the entire session, including the one-line fix, to maintain consistency

　 **D.** Use allowedTools to restrict to read-only tools for investigation, then start a new session with write permissions for the fix

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Plan mode is ideal for the investigation phase: exploring logs, tracing flows, and evaluating multiple hypotheses without committing to changes. Once the fix is identified and well-understood (a clear-scope, single-file change), switching to direct execution applies it efficiently without unnecessary planning overhead.

**Option breakdown:**

- **A** (correct): Plan mode is ideal for the investigation phase: exploring logs, tracing flows, and evaluating multiple hypotheses without committing to changes. Once the fix is identified and well-understood (a clear-scope, single-file change), switching to direct execution applies it efficiently without unnecessary planning overhead.
- **B** (incorrect): Direct execution is inappropriate for the investigation phase because the problem and solution are not yet understood. Providing detailed upfront instructions assumes knowledge of the issue that the investigation is meant to discover.
- **C** (incorrect): While plan mode is correct for investigation, continuing to use it for a well-understood one-line fix adds unnecessary overhead. Once the fix is identified and scoped, direct execution is the appropriate mode for a clear, limited change.
- **D** (incorrect): Starting a new session for the fix would lose all the investigation context (log analysis, request tracing, hypothesis formation) that led to identifying the fix. Switching modes within the same session preserves this valuable context.

</details>

---

### Q142 (q-3-1-006) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / enforcement · **Difficulty:** scenario-analysis · scenario: s8

**The refactoring team's Java naming convention must be applied on every run. A senior developer's user-level CLAUDE.md (~/.claude/CLAUDE.md) contradicts it, and reviewers have already caught Claude following the developer's personal preference over the team rule. Where should the team move the rule so it is guaranteed to be honoured?**

✅ **[CORRECT]** **A.** Into the project's settings.json or a PreToolUse hook — enforcement-grade locations that the Claude Code client applies regardless of what the model decides

　 **B.** Leave the rule in the repository-root CLAUDE.md — the more specific scope wins on conflicts, so it will override the user-level file

　 **C.** Promote the rule into the user-level CLAUDE.md of every team member so it loads first and sets the baseline

　 **D.** Keep the rule in CLAUDE.md but move it into a CLAUDE.local.md so it appends last and overrides the personal preference

<details><summary><b>Answer</b>: A</summary>

**Rationale:** CLAUDE.md is guidance, not enforcement. Anthropic's memory docs say files are 'concatenated into context rather than overriding each other' and that contradictory rules may resolve arbitrarily. The same docs direct teams who need a rule honoured every time to use settings.json or a hook, which the client enforces regardless of what the model decides. 'More specific scope wins' is a third-party paraphrase that the official docs do not make.

**Option breakdown:**

- **A** (correct): Anthropic's memory docs are explicit that CLAUDE.md files are 'concatenated into context rather than overriding each other' and that 'if two rules contradict each other, Claude may pick one arbitrarily.' CLAUDE.md is delivered as a user message and the docs warn there's 'no guarantee of strict compliance.' The docs themselves point teams at the right alternative: 'Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer.' For a rule that must hold every time, move it to settings.json permissions or a hook — hooks run as shell commands at fixed lifecycle events and apply 'regardless of what Claude decides to do.'
- **B** (incorrect): This is the popular paraphrase, but the official docs never assert it. They describe a load order (broadest scope to most specific, so project instructions appear in context after user instructions) but explicitly say files are 'concatenated into context rather than overriding each other' and conflicts 'may [be] pick[ed] arbitrarily.' Treating CLAUDE.md scope as a precedence chain is exactly the assumption that has already failed the team in the scenario.
- **C** (incorrect): User-level CLAUDE.md is not version-controlled or shared via git, and the docs treat it as the broadest scope, not the highest priority. Asking every teammate to maintain a personal copy of a team rule is fragile and still gives no enforcement guarantee — contradictory rules can still resolve arbitrarily.
- **D** (incorrect): Load order does put CLAUDE.local.md after CLAUDE.md within a directory, but the docs are careful to call this 'load order,' not precedence — they still say 'if two rules contradict each other, Claude may pick one arbitrarily.' CLAUDE.local.md is also gitignored, so a team rule belongs there even less than in the shared CLAUDE.md.

</details>

---

### Q143 (q-3-1-016) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / posttooluse-formatting · **Difficulty:** application · scenario: s8

**The team wants to ensure that every Java file written by Claude Code during refactoring is automatically formatted with the project's Checkstyle rules before being saved. Developers occasionally forget to run the formatter manually. What is the correct hook configuration?**

　 **A.** A PreToolUse hook on the Write tool that runs Checkstyle on the content before the file is written

✅ **[CORRECT]** **B.** A PostToolUse hook on file write operations that runs the Checkstyle formatter on the written file, automatically correcting any style violations

　 **C.** Add 'Always run Checkstyle before saving files' to the CLAUDE.md system prompt

　 **D.** A PreToolUse hook on the Read tool that verifies all Java files are Checkstyle-compliant before they are read into context

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PostToolUse fires after the file is written to disk. A hook that runs the Checkstyle formatter on the output file ensures every written Java file conforms to the project's style rules, regardless of what the model generated. This provides deterministic enforcement without relying on prompt instructions.

**Option breakdown:**

- **A** (incorrect): PreToolUse fires before the tool executes. The file has not been written yet, so there is no file on disk to format. PreToolUse is suited for blocking or validating inputs, not for post-processing outputs.
- **B** (correct): PostToolUse fires after the file is written to disk. A hook that runs the Checkstyle formatter on the output file ensures every written Java file conforms to the project's style rules, regardless of what the model generated. This provides deterministic enforcement without relying on prompt instructions.
- **C** (incorrect): Prompt instructions are probabilistic. The question states developers 'occasionally forget', and an LLM-based instruction has the same failure mode. A hook provides deterministic enforcement that cannot be skipped.
- **D** (incorrect): Checking files on read does not address the requirement. The goal is to format files when they are written, not to validate files when they are read. Existing legacy files may not be Checkstyle-compliant and should not block reading.

</details>

---

### Q144 (q-3-2-014) — single-choice

**Task statement:** 3.2 slash-commands-skills / skills-placement · **Difficulty:** application · scenario: s8

**The team creates a reusable /extract-service skill that guides Claude Code through the standard steps of extracting a module from the monolith into a microservice (identify boundaries, create service scaffold, migrate code, update call sites, add tests). Where should this skill be stored so that every team member who clones the repository has access?**

　 **A.** In ~/.claude/skills/ on each developer's machine, distributed via the team wiki

✅ **[CORRECT]** **B.** In the repository's .claude/skills/ directory, committed to version control

　 **C.** In the repository-root CLAUDE.md as an inline procedure

　 **D.** In a shared MCP server that all team members connect to

<details><summary><b>Answer</b>: B</summary>

**Rationale:** .claude/skills/ is project-scoped and version-controlled. When any team member clones the repository, the skill is automatically available as a /extract-service command. Updates to the skill flow through normal git pull, ensuring all developers have the same version.

**Option breakdown:**

- **A** (incorrect): ~/.claude/skills/ is user-scoped and not version-controlled. Distributing via wiki requires manual copying and creates drift between developers' versions. The requirement is automatic availability on clone.
- **B** (correct): .claude/skills/ is project-scoped and version-controlled. When any team member clones the repository, the skill is automatically available as a /extract-service command. Updates to the skill flow through normal git pull, ensuring all developers have the same version.
- **C** (incorrect): CLAUDE.md is for always-loaded standards, not on-demand workflows. An extraction procedure is invoked when needed, not applied to every session. Placing it in CLAUDE.md wastes tokens when developers are not extracting services.
- **D** (incorrect): MCP servers provide tool integrations and external data access, not reusable prompt-based workflows. A skill file is the correct mechanism for a guided multi-step procedure.

</details>

---

### Q145 (q-3-4-006) — single-choice

**Task statement:** 3.4 plan-mode-execution / plan-mode · **Difficulty:** scenario-analysis · scenario: s8

**A developer extracting the notification subsystem from a monolith faces 12 cross-module dependencies, 3 messaging patterns, and several valid extraction strategies. They start in direct execution mode. After moving 8 files, the chosen approach breaks circular dependencies with the user-profile module. What should they have done differently?**

　 **A.** Used direct execution but with more detailed upfront instructions specifying how to handle each dependency

✅ **[CORRECT]** **B.** Used plan mode to map the 12 dependencies and evaluate extraction strategies before committing

　 **C.** Used direct execution but processed only 2 files at a time to catch problems earlier

　 **D.** Delegated the entire extraction to a subagent to isolate the risk

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A subsystem with 12 dependencies, multiple messaging patterns, and several valid strategies is a textbook plan mode scenario. Plan mode would have mapped the dependency graph and revealed the circular dependency with user-profile before any files were moved, avoiding costly rework.

**Option breakdown:**

- **A** (incorrect): The developer did not know about the circular dependency with the user-profile module upfront. More detailed instructions cannot account for undiscovered dependencies. The codebase needed exploration first.
- **B** (correct): A subsystem with 12 dependencies, multiple messaging patterns, and several valid strategies is a textbook plan mode scenario. Plan mode would have mapped the dependency graph and revealed the circular dependency with user-profile before any files were moved, avoiding costly rework.
- **C** (incorrect): Smaller batches in direct execution do not address the fundamental issue: the developer chose a strategy without understanding the full dependency landscape. The circular dependency would still be discovered mid-migration, just slightly sooner.
- **D** (incorrect): Delegating to a subagent does not change the outcome if the subagent also uses direct execution without exploring dependencies. The mode of execution (plan vs direct) matters more than who executes it.

</details>

---

### Q146 (q-3-6-008) — single-choice

**Task statement:** 3.6 cicd-integration / worktree-parallel · **Difficulty:** application · scenario: s8

**The team wants three Claude Code instances working in parallel: one extracting the authentication service, one extracting the billing service, and one updating shared libraries. All three need to commit to the same repository without conflicts. What is the correct setup?**

　 **A.** Run all three instances in the same working directory on separate branches, switching branches as needed

✅ **[CORRECT]** **B.** Use git worktree to create three separate working directories, each on its own branch, with one Claude Code instance per worktree

　 **C.** Clone the repository three times into separate directories and merge the results manually

　 **D.** Use fork_session to run the three tasks as parallel branches within a single Claude Code session

<details><summary><b>Answer</b>: B</summary>

**Rationale:** git worktree creates multiple working directories from the same repository, each checked out to a different branch. Each Claude Code instance operates in its own isolated file system while sharing the same git history. This eliminates file system conflicts between parallel instances.

**Option breakdown:**

- **A** (incorrect): Multiple Claude Code instances in the same working directory will cause file system conflicts, dirty working trees, and race conditions, even on different branches. Git branch switching affects the entire working directory.
- **B** (correct): git worktree creates multiple working directories from the same repository, each checked out to a different branch. Each Claude Code instance operates in its own isolated file system while sharing the same git history. This eliminates file system conflicts between parallel instances.
- **C** (incorrect): Three separate clones create divergent git histories that must be reconciled manually. git worktree provides the same isolation with a shared repository, making merges straightforward through normal branch operations.
- **D** (incorrect): fork_session creates parallel exploration branches within Claude Code's conversation context, not separate file system environments. Three large extraction tasks each need their own working directory to avoid file conflicts, which requires git worktree.

</details>

---

### Q147 (q-3-6-006) — single-choice

**Task statement:** 3.6 cicd-integration / claude-md-criteria · **Difficulty:** application · scenario: s8

**The team's CLAUDE.md specifies that all new microservices must include integration tests that verify API contract compliance and database migration rollback. A developer notices that Claude Code sometimes generates unit tests that mock the database instead of writing the required integration tests. What should the team add to their configuration?**

　 **A.** A PostToolUse hook that rejects any test file containing mock annotations

✅ **[CORRECT]** **B.** Tighten the CLAUDE.md test rule with criteria like real DB connections and contract assertions

　 **C.** A separate testing subagent that reviews generated tests and rewrites any that use mocks

　 **D.** A .claude/rules/ file with paths: ["**/*Test.java"] that instructs Claude Code to never use mocks

<details><summary><b>Answer</b>: B</summary>

**Rationale:** CLAUDE.md is the correct location for persistent test standards. Specifying concrete criteria (real database connections, API contract assertions) with examples of expected structure and fixtures gives Claude Code an unambiguous target. This addresses the root cause: the existing instructions were not specific enough about what 'integration tests' means in this codebase.

**Option breakdown:**

- **A** (incorrect): Rejecting all mocks is too aggressive — unit tests with mocks are still valuable for other purposes. The issue is that integration tests are missing, not that unit tests exist. The configuration should specify what is required, not ban useful testing patterns.
- **B** (correct): CLAUDE.md is the correct location for persistent test standards. Specifying concrete criteria (real database connections, API contract assertions) with examples of expected structure and fixtures gives Claude Code an unambiguous target. This addresses the root cause: the existing instructions were not specific enough about what 'integration tests' means in this codebase.
- **C** (incorrect): A review subagent adds complexity and is still probabilistic. Clear specifications in CLAUDE.md solve the issue at the source by telling Claude Code exactly what to generate, rather than correcting after generation.
- **D** (incorrect): Banning mocks from all test files is overly broad — mocks are appropriate in many unit tests. The requirement is specifically that integration tests with real connections must be included, not that mocks must be eliminated.

</details>

---

### Q148 (q-3-1-007) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / enforcement · **Difficulty:** application · scenario: s8

**Project-level `.claude/CLAUDE.md` says 'use 4-space indentation matching the existing codebase.' A senior architect has 'use 2-space indentation' in their user-level `~/.claude/CLAUDE.md`. In recent sessions the architect's code has come back in 2 spaces and broken the build. The team needs a guarantee that 4-space indentation is applied on every save. What should they do?**

✅ **[CORRECT]** **A.** Add a PostToolUse hook that runs the team's formatter after every Write/Edit, so 4-space indentation is enforced regardless of what Claude generates

　 **B.** Leave the rule in project-level `.claude/CLAUDE.md` — the more specific scope wins on conflicts, so the project rule will override the architect's user-level preference

　 **C.** Ask the architect to delete their user-level `~/.claude/CLAUDE.md` so there is no conflict to resolve

　 **D.** Move the 4-space rule into a `CLAUDE.local.md` at the project root so it is appended last and reads after the user-level file

<details><summary><b>Answer</b>: A</summary>

**Rationale:** CLAUDE.md is guidance and the docs say conflicts may resolve arbitrarily. For a rule that must hold every time, use the enforcement layer Anthropic points at: hooks (PostToolUse runs the formatter as a shell command at a fixed lifecycle event) or settings.json (the client enforces it regardless of what Claude does). 'More specific scope wins' is a third-party paraphrase that the official docs do not make.

**Option breakdown:**

- **A** (correct): Anthropic's memory docs are explicit that CLAUDE.md is delivered as a user message with 'no guarantee of strict compliance,' and that 'if two rules contradict each other, Claude may pick one arbitrarily.' The docs themselves point at hooks for this case: hooks 'execute as shell commands at fixed lifecycle events and apply regardless of what Claude decides to do.' A PostToolUse hook running the formatter is the only option here that gives a hard guarantee.
- **B** (incorrect): This is the popular paraphrase, but it's not what Anthropic's docs say. The docs describe a load order (broadest scope to most specific, so project instructions appear in context after user instructions) but explicitly state files are 'concatenated into context rather than overriding each other' and conflicts 'may [be] pick[ed] arbitrarily.' The team has already seen that assumption fail in production.
- **C** (incorrect): This treats a personal config file as a team problem and doesn't scale — every new teammate would need to police their own home directory, and any future contradiction (from a different file, an `@import`, or a `.claude/rules/` entry) would resurface the same fragility. The fix is to remove reliance on guidance-style config for a rule that must be enforced, not to remove the conflicting file.
- **D** (incorrect): Load order does append `CLAUDE.local.md` after `CLAUDE.md` within a directory, but the docs are careful to call this 'load order,' not precedence, and warn that conflicts may resolve arbitrarily. `CLAUDE.local.md` is also gitignored, so a team standard cannot live there.

</details>

---

### Q149 (q-3-1-017) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / posttooluse-linting · **Difficulty:** recall · scenario: s8

**The team configures a hook to run their Java linter after every file write. Which hook type and trigger point is correct for this enforcement?**

　 **A.** A PreToolUse hook that runs a shell command executing the linter before the file is written

✅ **[CORRECT]** **B.** A PostToolUse hook that runs a shell command executing the linter on the written file

　 **C.** A PreToolUse hook that runs a bash script validating the file content before write

　 **D.** A PostToolUse hook that modifies the CLAUDE.md configuration to include the lint results

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PostToolUse fires after the file write completes, when the file exists on disk. A shell command hook can execute the Java linter on the newly written file, catching any violations immediately after writing. This is the correct combination of trigger point (post-write) and hook type (shell command).

**Option breakdown:**

- **A** (incorrect): PreToolUse fires before the file write occurs. There is no file on disk to lint yet. PreToolUse is suited for blocking operations based on input validation, not for post-processing written files.
- **B** (correct): PostToolUse fires after the file write completes, when the file exists on disk. A shell command hook can execute the Java linter on the newly written file, catching any violations immediately after writing. This is the correct combination of trigger point (post-write) and hook type (shell command).
- **C** (incorrect): While bash hooks can access tool call inputs, linting the content before it is written as a file is fragile — it requires extracting content from the tool call arguments and writing to a temp file. PostToolUse linting the actual written file is simpler and more reliable.
- **D** (incorrect): Hooks should perform their enforcement action directly (running the linter), not modify configuration files. CLAUDE.md is for persistent instructions, not for storing transient lint results.

</details>

---

### Q150 (q-3-4-007) — single-choice

**Task statement:** 3.4 plan-mode-execution / explore-subagent · **Difficulty:** scenario-analysis · scenario: s8

**A developer asks Claude Code to 'explain the order processing pipeline' before refactoring it. The pipeline spans 15 classes across 4 packages with deep inheritance and callback chains. Claude Code reads 3 files and produces a superficial summary that misses the callback chain entirely. What approach would produce a more thorough analysis?**

　 **A.** Re-prompt Claude Code with more specific instructions listing all 15 classes to read

✅ **[CORRECT]** **B.** Use an Explore subagent for verbose discovery across the pipeline's classes and callback chains

　 **C.** Switch to plan mode and ask Claude Code to create a plan for understanding the pipeline

　 **D.** Run multiple Claude Code sessions, each analysing a different package, then manually combine the results

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The Explore subagent is purpose-built for verbose, thorough codebase discovery. It systematically follows references, traces inheritance, and maps control flow across files — exactly what is needed for a complex event-driven pipeline. Regular Claude Code defaults to efficient, minimal reads; the Explore subagent prioritises comprehensive discovery.

**Option breakdown:**

- **A** (incorrect): This assumes the developer already knows which 15 classes are involved. If the developer knew the full scope, they would not need Claude Code's help understanding the pipeline. The issue is that Claude Code's initial exploration was too shallow.
- **B** (correct): The Explore subagent is purpose-built for verbose, thorough codebase discovery. It systematically follows references, traces inheritance, and maps control flow across files — exactly what is needed for a complex event-driven pipeline. Regular Claude Code defaults to efficient, minimal reads; the Explore subagent prioritises comprehensive discovery.
- **C** (incorrect): Plan mode can safely explore a codebase before you commit to changes, but it runs in the main conversation and drives toward a change plan. Here the developer needs thorough, verbose discovery of current behaviour, which the Explore subagent isolates and summarises without exhausting the main context, so the Explore subagent is the better fit.
- **D** (incorrect): Splitting analysis across sessions loses the cross-package context needed to trace the callback chains and inheritance hierarchies. The pipeline's complexity comes from how the 4 packages interact, which requires a single comprehensive analysis.

</details>

---

### Q151 (q-3-6-009) — single-choice

**Task statement:** 3.6 cicd-integration / worktree-coordination · **Difficulty:** scenario-analysis · scenario: s8

**Two Claude Code instances are running in separate git worktrees: Instance A is extracting the payment service (branch: extract/payment) and Instance B is extracting the inventory service (branch: extract/inventory). Both instances need to modify the shared OrderService.java file — Instance A to remove payment logic and Instance B to remove inventory logic. How should the team coordinate this?**

　 **A.** Let both instances modify OrderService.java independently on their branches and resolve the merge conflict when merging to main

✅ **[CORRECT]** **B.** Have Instance A complete and merge first, then Instance B rebases onto the updated main before modifying OrderService.java

　 **C.** Create a third Claude Code instance dedicated to modifying only shared files, with Instances A and B handling everything else

　 **D.** Use file locking via git to prevent both instances from modifying OrderService.java simultaneously

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Sequencing modifications to shared files avoids merge conflicts. Instance A completes its changes to OrderService.java and merges. Instance B then rebases onto the updated main, seeing Instance A's changes, and makes its modifications with full awareness of the current state. This is the standard coordination pattern for parallel Claude Code instances modifying shared files.

**Option breakdown:**

- **A** (incorrect): Allowing both instances to make independent, potentially contradictory modifications to the same file risks complex merge conflicts that are difficult to resolve correctly. Coordinating changes to shared files upfront is safer.
- **B** (correct): Sequencing modifications to shared files avoids merge conflicts. Instance A completes its changes to OrderService.java and merges. Instance B then rebases onto the updated main, seeing Instance A's changes, and makes its modifications with full awareness of the current state. This is the standard coordination pattern for parallel Claude Code instances modifying shared files.
- **C** (incorrect): A dedicated shared-file instance adds coordination complexity without clear benefit. It needs to understand both extraction contexts to make correct modifications. Sequential merging with rebasing is simpler and more reliable.
- **D** (incorrect): Git does not have built-in file locking for standard workflows. While Git LFS supports file locking, it is designed for binary files, not source code coordination. Sequential merge-and-rebase is the standard approach for coordinating parallel branches.

</details>

---

### Q152 (q-3-1-008) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / persistence · **Difficulty:** recall · scenario: s9

**A documentation team maintains a CLAUDE.md file with instructions for generating API reference docs. During a long session updating 40+ endpoint descriptions, Claude Code runs /compact to manage context. What happens to the instructions defined in CLAUDE.md after compaction?**

　 **A.** They are summarised along with the rest of the conversation history and may lose specificity

✅ **[CORRECT]** **B.** They persist because Claude re-reads CLAUDE.md from disk after compaction and re-injects it

　 **C.** They are removed from context entirely and must be manually reloaded with /memory

　 **D.** They persist only if the settingSources configuration explicitly marks them as compaction-safe

<details><summary><b>Answer</b>: B</summary>

**Rationale:** CLAUDE.md is never part of the conversation history that /compact summarises. After compaction Claude re-reads the project-root file from disk and re-injects it, so the instructions come back intact. Nested CLAUDE.md files in subdirectories and path-scoped rules are the exception: they reload on demand, the next time Claude reads a matching file.

**Option breakdown:**

- **A** (incorrect): CLAUDE.md instructions are not part of the conversation history, so there is nothing for the summariser to compress. They are re-read from disk after compaction and survive intact.
- **B** (correct): CLAUDE.md is never part of the conversation history that /compact summarises. After compaction Claude re-reads the project-root file from disk and re-injects it, so the instructions come back intact. Nested CLAUDE.md files in subdirectories and path-scoped rules are the exception: they reload on demand, the next time Claude reads a matching file.
- **C** (incorrect): /memory is a diagnostic command that shows what configuration is loaded, not a command to reload configuration. CLAUDE.md content is automatically persistent and does not need manual reloading.
- **D** (incorrect): settingSources is a diagnostic mechanism that shows where configuration was loaded from. There is no compaction-safe marking — all CLAUDE.md rules persist through compaction by default.

</details>

---

### Q153 (q-3-1-018) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / precompact-hook · **Difficulty:** application · scenario: s9

**A documentation team wants to archive the full conversation transcript to a log file every time Claude Code runs /compact, so that context lost during compaction can be reviewed later. Which hook configuration achieves this?**

　 **A.** A PostToolUse hook on Write that snapshots the transcript whenever a file is written, on the assumption /compact will eventually run

✅ **[CORRECT]** **B.** A PreCompact hook that writes the current transcript to a timestamped log file before /compact summarises the conversation

　 **C.** A PreToolUse hook configured on a built-in 'Compact' tool, matching tool name 'Compact'

　 **D.** A PostToolUse hook on all tools that appends each tool result to a running log file, creating a continuous archive

<details><summary><b>Answer</b>: B</summary>

**Rationale:** PreCompact is a first-class hook event in Claude Code that fires immediately before /compact (or auto-compaction) runs. The hook receives the full pre-compaction transcript path and can copy or process it before summarisation discards detail. This is the documented mechanism for exactly this use case.

**Option breakdown:**

- **A** (incorrect): Write and compaction are unrelated. PostToolUse on Write would fire on every file write whether or not /compact is about to run, producing noise rather than a transcript at the right moment. The dedicated PreCompact event is the correct hook.
- **B** (correct): PreCompact is a first-class hook event in Claude Code that fires immediately before /compact (or auto-compaction) runs. The hook receives the full pre-compaction transcript path and can copy or process it before summarisation discards detail. This is the documented mechanism for exactly this use case.
- **C** (incorrect): There is no 'Compact' tool exposed to PreToolUse. Compaction is a Claude Code lifecycle operation, not a model-invoked tool, so it has its own dedicated PreCompact event rather than being hooked via PreToolUse.
- **D** (incorrect): Logging every tool result creates enormous log files and does not capture conversation context (reasoning, planning, user messages). The targeted PreCompact event captures the full transcript at the critical moment without per-tool noise.

</details>

---

### Q154 (q-3-2-015) — single-choice

**Task statement:** 3.2 slash-commands-skills / context-fork · **Difficulty:** application · scenario: s9

**A documentation team creates a /generate-api-docs skill that reads source code files and produces Markdown API reference pages. The skill generates verbose output (200+ lines per endpoint) and should be available to every team member who clones the repository. How should the skill be configured?**

　 **A.** Create a SKILL.md in ~/.claude/skills/ with context: fork frontmatter, and instruct each team member to copy it locally

✅ **[CORRECT]** **B.** Create a SKILL.md in .claude/skills/ with context: fork, so it is shared via git and isolates the verbose output

　 **C.** Add the documentation generation instructions to the root CLAUDE.md so they load automatically in every session

　 **D.** Create a SKILL.md in .claude/skills/ without any frontmatter, relying on the team to manually manage context overflow

<details><summary><b>Answer</b>: B</summary>

**Rationale:** .claude/skills/ is project-scoped and version-controlled, making it available to every developer who clones the repository. context: fork isolates the verbose 200+ line output per endpoint into a forked context, preventing it from consuming the main conversation's context budget.

**Option breakdown:**

- **A** (incorrect): ~/.claude/skills/ is user-scoped and not version-controlled. Requiring manual copying defeats the purpose of team-shared configuration and creates maintenance drift.
- **B** (correct): .claude/skills/ is project-scoped and version-controlled, making it available to every developer who clones the repository. context: fork isolates the verbose 200+ line output per endpoint into a forked context, preventing it from consuming the main conversation's context budget.
- **C** (incorrect): CLAUDE.md is for always-loaded standards, not for on-demand command definitions. Loading verbose generation instructions in every session wastes context tokens when the team is doing non-documentation work.
- **D** (incorrect): Without context: fork, the verbose output (200+ lines per endpoint across many endpoints) would flood the main conversation context. The context: fork frontmatter is essential for isolating bulky output.

</details>

---

### Q155 (q-3-4-008) — single-choice

**Task statement:** 3.4 plan-mode-execution / plan-mode · **Difficulty:** scenario-analysis · scenario: s9

**A documentation team must update architecture guides across 25 microservice directories after a platform migration. Each guide requires reading source, checking dependencies, and rewriting affected sections. Working in direct execution mode, a team member updates three services before noticing the results are inconsistent: some guides still mention the old platform, others use inconsistent terminology for the new one. What went wrong and what is the correct approach?**

✅ **[CORRECT]** **A.** The team member should have used plan mode to set a consistent update strategy and terminology before executing across all 25 services

　 **B.** Direct execution was correct but should have been done in a single continuous session to maintain consistency through conversation context

　 **C.** The team member should have created a custom slash command that hardcodes the exact text replacements for each service

　 **D.** The team member should have used the Explore subagent to discover all affected files first, then made all changes in a single batch

<details><summary><b>Answer</b>: A</summary>

**Rationale:** A 25-service migration with consistency requirements is a multi-step, cross-file operation where planning is essential. Plan mode would produce an explicit strategy covering terminology, update order, and validation criteria before any changes are made, preventing the inconsistency that emerged from ad hoc execution.

**Option breakdown:**

- **A** (correct): A 25-service migration with consistency requirements is a multi-step, cross-file operation where planning is essential. Plan mode would produce an explicit strategy covering terminology, update order, and validation criteria before any changes are made, preventing the inconsistency that emerged from ad hoc execution.
- **B** (incorrect): A single session updating 25 services would exhaust the context window, causing later updates to lose awareness of earlier decisions. Context degradation would worsen the inconsistency problem, not solve it.
- **C** (incorrect): Architecture guides require contextual understanding of each service's code and dependencies — not mechanical text replacement. A slash command cannot adapt to the unique structure of each guide.
- **D** (incorrect): Discovery alone does not solve the consistency problem. Without an explicit plan defining terminology and update patterns, batch execution would produce the same inconsistencies faster.

</details>

---

### Q156 (q-3-6-010) — single-choice

**Task statement:** 3.6 cicd-integration / worktree-parallel · **Difficulty:** application · scenario: s9

**A documentation team needs to simultaneously update API reference docs for three independent microservices after a breaking change. Each update requires reading source code, updating Markdown files, and validating links. A single Claude Code session would exhaust the context window trying to hold all three services' code simultaneously. What is the recommended approach?**

　 **A.** Process the three services sequentially in the same session, running /compact between each service to free context

✅ **[CORRECT]** **B.** Use git worktree for three branches, each with its own Claude Code session on one service, then merge the results

　 **C.** Create a single skill with context: fork that processes all three services in parallel within one session

　 **D.** Split the documentation files into smaller chunks and process each chunk in a separate API call using the batch API

<details><summary><b>Answer</b>: B</summary>

**Rationale:** git worktree creates separate working directories on different branches, each with its own isolated Claude Code session. Each session has a full context budget dedicated to one service. The three updates run in parallel without interfering with each other, and results are merged via standard git workflows.

**Option breakdown:**

- **A** (incorrect): Even with /compact, each service's context (source code, documentation, edits) is substantial. Sequential processing risks context degradation as compaction summaries lose detail from earlier services, and it is slower than parallel processing.
- **B** (correct): git worktree creates separate working directories on different branches, each with its own isolated Claude Code session. Each session has a full context budget dedicated to one service. The three updates run in parallel without interfering with each other, and results are merged via standard git workflows.
- **C** (incorrect): context: fork isolates a skill's output from the main conversation but does not create multiple parallel execution contexts. A single skill cannot simultaneously process three independent services in parallel.
- **D** (incorrect): The batch API is for high-throughput, latency-tolerant workloads — not for interactive Claude Code sessions. Documentation updates require interactive exploration of source code and iterative editing, which the batch API does not support.

</details>

---

### Q157 (q-3-6-007) — single-choice

**Task statement:** 3.6 cicd-integration / structured-validation · **Difficulty:** scenario-analysis · scenario: s9

**A CI pipeline validates that generated API docs match the codebase. It runs `claude -p 'Verify that all public API endpoints in src/api/ have corresponding documentation in docs/api/'` with `--output-format json`. The check consistently reports 100% coverage, yet manual audits regularly find undocumented endpoints. What is the most likely cause?**

　 **A.** The --output-format json flag corrupts the analysis results, causing false positives

✅ **[CORRECT]** **B.** Claude Code is doing a shallow pattern match, not a deep semantic comparison, and the prompt lacks validation criteria

　 **C.** The -p flag prevents Claude Code from reading files, so it generates a plausible-sounding report without actual file access

　 **D.** The CI pipeline needs a separate review step where a second Claude Code instance verifies the first instance's findings

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Without explicit validation criteria (e.g., 'for each exported function in src/api/, check that docs/api/ contains a section with the function name, parameters, and return type'), the model may perform a shallow check. Adding structured criteria, expected output format, and examples of what constitutes a gap produces reliable verification.

**Option breakdown:**

- **A** (incorrect): --output-format json controls the output structure, not the analysis logic. It formats results as JSON for downstream parsing but does not affect the accuracy of the verification itself.
- **B** (correct): Without explicit validation criteria (e.g., 'for each exported function in src/api/, check that docs/api/ contains a section with the function name, parameters, and return type'), the model may perform a shallow check. Adding structured criteria, expected output format, and examples of what constitutes a gap produces reliable verification.
- **C** (incorrect): The -p flag runs Claude Code in non-interactive (pipe) mode. It does not restrict file access — Claude Code retains full access to its built-in tools (Read, Grep, Glob) for reading files.
- **D** (incorrect): Adding a second instance to review the first adds latency and cost without addressing the root cause. If the first instance's prompt lacks clear validation criteria, the second instance reviewing the same vague output will draw the same flawed conclusions.

</details>

---

### Q158 (q-3-3-010) — single-choice

**Task statement:** 3.3 path-specific-rules / directory-globs · **Difficulty:** scenario-analysis · scenario: s9

**A docs team maintains three content types in `docs/api/`, `docs/architecture/`, and `docs/runbooks/`, each with distinct formatting, terminology, and required sections. They want Claude Code to apply the correct standards automatically when editing any docs file, without loading all three rule sets in every session. What is the correct configuration architecture?**

　 **A.** Place all three sets of rules in the root CLAUDE.md with clear section headings so Claude Code can identify which rules apply

✅ **[CORRECT]** **B.** Create three rule files in .claude/rules/ with YAML frontmatter paths targeting each directory: paths: ['docs/api/**'] for API rules, paths: ['docs/architecture/**'] for architecture rules, and paths: ['docs/runbooks/**'] for runbook rules

　 **C.** Place a separate CLAUDE.md file in each of docs/api/, docs/architecture/, and docs/runbooks/ with the type-specific rules

　 **D.** Create three custom skills (/api-docs, /arch-docs, /runbook-docs) and require writers to invoke the correct one before editing

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Path-scoped rules in .claude/rules/ with glob patterns load only when editing files in the matching directory. Each documentation type gets its own rules loaded automatically and exclusively, conserving context tokens and eliminating the risk of applying incorrect standards.

**Option breakdown:**

- **A** (incorrect): Root CLAUDE.md loads for every session. Including all three rule sets wastes context tokens when editing only one documentation type. The model must also correctly identify which section applies, adding an unnecessary point of failure.
- **B** (correct): Path-scoped rules in .claude/rules/ with glob patterns load only when editing files in the matching directory. Each documentation type gets its own rules loaded automatically and exclusively, conserving context tokens and eliminating the risk of applying incorrect standards.
- **C** (incorrect): Directory-level CLAUDE.md files load based on the working directory hierarchy, but Claude Code sessions typically operate from the repository root. These directory-level files would only load when the agent is directly working within that specific directory, which is less reliable than path-scoped rules that match by file pattern regardless of working directory.
- **D** (incorrect): This scenario explicitly requires writers to invoke the right skill manually, which depends on human memory and discipline — the wrong pick silently applies the wrong standards. Even if the skills added a paths frontmatter to auto-activate, they'd still load as a task-style workflow rather than as always-in-context guidance. Path-scoped rules in .claude/rules/ are the correct choice: they load into context automatically when Claude reads a matching file, with no human step in the loop.

</details>

---

### Q159 (q-3-4-009) — single-choice

**Task statement:** 3.4 plan-mode-execution / explore-subagent · **Difficulty:** recall · scenario: s9

**A documentation team member asks Claude Code to update architecture guides across 12 microservice directories. Before making any changes, they want Claude Code to first explore the codebase to understand the current state of each service. What Claude Code feature allows discovery without modification?**

✅ **[CORRECT]** **A.** The Explore subagent, which runs read-only codebase discovery in a separate context and reports back

　 **B.** Plan mode with --dry-run flag, which simulates all file changes without writing them to disk

　 **C.** The allowedTools configuration set to Read and Grep only, which prevents write operations during the session

　 **D.** A PostToolUse hook on Write and Edit that rejects all file modifications during the exploration phase

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The Explore subagent is designed for read-only codebase discovery. It runs in a separate context, explores files and structure, and returns a summary of findings to the main agent. This preserves the main agent's context for the actual update work while gathering the necessary understanding.

**Option breakdown:**

- **A** (correct): The Explore subagent is designed for read-only codebase discovery. It runs in a separate context, explores files and structure, and returns a summary of findings to the main agent. This preserves the main agent's context for the actual update work while gathering the necessary understanding.
- **B** (incorrect): There is no --dry-run flag in Claude Code. Plan mode is for creating an execution plan before acting, but it does not provide a dedicated read-only exploration capability with separate context isolation.
- **C** (incorrect): While allowedTools could restrict to read-only tools, this is a session-wide configuration change that would then need to be reversed for the update phase. The Explore subagent provides purpose-built read-only exploration without reconfiguring the session.
- **D** (incorrect): Hooks that reject tool calls add complexity and would need to be disabled for the update phase. The Explore subagent provides a cleaner separation between discovery and modification without hook management overhead.

</details>

---

### Q160 (q-3-1-019) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / hook-matching · **Difficulty:** recall · scenario: s9

**A documentation team wants a PostToolUse hook that automatically runs a link checker after every file write to a documentation directory. The hook should only trigger for writes to files under docs/. What determines whether a hook fires for a given tool invocation?**

✅ **[CORRECT]** **A.** Hook configuration supports an `if` field using permission-rule syntax like Edit(*.ts) to match the tool name and arguments together

　 **B.** Hooks support a `paths:` glob array in settings.json, the same field name .claude/rules/ files use, that filters which file writes fire the hook

　 **C.** Hooks can be scoped to specific directories by placing the hook configuration file in that directory

　 **D.** Hooks fire only when the tool is invoked from a skill that has a matching paths: frontmatter

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Claude Code hooks are filtered by two configuration fields. `matcher` selects the tool name (e.g., 'Write|Edit'). `if` uses permission-rule syntax to filter on tool name and arguments together, so `Edit(*.ts)` runs only for TypeScript files and `Write(docs/**)` runs only for writes under docs/. Without an `if` field, the hook fires on every invocation that matches the matcher.

**Option breakdown:**

- **A** (correct): Claude Code hooks are filtered by two configuration fields. `matcher` selects the tool name (e.g., 'Write|Edit'). `if` uses permission-rule syntax to filter on tool name and arguments together, so `Edit(*.ts)` runs only for TypeScript files and `Write(docs/**)` runs only for writes under docs/. Without an `if` field, the hook fires on every invocation that matches the matcher.
- **B** (incorrect): There is no `paths:` field on hooks. That frontmatter belongs to .claude/rules/ files. Hook path filtering is done with the `if` field using permission-rule syntax, so this conflates two different mechanisms.
- **C** (incorrect): Hook configuration is defined in settings.json at the project or user level, not in directory-specific configuration files. Hooks do not have directory-scoped placement.
- **D** (incorrect): Hooks are independent of skills. They fire based on tool invocations regardless of whether those invocations originate from a skill, direct user interaction, or any other context.

</details>

---

### Q161 (q-3-1-020) — single-choice

**Task statement:** 3.1 claude-md-hierarchy / memory-command · **Difficulty:** application · scenario: s9

**A developer's Claude Code applies the team's API conventions correctly in some sessions but not others, on the same project. They suspect the wrong memory files are loading in the failing sessions. What is the fastest way to confirm which CLAUDE.md and rules files a session has actually loaded?**

✅ **[CORRECT]** **A.** Run /memory in the session to list the loaded memory files

　 **B.** Run /compact to reload the configuration hierarchy from disk

　 **C.** Delete ~/.claude/CLAUDE.md so only project-level configuration can load

　 **D.** Ask Claude in the session to repeat the team's API conventions back

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The guide's 3.1 skills include using the /memory command to verify which memory files are loaded and to diagnose inconsistent behaviour across sessions. /memory inspects the live hierarchy; compaction, deletion, or asking the model are indirect and unreliable.

**Option breakdown:**

- **A** (correct): /memory is the diagnostic command for the configuration hierarchy: it shows which user-level, project-level, and directory-level memory files the current session has loaded, which directly confirms or rules out the suspected loading difference.
- **B** (incorrect): /compact summarises the conversation to free context; it does not reload or report configuration files. CLAUDE.md content survives compaction, so this neither diagnoses nor fixes a loading difference.
- **C** (incorrect): Deleting user-level configuration is a destructive guess. It might mask the symptom, but it destroys the developer's personal setup without ever confirming what the failing sessions were loading.
- **D** (incorrect): The model can paraphrase conventions from training or partial context, so a fluent answer does not prove the files loaded. /memory reports the loaded files deterministically instead of relying on the model's self-report.

</details>

---

### Q162 (q-3-5-009) — single-choice

**Task statement:** 3.5 iterative-refinement / test-driven · **Difficulty:** application · scenario: s3

**A developer asks Claude Code to implement a rate limiter. Each iteration looks plausible, but edge cases keep surfacing in manual testing: burst traffic, clock skew, concurrent requests. Review comments fix one case and regress another. Which workflow change gives the iteration loop an objective target?**

✅ **[CORRECT]** **A.** Write the test suite first, then iterate by sharing the failing test output

　 **B.** Switch to plan mode so the architecture is agreed before any implementation begins

　 **C.** Describe all the edge cases in more precise prose in a single detailed message

　 **D.** Use the interview pattern so Claude asks clarifying questions before each iteration

<details><summary><b>Answer</b>: A</summary>

**Rationale:** The guide's 3.5 bullets name test-driven iteration: write the test suite covering expected behaviour and edge cases first, then iterate by sharing test failures. Failing tests give every subsequent iteration an objective target, unlike prose descriptions or per-iteration review comments.

**Option breakdown:**

- **A** (correct): Test-driven iteration turns vague review comments into an objective, repeatable target: the failing tests define exactly what is wrong, and each iteration is judged by the same suite, which prevents fix-one-regress-another churn.
- **B** (incorrect): Plan mode helps choose an approach for large or ambiguous changes, but the problem here is verification during iteration, not approach selection. A plan does not stop regressions from slipping through unreviewed edge cases.
- **C** (incorrect): More precise prose still relies on the model interpreting descriptions consistently and on humans catching regressions by eye. Without executable checks, the loop has no objective pass/fail signal.
- **D** (incorrect): The interview pattern surfaces unknown requirements before implementation in unfamiliar domains. These edge cases are already known; what is missing is a mechanical way to verify each iteration against them.

</details>

---

### Q163 (q-3-3-011) — multiple-response (select 2)

**Task statement:** 3.3 path-specific-rules / glob-patterns · **Difficulty:** application · scenario: s3

_Select 2 options._

**Test-file conventions must apply to *.test.tsx files spread across many directories of a codebase. Why is a .claude/rules/ file with a paths glob the right mechanism? (Select 2)**

✅ **[CORRECT]** **A.** One glob such as **/*.test.tsx captures the files by type wherever they live in the tree.

　 **B.** The rule is appended to every session's context, so the conventions are never missed.

✅ **[CORRECT]** **C.** The rule loads only when Claude edits a matching file, keeping irrelevant context and token usage out of other sessions.

　 **D.** A CLAUDE.md file in each directory would achieve the same effect with less duplication.

<details><summary><b>Answer</b>: A, C</summary>

**Rationale:** Path-scoped rules activate on glob match, so file-type conventions follow the files wherever they sit, without loading into unrelated sessions.

**Option breakdown:**

- **A** (correct): Glob patterns apply conventions by file type regardless of directory, which per-directory files cannot do cleanly.
- **B** (incorrect): Always-on loading is what path-specific rules avoid; a rule that loads everywhere is just CLAUDE.md content.
- **C** (correct): Conditional activation on path match is the core benefit of path-scoped rules.
- **D** (incorrect): Scattered test files would need a copy of the convention in every directory, which is exactly the duplication glob-scoped rules remove.

</details>

---

### Q164 (q-3-5-010) — multiple-response (select 3)

**Task statement:** 3.5 iterative-refinement / examples · **Difficulty:** application · scenario: s3

_Select 3 options._

**A data-transformation prompt keeps producing inconsistent output from prose instructions alone. Which refinement techniques should you apply? (Select 3)**

　 **A.** Rewrite the prose instructions as longer, more detailed paragraphs.

✅ **[CORRECT]** **B.** Write a test suite first, then iterate by sharing the failing tests.

✅ **[CORRECT]** **C.** Provide two or three concrete input/output examples of the expected transformation.

　 **D.** Collect every independent issue into one combined message to save round trips.

✅ **[CORRECT]** **E.** Add edge-case examples covering the inputs where the output has been most inconsistent.

<details><summary><b>Answer</b>: B, C, E</summary>

**Rationale:** When prose is interpreted inconsistently the guide reaches for concrete examples, test-driven iteration, and extending those examples to the drifting edge cases. The interview pattern is not the fix here: the developer already knows the exact transformation, so questions surface nothing new. Interview suits unfamiliar domains.

**Option breakdown:**

- **A** (incorrect): The problem is prose interpretation itself; the guide's answer is examples, not more prose.
- **B** (correct): Test-driven iteration turns each failure into precise, actionable feedback for the next pass.
- **C** (correct): Concrete examples are the guide's most effective way to communicate transformations that prose describes inconsistently.
- **D** (incorrect): The guide batches issues into one message only when the fixes interact; independent problems are fixed sequentially.
- **E** (correct): Extending the example set to the specific inputs that drift is the documented refinement for inconsistent transformation output. It works for the same reason the base examples do: it replaces prose the model can interpret loosely with concrete pairs it cannot.

</details>

---

### Q165 (q-3-6-011) — single-choice

**Task statement:** 3.6 cicd-integration / github-action-flags · **Difficulty:** application · scenario: s5

**A team runs anthropics/claude-code-action@v1 so Claude reviews every pull request against the checklist in CLAUDE.md. They want Claude to keep its default coding-assistant behaviour and also apply three extra review rules that are not in CLAUDE.md. Where do the extra rules go?**

　 **A.** In the action's custom_instructions input

✅ **[CORRECT]** **B.** In claude_args, as --append-system-prompt with the three rules

　 **C.** In claude_args, as --system-prompt with the three rules

　 **D.** In the prompt input, which also switches the action into automation mode so the rules apply on every pull request event

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The action takes CLI flags through claude_args, and the flag that adds rules while keeping the default prompt is --append-system-prompt. --system-prompt would replace the default, custom_instructions is the retired pre-v1 input that mapped to the same flag, and prompt is the per-run task rather than a system-prompt extension. Not named in the exam guide; included because readers who sat the exam report questions on the GitHub Action.

**Option breakdown:**

- **A** (incorrect): custom_instructions was a pre-v1 input. In v1 it has no same-name equivalent; its job moved to --append-system-prompt passed through claude_args.
- **B** (correct): CLI flags reach the action through the claude_args input, and --append-system-prompt adds text to the default system prompt without replacing it, so Claude keeps its default tool guidance and coding conventions plus the extra rules.
- **C** (incorrect): --system-prompt replaces the entire default system prompt. Claude would lose its default coding-assistant behaviour, which the team said it wanted to keep. Replace is for a different identity or permission model, not for a few extra rules.
- **D** (incorrect): The prompt input is the task for one run and its presence switches the action to automation mode. It does not extend the system prompt, and standing review rules belong with the system prompt, not the per-run task.

</details>

---

### Q166 (q-3-6-012) — single-choice

**Task statement:** 3.6 cicd-integration / github-action-modes · **Difficulty:** recall · scenario: s5

**A workflow file includes the anthropics/claude-code-action@v1 step with an API key secret but gives it no prompt input. What happens when the workflow runs?**

　 **A.** The job fails at start-up because prompt is a required input

✅ **[CORRECT]** **B.** The action waits for @claude (the default trigger phrase) in an issue or PR comment and answers there

　 **C.** Claude runs once with an empty prompt and exits after a single turn

　 **D.** The action reads the repository's CLAUDE.md and uses its contents as the prompt for an automation-mode run

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The action detects its mode from the workflow: no prompt means interactive mode, waiting for @claude (or a custom trigger_phrase) in a comment; a prompt means automation mode on whatever event fired the workflow. Not named in the exam guide; included because readers who sat the exam report questions on the GitHub Action.

**Option breakdown:**

- **A** (incorrect): prompt is optional. Omitting it is how the action is put into interactive mode, so the job runs normally.
- **B** (correct): With no prompt input the action runs in interactive mode: it responds to the trigger phrase in a comment, review, or the body of a new issue, and posts progress and results as a comment on that issue or pull request.
- **C** (incorrect): The action does not run Claude with an empty prompt. The absence of a prompt selects interactive mode rather than an automation run.
- **D** (incorrect): CLAUDE.md is project context that Claude reads in every mode; it is never used as the task prompt. Automation mode requires an explicit prompt input.

</details>

---

### Q167 (q-3-6-013) — single-choice

**Task statement:** 3.6 cicd-integration / github-action-tools · **Difficulty:** scenario-analysis · scenario: s5

**A scheduled workflow runs anthropics/claude-code-action@v1 with prompt set to 'Summarise yesterday's commits and open issues'. The run completes, but the summary says Claude could not read any commits or issues. The API key is valid and the job has contents: read and issues: read permissions. What is the most likely cause?**

　 **A.** There is no actions/checkout step, so no repository files were on the runner for Claude to read

　 **B.** Scheduled runs are attributed to a bot actor, so the action refused to start

✅ **[CORRECT]** **C.** A plain-text prompt grants no tools; the GitHub tools have to be allowed with --allowedTools in claude_args

　 **D.** --max-turns defaults to 1 in scheduled runs, so Claude ran out of turns before it could call a tool

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Workflow permissions bound what the job may do on GitHub; they do not give Claude tools. A plain-text prompt starts with none, so the GitHub MCP tools the task needs must be allowed through --allowedTools in claude_args (or a settings permission rule). Checkout is irrelevant for API reads, the actor check would have failed the run rather than completed it, and --max-turns has no default of 1. Not named in the exam guide; included because readers who sat the exam report questions on the GitHub Action.

**Option breakdown:**

- **A** (incorrect): Commits and issues are read through the GitHub API, not from files on disk, so a checkout step is not needed for this task. The documented daily-report example omits checkout for exactly that reason.
- **B** (incorrect): The human-actor check fails the run before Claude starts. This run completed and produced a summary, so the actor check passed.
- **C** (correct): In automation mode with a plain-text prompt Claude has no shell or GitHub API access until the workflow grants it, with --allowedTools in claude_args or a permissions.allow rule in the settings input. Without that, Claude can only report that it could not read anything.
- **D** (incorrect): There is no such default. --max-turns is a cap you set yourself through claude_args; leaving it unset does not limit the run to one turn.

</details>

---


## Domain 4 — Prompt Engineering & Structured Output (20%)

_44 questions_

### Q168 (q-4-1-001) — single-choice

**Task statement:** 4.1 system-prompts / false-positives · **Difficulty:** application · scenario: s5

**Your CI/CD code review pipeline has a 40% false positive rate on 'documentation mismatch' findings, causing developers to ignore ALL review categories. What is the most effective fix?**

　 **A.** Add 'only report high-confidence documentation issues' to the system prompt

✅ **[CORRECT]** **B.** Temporarily disable the documentation mismatch category while refining its prompts with explicit criteria and code examples

　 **C.** Increase the model temperature to get more varied results and filter outliers

　 **D.** Add a second model pass to verify each finding before reporting

<details><summary><b>Answer</b>: B</summary>

**Rationale:** This restores trust in other categories immediately while you iterate on the problematic category with specific criteria.

**Option breakdown:**

- **A** (incorrect): Vague confidence instructions do not improve precision. The model has no concrete criteria for what 'high-confidence' means.
- **B** (correct): This restores trust in other categories immediately while you iterate on the problematic category with specific criteria.
- **C** (incorrect): Temperature affects randomness, not precision. This would likely increase false positives.
- **D** (incorrect): A second pass without better criteria will have the same false positive problem. Fix the criteria first.

</details>

---

### Q169 (q-4-2-001) — single-choice

**Task statement:** 4.2 few-shot-prompting / few-shot-coverage · **Difficulty:** application · scenario: s6

**Your extraction pipeline correctly identifies data in structured tables but returns empty fields when the same information appears in narrative paragraphs. Detailed instructions specify all required fields. What should you try first?**

　 **A.** Increase the model's context window to process more of the document

✅ **[CORRECT]** **B.** Add few-shot examples showing correct extraction from both structured tables and narrative paragraphs

　 **C.** Add a pre-processing step to convert all narrative text into tables

　 **D.** Add a post-processing retry that re-extracts any empty fields

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Few-shot examples demonstrating correct handling of varied document structures directly address inconsistent extraction quality across formats.

**Option breakdown:**

- **A** (incorrect): The model already finds data in tables. The issue is not context size but inconsistent handling of different document structures.
- **B** (correct): Few-shot examples demonstrating correct handling of varied document structures directly address inconsistent extraction quality across formats.
- **C** (incorrect): This adds unnecessary complexity. The model should handle varied formats — few-shot examples teach it how.
- **D** (incorrect): Retrying without better guidance will produce the same empty results. The model needs examples of correct extraction from narrative text.

</details>

---

### Q170 (q-4-3-001) — single-choice

**Task statement:** 4.3 structured-output / nullable-fields · **Difficulty:** scenario-analysis · scenario: s6

**Your extraction system uses tool_use with a strict JSON schema. All fields are marked as required. Testers report that the model invents plausible-looking dates and amounts when processing documents that lack this information. What is the best fix?**

　 **A.** Add an instruction telling the model not to hallucinate

　 **B.** Switch from tool_use to prompt-based JSON extraction

✅ **[CORRECT]** **C.** Make fields optional/nullable when source documents may not contain the information

　 **D.** Add a validation step that checks all values against the source document

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Optional/nullable fields allow the model to return null instead of fabricating values. This directly prevents fabrication for missing information.

**Option breakdown:**

- **A** (incorrect): Vague instructions do not override the schema constraint. Required fields pressure the model to produce values.
- **B** (incorrect): This moves backwards in reliability. Prompt-based JSON introduces syntax errors without solving the fabrication problem.
- **C** (correct): Optional/nullable fields allow the model to return null instead of fabricating values. This directly prevents fabrication for missing information.
- **D** (incorrect): Post-hoc validation is useful but does not address the root cause. Making fields optional prevents fabrication at the schema level.

</details>

---

### Q171 (q-4-4-001) — single-choice

**Task statement:** 4.4 validation-retry / retry-boundary · **Difficulty:** scenario-analysis · scenario: s6

**Your extraction pipeline validates that line item amounts sum to the stated total. For Document A, the sum is £450 but the stated total is £500. For Document B, the 'department' field is missing entirely from the source text. Which retry strategy is correct?**

　 **A.** Retry both: send the validation error for Document A and instruct the model to find the missing department for Document B

✅ **[CORRECT]** **B.** Retry Document A with the discrepancy error; flag Document B for human review since the information is absent from the source

　 **C.** Retry both documents with the same prompt since extraction is non-deterministic

　 **D.** Skip retries for both and flag them for human review

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Document A has a fixable discrepancy (the model may have missed a line item). Document B has genuinely absent information — retries are ineffective.

**Option breakdown:**

- **A** (incorrect): Document B's department is absent from the source. Retrying will not make information appear that does not exist.
- **B** (correct): Document A has a fixable discrepancy (the model may have missed a line item). Document B has genuinely absent information — retries are ineffective.
- **C** (incorrect): Non-determinism does not create information that is absent. Document A may benefit from retry; Document B will not.
- **D** (incorrect): Document A's discrepancy is likely fixable with error feedback. Skipping the retry wastes the model's self-correction capability.

</details>

---

### Q172 (q-4-5-001) — single-choice

**Task statement:** 4.5 batch-processing / batch-vs-realtime · **Difficulty:** application · scenario: s5

**Your manager proposes switching both your blocking pre-merge code review and your overnight technical debt report to the Message Batches API for 50% cost savings. How should you evaluate this proposal?**

　 **A.** Switch both to batch processing with status polling to check for completion

✅ **[CORRECT]** **B.** Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks

　 **C.** Keep real-time calls for both to avoid batch result ordering issues

　 **D.** Switch both to batch with a timeout fallback to real-time if batches take too long

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Pre-merge checks are blocking workflows where developers wait. The batch API's 24-hour window makes it unsuitable. Technical debt reports are overnight and latency-tolerant.

**Option breakdown:**

- **A** (incorrect): Batch processing has no guaranteed latency SLA. Polling does not make it suitable for blocking pre-merge checks.
- **B** (correct): Pre-merge checks are blocking workflows where developers wait. The batch API's 24-hour window makes it unsuitable. Technical debt reports are overnight and latency-tolerant.
- **C** (incorrect): Batch results can be correlated using custom_id fields. Ordering is not the issue — latency requirements are.
- **D** (incorrect): This adds unnecessary complexity. Match each API to its latency requirements: synchronous for blocking, batch for tolerant.

</details>

---

### Q173 (q-4-6-001) — single-choice

**Task statement:** 4.6 multi-pass-review / multi-pass · **Difficulty:** scenario-analysis · scenario: s5

**A PR modifying 14 files receives inconsistent review: detailed feedback on some files, superficial comments on others, and contradictory findings (flagging a pattern in one file while approving identical code elsewhere). What is the best restructuring?**

　 **A.** Switch to a higher-tier model with a larger context window

　 **B.** Run three independent passes on the full PR and only flag issues found in at least two passes

✅ **[CORRECT]** **C.** Split into per-file local analysis passes plus a separate cross-file integration pass

　 **D.** Require developers to split large pull requests into smaller submissions of 3-4 files each before review.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Per-file analysis ensures consistent depth. The integration pass catches cross-file data flow issues. This directly addresses attention dilution.

**Option breakdown:**

- **A** (incorrect): Larger context windows do not solve attention quality issues. The problem is attention dilution, not context size.
- **B** (incorrect): This suppresses real bug detection by requiring consensus on issues that may only be caught intermittently.
- **C** (correct): Per-file analysis ensures consistent depth. The integration pass catches cross-file data flow issues. This directly addresses attention dilution.
- **D** (incorrect): This shifts burden to developers without improving the review system itself.

</details>

---

### Q174 (q-4-1-002) — single-choice

**Task statement:** 4.1 system-prompts / severity-examples · **Difficulty:** application · scenario: s5

**Your Claude Code review prompt for the pipeline's polyglot codebase classifies severity using prose descriptions like 'critical means the code is dangerous' and 'minor means the code is slightly suboptimal'. Developers complain that identical code patterns receive different severity ratings across runs. What is the most effective improvement?**

✅ **[CORRECT]** **A.** Replace prose severity descriptions with concrete TypeScript code examples for each severity level.

　 **B.** Add a confidence threshold so only findings above 90% confidence are reported, filtering out uncertain severity ratings

　 **C.** Lower the model temperature to 0 to ensure deterministic severity ratings

　 **D.** Add a second model pass that re-evaluates each finding's severity to catch inconsistencies

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Severity calibration with concrete code examples produces consistent classification across invocations. Prose descriptions are inherently ambiguous and leave the model to interpret severity differently each time.

**Option breakdown:**

- **A** (correct): Severity calibration with concrete code examples produces consistent classification across invocations. Prose descriptions are inherently ambiguous and leave the model to interpret severity differently each time.
- **B** (incorrect): Self-reported confidence scores are poorly calibrated. Confidence-based filtering does not fix the root cause, which is ambiguous severity criteria. Explicit code examples are the correct fix.
- **C** (incorrect): While lower temperature reduces randomness, it does not address the fundamental problem: the model has no concrete reference for what each severity level looks like. Code examples provide that reference.
- **D** (incorrect): A second pass using the same vague prose criteria will produce the same inconsistency. The criteria themselves must be improved with concrete code examples before adding verification layers.

</details>

---

### Q175 (q-4-2-002) — single-choice

**Task statement:** 4.2 few-shot-prompting / few-shot-style · **Difficulty:** scenario-analysis · scenario: s5

**Your Claude Code agent generates unit tests in the CI pipeline. When given detailed instructions alone, it produces tests with inconsistent assertion styles: sometimes using expect().toBe(), sometimes assert.equal(), and occasionally mixing both in the same file. Adding more detailed instructions about assertion style did not fix the problem. What should you do next?**

　 **A.** Switch to a different model that better follows formatting instructions

　 **B.** Add a linter post-processing step to automatically convert all assertions to a single style

　 **C.** Add 2-4 few-shot examples showing complete test files with the desired assertion style and reasoning for why that style was chosen over alternatives

✅ **[CORRECT]** **D.** Add 2-4 few-shot examples demonstrating the desired assertion style with reasoning for each testing decision, covering edge cases like async functions and error handling

<details><summary><b>Answer</b>: D</summary>

**Rationale:** Few-shot examples are the most effective technique when detailed instructions alone produce inconsistent formatting. Including 2-4 examples with reasoning teaches generalisation to novel patterns, not just pattern-matching. Covering varied scenarios (async, error handling) ensures the model generalises correctly.

**Option breakdown:**

- **A** (incorrect): The issue is not model capability. When detailed instructions alone produce inconsistent formatting, the correct intervention is few-shot examples, not a model change.
- **B** (incorrect): Post-processing masks the problem rather than solving it. The model should learn to produce consistent output directly, which few-shot examples achieve more effectively.
- **C** (incorrect): This is partially correct but incomplete. The examples only cover the assertion style preference. Without covering varied scenarios (async functions, error handling), the model pattern-matches the specific cases shown rather than generalising the style consistently across all test types.
- **D** (correct): Few-shot examples are the most effective technique when detailed instructions alone produce inconsistent formatting. Including 2-4 examples with reasoning teaches generalisation to novel patterns, not just pattern-matching. Covering varied scenarios (async, error handling) ensures the model generalises correctly.

</details>

---

### Q176 (q-4-3-002) — single-choice

**Task statement:** 4.3 structured-output / tool-choice-forcing · **Difficulty:** application · scenario: s6

**Your legal document extraction pipeline uses tool_use with tool_choice set to 'auto'. The pipeline processes contracts and sometimes receives plain text analysis instead of the structured JSON extraction you need. The team suggests switching to prompt-based JSON with explicit formatting instructions. What is the correct approach?**

　 **A.** Switch to prompt-based JSON as suggested, since the model clearly prefers text responses for these documents

　 **B.** Keep tool_use but switch tool_choice from 'auto' to 'any' to guarantee the model always returns a structured tool call

✅ **[CORRECT]** **C.** Keep tool_use and set tool_choice to force the specific extraction tool by name, guaranteeing structured output on every request.

　 **D.** Add stronger instructions in the system prompt telling the model to always use the extraction tool and never respond with plain text

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Forcing a specific tool with tool_choice {type: 'tool', name: 'extract_contract'} guarantees the model calls that exact tool every time, eliminating both text-only responses and wrong-tool selection. This is the most reliable approach for guaranteed structured output.

**Option breakdown:**

- **A** (incorrect): Prompt-based JSON is less reliable than tool_use and can produce malformed output. The issue is tool_choice configuration, not the tool_use mechanism itself.
- **B** (incorrect): While 'any' guarantees a tool call, it lets the model choose which tool. If you have multiple tools defined, the model might call the wrong one. For a single extraction tool, this works, but the most precise solution is to force the specific extraction tool.
- **C** (correct): Forcing a specific tool with tool_choice {type: 'tool', name: 'extract_contract'} guarantees the model calls that exact tool every time, eliminating both text-only responses and wrong-tool selection. This is the most reliable approach for guaranteed structured output.
- **D** (incorrect): Instructions alone cannot guarantee tool use when tool_choice is 'auto'. The API-level tool_choice parameter is the correct mechanism for enforcing structured output, not prompt instructions.

</details>

---

### Q177 (q-4-4-002) — single-choice

**Task statement:** 4.4 validation-retry / retry-with-error · **Difficulty:** application · scenario: s6

**Your extraction pipeline retries failed documents, but the retry simply resends the original document with the same prompt. Success rates on retries are only marginally better than the first attempt. Developers have identified that most failures are format mismatches where the model places values in the wrong fields. How should you improve the retry mechanism?**

　 **A.** Increase the number of retries from 1 to 3, since extraction is non-deterministic and more attempts improve odds

　 **B.** Switch to a different model for retries so a fresh perspective catches the errors

　 **C.** Skip retries altogether and route every failure directly to human review, so no API cost is wasted on a retry.

✅ **[CORRECT]** **D.** Send the original document, the failed extraction, and the validation error naming the misplaced fields.

<details><summary><b>Answer</b>: D</summary>

**Rationale:** Retry-with-error-feedback is dramatically more effective than naive retries. Sending the original document, the failed extraction, and the specific validation error allows the model to self-correct. Format mismatches are fixable errors that respond well to this approach.

**Option breakdown:**

- **A** (incorrect): Naive retries without error feedback produce the same mistakes. More attempts at the same flawed approach yield diminishing returns. The model needs to see what went wrong.
- **B** (incorrect): The issue is not the model but the absence of error context. Any model retrying without seeing the specific validation error will likely repeat the same mistakes.
- **C** (incorrect): Format mismatches are fixable errors. The model can self-correct when given proper error feedback. Skipping retries wastes the model's self-correction capability for errors that are resolvable.
- **D** (correct): Retry-with-error-feedback is dramatically more effective than naive retries. Sending the original document, the failed extraction, and the specific validation error allows the model to self-correct. Format mismatches are fixable errors that respond well to this approach.

</details>

---

### Q178 (q-4-5-002) — single-choice

**Task statement:** 4.5 batch-processing / batch-failure · **Difficulty:** scenario-analysis · scenario: s5

**Your CI/CD pipeline generates nightly security audit reports using the Message Batches API. A batch of 200 documents completes overnight, but 15 documents fail due to exceeding the context window. The team proposes resubmitting the entire batch of 200 documents. What is the correct failure handling strategy?**

　 **A.** Resubmit the entire batch since you cannot identify which documents failed

✅ **[CORRECT]** **B.** Resubmit only the 15 failed documents identified by custom_id, chunking the oversized documents before resubmission

　 **C.** Switch the entire pipeline to synchronous processing to avoid batch failures

　 **D.** Increase the batch processing timeout to give the system more time to handle large documents

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Identify failed documents by custom_id, then resubmit only failures with modifications (chunking oversized documents). This is the correct batch failure handling pattern — it avoids reprocessing the 185 successful documents and addresses the root cause of the failures.

**Option breakdown:**

- **A** (incorrect): The batch API uses custom_id fields to correlate request/response pairs. Failed documents can be identified by their custom_id, making full resubmission unnecessary and wasteful.
- **B** (correct): Identify failed documents by custom_id, then resubmit only failures with modifications (chunking oversized documents). This is the correct batch failure handling pattern — it avoids reprocessing the 185 successful documents and addresses the root cause of the failures.
- **C** (incorrect): Nightly security audits are latency-tolerant workloads perfectly suited for batch processing. Switching to synchronous forfeits the 50% cost savings without solving the oversized document problem.
- **D** (incorrect): The failure is due to documents exceeding the context window, not a timeout issue. The documents need to be chunked to fit within the model's context limits.

</details>

---

### Q179 (q-4-6-002) — single-choice

**Task statement:** 4.6 multi-pass-review / self-review-bias · **Difficulty:** application · scenario: s5

**Your Claude Code setup reviews generated code by asking the same model instance to critique its own output immediately after generation, within the same conversation. The team notices the reviews are overly favourable and miss bugs that an external reviewer would catch. What is the root cause and correct fix?**

　 **A.** The model needs more detailed review instructions; add a comprehensive checklist of what to look for during self-review

　 **B.** Enable extended thinking so the model reasons more carefully about potential issues in its own code

✅ **[CORRECT]** **C.** Route the review to a separate Claude instance that has no access to the generation conversation

　 **D.** Lower the temperature during the review phase to make the model more precise and less likely to approve questionable code

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A model reviewing its own output in the same session retains reasoning context and is less likely to question its own decisions. An independent instance without prior context catches more subtle issues because it approaches the code fresh.

**Option breakdown:**

- **A** (incorrect): More detailed instructions do not overcome the fundamental limitation. The model retains its reasoning context from generation and is less likely to question its own decisions regardless of how detailed the checklist is.
- **B** (incorrect): Extended thinking does not solve the self-review limitation. The model still retains its reasoning context and is biased towards its own output. Extended thinking makes the existing reasoning deeper, not more independent.
- **C** (correct): A model reviewing its own output in the same session retains reasoning context and is less likely to question its own decisions. An independent instance without prior context catches more subtle issues because it approaches the code fresh.
- **D** (incorrect): Temperature affects response variability, not the fundamental bias of self-review. The model will still be biased towards its own output regardless of temperature settings. An independent instance is the correct architectural fix.

</details>

---

### Q180 (q-4-1-003) — single-choice

**Task statement:** 4.1 system-prompts / severity-examples · **Difficulty:** recall · scenario: s5

**When writing system prompts for Claude Code to classify code review findings by severity, which approach produces the most consistent classification across repeated invocations?**

　 **A.** Prose descriptions of each severity level, such as 'critical issues are dangerous to production'

✅ **[CORRECT]** **B.** Concrete code examples for each severity level, showing actual snippets that qualify as critical, major, and minor

　 **C.** A numerical scoring rubric from 1 to 10 with threshold ranges for each severity level

　 **D.** A decision tree with yes/no questions that the model follows to determine severity

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Concrete code examples provide an unambiguous reference for each severity level. The model matches incoming code against these examples rather than interpreting vague prose, producing consistent classification.

**Option breakdown:**

- **A** (incorrect): Prose descriptions are inherently ambiguous. Different invocations interpret words like 'dangerous' and 'suboptimal' differently, leading to inconsistent severity ratings.
- **B** (correct): Concrete code examples provide an unambiguous reference for each severity level. The model matches incoming code against these examples rather than interpreting vague prose, producing consistent classification.
- **C** (incorrect): Numerical scores still require the model to interpret what constitutes a '7' versus an '8'. Without concrete examples, this is just prose descriptions with numbers attached.
- **D** (incorrect): Decision trees can help but still rely on subjective interpretation at each branch point. Concrete code examples are more effective because they directly show the model what each severity level looks like.

</details>

---

### Q181 (q-4-3-005) — single-choice

**Task statement:** 4.3 structured-output / tool-use-vs-prompt-json · **Difficulty:** recall · scenario: s6

**Why does using tool_use for structured output provide stronger guarantees than prompt-based JSON extraction?**

　 **A.** tool_use is faster because the model skips generating the natural language tokens that would otherwise surround the extracted values.

✅ **[CORRECT]** **B.** tool_use enforces schema compliance, so output matches the defined structure, whereas prompt-based JSON risks syntax errors.

　 **C.** tool_use costs less per token than prompt-based extraction does, so the same extraction job comes out cheaper overall on every run.

　 **D.** tool_use can pull fields that prompt-based JSON cannot reach, because the schema gives the model direct access to the raw source document.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** tool_use validates output against a predefined schema, ensuring all required fields are present and correctly typed. Prompt-based JSON relies on the model to remember and follow formatting rules, which can produce malformed output, missing brackets, or omitted fields.

**Option breakdown:**

- **A** (incorrect): tool_use does not inherently improve speed. Its advantage is schema compliance, not latency.
- **B** (correct): tool_use validates output against a predefined schema, ensuring all required fields are present and correctly typed. Prompt-based JSON relies on the model to remember and follow formatting rules, which can produce malformed output, missing brackets, or omitted fields.
- **C** (incorrect): Pricing is not the differentiator. The advantage of tool_use is guaranteed schema compliance, not cost.
- **D** (incorrect): Both approaches have access to the same source content. tool_use does not grant additional data access; it guarantees the output structure.

</details>

---

### Q182 (q-4-2-005) — single-choice

**Task statement:** 4.2 few-shot-prompting / how-many · **Difficulty:** recall · scenario: s5

**What is the recommended number of few-shot examples to include when guiding Claude's output format, and what should those examples contain?**

　 **A.** 1 example showing the ideal output format without explanation

✅ **[CORRECT]** **B.** 2-4 examples with reasoning, covering varied scenarios including edge cases

　 **C.** 8-10 examples covering every possible edge case, so the prompt maximises coverage of the input space.

　 **D.** 2-4 examples showing only the correct output, without reasoning or edge cases

<details><summary><b>Answer</b>: B</summary>

**Rationale:** 2-4 examples with reasoning is the recommended range. Including reasoning teaches the model why each decision was made, enabling generalisation. Covering varied scenarios (such as async functions and error handling) prevents the model from pattern-matching only the specific cases shown.

**Option breakdown:**

- **A** (incorrect): A single example risks the model overfitting to that specific case rather than generalising the pattern. Without reasoning, the model cannot distinguish which aspects of the example are important.
- **B** (correct): 2-4 examples with reasoning is the recommended range. Including reasoning teaches the model why each decision was made, enabling generalisation. Covering varied scenarios (such as async functions and error handling) prevents the model from pattern-matching only the specific cases shown.
- **C** (incorrect): Too many examples consume context window space and can cause the model to overfit to the examples rather than generalise. 2-4 well-chosen examples with reasoning are more effective.
- **D** (incorrect): The correct number of examples is right, but omitting reasoning and edge cases limits effectiveness. The model needs reasoning to generalise and edge cases to handle varied inputs.

</details>

---

### Q183 (q-4-5-003) — single-choice

**Task statement:** 4.5 batch-processing / batch-tradeoff · **Difficulty:** recall · scenario: s5

**What is the primary cost benefit of the Message Batches API, and what is the trade-off?**

　 **A.** 25% cost reduction with a guaranteed 1-hour processing window

✅ **[CORRECT]** **B.** 50% cost reduction with a 24-hour processing window, suitable only for latency-tolerant workloads

　 **C.** 50% cost reduction with guaranteed sub-minute response times for each item in the batch

　 **D.** 75% cost reduction with a 48-hour processing window

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The Batches API offers 50% cost savings but processes within a 24-hour window with no guaranteed latency SLA. This makes it suitable only for workloads where immediate results are not needed, such as overnight reports or bulk analysis.

**Option breakdown:**

- **A** (incorrect): The cost reduction is 50%, not 25%, and the processing window is 24 hours, not 1 hour.
- **B** (correct): The Batches API offers 50% cost savings but processes within a 24-hour window with no guaranteed latency SLA. This makes it suitable only for workloads where immediate results are not needed, such as overnight reports or bulk analysis.
- **C** (incorrect): The Batches API does not guarantee sub-minute responses. The trade-off is specifically the lack of latency guarantees within the 24-hour window.
- **D** (incorrect): The cost reduction is 50% and the processing window is 24 hours. These figures are defined in the Batches API specification.

</details>

---

### Q184 (q-4-6-003) — single-choice

**Task statement:** 4.6 multi-pass-review / self-review-bias · **Difficulty:** recall · scenario: s5

**Why does asking Claude to review its own output within the same conversation session produce unreliable reviews?**

　 **A.** The model has a hard-coded limit on how many issues it can identify per session

　 **B.** The model's context window fills up, leaving insufficient space for the review analysis itself to run in.

✅ **[CORRECT]** **C.** The model retains reasoning context; use a separate independent instance with no prior context.

　 **D.** The model's temperature setting resets to a higher value during review, producing less precise analysis

<details><summary><b>Answer</b>: C</summary>

**Rationale:** A model reviewing its own output in the same session retains the reasoning that led to its original decisions. This creates a confirmation bias where the model is less likely to question choices it already justified to itself.

**Option breakdown:**

- **A** (incorrect): There is no hard-coded limit on identified issues. The problem is cognitive bias from retained reasoning context, not a technical constraint.
- **B** (incorrect): Context window exhaustion is a separate concern. Self-review bias occurs even when ample context remains because the model retains its original reasoning.
- **C** (correct): A model reviewing its own output in the same session retains the reasoning that led to its original decisions. This creates a confirmation bias where the model is less likely to question choices it already justified to itself.
- **D** (incorrect): Temperature does not reset between turns. The issue is reasoning bias from the shared session context, not temperature settings.

</details>

---

### Q185 (q-4-4-005) — single-choice

**Task statement:** 4.4 validation-retry / inter-step-validation · **Difficulty:** recall · scenario: s6

**In a multi-step prompt chain, what should happen between each step to maintain pipeline reliability?**

　 **A.** Each step's output should be passed directly to the next step without interruption to maintain conversational flow

✅ **[CORRECT]** **B.** Validate between steps, checking each step's output meets the expected format and content before the next runs.

　 **C.** The entire chain should run in a single API call to minimise latency and cost

　 **D.** A human reviewer should approve each intermediate output before the chain continues

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Inter-step validation catches errors early, preventing cascading failures. Each step should produce focused output that is validated before the next step consumes it. This is a core principle of reliable prompt chaining.

**Option breakdown:**

- **A** (incorrect): Passing output directly without validation risks cascading errors. A malformed output from step 1 corrupts all downstream steps.
- **B** (correct): Inter-step validation catches errors early, preventing cascading failures. Each step should produce focused output that is validated before the next step consumes it. This is a core principle of reliable prompt chaining.
- **C** (incorrect): Combining all steps in a single call eliminates the ability to validate between steps and creates attention dilution. Separate focused steps with validation are more reliable.
- **D** (incorrect): Human-in-the-loop at every step defeats the purpose of automation. Programmatic validation between steps is the correct approach for production pipelines.

</details>

---

### Q186 (q-4-1-004) — single-choice

**Task statement:** 4.1 system-prompts / keyword-overlap · **Difficulty:** application · scenario: s5

**Your CI/CD pipeline uses a system prompt with a tool named 'check_security' and also includes instructions that say 'check the security of each function'. Developers report that the model sometimes produces a text-based security analysis instead of calling the check_security tool. What is the most likely cause?**

　 **A.** The model's temperature is set too high, which is causing it to select tools at random rather than by their fit to the request in hand, so the wrong tool wins.

✅ **[CORRECT]** **B.** The 'check the security' instruction keyword-overlaps the 'check_security' tool name, so the model follows the text instead of calling the tool.

　 **C.** The model cannot call tools at all from inside a CI/CD pipeline context, so the calls never reach it and nothing is extracted at all.

　 **D.** The system prompt has grown too long, so the model skips over the tool definitions near the end and never registers that check_security is available to call.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When system prompt instructions use phrasing that closely mirrors tool names, the model can interpret 'check the security' as a general instruction rather than a trigger for the check_security tool. Distinct naming reduces this ambiguity.

**Option breakdown:**

- **A** (incorrect): Temperature affects randomness in generation but is not the primary cause of tool call confusion. The issue is prompt design, not sampling parameters.
- **B** (correct): When system prompt instructions use phrasing that closely mirrors tool names, the model can interpret 'check the security' as a general instruction rather than a trigger for the check_security tool. Distinct naming reduces this ambiguity.
- **C** (incorrect): Tool calling works in any context. The issue is prompt design, not an environmental limitation.
- **D** (incorrect): System prompt length does not cause tool definitions to be skipped. The model processes tools and instructions together. The issue is keyword overlap creating ambiguity.

</details>

---

### Q187 (q-4-3-006) — single-choice

**Task statement:** 4.3 structured-output / tool-choice-forcing · **Difficulty:** application · scenario: s6

**Your data extraction pipeline uses tool_use with tool_choice set to 'auto'. You need guaranteed structured output for every request, but some documents occasionally produce conversational text responses instead. You have only one extraction tool defined. What is the most reliable fix?**

　 **A.** Add a system prompt instruction: 'You must always use the extraction tool and never produce text responses'

✅ **[CORRECT]** **B.** Set tool_choice to force the specific extraction tool by name

　 **C.** Add a post-processing step that retries any request returning text instead of a tool call

　 **D.** Switch to prompt-based JSON extraction with strict formatting instructions for more predictable output

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Setting tool_choice to {type: 'tool', name: 'extract_data'} forces the model to call that specific tool on every request, guaranteeing schema-compliant structured output with no possibility of text-only responses.

**Option breakdown:**

- **A** (incorrect): System prompt instructions cannot guarantee tool use when tool_choice is 'auto'. The API-level tool_choice parameter is the authoritative mechanism.
- **B** (correct): Setting tool_choice to {type: 'tool', name: 'extract_data'} forces the model to call that specific tool on every request, guaranteeing schema-compliant structured output with no possibility of text-only responses.
- **C** (incorrect): Retrying with the same 'auto' tool_choice may produce the same text response. Fixing tool_choice eliminates the problem at the API level rather than patching it after the fact.
- **D** (incorrect): Prompt-based JSON is less reliable than tool_use. It risks syntax errors and missing fields. Forcing the tool via tool_choice is the correct approach.

</details>

---

### Q188 (q-4-4-006) — single-choice

**Task statement:** 4.4 validation-retry / inter-step-validation · **Difficulty:** application · scenario: s6

**Your document processing pipeline chains three steps: (1) extract raw text, (2) classify document type, (3) extract structured fields based on type. Step 2 occasionally misclassifies invoices as purchase orders, causing step 3 to extract the wrong fields. The team proposes combining steps 2 and 3 into a single prompt to reduce errors. What is the better approach?**

　 **A.** Combine steps 2 and 3 exactly as proposed, on the grounds that fewer steps mean fewer points of failure.

✅ **[CORRECT]** **B.** Keep steps separate and validate the classification between steps 2 and 3 before extraction

　 **C.** Add more few-shot classification examples to step 2's prompt so misclassifications stop occurring

　 **D.** Run step 2 three times and use majority voting to determine the document type

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Keeping steps separate maintains focused prompts. Adding validation between steps catches misclassifications before they cascade into wrong-field extraction. This is the core principle of prompt chaining: focused steps with inter-step validation.

**Option breakdown:**

- **A** (incorrect): Combining steps creates a less focused prompt that must handle both classification and extraction simultaneously. This increases attention dilution and makes it harder to diagnose which part fails.
- **B** (correct): Keeping steps separate maintains focused prompts. Adding validation between steps catches misclassifications before they cascade into wrong-field extraction. This is the core principle of prompt chaining: focused steps with inter-step validation.
- **C** (incorrect): Better examples may help, but without validation between steps, misclassifications still cascade silently into step 3. Inter-step validation is the structural fix.
- **D** (incorrect): Majority voting adds cost and latency without addressing the root cause. Validation between steps is more efficient and catches the specific failure mode.

</details>

---

### Q189 (q-4-2-006) — single-choice

**Task statement:** 4.2 few-shot-prompting / construction · **Difficulty:** application · scenario: s5

**Your Claude Code agent generates API endpoint implementations. You provide detailed instructions specifying error handling conventions, but the generated code inconsistently handles async errors: sometimes using try/catch, sometimes using .catch(), and sometimes omitting error handling entirely. Adding more detailed instructions did not resolve the inconsistency. What is the most effective next step?**

　 **A.** Add a linting rule that flags and rejects generated code whose error handling deviates from the target style, catching nonconforming output after generation.

✅ **[CORRECT]** **B.** Add 2-4 few-shot examples demonstrating the correct error handling pattern across varied async scenarios, with reasoning for each choice.

　 **C.** Set temperature to 0 to eliminate the randomness causing inconsistent error handling styles

　 **D.** Add a post-generation review step that rewrites any incorrect error handling patterns

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When detailed instructions alone fail to produce consistent formatting, few-shot examples with reasoning are the correct escalation. Covering varied async scenarios prevents the model from pattern-matching only the specific cases shown and teaches it to generalise the error handling style.

**Option breakdown:**

- **A** (incorrect): Rejecting nonconforming output gates results after generation but never teaches the model to produce the consistent style itself, so novel cases keep failing. Few-shot examples with reasoning fix the inconsistency at source.
- **B** (correct): When detailed instructions alone fail to produce consistent formatting, few-shot examples with reasoning are the correct escalation. Covering varied async scenarios prevents the model from pattern-matching only the specific cases shown and teaches it to generalise the error handling style.
- **C** (incorrect): Temperature does not fix ambiguous criteria. If the instructions do not clearly demonstrate the preferred pattern, low temperature just makes the model consistently pick the same ambiguous interpretation, not necessarily the correct one.
- **D** (incorrect): Post-processing adds cost and complexity. It is more effective to teach the model the correct pattern upfront with few-shot examples than to fix incorrect output afterwards.

</details>

---

### Q190 (q-4-5-004) — single-choice

**Task statement:** 4.5 batch-processing / custom-id · **Difficulty:** application · scenario: s5

**Your CI/CD pipeline processes code reviews using the Message Batches API. After a batch completes, you need to match each review result back to the corresponding pull request. What is the correct mechanism for correlating batch results with their original requests?**

　 **A.** Parse the review content to identify which pull request it refers to based on file names mentioned in the review

　 **B.** Rely on the batch API returning results in the same order they were submitted

✅ **[CORRECT]** **C.** Use the custom_id field in each batch request to store the pull request identifier, then match results by custom_id

　 **D.** Submit each pull request as a separate batch of one item to maintain correlation through the batch ID

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The custom_id field exists specifically for correlating batch request/response pairs. Setting it to the pull request identifier provides reliable, direct correlation without relying on result ordering or content parsing.

**Option breakdown:**

- **A** (incorrect): Content parsing is fragile and error-prone. The Batches API provides a built-in mechanism for result correlation.
- **B** (incorrect): Batch results are not guaranteed to return in submission order. The custom_id field is the correct correlation mechanism.
- **C** (correct): The custom_id field exists specifically for correlating batch request/response pairs. Setting it to the pull request identifier provides reliable, direct correlation without relying on result ordering or content parsing.
- **D** (incorrect): Submitting individual batches defeats the purpose of batch processing and does not leverage the custom_id mechanism designed for exactly this use case.

</details>

---

### Q191 (q-4-6-004) — single-choice

**Task statement:** 4.6 multi-pass-review / multi-pass · **Difficulty:** application · scenario: s5

**Your CI/CD code review system analyses pull requests averaging 8-12 files. Reviews are thorough on the first few files but become increasingly superficial on later files, sometimes missing obvious issues. What architectural change best addresses this pattern?**

　 **A.** Randomise the file order before each review run so a different subset of files receives the thorough early-pass attention each time.

　 **B.** Increase the model's context window so that it has far more space in which to analyse all of the changed files at once.

✅ **[CORRECT]** **C.** Split the review into per-file passes so each file gets dedicated attention, then a cross-file integration pass.

　 **D.** Add a second full-PR review pass and merge the findings from both of those passes into a single combined report at the end.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Per-file analysis ensures each file receives consistent, thorough attention. The cross-file integration pass then catches issues that span multiple files, such as inconsistent interfaces or data flow problems. This directly solves attention dilution.

**Option breakdown:**

- **A** (incorrect): Randomising order means different files get superficial treatment each time, but does not ensure all files receive thorough review. The root cause — attention dilution — remains.
- **B** (incorrect): Attention dilution is not a context window size problem. The model has enough space but distributes attention unevenly across many files.
- **C** (correct): Per-file analysis ensures each file receives consistent, thorough attention. The cross-file integration pass then catches issues that span multiple files, such as inconsistent interfaces or data flow problems. This directly solves attention dilution.
- **D** (incorrect): A second pass on the full PR suffers from the same attention dilution. Both passes will likely be thorough on early files and superficial on later ones.

</details>

---

### Q192 (q-4-5-005) — single-choice

**Task statement:** 4.5 batch-processing / polling-for-completion · **Difficulty:** recall · scenario: s6

**A batch of 500 extraction requests has been submitted successfully. What must the client do before it can read any of the results?**

✅ **[CORRECT]** **A.** Poll the batch until its processing_status is "ended", then stream the results.

　 **B.** Read the results immediately, because the create call only returns once every request in the batch has finished.

　 **C.** Wait a fixed 24 hours, since that is the guaranteed completion time.

　 **D.** Subscribe to a webhook, which is the only supported completion signal.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Creating a batch is asynchronous. Retrieve the batch until processing_status is "ended", then stream the results and correlate them by custom_id.

**Option breakdown:**

- **A** (correct): The guide names polling for completion as an in-scope Batch API concept. Creating a batch returns immediately; you retrieve the batch until processing_status reads "ended", then read the results stream.
- **B** (incorrect): Batch creation is asynchronous and returns as soon as the batch is accepted. Reading results before the batch has ended gives you nothing to correlate.
- **C** (incorrect): Twenty-four hours is a maximum window, not a guaranteed completion time. Most batches finish well inside it, and one that overruns comes back expired rather than late.
- **D** (incorrect): Polling the batch is the documented way to detect completion. Treating any other mechanism as the only signal misreads the API.

</details>

---

### Q193 (q-4-1-005) — single-choice

**Task statement:** 4.1 system-prompts / keyword-overlap · **Difficulty:** scenario-analysis · scenario: s5

**A CI/CD system prompt defines two review categories with the instructions 'Check for security vulnerabilities in each function' and 'Check for performance issues in each loop'. The model frequently calls `performance_check` for security issues found inside loops, and `security_check` for performance issues in security-sensitive functions. What is the root cause and best fix?**

　 **A.** The model is confused because loops can have both security and performance issues; add a rule that security always takes priority over performance

✅ **[CORRECT]** **B.** Keyword overlap between the instruction phrasing and the tool names causes the confusion; rewrite them to use distinct, non-overlapping terms.

　 **C.** Add more detailed tool descriptions explaining exactly when each tool should be called

　 **D.** Force tool_choice to 'auto' and let the model determine the correct tool based on the content of each finding

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When instruction text like 'check for security in each function' overlaps with tool name patterns, the model conflates instruction keywords with tool selection cues. Using distinct terminology for instructions versus tool names eliminates this cross-contamination.

**Option breakdown:**

- **A** (incorrect): Priority rules add complexity without fixing the root cause. The model is confusing tools because the instruction keywords overlap with both tool names and each other.
- **B** (correct): When instruction text like 'check for security in each function' overlaps with tool name patterns, the model conflates instruction keywords with tool selection cues. Using distinct terminology for instructions versus tool names eliminates this cross-contamination.
- **C** (incorrect): More detailed descriptions help but do not fix the root cause if the instruction text still contains overlapping keywords that cue the wrong tool.
- **D** (incorrect): tool_choice 'auto' is likely already the setting. The problem is that the model's tool selection is being misled by keyword overlap in the prompt, not by the tool_choice configuration.

</details>

---

### Q194 (q-4-3-007) — single-choice

**Task statement:** 4.3 structured-output / nullable-fields · **Difficulty:** scenario-analysis · scenario: s6

**An extraction pipeline uses `tool_use` with a 15-required-field schema. For some document types, only 8 of those fields ever appear in the source material. The model consistently fabricates plausible values for the missing 7, and the instruction 'do not fabricate data' has not helped. Should the team (A) keep all fields required and add post-extraction validation, or (B) redesign the schema? Which is correct and why?**

　 **A.** Keep all fields required and add post-extraction validation to detect and remove fabricated values

✅ **[CORRECT]** **B.** Redesign the schema to make the 7 sometimes-absent fields optional/nullable, allowing the model to return null instead of fabricating

　 **C.** Create separate schemas for each document type, each containing only the fields present in that document type

　 **D.** Switch to prompt-based JSON extraction where you can instruct the model to omit absent fields entirely

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Making fields optional/nullable when source data may be absent removes the schema-level pressure to fabricate. The model can legitimately return null for missing information, which is a correct representation of reality. This addresses the root cause at the schema level.

**Option breakdown:**

- **A** (incorrect): Post-extraction validation cannot reliably distinguish fabricated values from correct ones — fabricated values are designed to look plausible. The schema itself forces fabrication by making all fields required.
- **B** (correct): Making fields optional/nullable when source data may be absent removes the schema-level pressure to fabricate. The model can legitimately return null for missing information, which is a correct representation of reality. This addresses the root cause at the schema level.
- **C** (incorrect): Multiple schemas add maintenance complexity and require document type classification before extraction. Making fields nullable in a single schema is simpler and equally effective.
- **D** (incorrect): Prompt-based JSON sacrifices schema compliance guarantees. tool_use with optional fields gives both flexibility for absent data and schema validation for present data.

</details>

---

### Q195 (q-4-6-007) — single-choice

**Task statement:** 4.6 multi-pass-review / attention-dilution · **Difficulty:** scenario-analysis · scenario: s6

**An extraction pipeline processes 50-page legal contracts in a single API call. It captures parties and dates from the first few pages but misses key financial terms in later pages, and occasionally contradicts itself across fields. A colleague suggests simply increasing the context window. What is the correct diagnosis and fix?**

　 **A.** The context window is too small; upgrading to a larger context model will fix the inconsistency

✅ **[CORRECT]** **B.** This is attention dilution; split into per-section extraction passes plus a cross-section reconciliation pass.

　 **C.** Run the full extraction three times and take the most common value for each field

　 **D.** Add more detailed instructions about the importance of financial terms to increase the model's focus on those sections

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Long documents cause attention dilution: the model attends thoroughly to early content but loses focus on later sections. Per-section passes ensure each part gets dedicated attention, and the integration pass catches contradictions and reconciles fields across sections.

**Option breakdown:**

- **A** (incorrect): If the document fits in the context window, a larger window does not improve attention quality. The problem is attention dilution over a long document, not context capacity.
- **B** (correct): Long documents cause attention dilution: the model attends thoroughly to early content but loses focus on later sections. Per-section passes ensure each part gets dedicated attention, and the integration pass catches contradictions and reconciles fields across sections.
- **C** (incorrect): Multiple passes on the full document suffer from the same attention dilution pattern. The model will repeatedly extract early-page data well and miss later-page data.
- **D** (incorrect): Instructions cannot override the attention dilution effect of processing a 50-page document in one pass. The structural fix is breaking the extraction into focused per-section passes.

</details>

---

### Q196 (q-4-5-006) — single-choice

**Task statement:** 4.5 batch-processing / no-multi-turn-tool-calling · **Difficulty:** application · scenario: s5

**A pipeline must extract data from 2,000 contracts. For each contract the model has to call an internal lookup_counterparty tool, read what it returns, and use that result to finish the extraction. The team wants the Batch API's 50% saving. What should they do?**

　 **A.** Submit the whole workflow to the Batch API, since batch requests support the same tool-calling loop that synchronous requests do.

　 **B.** Submit to the Batch API and poll each individual request until its pending tool call resolves.

　 **C.** Split each contract across two batches, feeding the first batch's output in as the second batch's tool result.

✅ **[CORRECT]** **D.** Run the tool-calling extraction synchronously, because a batch request cannot continue from a tool result.

<details><summary><b>Answer</b>: D</summary>

**Rationale:** The Batch API does not support multi-turn tool calling within a single request. A workflow that must execute a tool and continue from its result runs synchronously, even though that forfeits the 50% batch saving.

**Option breakdown:**

- **A** (incorrect): They do not. A batch request cannot execute a tool mid-request and continue from its result, so the extraction would never complete.
- **B** (incorrect): There is no pending-tool-call state to poll. The limitation is that the multi-turn loop does not run inside a batch request at all.
- **C** (incorrect): This is a plausible-sounding workaround, but it does not reconstruct a genuine tool-calling loop: the model cannot decide mid-request which lookup it needs. It also doubles the batch latency.
- **D** (correct): The guide names the no-multi-turn-tool-calling limit as an in-scope Batch API constraint. Where a workflow needs tool execution mid-processing, that step has to run on the synchronous API regardless of the cost saving on offer.

</details>

---

### Q197 (q-4-4-007) — single-choice

**Task statement:** 4.4 validation-retry / retry-with-error · **Difficulty:** application · scenario: s6

**Your extraction pipeline has a validation step that checks extracted financial data. When validation fails, the system retries by sending just the original document with the same prompt. Retry success rates are below 10%. The most common failure is the model placing the 'net amount' value in the 'gross amount' field and vice versa. How should the retry be restructured?**

　 **A.** Increase retries from 1 to 5, since more attempts at the same prompt will eventually produce the correct field mapping by chance

✅ **[CORRECT]** **B.** Send the original document, the failed extraction, and the specific validation error naming the swapped fields.

　 **C.** Add a post-processing rule that automatically swaps net and gross amounts when validation detects the pattern

　 **D.** Switch to a different model for the retry, since the original model has a persistent field-mapping bias

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Retry-with-error-feedback is dramatically more effective than naive retries. The model seeing its specific mistake (net and gross amounts swapped) and the validation error allows targeted self-correction rather than repeating the same misinterpretation.

**Option breakdown:**

- **A** (incorrect): If the model consistently maps fields incorrectly with the same prompt, more retries without feedback will produce the same incorrect mapping. The model needs to see its specific error.
- **B** (correct): Retry-with-error-feedback is dramatically more effective than naive retries. The model seeing its specific mistake (net and gross amounts swapped) and the validation error allows targeted self-correction rather than repeating the same misinterpretation.
- **C** (incorrect): Hard-coded swap rules are brittle and mask the underlying extraction error. They also fail if the issue manifests differently in other documents. Error feedback teaches the model to extract correctly.
- **D** (incorrect): The issue is the absence of error context in the retry, not a model-specific bias. Any model retrying without seeing the specific validation error will have a low success rate.

</details>

---

### Q198 (q-4-1-006) — single-choice

**Task statement:** 4.1 system-prompts / explicit-criteria · **Difficulty:** application · scenario: s10

**The moderation system's prompt instructs Claude to 'be conservative when moderating and err on the side of caution.' Reviewers find that innocuous posts about cooking with knives, news articles about violence, and fictional war stories are all being flagged as policy violations. What is the root cause and fix?**

　 **A.** The model is too sensitive, so lower the temperature until it stops over-flagging borderline posts in the moderation queue.

✅ **[CORRECT]** **B.** Replace 'be conservative' with explicit categorical criteria defining each violation category with concrete examples.

　 **C.** Add an allowlist of safe topics such as cooking, news and fiction that should never be flagged at all by the classifier.

　 **D.** Add a second moderation pass that re-reads each flagged post under the same 'be conservative' guidance and strips out the false positives before any action.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Vague directives like 'be conservative' give the model no basis for distinguishing between genuine violations and legitimate content that mentions sensitive topics. Explicit criteria with examples of both violations and non-violations (news, fiction, educational content) enable consistent, calibrated decisions.

**Option breakdown:**

- **A** (incorrect): Temperature affects randomness, not the interpretation of moderation criteria. The over-flagging is caused by vague instructions, not sampling behaviour.
- **B** (correct): Vague directives like 'be conservative' give the model no basis for distinguishing between genuine violations and legitimate content that mentions sensitive topics. Explicit criteria with examples of both violations and non-violations (news, fiction, educational content) enable consistent, calibrated decisions.
- **C** (incorrect): Allowlists are brittle and impossible to maintain comprehensively. New safe topics will constantly appear. The fix is better criteria that teach the model to distinguish context, not a growing list of exceptions.
- **D** (incorrect): A second pass using the same vague 'be conservative' criteria will reproduce the same false positives. Fix the criteria first; add verification layers second.

</details>

---

### Q199 (q-4-1-007) — single-choice

**Task statement:** 4.1 system-prompts / severity-examples · **Difficulty:** scenario-analysis · scenario: s10

**A moderation team introduces a severity scale ('low', 'medium', 'high', 'critical'). The same post (a user threatening to 'destroy' a competitor's product in a review) is classified as 'high' on some runs and 'low' on others. The prompt defines severities with phrases like 'high means the content is clearly harmful' and 'low means the content is mildly inappropriate'. What should they change?**

　 **A.** Set the temperature to 0 to eliminate classification variance from one run of the pipeline to the next.

✅ **[CORRECT]** **B.** Replace the prose severity descriptions with a concrete example per level as a calibration anchor.

　 **C.** Remove the severity scale and use binary classification (violation / not violation) to reduce inconsistency

　 **D.** Run the classification three times over and take the majority vote to settle the severity for each item.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Concrete examples anchor each severity level to specific, observable patterns. When the model sees 'destroy a competitor's product' in a review context, it can match against the 'low severity — figurative language' example rather than interpreting 'clearly harmful' differently each run.

**Option breakdown:**

- **A** (incorrect): Lower temperature reduces randomness but does not fix ambiguous criteria. The model is inconsistent because the severity definitions are vague, not because of sampling variance.
- **B** (correct): Concrete examples anchor each severity level to specific, observable patterns. When the model sees 'destroy a competitor's product' in a review context, it can match against the 'low severity — figurative language' example rather than interpreting 'clearly harmful' differently each run.
- **C** (incorrect): Binary classification loses valuable granularity needed for routing decisions (auto-remove vs escalate vs warn). The fix is better severity criteria, not removing severity entirely.
- **D** (incorrect): Majority voting averages out noise but triples cost and latency without fixing the root cause. With vague criteria, the model may consistently misclassify in the same direction, making voting ineffective.

</details>

---

### Q200 (q-4-2-003) — single-choice

**Task statement:** 4.2 few-shot-prompting / few-shot-coded-content · **Difficulty:** application · scenario: s10

**The moderation system classifies hate speech accurately for explicit slurs but misses coded language and dog-whistle terms that human moderators easily recognise. The prompt includes detailed written rules about coded language patterns. What intervention would most improve detection of coded hate speech?**

　 **A.** Add a comprehensive dictionary of every known coded term and dog-whistle to the system prompt so the classifier can match posts against the full list.

✅ **[CORRECT]** **B.** Add 2-4 few-shot examples of coded hate speech, with reasoning naming the coded language and the targeted group.

　 **C.** Add 20+ examples covering every known category of coded hate speech to maximise coverage

　 **D.** Increase the model's context window so it can consider more of the user's post history for context

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Few-shot examples with reasoning tags teach the model the pattern-recognition process, not just individual terms. Showing the reasoning chain — surface meaning, coded meaning, targeted group, contextual signals — enables the model to generalise to new coded terms it has not seen before.

**Option breakdown:**

- **A** (incorrect): A static dictionary becomes outdated immediately as coded language constantly evolves. It also bloats the prompt without teaching the model to recognise the underlying patterns of coded speech.
- **B** (correct): Few-shot examples with reasoning tags teach the model the pattern-recognition process, not just individual terms. Showing the reasoning chain — surface meaning, coded meaning, targeted group, contextual signals — enables the model to generalise to new coded terms it has not seen before.
- **C** (incorrect): Laundry lists of examples dilute attention and teach pattern-matching rather than generalisation. 2-4 targeted examples with reasoning are more effective than 20 examples without reasoning because they teach the analytical process.
- **D** (incorrect): Context window size is not the bottleneck. The model fails to recognise coded language in individual posts, which is a prompt engineering issue, not a context limitation.

</details>

---

### Q201 (q-4-2-004) — single-choice

**Task statement:** 4.2 few-shot-prompting / few-shot-ambiguity · **Difficulty:** recall · scenario: s10

**The moderation team is designing few-shot examples to teach Claude how to handle ambiguous content — posts that could be either satirical commentary or genuine policy violations depending on context. What is the recommended approach for structuring these few-shot examples?**

　 **A.** Provide examples of clear violations and clear non-violations only, avoiding ambiguous cases to prevent confusion

✅ **[CORRECT]** **B.** Include 2-4 ambiguous-case examples with reasoning tags on how context, tone, and intent separate satire from violations.

　 **C.** Provide 15-20 examples covering every possible type of satire to ensure comprehensive coverage

　 **D.** Provide examples showing only the correct classification label without reasoning, so the model focuses on the output format

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Few-shot examples should target the failure mode. Including ambiguous cases with explicit reasoning chains teaches the model to evaluate context, tone, and intent — the exact signals needed to distinguish satire from genuine violations.

**Option breakdown:**

- **A** (incorrect): Avoiding ambiguous cases in examples leaves the model without guidance for precisely the scenarios that cause the most classification errors. Ambiguous cases need explicit demonstration.
- **B** (correct): Few-shot examples should target the failure mode. Including ambiguous cases with explicit reasoning chains teaches the model to evaluate context, tone, and intent — the exact signals needed to distinguish satire from genuine violations.
- **C** (incorrect): Large numbers of examples dilute the model's attention and teach surface-level pattern matching. 2-4 well-reasoned examples that demonstrate the analytical process generalise better than an exhaustive list.
- **D** (incorrect): Examples without reasoning teach the model what to output but not how to decide. For ambiguous cases, the reasoning process is essential — the model needs to learn how to weigh context signals, not just memorise label mappings.

</details>

---

### Q202 (q-4-3-003) — single-choice

**Task statement:** 4.3 structured-output / nullable-fields · **Difficulty:** application · scenario: s10

**The moderation system uses tool_use with a JSON schema for classification output. All fields including 'sub_category' and 'target_demographic' are marked as required. Auditors discover that when a post is spam (which has no target demographic), the model fabricates plausible-sounding demographics like 'general public' or 'young adults.' What schema change prevents this fabrication?**

　 **A.** Add a validation step that rejects any target_demographic value returned for a post that has been classified as spam, before the record is written.

✅ **[CORRECT]** **B.** Make 'target_demographic' nullable so the model can return null when the field does not apply instead of fabricating a value.

　 **C.** Remove 'target_demographic' from the schema entirely, on the grounds that its presence is what causes the fabrication in the first place.

　 **D.** Add a prompt instruction telling the model to leave 'target_demographic' empty whenever a post is spam and the field does not apply.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Required fields pressure the model to produce a value even when none exists. Making the field nullable gives the model a legitimate way to indicate 'not applicable,' eliminating the incentive to fabricate. This is the standard pattern for fields that apply conditionally.

**Option breakdown:**

- **A** (incorrect): Post-hoc validation catches the problem but does not prevent it. The model still fabricates values; they are just rejected after the fact. Schema design should prevent fabrication at the source.
- **B** (correct): Required fields pressure the model to produce a value even when none exists. Making the field nullable gives the model a legitimate way to indicate 'not applicable,' eliminating the incentive to fabricate. This is the standard pattern for fields that apply conditionally.
- **C** (incorrect): Removing the field loses valuable data for categories where target demographic is genuinely relevant (hate speech, harassment). The fix is making it nullable, not removing it.
- **D** (incorrect): Prompt instructions cannot override a schema that marks the field as required. The JSON schema enforces the constraint at the API level, and the model must comply with the schema regardless of prompt instructions.

</details>

---

### Q203 (q-4-3-004) — single-choice

**Task statement:** 4.3 structured-output / enum-fields · **Difficulty:** scenario-analysis · scenario: s10

**The moderation system's classification schema has a 'category' field defined as a free-text string. Auditors find 47 different category values in production data, including 'hate speech', 'Hate Speech', 'hate-speech', 'hateful content', and 'hate_speech' — all intended to be the same category. This makes downstream analytics and routing unreliable. What is the best schema fix?**

　 **A.** Add a post-processing normalisation step that maps all variations to canonical category names

✅ **[CORRECT]** **B.** Change 'category' from free-text to an enum with values like 'hate_speech', 'spam', and 'harassment', plus an 'other' option.

　 **C.** Add detailed instructions to the prompt listing the exact category names and their capitalisation so the model always emits the canonical string.

　 **D.** Add few-shot examples showing the correct category formatting for each type

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Enum fields constrain the model to predefined values, eliminating spelling and formatting variations. Including 'other' as an enum value handles edge cases without allowing free-text drift. With strict: true, the schema guarantees only valid enum values are returned.

**Option breakdown:**

- **A** (incorrect): Post-processing normalisation adds complexity and requires constant maintenance as new variations appear. The schema should prevent the problem at the source rather than patching it downstream.
- **B** (correct): Enum fields constrain the model to predefined values, eliminating spelling and formatting variations. Including 'other' as an enum value handles edge cases without allowing free-text drift. With strict: true, the schema guarantees only valid enum values are returned.
- **C** (incorrect): Prompt instructions are probabilistic. The model may still produce variations despite instructions. Schema-level enforcement via enums is deterministic and cannot be overridden.
- **D** (incorrect): Few-shot examples improve consistency but cannot guarantee exact string matching. Schema enums are the correct mechanism for constraining categorical output to a fixed set of values.

</details>

---

### Q204 (q-4-4-003) — single-choice

**Task statement:** 4.4 validation-retry / retry-boundary · **Difficulty:** application · scenario: s10

**The moderation system validates that every classification includes a 'reasoning' field explaining the decision. When validation fails (empty reasoning), the system retries. For most posts, the retry succeeds after feeding back the error 'reasoning field was empty — provide a brief justification for the classification.' However, for posts in unfamiliar languages, retries consistently fail. What should the system do?**

　 **A.** Increase the retry count from 1 to 5 for unfamiliar language posts since the model may succeed with more attempts

✅ **[CORRECT]** **B.** Retry format errors on analysable posts; route capability gaps like unfamiliar languages to human review.

　 **C.** Add the unfamiliar language to the system prompt as a supported language to encourage the model to try harder

　 **D.** Remove the reasoning validation requirement for posts in unfamiliar languages

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The retry boundary distinguishes between fixable format issues and unfixable capability gaps. Empty reasoning on analysable posts is a format error that retries with error feedback can fix. Unfamiliar languages represent absent capability — no amount of retrying will create language understanding. Route these to human review.

**Option breakdown:**

- **A** (incorrect): More retries are ineffective when the model lacks the capability to analyse content in that language. The failure is not a transient format issue — the model genuinely cannot provide reasoning for content it cannot understand.
- **B** (correct): The retry boundary distinguishes between fixable format issues and unfixable capability gaps. Empty reasoning on analysable posts is a format error that retries with error feedback can fix. Unfamiliar languages represent absent capability — no amount of retrying will create language understanding. Route these to human review.
- **C** (incorrect): Listing an unsupported language in the prompt does not give the model language understanding. This may actually worsen the problem by encouraging fabricated analysis of content the model cannot read.
- **D** (incorrect): Removing the validation requirement means these posts would receive classifications without any justification, which undermines auditability. The correct approach is human review, not lower standards.

</details>

---

### Q205 (q-4-4-004) — single-choice

**Task statement:** 4.4 validation-retry / detected-patterns · **Difficulty:** application · scenario: s10

**A moderation classification tool includes a `detected_patterns` array where the model lists specific patterns it identified (e.g. 'repeated slur targeting ethnicity'). Validation checks whether the detected patterns match the assigned category, and on mismatch retries with feedback like 'You classified this as spam but detected patterns of hate speech targeting ethnicity, please re-evaluate.' What is the primary benefit of the `detected_patterns` field in this workflow?**

　 **A.** It lets the system auto-correct the category by overriding the model's classification with a rule-based pattern match

　 **B.** It provides an auditable evidence trail showing which specific content features drove each moderation decision

✅ **[CORRECT]** **C.** It lets validation detect reasoning inconsistencies and feed back targeted errors the model uses to self-correct.

　 **D.** It increases classification accuracy by forcing the model to identify specific patterns before assigning a category

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The detected_patterns field externalises the model's reasoning into structured data that can be programmatically validated against the conclusion. When patterns and category are inconsistent, the specific error feedback ('you detected hate speech patterns but classified as spam') gives the model actionable information to self-correct. This is the core benefit in a retry-with-error-feedback workflow.

**Option breakdown:**

- **A** (incorrect): The system does not override the model's classification. It feeds back the inconsistency and asks the model to re-evaluate. The model may correct its category or its patterns — the point is self-correction, not rule-based override.
- **B** (incorrect): Auditability is a secondary benefit. The primary benefit in this validation/retry workflow is enabling the system to detect and feed back reasoning inconsistencies for self-correction.
- **C** (correct): The detected_patterns field externalises the model's reasoning into structured data that can be programmatically validated against the conclusion. When patterns and category are inconsistent, the specific error feedback ('you detected hate speech patterns but classified as spam') gives the model actionable information to self-correct. This is the core benefit in a retry-with-error-feedback workflow.
- **D** (incorrect): While structured reasoning fields can improve accuracy, this framing misses the retry workflow context. The primary benefit is enabling programmatic validation of reasoning consistency and targeted feedback for self-correction.

</details>

---

### Q206 (q-4-6-005) — single-choice

**Task statement:** 4.6 multi-pass-review / self-review-bias · **Difficulty:** scenario-analysis · scenario: s10

**The moderation team asks a single Claude session to classify a post, then immediately asks the same session to independently review its own classification for quality assurance. The 'review' agrees with the original classification 98% of the time, including cases that human auditors later identify as errors. Why is this self-review ineffective?**

　 **A.** The model needs a stronger review prompt with explicit instructions to look for errors in the original classification

✅ **[CORRECT]** **B.** The same session retains the model's reasoning, so it stays anchored to its classification; use a fresh independent instance to review.

　 **C.** The model's temperature is too low, producing deterministic agreement — increase temperature for the review pass

　 **D.** Self-review is effective but the 98% agreement rate simply reflects high initial accuracy — the 2% disagreement is the expected error rate

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Self-review within the same session is fundamentally limited because the model's conversation context includes the original reasoning. It will naturally be anchored to its prior conclusions. An independent instance with no access to the original decision evaluates the content fresh, providing genuine quality assurance.

**Option breakdown:**

- **A** (incorrect): Stronger instructions do not overcome the fundamental limitation. The same session retains the reasoning context from the original classification, biasing the review toward agreement.
- **B** (correct): Self-review within the same session is fundamentally limited because the model's conversation context includes the original reasoning. It will naturally be anchored to its prior conclusions. An independent instance with no access to the original decision evaluates the content fresh, providing genuine quality assurance.
- **C** (incorrect): Temperature affects sampling randomness, not reasoning independence. Higher temperature may occasionally produce different outputs but does not create genuine independent review. The model is still anchored to its own prior reasoning in the same session.
- **D** (incorrect): Human auditors found errors in cases where the self-review agreed, proving the 98% agreement does not reflect accuracy. The self-review is confirming errors, not catching them, due to same-session reasoning bias.

</details>

---

### Q207 (q-4-6-006) — single-choice

**Task statement:** 4.6 multi-pass-review / multi-pass · **Difficulty:** recall · scenario: s10

**The moderation system processes batches of reported posts. Each post needs individual classification, but the team also wants to detect coordinated campaigns (many accounts posting similar violating content). What multi-instance architecture achieves both goals?**

　 **A.** Process all posts in a single large prompt so the model can see patterns across posts and detect campaigns

✅ **[CORRECT]** **B.** Run per-post local classification passes, then a separate cross-post pass to detect coordinated campaigns.

　 **C.** Process the posts in small batches of 5, which balances individual accuracy against campaign-level detection.

　 **D.** Use two separate systems: one for individual classification and one for campaign detection, with no shared data

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Multi-pass architecture solves both needs. Per-post passes ensure consistent depth for each individual classification. The cross-post integration pass operates on the structured classification results to detect coordination patterns — similar content, timing, account relationships — without degrading individual classification quality.

**Option breakdown:**

- **A** (incorrect): A single large prompt causes attention dilution. Per-post classification quality degrades for posts later in the sequence, and the model may miss individual violations while looking for cross-post patterns.
- **B** (correct): Multi-pass architecture solves both needs. Per-post passes ensure consistent depth for each individual classification. The cross-post integration pass operates on the structured classification results to detect coordination patterns — similar content, timing, account relationships — without degrading individual classification quality.
- **C** (incorrect): Small batches are a compromise that does neither task well. Batch processing still risks attention dilution for individual classification and limits campaign detection to only 5 posts at a time, missing broader coordination patterns.
- **D** (incorrect): Separate systems with no shared data means the campaign detection system cannot leverage the individual classifications. The multi-pass approach shares classification results from the local passes into the integration pass, which is essential for detecting coordination.

</details>

---

### Q208 (q-4-2-007) — multiple-response (select 2)

**Task statement:** 4.2 few-shot-prompting / few-shot-ambiguity · **Difficulty:** application · scenario: s6

_Select 2 options._

**An invoice-extraction pipeline mislabels fields on documents where the correct interpretation is ambiguous. Which few-shot practices should you apply? (Select 2)**

　 **A.** Add an example for every document variant seen in production so far.

✅ **[CORRECT]** **B.** Use examples showing correct extraction from varied document structures to fix empty or null extraction of required fields.

　 **C.** Replace the examples with a longer natural-language description of each field.

✅ **[CORRECT]** **D.** Create two to four targeted examples for the ambiguous cases, showing why one interpretation is chosen.

<details><summary><b>Answer</b>: B, D</summary>

**Rationale:** For ambiguous extraction cases, a small set of targeted few-shot examples that demonstrate the reasoning, plus examples across varied document structures, beats more prose or exhaustive variant coverage.

**Option breakdown:**

- **A** (incorrect): Volume is not the fix; a handful of targeted examples for the ambiguity beats exhaustive coverage and its context cost.
- **B** (correct): Varied-structure examples fix empty or null extraction of fields that are present, which is the few-shot remedy for unreliable extraction; fabrication of absent data is handled by nullable schema fields instead.
- **C** (incorrect): Descriptions alone are what produced the inconsistency; examples communicate the expected mapping more reliably than more prose.
- **D** (correct): Targeted examples that demonstrate the reasoning are the guide's specific remedy for ambiguous cases.

</details>

---

### Q209 (q-4-4-008) — multiple-response (select 2)

**Task statement:** 4.4 validation-retry / retry-boundary · **Difficulty:** scenario-analysis · scenario: s6

_Select 2 options._

**A validation-retry loop still fails on the same documents after three attempts each. In which situations will further retries not help? (Select 2)**

　 **A.** The model placed a correct value in the wrong field on the last attempt.

✅ **[CORRECT]** **B.** The required information is simply absent from the source document.

　 **C.** The validation service timed out on the last attempt.

✅ **[CORRECT]** **D.** The information exists only in an external document that is not provided in context.

<details><summary><b>Answer</b>: B, D</summary>

**Rationale:** Retries help when the failure is transient or correctable from feedback; they are ineffective when the required information is absent or outside the provided context.

**Option breakdown:**

- **A** (incorrect): A value in the wrong field is a semantic validation error; retry-with-error-feedback naming the misplaced field guides the next attempt to correct it.
- **B** (correct): No amount of retrying makes missing information appear; the guide marks absent data as the boundary of retry effectiveness.
- **C** (incorrect): A timeout is a transient failure, which is precisely the class of error a retry is likely to resolve.
- **D** (correct): Retries cannot reach data outside the model's context; the fix is supplying the external document, not another attempt.

</details>

---

### Q210 (q-4-4-009) — single-choice

**Task statement:** 4.4 validation-retry / pydantic-validation · **Difficulty:** application · scenario: s6

**Your extraction pipeline uses tool_use with a JSON schema, so outputs always parse. Finance still reports invoices where line items do not sum to the stated total, and where the due date precedes the invoice date. The team wants retries to receive precise, per-field error messages. What should you add?**

　 **A.** Tighter JSON schema constraints: numeric minimum and maximum bounds on every amount field and format checks on every date field

　 **B.** An instruction telling the model to double-check its own extraction in the same request before responding

✅ **[CORRECT]** **C.** A Pydantic model whose validators encode the sum and date-order rules, feeding its validation errors into retries

　 **D.** A more capable model, since semantic errors indicate the current one is under-powered

<details><summary><b>Answer</b>: C</summary>

**Rationale:** The schema already eliminated syntax errors; what remains is semantic validation. Cross-field rules (sums must match, dates must be ordered) cannot be expressed in a JSON schema, so they live in validation code. A Pydantic model with custom validators encodes them and raises specific, per-field error messages that feed the retry-with-error-feedback loop.

**Option breakdown:**

- **A** (incorrect): Range and format constraints check fields in isolation; both reported failures are relationships between fields, which a JSON schema cannot express.
- **B** (incorrect): Same-session self-review retains the generation context and its bias, and produces no machine-readable error for the retry loop to feed back.
- **C** (correct): Cross-field semantic rules live in validation code; Pydantic validators express them and raise per-field errors the retry request can quote verbatim.
- **D** (incorrect): No model tier guarantees semantic correctness; the fix is validation logic around the model, and an upgrade is the maximum-cost non-answer.

</details>

---

### Q211 (q-4-4-010) — single-choice

**Task statement:** 4.4 validation-retry / pydantic-validation · **Difficulty:** application · scenario: s6

**The pipeline validates each tool_use extraction against a Pydantic model with model_validate(). Validation succeeds and every field has the correct type, yet extracted totals still disagree with the documents' stated totals. What explains this, and what is the fix?**

　 **A.** model_validate() is failing silently; pin an older Pydantic version until the regression is fixed

✅ **[CORRECT]** **B.** Type checks passed but no rule relates the totals; add a model validator for the sum rule and route its errors into retries

　 **C.** The schema needs numeric minimum and maximum constraints on the stated_total field so that mismatched totals are rejected at parse time

　 **D.** Semantic disagreement indicates hallucination; lower the temperature so extraction becomes deterministic

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Schema-level validation (types, required fields) is exactly what model_validate() enforces, and it passed. The failing rule is semantic: two fields must agree. That rule has to be written as a Pydantic validator (or equivalent validation code), and its specific error message is what the retry-with-error-feedback loop sends back with the document and the failed extraction.

**Option breakdown:**

- **A** (incorrect): model_validate() did its job: the extraction conforms to the model's types. Nothing failed silently; the missing check was never defined.
- **B** (correct): Schema conformance and semantic correctness are different layers; the sum relationship must be written as a validator, whose errors drive the retry loop.
- **C** (incorrect): A per-field range cannot express a relationship between two fields; the mismatch is only detectable by comparing them in validation code.
- **D** (incorrect): Sampling settings do not create correctness, and determinism would only repeat the same wrong extraction; this failure class belongs to semantic validation.

</details>

---


## Domain 5 — Context Management & Reliability (15%)

_46 questions_

### Q212 (q-5-1-001) — single-choice

**Task statement:** 5.1 context-window-management / facts-block · **Difficulty:** application · scenario: s1

**A customer support agent handles a multi-issue session. After several turns, the agent refers to 'your recent refund request' instead of the specific $247.83 refund for order #8891. The conversation history is being summarised between turns to manage context length. What is the most effective fix?**

　 **A.** Increase the context window size so that summarisation can be avoided entirely for the whole session.

✅ **[CORRECT]** **B.** Extract transactional facts into a persistent case facts block outside the summarised history.

　 **C.** Instruct the model to preserve every amount, date, and order number verbatim whenever it summarises earlier turns.

　 **D.** Store the full conversation in an external database and retrieve only the relevant turns on demand.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** This directly addresses the progressive summarisation trap by ensuring critical numerical and transactional data is never condensed.

**Option breakdown:**

- **A** (incorrect): This postpones the problem but does not solve it — eventually the context will fill, and summarisation will still destroy specifics.
- **B** (correct): This directly addresses the progressive summarisation trap by ensuring critical numerical and transactional data is never condensed.
- **C** (incorrect): Prompt-based instructions for summarisation are unreliable — the model will still compress details probabilistically.
- **D** (incorrect): This adds infrastructure complexity without addressing the core issue of which facts must persist in every prompt.

</details>

---

### Q213 (q-5-2-001) — single-choice

**Task statement:** 5.2 escalation-ambiguity / explicit-escalation · **Difficulty:** scenario-analysis · scenario: s1

**A customer support agent achieves only 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward damage replacement cases while attempting to autonomously handle complex policy exception requests. What is the most effective improvement?**

　 **A.** Implement sentiment analysis to detect customer frustration and automatically escalate when negative sentiment exceeds a threshold

　 **B.** Have the agent self-report a confidence score (1-10) and automatically route to humans when confidence falls below a threshold

✅ **[CORRECT]** **C.** Add explicit escalation criteria to the system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously

　 **D.** Deploy a separate classifier model trained on historical tickets to predict which requests need escalation

<details><summary><b>Answer</b>: C</summary>

**Rationale:** This directly addresses unclear decision boundaries with concrete examples. It is the proportionate first response before adding infrastructure.

**Option breakdown:**

- **A** (incorrect): Sentiment does not correlate with case complexity. This would escalate frustrated but straightforward cases and miss calm but complex ones.
- **B** (incorrect): LLM self-reported confidence is poorly calibrated — the agent is already incorrectly confident on hard cases and uncertain on easy ones.
- **C** (correct): This directly addresses unclear decision boundaries with concrete examples. It is the proportionate first response before adding infrastructure.
- **D** (incorrect): This is over-engineered, requiring labelled data and ML infrastructure when prompt optimisation has not been tried first.

</details>

---

### Q214 (q-5-3-001) — single-choice

**Task statement:** 5.3 error-propagation / structured-error-context · **Difficulty:** application · scenario: s2

**A web search subagent in a multi-agent research system times out while researching a complex topic. You need to design how this failure information flows back to the coordinator. Which approach best enables intelligent recovery?**

✅ **[CORRECT]** **A.** Return structured error context including failure type, attempted query, partial results, and potential alternative approaches

　 **B.** Implement automatic retry with exponential backoff, returning a generic 'search unavailable' status only after all retries are exhausted

　 **C.** Catch the timeout and return an empty result set marked as successful, so the rest of the workflow carries on regardless of the failure.

　 **D.** Propagate the timeout exception to a top-level handler that terminates the entire research workflow at once, discarding everything.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** This gives the coordinator everything it needs to decide: retry with modified query, try an alternative approach, or proceed with partial results.

**Option breakdown:**

- **A** (correct): This gives the coordinator everything it needs to decide: retry with modified query, try an alternative approach, or proceed with partial results.
- **B** (incorrect): The generic status hides valuable context from the coordinator, preventing informed recovery decisions.
- **C** (incorrect): Silent suppression prevents any recovery. The coordinator believes the search succeeded and found nothing, so it will not attempt alternatives.
- **D** (incorrect): Workflow termination wastes partial results from other subagents that may have completed successfully.

</details>

---

### Q215 (q-5-4-001) — single-choice

**Task statement:** 5.4 codebase-exploration / scratchpad · **Difficulty:** application · scenario: s3

**A Claude Code agent is exploring an unfamiliar codebase. After investigating several modules, it starts referencing 'typical repository patterns' instead of the specific class names and dependency chains it discovered earlier. What is the most effective mitigation?**

　 **A.** Increase the model's context window to accommodate more discovery output

✅ **[CORRECT]** **B.** Have the agent maintain scratchpad files recording key findings and reference them for subsequent questions

　 **C.** Restart the session and ask the agent to explore more efficiently

　 **D.** Pre-load the entire codebase structure into the initial context before exploration begins

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Scratchpad files persist knowledge across context boundaries, directly counteracting context degradation by keeping critical discoveries accessible.

**Option breakdown:**

- **A** (incorrect): Context degradation is not about running out of tokens — it is about the model losing grip on earlier findings as verbose output accumulates.
- **B** (correct): Scratchpad files persist knowledge across context boundaries, directly counteracting context degradation by keeping critical discoveries accessible.
- **C** (incorrect): Restarting loses all accumulated knowledge without addressing the underlying context degradation problem.
- **D** (incorrect): This would consume context budget before exploration even starts and does not address degradation during the session.

</details>

---

### Q216 (q-5-5-001) — single-choice

**Task statement:** 5.5 human-review-calibration / aggregate-metrics-trap · **Difficulty:** scenario-analysis · scenario: s6

**A structured data extraction system achieves 97% overall accuracy across all document types. The team proposes automating all extractions where model confidence exceeds 95% to reduce human review costs. What is the critical risk in this approach?**

　 **A.** The 95% confidence threshold is too low and should be raised to 99% for automation

✅ **[CORRECT]** **B.** Aggregate accuracy can mask poor per-type performance, and confidence scores need calibration before use.

　 **C.** The model will become overconfident over time as it processes more documents, requiring regular retraining

　 **D.** Automated extractions should always have human review regardless of confidence, making the proposal fundamentally flawed

<details><summary><b>Answer</b>: B</summary>

**Rationale:** 97% overall can hide 40% error rates on specific document types. Without stratified validation and confidence calibration, automation will silently fail on certain inputs.

**Option breakdown:**

- **A** (incorrect): The threshold value is not the core issue — the problem is that aggregate metrics hide per-type performance disparities.
- **B** (correct): 97% overall can hide 40% error rates on specific document types. Without stratified validation and confidence calibration, automation will silently fail on certain inputs.
- **C** (incorrect): LLMs do not train during inference. The issue is existing calibration gaps, not drift.
- **D** (incorrect): Automation is valid when properly validated — the issue is doing it based on uncalibrated aggregate metrics, not the concept of automation itself.

</details>

---

### Q217 (q-5-6-001) — single-choice

**Task statement:** 5.6 information-provenance / conflict-handling · **Difficulty:** application · scenario: s2

**A multi-agent research system produces a synthesis report on market trends. Two credible sources report different growth rates for the same sector: Source A reports 12% growth (2023 data) and Source B reports 8% growth (2024 data). The synthesis agent currently selects the more recent value. What is the correct approach?**

　 **A.** Always use the most recent of the two sources, on the grounds that it reflects the latest data.

　 **B.** Average the two values and report 10% growth, with a note recording the variance between sources.

✅ **[CORRECT]** **C.** Annotate both values with source and publication dates, letting the consumer interpret them.

　 **D.** Flag the conflict and escalate to a human researcher for resolution before including in the report

<details><summary><b>Answer</b>: C</summary>

**Rationale:** This preserves provenance, temporal context, and both data points. The consumer can see that different dates explain different numbers.

**Option breakdown:**

- **A** (incorrect): This silently discards valid historical context. The difference may reflect an actual trend, not a contradiction.
- **B** (incorrect): Averaging conflicting statistics is mathematically misleading and destroys the temporal context that explains the difference.
- **C** (correct): This preserves provenance, temporal context, and both data points. The consumer can see that different dates explain different numbers.
- **D** (incorrect): This is unnecessary — the values are not contradictory, they reflect different time periods. Proper annotation resolves the ambiguity.

</details>

---

### Q218 (q-5-3-002) — single-choice

**Task statement:** 5.3 error-propagation / access-vs-empty · **Difficulty:** application · scenario: s2

**A research subagent queries an academic journal database for articles on renewable energy policy. The database responds successfully but returns zero matching articles. Meanwhile, a second subagent querying a government statistics API receives a connection timeout. The coordinator currently handles both cases identically by retrying three times. What should change?**

　 **A.** Increase the retry count to five for both cases to give transient failures more time to resolve

　 **B.** Add exponential backoff to all retries so the subagents wait progressively longer between attempts

　 **C.** Remove retries entirely and immediately escalate both failures to a human operator for investigation

✅ **[CORRECT]** **D.** Distinguish access failures from valid empty results: retry the API timeout as a transient failure, but accept the zero-match journal response as a valid finding and annotate the coverage gap

<details><summary><b>Answer</b>: D</summary>

**Rationale:** Access failures (timeouts, connection errors) indicate the tool could not reach the data source and warrant retry. Valid empty results mean the tool reached the source and found no matches — this IS the answer. Conflating these leads to unnecessary retries on valid results and missed coverage annotations.

**Option breakdown:**

- **A** (incorrect): More retries do not fix the core problem. The journal database returned a valid empty result — it successfully searched and found nothing. Retrying it wastes time and API calls on an operation that already completed correctly.
- **B** (incorrect): Backoff improves retry behaviour for transient failures but does not address the fundamental issue: the journal query does not need retries at all. It returned a valid response indicating no matches exist.
- **C** (incorrect): This is disproportionate. The API timeout is a transient failure that retries can resolve. The empty journal result is not a failure at all — it is a valid answer. Neither case requires human escalation.
- **D** (correct): Access failures (timeouts, connection errors) indicate the tool could not reach the data source and warrant retry. Valid empty results mean the tool reached the source and found no matches — this IS the answer. Conflating these leads to unnecessary retries on valid results and missed coverage annotations.

</details>

---

### Q219 (q-5-5-002) — single-choice

**Task statement:** 5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6

**A legal document extraction pipeline has been running for three months with calibrated confidence thresholds. Extractions above 90% confidence are auto-approved without human review, saving 60% of reviewer time. A new client submits contracts written in an unusual two-column legal format the system has not encountered before. The system reports 92% confidence on these extractions. What is the appropriate safeguard?**

✅ **[CORRECT]** **A.** Maintain stratified random sampling of high-confidence extractions across document types to catch the new format's error rate.

　 **B.** Trust the calibrated confidence threshold since it was validated against labelled data and the system reports 92% confidence, which exceeds the 90% auto-approval threshold

　 **C.** Raise the confidence threshold from 90% to 98% for all document types to account for novel formats

　 **D.** Add a document format classifier that flags unknown formats for mandatory human review before any auto-approval

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Stratified random sampling is designed precisely for this scenario: detecting novel error patterns in high-confidence extractions that slip past threshold-based routing. By sampling across document types, the new format's errors would surface during routine verification even though the confidence scores appear acceptable.

**Option breakdown:**

- **A** (correct): Stratified random sampling is designed precisely for this scenario: detecting novel error patterns in high-confidence extractions that slip past threshold-based routing. By sampling across document types, the new format's errors would surface during routine verification even though the confidence scores appear acceptable.
- **B** (incorrect): Confidence calibration is only valid for document types represented in the calibration data. A novel format the system has never encountered can produce miscalibrated confidence scores — the model may be systematically overconfident because it does not recognise its own unfamiliarity with the format.
- **C** (incorrect): Raising the threshold globally penalises well-understood document types that are genuinely accurate at 90%+. This wastes reviewer capacity on documents that do not need review, while still not guaranteeing detection of format-specific issues.
- **D** (incorrect): While not wrong in principle, this adds ML infrastructure complexity that stratified sampling already handles. A format classifier requires training data and maintenance, whereas ongoing stratified sampling detects novel error patterns without additional models.

</details>

---

### Q220 (q-5-6-002) — single-choice

**Task statement:** 5.6 information-provenance / claim-source-mapping · **Difficulty:** scenario-analysis · scenario: s2

**A multi-agent research system has three subagents (financial filings, news, technical white papers) and a synthesis agent. Each subagent returns properly attributed findings, but the final synthesised report has no source attribution: stakeholders cannot trace which claim came from which source. Which fix addresses the root cause?**

　 **A.** Append a bibliography section at the end of the report listing all sources each subagent consulted

　 **B.** Have each subagent include source URLs as inline hyperlinks in their prose output so the synthesis agent can preserve them

✅ **[CORRECT]** **C.** Require subagents to output structured claim-source mappings and instruct the synthesis agent to preserve and merge them.

　 **D.** Store all subagent outputs in a database and have the synthesis agent reference database entries by ID instead of incorporating content directly

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Structured claim-source mappings survive synthesis because they are data structures, not prose that gets rewritten. The synthesis agent can merge mappings from multiple subagents while preserving the link between each claim and its source. This also enables content-appropriate rendering: financial data as tables, news as prose, technical findings as lists — each with attribution intact.

**Option breakdown:**

- **A** (incorrect): A bibliography lists sources but does not map specific claims to specific sources. Stakeholders need to know which claim came from which document, not just which documents were consulted overall. This is document-level attribution, not claim-level provenance.
- **B** (incorrect): Inline hyperlinks in prose are fragile — the synthesis agent will rewrite, merge, and compress prose during summarisation, stripping or disconnecting links from their associated claims. Attribution must be in structured data, not embedded in prose that gets rewritten.
- **C** (correct): Structured claim-source mappings survive synthesis because they are data structures, not prose that gets rewritten. The synthesis agent can merge mappings from multiple subagents while preserving the link between each claim and its source. This also enables content-appropriate rendering: financial data as tables, news as prose, technical findings as lists — each with attribution intact.
- **D** (incorrect): This adds infrastructure complexity without solving the synthesis problem. The synthesis agent still needs to merge and present findings coherently. Database references do not prevent attribution loss during the summarisation and rewriting that synthesis inherently requires.

</details>

---

### Q221 (q-5-1-002) — single-choice

**Task statement:** 5.1 context-window-management / progressive-summarisation · **Difficulty:** recall · scenario: s1

**What is the 'progressive summarisation trap' in the context of managing long conversations with Claude?**

　 **A.** The model progressively ignores older messages in the conversation, regardless of summarisation

✅ **[CORRECT]** **B.** Each round of summarisation compresses specific details (amounts, dates, identifiers) into generic references, permanently destroying critical information

　 **C.** The model produces increasingly shorter summaries over time, eventually reducing context to a single sentence

　 **D.** Summarisation causes the model to hallucinate facts that were not in the original conversation

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Progressive summarisation destroys specifics because each compression round replaces concrete values like '$247.83 for order #8891' with generic phrases like 'recent refund'. This information loss is cumulative and irreversible.

**Option breakdown:**

- **A** (incorrect): This describes general attention degradation, not the specific summarisation trap. The trap is about what happens when summarisation is actively applied, not passive attention loss.
- **B** (correct): Progressive summarisation destroys specifics because each compression round replaces concrete values like '$247.83 for order #8891' with generic phrases like 'recent refund'. This information loss is cumulative and irreversible.
- **C** (incorrect): The trap is not about summary length decreasing. Summaries may stay a consistent length while still losing critical specific details in favour of generic language.
- **D** (incorrect): While hallucination can occur, the progressive summarisation trap specifically refers to the loss of real specifics, not the introduction of false ones.

</details>

---

### Q222 (q-5-4-010) — single-choice

**Task statement:** 5.4 codebase-exploration / scratchpad · **Difficulty:** recall · scenario: s2

**What is the primary purpose of scratchpad files in the context of long-running Claude Code agent sessions?**

　 **A.** They serve as temporary storage for code changes before committing to version control

✅ **[CORRECT]** **B.** They persist key findings and discoveries across context boundaries so the agent can reference them when earlier conversation content degrades

　 **C.** They allow multiple agents to share state by reading and writing to a common file

　 **D.** They provide a log of all tool calls made during a session for debugging purposes

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Scratchpad files solve context degradation by externalising critical knowledge to the filesystem. When the agent's context window fills and earlier findings become unreliable, the scratchpad provides a persistent, accurate reference.

**Option breakdown:**

- **A** (incorrect): Scratchpad files in the agent context are not about version control staging. They address the problem of context window limitations during extended exploration.
- **B** (correct): Scratchpad files solve context degradation by externalising critical knowledge to the filesystem. When the agent's context window fills and earlier findings become unreliable, the scratchpad provides a persistent, accurate reference.
- **C** (incorrect): While agents could theoretically share files, the primary purpose of scratchpad files is to help a single agent maintain continuity across its own context boundaries, not inter-agent communication.
- **D** (incorrect): Scratchpad files are for preserving discovered knowledge, not logging tool calls. Tool call logs serve a different observability purpose.

</details>

---

### Q223 (q-5-5-003) — single-choice

**Task statement:** 5.5 human-review-calibration / confidence-calibration · **Difficulty:** recall · scenario: s6

**In a data extraction pipeline, what does 'confidence calibration' mean and why is it required before automating decisions based on confidence scores?**

　 **A.** It means training the model to always output confidence scores above 90% so that most extractions can be automated

✅ **[CORRECT]** **B.** It means verifying that when the model reports X% confidence, approximately X% of those predictions are actually correct, validated against labelled data

　 **C.** It means adjusting the model's temperature parameter until confidence scores fall within an acceptable range

　 **D.** It means running the same extraction multiple times and averaging the confidence scores to reduce variance

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Calibration ensures the model's reported confidence matches its actual accuracy. If 90% confidence predictions are only correct 60% of the time, the scores are miscalibrated and automating based on them will produce unacceptable error rates.

**Option breakdown:**

- **A** (incorrect): Calibration is about the accuracy of confidence scores, not about raising them. A model that outputs 90% confidence on everything is poorly calibrated, not well calibrated.
- **B** (correct): Calibration ensures the model's reported confidence matches its actual accuracy. If 90% confidence predictions are only correct 60% of the time, the scores are miscalibrated and automating based on them will produce unacceptable error rates.
- **C** (incorrect): Temperature affects output randomness, not confidence calibration. Calibration requires empirical validation against ground truth data, not parameter tuning.
- **D** (incorrect): Repeated runs measure consistency, not calibration. A model can consistently report 95% confidence and consistently be wrong — that is consistent but poorly calibrated.

</details>

---

### Q224 (q-5-1-003) — single-choice

**Task statement:** 5.1 context-window-management / token-budget · **Difficulty:** application · scenario: s1

**A customer support agent uses a token budget of 200k tokens. The system prompt consumes 8k tokens, conversation history takes 120k tokens, and the most recent tool call result returned 65k tokens. The agent is struggling to produce thorough responses. What is the most likely cause and fix?**

✅ **[CORRECT]** **A.** Input already consumes 193k of the 200k budget. Summarise history or trim verbose tool results.

　 **B.** The system prompt is too large at 8k tokens and should be reduced to under 2k to leave more room for the response

　 **C.** The model needs a higher max_tokens parameter to produce longer responses

　 **D.** The conversation history should be cleared entirely to give the model a fresh context for each response

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Token budget is shared: system prompt + conversation history + tool results + available for response = total budget. With 193k consumed, only 7k remains for the response. The fix targets the largest movable allocations: summarise older history or trim verbose tool output.

**Option breakdown:**

- **A** (correct): Token budget is shared: system prompt + conversation history + tool results + available for response = total budget. With 193k consumed, only 7k remains for the response. The fix targets the largest movable allocations: summarise older history or trim verbose tool output.
- **B** (incorrect): The system prompt at 8k is a small fraction of the budget. Reducing it by 6k would help marginally but misidentifies the problem — conversation history and tool results are consuming the vast majority of the budget.
- **C** (incorrect): max_tokens caps the response length but cannot exceed the remaining context budget. If 193k of 200k is consumed by input, increasing max_tokens beyond 7k would have no effect.
- **D** (incorrect): Clearing history would free tokens but destroy conversation continuity. The customer would need to repeat their issue. Selective summarisation is far preferable to wholesale deletion.

</details>

---

### Q225 (q-5-6-003) — single-choice

**Task statement:** 5.6 information-provenance / claim-source-mapping · **Difficulty:** application · scenario: s6

**A data extraction pipeline extracts financial figures from annual reports. The pipeline cites sources using inline text references like 'According to page 12 of the 2024 Annual Report, revenue was $4.2B.' When the extracted data is consumed by a downstream analytics system, the source attribution is consistently lost. What is the root cause and fix?**

　 **A.** The downstream system strips text formatting. Fix by making the citations bold or using a special delimiter

✅ **[CORRECT]** **B.** Inline prose citations are fragile. Fix by outputting structured claim-source mappings pairing each value with source, page, and date.

　 **C.** The downstream system needs to be modified to preserve all input text verbatim without any transformation

　 **D.** Add a separate attribution database keyed by value hash that the downstream system queries to look up the source for any extracted figure.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Structured claim-source mappings survive downstream processing because they are data fields, not prose. An analytics system can consume {'value': '4.2B', 'source': '2024 Annual Report', 'page': 12} without losing attribution, whereas it will discard 'According to page 12...' during text processing.

**Option breakdown:**

- **A** (incorrect): The problem is not formatting but data structure. Regardless of text formatting, inline prose citations are lost when text is parsed, summarised, or restructured by downstream systems.
- **B** (correct): Structured claim-source mappings survive downstream processing because they are data fields, not prose. An analytics system can consume {'value': '4.2B', 'source': '2024 Annual Report', 'page': 12} without losing attribution, whereas it will discard 'According to page 12...' during text processing.
- **C** (incorrect): Requiring downstream systems to preserve verbatim text is impractical and fragile. Systems legitimately need to transform, aggregate, and restructure data. Attribution should be in a format that survives transformation.
- **D** (incorrect): While a database could store attributions, this adds unnecessary infrastructure when the extraction pipeline can simply output structured mappings directly. The attribution should travel with the data, not require a separate lookup.

</details>

---

### Q226 (q-5-5-004) — single-choice

**Task statement:** 5.5 human-review-calibration / aggregate-metrics-trap · **Difficulty:** scenario-analysis · scenario: s6

**A structured data extraction system processes invoices, purchase orders, and contracts. The monitoring dashboard shows 97% overall extraction accuracy and the team considers the system production-ready. A detailed audit reveals: invoices 99.5% accuracy (80% of volume), purchase orders 98% accuracy (15% of volume), contracts 72% accuracy (5% of volume). What does this reveal and what action is required?**

　 **A.** The system is performing well. 72% on contracts is acceptable since contracts represent only 5% of volume and barely affect the overall metric

✅ **[CORRECT]** **B.** The aggregate metric is masking a severe per-type disparity. Give contracts mandatory review and report per-type metrics.

　 **C.** The training data needs rebalancing so that contracts represent a larger proportion, which will naturally improve contract accuracy

　 **D.** The 97% threshold should be raised to 99% overall to force improvement across all document types

<details><summary><b>Answer</b>: B</summary>

**Rationale:** This is a textbook case of aggregate metrics hiding per-type problems. 97% overall is misleading because high-volume invoice accuracy (99.5%) overwhelms the poor contract performance (72%). Per-type metrics would have surfaced this immediately. Contracts need different treatment until the extraction quality is acceptable.

**Option breakdown:**

- **A** (incorrect): Acceptability depends on the business impact, not volume percentage. Contract extraction errors may have severe financial or legal consequences despite low volume. A 28% error rate on any document type is significant.
- **B** (correct): This is a textbook case of aggregate metrics hiding per-type problems. 97% overall is misleading because high-volume invoice accuracy (99.5%) overwhelms the poor contract performance (72%). Per-type metrics would have surfaced this immediately. Contracts need different treatment until the extraction quality is acceptable.
- **C** (incorrect): LLMs used for extraction are not retrained on production data this way. The issue is monitoring visibility and operational response, not model training data distribution.
- **D** (incorrect): Raising the aggregate threshold does not address per-type disparities. Even at 99% overall, contract accuracy could remain low if invoice volume continues to dominate the metric. The solution is per-type metrics, not a higher aggregate bar.

</details>

---

### Q227 (q-5-1-010) — single-choice

**Task statement:** 5.1 context-window-management / position-effects · **Difficulty:** scenario-analysis · scenario: s2

**A multi-agent system runs a 45-minute deep research workflow. Around the 30-minute mark, the coordinator's synthesis quality drops: it refers to 'the key findings' instead of specific statistics it cited earlier, and misattributes a claim from the financial subagent to the news subagent. No token limits or errors have been hit. What is the most likely diagnosis and correct mitigation?**

　 **A.** The model is experiencing 'fatigue' from a long session and needs a cooldown period before continuing

✅ **[CORRECT]** **B.** Context degradation: early results are buried deep in a long context. Consolidate key findings into a structured block near the end.

　 **C.** The token limit has been silently exceeded and the API is truncating early messages. Upgrade to a larger context window model

　 **D.** The subagents are returning inconsistent data, confusing the coordinator. Add data validation to each subagent's output before it reaches the coordinator

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Context degradation occurs when important information is buried deep in a long conversation. The model's attention to early content diminishes as new content accumulates. Consolidating key findings into a recent, structured block keeps them in the model's effective attention window without losing the specifics.

**Option breakdown:**

- **A** (incorrect): LLMs do not experience fatigue. Each inference is independent. The degradation is caused by context window dynamics, not model tiredness.
- **B** (correct): Context degradation occurs when important information is buried deep in a long conversation. The model's attention to early content diminishes as new content accumulates. Consolidating key findings into a recent, structured block keeps them in the model's effective attention window without losing the specifics.
- **C** (incorrect): The question states no token limits have been hit. Context degradation occurs well before token limits are reached — it is an attention quality issue, not a capacity issue.
- **D** (incorrect): The coordinator previously cited these same findings correctly earlier in the session. The issue is not data quality from subagents but the coordinator's degrading attention to that data over time.

</details>

---

### Q228 (q-5-6-004) — single-choice

**Task statement:** 5.6 information-provenance / conflict-handling · **Difficulty:** scenario-analysis · scenario: s2

**A multi-agent research system finds conflicting data on a pharmaceutical compound's efficacy. A 2022 peer-reviewed clinical trial reports 78% efficacy, while a 2024 preprint reports 45% efficacy with a larger sample size. The synthesis agent must produce a recommendation for a medical advisory board. Which approach correctly handles the conflicting sources?**

　 **A.** Use the 2024 preprint as it has a larger sample size and is more recent, noting it supersedes the 2022 study

　 **B.** Average the two values (61.5%) and present it as the best estimate with a note about variance between studies

✅ **[CORRECT]** **C.** Present both findings with full provenance: source identity, publication date, peer-review status, sample size, methodology, and any methodological differences that may explain the discrepancy. Let the advisory board weigh the evidence

　 **D.** Exclude both findings and report that no reliable consensus exists, recommending further research before any conclusions

<details><summary><b>Answer</b>: C</summary>

**Rationale:** For a medical advisory board, preserving full provenance is critical. The board needs to weigh peer-review status, sample size, methodology differences, and temporal context. Annotating both sources with complete metadata enables informed human judgment on conflicting scientific evidence.

**Option breakdown:**

- **A** (incorrect): Recency and sample size alone do not determine reliability. The preprint has not undergone peer review, and simply picking one source discards valuable context that the advisory board needs for informed decision-making.
- **B** (incorrect): Averaging conflicting scientific results is methodologically invalid. The studies may have different populations, methodologies, or endpoints. The average has no scientific meaning and obscures the actual disagreement.
- **C** (correct): For a medical advisory board, preserving full provenance is critical. The board needs to weigh peer-review status, sample size, methodology differences, and temporal context. Annotating both sources with complete metadata enables informed human judgment on conflicting scientific evidence.
- **D** (incorrect): Excluding available evidence is unhelpful. The advisory board can make informed decisions with properly attributed conflicting data. Withholding findings because they conflict reduces the board's ability to assess the situation.

</details>

---

### Q229 (q-5-1-004) — single-choice

**Task statement:** 5.1 context-window-management / token-budget · **Difficulty:** recall · scenario: s6

**In Claude's token budget, which components compete for space within the context window?**

　 **A.** Only the user's message and the model's response share the context window; system prompts and tool results are handled separately

✅ **[CORRECT]** **B.** System prompt, conversation history, tool call results, and the tokens available for the model's response all share a single context window budget

　 **C.** The system prompt has its own dedicated allocation that does not affect the tokens available for conversation or response

　 **D.** Tool call results are streamed separately and do not consume context window tokens

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The context window is a single shared budget. System prompt tokens + conversation history tokens + tool result tokens + response tokens must all fit within the total window. Over-allocating to any component reduces what is available for others.

**Option breakdown:**

- **A** (incorrect): System prompts and tool results are part of the context window. All input tokens, regardless of source, consume context budget.
- **B** (correct): The context window is a single shared budget. System prompt tokens + conversation history tokens + tool result tokens + response tokens must all fit within the total window. Over-allocating to any component reduces what is available for others.
- **C** (incorrect): There is no separate allocation for system prompts. A 10k-token system prompt consumes 10k tokens from the same shared budget, leaving less for conversation and response.
- **D** (incorrect): Tool results are injected into the context as part of the conversation. They consume tokens from the same shared context window as everything else.

</details>

---

### Q230 (q-5-2-004) — single-choice

**Task statement:** 5.2 escalation-ambiguity / ambiguous-matching · **Difficulty:** application · scenario: s1

**A customer support agent searches for a customer named 'Sarah Johnson' and the lookup tool returns three matching accounts with the same name but different addresses and account ages. The agent selects the most recently active account and proceeds with the refund. Later, the customer calls back because the refund was applied to the wrong account. What should the agent have done differently?**

　 **A.** Selected the account with the oldest creation date, since long-standing customers are the most likely callers to a support line.

✅ **[CORRECT]** **B.** Asked the customer for additional identifying information to disambiguate the matching accounts.

　 **C.** Processed the refund across all three accounts to ensure the correct customer received it.

　 **D.** Escalated to a human agent immediately because the system returned ambiguous results.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When multiple customers match a search query, the agent must ask for additional identifiers rather than selecting based on heuristics. This ensures the correct account is identified before any action is taken.

**Option breakdown:**

- **A** (incorrect): Account age is an unreliable heuristic for identifying the correct customer. Any selection based on heuristics risks choosing the wrong account.
- **B** (correct): When multiple customers match a search query, the agent must ask for additional identifiers rather than selecting based on heuristics. This ensures the correct account is identified before any action is taken.
- **C** (incorrect): Processing refunds on incorrect accounts creates financial discrepancies and additional work to reverse the erroneous transactions. The agent must identify the correct account first.
- **D** (incorrect): Ambiguous search results are a routine scenario that the agent can resolve by asking for clarification. Escalation is not warranted when the agent can gather additional information to disambiguate.

</details>

---

### Q231 (q-5-2-005) — single-choice

**Task statement:** 5.2 escalation-ambiguity / explicit-escalation · **Difficulty:** application · scenario: s1

**A customer says: 'This is ridiculous, I have been waiting 20 minutes. Just connect me to a real person.' The agent has access to the customer's account and can see the issue is a simple password reset that takes 30 seconds to resolve. What should the agent do?**

　 **A.** Acknowledge the frustration and offer to resolve the password reset, explaining it will take only 30 seconds — the issue is straightforward and escalation is unnecessary.

✅ **[CORRECT]** **B.** Escalate to a human agent immediately without attempting to resolve the issue, because the customer explicitly requested a human.

　 **C.** Run sentiment analysis to confirm the customer is genuinely frustrated before deciding whether to escalate or attempt resolution.

　 **D.** Ask the customer if they would prefer to wait for a human or let the agent resolve the password reset quickly.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** When a customer explicitly says 'connect me to a real person', the agent must escalate immediately. This is one of the three valid escalation triggers. The simplicity of the issue is irrelevant — the customer's explicit request takes priority.

**Option breakdown:**

- **A** (incorrect): The customer has explicitly requested a human agent. Regardless of how simple the issue is, the agent must honour the explicit request immediately. Attempting to resolve first ignores the customer's stated preference.
- **B** (correct): When a customer explicitly says 'connect me to a real person', the agent must escalate immediately. This is one of the three valid escalation triggers. The simplicity of the issue is irrelevant — the customer's explicit request takes priority.
- **C** (incorrect): Sentiment analysis is an unreliable escalation trigger. More importantly, the customer's explicit request for a human is the trigger here, not their emotional state. Sentiment analysis adds unnecessary processing.
- **D** (incorrect): The customer has already stated their preference clearly. Asking again ignores their explicit request and adds friction to an already frustrating experience.

</details>

---

### Q232 (q-5-1-005) — single-choice

**Task statement:** 5.1 context-window-management / tool-result-trimming · **Difficulty:** application · scenario: s7

**An analytics agent queries Snowflake and receives 40+ columns per row, only 5 of which are relevant to the user's question about quarterly revenue. The agent appends the full result set to context. After three such queries the window is nearly full and follow-up questions fail. What is the most effective fix?**

　 **A.** Upgrade to a model with a larger context window so that full result sets can be accommodated across more queries.

✅ **[CORRECT]** **B.** Trim tool results to only the relevant columns before appending them to the conversation context.

　 **C.** Store all query results in an external database and have the agent retrieve specific values on demand instead of keeping results in context.

　 **D.** Limit the number of rows returned by each query to reduce the total data volume in context.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Tool result trimming removes irrelevant fields before they enter the context window. Keeping only the 5 relevant columns from each 40+ column result set dramatically reduces token consumption, allowing the agent to handle many more queries within the same context budget.

**Option breakdown:**

- **A** (incorrect): A larger context window postpones the problem but does not solve it. Each full result set still wastes tokens on 35+ irrelevant columns, and the context will eventually fill regardless of size.
- **B** (correct): Tool result trimming removes irrelevant fields before they enter the context window. Keeping only the 5 relevant columns from each 40+ column result set dramatically reduces token consumption, allowing the agent to handle many more queries within the same context budget.
- **C** (incorrect): External storage adds infrastructure complexity without addressing the core issue. The agent still needs some result data in context to reason about it. Trimming irrelevant fields is simpler and directly reduces context consumption.
- **D** (incorrect): Row limits reduce data volume but may exclude relevant rows. The problem is column-level verbosity (35+ irrelevant columns per row), not row count. Trimming columns preserves all relevant rows whilst eliminating irrelevant fields.

</details>

---

### Q233 (q-5-3-005) — single-choice

**Task statement:** 5.3 error-propagation / silent-suppression · **Difficulty:** application · scenario: s2

**A multi-agent system has subagents for web search, academic database, and industry reports. The academic database subagent hits a 403 Forbidden on a specific journal, catches the error, and returns an empty result set marked as successful. The coordinator produces a final report with no academic sources. What is the critical failure in this design?**

　 **A.** The coordinator should validate that all subagents return non-empty results before producing the final report.

✅ **[CORRECT]** **B.** The subagent silently suppressed the access failure by returning empty results as success, preventing the coordinator from attempting recovery or noting the gap in coverage.

　 **C.** The subagent should have retried the request with exponential backoff, as 403 errors are often transient.

　 **D.** The entire workflow should have been terminated when the academic database subagent encountered the 403 error.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Silent suppression — returning empty results marked as success — is the worst error propagation anti-pattern. The coordinator believes the academic search succeeded and found nothing, so it produces a report without academic sources and without noting the coverage gap. The subagent should have returned structured error context with the failure type, what was attempted, and potential alternatives.

**Option breakdown:**

- **A** (incorrect): Requiring non-empty results from all subagents would cause the workflow to fail when a subagent legitimately finds no matching data. The issue is that the error was suppressed, not that the coordinator failed to validate result volume.
- **B** (correct): Silent suppression — returning empty results marked as success — is the worst error propagation anti-pattern. The coordinator believes the academic search succeeded and found nothing, so it produces a report without academic sources and without noting the coverage gap. The subagent should have returned structured error context with the failure type, what was attempted, and potential alternatives.
- **C** (incorrect): 403 Forbidden is a permission error, not a transient error. Retrying will not resolve it — the subagent lacks the required access credentials. The correct response is to propagate the error with its type so the coordinator knows the failure is not retryable.
- **D** (incorrect): Workflow termination on a single subagent failure wastes partial results from the web search and industry reports subagents that may have completed successfully. The coordinator should proceed with available results and annotate the coverage gap.

</details>

---

### Q234 (q-5-4-005) — single-choice

**Task statement:** 5.4 codebase-exploration / subagent-delegation · **Difficulty:** application · scenario: s9

**Claude Code is auditing API documentation coverage across a large codebase. After exploring 15 modules, the agent produces vague references like 'the authentication module follows standard patterns' instead of citing specific class names and method signatures it discovered earlier. `/compact` has already been used once. What is the most effective next step?**

　 **A.** Run /compact again to further reduce context usage and continue the exploration in the same session.

✅ **[CORRECT]** **B.** Delegate remaining module explorations to subagents, giving each a scratchpad summary of findings so far.

　 **C.** Start a fresh session and re-explore all 15 modules more efficiently to rebuild the context with only essential findings.

　 **D.** Increase the model's temperature to encourage more detailed and specific outputs instead of vague pattern references.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Subagent delegation isolates verbose exploration output from the main agent's context. The scratchpad file persists specific findings (class names, method signatures) across context boundaries. The main agent retains enough context for coordination without being overwhelmed by discovery output.

**Option breakdown:**

- **A** (incorrect): Running /compact again may help marginally, but the fundamental problem is that the agent's context has filled with verbose discovery output from 15 modules. Compacting alone does not restore the specific findings that have been lost to context degradation.
- **B** (correct): Subagent delegation isolates verbose exploration output from the main agent's context. The scratchpad file persists specific findings (class names, method signatures) across context boundaries. The main agent retains enough context for coordination without being overwhelmed by discovery output.
- **C** (incorrect): Re-exploring 15 modules wastes significant time and effort. The specific findings from earlier exploration are lost. A scratchpad file would have preserved them, and subagent delegation prevents the problem going forward.
- **D** (incorrect): Temperature affects output randomness, not the model's ability to recall specific findings from earlier in a long context. The problem is context degradation from verbose output accumulation, not generation settings.

</details>

---

### Q235 (q-5-5-005) — single-choice

**Task statement:** 5.5 human-review-calibration / per-field-calibration · **Difficulty:** application · scenario: s6

**A contract extraction system reports 96% overall accuracy. The team plans to auto-approve all extractions where model confidence exceeds 90%. A pilot reveals party name extraction achieves 99% accuracy but indemnification clause extraction only 71%, even though the model reports high confidence on both. What should they implement before automating?**

　 **A.** Raise the automation confidence threshold from 90% to 99% to ensure only the most reliable extractions are automated.

✅ **[CORRECT]** **B.** Calibrate confidence thresholds per field type using labelled validation sets, and implement stratified sampling to continuously monitor accuracy by document type and field segment.

　 **C.** Exclude indemnification clauses from automation entirely and continue automating all other field types at the 90% threshold.

　 **D.** Train a separate classification model to predict extraction accuracy before deciding whether to automate each extraction.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Field-level confidence calibration using ground truth data exposes the discrepancy between reported confidence and actual accuracy. Stratified sampling provides ongoing monitoring to detect novel error patterns. Together, these ensure automation is only applied where validated accuracy justifies it.

**Option breakdown:**

- **A** (incorrect): Raising the threshold does not fix the calibration problem. The model reports high confidence even for indemnification clauses where it achieves only 71% accuracy. Raw confidence scores are unreliable without calibration.
- **B** (correct): Field-level confidence calibration using ground truth data exposes the discrepancy between reported confidence and actual accuracy. Stratified sampling provides ongoing monitoring to detect novel error patterns. Together, these ensure automation is only applied where validated accuracy justifies it.
- **C** (incorrect): This addresses the known problem but does not detect future calibration issues with other field types. Without systematic calibration and monitoring, other fields with hidden accuracy problems will be automated incorrectly.
- **D** (incorrect): A separate model adds infrastructure complexity when the solution is to calibrate the existing confidence scores against labelled data. Calibration directly addresses the unreliable confidence outputs without requiring additional ML infrastructure.

</details>

---

### Q236 (q-5-6-005) — single-choice

**Task statement:** 5.6 information-provenance / conflict-handling · **Difficulty:** application · scenario: s2

**A synthesis agent receives findings from three subagents: solar investment grew 15% (Bloomberg, January 2024), solar investment grew 22% (IEA, March 2024), and cost-per-watt data. The synthesis agent currently picks the IEA figure because it is more recent. What is the correct approach?**

　 **A.** Always use the most authoritative source (IEA as an international agency) and discard the Bloomberg figure.

　 **B.** Average the two values (18.5%) and cite both sources to present a balanced view.

✅ **[CORRECT]** **C.** Present both figures with source attribution and dates, noting what may explain the difference.

　 **D.** Flag the conflicting figures and pause report generation until a human researcher resolves the discrepancy.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Preserving both data points with provenance — source, date, and potential explanations for the difference — lets the consumer interpret the data correctly. Different publication dates and methodologies explain the discrepancy without requiring the synthesis agent to judge which is 'right'.

**Option breakdown:**

- **A** (incorrect): Discarding a credible source based on perceived authority silently removes valid data. Both sources are credible, and the difference may reflect different methodologies, scopes, or time periods.
- **B** (incorrect): Averaging conflicting statistics is mathematically misleading. The two figures may measure different scopes (e.g., different regions or investment types), making an average meaningless. The difference needs to be preserved, not merged.
- **C** (correct): Preserving both data points with provenance — source, date, and potential explanations for the difference — lets the consumer interpret the data correctly. Different publication dates and methodologies explain the discrepancy without requiring the synthesis agent to judge which is 'right'.
- **D** (incorrect): Pausing for human resolution is unnecessary when the difference can be explained by temporal or methodological factors. Proper annotation with provenance resolves the ambiguity without blocking the workflow.

</details>

---

### Q237 (q-5-1-006) — single-choice

**Task statement:** 5.1 context-window-management / facts-block · **Difficulty:** scenario-analysis · scenario: s7

**An agent joins Snowflake revenue data with PostgreSQL customer data via federated queries. To manage context, it progressively summarises earlier results between rounds. After three rounds it reports 'revenue increased in Q3' but cannot give the exact figure ($14.2M), which was lost in summarisation. The user asks for the precise number. What is the most effective fix?**

　 **A.** Re-run the original Snowflake query to retrieve the exact Q3 revenue figure from the source.

✅ **[CORRECT]** **B.** Extract key numerical facts into a persistent facts block outside the summarised history.

　 **C.** Increase the context window size so that summarisation is triggered less frequently.

　 **D.** Instruct the agent to always include exact figures in its summaries rather than qualitative statements.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The progressive summarisation trap destroys numerical precision when conversation history is compressed. A persistent facts block preserves exact figures, dates, and identifiers across summarisation rounds, directly solving the data loss problem.

**Option breakdown:**

- **A** (incorrect): Re-querying works as a recovery tactic but does not prevent the problem from recurring. The agent will summarise again on the next round, losing the figure again. A structural fix is needed.
- **B** (correct): The progressive summarisation trap destroys numerical precision when conversation history is compressed. A persistent facts block preserves exact figures, dates, and identifiers across summarisation rounds, directly solving the data loss problem.
- **C** (incorrect): A larger context window delays the problem but does not solve it. As queries accumulate, summarisation will eventually compress the figures. The structural fix is to extract key data from the summarisation pipeline entirely.
- **D** (incorrect): Prompt-based instructions for summarisation behaviour are unreliable. The model compresses content probabilistically, and instructions cannot guarantee that specific numbers survive multiple rounds of summarisation.

</details>

---

### Q238 (q-5-1-007) — single-choice

**Task statement:** 5.1 context-window-management / lost-in-the-middle · **Difficulty:** application · scenario: s7

**An agent receives 200 rows of Snowflake financial data and places it mid-prompt, between system instructions and the user's follow-up question. Asked to identify the row with the highest margin, the agent picks the 45th row (margin 32%) over the 142nd row (margin 47%). What cognitive bias is affecting the agent?**

　 **A.** Recency bias — the agent prioritises data appearing near the end of the context window.

✅ **[CORRECT]** **B.** The lost-in-the-middle effect: the agent favours the start and end, missing the row buried in the middle.

　 **C.** Token limit truncation — the result set exceeds the context window and rows beyond the 100th are silently dropped.

　 **D.** Anchoring bias — the agent fixates on the first high-margin row it encounters and stops scanning the rest.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The lost-in-the-middle effect causes LLMs to attend disproportionately to content at the start and end of long sequences, with reduced attention to material in the middle. Row 142 (the correct answer) sits deep in the middle of the 200-row result set, making it prone to being overlooked.

**Option breakdown:**

- **A** (incorrect): Recency bias would favour rows near the end of the data, not the 45th row. The 45th row is in the early portion of the result set, which is consistent with the lost-in-the-middle effect, not recency bias.
- **B** (correct): The lost-in-the-middle effect causes LLMs to attend disproportionately to content at the start and end of long sequences, with reduced attention to material in the middle. Row 142 (the correct answer) sits deep in the middle of the 200-row result set, making it prone to being overlooked.
- **C** (incorrect): If rows were truncated, the agent would not have access to row 142 at all and would report the highest margin from the visible rows. The agent identified a specific wrong row (45th), indicating all data is present but attention is uneven.
- **D** (incorrect): Anchoring bias is a human cognitive bias, not a well-documented LLM failure mode for structured data scanning. The observed behaviour — accurate recall at the start and end, poor recall in the middle — is the hallmark of the lost-in-the-middle effect.

</details>

---

### Q239 (q-5-3-006) — single-choice

**Task statement:** 5.3 error-propagation / silent-suppression · **Difficulty:** application · scenario: s7

**The data platform agent queries three sources in sequence: Snowflake (succeeds), PostgreSQL (returns a connection timeout), and a pricing API (succeeds). The agent silently skips the PostgreSQL failure and produces a report using only Snowflake and API data, without informing the user that customer data is missing. What is the critical design failure?**

　 **A.** The agent should retry the PostgreSQL query automatically with exponential backoff before producing the report.

✅ **[CORRECT]** **B.** The agent silently suppresses the error instead of propagating structured error context that annotates which data sources failed and what coverage the report actually has.

　 **C.** The agent should abort the entire report if any single data source fails, to avoid producing incomplete results.

　 **D.** The orchestrator should pre-check all data source connections before allowing the agent to begin querying.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Silent error suppression is one of the most dangerous anti-patterns in multi-source systems. The agent must propagate structured error context — identifying which sources failed, what data is missing, and what coverage the final report represents — so the user can make informed decisions about the report's completeness.

**Option breakdown:**

- **A** (incorrect): Automatic retries are appropriate for transient errors, but the critical failure is that the agent silently suppresses the error. Even after retries exhaust, the agent must surface the failure to the user rather than producing an incomplete report without disclosure.
- **B** (correct): Silent error suppression is one of the most dangerous anti-patterns in multi-source systems. The agent must propagate structured error context — identifying which sources failed, what data is missing, and what coverage the final report represents — so the user can make informed decisions about the report's completeness.
- **C** (incorrect): Aborting on any failure is overly conservative. Partial results with clear coverage annotations are often more useful than no results. The fix is transparency about what is missing, not refusing to produce anything.
- **D** (incorrect): Pre-checking connections does not prevent runtime failures (a source can become unavailable between the check and the query). The agent must handle failures gracefully at query time with structured error propagation.

</details>

---

### Q240 (q-5-4-006) — single-choice

**Task statement:** 5.4 codebase-exploration / compact · **Difficulty:** scenario-analysis · scenario: s7

**A developer has been using the data platform agent in a single extended session for two hours, running complex federated queries, debugging SQL syntax, and iterating on report formatting. The agent now produces noticeably worse SQL and occasionally references table schemas from earlier queries that have since been corrected. What is the most effective intervention?**

✅ **[CORRECT]** **A.** Use /compact, optionally with focus instructions, to summarise the conversation and free context budget.

　 **B.** Start a completely new session and re-establish all context from scratch.

　 **C.** Increase the model's temperature parameter to improve creativity and reduce fixation on stale patterns.

　 **D.** Add a system prompt instruction telling the agent to ignore all schema information from more than 30 minutes ago.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Extended sessions cause context degradation as stale information (outdated schemas, abandoned approaches) competes with current context. /compact summarises the conversation history into a compressed form, freeing context budget. The optional [instructions] argument lets you bias the summary (for example, 'preserve the corrected schema for the orders table'). It is the documented mitigation for context degradation in long sessions, and the least disruptive option of the four.

**Option breakdown:**

- **A** (correct): Extended sessions cause context degradation as stale information (outdated schemas, abandoned approaches) competes with current context. /compact summarises the conversation history into a compressed form, freeing context budget. The optional [instructions] argument lets you bias the summary (for example, 'preserve the corrected schema for the orders table'). It is the documented mitigation for context degradation in long sessions, and the least disruptive option of the four.
- **B** (incorrect): A fresh session discards all accumulated context, including valuable recent work. /compact summarises the existing conversation while preserving the gist of recent work, which is less disruptive than starting over.
- **C** (incorrect): Temperature affects output randomness, not context quality. The problem is stale information in the context window polluting the agent's reasoning, not a lack of creative variation.
- **D** (incorrect): The agent has no reliable concept of message timestamps within the context window. Time-based instructions are unenforceable. The structural fix is to compress or remove stale context entries.

</details>

---

### Q241 (q-5-5-006) — single-choice

**Task statement:** 5.5 human-review-calibration / aggregate-metrics-trap · **Difficulty:** scenario-analysis · scenario: s7

**The data platform team runs a human review of the agent's federated query reports. Reviewers sample 50 reports and find an overall accuracy rate of 97%. Management approves the system for production. Three weeks later, users report that currency conversion calculations in cross-border revenue reports are wrong 40% of the time. How did the review process fail?**

　 **A.** The sample size of 50 reports was too small to detect a 40% error rate in currency conversions.

✅ **[CORRECT]** **B.** The reviewers used aggregate accuracy metrics that masked category-specific failures such as the 40% currency error rate.

　 **C.** The reviewers were not domain experts in currency conversion and could not identify the errors.

　 **D.** The agent's accuracy degraded over time due to model drift, and the initial 97% rate was genuinely correct at the time of review.

<details><summary><b>Answer</b>: B</summary>

**Rationale:** This is the aggregate metrics trap. When a low-frequency report type (cross-border revenue) has high error rates, the overall accuracy metric is dominated by high-frequency, easy report types. Stratified random sampling across report categories would have caught the currency conversion failures.

**Option breakdown:**

- **A** (incorrect): A 40% error rate in any category should be detectable in 50 reports — but only if the sample includes enough reports from that category. The problem is sampling strategy, not sample size.
- **B** (correct): This is the aggregate metrics trap. When a low-frequency report type (cross-border revenue) has high error rates, the overall accuracy metric is dominated by high-frequency, easy report types. Stratified random sampling across report categories would have caught the currency conversion failures.
- **C** (incorrect): Reviewer expertise is a valid concern but is not the structural failure. Even expert reviewers would miss the problem if the sample did not include enough cross-border reports. The sampling methodology is the root cause.
- **D** (incorrect): LLMs served via API do not experience gradual model drift within a three-week window. The error pattern was present during the review but hidden by aggregate metrics that did not stratify by report category.

</details>

---

### Q242 (q-5-6-006) — single-choice

**Task statement:** 5.6 information-provenance / dual-attribution · **Difficulty:** recall · scenario: s7

**The data platform agent produces a report combining Snowflake revenue data and a third-party market sizing API. The Snowflake data shows the company's market share at 12%, whilst the API reports it at 8%. What is the correct provenance approach for the agent's report?**

　 **A.** Use the higher figure (12%) as it comes from the company's own authoritative data source.

　 **B.** Average the two figures to 10% and report it as the consensus estimate, noting the range spanned by both sources.

✅ **[CORRECT]** **C.** Present both figures with dual attribution, identifying the source, methodology, and time period for each.

　 **D.** Flag the discrepancy as an error and refuse to include either figure until the data team resolves the conflict.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Dual attribution for conflicting data is the correct provenance pattern. The agent must surface both figures with clear claim-source mappings, including the data source, methodology, and temporal context, rather than silently resolving the conflict.

**Option breakdown:**

- **A** (incorrect): Selecting one figure based on source authority silently discards conflicting information. The user needs both figures with source attribution to make their own judgement.
- **B** (incorrect): Averaging conflicting figures from different methodologies produces a number that neither source supports. This obscures the disagreement rather than surfacing it.
- **C** (correct): Dual attribution for conflicting data is the correct provenance pattern. The agent must surface both figures with clear claim-source mappings, including the data source, methodology, and temporal context, rather than silently resolving the conflict.
- **D** (incorrect): Conflicting sources are not necessarily errors — different methodologies legitimately produce different results. Refusing to report either figure leaves the user with no actionable data when both figures are informative.

</details>

---

### Q243 (q-5-4-007) — single-choice

**Task statement:** 5.4 codebase-exploration / scratchpad · **Difficulty:** application · scenario: s7

**A data engineer delegates a complex cross-database analysis to the platform agent: join Snowflake billing data with PostgreSQL usage data, apply currency normalisation, and produce a cost-per-user breakdown by region. The agent's context fills rapidly as it accumulates intermediate query results. What is the most effective strategy for managing this multi-step analysis within context limits?**

✅ **[CORRECT]** **A.** Write intermediate results to a scratchpad file after each step, then read back only the final aggregated data needed for the cost-per-user calculation.

　 **B.** Execute all queries in a single SQL statement using cross-database joins to avoid intermediate results entirely.

　 **C.** Delegate each step to a separate subagent so each runs with a fresh context window, then combine their outputs.

　 **D.** Summarise intermediate results between steps to reduce their token footprint in the conversation context.

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Scratchpad files offload intermediate results from the context window. Each step writes its output to a file, keeping the context budget free for the current step's reasoning. The final step reads back only the aggregated data it needs, avoiding the accumulation of raw intermediate results in context.

**Option breakdown:**

- **A** (correct): Scratchpad files offload intermediate results from the context window. Each step writes its output to a file, keeping the context budget free for the current step's reasoning. The final step reads back only the aggregated data it needs, avoiding the accumulation of raw intermediate results in context.
- **B** (incorrect): Cross-database joins between Snowflake and PostgreSQL are not possible in a single SQL statement — they are separate database systems accessed through different MCP tools. The multi-step approach is architecturally necessary.
- **C** (incorrect): Subagent delegation is useful for independent parallel tasks, but this analysis has sequential dependencies (each step depends on the previous step's output). Subagents would need the same intermediate data passed to them, merely shifting the context problem rather than solving it.
- **D** (incorrect): Summarising intermediate numerical results risks the progressive summarisation trap — exact billing figures, usage counts, and exchange rates may be compressed into qualitative descriptions, causing calculation errors in subsequent steps.

</details>

---

### Q244 (q-5-6-007) — single-choice

**Task statement:** 5.6 information-provenance / temporal-awareness · **Difficulty:** recall · scenario: s7

**The data platform agent generates a quarterly business review report that includes claims such as 'Revenue grew 15% YoY' sourced from Snowflake and 'Market expanded by 22%' sourced from a third-party API. The Snowflake data was last refreshed yesterday, whilst the API data is from a report published six months ago. What provenance metadata must accompany these claims?**

　 **A.** The name of each data source (Snowflake, third-party API) so the user knows where the data came from.

　 **B.** A confidence score (high/medium/low) for each claim based on the agent's assessment of data quality.

✅ **[CORRECT]** **C.** Claim-source mappings that include the data source and its date or refresh timestamp, showing temporal relevance.

　 **D.** A footnote at the end of the report listing all data sources used, without linking specific claims to specific sources.

<details><summary><b>Answer</b>: C</summary>

**Rationale:** Provenance requires claim-source mappings with temporal awareness. Each claim must be linked to its source with date context — the user must see that '15% YoY revenue growth' is from yesterday's Snowflake refresh whilst '22% market expansion' is from a six-month-old third-party report — to assess whether each figure is current enough for the quarterly review.

**Option breakdown:**

- **A** (incorrect): Source names alone are insufficient. Without temporal context, the user cannot judge whether the data is current enough for a quarterly review. The six-month-old market data may be misleading if presented without its publication date.
- **B** (incorrect): LLM-generated confidence scores are poorly calibrated and do not substitute for factual provenance metadata. The user needs objective source information to make their own quality assessment.
- **C** (correct): Provenance requires claim-source mappings with temporal awareness. Each claim must be linked to its source with date context — the user must see that '15% YoY revenue growth' is from yesterday's Snowflake refresh whilst '22% market expansion' is from a six-month-old third-party report — to assess whether each figure is current enough for the quarterly review.
- **D** (incorrect): A generic source list does not create claim-source mappings. The user cannot determine which specific claim came from which source, making it impossible to assess the reliability or currency of individual data points.

</details>

---

### Q245 (q-5-1-008) — single-choice

**Task statement:** 5.1 context-window-management / lost-in-the-middle · **Difficulty:** application · scenario: s9

**Claude Code is synthesising release notes from commit messages, PR descriptions, and changelog entries. During a 200+ commit session, summaries of commits from the middle of the sequence become vague ('various bug fixes') while the earliest and the most recent commits are still summarised accurately. The context window is not full. What is the most likely cause?**

　 **A.** The model's temperature is set too high, causing it to generate vague summaries randomly

✅ **[CORRECT]** **B.** The lost-in-the-middle effect: the model favours the start and end of long input, losing middle commit detail.

　 **C.** The commit messages in the middle of the sequence are inherently less detailed than the rest, so the vague summaries are accurate

　 **D.** Claude Code applies progressive summarisation to older commits to conserve context for recent ones

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The lost-in-the-middle effect is a well-documented phenomenon where models attend more strongly to the start and end of long contexts, with reduced attention to middle content. With 200+ commits loaded sequentially, commits in the middle of the sequence receive less attention, producing vague summaries. Processing in smaller batches or reordering critical information to the start and end mitigates this.

**Option breakdown:**

- **A** (incorrect): Temperature affects output randomness but would produce inconsistent quality across all commits, not a systematic pattern where the middle commits are vague and the start and end are accurate.
- **B** (correct): The lost-in-the-middle effect is a well-documented phenomenon where models attend more strongly to the start and end of long contexts, with reduced attention to middle content. With 200+ commits loaded sequentially, commits in the middle of the sequence receive less attention, producing vague summaries. Processing in smaller batches or reordering critical information to the start and end mitigates this.
- **C** (incorrect): The question states the vagueness applies to the middle of the sequence specifically, not to commits with poor messages. The systematic pattern (middle vague, start and end detailed) points to a context positioning effect, not source quality variation.
- **D** (incorrect): Claude Code does not automatically apply progressive summarisation to tool results within a single processing step. The context window is not full, so there is no space pressure triggering summarisation. The issue is attention distribution across long inputs.

</details>

---

### Q246 (q-5-1-009) — single-choice

**Task statement:** 5.1 context-window-management / progressive-summarisation · **Difficulty:** scenario-analysis · scenario: s9

**A docs team processes a 500,000-line codebase by having Claude Code read files and generate docs, instructing it to 'summarise each module after documenting it, then discard the detailed source from context.' After processing 20 modules, the docs for module 21 reference class names from module 3 that were renamed in module 12. What caused this failure?**

✅ **[CORRECT]** **A.** Progressive summarisation lost the rename detail: when module 12's summary replaced its source code, the rename was condensed to 'various refactoring changes', so the agent retained module 3's original class names from its earlier summary

　 **B.** The agent's context window overflowed, causing it to hallucinate class names from earlier modules

　 **C.** Claude Code cached module 3's source code and served the stale version instead of the updated file on disk

　 **D.** The model confused similar class names because it processed too many modules in a single session

<details><summary><b>Answer</b>: A</summary>

**Rationale:** Progressive summarisation is lossy. The summary of module 12 likely compressed the rename into a generic phrase, while module 3's summary still referenced the original class names. When the agent documented module 21, it found conflicting names across summaries and defaulted to the earlier, more prominent reference. Critical cross-module changes like renames must be tracked in a persistent facts block outside summarised context.

**Option breakdown:**

- **A** (correct): Progressive summarisation is lossy. The summary of module 12 likely compressed the rename into a generic phrase, while module 3's summary still referenced the original class names. When the agent documented module 21, it found conflicting names across summaries and defaulted to the earlier, more prominent reference. Critical cross-module changes like renames must be tracked in a persistent facts block outside summarised context.
- **B** (incorrect): The team explicitly manages context by summarising and discarding source code, so the context window is not overflowing. The problem is the quality of information retained in summaries, not context overflow.
- **C** (incorrect): Claude Code does not cache file contents between reads. Each Read tool call fetches the current file from disk. The issue is that summarised context retained old class names, not that file reads returned stale data.
- **D** (incorrect): The question specifies the exact failure: module 21 references class names from module 3 that were renamed in module 12. This is not a confusion issue but a direct consequence of losing the rename detail during progressive summarisation.

</details>

---

### Q247 (q-5-3-007) — single-choice

**Task statement:** 5.3 error-propagation / coverage-annotations · **Difficulty:** application · scenario: s9

**A documentation generation pipeline uses Claude Code to produce docs from three sources: source code comments, existing wiki pages, and API schema files. During a run, the wiki page retrieval fails with a timeout, but the source code and API schema are available. The pipeline currently halts entirely on any source failure. What is the best error handling strategy?**

　 **A.** Retry the wiki retrieval three times with exponential backoff. If all retries fail, halt the pipeline to prevent incomplete documentation

✅ **[CORRECT]** **B.** Return structured error context for the wiki failure, proceed with available sources, and mark the gaps that lack wiki content.

　 **C.** Silently skip the wiki source and generate documentation from the remaining two sources without noting the omission

　 **D.** Use the source code comments to infer what the wiki pages would have contained, filling in the gaps with generated content

<details><summary><b>Answer</b>: B</summary>

**Rationale:** This produces maximum value from available sources while maintaining transparency about what is missing. Structured error context enables intelligent recovery (retry later, alert the team). Explicit gap markers prevent users from trusting incomplete documentation as complete.

**Option breakdown:**

- **A** (incorrect): Halting the entire pipeline because one of three sources is unavailable wastes the successful results from the other two sources. Documentation from source code and API schemas is still valuable even without wiki content.
- **B** (correct): This produces maximum value from available sources while maintaining transparency about what is missing. Structured error context enables intelligent recovery (retry later, alert the team). Explicit gap markers prevent users from trusting incomplete documentation as complete.
- **C** (incorrect): Silent omission hides the failure. Users would trust the documentation as complete, not knowing that wiki-sourced context (which may contain critical operational notes or caveats) is missing.
- **D** (incorrect): Inferring wiki content from source code produces hallucinated documentation that appears authoritative. Wiki pages often contain operational context, known issues, and tribal knowledge that cannot be inferred from code.

</details>

---

### Q248 (q-5-4-008) — single-choice

**Task statement:** 5.4 codebase-exploration / context-degradation · **Difficulty:** application · scenario: s9

**A documentation team working across a 500,000-line codebase notices that Claude Code's responses become less specific after extensive file exploration. What is the term for this degradation and what is the primary mitigation in Claude Code?**

　 **A.** Token exhaustion, mitigated by raising max_tokens so the model has room to keep referencing every file it has read.

✅ **[CORRECT]** **B.** Context degradation, mitigated by scratchpad files and by delegating verbose exploration to subagents.

　 **C.** Hallucination drift — mitigated by lowering the temperature to zero for deterministic output

　 **D.** Prompt injection — mitigated by sanitising file contents before they enter the context window

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Context degradation occurs when the model loses grip on specific details as verbose tool output accumulates in the conversation. Scratchpad files persist findings on disk where they can be re-read as needed. Subagent delegation isolates verbose exploration output from the main agent's context budget.

**Option breakdown:**

- **A** (incorrect): max_tokens controls response length, not the model's ability to retain and reference earlier context. The degradation occurs because verbose exploration output fills the context window, not because responses are truncated.
- **B** (correct): Context degradation occurs when the model loses grip on specific details as verbose tool output accumulates in the conversation. Scratchpad files persist findings on disk where they can be re-read as needed. Subagent delegation isolates verbose exploration output from the main agent's context budget.
- **C** (incorrect): The issue is not hallucination from randomness but loss of specificity from context overload. Temperature zero produces deterministic output but does not help the model retain specific findings from earlier in a long context.
- **D** (incorrect): Prompt injection is a security concern involving malicious content in inputs. The described problem — responses becoming vague after extensive exploration — is context degradation from accumulated verbose output, not a security issue.

</details>

---

### Q249 (q-5-5-007) — single-choice

**Task statement:** 5.5 human-review-calibration / reviewer-capacity · **Difficulty:** scenario-analysis · scenario: s9

**Claude Code generates API reference pages for 150 endpoints across three categories: payment processing (30 endpoints, high regulatory risk), internal tooling (80 endpoints, low risk), and public data queries (40 endpoints, moderate risk). The team cannot manually review all 150. How should they structure human review?**

　 **A.** Randomly sample 15% of all endpoints (approximately 23 pages) for review, ensuring a representative cross-section

✅ **[CORRECT]** **B.** Use stratified sampling: review 100% of payment docs, 10% of public data query docs, and 5% of internal tooling docs.

　 **C.** Review only the payment processing endpoints since they are the highest risk, and trust Claude Code's output for the remaining 120 endpoints

　 **D.** Have Claude Code self-assess each generated page with a confidence score and only review pages where confidence falls below 80%

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Stratified sampling allocates review effort proportional to risk. Payment processing documentation has regulatory implications warranting full review. Public data queries affect external users and deserve moderate scrutiny. Internal tooling has the lowest blast radius and can tolerate the lightest review. This achieves thorough coverage of critical content within a manageable review budget.

**Option breakdown:**

- **A** (incorrect): Uniform random sampling treats all endpoints equally, but payment processing endpoints carry much higher risk. A 15% sample might only include 4-5 payment endpoints, inadequately covering the highest-risk category.
- **B** (correct): Stratified sampling allocates review effort proportional to risk. Payment processing documentation has regulatory implications warranting full review. Public data queries affect external users and deserve moderate scrutiny. Internal tooling has the lowest blast radius and can tolerate the lightest review. This achieves thorough coverage of critical content within a manageable review budget.
- **C** (incorrect): Completely skipping review for 120 endpoints risks undetected errors in public-facing documentation. Even low-risk internal tooling docs should have some sample review to catch systematic generation issues that might affect all categories.
- **D** (incorrect): LLM self-reported confidence is poorly calibrated. Claude Code may report high confidence on pages with subtle factual errors (e.g., incorrect parameter types, wrong default values) because the generated text is fluent and internally consistent.

</details>

---

### Q250 (q-5-6-008) — single-choice

**Task statement:** 5.6 information-provenance / structured-provenance · **Difficulty:** application · scenario: s9

**A docs team has Claude Code generate architecture guides by synthesising source code, inline comments, commit messages, and ADRs. After several edits, the guides no longer indicate which statements came from which source. A developer later questions whether a specific architectural constraint in a guide is still valid. What approach preserves source attribution?**

　 **A.** Instruct Claude Code to add footnotes to the generated documentation citing the original source for each statement

✅ **[CORRECT]** **B.** Maintain structured provenance metadata that maps each claim to its source file, line number, and retrieval date.

　 **C.** Keep all original source files unchanged in a reference directory so developers can manually trace any claim back to its origin

　 **D.** Version-control the documentation and use git blame to trace each line back to the commit that created it

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Structured provenance metadata survives editing because it is stored as data fields (e.g., JSON or YAML frontmatter) separate from the prose. When a developer questions a claim, they can trace it to the exact source file and line number. The retrieval date indicates whether the source was current when the documentation was generated.

**Option breakdown:**

- **A** (incorrect): Prose footnotes are fragile — they are lost or degraded during subsequent editing passes, summarisation, or reformatting. The team has already experienced this problem through 'several iterations of editing.'
- **B** (correct): Structured provenance metadata survives editing because it is stored as data fields (e.g., JSON or YAML frontmatter) separate from the prose. When a developer questions a claim, they can trace it to the exact source file and line number. The retrieval date indicates whether the source was current when the documentation was generated.
- **C** (incorrect): Preserving source files without explicit mappings forces developers to manually search through potentially hundreds of files to verify a single claim. This is not scalable and does not indicate which specific source informed which specific documentation statement.
- **D** (incorrect): git blame traces authorship of documentation lines to commits, not to the source material that informed those lines. A commit message might say 'update architecture guide' without indicating that a specific statement came from ADR-047 or a comment in auth-service/src/middleware.ts.

</details>

---

### Q251 (q-5-4-009) — single-choice

**Task statement:** 5.4 codebase-exploration / scratchpad · **Difficulty:** application · scenario: s9

**A docs team asks Claude Code to audit documentation coverage across a 500,000-line codebase. After reading 30 files via the Read tool, the conversation is approaching the context limit and earlier tool results will be summarised away by auto-compaction. The agent still needs that earlier information to complete the audit. What is the best strategy?**

　 **A.** Increase the context window size so that all 30+ file contents can be held simultaneously without trimming

✅ **[CORRECT]** **B.** Have the agent write structured findings to a scratchpad after each file, then read it for the final audit.

　 **C.** Process all files in a single Read tool call by passing a glob pattern, so the results arrive in one untrimmed block

　 **D.** Run /compact after every 10 files to free up context space for the next batch of file reads

<details><summary><b>Answer</b>: B</summary>

**Rationale:** A scratchpad file persists on disk and can be re-read at any time, unlike in-context tool results that are trimmed as new results arrive. By extracting and recording the essential findings (not the full file contents) after each file read, the agent decouples its knowledge from context window limits. The final audit reads the compact scratchpad rather than needing all source files in context.

**Option breakdown:**

- **A** (incorrect): The context window has a fixed maximum size. A 500,000-line codebase cannot fit entirely in context regardless of configuration. Tool result trimming exists specifically because holding all file contents simultaneously is not feasible.
- **B** (correct): A scratchpad file persists on disk and can be re-read at any time, unlike in-context tool results that are trimmed as new results arrive. By extracting and recording the essential findings (not the full file contents) after each file read, the agent decouples its knowledge from context window limits. The final audit reads the compact scratchpad rather than needing all source files in context.
- **C** (incorrect): The Read tool reads individual files, not glob patterns. Even if multiple files could be read at once, a single massive result block would itself be trimmed or would consume the entire context budget, preventing the agent from reasoning about the results.
- **D** (incorrect): /compact summarises the conversation, which may discard the specific findings from earlier file reads. The problem is preserving information, not just freeing space. Compacting without first persisting findings to disk loses the very data the audit needs.

</details>

---

### Q252 (q-5-5-008) — single-choice

**Task statement:** 5.5 human-review-calibration / human-review-criticality · **Difficulty:** recall · scenario: s9

**A documentation team uses Claude Code to generate runbooks for incident response procedures. The generated runbooks include specific command sequences and escalation paths. Why is human review especially critical for this type of generated documentation?**

　 **A.** Because Claude Code cannot execute bash commands, so it cannot verify the commands it documents

✅ **[CORRECT]** **B.** Runbooks are executed under incident pressure, where a wrong command could worsen an outage, and fluent LLM output can hide subtle errors.

　 **C.** Because Claude Code does not have access to production systems and therefore generates runbooks based on outdated development environment configurations

　 **D.** Because runbooks require formatting that Claude Code cannot produce, such as flowcharts and decision trees

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Runbooks have an unusually high blast radius: they are followed during stressful incidents when operators may not critically evaluate each step. An incorrect command (e.g., wrong database connection string, incorrect rollback procedure) could escalate an incident. LLM-generated instructions appear authoritative and well-structured, making subtle errors harder to spot without expert review.

**Option breakdown:**

- **A** (incorrect): Claude Code can execute bash commands via the Bash tool. However, the ability to run commands does not mean the generated runbook procedures are safe, complete, or appropriate for production incident response.
- **B** (correct): Runbooks have an unusually high blast radius: they are followed during stressful incidents when operators may not critically evaluate each step. An incorrect command (e.g., wrong database connection string, incorrect rollback procedure) could escalate an incident. LLM-generated instructions appear authoritative and well-structured, making subtle errors harder to spot without expert review.
- **C** (incorrect): The question is about why human review is critical, not about Claude Code's system access. Even if Claude Code had production access, human review would still be essential because generated procedures could be logically incorrect or operationally dangerous.
- **D** (incorrect): Claude Code can produce Markdown-based documentation including structured decision trees. The formatting capability is not the reason human review is critical — the risk of factually incorrect procedures under incident pressure is.

</details>

---

### Q253 (q-5-6-009) — single-choice

**Task statement:** 5.6 information-provenance / structured-provenance · **Difficulty:** scenario-analysis · scenario: s9

**A docs team has Claude Code synthesise an API reference guide from source across 50 modules. The guide states 'the authentication service supports OAuth2, SAML, and API key authentication' with no indication of which source files informed this. Six months later, after a major refactor, the team needs to verify whether the statement is still accurate. What is the core provenance failure and how should it be prevented?**

　 **A.** The failure is that the guide was not version-controlled. Storing it in git would allow the team to trace the statement back to the commit that generated it

✅ **[CORRECT]** **B.** Loss of claim-to-source traceability during synthesis. Each claim should carry structured provenance linking it to specific source files and retrieval timestamps.

　 **C.** The failure is that Claude Code hallucinated the authentication methods. The team should run a separate verification pass to confirm each claim against the source code

　 **D.** The failure is that the documentation was generated in a single pass. Processing modules incrementally with human review after each module would catch inaccuracies before synthesis

<details><summary><b>Answer</b>: B</summary>

**Rationale:** Without claim-to-source mappings, the team must re-audit the entire codebase to verify a single statement. Structured provenance (source file, line range, retrieval date) makes verification targeted: check whether auth-service/src/providers/ still contains OAuth2, SAML, and API key implementations. The retrieval timestamp signals when the claim was last verified.

**Option breakdown:**

- **A** (incorrect): Version control tracks when documentation was written, not which source code files informed a specific claim. Knowing that the statement was generated on a certain date does not help the team identify which files to re-check after refactoring.
- **B** (correct): Without claim-to-source mappings, the team must re-audit the entire codebase to verify a single statement. Structured provenance (source file, line range, retrieval date) makes verification targeted: check whether auth-service/src/providers/ still contains OAuth2, SAML, and API key implementations. The retrieval timestamp signals when the claim was last verified.
- **C** (incorrect): The question does not indicate the claim was hallucinated — it may have been accurate when generated. The problem is that six months later, the team has no way to efficiently verify or update the claim because they cannot trace it back to specific source files.
- **D** (incorrect): Incremental review improves generation-time accuracy but does not solve the six-months-later verification problem. Without provenance metadata linking claims to sources, the team still cannot efficiently determine which files to re-check after refactoring.

</details>

---

### Q254 (q-5-2-006) — single-choice

**Task statement:** 5.2 escalation-ambiguity / policy-gap · **Difficulty:** application · scenario: s1

**A customer asks a support agent to match a lower price advertised by a competitor. The agent's policy documents cover price adjustments for the company's own site changes in detail, but say nothing about competitor price matching. The request is clear, the customer is calm, and the agent has all the account access it needs. What should the agent do?**

　 **A.** Apply the own-site price adjustment policy by analogy, since it is the closest documented rule

✅ **[CORRECT]** **B.** Escalate to a human, because policy is silent on this specific request

　 **C.** Decline the request, because nothing in policy authorises competitor price matching

　 **D.** Ask the customer for evidence of the competitor's price before deciding how to proceed

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The guide's 5.2 escalation triggers are customer requests for a human, inability to progress, and policy exceptions or gaps — not case complexity. When policy is silent on the specific request, the agent escalates rather than improvising a rule, using competitor price matching versus own-site adjustments as the canonical example.

**Option breakdown:**

- **A** (incorrect): Reasoning by analogy invents policy the company never set. Own-site adjustments and competitor matching have different commercial implications, and an agent that improvises across that gap creates commitments no one authorised.
- **B** (correct): A policy gap is one of the valid escalation triggers: when policy is ambiguous or silent on the customer's specific request, the agent cannot know the company's intended answer, however simple the case looks. Competitor price matching when policy only addresses own-site adjustments is the guide's own example.
- **C** (incorrect): Silence is not a documented refusal. Declining invents a negative policy just as surely as approving invents a positive one; the company may well want to match the price and keep the customer.
- **D** (incorrect): Gathering evidence does not close the policy gap: with proof in hand the agent still has no rule saying whether matching is allowed. Clarifying questions resolve ambiguous requests, not missing policy.

</details>

---

### Q255 (q-5-4-011) — single-choice

**Task statement:** 5.4 codebase-exploration / crash-recovery · **Difficulty:** application · scenario: s3

**A coordinator spawns four Claude Code subagents to explore a large codebase overnight: one maps the data layer, one traces API routes, one audits tests, one catalogues dependencies. Three hours in, the machine restarts. On rerun, the coordinator starts every exploration again from zero. What design change lets a restarted run continue from where the crash left off?**

　 **A.** Resume the coordinator's previous session so the conversation history is restored

✅ **[CORRECT]** **B.** Have each agent export structured state to a manifest the coordinator loads on resume

　 **C.** Run the four explorations sequentially in one session so all findings stay in a single context

　 **D.** Wrap each subagent in automatic retries so transient failures cannot end the run

<details><summary><b>Answer</b>: B</summary>

**Rationale:** The guide's 5.4 bullets name structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume and injects it into agent prompts. Session resumption, single-context serialisation, and retries all leave the findings inside process memory that a crash destroys.

**Option breakdown:**

- **A** (incorrect): Session resumption restores the coordinator's own conversation, not the subagents' accumulated findings: their contexts were separate and are gone. The coordinator would still have to re-run the explorations to regain that knowledge.
- **B** (correct): Structured state exports are the crash-recovery pattern: each agent persists its findings to a known location as it progresses, so after a failure the coordinator loads the manifest, sees what is complete, and seeds the remaining agents with prior findings instead of starting from zero.
- **C** (incorrect): Serialising the work gives up parallelism and pushes every verbose discovery into one context window, and a crash still loses the lot: an in-memory context is not durable state, however it is arranged.
- **D** (incorrect): Retries help an agent survive a failed tool call; they do nothing for a machine restart that kills the whole run. Recovery needs durable state that outlives the process, not more attempts within it.

</details>

---

### Q256 (q-5-2-007) — multiple-response (select 3)

**Task statement:** 5.2 escalation-ambiguity / escalation-triggers · **Difficulty:** recall · scenario: s1

_Select 3 options._

**Which conditions are valid triggers for escalating a support conversation to a human agent? (Select 3)**

　 **A.** The customer's messages show negative sentiment.

✅ **[CORRECT]** **B.** The customer explicitly asks for a human.

✅ **[CORRECT]** **C.** Policy is silent or ambiguous on the customer's specific request.

　 **D.** The agent's self-reported confidence drops below a threshold.

✅ **[CORRECT]** **E.** The agent cannot make meaningful progress on the case.

<details><summary><b>Answer</b>: B, C, E</summary>

**Rationale:** The guide's valid triggers are explicit customer requests, policy gaps or exceptions, and inability to make meaningful progress; sentiment and self-reported confidence are named as unreliable proxies.

**Option breakdown:**

- **A** (incorrect): Sentiment is an unreliable proxy for case complexity; the agent acknowledges frustration while offering resolution when the issue is within its capability.
- **B** (correct): Explicit requests are honoured immediately, without first attempting the investigation.
- **C** (correct): A policy gap means the agent would be improvising a rule, which is a defined escalation trigger.
- **D** (incorrect): Self-reported confidence scores are an unreliable proxy for actual complexity, so they make a poor escalation trigger.
- **E** (correct): Inability to make meaningful progress is the third valid trigger the guide names.

</details>

---

### Q257 (q-5-5-009) — multiple-response (select 3)

**Task statement:** 5.5 human-review-calibration / stratified-sampling · **Difficulty:** application · scenario: s6

_Select 3 options._

**Your extraction pipeline reports 97% aggregate accuracy, and you want to automate high-confidence extractions. Which safeguards should be in place before you reduce human review? (Select 3)**

✅ **[CORRECT]** **A.** Calibrate field-level confidence thresholds against a labelled validation set.

　 **B.** Rely on the aggregate accuracy figure once it has held steady for a full quarter.

✅ **[CORRECT]** **C.** Verify accuracy separately by document type and field segment, not just in aggregate.

✅ **[CORRECT]** **D.** Keep stratified random samples of high-confidence extractions under review to measure error rates and catch novel patterns.

　 **E.** Expand the review team until every extraction can be checked by hand.

<details><summary><b>Answer</b>: A, C, D</summary>

**Rationale:** Before automating high-confidence extractions the guide requires per-segment validation, calibrated field-level confidence, and stratified sampling as an ongoing error-rate check.

**Option breakdown:**

- **A** (correct): Confidence scores only route review attention correctly once they are calibrated on labelled data.
- **B** (incorrect): Stability of the aggregate number does not reveal per-segment weaknesses, which is the risk the guide highlights.
- **C** (correct): A strong aggregate figure can mask poor performance on specific document types or fields.
- **D** (correct): Stratified sampling is the guide's mechanism for ongoing measurement after automation.
- **E** (incorrect): Reviewing everything ignores the point of calibration: routing limited reviewer capacity to low-confidence and ambiguous cases.

</details>

---

