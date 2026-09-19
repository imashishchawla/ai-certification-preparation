---
title: "20 Canonical Anti-patterns"
meta: "20 canonical wrong-answer patterns"
tags: ["practice", "questions"]
---
# 20 Anti-Patterns for the CCA-F Exam

Source: claudearchitectcertification.com/exam-guide/anti-patterns
(Pages from the downloadable 12-page exam guide at /downloads/cca-f-exam-guide.pdf)

Exam distractors are almost always anti-patterns dressed up to look correct. Spot the anti-pattern and you eliminate two or three wrong answers. Eight are critical, ten common, two edge cases.

## D1 · Agentic Architecture (27%) — 5 anti-patterns

**AP-LOOP-01 — Critical — Parsing natural language for loop termination**
- Wrong call: Pattern-matching on "I'm done" / "task complete" to exit a loop. The model's narration is descriptive, not authoritative.
- Right call: Check `stop_reason` — `tool_use` means run tool and continue; `end_turn` means finished. Read the field, don't infer from prose.

**AP-LOOP-02 — Critical — Arbitrary iteration caps as the primary stopping rule**
- Wrong call: `max_iterations=10` as the main exit. Legit long tasks get cut; broken loops still burn budget to the cap.
- Right call: Let `stop_reason` drive the loop; the cap is a safety net. If you hit it regularly, the prompt/tool surface is the problem.

**AP-MULTI-01 — Common — Subagents inherit the full parent conversation**
- Wrong call: Forwarding all parent context to every subagent — burns tokens, contaminates reasoning, breaks isolation.
- Right call: Pass only the task brief plus narrow inputs. Isolation is the reason to use a subagent.

**AP-MULTI-02 — Common — Sentiment-based escalation routing**
- Wrong call: Escalating when the user "sounds frustrated". Sentiment ≠ complexity.
- Right call: Escalate on complexity, policy gaps, low retrieval coverage, explicit request for human, tool failure on retry.

**AP-MULTI-03 — Common — Self-reported confidence as escalation signal**
- Wrong call: Asking "how confident are you?" and routing on it — uncalibrated and reflexively high.
- Right call: Programmatic checks — missing required fields, coverage below threshold, ≥2 tool retries, policy hooks fired.

## D2 · Tool Design + Integration (18%) — 4 anti-patterns

**AP-TOOL-01 — Critical — 18+ tools registered on a single agent**
- Wrong call: Long tool lists degrade selection; model confuses similarly-named tools.
- Right call: 4–5 tools per agent; orthogonal capabilities go to subagents with their own 4–5 tools.

**AP-TOOL-02 — Critical — Generic error messages ("Operation failed")**
- Wrong call: `{error: 'failed'}` gives no signal to retry/switch/escalate. The model guesses.
- Right call: Structured errors — `isError`, category, `isRetryable`, `retryAfterMs`, context.

**AP-TOOL-03 — Common — Silently returning empty results as success**
- Wrong call: Search returns `[]` for both "no matches" and "auth expired".
- Right call: Distinguish "access failed" from "genuinely empty". Failures surface as categorised errors.

**AP-MCP-01 — Edge — Mixing project and user MCP configurations**
- Wrong call: Same servers in `.mcp.json` and `~/.claude.json`.
- Right call: Project MCP in `.mcp.json`; user scope for personal tooling. User scope never fires in CI.

## D3 · Claude Code Configuration & Workflows (20%) — 4 anti-patterns

**AP-CC-01 — Critical — Prompt-based enforcement for business rules**
- Wrong call: "Never refund over $500" in system prompt — probabilistic.
- Right call: `PreToolUse` hooks for deterministic enforcement. Deterministic, auditable.

**AP-CC-02 — Common — Ignoring the CLAUDE.md hierarchy**
- Wrong call: Project rules hardcoded in user scope or ad-hoc prompts.
- Right call: CLAUDE.md at repo root; `.claude/rules/` for topics. User → project → directory, with `@import`.

**AP-CC-03 — Common — Slash commands with allowed-tools: '*'**
- Wrong call: All tools by default; prompt injection in a PR description triggers `Bash(rm -rf .)`.
- Right call: Explicit `allowed-tools` per command; add Bash sparingly.

**AP-CC-04 — Common — Same-session self-review of generated code**
- Wrong call: The session that wrote code rationalises its own choices.
- Right call: Generator and reviewer in isolated sessions.

## D4 · Prompt Engineering (20%) — 4 anti-patterns

**AP-PROMPT-01 — Critical — Vague instructions ("be careful")**
- Wrong call: Soft instructions leave compliance to intuition.
- Right call: Explicit criteria with concrete decision rules — "amount > $500 or currency ≠ USD → REQUIRES_REVIEW with {amount, currency, reason}".

**AP-PROMPT-02 — Common — Few-shot examples omitted on ambiguous tasks**
- Wrong call: Instruction text alone for classification/extraction.
- Right call: 2–4 few-shot examples (typical, edge, negative).

**AP-PROMPT-03 — Critical — JSON output with no schema validation or retry**
- Wrong call: "Return JSON" and parse the first response.
- Right call: `tool_use` with schema + validation-retry loop. 2–3 retries catch >99%.

**AP-PROMPT-04 — Edge — `tool_choice = 'auto'` when only one tool is correct**
- Wrong call: Model occasionally narrates in text instead of calling the tool.
- Right call: `tool_choice = 'any'` or force the specific tool.

## D5 · Context + Reliability (15%) — 3 anti-patterns

**AP-CTX-01 — Critical — Progressive summarisation losing case facts**
- Wrong call: Order numbers, plan tier, prior decisions summarised into prose and lost.
- Right call: Pinned case-facts block at the top of context; summarise only narration.

**AP-CTX-02 — Common — Aggregate accuracy masking per-document failures**
- Wrong call: "94% extraction accuracy" hides failure on the 10% of invoices that are 100% of dollar value.
- Right call: Stratified metrics per type, field, confidence band.

**AP-CTX-03 — Common — Context degradation in long-running sessions**
- Wrong call: Hours without checkpointing; early details fade, contradictions compound.
- Right call: Periodic compaction, scratchpad files, recovery manifests.