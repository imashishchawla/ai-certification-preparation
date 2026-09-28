# Terraform Associate (004) — Interactive Implementation Artifact

> **Artifact status:** Validated and synchronized on 2026-09-28  
> **Canonical detailed plan:** `plan/terraform-associate-004-plan.md`  
> **Final publisher:** GitHub Pages  
> **Agent coordinator:** Cloudflare Workers  
> **R2 policy:** Important operational JSON only  
> **Question policy:** Extract from approved sources; never generate questions  
> **Weekly runs:** Category A Sunday 00:00 and Category B Monday 00:00 Asia/Kolkata

---

## What Changed

<!-- CHANGE COMMENT: This artifact reflects the final user-approved decisions and supersedes earlier suggestions involving R2 document storage or generated questions. -->

| Changed area | Final decision | Why it changed |
|---|---|---|
| R2 | Store only release pointers, source fingerprints, run summaries, quarantine reasons, and schedule ledgers | Preserve the limited storage allowance for important operational information |
| Documents | Save validated, permitted documents in GitHub and publish them through GitHub Pages | GitHub Pages remains the public delivery platform |
| Questions | Import only questions explicitly present in approved sources | No AI-generated questions, variants, distractors, answers, or explanations |
| Schedule | Run Category A Sunday 00:00 IST and Category B Monday 00:00 IST | Distribute active exams across configurable weekly windows |
| Runtime | CCA-F: 60 minutes; Terraform: 45 minutes | Each exam gets a configurable bounded processing budget |
| Deployment | Only `deploy.yml` publishes GitHub Pages | Prevent competing or stale deployments |
| Source registry | One multi-exam JSON registry | Future certifications can use the same automated flow |
| Cloudflare trigger | Authenticated `certification-curation` repository dispatch | The current Worker event is not consumed by the current workflow |
| Public question data | Generate from canonical `data/questions/` during the Pages build | Eliminate stale `static/data/` mirrors |

---

## Approved Values

```yaml
platform:
  public_host: github-pages
  pages_url: https://imashishchawla.github.io/ai-certification-preparation/
  agent_control_plane: cloudflare-workers
  canonical_database: github

automation:
  timezone: Asia/Kolkata
  schedule_categories:
    category-a:
      local_start: "Sunday 00:00"
      cron_utc: "30 18 * * 6"
    category-b:
      local_start: "Monday 00:00"
      cron_utc: "30 18 * * 0"
  dispatch_event: certification-curation
  max_parallel_exams: 2
  default_source_timeout_seconds: 30
  question_generation_enabled: false

r2:
  enabled: true
  store_questions: false
  store_documents: false
  store_raw_sources: false
  store_secrets: false
  run_summary_retention_days: 90
  quarantine_reason_retention_days: 90
  schedule_ledger_retention_days: 35

artifacts:
  question_shard_size: 250
  generate_public_manifests: true
  track_generated_public_files_in_git: false

exams:
  cca-f:
    sync_enabled: true
    schedule_category: category-a
    timeout_minutes: 60
    max_sources_per_run: 25
    minimum_mock_questions: 60
  terraform-associate:
    version: "004"
    terraform_version_tested: "1.12"
    sync_enabled: true
    schedule_category: category-b
    timeout_minutes: 45
    max_sources_per_run: 20
    minimum_mock_questions: 60
    practice_pass_percent: 70
    practice_threshold_is_official: false
```

---

## Responsibility Map

| Component | Owns | Must not own |
|---|---|---|
| GitHub repository | Catalog, objectives, source registry, questions, documents, code, schemas | Secrets or temporary downloads |
| GitHub Actions curator | Fetch, parse, normalize, categorize, deduplicate, validate, commit | Production Pages deployment |
| GitHub Actions deploy | Generate artifacts, build Hugo, test, publish Pages | Source ingestion |
| GitHub Pages | Final public site and browser-readable artifacts | Agent coordination or private operational state |
| Cloudflare Worker | Schedule, dispatch, status API, authentication, rollback request | Large parsing jobs, Hugo builds, question storage |
| Cloudflare R2 | Small operational JSON and recovery pointers | Questions, documents, PDFs, raw sources, website, secrets |

---

## Implementation Checklist

### A. Contracts and configuration

- [ ] Add JSON Schemas for exams, sources, questions, releases, and audit summaries.
- [ ] Add automation defaults without duplicating them across Worker and workflow code.
- [ ] Extend `data/exams.toml` with status, objective path, runtime, source limits, and release gates.
- [ ] Record internal practice thresholds separately from official exam facts.
- [ ] Preserve backward compatibility for existing CCA-F scalar answers.

### B. Unified source registry

