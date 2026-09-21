---
title: "Exam Patterns, Cheat Sheet & The Calm Method"
description: "Core architectural decision rules, 21 golden patterns, distractor elimination heuristics, and 24 scenario practice questions for CCA-F."
date: 2026-09-21
tags: ["study-guide", "exam-patterns", "cheat-sheet", "calm-method", "cca-f"]
weight: 5
---

# Claude Certified Architect – Foundations
## Exam Patterns, Cheat Sheet & The Calm Method

> **Read this first.**  
> What follows is built from official Anthropic exam guide summaries and scenario-based certification architectural patterns. The patterns and questions are **practical architectural frameworks and original practice**, designed to test judgment and root-cause decision making. Sites that promise "real exam questions" are selling dumps: skip them. They break exam rules, and this exam tests judgment, so memorised answers will not help.  
> Always treat the **official exam guide** as the final word on scope.

**Reported format:** 60 scenario-based questions, 120 minutes, multiple-choice and multiple-response, pass mark 720 / 1000 (scaled), delivered through Pearson VUE.

---

## 1. What the Exam Really Tests

It does **not** test whether you memorised documentation. It drops you into a production situation (a support agent, a research pipeline, a CI reviewer, a data-extraction job) and asks: **what is the right architectural decision here?**

The five domains and their weights:

| Domain | Weight |
|---|---|
| 1. Agentic architecture & orchestration | 27% |
| 2. Claude Code configuration & workflows | 20% |
| 3. Prompt engineering & structured output | 20% |
| 4. Tool design & MCP integration | 18% |
| 5. Context management & reliability | ≈15% (the remainder) |

Reported scenarios include a **customer support resolution agent**, a **multi-agent research system**, **Claude Code in CI**, and **structured data extraction**. Expect a random subset on test day, so study them all.

---

## 2. The One Idea Behind Almost Every Answer

> **The best answer is the one that fixes the root cause, deterministically, with the smallest sensible change, and respects the constraint in the scenario.**

Unpack that:

- **Root cause, not symptom:** "Add a retry" for a problem that is really bad tool descriptions is a symptom fix.
- **Deterministic beats probabilistic:** If a rule must always hold, enforce it in code. A prompt only makes it likely.
- **Smallest sensible change:** The exam rewards a targeted fix over building new infrastructure.
- **Respect the constraint:** Is a human waiting? Is money involved? Is it overnight? The scenario always tells you.

---

## 3. The Golden Rules (Memorise These)

| # | If the scenario says… | Choose… |
|---|---|---|
| 1 | A rule must **never** be broken (refund limit, identity check, compliance) | Enforce in **code**: a hook or a check inside the tool. Not a stronger prompt. |
| 2 | How does the agent loop know when to continue? | The API's **stop_reason**: `tool_use` → run tools and loop, `end_turn` → stop. Not text matching. An iteration cap is only a safety net. |
| 3 | A subagent "doesn't know" what another found | Subagents start with **isolated context**. Pass what they need explicitly in the task prompt. |
| 4 | Independent subtasks | Run in **parallel**. Dependent steps run **in order**. |
| 5 | Final report is missing a whole subtopic | The **coordinator's decomposition** was too narrow. It should check coverage and re-delegate gaps. |
| 6 | Agent picks the wrong tool | Fix **tool descriptions** first (purpose, inputs, when to use vs similar tools). |
| 7 | One agent has too many tools | **Split into specialised subagents** with small toolsets. |
| 8 | A tool fails | Return a **structured error**: category, retryable or not, clear message. Never an empty "success". |
| 9 | Need guaranteed JSON | **Tool use with a JSON schema**. Schema = structure, not truth: add semantic checks too. |
| 10 | Field might be missing from the source | Make it **nullable/optional**. Required fields make the model invent values. |
| 11 | Validation fails and retry keeps failing | Retry fixes **format** slips, not **missing information**. |
| 12 | Too many false positives / vague output | **Explicit criteria** (report X, skip Y) + **examples**. "Be conservative" and confidence thresholds are weak. |
| 13 | Bulk work, nobody waiting, cost matters | **Message Batches API** (about half price, async, up to 24 hours). |
| 14 | A person or a merge is waiting | **Synchronous** API. Not batches. |
| 15 | Standards for the whole team | **Project-level CLAUDE.md** in the repo. Personal preferences go in `~/.claude/CLAUDE.md`. |
| 16 | Big, ambiguous, multi-file change | **Plan mode**. Small, clear change: direct execution. |
| 17 | Claude Code in a pipeline | **`claude -p`** with `--output-format json`. |
| 18 | Long conversation loses IDs, amounts, dates | Keep a persistent structured **"case facts" block** in every turn. |
| 19 | When to escalate to a human | Customer **asks** for one, **policy gap**, or agent **can't progress**. Not sentiment. Not self-reported confidence. |
| 20 | Two sources disagree | Show **both with sources**. Never pick silently. |
| 21 | A subagent fails | Report **what was tried, partial results, options**. Never a silent empty result. |

