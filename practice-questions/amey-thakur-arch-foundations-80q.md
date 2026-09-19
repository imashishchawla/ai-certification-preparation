# Amey-Thakur Architect-Foundations Question Bank (80 questions)

Source: github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS


## Q1 [Agentic Architecture & Orchestration]

Your support agent resolves most tickets but sometimes loops indefinitely, re-calling lookup_order on the same order. What is the correct structural fix?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Agent loops need engineered termination: iteration budgets, repeated-call detection, and an escalation path when the agent cannot progress. Token budget (A) delays the symptom, removing a needed tool (B) breaks resolution, and temperature (D) does not bound iteration.*

## Q2 [Tool Design & MCP Integration]

process_refund currently accepts any amount. Support policy caps agent-initiated refunds at $200; larger refunds need a human. Where does that rule belong?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Hard policy limits are enforced deterministically at the tool boundary, not requested of the model. Prompt phrasing (A) and model reasoning (B) are probabilistic where the requirement is absolute, and training (C) does not constrain the agent at all.*

## Q3 [Agentic Architecture & Orchestration]

Your coordinator delegates to search, analysis, and report subagents. Final reports cite sources that do not support their claims, though each subagent behaves sensibly alone. What is the most likely architectural cause?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*In multi-agent pipelines, provenance survives only if the handoff format carries claim and source together. That failure mode produces exactly this symptom while every stage looks locally fine. Model size (B), source quality (C), and parallelism (D) do not explain correct facts paired with wrong citations.*

## Q4 [Context Management & Reliability]

The analysis subagent returns 30,000-token document dumps to the coordinator, which then fails on context limits. What is the right fix?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Context isolation is the point of subagent delegation: raw bulk stays at the edge, distilled results travel. A larger window (A) postpones the failure, silent dropping (C) loses arbitrary information, and rerunning (D) changes nothing structural.*

## Q5 [Claude Code Configuration & Workflows]

Your monorepo has frontend and backend directories with different conventions, and one team-wide rule about commit style. Where does each piece of configuration belong?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*The hierarchy exists for exactly this: shared rules at project scope, conditional conventions path-scoped so context is spent only where relevant. One root file (A) loads everything everywhere, personal files (B) diverge per engineer, and a wiki (D) never reaches the model.*

## Q6 [Claude Code Configuration & Workflows]

Your CI job runs Claude Code to review pull requests, and the pipeline must parse the results mechanically. Which invocation is correct?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Headless CI use is what -p with JSON output and a schema is for: deterministic invocation, parseable results. A human in the loop (A) is not CI, plan mode (B) is a review gate for interactive work rather than an output format, and grepping prose (C) breaks on the first wording change.*

## Q7 [Prompt Engineering & Structured Output]

The automated reviewer flags dozens of trivial style nits per pull request, and engineers have started ignoring it. Which change addresses the false-positive problem the way the blueprint suggests?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Precision comes from explicit criteria and few-shot examples that draw the boundary between signal and noise. Double-running (B) filters randomness but not systematic nit-picking, an arbitrary cap (C) drops real findings on bad days, and (D) is surrender.*

## Q8 [Prompt Engineering & Structured Output]

Invoices sometimes lack a purchase-order number, and your extraction schema must handle that honestly while catching real misses. What is the right schema design?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Schema design encodes reality: genuinely optional data is nullable, and conditional requirements are validated downstream. All-required (A) forces fabrication or failure on legitimate documents, all-optional (C) blinds you to true misses, and invention (D) is data corruption.*

## Q9 [Context Management & Reliability]

Your pipeline reports 98% field accuracy, measured on the documents the schema validated cleanly. An auditor calls the number misleading. Why?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Measuring only where the system already succeeded inflates the estimate; calibration requires a labeled sample representative of the full input stream. Hardest-only (A) biases in the opposite direction, the standard claim (B) is invented, and (D) is false.*

## Q10 [Tool Design & MCP Integration]

Your codebase-exploration agent has get_file_contents, read_source, and fetch_file tools that all read files, and it frequently picks poorly among them. What is the correct fix?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Tool selection runs on descriptions; overlapping tools with vague descriptions produce dithering. Consolidation or sharp differentiation is the documented cure. Adding overlap (A) worsens it, fine-tuning (B) is disproportionate, and randomization (C) institutionalizes the confusion.*

## Q11 [Agentic Architecture & Orchestration]

A support workflow resolves tickets by looking up an account, checking entitlement, and drafting a reply, always in that order. Which architecture is correct?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*A known, fixed sequence should be encoded rather than rediscovered on every run, which makes it cheaper, faster, and testable step by step. Runtime decisions (B, C) add nondeterminism for no gain, and one prompt (D) removes the checkpoints between steps.*

