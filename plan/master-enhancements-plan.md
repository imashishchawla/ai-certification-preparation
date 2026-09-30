# Master enhancement plan: question quality, mock exam, and weekly reporting

Version 4.0 · 2026-09-30

## Current status and scope

| Module | Status | Outcome |
| --- | --- | --- |
| A · Question prompt cleanup | Planned | Remove parser metadata from 385 published CCA-F prompts while retaining useful structured metadata. |
| B · Exam-inspired mock test | Planned | Give learners a focused 60-question practice experience with review controls and accessible navigation. |
| C · Weekly platform report | Implemented; first verified run pending | Use the existing reporter, history ledger, README section, and scheduled email workflow. |

Modules A and B are the implementation work remaining in this plan. Module C needs operational verification and email configuration, rather than a second reporting engine. The detailed reporting specification is in [weekly-metrics-reporting-plan.md](weekly-metrics-reporting-plan.md); the earlier mock-test proposal is in [mock-test-and-question-normalization-plan.md](mock-test-and-question-normalization-plan.md). This document governs where either proposal conflicts with the current repository.

## Module A · Clean questions without losing source meaning

### Verified inventory

The current `data/questions/cca-f/questions.json` has 1,130 questions. Three source-specific prompt prefixes affect **385** records:

| Source ID | Records | Prefix to remove or format |
| --- | ---: | --- |
| `claude-architect-guide-257` | 246 | Section/topic, `**Difficulty:** application`, and scenario tag. |
| `situational-scenarios-88` | 88 | `(Scenario: Name) Situation:**`. |
| `cca-prep-170-qu` | 51 | Question number, domain heading, and `[basic]`, `[intermediate]`, `[advanced]`, or `[exam]`. |

The previous plan's literal regexes matched only 0 of the 246 guide prompts and 31 of the 51 numbered prompts. The revised candidate anchors below matched 246, 88, and 51 records respectively in the current file. They are a starting contract for tests, not permission to apply a broad replacement to unrelated sources.

```js
const numbered = /^\s*\d+\s*·\s*(D[1-5])\s+([^·]+?)\s*·\s*\[(basic|intermediate|advanced|exam)\]\s*/;
const guide = /^\s*(\d+\.\d+)\s+([^/]+?)\s*\/\s*([^·]+?)\s*·\s*\*\*Difficulty:\*\*\s*([^·]+?)\s*·\s*scenario:\s*(\w+)\s*/;
const scenario = /^\(Scenario:\s*([^)]+)\)\s*Situation:\*\*\s*/;
```

### Data contract and migration

1. Reconcile `.agent/schemas/question.schema.json` with the records and the actual validator before migration. Current records and `scripts/validate-questions.mjs` use `options[].id` and full domain names such as `D1 Agentic Architecture & Orchestration`; the JSON schema currently specifies `options[].key` and a short `D1` code. Select one canonical contract and update its consumers together. Change the schema's description of `prompt` from verbatim source text to clean candidate-facing text.
2. Add optional `section`, `topic`, and `scenarioTag` fields without changing stable IDs, `sourceId`, correct answers, options, explanations, publication state, or mock eligibility. Keep the existing full domain string unless the whole browser and curation contract is deliberately migrated. Do not replace an existing difficulty value with a guessed value. The 246 guide records already have `intermediate`; preserve the raw `application` label only if a separately named source metadata field is useful.
3. Implement `scripts/clean-question-prompts.mjs` as an idempotent, source-scoped migration with a default dry run. It must print match counts, unmatched examples, a sample before/after diff, and a machine-readable change manifest. A write mode must refuse to run unless each source count and the total 385 match the reviewed expectation, or an explicitly reviewed new baseline is supplied.
4. Keep meaningful scenario context in the prompt. For example, format `(Scenario: Customer Support Agent) Situation:** ...` as `Scenario: Customer Support Agent. Situation: ...`. Strip only parser metadata; preserve the question's actual conditions, constraints, and wording.
5. Harden the source-specific code that creates these records. Check both `.agent/cert-prep-curator/extract-materials.mjs` and `scripts/normalize-questions.mjs`, plus any other adapter that regenerates the affected source IDs. A later curation or normalization run must not restore the prefixes.

### Module A acceptance

- Exactly the reviewed 385 records change on the initial migration; the script reports 246/88/51 matches and no unexpected source matches.
- Running the migration again changes zero records. Re-running the relevant extraction/normalization path does not reintroduce prefixes.
- Question count remains 1,130, IDs remain unique, and every record retains its answer, four options, explanation, and publication state. The source-specific prompt-prefix checks and `npm run validate` pass.
- Published browser question and mock artifacts are rebuilt and sampled in both practice mode and the mock test.

## Module B · Exam-inspired mock test

### Experience and naming

Use **“exam-inspired practice test”** in learner-facing copy. Pearson VUE publishes examples of Flag for Review and Review All/Incomplete/Flagged controls, which are useful design references. This site is not Pearson VUE, OnVUE, or a proctored exam; browser fullscreen does not provide exam security. The official CCA-F guide describes 60 single-answer multiple-choice questions, 120 minutes, and a passing **scaled score of 720 on a 100–1,000 scale**. It does not define 72% correct as the official passing threshold. Keep the site's 72% setting explicitly labeled **practice target** and its result as **practice pass/fail**, with no implied scaled-score conversion.

### Active test behavior

