# Weekly metrics reporting plan

Version 2.1 · 2026-09-30 · Implementation in `scripts/weekly-report.mjs`, `scripts/send-weekly-email.mjs`, and `.github/workflows/weekly-report.yml`. Live delivery requires the GitHub email settings below and the workflow to run on `main`.

## Outcome

Once a week, publish one consistent snapshot showing what the platform contained last week, what it contains this week, and what changed. Generate three views from the same saved report data:

1. **Full report:** GitHub Actions step summary with up to five weeks of history and item-level changes.
2. **Email:** A compact, data-first digest with up to five weeks of history.
3. **README:** The latest two weeks, a short change summary, and newly added sources.

An email and README update must still be produced when all net changes are zero. A failed curation, build, audit, or deployment must be labeled clearly; it must not be reported as a successful live update.

## Metric definitions and display order

| Order | Metric | Measurement |
| ---: | --- | --- |
| 1 | Questions | Published browser question pool, per exam and total. CCA-F currently publishes reviewed ready questions; other exams require released status. Do not count unpublished candidates as active questions. |
| 2 | Markdown documents | Markdown files under content/, including section indexes and planned-track pages. Label this as a file count rather than claiming every file is a curriculum lesson. |
| 3 | Rendered Pages | HTML files in a clean, audited Hugo build that is eligible for deployment. |
| 4 | PDF & Other documents | Learner-facing downloadable files under static/assets/ with extensions PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, or EPUB. Exclude Markdown, HTML, robots.txt, and cached source-index TXT files. Show a PDF versus other breakdown. |

The current local baseline is 1,130 published questions, 114 Markdown files, 128 rendered HTML files, and 8 downloadable files (8 PDF, 0 other). These are current workspace observations, not a verified prior-week comparison.

**Storage:** Show exact byte totals converted to MiB for the published site build, with a nested downloadable-files subtotal. The nested subtotal is already included in the site total; never add the two rows. Measure after the browser question artifacts are generated and the build passes audit. Use a fresh destination or clean it before measuring, so stale files do not inflate the result. Local preview sizes vary with ongoing content edits and are not recorded weekly snapshots. These figures do not represent bandwidth or a hosting quota.

## Week and history rules

- Use one canonical reporting calendar: ISO Monday–Sunday weeks in Asia/Kolkata. Store both local week start/end dates and the exact UTC measurement timestamp.
- The first successful run establishes a baseline. Show previous week and deltas as “Baseline unavailable” until a verified prior snapshot exists. Do not seed historical numbers from examples.
- Starting with reporting week 3, every displayed week label includes its date range: “W42 · 12–18 Oct”. Retain date ranges in later reports.
- The full report and email display all available reporting weeks up to five. From week 6 onward, show only the most recent five. The README displays only the most recent two.
- Preserve every snapshot in the historical ledger, even when older weeks roll out of display. A missing week is shown as “No snapshot”, not silently compared with a nonadjacent week.
- The “This week” delta compares only with the immediately preceding successful weekly snapshot and is marked if that snapshot is older than one week.
- An ordinary manual curation run does not send another weekly report. A manual report retry uses the existing week key and must not send duplicate email.

## What changed

The four net counts are not enough to describe work. Build a change manifest between the previous recorded source commit and the current source commit:

- Questions: added, removed, and revised by stable question ID, grouped by exam. A +0 total can still include revisions or replacements.
- Markdown documents: added, removed, and modified paths; use learner-facing titles in the report.
- Rendered Pages: added and removed route paths. Do not assume one document always equals one page.
- PDF & Other documents: added, removed, and revised file paths, with file type.
- Sources: compare exam ID plus source ID in the approved source registry. List each newly added source with name, exam, URL, and active/inactive state. Changed URLs or metadata on an existing source are “updated sources,” not newly added sources.
- Distinguish “source added” from “source synchronized.” Do not claim an endpoint or question is new merely because it was fetched again.

The full report lists item-level changes with sensible truncation and a link to the complete manifest. The email and README show concise counts and the names of new sources. If none were added, show “New sources: None.”

## Status, consistency, and delivery

Create one immutable report payload for a week, then render the step summary, email, and README from it. Include:

- Week key and date range, measured UTC time, source commit SHA, and workflow run URL.
- Four totals, per-exam published question counts, storage bytes, and deltas.
- Added/removed/revised manifests and new/updated source entries.
- Curation, build/audit, and live deployment status, each with success/failure/unknown.
- Email delivery state: pending, sent, or failed, plus provider message ID if available.