- [ ] Upgrade `.agent/cert-prep-curator/sources.json` to `version: 2.0.0`.
- [ ] Nest sources under stable exam IDs.
- [ ] Require source URL, redirect allowlist, category, parser, trust tier, active status, provenance, refresh policy, and publication mode.
- [ ] Generate `plan/sources.md` from the JSON registry.
- [ ] Fail validation when an active exam has no valid sources.
- [ ] Match candidate URLs against the canonical JSON registry; use `plan/sources.md` only as its generated readable view.
- [ ] Permit unattended ingestion only for active Tier 1 and Tier 2 sources with an appropriate publication mode.
- [ ] Record unregistered URLs as discovery candidates without fetching or publishing them.

<!-- CHANGE COMMENT (2026-09-28): Weekly automation now trusts the approval already recorded in the source registry. It skips recurring robots, terms, and license checks for registered sources and gates processing by active status, trust tier, and publication mode. -->

### C. Source-only ingestion

- [ ] Remove Gemini/question-generation steps and secrets from the curation workflow.
- [ ] Replace `extract-ai` behavior with sourced-question extraction.
- [ ] Reject any record whose prompt, options, answer, and provenance cannot be located in its source.
- [ ] Preserve source-provided explanations only.
- [ ] Deduplicate exact and semantic matches without rewriting the retained question.
- [ ] Quarantine incomplete, conflicting, unregistered, inactive, low-trust, or unsupported records.

### D. Multi-exam browser engine

- [ ] Resolve the exam from validated Hugo page metadata.
- [ ] Support `true_false`, `single_choice`, and `multiple_choice`.
- [ ] Read duration, practice threshold, mock size, and objectives from the exam catalog.
- [ ] Version saved attempts by exam and schema version.
- [ ] Generate manifest, mock index, and domain shards from canonical question files.
- [ ] Remove duplicated JavaScript and redundant layouts.

### E. Terraform Associate content

- [ ] Register `terraform-associate` and version `004`.
- [ ] Add the official objectives `1a` through `8d`.
- [ ] Create the eight categorized study-guide sections.
- [ ] Register official HashiCorp references.
- [ ] Register community question sources with an explicit trust tier, active status, and publication mode.
- [ ] Ingest source-backed questions without inventing missing content.
- [ ] Keep the exam in `onboarding` until release gates pass.

### F. Cloudflare Worker and R2

- [ ] Configure Worker crons `30 18 * * 6` for Category A and `30 18 * * 0` for Category B.
- [ ] Authenticate `/api/v1/curate` and `/api/v1/rollback`.
- [ ] Dispatch `certification-curation` and verify the GitHub API response.
- [ ] Replace hardcoded exam status with live catalog/release status.
- [ ] Add the R2 binding for `certification-control`.
- [ ] Store only compact status, ledger, fingerprint, failure, and release-pointer objects.
- [ ] Apply the approved retention periods.
- [ ] Use GitHub Actions concurrency as the authoritative lock; use R2 as the idempotency ledger.

### G. GitHub automation

- [ ] Make the curator workflow listen for Cloudflare dispatch, GitHub schedule, and manual dispatch.
- [ ] Resolve the due schedule category from the cron or dispatch payload.
- [ ] Run only active exams assigned to the due category in a bounded matrix.
- [ ] Apply the configured timeout to each exam job.
- [ ] Make matrix jobs upload validated per-exam artifacts without committing or pushing.
- [ ] Add one promotion job that merges successful artifacts and retains previous data for failed exams.
- [ ] Create at most one canonical commit and expose its exact SHA as `release_sha`.
- [ ] Remove Pages deployment from the curator workflow.
- [ ] Add `workflow_call` and a required `release_sha` input to `deploy.yml`.
- [ ] Make `deploy.yml` check out the exact `release_sha`.
- [ ] Make `deploy.yml` validate all active exams before building.
- [ ] Generate browser data during the deployment build.
- [ ] Keep `deploy.yml` as the only workflow permitted to publish Pages.

### H. Verification and release

- [ ] Validate registry membership, active status, trust tier, publication mode, locations, hashes, types, redirects, and sizes.
- [ ] Validate question types, options, answers, objectives, provenance, and duplicates.
- [ ] Validate canonical/public counts and hashes.
- [ ] Run CCA-F regression tests.
- [ ] Run Terraform question-type and mock-exam tests.
- [ ] Run Hugo build, internal-link, rendered-page, and browser tests.
- [ ] Refuse deployment on any failed release gate.
- [ ] Update R2 status only after the Pages deployment is verified.

---

## Execution Flow

