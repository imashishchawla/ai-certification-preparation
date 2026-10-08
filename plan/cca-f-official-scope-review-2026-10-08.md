# CCAR-F official scope review — 2026-10-08

> This records the first scope-review snapshot (1,135 published). The later [format and source review](cca-f-deep-format-research-2026-10-08.md) added six original scenario items and made 204 short items study-only; current counts are 1,141 published and 937 mock eligible.

## Authority and decision rule

The target is **Claude Certified Architect — Foundations (CCAR-F)**. Use the [Anthropic Partner Academy exam page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) and this repository's [July 2026 v1.0 exam guide](../static/assets/cca-f/pdfs/claude-architect-foundations-study-guide.pdf). The guide has 30 task statements, 12 official sample questions, and explicit in-scope and out-of-scope lists. Anthropic's [certification FAQ](https://anthropic-partners.skilljar.com/page/faq-certifications) says the exam guide is authoritative for exam scope. The current exam page and v1.0 guide describe both multiple-choice and multiple-response items.

The 40-page file named `official-exam-guide-foundations-v1.pdf` is actually marked **v0.1, February 2025** inside the document and describes an older single-response format. The site's study-materials page now points to the correct 39-page July 2026 v1.0 guide and labels the older PDF as an archive.

For each question, the release decision should require: (1) an explicit task-statement mapping, (2) a complete, self-contained prompt and plausible choices, (3) a checked answer key and explanation, and (4) no equivalent published question. A scenario mentioning an out-of-scope technology does not itself fail: the *knowledge needed to answer* controls the scope decision. For example, image analysis in a scenario can still test an in-scope coordinator handoff.

## Current action

Of 1,217 CCA-F source records, **82 are now `quarantined`** with `reviewStatus: needs-review`, `mockEligible: false`, and a `qualityReview` reason. **1,135 remain published**. No record was deleted.

| Category | Count | Decision |
| --- | ---: | --- |
| Duplicate copies | 56 | Keep the richer `cca-f-prep-*` copy in 51 pairs and the clean `cca-f-associate-*` copy in five pairs. See [the full pair comparison](question-bank-audit-2026-10-08.md#full-duplicate-pair-comparison). |
| Unusable choices | 6 | Keep quarantined until four real choices and a meaningful explanation can be recovered and verified. |
| Scope or answer-key exclusions | 20 | See the case-by-case findings below. |

The question loader publishes only `ready` or `released` records. The legacy static JSON copy also now contains only the 1,135 published records. `scripts/question-validation.mjs` rejects a flagged question if it becomes active again, rejects active letter-placeholder choices and duplicate normalized prompts, and checks that quarantined records are not mock eligible. `npm run validate` checks the static copy against the published source records. `scripts/publish-all-questions.mjs` now skips quarantined and rejected records.

## Scope or answer-key exclusions

| ID | Why excluded | Guide basis |
| --- | --- | --- |
| `cca-f-prep-089` | Asks for detailed cache-hit diagnosis after a model upgrade. The keyed explanation says a prompt edit is the likely cause; Anthropic's [cache diagnostics](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics) also identifies `model_changed` as a direct cache-miss cause. | Prompt caching implementation detail exceeds the guide's high-level allowance. |
| `cca-f-cca-015`, `cca-f-cca-077` | Ask when to enable extended thinking mode. | No corresponding task statement in the 30-task blueprint. |
| `cca-f-cca-176` | Asks for the MCP resource subscription feature used to push background-job updates. | Resource subscription protocol details have no mapped task statement. |
| `cca-f-cca-204` | Recalls specific JetBrains plugin features. | No IDE-plugin task statement. |
| `cca-f-cca-267`, `cca-f-cca-278` | Ask for numeric temperature settings for creative or factual tasks. The latter conflates low temperature with factual accuracy; Anthropic notes that even temperature zero is [not fully deterministic](https://platform.claude.com/docs/en/about-claude/glossary). | No numeric sampling-parameter task statement; these also age with model changes. |
| `cca-f-cca-277` | Keys the three-backtick code-fence opener as a stop sequence to end a code block; a custom sequence stops generation when encountered, including at the opening fence. | Custom `stop_sequences` use is not in the blueprint; see the [Messages API reference](https://platform.claude.com/docs/en/api/messages/create). |
| `cca-f-cca-283` | Asks when to use 20+ examples rather than a few examples. | Guide task 4.2 tests targeted few-shot examples, not many-shot selection. |
| `cca-f-cca-331` | Asks a generic chain-of-thought prompting question. | No corresponding task statement. |
| `cca-f-cca-339` | Asks how to make marketing copy less qualified. | Marketing-copy style is not an Architect Foundations task statement. |
| `cca-f-cca-352` | Makes Claude input/output price differences the tested fact. | API pricing calculations are explicitly out of scope. |
| `cca-f-cca-353` | Tests RAG chunking, hybrid search, and reranking mechanics. | Embedding/vector database implementation details are explicitly out of scope; no retrieval-pipeline task statement. |
| `cca-f-cca-374` | Keys a four-hour batch submission interval, but the offered six-hour interval also meets the stated 30-hour SLA if processing takes 24 hours. | Ambiguous answer key; batch-window arithmetic is not the guide's task 4.5 decision focus. |
| `cca-f-cca-394` | Tests shared versus per-user cache architecture. Its answer says user-specific blocks cannot be cached, although repeat requests from the same user may reuse a stable prefix. | Prompt caching implementation detail exceeds the guide's high-level allowance. |
| `cca-f-cca-400` | Asks about cloud deployment and data residency. The keyed answer does not establish that documents stay within the question's stated infrastructure. | Specific cloud-provider configurations are explicitly out of scope. |
| `cca-f-community-d2-005`, `cca-f-community-d4-004`, `cca-f-community-d5-007` | Test migration behavior of specific Claude model versions, including thinking-block and parameter changes. These are useful developer documentation topics, but not CCAR-F task statements. | Model-specific migration mechanics exceed tasks 2.3, 4.3, and 5.1. |
| `cca-f-certyiq-ccar-p-093` | Asks why an MCP server fails only on its first launch after operating-system permission dialogs. | First-launch hosting/setup detail has no mapped task statement. |

## Questions to review next

These remain published because their main answer may be in scope. Review them against a specific task statement and the current official docs before deciding whether to retain or rewrite:

| IDs | Review question |
| --- | --- |
| `cca-f-cca-103`, `cca-f-cca-351`, `cca-f-cca-385`, `cca-f-deficit-037` | Model routing/version choices may fit the Academy's broad architect description, but the v1.0 task list does not explicitly test model lineup or deployment rollout. |
| `cca-f-guide-053`, `cca-f-guide-054`, `cca-f-guide-059` | Image analysis is only scenario context; confirm the answer exclusively tests in-scope delegation and tool scoping. |
| `cca-f-cca-093` | Cost profiling may be an architectural tradeoff, but performance benchmarking metrics are excluded. |
| `cca-f-cca-279` | Many-shot examples are context; confirm the answer tests the in-scope context budget rather than many-shot tuning. |

The 1,135 active questions passed structural validation and the targeted exclusion checks. This is **not** a claim that every answer has been independently fact-checked or mapped to one of the 30 guide tasks. A complete item-by-item editorial review should record the task statement (for example `4.3`), source evidence, reviewer, and review date for each question before calling the full bank verified.

**Exam-format gap:** all active CCA-F records currently have a single answer, and both practice and mock interfaces render radio buttons. The July 2026 v1.0 guide and current Academy page allow multiple-response items. The 12 guide samples are single-answer examples, so the guide does not provide a ready-made multi-response pool. Support multi-response rendering and exact-set scoring, then author and independently review original multi-response items mapped to the same task statements. Do not invent second correct options for existing single-answer questions.

## Ongoing release gate

1. Treat the July 2026 v1.0 guide's 30 task statements and 12 official sample items as the calibration set. Record the task statement for every active question.
2. Require two reviewers for answer-key disputes or out-of-scope decisions. Compare explanations with official Anthropic documentation, then record the decision and citation on the question.
3. Keep quarantined records out of practice and mock pools; repair and re-review individual records before restoring `ready`.
4. Run `npm run validate` and `node --test scripts/question-quality.test.mjs` on every question-bank change. Rebuild browser artifacts and verify that published counts match the source bank.
5. Review exam-guide version and product-doc changes on a schedule; reopen questions whose answers depend on model-specific behavior.