## Q12 [Agentic Architecture & Orchestration]

What is the strongest justification for splitting work across subagents?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Subagents exist to isolate context, so the case for them is contamination between concerns rather than volume. Step count (A) and sectioned output (D) suit a workflow, and delegation usually adds latency rather than removing it (C).*

## Q13 [Agentic Architecture & Orchestration]

An agent loops between two tools without converging. What is the most appropriate first control?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Non-termination is bounded by an explicit stop condition and a hard ceiling, which contains cost and makes the failure visible. More context (A) and a larger model (B) do not guarantee convergence, and removing a tool (D) may break the task.*

## Q14 [Agentic Architecture & Orchestration]

Which property most increases the operational risk of an agentic design?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Reversibility governs the cost of being wrong, which is the dominant risk in autonomous execution. Multiple models (A), structure (B), and duration (C) affect cost and complexity rather than blast radius.*

## Q15 [Agentic Architecture & Orchestration]

How should an agentic system handle a step whose result it cannot verify?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*An unverifiable result is exactly where human judgment belongs, before it is acted upon. Assuming correctness (B) and logging without stopping (D) both act on unchecked output, and agreement across runs (C) establishes consistency rather than truth.*

## Q16 [Agentic Architecture & Orchestration]

A team proposes an agent for a task where every input is well formed and every rule is known. What should the architect recommend?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Known rules over well-formed input are code, and using a model there buys nondeterminism at a price. Speculative flexibility (A), a constrained agent (C), and multiple agents (D) all keep the cost without the need.*

## Q17 [Agentic Architecture & Orchestration]

What most improves the debuggability of an agentic system in production?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*A per-step trace is what makes a nondeterministic run reconstructable after the fact. Fewer tools (A) and one model (B) simplify without explaining, and a higher ceiling (D) makes failures longer rather than clearer.*

## Q18 [Claude Code Configuration & Workflows]

Where should conventions that apply to everyone working in a repository be recorded?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Committed project memory is versioned, reviewable, and shared, which is what a team convention requires. Personal settings (A) do not propagate, and templates (B) and messages (C) are not read as working context.*

## Q19 [Claude Code Configuration & Workflows]

What distinguishes work suited to headless mode?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Headless execution suits bounded, repeatable work where no one is watching. Supervision (B) argues for interactive use, and tool count (C) and output length (D) do not determine suitability.*

## Q20 [Claude Code Configuration & Workflows]

A skill and a subagent could both address a need. What decides between them?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*The two solve different problems: a skill packages reusable procedure, a subagent isolates context. A blanket preference (A), duration (C), and existing files (D) do not address that distinction.*

## Q21 [Claude Code Configuration & Workflows]

What is the correct use of a hook in a Claude Code workflow?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Hooks run as code at fixed points, so they enforce rather than request. Instructions (A) and context (B) belong in project memory, and model choice (D) is configuration.*

## Q22 [Claude Code Configuration & Workflows]

Claude Code performs well for one engineer and inconsistently across the team. What is the most likely cause?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Context that is not committed does not travel, which produces exactly this asymmetry. Hardware (A), repository size (B), and terminal choice (C) do not explain a difference in output quality.*

## Q23 [Prompt Engineering & Structured Output]

A pipeline requires output that always validates against a schema. What is the correct approach?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*A declared schema makes the structure part of the contract rather than a request, and validation on receipt closes the loop. Prompt requests (B), downstream repair (C), and temperature (D) all leave the shape to chance.*

## Q24 [Prompt Engineering & Structured Output]

Extraction is accurate for common cases and fails on rare formats. What is the most effective response?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Rare cases fail because they are unspecified, and examples plus an explicit absent-field rule specify them. Temperature (A) adds variance, a larger model (C) is not aimed at the gap, and exhortation (D) is not a specification.*

## Q25 [Prompt Engineering & Structured Output]

What should a schema define for a field the source document may not contain?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Absence must be representable, or downstream code cannot tell a genuine gap from a failure. Silent omission (A) is ambiguous, plausible defaults (B) fabricate data, and a notes field (D) does not make the state machine-readable.*

## Q26 [Prompt Engineering & Structured Output]

Which practice most improves consistency across a long-running structured extraction job?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Consistency requires that the things that shape output are pinned and recorded, so results remain comparable and reproducible. Ordering (A) is irrelevant, the token cap (B) affects length, and duplicate runs (C) measure variance without removing it.*

## Q27 [Prompt Engineering & Structured Output]