---

## 4. How Wrong Answers Are Built (Spot the Distractors)

Distractors are designed to look sensible. Learn their shapes:

| Distractor shape | Why it's usually wrong |
|---|---|
| **"Strengthen the prompt"** (capitals, repetition, "always…") for a hard requirement | Prompts are probabilistic. Hard rules need enforcement in code. |
| **"Use a bigger model / higher temperature / more max_tokens"** for an architecture problem | Rarely the root cause. |
| **"Add more tools / more agents"** | More tools usually worsens selection. Fix descriptions or split the toolset. |
| **"Let the model decide / rate its own confidence"** for a critical decision | Self-reported confidence is unreliable. |
| **Treats a symptom** (retry, truncate, apologise) | The cause is elsewhere (descriptions, decomposition, schema). |
| **Over-engineered** (new database, new service, custom framework) | The exam prefers the targeted fix. |
| **Absolutes** ("always", "never", "only") | Sometimes right, but check twice. |
| **Right idea, wrong place** (e.g. sets team standards in a personal file) | Read *where* each option puts the fix. |
| **Ignores the constraint** (batch for a blocking check; sync loop for an overnight job) | The constraint in the stem decides. |

---

## 5. The Calm Method: Use It on Every Question

Panic makes smart people pick the flashy answer. A fixed routine keeps you steady.

- **Step 1: Read the last line first.** What exactly is asked? Watch for **BEST**, **FIRST**, **MOST effective**, and **"select TWO"** (each item says how many to choose).
- **Step 2: Read the scenario for constraints.** Underline mentally: *Is someone waiting? Is money or compliance involved? Is it bulk/overnight? Is it a team or one person?*
- **Step 3: Name the root cause in five words** *before* reading options. ("Rule not enforced in code." "Descriptions overlap." "Field forced to be required.") This stops options from steering you.
- **Step 4: Eliminate.** Cross out options that are prompt-only for a hard rule, symptom-only, over-engineered, or ignore the constraint. Usually two remain.
- **Step 5: Choose between the last two** using this priority order:
  1. Enforced in code beats prompted.
  2. Root cause beats symptom.
  3. Smaller change beats bigger.
  4. Matches the scenario's constraint.
- **Step 6: Commit and move.** Don't relitigate. If you're stuck after ~2 minutes, flag it and go on.

### Time Plan (60 Questions, 120 Minutes)
- About **2 minutes per question** on average. Aim for **~1.5 minutes** on the first pass.
- First pass: answer what you can, flag the rest.
- Keep **the last 15–20 minutes** for flagged questions.
- Only change an answer if you can **name a concrete reason**, not a feeling.

---

## 6. Domain Cheat Sheets