Record the source SHA measured before any reporting commit. A reporting-only README/ledger commit must not become the source for the next week's content-change comparison.

Store every snapshot, its change manifest, and its frozen rendered report in data/weekly-ledger.json, keyed uniquely by week ID. Keep actual counts as integers and sizes as bytes; format commas and MiB only when rendering. A snapshot includes period start/end, measured UTC timestamp, source SHA, metrics, per-exam question counts, change manifests, new source IDs, and stage outcomes. Track email delivery separately from the measured content snapshot so retrying a send cannot alter the totals or message body.

Send a success email only after live deployment verification. If curation or deployment fails, send a short failure/status email with the last known good totals, the failed stage, and the workflow link; do not claim the new counts are live. Missing email configuration or a delivery error must be visible as a failed notification, not a silent successful run. Preserve the generated report so delivery can be retried without recomputing or duplicating the snapshot.

Use one configured email provider and a verified sender/recipient. Provide plain text and minimal HTML with the same data. Keep credentials in GitHub secrets. Avoid a second SMTP implementation until it is needed.

## Workflow integration

1. Normalize the weekly trigger. The current Worker has Saturday and Sunday UTC cron entries 24 hours apart, while its guard lasts 23 hours; that does not enforce once-per-week behavior. Use a week-key guard aligned to the reporting calendar.
2. Complete curation and commit source changes. Build the site with Hugo, generate browser artifacts, run the existing audits, and verify deployment.
3. Generate the weekly snapshot from the measured source SHA. Compare it with the prior verified snapshot. Produce the change manifest and one canonical report payload.
4. Update the history ledger and the README section bounded by WEEKLY-METRICS:START and WEEKLY-METRICS:END markers. Fail if markers are missing or duplicated; preserve all manual README content.
5. Write the full report to GitHub Actions step summary. Send the email once per week, record delivery status, and expose a retry that does not alter metrics.
6. If curation has no content changes, still build/measure or verify the existing artifact, publish a zero-change report, and send the scheduled email.

The existing curation workflow does not build Hugo; the deployment workflow does. Reporting must use the audited deployment artifact or reproduce its exact build sequence. The reporting commit and explicit deploy dispatch order must be designed so README/ledger changes cannot race with curation pushes.

### Implementation files

| File | Responsibility |
| --- | --- |
| scripts/weekly-report.mjs | Count from a clean build, compare with the prior snapshot, produce one report payload and change manifest, update ledger and README, render text/HTML/step-summary outputs. Support a dry run with no writes or email. |
| data/weekly-ledger.json | Persistent weekly snapshots; all weeks retained, one entry per week ID. No invented historical entries. |
| .github/workflows/weekly-report.yml | Once-weekly orchestration after curation/deployment status is known; manual retry path, write permissions limited to the update step, and a visible failed-notification outcome. |
| README.md | One sentinel-bounded section showing only the latest two weeks. |

Choose and configure one email transport during implementation. Keep recipient and sender configuration outside the report payload, and record the provider response or failure with the workflow run.

### Activation and operation

- In GitHub repository settings, add secrets `RESEND_API_KEY` and `REPORT_EMAIL_TO`, and variable `REPORT_EMAIL_FROM` with an address verified in Resend. Multiple recipients may be comma-separated. The workflow fails visibly if any setting is absent.
- The Worker cron is configured for Sunday 12:00 UTC (Sunday 17:30 IST), so curation belongs to the reporting week that ends that evening and deployment has time to finish before Monday's email. Deploy the updated Worker configuration for its single weekly schedule and ISO-week R2 guard to take effect.
- The report workflow runs Monday 03:00 UTC (08:30 IST). It requires successful curation in the last 36 hours, a successful compatible Pages deployment, live-site verification, and a fresh audited build. It does not publish a snapshot if those checks fail.
- Preview locally after a clean Hugo build and browser artifact generation with `npm run report:weekly:preview`. The generated summary, email payload, and JSON snapshot are written under the system temporary directory; README and ledger are untouched.
- For a delivery retry, dispatch **Weekly Platform Report** manually with `retry_email: true` and a `week_date` inside the original reporting week. A sent report is skipped. An uncertain provider outcome requires checking Resend before retrying.
- The first production run creates a real baseline. No example history is inserted into `data/weekly-ledger.json`.

## Preview: full report in GitHub Actions

The numbers below are **illustrative layout examples, not historical measurements**.

### Weekly platform report · W42 (12–18 Oct 2026)

Status: Published · Measured 19 Oct 2026, 01:15 IST · Source commit: example-sha · Run: example-link

