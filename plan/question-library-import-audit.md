# Local question import audit · 2026-10-01

## Result

The local inventory covered cached exam sources, published study documents, and downloadable PDFs. The scan inspected 352 files and reviewed each question-bearing file family against the canonical banks. Identical raw/published PDF copies and study-guide mirrors were counted once for extraction. The import is reproducible with `node scripts/import-document-questions.mjs` (dry run) and `--apply` (validated write).

| Exam | Before | Added to library | After | Publicly available after import |
| --- | ---: | ---: | ---: | ---: |
| CCA-F | 1,130 | 26 review candidates | 1,156 | 1,130 |
| Terraform Associate 004 | 0 | 5 official samples | 5 | 0 (onboarding) |
| Claude Associate Foundations (CCAO-F) | 0 | 20 review candidates | 20 | 0 (planned) |
| Claude Architect Professional (CCAR-P) | 0 | 18 review candidates | 18 | 0 (planned) |
| Claude Developer Foundations (CCDV-F) | 0 | 14 review candidates | 14 | 0 (planned) |

There are 1,213 questions across the five banks after import. Every added record has a registered source ID, exact local source locator, source SHA-256, answer key, and complete choices. The 26 unofficial CCA-F questions and 52 questions in the three planned Claude tracks are `pending-review` and excluded from practice and mock pools until their factual accuracy, domain mapping, and reuse status are checked. The five HashiCorp questions retain their original true/false, single-answer, or multiple-answer format and remain hidden by the Terraform onboarding gate. HashiCorp's sample page does not supply rationales, so none were invented.

## Candidate families checked

| Material | Finding | Treatment |
| --- | --- | --- |
| Existing CCA-F 170, 257, 400, scenario, associate, CertyIQ, and 60-question banks | Already represented in the 1,130-question bank. The 400-question file includes 43 multiple-response items; the 257-question file includes 10. | Retained the existing validated single-answer CCA-F contract; did not silently convert multiple-response items. |
| Three 15-question Architect Foundations mock exams | All 45 prompts matched existing questions at or above 0.85 token similarity. | No duplicate records added. |
| 80-question Architect Foundations file | All 80 prompts match existing library questions at or above 0.85 similarity. Its local copy has only placeholder choices (`A`, `B`, `C`, or `D`). | No duplicates added; existing records retain their complete choices. |
| Five worked CCA-F samples | Five complete, distinct questions. | Added as review candidates. |
| Community architecture guide and its generated PDF | 22 complete questions; one plan-mode question is a paraphrase of `cca-f-prep-047`. The PDF repeats the guide. | Added 21 distinct review candidates; skipped the paraphrase and PDF mirror. |
| HashiCorp official Terraform 004 sample page | Five complete answer-backed questions: one true/false, two single-choice, and two multiple-choice. | Added five onboarding questions with original answer sets; no invented explanations. |
| CertyIQ Associate, Professional, and Developer streams | 20 cached questions per track. Compared with existing CCA-F content and within each stream; exact/near duplicates at the 0.85 threshold were skipped (CCAO-F: 0, CCAR-P: 2, CCDV-F: 6). | Added 20 CCAO-F, 18 CCAR-P, and 14 CCDV-F records in separate banks. All have `pending-review`, `mockEligible: false`, and `D0 Pending objective mapping`; source entries are inactive until their exam contracts and review gates are ready. |
| CCA-F exam-guide PDFs | Sample questions exist, but the source pages are visibly marked “Confidential Need to Know (NTK)”. Other PDF copies repeat the same guide. | Did not copy these into another question bank. |
| Other study notes, official documentation, and PDFs | Reference prose, examples, option-like lists, or already mirrored sources, without a separate complete answer-backed question set. | No questions generated from prose. |

## Validation

- `node scripts/import-document-questions.mjs --apply`: 31 additions (26 CCA-F, 5 Terraform).
- `node scripts/import-certyiq-track-questions.mjs --apply`: 52 additions; eight duplicates skipped against existing banks or within streams.
- Re-running both importers in dry-run mode: zero new additions.
- `npm run validate`: 1,213 questions checked, zero errors.
- `node scripts/question-quality.test.mjs`: three checks passed.
- `npm run build`: 129 rendered pages audited; zero broken links; CCA-F remains at 1,130 published questions, all other banks at zero published.

The remaining work is editorial review of 78 unofficial candidates, including objective mapping for the 52 planned-track questions, source-backed explanation writing or linking for the five official Terraform examples, and completion of each planned exam contract. Their publication gates remain closed until those checks are complete. CertyIQ sources for the three planned Claude tracks are registered inactive; this avoids unintentionally adding them to unattended source sync.
