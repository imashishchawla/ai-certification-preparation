# CCAR-F recent signals and practice-category review — 2026-10-08

## Source priority

The [Anthropic certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) and [official FAQ](https://anthropic-partners.skilljar.com/page/faq-certifications) outrank forum reports. The current exam is listed as 60 questions, 120 minutes, with multiple-choice and multiple-response items. The FAQ says the old official practice exam was retired during the Pearson move; the exam guide and its samples are the current official calibration source. Our [local v1.0 guide](../static/assets/cca-f/pdfs/claude-architect-foundations-study-guide.pdf) says four of six production scenarios are used and defines the five weighted domains and 30 task statements.

## Reddit posts dated 8 August–8 October 2026

These are candidate reports or practice-site claims, **not verified exam content**. Use them to identify a product risk, then validate the change against the guide.

| Date and source | Reported signal | Confidence | Useful action |
| --- | --- | --- | --- |
| [27 Aug: second-attempt account](https://www.reddit.com/r/ClaudeAI/comments/1w04zq6/passed_ccaf_on_my_second_attempt_sharing_what/) | Candidate found conflicting answer explanations in third-party material and said the hardest part was choosing between the last two plausible answers. | Medium for the candidate's experience; low as a population estimate. | Require option-by-option rationales, a specific scenario constraint, and answer-key review before import. Do not treat paid source labels as proof of correctness. |
| [28 Aug: practice-site answer data](https://www.reddit.com/r/ClaudeCertified/comments/1w0tjsf/i_have_10513_answers_on_claude_cert_practice/) | Site owner reports 66.4% correct across 2,518 CCAR-F practice answers, with one original item answered correctly by 29.4%. They disclose a paid-tier interest. | Low for live-exam difficulty; useful as an example of measured practice-item discrimination. | If we collect consented anonymous response data, review distractors and ambiguous items by observed choice distribution rather than by an author's difficulty tag alone. |
| [1 Sep: candidate account](https://www.reddit.com/r/ClaudeAI/comments/1w4cd7w/passed_the_claude_certified_architect_foundations/) | Candidate describes four technically plausible options and a best choice based on efficiency, determinism, or maintainability. They warn that a perfect third-party mock score can indicate an easy mock. | Medium for style, consistent with official samples. | Avoid implausible distractors and do not imply our raw mock percentage predicts Anthropic's scaled score. |
| [2 Sep: multi-cert candidate](https://www.reddit.com/r/ClaudeAI/comments/1w52byg/i_cleared_all_4_claude_certification_exams_what/) | Candidate reports long scenarios and some exact Claude Code CLI, path, and CLAUDE.md configuration knowledge. | Medium for reported sitting; anecdotal. | Preserve useful syntax and path recall in drills. In mocks, ask those facts inside a concrete workflow, as the official samples do. |
| [10 Sep: exam-layout reply](https://www.reddit.com/r/ClaudeAI/comments/1wc73tf/ccarf_about_to_take_exam_how_long_are_the/) | Candidate describes four 15-question blocks, each with a shared scenario on the left; the branch and answer choices are on the right. The scenario is often longer than the individual question. | Medium for one sitting. The official guide independently confirms four of six scenarios but does not specify this exact screen layout. | Build a reviewed scenario-to-question map and then draw four coherent blocks. Do not fabricate a generic scenario to fill an empty side pane. |
| [30 Sep: mock-score question](https://www.reddit.com/r/ClaudeAI/comments/1wuiobl/about_taking_ccarf_exam/) | One reply says the real exam is harder than the mock after a candidate reports a 953 practice score. | Low; one reply. | Keep score language as practice feedback, not a pass prediction. |
| [1 Oct: three-cert candidate](https://www.reddit.com/r/ClaudeAI/comments/1wvedm2/got_3_claude_certifications_ccarf_ccarp_and_ccaof/) | Candidate says they studied all six CCAR-F scenarios equally and completed official exercises. | Medium for their preparation; not proof of coverage on every exam form. | Keep balanced scenario practice and avoid recommending users study only four contexts. |

The practical consensus is stronger than any claimed item recollection: practise identifying the decisive constraint, explain why plausible alternatives lose, and cover all six published contexts. No Reddit question or commercial “dump” was imported into the bank in this pass.

## Current practice categories

The site now displays live counts on the category buttons. For CCAR-F, the buckets are mutually exclusive:

| Button | Rule | Current count |
| --- | --- | ---: |
| All | Every published CCAR-F question | 1,138 |
| Quick Drills | 204 study-only items plus 13 `basic` items | 217 |
| Intermediate | Published, mock-eligible items tagged `intermediate` | 706 |
| Difficult | Published, mock-eligible items tagged `advanced`, `hard`, or `exam` | 215 |

Counts recalculate within a selected domain. They are **counts of our editorial tags**, not measured difficulty or a guarantee of exam similarity. In particular, the existing `exam` value mixes format with difficulty and should eventually become a separate `examStyle` field. The category counts sum to All; the old length-based filters overlapped.

| Domain | Quick Drills | Intermediate | Difficult | All |
| --- | ---: | ---: | ---: | ---: |
| D1 Agentic Architecture | 130 | 506 | 57 | 693 |
| D2 Tool Design & MCP | 29 | 60 | 35 | 124 |
| D3 Claude Code | 23 | 86 | 37 | 146 |
| D4 Prompt Engineering | 18 | 28 | 49 | 95 |
| D5 Context & Reliability | 17 | 26 | 37 | 80 |

This skew is a warning about tag provenance: D1 has far more questions but a much smaller share tagged Difficult than D4/D5. Do not force arbitrary target counts such as 100/200/300 by relabeling questions. Reclassify after editorial review or actual response data.

## Priority recommendation

1. Replace the random 60-question mock with four coherent scenario blocks after a human-reviewed mapping exists. The current mock is only domain weighted.
2. Add multiple-response rendering and exact-set scoring because the official format includes it. Do not invent extra correct choices on existing single-answer items.
3. Review published items without a task `section` mapping, then empirically calibrate difficulty from response data if available. Until then, show category counts but avoid claims that a category is objectively easy or hard.