| Metric | W40 · 28 Sep–4 Oct | W41 · 5–11 Oct | W42 · 12–18 Oct | This week |
| --- | ---: | ---: | ---: | ---: |
| Questions | 1,130 | 1,130 | 1,145 | +15 |
| Markdown documents | 100 | 114 | 119 | +5 |
| Rendered Pages | 116 | 128 | 133 | +5 |
| PDF & Other documents | 8 | 8 | 9 | +1 |

| Storage | W41 | W42 | This week |
| --- | ---: | ---: | ---: |
| Published site | 24.69 MiB | 25.10 MiB | +0.41 MiB |
| Included PDF & Other documents | 9.42 MiB | 9.70 MiB | +0.28 MiB |

| Exam | W41 questions | W42 questions | This week |
| --- | ---: | ---: | ---: |
| CCA-F | 1,130 | 1,130 | 0 |
| Terraform Associate | 0 | 15 | +15 |

**What changed**

| Type | Added | Removed | Revised / detail |
| --- | ---: | ---: | --- |
| Questions | 15 | 0 | 3 revised |
| Markdown documents | 5 | 0 | 2 revised |
| Rendered Pages | 5 | 0 | Routes listed in change manifest |
| PDF & Other documents | 1 PDF | 0 | 0 revised |
| New sources | 1 | — | Example Source Name · Terraform Associate · source URL |
| Updated sources | 0 | — | None |

Checks: Curation passed · Build/audit passed · Live deployment verified · Email sent.

## Preview: email

Subject: Weekly update · W42 (12–18 Oct) · +15 questions, +5 documents

Weekly update · W42 (12–18 Oct) · Published

| Metric | W40 · 28 Sep–4 Oct | W41 · 5–11 Oct | W42 · 12–18 Oct | This week |
| --- | ---: | ---: | ---: | ---: |
| Questions | 1,130 | 1,130 | 1,145 | +15 |
| Markdown documents | 100 | 114 | 119 | +5 |
| Rendered Pages | 116 | 128 | 133 | +5 |
| PDF & Other documents | 8 | 8 | 9 | +1 |
| Published site size | — | 24.69 MiB | 25.10 MiB | +0.41 MiB |

**What changed**

- Questions: +15 Terraform Associate; 3 revised. CCA-F: 1,130 unchanged.
- Content: 5 documents and 5 pages added; 2 documents revised.
- Files: 1 PDF added.
- New sources: Example Source Name · Terraform Associate · source URL.
- Checks: Build/audit passed · Live deployment verified.

Measured 19 Oct, 01:15 IST · Source commit: example-sha · README: example-link · Run: example-link

The email has no promotional banner or long introduction. It shows at most five week columns; after week 5, the oldest displayed week rolls off. If the current week has no additions, show zeros and “New sources: None.” The email body should be useful without opening a link.

## Preview: README

The README contains only the latest two weeks and a smaller change summary:

<!-- WEEKLY-METRICS:START -->
### Weekly platform update · W42 (12–18 Oct 2026)

| Metric | W41 · 5–11 Oct | W42 · 12–18 Oct | Change |
| --- | ---: | ---: | ---: |
| Questions | 1,130 | 1,145 | +15 |
| Markdown documents | 114 | 119 | +5 |
| Rendered Pages | 128 | 133 | +5 |
| PDF & Other documents | 8 | 9 | +1 |

Site size: 25.10 MiB (+0.41 MiB); includes 9.70 MiB of downloadable files.

**What changed:** Terraform Associate +15 questions; 5 documents, 5 pages, and 1 PDF added; 2 documents revised.
**New sources:** Example Source Name · Terraform Associate · source URL.
**Status:** Published and verified · Measured 19 Oct, 01:15 IST · Source commit: example-sha · Report run: example-link.
<!-- WEEKLY-METRICS:END -->

These README markers are shown for format only. The implementation must add exactly one marker pair to the real README and update only the content between them.

## Acceptance checks

- Verify first run, week 2, week 3 dated labels, week 5, and week 6 rolling display; ledger history remains intact.
- Verify zero change, additions and removals that net to zero, revised content with unchanged counts, new sources, and an added inactive source.
- Verify per-exam published question rules and PDF/other file filtering.
- Verify clean build size equals the deployed artifact size, with no storage double counting.
- Verify missing prior snapshot, skipped week, duplicate trigger, manual retry, missing README markers, and concurrent push handling.
- Verify failure email wording after curation/build/deploy failure; verify email delivery failure and retry without duplicate sends.
- Verify README, email, and step summary render from identical frozen report data.