A prompt mixes the instruction, the data, and the output format in continuous prose. What is the first improvement?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Structure lets the model tell instruction from data, which is the most common source of confusion in long prompts. Shortening (B) may remove needed detail, relocation (C) does not clarify, and emphasis (D) does not separate.*

## Q28 [Tool Design & MCP Integration]

What is the strongest indicator that a tool surface needs redesign?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Repeated wrong selection is evidence that the tools are not distinguishable from their descriptions, which is a design fault. Tool count (A), return format (C), and implementation topology (D) are not themselves problems.*

## Q29 [Tool Design & MCP Integration]

How should a tool that performs an irreversible action be designed?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Irreversibility is controlled by the surrounding system, because a prompt-level warning is a request rather than a guarantee. Extra parameters (B) and ordering (D) do not constrain authority.*

## Q30 [Tool Design & MCP Integration]

A tool returns a large payload that consumes most of the context window. What is the right change?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Tools should return task-relevant results rather than everything available, which keeps context for reasoning. A larger window (A) postpones the problem, a second call (B) adds cost and a failure point, and calling less often (C) does not change the payload.*

## Q31 [Tool Design & MCP Integration]

What belongs in a tool's description?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*The description is the model's selection guide, so it must answer purpose, applicability, and parameters. Implementation detail (B), service levels (C), and ownership (D) are irrelevant to the choice.*

## Q32 [Context Management & Reliability]

A long agentic run degrades in quality as it proceeds. What is the most likely cause?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Progressive degradation over a long run is the signature of context accumulation and drift. Versions do not change mid-run (A), low temperature (C) reduces variety rather than quality, and tool latency (D) does not affect correctness.*

## Q33 [Context Management & Reliability]

What is the right way to carry state across a compaction boundary?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Persistence must be deliberate, because compaction is lossy by design. Relying on recall (A) is unreliable, a larger window (B) only delays the boundary, and restarting (D) discards the work.*

## Q34 [Context Management & Reliability]

Which measure most improves reliability for a workflow that must not silently produce wrong output?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Reliability against silent failure requires detection and a defined response, which is what validation with a fallback provides. Model size (A), prompt length (B), and examples (C) improve the average case without catching the bad one.*

## Q35 [Context Management & Reliability]

What should be measured to know whether a production agentic system is healthy?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Health is defined by whether the system accomplishes the task and how it fails when it does not. Tokens (B), latency (C), and call counts (D) are cost and behavior signals that say nothing about correctness.*

## Q36 [Context Management & Reliability]

The agent occasionally answers billing questions using an order it looked up three turns earlier for a different customer. What is the architectural fix?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Cross-customer contamination is a context-scoping defect, not a window-size problem*

## Q37 [Tool Design & MCP Integration]

process_refund fails intermittently because the billing backend times out. What should the tool return so the agent can behave sensibly?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Structured errors with categories and retryable flags are what let an agent recover deliberately*

## Q38 [Context Management & Reliability]

Which condition should route a ticket to escalate_to_human rather than continue autonomous resolution?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Policy gaps and lack of progress are the documented escalation triggers; turn counts and order age are not*

## Q39 [Tool Design & MCP Integration]

The agent sometimes calls get_customer when it should call lookup_order. What is the most effective change?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Tool selection runs on descriptions, so differentiation is the fix for confusion between similar tools*

## Q40 [Claude Code Configuration & Workflows]

Backend conventions should apply only when backend files are touched. Where do they belong?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Path-scoped rules load conditionally, which is exactly the stated requirement*

## Q41 [Claude Code Configuration & Workflows]

When is plan mode the appropriate choice over direct execution?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Plan mode is a human review gate for approach, warranted by risk rather than universally*

## Q42 [Claude Code Configuration & Workflows]

A repeated multi-step review procedure should be available to the whole team as a single invocation. What is the right mechanism?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Repeatable team procedures belong in committed commands or skills, not prose*

## Q43 [Context Management & Reliability]

Subagents return full source documents to the coordinator, which then exceeds its context limit. What is the correct design change?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Delegation exists to keep bulk at the edge and move distilled results*

## Q44 [Context Management & Reliability]

Final reports attribute claims to the wrong sources even though each subagent is individually accurate. What is the likely cause?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Provenance survives handoffs only when the format carries claim and source together*

## Q45 [Context Management & Reliability]

A subagent fails permanently on one source. What should the coordinator receive?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Errors must propagate with enough context for the coordinator to choose a recovery path*

## Q46 [Claude Code Configuration & Workflows]

