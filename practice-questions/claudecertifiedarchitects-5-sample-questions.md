# CCA Foundations Study Plan with 5 Worked Sample Questions

Source: claudecertifiedarchitects.com/blog/cca-foundations-exam-guide-2026
Independent prep platform - not affiliated with Anthropic.

## Exam facts (from this source)

- 60 questions, MCQ + multiple-response (each states how many to select)
- 120 minutes (2 min/question)
- 720/1000 scaled, domain-weighted
- Valid 12 months; fee $125 USD

## Domains and weights

| Domain | Weight | Est. questions |
|---|---|---|
| 1. Agentic Architecture | 27% | ~16 |
| 2. Claude Code Configuration | 20% | ~12 |
| 3. Prompt Engineering | 20% | ~12 |
| 4. Tool Design & MCP | 18% | ~11 |
| 5. Context Management | 15% | ~9 |

## 5 sample questions

### Q1 — Agentic Architecture
An orchestrator spawns four subagents in parallel to process sections of a large document. One hits a permission error and halts. Correct response from the orchestrator?

- A. Reassign the section to a successful subagent
- B. Have the failed subagent write its error into shared context
- C. **Surface the partial failure to the user, return successful results, request clarification before retrying** ✔
- D. Grant the subagent broader permissions and re-run

**Why C:** A permission error isn't transient; retrying unchanged fails again. Widening permissions self-grants capability. Reassigning retries a failing error. Letting the failed subagent write to shared context bypasses the coordinator, which owns error handling in hub-and-spoke.

### Q2 — Claude Code Configuration
Allow npm test and npm run build without confirmation, but require approval for all other Bash. Applies to every dev who clones the repo. Where to configure?

- A. Global `~/.claude/settings.json` allowedTools
- B. **Project `.claude/settings.json` allowedTools, committed** ✔
- C. `CLAUDE.md` natural-language instruction
- D. Project `.claude/settings.local.json` allowedTools

**Why B:** Project-level committed settings = tool permissions for all contributors. Global applies to every project on the machine. CLAUDE.md is behavioural guidance, not enforced. settings.local.json is personal, must not be committed.

### Q3 — Prompt Engineering
A support system prompt has a clear persona, detailed instructions, rich context, but no worked examples. Responses vary noticeably in tone and length across sessions. Most likely root cause?

- A. Persona too broad — narrow it
- B. **Without concrete examples, no calibration anchor for tone/length/format** ✔
- C. Instructions too long — model ignores guidance
- D. Context conflicts with persona — shorten it

**Why B:** Few-shot examples are the behavioural anchor. Without them Claude interpolates from pre-training, producing variance.

### Q4 — Tool Design & MCP
Two tools `get_order_status` and `get_order_shipping_info` query the same table and are almost always needed together. Claude sometimes calls only one. Most effective fix?

- A. Rename tools more distinctively
- B. **Consolidate into one `get_order_details` tool returning both** ✔
- C. System-prompt note to always call both
- D. Shorten descriptions to reduce tokens

**Why B:** Match tool granularity to how data is used. No coordination problem remains. A is marginal, C is probabilistic not structural, D makes selection harder.

### Q5 — Context Management
Long-running agent task near context limit with ~15% remaining; needs 3 more tool calls. Best strategy to preserve continuity?

- A. Clear entire history and restart fresh
- B. **Summarise completed steps into a compact state block and continue** ✔
- C. Increase `max_tokens`
- D. Return context-limit error, restart from scratch

**Why B:** Conversation compaction preserves state. Clearing history discards all state; max_tokens controls output length, not input context; erroring is premature.

## Suggested timelines

**7-day sprint:** Days 1-2 read official exam guide → days 3-5 40-50 questions/day in weight order → day 6 full timed 60-Q simulation → day 7 review two weakest domains only, rest the night before.

**14-day plan:** Week 1 cover domains in weight order, 20-30 Q/domain. Week 2 two full timed simulations spaced 3 days apart; final 24h review personal notes only.