```text
SCHEDULE AND DISPATCH
  Category A: Sunday 00:00 IST (`30 18 * * 6` UTC)
  Category B: Monday 00:00 IST (`30 18 * * 0` UTC)
        |
        +--> Cloudflare Worker primary cron
        +--> GitHub scheduled fallback
        +--> Authenticated manual dispatch
        |
        v
  Resolve and validate due schedule category
        |
        v
  Check category/week R2 ledger and GitHub concurrency group
        |
        +--> Already running/completed: exit without duplicate release
        |
        v
SELECT ACTIVE EXAMS
  Load `data/exams.toml`
        |
        +--> Category A due: active Category A exams, initially CCA-F
        +--> Category B due: active Category B exams, initially Terraform Associate
        |
        v
PER-EXAM MATRIX — bounded parallel jobs
  For each selected exam:
        |
        +--> Load time budget and registered sources
        +--> Optionally discover candidate URLs
        +--> Match URL in canonical `sources.json`
        |      |
        |      +--> Unregistered: record candidate metadata only; do not fetch/publish
        |      +--> Inactive/Tier 3/blocked: skip and retain current content
        |      +--> Active Tier 1/Tier 2: apply publication mode
        |             |
        |             +--> Reference-only: retain link/status only
        |             +--> Question/document source: continue
        |
        +--> Fetch only new or changed registered content
        +--> Check URL/redirect/type/size/timeout/hash
        +--> Parse with registered adapter
        +--> Extract source-present content only
        +--> Normalize, categorize, deduplicate, validate
        |      |
        |      +--> Failed: upload failed-exam result; retain previous exam data
        |      +--> Passed: upload validated exam-update artifact
        |
        +--> Matrix jobs never commit or push
        |
        v
SINGLE PROMOTION JOB
  Download all matrix artifacts
        |
        +--> Merge successful exam updates
        +--> Retain previous data for failed/skipped exams
        +--> Run cross-exam canonical validation
        |
        +--> Validation failed: no commit; keep live release; record compact failure
        |
        +--> No canonical changes: reuse current SHA; update run status only
        |
        +--> Changes accepted: create one commit on `main`
                              capture exact `release_sha`
        |
        v
DEPLOYMENT HANDOFF
  Call reusable `deploy.yml` through `workflow_call(release_sha)`
        |
        +--> Check out exact `release_sha`
        +--> Generate browser manifests, mock indexes, and domain shards
        +--> Validate every active exam's current canonical data
        +--> Build Hugo with production Pages base URL
        +--> Run schema, link, browser, and regression tests
        |
        +--> Failed: do not deploy; previous Pages release remains live
        |
        +--> Passed: `actions/deploy-pages` publishes GitHub Pages
        |
        v
PUBLIC VERIFICATION AND STATUS
  Verify `/release.json` reports expected `release_sha`
        |
        +--> Failed: mark deployment unverified; keep last-known-good pointer
        |
        +--> Passed: update compact live/last-known-good/run status in R2
        |
        v
  End run; temporary downloads and workflow artifacts expire
```

---

## R2 Object Allowlist

Only the following object families are allowed:

```text
certification-control/releases/live.json
certification-control/releases/last-known-good.json
certification-control/exams/<exam-id>/status.json
certification-control/sources/<exam-id>/<source-id>.json
certification-control/runs/<exam-id>/<run-id>-summary.json
certification-control/quarantine/<exam-id>/<record-id>-reason.json
certification-control/ledgers/categories/<category-id>/<yyyy-week>.json
certification-control/ledgers/exams/<exam-id>/<yyyy-week>.json
```

An R2 write must be rejected if its object category is not on this allowlist.

---

## Release Acceptance Criteria

The implementation is complete only when:

- [ ] CCA-F still passes its existing regression checks.
- [ ] Terraform Associate appears in the exam catalog and navigation.
- [ ] Terraform content is grouped into all eight official domains.
- [ ] Terraform questions are traceable to registered source locations.
- [ ] No generated question exists in the database.
- [ ] The Worker successfully triggers the GitHub curation workflow.
- [ ] Duplicate scheduled events do not create duplicate releases.
- [ ] Matrix jobs cannot commit or push; exactly one promotion job owns canonical commits.
- [ ] The curator cannot deploy GitHub Pages.
- [ ] `deploy.yml` is the only production publisher.
- [ ] `deploy.yml` checks out and publishes the exact promoted `release_sha`.
- [ ] The verified public `/release.json` contains the expected `release_sha`.
- [ ] R2 contains no question, document, PDF, raw-source, website, or secret object.
- [ ] A failed exam update retains that exam's previous canonical data and cannot publish its rejected candidate.
- [ ] A successful run publishes the final result to GitHub Pages and updates compact R2 status.

---

## Estimated Change Footprint

| Change | Estimate |
|---|---:|
| Created | 51 files |
| Modified | 34 files |
| Deleted/replaced | 7 files |
| Total source-controlled changes | 92 files |
| Initial ignored browser artifacts | 17 files |

The exact number can change when the final approved Terraform question sources and source-specific adapters are known. Temporary source downloads are not counted because they are discarded after each GitHub Actions run.

---

## Final Outcome

- GitHub Pages serves the complete, validated multi-certification website.
- Cloudflare Workers schedules and coordinates the weekly agents.
- R2 stores only important compact operational information.
- GitHub remains the canonical question and documentation database.
- Terraform Associate supports its official question formats and eight objective domains.
- Every published question is traceable to an approved source.
- The system never generates questions.
- Every active exam runs in its configured weekly schedule category within its configured time budget.
- A failed update cannot replace the last valid public release.
- Future certifications require one onboarding decision; recurring maintenance is automated.