### Domain 1: Agentic Architecture & Orchestration (27%)
- **Loop:** call → if `stop_reason == "tool_use"`, execute, append `tool_result`, call again → `end_turn` stops. Other reasons exist (e.g. hitting max tokens); handle them, don't ignore them.
- **Enforcement:** ordering rules ("verify identity *before* refund") and limits belong in code: a hook, or the tool refuses without prerequisites.
- **Hub-and-spoke:** the coordinator plans, delegates, merges. Subagents have **isolated** context.
- **Delegating well:** include goal, constraints, prior findings, and expected output format.
- **Coverage:** coordinator checks the plan against the full topic *and* the results against the plan.
- **Parallel** for independent work; **sequential** when step 2 needs step 1's output.
- **Handoff:** structured summary (customer ID, issue, actions taken, what's needed).

### Domain 2: Claude Code Configuration & Workflows (20%)
- **CLAUDE.md levels:** user (`~/.claude/CLAUDE.md`, personal), project (in repo, shared through version control), plus subdirectory files for local rules.
- **Commands:** project `.claude/commands/` (shared), personal `~/.claude/commands/`.
- **Plan mode vs direct:** complexity and ambiguity decide.
- **CI:** `claude -p "…" --output-format json`, no interaction.
- **Independent review:** a fresh session reviewing code is more likely to catch problems than the session that wrote it.
- **MCP config:** project-level `.mcp.json`; secrets via environment variables, never committed.

### Domain 3: Prompt Engineering & Structured Output (20%)
- **Explicit criteria + examples** beat adjectives ("careful", "conservative").
- **Few-shot** for ambiguous cases and format consistency.
- **Tool use + JSON schema** for reliable structure. Then validate meaning (totals add up, dates make sense).
- **Nullable fields** and **"other" + detail** in enums prevent forced guesses.
- **Retry loop:** feed back the *specific* error. Works for format errors, not for absent information.
- **Batches vs sync:** blocking → sync; bulk/overnight → batches.
- **Multi-pass review:** per-file passes, then a cross-file integration pass. Avoids uneven depth on big changes.
- **Restoring trust:** if one category produces mostly false positives, temporarily turn that category off while you fix its prompt.

### Domain 4: Tool Design & MCP Integration (18%)
- **Descriptions are the interface.** State purpose, inputs, boundaries, and how it differs from neighbours.
- **Small toolsets per agent** (a handful of tools each).
- **Errors:** category (transient / validation / permission…), retryable flag, message. Empty result ≠ failure.
- **Retry only what can succeed on retry** (timeouts, temporary unavailability). Not permission errors or invalid parameters.
- **`tool_choice`:** `auto` (model decides), `any` (must call some tool), or a specific tool (forces that tool: best when you must always get structured output).
- **MCP has three primitives:** tools (actions), resources (readable data / catalogs), prompts (templates).

### Domain 5: Context Management & Reliability (≈15%)
- **Case facts block:** IDs, amounts, dates, statuses stay verbatim in every turn; summarise the *chat*, not the facts.
- **Trim tool output** to the fields that matter.
- **Position:** critical info at the start or end of long inputs.
- **Scratchpad / notes files** so a fresh session can resume long work.
- **Escalation triggers:** explicit request, policy gap, no progress. Not mood, not the model's confidence score.
- **Provenance:** keep source attribution through synthesis. Surface conflicts.
- **Failure propagation:** partial results and what was attempted, never a silent empty result.

---

## 7. Scenario Playbooks

- **Customer support agent:** Agent loop and `stop_reason` · code-enforced policy (identity check, refund limits) · structured errors · escalation triggers · case facts · handoff summary.
- **Multi-agent research pipeline:** Coordinator/subagent design · isolated context → explicit prompts · parallelism · coverage gaps · provenance · conflicting sources · subagent failure reporting.
- **Claude Code for CI:** `claude -p` + JSON · explicit review criteria · false-positive reduction · multi-pass review · batches vs sync · independent review session · project-level CLAUDE.md.
- **Structured data extraction:** Tool use + schema · nullable fields · "other" enums · semantic validation · retry loops and their limits · batches for bulk · `tool_choice` to force the extraction tool.

---

## 8. Practice Questions

**Q1.** *(Support agent)* An agent sometimes calls `process_refund` before `verify_customer`. The prompt already says to verify first. What is the best fix?  
- **A.** Rewrite the prompt with the rule in capitals and repeat it.  
- **B.** Make `process_refund` reject any call unless verification succeeded earlier in this session.  
- **C.** Add three examples of correct ordering to the prompt.  
- **D.** Increase the model's temperature so it explores more sequences.  

**Q2.** *(Support agent)* A tool returns the single word "Error" on every failure. The agent retries the same failing call repeatedly. What should you change first?  
- **A.** Return structured errors with a category and a retryable flag, and add a loop cap that escalates to a human.  
- **B.** Switch to a larger model.  
- **C.** Remove the tool and let the model answer from memory.  
- **D.** Add a second tool that does the same job.  

**Q3.** *(Research)* A coordinator gives each subagent the entire conversation so far. Costs are high and subagents wander off task. What is the best change?  
- **A.** Pass each subagent only a focused task prompt containing the goal, constraints, and the findings it needs.  
- **B.** Give subagents an even longer history.  
- **C.** Remove the coordinator and let subagents talk freely.  
- **D.** Reduce max_tokens.  

**Q4.** *(Research, select TWO)* Which two actions best reduce the chance of missing subtopics in the final report?  
- **A.** The coordinator checks its task breakdown against the full scope of the topic before delegating.  
- **B.** The coordinator reviews the returned results and re-delegates any gaps.  
- **C.** Raise the temperature on the synthesis step.  
- **D.** Give every subagent every tool.  
- **E.** Shorten the final report.  

**Q5.** *(Research)* Step 2 of a pipeline needs the output of step 1. A teammate suggests running both in parallel to save time. What is right?  
- **A.** Run them sequentially because step 2 depends on step 1's result.  
- **B.** Run in parallel; the model will guess step 1's output.  
- **C.** Merge them into one prompt with no tools.  
- **D.** Run step 2 twice for safety.  

**Q6.** *(Support)* When a case moves to a human agent, what should the handoff contain?  
- **A.** A structured summary: customer ID, the issue, actions already taken, and what is still needed.  
- **B.** The raw transcript only, so nothing is lost.  
- **C.** Only the customer's last message.  
- **D.** A sentiment score.  

**Q7.** *(CI)* Your team wants shared conventions, and each developer also has personal editor preferences. Where do they go?  
- **A.** Team conventions in the project's CLAUDE.md in the repo; personal preferences in `~/.claude/CLAUDE.md`.  
- **B.** Everything in each developer's personal file.  
- **C.** Everything in the project file, including personal preferences.  
- **D.** In the CI logs.  

**Q8.** *(CI)* Claude Code generates a change in one session and reviews it in the same session. Reviews rarely find problems. What is the best improvement?  
- **A.** Review in a separate, independent session with explicit review criteria.  
- **B.** Ask the same session to "try harder".  
- **C.** Skip review to save time.  
- **D.** Lower the temperature to zero.  

**Q9.** *(Claude Code)* You must fix a clear bug with a stack trace pointing to one function. Which approach fits?  
- **A.** Direct execution: the change is small and clear.  
- **B.** Plan mode with a written multi-phase design.  
- **C.** Batches API.  
- **D.** Split it across three subagents.  

**Q10.** *(Claude Code)* A team repo needs an MCP server that requires an API token. How should it be configured?  
- **A.** In the project's `.mcp.json`, with the token supplied through an environment variable.  
- **B.** Token written directly into `.mcp.json` and committed.  
- **C.** Token pasted into CLAUDE.md.  
- **D.** Token shared in team chat each morning.  

**Q11.** *(CI)* Your automated reviewer flags many trivial style issues and developers are ignoring it. What is best?  
- **A.** State which categories to report (bugs, security) and which to skip (style), with examples.  
- **B.** Add "be conservative" to the prompt.  
- **C.** Only report findings the model rates above 90% confidence.  
- **D.** Increase the review length limit.  

**Q12.** *(Extraction)* Some contracts contain no termination date, and the model keeps inventing one. What should you change?  
- **A.** Make `termination_date` nullable/optional so "not stated" is a valid output.  
- **B.** Make it required with a default of today's date.  
- **C.** Add "never guess" in capitals.  
- **D.** Retry until a date appears.  

**Q13.** *(Extraction)* Validation fails because the invoice number is missing from the source document. Three retries fail the same way. Why?  
- **A.** Retries fix format errors; they can't create information that isn't in the source.  
- **B.** The retry limit is too low.  
- **C.** The model needs a higher temperature.  
- **D.** The schema should use more nesting.  

**Q14.** *(CI/Extraction)* Which workload is the best fit for the Message Batches API?  
- **A.** A weekly technical-debt report on the whole codebase, needed by Monday.  
- **B.** A pre-merge check developers are waiting on.  
- **C.** A live chat reply to a customer.  
- **D.** An agent loop that needs each tool result immediately.  

**Q15.** *(CI)* A 14-file pull request gets deep feedback on some files and shallow feedback on others, plus contradictory comments. What is the best redesign?  
- **A.** Review each file in its own pass, then run a separate pass for cross-file issues.  
- **B.** Put all 14 files in one prompt and ask for more detail.  
- **C.** Review only the first five files.  
- **D.** Increase max_tokens only.  

**Q16.** *(Tools)* `analyze_content` and `analyze_document` have near-identical descriptions and the agent confuses them. What is the best fix?  
- **A.** Rewrite both descriptions to state purpose, inputs, and when to use each; merge them if they truly overlap.  
- **B.** Add a third similar tool.  
- **C.** Force `tool_choice` to `any`.  
- **D.** Tell the model to guess.  

**Q17.** *(Tools, select TWO)* Which two failures are worth an automatic retry?  
- **A.** A temporary network timeout.  
- **B.** A "service temporarily unavailable" response.  
- **C.** A permission-denied error.  
- **D.** An invalid-parameter error caused by a malformed argument.  
- **E.** A "customer not found" result for an ID that doesn't exist.  

**Q18.** *(Extraction)* Every request must return data through a specific extraction schema, with no chatty text. How do you set `tool_choice`?  
- **A.** Force that specific tool.  
- **B.** `auto`, and hope the model chooses it.  
- **C.** Omit tools and ask for JSON in plain text.  
- **D.** `any` with twenty unrelated tools.  

**Q19.** *(MCP)* You want the agent to see a read-only catalog of available report templates without exploring by tool calls. What fits best?  
- **A.** Expose the catalog as an MCP resource.  
- **B.** Write one tool per template.  
- **C.** Paste the catalog into every prompt by hand.  
- **D.** Ask the model to remember it.  

**Q20.** *(Context)* After a long chat is summarised, the agent forgets the order number and refund amount. What is best?  
- **A.** Keep a structured "case facts" block with those values in every turn.  
- **B.** Summarise more aggressively.  
- **C.** Ask the customer to repeat themselves each turn.  
- **D.** Reduce the number of tools.  

**Q21.** *(Context)* A lookup tool returns 40 fields, but the task needs 5. Context fills quickly. What do you do?  
- **A.** Trim the result to the needed fields before adding it to context.  
- **B.** Add all 40 fields to every turn.  
- **C.** Increase the context window setting and change nothing else.  
- **D.** Ask the model to ignore the extra fields.  

**Q22.** *(Support)* Which situation is the strongest reason for an agent to escalate to a human?  
- **A.** The customer explicitly asks for a human agent.  
- **B.** The customer's message sounds annoyed.  
- **C.** The model self-reports 60% confidence.  
- **D.** The conversation has lasted more than five minutes.  

**Q23.** *(Research)* A search subagent's source says revenue was $4.1B; a filing analysed by another subagent says $3.9B. What should the report do?  
- **A.** Show both figures, name each source, and note the discrepancy.  
- **B.** Use the larger number.  
- **C.** Average them.  
- **D.** Omit revenue.  

**Q24.** *(Research)* A subagent's search times out. What should it return?  
- **A.** What it attempted, any partial results, and suggested alternatives, flagged as a failure.  
- **B.** An empty list marked successful.  
- **C.** A confident answer from memory.  
- **D.** Nothing.  

---

## 9. Answer Key with Architectural Rationales

| Q | Answer | Architectural Rationale |
|---|:---:|---|
| **1** | **B** | Ordering rules must be enforced in the tool or a hook. A prompt only makes it likely (A, C). Temperature is irrelevant (D). |
| **2** | **A** | Structured errors let the agent decide; a cap plus escalation stops infinite loops. The others don't touch the cause. |
| **3** | **A** | Subagents need focused, explicit context, not everything. |
| **4** | **A, B** | Check coverage before *and* after delegating. Temperature, tools and shorter reports don't add coverage. |
| **5** | **A** | Dependent steps run in order. Parallel is for independent work. |
| **6** | **A** | A structured summary lets the human continue without asking the customer to repeat. Raw transcripts are noisy; sentiment is not a summary. |
| **7** | **A** | Shared standards in the repo; personal preferences in the home directory. |
| **8** | **A** | An independent session with explicit criteria is better at catching problems than self-review in the generating session. |
| **9** | **A** | Small, clear change: direct execution. Plan mode is for big or ambiguous work. |
| **10** | **A** | Shared config in `.mcp.json`, secrets via environment variables, never committed. |
| **11** | **A** | Explicit categories and examples. "Be conservative" and confidence thresholds are weak, and length isn't the problem. |
| **12** | **A** | Required fields force invention. Allow null. |
| **13** | **A** | Retry fixes format, not missing information. |
| **14** | **A** | Non-blocking and time-tolerant suits batches. B, C, D all have someone or something waiting. |
| **15** | **A** | Per-file passes plus an integration pass gives consistent depth and catches cross-file issues. |
| **16** | **A** | Descriptions are the main selection mechanism; fix them first, and merge truly duplicate tools. |
| **17** | **A, B** | Transient failures may succeed on retry. Permission, invalid input, and "not found" won't change by retrying. |
| **18** | **A** | Forcing the specific tool guarantees the structured path. |
| **19** | **A** | MCP resources expose readable data and catalogs. |
| **20** | **A** | Persistent structured facts survive summarisation. |
| **21** | **A** | Trim to what matters before it enters context. |
| **22** | **A** | Explicit request is a clear trigger. Mood and self-reported confidence are weak. |
| **23** | **A** | Keep provenance and surface the conflict. |
| **24** | **A** | The coordinator must know it failed and what was tried. An empty "success" hides the problem. |

---

## 10. Seven-Day Study Plan

| Day | Focus Area | Action Items |
|---|---|---|
| **1** | **Official Guide & Scope** | Read the official exam guide once, slowly. Note the 5 domains and task statements. |
| **2** | **Agent Loops & Stop Reason** | Study the Claude API and tool use. Focus on the agent loop and `stop_reason`. |
| **3** | **Claude Code & MCP** | Practise CLAUDE.md levels, commands, plan mode, and `claude -p`. |
| **4** | **Prompting & Structured Output** | Schemas, nullable fields, few-shot, validation and retry loops, batches API. |
| **5** | **Context & Reliability** | Case facts block, escalation triggers, provenance. Reread questions 20–24 above. |
| **6** | **Timed Mock Exam** | Take a full 60-question timed practice test (120 minutes). Review misses by naming the rule. |
| **7** | **Final Review** | Light review of section 3 Golden Rules only. Sleep well. |

---

## 11. Exam-Day Checklist

- Check the Pearson VUE rules (ID, room setup, allowed items) **the day before**. Fix problems early.
- On every question apply the routine: **last line → constraints → root cause → eliminate → choose → move on.**
- Flag and skip anything taking over 2 minutes.
- In the final review pass, change an answer only when you can state the concrete reason in one sentence.
- Remember: you are being asked, again and again, the same thing: *Which option fixes the real problem, reliably, without unnecessary complexity?*