The reviewer must emit results a pipeline can parse. Which invocation is correct?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*CI requires non-interactive invocation with structured, schema-validated output*

## Q47 [Prompt Engineering & Structured Output]

Reviews flag many low-value style nits and engineers now ignore them. Which change addresses this?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Precision comes from explicit criteria and examples that draw the signal boundary*

## Q48 [Prompt Engineering & Structured Output]

Some invoices legitimately lack a delivery date. How should the schema express this?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Nullable fields record legitimate absence; required fields force fabrication or failure*

## Q49 [Prompt Engineering & Structured Output]

Which loop gives the most reliable extraction output?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Schema enforcement plus a validation-retry loop is the reliability pattern the guide describes*

## Q50 [Context Management & Reliability]

Your team reports 97% accuracy measured only on records that passed validation. Why is that number misleading?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Measuring only validated records is a biased sample; calibration needs coverage of all documents*

## Q51 [Agentic Architecture & Orchestration]

A pipeline has four steps whose order never varies and whose outputs are each checkable. What should it be?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*A known fixed order is encoded rather than rediscovered, which is cheaper and testable per step. Runtime planning (A, B) adds nondeterminism, and one prompt (D) removes the checkpoints*

## Q52 [Agentic Architecture & Orchestration]

What is the principal cost of introducing a subagent?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Delegation buys isolation and pays in context, which is why handoffs must be explicit. A subagent does not require a larger model (B), can use tools (C), and cost varies with the work (D)*

## Q53 [Agentic Architecture & Orchestration]

An autonomous step would modify production data. What does the architecture require?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Irreversible external effects need an authorisation boundary or reversibility, enforced outside the model. Capability (A), instruction (B), and retries (C) do not bound the consequence*

## Q54 [Agentic Architecture & Orchestration]

What most helps diagnose an agentic failure after the fact?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*A per-step trace reconstructs a nondeterministic run, which is what diagnosis needs. The final output (A), token totals (C), and version (D) do not show where it diverged*

## Q55 [Claude Code Configuration & Workflows]

Where should repository-wide conventions for Claude Code live?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Committed project memory is shared, versioned, and reviewed with the code. Local configuration (A) does not propagate, chat (C) is not read as context, and CI (D) covers automation rather than interactive work*

## Q56 [Claude Code Configuration & Workflows]

Which task is best suited to headless Claude Code in CI?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Headless execution suits bounded, repeatable work that runs unattended. Exploration (A), design (B), and pairing (C) all depend on a person in the loop*

## Q57 [Claude Code Configuration & Workflows]

What is a hook for?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Hooks execute as code at fixed points, which is how a guarantee is enforced. Instructions (B) and context (C) belong in project memory, and model choice (D) is configuration*

## Q58 [Prompt Engineering & Structured Output]

A pipeline needs output that always conforms to a fixed shape. What is the correct mechanism?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*A declared schema makes the shape a contract rather than a request, and validation closes the loop. Prompt requests (A), text parsing (B), and temperature (D) leave the shape to chance*

## Q59 [Prompt Engineering & Structured Output]

How should a schema handle a value the source may not contain?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Absence must be representable so a genuine gap is distinguishable from a failure. Silent omission (A) is ambiguous, a plausible default (B) fabricates, and an empty string (C) conflates absence with an empty value*

## Q60 [Prompt Engineering & Structured Output]

Extraction succeeds on typical inputs and fails on unusual ones. What is the most effective response?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*The unusual cases fail because they were never specified, and examples plus a missing-value rule specify them. Temperature (A) adds variance, model size (B) is not aimed at the gap, and exhortation (D) is not specification*

## Q61 [Tool Design & MCP Integration]

What is the clearest sign that a tool surface needs redesign rather than better prompting?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Repeated wrong selection indicates the tools are not distinguishable from their descriptions, which is a design fault. Tool count (A) and implementation topology (C) are not faults, and payload size (D) is a separate problem*

## Q62 [Tool Design & MCP Integration]

How should a tool that deletes records be constrained?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Destructive capability is bounded by the surrounding system, since a description is a request rather than a control. Extra parameters (C) and ordering (D) do not limit authority*

## Q63 [Tool Design & MCP Integration]

An MCP integration exposes an entire database through one general query tool. What is the architectural concern?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*A single unrestricted tool removes the ability to scope what the model may reach. Speed (B) and tokens (C) are secondary, and structured output (D) is achievable either way*

## Q64 [Context Management & Reliability]

Quality degrades steadily through a long agentic run. What is the most likely cause?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Progressive degradation over a long run is the signature of context accumulation. Versions do not change mid-run (A), low temperature (C) reduces variety rather than quality, and tool latency (D) does not affect correctness*