- Keep the current 60-question draw, domain quotas, 120-minute deadline, and persisted attempt. Restrict the mock pool to published, `mockEligible` questions; the current artifact builder publishes all released questions into `mock-pool.json`. Verify the draw never duplicates an ID and meets each quota when enough eligible questions exist.
- On the learner's **Start Mock Exam** click, request fullscreen and handle the returned promise. If fullscreen is unavailable or declined, continue the practice test in normal page view. Track `fullscreenchange`; show a return-to-fullscreen option after an exit without stopping or resetting the timer. The fullscreen toggle remains optional.
- Show a compact header with exam title, current question number, answered/unanswered counts, flag state, and remaining time. Show warnings below 10 and 5 minutes; the deadline remains based on the saved timestamp, not interval ticks.
- Hide domain and difficulty labels while the attempt is active, including in prompt prefixes, browser text, accessible names, review rows, and dialogs. Show the clean prompt and four choices. Answer correctness and rationale appear only after submission.
- Add Previous, Next, Review Screen, and End Exam controls. From the review screen, provide direct question jumps and Review All, Review Incomplete, and Review Flagged. Persist answers, flags, current position, and review state in the attempt; keep their behavior after refresh.
- Before a voluntary submit, display exact answered, unanswered, and flagged counts with Return and Confirm actions. At time expiry, submit once immediately and record that it was timed out; no modal may delay expiry.
- Support keyboard shortcuts only when they do not intercept typing in an input, dialog, or assistive control. Keep visible focus, labeled buttons, semantic radio groups, and a keyboard-operable review matrix. Do not trap focus on the page or depend on color alone for state.

### Results

Show raw practice score, elapsed time, practice target, and a D1–D5 breakdown. Explain that a raw practice percentage is not Anthropic's scaled exam score. Retake starts a new attempt without exposing the previous answer key in the active view.

Under **Question Review**, provide interactive filter buttons so learners can isolate and remediate their mistakes without scrolling past passing items:
- **All Questions (60)**
- **Incorrect Only (X)** — highlighted filter showing only questions where the learner's answer differed from the correct answer, with its architectural rationale.
- **Correct Only (Y)**
- Optional filter by domain chip (D1–D5).

Each reviewed question card displays: Question number, domain, difficulty, candidate choice, correct choice, and complete architectural rationale.

### Module B acceptance

- On a supported browser, Start requests fullscreen from the click. Denial, unsupported fullscreen, Escape, refresh, and return to fullscreen leave a usable exam and an accurate countdown.
- All 60 questions appear in the review matrix. Answered, unanswered, and flagged filters and counts stay correct after navigation and refresh; zero-match filters have a clear empty state.
- Active question and review views expose no domain, difficulty, correct answer, or explanation. Results reveal those details after exactly one submission.
- Results view provides interactive filtering for **All**, **Incorrect Only**, and **Correct Only** with accurate counts, enabling immediate focus on mistakes.
- Keyboard-only navigation, radio selection, flagging, review, submission dialog, and screen-reader labels work on desktop and a narrow viewport. Timer expiry and voluntary submission have distinct tested paths.
- The reviewed question bank still passes validation, the site build and audits pass, and the mock test is exercised in an actual browser.

## Module C · Operate the existing weekly report

The implementation is already in `scripts/weekly-report.mjs`, `scripts/send-weekly-email.mjs`, `.github/workflows/weekly-report.yml`, `data/weekly-ledger.json`, and the sentinel-bounded README section. Do not add `scripts/generate-weekly-report.mjs`, seed example W39/W40 entries, put email dispatch into `curate-certifications.yml`, or add an SMTP fallback as part of this plan.

The current reporter measures **published questions**, Markdown documents, rendered HTML pages, and PDF/other learner downloads, in that order. It also measures site storage and downloadable-file storage. It keeps every verified snapshot in the ledger, displays up to five weeks in the full report and email, and only two in README. Starting with the third recorded week, displayed week labels include dates. The ledger currently has **no verified weekly snapshots**; counts such as 1,130/114/128/8 are local observations, not historical week-over-week growth.

### Operational checks remaining

1. Confirm GitHub repository settings provide `RESEND_API_KEY` and `REPORT_EMAIL_TO` as secrets and a verified `REPORT_EMAIL_FROM` variable. Missing settings or provider failure must remain visible as a failed notification; do not silently report email success.
2. Observe the first scheduled curation, compatible Pages deployment, Monday report run, README update, and provider message ID. Verify that the email and README render from the same frozen snapshot and that no example history was inserted.
3. Exercise a dry run and a frozen email retry. A retry must not change the week totals or send a duplicate message. If provider outcome is uncertain, reconcile it before retrying.
4. Keep the weekly workflow separate from ordinary curation. A failed curation, build, or deployment must send a failure/status notice when email is configured and must not publish unverified live totals.

## Execution order

| Phase | Work | Gate |
| --- | --- | --- |
| 1 | Align question contract and build reviewed cleanup fixtures for all three source formats. | Counts 246/88/51, schema and browser consumers identified. |
| 2 | Run dry-run cleanup, inspect sample diffs, migrate 385 prompts, and harden regeneration paths. | Idempotent rerun, unchanged IDs/answers, validators and browser artifacts pass. |
| 3 | Implement mock exam controls and presentation in `static/js/mock-test.js` and theme CSS. | Accessible navigation, saved state, timeout, and results checks pass. |
| 4 | Run `npm run build` and browser checks on the practice page and mock test. | No broken links or rendered-page defects; no active-exam spoilers. |
| 5 | Verify Module C's first scheduled run and email configuration. | One real ledger entry, matching README/email, recorded delivery state. |

Phases 1–4 change the site. Phase 5 is operational verification of the reporting system already shipped.