## Q65 [Context Management & Reliability]

What must happen for state to survive a compaction boundary?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Compaction is lossy, so persistence must be deliberate. Relying on recall (A) is unreliable, a larger window (B) only moves the boundary, and restarting (D) discards the work*

## Q66 [Agentic Architecture & Orchestration]

An agentic design calls the same expensive tool repeatedly with identical arguments. What does this indicate?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Repeating an identical call means the prior result is not available to the agent, which is a state problem. It is not retry behavior (A), and neither tool speed (B) nor capability (D) explains it*

## Q67 [Agentic Architecture & Orchestration]

What determines whether two lines of work belong in separate subagents?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Context isolation is the reason subagents exist. Length (B), tool difference (C), and parallelism (D) can all be handled within one context*

## Q68 [Agentic Architecture & Orchestration]

Which design most reduces the cost of a wrong autonomous decision?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Reversibility and gating bound the consequence, which is what the risk is. Capability (A), prompt length (B), and tools (C) affect the chance of error rather than its cost*

## Q69 [Claude Code Configuration & Workflows]

A CLAUDE.md has grown to several thousand lines. What is the likely effect?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Project memory is context and dilutes like any other. More is not automatically better (A), it is not free (C), and it does not speed anything up (D)*

## Q70 [Claude Code Configuration & Workflows]

What should be true of a skill before it is committed to a shared repository?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*A shared skill is justified by genuine repetition and must be reviewable like code. Length (A), authorship (C), and exhaustiveness (D) do not establish that*

## Q71 [Claude Code Configuration & Workflows]

Why is committed configuration preferable to per-developer configuration for team conventions?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Shared, reviewed, versioned context is what makes a convention hold across people and CI. Speed (A) and context size (B) are not the reason, and it can still be overridden locally (C)*

## Q72 [Prompt Engineering & Structured Output]

A schema-validated response fails validation once in every few hundred calls. What is the correct handling?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*A rare failure still needs a defined path, and silently passing invalid data is the outcome to prevent. Ignoring it (B) and disabling validation (C) do exactly that, and the token limit (D) is not the cause*

## Q73 [Prompt Engineering & Structured Output]

What is the advantage of validating structured output at the boundary rather than downstream?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Catching at the boundary contains the fault. It is not primarily a cost question (A), the schema is what makes it possible (B), and it does not change the model's accuracy (D)*

## Q74 [Prompt Engineering & Structured Output]

A structured extraction must record where in the source each value came from. What does this require?

  **(A)** A
  **(B)** B
  **(C)** C
✔ **(D)** D

**Answer: D**
*Anything the output must carry has to be part of the declared shape. Model size (A) and prompt length (B) do not create a field, and a second pass (C) is unnecessary if the schema asks for it*

## Q75 [Tool Design & MCP Integration]

Two tools do nearly the same thing with different names. What is the architectural fault?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Ambiguity at the point of selection is the fault, because the model chooses from descriptions. Code duplication (A), latency (B), and cost (D) are secondary consequences*

## Q76 [Tool Design & MCP Integration]

What should a tool do when given arguments it cannot satisfy?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*An informative error keeps the model able to adapt. A closest-guess (A) and an empty result (C) are silently wrong, and terminating (D) discards a recoverable run*

## Q77 [Tool Design & MCP Integration]

An MCP tool exposes a write operation that the use case never needs. What should happen?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Authority that is not needed should not be granted. Retaining it for possible future use (B), documenting (C), or renaming (D) all leave the capability reachable*

## Q78 [Context Management & Reliability]

What is the earliest reliable signal that context management has failed in a long run?

✔ **(A)** A
  **(B)** B
  **(C)** C
  **(D)** D

**Answer: A**
*Repetition and self-contradiction are the behavioral signature of lost state. Duration (B) and cost (C) rise for many reasons, and a tool error (D) is unrelated*

## Q79 [Context Management & Reliability]

Why is a defined success criterion necessary for a reliable agentic system?

  **(A)** A
✔ **(B)** B
  **(C)** C
  **(D)** D

**Answer: B**
*Termination and measurement both depend on a definition of done. Cost (A), prompt length (C), and platform requirements (D) are not the reason*

## Q80 [Context Management & Reliability]

A reliability requirement says wrong output must never reach the user unnoticed. What does the design need?

  **(A)** A
  **(B)** B
✔ **(C)** C
  **(D)** D

**Answer: C**
*Preventing silent error requires detection plus a response. Capability (A), examples (B), and context (D) improve the average case without catching the bad one*
